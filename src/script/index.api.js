//api
var $ = require("./jquery.min.js");
var lbs = require("./nz.lbs.js");
var Api = {
    /*
     * 获取矩形4个角的顺时针位置
     * param {number} [slen] 边长
     */
    getRectCorners: (function () {
        var a = [];
        return function (slen) {
            if (!a[slen]) {
                a[slen] = [0, slen - 1, Math.pow(slen, 2) - 1, Math.pow(slen, 2) - slen];
            }
            return a[slen];
        }
    })(),
    /*
     * 获取矩形第x条边第n个点的序号(顺时针)
     * @param {number} [x] 第n条边
     * @param {number} [x2] 第n个点
     * @param {number} [slen] 边长
     */
    getRectPoint: (function () {
        var a = [];
        return function (x, x2, slen) {
            switch (x) {
                case 0:
                    return Api.getRectCorners(slen)[x] + x2;
                    break;
                case 1:
                    return Api.getRectCorners(slen)[x] + x2 * slen;
                    break;
                case 2:
                    return Api.getRectCorners(slen)[x] - x2;
                    break;
                case 3:
                    return Api.getRectCorners(slen)[x] - x2 * slen;
                    break;
                default:
                    return -1;
            }
        }
    })(),
    getPr: function () {
        var df = document.createDocumentFragment(), df_e1;
        df_e1 = document.createElement("option");
        df_e1.appendChild(document.createTextNode("请选择"));
        df.appendChild(df_e1);
        for (var pt in lbs[0]) {
            df_e1 = document.createElement("option");
            df_e1.appendChild(document.createTextNode(lbs[0][pt]));
            df.appendChild(df_e1);
        }
        return df.childNodes.length == 1 ? document.createDocumentFragment() : df;
    },
    getPrPtByPrName: function (name) {
        for (var pt in lbs[0]) {
            if (lbs[0][pt] == name) {
                return pt;
            }
        }
    },
    getCity: function (prName) {
        var prpt = Api.getPrPtByPrName(prName);
        if (!prpt) {
            return document.createDocumentFragment();
        }
        var df = document.createDocumentFragment(), df_e1;
        df_e1 = document.createElement("option");
        df_e1.appendChild(document.createTextNode("请选择"));
        df.appendChild(df_e1);
        for (var pt in lbs[1]) {
            if (pt == prpt) {
                for (var i = 0; i < lbs[1][pt].length; i++) {
                    df_e1 = document.createElement("option");
                    df_e1.appendChild(document.createTextNode(lbs[1][pt][i][0]));
                    df.appendChild(df_e1);
                }
            }
        }
        return df.childNodes.length == 1 ? document.createDocumentFragment() : df;
    },
    getCityPtByCityName: function (name) {
        for (var pt in lbs[1]) {
            for (var i = 0; i < lbs[1][pt].length; i++) {

                if (lbs[1][pt][i][0] == name) {
                    return lbs[1][pt][i][1];
                }
            }
        }
    },
    getDist: function (cityName) {
        var citypt = Api.getCityPtByCityName(cityName);
        if (!citypt) {
            return document.createDocumentFragment();
        }
        var df = document.createDocumentFragment(), df_e1;
        df_e1 = document.createElement("option");
        df_e1.appendChild(document.createTextNode("请选择"));
        df.appendChild(df_e1);
        for (var pt in lbs[2]) {
            if (pt == citypt) {
                for (var i2 = 0; i2 < lbs[2][pt].length; i2++) {
                    df_e1 = document.createElement("option");
                    df_e1.appendChild(document.createTextNode(lbs[2][pt][i2][0]));
                    df.appendChild(df_e1);
                }
            }
        }
        return df.childNodes.length == 1 ? document.createDocumentFragment() : df;
    },
    getSeq: (function () {
        var a = [];
        return function (slen) {
            if (!a[slen]) {
                a[slen] = [];
                for (var i = 0; i < 4; i++) {
                    a[slen].push(Api.getRectCorners(slen)[i]);
                    for (var j = 1; j < slen - 1; j++) {
                        a[slen].push(Api.getRectPoint(i, j, slen));
                    }
                }
            }
            return a[slen];
        }
    })(),
    getPrz: (function () {
        var o, a, l;
        return function (x) {
            if (!a) {
                o = document.querySelectorAll(".panel-game li>*");
                a = [];
                l = Math.sqrt(o.length);
                for (var i = 0; i < Api.getSeq(l).length; i++) {
                    a.push(o[Api.getSeq(l)[i]]);
                }
            }
            return x != undefined ? a[x] : a;
        }
    })(),
    selPrz: (function () {
        var i = 0;
        return function (idx) {
            if (idx != undefined && idx != i) {
                Api.getPrz(i).classList.remove("active");
                i = idx;
                Api.getPrz(i).classList.add("active");
            }
            return i;
        }
    })(),
    createPrz: function (db) {
        //<span class="cvc">
        //<img style="width: 1.6rem;height: 1.2rem;" src="upload/p1.png"/>
        //<b>￥<b>3元</b></b>
        //</span>
        var e1 = document.createElement("span"),
            e2 = document.createElement("img"),
            e3 = document.createElement("b"),
            e3_txt1 = document.createTextNode(db.type != 1 ? "￥" : ""),
            e4 = document.createElement("b"),
            e4_txt1 = db.type != 1 ? document.createTextNode(db.price + "元") : document.createTextNode(db.name);
        e1.classList.add("cvc");
        e2.src = db.imgUrl;
        e4.appendChild(e4_txt1);
        e3.appendChild(e3_txt1);
        e3.appendChild(e4);
        e1.appendChild(e2);
        e1.appendChild(e3);
        return e1;
    },
    setMsPrz: (function () {
        var $pto = $("#msPrize .bg-alert2-5-1 img"),
            $tit = $("#msPrize .bg-alert2-5-1 p"),
            $price = $("#msPrize .pay .num"),
            $txt = $("#msPrize .ctx p"),
            $btn = $("#msPrize .ui-btn-sty1 b");
        return function (przConfig) {
            $pto.attr("src", przConfig.imgUrl);
            $tit.text(przConfig.name);
            switch (przConfig.type) {
                case 1:
                    //积分
                    $price.parent().hide();
                    $txt.html("恭喜你抽中" + przConfig.name + "，\<br/\>奖励积分已发放到你账户请注意查收。");
                    $btn.text("再来一次");
                    break;
                case 2:
                    //实物
                    $price.text(przConfig.price).parent().show();
                    $txt.html("人品大爆发呀~~\<br/\>恭喜你抽中" + przConfig.name + "，\<br/\>赶紧认领抱回家吧！");
                    $btn.text("立即认领");
                    break;
                case 3:
                    //流量
                    $price.parent().hide();
                    $txt.html("恭喜你抽中" + przConfig.name + "，\<br/\>流量将在1-3个工作日发放到你账户请注意查收。");
                    $btn.text("再来一次");
                    break;
                default:
            }
        }
    })(),
    setWinners: (function () {
        var $tb = $(".panel-winners tbody");

        function cutString(str, len, suffix) {
            if (!str) return "";
            if (len <= 0) return "";
            if (!suffix) suffix = "";
            var templen = 0;
            for (var i = 0; i < str.length; i++) {
                if (str.charCodeAt(i) > 255) {
                    templen += 2;
                } else {
                    templen++
                }
                if (templen == len) {
                    return str.substring(0, i + 1) + suffix;
                } else if (templen > len) {
                    return str.substring(0, i) + suffix;
                }
            }
            return str;
        }

        return function (db) {
            if (db.length == 0) {
                return;
            }
            $tb.children().remove();
            var df = document.createDocumentFragment();
            for (var i = 0; i < db.length; i += 2) {
                df.appendChild(document.createElement("tr"));
                df.childNodes[df.childNodes.length - 1].appendChild(document.createElement("td"));
                df.childNodes[df.childNodes.length - 1].appendChild(document.createElement("td"));
                df.childNodes[df.childNodes.length - 1].appendChild(document.createElement("td"));
                df.childNodes[df.childNodes.length - 1].appendChild(document.createElement("td"));
                df.childNodes[df.childNodes.length - 1].childNodes[0].appendChild(document.createTextNode(db[i].account.substr(0, 3) + "***" + db[i].account.substr(db[i].account.length - 2, 2)));
                df.childNodes[df.childNodes.length - 1].childNodes[1].appendChild(document.createTextNode(cutString(db[i].awardName, 18, "")));
                if (i <= db.length - 2) {
                    df.childNodes[df.childNodes.length - 1].childNodes[2].appendChild(document.createTextNode(db[i + 1].account.substr(0, 3) + "***" + db[i + 1].account.substr(db[i + 1].account.length - 2, 2)));
                    df.childNodes[df.childNodes.length - 1].childNodes[3].appendChild(document.createTextNode(cutString(db[i + 1].awardName, 18, "")));
                }
            }
            $tb.append(df);
        }
    })()
};
module.exports = Api;
