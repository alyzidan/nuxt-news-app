import Vuex from 'vuex';
import md5 from 'md5';
import db from '~/plugins/firestore'
const createStore = () => {
      return new Vuex.Store({
            state: {
                headlines: [],
                category: '',
                country: '',
                user: {},
                idToken:null,
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
                  SET_USER(state, user) {
                        state.user = user
                  }  ,

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
                    async AuthenticateUser({ commit }, authData) {
                            try {
                                    commit('SET_LOADING', true)
                                    const authDataUser = await this.$axios.$post('/register/', { ...authData })
                                    const avatar = `http://gravatar.com/avatar/${md5(authDataUser.email)}?d=identicon`;
                                    const { email } = authDataUser;
                                    const { idToken } = authDataUser;
                                    const user = {email,avatar}
                                    await db.collection('users').doc(authData.email).set(user);
                                    commit('SET_USER', user )
                                    commit('SET_LOADING', false)
                                    commit('SET_TOKEN', idToken)
                                    //     console.log({...authData})
                                } catch (error) {
                                        console.log({...error})
                                        this.commit('SET_LOADING', false)
                            }
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
