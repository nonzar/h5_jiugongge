/*
 * 添加nzmask样式表
 * 建议该段代码放于<head>内执行
 * 或复制下列css样式
 .nzmask {
 background-color: rgba(0, 0, 0, 0.8);
 width: 100%;
 height: 100%;
 z-index: 9999;
 position: fixed;
 left: 0px;
 top: 0px;
 opacity: 0;
 pointer-events: none;
 overflow: hidden;
 transition: opacity 500ms;
 }
 .nzmask-show {
 pointer-events: auto;
 opacity: 1;
 }
 */

//var nzmask__setCss = (function () {
//    //添加样式规则
//    if (document.styleSheets.length == 0) {
//        document.head.appendChild(document.createElement("style"));
//    }
//    document.styleSheets[0].addRule(".nzmask", "" +
//        "background-color: rgba(0,0,0,0.8);" +
//        "width: 100%;" +
//        "height: 100%;" +
//        "overflow: hidden;" +
//        "z-index: 9999;" +
//        "position: fixed;" +
//        "left: 0;" +
//        "top: 0;" +
//        "opacity: 0;" +
//        "pointer-events: none;" +
//        "-webkit-transition: opacity 500ms;" +
//        "");
//    document.styleSheets[0].addRule(".nzmask-show", "" +
//        "pointer-events: auto;" +
//        "opacity: 1;" +
//        "");
//})();
/*
 * nzmask是遮罩类,用于显示遮罩层.
 */
var nzmask = function () {
    //选项
    this.options = {
        zIndex: 9999
    }
    //队列
    this.queue = {
        item: {},
        items: []
    };
    //dom元素
    this.dom = {
        masks: []
    };
    //初始化
    this.__init();
    return this;
}
/*
 * 初始化
 * @return this
 */
nzmask.prototype.__init = function () {
    //获取遮罩层
    this.dom.masks = document.querySelectorAll(".nzmask");
    return this;
}
/*
 * 根据id获取遮罩在集合中的序号
 * @param {string} [id] 遮罩的id
 * @return number
 */
nzmask.prototype.__getIdxById = function (id) {
    switch (typeof(id)) {
        case "string":
            //传入id
            if (this.dom.masks && this.dom.masks.length) {
                for (var i = 0; i < this.dom.masks.length; i++) {
                    if (this.dom.masks[i].id == id) {
                        return i;
                    }
                }
            }
            break;
        case "number":
            //传入序号
            return id;
            break;
        default:
            return -1;
    }
    return -1;
}
/*
 * 显示遮罩
 * @param {string|number} [id] 遮罩的序号或者id
 * @param {number} [mode] 默认:0 显示模式:0替换\1叠加
 * @return this
 */
nzmask.prototype.show = function (id, mode) {
    if (mode == undefined) {
        this.hide();
    }
    var idx = this.__getIdxById(id);
    this.dom.masks[idx].style.zIndex = ++this.options.zIndex;
    this.dom.masks[idx].classList.add("nzmask-show");
    return this;
}
/*
 * 隐藏遮罩,如传入id则隐藏该id遮罩,否则全部隐藏
 * @param {string|number} [id] 遮罩的序号或者id
 * @return this
 */
nzmask.prototype.hide = function (id) {
    if (id != undefined) {
        var idx = this.__getIdxById(id);
        this.dom.masks[idx].classList.remove("nzmask-show");
    } else {
        for (var i = 0; i < this.dom.masks.length; i++) {
            this.dom.masks[i].classList.remove("nzmask-show");
        }
    }
    return this;
}
module.exports = nzmask;