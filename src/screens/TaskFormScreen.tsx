import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { z } from "zod";
import { Button } from "@/components/common/Button";
import { TextField } from "@/components/common/TextField";
import { useTasks } from "@/hooks/useTasks";
import { AppTheme } from "@/theme";
import { RootStackParamList } from "@/navigation/RootStack";
import { spacing } from "@/constants/spacing";
import { typography } from "@/theme/typography";
const schema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "A title is required.")
    .max(160, "Keep the title under 160 characters."),
  description: z
    .string()
    .max(2000, "Keep the description under 2,000 characters."),
  dueDate: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;
type Props = NativeStackScreenProps<
  RootStackParamList,
  "AddTask" | "EditTask"
> & { theme: AppTheme };
export const TaskFormScreen = ({ navigation, route, theme }: Props) => {
  const { allItems, add, update } = useTasks();
  const taskId = route.name === "EditTask" ? route.params?.taskId : undefined;
  const existing = taskId
    ? allItems.find((task) => task.id === taskId)
    : undefined;
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      title: existing?.title ?? "",
      description: existing?.description ?? "",
      dueDate: existing?.dueDate?.slice(0, 10) ?? "",
    },
  });
  useEffect(() => {
    if (existing)
      reset({
        title: existing.title,
        description: existing.description,
        dueDate: existing.dueDate?.slice(0, 10) ?? "",
      });
  }, [existing, reset]);
  const onSubmit = async (values: FormValues) => {
    const result = schema.safeParse(values);
    if (!result.success) return;
    if (existing) update(existing.id, result.data);
    else add({ ...result.data, source: "manual" });
    navigation.goBack();
  };
  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.colors.background }]}
    >
      <KeyboardAvoidingView
        style={styles.safe}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            accessible
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.back, { color: theme.colors.primary }]}>
              ‹ Back
            </Text>
          </Pressable>
          <Text style={[styles.heading, { color: theme.colors.text }]}>
            {existing ? "Edit task" : "New task"}
          </Text>
          <View style={styles.spacer} />
        </View>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                theme={theme}
                label="Title"
                placeholder="What needs doing?"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoFocus={!existing}
                error={errors.title?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value } }) => (
              <TextField
                theme={theme}
                label="Description (optional)"
                placeholder="Add useful context"
                value={value}
                onChangeText={onChange}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            )}
          />
          <Controller
            control={control}
            name="dueDate"
            render={({ field: { onChange, value } }) => (
              <TextField
                theme={theme}
                label="Due date (optional)"
                placeholder="YYYY-MM-DD"
                value={value}
                onChangeText={onChange}
                error={errors.dueDate?.message}
              />
            )}
          />
          <View style={styles.hint}>
            <Text style={[styles.hintText, { color: theme.colors.secondary }]}>
              Tip: Use a clear verb at the start of your task. It makes your
              list easier to scan.
            </Text>
          </View>
          <Button
            label={existing ? "Save changes" : "Create task"}
            onPress={() => void handleSubmit(onSubmit)()}
            loading={isSubmitting}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    padding: spacing.xxl,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  back: { ...typography.body },
  heading: { ...typography.headingM },
  spacer: { width: 50 },
  content: { padding: spacing.xxl, gap: spacing.xxl },
  hint: { padding: spacing.lg, borderRadius: 12, backgroundColor: "#2563EB12" },
  hintText: { ...typography.caption, lineHeight: 20 },
});
