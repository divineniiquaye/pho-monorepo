/** @type {(env: import('../app.config').BuildEnv) => NonNullable<import('expo/config').ExpoConfig["plugins"]>} */
module.exports = (env) =>
    process.env.CI
        ? [
              //   "@react-native-firebase/perf",
              //   "@react-native-firebase/crashlytics",
              [
                  "@sentry/react-native/expo",
                  {
                      url: "https://sentry.io/",
                      organization: env.SENTRY_ORG,
                      project: env.SENTRY_PROJECT,
                      note: "Ensure you set the SENTRY_AUTH_TOKEN as an environment variable to authenticate with Sentry. Do not add it to the .env file. Instead, add it as an EAS secret or as an environment variable in your CI/CD pipeline for security.",
                  },
              ],
          ]
        : [];
