import { defineComponent, ref } from 'vue';
import { Modeler, Panel, BpmnActions, BpmnStore } from '@/components/process';
import './processPanel.css';
import http from '@/utils/http';
import { ElMessage } from 'element-plus';

export default defineComponent({
  name: 'ProcessPanel',
  setup() {
    return {
      isUpdate: ref(false),
    };
  },
  mounted() {
    let query = this.$route.query;
    if (query?.key) {
      this.isUpdate = true
      this.getBpmnXml(query.key + '');
    }
  },
  methods: {
    getBpmnXml(key?: string) {
      const bpmnContext = BpmnStore;
      http('post', '/api-process/process/definition/getBpmnXML?processDefinitionKey=' + key, null).then(data => {
        console.log(data)
        if (data) {
          bpmnContext.importXML(data).then(value=>{
            bpmnContext.getModeler().get('canvas').zoom('fit-viewport', 'auto');
          })
        }
      }).catch(err => {
        console.error(err);
      })
    },
    async save() {
      const bpmnContext = BpmnStore;
      bpmnContext.getXML()
        .then(resp => {
          if (resp && resp.xml) {
            http('post', '/api-process/process/definition/add', { bpmnXml: resp.xml }).then(data => {
              console.log(data)
              if (data) {
                ElMessage(data);
              }
            }).catch(err => {
              console.error(err);
            })
          }
        })
    }

  },
  render() {
    return (
      <div class="app-containers">
        <Modeler />
        <Panel />
        <BpmnActions saveHandle={this.save} isUpdate={this.isUpdate} />
      </div>
    );
  },
});
