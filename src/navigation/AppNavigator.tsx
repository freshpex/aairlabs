import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { TasksScreen } from "@/screens/TasksScreen";
import { TaskFormScreen } from "@/screens/TaskFormScreen";
import { VoiceScreen } from "@/screens/VoiceScreen";
import { AppTheme } from "@/theme";
import { RootStack } from "./RootStack";
export const AppNavigator = ({
  theme,
  toggleTheme,
}: {
  theme: AppTheme;
  toggleTheme: () => void;
}) => (
  <NavigationContainer theme={theme.mode === "dark" ? DarkTheme : DefaultTheme}>
    <RootStack.Navigator
      screenOptions={{ headerShown: false, animation: "slide_from_right" }}
    >
      <RootStack.Screen name="Tasks">
        {(props) => (
          <TasksScreen {...props} theme={theme} toggleTheme={toggleTheme} />
        )}
      </RootStack.Screen>
      <RootStack.Screen name="AddTask">
        {(props) => <TaskFormScreen {...props} theme={theme} />}
      </RootStack.Screen>
      <RootStack.Screen name="EditTask">
        {(props) => <TaskFormScreen {...props} theme={theme} />}
      </RootStack.Screen>
      <RootStack.Screen name="Voice">
        {(props) => <VoiceScreen {...props} theme={theme} />}
      </RootStack.Screen>
    </RootStack.Navigator>
  </NavigationContainer>
);
