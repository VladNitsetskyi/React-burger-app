import React from "react";
import classes from "./Order.css";
const order = props => {
    let ingredientsArray = [];
    for(let ingName in props.ingredients){
        ingredientsArray.push({
            name: ingName,
            amount: props.ingredients[ingName]
        });
    }

    let ingredientsFinalOutput = ingredientsArray.map((ingred)=>{
        return <span className={classes['Order-item']} key={ingred.name}>{ingred.name} ({ingred.amount}) </span>;
    })
  return (
    <div className={classes.Order}>
      <p>Ingredients: {ingredientsFinalOutput}</p>
      <p>
        Price: <strong>USD {props.price}</strong>{" "}
      </p>
    </div>
  );
};

export default order;
