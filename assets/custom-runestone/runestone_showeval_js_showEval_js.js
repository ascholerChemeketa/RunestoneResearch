"use strict";
(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_showeval_js_showEval_js"],{

/***/ 8824:
/*!*******************************************!*\
  !*** ./runestone/showeval/js/showEval.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ShowEval: () => (/* binding */ ShowEval)
/* harmony export */ });
/* harmony import */ var _common_js_runestonebase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/runestonebase */ 78673);
/* harmony import */ var _common_js_domutil_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../common/js/domutil.js */ 34089);
/* harmony import */ var _css_showEval_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../css/showEval.css */ 26775);
/*
ShowEval, a JS module for creating visualizations of expression evaluation.
Mainly for programming tutorials.

Al Sweigart
al@inventwithpython.com
https://github.com/asweigart/

This is Al's jQuery-free 0.10.0 core wrapped as a Runestone component (the
component features -- annotations, logging, per-question buttons -- come
from the old 0.9.1-based showEval.js it replaces). The standalone variant
used by PreTeXt <interactive> slates is served from the Runestone CDN as
showEval-0.10.0.js and is not built from this module.
*/






class ShowEval extends _common_js_runestonebase__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(opts) {
        super(opts);
        this.divid = opts.orig.id;
        this.containerDiv = opts.orig;
        this.containerDiv.classList.add("showEval");
        let steps = [];
        for (let s of opts.raw) {
            steps.push(s.replace(/\\/g, ""));
        }
        this.steps = steps.slice();
        this.currentStep = 0;
        this.createTrace = (0,_common_js_domutil_js__WEBPACK_IMPORTED_MODULE_1__.getDataValue)(opts.orig, "tracemode"); // TODO - reset doesn't work for traces

        // create elements
        this.currentStepDiv = document.createElement("div");
        this.currentStepDiv.classList.add("currentStepDiv");
        this.containerDiv.appendChild(this.currentStepDiv);
        for (const part of ["pre", "eval", "post"]) {
            let span = document.createElement("span");
            span.classList.add(part);
            this.currentStepDiv.appendChild(span);
        }
        this.annoDiv = document.createElement("div");
        this.annoDiv.classList.add("anno");
        this.currentStepDiv.appendChild(this.annoDiv);
        this.evalSpan = this.currentStepDiv.querySelector(".eval");
        this.setNextButton(`#${this.divid}_nextStep`);
        this.setResetButton(`#${this.divid}_reset`);

        // parse steps and turn into a 5-string array:
        // ['pre', 'before eval', 'after eval', 'post', 'anno']
        for (var i = 0; i < this.steps.length; i++) {
            var s = this.steps[i];
            let endpoint, comment;

            if (s.includes("##")) {
                // If there is an annotation
                endpoint = s.indexOf("##");
                comment = s.substring(endpoint + 2, s.length);
            } else {
                endpoint = s.length;
                comment = false;
            }
            this.steps[i] = [
                s.substring(0, s.indexOf("{{")), // 'pre'
                s.substring(s.indexOf("{{") + 2, s.indexOf("}}{{")), // 'before eval'
                s.substring(
                    s.indexOf("}}{{") + 4,
                    s.indexOf("}}", s.indexOf("}}{{") + 4),
                ), // 'after eval'
                s.substring(
                    s.indexOf("}}", s.indexOf("}}{{") + 4) + 2,
                    endpoint,
                ), // 'post'
            ];
            this.steps[i].push(comment); // 'anno'
        }
        this.reset();
        this.caption = "ShowEval";
        this.addCaption("runestone");
        this.indicate_component_ready();
    }

    setNextButton(nextButtonSelector) {
        const button = document.querySelector(nextButtonSelector);
        button?.addEventListener("click", () => {
            this.evaluateStep(button);
        });
    }

    setResetButton(resetButtonSelector) {
        document
            .querySelector(resetButtonSelector)
            ?.addEventListener("click", () => {
                this.reset();
            });
    }

    reset() {
        for (const el of this.containerDiv.querySelectorAll(
            ".previousStep",
        )) {
            el.remove();
        }
        this.setStep(0);
        this.logBookEvent({
            event: "showeval",
            act: "reset",
            div_id: this.containerDiv.id,
        });
    }

    setStep(step) {
        this.currentStep = step;
        let newWidth = this.getWidth(this.steps[this.currentStep][1]);
        if (this.steps[step][4]) {
            this.annoDiv.innerHTML = this.steps[step][4];
            this.annoDiv.style.display = "";
        } else {
            this.annoDiv.style.display = "none";
        }
        this.evalSpan.style.width = newWidth + "px";
        this.currentStepDiv.querySelector(".pre").innerHTML =
            this.steps[step][0];
        this.evalSpan.innerHTML = this.steps[step][1];
        this.currentStepDiv.querySelector(".post").innerHTML =
            this.steps[step][3];
    }

    getWidth(text) {
        // TODO - class style must match or else width will be off.
        var newElem = document.createElement("div");
        newElem.classList.add("showEval", "evalCont");
        newElem.style.display = "none";
        newElem.innerHTML = text;
        document.body.appendChild(newElem);
        var newWidth = newElem.offsetWidth + 1; // +1 is a hack
        newElem.remove();

        return newWidth;
    }

    createPreviousStepDiv(step) {
        let prevDiv = document.createElement("div");
        prevDiv.classList.add("previousStep");
        prevDiv.innerHTML =
            this.steps[step][0] + this.steps[step][1] + this.steps[step][3];
        this.currentStepDiv.before(prevDiv);
    }

    evaluateStep(button, step) {
        this.annoDiv.style.display = "none";
        if (button) {
            button.disabled = true;
        }
        if (step === undefined) {
            step = this.currentStep;
        }
        if (this.currentStep >= this.steps.length) {
            if (button) {
                button.disabled = false;
            }
            return; // do nothing if on last step
        }

        var fadeInSpeed = 0;
        if (this.createTrace) {
            this.createPreviousStepDiv(step);
            this.currentStepDiv.style.display = "none";
            fadeInSpeed = 200;
        }

        let newWidth = this.getWidth(this.steps[step][2]);
        var evalElem = this.evalSpan;

        var thisShowEval = this;

        evalElem.style.color = "red";

        // Fade in currentStepDiv
        this.fadeToOpacity(this.currentStepDiv, 1, fadeInSpeed, function () {
            window.setTimeout(function () {
                // Fade out evalElem
                thisShowEval.fadeToOpacity(evalElem, 0, 400, function () {
                    // Animate width
                    thisShowEval.animateWidth(
                        evalElem,
                        newWidth,
                        400,
                        function () {
                            evalElem.innerHTML = thisShowEval.steps[step][2];
                            // Fade in evalElem
                            thisShowEval.fadeToOpacity(
                                evalElem,
                                1,
                                400,
                                function () {
                                    window.setTimeout(function () {
                                        evalElem.style.color = "#333";
                                        thisShowEval.currentStep += 1;
                                        if (
                                            thisShowEval.currentStep <
                                            thisShowEval.steps.length
                                        ) {
                                            thisShowEval.setStep(
                                                thisShowEval.currentStep,
                                            );
                                        }
                                        if (button) {
                                            button.disabled = false;
                                        }
                                    }, 600);
                                },
                            );
                        },
                    );
                });
            }, 600);
        });

        this.logBookEvent({
            event: "showeval",
            act: "next",
            div_id: this.containerDiv.id,
        });
    }

    // Helper function to fade element to specific opacity
    fadeToOpacity(element, targetOpacity, duration, callback) {
        if (duration === 0) {
            element.style.opacity = targetOpacity;
            if (targetOpacity === 1 && element.style.display === "none") {
                element.style.display = "";
            }
            if (callback) callback();
            return;
        }

        var startOpacity =
            parseFloat(window.getComputedStyle(element).opacity) || 0;
        var startTime = performance.now();

        if (targetOpacity === 1 && element.style.display === "none") {
            element.style.display = "";
            element.style.opacity = startOpacity;
        }

        function animate(currentTime) {
            var elapsed = currentTime - startTime;
            var progress = Math.min(elapsed / duration, 1);

            element.style.opacity =
                startOpacity + (targetOpacity - startOpacity) * progress;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                if (callback) callback();
            }
        }

        requestAnimationFrame(animate);
    }

    // Helper function to animate width
    animateWidth(element, targetWidth, duration, callback) {
        var startWidth = element.offsetWidth;
        var startTime = performance.now();

        function animate(currentTime) {
            var elapsed = currentTime - startTime;
            var progress = Math.min(elapsed / duration, 1);

            element.style.width =
                startWidth + (targetWidth - startWidth) * progress + "px";

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                if (callback) callback();
            }
        }

        requestAnimationFrame(animate);
    }
}

/*=================================
== Find the custom HTML tags and ==
==   execute our code on them    ==
=================================*/
document.addEventListener("runestone:login-complete", function () {
    for (let element of document.querySelectorAll(
        "[data-component=showeval]",
    )) {
        var opts = {
            orig: element,
            useRunestoneServices: eBookConfig.useRunestoneServices,
        };
        opts.raw = window.raw_steps[element.id];
        if (!element.closest("[data-component=timedAssessment]")) {
            // If this element exists within a timed component, don't render it here
            window.componentMap[element.id] = new ShowEval(opts);
        }
    }
});

if (typeof window.component_factory === "undefined") {
    window.component_factory = {};
}
window.component_factory["showeval"] = function (opts) {
    return new ShowEval(opts);
};


/***/ }),

/***/ 26775:
/*!*********************************************!*\
  !*** ./runestone/showeval/css/showEval.css ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuZXN0b25lX3Nob3dldmFsX2pzX3Nob3dFdmFsX2pzLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNhOztBQUU2QztBQUNBO0FBQzdCOztBQUV0Qix1QkFBdUIsZ0VBQWE7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQixtRUFBWSwwQkFBMEI7O0FBRWpFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLFdBQVc7QUFDMUMsZ0NBQWdDLFdBQVc7O0FBRTNDO0FBQ0E7QUFDQSx3QkFBd0IsdUJBQXVCO0FBQy9DO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0Q0FBNEM7QUFDNUMseUNBQXlDLHVCQUF1QjtBQUNoRTtBQUNBLG1DQUFtQztBQUNuQyxpQ0FBaUMsa0JBQWtCO0FBQ25EO0FBQ0E7QUFDQSxpQ0FBaUMsa0JBQWtCO0FBQ25EO0FBQ0E7QUFDQTtBQUNBLHlDQUF5QztBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnREFBZ0Q7QUFDaEQ7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0I7QUFDcEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQztBQUNyQyxpQ0FBaUM7QUFDakM7QUFDQSx5QkFBeUI7QUFDekI7QUFDQSxpQkFBaUI7QUFDakIsYUFBYTtBQUNiLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUN6VEEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL3Nob3dldmFsL2pzL3Nob3dFdmFsLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvc2hvd2V2YWwvY3NzL3Nob3dFdmFsLmNzcz8wYTczIl0sInNvdXJjZXNDb250ZW50IjpbIi8qXG5TaG93RXZhbCwgYSBKUyBtb2R1bGUgZm9yIGNyZWF0aW5nIHZpc3VhbGl6YXRpb25zIG9mIGV4cHJlc3Npb24gZXZhbHVhdGlvbi5cbk1haW5seSBmb3IgcHJvZ3JhbW1pbmcgdHV0b3JpYWxzLlxuXG5BbCBTd2VpZ2FydFxuYWxAaW52ZW50d2l0aHB5dGhvbi5jb21cbmh0dHBzOi8vZ2l0aHViLmNvbS9hc3dlaWdhcnQvXG5cblRoaXMgaXMgQWwncyBqUXVlcnktZnJlZSAwLjEwLjAgY29yZSB3cmFwcGVkIGFzIGEgUnVuZXN0b25lIGNvbXBvbmVudCAodGhlXG5jb21wb25lbnQgZmVhdHVyZXMgLS0gYW5ub3RhdGlvbnMsIGxvZ2dpbmcsIHBlci1xdWVzdGlvbiBidXR0b25zIC0tIGNvbWVcbmZyb20gdGhlIG9sZCAwLjkuMS1iYXNlZCBzaG93RXZhbC5qcyBpdCByZXBsYWNlcykuIFRoZSBzdGFuZGFsb25lIHZhcmlhbnRcbnVzZWQgYnkgUHJlVGVYdCA8aW50ZXJhY3RpdmU+IHNsYXRlcyBpcyBzZXJ2ZWQgZnJvbSB0aGUgUnVuZXN0b25lIENETiBhc1xuc2hvd0V2YWwtMC4xMC4wLmpzIGFuZCBpcyBub3QgYnVpbHQgZnJvbSB0aGlzIG1vZHVsZS5cbiovXG5cInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IFJ1bmVzdG9uZUJhc2UgZnJvbSBcIi4uLy4uL2NvbW1vbi9qcy9ydW5lc3RvbmViYXNlXCI7XG5pbXBvcnQgeyBnZXREYXRhVmFsdWUgfSBmcm9tIFwiLi4vLi4vY29tbW9uL2pzL2RvbXV0aWwuanNcIjtcbmltcG9ydCBcIi4uL2Nzcy9zaG93RXZhbC5jc3NcIjtcblxuZXhwb3J0IGNsYXNzIFNob3dFdmFsIGV4dGVuZHMgUnVuZXN0b25lQmFzZSB7XG4gICAgY29uc3RydWN0b3Iob3B0cykge1xuICAgICAgICBzdXBlcihvcHRzKTtcbiAgICAgICAgdGhpcy5kaXZpZCA9IG9wdHMub3JpZy5pZDtcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYgPSBvcHRzLm9yaWc7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmNsYXNzTGlzdC5hZGQoXCJzaG93RXZhbFwiKTtcbiAgICAgICAgbGV0IHN0ZXBzID0gW107XG4gICAgICAgIGZvciAobGV0IHMgb2Ygb3B0cy5yYXcpIHtcbiAgICAgICAgICAgIHN0ZXBzLnB1c2gocy5yZXBsYWNlKC9cXFxcL2csIFwiXCIpKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnN0ZXBzID0gc3RlcHMuc2xpY2UoKTtcbiAgICAgICAgdGhpcy5jdXJyZW50U3RlcCA9IDA7XG4gICAgICAgIHRoaXMuY3JlYXRlVHJhY2UgPSBnZXREYXRhVmFsdWUob3B0cy5vcmlnLCBcInRyYWNlbW9kZVwiKTsgLy8gVE9ETyAtIHJlc2V0IGRvZXNuJ3Qgd29yayBmb3IgdHJhY2VzXG5cbiAgICAgICAgLy8gY3JlYXRlIGVsZW1lbnRzXG4gICAgICAgIHRoaXMuY3VycmVudFN0ZXBEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB0aGlzLmN1cnJlbnRTdGVwRGl2LmNsYXNzTGlzdC5hZGQoXCJjdXJyZW50U3RlcERpdlwiKTtcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYuYXBwZW5kQ2hpbGQodGhpcy5jdXJyZW50U3RlcERpdik7XG4gICAgICAgIGZvciAoY29uc3QgcGFydCBvZiBbXCJwcmVcIiwgXCJldmFsXCIsIFwicG9zdFwiXSkge1xuICAgICAgICAgICAgbGV0IHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICAgICAgICAgIHNwYW4uY2xhc3NMaXN0LmFkZChwYXJ0KTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFN0ZXBEaXYuYXBwZW5kQ2hpbGQoc3Bhbik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hbm5vRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdGhpcy5hbm5vRGl2LmNsYXNzTGlzdC5hZGQoXCJhbm5vXCIpO1xuICAgICAgICB0aGlzLmN1cnJlbnRTdGVwRGl2LmFwcGVuZENoaWxkKHRoaXMuYW5ub0Rpdik7XG4gICAgICAgIHRoaXMuZXZhbFNwYW4gPSB0aGlzLmN1cnJlbnRTdGVwRGl2LnF1ZXJ5U2VsZWN0b3IoXCIuZXZhbFwiKTtcbiAgICAgICAgdGhpcy5zZXROZXh0QnV0dG9uKGAjJHt0aGlzLmRpdmlkfV9uZXh0U3RlcGApO1xuICAgICAgICB0aGlzLnNldFJlc2V0QnV0dG9uKGAjJHt0aGlzLmRpdmlkfV9yZXNldGApO1xuXG4gICAgICAgIC8vIHBhcnNlIHN0ZXBzIGFuZCB0dXJuIGludG8gYSA1LXN0cmluZyBhcnJheTpcbiAgICAgICAgLy8gWydwcmUnLCAnYmVmb3JlIGV2YWwnLCAnYWZ0ZXIgZXZhbCcsICdwb3N0JywgJ2Fubm8nXVxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuc3RlcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBzID0gdGhpcy5zdGVwc1tpXTtcbiAgICAgICAgICAgIGxldCBlbmRwb2ludCwgY29tbWVudDtcblxuICAgICAgICAgICAgaWYgKHMuaW5jbHVkZXMoXCIjI1wiKSkge1xuICAgICAgICAgICAgICAgIC8vIElmIHRoZXJlIGlzIGFuIGFubm90YXRpb25cbiAgICAgICAgICAgICAgICBlbmRwb2ludCA9IHMuaW5kZXhPZihcIiMjXCIpO1xuICAgICAgICAgICAgICAgIGNvbW1lbnQgPSBzLnN1YnN0cmluZyhlbmRwb2ludCArIDIsIHMubGVuZ3RoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZW5kcG9pbnQgPSBzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBjb21tZW50ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnN0ZXBzW2ldID0gW1xuICAgICAgICAgICAgICAgIHMuc3Vic3RyaW5nKDAsIHMuaW5kZXhPZihcInt7XCIpKSwgLy8gJ3ByZSdcbiAgICAgICAgICAgICAgICBzLnN1YnN0cmluZyhzLmluZGV4T2YoXCJ7e1wiKSArIDIsIHMuaW5kZXhPZihcIn19e3tcIikpLCAvLyAnYmVmb3JlIGV2YWwnXG4gICAgICAgICAgICAgICAgcy5zdWJzdHJpbmcoXG4gICAgICAgICAgICAgICAgICAgIHMuaW5kZXhPZihcIn19e3tcIikgKyA0LFxuICAgICAgICAgICAgICAgICAgICBzLmluZGV4T2YoXCJ9fVwiLCBzLmluZGV4T2YoXCJ9fXt7XCIpICsgNCksXG4gICAgICAgICAgICAgICAgKSwgLy8gJ2FmdGVyIGV2YWwnXG4gICAgICAgICAgICAgICAgcy5zdWJzdHJpbmcoXG4gICAgICAgICAgICAgICAgICAgIHMuaW5kZXhPZihcIn19XCIsIHMuaW5kZXhPZihcIn19e3tcIikgKyA0KSArIDIsXG4gICAgICAgICAgICAgICAgICAgIGVuZHBvaW50LFxuICAgICAgICAgICAgICAgICksIC8vICdwb3N0J1xuICAgICAgICAgICAgXTtcbiAgICAgICAgICAgIHRoaXMuc3RlcHNbaV0ucHVzaChjb21tZW50KTsgLy8gJ2Fubm8nXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgICAgICB0aGlzLmNhcHRpb24gPSBcIlNob3dFdmFsXCI7XG4gICAgICAgIHRoaXMuYWRkQ2FwdGlvbihcInJ1bmVzdG9uZVwiKTtcbiAgICAgICAgdGhpcy5pbmRpY2F0ZV9jb21wb25lbnRfcmVhZHkoKTtcbiAgICB9XG5cbiAgICBzZXROZXh0QnV0dG9uKG5leHRCdXR0b25TZWxlY3Rvcikge1xuICAgICAgICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKG5leHRCdXR0b25TZWxlY3Rvcik7XG4gICAgICAgIGJ1dHRvbj8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZXZhbHVhdGVTdGVwKGJ1dHRvbik7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHNldFJlc2V0QnV0dG9uKHJlc2V0QnV0dG9uU2VsZWN0b3IpIHtcbiAgICAgICAgZG9jdW1lbnRcbiAgICAgICAgICAgIC5xdWVyeVNlbGVjdG9yKHJlc2V0QnV0dG9uU2VsZWN0b3IpXG4gICAgICAgICAgICA/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmVzZXQoKSB7XG4gICAgICAgIGZvciAoY29uc3QgZWwgb2YgdGhpcy5jb250YWluZXJEaXYucXVlcnlTZWxlY3RvckFsbChcbiAgICAgICAgICAgIFwiLnByZXZpb3VzU3RlcFwiLFxuICAgICAgICApKSB7XG4gICAgICAgICAgICBlbC5yZW1vdmUoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNldFN0ZXAoMCk7XG4gICAgICAgIHRoaXMubG9nQm9va0V2ZW50KHtcbiAgICAgICAgICAgIGV2ZW50OiBcInNob3dldmFsXCIsXG4gICAgICAgICAgICBhY3Q6IFwicmVzZXRcIixcbiAgICAgICAgICAgIGRpdl9pZDogdGhpcy5jb250YWluZXJEaXYuaWQsXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHNldFN0ZXAoc3RlcCkge1xuICAgICAgICB0aGlzLmN1cnJlbnRTdGVwID0gc3RlcDtcbiAgICAgICAgbGV0IG5ld1dpZHRoID0gdGhpcy5nZXRXaWR0aCh0aGlzLnN0ZXBzW3RoaXMuY3VycmVudFN0ZXBdWzFdKTtcbiAgICAgICAgaWYgKHRoaXMuc3RlcHNbc3RlcF1bNF0pIHtcbiAgICAgICAgICAgIHRoaXMuYW5ub0Rpdi5pbm5lckhUTUwgPSB0aGlzLnN0ZXBzW3N0ZXBdWzRdO1xuICAgICAgICAgICAgdGhpcy5hbm5vRGl2LnN0eWxlLmRpc3BsYXkgPSBcIlwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5hbm5vRGl2LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmV2YWxTcGFuLnN0eWxlLndpZHRoID0gbmV3V2lkdGggKyBcInB4XCI7XG4gICAgICAgIHRoaXMuY3VycmVudFN0ZXBEaXYucXVlcnlTZWxlY3RvcihcIi5wcmVcIikuaW5uZXJIVE1MID1cbiAgICAgICAgICAgIHRoaXMuc3RlcHNbc3RlcF1bMF07XG4gICAgICAgIHRoaXMuZXZhbFNwYW4uaW5uZXJIVE1MID0gdGhpcy5zdGVwc1tzdGVwXVsxXTtcbiAgICAgICAgdGhpcy5jdXJyZW50U3RlcERpdi5xdWVyeVNlbGVjdG9yKFwiLnBvc3RcIikuaW5uZXJIVE1MID1cbiAgICAgICAgICAgIHRoaXMuc3RlcHNbc3RlcF1bM107XG4gICAgfVxuXG4gICAgZ2V0V2lkdGgodGV4dCkge1xuICAgICAgICAvLyBUT0RPIC0gY2xhc3Mgc3R5bGUgbXVzdCBtYXRjaCBvciBlbHNlIHdpZHRoIHdpbGwgYmUgb2ZmLlxuICAgICAgICB2YXIgbmV3RWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIG5ld0VsZW0uY2xhc3NMaXN0LmFkZChcInNob3dFdmFsXCIsIFwiZXZhbENvbnRcIik7XG4gICAgICAgIG5ld0VsZW0uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICBuZXdFbGVtLmlubmVySFRNTCA9IHRleHQ7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobmV3RWxlbSk7XG4gICAgICAgIHZhciBuZXdXaWR0aCA9IG5ld0VsZW0ub2Zmc2V0V2lkdGggKyAxOyAvLyArMSBpcyBhIGhhY2tcbiAgICAgICAgbmV3RWxlbS5yZW1vdmUoKTtcblxuICAgICAgICByZXR1cm4gbmV3V2lkdGg7XG4gICAgfVxuXG4gICAgY3JlYXRlUHJldmlvdXNTdGVwRGl2KHN0ZXApIHtcbiAgICAgICAgbGV0IHByZXZEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBwcmV2RGl2LmNsYXNzTGlzdC5hZGQoXCJwcmV2aW91c1N0ZXBcIik7XG4gICAgICAgIHByZXZEaXYuaW5uZXJIVE1MID1cbiAgICAgICAgICAgIHRoaXMuc3RlcHNbc3RlcF1bMF0gKyB0aGlzLnN0ZXBzW3N0ZXBdWzFdICsgdGhpcy5zdGVwc1tzdGVwXVszXTtcbiAgICAgICAgdGhpcy5jdXJyZW50U3RlcERpdi5iZWZvcmUocHJldkRpdik7XG4gICAgfVxuXG4gICAgZXZhbHVhdGVTdGVwKGJ1dHRvbiwgc3RlcCkge1xuICAgICAgICB0aGlzLmFubm9EaXYuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICBpZiAoYnV0dG9uKSB7XG4gICAgICAgICAgICBidXR0b24uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzdGVwID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHN0ZXAgPSB0aGlzLmN1cnJlbnRTdGVwO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRTdGVwID49IHRoaXMuc3RlcHMubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoYnV0dG9uKSB7XG4gICAgICAgICAgICAgICAgYnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm47IC8vIGRvIG5vdGhpbmcgaWYgb24gbGFzdCBzdGVwXG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZmFkZUluU3BlZWQgPSAwO1xuICAgICAgICBpZiAodGhpcy5jcmVhdGVUcmFjZSkge1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVQcmV2aW91c1N0ZXBEaXYoc3RlcCk7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTdGVwRGl2LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgICAgIGZhZGVJblNwZWVkID0gMjAwO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IG5ld1dpZHRoID0gdGhpcy5nZXRXaWR0aCh0aGlzLnN0ZXBzW3N0ZXBdWzJdKTtcbiAgICAgICAgdmFyIGV2YWxFbGVtID0gdGhpcy5ldmFsU3BhbjtcblxuICAgICAgICB2YXIgdGhpc1Nob3dFdmFsID0gdGhpcztcblxuICAgICAgICBldmFsRWxlbS5zdHlsZS5jb2xvciA9IFwicmVkXCI7XG5cbiAgICAgICAgLy8gRmFkZSBpbiBjdXJyZW50U3RlcERpdlxuICAgICAgICB0aGlzLmZhZGVUb09wYWNpdHkodGhpcy5jdXJyZW50U3RlcERpdiwgMSwgZmFkZUluU3BlZWQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAvLyBGYWRlIG91dCBldmFsRWxlbVxuICAgICAgICAgICAgICAgIHRoaXNTaG93RXZhbC5mYWRlVG9PcGFjaXR5KGV2YWxFbGVtLCAwLCA0MDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gQW5pbWF0ZSB3aWR0aFxuICAgICAgICAgICAgICAgICAgICB0aGlzU2hvd0V2YWwuYW5pbWF0ZVdpZHRoKFxuICAgICAgICAgICAgICAgICAgICAgICAgZXZhbEVsZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdXaWR0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgIDQwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmFsRWxlbS5pbm5lckhUTUwgPSB0aGlzU2hvd0V2YWwuc3RlcHNbc3RlcF1bMl07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRmFkZSBpbiBldmFsRWxlbVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNTaG93RXZhbC5mYWRlVG9PcGFjaXR5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmFsRWxlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgNDAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZhbEVsZW0uc3R5bGUuY29sb3IgPSBcIiMzMzNcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzU2hvd0V2YWwuY3VycmVudFN0ZXAgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNTaG93RXZhbC5jdXJyZW50U3RlcCA8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNTaG93RXZhbC5zdGVwcy5sZW5ndGhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1Nob3dFdmFsLnNldFN0ZXAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzU2hvd0V2YWwuY3VycmVudFN0ZXAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChidXR0b24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgNjAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sIDYwMCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMubG9nQm9va0V2ZW50KHtcbiAgICAgICAgICAgIGV2ZW50OiBcInNob3dldmFsXCIsXG4gICAgICAgICAgICBhY3Q6IFwibmV4dFwiLFxuICAgICAgICAgICAgZGl2X2lkOiB0aGlzLmNvbnRhaW5lckRpdi5pZCxcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gSGVscGVyIGZ1bmN0aW9uIHRvIGZhZGUgZWxlbWVudCB0byBzcGVjaWZpYyBvcGFjaXR5XG4gICAgZmFkZVRvT3BhY2l0eShlbGVtZW50LCB0YXJnZXRPcGFjaXR5LCBkdXJhdGlvbiwgY2FsbGJhY2spIHtcbiAgICAgICAgaWYgKGR1cmF0aW9uID09PSAwKSB7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLm9wYWNpdHkgPSB0YXJnZXRPcGFjaXR5O1xuICAgICAgICAgICAgaWYgKHRhcmdldE9wYWNpdHkgPT09IDEgJiYgZWxlbWVudC5zdHlsZS5kaXNwbGF5ID09PSBcIm5vbmVcIikge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9IFwiXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2FsbGJhY2spIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc3RhcnRPcGFjaXR5ID1cbiAgICAgICAgICAgIHBhcnNlRmxvYXQod2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCkub3BhY2l0eSkgfHwgMDtcbiAgICAgICAgdmFyIHN0YXJ0VGltZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuXG4gICAgICAgIGlmICh0YXJnZXRPcGFjaXR5ID09PSAxICYmIGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9PT0gXCJub25lXCIpIHtcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9IFwiXCI7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLm9wYWNpdHkgPSBzdGFydE9wYWNpdHk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBhbmltYXRlKGN1cnJlbnRUaW1lKSB7XG4gICAgICAgICAgICB2YXIgZWxhcHNlZCA9IGN1cnJlbnRUaW1lIC0gc3RhcnRUaW1lO1xuICAgICAgICAgICAgdmFyIHByb2dyZXNzID0gTWF0aC5taW4oZWxhcHNlZCAvIGR1cmF0aW9uLCAxKTtcblxuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5vcGFjaXR5ID1cbiAgICAgICAgICAgICAgICBzdGFydE9wYWNpdHkgKyAodGFyZ2V0T3BhY2l0eSAtIHN0YXJ0T3BhY2l0eSkgKiBwcm9ncmVzcztcblxuICAgICAgICAgICAgaWYgKHByb2dyZXNzIDwgMSkge1xuICAgICAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShhbmltYXRlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSBjYWxsYmFjaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGUpO1xuICAgIH1cblxuICAgIC8vIEhlbHBlciBmdW5jdGlvbiB0byBhbmltYXRlIHdpZHRoXG4gICAgYW5pbWF0ZVdpZHRoKGVsZW1lbnQsIHRhcmdldFdpZHRoLCBkdXJhdGlvbiwgY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIHN0YXJ0V2lkdGggPSBlbGVtZW50Lm9mZnNldFdpZHRoO1xuICAgICAgICB2YXIgc3RhcnRUaW1lID0gcGVyZm9ybWFuY2Uubm93KCk7XG5cbiAgICAgICAgZnVuY3Rpb24gYW5pbWF0ZShjdXJyZW50VGltZSkge1xuICAgICAgICAgICAgdmFyIGVsYXBzZWQgPSBjdXJyZW50VGltZSAtIHN0YXJ0VGltZTtcbiAgICAgICAgICAgIHZhciBwcm9ncmVzcyA9IE1hdGgubWluKGVsYXBzZWQgLyBkdXJhdGlvbiwgMSk7XG5cbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUud2lkdGggPVxuICAgICAgICAgICAgICAgIHN0YXJ0V2lkdGggKyAodGFyZ2V0V2lkdGggLSBzdGFydFdpZHRoKSAqIHByb2dyZXNzICsgXCJweFwiO1xuXG4gICAgICAgICAgICBpZiAocHJvZ3Jlc3MgPCAxKSB7XG4gICAgICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2spIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0ZSk7XG4gICAgfVxufVxuXG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT0gRmluZCB0aGUgY3VzdG9tIEhUTUwgdGFncyBhbmQgPT1cbj09ICAgZXhlY3V0ZSBvdXIgY29kZSBvbiB0aGVtICAgID09XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInJ1bmVzdG9uZTpsb2dpbi1jb21wbGV0ZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgZm9yIChsZXQgZWxlbWVudCBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFxuICAgICAgICBcIltkYXRhLWNvbXBvbmVudD1zaG93ZXZhbF1cIixcbiAgICApKSB7XG4gICAgICAgIHZhciBvcHRzID0ge1xuICAgICAgICAgICAgb3JpZzogZWxlbWVudCxcbiAgICAgICAgICAgIHVzZVJ1bmVzdG9uZVNlcnZpY2VzOiBlQm9va0NvbmZpZy51c2VSdW5lc3RvbmVTZXJ2aWNlcyxcbiAgICAgICAgfTtcbiAgICAgICAgb3B0cy5yYXcgPSB3aW5kb3cucmF3X3N0ZXBzW2VsZW1lbnQuaWRdO1xuICAgICAgICBpZiAoIWVsZW1lbnQuY2xvc2VzdChcIltkYXRhLWNvbXBvbmVudD10aW1lZEFzc2Vzc21lbnRdXCIpKSB7XG4gICAgICAgICAgICAvLyBJZiB0aGlzIGVsZW1lbnQgZXhpc3RzIHdpdGhpbiBhIHRpbWVkIGNvbXBvbmVudCwgZG9uJ3QgcmVuZGVyIGl0IGhlcmVcbiAgICAgICAgICAgIHdpbmRvdy5jb21wb25lbnRNYXBbZWxlbWVudC5pZF0gPSBuZXcgU2hvd0V2YWwob3B0cyk7XG4gICAgICAgIH1cbiAgICB9XG59KTtcblxuaWYgKHR5cGVvZiB3aW5kb3cuY29tcG9uZW50X2ZhY3RvcnkgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB3aW5kb3cuY29tcG9uZW50X2ZhY3RvcnkgPSB7fTtcbn1cbndpbmRvdy5jb21wb25lbnRfZmFjdG9yeVtcInNob3dldmFsXCJdID0gZnVuY3Rpb24gKG9wdHMpIHtcbiAgICByZXR1cm4gbmV3IFNob3dFdmFsKG9wdHMpO1xufTtcbiIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==