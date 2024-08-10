import { IonButton, IonIcon } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import { Link } from 'react-router-dom';

function BackButton(props: { to?: string }) {
  const { to } = props;

  return (
    <Link to={to || '/'}>
      <IonButton>
        <IonIcon slot="icon-only" icon={arrowBack} />
      </IonButton>
    </Link>
  );
}

export default BackButton;
