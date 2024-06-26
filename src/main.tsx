import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, LoaderFunction, redirect, RouterProvider } from 'react-router-dom';
import App from './App.tsx';
import ErrorPage from './ErrorPage.tsx';
import CounterPage, { action as counterPageAction } from './CounterPage.tsx';
import NewCounterPage, { action as newCounterPageAction } from './NewCounterPage.tsx';
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
  // TODO: add loader to new/edit counter page, handle id being undefined (means we're making a new counter)
  const idNum = parseInt(id || '');
  if (isNaN(idNum)) {
    return redirect('/404');
  }

  const counter = await db.counters.get(idNum);
  if (counter === undefined) {
    return redirect('/404');
  }

  return counter;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />
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
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <IonApp>
      <RouterProvider router={router} />
    </IonApp>
  </React.StrictMode>,
);
