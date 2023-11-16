"use strict";
class Lib {
  /**
   * html字串 轉 dom物件
   * @param html 
   * @returns 
   */
  static newDom(html) {
    var template = document.createElement("template");
    template.innerHTML = html.trim();
    return template.content.firstChild;
  }
  /**
   * 等待
   * @param ms 毫秒
   */
  static async sleep(ms) {
    await new Promise((resolve, reject) => {
      setTimeout(function() {
        resolve(0);
      }, ms);
    });
  }
  /**
   * 轉 number
   */
  static toNumber(t) {
    if (typeof t === "number") {
      return t;
    }
    if (typeof t === "string") {
      return Number(t.replace("px", ""));
    }
    return 0;
  }
  /**
   * 防抖 (持續接收到指令時不會執行，停止接收指令後的x毫秒，才會執行)
   */
  static debounce(func, delay = 250) {
    let timer = null;
    return function(...args) {
      let context = this;
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        func.apply(context, args);
      }, delay);
    };
  }
}
class Throttle {
  constructor(_timeout = 50) {
    this.run = async () => {
    };
    this.timeout = 50;
    this.timeout = _timeout;
    this.timer();
  }
  async timer() {
    let _func = this.run;
    this.run = async () => {
    };
    await _func();
    setTimeout(() => {
      this.timer();
    }, this.timeout);
  }
}
