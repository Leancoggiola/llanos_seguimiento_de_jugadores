import { isEmpty } from 'lodash';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// Components
import ErrorMessage from '../../commonComponents/ErrorMessage';
import LoadingSpinner from '../../commonComponents/LoadingSpinner';
// Middleware
import { getUserListRequest } from '../../middleware/actions/listActions';
// Styling
import './Home.scss';

const Home = () => {
    // const { user } = useAuth0();
    // const dispatch = useDispatch();
    // const { loading, data, error } = useSelector((state) => state.list.userList);
    // const crudState = useSelector((state) => state.list.crud);
    // const appList = useSelector((state) => state.meta.appList)
    // const appToDisplay = useSelector((state) => state.list.display);

    // useEffect(() => {
    //     if(isEmpty(data)) {
    //         dispatch(getUserListRequest(user.email))
    //     }
    // }, [])

    // if(loading || crudState.loading) return <LoadingSpinner showPosRelative={true} fullscreen={true}/>

    // if(error) return <ErrorMessage message={error.message} />

    // return (
    //     <>
    //         {!isEmpty(data) && 
    //         <main className='home-container page'>
    //             {data.contentList.length > 0 ? appList.data.map(app => {
    //                 if(appToDisplay === 'all' || appToDisplay === app.name ) {
    //                     return (
    //                         <ListCarousel 
    //                             list={data.contentList.filter(item => item.appName === app.name)} 
    //                             title={app.displayName} 
    //                             id={app.name}
    //                             appStyle={app.style}
    //                             key={app.name}
    //                         />
    //                     )}
    //                 }) :
    //                 <div className='no-content'>
    //                     <h1>Aun no has añadido contenido a tus listas.</h1>
    //                 </div>
    //             }
    //         </main>}
    //     </>
    // )
}

export default Home;