import { getUserFromLocalstrage, getUserFromCookie } from '~/utils'

export default function ({ store, req }) {
        if (process.server && !req) return;
        const userData = process.server ? getUserFromCookie(req) : getUserFromLocalstrage();
        if (!userData) {
                return;
        // } else if (!userData.jwt || Date.now() > userData.expiresIn) {
        } else if (!userData.jwt ) {
                store.commit('CLEAR_TOKEN');
                store.commit('CLEAR_USER');
        } else {
                store.commit('SET_TOKEN', userData.jwt);
                const {user,avatar} = userData;
                store.commit('SET_USER', { user, avatar });
                const timeToLogout = userData.expiresIn - Date.now(); 
                store.dispatch('setLogoutTimer', timeToLogout);
        }
}