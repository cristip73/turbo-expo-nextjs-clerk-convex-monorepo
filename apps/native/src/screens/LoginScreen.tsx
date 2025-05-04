import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image, TextInput, Alert } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useOAuth, useSignIn } from "@clerk/clerk-expo";
import { AntDesign, Feather } from "@expo/vector-icons";

const LoginScreen = ({ navigation }) => {
  const { startOAuthFlow: startGoogleAuthFlow } = useOAuth({
    strategy: "oauth_google",
  });
  const { startOAuthFlow: startAppleAuthFlow } = useOAuth({
    strategy: "oauth_apple",
  });

  // State pentru sign-in cu email și parolă
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Hook pentru sign-in cu email și parolă
  const { signIn, setActive, isLoaded } = useSignIn();

  const onPress = async (authType: string) => {
    try {
      if (authType === "google") {
        const { createdSessionId, setActive } = await startGoogleAuthFlow();
        if (createdSessionId) {
          setActive({ session: createdSessionId });
          navigation.navigate("NotesDashboardScreen");
        }
      } else if (authType === "apple") {
        const { createdSessionId, setActive } = await startAppleAuthFlow();
        if (createdSessionId) {
          setActive({ session: createdSessionId });
          navigation.navigate("NotesDashboardScreen");
        }
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  };

  const handleEmailSignIn = async () => {
    if (!isLoaded) {
      return;
    }

    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    try {
      setIsLoading(true);
      
      // Attempt to sign in with email and password
      const signInAttempt = await signIn.create({
        identifier: email,
        password,
      });
      
      // Check if sign-in was successful
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        navigation.navigate("NotesDashboardScreen");
      } else {
        console.log("Sign-in status:", signInAttempt);
        Alert.alert("Error", "Sign-in failed. Please check your credentials.");
      }
    } catch (err) {
      console.error("Sign-in error:", err);
      Alert.alert("Error", err.errors?.[0]?.message || "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          source={require("../assets/icons/logo.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>Log in to your account</Text>
        <Text style={styles.subtitle}>Welcome! Please login below.</Text>
        
        {/* Sign-in with Email/Password */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
            <Feather name={showPassword ? "eye" : "eye-off"} size={20} color="#666" />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity
          style={styles.buttonEmail}
          onPress={handleEmailSignIn}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? "Signing in..." : "Sign in with Email"}
          </Text>
        </TouchableOpacity>
        
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.divider} />
        </View>
        
        {/* Sign-in with OAuth providers */}
        <TouchableOpacity
          style={styles.buttonGoogle}
          onPress={() => onPress("google")}
        >
          <Image
            style={styles.googleIcon}
            source={require("../assets/icons/google.png")}
          />
          <Text style={{ ...styles.buttonText, color: "#344054" }}>
            Continue with Google
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonApple}
          onPress={() => onPress("apple")}
        >
          <AntDesign name="apple1" size={24} color="black" />
          <Text
            style={{ ...styles.buttonText, color: "#344054", marginLeft: 12 }}
          >
            Continue with Apple
          </Text>
        </TouchableOpacity>

        <View style={styles.signupContainer}>
          <Text style={{ fontFamily: "Regular" }}>Don't have an account? </Text>
          <Text style={styles.signupText}>Sign up above.</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  card: {
    backgroundColor: "#fff",
    padding: 10,
    alignItems: "center",
    width: "98%",
  },
  logo: {
    width: 74,
    height: 74,
    marginTop: 20,
  },
  title: {
    marginTop: 49,
    fontSize: RFValue(21),
    fontFamily: "SemiBold",
  },
  subtitle: {
    marginTop: 8,
    fontSize: RFValue(14),
    color: "#000",
    fontFamily: "Regular",
    marginBottom: 32,
    textAlign: "center",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#D0D5DD",
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    fontFamily: "Regular",
    fontSize: RFValue(14),
  },
  passwordContainer: {
    flexDirection: "row",
    width: "100%",
    borderWidth: 1,
    borderColor: "#D0D5DD",
    borderRadius: 10,
    marginBottom: 16,
    alignItems: "center",
  },
  passwordInput: {
    flex: 1,
    padding: 14,
    fontFamily: "Regular",
    fontSize: RFValue(14),
  },
  eyeIcon: {
    padding: 10,
  },
  buttonEmail: {
    backgroundColor: "#0D87E1",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    marginBottom: 24,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    textAlign: "center",
    color: "#FFF",
    fontFamily: "SemiBold",
    fontSize: RFValue(14),
  },
  buttonTextWithIcon: {
    marginLeft: 10,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#D0D5DD",
  },
  dividerText: {
    marginHorizontal: 10,
    color: "#667085",
    fontFamily: "Medium",
  },
  buttonGoogle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D0D5DD",
    width: "100%",
    marginBottom: 12,
    height: 44,
  },
  buttonApple: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D0D5DD",
    width: "100%",
    marginBottom: 32,
  },
  signupContainer: {
    flexDirection: "row",
  },
  signupText: {
    color: "#4D9DE0",
    fontFamily: "SemiBold",
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  errorText: {
    fontSize: RFValue(14),
    color: "tomato",
    fontFamily: "Medium",
    alignSelf: "flex-start",
    marginBottom: 8,
    marginLeft: 4,
  },
});

export default LoginScreen;
