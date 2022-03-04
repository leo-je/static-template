/* jshint esversion: 6 */
import { delCookie } from "@/utils/cookieUtils";
import { debug, error, log } from "@/utils/logUtils";
import { getRouter } from "../../router";
import http from "../../utils/http";

export interface userInfo {
    username?: string
}
const userInfo: userInfo = {
    username: undefined
}
const user = {
    state: {
        user: userInfo
    },
    actions: {
        LoginByUsername(context: any, prama: Object): Object {
            let _this = this;
            return new Promise((resolve, reject) => {
                log("LoginByUsername:" + prama)
                if (context.state.user.username) {
                    resolve(context.state.user);
                } else {
                    let sessionUser = sessionStorage.getItem("user");
                    log(sessionUser)
                    if (sessionUser && sessionUser != "undefined") {
                        context.state.user = JSON.parse(sessionUser)
                        resolve(context.state.user);
                    } else {
                        http("post", "../api-user/busi/user/me", null)
                            .then(data => {
                                debug("user store", data);
                                context.state.user = Object.assign(context.state.user, data)
                                sessionStorage.setItem('user', JSON.stringify(context.state.user))
                                resolve(context.state.user)
                            }).catch(function (e) {
                                error(e);
                                getRouter().push("/401")
                                reject(e)
                            });
                    }
                }
            })
        },
        user_logout(context: any) {
            log('user_logout')
            //GATEWAY-SERVICE-SESSION
            delCookie('GATEWAY-SERVICE-SESSION')
            context.state.user = null
            location.href = `/config/gateway/logout?redirect=${location.protocol}://${location.host}/logout`.replace('::', ':')
        }
    }
}

export default user