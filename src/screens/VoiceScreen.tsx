import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button } from "@/components/common/Button";
import { aiProvider } from "@/services/openai.service";
import { speechService } from "@/services/speech.service";
import { useTasks } from "@/hooks/useTasks";
import { AppTheme } from "@/theme";
import { RootStackParamList } from "@/navigation/RootStack";
import { SpeechStatus } from "@/types/speech";
import { spacing } from "@/constants/spacing";
import { typography } from "@/theme/typography";
type Props = NativeStackScreenProps<RootStackParamList, "Voice"> & {
  theme: AppTheme;
};
export const VoiceScreen = ({ navigation, theme }: Props) => {
  const { addMany } = useTasks();
  const [status, setStatus] = useState<SpeechStatus>("idle");
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const process = async (value: string) => {
    setStatus("thinking");
    setError(null);
    try {
      const tasks = await aiProvider.splitTasks(value);
      if (!tasks.length) throw new Error("No actionable tasks found.");
      addMany(tasks);
      setStatus("finished");
      setTimeout(() => navigation.goBack(), 650);
    } catch {
      setStatus("error");
      setError(
        "We could not understand that. Try a short phrase or add the task manually.",
      );
    }
  };
  const start = async () => {
    setStatus("listening");
    setError(null);
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await speechService.startListening(
      (value) => {
        setTranscript(value);
        void process(value);
      },
      () => {
        setStatus("error");
        setError(
          "Voice recognition is unavailable in this build. You can still paste a phrase below.",
        );
      },
    );
  };
  const statusText =
    status === "listening"
      ? "Listening…"
      : status === "thinking"
        ? "Understanding your tasks…"
        : status === "finished"
          ? "Tasks added"
          : status === "error"
            ? "Something went wrong"
            : "Tap the microphone to begin";
  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close voice input"
          accessible
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.back, { color: theme.colors.primary }]}>
            Cancel
          </Text>
        </Pressable>
        <Text style={[styles.heading, { color: theme.colors.text }]}>
          Voice capture
        </Text>
        <View style={{ width: 55 }} />
      </View>
      <View style={styles.content}>
        <View
          style={[
            styles.pulse,
            { backgroundColor: `${theme.colors.primary}18` },
          ]}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Start voice capture"
            accessible
            onPress={() => void start()}
            disabled={status === "listening" || status === "thinking"}
            style={[styles.mic, { backgroundColor: theme.colors.primary }]}
          >
            {status === "thinking" ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <MaterialCommunityIcons
                name={status === "finished" ? "check" : "microphone"}
                size={42}
                color="#fff"
              />
            )}
          </Pressable>
        </View>
        <Text
          accessibilityLiveRegion="polite"
          style={[styles.status, { color: theme.colors.text }]}
        >
          {statusText}
        </Text>
        <Text style={[styles.subtext, { color: theme.colors.secondary }]}>
          Try “Buy milk, call Mom tomorrow, book the dentist.”
        </Text>
        <TextInput
          accessibilityLabel="Voice transcript"
          placeholder="Or type a phrase here"
          placeholderTextColor={theme.colors.secondary}
          value={transcript}
          onChangeText={setTranscript}
          multiline
          style={[
            styles.input,
            {
              color: theme.colors.text,
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
            },
          ]}
        />
        {error ? (
          <Text style={[styles.error, { color: theme.colors.danger }]}>
            {error}
          </Text>
        ) : null}
        <Button
          label="Create tasks from phrase"
          onPress={() => void process(transcript)}
          disabled={!transcript.trim() || status === "thinking"}
        />
      </View>
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
  content: {
    flex: 1,
    alignItems: "center",
    padding: spacing.xxl,
    gap: spacing.lg,
  },
  pulse: {
    width: 180,
    height: 180,
    borderRadius: 90,
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.huge,
  },
  mic: {
    width: 112,
    height: 112,
    borderRadius: 56,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  status: { ...typography.headingM, textAlign: "center" },
  subtext: { ...typography.body, textAlign: "center" },
  input: {
    width: "100%",
    minHeight: 96,
    borderWidth: 1,
    borderRadius: 12,
    padding: spacing.lg,
    ...typography.body,
  },
  error: { ...typography.caption, textAlign: "center" },
});
