import { useState, useCallback, useEffect } from "react";
import { Alert } from "react-native";
import { supabase } from "../services/supabase";
import { EventTypes } from "../utils/eventTypes";

const STATUS_COLORS = {
  [EventTypes.CHECK_IN]: "#81C27A",
  [EventTypes.BREAK_START]: "#CCC185",
  [EventTypes.BREAK_END]: "#81C27A",
  [EventTypes.CHECK_OUT]: "#D4F4FA",
  default: "#F8F9FA",
};

export default function useDashboard(userId) {
  const [currentEventType, setCurrentEventType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bgColor, setBgColor] = useState(STATUS_COLORS.default);

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

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [updateStatus, userId]);

  return { currentEventType, loading, bgColor, handleEvent };
}
