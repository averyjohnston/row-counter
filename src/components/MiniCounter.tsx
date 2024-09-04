import { IonButton, IonContent, IonIcon, IonList, IonPopover } from '@ionic/react';
import { addCircleOutline, ellipsisVertical, refreshCircleOutline, removeCircleOutline } from 'ionicons/icons';
import { useContext } from 'react';
import { Link } from 'react-router-dom';

import { globalSettingsContext } from '../App';
import type { Counter, SubCounter } from '../types';
import { createCounterColorStyles, isSubCounter } from '../utils';

import ButtonAction from './ButtonAction';
import ContextMenuItemAction from './ContextMenuItemAction';
import './MiniCounter.scss';

export default function MiniCounter(props: {
  counter: Counter | SubCounter,
  showExtraButtons?: boolean
}) {
  /**
   * Note: Even though the showExtraButtons prop is generally just a mirror for the
   * showMiniCounterExtraButtons global setting, it's only set in certain circumstances,
   * i.e. when the MiniCounter is used to show a sub-counter (as opposed to in the main
   * counter list). We use a prop instead of checking the setting && isSub so that this
   * component doesn't concern itself too much with where it's being used.
   */
  const { counter, showExtraButtons } = props;
  const { globalSettings } = useContext(globalSettingsContext);
  const isSub = isSubCounter(counter);

  const info = (
    <>
      <p>{counter.name}</p>
      <p>{counter.count}</p>
    </>
  );

  const counterData = {
    counterID: counter.id,
    isSubCounter: isSub + '',
  };

  const moreOptionsButtonID = `more-options-${counter.id}`;

  return (
    <div className="mini-counter">
      {showExtraButtons && <div className="mini-counter__extra-buttons">
        <ButtonAction ionButton={true} formData={{
          intent: 'reset',
          ...counterData,
          hapticsEnabled: globalSettings.haptics + '',
        }}>
          <IonIcon slot="icon-only" size="large" icon={refreshCircleOutline} />
        </ButtonAction>
      </div>}
      <div className="mini-counter__counter" style={createCounterColorStyles(counter)}>
        <ButtonAction haptics={true} className="mini-counter__button" formData={{ intent: 'decrement', ...counterData }}>
          <IonIcon icon={removeCircleOutline} />
        </ButtonAction>
        {isSub ?
          <div className="mini-counter__info">{info}</div> :
          <Link className="mini-counter__info" to={`counters/${(counter as Counter).id}`}>{info}</Link>
        }
        <ButtonAction haptics={true} className="mini-counter__button" formData={{ intent: 'increment', ...counterData }}>
          <IonIcon icon={addCircleOutline} />
        </ButtonAction>
      </div>
      {showExtraButtons && <div className="mini-counter__extra-buttons">
        <IonButton fill="clear" id={moreOptionsButtonID}>
          <IonIcon slot="icon-only" icon={ellipsisVertical} />
        </IonButton>
        <IonPopover trigger={moreOptionsButtonID}>
          <IonContent>
            <IonList>
              <ContextMenuItemAction action="edit-sub" formData={{ counterID: counter.id }}>Edit</ContextMenuItemAction>
              <ContextMenuItemAction method="post" formData={{ intent: 'delete', ...counterData }}>Delete</ContextMenuItemAction>
            </IonList>
          </IonContent>
        </IonPopover>
      </div>}
    </div>
  );
}
