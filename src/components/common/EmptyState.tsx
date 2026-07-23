import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Button } from "./Button";
import { AppTheme } from "@/theme";
import { spacing } from "@/constants/spacing";
import { typography } from "@/theme/typography";
export const EmptyState = ({
  theme,
  onCreate,
}: {
  theme: AppTheme;
  onCreate: () => void;
}) => (
  <View style={styles.container}>
    <View
      style={[styles.icon, { backgroundColor: `${theme.colors.primary}18` }]}
    >
      <MaterialCommunityIcons
        name="check-circle-outline"
        size={48}
        color={theme.colors.primary}
      />
    </View>
    <Text style={[styles.title, { color: theme.colors.text }]}>
      Nothing on your list
    </Text>
    <Text style={[styles.body, { color: theme.colors.secondary }]}>
      Capture the small things, then enjoy the calm of getting them done.
    </Text>
    <Button label="Create your first task" onPress={onCreate} />
  </View>
);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xxxl,
    gap: spacing.lg,
  },
  icon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { ...typography.headingM, textAlign: "center" },
  body: { ...typography.body, textAlign: "center", maxWidth: 300 },
});
