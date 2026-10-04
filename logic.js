// 날짜는 폰 현지 시간 기준 'YYYY-MM-DD' 문자열로 다룬다 (문자열 비교 = 날짜 비교).
// 항목: 루틴 { id, type: 'routine', title, date(시작일), doneDates: [날짜...] }
//       할 일 { id, type: 'todo', title, date(할 날짜), doneOn: 날짜|null }
export const ymd = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export const toDate = (dateStr) => {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export const addDays = (dateStr, n) => {
  const d = toDate(dateStr);
  d.setDate(d.getDate() + n);
  return ymd(d);
};

export const daysBetween = (a, b) => Math.round((toDate(b) - toDate(a)) / 864e5);

export const isDone = (i, day) => (i.type === 'routine' ? i.doneDates.includes(day) : i.doneOn === day);

// 그 날 보일 루틴: 시작일 이후 매일
export const dayRoutines = (items, day) => items.filter((i) => i.type === 'routine' && i.date <= day);

// 그 날 보일 할 일
// - 완료한 것: 완료한 날에만
// - 안 한 것: 오늘이면 밀린 것까지 전부, 미래면 그 날짜 것만, 과거엔 안 보임(오늘로 넘어와 있음)
export const dayTodos = (items, day, today) =>
  items.filter(
    (i) =>
      i.type === 'todo' &&
      (i.doneOn ? i.doneOn === day : day === today ? i.date <= today : day > today && i.date === day)
  );

// 안 한 것 먼저, 그다음 추가한 순서
export const sortItems = (list, day) => [...list].sort((a, b) => isDone(a, day) - isDone(b, day) || a.id - b.id);

// 예전 버전 데이터(루틴에 doneOn 하나만 저장) → doneDates 목록으로
export const migrate = (items) =>
  items.map(({ doneOn, ...i }) =>
    i.type === 'routine' && !i.doneDates ? { ...i, doneDates: doneOn ? [doneOn] : [] } : { doneOn, ...i }
  );
