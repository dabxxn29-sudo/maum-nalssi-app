import { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import HomeScreen from './HomeScreen'
import HistoryScreen from './HistoryScreen'
import StatsScreen from './StatsScreen'
import { todayString, COLORS } from './common'

const TABS = [
  { id: 'home', label: 'Home' },
  { id: 'history', label: 'History' },
  { id: 'stats', label: 'Stats' },
]

export default function App() {
  const [tab, setTab] = useState('home')

  // 지금은 useState 배열에 저장 (수업 Todo 앱 방식, 새로고침하면 초기화됨)
  // 나중에 이 부분만 axios + Supabase로 바꾸면 된다
  const [records, setRecords] = useState([
    { id: 1, date: '2026-11-03', weather: 'sunny', mood_score: 5, memo: '발표가 생각보다 잘 끝났다.' },
    { id: 2, date: '2026-11-07', weather: 'rain', mood_score: 2, memo: '과제가 너무 많았다.' },
  ])

  // Create
  const onAdd = (date, weather, mood_score, memo) => {
    if (date > todayString()) {
      alert('미래 날짜는 기록할 수 없어요.')
      return
    }
    if (records.filter((r) => r.date == date).length > 0) {
      alert('이 날짜에는 이미 마음날씨가 기록되어 있어요.')
      return
    }
    // 기록이 하나도 없을 때도 오류가 나지 않도록 처리
    const id = records.length == 0 ? 1 : records[records.length - 1].id + 1
    setRecords([...records, { id, date, weather, mood_score, memo }])
  }

  // Update
  const onUpdate = (id, weather, mood_score, memo) => {
    setRecords(
      records.map((r) => {
        if (r.id == id) return { ...r, weather, mood_score, memo }
        return r
      })
    )
  }

  // Delete
  const onDelete = (id) => {
    setRecords(records.filter((r) => r.id != id))
  }

  return (
    <View style={styles.sky}>
      <View style={styles.cloudRow}>
        <Text style={styles.cloud}>☁️</Text>
        <Text style={[styles.cloud, styles.cloudSmall]}>☁️</Text>
        <Text style={styles.cloud}>☁️</Text>
      </View>

      <Text style={styles.logo}>마음날씨</Text>
      <Text style={styles.slogan}>오늘 당신의 마음 날씨는 어떤가요?</Text>

      <View style={styles.tabRow}>
        {TABS.map((t) => (
          <TouchableOpacity
            key={t.id}
            style={[styles.tab, tab == t.id ? styles.tabOn : null]}
            onPress={() => setTab(t.id)}
          >
            <Text style={[styles.tabText, tab == t.id ? styles.tabTextOn : null]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.body}>
        {tab == 'home' ? (
          <HomeScreen records={records} onAdd={onAdd} onUpdate={onUpdate} onDelete={onDelete} />
        ) : null}
        {tab == 'history' ? (
          <HistoryScreen records={records} onUpdate={onUpdate} onDelete={onDelete} />
        ) : null}
        {tab == 'stats' ? <StatsScreen records={records} /> : null}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  sky: { flex: 1, backgroundColor: COLORS.sky, paddingTop: 48, paddingHorizontal: 16 },
  cloudRow: { flexDirection: 'row', justifyContent: 'space-around', opacity: 0.8 },
  cloud: { fontSize: 34 },
  cloudSmall: { fontSize: 22, marginTop: 14 },
  logo: { fontSize: 30, fontWeight: 'bold', color: COLORS.ink, textAlign: 'center', marginTop: 4 },
  slogan: { fontSize: 14, color: COLORS.quiet, textAlign: 'center', marginTop: 4 },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 16,
    padding: 4,
    marginTop: 16,
    marginBottom: 12,
  },
  tab: { flex: 1, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  tabOn: { backgroundColor: COLORS.card },
  tabText: { fontSize: 15, color: COLORS.quiet },
  tabTextOn: { color: COLORS.ink, fontWeight: 'bold' },
  body: { flex: 1, paddingBottom: 16 },
})
