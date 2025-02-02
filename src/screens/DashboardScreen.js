import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PropTypes from "prop-types";
import useDashboard from "../hooks/useDashboard";
import { EventTypes } from "../utils/eventTypes";
import { EventNames } from "../utils/eventNames";

export default function DashboardScreen({ route }) {
  const { userId, username } = route.params;
  const { currentEventType, loading, bgColor, handleEvent } =
    useDashboard(userId);
  const insets = useSafeAreaInsets();

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
