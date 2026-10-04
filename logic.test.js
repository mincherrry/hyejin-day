// 실행: node --test
import test from 'node:test';
import assert from 'node:assert/strict';
import { addDays, dayTodos, dayRoutines, migrate } from './logic.js';

const today = '2026-10-05';
const items = [
  { id: 1, type: 'todo', date: '2026-10-03', doneOn: null }, // 밀린 일
  { id: 2, type: 'todo', date: '2026-10-07', doneOn: null }, // 미리 넣은 일
  { id: 3, type: 'todo', date: '2026-10-03', doneOn: '2026-10-04' }, // 어제 완료
  { id: 4, type: 'todo', date: today, doneOn: today }, // 오늘 완료
  { id: 5, type: 'routine', date: '2026-10-04', doneDates: ['2026-10-04'] },
];
const ids = (list) => list.map((i) => i.id);

test('날짜별 할 일', () => {
  assert.deepEqual(ids(dayTodos(items, today, today)), [1, 4]);
  assert.deepEqual(ids(dayTodos(items, '2026-10-04', today)), [3]);
  assert.deepEqual(ids(dayTodos(items, '2026-10-07', today)), [2]);
  assert.deepEqual(ids(dayTodos(items, '2026-10-06', today)), []);
});

test('루틴은 시작일부터', () => {
  assert.deepEqual(ids(dayRoutines(items, '2026-10-03')), []);
  assert.deepEqual(ids(dayRoutines(items, '2026-10-09')), [5]);
});

test('월말 넘김, 예전 데이터 변환', () => {
  assert.equal(addDays('2026-10-31', 1), '2026-11-01');
  const [r, t] = migrate([
    { id: 1, type: 'routine', date: today, doneOn: today },
    { id: 2, type: 'todo', date: today, doneOn: null },
  ]);
  assert.deepEqual(r.doneDates, [today]);
  assert.equal('doneOn' in r, false);
  assert.equal(t.doneOn, null);
});
