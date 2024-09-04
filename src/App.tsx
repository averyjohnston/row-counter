import { IonApp, setupIonicReact } from '@ionic/react';
import { createContext, useEffect, useState } from 'react';
import type { LoaderFunction } from 'react-router-dom';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import useWakeLock from 'react-use-wake-lock';

import { db } from './db';
import CounterListPage, { action as CounterListPageAction, loader as counterListPageLoader } from './pages/CounterListPage';
import CounterPage, { action as counterPageAction } from './pages/CounterPage.tsx';
import EditCounterPage, { action as editCounterPageAction } from './pages/EditCounterPage.tsx';
import EditSubCounterPage, { action as editSubCounterPageAction, loader as editSubCounterPageLoader } from './pages/EditSubCounterPage.tsx';
import ErrorPage from './pages/ErrorPage.tsx';
import NewCounterPage, { action as newCounterPageAction } from './pages/NewCounterPage.tsx';
import NewSubCounterPage, { action as newSubCounterPageAction } from './pages/NewSubCounterPage.tsx';
import SettingsPage from './pages/SettingsPage.tsx';
import type { GlobalSettings } from './types.ts';

setupIonicReact();

// TODO: consider adding View Transitions API once it becomes stable in React Router and/or supported by more browsers
// https://reactrouter.com/en/6.26.1/components/link#unstable_viewtransition

// TODO: better hardware back button support? is that even possible without getting into Capacitor stuff?
// should generally go up a level similar to how BackButton component works now
// hitting it on counter list should close page if possible

const DEFAULT_SETTINGS: GlobalSettings = {
  darkMode: false,
  screenLock: false,
  haptics: true,
  showMiniCounterExtraButtons: true,
};

export const globalSettingsContext = createContext<{
  globalSettings: GlobalSettings,
  saveGlobalSettings: (newSettings: GlobalSettings) => void
}>({
  globalSettings: { ...DEFAULT_SETTINGS },
  saveGlobalSettings: () => {},
});

const counterLoader: LoaderFunction = async ({ params }) => {
  const { id } = params;
  const idNum = parseInt(id || '');
  if (isNaN(idNum)) {
    throw new Error(`Invalid counter ID: ${id}`);
  }

  const counter = await db.counters.get(idNum);
  if (counter === undefined) {
    throw new Error(`No counter matching ID: ${id}`);
  }

  const subCounters = await db.subCounters.bulkGet(counter.subCounters);

  return {
    counter,
    subCounters,
  };
};

const router = createBrowserRouter([
  {
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <CounterListPage />,
        loader: counterListPageLoader,
        action: CounterListPageAction,
      },
      {
        path: 'counters/:id',
        element: <CounterPage />,
        loader: counterLoader,
        action: counterPageAction,
      },
      {
        path: 'counters/new',
        element: <NewCounterPage />,
        action: newCounterPageAction,
      },
      {
        path: 'counters/:id/edit',
        element: <EditCounterPage />,
        loader: counterLoader,
        action: editCounterPageAction,
      },
      {
        path: 'counters/:id/new-sub',
        element: <NewSubCounterPage />,
        action: newSubCounterPageAction,
      },
      {
        path: 'counters/:id/edit-sub',
        element: <EditSubCounterPage />,
        action: editSubCounterPageAction,
        loader: editSubCounterPageLoader,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },
]);

export default function App() {
  const [globalSettings, setGlobalSettings] = useState<GlobalSettings>({ ...DEFAULT_SETTINGS });
  const { request } = useWakeLock();

  useEffect(() => {
    const savedSettings = localStorage.getItem(GLOBAL_SETTINGS_KEY);
    if (!savedSettings) return;
    const parsedSettings = JSON.parse(savedSettings) as GlobalSettings;

    if (parsedSettings.screenLock) {
      if (document.visibilityState === 'visible') {
        request();
      } else {
        const handleVisibilityChange = () => {
          if (document.visibilityState !== 'visible') return;
          request();
          document.removeEventListener('visibilitychange', handleVisibilityChange);
        }

        document.addEventListener('visibilitychange', handleVisibilityChange);
      }
    }

    setGlobalSettings({
      ...globalSettings,
      ...parsedSettings,
    });
  // false positive on missing deps; causes infinite loop rerenders
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveGlobalSettings = (newSettings: GlobalSettings) => {
    localStorage.setItem(GLOBAL_SETTINGS_KEY, JSON.stringify(newSettings));
    setGlobalSettings(newSettings);
  };

  return (
    <IonApp className={`${globalSettings.darkMode ? 'ion-palette-dark' : ''}`}>
      <globalSettingsContext.Provider value={{ globalSettings, saveGlobalSettings }}>
        <RouterProvider router={router} />
      </globalSettingsContext.Provider>
    </IonApp>
  );
}

const GLOBAL_SETTINGS_KEY = 'global-settings';
