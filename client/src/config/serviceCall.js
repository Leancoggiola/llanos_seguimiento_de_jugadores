import axios from 'axios';

export function serviceCall(requestConfig) {
    const instance = axios.create();
    const token = document.cookie;

    requestConfig["withAuth"] = requestConfig["withAuth"] ? requestConfig["withAuth"] : true

    instance.interceptors.request.use(
        async (config) => {
            delete instance.defaults.headers.common["Authorization"];
            try {
                let token;
                token = document.cookie.replace('jwt=','');

                if(token && requestConfig.withAuth) {
                    config["headers"]["Authorization"] = "Bearer " + token;
                    instance.defaults.headers.common["Authorization"] = config["headers"]["Authorization"];
                }
                return Promise.resolve(config)
            } catch (error) {
                return Promise.reject(error)
            }
        },
        function (error) {
            return Promise.reject(error)
        }
    )
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