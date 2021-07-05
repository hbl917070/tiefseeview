"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Tieefseeview {
    constructor(_dom) {
        _dom.innerHTML = `     
            <div class="tiefseeview-loading" ></div>   
            <div class="tiefseeview-container">
                <div class="tiefseeview-data" style="width:400px;">
                    <img class="view-img" style="display:none">
                </div>
            </div>
            <div class="scroll-y">
                <div class="scroll-bg"></div>
                <div class="scroll-box"></div>
            </div>
            <div class="scroll-x">
                <div class="scroll-bg"></div>
                <div class="scroll-box"></div>
            </div>`;
        var dom_tiefseeview = _dom;
        var dom_con = dom_tiefseeview.querySelector('.tiefseeview-container');
        var dom_data = dom_tiefseeview.querySelector('.tiefseeview-data');
        var dom_img = dom_tiefseeview.querySelector('.view-img');
        var dom_loading = dom_tiefseeview.querySelector('.tiefseeview-loading');
        var scrollX = new TieefseeviewScroll(dom_tiefseeview.querySelector('.scroll-x'), 'x'); //水平捲動軸
        var scrollY = new TieefseeviewScroll(dom_tiefseeview.querySelector('.scroll-y'), 'y'); //垂直捲動軸
        var dataType = 'img'; //資料類型
        var degNow = 0; //目前的角度 0~359
        var zoomRatio = 1.1; //縮放比率(必須大於1)
        var transformDuration = 200; //transform 動畫時間
        var mirrorHorizontal = false; //水平鏡像
        var mirrorVertical = false; //垂直鏡像
        var rendering = TieefseeviewImageRendering["auto"]; //圖片渲染模式
        var overflowDistance = 30; //溢位距離
        var marginTop = 10; //外距
        var marginLeft = 10;
        var marginBottom = 10;
        var marginRight = 10;
        var loadingUrl = 'img/loading.svg';
        var errerUrl = 'img/error.svg';
        var rotateCriticalValue = 15; //觸控旋轉的最低旋轉角度
        var hammerPan = new Hammer(dom_tiefseeview); //單指拖曳
        var panStartX = 0; //開始拖曳的坐標
        var panStartY = 0;
        var isMoving = false; //目前是否正在拖曳圖片
        var isPaning = false; //目前是否正在拖曳圖片
        var hammerPlural = new Hammer.Manager(dom_tiefseeview); //用於雙指旋轉與縮放
        var temp_rotateStareDegValue = 0; //雙指旋轉，初始角度
        var temp_touchRotateStarting = false; //觸控旋轉 開始
        var temp_rotateStareDegNow = 0; //觸控旋轉的起始角度
        var temp_pinchZoom = 1; //雙指捏合縮放的上一個值
        var temp_pinchCenterX = 0;
        var temp_pinchCenterY = 0;
        //滑鼠滾輪做的事情
        var eventMouseWheel = (_type, offsetX, offsetY) => {
            if (_type === 'up') {
                zoomIn(offsetX, offsetY);
            }
            else {
                zoomOut(offsetX, offsetY);
            }
        };
        var eventChangeZoom = (ratio) => { };
        var eventChangeDeg = (deg) => { };
        var eventChangeMirror = (isMirrorHorizontal, isMirrorVertica) => { };
        var eventChangeXY = (x, y) => { };
        var eventLimitMax = () => { return _eventLimitMax(); }; //超出縮放上限，return true表示超過限制    
        var eventLimitMin = () => { return _eventLimitMin(); }; //超出縮放下限，return true表示超過限制
        var pinch = new Hammer.Pinch();
        var rotate = new Hammer.Rotate();
        rotate.recognizeWith(pinch); // we want to detect both the same time
        hammerPlural.add([pinch, rotate]); // add to the Manager
        this.dom_tiefseeview = dom_tiefseeview;
        this.dom_con = dom_con;
        this.dom_data = dom_data;
        this.dom_img = dom_img;
        this.scrollX = scrollX;
        this.scrollY = scrollY;
        this.getRendering = getRendering;
        this.setRendering = setRendering;
        this.getIsOverflowX = getIsOverflowX;
        this.getIsOverflowY = getIsOverflowY;
        this.zoomFull = zoomFull;
        this.getDeg = getDeg;
        this.setDeg = setDeg;
        this.setDegForward = setDegForward;
        this.setDegReverse = setDegReverse;
        this.getMirrorHorizontal = getMirrorHorizontal;
        this.setMirrorHorizontal = setMirrorHorizontal;
        this.getMirrorVertica = getMirrorVertica;
        this.setMirrorVertica = setMirrorVertica;
        this.transformRefresh = transformRefresh;
        this.setAlign = setAlign;
        this.zoomOut = zoomOut;
        this.zoomIn = zoomIn;
        this.setEventMouseWheel = setEventMouseWheel;
        this.getEventMouseWheel = getEventMouseWheel;
        this.getEventLimitMax = getEventLimitMax;
        this.setEventLimitMax = setEventLimitMax;
        this.getEventLimitMin = getEventLimitMin;
        this.setEventLimitMin = setEventLimitMin;
        this.loadImg = loadImg;
        this.setEventChangeZoom = setEventChangeZoom;
        this.getEventChangeZoom = getEventChangeZoom;
        this.setEventChangeDeg = setEventChangeDeg;
        this.getEventChangeDeg = getEventChangeDeg;
        this.setEventChangeMirror = setEventChangeMirror;
        this.getEventChangeMirror = getEventChangeMirror;
        this.setEventChangeXY = setEventChangeXY;
        this.getEventChangeXY = getEventChangeXY;
        this.getOriginalWidth = getOriginalWidth;
        this.getOriginalHeight = getOriginalHeight;
        this.setMargin = setMargin;
        this.getMargin = getMargin;
        this.getOverflowDistance = getOverflowDistance;
        this.setOverflowDistance = setOverflowDistance;
        this.getLoadingUrl = getLoadingUrl;
        this.setLoadingUrl = setLoadingUrl;
        this.getErrerUrl = getErrerUrl;
        this.setErrerUrl = setErrerUrl;
        setLoadingUrl(loadingUrl); //初始化 loading 圖片
        setLoading(false); //預設為隱藏
        $(dom_tiefseeview).addClass("tiefseeview");
        setTransform(undefined, undefined, false); //初始化定位
        //顯示圖片的區塊改變大小時
        new ResizeObserver(() => {
            init_point(false); //重新定位圖片
            eventChangeZoom(getZoomRatio());
        }).observe(dom_tiefseeview);
        //捲動軸變化時，同步至圖片位置
        scrollY.setEventChange((v, mode) => {
            if (mode === 'set') {
                return;
            }
            v = v * -1 + marginTop;
            setXY(undefined, v, 0);
        });
        scrollX.setEventChange((v, mode) => {
            if (mode === 'set') {
                return;
            }
            v = v * -1 + marginLeft;
            setXY(v, undefined, 0);
        });
        //雙指旋轉  
        hammerPlural.on('rotatestart', (ev) => {
            temp_rotateStareDegNow = degNow;
            temp_rotateStareDegValue = ev.rotation - degNow;
            temp_touchRotateStarting = false;
        });
        hammerPlural.on('rotate', (ev) => __awaiter(this, void 0, void 0, function* () {
            let _deg = (ev.rotation - temp_rotateStareDegValue); //取得旋轉角度
            if (temp_touchRotateStarting === false) {
                if (Math.abs(temp_rotateStareDegNow - Math.abs(_deg)) > rotateCriticalValue) { //旋轉超過特定角度，才會開始執行旋轉
                    temp_rotateStareDegValue -= (temp_rotateStareDegNow - _deg);
                    _deg += (temp_rotateStareDegNow - _deg);
                    temp_touchRotateStarting = true;
                }
            }
            if (temp_touchRotateStarting) {
                setDeg(_deg, ev.center.x, ev.center.y, false); //無動畫旋轉
            }
        }));
        hammerPlural.on('rotateend', (ev) => {
            temp_touchRotateStarting = false;
            let r = degNow % 90; //如果不足90度
            if (r === 0) {
                return;
            }
            if (r > 45 || (r < 0 && r > -45)) {
                setDegForward(ev.center.x, ev.center.y, true); //順時針旋轉
            }
            else {
                setDegReverse(ev.center.x, ev.center.y, true); //逆時針旋轉
            }
        });
        //雙指捏合縮放
        hammerPlural.on('pinchstart', (ev) => {
            temp_pinchZoom = 1;
            temp_pinchCenterX = ev.center.x;
            temp_pinchCenterY = ev.center.y;
        });
        hammerPlural.on('pinch', (ev) => {
            //從兩指的中心進行縮放
            //縮放前先把渲染模式改成成本較低的 pixelated
            zoomIn(ev.center.x, ev.center.y, (ev.scale / temp_pinchZoom), TieefseeviewImageRendering['pixelated']);
            //根據中心點的位移來拖曳圖片
            setXY(toInt(dom_con.style.left) - (temp_pinchCenterX - ev.center.x), toInt(dom_con.style.top) - (temp_pinchCenterY - ev.center.y), 0);
            temp_pinchZoom = ev.scale;
            temp_pinchCenterX = ev.center.x;
            temp_pinchCenterY = ev.center.y;
        });
        hammerPlural.on('pinchend', (ev) => {
            setRendering(rendering); //縮放結束後，把渲染模式改回原本的縮放模式
        });
        //滑鼠滾輪上下滾動時
        dom_tiefseeview.addEventListener("wheel", (e) => {
            e.preventDefault(); //禁止頁面滾動
            e = e || window.event;
            //避免在捲動軸上面也觸發
            if (e.target !== dom_tiefseeview) {
                return;
            }
            $(dom_con).stop(true, false);
            //縮放計算
            if (e.deltaX < 0 || e.deltaY < 0) { //往上
                eventMouseWheel('up', e.offsetX, e.offsetY);
            }
            else { //往下
                eventMouseWheel('down', e.offsetX, e.offsetY);
            }
        }, true);
        //拖曳開始
        dom_tiefseeview.addEventListener('mousedown', (ev) => {
            ev.preventDefault();
            //避免在捲動軸上面也觸發
            if (ev.target !== dom_tiefseeview) {
                isMoving = false;
                isPaning = false;
                return;
            }
            isMoving = true;
            isPaning = true;
            $(dom_con).stop(true, false);
            panStartX = toInt(dom_con.style.left);
            panStartY = toInt(dom_con.style.top);
        });
        dom_tiefseeview.addEventListener('touchstart', (ev) => {
            ev.preventDefault();
            //避免多指觸發
            if (ev.touches.length > 1) {
                isMoving = false;
                isPaning = false;
                return;
            }
            //避免在捲動軸上面也觸發
            if (ev.target !== dom_tiefseeview) {
                isMoving = false;
                isPaning = false;
                return;
            }
            isMoving = true;
            isPaning = true;
            $(dom_con).stop(true, false);
            panStartX = toInt(dom_con.style.left);
            panStartY = toInt(dom_con.style.top);
        });
        //拖曳
        hammerPan.get('pan').set({ threshold: 0 });
        hammerPan.on('pan', (ev) => {
            //避免多指觸發
            if (ev.maxPointers > 1) {
                isMoving = false;
                isPaning = false;
                return;
            }
            if (isMoving === false) {
                return;
            }
            let deltaX = ev['deltaX'];
            let deltaY = ev['deltaY'];
            let left = panStartX + deltaX * 1;
            let top = panStartY + deltaY * 1;
            if (getIsOverflowY()) { //高度大於視窗
                if (top > marginTop + overflowDistance) { //上
                    top = marginTop + overflowDistance;
                }
                let t = dom_tiefseeview.offsetHeight - dom_con.offsetHeight - marginBottom; //下
                if (top < t - overflowDistance) {
                    top = t - overflowDistance;
                }
            }
            else {
                let t = (dom_tiefseeview.offsetHeight - dom_con.offsetHeight) / 2; //置中的坐標
                if (top > t + overflowDistance) {
                    top = t + overflowDistance;
                }
                if (top < t - overflowDistance) {
                    top = t - overflowDistance;
                }
            }
            if (getIsOverflowX()) { //寬度大於視窗
                if (left > marginLeft + overflowDistance) { //左
                    left = marginLeft + overflowDistance;
                }
                let l = dom_tiefseeview.offsetWidth - dom_con.offsetWidth - marginRight; //右
                if (left < l - overflowDistance) {
                    left = l - overflowDistance;
                }
            }
            else {
                let l = (dom_tiefseeview.offsetWidth - dom_con.offsetWidth) / 2; //置中的坐標
                if (left > l + overflowDistance) {
                    left = l + overflowDistance;
                }
                if (left < l - overflowDistance) {
                    left = l - overflowDistance;
                }
            }
            setXY(left, top, 0);
        });
        //拖曳 結束
        hammerPan.on('panend', (ev) => __awaiter(this, void 0, void 0, function* () {
            //避免在捲動軸上面也觸發
            //if (ev.target !== dom_tiefseeview) { return; }
            //避免多指觸發
            if (ev.maxPointers > 1) {
                return;
            }
            if (isMoving === false) {
                return;
            }
            isMoving = false;
            isPaning = true;
            let velocity = ev['velocity']; //加速度
            let velocityX = ev['velocityX'];
            let velocityY = ev['velocityY'];
            let sp = 150 + 70 * Math.abs(velocity); //動畫時間
            if (sp > 800)
                sp = 800;
            //sp = 400;
            $(dom_con).stop(true, false);
            //速度小於 1 就不使用慣性
            if (Math.abs(velocity) < 1) {
                velocity = 0;
                velocityX = 0;
                velocityY = 0;
                sp = 10;
                init_point(true);
                isPaning = false;
                return;
            }
            let top = toInt(dom_con.style.top) + (velocityY * 150);
            let left = toInt(dom_con.style.left) + (velocityX * 150);
            let bool_overflowX = false;
            let bool_overflowY = false;
            if (getIsOverflowY()) { //高度大於視窗
                if (top > marginTop + overflowDistance) { //上
                    top = marginTop + overflowDistance;
                    bool_overflowX = true;
                }
                let t = dom_tiefseeview.offsetHeight - dom_con.offsetHeight - marginBottom; //下
                if (top < t - overflowDistance) {
                    top = t - overflowDistance;
                    bool_overflowX = true;
                }
            }
            else {
                let t = (dom_tiefseeview.offsetHeight - dom_con.offsetHeight) / 2; //置中的坐標
                if (top > t + overflowDistance) {
                    top = t + overflowDistance;
                    bool_overflowX = true;
                }
                if (top < t - overflowDistance) {
                    top = t - overflowDistance;
                    bool_overflowX = true;
                }
            }
            if (getIsOverflowX()) { //寬度大於視窗
                if (left > marginLeft + overflowDistance) { //左
                    left = marginLeft + overflowDistance;
                    bool_overflowY = true;
                }
                let l = dom_tiefseeview.offsetWidth - dom_con.offsetWidth - marginRight; //右
                if (left < l - overflowDistance) {
                    left = l - overflowDistance;
                    bool_overflowY = true;
                }
            }
            else {
                let l = (dom_tiefseeview.offsetWidth - dom_con.offsetWidth) / 2; //置中的坐標
                if (left > l + overflowDistance) {
                    left = l + overflowDistance;
                    bool_overflowY = true;
                }
                if (left < l - overflowDistance) {
                    left = l - overflowDistance;
                    bool_overflowY = true;
                }
            }
            //計算滑行距離
            let dep = Math.sqrt(Math.pow((toInt(dom_con.style.top) - top), 2) + Math.pow((toInt(dom_con.style.left) - left), 2));
            if ((bool_overflowX || bool_overflowY) && dep < 200) {
                sp = 100;
            }
            yield setXY(left, top, sp);
            isPaning = false;
            init_point(true);
        }));
        /**
         * 載入圖片資源
         * @param _url 網址
         * @returns true=載入完成、false=載入失敗
         */
        function getIsLoaded(_url) {
            return __awaiter(this, void 0, void 0, function* () {
                let img = document.createElement('img');
                img.src = _url;
                let p = yield new Promise((resolve, reject) => {
                    img.addEventListener('load', (e) => {
                        resolve(true); //繼續往下執行
                    });
                    img.addEventListener('error', (e) => {
                        resolve(false); //繼續往下執行
                    });
                });
                img.src = '';
                //@ts-ignore
                img = null;
                return p;
            });
        }
        /**
         * 取得 loading圖片
         * @returns
         */
        function getLoadingUrl() { return loadingUrl; }
        /**
         * 設定 loading圖片
         * @param _url
         */
        function setLoadingUrl(_url) {
            loadingUrl = _url;
            dom_loading.style.backgroundImage = `url("${loadingUrl}")`;
        }
        /**
         * 取得 error圖片
         * @returns
         */
        function getErrerUrl() { return errerUrl; }
        /**
         * 設定 error圖片
         * @param _url
         */
        function setErrerUrl(_url) { errerUrl = _url; }
        /**
         * 載入並顯示圖片
         * @param _url
         * @returns
         */
        function loadImg(_url) {
            return __awaiter(this, void 0, void 0, function* () {
                setLoading(true);
                let p = yield getIsLoaded(_url);
                dom_img.style.display = '';
                setLoading(false);
                if (p === false) {
                    yield getIsLoaded(errerUrl);
                    _url = errerUrl;
                    dom_img.src = _url;
                    return false;
                }
                dom_img.src = _url;
                return true;
            });
        }
        /**
         * 顯示或隱藏 loading
         * @param _b
         */
        function setLoading(_b) {
            if (_b) {
                dom_loading.style.display = 'block';
            }
            else {
                dom_loading.style.display = 'none';
            }
        }
        /**
         * 取得 外距
         * @returns
         */
        function getMargin() {
            return { top: marginTop, right: marginRight, bottom: marginBottom, left: marginLeft };
        }
        /**
         * 設定 外距
         * @param _top
         * @param _right
         * @param _bottom
         * @param _left
         */
        function setMargin(_top, _right, _bottom, _left) {
            marginTop = _top;
            marginLeft = _left;
            marginBottom = _bottom;
            marginRight = _right;
        }
        /**
         * 取得 允許拖曳的溢位距離
         * @returns
         */
        function getOverflowDistance() { return overflowDistance; }
        /**
         * 設定 允許拖曳的溢位距離
         * @param _v
         */
        function setOverflowDistance(_v) { overflowDistance = _v; }
        /**
         * 取得 圖片的渲染模式
         * @returns
         */
        function getRendering() { return rendering; }
        /**
         * 設定 圖片的渲染模式
         * @param _renderin
         * @param isOnlyRun 單純執行而不設定
         */
        function setRendering(_renderin, isOnlyRun = false) {
            if (isOnlyRun === false) {
                rendering = _renderin;
            }
            if (_renderin === TieefseeviewImageRendering["auto"]) {
                dom_data.style.imageRendering = 'auto';
            }
            else if (_renderin === TieefseeviewImageRendering["pixelated"]) {
                dom_data.style.imageRendering = 'pixelated';
            }
            else if (_renderin === TieefseeviewImageRendering["auto-pixelated"]) {
                if (getZoomRatio() > 1) {
                    dom_data.style.imageRendering = 'pixelated';
                }
                else {
                    dom_data.style.imageRendering = 'auto';
                }
            }
        }
        /**
         * 覆寫 圖片或顯示範圍改變的事件
         * @param _func
         */
        function setEventChangeZoom(_func) { eventChangeZoom = _func; }
        /**
         * 取得 圖片或顯示範圍改變的事件
         * @returns
         */
        function getEventChangeZoom() { return eventChangeZoom; }
        /**
         * 覆寫 角度改變的事件
         * @param _func
         */
        function setEventChangeDeg(_func) { eventChangeDeg = _func; }
        /**
         * 取得 角度改變的事件
         * @returns
         */
        function getEventChangeDeg() { return eventChangeDeg; }
        /**
         * 覆寫 鏡像改變的事件
         * @param _func
         */
        function setEventChangeMirror(_func) { eventChangeMirror = _func; }
        /**
         * 取得 鏡像改變的事件
         * @returns
         */
        function getEventChangeMirror() { return eventChangeMirror; }
        /**
         * 覆寫 坐標改變的事件
         * @param _func
         */
        function setEventChangeXY(_func) { eventChangeXY = _func; }
        /**
         * 取得 坐標改變的事件
         * @returns
         */
        function getEventChangeXY() { return eventChangeXY; }
        /**
         * 取得縮放比例。原始1.00
         */
        function getZoomRatio() { return dom_data.offsetWidth / getOriginalWidth(); }
        /**
         * (預設值)超出縮放上限，return true表示超過限制
         * @returns
         */
        function _eventLimitMax() {
            //寬度或高度大於100px的圖片，放大上限為30倍
            if (getOriginalWidth() > 100 || getOriginalHeight() > 100) {
                if (getZoomRatio() > 50) {
                    return true;
                }
            }
            //放大上限為100萬px
            if (dom_data.offsetWidth > 999999 || dom_data.offsetHeight > 999999) {
                return true;
            }
            return false;
        }
        /**
         * (預設值)超出縮放下限，return true表示超過限制
         * @returns
         */
        function _eventLimitMin() {
            //寬度或高度小於10px的圖片，縮小下限為1px
            if (getOriginalWidth() <= 10 || getOriginalHeight() <= 10) {
                if (dom_data.offsetWidth <= 1 || dom_data.offsetHeight <= 1) {
                    return true;
                }
            }
            //縮小下限為10px
            if (dom_data.offsetWidth <= 10 || dom_data.offsetHeight <= 10) {
                return true;
            }
            return false;
        }
        /**
         * 取得 圖片放大上限
         */
        function getEventLimitMax() { return eventLimitMax; }
        /**
         * 覆寫 圖片放大上限
         * @param _func
         */
        function setEventLimitMax(_func) { eventLimitMax = _func; }
        /**
         * 取得 圖片縮小下限
         * @returns
         */
        function getEventLimitMin() { return eventLimitMin; }
        /**
         * 覆寫 圖片縮小下限
         * @param _func
         */
        function setEventLimitMin(_func) { eventLimitMin = _func; }
        /**
         * 設定對齊
         * @param _type
         * @returns
         */
        function setAlign(_type) {
            let type_horizontal = 'center'; //水平對齊方式
            let type_vertical = 'center'; //垂直對齊方式
            let x = 0;
            let y = 0;
            if (_type === TieefseeviewAlignType['none']) {
                return;
            }
            if (_type === TieefseeviewAlignType['T']) {
                type_horizontal = 'center';
                type_vertical = 'top';
            }
            if (_type === TieefseeviewAlignType['R']) {
                type_horizontal = 'right';
                type_vertical = 'center';
            }
            if (_type === TieefseeviewAlignType['L']) {
                type_horizontal = 'left';
                type_vertical = 'center';
            }
            if (_type === TieefseeviewAlignType['B']) {
                type_horizontal = 'center';
                type_vertical = 'bottom';
            }
            if (_type === TieefseeviewAlignType['RT']) {
                type_horizontal = 'right';
                type_vertical = 'top';
            }
            if (_type === TieefseeviewAlignType['RB']) {
                type_horizontal = 'right';
                type_vertical = 'bottom';
            }
            if (_type === TieefseeviewAlignType['LT']) {
                type_horizontal = 'left';
                type_vertical = 'top';
            }
            if (_type === TieefseeviewAlignType['LB']) {
                type_horizontal = 'left';
                type_vertical = 'bottom';
            }
            if (_type === TieefseeviewAlignType['C']) {
                type_horizontal = 'center';
                type_vertical = 'center';
            }
            if (type_horizontal === 'left') {
                x = marginLeft;
            }
            if (type_horizontal === 'center') {
                x = (dom_tiefseeview.offsetWidth - dom_con.offsetWidth) / 2;
            }
            if (type_horizontal === 'right') {
                x = dom_tiefseeview.offsetWidth - dom_con.offsetWidth - marginRight;
            }
            if (type_vertical === 'top') {
                y = marginTop;
            }
            if (type_vertical === 'center') {
                y = (dom_tiefseeview.offsetHeight - dom_con.offsetHeight) / 2;
            }
            if (type_vertical === 'bottom') {
                y = dom_tiefseeview.offsetHeight - dom_con.offsetHeight - marginBottom;
            }
            setXY(x, y, 0);
            init_point(false);
        }
        /**
         * 取得圖片原始寬度
         * @returns
         */
        function getOriginalWidth() {
            if (dataType === 'img') {
                return dom_img.naturalWidth;
            }
            return 1;
        }
        /**
         * 取得圖片原始高度
         * @returns
         */
        function getOriginalHeight() {
            if (dataType === 'img') {
                return dom_img.naturalHeight;
            }
            return 1;
        }
        /**
         * 縮放圖片
         * @param _type 縮放類型
         * @param _val 附加參數，例如以px或%進行縮放時，必須另外傳入number
         */
        function zoomFull(_type, _val) {
            if (_type === undefined) {
                _type = TieefseeviewZoomType["full-wh"];
            }
            if (_val === undefined) {
                _val = 100;
            }
            //取得圖片在原始大小下，旋轉後的實際長寬(避免圖片經縮放後，長寬比例失去精度)
            let rect = getRotateRect(getOriginalWidth(), getOriginalHeight(), 0, 0, degNow);
            let dom_con_offsetWidth = rect.rectWidth;
            let dom_con_offsetHeight = rect.rectHeight;
            if (_type === TieefseeviewZoomType["full-100%"]) {
                if (getOriginalWidth() > (dom_tiefseeview.offsetWidth - marginLeft - marginRight) ||
                    getOriginalHeight() > (dom_tiefseeview.offsetHeight - marginTop - marginBottom)) { //圖片比視窗大時
                    _type = TieefseeviewZoomType["full-wh"]; //縮放至視窗大小
                }
                else {
                    _type = TieefseeviewZoomType["100%"]; //圖片原始大小
                }
            }
            //圖片原始大小
            if (_type === TieefseeviewZoomType["100%"]) {
                dom_data.style.width = getOriginalWidth() + 'px';
            }
            if (_type === TieefseeviewZoomType["full-wh"]) { //縮放至視窗大小
                let ratio_w = dom_con_offsetWidth / (dom_tiefseeview.offsetWidth - marginLeft - marginRight);
                let ratio_h = dom_con_offsetHeight / (dom_tiefseeview.offsetHeight - marginTop - marginBottom);
                if (ratio_w > ratio_h) {
                    _type = TieefseeviewZoomType["full-w"];
                }
                else {
                    _type = TieefseeviewZoomType["full-h"];
                }
            }
            if (_type === TieefseeviewZoomType["full-w"]) { //寬度全滿
                _val = 100;
                _type = TieefseeviewZoomType["%-w"];
            }
            if (_type === TieefseeviewZoomType["full-h"]) { //高度全滿
                _val = 100;
                _type = TieefseeviewZoomType["%-h"];
            }
            if (_type === TieefseeviewZoomType["%-w"]) { //以視窗寬度比例設定
                let w = dom_tiefseeview.offsetWidth - marginLeft - marginRight - 5; //顯示範圍 - 邊距
                if (w < 10) {
                    w = 10;
                }
                let ratio = getOriginalWidth() / dom_con_offsetWidth;
                dom_data.style.width = w * ratio * (_val / 100) + 'px';
            }
            if (_type === TieefseeviewZoomType["%-h"]) { //以視窗高度比例設定
                let w = dom_tiefseeview.offsetHeight - marginTop - marginBottom - 5; //顯示範圍 - 邊距
                if (w < 10) {
                    w = 10;
                }
                let ratio = getOriginalWidth() / dom_con_offsetWidth; //旋轉後的比例
                let ratio_xy = dom_con_offsetWidth / dom_con_offsetHeight; //旋轉後圖片長寬的比例
                dom_data.style.width = (w * ratio * ratio_xy * (_val / 100)) + 'px';
            }
            if (_type === TieefseeviewZoomType["px-w"]) { //以絕對寬度設定
                let ratio = getOriginalWidth() / dom_con_offsetWidth;
                dom_data.style.width = toInt(_val) * ratio + 'px';
            }
            if (_type === TieefseeviewZoomType["px-h"]) { //以絕對高度設定
                let ratio = getOriginalWidth() / dom_con_offsetWidth; //旋轉後的比例
                let ratio_xy = dom_con_offsetWidth / dom_con_offsetHeight; //旋轉後圖片長寬的比例
                dom_data.style.width = (toInt(_val) * ratio * ratio_xy) + 'px';
            }
            init_point(false);
            eventChangeZoom(getZoomRatio());
            setRendering(rendering);
        }
        /**
         * 放大
         * @param _x
         * @param _y
         * @param 渲染模式 (僅套用css，不會覆寫設定
         */
        function zoomIn(_x, _y, _zoomRatio, _rendering) {
            //未填入參數則從中央進行縮放
            if (_x === undefined) {
                _x = dom_tiefseeview.offsetWidth / 2;
            }
            if (_y === undefined) {
                _y = dom_tiefseeview.offsetHeight / 2;
            }
            //未填入縮放比例，就是用預設縮放比例
            if (_zoomRatio === undefined) {
                _zoomRatio = zoomRatio;
            }
            //渲染模式
            if (_rendering === undefined) {
                _rendering = rendering;
            }
            setRendering(_rendering, true); //單純套用css，而不覆寫設定
            //圖片縮放上限
            if (_zoomRatio === 1) {
                return;
            }
            if (_zoomRatio > 1 && eventLimitMax()) {
                return;
            }
            if (_zoomRatio < 1 && eventLimitMin()) {
                return;
            }
            let w = dom_data.offsetWidth;
            w *= _zoomRatio;
            dom_data.style.width = w + 'px';
            var xxx = _x - toInt(dom_con.style.left);
            var yyy = _y - toInt(dom_con.style.top);
            var xx2 = dom_con.offsetWidth - dom_con.offsetWidth / _zoomRatio;
            var yy2 = dom_con.offsetHeight - dom_con.offsetHeight / _zoomRatio;
            setXY((toInt(dom_con.style.left) - ((xxx / dom_con.offsetWidth) * xx2) * _zoomRatio), (toInt(dom_con.style.top) - ((yyy / dom_con.offsetHeight) * yy2) * _zoomRatio), 0);
            init_point(false);
            eventChangeZoom(getZoomRatio());
        }
        /**
         * 縮小
         * @param _x
         * @param _y
         */
        function zoomOut(_x, _y, _zoomRatio) {
            //未填入縮放比例，就是用預設縮放比例
            if (_zoomRatio === undefined) {
                _zoomRatio = (1 / zoomRatio);
            }
            zoomIn(_x, _y, _zoomRatio);
        }
        /**
         * 取得 滑鼠滾輪的事件
         * @returns
         */
        function getEventMouseWheel() { return eventMouseWheel; }
        /**
         * 覆寫 滑鼠滾輪的事件
         * @param _func
         */
        function setEventMouseWheel(_func) {
            eventMouseWheel = _func;
        }
        /**
         * 判斷圖片是否大於視窗(寬度)
         * @returns
         */
        function getIsOverflowX() {
            if (dom_con.offsetWidth + marginLeft + marginRight > dom_tiefseeview.offsetWidth) {
                return true;
            }
            return false;
        }
        /**
         * 判斷圖片是否大於視窗(高度)
         * @returns
         */
        function getIsOverflowY() {
            if (dom_con.offsetHeight + marginTop + marginBottom > dom_tiefseeview.offsetHeight) {
                return true;
            }
            return false;
        }
        /**
         * 更新 捲動軸位置
         */
        function init_scroll() {
            scrollX.init_size(dom_con.offsetWidth + marginLeft + marginRight, dom_tiefseeview.offsetWidth, toInt(dom_con.style.left) * -1 + marginLeft);
            scrollY.init_size(dom_con.offsetHeight + marginTop + marginBottom, dom_tiefseeview.offsetHeight, toInt(dom_con.style.top) * -1 + marginTop);
        }
        /**
         * 更新 定位，避免圖片超出視窗範圍，圖片小於視窗時進行 置中
         * @param isAnimation
         */
        function init_point(isAnimation) {
            return __awaiter(this, void 0, void 0, function* () {
                //根據縮放或旋轉來重新設定圖片size
                dom_con.style.width = dom_data.getBoundingClientRect().width + 'px';
                dom_con.style.height = dom_data.getBoundingClientRect().height + 'px';
                init_scroll();
                if (isAnimation === undefined) {
                    isAnimation = true;
                }
                let bool_w = getIsOverflowX();
                let bool_h = getIsOverflowY();
                let top = toInt(dom_con.style.top);
                let left = toInt(dom_con.style.left);
                if (bool_w && bool_h) { //圖片寬度高度都大於視窗
                    if (toInt(dom_con.style.top) > marginTop) {
                        top = marginTop;
                    }
                    if (toInt(dom_con.style.left) > marginLeft) {
                        left = marginLeft;
                    }
                    let t = dom_tiefseeview.offsetHeight - dom_con.offsetHeight - marginBottom;
                    if (toInt(dom_con.style.top) < t) {
                        top = t;
                    }
                    let l = dom_tiefseeview.offsetWidth - dom_con.offsetWidth - marginRight;
                    if (toInt(dom_con.style.left) < l) {
                        left = l;
                    }
                }
                if (bool_w === false && bool_h) {
                    if (toInt(dom_con.style.top) > marginTop) {
                        top = marginTop;
                    }
                    let t = dom_tiefseeview.offsetHeight - dom_con.offsetHeight - marginBottom;
                    if (toInt(dom_con.style.top) < t) {
                        top = t;
                    }
                    left = (dom_tiefseeview.offsetWidth - dom_con.offsetWidth) / 2;
                }
                if (bool_w && bool_h === false) {
                    if (toInt(dom_con.style.left) > marginLeft) {
                        left = marginLeft;
                    }
                    let l = dom_tiefseeview.offsetWidth - dom_con.offsetWidth - marginRight;
                    if (toInt(dom_con.style.left) < l) {
                        left = l;
                    }
                    top = (dom_tiefseeview.offsetHeight - dom_con.offsetHeight) / 2;
                }
                if (bool_w === false && bool_h === false) { //圖片小於視窗、置中
                    left = (dom_tiefseeview.offsetWidth - dom_con.offsetWidth) / 2;
                    top = (dom_tiefseeview.offsetHeight - dom_con.offsetHeight) / 2;
                }
                if (isAnimation) {
                    yield setXY(left, top, 100);
                }
                else {
                    setXY(left, top, 0);
                }
            });
        }
        /**
         * 順時針旋轉90
         * @param isAnimation 是否使用動畫
         */
        function setDegForward(_x, _y, isAnimation = true) {
            return __awaiter(this, void 0, void 0, function* () {
                var deg = degNow;
                deg = (Math.floor(deg / 90) + 1) * 90;
                yield setDeg(deg, _x, _y, isAnimation);
            });
        }
        /**
         * 逆時針旋轉90
         * @param isAnimation 是否使用動畫
         */
        function setDegReverse(_x, _y, isAnimation = true) {
            return __awaiter(this, void 0, void 0, function* () {
                var deg = degNow;
                deg = (Math.ceil(deg / 90) - 1) * 90;
                yield setDeg(deg, _x, _y, isAnimation);
            });
        }
        /**
         * 取得 是否水平鏡像
         * @returns
         */
        function getMirrorHorizontal() {
            return mirrorHorizontal;
        }
        /**
         * 設定 水平鏡像
         * @param bool true=水平鏡像、false=原始狀態
         * @param boolAnimation 是否使用動畫
         */
        function setMirrorHorizontal(bool, boolAnimation = true) {
            return __awaiter(this, void 0, void 0, function* () {
                mirrorHorizontal = bool;
                eventChangeMirror(mirrorHorizontal, mirrorVertical);
                yield setTransform(undefined, undefined, boolAnimation);
            });
        }
        /**
         * 取得 是否垂直鏡像
         * @returns
         */
        function getMirrorVertica() { return mirrorVertical; }
        /**
         * 設定 垂直鏡像
         * @param bool true=垂直鏡像、false=原始狀態
         * @param boolAnimation 是否使用動畫
         */
        function setMirrorVertica(bool, boolAnimation = true) {
            return __awaiter(this, void 0, void 0, function* () {
                mirrorVertical = bool;
                eventChangeMirror(mirrorHorizontal, mirrorVertical);
                yield setTransform(undefined, undefined, boolAnimation);
            });
        }
        /**
         * 取得 旋轉角度
         * @returns
         */
        function getDeg() { return degNow; }
        /**
          * 設定 旋轉角度
          * @param _deg 角度
          * @param isAnimation 是否使用動畫
          */
        function setDeg(_deg, _x, _y, isAnimation = true) {
            return __awaiter(this, void 0, void 0, function* () {
                degNow = _deg;
                eventChangeDeg(degNow);
                yield setTransform(_x, _y, isAnimation);
            });
        }
        /**
         * 設定 圖片的坐標
         * @param _left
         * @param _top
         * @param _sp 動畫時間(毫秒)
         */
        function setXY(_left, _top, _sp) {
            return __awaiter(this, void 0, void 0, function* () {
                //允許只填單一參數，未填的使用目前的坐標
                if (_top === undefined) {
                    _top = toInt(dom_con.style.top);
                }
                if (_left === undefined) {
                    _left = toInt(dom_con.style.left);
                }
                eventChangeXY(_left, _top);
                if (_sp <= 0) {
                    dom_con.style.top = _top + 'px';
                    dom_con.style.left = _left + 'px';
                    init_scroll(); //初始化捲動軸的位置(跟隨圖片位置同步)
                }
                else {
                    yield new Promise((resolve, reject) => {
                        $(dom_con).animate({
                            'top': _top,
                            'left': _left,
                        }, {
                            step: function (now, fx) {
                                // @ts-ignore
                                let data = $(dom_data).animate()[0]; //取得記錄所有動畫變數的物件
                                dom_con.style.top = data.top + 'px';
                                dom_con.style.left = data.left + 'px';
                                init_scroll(); //初始化捲動軸的位置(跟隨圖片位置同步)
                            },
                            duration: _sp,
                            start: () => { },
                            complete: () => {
                                dom_con.style.top = _top + 'px';
                                dom_con.style.left = _left + 'px';
                                resolve(0); //繼續往下執行
                            },
                            easing: 'easeOutExpo'
                        });
                    });
                }
            });
        }
        /**
         * 旋轉跟鏡像初始化
         * @param boolAnimation 是否使用動畫
         */
        function transformRefresh(boolAnimation = true) {
            return __awaiter(this, void 0, void 0, function* () {
                degNow = 0;
                mirrorVertical = false;
                mirrorHorizontal = false;
                eventChangeMirror(mirrorHorizontal, mirrorVertical);
                eventChangeDeg(degNow);
                yield setTransform(undefined, undefined, boolAnimation);
            });
        }
        /**
         * 設定 transform (旋轉、鏡像)
         * @param isAnimation 是否使用動畫
         */
        function setTransform(_x, _y, isAnimation = true) {
            return __awaiter(this, void 0, void 0, function* () {
                $(dom_data).stop(true, false);
                //動畫時間
                let duration = transformDuration;
                if (isAnimation == false) {
                    duration = 0; //無動畫
                }
                //鏡像
                let scaleX = 1;
                if (mirrorHorizontal === true) {
                    scaleX = -1;
                }
                let scaleY = 1;
                if (mirrorVertical === true) {
                    scaleY = -1;
                }
                yield new Promise((resolve, reject) => {
                    $(dom_data).animate({
                        'transform_rotate': degNow,
                        'transform_scaleX': scaleX,
                        'transform_scaleY': scaleY,
                    }, {
                        start: () => { },
                        step: function (now, fx) {
                            //if (fx.prop == 'transform_rotate') { }
                            // @ts-ignore
                            let andata = $(dom_data).animate()[0]; //取得記錄所有動畫變數的物件
                            //沒有指定從哪裡開始旋轉，就從中間
                            if (_x === undefined) {
                                _x = (dom_tiefseeview.offsetWidth / 2);
                            }
                            if (_y === undefined) {
                                _y = (dom_tiefseeview.offsetHeight / 2);
                            }
                            //取得旋轉點在在旋轉前的位置(絕對坐標)
                            let _x2 = _x - toInt(dom_con.style.left);
                            let _y2 = _y - toInt(dom_con.style.top);
                            //取得旋轉點在旋轉前的位置(相對坐標)
                            let _degNow = dom_data.getAttribute('transform_rotate');
                            if (_degNow === null) {
                                _degNow = '0';
                            }
                            let rect0 = getOrigPoint(_x2, _y2, dom_data.offsetWidth, dom_data.offsetHeight, toInt(_degNow));
                            let x4 = rect0.x;
                            let y4 = rect0.y;
                            //計算旋轉後的坐標
                            let rect2 = getRotateRect(dom_data.offsetWidth, dom_data.offsetHeight, x4, y4, andata.transform_rotate);
                            dom_data.style.transform = `rotate(${andata.transform_rotate}deg) scaleX(${andata.transform_scaleX}) scaleY(${andata.transform_scaleY})`;
                            dom_data.setAttribute('transform_rotate', andata.transform_rotate); //儲存目前動畫旋轉的角度
                            setXY(_x - rect2.x, _y - rect2.y, 0);
                            init_point(false);
                        },
                        duration: duration,
                        complete: () => {
                            //如果角度超過360，就初始化
                            if (degNow <= 0 || degNow >= 360) {
                                degNow = degNow - Math.floor(degNow / 360) * 360;
                            } //避免超過360               
                            $(dom_data).animate({ 'transform_rotate': degNow, 'transform_scaleX': scaleX, 'transform_scaleY': scaleY, }, { duration: 0 });
                            dom_data.style.transform = `rotate(${degNow}deg) scaleX(${scaleX}) scaleY(${scaleY})`;
                            dom_data.setAttribute('transform_rotate', degNow.toString());
                            init_point(false);
                            resolve(0); //繼續往下執行
                        },
                        easing: 'linear'
                    });
                });
            });
        }
        //-----------------------------------------------
        /**
         * 轉 number
         */
        function toInt(t) {
            if (typeof (t) === "number") {
                return t;
            } //如果本來就是數字，直接回傳     
            if (typeof t === 'string') {
                return Number(t.replace('px', ''));
            } //如果是string，去掉px後轉型成數字
            return 0;
        }
        /**
         * 向量旋轉
         * @param {{x:Number,y:Number}} vector
         * @param {number} angle 旋轉的角度
         * @param {*} origin  旋轉點 默認是 （0,0）,可傳入 繞著的某點
         */
        function vectorRotate(vector, angle, origin = { x: 0, y: 0 }) {
            angle = angle * Math.PI / 180;
            let cosA = Math.cos(angle);
            let sinA = Math.sin(angle);
            var x1 = (vector.x - origin.x) * cosA - (vector.y - origin.y) * sinA;
            var y1 = (vector.x - origin.x) * sinA + (vector.y - origin.y) * cosA;
            return {
                x: origin.x + x1,
                y: origin.y + y1
            };
        }
        /**
         * 取得矩形旋轉後的實際大小，取得矩形裡面某一個點旋轉後的位置
         * @param width
         * @param height
         * @param x
         * @param y
         * @param deg 角度(0~360)
         * @returns
         */
        function getRotateRect(width, height, x, y, deg) {
            let div = document.querySelector('.js--tiefseeview-temporary');
            let divsub = document.querySelector('.js--tiefseeview-temporary .js--tiefseeview-temporary_sub');
            if (div === null) { //
                div = document.createElement('div');
                div.style.position = 'fixed';
                div.style.pointerEvents = 'none';
                div.setAttribute('class', 'js--tiefseeview-temporary');
                div.innerHTML = '<div class="js--tiefseeview-temporary_sub"></div>';
                document.body.appendChild(div);
                divsub = document.querySelector('.js--tiefseeview-temporary .js--tiefseeview-temporary_sub');
                divsub.style.position = 'absolute';
            }
            divsub.style.left = x + 'px';
            divsub.style.top = y + 'px';
            div.style.width = width + 'px';
            div.style.height = height + 'px';
            div.style.transform = `rotate(${deg}deg)`;
            let divRect = div.getBoundingClientRect();
            let divsubRect = divsub.getBoundingClientRect();
            return {
                rectWidth: divRect.width,
                rectHeight: divRect.height,
                x: divsubRect.x - divRect.x,
                y: divsubRect.y - divRect.y
            };
        }
        /**
         * 旋轉一個向量
         *
         * @param { object } vec 向量，具有 x 跟 y 屬性
         * @param { number } deg 旋轉角度
         * @returns { object } 向量，具有 x 跟 y 屬性
         */
        function rotateVector(vec, deg) {
            let theta = Math.PI * deg / 180;
            let cos = Math.cos(theta), sin = Math.sin(theta);
            return {
                x: vec.x * cos - vec.y * sin,
                y: vec.x * sin + vec.y * cos
            };
        }
        /**
        * 取得旋轉後，原點（圖片左上角）的座標
        *
        * @param {number} w 圖片寬度
        * @param {number} h 圖片高度
        * @param {number} deg 旋轉角度
        * @returns {object} 向量，具有 x 跟 y 屬性
        */
        function getRotatedOrig(w, h, deg) {
            let points = [
                { x: 0, y: 0 },
                { x: 0, y: h },
                { x: w, y: 0 },
                { x: w, y: h }
            ].map(p => rotateVector(p, deg));
            let minX = Math.min.apply(null, points.map(p => p.x)), minY = Math.min.apply(null, points.map(p => p.y));
            return {
                x: -minX,
                y: -minY
            };
        }
        /**
        * 計算點擊位置在原本圖片的哪個點
        *
        * @param {number} x 點擊的 x 座標
        * @param {number} y 點擊的 y 座標
        * @param {number} w 圖片寬度
        * @param {number} h 圖片高度
        * @param {number} deg 旋轉角度
        * @returns {object} 向量，具有 x 跟 y 屬性
        */
        function getOrigPoint(x, y, w, h, deg) {
            let p = getRotatedOrig(w, h, deg);
            let v = {
                x: x - p.x,
                y: y - p.y
            };
            return rotateVector(v, -deg);
        }
    }
}
/**
 * 對齊方式
 */
var TieefseeviewAlignType;
(function (TieefseeviewAlignType) {
    TieefseeviewAlignType[TieefseeviewAlignType["T"] = 0] = "T";
    TieefseeviewAlignType[TieefseeviewAlignType["R"] = 1] = "R";
    TieefseeviewAlignType[TieefseeviewAlignType["B"] = 2] = "B";
    TieefseeviewAlignType[TieefseeviewAlignType["L"] = 3] = "L";
    TieefseeviewAlignType[TieefseeviewAlignType["RT"] = 4] = "RT";
    TieefseeviewAlignType[TieefseeviewAlignType["RB"] = 5] = "RB";
    TieefseeviewAlignType[TieefseeviewAlignType["LT"] = 6] = "LT";
    TieefseeviewAlignType[TieefseeviewAlignType["LB"] = 7] = "LB";
    TieefseeviewAlignType[TieefseeviewAlignType["C"] = 8] = "C";
    TieefseeviewAlignType[TieefseeviewAlignType["none"] = 9] = "none";
})(TieefseeviewAlignType || (TieefseeviewAlignType = {}));
/**
 * 圖片縮放模式
 */
var TieefseeviewZoomType;
(function (TieefseeviewZoomType) {
    TieefseeviewZoomType[TieefseeviewZoomType["%-w"] = 0] = "%-w";
    TieefseeviewZoomType[TieefseeviewZoomType["%-h"] = 1] = "%-h";
    TieefseeviewZoomType[TieefseeviewZoomType["px-w"] = 2] = "px-w";
    TieefseeviewZoomType[TieefseeviewZoomType["px-h"] = 3] = "px-h";
    TieefseeviewZoomType[TieefseeviewZoomType["full-w"] = 4] = "full-w";
    TieefseeviewZoomType[TieefseeviewZoomType["full-h"] = 5] = "full-h";
    TieefseeviewZoomType[TieefseeviewZoomType["full-wh"] = 6] = "full-wh";
    TieefseeviewZoomType[TieefseeviewZoomType["full-100%"] = 7] = "full-100%";
    TieefseeviewZoomType[TieefseeviewZoomType["100%"] = 8] = "100%";
})(TieefseeviewZoomType || (TieefseeviewZoomType = {}));
/**
 * 圖片渲染模式
 */
var TieefseeviewImageRendering;
(function (TieefseeviewImageRendering) {
    /**
     * 預設值，運算成本較高
     */
    TieefseeviewImageRendering[TieefseeviewImageRendering["auto"] = 0] = "auto";
    /**
     * 運算成本低，放大時呈現方塊
     */
    TieefseeviewImageRendering[TieefseeviewImageRendering["pixelated"] = 1] = "pixelated";
    /**
     * 圖片大於100%時切換成pixelated，否則使用auto
     */
    TieefseeviewImageRendering[TieefseeviewImageRendering["auto-pixelated"] = 2] = "auto-pixelated";
})(TieefseeviewImageRendering || (TieefseeviewImageRendering = {}));
/**
 * 捲動軸物件
 */
class TieefseeviewScroll {
    /**
     *
     * @param _dom
     * @param _type y=垂直 、 x=水平
     */
    constructor(_dom, _type) {
        var dom_scroll = _dom;
        var dom_bg = dom_scroll.querySelector('.scroll-bg');
        var dom_box = dom_scroll.querySelector('.scroll-box');
        var type = _type;
        var contentHeight = 0; //內容高度(全部的值)
        var panelHeight = 0; //容器的高度
        var _eventChange = (v, mode) => { };
        var hammer_scroll = new Hammer(dom_scroll, {});
        var startLeft = 0;
        var startTop = 0;
        this.getEventChange = getEventChange;
        this.setEventChange = setEventChange;
        this.setTop = setTop;
        this.getTop = getTop;
        this.setValue = setValue;
        this.init_size = init_size;
        //在滾動條上面滾動時
        dom_scroll.addEventListener("wheel", (ev) => { MouseWheel(ev); }, true);
        const MouseWheel = (e) => {
            e.preventDefault(); //禁止頁面滾動
            e = e || window.event;
            let v = getTop();
            if (e.deltaX > 0 || e.deltaY > 0) { //下
                setTop(v + 10, 'wheel');
            }
            else { //上
                setTop(v - 10, 'wheel');
            }
        };
        //拖曳開始
        dom_scroll.addEventListener('mousedown', (ev) => { touchStart(ev); });
        dom_scroll.addEventListener('touchstart', (ev) => { touchStart(ev); });
        const touchStart = (ev) => {
            ev.preventDefault();
            startLeft = toInt(dom_box.style.left);
            startTop = toInt(dom_box.style.top);
        };
        //拖曳中
        hammer_scroll.get('pan').set({ threshold: 0 });
        hammer_scroll.on('pan', (ev) => {
            ev.preventDefault();
            let deltaX = ev['deltaX'];
            let deltaY = ev['deltaY'];
            if (type === 'y') {
                let top = startTop + deltaY;
                setTop(top, 'pan');
            }
            if (type === 'x') {
                let left = startLeft + deltaX;
                setTop(left, 'pan');
            }
            dom_scroll.setAttribute('action', 'true'); //表示「拖曳中」，用於CSS樣式
        });
        hammer_scroll.on('panend', (ev) => {
            dom_scroll.setAttribute('action', ''); //表示「結束拖曳」，用於CSS樣式
        });
        /**
         *
         * @param _contentHeight 內容高度(全部的值)
         * @param _panelHeight 容器高度
         * @param _top 目前的值
         */
        function init_size(_contentHeight, _panelHeight, _top) {
            if (_top === undefined) {
                _top = 0;
            }
            contentHeight = _contentHeight;
            panelHeight = _panelHeight;
            if (type === 'y') {
                let h = _panelHeight / _contentHeight * dom_scroll.offsetHeight;
                if (h < 30) {
                    h = 30;
                }
                dom_box.style.height = h + 'px';
            }
            if (type === 'x') {
                let l = _panelHeight / _contentHeight * dom_scroll.offsetWidth;
                if (l < 30) {
                    l = 30;
                }
                dom_box.style.width = l + 'px';
            }
            //不需要時，自動隱藏
            if (_contentHeight - 3 >= _panelHeight) {
                dom_scroll.style.opacity = '1';
                dom_scroll.style.pointerEvents = '';
            }
            else {
                dom_scroll.style.opacity = '0';
                dom_scroll.style.pointerEvents = 'none';
            }
            setValue(_top);
        }
        /**
         * 捲動到指定的 值
         * @param v
         */
        function setValue(v) {
            v = v / (contentHeight - panelHeight); //換算成百分比
            if (type === 'y') {
                v = v * (dom_scroll.offsetHeight - dom_box.offsetHeight);
            }
            if (type === 'x') {
                v = v * (dom_scroll.offsetWidth - dom_box.offsetWidth);
            }
            setTop(v, 'set');
        }
        /**
         * 取得目前的位置(px)
         * @returns
         */
        function getTop() {
            if (type === 'y') {
                return toInt(dom_box.style.top);
            }
            if (type === 'x') {
                return toInt(dom_box.style.left);
            }
            return 0;
        }
        /**
         * 捲動到指定的位置(px)
         * @param v
         * @param mode set/pan/wheel
         */
        function setTop(v, mode) {
            v = toInt(v);
            if (type === 'y') {
                if (v < 0) {
                    v = 0;
                }
                if (v > dom_scroll.offsetHeight - dom_box.offsetHeight) {
                    v = dom_scroll.offsetHeight - dom_box.offsetHeight;
                }
                dom_box.style.top = v + 'px';
            }
            if (type === 'x') {
                if (v < 0) {
                    v = 0;
                }
                if (v > dom_scroll.offsetWidth - dom_box.offsetWidth) {
                    v = dom_scroll.offsetWidth - dom_box.offsetWidth;
                }
                dom_box.style.left = v + 'px';
            }
            eventChange(mode);
        }
        /**
         * 取得 捲動時的事件
         * @returns
         */
        function getEventChange() {
            return _eventChange;
        }
        /**
         * 設定 捲動時的事件
         * @param func
         */
        function setEventChange(func = (v, mode) => { }) {
            _eventChange = func;
        }
        /**
         * 捲動時呼叫此函數
         * @param mode
         */
        function eventChange(mode) {
            let x = 0;
            if (type === 'y') {
                x = dom_scroll.offsetHeight - dom_box.offsetHeight; //計算剩餘空間
                x = toInt(dom_box.style.top) / x; //計算比例
                x = x * (contentHeight - panelHeight);
            }
            if (type === 'x') {
                x = dom_scroll.offsetWidth - dom_box.offsetWidth; //計算剩餘空間
                x = toInt(dom_box.style.left) / x; //計算比例
                x = x * (contentHeight - panelHeight);
            }
            _eventChange(x, mode);
        }
        /**
         * 轉 int
         * @param t
         * @returns
         */
        function toInt(t) {
            if (typeof (t) === "number") {
                return t;
            } //如果本來就是數字，直接回傳
            if (typeof t === 'string') {
                return Number(t.replace('px', ''));
            } //如果是string，去掉px後轉型成數字
            return 0;
        }
    }
}
