import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

// import createPersistedState from 'vuex-persistedstate'
// eslint-disable-next-line import/no-cycle
import router from '../router'

Vue.use(Vuex)

export default new Vuex.Store({
  // plugins: [
  //   // eslint-disable-next-line no-undef
  //   createPersistedState({
  //   }),
  // ],
  state: {
    userInfo: null,
    isLogin: false,
    isLoginError: false,
  },
  mutations: {
    // state 상태 변경
    loginSuccess(state, payload) {
      state.isLogin = true
      state.isLoginError = false
      state.userInfo = payload
    },
    loginError(state) {
      state.isLogin = false
      state.isLoginError = true
    },
    logOut(state) {
      state.isLogin = false
      state.isLoginError = false
      state.userInfo = null
    },
  },
  actions: {
    // 로그인 시도
    login({ dispatch, commit }, loginObj) {
      // 로그인 -> 토큰 반환
      axios
        .post('https://reqres.in/api/login', loginObj) // 파라미터 (body)
        .then(response => {
          // 성공 시 토큰 반환
          // 토큰을 헤더에 포함 시켜서 유저 정보 요청
          const { token } = response.data

          // 토큰을 로컬스토리지 저장
          localStorage.setItem('access_token', token)
          dispatch('getMemberInfo')
        })
        .catch(() => {
          // eslint-disable-next-line no-alert
          alert('이메일과 비밀번호를 확인하세요.')
          commit('loginError')
          // eslint-disable-next-line no-undef
        })
        .then(() => {
          console.log('then log')
        })
    },
    logOut({ commit }) {
      localStorage.setItem('access_token', null)
      commit('logOut')
      router.push({ name: 'pages-login' })
    },
    getMemberInfo({ commit }) {
      // 로컬 스토리지에 저장된 토큰 활용
      const token = localStorage.getItem('access_token')
      const config = {
        headers: {
          'access-token': token,
        },
      }

      // 토큰 -> 반환된 토큰으로 멤버 정보를 반환
      // 새로 고침 -> 토큰만 가지고 멤버정보 요청
      axios
        .get('https://reqres.in/api/users/2', config)
        .then(res => {
          const userInfo = {
            avatar: res.data.data.first_name,
            email: res.data.data.email,
            first_name: res.data.data.first_name,
            id: res.data.data.id,
            last_name: res.data.data.last_name,
          }
          commit('loginSuccess', userInfo)
          router.push({ name: 'dashboard' })
        })
        .catch(() => {
          // eslint-disable-next-line no-alert
          alert('이메일과 비밀번호를 확인하세요2')
          commit('loginError')
        })
    },
  },
  modules: {},
})
