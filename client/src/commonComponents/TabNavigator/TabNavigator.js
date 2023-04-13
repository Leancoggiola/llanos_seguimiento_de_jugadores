import { Children, cloneElement, useRef, useState } from 'react';
import { TabNavigationProvider } from '../contexts';
// Styling
import './TabNavigator.scss';

const TabNavigator = (props) => {
  const {
    className = '',
    children,
    variant = 'default',
    defaultActiveKey = -1,
    controlled = false,
    ...other
  } = props;

  const [activeTab, setActiveTab] = useState(defaultActiveKey);
  const buttonRefs = useRef([]);

  const classes = `cc-tab-navigation ` +
  `${className ? className : ''}` +
  `${variant==='alt' ? 'cc-tab-navigation-alt' : ''}`;

  const tabControlChildren = Children.map(children, (child, index) =>
    cloneElement(child, {
      tabKey: index
    })
  );

  return (
    <TabNavigationProvider
      value={{
        activeTab,
        setActiveTab,
        buttonRefs,
        controlled
      }}
    >
      <div
        role="tablist"
        className={classes}
        {...other}
      >
        {tabControlChildren}
      </div>
    </TabNavigationProvider>
  );
};

export default TabNavigator;