module.exports = {
  apps: [
    {
      name: "admin",
      script: "index.js",
      cwd: "./admin-backend",
      watch: false,
      env: { NODE_ENV: "production" },
    },
    {
      name: "agency",
      script: "index.js",
      cwd: "./agency-backend",
      watch: false,
      env: { NODE_ENV: "production" },
    },
    {
      name: "ferrywheel",
      script: "index.js",
      cwd: "./ferrywheel-backend",
      watch: false,
      env: { NODE_ENV: "production" },
    },
    {
      name: "host",
      script: "index.js",
      cwd: "./host-backend",
      watch: false,
      env: { NODE_ENV: "production" },
    },
    {
      name: "casino",
      script: "index.js",
      cwd: "./roulettecasino-backend",
      watch: false,
      env: { NODE_ENV: "production" },
    },
    {
      name: "tenpatii",
      script: "index.js",
      cwd: "./teenpatt-backend",
      watch: false,
      env: { NODE_ENV: "production" },
    },
  ],
};
