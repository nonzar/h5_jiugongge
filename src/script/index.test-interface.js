/**
 * Created by nonzar on 16/3/16.
 */
//模拟app数据
window.__a__ = {
    getAccount: function () {
        return "13612312345";
    },
    getUserKey: function () {
        return "bXeroB2UJ7eWxUiruujFL5UaN08BGyci";
    }
}
//接口模拟数据
var $ = require("./jquery.min.js"),
    nzdelay = require("./nz.delay.js"),
    Api = require("./index.api.js");
var Interface = {};
Interface.getAwardConfig = function (cb1, cb2) {
    (function (data) {
        nzdelay.w(500).r(function () {
            cb1(data);
        });
    })({
        "configs": (function () {
            var a = [];
            for (var i = 0; i < 8; i++) {
                a.push({
                    "awardType": Math.floor(Math.random() * 3),
                    "picUrl": "upload/p" + (i + 1) + ".png",
                    "percent": 0,
                    "prize": Math.floor(Math.random() * 100),
                    "awardName": i * 10,
                    "configId": i
                });
            }
            return a;
        })(),
        "code": "1",
        "msg": "获取奖品配置成功"
    });
}
Interface.getUserInfo = function (cb1, cb2) {
    (function (data) {
        nzdelay.w(500).r(function () {
            cb1(data);
        });
    })({
        "code": "1",
        "msg": "获取用户信息成功",
        "phone": "13612312345",
        "name": "小明",
        "addr": "广东省-广州市-天河区-太平洋网络",
        "postcode": "510000"
    });
}
Interface.getUserScore = function (cb1, cb2) {
    (function (data) {
        nzdelay.w(500).r(function () {
            cb1(data);
        });
    })({
        "code": "1",
        "score": "3386",
        "account": "13612312345",
        "msg": "获取用户积分成功"
    });
}
Interface.getWinner = function (cb1, cb2) {
    (function (data) {
        nzdelay.w(500).r(function () {
            cb1(data);
        });
    })({
        "code": "1",
        "lotterys": (function () {
            var a = [];
            for (var i = 0; i < 10; i++) {
                a.push({
                    "account": "13580320" + (function () {
                        var num = Math.floor(Math.random() * 1000).toString();
                        for (var i = 3; i > num.length; i--) {
                            num = "0" + num;
                        }
                        return num;
                    })(),
                    "awardName": "奖品8"
                });
            }
            return a;
        })(),
        "msg": "获取名单成功"
    });
}
Interface.lottery = function (cb1, cb2) {
    (function (data) {
        nzdelay.w(500).r(function () {
            cb1(data);
        });
    })({
        "code": "1",
        "msg": "抽奖成功",
        "configId": Math.floor(Math.random() * Api.getPrz().length)
    });
}
Interface.submitInfo = function (info, cb1, cb2) {
    (function (data) {
        nzdelay.w(500).r(function () {
            cb1(data);
        });
    })({
        "code": "1",
        "msg": "修改用户信息成功"
    });
}
module.exports = Interface;