import React from 'react';
import { Button } from './components/ui/button';
import { Link } from 'react-router-dom';

const App = () => (
    <div className="">
        <p>hello world</p>
        <Button>this is button</Button>
        <div className="p-10 flex gap-4">
            <Link to="/media">
                <Button>Media</Button>
            </Link>

            <Link to="/butt">
                <Button>Butt</Button>
            </Link>
        </div>
    </div>
)

export default App;