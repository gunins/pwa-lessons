import {request, setURI} from './lib/fetch.js';
// In our example we will fetch flickr API.
// Params and root uri required for accessing flickr.
const rootURI = `https://api.flickr.com/services/rest/`;
const params = {
    method:         'flickr.photos.getRecent',
    api_key:        'ca370d51a054836007519a00ff4ce59e',
    per_page:       10,
    format:         'json',
    nojsoncallback: 1
};

// because need some preparations regards to our template will understand data, we adding some formating, for data
const formatResult = (array = []) => array.map(({farm, server, id, title, secret}) => ({
    src: `https://farm${farm}.staticflickr.com/${server}/${id}_${secret}.jpg`,
    id,
    title
}));


//Format uri and fetching data
const getPhotos = () => request(setURI(rootURI, params))
    //slice and dice response
    .then(({photos}={}) => photos)
    .then(({photo}={}) => photo)
    //prepare response.
    .then(result => formatResult(result));

export {getPhotos}