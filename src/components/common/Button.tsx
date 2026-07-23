import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { colors } from "@/constants/colors";
import { radii, spacing } from "@/constants/spacing";
import { typography } from "@/theme/typography";

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger";
  loading?: boolean;
  disabled?: boolean;
}
export const Button = ({
  label,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
}: ButtonProps) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={label}
    accessible
    style={({ pressed }) => [
      styles.base,
      styles[variant],
      (disabled || loading) && styles.disabled,
      pressed && styles.pressed,
    ]}
    onPress={onPress}
    disabled={disabled || loading}
  >
    {loading ? (
      <ActivityIndicator
        color={variant === "secondary" ? colors.light.primary : "#fff"}
      />
    ) : (
      <Text
        style={[styles.text, variant === "secondary" && styles.secondaryText]}
      >
        {label}
      </Text>
    )}
  </Pressable>
);
const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    borderRadius: radii.md,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
  },
  primary: { backgroundColor: colors.light.primary },
  secondary: {
    borderWidth: 1,
    borderColor: colors.light.border,
    backgroundColor: colors.light.card,
  },
  danger: { backgroundColor: colors.light.danger },
  text: { ...typography.label, color: "#fff" },
  secondaryText: { color: colors.light.primary },
  disabled: { opacity: 0.5 },
  pressed: { transform: [{ scale: 0.98 }] },
});
