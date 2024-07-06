import { IonButtons, IonContent, IonHeader, IonItem, IonList, IonPage, IonTitle, IonToggle, IonToolbar } from "@ionic/react";
import BackButton from "../components/BackButton";
import { useContext } from "react";
import { globalSettingsContext } from "../App";

export default function SettingsPage() {
  const { globalSettings, saveGlobalSettings } = useContext(globalSettingsContext);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <BackButton />
          </IonButtons>
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>
          <IonItem>
            <IonToggle checked={globalSettings.darkMode} onIonChange={(ev) => {
              saveGlobalSettings({
                ...globalSettings,
                darkMode: ev.detail.checked
              });
            }}>Dark Mode</IonToggle>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  )
}
