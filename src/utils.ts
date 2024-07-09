import { CSSProperties } from "react";
import { db } from "./db";
import { Counter, CounterFormProps } from "./types";

export function createDefaultCounter(): Counter {
  return {
    id: 0,
    name: "",
    count: 0,
    color: '#f5f5f5',
    resetValue: 0
  };
}

export function createCounterColorStyles(counter: Counter): CSSProperties {
  return {
    '--background': counter.color,
    '--color': getContrastColor(counter.color)
  };
}

export function getContrastColor(baseColor: string) {
  const black = '#000000';
  const white = '#ffffff';

  const trimmed = baseColor.replace('#', '');
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
    console.warn('Invalid hex code supplied to getContrastColor:', baseColor);
    return black;
  }

  // https://stackoverflow.com/a/3943023
  // 150 is a luminance threshold and can be adjusted to taste
  return rgb[0]*0.299 + rgb[1]*0.587 + rgb[2]*0.114 > 150 ? black : white;
}

export async function increment(counterID: number) {
  return db.counters.where({ id: counterID }).modify(counter => { counter.count++; });
}

export async function decrement(counterID: number) {
  return db.counters.where({ id: counterID }).modify(counter => { counter.count--; });
}

export async function reset(counterID: number) {
  return db.counters.where({ id: counterID }).modify(counter => { counter.count = counter.resetValue });
}

export function parseFormData(formData: FormData): CounterFormProps {
  const { name, color, resetValue } = Object.fromEntries(formData);

  return {
    name: name.toString(),
    color: color.toString(),
    resetValue: parseInt(resetValue.toString())
  };
}

export function clickVibrate() {
  navigator.vibrate(50);
}
