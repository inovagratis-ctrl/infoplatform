export function isValidCPF(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, "")
  if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) return false

  const calc = (mul: number) => {
    let sum = 0
    for (let i = 0; i < mul - 1; i++) sum += parseInt(digits[i]) * (mul - i)
    const rest = (sum * 10) % 11
    return rest === 10 ? 0 : rest
  }

  return calc(10) === parseInt(digits[9]) && calc(11) === parseInt(digits[10])
}

export function formatCPF(cpf: string): string {
  const d = cpf.replace(/\D/g, "")
  return d.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4")
}
