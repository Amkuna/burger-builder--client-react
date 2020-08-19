import React, {useEffect} from 'react';
import Button from '../../components/UI/Button/Button';
import classes from './Auth.module.css';
import Spinner from '../../components/UI/Spinner/Spinner';
import Input from '../../components/UI/Input/Input';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import * as actions from '../../store/actions/index';
import {useForm} from 'react-hook-form';
import redirectIfAuth from '../../hoc/redirectIfAuth';

const SignUp = (props) => {
    const {register, handleSubmit, watch, errors} = useForm();

    const authForm = {
        email: {
            elementType: "input",
            name: "email",
            elementConfig: {
                type: "email",
                placeholder: "Email address"
            },
            validation: {
                required: true,
                isEmail: true
            },
        },
        password: {
            elementType: "input",
            name: "password",
            elementConfig: {
                type: "password",
                placeholder: "Password"
            },
            validation: {
                required: true,
                minLength: 8,
                maxLength: 20
            },
        },
        passwordConfirm: {
            elementType: "input",
            name: "passwordConfirm",
            elementConfig: {
                type: "password",
                placeholder: "Repeat password"
            },
            validation: {
                required: true,
                validate: value => {
                    return value === watch("password")
                }
            },
        }
    }

    const {building, authRedirectPath, setAuthRedirectPath} = props;

    useEffect(() => {
        if(!building && authRedirectPath !== '/') {
            setAuthRedirectPath('/');
        }
    }, [building, authRedirectPath, setAuthRedirectPath]);
    
    const submitHandler = (data) => {
        props.onAuth(authForm.email.value, authForm.password.value, authForm.passwordConfirm.value);
    }

    //Sets id as the name of the input, and config as the rest of the input's configuration
    const formElementsArray = [];
    for (let key in authForm) {
        formElementsArray.push({
            id: key,
            config: authForm[key]
        })
    }

    let form = formElementsArray.map(formElement => (
        <Input
            key={formElement.id} 
            elementType={formElement.config.elementType} 
            elementConfig={formElement.config.elementConfig} 
            invalid={!formElement.config.valid}
            touched={formElement.config.touched}
            name={formElement.config.name}

            register={register}
            validation={formElement.config.validation}
            error={errors[formElement.config.name]}
        />
    ))
    
    if(props.loading) {
        form = <Spinner />
    }

    let errorMessage = null;

    if(props.error) {
        errorMessage = (
            <p>{props.error.message}</p>
        )
    }

    console.log("ERRORS: ", errors);

    return (
        <div className={classes.Auth}>
            {errorMessage}
            <form onSubmit={handleSubmit(submitHandler)}>
                {form}
                <Button btnType="Success">Sign Up</Button> 
            </form>
            <Link to="/signin">Already have an account? Sign In instead</Link>
        </div>
    )
};

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuth: state.auth.token !== null,
        building: state.burgerBuilder.building,
        authRedirectPath: state.auth.authRedirectPath
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password, passwordConfirm) => dispatch(actions.signUp(email, password, passwordConfirm)),
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(redirectIfAuth(SignUp));