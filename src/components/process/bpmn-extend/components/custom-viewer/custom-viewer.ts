import Viewer from 'bpmn-js';
import ZoomScrollModule from 'diagram-js/lib/navigation/zoomscroll';
import MoveCanvasModule from 'diagram-js/lib/navigation/movecanvas';

class CustomViewer extends Viewer {
  prototype: any;
  constructor(options: unknown | any | null) {
    super(options);
  }
}
const ayy: Array<any> = [];
CustomViewer.prototype._modules = ayy.concat(Viewer.prototype._modules, [
  ZoomScrollModule,
  MoveCanvasModule,
]);

export default CustomViewer;
