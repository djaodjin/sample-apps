import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `http://localhost:8000/api`;
axios.defaults.baseURL = API_BASE_URL;


export async function auth(username, password) {
    return axios.post('auth', {
        username: username,
        password: password
    }).then(function(resp) {
        console.log(resp);
        axios.defaults.headers.common['Authorization'] =
            `Bearer ${resp.data.token}`;
    }).catch(function(err) {
        console.log(err);
    });
}


export function isAuth() {
    return axios.defaults.headers &&
        axios.defaults.headers.common &&
        typeof axios.defaults.headers.common['Authorization'] === "string";
}
