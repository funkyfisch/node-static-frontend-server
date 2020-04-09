#!/usr/bin/env node

"use strict"

const { startStaticServer } = require("./index")

let configurationFilePath

for (let i = 2; i < process.argv.length; i++) {
  if (
    (process.argv[i] === "-c" || process.argv[i] === "--api-config")
    && typeof(process.argv[i + 1])
  ) {
    configurationFilePath = process.argv[i + 1]
    break
  }
}

if (!configurationFilePath) throw new Error("use the -c/--api-config option to define config file")

startStaticServer(configurationFilePath)
