"use strict";
class TiefseeScroll {
  constructor() {
    var domScroll;
    var domBg;
    var domBox;
    var type;
    var contentHeight = 0;
    var panelHeight = 0;
    var _eventChange = (v, mode) => {
    };
    var hammerScroll;
    var startLeft = 0;
    var startTop = 0;
    this.getEventChange = getEventChange;
    this.setEventChange = setEventChange;
    this.setTop = setTop;
    this.getTop = getTop;
    this.setValue = setValue;
    this.update = update;
    this.initGeneral = initGeneral;
    this.initTiefseeScroll = initTiefseeScroll;
    function initTiefseeScroll(_domScroll, _type) {
      domScroll = _domScroll;
      type = _type;
      init();
      domScroll.addEventListener("wheel", (ev) => {
        MouseWheel(ev);
      }, true);
      const MouseWheel = (e) => {
        e.preventDefault();
        let v = getTop();
        if (e.deltaX > 0 || e.deltaY > 0) {
          setTop(v + 10, "wheel");
        } else {
          setTop(v - 10, "wheel");
        }
      };
    }
    function initGeneral(domPanel, _type) {
      let domContent = domPanel.firstElementChild;
      if (domContent === null) {
        return;
      }
      type = _type;
      if (type === "y") {
        domScroll = Lib.newDom(
          `
                    <div class="scroll-y js-noDrag">
                        <div class="scroll-bg js-noDrag"></div>
                        <div class="scroll-box js-noDrag"></div>
                    </div>`
        );
      } else {
        domScroll = Lib.newDom(
          `
                    <div class="scroll-x js-noDrag">
                        <div class="scroll-bg js-noDrag"></div>
                        <div class="scroll-box js-noDrag"></div>
                    </div>`
        );
      }
      domPanel.appendChild(domScroll);
      init();
      setEventChange((v, mode) => {
        if (mode === "set") {
          return;
        }
        if (type === "y") {
          domPanel.scrollTop = v;
        } else {
          domPanel.scrollLeft = v;
        }
      });
      domPanel.addEventListener("scroll", () => {
        let v;
        if (type === "y") {
          v = domPanel.scrollTop;
          domScroll.style.top = v + "px";
        } else {
          v = domPanel.scrollLeft;
          domScroll.style.left = v + "px";
        }
        setValue(v);
      });
      function updatePosition() {
        requestAnimationFrame(() => {
          if (type === "y") {
            domScroll.style.height = domPanel.offsetHeight + "px";
            let v = domPanel.scrollTop;
            if (v + domPanel.offsetHeight > domContent.offsetHeight) {
              domScroll.style.top = "0px";
              v = domPanel.scrollTop;
            }
            domScroll.style.top = v + "px";
            update(
              domContent.offsetHeight,
              domPanel.offsetHeight,
              getTop()
            );
            setValue(v);
          } else {
            domScroll.style.width = domPanel.offsetWidth + "px";
            let v = domPanel.scrollLeft;
            if (v + domPanel.offsetWidth > domContent.offsetWidth) {
              domScroll.style.left = "0px";
              v = domPanel.scrollLeft;
            }
            domScroll.style.left = v + "px";
            update(
              domContent.offsetWidth,
              domPanel.offsetWidth,
              getTop()
            );
            setValue(v);
          }
        });
      }
      updatePosition();
      new ResizeObserver(updatePosition).observe(domPanel);
      new ResizeObserver(updatePosition).observe(domContent);
    }
    function init() {
      domBg = domScroll.querySelector(".scroll-bg");
      domBox = domScroll.querySelector(".scroll-box");
      hammerScroll = new Hammer(domScroll, {});
      domScroll.addEventListener("mousedown", (ev) => {
        touchStart(ev);
      });
      domScroll.addEventListener("touchstart", (ev) => {
        touchStart(ev);
      });
      const touchStart = (ev) => {
        ev.preventDefault();
        startLeft = toNumber(domBox.style.left);
        startTop = toNumber(domBox.style.top);
      };
      hammerScroll.get("pan").set({ threshold: 0, direction: Hammer.DIRECTION_ALL });
      hammerScroll.on("pan", (ev) => {
        ev.preventDefault();
        let deltaX = ev["deltaX"];
        let deltaY = ev["deltaY"];
        if (type === "y") {
          let top = startTop + deltaY;
          setTop(top, "pan");
        }
        if (type === "x") {
          let left = startLeft + deltaX;
          setTop(left, "pan");
        }
        domScroll.setAttribute("action", "true");
      });
      hammerScroll.on("panend", (ev) => {
        domScroll.setAttribute("action", "");
      });
    }
    function update(_contentHeight, _panelHeight, _top) {
      if (_top === void 0) {
        _top = 0;
      }
      contentHeight = _contentHeight;
      panelHeight = _panelHeight;
      if (type === "y") {
        let h = _panelHeight / _contentHeight * domScroll.offsetHeight;
        if (h < 50) {
          h = 50;
        }
        domBox.style.height = h + "px";
      }
      if (type === "x") {
        let l = _panelHeight / _contentHeight * domScroll.offsetWidth;
        if (l < 50) {
          l = 50;
        }
        domBox.style.width = l + "px";
      }
      if (_contentHeight - 3 >= _panelHeight) {
        domScroll.style.opacity = "1";
        domScroll.style.pointerEvents = "";
      } else {
        domScroll.style.opacity = "0";
        domScroll.style.pointerEvents = "none";
      }
      setValue(_top);
    }
    function setValue(v) {
      v = v / (contentHeight - panelHeight);
      if (type === "y") {
        v = v * (domScroll.offsetHeight - domBox.offsetHeight);
      }
      if (type === "x") {
        v = v * (domScroll.offsetWidth - domBox.offsetWidth);
      }
      setTop(v, "set");
    }
    function getTop() {
      if (type === "y") {
        return toNumber(domBox.style.top);
      }
      if (type === "x") {
        return toNumber(domBox.style.left);
      }
      return 0;
    }
    function setTop(v, mode) {
      v = toNumber(v);
      if (type === "y") {
        if (v < 0) {
          v = 0;
        }
        if (v > domScroll.offsetHeight - domBox.offsetHeight) {
          v = domScroll.offsetHeight - domBox.offsetHeight;
        }
        domBox.style.top = v + "px";
      }
      if (type === "x") {
        if (v < 0) {
          v = 0;
        }
        if (v > domScroll.offsetWidth - domBox.offsetWidth) {
          v = domScroll.offsetWidth - domBox.offsetWidth;
        }
        domBox.style.left = v + "px";
      }
      eventChange(mode);
    }
    function getEventChange() {
      return _eventChange;
    }
    function setEventChange(func = (v, mode) => {
    }) {
      _eventChange = func;
    }
    function eventChange(mode) {
      let x = 0;
      if (type === "y") {
        x = domScroll.offsetHeight - domBox.offsetHeight;
        x = toNumber(domBox.style.top) / x;
        x = x * (contentHeight - panelHeight);
      }
      if (type === "x") {
        x = domScroll.offsetWidth - domBox.offsetWidth;
        x = toNumber(domBox.style.left) / x;
        x = x * (contentHeight - panelHeight);
      }
      _eventChange(x, mode);
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
  }
}
