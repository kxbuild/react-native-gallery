/**
 * React Native Gallery — core components and APIs of React Native, one screen each.
 *
 * @format
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  BackHandler,
  Dimensions,
  Easing,
  Platform,
  Pressable,
  SectionList,
  Settings,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { categories, Demo } from './src/demos';
import { useTheme } from './src/theme';

export default function App() {
  const theme = useTheme();
  return (
    <SafeAreaProvider>
      <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} />
      <Navigator />
    </SafeAreaProvider>
  );
}

/** A one-level stack: the home list, and the demo pushed on top of it with a slide. */
function Navigator() {
  // Launch with `-demo <id>` (e.g. kxbuild run … --args "-demo animated") to open a demo directly.
  const [demo, setDemo] = useState<Demo | null>(initialDemo);
  const slide = useRef(new Animated.Value(demo ? 1 : 0)).current;
  const width = Dimensions.get('window').width;

  const open = (d: Demo) => {
    setDemo(d);
    slide.setValue(0);
    Animated.timing(slide, { toValue: 1, duration: 320, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  };
  const close = () =>
    Animated.timing(slide, { toValue: 0, duration: 260, easing: Easing.in(Easing.cubic), useNativeDriver: true }).start(() => setDemo(null));

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!demo) return false;
      close();
      return true;
    });
    return () => sub.remove();
  });

  return (
    <View style={{ flex: 1 }}>
      <Animated.View
        accessibilityElementsHidden={demo !== null}
        importantForAccessibility={demo ? 'no-hide-descendants' : 'auto'}
        style={[StyleSheet.absoluteFill, { transform: [{ translateX: slide.interpolate({ inputRange: [0, 1], outputRange: [0, -width * 0.3] }) }] }]}>
        <Home onOpen={open} />
      </Animated.View>
      {demo ? (
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            styles.pushed,
            { transform: [{ translateX: slide.interpolate({ inputRange: [0, 1], outputRange: [width, 0] }) }] },
          ]}>
          <DemoScreen demo={demo} onBack={close} />
        </Animated.View>
      ) : null}
    </View>
  );
}

function initialDemo(): Demo | null {
  const id = Platform.OS === 'ios' ? Settings.get('demo') : undefined;
  return categories.flatMap(c => c.demos).find(d => d.id === id) ?? null;
}

function Home({ onOpen }: { onOpen: (d: Demo) => void }) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');

  const sections = useMemo(() => {
    const q = query.trim().toLowerCase();
    return categories
      .map(c => ({
        title: c.title,
        data: c.demos.filter(d => !q || d.title.toLowerCase().includes(q) || d.subtitle.toLowerCase().includes(q)),
      }))
      .filter(s => s.data.length > 0);
  }, [query]);

  const total = categories.reduce((n, c) => n + c.demos.length, 0);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <SectionList
        sections={sections}
        keyExtractor={d => d.id}
        keyboardShouldPersistTaps="handled"
        stickySectionHeadersEnabled={false}
        contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: insets.bottom + 24 }}
        ListHeaderComponent={
          <View style={styles.homeHeader}>
            <Text style={[styles.largeTitle, { color: theme.text }]}>RN Gallery</Text>
            <Text style={{ color: theme.secondaryText, fontSize: 15, marginBottom: 12 }}>
              {total} demos of React Native core components and APIs
            </Text>
            <TextInput
              style={[styles.search, { backgroundColor: theme.card, color: theme.text }]}
              placeholder="Search"
              placeholderTextColor={theme.secondaryText}
              value={query}
              onChangeText={setQuery}
              clearButtonMode="while-editing"
              autoCorrect={false}
            />
          </View>
        }
        ListEmptyComponent={<Text style={{ color: theme.secondaryText, textAlign: 'center', marginTop: 32 }}>No demo matches “{query}”.</Text>}
        renderSectionHeader={({ section }) => (
          <Text style={[styles.sectionHeader, { color: theme.secondaryText }]}>{section.title.toUpperCase()}</Text>
        )}
        renderItem={({ item, index, section }) => (
          <Pressable
            onPress={() => onOpen(item)}
            style={({ pressed }) => [
              styles.item,
              { backgroundColor: pressed ? theme.border : theme.card },
              index === 0 && styles.first,
              index === section.data.length - 1 && styles.last,
            ]}>
            <View style={[styles.icon, { backgroundColor: item.color }]}>
              <Text style={styles.iconText}>{item.icon}</Text>
            </View>
            <View style={[styles.itemBody, index < section.data.length - 1 && { borderBottomColor: theme.border, borderBottomWidth: StyleSheet.hairlineWidth }]}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.text, fontSize: 17 }}>{item.title}</Text>
                <Text style={{ color: theme.secondaryText, fontSize: 13, marginTop: 2 }} numberOfLines={1}>
                  {item.subtitle}
                </Text>
              </View>
              <Text style={{ color: theme.secondaryText, fontSize: 20 }}>›</Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

function DemoScreen({ demo, onBack }: { demo: Demo; onBack: () => void }) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const Component = demo.component;
  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={[styles.navBar, { paddingTop: insets.top, backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <Pressable onPress={onBack} hitSlop={12} style={styles.back} accessibilityRole="button" accessibilityLabel="Back">
          <Text style={{ color: theme.accent, fontSize: 17 }}>‹ Gallery</Text>
        </Pressable>
        <Text style={[styles.navTitle, { color: theme.text }]} numberOfLines={1}>
          {demo.title}
        </Text>
        <View style={styles.back} />
      </View>
      <View style={{ flex: 1 }}>
        <Component />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pushed: { shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 12, shadowOffset: { width: -4, height: 0 } },
  homeHeader: { paddingHorizontal: 16, paddingBottom: 4 },
  largeTitle: { fontSize: 34, fontWeight: '700' },
  search: { borderRadius: 10, paddingHorizontal: 12, paddingVertical: 9, fontSize: 17 },
  sectionHeader: { fontSize: 13, marginTop: 24, marginBottom: 6, marginHorizontal: 32 },
  item: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, paddingLeft: 12 },
  first: { borderTopLeftRadius: 12, borderTopRightRadius: 12 },
  last: { borderBottomLeftRadius: 12, borderBottomRightRadius: 12 },
  icon: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  iconText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  itemBody: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingVertical: 11, paddingRight: 14 },
  navBar: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: StyleSheet.hairlineWidth, paddingBottom: 10, paddingHorizontal: 8 },
  back: { width: 90 },
  navTitle: { flex: 1, textAlign: 'center', fontSize: 17, fontWeight: '600' },
});
