module.exports = {
  apps: [
    {
      name: "ezclient",
      cwd: "/var/www/ezclient",
      script: "yarn",
      args: "start",
      interpreter: "none",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
