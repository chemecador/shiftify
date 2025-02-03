import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import useDashboard from "../hooks/useDashboard";
import { EventTypes, type EventType } from "../utils/eventTypes";
import { EventNames } from "../utils/eventNames";
import RecentEvents from "../components/RecentEvents";
import EventButton from "../components/EventButton";
import { RootStackParamList } from "../navigation/Navigator";

type DashboardScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Dashboard"
>;

function DashboardScreen({ route, navigation }: DashboardScreenProps) {
  const { userId, username } = route.params!;
  const {
    currentEventType,
    loading,
    bgColor,
    handleEvent: handleDashboardEvent,
  } = useDashboard(userId);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const insets = useSafeAreaInsets();

  const handleLogout = () => {
    navigation.replace("Login");
  };

  const handleEvent = async (eventType: EventType) => {
    await handleDashboardEvent(eventType);
    setRefreshKey((prev) => prev + 1);
  };

  const renderActionButton = () => {
    if (loading) return <ActivityIndicator size="large" />;

    const isWorking =
      currentEventType === EventTypes.CHECK_IN ||
      currentEventType === EventTypes.BREAK_END;
    const isBreaking = currentEventType === EventTypes.BREAK_START;
    const isIdle = !isWorking && !isBreaking;

    return (
      <>
        {isWorking && (
          <>
            <EventButton
              text={EventNames.BREAK_START}
              onPress={() => handleEvent(EventTypes.BREAK_START)}
            />
            <EventButton
              text={EventNames.CHECK_OUT}
              onPress={() => handleEvent(EventTypes.CHECK_OUT)}
              secondary
            />
          </>
        )}
        {isBreaking && (
          <EventButton
            text={EventNames.BREAK_END}
            onPress={() => handleEvent(EventTypes.BREAK_END)}
          />
        )}
        {isIdle && (
          <EventButton
            text={EventNames.CHECK_IN}
            onPress={() => handleEvent(EventTypes.CHECK_IN)}
          />
        )}
      </>
    );
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
      <View style={styles.header}>
        <Text style={styles.title}>Hello, {username}! 👋</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <RecentEvents userId={userId} refreshKey={refreshKey} />

      <View style={styles.actionsContainer}>{renderActionButton()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1E293B",
  },
  logoutText: {
    color: "#3B82F6",
    fontSize: 16,
    fontWeight: "600",
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

export default DashboardScreen;
