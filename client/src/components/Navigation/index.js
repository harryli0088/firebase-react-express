import React from 'react';
import { Link } from 'react-router-dom';

import "./styles.css";
import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';
import { AuthUserContext } from '../Session';

const Navigation = () => (
  <div>
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? <NavigationAuth /> : <NavigationNonAuth />
      }
    </AuthUserContext.Consumer>
  </div>
);

const NavigationAuth = () => (
  <nav>
    <div>
      <Link to={ROUTES.LANDING}>Landing</Link>
    </div>
    <div>
      <Link to={ROUTES.HOME}>Home</Link>
    </div>
    <div>
      <Link to={ROUTES.ACCOUNT}>Account</Link>
    </div>
    <div>
      <Link to={ROUTES.ADMIN}>Admin</Link>
    </div>
    <div>
      <SignOutButton />
    </div>
  </nav>
);

const NavigationNonAuth = () => (
  <nav>
    <div>
      <Link to={ROUTES.LANDING}>Landing</Link>
    </div>
    <div>
      <Link to={ROUTES.SIGN_IN}>Sign In</Link>
    </div>
  </nav>
);

export default Navigation;
