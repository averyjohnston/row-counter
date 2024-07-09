import { useContext } from "react";
import { Counter } from "../types";
import { clickVibrate, createCounterColorStyles, decrement, increment } from "../utils";
import { globalSettingsContext } from "../App";
import { IonIcon } from "@ionic/react";
import { removeCircleOutline, addCircleOutline } from "ionicons/icons";
import { Link } from "react-router-dom";

import './MiniCounter.scss';

export default function MiniCounter(props: { counter: Counter }) {
  const { counter } = props;
  const { globalSettings } = useContext(globalSettingsContext);

  return (
    <div className="mini-counter" style={createCounterColorStyles(counter)}>
      <button className="mini-counter__button" onClick={() => {
        if (globalSettings.haptics) clickVibrate();
        decrement(counter.id);
      }}>
        <IonIcon icon={removeCircleOutline} />
      </button>
      <Link className="mini-counter__info" to={`counters/${counter.id}`}>
        <p>{counter.name}</p>
        <p>{counter.count}</p>
      </Link>
      <button className="mini-counter__button" onClick={() => {
        if (globalSettings.haptics) clickVibrate();
        increment(counter.id);
      }}>
        <IonIcon icon={addCircleOutline} />
      </button>
    </div>
  );
}
