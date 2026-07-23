import { useColorScheme } from "react-native";
import { colors } from "@/constants/colors";

export type ThemeMode = "light" | "dark" | "system";
export type ThemeColors = { [Key in keyof (typeof colors)["light"]]: string };
export type AppTheme = { mode: "light" | "dark"; colors: ThemeColors };
export const getTheme = (
  mode: ThemeMode,
  system: "light" | "dark" | null | undefined,
): AppTheme => {
  const resolved = mode === "system" ? (system ?? "light") : mode;
  return { mode: resolved, colors: colors[resolved] };
};
export { useColorScheme };
