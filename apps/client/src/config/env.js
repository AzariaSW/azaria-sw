const required = ["VITE_API_URL"];

required.forEach((key) => {
  if (!import.meta.env[key]) {
    throw new Error(`Missing environment variable: ${key}`);
  }
});

const env = {
  API_URL: import.meta.env.VITE_API_URL,

  APP_NAME: import.meta.env.VITE_APP_NAME ?? "Azaria SW",

  UPLOAD_URL: import.meta.env.VITE_UPLOAD_URL,

  IS_DEV: import.meta.env.DEV,

  IS_PROD: import.meta.env.PROD,
};

export default env;
