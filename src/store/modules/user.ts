/* jshint esversion: 6 */
import router from "../../router";
import http from "../../utils/http";
const user = {
    state: {
        user: {
            name: '游客',
            access_token: '',
            refresh_token: ''
        }
    },
    actions: {
        LoginByUsername({
            state,
            commit,
            rootState
        }, data) {
            return new Promise((resolve, reject) => {
                console.log("LoginByUsername")
                if (sessionStorage.getItem("user")) resolve(JSON.parse(sessionStorage.getItem("user")));
                else
                http("post", "/api-user/busi/user/me", {}).then(data => {
                    console.log("user store", data);
                    this.state.user.user = data
                    sessionStorage.setItem('user', JSON.stringify(this.state.user.user))
                    resolve(data)
                }).catch(function (e) {
                    console.error(e);
                    router.push("/401")
                    reject(e)
                });
            })
        }
    }
}

export default user