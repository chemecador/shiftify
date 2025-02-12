import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import ShimmerPlaceHolder from "react-native-shimmer-placeholder";
import useAllEvents, { EventRecord } from "../hooks/useAllEvents";
import useUserEmail from "../hooks/useEmail";
import { EventNames } from "../utils/eventNames";
import { RootStackParamList } from "../navigation/Navigator";

type EventsScreenRouteProp = RouteProp<RootStackParamList, "EventsScreen">;

const EventsScreen = () => {
  const { userId } = useRoute<EventsScreenRouteProp>().params;
  const { events, loading, error } = useAllEvents(userId);
  const {
    email,
    loading: emailLoading,
    error: emailError,
  } = useUserEmail(userId);

  const username = email ? email.split("@")[0] : "";

  const renderItem = ({ item }: { item: EventRecord }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.userText}>{username}</Text>
      <View style={styles.itemDetails}>
        <Text style={styles.eventText}>
          {EventNames[item.type.toUpperCase() as keyof typeof EventNames] ||
            item.type}
        </Text>
        <Text style={styles.timeText}>
          {new Date(item.time).toLocaleString()}
        </Text>
      </View>
    </View>
  );

  if (loading || emailLoading) {
    return (
      <View style={styles.container}>
        <ShimmerPlaceHolder style={styles.shimmerRow} />
        <ShimmerPlaceHolder style={styles.shimmerRow} />
        <ShimmerPlaceHolder style={styles.shimmerRow} />
        <ShimmerPlaceHolder style={styles.shimmerRow} />
        <ShimmerPlaceHolder style={styles.shimmerRow} />
        <ShimmerPlaceHolder style={styles.shimmerRow} />
        <ShimmerPlaceHolder style={styles.shimmerRow} />
        <ShimmerPlaceHolder style={styles.shimmerRow} />
        <ShimmerPlaceHolder style={styles.shimmerRow} />
      </View>
    );
  }

  if (error || emailError) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Error: {error || emailError}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  itemContainer: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  userText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  itemDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  eventText: {
    fontSize: 16,
    color: "#333",
  },
  timeText: {
    fontSize: 14,
    color: "#666",
  },
  error: {
    color: "red",
    fontSize: 16,
  },
  shimmerRow: {
    width: "100%",
    height: 30,
    marginBottom: 10,
    borderRadius: 4,
  },
});

export default EventsScreen;
