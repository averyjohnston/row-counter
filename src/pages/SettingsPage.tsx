import { IonButtons, IonContent, IonHeader, IonItem, IonList, IonPage, IonTitle, IonToggle, IonToolbar } from "@ionic/react";
import BackButton from "../components/BackButton";
import { useContext } from "react";
import { globalSettingsContext } from "../App";

// TODO: use useContext to update setting: https://stackoverflow.com/a/69675545
// should just need to read dark mode setting once at topmost level?
// then just use Ionic's class-based dark mode thing
// probably just use localstorage for this?

export default function SettingsPage() {
  const { globalSettings, setGlobalSettings } = useContext(globalSettingsContext);

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
              setGlobalSettings({
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
