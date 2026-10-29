"use strict";
(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_webwork_js_webwork_js"],{

/***/ 84680:
/*!*****************************************!*\
  !*** ./runestone/webwork/js/webwork.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_js_runestonebase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/runestonebase */ 78673);


window.wwList = {}; // Multiple Choice dictionary

class WebWork extends _common_js_runestonebase__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(opts) {
        super(opts);
        this.useRunestoneServices = true;
        this.multipleanswers = false;
        this.divid = opts.orig.id;
        this.correct = null;
        this.optional = false;
        this.answerList = [];
        this.correctList = [];
        this.question = null;
        this.caption = "WebWork";
        this.containerDiv = opts.orig;
        this.answers = {};
        this.percent = 0;
        //this.addCaption("runestone");
        if (this.divid !== "fakeww-ww-rs") {
            this.checkServer("webwork", true);
        }
        window.wwList[this.divid] = this;
    }

    restoreAnswers(data) {
        // Restore answers from storage retrieval done in RunestoneBase
        // sometimes data.answer can be null
        if (!data.answer) {
            data.answer = "";
        }
        // data.answers comes from postgresql as a JSON column type so no need to parse it.

        this.answers = data.answer;
        this.correct = data.correct;
        this.percent = data.percent;
        console.log(
            `about to decorate the status of WW ${this.divid} ${this.correct}`,
        );
        this.decorateStatus();
    }

    checkLocalStorage() {
        // Repopulates MCMA questions with a user's previous answers,
        // which were stored into local storage.
        var storedData;
        var answers;
        if (this.graderactive) {
            return;
        }
        var len = localStorage.length;
        var ex = localStorage.getItem(this.localStorageKey());

        if (ex !== null) {
            let error = false;
            try {
                storedData = JSON.parse(ex);
                // Save the answers so that when the question is activated we can restore.
                this.answers = storedData.answer;
                this.correct = storedData.correct;
                this.percent = storedData.percent;
                // We still decorate the webwork question even if it is not active.
                this.decorateStatus();
            } catch (err) {
                // error while parsing; likely due to bad value stored in storage
                console.log(
                    `Error parsing stored WebWork data for ${this.divid}: ${err.message}`,
                );
                error = true;
            }
            if (error || storedData.timestamp < eBookConfig.termStartDate) {
                localStorage.removeItem(this.localStorageKey());
                return;
            }
        }
    }

    setLocalStorage(data) {
        var timeStamp = new Date();
        var storageObj = {
            answer: data.answer,
            timestamp: timeStamp,
            correct: data.correct,
        };
        localStorage.setItem(
            this.localStorageKey(),
            JSON.stringify(storageObj),
        );
    }

    // This is called when the runestone_ww_check event is triggered by the webwork problem
    // Note the webwork problem is in an iframe so we rely on this event and the data
    // compiled and passed along with the event to "grade" the answer.
    processCurrentAnswers(data) {
        let correctCount = 0;
        let qCount = 0;
        let actString = "check:";
        this.answerObj = {};
        this.lastAnswerRaw = data;
        this.answerObj.answers = {};
        this.answerObj.mqAnswers = {};
        // data.inputs_
        for (let k of Object.keys(data.rh_result.answers)) {
            qCount += 1;
            if (data.rh_result.answers[k].score == 1) {
                correctCount += 1;
            }
            // mostly grab original_student_ans, but grab student_value for MC exercises
            let student_ans;
            if (
                !("ww_version" in data) ||
                data.ww_version.includes("2.16") ||
                data.ww_version.includes("2.17") ||
                data.ww_version.includes("2.18")
            ) {
                // Mostly grab original_student_ans, but grab student_value for MC exercises
                student_ans = [
                    "Value (parserRadioButtons)",
                    "Value (PopUp)",
                    "Value (CheckboxList)",
                ].includes(data.rh_result.answers[k].type)
                    ? data.rh_result.answers[k].student_value
                    : data.rh_result.answers[k].original_student_ans;
            } else {
                // Literally get the input refs
                // data.inputs_ref[k] will usually be a string, the @value of the answer input field that was submitted
                // However in at least the case of checkboxes, data.inputs_ref[k] will be an array
                // So however this is ultimately stored in the Runestone database should respect ans preserve this as an array, not stringified
                student_ans = data.inputs_ref[k];
            }
            this.answerObj.answers[k] = student_ans;
            let mqKey = `MaThQuIlL_${k}`;
            this.answerObj.mqAnswers[mqKey] = data.inputs_ref[mqKey];
            actString += `actual:${student_ans}:expected:${data.rh_result.answers[k].correct_value}:`;
        }
        let pct = correctCount / qCount;
        // If this.percent is set, then runestonebase will transmit it as part of
        // the logBookEvent API.
        this.percent = pct;
        this.actString =
            actString + `correct:${correctCount}:count:${qCount}:pct:${pct}`;
        if (pct == 1.0) {
            this.correct = true;
        } else {
            this.correct = false;
        }
        let ls = {};
        ls.answer = this.answerObj;
        ls.correct = this.correct;
        ls.percent = this.percent;
        this.setLocalStorage(ls);
        this.decorateStatus();
    }

    async logCurrentAnswer(sid) {
        this.logBookEvent({
            event: "webwork",
            div_id: this.divid, //todo unmangle problemid
            act: this.actString,
            correct: this.correct,
            answer: JSON.stringify(this.answerObj),
        });
    }

    checkCurrentAnswer() {}
}

//
// These are functions that get called in response to webwork generated events.
// submitting the work, or showing an answer.
function logWebWork(e, data) {
    if (eBookConfig.useRunestoneServices) {
        let wwObj = wwList[data.inputs_ref.problemUUID.replace("-ww-rs", "")];
        if (wwObj) {
            wwObj.processCurrentAnswers(data);
            wwObj.logCurrentAnswer();
        } else {
            console.log(
                `Error: Could not find webwork object ${data.inputs_ref.problemUUID}`,
            );
        }
    }
}

function logShowCorrect(e, data) {
    if (eBookConfig.useRunestoneServices) {
        let wwObj = wwList[data.inputs_ref.problemUUID.replace("-ww-rs", "")];
        if (wwObj) {
            wwObj.logBookEvent({
                event: "webwork",
                div_id: data.inputs_ref.problemUUID,
                act: "show",
            });
        } else {
            console.log(
                `Error: Could not find webwork object ${data.inputs_ref.problemUUID}`,
            );
        }
    }
}

async function getScores(sid, wwId) {}

if (typeof window.component_factory === "undefined") {
    window.component_factory = {};
}

window.component_factory.webwork = function (opts) {
    return new WebWork(opts);
};

// The WeBWorK server's own JS fires these events. Historically it does so
// with the page's jQuery (`$("body").trigger(...)`, payload as an extra
// handler argument); jQuery-triggered events never reach native listeners, so
// when the page provides jQuery we must register through it. A jQuery
// registration also sees natively dispatched CustomEvents, so exactly one
// registration path is used to avoid handling an event twice. The payload
// can arrive as the extra jQuery argument or as the CustomEvent detail.
function wwHandler(handler) {
    return function (e, data) {
        const payload =
            data !== undefined
                ? data
                : (e.detail ?? e.originalEvent?.detail);
        if (payload === undefined) return;
        handler(e, payload);
    };
}

function registerWWListeners() {
    if (window.jQuery) {
        window.jQuery("body").on("runestone_ww_check", wwHandler(logWebWork));
        window
            .jQuery("body")
            .on("runestone_show_correct", wwHandler(logShowCorrect));
    } else {
        document.body.addEventListener(
            "runestone_ww_check",
            wwHandler(logWebWork),
        );
        document.body.addEventListener(
            "runestone_show_correct",
            wwHandler(logShowCorrect),
        );
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", registerWWListeners);
} else {
    registerWWListeners();
}

document.addEventListener("runestone:login-complete", function () {
    for (let element of document.querySelectorAll(
        "[data-component=webwork]",
    )) {
        var opts = {
            orig: element,
            useRunestoneServices: eBookConfig.useRunestoneServices,
        };
        if (!element.closest("[data-component=timedAssessment]")) {
            // If this element exists within a timed component, don't render it here
            window.wwList[element.id] = new WebWork(opts);
        }
    }
});


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuZXN0b25lX3dlYndvcmtfanNfd2Vid29ya19qcy5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUEwRDs7QUFFMUQsb0JBQW9COztBQUVwQixzQkFBc0IsZ0VBQWE7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtEQUFrRCxZQUFZLEVBQUUsYUFBYTtBQUM3RTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Qsd0NBQXdDO0FBQ3hDO0FBQ0EsNkRBQTZELFdBQVcsSUFBSSxZQUFZO0FBQ3hGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQXFDLEVBQUU7QUFDdkM7QUFDQSxtQ0FBbUMsWUFBWSxZQUFZLHdDQUF3QztBQUNuRztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUMsYUFBYSxTQUFTLE9BQU8sT0FBTyxJQUFJO0FBQzNFO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0Esd0RBQXdELDRCQUE0QjtBQUNwRjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLFVBQVU7QUFDVjtBQUNBLHdEQUF3RCw0QkFBNEI7QUFDcEY7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esc0JBQXNCO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL3dlYndvcmsvanMvd2Vid29yay5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUnVuZXN0b25lQmFzZSBmcm9tIFwiLi4vLi4vY29tbW9uL2pzL3J1bmVzdG9uZWJhc2VcIjtcblxud2luZG93Lnd3TGlzdCA9IHt9OyAvLyBNdWx0aXBsZSBDaG9pY2UgZGljdGlvbmFyeVxuXG5jbGFzcyBXZWJXb3JrIGV4dGVuZHMgUnVuZXN0b25lQmFzZSB7XG4gICAgY29uc3RydWN0b3Iob3B0cykge1xuICAgICAgICBzdXBlcihvcHRzKTtcbiAgICAgICAgdGhpcy51c2VSdW5lc3RvbmVTZXJ2aWNlcyA9IHRydWU7XG4gICAgICAgIHRoaXMubXVsdGlwbGVhbnN3ZXJzID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZGl2aWQgPSBvcHRzLm9yaWcuaWQ7XG4gICAgICAgIHRoaXMuY29ycmVjdCA9IG51bGw7XG4gICAgICAgIHRoaXMub3B0aW9uYWwgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5hbnN3ZXJMaXN0ID0gW107XG4gICAgICAgIHRoaXMuY29ycmVjdExpc3QgPSBbXTtcbiAgICAgICAgdGhpcy5xdWVzdGlvbiA9IG51bGw7XG4gICAgICAgIHRoaXMuY2FwdGlvbiA9IFwiV2ViV29ya1wiO1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdiA9IG9wdHMub3JpZztcbiAgICAgICAgdGhpcy5hbnN3ZXJzID0ge307XG4gICAgICAgIHRoaXMucGVyY2VudCA9IDA7XG4gICAgICAgIC8vdGhpcy5hZGRDYXB0aW9uKFwicnVuZXN0b25lXCIpO1xuICAgICAgICBpZiAodGhpcy5kaXZpZCAhPT0gXCJmYWtld3ctd3ctcnNcIikge1xuICAgICAgICAgICAgdGhpcy5jaGVja1NlcnZlcihcIndlYndvcmtcIiwgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgd2luZG93Lnd3TGlzdFt0aGlzLmRpdmlkXSA9IHRoaXM7XG4gICAgfVxuXG4gICAgcmVzdG9yZUFuc3dlcnMoZGF0YSkge1xuICAgICAgICAvLyBSZXN0b3JlIGFuc3dlcnMgZnJvbSBzdG9yYWdlIHJldHJpZXZhbCBkb25lIGluIFJ1bmVzdG9uZUJhc2VcbiAgICAgICAgLy8gc29tZXRpbWVzIGRhdGEuYW5zd2VyIGNhbiBiZSBudWxsXG4gICAgICAgIGlmICghZGF0YS5hbnN3ZXIpIHtcbiAgICAgICAgICAgIGRhdGEuYW5zd2VyID0gXCJcIjtcbiAgICAgICAgfVxuICAgICAgICAvLyBkYXRhLmFuc3dlcnMgY29tZXMgZnJvbSBwb3N0Z3Jlc3FsIGFzIGEgSlNPTiBjb2x1bW4gdHlwZSBzbyBubyBuZWVkIHRvIHBhcnNlIGl0LlxuXG4gICAgICAgIHRoaXMuYW5zd2VycyA9IGRhdGEuYW5zd2VyO1xuICAgICAgICB0aGlzLmNvcnJlY3QgPSBkYXRhLmNvcnJlY3Q7XG4gICAgICAgIHRoaXMucGVyY2VudCA9IGRhdGEucGVyY2VudDtcbiAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgICBgYWJvdXQgdG8gZGVjb3JhdGUgdGhlIHN0YXR1cyBvZiBXVyAke3RoaXMuZGl2aWR9ICR7dGhpcy5jb3JyZWN0fWAsXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuZGVjb3JhdGVTdGF0dXMoKTtcbiAgICB9XG5cbiAgICBjaGVja0xvY2FsU3RvcmFnZSgpIHtcbiAgICAgICAgLy8gUmVwb3B1bGF0ZXMgTUNNQSBxdWVzdGlvbnMgd2l0aCBhIHVzZXIncyBwcmV2aW91cyBhbnN3ZXJzLFxuICAgICAgICAvLyB3aGljaCB3ZXJlIHN0b3JlZCBpbnRvIGxvY2FsIHN0b3JhZ2UuXG4gICAgICAgIHZhciBzdG9yZWREYXRhO1xuICAgICAgICB2YXIgYW5zd2VycztcbiAgICAgICAgaWYgKHRoaXMuZ3JhZGVyYWN0aXZlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGxlbiA9IGxvY2FsU3RvcmFnZS5sZW5ndGg7XG4gICAgICAgIHZhciBleCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMubG9jYWxTdG9yYWdlS2V5KCkpO1xuXG4gICAgICAgIGlmIChleCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgbGV0IGVycm9yID0gZmFsc2U7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHN0b3JlZERhdGEgPSBKU09OLnBhcnNlKGV4KTtcbiAgICAgICAgICAgICAgICAvLyBTYXZlIHRoZSBhbnN3ZXJzIHNvIHRoYXQgd2hlbiB0aGUgcXVlc3Rpb24gaXMgYWN0aXZhdGVkIHdlIGNhbiByZXN0b3JlLlxuICAgICAgICAgICAgICAgIHRoaXMuYW5zd2VycyA9IHN0b3JlZERhdGEuYW5zd2VyO1xuICAgICAgICAgICAgICAgIHRoaXMuY29ycmVjdCA9IHN0b3JlZERhdGEuY29ycmVjdDtcbiAgICAgICAgICAgICAgICB0aGlzLnBlcmNlbnQgPSBzdG9yZWREYXRhLnBlcmNlbnQ7XG4gICAgICAgICAgICAgICAgLy8gV2Ugc3RpbGwgZGVjb3JhdGUgdGhlIHdlYndvcmsgcXVlc3Rpb24gZXZlbiBpZiBpdCBpcyBub3QgYWN0aXZlLlxuICAgICAgICAgICAgICAgIHRoaXMuZGVjb3JhdGVTdGF0dXMoKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIC8vIGVycm9yIHdoaWxlIHBhcnNpbmc7IGxpa2VseSBkdWUgdG8gYmFkIHZhbHVlIHN0b3JlZCBpbiBzdG9yYWdlXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgICAgICAgICAgIGBFcnJvciBwYXJzaW5nIHN0b3JlZCBXZWJXb3JrIGRhdGEgZm9yICR7dGhpcy5kaXZpZH06ICR7ZXJyLm1lc3NhZ2V9YCxcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIGVycm9yID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChlcnJvciB8fCBzdG9yZWREYXRhLnRpbWVzdGFtcCA8IGVCb29rQ29uZmlnLnRlcm1TdGFydERhdGUpIHtcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSh0aGlzLmxvY2FsU3RvcmFnZUtleSgpKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRMb2NhbFN0b3JhZ2UoZGF0YSkge1xuICAgICAgICB2YXIgdGltZVN0YW1wID0gbmV3IERhdGUoKTtcbiAgICAgICAgdmFyIHN0b3JhZ2VPYmogPSB7XG4gICAgICAgICAgICBhbnN3ZXI6IGRhdGEuYW5zd2VyLFxuICAgICAgICAgICAgdGltZXN0YW1wOiB0aW1lU3RhbXAsXG4gICAgICAgICAgICBjb3JyZWN0OiBkYXRhLmNvcnJlY3QsXG4gICAgICAgIH07XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFxuICAgICAgICAgICAgdGhpcy5sb2NhbFN0b3JhZ2VLZXkoKSxcbiAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHN0b3JhZ2VPYmopLFxuICAgICAgICApO1xuICAgIH1cblxuICAgIC8vIFRoaXMgaXMgY2FsbGVkIHdoZW4gdGhlIHJ1bmVzdG9uZV93d19jaGVjayBldmVudCBpcyB0cmlnZ2VyZWQgYnkgdGhlIHdlYndvcmsgcHJvYmxlbVxuICAgIC8vIE5vdGUgdGhlIHdlYndvcmsgcHJvYmxlbSBpcyBpbiBhbiBpZnJhbWUgc28gd2UgcmVseSBvbiB0aGlzIGV2ZW50IGFuZCB0aGUgZGF0YVxuICAgIC8vIGNvbXBpbGVkIGFuZCBwYXNzZWQgYWxvbmcgd2l0aCB0aGUgZXZlbnQgdG8gXCJncmFkZVwiIHRoZSBhbnN3ZXIuXG4gICAgcHJvY2Vzc0N1cnJlbnRBbnN3ZXJzKGRhdGEpIHtcbiAgICAgICAgbGV0IGNvcnJlY3RDb3VudCA9IDA7XG4gICAgICAgIGxldCBxQ291bnQgPSAwO1xuICAgICAgICBsZXQgYWN0U3RyaW5nID0gXCJjaGVjazpcIjtcbiAgICAgICAgdGhpcy5hbnN3ZXJPYmogPSB7fTtcbiAgICAgICAgdGhpcy5sYXN0QW5zd2VyUmF3ID0gZGF0YTtcbiAgICAgICAgdGhpcy5hbnN3ZXJPYmouYW5zd2VycyA9IHt9O1xuICAgICAgICB0aGlzLmFuc3dlck9iai5tcUFuc3dlcnMgPSB7fTtcbiAgICAgICAgLy8gZGF0YS5pbnB1dHNfXG4gICAgICAgIGZvciAobGV0IGsgb2YgT2JqZWN0LmtleXMoZGF0YS5yaF9yZXN1bHQuYW5zd2VycykpIHtcbiAgICAgICAgICAgIHFDb3VudCArPSAxO1xuICAgICAgICAgICAgaWYgKGRhdGEucmhfcmVzdWx0LmFuc3dlcnNba10uc2NvcmUgPT0gMSkge1xuICAgICAgICAgICAgICAgIGNvcnJlY3RDb3VudCArPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gbW9zdGx5IGdyYWIgb3JpZ2luYWxfc3R1ZGVudF9hbnMsIGJ1dCBncmFiIHN0dWRlbnRfdmFsdWUgZm9yIE1DIGV4ZXJjaXNlc1xuICAgICAgICAgICAgbGV0IHN0dWRlbnRfYW5zO1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICEoXCJ3d192ZXJzaW9uXCIgaW4gZGF0YSkgfHxcbiAgICAgICAgICAgICAgICBkYXRhLnd3X3ZlcnNpb24uaW5jbHVkZXMoXCIyLjE2XCIpIHx8XG4gICAgICAgICAgICAgICAgZGF0YS53d192ZXJzaW9uLmluY2x1ZGVzKFwiMi4xN1wiKSB8fFxuICAgICAgICAgICAgICAgIGRhdGEud3dfdmVyc2lvbi5pbmNsdWRlcyhcIjIuMThcIilcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIC8vIE1vc3RseSBncmFiIG9yaWdpbmFsX3N0dWRlbnRfYW5zLCBidXQgZ3JhYiBzdHVkZW50X3ZhbHVlIGZvciBNQyBleGVyY2lzZXNcbiAgICAgICAgICAgICAgICBzdHVkZW50X2FucyA9IFtcbiAgICAgICAgICAgICAgICAgICAgXCJWYWx1ZSAocGFyc2VyUmFkaW9CdXR0b25zKVwiLFxuICAgICAgICAgICAgICAgICAgICBcIlZhbHVlIChQb3BVcClcIixcbiAgICAgICAgICAgICAgICAgICAgXCJWYWx1ZSAoQ2hlY2tib3hMaXN0KVwiLFxuICAgICAgICAgICAgICAgIF0uaW5jbHVkZXMoZGF0YS5yaF9yZXN1bHQuYW5zd2Vyc1trXS50eXBlKVxuICAgICAgICAgICAgICAgICAgICA/IGRhdGEucmhfcmVzdWx0LmFuc3dlcnNba10uc3R1ZGVudF92YWx1ZVxuICAgICAgICAgICAgICAgICAgICA6IGRhdGEucmhfcmVzdWx0LmFuc3dlcnNba10ub3JpZ2luYWxfc3R1ZGVudF9hbnM7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIExpdGVyYWxseSBnZXQgdGhlIGlucHV0IHJlZnNcbiAgICAgICAgICAgICAgICAvLyBkYXRhLmlucHV0c19yZWZba10gd2lsbCB1c3VhbGx5IGJlIGEgc3RyaW5nLCB0aGUgQHZhbHVlIG9mIHRoZSBhbnN3ZXIgaW5wdXQgZmllbGQgdGhhdCB3YXMgc3VibWl0dGVkXG4gICAgICAgICAgICAgICAgLy8gSG93ZXZlciBpbiBhdCBsZWFzdCB0aGUgY2FzZSBvZiBjaGVja2JveGVzLCBkYXRhLmlucHV0c19yZWZba10gd2lsbCBiZSBhbiBhcnJheVxuICAgICAgICAgICAgICAgIC8vIFNvIGhvd2V2ZXIgdGhpcyBpcyB1bHRpbWF0ZWx5IHN0b3JlZCBpbiB0aGUgUnVuZXN0b25lIGRhdGFiYXNlIHNob3VsZCByZXNwZWN0IGFucyBwcmVzZXJ2ZSB0aGlzIGFzIGFuIGFycmF5LCBub3Qgc3RyaW5naWZpZWRcbiAgICAgICAgICAgICAgICBzdHVkZW50X2FucyA9IGRhdGEuaW5wdXRzX3JlZltrXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuYW5zd2VyT2JqLmFuc3dlcnNba10gPSBzdHVkZW50X2FucztcbiAgICAgICAgICAgIGxldCBtcUtleSA9IGBNYVRoUXVJbExfJHtrfWA7XG4gICAgICAgICAgICB0aGlzLmFuc3dlck9iai5tcUFuc3dlcnNbbXFLZXldID0gZGF0YS5pbnB1dHNfcmVmW21xS2V5XTtcbiAgICAgICAgICAgIGFjdFN0cmluZyArPSBgYWN0dWFsOiR7c3R1ZGVudF9hbnN9OmV4cGVjdGVkOiR7ZGF0YS5yaF9yZXN1bHQuYW5zd2Vyc1trXS5jb3JyZWN0X3ZhbHVlfTpgO1xuICAgICAgICB9XG4gICAgICAgIGxldCBwY3QgPSBjb3JyZWN0Q291bnQgLyBxQ291bnQ7XG4gICAgICAgIC8vIElmIHRoaXMucGVyY2VudCBpcyBzZXQsIHRoZW4gcnVuZXN0b25lYmFzZSB3aWxsIHRyYW5zbWl0IGl0IGFzIHBhcnQgb2ZcbiAgICAgICAgLy8gdGhlIGxvZ0Jvb2tFdmVudCBBUEkuXG4gICAgICAgIHRoaXMucGVyY2VudCA9IHBjdDtcbiAgICAgICAgdGhpcy5hY3RTdHJpbmcgPVxuICAgICAgICAgICAgYWN0U3RyaW5nICsgYGNvcnJlY3Q6JHtjb3JyZWN0Q291bnR9OmNvdW50OiR7cUNvdW50fTpwY3Q6JHtwY3R9YDtcbiAgICAgICAgaWYgKHBjdCA9PSAxLjApIHtcbiAgICAgICAgICAgIHRoaXMuY29ycmVjdCA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNvcnJlY3QgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgbHMgPSB7fTtcbiAgICAgICAgbHMuYW5zd2VyID0gdGhpcy5hbnN3ZXJPYmo7XG4gICAgICAgIGxzLmNvcnJlY3QgPSB0aGlzLmNvcnJlY3Q7XG4gICAgICAgIGxzLnBlcmNlbnQgPSB0aGlzLnBlcmNlbnQ7XG4gICAgICAgIHRoaXMuc2V0TG9jYWxTdG9yYWdlKGxzKTtcbiAgICAgICAgdGhpcy5kZWNvcmF0ZVN0YXR1cygpO1xuICAgIH1cblxuICAgIGFzeW5jIGxvZ0N1cnJlbnRBbnN3ZXIoc2lkKSB7XG4gICAgICAgIHRoaXMubG9nQm9va0V2ZW50KHtcbiAgICAgICAgICAgIGV2ZW50OiBcIndlYndvcmtcIixcbiAgICAgICAgICAgIGRpdl9pZDogdGhpcy5kaXZpZCwgLy90b2RvIHVubWFuZ2xlIHByb2JsZW1pZFxuICAgICAgICAgICAgYWN0OiB0aGlzLmFjdFN0cmluZyxcbiAgICAgICAgICAgIGNvcnJlY3Q6IHRoaXMuY29ycmVjdCxcbiAgICAgICAgICAgIGFuc3dlcjogSlNPTi5zdHJpbmdpZnkodGhpcy5hbnN3ZXJPYmopLFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBjaGVja0N1cnJlbnRBbnN3ZXIoKSB7fVxufVxuXG4vL1xuLy8gVGhlc2UgYXJlIGZ1bmN0aW9ucyB0aGF0IGdldCBjYWxsZWQgaW4gcmVzcG9uc2UgdG8gd2Vid29yayBnZW5lcmF0ZWQgZXZlbnRzLlxuLy8gc3VibWl0dGluZyB0aGUgd29yaywgb3Igc2hvd2luZyBhbiBhbnN3ZXIuXG5mdW5jdGlvbiBsb2dXZWJXb3JrKGUsIGRhdGEpIHtcbiAgICBpZiAoZUJvb2tDb25maWcudXNlUnVuZXN0b25lU2VydmljZXMpIHtcbiAgICAgICAgbGV0IHd3T2JqID0gd3dMaXN0W2RhdGEuaW5wdXRzX3JlZi5wcm9ibGVtVVVJRC5yZXBsYWNlKFwiLXd3LXJzXCIsIFwiXCIpXTtcbiAgICAgICAgaWYgKHd3T2JqKSB7XG4gICAgICAgICAgICB3d09iai5wcm9jZXNzQ3VycmVudEFuc3dlcnMoZGF0YSk7XG4gICAgICAgICAgICB3d09iai5sb2dDdXJyZW50QW5zd2VyKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAgICAgICBgRXJyb3I6IENvdWxkIG5vdCBmaW5kIHdlYndvcmsgb2JqZWN0ICR7ZGF0YS5pbnB1dHNfcmVmLnByb2JsZW1VVUlEfWAsXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBsb2dTaG93Q29ycmVjdChlLCBkYXRhKSB7XG4gICAgaWYgKGVCb29rQ29uZmlnLnVzZVJ1bmVzdG9uZVNlcnZpY2VzKSB7XG4gICAgICAgIGxldCB3d09iaiA9IHd3TGlzdFtkYXRhLmlucHV0c19yZWYucHJvYmxlbVVVSUQucmVwbGFjZShcIi13dy1yc1wiLCBcIlwiKV07XG4gICAgICAgIGlmICh3d09iaikge1xuICAgICAgICAgICAgd3dPYmoubG9nQm9va0V2ZW50KHtcbiAgICAgICAgICAgICAgICBldmVudDogXCJ3ZWJ3b3JrXCIsXG4gICAgICAgICAgICAgICAgZGl2X2lkOiBkYXRhLmlucHV0c19yZWYucHJvYmxlbVVVSUQsXG4gICAgICAgICAgICAgICAgYWN0OiBcInNob3dcIixcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgICAgICAgYEVycm9yOiBDb3VsZCBub3QgZmluZCB3ZWJ3b3JrIG9iamVjdCAke2RhdGEuaW5wdXRzX3JlZi5wcm9ibGVtVVVJRH1gLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0U2NvcmVzKHNpZCwgd3dJZCkge31cblxuaWYgKHR5cGVvZiB3aW5kb3cuY29tcG9uZW50X2ZhY3RvcnkgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB3aW5kb3cuY29tcG9uZW50X2ZhY3RvcnkgPSB7fTtcbn1cblxud2luZG93LmNvbXBvbmVudF9mYWN0b3J5LndlYndvcmsgPSBmdW5jdGlvbiAob3B0cykge1xuICAgIHJldHVybiBuZXcgV2ViV29yayhvcHRzKTtcbn07XG5cbi8vIFRoZSBXZUJXb3JLIHNlcnZlcidzIG93biBKUyBmaXJlcyB0aGVzZSBldmVudHMuIEhpc3RvcmljYWxseSBpdCBkb2VzIHNvXG4vLyB3aXRoIHRoZSBwYWdlJ3MgalF1ZXJ5IChgJChcImJvZHlcIikudHJpZ2dlciguLi4pYCwgcGF5bG9hZCBhcyBhbiBleHRyYVxuLy8gaGFuZGxlciBhcmd1bWVudCk7IGpRdWVyeS10cmlnZ2VyZWQgZXZlbnRzIG5ldmVyIHJlYWNoIG5hdGl2ZSBsaXN0ZW5lcnMsIHNvXG4vLyB3aGVuIHRoZSBwYWdlIHByb3ZpZGVzIGpRdWVyeSB3ZSBtdXN0IHJlZ2lzdGVyIHRocm91Z2ggaXQuIEEgalF1ZXJ5XG4vLyByZWdpc3RyYXRpb24gYWxzbyBzZWVzIG5hdGl2ZWx5IGRpc3BhdGNoZWQgQ3VzdG9tRXZlbnRzLCBzbyBleGFjdGx5IG9uZVxuLy8gcmVnaXN0cmF0aW9uIHBhdGggaXMgdXNlZCB0byBhdm9pZCBoYW5kbGluZyBhbiBldmVudCB0d2ljZS4gVGhlIHBheWxvYWRcbi8vIGNhbiBhcnJpdmUgYXMgdGhlIGV4dHJhIGpRdWVyeSBhcmd1bWVudCBvciBhcyB0aGUgQ3VzdG9tRXZlbnQgZGV0YWlsLlxuZnVuY3Rpb24gd3dIYW5kbGVyKGhhbmRsZXIpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGUsIGRhdGEpIHtcbiAgICAgICAgY29uc3QgcGF5bG9hZCA9XG4gICAgICAgICAgICBkYXRhICE9PSB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICA/IGRhdGFcbiAgICAgICAgICAgICAgICA6IChlLmRldGFpbCA/PyBlLm9yaWdpbmFsRXZlbnQ/LmRldGFpbCk7XG4gICAgICAgIGlmIChwYXlsb2FkID09PSB1bmRlZmluZWQpIHJldHVybjtcbiAgICAgICAgaGFuZGxlcihlLCBwYXlsb2FkKTtcbiAgICB9O1xufVxuXG5mdW5jdGlvbiByZWdpc3RlcldXTGlzdGVuZXJzKCkge1xuICAgIGlmICh3aW5kb3cualF1ZXJ5KSB7XG4gICAgICAgIHdpbmRvdy5qUXVlcnkoXCJib2R5XCIpLm9uKFwicnVuZXN0b25lX3d3X2NoZWNrXCIsIHd3SGFuZGxlcihsb2dXZWJXb3JrKSk7XG4gICAgICAgIHdpbmRvd1xuICAgICAgICAgICAgLmpRdWVyeShcImJvZHlcIilcbiAgICAgICAgICAgIC5vbihcInJ1bmVzdG9uZV9zaG93X2NvcnJlY3RcIiwgd3dIYW5kbGVyKGxvZ1Nob3dDb3JyZWN0KSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgXCJydW5lc3RvbmVfd3dfY2hlY2tcIixcbiAgICAgICAgICAgIHd3SGFuZGxlcihsb2dXZWJXb3JrKSxcbiAgICAgICAgKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgXCJydW5lc3RvbmVfc2hvd19jb3JyZWN0XCIsXG4gICAgICAgICAgICB3d0hhbmRsZXIobG9nU2hvd0NvcnJlY3QpLFxuICAgICAgICApO1xuICAgIH1cbn1cblxuaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgPT09IFwibG9hZGluZ1wiKSB7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgcmVnaXN0ZXJXV0xpc3RlbmVycyk7XG59IGVsc2Uge1xuICAgIHJlZ2lzdGVyV1dMaXN0ZW5lcnMoKTtcbn1cblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInJ1bmVzdG9uZTpsb2dpbi1jb21wbGV0ZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgZm9yIChsZXQgZWxlbWVudCBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFxuICAgICAgICBcIltkYXRhLWNvbXBvbmVudD13ZWJ3b3JrXVwiLFxuICAgICkpIHtcbiAgICAgICAgdmFyIG9wdHMgPSB7XG4gICAgICAgICAgICBvcmlnOiBlbGVtZW50LFxuICAgICAgICAgICAgdXNlUnVuZXN0b25lU2VydmljZXM6IGVCb29rQ29uZmlnLnVzZVJ1bmVzdG9uZVNlcnZpY2VzLFxuICAgICAgICB9O1xuICAgICAgICBpZiAoIWVsZW1lbnQuY2xvc2VzdChcIltkYXRhLWNvbXBvbmVudD10aW1lZEFzc2Vzc21lbnRdXCIpKSB7XG4gICAgICAgICAgICAvLyBJZiB0aGlzIGVsZW1lbnQgZXhpc3RzIHdpdGhpbiBhIHRpbWVkIGNvbXBvbmVudCwgZG9uJ3QgcmVuZGVyIGl0IGhlcmVcbiAgICAgICAgICAgIHdpbmRvdy53d0xpc3RbZWxlbWVudC5pZF0gPSBuZXcgV2ViV29yayhvcHRzKTtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9