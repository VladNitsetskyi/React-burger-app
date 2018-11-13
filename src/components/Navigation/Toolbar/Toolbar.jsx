import React from 'react';
import classes from './Toolbar.css';
import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';

const toolbar = (props) => {
    return ( 
        <header className={classes.Toolbar}>
            <div className={classes.DrawerToggle} onClick={props.sideDrawerToggleHandler}>
                <div></div>
                <div></div>
                <div></div>
            </div>
            <Logo height = '80%'/>
            <nav className={classes.DesctopOnly}>
                <NavigationItems isAuthenticated={props.isAuth}></NavigationItems>
            </nav>
        </header>
     );
}
 
export default toolbar;