"use client";

import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { Text, View } from "react-native";

// Folosim variabilele de mediu cu valorile default sigure
const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL || "";
const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || "";

// Adăugăm afișare pentru debugging
console.log("ConvexURL:", convexUrl);
console.log("Clerk key length:", publishableKey?.length || 0);

// Creăm clientul Convex condițional
const convex = new ConvexReactClient(convexUrl);

export default function ConvexClientProvider({ children }) {
  try {
    // Verifică dacă publishableKey există
    if (!publishableKey) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'yellow' }}>
          <Text>Clerk publishable key missing. Check your environment variables.</Text>
        </View>
      );
    }

    if (!convexUrl) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'orange' }}>
          <Text>Convex URL missing. Check your environment variables.</Text>
        </View>
      );
    }

    return (
      <ClerkProvider publishableKey={publishableKey}>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          {children}
        </ConvexProviderWithClerk>
      </ClerkProvider>
    );
  } catch (error) {
    console.error("ConvexClientProvider error:", error);
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'red' }}>
        <Text style={{ color: 'white' }}>Error in ConvexClientProvider</Text>
        <Text style={{ color: 'white', fontSize: 12, marginTop: 10 }}>{error?.message || "Unknown error"}</Text>
      </View>
    );
  }
}
