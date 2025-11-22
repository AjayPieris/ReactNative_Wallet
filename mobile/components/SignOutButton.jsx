import { useClerk } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { Alert, Text, TouchableOpacity } from 'react-native'
import { styles } from '../assets/styles/home.styles'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '../constants/color'

export const SignOutButton = () => {
  // Use `useClerk()` to access the `signOut()` function
  const { signOut } = useClerk()
  const router = useRouter()

  const handleSignOut = async () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      {
        text: "Cancel",
        style: "cancel"
      },
      {
        text: "Logout",
        onPress: signOut
        }
    ]);
  }

  return (
    <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
      <Ionicons name="log-out-outline" size={22} color={COLORS.text} />
    </TouchableOpacity>
  )
}