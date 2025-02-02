import React, { useEffect, useState, useCallback } from "react";
import { EventTypes } from "../utils/eventTypes";
import { EventNames } from "../utils/eventNames";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { supabase } from "../services/supabase";
import PropTypes from "prop-types";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const STATUS_COLORS = {
  [EventTypes.CHECK_IN]: "#81C27A",
  [EventTypes.BREAK_START]: "#CCC185",
  [EventTypes.BREAK_END]: "#81C27A",
  [EventTypes.CHECK_OUT]: "#D4F4FA",
  default: "#F8F9FA",
};
export default function DashboardScreen({ route }) {
  const { userId, username } = route.params;
  const [currentEventType, setCurrentEventType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bgColor, setBgColor] = useState(STATUS_COLORS.default);
  const insets = useSafeAreaInsets();

  const updateStatus = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("events")
        .select("type")
        .eq("user_id", userId)
        .order("time", { ascending: false })
        .limit(1);

      if (error) throw error;

      const latestType = data?.[0]?.type;
      setCurrentEventType(latestType);
      setBgColor(
        latestType ? STATUS_COLORS[latestType] : STATUS_COLORS.default,
      );
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const handleEvent = async (eventType) => {
    try {
      setLoading(true);
      const { error } = await supabase.from("events").insert([
        {
          user_id: userId,
          type: eventType,
          time: new Date().toISOString(),
        },
      ]);

      if (error) throw error;
      await updateStatus();
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    updateStatus();

    const subscription = supabase
      .channel("events-channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "events",
          filter: `user_id=eq.${userId}`,
        },
        updateStatus,
      )
      .subscribe();

    return () => supabase.removeChannel(subscription);
  }, [updateStatus, userId]);

  const renderActionButton = () => {
    if (loading) return <ActivityIndicator size="large" />;

    switch (currentEventType) {
      case EventTypes.CHECK_IN:
      case EventTypes.BREAK_END:
        return (
          <>
            <ActionButton
              text={EventNames.BREAK_START}
              onPress={() => handleEvent(EventTypes.BREAK_START)}
            />
            <ActionButton
              text={EventNames.CHECK_OUT}
              onPress={() => handleEvent(EventTypes.CHECK_OUT)}
              secondary
            />
          </>
        );
      case EventTypes.BREAK_START:
        return (
          <ActionButton
            text={EventNames.BREAK_END}
            onPress={() => handleEvent(EventTypes.BREAK_END)}
          />
        );
      default:
        return (
          <ActionButton
            text={EventNames.CHECK_IN}
            onPress={() => handleEvent(EventTypes.CHECK_IN)}
          />
        );
    }
  };

  return (
    <View
      style={{
        paddingTop: insets.top + 30,
        paddingBottom: insets.bottom + 20,
        paddingHorizontal: 20,
        backgroundColor: bgColor,
        ...styles.content,
      }}
    >
      <Text style={styles.title}>Hello, {username}! 👋 </Text>
      <View style={styles.actionsContainer}>{renderActionButton()}</View>
    </View>
  );
}

const ActionButton = ({ text, onPress, secondary = false }) => (
  <TouchableOpacity
    style={[
      styles.button,
      secondary ? styles.secondaryButton : styles.primaryButton,
    ]}
    onPress={onPress}
  >
    <Text style={styles.buttonText}>{text}</Text>
  </TouchableOpacity>
);
ActionButton.propTypes = {
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  secondary: PropTypes.bool,
};

DashboardScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      userId: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1E293B",
    textAlign: "center",
    marginBottom: 30,
  },
  actionsContainer: {
    gap: 12,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: "#3B82F6",
  },
  secondaryButton: {
    backgroundColor: "#64748B",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
