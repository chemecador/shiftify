import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import ShimmerPlaceHolder from "react-native-shimmer-placeholder";
import useRecentEvents, { EventRecord } from "../hooks/useRecentEvents";
import { EventNames } from "../utils/eventNames";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

interface RecentEventsProps {
  userId: string | number;
  refreshKey: number;
}
function RecentEvents({ userId, refreshKey }: RecentEventsProps) {
  type RootStackParamList = {
    EventsScreen: { userId: string | number };
  };

  const { events, loading, error } = useRecentEvents(userId, refreshKey);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Today's Events</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("EventsScreen", { userId })}
        >
          <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
      </View>

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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  seeAll: {
    fontSize: 14,
    color: "#007BFF",
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
