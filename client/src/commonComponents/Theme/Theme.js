import { useEffect } from 'react';

const Theme = ({variant}) => {
    const toggleTheme = () => {
        document.querySelector('body').setAttribute('class', 'theme-'+ variant)
    }
    
    useEffect(() => {
        toggleTheme()
    }, [variant])

    return null
}

export default Theme;