import ReactDOM from 'react-dom/client';
import { App } from './components/App.js';
import './scss/main.scss';

declare global {
  var BUILD_MODE: string;
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<App />);
