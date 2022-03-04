
const log = (...data: any[]) => {
    console.log(data)
}

const debug = (...data: any[]) => {
    console.debug(data)
}

const error = (...data: any[]) => {
    console.error(data)
}


export {
    log,debug,error
}