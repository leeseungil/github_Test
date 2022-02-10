import http from '@/api/http'

// eslint-disable-next-line import/prefer-default-export
export function login(eamil, password) {
  return http.post('/pages/login', {
    eamil,
    password,
  })
}
