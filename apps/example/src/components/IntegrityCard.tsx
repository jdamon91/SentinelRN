import type { PolicyMode } from "@sentinelrn/core";
import { useDeviceIntegrity, useSentinel, useSentinelPolicy } from "@sentinelrn/react";
import { useEffect } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { createDemoProvider, type DemoScenario } from "../demoProvider.js";
import { colors, riskColor, severityColor } from "../theme.js";
import { Badge } from "./Badge.js";
import { Card } from "./Card.js";

const SCENARIOS: DemoScenario[] = ["clean", "jailbroken", "rooted", "emulator"];

interface IntegrityCardProps {
  scenario: DemoScenario;
  onScenarioChange: (scenario: DemoScenario) => void;
  policyMode: PolicyMode;
}

/** Demonstrates runtime-integrity reporting, scoring, and policy decisions. */
export function IntegrityCard({ scenario, onScenarioChange, policyMode }: IntegrityCardProps) {
  const sentinel = useSentinel();
  const { report, loading, refresh, compromised, riskLevel } = useDeviceIntegrity({ auto: false });
  const { evaluateIntegrity } = useSentinelPolicy();

  // Swap the demo provider whenever the selected scenario changes, then re-check.
  useEffect(() => {
    sentinel.registerIntegrityProvider(createDemoProvider(scenario));
    void refresh();
  }, [scenario, sentinel, refresh]);

  const decision = report ? evaluateIntegrity(report, policyMode) : null;

  return (
    <Card
      title="Runtime Integrity"
      subtitle="Pick a simulated device state. The report, score, and policy decision update live."
    >
      <View style={styles.scenarioRow}>
        {SCENARIOS.map((s) => {
          const active = s === scenario;
          return (
            <Pressable
              key={s}
              onPress={() => onScenarioChange(s)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{s}</Text>
            </Pressable>
          );
        })}
      </View>

      {loading || !report ? (
        <ActivityIndicator color={colors.accent} style={{ marginVertical: 24 }} />
      ) : (
        <View>
          <View style={styles.scoreRow}>
            <View style={[styles.scoreCircle, { borderColor: riskColor(riskLevel) }]}>
              <Text style={[styles.scoreValue, { color: riskColor(riskLevel) }]}>
                {report.score}
              </Text>
              <Text style={styles.scoreMax}>/ 100</Text>
            </View>
            <View style={{ flex: 1, gap: 6 }}>
              <Badge label={riskLevel} color={riskColor(riskLevel)} />
              <Text style={styles.metaText}>
                {compromised ? "Device appears compromised" : "No compromise detected"}
              </Text>
              <Text style={styles.metaMuted}>Recommended: {report.recommendedAction}</Text>
            </View>
          </View>

          {report.signals.length === 0 ? (
            <Text style={styles.metaMuted}>No integrity signals detected.</Text>
          ) : (
            report.signals.map((signal) => (
              <View key={signal.id} style={styles.signal}>
                <View style={styles.signalHeader}>
                  <Text style={styles.signalType}>{signal.type}</Text>
                  <View style={styles.badges}>
                    <Badge label={signal.severity} color={severityColor(signal.severity)} />
                    <Badge label={`conf ${signal.confidence}`} color={colors.textMuted} />
                  </View>
                </View>
                <Text style={styles.signalMessage}>{signal.message}</Text>
              </View>
            ))
          )}

          {decision ? (
            <View
              style={[
                styles.decision,
                { borderColor: decision.allowed ? colors.low : colors.critical },
              ]}
            >
              <Text style={styles.decisionTitle}>
                Policy "{policyMode}": {decision.allowed ? "ALLOWED" : "BLOCKED"}
              </Text>
              {decision.reasons.map((reason) => (
                <Text key={reason} style={styles.reason}>
                  • {reason}
                </Text>
              ))}
            </View>
          ) : null}
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  scenarioRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  chipText: { color: colors.textMuted, fontWeight: "600", textTransform: "capitalize" },
  chipTextActive: { color: "#fff" },
  scoreRow: { flexDirection: "row", alignItems: "center", gap: 16, marginBottom: 16 },
  scoreCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  scoreValue: { fontSize: 26, fontWeight: "800" },
  scoreMax: { color: colors.textMuted, fontSize: 11 },
  metaText: { color: colors.text, fontWeight: "600" },
  metaMuted: { color: colors.textMuted, fontSize: 13 },
  signal: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
  },
  signalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  signalType: { color: colors.text, fontWeight: "700", textTransform: "capitalize" },
  badges: { flexDirection: "row", gap: 6 },
  signalMessage: { color: colors.textMuted, fontSize: 13, marginTop: 6 },
  decision: {
    marginTop: 16,
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
  },
  decisionTitle: { color: colors.text, fontWeight: "700", marginBottom: 6 },
  reason: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
});
