import { View, Text, Image } from "react-native";
import { formatCurrency } from "@/lib/utils";
import { billingLabel, formatHistoryDateTime } from "@/lib/insights";

const InsightsHistoryCard = ({
  name,
  icon,
  amount,
  currency,
  billing,
  date,
  color,
}: InsightsHistoryCardProps) => {
  return (
    <View
      className="insights-history-card"
      style={color ? { backgroundColor: color } : undefined}
    >
      <View className="insights-history-main">
        <Image source={icon} className="insights-history-icon" />
        <View className="insights-history-copy">
          <Text numberOfLines={1} className="insights-history-title">
            {name}
          </Text>
          <Text numberOfLines={1} className="insights-history-meta">
            {formatHistoryDateTime(date)}
          </Text>
        </View>
      </View>

      <View className="insights-history-price-box">
        <Text className="insights-history-price">
          {formatCurrency(amount, currency)}
        </Text>
        <Text className="insights-history-billing">{billingLabel(billing)}</Text>
      </View>
    </View>
  );
};

export default InsightsHistoryCard;
