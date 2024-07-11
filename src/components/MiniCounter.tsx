import { useContext } from "react";
import { Counter, SubCounter } from "../types";
import { clickVibrate, createCounterColorStyles, decrement, increment, isSubCounter } from "../utils";
import { globalSettingsContext } from "../App";
import { IonIcon } from "@ionic/react";
import { removeCircleOutline, addCircleOutline } from "ionicons/icons";
import { Link } from "react-router-dom";

import './MiniCounter.scss';

export default function MiniCounter(props: { counter: Counter | SubCounter }) {
  const { counter } = props;
  const { globalSettings } = useContext(globalSettingsContext);
  const isSub = isSubCounter(counter);

  const info = <>
    <p>{counter.name}</p>
    <p>{counter.count}</p>
  </>;

  // TODO: wrap buttons in fetcher forms and use action instead
  return (
    <div className="mini-counter" style={createCounterColorStyles(counter)}>
      <button className="mini-counter__button" onClick={() => {
        if (globalSettings.haptics) clickVibrate();
        decrement(counter.id, isSub);
      }}>
        <IonIcon icon={removeCircleOutline} />
      </button>
      {/* TODO: consider doing this instead https://stackoverflow.com/a/69831173 */}
      {isSub ?
        <div className="mini-counter__info">{info}</div> :
        <Link className="mini-counter__info" to={`counters/${(counter as Counter).id}`}>{info}</Link>
      }
      <button className="mini-counter__button" onClick={() => {
        if (globalSettings.haptics) clickVibrate();
        increment(counter.id, isSub);
      }}>
        <IonIcon icon={addCircleOutline} />
      </button>
    </div>
  );
}
