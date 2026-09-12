import { SplashScreen, Stack } from "expo-router";
import "@/global.css";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { ClerkProvider, useAuth } from '@clerk/expo'
import { tokenCache } from '@clerk/expo/token-cache'

SplashScreen.preventAutoHideAsync();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

if(!publishableKey) {
  throw new Error("Add your Clerk Publishable key to the .env file");
}

 function RootLayoutContent() {
  const { isLoaded: authLoaded } = useAuth();
const [fontsLoaded] = useFonts({
  sans_regular: require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
  sans_bold: require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
  sans_semi_bold: require("../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
  sans_medium: require("../assets/fonts/PlusJakartaSans-Medium.ttf"),
  sans_extra_bold: require("../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
  sans_light: require("../assets/fonts/PlusJakartaSans-Light.ttf")
})

useEffect(() => {
  if(fontsLoaded && authLoaded) {
    SplashScreen.hideAsync();
  }
}, [fontsLoaded, authLoaded]);

if(!fontsLoaded || !authLoaded) return null;

return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return(
  <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
    <RootLayoutContent />
  </ClerkProvider>);
}
