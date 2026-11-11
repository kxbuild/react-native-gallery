import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useTheme } from './theme';

/** Scrollable page body used by most demos. */
export function Page({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={styles.page}
      keyboardShouldPersistTaps="handled">
      {children}
    </ScrollView>
  );
}

/** A titled card that groups one variant of a component. */
export function Section({ title, note, children, style }: { title: string; note?: string; children: React.ReactNode; style?: ViewStyle }) {
  const theme = useTheme();
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.secondaryText }]}>{title.toUpperCase()}</Text>
      <View style={[styles.card, { backgroundColor: theme.card }, style]}>{children}</View>
      {note ? <Text style={[styles.note, { color: theme.secondaryText }]}>{note}</Text> : null}
    </View>
  );
}

export function Label({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  return <Text style={[styles.label, { color: theme.text }]}>{children}</Text>;
}

export function Caption({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  return <Text style={[styles.caption, { color: theme.secondaryText }]}>{children}</Text>;
}

type ButtonKind = 'filled' | 'tinted' | 'plain' | 'danger';

/** A button built from Pressable, showing pressed and disabled states. */
export function Button({ title, onPress, kind = 'filled', disabled }: { title: string; onPress?: () => void; kind?: ButtonKind; disabled?: boolean }) {
  const theme = useTheme();
  const bg: Record<ButtonKind, string> = {
    filled: theme.accent,
    tinted: theme.dark ? '#0A84FF33' : '#0A84FF1F',
    plain: 'transparent',
    danger: theme.danger,
  };
  const fg = kind === 'filled' || kind === 'danger' ? theme.accentText : theme.accent;
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: bg[kind], opacity: disabled ? 0.4 : pressed ? 0.6 : 1 },
      ]}>
      <Text style={[styles.buttonText, { color: fg }]}>{title}</Text>
    </Pressable>
  );
}

export function Row({ children, wrap }: { children: React.ReactNode; wrap?: boolean }) {
  return <View style={[styles.row, wrap && styles.wrap]}>{children}</View>;
}

export const styles = StyleSheet.create({
  page: { padding: 16, paddingBottom: 48 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 13, marginLeft: 12, marginBottom: 6 },
  card: { borderRadius: 12, padding: 16, overflow: 'hidden' },
  note: { fontSize: 13, marginTop: 6, marginHorizontal: 12, lineHeight: 18 },
  label: { fontSize: 17 },
  caption: { fontSize: 13, marginTop: 4 },
  button: { alignSelf: 'flex-start', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10, alignItems: 'center', marginRight: 8, marginBottom: 8 },
  buttonText: { fontSize: 16, fontWeight: '600' },
  row: { flexDirection: 'row', alignItems: 'center' },
  wrap: { flexWrap: 'wrap' },
});
