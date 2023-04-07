// Styling
import './LoadingSpinner.scss'

const LoadingSpinner = (props) => {
    const { showPosRelative, fullscreen} = props;

    return (
        <div className={`cc-progress-loader ${showPosRelative ? 'cc-progress-loader-pos-relative' : ''} ${fullscreen ? 'cc-progress-loader-fullscreen' : ''}`}>
            <div className='cc-progress-loader-content'>
                <div className='cc-progress-loader-square'></div>
                <div className='cc-progress-loader-square'></div>
                <div className='cc-progress-loader-square'></div>
            </div>
        </div>
    )
}

export default LoadingSpinner;