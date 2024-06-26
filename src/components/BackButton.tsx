import { IonButton, IonIcon } from "@ionic/react";
import { Link } from "react-router-dom";
import { arrowBack } from "ionicons/icons";

function BackButton(props: { to?: string }) {
  const { to } = props;

  return (
    <Link to={to || '/'}>
      <IonButton>
        <IonIcon slot="icon-only" icon={arrowBack}></IonIcon>
      </IonButton>
    </Link>
  );
}

export default BackButton;
