"use strict";
(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_mchoice_js_timedmc_js"],{

/***/ 52539:
/*!*******************************************!*\
  !*** ./runestone/mchoice/css/mchoice.css ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 84270:
/*!*****************************************!*\
  !*** ./runestone/mchoice/js/mchoice.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MultipleChoice)
/* harmony export */ });
/* harmony import */ var _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/runestonebase.js */ 78673);
/* harmony import */ var _common_js_domutil_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../common/js/domutil.js */ 34089);
/* harmony import */ var _common_js_mathjax_a11y_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../common/js/mathjax-a11y.js */ 47937);
/* harmony import */ var _css_mchoice_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../css/mchoice.css */ 52539);
/*==========================================
========      Master mchoice.js     =========
============================================
===  This file contains the JS for the   ===
=== Runestone multiple choice component. ===
============================================
===              Created By              ===
===           Isaiah Mayerchak           ===
===                 and                  ===
===             Kirby Olson              ===
===                6/4/15                ===
==========================================*/




//import "./../styles/runestone.css";


// MC constructor
class MultipleChoice extends _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(opts) {
        super(opts);
        opts = opts || {};
        var orig = opts.orig; // entire <ul> element
        this.origElem = orig;
        this.useRunestoneServices = opts.useRunestoneServices;
        this.multipleanswers = false;
        this.divid = orig.id;
        if (this.parseBooleanAttribute(this.origElem, "data-multipleanswers")) {
            this.multipleanswers = true;
        }
        this.children = this.origElem.childNodes;
        this.random = false;
        if (eBookConfig.peer) {
            this.random = false;
        } else if (this.parseBooleanAttribute(this.origElem, "data-random")) {
            this.random = true;
        }
        this.correct = null;
        this.didSubmit = false;
        this.answerList = [];
        this.correctList = [];
        this.correctIndexList = [];
        this.feedbackList = [];
        this.question = null;
        this.caption = "Multiple Choice";
        this.findAnswers();
        this.findQuestion();
        this.findFeedbacks();
        this.createCorrectList();
        this.createMCForm();
        this.addCaption("runestone");
        this.checkServer("mChoice", true);
        // queueMathJax waits for page-level MathJax readiness when configured,
        // then updates option labels from the rendered content.
        this.queueMathJax(this.containerDiv).then(() => {
            this.updateMathJaxOptionLabels();
            this.disableOptionMathJaxTabStops();
        });
        if (typeof Prism !== "undefined") {
            Prism.highlightAllUnder(this.containerDiv);
        }
    }

    /*====================================
    ==== Functions parsing variables  ====
    ====  out of intermediate HTML    ====
    ====================================*/
    findQuestion() {
        // Old HTML format had question inside ul
        // Newer format has a div.exercise-statement that is a part of the ul's parent
        // Check for newer format...
        const exStatement = this.origElem.parentElement.querySelector(
            ".exercise-statement",
        );
        if (exStatement) {
            this.question = exStatement;
        } else {
            //Older format
            var delimiter;
            for (var i = 0; i < this.origElem.childNodes.length; i++) {
                if (this.origElem.childNodes[i].nodeName === "LI") {
                    delimiter = this.origElem.childNodes[i].outerHTML;
                    break;
                }
            }
            var fulltext = this.origElem.innerHTML;
            var temp = fulltext.split(delimiter);
            this.question = temp[0];
        }
    }

    findAnswers() {
        // Creates answer objects and pushes them to answerList
        // format: ID, Correct bool, Content (text)
        var ChildAnswerList = [];
        for (var i = 0; i < this.children.length; i++) {
            const child = this.children[i];
            if (
                child.nodeType === Node.ELEMENT_NODE &&
                child.matches("[data-component=answer]")
            ) {
                ChildAnswerList.push(child);
            }
        }
        for (var j = 0; j < ChildAnswerList.length; j++) {
            var answer_id = ChildAnswerList[j].id;
            var is_correct = false;
            if (ChildAnswerList[j].hasAttribute("data-correct")) {
                // If data-correct attribute exists, answer is correct
                is_correct = true;
            }
            var answer_text = ChildAnswerList[j].innerHTML;
            var answer_object = {
                id: answer_id,
                correct: is_correct,
                content: answer_text,
            };
            this.answerList.push(answer_object);
        }
    }

    findFeedbacks() {
        for (var i = 0; i < this.children.length; i++) {
            const child = this.children[i];
            if (
                child.nodeType === Node.ELEMENT_NODE &&
                child.matches("[data-component=feedback]")
            ) {
                this.feedbackList.push(child.innerHTML);
            }
        }
    }

    createCorrectList() {
        // Creates array that holds the ID"s of correct answers
        // Also populates an array that holds the indeces of correct answers
        for (var i = 0; i < this.answerList.length; i++) {
            if (this.answerList[i].correct) {
                this.correctList.push(this.answerList[i].id);
                this.correctIndexList.push(i);
            }
        }
    }

    /*===========================================
    ====   Functions generating final HTML   ====
    ===========================================*/
    createMCForm() {
        this.renderMCContainer();
        this.renderMCForm(); // renders the form with options and buttons
        this.renderMCfeedbackDiv();
        // replaces intermediate HTML with rendered HTML
        this.origElem.replaceWith(this.containerDiv);
    }

    renderMCContainer() {
        this.containerDiv = document.createElement("div");
        this.questionDiv = document.createElement("div");
        // this.question may be an element or text - need to handle both cases
        if (typeof this.question === "string") {
            this.questionDiv.innerHTML = this.question;
        } else {
            this.questionDiv.appendChild(this.question);
        }
        this.questionDiv.id = this.divid + "_prompt";
        this.questionDiv.className = "exercise-statement";
        this.containerDiv.appendChild(this.questionDiv);
        const origClass = this.origElem.getAttribute("class");
        if (origClass) {
            this.containerDiv.classList.add(
                ...origClass.split(" ").filter(Boolean),
            );
        }
        this.containerDiv.classList.add("mchoice");
        this.containerDiv.id = this.divid;
    }

    renderMCForm() {
        this.optsForm = document.createElement("form");
        this.optsForm.id = this.divid + "_form";
        this.optsForm.method = "get";
        this.optsForm.action = "";
        this.optsForm.onsubmit = function () {
            return false;
        };
        // Add fieldset and legend for accessibility - legend must come before the options
        // so screen readers read the legend first.
        this.optsFieldSet = document.createElement("fieldset");
        this.optsFieldSet.setAttribute(
            "role",
            this.multipleanswers ? "group" : "radiogroup",
        );
        this.optsFieldSet.setAttribute(
            "aria-labelledby",
            this.divid + "_prompt",
        );
        this.optsForm.appendChild(this.optsFieldSet);
        let legend = document.createElement("legend");
        if (this.multipleanswers) {
            legend.textContent = "Choose all that apply";
        } else {
            legend.textContent = "Choose one";
        }
        this.optsFieldSet.appendChild(legend);
        // generate form options
        this.renderMCFormOpts();
        this.renderMCFormButtons();
        // Append the form to the container
        this.containerDiv.appendChild(this.optsForm);
    }

    renderMCFormOpts() {
        // Creates input DOM elements.
        this.optionArray = []; // Array with an object for each option containing its input and content div.
        const inputType = this.multipleanswers ? "checkbox" : "radio";
        // this.indexArray is used to index through the answers
        // it is just 0-n normally, but the order is shuffled if the random option is present
        this.indexArray = [];
        for (var i = 0; i < this.answerList.length; i++) {
            this.indexArray.push(i);
        }
        if (this.random) {
            this.randomizeAnswers();
        }
        let self = this;
        let answerFunc = function () {
            self.isAnswered = true;
        };
        for (var j = 0; j < this.answerList.length; j++) {
            var k = this.indexArray[j];
            const optObj = this.createMCOption(k, j, inputType, answerFunc);

            this.optionArray.push(optObj);
            // add the option to the form
            this.optsFieldSet.appendChild(optObj.label);
        }
    }

    createMCOption(answerIndex, displayIndex, inputType, answerFunc) {
        const optionId = this.divid + "_opt_" + answerIndex;
        const optionLetter = String.fromCharCode(
            "A".charCodeAt(0) + displayIndex,
        );
        const content = this.answerList[answerIndex].content;
        const label = document.createElement("label");
        label.className = "mchoice-option";

        let input;
        let accessibleText;
        let visibleContent;
        if (this.containsMathJax(content)) {
            input = document.createElement("input");
            input.type = inputType;
            input.name = "group1";
            input.value = answerIndex;
            input.id = optionId;
            input.className = "mchoice-input";

            accessibleText = document.createElement("span");
            accessibleText.className = "visuallyhidden";
            accessibleText.textContent = `Option ${optionLetter}. Content follows.`;

            visibleContent = document.createElement("span");
            visibleContent.innerHTML = `${optionLetter}. ${content}`;
            label.append(input, accessibleText, visibleContent);
        } else {
            let labelContent = content;
            let prefix = "";
            if (labelContent.startsWith("<p>")) {
                prefix = "<p>";
                labelContent = labelContent.slice(3);
            }
            label.innerHTML =
                `${prefix}<input type="${inputType}" name="group1" value="${answerIndex}" id="${optionId}" class="mchoice-input">` +
                `${optionLetter}. ${labelContent}`;
            input = label.querySelector("input");
        }

        input.onclick = answerFunc;
        return { input, label, accessibleText, visibleContent };
    }

    updateMathJaxOptionLabels() {
        for (const option of this.optionArray) {
            if (!option.accessibleText) {
                continue;
            }
            option.accessibleText.textContent =
                `Option ${(0,_common_js_mathjax_a11y_js__WEBPACK_IMPORTED_MODULE_2__.getAccessibleElementText)(option.visibleContent)}`;
            option.visibleContent.setAttribute("aria-hidden", "true");
        }
    }

    containsMathJax(content) {
        return /MathJax|mjx-container|process-math/.test(content);
    }

    disableOptionMathJaxTabStops() {
        (0,_common_js_mathjax_a11y_js__WEBPACK_IMPORTED_MODULE_2__.disableMathJaxTabStops)(this.containerDiv, [".mchoice-option"]);
    }

    renderMCFormButtons() {
        // submit and compare me buttons
        // Create submit button
        this.submitButton = document.createElement("button");
        this.submitButton.textContent = "Check Me";
        this.submitButton.className = "btn btn-success";
        this.submitButton.name = "do answer";
        this.submitButton.type = "button";
        if (this.multipleanswers) {
            this.submitButton.addEventListener(
                "click",
                function () {
                    this.processMCMASubmission(true);
                }.bind(this),
                false,
            );
        } else {
            this.submitButton.addEventListener(
                "click",
                function (ev) {
                    ev.preventDefault();
                    this.processMCMFSubmission(true);
                }.bind(this),
                false,
            );
        } // end else
        this.optsForm.appendChild(this.submitButton);
        // Create compare button
        if (this.useRunestoneServices && !eBookConfig.peer) {
            this.compareButton = document.createElement("button");
            this.compareButton.className = "btn btn-default";
            this.compareButton.id = this.divid + "_bcomp";
            this.compareButton.disabled = true;
            this.compareButton.name = "compare";
            this.compareButton.textContent = "Compare me";
            this.compareButton.addEventListener(
                "click",
                function () {
                    this.compareAnswers(this.divid);
                }.bind(this),
                false,
            );
            this.optsForm.appendChild(this.compareButton);
        }
    }

    renderMCfeedbackDiv() {
        this.feedBackDiv = document.createElement("div");
        this.feedBackDiv.id = this.divid + "_feedback";
        this.feedBackDiv.setAttribute("aria-live", "polite");
        this.feedBackDiv.setAttribute("role", "status");
        this.containerDiv.appendChild(this.feedBackDiv);
    }

    randomizeAnswers() {
        // Makes the ordering of the answer choices random
        var currentIndex = this.indexArray.length,
            temporaryValue,
            randomIndex;
        // While there remain elements to shuffle...
        while (currentIndex !== 0) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            // And swap it with the current element.
            temporaryValue = this.indexArray[currentIndex];
            this.indexArray[currentIndex] = this.indexArray[randomIndex];
            this.indexArray[randomIndex] = temporaryValue;
            var temporaryFeedback = this.feedbackList[currentIndex];
            this.feedbackList[currentIndex] = this.feedbackList[randomIndex];
            this.feedbackList[randomIndex] = temporaryFeedback;
        }
    }

    /*===================================
    === Checking/loading from storage ===
    ===================================*/
    restoreAnswers(data) {
        // Restore answers from storage retrieval done in RunestoneBase
        // sometimes data.answer can be null
        if (!data.answer) {
            data.answer = "";
        }
        var answers = data.answer.split(",");
        for (var a = 0; a < answers.length; a++) {
            var index = answers[a];
            for (var b = 0; b < this.optionArray.length; b++) {
                if (this.optionArray[b].input.value == index) {
                    this.optionArray[b].input.checked = true;
                }
            }
        }
        if (this.multipleanswers) {
            this.processMCMASubmission(false);
        } else {
            this.processMCMFSubmission(false);
        }
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
        if (len > 0) {
            var ex = localStorage.getItem(this.localStorageKey());
            let error = false;
            if (ex !== null) {
                try {
                    storedData = JSON.parse(ex);
                    answers = storedData.answer.split(",");
                } catch (err) {
                    // error while parsing; likely due to bad value stored in storage
                    console.log(
                        `Error parsing stored mchoice data for ${this.divid}: ${err.message}`,
                    );
                    error = true;
                }
                if (error || storedData.timestamp < eBookConfig.termStartDate) {
                    localStorage.removeItem(this.localStorageKey());
                    return;
                }
                for (var a = 0; a < answers.length; a++) {
                    var index = answers[a];
                    for (var b = 0; b < this.optionArray.length; b++) {
                        if (this.optionArray[b].input.value == index) {
                            this.optionArray[b].input.checked = true;
                        }
                    }
                }
                if (this.useRunestoneServices) {
                    this.enableMCComparison();
                    this.getSubmittedOpts(); // to populate givenlog for logging
                    if (this.multipleanswers) {
                        this.logMCMAsubmission();
                    } else {
                        this.logMCMFsubmission();
                    }
                }
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

    /*===============================
    === Processing MC Submissions ===
    ===============================*/
    processMCMASubmission(logFlag) {
        // Called when the submit button is clicked
        this.getSubmittedOpts(); // make sure this.givenArray is populated
        this.scoreMCMASubmission();
        this.setLocalStorage({
            correct: this.correct ? "T" : "F",
            answer: this.givenArray.join(","),
        });
        if (logFlag) {
            this.logMCMAsubmission();
        }
        if (!eBookConfig.peer || eBookConfig.isInstructor) {
            this.renderMCMAFeedBack();
            if (this.useRunestoneServices) {
                this.enableMCComparison();
            }
        } else {
            // acknowledge submission
            if (
                eBookConfig.peer &&
                eBookConfig.peerMode === "async" &&
                typeof studentVoteCount !== "undefined" &&
                studentVoteCount > 1
            ) {
                this.renderMCMAFeedBack();
            } else {
                this.feedBackDiv.innerHTML =
                    "<p>Your answer has been recorded</p>";
                this.feedBackDiv.className = "alert alert-info";
            }
        }
        this.didSubmit = true;
    }

    getSubmittedOpts() {
        var given;
        this.singlefeedback = ""; // Used for MCMF questions
        this.feedbackString = ""; // Used for MCMA questions
        this.givenArray = [];
        this.givenlog = "";
        var buttonObjs = this.optsForm.elements.group1;
        for (var i = 0; i < buttonObjs.length; i++) {
            if (buttonObjs[i].checked) {
                given = parseInt(buttonObjs[i].value, 10);
                this.givenArray.push(given);
                this.feedbackString += `<li value="${i + 1}">${this.feedbackList[i]
                    }</li>`;
                this.givenlog += given + ",";
                this.singlefeedback = this.feedbackList[i];
            }
        }
        this.givenArray.sort((a, b) => a - b);
    }

    checkCurrentAnswer() {
        this.getSubmittedOpts();
        if (this.givenArray.length === 0) {
            return;
        }
        if (this.multipleanswers) {
            this.scoreMCMASubmission();
        } else {
            this.scoreMCMFSubmission();
        }
    }

    async logCurrentAnswer(sid) {
        if (this.multipleanswers) {
            await this.logMCMAsubmission(sid);
        } else {
            await this.logMCMFsubmission(sid);
        }
    }

    renderFeedback() {
        if (this.multipleanswers) {
            this.renderMCMAFeedBack();
        } else {
            this.renderMCMFFeedback();
        }
        this.queueMathJax(this.feedBackDiv);
    }
    scoreMCMASubmission() {
        this.correctCount = 0;
        var correctIndex = 0;
        var givenIndex = 0;
        while (
            correctIndex < this.correctIndexList.length &&
            givenIndex < this.givenArray.length
        ) {
            if (
                this.givenArray[givenIndex] <
                this.correctIndexList[correctIndex]
            ) {
                givenIndex++;
            } else if (
                this.givenArray[givenIndex] ==
                this.correctIndexList[correctIndex]
            ) {
                this.correctCount++;
                givenIndex++;
                correctIndex++;
            } else {
                correctIndex++;
            }
        }
        var numGiven = this.givenArray.length;
        var numCorrect = this.correctCount;
        var numNeeded = this.correctList.length;
        this.answer = this.givenArray.join(",");
        this.correct = numCorrect === numNeeded && numNeeded === numGiven;
        if (numGiven === numNeeded) {
            this.percent = numCorrect / numNeeded;
        } else {
            this.percent = numCorrect / Math.max(numGiven, numNeeded);
        }
    }

    async logMCMAsubmission(sid) {
        var answer = this.answer || "";
        var correct = this.correct || false;
        var logAnswer =
            "answer:" + answer + ":" + (correct == true ? "correct" : "no");
        let data = {
            event: "mChoice",
            act: logAnswer,
            answer: answer.toString(),
            correct: correct,
            div_id: this.divid,
        };
        if (eBookConfig.peer && typeof studentVoteCount !== "undefined") {
            data.act = data.act + `:vote${studentVoteCount}`;
        }
        if (typeof sid !== "undefined") {
            data.sid = sid;
        }
        await this.logBookEvent(data);
    }

    renderMCMAFeedBack() {
        var answerStr = "answers";
        var numGiven = this.givenArray.length;
        if (numGiven === 1) {
            answerStr = "answer";
        }
        var numCorrect = this.correctCount;
        var numNeeded = this.correctList.length;
        var feedbackText = this.feedbackString;
        if (this.correct) {
            this.feedBackDiv.innerHTML = `<span class="visuallyhidden">Feedback: Correct</span><span class="material-symbols-outlined mchoice-feedback-icon" aria-hidden="true">check_circle</span> <ol type="A">${feedbackText}</ol>`;
            this.feedBackDiv.className = "alert alert-info";
        } else {
            this.feedBackDiv.innerHTML = `<span class="visuallyhidden">Feedback: Incorrect</span><span class="material-symbols-outlined mchoice-feedback-icon" aria-hidden="true">error</span> You gave ${numGiven} ${answerStr} and got ${numCorrect} correct of ${numNeeded} needed.<ol type="A">${feedbackText}</ol>`;
            this.feedBackDiv.className = "alert alert-danger";
        }
        this.queueMathJax(this.feedBackDiv);
    }

    processMCMFSubmission(logFlag) {
        // Called when the submit button is clicked
        this.getSubmittedOpts(); // make sure this.givenArray is populated
        this.scoreMCMFSubmission();
        this.setLocalStorage({
            correct: this.correct ? "T" : "F",
            answer: this.givenArray.join(","),
        });
        if (logFlag) {
            this.logMCMFsubmission();
        }
        if (!eBookConfig.peer || eBookConfig.isInstructor) {
            this.renderMCMFFeedback();
            if (this.useRunestoneServices) {
                this.enableMCComparison();
            }
        } else {
            if (
                eBookConfig.peer &&
                eBookConfig.peerMode === "async" &&
                typeof studentVoteCount !== "undefined" &&
                studentVoteCount > 1
            ) {
                this.renderMCMAFeedBack();
            } else {
                this.feedBackDiv.innerHTML =
                    "<p>Your answer has been recorded</p>";
                this.feedBackDiv.className = "alert alert-info";
            }
        }
        this.didSubmit = true;
    }

    scoreMCMFSubmission() {
        this.answer = this.givenArray[0];
        if (this.givenArray[0] == this.correctIndexList[0]) {
            this.correct = true;
            this.percent = 1.0;
        } else if (this.givenArray[0] != null) {
            // if given is null then the question wasn"t answered and should be counted as skipped
            this.correct = false;
            this.percent = 0.0;
        }
    }

    async logMCMFsubmission(sid) {
        // If there's no answer provided (the array is empty), use a blank for the answer.
        // Note: use an explicit length check -- answer index 0 (the first choice in
        // source order) is falsy, so `this.givenArray[0] || ""` would wrongly blank it out.
        var answer = this.givenArray.length > 0 ? this.givenArray[0] : "";
        var correct =
            this.givenArray[0] == this.correctIndexList[0] ? "T" : "F";
        var logAnswer =
            "answer:" + answer + ":" + (correct == "T" ? "correct" : "no"); // backward compatible
        let data = {
            event: "mChoice",
            act: logAnswer,
            answer: answer.toString(),
            correct: correct,
            div_id: this.divid,
        };
        if (eBookConfig.peer && typeof studentVoteCount !== "undefined") {
            data.act = data.act + `:vote${studentVoteCount}`;
        }
        if (typeof sid !== "undefined") {
            data.sid = sid;
        }
        await this.logBookEvent(data);
    }

    renderMCMFFeedback() {
        let correct = this.givenArray[0] == this.correctIndexList[0];
        let feedbackText = this.singlefeedback;

        if (correct) {
            this.feedBackDiv.innerHTML = `<span class="visuallyhidden">Feedback: Correct</span><span class="material-symbols-outlined mchoice-feedback-icon" aria-hidden="true">check_circle</span> ` + feedbackText;
            this.feedBackDiv.className = "alert alert-info";
        } else {
            if (feedbackText == null) {
                feedbackText = "";
            }
            this.feedBackDiv.innerHTML = `<span class="visuallyhidden">Feedback: Incorrect</span><span class="material-symbols-outlined mchoice-feedback-icon" aria-hidden="true">error</span> ` + feedbackText;
            this.feedBackDiv.className = "alert alert-danger";
        }
        this.queueMathJax(this.feedBackDiv);
    }
    enableMCComparison() {
        if (eBookConfig.enableCompareMe) {
            this.compareButton.disabled = false;
        }
    }
    instructorMchoiceModal(data) {
        // data.reslist -- student and their answers
        // data.answerDict    -- answers and count
        // data.correct - correct answer
        var res = "<table><tr><th>Student</th><th>Answer(s)</th></tr>";
        for (var i in data) {
            res +=
                "<tr><td>" +
                (0,_common_js_domutil_js__WEBPACK_IMPORTED_MODULE_1__.escapeHtml)(data[i][0]) +
                "</td><td>" +
                (0,_common_js_domutil_js__WEBPACK_IMPORTED_MODULE_1__.escapeHtml)(data[i][1]) +
                "</td></tr>";
        }
        res += "</table>";
        return res;
    }
    compareModal(data, status, whatever) {
        var datadict = data.detail;
        var answers = datadict.answerDict;
        var misc = datadict.misc;
        var kl = Object.keys(answers).sort();
        var body = "<table>";
        body += "<tr><th>Answer</th><th>Percent</th></tr>";
        var theClass = "";
        // answerDict keys come from logged answers, which any student can
        // write -- escape everything that goes into the table
        for (var k in kl) {
            if (kl[k] === misc.correct) {
                theClass = "success";
            } else {
                theClass = "info";
            }
            body +=
                "<tr><td>" +
                (0,_common_js_domutil_js__WEBPACK_IMPORTED_MODULE_1__.escapeHtml)(kl[k]) +
                "</td><td class='compare-me-progress'>";
            var pct = (0,_common_js_domutil_js__WEBPACK_IMPORTED_MODULE_1__.escapeHtml)(answers[kl[k]]) + "%";
            body += "<div class='progress'>";
            body +=
                "    <div class='progress-bar progress-bar-" +
                theClass +
                "' style='width:" +
                pct +
                ";'>" +
                pct;
            body += "    </div>";
            body += "</div></td></tr>";
        }
        body += "</table>";
        if (misc.yourpct !== "unavailable") {
            body +=
                "<br /><p>You have " +
                (0,_common_js_domutil_js__WEBPACK_IMPORTED_MODULE_1__.escapeHtml)(misc.yourpct) +
                "% correct for all questions</p>";
        }
        if (datadict.reslist !== undefined) {
            body += this.instructorMchoiceModal(datadict.reslist);
        }
        // Create a simple modal without jQuery/Bootstrap
        const overlay = document.createElement("div");
        overlay.style.position = "fixed";
        overlay.style.inset = "0";
        overlay.style.background = "rgba(0,0,0,0.5)";
        overlay.style.zIndex = "9999";

        const dialog = document.createElement("div");
        dialog.style.maxWidth = "720px";
        dialog.style.margin = "10vh auto";
        dialog.style.background = "#fff";
        dialog.style.borderRadius = "6px";
        dialog.style.boxShadow = "0 2px 12px rgba(0,0,0,0.3)";
        dialog.style.padding = "16px";

        const header = document.createElement("div");
        const closeBtn = document.createElement("button");
        closeBtn.type = "button";
        closeBtn.textContent = "×";
        closeBtn.setAttribute("aria-label", "Close");
        closeBtn.style.float = "right";
        closeBtn.className = "btn btn-light";
        closeBtn.onclick = function () {
            document.body.removeChild(overlay);
        };
        const title = document.createElement("h4");
        title.className = "modal-title";
        title.textContent = "Distribution of Answers";
        header.appendChild(closeBtn);
        header.appendChild(title);

        const modalBody = document.createElement("div");
        modalBody.innerHTML = body;

        dialog.appendChild(header);
        dialog.appendChild(modalBody);
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);
    }
    // _`compareAnswers`
    async compareAnswers() {
        var data = {};
        data.div_id = this.divid;
        data.course_name = eBookConfig.course;
        try {
            const params = new URLSearchParams(data);
            const resp = await fetch(
                `${eBookConfig.new_server_prefix}/assessment/getaggregateresults?${params.toString()}`,
            );
            const json = await resp.json();
            this.compareModal(json);
        } catch (e) {
            console.error("Error fetching aggregate results:", e);
        }
    }

    disableInteraction() {
        for (var i = 0; i < this.optionArray.length; i++) {
            this.optionArray[i].input.disabled = true;
        }
    }

    enableInteraction() {
        for (var i = 0; i < this.optionArray.length; i++) {
            this.optionArray[i].input.disabled = false;
        }
    }
}

/*=================================
== Find the custom HTML tags and ==
==   execute our code on them    ==
=================================*/
document.addEventListener("runestone:login-complete", function () {
    document
        .querySelectorAll("[data-component=multiplechoice]")
        .forEach(function (el, index) {
            // MC
            var opts = {
                orig: el,
                useRunestoneServices: eBookConfig.useRunestoneServices,
            };
            if (!el.closest("[data-component=timedAssessment]")) {
                // If this element exists within a timed component, don't render it here
                window.componentMap[el.id] = new MultipleChoice(opts);
            }
        });
});


/***/ }),

/***/ 86001:
/*!*****************************************!*\
  !*** ./runestone/mchoice/js/timedmc.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TimedMC)
/* harmony export */ });
/* harmony import */ var _mchoice_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./mchoice.js */ 84270);


class TimedMC extends _mchoice_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(opts) {
        super(opts);
        this.containerDiv.classList.add("runestone");
        this.needsReinitialization = true;
        this.renderTimedIcon(this.MCContainer);
        this.hideButtons(); // Don't show per-question buttons in a timed assessment
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
        if (component) {
            if (component.firstChild) {
                component.insertBefore(timeIconDiv, component.firstChild);
            } else {
                component.appendChild(timeIconDiv);
            }
        }
    }
    hideButtons() {
        //Just hiding the buttons doesn't prevent submitting the form when entering is clicked
        //We need to completely disable the buttons
        if (this.submitButton) {
            this.submitButton.setAttribute("disabled", "true");
            this.submitButton.style.display = "none";
        }
        if (this.compareButton) {
            this.compareButton.style.display = "none";
        }
    }

    // These methods override the methods in the base class. Called from renderFeedback()
    //
    renderMCMAFeedBack() {
        this.feedbackTimedMC();
    }
    renderMCMFFeedback(whatever, whateverr) {
        this.feedbackTimedMC();
    }
    feedbackTimedMC() {
        for (var i = 0; i < this.indexArray.length; i++) {
            var tmpindex = this.indexArray[i];
            this.feedBackEachArray[i].innerHTML =
                String.fromCharCode(65 + i) + ". " + this.feedbackList[i];
            var tmpid = this.answerList[tmpindex].id;
            if (this.correctList.indexOf(tmpid) >= 0) {
                this.feedBackEachArray[i].classList.add(
                    "alert",
                    "alert-success",
                );
            } else {
                this.feedBackEachArray[i].classList.add(
                    "alert",
                    "alert-danger",
                );
            }
        }
    }
    renderMCFormOpts() {
        super.renderMCFormOpts();
        this.feedBackEachArray = [];
        for (var j = 0; j < this.answerList.length; j++) {
            var k = this.indexArray[j];
            var feedBackEach = document.createElement("div");
            feedBackEach.id = this.divid + "_eachFeedback_" + k;
            feedBackEach.classList.add("eachFeedback");
            this.feedBackEachArray.push(feedBackEach);
            this.optsForm.appendChild(feedBackEach);
        }
    }
    checkCorrectTimedMCMA() {
        if (
            this.correctCount === this.correctList.length &&
            this.correctList.length === this.givenArray.length
        ) {
            this.correct = true;
        } else if (this.givenArray.length !== 0) {
            this.correct = false;
        } else {
            // question was skipped
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
    checkCorrectTimedMCMF() {
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
    checkCorrectTimed() {
        if (this.multipleanswers) {
            return this.checkCorrectTimedMCMA();
        } else {
            return this.checkCorrectTimedMCMF();
        }
    }
    hideFeedback() {
        for (var i = 0; i < this.feedBackEachArray.length; i++) {
            this.feedBackEachArray[i].style.display = "none";
        }
    }

    reinitializeListeners() {
        let self = this;
        let answerFunc = function () {
            self.isAnswered = true;
        };
        for (let opt of this.optionArray) {
            opt.input.onclick = answerFunc;
        }
    }
}

if (typeof window.component_factory === "undefined") {
    window.component_factory = {};
}

window.component_factory.multiplechoice = function (opts) {
    if (opts.timed) {
        return new TimedMC(opts);
    } else {
        return new _mchoice_js__WEBPACK_IMPORTED_MODULE_0__["default"](opts);
    }
};


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO0FBQ0E7QUFDQSx3QkFBd0IsNEJBQTRCO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qiw0QkFBNEI7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLG1DQUFtQztBQUMzRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTixtQkFBbUIsbURBQWM7QUFDakM7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvbWNob2ljZS9jc3MvbWNob2ljZS5jc3M/M2ZmMSIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL21jaG9pY2UvanMvbWNob2ljZS5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL21jaG9pY2UvanMvdGltZWRtYy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT09PT09PT0gICAgICBNYXN0ZXIgbWNob2ljZS5qcyAgICAgPT09PT09PT09XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT09ICBUaGlzIGZpbGUgY29udGFpbnMgdGhlIEpTIGZvciB0aGUgICA9PT1cbj09PSBSdW5lc3RvbmUgbXVsdGlwbGUgY2hvaWNlIGNvbXBvbmVudC4gPT09XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT09ICAgICAgICAgICAgICBDcmVhdGVkIEJ5ICAgICAgICAgICAgICA9PT1cbj09PSAgICAgICAgICAgSXNhaWFoIE1heWVyY2hhayAgICAgICAgICAgPT09XG49PT0gICAgICAgICAgICAgICAgIGFuZCAgICAgICAgICAgICAgICAgID09PVxuPT09ICAgICAgICAgICAgIEtpcmJ5IE9sc29uICAgICAgICAgICAgICA9PT1cbj09PSAgICAgICAgICAgICAgICA2LzQvMTUgICAgICAgICAgICAgICAgPT09XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuXG5pbXBvcnQgUnVuZXN0b25lQmFzZSBmcm9tIFwiLi4vLi4vY29tbW9uL2pzL3J1bmVzdG9uZWJhc2UuanNcIjtcbmltcG9ydCB7IGVzY2FwZUh0bWwgfSBmcm9tIFwiLi4vLi4vY29tbW9uL2pzL2RvbXV0aWwuanNcIjtcbmltcG9ydCB7XG4gICAgZGlzYWJsZU1hdGhKYXhUYWJTdG9wcyxcbiAgICBnZXRBY2Nlc3NpYmxlRWxlbWVudFRleHQsXG59IGZyb20gXCIuLi8uLi9jb21tb24vanMvbWF0aGpheC1hMTF5LmpzXCI7XG4vL2ltcG9ydCBcIi4vLi4vc3R5bGVzL3J1bmVzdG9uZS5jc3NcIjtcbmltcG9ydCBcIi4uL2Nzcy9tY2hvaWNlLmNzc1wiO1xuXG4vLyBNQyBjb25zdHJ1Y3RvclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTXVsdGlwbGVDaG9pY2UgZXh0ZW5kcyBSdW5lc3RvbmVCYXNlIHtcbiAgICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgICAgIHN1cGVyKG9wdHMpO1xuICAgICAgICBvcHRzID0gb3B0cyB8fCB7fTtcbiAgICAgICAgdmFyIG9yaWcgPSBvcHRzLm9yaWc7IC8vIGVudGlyZSA8dWw+IGVsZW1lbnRcbiAgICAgICAgdGhpcy5vcmlnRWxlbSA9IG9yaWc7XG4gICAgICAgIHRoaXMudXNlUnVuZXN0b25lU2VydmljZXMgPSBvcHRzLnVzZVJ1bmVzdG9uZVNlcnZpY2VzO1xuICAgICAgICB0aGlzLm11bHRpcGxlYW5zd2VycyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmRpdmlkID0gb3JpZy5pZDtcbiAgICAgICAgaWYgKHRoaXMucGFyc2VCb29sZWFuQXR0cmlidXRlKHRoaXMub3JpZ0VsZW0sIFwiZGF0YS1tdWx0aXBsZWFuc3dlcnNcIikpIHtcbiAgICAgICAgICAgIHRoaXMubXVsdGlwbGVhbnN3ZXJzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNoaWxkcmVuID0gdGhpcy5vcmlnRWxlbS5jaGlsZE5vZGVzO1xuICAgICAgICB0aGlzLnJhbmRvbSA9IGZhbHNlO1xuICAgICAgICBpZiAoZUJvb2tDb25maWcucGVlcikge1xuICAgICAgICAgICAgdGhpcy5yYW5kb20gPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnBhcnNlQm9vbGVhbkF0dHJpYnV0ZSh0aGlzLm9yaWdFbGVtLCBcImRhdGEtcmFuZG9tXCIpKSB7XG4gICAgICAgICAgICB0aGlzLnJhbmRvbSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb3JyZWN0ID0gbnVsbDtcbiAgICAgICAgdGhpcy5kaWRTdWJtaXQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5hbnN3ZXJMaXN0ID0gW107XG4gICAgICAgIHRoaXMuY29ycmVjdExpc3QgPSBbXTtcbiAgICAgICAgdGhpcy5jb3JyZWN0SW5kZXhMaXN0ID0gW107XG4gICAgICAgIHRoaXMuZmVlZGJhY2tMaXN0ID0gW107XG4gICAgICAgIHRoaXMucXVlc3Rpb24gPSBudWxsO1xuICAgICAgICB0aGlzLmNhcHRpb24gPSBcIk11bHRpcGxlIENob2ljZVwiO1xuICAgICAgICB0aGlzLmZpbmRBbnN3ZXJzKCk7XG4gICAgICAgIHRoaXMuZmluZFF1ZXN0aW9uKCk7XG4gICAgICAgIHRoaXMuZmluZEZlZWRiYWNrcygpO1xuICAgICAgICB0aGlzLmNyZWF0ZUNvcnJlY3RMaXN0KCk7XG4gICAgICAgIHRoaXMuY3JlYXRlTUNGb3JtKCk7XG4gICAgICAgIHRoaXMuYWRkQ2FwdGlvbihcInJ1bmVzdG9uZVwiKTtcbiAgICAgICAgdGhpcy5jaGVja1NlcnZlcihcIm1DaG9pY2VcIiwgdHJ1ZSk7XG4gICAgICAgIC8vIHF1ZXVlTWF0aEpheCB3YWl0cyBmb3IgcGFnZS1sZXZlbCBNYXRoSmF4IHJlYWRpbmVzcyB3aGVuIGNvbmZpZ3VyZWQsXG4gICAgICAgIC8vIHRoZW4gdXBkYXRlcyBvcHRpb24gbGFiZWxzIGZyb20gdGhlIHJlbmRlcmVkIGNvbnRlbnQuXG4gICAgICAgIHRoaXMucXVldWVNYXRoSmF4KHRoaXMuY29udGFpbmVyRGl2KS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlTWF0aEpheE9wdGlvbkxhYmVscygpO1xuICAgICAgICAgICAgdGhpcy5kaXNhYmxlT3B0aW9uTWF0aEpheFRhYlN0b3BzKCk7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAodHlwZW9mIFByaXNtICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBQcmlzbS5oaWdobGlnaHRBbGxVbmRlcih0aGlzLmNvbnRhaW5lckRpdik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09PT0gRnVuY3Rpb25zIHBhcnNpbmcgdmFyaWFibGVzICA9PT09XG4gICAgPT09PSAgb3V0IG9mIGludGVybWVkaWF0ZSBIVE1MICAgID09PT1cbiAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuICAgIGZpbmRRdWVzdGlvbigpIHtcbiAgICAgICAgLy8gT2xkIEhUTUwgZm9ybWF0IGhhZCBxdWVzdGlvbiBpbnNpZGUgdWxcbiAgICAgICAgLy8gTmV3ZXIgZm9ybWF0IGhhcyBhIGRpdi5leGVyY2lzZS1zdGF0ZW1lbnQgdGhhdCBpcyBhIHBhcnQgb2YgdGhlIHVsJ3MgcGFyZW50XG4gICAgICAgIC8vIENoZWNrIGZvciBuZXdlciBmb3JtYXQuLi5cbiAgICAgICAgY29uc3QgZXhTdGF0ZW1lbnQgPSB0aGlzLm9yaWdFbGVtLnBhcmVudEVsZW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgICAgIFwiLmV4ZXJjaXNlLXN0YXRlbWVudFwiLFxuICAgICAgICApO1xuICAgICAgICBpZiAoZXhTdGF0ZW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMucXVlc3Rpb24gPSBleFN0YXRlbWVudDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vT2xkZXIgZm9ybWF0XG4gICAgICAgICAgICB2YXIgZGVsaW1pdGVyO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm9yaWdFbGVtLmNoaWxkTm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5vcmlnRWxlbS5jaGlsZE5vZGVzW2ldLm5vZGVOYW1lID09PSBcIkxJXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVsaW1pdGVyID0gdGhpcy5vcmlnRWxlbS5jaGlsZE5vZGVzW2ldLm91dGVySFRNTDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGZ1bGx0ZXh0ID0gdGhpcy5vcmlnRWxlbS5pbm5lckhUTUw7XG4gICAgICAgICAgICB2YXIgdGVtcCA9IGZ1bGx0ZXh0LnNwbGl0KGRlbGltaXRlcik7XG4gICAgICAgICAgICB0aGlzLnF1ZXN0aW9uID0gdGVtcFswXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZpbmRBbnN3ZXJzKCkge1xuICAgICAgICAvLyBDcmVhdGVzIGFuc3dlciBvYmplY3RzIGFuZCBwdXNoZXMgdGhlbSB0byBhbnN3ZXJMaXN0XG4gICAgICAgIC8vIGZvcm1hdDogSUQsIENvcnJlY3QgYm9vbCwgQ29udGVudCAodGV4dClcbiAgICAgICAgdmFyIENoaWxkQW5zd2VyTGlzdCA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGNoaWxkID0gdGhpcy5jaGlsZHJlbltpXTtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBjaGlsZC5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREUgJiZcbiAgICAgICAgICAgICAgICBjaGlsZC5tYXRjaGVzKFwiW2RhdGEtY29tcG9uZW50PWFuc3dlcl1cIilcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIENoaWxkQW5zd2VyTGlzdC5wdXNoKGNoaWxkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IENoaWxkQW5zd2VyTGlzdC5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgdmFyIGFuc3dlcl9pZCA9IENoaWxkQW5zd2VyTGlzdFtqXS5pZDtcbiAgICAgICAgICAgIHZhciBpc19jb3JyZWN0ID0gZmFsc2U7XG4gICAgICAgICAgICBpZiAoQ2hpbGRBbnN3ZXJMaXN0W2pdLmhhc0F0dHJpYnV0ZShcImRhdGEtY29ycmVjdFwiKSkge1xuICAgICAgICAgICAgICAgIC8vIElmIGRhdGEtY29ycmVjdCBhdHRyaWJ1dGUgZXhpc3RzLCBhbnN3ZXIgaXMgY29ycmVjdFxuICAgICAgICAgICAgICAgIGlzX2NvcnJlY3QgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGFuc3dlcl90ZXh0ID0gQ2hpbGRBbnN3ZXJMaXN0W2pdLmlubmVySFRNTDtcbiAgICAgICAgICAgIHZhciBhbnN3ZXJfb2JqZWN0ID0ge1xuICAgICAgICAgICAgICAgIGlkOiBhbnN3ZXJfaWQsXG4gICAgICAgICAgICAgICAgY29ycmVjdDogaXNfY29ycmVjdCxcbiAgICAgICAgICAgICAgICBjb250ZW50OiBhbnN3ZXJfdGV4dCxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0aGlzLmFuc3dlckxpc3QucHVzaChhbnN3ZXJfb2JqZWN0KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZpbmRGZWVkYmFja3MoKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgY2hpbGQgPSB0aGlzLmNoaWxkcmVuW2ldO1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIGNoaWxkLm5vZGVUeXBlID09PSBOb2RlLkVMRU1FTlRfTk9ERSAmJlxuICAgICAgICAgICAgICAgIGNoaWxkLm1hdGNoZXMoXCJbZGF0YS1jb21wb25lbnQ9ZmVlZGJhY2tdXCIpXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmZlZWRiYWNrTGlzdC5wdXNoKGNoaWxkLmlubmVySFRNTCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjcmVhdGVDb3JyZWN0TGlzdCgpIHtcbiAgICAgICAgLy8gQ3JlYXRlcyBhcnJheSB0aGF0IGhvbGRzIHRoZSBJRFwicyBvZiBjb3JyZWN0IGFuc3dlcnNcbiAgICAgICAgLy8gQWxzbyBwb3B1bGF0ZXMgYW4gYXJyYXkgdGhhdCBob2xkcyB0aGUgaW5kZWNlcyBvZiBjb3JyZWN0IGFuc3dlcnNcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmFuc3dlckxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmFuc3dlckxpc3RbaV0uY29ycmVjdCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY29ycmVjdExpc3QucHVzaCh0aGlzLmFuc3dlckxpc3RbaV0uaWQpO1xuICAgICAgICAgICAgICAgIHRoaXMuY29ycmVjdEluZGV4TGlzdC5wdXNoKGkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT09PSAgIEZ1bmN0aW9ucyBnZW5lcmF0aW5nIGZpbmFsIEhUTUwgICA9PT09XG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG4gICAgY3JlYXRlTUNGb3JtKCkge1xuICAgICAgICB0aGlzLnJlbmRlck1DQ29udGFpbmVyKCk7XG4gICAgICAgIHRoaXMucmVuZGVyTUNGb3JtKCk7IC8vIHJlbmRlcnMgdGhlIGZvcm0gd2l0aCBvcHRpb25zIGFuZCBidXR0b25zXG4gICAgICAgIHRoaXMucmVuZGVyTUNmZWVkYmFja0RpdigpO1xuICAgICAgICAvLyByZXBsYWNlcyBpbnRlcm1lZGlhdGUgSFRNTCB3aXRoIHJlbmRlcmVkIEhUTUxcbiAgICAgICAgdGhpcy5vcmlnRWxlbS5yZXBsYWNlV2l0aCh0aGlzLmNvbnRhaW5lckRpdik7XG4gICAgfVxuXG4gICAgcmVuZGVyTUNDb250YWluZXIoKSB7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdGhpcy5xdWVzdGlvbkRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIC8vIHRoaXMucXVlc3Rpb24gbWF5IGJlIGFuIGVsZW1lbnQgb3IgdGV4dCAtIG5lZWQgdG8gaGFuZGxlIGJvdGggY2FzZXNcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLnF1ZXN0aW9uID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICB0aGlzLnF1ZXN0aW9uRGl2LmlubmVySFRNTCA9IHRoaXMucXVlc3Rpb247XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnF1ZXN0aW9uRGl2LmFwcGVuZENoaWxkKHRoaXMucXVlc3Rpb24pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucXVlc3Rpb25EaXYuaWQgPSB0aGlzLmRpdmlkICsgXCJfcHJvbXB0XCI7XG4gICAgICAgIHRoaXMucXVlc3Rpb25EaXYuY2xhc3NOYW1lID0gXCJleGVyY2lzZS1zdGF0ZW1lbnRcIjtcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYuYXBwZW5kQ2hpbGQodGhpcy5xdWVzdGlvbkRpdik7XG4gICAgICAgIGNvbnN0IG9yaWdDbGFzcyA9IHRoaXMub3JpZ0VsZW0uZ2V0QXR0cmlidXRlKFwiY2xhc3NcIik7XG4gICAgICAgIGlmIChvcmlnQ2xhc3MpIHtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmNsYXNzTGlzdC5hZGQoXG4gICAgICAgICAgICAgICAgLi4ub3JpZ0NsYXNzLnNwbGl0KFwiIFwiKS5maWx0ZXIoQm9vbGVhbiksXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmNsYXNzTGlzdC5hZGQoXCJtY2hvaWNlXCIpO1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5pZCA9IHRoaXMuZGl2aWQ7XG4gICAgfVxuXG4gICAgcmVuZGVyTUNGb3JtKCkge1xuICAgICAgICB0aGlzLm9wdHNGb3JtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImZvcm1cIik7XG4gICAgICAgIHRoaXMub3B0c0Zvcm0uaWQgPSB0aGlzLmRpdmlkICsgXCJfZm9ybVwiO1xuICAgICAgICB0aGlzLm9wdHNGb3JtLm1ldGhvZCA9IFwiZ2V0XCI7XG4gICAgICAgIHRoaXMub3B0c0Zvcm0uYWN0aW9uID0gXCJcIjtcbiAgICAgICAgdGhpcy5vcHRzRm9ybS5vbnN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcbiAgICAgICAgLy8gQWRkIGZpZWxkc2V0IGFuZCBsZWdlbmQgZm9yIGFjY2Vzc2liaWxpdHkgLSBsZWdlbmQgbXVzdCBjb21lIGJlZm9yZSB0aGUgb3B0aW9uc1xuICAgICAgICAvLyBzbyBzY3JlZW4gcmVhZGVycyByZWFkIHRoZSBsZWdlbmQgZmlyc3QuXG4gICAgICAgIHRoaXMub3B0c0ZpZWxkU2V0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImZpZWxkc2V0XCIpO1xuICAgICAgICB0aGlzLm9wdHNGaWVsZFNldC5zZXRBdHRyaWJ1dGUoXG4gICAgICAgICAgICBcInJvbGVcIixcbiAgICAgICAgICAgIHRoaXMubXVsdGlwbGVhbnN3ZXJzID8gXCJncm91cFwiIDogXCJyYWRpb2dyb3VwXCIsXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMub3B0c0ZpZWxkU2V0LnNldEF0dHJpYnV0ZShcbiAgICAgICAgICAgIFwiYXJpYS1sYWJlbGxlZGJ5XCIsXG4gICAgICAgICAgICB0aGlzLmRpdmlkICsgXCJfcHJvbXB0XCIsXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMub3B0c0Zvcm0uYXBwZW5kQ2hpbGQodGhpcy5vcHRzRmllbGRTZXQpO1xuICAgICAgICBsZXQgbGVnZW5kID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxlZ2VuZFwiKTtcbiAgICAgICAgaWYgKHRoaXMubXVsdGlwbGVhbnN3ZXJzKSB7XG4gICAgICAgICAgICBsZWdlbmQudGV4dENvbnRlbnQgPSBcIkNob29zZSBhbGwgdGhhdCBhcHBseVwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGVnZW5kLnRleHRDb250ZW50ID0gXCJDaG9vc2Ugb25lXCI7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5vcHRzRmllbGRTZXQuYXBwZW5kQ2hpbGQobGVnZW5kKTtcbiAgICAgICAgLy8gZ2VuZXJhdGUgZm9ybSBvcHRpb25zXG4gICAgICAgIHRoaXMucmVuZGVyTUNGb3JtT3B0cygpO1xuICAgICAgICB0aGlzLnJlbmRlck1DRm9ybUJ1dHRvbnMoKTtcbiAgICAgICAgLy8gQXBwZW5kIHRoZSBmb3JtIHRvIHRoZSBjb250YWluZXJcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYuYXBwZW5kQ2hpbGQodGhpcy5vcHRzRm9ybSk7XG4gICAgfVxuXG4gICAgcmVuZGVyTUNGb3JtT3B0cygpIHtcbiAgICAgICAgLy8gQ3JlYXRlcyBpbnB1dCBET00gZWxlbWVudHMuXG4gICAgICAgIHRoaXMub3B0aW9uQXJyYXkgPSBbXTsgLy8gQXJyYXkgd2l0aCBhbiBvYmplY3QgZm9yIGVhY2ggb3B0aW9uIGNvbnRhaW5pbmcgaXRzIGlucHV0IGFuZCBjb250ZW50IGRpdi5cbiAgICAgICAgY29uc3QgaW5wdXRUeXBlID0gdGhpcy5tdWx0aXBsZWFuc3dlcnMgPyBcImNoZWNrYm94XCIgOiBcInJhZGlvXCI7XG4gICAgICAgIC8vIHRoaXMuaW5kZXhBcnJheSBpcyB1c2VkIHRvIGluZGV4IHRocm91Z2ggdGhlIGFuc3dlcnNcbiAgICAgICAgLy8gaXQgaXMganVzdCAwLW4gbm9ybWFsbHksIGJ1dCB0aGUgb3JkZXIgaXMgc2h1ZmZsZWQgaWYgdGhlIHJhbmRvbSBvcHRpb24gaXMgcHJlc2VudFxuICAgICAgICB0aGlzLmluZGV4QXJyYXkgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmFuc3dlckxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuaW5kZXhBcnJheS5wdXNoKGkpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnJhbmRvbSkge1xuICAgICAgICAgICAgdGhpcy5yYW5kb21pemVBbnN3ZXJzKCk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICBsZXQgYW5zd2VyRnVuYyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHNlbGYuaXNBbnN3ZXJlZCA9IHRydWU7XG4gICAgICAgIH07XG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdGhpcy5hbnN3ZXJMaXN0Lmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICB2YXIgayA9IHRoaXMuaW5kZXhBcnJheVtqXTtcbiAgICAgICAgICAgIGNvbnN0IG9wdE9iaiA9IHRoaXMuY3JlYXRlTUNPcHRpb24oaywgaiwgaW5wdXRUeXBlLCBhbnN3ZXJGdW5jKTtcblxuICAgICAgICAgICAgdGhpcy5vcHRpb25BcnJheS5wdXNoKG9wdE9iaik7XG4gICAgICAgICAgICAvLyBhZGQgdGhlIG9wdGlvbiB0byB0aGUgZm9ybVxuICAgICAgICAgICAgdGhpcy5vcHRzRmllbGRTZXQuYXBwZW5kQ2hpbGQob3B0T2JqLmxhYmVsKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNyZWF0ZU1DT3B0aW9uKGFuc3dlckluZGV4LCBkaXNwbGF5SW5kZXgsIGlucHV0VHlwZSwgYW5zd2VyRnVuYykge1xuICAgICAgICBjb25zdCBvcHRpb25JZCA9IHRoaXMuZGl2aWQgKyBcIl9vcHRfXCIgKyBhbnN3ZXJJbmRleDtcbiAgICAgICAgY29uc3Qgb3B0aW9uTGV0dGVyID0gU3RyaW5nLmZyb21DaGFyQ29kZShcbiAgICAgICAgICAgIFwiQVwiLmNoYXJDb2RlQXQoMCkgKyBkaXNwbGF5SW5kZXgsXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IGNvbnRlbnQgPSB0aGlzLmFuc3dlckxpc3RbYW5zd2VySW5kZXhdLmNvbnRlbnQ7XG4gICAgICAgIGNvbnN0IGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxhYmVsXCIpO1xuICAgICAgICBsYWJlbC5jbGFzc05hbWUgPSBcIm1jaG9pY2Utb3B0aW9uXCI7XG5cbiAgICAgICAgbGV0IGlucHV0O1xuICAgICAgICBsZXQgYWNjZXNzaWJsZVRleHQ7XG4gICAgICAgIGxldCB2aXNpYmxlQ29udGVudDtcbiAgICAgICAgaWYgKHRoaXMuY29udGFpbnNNYXRoSmF4KGNvbnRlbnQpKSB7XG4gICAgICAgICAgICBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcbiAgICAgICAgICAgIGlucHV0LnR5cGUgPSBpbnB1dFR5cGU7XG4gICAgICAgICAgICBpbnB1dC5uYW1lID0gXCJncm91cDFcIjtcbiAgICAgICAgICAgIGlucHV0LnZhbHVlID0gYW5zd2VySW5kZXg7XG4gICAgICAgICAgICBpbnB1dC5pZCA9IG9wdGlvbklkO1xuICAgICAgICAgICAgaW5wdXQuY2xhc3NOYW1lID0gXCJtY2hvaWNlLWlucHV0XCI7XG5cbiAgICAgICAgICAgIGFjY2Vzc2libGVUZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgICAgICAgICBhY2Nlc3NpYmxlVGV4dC5jbGFzc05hbWUgPSBcInZpc3VhbGx5aGlkZGVuXCI7XG4gICAgICAgICAgICBhY2Nlc3NpYmxlVGV4dC50ZXh0Q29udGVudCA9IGBPcHRpb24gJHtvcHRpb25MZXR0ZXJ9LiBDb250ZW50IGZvbGxvd3MuYDtcblxuICAgICAgICAgICAgdmlzaWJsZUNvbnRlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICAgICAgICAgIHZpc2libGVDb250ZW50LmlubmVySFRNTCA9IGAke29wdGlvbkxldHRlcn0uICR7Y29udGVudH1gO1xuICAgICAgICAgICAgbGFiZWwuYXBwZW5kKGlucHV0LCBhY2Nlc3NpYmxlVGV4dCwgdmlzaWJsZUNvbnRlbnQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IGxhYmVsQ29udGVudCA9IGNvbnRlbnQ7XG4gICAgICAgICAgICBsZXQgcHJlZml4ID0gXCJcIjtcbiAgICAgICAgICAgIGlmIChsYWJlbENvbnRlbnQuc3RhcnRzV2l0aChcIjxwPlwiKSkge1xuICAgICAgICAgICAgICAgIHByZWZpeCA9IFwiPHA+XCI7XG4gICAgICAgICAgICAgICAgbGFiZWxDb250ZW50ID0gbGFiZWxDb250ZW50LnNsaWNlKDMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGFiZWwuaW5uZXJIVE1MID1cbiAgICAgICAgICAgICAgICBgJHtwcmVmaXh9PGlucHV0IHR5cGU9XCIke2lucHV0VHlwZX1cIiBuYW1lPVwiZ3JvdXAxXCIgdmFsdWU9XCIke2Fuc3dlckluZGV4fVwiIGlkPVwiJHtvcHRpb25JZH1cIiBjbGFzcz1cIm1jaG9pY2UtaW5wdXRcIj5gICtcbiAgICAgICAgICAgICAgICBgJHtvcHRpb25MZXR0ZXJ9LiAke2xhYmVsQ29udGVudH1gO1xuICAgICAgICAgICAgaW5wdXQgPSBsYWJlbC5xdWVyeVNlbGVjdG9yKFwiaW5wdXRcIik7XG4gICAgICAgIH1cblxuICAgICAgICBpbnB1dC5vbmNsaWNrID0gYW5zd2VyRnVuYztcbiAgICAgICAgcmV0dXJuIHsgaW5wdXQsIGxhYmVsLCBhY2Nlc3NpYmxlVGV4dCwgdmlzaWJsZUNvbnRlbnQgfTtcbiAgICB9XG5cbiAgICB1cGRhdGVNYXRoSmF4T3B0aW9uTGFiZWxzKCkge1xuICAgICAgICBmb3IgKGNvbnN0IG9wdGlvbiBvZiB0aGlzLm9wdGlvbkFycmF5KSB7XG4gICAgICAgICAgICBpZiAoIW9wdGlvbi5hY2Nlc3NpYmxlVGV4dCkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3B0aW9uLmFjY2Vzc2libGVUZXh0LnRleHRDb250ZW50ID1cbiAgICAgICAgICAgICAgICBgT3B0aW9uICR7Z2V0QWNjZXNzaWJsZUVsZW1lbnRUZXh0KG9wdGlvbi52aXNpYmxlQ29udGVudCl9YDtcbiAgICAgICAgICAgIG9wdGlvbi52aXNpYmxlQ29udGVudC5zZXRBdHRyaWJ1dGUoXCJhcmlhLWhpZGRlblwiLCBcInRydWVcIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb250YWluc01hdGhKYXgoY29udGVudCkge1xuICAgICAgICByZXR1cm4gL01hdGhKYXh8bWp4LWNvbnRhaW5lcnxwcm9jZXNzLW1hdGgvLnRlc3QoY29udGVudCk7XG4gICAgfVxuXG4gICAgZGlzYWJsZU9wdGlvbk1hdGhKYXhUYWJTdG9wcygpIHtcbiAgICAgICAgZGlzYWJsZU1hdGhKYXhUYWJTdG9wcyh0aGlzLmNvbnRhaW5lckRpdiwgW1wiLm1jaG9pY2Utb3B0aW9uXCJdKTtcbiAgICB9XG5cbiAgICByZW5kZXJNQ0Zvcm1CdXR0b25zKCkge1xuICAgICAgICAvLyBzdWJtaXQgYW5kIGNvbXBhcmUgbWUgYnV0dG9uc1xuICAgICAgICAvLyBDcmVhdGUgc3VibWl0IGJ1dHRvblxuICAgICAgICB0aGlzLnN1Ym1pdEJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICAgIHRoaXMuc3VibWl0QnV0dG9uLnRleHRDb250ZW50ID0gXCJDaGVjayBNZVwiO1xuICAgICAgICB0aGlzLnN1Ym1pdEJ1dHRvbi5jbGFzc05hbWUgPSBcImJ0biBidG4tc3VjY2Vzc1wiO1xuICAgICAgICB0aGlzLnN1Ym1pdEJ1dHRvbi5uYW1lID0gXCJkbyBhbnN3ZXJcIjtcbiAgICAgICAgdGhpcy5zdWJtaXRCdXR0b24udHlwZSA9IFwiYnV0dG9uXCI7XG4gICAgICAgIGlmICh0aGlzLm11bHRpcGxlYW5zd2Vycykge1xuICAgICAgICAgICAgdGhpcy5zdWJtaXRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgICAgICBcImNsaWNrXCIsXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2Nlc3NNQ01BU3VibWlzc2lvbih0cnVlKTtcbiAgICAgICAgICAgICAgICB9LmJpbmQodGhpcyksXG4gICAgICAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zdWJtaXRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgICAgICBcImNsaWNrXCIsXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKGV2KSB7XG4gICAgICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvY2Vzc01DTUZTdWJtaXNzaW9uKHRydWUpO1xuICAgICAgICAgICAgICAgIH0uYmluZCh0aGlzKSxcbiAgICAgICAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gLy8gZW5kIGVsc2VcbiAgICAgICAgdGhpcy5vcHRzRm9ybS5hcHBlbmRDaGlsZCh0aGlzLnN1Ym1pdEJ1dHRvbik7XG4gICAgICAgIC8vIENyZWF0ZSBjb21wYXJlIGJ1dHRvblxuICAgICAgICBpZiAodGhpcy51c2VSdW5lc3RvbmVTZXJ2aWNlcyAmJiAhZUJvb2tDb25maWcucGVlcikge1xuICAgICAgICAgICAgdGhpcy5jb21wYXJlQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICAgICAgICAgIHRoaXMuY29tcGFyZUJ1dHRvbi5jbGFzc05hbWUgPSBcImJ0biBidG4tZGVmYXVsdFwiO1xuICAgICAgICAgICAgdGhpcy5jb21wYXJlQnV0dG9uLmlkID0gdGhpcy5kaXZpZCArIFwiX2Jjb21wXCI7XG4gICAgICAgICAgICB0aGlzLmNvbXBhcmVCdXR0b24uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5jb21wYXJlQnV0dG9uLm5hbWUgPSBcImNvbXBhcmVcIjtcbiAgICAgICAgICAgIHRoaXMuY29tcGFyZUJ1dHRvbi50ZXh0Q29udGVudCA9IFwiQ29tcGFyZSBtZVwiO1xuICAgICAgICAgICAgdGhpcy5jb21wYXJlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICAgICAgXCJjbGlja1wiLFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb21wYXJlQW5zd2Vycyh0aGlzLmRpdmlkKTtcbiAgICAgICAgICAgICAgICB9LmJpbmQodGhpcyksXG4gICAgICAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgdGhpcy5vcHRzRm9ybS5hcHBlbmRDaGlsZCh0aGlzLmNvbXBhcmVCdXR0b24pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVuZGVyTUNmZWVkYmFja0RpdigpIHtcbiAgICAgICAgdGhpcy5mZWVkQmFja0RpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHRoaXMuZmVlZEJhY2tEaXYuaWQgPSB0aGlzLmRpdmlkICsgXCJfZmVlZGJhY2tcIjtcbiAgICAgICAgdGhpcy5mZWVkQmFja0Rpdi5zZXRBdHRyaWJ1dGUoXCJhcmlhLWxpdmVcIiwgXCJwb2xpdGVcIik7XG4gICAgICAgIHRoaXMuZmVlZEJhY2tEaXYuc2V0QXR0cmlidXRlKFwicm9sZVwiLCBcInN0YXR1c1wiKTtcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYuYXBwZW5kQ2hpbGQodGhpcy5mZWVkQmFja0Rpdik7XG4gICAgfVxuXG4gICAgcmFuZG9taXplQW5zd2VycygpIHtcbiAgICAgICAgLy8gTWFrZXMgdGhlIG9yZGVyaW5nIG9mIHRoZSBhbnN3ZXIgY2hvaWNlcyByYW5kb21cbiAgICAgICAgdmFyIGN1cnJlbnRJbmRleCA9IHRoaXMuaW5kZXhBcnJheS5sZW5ndGgsXG4gICAgICAgICAgICB0ZW1wb3JhcnlWYWx1ZSxcbiAgICAgICAgICAgIHJhbmRvbUluZGV4O1xuICAgICAgICAvLyBXaGlsZSB0aGVyZSByZW1haW4gZWxlbWVudHMgdG8gc2h1ZmZsZS4uLlxuICAgICAgICB3aGlsZSAoY3VycmVudEluZGV4ICE9PSAwKSB7XG4gICAgICAgICAgICAvLyBQaWNrIGEgcmVtYWluaW5nIGVsZW1lbnQuLi5cbiAgICAgICAgICAgIHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY3VycmVudEluZGV4KTtcbiAgICAgICAgICAgIGN1cnJlbnRJbmRleCAtPSAxO1xuICAgICAgICAgICAgLy8gQW5kIHN3YXAgaXQgd2l0aCB0aGUgY3VycmVudCBlbGVtZW50LlxuICAgICAgICAgICAgdGVtcG9yYXJ5VmFsdWUgPSB0aGlzLmluZGV4QXJyYXlbY3VycmVudEluZGV4XTtcbiAgICAgICAgICAgIHRoaXMuaW5kZXhBcnJheVtjdXJyZW50SW5kZXhdID0gdGhpcy5pbmRleEFycmF5W3JhbmRvbUluZGV4XTtcbiAgICAgICAgICAgIHRoaXMuaW5kZXhBcnJheVtyYW5kb21JbmRleF0gPSB0ZW1wb3JhcnlWYWx1ZTtcbiAgICAgICAgICAgIHZhciB0ZW1wb3JhcnlGZWVkYmFjayA9IHRoaXMuZmVlZGJhY2tMaXN0W2N1cnJlbnRJbmRleF07XG4gICAgICAgICAgICB0aGlzLmZlZWRiYWNrTGlzdFtjdXJyZW50SW5kZXhdID0gdGhpcy5mZWVkYmFja0xpc3RbcmFuZG9tSW5kZXhdO1xuICAgICAgICAgICAgdGhpcy5mZWVkYmFja0xpc3RbcmFuZG9tSW5kZXhdID0gdGVtcG9yYXJ5RmVlZGJhY2s7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT09IENoZWNraW5nL2xvYWRpbmcgZnJvbSBzdG9yYWdlID09PVxuICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbiAgICByZXN0b3JlQW5zd2VycyhkYXRhKSB7XG4gICAgICAgIC8vIFJlc3RvcmUgYW5zd2VycyBmcm9tIHN0b3JhZ2UgcmV0cmlldmFsIGRvbmUgaW4gUnVuZXN0b25lQmFzZVxuICAgICAgICAvLyBzb21ldGltZXMgZGF0YS5hbnN3ZXIgY2FuIGJlIG51bGxcbiAgICAgICAgaWYgKCFkYXRhLmFuc3dlcikge1xuICAgICAgICAgICAgZGF0YS5hbnN3ZXIgPSBcIlwiO1xuICAgICAgICB9XG4gICAgICAgIHZhciBhbnN3ZXJzID0gZGF0YS5hbnN3ZXIuc3BsaXQoXCIsXCIpO1xuICAgICAgICBmb3IgKHZhciBhID0gMDsgYSA8IGFuc3dlcnMubGVuZ3RoOyBhKyspIHtcbiAgICAgICAgICAgIHZhciBpbmRleCA9IGFuc3dlcnNbYV07XG4gICAgICAgICAgICBmb3IgKHZhciBiID0gMDsgYiA8IHRoaXMub3B0aW9uQXJyYXkubGVuZ3RoOyBiKyspIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5vcHRpb25BcnJheVtiXS5pbnB1dC52YWx1ZSA9PSBpbmRleCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbkFycmF5W2JdLmlucHV0LmNoZWNrZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5tdWx0aXBsZWFuc3dlcnMpIHtcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc01DTUFTdWJtaXNzaW9uKGZhbHNlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc01DTUZTdWJtaXNzaW9uKGZhbHNlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNoZWNrTG9jYWxTdG9yYWdlKCkge1xuICAgICAgICAvLyBSZXBvcHVsYXRlcyBNQ01BIHF1ZXN0aW9ucyB3aXRoIGEgdXNlcidzIHByZXZpb3VzIGFuc3dlcnMsXG4gICAgICAgIC8vIHdoaWNoIHdlcmUgc3RvcmVkIGludG8gbG9jYWwgc3RvcmFnZS5cbiAgICAgICAgdmFyIHN0b3JlZERhdGE7XG4gICAgICAgIHZhciBhbnN3ZXJzO1xuICAgICAgICBpZiAodGhpcy5ncmFkZXJhY3RpdmUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbGVuID0gbG9jYWxTdG9yYWdlLmxlbmd0aDtcbiAgICAgICAgaWYgKGxlbiA+IDApIHtcbiAgICAgICAgICAgIHZhciBleCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMubG9jYWxTdG9yYWdlS2V5KCkpO1xuICAgICAgICAgICAgbGV0IGVycm9yID0gZmFsc2U7XG4gICAgICAgICAgICBpZiAoZXggIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBzdG9yZWREYXRhID0gSlNPTi5wYXJzZShleCk7XG4gICAgICAgICAgICAgICAgICAgIGFuc3dlcnMgPSBzdG9yZWREYXRhLmFuc3dlci5zcGxpdChcIixcIik7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGVycm9yIHdoaWxlIHBhcnNpbmc7IGxpa2VseSBkdWUgdG8gYmFkIHZhbHVlIHN0b3JlZCBpbiBzdG9yYWdlXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgICAgICAgICAgICAgICAgYEVycm9yIHBhcnNpbmcgc3RvcmVkIG1jaG9pY2UgZGF0YSBmb3IgJHt0aGlzLmRpdmlkfTogJHtlcnIubWVzc2FnZX1gLFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBlcnJvciA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChlcnJvciB8fCBzdG9yZWREYXRhLnRpbWVzdGFtcCA8IGVCb29rQ29uZmlnLnRlcm1TdGFydERhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0odGhpcy5sb2NhbFN0b3JhZ2VLZXkoKSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgYSA9IDA7IGEgPCBhbnN3ZXJzLmxlbmd0aDsgYSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IGFuc3dlcnNbYV07XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGIgPSAwOyBiIDwgdGhpcy5vcHRpb25BcnJheS5sZW5ndGg7IGIrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9uQXJyYXlbYl0uaW5wdXQudmFsdWUgPT0gaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbkFycmF5W2JdLmlucHV0LmNoZWNrZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnVzZVJ1bmVzdG9uZVNlcnZpY2VzKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZW5hYmxlTUNDb21wYXJpc29uKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0U3VibWl0dGVkT3B0cygpOyAvLyB0byBwb3B1bGF0ZSBnaXZlbmxvZyBmb3IgbG9nZ2luZ1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5tdWx0aXBsZWFuc3dlcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9nTUNNQXN1Ym1pc3Npb24oKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9nTUNNRnN1Ym1pc3Npb24oKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldExvY2FsU3RvcmFnZShkYXRhKSB7XG4gICAgICAgIHZhciB0aW1lU3RhbXAgPSBuZXcgRGF0ZSgpO1xuICAgICAgICB2YXIgc3RvcmFnZU9iaiA9IHtcbiAgICAgICAgICAgIGFuc3dlcjogZGF0YS5hbnN3ZXIsXG4gICAgICAgICAgICB0aW1lc3RhbXA6IHRpbWVTdGFtcCxcbiAgICAgICAgICAgIGNvcnJlY3Q6IGRhdGEuY29ycmVjdCxcbiAgICAgICAgfTtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXG4gICAgICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZUtleSgpLFxuICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoc3RvcmFnZU9iaiksXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT09IFByb2Nlc3NpbmcgTUMgU3VibWlzc2lvbnMgPT09XG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG4gICAgcHJvY2Vzc01DTUFTdWJtaXNzaW9uKGxvZ0ZsYWcpIHtcbiAgICAgICAgLy8gQ2FsbGVkIHdoZW4gdGhlIHN1Ym1pdCBidXR0b24gaXMgY2xpY2tlZFxuICAgICAgICB0aGlzLmdldFN1Ym1pdHRlZE9wdHMoKTsgLy8gbWFrZSBzdXJlIHRoaXMuZ2l2ZW5BcnJheSBpcyBwb3B1bGF0ZWRcbiAgICAgICAgdGhpcy5zY29yZU1DTUFTdWJtaXNzaW9uKCk7XG4gICAgICAgIHRoaXMuc2V0TG9jYWxTdG9yYWdlKHtcbiAgICAgICAgICAgIGNvcnJlY3Q6IHRoaXMuY29ycmVjdCA/IFwiVFwiIDogXCJGXCIsXG4gICAgICAgICAgICBhbnN3ZXI6IHRoaXMuZ2l2ZW5BcnJheS5qb2luKFwiLFwiKSxcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChsb2dGbGFnKSB7XG4gICAgICAgICAgICB0aGlzLmxvZ01DTUFzdWJtaXNzaW9uKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFlQm9va0NvbmZpZy5wZWVyIHx8IGVCb29rQ29uZmlnLmlzSW5zdHJ1Y3Rvcikge1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJNQ01BRmVlZEJhY2soKTtcbiAgICAgICAgICAgIGlmICh0aGlzLnVzZVJ1bmVzdG9uZVNlcnZpY2VzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbmFibGVNQ0NvbXBhcmlzb24oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGFja25vd2xlZGdlIHN1Ym1pc3Npb25cbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBlQm9va0NvbmZpZy5wZWVyICYmXG4gICAgICAgICAgICAgICAgZUJvb2tDb25maWcucGVlck1vZGUgPT09IFwiYXN5bmNcIiAmJlxuICAgICAgICAgICAgICAgIHR5cGVvZiBzdHVkZW50Vm90ZUNvdW50ICE9PSBcInVuZGVmaW5lZFwiICYmXG4gICAgICAgICAgICAgICAgc3R1ZGVudFZvdGVDb3VudCA+IDFcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyTUNNQUZlZWRCYWNrKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuZmVlZEJhY2tEaXYuaW5uZXJIVE1MID1cbiAgICAgICAgICAgICAgICAgICAgXCI8cD5Zb3VyIGFuc3dlciBoYXMgYmVlbiByZWNvcmRlZDwvcD5cIjtcbiAgICAgICAgICAgICAgICB0aGlzLmZlZWRCYWNrRGl2LmNsYXNzTmFtZSA9IFwiYWxlcnQgYWxlcnQtaW5mb1wiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGlkU3VibWl0ID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBnZXRTdWJtaXR0ZWRPcHRzKCkge1xuICAgICAgICB2YXIgZ2l2ZW47XG4gICAgICAgIHRoaXMuc2luZ2xlZmVlZGJhY2sgPSBcIlwiOyAvLyBVc2VkIGZvciBNQ01GIHF1ZXN0aW9uc1xuICAgICAgICB0aGlzLmZlZWRiYWNrU3RyaW5nID0gXCJcIjsgLy8gVXNlZCBmb3IgTUNNQSBxdWVzdGlvbnNcbiAgICAgICAgdGhpcy5naXZlbkFycmF5ID0gW107XG4gICAgICAgIHRoaXMuZ2l2ZW5sb2cgPSBcIlwiO1xuICAgICAgICB2YXIgYnV0dG9uT2JqcyA9IHRoaXMub3B0c0Zvcm0uZWxlbWVudHMuZ3JvdXAxO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJ1dHRvbk9ianMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChidXR0b25PYmpzW2ldLmNoZWNrZWQpIHtcbiAgICAgICAgICAgICAgICBnaXZlbiA9IHBhcnNlSW50KGJ1dHRvbk9ianNbaV0udmFsdWUsIDEwKTtcbiAgICAgICAgICAgICAgICB0aGlzLmdpdmVuQXJyYXkucHVzaChnaXZlbik7XG4gICAgICAgICAgICAgICAgdGhpcy5mZWVkYmFja1N0cmluZyArPSBgPGxpIHZhbHVlPVwiJHtpICsgMX1cIj4ke3RoaXMuZmVlZGJhY2tMaXN0W2ldXG4gICAgICAgICAgICAgICAgICAgIH08L2xpPmA7XG4gICAgICAgICAgICAgICAgdGhpcy5naXZlbmxvZyArPSBnaXZlbiArIFwiLFwiO1xuICAgICAgICAgICAgICAgIHRoaXMuc2luZ2xlZmVlZGJhY2sgPSB0aGlzLmZlZWRiYWNrTGlzdFtpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmdpdmVuQXJyYXkuc29ydCgoYSwgYikgPT4gYSAtIGIpO1xuICAgIH1cblxuICAgIGNoZWNrQ3VycmVudEFuc3dlcigpIHtcbiAgICAgICAgdGhpcy5nZXRTdWJtaXR0ZWRPcHRzKCk7XG4gICAgICAgIGlmICh0aGlzLmdpdmVuQXJyYXkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMubXVsdGlwbGVhbnN3ZXJzKSB7XG4gICAgICAgICAgICB0aGlzLnNjb3JlTUNNQVN1Ym1pc3Npb24oKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc2NvcmVNQ01GU3VibWlzc2lvbigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgbG9nQ3VycmVudEFuc3dlcihzaWQpIHtcbiAgICAgICAgaWYgKHRoaXMubXVsdGlwbGVhbnN3ZXJzKSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmxvZ01DTUFzdWJtaXNzaW9uKHNpZCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmxvZ01DTUZzdWJtaXNzaW9uKHNpZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZW5kZXJGZWVkYmFjaygpIHtcbiAgICAgICAgaWYgKHRoaXMubXVsdGlwbGVhbnN3ZXJzKSB7XG4gICAgICAgICAgICB0aGlzLnJlbmRlck1DTUFGZWVkQmFjaygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJNQ01GRmVlZGJhY2soKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnF1ZXVlTWF0aEpheCh0aGlzLmZlZWRCYWNrRGl2KTtcbiAgICB9XG4gICAgc2NvcmVNQ01BU3VibWlzc2lvbigpIHtcbiAgICAgICAgdGhpcy5jb3JyZWN0Q291bnQgPSAwO1xuICAgICAgICB2YXIgY29ycmVjdEluZGV4ID0gMDtcbiAgICAgICAgdmFyIGdpdmVuSW5kZXggPSAwO1xuICAgICAgICB3aGlsZSAoXG4gICAgICAgICAgICBjb3JyZWN0SW5kZXggPCB0aGlzLmNvcnJlY3RJbmRleExpc3QubGVuZ3RoICYmXG4gICAgICAgICAgICBnaXZlbkluZGV4IDwgdGhpcy5naXZlbkFycmF5Lmxlbmd0aFxuICAgICAgICApIHtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICB0aGlzLmdpdmVuQXJyYXlbZ2l2ZW5JbmRleF0gPFxuICAgICAgICAgICAgICAgIHRoaXMuY29ycmVjdEluZGV4TGlzdFtjb3JyZWN0SW5kZXhdXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBnaXZlbkluZGV4Kys7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgICAgIHRoaXMuZ2l2ZW5BcnJheVtnaXZlbkluZGV4XSA9PVxuICAgICAgICAgICAgICAgIHRoaXMuY29ycmVjdEluZGV4TGlzdFtjb3JyZWN0SW5kZXhdXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvcnJlY3RDb3VudCsrO1xuICAgICAgICAgICAgICAgIGdpdmVuSW5kZXgrKztcbiAgICAgICAgICAgICAgICBjb3JyZWN0SW5kZXgrKztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29ycmVjdEluZGV4Kys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG51bUdpdmVuID0gdGhpcy5naXZlbkFycmF5Lmxlbmd0aDtcbiAgICAgICAgdmFyIG51bUNvcnJlY3QgPSB0aGlzLmNvcnJlY3RDb3VudDtcbiAgICAgICAgdmFyIG51bU5lZWRlZCA9IHRoaXMuY29ycmVjdExpc3QubGVuZ3RoO1xuICAgICAgICB0aGlzLmFuc3dlciA9IHRoaXMuZ2l2ZW5BcnJheS5qb2luKFwiLFwiKTtcbiAgICAgICAgdGhpcy5jb3JyZWN0ID0gbnVtQ29ycmVjdCA9PT0gbnVtTmVlZGVkICYmIG51bU5lZWRlZCA9PT0gbnVtR2l2ZW47XG4gICAgICAgIGlmIChudW1HaXZlbiA9PT0gbnVtTmVlZGVkKSB7XG4gICAgICAgICAgICB0aGlzLnBlcmNlbnQgPSBudW1Db3JyZWN0IC8gbnVtTmVlZGVkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wZXJjZW50ID0gbnVtQ29ycmVjdCAvIE1hdGgubWF4KG51bUdpdmVuLCBudW1OZWVkZWQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgbG9nTUNNQXN1Ym1pc3Npb24oc2lkKSB7XG4gICAgICAgIHZhciBhbnN3ZXIgPSB0aGlzLmFuc3dlciB8fCBcIlwiO1xuICAgICAgICB2YXIgY29ycmVjdCA9IHRoaXMuY29ycmVjdCB8fCBmYWxzZTtcbiAgICAgICAgdmFyIGxvZ0Fuc3dlciA9XG4gICAgICAgICAgICBcImFuc3dlcjpcIiArIGFuc3dlciArIFwiOlwiICsgKGNvcnJlY3QgPT0gdHJ1ZSA/IFwiY29ycmVjdFwiIDogXCJub1wiKTtcbiAgICAgICAgbGV0IGRhdGEgPSB7XG4gICAgICAgICAgICBldmVudDogXCJtQ2hvaWNlXCIsXG4gICAgICAgICAgICBhY3Q6IGxvZ0Fuc3dlcixcbiAgICAgICAgICAgIGFuc3dlcjogYW5zd2VyLnRvU3RyaW5nKCksXG4gICAgICAgICAgICBjb3JyZWN0OiBjb3JyZWN0LFxuICAgICAgICAgICAgZGl2X2lkOiB0aGlzLmRpdmlkLFxuICAgICAgICB9O1xuICAgICAgICBpZiAoZUJvb2tDb25maWcucGVlciAmJiB0eXBlb2Ygc3R1ZGVudFZvdGVDb3VudCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgZGF0YS5hY3QgPSBkYXRhLmFjdCArIGA6dm90ZSR7c3R1ZGVudFZvdGVDb3VudH1gO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2Ygc2lkICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBkYXRhLnNpZCA9IHNpZDtcbiAgICAgICAgfVxuICAgICAgICBhd2FpdCB0aGlzLmxvZ0Jvb2tFdmVudChkYXRhKTtcbiAgICB9XG5cbiAgICByZW5kZXJNQ01BRmVlZEJhY2soKSB7XG4gICAgICAgIHZhciBhbnN3ZXJTdHIgPSBcImFuc3dlcnNcIjtcbiAgICAgICAgdmFyIG51bUdpdmVuID0gdGhpcy5naXZlbkFycmF5Lmxlbmd0aDtcbiAgICAgICAgaWYgKG51bUdpdmVuID09PSAxKSB7XG4gICAgICAgICAgICBhbnN3ZXJTdHIgPSBcImFuc3dlclwiO1xuICAgICAgICB9XG4gICAgICAgIHZhciBudW1Db3JyZWN0ID0gdGhpcy5jb3JyZWN0Q291bnQ7XG4gICAgICAgIHZhciBudW1OZWVkZWQgPSB0aGlzLmNvcnJlY3RMaXN0Lmxlbmd0aDtcbiAgICAgICAgdmFyIGZlZWRiYWNrVGV4dCA9IHRoaXMuZmVlZGJhY2tTdHJpbmc7XG4gICAgICAgIGlmICh0aGlzLmNvcnJlY3QpIHtcbiAgICAgICAgICAgIHRoaXMuZmVlZEJhY2tEaXYuaW5uZXJIVE1MID0gYDxzcGFuIGNsYXNzPVwidmlzdWFsbHloaWRkZW5cIj5GZWVkYmFjazogQ29ycmVjdDwvc3Bhbj48c3BhbiBjbGFzcz1cIm1hdGVyaWFsLXN5bWJvbHMtb3V0bGluZWQgbWNob2ljZS1mZWVkYmFjay1pY29uXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+Y2hlY2tfY2lyY2xlPC9zcGFuPiA8b2wgdHlwZT1cIkFcIj4ke2ZlZWRiYWNrVGV4dH08L29sPmA7XG4gICAgICAgICAgICB0aGlzLmZlZWRCYWNrRGl2LmNsYXNzTmFtZSA9IFwiYWxlcnQgYWxlcnQtaW5mb1wiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5mZWVkQmFja0Rpdi5pbm5lckhUTUwgPSBgPHNwYW4gY2xhc3M9XCJ2aXN1YWxseWhpZGRlblwiPkZlZWRiYWNrOiBJbmNvcnJlY3Q8L3NwYW4+PHNwYW4gY2xhc3M9XCJtYXRlcmlhbC1zeW1ib2xzLW91dGxpbmVkIG1jaG9pY2UtZmVlZGJhY2staWNvblwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPmVycm9yPC9zcGFuPiBZb3UgZ2F2ZSAke251bUdpdmVufSAke2Fuc3dlclN0cn0gYW5kIGdvdCAke251bUNvcnJlY3R9IGNvcnJlY3Qgb2YgJHtudW1OZWVkZWR9IG5lZWRlZC48b2wgdHlwZT1cIkFcIj4ke2ZlZWRiYWNrVGV4dH08L29sPmA7XG4gICAgICAgICAgICB0aGlzLmZlZWRCYWNrRGl2LmNsYXNzTmFtZSA9IFwiYWxlcnQgYWxlcnQtZGFuZ2VyXCI7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5xdWV1ZU1hdGhKYXgodGhpcy5mZWVkQmFja0Rpdik7XG4gICAgfVxuXG4gICAgcHJvY2Vzc01DTUZTdWJtaXNzaW9uKGxvZ0ZsYWcpIHtcbiAgICAgICAgLy8gQ2FsbGVkIHdoZW4gdGhlIHN1Ym1pdCBidXR0b24gaXMgY2xpY2tlZFxuICAgICAgICB0aGlzLmdldFN1Ym1pdHRlZE9wdHMoKTsgLy8gbWFrZSBzdXJlIHRoaXMuZ2l2ZW5BcnJheSBpcyBwb3B1bGF0ZWRcbiAgICAgICAgdGhpcy5zY29yZU1DTUZTdWJtaXNzaW9uKCk7XG4gICAgICAgIHRoaXMuc2V0TG9jYWxTdG9yYWdlKHtcbiAgICAgICAgICAgIGNvcnJlY3Q6IHRoaXMuY29ycmVjdCA/IFwiVFwiIDogXCJGXCIsXG4gICAgICAgICAgICBhbnN3ZXI6IHRoaXMuZ2l2ZW5BcnJheS5qb2luKFwiLFwiKSxcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChsb2dGbGFnKSB7XG4gICAgICAgICAgICB0aGlzLmxvZ01DTUZzdWJtaXNzaW9uKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFlQm9va0NvbmZpZy5wZWVyIHx8IGVCb29rQ29uZmlnLmlzSW5zdHJ1Y3Rvcikge1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJNQ01GRmVlZGJhY2soKTtcbiAgICAgICAgICAgIGlmICh0aGlzLnVzZVJ1bmVzdG9uZVNlcnZpY2VzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbmFibGVNQ0NvbXBhcmlzb24oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBlQm9va0NvbmZpZy5wZWVyICYmXG4gICAgICAgICAgICAgICAgZUJvb2tDb25maWcucGVlck1vZGUgPT09IFwiYXN5bmNcIiAmJlxuICAgICAgICAgICAgICAgIHR5cGVvZiBzdHVkZW50Vm90ZUNvdW50ICE9PSBcInVuZGVmaW5lZFwiICYmXG4gICAgICAgICAgICAgICAgc3R1ZGVudFZvdGVDb3VudCA+IDFcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyTUNNQUZlZWRCYWNrKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuZmVlZEJhY2tEaXYuaW5uZXJIVE1MID1cbiAgICAgICAgICAgICAgICAgICAgXCI8cD5Zb3VyIGFuc3dlciBoYXMgYmVlbiByZWNvcmRlZDwvcD5cIjtcbiAgICAgICAgICAgICAgICB0aGlzLmZlZWRCYWNrRGl2LmNsYXNzTmFtZSA9IFwiYWxlcnQgYWxlcnQtaW5mb1wiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGlkU3VibWl0ID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBzY29yZU1DTUZTdWJtaXNzaW9uKCkge1xuICAgICAgICB0aGlzLmFuc3dlciA9IHRoaXMuZ2l2ZW5BcnJheVswXTtcbiAgICAgICAgaWYgKHRoaXMuZ2l2ZW5BcnJheVswXSA9PSB0aGlzLmNvcnJlY3RJbmRleExpc3RbMF0pIHtcbiAgICAgICAgICAgIHRoaXMuY29ycmVjdCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLnBlcmNlbnQgPSAxLjA7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5naXZlbkFycmF5WzBdICE9IG51bGwpIHtcbiAgICAgICAgICAgIC8vIGlmIGdpdmVuIGlzIG51bGwgdGhlbiB0aGUgcXVlc3Rpb24gd2FzblwidCBhbnN3ZXJlZCBhbmQgc2hvdWxkIGJlIGNvdW50ZWQgYXMgc2tpcHBlZFxuICAgICAgICAgICAgdGhpcy5jb3JyZWN0ID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLnBlcmNlbnQgPSAwLjA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyBsb2dNQ01Gc3VibWlzc2lvbihzaWQpIHtcbiAgICAgICAgLy8gSWYgdGhlcmUncyBubyBhbnN3ZXIgcHJvdmlkZWQgKHRoZSBhcnJheSBpcyBlbXB0eSksIHVzZSBhIGJsYW5rIGZvciB0aGUgYW5zd2VyLlxuICAgICAgICAvLyBOb3RlOiB1c2UgYW4gZXhwbGljaXQgbGVuZ3RoIGNoZWNrIC0tIGFuc3dlciBpbmRleCAwICh0aGUgZmlyc3QgY2hvaWNlIGluXG4gICAgICAgIC8vIHNvdXJjZSBvcmRlcikgaXMgZmFsc3ksIHNvIGB0aGlzLmdpdmVuQXJyYXlbMF0gfHwgXCJcImAgd291bGQgd3JvbmdseSBibGFuayBpdCBvdXQuXG4gICAgICAgIHZhciBhbnN3ZXIgPSB0aGlzLmdpdmVuQXJyYXkubGVuZ3RoID4gMCA/IHRoaXMuZ2l2ZW5BcnJheVswXSA6IFwiXCI7XG4gICAgICAgIHZhciBjb3JyZWN0ID1cbiAgICAgICAgICAgIHRoaXMuZ2l2ZW5BcnJheVswXSA9PSB0aGlzLmNvcnJlY3RJbmRleExpc3RbMF0gPyBcIlRcIiA6IFwiRlwiO1xuICAgICAgICB2YXIgbG9nQW5zd2VyID1cbiAgICAgICAgICAgIFwiYW5zd2VyOlwiICsgYW5zd2VyICsgXCI6XCIgKyAoY29ycmVjdCA9PSBcIlRcIiA/IFwiY29ycmVjdFwiIDogXCJub1wiKTsgLy8gYmFja3dhcmQgY29tcGF0aWJsZVxuICAgICAgICBsZXQgZGF0YSA9IHtcbiAgICAgICAgICAgIGV2ZW50OiBcIm1DaG9pY2VcIixcbiAgICAgICAgICAgIGFjdDogbG9nQW5zd2VyLFxuICAgICAgICAgICAgYW5zd2VyOiBhbnN3ZXIudG9TdHJpbmcoKSxcbiAgICAgICAgICAgIGNvcnJlY3Q6IGNvcnJlY3QsXG4gICAgICAgICAgICBkaXZfaWQ6IHRoaXMuZGl2aWQsXG4gICAgICAgIH07XG4gICAgICAgIGlmIChlQm9va0NvbmZpZy5wZWVyICYmIHR5cGVvZiBzdHVkZW50Vm90ZUNvdW50ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBkYXRhLmFjdCA9IGRhdGEuYWN0ICsgYDp2b3RlJHtzdHVkZW50Vm90ZUNvdW50fWA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBzaWQgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIGRhdGEuc2lkID0gc2lkO1xuICAgICAgICB9XG4gICAgICAgIGF3YWl0IHRoaXMubG9nQm9va0V2ZW50KGRhdGEpO1xuICAgIH1cblxuICAgIHJlbmRlck1DTUZGZWVkYmFjaygpIHtcbiAgICAgICAgbGV0IGNvcnJlY3QgPSB0aGlzLmdpdmVuQXJyYXlbMF0gPT0gdGhpcy5jb3JyZWN0SW5kZXhMaXN0WzBdO1xuICAgICAgICBsZXQgZmVlZGJhY2tUZXh0ID0gdGhpcy5zaW5nbGVmZWVkYmFjaztcblxuICAgICAgICBpZiAoY29ycmVjdCkge1xuICAgICAgICAgICAgdGhpcy5mZWVkQmFja0Rpdi5pbm5lckhUTUwgPSBgPHNwYW4gY2xhc3M9XCJ2aXN1YWxseWhpZGRlblwiPkZlZWRiYWNrOiBDb3JyZWN0PC9zcGFuPjxzcGFuIGNsYXNzPVwibWF0ZXJpYWwtc3ltYm9scy1vdXRsaW5lZCBtY2hvaWNlLWZlZWRiYWNrLWljb25cIiBhcmlhLWhpZGRlbj1cInRydWVcIj5jaGVja19jaXJjbGU8L3NwYW4+IGAgKyBmZWVkYmFja1RleHQ7XG4gICAgICAgICAgICB0aGlzLmZlZWRCYWNrRGl2LmNsYXNzTmFtZSA9IFwiYWxlcnQgYWxlcnQtaW5mb1wiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGZlZWRiYWNrVGV4dCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZmVlZGJhY2tUZXh0ID0gXCJcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZmVlZEJhY2tEaXYuaW5uZXJIVE1MID0gYDxzcGFuIGNsYXNzPVwidmlzdWFsbHloaWRkZW5cIj5GZWVkYmFjazogSW5jb3JyZWN0PC9zcGFuPjxzcGFuIGNsYXNzPVwibWF0ZXJpYWwtc3ltYm9scy1vdXRsaW5lZCBtY2hvaWNlLWZlZWRiYWNrLWljb25cIiBhcmlhLWhpZGRlbj1cInRydWVcIj5lcnJvcjwvc3Bhbj4gYCArIGZlZWRiYWNrVGV4dDtcbiAgICAgICAgICAgIHRoaXMuZmVlZEJhY2tEaXYuY2xhc3NOYW1lID0gXCJhbGVydCBhbGVydC1kYW5nZXJcIjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnF1ZXVlTWF0aEpheCh0aGlzLmZlZWRCYWNrRGl2KTtcbiAgICB9XG4gICAgZW5hYmxlTUNDb21wYXJpc29uKCkge1xuICAgICAgICBpZiAoZUJvb2tDb25maWcuZW5hYmxlQ29tcGFyZU1lKSB7XG4gICAgICAgICAgICB0aGlzLmNvbXBhcmVCdXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpbnN0cnVjdG9yTWNob2ljZU1vZGFsKGRhdGEpIHtcbiAgICAgICAgLy8gZGF0YS5yZXNsaXN0IC0tIHN0dWRlbnQgYW5kIHRoZWlyIGFuc3dlcnNcbiAgICAgICAgLy8gZGF0YS5hbnN3ZXJEaWN0ICAgIC0tIGFuc3dlcnMgYW5kIGNvdW50XG4gICAgICAgIC8vIGRhdGEuY29ycmVjdCAtIGNvcnJlY3QgYW5zd2VyXG4gICAgICAgIHZhciByZXMgPSBcIjx0YWJsZT48dHI+PHRoPlN0dWRlbnQ8L3RoPjx0aD5BbnN3ZXIocyk8L3RoPjwvdHI+XCI7XG4gICAgICAgIGZvciAodmFyIGkgaW4gZGF0YSkge1xuICAgICAgICAgICAgcmVzICs9XG4gICAgICAgICAgICAgICAgXCI8dHI+PHRkPlwiICtcbiAgICAgICAgICAgICAgICBlc2NhcGVIdG1sKGRhdGFbaV1bMF0pICtcbiAgICAgICAgICAgICAgICBcIjwvdGQ+PHRkPlwiICtcbiAgICAgICAgICAgICAgICBlc2NhcGVIdG1sKGRhdGFbaV1bMV0pICtcbiAgICAgICAgICAgICAgICBcIjwvdGQ+PC90cj5cIjtcbiAgICAgICAgfVxuICAgICAgICByZXMgKz0gXCI8L3RhYmxlPlwiO1xuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cbiAgICBjb21wYXJlTW9kYWwoZGF0YSwgc3RhdHVzLCB3aGF0ZXZlcikge1xuICAgICAgICB2YXIgZGF0YWRpY3QgPSBkYXRhLmRldGFpbDtcbiAgICAgICAgdmFyIGFuc3dlcnMgPSBkYXRhZGljdC5hbnN3ZXJEaWN0O1xuICAgICAgICB2YXIgbWlzYyA9IGRhdGFkaWN0Lm1pc2M7XG4gICAgICAgIHZhciBrbCA9IE9iamVjdC5rZXlzKGFuc3dlcnMpLnNvcnQoKTtcbiAgICAgICAgdmFyIGJvZHkgPSBcIjx0YWJsZT5cIjtcbiAgICAgICAgYm9keSArPSBcIjx0cj48dGg+QW5zd2VyPC90aD48dGg+UGVyY2VudDwvdGg+PC90cj5cIjtcbiAgICAgICAgdmFyIHRoZUNsYXNzID0gXCJcIjtcbiAgICAgICAgLy8gYW5zd2VyRGljdCBrZXlzIGNvbWUgZnJvbSBsb2dnZWQgYW5zd2Vycywgd2hpY2ggYW55IHN0dWRlbnQgY2FuXG4gICAgICAgIC8vIHdyaXRlIC0tIGVzY2FwZSBldmVyeXRoaW5nIHRoYXQgZ29lcyBpbnRvIHRoZSB0YWJsZVxuICAgICAgICBmb3IgKHZhciBrIGluIGtsKSB7XG4gICAgICAgICAgICBpZiAoa2xba10gPT09IG1pc2MuY29ycmVjdCkge1xuICAgICAgICAgICAgICAgIHRoZUNsYXNzID0gXCJzdWNjZXNzXCI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoZUNsYXNzID0gXCJpbmZvXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBib2R5ICs9XG4gICAgICAgICAgICAgICAgXCI8dHI+PHRkPlwiICtcbiAgICAgICAgICAgICAgICBlc2NhcGVIdG1sKGtsW2tdKSArXG4gICAgICAgICAgICAgICAgXCI8L3RkPjx0ZCBjbGFzcz0nY29tcGFyZS1tZS1wcm9ncmVzcyc+XCI7XG4gICAgICAgICAgICB2YXIgcGN0ID0gZXNjYXBlSHRtbChhbnN3ZXJzW2tsW2tdXSkgKyBcIiVcIjtcbiAgICAgICAgICAgIGJvZHkgKz0gXCI8ZGl2IGNsYXNzPSdwcm9ncmVzcyc+XCI7XG4gICAgICAgICAgICBib2R5ICs9XG4gICAgICAgICAgICAgICAgXCIgICAgPGRpdiBjbGFzcz0ncHJvZ3Jlc3MtYmFyIHByb2dyZXNzLWJhci1cIiArXG4gICAgICAgICAgICAgICAgdGhlQ2xhc3MgK1xuICAgICAgICAgICAgICAgIFwiJyBzdHlsZT0nd2lkdGg6XCIgK1xuICAgICAgICAgICAgICAgIHBjdCArXG4gICAgICAgICAgICAgICAgXCI7Jz5cIiArXG4gICAgICAgICAgICAgICAgcGN0O1xuICAgICAgICAgICAgYm9keSArPSBcIiAgICA8L2Rpdj5cIjtcbiAgICAgICAgICAgIGJvZHkgKz0gXCI8L2Rpdj48L3RkPjwvdHI+XCI7XG4gICAgICAgIH1cbiAgICAgICAgYm9keSArPSBcIjwvdGFibGU+XCI7XG4gICAgICAgIGlmIChtaXNjLnlvdXJwY3QgIT09IFwidW5hdmFpbGFibGVcIikge1xuICAgICAgICAgICAgYm9keSArPVxuICAgICAgICAgICAgICAgIFwiPGJyIC8+PHA+WW91IGhhdmUgXCIgK1xuICAgICAgICAgICAgICAgIGVzY2FwZUh0bWwobWlzYy55b3VycGN0KSArXG4gICAgICAgICAgICAgICAgXCIlIGNvcnJlY3QgZm9yIGFsbCBxdWVzdGlvbnM8L3A+XCI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRhdGFkaWN0LnJlc2xpc3QgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgYm9keSArPSB0aGlzLmluc3RydWN0b3JNY2hvaWNlTW9kYWwoZGF0YWRpY3QucmVzbGlzdCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQ3JlYXRlIGEgc2ltcGxlIG1vZGFsIHdpdGhvdXQgalF1ZXJ5L0Jvb3RzdHJhcFxuICAgICAgICBjb25zdCBvdmVybGF5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgb3ZlcmxheS5zdHlsZS5wb3NpdGlvbiA9IFwiZml4ZWRcIjtcbiAgICAgICAgb3ZlcmxheS5zdHlsZS5pbnNldCA9IFwiMFwiO1xuICAgICAgICBvdmVybGF5LnN0eWxlLmJhY2tncm91bmQgPSBcInJnYmEoMCwwLDAsMC41KVwiO1xuICAgICAgICBvdmVybGF5LnN0eWxlLnpJbmRleCA9IFwiOTk5OVwiO1xuXG4gICAgICAgIGNvbnN0IGRpYWxvZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGRpYWxvZy5zdHlsZS5tYXhXaWR0aCA9IFwiNzIwcHhcIjtcbiAgICAgICAgZGlhbG9nLnN0eWxlLm1hcmdpbiA9IFwiMTB2aCBhdXRvXCI7XG4gICAgICAgIGRpYWxvZy5zdHlsZS5iYWNrZ3JvdW5kID0gXCIjZmZmXCI7XG4gICAgICAgIGRpYWxvZy5zdHlsZS5ib3JkZXJSYWRpdXMgPSBcIjZweFwiO1xuICAgICAgICBkaWFsb2cuc3R5bGUuYm94U2hhZG93ID0gXCIwIDJweCAxMnB4IHJnYmEoMCwwLDAsMC4zKVwiO1xuICAgICAgICBkaWFsb2cuc3R5bGUucGFkZGluZyA9IFwiMTZweFwiO1xuXG4gICAgICAgIGNvbnN0IGhlYWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGNvbnN0IGNsb3NlQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICAgICAgY2xvc2VCdG4udHlwZSA9IFwiYnV0dG9uXCI7XG4gICAgICAgIGNsb3NlQnRuLnRleHRDb250ZW50ID0gXCLDl1wiO1xuICAgICAgICBjbG9zZUJ0bi5zZXRBdHRyaWJ1dGUoXCJhcmlhLWxhYmVsXCIsIFwiQ2xvc2VcIik7XG4gICAgICAgIGNsb3NlQnRuLnN0eWxlLmZsb2F0ID0gXCJyaWdodFwiO1xuICAgICAgICBjbG9zZUJ0bi5jbGFzc05hbWUgPSBcImJ0biBidG4tbGlnaHRcIjtcbiAgICAgICAgY2xvc2VCdG4ub25jbGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQob3ZlcmxheSk7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IHRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImg0XCIpO1xuICAgICAgICB0aXRsZS5jbGFzc05hbWUgPSBcIm1vZGFsLXRpdGxlXCI7XG4gICAgICAgIHRpdGxlLnRleHRDb250ZW50ID0gXCJEaXN0cmlidXRpb24gb2YgQW5zd2Vyc1wiO1xuICAgICAgICBoZWFkZXIuYXBwZW5kQ2hpbGQoY2xvc2VCdG4pO1xuICAgICAgICBoZWFkZXIuYXBwZW5kQ2hpbGQodGl0bGUpO1xuXG4gICAgICAgIGNvbnN0IG1vZGFsQm9keSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIG1vZGFsQm9keS5pbm5lckhUTUwgPSBib2R5O1xuXG4gICAgICAgIGRpYWxvZy5hcHBlbmRDaGlsZChoZWFkZXIpO1xuICAgICAgICBkaWFsb2cuYXBwZW5kQ2hpbGQobW9kYWxCb2R5KTtcbiAgICAgICAgb3ZlcmxheS5hcHBlbmRDaGlsZChkaWFsb2cpO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKG92ZXJsYXkpO1xuICAgIH1cbiAgICAvLyBfYGNvbXBhcmVBbnN3ZXJzYFxuICAgIGFzeW5jIGNvbXBhcmVBbnN3ZXJzKCkge1xuICAgICAgICB2YXIgZGF0YSA9IHt9O1xuICAgICAgICBkYXRhLmRpdl9pZCA9IHRoaXMuZGl2aWQ7XG4gICAgICAgIGRhdGEuY291cnNlX25hbWUgPSBlQm9va0NvbmZpZy5jb3Vyc2U7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBwYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKGRhdGEpO1xuICAgICAgICAgICAgY29uc3QgcmVzcCA9IGF3YWl0IGZldGNoKFxuICAgICAgICAgICAgICAgIGAke2VCb29rQ29uZmlnLm5ld19zZXJ2ZXJfcHJlZml4fS9hc3Nlc3NtZW50L2dldGFnZ3JlZ2F0ZXJlc3VsdHM/JHtwYXJhbXMudG9TdHJpbmcoKX1gLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGNvbnN0IGpzb24gPSBhd2FpdCByZXNwLmpzb24oKTtcbiAgICAgICAgICAgIHRoaXMuY29tcGFyZU1vZGFsKGpzb24pO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgZmV0Y2hpbmcgYWdncmVnYXRlIHJlc3VsdHM6XCIsIGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZGlzYWJsZUludGVyYWN0aW9uKCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMub3B0aW9uQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMub3B0aW9uQXJyYXlbaV0uaW5wdXQuZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZW5hYmxlSW50ZXJhY3Rpb24oKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5vcHRpb25BcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5vcHRpb25BcnJheVtpXS5pbnB1dC5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT0gRmluZCB0aGUgY3VzdG9tIEhUTUwgdGFncyBhbmQgPT1cbj09ICAgZXhlY3V0ZSBvdXIgY29kZSBvbiB0aGVtICAgID09XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInJ1bmVzdG9uZTpsb2dpbi1jb21wbGV0ZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgZG9jdW1lbnRcbiAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoXCJbZGF0YS1jb21wb25lbnQ9bXVsdGlwbGVjaG9pY2VdXCIpXG4gICAgICAgIC5mb3JFYWNoKGZ1bmN0aW9uIChlbCwgaW5kZXgpIHtcbiAgICAgICAgICAgIC8vIE1DXG4gICAgICAgICAgICB2YXIgb3B0cyA9IHtcbiAgICAgICAgICAgICAgICBvcmlnOiBlbCxcbiAgICAgICAgICAgICAgICB1c2VSdW5lc3RvbmVTZXJ2aWNlczogZUJvb2tDb25maWcudXNlUnVuZXN0b25lU2VydmljZXMsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYgKCFlbC5jbG9zZXN0KFwiW2RhdGEtY29tcG9uZW50PXRpbWVkQXNzZXNzbWVudF1cIikpIHtcbiAgICAgICAgICAgICAgICAvLyBJZiB0aGlzIGVsZW1lbnQgZXhpc3RzIHdpdGhpbiBhIHRpbWVkIGNvbXBvbmVudCwgZG9uJ3QgcmVuZGVyIGl0IGhlcmVcbiAgICAgICAgICAgICAgICB3aW5kb3cuY29tcG9uZW50TWFwW2VsLmlkXSA9IG5ldyBNdWx0aXBsZUNob2ljZShvcHRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG59KTtcbiIsImltcG9ydCBNdWx0aXBsZUNob2ljZSBmcm9tIFwiLi9tY2hvaWNlLmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRpbWVkTUMgZXh0ZW5kcyBNdWx0aXBsZUNob2ljZSB7XG4gICAgY29uc3RydWN0b3Iob3B0cykge1xuICAgICAgICBzdXBlcihvcHRzKTtcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYuY2xhc3NMaXN0LmFkZChcInJ1bmVzdG9uZVwiKTtcbiAgICAgICAgdGhpcy5uZWVkc1JlaW5pdGlhbGl6YXRpb24gPSB0cnVlO1xuICAgICAgICB0aGlzLnJlbmRlclRpbWVkSWNvbih0aGlzLk1DQ29udGFpbmVyKTtcbiAgICAgICAgdGhpcy5oaWRlQnV0dG9ucygpOyAvLyBEb24ndCBzaG93IHBlci1xdWVzdGlvbiBidXR0b25zIGluIGEgdGltZWQgYXNzZXNzbWVudFxuICAgIH1cblxuICAgIHJlbmRlclRpbWVkSWNvbihjb21wb25lbnQpIHtcbiAgICAgICAgLy8gcmVuZGVycyB0aGUgY2xvY2sgaWNvbiBvbiB0aW1lZCBjb21wb25lbnRzLiAgICBUaGUgY29tcG9uZW50IHBhcmFtZXRlclxuICAgICAgICAvLyBpcyB0aGUgZWxlbWVudCB0aGF0IHRoZSBpY29uIHNob3VsZCBiZSBhcHBlbmRlZCB0by5cbiAgICAgICAgdmFyIHRpbWVJY29uRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdmFyIHRpbWVJY29uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcbiAgICAgICAgdGltZUljb24uc3JjID0gXCIuLi9fc3RhdGljL2Nsb2NrLnBuZ1wiO1xuICAgICAgICB0aW1lSWNvbi5zdHlsZS53aWR0aCA9IFwiMTVweFwiO1xuICAgICAgICB0aW1lSWNvbi5zdHlsZS5oZWlnaHQgPSBcIjE1cHhcIjtcbiAgICAgICAgdGltZUljb25EaXYuY2xhc3NOYW1lID0gXCJ0aW1lVGlwXCI7XG4gICAgICAgIHRpbWVJY29uRGl2LnRpdGxlID0gXCJcIjtcbiAgICAgICAgdGltZUljb25EaXYuYXBwZW5kQ2hpbGQodGltZUljb24pO1xuICAgICAgICBpZiAoY29tcG9uZW50KSB7XG4gICAgICAgICAgICBpZiAoY29tcG9uZW50LmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuaW5zZXJ0QmVmb3JlKHRpbWVJY29uRGl2LCBjb21wb25lbnQuZmlyc3RDaGlsZCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5hcHBlbmRDaGlsZCh0aW1lSWNvbkRpdik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgaGlkZUJ1dHRvbnMoKSB7XG4gICAgICAgIC8vSnVzdCBoaWRpbmcgdGhlIGJ1dHRvbnMgZG9lc24ndCBwcmV2ZW50IHN1Ym1pdHRpbmcgdGhlIGZvcm0gd2hlbiBlbnRlcmluZyBpcyBjbGlja2VkXG4gICAgICAgIC8vV2UgbmVlZCB0byBjb21wbGV0ZWx5IGRpc2FibGUgdGhlIGJ1dHRvbnNcbiAgICAgICAgaWYgKHRoaXMuc3VibWl0QnV0dG9uKSB7XG4gICAgICAgICAgICB0aGlzLnN1Ym1pdEJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiLCBcInRydWVcIik7XG4gICAgICAgICAgICB0aGlzLnN1Ym1pdEJ1dHRvbi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY29tcGFyZUJ1dHRvbikge1xuICAgICAgICAgICAgdGhpcy5jb21wYXJlQnV0dG9uLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFRoZXNlIG1ldGhvZHMgb3ZlcnJpZGUgdGhlIG1ldGhvZHMgaW4gdGhlIGJhc2UgY2xhc3MuIENhbGxlZCBmcm9tIHJlbmRlckZlZWRiYWNrKClcbiAgICAvL1xuICAgIHJlbmRlck1DTUFGZWVkQmFjaygpIHtcbiAgICAgICAgdGhpcy5mZWVkYmFja1RpbWVkTUMoKTtcbiAgICB9XG4gICAgcmVuZGVyTUNNRkZlZWRiYWNrKHdoYXRldmVyLCB3aGF0ZXZlcnIpIHtcbiAgICAgICAgdGhpcy5mZWVkYmFja1RpbWVkTUMoKTtcbiAgICB9XG4gICAgZmVlZGJhY2tUaW1lZE1DKCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuaW5kZXhBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHRtcGluZGV4ID0gdGhpcy5pbmRleEFycmF5W2ldO1xuICAgICAgICAgICAgdGhpcy5mZWVkQmFja0VhY2hBcnJheVtpXS5pbm5lckhUTUwgPVxuICAgICAgICAgICAgICAgIFN0cmluZy5mcm9tQ2hhckNvZGUoNjUgKyBpKSArIFwiLiBcIiArIHRoaXMuZmVlZGJhY2tMaXN0W2ldO1xuICAgICAgICAgICAgdmFyIHRtcGlkID0gdGhpcy5hbnN3ZXJMaXN0W3RtcGluZGV4XS5pZDtcbiAgICAgICAgICAgIGlmICh0aGlzLmNvcnJlY3RMaXN0LmluZGV4T2YodG1waWQpID49IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmZlZWRCYWNrRWFjaEFycmF5W2ldLmNsYXNzTGlzdC5hZGQoXG4gICAgICAgICAgICAgICAgICAgIFwiYWxlcnRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJhbGVydC1zdWNjZXNzXCIsXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5mZWVkQmFja0VhY2hBcnJheVtpXS5jbGFzc0xpc3QuYWRkKFxuICAgICAgICAgICAgICAgICAgICBcImFsZXJ0XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiYWxlcnQtZGFuZ2VyXCIsXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZW5kZXJNQ0Zvcm1PcHRzKCkge1xuICAgICAgICBzdXBlci5yZW5kZXJNQ0Zvcm1PcHRzKCk7XG4gICAgICAgIHRoaXMuZmVlZEJhY2tFYWNoQXJyYXkgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB0aGlzLmFuc3dlckxpc3QubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIHZhciBrID0gdGhpcy5pbmRleEFycmF5W2pdO1xuICAgICAgICAgICAgdmFyIGZlZWRCYWNrRWFjaCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICBmZWVkQmFja0VhY2guaWQgPSB0aGlzLmRpdmlkICsgXCJfZWFjaEZlZWRiYWNrX1wiICsgaztcbiAgICAgICAgICAgIGZlZWRCYWNrRWFjaC5jbGFzc0xpc3QuYWRkKFwiZWFjaEZlZWRiYWNrXCIpO1xuICAgICAgICAgICAgdGhpcy5mZWVkQmFja0VhY2hBcnJheS5wdXNoKGZlZWRCYWNrRWFjaCk7XG4gICAgICAgICAgICB0aGlzLm9wdHNGb3JtLmFwcGVuZENoaWxkKGZlZWRCYWNrRWFjaCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY2hlY2tDb3JyZWN0VGltZWRNQ01BKCkge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICB0aGlzLmNvcnJlY3RDb3VudCA9PT0gdGhpcy5jb3JyZWN0TGlzdC5sZW5ndGggJiZcbiAgICAgICAgICAgIHRoaXMuY29ycmVjdExpc3QubGVuZ3RoID09PSB0aGlzLmdpdmVuQXJyYXkubGVuZ3RoXG4gICAgICAgICkge1xuICAgICAgICAgICAgdGhpcy5jb3JyZWN0ID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmdpdmVuQXJyYXkubGVuZ3RoICE9PSAwKSB7XG4gICAgICAgICAgICB0aGlzLmNvcnJlY3QgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIHF1ZXN0aW9uIHdhcyBza2lwcGVkXG4gICAgICAgICAgICB0aGlzLmNvcnJlY3QgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHN3aXRjaCAodGhpcy5jb3JyZWN0KSB7XG4gICAgICAgICAgICBjYXNlIHRydWU6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiVFwiO1xuICAgICAgICAgICAgY2FzZSBmYWxzZTpcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJGXCI7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNoZWNrQ29ycmVjdFRpbWVkTUNNRigpIHtcbiAgICAgICAgLy8gUmV0dXJucyBpZiB0aGUgcXVlc3Rpb24gd2FzIGNvcnJlY3QsIGluY29ycmVjdCwgb3Igc2tpcHBlZCAocmV0dXJuIG51bGwgaW4gdGhlIGxhc3QgY2FzZSlcbiAgICAgICAgc3dpdGNoICh0aGlzLmNvcnJlY3QpIHtcbiAgICAgICAgICAgIGNhc2UgdHJ1ZTpcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJUXCI7XG4gICAgICAgICAgICBjYXNlIGZhbHNlOlxuICAgICAgICAgICAgICAgIHJldHVybiBcIkZcIjtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY2hlY2tDb3JyZWN0VGltZWQoKSB7XG4gICAgICAgIGlmICh0aGlzLm11bHRpcGxlYW5zd2Vycykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hlY2tDb3JyZWN0VGltZWRNQ01BKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGVja0NvcnJlY3RUaW1lZE1DTUYoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBoaWRlRmVlZGJhY2soKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5mZWVkQmFja0VhY2hBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5mZWVkQmFja0VhY2hBcnJheVtpXS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZWluaXRpYWxpemVMaXN0ZW5lcnMoKSB7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgbGV0IGFuc3dlckZ1bmMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBzZWxmLmlzQW5zd2VyZWQgPSB0cnVlO1xuICAgICAgICB9O1xuICAgICAgICBmb3IgKGxldCBvcHQgb2YgdGhpcy5vcHRpb25BcnJheSkge1xuICAgICAgICAgICAgb3B0LmlucHV0Lm9uY2xpY2sgPSBhbnN3ZXJGdW5jO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5pZiAodHlwZW9mIHdpbmRvdy5jb21wb25lbnRfZmFjdG9yeSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHdpbmRvdy5jb21wb25lbnRfZmFjdG9yeSA9IHt9O1xufVxuXG53aW5kb3cuY29tcG9uZW50X2ZhY3RvcnkubXVsdGlwbGVjaG9pY2UgPSBmdW5jdGlvbiAob3B0cykge1xuICAgIGlmIChvcHRzLnRpbWVkKSB7XG4gICAgICAgIHJldHVybiBuZXcgVGltZWRNQyhvcHRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbmV3IE11bHRpcGxlQ2hvaWNlKG9wdHMpO1xuICAgIH1cbn07XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=