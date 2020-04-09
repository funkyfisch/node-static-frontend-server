const express = require("express")
const serveStatic = require("serve-static")
const history = require("connect-history-api-fallback")
const { createProxyMiddleware } = require("http-proxy-middleware")
const UI_PORT = process.env.UI_PORT
const { getApiConfiguration } = require("./apiConfigurationParser")

const apiConfig = getApiConfiguration()

const app = express()

const middleware = history({
  verbose: true
})
app.use(serveStatic(__dirname + "/dist"))
app.use(middleware)

/* Find way to configure http vs https */
for (const endpoint of apiConfig.endpoints) {
  const regexEndpointString = `^${endpoint.endpointString}`

  let trueHost
  if (
    !process.env[endpoint.host].startsWith("https://")
    && !process.env[endpoint.host].startsWith("http://")
  ) {
    trueHost = `http://${process.env[endpoint.host]}`
  } else {
    trueHost = process.env[endpoint.host]
  }

  let proxy = {
    target: `${trueHost}:${process.env[endpoint.port]}`,
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
