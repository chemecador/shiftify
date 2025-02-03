import { useState, useCallback, useEffect } from "react";
import { Alert } from "react-native";
import { supabase } from "../services/supabase";
import { EventTypes, type EventType } from "../utils/eventTypes";

type UserId = string | number;

const STATUS_COLORS: { [key in EventType]?: string } & { default: string } = {
  [EventTypes.CHECK_IN]: "#81C27A",
  [EventTypes.BREAK_START]: "#CCC185",
  [EventTypes.BREAK_END]: "#81C27A",
  [EventTypes.CHECK_OUT]: "#D4F4FA",
  default: "#F8F9FA",
};

export default function useDashboard(userId: UserId) {
  const [currentEventType, setCurrentEventType] = useState<EventType | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [bgColor, setBgColor] = useState<string>(STATUS_COLORS.default);

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

      const latestType: EventType | undefined = data && data[0]?.type;
      setCurrentEventType(latestType || null);
      setBgColor(
        latestType
          ? STATUS_COLORS[latestType] || STATUS_COLORS.default
          : STATUS_COLORS.default,
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        Alert.alert("Error", error.message);
      } else {
        Alert.alert("Error", "An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const handleEvent = async (eventType: EventType) => {
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
    } catch (error: unknown) {
      if (error instanceof Error) {
        Alert.alert("Error", error.message);
      } else {
        Alert.alert("Error", "An unknown error occurred");
      }
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
