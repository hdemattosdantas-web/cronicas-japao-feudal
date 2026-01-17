const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = parseInt(process.env.PORT, 10) || 3000

// Initialize Next.js
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true)
    handle(req, res, parsedUrl)
  })

  // Initialize Socket.IO (only if available)
  try {
    const { initSocketServer } = require('./lib/websockets/socket-server')
    const io = initSocketServer(server)
    console.log(`> WebSocket server initialized`)
  } catch (error) {
    console.warn(`> WebSocket server not available: ${error.message}`)
    console.log(`> Running without WebSocket support`)
  }

  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://${hostname}:${port}`)
    console.log(`> WebSocket server initialized`)
  })
}).catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
})