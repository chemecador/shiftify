import { useState, useEffect, useCallback } from "react";
import { supabase } from "../services/supabase";

export interface EventRecord {
  type: string;
  time: string;
}

const useRecentEvents = (userId: string | number, refreshKey: number) => {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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
      setEvents(data || []);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents, refreshKey]);

  return { events, loading, error, refetch: fetchEvents };
};

export default useRecentEvents;
