module.exports = {
  preset: "jest-expo",
  testMatch: ["**/__tests__/**/*.test.ts"],
  moduleNameMapper: { "^@/(.*)$": "<rootDir>/src/$1" },
  transformIgnorePatterns: [
    "node_modules/(?!(@react-native|react-native|expo|expo-modules-core|@reduxjs|immer|redux|reselect|redux-thunk)/)",
  ],
};
