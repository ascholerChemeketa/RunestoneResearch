"use strict";
(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_video_js_runestonevideo_js"],{

/***/ 34443:
/*!***************************************!*\
  !*** ./runestone/video/css/video.css ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 86915:
/*!**********************************************!*\
  !*** ./runestone/video/js/runestonevideo.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_js_runestonebase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/runestonebase */ 78673);
/* harmony import */ var _common_js_domutil_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../common/js/domutil.js */ 34089);
/* harmony import */ var _css_video_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../css/video.css */ 34443);






class RunestoneVideo extends _common_js_runestonebase__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(opts) {
        super(opts);
        this.divid = opts.orig.id;
        this.container = document.getElementById(this.divid);
        this.caption = "YouTube";
        if (document.getElementById("youtubescript") == null) {
            let script = document.createElement("script");
            script.id = "youtubescript";
            script.src = "https://www.youtube.com/player_api";
            document.body.appendChild(script);
        }
        this.containerDiv = this.container.parentElement;
        this.addCaption("runestone");
        this.indicate_component_ready();
    }
}

window.onPlayerStateChange = function (event) {
    let rb = new _common_js_runestonebase__WEBPACK_IMPORTED_MODULE_0__["default"]();
    let videoTime = event.target.getCurrentTime();
    let data = {
        event: "video",
        div_id: event.target.getIframe().id,
    };
    if (event.data == YT.PlayerState.PLAYING) {
        console.log("playing " + event.target.getIframe().id);
        data.act = "play:" + videoTime;
    } else if (event.data == YT.PlayerState.ENDED) {
        console.log("ended " + event.target.getIframe().id);
        data.act = "complete";
    } else if (event.data == YT.PlayerState.PAUSED) {
        console.log("paused at " + videoTime);
        data.act = "pause:" + videoTime;
    } else {
        console.log(`YT Player State: ${YT.PlayerState}`);
        data.act = "ready";
    }
    rb.logBookEvent(data);
};

//Callback function to load youtube videos once IFrame Player loads
window.onYouTubeIframeAPIReady = function () {
    for (let video of document.querySelectorAll(".youtube-video")) {
        let playerVars = {};
        playerVars["start"] = (0,_common_js_domutil_js__WEBPACK_IMPORTED_MODULE_1__.getDataValue)(video, "video-start");
        if ((0,_common_js_domutil_js__WEBPACK_IMPORTED_MODULE_1__.getDataValue)(video, "video-end") != -1)
            playerVars["end"] = (0,_common_js_domutil_js__WEBPACK_IMPORTED_MODULE_1__.getDataValue)(video, "video-end");
        let player = new YT.Player((0,_common_js_domutil_js__WEBPACK_IMPORTED_MODULE_1__.getDataValue)(video, "video-divid"), {
            height: (0,_common_js_domutil_js__WEBPACK_IMPORTED_MODULE_1__.getDataValue)(video, "video-height"),
            width: (0,_common_js_domutil_js__WEBPACK_IMPORTED_MODULE_1__.getDataValue)(video, "video-width"),
            videoId: (0,_common_js_domutil_js__WEBPACK_IMPORTED_MODULE_1__.getDataValue)(video, "video-videoid"),
            align: "center",
            playerVars: playerVars,
            events: {
                onStateChange: window.onPlayerStateChange,
            },
        });
    }
};

//Need to make sure the YouTube IFrame Player API is not loaded until after
// all YouTube videos are in the DOM. Add a script tag with it after document is loaded
function addPlayerApiScript() {
    let script = document.createElement("script");
    script.src = "https://www.youtube.com/player_api";
    document.body.appendChild(script);
}
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", addPlayerApiScript);
} else {
    addPlayerApiScript();
}

document.addEventListener("runestone:login-complete", function () {
    for (let element of document.querySelectorAll(
        "[data-component=youtube]",
    )) {
        var opts = {
            orig: element,
            useRunestoneServices: eBookConfig.useRunestoneServices,
        };
        window.componentMap[element.id] = new RunestoneVideo(opts);
    }
});

if (typeof window.component_factory === "undefined") {
    window.component_factory = {};
}
window.component_factory.youtube = function (opts) {
    return new RunestoneVideo(opts);
};

window.component_factory.vimeo = function (opts) {
    return new RunestoneVideo(opts);
};


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuZXN0b25lX3ZpZGVvX2pzX3J1bmVzdG9uZXZpZGVvX2pzLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7O0FDQWE7O0FBRTZDO0FBQ0E7QUFDaEM7O0FBRTFCLDZCQUE2QixnRUFBYTtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGlCQUFpQixnRUFBYTtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBLE1BQU07QUFDTix3Q0FBd0MsZUFBZTtBQUN2RDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE4QixtRUFBWTtBQUMxQyxZQUFZLG1FQUFZO0FBQ3hCLGdDQUFnQyxtRUFBWTtBQUM1QyxtQ0FBbUMsbUVBQVk7QUFDL0Msb0JBQW9CLG1FQUFZO0FBQ2hDLG1CQUFtQixtRUFBWTtBQUMvQixxQkFBcUIsbUVBQVk7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL3ZpZGVvL2Nzcy92aWRlby5jc3M/Y2MxNiIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL3ZpZGVvL2pzL3J1bmVzdG9uZXZpZGVvLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIlwidXNlIHN0cmljdFwiO1xuXG5pbXBvcnQgUnVuZXN0b25lQmFzZSBmcm9tIFwiLi4vLi4vY29tbW9uL2pzL3J1bmVzdG9uZWJhc2VcIjtcbmltcG9ydCB7IGdldERhdGFWYWx1ZSB9IGZyb20gXCIuLi8uLi9jb21tb24vanMvZG9tdXRpbC5qc1wiO1xuaW1wb3J0IFwiLi4vY3NzL3ZpZGVvLmNzc1wiO1xuXG5jbGFzcyBSdW5lc3RvbmVWaWRlbyBleHRlbmRzIFJ1bmVzdG9uZUJhc2Uge1xuICAgIGNvbnN0cnVjdG9yKG9wdHMpIHtcbiAgICAgICAgc3VwZXIob3B0cyk7XG4gICAgICAgIHRoaXMuZGl2aWQgPSBvcHRzLm9yaWcuaWQ7XG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5kaXZpZCk7XG4gICAgICAgIHRoaXMuY2FwdGlvbiA9IFwiWW91VHViZVwiO1xuICAgICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ5b3V0dWJlc2NyaXB0XCIpID09IG51bGwpIHtcbiAgICAgICAgICAgIGxldCBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xuICAgICAgICAgICAgc2NyaXB0LmlkID0gXCJ5b3V0dWJlc2NyaXB0XCI7XG4gICAgICAgICAgICBzY3JpcHQuc3JjID0gXCJodHRwczovL3d3dy55b3V0dWJlLmNvbS9wbGF5ZXJfYXBpXCI7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNjcmlwdCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYgPSB0aGlzLmNvbnRhaW5lci5wYXJlbnRFbGVtZW50O1xuICAgICAgICB0aGlzLmFkZENhcHRpb24oXCJydW5lc3RvbmVcIik7XG4gICAgICAgIHRoaXMuaW5kaWNhdGVfY29tcG9uZW50X3JlYWR5KCk7XG4gICAgfVxufVxuXG53aW5kb3cub25QbGF5ZXJTdGF0ZUNoYW5nZSA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgIGxldCByYiA9IG5ldyBSdW5lc3RvbmVCYXNlKCk7XG4gICAgbGV0IHZpZGVvVGltZSA9IGV2ZW50LnRhcmdldC5nZXRDdXJyZW50VGltZSgpO1xuICAgIGxldCBkYXRhID0ge1xuICAgICAgICBldmVudDogXCJ2aWRlb1wiLFxuICAgICAgICBkaXZfaWQ6IGV2ZW50LnRhcmdldC5nZXRJZnJhbWUoKS5pZCxcbiAgICB9O1xuICAgIGlmIChldmVudC5kYXRhID09IFlULlBsYXllclN0YXRlLlBMQVlJTkcpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJwbGF5aW5nIFwiICsgZXZlbnQudGFyZ2V0LmdldElmcmFtZSgpLmlkKTtcbiAgICAgICAgZGF0YS5hY3QgPSBcInBsYXk6XCIgKyB2aWRlb1RpbWU7XG4gICAgfSBlbHNlIGlmIChldmVudC5kYXRhID09IFlULlBsYXllclN0YXRlLkVOREVEKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiZW5kZWQgXCIgKyBldmVudC50YXJnZXQuZ2V0SWZyYW1lKCkuaWQpO1xuICAgICAgICBkYXRhLmFjdCA9IFwiY29tcGxldGVcIjtcbiAgICB9IGVsc2UgaWYgKGV2ZW50LmRhdGEgPT0gWVQuUGxheWVyU3RhdGUuUEFVU0VEKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwicGF1c2VkIGF0IFwiICsgdmlkZW9UaW1lKTtcbiAgICAgICAgZGF0YS5hY3QgPSBcInBhdXNlOlwiICsgdmlkZW9UaW1lO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGBZVCBQbGF5ZXIgU3RhdGU6ICR7WVQuUGxheWVyU3RhdGV9YCk7XG4gICAgICAgIGRhdGEuYWN0ID0gXCJyZWFkeVwiO1xuICAgIH1cbiAgICByYi5sb2dCb29rRXZlbnQoZGF0YSk7XG59O1xuXG4vL0NhbGxiYWNrIGZ1bmN0aW9uIHRvIGxvYWQgeW91dHViZSB2aWRlb3Mgb25jZSBJRnJhbWUgUGxheWVyIGxvYWRzXG53aW5kb3cub25Zb3VUdWJlSWZyYW1lQVBJUmVhZHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgZm9yIChsZXQgdmlkZW8gb2YgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi55b3V0dWJlLXZpZGVvXCIpKSB7XG4gICAgICAgIGxldCBwbGF5ZXJWYXJzID0ge307XG4gICAgICAgIHBsYXllclZhcnNbXCJzdGFydFwiXSA9IGdldERhdGFWYWx1ZSh2aWRlbywgXCJ2aWRlby1zdGFydFwiKTtcbiAgICAgICAgaWYgKGdldERhdGFWYWx1ZSh2aWRlbywgXCJ2aWRlby1lbmRcIikgIT0gLTEpXG4gICAgICAgICAgICBwbGF5ZXJWYXJzW1wiZW5kXCJdID0gZ2V0RGF0YVZhbHVlKHZpZGVvLCBcInZpZGVvLWVuZFwiKTtcbiAgICAgICAgbGV0IHBsYXllciA9IG5ldyBZVC5QbGF5ZXIoZ2V0RGF0YVZhbHVlKHZpZGVvLCBcInZpZGVvLWRpdmlkXCIpLCB7XG4gICAgICAgICAgICBoZWlnaHQ6IGdldERhdGFWYWx1ZSh2aWRlbywgXCJ2aWRlby1oZWlnaHRcIiksXG4gICAgICAgICAgICB3aWR0aDogZ2V0RGF0YVZhbHVlKHZpZGVvLCBcInZpZGVvLXdpZHRoXCIpLFxuICAgICAgICAgICAgdmlkZW9JZDogZ2V0RGF0YVZhbHVlKHZpZGVvLCBcInZpZGVvLXZpZGVvaWRcIiksXG4gICAgICAgICAgICBhbGlnbjogXCJjZW50ZXJcIixcbiAgICAgICAgICAgIHBsYXllclZhcnM6IHBsYXllclZhcnMsXG4gICAgICAgICAgICBldmVudHM6IHtcbiAgICAgICAgICAgICAgICBvblN0YXRlQ2hhbmdlOiB3aW5kb3cub25QbGF5ZXJTdGF0ZUNoYW5nZSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgIH1cbn07XG5cbi8vTmVlZCB0byBtYWtlIHN1cmUgdGhlIFlvdVR1YmUgSUZyYW1lIFBsYXllciBBUEkgaXMgbm90IGxvYWRlZCB1bnRpbCBhZnRlclxuLy8gYWxsIFlvdVR1YmUgdmlkZW9zIGFyZSBpbiB0aGUgRE9NLiBBZGQgYSBzY3JpcHQgdGFnIHdpdGggaXQgYWZ0ZXIgZG9jdW1lbnQgaXMgbG9hZGVkXG5mdW5jdGlvbiBhZGRQbGF5ZXJBcGlTY3JpcHQoKSB7XG4gICAgbGV0IHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XG4gICAgc2NyaXB0LnNyYyA9IFwiaHR0cHM6Ly93d3cueW91dHViZS5jb20vcGxheWVyX2FwaVwiO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbn1cbmlmIChkb2N1bWVudC5yZWFkeVN0YXRlID09PSBcImxvYWRpbmdcIikge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGFkZFBsYXllckFwaVNjcmlwdCk7XG59IGVsc2Uge1xuICAgIGFkZFBsYXllckFwaVNjcmlwdCgpO1xufVxuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwicnVuZXN0b25lOmxvZ2luLWNvbXBsZXRlXCIsIGZ1bmN0aW9uICgpIHtcbiAgICBmb3IgKGxldCBlbGVtZW50IG9mIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXG4gICAgICAgIFwiW2RhdGEtY29tcG9uZW50PXlvdXR1YmVdXCIsXG4gICAgKSkge1xuICAgICAgICB2YXIgb3B0cyA9IHtcbiAgICAgICAgICAgIG9yaWc6IGVsZW1lbnQsXG4gICAgICAgICAgICB1c2VSdW5lc3RvbmVTZXJ2aWNlczogZUJvb2tDb25maWcudXNlUnVuZXN0b25lU2VydmljZXMsXG4gICAgICAgIH07XG4gICAgICAgIHdpbmRvdy5jb21wb25lbnRNYXBbZWxlbWVudC5pZF0gPSBuZXcgUnVuZXN0b25lVmlkZW8ob3B0cyk7XG4gICAgfVxufSk7XG5cbmlmICh0eXBlb2Ygd2luZG93LmNvbXBvbmVudF9mYWN0b3J5ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgd2luZG93LmNvbXBvbmVudF9mYWN0b3J5ID0ge307XG59XG53aW5kb3cuY29tcG9uZW50X2ZhY3RvcnkueW91dHViZSA9IGZ1bmN0aW9uIChvcHRzKSB7XG4gICAgcmV0dXJuIG5ldyBSdW5lc3RvbmVWaWRlbyhvcHRzKTtcbn07XG5cbndpbmRvdy5jb21wb25lbnRfZmFjdG9yeS52aW1lbyA9IGZ1bmN0aW9uIChvcHRzKSB7XG4gICAgcmV0dXJuIG5ldyBSdW5lc3RvbmVWaWRlbyhvcHRzKTtcbn07XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=