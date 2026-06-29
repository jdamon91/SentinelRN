import type { PolicyMode } from "@sentinelrn/core";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme";

const MODES: PolicyMode[] = ["monitor", "warn", "block"];

interface PolicySelectorProps {
  value: PolicyMode;
  onChange: (mode: PolicyMode) => void;
}

/** Segmented control for choosing the active policy mode. */
export function PolicySelector({ value, onChange }: PolicySelectorProps) {
  return (
    <View style={styles.row}>
      {MODES.map((mode) => {
        const active = mode === value;
        return (
          <Pressable
            key={mode}
            onPress={() => onChange(mode)}
            style={[styles.item, active && styles.itemActive]}
          >
            <Text style={[styles.label, active && styles.labelActive]}>{mode}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    backgroundColor: colors.surfaceAlt,
    borderRadius: 10,
    padding: 4,
    gap: 4,
  },
  item: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  itemActive: {
    backgroundColor: colors.accent,
  },
  label: {
    color: colors.textMuted,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  labelActive: {
    color: "#fff",
  },
});
