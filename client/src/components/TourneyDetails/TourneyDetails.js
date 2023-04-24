import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// Components
import LoadingSpinner from '../../commonComponents/LoadingSpinner';
import { ProgressIndicator, ProgressIndicatorStep } from '../../commonComponents/ProgressIndicator';
import { TabControl, TabNavigator } from '../../commonComponents/TabNavigator';
// Assets
// Middleware
import { postTourneyRequest, putTourneyRequest } from '../../middleware/actions/tourneyActions';
// Styling
import './TourneyDetails.scss';
import Icon from '../../commonComponents/Icon';
import { contentIcKnockoutStage, contentIcTrophy, editorIcBorderAll } from '../../assets/icons';

const MODALIDADES = ['Grupos+Eliminatoria'];

const TourneyDetails = (props) => {
    const { tourney, onClose } = props;

    const [tabIndex, setTabIndex] = useState(0);

    // if (tourneyCrud.loading) {
    //     return <LoadingSpinner fullscreen={true} />;
    // }

    const renderTab = () => {
        return null;
    };

    return (
        <section className="tourney-details">
            <TabNavigator defaultActiveKey={tabIndex} className="tourney-details-navigator">
                <TabControl onClick={() => setTabIndex(0)}>
                    <Icon src={contentIcTrophy} />
                </TabControl>
                <TabControl onClick={() => setTabIndex(1)}>
                    <Icon src={editorIcBorderAll} />
                </TabControl>
                <TabControl onClick={() => setTabIndex(2)}>
                    <Icon src={contentIcKnockoutStage} />{' '}
                </TabControl>
            </TabNavigator>
            <article className="tourney-details-container">{renderTab()}</article>
            <ProgressIndicator>
                <ProgressIndicatorStep body={'Config'} status={'completed'} />
                <ProgressIndicatorStep />
                <ProgressIndicatorStep />
            </ProgressIndicator>
            {/* <div className="img-container">
                <img src={trophyIcon} alt={'trophy-icon'} />
            </div> */}
        </section>
    );
};

export default TourneyDetails;
