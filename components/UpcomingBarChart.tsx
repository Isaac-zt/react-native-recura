import { View, Text, Pressable } from "react-native";
import { getChartTicks } from "@/lib/insights";
import { colors } from "@/constants/theme";
import { formatCurrency } from "@/lib/utils";
import clsx from "clsx";

const CHART_HEIGHT = 160;
const MIN_BAR_HEIGHT = 8;

const UpcomingBarChart = ({ data, selectedIndex, onSelect }: UpcomingBarChartProps) => {
  const maxAmount = Math.max(...data.map((day) => day.amount), 0);
  const ticks = getChartTicks(maxAmount);
  const chartMax = ticks[ticks.length - 1] || 1;

  return (
    <View className="insights-chart-card">
      <View className="insights-chart-body">
        <View className="insights-y-axis">
          {[...ticks].reverse().map((tick) => (
            <Text key={tick} className="insights-y-label">
              {tick}
            </Text>
          ))}
        </View>

        <View className="insights-plot">
          <View className="insights-grid" style={{ height: CHART_HEIGHT }}>
            {ticks.map((tick) => (
              <View
                key={`grid-${tick}`}
                className="insights-grid-line"
                style={{ bottom: (tick / chartMax) * CHART_HEIGHT }}
              />
            ))}
          </View>

          <View className="insights-bars" style={{ height: CHART_HEIGHT }}>
            {data.map((day, index) => {
              const isSelected = index === selectedIndex;
              const ratio = day.amount > 0 ? day.amount / chartMax : 0;
              const barHeight =
                day.amount > 0
                  ? Math.max(ratio * CHART_HEIGHT, MIN_BAR_HEIGHT)
                  : MIN_BAR_HEIGHT;

              return (
                <Pressable
                  key={day.key}
                  className="insights-bar-col"
                  onPress={() => onSelect(index)}
                >
                  {isSelected && day.amount > 0 && (
                    <View className="insights-tooltip">
                      <Text className="insights-tooltip-text">
                        {formatCurrency(day.amount)}
                      </Text>
                    </View>
                  )}

                  <View
                    className={clsx(
                      "insights-bar",
                      isSelected ? "bg-accent" : "bg-primary"
                    )}
                    style={{
                      height: barHeight,
                      opacity: day.amount === 0 ? 0.2 : 1,
                      backgroundColor: isSelected ? colors.accent : colors.primary,
                    }}
                  />
                </Pressable>
              );
            })}
          </View>

          <View className="insights-x-axis">
            {data.map((day, index) => (
              <Text
                key={`label-${day.key}`}
                className={clsx(
                  "insights-x-label",
                  index === selectedIndex && "insights-x-label-active"
                )}
              >
                {day.label}
              </Text>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

export default UpcomingBarChart;
