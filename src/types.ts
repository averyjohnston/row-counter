import 'react';

export type CounterFormProps = {
  name: string,
  color: string,
  color2?: string,
  resetValue: number
}

export type SubCounter = CounterFormProps & {
  id: number,
  count: number
}

export type Counter = SubCounter & {
  subCounters: number[]
}

export type GlobalSettings = {
  darkMode: boolean,
  screenLock: boolean,
  haptics: boolean,
  showMiniCounterExtraButtons: boolean
}

export type CounterWithSubsLoaderResults = {
  counter: Counter,
  subCounters: SubCounter[]
}

// extend CSSProperties type to allow variable declarations in style prop
declare module 'react' {
  interface CSSProperties {
    [key: `--${string}`]: string | number
  }
}
