import Server from "gas-client"

const {PORT} = process.env

const server = new Server({
  allowedDevelopmentDomains: `https://localhost:${PORT}`,
})

const {serverFunctions} = server
const googleAppsScript = serverFunctions

export default googleAppsScript
