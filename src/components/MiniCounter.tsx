import { useContext } from 'react';
import type { Counter, SubCounter } from '../types';
import { clickVibrate, createCounterColorStyles, isSubCounter } from '../utils';
import { globalSettingsContext } from '../App';
import { IonButton, IonIcon } from '@ionic/react';
import { addCircleOutline, createOutline, refreshCircleOutline, removeCircleOutline, trashOutline } from 'ionicons/icons';
import { Form, Link, useFetcher } from 'react-router-dom';

import './MiniCounter.scss';

export default function MiniCounter(props: {
  counter: Counter | SubCounter,
  showExtraButtons?: boolean
}) {
  const { counter, showExtraButtons } = props;
  const { globalSettings } = useContext(globalSettingsContext);
  const isSub = isSubCounter(counter);
  const fetcher = useFetcher();

  const info = <>
    <p>{counter.name}</p>
    <p>{counter.count}</p>
  </>;

  // TODO: is there a better way to do this that doesn't involve rendering a million inputs?
  // maybe imperitive submits instead so it can be put in a helper func?
  // or the state prop on the forms? (can you do that with a fetcher?)
  const makeHiddenInputs = (intent?: string) => {
    return <>
      <input type="hidden" name="intent" value={intent} />
      <input type="hidden" name="counterID" value={counter.id} />
      <input type="hidden" name="isSubCounter" value={isSub + ''} />
    </>;
  };

  // clickVibrate is called onClick instead of in action to avoid tiny but noticeable delay
  return (
    <div className="mini-counter">
      {showExtraButtons && <div className="mini-counter__extra-buttons">
        <fetcher.Form method="post">
          <IonButton type="submit" fill="clear">
            <IonIcon slot="icon-only" size="large" icon={refreshCircleOutline} />
          </IonButton>
          {makeHiddenInputs('reset')}
          <input type="hidden" name="hapticsEnabled" value={globalSettings.haptics ? 'true' : 'false'} />
        </fetcher.Form>
      </div>}
      <div className="mini-counter__counter" style={createCounterColorStyles(counter)}>
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
      {/* TODO: consider moving these into a dropdown menu so it's symmetrical */}
      {showExtraButtons && <div className="mini-counter__extra-buttons">
        <fetcher.Form method="delete">
          <IonButton type="submit" fill="clear">
            <IonIcon slot="icon-only" size="large" icon={trashOutline} />
          </IonButton>
          {makeHiddenInputs('delete')}
        </fetcher.Form>
        <Form action="edit-sub">
          <IonButton type="submit" fill="clear">
            <IonIcon slot="icon-only" size="large" icon={createOutline} />
          </IonButton>
          <input type="hidden" name="counterID" value={counter.id} />
        </Form>
      </div>}
    </div>
  );
}
