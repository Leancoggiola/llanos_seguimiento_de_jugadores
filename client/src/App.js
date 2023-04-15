import { isEmpty } from 'lodash';
import { Suspense, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

// Components 
import Theme from './commonComponents/Theme';
import BaseRoute from './components/BaseRoute';
import InprogressFallback from './components/InprogressFallback';
import Toast from './commonComponents/Toast';
// Pages
import Login from './views/Login';
import Unauthorized from './views/Unauthorized';

// Middleware
import { isUserLoggedInRequest } from './middleware/actions/authActions';
import { updateToastData } from './middleware/actions/navbarActions';
import { getTeamsRequest } from './middleware/actions/teamActions';
import { getTourneysRequest } from './middleware/actions/tourneyActions';

// Styles
import './App.scss';

export default () => {
  const [ , , removeCookie] = useCookies(['jwt']);
  const [ unauthorized,] = useState(false);
  const dispatch = useDispatch();

  const loggedUser = useSelector((state) => state.auth)
  const tourneyList = useSelector((state) => state.tourney.tourneyList)
  const teamList = useSelector((state) => state.team.teamList)
  const toastData = useSelector((state) => state.navbar.toastInfo)

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

  useEffect(() => {
    if(!isEmpty(toastData)) {
      setTimeout(() => dispatch(updateToastData({})), 5000) 
    }
  }, [toastData])

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
            <Toast show={toastData.show} variant={toastData.variant} closeBtn={toastData.closeBtn} position='top' onClose={() => dispatch(updateToastData({}))}>{toastData.message}</Toast>
        </Suspense>
    </BrowserRouter>
  );
}
