"use strict";
(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_selectquestion_js_selectone_js"],{

/***/ 4445:
/*!*********************************************************!*\
  !*** ./runestone/selectquestion/css/selectquestion.css ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 10662:
/*!**************************************************!*\
  !*** ./runestone/selectquestion/js/selectone.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SelectOne)
/* harmony export */ });
/* harmony import */ var _common_js_renderComponent_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/renderComponent.js */ 98098);
/* harmony import */ var _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../common/js/runestonebase.js */ 78673);
/* harmony import */ var _common_js_domutil_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../common/js/domutil.js */ 34089);
/* harmony import */ var _css_selectquestion_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../css/selectquestion.css */ 4445);
/**
 * *******************************
 * |docname| - SelectOne Component
 * *******************************
 */





class SelectOne extends _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_1__["default"] {
    /**
     * constructor --
     * Making an instance of a selectone is a bit more complicated because it is
     * a kind of meta directive.  That is, go to the server and randomly select
     * a question to display in this spot.  Or, if a student has already seen this question
     * in the context of an exam retrieve the question they saw in the first place.
     * Making an API call and waiting for the response is handled asynchronously.
     * But lots of code is not written with that assumption.  So we do the initialization in
     * two parts.
     * 1. Create the object with the usual constructor
     * 2. call initialize, which returns a promise.  When that promise is resolved
     * the "replacement" component will replace the original selectone component in the DOM.
     *
     * @param  {} opts
     */
    constructor(opts) {
        super(opts);
        this.origOpts = opts;
        this.questions = (0,_common_js_domutil_js__WEBPACK_IMPORTED_MODULE_2__.getDataValue)(opts.orig, "questionlist");
        this.proficiency = (0,_common_js_domutil_js__WEBPACK_IMPORTED_MODULE_2__.getDataValue)(opts.orig, "proficiency");
        this.minDifficulty = (0,_common_js_domutil_js__WEBPACK_IMPORTED_MODULE_2__.getDataValue)(opts.orig, "min-difficulty");
        this.maxDifficulty = (0,_common_js_domutil_js__WEBPACK_IMPORTED_MODULE_2__.getDataValue)(opts.orig, "max-difficulty");
        this.points = (0,_common_js_domutil_js__WEBPACK_IMPORTED_MODULE_2__.getDataValue)(opts.orig, "points");
        this.autogradable = (0,_common_js_domutil_js__WEBPACK_IMPORTED_MODULE_2__.getDataValue)(opts.orig, "autogradable");
        this.not_seen_ever = (0,_common_js_domutil_js__WEBPACK_IMPORTED_MODULE_2__.getDataValue)(opts.orig, "not_seen_ever");
        this.selector_id = opts.orig.getAttribute("id");
        // RunestoneBase does not set divid; subclasses do. Without this the base
        // class builds element ids like "undefined_message". See issue #1393.
        this.divid = this.selector_id;
        this.primaryOnly = (0,_common_js_domutil_js__WEBPACK_IMPORTED_MODULE_2__.getDataValue)(opts.orig, "primary");
        this.ABExperiment = (0,_common_js_domutil_js__WEBPACK_IMPORTED_MODULE_2__.getDataValue)(opts.orig, "ab");
        this.toggleOptions = (0,_common_js_domutil_js__WEBPACK_IMPORTED_MODULE_2__.getDataValue)(opts.orig, "toggleoptions");
        this.toggleLabels = (0,_common_js_domutil_js__WEBPACK_IMPORTED_MODULE_2__.getDataValue)(opts.orig, "togglelabels");
        this.limitBaseCourse = (0,_common_js_domutil_js__WEBPACK_IMPORTED_MODULE_2__.getDataValue)(opts.orig, "limit-basecourse");
        opts.orig.id = this.selector_id;
    }
    /**
     * initialize --
     * initialize is used so that the constructor does not have to be async.
     * Constructors should definitely not return promises that would seriously
     * mess things up.
     * @return {Promise} Will resolve after component from DB is reified
     */
    async initialize() {
        let self = this;
        let data = { selector_id: this.selector_id };
        if (this.questions) {
            data.questions = this.questions;
        } else if (this.proficiency) {
            data.proficiency = this.proficiency;
        }
        if (this.minDifficulty) {
            data.minDifficulty = this.minDifficulty;
        }
        if (this.maxDifficulty) {
            data.maxDifficulty = this.maxDifficulty;
        }
        if (this.points) {
            data.points = this.points;
        }
        if (this.autogradable) {
            data.autogradable = this.autogradable;
        }
        if (this.not_seen_ever) {
            data.not_seen_ever = this.not_seen_ever;
        }
        if (this.primaryOnly) {
            data.primary = this.primaryOnly;
        }
        if (this.ABExperiment) {
            data.AB = this.ABExperiment;
        }
        if (this.timedWrapper) {
            data.timedWrapper = this.timedWrapper;
        }
        if (this.toggleOptions) {
            data.toggleOptions = this.toggleOptions;
        }
        if (this.toggleLabels) {
            data.toggleLabels = this.toggleLabels;
        }
        if (this.limitBaseCourse) {
            data.limitBaseCourse = eBookConfig.basecourse;
        }
        let opts = this.origOpts;
        let selectorId = this.selector_id;
        console.log("getting question source");
        let request = new Request(
            `${eBookConfig.new_server_prefix}/assessment/get_question_source`,
            {
                method: "POST",
                headers: this.jsonHeaders,
                body: JSON.stringify(data),
            },
        );
        let response = await fetch(request);
        let htmlsrc = await response.json();
        htmlsrc = htmlsrc.detail;
        if (htmlsrc.indexOf("No preview") >= 0) {
            alert(
                `Error: Not able to find a question for ${selectorId} based on the criteria`,
            );
            throw new Error(`Unable to find a question for ${selectorId}`);
        }
        let res;
        if (opts.timed) {
            // timed components are not rendered immediately, only when the student
            // starts the assessment and visits this particular entry.
            res = (0,_common_js_renderComponent_js__WEBPACK_IMPORTED_MODULE_0__.createTimedComponent)(htmlsrc, {
                timed: true,
                selector_id: selectorId,
                assessmentTaken: opts.assessmentTaken,
            });
            // replace the entry in the timed assessment's list of components
            // with the component created by createTimedComponent
            for (let component of opts.rqa) {
                if (component.question == self) {
                    component.question = res.question;
                    break;
                }
            }
            self.realComponent = res.question;
            self.containerDiv = res.question.containerDiv;
            self.realComponent.selectorId = selectorId;
        } else {
            if (data.toggleOptions) {
                var toggleLabels = data.toggleLabels;
                if (toggleLabels) {
                    toggleLabels = toggleLabels
                        .replace("togglelabels:", "")
                        .trim();
                    toggleLabels = toggleLabels.split(",");
                    for (var t = 0; t < toggleLabels.length; t++) {
                        toggleLabels[t] = toggleLabels[t].trim();
                    }
                }
                var toggleQuestions = this.questions.split(", ");
                var toggleUI = "";
                // check so that only the first toggle select question on the assignments page has a preview panel created, then all toggle select previews use this same panel
                if (!document.getElementById("component-preview")) {
                    toggleUI +=
                        '<div id="component-preview" class="col-md-6 toggle-preview" style="z-index: 999;">' +
                        '<div id="toggle-buttons"></div>' +
                        '<div id="toggle-preview"></div>' +
                        "</div>";
                }
                // dropdown menu containing the question options
                toggleUI +=
                    '<label for="' +
                    selectorId +
                    '-toggleQuestion" style="margin-left: 10px">Toggle Question:</label><select id="' +
                    selectorId +
                    '-toggleQuestion">';
                var i;
                var toggleQuestionHTMLSrc;
                var toggleQuestionSubstring;
                var toggleQuestionType;
                var toggleQuestionTypes = [];
                for (i = 0; i < toggleQuestions.length; i++) {
                    toggleQuestionHTMLSrc = await this.getToggleSrc(
                        toggleQuestions[i],
                    );
                    toggleQuestionSubstring =
                        toggleQuestionHTMLSrc.split('data-component="')[1];
                    switch (
                        toggleQuestionSubstring.slice(
                            0,
                            toggleQuestionSubstring.indexOf('"'),
                        )
                    ) {
                        case "activecode":
                            toggleQuestionType = "Active Write Code";
                            break;
                        case "clickablearea":
                            toggleQuestionType = "Clickable Area";
                            break;
                        case "dragndrop":
                            toggleQuestionType = "Drag n Drop";
                            break;
                        case "fillintheblank":
                            toggleQuestionType = "Fill in the Blank";
                            break;
                        case "multiplechoice":
                            toggleQuestionType = "Multiple Choice";
                            break;
                        case "parsons":
                            toggleQuestionType = "Parsons Mixed-Up Code";
                            break;
                        case "shortanswer":
                            toggleQuestionType = "Short Answer";
                            break;
                    }
                    toggleQuestionTypes[i] = toggleQuestionType;
                    toggleUI += '<option value="' + toggleQuestions[i] + '">';
                    if (toggleLabels) {
                        if (toggleLabels[i]) {
                            toggleUI += toggleLabels[i];
                        } else {
                            toggleUI +=
                                toggleQuestionType + " - " + toggleQuestions[i];
                        }
                    } else {
                        toggleUI +=
                            toggleQuestionType + " - " + toggleQuestions[i];
                    }
                    if (i == 0 && data.toggleOptions.includes("lock")) {
                        toggleUI += " (only this question will be graded)";
                    }
                    toggleUI += "</option>";
                }
                toggleUI +=
                    '</select><div id="' +
                    selectorId +
                    '-toggleSelectedQuestion">';
                var toggleFirstID = htmlsrc.split('id="')[1];
                toggleFirstID = toggleFirstID.split('"')[0];
                htmlsrc = toggleUI + htmlsrc + "</div>";
            }
            // just render this component on the page in its usual place
            await (0,_common_js_renderComponent_js__WEBPACK_IMPORTED_MODULE_0__.renderRunestoneComponent)(htmlsrc, selectorId, {
                selector_id: selectorId,
                is_toggle: this.toggleOptions,
                is_select: true,
                useRunestoneServices: true,
            });
            if (data.toggleOptions) {
                hideElement(document.getElementById("component-preview"));
                var toggleQuestionSelect = document.getElementById(
                    selectorId + "-toggleQuestion",
                );
                for (i = 0; i < toggleQuestionSelect.options.length; i++) {
                    if (
                        toggleQuestionSelect.options[i].value == toggleFirstID
                    ) {
                        toggleQuestionSelect.value = toggleFirstID;
                        let selectorElement =
                            document.getElementById(selectorId);
                        selectorElement.dataset.toggleCurrent = toggleFirstID;
                        selectorElement.dataset.toggleCurrentType =
                            toggleQuestionTypes[0];
                        break;
                    }
                }
                toggleQuestionSelect.addEventListener(
                    "change",
                    async function () {
                        await this.togglePreview(
                            toggleQuestionSelect.parentElement.id,
                            data.toggleOptions,
                            toggleQuestionTypes,
                        );
                        this.logBookEvent({
                            event: "view_toggle",
                            act: toggleQuestionSelect.value,
                            div_id: toggleQuestionSelect.parentElement.id,
                        });
                    }.bind(this),
                );
            }
        }
        return response;
    }

    // retrieve html source of a question, for use in various toggle functionalities
    async getToggleSrc(toggleQuestionID) {
        let request = new Request(
            `${eBookConfig.new_server_prefix}/assessment/htmlsrc?acid=${toggleQuestionID}`,
            {
                method: "GET",
            },
        );
        let response = await fetch(request);
        let data = await response.json();
        let htmlsrc = data.detail;
        return htmlsrc;
    }

    // on changing the value of toggle select dropdown, render selected question in preview panel, add appropriate buttons, then make preview panel visible
    async togglePreview(parentID, toggleOptions, toggleQuestionTypes) {
        const toggleButtons = document.getElementById("toggle-buttons");
        toggleButtons.innerHTML = "";
        var parentDiv = document.getElementById(parentID);
        var toggleQuestionSelect = parentDiv.getElementsByTagName("select")[0];
        var selectedQuestion =
            toggleQuestionSelect.options[toggleQuestionSelect.selectedIndex]
                .value;
        var htmlsrc = await this.getToggleSrc(selectedQuestion);
        (0,_common_js_renderComponent_js__WEBPACK_IMPORTED_MODULE_0__.renderRunestoneComponent)(htmlsrc, "toggle-preview", {
            selector_id: "toggle-preview",
            is_toggle: this.toggleOptions,
            is_select: true,
            useRunestoneServices: true,
        });

        // add "Close Preview" button to the preview panel
        let closeButton = document.createElement("button");
        closeButton.textContent = "Close Preview";
        closeButton.classList.add("btn", "btn-default");
        closeButton.addEventListener(
            "click",
            function () {
                document.getElementById("toggle-preview").innerHTML = "";
                toggleQuestionSelect.value =
                    document.getElementById(parentID).dataset.toggleCurrent;
                hideElement(document.getElementById("component-preview"));
                this.logBookEvent({
                    event: "close_toggle",
                    act: toggleQuestionSelect.value,
                    div_id: toggleQuestionSelect.parentElement.id,
                });
            }.bind(this),
        );
        toggleButtons.appendChild(closeButton);

        // if "lock" is not in toggle options, then allow adding more buttons to the preview panel
        if (!toggleOptions.includes("lock")) {
            let setButton = document.createElement("button");
            setButton.textContent = "Select this Problem";
            setButton.classList.add("btn", "btn-primary");
            setButton.addEventListener(
                "click",
                async function () {
                    await this.toggleSet(
                        parentID,
                        selectedQuestion,
                        htmlsrc,
                        toggleQuestionTypes,
                    );
                    hideElement(document.getElementById("component-preview"));
                    this.logBookEvent({
                        event: "select_toggle",
                        act: selectedQuestion,
                        div_id: parentID,
                    });
                }.bind(this),
            );
            toggleButtons.appendChild(setButton);

            // if "transfer" in toggle options, and if current question type is Parsons and selected question type is active code, then add "Transfer" button to preview panel
            if (toggleOptions.includes("transfer")) {
                var currentType =
                    document.getElementById(parentID).dataset.toggleCurrentType;
                var selectedType =
                    toggleQuestionTypes[toggleQuestionSelect.selectedIndex];
                if (
                    currentType == "Parsons Mixed-Up Code" &&
                    selectedType == "Active Write Code"
                ) {
                    let transferButton = document.createElement("button");
                    transferButton.textContent = "Transfer Response";
                    transferButton.classList.add("btn", "btn-primary");
                    transferButton.addEventListener(
                        "click",
                        async function () {
                            await this.toggleTransfer(
                                parentID,
                                selectedQuestion,
                                htmlsrc,
                                toggleQuestionTypes,
                            );
                        }.bind(this),
                    );
                    toggleButtons.appendChild(transferButton);
                }
            }
        }

        showElement(document.getElementById("component-preview"));
    }

    // on clicking "Select this Problem" button, close preview panel, replace current question in assignments page with selected question, and send request to update grading database
    // _ `toggleSet`
    async toggleSet(parentID, selectedQuestion, htmlsrc, toggleQuestionTypes) {
        var selectorId = parentID + "-toggleSelectedQuestion";
        var toggleQuestionSelect = document
            .getElementById(parentID)
            .getElementsByTagName("select")[0];
        document.getElementById(selectorId).innerHTML = ""; // need to check whether this is even necessary
        // Tear the preview down first: it holds a copy of the question we are
        // about to render, and two live copies of the same divid at once
        // confuse components that look their pieces up by id.
        document.getElementById("toggle-preview").innerHTML = "";
        await (0,_common_js_renderComponent_js__WEBPACK_IMPORTED_MODULE_0__.renderRunestoneComponent)(htmlsrc, selectorId, {
            selector_id: selectorId,
            is_toggle: this.toggleOptions,
            is_select: true,
            useRunestoneServices: true,
        });
        let request = new Request(
            `${eBookConfig.new_server_prefix}/assessment/set_selected_question?metaid=${parentID}&selected=${selectedQuestion}`,
            {},
        );
        await fetch(request);
        let parentDiv = document.getElementById(parentID);
        parentDiv.dataset.toggleCurrent = selectedQuestion;
        parentDiv.dataset.toggleCurrentType =
            toggleQuestionTypes[toggleQuestionSelect.selectedIndex];
    }

    // on clicking "Transfer" button, extract the current text and indentation of the Parsons blocks in the answer space, then paste that into the selected active code question
    async toggleTransfer(
        parentID,
        selectedQuestion,
        htmlsrc,
        toggleQuestionTypes,
    ) {
        // retrieve all Parsons lines within the answer space and loop through this list
        var currentParsons = document
            .getElementById(parentID + "-toggleSelectedQuestion")
            .querySelectorAll("div[class^='answer']")[0]
            .getElementsByClassName("prettyprint lang-py");
        var currentParsonsClass;
        var currentBlockIndent;
        var indentCount;
        var indent;
        var parsonsLine;
        var parsonsLines = ``;
        var count;
        for (var p = 0; p < currentParsons.length; p++) {
            indentCount = 0;
            indent = "";
            // for Parsons blocks that have built-in indentation in their lines
            currentParsonsClass = currentParsons[p].classList[2];
            if (currentParsonsClass) {
                if (currentParsonsClass.includes("indent")) {
                    indentCount =
                        parseInt(indentCount) +
                        parseInt(
                            currentParsonsClass.slice(
                                6,
                                currentParsonsClass.length,
                            ),
                        );
                }
            }
            // for Parsons answer spaces with vertical lines that allow student to define their own line indentation
            currentBlockIndent =
                currentParsons[p].parentElement.parentElement.style.left;
            if (currentBlockIndent) {
                indentCount =
                    parseInt(indentCount) +
                    parseInt(
                        currentBlockIndent.slice(
                            0,
                            currentBlockIndent.indexOf("px"),
                        ) / 30,
                    );
            }
            for (var d = 0; d < indentCount; d++) {
                indent += "    ";
            }
            // retrieve each text snippet of each Parsons line and loop through this list
            parsonsLine = currentParsons[p].getElementsByTagName("span");
            count = 0;
            for (var l = 0; l < parsonsLine.length; l++) {
                if (parsonsLine[l].childNodes[0].nodeName == "#text") {
                    // Parsons blocks have differing amounts of hierarchy levels (spans within spans)
                    if (p == 0 && count == 0) {
                        // need different check than l == 0 because the l numbering doesn't align with location within line due to inconsistent span heirarchy
                        parsonsLines += indent + parsonsLine[l].innerHTML;
                        count++;
                    } else if (count != 0) {
                        parsonsLines += parsonsLine[l].innerHTML;
                        count++;
                    } else {
                        parsonsLines =
                            parsonsLines +
                            `
                            ` +
                            indent +
                            parsonsLine[l].innerHTML;
                        parsonsLines = parsonsLines.replace(
                            "                            ",
                            "",
                        );
                        count++;
                    }
                }
            }
        }
        // replace all existing code within selected active code question with extracted Parsons text
        var htmlsrcFormer = htmlsrc.slice(
            0,
            htmlsrc.indexOf("<textarea") +
                htmlsrc.split("<textarea")[1].indexOf(">") +
                10,
        );
        var htmlsrcLatter = htmlsrc.slice(
            htmlsrc.indexOf("</textarea>"),
            htmlsrc.length,
        );
        htmlsrc = htmlsrcFormer + parsonsLines + htmlsrcLatter;

        await this.toggleSet(
            parentID,
            selectedQuestion,
            htmlsrc,
            toggleQuestionTypes,
        );
        hideElement(document.getElementById("component-preview"));
    }
}

// The preview panel is shared by all toggle questions on a page and may not
// exist yet when hidden/shown.
function hideElement(element) {
    if (element) {
        element.style.display = "none";
    }
}

function showElement(element) {
    if (element) {
        element.style.display = "";
    }
}

if (typeof window.component_factory === "undefined") {
    window.component_factory = {};
}

window.component_factory.selectquestion = function (opts) {
    return new SelectOne(opts);
};

/*
 * When the page is loaded and the login checks are complete find and render
 * each selectquestion component that is not part of a timedAssessment.
 **/
document.addEventListener("runestone:login-complete", async function () {
    let selQuestions = document.querySelectorAll(
        "[data-component=selectquestion]",
    );
    for (let cq of selQuestions) {
        try {
            if (!cq.closest("[data-component=timedAssessment]")) {
                // If this element exists within a timed component, don't render it here
                let tmp = new SelectOne({ orig: cq });
                await tmp.initialize();
            }
        } catch (err) {
            console.log(`Error rendering New Exercise ${cq.id}
                         Details: ${err}`);
            console.log(err.stack);
        }
    }
});


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuZXN0b25lX3NlbGVjdHF1ZXN0aW9uX2pzX3NlbGVjdG9uZV9qcy5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSTRDO0FBQ2lCO0FBQ0g7QUFDdkI7O0FBRXBCLHdCQUF3QixtRUFBYTtBQUNwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QixtRUFBWTtBQUNyQywyQkFBMkIsbUVBQVk7QUFDdkMsNkJBQTZCLG1FQUFZO0FBQ3pDLDZCQUE2QixtRUFBWTtBQUN6QyxzQkFBc0IsbUVBQVk7QUFDbEMsNEJBQTRCLG1FQUFZO0FBQ3hDLDZCQUE2QixtRUFBWTtBQUN6QztBQUNBLDZDQUE2QztBQUM3QztBQUNBO0FBQ0EsMkJBQTJCLG1FQUFZO0FBQ3ZDLDRCQUE0QixtRUFBWTtBQUN4Qyw2QkFBNkIsbUVBQVk7QUFDekMsNEJBQTRCLG1FQUFZO0FBQ3hDLCtCQUErQixtRUFBWTtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixTQUFTO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsOEJBQThCO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBEQUEwRCxZQUFZO0FBQ3RFO0FBQ0EsNkRBQTZELFdBQVc7QUFDeEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixtRkFBb0I7QUFDdEM7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0MseUJBQXlCO0FBQzdEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5R0FBeUc7QUFDekc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsNEJBQTRCO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEI7QUFDMUI7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsdUZBQXdCO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIseUNBQXlDO0FBQ3JFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6QixxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLDhCQUE4QiwyQkFBMkIsaUJBQWlCO0FBQ3pGO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUSx1RkFBd0I7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQixhQUFhO0FBQ2I7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQixpQkFBaUI7QUFDakI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0REFBNEQ7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjLHVGQUF3QjtBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLGVBQWUsOEJBQThCLDJDQUEyQyxTQUFTLFlBQVksaUJBQWlCO0FBQzlILGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QiwyQkFBMkI7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QixpQkFBaUI7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0Qix3QkFBd0I7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCO0FBQ3RCO0FBQ0E7QUFDQSxzQkFBc0I7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMENBQTBDLFVBQVU7QUFDcEQ7QUFDQTtBQUNBLFVBQVU7QUFDVix3REFBd0Q7QUFDeEQsb0NBQW9DLElBQUk7QUFDeEM7QUFDQTtBQUNBO0FBQ0EsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvc2VsZWN0cXVlc3Rpb24vY3NzL3NlbGVjdHF1ZXN0aW9uLmNzcz9iZWQzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvc2VsZWN0cXVlc3Rpb24vanMvc2VsZWN0b25lLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8qKlxuICogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogfGRvY25hbWV8IC0gU2VsZWN0T25lIENvbXBvbmVudFxuICogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICovXG5pbXBvcnQge1xuICAgIHJlbmRlclJ1bmVzdG9uZUNvbXBvbmVudCxcbiAgICBjcmVhdGVUaW1lZENvbXBvbmVudCxcbn0gZnJvbSBcIi4uLy4uL2NvbW1vbi9qcy9yZW5kZXJDb21wb25lbnQuanNcIjtcbmltcG9ydCBSdW5lc3RvbmVCYXNlIGZyb20gXCIuLi8uLi9jb21tb24vanMvcnVuZXN0b25lYmFzZS5qc1wiO1xuaW1wb3J0IHsgZ2V0RGF0YVZhbHVlIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9qcy9kb211dGlsLmpzXCI7XG5pbXBvcnQgXCIuLi9jc3Mvc2VsZWN0cXVlc3Rpb24uY3NzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlbGVjdE9uZSBleHRlbmRzIFJ1bmVzdG9uZUJhc2Uge1xuICAgIC8qKlxuICAgICAqIGNvbnN0cnVjdG9yIC0tXG4gICAgICogTWFraW5nIGFuIGluc3RhbmNlIG9mIGEgc2VsZWN0b25lIGlzIGEgYml0IG1vcmUgY29tcGxpY2F0ZWQgYmVjYXVzZSBpdCBpc1xuICAgICAqIGEga2luZCBvZiBtZXRhIGRpcmVjdGl2ZS4gIFRoYXQgaXMsIGdvIHRvIHRoZSBzZXJ2ZXIgYW5kIHJhbmRvbWx5IHNlbGVjdFxuICAgICAqIGEgcXVlc3Rpb24gdG8gZGlzcGxheSBpbiB0aGlzIHNwb3QuICBPciwgaWYgYSBzdHVkZW50IGhhcyBhbHJlYWR5IHNlZW4gdGhpcyBxdWVzdGlvblxuICAgICAqIGluIHRoZSBjb250ZXh0IG9mIGFuIGV4YW0gcmV0cmlldmUgdGhlIHF1ZXN0aW9uIHRoZXkgc2F3IGluIHRoZSBmaXJzdCBwbGFjZS5cbiAgICAgKiBNYWtpbmcgYW4gQVBJIGNhbGwgYW5kIHdhaXRpbmcgZm9yIHRoZSByZXNwb25zZSBpcyBoYW5kbGVkIGFzeW5jaHJvbm91c2x5LlxuICAgICAqIEJ1dCBsb3RzIG9mIGNvZGUgaXMgbm90IHdyaXR0ZW4gd2l0aCB0aGF0IGFzc3VtcHRpb24uICBTbyB3ZSBkbyB0aGUgaW5pdGlhbGl6YXRpb24gaW5cbiAgICAgKiB0d28gcGFydHMuXG4gICAgICogMS4gQ3JlYXRlIHRoZSBvYmplY3Qgd2l0aCB0aGUgdXN1YWwgY29uc3RydWN0b3JcbiAgICAgKiAyLiBjYWxsIGluaXRpYWxpemUsIHdoaWNoIHJldHVybnMgYSBwcm9taXNlLiAgV2hlbiB0aGF0IHByb21pc2UgaXMgcmVzb2x2ZWRcbiAgICAgKiB0aGUgXCJyZXBsYWNlbWVudFwiIGNvbXBvbmVudCB3aWxsIHJlcGxhY2UgdGhlIG9yaWdpbmFsIHNlbGVjdG9uZSBjb21wb25lbnQgaW4gdGhlIERPTS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSAge30gb3B0c1xuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKG9wdHMpIHtcbiAgICAgICAgc3VwZXIob3B0cyk7XG4gICAgICAgIHRoaXMub3JpZ09wdHMgPSBvcHRzO1xuICAgICAgICB0aGlzLnF1ZXN0aW9ucyA9IGdldERhdGFWYWx1ZShvcHRzLm9yaWcsIFwicXVlc3Rpb25saXN0XCIpO1xuICAgICAgICB0aGlzLnByb2ZpY2llbmN5ID0gZ2V0RGF0YVZhbHVlKG9wdHMub3JpZywgXCJwcm9maWNpZW5jeVwiKTtcbiAgICAgICAgdGhpcy5taW5EaWZmaWN1bHR5ID0gZ2V0RGF0YVZhbHVlKG9wdHMub3JpZywgXCJtaW4tZGlmZmljdWx0eVwiKTtcbiAgICAgICAgdGhpcy5tYXhEaWZmaWN1bHR5ID0gZ2V0RGF0YVZhbHVlKG9wdHMub3JpZywgXCJtYXgtZGlmZmljdWx0eVwiKTtcbiAgICAgICAgdGhpcy5wb2ludHMgPSBnZXREYXRhVmFsdWUob3B0cy5vcmlnLCBcInBvaW50c1wiKTtcbiAgICAgICAgdGhpcy5hdXRvZ3JhZGFibGUgPSBnZXREYXRhVmFsdWUob3B0cy5vcmlnLCBcImF1dG9ncmFkYWJsZVwiKTtcbiAgICAgICAgdGhpcy5ub3Rfc2Vlbl9ldmVyID0gZ2V0RGF0YVZhbHVlKG9wdHMub3JpZywgXCJub3Rfc2Vlbl9ldmVyXCIpO1xuICAgICAgICB0aGlzLnNlbGVjdG9yX2lkID0gb3B0cy5vcmlnLmdldEF0dHJpYnV0ZShcImlkXCIpO1xuICAgICAgICAvLyBSdW5lc3RvbmVCYXNlIGRvZXMgbm90IHNldCBkaXZpZDsgc3ViY2xhc3NlcyBkby4gV2l0aG91dCB0aGlzIHRoZSBiYXNlXG4gICAgICAgIC8vIGNsYXNzIGJ1aWxkcyBlbGVtZW50IGlkcyBsaWtlIFwidW5kZWZpbmVkX21lc3NhZ2VcIi4gU2VlIGlzc3VlICMxMzkzLlxuICAgICAgICB0aGlzLmRpdmlkID0gdGhpcy5zZWxlY3Rvcl9pZDtcbiAgICAgICAgdGhpcy5wcmltYXJ5T25seSA9IGdldERhdGFWYWx1ZShvcHRzLm9yaWcsIFwicHJpbWFyeVwiKTtcbiAgICAgICAgdGhpcy5BQkV4cGVyaW1lbnQgPSBnZXREYXRhVmFsdWUob3B0cy5vcmlnLCBcImFiXCIpO1xuICAgICAgICB0aGlzLnRvZ2dsZU9wdGlvbnMgPSBnZXREYXRhVmFsdWUob3B0cy5vcmlnLCBcInRvZ2dsZW9wdGlvbnNcIik7XG4gICAgICAgIHRoaXMudG9nZ2xlTGFiZWxzID0gZ2V0RGF0YVZhbHVlKG9wdHMub3JpZywgXCJ0b2dnbGVsYWJlbHNcIik7XG4gICAgICAgIHRoaXMubGltaXRCYXNlQ291cnNlID0gZ2V0RGF0YVZhbHVlKG9wdHMub3JpZywgXCJsaW1pdC1iYXNlY291cnNlXCIpO1xuICAgICAgICBvcHRzLm9yaWcuaWQgPSB0aGlzLnNlbGVjdG9yX2lkO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBpbml0aWFsaXplIC0tXG4gICAgICogaW5pdGlhbGl6ZSBpcyB1c2VkIHNvIHRoYXQgdGhlIGNvbnN0cnVjdG9yIGRvZXMgbm90IGhhdmUgdG8gYmUgYXN5bmMuXG4gICAgICogQ29uc3RydWN0b3JzIHNob3VsZCBkZWZpbml0ZWx5IG5vdCByZXR1cm4gcHJvbWlzZXMgdGhhdCB3b3VsZCBzZXJpb3VzbHlcbiAgICAgKiBtZXNzIHRoaW5ncyB1cC5cbiAgICAgKiBAcmV0dXJuIHtQcm9taXNlfSBXaWxsIHJlc29sdmUgYWZ0ZXIgY29tcG9uZW50IGZyb20gREIgaXMgcmVpZmllZFxuICAgICAqL1xuICAgIGFzeW5jIGluaXRpYWxpemUoKSB7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgbGV0IGRhdGEgPSB7IHNlbGVjdG9yX2lkOiB0aGlzLnNlbGVjdG9yX2lkIH07XG4gICAgICAgIGlmICh0aGlzLnF1ZXN0aW9ucykge1xuICAgICAgICAgICAgZGF0YS5xdWVzdGlvbnMgPSB0aGlzLnF1ZXN0aW9ucztcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnByb2ZpY2llbmN5KSB7XG4gICAgICAgICAgICBkYXRhLnByb2ZpY2llbmN5ID0gdGhpcy5wcm9maWNpZW5jeTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5taW5EaWZmaWN1bHR5KSB7XG4gICAgICAgICAgICBkYXRhLm1pbkRpZmZpY3VsdHkgPSB0aGlzLm1pbkRpZmZpY3VsdHk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMubWF4RGlmZmljdWx0eSkge1xuICAgICAgICAgICAgZGF0YS5tYXhEaWZmaWN1bHR5ID0gdGhpcy5tYXhEaWZmaWN1bHR5O1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnBvaW50cykge1xuICAgICAgICAgICAgZGF0YS5wb2ludHMgPSB0aGlzLnBvaW50cztcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5hdXRvZ3JhZGFibGUpIHtcbiAgICAgICAgICAgIGRhdGEuYXV0b2dyYWRhYmxlID0gdGhpcy5hdXRvZ3JhZGFibGU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMubm90X3NlZW5fZXZlcikge1xuICAgICAgICAgICAgZGF0YS5ub3Rfc2Vlbl9ldmVyID0gdGhpcy5ub3Rfc2Vlbl9ldmVyO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnByaW1hcnlPbmx5KSB7XG4gICAgICAgICAgICBkYXRhLnByaW1hcnkgPSB0aGlzLnByaW1hcnlPbmx5O1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLkFCRXhwZXJpbWVudCkge1xuICAgICAgICAgICAgZGF0YS5BQiA9IHRoaXMuQUJFeHBlcmltZW50O1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnRpbWVkV3JhcHBlcikge1xuICAgICAgICAgICAgZGF0YS50aW1lZFdyYXBwZXIgPSB0aGlzLnRpbWVkV3JhcHBlcjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy50b2dnbGVPcHRpb25zKSB7XG4gICAgICAgICAgICBkYXRhLnRvZ2dsZU9wdGlvbnMgPSB0aGlzLnRvZ2dsZU9wdGlvbnM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMudG9nZ2xlTGFiZWxzKSB7XG4gICAgICAgICAgICBkYXRhLnRvZ2dsZUxhYmVscyA9IHRoaXMudG9nZ2xlTGFiZWxzO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmxpbWl0QmFzZUNvdXJzZSkge1xuICAgICAgICAgICAgZGF0YS5saW1pdEJhc2VDb3Vyc2UgPSBlQm9va0NvbmZpZy5iYXNlY291cnNlO1xuICAgICAgICB9XG4gICAgICAgIGxldCBvcHRzID0gdGhpcy5vcmlnT3B0cztcbiAgICAgICAgbGV0IHNlbGVjdG9ySWQgPSB0aGlzLnNlbGVjdG9yX2lkO1xuICAgICAgICBjb25zb2xlLmxvZyhcImdldHRpbmcgcXVlc3Rpb24gc291cmNlXCIpO1xuICAgICAgICBsZXQgcmVxdWVzdCA9IG5ldyBSZXF1ZXN0KFxuICAgICAgICAgICAgYCR7ZUJvb2tDb25maWcubmV3X3NlcnZlcl9wcmVmaXh9L2Fzc2Vzc21lbnQvZ2V0X3F1ZXN0aW9uX3NvdXJjZWAsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB0aGlzLmpzb25IZWFkZXJzLFxuICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGRhdGEpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgKTtcbiAgICAgICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2gocmVxdWVzdCk7XG4gICAgICAgIGxldCBodG1sc3JjID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICBodG1sc3JjID0gaHRtbHNyYy5kZXRhaWw7XG4gICAgICAgIGlmIChodG1sc3JjLmluZGV4T2YoXCJObyBwcmV2aWV3XCIpID49IDApIHtcbiAgICAgICAgICAgIGFsZXJ0KFxuICAgICAgICAgICAgICAgIGBFcnJvcjogTm90IGFibGUgdG8gZmluZCBhIHF1ZXN0aW9uIGZvciAke3NlbGVjdG9ySWR9IGJhc2VkIG9uIHRoZSBjcml0ZXJpYWAsXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmFibGUgdG8gZmluZCBhIHF1ZXN0aW9uIGZvciAke3NlbGVjdG9ySWR9YCk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHJlcztcbiAgICAgICAgaWYgKG9wdHMudGltZWQpIHtcbiAgICAgICAgICAgIC8vIHRpbWVkIGNvbXBvbmVudHMgYXJlIG5vdCByZW5kZXJlZCBpbW1lZGlhdGVseSwgb25seSB3aGVuIHRoZSBzdHVkZW50XG4gICAgICAgICAgICAvLyBzdGFydHMgdGhlIGFzc2Vzc21lbnQgYW5kIHZpc2l0cyB0aGlzIHBhcnRpY3VsYXIgZW50cnkuXG4gICAgICAgICAgICByZXMgPSBjcmVhdGVUaW1lZENvbXBvbmVudChodG1sc3JjLCB7XG4gICAgICAgICAgICAgICAgdGltZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgc2VsZWN0b3JfaWQ6IHNlbGVjdG9ySWQsXG4gICAgICAgICAgICAgICAgYXNzZXNzbWVudFRha2VuOiBvcHRzLmFzc2Vzc21lbnRUYWtlbixcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy8gcmVwbGFjZSB0aGUgZW50cnkgaW4gdGhlIHRpbWVkIGFzc2Vzc21lbnQncyBsaXN0IG9mIGNvbXBvbmVudHNcbiAgICAgICAgICAgIC8vIHdpdGggdGhlIGNvbXBvbmVudCBjcmVhdGVkIGJ5IGNyZWF0ZVRpbWVkQ29tcG9uZW50XG4gICAgICAgICAgICBmb3IgKGxldCBjb21wb25lbnQgb2Ygb3B0cy5ycWEpIHtcbiAgICAgICAgICAgICAgICBpZiAoY29tcG9uZW50LnF1ZXN0aW9uID09IHNlbGYpIHtcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LnF1ZXN0aW9uID0gcmVzLnF1ZXN0aW9uO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZWxmLnJlYWxDb21wb25lbnQgPSByZXMucXVlc3Rpb247XG4gICAgICAgICAgICBzZWxmLmNvbnRhaW5lckRpdiA9IHJlcy5xdWVzdGlvbi5jb250YWluZXJEaXY7XG4gICAgICAgICAgICBzZWxmLnJlYWxDb21wb25lbnQuc2VsZWN0b3JJZCA9IHNlbGVjdG9ySWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoZGF0YS50b2dnbGVPcHRpb25zKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRvZ2dsZUxhYmVscyA9IGRhdGEudG9nZ2xlTGFiZWxzO1xuICAgICAgICAgICAgICAgIGlmICh0b2dnbGVMYWJlbHMpIHtcbiAgICAgICAgICAgICAgICAgICAgdG9nZ2xlTGFiZWxzID0gdG9nZ2xlTGFiZWxzXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZShcInRvZ2dsZWxhYmVsczpcIiwgXCJcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIC50cmltKCk7XG4gICAgICAgICAgICAgICAgICAgIHRvZ2dsZUxhYmVscyA9IHRvZ2dsZUxhYmVscy5zcGxpdChcIixcIik7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHQgPSAwOyB0IDwgdG9nZ2xlTGFiZWxzLmxlbmd0aDsgdCsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b2dnbGVMYWJlbHNbdF0gPSB0b2dnbGVMYWJlbHNbdF0udHJpbSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciB0b2dnbGVRdWVzdGlvbnMgPSB0aGlzLnF1ZXN0aW9ucy5zcGxpdChcIiwgXCIpO1xuICAgICAgICAgICAgICAgIHZhciB0b2dnbGVVSSA9IFwiXCI7XG4gICAgICAgICAgICAgICAgLy8gY2hlY2sgc28gdGhhdCBvbmx5IHRoZSBmaXJzdCB0b2dnbGUgc2VsZWN0IHF1ZXN0aW9uIG9uIHRoZSBhc3NpZ25tZW50cyBwYWdlIGhhcyBhIHByZXZpZXcgcGFuZWwgY3JlYXRlZCwgdGhlbiBhbGwgdG9nZ2xlIHNlbGVjdCBwcmV2aWV3cyB1c2UgdGhpcyBzYW1lIHBhbmVsXG4gICAgICAgICAgICAgICAgaWYgKCFkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbXBvbmVudC1wcmV2aWV3XCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRvZ2dsZVVJICs9XG4gICAgICAgICAgICAgICAgICAgICAgICAnPGRpdiBpZD1cImNvbXBvbmVudC1wcmV2aWV3XCIgY2xhc3M9XCJjb2wtbWQtNiB0b2dnbGUtcHJldmlld1wiIHN0eWxlPVwiei1pbmRleDogOTk5O1wiPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgaWQ9XCJ0b2dnbGUtYnV0dG9uc1wiPjwvZGl2PicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgaWQ9XCJ0b2dnbGUtcHJldmlld1wiPjwvZGl2PicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgXCI8L2Rpdj5cIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gZHJvcGRvd24gbWVudSBjb250YWluaW5nIHRoZSBxdWVzdGlvbiBvcHRpb25zXG4gICAgICAgICAgICAgICAgdG9nZ2xlVUkgKz1cbiAgICAgICAgICAgICAgICAgICAgJzxsYWJlbCBmb3I9XCInICtcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0b3JJZCArXG4gICAgICAgICAgICAgICAgICAgICctdG9nZ2xlUXVlc3Rpb25cIiBzdHlsZT1cIm1hcmdpbi1sZWZ0OiAxMHB4XCI+VG9nZ2xlIFF1ZXN0aW9uOjwvbGFiZWw+PHNlbGVjdCBpZD1cIicgK1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3RvcklkICtcbiAgICAgICAgICAgICAgICAgICAgJy10b2dnbGVRdWVzdGlvblwiPic7XG4gICAgICAgICAgICAgICAgdmFyIGk7XG4gICAgICAgICAgICAgICAgdmFyIHRvZ2dsZVF1ZXN0aW9uSFRNTFNyYztcbiAgICAgICAgICAgICAgICB2YXIgdG9nZ2xlUXVlc3Rpb25TdWJzdHJpbmc7XG4gICAgICAgICAgICAgICAgdmFyIHRvZ2dsZVF1ZXN0aW9uVHlwZTtcbiAgICAgICAgICAgICAgICB2YXIgdG9nZ2xlUXVlc3Rpb25UeXBlcyA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCB0b2dnbGVRdWVzdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdG9nZ2xlUXVlc3Rpb25IVE1MU3JjID0gYXdhaXQgdGhpcy5nZXRUb2dnbGVTcmMoXG4gICAgICAgICAgICAgICAgICAgICAgICB0b2dnbGVRdWVzdGlvbnNbaV0sXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIHRvZ2dsZVF1ZXN0aW9uU3Vic3RyaW5nID1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRvZ2dsZVF1ZXN0aW9uSFRNTFNyYy5zcGxpdCgnZGF0YS1jb21wb25lbnQ9XCInKVsxXTtcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvZ2dsZVF1ZXN0aW9uU3Vic3RyaW5nLnNsaWNlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9nZ2xlUXVlc3Rpb25TdWJzdHJpbmcuaW5kZXhPZignXCInKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiYWN0aXZlY29kZVwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvZ2dsZVF1ZXN0aW9uVHlwZSA9IFwiQWN0aXZlIFdyaXRlIENvZGVcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJjbGlja2FibGVhcmVhXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9nZ2xlUXVlc3Rpb25UeXBlID0gXCJDbGlja2FibGUgQXJlYVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcImRyYWduZHJvcFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvZ2dsZVF1ZXN0aW9uVHlwZSA9IFwiRHJhZyBuIERyb3BcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJmaWxsaW50aGVibGFua1wiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvZ2dsZVF1ZXN0aW9uVHlwZSA9IFwiRmlsbCBpbiB0aGUgQmxhbmtcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJtdWx0aXBsZWNob2ljZVwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvZ2dsZVF1ZXN0aW9uVHlwZSA9IFwiTXVsdGlwbGUgQ2hvaWNlXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwicGFyc29uc1wiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvZ2dsZVF1ZXN0aW9uVHlwZSA9IFwiUGFyc29ucyBNaXhlZC1VcCBDb2RlXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwic2hvcnRhbnN3ZXJcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2dnbGVRdWVzdGlvblR5cGUgPSBcIlNob3J0IEFuc3dlclwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRvZ2dsZVF1ZXN0aW9uVHlwZXNbaV0gPSB0b2dnbGVRdWVzdGlvblR5cGU7XG4gICAgICAgICAgICAgICAgICAgIHRvZ2dsZVVJICs9ICc8b3B0aW9uIHZhbHVlPVwiJyArIHRvZ2dsZVF1ZXN0aW9uc1tpXSArICdcIj4nO1xuICAgICAgICAgICAgICAgICAgICBpZiAodG9nZ2xlTGFiZWxzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodG9nZ2xlTGFiZWxzW2ldKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9nZ2xlVUkgKz0gdG9nZ2xlTGFiZWxzW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2dnbGVVSSArPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2dnbGVRdWVzdGlvblR5cGUgKyBcIiAtIFwiICsgdG9nZ2xlUXVlc3Rpb25zW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9nZ2xlVUkgKz1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2dnbGVRdWVzdGlvblR5cGUgKyBcIiAtIFwiICsgdG9nZ2xlUXVlc3Rpb25zW2ldO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChpID09IDAgJiYgZGF0YS50b2dnbGVPcHRpb25zLmluY2x1ZGVzKFwibG9ja1wiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9nZ2xlVUkgKz0gXCIgKG9ubHkgdGhpcyBxdWVzdGlvbiB3aWxsIGJlIGdyYWRlZClcIjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0b2dnbGVVSSArPSBcIjwvb3B0aW9uPlwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0b2dnbGVVSSArPVxuICAgICAgICAgICAgICAgICAgICAnPC9zZWxlY3Q+PGRpdiBpZD1cIicgK1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3RvcklkICtcbiAgICAgICAgICAgICAgICAgICAgJy10b2dnbGVTZWxlY3RlZFF1ZXN0aW9uXCI+JztcbiAgICAgICAgICAgICAgICB2YXIgdG9nZ2xlRmlyc3RJRCA9IGh0bWxzcmMuc3BsaXQoJ2lkPVwiJylbMV07XG4gICAgICAgICAgICAgICAgdG9nZ2xlRmlyc3RJRCA9IHRvZ2dsZUZpcnN0SUQuc3BsaXQoJ1wiJylbMF07XG4gICAgICAgICAgICAgICAgaHRtbHNyYyA9IHRvZ2dsZVVJICsgaHRtbHNyYyArIFwiPC9kaXY+XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBqdXN0IHJlbmRlciB0aGlzIGNvbXBvbmVudCBvbiB0aGUgcGFnZSBpbiBpdHMgdXN1YWwgcGxhY2VcbiAgICAgICAgICAgIGF3YWl0IHJlbmRlclJ1bmVzdG9uZUNvbXBvbmVudChodG1sc3JjLCBzZWxlY3RvcklkLCB7XG4gICAgICAgICAgICAgICAgc2VsZWN0b3JfaWQ6IHNlbGVjdG9ySWQsXG4gICAgICAgICAgICAgICAgaXNfdG9nZ2xlOiB0aGlzLnRvZ2dsZU9wdGlvbnMsXG4gICAgICAgICAgICAgICAgaXNfc2VsZWN0OiB0cnVlLFxuICAgICAgICAgICAgICAgIHVzZVJ1bmVzdG9uZVNlcnZpY2VzOiB0cnVlLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoZGF0YS50b2dnbGVPcHRpb25zKSB7XG4gICAgICAgICAgICAgICAgaGlkZUVsZW1lbnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb21wb25lbnQtcHJldmlld1wiKSk7XG4gICAgICAgICAgICAgICAgdmFyIHRvZ2dsZVF1ZXN0aW9uU2VsZWN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdG9ySWQgKyBcIi10b2dnbGVRdWVzdGlvblwiLFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHRvZ2dsZVF1ZXN0aW9uU2VsZWN0Lm9wdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgdG9nZ2xlUXVlc3Rpb25TZWxlY3Qub3B0aW9uc1tpXS52YWx1ZSA9PSB0b2dnbGVGaXJzdElEXG4gICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9nZ2xlUXVlc3Rpb25TZWxlY3QudmFsdWUgPSB0b2dnbGVGaXJzdElEO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHNlbGVjdG9yRWxlbWVudCA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoc2VsZWN0b3JJZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RvckVsZW1lbnQuZGF0YXNldC50b2dnbGVDdXJyZW50ID0gdG9nZ2xlRmlyc3RJRDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdG9yRWxlbWVudC5kYXRhc2V0LnRvZ2dsZUN1cnJlbnRUeXBlID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2dnbGVRdWVzdGlvblR5cGVzWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdG9nZ2xlUXVlc3Rpb25TZWxlY3QuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgICAgICAgICAgXCJjaGFuZ2VcIixcbiAgICAgICAgICAgICAgICAgICAgYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy50b2dnbGVQcmV2aWV3KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvZ2dsZVF1ZXN0aW9uU2VsZWN0LnBhcmVudEVsZW1lbnQuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS50b2dnbGVPcHRpb25zLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvZ2dsZVF1ZXN0aW9uVHlwZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2dCb29rRXZlbnQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50OiBcInZpZXdfdG9nZ2xlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0OiB0b2dnbGVRdWVzdGlvblNlbGVjdC52YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXZfaWQ6IHRvZ2dsZVF1ZXN0aW9uU2VsZWN0LnBhcmVudEVsZW1lbnQuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpLFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH1cblxuICAgIC8vIHJldHJpZXZlIGh0bWwgc291cmNlIG9mIGEgcXVlc3Rpb24sIGZvciB1c2UgaW4gdmFyaW91cyB0b2dnbGUgZnVuY3Rpb25hbGl0aWVzXG4gICAgYXN5bmMgZ2V0VG9nZ2xlU3JjKHRvZ2dsZVF1ZXN0aW9uSUQpIHtcbiAgICAgICAgbGV0IHJlcXVlc3QgPSBuZXcgUmVxdWVzdChcbiAgICAgICAgICAgIGAke2VCb29rQ29uZmlnLm5ld19zZXJ2ZXJfcHJlZml4fS9hc3Nlc3NtZW50L2h0bWxzcmM/YWNpZD0ke3RvZ2dsZVF1ZXN0aW9uSUR9YCxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICApO1xuICAgICAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChyZXF1ZXN0KTtcbiAgICAgICAgbGV0IGRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICAgIGxldCBodG1sc3JjID0gZGF0YS5kZXRhaWw7XG4gICAgICAgIHJldHVybiBodG1sc3JjO1xuICAgIH1cblxuICAgIC8vIG9uIGNoYW5naW5nIHRoZSB2YWx1ZSBvZiB0b2dnbGUgc2VsZWN0IGRyb3Bkb3duLCByZW5kZXIgc2VsZWN0ZWQgcXVlc3Rpb24gaW4gcHJldmlldyBwYW5lbCwgYWRkIGFwcHJvcHJpYXRlIGJ1dHRvbnMsIHRoZW4gbWFrZSBwcmV2aWV3IHBhbmVsIHZpc2libGVcbiAgICBhc3luYyB0b2dnbGVQcmV2aWV3KHBhcmVudElELCB0b2dnbGVPcHRpb25zLCB0b2dnbGVRdWVzdGlvblR5cGVzKSB7XG4gICAgICAgIGNvbnN0IHRvZ2dsZUJ1dHRvbnMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRvZ2dsZS1idXR0b25zXCIpO1xuICAgICAgICB0b2dnbGVCdXR0b25zLmlubmVySFRNTCA9IFwiXCI7XG4gICAgICAgIHZhciBwYXJlbnREaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChwYXJlbnRJRCk7XG4gICAgICAgIHZhciB0b2dnbGVRdWVzdGlvblNlbGVjdCA9IHBhcmVudERpdi5nZXRFbGVtZW50c0J5VGFnTmFtZShcInNlbGVjdFwiKVswXTtcbiAgICAgICAgdmFyIHNlbGVjdGVkUXVlc3Rpb24gPVxuICAgICAgICAgICAgdG9nZ2xlUXVlc3Rpb25TZWxlY3Qub3B0aW9uc1t0b2dnbGVRdWVzdGlvblNlbGVjdC5zZWxlY3RlZEluZGV4XVxuICAgICAgICAgICAgICAgIC52YWx1ZTtcbiAgICAgICAgdmFyIGh0bWxzcmMgPSBhd2FpdCB0aGlzLmdldFRvZ2dsZVNyYyhzZWxlY3RlZFF1ZXN0aW9uKTtcbiAgICAgICAgcmVuZGVyUnVuZXN0b25lQ29tcG9uZW50KGh0bWxzcmMsIFwidG9nZ2xlLXByZXZpZXdcIiwge1xuICAgICAgICAgICAgc2VsZWN0b3JfaWQ6IFwidG9nZ2xlLXByZXZpZXdcIixcbiAgICAgICAgICAgIGlzX3RvZ2dsZTogdGhpcy50b2dnbGVPcHRpb25zLFxuICAgICAgICAgICAgaXNfc2VsZWN0OiB0cnVlLFxuICAgICAgICAgICAgdXNlUnVuZXN0b25lU2VydmljZXM6IHRydWUsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGFkZCBcIkNsb3NlIFByZXZpZXdcIiBidXR0b24gdG8gdGhlIHByZXZpZXcgcGFuZWxcbiAgICAgICAgbGV0IGNsb3NlQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICAgICAgY2xvc2VCdXR0b24udGV4dENvbnRlbnQgPSBcIkNsb3NlIFByZXZpZXdcIjtcbiAgICAgICAgY2xvc2VCdXR0b24uY2xhc3NMaXN0LmFkZChcImJ0blwiLCBcImJ0bi1kZWZhdWx0XCIpO1xuICAgICAgICBjbG9zZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgXCJjbGlja1wiLFxuICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidG9nZ2xlLXByZXZpZXdcIikuaW5uZXJIVE1MID0gXCJcIjtcbiAgICAgICAgICAgICAgICB0b2dnbGVRdWVzdGlvblNlbGVjdC52YWx1ZSA9XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHBhcmVudElEKS5kYXRhc2V0LnRvZ2dsZUN1cnJlbnQ7XG4gICAgICAgICAgICAgICAgaGlkZUVsZW1lbnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb21wb25lbnQtcHJldmlld1wiKSk7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2dCb29rRXZlbnQoe1xuICAgICAgICAgICAgICAgICAgICBldmVudDogXCJjbG9zZV90b2dnbGVcIixcbiAgICAgICAgICAgICAgICAgICAgYWN0OiB0b2dnbGVRdWVzdGlvblNlbGVjdC52YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgZGl2X2lkOiB0b2dnbGVRdWVzdGlvblNlbGVjdC5wYXJlbnRFbGVtZW50LmlkLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfS5iaW5kKHRoaXMpLFxuICAgICAgICApO1xuICAgICAgICB0b2dnbGVCdXR0b25zLmFwcGVuZENoaWxkKGNsb3NlQnV0dG9uKTtcblxuICAgICAgICAvLyBpZiBcImxvY2tcIiBpcyBub3QgaW4gdG9nZ2xlIG9wdGlvbnMsIHRoZW4gYWxsb3cgYWRkaW5nIG1vcmUgYnV0dG9ucyB0byB0aGUgcHJldmlldyBwYW5lbFxuICAgICAgICBpZiAoIXRvZ2dsZU9wdGlvbnMuaW5jbHVkZXMoXCJsb2NrXCIpKSB7XG4gICAgICAgICAgICBsZXQgc2V0QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICAgICAgICAgIHNldEJ1dHRvbi50ZXh0Q29udGVudCA9IFwiU2VsZWN0IHRoaXMgUHJvYmxlbVwiO1xuICAgICAgICAgICAgc2V0QnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJidG5cIiwgXCJidG4tcHJpbWFyeVwiKTtcbiAgICAgICAgICAgIHNldEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgICAgIFwiY2xpY2tcIixcbiAgICAgICAgICAgICAgICBhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMudG9nZ2xlU2V0KFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50SUQsXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZFF1ZXN0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgaHRtbHNyYyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvZ2dsZVF1ZXN0aW9uVHlwZXMsXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIGhpZGVFbGVtZW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29tcG9uZW50LXByZXZpZXdcIikpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZ0Jvb2tFdmVudCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudDogXCJzZWxlY3RfdG9nZ2xlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBhY3Q6IHNlbGVjdGVkUXVlc3Rpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXZfaWQ6IHBhcmVudElELFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LmJpbmQodGhpcyksXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgdG9nZ2xlQnV0dG9ucy5hcHBlbmRDaGlsZChzZXRCdXR0b24pO1xuXG4gICAgICAgICAgICAvLyBpZiBcInRyYW5zZmVyXCIgaW4gdG9nZ2xlIG9wdGlvbnMsIGFuZCBpZiBjdXJyZW50IHF1ZXN0aW9uIHR5cGUgaXMgUGFyc29ucyBhbmQgc2VsZWN0ZWQgcXVlc3Rpb24gdHlwZSBpcyBhY3RpdmUgY29kZSwgdGhlbiBhZGQgXCJUcmFuc2ZlclwiIGJ1dHRvbiB0byBwcmV2aWV3IHBhbmVsXG4gICAgICAgICAgICBpZiAodG9nZ2xlT3B0aW9ucy5pbmNsdWRlcyhcInRyYW5zZmVyXCIpKSB7XG4gICAgICAgICAgICAgICAgdmFyIGN1cnJlbnRUeXBlID1cbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocGFyZW50SUQpLmRhdGFzZXQudG9nZ2xlQ3VycmVudFR5cGU7XG4gICAgICAgICAgICAgICAgdmFyIHNlbGVjdGVkVHlwZSA9XG4gICAgICAgICAgICAgICAgICAgIHRvZ2dsZVF1ZXN0aW9uVHlwZXNbdG9nZ2xlUXVlc3Rpb25TZWxlY3Quc2VsZWN0ZWRJbmRleF07XG4gICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50VHlwZSA9PSBcIlBhcnNvbnMgTWl4ZWQtVXAgQ29kZVwiICYmXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkVHlwZSA9PSBcIkFjdGl2ZSBXcml0ZSBDb2RlXCJcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRyYW5zZmVyQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNmZXJCdXR0b24udGV4dENvbnRlbnQgPSBcIlRyYW5zZmVyIFJlc3BvbnNlXCI7XG4gICAgICAgICAgICAgICAgICAgIHRyYW5zZmVyQnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJidG5cIiwgXCJidG4tcHJpbWFyeVwiKTtcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNmZXJCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xpY2tcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnRvZ2dsZVRyYW5zZmVyKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnRJRCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRRdWVzdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaHRtbHNyYyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9nZ2xlUXVlc3Rpb25UeXBlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB0b2dnbGVCdXR0b25zLmFwcGVuZENoaWxkKHRyYW5zZmVyQnV0dG9uKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzaG93RWxlbWVudChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbXBvbmVudC1wcmV2aWV3XCIpKTtcbiAgICB9XG5cbiAgICAvLyBvbiBjbGlja2luZyBcIlNlbGVjdCB0aGlzIFByb2JsZW1cIiBidXR0b24sIGNsb3NlIHByZXZpZXcgcGFuZWwsIHJlcGxhY2UgY3VycmVudCBxdWVzdGlvbiBpbiBhc3NpZ25tZW50cyBwYWdlIHdpdGggc2VsZWN0ZWQgcXVlc3Rpb24sIGFuZCBzZW5kIHJlcXVlc3QgdG8gdXBkYXRlIGdyYWRpbmcgZGF0YWJhc2VcbiAgICAvLyBfIGB0b2dnbGVTZXRgXG4gICAgYXN5bmMgdG9nZ2xlU2V0KHBhcmVudElELCBzZWxlY3RlZFF1ZXN0aW9uLCBodG1sc3JjLCB0b2dnbGVRdWVzdGlvblR5cGVzKSB7XG4gICAgICAgIHZhciBzZWxlY3RvcklkID0gcGFyZW50SUQgKyBcIi10b2dnbGVTZWxlY3RlZFF1ZXN0aW9uXCI7XG4gICAgICAgIHZhciB0b2dnbGVRdWVzdGlvblNlbGVjdCA9IGRvY3VtZW50XG4gICAgICAgICAgICAuZ2V0RWxlbWVudEJ5SWQocGFyZW50SUQpXG4gICAgICAgICAgICAuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzZWxlY3RcIilbMF07XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHNlbGVjdG9ySWQpLmlubmVySFRNTCA9IFwiXCI7IC8vIG5lZWQgdG8gY2hlY2sgd2hldGhlciB0aGlzIGlzIGV2ZW4gbmVjZXNzYXJ5XG4gICAgICAgIC8vIFRlYXIgdGhlIHByZXZpZXcgZG93biBmaXJzdDogaXQgaG9sZHMgYSBjb3B5IG9mIHRoZSBxdWVzdGlvbiB3ZSBhcmVcbiAgICAgICAgLy8gYWJvdXQgdG8gcmVuZGVyLCBhbmQgdHdvIGxpdmUgY29waWVzIG9mIHRoZSBzYW1lIGRpdmlkIGF0IG9uY2VcbiAgICAgICAgLy8gY29uZnVzZSBjb21wb25lbnRzIHRoYXQgbG9vayB0aGVpciBwaWVjZXMgdXAgYnkgaWQuXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidG9nZ2xlLXByZXZpZXdcIikuaW5uZXJIVE1MID0gXCJcIjtcbiAgICAgICAgYXdhaXQgcmVuZGVyUnVuZXN0b25lQ29tcG9uZW50KGh0bWxzcmMsIHNlbGVjdG9ySWQsIHtcbiAgICAgICAgICAgIHNlbGVjdG9yX2lkOiBzZWxlY3RvcklkLFxuICAgICAgICAgICAgaXNfdG9nZ2xlOiB0aGlzLnRvZ2dsZU9wdGlvbnMsXG4gICAgICAgICAgICBpc19zZWxlY3Q6IHRydWUsXG4gICAgICAgICAgICB1c2VSdW5lc3RvbmVTZXJ2aWNlczogdHJ1ZSxcbiAgICAgICAgfSk7XG4gICAgICAgIGxldCByZXF1ZXN0ID0gbmV3IFJlcXVlc3QoXG4gICAgICAgICAgICBgJHtlQm9va0NvbmZpZy5uZXdfc2VydmVyX3ByZWZpeH0vYXNzZXNzbWVudC9zZXRfc2VsZWN0ZWRfcXVlc3Rpb24/bWV0YWlkPSR7cGFyZW50SUR9JnNlbGVjdGVkPSR7c2VsZWN0ZWRRdWVzdGlvbn1gLFxuICAgICAgICAgICAge30sXG4gICAgICAgICk7XG4gICAgICAgIGF3YWl0IGZldGNoKHJlcXVlc3QpO1xuICAgICAgICBsZXQgcGFyZW50RGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocGFyZW50SUQpO1xuICAgICAgICBwYXJlbnREaXYuZGF0YXNldC50b2dnbGVDdXJyZW50ID0gc2VsZWN0ZWRRdWVzdGlvbjtcbiAgICAgICAgcGFyZW50RGl2LmRhdGFzZXQudG9nZ2xlQ3VycmVudFR5cGUgPVxuICAgICAgICAgICAgdG9nZ2xlUXVlc3Rpb25UeXBlc1t0b2dnbGVRdWVzdGlvblNlbGVjdC5zZWxlY3RlZEluZGV4XTtcbiAgICB9XG5cbiAgICAvLyBvbiBjbGlja2luZyBcIlRyYW5zZmVyXCIgYnV0dG9uLCBleHRyYWN0IHRoZSBjdXJyZW50IHRleHQgYW5kIGluZGVudGF0aW9uIG9mIHRoZSBQYXJzb25zIGJsb2NrcyBpbiB0aGUgYW5zd2VyIHNwYWNlLCB0aGVuIHBhc3RlIHRoYXQgaW50byB0aGUgc2VsZWN0ZWQgYWN0aXZlIGNvZGUgcXVlc3Rpb25cbiAgICBhc3luYyB0b2dnbGVUcmFuc2ZlcihcbiAgICAgICAgcGFyZW50SUQsXG4gICAgICAgIHNlbGVjdGVkUXVlc3Rpb24sXG4gICAgICAgIGh0bWxzcmMsXG4gICAgICAgIHRvZ2dsZVF1ZXN0aW9uVHlwZXMsXG4gICAgKSB7XG4gICAgICAgIC8vIHJldHJpZXZlIGFsbCBQYXJzb25zIGxpbmVzIHdpdGhpbiB0aGUgYW5zd2VyIHNwYWNlIGFuZCBsb29wIHRocm91Z2ggdGhpcyBsaXN0XG4gICAgICAgIHZhciBjdXJyZW50UGFyc29ucyA9IGRvY3VtZW50XG4gICAgICAgICAgICAuZ2V0RWxlbWVudEJ5SWQocGFyZW50SUQgKyBcIi10b2dnbGVTZWxlY3RlZFF1ZXN0aW9uXCIpXG4gICAgICAgICAgICAucXVlcnlTZWxlY3RvckFsbChcImRpdltjbGFzc149J2Fuc3dlciddXCIpWzBdXG4gICAgICAgICAgICAuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInByZXR0eXByaW50IGxhbmctcHlcIik7XG4gICAgICAgIHZhciBjdXJyZW50UGFyc29uc0NsYXNzO1xuICAgICAgICB2YXIgY3VycmVudEJsb2NrSW5kZW50O1xuICAgICAgICB2YXIgaW5kZW50Q291bnQ7XG4gICAgICAgIHZhciBpbmRlbnQ7XG4gICAgICAgIHZhciBwYXJzb25zTGluZTtcbiAgICAgICAgdmFyIHBhcnNvbnNMaW5lcyA9IGBgO1xuICAgICAgICB2YXIgY291bnQ7XG4gICAgICAgIGZvciAodmFyIHAgPSAwOyBwIDwgY3VycmVudFBhcnNvbnMubGVuZ3RoOyBwKyspIHtcbiAgICAgICAgICAgIGluZGVudENvdW50ID0gMDtcbiAgICAgICAgICAgIGluZGVudCA9IFwiXCI7XG4gICAgICAgICAgICAvLyBmb3IgUGFyc29ucyBibG9ja3MgdGhhdCBoYXZlIGJ1aWx0LWluIGluZGVudGF0aW9uIGluIHRoZWlyIGxpbmVzXG4gICAgICAgICAgICBjdXJyZW50UGFyc29uc0NsYXNzID0gY3VycmVudFBhcnNvbnNbcF0uY2xhc3NMaXN0WzJdO1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRQYXJzb25zQ2xhc3MpIHtcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudFBhcnNvbnNDbGFzcy5pbmNsdWRlcyhcImluZGVudFwiKSkge1xuICAgICAgICAgICAgICAgICAgICBpbmRlbnRDb3VudCA9XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUludChpbmRlbnRDb3VudCkgK1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VJbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFBhcnNvbnNDbGFzcy5zbGljZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgNixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFBhcnNvbnNDbGFzcy5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gZm9yIFBhcnNvbnMgYW5zd2VyIHNwYWNlcyB3aXRoIHZlcnRpY2FsIGxpbmVzIHRoYXQgYWxsb3cgc3R1ZGVudCB0byBkZWZpbmUgdGhlaXIgb3duIGxpbmUgaW5kZW50YXRpb25cbiAgICAgICAgICAgIGN1cnJlbnRCbG9ja0luZGVudCA9XG4gICAgICAgICAgICAgICAgY3VycmVudFBhcnNvbnNbcF0ucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnN0eWxlLmxlZnQ7XG4gICAgICAgICAgICBpZiAoY3VycmVudEJsb2NrSW5kZW50KSB7XG4gICAgICAgICAgICAgICAgaW5kZW50Q291bnQgPVxuICAgICAgICAgICAgICAgICAgICBwYXJzZUludChpbmRlbnRDb3VudCkgK1xuICAgICAgICAgICAgICAgICAgICBwYXJzZUludChcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRCbG9ja0luZGVudC5zbGljZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRCbG9ja0luZGVudC5pbmRleE9mKFwicHhcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICApIC8gMzAsXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKHZhciBkID0gMDsgZCA8IGluZGVudENvdW50OyBkKyspIHtcbiAgICAgICAgICAgICAgICBpbmRlbnQgKz0gXCIgICAgXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyByZXRyaWV2ZSBlYWNoIHRleHQgc25pcHBldCBvZiBlYWNoIFBhcnNvbnMgbGluZSBhbmQgbG9vcCB0aHJvdWdoIHRoaXMgbGlzdFxuICAgICAgICAgICAgcGFyc29uc0xpbmUgPSBjdXJyZW50UGFyc29uc1twXS5nZXRFbGVtZW50c0J5VGFnTmFtZShcInNwYW5cIik7XG4gICAgICAgICAgICBjb3VudCA9IDA7XG4gICAgICAgICAgICBmb3IgKHZhciBsID0gMDsgbCA8IHBhcnNvbnNMaW5lLmxlbmd0aDsgbCsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBhcnNvbnNMaW5lW2xdLmNoaWxkTm9kZXNbMF0ubm9kZU5hbWUgPT0gXCIjdGV4dFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFBhcnNvbnMgYmxvY2tzIGhhdmUgZGlmZmVyaW5nIGFtb3VudHMgb2YgaGllcmFyY2h5IGxldmVscyAoc3BhbnMgd2l0aGluIHNwYW5zKVxuICAgICAgICAgICAgICAgICAgICBpZiAocCA9PSAwICYmIGNvdW50ID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG5lZWQgZGlmZmVyZW50IGNoZWNrIHRoYW4gbCA9PSAwIGJlY2F1c2UgdGhlIGwgbnVtYmVyaW5nIGRvZXNuJ3QgYWxpZ24gd2l0aCBsb2NhdGlvbiB3aXRoaW4gbGluZSBkdWUgdG8gaW5jb25zaXN0ZW50IHNwYW4gaGVpcmFyY2h5XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJzb25zTGluZXMgKz0gaW5kZW50ICsgcGFyc29uc0xpbmVbbF0uaW5uZXJIVE1MO1xuICAgICAgICAgICAgICAgICAgICAgICAgY291bnQrKztcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjb3VudCAhPSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJzb25zTGluZXMgKz0gcGFyc29uc0xpbmVbbF0uaW5uZXJIVE1MO1xuICAgICAgICAgICAgICAgICAgICAgICAgY291bnQrKztcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNvbnNMaW5lcyA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyc29uc0xpbmVzICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYCArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZW50ICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJzb25zTGluZVtsXS5pbm5lckhUTUw7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJzb25zTGluZXMgPSBwYXJzb25zTGluZXMucmVwbGFjZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gcmVwbGFjZSBhbGwgZXhpc3RpbmcgY29kZSB3aXRoaW4gc2VsZWN0ZWQgYWN0aXZlIGNvZGUgcXVlc3Rpb24gd2l0aCBleHRyYWN0ZWQgUGFyc29ucyB0ZXh0XG4gICAgICAgIHZhciBodG1sc3JjRm9ybWVyID0gaHRtbHNyYy5zbGljZShcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICBodG1sc3JjLmluZGV4T2YoXCI8dGV4dGFyZWFcIikgK1xuICAgICAgICAgICAgICAgIGh0bWxzcmMuc3BsaXQoXCI8dGV4dGFyZWFcIilbMV0uaW5kZXhPZihcIj5cIikgK1xuICAgICAgICAgICAgICAgIDEwLFxuICAgICAgICApO1xuICAgICAgICB2YXIgaHRtbHNyY0xhdHRlciA9IGh0bWxzcmMuc2xpY2UoXG4gICAgICAgICAgICBodG1sc3JjLmluZGV4T2YoXCI8L3RleHRhcmVhPlwiKSxcbiAgICAgICAgICAgIGh0bWxzcmMubGVuZ3RoLFxuICAgICAgICApO1xuICAgICAgICBodG1sc3JjID0gaHRtbHNyY0Zvcm1lciArIHBhcnNvbnNMaW5lcyArIGh0bWxzcmNMYXR0ZXI7XG5cbiAgICAgICAgYXdhaXQgdGhpcy50b2dnbGVTZXQoXG4gICAgICAgICAgICBwYXJlbnRJRCxcbiAgICAgICAgICAgIHNlbGVjdGVkUXVlc3Rpb24sXG4gICAgICAgICAgICBodG1sc3JjLFxuICAgICAgICAgICAgdG9nZ2xlUXVlc3Rpb25UeXBlcyxcbiAgICAgICAgKTtcbiAgICAgICAgaGlkZUVsZW1lbnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb21wb25lbnQtcHJldmlld1wiKSk7XG4gICAgfVxufVxuXG4vLyBUaGUgcHJldmlldyBwYW5lbCBpcyBzaGFyZWQgYnkgYWxsIHRvZ2dsZSBxdWVzdGlvbnMgb24gYSBwYWdlIGFuZCBtYXkgbm90XG4vLyBleGlzdCB5ZXQgd2hlbiBoaWRkZW4vc2hvd24uXG5mdW5jdGlvbiBoaWRlRWxlbWVudChlbGVtZW50KSB7XG4gICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgICAgZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBzaG93RWxlbWVudChlbGVtZW50KSB7XG4gICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgICAgZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gXCJcIjtcbiAgICB9XG59XG5cbmlmICh0eXBlb2Ygd2luZG93LmNvbXBvbmVudF9mYWN0b3J5ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgd2luZG93LmNvbXBvbmVudF9mYWN0b3J5ID0ge307XG59XG5cbndpbmRvdy5jb21wb25lbnRfZmFjdG9yeS5zZWxlY3RxdWVzdGlvbiA9IGZ1bmN0aW9uIChvcHRzKSB7XG4gICAgcmV0dXJuIG5ldyBTZWxlY3RPbmUob3B0cyk7XG59O1xuXG4vKlxuICogV2hlbiB0aGUgcGFnZSBpcyBsb2FkZWQgYW5kIHRoZSBsb2dpbiBjaGVja3MgYXJlIGNvbXBsZXRlIGZpbmQgYW5kIHJlbmRlclxuICogZWFjaCBzZWxlY3RxdWVzdGlvbiBjb21wb25lbnQgdGhhdCBpcyBub3QgcGFydCBvZiBhIHRpbWVkQXNzZXNzbWVudC5cbiAqKi9cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJydW5lc3RvbmU6bG9naW4tY29tcGxldGVcIiwgYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgIGxldCBzZWxRdWVzdGlvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFxuICAgICAgICBcIltkYXRhLWNvbXBvbmVudD1zZWxlY3RxdWVzdGlvbl1cIixcbiAgICApO1xuICAgIGZvciAobGV0IGNxIG9mIHNlbFF1ZXN0aW9ucykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKCFjcS5jbG9zZXN0KFwiW2RhdGEtY29tcG9uZW50PXRpbWVkQXNzZXNzbWVudF1cIikpIHtcbiAgICAgICAgICAgICAgICAvLyBJZiB0aGlzIGVsZW1lbnQgZXhpc3RzIHdpdGhpbiBhIHRpbWVkIGNvbXBvbmVudCwgZG9uJ3QgcmVuZGVyIGl0IGhlcmVcbiAgICAgICAgICAgICAgICBsZXQgdG1wID0gbmV3IFNlbGVjdE9uZSh7IG9yaWc6IGNxIH0pO1xuICAgICAgICAgICAgICAgIGF3YWl0IHRtcC5pbml0aWFsaXplKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYEVycm9yIHJlbmRlcmluZyBOZXcgRXhlcmNpc2UgJHtjcS5pZH1cbiAgICAgICAgICAgICAgICAgICAgICAgICBEZXRhaWxzOiAke2Vycn1gKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVyci5zdGFjayk7XG4gICAgICAgIH1cbiAgICB9XG59KTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==