import axios from "axios";

export const sendRequest = axios.create({
    baseURL: "https://api.rivafollower.com/base",
    headers: {
        version: 999999,
    }
})