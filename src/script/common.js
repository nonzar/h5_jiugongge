/**
 * Created by nonzar on 16/3/18.
 */
/*
 * 兼容处理raf
 */
window.requestAnimationFrame = window.requestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.oRequestAnimationFrame
    || window.msRequestAnimationFrame
    || function (callback) {
        return setTimeout(callback, 1);
    };