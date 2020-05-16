#! /usr/bin/env node

const strava = require("strava-v3")
const path = require("path")
const inquirer = require("inquirer")
const fs = require("fs")

const CACHE_PATH = path.join(
  process.cwd(),
  "node_modules/.cache/gatsby-source-strava"
)

const generateToken = async () => {
  console.log("Create a Strava application API at")
  console.log("https://www.strava.com/settings/api")
  console.log("")
  console.log("Copy your `Client ID` and `Client secret`")

  const {client_id, client_secret} = await inquirer.prompt([
    {
      type: "input",
      name: "client_id",
      message: "Strava Client ID:",
      validate: input => !!input,
    },
    {
      type: "input",
      name: "client_secret",
      message: "Strava Client Secret:",
      validate: input => !!input,
    },
  ])

  strava.config({
    client_id,
    client_secret,
    redirect_uri: "//localhost",
  })

  const accessUrl = await strava.oauth.getRequestAccessURL({
    scope: "activity:read_all,profile:read_all",
  })

  console.log("")
  console.log("Open the following URL in a browser")
  console.log(accessUrl)
  console.log("")
  console.log("Authorize the application")
  console.log("Copy the code from the callback URL")
  console.log("localhost/?...&code=  [_COPY_THIS_]  &...")

  const {authorization_code} = await inquirer.prompt([
    {
      type: "input",
      name: "authorization_code",
      message: "Strava Authorization Code:",
      validate: input => !!input,
    },
  ])

  try {
    const {
      access_token,
      refresh_token,
      expires_at,
      expires_in,
    } = await strava.oauth.getToken(authorization_code)
    const token = {
      client_id,
      client_secret,
      access_token,
      refresh_token,
      expires_at,
      expires_in,
    }

    if (!fs.existsSync(CACHE_PATH)) {
      fs.mkdirSync(CACHE_PATH, {recursive: true})
    }

    fs.writeFileSync(path.join(CACHE_PATH, "token.json"), JSON.stringify(token))

    console.log("")
    console.log("Token generated successfully")
    console.log("Enjoy `gatsby-source-strava` plugin")
  } catch (e) {
    console.error(e.message)
  }
}

generateToken()
