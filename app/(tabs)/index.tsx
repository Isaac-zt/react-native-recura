import "@/global.css";
import { Link } from "expo-router";
import { Image, Text, View} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import images from "@/constants/images";
import dayjs from "dayjs";
import { HOME_USER, HOME_BALANCE } from "@/constants/data";
import { icons } from "@/constants/icon";
import {formatCurrency} from "@/lib/utils";
const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
  return (
    <SafeAreaView className="flex-1  bg-background p-5"> 
      <View className="home-header">
        <View className="home-user">
          <Image source={images.avatar} className="home-avatar" />  
          <Text className="home-user">{HOME_USER.name}</Text>
        </View>

        <Image source={icons.add} className="home-add-icon" />
      </View>

      <View className="home-balance-card">
         <Text className="home-balance-label">Current Balance</Text>

         <View className="home-balance-row">
           <Text className="home-balance-amount">
            {formatCurrency(HOME_BALANCE.amount)}
           </Text>
           <Text className="home-balance-date">
              {dayjs(HOME_BALANCE.nextRenewalDate).format('MM/DD/YY')}
           </Text>
         </View>
      </View>
    </SafeAreaView>
  );
}
