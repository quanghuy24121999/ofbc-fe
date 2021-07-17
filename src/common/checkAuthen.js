import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export const ProtectedRouteAdmin = ({ component: Component, ...rest }) => {
    return (
        <Route {...rest} render={
            (props) => {
                if (localStorage.getItem('currentAdmin') !== null
                    && localStorage.getItem('currentAdmin') !== undefined
                    && (localStorage.getItem('currentUser') === null
                        || localStorage.getItem('currentUser') === undefined)
                ) {
                    return <Component {...props} />
                } else {
                    return <Redirect to={
                        {
                            pathname: "/"
                        }
                    } />
                }
            }}
        />
    )
}

export const ProtectedRouteCustomer = ({ component: Component, ...rest }) => {
    return (
        <Route {...rest} render={
            (props) => {
                if (localStorage.getItem('currentUser') !== null
                    && localStorage.getItem('currentUser') !== undefined
                ) {
                    return <Component {...props} />
                } else {
                    return <Redirect to={
                        {
                            pathname: "/"
                        }
                    } />
                }
            }}
        />
    )
}

export const ProtectedRouteCustomerRestaurant = ({ component: Component, ...rest }) => {
    return (
        <Route {...rest} render={
            (props) => {
                if (localStorage.getItem('currentUser') !== null
                    && localStorage.getItem('currentUser') !== undefined
                    && localStorage.getItem('resId') !== ''
                ) {
                    return <Component {...props} />
                } else if (localStorage.getItem('resId') === '') {
                    return <Redirect to={
                        {
                            pathname: "/users/profile/my-restaurant"
                        }
                    } />
                }
                else {
                    return <Redirect to={
                        {
                            pathname: "/"
                        }
                    } />
                }
            }}
        />
    )
}

export const ProtectedRouteLogin = ({ component: Component, ...rest }) => {
    return (
        <Route {...rest} render={
            (props) => {
                if (localStorage.getItem('currentUser') !== null
                    && localStorage.getItem('currentUser') !== undefined
                ) {
                    return <Redirect to={
                        {
                            pathname: "/"
                        }
                    } />
                } else {
                    return <Component {...props} />
                }
            }}
        />
    )
}