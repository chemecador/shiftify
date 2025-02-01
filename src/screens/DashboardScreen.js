import React, { useEffect, useState, useCallback } from "react";
import { setInterval, clearInterval } from "react-native";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from "react-native";
import { supabase } from "../services/supabase";

const STATUS_COLORS = {
  "Not Checked In": "#FF3B30",
  Working: "#34C759",
  "On Break": "#FF9500",
  "Checked Out": "#8E8E93",
};

export default function DashboardScreen({ route }) {
  const { userId, username } = route.params;

  const [status, setStatus] = useState("Loading...");
  const [loading, setLoading] = useState(true);
  const [timeElapsed, setTimeElapsed] = useState("00:00:00");
  const [dailySummary, setDailySummary] = useState({
    workHours: 0,
    breakHours: 0,
  });

  const fetchCurrentStatus = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("event_type")
        .eq("user_id", userId)
        .order("event_time", { ascending: false })
        .limit(1);

      if (error) throw error;

      if (!data || data.length === 0) {
        setStatus("Not Checked In");
      } else {
        updateStatus(data[0].event_type);
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  }, [userId]);

  const updateStatus = (eventType) => {
    const statusMap = {
      check_in: "Working",
      break_start: "On Break",
      break_end: "Working",
      check_out: "Checked Out",
    };
    setStatus(statusMap[eventType] || "Unknown Status");
  };

  const handleEvent = async (eventType) => {
    try {
      setLoading(true);
      Alert.alert("Atención", "Todavía no se puede fichar");
      /*
      const { data: lastEvent } = await supabase
        .from("events")
        .select("event_type")
        .eq("user_id", userId)
        .order("event_time", { ascending: false })
        .limit(1);

      const lastEventType = lastEvent?.[0]?.event_type;
      validateWorkflow(lastEventType, eventType);

      const { error } = await supabase.from("events").insert([
        {
          user_id: userId,
          event_type: eventType,
          event_time: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      await Promise.all([fetchCurrentStatus(), fetchDailySummary()]);
      */
    } catch (error) {
      console.error("Error handling event:", error);
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const validateWorkflow = (lastEventType, newEventType) => {
    const invalidFlows = {
      break_start: lastEventType !== "check_in",
      break_end: lastEventType !== "break_start",
      check_out: !["check_in", "break_end"].includes(lastEventType),
    };

    if (invalidFlows[newEventType]) {
      throw new Error("Acción no permitida en el flujo actual");
    }
  };

  const fetchDailySummary = useCallback(async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const { data } = await supabase
        .from("events")
        .select("*")
        .eq("user_id", userId)
        .gte("event_time", `${today}T00:00:00`)
        .lte("event_time", `${today}T23:59:59`)
        .order("event_time", { ascending: true });

      let totalWork = 0;
      let totalBreaks = 0;
      let currentStart = null;

      data?.forEach((event, index) => {
        const eventTime = new Date(event.event_time);

        if (["check_in", "break_end"].includes(event.event_type)) {
          currentStart = eventTime;
        } else if (currentStart) {
          const diff = (eventTime - currentStart) / 1000;

          if (event.event_type === "break_start") {
            totalWork += diff;
          } else if (event.event_type === "check_out") {
            totalWork += diff;
          } else if (event.event_type === "break_end") {
            totalBreaks += diff;
          }

          currentStart = null;
        }
      });

      setDailySummary({
        workHours: (totalWork / 3600).toFixed(1),
        breakHours: (totalBreaks / 3600).toFixed(1),
      });
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
  }, [userId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await fetchCurrentStatus();
        await fetchDailySummary();
      } catch (error) {
        console.error("Error fetching data:", error);
        Alert.alert("Error", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const subscription = supabase
      .channel("real-time-events")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "events" },
        (payload) => {
          if (payload.new.user_id === userId) {
            fetchCurrentStatus();
            fetchDailySummary();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [userId, fetchCurrentStatus, fetchDailySummary]);

  useEffect(() => {
    let interval;
    if (["Working", "On Break"].includes(status)) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => {
          const [h, m, s] = prev.split(":").map(Number);
          const newSeconds = s + 1;
          return `${String(
            h + Math.floor((m + Math.floor(newSeconds / 60)) / 60)
          ).padStart(2, "0")}:${String(
            (m + Math.floor(newSeconds / 60)) % 60
          ).padStart(2, "0")}:${String(newSeconds % 60).padStart(2, "0")}`;
        });
      }, 1000);
    }
    return () => {
      if (interval !== undefined) {
        clearInterval(interval);
      }
    };
  }, [status]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{username}</Text>

        <View style={styles.statusContainer}>
          <Text style={styles.statusLabel}>Estado Actual:</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: STATUS_COLORS[status] },
            ]}
          >
            <Text style={styles.statusText}>{status}</Text>
          </View>
        </View>

        {["Working", "On Break"].includes(status) && (
          <Text style={styles.timer}>{timeElapsed}</Text>
        )}

        <View style={styles.buttonsContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#007AFF" />
          ) : (
            <>
              {(status === "Not Checked In" || status === "Checked Out") && (
                <ActionButton
                  label="Fichar Entrada"
                  onPress={() => handleEvent("check_in")}
                  color={STATUS_COLORS.Working}
                />
              )}

              {status === "Working" && (
                <>
                  <ActionButton
                    label="Iniciar Pausa"
                    onPress={() => handleEvent("break_start")}
                    color={STATUS_COLORS["On Break"]}
                  />
                  <ActionButton
                    label="Fichar Salida"
                    onPress={() => handleEvent("check_out")}
                    color={STATUS_COLORS["Checked Out"]}
                  />
                </>
              )}

              {status === "On Break" && (
                <ActionButton
                  label="Finalizar Pausa"
                  onPress={() => handleEvent("break_end")}
                  color={STATUS_COLORS.Working}
                />
              )}
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const ActionButton = ({ label, onPress, color }) => (
  <TouchableOpacity
    style={[styles.button, { backgroundColor: color }]}
    onPress={onPress}
  >
    <Text style={styles.buttonText}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1A1A1A",
    marginVertical: 20,
  },
  statusContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  statusLabel: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  statusBadge: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },
  timer: {
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1A1A1A",
    marginVertical: 20,
  },
  buttonsContainer: {
    marginTop: 20,
  },
  button: {
    borderRadius: 10,
    paddingVertical: 15,
    marginVertical: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
