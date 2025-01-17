import express from 'express'
import next from 'next'

let portString = process.env.PORT
const port = Number(portString) + 1 || 5001
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()
  server.use((req, res, next) => {
    if (dev || req.headers['x-forwarded-proto'] === 'https') {
      next()
    } else {
      res.redirect(301, `https://${req.hostname}${req.originalUrl}`)
    }
  })
  
  server.all('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
}).catch(error => {
  console.error(error)
  process.exit(1)
})
