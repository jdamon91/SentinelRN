import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme.js";

interface BadgeProps {
  label: string;
  color?: string;
}

/** A small colored pill used for severity/confidence/risk labels. */
export function Badge({ label, color = colors.accent }: BadgeProps) {
  return (
    <View style={[styles.badge, { borderColor: color }]}>
      <Text style={[styles.text, { color }]}>{label.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
