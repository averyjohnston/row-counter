import Dexie, { type EntityTable } from 'dexie';
import type { Counter, SubCounter } from './types';

export const db = new Dexie('CountersDatabase') as Dexie & {
  counters: EntityTable<Counter, 'id'>,
  subCounters: EntityTable<SubCounter, 'id'>
};

db.version(4).stores({
  counters: '++id, name',
  subCounters: '++id, name'
});
