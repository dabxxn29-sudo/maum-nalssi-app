import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { COLORS } from './common'

// 이전 달 / 다음 달 이동 바 (Home, Stats에서 함께 사용)
export default function MonthNav({ year, month, onMove }) {
  return (
    <View style={styles.row}>
      <TouchableOpacity style={styles.arrow} onPress={() => onMove(-1)}>
        <Text style={styles.arrowText}>‹</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{year}년 {month + 1}월</Text>
      <TouchableOpacity style={styles.arrow} onPress={() => onMove(1)}>
        <Text style={styles.arrowText}>›</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  arrow: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  arrowText: { fontSize: 28, color: COLORS.accent },
  title: { fontSize: 18, fontWeight: 'bold', color: COLORS.ink },
})
