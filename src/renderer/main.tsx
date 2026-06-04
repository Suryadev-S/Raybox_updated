import React from 'react';
import './index.css';
import { createRoot } from 'react-dom/client';
import App from './App';
// import App from './renderer/App';


// Render your React component instead
const root = createRoot(document.body);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);