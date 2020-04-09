"use-strict"

const express = require("express")
const serveStatic = require("serve-static")
const history = require("connect-history-api-fallback")
const { createProxyMiddleware } = require("http-proxy-middleware")

const { getApiConfiguration } = require("./apiConfigurationParser")
const { generateProxies } = require("./proxyGenerator.js")

const UI_PORT = process.env.UI_PORT

const startStaticServer = (setupProxyTable, configurationFilePath) => {
  const app = express()

  const middleware = history({
    verbose: true
  })
  app.use(serveStatic(process.cwd() + "/dist"))
  app.use(middleware)

  if (setupProxyTable) {
    const apiConfig = getApiConfiguration(configurationFilePath)
    let proxies = generateProxies(apiConfig)

    for (const p of proxies) {
      app.use(createProxyMiddleware(p.endpointString, p))
    }
  }

  console.log(`App listening at port: ${UI_PORT}`)
  app.listen(UI_PORT)
}

module.exports = {
  startStaticServer
}
