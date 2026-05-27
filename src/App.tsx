import React from 'react';
import AppLayout from './components/AppLayout';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Media from '@/pages/Media';
import Butt from '@/pages/Butt';
import Home from './pages/Home';
import { BinNavigationProvider } from './components/BinNavigation';

const App = () => (
    <BinNavigationProvider>
        <HashRouter>
            <Routes>
                <Route element={<AppLayout />}>
                    <Route path='/' element={<Home />} />
                    <Route path='/media' element={<Media />} />
                    <Route path='/butt' element={<Butt />} />
                </Route>
            </Routes>
        </HashRouter>
    </BinNavigationProvider>
)

export default App;