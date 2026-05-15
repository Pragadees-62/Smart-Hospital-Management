import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import AppPatient from './AppPatient.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppPatient />
  </StrictMode>
);
