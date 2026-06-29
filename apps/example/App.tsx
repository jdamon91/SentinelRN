import type { PolicyMode } from "@sentinelrn/core";
import { SentinelProvider } from "@sentinelrn/react";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { Card } from "./src/components/Card";
import { IntegrityCard } from "./src/components/IntegrityCard";
import { PolicySelector } from "./src/components/PolicySelector";
import { PromptGuardCard } from "./src/components/PromptGuardCard";
import type { DemoScenario } from "./src/demoProvider";
import { colors } from "./src/theme";

/**
 * SentinelRN example app.
 *
 * Demonstrates the full MVP: structured integrity reports with scoring and
 * signal explanations, AI prompt guarding + redaction, and live policy-mode
 * switching across both. Integrity uses a demo provider so the report UI is
 * meaningful without a rooted/jailbroken device.
 */
export default function App() {
  const [policyMode, setPolicyMode] = useState<PolicyMode>("warn");
  const [scenario, setScenario] = useState<DemoScenario>("jailbroken");

  return (
    <SentinelProvider config={{ policy: policyMode, ai: { includeFindings: false } }}>
      <SafeAreaView style={styles.safe}>
        <StatusBar style="light" />
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <Text style={styles.brand}>SentinelRN</Text>
            <Text style={styles.tagline}>Runtime Integrity & AI Security for React Native</Text>
          </View>

          <Card
            title="Policy Mode"
            subtitle="Controls how detected risk is enforced across integrity and AI."
          >
            <PolicySelector value={policyMode} onChange={setPolicyMode} />
          </Card>

          <IntegrityCard
            scenario={scenario}
            onScenarioChange={setScenario}
            policyMode={policyMode}
          />

          <PromptGuardCard policyMode={policyMode} />

          <Text style={styles.footer}>
            SentinelRN is a risk-based framework. Detection is probabilistic — always enforce trust
            on the server too.
          </Text>
        </ScrollView>
      </SafeAreaView>
    </SentinelProvider>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 48 },
  header: { marginBottom: 20, marginTop: 8 },
  brand: { color: colors.text, fontSize: 30, fontWeight: "800" },
  tagline: { color: colors.textMuted, fontSize: 14, marginTop: 4 },
  footer: { color: colors.textMuted, fontSize: 12, textAlign: "center", marginTop: 8 },
});
