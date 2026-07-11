import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

function validCPF(base: string): string {
  const d = base.replace(/\D/g, "").padEnd(11, "0")
  const calc = (mul: number) => {
    let sum = 0
    for (let i = 0; i < mul - 1; i++) sum += parseInt(d[i]) * (mul - i)
    const rest = (sum * 10) % 11
    return rest === 10 ? 0 : rest
  }
  const dig1 = calc(10)
  const dig2 = calc(11)
  return d.substring(0, 9) + dig1 + dig2
}

const prisma = new PrismaClient()

async function main() {
  const adminPassword = await hash("admin123", 12)
  const producerPassword = await hash("produtor123", 12)
  const userPassword = await hash("user123", 12)

  const admin = await prisma.user.upsert({
    where: { email: "admin@infoplatform.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@infoplatform.com",
      cpf: validCPF("111222333"),
      password: adminPassword,
      role: "admin",
    },
  })
  console.log("Admin: admin@infoplatform.com / admin123")

  const producer = await prisma.user.upsert({
    where: { email: "produtor@teste.com" },
    update: {},
    create: {
      name: "Carlos Produtor",
      email: "produtor@teste.com",
      cpf: validCPF("222333444"),
      password: producerPassword,
      role: "producer",
      producerName: "Academy Digital",
      producerBio: "Especialista em marketing digital e vendas online",
    },
  })
  console.log("Produtor: produtor@teste.com / produtor123")

  const producer2 = await prisma.user.upsert({
    where: { email: "produtor2@teste.com" },
    update: {},
    create: {
      name: "Maria Cursos",
      email: "produtor2@teste.com",
      cpf: validCPF("333444555"),
      password: producerPassword,
      role: "producer",
      producerName: "Maria Cursos Online",
      producerBio: "Professora de tecnologia e programação",
    },
  })
  console.log("Produtor 2: produtor2@teste.com / produtor123")

  const affiliate = await prisma.user.upsert({
    where: { email: "afiliado@teste.com" },
    update: {},
    create: {
      name: "João Afiliado",
      email: "afiliado@teste.com",
      cpf: validCPF("444555666"),
      password: userPassword,
      role: "user",
    },
  })
  console.log("Afiliado: afiliado@teste.com / user123")

  await prisma.affiliate.upsert({
    where: { userId: affiliate.id },
    update: {},
    create: {
      userId: affiliate.id,
      referralCode: "JOAO10",
      commissionRate: 15.0,
    },
  })
  console.log("Perfil de afiliado criado para João")

  await prisma.user.upsert({
    where: { email: "user@teste.com" },
    update: {},
    create: {
      name: "Usuário Teste",
      email: "user@teste.com",
      cpf: validCPF("555666777"),
      password: userPassword,
      role: "user",
    },
  })
  console.log("Comprador: user@teste.com / user123")

  const productsData = [
    {
      title: "Curso Completo de Marketing Digital",
      description: "Estratégias avançadas de marketing digital, SEO, tráfego pago e criação de conteúdo.",
      price: 197.00, comparePrice: 397.00, contentType: "video", productType: "course",
      category: "Marketing", tags: "marketing, vendas, seo", published: true,
      targetAudience: "Iniciantes e profissionais que querem dominar o marketing digital",
      requirements: "Conhecimento básico de internet",
      highlights: "Acesso vitalício\nCertificado de conclusão\nSuporte 1:1\nAtualizações mensais",
      slug: "curso-marketing-digital", installments: 12,
      producerId: producer.id,
    },
    {
      title: "E-book: Segredos do Copywriting",
      description: "Técnicas de copywriting que transformam textos em máquinas de vendas.",
      price: 47.00, comparePrice: 97.00, contentType: "file", productType: "ebook",
      category: "Vendas", tags: "copywriting, vendas, textos", published: true,
      slug: "ebook-copywriting", installments: 1,
      producerId: producer.id,
    },
    {
      title: "Mentoria de Negócios Digitais",
      description: "Acompanhamento mensal com mentor especializado. Inclui 4 sessões ao vivo.",
      price: 497.00, comparePrice: null, contentType: "link", productType: "coaching",
      category: "Negócios", tags: "mentoria, negócios, digital", published: true,
      slug: "mentoria-negocios-digitais", installments: 12,
      producerId: producer.id,
    },
    {
      title: "Curso de Programação Web Full Stack",
      description: "React, Node.js, TypeScript e bancos de dados. Do zero ao profissional.",
      price: 297.00, comparePrice: 597.00, contentType: "video", productType: "course",
      category: "Programação", tags: "react, node, typescript, fullstack", published: true,
      highlights: "Mais de 200 aulas\nProjetos reais\nCertificado\ngrupo exclusivo",
      slug: "curso-fullstack", installments: 12,
      producerId: producer2.id,
    },
    {
      title: "E-book: Algoritmos e Estruturas de Dados",
      description: "Domine os fundamentos da computação com exemplos práticos em JavaScript.",
      price: 37.00, comparePrice: 67.00, contentType: "file", productType: "ebook",
      category: "Programação", tags: "algoritmos, javascript, computação", published: true,
      slug: "ebook-algoritmos", installments: 1,
      producerId: producer2.id,
    },
    {
      title: "Pacote Completo de Design Gráfico",
      description: "Photoshop, Illustrator, Figma e Canva. Mais de 200 aulas.",
      price: 147.00, comparePrice: 297.00, contentType: "video", productType: "course",
      category: "Design", tags: "design, photoshop, figma, canva", published: true,
      highlights: "4 ferramentas em 1\nProjetos práticos\nCertificado",
      slug: "pacote-design", installments: 6,
      producerId: producer.id,
    },
  ]

  for (const product of productsData) {
    await prisma.product.create({ data: product })
  }
  console.log(`${productsData.length} produtos de exemplo criados!`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
