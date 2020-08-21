import React from 'react';
import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';

const NavBar = (props) => {
  const [userInfo, setUserInfo] = useState();
  const providers = ['twitter', 'github', 'aad'];
  const redirect = window.location.pathname;

  useEffect(() => {
    (async () => {
      setUserInfo(await getUserInfo());
    })();
  }, []);

  async function getUserInfo() {
    try {
      const response = await fetch('/.auth/me');
      const payload = await response.json();
      const { clientPrincipal } = payload;
      return clientPrincipal;
    } catch (error) {
      return undefined;
    }
  }

  return (
    <>
    <nav className="column is-2 menu">
      <p className="menu-label">Menu</p>
      <ul className="menu-list">
        <NavLink to="/products" activeClassName="active-link">
          Products
        </NavLink>
        <NavLink to="/about" activeClassName="active-link">
          About
        </NavLink>
      </ul>
      {props.children}
      {!userInfo && (<p className="menu-label">Auth</p>)}
      {userInfo && (<p className="menu-label">Account</p>)}
      <div className="menu-list auth">
        {!userInfo && providers.map((provider) => (
          <a key={provider} href={`/.auth/login/${provider}?post_login_redirect_uri=${redirect}`}>
            {provider}
          </a>
        ))}
        {userInfo && (
          <>
            <a href="#">
              {userInfo.userDetails}({userInfo.identityProvider})
            </a>
            <a href={`/.auth/logout?post_logout_redirect_uri=${redirect}`}>
              Logout
            </a>
          </>
        )}
      </div>
    </nav>
  </>
  )
  };

export default NavBar;
