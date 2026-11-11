import React, { useEffect, useRef, useState } from 'react';
import { ActionSheetIOS, ActivityIndicator, Alert, Animated, Modal, Platform, StyleSheet, Text, Vibration, View } from 'react-native';
import { Button, Caption, Label, Page, Row, Section } from '../ui';
import { useTheme } from '../theme';

export function IndicatorDemo() {
  const theme = useTheme();
  const progress = useRef(new Animated.Value(0)).current;
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(progress, { toValue: 1, duration: 2000, useNativeDriver: false }),
        Animated.timing(progress, { toValue: 0, duration: 0, useNativeDriver: false }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [running, progress]);

  return (
    <Page>
      <Section title="ActivityIndicator">
        <Row>
          <ActivityIndicator style={{ marginRight: 24 }} />
          <ActivityIndicator size="large" style={{ marginRight: 24 }} />
          <ActivityIndicator size="large" color={theme.success} style={{ marginRight: 24 }} />
          <ActivityIndicator size="large" color={theme.danger} animating={running} hidesWhenStopped={false} />
        </Row>
      </Section>
      <Section title="Progress bar" note="Animated width driven by a looping timing animation.">
        <View style={[styles.track, { backgroundColor: theme.background }]}>
          <Animated.View
            style={[styles.bar, { backgroundColor: theme.accent, width: progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }]}
          />
        </View>
        <View style={{ marginTop: 12 }}>
          <Button title={running ? 'Pause' : 'Resume'} kind="tinted" onPress={() => setRunning(r => !r)} />
        </View>
      </Section>
      <Section title="Skeleton placeholder">
        <Skeleton />
      </Section>
    </Page>
  );
}

function Skeleton() {
  const theme = useTheme();
  const pulse = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);
  const block = (w: number | `${number}%`, h: number, r = 6) => (
    <Animated.View style={{ width: w, height: h, borderRadius: r, backgroundColor: theme.border, opacity: pulse, marginBottom: 8 }} />
  );
  return (
    <View style={{ flexDirection: 'row' }}>
      {block(56, 56, 28)}
      <View style={{ flex: 1, marginLeft: 12 }}>
        {block('70%', 14)}
        {block('95%', 12)}
        {block('50%', 12)}
      </View>
    </View>
  );
}

export function DialogDemo() {
  const theme = useTheme();
  const [last, setLast] = useState('—');
  const [modal, setModal] = useState<null | 'fade' | 'slide' | 'sheet'>(null);
  const [toast, setToast] = useState<string | null>(null);

  return (
    <Page>
      <Section title="Alert" note={`Last choice: ${last}`}>
        <Row wrap>
          <Button title="Simple" onPress={() => Alert.alert('Saved', 'Your changes were saved.')} />
          <Button
            title="Confirm"
            kind="tinted"
            onPress={() =>
              Alert.alert('Delete photo?', 'This cannot be undone.', [
                { text: 'Cancel', style: 'cancel', onPress: () => setLast('Cancel') },
                { text: 'Delete', style: 'destructive', onPress: () => setLast('Delete') },
              ])
            }
          />
          <Button
            title="Prompt"
            kind="tinted"
            onPress={() =>
              Platform.OS === 'ios'
                ? Alert.prompt('Rename', 'Enter a new name', name => setLast(`Renamed to "${name}"`))
                : Alert.alert('Prompt is iOS only')
            }
          />
        </Row>
      </Section>
      {Platform.OS === 'ios' ? (
        <Section title="Action sheet">
          <Button
            title="Share options"
            kind="tinted"
            onPress={() =>
              ActionSheetIOS.showActionSheetWithOptions(
                { options: ['Cancel', 'Copy link', 'Add to favorites', 'Report'], cancelButtonIndex: 0, destructiveButtonIndex: 3 },
                i => setLast(['Cancel', 'Copy link', 'Add to favorites', 'Report'][i]),
              )
            }
          />
        </Section>
      ) : null}
      <Section title="Modal">
        <Row wrap>
          <Button title="Fade" kind="tinted" onPress={() => setModal('fade')} />
          <Button title="Slide" kind="tinted" onPress={() => setModal('slide')} />
          <Button title="Page sheet" kind="tinted" onPress={() => setModal('sheet')} />
        </Row>
      </Section>
      <Section title="Toast" note="A custom overlay that slides in and hides itself.">
        <Button title="Show toast" kind="tinted" onPress={() => setToast(`Copied at ${new Date().toLocaleTimeString()}`)} />
      </Section>
      <Section title="Vibration">
        <Row wrap>
          <Button title="Vibrate" kind="tinted" onPress={() => Vibration.vibrate()} />
          <Button title="Pattern" kind="tinted" onPress={() => Vibration.vibrate([0, 300, 200, 300])} />
        </Row>
      </Section>

      <Modal
        visible={modal !== null}
        transparent={modal === 'fade'}
        animationType={modal === 'fade' ? 'fade' : 'slide'}
        presentationStyle={modal === 'sheet' ? 'pageSheet' : modal === 'slide' ? 'fullScreen' : 'overFullScreen'}
        onRequestClose={() => setModal(null)}>
        <View style={modal === 'fade' ? styles.backdrop : [styles.fullModal, { backgroundColor: theme.background }]}>
          <View style={[styles.dialog, { backgroundColor: theme.card }]}>
            <Label>{modal === 'fade' ? 'A centered dialog' : modal === 'sheet' ? 'A page sheet — swipe down to close' : 'A full-screen modal'}</Label>
            <Caption>Modal renders above the whole app.</Caption>
            <View style={{ marginTop: 16 }}>
              <Button title="Close" onPress={() => setModal(null)} />
            </View>
          </View>
        </View>
      </Modal>
      <Toast message={toast} onHide={() => setToast(null)} />
    </Page>
  );
}

function Toast({ message, onHide }: { message: string | null; onHide: () => void }) {
  const y = useRef(new Animated.Value(120)).current;
  useEffect(() => {
    if (!message) return;
    Animated.sequence([
      Animated.spring(y, { toValue: 0, useNativeDriver: true }),
      Animated.delay(1600),
      Animated.timing(y, { toValue: 120, duration: 250, useNativeDriver: true }),
    ]).start(() => onHide());
  }, [message, y, onHide]);
  if (!message) return null;
  return (
    <Modal transparent visible animationType="none">
      <View pointerEvents="none" style={styles.toastHost}>
        <Animated.View style={[styles.toast, { transform: [{ translateY: y }] }]}>
          <Text style={{ color: '#fff', fontSize: 15 }}>{message}</Text>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  track: { height: 8, borderRadius: 4, overflow: 'hidden' },
  bar: { height: 8, borderRadius: 4 },
  backdrop: { flex: 1, backgroundColor: '#0008', alignItems: 'center', justifyContent: 'center', padding: 32 },
  fullModal: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  dialog: { borderRadius: 16, padding: 24, alignSelf: 'stretch' },
  toastHost: { flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 60 },
  toast: { backgroundColor: '#333D', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 22 },
});
