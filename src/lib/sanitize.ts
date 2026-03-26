// XSS 방지를 위한 HTML 이스케이프
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

// 한국어 이름 검증 (특수문자 제거)
export function sanitizeName(name: string): string {
  return name.replace(/[<>'"\/\\&;]/g, '').trim()
}

// 전화번호 숫자만 추출
export function sanitizePhone(phone: string): string {
  return phone.replace(/[^0-9\-]/g, '').trim()
}

// 이메일 검증 후 소문자 변환
export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim()
}

// SQL Injection 패턴 감지 (Prisma 사용하지만 추가 보호)
export function detectSqlInjection(input: string): boolean {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/i,
    /(--|\||;|\/\*|\*\/)/,
    /(\bOR\b|\bAND\b).*[=<>]/i,
  ]
  return sqlPatterns.some(pattern => pattern.test(input))
}
