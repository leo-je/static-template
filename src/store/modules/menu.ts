/* jshint esversion: 6 */
import http from "@/utils/http";
import { error, log } from "@/utils/logUtils";
const menu = {
    state: {
        menu: undefined
    },
    actions: {
        LoadMenu(context: any, prama: Object): Object {
            let _this = this;
            return new Promise((resolve, reject) => {
                console.log("LoadMenu:" + prama)
                if (context.state.menu) {
                    resolve(context.state.menu);
                } else {
                    http("get", "/api-user/busi/menu/valid/tree",prama)
                        .then(data => {
                            log("menu store", data);
                            context.state.menu = Object.assign({}, data)
                            resolve(context.state.menu)
                        }).catch(e => {
                            error("==============>", e);
                            reject(e)
                        });
                }
            })
        }
    }
}

export default menu