import fs from 'node:fs'
import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const secretsDir = path.resolve(process.cwd(), '.primeserve-secrets')
const gstinKeyFile = path.join(secretsDir, 'gstin-key.json')

function readLocalGstinKey() {
  try {
    const payload = JSON.parse(fs.readFileSync(gstinKeyFile, 'utf8'))
    return payload.apiKey || ''
  } catch {
    return ''
  }
}

function writeLocalGstinKey(apiKey) {
  fs.mkdirSync(secretsDir, { recursive: true })
  fs.writeFileSync(gstinKeyFile, JSON.stringify({ apiKey, updatedAt: new Date().toISOString() }, null, 2))
}

function readJsonRequest(req) {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk
    })
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {})
      } catch (error) {
        reject(error)
      }
    })
    req.on('error', reject)
  })
}

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(payload))
}

function getGstinFromRequest(req) {
  const requestUrl = new URL(req.url || '', 'http://localhost')
  return String(requestUrl.searchParams.get('gstin') || '').trim().toUpperCase()
}

async function handleLocalGstinLookup(req, res, env) {
  if (req.method !== 'GET') {
    sendJson(res, 405, { error: 'Method not allowed.' })
    return
  }

  const gstin = getGstinFromRequest(req)
  if (!gstin) {
    sendJson(res, 400, { error: 'GSTIN is required.' })
    return
  }

  const apiKey = env.PRIMESERVE_GSTIN_API_KEY || readLocalGstinKey()
  if (!apiKey) {
    sendJson(res, 400, { error: 'GSTIN API key is not configured. Please save it in Admin > Website Settings.' })
    return
  }

  try {
    const apiUrl = `https://api.primeserve.in/commonapi/v1.1/search?gstin=${encodeURIComponent(gstin)}&action=TP`
    const apiResponse = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        Apikey: apiKey,
      },
    })
    const contentType = apiResponse.headers.get('content-type') || 'application/json'
    const rawText = await apiResponse.text()
    res.statusCode = apiResponse.status
    res.setHeader('Content-Type', contentType)
    res.end(rawText)
  } catch (error) {
    sendJson(res, 502, { error: error?.message || 'Unable to connect to GSTIN API.' })
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      {
        name: 'primeserve-local-gstin-secret',
        configureServer(server) {
          server.middlewares.use('/api/gstin-validator.php', async (req, res) => {
            await handleLocalGstinLookup(req, res, env)
          })

          server.middlewares.use('/api/gstin-search.php', async (req, res) => {
            await handleLocalGstinLookup(req, res, env)
          })

          server.middlewares.use('/api/gstin-key.php', async (req, res) => {
            if (req.method === 'OPTIONS') {
              res.statusCode = 204
              res.end()
              return
            }
            if (req.method !== 'POST') {
                sendJson(res, 405, { error: 'Method not allowed.' })
                return
              }

            try {
              const body = await readJsonRequest(req)
              const apiKey = String(body.apiKey || '').trim()
              const adminSecret = String(body.adminSecret || '').trim()
              const requiredSecret = env.PRIMESERVE_ADMIN_API_SECRET || ''

              if (requiredSecret && adminSecret !== requiredSecret) {
                sendJson(res, 403, { error: 'Invalid admin update secret.' })
                return
              }

              if (!apiKey || apiKey.length < 16) {
                sendJson(res, 400, { error: 'Please provide a valid GSTIN API key.' })
                return
              }

              writeLocalGstinKey(apiKey)
              sendJson(res, 200, { success: true, message: 'GSTIN API key updated securely.' })
            } catch {
              sendJson(res, 400, { error: 'Invalid request body.' })
            }
          })
        },
      },
    ],
  }
})
