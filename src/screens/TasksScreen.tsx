import { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { TaskCard } from "@/components/task/TaskCard";
import { EmptyState } from "@/components/common/EmptyState";
import { FloatingActionButton } from "@/components/common/FloatingActionButton";
import { useTasks } from "@/hooks/useTasks";
import { AppTheme } from "@/theme";
import { RootStackParamList } from "@/navigation/RootStack";
import { spacing } from "@/constants/spacing";
import { typography } from "@/theme/typography";
import { TaskSort } from "@/types/task";
type Props = NativeStackScreenProps<RootStackParamList, "Tasks"> & {
  theme: AppTheme;
  toggleTheme: () => void;
};
export const TasksScreen = ({ navigation, theme, toggleTheme }: Props) => {
  const {
    items,
    allItems,
    status,
    query,
    setQuery,
    sort,
    setSort,
    update,
    remove,
  } = useTasks();
  const [searchOpen, setSearchOpen] = useState(false);
  const sortOptions: TaskSort[] = useMemo(
    () => ["newest", "dueDate", "alphabetical", "completed"],
    [],
  );
  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.header}>
        <View>
          <Text style={[styles.eyebrow, { color: theme.colors.primary }]}>
            YOUR DAY, SIMPLIFIED
          </Text>
          <Text style={[styles.heading, { color: theme.colors.text }]}>
            Tasks
          </Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Toggle dark mode"
            accessible
            onPress={toggleTheme}
            style={styles.icon}
          >
            <MaterialCommunityIcons
              name={theme.mode === "dark" ? "weather-sunny" : "weather-night"}
              size={24}
              color={theme.colors.text}
            />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Search tasks"
            accessible
            onPress={() => setSearchOpen((value) => !value)}
            style={styles.icon}
          >
            <MaterialCommunityIcons
              name="magnify"
              size={26}
              color={theme.colors.text}
            />
          </Pressable>
        </View>
      </View>
      {searchOpen ? (
        <View
          style={[
            styles.search,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <MaterialCommunityIcons
            name="magnify"
            size={20}
            color={theme.colors.secondary}
          />
          <TextInput
            autoFocus
            accessibilityLabel="Search tasks"
            placeholder="Search tasks"
            placeholderTextColor={theme.colors.secondary}
            value={query}
            onChangeText={setQuery}
            style={[styles.searchInput, { color: theme.colors.text }]}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Clear search"
            accessible
            onPress={() => setQuery("")}
          >
            <MaterialCommunityIcons
              name="close"
              size={20}
              color={theme.colors.secondary}
            />
          </Pressable>
        </View>
      ) : null}
      <View style={styles.sortRow}>
        {sortOptions.map((option) => (
          <Pressable
            key={option}
            accessibilityRole="button"
            accessibilityLabel={`Sort by ${option}`}
            accessible
            onPress={() => setSort(option)}
            style={[
              styles.chip,
              {
                borderColor:
                  sort === option ? theme.colors.primary : theme.colors.border,
                backgroundColor:
                  sort === option
                    ? `${theme.colors.primary}14`
                    : theme.colors.card,
              },
            ]}
          >
            <Text
              style={{
                color:
                  sort === option
                    ? theme.colors.primary
                    : theme.colors.secondary,
              }}
            >
              {option === "dueDate"
                ? "Due date"
                : option[0]?.toUpperCase() + option.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>
      {status === "loading" ? (
        <Text style={[styles.status, { color: theme.colors.secondary }]}>
          Restoring your tasks…
        </Text>
      ) : allItems.length === 0 ? (
        <EmptyState
          theme={theme}
          onCreate={() => navigation.navigate("AddTask")}
        />
      ) : items.length === 0 ? (
        <Text style={[styles.status, { color: theme.colors.secondary }]}>
          No tasks match “{query}”.
        </Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(task) => task.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TaskCard
              task={item}
              theme={theme}
              onToggle={() => update(item.id, { completed: !item.completed })}
              onDelete={() => remove(item.id)}
              onEdit={() =>
                navigation.navigate("EditTask", { taskId: item.id })
              }
            />
          )}
        />
      )}
      {status !== "loading" ? (
        <FloatingActionButton onPress={() => navigation.navigate("AddTask")} />
      ) : null}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  eyebrow: { ...typography.caption, letterSpacing: 1.2, fontWeight: "700" },
  heading: { ...typography.headingXL },
  headerActions: { flexDirection: "row", gap: spacing.sm },
  icon: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  search: {
    marginHorizontal: spacing.xxl,
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  searchInput: { flex: 1, ...typography.body },
  sortRow: {
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.md,
    flexDirection: "row",
    gap: spacing.sm,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  list: { padding: spacing.xxl, paddingTop: spacing.sm, paddingBottom: 100 },
  status: { textAlign: "center", margin: spacing.xxxl, ...typography.body },
});
