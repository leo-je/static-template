import {
  ProcessBaseGroupProperties,
  ExtensionGroupProperties,
  ProcessDocumentGroupProperties,
  getElementTypeListenerProperties,
} from '../common';

//流程数据属性配置数组
const ProcessGroupPropertiesArray = [
  // CommonGroupProperties,
  ProcessBaseGroupProperties,
  /**
   * 监听器组
   */
  getElementTypeListenerProperties({
    name: '全局监听器',
  }),
  ExtensionGroupProperties,
  ProcessDocumentGroupProperties,
];

export default {
  //流程
  'bpmn:Process': ProcessGroupPropertiesArray,
  //子流程
  'bpmn:SubProcess': ProcessGroupPropertiesArray,
};
