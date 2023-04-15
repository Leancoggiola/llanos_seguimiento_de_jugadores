import { useState } from 'react';
// Assets
import allAppsLogo from '../../assets/all-apps-icon.png';
// Middleware
//import { changeListToDisplay } from '../../middleware/actions/narBarActions'
// Styling
import './Navbar.scss';

const Navbar = ({isCollapse}) => {
    const [ activeIndex, setActiveIndex] = useState(0);

    // const dispath = useDispatch()

    const handleClick = (index, appName) => {
        setActiveIndex(index);
        //dispath(changeListToDisplay(appName))
    }

    const getActiveButton = (activeIndex, index) => {
        return activeIndex === index ? 'active' : '';
    }

    return (
        <nav className={`navigation ${isCollapse ? 'navigation-collapse' : 'navigation-expanded'}`}>
            <button type='button' className={`${getActiveButton(activeIndex, 0)}`} onClick={() => handleClick(0, 'all')}>
                <div className='icon-container'>  
                    <img src={allAppsLogo} alt='all-apps'/>
                </div>
                <h2>Home</h2>
            </button>
            {/* {!isEmpty(data) && data.map((option,index) => {
                const { name, displayName, image: { contentType, data }} = option;
                const imgSrc = `data:${contentType};base64, ${Buffer.from(data.data).toString('base64')}`;
                return(
                    <button 
                        type='button' 
                        className={`${getActiveButton(activeIndex, index+1)}`} 
                        key={name}
                        onClick={() => handleClick(index+1,name)}
                    >
                        <div className='icon-container'>  
                            <img src={imgSrc} alt={`${name}-app`}/>
                        </div>
                        <h2>{displayName}</h2>
                    </button>
                )
            })} */}
        </nav>
    )
}

export default Navbar;