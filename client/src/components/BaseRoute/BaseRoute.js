import { lazy } from 'react';
// Components
import Header from '../../components/Header';
import Profile from '../../components/Profile';

// Pages
const Home = lazy(() => import('../../views/Home'));

const BaseRoute = () => {
  return(
    <>
      <Header profileMenu={Profile} />      
      {/* <Switch>
        <Route 
          path='/' 
          component={Home}
          exact
        />
        <Route path='*'><Redirect to='/'/></Route> 
      </Switch> */}
    </>
  )
}

export default BaseRoute;