import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const AppLayout = () => (
    <div>
        <nav className="flex gap-2">
            <NavLink to={'/'}>home</NavLink>
            <NavLink to={'/media'}>Media</NavLink>
            <NavLink to={'/butt'}>Butt</NavLink>
            <NavLink to={'/trash'}>Trash</NavLink>
        </nav>
        <br />
        <Outlet />
    </div>
)

export default AppLayout;