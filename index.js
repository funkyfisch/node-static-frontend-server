const fs = require("fs")
const express = require("express")
const serveStatic = require("serve-static")
const history = require("connect-history-api-fallback")
const { createProxyMiddleware } = require("http-proxy-middleware")
const UI_PORT = process.env.UI_PORT

const apiConfig = JSON.parse(fs.readFileSync("apiConfiguration.json"))

const app = express()

const middleware = history({
  verbose: true
})
app.use(serveStatic(__dirname + "/dist"))
app.use(middleware)

/* Find way to configure http vs https */
for (const endpoint of apiConfig.endpoints) {
  const regexEndpointString = `^${endpoint.endpointString}`

  let proxy = {
    target: `${process.env[endpoint.host]}:${process.env[endpoint.port]}`,
    changeOrigin: true,
    pathRewrite: {
      [regexEndpointString]: ""
    }
  }
  if (endpoint.authentication === true) {
    proxy.auth = `${process.env[endpoint.username]}:${process.env[endpoint.password]}`
  }

  app.use(createProxyMiddleware(`${endpoint.endpointString}`, proxy))
}

console.log(`App listening at port: ${UI_PORT}`)
app.listen(UI_PORT)
