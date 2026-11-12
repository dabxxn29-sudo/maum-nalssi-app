import { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import MonthNav from './MonthNav'
import RecordCard from './RecordCard'
import { findWeather, toDateString, todayString, moveMonth, COLORS } from './common'

const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토']

// Home = 월간 캘린더. 날짜를 누르면 기록 카드가 열린다
export default function HomeScreen({ records, onAdd, onUpdate, onDelete }) {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth()) // 0~11
  const [selectedDate, setSelectedDate] = useState(null)

  const today = todayString()

  const onMove = (diff) => {
    const next = moveMonth(year, month, diff)
    setYear(next.year)
    setMonth(next.month)
  }

  // 날짜를 고르면 캘린더 대신 기록 카드를 보여 준다
  if (selectedDate != null) {
    const record = records.filter((r) => r.date == selectedDate)[0]
    return (
      <RecordCard
        date={selectedDate}
        record={record}
        onAdd={onAdd}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onClose={() => setSelectedDate(null)}
      />
    )
  }

  // 달력 칸 만들기: 1일 앞은 빈칸(null), 마지막 주도 7칸이 되도록 빈칸 추가
  const firstDay = new Date(year, month, 1).getDay()
  const lastDate = new Date(year, month + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= lastDate; d++) cells.push(d)
  while (cells.length % 7 != 0) cells.push(null)

  const weeks = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))

  return (
    <View style={styles.card}>
      <MonthNav year={year} month={month} onMove={onMove} />

      <View style={styles.week}>
        {DAY_NAMES.map((name) => (
          <Text key={name} style={styles.dayName}>{name}</Text>
        ))}
      </View>

      {weeks.map((week, wi) => (
        <View key={wi} style={styles.week}>
          {week.map((day, di) => {
            if (day == null) return <View key={di} style={styles.cell} />

            const date = toDateString(year, month, day)
            const record = records.filter((r) => r.date == date)[0]
            const weather = record ? findWeather(record.weather) : null
            const isFuture = date > today // 문자열 비교로 미래 날짜 판별

            return (
              <TouchableOpacity
                key={di}
                style={[styles.cell, date == today ? styles.todayCell : null]}
                disabled={isFuture}
                onPress={() => setSelectedDate(date)}
              >
                <Text style={[styles.dayNumber, isFuture ? styles.futureText : null]}>{day}</Text>
                <Text style={styles.icon}>{weather ? weather.icon : ''}</Text>
              </TouchableOpacity>
            )
          })}
        </View>
      ))}

      <Text style={styles.hint}>날짜를 누르면 그날의 마음날씨를 기록할 수 있어요.</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.card, borderRadius: 20, padding: 16 },
  week: { flexDirection: 'row' },
  dayName: {
    flex: 1,
    textAlign: 'center',
    fontSize: 13,
    color: COLORS.quiet,
    marginBottom: 6,
  },
  cell: { flex: 1, height: 56, alignItems: 'center', paddingTop: 4, borderRadius: 12 },
  todayCell: { backgroundColor: '#EAF3FB' },
  dayNumber: { fontSize: 13, color: COLORS.ink },
  futureText: { color: '#C3CFD9' },
  icon: { fontSize: 20, marginTop: 2 },
  hint: { fontSize: 13, color: COLORS.quiet, textAlign: 'center', marginTop: 12 },
})
