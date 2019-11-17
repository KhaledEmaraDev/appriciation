const withBundleAnalyzer = require("@zeit/next-bundle-analyzer");
const withOffline = require("next-offline");
const path = require("path");
const dotEnvResult = require("dotenv").config({
  path: path.resolve(__dirname, ".env")
});

if (dotEnvResult.error) {
  throw dotEnvResult.error;
}

const nextConfig = {
  workboxOpts: {
    exclude: [/\.(?:png|jpg|jpeg|svg)$/],
    runtimeCaching: [
      {
        urlPattern: /\.(?:png|jpg|jpeg|svg)$/,
        handler: "CacheFirst",
        options: {
          cacheName: "images",
          expiration: {
            maxEntries: 25
          }
        }
      },
      {
        urlPattern: /^https?.*/,
        handler: "NetworkFirst",
        options: {
          cacheName: "offlineCache",
          expiration: {
            maxEntries: 1
          }
        }
      },
      {
        urlPattern: /api/,
        handler: "NetworkFirst",
        options: {
          cacheableResponse: {
            statuses: [0, 200],
            headers: {
              "x-test": "true"
            }
          }
        }
      }
    ]
  },
  analyzeServer: ["server", "both"].includes(process.env.BUNDLE_ANALYZE),
  analyzeBrowser: ["browser", "both"].includes(process.env.BUNDLE_ANALYZE),
  bundleAnalyzerConfig: {
    server: {
      analyzerMode: "static",
      reportFilename: "../bundles/server.html"
    },
    browser: {
      analyzerMode: "static",
      reportFilename: "../bundles/client.html"
    }
  },
  compress: false,
  env: {
    SESSION_SECRET: process.env.SESSION_SECRET,
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    HOST_SERVER: process.env.HOST_SERVER,
    HOST_CLIENT: process.env.HOST_CLIENT,
    GA_TRACKING_ID: process.env.GA_TRACKING_ID
  },
  webpack(config) {
    return config;
  }
};

module.exports = withBundleAnalyzer(withOffline(nextConfig));
