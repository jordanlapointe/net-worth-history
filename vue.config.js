const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  pages: {
    index: {
      entry: "src/main.js",
      title: "Net Worth History",
    },
  },
  transpileDependencies: true,
});
