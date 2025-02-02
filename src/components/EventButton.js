import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import PropTypes from "prop-types";

const EventButton = ({ text, onPress, secondary = false }) => {
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

EventButton.propTypes = {
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  secondary: PropTypes.bool,
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
