import * as Speech from "expo-speech";
export interface SpeechService {
  startListening(
    onResult: (text: string) => void,
    onError: (error: Error) => void,
  ): Promise<void>;
  stopListening(): Promise<void>;
}
/** Expo Go has text-to-speech but not native speech recognition; this adapter keeps UI independent of the provider. */
export const speechService: SpeechService = {
  startListening: async (_onResult, onError) => {
    onError(
      new Error(
        "Speech recognition requires a development build with a recognition provider.",
      ),
    );
  },
  stopListening: async () => {
    await Speech.stop();
  },
};
