const path = require("path")
const fs = require("fs")
const webpack = require("webpack")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const GasPlugin = require("gas-webpack-plugin")
const TerserPlugin = require("terser-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const HtmlWebpackInlineSourcePlugin = require("html-webpack-inline-source-plugin")
const DynamicCdnWebpackPlugin = require("dynamic-cdn-webpack-plugin")
const moduleToCdn = require("module-to-cdn")

const PORT = 3000
const ENV_PROD = process.env.NODE_ENV === "production"

const clientPath = path.resolve(__dirname, "src", "client")
const clientEntrypoints = [
  {
    name: "CLIENT - Dialog Metadata",
    entry: path.join(clientPath, "metadata", "index.js"),
    filename: "metadata",
    template: path.join(clientPath, "metadata", "index.html"),
  },
  {
    name: "CLIENT - Dialog About",
    entry: path.join(clientPath, "about", "index.js"),
    filename: "about",
    template: path.join(clientPath, "about", "index.html"),
  },
]

/*********************************
 *    Declare settings
 ********************************/

// webpack settings for copying files to the destination folder
const copyFilesConfig = {
  name: "COPY",
  mode: "production",
  entry: path.resolve(__dirname, "src", "appsscript.json"), // Useless but webpack need an entry file
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src", "appsscript.json"),
          to: path.resolve(__dirname, "dist"),
        },
      ],
    }),
  ],
}

const clientConfig = {
  context: __dirname,
  mode: ENV_PROD ? "production" : "development",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
  },
  resolve: {
    extensions: [".js"],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.png$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "url-loader",
          },
        ],
      },
    ],
  },
}

const DynamicCdnWebpackPluginConfig = {
  verbose: false,
  resolver: (packageName, packageVersion, options) => {
    const moduleDetails = moduleToCdn(packageName, packageVersion, options)
    if (moduleDetails) {
      return moduleDetails
    }
    const packageSuffix = ENV_PROD ? ".min.js" : ".js"
    const packageConfig = {
      name: packageName,
      version: packageVersion,
    }
    switch (packageName) {
      case "antd":
        return {
          ...packageConfig,
          var: "antd",
          url: `https://unpkg.com/antd@${packageVersion}/dist/antd${packageSuffix}`,
        }
      case "@ant-design/icons":
        return {
          ...packageConfig,
          var: "icons",
          url: `https://unpkg.com/@ant-design/icons@${packageVersion}/dist/index.umd${packageSuffix}`,
        }
      case "dayjs":
        return {
          ...packageConfig,
          var: "dayjs",
          url: `https://unpkg.com/dayjs@${packageVersion}/dayjs${packageSuffix}`,
        }
      case "moment":
        return {
          ...packageConfig,
          var: "moment",
          url: `https://unpkg.com/moment@${packageVersion}/moment.js`,
        }
      case "yamljs":
        return {
          name: packageName,
          var: "YAML",
          version: packageVersion,
          url: `https://unpkg.com/yamljs@${packageVersion}/dist/yaml${packageSuffix}`,
        }
      default:
        return null
    }
  },
}

const clientConfigs = clientEntrypoints.map((clientEntrypoint) => {
  return {
    ...clientConfig,
    name: clientEntrypoint.name,
    entry: clientEntrypoint.entry,
    plugins: [
      new webpack.DefinePlugin({
        "process.env": JSON.stringify({
          PORT,
        }),
      }),
      new HtmlWebpackPlugin({
        template: clientEntrypoint.template,
        filename: `${clientEntrypoint.filename}${ENV_PROD ? "" : "-impl"}.html`,
        inlineSource: "^[^(//)]+.(js|css)$",
      }),
      new HtmlWebpackInlineSourcePlugin(),
      new DynamicCdnWebpackPlugin(DynamicCdnWebpackPluginConfig),
    ],
  }
})

// Dev Server
// "yarn setup:https" script in package.json to generate certificate
const keyPath = path.resolve(__dirname, "certs", "key.pem")
const certPath = path.resolve(__dirname, "certs", "cert.pem")
const httpsCertificate =
  fs.existsSync(keyPath) && fs.existsSync(certPath)
    ? {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath),
      }
    : null
const devServer = {
  port: PORT,
  https: httpsCertificate || true,
  // Ref: google-apps-script-webpack-dev-server
  // https://github.com/enuchi/Google-Apps-Script-Webpack-Dev-Server
  before: (app) => {
    app.get("/gas/*", (req, res) => {
      res.setHeader("Content-Type", "text/html")
      fs.createReadStream(
        require.resolve("google-apps-script-webpack-dev-server")
      ).pipe(res)
    })
  },
}

const devClientConfigs = clientEntrypoints.map((clientEntrypoint) => {
  return {
    ...clientConfig,
    name: `DEVELOPMENT: ${clientEntrypoint.name}`,
    entry: path.resolve(__dirname, "src", "dev", "index.js"),
    plugins: [
      new webpack.DefinePlugin({
        "process.env": JSON.stringify({
          FILENAME: clientEntrypoint.filename,
          PORT,
        }),
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "src", "dev", "index.html"),
        filename: `${clientEntrypoint.filename}.html`,
        inlineSource: "^[^(//)]+.(js|css)$",
      }),
      new HtmlWebpackInlineSourcePlugin(),
      new DynamicCdnWebpackPlugin({}),
    ],
  }
})

const serverConfig = {
  name: "SERVER",
  context: __dirname,
  mode: ENV_PROD ? "production" : "development",
  entry: path.resolve(__dirname, "src", "server", "index.js"),
  output: {
    filename: "code.js",
    path: path.resolve(__dirname, "dist"),
    libraryTarget: "this",
  },
  resolve: {
    extensions: [".js"],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        sourceMap: true,
        terserOptions: {
          ecma: 6,
          output: {
            beautify: true,
          },
        },
      }),
    ],
  },
  plugins: [new GasPlugin()],
}

const webpackConfig = [
  {
    // 1. Copy files,
    ...copyFilesConfig,
    // 2. Set up webpack dev server during development
    // Note: devServer settings are only read in the first element when module.exports is an array
    ...(ENV_PROD ? {} : {devServer}),
  },
  // 3. Create the server bundle
  serverConfig,
  // 4. Create one client bundle for each client entrypoint.
  ...clientConfigs,
  // 5. Create a development dialog bundle for each client entrypoint during development.
  ...(ENV_PROD ? [] : devClientConfigs),
]

module.exports = webpackConfig
