import { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import MonthNav from './MonthNav'
import { WEATHERS, findWeather, moveMonth, COLORS } from './common'

// Stats = 한 달 통계. 총 기록일수, 날씨 분포, 최다 날씨, 평균 기분, 최근 변화
export default function StatsScreen({ records }) {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())

  const onMove = (diff) => {
    const next = moveMonth(year, month, diff)
    setYear(next.year)
    setMonth(next.month)
  }

  // 이 달의 기록만 고르기: '2026-11'로 시작하는 날짜
  const prefix = year + '-' + (month + 1 < 10 ? '0' : '') + (month + 1)
  const monthly = records
    .filter((r) => r.date.slice(0, 7) == prefix)
    .sort((a, b) => (a.date < b.date ? -1 : 1)) // 날짜순

  // 날씨별 기록 횟수
  const counts = WEATHERS.map((w) => ({
    ...w,
    count: monthly.filter((r) => r.weather == w.id).length,
  }))
  const maxCount = Math.max(...counts.map((c) => c.count))
  const top = counts.filter((c) => c.count == maxCount)[0]

  // 평균 기분
  let sum = 0
  for (const r of monthly) sum += r.mood_score
  const average = monthly.length == 0 ? 0 : (sum / monthly.length).toFixed(1)

  // 최근 변화: 이 달의 마지막 5개 기록
  const recent = monthly.slice(-5)

  return (
    <View style={styles.card}>
      <MonthNav year={year} month={month} onMove={onMove} />

      {monthly.length == 0 ? (
        <Text style={styles.empty}>이 달에는 아직 기록이 없어요. Home에서 날짜를 눌러 기록해 보세요.</Text>
      ) : (
        <View>
          <View style={styles.summaryRow}>
            <View style={styles.summary}>
              <Text style={styles.big}>{monthly.length}일</Text>
              <Text style={styles.small}>기록한 날</Text>
            </View>
            <View style={styles.summary}>
              <Text style={styles.big}>{top.icon}</Text>
              <Text style={styles.small}>가장 많았던 {top.label}</Text>
            </View>
            <View style={styles.summary}>
              <Text style={styles.big}>{average}</Text>
              <Text style={styles.small}>평균 기분 / 5</Text>
            </View>
          </View>

          <Text style={styles.label}>마음날씨 분포</Text>
          {counts.map((c) => (
            <View key={c.id} style={styles.barRow}>
              <Text style={styles.barIcon}>{c.icon}</Text>
              <View style={styles.barTrack}>
                <View style={[styles.bar, { width: (c.count / maxCount) * 100 + '%' }]} />
              </View>
              <Text style={styles.barCount}>{c.count}</Text>
            </View>
          ))}

          <Text style={styles.label}>최근 변화</Text>
          <View style={styles.recentRow}>
            {recent.map((r) => (
              <View key={r.id} style={styles.recentItem}>
                <Text style={styles.recentIcon}>{findWeather(r.weather).icon}</Text>
                <Text style={styles.small}>{Number(r.date.slice(8, 10))}일</Text>
                <Text style={styles.small}>{r.mood_score}점</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.card, borderRadius: 20, padding: 16 },
  empty: { fontSize: 14, color: COLORS.quiet, textAlign: 'center', marginVertical: 24 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summary: { flex: 1, alignItems: 'center' },
  big: { fontSize: 26, fontWeight: 'bold', color: COLORS.ink },
  small: { fontSize: 12, color: COLORS.quiet, marginTop: 2 },
  label: { fontSize: 15, fontWeight: 'bold', color: COLORS.ink, marginTop: 24, marginBottom: 10 },
  barRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  barIcon: { width: 32, fontSize: 18 },
  barTrack: { flex: 1, height: 12, backgroundColor: '#EEF4F9', borderRadius: 6 },
  bar: { height: 12, backgroundColor: COLORS.accent, borderRadius: 6 },
  barCount: { width: 28, textAlign: 'right', fontSize: 14, color: COLORS.ink },
  recentRow: { flexDirection: 'row', justifyContent: 'space-around' },
  recentItem: { alignItems: 'center' },
  recentIcon: { fontSize: 28 },
})
