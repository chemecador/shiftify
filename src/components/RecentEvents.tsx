import React from "react";
import { View, Text, StyleSheet } from "react-native";
import ShimmerPlaceHolder from "react-native-shimmer-placeholder";
import useRecentEvents, { EventRecord } from "../hooks/useRecentEvents";
import { EventNames } from "../utils/eventNames";

interface RecentEventsProps {
  userId: string | number;
  refreshKey: number;
}

function RecentEvents({ userId, refreshKey }: RecentEventsProps) {
  const { events, loading, error } = useRecentEvents(userId, refreshKey);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Today&apos;s Events</Text>
      {loading ? (
        <>
          <ShimmerPlaceHolder style={styles.shimmerRow} />
          <ShimmerPlaceHolder style={styles.shimmerRow} />
        </>
      ) : error ? (
        <Text style={styles.error}>Error: {error}</Text>
      ) : events.length === 0 ? (
        <Text style={styles.noData}>No events recorded today</Text>
      ) : (
        events.map((event: EventRecord, index: number) => (
          <View key={index} style={styles.item}>
            <Text style={styles.eventText}>
              {EventNames[
                event.type.toUpperCase() as keyof typeof EventNames
              ] || event.type}
            </Text>
            <Text style={styles.timeText}>
              {new Date(event.time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  error: {
    color: "red",
    fontSize: 14,
  },
  noData: {
    fontSize: 14,
    color: "#666",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
    alignItems: "center",
  },
  eventText: {
    fontSize: 14,
    fontWeight: "500",
  },
  timeText: {
    fontSize: 12,
    color: "#666",
  },
  shimmerRow: {
    width: "100%",
    height: 30,
    marginBottom: 10,
    borderRadius: 4,
  },
});

export default RecentEvents;
