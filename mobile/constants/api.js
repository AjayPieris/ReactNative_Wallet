import { Platform } from "react-native";
import Constants from "expo-constants";

function getDefaultApiBaseUrl() {
  // Web runs in your browser on the same machine as the backend.
  if (Platform.OS === "web") return "http://localhost:3000";

  // For Expo Go / dev builds on device, use the same host as Metro.
  const hostUri = Constants.expoConfig?.hostUri;
  const host = hostUri?.split(":")[0];
  if (host) return `http://${host}:3000`;

  // Safe fallback (works for iOS simulator; Android emulator often needs 10.0.2.2).
  return "http://localhost:3000";
}

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || getDefaultApiBaseUrl();

export const API_URL = `${API_BASE_URL}/api/transactions`;
