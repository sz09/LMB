const PROXY_CONFIG = [
  {
    context: [
      "/api/home",
    ],
    target: "https://localhost:5001",
    secure: false,
    "/api": {
      "target": "https://localhost:5001",
      "secure": false
    }
  }
]

module.exports = PROXY_CONFIG;
