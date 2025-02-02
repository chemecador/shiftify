import { useState } from "react";
import { Alert } from "react-native";
import { supabase } from "../services/supabase";

export default function useLogin(navigation) {
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
        email,
        password,
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
          username,
        });
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    loading,
    handleLogin,
  };
}
