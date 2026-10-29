"use strict";
(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_timed_js_timed_js-runestone_clickableArea_css_clickable_css-runestone_fitb_css_fitb-cd9fb1"],{

/***/ 4968:
/*!*************************************!*\
  !*** ./runestone/timed/js/timed.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Timed)
/* harmony export */ });
/* harmony import */ var _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/runestonebase.js */ 78673);
/* harmony import */ var _fitb_js_timedfitb_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../fitb/js/timedfitb.js */ 1103);
/* harmony import */ var _mchoice_js_timedmc_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../mchoice/js/timedmc.js */ 86001);
/* harmony import */ var _shortanswer_js_timed_shortanswer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../shortanswer/js/timed_shortanswer.js */ 68950);
/* harmony import */ var _activecode_js_acfactory_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../activecode/js/acfactory.js */ 49917);
/* harmony import */ var _clickableArea_js_timedclickable__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../clickableArea/js/timedclickable */ 44892);
/* harmony import */ var _dragndrop_js_timeddnd_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../dragndrop/js/timeddnd.js */ 17558);
/* harmony import */ var _parsons_js_timedparsons_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../parsons/js/timedparsons.js */ 23405);
/* harmony import */ var _matching_js_timed_matching_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../matching/js/timed_matching.js */ 89296);
/* harmony import */ var _selectquestion_js_selectone__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../selectquestion/js/selectone */ 10662);
/* harmony import */ var _common_js_domutil_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../common/js/domutil.js */ 34089);
/* harmony import */ var _css_timed_less__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../css/timed.less */ 57724);
/*==========================================
========      Master timed.js     =========
============================================
===     This file contains the JS for    ===
===     the Runestone timed component.   ===
============================================
===              Created By              ===
===             Kirby Olson              ===
===               6/11/15                ===
==========================================*/















// Timed constructor
class Timed extends _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(opts) {
        super(opts);
        var orig = opts.orig;
        this.origElem = orig; // the entire element of this timed assessment and all of its children
        this.divid = orig.id;
        this.children = this.origElem.childNodes;
        this.visited = [];
        this.timeLimit = 0;
        this.limitedTime = false;
        if (!isNaN((0,_common_js_domutil_js__WEBPACK_IMPORTED_MODULE_10__.getDataValue)(this.origElem, "time"))) {
            this.timeLimit =
                parseInt((0,_common_js_domutil_js__WEBPACK_IMPORTED_MODULE_10__.getDataValue)(this.origElem, "time"), 10) * 60; // time in seconds to complete the exam
            this.startingTime = this.timeLimit;
            this.limitedTime = true;
        }
        this.showFeedback = true;
        if (this.origElem.hasAttribute("data-no-feedback")) {
            this.showFeedback = false;
        }
        // check for attribute data-show-feedback = yes
        if (this.origElem.hasAttribute("data-show-feedback")) {
            if (this.origElem.getAttribute("data-show-feedback") === "yes") {
                this.showFeedback = true;
            } else {
                this.showFeedback = false;
            }
        }
        this.showResults = false;
        if (this.origElem.hasAttribute("data-result")) {
            this.showResults = false;
        }
        this.random = false;
        if (this.origElem.hasAttribute("data-random")) {
            this.random = true;
        }
        this.showTimer = true;
        if (this.origElem.hasAttribute("data-no-timer")) {
            this.showTimer = false;
        }
        if (this.origElem.hasAttribute("data-timer")) {
            if (this.origElem.getAttribute("data-timer") === "yes") {
                this.showTimer = true;
            } else {
                this.showTimer = false;
            }
        }
        this.fullwidth = false;
        if (this.origElem.hasAttribute("data-fullwidth")) {
            this.fullwidth = true;
        }
        this.nopause = false;
        if (this.origElem.hasAttribute("data-no-pause")) {
            this.nopause = true;
        }
        if (this.origElem.hasAttribute("data-pause")) {
            if (this.origElem.getAttribute("data-pause") === "yes") {
                this.nopause = false;
            } else {
                this.nopause = true;
            }
        }
        eBookConfig.enableScratchAC = false;
        this.running = 0;
        this.paused = 0;
        this.done = 0;
        this.taken = 0;
        this.score = 0;
        this.incorrect = 0;
        this.correctStr = "";
        this.incorrectStr = "";
        this.skippedStr = "";
        this.skipped = 0;
        this.currentQuestionIndex = 0; // Which question is currently displaying on the page
        this.renderedQuestionArray = []; // list of all problems
        this.getNewChildren();
        // One small step to eliminate students from doing view source
        // this won't stop anyone with determination but may prevent casual peeking
        if (!eBookConfig.enableDebug) {
            document.body.oncontextmenu = function () {
                return false;
            };
        }
        this.checkAssessmentStatus().then(
            function () {
                this.renderTimedAssess();
            }.bind(this),
        );
    }

    getNewChildren() {
        this.newChildren = [];
        let runestoneChildren = this.origElem.querySelectorAll(".runestone");
        for (var i = 0; i < runestoneChildren.length; i++) {
            this.newChildren.push(runestoneChildren[i]);
        }
    }

    async checkAssessmentStatus() {
        // Has the user taken this exam?  Inquiring minds want to know
        // If a user has not taken this exam then we want to make sure
        // that if a question has been seen by the student before we do
        // not populate previous answers.
        let sendInfo = {
            div_id: this.divid,
            course_name: eBookConfig.course,
        };
        console.log(sendInfo);
        if (eBookConfig.useRunestoneServices) {
            let request = new Request(
                `${eBookConfig.new_server_prefix}/assessment/tookTimedAssessment`,
                {
                    method: "POST",
                    headers: this.jsonHeaders,
                    body: JSON.stringify(sendInfo),
                },
            );
            let response = await fetch(request);
            let data = await response.json();
            data = data.detail;
            this.taken = data.tookAssessment;
            this.assessmentTaken = this.taken;
            if (!this.taken) {
                localStorage.clear();
            }
            console.log("done with check status");
            return response;
        } else {
            this.taken = false;
            this.assessmentTaken = false;
            return Promise.resolve();
        }
    }

    /*===============================
    === Generating new Timed HTML ===
    ===============================*/
    async renderTimedAssess() {
        console.log("rendering timed ");
        // create renderedQuestionArray returns a promise
        //
        this.createRenderedQuestionArray();
        if (this.random) {
            this.randomizeRQA();
        }
        this.renderContainer();
        this.renderTimer();
        await this.renderControlButtons();
        // If we decide to disable cut/copy/paste, uncomment the line below
        // this.disableCutCopyPaste();
        this.containerDiv.appendChild(this.timedDiv); // This can't be appended in renderContainer because then it renders above the timer and control buttons.
        if (this.renderedQuestionArray.length > 1) this.renderNavControls();
        this.renderSubmitButton();
        this.renderFeedbackContainer();
        this.useRunestoneServices = eBookConfig.useRunestoneServices;
        // Replace intermediate HTML with rendered HTML
        this.origElem.replaceWith(this.containerDiv);
        // check if already taken and if so show results
        this.styleExamElements(); // rename to renderPossibleResults
        this.checkServer("timedExam", true);
    }

    disableCutCopyPaste() {
        document.addEventListener("cut", function (e) {
            e.preventDefault();
        });
        document.addEventListener("copy", function (e) {
            e.preventDefault();
        });
        document.addEventListener("paste", function (e) {
            e.preventDefault();
        });
    }

    renderContainer() {
        this.containerDiv = document.createElement("div"); // container for the entire Timed Component
        if (this.fullwidth) {
            // allow the container to fill the width - barb
            this.containerDiv.classList.add("timed-container-fullwidth");
        }
        this.containerDiv.classList.add("runestone-sphinx");
        this.containerDiv.id = this.divid;
        this.timedDiv = document.createElement("div"); // div that will hold the questions for the timed assessment
        this.navDiv = document.createElement("div"); // For navigation control
        this.navDiv.classList.add("timed-center");
        this.flagDiv = document.createElement("div"); // div that will hold the "Flag Question" button
        this.flagDiv.classList.add("timed-center");
        this.switchContainer = document.createElement("div");
        this.switchContainer.classList.add("switchcontainer");
        this.switchContainer.classList.add("ptx-runestone-container");
        this.switchDiv = document.createElement("div"); // is replaced by the questions
        this.timedDiv.appendChild(this.navDiv);
        this.timedDiv.appendChild(this.flagDiv); // add flagDiv to timedDiv, which holds components for navigation and questions for timed assessment
        this.timedDiv.appendChild(this.switchContainer);
        this.switchContainer.appendChild(this.switchDiv);
        this.timedDiv.id = "timed_Test";
        this.timedDiv.classList.add("timed-hidden");
    }

    renderTimer() {
        this.wrapperDiv = document.createElement("div");
        this.timerContainer = document.createElement("P");
        this.wrapperDiv.id = this.divid + "-startWrapper";
        this.timerContainer.id = this.divid + "-output";
        this.wrapperDiv.appendChild(this.timerContainer);
        this.showTime();
    }

    renderControlButtons() {
        this.controlDiv = document.createElement("div");
        this.controlDiv.id = "controls";
        this.controlDiv.classList.add("timed-center");
        this.startBtn = document.createElement("button");
        this.pauseBtn = document.createElement("button");
        this.startBtn.setAttribute("class", "btn btn-success");
        this.startBtn.id = "start";
        this.startBtn.tabIndex = 0;
        this.startBtn.setAttribute("role", "button");
        this.startBtn.textContent = "Start";
        this.startBtn.addEventListener(
            "click",
            async function () {
                // check for a studyClues button and hide it if it exists
                let scb = document.getElementById("studyclues-fab");
                if (scb) {
                    scb.style.display = "none";
                }
                this.finishButton.classList.add("timed-hidden"); // hide the finish button for now
                if (this.flagButton) {
                    this.flagButton.classList.remove("timed-hidden");
                }
                let mess = document.createElement("p");
                mess.innerHTML =
                    "<strong>Warning: You will not be able to continue the exam if you close this tab, close the window, or navigate away from this page!</strong>  Make sure you click the Finish Exam button when you are done to submit your work!";
                this.controlDiv.appendChild(mess);
                mess.classList.add("examwarning");
                await this.renderTimedQuestion();
                this.startAssessment();
            }.bind(this),
            false,
        );
        this.pauseBtn.setAttribute("class", "btn btn-default");
        this.pauseBtn.id = "pause";
        this.pauseBtn.disabled = true;
        this.pauseBtn.tabIndex = 0;
        this.pauseBtn.setAttribute("role", "button");
        this.pauseBtn.textContent = "Pause";
        this.pauseBtn.addEventListener(
            "click",
            function () {
                this.pauseAssessment();
            }.bind(this),
            false,
        );
        if (!this.taken) {
            this.controlDiv.appendChild(this.startBtn);
        }
        if (!this.nopause) {
            this.controlDiv.appendChild(this.pauseBtn);
        }
        this.containerDiv.appendChild(this.wrapperDiv);
        this.containerDiv.appendChild(this.controlDiv);
    }

    renderNavControls() {
        // making "Prev" button
        this.pagNavList = document.createElement("ul");
        this.pagNavList.classList.add("pagination");
        this.leftContainer = document.createElement("li");
        this.leftNavButton = document.createElement("button");
        this.leftNavButton.innerHTML = "&#8249; Prev";
        this.leftNavButton.setAttribute("aria-label", "Previous");
        this.leftNavButton.tabIndex = 0;
        this.leftNavButton.setAttribute("role", "button");
        this.leftNavButton.classList.add("timed-cursor-pointer");
        this.leftContainer.appendChild(this.leftNavButton);
        this.pagNavList.appendChild(this.leftContainer);
        // making "Flag Question" button
        this.flaggingPlace = document.createElement("ul");
        this.flaggingPlace.classList.add("pagination");
        this.flagContainer = document.createElement("li");
        this.flagButton = document.createElement("button");
        this.flagButton.classList.add("flagBtn");
        this.flagButton.innerHTML = "Flag Question"; // name on button
        this.flagButton.setAttribute("aria-labelledby", "Flag");
        this.flagButton.tabIndex = 5;
        this.flagButton.setAttribute("role", "button");
        this.flagButton.id = "flag";
        this.flagButton.classList.add("timed-cursor-pointer");
        this.flagContainer.appendChild(this.flagButton); // adding button to container
        this.flaggingPlace.appendChild(this.flagContainer); // adding container to flaggingPlace
        // making "Next" button
        this.rightContainer = document.createElement("li");
        this.rightNavButton = document.createElement("button");
        this.rightNavButton.setAttribute("aria-label", "Next");
        this.rightNavButton.tabIndex = 0;
        this.rightNavButton.setAttribute("role", "button");
        this.rightNavButton.id = "next";
        this.rightNavButton.innerHTML = "Next &#8250;";
        this.rightNavButton.classList.add("timed-cursor-pointer");
        this.rightContainer.appendChild(this.rightNavButton);
        this.pagNavList.appendChild(this.rightContainer);
        this.ensureButtonSafety();
        this.navDiv.appendChild(this.pagNavList);
        this.flagDiv.appendChild(this.flaggingPlace); // adds flaggingPlace to the flagDiv
        this.break = document.createElement("br");
        this.navDiv.appendChild(this.break);
        // render the question number jump buttons
        this.qNumList = document.createElement("ul");
        this.qNumList.id = "pageNums";
        this.qNumWrapperList = document.createElement("ul");
        this.qNumWrapperList.classList.add("pagination");
        var tmpLi, tmpA;
        for (var i = 0; i < this.renderedQuestionArray.length; i++) {
            tmpLi = document.createElement("li");
            tmpA = document.createElement("a");
            tmpA.innerHTML = i + 1;
            tmpA.classList.add("timed-cursor-pointer");
            if (i === 0) {
                tmpLi.classList.add("active");
            }
            tmpLi.appendChild(tmpA);
            this.qNumWrapperList.appendChild(tmpLi);
        }
        this.qNumList.appendChild(this.qNumWrapperList);
        this.navDiv.appendChild(this.qNumList);
        this.navBtnListeners();
        this.flagBtnListener(); // listens for click on flag button
        this.flagButton.classList.add("timed-hidden");
    }

    // The li for question number `index` in the numbered navigation strip.
    qNumItem(index) {
        return document.querySelectorAll("ul#pageNums > ul > li")[index];
    }

    // when moving off of a question in an active exam:
    // 1. show that the question has been seen, or mark it broken if it is in error.
    // 2. check and log the current answer
    async navigateAway() {
        if (
            this.renderedQuestionArray[this.currentQuestionIndex].state ==
            "broken_exam"
        ) {
            this.qNumItem(this.currentQuestionIndex)?.classList.add("broken");
        }
        if (
            this.renderedQuestionArray[this.currentQuestionIndex].state ==
            "exam_ended"
        ) {
            this.qNumItem(this.currentQuestionIndex)?.classList.add("toolate");
        }
        if (
            this.renderedQuestionArray[this.currentQuestionIndex].question
                .isAnswered
        ) {
            this.qNumItem(this.currentQuestionIndex)?.classList.add(
                "answered",
            );
            await this.renderedQuestionArray[
                this.currentQuestionIndex
            ].question.checkCurrentAnswer();
            if (!this.done) {
                await this.renderedQuestionArray[
                    this.currentQuestionIndex
                ].question.logCurrentAnswer();
            }
        }
    }
    async handleNextPrev(event) {
        if (!this.taken) {
            await this.navigateAway();
        }
        var target = event.target.textContent;
        if (target.match(/Next/)) {
            // checks given text to match "Next"
            if (this.rightContainer.classList.contains("disabled")) {
                return;
            }
            this.currentQuestionIndex++;
        } else if (target.match(/Prev/)) {
            // checks given text to match "Prev"
            if (this.leftContainer.classList.contains("disabled")) {
                return;
            }
            this.currentQuestionIndex--;
        }
        await this.renderTimedQuestion();
        this.ensureButtonSafety();
        for (var i = 0; i < this.qNumList.childNodes.length; i++) {
            for (
                var j = 0;
                j < this.qNumList.childNodes[i].childNodes.length;
                j++
            ) {
                this.qNumList.childNodes[i].childNodes[j].classList.remove(
                    "active",
                );
            }
        }
        let currentItem = this.qNumItem(this.currentQuestionIndex);
        currentItem?.classList.add("active");
        if (currentItem?.classList.contains("flagcolor")) {
            // checking for class
            this.flagButton.innerHTML = "Unflag Question"; // changes text on button
        } else {
            this.flagButton.innerHTML = "Flag Question"; // changes text on button
        }
    }

    async handleFlag(event) {
        // called when flag button is clicked
        var target = event.target.textContent;
        if (target.match(/Flag Question/)) {
            // class will change color of question block
            this.qNumItem(this.currentQuestionIndex)?.classList.add(
                "flagcolor",
            );
            this.flagButton.innerHTML = "Unflag Question";
        } else {
            // will restore current color of question block
            this.qNumItem(this.currentQuestionIndex)?.classList.remove(
                "flagcolor",
            );
            this.flagButton.innerHTML = "Flag Question"; // also sets name back
        }
    }

    async handleNumberedNav(event) {
        if (!this.taken) {
            await this.navigateAway();
        }
        for (var i = 0; i < this.qNumList.childNodes.length; i++) {
            for (
                var j = 0;
                j < this.qNumList.childNodes[i].childNodes.length;
                j++
            ) {
                this.qNumList.childNodes[i].childNodes[j].classList.remove(
                    "active",
                );
            }
        }

        var target = event.target.textContent;
        let oldIndex = this.currentQuestionIndex;
        this.currentQuestionIndex = parseInt(target) - 1;
        if (this.currentQuestionIndex > this.renderedQuestionArray.length) {
            console.log(`Error: bad index for ${target}`);
            this.currentQuestionIndex = oldIndex;
        }
        let currentItem = this.qNumItem(this.currentQuestionIndex);
        currentItem?.classList.add("active");
        if (currentItem?.classList.contains("flagcolor")) {
            this.flagButton.innerHTML = "Unflag Question";
        } else {
            this.flagButton.innerHTML = "Flag Question";
        }
        await this.renderTimedQuestion();
        this.ensureButtonSafety();
    }

    // set up events for navigation
    navBtnListeners() {
        // Next and Prev Listener
        this.pagNavList.addEventListener(
            "click",
            this.handleNextPrev.bind(this),
            false,
        );

        // Numbered Listener
        this.qNumList.addEventListener(
            "click",
            this.handleNumberedNav.bind(this),
            false,
        );
    }

    // set up event for flag
    flagBtnListener() {
        this.flaggingPlace.addEventListener(
            "click",
            this.handleFlag.bind(this), // calls this to take action
            false,
        );
    }

    renderSubmitButton() {
        this.buttonContainer = document.createElement("div");
        this.buttonContainer.classList.add("timed-center");
        this.finishButton = document.createElement("button");
        this.finishButton.id = "finish";
        this.finishButton.setAttribute("class", "btn btn-primary");
        this.finishButton.textContent = "Finish Exam";
        this.finishButton.addEventListener(
            "click",
            async function () {
                let skipped = this.renderedQuestionArray.filter(
                    (x) => !x.question.isAnswered,
                ).length;
                let skipstr =
                    skipped > 0
                        ? `You have skipped ${skipped} question(s).`
                        : "";
                if (
                    window.confirm(
                        `${skipstr} Clicking OK means you are ready to submit your answers and are finished with this assessment.`,
                    )
                ) {
                    await this.finishAssessment();
                    this.flagButton.classList.add("timed-hidden");
                }
            }.bind(this),
            false,
        );
        this.controlDiv.appendChild(this.finishButton);
        this.finishButton.classList.add("timed-hidden");
        this.timedDiv.appendChild(this.buttonContainer);
    }
    ensureButtonSafety() {
        if (this.currentQuestionIndex === 0) {
            if (this.renderedQuestionArray.length != 1) {
                this.rightContainer.classList.remove("disabled");
            }
            this.leftContainer.classList.add("disabled");
        }
        if (
            this.currentQuestionIndex >=
            this.renderedQuestionArray.length - 1
        ) {
            if (this.renderedQuestionArray.length != 1) {
                this.leftContainer.classList.remove("disabled");
            }
            this.rightContainer.classList.add("disabled");
        }
        if (
            this.currentQuestionIndex > 0 &&
            this.currentQuestionIndex < this.renderedQuestionArray.length - 1
        ) {
            this.rightContainer.classList.remove("disabled");
            this.leftContainer.classList.remove("disabled");
        }
    }
    renderFeedbackContainer() {
        this.scoreDiv = document.createElement("P");
        if (this.taken) {
            this.scoreDiv.innerHTML =
                "<h2>You have already taken this exam</h2>";
            this.scoreDiv.classList.add("timed-visible");
        } else {
            this.scoreDiv.id = this.divid + "results";
            this.scoreDiv.classList.add("timed-hidden");
        }
        this.containerDiv.appendChild(this.scoreDiv);
    }

    createRenderedQuestionArray() {
        // this finds all the assess questions in this timed assessment
        // We need to make a list of all the questions up front so we can set up navigation
        // but we do not want to render the questions until the student has navigated
        // Also adds them to this.renderedQuestionArray

        // todo:  This needs to be updated to account for the runestone div wrapper.

        // To accommodate the selectquestion type -- which is async! we need to wrap
        // all of this in a promise, so that we don't continue to render the timed
        // exam until all of the questions have been realized.
        var opts;
        for (var i = 0; i < this.newChildren.length; i++) {
            var tmpChild = this.newChildren[i];
            opts = {
                state: "prepared",
                orig: tmpChild,
                question: {},
                useRunestoneServices: eBookConfig.useRunestoneServices,
                timed: true,
                assessmentTaken: this.taken,
                timedWrapper: this.divid,
                initAttempts: 0,
            };
            let componentChild = tmpChild.querySelector(
                ":scope > [data-component]",
            );
            if (componentChild) {
                tmpChild = componentChild;
                opts.orig = tmpChild;
            }
            if (tmpChild.matches("[data-component]")) {
                this.renderedQuestionArray.push(opts);
            }
        }
    }

    randomizeRQA() {
        var currentIndex = this.renderedQuestionArray.length,
            temporaryValue,
            randomIndex;
        // While there remain elements to shuffle...
        while (currentIndex !== 0) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            // And swap it with the current element.
            temporaryValue = this.renderedQuestionArray[currentIndex];
            this.renderedQuestionArray[currentIndex] =
                this.renderedQuestionArray[randomIndex];
            this.renderedQuestionArray[randomIndex] = temporaryValue;
        }
    }

    async renderTimedQuestion() {
        if (this.currentQuestionIndex >= this.renderedQuestionArray.length) {
            // sometimes the user clicks in the event area for the qNumList
            // But misses a number in that case the text is the concatenation
            // of all the numbers in the list!
            return;
        }
        // check the renderedQuestionArray to see if it has been rendered.
        let opts = this.renderedQuestionArray[this.currentQuestionIndex];
        let currentQuestion;
        if (
            opts.state === "prepared" ||
            opts.state === "forreview" ||
            (opts.state === "broken_exam" && opts.initAttempts < 3)
        ) {
            let tmpChild = opts.orig;
            if (tmpChild && tmpChild.matches("[data-component=selectquestion]")) {
                if (this.done && opts.state == "prepared") {
                    this.renderedQuestionArray[
                        this.currentQuestionIndex
                    ].state = "exam_ended";
                } else {
                    // SelectOne is async and will replace itself in this array with
                    // the actual selected question
                    opts.rqa = this.renderedQuestionArray;
                    let newq = new _selectquestion_js_selectone__WEBPACK_IMPORTED_MODULE_9__["default"](opts);
                    this.renderedQuestionArray[this.currentQuestionIndex] = {
                        question: newq,
                    };
                    try {
                        await newq.initialize();
                        if (opts.state == "broken_exam") {
                            // remove the broken class from this question if we get here.
                            this.qNumItem(
                                this.currentQuestionIndex,
                            )?.classList.remove("broken");
                        }
                    } catch (e) {
                        opts.state = "broken_exam";
                        this.renderedQuestionArray[this.currentQuestionIndex] =
                            opts;
                        console.log(
                            `Error initializing question: Details ${e}`,
                        );
                    }
                }
            } else if (tmpChild && tmpChild.matches("[data-component]")) {
                let componentKind = tmpChild.dataset.component;
                this.renderedQuestionArray[this.currentQuestionIndex] = {
                    question: window.component_factory[componentKind](opts),
                    state: opts.state,
                };
            }
        } else if (opts.state === "broken_exam") {
            return;
        }

        currentQuestion =
            this.renderedQuestionArray[this.currentQuestionIndex].question;
        if (opts.state === "forreview") {
            await currentQuestion.component_ready_promise;
            await currentQuestion.checkCurrentAnswer();
            currentQuestion.renderFeedback();
            currentQuestion.disableInteraction();
        }

        if (!this.visited.includes(this.currentQuestionIndex)) {
            this.visited.push(this.currentQuestionIndex);
            if (
                this.visited.length === this.renderedQuestionArray.length &&
                !this.done
            ) {
                this.finishButton.classList.remove("timed-hidden");
            }
        }

        if (currentQuestion.containerDiv) {
            if (
                currentQuestion.containerDiv.classList.contains("runestone") ==
                false
            ) {
                currentQuestion.containerDiv.classList.add("runestone");
            }
            this.switchDiv.replaceWith(currentQuestion.containerDiv);
            this.switchDiv = currentQuestion.containerDiv;
        }

        // If the timed component has listeners, those might need to be reinitialized
        // This flag will only be set in the elements that need it--it will be undefined in the others and thus evaluate to false
        if (currentQuestion.needsReinitialization) {
            currentQuestion.reinitializeListeners(this.taken);
        }
    }

    /*=================================
    === Timer and control Functions ===
    =================================*/
    handlePrevAssessment() {
        this.startBtn.classList.add("timed-hidden");
        this.pauseBtn.disabled = true;
        this.finishButton.disabled = true;
        this.running = 0;
        this.done = 1;
        // showFeedback sand showResults should both be true before we show the
        // questions and their state of correctness.
        if (this.showResults && this.showFeedback) {
            this.timedDiv.classList.remove("timed-hidden");
            this.restoreAnsweredQuestions(); // do not log these results
        } else {
            this.pauseBtn.classList.add("timed-hidden");
            this.timerContainer.classList.add("timed-hidden");
        }
    }
    startAssessment() {
        if (!this.taken) {
            hideElement(document.getElementById("relations-next")); // hide the next page button for now
            hideElement(document.getElementById("relations-prev")); // hide the previous button for now
            this.startBtn.classList.add("timed-hidden");
            this.pauseBtn.disabled = false;
            if (this.running === 0 && this.paused === 0) {
                this.running = 1;
                this.lastTime = Date.now();
                this.timedDiv.classList.remove("timed-hidden");
                this.increment();
                this.logBookEvent({
                    event: "timedExam",
                    act: "start",
                    div_id: this.divid,
                });
                var timeStamp = new Date();
                var storageObj = {
                    answer: [0, 0, this.renderedQuestionArray.length, 0],
                    timestamp: timeStamp,
                };
                localStorage.setItem(
                    this.localStorageKey(),
                    JSON.stringify(storageObj),
                );
            }
            this.beforeUnloadHandler = function (event) {
                // this actual value gets ignored by newer browsers
                if (this.done) {
                    return;
                }
                event.preventDefault();
                event.returnValue =
                    "Are you sure you want to leave?  Your work will be lost! And you will need your instructor to reset the exam!";
                return "Are you sure you want to leave?  Your work will be lost!";
            }.bind(this);
            window.addEventListener("beforeunload", this.beforeUnloadHandler);
            window.addEventListener(
                "pagehide",
                async function (event) {
                    if (!this.done) {
                        await this.finishAssessment();
                        console.log("Exam exited by leaving page");
                    }
                }.bind(this),
            );
        } else {
            this.handlePrevAssessment();
        }
    }
    pauseAssessment() {
        if (this.done === 0) {
            if (this.running === 1) {
                this.logBookEvent({
                    event: "timedExam",
                    act: "pause",
                    div_id: this.divid,
                });
                this.running = 0;
                this.paused = 1;
                this.pauseBtn.innerHTML = "Resume";
                this.timedDiv.classList.add("timed-hidden");
            } else {
                this.logBookEvent({
                    event: "timedExam",
                    act: "resume",
                    div_id: this.divid,
                });
                this.running = 1;
                this.paused = 0;
                this.increment();
                this.pauseBtn.innerHTML = "Pause";
                this.timedDiv.classList.remove("timed-hidden");
            }
        }
    }

    showTime() {
        if (this.showTimer) {
            var mins = Math.floor(this.timeLimit / 60);
            var secs = Math.floor(this.timeLimit) % 60;
            var minsString = mins;
            var secsString = secs;
            if (mins < 10) {
                minsString = "0" + mins;
            }
            if (secs < 10) {
                secsString = "0" + secs;
            }
            var beginning = "Time Remaining    ";
            if (!this.limitedTime) {
                beginning = "Time Taken    ";
            }
            var timeString = beginning + minsString + ":" + secsString;
            if (this.done || this.taken) {
                var minutes = Math.floor(this.timeTaken / 60);
                var seconds = Math.floor(this.timeTaken % 60);
                if (minutes < 10) {
                    minutes = "0" + minutes;
                }
                if (seconds < 10) {
                    seconds = "0" + seconds;
                }
                timeString = "Time taken: " + minutes + ":" + seconds;
            }
            this.timerContainer.innerHTML = timeString;
            var timeTips = document.getElementsByClassName("timeTip");
            for (var i = 0; i <= timeTips.length - 1; i++) {
                timeTips[i].title = timeString;
            }
        } else {
            this.timerContainer.classList.add("timed-hidden");
        }
    }

    increment() {
        // if running (not paused) and not taken
        if (this.running === 1 && !this.taken) {
            setTimeout(
                function () {
                    // When a browser loses focus, setTimeout may not be called on the
                    // schedule expected.  Browsers are free to save power by lengthening
                    // the interval to some longer time.  So we cannot just subtract 1
                    // from the timeLimit we need to measure the elapsed time from the last
                    // call to the current call and subtract that number of seconds.
                    let currentTime = Date.now();
                    if (this.limitedTime) {
                        // If there's a time limit, count down to 0
                        this.timeLimit =
                            this.timeLimit -
                            Math.floor((currentTime - this.lastTime) / 1000);
                    } else {
                        // Else count up to keep track of how long it took to complete
                        this.timeLimit =
                            this.timeLimit +
                            Math.floor((currentTime - this.lastTime) / 1000);
                    }
                    this.lastTime = currentTime;
                    localStorage.setItem(
                        eBookConfig.email + ":" + this.divid + "-time",
                        this.timeLimit,
                    );
                    this.showTime();
                    if (this.timeLimit > 0) {
                        this.increment();
                        // ran out of time
                    } else {
                        this.startBtn.disabled = true;
                        this.finishButton.disabled = true;
                        this.running = 0;
                        this.done = 1;
                        if (!this.taken) {
                            this.taken = true;
                            // embed the message in the page -- an alert actually prevents
                            // the answers from being submitted and if a student closes their
                            // laptop then the answers will not be submitted ever!  Even when they
                            // reopen the laptop their session cookie is likely invalid.
                            let mess = document.createElement("h1");
                            mess.innerHTML =
                                "Sorry but you ran out of time. Your answers are being submitted";
                            this.controlDiv.appendChild(mess);
                            this.finishAssessment();
                        }
                    }
                }.bind(this),
                1000,
            );
        }
    }

    styleExamElements() {
        // Checks if this exam has been taken before
        this.timerContainer.classList.add("timed-summary-style");
        this.scoreDiv.classList.add("timed-summary-style");
        for (const tip of document.querySelectorAll(".tooltipTime")) {
            tip.classList.add("timed-tooltip-time");
        }
    }

    async finishAssessment() {
        showElement(document.getElementById("relations-next")); // show the next page button for now
        showElement(document.getElementById("relations-prev")); // show the previous button for now
        if (!this.showFeedback) {
            // bje - changed from showResults
            this.timedDiv.classList.add("timed-hidden");
            this.pauseBtn.classList.add("timed-hidden");
            this.timerContainer.classList.add("timed-hidden");
        }
        this.findTimeTaken();
        this.running = 0;
        this.done = 1;
        this.taken = 1;
        await this.finalizeProblems();
        this.checkScore();
        this.displayScore();
        this.storeScore();
        this.logScore();
        this.pauseBtn.disabled = true;
        this.finishButton.disabled = true;
        if (this.beforeUnloadHandler) {
            window.removeEventListener(
                "beforeunload",
                this.beforeUnloadHandler,
            );
        }
        // turn off the pagehide listener
        setTimeout(() => {
            this.submitAutograde();
        }, 2000);
    }

    async submitAutograde() {
        try {
            let response = await fetch("/assignment/student/autograde", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    assignment_id: this.divid,
                    is_timed: true,
                }),
            });
            let retdata = await response.json();
            if (retdata.success == false) {
                console.log(retdata.message);
            } else {
                console.log("Autograder completed");
            }
        } catch (err) {
            console.log(`Error submitting exam for autograding: ${err}`);
        }
    }

    // finalizeProblems
    // ----------------
    async finalizeProblems() {
        // Because we have submitted each question as we navigate we only need to
        // send the final version of the question the student is on when they press the
        // finish exam button.

        var currentQuestion =
            this.renderedQuestionArray[this.currentQuestionIndex].question;
        await currentQuestion.checkCurrentAnswer();
        await currentQuestion.logCurrentAnswer();
        currentQuestion.renderFeedback();
        currentQuestion.disableInteraction();

        for (var i = 0; i < this.renderedQuestionArray.length; i++) {
            let currentQuestion = this.renderedQuestionArray[i];
            // set the state to forreview so we know that feedback may be appropriate
            if (currentQuestion.state !== "broken_exam") {
                currentQuestion.state = "forreview";
                currentQuestion.question.disableInteraction();
            }
        }

        if (!this.showFeedback) {
            this.hideTimedFeedback();
        }
    }

    // restoreAnsweredQuestions
    // ------------------------
    restoreAnsweredQuestions() {
        for (var i = 0; i < this.renderedQuestionArray.length; i++) {
            var currentQuestion = this.renderedQuestionArray[i];
            if (currentQuestion.state === "prepared") {
                currentQuestion.state = "forreview";
            }
        }
    }

    // hideTimedFeedback
    // -----------------
    hideTimedFeedback() {
        for (var i = 0; i < this.renderedQuestionArray.length; i++) {
            var currentQuestion = this.renderedQuestionArray[i].question;
            currentQuestion.hideFeedback();
        }
    }

    // checkScore
    // ----------
    // This is a simple all or nothing score of one point per question for
    // that includes our best guess if a question was skipped.
    checkScore() {
        this.correctStr = "";
        this.skippedStr = "";
        this.incorrectStr = "";
        // Gets the score of each problem
        for (var i = 0; i < this.renderedQuestionArray.length; i++) {
            var correct =
                this.renderedQuestionArray[i].question.checkCorrectTimed();
            if (correct == "T") {
                this.score++;
                this.correctStr = this.correctStr + (i + 1) + ", ";
            } else if (correct == "F") {
                this.incorrect++;
                this.incorrectStr = this.incorrectStr + (i + 1) + ", ";
            } else if (correct === null || correct === "I") {
                this.skipped++;
                this.skippedStr = this.skippedStr + (i + 1) + ", ";
            } else {
                // ignored question; just do nothing
            }
        }
        // remove extra comma and space at end if any
        if (this.correctStr.length > 0)
            this.correctStr = this.correctStr.substring(
                0,
                this.correctStr.length - 2,
            );
        else this.correctStr = "None";
        if (this.skippedStr.length > 0)
            this.skippedStr = this.skippedStr.substring(
                0,
                this.skippedStr.length - 2,
            );
        else this.skippedStr = "None";
        if (this.incorrectStr.length > 0)
            this.incorrectStr = this.incorrectStr.substring(
                0,
                this.incorrectStr.length - 2,
            );
        else this.incorrectStr = "None";
    }
    findTimeTaken() {
        if (this.limitedTime) {
            this.timeTaken = this.startingTime - this.timeLimit;
        } else {
            this.timeTaken = this.timeLimit;
        }
    }
    storeScore() {
        var storage_arr = [];
        storage_arr.push(
            this.score,
            this.correctStr,
            this.incorrect,
            this.incorrectStr,
            this.skipped,
            this.skippedStr,
            this.timeTaken,
        );
        var timeStamp = new Date();
        var storageObj = JSON.stringify({
            answer: storage_arr,
            timestamp: timeStamp,
        });
        localStorage.setItem(this.localStorageKey(), storageObj);
    }
    // _`timed exam endpoint parameters`
    //----------------------------------
    logScore() {
        this.logBookEvent({
            event: "timedExam",
            act: "finish",
            div_id: this.divid,
            correct: this.score,
            incorrect: this.incorrect,
            skipped: this.skipped,
            time_taken: this.timeTaken,
        });
    }
    shouldUseServer(data) {
        // We override the RunestoneBase version because there is no "correct" attribute, and there are 2 possible localStorage schemas
        // --we also want to default to local storage because it contains more information specifically which questions are correct, incorrect, and skipped.
        var storageDate;
        if (localStorage.length === 0) return true;
        var storageObj = localStorage.getItem(this.localStorageKey());
        if (storageObj === null) return true;
        try {
            var storedData = JSON.parse(storageObj).answer;
            if (storedData.length == 4) {
                if (
                    data.correct == storedData[0] &&
                    data.incorrect == storedData[1] &&
                    data.skipped == storedData[2] &&
                    data.timeTaken == storedData[3]
                )
                    return true;
            } else if (storedData.length == 7) {
                if (
                    data.correct == storedData[0] &&
                    data.incorrect == storedData[2] &&
                    data.skipped == storedData[4] &&
                    data.timeTaken == storedData[6]
                ) {
                    return false; // In this case, because local storage has more info, we want to use that if it's consistent
                }
            }
            storageDate = new Date(JSON.parse(storageObj[1]).timestamp);
        } catch (err) {
            // error while parsing; likely due to bad value stored in storage
            console.log(err.message);
            localStorage.removeItem(this.localStorageKey());
            return true;
        }
        var serverDate = new Date(data.timestamp);
        if (serverDate < storageDate) {
            this.logScore();
            return false;
        }
        return true;
    }

    checkLocalStorage() {
        var len = localStorage.length;
        if (len > 0) {
            if (localStorage.getItem(this.localStorageKey()) !== null) {
                this.taken = 1;
                this.restoreAnswers("");
            } else {
                this.taken = 0;
            }
        } else {
            this.taken = 0;
        }
    }
    async restoreAnswers(data) {
        this.taken = 1;
        var tmpArr;
        if (data === "") {
            let error = false;
            let storageObj;
            try {
                storageObj = JSON.parse(
                    localStorage.getItem(this.localStorageKey()),
                );
                tmpArr = storageObj.answer;
            } catch (err) {
                // error while parsing; likely due to bad value stored in storage
                console.log(
                    `Error parsing stored Timed data for ${this.divid}: ${err.message}`,
                );
                error = true;
            }
            if (error || storageObj.timestamp < eBookConfig.termStartDate) {
                localStorage.removeItem(this.localStorageKey());
                this.taken = 0;
                return;
            }
        } else {
            // Parse results from the database
            tmpArr = [
                parseInt(data.correct),
                parseInt(data.incorrect),
                parseInt(data.skipped),
                parseInt(data.time_taken),
                data.reset,
            ];
            this.setLocalStorage(tmpArr);
        }
        if (tmpArr.length == 1) {
            // Exam was previously reset
            this.reset = true;
            this.taken = 0;
            return;
        }
        if (tmpArr.length == 4) {
            // Accidental Reload OR Database Entry
            this.score = tmpArr[0];
            this.incorrect = tmpArr[1];
            this.skipped = tmpArr[2];
            this.timeTaken = tmpArr[3];
        } else if (tmpArr.length == 5) {
            this.score = tmpArr[0];
            this.incorrect = tmpArr[1];
            this.skipped = tmpArr[2];
            this.timeTaken = tmpArr[3];
        } else if (tmpArr.length == 7) {
            // Loaded Completed Exam
            this.score = tmpArr[0];
            this.correctStr = tmpArr[1];
            this.incorrect = tmpArr[2];
            this.incorrectStr = tmpArr[3];
            this.skipped = tmpArr[4];
            this.skippedStr = tmpArr[5];
            this.timeTaken = tmpArr[6];
        } else {
            // Set localStorage in case of "accidental" reload
            this.score = 0;
            this.incorrect = 0;
            this.skipped = this.renderedQuestionArray.length;
            this.timeTaken = 0;
        }
        if (this.taken) {
            if (this.skipped === this.renderedQuestionArray.length) {
                this.showFeedback = false;
            }
            this.handlePrevAssessment();
        }
        await this.renderTimedQuestion();
        this.displayScore();
        this.showTime();
    }
    setLocalStorage(parsedData) {
        var timeStamp = new Date();
        var storageObj = {
            answer: parsedData,
            timestamp: timeStamp,
        };
        localStorage.setItem(
            this.localStorageKey(),
            JSON.stringify(storageObj),
        );
    }
    displayScore() {
        // Reveal the score, clearing the initial hidden state so the element
        // isn't left with both timed-hidden and timed-visible (which only
        // works by CSS source order).
        this.scoreDiv.classList.remove("timed-hidden");
        if (this.showResults) {
            var scoreString = "";
            var numQuestions;
            var percentCorrect;
            // if we have some information
            if (
                this.correctStr.length > 0 ||
                this.incorrectStr.length > 0 ||
                this.skippedStr.length > 0
            ) {
                scoreString = `Num Correct: ${this.score}. Questions: ${this.correctStr}<br>Num Wrong: ${this.incorrect}. Questions: ${this.incorrectStr}<br>Num Skipped: ${this.skipped}. Questions: ${this.skippedStr}<br>`;
                numQuestions = this.score + this.incorrect + this.skipped;
                percentCorrect = (this.score / numQuestions) * 100;
                scoreString +=
                    "Percent Correct: " + percentCorrect.toFixed(2) + "%";
                this.scoreDiv.innerHTML = scoreString;
                this.scoreDiv.classList.add("timed-visible");
            } else {
                scoreString = `Num Correct: ${this.score}<br>Num Wrong: ${this.incorrect}<br>Num Skipped: ${this.skipped}<br>`;
                numQuestions = this.score + this.incorrect + this.skipped;
                percentCorrect = (this.score / numQuestions) * 100;
                scoreString +=
                    "Percent Correct: " + percentCorrect.toFixed(2) + "%";
                this.scoreDiv.innerHTML = scoreString;
                this.scoreDiv.classList.add("timed-visible");
            }
            this.highlightNumberedList();
        } else {
            this.scoreDiv.innerHTML =
                "Thank you for taking the exam.  Your answers have been recorded.";
            this.scoreDiv.classList.add("timed-visible");
        }
    }
    highlightNumberedList() {
        var correctCount = this.correctStr;
        var incorrectCount = this.incorrectStr;
        var skippedCount = this.skippedStr;
        correctCount = correctCount.replace(/ /g, "").split(",");
        incorrectCount = incorrectCount.replace(/ /g, "").split(",");
        skippedCount = skippedCount.replace(/ /g, "").split(",");
        var numberedBtns = document.querySelectorAll("ul#pageNums > ul > li");
        for (const btn of numberedBtns) {
            btn.classList.remove("answered");
        }
        // entries may be "None", whose index parses to NaN and marks nothing
        const mark = (entries, cls) => {
            for (const entry of entries) {
                const btn = numberedBtns[parseInt(entry) - 1];
                if (btn) {
                    btn.classList.add(cls);
                }
            }
        };
        mark(correctCount, "correctCount");
        mark(incorrectCount, "incorrectCount");
        mark(skippedCount, "skippedCount");
    }
}

// Page-level elements that may not exist on every page.
function hideElement(element) {
    if (element) {
        element.classList.add("timed-hidden");
    }
}

function showElement(element) {
    if (element) {
        element.classList.remove("timed-hidden");
    }
}

/*=======================================================
=== Function that calls the constructors on page load ===
=======================================================*/
document.addEventListener("runestone:login-complete", function () {
    for (let element of document.querySelectorAll(
        "[data-component=timedAssessment]",
    )) {
        window.componentMap[element.id] = new Timed({
            orig: element,
            useRunestoneServices: eBookConfig.useRunestoneServices,
        });
    }
});


/***/ }),

/***/ 57724:
/*!****************************************!*\
  !*** ./runestone/timed/css/timed.less ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 89296:
/*!*************************************************!*\
  !*** ./runestone/matching/js/timed_matching.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TimedMatching)
/* harmony export */ });
/* harmony import */ var _matching_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./matching.js */ 17352);


class TimedMatching extends _matching_js__WEBPACK_IMPORTED_MODULE_0__.MatchingProblem {
    constructor(opts) {
        super(opts);
        this.renderTimedIcon(this.containerDiv);
        this.hideButtons();
        this.needsReinitialization = true;
    }

    hideButtons() {
        this.gradeBtn.style.display = "none";
        this.helpBtn.style.display = "none";
    }

    renderTimedIcon(component) {
        // renders the clock icon on timed components. The component parameter
        // is the element that the icon should be appended to.
        var timeIconDiv = document.createElement("div");
        var timeIcon = document.createElement("img");
        timeIcon.src = "../_static/clock.png";
        timeIcon.style.width = "15px";
        timeIcon.style.height = "15px";

        timeIconDiv.className = "timeTip";
        timeIconDiv.title = "";
        timeIconDiv.appendChild(timeIcon);
        component.prepend(timeIconDiv);
    }

    checkCorrectTimed() {
        // Returns if the question was correct, incorrect, or skipped (return null in the last case)
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
        this.connList.style.display = "none";
    }

    reinitializeListeners() {
        // maybe need to reinitialize the listeners
    }
}

if (typeof window.component_factory === "undefined") {
    window.component_factory = {};
}
window.component_factory.matching = function (opts) {
    if (opts.timed) {
        return new TimedMatching(opts);
    }
    return new _matching_js__WEBPACK_IMPORTED_MODULE_0__.MatchingProblem(opts);
};


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuZXN0b25lX3RpbWVkX2pzX3RpbWVkX2pzLXJ1bmVzdG9uZV9jbGlja2FibGVBcmVhX2Nzc19jbGlja2FibGVfY3NzLXJ1bmVzdG9uZV9maXRiX2Nzc19maXRiLWNkOWZiMS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDYTs7QUFFZ0Q7QUFDVjtBQUNEO0FBQ3VCO0FBQ2hCO0FBQ2M7QUFDWDtBQUNBO0FBQ0k7QUFDTjtBQUNBO0FBQy9COztBQUUzQjtBQUNlLG9CQUFvQixtRUFBYTtBQUNoRDtBQUNBO0FBQ0E7QUFDQSw4QkFBOEI7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixvRUFBWTtBQUMvQjtBQUNBLHlCQUF5QixvRUFBWSxtQ0FBbUM7QUFDeEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDO0FBQ3ZDLHlDQUF5QztBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLDhCQUE4QjtBQUN0RDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7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L3J1bmVzdG9uZS90aW1lZC9qcy90aW1lZC5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL3RpbWVkL2Nzcy90aW1lZC5sZXNzPzkyYWYiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9tYXRjaGluZy9qcy90aW1lZF9tYXRjaGluZy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT09PT09PT0gICAgICBNYXN0ZXIgdGltZWQuanMgICAgID09PT09PT09PVxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09PSAgICAgVGhpcyBmaWxlIGNvbnRhaW5zIHRoZSBKUyBmb3IgICAgPT09XG49PT0gICAgIHRoZSBSdW5lc3RvbmUgdGltZWQgY29tcG9uZW50LiAgID09PVxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09PSAgICAgICAgICAgICAgQ3JlYXRlZCBCeSAgICAgICAgICAgICAgPT09XG49PT0gICAgICAgICAgICAgS2lyYnkgT2xzb24gICAgICAgICAgICAgID09PVxuPT09ICAgICAgICAgICAgICAgNi8xMS8xNSAgICAgICAgICAgICAgICA9PT1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5cInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IFJ1bmVzdG9uZUJhc2UgZnJvbSBcIi4uLy4uL2NvbW1vbi9qcy9ydW5lc3RvbmViYXNlLmpzXCI7XG5pbXBvcnQgVGltZWRGSVRCIGZyb20gXCIuLi8uLi9maXRiL2pzL3RpbWVkZml0Yi5qc1wiO1xuaW1wb3J0IFRpbWVkTUMgZnJvbSBcIi4uLy4uL21jaG9pY2UvanMvdGltZWRtYy5qc1wiO1xuaW1wb3J0IFRpbWVkU2hvcnRBbnN3ZXIgZnJvbSBcIi4uLy4uL3Nob3J0YW5zd2VyL2pzL3RpbWVkX3Nob3J0YW5zd2VyLmpzXCI7XG5pbXBvcnQgQUNGYWN0b3J5IGZyb20gXCIuLi8uLi9hY3RpdmVjb2RlL2pzL2FjZmFjdG9yeS5qc1wiO1xuaW1wb3J0IFRpbWVkQ2xpY2thYmxlQXJlYSBmcm9tIFwiLi4vLi4vY2xpY2thYmxlQXJlYS9qcy90aW1lZGNsaWNrYWJsZVwiO1xuaW1wb3J0IFRpbWVkRHJhZ05Ecm9wIGZyb20gXCIuLi8uLi9kcmFnbmRyb3AvanMvdGltZWRkbmQuanNcIjtcbmltcG9ydCBUaW1lZFBhcnNvbnMgZnJvbSBcIi4uLy4uL3BhcnNvbnMvanMvdGltZWRwYXJzb25zLmpzXCI7XG5pbXBvcnQgVGltZWRNYXRjaGluZyBmcm9tIFwiLi4vLi4vbWF0Y2hpbmcvanMvdGltZWRfbWF0Y2hpbmcuanNcIjtcbmltcG9ydCBTZWxlY3RPbmUgZnJvbSBcIi4uLy4uL3NlbGVjdHF1ZXN0aW9uL2pzL3NlbGVjdG9uZVwiO1xuaW1wb3J0IHsgZ2V0RGF0YVZhbHVlIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9qcy9kb211dGlsLmpzXCI7XG5pbXBvcnQgXCIuLi9jc3MvdGltZWQubGVzc1wiO1xuXG4vLyBUaW1lZCBjb25zdHJ1Y3RvclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGltZWQgZXh0ZW5kcyBSdW5lc3RvbmVCYXNlIHtcbiAgICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgICAgIHN1cGVyKG9wdHMpO1xuICAgICAgICB2YXIgb3JpZyA9IG9wdHMub3JpZztcbiAgICAgICAgdGhpcy5vcmlnRWxlbSA9IG9yaWc7IC8vIHRoZSBlbnRpcmUgZWxlbWVudCBvZiB0aGlzIHRpbWVkIGFzc2Vzc21lbnQgYW5kIGFsbCBvZiBpdHMgY2hpbGRyZW5cbiAgICAgICAgdGhpcy5kaXZpZCA9IG9yaWcuaWQ7XG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSB0aGlzLm9yaWdFbGVtLmNoaWxkTm9kZXM7XG4gICAgICAgIHRoaXMudmlzaXRlZCA9IFtdO1xuICAgICAgICB0aGlzLnRpbWVMaW1pdCA9IDA7XG4gICAgICAgIHRoaXMubGltaXRlZFRpbWUgPSBmYWxzZTtcbiAgICAgICAgaWYgKCFpc05hTihnZXREYXRhVmFsdWUodGhpcy5vcmlnRWxlbSwgXCJ0aW1lXCIpKSkge1xuICAgICAgICAgICAgdGhpcy50aW1lTGltaXQgPVxuICAgICAgICAgICAgICAgIHBhcnNlSW50KGdldERhdGFWYWx1ZSh0aGlzLm9yaWdFbGVtLCBcInRpbWVcIiksIDEwKSAqIDYwOyAvLyB0aW1lIGluIHNlY29uZHMgdG8gY29tcGxldGUgdGhlIGV4YW1cbiAgICAgICAgICAgIHRoaXMuc3RhcnRpbmdUaW1lID0gdGhpcy50aW1lTGltaXQ7XG4gICAgICAgICAgICB0aGlzLmxpbWl0ZWRUaW1lID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNob3dGZWVkYmFjayA9IHRydWU7XG4gICAgICAgIGlmICh0aGlzLm9yaWdFbGVtLmhhc0F0dHJpYnV0ZShcImRhdGEtbm8tZmVlZGJhY2tcIikpIHtcbiAgICAgICAgICAgIHRoaXMuc2hvd0ZlZWRiYWNrID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgLy8gY2hlY2sgZm9yIGF0dHJpYnV0ZSBkYXRhLXNob3ctZmVlZGJhY2sgPSB5ZXNcbiAgICAgICAgaWYgKHRoaXMub3JpZ0VsZW0uaGFzQXR0cmlidXRlKFwiZGF0YS1zaG93LWZlZWRiYWNrXCIpKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5vcmlnRWxlbS5nZXRBdHRyaWJ1dGUoXCJkYXRhLXNob3ctZmVlZGJhY2tcIikgPT09IFwieWVzXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dGZWVkYmFjayA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuc2hvd0ZlZWRiYWNrID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zaG93UmVzdWx0cyA9IGZhbHNlO1xuICAgICAgICBpZiAodGhpcy5vcmlnRWxlbS5oYXNBdHRyaWJ1dGUoXCJkYXRhLXJlc3VsdFwiKSkge1xuICAgICAgICAgICAgdGhpcy5zaG93UmVzdWx0cyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmFuZG9tID0gZmFsc2U7XG4gICAgICAgIGlmICh0aGlzLm9yaWdFbGVtLmhhc0F0dHJpYnV0ZShcImRhdGEtcmFuZG9tXCIpKSB7XG4gICAgICAgICAgICB0aGlzLnJhbmRvbSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zaG93VGltZXIgPSB0cnVlO1xuICAgICAgICBpZiAodGhpcy5vcmlnRWxlbS5oYXNBdHRyaWJ1dGUoXCJkYXRhLW5vLXRpbWVyXCIpKSB7XG4gICAgICAgICAgICB0aGlzLnNob3dUaW1lciA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLm9yaWdFbGVtLmhhc0F0dHJpYnV0ZShcImRhdGEtdGltZXJcIikpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLm9yaWdFbGVtLmdldEF0dHJpYnV0ZShcImRhdGEtdGltZXJcIikgPT09IFwieWVzXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dUaW1lciA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuc2hvd1RpbWVyID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5mdWxsd2lkdGggPSBmYWxzZTtcbiAgICAgICAgaWYgKHRoaXMub3JpZ0VsZW0uaGFzQXR0cmlidXRlKFwiZGF0YS1mdWxsd2lkdGhcIikpIHtcbiAgICAgICAgICAgIHRoaXMuZnVsbHdpZHRoID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm5vcGF1c2UgPSBmYWxzZTtcbiAgICAgICAgaWYgKHRoaXMub3JpZ0VsZW0uaGFzQXR0cmlidXRlKFwiZGF0YS1uby1wYXVzZVwiKSkge1xuICAgICAgICAgICAgdGhpcy5ub3BhdXNlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5vcmlnRWxlbS5oYXNBdHRyaWJ1dGUoXCJkYXRhLXBhdXNlXCIpKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5vcmlnRWxlbS5nZXRBdHRyaWJ1dGUoXCJkYXRhLXBhdXNlXCIpID09PSBcInllc1wiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ub3BhdXNlID0gZmFsc2U7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMubm9wYXVzZSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZUJvb2tDb25maWcuZW5hYmxlU2NyYXRjaEFDID0gZmFsc2U7XG4gICAgICAgIHRoaXMucnVubmluZyA9IDA7XG4gICAgICAgIHRoaXMucGF1c2VkID0gMDtcbiAgICAgICAgdGhpcy5kb25lID0gMDtcbiAgICAgICAgdGhpcy50YWtlbiA9IDA7XG4gICAgICAgIHRoaXMuc2NvcmUgPSAwO1xuICAgICAgICB0aGlzLmluY29ycmVjdCA9IDA7XG4gICAgICAgIHRoaXMuY29ycmVjdFN0ciA9IFwiXCI7XG4gICAgICAgIHRoaXMuaW5jb3JyZWN0U3RyID0gXCJcIjtcbiAgICAgICAgdGhpcy5za2lwcGVkU3RyID0gXCJcIjtcbiAgICAgICAgdGhpcy5za2lwcGVkID0gMDtcbiAgICAgICAgdGhpcy5jdXJyZW50UXVlc3Rpb25JbmRleCA9IDA7IC8vIFdoaWNoIHF1ZXN0aW9uIGlzIGN1cnJlbnRseSBkaXNwbGF5aW5nIG9uIHRoZSBwYWdlXG4gICAgICAgIHRoaXMucmVuZGVyZWRRdWVzdGlvbkFycmF5ID0gW107IC8vIGxpc3Qgb2YgYWxsIHByb2JsZW1zXG4gICAgICAgIHRoaXMuZ2V0TmV3Q2hpbGRyZW4oKTtcbiAgICAgICAgLy8gT25lIHNtYWxsIHN0ZXAgdG8gZWxpbWluYXRlIHN0dWRlbnRzIGZyb20gZG9pbmcgdmlldyBzb3VyY2VcbiAgICAgICAgLy8gdGhpcyB3b24ndCBzdG9wIGFueW9uZSB3aXRoIGRldGVybWluYXRpb24gYnV0IG1heSBwcmV2ZW50IGNhc3VhbCBwZWVraW5nXG4gICAgICAgIGlmICghZUJvb2tDb25maWcuZW5hYmxlRGVidWcpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkub25jb250ZXh0bWVudSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2hlY2tBc3Nlc3NtZW50U3RhdHVzKCkudGhlbihcbiAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlclRpbWVkQXNzZXNzKCk7XG4gICAgICAgICAgICB9LmJpbmQodGhpcyksXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgZ2V0TmV3Q2hpbGRyZW4oKSB7XG4gICAgICAgIHRoaXMubmV3Q2hpbGRyZW4gPSBbXTtcbiAgICAgICAgbGV0IHJ1bmVzdG9uZUNoaWxkcmVuID0gdGhpcy5vcmlnRWxlbS5xdWVyeVNlbGVjdG9yQWxsKFwiLnJ1bmVzdG9uZVwiKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBydW5lc3RvbmVDaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5uZXdDaGlsZHJlbi5wdXNoKHJ1bmVzdG9uZUNoaWxkcmVuW2ldKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFzeW5jIGNoZWNrQXNzZXNzbWVudFN0YXR1cygpIHtcbiAgICAgICAgLy8gSGFzIHRoZSB1c2VyIHRha2VuIHRoaXMgZXhhbT8gIElucXVpcmluZyBtaW5kcyB3YW50IHRvIGtub3dcbiAgICAgICAgLy8gSWYgYSB1c2VyIGhhcyBub3QgdGFrZW4gdGhpcyBleGFtIHRoZW4gd2Ugd2FudCB0byBtYWtlIHN1cmVcbiAgICAgICAgLy8gdGhhdCBpZiBhIHF1ZXN0aW9uIGhhcyBiZWVuIHNlZW4gYnkgdGhlIHN0dWRlbnQgYmVmb3JlIHdlIGRvXG4gICAgICAgIC8vIG5vdCBwb3B1bGF0ZSBwcmV2aW91cyBhbnN3ZXJzLlxuICAgICAgICBsZXQgc2VuZEluZm8gPSB7XG4gICAgICAgICAgICBkaXZfaWQ6IHRoaXMuZGl2aWQsXG4gICAgICAgICAgICBjb3Vyc2VfbmFtZTogZUJvb2tDb25maWcuY291cnNlLFxuICAgICAgICB9O1xuICAgICAgICBjb25zb2xlLmxvZyhzZW5kSW5mbyk7XG4gICAgICAgIGlmIChlQm9va0NvbmZpZy51c2VSdW5lc3RvbmVTZXJ2aWNlcykge1xuICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSBuZXcgUmVxdWVzdChcbiAgICAgICAgICAgICAgICBgJHtlQm9va0NvbmZpZy5uZXdfc2VydmVyX3ByZWZpeH0vYXNzZXNzbWVudC90b29rVGltZWRBc3Nlc3NtZW50YCxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHRoaXMuanNvbkhlYWRlcnMsXG4gICAgICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHNlbmRJbmZvKSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGxldCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHJlcXVlc3QpO1xuICAgICAgICAgICAgbGV0IGRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICAgICAgICBkYXRhID0gZGF0YS5kZXRhaWw7XG4gICAgICAgICAgICB0aGlzLnRha2VuID0gZGF0YS50b29rQXNzZXNzbWVudDtcbiAgICAgICAgICAgIHRoaXMuYXNzZXNzbWVudFRha2VuID0gdGhpcy50YWtlbjtcbiAgICAgICAgICAgIGlmICghdGhpcy50YWtlbikge1xuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5jbGVhcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJkb25lIHdpdGggY2hlY2sgc3RhdHVzXCIpO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy50YWtlbiA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5hc3Nlc3NtZW50VGFrZW4gPSBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09PSBHZW5lcmF0aW5nIG5ldyBUaW1lZCBIVE1MID09PVxuICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuICAgIGFzeW5jIHJlbmRlclRpbWVkQXNzZXNzKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcInJlbmRlcmluZyB0aW1lZCBcIik7XG4gICAgICAgIC8vIGNyZWF0ZSByZW5kZXJlZFF1ZXN0aW9uQXJyYXkgcmV0dXJucyBhIHByb21pc2VcbiAgICAgICAgLy9cbiAgICAgICAgdGhpcy5jcmVhdGVSZW5kZXJlZFF1ZXN0aW9uQXJyYXkoKTtcbiAgICAgICAgaWYgKHRoaXMucmFuZG9tKSB7XG4gICAgICAgICAgICB0aGlzLnJhbmRvbWl6ZVJRQSgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVuZGVyQ29udGFpbmVyKCk7XG4gICAgICAgIHRoaXMucmVuZGVyVGltZXIoKTtcbiAgICAgICAgYXdhaXQgdGhpcy5yZW5kZXJDb250cm9sQnV0dG9ucygpO1xuICAgICAgICAvLyBJZiB3ZSBkZWNpZGUgdG8gZGlzYWJsZSBjdXQvY29weS9wYXN0ZSwgdW5jb21tZW50IHRoZSBsaW5lIGJlbG93XG4gICAgICAgIC8vIHRoaXMuZGlzYWJsZUN1dENvcHlQYXN0ZSgpO1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZCh0aGlzLnRpbWVkRGl2KTsgLy8gVGhpcyBjYW4ndCBiZSBhcHBlbmRlZCBpbiByZW5kZXJDb250YWluZXIgYmVjYXVzZSB0aGVuIGl0IHJlbmRlcnMgYWJvdmUgdGhlIHRpbWVyIGFuZCBjb250cm9sIGJ1dHRvbnMuXG4gICAgICAgIGlmICh0aGlzLnJlbmRlcmVkUXVlc3Rpb25BcnJheS5sZW5ndGggPiAxKSB0aGlzLnJlbmRlck5hdkNvbnRyb2xzKCk7XG4gICAgICAgIHRoaXMucmVuZGVyU3VibWl0QnV0dG9uKCk7XG4gICAgICAgIHRoaXMucmVuZGVyRmVlZGJhY2tDb250YWluZXIoKTtcbiAgICAgICAgdGhpcy51c2VSdW5lc3RvbmVTZXJ2aWNlcyA9IGVCb29rQ29uZmlnLnVzZVJ1bmVzdG9uZVNlcnZpY2VzO1xuICAgICAgICAvLyBSZXBsYWNlIGludGVybWVkaWF0ZSBIVE1MIHdpdGggcmVuZGVyZWQgSFRNTFxuICAgICAgICB0aGlzLm9yaWdFbGVtLnJlcGxhY2VXaXRoKHRoaXMuY29udGFpbmVyRGl2KTtcbiAgICAgICAgLy8gY2hlY2sgaWYgYWxyZWFkeSB0YWtlbiBhbmQgaWYgc28gc2hvdyByZXN1bHRzXG4gICAgICAgIHRoaXMuc3R5bGVFeGFtRWxlbWVudHMoKTsgLy8gcmVuYW1lIHRvIHJlbmRlclBvc3NpYmxlUmVzdWx0c1xuICAgICAgICB0aGlzLmNoZWNrU2VydmVyKFwidGltZWRFeGFtXCIsIHRydWUpO1xuICAgIH1cblxuICAgIGRpc2FibGVDdXRDb3B5UGFzdGUoKSB7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjdXRcIiwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjb3B5XCIsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH0pO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwicGFzdGVcIiwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmVuZGVyQ29udGFpbmVyKCkge1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7IC8vIGNvbnRhaW5lciBmb3IgdGhlIGVudGlyZSBUaW1lZCBDb21wb25lbnRcbiAgICAgICAgaWYgKHRoaXMuZnVsbHdpZHRoKSB7XG4gICAgICAgICAgICAvLyBhbGxvdyB0aGUgY29udGFpbmVyIHRvIGZpbGwgdGhlIHdpZHRoIC0gYmFyYlxuICAgICAgICAgICAgdGhpcy5jb250YWluZXJEaXYuY2xhc3NMaXN0LmFkZChcInRpbWVkLWNvbnRhaW5lci1mdWxsd2lkdGhcIik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYuY2xhc3NMaXN0LmFkZChcInJ1bmVzdG9uZS1zcGhpbnhcIik7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmlkID0gdGhpcy5kaXZpZDtcbiAgICAgICAgdGhpcy50aW1lZERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7IC8vIGRpdiB0aGF0IHdpbGwgaG9sZCB0aGUgcXVlc3Rpb25zIGZvciB0aGUgdGltZWQgYXNzZXNzbWVudFxuICAgICAgICB0aGlzLm5hdkRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7IC8vIEZvciBuYXZpZ2F0aW9uIGNvbnRyb2xcbiAgICAgICAgdGhpcy5uYXZEaXYuY2xhc3NMaXN0LmFkZChcInRpbWVkLWNlbnRlclwiKTtcbiAgICAgICAgdGhpcy5mbGFnRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTsgLy8gZGl2IHRoYXQgd2lsbCBob2xkIHRoZSBcIkZsYWcgUXVlc3Rpb25cIiBidXR0b25cbiAgICAgICAgdGhpcy5mbGFnRGl2LmNsYXNzTGlzdC5hZGQoXCJ0aW1lZC1jZW50ZXJcIik7XG4gICAgICAgIHRoaXMuc3dpdGNoQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdGhpcy5zd2l0Y2hDb250YWluZXIuY2xhc3NMaXN0LmFkZChcInN3aXRjaGNvbnRhaW5lclwiKTtcbiAgICAgICAgdGhpcy5zd2l0Y2hDb250YWluZXIuY2xhc3NMaXN0LmFkZChcInB0eC1ydW5lc3RvbmUtY29udGFpbmVyXCIpO1xuICAgICAgICB0aGlzLnN3aXRjaERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7IC8vIGlzIHJlcGxhY2VkIGJ5IHRoZSBxdWVzdGlvbnNcbiAgICAgICAgdGhpcy50aW1lZERpdi5hcHBlbmRDaGlsZCh0aGlzLm5hdkRpdik7XG4gICAgICAgIHRoaXMudGltZWREaXYuYXBwZW5kQ2hpbGQodGhpcy5mbGFnRGl2KTsgLy8gYWRkIGZsYWdEaXYgdG8gdGltZWREaXYsIHdoaWNoIGhvbGRzIGNvbXBvbmVudHMgZm9yIG5hdmlnYXRpb24gYW5kIHF1ZXN0aW9ucyBmb3IgdGltZWQgYXNzZXNzbWVudFxuICAgICAgICB0aGlzLnRpbWVkRGl2LmFwcGVuZENoaWxkKHRoaXMuc3dpdGNoQ29udGFpbmVyKTtcbiAgICAgICAgdGhpcy5zd2l0Y2hDb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5zd2l0Y2hEaXYpO1xuICAgICAgICB0aGlzLnRpbWVkRGl2LmlkID0gXCJ0aW1lZF9UZXN0XCI7XG4gICAgICAgIHRoaXMudGltZWREaXYuY2xhc3NMaXN0LmFkZChcInRpbWVkLWhpZGRlblwiKTtcbiAgICB9XG5cbiAgICByZW5kZXJUaW1lcigpIHtcbiAgICAgICAgdGhpcy53cmFwcGVyRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdGhpcy50aW1lckNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJQXCIpO1xuICAgICAgICB0aGlzLndyYXBwZXJEaXYuaWQgPSB0aGlzLmRpdmlkICsgXCItc3RhcnRXcmFwcGVyXCI7XG4gICAgICAgIHRoaXMudGltZXJDb250YWluZXIuaWQgPSB0aGlzLmRpdmlkICsgXCItb3V0cHV0XCI7XG4gICAgICAgIHRoaXMud3JhcHBlckRpdi5hcHBlbmRDaGlsZCh0aGlzLnRpbWVyQ29udGFpbmVyKTtcbiAgICAgICAgdGhpcy5zaG93VGltZSgpO1xuICAgIH1cblxuICAgIHJlbmRlckNvbnRyb2xCdXR0b25zKCkge1xuICAgICAgICB0aGlzLmNvbnRyb2xEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB0aGlzLmNvbnRyb2xEaXYuaWQgPSBcImNvbnRyb2xzXCI7XG4gICAgICAgIHRoaXMuY29udHJvbERpdi5jbGFzc0xpc3QuYWRkKFwidGltZWQtY2VudGVyXCIpO1xuICAgICAgICB0aGlzLnN0YXJ0QnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICAgICAgdGhpcy5wYXVzZUJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICAgIHRoaXMuc3RhcnRCdG4uc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJidG4gYnRuLXN1Y2Nlc3NcIik7XG4gICAgICAgIHRoaXMuc3RhcnRCdG4uaWQgPSBcInN0YXJ0XCI7XG4gICAgICAgIHRoaXMuc3RhcnRCdG4udGFiSW5kZXggPSAwO1xuICAgICAgICB0aGlzLnN0YXJ0QnRuLnNldEF0dHJpYnV0ZShcInJvbGVcIiwgXCJidXR0b25cIik7XG4gICAgICAgIHRoaXMuc3RhcnRCdG4udGV4dENvbnRlbnQgPSBcIlN0YXJ0XCI7XG4gICAgICAgIHRoaXMuc3RhcnRCdG4uYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgIFwiY2xpY2tcIixcbiAgICAgICAgICAgIGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAvLyBjaGVjayBmb3IgYSBzdHVkeUNsdWVzIGJ1dHRvbiBhbmQgaGlkZSBpdCBpZiBpdCBleGlzdHNcbiAgICAgICAgICAgICAgICBsZXQgc2NiID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdHVkeWNsdWVzLWZhYlwiKTtcbiAgICAgICAgICAgICAgICBpZiAoc2NiKSB7XG4gICAgICAgICAgICAgICAgICAgIHNjYi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuZmluaXNoQnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJ0aW1lZC1oaWRkZW5cIik7IC8vIGhpZGUgdGhlIGZpbmlzaCBidXR0b24gZm9yIG5vd1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmZsYWdCdXR0b24pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mbGFnQnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoXCJ0aW1lZC1oaWRkZW5cIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxldCBtZXNzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgICAgICAgICAgICAgbWVzcy5pbm5lckhUTUwgPVxuICAgICAgICAgICAgICAgICAgICBcIjxzdHJvbmc+V2FybmluZzogWW91IHdpbGwgbm90IGJlIGFibGUgdG8gY29udGludWUgdGhlIGV4YW0gaWYgeW91IGNsb3NlIHRoaXMgdGFiLCBjbG9zZSB0aGUgd2luZG93LCBvciBuYXZpZ2F0ZSBhd2F5IGZyb20gdGhpcyBwYWdlITwvc3Ryb25nPiAgTWFrZSBzdXJlIHlvdSBjbGljayB0aGUgRmluaXNoIEV4YW0gYnV0dG9uIHdoZW4geW91IGFyZSBkb25lIHRvIHN1Ym1pdCB5b3VyIHdvcmshXCI7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250cm9sRGl2LmFwcGVuZENoaWxkKG1lc3MpO1xuICAgICAgICAgICAgICAgIG1lc3MuY2xhc3NMaXN0LmFkZChcImV4YW13YXJuaW5nXCIpO1xuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMucmVuZGVyVGltZWRRdWVzdGlvbigpO1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhcnRBc3Nlc3NtZW50KCk7XG4gICAgICAgICAgICB9LmJpbmQodGhpcyksXG4gICAgICAgICAgICBmYWxzZSxcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5wYXVzZUJ0bi5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImJ0biBidG4tZGVmYXVsdFwiKTtcbiAgICAgICAgdGhpcy5wYXVzZUJ0bi5pZCA9IFwicGF1c2VcIjtcbiAgICAgICAgdGhpcy5wYXVzZUJ0bi5kaXNhYmxlZCA9IHRydWU7XG4gICAgICAgIHRoaXMucGF1c2VCdG4udGFiSW5kZXggPSAwO1xuICAgICAgICB0aGlzLnBhdXNlQnRuLnNldEF0dHJpYnV0ZShcInJvbGVcIiwgXCJidXR0b25cIik7XG4gICAgICAgIHRoaXMucGF1c2VCdG4udGV4dENvbnRlbnQgPSBcIlBhdXNlXCI7XG4gICAgICAgIHRoaXMucGF1c2VCdG4uYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgIFwiY2xpY2tcIixcbiAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBhdXNlQXNzZXNzbWVudCgpO1xuICAgICAgICAgICAgfS5iaW5kKHRoaXMpLFxuICAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICk7XG4gICAgICAgIGlmICghdGhpcy50YWtlbikge1xuICAgICAgICAgICAgdGhpcy5jb250cm9sRGl2LmFwcGVuZENoaWxkKHRoaXMuc3RhcnRCdG4pO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5ub3BhdXNlKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRyb2xEaXYuYXBwZW5kQ2hpbGQodGhpcy5wYXVzZUJ0bik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYuYXBwZW5kQ2hpbGQodGhpcy53cmFwcGVyRGl2KTtcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYuYXBwZW5kQ2hpbGQodGhpcy5jb250cm9sRGl2KTtcbiAgICB9XG5cbiAgICByZW5kZXJOYXZDb250cm9scygpIHtcbiAgICAgICAgLy8gbWFraW5nIFwiUHJldlwiIGJ1dHRvblxuICAgICAgICB0aGlzLnBhZ05hdkxpc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidWxcIik7XG4gICAgICAgIHRoaXMucGFnTmF2TGlzdC5jbGFzc0xpc3QuYWRkKFwicGFnaW5hdGlvblwiKTtcbiAgICAgICAgdGhpcy5sZWZ0Q29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpXCIpO1xuICAgICAgICB0aGlzLmxlZnROYXZCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgICAgICB0aGlzLmxlZnROYXZCdXR0b24uaW5uZXJIVE1MID0gXCImIzgyNDk7IFByZXZcIjtcbiAgICAgICAgdGhpcy5sZWZ0TmF2QnV0dG9uLnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIiwgXCJQcmV2aW91c1wiKTtcbiAgICAgICAgdGhpcy5sZWZ0TmF2QnV0dG9uLnRhYkluZGV4ID0gMDtcbiAgICAgICAgdGhpcy5sZWZ0TmF2QnV0dG9uLnNldEF0dHJpYnV0ZShcInJvbGVcIiwgXCJidXR0b25cIik7XG4gICAgICAgIHRoaXMubGVmdE5hdkJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwidGltZWQtY3Vyc29yLXBvaW50ZXJcIik7XG4gICAgICAgIHRoaXMubGVmdENvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmxlZnROYXZCdXR0b24pO1xuICAgICAgICB0aGlzLnBhZ05hdkxpc3QuYXBwZW5kQ2hpbGQodGhpcy5sZWZ0Q29udGFpbmVyKTtcbiAgICAgICAgLy8gbWFraW5nIFwiRmxhZyBRdWVzdGlvblwiIGJ1dHRvblxuICAgICAgICB0aGlzLmZsYWdnaW5nUGxhY2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidWxcIik7XG4gICAgICAgIHRoaXMuZmxhZ2dpbmdQbGFjZS5jbGFzc0xpc3QuYWRkKFwicGFnaW5hdGlvblwiKTtcbiAgICAgICAgdGhpcy5mbGFnQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpXCIpO1xuICAgICAgICB0aGlzLmZsYWdCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgICAgICB0aGlzLmZsYWdCdXR0b24uY2xhc3NMaXN0LmFkZChcImZsYWdCdG5cIik7XG4gICAgICAgIHRoaXMuZmxhZ0J1dHRvbi5pbm5lckhUTUwgPSBcIkZsYWcgUXVlc3Rpb25cIjsgLy8gbmFtZSBvbiBidXR0b25cbiAgICAgICAgdGhpcy5mbGFnQnV0dG9uLnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxsZWRieVwiLCBcIkZsYWdcIik7XG4gICAgICAgIHRoaXMuZmxhZ0J1dHRvbi50YWJJbmRleCA9IDU7XG4gICAgICAgIHRoaXMuZmxhZ0J1dHRvbi5zZXRBdHRyaWJ1dGUoXCJyb2xlXCIsIFwiYnV0dG9uXCIpO1xuICAgICAgICB0aGlzLmZsYWdCdXR0b24uaWQgPSBcImZsYWdcIjtcbiAgICAgICAgdGhpcy5mbGFnQnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJ0aW1lZC1jdXJzb3ItcG9pbnRlclwiKTtcbiAgICAgICAgdGhpcy5mbGFnQ29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuZmxhZ0J1dHRvbik7IC8vIGFkZGluZyBidXR0b24gdG8gY29udGFpbmVyXG4gICAgICAgIHRoaXMuZmxhZ2dpbmdQbGFjZS5hcHBlbmRDaGlsZCh0aGlzLmZsYWdDb250YWluZXIpOyAvLyBhZGRpbmcgY29udGFpbmVyIHRvIGZsYWdnaW5nUGxhY2VcbiAgICAgICAgLy8gbWFraW5nIFwiTmV4dFwiIGJ1dHRvblxuICAgICAgICB0aGlzLnJpZ2h0Q29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpXCIpO1xuICAgICAgICB0aGlzLnJpZ2h0TmF2QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICAgICAgdGhpcy5yaWdodE5hdkJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJhcmlhLWxhYmVsXCIsIFwiTmV4dFwiKTtcbiAgICAgICAgdGhpcy5yaWdodE5hdkJ1dHRvbi50YWJJbmRleCA9IDA7XG4gICAgICAgIHRoaXMucmlnaHROYXZCdXR0b24uc2V0QXR0cmlidXRlKFwicm9sZVwiLCBcImJ1dHRvblwiKTtcbiAgICAgICAgdGhpcy5yaWdodE5hdkJ1dHRvbi5pZCA9IFwibmV4dFwiO1xuICAgICAgICB0aGlzLnJpZ2h0TmF2QnV0dG9uLmlubmVySFRNTCA9IFwiTmV4dCAmIzgyNTA7XCI7XG4gICAgICAgIHRoaXMucmlnaHROYXZCdXR0b24uY2xhc3NMaXN0LmFkZChcInRpbWVkLWN1cnNvci1wb2ludGVyXCIpO1xuICAgICAgICB0aGlzLnJpZ2h0Q29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMucmlnaHROYXZCdXR0b24pO1xuICAgICAgICB0aGlzLnBhZ05hdkxpc3QuYXBwZW5kQ2hpbGQodGhpcy5yaWdodENvbnRhaW5lcik7XG4gICAgICAgIHRoaXMuZW5zdXJlQnV0dG9uU2FmZXR5KCk7XG4gICAgICAgIHRoaXMubmF2RGl2LmFwcGVuZENoaWxkKHRoaXMucGFnTmF2TGlzdCk7XG4gICAgICAgIHRoaXMuZmxhZ0Rpdi5hcHBlbmRDaGlsZCh0aGlzLmZsYWdnaW5nUGxhY2UpOyAvLyBhZGRzIGZsYWdnaW5nUGxhY2UgdG8gdGhlIGZsYWdEaXZcbiAgICAgICAgdGhpcy5icmVhayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJiclwiKTtcbiAgICAgICAgdGhpcy5uYXZEaXYuYXBwZW5kQ2hpbGQodGhpcy5icmVhayk7XG4gICAgICAgIC8vIHJlbmRlciB0aGUgcXVlc3Rpb24gbnVtYmVyIGp1bXAgYnV0dG9uc1xuICAgICAgICB0aGlzLnFOdW1MaXN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInVsXCIpO1xuICAgICAgICB0aGlzLnFOdW1MaXN0LmlkID0gXCJwYWdlTnVtc1wiO1xuICAgICAgICB0aGlzLnFOdW1XcmFwcGVyTGlzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ1bFwiKTtcbiAgICAgICAgdGhpcy5xTnVtV3JhcHBlckxpc3QuY2xhc3NMaXN0LmFkZChcInBhZ2luYXRpb25cIik7XG4gICAgICAgIHZhciB0bXBMaSwgdG1wQTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnJlbmRlcmVkUXVlc3Rpb25BcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdG1wTGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlcIik7XG4gICAgICAgICAgICB0bXBBID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XG4gICAgICAgICAgICB0bXBBLmlubmVySFRNTCA9IGkgKyAxO1xuICAgICAgICAgICAgdG1wQS5jbGFzc0xpc3QuYWRkKFwidGltZWQtY3Vyc29yLXBvaW50ZXJcIik7XG4gICAgICAgICAgICBpZiAoaSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHRtcExpLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0bXBMaS5hcHBlbmRDaGlsZCh0bXBBKTtcbiAgICAgICAgICAgIHRoaXMucU51bVdyYXBwZXJMaXN0LmFwcGVuZENoaWxkKHRtcExpKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnFOdW1MaXN0LmFwcGVuZENoaWxkKHRoaXMucU51bVdyYXBwZXJMaXN0KTtcbiAgICAgICAgdGhpcy5uYXZEaXYuYXBwZW5kQ2hpbGQodGhpcy5xTnVtTGlzdCk7XG4gICAgICAgIHRoaXMubmF2QnRuTGlzdGVuZXJzKCk7XG4gICAgICAgIHRoaXMuZmxhZ0J0bkxpc3RlbmVyKCk7IC8vIGxpc3RlbnMgZm9yIGNsaWNrIG9uIGZsYWcgYnV0dG9uXG4gICAgICAgIHRoaXMuZmxhZ0J1dHRvbi5jbGFzc0xpc3QuYWRkKFwidGltZWQtaGlkZGVuXCIpO1xuICAgIH1cblxuICAgIC8vIFRoZSBsaSBmb3IgcXVlc3Rpb24gbnVtYmVyIGBpbmRleGAgaW4gdGhlIG51bWJlcmVkIG5hdmlnYXRpb24gc3RyaXAuXG4gICAgcU51bUl0ZW0oaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJ1bCNwYWdlTnVtcyA+IHVsID4gbGlcIilbaW5kZXhdO1xuICAgIH1cblxuICAgIC8vIHdoZW4gbW92aW5nIG9mZiBvZiBhIHF1ZXN0aW9uIGluIGFuIGFjdGl2ZSBleGFtOlxuICAgIC8vIDEuIHNob3cgdGhhdCB0aGUgcXVlc3Rpb24gaGFzIGJlZW4gc2Vlbiwgb3IgbWFyayBpdCBicm9rZW4gaWYgaXQgaXMgaW4gZXJyb3IuXG4gICAgLy8gMi4gY2hlY2sgYW5kIGxvZyB0aGUgY3VycmVudCBhbnN3ZXJcbiAgICBhc3luYyBuYXZpZ2F0ZUF3YXkoKSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHRoaXMucmVuZGVyZWRRdWVzdGlvbkFycmF5W3RoaXMuY3VycmVudFF1ZXN0aW9uSW5kZXhdLnN0YXRlID09XG4gICAgICAgICAgICBcImJyb2tlbl9leGFtXCJcbiAgICAgICAgKSB7XG4gICAgICAgICAgICB0aGlzLnFOdW1JdGVtKHRoaXMuY3VycmVudFF1ZXN0aW9uSW5kZXgpPy5jbGFzc0xpc3QuYWRkKFwiYnJva2VuXCIpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHRoaXMucmVuZGVyZWRRdWVzdGlvbkFycmF5W3RoaXMuY3VycmVudFF1ZXN0aW9uSW5kZXhdLnN0YXRlID09XG4gICAgICAgICAgICBcImV4YW1fZW5kZWRcIlxuICAgICAgICApIHtcbiAgICAgICAgICAgIHRoaXMucU51bUl0ZW0odGhpcy5jdXJyZW50UXVlc3Rpb25JbmRleCk/LmNsYXNzTGlzdC5hZGQoXCJ0b29sYXRlXCIpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHRoaXMucmVuZGVyZWRRdWVzdGlvbkFycmF5W3RoaXMuY3VycmVudFF1ZXN0aW9uSW5kZXhdLnF1ZXN0aW9uXG4gICAgICAgICAgICAgICAgLmlzQW5zd2VyZWRcbiAgICAgICAgKSB7XG4gICAgICAgICAgICB0aGlzLnFOdW1JdGVtKHRoaXMuY3VycmVudFF1ZXN0aW9uSW5kZXgpPy5jbGFzc0xpc3QuYWRkKFxuICAgICAgICAgICAgICAgIFwiYW5zd2VyZWRcIixcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnJlbmRlcmVkUXVlc3Rpb25BcnJheVtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4XG4gICAgICAgICAgICBdLnF1ZXN0aW9uLmNoZWNrQ3VycmVudEFuc3dlcigpO1xuICAgICAgICAgICAgaWYgKCF0aGlzLmRvbmUpIHtcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnJlbmRlcmVkUXVlc3Rpb25BcnJheVtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50UXVlc3Rpb25JbmRleFxuICAgICAgICAgICAgICAgIF0ucXVlc3Rpb24ubG9nQ3VycmVudEFuc3dlcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGFzeW5jIGhhbmRsZU5leHRQcmV2KGV2ZW50KSB7XG4gICAgICAgIGlmICghdGhpcy50YWtlbikge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5uYXZpZ2F0ZUF3YXkoKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0LnRleHRDb250ZW50O1xuICAgICAgICBpZiAodGFyZ2V0Lm1hdGNoKC9OZXh0LykpIHtcbiAgICAgICAgICAgIC8vIGNoZWNrcyBnaXZlbiB0ZXh0IHRvIG1hdGNoIFwiTmV4dFwiXG4gICAgICAgICAgICBpZiAodGhpcy5yaWdodENvbnRhaW5lci5jbGFzc0xpc3QuY29udGFpbnMoXCJkaXNhYmxlZFwiKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuY3VycmVudFF1ZXN0aW9uSW5kZXgrKztcbiAgICAgICAgfSBlbHNlIGlmICh0YXJnZXQubWF0Y2goL1ByZXYvKSkge1xuICAgICAgICAgICAgLy8gY2hlY2tzIGdpdmVuIHRleHQgdG8gbWF0Y2ggXCJQcmV2XCJcbiAgICAgICAgICAgIGlmICh0aGlzLmxlZnRDb250YWluZXIuY2xhc3NMaXN0LmNvbnRhaW5zKFwiZGlzYWJsZWRcIikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4LS07XG4gICAgICAgIH1cbiAgICAgICAgYXdhaXQgdGhpcy5yZW5kZXJUaW1lZFF1ZXN0aW9uKCk7XG4gICAgICAgIHRoaXMuZW5zdXJlQnV0dG9uU2FmZXR5KCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5xTnVtTGlzdC5jaGlsZE5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBmb3IgKFxuICAgICAgICAgICAgICAgIHZhciBqID0gMDtcbiAgICAgICAgICAgICAgICBqIDwgdGhpcy5xTnVtTGlzdC5jaGlsZE5vZGVzW2ldLmNoaWxkTm9kZXMubGVuZ3RoO1xuICAgICAgICAgICAgICAgIGorK1xuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5xTnVtTGlzdC5jaGlsZE5vZGVzW2ldLmNoaWxkTm9kZXNbal0uY2xhc3NMaXN0LnJlbW92ZShcbiAgICAgICAgICAgICAgICAgICAgXCJhY3RpdmVcIixcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGxldCBjdXJyZW50SXRlbSA9IHRoaXMucU51bUl0ZW0odGhpcy5jdXJyZW50UXVlc3Rpb25JbmRleCk7XG4gICAgICAgIGN1cnJlbnRJdGVtPy5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xuICAgICAgICBpZiAoY3VycmVudEl0ZW0/LmNsYXNzTGlzdC5jb250YWlucyhcImZsYWdjb2xvclwiKSkge1xuICAgICAgICAgICAgLy8gY2hlY2tpbmcgZm9yIGNsYXNzXG4gICAgICAgICAgICB0aGlzLmZsYWdCdXR0b24uaW5uZXJIVE1MID0gXCJVbmZsYWcgUXVlc3Rpb25cIjsgLy8gY2hhbmdlcyB0ZXh0IG9uIGJ1dHRvblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5mbGFnQnV0dG9uLmlubmVySFRNTCA9IFwiRmxhZyBRdWVzdGlvblwiOyAvLyBjaGFuZ2VzIHRleHQgb24gYnV0dG9uXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyBoYW5kbGVGbGFnKGV2ZW50KSB7XG4gICAgICAgIC8vIGNhbGxlZCB3aGVuIGZsYWcgYnV0dG9uIGlzIGNsaWNrZWRcbiAgICAgICAgdmFyIHRhcmdldCA9IGV2ZW50LnRhcmdldC50ZXh0Q29udGVudDtcbiAgICAgICAgaWYgKHRhcmdldC5tYXRjaCgvRmxhZyBRdWVzdGlvbi8pKSB7XG4gICAgICAgICAgICAvLyBjbGFzcyB3aWxsIGNoYW5nZSBjb2xvciBvZiBxdWVzdGlvbiBibG9ja1xuICAgICAgICAgICAgdGhpcy5xTnVtSXRlbSh0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4KT8uY2xhc3NMaXN0LmFkZChcbiAgICAgICAgICAgICAgICBcImZsYWdjb2xvclwiLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHRoaXMuZmxhZ0J1dHRvbi5pbm5lckhUTUwgPSBcIlVuZmxhZyBRdWVzdGlvblwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gd2lsbCByZXN0b3JlIGN1cnJlbnQgY29sb3Igb2YgcXVlc3Rpb24gYmxvY2tcbiAgICAgICAgICAgIHRoaXMucU51bUl0ZW0odGhpcy5jdXJyZW50UXVlc3Rpb25JbmRleCk/LmNsYXNzTGlzdC5yZW1vdmUoXG4gICAgICAgICAgICAgICAgXCJmbGFnY29sb3JcIixcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB0aGlzLmZsYWdCdXR0b24uaW5uZXJIVE1MID0gXCJGbGFnIFF1ZXN0aW9uXCI7IC8vIGFsc28gc2V0cyBuYW1lIGJhY2tcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFzeW5jIGhhbmRsZU51bWJlcmVkTmF2KGV2ZW50KSB7XG4gICAgICAgIGlmICghdGhpcy50YWtlbikge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5uYXZpZ2F0ZUF3YXkoKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucU51bUxpc3QuY2hpbGROb2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgZm9yIChcbiAgICAgICAgICAgICAgICB2YXIgaiA9IDA7XG4gICAgICAgICAgICAgICAgaiA8IHRoaXMucU51bUxpc3QuY2hpbGROb2Rlc1tpXS5jaGlsZE5vZGVzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBqKytcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHRoaXMucU51bUxpc3QuY2hpbGROb2Rlc1tpXS5jaGlsZE5vZGVzW2pdLmNsYXNzTGlzdC5yZW1vdmUoXG4gICAgICAgICAgICAgICAgICAgIFwiYWN0aXZlXCIsXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB0YXJnZXQgPSBldmVudC50YXJnZXQudGV4dENvbnRlbnQ7XG4gICAgICAgIGxldCBvbGRJbmRleCA9IHRoaXMuY3VycmVudFF1ZXN0aW9uSW5kZXg7XG4gICAgICAgIHRoaXMuY3VycmVudFF1ZXN0aW9uSW5kZXggPSBwYXJzZUludCh0YXJnZXQpIC0gMTtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFF1ZXN0aW9uSW5kZXggPiB0aGlzLnJlbmRlcmVkUXVlc3Rpb25BcnJheS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBFcnJvcjogYmFkIGluZGV4IGZvciAke3RhcmdldH1gKTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFF1ZXN0aW9uSW5kZXggPSBvbGRJbmRleDtcbiAgICAgICAgfVxuICAgICAgICBsZXQgY3VycmVudEl0ZW0gPSB0aGlzLnFOdW1JdGVtKHRoaXMuY3VycmVudFF1ZXN0aW9uSW5kZXgpO1xuICAgICAgICBjdXJyZW50SXRlbT8uY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcbiAgICAgICAgaWYgKGN1cnJlbnRJdGVtPy5jbGFzc0xpc3QuY29udGFpbnMoXCJmbGFnY29sb3JcIikpIHtcbiAgICAgICAgICAgIHRoaXMuZmxhZ0J1dHRvbi5pbm5lckhUTUwgPSBcIlVuZmxhZyBRdWVzdGlvblwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5mbGFnQnV0dG9uLmlubmVySFRNTCA9IFwiRmxhZyBRdWVzdGlvblwiO1xuICAgICAgICB9XG4gICAgICAgIGF3YWl0IHRoaXMucmVuZGVyVGltZWRRdWVzdGlvbigpO1xuICAgICAgICB0aGlzLmVuc3VyZUJ1dHRvblNhZmV0eSgpO1xuICAgIH1cblxuICAgIC8vIHNldCB1cCBldmVudHMgZm9yIG5hdmlnYXRpb25cbiAgICBuYXZCdG5MaXN0ZW5lcnMoKSB7XG4gICAgICAgIC8vIE5leHQgYW5kIFByZXYgTGlzdGVuZXJcbiAgICAgICAgdGhpcy5wYWdOYXZMaXN0LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICBcImNsaWNrXCIsXG4gICAgICAgICAgICB0aGlzLmhhbmRsZU5leHRQcmV2LmJpbmQodGhpcyksXG4gICAgICAgICAgICBmYWxzZSxcbiAgICAgICAgKTtcblxuICAgICAgICAvLyBOdW1iZXJlZCBMaXN0ZW5lclxuICAgICAgICB0aGlzLnFOdW1MaXN0LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICBcImNsaWNrXCIsXG4gICAgICAgICAgICB0aGlzLmhhbmRsZU51bWJlcmVkTmF2LmJpbmQodGhpcyksXG4gICAgICAgICAgICBmYWxzZSxcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBzZXQgdXAgZXZlbnQgZm9yIGZsYWdcbiAgICBmbGFnQnRuTGlzdGVuZXIoKSB7XG4gICAgICAgIHRoaXMuZmxhZ2dpbmdQbGFjZS5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgXCJjbGlja1wiLFxuICAgICAgICAgICAgdGhpcy5oYW5kbGVGbGFnLmJpbmQodGhpcyksIC8vIGNhbGxzIHRoaXMgdG8gdGFrZSBhY3Rpb25cbiAgICAgICAgICAgIGZhbHNlLFxuICAgICAgICApO1xuICAgIH1cblxuICAgIHJlbmRlclN1Ym1pdEJ1dHRvbigpIHtcbiAgICAgICAgdGhpcy5idXR0b25Db250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB0aGlzLmJ1dHRvbkNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwidGltZWQtY2VudGVyXCIpO1xuICAgICAgICB0aGlzLmZpbmlzaEJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICAgIHRoaXMuZmluaXNoQnV0dG9uLmlkID0gXCJmaW5pc2hcIjtcbiAgICAgICAgdGhpcy5maW5pc2hCdXR0b24uc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJidG4gYnRuLXByaW1hcnlcIik7XG4gICAgICAgIHRoaXMuZmluaXNoQnV0dG9uLnRleHRDb250ZW50ID0gXCJGaW5pc2ggRXhhbVwiO1xuICAgICAgICB0aGlzLmZpbmlzaEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgXCJjbGlja1wiLFxuICAgICAgICAgICAgYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGxldCBza2lwcGVkID0gdGhpcy5yZW5kZXJlZFF1ZXN0aW9uQXJyYXkuZmlsdGVyKFxuICAgICAgICAgICAgICAgICAgICAoeCkgPT4gIXgucXVlc3Rpb24uaXNBbnN3ZXJlZCxcbiAgICAgICAgICAgICAgICApLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBsZXQgc2tpcHN0ciA9XG4gICAgICAgICAgICAgICAgICAgIHNraXBwZWQgPiAwXG4gICAgICAgICAgICAgICAgICAgICAgICA/IGBZb3UgaGF2ZSBza2lwcGVkICR7c2tpcHBlZH0gcXVlc3Rpb24ocykuYFxuICAgICAgICAgICAgICAgICAgICAgICAgOiBcIlwiO1xuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmNvbmZpcm0oXG4gICAgICAgICAgICAgICAgICAgICAgICBgJHtza2lwc3RyfSBDbGlja2luZyBPSyBtZWFucyB5b3UgYXJlIHJlYWR5IHRvIHN1Ym1pdCB5b3VyIGFuc3dlcnMgYW5kIGFyZSBmaW5pc2hlZCB3aXRoIHRoaXMgYXNzZXNzbWVudC5gLFxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuZmluaXNoQXNzZXNzbWVudCgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmZsYWdCdXR0b24uY2xhc3NMaXN0LmFkZChcInRpbWVkLWhpZGRlblwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LmJpbmQodGhpcyksXG4gICAgICAgICAgICBmYWxzZSxcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5jb250cm9sRGl2LmFwcGVuZENoaWxkKHRoaXMuZmluaXNoQnV0dG9uKTtcbiAgICAgICAgdGhpcy5maW5pc2hCdXR0b24uY2xhc3NMaXN0LmFkZChcInRpbWVkLWhpZGRlblwiKTtcbiAgICAgICAgdGhpcy50aW1lZERpdi5hcHBlbmRDaGlsZCh0aGlzLmJ1dHRvbkNvbnRhaW5lcik7XG4gICAgfVxuICAgIGVuc3VyZUJ1dHRvblNhZmV0eSgpIHtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFF1ZXN0aW9uSW5kZXggPT09IDApIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnJlbmRlcmVkUXVlc3Rpb25BcnJheS5sZW5ndGggIT0gMSkge1xuICAgICAgICAgICAgICAgIHRoaXMucmlnaHRDb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZShcImRpc2FibGVkXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5sZWZ0Q29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJkaXNhYmxlZFwiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4ID49XG4gICAgICAgICAgICB0aGlzLnJlbmRlcmVkUXVlc3Rpb25BcnJheS5sZW5ndGggLSAxXG4gICAgICAgICkge1xuICAgICAgICAgICAgaWYgKHRoaXMucmVuZGVyZWRRdWVzdGlvbkFycmF5Lmxlbmd0aCAhPSAxKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sZWZ0Q29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoXCJkaXNhYmxlZFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucmlnaHRDb250YWluZXIuY2xhc3NMaXN0LmFkZChcImRpc2FibGVkXCIpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFF1ZXN0aW9uSW5kZXggPiAwICYmXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4IDwgdGhpcy5yZW5kZXJlZFF1ZXN0aW9uQXJyYXkubGVuZ3RoIC0gMVxuICAgICAgICApIHtcbiAgICAgICAgICAgIHRoaXMucmlnaHRDb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZShcImRpc2FibGVkXCIpO1xuICAgICAgICAgICAgdGhpcy5sZWZ0Q29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoXCJkaXNhYmxlZFwiKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZW5kZXJGZWVkYmFja0NvbnRhaW5lcigpIHtcbiAgICAgICAgdGhpcy5zY29yZURpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJQXCIpO1xuICAgICAgICBpZiAodGhpcy50YWtlbikge1xuICAgICAgICAgICAgdGhpcy5zY29yZURpdi5pbm5lckhUTUwgPVxuICAgICAgICAgICAgICAgIFwiPGgyPllvdSBoYXZlIGFscmVhZHkgdGFrZW4gdGhpcyBleGFtPC9oMj5cIjtcbiAgICAgICAgICAgIHRoaXMuc2NvcmVEaXYuY2xhc3NMaXN0LmFkZChcInRpbWVkLXZpc2libGVcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnNjb3JlRGl2LmlkID0gdGhpcy5kaXZpZCArIFwicmVzdWx0c1wiO1xuICAgICAgICAgICAgdGhpcy5zY29yZURpdi5jbGFzc0xpc3QuYWRkKFwidGltZWQtaGlkZGVuXCIpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmFwcGVuZENoaWxkKHRoaXMuc2NvcmVEaXYpO1xuICAgIH1cblxuICAgIGNyZWF0ZVJlbmRlcmVkUXVlc3Rpb25BcnJheSgpIHtcbiAgICAgICAgLy8gdGhpcyBmaW5kcyBhbGwgdGhlIGFzc2VzcyBxdWVzdGlvbnMgaW4gdGhpcyB0aW1lZCBhc3Nlc3NtZW50XG4gICAgICAgIC8vIFdlIG5lZWQgdG8gbWFrZSBhIGxpc3Qgb2YgYWxsIHRoZSBxdWVzdGlvbnMgdXAgZnJvbnQgc28gd2UgY2FuIHNldCB1cCBuYXZpZ2F0aW9uXG4gICAgICAgIC8vIGJ1dCB3ZSBkbyBub3Qgd2FudCB0byByZW5kZXIgdGhlIHF1ZXN0aW9ucyB1bnRpbCB0aGUgc3R1ZGVudCBoYXMgbmF2aWdhdGVkXG4gICAgICAgIC8vIEFsc28gYWRkcyB0aGVtIHRvIHRoaXMucmVuZGVyZWRRdWVzdGlvbkFycmF5XG5cbiAgICAgICAgLy8gdG9kbzogIFRoaXMgbmVlZHMgdG8gYmUgdXBkYXRlZCB0byBhY2NvdW50IGZvciB0aGUgcnVuZXN0b25lIGRpdiB3cmFwcGVyLlxuXG4gICAgICAgIC8vIFRvIGFjY29tbW9kYXRlIHRoZSBzZWxlY3RxdWVzdGlvbiB0eXBlIC0tIHdoaWNoIGlzIGFzeW5jISB3ZSBuZWVkIHRvIHdyYXBcbiAgICAgICAgLy8gYWxsIG9mIHRoaXMgaW4gYSBwcm9taXNlLCBzbyB0aGF0IHdlIGRvbid0IGNvbnRpbnVlIHRvIHJlbmRlciB0aGUgdGltZWRcbiAgICAgICAgLy8gZXhhbSB1bnRpbCBhbGwgb2YgdGhlIHF1ZXN0aW9ucyBoYXZlIGJlZW4gcmVhbGl6ZWQuXG4gICAgICAgIHZhciBvcHRzO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubmV3Q2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciB0bXBDaGlsZCA9IHRoaXMubmV3Q2hpbGRyZW5baV07XG4gICAgICAgICAgICBvcHRzID0ge1xuICAgICAgICAgICAgICAgIHN0YXRlOiBcInByZXBhcmVkXCIsXG4gICAgICAgICAgICAgICAgb3JpZzogdG1wQ2hpbGQsXG4gICAgICAgICAgICAgICAgcXVlc3Rpb246IHt9LFxuICAgICAgICAgICAgICAgIHVzZVJ1bmVzdG9uZVNlcnZpY2VzOiBlQm9va0NvbmZpZy51c2VSdW5lc3RvbmVTZXJ2aWNlcyxcbiAgICAgICAgICAgICAgICB0aW1lZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBhc3Nlc3NtZW50VGFrZW46IHRoaXMudGFrZW4sXG4gICAgICAgICAgICAgICAgdGltZWRXcmFwcGVyOiB0aGlzLmRpdmlkLFxuICAgICAgICAgICAgICAgIGluaXRBdHRlbXB0czogMCxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBsZXQgY29tcG9uZW50Q2hpbGQgPSB0bXBDaGlsZC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICAgICAgICAgIFwiOnNjb3BlID4gW2RhdGEtY29tcG9uZW50XVwiLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmIChjb21wb25lbnRDaGlsZCkge1xuICAgICAgICAgICAgICAgIHRtcENoaWxkID0gY29tcG9uZW50Q2hpbGQ7XG4gICAgICAgICAgICAgICAgb3B0cy5vcmlnID0gdG1wQ2hpbGQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodG1wQ2hpbGQubWF0Y2hlcyhcIltkYXRhLWNvbXBvbmVudF1cIikpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVkUXVlc3Rpb25BcnJheS5wdXNoKG9wdHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmFuZG9taXplUlFBKCkge1xuICAgICAgICB2YXIgY3VycmVudEluZGV4ID0gdGhpcy5yZW5kZXJlZFF1ZXN0aW9uQXJyYXkubGVuZ3RoLFxuICAgICAgICAgICAgdGVtcG9yYXJ5VmFsdWUsXG4gICAgICAgICAgICByYW5kb21JbmRleDtcbiAgICAgICAgLy8gV2hpbGUgdGhlcmUgcmVtYWluIGVsZW1lbnRzIHRvIHNodWZmbGUuLi5cbiAgICAgICAgd2hpbGUgKGN1cnJlbnRJbmRleCAhPT0gMCkge1xuICAgICAgICAgICAgLy8gUGljayBhIHJlbWFpbmluZyBlbGVtZW50Li4uXG4gICAgICAgICAgICByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGN1cnJlbnRJbmRleCk7XG4gICAgICAgICAgICBjdXJyZW50SW5kZXggLT0gMTtcbiAgICAgICAgICAgIC8vIEFuZCBzd2FwIGl0IHdpdGggdGhlIGN1cnJlbnQgZWxlbWVudC5cbiAgICAgICAgICAgIHRlbXBvcmFyeVZhbHVlID0gdGhpcy5yZW5kZXJlZFF1ZXN0aW9uQXJyYXlbY3VycmVudEluZGV4XTtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyZWRRdWVzdGlvbkFycmF5W2N1cnJlbnRJbmRleF0gPVxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZWRRdWVzdGlvbkFycmF5W3JhbmRvbUluZGV4XTtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyZWRRdWVzdGlvbkFycmF5W3JhbmRvbUluZGV4XSA9IHRlbXBvcmFyeVZhbHVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgcmVuZGVyVGltZWRRdWVzdGlvbigpIHtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFF1ZXN0aW9uSW5kZXggPj0gdGhpcy5yZW5kZXJlZFF1ZXN0aW9uQXJyYXkubGVuZ3RoKSB7XG4gICAgICAgICAgICAvLyBzb21ldGltZXMgdGhlIHVzZXIgY2xpY2tzIGluIHRoZSBldmVudCBhcmVhIGZvciB0aGUgcU51bUxpc3RcbiAgICAgICAgICAgIC8vIEJ1dCBtaXNzZXMgYSBudW1iZXIgaW4gdGhhdCBjYXNlIHRoZSB0ZXh0IGlzIHRoZSBjb25jYXRlbmF0aW9uXG4gICAgICAgICAgICAvLyBvZiBhbGwgdGhlIG51bWJlcnMgaW4gdGhlIGxpc3QhXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gY2hlY2sgdGhlIHJlbmRlcmVkUXVlc3Rpb25BcnJheSB0byBzZWUgaWYgaXQgaGFzIGJlZW4gcmVuZGVyZWQuXG4gICAgICAgIGxldCBvcHRzID0gdGhpcy5yZW5kZXJlZFF1ZXN0aW9uQXJyYXlbdGhpcy5jdXJyZW50UXVlc3Rpb25JbmRleF07XG4gICAgICAgIGxldCBjdXJyZW50UXVlc3Rpb247XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIG9wdHMuc3RhdGUgPT09IFwicHJlcGFyZWRcIiB8fFxuICAgICAgICAgICAgb3B0cy5zdGF0ZSA9PT0gXCJmb3JyZXZpZXdcIiB8fFxuICAgICAgICAgICAgKG9wdHMuc3RhdGUgPT09IFwiYnJva2VuX2V4YW1cIiAmJiBvcHRzLmluaXRBdHRlbXB0cyA8IDMpXG4gICAgICAgICkge1xuICAgICAgICAgICAgbGV0IHRtcENoaWxkID0gb3B0cy5vcmlnO1xuICAgICAgICAgICAgaWYgKHRtcENoaWxkICYmIHRtcENoaWxkLm1hdGNoZXMoXCJbZGF0YS1jb21wb25lbnQ9c2VsZWN0cXVlc3Rpb25dXCIpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZG9uZSAmJiBvcHRzLnN0YXRlID09IFwicHJlcGFyZWRcIikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVkUXVlc3Rpb25BcnJheVtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFF1ZXN0aW9uSW5kZXhcbiAgICAgICAgICAgICAgICAgICAgXS5zdGF0ZSA9IFwiZXhhbV9lbmRlZFwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFNlbGVjdE9uZSBpcyBhc3luYyBhbmQgd2lsbCByZXBsYWNlIGl0c2VsZiBpbiB0aGlzIGFycmF5IHdpdGhcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhlIGFjdHVhbCBzZWxlY3RlZCBxdWVzdGlvblxuICAgICAgICAgICAgICAgICAgICBvcHRzLnJxYSA9IHRoaXMucmVuZGVyZWRRdWVzdGlvbkFycmF5O1xuICAgICAgICAgICAgICAgICAgICBsZXQgbmV3cSA9IG5ldyBTZWxlY3RPbmUob3B0cyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZWRRdWVzdGlvbkFycmF5W3RoaXMuY3VycmVudFF1ZXN0aW9uSW5kZXhdID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcXVlc3Rpb246IG5ld3EsXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBuZXdxLmluaXRpYWxpemUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvcHRzLnN0YXRlID09IFwiYnJva2VuX2V4YW1cIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJlbW92ZSB0aGUgYnJva2VuIGNsYXNzIGZyb20gdGhpcyBxdWVzdGlvbiBpZiB3ZSBnZXQgaGVyZS5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnFOdW1JdGVtKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk/LmNsYXNzTGlzdC5yZW1vdmUoXCJicm9rZW5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdHMuc3RhdGUgPSBcImJyb2tlbl9leGFtXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVkUXVlc3Rpb25BcnJheVt0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4XSA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0cztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBFcnJvciBpbml0aWFsaXppbmcgcXVlc3Rpb246IERldGFpbHMgJHtlfWAsXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmICh0bXBDaGlsZCAmJiB0bXBDaGlsZC5tYXRjaGVzKFwiW2RhdGEtY29tcG9uZW50XVwiKSkge1xuICAgICAgICAgICAgICAgIGxldCBjb21wb25lbnRLaW5kID0gdG1wQ2hpbGQuZGF0YXNldC5jb21wb25lbnQ7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlZFF1ZXN0aW9uQXJyYXlbdGhpcy5jdXJyZW50UXVlc3Rpb25JbmRleF0gPSB7XG4gICAgICAgICAgICAgICAgICAgIHF1ZXN0aW9uOiB3aW5kb3cuY29tcG9uZW50X2ZhY3RvcnlbY29tcG9uZW50S2luZF0ob3B0cyksXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlOiBvcHRzLnN0YXRlLFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAob3B0cy5zdGF0ZSA9PT0gXCJicm9rZW5fZXhhbVwiKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjdXJyZW50UXVlc3Rpb24gPVxuICAgICAgICAgICAgdGhpcy5yZW5kZXJlZFF1ZXN0aW9uQXJyYXlbdGhpcy5jdXJyZW50UXVlc3Rpb25JbmRleF0ucXVlc3Rpb247XG4gICAgICAgIGlmIChvcHRzLnN0YXRlID09PSBcImZvcnJldmlld1wiKSB7XG4gICAgICAgICAgICBhd2FpdCBjdXJyZW50UXVlc3Rpb24uY29tcG9uZW50X3JlYWR5X3Byb21pc2U7XG4gICAgICAgICAgICBhd2FpdCBjdXJyZW50UXVlc3Rpb24uY2hlY2tDdXJyZW50QW5zd2VyKCk7XG4gICAgICAgICAgICBjdXJyZW50UXVlc3Rpb24ucmVuZGVyRmVlZGJhY2soKTtcbiAgICAgICAgICAgIGN1cnJlbnRRdWVzdGlvbi5kaXNhYmxlSW50ZXJhY3Rpb24oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy52aXNpdGVkLmluY2x1ZGVzKHRoaXMuY3VycmVudFF1ZXN0aW9uSW5kZXgpKSB7XG4gICAgICAgICAgICB0aGlzLnZpc2l0ZWQucHVzaCh0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4KTtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICB0aGlzLnZpc2l0ZWQubGVuZ3RoID09PSB0aGlzLnJlbmRlcmVkUXVlc3Rpb25BcnJheS5sZW5ndGggJiZcbiAgICAgICAgICAgICAgICAhdGhpcy5kb25lXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmZpbmlzaEJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKFwidGltZWQtaGlkZGVuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGN1cnJlbnRRdWVzdGlvbi5jb250YWluZXJEaXYpIHtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVlc3Rpb24uY29udGFpbmVyRGl2LmNsYXNzTGlzdC5jb250YWlucyhcInJ1bmVzdG9uZVwiKSA9PVxuICAgICAgICAgICAgICAgIGZhbHNlXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVlc3Rpb24uY29udGFpbmVyRGl2LmNsYXNzTGlzdC5hZGQoXCJydW5lc3RvbmVcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnN3aXRjaERpdi5yZXBsYWNlV2l0aChjdXJyZW50UXVlc3Rpb24uY29udGFpbmVyRGl2KTtcbiAgICAgICAgICAgIHRoaXMuc3dpdGNoRGl2ID0gY3VycmVudFF1ZXN0aW9uLmNvbnRhaW5lckRpdjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIHRoZSB0aW1lZCBjb21wb25lbnQgaGFzIGxpc3RlbmVycywgdGhvc2UgbWlnaHQgbmVlZCB0byBiZSByZWluaXRpYWxpemVkXG4gICAgICAgIC8vIFRoaXMgZmxhZyB3aWxsIG9ubHkgYmUgc2V0IGluIHRoZSBlbGVtZW50cyB0aGF0IG5lZWQgaXQtLWl0IHdpbGwgYmUgdW5kZWZpbmVkIGluIHRoZSBvdGhlcnMgYW5kIHRodXMgZXZhbHVhdGUgdG8gZmFsc2VcbiAgICAgICAgaWYgKGN1cnJlbnRRdWVzdGlvbi5uZWVkc1JlaW5pdGlhbGl6YXRpb24pIHtcbiAgICAgICAgICAgIGN1cnJlbnRRdWVzdGlvbi5yZWluaXRpYWxpemVMaXN0ZW5lcnModGhpcy50YWtlbik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09PSBUaW1lciBhbmQgY29udHJvbCBGdW5jdGlvbnMgPT09XG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbiAgICBoYW5kbGVQcmV2QXNzZXNzbWVudCgpIHtcbiAgICAgICAgdGhpcy5zdGFydEJ0bi5jbGFzc0xpc3QuYWRkKFwidGltZWQtaGlkZGVuXCIpO1xuICAgICAgICB0aGlzLnBhdXNlQnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5maW5pc2hCdXR0b24uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLnJ1bm5pbmcgPSAwO1xuICAgICAgICB0aGlzLmRvbmUgPSAxO1xuICAgICAgICAvLyBzaG93RmVlZGJhY2sgc2FuZCBzaG93UmVzdWx0cyBzaG91bGQgYm90aCBiZSB0cnVlIGJlZm9yZSB3ZSBzaG93IHRoZVxuICAgICAgICAvLyBxdWVzdGlvbnMgYW5kIHRoZWlyIHN0YXRlIG9mIGNvcnJlY3RuZXNzLlxuICAgICAgICBpZiAodGhpcy5zaG93UmVzdWx0cyAmJiB0aGlzLnNob3dGZWVkYmFjaykge1xuICAgICAgICAgICAgdGhpcy50aW1lZERpdi5jbGFzc0xpc3QucmVtb3ZlKFwidGltZWQtaGlkZGVuXCIpO1xuICAgICAgICAgICAgdGhpcy5yZXN0b3JlQW5zd2VyZWRRdWVzdGlvbnMoKTsgLy8gZG8gbm90IGxvZyB0aGVzZSByZXN1bHRzXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnBhdXNlQnRuLmNsYXNzTGlzdC5hZGQoXCJ0aW1lZC1oaWRkZW5cIik7XG4gICAgICAgICAgICB0aGlzLnRpbWVyQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJ0aW1lZC1oaWRkZW5cIik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgc3RhcnRBc3Nlc3NtZW50KCkge1xuICAgICAgICBpZiAoIXRoaXMudGFrZW4pIHtcbiAgICAgICAgICAgIGhpZGVFbGVtZW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVsYXRpb25zLW5leHRcIikpOyAvLyBoaWRlIHRoZSBuZXh0IHBhZ2UgYnV0dG9uIGZvciBub3dcbiAgICAgICAgICAgIGhpZGVFbGVtZW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVsYXRpb25zLXByZXZcIikpOyAvLyBoaWRlIHRoZSBwcmV2aW91cyBidXR0b24gZm9yIG5vd1xuICAgICAgICAgICAgdGhpcy5zdGFydEJ0bi5jbGFzc0xpc3QuYWRkKFwidGltZWQtaGlkZGVuXCIpO1xuICAgICAgICAgICAgdGhpcy5wYXVzZUJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgaWYgKHRoaXMucnVubmluZyA9PT0gMCAmJiB0aGlzLnBhdXNlZCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMucnVubmluZyA9IDE7XG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0VGltZSA9IERhdGUubm93KCk7XG4gICAgICAgICAgICAgICAgdGhpcy50aW1lZERpdi5jbGFzc0xpc3QucmVtb3ZlKFwidGltZWQtaGlkZGVuXCIpO1xuICAgICAgICAgICAgICAgIHRoaXMuaW5jcmVtZW50KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2dCb29rRXZlbnQoe1xuICAgICAgICAgICAgICAgICAgICBldmVudDogXCJ0aW1lZEV4YW1cIixcbiAgICAgICAgICAgICAgICAgICAgYWN0OiBcInN0YXJ0XCIsXG4gICAgICAgICAgICAgICAgICAgIGRpdl9pZDogdGhpcy5kaXZpZCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB2YXIgdGltZVN0YW1wID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgICAgICB2YXIgc3RvcmFnZU9iaiA9IHtcbiAgICAgICAgICAgICAgICAgICAgYW5zd2VyOiBbMCwgMCwgdGhpcy5yZW5kZXJlZFF1ZXN0aW9uQXJyYXkubGVuZ3RoLCAwXSxcbiAgICAgICAgICAgICAgICAgICAgdGltZXN0YW1wOiB0aW1lU3RhbXAsXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2NhbFN0b3JhZ2VLZXkoKSxcbiAgICAgICAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoc3RvcmFnZU9iaiksXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuYmVmb3JlVW5sb2FkSGFuZGxlciA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgICAgIC8vIHRoaXMgYWN0dWFsIHZhbHVlIGdldHMgaWdub3JlZCBieSBuZXdlciBicm93c2Vyc1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmRvbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGV2ZW50LnJldHVyblZhbHVlID1cbiAgICAgICAgICAgICAgICAgICAgXCJBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gbGVhdmU/ICBZb3VyIHdvcmsgd2lsbCBiZSBsb3N0ISBBbmQgeW91IHdpbGwgbmVlZCB5b3VyIGluc3RydWN0b3IgdG8gcmVzZXQgdGhlIGV4YW0hXCI7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGxlYXZlPyAgWW91ciB3b3JrIHdpbGwgYmUgbG9zdCFcIjtcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKTtcbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiYmVmb3JldW5sb2FkXCIsIHRoaXMuYmVmb3JlVW5sb2FkSGFuZGxlcik7XG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgICAgICBcInBhZ2VoaWRlXCIsXG4gICAgICAgICAgICAgICAgYXN5bmMgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5kb25lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmZpbmlzaEFzc2Vzc21lbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRXhhbSBleGl0ZWQgYnkgbGVhdmluZyBwYWdlXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlUHJldkFzc2Vzc21lbnQoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBwYXVzZUFzc2Vzc21lbnQoKSB7XG4gICAgICAgIGlmICh0aGlzLmRvbmUgPT09IDApIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnJ1bm5pbmcgPT09IDEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ0Jvb2tFdmVudCh7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50OiBcInRpbWVkRXhhbVwiLFxuICAgICAgICAgICAgICAgICAgICBhY3Q6IFwicGF1c2VcIixcbiAgICAgICAgICAgICAgICAgICAgZGl2X2lkOiB0aGlzLmRpdmlkLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHRoaXMucnVubmluZyA9IDA7XG4gICAgICAgICAgICAgICAgdGhpcy5wYXVzZWQgPSAxO1xuICAgICAgICAgICAgICAgIHRoaXMucGF1c2VCdG4uaW5uZXJIVE1MID0gXCJSZXN1bWVcIjtcbiAgICAgICAgICAgICAgICB0aGlzLnRpbWVkRGl2LmNsYXNzTGlzdC5hZGQoXCJ0aW1lZC1oaWRkZW5cIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMubG9nQm9va0V2ZW50KHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQ6IFwidGltZWRFeGFtXCIsXG4gICAgICAgICAgICAgICAgICAgIGFjdDogXCJyZXN1bWVcIixcbiAgICAgICAgICAgICAgICAgICAgZGl2X2lkOiB0aGlzLmRpdmlkLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHRoaXMucnVubmluZyA9IDE7XG4gICAgICAgICAgICAgICAgdGhpcy5wYXVzZWQgPSAwO1xuICAgICAgICAgICAgICAgIHRoaXMuaW5jcmVtZW50KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5wYXVzZUJ0bi5pbm5lckhUTUwgPSBcIlBhdXNlXCI7XG4gICAgICAgICAgICAgICAgdGhpcy50aW1lZERpdi5jbGFzc0xpc3QucmVtb3ZlKFwidGltZWQtaGlkZGVuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2hvd1RpbWUoKSB7XG4gICAgICAgIGlmICh0aGlzLnNob3dUaW1lcikge1xuICAgICAgICAgICAgdmFyIG1pbnMgPSBNYXRoLmZsb29yKHRoaXMudGltZUxpbWl0IC8gNjApO1xuICAgICAgICAgICAgdmFyIHNlY3MgPSBNYXRoLmZsb29yKHRoaXMudGltZUxpbWl0KSAlIDYwO1xuICAgICAgICAgICAgdmFyIG1pbnNTdHJpbmcgPSBtaW5zO1xuICAgICAgICAgICAgdmFyIHNlY3NTdHJpbmcgPSBzZWNzO1xuICAgICAgICAgICAgaWYgKG1pbnMgPCAxMCkge1xuICAgICAgICAgICAgICAgIG1pbnNTdHJpbmcgPSBcIjBcIiArIG1pbnM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2VjcyA8IDEwKSB7XG4gICAgICAgICAgICAgICAgc2Vjc1N0cmluZyA9IFwiMFwiICsgc2VjcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBiZWdpbm5pbmcgPSBcIlRpbWUgUmVtYWluaW5nICAgIFwiO1xuICAgICAgICAgICAgaWYgKCF0aGlzLmxpbWl0ZWRUaW1lKSB7XG4gICAgICAgICAgICAgICAgYmVnaW5uaW5nID0gXCJUaW1lIFRha2VuICAgIFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHRpbWVTdHJpbmcgPSBiZWdpbm5pbmcgKyBtaW5zU3RyaW5nICsgXCI6XCIgKyBzZWNzU3RyaW5nO1xuICAgICAgICAgICAgaWYgKHRoaXMuZG9uZSB8fCB0aGlzLnRha2VuKSB7XG4gICAgICAgICAgICAgICAgdmFyIG1pbnV0ZXMgPSBNYXRoLmZsb29yKHRoaXMudGltZVRha2VuIC8gNjApO1xuICAgICAgICAgICAgICAgIHZhciBzZWNvbmRzID0gTWF0aC5mbG9vcih0aGlzLnRpbWVUYWtlbiAlIDYwKTtcbiAgICAgICAgICAgICAgICBpZiAobWludXRlcyA8IDEwKSB7XG4gICAgICAgICAgICAgICAgICAgIG1pbnV0ZXMgPSBcIjBcIiArIG1pbnV0ZXM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChzZWNvbmRzIDwgMTApIHtcbiAgICAgICAgICAgICAgICAgICAgc2Vjb25kcyA9IFwiMFwiICsgc2Vjb25kcztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGltZVN0cmluZyA9IFwiVGltZSB0YWtlbjogXCIgKyBtaW51dGVzICsgXCI6XCIgKyBzZWNvbmRzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy50aW1lckNvbnRhaW5lci5pbm5lckhUTUwgPSB0aW1lU3RyaW5nO1xuICAgICAgICAgICAgdmFyIHRpbWVUaXBzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInRpbWVUaXBcIik7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8PSB0aW1lVGlwcy5sZW5ndGggLSAxOyBpKyspIHtcbiAgICAgICAgICAgICAgICB0aW1lVGlwc1tpXS50aXRsZSA9IHRpbWVTdHJpbmc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnRpbWVyQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJ0aW1lZC1oaWRkZW5cIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpbmNyZW1lbnQoKSB7XG4gICAgICAgIC8vIGlmIHJ1bm5pbmcgKG5vdCBwYXVzZWQpIGFuZCBub3QgdGFrZW5cbiAgICAgICAgaWYgKHRoaXMucnVubmluZyA9PT0gMSAmJiAhdGhpcy50YWtlbikge1xuICAgICAgICAgICAgc2V0VGltZW91dChcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFdoZW4gYSBicm93c2VyIGxvc2VzIGZvY3VzLCBzZXRUaW1lb3V0IG1heSBub3QgYmUgY2FsbGVkIG9uIHRoZVxuICAgICAgICAgICAgICAgICAgICAvLyBzY2hlZHVsZSBleHBlY3RlZC4gIEJyb3dzZXJzIGFyZSBmcmVlIHRvIHNhdmUgcG93ZXIgYnkgbGVuZ3RoZW5pbmdcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhlIGludGVydmFsIHRvIHNvbWUgbG9uZ2VyIHRpbWUuICBTbyB3ZSBjYW5ub3QganVzdCBzdWJ0cmFjdCAxXG4gICAgICAgICAgICAgICAgICAgIC8vIGZyb20gdGhlIHRpbWVMaW1pdCB3ZSBuZWVkIHRvIG1lYXN1cmUgdGhlIGVsYXBzZWQgdGltZSBmcm9tIHRoZSBsYXN0XG4gICAgICAgICAgICAgICAgICAgIC8vIGNhbGwgdG8gdGhlIGN1cnJlbnQgY2FsbCBhbmQgc3VidHJhY3QgdGhhdCBudW1iZXIgb2Ygc2Vjb25kcy5cbiAgICAgICAgICAgICAgICAgICAgbGV0IGN1cnJlbnRUaW1lID0gRGF0ZS5ub3coKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMubGltaXRlZFRpbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIElmIHRoZXJlJ3MgYSB0aW1lIGxpbWl0LCBjb3VudCBkb3duIHRvIDBcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGltZUxpbWl0ID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRpbWVMaW1pdCAtXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5mbG9vcigoY3VycmVudFRpbWUgLSB0aGlzLmxhc3RUaW1lKSAvIDEwMDApO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRWxzZSBjb3VudCB1cCB0byBrZWVwIHRyYWNrIG9mIGhvdyBsb25nIGl0IHRvb2sgdG8gY29tcGxldGVcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGltZUxpbWl0ID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRpbWVMaW1pdCArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5mbG9vcigoY3VycmVudFRpbWUgLSB0aGlzLmxhc3RUaW1lKSAvIDEwMDApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGFzdFRpbWUgPSBjdXJyZW50VGltZTtcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXG4gICAgICAgICAgICAgICAgICAgICAgICBlQm9va0NvbmZpZy5lbWFpbCArIFwiOlwiICsgdGhpcy5kaXZpZCArIFwiLXRpbWVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGltZUxpbWl0LFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNob3dUaW1lKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnRpbWVMaW1pdCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5jcmVtZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyByYW4gb3V0IG9mIHRpbWVcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhcnRCdG4uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5maW5pc2hCdXR0b24uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ydW5uaW5nID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZG9uZSA9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMudGFrZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRha2VuID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBlbWJlZCB0aGUgbWVzc2FnZSBpbiB0aGUgcGFnZSAtLSBhbiBhbGVydCBhY3R1YWxseSBwcmV2ZW50c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoZSBhbnN3ZXJzIGZyb20gYmVpbmcgc3VibWl0dGVkIGFuZCBpZiBhIHN0dWRlbnQgY2xvc2VzIHRoZWlyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbGFwdG9wIHRoZW4gdGhlIGFuc3dlcnMgd2lsbCBub3QgYmUgc3VibWl0dGVkIGV2ZXIhICBFdmVuIHdoZW4gdGhleVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJlb3BlbiB0aGUgbGFwdG9wIHRoZWlyIHNlc3Npb24gY29va2llIGlzIGxpa2VseSBpbnZhbGlkLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBtZXNzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImgxXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3MuaW5uZXJIVE1MID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJTb3JyeSBidXQgeW91IHJhbiBvdXQgb2YgdGltZS4gWW91ciBhbnN3ZXJzIGFyZSBiZWluZyBzdWJtaXR0ZWRcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRyb2xEaXYuYXBwZW5kQ2hpbGQobWVzcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5maW5pc2hBc3Nlc3NtZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LmJpbmQodGhpcyksXG4gICAgICAgICAgICAgICAgMTAwMCxcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdHlsZUV4YW1FbGVtZW50cygpIHtcbiAgICAgICAgLy8gQ2hlY2tzIGlmIHRoaXMgZXhhbSBoYXMgYmVlbiB0YWtlbiBiZWZvcmVcbiAgICAgICAgdGhpcy50aW1lckNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwidGltZWQtc3VtbWFyeS1zdHlsZVwiKTtcbiAgICAgICAgdGhpcy5zY29yZURpdi5jbGFzc0xpc3QuYWRkKFwidGltZWQtc3VtbWFyeS1zdHlsZVwiKTtcbiAgICAgICAgZm9yIChjb25zdCB0aXAgb2YgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi50b29sdGlwVGltZVwiKSkge1xuICAgICAgICAgICAgdGlwLmNsYXNzTGlzdC5hZGQoXCJ0aW1lZC10b29sdGlwLXRpbWVcIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyBmaW5pc2hBc3Nlc3NtZW50KCkge1xuICAgICAgICBzaG93RWxlbWVudChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlbGF0aW9ucy1uZXh0XCIpKTsgLy8gc2hvdyB0aGUgbmV4dCBwYWdlIGJ1dHRvbiBmb3Igbm93XG4gICAgICAgIHNob3dFbGVtZW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVsYXRpb25zLXByZXZcIikpOyAvLyBzaG93IHRoZSBwcmV2aW91cyBidXR0b24gZm9yIG5vd1xuICAgICAgICBpZiAoIXRoaXMuc2hvd0ZlZWRiYWNrKSB7XG4gICAgICAgICAgICAvLyBiamUgLSBjaGFuZ2VkIGZyb20gc2hvd1Jlc3VsdHNcbiAgICAgICAgICAgIHRoaXMudGltZWREaXYuY2xhc3NMaXN0LmFkZChcInRpbWVkLWhpZGRlblwiKTtcbiAgICAgICAgICAgIHRoaXMucGF1c2VCdG4uY2xhc3NMaXN0LmFkZChcInRpbWVkLWhpZGRlblwiKTtcbiAgICAgICAgICAgIHRoaXMudGltZXJDb250YWluZXIuY2xhc3NMaXN0LmFkZChcInRpbWVkLWhpZGRlblwiKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmZpbmRUaW1lVGFrZW4oKTtcbiAgICAgICAgdGhpcy5ydW5uaW5nID0gMDtcbiAgICAgICAgdGhpcy5kb25lID0gMTtcbiAgICAgICAgdGhpcy50YWtlbiA9IDE7XG4gICAgICAgIGF3YWl0IHRoaXMuZmluYWxpemVQcm9ibGVtcygpO1xuICAgICAgICB0aGlzLmNoZWNrU2NvcmUoKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5U2NvcmUoKTtcbiAgICAgICAgdGhpcy5zdG9yZVNjb3JlKCk7XG4gICAgICAgIHRoaXMubG9nU2NvcmUoKTtcbiAgICAgICAgdGhpcy5wYXVzZUJ0bi5kaXNhYmxlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuZmluaXNoQnV0dG9uLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgaWYgKHRoaXMuYmVmb3JlVW5sb2FkSGFuZGxlcikge1xuICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICAgICAgXCJiZWZvcmV1bmxvYWRcIixcbiAgICAgICAgICAgICAgICB0aGlzLmJlZm9yZVVubG9hZEhhbmRsZXIsXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIC8vIHR1cm4gb2ZmIHRoZSBwYWdlaGlkZSBsaXN0ZW5lclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc3VibWl0QXV0b2dyYWRlKCk7XG4gICAgICAgIH0sIDIwMDApO1xuICAgIH1cblxuICAgIGFzeW5jIHN1Ym1pdEF1dG9ncmFkZSgpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFwiL2Fzc2lnbm1lbnQvc3R1ZGVudC9hdXRvZ3JhZGVcIiwge1xuICAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgICAgICAgaGVhZGVyczogeyBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiB9LFxuICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICAgICAgYXNzaWdubWVudF9pZDogdGhpcy5kaXZpZCxcbiAgICAgICAgICAgICAgICAgICAgaXNfdGltZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGxldCByZXRkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICAgICAgaWYgKHJldGRhdGEuc3VjY2VzcyA9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJldGRhdGEubWVzc2FnZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQXV0b2dyYWRlciBjb21wbGV0ZWRcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYEVycm9yIHN1Ym1pdHRpbmcgZXhhbSBmb3IgYXV0b2dyYWRpbmc6ICR7ZXJyfWApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gZmluYWxpemVQcm9ibGVtc1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS1cbiAgICBhc3luYyBmaW5hbGl6ZVByb2JsZW1zKCkge1xuICAgICAgICAvLyBCZWNhdXNlIHdlIGhhdmUgc3VibWl0dGVkIGVhY2ggcXVlc3Rpb24gYXMgd2UgbmF2aWdhdGUgd2Ugb25seSBuZWVkIHRvXG4gICAgICAgIC8vIHNlbmQgdGhlIGZpbmFsIHZlcnNpb24gb2YgdGhlIHF1ZXN0aW9uIHRoZSBzdHVkZW50IGlzIG9uIHdoZW4gdGhleSBwcmVzcyB0aGVcbiAgICAgICAgLy8gZmluaXNoIGV4YW0gYnV0dG9uLlxuXG4gICAgICAgIHZhciBjdXJyZW50UXVlc3Rpb24gPVxuICAgICAgICAgICAgdGhpcy5yZW5kZXJlZFF1ZXN0aW9uQXJyYXlbdGhpcy5jdXJyZW50UXVlc3Rpb25JbmRleF0ucXVlc3Rpb247XG4gICAgICAgIGF3YWl0IGN1cnJlbnRRdWVzdGlvbi5jaGVja0N1cnJlbnRBbnN3ZXIoKTtcbiAgICAgICAgYXdhaXQgY3VycmVudFF1ZXN0aW9uLmxvZ0N1cnJlbnRBbnN3ZXIoKTtcbiAgICAgICAgY3VycmVudFF1ZXN0aW9uLnJlbmRlckZlZWRiYWNrKCk7XG4gICAgICAgIGN1cnJlbnRRdWVzdGlvbi5kaXNhYmxlSW50ZXJhY3Rpb24oKTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucmVuZGVyZWRRdWVzdGlvbkFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgY3VycmVudFF1ZXN0aW9uID0gdGhpcy5yZW5kZXJlZFF1ZXN0aW9uQXJyYXlbaV07XG4gICAgICAgICAgICAvLyBzZXQgdGhlIHN0YXRlIHRvIGZvcnJldmlldyBzbyB3ZSBrbm93IHRoYXQgZmVlZGJhY2sgbWF5IGJlIGFwcHJvcHJpYXRlXG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXN0aW9uLnN0YXRlICE9PSBcImJyb2tlbl9leGFtXCIpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVlc3Rpb24uc3RhdGUgPSBcImZvcnJldmlld1wiO1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWVzdGlvbi5xdWVzdGlvbi5kaXNhYmxlSW50ZXJhY3Rpb24oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5zaG93RmVlZGJhY2spIHtcbiAgICAgICAgICAgIHRoaXMuaGlkZVRpbWVkRmVlZGJhY2soKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIHJlc3RvcmVBbnN3ZXJlZFF1ZXN0aW9uc1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHJlc3RvcmVBbnN3ZXJlZFF1ZXN0aW9ucygpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnJlbmRlcmVkUXVlc3Rpb25BcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGN1cnJlbnRRdWVzdGlvbiA9IHRoaXMucmVuZGVyZWRRdWVzdGlvbkFycmF5W2ldO1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWVzdGlvbi5zdGF0ZSA9PT0gXCJwcmVwYXJlZFwiKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXN0aW9uLnN0YXRlID0gXCJmb3JyZXZpZXdcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGhpZGVUaW1lZEZlZWRiYWNrXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBoaWRlVGltZWRGZWVkYmFjaygpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnJlbmRlcmVkUXVlc3Rpb25BcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGN1cnJlbnRRdWVzdGlvbiA9IHRoaXMucmVuZGVyZWRRdWVzdGlvbkFycmF5W2ldLnF1ZXN0aW9uO1xuICAgICAgICAgICAgY3VycmVudFF1ZXN0aW9uLmhpZGVGZWVkYmFjaygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gY2hlY2tTY29yZVxuICAgIC8vIC0tLS0tLS0tLS1cbiAgICAvLyBUaGlzIGlzIGEgc2ltcGxlIGFsbCBvciBub3RoaW5nIHNjb3JlIG9mIG9uZSBwb2ludCBwZXIgcXVlc3Rpb24gZm9yXG4gICAgLy8gdGhhdCBpbmNsdWRlcyBvdXIgYmVzdCBndWVzcyBpZiBhIHF1ZXN0aW9uIHdhcyBza2lwcGVkLlxuICAgIGNoZWNrU2NvcmUoKSB7XG4gICAgICAgIHRoaXMuY29ycmVjdFN0ciA9IFwiXCI7XG4gICAgICAgIHRoaXMuc2tpcHBlZFN0ciA9IFwiXCI7XG4gICAgICAgIHRoaXMuaW5jb3JyZWN0U3RyID0gXCJcIjtcbiAgICAgICAgLy8gR2V0cyB0aGUgc2NvcmUgb2YgZWFjaCBwcm9ibGVtXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5yZW5kZXJlZFF1ZXN0aW9uQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBjb3JyZWN0ID1cbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVkUXVlc3Rpb25BcnJheVtpXS5xdWVzdGlvbi5jaGVja0NvcnJlY3RUaW1lZCgpO1xuICAgICAgICAgICAgaWYgKGNvcnJlY3QgPT0gXCJUXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNjb3JlKys7XG4gICAgICAgICAgICAgICAgdGhpcy5jb3JyZWN0U3RyID0gdGhpcy5jb3JyZWN0U3RyICsgKGkgKyAxKSArIFwiLCBcIjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29ycmVjdCA9PSBcIkZcIikge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5jb3JyZWN0Kys7XG4gICAgICAgICAgICAgICAgdGhpcy5pbmNvcnJlY3RTdHIgPSB0aGlzLmluY29ycmVjdFN0ciArIChpICsgMSkgKyBcIiwgXCI7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvcnJlY3QgPT09IG51bGwgfHwgY29ycmVjdCA9PT0gXCJJXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNraXBwZWQrKztcbiAgICAgICAgICAgICAgICB0aGlzLnNraXBwZWRTdHIgPSB0aGlzLnNraXBwZWRTdHIgKyAoaSArIDEpICsgXCIsIFwiO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBpZ25vcmVkIHF1ZXN0aW9uOyBqdXN0IGRvIG5vdGhpbmdcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyByZW1vdmUgZXh0cmEgY29tbWEgYW5kIHNwYWNlIGF0IGVuZCBpZiBhbnlcbiAgICAgICAgaWYgKHRoaXMuY29ycmVjdFN0ci5sZW5ndGggPiAwKVxuICAgICAgICAgICAgdGhpcy5jb3JyZWN0U3RyID0gdGhpcy5jb3JyZWN0U3RyLnN1YnN0cmluZyhcbiAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgIHRoaXMuY29ycmVjdFN0ci5sZW5ndGggLSAyLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgZWxzZSB0aGlzLmNvcnJlY3RTdHIgPSBcIk5vbmVcIjtcbiAgICAgICAgaWYgKHRoaXMuc2tpcHBlZFN0ci5sZW5ndGggPiAwKVxuICAgICAgICAgICAgdGhpcy5za2lwcGVkU3RyID0gdGhpcy5za2lwcGVkU3RyLnN1YnN0cmluZyhcbiAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgIHRoaXMuc2tpcHBlZFN0ci5sZW5ndGggLSAyLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgZWxzZSB0aGlzLnNraXBwZWRTdHIgPSBcIk5vbmVcIjtcbiAgICAgICAgaWYgKHRoaXMuaW5jb3JyZWN0U3RyLmxlbmd0aCA+IDApXG4gICAgICAgICAgICB0aGlzLmluY29ycmVjdFN0ciA9IHRoaXMuaW5jb3JyZWN0U3RyLnN1YnN0cmluZyhcbiAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgIHRoaXMuaW5jb3JyZWN0U3RyLmxlbmd0aCAtIDIsXG4gICAgICAgICAgICApO1xuICAgICAgICBlbHNlIHRoaXMuaW5jb3JyZWN0U3RyID0gXCJOb25lXCI7XG4gICAgfVxuICAgIGZpbmRUaW1lVGFrZW4oKSB7XG4gICAgICAgIGlmICh0aGlzLmxpbWl0ZWRUaW1lKSB7XG4gICAgICAgICAgICB0aGlzLnRpbWVUYWtlbiA9IHRoaXMuc3RhcnRpbmdUaW1lIC0gdGhpcy50aW1lTGltaXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnRpbWVUYWtlbiA9IHRoaXMudGltZUxpbWl0O1xuICAgICAgICB9XG4gICAgfVxuICAgIHN0b3JlU2NvcmUoKSB7XG4gICAgICAgIHZhciBzdG9yYWdlX2FyciA9IFtdO1xuICAgICAgICBzdG9yYWdlX2Fyci5wdXNoKFxuICAgICAgICAgICAgdGhpcy5zY29yZSxcbiAgICAgICAgICAgIHRoaXMuY29ycmVjdFN0cixcbiAgICAgICAgICAgIHRoaXMuaW5jb3JyZWN0LFxuICAgICAgICAgICAgdGhpcy5pbmNvcnJlY3RTdHIsXG4gICAgICAgICAgICB0aGlzLnNraXBwZWQsXG4gICAgICAgICAgICB0aGlzLnNraXBwZWRTdHIsXG4gICAgICAgICAgICB0aGlzLnRpbWVUYWtlbixcbiAgICAgICAgKTtcbiAgICAgICAgdmFyIHRpbWVTdGFtcCA9IG5ldyBEYXRlKCk7XG4gICAgICAgIHZhciBzdG9yYWdlT2JqID0gSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgYW5zd2VyOiBzdG9yYWdlX2FycixcbiAgICAgICAgICAgIHRpbWVzdGFtcDogdGltZVN0YW1wLFxuICAgICAgICB9KTtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0odGhpcy5sb2NhbFN0b3JhZ2VLZXkoKSwgc3RvcmFnZU9iaik7XG4gICAgfVxuICAgIC8vIF9gdGltZWQgZXhhbSBlbmRwb2ludCBwYXJhbWV0ZXJzYFxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGxvZ1Njb3JlKCkge1xuICAgICAgICB0aGlzLmxvZ0Jvb2tFdmVudCh7XG4gICAgICAgICAgICBldmVudDogXCJ0aW1lZEV4YW1cIixcbiAgICAgICAgICAgIGFjdDogXCJmaW5pc2hcIixcbiAgICAgICAgICAgIGRpdl9pZDogdGhpcy5kaXZpZCxcbiAgICAgICAgICAgIGNvcnJlY3Q6IHRoaXMuc2NvcmUsXG4gICAgICAgICAgICBpbmNvcnJlY3Q6IHRoaXMuaW5jb3JyZWN0LFxuICAgICAgICAgICAgc2tpcHBlZDogdGhpcy5za2lwcGVkLFxuICAgICAgICAgICAgdGltZV90YWtlbjogdGhpcy50aW1lVGFrZW4sXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBzaG91bGRVc2VTZXJ2ZXIoZGF0YSkge1xuICAgICAgICAvLyBXZSBvdmVycmlkZSB0aGUgUnVuZXN0b25lQmFzZSB2ZXJzaW9uIGJlY2F1c2UgdGhlcmUgaXMgbm8gXCJjb3JyZWN0XCIgYXR0cmlidXRlLCBhbmQgdGhlcmUgYXJlIDIgcG9zc2libGUgbG9jYWxTdG9yYWdlIHNjaGVtYXNcbiAgICAgICAgLy8gLS13ZSBhbHNvIHdhbnQgdG8gZGVmYXVsdCB0byBsb2NhbCBzdG9yYWdlIGJlY2F1c2UgaXQgY29udGFpbnMgbW9yZSBpbmZvcm1hdGlvbiBzcGVjaWZpY2FsbHkgd2hpY2ggcXVlc3Rpb25zIGFyZSBjb3JyZWN0LCBpbmNvcnJlY3QsIGFuZCBza2lwcGVkLlxuICAgICAgICB2YXIgc3RvcmFnZURhdGU7XG4gICAgICAgIGlmIChsb2NhbFN0b3JhZ2UubGVuZ3RoID09PSAwKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgdmFyIHN0b3JhZ2VPYmogPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLmxvY2FsU3RvcmFnZUtleSgpKTtcbiAgICAgICAgaWYgKHN0b3JhZ2VPYmogPT09IG51bGwpIHJldHVybiB0cnVlO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdmFyIHN0b3JlZERhdGEgPSBKU09OLnBhcnNlKHN0b3JhZ2VPYmopLmFuc3dlcjtcbiAgICAgICAgICAgIGlmIChzdG9yZWREYXRhLmxlbmd0aCA9PSA0KSB7XG4gICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICBkYXRhLmNvcnJlY3QgPT0gc3RvcmVkRGF0YVswXSAmJlxuICAgICAgICAgICAgICAgICAgICBkYXRhLmluY29ycmVjdCA9PSBzdG9yZWREYXRhWzFdICYmXG4gICAgICAgICAgICAgICAgICAgIGRhdGEuc2tpcHBlZCA9PSBzdG9yZWREYXRhWzJdICYmXG4gICAgICAgICAgICAgICAgICAgIGRhdGEudGltZVRha2VuID09IHN0b3JlZERhdGFbM11cbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChzdG9yZWREYXRhLmxlbmd0aCA9PSA3KSB7XG4gICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICBkYXRhLmNvcnJlY3QgPT0gc3RvcmVkRGF0YVswXSAmJlxuICAgICAgICAgICAgICAgICAgICBkYXRhLmluY29ycmVjdCA9PSBzdG9yZWREYXRhWzJdICYmXG4gICAgICAgICAgICAgICAgICAgIGRhdGEuc2tpcHBlZCA9PSBzdG9yZWREYXRhWzRdICYmXG4gICAgICAgICAgICAgICAgICAgIGRhdGEudGltZVRha2VuID09IHN0b3JlZERhdGFbNl1cbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAvLyBJbiB0aGlzIGNhc2UsIGJlY2F1c2UgbG9jYWwgc3RvcmFnZSBoYXMgbW9yZSBpbmZvLCB3ZSB3YW50IHRvIHVzZSB0aGF0IGlmIGl0J3MgY29uc2lzdGVudFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN0b3JhZ2VEYXRlID0gbmV3IERhdGUoSlNPTi5wYXJzZShzdG9yYWdlT2JqWzFdKS50aW1lc3RhbXApO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIC8vIGVycm9yIHdoaWxlIHBhcnNpbmc7IGxpa2VseSBkdWUgdG8gYmFkIHZhbHVlIHN0b3JlZCBpbiBzdG9yYWdlXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIubWVzc2FnZSk7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSh0aGlzLmxvY2FsU3RvcmFnZUtleSgpKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBzZXJ2ZXJEYXRlID0gbmV3IERhdGUoZGF0YS50aW1lc3RhbXApO1xuICAgICAgICBpZiAoc2VydmVyRGF0ZSA8IHN0b3JhZ2VEYXRlKSB7XG4gICAgICAgICAgICB0aGlzLmxvZ1Njb3JlKCk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgY2hlY2tMb2NhbFN0b3JhZ2UoKSB7XG4gICAgICAgIHZhciBsZW4gPSBsb2NhbFN0b3JhZ2UubGVuZ3RoO1xuICAgICAgICBpZiAobGVuID4gMCkge1xuICAgICAgICAgICAgaWYgKGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMubG9jYWxTdG9yYWdlS2V5KCkpICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50YWtlbiA9IDE7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXN0b3JlQW5zd2VycyhcIlwiKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy50YWtlbiA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnRha2VuID0gMDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBhc3luYyByZXN0b3JlQW5zd2VycyhkYXRhKSB7XG4gICAgICAgIHRoaXMudGFrZW4gPSAxO1xuICAgICAgICB2YXIgdG1wQXJyO1xuICAgICAgICBpZiAoZGF0YSA9PT0gXCJcIikge1xuICAgICAgICAgICAgbGV0IGVycm9yID0gZmFsc2U7XG4gICAgICAgICAgICBsZXQgc3RvcmFnZU9iajtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgc3RvcmFnZU9iaiA9IEpTT04ucGFyc2UoXG4gICAgICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMubG9jYWxTdG9yYWdlS2V5KCkpLFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgdG1wQXJyID0gc3RvcmFnZU9iai5hbnN3ZXI7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAvLyBlcnJvciB3aGlsZSBwYXJzaW5nOyBsaWtlbHkgZHVlIHRvIGJhZCB2YWx1ZSBzdG9yZWQgaW4gc3RvcmFnZVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgICAgICAgICAgICBgRXJyb3IgcGFyc2luZyBzdG9yZWQgVGltZWQgZGF0YSBmb3IgJHt0aGlzLmRpdmlkfTogJHtlcnIubWVzc2FnZX1gLFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgZXJyb3IgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGVycm9yIHx8IHN0b3JhZ2VPYmoudGltZXN0YW1wIDwgZUJvb2tDb25maWcudGVybVN0YXJ0RGF0ZSkge1xuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKHRoaXMubG9jYWxTdG9yYWdlS2V5KCkpO1xuICAgICAgICAgICAgICAgIHRoaXMudGFrZW4gPSAwO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIFBhcnNlIHJlc3VsdHMgZnJvbSB0aGUgZGF0YWJhc2VcbiAgICAgICAgICAgIHRtcEFyciA9IFtcbiAgICAgICAgICAgICAgICBwYXJzZUludChkYXRhLmNvcnJlY3QpLFxuICAgICAgICAgICAgICAgIHBhcnNlSW50KGRhdGEuaW5jb3JyZWN0KSxcbiAgICAgICAgICAgICAgICBwYXJzZUludChkYXRhLnNraXBwZWQpLFxuICAgICAgICAgICAgICAgIHBhcnNlSW50KGRhdGEudGltZV90YWtlbiksXG4gICAgICAgICAgICAgICAgZGF0YS5yZXNldCxcbiAgICAgICAgICAgIF07XG4gICAgICAgICAgICB0aGlzLnNldExvY2FsU3RvcmFnZSh0bXBBcnIpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0bXBBcnIubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgIC8vIEV4YW0gd2FzIHByZXZpb3VzbHkgcmVzZXRcbiAgICAgICAgICAgIHRoaXMucmVzZXQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy50YWtlbiA9IDA7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRtcEFyci5sZW5ndGggPT0gNCkge1xuICAgICAgICAgICAgLy8gQWNjaWRlbnRhbCBSZWxvYWQgT1IgRGF0YWJhc2UgRW50cnlcbiAgICAgICAgICAgIHRoaXMuc2NvcmUgPSB0bXBBcnJbMF07XG4gICAgICAgICAgICB0aGlzLmluY29ycmVjdCA9IHRtcEFyclsxXTtcbiAgICAgICAgICAgIHRoaXMuc2tpcHBlZCA9IHRtcEFyclsyXTtcbiAgICAgICAgICAgIHRoaXMudGltZVRha2VuID0gdG1wQXJyWzNdO1xuICAgICAgICB9IGVsc2UgaWYgKHRtcEFyci5sZW5ndGggPT0gNSkge1xuICAgICAgICAgICAgdGhpcy5zY29yZSA9IHRtcEFyclswXTtcbiAgICAgICAgICAgIHRoaXMuaW5jb3JyZWN0ID0gdG1wQXJyWzFdO1xuICAgICAgICAgICAgdGhpcy5za2lwcGVkID0gdG1wQXJyWzJdO1xuICAgICAgICAgICAgdGhpcy50aW1lVGFrZW4gPSB0bXBBcnJbM107XG4gICAgICAgIH0gZWxzZSBpZiAodG1wQXJyLmxlbmd0aCA9PSA3KSB7XG4gICAgICAgICAgICAvLyBMb2FkZWQgQ29tcGxldGVkIEV4YW1cbiAgICAgICAgICAgIHRoaXMuc2NvcmUgPSB0bXBBcnJbMF07XG4gICAgICAgICAgICB0aGlzLmNvcnJlY3RTdHIgPSB0bXBBcnJbMV07XG4gICAgICAgICAgICB0aGlzLmluY29ycmVjdCA9IHRtcEFyclsyXTtcbiAgICAgICAgICAgIHRoaXMuaW5jb3JyZWN0U3RyID0gdG1wQXJyWzNdO1xuICAgICAgICAgICAgdGhpcy5za2lwcGVkID0gdG1wQXJyWzRdO1xuICAgICAgICAgICAgdGhpcy5za2lwcGVkU3RyID0gdG1wQXJyWzVdO1xuICAgICAgICAgICAgdGhpcy50aW1lVGFrZW4gPSB0bXBBcnJbNl07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBTZXQgbG9jYWxTdG9yYWdlIGluIGNhc2Ugb2YgXCJhY2NpZGVudGFsXCIgcmVsb2FkXG4gICAgICAgICAgICB0aGlzLnNjb3JlID0gMDtcbiAgICAgICAgICAgIHRoaXMuaW5jb3JyZWN0ID0gMDtcbiAgICAgICAgICAgIHRoaXMuc2tpcHBlZCA9IHRoaXMucmVuZGVyZWRRdWVzdGlvbkFycmF5Lmxlbmd0aDtcbiAgICAgICAgICAgIHRoaXMudGltZVRha2VuID0gMDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy50YWtlbikge1xuICAgICAgICAgICAgaWYgKHRoaXMuc2tpcHBlZCA9PT0gdGhpcy5yZW5kZXJlZFF1ZXN0aW9uQXJyYXkubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zaG93RmVlZGJhY2sgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuaGFuZGxlUHJldkFzc2Vzc21lbnQoKTtcbiAgICAgICAgfVxuICAgICAgICBhd2FpdCB0aGlzLnJlbmRlclRpbWVkUXVlc3Rpb24oKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5U2NvcmUoKTtcbiAgICAgICAgdGhpcy5zaG93VGltZSgpO1xuICAgIH1cbiAgICBzZXRMb2NhbFN0b3JhZ2UocGFyc2VkRGF0YSkge1xuICAgICAgICB2YXIgdGltZVN0YW1wID0gbmV3IERhdGUoKTtcbiAgICAgICAgdmFyIHN0b3JhZ2VPYmogPSB7XG4gICAgICAgICAgICBhbnN3ZXI6IHBhcnNlZERhdGEsXG4gICAgICAgICAgICB0aW1lc3RhbXA6IHRpbWVTdGFtcCxcbiAgICAgICAgfTtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXG4gICAgICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZUtleSgpLFxuICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoc3RvcmFnZU9iaiksXG4gICAgICAgICk7XG4gICAgfVxuICAgIGRpc3BsYXlTY29yZSgpIHtcbiAgICAgICAgLy8gUmV2ZWFsIHRoZSBzY29yZSwgY2xlYXJpbmcgdGhlIGluaXRpYWwgaGlkZGVuIHN0YXRlIHNvIHRoZSBlbGVtZW50XG4gICAgICAgIC8vIGlzbid0IGxlZnQgd2l0aCBib3RoIHRpbWVkLWhpZGRlbiBhbmQgdGltZWQtdmlzaWJsZSAod2hpY2ggb25seVxuICAgICAgICAvLyB3b3JrcyBieSBDU1Mgc291cmNlIG9yZGVyKS5cbiAgICAgICAgdGhpcy5zY29yZURpdi5jbGFzc0xpc3QucmVtb3ZlKFwidGltZWQtaGlkZGVuXCIpO1xuICAgICAgICBpZiAodGhpcy5zaG93UmVzdWx0cykge1xuICAgICAgICAgICAgdmFyIHNjb3JlU3RyaW5nID0gXCJcIjtcbiAgICAgICAgICAgIHZhciBudW1RdWVzdGlvbnM7XG4gICAgICAgICAgICB2YXIgcGVyY2VudENvcnJlY3Q7XG4gICAgICAgICAgICAvLyBpZiB3ZSBoYXZlIHNvbWUgaW5mb3JtYXRpb25cbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICB0aGlzLmNvcnJlY3RTdHIubGVuZ3RoID4gMCB8fFxuICAgICAgICAgICAgICAgIHRoaXMuaW5jb3JyZWN0U3RyLmxlbmd0aCA+IDAgfHxcbiAgICAgICAgICAgICAgICB0aGlzLnNraXBwZWRTdHIubGVuZ3RoID4gMFxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgc2NvcmVTdHJpbmcgPSBgTnVtIENvcnJlY3Q6ICR7dGhpcy5zY29yZX0uIFF1ZXN0aW9uczogJHt0aGlzLmNvcnJlY3RTdHJ9PGJyPk51bSBXcm9uZzogJHt0aGlzLmluY29ycmVjdH0uIFF1ZXN0aW9uczogJHt0aGlzLmluY29ycmVjdFN0cn08YnI+TnVtIFNraXBwZWQ6ICR7dGhpcy5za2lwcGVkfS4gUXVlc3Rpb25zOiAke3RoaXMuc2tpcHBlZFN0cn08YnI+YDtcbiAgICAgICAgICAgICAgICBudW1RdWVzdGlvbnMgPSB0aGlzLnNjb3JlICsgdGhpcy5pbmNvcnJlY3QgKyB0aGlzLnNraXBwZWQ7XG4gICAgICAgICAgICAgICAgcGVyY2VudENvcnJlY3QgPSAodGhpcy5zY29yZSAvIG51bVF1ZXN0aW9ucykgKiAxMDA7XG4gICAgICAgICAgICAgICAgc2NvcmVTdHJpbmcgKz1cbiAgICAgICAgICAgICAgICAgICAgXCJQZXJjZW50IENvcnJlY3Q6IFwiICsgcGVyY2VudENvcnJlY3QudG9GaXhlZCgyKSArIFwiJVwiO1xuICAgICAgICAgICAgICAgIHRoaXMuc2NvcmVEaXYuaW5uZXJIVE1MID0gc2NvcmVTdHJpbmc7XG4gICAgICAgICAgICAgICAgdGhpcy5zY29yZURpdi5jbGFzc0xpc3QuYWRkKFwidGltZWQtdmlzaWJsZVwiKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2NvcmVTdHJpbmcgPSBgTnVtIENvcnJlY3Q6ICR7dGhpcy5zY29yZX08YnI+TnVtIFdyb25nOiAke3RoaXMuaW5jb3JyZWN0fTxicj5OdW0gU2tpcHBlZDogJHt0aGlzLnNraXBwZWR9PGJyPmA7XG4gICAgICAgICAgICAgICAgbnVtUXVlc3Rpb25zID0gdGhpcy5zY29yZSArIHRoaXMuaW5jb3JyZWN0ICsgdGhpcy5za2lwcGVkO1xuICAgICAgICAgICAgICAgIHBlcmNlbnRDb3JyZWN0ID0gKHRoaXMuc2NvcmUgLyBudW1RdWVzdGlvbnMpICogMTAwO1xuICAgICAgICAgICAgICAgIHNjb3JlU3RyaW5nICs9XG4gICAgICAgICAgICAgICAgICAgIFwiUGVyY2VudCBDb3JyZWN0OiBcIiArIHBlcmNlbnRDb3JyZWN0LnRvRml4ZWQoMikgKyBcIiVcIjtcbiAgICAgICAgICAgICAgICB0aGlzLnNjb3JlRGl2LmlubmVySFRNTCA9IHNjb3JlU3RyaW5nO1xuICAgICAgICAgICAgICAgIHRoaXMuc2NvcmVEaXYuY2xhc3NMaXN0LmFkZChcInRpbWVkLXZpc2libGVcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmhpZ2hsaWdodE51bWJlcmVkTGlzdCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zY29yZURpdi5pbm5lckhUTUwgPVxuICAgICAgICAgICAgICAgIFwiVGhhbmsgeW91IGZvciB0YWtpbmcgdGhlIGV4YW0uICBZb3VyIGFuc3dlcnMgaGF2ZSBiZWVuIHJlY29yZGVkLlwiO1xuICAgICAgICAgICAgdGhpcy5zY29yZURpdi5jbGFzc0xpc3QuYWRkKFwidGltZWQtdmlzaWJsZVwiKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBoaWdobGlnaHROdW1iZXJlZExpc3QoKSB7XG4gICAgICAgIHZhciBjb3JyZWN0Q291bnQgPSB0aGlzLmNvcnJlY3RTdHI7XG4gICAgICAgIHZhciBpbmNvcnJlY3RDb3VudCA9IHRoaXMuaW5jb3JyZWN0U3RyO1xuICAgICAgICB2YXIgc2tpcHBlZENvdW50ID0gdGhpcy5za2lwcGVkU3RyO1xuICAgICAgICBjb3JyZWN0Q291bnQgPSBjb3JyZWN0Q291bnQucmVwbGFjZSgvIC9nLCBcIlwiKS5zcGxpdChcIixcIik7XG4gICAgICAgIGluY29ycmVjdENvdW50ID0gaW5jb3JyZWN0Q291bnQucmVwbGFjZSgvIC9nLCBcIlwiKS5zcGxpdChcIixcIik7XG4gICAgICAgIHNraXBwZWRDb3VudCA9IHNraXBwZWRDb3VudC5yZXBsYWNlKC8gL2csIFwiXCIpLnNwbGl0KFwiLFwiKTtcbiAgICAgICAgdmFyIG51bWJlcmVkQnRucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJ1bCNwYWdlTnVtcyA+IHVsID4gbGlcIik7XG4gICAgICAgIGZvciAoY29uc3QgYnRuIG9mIG51bWJlcmVkQnRucykge1xuICAgICAgICAgICAgYnRuLmNsYXNzTGlzdC5yZW1vdmUoXCJhbnN3ZXJlZFwiKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBlbnRyaWVzIG1heSBiZSBcIk5vbmVcIiwgd2hvc2UgaW5kZXggcGFyc2VzIHRvIE5hTiBhbmQgbWFya3Mgbm90aGluZ1xuICAgICAgICBjb25zdCBtYXJrID0gKGVudHJpZXMsIGNscykgPT4ge1xuICAgICAgICAgICAgZm9yIChjb25zdCBlbnRyeSBvZiBlbnRyaWVzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYnRuID0gbnVtYmVyZWRCdG5zW3BhcnNlSW50KGVudHJ5KSAtIDFdO1xuICAgICAgICAgICAgICAgIGlmIChidG4pIHtcbiAgICAgICAgICAgICAgICAgICAgYnRuLmNsYXNzTGlzdC5hZGQoY2xzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIG1hcmsoY29ycmVjdENvdW50LCBcImNvcnJlY3RDb3VudFwiKTtcbiAgICAgICAgbWFyayhpbmNvcnJlY3RDb3VudCwgXCJpbmNvcnJlY3RDb3VudFwiKTtcbiAgICAgICAgbWFyayhza2lwcGVkQ291bnQsIFwic2tpcHBlZENvdW50XCIpO1xuICAgIH1cbn1cblxuLy8gUGFnZS1sZXZlbCBlbGVtZW50cyB0aGF0IG1heSBub3QgZXhpc3Qgb24gZXZlcnkgcGFnZS5cbmZ1bmN0aW9uIGhpZGVFbGVtZW50KGVsZW1lbnQpIHtcbiAgICBpZiAoZWxlbWVudCkge1xuICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJ0aW1lZC1oaWRkZW5cIik7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBzaG93RWxlbWVudChlbGVtZW50KSB7XG4gICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFwidGltZWQtaGlkZGVuXCIpO1xuICAgIH1cbn1cblxuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PT0gRnVuY3Rpb24gdGhhdCBjYWxscyB0aGUgY29uc3RydWN0b3JzIG9uIHBhZ2UgbG9hZCA9PT1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInJ1bmVzdG9uZTpsb2dpbi1jb21wbGV0ZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgZm9yIChsZXQgZWxlbWVudCBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFxuICAgICAgICBcIltkYXRhLWNvbXBvbmVudD10aW1lZEFzc2Vzc21lbnRdXCIsXG4gICAgKSkge1xuICAgICAgICB3aW5kb3cuY29tcG9uZW50TWFwW2VsZW1lbnQuaWRdID0gbmV3IFRpbWVkKHtcbiAgICAgICAgICAgIG9yaWc6IGVsZW1lbnQsXG4gICAgICAgICAgICB1c2VSdW5lc3RvbmVTZXJ2aWNlczogZUJvb2tDb25maWcudXNlUnVuZXN0b25lU2VydmljZXMsXG4gICAgICAgIH0pO1xuICAgIH1cbn0pO1xuIiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiaW1wb3J0IHsgTWF0Y2hpbmdQcm9ibGVtIH0gZnJvbSBcIi4vbWF0Y2hpbmcuanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGltZWRNYXRjaGluZyBleHRlbmRzIE1hdGNoaW5nUHJvYmxlbSB7XG4gICAgY29uc3RydWN0b3Iob3B0cykge1xuICAgICAgICBzdXBlcihvcHRzKTtcbiAgICAgICAgdGhpcy5yZW5kZXJUaW1lZEljb24odGhpcy5jb250YWluZXJEaXYpO1xuICAgICAgICB0aGlzLmhpZGVCdXR0b25zKCk7XG4gICAgICAgIHRoaXMubmVlZHNSZWluaXRpYWxpemF0aW9uID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBoaWRlQnV0dG9ucygpIHtcbiAgICAgICAgdGhpcy5ncmFkZUJ0bi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgIHRoaXMuaGVscEJ0bi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgfVxuXG4gICAgcmVuZGVyVGltZWRJY29uKGNvbXBvbmVudCkge1xuICAgICAgICAvLyByZW5kZXJzIHRoZSBjbG9jayBpY29uIG9uIHRpbWVkIGNvbXBvbmVudHMuIFRoZSBjb21wb25lbnQgcGFyYW1ldGVyXG4gICAgICAgIC8vIGlzIHRoZSBlbGVtZW50IHRoYXQgdGhlIGljb24gc2hvdWxkIGJlIGFwcGVuZGVkIHRvLlxuICAgICAgICB2YXIgdGltZUljb25EaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB2YXIgdGltZUljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xuICAgICAgICB0aW1lSWNvbi5zcmMgPSBcIi4uL19zdGF0aWMvY2xvY2sucG5nXCI7XG4gICAgICAgIHRpbWVJY29uLnN0eWxlLndpZHRoID0gXCIxNXB4XCI7XG4gICAgICAgIHRpbWVJY29uLnN0eWxlLmhlaWdodCA9IFwiMTVweFwiO1xuXG4gICAgICAgIHRpbWVJY29uRGl2LmNsYXNzTmFtZSA9IFwidGltZVRpcFwiO1xuICAgICAgICB0aW1lSWNvbkRpdi50aXRsZSA9IFwiXCI7XG4gICAgICAgIHRpbWVJY29uRGl2LmFwcGVuZENoaWxkKHRpbWVJY29uKTtcbiAgICAgICAgY29tcG9uZW50LnByZXBlbmQodGltZUljb25EaXYpO1xuICAgIH1cblxuICAgIGNoZWNrQ29ycmVjdFRpbWVkKCkge1xuICAgICAgICAvLyBSZXR1cm5zIGlmIHRoZSBxdWVzdGlvbiB3YXMgY29ycmVjdCwgaW5jb3JyZWN0LCBvciBza2lwcGVkIChyZXR1cm4gbnVsbCBpbiB0aGUgbGFzdCBjYXNlKVxuICAgICAgICBzd2l0Y2ggKHRoaXMuY29ycmVjdCkge1xuICAgICAgICAgICAgY2FzZSB0cnVlOlxuICAgICAgICAgICAgICAgIHJldHVybiBcIlRcIjtcbiAgICAgICAgICAgIGNhc2UgZmFsc2U6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiRlwiO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGhpZGVGZWVkYmFjaygpIHtcbiAgICAgICAgdGhpcy5jb25uTGlzdC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgfVxuXG4gICAgcmVpbml0aWFsaXplTGlzdGVuZXJzKCkge1xuICAgICAgICAvLyBtYXliZSBuZWVkIHRvIHJlaW5pdGlhbGl6ZSB0aGUgbGlzdGVuZXJzXG4gICAgfVxufVxuXG5pZiAodHlwZW9mIHdpbmRvdy5jb21wb25lbnRfZmFjdG9yeSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHdpbmRvdy5jb21wb25lbnRfZmFjdG9yeSA9IHt9O1xufVxud2luZG93LmNvbXBvbmVudF9mYWN0b3J5Lm1hdGNoaW5nID0gZnVuY3Rpb24gKG9wdHMpIHtcbiAgICBpZiAob3B0cy50aW1lZCkge1xuICAgICAgICByZXR1cm4gbmV3IFRpbWVkTWF0Y2hpbmcob3B0cyk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgTWF0Y2hpbmdQcm9ibGVtKG9wdHMpO1xufTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==