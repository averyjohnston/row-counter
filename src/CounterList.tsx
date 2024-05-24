import { useState } from 'react';
import type { Counter } from './utils';

import './CounterList.scss';

function CounterList() {
  const [counters, setCounters] = useState<Counter[]>([
    {
      id: 0,
      name: 'Example 1',
      count: 0
    },
    {
      id: 1,
      name: 'Example 2',
      count: 5
    }
  ]);

  const updateCount = (index: number, newCount: number) => {
    const newCounters = [...counters];
    newCounters[index].count = newCount;
    setCounters(newCounters);
  };

  return (
    <div className="counters">
      {counters.map((counter, index) => (
        <div key={counter.id} className="counter" onClick={() => {
          updateCount(index, counter.count + 1);
        }}>
          <div className="counter__name">{counter.name}</div>
          <div className="counter__count">{counter.count}</div>
        </div>
      ))}
    </div>
  );
}

export default CounterList;
