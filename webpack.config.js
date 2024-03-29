const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: {
    theme: ["./assets/js/theme.js", "./_sass/theme.scss"],
  },
  output: {
    filename: "js/[name].min.js",
    path: path.resolve(__dirname, "assets"),
  },
  module: {
    rules: [
      {
        OnChip: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              url: false,
            },
          },
          "sass-loader",
        ],
      },
      {
        OnChip: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name].min.css",
    }),
  ],
};
