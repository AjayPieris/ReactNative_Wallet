import { useSignIn } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { styles } from "../../assets/styles/auth.styles";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/color";

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const parseClerkError = (err) => {
    const arr = Array.isArray(err?.errors) ? err.errors : [];
    const codes = arr.map((e) => e.code);
    if (codes.includes("form_password_incorrect"))
      return "Incorrect password. Please try again.";
    if (codes.includes("form_identifier_not_found"))
      return "No account exists for that email.";
    if (codes.includes("form_param_format_invalid"))
      return "Enter a valid email address.";
    if (codes.includes("form_param_missing")) return "Missing required field.";
    if (codes.includes("form_identifier_exists"))
      return "Email already in use.";
    return arr[0]?.message || "An unexpected error occurred. Please try again.";
  };

  const onSignInPress = async () => {
    if (!isLoaded) return;
    setError(null);
    const email = emailAddress.trim().toLowerCase();
    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    try {
      const attempt = await signIn.create({ identifier: email, password });
      if (attempt.status === "complete") {
        await setActive({ session: attempt.createdSessionId });
        router.replace("/");
      } else {
        console.error(
          "Incomplete sign-in step:",
          JSON.stringify(attempt, null, 2)
        );
        setError("Additional steps required. Please follow instructions.");
      }
    } catch (err) {
      console.log("Sign-in error raw:", JSON.stringify(err, null, 2));
      setError(parseClerkError(err));
    }
  };

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }} // only general scrollview style here
      contentContainerStyle={{
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      extraScrollHeight={100}
    >
      <View style={styles.container}>
        <Image
          source={require("../../assets/images/revenue-i4.png")}
          style={styles.illustration}
          contentFit="contain"
        />
        <Text style={styles.title}>Welcome Back</Text>
        {error && (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => setError(null)}>
              <Ionicons
                name="close-circle"
                size={20}
                color={COLORS.textLight}
              />
            </TouchableOpacity>
          </View>
        )}
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Enter email"
          placeholderTextColor="#9A8478"
          onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
        />

        <TextInput
          style={styles.input}
          value={password}
          placeholder="Enter password"
          placeholderTextColor="#9A8478"
          secureTextEntry={true}
          autoCapitalize="none"
          onChangeText={(password) => setPassword(password)}
        />
        <TouchableOpacity onPress={onSignInPress} style={styles.button}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => router.push("/sign-up")}>
            <Text style={styles.linkText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
