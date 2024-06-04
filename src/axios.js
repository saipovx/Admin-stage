import axios from "axios";

const BaseUrl = process.env.REACT_APP_API_URL

const Instance = axios.create({

    baseURL: BaseUrl,

});

export default Instance