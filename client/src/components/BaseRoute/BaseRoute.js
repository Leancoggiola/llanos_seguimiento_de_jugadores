import { lazy } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
// Components
import Header from '../../components/Header';
import Profile from '../../components/Profile';

// Pages
const Home = lazy(() => import('../../views/Home'));

const BaseRoute = () => {
  return(
    <>
      <Header profileMenu={Profile} />      
      <Switch>
        <Route path='/' component={Home} exact/>
        <Route path='*'><Redirect to='/'/></Route> 
      </Switch>
    </>
  )
}

export default BaseRoute;