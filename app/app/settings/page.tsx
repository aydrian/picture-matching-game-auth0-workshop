import { auth0 } from '@/lib/auth0'
import { SettingsContent } from '@/components/settings-content'

async function isGoogleConnected() {
  // TODO (Step X): Check if the user has connected their Google account via Token Vault
  // Use auth0.getAccessTokenForConnection() to verify the connection exists
  return false
}

export default async function SettingsPage() {
  const isGoogleDriveConnected = await isGoogleConnected()

  return <SettingsContent isGoogleConnected={isGoogleDriveConnected} />
}
