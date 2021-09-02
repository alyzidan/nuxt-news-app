import Vuex from 'vuex';
import md5 from 'md5';
import db from '~/plugins/firestore';
import {saveUserData,clearUserData} from '~/utils'
const createStore = () => {
        return new Vuex.Store({
                state: {
                        headlines: [],
                        category: '',
                        country: '',
                        user: null,
                        idToken: null,
                        loadingState: false,
                },
                mutations: {
                        SET_HEADLINES(state, payload) {
                                state.headlines = payload
                        },
                        SET_CATEGORY(state, payload) {
                                state.category = payload
                        },
                        SET_LOADING(state, payload) {
                                state.loadingState = payload
                        },
                        SET_COUNTRY(state, payload) {
                                state.country = payload
                        },
                        SET_TOKEN(state, payload) {
                                state.idToken = payload
                        },
                        CLEAR_TOKEN(state) {
                                state.idToken = null;
                        },
                        SET_USER(state, user) {
                                state.user = user
                        },
                        CLEAR_USER(state) {
                                state.user = null;
                        }

                },
                actions: {
                        async loadHeadlines({ commit }, payload) {
                                try {
                                        this.commit('SET_LOADING', true)
                                        const TopHeadlines = await this.$axios.$get(payload);
                                        commit('SET_HEADLINES', TopHeadlines.sources);
                                        this.commit('SET_LOADING', false)
                                } catch (error) {
                                        throw error
                                        this.commit('SET_LOADING', false)
                                }
                        },
                        async bookmarkAtricle({ commit,state }, headline) {
                                try {
                                        commit('SET_LOADING', true);
                                        const feedRef = await db.collection(`users/${state.user.user}/feed`).doc(headline.title);
                                        feedRef.set(headline);
                                } catch (error) {
                                        console.log(error)
                                }
                        },
                        async AuthenticateUser({ commit }, authData) {
                                try {
                                        commit('SET_LOADING', true);
                                        const authDataUser = await this.$axios.$post(
                                                `/${authData.action}/`,
                                                { ...authData }
                                        );
                                        const { idToken } = authDataUser;
                                        let user;
                                        if (authData.action === 'register') {
                                                const avatar = `http://gravatar.com/avatar/${md5(authDataUser.email)}?d=identicon`;
                                                const { email } = authDataUser;
                                                user = { email, avatar }
                                                await db.collection('users').doc(authData.email).set(user);
                                                saveUserData(authDataUser, user)
                                        } else {
                                                const loginRef = db.collection('users').doc(authData.email);
                                                const loggedUser = await loginRef.get();
                                                user = loggedUser.data();
                                                saveUserData(authDataUser, user)
                                        }
                                        commit('SET_USER', user)
                                        commit('SET_LOADING', false)
                                        commit('SET_TOKEN', idToken)
                                        // return true
                                } catch (error) {
                                        console.log({ ...error })
                                        commit('SET_LOADING', false)
                                        throw {...error}
                                }
                        },
                        setLogoutTimer({ dispatch }, interval) {
                            setTimeout(() => dispatch('logoutUser'),interval)
                        },
                        logoutUser({ commit }, payload) {
                                commit('CLEAR_TOKEN');
                                commit('CLEAR_USER');
                                clearUserData();
                        }
            },
            getters: {
                  headlines: state => state.headlines,
                  category: state => state.category,
                  loadingState: state => !!state.loadingState,
                  isAuthenticated: state => state.idToken,
                  user: state => state.user,
                  country: state => state.country,
            }
      })
}
export default createStore;


// https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]
