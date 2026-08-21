import "@/global.css";
import { Link } from "expo-router";
import { useState } from "react";
import { FlatList, Image, Text, View} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import images from "@/constants/images";
import dayjs from "dayjs";
import { HOME_USER, HOME_BALANCE, UPCOMING_SUBSCRIPTIONS, HOME_SUBSCRIPTIONS } from "@/constants/data";
import { icons } from "@/constants/icon";
import {formatCurrency} from "@/lib/utils";
import ListHeading from "@/components/ListHeading";
import UpcomingSubscriptionCard from "@/components/UpcomingSubscriptionCard";
import SubscriptionCard from "@/components/SubscriptionCard";
const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<string | null>(null);

  return (
    <SafeAreaView className="flex-1  bg-background p-5"> 
       
        <FlatList 
          ListHeaderComponent={() => (
            <>
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

      <View className="mb-5">

        <ListHeading title="Upcoming" />
          
        <FlatList data={UPCOMING_SUBSCRIPTIONS} 
        renderItem= {({ item }) => (<UpcomingSubscriptionCard {...item} />)}
        KeyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        ListFooterComponent={<Text className="home-empty-state">No Upcoming renewals yet.</Text>}
        />
      </View>
             <ListHeading title="All Subscriptions" />
            </>
          )}
        data={HOME_SUBSCRIPTIONS} 
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (<SubscriptionCard {...item} 
        expanded={expandedSubscriptionId === item.id}
        onPress={() => setExpandedSubscriptionId((currentId) => (currentId === item.id ? null : item.id))}
        />
       )}
          extraData={expandedSubscriptionId}
          ItemSeparatorComponent={() => <View className="h-4" />}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Text className="home-empty-state">No subscriptions yet.</Text>}
          contentContainerClassName="pb-30"
       />
    </SafeAreaView>
  );
}
