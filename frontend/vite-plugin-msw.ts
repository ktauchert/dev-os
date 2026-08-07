import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Plugin, ViteDevServer } from 'vite'
import type { RequestHandler } from 'msw'

type MswBridge = {
  handlers: RequestHandler[]
  getResponse: (
    handlers: RequestHandler[],
    request: Request,
    resolutionContext?: { baseUrl?: string },
  ) => Promise<Response | undefined>
}

/**
 * Serve MSW handlers from the Vite Connect server (no browser service worker).
 */
export function mswDevServerPlugin(): Plugin {
  return {
    name: 'devos-msw-dev-server',
    configureServer(server) {
      if (!shouldMockOnViteServer(server)) return

      // Register synchronously so this runs before Vite's SPA HTML fallback.
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api')) {
          next()
          return
        }

        try {
          const { handlers, getResponse } = (await server.ssrLoadModule(
            '/src/mocks/vite-bridge.ts',
          )) as MswBridge

          const request = await toFetchRequest(req)
          const response = await getResponse(handlers, request, {
            // Node has no `location`; without baseUrl, `/api/...` paths never match.
            baseUrl: new URL(request.url).origin,
          })
          if (!response) {
            next()
            return
          }
          await writeFetchResponse(res, response)
        } catch (error) {
          console.error('[devos-msw]', error)
          next(error)
        }
      })
    },
  }
}

function shouldMockOnViteServer(server: ViteDevServer): boolean {
  const flag = server.config.env.VITE_MOCK_API ?? process.env.VITE_MOCK_API
  if (flag === 'false') return false
  if (flag === 'true') return true
  return server.config.mode === 'development'
}

async function toFetchRequest(req: IncomingMessage): Promise<Request> {
  const host = req.headers.host ?? 'localhost:3000'
  const url = new URL(req.url ?? '/', `http://${host}`)
  const method = (req.method ?? 'GET').toUpperCase()
  const headers = new Headers()
  for (const [key, value] of Object.entries(req.headers)) {
    if (value === undefined) continue
    if (Array.isArray(value)) {
      for (const item of value) headers.append(key, item)
    } else {
      headers.set(key, value)
    }
  }

  const canHaveBody = method !== 'GET' && method !== 'HEAD'
  const body = canHaveBody ? await readRequestBody(req) : undefined

  return new Request(url, {
    method,
    headers,
    body,
    ...(body ? ({ duplex: 'half' } as RequestInit) : {}),
  })
}

function readRequestBody(req: IncomingMessage): Promise<Buffer | undefined> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk: Buffer) => {
      chunks.push(chunk)
    })
    req.on('end', () => {
      resolve(chunks.length > 0 ? Buffer.concat(chunks) : undefined)
    })
    req.on('error', reject)
  })
}

async function writeFetchResponse(res: ServerResponse, response: Response) {
  res.statusCode = response.status
  response.headers.forEach((value, key) => {
    if (key.toLowerCase() === 'transfer-encoding') return
    res.setHeader(key, value)
  })
  res.end(Buffer.from(await response.arrayBuffer()))
}
