/**
 * Created by nonzar on 16/3/16.
 */
require("../style/reset.css");
require("../style/common.css");
require("../style/ui.css");
require("../style/global.css");
require("./common.js");
var $ = require("./jquery.min.js"),
    Nzdelay = require("./nz.delay.js"),
    Nzmask = require("./nz.mask.js"),
    Nzgame = require("./index.game.js"),
    Api = require("./index.api.js"),
    Interface = require("./index.interface.js"),
    BaseDataConvert = require("./index.baseDataConvert.js");
//Interface = require("./index.test-interface.js");//测试文件
/*
 * 加载提示
 * @param {object} [options] 参数
 * @param {string} [options.txt] 显示的信息
 * @param {int} [options.fs] 字体大小
 */
$.fn.loading = function (options) {
    var $ms = this.find(">.ui-smask");
    if (!options) {
        $ms.remove();
        return;
    }
    options = options || {};
    if ($ms.length == 0) {
        $ms = document.createElement("div");
        $ms.classList.add("ui-smask");
        $ms = $($ms);
    }
    $ms.text(options.txt || "处理中,请稍后...").css("font-size", options.fs || "initial");
    this.append($ms[0]);
}
/* ----------------------------------------业务代码---------------------------------------- */
//禁止操作
$(".panel-game").loading({txt: "资源加载中,请稍后...", fs: "0.5rem"});
$(".panel-winners .bd").loading({txt: "获取中,请稍后...", fs: "0.3rem"});
//数据定义
var User = {
        account: Interface.accout = window.__a__ && window.__a__.getAccount(),
        key: Interface.key = window.__a__ && window.__a__.getUserKey(),
        postcode: null,
        name: null,
        phone: null,
        addr: null,
        lastPrz: null,
        integral: -1,
        canPlay: false
    },
    PrzConfigs = [],
    Res = {
        userInfo: false,
        przConfigs: false
    },
    Mask = new Nzmask(),
    Game = new Nzgame();
window.alert = (function () {
    var otit = document.querySelector("#msAlert .imp"),
        otxt = document.querySelector("#msAlert .ui-alert2-bd :last-child"),
        obtit = document.querySelector("#msAlert .ui-alert2-ft"),
        ob_cb = null;
    obtit.onclick = function () {
        if (typeof(ob_cb) == "function") {
            ob_cb();
        }
        Mask.hide();
    }
    return function (tit, txt, btit, cb) {
        otit.innerHTML = tit;
        otxt.innerHTML = txt;
        obtit.innerHTML = btit;
        ob_cb = cb;
        Mask.show("msAlert");
    }
})();
//数据读取:用户信息&积分&奖品配置&获奖用户
Interface.getUserInfo(function (data) {
    switch (data.code) {
        case "1":
            Res.userInfo = BaseDataConvert.toUserInfo.call(User, data);
            $("#msReg input[name='name']").val(User.name);
            $("#msReg input[name='tel']").val(User.phone);
            $("#msReg input[name='postCode']").val(User.postcode);
            $("#msReg input[name='addr']").val(User.addr.split("-")[3]);
            break;
        default:
            window.alert("注意", data.msg, "跳转任务页", function () {
                if (window.__a__ && window.__a__.test) {
                    window.__a__.toTSKA();
                }
            });
    }
}, function () {
    //faild
    window.alert("注意", "网络不稳定", "刷新", function () {
        window.location.reload(true);
    });
});
Interface.getAwardConfig(function (data) {
    switch (data.code) {
        case "1":
            Res.przConfigs = BaseDataConvert.toAwardConfig.call(PrzConfigs, data.configs);
            var o = $(".panel-game .ui-prize > div");
            for (var i = 0; i < PrzConfigs.length; i++) {
                Api.getPrz(i).querySelector("div").appendChild(Api.createPrz(PrzConfigs[i]));
            }
            break;
        default:
            window.alert("注意", data.msg, "跳转任务页", function () {
                if (window.__a__ && window.__a__.test) {
                    window.__a__.toTSKA();
                }
            });
    }
}, function () {
    //faild
    window.alert("注意", "网络不稳定", "刷新", function () {
        window.location.reload(true);
    });
});
Interface.getWinner(function (data) {
    Api.setWinners(data.lotterys);
    $(".panel-winners .bd").loading();
    var timer = setInterval(function () {
        Interface.getWinner(function (data) {
            Api.setWinners(data.lotterys);
        }, function () {
            //faild
            clearInterval(timer);
        });
    }, 5000);
}, function () {
    //faild
});
//事件绑定
$(".nzmask .btnClose,#msText .ui-btn-sty1,#msRegSucc .ui-btn-sty1").click(function () {
    Mask.hide();
});
$("#msUnintg .ui-alert2-ft").click(function () {
    if (window.__a__ && window.__a__.test) {
        window.__a__.toTSKA();
    }
});
$(".banner :nth-child(1)").click(function () {
    Mask.show("msText");
});
$("#msPrize .ui-btn-sty1").click(function () {
    switch (User.lastPrz.type) {
        case 1:
            Mask.hide();
            break;
        case 2:
            document.querySelector("#msReg select[name='pr']").value = User.addr.split("-")[0];
            $("#msReg select[name='pr']").change();
            document.querySelector("#msReg select[name='city']").value = User.addr.split("-")[1];
            $("#msReg select[name='city']").change();
            document.querySelector("#msReg select[name='dist']").value = User.addr.split("-")[2];
            Mask.show("msReg");
            break;
        default:
            Mask.hide();
    }
});
$("#msReg .ui-btn-sty1").click((function () {
    var $bd = $("#msReg .ui-alert2"),
        $name = $("#msReg input[name='name']"),
        $tel = $("#msReg input[name='tel']"),
        $postCode = $("#msReg input[name='postCode']"),
        $addr_pr = $("#msReg select[name='pr']"),
        $addr_city = $("#msReg select[name='city']"),
        $addr_dist = $("#msReg select[name='dist']"),
        $addr_more = $("#msReg input[name='addr']");
    return function () {
        $("#msReg .ui-alert2").loading({txt: "信息提交中,请稍等.", fs: "0.5rem"});
        Interface.submitInfo({
            name: $name.val(),
            tel: $tel.val(),
            postCode: $postCode.val(),
            addr: (($addr_pr.val() == null || $addr_pr.val() == "请选择") ? "" : $addr_pr.val()) + "-" +
            (($addr_city.val() == null || $addr_city.val() == "请选择") ? "" : $addr_city.val()) + "-" +
            (($addr_dist.val() == null || $addr_dist.val() == "请选择") ? "" : $addr_dist.val()) + "-" +
            $addr_more.val()
        }, function (data) {
            switch (data.code) {
                case "1":
                    Mask.show("msRegSucc");
                    $("#msReg .ui-alert2").loading();
                    break;
                default:
                    window.alert("注意", data.msg, "跳转任务页", function () {
                        if (window.__a__ && window.__a__.test) {
                            window.__a__.toTSKA();
                        }
                    });
                    $("#msReg .ui-alert2").loading();
            }
        }, function () {
            //faild
            window.alert("注意", "网络不稳定", "刷新", function () {
                window.location.reload(true);
            });
        });
    }
})());
$("#msReg select[name='pr']").append(Api.getPr()).change(function (e) {
    $("#msReg select[name='city']").hide().children().remove();
    $("#msReg select[name='dist']").hide().children().remove();
    if (this.selectedIndex == 0) {
        return;
    }
    var df = Api.getCity(this.value);
    if (df.childNodes.length > 1) {
        $("#msReg select[name='city']").append(df).show();
    } else {
        $("#msReg select[name='city']").hide();
    }
});
$("#msReg select[name='city']").change(function () {
    $("#msReg select[name='dist']").children().remove();
    if (this.selectedIndex == 0) {
        return;
    }
    var df = Api.getDist(this.value);
    if (df.childNodes.length > 1) {
        $("#msReg select[name='dist']").append(df).show();
    } else {
        $("#msReg select[name='dist']").hide();
    }
});

$(".panel-game .ui-lottery").click(function () {
    if (!User.canPlay) {
        return;
    }
    User.canPlay = false;
    Game.pause = true;
    Game.play((function () {
        var t = 0, mins = 2;
        return function () {
            Api.selPrz(Api.selPrz() >= Api.getPrz().length - 1 ? 0 : (Api.selPrz() + 1));
            this.speed = this.speed <= mins ? mins : (this.speed - 0.1 * t++);
        }
    })(), 10);
    Interface.lottery(function (data) {
        switch (data.code) {
            case "1":
                User.lastPrz = null;
                for (var i = 0; i < PrzConfigs.length; i++) {
                    if (PrzConfigs[i].id == data.configId) {
                        User.lastPrz = PrzConfigs[i];
                        break;
                    }
                }
                if (User.lastPrz || i >= Api.getPrz().length) {
                    Nzdelay.w(2000).r(function () {
                        Game.pause = true;
                        Game.play((function () {
                            var t = 0, maxs = 25;
                            return function () {
                                this.speed = this.speed >= maxs ? maxs : (this.speed + 0.1 * t++);
                                if (i == Api.selPrz(Api.selPrz() >= Api.getPrz().length - 1 ? 0 : (Api.selPrz() + 1)) && this.speed >= maxs) {
                                    Game.over();
                                    Nzdelay.w(500).r(function () {
                                        Api.setMsPrz(User.lastPrz);
                                        Mask.show("msPrize");
                                    }).w(500).r(function () {
                                        User.canPlay = true;
                                    });
                                }
                            }
                        })(), Game.speed);
                    });
                } else {
                    Game.over();
                    User.canPlay = true;
                    alert("不存在此奖品");
                }
                break;
            case "-2":
                Mask.show("msUnintg");
                Game.over();
                User.canPlay = true;
                break;
            default:
                Game.over();
                User.canPlay = true;
                window.alert("注意", data.msg, "跳转任务页", function () {
                    if (window.__a__ && window.__a__.test) {
                        window.__a__.toTSKA();
                    }
                });
        }
    },function(){
        window.alert("注意", "网络不稳定", "刷新", function () {
            window.location.reload(true);
        });
    });
});
//数据载入检查
window.requestAnimationFrame((function () {
    var fn = function () {
        if (Res.userInfo && Res.przConfigs) {
            $(".panel-game").loading();
            User.canPlay = true;
        } else {
            window.requestAnimationFrame(fn);
        }
    }
    return function () {
        fn.call(fn);
    }
})());