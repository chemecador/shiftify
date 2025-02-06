import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import DashboardScreen from "../screens/DashboardScreen";
import EventScreen from "../screens/EventsScreen";
export type RootStackParamList = {
  Login: undefined;
  Dashboard: { userId: string; username: string };
  EventScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Navigator(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EventScreen"
          component={EventScreen}
          options={{ title: "Events", headerBackTitle: "Back" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
