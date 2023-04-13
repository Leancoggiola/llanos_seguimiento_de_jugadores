import { useContext } from 'react';
import { TabNavigationContext } from '../contexts';

const TabControl = (props) => {
  const { children, className = '', disabled = false, onClick = null, tabKey = 0, ...others } = props;
  const { activeTab, setActiveTab, currentTab, buttonRefs, lineSide, controlled } = useContext(
    TabNavigationContext
  );

  const onTabClick = (event) => {
    if (onClick) {
      onClick(event);
    }
    setActiveTab(tabKey);
  };

  const classes = `cc-tab-button ` +
  `${className ? className : ''}` +
  `${!controlled && !disabled && tabKey === activeTab ? 'cc-tab-button-active ' : ''}`;

  return (
    <button
      ref={element => {buttonRefs.current[tabKey] = element;}}
      type="button"
      className={classes}
      role="tab"
      onClick={(event) => onTabClick(event)}
      disabled={disabled}
      tabIndex={tabKey === currentTab && !disabled ? '0' : '-1'}
      aria-selected={tabKey === activeTab && !disabled}
      {...others}
    >
      {children}
    </button>
  );
};

export default TabControl;