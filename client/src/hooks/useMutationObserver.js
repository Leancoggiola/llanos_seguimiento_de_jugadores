import { useEffect } from "react";

export const useMutationObserver = (targetElem, options, callback) => {
    useEffect(() => {
        return () => observer.disconnect()
    })

    const handler = (mutationList, observer) => {
        for (const mutation of mutationList) {
            callback(mutation)
        }
    };
    
    const observer = new MutationObserver(handler);
    observer.observe(targetElem, options);
}