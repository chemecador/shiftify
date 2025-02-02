import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { supabase } from "../services/supabase";
import PropTypes from "prop-types";

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (username.trim() === "" || password.trim() === "") {
      Alert.alert("Error", "Please enter both username and password.");
      return;
    }

    const email = `${username}@shiftify.com`;
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        Alert.alert("Login Failed", error.message);
      } else {
        const user = data?.session?.user || data?.user;

        if (!user) {
          console.warn(
            "No se encontró el usuario. data.user:",
            data?.user,
            "data.session.user:",
            data?.session?.user,
          );
          Alert.alert(
            "Error",
            "No se encontró el usuario en la respuesta de Supabase",
          );
          return;
        }
        navigation.replace("Dashboard", {
          userId: user.id,
          username: username,
        });
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shiftify</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
LoginScreen.propTypes = {
  navigation: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F4F6F8",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 40,
    color: "#333",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#FFF",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#DDD",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
