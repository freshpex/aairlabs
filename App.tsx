import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import { AppNavigator } from "@/navigation/AppNavigator";
import { store } from "@/store/store";
import { useTheme } from "@/hooks/useTheme";
const Application = () => {
  const { theme, mode, setTheme } = useTheme();
  const toggleTheme = () => setTheme(mode === "dark" ? "light" : "dark");
  return (
    <>
      <StatusBar style={theme.mode === "dark" ? "light" : "dark"} />
      <AppNavigator theme={theme} toggleTheme={toggleTheme} />
    </>
  );
};
export default function App() {
  return (
    <Provider store={store}>
      <Application />
    </Provider>
  );
}
