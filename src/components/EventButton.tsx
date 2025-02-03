import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  GestureResponderEvent,
} from "react-native";

interface EventButtonProps {
  text: string;
  onPress: (event: GestureResponderEvent) => void;
  secondary?: boolean;
}

const EventButton: React.FC<EventButtonProps> = ({
  text,
  onPress,
  secondary = false,
}) => {
  return (
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
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
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
  shimmerButton: {
    width: "100%",
  },
});

export default EventButton;
