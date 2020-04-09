const fs = require("fs")
const express = require("express")
const serveStatic = require("serve-static")
const history = require("connect-history-api-fallback")
const { createProxyMiddleware } = require("http-proxy-middleware")
const UI_PORT = process.env.UI_PORT

let apiConfig
try {
  apiConfig = fs.readFileSync("apiConfiguration.json")
  apiConfig = JSON.parse(apiConfig)
} catch (error) {
  throw new Error("Please create a valid configuration file for your APIs")
}

const app = express()

const middleware = history({
  verbose: true
})
app.use(serveStatic(__dirname + "/dist"))
app.use(middleware)

/* That's good and all, but we have to store Usernames and passwords in a
json file. What we would really like is to map each api endpoint defined in the
json file into environment variable strings and then evaluate them here,
so that all this deployment dependent configuration can be defined in the
environment instead of a file */
for (const endpoint of apiConfig.endpoints) {
  const regexEndpointString = `^${endpoint.endpointString}`

  let proxy = {
    target: `${endpoint.host}:${endpoint.port}`,
    changeOrigin: true,
    pathRewrite: {
      [regexEndpointString]: ""
    }
  }
  if (endpoint.authentication === true) {
    proxy.auth = `${endpoint.user}:${endpoint.password}`
  }

  app.use([endpoint.endpointString], createProxyMiddleware(proxy))
}

console.log(`App listening at port: ${UI_PORT}`)
app.listen(UI_PORT)
