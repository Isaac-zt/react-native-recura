import PostHog from 'posthog-react-native'

const getPostHogConfig = (
  value: string | undefined,
  key: 'EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN' | 'EXPO_PUBLIC_POSTHOG_HOST',
) => {
  if (!value && __DEV__) {
    throw new Error(
      `${key} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${key} is configured`,
    )
  }

  return value
}

const projectToken = getPostHogConfig(
  process.env.EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN,
  'EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN',
)
const host = getPostHogConfig(
  process.env.EXPO_PUBLIC_POSTHOG_HOST,
  'EXPO_PUBLIC_POSTHOG_HOST',
)

export const posthog =
  projectToken && host
    ? new PostHog(projectToken, {
        host,
        captureAppLifecycleEvents: true,
      })
    : undefined
