import React, { useCallback, useState } from 'react';
import { FlatList, RefreshControl, ScrollView, SectionList, StyleSheet, Text, View } from 'react-native';
import { Caption } from '../ui';
import { swatches, useTheme } from '../theme';

const firstNames = ['Ava', 'Ben', 'Chloe', 'Daniel', 'Emma', 'Felix', 'Grace', 'Henry', 'Isla', 'Jack', 'Kai', 'Lily', 'Mia', 'Noah', 'Olivia', 'Leo'];

type Contact = { id: string; name: string; color: string };

function makeContacts(from: number, count: number): Contact[] {
  return Array.from({ length: count }, (_, i) => {
    const n = from + i;
    return { id: String(n), name: `${firstNames[n % firstNames.length]} ${String.fromCharCode(65 + (n * 7) % 26)}.`, color: swatches[n % swatches.length] };
  });
}

function ContactRow({ item }: { item: Contact }) {
  const theme = useTheme();
  return (
    <View style={[styles.row, { backgroundColor: theme.card }]}>
      <View style={[styles.avatar, { backgroundColor: item.color }]}>
        <Text style={styles.avatarText}>{item.name[0]}</Text>
      </View>
      <View>
        <Text style={{ color: theme.text, fontSize: 17 }}>{item.name}</Text>
        <Text style={{ color: theme.secondaryText, fontSize: 13 }}>Contact #{item.id}</Text>
      </View>
    </View>
  );
}

function Separator() {
  const theme = useTheme();
  return <View style={[styles.separator, { backgroundColor: theme.border }]} />;
}

export function FlatListDemo() {
  const theme = useTheme();
  const [data, setData] = useState(() => makeContacts(0, 30));
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setData(makeContacts(Math.floor(Math.random() * 100), 30));
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <FlatList
      style={{ backgroundColor: theme.background }}
      data={data}
      keyExtractor={(c, i) => `${c.id}-${i}`}
      renderItem={({ item }) => <ContactRow item={item} />}
      ItemSeparatorComponent={Separator}
      ListHeaderComponent={<Caption>  Pull down to refresh, scroll to the end to load more ({data.length} rows).</Caption>}
      onEndReachedThreshold={0.4}
      onEndReached={() => setData(d => (d.length < 300 ? d.concat(makeContacts(d.length, 20)) : d))}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    />
  );
}

const sections = [
  { title: 'Fruits', data: ['Apple', 'Banana', 'Cherry', 'Mango', 'Peach'] },
  { title: 'Vegetables', data: ['Carrot', 'Broccoli', 'Spinach', 'Tomato'] },
  { title: 'Grains', data: ['Rice', 'Oats', 'Barley', 'Quinoa', 'Millet', 'Corn'] },
  { title: 'Nuts', data: ['Almond', 'Cashew', 'Walnut', 'Pecan'] },
];

export function SectionListDemo() {
  const theme = useTheme();
  return (
    <SectionList
      style={{ backgroundColor: theme.background }}
      sections={sections}
      keyExtractor={item => item}
      stickySectionHeadersEnabled
      renderSectionHeader={({ section }) => (
        <Text style={[styles.header, { backgroundColor: theme.background, color: theme.secondaryText }]}>
          {section.title.toUpperCase()} · {section.data.length}
        </Text>
      )}
      renderItem={({ item }) => (
        <View style={[styles.row, { backgroundColor: theme.card }]}>
          <Text style={{ color: theme.text, fontSize: 17 }}>{item}</Text>
        </View>
      )}
      ItemSeparatorComponent={Separator}
    />
  );
}

export function ScrollViewDemo() {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [width, setWidth] = useState(0);
  return (
    <ScrollView style={{ backgroundColor: theme.background }} contentContainerStyle={{ paddingVertical: 16 }}>
      <Caption>  Horizontal paging carousel</Caption>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onLayout={e => setWidth(e.nativeEvent.layout.width)}
        onMomentumScrollEnd={e => width && setPage(Math.round(e.nativeEvent.contentOffset.x / width))}>
        {swatches.slice(0, 5).map((c, i) => (
          <View key={c} style={{ width, height: 180, padding: 16 }}>
            <View style={[styles.slide, { backgroundColor: c }]}>
              <Text style={styles.slideText}>Page {i + 1}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={styles.dots}>
        {swatches.slice(0, 5).map((c, i) => (
          <View key={c} style={[styles.dot, { backgroundColor: i === page ? theme.accent : theme.border }]} />
        ))}
      </View>

      <Caption>  Horizontal chips with snapping</Caption>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} snapToInterval={112} decelerationRate="fast" contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}>
        {['Design', 'Music', 'Sports', 'Travel', 'Food', 'Science', 'Movies', 'Books', 'Games'].map((t, i) => (
          <View key={t} style={[styles.chip, { borderColor: swatches[i % swatches.length] }]}>
            <Text style={{ color: theme.text }}>{t}</Text>
          </View>
        ))}
      </ScrollView>

      <Caption>  Grid (flexWrap)</Caption>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', padding: 12 }}>
        {Array.from({ length: 24 }, (_, i) => (
          <View key={i} style={{ width: '25%', aspectRatio: 1, padding: 4 }}>
            <View style={{ flex: 1, borderRadius: 8, backgroundColor: swatches[i % swatches.length], opacity: 0.4 + (i % 4) * 0.2 }} />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  separator: { height: StyleSheet.hairlineWidth, marginLeft: 16 },
  header: { paddingHorizontal: 16, paddingTop: 18, paddingBottom: 6, fontSize: 13 },
  slide: { flex: 1, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  slideText: { color: '#fff', fontSize: 28, fontWeight: '800' },
  dots: { flexDirection: 'row', justifyContent: 'center', marginBottom: 16 },
  dot: { width: 8, height: 8, borderRadius: 4, marginHorizontal: 4 },
  chip: { borderWidth: 2, borderRadius: 18, paddingHorizontal: 16, paddingVertical: 8, marginRight: 8, width: 104, alignItems: 'center' },
});
