import { Pressable, StyleSheet, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { colors } from "@/constants/colors";
export const FloatingActionButton = ({
  onPress,
  label = "Add task",
}: {
  onPress: () => void;
  label?: string;
}) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={label}
    accessible
    onPress={() => {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onPress();
    }}
    style={({ pressed }) => [styles.fab, pressed && styles.pressed]}
  >
    <MaterialCommunityIcons name="plus" size={28} color="#fff" />
    <Text style={styles.text}>New task</Text>
  </Pressable>
);
const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 20,
    bottom: 24,
    minHeight: 56,
    borderRadius: 999,
    backgroundColor: colors.light.primary,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  pressed: { transform: [{ scale: 0.96 }] },
  text: { color: "#fff", fontWeight: "700" },
});
