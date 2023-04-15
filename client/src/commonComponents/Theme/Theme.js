import { useEffect } from 'react';

const Theme = ({variant}) => {
    useEffect(() => {
        document.querySelector('body').setAttribute('class', 'theme-'+ variant)
    }, [variant])

    return null
}

export default Theme;