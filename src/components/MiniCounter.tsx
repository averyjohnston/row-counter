import { useContext } from "react";
import { Counter, SubCounter } from "../types";
import { clickVibrate, createCounterColorStyles, isSubCounter } from "../utils";
import { globalSettingsContext } from "../App";
import { IonIcon } from "@ionic/react";
import { removeCircleOutline, addCircleOutline } from "ionicons/icons";
import { Link, useFetcher } from "react-router-dom";

import './MiniCounter.scss';

export default function MiniCounter(props: { counter: Counter | SubCounter }) {
  const { counter } = props;
  const { globalSettings } = useContext(globalSettingsContext);
  const isSub = isSubCounter(counter);
  const fetcher = useFetcher();

  const info = <>
    <p>{counter.name}</p>
    <p>{counter.count}</p>
  </>;

  const makeHiddenInputs = (intent: string) => {
    return <>
      <input type="hidden" name="intent" value={intent} />
      <input type="hidden" name="counterID" value={counter.id} />
      <input type="hidden" name="isSubCounter" value={isSub + ''} />
    </>;
  };

  // clickVibrate is called onClick instead of in action to avoid tiny but noticeable delay
  return (
    <div className="mini-counter" style={createCounterColorStyles(counter)}>
      <fetcher.Form method="post">
        <button className="mini-counter__button" onClick={globalSettings.haptics ? clickVibrate : undefined}>
          <IonIcon icon={removeCircleOutline} />
        </button>
        {makeHiddenInputs('decrement')}
      </fetcher.Form>
      {/* TODO: consider doing this instead https://stackoverflow.com/a/69831173 */}
      {isSub ?
        <div className="mini-counter__info">{info}</div> :
        <Link className="mini-counter__info" to={`counters/${(counter as Counter).id}`}>{info}</Link>
      }
      <fetcher.Form method="post">
        <button className="mini-counter__button" onClick={globalSettings.haptics ? clickVibrate : undefined}>
          <IonIcon icon={addCircleOutline} />
        </button>
        {makeHiddenInputs('increment')}
      </fetcher.Form>
    </div>
  );
}
