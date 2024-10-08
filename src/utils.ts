import type { CSSProperties } from 'react';
import type { Params } from 'react-router-dom';

import { db } from './db';
import type { Counter, CounterFormProps, SubCounter } from './types';

export function createDefaultCounter(): Counter {
  return {
    id: 0,
    name: '',
    count: 0,
    color: '#f5f5f5',
    resetValue: 0,
    subCounters: [],
  };
}

export function createDefaultSubCounter(parentCounter?: Counter): SubCounter {
  const { subCounters: _, ...defaultCounterNoSubs } = createDefaultCounter();

  if (parentCounter) {
    defaultCounterNoSubs.color = parentCounter.color;
  }

  return defaultCounterNoSubs;
}

export async function loadCounter(params: Params<string>) {
  const { id } = params;
  const idNum = parseInt(id || '');
  if (isNaN(idNum)) {
    throw new Error(`Invalid counter ID: ${id}`);
  }

  const counter = await db.counters.get(idNum);
  if (counter === undefined) {
    throw new Error(`No counter matching ID: ${id}`);
  }

  return counter;
}

export async function loadCounterWithSubs(params: Params<string>) {
  const counter = await loadCounter(params);
  const subCounters = await db.subCounters.bulkGet(counter.subCounters);

  return {
    counter,
    subCounters,
  };
}

function getContrastColor(baseColor: string, baseColor2?: string) {
  const black = '#000000';
  const white = '#ffffff';

  const calculateLuminance = (color: string) => {
    const trimmed = color.replace('#', '');
    const rgb = [];

    if (/^[0-9A-F]{3}$/i.test(trimmed)) {
      for (let i = 0; i < trimmed.length; i++) {
        const char = trimmed.charAt(i);
        rgb.push(parseInt(char + char, 16));
      }
    } else if (/^[0-9A-F]{6}$/i.test(trimmed)) {
      for (let i = 0; i < trimmed.length; i += 2) {
        rgb.push(parseInt(trimmed.substring(i, i + 2), 16));
      }
    } else {
      console.warn('Invalid hex code supplied to getContrastColor:', color);
      return 0;
    }

    // https://stackoverflow.com/a/3943023
    return rgb[0] * 0.299 + rgb[1] * 0.587 + rgb[2] * 0.114;
  };

  let luminance = calculateLuminance(baseColor);

  if (baseColor2 !== undefined) {
    luminance = (luminance + calculateLuminance(baseColor2)) / 2;
  }

  // threshold can be adjusted to taste
  return luminance > 150 ? black : white;
}

export function createContrastColorStyles(color: string, color2?: string): CSSProperties {
  const bg = color2 ? `linear-gradient(to right, ${color} 25%, ${color2} 75%)` : color;

  return {
    '--background': bg,
    '--color': getContrastColor(color, color2),
  };
}

export async function increment(counterID: number, isSubCounter = false) {
  const table = isSubCounter ? 'subCounters' : 'counters';
  return db[table].where({ id: counterID }).modify(counter => { counter.count++; });
}

export async function decrement(counterID: number, isSubCounter = false) {
  const table = isSubCounter ? 'subCounters' : 'counters';
  return db[table].where({ id: counterID }).modify(counter => { counter.count--; });
}

export async function reset(counterID: number, isSubCounter = false) {
  const table = isSubCounter ? 'subCounters' : 'counters';
  return db[table].where({ id: counterID }).modify(counter => { counter.count = counter.resetValue });
}

export function parseFormData(formData: FormData): CounterFormProps {
  const { name, color, color2, resetValue } = Object.fromEntries(formData);

  return {
    name: name.toString(),
    color: color.toString(),
    color2: color2?.toString(),
    resetValue: parseInt(resetValue.toString()),
  };
}

export function clickVibrate() {
  navigator.vibrate(50);
}

export function isSubCounter(counter: Counter | SubCounter): counter is SubCounter {
  return (counter as Counter).subCounters === undefined;
}
