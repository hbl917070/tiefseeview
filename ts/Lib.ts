class Lib {

    /**
     * html字串 轉 dom物件
     * @param html 
     * @returns 
     */
    public static newDom(html: string): HTMLElement {
        var template = document.createElement("template");
        template.innerHTML = html.trim();
        return <HTMLElement>template.content.firstChild;
    }

    /**
     * 等待
     * @param ms 毫秒
     */
    public static async sleep(ms: number) {
        await new Promise((resolve, reject) => {
            setTimeout(function () {
                resolve(0); //繼續往下執行
            }, ms);
        })
    }

    /**
     * 轉 number
     */
    public static toNumber(t: string | number): number {
        if (typeof (t) === "number") { return t } //如果本來就是數字，直接回傳     
        if (typeof t === "string") { return Number(t.replace("px", "")); } //如果是string，去掉px後轉型成數字
        return 0;
    }

    /**
     * 防抖 (持續接收到指令時不會執行，停止接收指令後的x毫秒，才會執行)
     */
    public static debounce(func: (...args: any[]) => void, delay = 250) {
        let timer: ReturnType<typeof setTimeout> | null = null;

        return function (this: any, ...args: any[]) {
            let context = this;

            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(() => {
                func.apply(context, args);
            }, delay);
        }
    }

}


/**
 * 節流 (定時執行，時間內重複執行，則只會執行最後一個指令)
 */
class Throttle {
    public run = async () => { };
    public timeout = 50;

    constructor(_timeout = 50) {
        this.timeout = _timeout;
        this.timer();
    }

    private async timer() {
        let _func = this.run;
        this.run = async () => { };
        await _func();
        setTimeout(() => {
            this.timer(); //遞迴
        }, this.timeout);
    }
}
