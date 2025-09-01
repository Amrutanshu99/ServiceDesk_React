const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const CspHtmlWebpackPlugin = require("csp-html-webpack-plugin");
const { SubresourceIntegrityPlugin } = require("webpack-subresource-integrity");

module.exports = merge(common, {
  mode: "production",
  devtool: "source-map",
  output: {
    ...common.output,
    crossOriginLoading: "anonymous",
  },
  plugins: [
    // CSP
    new CspHtmlWebpackPlugin(
      {
        "default-src": ["'self'"],
        "script-src": ["'self'"],
        "style-src": ["'self'", "'unsafe-inline'"],
        "img-src": ["'self'", "data:"],
        "connect-src": ["'self'", "https:"],
        "font-src": ["'self'", "https:", "data:"],
        "object-src": ["'none'"],
        "frame-ancestors": ["'none'"],
      },
      {
        enabled: true,
        hashingMethod: "sha256",
        hashEnabled: { "script-src": true, "style-src": false },
        nonceEnabled: { "script-src": true, "style-src": false },
      }
    ),
    // SRI
    new SubresourceIntegrityPlugin({
      hashFuncNames: ["sha384"],
      enabled: true,
    }),
  ],
  optimization: {
    splitChunks: { chunks: "all" },
    runtimeChunk: "single",
  },
});
