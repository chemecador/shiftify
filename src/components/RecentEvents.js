import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import ShimmerPlaceHolder from "react-native-shimmer-placeholder";
import { supabase } from "../services/supabase";
import { EventNames } from "../utils/eventNames";

const RecentEvents = ({ userId, refreshKey }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const now = new Date();
      const startOfToday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
      ).toISOString();
      const endOfToday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23,
        59,
        59,
        999,
      ).toISOString();

      const { data, error } = await supabase
        .from("events")
        .select("type, time")
        .eq("user_id", userId)
        .gte("time", startOfToday)
        .lte("time", endOfToday)
        .order("time", { ascending: false })
        .limit(8);

      if (error) throw error;
      setEvents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents, refreshKey]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Today&apos;s Events</Text>
      {loading ? (
        <>
          <ShimmerPlaceHolder style={styles.shimmerRow} autoRun={true} />
          <ShimmerPlaceHolder style={styles.shimmerRow} autoRun={true} />
        </>
      ) : error ? (
        <Text style={styles.error}>Error: {error}</Text>
      ) : events.length === 0 ? (
        <Text style={styles.noData}>No events recorded today</Text>
      ) : (
        events.map((event, index) => (
          <View key={index} style={styles.item}>
            <Text style={styles.eventText}>
              {EventNames[event.type.toUpperCase()] || event.type}
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
};

RecentEvents.propTypes = {
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  refreshKey: PropTypes.number.isRequired,
};

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
