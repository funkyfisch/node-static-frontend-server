"use-strict"

/* Find way to configure http vs https */
const generateProxies = apiConfig => {
  let proxies = []
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

    proxy.endpointString = endpoint.endpointString
    proxies.push(proxy)
  }
  return proxies
}

module.exports = {
  generateProxies
}
