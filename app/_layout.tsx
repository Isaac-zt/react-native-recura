import { SplashScreen, Stack } from "expo-router";
import "@/global.css";
import { useFonts } from "expo-font";
import { useEffect } from "react";


export default function RootLayout() {
const [fontsLoaded] = useFonts({
  sans_regular: require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
  sans_bold: require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
  sans_semi_bold: require("../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
  sans_medium: require("../assets/fonts/PlusJakartaSans-Medium.ttf"),
  sans_extra_bold: require("../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
  sans_light: require("../assets/fonts/PlusJakartaSans-Light.ttf")
})

useEffect(() => {
  if(fontsLoaded) {
    SplashScreen.hideAsync();
  }
}, [fontsLoaded])

if(!fontsLoaded) return null;


  return <Stack screenOptions={{ headerShown: false }} />;
}
