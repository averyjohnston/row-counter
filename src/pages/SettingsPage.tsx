import { IonButtons, IonContent, IonHeader, IonItem, IonLabel, IonList, IonNote, IonPage, IonTitle, IonToggle, IonToolbar } from "@ionic/react";
import BackButton from "../components/BackButton";
import { useContext, useState } from "react";
import { globalSettingsContext } from "../App";
import useWakeLock from "react-use-wake-lock";

// TODO: consider making wrapper component for basic settings toggle
// probably just don't worry about replacing screen lock setting since it's fairly custom

export default function SettingsPage() {
  const { globalSettings, saveGlobalSettings } = useContext(globalSettingsContext);
  const { request, release, isSupported } = useWakeLock();

  /**
   * React-use-wake-lock has a bug where if the lock is requested on page load
   * (like when refreshing the page with the setting on), the lock still goes
   * through, but it doesn't get flagged as such internally. If the toggle is
   * then switched off, the lock doesn't get released.
   *
   * We show a message whenever the toggle is switched off telling the user
   * to refresh the page, ensuring the lock is released. Technically this isn't
   * necessary if the setting was off on page load, but this way is simpler.
   */
  const [shouldShowLockMessage, setShouldShowLockMessage] = useState(false);

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
            }}>Dark mode</IonToggle>
          </IonItem>
          <IonItem>
            <IonToggle checked={globalSettings.haptics} onIonChange={(ev) => {
              saveGlobalSettings({
                ...globalSettings,
                haptics: ev.detail.checked
              })
            }}>Vibration</IonToggle>
          </IonItem>
          <IonItem>
            <IonToggle disabled={!isSupported} checked={isSupported && globalSettings.screenLock} onIonChange={(ev) => {
              const shouldLock = ev.detail.checked;
              if (shouldLock) {
                request();
              } else {
                release();
                setShouldShowLockMessage(true);
              }

              saveGlobalSettings({
                ...globalSettings,
                screenLock: shouldLock
              });
            }}>
              <IonLabel>Screen always on</IonLabel>
              {!isSupported && <IonNote>Not supported on your device</IonNote>}
              {shouldShowLockMessage && <IonNote>Refresh page to update</IonNote>}
            </IonToggle>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  )
}
