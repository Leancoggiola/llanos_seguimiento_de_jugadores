import { isEmpty } from 'lodash';
import { Suspense, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

// Components 
import Theme from './commonComponents/Theme';
import BaseRoute from './components/BaseRoute';
import InprogressFallback from './components/InprogressFallback';
// Pages
import Login from './views/Login';
import Unauthorized from './views/Unauthorized';

// Middleware
import { isUserLoggedInRequest, isUserLoggedInFailure } from './middleware/actions/authActions';
import { getTourneysRequest } from './middleware/actions/tourneyActions';

// Styles
import './App.scss';
import { getTeamsRequest } from './middleware/actions/teamActions';

export default () => {
  const [ cookies, setCookie, removeCookie] = useCookies(['jwt']);
  const [ unauthorized, setUnauthorized] = useState(false);
  const dispatch = useDispatch();

  const loggedUser = useSelector((state) => state.auth)
  const tourneyList = useSelector((state) => state.tourney.tourneyList)
  const teamList = useSelector((state) => state.team.teamList)

  useEffect(() => {
    dispatch(isUserLoggedInRequest())
    return () => {
      removeCookie(['jwt'])
    }
  }, [])

  useEffect(() => {
    if(loggedUser.data) {
      isEmpty(tourneyList.data) && dispatch(getTourneysRequest())
      isEmpty(teamList.data) && dispatch(getTeamsRequest())
    }
  }, [loggedUser.data])

  return (
    <BrowserRouter>
      <Theme variant='default'/>
        <Suspense fallback={
            <InprogressFallback status={'Autenticando Usuario'}/>
          }>
            { 
              !document.cookie|| loggedUser.error ?  <Login /> :
              unauthorized ? <Unauthorized errorObj={{ error:401, errorDescription: 'No se encuentra autorizado, vuelva a logearse'}}/> :
              !tourneyList.data || !teamList.data ? <InprogressFallback status={'Preparando la aplicacion'}/> :
              !loggedUser.data ? <InprogressFallback status={'Autenticando Usuario'}/> :
              <BaseRoute />
            }
        </Suspense>
    </BrowserRouter>
  );
}
