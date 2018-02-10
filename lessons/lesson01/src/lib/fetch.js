const {keys} = Object;
// Currently we use only get.
// setParams will convert json touri param string
const setParams = (params = {}) => keys(params).map(key => `${key}=${params[key]}`).join('&');
// setURI combine uri and json params
const setURI = (uri, params) => `${uri}?${setParams(params)}`;

// request is wrapper for fetch, in case later we need expose functionaliy.
const request = (uri, options) => fetch(uri, options)
    .then(resp => resp.json());


export {request, setURI, setParams};