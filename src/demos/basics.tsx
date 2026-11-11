import React, { useState } from 'react';
import { Image, ImageBackground, Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { Button, Caption, Label, Page, Row, Section } from '../ui';
import { swatches, useTheme } from '../theme';

const photo = require('../../assets/pattern.png');

export function TextDemo() {
  const theme = useTheme();
  const t = { color: theme.text };
  return (
    <Page>
      <Section title="Weights">
        {(['300', '400', '600', '700', '900'] as const).map(w => (
          <Text key={w} style={[t, { fontSize: 20, fontWeight: w, marginBottom: 4 }]}>
            fontWeight {w}
          </Text>
        ))}
      </Section>
      <Section title="Styles">
        <Text style={[t, { fontStyle: 'italic', fontSize: 17 }]}>Italic text</Text>
        <Text style={[t, { textDecorationLine: 'underline', fontSize: 17, marginTop: 6 }]}>Underlined text</Text>
        <Text style={[t, { textDecorationLine: 'line-through', fontSize: 17, marginTop: 6 }]}>Strikethrough text</Text>
        <Text style={[t, { letterSpacing: 4, fontSize: 17, marginTop: 6 }]}>LETTER SPACING</Text>
        <Text style={[t, { fontSize: 17, marginTop: 6, textShadowColor: '#4DABF7', textShadowRadius: 6, textShadowOffset: { width: 0, height: 2 } }]}>
          Text shadow
        </Text>
      </Section>
      <Section title="Nested text">
        <Text style={[t, { fontSize: 17, lineHeight: 26 }]}>
          Text can nest: <Text style={{ fontWeight: '700' }}>bold</Text>, <Text style={{ color: theme.accent }}>colored</Text>,{' '}
          <Text style={{ fontFamily: 'Menlo' }}>monospace</Text> and{' '}
          <Text style={{ backgroundColor: '#FFD43B66' }}>highlighted</Text> runs inside one paragraph.
        </Text>
      </Section>
      <Section title="Truncation" note="numberOfLines with ellipsizeMode head, middle and tail.">
        {(['head', 'middle', 'tail'] as const).map(mode => (
          <Text key={mode} numberOfLines={1} ellipsizeMode={mode} style={[t, { fontSize: 16, marginBottom: 6 }]}>
            {mode}: The quick brown fox jumps over the lazy dog and keeps running far beyond the edge of the screen
          </Text>
        ))}
      </Section>
      <Section title="Selectable">
        <Text selectable style={[t, { fontSize: 16 }]}>
          Long-press this text to select and copy it.
        </Text>
      </Section>
    </Page>
  );
}

export function ViewDemo() {
  const theme = useTheme();
  return (
    <Page>
      <Section title="Flexbox direction">
        {(['row', 'column'] as const).map(dir => (
          <View key={dir} style={{ flexDirection: dir, marginBottom: 12 }}>
            {swatches.slice(0, 3).map(c => (
              <View key={c} style={{ width: 48, height: 48, backgroundColor: c, margin: 3, borderRadius: 6 }} />
            ))}
          </View>
        ))}
      </Section>
      <Section title="justifyContent">
        {(['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'] as const).map(j => (
          <View key={j} style={{ marginBottom: 10 }}>
            <Caption>{j}</Caption>
            <View style={{ flexDirection: 'row', justifyContent: j, backgroundColor: theme.background, borderRadius: 6, padding: 4 }}>
              {swatches.slice(3, 6).map(c => (
                <View key={c} style={{ width: 28, height: 28, backgroundColor: c, borderRadius: 4 }} />
              ))}
            </View>
          </View>
        ))}
      </Section>
      <Section title="Borders, radius and shadows">
        <Row wrap>
          <View style={[box.base, { borderWidth: 3, borderColor: swatches[5] }]} />
          <View style={[box.base, { borderRadius: 40, backgroundColor: swatches[0] }]} />
          <View style={[box.base, { borderStyle: 'dashed', borderWidth: 2, borderColor: theme.text }]} />
          <View style={[box.base, box.shadow, { backgroundColor: theme.card }]} />
        </Row>
      </Section>
      <Section title="Transforms">
        <Row wrap>
          <View style={[box.base, { backgroundColor: swatches[1], transform: [{ rotate: '20deg' }] }]} />
          <View style={[box.base, { backgroundColor: swatches[4], transform: [{ scale: 0.7 }] }]} />
          <View style={[box.base, { backgroundColor: swatches[6], transform: [{ skewX: '15deg' }] }]} />
          <View style={[box.base, { backgroundColor: swatches[7], opacity: 0.5 }]} />
        </Row>
      </Section>
      <Section title="Absolute positioning">
        <View style={{ height: 120 }}>
          <View style={[box.abs, { top: 0, left: 0, backgroundColor: swatches[0] }]} />
          <View style={[box.abs, { top: 20, left: 40, backgroundColor: swatches[3] }]} />
          <View style={[box.abs, { top: 40, left: 80, backgroundColor: swatches[5], zIndex: -1 }]} />
          <View style={[box.abs, { bottom: 0, right: 0, backgroundColor: swatches[7] }]} />
        </View>
      </Section>
    </Page>
  );
}

const box = StyleSheet.create({
  base: { width: 64, height: 64, margin: 8, borderRadius: 8 },
  shadow: { shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
  abs: { position: 'absolute', width: 70, height: 70, borderRadius: 10 },
});

export function ImageDemo() {
  return (
    <Page>
      <Section title="resizeMode" note="A bundled image drawn into a fixed 96×64 frame.">
        <Row wrap>
          {(['cover', 'contain', 'stretch', 'center', 'repeat'] as const).map(mode => (
            <View key={mode} style={{ marginRight: 12, marginBottom: 12, alignItems: 'center' }}>
              <Image source={photo} resizeMode={mode} style={{ width: 96, height: 64, backgroundColor: '#8884' }} />
              <Caption>{mode}</Caption>
            </View>
          ))}
        </Row>
      </Section>
      <Section title="Rounded, tinted and blurred">
        <Row wrap>
          <Image source={photo} style={{ width: 80, height: 80, borderRadius: 40, marginRight: 12 }} />
          <Image source={photo} style={{ width: 80, height: 80, borderRadius: 16, tintColor: '#4DABF7', marginRight: 12 }} />
          <Image source={photo} blurRadius={6} style={{ width: 80, height: 80, borderRadius: 16 }} />
        </Row>
      </Section>
      <Section title="ImageBackground">
        <ImageBackground source={photo} style={{ height: 140, justifyContent: 'flex-end' }} imageStyle={{ borderRadius: 10 }}>
          <Text style={{ color: '#fff', fontSize: 22, fontWeight: '700', padding: 12, textShadowColor: '#000', textShadowRadius: 6 }}>
            Text over an image
          </Text>
        </ImageBackground>
      </Section>
    </Page>
  );
}

export function ButtonDemo() {
  const [count, setCount] = useState(0);
  const theme = useTheme();
  return (
    <Page>
      <Section title="Pressable buttons" note={`Tapped ${count} time${count === 1 ? '' : 's'}.`}>
        <Row wrap>
          <Button title="Filled" onPress={() => setCount(c => c + 1)} />
          <Button title="Tinted" kind="tinted" onPress={() => setCount(c => c + 1)} />
          <Button title="Plain" kind="plain" onPress={() => setCount(c => c + 1)} />
          <Button title="Delete" kind="danger" onPress={() => setCount(0)} />
          <Button title="Disabled" disabled />
        </Row>
      </Section>
      <Section title="Press feedback" note="Pressable reports pressIn, pressOut and long press; hitSlop enlarges the touch area.">
        <PressLog />
      </Section>
      <Section title="Icon buttons">
        <Row>
          {['＋', '♥', '★', '✓', '✕'].map((g, i) => (
            <Pressable
              key={g}
              accessibilityRole="button"
              style={({ pressed }) => ({
                width: 48,
                height: 48,
                borderRadius: 24,
                marginRight: 12,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: swatches[i * 2 % swatches.length],
                transform: [{ scale: pressed ? 0.88 : 1 }],
              })}>
              <Text style={{ color: '#fff', fontSize: 22, fontWeight: '700' }}>{g}</Text>
            </Pressable>
          ))}
        </Row>
      </Section>
      <Section title="Segmented choice">
        <Segments options={['Day', 'Week', 'Month', 'Year']} />
      </Section>
      <Caption>
        <Text style={{ color: theme.secondaryText }}>All buttons here are plain Pressable views styled with StyleSheet.</Text>
      </Caption>
    </Page>
  );
}

function PressLog() {
  const [log, setLog] = useState<string[]>([]);
  const add = (e: string) => setLog(l => [e, ...l].slice(0, 4));
  const theme = useTheme();
  return (
    <View>
      <Pressable
        hitSlop={20}
        onPressIn={() => add('pressIn')}
        onPressOut={() => add('pressOut')}
        onPress={() => add('press')}
        onLongPress={() => add('longPress')}
        style={({ pressed }) => ({
          padding: 18,
          borderRadius: 10,
          alignItems: 'center',
          backgroundColor: pressed ? theme.accent : theme.background,
        })}>
        {({ pressed }) => <Label>{pressed ? 'Pressed' : 'Press or long-press me'}</Label>}
      </Pressable>
      {log.map((e, i) => (
        <Caption key={i}>{e}</Caption>
      ))}
    </View>
  );
}

function Segments({ options }: { options: string[] }) {
  const [selected, setSelected] = useState(0);
  const theme = useTheme();
  return (
    <View style={{ flexDirection: 'row', backgroundColor: theme.background, borderRadius: 9, padding: 2 }}>
      {options.map((o, i) => (
        <Pressable
          key={o}
          onPress={() => setSelected(i)}
          style={{
            flex: 1,
            paddingVertical: 7,
            borderRadius: 7,
            alignItems: 'center',
            backgroundColor: i === selected ? theme.card : 'transparent',
          }}>
          <Text style={{ color: theme.text, fontWeight: i === selected ? '600' : '400' }}>{o}</Text>
        </Pressable>
      ))}
    </View>
  );
}

export function InputDemo() {
  const theme = useTheme();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [wifi, setWifi] = useState(false);
  const field = [inputStyles.field, { color: theme.text, borderColor: theme.border, backgroundColor: theme.background }];
  return (
    <Page>
      <Section title="TextInput">
        <TextInput style={field} placeholder="Name" placeholderTextColor={theme.secondaryText} value={name} onChangeText={setName} autoCapitalize="words" returnKeyType="next" clearButtonMode="while-editing" />
        <TextInput style={field} placeholder="Email" placeholderTextColor={theme.secondaryText} keyboardType="email-address" autoCapitalize="none" textContentType="emailAddress" />
        <TextInput style={field} placeholder="Password" placeholderTextColor={theme.secondaryText} secureTextEntry value={password} onChangeText={setPassword} textContentType="password" />
        <TextInput style={field} placeholder="Amount" placeholderTextColor={theme.secondaryText} keyboardType="decimal-pad" />
        <TextInput style={field} placeholder="Phone" placeholderTextColor={theme.secondaryText} keyboardType="phone-pad" />
        <Caption>{name ? `Hello, ${name}!` : 'Type your name above.'} Password strength: {strength(password)}</Caption>
      </Section>
      <Section title="Multiline" note={`${bio.length} / 200 characters`}>
        <TextInput
          style={[field, { height: 100, textAlignVertical: 'top' }]}
          multiline
          maxLength={200}
          placeholder="Tell us about yourself"
          placeholderTextColor={theme.secondaryText}
          value={bio}
          onChangeText={setBio}
        />
      </Section>
      <Section title="Switch">
        <SwitchRow label="Notifications" value={enabled} onValueChange={setEnabled} />
        <SwitchRow label="Wi-Fi" value={wifi} onValueChange={setWifi} color={theme.success} />
        <SwitchRow label="Disabled" value={true} disabled />
      </Section>
      <Section title="Stepper and checkbox" note="Built from Pressable and Text.">
        <Stepper />
        <Checkboxes />
      </Section>
    </Page>
  );
}

function strength(p: string): string {
  if (!p) return '—';
  let s = 0;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
  if (/\d/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return ['weak', 'weak', 'fair', 'good', 'strong'][s];
}

function SwitchRow({ label, value, onValueChange, disabled, color }: { label: string; value: boolean; onValueChange?: (v: boolean) => void; disabled?: boolean; color?: string }) {
  return (
    <View style={[inputStyles.switchRow]}>
      <Label>{label}</Label>
      <Switch value={value} onValueChange={onValueChange} disabled={disabled} trackColor={color ? { true: color } : undefined} />
    </View>
  );
}

function Stepper() {
  const [n, setN] = useState(1);
  const theme = useTheme();
  const btn = (label: string, d: number) => (
    <Pressable onPress={() => setN(v => Math.max(0, Math.min(10, v + d)))} style={[inputStyles.stepBtn, { backgroundColor: theme.background }]}>
      <Text style={{ color: theme.accent, fontSize: 22 }}>{label}</Text>
    </Pressable>
  );
  return (
    <View style={inputStyles.switchRow}>
      <Label>Quantity: {n}</Label>
      <Row>
        {btn('−', -1)}
        {btn('+', 1)}
      </Row>
    </View>
  );
}

function Checkboxes() {
  const [items, setItems] = useState([
    { label: 'Milk', done: true },
    { label: 'Bread', done: false },
    { label: 'Coffee', done: false },
  ]);
  const theme = useTheme();
  return (
    <View>
      {items.map((it, i) => (
        <Pressable
          key={it.label}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: it.done }}
          onPress={() => setItems(list => list.map((x, j) => (j === i ? { ...x, done: !x.done } : x)))}
          style={inputStyles.check}>
          <View style={[inputStyles.box, { borderColor: theme.accent, backgroundColor: it.done ? theme.accent : 'transparent' }]}>
            {it.done ? <Text style={{ color: '#fff', fontWeight: '800' }}>✓</Text> : null}
          </View>
          <Text style={{ color: theme.text, fontSize: 17, textDecorationLine: it.done ? 'line-through' : 'none' }}>{it.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const inputStyles = StyleSheet.create({
  field: { borderWidth: StyleSheet.hairlineWidth, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 17, marginBottom: 10 },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 },
  stepBtn: { width: 44, height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
  check: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  box: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, marginRight: 12, alignItems: 'center', justifyContent: 'center' },
});
