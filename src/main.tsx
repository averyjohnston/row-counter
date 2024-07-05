import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, LoaderFunction, RouterProvider } from 'react-router-dom';
import App from './App.tsx';
import ErrorPage from './pages/ErrorPage.tsx';
import CounterPage, { action as counterPageAction } from './pages/CounterPage.tsx';
import NewCounterPage, { action as newCounterPageAction } from './pages/NewCounterPage.tsx';
import EditCounterPage, { action as editCounterPageAction } from './pages/EditCounterPage.tsx';
import SettingsPage from './pages/SettingsPage.tsx';
import { IonApp } from '@ionic/react';
import { db } from './db.ts';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

import './index.css';

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
        element: <App />
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
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <IonApp>
      <RouterProvider router={router} />
    </IonApp>
  </React.StrictMode>,
);
