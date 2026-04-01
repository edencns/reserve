import { createClient, Client } from '@libsql/client'

let client: Client | null = null

export function getDb(): Client {
  if (!client) {
    if (!process.env.TURSO_URL || !process.env.TURSO_TOKEN) {
      throw new Error('TURSO_URL and TURSO_TOKEN environment variables are required')
    }
    // 서버리스 환경에서 libsql:// (WebSocket) → https:// (HTTP) 자동 변환
    const url = process.env.TURSO_URL.replace(/^libsql:\/\//, 'https://')
    client = createClient({
      url,
      authToken: process.env.TURSO_TOKEN,
    })
  }
  return client
}

// Proxy: 메서드를 client에 바인딩하여 this 컨텍스트 보존
export const db = new Proxy({} as Client, {
  get(_target, prop) {
    const c = getDb()
    const value = (c as unknown as Record<string | symbol, unknown>)[prop]
    if (typeof value === 'function') {
      return (value as Function).bind(c)
    }
    return value
  },
})
