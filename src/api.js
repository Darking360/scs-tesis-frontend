import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production' ? 'https://smart-san-cristobal.herokuapp.com' : 'http://localhost:3000';

export function createOpinion(opinion, location, service) {
    return axios.post(`${API_URL}/opinions`, {
        opinion,
        location,
        service
    });
}

export function getOpinions(lat, lng, kilometers) {
    return axios.get(`${API_URL}/opinions/search?lat=${lat}&lng=${lng}&kilometers=${kilometers}`);
}

export function subscribeInAPI(topic, token) {
    return axios.post(`${API_URL}/tokens`, { topic, token })
}

export function getOpinion(id) {
    return axios.get(`${API_URL}/opinions/${id}`);
}

