module.exports = process.env.CI
    ? [
          //   "@react-native-firebase/perf",
          //   "@react-native-firebase/crashlytics",
          [
              "@sentry/react-native/expo",
              {
                  url: "https://sentry.io/",
                  organization: Env.SENTRY_ORG,
                  project: Env.SENTRY_PROJECT,
                  note: "Ensure you set the SENTRY_AUTH_TOKEN as an environment variable to authenticate with Sentry. Do not add it to the .env file. Instead, add it as an EAS secret or as an environment variable in your CI/CD pipeline for security.",
              },
          ],
      ]
    : [];
