const GITHUB = Object.freeze({
  API_URL: "https://api.github.com",

  USERNAME: "AzariaSW",

  USER_AGENT: "AzariaPortfolio",

  TIMEOUT: 10000,

  CACHE: {
    TTL: 3 * 60 * 60 * 1000,

    KEYS: {
      ACTIVITY: "github:activity",

      PROFILE: "github:profile",

      REPOSITORIES: "github:repositories",

      EVENTS: "github:events",
    },
  },
});

export default GITHUB;
