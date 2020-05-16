const fs = require("fs-extra")

exports.onPostBuild = async ({reporter}) => {
  await fs.ensureDir("node_modules/.cache/gatsby-source-strava")

  if (fs.existsSync(".cache/gatsby-source-strava")) {
    reporter.log(
      "onPostBuild: Copying gatsby-source-strava cache to node_modules"
    )
    await fs.copy(
      ".cache/gatsby-source-strava",
      "node_modules/.cache/gatsby-source-strava"
    )
  }
}