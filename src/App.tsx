import { IonApp, setupIonicReact } from '@ionic/react';
import CounterListPage from './pages/CounterListPage';
import { LoaderFunction, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { db } from './db';
import ErrorPage from './pages/ErrorPage.tsx';
import CounterPage, { action as counterPageAction } from './pages/CounterPage.tsx';
import NewCounterPage, { action as newCounterPageAction } from './pages/NewCounterPage.tsx';
import EditCounterPage, { action as editCounterPageAction } from './pages/EditCounterPage.tsx';
import SettingsPage from './pages/SettingsPage.tsx';
import { createContext, useState } from 'react';
import { GlobalSettings } from './types.ts';

setupIonicReact();

// TODO: add stricter linting, especially for quote types and import order
// TODO: prevent device from going to sleep on any screen? (gate behind global setting)

export const globalSettingsContext = createContext<{
  globalSettings: GlobalSettings,
  setGlobalSettings: (newSettings: GlobalSettings) => void
}>({
  globalSettings: {
    darkMode: false
  },
  setGlobalSettings: () => {}
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

  return counter;
};

const router = createBrowserRouter([
  {
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <CounterListPage />
      },
      {
        path: "counters/:id",
        element: <CounterPage />,
        loader: counterLoader,
        action: counterPageAction
      },
      {
        path: "counters/new",
        element: <NewCounterPage />,
        action: newCounterPageAction
      },
      {
        path: "counters/:id/edit",
        element: <EditCounterPage />,
        loader: counterLoader,
        action: editCounterPageAction
      },
      {
        path: "settings",
        element: <SettingsPage />
      }
    ]
  }
]);

function App() {
  // TODO: read saved settings instead, where they exist
  const [globalSettings, setGlobalSettings] = useState<GlobalSettings>({
    darkMode: false
  });

  // TODO: wrap setGlobalSettings to also update storage

  return (
    <IonApp className={`${globalSettings.darkMode ? 'ion-palette-dark' : null}`}>
      <globalSettingsContext.Provider value={{ globalSettings, setGlobalSettings }}>
        <RouterProvider router={router} />
      </globalSettingsContext.Provider>
    </IonApp>
  );
}

export default App;
