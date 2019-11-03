import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

import Navigation from '../Navigation';
import LandingPage from '../Landing';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import PasswordForgetPage from '../PasswordForget';
import HomePage from '../Home';
import AccountPage from '../Account';
import AdminPage from '../Admin';

import * as ROUTES from '../../constants/routes';
import { AuthUserContext } from '../Session';
import { withAuthentication } from '../Session';

const App = () => (
  <Router>
    <div>
      <Navigation />

      <hr />

      <content>
        <Route exact path={ROUTES.LANDING} component={LandingPage} />
        <LoggedOutRoute path={ROUTES.SIGN_UP} component={SignUpPage} />
        <LoggedOutRoute path={ROUTES.SIGN_IN} component={SignInPage} />
        <LoggedOutRoute path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
        <LoggedInRoute path={ROUTES.HOME} component={HomePage} />
        <LoggedInRoute path={ROUTES.ACCOUNT} component={AccountPage} />
        <LoggedInRoute path={ROUTES.ADMIN} component={AdminPage} />
      </content>
    </div>
  </Router>
);


//routes that only a logged in user can access
function LoggedInRoute({ component: Component, ...rest}) {
  return (
    <Route
      {...rest}
      render={props =>
        <AuthUserContext.Consumer>
          {authUser =>
            authUser ? <Component {...props} /> : <Redirect to={{ pathname: ROUTES.SIGN_IN, state: { from: props.location } }} />
          }
        </AuthUserContext.Consumer>
      }
    />
  );
}


//routes that only a logged out user can see
function LoggedOutRoute({ component: Component, ...rest}) {
  return (
    <Route
      {...rest}
      render={props =>
        <AuthUserContext.Consumer>
          {authUser =>
            authUser ? <Redirect to={{ pathname: ROUTES.HOME, state: { from: props.location } }} /> : <Component {...props} />
          }
        </AuthUserContext.Consumer>
      }
    />
  );
}


export default withAuthentication(App);
