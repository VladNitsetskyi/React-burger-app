import React, { Component } from "react";
import Input from "../../components/UI/Input/Input";
import Button from "../../components/UI/Button/Button";
import classes from "./Auth.css";
import Modal from "../../components/UI/Modal/Modal";
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import axios from "../../axios-orders";
import Spinner from "../../components/UI/Spinner/Spinner";
import { Redirect } from "react-router-dom";

class Auth extends Component {
  state = {
    controls: {
      email: {
        elementType: "input",
        elementConfig: {
          type: "email",
          placeholder: "Your Email"
        },
        value: "",
        validation: {
          required: true,
          isEmail: true
        },
        valid: false,
        touched: false
      },
      password: {
        elementType: "input",
        elementConfig: {
          type: "password",
          placeholder: "Password"
        },
        value: "",
        validation: {
          required: true,
          minLength: 6
        },
        valid: false,
        touched: false
      }
    },
    isFormValid: false,
    registerMode: true
  };

  componentDidMount() {
    this.props.onAuthErrorReset();
    if (!this.props.buildingBurger && this.props.authRedirectPath !== "/") {
      this.props.onSetRedirectPath();
    }
  }

  checkIfValid(value, rules) {
    let isValid = true;
    if (rules.required) {
      isValid = value.trim() !== "" && isValid;
    }
    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid;
    }
    if (rules.maxLength) {
      isValid = value.length <= rules.maxLength && isValid;
    }
    if (rules.isEmail) {
      const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      isValid = pattern.test(value) && isValid;
    }

    return isValid;
  }

  switchAuthModeHandler = () => {
    this.setState(prevState => {
      return {
        registerMode: !prevState.registerMode
      };
    });
  };

  inputChangedHandler = (event, controlName) => {
    const updatedControls = {
      ...this.state.controls,
      [controlName]: {
        ...this.state.controls[controlName],
        value: event.target.value,
        valid: this.checkIfValid(
          event.target.value,
          this.state.controls[controlName].validation
        ),
        touched: true
      }
    };
    let isFormValid = true;
    for (let key in updatedControls) {
      isFormValid = updatedControls[key].valid && isFormValid;
    }
    this.setState({ controls: updatedControls, isFormValid: isFormValid });
  };

  submitHandler = event => {
    event.preventDefault();
    this.props.onAuth(
      this.state.controls.email.value,
      this.state.controls.password.value,
      this.state.registerMode
    );
  };

  render() {
    const formElementsArray = [];
    for (let key in this.state.controls) {
      formElementsArray.push({
        id: key,
        config: this.state.controls[key]
      });
    }

    let form = formElementsArray.map(formElement => (
      <Input
        key={formElement.id}
        elementType={formElement.config.elementType}
        elementConfig={formElement.config.elementConfig}
        value={formElement.config.value}
        changed={event => this.inputChangedHandler(event, formElement.id)}
        touched={formElement.config.touched}
        invalid={!formElement.config.valid}
        shouldValidate={formElement.config.validation}
      />
    ));

    if (this.props.loading) {
      form = <Spinner />;
    }
    let errorMessage = null;
    if (this.props.error) {
      errorMessage = (
        <p className={classes.ErrorText}>{this.props.error.message}</p>
      );
    }
    if (this.props.isAuthenticated) {
      form = <Redirect to={this.props.authRedirectPath} />;
    }

    return (
      <div className={classes.Auth}>
        <form onSubmit={this.submitHandler}>
          <label>{this.state.registerMode ? "Register(no email confirmation required)" : "Login"}</label>
          {errorMessage}
          {form}
          <Button btnType="Success" disabled={!this.state.isFormValid}>
            Submit
          </Button>
        </form>
        <Button btnType="Danger" clicked={this.switchAuthModeHandler}>
          {this.state.registerMode
            ? "Already have an account? Click to Login"
            : "Don't have an acccount yet? Click to Register"}
        </Button>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    isAuthenticated: state.auth.token !== null,
    buildingBurger: state.burgerBuilder.building,
    authRedirectPath: state.auth.authRedirectPath,
   
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onAuth: (email, password, registerMode) =>
      dispatch(actions.auth(email, password, registerMode)),
    onSetRedirectPath: () => dispatch(actions.setAuthRedirectPath("/")),
    onAuthErrorReset: () => dispatch(actions.authErrorReset())
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(Auth, axios));
