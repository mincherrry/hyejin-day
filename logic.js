// hyejin-day/logic.js 복사본 — 고치면 양쪽 다 고칠 것
// 날짜는 폰 현지 시간 기준 'YYYY-MM-DD' 문자열로 다룬다 (문자열 비교 = 날짜 비교).
export const ymd = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const toDate = (dateStr, h = 0, m = 0) => {
  const [y, mo, d] = dateStr.split('-').map(Number);
  return new Date(y, mo - 1, d, h, m);
};

export const addDays = (dateStr, n) => {
  const d = toDate(dateStr);
  d.setDate(d.getDate() + n);
  return ymd(d);
};

export const daysBetween = (a, b) => Math.round((toDate(b) - toDate(a)) / 864e5);

// 지난 날 완료한 할 일은 버린다. 루틴은 매일 다시 쓰니 남긴다.
export const prune = (items, today) =>
  items.filter((i) => !(i.type === 'todo' && i.doneOn && i.doneOn < today));

// 오늘 화면의 할 일: 아직 안 한 것 중 오늘 이전 날짜(밀린 것 포함) + 오늘 완료한 것
export const todayTodos = (items, today) =>
  items.filter((i) => i.type === 'todo' && (i.doneOn ? i.doneOn === today : i.date <= today));

// 안 한 것 먼저, 그 안에서 시간순(시간 없는 건 뒤), 그다음 추가한 순서
export const sortItems = (list, today) =>
  [...list].sort(
    (a, b) =>
      (a.doneOn === today) - (b.doneOn === today) ||
      (a.time ?? '99').localeCompare(b.time ?? '99') ||
      a.id - b.id
  );

// 앞으로 며칠 동안 울릴 알림 목록. 앱을 열 때마다 다시 계산해서 예약한다.
// ponytail: 7일치만 예약 — 엄마가 7일 넘게 앱을 안 열면 알림이 멈춤. 문제 되면 days를 늘리면 됨 (삼성은 앱당 알람 500개 제한).
export function alarmTimes(items, now, days = 7) {
  const today = ymd(now);
  const out = [];
  for (const i of items) {
    if (!i.time || (i.type === 'todo' && i.doneOn)) continue;
    const [h, m] = i.time.split(':').map(Number);
    for (let d = 0; d < days; d++) {
      const day = addDays(today, d);
      if (i.type === 'routine' && d === 0 && i.doneOn === today) continue; // 이미 한 루틴은 오늘 안 울림
      if (i.type === 'todo' && day < i.date) continue; // 미룬 할 일은 그 날짜부터
      const at = toDate(day, h, m);
      if (at > now) out.push({ item: i, at });
    }
  }
  return out;
}
