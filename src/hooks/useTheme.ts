import { useCallback, useEffect, useMemo, useState } from "react";
import { useColorScheme } from "react-native";
import { storageService } from "@/services/storage.service";
import { getTheme, ThemeMode } from "@/theme";
export const useTheme = () => {
  const system = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>("system");
  useEffect(() => {
    void storageService.loadTheme().then((value) => {
      if (value) setMode(value);
    });
  }, []);
  const setTheme = useCallback((next: ThemeMode) => {
    setMode(next);
    void storageService.saveTheme(next);
  }, []);
  return {
    theme: useMemo(() => getTheme(mode, system), [mode, system]),
    mode,
    setTheme,
  };
};
