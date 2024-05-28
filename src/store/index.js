import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';

const store = createStore({
    state() {
        return {
            counter: 1,
            loginInfo: { loginId: '', userNm: '', userType: '', usrMnuAtrt: '' },
        };
    },
    getters: {
        getCounter(state) {
            return state.counter;
        },
        getLoginInfo(state) {
            return state.loginInfo;
        },
    },
    mutations: {
        increment(state) {
            state.counter++;
        },
        setLoginInfo(state, payload) {
            state.loginInfo = payload;
        },
        setLogout(state) {
            state.loginInfo = null;
        },
    },
    actions: {},
    modules: {},
    plugins: [createPersistedState()],
});

export default store;
