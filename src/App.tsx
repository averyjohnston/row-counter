import { setupIonicReact } from '@ionic/react';
import CounterListPage from './pages/CounterListPage';

setupIonicReact();

function App() {
  return <CounterListPage />
}

export default App;

// TODO: add stricter linting, especially for quote types and import order
// TODO: dark mode switch
// TODO: prevent device from going to sleep on any screen? (gate behind global setting)
