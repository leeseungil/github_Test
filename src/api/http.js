import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://reqres.in',
})

export default instance
