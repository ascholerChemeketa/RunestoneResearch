"use strict";
(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_shortanswer_js_timed_shortanswer_js"],{

/***/ 32508:
/*!*************************************************!*\
  !*** ./runestone/shortanswer/js/shortanswer.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ShortAnswer)
/* harmony export */ });
/* harmony import */ var _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/runestonebase.js */ 78673);
/* harmony import */ var _common_js_bookfuncs_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../common/js/bookfuncs.js */ 83057);
/* harmony import */ var _css_shortanswer_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../css/shortanswer.css */ 96815);
/*==========================================
=======    Master shortanswer.js    ========
============================================
===     This file contains the JS for    ===
=== the Runestone shortanswer component. ===
============================================
===              Created by              ===
===           Isaiah Mayerchak           ===
===                7/2/15                ===
===              Brad Miller             ===
===                2019                  ===
==========================================*/





class ShortAnswer extends _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(opts) {
        super(opts);
        if (opts) {
            var orig = opts.orig; // entire <p> element that will be replaced by new HTML
            this.useRunestoneServices =
                opts.useRunestoneServices || eBookConfig.useRunestoneServices;
            this.origElem = orig;
            this.divid = orig.id;
            this.question = this.origElem.innerHTML;
            this.optional = false;
            this.attachURL = opts.attachURL;
            if (this.origElem.hasAttribute("data-optional")) {
                this.optional = true;
            }
            if (this.origElem.hasAttribute("data-attachment")) {
                this.attachment = true;
            }
            this.placeholder =
                this.origElem.getAttribute("data-placeholder") ||
                "Write your answer here";
            this.renderHTML();
            this.caption = "shortanswer";
            this.addCaption("runestone");
            this.checkServer("shortanswer", true);
            if (typeof Prism !== "undefined") {
                Prism.highlightAllUnder(this.containerDiv);
            }
            if (this.attachment) {
                this.getAttachmentName();
            }
        }
    }

    renderHTML() {
        this.containerDiv = document.createElement("div");
        this.containerDiv.id = this.divid;
        this.containerDiv.classList.add(
            ...(this.origElem.getAttribute("class") || "")
                .split(" ")
                .filter(Boolean),
        );
        this.newForm = document.createElement("form");
        this.newForm.id = this.divid + "_journal";
        this.newForm.name = this.newForm.id;
        this.newForm.action = "";
        this.containerDiv.appendChild(this.newForm);
        this.formParts = document.createElement("div");
        this.newForm.appendChild(this.formParts);
        this.firstLegendDiv = document.createElement("div");
        // move contents to new div, keeping any event listeners
        while (this.origElem.firstChild) {
            this.firstLegendDiv.appendChild(this.origElem.firstChild);
        }
        this.firstLegendDiv.classList.add("journal-question");
        this.firstLegendDiv.classList.add("exercise-statement");
        this.formParts.appendChild(this.firstLegendDiv);
        this.jInputDiv = document.createElement("div");
        this.jInputDiv.id = this.divid + "_journal_input";
        this.formParts.appendChild(this.jInputDiv);
        this.jOptionsDiv = document.createElement("div");
        this.jOptionsDiv.classList.add("journal-options");
        this.jInputDiv.appendChild(this.jOptionsDiv);
        this.jTextArea = document.createElement("textarea");
        this.jTextArea.id = this.divid + "_solution";
        this.jTextArea.setAttribute("aria-label", "textarea");
        this.jTextArea.placeholder = this.placeholder;
        this.jTextArea.style.display = "inline";
        this.jTextArea.style.width = "530px";
        this.jTextArea.classList.add("form-control");
        this.jTextArea.rows = 4;
        this.jTextArea.cols = 50;
        this.jOptionsDiv.appendChild(this.jTextArea);

        // fires when we loose focus on the textarea after making a change
        // mark it as answered for peer/timed purposes
        this.jTextArea.onchange = function () {
            this.isAnswered = true;
        }.bind(this);

        // the answer has not been saved yet. Update as soon as user types in
        // the box, not just when they loose focus.
        this.jTextArea.addEventListener("keydown", () => {
            this.feedbackDiv.classList.remove("visuallyhidden");
            if (this.isTimed) {
                // no need for danger status... nothing for user to do here
                this.feedbackDiv.innerHTML =
                    "Your answer is automatically saved.";
            } else {
                this.feedbackDiv.innerHTML =
                    "Your answer has not been saved yet!";
                this.feedbackDiv.classList.remove("alert-success");
                this.feedbackDiv.classList.add("alert", "alert-danger");
            }
        });

        this.jTextArea.addEventListener("input", () => {
            this.jTextArea.style.height = "auto";
            this.jTextArea.style.height = `${this.jTextArea.scrollHeight}px`;
            this.renderMath(this.jTextArea.value);
        });
        this.buttonDiv = document.createElement("div");
        this.formParts.appendChild(this.buttonDiv);
        this.submitButton = document.createElement("button");
        this.submitButton.classList.add("btn", "btn-success");
        this.submitButton.type = "button";
        this.submitButton.textContent = "Save";
        this.submitButton.onclick = function () {
            this.checkCurrentAnswer();
            this.logCurrentAnswer();
            this.renderFeedback();
        }.bind(this);
        this.buttonDiv.appendChild(this.submitButton);

        this.otherOptionsDiv = document.createElement("div");
        this.otherOptionsDiv.style.paddingLeft = "20px";
        this.otherOptionsDiv.classList.add("journal-options");
        this.formParts.appendChild(this.otherOptionsDiv);
        // add a feedback div to give user feedback
        this.feedbackDiv = document.createElement("div");
        this.feedbackDiv.style.width = "530px";
        this.feedbackDiv.style.fontStyle = "italic";
        this.feedbackDiv.id = this.divid + "_feedback";
        this.feedbackDiv.classList.add(
            "shortanswer__feedback",
            "visuallyhidden",
        );
        this.feedbackDiv.ariaLive = "polite";
        this.formParts.appendChild(this.feedbackDiv);
        if (this.attachment) {
            let attachDiv = document.createElement("div");
            this.attachDiv = attachDiv;
            if (this.graderactive) {
                // If in grading mode make a button to create a popup with the image
                let viewButton = document.createElement("button");
                viewButton.type = "button";
                viewButton.innerHTML = "View Attachment";
                viewButton.onclick = this.viewFile.bind(this);
                attachDiv.appendChild(viewButton);
            } else {
                // Otherwise make a button for the student to select a file to upload.
                this.fileUpload = document.createElement("input");
                this.fileUpload.type = "file";
                this.fileUpload.id = `${this.divid}_fileme`;
                attachDiv.appendChild(this.fileUpload);
            }
            this.containerDiv.appendChild(attachDiv);
        }
        this.origElem.replaceWith(this.containerDiv);
        this.queueMathJax(this.containerDiv);
    }

    renderMath(value) {
        if ((0,_common_js_bookfuncs_js__WEBPACK_IMPORTED_MODULE_1__.looksLikeLatexMath)(value)) {
            if (!this.renderedAnswer) {
                this.rederedAnswerDiv = document.createElement("div");
                this.rederedAnswerDiv.classList.add(
                    "shortanswer__rendered-answer-div",
                );
                this.formParts.appendChild(this.rederedAnswerDiv);

                this.renderedAnswerLabel = document.createElement("label");
                this.renderedAnswerLabel.innerHTML = "Rendered Answer:";
                this.renderedAnswerLabel.id =
                    this.divid + "_rendered_answer_label";
                this.renderedAnswerLabel.classList.add(
                    "shortanswer__rendered-answer-label",
                );
                this.rederedAnswerDiv.appendChild(this.renderedAnswerLabel);

                this.renderedAnswer = document.createElement("div");
                this.renderedAnswer.classList.add(
                    "shortanswer__rendered-answer",
                );
                this.renderedAnswer.classList.add("latexoutput");
                this.renderedAnswer.setAttribute(
                    "aria-labelledby",
                    this.renderedAnswerLabel.id,
                );
                this.renderedAnswer.setAttribute("aria-live", "polite");
                this.rederedAnswerDiv.appendChild(this.renderedAnswer);
            }
            value = value.replace(/\$\$(.*?)\$\$/g, "\\[ $1 \\]");
            value = value.replace(/\$(.*?)\$/g, "\\( $1 \\)");
            this.renderedAnswer.textContent = value;

            this.rederedAnswerDiv.style.display = "block";
            this.queueMathJax(this.renderedAnswer);
        } else {
            if (this.renderedAnswer) {
                this.rederedAnswerDiv.style.display = "none";
            }
        }
    }

    async checkCurrentAnswer() {
        let value = document.getElementById(this.divid + "_solution").value;
        this.renderMath(value);
        this.setLocalStorage({
            answer: value,
            timestamp: new Date(),
        });
    }

    async logCurrentAnswer(sid) {
        let value = document.getElementById(this.divid + "_solution").value;
        this.renderMath(value);
        this.setLocalStorage({
            answer: value,
            timestamp: new Date(),
        });
        let data = {
            event: "shortanswer",
            act: value,
            answer: value,
            div_id: this.divid,
        };
        if (typeof sid !== "undefined") {
            data.sid = sid;
        }
        await this.logBookEvent(data);
        if (this.attachment) {
            await this.uploadFile();
        }
    }

    renderFeedback() {
        this.feedbackDiv.innerHTML = "Your answer has been saved.";
        this.feedbackDiv.classList.remove("alert-danger");
        this.feedbackDiv.classList.add("alert", "alert-success");
        this.feedbackDiv.classList.remove("visuallyhidden");
    }
    setLocalStorage(data) {
        if (!this.graderactive) {
            let key = this.localStorageKey();
            localStorage.setItem(key, JSON.stringify(data));
        }
    }
    checkLocalStorage() {
        // Repopulates the short answer text
        // which was stored into local storage.
        var answer = "";
        if (this.graderactive) {
            return;
        }
        var len = localStorage.length;
        if (len > 0) {
            var ex = localStorage.getItem(this.localStorageKey());
            if (ex !== null) {
                let error = false;
                try {
                    var storedData = JSON.parse(ex);
                    answer = storedData.answer;
                } catch (err) {
                    // error while parsing; likely due to bad value stored in storage
                    console.log(
                        `Error parsing stored shortanswer data for ${this.divid}: ${err.message}`,
                    );
                    error = true;
                }
                if (error || storedData.timestamp < eBookConfig.termStartDate) {
                    localStorage.removeItem(this.localStorageKey());
                    return;
                }
                let solution = document.getElementById(
                    this.divid + "_solution",
                );
                if (solution) {
                    solution.value = answer;
                }
                this.renderMath(answer);
            }
        }
    }
    restoreAnswers(data) {
        // Restore answers from storage retrieval done in RunestoneBase
        // sometimes data.answer can be null
        if (!data.answer) {
            data.answer = "";
        }
        this.answer = data.answer;
        this.jTextArea.value = this.answer;
        this.renderMath(this.answer);

        let p = document.createElement("p");
        p.classList.add("shortanswer__timestamp");
        this.jInputDiv.appendChild(p);
        var tsString = "";
        if (data.timestamp) {
            tsString = new Date(data.timestamp).toLocaleString();
        } else {
            tsString = "";
        }
        p.textContent = tsString;
        this.jTextArea.style.height = "auto";
        this.jTextArea.style.height = `${this.jTextArea.scrollHeight}px`;

        if (data.last_answer) {
            this.current_answer = "ontime";
            let toggle_answer_button = document.createElement("button");
            toggle_answer_button.type = "button";
            toggle_answer_button.textContent = "Show Late Answer";
            toggle_answer_button.classList.add("btn", "btn-warning");
            toggle_answer_button.style.marginLeft = "5px";

            toggle_answer_button.addEventListener(
                "click",
                function () {
                    var display_timestamp, button_text;
                    if (this.current_answer === "ontime") {
                        this.jTextArea.value = data.last_answer;
                        this.answer = data.last_answer;
                        display_timestamp = new Date(
                            data.last_timestamp,
                        ).toLocaleString();
                        button_text = "Show on-Time Answer";
                        this.current_answer = "late";
                    } else {
                        this.jTextArea.value = data.answer;
                        this.answer = data.answer;
                        display_timestamp = tsString;
                        button_text = "Show Late Answer";
                        this.current_answer = "ontime";
                    }
                    this.renderMath(this.answer);
                    p.textContent = `Submitted: ${display_timestamp}`;
                    toggle_answer_button.textContent = button_text;
                }.bind(this),
            );

            this.buttonDiv.appendChild(toggle_answer_button);
        }
        let feedbackStr = "";
        if (typeof data.score !== "undefined") {
            feedbackStr = `Score: ${data.score}`;
        }
        if (data.comment) {
            feedbackStr += ` -- ${data.comment}`;
        }
        if (feedbackStr !== "") {
            this.feedbackDiv.innerHTML = feedbackStr;
            this.feedbackDiv.classList.add("alert", "alert-success");
            this.feedbackDiv.classList.remove("visuallyhidden");
        }
    }

    disableInteraction() {
        this.jTextArea.disabled = true;
    }

    async getAttachmentName() {
        // Get the attachment name from the /ns/assessment/has_attachment endpoint
        let requestUrl = `/ns/assessment/has_attachment/${this.divid}`;
        if (this.sid) {
            requestUrl += `?sid=${this.sid}`;
        }
        const response = await fetch(requestUrl);
        if (!response.ok) {
            console.error(
                "Error fetching attachment name:",
                response.statusText,
            );
            return null;
        }
        const obj = await response.json();
        if (obj.detail.hasAttachment) {
            // Return the S3 key for the attachment
            let filename = obj.detail.hasAttachment;
            // filename is everthing after the last slash
            filename = filename.substring(filename.lastIndexOf("/") + 1);
            let fmess = document.createElement("span");
            fmess.textContent = `Attachment: ${filename}`;
            this.attachDiv.appendChild(fmess);
        }
    }

    async uploadFile() {
        const files = this.fileUpload.files;
        // get the suffix from the file name
        const fileName = files[0].name;
        const suffix = fileName.split(".").pop();
        // if the suffix is not in the list of allowed suffixes, return
        if (!["jpg", "jpeg", "png", "gif", "pdf"].includes(suffix)) {
            alert(
                "File type not allowed. Please upload a jpg, jpeg, png, gif, or pdf file.",
            );
            return;
        }
        // if the file size is greater than 5MB, return
        if (files[0].size > 5 * 1024 * 1024) {
            alert("File size exceeds 5MB limit. Please upload a smaller file.");
            return;
        }
        const data = new FormData();
        if (this.fileUpload.files.length > 0) {
            data.append("file", files[0]);
            fetch(`/ns/logger/upload/${this.divid}`, {
                method: "POST",
                body: data,
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }

    viewFile() {
        // Get the URL from the S3 API -- saved when we display in grader mode
        if (this.attachURL) {
            //window.open(this.attachURL, "_blank");
            //<embed src="example.pdf" type="application/pdf" width="100%" height="600px" />
            //switch to
            const image_window = window.open("", "_blank");
            if (this.attachURL.indexOf(".pdf?") !== -1) {
                const embed = image_window.document.createElement("object");
                embed.setAttribute("data", this.attachURL);
                embed.setAttribute("type", "application/pdf");
                embed.setAttribute("width", "800px");
                embed.setAttribute("height", "1040px");
                image_window.document.body.appendChild(embed);
                let alt = image_window.document.createElement("a");
                alt.setAttribute("href", this.attachURL);
                alt.innerText = "Download PDF";
                embed.appendChild(alt);
            } else {
                const img = image_window.document.createElement("img");
                img.setAttribute("src", this.attachURL);
                img.setAttribute("style", "width:100%; height:auto;");
                image_window.document.body.appendChild(img);
            }
        } else {
            alert("No attachment for this student.");
        }
    }
}

/*=================================
== Find the custom HTML tags and ==
==   execute our code on them    ==
=================================*/
document.addEventListener("runestone:login-complete", function () {
    document
        .querySelectorAll("[data-component=shortanswer]")
        .forEach(function (el) {
            // If this element exists within a timed component, don't render it here
            if (!el.closest("[data-component=timedAssessment]")) {
                try {
                    window.componentMap[el.id] = new ShortAnswer({
                        orig: el,
                        useRunestoneServices: eBookConfig.useRunestoneServices,
                    });
                } catch (err) {
                    console.log(`Error rendering ShortAnswer Problem ${el.id}
                Details: ${err}`);
                }
            }
        });
});


/***/ }),

/***/ 68950:
/*!*******************************************************!*\
  !*** ./runestone/shortanswer/js/timed_shortanswer.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TimedShortAnswer)
/* harmony export */ });
/* harmony import */ var _shortanswer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./shortanswer.js */ 32508);


class TimedShortAnswer extends _shortanswer_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(opts) {
        super(opts);
        this.renderTimedIcon(this.containerDiv);
        this.isTimed = true;
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

        // If firstChild is null, insertBefore acts like appendChild
        component.insertBefore(timeIconDiv, component.firstChild);
    }
    checkCorrectTimed() {
        return "I"; // we ignore this in the grading
    }
    hideFeedback() {
        if (this.feedbackDiv) {
            this.feedbackDiv.style.display = "none";
        }
    }
}

if (typeof window.component_factory === "undefined") {
    window.component_factory = {};
}

window.component_factory.shortanswer = function (opts) {
    if (opts.timed) {
        return new TimedShortAnswer(opts);
    }
    return new _shortanswer_js__WEBPACK_IMPORTED_MODULE_0__["default"](opts);
};


/***/ }),

/***/ 96815:
/*!***************************************************!*\
  !*** ./runestone/shortanswer/css/shortanswer.css ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuZXN0b25lX3Nob3J0YW5zd2VyX2pzX3RpbWVkX3Nob3J0YW5zd2VyX2pzLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRTZEO0FBQ0s7QUFDaEM7O0FBRW5CLDBCQUEwQixtRUFBYTtBQUN0RDtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0M7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQSw2Q0FBNkMsNEJBQTRCO0FBQ3pFO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBLHdDQUF3QyxXQUFXO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsWUFBWSwyRUFBa0I7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCLDRDQUE0QztBQUM1QztBQUNBLHFFQUFxRSxXQUFXLElBQUksWUFBWTtBQUNoRztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlDQUF5Qyw0QkFBNEI7O0FBRXJFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQjtBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtEQUFrRCxrQkFBa0I7QUFDcEU7QUFDQSxpQkFBaUI7QUFDakI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0MsV0FBVztBQUMvQztBQUNBO0FBQ0Esa0NBQWtDLGFBQWE7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwwREFBMEQsV0FBVztBQUNyRTtBQUNBLGtDQUFrQyxTQUFTO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0NBQStDLFNBQVM7QUFDeEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUMsV0FBVztBQUNsRDtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQSx1REFBdUQsWUFBWTtBQUNuRTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckIsa0JBQWtCO0FBQ2xCLHVFQUF1RTtBQUN2RSwyQkFBMkIsSUFBSTtBQUMvQjtBQUNBO0FBQ0EsU0FBUztBQUNULENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7QUM5ZDBDOztBQUU1QiwrQkFBK0IsdURBQVc7QUFDekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQjtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLHVEQUFXO0FBQzFCOzs7Ozs7Ozs7Ozs7QUNsREEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL3Nob3J0YW5zd2VyL2pzL3Nob3J0YW5zd2VyLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvc2hvcnRhbnN3ZXIvanMvdGltZWRfc2hvcnRhbnN3ZXIuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9zaG9ydGFuc3dlci9jc3Mvc2hvcnRhbnN3ZXIuY3NzP2RmYjQiXSwic291cmNlc0NvbnRlbnQiOlsiLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09PT09PT0gICAgTWFzdGVyIHNob3J0YW5zd2VyLmpzICAgID09PT09PT09XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT09ICAgICBUaGlzIGZpbGUgY29udGFpbnMgdGhlIEpTIGZvciAgICA9PT1cbj09PSB0aGUgUnVuZXN0b25lIHNob3J0YW5zd2VyIGNvbXBvbmVudC4gPT09XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT09ICAgICAgICAgICAgICBDcmVhdGVkIGJ5ICAgICAgICAgICAgICA9PT1cbj09PSAgICAgICAgICAgSXNhaWFoIE1heWVyY2hhayAgICAgICAgICAgPT09XG49PT0gICAgICAgICAgICAgICAgNy8yLzE1ICAgICAgICAgICAgICAgID09PVxuPT09ICAgICAgICAgICAgICBCcmFkIE1pbGxlciAgICAgICAgICAgICA9PT1cbj09PSAgICAgICAgICAgICAgICAyMDE5ICAgICAgICAgICAgICAgICAgPT09XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuXG5pbXBvcnQgUnVuZXN0b25lQmFzZSBmcm9tIFwiLi4vLi4vY29tbW9uL2pzL3J1bmVzdG9uZWJhc2UuanNcIjtcbmltcG9ydCB7IGxvb2tzTGlrZUxhdGV4TWF0aCB9IGZyb20gXCIuLi8uLi9jb21tb24vanMvYm9va2Z1bmNzLmpzXCI7XG5pbXBvcnQgXCIuLy4uL2Nzcy9zaG9ydGFuc3dlci5jc3NcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2hvcnRBbnN3ZXIgZXh0ZW5kcyBSdW5lc3RvbmVCYXNlIHtcbiAgICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgICAgIHN1cGVyKG9wdHMpO1xuICAgICAgICBpZiAob3B0cykge1xuICAgICAgICAgICAgdmFyIG9yaWcgPSBvcHRzLm9yaWc7IC8vIGVudGlyZSA8cD4gZWxlbWVudCB0aGF0IHdpbGwgYmUgcmVwbGFjZWQgYnkgbmV3IEhUTUxcbiAgICAgICAgICAgIHRoaXMudXNlUnVuZXN0b25lU2VydmljZXMgPVxuICAgICAgICAgICAgICAgIG9wdHMudXNlUnVuZXN0b25lU2VydmljZXMgfHwgZUJvb2tDb25maWcudXNlUnVuZXN0b25lU2VydmljZXM7XG4gICAgICAgICAgICB0aGlzLm9yaWdFbGVtID0gb3JpZztcbiAgICAgICAgICAgIHRoaXMuZGl2aWQgPSBvcmlnLmlkO1xuICAgICAgICAgICAgdGhpcy5xdWVzdGlvbiA9IHRoaXMub3JpZ0VsZW0uaW5uZXJIVE1MO1xuICAgICAgICAgICAgdGhpcy5vcHRpb25hbCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5hdHRhY2hVUkwgPSBvcHRzLmF0dGFjaFVSTDtcbiAgICAgICAgICAgIGlmICh0aGlzLm9yaWdFbGVtLmhhc0F0dHJpYnV0ZShcImRhdGEtb3B0aW9uYWxcIikpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbmFsID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLm9yaWdFbGVtLmhhc0F0dHJpYnV0ZShcImRhdGEtYXR0YWNobWVudFwiKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuYXR0YWNobWVudCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnBsYWNlaG9sZGVyID1cbiAgICAgICAgICAgICAgICB0aGlzLm9yaWdFbGVtLmdldEF0dHJpYnV0ZShcImRhdGEtcGxhY2Vob2xkZXJcIikgfHxcbiAgICAgICAgICAgICAgICBcIldyaXRlIHlvdXIgYW5zd2VyIGhlcmVcIjtcbiAgICAgICAgICAgIHRoaXMucmVuZGVySFRNTCgpO1xuICAgICAgICAgICAgdGhpcy5jYXB0aW9uID0gXCJzaG9ydGFuc3dlclwiO1xuICAgICAgICAgICAgdGhpcy5hZGRDYXB0aW9uKFwicnVuZXN0b25lXCIpO1xuICAgICAgICAgICAgdGhpcy5jaGVja1NlcnZlcihcInNob3J0YW5zd2VyXCIsIHRydWUpO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBQcmlzbSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgIFByaXNtLmhpZ2hsaWdodEFsbFVuZGVyKHRoaXMuY29udGFpbmVyRGl2KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmF0dGFjaG1lbnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmdldEF0dGFjaG1lbnROYW1lKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZW5kZXJIVE1MKCkge1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmlkID0gdGhpcy5kaXZpZDtcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYuY2xhc3NMaXN0LmFkZChcbiAgICAgICAgICAgIC4uLih0aGlzLm9yaWdFbGVtLmdldEF0dHJpYnV0ZShcImNsYXNzXCIpIHx8IFwiXCIpXG4gICAgICAgICAgICAgICAgLnNwbGl0KFwiIFwiKVxuICAgICAgICAgICAgICAgIC5maWx0ZXIoQm9vbGVhbiksXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMubmV3Rm9ybSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJmb3JtXCIpO1xuICAgICAgICB0aGlzLm5ld0Zvcm0uaWQgPSB0aGlzLmRpdmlkICsgXCJfam91cm5hbFwiO1xuICAgICAgICB0aGlzLm5ld0Zvcm0ubmFtZSA9IHRoaXMubmV3Rm9ybS5pZDtcbiAgICAgICAgdGhpcy5uZXdGb3JtLmFjdGlvbiA9IFwiXCI7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmFwcGVuZENoaWxkKHRoaXMubmV3Rm9ybSk7XG4gICAgICAgIHRoaXMuZm9ybVBhcnRzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdGhpcy5uZXdGb3JtLmFwcGVuZENoaWxkKHRoaXMuZm9ybVBhcnRzKTtcbiAgICAgICAgdGhpcy5maXJzdExlZ2VuZERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIC8vIG1vdmUgY29udGVudHMgdG8gbmV3IGRpdiwga2VlcGluZyBhbnkgZXZlbnQgbGlzdGVuZXJzXG4gICAgICAgIHdoaWxlICh0aGlzLm9yaWdFbGVtLmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgICAgIHRoaXMuZmlyc3RMZWdlbmREaXYuYXBwZW5kQ2hpbGQodGhpcy5vcmlnRWxlbS5maXJzdENoaWxkKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmZpcnN0TGVnZW5kRGl2LmNsYXNzTGlzdC5hZGQoXCJqb3VybmFsLXF1ZXN0aW9uXCIpO1xuICAgICAgICB0aGlzLmZpcnN0TGVnZW5kRGl2LmNsYXNzTGlzdC5hZGQoXCJleGVyY2lzZS1zdGF0ZW1lbnRcIik7XG4gICAgICAgIHRoaXMuZm9ybVBhcnRzLmFwcGVuZENoaWxkKHRoaXMuZmlyc3RMZWdlbmREaXYpO1xuICAgICAgICB0aGlzLmpJbnB1dERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHRoaXMuaklucHV0RGl2LmlkID0gdGhpcy5kaXZpZCArIFwiX2pvdXJuYWxfaW5wdXRcIjtcbiAgICAgICAgdGhpcy5mb3JtUGFydHMuYXBwZW5kQ2hpbGQodGhpcy5qSW5wdXREaXYpO1xuICAgICAgICB0aGlzLmpPcHRpb25zRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdGhpcy5qT3B0aW9uc0Rpdi5jbGFzc0xpc3QuYWRkKFwiam91cm5hbC1vcHRpb25zXCIpO1xuICAgICAgICB0aGlzLmpJbnB1dERpdi5hcHBlbmRDaGlsZCh0aGlzLmpPcHRpb25zRGl2KTtcbiAgICAgICAgdGhpcy5qVGV4dEFyZWEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGV4dGFyZWFcIik7XG4gICAgICAgIHRoaXMualRleHRBcmVhLmlkID0gdGhpcy5kaXZpZCArIFwiX3NvbHV0aW9uXCI7XG4gICAgICAgIHRoaXMualRleHRBcmVhLnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIiwgXCJ0ZXh0YXJlYVwiKTtcbiAgICAgICAgdGhpcy5qVGV4dEFyZWEucGxhY2Vob2xkZXIgPSB0aGlzLnBsYWNlaG9sZGVyO1xuICAgICAgICB0aGlzLmpUZXh0QXJlYS5zdHlsZS5kaXNwbGF5ID0gXCJpbmxpbmVcIjtcbiAgICAgICAgdGhpcy5qVGV4dEFyZWEuc3R5bGUud2lkdGggPSBcIjUzMHB4XCI7XG4gICAgICAgIHRoaXMualRleHRBcmVhLmNsYXNzTGlzdC5hZGQoXCJmb3JtLWNvbnRyb2xcIik7XG4gICAgICAgIHRoaXMualRleHRBcmVhLnJvd3MgPSA0O1xuICAgICAgICB0aGlzLmpUZXh0QXJlYS5jb2xzID0gNTA7XG4gICAgICAgIHRoaXMuak9wdGlvbnNEaXYuYXBwZW5kQ2hpbGQodGhpcy5qVGV4dEFyZWEpO1xuXG4gICAgICAgIC8vIGZpcmVzIHdoZW4gd2UgbG9vc2UgZm9jdXMgb24gdGhlIHRleHRhcmVhIGFmdGVyIG1ha2luZyBhIGNoYW5nZVxuICAgICAgICAvLyBtYXJrIGl0IGFzIGFuc3dlcmVkIGZvciBwZWVyL3RpbWVkIHB1cnBvc2VzXG4gICAgICAgIHRoaXMualRleHRBcmVhLm9uY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5pc0Fuc3dlcmVkID0gdHJ1ZTtcbiAgICAgICAgfS5iaW5kKHRoaXMpO1xuXG4gICAgICAgIC8vIHRoZSBhbnN3ZXIgaGFzIG5vdCBiZWVuIHNhdmVkIHlldC4gVXBkYXRlIGFzIHNvb24gYXMgdXNlciB0eXBlcyBpblxuICAgICAgICAvLyB0aGUgYm94LCBub3QganVzdCB3aGVuIHRoZXkgbG9vc2UgZm9jdXMuXG4gICAgICAgIHRoaXMualRleHRBcmVhLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZmVlZGJhY2tEaXYuY2xhc3NMaXN0LnJlbW92ZShcInZpc3VhbGx5aGlkZGVuXCIpO1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNUaW1lZCkge1xuICAgICAgICAgICAgICAgIC8vIG5vIG5lZWQgZm9yIGRhbmdlciBzdGF0dXMuLi4gbm90aGluZyBmb3IgdXNlciB0byBkbyBoZXJlXG4gICAgICAgICAgICAgICAgdGhpcy5mZWVkYmFja0Rpdi5pbm5lckhUTUwgPVxuICAgICAgICAgICAgICAgICAgICBcIllvdXIgYW5zd2VyIGlzIGF1dG9tYXRpY2FsbHkgc2F2ZWQuXCI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuZmVlZGJhY2tEaXYuaW5uZXJIVE1MID1cbiAgICAgICAgICAgICAgICAgICAgXCJZb3VyIGFuc3dlciBoYXMgbm90IGJlZW4gc2F2ZWQgeWV0IVwiO1xuICAgICAgICAgICAgICAgIHRoaXMuZmVlZGJhY2tEaXYuY2xhc3NMaXN0LnJlbW92ZShcImFsZXJ0LXN1Y2Nlc3NcIik7XG4gICAgICAgICAgICAgICAgdGhpcy5mZWVkYmFja0Rpdi5jbGFzc0xpc3QuYWRkKFwiYWxlcnRcIiwgXCJhbGVydC1kYW5nZXJcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMualRleHRBcmVhLmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmpUZXh0QXJlYS5zdHlsZS5oZWlnaHQgPSBcImF1dG9cIjtcbiAgICAgICAgICAgIHRoaXMualRleHRBcmVhLnN0eWxlLmhlaWdodCA9IGAke3RoaXMualRleHRBcmVhLnNjcm9sbEhlaWdodH1weGA7XG4gICAgICAgICAgICB0aGlzLnJlbmRlck1hdGgodGhpcy5qVGV4dEFyZWEudmFsdWUpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5idXR0b25EaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB0aGlzLmZvcm1QYXJ0cy5hcHBlbmRDaGlsZCh0aGlzLmJ1dHRvbkRpdik7XG4gICAgICAgIHRoaXMuc3VibWl0QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICAgICAgdGhpcy5zdWJtaXRCdXR0b24uY2xhc3NMaXN0LmFkZChcImJ0blwiLCBcImJ0bi1zdWNjZXNzXCIpO1xuICAgICAgICB0aGlzLnN1Ym1pdEJ1dHRvbi50eXBlID0gXCJidXR0b25cIjtcbiAgICAgICAgdGhpcy5zdWJtaXRCdXR0b24udGV4dENvbnRlbnQgPSBcIlNhdmVcIjtcbiAgICAgICAgdGhpcy5zdWJtaXRCdXR0b24ub25jbGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuY2hlY2tDdXJyZW50QW5zd2VyKCk7XG4gICAgICAgICAgICB0aGlzLmxvZ0N1cnJlbnRBbnN3ZXIoKTtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyRmVlZGJhY2soKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmJ1dHRvbkRpdi5hcHBlbmRDaGlsZCh0aGlzLnN1Ym1pdEJ1dHRvbik7XG5cbiAgICAgICAgdGhpcy5vdGhlck9wdGlvbnNEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB0aGlzLm90aGVyT3B0aW9uc0Rpdi5zdHlsZS5wYWRkaW5nTGVmdCA9IFwiMjBweFwiO1xuICAgICAgICB0aGlzLm90aGVyT3B0aW9uc0Rpdi5jbGFzc0xpc3QuYWRkKFwiam91cm5hbC1vcHRpb25zXCIpO1xuICAgICAgICB0aGlzLmZvcm1QYXJ0cy5hcHBlbmRDaGlsZCh0aGlzLm90aGVyT3B0aW9uc0Rpdik7XG4gICAgICAgIC8vIGFkZCBhIGZlZWRiYWNrIGRpdiB0byBnaXZlIHVzZXIgZmVlZGJhY2tcbiAgICAgICAgdGhpcy5mZWVkYmFja0RpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHRoaXMuZmVlZGJhY2tEaXYuc3R5bGUud2lkdGggPSBcIjUzMHB4XCI7XG4gICAgICAgIHRoaXMuZmVlZGJhY2tEaXYuc3R5bGUuZm9udFN0eWxlID0gXCJpdGFsaWNcIjtcbiAgICAgICAgdGhpcy5mZWVkYmFja0Rpdi5pZCA9IHRoaXMuZGl2aWQgKyBcIl9mZWVkYmFja1wiO1xuICAgICAgICB0aGlzLmZlZWRiYWNrRGl2LmNsYXNzTGlzdC5hZGQoXG4gICAgICAgICAgICBcInNob3J0YW5zd2VyX19mZWVkYmFja1wiLFxuICAgICAgICAgICAgXCJ2aXN1YWxseWhpZGRlblwiLFxuICAgICAgICApO1xuICAgICAgICB0aGlzLmZlZWRiYWNrRGl2LmFyaWFMaXZlID0gXCJwb2xpdGVcIjtcbiAgICAgICAgdGhpcy5mb3JtUGFydHMuYXBwZW5kQ2hpbGQodGhpcy5mZWVkYmFja0Rpdik7XG4gICAgICAgIGlmICh0aGlzLmF0dGFjaG1lbnQpIHtcbiAgICAgICAgICAgIGxldCBhdHRhY2hEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgdGhpcy5hdHRhY2hEaXYgPSBhdHRhY2hEaXY7XG4gICAgICAgICAgICBpZiAodGhpcy5ncmFkZXJhY3RpdmUpIHtcbiAgICAgICAgICAgICAgICAvLyBJZiBpbiBncmFkaW5nIG1vZGUgbWFrZSBhIGJ1dHRvbiB0byBjcmVhdGUgYSBwb3B1cCB3aXRoIHRoZSBpbWFnZVxuICAgICAgICAgICAgICAgIGxldCB2aWV3QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICAgICAgICAgICAgICB2aWV3QnV0dG9uLnR5cGUgPSBcImJ1dHRvblwiO1xuICAgICAgICAgICAgICAgIHZpZXdCdXR0b24uaW5uZXJIVE1MID0gXCJWaWV3IEF0dGFjaG1lbnRcIjtcbiAgICAgICAgICAgICAgICB2aWV3QnV0dG9uLm9uY2xpY2sgPSB0aGlzLnZpZXdGaWxlLmJpbmQodGhpcyk7XG4gICAgICAgICAgICAgICAgYXR0YWNoRGl2LmFwcGVuZENoaWxkKHZpZXdCdXR0b24pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBPdGhlcndpc2UgbWFrZSBhIGJ1dHRvbiBmb3IgdGhlIHN0dWRlbnQgdG8gc2VsZWN0IGEgZmlsZSB0byB1cGxvYWQuXG4gICAgICAgICAgICAgICAgdGhpcy5maWxlVXBsb2FkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xuICAgICAgICAgICAgICAgIHRoaXMuZmlsZVVwbG9hZC50eXBlID0gXCJmaWxlXCI7XG4gICAgICAgICAgICAgICAgdGhpcy5maWxlVXBsb2FkLmlkID0gYCR7dGhpcy5kaXZpZH1fZmlsZW1lYDtcbiAgICAgICAgICAgICAgICBhdHRhY2hEaXYuYXBwZW5kQ2hpbGQodGhpcy5maWxlVXBsb2FkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmFwcGVuZENoaWxkKGF0dGFjaERpdik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5vcmlnRWxlbS5yZXBsYWNlV2l0aCh0aGlzLmNvbnRhaW5lckRpdik7XG4gICAgICAgIHRoaXMucXVldWVNYXRoSmF4KHRoaXMuY29udGFpbmVyRGl2KTtcbiAgICB9XG5cbiAgICByZW5kZXJNYXRoKHZhbHVlKSB7XG4gICAgICAgIGlmIChsb29rc0xpa2VMYXRleE1hdGgodmFsdWUpKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMucmVuZGVyZWRBbnN3ZXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlZGVyZWRBbnN3ZXJEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgICAgIHRoaXMucmVkZXJlZEFuc3dlckRpdi5jbGFzc0xpc3QuYWRkKFxuICAgICAgICAgICAgICAgICAgICBcInNob3J0YW5zd2VyX19yZW5kZXJlZC1hbnN3ZXItZGl2XCIsXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB0aGlzLmZvcm1QYXJ0cy5hcHBlbmRDaGlsZCh0aGlzLnJlZGVyZWRBbnN3ZXJEaXYpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlZEFuc3dlckxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxhYmVsXCIpO1xuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZWRBbnN3ZXJMYWJlbC5pbm5lckhUTUwgPSBcIlJlbmRlcmVkIEFuc3dlcjpcIjtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVkQW5zd2VyTGFiZWwuaWQgPVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRpdmlkICsgXCJfcmVuZGVyZWRfYW5zd2VyX2xhYmVsXCI7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlZEFuc3dlckxhYmVsLmNsYXNzTGlzdC5hZGQoXG4gICAgICAgICAgICAgICAgICAgIFwic2hvcnRhbnN3ZXJfX3JlbmRlcmVkLWFuc3dlci1sYWJlbFwiLFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgdGhpcy5yZWRlcmVkQW5zd2VyRGl2LmFwcGVuZENoaWxkKHRoaXMucmVuZGVyZWRBbnN3ZXJMYWJlbCk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVkQW5zd2VyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVkQW5zd2VyLmNsYXNzTGlzdC5hZGQoXG4gICAgICAgICAgICAgICAgICAgIFwic2hvcnRhbnN3ZXJfX3JlbmRlcmVkLWFuc3dlclwiLFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlZEFuc3dlci5jbGFzc0xpc3QuYWRkKFwibGF0ZXhvdXRwdXRcIik7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlZEFuc3dlci5zZXRBdHRyaWJ1dGUoXG4gICAgICAgICAgICAgICAgICAgIFwiYXJpYS1sYWJlbGxlZGJ5XCIsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZWRBbnN3ZXJMYWJlbC5pZCxcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZWRBbnN3ZXIuc2V0QXR0cmlidXRlKFwiYXJpYS1saXZlXCIsIFwicG9saXRlXCIpO1xuICAgICAgICAgICAgICAgIHRoaXMucmVkZXJlZEFuc3dlckRpdi5hcHBlbmRDaGlsZCh0aGlzLnJlbmRlcmVkQW5zd2VyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZSgvXFwkXFwkKC4qPylcXCRcXCQvZywgXCJcXFxcWyAkMSBcXFxcXVwiKTtcbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZSgvXFwkKC4qPylcXCQvZywgXCJcXFxcKCAkMSBcXFxcKVwiKTtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyZWRBbnN3ZXIudGV4dENvbnRlbnQgPSB2YWx1ZTtcblxuICAgICAgICAgICAgdGhpcy5yZWRlcmVkQW5zd2VyRGl2LnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgICAgICAgICB0aGlzLnF1ZXVlTWF0aEpheCh0aGlzLnJlbmRlcmVkQW5zd2VyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnJlbmRlcmVkQW5zd2VyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZWRlcmVkQW5zd2VyRGl2LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFzeW5jIGNoZWNrQ3VycmVudEFuc3dlcigpIHtcbiAgICAgICAgbGV0IHZhbHVlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5kaXZpZCArIFwiX3NvbHV0aW9uXCIpLnZhbHVlO1xuICAgICAgICB0aGlzLnJlbmRlck1hdGgodmFsdWUpO1xuICAgICAgICB0aGlzLnNldExvY2FsU3RvcmFnZSh7XG4gICAgICAgICAgICBhbnN3ZXI6IHZhbHVlLFxuICAgICAgICAgICAgdGltZXN0YW1wOiBuZXcgRGF0ZSgpLFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBhc3luYyBsb2dDdXJyZW50QW5zd2VyKHNpZCkge1xuICAgICAgICBsZXQgdmFsdWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmRpdmlkICsgXCJfc29sdXRpb25cIikudmFsdWU7XG4gICAgICAgIHRoaXMucmVuZGVyTWF0aCh2YWx1ZSk7XG4gICAgICAgIHRoaXMuc2V0TG9jYWxTdG9yYWdlKHtcbiAgICAgICAgICAgIGFuc3dlcjogdmFsdWUsXG4gICAgICAgICAgICB0aW1lc3RhbXA6IG5ldyBEYXRlKCksXG4gICAgICAgIH0pO1xuICAgICAgICBsZXQgZGF0YSA9IHtcbiAgICAgICAgICAgIGV2ZW50OiBcInNob3J0YW5zd2VyXCIsXG4gICAgICAgICAgICBhY3Q6IHZhbHVlLFxuICAgICAgICAgICAgYW5zd2VyOiB2YWx1ZSxcbiAgICAgICAgICAgIGRpdl9pZDogdGhpcy5kaXZpZCxcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHR5cGVvZiBzaWQgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIGRhdGEuc2lkID0gc2lkO1xuICAgICAgICB9XG4gICAgICAgIGF3YWl0IHRoaXMubG9nQm9va0V2ZW50KGRhdGEpO1xuICAgICAgICBpZiAodGhpcy5hdHRhY2htZW50KSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnVwbG9hZEZpbGUoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlbmRlckZlZWRiYWNrKCkge1xuICAgICAgICB0aGlzLmZlZWRiYWNrRGl2LmlubmVySFRNTCA9IFwiWW91ciBhbnN3ZXIgaGFzIGJlZW4gc2F2ZWQuXCI7XG4gICAgICAgIHRoaXMuZmVlZGJhY2tEaXYuY2xhc3NMaXN0LnJlbW92ZShcImFsZXJ0LWRhbmdlclwiKTtcbiAgICAgICAgdGhpcy5mZWVkYmFja0Rpdi5jbGFzc0xpc3QuYWRkKFwiYWxlcnRcIiwgXCJhbGVydC1zdWNjZXNzXCIpO1xuICAgICAgICB0aGlzLmZlZWRiYWNrRGl2LmNsYXNzTGlzdC5yZW1vdmUoXCJ2aXN1YWxseWhpZGRlblwiKTtcbiAgICB9XG4gICAgc2V0TG9jYWxTdG9yYWdlKGRhdGEpIHtcbiAgICAgICAgaWYgKCF0aGlzLmdyYWRlcmFjdGl2ZSkge1xuICAgICAgICAgICAgbGV0IGtleSA9IHRoaXMubG9jYWxTdG9yYWdlS2V5KCk7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjaGVja0xvY2FsU3RvcmFnZSgpIHtcbiAgICAgICAgLy8gUmVwb3B1bGF0ZXMgdGhlIHNob3J0IGFuc3dlciB0ZXh0XG4gICAgICAgIC8vIHdoaWNoIHdhcyBzdG9yZWQgaW50byBsb2NhbCBzdG9yYWdlLlxuICAgICAgICB2YXIgYW5zd2VyID0gXCJcIjtcbiAgICAgICAgaWYgKHRoaXMuZ3JhZGVyYWN0aXZlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGxlbiA9IGxvY2FsU3RvcmFnZS5sZW5ndGg7XG4gICAgICAgIGlmIChsZW4gPiAwKSB7XG4gICAgICAgICAgICB2YXIgZXggPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLmxvY2FsU3RvcmFnZUtleSgpKTtcbiAgICAgICAgICAgIGlmIChleCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGxldCBlcnJvciA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzdG9yZWREYXRhID0gSlNPTi5wYXJzZShleCk7XG4gICAgICAgICAgICAgICAgICAgIGFuc3dlciA9IHN0b3JlZERhdGEuYW5zd2VyO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICAvLyBlcnJvciB3aGlsZSBwYXJzaW5nOyBsaWtlbHkgZHVlIHRvIGJhZCB2YWx1ZSBzdG9yZWQgaW4gc3RvcmFnZVxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAgICAgICAgICAgICAgIGBFcnJvciBwYXJzaW5nIHN0b3JlZCBzaG9ydGFuc3dlciBkYXRhIGZvciAke3RoaXMuZGl2aWR9OiAke2Vyci5tZXNzYWdlfWAsXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGVycm9yIHx8IHN0b3JlZERhdGEudGltZXN0YW1wIDwgZUJvb2tDb25maWcudGVybVN0YXJ0RGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSh0aGlzLmxvY2FsU3RvcmFnZUtleSgpKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsZXQgc29sdXRpb24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXZpZCArIFwiX3NvbHV0aW9uXCIsXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBpZiAoc29sdXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgc29sdXRpb24udmFsdWUgPSBhbnN3ZXI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyTWF0aChhbnN3ZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJlc3RvcmVBbnN3ZXJzKGRhdGEpIHtcbiAgICAgICAgLy8gUmVzdG9yZSBhbnN3ZXJzIGZyb20gc3RvcmFnZSByZXRyaWV2YWwgZG9uZSBpbiBSdW5lc3RvbmVCYXNlXG4gICAgICAgIC8vIHNvbWV0aW1lcyBkYXRhLmFuc3dlciBjYW4gYmUgbnVsbFxuICAgICAgICBpZiAoIWRhdGEuYW5zd2VyKSB7XG4gICAgICAgICAgICBkYXRhLmFuc3dlciA9IFwiXCI7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hbnN3ZXIgPSBkYXRhLmFuc3dlcjtcbiAgICAgICAgdGhpcy5qVGV4dEFyZWEudmFsdWUgPSB0aGlzLmFuc3dlcjtcbiAgICAgICAgdGhpcy5yZW5kZXJNYXRoKHRoaXMuYW5zd2VyKTtcblxuICAgICAgICBsZXQgcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuICAgICAgICBwLmNsYXNzTGlzdC5hZGQoXCJzaG9ydGFuc3dlcl9fdGltZXN0YW1wXCIpO1xuICAgICAgICB0aGlzLmpJbnB1dERpdi5hcHBlbmRDaGlsZChwKTtcbiAgICAgICAgdmFyIHRzU3RyaW5nID0gXCJcIjtcbiAgICAgICAgaWYgKGRhdGEudGltZXN0YW1wKSB7XG4gICAgICAgICAgICB0c1N0cmluZyA9IG5ldyBEYXRlKGRhdGEudGltZXN0YW1wKS50b0xvY2FsZVN0cmluZygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdHNTdHJpbmcgPSBcIlwiO1xuICAgICAgICB9XG4gICAgICAgIHAudGV4dENvbnRlbnQgPSB0c1N0cmluZztcbiAgICAgICAgdGhpcy5qVGV4dEFyZWEuc3R5bGUuaGVpZ2h0ID0gXCJhdXRvXCI7XG4gICAgICAgIHRoaXMualRleHRBcmVhLnN0eWxlLmhlaWdodCA9IGAke3RoaXMualRleHRBcmVhLnNjcm9sbEhlaWdodH1weGA7XG5cbiAgICAgICAgaWYgKGRhdGEubGFzdF9hbnN3ZXIpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudF9hbnN3ZXIgPSBcIm9udGltZVwiO1xuICAgICAgICAgICAgbGV0IHRvZ2dsZV9hbnN3ZXJfYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICAgICAgICAgIHRvZ2dsZV9hbnN3ZXJfYnV0dG9uLnR5cGUgPSBcImJ1dHRvblwiO1xuICAgICAgICAgICAgdG9nZ2xlX2Fuc3dlcl9idXR0b24udGV4dENvbnRlbnQgPSBcIlNob3cgTGF0ZSBBbnN3ZXJcIjtcbiAgICAgICAgICAgIHRvZ2dsZV9hbnN3ZXJfYnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJidG5cIiwgXCJidG4td2FybmluZ1wiKTtcbiAgICAgICAgICAgIHRvZ2dsZV9hbnN3ZXJfYnV0dG9uLnN0eWxlLm1hcmdpbkxlZnQgPSBcIjVweFwiO1xuXG4gICAgICAgICAgICB0b2dnbGVfYW5zd2VyX2J1dHRvbi5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgICAgIFwiY2xpY2tcIixcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBkaXNwbGF5X3RpbWVzdGFtcCwgYnV0dG9uX3RleHQ7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRfYW5zd2VyID09PSBcIm9udGltZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmpUZXh0QXJlYS52YWx1ZSA9IGRhdGEubGFzdF9hbnN3ZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFuc3dlciA9IGRhdGEubGFzdF9hbnN3ZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5X3RpbWVzdGFtcCA9IG5ldyBEYXRlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEubGFzdF90aW1lc3RhbXAsXG4gICAgICAgICAgICAgICAgICAgICAgICApLnRvTG9jYWxlU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBidXR0b25fdGV4dCA9IFwiU2hvdyBvbi1UaW1lIEFuc3dlclwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50X2Fuc3dlciA9IFwibGF0ZVwiO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5qVGV4dEFyZWEudmFsdWUgPSBkYXRhLmFuc3dlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYW5zd2VyID0gZGF0YS5hbnN3ZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5X3RpbWVzdGFtcCA9IHRzU3RyaW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uX3RleHQgPSBcIlNob3cgTGF0ZSBBbnN3ZXJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudF9hbnN3ZXIgPSBcIm9udGltZVwiO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyTWF0aCh0aGlzLmFuc3dlcik7XG4gICAgICAgICAgICAgICAgICAgIHAudGV4dENvbnRlbnQgPSBgU3VibWl0dGVkOiAke2Rpc3BsYXlfdGltZXN0YW1wfWA7XG4gICAgICAgICAgICAgICAgICAgIHRvZ2dsZV9hbnN3ZXJfYnV0dG9uLnRleHRDb250ZW50ID0gYnV0dG9uX3RleHQ7XG4gICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpLFxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgdGhpcy5idXR0b25EaXYuYXBwZW5kQ2hpbGQodG9nZ2xlX2Fuc3dlcl9idXR0b24pO1xuICAgICAgICB9XG4gICAgICAgIGxldCBmZWVkYmFja1N0ciA9IFwiXCI7XG4gICAgICAgIGlmICh0eXBlb2YgZGF0YS5zY29yZSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgZmVlZGJhY2tTdHIgPSBgU2NvcmU6ICR7ZGF0YS5zY29yZX1gO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkYXRhLmNvbW1lbnQpIHtcbiAgICAgICAgICAgIGZlZWRiYWNrU3RyICs9IGAgLS0gJHtkYXRhLmNvbW1lbnR9YDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZmVlZGJhY2tTdHIgIT09IFwiXCIpIHtcbiAgICAgICAgICAgIHRoaXMuZmVlZGJhY2tEaXYuaW5uZXJIVE1MID0gZmVlZGJhY2tTdHI7XG4gICAgICAgICAgICB0aGlzLmZlZWRiYWNrRGl2LmNsYXNzTGlzdC5hZGQoXCJhbGVydFwiLCBcImFsZXJ0LXN1Y2Nlc3NcIik7XG4gICAgICAgICAgICB0aGlzLmZlZWRiYWNrRGl2LmNsYXNzTGlzdC5yZW1vdmUoXCJ2aXN1YWxseWhpZGRlblwiKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGRpc2FibGVJbnRlcmFjdGlvbigpIHtcbiAgICAgICAgdGhpcy5qVGV4dEFyZWEuZGlzYWJsZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIGFzeW5jIGdldEF0dGFjaG1lbnROYW1lKCkge1xuICAgICAgICAvLyBHZXQgdGhlIGF0dGFjaG1lbnQgbmFtZSBmcm9tIHRoZSAvbnMvYXNzZXNzbWVudC9oYXNfYXR0YWNobWVudCBlbmRwb2ludFxuICAgICAgICBsZXQgcmVxdWVzdFVybCA9IGAvbnMvYXNzZXNzbWVudC9oYXNfYXR0YWNobWVudC8ke3RoaXMuZGl2aWR9YDtcbiAgICAgICAgaWYgKHRoaXMuc2lkKSB7XG4gICAgICAgICAgICByZXF1ZXN0VXJsICs9IGA/c2lkPSR7dGhpcy5zaWR9YDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHJlcXVlc3RVcmwpO1xuICAgICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFxuICAgICAgICAgICAgICAgIFwiRXJyb3IgZmV0Y2hpbmcgYXR0YWNobWVudCBuYW1lOlwiLFxuICAgICAgICAgICAgICAgIHJlc3BvbnNlLnN0YXR1c1RleHQsXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgb2JqID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICBpZiAob2JqLmRldGFpbC5oYXNBdHRhY2htZW50KSB7XG4gICAgICAgICAgICAvLyBSZXR1cm4gdGhlIFMzIGtleSBmb3IgdGhlIGF0dGFjaG1lbnRcbiAgICAgICAgICAgIGxldCBmaWxlbmFtZSA9IG9iai5kZXRhaWwuaGFzQXR0YWNobWVudDtcbiAgICAgICAgICAgIC8vIGZpbGVuYW1lIGlzIGV2ZXJ0aGluZyBhZnRlciB0aGUgbGFzdCBzbGFzaFxuICAgICAgICAgICAgZmlsZW5hbWUgPSBmaWxlbmFtZS5zdWJzdHJpbmcoZmlsZW5hbWUubGFzdEluZGV4T2YoXCIvXCIpICsgMSk7XG4gICAgICAgICAgICBsZXQgZm1lc3MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICAgICAgICAgIGZtZXNzLnRleHRDb250ZW50ID0gYEF0dGFjaG1lbnQ6ICR7ZmlsZW5hbWV9YDtcbiAgICAgICAgICAgIHRoaXMuYXR0YWNoRGl2LmFwcGVuZENoaWxkKGZtZXNzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFzeW5jIHVwbG9hZEZpbGUoKSB7XG4gICAgICAgIGNvbnN0IGZpbGVzID0gdGhpcy5maWxlVXBsb2FkLmZpbGVzO1xuICAgICAgICAvLyBnZXQgdGhlIHN1ZmZpeCBmcm9tIHRoZSBmaWxlIG5hbWVcbiAgICAgICAgY29uc3QgZmlsZU5hbWUgPSBmaWxlc1swXS5uYW1lO1xuICAgICAgICBjb25zdCBzdWZmaXggPSBmaWxlTmFtZS5zcGxpdChcIi5cIikucG9wKCk7XG4gICAgICAgIC8vIGlmIHRoZSBzdWZmaXggaXMgbm90IGluIHRoZSBsaXN0IG9mIGFsbG93ZWQgc3VmZml4ZXMsIHJldHVyblxuICAgICAgICBpZiAoIVtcImpwZ1wiLCBcImpwZWdcIiwgXCJwbmdcIiwgXCJnaWZcIiwgXCJwZGZcIl0uaW5jbHVkZXMoc3VmZml4KSkge1xuICAgICAgICAgICAgYWxlcnQoXG4gICAgICAgICAgICAgICAgXCJGaWxlIHR5cGUgbm90IGFsbG93ZWQuIFBsZWFzZSB1cGxvYWQgYSBqcGcsIGpwZWcsIHBuZywgZ2lmLCBvciBwZGYgZmlsZS5cIixcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gaWYgdGhlIGZpbGUgc2l6ZSBpcyBncmVhdGVyIHRoYW4gNU1CLCByZXR1cm5cbiAgICAgICAgaWYgKGZpbGVzWzBdLnNpemUgPiA1ICogMTAyNCAqIDEwMjQpIHtcbiAgICAgICAgICAgIGFsZXJ0KFwiRmlsZSBzaXplIGV4Y2VlZHMgNU1CIGxpbWl0LiBQbGVhc2UgdXBsb2FkIGEgc21hbGxlciBmaWxlLlwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBkYXRhID0gbmV3IEZvcm1EYXRhKCk7XG4gICAgICAgIGlmICh0aGlzLmZpbGVVcGxvYWQuZmlsZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgZGF0YS5hcHBlbmQoXCJmaWxlXCIsIGZpbGVzWzBdKTtcbiAgICAgICAgICAgIGZldGNoKGAvbnMvbG9nZ2VyL3VwbG9hZC8ke3RoaXMuZGl2aWR9YCwge1xuICAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgICAgICAgYm9keTogZGF0YSxcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiByZXNwb25zZS5qc29uKCkpXG4gICAgICAgICAgICAgICAgLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmlld0ZpbGUoKSB7XG4gICAgICAgIC8vIEdldCB0aGUgVVJMIGZyb20gdGhlIFMzIEFQSSAtLSBzYXZlZCB3aGVuIHdlIGRpc3BsYXkgaW4gZ3JhZGVyIG1vZGVcbiAgICAgICAgaWYgKHRoaXMuYXR0YWNoVVJMKSB7XG4gICAgICAgICAgICAvL3dpbmRvdy5vcGVuKHRoaXMuYXR0YWNoVVJMLCBcIl9ibGFua1wiKTtcbiAgICAgICAgICAgIC8vPGVtYmVkIHNyYz1cImV4YW1wbGUucGRmXCIgdHlwZT1cImFwcGxpY2F0aW9uL3BkZlwiIHdpZHRoPVwiMTAwJVwiIGhlaWdodD1cIjYwMHB4XCIgLz5cbiAgICAgICAgICAgIC8vc3dpdGNoIHRvXG4gICAgICAgICAgICBjb25zdCBpbWFnZV93aW5kb3cgPSB3aW5kb3cub3BlbihcIlwiLCBcIl9ibGFua1wiKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmF0dGFjaFVSTC5pbmRleE9mKFwiLnBkZj9cIikgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZW1iZWQgPSBpbWFnZV93aW5kb3cuZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9iamVjdFwiKTtcbiAgICAgICAgICAgICAgICBlbWJlZC5zZXRBdHRyaWJ1dGUoXCJkYXRhXCIsIHRoaXMuYXR0YWNoVVJMKTtcbiAgICAgICAgICAgICAgICBlbWJlZC5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwiYXBwbGljYXRpb24vcGRmXCIpO1xuICAgICAgICAgICAgICAgIGVtYmVkLnNldEF0dHJpYnV0ZShcIndpZHRoXCIsIFwiODAwcHhcIik7XG4gICAgICAgICAgICAgICAgZW1iZWQuc2V0QXR0cmlidXRlKFwiaGVpZ2h0XCIsIFwiMTA0MHB4XCIpO1xuICAgICAgICAgICAgICAgIGltYWdlX3dpbmRvdy5kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGVtYmVkKTtcbiAgICAgICAgICAgICAgICBsZXQgYWx0ID0gaW1hZ2Vfd2luZG93LmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xuICAgICAgICAgICAgICAgIGFsdC5zZXRBdHRyaWJ1dGUoXCJocmVmXCIsIHRoaXMuYXR0YWNoVVJMKTtcbiAgICAgICAgICAgICAgICBhbHQuaW5uZXJUZXh0ID0gXCJEb3dubG9hZCBQREZcIjtcbiAgICAgICAgICAgICAgICBlbWJlZC5hcHBlbmRDaGlsZChhbHQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpbWcgPSBpbWFnZV93aW5kb3cuZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcbiAgICAgICAgICAgICAgICBpbWcuc2V0QXR0cmlidXRlKFwic3JjXCIsIHRoaXMuYXR0YWNoVVJMKTtcbiAgICAgICAgICAgICAgICBpbWcuc2V0QXR0cmlidXRlKFwic3R5bGVcIiwgXCJ3aWR0aDoxMDAlOyBoZWlnaHQ6YXV0bztcIik7XG4gICAgICAgICAgICAgICAgaW1hZ2Vfd2luZG93LmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaW1nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFsZXJ0KFwiTm8gYXR0YWNobWVudCBmb3IgdGhpcyBzdHVkZW50LlwiKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09IEZpbmQgdGhlIGN1c3RvbSBIVE1MIHRhZ3MgYW5kID09XG49PSAgIGV4ZWN1dGUgb3VyIGNvZGUgb24gdGhlbSAgICA9PVxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJydW5lc3RvbmU6bG9naW4tY29tcGxldGVcIiwgZnVuY3Rpb24gKCkge1xuICAgIGRvY3VtZW50XG4gICAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKFwiW2RhdGEtY29tcG9uZW50PXNob3J0YW5zd2VyXVwiKVxuICAgICAgICAuZm9yRWFjaChmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgICAgIC8vIElmIHRoaXMgZWxlbWVudCBleGlzdHMgd2l0aGluIGEgdGltZWQgY29tcG9uZW50LCBkb24ndCByZW5kZXIgaXQgaGVyZVxuICAgICAgICAgICAgaWYgKCFlbC5jbG9zZXN0KFwiW2RhdGEtY29tcG9uZW50PXRpbWVkQXNzZXNzbWVudF1cIikpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuY29tcG9uZW50TWFwW2VsLmlkXSA9IG5ldyBTaG9ydEFuc3dlcih7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcmlnOiBlbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHVzZVJ1bmVzdG9uZVNlcnZpY2VzOiBlQm9va0NvbmZpZy51c2VSdW5lc3RvbmVTZXJ2aWNlcyxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBFcnJvciByZW5kZXJpbmcgU2hvcnRBbnN3ZXIgUHJvYmxlbSAke2VsLmlkfVxuICAgICAgICAgICAgICAgIERldGFpbHM6ICR7ZXJyfWApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG59KTtcbiIsImltcG9ydCBTaG9ydEFuc3dlciBmcm9tIFwiLi9zaG9ydGFuc3dlci5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaW1lZFNob3J0QW5zd2VyIGV4dGVuZHMgU2hvcnRBbnN3ZXIge1xuICAgIGNvbnN0cnVjdG9yKG9wdHMpIHtcbiAgICAgICAgc3VwZXIob3B0cyk7XG4gICAgICAgIHRoaXMucmVuZGVyVGltZWRJY29uKHRoaXMuY29udGFpbmVyRGl2KTtcbiAgICAgICAgdGhpcy5pc1RpbWVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5oaWRlQnV0dG9ucygpO1xuICAgIH1cbiAgICBoaWRlQnV0dG9ucygpIHtcbiAgICAgICAgaWYgKHRoaXMuc3VibWl0QnV0dG9uKSB7XG4gICAgICAgICAgICB0aGlzLnN1Ym1pdEJ1dHRvbi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmVuZGVyVGltZWRJY29uKGNvbXBvbmVudCkge1xuICAgICAgICAvLyByZW5kZXJzIHRoZSBjbG9jayBpY29uIG9uIHRpbWVkIGNvbXBvbmVudHMuICAgIFRoZSBjb21wb25lbnQgcGFyYW1ldGVyXG4gICAgICAgIC8vIGlzIHRoZSBlbGVtZW50IHRoYXQgdGhlIGljb24gc2hvdWxkIGJlIGFwcGVuZGVkIHRvLlxuICAgICAgICB2YXIgdGltZUljb25EaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB2YXIgdGltZUljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xuXG4gICAgICAgIHRpbWVJY29uLnNyYyA9IFwiLi4vX3N0YXRpYy9jbG9jay5wbmdcIjtcbiAgICAgICAgdGltZUljb24uc3R5bGUud2lkdGggPSBcIjE1cHhcIjtcbiAgICAgICAgdGltZUljb24uc3R5bGUuaGVpZ2h0ID0gXCIxNXB4XCI7XG5cbiAgICAgICAgdGltZUljb25EaXYuY2xhc3NOYW1lID0gXCJ0aW1lVGlwXCI7XG4gICAgICAgIHRpbWVJY29uRGl2LnRpdGxlID0gXCJcIjtcbiAgICAgICAgdGltZUljb25EaXYuYXBwZW5kQ2hpbGQodGltZUljb24pO1xuXG4gICAgICAgIC8vIElmIGZpcnN0Q2hpbGQgaXMgbnVsbCwgaW5zZXJ0QmVmb3JlIGFjdHMgbGlrZSBhcHBlbmRDaGlsZFxuICAgICAgICBjb21wb25lbnQuaW5zZXJ0QmVmb3JlKHRpbWVJY29uRGl2LCBjb21wb25lbnQuZmlyc3RDaGlsZCk7XG4gICAgfVxuICAgIGNoZWNrQ29ycmVjdFRpbWVkKCkge1xuICAgICAgICByZXR1cm4gXCJJXCI7IC8vIHdlIGlnbm9yZSB0aGlzIGluIHRoZSBncmFkaW5nXG4gICAgfVxuICAgIGhpZGVGZWVkYmFjaygpIHtcbiAgICAgICAgaWYgKHRoaXMuZmVlZGJhY2tEaXYpIHtcbiAgICAgICAgICAgIHRoaXMuZmVlZGJhY2tEaXYuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5pZiAodHlwZW9mIHdpbmRvdy5jb21wb25lbnRfZmFjdG9yeSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHdpbmRvdy5jb21wb25lbnRfZmFjdG9yeSA9IHt9O1xufVxuXG53aW5kb3cuY29tcG9uZW50X2ZhY3Rvcnkuc2hvcnRhbnN3ZXIgPSBmdW5jdGlvbiAob3B0cykge1xuICAgIGlmIChvcHRzLnRpbWVkKSB7XG4gICAgICAgIHJldHVybiBuZXcgVGltZWRTaG9ydEFuc3dlcihvcHRzKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBTaG9ydEFuc3dlcihvcHRzKTtcbn07XG4iLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=