import React, { Component } from "react";
import Aux from "../../hoc/Aux/Aux";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import axios from "../../axios-orders";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import { connect } from "react-redux";
import * as burgerBuilderActions from "../../store/actions/index";

class BurgerBuilder extends Component {
  state = {
    purchasing: false
  };

  componentDidMount() {
    if (!this.props.buildingBurger) {
      this.props.onInitIngredients();
    } else {
      this.props.history.push({
        pathname: this.props.authRedirectPath
      });
    }
  }

  updatePurchaseState(ingredients) {
    const sum = Object.keys(ingredients)
      .map(igKey => {
        return ingredients[igKey];
      })
      .reduce((sum, el) => {
        return sum + el;
      }, 0);
    return sum > 0;
  }

  modalClose() {}

  purchaseHandler = () => {
    if (this.props.isAuthenticated) {
      this.setState({ purchasing: true });
    } else {
      this.props.onSetAuthRedirectPath("/");
      this.props.history.push("/auth");
    }
  };

  purchaseCancelHandler = () => {
    this.setState({ purchasing: false });
  };

  puchaseContinueHandler = () => {
    this.props.onInitPurchase();
    this.props.history.push({
      pathname: "/checkout"
    });
  };

  render() {
    const disabledInfo = {
      ...this.props.ings
    };

    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }

    let orderSummary;
    let burger = this.props.error ? (
      <p>Ingredients can't be loaded!</p>
    ) : (
      <Spinner />
    );

    
    if (this.props.ings) {
      burger = (
        <Aux>
          <Burger ingredients={this.props.ings} />
          <BuildControls
            ingredientAdded={this.props.onIngredientAdded}
            ingredientRemoved={this.props.onIngredientRemoved}
            disabled={disabledInfo}
            price={this.props.price}
            purchaseable={this.updatePurchaseState(this.props.ings)}
            ordered={this.purchaseHandler}
            isAuth={this.props.isAuthenticated}
          />
        </Aux>
      );
      orderSummary = (
        <OrderSummary
          ingredients={this.props.ings}
          purchaseCancelled={this.purchaseCancelHandler}
          purchaseContinued={this.puchaseContinueHandler}
          price={this.props.price}
        />
      );
    }
    let modal = null;
    if (this.state.purchasing) {
      modal = (
        <Modal
          show={this.state.purchasing}
          modalClosed={this.purchaseCancelHandler}
        >
          {orderSummary}
        </Modal>
      );
    } else if (this.props.registrationSuccessful) {
      modal = (
        <Modal
          show={this.props.registrationSuccessful}
          modalClosed={this.props.onAuthErrorReset}
        >
          <div style={{margin: '15px 0', textAlign: 'center'}}>You have been successfully registered!</div>
          <div style={{margin: '15px 0', textAlign: 'center'}}>
            {this.props.buildingBurger
              ? "You can now order your burger."
              : "You can now create and order your burger."}
          </div>
        </Modal>
      );
    }else if(this.props.purchased) {
      modal = (
        <Modal
          show={this.props.purchased}
          modalClosed={this.props.onPurchaseReset}
        >
          <div style={{margin: '15px 0', textAlign: 'center'}}>You ordered your burger!
          <br/>
        Our delivery will contact you ASAP.
          </div>
        </Modal>
      );
    }


    return <Aux>{modal}{burger}</Aux>;
  }
}

const mapStateToProps = state => {
  return {
    ings: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    error: state.burgerBuilder.error,
    isAuthenticated: state.auth.token !== null,
    buildingBurger: state.burgerBuilder.building,
    authRedirectPath: state.auth.authRedirectPath,
    registrationSuccessful: state.auth.registrationSuccessful,
    purchased: state.order.purchased
  };
};
const mapDispatchToProps = dispatch => {
  return {
    onIngredientAdded: ingName =>
      dispatch(burgerBuilderActions.addIngredient(ingName)),
    onIngredientRemoved: ingName =>
      dispatch(burgerBuilderActions.removeIngredient(ingName)),
    onInitIngredients: () => dispatch(burgerBuilderActions.initIngredients()),
    onInitPurchase: () => dispatch(burgerBuilderActions.purchaseInit()),
    onSetAuthRedirectPath: path =>
      dispatch(burgerBuilderActions.setAuthRedirectPath(path)),
    onAuthErrorReset: () => dispatch(burgerBuilderActions.authErrorReset()),
    onPurchaseReset: () => dispatch(burgerBuilderActions.purchaseReset())
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(BurgerBuilder, axios));
