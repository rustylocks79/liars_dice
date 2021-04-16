import axios from 'axios'

const REST_API_URL = '';

class AuthService {
    user(token) {
        let url = ''
        if (process.env.NODE_ENV !== 'production') {
             url = 'http://localhost:5000'
        } else {
            url = 'http://146.186.64.130:8080'
        }
        return axios.get(url + "/user", {
            headers: {
                Authorization: "Bearer " + token
            }
        })
    }

    login(username, password) {
        let url = ''
        if (process.env.NODE_ENV !== 'production') {
             url = 'http://localhost:5000'
        } else {
            url = 'http://146.186.64.130:8080'
        }
        return axios.post(url + "/login", {
            username: username,
            password: password
        })
    }

    signup(username, password) {
        let url = ''
        if (process.env.NODE_ENV !== 'production') {
             url = 'http://localhost:5000'
        } else {
            url = 'http://146.186.64.130:8080'
        }
        return axios.post(url + "/signup", {
            username: username,
            password: password
        })
    }
}

export default new AuthService()