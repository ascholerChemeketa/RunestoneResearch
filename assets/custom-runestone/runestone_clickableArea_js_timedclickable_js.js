"use strict";
(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_clickableArea_js_timedclickable_js"],{

/***/ 44892:
/*!******************************************************!*\
  !*** ./runestone/clickableArea/js/timedclickable.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TimedClickableArea)
/* harmony export */ });
/* harmony import */ var _clickable_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./clickable.js */ 80013);


("use strict");

class TimedClickableArea extends _clickable_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(opts) {
        super(opts);
        if (!this.assessmentTaken) {
            this.restoreAnswers({}); // This takes the place of reinitializeListeners -- but might be better to implement that method for consistency.
        }
        this.renderTimedIcon(this.containerDiv);
        this.hideButtons();
    }

    hideButtons() {
        if (this.submitButton) {
            this.submitButton.style.display = "none";
        }
    }

    renderTimedIcon(component) {
        // renders the clock icon on timed components.    The component parameter
        // is the element that the icon should be appended to.
        var timeIconDiv = document.createElement("div");
        var timeIcon = document.createElement("img");
        timeIcon.src = "../_static/clock.png";
        timeIcon.style.width = "15px";
        timeIcon.style.height = "15px";
        timeIconDiv.className = "timeTip";
        timeIconDiv.title = "";
        timeIconDiv.appendChild(timeIcon);
        component.insertBefore(timeIconDiv, component.firstChild);
    }

    checkCorrectTimed() {
        // Returns if the question was correct, incorrect, or skipped (return null in the last case)
        if (this.correctNum === 0 && this.incorrectNum === 0) {
            this.correct = null;
        }
        switch (this.correct) {
            case true:
                return "T";
            case false:
                return "F";
            default:
                return null;
        }
    }

    hideFeedback() {
        if (this.feedBackDiv) {
            this.feedBackDiv.style.display = "none";
        }
    }
}

if (typeof window.component_factory === "undefined") {
    window.component_factory = {};
}
window.component_factory.clickablearea = function (opts) {
    if (opts.timed) {
        return new TimedClickableArea(opts);
    }
    return new _clickable_js__WEBPACK_IMPORTED_MODULE_0__["default"](opts);
};


/***/ }),

/***/ 80013:
/*!*************************************************!*\
  !*** ./runestone/clickableArea/js/clickable.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ClickableArea)
/* harmony export */ });
/* harmony import */ var _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/runestonebase.js */ 78673);
/* harmony import */ var _css_clickable_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../css/clickable.css */ 99044);
/*==========================================
=======     Master clickable.js     ========
============================================
===   This file contains the JS for the  ===
===  Runestone clickable area component. ===
============================================
===              Created by              ===
===           Isaiah Mayerchak           ===
===                7/1/15                ===
==========================================*/





class ClickableArea extends _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(opts) {
        super(opts);
        var orig = opts.orig; // entire <div> element that will be replaced by new HTML
        this.origElem = orig;
        this.divid = orig.id;
        this.useRunestoneServices = opts.useRunestoneServices;
        this.clickableArray = []; // holds all clickable elements
        this.correctArray = []; // holds the IDs of all correct clickable span elements, used for eval
        this.incorrectArray = []; // holds IDs of all incorrect clickable span elements, used for eval
        //For use with Sphinx-rendered html
        this.isTable = false;
        if (this.origElem.getAttribute("data-cc") !== null) {
            if (this.origElem.hasAttribute("data-table")) {
                this.isTable = true;
                this.ccArray = this.origElem.getAttribute("data-cc").split(";");
                this.ciArray = this.origElem.getAttribute("data-ci").split(";");
            } else {
                this.ccArray = this.origElem.getAttribute("data-cc").split(",");
                this.ciArray = this.origElem.getAttribute("data-ci").split(",");
            }
        }
        // For use in the recursive replace function
        this.clickIndex = 0; // Index of this.clickedIndexArray that we're checking against
        this.clickableCounter = 0; // Index of the current clickable element
        this.getQuestion();
        this.getFeedback();
        this.renderNewElements();
        this.caption = "Clickable";
        this.addCaption("runestone");
        this.checkServer("clickableArea", true);
        if (typeof Prism !== "undefined") {
            Prism.highlightAllUnder(this.containerDiv);
        }
    }
    /*===========================
    == Update basic attributes ==
    ===========================*/
    getQuestion() {
        for (var i = 0; i < this.origElem.childNodes.length; i++) {
            const node = this.origElem.childNodes[i];
            if (
                node.nodeType === Node.ELEMENT_NODE &&
                node.hasAttribute("data-question")
            ) {
                this.question = node;
                this.question.classList.add("exercise-statement");
                break;
            }
        }
    }
    getFeedback() {
        this.feedback = "";
        for (var i = 0; i < this.origElem.childNodes.length; i++) {
            const node = this.origElem.childNodes[i];
            if (
                node.nodeType === Node.ELEMENT_NODE &&
                node.hasAttribute("data-feedback")
            ) {
                this.feedback = node;
            }
        }
        if (this.feedback !== "") {
            this.feedback.remove();
            this.feedback = this.feedback.innerHTML;
        }
    }
    /*===========================================
    ====   Functions generating final HTML   ====
    ===========================================*/
    renderNewElements() {
        // wrapper function for generating everything
        this.containerDiv = document.createElement("div");
        this.containerDiv.id = this.origElem.id;
        this.containerDiv.appendChild(this.question);
        const origClass = this.origElem.getAttribute("class");
        if (origClass) {
            this.containerDiv.classList.add(
                ...origClass.split(" ").filter(Boolean),
            );
        }
        this.newDiv = document.createElement("div");
        var newContent = this.origElem.innerHTML;
        while (newContent[0] === "\n") {
            newContent = newContent.slice(1);
        }
        this.newDiv.innerHTML = newContent;
        this.newDiv.classList.add("exercise-content");
        this.containerDiv.appendChild(this.newDiv);
        this.createInstructions();
        this.createButtons();
        this.createFeedbackDiv();
        this.createLiveRegion();
        this.origElem.replaceWith(this.containerDiv);
    }
    createInstructions() {
        // The set of clickables is a group of checkboxes; name it with the
        // question and describe how to work it from the keyboard.
        if (this.question && !this.question.id) {
            this.question.id = `${this.divid}_question`;
        }
        this.instructions = document.createElement("div");
        this.instructions.id = `${this.divid}_instructions`;
        this.instructions.className = "visuallyhidden";
        this.instructions.textContent =
            "Select all that apply. Press Tab to enter or leave the choices. Use the arrow keys to move between choices, Home or End to move to the first or last choice, and press Enter or the space bar to select or unselect a choice.";
        this.containerDiv.appendChild(this.instructions);
        this.newDiv.setAttribute("role", "group");
        if (this.question && this.question.id) {
            this.newDiv.setAttribute("aria-labelledby", this.question.id);
        }
        this.newDiv.setAttribute("aria-describedby", this.instructions.id);
    }
    createButtons() {
        this.submitButton = document.createElement("button"); // Check me button
        this.submitButton.textContent = "Check Me";
        this.submitButton.className = "btn btn-success";
        this.submitButton.name = "do answer";
        this.submitButton.type = "button";
        this.submitButton.onclick = function () {
            this.checkCurrentAnswer();
            this.logCurrentAnswer();
            this.renderFeedback();
        }.bind(this);
        this.containerDiv.appendChild(this.submitButton);
    }
    createFeedbackDiv() {
        this.feedBackDiv = document.createElement("div");
        // Announce the grading result when it is filled in.
        this.feedBackDiv.setAttribute("aria-live", "polite");
        this.containerDiv.appendChild(document.createElement("br"));
        this.containerDiv.appendChild(this.feedBackDiv);
    }
    createLiveRegion() {
        // Off screen region used to announce the running selection count.
        this.liveRegion = document.createElement("div");
        this.liveRegion.className = "visuallyhidden";
        this.liveRegion.setAttribute("aria-live", "polite");
        this.liveRegion.setAttribute("aria-atomic", "true");
        this.containerDiv.appendChild(this.liveRegion);
    }
    announce(message) {
        if (this.liveRegion) {
            this.liveRegion.textContent = message;
        }
    }
    /*===================================
    === Checking/restoring from storage ===
    ===================================*/
    restoreAnswers(data) {
        // Restore answers from storage retrieval done in RunestoneBase or from local storage
        if (data.answer !== undefined) {
            // if we got data from the server
            this.hasStoredAnswers = true;
            this.clickedIndexArray = data.answer.split(";");
        }
        if (this.ccArray === undefined) {
            this.modifyClickables(this.newDiv.childNodes);
        } else {
            // For use with Sphinx-rendered HTML
            this.ccCounter = 0;
            this.ccIndex = 0;
            this.ciIndex = 0;
            if (!this.isTable) {
                this.modifyViaCC(this.newDiv.children);
            } else {
                this.modifyTableViaCC(this.newDiv.children);
            }
        }
    }
    checkLocalStorage() {
        if (this.graderactive) {
            return;
        }
        var storageObj;
        // Gets previous answer data from local storage if it exists
        this.hasStoredAnswers = false;
        var len = localStorage.length;
        if (len > 0) {
            var ex = localStorage.getItem(this.localStorageKey());
            if (ex !== null) {
                this.hasStoredAnswers = true;
                let error = false;
                try {
                    storageObj = JSON.parse(ex);
                } catch (err) {
                    // error while parsing; likely due to bad value stored in storage
                    console.log(
                        `Error parsing stored ClickableArea data for ${this.divid}: ${err.message}`,
                    );
                    error = true;
                }
                if (error || storageObj.timestamp < eBookConfig.termStartDate) {
                    localStorage.removeItem(this.localStorageKey());
                    this.hasStoredAnswers = false;
                    this.restoreAnswers({});
                    return;
                }
                this.clickedIndexArray = storageObj.answer.split(";");
                if (this.useRunestoneServices) {
                    // log answer to server
                    this.givenIndexArray = [];
                    for (var i = 0; i < this.clickableArray.length; i++) {
                        if (
                            this.clickableArray[i].classList.contains(
                                "clickable-clicked",
                            )
                        ) {
                            this.givenIndexArray.push(i);
                        }
                    }
                    this.logBookEvent({
                        event: "clickableArea",
                        act: this.clickedIndexArray.join(";"),
                        answer: this.clickedIndexArray.join(";"),
                        div_id: this.divid,
                        correct: storageObj.correct,
                    });
                }
            }
        }
        this.restoreAnswers({}); // pass empty object
    }
    setLocalStorage(data) {
        // Array of the indices of clicked elements is passed to local storage
        var answer;
        if (data.answer !== undefined) {
            // If we got data from the server, we can just use that
            answer = this.clickedIndexArray.join(";");
        } else {
            this.givenIndexArray = [];
            for (var i = 0; i < this.clickableArray.length; i++) {
                if (
                    this.clickableArray[i].classList.contains(
                        "clickable-clicked",
                    )
                ) {
                    this.givenIndexArray.push(i);
                }
            }
            answer = this.givenIndexArray.join(";");
        }
        var timeStamp = new Date();
        var correct = data.correct;
        var storageObject = {
            answer: answer,
            correct: correct,
            timestamp: timeStamp,
        };
        localStorage.setItem(
            this.localStorageKey(),
            JSON.stringify(storageObject),
        );
    }
    /*==========================
    === Auxilliary functions ===
    ==========================*/
    modifyClickables(childNodes) {
        // Strips the data-correct/data-incorrect labels and updates the correct/incorrect arrays
        for (var i = 0; i < childNodes.length; i++) {
            const node = childNodes[i];
            if (
                node.nodeType === Node.ELEMENT_NODE &&
                (node.hasAttribute("data-correct") ||
                    node.hasAttribute("data-incorrect"))
            ) {
                this.manageNewClickable(node);
                if (node.hasAttribute("data-correct")) {
                    node.removeAttribute("data-correct");
                    this.correctArray.push(node);
                } else {
                    node.removeAttribute("data-incorrect");
                    this.incorrectArray.push(node);
                }
            }
            if (node.childNodes && node.childNodes.length !== 0) {
                this.modifyClickables(node.childNodes);
            }
        }
    }
    modifyViaCC(children) {
        for (var i = 0; i < children.length; i++) {
            if (children[i].children.length !== 0) {
                this.modifyViaCC(children[i].children);
            } else {
                this.ccCounter++;
                if (this.ccCounter === Math.floor(this.ccArray[this.ccIndex])) {
                    this.manageNewClickable(children[i]);
                    this.correctArray.push(children[i]);
                    this.ccIndex++;
                } else if (
                    this.ccCounter === Math.floor(this.ciArray[this.ciIndex])
                ) {
                    this.manageNewClickable(children[i]);
                    this.incorrectArray.push(children[i]);
                    this.ciIndex++;
                }
            }
        }
    }
    modifyTableViaCC(children) {
        // table version of modifyViaCC
        var tComponentArr = [];
        for (let i = 0; i < children.length; i++) {
            if (children[i].nodeName === "TABLE") {
                let tmp = children[i];
                for (let j = 0; j < tmp.children.length; j++) {
                    if (tmp.children[j].nodeName === "THEAD") {
                        tComponentArr.push(tmp.children[j]);
                    } else if (tmp.children[j].nodeName === "TBODY") {
                        tComponentArr.push(tmp.children[j]);
                    } else if (tmp.children[j].nodeName === "TFOOT") {
                        tComponentArr.push(tmp.children[j]);
                    }
                }
            }
        }
        for (var t = 0; t < tComponentArr.length; t++) {
            for (let i = 0; i < tComponentArr[t].children.length; i++) {
                this.ccCounter++;
                // First check if the entire row needs to be clickable
                if (
                    this.ccIndex < this.ccArray.length &&
                    this.ccCounter ===
                        Math.floor(this.ccArray[this.ccIndex].split(",")[0]) &&
                    Math.floor(this.ccArray[this.ccIndex].split(",")[1]) === 0
                ) {
                    this.manageNewClickable(tComponentArr[t].children[i]);
                    this.correctArray.push(tComponentArr[t].children[i]);
                    this.ccIndex++;
                } else if (
                    this.ciIndex < this.ciArray.length &&
                    this.ccCounter ===
                        Math.floor(this.ciArray[this.ciIndex].split(",")[0]) &&
                    Math.floor(this.ciArray[this.ciIndex].split(",")[1]) === 0
                ) {
                    this.manageNewClickable(tComponentArr[t].children[i]);
                    this.incorrectArray.push(tComponentArr[t].children[i]);
                    this.ciIndex++;
                } else {
                    // If not, check the individual data cells
                    for (
                        let j = 0;
                        j < tComponentArr[t].children[i].children.length;
                        j++
                    ) {
                        let tmp = j + 1;
                        if (
                            this.ccIndex < this.ccArray.length &&
                            tmp ===
                                Math.floor(
                                    this.ccArray[this.ccIndex].split(",")[1],
                                ) &&
                            this.ccCounter ===
                                Math.floor(
                                    this.ccArray[this.ccIndex].split(",")[0],
                                )
                        ) {
                            this.manageNewClickable(
                                tComponentArr[t].children[i].children[j],
                            );
                            this.correctArray.push(
                                tComponentArr[t].children[i].children[j],
                            );
                            this.ccIndex++;
                        } else if (
                            this.ciIndex < this.ciArray.length &&
                            tmp ===
                                Math.floor(
                                    this.ciArray[this.ciIndex].split(",")[1],
                                ) &&
                            this.ccCounter ===
                                Math.floor(
                                    this.ciArray[this.ciIndex].split(",")[0],
                                )
                        ) {
                            this.manageNewClickable(
                                tComponentArr[t].children[i].children[j],
                            );
                            this.incorrectArray.push(
                                tComponentArr[t].children[i].children[j],
                            );
                            this.ciIndex++;
                        }
                    }
                }
            }
        }
    }
    manageNewClickable(clickable) {
        // adds the "clickable" functionality
        clickable.classList.add("clickable");
        if (this.hasStoredAnswers) {
            // Check if the element we're about to append to the pre was in local storage as clicked via its index
            if (
                this.clickedIndexArray[this.clickIndex].toString() ===
                this.clickableCounter.toString()
            ) {
                clickable.classList.add("clickable-clicked");
                this.clickIndex++;
                if (this.clickIndex === this.clickedIndexArray.length) {
                    // Stop doing this if the index array is used up
                    this.hasStoredAnswers = false;
                }
            }
        }
        // Expose each clickable as a checkbox so that a screen reader announces
        // its selected state. Only one checkbox is in the page tab order; arrow
        // keys move that tab stop through the group.
        clickable.setAttribute("role", "checkbox");
        clickable.setAttribute(
            "tabindex",
            this.clickableArray.length === 0 ? "0" : "-1",
        );
        clickable.setAttribute(
            "aria-checked",
            clickable.classList.contains("clickable-clicked")
                ? "true"
                : "false",
        );
        clickable.onclick = () => {
            this.focusClickable(clickable);
            this.toggleClickable(clickable);
        };
        clickable.addEventListener("focus", () => {
            this.setActiveClickable(clickable);
        });
        clickable.addEventListener("keydown", (ev) => {
            if (ev.key === "Enter" || ev.key === " " || ev.key === "Spacebar") {
                ev.preventDefault(); // keep the space bar from scrolling the page
                this.toggleClickable(clickable);
            } else if (ev.key === "ArrowRight" || ev.key === "ArrowDown") {
                ev.preventDefault();
                this.moveClickableFocus(clickable, 1);
            } else if (ev.key === "ArrowLeft" || ev.key === "ArrowUp") {
                ev.preventDefault();
                this.moveClickableFocus(clickable, -1);
            } else if (ev.key === "Home") {
                ev.preventDefault();
                this.focusClickable(this.clickableArray[0]);
            } else if (ev.key === "End") {
                ev.preventDefault();
                this.focusClickable(
                    this.clickableArray[this.clickableArray.length - 1],
                );
            }
        });
        this.clickableArray.push(clickable);
        this.clickableCounter++;
    }
    setActiveClickable(clickable) {
        if (
            this.interactionDisabled ||
            !this.clickableArray.includes(clickable)
        ) {
            return;
        }
        for (const choice of this.clickableArray) {
            choice.setAttribute("tabindex", choice === clickable ? "0" : "-1");
        }
    }
    focusClickable(clickable) {
        if (this.interactionDisabled || !clickable) {
            return;
        }
        this.setActiveClickable(clickable);
        clickable.focus();
    }
    moveClickableFocus(clickable, offset) {
        const currentIndex = this.clickableArray.indexOf(clickable);
        if (currentIndex === -1) {
            return;
        }
        const nextIndex = Math.min(
            this.clickableArray.length - 1,
            Math.max(0, currentIndex + offset),
        );
        this.focusClickable(this.clickableArray[nextIndex]);
    }
    toggleClickable(clickable) {
        if (this.interactionDisabled) {
            return;
        }
        this.isAnswered = true;
        const nowSelected = !clickable.classList.contains("clickable-clicked");
        clickable.classList.toggle("clickable-clicked", nowSelected);
        clickable.setAttribute("aria-checked", nowSelected ? "true" : "false");
        if (!nowSelected) {
            // Clear any grading marks left over from a previous Check Me
            clickable.classList.remove("clickable-incorrect");
            clickable.removeAttribute("aria-invalid");
        }
        this.announceSelectionCount();
    }
    announceSelectionCount() {
        const selected = this.clickableArray.filter((el) =>
            el.classList.contains("clickable-clicked"),
        ).length;
        this.announce(
            `${selected} of ${this.clickableArray.length} choices selected.`,
        );
    }
    /*======================================
    == Evaluation and displaying feedback ==
    ======================================*/
    checkCurrentAnswer() {
        // Evaluation is done by iterating over the correct/incorrect arrays and checking by class
        this.correct = true;
        this.correctNum = 0;
        this.incorrectNum = 0;
        for (let i = 0; i < this.correctArray.length; i++) {
            if (!this.correctArray[i].classList.contains("clickable-clicked")) {
                this.correct = false;
            } else {
                this.correctNum++;
            }
        }
        for (let i = 0; i < this.incorrectArray.length; i++) {
            if (
                this.incorrectArray[i].classList.contains("clickable-clicked")
            ) {
                this.correct = false;
                this.incorrectNum++;
            } else {
                this.incorrectArray[i].classList.remove("clickable-incorrect");
                this.incorrectArray[i].removeAttribute("aria-invalid");
            }
        }
        this.percent =
            (this.correctNum - this.incorrectNum) / this.correctArray.length;
        this.percent = Math.max(0, this.percent);
        this.setLocalStorage({ correct: this.correct ? "T" : "F" });
    }

    async logCurrentAnswer(sid) {
        const answer = this.givenIndexArray.join(";");
        let data = {
            event: "clickableArea",
            answer: answer,
            act: answer,
            div_id: this.divid,
            correct: this.correct ? "T" : "F",
        };
        if (typeof sid !== "undefined") {
            data.sid = sid;
        }
        await this.logBookEvent(data);
    }

    renderFeedback() {
        if (this.correct) {
            this.feedBackDiv.innerHTML = "You are Correct!";
            this.feedBackDiv.className = "alert alert-info";
        } else {
            for (let i = 0; i < this.incorrectArray.length; i++) {
                if (
                    this.incorrectArray[i].classList.contains(
                        "clickable-clicked",
                    )
                ) {
                    this.incorrectArray[i].classList.add("clickable-incorrect");
                    // so a screen reader flags the choice when the reader
                    // moves back over it
                    this.incorrectArray[i].setAttribute("aria-invalid", "true");
                } else {
                    this.incorrectArray[i].classList.remove(
                        "clickable-incorrect",
                    );
                    this.incorrectArray[i].removeAttribute("aria-invalid");
                }
            }
            this.feedBackDiv.innerHTML =
                "Incorrect. You clicked on " +
                this.correctNum +
                " of the " +
                this.correctArray.length.toString() +
                " correct elements and " +
                this.incorrectNum +
                " of the " +
                this.incorrectArray.length.toString() +
                " incorrect elements. " +
                this.feedback;
            this.feedBackDiv.className = "alert alert-danger";
        }
    }

    disableInteraction() {
        // The keydown handlers stay attached; they check this flag instead.
        this.interactionDisabled = true;
        for (var i = 0; i < this.clickableArray.length; i++) {
            this.clickableArray[i].style.cursor = "initial";
            this.clickableArray[i].onclick = function () {
                return;
            };
            this.clickableArray[i].setAttribute("aria-disabled", "true");
            this.clickableArray[i].setAttribute("tabindex", "-1");
        }
    }
}

/*=================================
== Find the custom HTML tags and ==
==   execute our code on them    ==
=================================*/
document.addEventListener("runestone:login-complete", function () {
    document
        .querySelectorAll("[data-component=clickablearea]")
        .forEach(function (el, index) {
            if (!el.closest("[data-component=timedAssessment]")) {
                // If this element exists within a timed component, don't render it here
                try {
                    window.componentMap[el.id] = new ClickableArea({
                        orig: el,
                        useRunestoneServices: eBookConfig.useRunestoneServices,
                    });
                } catch (err) {
                    console.log(`Error rendering ClickableArea Problem ${el.id}
                             Details: ${err}`);
                }
            }
        });
});


/***/ }),

/***/ 99044:
/*!***************************************************!*\
  !*** ./runestone/clickableArea/css/clickable.css ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuZXN0b25lX2NsaWNrYWJsZUFyZWFfanNfdGltZWRjbGlja2FibGVfanMuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBMkM7O0FBRTNDOztBQUVlLGlDQUFpQyxxREFBYTtBQUM3RDtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0MsR0FBRztBQUNyQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxxREFBYTtBQUM1Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDYTs7QUFFZ0Q7QUFDL0I7O0FBRWYsNEJBQTRCLG1FQUFhO0FBQ3hEO0FBQ0E7QUFDQSw4QkFBOEI7QUFDOUI7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDO0FBQ2xDLGdDQUFnQztBQUNoQyxrQ0FBa0M7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZFQUE2RTtBQUM3RSw2RUFBNkU7QUFDN0UsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkI7QUFDN0IsbUNBQW1DO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IscUNBQXFDO0FBQzdEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHFDQUFxQztBQUM3RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyREFBMkQ7QUFDM0Q7QUFDQTtBQUNBLGtDQUFrQyxXQUFXO0FBQzdDO0FBQ0E7QUFDQSxrQ0FBa0MsV0FBVztBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOERBQThEO0FBQzlEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseURBQXlEO0FBQ3pEO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEIsNENBQTRDO0FBQzVDO0FBQ0EsdUVBQXVFLFdBQVcsSUFBSSxZQUFZO0FBQ2xHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBDQUEwQztBQUMxQztBQUNBO0FBQ0EsbUVBQW1FO0FBQ25FO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyxnQ0FBZ0M7QUFDcEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyREFBMkQ7QUFDM0QsOERBQThEO0FBQzlEO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0EsOEJBQThCLEdBQUc7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbURBQW1EO0FBQ25ELFVBQVU7QUFDVjtBQUNBLDRCQUE0QixnQ0FBZ0M7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUFpRDtBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsdUJBQXVCO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHFCQUFxQjtBQUM3QztBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHFCQUFxQjtBQUM3QztBQUNBO0FBQ0EsZ0NBQWdDLHlCQUF5QjtBQUN6RDtBQUNBO0FBQ0Esc0JBQXNCO0FBQ3RCO0FBQ0Esc0JBQXNCO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsMEJBQTBCO0FBQ2xELDRCQUE0QixzQ0FBc0M7QUFDbEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyRUFBMkU7QUFDM0U7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxxQ0FBcUM7QUFDckM7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsVUFBVSxLQUFLLDRCQUE0QjtBQUMxRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qiw4QkFBOEI7QUFDdEQ7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsZ0NBQWdDO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0IsbUNBQW1DO0FBQ2xFOztBQUVBO0FBQ0EsbURBQW1EO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDViw0QkFBNEIsZ0NBQWdDO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsK0NBQStDO0FBQy9DO0FBQ0Esd0JBQXdCLGdDQUFnQztBQUN4RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQixrQkFBa0I7QUFDbEIseUVBQXlFO0FBQ3pFLHdDQUF3QyxJQUFJO0FBQzVDO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsQ0FBQzs7Ozs7Ozs7Ozs7O0FDNW5CRCIsInNvdXJjZXMiOlsid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvY2xpY2thYmxlQXJlYS9qcy90aW1lZGNsaWNrYWJsZS5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2NsaWNrYWJsZUFyZWEvanMvY2xpY2thYmxlLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvY2xpY2thYmxlQXJlYS9jc3MvY2xpY2thYmxlLmNzcz82MWE3Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDbGlja2FibGVBcmVhIGZyb20gXCIuL2NsaWNrYWJsZS5qc1wiO1xuXG4oXCJ1c2Ugc3RyaWN0XCIpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaW1lZENsaWNrYWJsZUFyZWEgZXh0ZW5kcyBDbGlja2FibGVBcmVhIHtcbiAgICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgICAgIHN1cGVyKG9wdHMpO1xuICAgICAgICBpZiAoIXRoaXMuYXNzZXNzbWVudFRha2VuKSB7XG4gICAgICAgICAgICB0aGlzLnJlc3RvcmVBbnN3ZXJzKHt9KTsgLy8gVGhpcyB0YWtlcyB0aGUgcGxhY2Ugb2YgcmVpbml0aWFsaXplTGlzdGVuZXJzIC0tIGJ1dCBtaWdodCBiZSBiZXR0ZXIgdG8gaW1wbGVtZW50IHRoYXQgbWV0aG9kIGZvciBjb25zaXN0ZW5jeS5cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlbmRlclRpbWVkSWNvbih0aGlzLmNvbnRhaW5lckRpdik7XG4gICAgICAgIHRoaXMuaGlkZUJ1dHRvbnMoKTtcbiAgICB9XG5cbiAgICBoaWRlQnV0dG9ucygpIHtcbiAgICAgICAgaWYgKHRoaXMuc3VibWl0QnV0dG9uKSB7XG4gICAgICAgICAgICB0aGlzLnN1Ym1pdEJ1dHRvbi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZW5kZXJUaW1lZEljb24oY29tcG9uZW50KSB7XG4gICAgICAgIC8vIHJlbmRlcnMgdGhlIGNsb2NrIGljb24gb24gdGltZWQgY29tcG9uZW50cy4gICAgVGhlIGNvbXBvbmVudCBwYXJhbWV0ZXJcbiAgICAgICAgLy8gaXMgdGhlIGVsZW1lbnQgdGhhdCB0aGUgaWNvbiBzaG91bGQgYmUgYXBwZW5kZWQgdG8uXG4gICAgICAgIHZhciB0aW1lSWNvbkRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHZhciB0aW1lSWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XG4gICAgICAgIHRpbWVJY29uLnNyYyA9IFwiLi4vX3N0YXRpYy9jbG9jay5wbmdcIjtcbiAgICAgICAgdGltZUljb24uc3R5bGUud2lkdGggPSBcIjE1cHhcIjtcbiAgICAgICAgdGltZUljb24uc3R5bGUuaGVpZ2h0ID0gXCIxNXB4XCI7XG4gICAgICAgIHRpbWVJY29uRGl2LmNsYXNzTmFtZSA9IFwidGltZVRpcFwiO1xuICAgICAgICB0aW1lSWNvbkRpdi50aXRsZSA9IFwiXCI7XG4gICAgICAgIHRpbWVJY29uRGl2LmFwcGVuZENoaWxkKHRpbWVJY29uKTtcbiAgICAgICAgY29tcG9uZW50Lmluc2VydEJlZm9yZSh0aW1lSWNvbkRpdiwgY29tcG9uZW50LmZpcnN0Q2hpbGQpO1xuICAgIH1cblxuICAgIGNoZWNrQ29ycmVjdFRpbWVkKCkge1xuICAgICAgICAvLyBSZXR1cm5zIGlmIHRoZSBxdWVzdGlvbiB3YXMgY29ycmVjdCwgaW5jb3JyZWN0LCBvciBza2lwcGVkIChyZXR1cm4gbnVsbCBpbiB0aGUgbGFzdCBjYXNlKVxuICAgICAgICBpZiAodGhpcy5jb3JyZWN0TnVtID09PSAwICYmIHRoaXMuaW5jb3JyZWN0TnVtID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLmNvcnJlY3QgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHN3aXRjaCAodGhpcy5jb3JyZWN0KSB7XG4gICAgICAgICAgICBjYXNlIHRydWU6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiVFwiO1xuICAgICAgICAgICAgY2FzZSBmYWxzZTpcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJGXCI7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaGlkZUZlZWRiYWNrKCkge1xuICAgICAgICBpZiAodGhpcy5mZWVkQmFja0Rpdikge1xuICAgICAgICAgICAgdGhpcy5mZWVkQmFja0Rpdi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmlmICh0eXBlb2Ygd2luZG93LmNvbXBvbmVudF9mYWN0b3J5ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgd2luZG93LmNvbXBvbmVudF9mYWN0b3J5ID0ge307XG59XG53aW5kb3cuY29tcG9uZW50X2ZhY3RvcnkuY2xpY2thYmxlYXJlYSA9IGZ1bmN0aW9uIChvcHRzKSB7XG4gICAgaWYgKG9wdHMudGltZWQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBUaW1lZENsaWNrYWJsZUFyZWEob3B0cyk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgQ2xpY2thYmxlQXJlYShvcHRzKTtcbn07XG4iLCIvKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT09PT09PSAgICAgTWFzdGVyIGNsaWNrYWJsZS5qcyAgICAgPT09PT09PT1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PT0gICBUaGlzIGZpbGUgY29udGFpbnMgdGhlIEpTIGZvciB0aGUgID09PVxuPT09ICBSdW5lc3RvbmUgY2xpY2thYmxlIGFyZWEgY29tcG9uZW50LiA9PT1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PT0gICAgICAgICAgICAgIENyZWF0ZWQgYnkgICAgICAgICAgICAgID09PVxuPT09ICAgICAgICAgICBJc2FpYWggTWF5ZXJjaGFrICAgICAgICAgICA9PT1cbj09PSAgICAgICAgICAgICAgICA3LzEvMTUgICAgICAgICAgICAgICAgPT09XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCBSdW5lc3RvbmVCYXNlIGZyb20gXCIuLi8uLi9jb21tb24vanMvcnVuZXN0b25lYmFzZS5qc1wiO1xuaW1wb3J0IFwiLi4vY3NzL2NsaWNrYWJsZS5jc3NcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2xpY2thYmxlQXJlYSBleHRlbmRzIFJ1bmVzdG9uZUJhc2Uge1xuICAgIGNvbnN0cnVjdG9yKG9wdHMpIHtcbiAgICAgICAgc3VwZXIob3B0cyk7XG4gICAgICAgIHZhciBvcmlnID0gb3B0cy5vcmlnOyAvLyBlbnRpcmUgPGRpdj4gZWxlbWVudCB0aGF0IHdpbGwgYmUgcmVwbGFjZWQgYnkgbmV3IEhUTUxcbiAgICAgICAgdGhpcy5vcmlnRWxlbSA9IG9yaWc7XG4gICAgICAgIHRoaXMuZGl2aWQgPSBvcmlnLmlkO1xuICAgICAgICB0aGlzLnVzZVJ1bmVzdG9uZVNlcnZpY2VzID0gb3B0cy51c2VSdW5lc3RvbmVTZXJ2aWNlcztcbiAgICAgICAgdGhpcy5jbGlja2FibGVBcnJheSA9IFtdOyAvLyBob2xkcyBhbGwgY2xpY2thYmxlIGVsZW1lbnRzXG4gICAgICAgIHRoaXMuY29ycmVjdEFycmF5ID0gW107IC8vIGhvbGRzIHRoZSBJRHMgb2YgYWxsIGNvcnJlY3QgY2xpY2thYmxlIHNwYW4gZWxlbWVudHMsIHVzZWQgZm9yIGV2YWxcbiAgICAgICAgdGhpcy5pbmNvcnJlY3RBcnJheSA9IFtdOyAvLyBob2xkcyBJRHMgb2YgYWxsIGluY29ycmVjdCBjbGlja2FibGUgc3BhbiBlbGVtZW50cywgdXNlZCBmb3IgZXZhbFxuICAgICAgICAvL0ZvciB1c2Ugd2l0aCBTcGhpbngtcmVuZGVyZWQgaHRtbFxuICAgICAgICB0aGlzLmlzVGFibGUgPSBmYWxzZTtcbiAgICAgICAgaWYgKHRoaXMub3JpZ0VsZW0uZ2V0QXR0cmlidXRlKFwiZGF0YS1jY1wiKSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKHRoaXMub3JpZ0VsZW0uaGFzQXR0cmlidXRlKFwiZGF0YS10YWJsZVwiKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuaXNUYWJsZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5jY0FycmF5ID0gdGhpcy5vcmlnRWxlbS5nZXRBdHRyaWJ1dGUoXCJkYXRhLWNjXCIpLnNwbGl0KFwiO1wiKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNpQXJyYXkgPSB0aGlzLm9yaWdFbGVtLmdldEF0dHJpYnV0ZShcImRhdGEtY2lcIikuc3BsaXQoXCI7XCIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNjQXJyYXkgPSB0aGlzLm9yaWdFbGVtLmdldEF0dHJpYnV0ZShcImRhdGEtY2NcIikuc3BsaXQoXCIsXCIpO1xuICAgICAgICAgICAgICAgIHRoaXMuY2lBcnJheSA9IHRoaXMub3JpZ0VsZW0uZ2V0QXR0cmlidXRlKFwiZGF0YS1jaVwiKS5zcGxpdChcIixcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gRm9yIHVzZSBpbiB0aGUgcmVjdXJzaXZlIHJlcGxhY2UgZnVuY3Rpb25cbiAgICAgICAgdGhpcy5jbGlja0luZGV4ID0gMDsgLy8gSW5kZXggb2YgdGhpcy5jbGlja2VkSW5kZXhBcnJheSB0aGF0IHdlJ3JlIGNoZWNraW5nIGFnYWluc3RcbiAgICAgICAgdGhpcy5jbGlja2FibGVDb3VudGVyID0gMDsgLy8gSW5kZXggb2YgdGhlIGN1cnJlbnQgY2xpY2thYmxlIGVsZW1lbnRcbiAgICAgICAgdGhpcy5nZXRRdWVzdGlvbigpO1xuICAgICAgICB0aGlzLmdldEZlZWRiYWNrKCk7XG4gICAgICAgIHRoaXMucmVuZGVyTmV3RWxlbWVudHMoKTtcbiAgICAgICAgdGhpcy5jYXB0aW9uID0gXCJDbGlja2FibGVcIjtcbiAgICAgICAgdGhpcy5hZGRDYXB0aW9uKFwicnVuZXN0b25lXCIpO1xuICAgICAgICB0aGlzLmNoZWNrU2VydmVyKFwiY2xpY2thYmxlQXJlYVwiLCB0cnVlKTtcbiAgICAgICAgaWYgKHR5cGVvZiBQcmlzbSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgUHJpc20uaGlnaGxpZ2h0QWxsVW5kZXIodGhpcy5jb250YWluZXJEaXYpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qPT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT0gVXBkYXRlIGJhc2ljIGF0dHJpYnV0ZXMgPT1cbiAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuICAgIGdldFF1ZXN0aW9uKCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMub3JpZ0VsZW0uY2hpbGROb2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3Qgbm9kZSA9IHRoaXMub3JpZ0VsZW0uY2hpbGROb2Rlc1tpXTtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBub2RlLm5vZGVUeXBlID09PSBOb2RlLkVMRU1FTlRfTk9ERSAmJlxuICAgICAgICAgICAgICAgIG5vZGUuaGFzQXR0cmlidXRlKFwiZGF0YS1xdWVzdGlvblwiKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5xdWVzdGlvbiA9IG5vZGU7XG4gICAgICAgICAgICAgICAgdGhpcy5xdWVzdGlvbi5jbGFzc0xpc3QuYWRkKFwiZXhlcmNpc2Utc3RhdGVtZW50XCIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGdldEZlZWRiYWNrKCkge1xuICAgICAgICB0aGlzLmZlZWRiYWNrID0gXCJcIjtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm9yaWdFbGVtLmNoaWxkTm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLm9yaWdFbGVtLmNoaWxkTm9kZXNbaV07XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgbm9kZS5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREUgJiZcbiAgICAgICAgICAgICAgICBub2RlLmhhc0F0dHJpYnV0ZShcImRhdGEtZmVlZGJhY2tcIilcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHRoaXMuZmVlZGJhY2sgPSBub2RlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmZlZWRiYWNrICE9PSBcIlwiKSB7XG4gICAgICAgICAgICB0aGlzLmZlZWRiYWNrLnJlbW92ZSgpO1xuICAgICAgICAgICAgdGhpcy5mZWVkYmFjayA9IHRoaXMuZmVlZGJhY2suaW5uZXJIVE1MO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09PT0gICBGdW5jdGlvbnMgZ2VuZXJhdGluZyBmaW5hbCBIVE1MICAgPT09PVxuICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuICAgIHJlbmRlck5ld0VsZW1lbnRzKCkge1xuICAgICAgICAvLyB3cmFwcGVyIGZ1bmN0aW9uIGZvciBnZW5lcmF0aW5nIGV2ZXJ5dGhpbmdcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5pZCA9IHRoaXMub3JpZ0VsZW0uaWQ7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmFwcGVuZENoaWxkKHRoaXMucXVlc3Rpb24pO1xuICAgICAgICBjb25zdCBvcmlnQ2xhc3MgPSB0aGlzLm9yaWdFbGVtLmdldEF0dHJpYnV0ZShcImNsYXNzXCIpO1xuICAgICAgICBpZiAob3JpZ0NsYXNzKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5jbGFzc0xpc3QuYWRkKFxuICAgICAgICAgICAgICAgIC4uLm9yaWdDbGFzcy5zcGxpdChcIiBcIikuZmlsdGVyKEJvb2xlYW4pLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm5ld0RpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHZhciBuZXdDb250ZW50ID0gdGhpcy5vcmlnRWxlbS5pbm5lckhUTUw7XG4gICAgICAgIHdoaWxlIChuZXdDb250ZW50WzBdID09PSBcIlxcblwiKSB7XG4gICAgICAgICAgICBuZXdDb250ZW50ID0gbmV3Q29udGVudC5zbGljZSgxKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm5ld0Rpdi5pbm5lckhUTUwgPSBuZXdDb250ZW50O1xuICAgICAgICB0aGlzLm5ld0Rpdi5jbGFzc0xpc3QuYWRkKFwiZXhlcmNpc2UtY29udGVudFwiKTtcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYuYXBwZW5kQ2hpbGQodGhpcy5uZXdEaXYpO1xuICAgICAgICB0aGlzLmNyZWF0ZUluc3RydWN0aW9ucygpO1xuICAgICAgICB0aGlzLmNyZWF0ZUJ1dHRvbnMoKTtcbiAgICAgICAgdGhpcy5jcmVhdGVGZWVkYmFja0RpdigpO1xuICAgICAgICB0aGlzLmNyZWF0ZUxpdmVSZWdpb24oKTtcbiAgICAgICAgdGhpcy5vcmlnRWxlbS5yZXBsYWNlV2l0aCh0aGlzLmNvbnRhaW5lckRpdik7XG4gICAgfVxuICAgIGNyZWF0ZUluc3RydWN0aW9ucygpIHtcbiAgICAgICAgLy8gVGhlIHNldCBvZiBjbGlja2FibGVzIGlzIGEgZ3JvdXAgb2YgY2hlY2tib3hlczsgbmFtZSBpdCB3aXRoIHRoZVxuICAgICAgICAvLyBxdWVzdGlvbiBhbmQgZGVzY3JpYmUgaG93IHRvIHdvcmsgaXQgZnJvbSB0aGUga2V5Ym9hcmQuXG4gICAgICAgIGlmICh0aGlzLnF1ZXN0aW9uICYmICF0aGlzLnF1ZXN0aW9uLmlkKSB7XG4gICAgICAgICAgICB0aGlzLnF1ZXN0aW9uLmlkID0gYCR7dGhpcy5kaXZpZH1fcXVlc3Rpb25gO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaW5zdHJ1Y3Rpb25zID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdGhpcy5pbnN0cnVjdGlvbnMuaWQgPSBgJHt0aGlzLmRpdmlkfV9pbnN0cnVjdGlvbnNgO1xuICAgICAgICB0aGlzLmluc3RydWN0aW9ucy5jbGFzc05hbWUgPSBcInZpc3VhbGx5aGlkZGVuXCI7XG4gICAgICAgIHRoaXMuaW5zdHJ1Y3Rpb25zLnRleHRDb250ZW50ID1cbiAgICAgICAgICAgIFwiU2VsZWN0IGFsbCB0aGF0IGFwcGx5LiBQcmVzcyBUYWIgdG8gZW50ZXIgb3IgbGVhdmUgdGhlIGNob2ljZXMuIFVzZSB0aGUgYXJyb3cga2V5cyB0byBtb3ZlIGJldHdlZW4gY2hvaWNlcywgSG9tZSBvciBFbmQgdG8gbW92ZSB0byB0aGUgZmlyc3Qgb3IgbGFzdCBjaG9pY2UsIGFuZCBwcmVzcyBFbnRlciBvciB0aGUgc3BhY2UgYmFyIHRvIHNlbGVjdCBvciB1bnNlbGVjdCBhIGNob2ljZS5cIjtcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYuYXBwZW5kQ2hpbGQodGhpcy5pbnN0cnVjdGlvbnMpO1xuICAgICAgICB0aGlzLm5ld0Rpdi5zZXRBdHRyaWJ1dGUoXCJyb2xlXCIsIFwiZ3JvdXBcIik7XG4gICAgICAgIGlmICh0aGlzLnF1ZXN0aW9uICYmIHRoaXMucXVlc3Rpb24uaWQpIHtcbiAgICAgICAgICAgIHRoaXMubmV3RGl2LnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxsZWRieVwiLCB0aGlzLnF1ZXN0aW9uLmlkKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm5ld0Rpdi5zZXRBdHRyaWJ1dGUoXCJhcmlhLWRlc2NyaWJlZGJ5XCIsIHRoaXMuaW5zdHJ1Y3Rpb25zLmlkKTtcbiAgICB9XG4gICAgY3JlYXRlQnV0dG9ucygpIHtcbiAgICAgICAgdGhpcy5zdWJtaXRCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpOyAvLyBDaGVjayBtZSBidXR0b25cbiAgICAgICAgdGhpcy5zdWJtaXRCdXR0b24udGV4dENvbnRlbnQgPSBcIkNoZWNrIE1lXCI7XG4gICAgICAgIHRoaXMuc3VibWl0QnV0dG9uLmNsYXNzTmFtZSA9IFwiYnRuIGJ0bi1zdWNjZXNzXCI7XG4gICAgICAgIHRoaXMuc3VibWl0QnV0dG9uLm5hbWUgPSBcImRvIGFuc3dlclwiO1xuICAgICAgICB0aGlzLnN1Ym1pdEJ1dHRvbi50eXBlID0gXCJidXR0b25cIjtcbiAgICAgICAgdGhpcy5zdWJtaXRCdXR0b24ub25jbGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuY2hlY2tDdXJyZW50QW5zd2VyKCk7XG4gICAgICAgICAgICB0aGlzLmxvZ0N1cnJlbnRBbnN3ZXIoKTtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyRmVlZGJhY2soKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZCh0aGlzLnN1Ym1pdEJ1dHRvbik7XG4gICAgfVxuICAgIGNyZWF0ZUZlZWRiYWNrRGl2KCkge1xuICAgICAgICB0aGlzLmZlZWRCYWNrRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgLy8gQW5ub3VuY2UgdGhlIGdyYWRpbmcgcmVzdWx0IHdoZW4gaXQgaXMgZmlsbGVkIGluLlxuICAgICAgICB0aGlzLmZlZWRCYWNrRGl2LnNldEF0dHJpYnV0ZShcImFyaWEtbGl2ZVwiLCBcInBvbGl0ZVwiKTtcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJyXCIpKTtcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYuYXBwZW5kQ2hpbGQodGhpcy5mZWVkQmFja0Rpdik7XG4gICAgfVxuICAgIGNyZWF0ZUxpdmVSZWdpb24oKSB7XG4gICAgICAgIC8vIE9mZiBzY3JlZW4gcmVnaW9uIHVzZWQgdG8gYW5ub3VuY2UgdGhlIHJ1bm5pbmcgc2VsZWN0aW9uIGNvdW50LlxuICAgICAgICB0aGlzLmxpdmVSZWdpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB0aGlzLmxpdmVSZWdpb24uY2xhc3NOYW1lID0gXCJ2aXN1YWxseWhpZGRlblwiO1xuICAgICAgICB0aGlzLmxpdmVSZWdpb24uc2V0QXR0cmlidXRlKFwiYXJpYS1saXZlXCIsIFwicG9saXRlXCIpO1xuICAgICAgICB0aGlzLmxpdmVSZWdpb24uc2V0QXR0cmlidXRlKFwiYXJpYS1hdG9taWNcIiwgXCJ0cnVlXCIpO1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZCh0aGlzLmxpdmVSZWdpb24pO1xuICAgIH1cbiAgICBhbm5vdW5jZShtZXNzYWdlKSB7XG4gICAgICAgIGlmICh0aGlzLmxpdmVSZWdpb24pIHtcbiAgICAgICAgICAgIHRoaXMubGl2ZVJlZ2lvbi50ZXh0Q29udGVudCA9IG1lc3NhZ2U7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09PSBDaGVja2luZy9yZXN0b3JpbmcgZnJvbSBzdG9yYWdlID09PVxuICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbiAgICByZXN0b3JlQW5zd2VycyhkYXRhKSB7XG4gICAgICAgIC8vIFJlc3RvcmUgYW5zd2VycyBmcm9tIHN0b3JhZ2UgcmV0cmlldmFsIGRvbmUgaW4gUnVuZXN0b25lQmFzZSBvciBmcm9tIGxvY2FsIHN0b3JhZ2VcbiAgICAgICAgaWYgKGRhdGEuYW5zd2VyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIC8vIGlmIHdlIGdvdCBkYXRhIGZyb20gdGhlIHNlcnZlclxuICAgICAgICAgICAgdGhpcy5oYXNTdG9yZWRBbnN3ZXJzID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuY2xpY2tlZEluZGV4QXJyYXkgPSBkYXRhLmFuc3dlci5zcGxpdChcIjtcIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY2NBcnJheSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLm1vZGlmeUNsaWNrYWJsZXModGhpcy5uZXdEaXYuY2hpbGROb2Rlcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBGb3IgdXNlIHdpdGggU3BoaW54LXJlbmRlcmVkIEhUTUxcbiAgICAgICAgICAgIHRoaXMuY2NDb3VudGVyID0gMDtcbiAgICAgICAgICAgIHRoaXMuY2NJbmRleCA9IDA7XG4gICAgICAgICAgICB0aGlzLmNpSW5kZXggPSAwO1xuICAgICAgICAgICAgaWYgKCF0aGlzLmlzVGFibGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm1vZGlmeVZpYUNDKHRoaXMubmV3RGl2LmNoaWxkcmVuKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5tb2RpZnlUYWJsZVZpYUNDKHRoaXMubmV3RGl2LmNoaWxkcmVuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBjaGVja0xvY2FsU3RvcmFnZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuZ3JhZGVyYWN0aXZlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHN0b3JhZ2VPYmo7XG4gICAgICAgIC8vIEdldHMgcHJldmlvdXMgYW5zd2VyIGRhdGEgZnJvbSBsb2NhbCBzdG9yYWdlIGlmIGl0IGV4aXN0c1xuICAgICAgICB0aGlzLmhhc1N0b3JlZEFuc3dlcnMgPSBmYWxzZTtcbiAgICAgICAgdmFyIGxlbiA9IGxvY2FsU3RvcmFnZS5sZW5ndGg7XG4gICAgICAgIGlmIChsZW4gPiAwKSB7XG4gICAgICAgICAgICB2YXIgZXggPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLmxvY2FsU3RvcmFnZUtleSgpKTtcbiAgICAgICAgICAgIGlmIChleCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuaGFzU3RvcmVkQW5zd2VycyA9IHRydWU7XG4gICAgICAgICAgICAgICAgbGV0IGVycm9yID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgc3RvcmFnZU9iaiA9IEpTT04ucGFyc2UoZXgpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICAvLyBlcnJvciB3aGlsZSBwYXJzaW5nOyBsaWtlbHkgZHVlIHRvIGJhZCB2YWx1ZSBzdG9yZWQgaW4gc3RvcmFnZVxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAgICAgICAgICAgICAgIGBFcnJvciBwYXJzaW5nIHN0b3JlZCBDbGlja2FibGVBcmVhIGRhdGEgZm9yICR7dGhpcy5kaXZpZH06ICR7ZXJyLm1lc3NhZ2V9YCxcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3IgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZXJyb3IgfHwgc3RvcmFnZU9iai50aW1lc3RhbXAgPCBlQm9va0NvbmZpZy50ZXJtU3RhcnREYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKHRoaXMubG9jYWxTdG9yYWdlS2V5KCkpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmhhc1N0b3JlZEFuc3dlcnMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXN0b3JlQW5zd2Vycyh7fSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5jbGlja2VkSW5kZXhBcnJheSA9IHN0b3JhZ2VPYmouYW5zd2VyLnNwbGl0KFwiO1wiKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy51c2VSdW5lc3RvbmVTZXJ2aWNlcykge1xuICAgICAgICAgICAgICAgICAgICAvLyBsb2cgYW5zd2VyIHRvIHNlcnZlclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdpdmVuSW5kZXhBcnJheSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY2xpY2thYmxlQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNsaWNrYWJsZUFycmF5W2ldLmNsYXNzTGlzdC5jb250YWlucyhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjbGlja2FibGUtY2xpY2tlZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2l2ZW5JbmRleEFycmF5LnB1c2goaSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2dCb29rRXZlbnQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQ6IFwiY2xpY2thYmxlQXJlYVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgYWN0OiB0aGlzLmNsaWNrZWRJbmRleEFycmF5LmpvaW4oXCI7XCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgYW5zd2VyOiB0aGlzLmNsaWNrZWRJbmRleEFycmF5LmpvaW4oXCI7XCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGl2X2lkOiB0aGlzLmRpdmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29ycmVjdDogc3RvcmFnZU9iai5jb3JyZWN0LFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yZXN0b3JlQW5zd2Vycyh7fSk7IC8vIHBhc3MgZW1wdHkgb2JqZWN0XG4gICAgfVxuICAgIHNldExvY2FsU3RvcmFnZShkYXRhKSB7XG4gICAgICAgIC8vIEFycmF5IG9mIHRoZSBpbmRpY2VzIG9mIGNsaWNrZWQgZWxlbWVudHMgaXMgcGFzc2VkIHRvIGxvY2FsIHN0b3JhZ2VcbiAgICAgICAgdmFyIGFuc3dlcjtcbiAgICAgICAgaWYgKGRhdGEuYW5zd2VyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIC8vIElmIHdlIGdvdCBkYXRhIGZyb20gdGhlIHNlcnZlciwgd2UgY2FuIGp1c3QgdXNlIHRoYXRcbiAgICAgICAgICAgIGFuc3dlciA9IHRoaXMuY2xpY2tlZEluZGV4QXJyYXkuam9pbihcIjtcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmdpdmVuSW5kZXhBcnJheSA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmNsaWNrYWJsZUFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsaWNrYWJsZUFycmF5W2ldLmNsYXNzTGlzdC5jb250YWlucyhcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xpY2thYmxlLWNsaWNrZWRcIixcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmdpdmVuSW5kZXhBcnJheS5wdXNoKGkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFuc3dlciA9IHRoaXMuZ2l2ZW5JbmRleEFycmF5LmpvaW4oXCI7XCIpO1xuICAgICAgICB9XG4gICAgICAgIHZhciB0aW1lU3RhbXAgPSBuZXcgRGF0ZSgpO1xuICAgICAgICB2YXIgY29ycmVjdCA9IGRhdGEuY29ycmVjdDtcbiAgICAgICAgdmFyIHN0b3JhZ2VPYmplY3QgPSB7XG4gICAgICAgICAgICBhbnN3ZXI6IGFuc3dlcixcbiAgICAgICAgICAgIGNvcnJlY3Q6IGNvcnJlY3QsXG4gICAgICAgICAgICB0aW1lc3RhbXA6IHRpbWVTdGFtcCxcbiAgICAgICAgfTtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXG4gICAgICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZUtleSgpLFxuICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoc3RvcmFnZU9iamVjdCksXG4gICAgICAgICk7XG4gICAgfVxuICAgIC8qPT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICA9PT0gQXV4aWxsaWFyeSBmdW5jdGlvbnMgPT09XG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuICAgIG1vZGlmeUNsaWNrYWJsZXMoY2hpbGROb2Rlcykge1xuICAgICAgICAvLyBTdHJpcHMgdGhlIGRhdGEtY29ycmVjdC9kYXRhLWluY29ycmVjdCBsYWJlbHMgYW5kIHVwZGF0ZXMgdGhlIGNvcnJlY3QvaW5jb3JyZWN0IGFycmF5c1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkTm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IG5vZGUgPSBjaGlsZE5vZGVzW2ldO1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIG5vZGUubm9kZVR5cGUgPT09IE5vZGUuRUxFTUVOVF9OT0RFICYmXG4gICAgICAgICAgICAgICAgKG5vZGUuaGFzQXR0cmlidXRlKFwiZGF0YS1jb3JyZWN0XCIpIHx8XG4gICAgICAgICAgICAgICAgICAgIG5vZGUuaGFzQXR0cmlidXRlKFwiZGF0YS1pbmNvcnJlY3RcIikpXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICB0aGlzLm1hbmFnZU5ld0NsaWNrYWJsZShub2RlKTtcbiAgICAgICAgICAgICAgICBpZiAobm9kZS5oYXNBdHRyaWJ1dGUoXCJkYXRhLWNvcnJlY3RcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5yZW1vdmVBdHRyaWJ1dGUoXCJkYXRhLWNvcnJlY3RcIik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29ycmVjdEFycmF5LnB1c2gobm9kZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5yZW1vdmVBdHRyaWJ1dGUoXCJkYXRhLWluY29ycmVjdFwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbmNvcnJlY3RBcnJheS5wdXNoKG5vZGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChub2RlLmNoaWxkTm9kZXMgJiYgbm9kZS5jaGlsZE5vZGVzLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMubW9kaWZ5Q2xpY2thYmxlcyhub2RlLmNoaWxkTm9kZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIG1vZGlmeVZpYUNDKGNoaWxkcmVuKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChjaGlsZHJlbltpXS5jaGlsZHJlbi5sZW5ndGggIT09IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLm1vZGlmeVZpYUNDKGNoaWxkcmVuW2ldLmNoaWxkcmVuKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jY0NvdW50ZXIrKztcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jY0NvdW50ZXIgPT09IE1hdGguZmxvb3IodGhpcy5jY0FycmF5W3RoaXMuY2NJbmRleF0pKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubWFuYWdlTmV3Q2xpY2thYmxlKGNoaWxkcmVuW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb3JyZWN0QXJyYXkucHVzaChjaGlsZHJlbltpXSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2NJbmRleCsrO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2NDb3VudGVyID09PSBNYXRoLmZsb29yKHRoaXMuY2lBcnJheVt0aGlzLmNpSW5kZXhdKVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm1hbmFnZU5ld0NsaWNrYWJsZShjaGlsZHJlbltpXSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5jb3JyZWN0QXJyYXkucHVzaChjaGlsZHJlbltpXSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2lJbmRleCsrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBtb2RpZnlUYWJsZVZpYUNDKGNoaWxkcmVuKSB7XG4gICAgICAgIC8vIHRhYmxlIHZlcnNpb24gb2YgbW9kaWZ5VmlhQ0NcbiAgICAgICAgdmFyIHRDb21wb25lbnRBcnIgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGNoaWxkcmVuW2ldLm5vZGVOYW1lID09PSBcIlRBQkxFXCIpIHtcbiAgICAgICAgICAgICAgICBsZXQgdG1wID0gY2hpbGRyZW5baV07XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0bXAuY2hpbGRyZW4ubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRtcC5jaGlsZHJlbltqXS5ub2RlTmFtZSA9PT0gXCJUSEVBRFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0Q29tcG9uZW50QXJyLnB1c2godG1wLmNoaWxkcmVuW2pdKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0bXAuY2hpbGRyZW5bal0ubm9kZU5hbWUgPT09IFwiVEJPRFlcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdENvbXBvbmVudEFyci5wdXNoKHRtcC5jaGlsZHJlbltqXSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodG1wLmNoaWxkcmVuW2pdLm5vZGVOYW1lID09PSBcIlRGT09UXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRDb21wb25lbnRBcnIucHVzaCh0bXAuY2hpbGRyZW5bal0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIHQgPSAwOyB0IDwgdENvbXBvbmVudEFyci5sZW5ndGg7IHQrKykge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0Q29tcG9uZW50QXJyW3RdLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jY0NvdW50ZXIrKztcbiAgICAgICAgICAgICAgICAvLyBGaXJzdCBjaGVjayBpZiB0aGUgZW50aXJlIHJvdyBuZWVkcyB0byBiZSBjbGlja2FibGVcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2NJbmRleCA8IHRoaXMuY2NBcnJheS5sZW5ndGggJiZcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jY0NvdW50ZXIgPT09XG4gICAgICAgICAgICAgICAgICAgICAgICBNYXRoLmZsb29yKHRoaXMuY2NBcnJheVt0aGlzLmNjSW5kZXhdLnNwbGl0KFwiLFwiKVswXSkgJiZcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5mbG9vcih0aGlzLmNjQXJyYXlbdGhpcy5jY0luZGV4XS5zcGxpdChcIixcIilbMV0pID09PSAwXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubWFuYWdlTmV3Q2xpY2thYmxlKHRDb21wb25lbnRBcnJbdF0uY2hpbGRyZW5baV0pO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvcnJlY3RBcnJheS5wdXNoKHRDb21wb25lbnRBcnJbdF0uY2hpbGRyZW5baV0pO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNjSW5kZXgrKztcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNpSW5kZXggPCB0aGlzLmNpQXJyYXkubGVuZ3RoICYmXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2NDb3VudGVyID09PVxuICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5mbG9vcih0aGlzLmNpQXJyYXlbdGhpcy5jaUluZGV4XS5zcGxpdChcIixcIilbMF0pICYmXG4gICAgICAgICAgICAgICAgICAgIE1hdGguZmxvb3IodGhpcy5jaUFycmF5W3RoaXMuY2lJbmRleF0uc3BsaXQoXCIsXCIpWzFdKSA9PT0gMFxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm1hbmFnZU5ld0NsaWNrYWJsZSh0Q29tcG9uZW50QXJyW3RdLmNoaWxkcmVuW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbmNvcnJlY3RBcnJheS5wdXNoKHRDb21wb25lbnRBcnJbdF0uY2hpbGRyZW5baV0pO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNpSW5kZXgrKztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBJZiBub3QsIGNoZWNrIHRoZSBpbmRpdmlkdWFsIGRhdGEgY2VsbHNcbiAgICAgICAgICAgICAgICAgICAgZm9yIChcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBqID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGogPCB0Q29tcG9uZW50QXJyW3RdLmNoaWxkcmVuW2ldLmNoaWxkcmVuLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGorK1xuICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0bXAgPSBqICsgMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNjSW5kZXggPCB0aGlzLmNjQXJyYXkubGVuZ3RoICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG1wID09PVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBNYXRoLmZsb29yKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jY0FycmF5W3RoaXMuY2NJbmRleF0uc3BsaXQoXCIsXCIpWzFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jY0NvdW50ZXIgPT09XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1hdGguZmxvb3IoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNjQXJyYXlbdGhpcy5jY0luZGV4XS5zcGxpdChcIixcIilbMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWFuYWdlTmV3Q2xpY2thYmxlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0Q29tcG9uZW50QXJyW3RdLmNoaWxkcmVuW2ldLmNoaWxkcmVuW2pdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb3JyZWN0QXJyYXkucHVzaChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdENvbXBvbmVudEFyclt0XS5jaGlsZHJlbltpXS5jaGlsZHJlbltqXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2NJbmRleCsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNpSW5kZXggPCB0aGlzLmNpQXJyYXkubGVuZ3RoICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG1wID09PVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBNYXRoLmZsb29yKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jaUFycmF5W3RoaXMuY2lJbmRleF0uc3BsaXQoXCIsXCIpWzFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jY0NvdW50ZXIgPT09XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1hdGguZmxvb3IoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNpQXJyYXlbdGhpcy5jaUluZGV4XS5zcGxpdChcIixcIilbMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWFuYWdlTmV3Q2xpY2thYmxlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0Q29tcG9uZW50QXJyW3RdLmNoaWxkcmVuW2ldLmNoaWxkcmVuW2pdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbmNvcnJlY3RBcnJheS5wdXNoKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0Q29tcG9uZW50QXJyW3RdLmNoaWxkcmVuW2ldLmNoaWxkcmVuW2pdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jaUluZGV4Kys7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgbWFuYWdlTmV3Q2xpY2thYmxlKGNsaWNrYWJsZSkge1xuICAgICAgICAvLyBhZGRzIHRoZSBcImNsaWNrYWJsZVwiIGZ1bmN0aW9uYWxpdHlcbiAgICAgICAgY2xpY2thYmxlLmNsYXNzTGlzdC5hZGQoXCJjbGlja2FibGVcIik7XG4gICAgICAgIGlmICh0aGlzLmhhc1N0b3JlZEFuc3dlcnMpIHtcbiAgICAgICAgICAgIC8vIENoZWNrIGlmIHRoZSBlbGVtZW50IHdlJ3JlIGFib3V0IHRvIGFwcGVuZCB0byB0aGUgcHJlIHdhcyBpbiBsb2NhbCBzdG9yYWdlIGFzIGNsaWNrZWQgdmlhIGl0cyBpbmRleFxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIHRoaXMuY2xpY2tlZEluZGV4QXJyYXlbdGhpcy5jbGlja0luZGV4XS50b1N0cmluZygpID09PVxuICAgICAgICAgICAgICAgIHRoaXMuY2xpY2thYmxlQ291bnRlci50b1N0cmluZygpXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBjbGlja2FibGUuY2xhc3NMaXN0LmFkZChcImNsaWNrYWJsZS1jbGlja2VkXCIpO1xuICAgICAgICAgICAgICAgIHRoaXMuY2xpY2tJbmRleCsrO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNsaWNrSW5kZXggPT09IHRoaXMuY2xpY2tlZEluZGV4QXJyYXkubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFN0b3AgZG9pbmcgdGhpcyBpZiB0aGUgaW5kZXggYXJyYXkgaXMgdXNlZCB1cFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmhhc1N0b3JlZEFuc3dlcnMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gRXhwb3NlIGVhY2ggY2xpY2thYmxlIGFzIGEgY2hlY2tib3ggc28gdGhhdCBhIHNjcmVlbiByZWFkZXIgYW5ub3VuY2VzXG4gICAgICAgIC8vIGl0cyBzZWxlY3RlZCBzdGF0ZS4gT25seSBvbmUgY2hlY2tib3ggaXMgaW4gdGhlIHBhZ2UgdGFiIG9yZGVyOyBhcnJvd1xuICAgICAgICAvLyBrZXlzIG1vdmUgdGhhdCB0YWIgc3RvcCB0aHJvdWdoIHRoZSBncm91cC5cbiAgICAgICAgY2xpY2thYmxlLnNldEF0dHJpYnV0ZShcInJvbGVcIiwgXCJjaGVja2JveFwiKTtcbiAgICAgICAgY2xpY2thYmxlLnNldEF0dHJpYnV0ZShcbiAgICAgICAgICAgIFwidGFiaW5kZXhcIixcbiAgICAgICAgICAgIHRoaXMuY2xpY2thYmxlQXJyYXkubGVuZ3RoID09PSAwID8gXCIwXCIgOiBcIi0xXCIsXG4gICAgICAgICk7XG4gICAgICAgIGNsaWNrYWJsZS5zZXRBdHRyaWJ1dGUoXG4gICAgICAgICAgICBcImFyaWEtY2hlY2tlZFwiLFxuICAgICAgICAgICAgY2xpY2thYmxlLmNsYXNzTGlzdC5jb250YWlucyhcImNsaWNrYWJsZS1jbGlja2VkXCIpXG4gICAgICAgICAgICAgICAgPyBcInRydWVcIlxuICAgICAgICAgICAgICAgIDogXCJmYWxzZVwiLFxuICAgICAgICApO1xuICAgICAgICBjbGlja2FibGUub25jbGljayA9ICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZm9jdXNDbGlja2FibGUoY2xpY2thYmxlKTtcbiAgICAgICAgICAgIHRoaXMudG9nZ2xlQ2xpY2thYmxlKGNsaWNrYWJsZSk7XG4gICAgICAgIH07XG4gICAgICAgIGNsaWNrYWJsZS5hZGRFdmVudExpc3RlbmVyKFwiZm9jdXNcIiwgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZXRBY3RpdmVDbGlja2FibGUoY2xpY2thYmxlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGNsaWNrYWJsZS5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCAoZXYpID0+IHtcbiAgICAgICAgICAgIGlmIChldi5rZXkgPT09IFwiRW50ZXJcIiB8fCBldi5rZXkgPT09IFwiIFwiIHx8IGV2LmtleSA9PT0gXCJTcGFjZWJhclwiKSB7XG4gICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTsgLy8ga2VlcCB0aGUgc3BhY2UgYmFyIGZyb20gc2Nyb2xsaW5nIHRoZSBwYWdlXG4gICAgICAgICAgICAgICAgdGhpcy50b2dnbGVDbGlja2FibGUoY2xpY2thYmxlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXYua2V5ID09PSBcIkFycm93UmlnaHRcIiB8fCBldi5rZXkgPT09IFwiQXJyb3dEb3duXCIpIHtcbiAgICAgICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHRoaXMubW92ZUNsaWNrYWJsZUZvY3VzKGNsaWNrYWJsZSwgMSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGV2LmtleSA9PT0gXCJBcnJvd0xlZnRcIiB8fCBldi5rZXkgPT09IFwiQXJyb3dVcFwiKSB7XG4gICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB0aGlzLm1vdmVDbGlja2FibGVGb2N1cyhjbGlja2FibGUsIC0xKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXYua2V5ID09PSBcIkhvbWVcIikge1xuICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5mb2N1c0NsaWNrYWJsZSh0aGlzLmNsaWNrYWJsZUFycmF5WzBdKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXYua2V5ID09PSBcIkVuZFwiKSB7XG4gICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmZvY3VzQ2xpY2thYmxlKFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsaWNrYWJsZUFycmF5W3RoaXMuY2xpY2thYmxlQXJyYXkubGVuZ3RoIC0gMV0sXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuY2xpY2thYmxlQXJyYXkucHVzaChjbGlja2FibGUpO1xuICAgICAgICB0aGlzLmNsaWNrYWJsZUNvdW50ZXIrKztcbiAgICB9XG4gICAgc2V0QWN0aXZlQ2xpY2thYmxlKGNsaWNrYWJsZSkge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICB0aGlzLmludGVyYWN0aW9uRGlzYWJsZWQgfHxcbiAgICAgICAgICAgICF0aGlzLmNsaWNrYWJsZUFycmF5LmluY2x1ZGVzKGNsaWNrYWJsZSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCBjaG9pY2Ugb2YgdGhpcy5jbGlja2FibGVBcnJheSkge1xuICAgICAgICAgICAgY2hvaWNlLnNldEF0dHJpYnV0ZShcInRhYmluZGV4XCIsIGNob2ljZSA9PT0gY2xpY2thYmxlID8gXCIwXCIgOiBcIi0xXCIpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZvY3VzQ2xpY2thYmxlKGNsaWNrYWJsZSkge1xuICAgICAgICBpZiAodGhpcy5pbnRlcmFjdGlvbkRpc2FibGVkIHx8ICFjbGlja2FibGUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNldEFjdGl2ZUNsaWNrYWJsZShjbGlja2FibGUpO1xuICAgICAgICBjbGlja2FibGUuZm9jdXMoKTtcbiAgICB9XG4gICAgbW92ZUNsaWNrYWJsZUZvY3VzKGNsaWNrYWJsZSwgb2Zmc2V0KSB7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRJbmRleCA9IHRoaXMuY2xpY2thYmxlQXJyYXkuaW5kZXhPZihjbGlja2FibGUpO1xuICAgICAgICBpZiAoY3VycmVudEluZGV4ID09PSAtMSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG5leHRJbmRleCA9IE1hdGgubWluKFxuICAgICAgICAgICAgdGhpcy5jbGlja2FibGVBcnJheS5sZW5ndGggLSAxLFxuICAgICAgICAgICAgTWF0aC5tYXgoMCwgY3VycmVudEluZGV4ICsgb2Zmc2V0KSxcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5mb2N1c0NsaWNrYWJsZSh0aGlzLmNsaWNrYWJsZUFycmF5W25leHRJbmRleF0pO1xuICAgIH1cbiAgICB0b2dnbGVDbGlja2FibGUoY2xpY2thYmxlKSB7XG4gICAgICAgIGlmICh0aGlzLmludGVyYWN0aW9uRGlzYWJsZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmlzQW5zd2VyZWQgPSB0cnVlO1xuICAgICAgICBjb25zdCBub3dTZWxlY3RlZCA9ICFjbGlja2FibGUuY2xhc3NMaXN0LmNvbnRhaW5zKFwiY2xpY2thYmxlLWNsaWNrZWRcIik7XG4gICAgICAgIGNsaWNrYWJsZS5jbGFzc0xpc3QudG9nZ2xlKFwiY2xpY2thYmxlLWNsaWNrZWRcIiwgbm93U2VsZWN0ZWQpO1xuICAgICAgICBjbGlja2FibGUuc2V0QXR0cmlidXRlKFwiYXJpYS1jaGVja2VkXCIsIG5vd1NlbGVjdGVkID8gXCJ0cnVlXCIgOiBcImZhbHNlXCIpO1xuICAgICAgICBpZiAoIW5vd1NlbGVjdGVkKSB7XG4gICAgICAgICAgICAvLyBDbGVhciBhbnkgZ3JhZGluZyBtYXJrcyBsZWZ0IG92ZXIgZnJvbSBhIHByZXZpb3VzIENoZWNrIE1lXG4gICAgICAgICAgICBjbGlja2FibGUuY2xhc3NMaXN0LnJlbW92ZShcImNsaWNrYWJsZS1pbmNvcnJlY3RcIik7XG4gICAgICAgICAgICBjbGlja2FibGUucmVtb3ZlQXR0cmlidXRlKFwiYXJpYS1pbnZhbGlkXCIpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYW5ub3VuY2VTZWxlY3Rpb25Db3VudCgpO1xuICAgIH1cbiAgICBhbm5vdW5jZVNlbGVjdGlvbkNvdW50KCkge1xuICAgICAgICBjb25zdCBzZWxlY3RlZCA9IHRoaXMuY2xpY2thYmxlQXJyYXkuZmlsdGVyKChlbCkgPT5cbiAgICAgICAgICAgIGVsLmNsYXNzTGlzdC5jb250YWlucyhcImNsaWNrYWJsZS1jbGlja2VkXCIpLFxuICAgICAgICApLmxlbmd0aDtcbiAgICAgICAgdGhpcy5hbm5vdW5jZShcbiAgICAgICAgICAgIGAke3NlbGVjdGVkfSBvZiAke3RoaXMuY2xpY2thYmxlQXJyYXkubGVuZ3RofSBjaG9pY2VzIHNlbGVjdGVkLmAsXG4gICAgICAgICk7XG4gICAgfVxuICAgIC8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICA9PSBFdmFsdWF0aW9uIGFuZCBkaXNwbGF5aW5nIGZlZWRiYWNrID09XG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuICAgIGNoZWNrQ3VycmVudEFuc3dlcigpIHtcbiAgICAgICAgLy8gRXZhbHVhdGlvbiBpcyBkb25lIGJ5IGl0ZXJhdGluZyBvdmVyIHRoZSBjb3JyZWN0L2luY29ycmVjdCBhcnJheXMgYW5kIGNoZWNraW5nIGJ5IGNsYXNzXG4gICAgICAgIHRoaXMuY29ycmVjdCA9IHRydWU7XG4gICAgICAgIHRoaXMuY29ycmVjdE51bSA9IDA7XG4gICAgICAgIHRoaXMuaW5jb3JyZWN0TnVtID0gMDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNvcnJlY3RBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmNvcnJlY3RBcnJheVtpXS5jbGFzc0xpc3QuY29udGFpbnMoXCJjbGlja2FibGUtY2xpY2tlZFwiKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY29ycmVjdCA9IGZhbHNlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvcnJlY3ROdW0rKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaW5jb3JyZWN0QXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICB0aGlzLmluY29ycmVjdEFycmF5W2ldLmNsYXNzTGlzdC5jb250YWlucyhcImNsaWNrYWJsZS1jbGlja2VkXCIpXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvcnJlY3QgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLmluY29ycmVjdE51bSsrO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmluY29ycmVjdEFycmF5W2ldLmNsYXNzTGlzdC5yZW1vdmUoXCJjbGlja2FibGUtaW5jb3JyZWN0XCIpO1xuICAgICAgICAgICAgICAgIHRoaXMuaW5jb3JyZWN0QXJyYXlbaV0ucmVtb3ZlQXR0cmlidXRlKFwiYXJpYS1pbnZhbGlkXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMucGVyY2VudCA9XG4gICAgICAgICAgICAodGhpcy5jb3JyZWN0TnVtIC0gdGhpcy5pbmNvcnJlY3ROdW0pIC8gdGhpcy5jb3JyZWN0QXJyYXkubGVuZ3RoO1xuICAgICAgICB0aGlzLnBlcmNlbnQgPSBNYXRoLm1heCgwLCB0aGlzLnBlcmNlbnQpO1xuICAgICAgICB0aGlzLnNldExvY2FsU3RvcmFnZSh7IGNvcnJlY3Q6IHRoaXMuY29ycmVjdCA/IFwiVFwiIDogXCJGXCIgfSk7XG4gICAgfVxuXG4gICAgYXN5bmMgbG9nQ3VycmVudEFuc3dlcihzaWQpIHtcbiAgICAgICAgY29uc3QgYW5zd2VyID0gdGhpcy5naXZlbkluZGV4QXJyYXkuam9pbihcIjtcIik7XG4gICAgICAgIGxldCBkYXRhID0ge1xuICAgICAgICAgICAgZXZlbnQ6IFwiY2xpY2thYmxlQXJlYVwiLFxuICAgICAgICAgICAgYW5zd2VyOiBhbnN3ZXIsXG4gICAgICAgICAgICBhY3Q6IGFuc3dlcixcbiAgICAgICAgICAgIGRpdl9pZDogdGhpcy5kaXZpZCxcbiAgICAgICAgICAgIGNvcnJlY3Q6IHRoaXMuY29ycmVjdCA/IFwiVFwiIDogXCJGXCIsXG4gICAgICAgIH07XG4gICAgICAgIGlmICh0eXBlb2Ygc2lkICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBkYXRhLnNpZCA9IHNpZDtcbiAgICAgICAgfVxuICAgICAgICBhd2FpdCB0aGlzLmxvZ0Jvb2tFdmVudChkYXRhKTtcbiAgICB9XG5cbiAgICByZW5kZXJGZWVkYmFjaygpIHtcbiAgICAgICAgaWYgKHRoaXMuY29ycmVjdCkge1xuICAgICAgICAgICAgdGhpcy5mZWVkQmFja0Rpdi5pbm5lckhUTUwgPSBcIllvdSBhcmUgQ29ycmVjdCFcIjtcbiAgICAgICAgICAgIHRoaXMuZmVlZEJhY2tEaXYuY2xhc3NOYW1lID0gXCJhbGVydCBhbGVydC1pbmZvXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaW5jb3JyZWN0QXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5jb3JyZWN0QXJyYXlbaV0uY2xhc3NMaXN0LmNvbnRhaW5zKFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbGlja2FibGUtY2xpY2tlZFwiLFxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5jb3JyZWN0QXJyYXlbaV0uY2xhc3NMaXN0LmFkZChcImNsaWNrYWJsZS1pbmNvcnJlY3RcIik7XG4gICAgICAgICAgICAgICAgICAgIC8vIHNvIGEgc2NyZWVuIHJlYWRlciBmbGFncyB0aGUgY2hvaWNlIHdoZW4gdGhlIHJlYWRlclxuICAgICAgICAgICAgICAgICAgICAvLyBtb3ZlcyBiYWNrIG92ZXIgaXRcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbmNvcnJlY3RBcnJheVtpXS5zZXRBdHRyaWJ1dGUoXCJhcmlhLWludmFsaWRcIiwgXCJ0cnVlXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5jb3JyZWN0QXJyYXlbaV0uY2xhc3NMaXN0LnJlbW92ZShcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xpY2thYmxlLWluY29ycmVjdFwiLFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmluY29ycmVjdEFycmF5W2ldLnJlbW92ZUF0dHJpYnV0ZShcImFyaWEtaW52YWxpZFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmZlZWRCYWNrRGl2LmlubmVySFRNTCA9XG4gICAgICAgICAgICAgICAgXCJJbmNvcnJlY3QuIFlvdSBjbGlja2VkIG9uIFwiICtcbiAgICAgICAgICAgICAgICB0aGlzLmNvcnJlY3ROdW0gK1xuICAgICAgICAgICAgICAgIFwiIG9mIHRoZSBcIiArXG4gICAgICAgICAgICAgICAgdGhpcy5jb3JyZWN0QXJyYXkubGVuZ3RoLnRvU3RyaW5nKCkgK1xuICAgICAgICAgICAgICAgIFwiIGNvcnJlY3QgZWxlbWVudHMgYW5kIFwiICtcbiAgICAgICAgICAgICAgICB0aGlzLmluY29ycmVjdE51bSArXG4gICAgICAgICAgICAgICAgXCIgb2YgdGhlIFwiICtcbiAgICAgICAgICAgICAgICB0aGlzLmluY29ycmVjdEFycmF5Lmxlbmd0aC50b1N0cmluZygpICtcbiAgICAgICAgICAgICAgICBcIiBpbmNvcnJlY3QgZWxlbWVudHMuIFwiICtcbiAgICAgICAgICAgICAgICB0aGlzLmZlZWRiYWNrO1xuICAgICAgICAgICAgdGhpcy5mZWVkQmFja0Rpdi5jbGFzc05hbWUgPSBcImFsZXJ0IGFsZXJ0LWRhbmdlclwiO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZGlzYWJsZUludGVyYWN0aW9uKCkge1xuICAgICAgICAvLyBUaGUga2V5ZG93biBoYW5kbGVycyBzdGF5IGF0dGFjaGVkOyB0aGV5IGNoZWNrIHRoaXMgZmxhZyBpbnN0ZWFkLlxuICAgICAgICB0aGlzLmludGVyYWN0aW9uRGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY2xpY2thYmxlQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuY2xpY2thYmxlQXJyYXlbaV0uc3R5bGUuY3Vyc29yID0gXCJpbml0aWFsXCI7XG4gICAgICAgICAgICB0aGlzLmNsaWNrYWJsZUFycmF5W2ldLm9uY2xpY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMuY2xpY2thYmxlQXJyYXlbaV0uc2V0QXR0cmlidXRlKFwiYXJpYS1kaXNhYmxlZFwiLCBcInRydWVcIik7XG4gICAgICAgICAgICB0aGlzLmNsaWNrYWJsZUFycmF5W2ldLnNldEF0dHJpYnV0ZShcInRhYmluZGV4XCIsIFwiLTFcIik7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PSBGaW5kIHRoZSBjdXN0b20gSFRNTCB0YWdzIGFuZCA9PVxuPT0gICBleGVjdXRlIG91ciBjb2RlIG9uIHRoZW0gICAgPT1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwicnVuZXN0b25lOmxvZ2luLWNvbXBsZXRlXCIsIGZ1bmN0aW9uICgpIHtcbiAgICBkb2N1bWVudFxuICAgICAgICAucXVlcnlTZWxlY3RvckFsbChcIltkYXRhLWNvbXBvbmVudD1jbGlja2FibGVhcmVhXVwiKVxuICAgICAgICAuZm9yRWFjaChmdW5jdGlvbiAoZWwsIGluZGV4KSB7XG4gICAgICAgICAgICBpZiAoIWVsLmNsb3Nlc3QoXCJbZGF0YS1jb21wb25lbnQ9dGltZWRBc3Nlc3NtZW50XVwiKSkge1xuICAgICAgICAgICAgICAgIC8vIElmIHRoaXMgZWxlbWVudCBleGlzdHMgd2l0aGluIGEgdGltZWQgY29tcG9uZW50LCBkb24ndCByZW5kZXIgaXQgaGVyZVxuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5jb21wb25lbnRNYXBbZWwuaWRdID0gbmV3IENsaWNrYWJsZUFyZWEoe1xuICAgICAgICAgICAgICAgICAgICAgICAgb3JpZzogZWwsXG4gICAgICAgICAgICAgICAgICAgICAgICB1c2VSdW5lc3RvbmVTZXJ2aWNlczogZUJvb2tDb25maWcudXNlUnVuZXN0b25lU2VydmljZXMsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgRXJyb3IgcmVuZGVyaW5nIENsaWNrYWJsZUFyZWEgUHJvYmxlbSAke2VsLmlkfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBEZXRhaWxzOiAke2Vycn1gKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xufSk7XG4iLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=