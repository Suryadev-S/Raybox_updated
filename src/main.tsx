import React from 'react';
import './index.css';
import { createRoot } from 'react-dom/client';
import App from './App';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Media from '@/pages/Media';
import Butt from '@/pages/Butt';
import AppLayout from './components/AppLayout';

// Render your React component instead
const root = createRoot(document.body);
root.render(
    <React.StrictMode>
        <HashRouter>
            <Routes>
                <Route element={<AppLayout />}>
                    <Route path='/' element={<App />} />
                    <Route path='/media' element={<Media />} />
                    <Route path='/butt' element={<Butt />} />
                </Route>
            </Routes>
        </HashRouter>
    </React.StrictMode>
);