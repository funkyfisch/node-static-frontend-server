module.exports = {
  verbose: true,
  moduleFileExtensions: ["js"],
  transformIgnorePatterns: ["/node_modules/"],
  testMatch: [
    "**/tests/unit/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)"
  ],
  testURL: "http://localhost/"
}
