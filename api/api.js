const axios = require('axios').default;

const api = axios.create({ baseURL: 'http://192.168.192.46' });

module.exports = api;
