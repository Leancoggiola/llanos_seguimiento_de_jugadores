import { Fragment, useEffect, useState } from 'react';
// Components
import List from '../../commonComponents/List';
import { TabControl, TabNavigator } from '../../commonComponents/TabNavigator';
// Styling
import './TopMetricsTable.scss';

const TopMetricsTable = (props) => {
    const { tourney } = props;

    const [tabIndex, setTabIndex] = useState(0);
    const [data, setData] = useState([]);

    useEffect(() => {
        // Get all details
        let details = [...tourney?.groups, ...tourney?.knockout]
            ?.flatMap((x) => x.matchs)
            .flatMap((x) => x.details)
            .filter((x) => x.player);

        if (tabIndex === 0) {
            details = details.filter((x) => x.type === 'gol');
        } else {
            details = details.filter((x) => x.type === 'tarjeta amarilla');
        }

        setData(
            details
                .reduce((prev, curr) => {
                    const i = prev.findIndex((x) => x._id === curr.player._id);
                    if (i < 0) {
                        prev.push({ ...curr.player, count: 1 });
                    } else {
                        prev[i].count += 1;
                    }
                    return prev;
                }, [])
                .sort((a, b) => b.count - a.count)
        );
    }, [tabIndex]);

    return (
        <section className="metrics-navigator">
            <TabNavigator defaultActiveKey={tabIndex}>
                <TabControl onClick={() => setTabIndex(0)}>Goleadores</TabControl>
                <TabControl onClick={() => setTabIndex(1)}>Amarillas</TabControl>
            </TabNavigator>
            <List>
                {data.map((record, index) => (
                    <Fragment key={'list-' + index}>
                        <span>
                            {index + 1}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{record.name}
                        </span>
                        <span>{record.count}</span>
                    </Fragment>
                ))}
            </List>
        </section>
    );
};

export default TopMetricsTable;
