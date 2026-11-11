import React, { useRef, useState } from 'react';
import { Animated, Easing, LayoutAnimation, PanResponder, StyleSheet, Text, View } from 'react-native';
import { Button, Caption, Page, Row, Section } from '../ui';
import { swatches, useTheme } from '../theme';

export function AnimatedDemo() {
  const theme = useTheme();
  const x = useRef(new Animated.Value(0)).current;
  const spin = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const [trackWidth, setTrackWidth] = useState(0);

  const run = (easing: (v: number) => number) => {
    x.setValue(0);
    Animated.timing(x, { toValue: 1, duration: 900, easing, useNativeDriver: true }).start();
  };

  const translateX = x.interpolate({ inputRange: [0, 1], outputRange: [0, Math.max(0, trackWidth - 44)] });

  return (
    <Page>
      <Section title="Easing curves" note="Animated.timing with useNativeDriver: the motion runs on the UI thread.">
        <View onLayout={e => setTrackWidth(e.nativeEvent.layout.width)} style={[styles.track, { backgroundColor: theme.background }]}>
          <Animated.View style={[styles.ball, { backgroundColor: theme.accent, transform: [{ translateX }] }]} />
        </View>
        <Row wrap>
          <Button title="Linear" kind="tinted" onPress={() => run(Easing.linear)} />
          <Button title="Ease in-out" kind="tinted" onPress={() => run(Easing.inOut(Easing.cubic))} />
          <Button title="Bounce" kind="tinted" onPress={() => run(Easing.bounce)} />
          <Button title="Elastic" kind="tinted" onPress={() => run(Easing.elastic(1.5))} />
          <Button title="Back" kind="tinted" onPress={() => run(Easing.back(2))} />
        </Row>
      </Section>
      <Section title="Spring and loop">
        <Row>
          <Animated.View
            style={[
              styles.square,
              { backgroundColor: swatches[0], transform: [{ rotate: spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }] },
            ]}
          />
          <Animated.View style={[styles.square, { backgroundColor: swatches[4], transform: [{ scale }] }]} />
        </Row>
        <Row wrap>
          <Button
            title="Spin"
            kind="tinted"
            onPress={() => {
              spin.setValue(0);
              Animated.timing(spin, { toValue: 1, duration: 800, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
            }}
          />
          <Button
            title="Spring"
            kind="tinted"
            onPress={() => {
              scale.setValue(0.4);
              Animated.spring(scale, { toValue: 1, friction: 3, tension: 120, useNativeDriver: true }).start();
            }}
          />
        </Row>
      </Section>
      <Section title="Stagger">
        <Stagger />
      </Section>
    </Page>
  );
}

function Stagger() {
  const values = useRef(swatches.map(() => new Animated.Value(1))).current;
  const play = () => {
    values.forEach(v => v.setValue(0));
    Animated.stagger(
      70,
      values.map(v => Animated.spring(v, { toValue: 1, useNativeDriver: true })),
    ).start();
  };
  return (
    <View>
      <Row>
        {values.map((v, i) => (
          <Animated.View
            key={i}
            style={{
              width: 28,
              height: 60,
              marginRight: 6,
              borderRadius: 6,
              backgroundColor: swatches[i],
              opacity: v,
              transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) }],
            }}
          />
        ))}
      </Row>
      <View style={{ marginTop: 12 }}>
        <Button title="Play" kind="tinted" onPress={play} />
      </View>
    </View>
  );
}

export function GestureDemo() {
  const theme = useTheme();
  const pan = useRef(new Animated.ValueXY()).current;
  const [moves, setMoves] = useState(0);
  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => {
        pan.extractOffset();
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
      onPanResponderRelease: () => {
        pan.flattenOffset();
        setMoves(m => m + 1);
      },
    }),
  ).current;

  return (
    <Page>
      <Section title="Drag" note={`PanResponder + Animated.ValueXY. Dragged ${moves} time${moves === 1 ? '' : 's'}.`}>
        <View style={[styles.arena, { backgroundColor: theme.background }]}>
          <Animated.View {...responder.panHandlers} style={[styles.puck, { backgroundColor: theme.accent, transform: pan.getTranslateTransform() }]}>
            <Text style={{ color: '#fff', fontWeight: '700' }}>Drag</Text>
          </Animated.View>
        </View>
        <View style={{ marginTop: 12 }}>
          <Button
            title="Reset"
            kind="tinted"
            onPress={() => Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start()}
          />
        </View>
      </Section>
      <Section title="Swipe to dismiss">
        <SwipeCards />
      </Section>
    </Page>
  );
}

function SwipeCards() {
  const theme = useTheme();
  const [cards, setCards] = useState(['Inbox zero', 'Weekly review', 'Plan a trip', 'Call mom']);
  return (
    <View>
      {cards.map(c => (
        <SwipeRow key={c} label={c} onDismiss={() => setCards(list => list.filter(x => x !== c))} />
      ))}
      {cards.length === 0 ? (
        <Text style={{ color: theme.secondaryText }}>All done.</Text>
      ) : (
        <Caption>Swipe a row left or right.</Caption>
      )}
    </View>
  );
}

function SwipeRow({ label, onDismiss }: { label: string; onDismiss: () => void }) {
  const theme = useTheme();
  const x = useRef(new Animated.Value(0)).current;
  const responder = useRef(
    PanResponder.create({
      onPanResponderTerminationRequest: () => false,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 8 && Math.abs(g.dx) > Math.abs(g.dy),
      onPanResponderMove: Animated.event([null, { dx: x }], { useNativeDriver: false }),
      onPanResponderRelease: (_, g) => {
        if (Math.abs(g.dx) > 120) {
          Animated.timing(x, { toValue: Math.sign(g.dx) * 500, duration: 180, useNativeDriver: false }).start(() => {
            LayoutAnimation.easeInEaseOut();
            onDismiss();
          });
        } else {
          Animated.spring(x, { toValue: 0, useNativeDriver: false }).start();
        }
      },
    }),
  ).current;
  return (
    <Animated.View
      {...responder.panHandlers}
      style={[
        styles.swipeRow,
        {
          backgroundColor: theme.background,
          transform: [{ translateX: x }],
          opacity: x.interpolate({ inputRange: [-250, 0, 250], outputRange: [0.2, 1, 0.2] }),
        },
      ]}>
      <Text style={{ color: theme.text, fontSize: 17 }}>{label}</Text>
    </Animated.View>
  );
}

export function LayoutAnimationDemo() {
  const theme = useTheme();
  const [items, setItems] = useState([1, 2, 3]);
  const [expanded, setExpanded] = useState(false);
  const animate = () => LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
  return (
    <Page>
      <Section title="Add and remove" note="LayoutAnimation animates every layout change in the next render.">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', minHeight: 70 }}>
          {items.map(i => (
            <View key={i} style={[styles.tile, { backgroundColor: swatches[i % swatches.length] }]}>
              <Text style={{ color: '#fff', fontWeight: '700' }}>{i}</Text>
            </View>
          ))}
        </View>
        <Row wrap>
          <Button title="Add" kind="tinted" onPress={() => { animate(); setItems(l => [...l, (l[l.length - 1] ?? 0) + 1]); }} />
          <Button title="Remove" kind="tinted" onPress={() => { animate(); setItems(l => l.slice(0, -1)); }} />
          <Button title="Shuffle" kind="tinted" onPress={() => { animate(); setItems(l => [...l].sort(() => Math.random() - 0.5)); }} />
        </Row>
      </Section>
      <Section title="Expand">
        <View style={{ height: expanded ? 160 : 60, borderRadius: 12, backgroundColor: theme.accent, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 17 }}>{expanded ? 'Expanded' : 'Collapsed'}</Text>
        </View>
        <View style={{ marginTop: 12 }}>
          <Button title="Toggle" kind="tinted" onPress={() => { LayoutAnimation.easeInEaseOut(); setExpanded(e => !e); }} />
        </View>
      </Section>
    </Page>
  );
}

const styles = StyleSheet.create({
  track: { height: 52, borderRadius: 26, justifyContent: 'center', paddingHorizontal: 4, marginBottom: 12 },
  ball: { width: 44, height: 44, borderRadius: 22 },
  square: { width: 72, height: 72, borderRadius: 12, margin: 12 },
  arena: { height: 260, borderRadius: 12, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  puck: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center' },
  swipeRow: { padding: 16, borderRadius: 10, marginBottom: 8 },
  tile: { width: 56, height: 56, borderRadius: 10, margin: 6, alignItems: 'center', justifyContent: 'center' },
});
