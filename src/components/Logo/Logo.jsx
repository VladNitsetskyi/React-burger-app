import React from 'react';
import burgerLogo from '../../assets/images/burger-logo.png';
import classes from './Logo.css'

const logo = (props) => {
    return ( 
        <div className = {classes.Logo} style={{height: props.height}}>
            <img src={burgerLogo} alt="MyBurgerLogo"/>
        </div>
     );
}
 
export default logo;