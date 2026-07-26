import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const secretsDir = path.resolve(process.cwd(), '.primeserve-secrets')
const gstinKeyFile = path.join(secretsDir, 'gstin-key.json')
const superAdminFile = path.join(secretsDir, 'super-admin.json')

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

function readSuperAdminCredentials(env) {
  try {
    const payload = JSON.parse(fs.readFileSync(superAdminFile, 'utf8'))
    return {
      email: String(payload.email || '').trim().toLowerCase(),
      password: String(payload.password || ''),
    }
  } catch {
    return {
      email: String(env.PRIMESERVE_SUPER_ADMIN_EMAIL || 'primeserve45@gmail.com').trim().toLowerCase(),
      password: String(env.PRIMESERVE_SUPER_ADMIN_PASSWORD || ''),
    }
  }
}

function writeSuperAdminCredentials(email, password) {
  fs.mkdirSync(secretsDir, { recursive: true })
  fs.writeFileSync(superAdminFile, JSON.stringify({ email, password, updatedAt: new Date().toISOString() }, null, 2))
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

function escapeHtml(value) {
  return String(value || '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character])
}

async function sendSuperAdminCredentials(req, res, env) {
  if (req.method !== 'POST') return sendJson(res, 405, { message: 'Method not allowed.' })
  try {
    const body = await readJsonRequest(req)
    const requestedEmail = String(body.email || '').trim().toLowerCase()
    const credentials = readSuperAdminCredentials(env)
    const superAdminEmail = credentials.email
    const superAdminPassword = credentials.password
    const token = String(env.MAIL_SEND_TOKEN || env.SMTP_PASSWORD || '')
    if (requestedEmail !== superAdminEmail) return sendJson(res, 403, { message: 'Credential recovery is available only for Super Admin.' })
    if (!token || !superAdminPassword) return sendJson(res, 503, { message: 'Recovery email is not configured on this server.' })
    const authorization = token.startsWith('Zoho-enczapikey ') ? token : `Zoho-enczapikey ${token}`
    const mailResponse = await fetch(env.MAIL_API_URL || 'https://api.zeptomail.in/v1.1/email', {
      method: 'POST',
      headers: { authorization, 'content-type': 'application/json' },
      body: JSON.stringify({
        from: { address: env.MAIL_FROM_ADDRESS || 'info@primeserve.in', name: env.MAIL_FROM_NAME || 'Primeserve' },
        to: [{ email_address: { address: superAdminEmail, name: 'Primeserve Super Admin' } }],
        subject: 'Primeserve CMS Super Admin credentials',
        htmlbody: `<div style="font-family:Arial,sans-serif"><h2>Primeserve CMS credentials</h2><p>User ID: <strong>${escapeHtml(superAdminEmail)}</strong></p><p>Password: <strong>${escapeHtml(superAdminPassword)}</strong></p><p>For security, sign in and update the password if this message was unexpected.</p></div>`,
      }),
      signal: AbortSignal.timeout(15000),
    })
    if (!mailResponse.ok) throw new Error('Mail delivery failed.')
    return sendJson(res, 200, { success: true, message: 'Super Admin credentials were sent to the registered email.' })
  } catch {
    return sendJson(res, 502, { message: 'Unable to send the recovery email. Please check the mail configuration.' })
  }
}

async function updateSuperAdminPassword(req, res, env) {
  if (req.method !== 'POST') return sendJson(res, 405, { message: 'Method not allowed.' })
  try {
    const body = await readJsonRequest(req)
    const credentials = readSuperAdminCredentials(env)
    const email = String(body.email || '').trim().toLowerCase()
    const currentPassword = String(body.currentPassword || '')
    const newPassword = String(body.newPassword || '')
    if (email !== credentials.email || currentPassword !== credentials.password) {
      return sendJson(res, 403, { message: 'Current Super Admin credentials are invalid.' })
    }
    if (newPassword.length < 8) {
      return sendJson(res, 400, { message: 'Password must contain at least 8 characters.' })
    }
    writeSuperAdminCredentials(credentials.email, newPassword)
    return sendJson(res, 200, { success: true, message: 'Super Admin password updated.' })
  } catch {
    return sendJson(res, 400, { message: 'Unable to update the Super Admin password.' })
  }
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
          server.middlewares.use('/api/admin/forgot-password', async (req, res) => {
            await sendSuperAdminCredentials(req, res, env)
          })
          server.middlewares.use('/api/admin/super-password', async (req, res) => {
            await updateSuperAdminPassword(req, res, env)
          })
        },
      },
    ],
  }
})
