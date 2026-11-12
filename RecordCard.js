import { useState } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native'
import { WEATHERS, findWeather, toKoreanDate, COLORS } from './common'

// 한 날짜의 기록을 쓰고, 고치고, 지우는 카드
// record가 있으면 수정 모드, 없으면 새 기록 모드
export default function RecordCard({ date, record, onAdd, onUpdate, onDelete, onClose }) {
  const [weather, setWeather] = useState(record ? record.weather : '')
  const [score, setScore] = useState(record ? record.mood_score : 3)
  const [memo, setMemo] = useState(record ? record.memo : '')
  const [confirmDelete, setConfirmDelete] = useState(false)

  const selected = findWeather(weather)

  const onSave = () => {
    if (weather == '') {
      alert('오늘의 마음날씨를 골라 주세요.')
      return
    }
    if (record) onUpdate(record.id, weather, score, memo)
    else onAdd(date, weather, score, memo)
    onClose()
  }

  const onPressDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true) // 한 번 더 누르면 삭제
      return
    }
    onDelete(record.id)
    onClose()
  }

  return (
    // 고른 날씨에 따라 카드 배경색이 바뀐다
    <View style={[styles.card, { backgroundColor: selected ? selected.color : COLORS.card }]}>
      <View style={styles.top}>
        <Text style={styles.date}>{toKoreanDate(date)}</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.close}>닫기</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>오늘 당신의 마음 날씨는 어떤가요?</Text>
      <View style={styles.weatherRow}>
        {WEATHERS.map((w) => (
          <TouchableOpacity
            key={w.id}
            style={[styles.weatherButton, weather == w.id ? styles.weatherSelected : null]}
            onPress={() => setWeather(w.id)}
          >
            <Text style={styles.weatherIcon}>{w.icon}</Text>
            <Text style={styles.weatherLabel}>{w.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>오늘의 기분 {score}점</Text>
      <View style={styles.starRow}>
        {[1, 2, 3, 4, 5].map((n) => (
          <TouchableOpacity key={n} onPress={() => setScore(n)}>
            <Text style={styles.star}>{n <= score ? '★' : '☆'}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>한 줄 메모 ({memo.length}/50)</Text>
      <TextInput
        style={styles.input}
        value={memo}
        maxLength={50}
        placeholder="오늘 하루는 어땠나요? (비워 둬도 돼요)"
        onChangeText={(text) => setMemo(text)}
      />

      <TouchableOpacity style={styles.saveButton} onPress={onSave}>
        <Text style={styles.saveText}>{record ? '수정하기' : '기록하기'}</Text>
      </TouchableOpacity>

      {record ? (
        <TouchableOpacity style={styles.deleteButton} onPress={onPressDelete}>
          <Text style={styles.deleteText}>
            {confirmDelete ? '한 번 더 누르면 삭제돼요' : '기록 삭제'}
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  card: { borderRadius: 20, padding: 20 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  date: { fontSize: 22, fontWeight: 'bold', color: COLORS.ink },
  close: { fontSize: 15, color: COLORS.quiet },
  label: { fontSize: 15, color: COLORS.ink, marginTop: 20, marginBottom: 10 },
  weatherRow: { flexDirection: 'row', justifyContent: 'space-between' },
  weatherButton: {
    width: 52,
    paddingVertical: 8,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  weatherSelected: { borderColor: COLORS.accent, backgroundColor: '#FFFFFF' },
  weatherIcon: { fontSize: 26 },
  weatherLabel: { fontSize: 10, color: COLORS.quiet, marginTop: 4 },
  starRow: { flexDirection: 'row' },
  star: { fontSize: 32, color: '#F2B53B', marginRight: 6 },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.line,
    padding: 12,
    fontSize: 15,
  },
  saveButton: {
    backgroundColor: COLORS.accent,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  saveText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  deleteButton: { height: 40, justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  deleteText: { color: '#C0504D', fontSize: 14 },
})
