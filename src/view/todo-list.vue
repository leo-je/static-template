<template>
    <div :class="className">
        <div class="todolist-A">
            <header id="header">To Do List</header>
            <main id="todolist-main">
                <div class="one">
                    <div class="oneText">
                        <!--      @keyup.enter为回车事件-->
                        <input
                            type="text"
                            placeholder="添加待办，回车或点击右侧+即可"
                            v-model="state.value"
                            @keyup.enter="add"
                        />
                        <button type="button" @click="add">+</button>
                    </div>
                    <div class="list-img list-img-theme">
                        <img
                            class="theme"
                            src="../assets/svg/night.svg"
                            v-show="store.state.todolist.theme === 'DayTheme'"
                            @click="ThemeSwitch"
                            width="25"
                        />
                        <img
                            class="theme"
                            src="../assets/svg/flip-v.svg"
                            v-show="store.state.todolist.theme === 'NightTheme'"
                            @click="ThemeSwitch"
                            width="30"
                        />
                    </div>
                    <div class="oneText">
                        共有
                        <span style="font-size: 20px;color: blue">{{ state.lists.length }}</span>
                        个任务，其中
                        <span
                            style="font-size: 20px;color: #08e508"
                        >{{ store.state.todolist.finish }}</span>个任务已完成
                    </div>
                </div>

                <div class="two">
                    <div class="list">
                        <div class="title">
                            <h3>待办</h3>
                        </div>
                        <ul>
                            <template v-for="(item, index) in state.lists" :key="'lists-'+index">
                                <li v-if="!item.checked">
                                    <div class="li-content">
                                        <div
                                            style="display: flex;align-items: center;max-width: 85%"
                                        >
                                            <input
                                                class="checkbox"
                                                type="checkbox"
                                                :id="'checkboxInput' + index"
                                                v-model="item.checked"
                                                @click="isChecked(index)"
                                            />
                                            <label
                                                class="checkboxLable"
                                                :for="'checkboxInput' + index"
                                            ></label>
                                            <label
                                                v-if="!item.isEdit"
                                                @click="showEdit(item, index)"
                                                style="max-width: 85%;word-break: break-all;"
                                            >{{ item.name }}</label>
                                            <label v-else>
                                                <!--              回车或者输入框失去焦点时触发事件-->
                                                <textarea
                                                    v-model="state.editValue"
                                                    rows="4"
                                                    @keyup.enter="editInput(item)"
                                                    @blur="editInput(item)"
                                                    autofocus="true"
                                                ></textarea>
                                            </label>
                                        </div>

                                        <button type="button" class="close" @click="Close(index)">
                                            <span>&times;</span>
                                        </button>
                                    </div>
                                </li>
                            </template>
                            <div
                                v-if="store.state.todolist.lists.filter((item: any) => item.checked === false).length === 0"
                                class="SvgTips"
                            >
                                <img src="../assets/svg/yesContent.svg" width="300" />
                                <div>快去添加新的待办吧！</div>
                            </div>
                        </ul>
                    </div>
                    <div class="list-img">
                        <img class="vs" src="../assets/svg/vs.svg" width="100" />
                    </div>
                    <div class="list">
                        <div class="title">
                            <h3>已办</h3>
                        </div>
                        <ul>
                            <template v-for="(item, index) in state.lists" :key="'finish-'+index">
                                <li v-if="item.checked">
                                    <div class="li-content">
                                        <div
                                            style="display: flex;align-items: center;max-width: 85%"
                                        >
                                            <input
                                                class="checkbox"
                                                type="checkbox"
                                                v-model="item.checked"
                                                :id="'checkboxInput1' + index"
                                                @click="isChecked(index)"
                                            />
                                            <label
                                                class="checkboxLable"
                                                :for="'checkboxInput1' + index"
                                            ></label>
                                            <label
                                                style="max-width: 85%;word-break: break-all;"
                                            >{{ item.name }}</label>
                                        </div>

                                        <button type="button" class="close" @click="Close(index)">
                                            <span>&times;</span>
                                        </button>
                                    </div>
                                </li>
                            </template>
                            <div v-if="store.state.todolist.finish === 0" class="SvgTips">
                                <img src="../assets/svg/noContent.svg" width="300" />
                                <div>还没有完成的任务哦</div>
                            </div>
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { ref, reactive, computed } from 'vue'
import { useStore } from "vuex"

const store = useStore()
let editIndex = 0;
let className = ref('');
const state = reactive({
    isEdit: false,
    updateTime: Date.parse(new Date().toString()),
    value: '',
    editValue: '',
    lists: computed(() => store.state.todolist.lists),
    theme: computed(() => store.state.todolist.theme)
});
className.value = state.theme;

// 增加待办
const add = () => {
    // trim()去除前后空格
    if (state.value.trim() === '') {
        ElMessage("请输入内容）")
        state.value = ''
        console.log(state.lists)
        return
    }
    store.commit('add', state.value)
    state.value = ''
};
// 修改待办状态
const isChecked = (index: any) => {
    store.commit('isChecked', index)
}
// 出现修改待办框
const showEdit = (item: any, index: any) => {
    if (!state.isEdit) {
        state.isEdit = true
        editIndex = index
        item.isEdit = true
        state.editValue = item.name
        state.updateTime = Date.parse(new Date().toString())
    }

};
// 修改待办
const editInput = (item: any) => {

    if (item.name !== state.editValue) {
        if (confirm("确定要修改吗？")) {
            store.commit('editInput', [editIndex, state.editValue, item.id, true])
        } else {
            store.commit('editInput', [editIndex, item.name, item.id])
        }
    } else {
        store.commit('editInput', [editIndex, item.name, item.id])
    }
    state.isEdit = false
}
// 删除待办
const Close = (index: any) => {
    if (confirm("确定要删除吗？")) {
        store.commit('Close', index)
    }

}
const ThemeSwitch = () => {
    if (className.value === 'DayTheme') {
        className.value = 'NightTheme'
    } else {
        className.value = 'DayTheme'
    }
    store.commit('ThemeSwitch', className.value)
}
store.commit('initTodoListData')
</script>

<style lang="less" scoped>
.DayTheme {
    --body_bg: #ededed;
    --shadowOne: #cccccc;
    --shadowTwo: #e5e3e3; //#ffffff;
    --input_focus: white;
    --font_color: #333333;
}
.NightTheme {
    --body_bg: #333333;
    --shadowOne: #2c2c2c;
    --shadowTwo: #3a3a3a;
    --input_focus: black;
    --font_color: rgba(247, 247, 247, 0.79);
}

@body-bg: var(--body_bg);
@shadowOne: var(--shadowOne);
@shadowTwo: var(--shadowTwo);
@input_focus: var(--input_focus);
@font_color: var(--font_color);
.todolist-A {
    margin: 0;
    padding: 0;
    min-height: 100vh;
    position: relative;
    background-color: @body-bg;
    color: @font_color;
    transition: color 1s;
}

#header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    border-radius: 0 0 50% 50%;
    font: italic 2em Georgia, serif;
    font-weight: 300;
    box-shadow: 9px 9px 10px @shadowOne, -9px -9px 10px @shadowTwo;
    position: absolute;
    top: 0;
    z-index: 999;
    animation: header 1s cubic-bezier(0.61, 0.27, 0.33, 0.99) forwards;
    background-color: inherit;
}

@keyframes header {
    0% {
        height: 100vh;
    }
    50% {
        height: 50vh;
    }
    100% {
        height: 50px;
    }
}

#todolist-main {
    width: 100%;
    margin: 0px auto;
    padding-bottom: 100px;
    padding-top: 50px;

    .one,
    .two {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
    }

    .list-img {
        flex-basis: 200px;
        text-align: center;

        img {
            cursor: pointer;
            transition: 1s;
        }

        .theme:hover {
            transform: rotate(360deg);
        }

        .vs:hover {
            transform: rotate(30deg) scale(1.2);
        }
    }

    .one {
        margin-top: 40px;

        div {
            width: 400px;
            text-align: center;
        }

        .oneText {
            position: relative;
            height: 40px;
            padding: 0;
            border-radius: 47px;
            background: inherit;
            background: #ffffff;
            // box-shadow: inset 9px 9px 10px @shadowOne,inset -9px -9px 10px @shadowTwo;

            display: flex;
            align-items: center;
            justify-content: center;
            color: #2c2c2c;

            input {
                // background-color: inherit;
                border: none;
                height: 100%;
                box-sizing: border-box;
                width: 100%;
                padding: 0 0 0 20px;
                outline: none;
                transition: 0.5s;
                border-radius: 47px;
                color: @font_color;
            }

            input:focus {
                background-color: @input_focus;
            }

            button {
                position: absolute;
                border: none;
                cursor: pointer;
                font-size: 25px;
                border-radius: 50%;
                top: 0;
                background-color: initial;
                width: 40px;
                height: 40px;
                right: 0;
                transition: 0.5s;
                color: @font_color;

                &:hover {
                    transform: rotate(180deg);
                    font-size: 30px;
                }
            }
        }
    }

    .two {
        .list {
            align-self: center;
            width: 400px;
            height: 400px;
            margin-top: 40px;
            margin-bottom: 40px;
            border-radius: 30px;
            padding: 0 10px 10px 10px;
            box-sizing: border-box;
            overflow: hidden;
            background: inherit;
            // box-shadow: inset -10px -10px 29px @shadowOne,inset 10px 10px 29px @shadowTwo;
            box-shadow: 9px 9px 10px @shadowOne, -9px -9px 10px @shadowTwo;
            .title {
                text-align: center;
            }

            ul {
                max-width: 100%;
                margin: 0 auto;
                overflow-y: scroll;
                height: 85%;
                padding: 0;

                li {
                    list-style-type: none;

                    .li-content {
                        min-height: 40px;
                        padding-bottom: 5px;
                        margin-bottom: 5px;
                        width: 100%;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        border-bottom: 1px dashed @shadowOne;

                        .checkbox {
                            display: none;
                        }

                        .checkboxLable {
                            display: inline-block;
                            width: 20px;
                            height: 20px;
                            line-height: 20px;
                            cursor: pointer;
                            margin-right: 10px;
                            border-radius: 50%;
                            border: 1px solid @font_color; /*改变复选框的边框颜色也可以不要边框*/
                        }

                        /* checked 预先选定复选框或单选按钮。*/

                        .checkbox:checked + .checkboxLable:before {
                            /*before为伪元素可以在元素之后添加内容*/
                            display: block;
                            /*	css3中的content字符编码*/
                            content: "\2665";
                            /*	复选框里面的&radic;居中*/
                            text-align: center;
                            /*	复选框里面的&radic;大小*/
                            font-size: 20px;
                            /*	字体的颜色*/
                            color: red;
                        }

                        .checkbox:checked:hover + .checkboxLable:before {
                            animation: checkboxLable 0.7s linear infinite
                                alternate;
                        }

                        @keyframes checkboxLable {
                            from {
                                transform: scale(1);
                            }
                            to {
                                transform: scale(1.5);
                            }
                        }

                        textarea {
                            background-color: inherit;
                            color: @font_color;
                            width: 315px;
                            font-size: 16px;
                        }

                        .close {
                            border: none;
                            background-color: inherit;
                            cursor: pointer;
                            font-size: 20px;
                            transition: 0.5s;
                            color: @font_color;
                        }

                        .close:hover {
                            font-size: 25px;
                            transform: rotate(180deg);
                        }
                    }
                }

                .SvgTips {
                    text-align: center;
                }
            }

            ul::-webkit-scrollbar {
                display: none;
            }
        }
    }
}

#footer {
    font: italic 1em Georgia, serif;
    line-height: 1.5em;
    position: absolute;
    bottom: 0;
    display: flex;
    height: 100vh;
    border-radius: 50% 50% 0 0;
    justify-content: center;
    align-items: center;
    border-top: 1px solid @shadowOne;
    background-color: inherit;
    flex-direction: column;
    width: 100%;
    animation: footer 3s cubic-bezier(0.61, 0.27, 0.33, 0.99) forwards;
}

@keyframes footer {
    0% {
        height: 100vh;
    }
    50% {
        height: 50vh;
    }
    100% {
        height: 80px;
    }
}

@media screen and (max-width: 1111px) {
    #todolist-main {
        .list-img {
            flex-basis: 150px;
        }
    }
}

@media screen and (max-width: 1000px) {
    #todolist-main {
        .oneText {
            margin-bottom: 20px;
            height: 50px !important;

            button {
                width: 50px !important;
                height: 50px !important;
                font-size: 30px !important;

                &:hover {
                    font-size: 40px !important;
                }
            }
        }

        .list-img {
            flex-basis: 100%;
        }

        .list-img-theme {
            margin-bottom: 25px;
            order: -1;
        }
    }
}

@media screen and (max-width: 600px) {
    #todolist-main {
        width: 90%;
    }
}
</style>
