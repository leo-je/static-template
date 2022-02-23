const setCookie = (c_name: string, value: string, expire: number) => {
    var date = new Date()
    date.setSeconds(date.getSeconds() + expire)
    document.cookie = c_name + "=" + encodeURIComponent(value) + "; expires=" + date.toUTCString()
    //console.log(document.cookie)
}

const getCookie = (c_name: string) => {
    console.log(c_name)
    if (document.cookie.length > 0) {
        let c_start = document.cookie.indexOf(c_name + "=")
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1
            let c_end = document.cookie.indexOf(";", c_start)
            if (c_end == -1) c_end = document.cookie.length
            return decodeURIComponent(document.cookie.substring(c_start, c_end))
        }
    }
    return ""
}

const delCookie = (c_name: string) => {
    console.log(getCookie(c_name));
    setCookie(c_name, "", -1)
}

export {
    setCookie,
    getCookie,
    delCookie,
}