import { IonToggle } from "@ionic/react";
import { GlobalSettings } from "../types";
import { PropsWithChildren, useContext } from "react";
import { globalSettingsContext } from "../App";

export default function BasicSettingToggle(props: PropsWithChildren<{
  settingKey: keyof GlobalSettings;
}>) {
  const { children, settingKey } = props;
  const { globalSettings, saveGlobalSettings } = useContext(globalSettingsContext);

  return (
    <IonToggle checked={globalSettings[settingKey]} onIonChange={(ev) => {
      saveGlobalSettings({
        ...globalSettings,
        [settingKey]: ev.detail.checked
      });
    }}>{children}</IonToggle>
  );
}
