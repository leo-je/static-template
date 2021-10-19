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
        }, prama: Object): Object {
            let _this = this;
            return new Promise((resolve, reject) => {
                console.log("LoginByUsername:" + prama)
                if (sessionStorage.getItem("user")) {
                    _this.state.user = JSON.parse(sessionStorage.getItem("user") || '')
                    resolve(_this.state.user);
                }
                else {
                    http("post", "/api-user/busi/user/me", null)
                    .then(data => {
                        console.log("user store", data);
                        _this.state.user = Object.assign(_this.state.user, data)
                        sessionStorage.setItem('user', JSON.stringify(_this.state.user.user))
                        resolve(_this.state.user)
                    }).catch(function (e) {
                        console.error(e);
                        router.push("/401")
                        reject(e)
                    });
                }

            })
        }
    }
}

export default user