/*
 * 公共类,用于链式延迟执行函数
 * 示例:
 * nzdelay.w(1000).r(fn).w(1500).r(fn2);
 */
var nzdelay = (function () {
    /*
     * _delay是延时类,用于延时执行函数.
     */
    var _delay = function () {
        this.__state = false;
        this.__queue = [];
        return this;
    }
    /*
     * 开始执行队列
     * @return this
     */
    _delay.prototype.__s = function () {
        if (!this.__state) {
            this.__state = true;
            this.__queue.shift()();
        }
        return this;
    }
    /*
     * 等待ms秒
     * @param {number} [ms] 等待的毫秒
     * @return this
     */
    _delay.prototype.w = function (ms) {
        var my = this;
        this.__queue.push(function () {
            setTimeout(function () {
                if (my.__queue.length) {
                    my.__queue.shift()();
                }
            }, ms);
        });
        return this.__s();
    }
    /*
     * 添加函数
     * @param {function} [fn] 添加的函数
     * @return this
     */
    _delay.prototype.r = function (fn) {
        var my = this;
        this.__queue.push(function () {
            fn();
            if (my.__queue.length) {
                my.__queue.shift()();
            }
        });
        return this.__s();
    }
    return {
        w: function (ms) {
            return (new _delay()).w(ms);
        },
        r: function (fn) {
            return (new _delay()).r(fn);
        }
    }
})();
module.exports = nzdelay;