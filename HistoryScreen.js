import { useState } from 'react'
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet } from 'react-native'
import RecordCard from './RecordCard'
import { WEATHERS, findWeather, toKoreanDate, COLORS } from './common'

// History = 지난 기록 목록. 날씨 필터, 날짜·메모 검색, 눌러서 수정·삭제
export default function HistoryScreen({ records, onUpdate, onDelete }) {
  const [filter, setFilter] = useState('all')
  const [keyword, setKeyword] = useState('')
  const [editing, setEditing] = useState(null)

  // 목록에서 기록을 누르면 기록 카드로 수정
  if (editing != null) {
    return (
      <RecordCard
        date={editing.date}
        record={editing}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onClose={() => setEditing(null)}
      />
    )
  }

  const shown = [...records]
    .sort((a, b) => (a.date < b.date ? 1 : -1)) // 최신순
    .filter((r) => filter == 'all' || r.weather == filter)
    .filter((r) => r.date.includes(keyword) || r.memo.includes(keyword))

  return (
    <View style={styles.wrap}>
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.chip, filter == 'all' ? styles.chipOn : null]}
          onPress={() => setFilter('all')}
        >
          <Text style={styles.chipText}>전체</Text>
        </TouchableOpacity>
        {WEATHERS.map((w) => (
          <TouchableOpacity
            key={w.id}
            style={[styles.chip, filter == w.id ? styles.chipOn : null]}
            onPress={() => setFilter(w.id)}
          >
            <Text style={styles.chipText}>{w.icon}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={styles.search}
        value={keyword}
        placeholder="날짜(2026-11)나 메모로 찾기"
        onChangeText={(text) => setKeyword(text)}
      />

      <ScrollView style={styles.list}>
        {shown.length == 0 ? (
          <Text style={styles.empty}>조건에 맞는 기록이 없어요. Home에서 날짜를 눌러 기록해 보세요.</Text>
        ) : null}

        {shown.map((r) => (
          <TouchableOpacity key={r.id} style={styles.item} onPress={() => setEditing(r)}>
            <Text style={styles.itemIcon}>{findWeather(r.weather).icon}</Text>
            <View style={styles.itemBody}>
              <Text style={styles.itemDate}>{toKoreanDate(r.date)}</Text>
              <Text style={styles.itemMemo}>{r.memo == '' ? '메모 없음' : r.memo}</Text>
            </View>
            <Text style={styles.itemScore}>{r.mood_score}/5</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  filterRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  chip: {
    height: 38,
    minWidth: 38,
    paddingHorizontal: 8,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipOn: { backgroundColor: COLORS.card, borderWidth: 2, borderColor: COLORS.accent },
  chipText: { fontSize: 15, color: COLORS.ink },
  search: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    marginBottom: 12,
  },
  list: { flex: 1 },
  empty: { fontSize: 14, color: COLORS.quiet, textAlign: 'center', marginTop: 24 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  itemIcon: { fontSize: 30, marginRight: 12 },
  itemBody: { flex: 1 },
  itemDate: { fontSize: 15, fontWeight: 'bold', color: COLORS.ink },
  itemMemo: { fontSize: 14, color: COLORS.quiet, marginTop: 2 },
  itemScore: { fontSize: 15, color: COLORS.accent, fontWeight: 'bold' },
})
