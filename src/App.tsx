import { IonApp, setupIonicReact } from '@ionic/react';
import CounterListPage, { action as CounterListPageAction, loader as counterListPageLoader } from './pages/CounterListPage';
import type { LoaderFunction } from 'react-router-dom';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { db } from './db';
import ErrorPage from './pages/ErrorPage.tsx';
import CounterPage, { action as counterPageAction } from './pages/CounterPage.tsx';
import NewCounterPage, { action as newCounterPageAction } from './pages/NewCounterPage.tsx';
import EditCounterPage, { action as editCounterPageAction } from './pages/EditCounterPage.tsx';
import SettingsPage from './pages/SettingsPage.tsx';
import { createContext, useEffect, useState } from 'react';
import type { GlobalSettings } from './types.ts';
import useWakeLock from 'react-use-wake-lock';
import NewSubCounterPage, { action as newSubCounterPageAction } from './pages/NewSubCounterPage.tsx';
import EditSubCounterPage, { action as editSubCounterPageAction, loader as editSubCounterPageLoader } from './pages/EditSubCounterPage.tsx';

setupIonicReact();

// TODO: try this out once everything else is fixed https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md
// TODO: View Transitions API? only supported in Chromium atm so make sure it fails gracefully

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
    const parsedSettings = JSON.parse(savedSettings);

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
