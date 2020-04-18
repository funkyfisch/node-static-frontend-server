# node-static-frontend-server

A template parametric static server, for serving your built &amp; minified frontend app files

[![funkyfisch](https://circleci.com/gh/circleci/circleci-docs.svg?style=shield)](https://app.circleci.com/pipelines/github/funkyfisch/node-static-frontend-server?branch=master)
[![npm](https://img.shields.io/npm/v/static-frontend-server)](https://www.npmjs.com/package/static-frontend-server)

## Description

Let's say you have a directory /dist where all your built and minified front-end files live in.
This CLI will serve those files, acting as an HTTP(S) server. You can essentially deploy your
front-end application using this single command
The big plus is that you can define all your proxies, like your backend APIs, database instances etc
inside a .json file, linking them to environment variables and this tool will automatically set up
a proxy table for them and have your app talk to these endpoints.

## Installation

```bash
npm install -g static-frontend-server
```

## Example Usage

In this example we have a VueJS front-end app that talks to a REST API and a CouchDB database.
It uses:

- the "/api" alias when making requests to the REST API without any authentication
- the "/db" alias when making direct requests to the CouchDB instance, with specific authentication

By following the [twelve-factor application standard](https://12factor.net/config),
you should be exporting all the deployment specific variables in your environment.

In this case, your environment would look something like this:
API_HOST="http://your-api-hostname"
API_PORT=8080
COUCHDB_HOST="couchdb-01"
COUCHDB_PORT=5984
COUCHDB_USER="admin"
COUCHDB_PASSWORD="password"

In order for the server to create proxy tables that will know where to redirect all traffic for
"/api" requests and "/db" requests, you can define a json file that will look like this:

```json
{
  "endpoints": [
    {
      "endpointString": "/api",
      "host": "API_HOST",
      "port": "API_PORT",
      "authentication": false
    },
    {
      "endpointString": "/db",
      "host": "COUCHDB_HOST",
      "port": "COUCHDB_PORT",
      "authentication": true,
      "username": "COUCHDB_USER",
      "password": "COUCHDB_PASSWORD"
    }
  ]
}
```

You also have to provide the port at which this server will be listening

```bash
export UI_PORT=9001
```

Finally, inside the directory where your /dist folder lives, run the following:

```bash
static-frontend-server -c your-config-file.json
```

This tool will read the above configuration file,
evaluate the environment variables that you reference,
create the two proxy definitions
and finally will serve your built Vue files at the defined UI_PORT

## TODOs

- Handle http vs https
- add tests
- add proper output for the different errors
- add ability to read the serving port from command line and override the env variable UI_PORT
- add CI and packaging ability for standalone binary
- check presence of dist folder and its contents
- add ability to not use a config file if no proxies are needed
- add ability to select location of /dist folder
