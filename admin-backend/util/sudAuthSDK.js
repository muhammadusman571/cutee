const jwt = require("jsonwebtoken");

class SudMGPAuthSDK {
  constructor(appId, appSecret) {
    this.appId = appId;
    this.appSecret = appSecret;
  }

  generateSsToken(uid, expireDuration = 7 * 24 * 60 * 60) {
    const exp = Math.floor(Date.now() / 1000) + expireDuration;
    const payload = { uid, app_id: this.appId, exp };
    const token = jwt.sign(payload, this.appSecret);
    const expireDate = exp * 1000;

    return {
      token,
      expireDate,
      expireDateStr: expireDate.toString(),
    };
  }

  verifySsToken(ssToken) {
    try {
      const decoded = jwt.verify(ssToken, this.appSecret);
      return { isSuccess: true, uid: decoded.uid, errorCode: 0 };
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return { isSuccess: false, errorCode: 1005 };
      }
      return { isSuccess: false, errorCode: 1002 };
    }
  }

  generateCode(uid, expireDuration = 2 * 60 * 60) {
    const exp = Math.floor(Date.now() / 1000) + expireDuration;
    return jwt.sign({ uid, app_id: this.appId, exp }, this.appSecret);
  }

  verifyCode(code) {
    try {
      const decoded = jwt.verify(code, this.appSecret);
      return { isSuccess: true, uid: decoded.uid, errorCode: 0 };
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return { isSuccess: false, errorCode: 1005 };
      }
      return { isSuccess: false, errorCode: 1002 };
    }
  }
}

module.exports = SudMGPAuthSDK;
