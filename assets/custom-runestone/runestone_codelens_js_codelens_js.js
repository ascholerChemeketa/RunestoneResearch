"use strict";
(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_codelens_js_codelens_js"],{

/***/ 76412:
/*!*******************************************!*\
  !*** ./runestone/codelens/js/codelens.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/runestonebase.js */ 78673);
/* harmony import */ var _pytutor_embed_bundle_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./pytutor-embed.bundle.js */ 60764);
/* harmony import */ var _pytutor_embed_bundle_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_pytutor_embed_bundle_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _css_pytutor_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../css/pytutor.css */ 93473);
/**
 * Created by bmiller on 5/10/15.
 */

/*
 Since I don't want to modify the codelens code I'll attach the logging functionality this way.
 This actually seems like a better way to do it maybe across the board to separate logging
 from the real funcionality.  It would also allow a better way of turning off/on logging..
 As long as Philip doesn't go and change the id values for the buttons and slider this will
 continue to work.... In the best of all worlds we might add a function to the visualizer to
 return the buttons, but I'm having a hard time thinking of any other use for that besides mine.
 */





function attachLoggers(codelens, divid) {
    let rb = new _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__["default"]();
    codelens.domRoot.find("#jmpFirstInstr").click(function () {
        rb.logBookEvent({ event: "codelens", act: "first", div_id: divid });
    });
    codelens.domRoot.find("#jmpLastInstr").click(function () {
        rb.logBookEvent({ event: "codelens", act: "last", div_id: divid });
    });
    codelens.domRoot.find("#jmpStepBack").click(function () {
        rb.logBookEvent({ event: "codelens", act: "back", div_id: divid });
    });
    codelens.domRoot.find("#jmpStepFwd").click(function () {
        rb.logBookEvent({ event: "codelens", act: "fwd", div_id: divid });
    });
    codelens.domRoot.find("#executionSlider").bind("slide", function (evt, ui) {
        rb.logBookEvent({ event: "codelens", act: "slide", div_id: divid });
    });
    // TODO: The component isn't quite fully initialized, but it also doesn't inherit from RunestoneBase. This is a convenient place to mark it ready for now, but it should be moved forward in time during a rewrite.
    rb.containerDiv = document.getElementById(divid);
    rb.indicate_component_ready();
}

function styleButtons(divid) {
    var myVis = $("#" + divid);
    $(myVis).find("#jmpFirstInstr").addClass("btn btn-default");
    $(myVis).find("#jmpStepBack").addClass("btn btn-danger");
    $(myVis).find("#jmpStepFwd").addClass("btn btn-success");
    $(myVis).find("#jmpLastInstr").addClass("btn btn-default");
}

if (typeof allVsualizers === "undefined") {
    window.allVisualizers = [];
}

if (typeof window.component_factory === "undefined") {
    window.component_factory = {};
}

window.component_factory.codelens = function (opts) {
    // opts is an object that will contain a key referencing the orignal dom element
    // often it will also have a key for  useRunestoneServices
    let el = opts.orig;
    let vel = el.querySelector(".pytutorVisualizer");
    let divid = vel.id;
    let lang = JSON.parse(vel.dataset.params).lang;
    // addVisualizerToPage comes from pytutor-embed
    // allTraceData is created by a series of script tags that when loaded create this
    // as a global object containing trace information.
    try {
        let startInstr = allTraceData[divid].startingInstruction || 0;
        let vis = addVisualizerToPage(allTraceData[divid], divid, {
            startingInstruction: startInstr,
            editCodeBaseURL: null,
            hideCode: false,
            lang: lang,
        });
        attachLoggers(vis, divid);
        styleButtons(divid);
        window.allVisualizers.push(vis);
    } catch (err) {
        console.log(`Error rendering CodeLens Problem ${divid}`);
        console.log(err);
    }

    window.addEventListener("codelens:answer", function (evt) {
        let rb = new _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__["default"]();
        rb.logBookEvent({
            event: "codelens",
            div_id: evt.detail.divid,
            act: "answer",
            answer: evt.detail.answer,
            correct: evt.detail.correct,
            percent: evt.detail.percent || 0,
        });
        console.log(evt);
    });
};

// After all of the libraries are loaded...
$(document).on("runestone:login-complete", function () {
    if (typeof allTraceData !== "undefined") {
        for (let divid in allTraceData) {
            let cl = document.getElementById(divid);
            if (cl === null) {
                console.log(`Could not find element with id ${divid}`);
                return;
            }
            let lang = $(cl).data("params").lang;
            try {
                if (divid in window.allTraceData) {
                    let startInstr =
                        allTraceData[divid].startingInstruction || 0;
                    var vis = addVisualizerToPage(allTraceData[divid], divid, {
                        startingInstruction: startInstr,
                        editCodeBaseURL: null,
                        hideCode: false,
                        lang: lang,
                    });
                } else {
                    alert(
                        `${divid} is missing trace data.  This is probably a build error. Please report it on github.`,
                    );
                }
                attachLoggers(vis, divid);
                styleButtons(divid);
                window.allVisualizers.push(vis);
            } catch (err) {
                console.log(`Error rendering CodeLens Problem ${divid}`);
                console.log(err);
            }
        }
        window.addEventListener("codelens:answer", function (evt) {
            let rb = new _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__["default"]();
            rb.logBookEvent({
                event: "codelens",
                div_id: evt.detail.divid,
                act: "answer",
                answer: evt.detail.answer,
                correct: evt.detail.correct,
                percent: evt.detail.percent || 0,
            });
            console.log(evt);
        });
    }
});


/***/ }),

/***/ 93473:
/*!********************************************!*\
  !*** ./runestone/codelens/css/pytutor.css ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuZXN0b25lX2NvZGVsZW5zX2pzX2NvZGVsZW5zX2pzLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRTZEO0FBQzFCO0FBQ0w7O0FBRTlCO0FBQ0EsaUJBQWlCLG1FQUFhO0FBQzlCO0FBQ0EsMEJBQTBCLGdEQUFnRDtBQUMxRSxLQUFLO0FBQ0w7QUFDQSwwQkFBMEIsK0NBQStDO0FBQ3pFLEtBQUs7QUFDTDtBQUNBLDBCQUEwQiwrQ0FBK0M7QUFDekUsS0FBSztBQUNMO0FBQ0EsMEJBQTBCLDhDQUE4QztBQUN4RSxLQUFLO0FBQ0w7QUFDQSwwQkFBMEIsZ0RBQWdEO0FBQzFFLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOLHdEQUF3RCxNQUFNO0FBQzlEO0FBQ0E7O0FBRUE7QUFDQSxxQkFBcUIsbUVBQWE7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOERBQThELE1BQU07QUFDcEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCLGtCQUFrQjtBQUNsQjtBQUNBLDJCQUEyQixPQUFPO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2QsZ0VBQWdFLE1BQU07QUFDdEU7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUIsbUVBQWE7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxDQUFDOzs7Ozs7Ozs7Ozs7QUM3SUQiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2NvZGVsZW5zL2pzL2NvZGVsZW5zLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvY29kZWxlbnMvY3NzL3B5dHV0b3IuY3NzPzk3NzciXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGVkIGJ5IGJtaWxsZXIgb24gNS8xMC8xNS5cbiAqL1xuXG4vKlxuIFNpbmNlIEkgZG9uJ3Qgd2FudCB0byBtb2RpZnkgdGhlIGNvZGVsZW5zIGNvZGUgSSdsbCBhdHRhY2ggdGhlIGxvZ2dpbmcgZnVuY3Rpb25hbGl0eSB0aGlzIHdheS5cbiBUaGlzIGFjdHVhbGx5IHNlZW1zIGxpa2UgYSBiZXR0ZXIgd2F5IHRvIGRvIGl0IG1heWJlIGFjcm9zcyB0aGUgYm9hcmQgdG8gc2VwYXJhdGUgbG9nZ2luZ1xuIGZyb20gdGhlIHJlYWwgZnVuY2lvbmFsaXR5LiAgSXQgd291bGQgYWxzbyBhbGxvdyBhIGJldHRlciB3YXkgb2YgdHVybmluZyBvZmYvb24gbG9nZ2luZy4uXG4gQXMgbG9uZyBhcyBQaGlsaXAgZG9lc24ndCBnbyBhbmQgY2hhbmdlIHRoZSBpZCB2YWx1ZXMgZm9yIHRoZSBidXR0b25zIGFuZCBzbGlkZXIgdGhpcyB3aWxsXG4gY29udGludWUgdG8gd29yay4uLi4gSW4gdGhlIGJlc3Qgb2YgYWxsIHdvcmxkcyB3ZSBtaWdodCBhZGQgYSBmdW5jdGlvbiB0byB0aGUgdmlzdWFsaXplciB0b1xuIHJldHVybiB0aGUgYnV0dG9ucywgYnV0IEknbSBoYXZpbmcgYSBoYXJkIHRpbWUgdGhpbmtpbmcgb2YgYW55IG90aGVyIHVzZSBmb3IgdGhhdCBiZXNpZGVzIG1pbmUuXG4gKi9cblxuaW1wb3J0IFJ1bmVzdG9uZUJhc2UgZnJvbSBcIi4uLy4uL2NvbW1vbi9qcy9ydW5lc3RvbmViYXNlLmpzXCI7XG5pbXBvcnQgXCIuL3B5dHV0b3ItZW1iZWQuYnVuZGxlLmpzXCI7XG5pbXBvcnQgXCIuLy4uL2Nzcy9weXR1dG9yLmNzc1wiO1xuXG5mdW5jdGlvbiBhdHRhY2hMb2dnZXJzKGNvZGVsZW5zLCBkaXZpZCkge1xuICAgIGxldCByYiA9IG5ldyBSdW5lc3RvbmVCYXNlKCk7XG4gICAgY29kZWxlbnMuZG9tUm9vdC5maW5kKFwiI2ptcEZpcnN0SW5zdHJcIikuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICByYi5sb2dCb29rRXZlbnQoeyBldmVudDogXCJjb2RlbGVuc1wiLCBhY3Q6IFwiZmlyc3RcIiwgZGl2X2lkOiBkaXZpZCB9KTtcbiAgICB9KTtcbiAgICBjb2RlbGVucy5kb21Sb290LmZpbmQoXCIjam1wTGFzdEluc3RyXCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmIubG9nQm9va0V2ZW50KHsgZXZlbnQ6IFwiY29kZWxlbnNcIiwgYWN0OiBcImxhc3RcIiwgZGl2X2lkOiBkaXZpZCB9KTtcbiAgICB9KTtcbiAgICBjb2RlbGVucy5kb21Sb290LmZpbmQoXCIjam1wU3RlcEJhY2tcIikuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICByYi5sb2dCb29rRXZlbnQoeyBldmVudDogXCJjb2RlbGVuc1wiLCBhY3Q6IFwiYmFja1wiLCBkaXZfaWQ6IGRpdmlkIH0pO1xuICAgIH0pO1xuICAgIGNvZGVsZW5zLmRvbVJvb3QuZmluZChcIiNqbXBTdGVwRndkXCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmIubG9nQm9va0V2ZW50KHsgZXZlbnQ6IFwiY29kZWxlbnNcIiwgYWN0OiBcImZ3ZFwiLCBkaXZfaWQ6IGRpdmlkIH0pO1xuICAgIH0pO1xuICAgIGNvZGVsZW5zLmRvbVJvb3QuZmluZChcIiNleGVjdXRpb25TbGlkZXJcIikuYmluZChcInNsaWRlXCIsIGZ1bmN0aW9uIChldnQsIHVpKSB7XG4gICAgICAgIHJiLmxvZ0Jvb2tFdmVudCh7IGV2ZW50OiBcImNvZGVsZW5zXCIsIGFjdDogXCJzbGlkZVwiLCBkaXZfaWQ6IGRpdmlkIH0pO1xuICAgIH0pO1xuICAgIC8vIFRPRE86IFRoZSBjb21wb25lbnQgaXNuJ3QgcXVpdGUgZnVsbHkgaW5pdGlhbGl6ZWQsIGJ1dCBpdCBhbHNvIGRvZXNuJ3QgaW5oZXJpdCBmcm9tIFJ1bmVzdG9uZUJhc2UuIFRoaXMgaXMgYSBjb252ZW5pZW50IHBsYWNlIHRvIG1hcmsgaXQgcmVhZHkgZm9yIG5vdywgYnV0IGl0IHNob3VsZCBiZSBtb3ZlZCBmb3J3YXJkIGluIHRpbWUgZHVyaW5nIGEgcmV3cml0ZS5cbiAgICByYi5jb250YWluZXJEaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChkaXZpZCk7XG4gICAgcmIuaW5kaWNhdGVfY29tcG9uZW50X3JlYWR5KCk7XG59XG5cbmZ1bmN0aW9uIHN0eWxlQnV0dG9ucyhkaXZpZCkge1xuICAgIHZhciBteVZpcyA9ICQoXCIjXCIgKyBkaXZpZCk7XG4gICAgJChteVZpcykuZmluZChcIiNqbXBGaXJzdEluc3RyXCIpLmFkZENsYXNzKFwiYnRuIGJ0bi1kZWZhdWx0XCIpO1xuICAgICQobXlWaXMpLmZpbmQoXCIjam1wU3RlcEJhY2tcIikuYWRkQ2xhc3MoXCJidG4gYnRuLWRhbmdlclwiKTtcbiAgICAkKG15VmlzKS5maW5kKFwiI2ptcFN0ZXBGd2RcIikuYWRkQ2xhc3MoXCJidG4gYnRuLXN1Y2Nlc3NcIik7XG4gICAgJChteVZpcykuZmluZChcIiNqbXBMYXN0SW5zdHJcIikuYWRkQ2xhc3MoXCJidG4gYnRuLWRlZmF1bHRcIik7XG59XG5cbmlmICh0eXBlb2YgYWxsVnN1YWxpemVycyA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHdpbmRvdy5hbGxWaXN1YWxpemVycyA9IFtdO1xufVxuXG5pZiAodHlwZW9mIHdpbmRvdy5jb21wb25lbnRfZmFjdG9yeSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHdpbmRvdy5jb21wb25lbnRfZmFjdG9yeSA9IHt9O1xufVxuXG53aW5kb3cuY29tcG9uZW50X2ZhY3RvcnkuY29kZWxlbnMgPSBmdW5jdGlvbiAob3B0cykge1xuICAgIC8vIG9wdHMgaXMgYW4gb2JqZWN0IHRoYXQgd2lsbCBjb250YWluIGEga2V5IHJlZmVyZW5jaW5nIHRoZSBvcmlnbmFsIGRvbSBlbGVtZW50XG4gICAgLy8gb2Z0ZW4gaXQgd2lsbCBhbHNvIGhhdmUgYSBrZXkgZm9yICB1c2VSdW5lc3RvbmVTZXJ2aWNlc1xuICAgIGxldCBlbCA9IG9wdHMub3JpZztcbiAgICBsZXQgdmVsID0gZWwucXVlcnlTZWxlY3RvcihcIi5weXR1dG9yVmlzdWFsaXplclwiKTtcbiAgICBsZXQgZGl2aWQgPSB2ZWwuaWQ7XG4gICAgbGV0IGxhbmcgPSBKU09OLnBhcnNlKHZlbC5kYXRhc2V0LnBhcmFtcykubGFuZztcbiAgICAvLyBhZGRWaXN1YWxpemVyVG9QYWdlIGNvbWVzIGZyb20gcHl0dXRvci1lbWJlZFxuICAgIC8vIGFsbFRyYWNlRGF0YSBpcyBjcmVhdGVkIGJ5IGEgc2VyaWVzIG9mIHNjcmlwdCB0YWdzIHRoYXQgd2hlbiBsb2FkZWQgY3JlYXRlIHRoaXNcbiAgICAvLyBhcyBhIGdsb2JhbCBvYmplY3QgY29udGFpbmluZyB0cmFjZSBpbmZvcm1hdGlvbi5cbiAgICB0cnkge1xuICAgICAgICBsZXQgc3RhcnRJbnN0ciA9IGFsbFRyYWNlRGF0YVtkaXZpZF0uc3RhcnRpbmdJbnN0cnVjdGlvbiB8fCAwO1xuICAgICAgICBsZXQgdmlzID0gYWRkVmlzdWFsaXplclRvUGFnZShhbGxUcmFjZURhdGFbZGl2aWRdLCBkaXZpZCwge1xuICAgICAgICAgICAgc3RhcnRpbmdJbnN0cnVjdGlvbjogc3RhcnRJbnN0cixcbiAgICAgICAgICAgIGVkaXRDb2RlQmFzZVVSTDogbnVsbCxcbiAgICAgICAgICAgIGhpZGVDb2RlOiBmYWxzZSxcbiAgICAgICAgICAgIGxhbmc6IGxhbmcsXG4gICAgICAgIH0pO1xuICAgICAgICBhdHRhY2hMb2dnZXJzKHZpcywgZGl2aWQpO1xuICAgICAgICBzdHlsZUJ1dHRvbnMoZGl2aWQpO1xuICAgICAgICB3aW5kb3cuYWxsVmlzdWFsaXplcnMucHVzaCh2aXMpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBjb25zb2xlLmxvZyhgRXJyb3IgcmVuZGVyaW5nIENvZGVMZW5zIFByb2JsZW0gJHtkaXZpZH1gKTtcbiAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICB9XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImNvZGVsZW5zOmFuc3dlclwiLCBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAgIGxldCByYiA9IG5ldyBSdW5lc3RvbmVCYXNlKCk7XG4gICAgICAgIHJiLmxvZ0Jvb2tFdmVudCh7XG4gICAgICAgICAgICBldmVudDogXCJjb2RlbGVuc1wiLFxuICAgICAgICAgICAgZGl2X2lkOiBldnQuZGV0YWlsLmRpdmlkLFxuICAgICAgICAgICAgYWN0OiBcImFuc3dlclwiLFxuICAgICAgICAgICAgYW5zd2VyOiBldnQuZGV0YWlsLmFuc3dlcixcbiAgICAgICAgICAgIGNvcnJlY3Q6IGV2dC5kZXRhaWwuY29ycmVjdCxcbiAgICAgICAgICAgIHBlcmNlbnQ6IGV2dC5kZXRhaWwucGVyY2VudCB8fCAwLFxuICAgICAgICB9KTtcbiAgICAgICAgY29uc29sZS5sb2coZXZ0KTtcbiAgICB9KTtcbn07XG5cbi8vIEFmdGVyIGFsbCBvZiB0aGUgbGlicmFyaWVzIGFyZSBsb2FkZWQuLi5cbiQoZG9jdW1lbnQpLm9uKFwicnVuZXN0b25lOmxvZ2luLWNvbXBsZXRlXCIsIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodHlwZW9mIGFsbFRyYWNlRGF0YSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBmb3IgKGxldCBkaXZpZCBpbiBhbGxUcmFjZURhdGEpIHtcbiAgICAgICAgICAgIGxldCBjbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGRpdmlkKTtcbiAgICAgICAgICAgIGlmIChjbCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBDb3VsZCBub3QgZmluZCBlbGVtZW50IHdpdGggaWQgJHtkaXZpZH1gKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgbGFuZyA9ICQoY2wpLmRhdGEoXCJwYXJhbXNcIikubGFuZztcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgaWYgKGRpdmlkIGluIHdpbmRvdy5hbGxUcmFjZURhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHN0YXJ0SW5zdHIgPVxuICAgICAgICAgICAgICAgICAgICAgICAgYWxsVHJhY2VEYXRhW2RpdmlkXS5zdGFydGluZ0luc3RydWN0aW9uIHx8IDA7XG4gICAgICAgICAgICAgICAgICAgIHZhciB2aXMgPSBhZGRWaXN1YWxpemVyVG9QYWdlKGFsbFRyYWNlRGF0YVtkaXZpZF0sIGRpdmlkLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydGluZ0luc3RydWN0aW9uOiBzdGFydEluc3RyLFxuICAgICAgICAgICAgICAgICAgICAgICAgZWRpdENvZGVCYXNlVVJMOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgaGlkZUNvZGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGFuZzogbGFuZyxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoXG4gICAgICAgICAgICAgICAgICAgICAgICBgJHtkaXZpZH0gaXMgbWlzc2luZyB0cmFjZSBkYXRhLiAgVGhpcyBpcyBwcm9iYWJseSBhIGJ1aWxkIGVycm9yLiBQbGVhc2UgcmVwb3J0IGl0IG9uIGdpdGh1Yi5gLFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBhdHRhY2hMb2dnZXJzKHZpcywgZGl2aWQpO1xuICAgICAgICAgICAgICAgIHN0eWxlQnV0dG9ucyhkaXZpZCk7XG4gICAgICAgICAgICAgICAgd2luZG93LmFsbFZpc3VhbGl6ZXJzLnB1c2godmlzKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBFcnJvciByZW5kZXJpbmcgQ29kZUxlbnMgUHJvYmxlbSAke2RpdmlkfWApO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJjb2RlbGVuczphbnN3ZXJcIiwgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgICAgICAgbGV0IHJiID0gbmV3IFJ1bmVzdG9uZUJhc2UoKTtcbiAgICAgICAgICAgIHJiLmxvZ0Jvb2tFdmVudCh7XG4gICAgICAgICAgICAgICAgZXZlbnQ6IFwiY29kZWxlbnNcIixcbiAgICAgICAgICAgICAgICBkaXZfaWQ6IGV2dC5kZXRhaWwuZGl2aWQsXG4gICAgICAgICAgICAgICAgYWN0OiBcImFuc3dlclwiLFxuICAgICAgICAgICAgICAgIGFuc3dlcjogZXZ0LmRldGFpbC5hbnN3ZXIsXG4gICAgICAgICAgICAgICAgY29ycmVjdDogZXZ0LmRldGFpbC5jb3JyZWN0LFxuICAgICAgICAgICAgICAgIHBlcmNlbnQ6IGV2dC5kZXRhaWwucGVyY2VudCB8fCAwLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhldnQpO1xuICAgICAgICB9KTtcbiAgICB9XG59KTtcbiIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==