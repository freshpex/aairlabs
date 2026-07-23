import { forwardRef } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import { spacing } from "@/constants/spacing";
import { typography } from "@/theme/typography";
import { AppTheme } from "@/theme";
interface TextFieldProps extends TextInputProps {
  label: string;
  error?: string;
  theme: AppTheme;
}
export const TextField = forwardRef<TextInput, TextFieldProps>(
  ({ label, error, theme, ...props }, ref) => (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.colors.text }]}>{label}</Text>
      <TextInput
        ref={ref}
        accessibilityLabel={label}
        accessible
        placeholderTextColor={theme.colors.secondary}
        style={[
          styles.input,
          {
            color: theme.colors.text,
            borderColor: error ? theme.colors.danger : theme.colors.border,
            backgroundColor: theme.colors.card,
          },
        ]}
        {...props}
      />
      <>
        {error ? (
          <Text style={[styles.error, { color: theme.colors.danger }]}>
            {error}
          </Text>
        ) : null}
      </>
    </View>
  ),
);
TextField.displayName = "TextField";
const styles = StyleSheet.create({
  container: { gap: spacing.sm },
  label: { ...typography.label },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    minHeight: 50,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    ...typography.body,
  },
  error: { ...typography.caption },
});
