import axios from 'axios';

export const getToken = () => {
    return localStorage.getItem("jwtToken")
        ? (String(localStorage.getItem("jwtToken")))
        : null;
};

export const getAuthorizationHeader = () => `Bearer ${getToken()}`;

export default axios.create({
    baseURL: `http://localhost:8083/`,
});