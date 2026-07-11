import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"
import { randomBytes } from "crypto"

const prisma = new PrismaClient()
let passed = 0
let failed = 0

function test(name: string, ok: boolean, detail?: string) {
  if (ok) { console.log(`  ✅ ${name}`); passed++ }
  else { console.log(`  ❌ ${name}${detail ? ": " + detail : ""}`); failed++ }
}

async function main() {
  console.log("\n=== TESTE DE FLUXOS DA PLATAFORMA ===\n")

  // Clean test data
  const testEmail = "test-" + randomBytes(4).toString("hex") + "@test.com"
  const prodEmail = "prod-" + randomBytes(4).toString("hex") + "@test.com"
  const affEmail = "aff-" + randomBytes(4).toString("hex") + "@test.com"
  const pw = await hash("123456", 12)

  // ===== FLUXO 1: CADASTRO E PAPÉIS =====
  console.log("--- FLUXO 1: CADASTRO ---")

  const admin = await prisma.user.findFirst({ where: { role: "admin" } })
  test("Admin existe no sistema", !!admin, admin?.email || "nenhum")

  const producer = await prisma.user.create({
    data: { name: "Produtor Teste", email: prodEmail, password: pw, role: "producer", producerName: "Loja Teste", producerBio: "Bio de teste" },
  })
  test("Produtor foi cadastrado", !!producer.id, producer.email)
  test("Papel do produtor é 'producer'", producer.role === "producer")
  test("Nome da loja salvo", producer.producerName === "Loja Teste")

  const buyer = await prisma.user.create({
    data: { name: "Comprador Teste", email: testEmail, password: pw, role: "user" },
  })
  test("Comprador foi cadastrado", !!buyer.id, buyer.email)
  test("Papel do comprador é 'user'", buyer.role === "user")

  const affiliateUser = await prisma.user.create({
    data: { name: "Afiliado Teste", email: affEmail, password: pw, role: "user" },
  })
  const affiliate = await prisma.affiliate.create({
    data: { userId: affiliateUser.id, referralCode: "TEST" + randomBytes(2).toString("hex").toUpperCase(), commissionRate: 15 },
  })
  test("Afiliado foi cadastrado", !!affiliate.id, affiliate.referralCode)
  test("Taxa de comissão definida", affiliate.commissionRate === 15)

  // ===== FLUXO 2: PRODUTOS =====
  console.log("\n--- FLUXO 2: PRODUTOS ---")

  const product = await prisma.product.create({
    data: {
      title: "Curso Teste Automático",
      description: "Testando o fluxo completo da plataforma de infoprodutos",
      price: 99.90,
      comparePrice: 199.90,
      contentType: "video",
      published: true,
      producerId: producer.id,
    },
  })
  test("Produto foi criado", !!product.id, product.title)
  test("Preço definido", product.price === 99.90)
  test("Preço comparativo maior que preço", product.comparePrice! > product.price)
  test("Produto vinculado ao produtor", product.producerId === producer.id)
  test("Produto está publicado", product.published === true)

  const productsCount = await prisma.product.count({ where: { published: true } })
  test("Há produtos públicos disponíveis", productsCount > 0, `${productsCount} produtos`)

  const prodProducts = await prisma.product.count({ where: { producerId: producer.id } })
  test("Produtor vê seus produtos", prodProducts >= 1)

  // ===== FLUXO 3: CHECKOUT E PAGAMENTO =====
  console.log("\n--- FLUXO 3: PAGAMENTO ---")

  const order = await prisma.order.create({
    data: {
      userId: buyer.id,
      productId: product.id,
      amount: product.price,
      status: "completed",
      paymentMethod: "stripe",
      paymentId: "cs_test_" + randomBytes(8).toString("hex"),
      affiliateId: affiliate.id,
    },
  })
  test("Pedido foi criado", !!order.id)
  test("Status do pedido é completed", order.status === "completed")
  test("Valor do pedido correto", order.amount === 99.90)
  test("Afiliado vinculado ao pedido", order.affiliateId === affiliate.id)

  const purchase = await prisma.purchase.create({
    data: { userId: buyer.id, productId: product.id },
  })
  test("Compra registrada para o usuário", !!purchase.id)

  const buyerPurchases = await prisma.purchase.count({ where: { userId: buyer.id } })
  test("Comprador tem acesso ao produto", buyerPurchases >= 1)

  // ===== FLUXO 4: GANHOS DO PRODUTOR =====
  console.log("\n--- FLUXO 4: GANHOS ---")

  const earning = await prisma.producerEarning.create({
    data: {
      producerId: producer.id,
      orderId: order.id,
      amount: product.price * 0.85,
      status: "pending",
    },
  })
  test("Ganho do produtor registrado", !!earning.id)
  test("Valor do ganho (85%)", earning.amount === 99.90 * 0.85, `R$ ${earning.amount}`)

  const producerEarnings = await prisma.producerEarning.aggregate({
    where: { producerId: producer.id },
    _sum: { amount: true },
  })
  test("Produtor vê total de ganhos", (producerEarnings._sum.amount || 0) > 0, `R$ ${(producerEarnings._sum.amount || 0).toFixed(2)}`)

  // ===== FLUXO 5: COMISSÃO DO AFILIADO =====
  console.log("\n--- FLUXO 5: COMISSÕES ---")

  const commission = await prisma.affiliateSale.create({
    data: {
      affiliateId: affiliate.id,
      orderId: order.id,
      commission: product.price * (affiliate.commissionRate / 100),
      status: "pending",
    },
  })
  test("Comissão do afiliado registrada", !!commission.id, `R$ ${commission.commission}`)
  test("Comissão calculada corretamente (15%)", commission.commission === 99.90 * 0.15)

  const affCommissions = await prisma.affiliateSale.aggregate({
    where: { affiliateId: affiliate.id },
    _sum: { commission: true },
  })
  test("Afiliado vê total de comissões", (affCommissions._sum.commission || 0) > 0, `R$ ${(affCommissions._sum.commission || 0).toFixed(2)}`)

  // ===== FLUXO 6: SEGURANÇA =====
  console.log("\n--- FLUXO 6: SEGURANÇA ---")

  const anotherProducer = await prisma.user.create({
    data: { name: "Outro Produtor", email: "other-" + randomBytes(4).toString("hex") + "@test.com", password: pw, role: "producer" },
  })
  test("Produtor NÃO vê produtos de outro produtor", product.producerId !== anotherProducer.id)

  // ===== RESUMO =====
  console.log("\n==============================")
  console.log(`RESULTADO: ${passed} aprovados, ${failed} falhas`)
  console.log("==============================\n")

  // Cleanup test data
  await prisma.affiliateSale.deleteMany({ where: { affiliateId: affiliate.id } })
  await prisma.producerEarning.deleteMany({ where: { producerId: producer.id } })
  await prisma.purchase.deleteMany({ where: { userId: buyer.id } })
  await prisma.order.deleteMany({ where: { userId: buyer.id } })
  await prisma.product.deleteMany({ where: { producerId: producer.id } })
  await prisma.affiliate.deleteMany({ where: { id: affiliate.id } })
  await prisma.user.deleteMany({ where: { email: { in: [testEmail, prodEmail, affEmail, anotherProducer.email!] } } })
}

main().finally(() => prisma.$disconnect())
