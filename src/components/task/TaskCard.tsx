import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Task } from "@/types/task";
import { formatDueDate, isOverdue, isToday } from "@/utils/date";
import { AppTheme } from "@/theme";
import { radii, spacing } from "@/constants/spacing";
import { typography } from "@/theme/typography";
interface TaskCardProps {
  task: Task;
  theme: AppTheme;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: () => void;
}
export const TaskCard = memo(
  ({ task, theme, onToggle, onDelete, onEdit }: TaskCardProps) => (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <Pressable
        accessibilityRole="checkbox"
        accessibilityLabel={`${task.completed ? "Mark incomplete" : "Mark complete"}: ${task.title}`}
        accessible
        onPress={() => {
          void Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Success,
          );
          onToggle();
        }}
        style={styles.checkbox}
      >
        {
          <MaterialCommunityIcons
            name={
              task.completed
                ? "checkbox-marked-circle"
                : "checkbox-blank-circle-outline"
            }
            size={28}
            color={
              task.completed ? theme.colors.success : theme.colors.secondary
            }
          />
        }
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Edit ${task.title}`}
        accessible
        onPress={onEdit}
        style={styles.content}
      >
        <Text
          numberOfLines={2}
          style={[
            styles.title,
            { color: theme.colors.text },
            task.completed && styles.completed,
          ]}
        >
          {task.title}
        </Text>
        {task.description ? (
          <Text
            numberOfLines={2}
            style={[styles.description, { color: theme.colors.secondary }]}
          >
            {task.description}
          </Text>
        ) : null}
        {task.dueDate ? (
          <Text
            style={[
              styles.due,
              {
                color: isOverdue(task.dueDate, task.completed)
                  ? theme.colors.danger
                  : isToday(task.dueDate)
                    ? theme.colors.primary
                    : theme.colors.secondary,
              },
            ]}
          >
            <MaterialCommunityIcons name="calendar-outline" size={14} />{" "}
            {formatDueDate(task.dueDate)}
          </Text>
        ) : null}
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Delete ${task.title}`}
        accessible
        onPress={onDelete}
        style={styles.action}
      >
        <MaterialCommunityIcons
          name="trash-can-outline"
          size={22}
          color={theme.colors.danger}
        />
      </Pressable>
    </View>
  ),
);
const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: radii.lg,
    padding: spacing.lg,
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "flex-start",
    marginBottom: spacing.md,
  },
  checkbox: {
    minWidth: 36,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  content: { flex: 1, gap: spacing.xs, minHeight: 44 },
  title: { ...typography.body, fontWeight: "600" },
  completed: { textDecorationLine: "line-through", opacity: 0.6 },
  description: { ...typography.caption },
  due: { ...typography.caption, marginTop: spacing.xs },
  action: {
    minWidth: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
});
