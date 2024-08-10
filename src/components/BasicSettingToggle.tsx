import { IonCheckbox, IonToggle } from '@ionic/react';
import type { PropsWithChildren } from 'react';
import { useContext } from 'react';

import { globalSettingsContext } from '../App';
import type { GlobalSettings } from '../types';

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
        [settingKey]: ev.detail.checked,
      });
    }}>{children}</ToggleComponent>
  );
}
