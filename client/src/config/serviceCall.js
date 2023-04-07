import axios from 'axios';

export function serviceCall(requestConfig) {
    const instance = axios.create();

    return instance({...requestConfig})
        .then(response => {
            return response && response.data
        })
        .catch(error => {
            const message = error?.response?.data?.message;
            const status = error?.response?.request?.status;
            return Promise.reject({message, status})
        })
}