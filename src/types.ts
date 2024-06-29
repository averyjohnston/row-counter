import 'react';

export interface Counter {
  id: number;
  name: string;
  color: string;
  count: number;
}

// extend CSSProperties type to allow variable declarations in style prop
declare module 'react' {
  interface CSSProperties {
    [key: `--${string}`]: string | number
  }
}
