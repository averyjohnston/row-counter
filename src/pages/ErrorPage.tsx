import { IonContent, IonPage } from '@ionic/react';
import { Link, isRouteErrorResponse, useRouteError } from 'react-router-dom';

function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  let errorMessage: string = "";
  if (isRouteErrorResponse(error)) {
    errorMessage = error.data.message || error.statusText;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if(typeof error === 'string') {
    errorMessage = error;
  } else {
    errorMessage = 'Unknown error';
  }

  return (
    <IonPage id="error-page">
      <IonContent className="ion-padding">
        <p>Sorry, an unexpected error has occurred.</p>
        <p>{errorMessage}</p>
        <p>
          <Link to="/">Return to home page</Link>
        </p>
      </IonContent>
    </IonPage>
  )
}

export default ErrorPage;
