/*
 * 游戏控制类
 * @param {number} [para.speed] 速度
 * @param {function} [para.onPlay] 回调
 */
var game = function (option) {
    this.option = option || {};
    this._over = true;
    this.pause = true;
    this.speed = this.option.speed || 5;
    this.e_play = this.option.onPlay;
    this.fn_play = (function (my) {
        var total = 0;
        return function () {
            if (my._over) {
                return;
            }
            if (my.pause) {
                window.requestAnimationFrame(my.fn_play);
                return;
            }
            if (++total >= my.speed) {
                total = 0;
                if (my.e_play) {
                    my.e_play();
                }
            }
            if (my._over) {
                return;
            }
            window.requestAnimationFrame(my.fn_play);
        }
    })(this);
}
/*
 * 运行
 * @param {function} [callback] 回调函数
 * @param {number} [speed] 速度
 */
game.prototype.play = function (callback, speed) {
    this.e_play = callback || this.e_play;
    this.speed = speed || this.speed;
    this._over = this.pause = false;
    window.requestAnimationFrame(this.fn_play);
    return this;
}
/*
 * 结束
 */
game.prototype.over = function () {
    this.pause = this._over = true;
    return this;
}

module.exports = game;