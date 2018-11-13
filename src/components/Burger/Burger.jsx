import React from 'react';
import classes from './Burger.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';
import {withRouter} from 'react-router-dom';

const burger = (props) => {
    let transformedIngredients;

    if(Object.keys(props.ingredients).length === 0 || Object.values(props.ingredients).every((el)=> el <=0)) {
        transformedIngredients = <p>Please start to add ingredients!</p>
    }else{
        transformedIngredients = Object.keys(props.ingredients)
    .map(igKey =>{
        return [...Array(props.ingredients[igKey])]
        .map((none,i) => {
             return <BurgerIngredient key={igKey + i} type={igKey} />
        });
    }).reduce((arr,element) => {
        return arr.concat(element)
    })
    }

    return(
        <div className={classes.Burger}>
            <BurgerIngredient type="bread-top"/>
            {transformedIngredients}
            <BurgerIngredient type="bread-bottom"/>
        </div>
    );
}


export default withRouter(burger);
// export default burger;