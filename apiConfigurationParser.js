const assert = require("assert")
const fs = require("fs")

const validateConfiguration = function(configuration) {
  const envVarRegex = RegExp(/^[A-Za-z0-9_]+$/)
  const hostnameRegex = RegExp(/^(http:\/\/||https:\/\/){0,1}[A-Za-z0-9.\-_]+$/)

  assert(Array.isArray(configuration.endpoints))

  for (const endpoint of configuration.endpoints) {
    assert(
      typeof(endpoint.endpointString) === "string"
      && endpoint.endpointString.startsWith("/")
    )
    assert(
      // this checks if the variable is defined in the configuration
      typeof(endpoint.host) === "string"
      // this checks if it has a proper variable name
      && envVarRegex.test(endpoint.host)
      // this checks if it is defined in environment
      && typeof(process.env[endpoint.host]) === "string"
      // this checks if it is a proper hostname value
      && hostnameRegex.test(process.env[endpoint.host])
    )
    assert(
      typeof(endpoint.port) === "string"
      && envVarRegex.test(endpoint.port)
      && typeof(process.env[endpoint.port]) === "string"
      && parseInt(process.env[endpoint.port]) > 0
      && parseInt(process.env[endpoint.port]) < 65535
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
