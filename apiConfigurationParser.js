const assert = require("assert")
const fs = require("fs")

const validateConfiguration = function(configuration) {
  const envVarRegex = RegExp(/[A-Za-z0-9_]+/g)
  const hostnameRegex = RegExp(/^(http:\/\/||https:\/\/)[A-Za-z0-9.\-_]+$/)

  assert(Array.isArray(configuration.endpoints))

  for (const endpoint of configuration.endpoints) {
    assert(
      typeof(endpoint.endpointString) === "string"
      && endpoint.endpointString.startsWith("/")
    )
    assert(
      typeof(endpoint.host) === "string"
      && envVarRegex.test(endpoint.host)
      && hostnameRegex.test(process.env[endpoint.host])
    )
    assert(
      typeof(endpoint.port) === "string"
    )
    if (endpoint.authentication === true) {
      assert(
        typeof(endpoint.username) === "string"
        && envVarRegex.test(endpoint.username)
        && typeof(process.env[endpoint.username] === "string")
        && process.env[endpoint.username].length > 0
      )
      assert(
        typeof(endpoint.password) === "string"
        && envVarRegex.test(endpoint.password)
        && typeof(process.env[endpoint.password] === "string")
        && process.env[endpoint.password].length > 0
      )

      const requiredProperties = [
        "endpointString",
        "host",
        "port",
        "authentication",
        "username",
        "password"
      ].sort()
      const actualProperties = Object.keys(endpoint).sort()
      assert(
        requiredProperties.length === actualProperties.length
        && actualProperties.every((element, index) => element === actualProperties[index])
      )
    } else {
      const requiredProperties = [
        "endpointString",
        "host",
        "port",
        "authentication",
      ].sort()
      const actualProperties = Object.keys(endpoint).sort()
      assert(
        requiredProperties.length === actualProperties.length
        && actualProperties.every((element, index) => element === actualProperties[index])
      )
    }
  }
}

const getApiConfiguration = function() {
  const config = JSON.parse(fs.readFileSync("apiConfiguration.json"))
  validateConfiguration(config)
  return config
}

module.exports = {
  getApiConfiguration
}
