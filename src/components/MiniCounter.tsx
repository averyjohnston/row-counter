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
  const { counter, showExtraButtons } = props;
  const { globalSettings } = useContext(globalSettingsContext);
  const isSub = isSubCounter(counter);

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

  const moreOptionsButtonID = `more-options-${counter.id}`;

  return (
    <div className="mini-counter">
      {showExtraButtons && <div className="mini-counter__extra-buttons">
        <ButtonAction ionButton={true} formData={{
          intent: 'reset',
          ...submissionInPlaceFormData,
        }}>
          <IonIcon slot="icon-only" size="large" icon={refreshCircleOutline} />
        </ButtonAction>
      </div>}
      <div className="mini-counter__counter" style={createCounterColorStyles(counter)}>
        <ButtonAction haptics={true} className="mini-counter__button" formData={{
          intent: 'decrement',
          ...submissionInPlaceFormData,
        }}>
          <IonIcon icon={removeCircleOutline} />
        </ButtonAction>
        {/* TODO: consider doing this instead https://stackoverflow.com/a/69831173 */}
        {isSub ?
          <div className="mini-counter__info">{info}</div> :
          <Link className="mini-counter__info" to={`counters/${(counter as Counter).id}`}>{info}</Link>
        }
        <ButtonAction haptics={true} className="mini-counter__button" formData={{
          intent: 'increment',
          ...submissionInPlaceFormData,
        }}>
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
              <ContextMenuItemAction method="post" formData={{
                ...submissionInPlaceFormData,
                intent: 'delete',
              }}>Delete</ContextMenuItemAction>
            </IonList>
          </IonContent>
        </IonPopover>
      </div>}
    </div>
  );
}
