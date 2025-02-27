import React, { ReactNode } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";

const GradientBackground = ({ children }: { children: ReactNode }) => (
  <LinearGradient
    start={{ x: 0.2, y: 0.8 }}
    end={{ x: 0.2, y: 0.805 }}
    colors={["#78C6FF", "#3CBB50"]}
    style={{ flex: 1 }}
  >
    <SafeAreaView style={styles.content}>{children}</SafeAreaView>
  </LinearGradient>
);

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: "stretch",
    textAlign: "center",
  },
});

export default GradientBackground;
