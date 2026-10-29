"use strict";
(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_poll_js_poll_js"],{

/***/ 11168:
/*!***********************************!*\
  !*** ./runestone/poll/js/poll.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Poll)
/* harmony export */ });
/* harmony import */ var _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/runestonebase.js */ 78673);
/* harmony import */ var _css_poll_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../css/poll.css */ 96835);
/*
__author__ = Kirby Olson
__date__ = 6/12/2015  */





class Poll extends _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(opts) {
        super(opts);
        var orig = opts.orig; //entire <p> element
        this.origElem = orig;
        this.divid = orig.id;
        this.children = this.origElem.childNodes;
        this.optionList = [];
        this.optsArray = [];
        this.comment = false;
        if (this.origElem.hasAttribute("data-comment")) {
            this.comment = true;
        }
        this.resultsViewer = this.origElem.getAttribute("data-results");
        this.getQuestionText();
        this.getOptionText(); //populates optionList
        this.renderPoll(); //generates HTML
        // Checks localStorage to see if this poll has already been completed by this user.
        this.checkPollStorage();
        this.caption = "Poll";
        this.addCaption("runestone");
    }
    getQuestionText() {
        //finds the text inside the parent tag, but before the first <li> tag and sets it as the question
        var _this = this;
        var firstAnswer;
        for (var i = 0; i < this.children.length; i++) {
            if (this.children[i].tagName == "LI") {
                firstAnswer = _this.children[i];
                break;
            }
        }
        var delimiter = firstAnswer.outerHTML;
        var fulltext = this.origElem.innerHTML;
        var temp = fulltext.split(delimiter);
        this.question = temp[0];
    }
    getOptionText() {
        //Gets the text from each <li> tag and places it in this.optionList
        var _this = this;
        for (var i = 0; i < this.children.length; i++) {
            if (_this.children[i].tagName == "LI") {
                _this.optionList.push(_this.children[i].innerHTML);
            }
        }
    }
    renderPoll() {
        //generates the HTML that the user interacts with
        var _this = this;
        this.containerDiv = document.createElement("div");
        this.pollForm = document.createElement("form");
        this.resultsDiv = document.createElement("div");
        this.resultsDiv.classList.add("poll-results");
        this.containerDiv.id = this.divid;
        const origClass = this.origElem.getAttribute("class");
        if (origClass) {
            this.containerDiv.classList.add(
                ...origClass.split(" ").filter(Boolean),
            );
        }
        this.pollForm.innerHTML = `<div class="exercise-statement">${this.question}</div>`;
        this.pollForm.id = this.divid + "_form";
        this.pollForm.method = "get";
        this.pollForm.action = "";
        this.pollForm.onsubmit = function () {
            return false;
        };
        this.pollFieldset = document.createElement("fieldset");
        this.pollForm.appendChild(this.pollFieldset);
        for (var i = 0; i < this.optionList.length; i++) {
            let label = document.createElement("label");
            label.classList.add("poll-option");
            label.innerHTML += this.optionList[i]; // text content
            var radio = document.createElement("input");
            var tmpid = _this.divid + "_opt_" + i;
            radio.id = tmpid;
            radio.name = this.divid + "_group1";
            radio.type = "radio";
            radio.value = i;
            radio.classList.add("poll-choice-input");
            radio.addEventListener("click", this.submitPoll.bind(this));
            label.prepend(radio);
            this.pollFieldset.appendChild(label);
            this.optsArray.push(radio);
        }

        if (this.comment) {
            this.renderTextField();
        }
        this.resultsDiv.id = this.divid + "_results";
        this.containerDiv.appendChild(this.pollForm);
        this.containerDiv.appendChild(this.resultsDiv);
        this.origElem.replaceWith(this.containerDiv);
        this.queueMathJax(this.containerDiv);
    }
    renderTextField() {
        this.textfield = document.createElement("input");
        this.textfield.type = "text";
        this.textfield.classList.add("form-control");
        this.textfield.style.width = "300px";
        this.textfield.name = this.divid + "_comment";
        this.textfield.placeholder = "Any comments?";
        this.pollForm.appendChild(this.textfield);
        this.pollForm.appendChild(document.createElement("br"));
    }
    async submitPoll() {
        //checks the poll, sets localstorage and submits to the server
        var poll_val = null;
        for (var i = 0; i < this.optsArray.length; i++) {
            if (this.optsArray[i].checked) {
                poll_val = this.optsArray[i].value;
                break;
            }
        }
        if (poll_val === null) return;
        var comment_val = "";
        if (this.comment) {
            comment_val = this.textfield.value;
        }
        var act = "";
        if (comment_val !== "") {
            act = poll_val + ":" + comment_val;
        } else {
            act = poll_val;
        }
        var eventInfo = { event: "poll", act: act, div_id: this.divid };
        // log the response to the database
        this.logBookEvent(eventInfo); // in bookfuncs.js
        // log the fact that the user has answered the poll to local storage
        let onlineResponse = "Thanks, your response has been recorded";
        let offlineResponse = "Thanks, your answers are not recorded";
        let onlineUpdate = "Only Your last reponse is recorded";
        let offlineUpdate = "Thanks, your answers are not recorded";
        localStorage.setItem(this.divid, "true");
        if (!document.getElementById(`${this.divid}_sent`)) {
            const span = document.createElement("span");
            span.id = `${this.divid}_sent`;
            span.innerHTML = `<strong>${eBookConfig.useRunestoneServices ? onlineResponse : offlineResponse}</strong>`;
            this.pollForm.appendChild(span);
        } else {
            const sentEl = document.getElementById(`${this.divid}_sent`);
            sentEl.innerHTML = `<strong>${eBookConfig.useRunestoneServices ? onlineUpdate : offlineUpdate}</strong>`;
        }
        // show the results of the poll
        if (this.resultsViewer === "all") {
            var data = {};
            data.div_id = this.divid;
            data.course = eBookConfig.course;
            try {
                const params = new URLSearchParams(data);
                const resp = await fetch(
                    `${eBookConfig.new_server_prefix}/assessment/getpollresults?${params.toString()}`,
                );
                const json = await resp.json();
                this.showPollResults(json);
            } catch (e) {
                this.indicate_component_ready();
            }
        }
    }
    showPollResults(results) {
        //displays the results returned by the server
        results = results.detail;
        var total = results["total"];
        var optCounts = results["opt_counts"];
        var div_id = results["div_id"];
        var my_vote = results["my_vote"];
        // restore current users vote
        if (my_vote > -1) {
            this.optsArray[my_vote].checked = true;
        }
        // show results summary if appropriate
        if (
            (this.resultsViewer === "all" &&
                localStorage.getItem(this.divid) === "true") ||
            eBookConfig.isInstructor
        ) {
            this.resultsDiv.innerHTML = `<b>Results:</b> ${total} responses <br><br>`;
            var list = document.createElement("div");
            list.classList.add("results-container");
            for (var i = 0; i < this.optionList.length; i++) {
                var count;
                var percent;
                if (optCounts[i] > 0) {
                    count = optCounts[i];
                    percent = (count / total) * 100;
                } else {
                    count = 0;
                    percent = 0;
                }
                var text = count + " (" + Math.round(10 * percent) / 10 + "%)"; // round percent to 10ths
                let progressCounterEl = document.createElement("div");
                progressCounterEl.className = "progresscounter";
                progressCounterEl.innerText = `${i + 1}. `;
                let progressBarEl = document.createElement("div");
                let progressBarHTML = "";
                if (percent > 10) {
                    progressBarHTML =
                        "<div class='progress'>" +
                        "<div class='progress-bar progress-bar-success'" +
                        `style="width: ${percent}%; min-width: 2em;">` +
                        "<span class='poll-text'>" +
                        text +
                        "</span></div></div>";
                } else {
                    progressBarHTML =
                        "<div class='progress'>" +
                        "<div class='progress-bar progress-bar-success'" +
                        `style="width: ${percent}%; min-width: 2em;"></div>` +
                        "<span class='poll-text' style='margin: 0 0 0 10px;'>" +
                        text +
                        "</span></div>";
                }
                progressBarEl.innerHTML = progressBarHTML;
                list.appendChild(progressCounterEl);
                list.appendChild(progressBarEl);
            }
            this.resultsDiv.appendChild(list);
        }
        this.indicate_component_ready();
    }
    disableOptions() {}
    async checkPollStorage() {
        //checks the localstorage to see if the poll has been completed already
        var _this = this;
        var len = localStorage.length;
        if (len > 0) {
            //If the poll has already been completed, show the results
            var data = {};
            data.div_id = this.divid;
            data.course = eBookConfig.course;
            try {
                const params = new URLSearchParams(data);
                const resp = await fetch(
                    `${eBookConfig.new_server_prefix}/assessment/getpollresults?${params.toString()}`,
                );
                const json = await resp.json();
                this.showPollResults(json);
            } catch (e) {
                this.indicate_component_ready();
            }
        } else {
            this.indicate_component_ready();
        }
    }
}

// Do not render poll data until login-complete event so we know instructor status
document.addEventListener("runestone:login-complete", function () {
    document
        .querySelectorAll("[data-component=poll]")
        .forEach(function (el, index) {
            try {
                window.componentMap[el.id] = new Poll({ orig: el });
            } catch (err) {
                console.log(`Error rendering Poll Problem ${el.id}
                         Details: ${err}`);
                console.log(err.stack);
            }
        });
});

if (typeof window.component_factory === "undefined") {
    window.component_factory = {};
}
window.component_factory.poll = function (opts) {
    return new Poll(opts);
};


/***/ }),

/***/ 96835:
/*!*************************************!*\
  !*** ./runestone/poll/css/poll.css ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QWM7QUFDZCw0REFBNEQ7QUFDNUQsb0NBQW9DLElBQUk7QUFDeEM7QUFDQTtBQUNBLFNBQVM7QUFDVCxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDblJBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9wb2xsL2pzL3BvbGwuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9wb2xsL2Nzcy9wb2xsLmNzcz84Y2E4Il0sInNvdXJjZXNDb250ZW50IjpbIi8qXG5fX2F1dGhvcl9fID0gS2lyYnkgT2xzb25cbl9fZGF0ZV9fID0gNi8xMi8yMDE1ICAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCBSdW5lc3RvbmVCYXNlIGZyb20gXCIuLi8uLi9jb21tb24vanMvcnVuZXN0b25lYmFzZS5qc1wiO1xuaW1wb3J0IFwiLi4vY3NzL3BvbGwuY3NzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBvbGwgZXh0ZW5kcyBSdW5lc3RvbmVCYXNlIHtcbiAgICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgICAgIHN1cGVyKG9wdHMpO1xuICAgICAgICB2YXIgb3JpZyA9IG9wdHMub3JpZzsgLy9lbnRpcmUgPHA+IGVsZW1lbnRcbiAgICAgICAgdGhpcy5vcmlnRWxlbSA9IG9yaWc7XG4gICAgICAgIHRoaXMuZGl2aWQgPSBvcmlnLmlkO1xuICAgICAgICB0aGlzLmNoaWxkcmVuID0gdGhpcy5vcmlnRWxlbS5jaGlsZE5vZGVzO1xuICAgICAgICB0aGlzLm9wdGlvbkxpc3QgPSBbXTtcbiAgICAgICAgdGhpcy5vcHRzQXJyYXkgPSBbXTtcbiAgICAgICAgdGhpcy5jb21tZW50ID0gZmFsc2U7XG4gICAgICAgIGlmICh0aGlzLm9yaWdFbGVtLmhhc0F0dHJpYnV0ZShcImRhdGEtY29tbWVudFwiKSkge1xuICAgICAgICAgICAgdGhpcy5jb21tZW50ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlc3VsdHNWaWV3ZXIgPSB0aGlzLm9yaWdFbGVtLmdldEF0dHJpYnV0ZShcImRhdGEtcmVzdWx0c1wiKTtcbiAgICAgICAgdGhpcy5nZXRRdWVzdGlvblRleHQoKTtcbiAgICAgICAgdGhpcy5nZXRPcHRpb25UZXh0KCk7IC8vcG9wdWxhdGVzIG9wdGlvbkxpc3RcbiAgICAgICAgdGhpcy5yZW5kZXJQb2xsKCk7IC8vZ2VuZXJhdGVzIEhUTUxcbiAgICAgICAgLy8gQ2hlY2tzIGxvY2FsU3RvcmFnZSB0byBzZWUgaWYgdGhpcyBwb2xsIGhhcyBhbHJlYWR5IGJlZW4gY29tcGxldGVkIGJ5IHRoaXMgdXNlci5cbiAgICAgICAgdGhpcy5jaGVja1BvbGxTdG9yYWdlKCk7XG4gICAgICAgIHRoaXMuY2FwdGlvbiA9IFwiUG9sbFwiO1xuICAgICAgICB0aGlzLmFkZENhcHRpb24oXCJydW5lc3RvbmVcIik7XG4gICAgfVxuICAgIGdldFF1ZXN0aW9uVGV4dCgpIHtcbiAgICAgICAgLy9maW5kcyB0aGUgdGV4dCBpbnNpZGUgdGhlIHBhcmVudCB0YWcsIGJ1dCBiZWZvcmUgdGhlIGZpcnN0IDxsaT4gdGFnIGFuZCBzZXRzIGl0IGFzIHRoZSBxdWVzdGlvblxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB2YXIgZmlyc3RBbnN3ZXI7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuY2hpbGRyZW5baV0udGFnTmFtZSA9PSBcIkxJXCIpIHtcbiAgICAgICAgICAgICAgICBmaXJzdEFuc3dlciA9IF90aGlzLmNoaWxkcmVuW2ldO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciBkZWxpbWl0ZXIgPSBmaXJzdEFuc3dlci5vdXRlckhUTUw7XG4gICAgICAgIHZhciBmdWxsdGV4dCA9IHRoaXMub3JpZ0VsZW0uaW5uZXJIVE1MO1xuICAgICAgICB2YXIgdGVtcCA9IGZ1bGx0ZXh0LnNwbGl0KGRlbGltaXRlcik7XG4gICAgICAgIHRoaXMucXVlc3Rpb24gPSB0ZW1wWzBdO1xuICAgIH1cbiAgICBnZXRPcHRpb25UZXh0KCkge1xuICAgICAgICAvL0dldHMgdGhlIHRleHQgZnJvbSBlYWNoIDxsaT4gdGFnIGFuZCBwbGFjZXMgaXQgaW4gdGhpcy5vcHRpb25MaXN0XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKF90aGlzLmNoaWxkcmVuW2ldLnRhZ05hbWUgPT0gXCJMSVwiKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMub3B0aW9uTGlzdC5wdXNoKF90aGlzLmNoaWxkcmVuW2ldLmlubmVySFRNTCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmVuZGVyUG9sbCgpIHtcbiAgICAgICAgLy9nZW5lcmF0ZXMgdGhlIEhUTUwgdGhhdCB0aGUgdXNlciBpbnRlcmFjdHMgd2l0aFxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHRoaXMucG9sbEZvcm0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZm9ybVwiKTtcbiAgICAgICAgdGhpcy5yZXN1bHRzRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdGhpcy5yZXN1bHRzRGl2LmNsYXNzTGlzdC5hZGQoXCJwb2xsLXJlc3VsdHNcIik7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmlkID0gdGhpcy5kaXZpZDtcbiAgICAgICAgY29uc3Qgb3JpZ0NsYXNzID0gdGhpcy5vcmlnRWxlbS5nZXRBdHRyaWJ1dGUoXCJjbGFzc1wiKTtcbiAgICAgICAgaWYgKG9yaWdDbGFzcykge1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXJEaXYuY2xhc3NMaXN0LmFkZChcbiAgICAgICAgICAgICAgICAuLi5vcmlnQ2xhc3Muc3BsaXQoXCIgXCIpLmZpbHRlcihCb29sZWFuKSxcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wb2xsRm9ybS5pbm5lckhUTUwgPSBgPGRpdiBjbGFzcz1cImV4ZXJjaXNlLXN0YXRlbWVudFwiPiR7dGhpcy5xdWVzdGlvbn08L2Rpdj5gO1xuICAgICAgICB0aGlzLnBvbGxGb3JtLmlkID0gdGhpcy5kaXZpZCArIFwiX2Zvcm1cIjtcbiAgICAgICAgdGhpcy5wb2xsRm9ybS5tZXRob2QgPSBcImdldFwiO1xuICAgICAgICB0aGlzLnBvbGxGb3JtLmFjdGlvbiA9IFwiXCI7XG4gICAgICAgIHRoaXMucG9sbEZvcm0ub25zdWJtaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMucG9sbEZpZWxkc2V0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImZpZWxkc2V0XCIpO1xuICAgICAgICB0aGlzLnBvbGxGb3JtLmFwcGVuZENoaWxkKHRoaXMucG9sbEZpZWxkc2V0KTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm9wdGlvbkxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiKTtcbiAgICAgICAgICAgIGxhYmVsLmNsYXNzTGlzdC5hZGQoXCJwb2xsLW9wdGlvblwiKTtcbiAgICAgICAgICAgIGxhYmVsLmlubmVySFRNTCArPSB0aGlzLm9wdGlvbkxpc3RbaV07IC8vIHRleHQgY29udGVudFxuICAgICAgICAgICAgdmFyIHJhZGlvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xuICAgICAgICAgICAgdmFyIHRtcGlkID0gX3RoaXMuZGl2aWQgKyBcIl9vcHRfXCIgKyBpO1xuICAgICAgICAgICAgcmFkaW8uaWQgPSB0bXBpZDtcbiAgICAgICAgICAgIHJhZGlvLm5hbWUgPSB0aGlzLmRpdmlkICsgXCJfZ3JvdXAxXCI7XG4gICAgICAgICAgICByYWRpby50eXBlID0gXCJyYWRpb1wiO1xuICAgICAgICAgICAgcmFkaW8udmFsdWUgPSBpO1xuICAgICAgICAgICAgcmFkaW8uY2xhc3NMaXN0LmFkZChcInBvbGwtY2hvaWNlLWlucHV0XCIpO1xuICAgICAgICAgICAgcmFkaW8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuc3VibWl0UG9sbC5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIGxhYmVsLnByZXBlbmQocmFkaW8pO1xuICAgICAgICAgICAgdGhpcy5wb2xsRmllbGRzZXQuYXBwZW5kQ2hpbGQobGFiZWwpO1xuICAgICAgICAgICAgdGhpcy5vcHRzQXJyYXkucHVzaChyYWRpbyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5jb21tZW50KSB7XG4gICAgICAgICAgICB0aGlzLnJlbmRlclRleHRGaWVsZCgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVzdWx0c0Rpdi5pZCA9IHRoaXMuZGl2aWQgKyBcIl9yZXN1bHRzXCI7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmFwcGVuZENoaWxkKHRoaXMucG9sbEZvcm0pO1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZCh0aGlzLnJlc3VsdHNEaXYpO1xuICAgICAgICB0aGlzLm9yaWdFbGVtLnJlcGxhY2VXaXRoKHRoaXMuY29udGFpbmVyRGl2KTtcbiAgICAgICAgdGhpcy5xdWV1ZU1hdGhKYXgodGhpcy5jb250YWluZXJEaXYpO1xuICAgIH1cbiAgICByZW5kZXJUZXh0RmllbGQoKSB7XG4gICAgICAgIHRoaXMudGV4dGZpZWxkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xuICAgICAgICB0aGlzLnRleHRmaWVsZC50eXBlID0gXCJ0ZXh0XCI7XG4gICAgICAgIHRoaXMudGV4dGZpZWxkLmNsYXNzTGlzdC5hZGQoXCJmb3JtLWNvbnRyb2xcIik7XG4gICAgICAgIHRoaXMudGV4dGZpZWxkLnN0eWxlLndpZHRoID0gXCIzMDBweFwiO1xuICAgICAgICB0aGlzLnRleHRmaWVsZC5uYW1lID0gdGhpcy5kaXZpZCArIFwiX2NvbW1lbnRcIjtcbiAgICAgICAgdGhpcy50ZXh0ZmllbGQucGxhY2Vob2xkZXIgPSBcIkFueSBjb21tZW50cz9cIjtcbiAgICAgICAgdGhpcy5wb2xsRm9ybS5hcHBlbmRDaGlsZCh0aGlzLnRleHRmaWVsZCk7XG4gICAgICAgIHRoaXMucG9sbEZvcm0uYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJyXCIpKTtcbiAgICB9XG4gICAgYXN5bmMgc3VibWl0UG9sbCgpIHtcbiAgICAgICAgLy9jaGVja3MgdGhlIHBvbGwsIHNldHMgbG9jYWxzdG9yYWdlIGFuZCBzdWJtaXRzIHRvIHRoZSBzZXJ2ZXJcbiAgICAgICAgdmFyIHBvbGxfdmFsID0gbnVsbDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm9wdHNBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMub3B0c0FycmF5W2ldLmNoZWNrZWQpIHtcbiAgICAgICAgICAgICAgICBwb2xsX3ZhbCA9IHRoaXMub3B0c0FycmF5W2ldLnZhbHVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChwb2xsX3ZhbCA9PT0gbnVsbCkgcmV0dXJuO1xuICAgICAgICB2YXIgY29tbWVudF92YWwgPSBcIlwiO1xuICAgICAgICBpZiAodGhpcy5jb21tZW50KSB7XG4gICAgICAgICAgICBjb21tZW50X3ZhbCA9IHRoaXMudGV4dGZpZWxkLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBhY3QgPSBcIlwiO1xuICAgICAgICBpZiAoY29tbWVudF92YWwgIT09IFwiXCIpIHtcbiAgICAgICAgICAgIGFjdCA9IHBvbGxfdmFsICsgXCI6XCIgKyBjb21tZW50X3ZhbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFjdCA9IHBvbGxfdmFsO1xuICAgICAgICB9XG4gICAgICAgIHZhciBldmVudEluZm8gPSB7IGV2ZW50OiBcInBvbGxcIiwgYWN0OiBhY3QsIGRpdl9pZDogdGhpcy5kaXZpZCB9O1xuICAgICAgICAvLyBsb2cgdGhlIHJlc3BvbnNlIHRvIHRoZSBkYXRhYmFzZVxuICAgICAgICB0aGlzLmxvZ0Jvb2tFdmVudChldmVudEluZm8pOyAvLyBpbiBib29rZnVuY3MuanNcbiAgICAgICAgLy8gbG9nIHRoZSBmYWN0IHRoYXQgdGhlIHVzZXIgaGFzIGFuc3dlcmVkIHRoZSBwb2xsIHRvIGxvY2FsIHN0b3JhZ2VcbiAgICAgICAgbGV0IG9ubGluZVJlc3BvbnNlID0gXCJUaGFua3MsIHlvdXIgcmVzcG9uc2UgaGFzIGJlZW4gcmVjb3JkZWRcIjtcbiAgICAgICAgbGV0IG9mZmxpbmVSZXNwb25zZSA9IFwiVGhhbmtzLCB5b3VyIGFuc3dlcnMgYXJlIG5vdCByZWNvcmRlZFwiO1xuICAgICAgICBsZXQgb25saW5lVXBkYXRlID0gXCJPbmx5IFlvdXIgbGFzdCByZXBvbnNlIGlzIHJlY29yZGVkXCI7XG4gICAgICAgIGxldCBvZmZsaW5lVXBkYXRlID0gXCJUaGFua3MsIHlvdXIgYW5zd2VycyBhcmUgbm90IHJlY29yZGVkXCI7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMuZGl2aWQsIFwidHJ1ZVwiKTtcbiAgICAgICAgaWYgKCFkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgJHt0aGlzLmRpdmlkfV9zZW50YCkpIHtcbiAgICAgICAgICAgIGNvbnN0IHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICAgICAgICAgIHNwYW4uaWQgPSBgJHt0aGlzLmRpdmlkfV9zZW50YDtcbiAgICAgICAgICAgIHNwYW4uaW5uZXJIVE1MID0gYDxzdHJvbmc+JHtlQm9va0NvbmZpZy51c2VSdW5lc3RvbmVTZXJ2aWNlcyA/IG9ubGluZVJlc3BvbnNlIDogb2ZmbGluZVJlc3BvbnNlfTwvc3Ryb25nPmA7XG4gICAgICAgICAgICB0aGlzLnBvbGxGb3JtLmFwcGVuZENoaWxkKHNwYW4pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3Qgc2VudEVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYCR7dGhpcy5kaXZpZH1fc2VudGApO1xuICAgICAgICAgICAgc2VudEVsLmlubmVySFRNTCA9IGA8c3Ryb25nPiR7ZUJvb2tDb25maWcudXNlUnVuZXN0b25lU2VydmljZXMgPyBvbmxpbmVVcGRhdGUgOiBvZmZsaW5lVXBkYXRlfTwvc3Ryb25nPmA7XG4gICAgICAgIH1cbiAgICAgICAgLy8gc2hvdyB0aGUgcmVzdWx0cyBvZiB0aGUgcG9sbFxuICAgICAgICBpZiAodGhpcy5yZXN1bHRzVmlld2VyID09PSBcImFsbFwiKSB7XG4gICAgICAgICAgICB2YXIgZGF0YSA9IHt9O1xuICAgICAgICAgICAgZGF0YS5kaXZfaWQgPSB0aGlzLmRpdmlkO1xuICAgICAgICAgICAgZGF0YS5jb3Vyc2UgPSBlQm9va0NvbmZpZy5jb3Vyc2U7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMoZGF0YSk7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzcCA9IGF3YWl0IGZldGNoKFxuICAgICAgICAgICAgICAgICAgICBgJHtlQm9va0NvbmZpZy5uZXdfc2VydmVyX3ByZWZpeH0vYXNzZXNzbWVudC9nZXRwb2xscmVzdWx0cz8ke3BhcmFtcy50b1N0cmluZygpfWAsXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBjb25zdCBqc29uID0gYXdhaXQgcmVzcC5qc29uKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5zaG93UG9sbFJlc3VsdHMoanNvbik7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbmRpY2F0ZV9jb21wb25lbnRfcmVhZHkoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBzaG93UG9sbFJlc3VsdHMocmVzdWx0cykge1xuICAgICAgICAvL2Rpc3BsYXlzIHRoZSByZXN1bHRzIHJldHVybmVkIGJ5IHRoZSBzZXJ2ZXJcbiAgICAgICAgcmVzdWx0cyA9IHJlc3VsdHMuZGV0YWlsO1xuICAgICAgICB2YXIgdG90YWwgPSByZXN1bHRzW1widG90YWxcIl07XG4gICAgICAgIHZhciBvcHRDb3VudHMgPSByZXN1bHRzW1wib3B0X2NvdW50c1wiXTtcbiAgICAgICAgdmFyIGRpdl9pZCA9IHJlc3VsdHNbXCJkaXZfaWRcIl07XG4gICAgICAgIHZhciBteV92b3RlID0gcmVzdWx0c1tcIm15X3ZvdGVcIl07XG4gICAgICAgIC8vIHJlc3RvcmUgY3VycmVudCB1c2VycyB2b3RlXG4gICAgICAgIGlmIChteV92b3RlID4gLTEpIHtcbiAgICAgICAgICAgIHRoaXMub3B0c0FycmF5W215X3ZvdGVdLmNoZWNrZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIC8vIHNob3cgcmVzdWx0cyBzdW1tYXJ5IGlmIGFwcHJvcHJpYXRlXG4gICAgICAgIGlmIChcbiAgICAgICAgICAgICh0aGlzLnJlc3VsdHNWaWV3ZXIgPT09IFwiYWxsXCIgJiZcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLmRpdmlkKSA9PT0gXCJ0cnVlXCIpIHx8XG4gICAgICAgICAgICBlQm9va0NvbmZpZy5pc0luc3RydWN0b3JcbiAgICAgICAgKSB7XG4gICAgICAgICAgICB0aGlzLnJlc3VsdHNEaXYuaW5uZXJIVE1MID0gYDxiPlJlc3VsdHM6PC9iPiAke3RvdGFsfSByZXNwb25zZXMgPGJyPjxicj5gO1xuICAgICAgICAgICAgdmFyIGxpc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgbGlzdC5jbGFzc0xpc3QuYWRkKFwicmVzdWx0cy1jb250YWluZXJcIik7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMub3B0aW9uTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBjb3VudDtcbiAgICAgICAgICAgICAgICB2YXIgcGVyY2VudDtcbiAgICAgICAgICAgICAgICBpZiAob3B0Q291bnRzW2ldID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBjb3VudCA9IG9wdENvdW50c1tpXTtcbiAgICAgICAgICAgICAgICAgICAgcGVyY2VudCA9IChjb3VudCAvIHRvdGFsKSAqIDEwMDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb3VudCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHBlcmNlbnQgPSAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgdGV4dCA9IGNvdW50ICsgXCIgKFwiICsgTWF0aC5yb3VuZCgxMCAqIHBlcmNlbnQpIC8gMTAgKyBcIiUpXCI7IC8vIHJvdW5kIHBlcmNlbnQgdG8gMTB0aHNcbiAgICAgICAgICAgICAgICBsZXQgcHJvZ3Jlc3NDb3VudGVyRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgICAgIHByb2dyZXNzQ291bnRlckVsLmNsYXNzTmFtZSA9IFwicHJvZ3Jlc3Njb3VudGVyXCI7XG4gICAgICAgICAgICAgICAgcHJvZ3Jlc3NDb3VudGVyRWwuaW5uZXJUZXh0ID0gYCR7aSArIDF9LiBgO1xuICAgICAgICAgICAgICAgIGxldCBwcm9ncmVzc0JhckVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgICAgICBsZXQgcHJvZ3Jlc3NCYXJIVE1MID0gXCJcIjtcbiAgICAgICAgICAgICAgICBpZiAocGVyY2VudCA+IDEwKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb2dyZXNzQmFySFRNTCA9XG4gICAgICAgICAgICAgICAgICAgICAgICBcIjxkaXYgY2xhc3M9J3Byb2dyZXNzJz5cIiArXG4gICAgICAgICAgICAgICAgICAgICAgICBcIjxkaXYgY2xhc3M9J3Byb2dyZXNzLWJhciBwcm9ncmVzcy1iYXItc3VjY2VzcydcIiArXG4gICAgICAgICAgICAgICAgICAgICAgICBgc3R5bGU9XCJ3aWR0aDogJHtwZXJjZW50fSU7IG1pbi13aWR0aDogMmVtO1wiPmAgK1xuICAgICAgICAgICAgICAgICAgICAgICAgXCI8c3BhbiBjbGFzcz0ncG9sbC10ZXh0Jz5cIiArXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0ICtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiPC9zcGFuPjwvZGl2PjwvZGl2PlwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHByb2dyZXNzQmFySFRNTCA9XG4gICAgICAgICAgICAgICAgICAgICAgICBcIjxkaXYgY2xhc3M9J3Byb2dyZXNzJz5cIiArXG4gICAgICAgICAgICAgICAgICAgICAgICBcIjxkaXYgY2xhc3M9J3Byb2dyZXNzLWJhciBwcm9ncmVzcy1iYXItc3VjY2VzcydcIiArXG4gICAgICAgICAgICAgICAgICAgICAgICBgc3R5bGU9XCJ3aWR0aDogJHtwZXJjZW50fSU7IG1pbi13aWR0aDogMmVtO1wiPjwvZGl2PmAgK1xuICAgICAgICAgICAgICAgICAgICAgICAgXCI8c3BhbiBjbGFzcz0ncG9sbC10ZXh0JyBzdHlsZT0nbWFyZ2luOiAwIDAgMCAxMHB4Oyc+XCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dCArXG4gICAgICAgICAgICAgICAgICAgICAgICBcIjwvc3Bhbj48L2Rpdj5cIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcHJvZ3Jlc3NCYXJFbC5pbm5lckhUTUwgPSBwcm9ncmVzc0JhckhUTUw7XG4gICAgICAgICAgICAgICAgbGlzdC5hcHBlbmRDaGlsZChwcm9ncmVzc0NvdW50ZXJFbCk7XG4gICAgICAgICAgICAgICAgbGlzdC5hcHBlbmRDaGlsZChwcm9ncmVzc0JhckVsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucmVzdWx0c0Rpdi5hcHBlbmRDaGlsZChsaXN0KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmluZGljYXRlX2NvbXBvbmVudF9yZWFkeSgpO1xuICAgIH1cbiAgICBkaXNhYmxlT3B0aW9ucygpIHt9XG4gICAgYXN5bmMgY2hlY2tQb2xsU3RvcmFnZSgpIHtcbiAgICAgICAgLy9jaGVja3MgdGhlIGxvY2Fsc3RvcmFnZSB0byBzZWUgaWYgdGhlIHBvbGwgaGFzIGJlZW4gY29tcGxldGVkIGFscmVhZHlcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdmFyIGxlbiA9IGxvY2FsU3RvcmFnZS5sZW5ndGg7XG4gICAgICAgIGlmIChsZW4gPiAwKSB7XG4gICAgICAgICAgICAvL0lmIHRoZSBwb2xsIGhhcyBhbHJlYWR5IGJlZW4gY29tcGxldGVkLCBzaG93IHRoZSByZXN1bHRzXG4gICAgICAgICAgICB2YXIgZGF0YSA9IHt9O1xuICAgICAgICAgICAgZGF0YS5kaXZfaWQgPSB0aGlzLmRpdmlkO1xuICAgICAgICAgICAgZGF0YS5jb3Vyc2UgPSBlQm9va0NvbmZpZy5jb3Vyc2U7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMoZGF0YSk7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzcCA9IGF3YWl0IGZldGNoKFxuICAgICAgICAgICAgICAgICAgICBgJHtlQm9va0NvbmZpZy5uZXdfc2VydmVyX3ByZWZpeH0vYXNzZXNzbWVudC9nZXRwb2xscmVzdWx0cz8ke3BhcmFtcy50b1N0cmluZygpfWAsXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBjb25zdCBqc29uID0gYXdhaXQgcmVzcC5qc29uKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5zaG93UG9sbFJlc3VsdHMoanNvbik7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbmRpY2F0ZV9jb21wb25lbnRfcmVhZHkoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuaW5kaWNhdGVfY29tcG9uZW50X3JlYWR5KCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8vIERvIG5vdCByZW5kZXIgcG9sbCBkYXRhIHVudGlsIGxvZ2luLWNvbXBsZXRlIGV2ZW50IHNvIHdlIGtub3cgaW5zdHJ1Y3RvciBzdGF0dXNcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJydW5lc3RvbmU6bG9naW4tY29tcGxldGVcIiwgZnVuY3Rpb24gKCkge1xuICAgIGRvY3VtZW50XG4gICAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKFwiW2RhdGEtY29tcG9uZW50PXBvbGxdXCIpXG4gICAgICAgIC5mb3JFYWNoKGZ1bmN0aW9uIChlbCwgaW5kZXgpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgd2luZG93LmNvbXBvbmVudE1hcFtlbC5pZF0gPSBuZXcgUG9sbCh7IG9yaWc6IGVsIH0pO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYEVycm9yIHJlbmRlcmluZyBQb2xsIFByb2JsZW0gJHtlbC5pZH1cbiAgICAgICAgICAgICAgICAgICAgICAgICBEZXRhaWxzOiAke2Vycn1gKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIuc3RhY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbn0pO1xuXG5pZiAodHlwZW9mIHdpbmRvdy5jb21wb25lbnRfZmFjdG9yeSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHdpbmRvdy5jb21wb25lbnRfZmFjdG9yeSA9IHt9O1xufVxud2luZG93LmNvbXBvbmVudF9mYWN0b3J5LnBvbGwgPSBmdW5jdGlvbiAob3B0cykge1xuICAgIHJldHVybiBuZXcgUG9sbChvcHRzKTtcbn07XG4iLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=