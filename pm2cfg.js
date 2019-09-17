module.exports = {
    apps : [
        {
          name: "as3",
          script: "./dist/https.js",
          watch: true,
          env_first: {
              "PORT": 80,
              "NODE_ENV": "production",
              "FIRST_START": true
          },
          env_production: {
              "PORT": 80,
              "NODE_ENV": "production",
          }
        }
    ]
  }