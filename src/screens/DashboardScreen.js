import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import PropTypes from "prop-types";
import useDashboard from "../hooks/useDashboard";
import { EventTypes } from "../utils/eventTypes";
import { EventNames } from "../utils/eventNames";
import RecentEvents from "../components/RecentEvents";

export default function DashboardScreen({ route }) {
  const { userId, username } = route.params;
  const {
    currentEventType,
    loading,
    bgColor,
    handleEvent: handleDashboardEvent,
  } = useDashboard(userId);
  const [refreshKey, setRefreshKey] = useState(0);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const handleLogout = () => {
    navigation.replace("Login");
  };

  const handleEvent = async (eventType) => {
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
        )}
        {isBreaking && (
          <ActionButton
            text={EventNames.BREAK_END}
            onPress={() => handleEvent(EventTypes.BREAK_END)}
          />
        )}
        {isIdle && (
          <ActionButton
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

DashboardScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      userId: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

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

export { ActionButton };
