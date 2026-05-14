import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const AppLayout = () => (
    <div>
        <nav>
            <NavLink to={'/'}>home</NavLink>
            <NavLink to={'/media'}>Media</NavLink>
            <NavLink to={'/butt'}>Butt</NavLink>
        </nav>
        <br />
        <Outlet />
    </div>
)

export default AppLayout;