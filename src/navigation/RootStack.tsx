import { createNativeStackNavigator } from "@react-navigation/native-stack";
export type RootStackParamList = {
  Tasks: undefined;
  AddTask: undefined;
  EditTask: { taskId: string };
  Voice: undefined;
};
export const RootStack = createNativeStackNavigator<RootStackParamList>();
