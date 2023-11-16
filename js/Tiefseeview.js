"use strict";
class Tiefseeview {
  //覆寫 圖片面積大於這個數值，就停止使用高品質縮放
  constructor(_dom) {
    _dom.innerHTML = /*html*/
    `
            <div class="tiefseeview-loading"></div>   
            <div class="tiefseeview-dpizoom">
                <div class="tiefseeview-container">
                    <div class="tiefseeview-data" style="width:400px;">
                        <div class="view-bigimg">
                            <canvas class="view-bigimg-canvas"></canvas>
                        </div>   
                        <img class="view-img" style="display:none">
                        <video class="view-video" style="display:none" loop ></video>
                    </div>
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
    var dom_dpizoom = dom_tiefseeview.querySelector(".tiefseeview-dpizoom");
    var dom_con = dom_tiefseeview.querySelector(".tiefseeview-container");
    var dom_data = dom_tiefseeview.querySelector(".tiefseeview-data");
    var dom_img = dom_tiefseeview.querySelector(".view-img");
    var dom_bigimg = dom_tiefseeview.querySelector(".view-bigimg");
    var dom_video = dom_tiefseeview.querySelector(".view-video");
    var dom_bigimg_canvas = dom_tiefseeview.querySelector(".view-bigimg-canvas");
    var dom_loading = dom_tiefseeview.querySelector(".tiefseeview-loading");
    var scrollX = new TiefseeScroll();
    var scrollY = new TiefseeScroll();
    scrollX.initTiefseeScroll(dom_tiefseeview.querySelector(".scroll-x"), "x");
    scrollY.initTiefseeScroll(dom_tiefseeview.querySelector(".scroll-y"), "y");
    var url;
    var dataType = "img";
    var dpizoom = 1;
    var isDpizoomAUto = true;
    var degNow = 0;
    var zoomRatio = 1.1;
    var transformDuration = 200;
    var mirrorHorizontal = false;
    var mirrorVertical = false;
    var rendering = 0 /* auto */;
    var overflowDistance = 0;
    var marginTop = 10;
    var marginLeft = 10;
    var marginBottom = 10;
    var marginRight = 10;
    var loadingUrl = "img/loading.svg";
    var errerUrl = "img/error.svg";
    var rotateCriticalValue = 15;
    var hammerPan = new Hammer(dom_dpizoom);
    var panStartX = 0;
    var panStartY = 0;
    var isMoving = false;
    var isPaning = false;
    var hammerPlural = new Hammer.Manager(dom_dpizoom);
    var temp_rotateStareDegValue = 0;
    var temp_touchRotateStarting = false;
    var temp_rotateStareDegNow = 0;
    var temp_pinchZoom = 1;
    var temp_pinchCenterX = 0;
    var temp_pinchCenterY = 0;
    var temp_dateShowLoading = 0;
    var temp_originalWidth = 1;
    var temp_originalHeight = 1;
    var temp_img;
    var temp_can;
    var temp_canvasSN = 0;
    var temp_touchPadTime = 0;
    var arBigimgscale = [];
    var isZoomWithWindow = true;
    var temp_zoomWithWindow = false;
    var temp_TiefseeviewZoomType = 4 /* imageOriginal */;
    var temp_TiefseeviewZoomTypeVal = 100;
    var eventMouseWheel = (_type, e, offsetX, offsetY) => {
      if (_type === "up") {
        zoomIn(offsetX, offsetY);
      } else {
        zoomOut(offsetX, offsetY);
      }
    };
    var eventChangeZoom = (ratio) => {
    };
    var eventChangeDeg = (deg) => {
    };
    var eventChangeMirror = (isMirrorHorizontal, isMirrorVertica) => {
    };
    var eventChangeXY = (x, y) => {
    };
    var eventLimitMax = () => {
      return _eventLimitMax();
    };
    var eventLimitMin = () => {
      return _eventLimitMin();
    };
    var eventHighQualityLimit = () => {
      return 7e3 * 7e3;
    };
    var pinch = new Hammer.Pinch();
    var rotate = new Hammer.Rotate();
    rotate.recognizeWith(pinch);
    hammerPlural.add([pinch, rotate]);
    this.dom_tiefseeview = dom_tiefseeview;
    this.dom_con = dom_con;
    this.dom_data = dom_data;
    this.dom_img = dom_img;
    this.scrollX = scrollX;
    this.scrollY = scrollY;
    this.preloadImg = preloadImg;
    this.preloadVideo = preloadVideo;
    this.loadImg = loadImg;
    this.loadBigimg = loadBigimg;
    this.loadBigimgscale = loadBigimgscale;
    this.loadVideo = loadVideo;
    this.loadNone = loadNone;
    this.setLoading = setLoading;
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
    this.getXY = getXY;
    this.setXY = setXY;
    this.move = move;
    this.init_point = init_point;
    this.transformRefresh = transformRefresh;
    this.setAlign = setAlign;
    this.zoomOut = zoomOut;
    this.zoomIn = zoomIn;
    this.getEventMouseWheel = getEventMouseWheel;
    this.setEventMouseWheel = setEventMouseWheel;
    this.sendWheelEvent = sendWheelEvent;
    this.getEventLimitMax = getEventLimitMax;
    this.setEventLimitMax = setEventLimitMax;
    this.getEventLimitMin = getEventLimitMin;
    this.setEventLimitMin = setEventLimitMin;
    this.setEventHighQualityLimit = setEventHighQualityLimit;
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
    this.getZoomRatio = getZoomRatio;
    this.setMargin = setMargin;
    this.getMargin = getMargin;
    this.getDpizoom = getDpizoom;
    this.setDpizoom = setDpizoom;
    this.getOverflowDistance = getOverflowDistance;
    this.setOverflowDistance = setOverflowDistance;
    this.getLoadingUrl = getLoadingUrl;
    this.setLoadingUrl = setLoadingUrl;
    this.getErrerUrl = getErrerUrl;
    this.setErrerUrl = setErrerUrl;
    this.getUrl = getUrl;
    this.getCanvasBase64 = getCanvasBase64;
    this.getCanvasBlob = getCanvasBlob;
    this.getIsZoomWithWindow = getIsZoomWithWindow;
    this.setIsZoomWithWindow = setIsZoomWithWindow;
    setLoadingUrl(loadingUrl);
    setLoading(false);
    dom_tiefseeview.classList.add("tiefseeview");
    setTransform(void 0, void 0, false);
    setDpizoom(-1);
    new ResizeObserver(() => {
      requestAnimationFrame(() => {
        init_point(false);
        eventChangeZoom(getZoomRatio());
        if (isZoomWithWindow && temp_zoomWithWindow) {
          zoomFull(temp_TiefseeviewZoomType, temp_TiefseeviewZoomTypeVal);
        }
      });
    }).observe(dom_dpizoom);
    scrollY.setEventChange((v, mode) => {
      if (mode === "set") {
        return;
      }
      v = v * -1 + marginTop;
      setXY(void 0, v, 0);
    });
    scrollX.setEventChange((v, mode) => {
      if (mode === "set") {
        return;
      }
      v = v * -1 + marginLeft;
      setXY(v, void 0, 0);
    });
    hammerPlural.on("rotatestart", (ev) => {
      temp_rotateStareDegNow = degNow;
      temp_rotateStareDegValue = ev.rotation - degNow;
      temp_touchRotateStarting = false;
    });
    hammerPlural.on("rotate", async (ev) => {
      let _deg = ev.rotation - temp_rotateStareDegValue;
      if (temp_touchRotateStarting === false) {
        if (Math.abs(temp_rotateStareDegNow - Math.abs(_deg)) > rotateCriticalValue) {
          temp_rotateStareDegValue -= temp_rotateStareDegNow - _deg;
          _deg += temp_rotateStareDegNow - _deg;
          temp_touchRotateStarting = true;
        }
      }
      if (temp_touchRotateStarting) {
        setDeg(_deg, ev.center.x, ev.center.y, false);
      }
    });
    hammerPlural.on("rotateend", (ev) => {
      temp_touchRotateStarting = false;
      let r = degNow % 90;
      if (r === 0) {
        return;
      }
      if (r > 45 || r < 0 && r > -45) {
        setDegForward(ev.center.x, ev.center.y, true);
      } else {
        setDegReverse(ev.center.x, ev.center.y, true);
      }
    });
    var isPinching = false;
    hammerPlural.on("pinchstart", (ev) => {
      isPinching = true;
      temp_pinchZoom = 1;
      temp_pinchCenterX = ev.center.x;
      temp_pinchCenterY = ev.center.y;
      temp_zoomWithWindow = false;
    });
    hammerPlural.on("pinch", (ev) => {
      requestAnimationFrame(() => {
        zoomIn(ev.center.x, ev.center.y, ev.scale / temp_pinchZoom, 1 /* pixelated */);
        temp_pinchZoom = ev.scale;
        temp_pinchCenterX = ev.center.x;
        temp_pinchCenterY = ev.center.y;
      });
    });
    hammerPlural.on("pinchend", (ev) => {
      isPinching = false;
      setRendering(rendering);
    });
    dom_dpizoom.addEventListener("wheel", (e) => {
      e.preventDefault();
      if (e.target !== dom_dpizoom) {
        return;
      }
      temp_zoomWithWindow = false;
      $(dom_con).stop(true, false);
      let isTouchPad = Math.abs(e.deltaX) < 100 && Math.abs(e.deltaY) < 100;
      if (isTouchPad || temp_touchPadTime + 200 > (/* @__PURE__ */ new Date()).getTime()) {
        temp_touchPadTime = (/* @__PURE__ */ new Date()).getTime();
        requestAnimationFrame(() => {
          if (e.ctrlKey === true) {
            let scale = 1 - e.deltaY * 0.01;
            zoomIn(e.offsetX, e.offsetY, scale, 1 /* pixelated */);
          } else {
            let posX = e.deltaX;
            let posY = e.deltaY;
            setXY(
              toNumber(dom_con.style.left) - posX,
              toNumber(dom_con.style.top) - posY,
              0
            );
            init_point(false);
          }
        });
      } else {
        if (e.deltaX < 0 || e.deltaY < 0) {
          eventMouseWheel("up", e, e.offsetX, e.offsetY);
        } else {
          eventMouseWheel("down", e, e.offsetX, e.offsetY);
        }
      }
    }, true);
    dom_dpizoom.addEventListener("mousedown", (ev) => {
      ev.preventDefault();
      if (getIsOverflowX() === false && getIsOverflowY() === false) {
        var downEvent = new PointerEvent("pointerup", {
          pointerId: 1,
          bubbles: true,
          pointerType: "mouse"
        });
        dom_dpizoom.dispatchEvent(downEvent);
        return;
      }
      if (ev.target !== dom_dpizoom) {
        isMoving = false;
        isPaning = false;
        return;
      }
      isMoving = true;
      isPaning = true;
      $(dom_con).stop(true, false);
      panStartX = toNumber(dom_con.style.left);
      panStartY = toNumber(dom_con.style.top);
    });
    dom_dpizoom.addEventListener("touchstart", (ev) => {
      ev.preventDefault();
      if (ev.touches.length > 1) {
        isMoving = false;
        isPaning = false;
        return;
      }
      if (ev.target !== dom_dpizoom) {
        isMoving = false;
        isPaning = false;
        return;
      }
      isMoving = true;
      isPaning = true;
      $(dom_con).stop(true, false);
      panStartX = toNumber(dom_con.style.left);
      panStartY = toNumber(dom_con.style.top);
    });
    hammerPan.get("pan").set({ threshold: 0, direction: Hammer.DIRECTION_ALL });
    hammerPan.on("pan", (ev) => {
      requestAnimationFrame(() => {
        if (ev.maxPointers > 1) {
          isMoving = false;
          isPaning = false;
          return;
        }
        if (getIsOverflowX() === false && getIsOverflowY() === false) {
          return;
        }
        if (isMoving === false) {
          return;
        }
        let deltaX = ev["deltaX"];
        let deltaY = ev["deltaY"];
        let left = panStartX + deltaX * dpizoom;
        let top = panStartY + deltaY * dpizoom;
        if (getIsOverflowY()) {
          if (top > marginTop + overflowDistance) {
            top = marginTop + overflowDistance;
          }
          let t = dom_dpizoom.offsetHeight - dom_con.offsetHeight - marginBottom;
          if (top < t - overflowDistance) {
            top = t - overflowDistance;
          }
        } else {
          let t = (dom_dpizoom.offsetHeight - dom_con.offsetHeight) / 2;
          if (top > t + overflowDistance) {
            top = t + overflowDistance;
          }
          if (top < t - overflowDistance) {
            top = t - overflowDistance;
          }
        }
        if (getIsOverflowX()) {
          if (left > marginLeft + overflowDistance) {
            left = marginLeft + overflowDistance;
          }
          let l = dom_dpizoom.offsetWidth - dom_con.offsetWidth - marginRight;
          if (left < l - overflowDistance) {
            left = l - overflowDistance;
          }
        } else {
          let l = (dom_dpizoom.offsetWidth - dom_con.offsetWidth) / 2;
          if (left > l + overflowDistance) {
            left = l + overflowDistance;
          }
          if (left < l - overflowDistance) {
            left = l - overflowDistance;
          }
        }
        setXY(left, top, 0);
      });
    });
    hammerPan.on("panend", async (ev) => {
      if (ev.maxPointers > 1) {
        return;
      }
      if (isMoving === false) {
        return;
      }
      isMoving = false;
      isPaning = true;
      let velocity = ev["velocity"];
      let velocityX = ev["velocityX"];
      let velocityY = ev["velocityY"];
      let duration = 10;
      let dpi = getDpizoom();
      velocity *= dpi;
      velocityX *= dpi;
      velocityY *= dpi;
      if (ev.pointerType == "touch") {
        velocity *= 2;
        velocityX *= 2;
        velocityY *= 2;
      }
      duration = 150 + 100 * Math.abs(velocity);
      if (duration > 1200)
        duration = 1200;
      $(dom_con).stop(true, false);
      if (Math.abs(velocity) < 1) {
        velocity = 0;
        velocityX = 0;
        velocityY = 0;
        duration = 10;
        init_point(true);
        isPaning = false;
        return;
      }
      let speed = 150;
      let top = toNumber(dom_con.style.top) + velocityY * speed;
      let left = toNumber(dom_con.style.left) + velocityX * speed;
      let bool_overflowX = false;
      let bool_overflowY = false;
      if (getIsOverflowY()) {
        if (top > marginTop + overflowDistance) {
          top = marginTop + overflowDistance;
          bool_overflowX = true;
        }
        let t = dom_dpizoom.offsetHeight - dom_con.offsetHeight - marginBottom;
        if (top < t - overflowDistance) {
          top = t - overflowDistance;
          bool_overflowX = true;
        }
      } else {
        let t = (dom_dpizoom.offsetHeight - dom_con.offsetHeight) / 2;
        if (top > t + overflowDistance) {
          top = t + overflowDistance;
          bool_overflowX = true;
        }
        if (top < t - overflowDistance) {
          top = t - overflowDistance;
          bool_overflowX = true;
        }
      }
      if (getIsOverflowX()) {
        if (left > marginLeft + overflowDistance) {
          left = marginLeft + overflowDistance;
          bool_overflowY = true;
        }
        let l = dom_dpizoom.offsetWidth - dom_con.offsetWidth - marginRight;
        if (left < l - overflowDistance) {
          left = l - overflowDistance;
          bool_overflowY = true;
        }
      } else {
        let l = (dom_dpizoom.offsetWidth - dom_con.offsetWidth) / 2;
        if (left > l + overflowDistance) {
          left = l + overflowDistance;
          bool_overflowY = true;
        }
        if (left < l - overflowDistance) {
          left = l - overflowDistance;
          bool_overflowY = true;
        }
      }
      await setXY(left, top, duration);
      isPaning = false;
      init_point(true);
    });
    function getIsZoomWithWindow() {
      return isZoomWithWindow;
    }
    function setIsZoomWithWindow(val) {
      isZoomWithWindow = val;
    }
    function getLoadingUrl() {
      return loadingUrl;
    }
    function setLoadingUrl(_url) {
      loadingUrl = _url;
      dom_loading.style.backgroundImage = `url("${loadingUrl}")`;
    }
    function getErrerUrl() {
      return errerUrl;
    }
    function setErrerUrl(_url) {
      errerUrl = _url;
    }
    function setDataType(_type) {
      dataType = _type;
      if (dataType === "img") {
        dom_img.style.display = "";
        dom_bigimg.style.display = "none";
        dom_video.style.display = "none";
        dom_video.src = "";
        return;
      }
      if (dataType === "bigimg" || dataType === "bigimgscale") {
        dom_img.style.display = "none";
        dom_bigimg.style.display = "";
        dom_video.style.display = "none";
        dom_img.src = "";
        dom_video.src = "";
        return;
      }
      if (dataType === "video") {
        dom_img.style.display = "none";
        dom_bigimg.style.display = "none";
        dom_video.style.display = "";
        dom_img.src = "";
        return;
      }
    }
    function getUrl() {
      return url;
    }
    async function preloadImg(_url, isInitSize = true) {
      let img = document.createElement("img");
      let p = await new Promise((resolve, reject) => {
        img.addEventListener("load", (e) => {
          if (isInitSize) {
            temp_originalWidth = img.naturalWidth;
            temp_originalHeight = img.naturalHeight;
          }
          resolve(true);
        });
        img.addEventListener("error", (e) => {
          if (isInitSize) {
            temp_originalWidth = 1;
            temp_originalHeight = 1;
          }
          resolve(false);
        });
        img.src = _url;
      });
      temp_img = img;
      return p;
    }
    async function preloadVideo(_url) {
      let video = document.createElement("video");
      let p = await new Promise((resolve, reject) => {
        video.addEventListener("loadedmetadata", (e) => {
          temp_originalWidth = video.videoWidth;
          temp_originalHeight = video.videoHeight;
          resolve(true);
        });
        video.addEventListener("error", (e) => {
          temp_originalWidth = 1;
          temp_originalHeight = 1;
          resolve(false);
        });
        video.src = _url;
      });
      return p;
    }
    async function loadNone() {
      await loadBigimg("data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7");
    }
    async function loadVideo(_url) {
      url = _url;
      let p = await preloadVideo(_url);
      setDataType("video");
      if (p === false) {
        setDataType("img");
        await preloadImg(errerUrl);
        dom_img.src = errerUrl;
        return false;
      }
      dom_video.src = _url;
      dom_video.onloadedmetadata = () => {
        dom_video.play();
      };
      return true;
    }
    async function loadImg(_url) {
      url = _url;
      let p = await preloadImg(_url);
      setDataType("img");
      if (p === false) {
        await preloadImg(errerUrl);
        dom_img.src = errerUrl;
        return false;
      }
      let context = dom_bigimg_canvas.getContext("2d");
      context.clearRect(0, 0, dom_bigimg_canvas.width, dom_bigimg_canvas.height);
      dom_img.src = _url;
      return true;
    }
    async function loadBigimg(_url) {
      url = _url;
      let p = await preloadImg(_url);
      setDataType("bigimg");
      if (p === false) {
        setDataType("img");
        await preloadImg(errerUrl);
        dom_img.src = errerUrl;
        return false;
      }
      temp_bigimg = [];
      temp_drawImage = {
        scale: -1,
        sx: 0,
        sy: 0,
        sWidth: 1,
        sHeight: 1,
        dx: 0,
        dy: 0,
        dWidth: 1,
        dHeight: 1
      };
      dom_img.src = _url;
      temp_can = urlToCanvas(_url);
      return true;
    }
    async function loadBigimgscale(_arUrl, _w, _h, _zoomType, _zoomVal) {
      temp_originalWidth = _w;
      temp_originalHeight = _h;
      arBigimgscale = _arUrl;
      url = arBigimgscale[0].url;
      let scale = getZoomFull_scale(_zoomType, _zoomVal);
      let bigimgscaleItem = getBigimgscaleItem(scale);
      setDataType("bigimgscale");
      let p = await preloadImg(bigimgscaleItem.url, false);
      if (p === false) {
        setDataType("img");
        await preloadImg(errerUrl);
        dom_img.src = errerUrl;
        return false;
      }
      temp_bigimgscale = {};
      temp_bigimgscale[bigimgscaleItem.scale] = urlToCanvas(bigimgscaleItem.url);
      temp_bigimgscaleKey = [];
      temp_bigimgscaleKey.push(bigimgscaleItem.scale);
      setDataSize(getZoomFull_width(_zoomType, _zoomVal));
      temp_drawImage = {
        scale: -1,
        sx: 0,
        sy: 0,
        sWidth: 1,
        sHeight: 1,
        dx: 0,
        dy: 0,
        dWidth: 1,
        dHeight: 1
      };
      return true;
    }
    function getBigimgscaleItem(scale) {
      let nowScale;
      if (scale != void 0) {
        nowScale = scale;
      } else {
        nowScale = getScale();
      }
      let ret = arBigimgscale[0];
      for (let i = arBigimgscale.length - 1; i >= 0; i--) {
        const item = arBigimgscale[i];
        if (item.scale >= nowScale) {
          ret = item;
          break;
        }
      }
      return ret;
    }
    function urlToCanvas(url2) {
      let domImg = document.createElement("img");
      domImg.src = url2;
      let domCan = document.createElement("canvas");
      domCan.width = domImg.width;
      domCan.height = domImg.height;
      let context0 = domCan.getContext("2d");
      context0?.drawImage(domImg, 0, 0, domImg.width, domImg.height);
      return domCan;
    }
    async function getCanvasBase64(zoom, quality) {
      let blob = await getCanvasBlob(zoom, quality);
      if (blob == null) {
        return "";
      }
      let base64 = await blobToBase64(blob);
      return base64;
    }
    async function getCanvasBlob(zoom, quality, type = "png", q = 0.8) {
      let can = await getCanvas();
      if (can === null) {
        return null;
      }
      if (zoom < 1) {
        can = getCanvasZoom(can, zoom, quality);
      }
      let blob = null;
      await new Promise((resolve, reject) => {
        if (can === null) {
          return null;
        }
        let outputType = "image/png";
        if (dataType === "video") {
          outputType = "image/jpeg";
        }
        if (type === "webp") {
          outputType = "image/webp";
        }
        if (type === "jpg" || type === "jpeg") {
          outputType = "image/jpeg";
          let cc = document.createElement("canvas");
          cc.width = can.width;
          cc.height = can.height;
          let context = cc.getContext("2d");
          context.fillStyle = "#FFFFFF";
          context.fillRect(0, 0, can.width, can.height);
          context.drawImage(can, 0, 0, can.width, can.height);
          can = cc;
        }
        can.toBlob((b) => {
          blob = b;
          resolve(true);
        }, outputType, q);
      });
      return blob;
    }
    async function getCanvas() {
      if (dataType === "bigimg") {
        return temp_can;
      }
      if (dataType === "img") {
        temp_can = document.createElement("canvas");
        temp_can.width = getOriginalWidth();
        temp_can.height = getOriginalHeight();
        let context0 = temp_can.getContext("2d");
        context0?.drawImage(dom_img, 0, 0, getOriginalWidth(), getOriginalHeight());
        return temp_can;
      }
      if (dataType === "video") {
        temp_can = document.createElement("canvas");
        temp_can.width = getOriginalWidth();
        temp_can.height = getOriginalHeight();
        let context0 = temp_can.getContext("2d");
        context0?.drawImage(dom_video, 0, 0, getOriginalWidth(), getOriginalHeight());
        return temp_can;
      }
      if (dataType === "bigimgscale") {
        if (temp_bigimgscale[1] != void 0) {
          return temp_bigimgscale[1];
        } else {
          let p = await new Promise((resolve, reject) => {
            let tempUrl = getUrl();
            let domImg = document.createElement("img");
            domImg.addEventListener("load", (e) => {
              if (tempUrl != getUrl()) {
                resolve(false);
                return;
              }
              temp_bigimgscale[1] = urlToCanvas(tempUrl);
              resolve(true);
            });
            domImg.addEventListener("error", (e) => {
              resolve(false);
            });
            domImg.src = tempUrl;
          });
          if (p) {
            if (temp_bigimgscale[1] != void 0) {
              return temp_bigimgscale[1];
            } else {
              return null;
            }
          } else {
            return null;
          }
        }
      }
      return null;
    }
    async function blobToBase64(blob) {
      return new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    }
    function setLoading(val, delay = 200) {
      if (val) {
        setTimeout(() => {
          if ((/* @__PURE__ */ new Date()).getTime() > temp_dateShowLoading) {
            dom_loading.style.display = "block";
          }
        }, delay);
        temp_dateShowLoading = (/* @__PURE__ */ new Date()).getTime() + delay - 1;
      } else {
        temp_dateShowLoading = 99999999999999;
        dom_loading.style.display = "none";
      }
    }
    function getMargin() {
      return { top: marginTop, right: marginRight, bottom: marginBottom, left: marginLeft };
    }
    function setMargin(_top, _right, _bottom, _left) {
      marginTop = _top;
      marginLeft = _left;
      marginBottom = _bottom;
      marginRight = _right;
    }
    function getDpizoom() {
      return dpizoom;
    }
    function setDpizoom(val, isOnlyRun = false) {
      if (val == -1) {
        val = window.devicePixelRatio;
        if (isOnlyRun === false) {
          isDpizoomAUto = true;
        }
      } else {
        if (isOnlyRun === false) {
          isDpizoomAUto = false;
        }
      }
      dom_dpizoom.style.zoom = 1 / val;
      dpizoom = val;
    }
    function getOverflowDistance() {
      return overflowDistance;
    }
    function setOverflowDistance(_v) {
      overflowDistance = _v;
    }
    function getRendering() {
      return rendering;
    }
    function setRendering(_renderin, isOnlyRun = false) {
      if (isOnlyRun === false) {
        rendering = _renderin;
      }
      if (_renderin === 0 /* auto */) {
        dom_data.style.imageRendering = "auto";
      } else if (_renderin === 1 /* pixelated */) {
        dom_data.style.imageRendering = "pixelated";
      } else if (_renderin === 2 /* autoOrPixelated */) {
        if (getZoomRatio() > 1) {
          dom_data.style.imageRendering = "pixelated";
        } else {
          dom_data.style.imageRendering = "auto";
        }
      }
    }
    function setEventChangeZoom(_func) {
      eventChangeZoom = _func;
    }
    function getEventChangeZoom() {
      return eventChangeZoom;
    }
    function setEventChangeDeg(_func) {
      eventChangeDeg = _func;
    }
    function getEventChangeDeg() {
      return eventChangeDeg;
    }
    function setEventChangeMirror(_func) {
      eventChangeMirror = _func;
    }
    function getEventChangeMirror() {
      return eventChangeMirror;
    }
    function setEventChangeXY(_func) {
      eventChangeXY = _func;
    }
    function getEventChangeXY() {
      return eventChangeXY;
    }
    function getZoomRatio() {
      return dom_data.offsetWidth / getOriginalWidth();
    }
    function _eventLimitMax() {
      if (getOriginalWidth() > 100 || getOriginalHeight() > 100) {
        if (getZoomRatio() > 50) {
          return true;
        }
      }
      if (dom_data.offsetWidth > 999999 || dom_data.offsetHeight > 999999) {
        return true;
      }
      return false;
    }
    function _eventLimitMin() {
      if (getOriginalWidth() <= 10 || getOriginalHeight() <= 10) {
        if (dom_data.offsetWidth <= 1 || dom_data.offsetHeight <= 1) {
          return true;
        }
      } else {
        if (dom_data.offsetWidth <= 10 || dom_data.offsetHeight <= 10) {
          return true;
        }
      }
      return false;
    }
    function getEventLimitMax() {
      return eventLimitMax;
    }
    function setEventLimitMax(_func) {
      eventLimitMax = _func;
    }
    function getEventLimitMin() {
      return eventLimitMin;
    }
    function setEventLimitMin(_func) {
      eventLimitMin = _func;
    }
    function setEventHighQualityLimit(_func) {
      eventHighQualityLimit = _func;
    }
    function setAlign(_type) {
      let type_horizontal = "center";
      let type_vertical = "center";
      let x = 0;
      let y = 0;
      if (_type === 9 /* none */) {
        return;
      }
      if (_type === 0 /* top */) {
        type_horizontal = "center";
        type_vertical = "top";
      }
      if (_type === 1 /* right */) {
        type_horizontal = "right";
        type_vertical = "center";
      }
      if (_type === 3 /* left */) {
        type_horizontal = "left";
        type_vertical = "center";
      }
      if (_type === 2 /* bottom */) {
        type_horizontal = "center";
        type_vertical = "bottom";
      }
      if (_type === 4 /* topRight */) {
        type_horizontal = "right";
        type_vertical = "top";
      }
      if (_type === 5 /* bottomRight */) {
        type_horizontal = "right";
        type_vertical = "bottom";
      }
      if (_type === 6 /* topLeft */) {
        type_horizontal = "left";
        type_vertical = "top";
      }
      if (_type === 7 /* bottomLeft */) {
        type_horizontal = "left";
        type_vertical = "bottom";
      }
      if (_type === 8 /* center */) {
        type_horizontal = "center";
        type_vertical = "center";
      }
      if (type_horizontal === "left") {
        x = marginLeft;
      }
      if (type_horizontal === "center") {
        x = (dom_dpizoom.offsetWidth - dom_con.offsetWidth) / 2;
      }
      if (type_horizontal === "right") {
        x = dom_dpizoom.offsetWidth - dom_con.offsetWidth - marginRight;
      }
      if (type_vertical === "top") {
        y = marginTop;
      }
      if (type_vertical === "center") {
        y = (dom_dpizoom.offsetHeight - dom_con.offsetHeight) / 2;
      }
      if (type_vertical === "bottom") {
        y = dom_dpizoom.offsetHeight - dom_con.offsetHeight - marginBottom;
      }
      setXY(x, y, 0);
      init_point(false);
    }
    function getOriginalWidth() {
      return temp_originalWidth;
    }
    function getOriginalHeight() {
      return temp_originalHeight;
    }
    function setDataSize(_width) {
      if (dataType === "img") {
        let ratio = getOriginalHeight() / getOriginalWidth();
        dom_data.style.width = _width + "px";
        dom_data.style.height = _width * ratio + "px";
        dom_img.style.width = _width + "px";
        dom_img.style.height = _width * ratio + "px";
      }
      if (dataType === "bigimg" || dataType === "bigimgscale") {
        let ratio = getOriginalHeight() / getOriginalWidth();
        let _w = _width;
        let _h = _width * ratio;
        dom_data.style.width = _w + "px";
        dom_data.style.height = _h + "px";
      }
      if (dataType === "video") {
        let ratio = getOriginalHeight() / getOriginalWidth();
        dom_data.style.width = _width + "px";
        dom_data.style.height = _width * ratio + "px";
        dom_video.style.width = _width + "px";
        dom_video.style.height = _width * ratio + "px";
      }
    }
    function getBigimgTemp() {
      if (dataType === "bigimgscale") {
        return getBigimgTemp_bigimgscale();
      }
      if (dataType === "bigimg") {
        return getBigimgTemp_bigimg();
      }
      return null;
    }
    var temp_bigimg = [];
    function getBigimgTemp_bigimg() {
      let x = 0.8;
      let len = 6;
      let _scale = getScale();
      if (_scale > 0.5) {
        return {
          img: temp_can,
          scale: 1
        };
      }
      if (temp_bigimg[0] === void 0) {
        temp_bigimg[0] = getCanvasZoom(temp_can, x, "medium");
      }
      for (let i = 1; i < len; i++) {
        if (temp_bigimg[i] === void 0) {
          let last = temp_bigimg[i - 1];
          temp_bigimg[i] = getCanvasZoom(last, x, "medium");
        }
        if (Math.pow(x, i + 2) < _scale) {
          return {
            img: temp_bigimg[i],
            scale: Math.pow(x, i + 1)
          };
        }
      }
      return {
        img: temp_bigimg[temp_bigimg.length - 1],
        scale: Math.pow(x, temp_bigimg.length)
      };
    }
    function getCanvasZoom(img, zoom, quality) {
      let width = Math.floor(img.width * zoom);
      let height = Math.floor(img.height * zoom);
      let cs = document.createElement("canvas");
      cs.width = width;
      cs.height = height;
      let context0 = cs.getContext("2d");
      context0.imageSmoothingQuality = quality;
      context0.drawImage(img, 0, 0, width, height);
      return cs;
    }
    var temp_bigimgscale = {};
    var temp_bigimgscaleKey = [];
    function getBigimgTemp_bigimgscale() {
      let nowItem = getBigimgscaleItem();
      if (temp_bigimgscale[nowItem.scale] != void 0) {
        return {
          img: temp_bigimgscale[nowItem.scale],
          scale: nowItem.scale
        };
      }
      if (temp_bigimgscaleKey.indexOf(nowItem.scale) === -1) {
        worker.postMessage({
          url: nowItem.url,
          tempUrl: getUrl(),
          scale: nowItem.scale
        });
      }
      temp_bigimgscaleKey.push(nowItem.scale);
      let arKey = Object.keys(temp_bigimgscale);
      let sc = Number(arKey[0]);
      for (let i = 0; i < arKey.length; i++) {
        let key = Number(arKey[i]);
        if (key >= sc && key <= nowItem.scale) {
          sc = key;
        }
      }
      return {
        img: temp_bigimgscale[sc],
        scale: sc
      };
    }
    try {
      var worker = new Worker("./js/TiefseeviewWorker.js");
      worker.addEventListener("message", function(e) {
        let tempUrl = e.data.tempUrl;
        let url2 = e.data.url;
        let scale = e.data.scale;
        let domImg = e.data.img;
        if (tempUrl != getUrl()) {
          return;
        }
        let domCan = document.createElement("canvas");
        domCan.width = domImg.width;
        domCan.height = domImg.height;
        let context0 = domCan.getContext("2d");
        context0?.drawImage(domImg, 0, 0, domImg.width, domImg.height);
        temp_bigimgscale[scale] = domCan;
        bigimgDraw(true);
      }, false);
    } catch (e2) {
      console.log("Worker \u8F09\u5165\u5931\u6557\uFF0C\u7121\u6CD5\u4F7F\u7528\u300Cbigimgscale\u300D");
    }
    var temp_drawImage = {
      scale: -1,
      sx: 0,
      sy: 0,
      sWidth: 1,
      sHeight: 1,
      dx: 0,
      dy: 0,
      dWidth: 1,
      dHeight: 1
    };
    async function bigimgDraw(IsImmediatelyRun) {
      if (dataType === "bigimg" || dataType === "bigimgscale") {
      } else {
        return;
      }
      if (getOriginalWidth() === 0) {
        return;
      }
      if (IsImmediatelyRun === true) {
        temp_drawImage = {
          scale: -123,
          sx: 0,
          sy: 0,
          sWidth: 1,
          sHeight: 1,
          dx: 0,
          dy: 0,
          dWidth: 1,
          dHeight: 1
        };
      }
      let bigimgTemp = getBigimgTemp();
      if (bigimgTemp === null) {
        return;
      }
      let can = bigimgTemp.img;
      if (can == null) {
        return;
      }
      let temp_can_width = can.width;
      let temp_can_height = can.height;
      let _w = toNumber(dom_data.style.width);
      let _h = toNumber(dom_data.style.height);
      let _margin = 35;
      let _scale = _w / getOriginalWidth();
      let radio_can = 1;
      if (_w > getOriginalWidth()) {
        radio_can = _w / getOriginalWidth();
      }
      dom_bigimg.style.width = _w + "px";
      dom_bigimg.style.height = _h + "px";
      let img_left = -toNumber(dom_con.style.left);
      let img_top = -toNumber(dom_con.style.top);
      let origPoint1 = getOrigPoint(img_left, img_top, _w, _h, degNow);
      let origPoint2 = getOrigPoint(img_left + dom_dpizoom.offsetWidth, img_top, _w, _h, degNow);
      let origPoint3 = getOrigPoint(img_left + dom_dpizoom.offsetWidth, img_top + dom_dpizoom.offsetHeight, _w, _h, degNow);
      let origPoint4 = getOrigPoint(img_left, img_top + dom_dpizoom.offsetHeight, _w, _h, degNow);
      function calc(_p) {
        if (mirrorVertical) {
          _p.y = toNumber(dom_data.style.height) - _p.y;
        }
        if (mirrorHorizontal) {
          _p.x = toNumber(dom_data.style.width) - _p.x;
        }
        return _p;
      }
      origPoint1 = calc(origPoint1);
      origPoint2 = calc(origPoint2);
      origPoint3 = calc(origPoint3);
      origPoint4 = calc(origPoint4);
      img_left = origPoint1.x;
      img_top = origPoint1.y;
      if (img_left > origPoint1.x) {
        img_left = origPoint1.x;
      }
      if (img_left > origPoint2.x) {
        img_left = origPoint2.x;
      }
      if (img_left > origPoint3.x) {
        img_left = origPoint3.x;
      }
      if (img_left > origPoint4.x) {
        img_left = origPoint4.x;
      }
      if (img_top > origPoint1.y) {
        img_top = origPoint1.y;
      }
      if (img_top > origPoint2.y) {
        img_top = origPoint2.y;
      }
      if (img_top > origPoint3.y) {
        img_top = origPoint3.y;
      }
      if (img_top > origPoint4.y) {
        img_top = origPoint4.y;
      }
      let viewWidth = 1;
      let viewHeight = 1;
      if (viewWidth < origPoint1.x) {
        viewWidth = origPoint1.x;
      }
      if (viewWidth < origPoint2.x) {
        viewWidth = origPoint2.x;
      }
      if (viewWidth < origPoint3.x) {
        viewWidth = origPoint3.x;
      }
      if (viewWidth < origPoint4.x) {
        viewWidth = origPoint4.x;
      }
      if (viewHeight < origPoint1.y) {
        viewHeight = origPoint1.y;
      }
      if (viewHeight < origPoint2.y) {
        viewHeight = origPoint2.y;
      }
      if (viewHeight < origPoint3.y) {
        viewHeight = origPoint3.y;
      }
      if (viewHeight < origPoint4.y) {
        viewHeight = origPoint4.y;
      }
      viewWidth = viewWidth - img_left;
      viewHeight = viewHeight - img_top;
      let sx = (img_left - _margin) / _scale;
      let sy = (img_top - _margin) / _scale;
      let sWidth = (viewWidth + _margin * 2) / _scale * radio_can;
      let sHeight = (viewHeight + _margin * 2) / _scale * radio_can;
      let dx = img_left - _margin;
      let dy = img_top - _margin;
      let dWidth = viewWidth + _margin * 2;
      let dHeight = viewHeight + _margin * 2;
      function toFloor() {
        sx = Math.floor(sx);
        sy = Math.floor(sy);
        sWidth = Math.floor(sWidth);
        sHeight = Math.floor(sHeight);
        dx = Math.floor(dx);
        dy = Math.floor(dy);
        dWidth = Math.floor(dWidth);
        dHeight = Math.floor(dHeight);
      }
      toFloor();
      if (_scale != temp_drawImage.scale || Math.abs(dx - temp_drawImage.dx) > _margin / 2 || Math.abs(dy - temp_drawImage.dy) > _margin / 2 || Math.abs(sWidth - temp_drawImage.sWidth) > _margin / 2 || Math.abs(sHeight - temp_drawImage.sHeight) > _margin / 2) {
        temp_drawImage = {
          scale: _scale,
          sx,
          sy,
          sWidth,
          sHeight,
          dx,
          dy,
          dWidth,
          dHeight
        };
        dom_bigimg_canvas.width = Math.floor((viewWidth + _margin * 2) / radio_can);
        dom_bigimg_canvas.height = Math.floor((viewHeight + _margin * 2) / radio_can);
        dom_bigimg_canvas.style.width = Math.floor(viewWidth + _margin * 2) + "px";
        dom_bigimg_canvas.style.height = Math.floor(viewHeight + _margin * 2) + "px";
        dom_bigimg_canvas.style.left = dx + "px";
        dom_bigimg_canvas.style.top = dy + "px";
        let context = dom_bigimg_canvas.getContext("2d");
        temp_canvasSN += 1;
        let tc = temp_canvasSN;
        let resizeQuality = "high";
        if (can.width * can.height > eventHighQualityLimit() || isPinching) {
          sx = sx * bigimgTemp.scale;
          sy = sy * bigimgTemp.scale;
          sWidth = sWidth * bigimgTemp.scale;
          sHeight = sHeight * bigimgTemp.scale;
          dWidth = dWidth;
          dHeight = dHeight;
          toFloor();
          context.drawImage(
            can,
            sx,
            sy,
            sWidth,
            sHeight,
            0,
            0,
            dWidth,
            dHeight
          );
        } else if (_scale >= 1 && bigimgTemp.scale < 1) {
          sx = sx * bigimgTemp.scale;
          sy = sy * bigimgTemp.scale;
          dWidth = dWidth / bigimgTemp.scale;
          dHeight = dHeight / bigimgTemp.scale;
          toFloor();
          context.drawImage(
            can,
            sx,
            sy,
            sWidth,
            sHeight,
            0,
            0,
            dWidth,
            dHeight
          );
        } else if (_scale >= 1) {
          sx = sx * bigimgTemp.scale;
          sy = sy * bigimgTemp.scale;
          dWidth = dWidth / bigimgTemp.scale;
          dHeight = dHeight / bigimgTemp.scale;
          toFloor();
          const oc = new OffscreenCanvas(sWidth, sHeight);
          const oc2d = oc.getContext("2d");
          if (oc2d == null) {
            return;
          }
          oc2d.drawImage(
            can,
            sx,
            sy,
            sWidth,
            sHeight,
            0,
            0,
            sWidth,
            sHeight
          );
          resizeQuality = "medium";
          await createImageBitmap(
            oc,
            0,
            0,
            sWidth,
            sHeight,
            { resizeWidth: dWidth, resizeHeight: dHeight, resizeQuality }
          ).then(function(sprites) {
            if (tc === temp_canvasSN) {
              context.drawImage(sprites, 0, 0);
            }
          });
        } else if (sWidth > temp_can_width && sHeight > temp_can_height) {
          sWidth = temp_can_width;
          sHeight = temp_can_height;
          sx = dx * -1;
          sy = dy * -1;
          dWidth = temp_can_width * _scale / bigimgTemp.scale;
          dHeight = temp_can_height * _scale / bigimgTemp.scale;
          toFloor();
          await createImageBitmap(
            can,
            0,
            0,
            sWidth,
            sHeight,
            { resizeWidth: dWidth, resizeHeight: dHeight, resizeQuality }
          ).then(function(sprites) {
            if (tc === temp_canvasSN) {
              context.drawImage(sprites, sx, sy);
            }
          });
        } else if (sWidth > temp_can_width == false && sHeight > temp_can_height) {
          sHeight = temp_can_height;
          sx = sx * bigimgTemp.scale;
          sy = dy * -1;
          dWidth = dWidth / bigimgTemp.scale;
          dHeight = getOriginalHeight() * _scale;
          toFloor();
          await createImageBitmap(
            can,
            sx,
            0,
            sWidth,
            sHeight,
            { resizeWidth: dWidth, resizeHeight: dHeight, resizeQuality }
          ).then(function(sprites) {
            if (tc === temp_canvasSN) {
              context.drawImage(sprites, 0, sy);
            }
          });
        } else if (sWidth > temp_can_width && sHeight > temp_can_height == false) {
          sWidth = temp_can_width;
          sx = dx * -1;
          sy = sy * bigimgTemp.scale;
          dWidth = getOriginalWidth() * _scale;
          dHeight = dHeight / bigimgTemp.scale;
          toFloor();
          await createImageBitmap(
            can,
            0,
            sy,
            sWidth,
            sHeight,
            { resizeWidth: dWidth, resizeHeight: dHeight, resizeQuality }
          ).then(function(sprites) {
            if (tc === temp_canvasSN) {
              context.drawImage(sprites, sx, 0);
            }
          });
        } else if (sWidth > temp_can_width == false && sHeight > temp_can_height == false) {
          sx = sx * bigimgTemp.scale;
          dWidth = dWidth / bigimgTemp.scale;
          sy = sy * bigimgTemp.scale;
          dHeight = dHeight / bigimgTemp.scale;
          toFloor();
          await createImageBitmap(
            can,
            sx,
            sy,
            sWidth,
            sHeight,
            { resizeWidth: dWidth, resizeHeight: dHeight, resizeQuality }
          ).then(function(sprites) {
            if (tc === temp_canvasSN) {
              context.drawImage(sprites, 0, 0);
            }
          });
        }
      }
    }
    function getScale() {
      let _w = toNumber(dom_data.style.width);
      let _scale = _w / getOriginalWidth();
      return _scale;
    }
    function zoomFull(_type, _val, _x, _y) {
      temp_TiefseeviewZoomType = _type;
      if (_val != void 0) {
        temp_TiefseeviewZoomTypeVal = _val;
      }
      if (_type === 7 /* windowWidthRatio */ || _type === 8 /* windowHeightRatio */ || _type === 2 /* fiwWindowWidth */ || _type === 3 /* fitWindowHeight */ || _type === 1 /* fitWindow */ || _type === 0 /* fitWindowOrImageOriginal */) {
        temp_zoomWithWindow = true;
      } else {
        temp_zoomWithWindow = false;
      }
      if (_type === 4 /* imageOriginal */) {
        let tatio = getOriginalWidth() / dom_con.offsetWidth;
        if (_x !== void 0 && _y !== void 0) {
          zoomIn(_x, _y, tatio);
        } else {
          zoomIn(void 0, void 0, tatio);
        }
      } else {
        let _w = getZoomFull_width(_type, _val);
        setDataSize(_w);
        setXY(
          toNumber(dom_con.style.left) * 0,
          toNumber(dom_con.style.top) * 0,
          0
        );
        init_point(false);
        eventChangeZoom(getZoomRatio());
        setRendering(rendering);
      }
    }
    function getZoomFull_scale(_type, _val) {
      let _w = getZoomFull_width(_type, _val);
      return _w / getOriginalWidth();
    }
    function getZoomFull_width(_type, _val) {
      if (_type === void 0) {
        _type = 1 /* fitWindow */;
      }
      if (_val === void 0) {
        _val = 100;
      }
      let _w = 1;
      let rect = getRotateRect(getOriginalWidth(), getOriginalHeight(), 0, 0, degNow);
      let dom_con_offsetWidth = rect.rectWidth;
      let dom_con_offsetHeight = rect.rectHeight;
      if (_type === 0 /* fitWindowOrImageOriginal */) {
        if (getOriginalWidth() > dom_dpizoom.offsetWidth - marginLeft - marginRight || getOriginalHeight() > dom_dpizoom.offsetHeight - marginTop - marginBottom) {
          _type = 1 /* fitWindow */;
        } else {
          _type = 4 /* imageOriginal */;
        }
      }
      if (_type === 4 /* imageOriginal */) {
        _w = getOriginalWidth();
      }
      if (_type === 1 /* fitWindow */) {
        let ratio_w = dom_con_offsetWidth / (dom_dpizoom.offsetWidth - marginLeft - marginRight);
        let ratio_h = dom_con_offsetHeight / (dom_dpizoom.offsetHeight - marginTop - marginBottom);
        if (ratio_w > ratio_h) {
          _type = 2 /* fiwWindowWidth */;
        } else {
          _type = 3 /* fitWindowHeight */;
        }
      }
      if (_type === 2 /* fiwWindowWidth */) {
        _val = 100;
        _type = 7 /* windowWidthRatio */;
      }
      if (_type === 3 /* fitWindowHeight */) {
        _val = 100;
        _type = 8 /* windowHeightRatio */;
      }
      if (_type === 7 /* windowWidthRatio */) {
        let w = dom_dpizoom.offsetWidth - marginLeft - marginRight - 5;
        if (w < 10) {
          w = 10;
        }
        let ratio = getOriginalWidth() / dom_con_offsetWidth;
        _w = w * ratio * (_val / 100);
      }
      if (_type === 8 /* windowHeightRatio */) {
        let w = dom_dpizoom.offsetHeight - marginTop - marginBottom - 5;
        if (w < 10) {
          w = 10;
        }
        let ratio = getOriginalWidth() / dom_con_offsetWidth;
        let ratio_xy = dom_con_offsetWidth / dom_con_offsetHeight;
        _w = w * ratio * ratio_xy * (_val / 100);
      }
      if (_type === 5 /* imageWidthPx */) {
        let ratio = getOriginalWidth() / dom_con_offsetWidth;
        _w = toNumber(_val) * ratio;
      }
      if (_type === 6 /* imageHeightPx */) {
        let ratio = getOriginalWidth() / dom_con_offsetWidth;
        let ratio_xy = dom_con_offsetWidth / dom_con_offsetHeight;
        _w = toNumber(_val) * ratio * ratio_xy;
      }
      return _w;
    }
    function zoomIn(_x, _y, _zoomRatio, _rendering) {
      if (_x === void 0) {
        _x = dom_dpizoom.offsetWidth / 2;
      } else {
        _x *= dpizoom;
      }
      if (_y === void 0) {
        _y = dom_dpizoom.offsetHeight / 2;
      } else {
        _y *= dpizoom;
      }
      if (_zoomRatio === void 0) {
        _zoomRatio = zoomRatio;
      }
      if (_rendering === void 0) {
        _rendering = rendering;
      }
      setRendering(_rendering, true);
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
      setDataSize(w);
      var xxx = _x - toNumber(dom_con.style.left);
      var yyy = _y - toNumber(dom_con.style.top);
      var xx2 = dom_con.offsetWidth - dom_con.offsetWidth / _zoomRatio;
      var yy2 = dom_con.offsetHeight - dom_con.offsetHeight / _zoomRatio;
      setXY(
        toNumber(dom_con.style.left) - xxx / dom_con.offsetWidth * xx2 * _zoomRatio,
        toNumber(dom_con.style.top) - yyy / dom_con.offsetHeight * yy2 * _zoomRatio,
        0
      );
      init_point(false);
      eventChangeZoom(getZoomRatio());
    }
    function zoomOut(_x, _y, _zoomRatio) {
      if (_zoomRatio === void 0) {
        _zoomRatio = 1 / zoomRatio;
      }
      zoomIn(_x, _y, _zoomRatio);
    }
    function getEventMouseWheel() {
      return eventMouseWheel;
    }
    function setEventMouseWheel(_func) {
      eventMouseWheel = _func;
    }
    function sendWheelEvent(event) {
      var newEvent = new WheelEvent("wheel", {
        clientX: event.x * getDpizoom(),
        clientY: event.y * getDpizoom(),
        deltaX: event.deltaX,
        deltaY: event.deltaY,
        deltaZ: event.deltaZ,
        deltaMode: event.deltaMode
      });
      dom_dpizoom.dispatchEvent(newEvent);
    }
    function getIsOverflowX() {
      if (dom_con.offsetWidth + marginLeft + marginRight > dom_dpizoom.offsetWidth) {
        return true;
      }
      return false;
    }
    function getIsOverflowY() {
      if (dom_con.offsetHeight + marginTop + marginBottom > dom_dpizoom.offsetHeight) {
        return true;
      }
      return false;
    }
    function init_scroll() {
      scrollX.update(
        dom_con.offsetWidth + marginLeft + marginRight,
        dom_dpizoom.offsetWidth,
        toNumber(dom_con.style.left) * -1 + marginLeft
      );
      scrollY.update(
        dom_con.offsetHeight + marginTop + marginBottom,
        dom_dpizoom.offsetHeight,
        toNumber(dom_con.style.top) * -1 + marginTop
      );
    }
    async function init_point(isAnimation) {
      dom_con.style.width = dom_data.getBoundingClientRect().width + "px";
      dom_con.style.height = dom_data.getBoundingClientRect().height + "px";
      init_scroll();
      if (isAnimation === void 0) {
        isAnimation = true;
      }
      let bool_w = getIsOverflowX();
      let bool_h = getIsOverflowY();
      let top = toNumber(dom_con.style.top);
      let left = toNumber(dom_con.style.left);
      if (bool_w && bool_h) {
        if (toNumber(dom_con.style.top) > marginTop) {
          top = marginTop;
        }
        if (toNumber(dom_con.style.left) > marginLeft) {
          left = marginLeft;
        }
        let t = dom_dpizoom.offsetHeight - dom_con.offsetHeight - marginBottom;
        if (toNumber(dom_con.style.top) < t) {
          top = t;
        }
        let l = dom_dpizoom.offsetWidth - dom_con.offsetWidth - marginRight;
        if (toNumber(dom_con.style.left) < l) {
          left = l;
        }
      }
      if (bool_w === false && bool_h) {
        if (toNumber(dom_con.style.top) > marginTop) {
          top = marginTop;
        }
        let t = dom_dpizoom.offsetHeight - dom_con.offsetHeight - marginBottom;
        if (toNumber(dom_con.style.top) < t) {
          top = t;
        }
        left = (dom_dpizoom.offsetWidth - dom_con.offsetWidth) / 2;
      }
      if (bool_w && bool_h === false) {
        if (toNumber(dom_con.style.left) > marginLeft) {
          left = marginLeft;
        }
        let l = dom_dpizoom.offsetWidth - dom_con.offsetWidth - marginRight;
        if (toNumber(dom_con.style.left) < l) {
          left = l;
        }
        top = (dom_dpizoom.offsetHeight - dom_con.offsetHeight) / 2;
      }
      if (bool_w === false && bool_h === false) {
        left = (dom_dpizoom.offsetWidth - dom_con.offsetWidth) / 2;
        top = (dom_dpizoom.offsetHeight - dom_con.offsetHeight) / 2;
      }
      if (isAnimation) {
        await setXY(left, top, 100);
      } else {
        setXY(left, top, 0);
      }
    }
    async function setDegForward(_x, _y, isAnimation = true) {
      var deg = degNow;
      deg = (Math.floor(deg / 90) + 1) * 90;
      await setDeg(deg, _x, _y, isAnimation);
    }
    async function setDegReverse(_x, _y, isAnimation = true) {
      var deg = degNow;
      deg = (Math.ceil(deg / 90) - 1) * 90;
      await setDeg(deg, _x, _y, isAnimation);
    }
    function getMirrorHorizontal() {
      return mirrorHorizontal;
    }
    async function setMirrorHorizontal(bool, _x, _y) {
      if (degNow != 0) {
        setDeg(360 - degNow, void 0, void 0, true);
      }
      mirrorHorizontal = bool;
      eventChangeMirror(mirrorHorizontal, mirrorVertical);
      let x;
      let y;
      if (_x !== void 0 && _y !== void 0) {
        x = _x * dpizoom;
        y = _y * dpizoom;
      } else {
        x = dom_dpizoom.offsetWidth / 2;
        y = dom_dpizoom.offsetHeight / 2;
      }
      let left = -toNumber(dom_con.style.left) + x;
      let top = -toNumber(dom_con.style.top) + y;
      left = dom_data.getBoundingClientRect().width - left;
      let origPoint = getOrigPoint(left, top, toNumber(dom_data.style.width), toNumber(dom_data.style.height), degNow);
      left = origPoint.x;
      top = origPoint.y;
      let rotateRect = getRotateRect(toNumber(dom_data.style.width), toNumber(dom_data.style.height), left, top, degNow);
      left = rotateRect.x;
      top = rotateRect.y;
      left = -left + x;
      top = -top + y;
      await setTransform(void 0, void 0, false);
      setXY(left, top, 0);
      if (getIsOverflowX() === false) {
        init_point(false);
      }
    }
    function getMirrorVertica() {
      return mirrorVertical;
    }
    async function setMirrorVertica(bool, _x, _y) {
      if (degNow != 0) {
        setDeg(360 - degNow, void 0, void 0, true);
      }
      mirrorVertical = bool;
      eventChangeMirror(mirrorHorizontal, mirrorVertical);
      let x;
      let y;
      if (_x !== void 0 && _y !== void 0) {
        x = _x * dpizoom;
        y = _y * dpizoom;
      } else {
        x = dom_dpizoom.offsetWidth / 2;
        y = dom_dpizoom.offsetHeight / 2;
      }
      let left = -toNumber(dom_con.style.left) + x;
      let top = -toNumber(dom_con.style.top) + y;
      top = dom_data.getBoundingClientRect().height - top;
      let origPoint = getOrigPoint(left, top, toNumber(dom_data.style.width), toNumber(dom_data.style.height), degNow);
      left = origPoint.x;
      top = origPoint.y;
      let rotateRect = getRotateRect(toNumber(dom_data.style.width), toNumber(dom_data.style.height), left, top, degNow);
      left = rotateRect.x;
      top = rotateRect.y;
      left = -left + x;
      top = -top + y;
      await setTransform(void 0, void 0, false);
      setXY(left, top, 0);
      if (getIsOverflowY() === false) {
        init_point(false);
      }
    }
    function getDeg() {
      return degNow;
    }
    async function setDeg(_deg, _x, _y, isAnimation = true) {
      degNow = _deg;
      eventChangeDeg(degNow);
      await setTransform(_x, _y, isAnimation);
    }
    function getXY() {
      return {
        x: toNumber(dom_con.style.left),
        y: toNumber(dom_con.style.top)
      };
    }
    async function setXY(_left, _top, _sp) {
      if (_top === void 0) {
        _top = toNumber(dom_con.style.top);
      }
      if (_left === void 0) {
        _left = toNumber(dom_con.style.left);
      }
      eventChangeXY(_left, _top);
      if (_sp <= 0) {
        dom_con.style.top = _top + "px";
        dom_con.style.left = _left + "px";
        init_scroll();
      } else {
        await new Promise((resolve, reject) => {
          $(dom_con).animate(
            {
              "top": _top,
              //自訂用於動畫的變數
              "left": _left
            },
            {
              step: function(now, fx) {
                let data = $(dom_data).animate()[0];
                dom_con.style.top = data.top + "px";
                dom_con.style.left = data.left + "px";
                bigimgDraw();
                init_scroll();
              },
              duration: _sp,
              //動畫時間
              start: () => {
              },
              complete: () => {
                dom_con.style.top = _top + "px";
                dom_con.style.left = _left + "px";
                resolve(0);
              },
              easing: "easeOutExpo"
            }
          );
        });
      }
      bigimgDraw();
    }
    function move(type, distance = 100) {
      const point = getXY();
      if (type === "up") {
        setXY(point.x, point.y + distance, 0);
      }
      if (type === "down") {
        setXY(point.x, point.y - distance, 0);
      }
      if (type === "right") {
        setXY(point.x + distance, point.y, 0);
      }
      if (type === "left") {
        setXY(point.x - distance, point.y, 0);
      }
      init_point(false);
    }
    async function transformRefresh(boolAnimation = true) {
      if (mirrorVertical === true) {
        await setMirrorVertica(false);
      }
      if (mirrorHorizontal === true) {
        await setMirrorHorizontal(false);
      }
      await setDeg(0, void 0, void 0, boolAnimation);
    }
    async function setTransform(_x, _y, isAnimation = true) {
      $(dom_data).stop(true, false);
      let duration = transformDuration;
      if (isAnimation == false) {
        duration = 0;
      }
      let scaleX = 1;
      if (mirrorHorizontal === true) {
        scaleX = -1;
      }
      let scaleY = 1;
      if (mirrorVertical === true) {
        scaleY = -1;
      }
      if (duration <= 0) {
        if (degNow <= 0 || degNow >= 360) {
          degNow = degNow - Math.floor(degNow / 360) * 360;
        }
        $(dom_data).animate({ "transform_rotate": degNow, "transform_scaleX": scaleX, "transform_scaleY": scaleY }, { duration: 0 });
        dom_data.style.transform = `rotate(${degNow}deg) scaleX(${scaleX}) scaleY(${scaleY})`;
        dom_data.setAttribute("transform_rotate", degNow.toString());
        init_point(false);
        return;
      }
      await new Promise((resolve, reject) => {
        $(dom_data).animate({
          "transform_rotate": degNow,
          //自訂用於動畫的變數
          "transform_scaleX": scaleX,
          "transform_scaleY": scaleY
        }, {
          start: () => {
          },
          step: function(now, fx) {
            let andata = $(dom_data).animate()[0];
            if (_x === void 0) {
              _x = dom_dpizoom.offsetWidth / 2;
            }
            if (_y === void 0) {
              _y = dom_dpizoom.offsetHeight / 2;
            }
            let _x2 = _x - toNumber(dom_con.style.left);
            let _y2 = _y - toNumber(dom_con.style.top);
            let _degNow = dom_data.getAttribute("transform_rotate");
            if (_degNow === null) {
              _degNow = "0";
            }
            let rect0 = getOrigPoint(_x2, _y2, dom_data.offsetWidth, dom_data.offsetHeight, toNumber(_degNow));
            let x4 = rect0.x;
            let y4 = rect0.y;
            let rect2 = getRotateRect(dom_data.offsetWidth, dom_data.offsetHeight, x4, y4, andata.transform_rotate);
            dom_data.style.transform = `rotate(${andata.transform_rotate}deg) scaleX(${andata.transform_scaleX}) scaleY(${andata.transform_scaleY})`;
            dom_data.setAttribute("transform_rotate", andata.transform_rotate);
            setXY(_x - rect2.x, _y - rect2.y, 0);
            init_point(false);
          },
          duration,
          //動畫時間
          complete: () => {
            if (degNow <= 0 || degNow >= 360) {
              degNow = degNow - Math.floor(degNow / 360) * 360;
            }
            $(dom_data).animate({ "transform_rotate": degNow, "transform_scaleX": scaleX, "transform_scaleY": scaleY }, { duration: 0 });
            dom_data.style.transform = `rotate(${degNow}deg) scaleX(${scaleX}) scaleY(${scaleY})`;
            dom_data.setAttribute("transform_rotate", degNow.toString());
            init_point(false);
            resolve(0);
          },
          easing: "linear"
        });
      });
    }
    EventChangePixelRatio(() => {
      if (isDpizoomAUto === true) {
        setDpizoom(window.devicePixelRatio, true);
      }
    });
    function EventChangePixelRatio(func) {
      let remove = null;
      const updatePixelRatio = () => {
        if (remove != null) {
          remove();
        }
        let mqString = `(resolution: ${window.devicePixelRatio}dppx)`;
        let media = matchMedia(mqString);
        media.addEventListener("change", updatePixelRatio);
        remove = function() {
          media.removeEventListener("change", updatePixelRatio);
        };
        func();
      };
      updatePixelRatio();
    }
    function toNumber(t) {
      if (typeof t === "number") {
        return t;
      }
      if (typeof t === "string") {
        return Number(t.replace("px", ""));
      }
      return 0;
    }
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
    function getRotateRect(width, height, x, y, deg) {
      let div = document.querySelector(".js--tiefseeview-temporary");
      let divsub = document.querySelector(".js--tiefseeview-temporary .js--tiefseeview-temporary_sub");
      if (div === null) {
        div = document.createElement("div");
        div.style.position = "fixed";
        div.style.pointerEvents = "none";
        div.style.zIndex = "-9999";
        div.setAttribute("class", "js--tiefseeview-temporary");
        div.innerHTML = `<div class="js--tiefseeview-temporary_sub"></div>`;
        document.body.appendChild(div);
        divsub = document.querySelector(".js--tiefseeview-temporary .js--tiefseeview-temporary_sub");
        divsub.style.position = "absolute";
      }
      divsub.style.left = x + "px";
      divsub.style.top = y + "px";
      div.style.width = width + "px";
      div.style.height = height + "px";
      div.style.transform = `rotate(${deg}deg)`;
      let divRect = div.getBoundingClientRect();
      let divsubRect = divsub.getBoundingClientRect();
      return {
        rectWidth: divRect.width,
        //矩形旋轉後的實際大小
        rectHeight: divRect.height,
        x: divsubRect.x - divRect.x,
        //矩形裡面某一個點旋轉後的位置
        y: divsubRect.y - divRect.y
      };
    }
    function rotateVector(vec, deg) {
      let theta = Math.PI * deg / 180;
      let cos = Math.cos(theta), sin = Math.sin(theta);
      return {
        x: vec.x * cos - vec.y * sin,
        y: vec.x * sin + vec.y * cos
      };
    }
    function getRotatedOrig(w, h, deg) {
      let points = [
        { x: 0, y: 0 },
        { x: 0, y: h },
        { x: w, y: 0 },
        { x: w, y: h }
      ].map((p) => rotateVector(p, deg));
      let minX = Math.min.apply(null, points.map((p) => p.x)), minY = Math.min.apply(null, points.map((p) => p.y));
      return {
        x: -minX,
        y: -minY
      };
    }
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
var TiefseeviewAlignType = /* @__PURE__ */ ((TiefseeviewAlignType2) => {
  TiefseeviewAlignType2[TiefseeviewAlignType2["top"] = 0] = "top";
  TiefseeviewAlignType2[TiefseeviewAlignType2["right"] = 1] = "right";
  TiefseeviewAlignType2[TiefseeviewAlignType2["bottom"] = 2] = "bottom";
  TiefseeviewAlignType2[TiefseeviewAlignType2["left"] = 3] = "left";
  TiefseeviewAlignType2[TiefseeviewAlignType2["topRight"] = 4] = "topRight";
  TiefseeviewAlignType2[TiefseeviewAlignType2["bottomRight"] = 5] = "bottomRight";
  TiefseeviewAlignType2[TiefseeviewAlignType2["topLeft"] = 6] = "topLeft";
  TiefseeviewAlignType2[TiefseeviewAlignType2["bottomLeft"] = 7] = "bottomLeft";
  TiefseeviewAlignType2[TiefseeviewAlignType2["center"] = 8] = "center";
  TiefseeviewAlignType2[TiefseeviewAlignType2["none"] = 9] = "none";
  return TiefseeviewAlignType2;
})(TiefseeviewAlignType || {});
var TiefseeviewZoomType = /* @__PURE__ */ ((TiefseeviewZoomType2) => {
  TiefseeviewZoomType2[TiefseeviewZoomType2["fitWindowOrImageOriginal"] = 0] = "fitWindowOrImageOriginal";
  TiefseeviewZoomType2[TiefseeviewZoomType2["fitWindow"] = 1] = "fitWindow";
  TiefseeviewZoomType2[TiefseeviewZoomType2["fiwWindowWidth"] = 2] = "fiwWindowWidth";
  TiefseeviewZoomType2[TiefseeviewZoomType2["fitWindowHeight"] = 3] = "fitWindowHeight";
  TiefseeviewZoomType2[TiefseeviewZoomType2["imageOriginal"] = 4] = "imageOriginal";
  TiefseeviewZoomType2[TiefseeviewZoomType2["imageWidthPx"] = 5] = "imageWidthPx";
  TiefseeviewZoomType2[TiefseeviewZoomType2["imageHeightPx"] = 6] = "imageHeightPx";
  TiefseeviewZoomType2[TiefseeviewZoomType2["windowWidthRatio"] = 7] = "windowWidthRatio";
  TiefseeviewZoomType2[TiefseeviewZoomType2["windowHeightRatio"] = 8] = "windowHeightRatio";
  return TiefseeviewZoomType2;
})(TiefseeviewZoomType || {});
var TiefseeviewImageRendering = /* @__PURE__ */ ((TiefseeviewImageRendering2) => {
  TiefseeviewImageRendering2[TiefseeviewImageRendering2["auto"] = 0] = "auto";
  TiefseeviewImageRendering2[TiefseeviewImageRendering2["pixelated"] = 1] = "pixelated";
  TiefseeviewImageRendering2[TiefseeviewImageRendering2["autoOrPixelated"] = 2] = "autoOrPixelated";
  return TiefseeviewImageRendering2;
})(TiefseeviewImageRendering || {});
