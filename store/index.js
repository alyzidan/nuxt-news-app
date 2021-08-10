import Vuex from 'vuex';

const createStore = () => {
      return new Vuex.Store({
            state: {
                  headlines: [],
                  category: '',
                  country: '',
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

                  }
            },
            getters: {
                  headlines: state => state.headlines,
                  category: state => state.category,
                  loadingState: state => state.loadingState,
                  country: state => state.country,
            }
      })
}
export default createStore;