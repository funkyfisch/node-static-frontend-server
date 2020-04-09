const express = require("express")
const serveStatic = require("serve-static")
const history = require("connect-history-api-fallback")
const { createProxyMiddleware } = require("http-proxy-middleware")
const UI_PORT = process.env.UI_PORT

/* The api host is what the front-end client will access during its lifecycle */
const API_HOST = process.env.API_HOST
const API_PORT = process.env.API_PORT
const API_USER = process.env.API_USER
const API_PASSWORD = process.env.API_PASSWORD

/* TODO: make the definition of the API endpoint(s) customizable using a .json
file, or another manner, and then auto-generate the endpoints and add them
to the proxy-table */

const app = express()

const middleware = history({
    verbose: true
})
app.use(serveStatic(__dirname + "/dist"))
app.use(middleware)
app.use("/api", createProxyMiddleware({
    target: `http://${API_HOST}:${API_PORT}`,
    auth: `${API_USER}:${API_PASSWORD}`,
    changeOrigin: true,
    pathRewrite: {
        "^/api" : ""
    }
}))

console.log(`App listening at port: ${UI_PORT}`)
app.listen(UI_PORT)
