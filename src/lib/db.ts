import { createClient, Client } from '@libsql/client'

let client: Client | null = null

export function getDb(): Client {
  if (!client) {
    if (!process.env.TURSO_URL || !process.env.TURSO_TOKEN) {
      throw new Error('TURSO_URL and TURSO_TOKEN environment variables are required')
    }
    client = createClient({
      url: process.env.TURSO_URL,
      authToken: process.env.TURSO_TOKEN,
    })
  }
  return client
}

// Backward-compatible proxy so existing code using `db.execute(...)` still works
export const db = new Proxy({} as Client, {
  get(_target, prop) {
    return (getDb() as unknown as Record<string | symbol, unknown>)[prop]
  },
})
