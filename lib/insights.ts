import dayjs, { type Dayjs } from "dayjs";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thr", "Fri", "Sat", "Sun"] as const;

/** Monday-based start of the week containing `date`. */
export const startOfWeekMonday = (date: Dayjs = dayjs()): Dayjs =>
  date.startOf("day").subtract((date.day() + 6) % 7, "day");

/** Convert a subscription price to an approximate monthly amount. */
export const toMonthlyAmount = (price: number, billing?: string): number => {
  const normalized = (billing ?? "monthly").toLowerCase();

  if (normalized.includes("year")) return price / 12;
  if (normalized.includes("week")) return price * 52 / 12;
  if (normalized.includes("day")) return price * 30;
  if (normalized.includes("quarter")) return price / 3;

  return price;
};

export const billingLabel = (billing?: string): string => {
  const normalized = (billing ?? "monthly").toLowerCase();

  if (normalized.includes("year")) return "per year";
  if (normalized.includes("week")) return "per week";
  if (normalized.includes("day")) return "per day";
  if (normalized.includes("quarter")) return "per quarter";

  return "per month";
};

const isActive = (subscription: Subscription) =>
  (subscription.status ?? "active").toLowerCase() === "active";

/**
 * Pick the week to visualize: prefer the current week when it has renewals,
 * otherwise the week of the nearest upcoming (or most recent) renewal.
 */
export const resolveInsightsWeek = (
  subscriptions: Subscription[],
  now: Dayjs = dayjs()
): Dayjs => {
  const currentWeekStart = startOfWeekMonday(now);
  const currentWeekEnd = currentWeekStart.add(7, "day");

  const hasRenewalsThisWeek = subscriptions.some((subscription) => {
    if (!subscription.renewalDate) return false;
    const renewal = dayjs(subscription.renewalDate);
    return renewal.isAfter(currentWeekStart.subtract(1, "ms")) && renewal.isBefore(currentWeekEnd);
  });

  if (hasRenewalsThisWeek) return currentWeekStart;

  const dated = subscriptions
    .filter((subscription) => subscription.renewalDate)
    .map((subscription) => dayjs(subscription.renewalDate))
    .filter((date) => date.isValid())
    .sort((a, b) => a.valueOf() - b.valueOf());

  const upcoming = dated.find((date) => date.isAfter(now) || date.isSame(now, "day"));
  if (upcoming) return startOfWeekMonday(upcoming);

  if (dated.length > 0) return startOfWeekMonday(dated[dated.length - 1]);

  return currentWeekStart;
};

/** Daily renewal spend for a Mon–Sun week. */
export const getWeeklyUpcomingSpend = (
  subscriptions: Subscription[],
  weekStart?: Dayjs
): WeeklySpendDay[] => {
  const start = weekStart ?? resolveInsightsWeek(subscriptions);
  const days = DAY_LABELS.map((label, index) => ({
    key: start.add(index, "day").format("YYYY-MM-DD"),
    label,
    date: start.add(index, "day"),
    amount: 0,
  }));

  subscriptions.forEach((subscription) => {
    if (!subscription.renewalDate || !isActive(subscription)) return;

    const renewal = dayjs(subscription.renewalDate);
    if (!renewal.isValid()) return;

    const dayIndex = days.findIndex((day) => renewal.isSame(day.date, "day"));
    if (dayIndex === -1) return;

    days[dayIndex].amount += subscription.price;
  });

  return days.map(({ key, label, amount }) => ({ key, label, amount }));
};

/** Build nice Y-axis ticks from a max value (always includes 0). */
export const getChartTicks = (maxAmount: number): number[] => {
  const ceiling = Math.max(maxAmount, 5);
  const roughStep = ceiling / 4;
  const magnitude = 10 ** Math.floor(Math.log10(roughStep || 1));
  const step = Math.max(Math.ceil(roughStep / magnitude) * magnitude, 1);
  const top = Math.ceil(ceiling / step) * step;

  const ticks: number[] = [];
  for (let value = 0; value <= top; value += step) {
    ticks.push(value);
  }

  return ticks;
};

export const getMonthlyExpenseSummary = (
  subscriptions: Subscription[],
  reference: Dayjs = dayjs()
): MonthlyExpenseSummary => {
  const activeSubscriptions = subscriptions.filter(isActive);

  const currentTotal = activeSubscriptions.reduce(
    (total, subscription) =>
      total + toMonthlyAmount(subscription.price, subscription.billing),
    0
  );

  // Approximate prior period as spend excluding subscriptions started this month.
  const monthStart = reference.startOf("month");
  const previousTotal = activeSubscriptions.reduce((total, subscription) => {
    const started = dayjs(subscription.startDate);
    if (started.isValid() && !started.isBefore(monthStart)) return total;
    return total + toMonthlyAmount(subscription.price, subscription.billing);
  }, 0);

  const changePercent =
    previousTotal === 0
      ? currentTotal > 0
        ? 100
        : 0
      : ((currentTotal - previousTotal) / previousTotal) * 100;

  return {
    monthLabel: reference.format("MMMM YYYY"),
    total: currentTotal,
    changePercent,
  };
};

export const getHistorySubscriptions = (
  subscriptions: Subscription[],
  limit = 10
): Subscription[] =>
  [...subscriptions]
    .sort((a, b) => {
      const aDate = dayjs(a.renewalDate ?? a.startDate);
      const bDate = dayjs(b.renewalDate ?? b.startDate);
      return bDate.valueOf() - aDate.valueOf();
    })
    .slice(0, limit);

export const formatHistoryDateTime = (value?: string): string => {
  if (!value) return "Not provided";
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.format("MMMM D, HH:mm") : "Not provided";
};

export const getPeakDayIndex = (days: WeeklySpendDay[]): number => {
  if (days.length === 0) return 0;

  let peakIndex = 0;
  days.forEach((day, index) => {
    if (day.amount > days[peakIndex].amount) peakIndex = index;
  });

  return peakIndex;
};
