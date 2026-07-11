Write-Host "=== INICIANDO TESTES DOS FLUXOS ==="
Write-Host ""

# Wait for server
Start-Sleep -Seconds 5

# Helper function
function Get-SessionToken($loginResponse) {
    $cookies = $loginResponse.Headers.'Set-Cookie'
    if ($cookies) {
        $match = [regex]::Match($cookies, 'next-auth.session-token=([^;]+)')
        if ($match.Success) {
            return $match.Groups[1].Value
        }
    }
    return ""
}

# ===== TEST 1: Register Producer =====
try {
    $body = @{name="Produtor Teste"; email="test@produtor.com"; password="123456"; role="producer"; producerName="Loja Teste"; producerBio="Teste"} | ConvertTo-Json
    $r = Invoke-RestMethod -Uri "http://localhost:3000/api/register" -Method Post -Body $body -ContentType "application/json"
    Write-Host "✅ 1. Produtor cadastrado: $($r.email)" -ForegroundColor Green
} catch {
    Write-Host "❌ 1. Falha cadastro produtor: $_" -ForegroundColor Red
}

# ===== TEST 2: Login Producer =====
try {
    $login = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/callback/credentials" -Method Post -Body @{email="test@produtor.com"; password="123456"} | ConvertTo-Json -ContentType "application/json" -SessionVariable sess
    $token = Get-SessionToken($login)
    if ($token) { Write-Host "✅ 2. Login produtor OK" -ForegroundColor Green }
    else { Write-Host "❌ 2. Falha login produtor" -ForegroundColor Red }
} catch {
    Write-Host "❌ 2. Falha login produtor: $_" -ForegroundColor Red
    $token = ""
}

# ===== TEST 3: Create Product =====
if ($token) {
    try {
        $headers = @{Cookie = "next-auth.session-token=$token"}
        $body = @{title="Curso Teste Automático"; description="Testando fluxo completo da plataforma"; price="99.90"; published=$true} | ConvertTo-Json
        $r = Invoke-RestMethod -Uri "http://localhost:3000/api/producer/products" -Method Post -Body $body -ContentType "application/json" -Headers $headers
        Write-Host "✅ 3. Produto criado: $($r.title) (R$ $($r.price))" -ForegroundColor Green
        $global:prodId = $r.id
    } catch {
        Write-Host "❌ 3. Falha criar produto: $_" -ForegroundColor Red
    }
}

# ===== TEST 4: List Products =====
if ($token) {
    try {
        $headers = @{Cookie = "next-auth.session-token=$token"}
        $r = Invoke-RestMethod -Uri "http://localhost:3000/api/producer/products" -Method Get -Headers $headers
        Write-Host "✅ 4. Meus produtos: $($r.Count) produto(s)" -ForegroundColor Green
    } catch {
        Write-Host "❌ 4. Falha listar produtos: $_" -ForegroundColor Red
    }
}

# ===== TEST 5: Public Products =====
try {
    $r = Invoke-RestMethod -Uri "http://localhost:3000/api/products" -Method Get
    Write-Host "✅ 5. Produtos públicos: $($r.Count) disponíveis" -ForegroundColor Green
    if ($r.Count -gt 0 -and -not $global:prodId) { $global:prodId = $r[0].id }
} catch {
    Write-Host "❌ 5. Falha produtos públicos: $_" -ForegroundColor Red
}

# ===== TEST 6: Register Buyer =====
try {
    $body = @{name="Comprador Teste"; email="buyer@test.com"; password="123456"; role="user"} | ConvertTo-Json
    $r = Invoke-RestMethod -Uri "http://localhost:3000/api/register" -Method Post -Body $body -ContentType "application/json"
    Write-Host "✅ 6. Comprador cadastrado: $($r.email)" -ForegroundColor Green
} catch {
    Write-Host "❌ 6. Falha cadastro comprador: $_" -ForegroundColor Red
}

# ===== TEST 7: Register Affiliate =====
try {
    $body = @{name="Afiliado Teste"; email="aff@test.com"; password="123456"; role="affiliate"} | ConvertTo-Json
    $r = Invoke-RestMethod -Uri "http://localhost:3000/api/register" -Method Post -Body $body -ContentType "application/json"
    Write-Host "✅ 7. Afiliado cadastrado: $($r.email)" -ForegroundColor Green
} catch {
    Write-Host "❌ 7. Falha cadastro afiliado: $_" -ForegroundColor Red
}

# ===== TEST 8: Login Affiliate =====
try {
    $login = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/callback/credentials" -Method Post -Body @{email="aff@test.com"; password="123456"} | ConvertTo-Json -ContentType "application/json"
    $affToken = Get-SessionToken($login)
    if ($affToken) { Write-Host "✅ 8. Login afiliado OK" -ForegroundColor Green }
    else { Write-Host "❌ 8. Falha login afiliado" -ForegroundColor Red; $affToken = "" }
} catch {
    Write-Host "❌ 8. Falha login afiliado: $_" -ForegroundColor Red
    $affToken = ""
}

# ===== TEST 9: Get Affiliate Links =====
if ($affToken) {
    try {
        $affHeaders = @{Cookie = "next-auth.session-token=$affToken"}
        $r = Invoke-RestMethod -Uri "http://localhost:3000/api/affiliate/link" -Method Get -Headers $affHeaders
        Write-Host "✅ 9. Links de afiliado: $($r.links.Count) link(s), código: $($r.referralCode)" -ForegroundColor Green
        $global:refCode = $r.referralCode
    } catch {
        Write-Host "❌ 9. Falha links afiliado: $_" -ForegroundColor Red
    }
}

# ===== TEST 10: Stripe Checkout =====
if ($global:prodId) {
    try {
        $login = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/callback/credentials" -Method Post -Body @{email="buyer@test.com"; password="123456"} | ConvertTo-Json -ContentType "application/json"
        $buyerToken = Get-SessionToken($login)
        if ($buyerToken) {
            $buyerHeaders = @{Cookie = "next-auth.session-token=$buyerToken"}
            $body = @{productId=$global:prodId; ref=$global:refCode} | ConvertTo-Json
            $checkout = Invoke-RestMethod -Uri "http://localhost:3000/api/checkout" -Method Post -Body $body -ContentType "application/json" -Headers $buyerHeaders
            if ($checkout.url) { Write-Host "✅ 10. Checkout gerou URL do Stripe" -ForegroundColor Green }
        } else { Write-Host "❌ 10. Falha login comprador" -ForegroundColor Red }
    } catch {
        Write-Host "⚠️ 10. Checkout (Stripe precisa estar configurado): $_" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "=== TESTES CONCLUÍDOS ==="
