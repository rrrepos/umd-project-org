const path = require("path");

module.exports = {
  entry: {
    "app/app.min.js": ["./src/app/app.js"],
    "components/umd-viewer-wc.min.js": ["./src/umd-viewer-wc/umd-viewer.js"]
  },
  output: {
    filename: "[name]",
    path: path.resolve(__dirname, "docs")
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
        generator: {  
          filename: "images/[hash][ext][query]"
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
        generator: {  
          filename: "fonts/[name][ext]"
        }
      },
    ],
  }
};