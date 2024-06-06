import Dexie, { type EntityTable } from 'dexie';
import type { Counter } from './types';

export const db = new Dexie('CountersDatabase') as Dexie & {
  counters: EntityTable<Counter, 'id'>
};

db.version(1).stores({
  counters: '++id, name, count'
});
