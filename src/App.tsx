import React from 'react';
import { Button } from './components/ui/button';
import { Link, Outlet } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Media from '@/pages/Media';
import Butt from '@/pages/Butt';
import Home from './pages/Home';

const App = () => (
    <HashRouter>
        <Routes>
            <Route element={<AppLayout />}>
                <Route path='/' element={<Home />} />
                <Route path='/media' element={<Media />} />
                <Route path='/butt' element={<Butt />} />
            </Route>
        </Routes>
    </HashRouter>
)

export default App;