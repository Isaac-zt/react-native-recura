import { useEffect, useMemo, useState } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import { useRouter } from "expo-router";
import { icons } from "@/constants/icon";
import ListHeading from "@/components/ListHeading";
import UpcomingBarChart from "@/components/UpcomingBarChart";
import InsightsHistoryCard from "@/components/InsightsHistoryCard";
import { useSubscriptionStore } from "@/lib/subscriptionStore";
import { formatCurrency } from "@/lib/utils";
import {
  getHistorySubscriptions,
  getMonthlyExpenseSummary,
  getPeakDayIndex,
  getWeeklyUpcomingSpend,
  resolveInsightsWeek,
} from "@/lib/insights";

const SafeAreaView = styled(RNSafeAreaView);

const Insights = () => {
  const router = useRouter();
  const { subscriptions } = useSubscriptionStore();

  const weekStart = useMemo(
    () => resolveInsightsWeek(subscriptions),
    [subscriptions]
  );

  const weeklySpend = useMemo(
    () => getWeeklyUpcomingSpend(subscriptions, weekStart),
    [subscriptions, weekStart]
  );

  const expenseSummary = useMemo(
    () => getMonthlyExpenseSummary(subscriptions, weekStart),
    [subscriptions, weekStart]
  );

  const history = useMemo(
    () => getHistorySubscriptions(subscriptions),
    [subscriptions]
  );

  const [selectedDayIndex, setSelectedDayIndex] = useState(() =>
    getPeakDayIndex(weeklySpend)
  );

  useEffect(() => {
    setSelectedDayIndex(getPeakDayIndex(weeklySpend));
  }, [weeklySpend]);

  const changeLabel = `${expenseSummary.changePercent >= 0 ? "+" : ""}${Math.round(
    expenseSummary.changePercent
  )}%`;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-5 pb-30"
        ListHeaderComponent={
          <>
            <View className="insights-header">
              <Pressable
                className="insights-header-btn"
                onPress={() => router.back()}
                accessibilityRole="button"
                accessibilityLabel="Go back"
              >
                <Image source={icons.back} className="insights-header-icon" />
              </Pressable>

              <Text className="insights-title">Monthly Insights</Text>

              <Pressable
                className="insights-header-btn"
                accessibilityRole="button"
                accessibilityLabel="More options"
              >
                <Image source={icons.menu} className="insights-header-icon" />
              </Pressable>
            </View>

            <ListHeading title="Upcoming" />
            <UpcomingBarChart
              data={weeklySpend}
              selectedIndex={selectedDayIndex}
              onSelect={setSelectedDayIndex}
            />

            <View className="insights-expense-card">
              <View>
                <Text className="insights-expense-label">Expenses</Text>
                <Text className="insights-expense-month">
                  {expenseSummary.monthLabel}
                </Text>
              </View>

              <View className="items-end">
                <Text className="insights-expense-amount">
                  -{formatCurrency(expenseSummary.total)}
                </Text>
                <Text className="insights-expense-change">{changeLabel}</Text>
              </View>
            </View>

            <ListHeading title="History" />
          </>
        }
        renderItem={({ item }) => (
          <InsightsHistoryCard
            name={item.name}
            icon={item.icon}
            amount={item.price}
            currency={item.currency}
            billing={item.billing}
            date={item.renewalDate ?? item.startDate}
            color={item.color}
          />
        )}
        ItemSeparatorComponent={() => <View className="h-4" />}
        ListEmptyComponent={
          <Text className="home-empty-state">No subscription history yet.</Text>
        }
      />
    </SafeAreaView>
  );
};

export default Insights;
