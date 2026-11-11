import React, { useEffect, useState } from 'react';
import {
  AccessibilityInfo,
  AppState,
  Appearance,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  PixelRatio,
  Platform,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Caption, Label, Page, Row, Section } from '../ui';
import { useTheme } from '../theme';

function InfoRow({ name, value }: { name: string; value: string }) {
  const theme = useTheme();
  return (
    <View style={[styles.info, { borderColor: theme.border }]}>
      <Text style={{ color: theme.secondaryText, fontSize: 15 }}>{name}</Text>
      <Text style={{ color: theme.text, fontSize: 15, fontVariant: ['tabular-nums'] }}>{value}</Text>
    </View>
  );
}

export function DeviceInfoDemo() {
  const { width, height, fontScale, scale } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const [appState, setAppState] = useState(AppState.currentState);
  const [stateLog, setStateLog] = useState<string[]>([]);
  const [reduceMotion, setReduceMotion] = useState<boolean | null>(null);
  const [screenReader, setScreenReader] = useState<boolean | null>(null);

  useEffect(() => {
    const sub = AppState.addEventListener('change', s => {
      setAppState(s);
      setStateLog(l => [`${new Date().toLocaleTimeString()}  ${s}`, ...l].slice(0, 5));
    });
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    AccessibilityInfo.isScreenReaderEnabled().then(setScreenReader);
    return () => sub.remove();
  }, []);

  const constants = Platform.constants as { osVersion?: string; systemName?: string; interfaceIdiom?: string; reactNativeVersion?: { major: number; minor: number; patch: number } };
  const rn = constants.reactNativeVersion;

  return (
    <Page>
      <Section title="Platform">
        <InfoRow name="OS" value={`${constants.systemName ?? Platform.OS} ${Platform.Version}`} />
        <InfoRow name="Idiom" value={constants.interfaceIdiom ?? '—'} />
        <InfoRow name="React Native" value={rn ? `${rn.major}.${rn.minor}.${rn.patch}` : '—'} />
        <InfoRow name="Hermes" value={(globalThis as { HermesInternal?: unknown }).HermesInternal ? 'yes' : 'no'} />
        <InfoRow name="New Architecture" value={(globalThis as { nativeFabricUIManager?: unknown }).nativeFabricUIManager ? 'Fabric' : 'legacy'} />
      </Section>
      <Section title="Screen" note="useWindowDimensions updates on rotation.">
        <InfoRow name="Window" value={`${Math.round(width)} × ${Math.round(height)} pt`} />
        <InfoRow name="Pixel ratio" value={`${scale}× (${PixelRatio.getPixelSizeForLayoutSize(width)} px wide)`} />
        <InfoRow name="Font scale" value={fontScale.toFixed(2)} />
        <InfoRow name="Safe area" value={`top ${insets.top} · bottom ${insets.bottom}`} />
      </Section>
      <Section title="Appearance and accessibility">
        <InfoRow name="Color scheme" value={scheme || 'unknown'} />
        <InfoRow name="Reduce motion" value={reduceMotion === null ? '…' : reduceMotion ? 'on' : 'off'} />
        <InfoRow name="VoiceOver" value={screenReader === null ? '…' : screenReader ? 'on' : 'off'} />
        <Row wrap>
          <Button title="Light" kind="tinted" onPress={() => Appearance.setColorScheme('light')} />
          <Button title="Dark" kind="tinted" onPress={() => Appearance.setColorScheme('dark')} />
          <Button title="System" kind="tinted" onPress={() => Appearance.setColorScheme('unspecified')} />
        </Row>
      </Section>
      <Section title="App state" note="Send the app to the background and come back.">
        <InfoRow name="Current" value={String(appState)} />
        {stateLog.map((l, i) => (
          <Caption key={i}>{l}</Caption>
        ))}
      </Section>
    </Page>
  );
}

export function ShareLinkDemo() {
  const [result, setResult] = useState('—');
  const open = async (url: string) => {
    try {
      await Linking.openURL(url);
      setResult(`Opened ${url}`);
    } catch {
      setResult(`Cannot open ${url}`);
    }
  };
  return (
    <Page>
      <Section title="Share" note={`Result: ${result}`}>
        <Button
          title="Share text and link"
          onPress={async () => {
            const r = await Share.share({ message: 'React Native Gallery — core components on iPhone', url: 'https://github.com/kxbuild/react-native-gallery' });
            setResult(r.action === Share.sharedAction ? `Shared${r.activityType ? ` via ${r.activityType}` : ''}` : 'Dismissed');
          }}
        />
      </Section>
      <Section title="Linking" note="Opens other apps and system screens through URL schemes.">
        <Row wrap>
          <Button title="Website" kind="tinted" onPress={() => open('https://reactnative.dev')} />
          <Button title="Maps" kind="tinted" onPress={() => open('maps://?q=coffee')} />
          <Button title="Mail" kind="tinted" onPress={() => open('mailto:someone@example.com?subject=Hello')} />
          <Button title="Phone" kind="tinted" onPress={() => open('tel:10086')} />
          <Button title="Settings" kind="tinted" onPress={() => Linking.openSettings()} />
        </Row>
      </Section>
    </Page>
  );
}

export function KeyboardDemo() {
  const theme = useTheme();
  const [visible, setVisible] = useState(false);
  const [height, setHeight] = useState(0);
  const [messages, setMessages] = useState(['Hi there!', 'The input bar stays above the keyboard.']);
  const [draft, setDraft] = useState('');

  useEffect(() => {
    const show = Keyboard.addListener('keyboardWillShow', e => {
      setVisible(true);
      setHeight(Math.round(e.endCoordinates.height));
    });
    const hide = Keyboard.addListener('keyboardWillHide', () => setVisible(false));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const send = () => {
    if (!draft.trim()) return;
    setMessages(m => [...m, draft.trim()]);
    setDraft('');
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: theme.background }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={100}>
      <View style={{ flex: 1, padding: 16 }}>
        <Label>Keyboard {visible ? `visible (${height} pt)` : 'hidden'}</Label>
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          {messages.map((m, i) => (
            <View key={i} style={[styles.bubble, { backgroundColor: i % 2 ? theme.accent : theme.card, alignSelf: i % 2 ? 'flex-end' : 'flex-start' }]}>
              <Text style={{ color: i % 2 ? '#fff' : theme.text, fontSize: 16 }}>{m}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={[styles.composer, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <TextInput
          style={[styles.composeInput, { color: theme.text, backgroundColor: theme.background }]}
          placeholder="Message"
          placeholderTextColor={theme.secondaryText}
          value={draft}
          onChangeText={setDraft}
          onSubmitEditing={send}
          returnKeyType="send"
        />
        <Button title="Send" onPress={send} />
        <Button title="Hide" kind="plain" onPress={() => Keyboard.dismiss()} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  info: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: StyleSheet.hairlineWidth },
  bubble: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 18, marginTop: 6, maxWidth: '80%' },
  composer: { flexDirection: 'row', alignItems: 'center', padding: 8, paddingBottom: 28, borderTopWidth: StyleSheet.hairlineWidth },
  composeInput: { flex: 1, borderRadius: 18, paddingHorizontal: 14, paddingVertical: 8, fontSize: 16, marginRight: 8 },
});
