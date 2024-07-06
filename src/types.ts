import 'react';

export interface CounterFormProps {
  name: string;
  color: string;
  resetValue: number;
}

export interface Counter extends CounterFormProps {
  id: number;
  count: number;
}

export interface GlobalSettings {
  darkMode: boolean;
  screenLock: boolean;
}

// extend CSSProperties type to allow variable declarations in style prop
declare module 'react' {
  interface CSSProperties {
    [key: `--${string}`]: string | number
  }
}
