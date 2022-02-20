import http from "@/utils/http"

const todolist = {
    state: {
        theme: 'DayTheme',
        finish: 0,
        lists: [],
    },
    getters: {},
    mutations: {
        initTodoListData(state: any) {
            http('get', '/api-user/user/todoList/list').then(data => {
                if (data) {
                    data.map((e: any) => {
                        e.checked = e.checkedInt == 1 ? true : false

                    })
                    state.lists = data
                }
            })
        },
        // 增加待办
        add(state: any, val: any) {
            //unshift方法为向数组第一位添加数据
            //push方法为向数组最后一位添加数据
            let newTodo = {
                id: null,
                name: val,
                checked: false,
                isEdit: false,
                updateTime: Date.parse(new Date().toString())
            }
            http('post', '/api-user/user/todoList/save', newTodo).then(data => {
                newTodo.id = data
                state.lists.push(newTodo)
            })

        },
        // 待办状态修改
        isChecked(state: any, index: any) {
            state.lists[index].checked = !state.lists[index].checked
            state.lists[index].updateTime = Date.parse(new Date().toString())
            state.finish = state.lists.filter((item: any) => item.checked === true).length
            http('post', '/api-user/user/todoList/save', state.lists[index])
        },
        // 删除待办
        Close(state: any, index: any) {
            http('post', '/api-user/user/todoList/delete', state.lists[index]).then(
                data => {
                    state.lists.splice(index, 1)
                    state.finish = state.lists.filter((item: any) => item.checked === true).length
                }
            )
        },
        // 修改待办
        editInput(state: any, val: any) {
            console.log(val)

            let target = {
                id: val[2],
                name: val[1],
                checked: false,
                isEdit: false,
                updateTime: Date.parse(new Date().toString())
            }
            if (val[3]) {
                http('post', '/api-user/user/todoList/save', target).then(data => {
                    state.lists[val[0]] = target
                })
            } else {
                state.lists[val[0]] = target
            }

        },
        ThemeSwitch(state: any, theme: any) {
            state.theme = theme
        }
    },
    actions: {},
    modules: {}

}

export default todolist;