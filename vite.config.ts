import fs from 'node:fs'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const certPath = fileURLToPath(new URL('./.certs/day-painter.pem', import.meta.url))
const keyPath = fileURLToPath(new URL('./.certs/day-painter-key.pem', import.meta.url))
const hasLocalCertificate = fs.existsSync(certPath) && fs.existsSync(keyPath)
const localHttps = hasLocalCertificate
  ? {
      cert: fs.readFileSync(certPath),
      key: fs.readFileSync(keyPath)
    }
  : undefined

export default defineConfig({
  plugins: [react()],
  preview: {
    https: localHttps
  },
  server: {
    https: localHttps
  }
})
