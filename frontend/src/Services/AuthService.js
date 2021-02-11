import axios from 'axios'

const REST_API_URL = 'http://localhost:5000';

class AuthService {
    user(token) {
        return axios.get(REST_API_URL + "/user", {
            headers: {
                Authorization: "Bearer " + token
            }
        })
    }

    login(username, password) {
        return axios.post(REST_API_URL + "/login", {
            username: username,
            password: password
        })
    }

    signup(username, password) {
        return axios.post(REST_API_URL + "/signup", {
            username: username,
            password: password
        })
    }
}

export default new AuthService()