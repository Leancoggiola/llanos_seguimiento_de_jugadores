import { useEffect, useState } from 'react';
// Styling
import './ProgressBar.scss';

const ProgressBar = (props) => {
  const { className = '', value = 0, isDecrease = false } = props;
  const [completed, setCompleted] = useState(value);

  useEffect(() => {
    if(isDecrease) {
      let count = 1;
      setInterval(() => setCompleted(100-count++), 50);
    }
  }, []);

  const classes = `cc-progress-bar-wrapper ` +`${className ? className : ''}`;

  return (
    <div className={classes}>
      <div className={'cc-progress-bar'} style={{ width: `${completed}%` }} />
    </div>
  );
};

export default ProgressBar;
