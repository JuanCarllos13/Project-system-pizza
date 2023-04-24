import axios from "axios";

const api = axios.create({
    // baseURL: 'http://localhost:3333'
    baseURL: 'http://172.21.32.1:3333'

})

export {api}