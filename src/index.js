"use-strict"

const fs = require("fs")
const path = require("path")

const express = require("express")
const serveStatic = require("serve-static")
const history = require("connect-history-api-fallback")
const { createProxyMiddleware } = require("http-proxy-middleware")

const { getApiConfiguration } = require("./apiConfigurationParser")
const { generateProxies } = require("./proxyGenerator.js")

const UI_PORT = process.env.UI_PORT

const checkContentsToServe = pathToStaticContent => {
  if (!fs.existsSync(pathToStaticContent + path.sep + "index.html")) {
    throw new Error(`There is no index.html to serve under ${pathToStaticContent}`)
  }
}

const startStaticServer = (setupProxyTable, configurationFilePath) => {
  const pathToStaticContent = process.cwd() + path.sep + "dist"
  checkContentsToServe(pathToStaticContent)

  const app = express()

  const middleware = history({
    verbose: true
  })

  app.use(serveStatic(pathToStaticContent))
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
