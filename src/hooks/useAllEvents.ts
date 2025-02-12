import { useState, useCallback, useEffect } from "react";
import { Alert } from "react-native";
import { supabase } from "../services/supabase";
import { EventTypes, type EventType } from "../utils/eventTypes";

export type EventRecord = {
  id: number;
  user_id: string | number;
  type: EventType;
  time: string;
};

export default function useAllEvents(userId: string | number) {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("user_id", userId)
        .order("time", { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (err: any) {
      const message =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(message);
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchEvents();

    const subscription = supabase
      .channel("events-all-channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "events",
          filter: `user_id=eq.${userId}`,
        },
        fetchEvents,
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [fetchEvents, userId]);

  return { events, loading, error, fetchEvents };
}
