"use-strict"

const express = require("express")
const serveStatic = require("serve-static")
const history = require("connect-history-api-fallback")
const { createProxyMiddleware } = require("http-proxy-middleware")

const { getApiConfiguration } = require("./apiConfigurationParser")
const { generateProxies } = require("./proxyGenerator.js")

const UI_PORT = process.env.UI_PORT

const startStaticServer = () => {
  const apiConfig = getApiConfiguration()
  const app = express()

  const middleware = history({
    verbose: true
  })
  app.use(serveStatic(__dirname + "/dist"))
  app.use(middleware)

  let proxies = generateProxies(apiConfig)

  for (const p of proxies) {
    app.use(createProxyMiddleware(p.endpointString, p))
  }

  console.log(`App listening at port: ${UI_PORT}`)
  app.listen(UI_PORT)
}

module.exports = {
  startStaticServer
}
