import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

export const loadEnvLocal = (): void => {
  const envPath = resolve(process.cwd(), '.env.local')

  if (!existsSync(envPath)) {
    return
  }

  const file = readFileSync(envPath, 'utf8')
  const rows = file.split(/\r?\n/)

  for (const row of rows) {
    const line = row.trim()

    if (!line || line.startsWith('#')) {
      continue
    }

    const separatorIndex = line.indexOf('=')

    if (separatorIndex <= 0) {
      continue
    }

    const key = line.slice(0, separatorIndex).trim()
    const value = line.slice(separatorIndex + 1).trim()

    if (!process.env[key]) {
      process.env[key] = value
    }
  }
}
