import { defineComponent, reactive, ref } from 'vue';
import './processPanel.css';
import http from '@/utils/http';
import { ElMessage } from 'element-plus';
import CustomViewer from '@/components/process/bpmn-extend/components/custom-viewer/custom-viewer'
import translate from '@/components/process/bpmn/i18n';
import activitiModdel from '@/components/process/bpmn-extend/resources/activiti-moddel.json';
import createDefaultBpmnXml from '@/components/process/bpmn/defaultBpmnXml';
import './processViewer.css'

export default defineComponent({
    name: 'ProcessViewer',
    setup() {
        return {
            bpmnViewer: reactive(new CustomViewer(null)),
            scale: ref(0)
        };
    },
    mounted() {
        let query = this.$route.query;
        if (query?.key) {
            this.getBpmnXml(query.key + '');
        }
    },
    methods: {
        getBpmnXml(key?: string) {
            http('post', '/api/process/definition/getBpmnXML?processDefinitionKey=' + key, null).then(data => {
                // console.log(data)
                if (data) {
                    this.getImg(data)
                }
            }).catch(err => {
                console.error(err);
            })
        },
        getImg(xml: string) {
            // 初始时清除图层
            // this.bpmnViewer && this.bpmnViewer.destroy();
            this.scale = 1; // 放大缩小比例
            // 初始化canvas
            let height = window.innerHeight;
            let cv = new CustomViewer({
                container: this.$refs.canvas,
                height, // 根据实际情况设置高度，宽度的话设置父元素的宽度就可以，会自适应的
                additionalModules: [
                    //添加翻译
                    { translate: ['value', translate('zh')] },
                ],
                moddleExtensions: {
                    activiti: activitiModdel,
                },
            });
            this.bpmnViewer = cv
            const self = this;
            this.bpmnViewer?.importXML(xml, function (err: any) {
                if (err) {
                    console.error(err);
                } else {
                    let canvas = self.bpmnViewer?.get("canvas");
                    canvas.zoom("fit-viewport", "auto");
                    // nodeCodes为需要设置高亮颜色的部分的id的集合（xml文件中<flowNodeRef>****</flowNodeRef>标签里的部分），这个数据也是从接口获取，这里从xml中随便取出几个测试用
                    let nodeCodes = [
                        "node1",
                        "node2",
                    ];
                    // 以下代码为：为节点注册鼠标悬浮事件
                    const eventBus = self.bpmnViewer.get('eventBus');
                    const overlays = self.bpmnViewer.get('overlays');
                    eventBus.on('element.hover', (e: any) => {
                        // console.log(e)
                        if (e.gfx.nodeName === 'svg') return;
                        let taskName = e.element?.businessObject.name
                        let role = e.element?.businessObject?.role
                        if (role) {
                            role = ':' + role
                        } else {
                            role = ''
                        }
                        if (taskName) {
                            const overlayHtml = `
                                <div class="tipBox" style="
                                position: absolute;
                                width: max-content;
                                border-radius: 10px;
                                background-color: #ddd;
                                padding: 10px;
                            ">
                                    <span> ${taskName + role}</span>
                                </div>
                            `
                            
                            overlays.add(e.element.id, {
                                position: { top: e.element.height, left: 0 },
                                html: overlayHtml
                            });
                        }
                    });
                    eventBus.on('element.out', () => {
                        overlays.clear();
                    });
                    //  注册悬浮事件结束
                    // 调用设置高亮颜色class方法,这里可以根据接口获取的id集合情况，对不同的部分设置不同的class名，然后在css中设置样式
                    self.setNodeColor(nodeCodes, "highlight-overlay", canvas);
                }
            });
        },
        // 设置高亮颜色的class
        setNodeColor(nodeCodes: any, colorClass: any, canvas: any) {
            for (let i = 0; i < nodeCodes.length; i++) {
                canvas.addMarker(nodeCodes[i], colorClass);
            }
        },
        // 放大缩小，这里尽量设置flag的值小一点，这样每次放大缩小不会很多，避免放大超出父元素
        handleZoom(flag: number) {
            if(flag == 0){
                this.bpmnViewer.get("canvas").zoom("fit-viewport", "auto");
                this.scale = 1;
                return
            }
            const _this = this;
            // 放大缩小倍数flag可以自行设置
            if (flag < 0 && this.scale <= 1) {
                return;
            }
            this.scale += flag;
            this.$nextTick(() => {
                _this.bpmnViewer.get("canvas").zoom(_this.scale);
            });
        },
    },

    render() {
        return (
            <>
            <div class="button-list">
                    <el-button type="success"
                        size="small"
                        onClick={() => this.handleZoom(0.2)}>放大</el-button>
                    <el-button type="warning"
                        size="small"
                        onClick={() => this.handleZoom(-0.2)}>缩小</el-button>
                        <el-button type="info"
                        size="small"
                        onClick={() => this.handleZoom(0)}>还原</el-button>
                </div>
                <div class="app-containers">
                    <div class="canvas"
                        ref="canvas"></div>
                </div >
                
            </>
        );
    },
});
