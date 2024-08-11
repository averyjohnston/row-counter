import { IonButton, IonContent, IonIcon, IonList, IonPopover } from '@ionic/react';
import { addCircleOutline, ellipsisVertical, refreshCircleOutline, removeCircleOutline } from 'ionicons/icons';
import { useContext } from 'react';
import { Link, useFetcher } from 'react-router-dom';

import { globalSettingsContext } from '../App';
import type { Counter, SubCounter } from '../types';
import { clickVibrate, createCounterColorStyles, isSubCounter } from '../utils';

import ContextMenuItemForm from './ContextMenuItemForm';
import './MiniCounter.scss';

export default function MiniCounter(props: {
  counter: Counter | SubCounter,
  showExtraButtons?: boolean
}) {
  const { counter, showExtraButtons } = props;
  const { globalSettings } = useContext(globalSettingsContext);
  const isSub = isSubCounter(counter);
  const fetcher = useFetcher();

  const info = (
    <>
      <p>{counter.name}</p>
      <p>{counter.count}</p>
    </>
  );

  // submitting this imperatively avoids needing to render a ton of hidden inputs
  const submissionInPlaceFormData = {
    counterID: counter.id,
    isSubCounter: isSub + '',
    hapticsEnabled: globalSettings.haptics ? 'true' : 'false',
  };

  // TODO: does it make sense to create a similar helper component for the buttons that use this?
  // so we don't have this weird behavior duplication?
  const submitWithoutNavigation = (intent: string, vibrate: boolean = false) => {
    // vibrate before action gets called to avoid tiny but noticeable delay
    if (vibrate && globalSettings.haptics) clickVibrate();

    fetcher.submit({
      intent,
      ...submissionInPlaceFormData,
    }, {
      method: 'post',
    });
  };

  const moreOptionsButtonID = `more-options-${counter.id}`;

  return (
    <div className="mini-counter">
      {showExtraButtons && <div className="mini-counter__extra-buttons">
        <IonButton fill="clear" onClick={() => submitWithoutNavigation('reset')}>
          <IonIcon slot="icon-only" size="large" icon={refreshCircleOutline} />
        </IonButton>
      </div>}
      <div className="mini-counter__counter" style={createCounterColorStyles(counter)}>
        <button className="mini-counter__button" onClick={() => submitWithoutNavigation('decrement', true)}>
          <IonIcon icon={removeCircleOutline} />
        </button>
        {/* TODO: consider doing this instead https://stackoverflow.com/a/69831173 */}
        {isSub ?
          <div className="mini-counter__info">{info}</div> :
          <Link className="mini-counter__info" to={`counters/${(counter as Counter).id}`}>{info}</Link>
        }
        <button className="mini-counter__button" onClick={() => submitWithoutNavigation('increment', true)}>
          <IonIcon icon={addCircleOutline} />
        </button>
      </div>
      {showExtraButtons && <div className="mini-counter__extra-buttons">
        <IonButton fill="clear" id={moreOptionsButtonID}>
          <IonIcon slot="icon-only" icon={ellipsisVertical} />
        </IonButton>
        <IonPopover trigger={moreOptionsButtonID}>
          <IonContent>
            <IonList>
              <ContextMenuItemForm action="edit-sub" formData={{ counterID: counter.id }}>Edit</ContextMenuItemForm>
              <ContextMenuItemForm method="post" formData={{
                ...submissionInPlaceFormData,
                intent: 'delete',
              }}>Delete</ContextMenuItemForm>
            </IonList>
          </IonContent>
        </IonPopover>
      </div>}
    </div>
  );
}
