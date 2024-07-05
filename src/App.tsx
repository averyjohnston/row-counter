import { IonApp, setupIonicReact } from '@ionic/react';
import CounterListPage from './pages/CounterListPage';
import { LoaderFunction, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { db } from './db';
import ErrorPage from './pages/ErrorPage.tsx';
import CounterPage, { action as counterPageAction } from './pages/CounterPage.tsx';
import NewCounterPage, { action as newCounterPageAction } from './pages/NewCounterPage.tsx';
import EditCounterPage, { action as editCounterPageAction } from './pages/EditCounterPage.tsx';
import SettingsPage from './pages/SettingsPage.tsx';

setupIonicReact();

// TODO: add stricter linting, especially for quote types and import order
// TODO: dark mode switch
// TODO: prevent device from going to sleep on any screen? (gate behind global setting)

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
  return (
    <IonApp>
      <RouterProvider router={router} />
    </IonApp>
  );
}

export default App;
