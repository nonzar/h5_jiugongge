//数据接口
var $ = require("./jquery.min.js"),
    Api = require("./index.api.js");
var Interface = {
    url: "http://games.yqhapp.com/online160324/",
    account: window.__a__ && window.__a__.getAccount(),
    key: window.__a__ && window.__a__.getUserKey(),
    getAwardConfig: function (cb1, cb2) {
        $.ajax({
            type: 'GET',
            url: Interface.url + "action/getAwardConfig.jsp",
            data: {},
            dataType: 'jsonp',
            success: function (data) {
                if (cb1) {
                    cb1(data);
                }
            },
            error: function (xhr, type) {
                if (cb2) {
                    cb2(xhr, type);
                }
            }
        });
    },
    getUserInfo: function (cb1, cb2) {
        $.ajax({
            type: 'GET',
            url: Interface.url + "action/getUserInfo.jsp",
            data: {
                account: Interface.account,
                key: Interface.key
            },
            dataType: 'jsonp',
            success: function (data) {
                if (cb1) {
                    cb1(data);
                }
            },
            error: function (xhr, type) {
                if (cb2) {
                    cb2(xhr, type);
                }
            }
        });
    },
    getUserScore: function (cb1, cb2) {
        $.ajax({
            type: 'GET',
            url: Interface.url + "action/getUserScore.jsp",
            data: {
                account: Interface.account,
                key: Interface.key
            },
            dataType: 'jsonp',
            success: function (data) {
                if (cb1) {
                    cb1(data);
                }
            },
            error: function (xhr, type) {
                if (cb2) {
                    cb2(xhr, type);
                }
            }
        });
    },
    getWinner: function (cb1, cb2) {
        $.ajax({
            type: 'GET',
            url: Interface.url + "action/getLottery.jsp",
            data: {},
            dataType: 'jsonp',
            success: function (data) {
                if (cb1) {
                    cb1(data);
                }
            },
            error: function (xhr, type) {
                if (cb2) {
                    cb2(xhr, type);
                }
            }
        });
    },
    lottery: function (cb1, cb2) {
        $.ajax({
            type: 'GET',
            url: Interface.url + "action/lottery.jsp",
            data: {
                account: Interface.account,
                key: Interface.key
            },
            dataType: 'jsonp',
            success: function (data) {
                if (cb1) {
                    cb1(data);
                }
            },
            error: function (xhr, type) {
                if (cb2) {
                    cb2(xhr, type);
                }
            }
        });
    },
    submitInfo: (function () {
        var o = $("#msReg .ui-alert2");
        return function (info, cb1, cb2) {
            if (info.name.length == 0) {
                o.loading({txt: "请填写收件人", fs: "0.5rem"});
                setTimeout(function () {
                    o.loading();
                }, 1000);
                return;
            }
            if (info.tel.length != 11) {
                o.loading({txt: "请填写联系方式", fs: "0.5rem"});
                setTimeout(function () {
                    o.loading();
                }, 1000);
                return;
            }
            if (info.postCode.length != 6) {
                o.loading({txt: "请填写邮编", fs: "0.5rem"});
                setTimeout(function () {
                    o.loading();
                }, 1000);
                return;
            }
            var addrs = info.addr.split("-");
            if (addrs[0].length == 0 || addrs[1].length == 0 || addrs[2].length == 0 || addrs[3].length == 0) {
                o.loading({txt: "请填写地址", fs: "0.5rem"});
                setTimeout(function () {
                    o.loading();
                }, 1000);
                return;
            }
            $.ajax({
                type: 'GET',
                url: Interface.url + "action/submitInfo.jsp",
                data: {
                    account: Interface.account,
                    key: Interface.key,
                    realName: info.name,
                    phone: info.tel,
                    postCode: info.postCode,
                    addr: info.addr
                },
                dataType: 'jsonp',
                success: function (data) {
                    if (cb1) {
                        cb1(data);
                    }
                },
                error: function (xhr, type) {
                    if (cb2) {
                        cb2(xhr, type);
                    }
                }
            });
        }
    })()
}
module.exports = Interface;