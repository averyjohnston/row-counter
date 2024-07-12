import { IonCheckbox, IonToggle } from "@ionic/react";
import { GlobalSettings } from "../types";
import { PropsWithChildren, useContext } from "react";
import { globalSettingsContext } from "../App";

export default function BasicSettingToggle(props: PropsWithChildren<{
  settingKey: keyof GlobalSettings,
  renderCheckbox?: boolean
}>) {
  const { children, renderCheckbox, settingKey } = props;
  const { globalSettings, saveGlobalSettings } = useContext(globalSettingsContext);
  const ToggleComponent = renderCheckbox ? IonCheckbox : IonToggle;

  return (
    <ToggleComponent checked={globalSettings[settingKey]} onIonChange={(ev) => {
      saveGlobalSettings({
        ...globalSettings,
        [settingKey]: ev.detail.checked
      });
    }}>{children}</ToggleComponent>
  );
}
