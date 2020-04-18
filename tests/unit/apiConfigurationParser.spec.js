const apiConfigurationParser = require("../../src/apiConfigurationParser")

test("empty configuration should throw error", () => {
  expect(() => {
    apiConfigurationParser.getApiConfiguration({})
  }).toThrow()
})
