// 마음날씨에서 함께 쓰는 날씨 목록과 날짜 함수

export const WEATHERS = [
  { id: 'sunny', icon: '☀️', label: '맑음', color: '#FFF3D1' },
  { id: 'partly', icon: '⛅', label: '구름 조금', color: '#E3F1FC' },
  { id: 'cloudy', icon: '☁️', label: '흐림', color: '#E4E7EC' },
  { id: 'rain', icon: '🌧️', label: '비', color: '#D3DEEA' },
  { id: 'storm', icon: '⛈️', label: '폭풍', color: '#C3C8D3' },
  { id: 'rainbow', icon: '🌈', label: '무지개', color: '#F1E6FB' },
]

// id로 날씨 정보 찾기 (없으면 undefined)
export const findWeather = (id) => WEATHERS.filter((w) => w.id == id)[0]

// 숫자를 두 자리 문자로: 3 -> '03'
const two = (n) => (n < 10 ? '0' + n : '' + n)

// 연, 월(0~11), 일 -> '2026-11-03'
// toISOString()은 시간대 때문에 날짜가 하루 밀릴 수 있어서 쓰지 않는다
export const toDateString = (year, month, day) =>
  year + '-' + two(month + 1) + '-' + two(day)

// 오늘 날짜 문자열
export const todayString = () => {
  const t = new Date()
  return toDateString(t.getFullYear(), t.getMonth(), t.getDate())
}

// '2026-11-03' -> '11월 3일'
export const toKoreanDate = (dateString) =>
  Number(dateString.slice(5, 7)) + '월 ' + Number(dateString.slice(8, 10)) + '일'

// 달 이동: diff가 -1이면 이전 달, 1이면 다음 달
export const moveMonth = (year, month, diff) => {
  const d = new Date(year, month + diff, 1)
  return { year: d.getFullYear(), month: d.getMonth() }
}

export const COLORS = {
  sky: '#CFE6F7',
  ink: '#2F4A60',
  quiet: '#6E8597',
  accent: '#4F86B5',
  card: '#FFFFFF',
  line: '#D9E6F0',
}
