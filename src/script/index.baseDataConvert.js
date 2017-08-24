//接口数据转换
var BaseDataConvert = {
    toUserInfo: function (db) {
        this.postcode = db.postcode;
        this.name = db.name;
        this.phone = db.phone;
        this.addr = db.addr;
        return true;
    },
    toUserScore: function (db) {
        this.integral = db.score;
        return true;
    },
    toAwardConfig: function (db) {
        this.length = 0;
        for (var i = 0; i < db.length; i++) {
            this.push({
                type: db[i].awardType,
                imgUrl: db[i].picUrl,
                price: db[i].prize,
                name: db[i].awardName,
                id: db[i].configId
            });
        }
        return true;
    }
}
module.exports = BaseDataConvert;