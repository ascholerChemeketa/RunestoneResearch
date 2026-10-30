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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuZXN0b25lX3NlbGVjdHF1ZXN0aW9uX2pzX3NlbGVjdG9uZV9qcy5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSTRDO0FBQ2lCO0FBQ0g7QUFDdkI7O0FBRXBCLHdCQUF3QixtRUFBYTtBQUNwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QixtRUFBWTtBQUNyQywyQkFBMkIsbUVBQVk7QUFDdkMsNkJBQTZCLG1FQUFZO0FBQ3pDLDZCQUE2QixtRUFBWTtBQUN6QyxzQkFBc0IsbUVBQVk7QUFDbEMsNEJBQTRCLG1FQUFZO0FBQ3hDLDZCQUE2QixtRUFBWTtBQUN6QztBQUNBLDZDQUE2QztBQUM3QztBQUNBO0FBQ0EsMkJBQTJCLG1FQUFZO0FBQ3ZDLDRCQUE0QixtRUFBWTtBQUN4Qyw2QkFBNkIsbUVBQVk7QUFDekMsNEJBQTRCLG1FQUFZO0FBQ3hDLCtCQUErQixtRUFBWTtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixTQUFTO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsOEJBQThCO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBEQUEwRCxZQUFZO0FBQ3RFO0FBQ0EsNkRBQTZELFdBQVc7QUFDeEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixtRkFBb0I7QUFDdEM7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0MseUJBQXlCO0FBQzdEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5R0FBeUc7QUFDekc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsNEJBQTRCO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEI7QUFDMUI7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsdUZBQXdCO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIseUNBQXlDO0FBQ3JFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6QixxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLDhCQUE4QiwyQkFBMkIsaUJBQWlCO0FBQ3pGO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUSx1RkFBd0I7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQixhQUFhO0FBQ2I7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQixpQkFBaUI7QUFDakI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0REFBNEQ7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjLHVGQUF3QjtBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLGVBQWUsOEJBQThCLDJDQUEyQyxTQUFTLFlBQVksaUJBQWlCO0FBQzlILGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QiwyQkFBMkI7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QixpQkFBaUI7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0Qix3QkFBd0I7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCO0FBQ3RCO0FBQ0E7QUFDQSxzQkFBc0I7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMENBQTBDLFVBQVU7QUFDcEQ7QUFDQTtBQUNBLFVBQVU7QUFDVix3REFBd0Q7QUFDeEQsb0NBQW9DLElBQUk7QUFDeEM7QUFDQTtBQUNBO0FBQ0EsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvc2VsZWN0cXVlc3Rpb24vY3NzL3NlbGVjdHF1ZXN0aW9uLmNzcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL3NlbGVjdHF1ZXN0aW9uL2pzL3NlbGVjdG9uZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvKipcbiAqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIHxkb2NuYW1lfCAtIFNlbGVjdE9uZSBDb21wb25lbnRcbiAqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqL1xuaW1wb3J0IHtcbiAgICByZW5kZXJSdW5lc3RvbmVDb21wb25lbnQsXG4gICAgY3JlYXRlVGltZWRDb21wb25lbnQsXG59IGZyb20gXCIuLi8uLi9jb21tb24vanMvcmVuZGVyQ29tcG9uZW50LmpzXCI7XG5pbXBvcnQgUnVuZXN0b25lQmFzZSBmcm9tIFwiLi4vLi4vY29tbW9uL2pzL3J1bmVzdG9uZWJhc2UuanNcIjtcbmltcG9ydCB7IGdldERhdGFWYWx1ZSB9IGZyb20gXCIuLi8uLi9jb21tb24vanMvZG9tdXRpbC5qc1wiO1xuaW1wb3J0IFwiLi4vY3NzL3NlbGVjdHF1ZXN0aW9uLmNzc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZWxlY3RPbmUgZXh0ZW5kcyBSdW5lc3RvbmVCYXNlIHtcbiAgICAvKipcbiAgICAgKiBjb25zdHJ1Y3RvciAtLVxuICAgICAqIE1ha2luZyBhbiBpbnN0YW5jZSBvZiBhIHNlbGVjdG9uZSBpcyBhIGJpdCBtb3JlIGNvbXBsaWNhdGVkIGJlY2F1c2UgaXQgaXNcbiAgICAgKiBhIGtpbmQgb2YgbWV0YSBkaXJlY3RpdmUuICBUaGF0IGlzLCBnbyB0byB0aGUgc2VydmVyIGFuZCByYW5kb21seSBzZWxlY3RcbiAgICAgKiBhIHF1ZXN0aW9uIHRvIGRpc3BsYXkgaW4gdGhpcyBzcG90LiAgT3IsIGlmIGEgc3R1ZGVudCBoYXMgYWxyZWFkeSBzZWVuIHRoaXMgcXVlc3Rpb25cbiAgICAgKiBpbiB0aGUgY29udGV4dCBvZiBhbiBleGFtIHJldHJpZXZlIHRoZSBxdWVzdGlvbiB0aGV5IHNhdyBpbiB0aGUgZmlyc3QgcGxhY2UuXG4gICAgICogTWFraW5nIGFuIEFQSSBjYWxsIGFuZCB3YWl0aW5nIGZvciB0aGUgcmVzcG9uc2UgaXMgaGFuZGxlZCBhc3luY2hyb25vdXNseS5cbiAgICAgKiBCdXQgbG90cyBvZiBjb2RlIGlzIG5vdCB3cml0dGVuIHdpdGggdGhhdCBhc3N1bXB0aW9uLiAgU28gd2UgZG8gdGhlIGluaXRpYWxpemF0aW9uIGluXG4gICAgICogdHdvIHBhcnRzLlxuICAgICAqIDEuIENyZWF0ZSB0aGUgb2JqZWN0IHdpdGggdGhlIHVzdWFsIGNvbnN0cnVjdG9yXG4gICAgICogMi4gY2FsbCBpbml0aWFsaXplLCB3aGljaCByZXR1cm5zIGEgcHJvbWlzZS4gIFdoZW4gdGhhdCBwcm9taXNlIGlzIHJlc29sdmVkXG4gICAgICogdGhlIFwicmVwbGFjZW1lbnRcIiBjb21wb25lbnQgd2lsbCByZXBsYWNlIHRoZSBvcmlnaW5hbCBzZWxlY3RvbmUgY29tcG9uZW50IGluIHRoZSBET00uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gIHt9IG9wdHNcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgICAgIHN1cGVyKG9wdHMpO1xuICAgICAgICB0aGlzLm9yaWdPcHRzID0gb3B0cztcbiAgICAgICAgdGhpcy5xdWVzdGlvbnMgPSBnZXREYXRhVmFsdWUob3B0cy5vcmlnLCBcInF1ZXN0aW9ubGlzdFwiKTtcbiAgICAgICAgdGhpcy5wcm9maWNpZW5jeSA9IGdldERhdGFWYWx1ZShvcHRzLm9yaWcsIFwicHJvZmljaWVuY3lcIik7XG4gICAgICAgIHRoaXMubWluRGlmZmljdWx0eSA9IGdldERhdGFWYWx1ZShvcHRzLm9yaWcsIFwibWluLWRpZmZpY3VsdHlcIik7XG4gICAgICAgIHRoaXMubWF4RGlmZmljdWx0eSA9IGdldERhdGFWYWx1ZShvcHRzLm9yaWcsIFwibWF4LWRpZmZpY3VsdHlcIik7XG4gICAgICAgIHRoaXMucG9pbnRzID0gZ2V0RGF0YVZhbHVlKG9wdHMub3JpZywgXCJwb2ludHNcIik7XG4gICAgICAgIHRoaXMuYXV0b2dyYWRhYmxlID0gZ2V0RGF0YVZhbHVlKG9wdHMub3JpZywgXCJhdXRvZ3JhZGFibGVcIik7XG4gICAgICAgIHRoaXMubm90X3NlZW5fZXZlciA9IGdldERhdGFWYWx1ZShvcHRzLm9yaWcsIFwibm90X3NlZW5fZXZlclwiKTtcbiAgICAgICAgdGhpcy5zZWxlY3Rvcl9pZCA9IG9wdHMub3JpZy5nZXRBdHRyaWJ1dGUoXCJpZFwiKTtcbiAgICAgICAgLy8gUnVuZXN0b25lQmFzZSBkb2VzIG5vdCBzZXQgZGl2aWQ7IHN1YmNsYXNzZXMgZG8uIFdpdGhvdXQgdGhpcyB0aGUgYmFzZVxuICAgICAgICAvLyBjbGFzcyBidWlsZHMgZWxlbWVudCBpZHMgbGlrZSBcInVuZGVmaW5lZF9tZXNzYWdlXCIuIFNlZSBpc3N1ZSAjMTM5My5cbiAgICAgICAgdGhpcy5kaXZpZCA9IHRoaXMuc2VsZWN0b3JfaWQ7XG4gICAgICAgIHRoaXMucHJpbWFyeU9ubHkgPSBnZXREYXRhVmFsdWUob3B0cy5vcmlnLCBcInByaW1hcnlcIik7XG4gICAgICAgIHRoaXMuQUJFeHBlcmltZW50ID0gZ2V0RGF0YVZhbHVlKG9wdHMub3JpZywgXCJhYlwiKTtcbiAgICAgICAgdGhpcy50b2dnbGVPcHRpb25zID0gZ2V0RGF0YVZhbHVlKG9wdHMub3JpZywgXCJ0b2dnbGVvcHRpb25zXCIpO1xuICAgICAgICB0aGlzLnRvZ2dsZUxhYmVscyA9IGdldERhdGFWYWx1ZShvcHRzLm9yaWcsIFwidG9nZ2xlbGFiZWxzXCIpO1xuICAgICAgICB0aGlzLmxpbWl0QmFzZUNvdXJzZSA9IGdldERhdGFWYWx1ZShvcHRzLm9yaWcsIFwibGltaXQtYmFzZWNvdXJzZVwiKTtcbiAgICAgICAgb3B0cy5vcmlnLmlkID0gdGhpcy5zZWxlY3Rvcl9pZDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogaW5pdGlhbGl6ZSAtLVxuICAgICAqIGluaXRpYWxpemUgaXMgdXNlZCBzbyB0aGF0IHRoZSBjb25zdHJ1Y3RvciBkb2VzIG5vdCBoYXZlIHRvIGJlIGFzeW5jLlxuICAgICAqIENvbnN0cnVjdG9ycyBzaG91bGQgZGVmaW5pdGVseSBub3QgcmV0dXJuIHByb21pc2VzIHRoYXQgd291bGQgc2VyaW91c2x5XG4gICAgICogbWVzcyB0aGluZ3MgdXAuXG4gICAgICogQHJldHVybiB7UHJvbWlzZX0gV2lsbCByZXNvbHZlIGFmdGVyIGNvbXBvbmVudCBmcm9tIERCIGlzIHJlaWZpZWRcbiAgICAgKi9cbiAgICBhc3luYyBpbml0aWFsaXplKCkge1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIGxldCBkYXRhID0geyBzZWxlY3Rvcl9pZDogdGhpcy5zZWxlY3Rvcl9pZCB9O1xuICAgICAgICBpZiAodGhpcy5xdWVzdGlvbnMpIHtcbiAgICAgICAgICAgIGRhdGEucXVlc3Rpb25zID0gdGhpcy5xdWVzdGlvbnM7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5wcm9maWNpZW5jeSkge1xuICAgICAgICAgICAgZGF0YS5wcm9maWNpZW5jeSA9IHRoaXMucHJvZmljaWVuY3k7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMubWluRGlmZmljdWx0eSkge1xuICAgICAgICAgICAgZGF0YS5taW5EaWZmaWN1bHR5ID0gdGhpcy5taW5EaWZmaWN1bHR5O1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLm1heERpZmZpY3VsdHkpIHtcbiAgICAgICAgICAgIGRhdGEubWF4RGlmZmljdWx0eSA9IHRoaXMubWF4RGlmZmljdWx0eTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5wb2ludHMpIHtcbiAgICAgICAgICAgIGRhdGEucG9pbnRzID0gdGhpcy5wb2ludHM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuYXV0b2dyYWRhYmxlKSB7XG4gICAgICAgICAgICBkYXRhLmF1dG9ncmFkYWJsZSA9IHRoaXMuYXV0b2dyYWRhYmxlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLm5vdF9zZWVuX2V2ZXIpIHtcbiAgICAgICAgICAgIGRhdGEubm90X3NlZW5fZXZlciA9IHRoaXMubm90X3NlZW5fZXZlcjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5wcmltYXJ5T25seSkge1xuICAgICAgICAgICAgZGF0YS5wcmltYXJ5ID0gdGhpcy5wcmltYXJ5T25seTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5BQkV4cGVyaW1lbnQpIHtcbiAgICAgICAgICAgIGRhdGEuQUIgPSB0aGlzLkFCRXhwZXJpbWVudDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy50aW1lZFdyYXBwZXIpIHtcbiAgICAgICAgICAgIGRhdGEudGltZWRXcmFwcGVyID0gdGhpcy50aW1lZFdyYXBwZXI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMudG9nZ2xlT3B0aW9ucykge1xuICAgICAgICAgICAgZGF0YS50b2dnbGVPcHRpb25zID0gdGhpcy50b2dnbGVPcHRpb25zO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnRvZ2dsZUxhYmVscykge1xuICAgICAgICAgICAgZGF0YS50b2dnbGVMYWJlbHMgPSB0aGlzLnRvZ2dsZUxhYmVscztcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5saW1pdEJhc2VDb3Vyc2UpIHtcbiAgICAgICAgICAgIGRhdGEubGltaXRCYXNlQ291cnNlID0gZUJvb2tDb25maWcuYmFzZWNvdXJzZTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgb3B0cyA9IHRoaXMub3JpZ09wdHM7XG4gICAgICAgIGxldCBzZWxlY3RvcklkID0gdGhpcy5zZWxlY3Rvcl9pZDtcbiAgICAgICAgY29uc29sZS5sb2coXCJnZXR0aW5nIHF1ZXN0aW9uIHNvdXJjZVwiKTtcbiAgICAgICAgbGV0IHJlcXVlc3QgPSBuZXcgUmVxdWVzdChcbiAgICAgICAgICAgIGAke2VCb29rQ29uZmlnLm5ld19zZXJ2ZXJfcHJlZml4fS9hc3Nlc3NtZW50L2dldF9xdWVzdGlvbl9zb3VyY2VgLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgICAgICAgaGVhZGVyczogdGhpcy5qc29uSGVhZGVycyxcbiAgICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShkYXRhKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICk7XG4gICAgICAgIGxldCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHJlcXVlc3QpO1xuICAgICAgICBsZXQgaHRtbHNyYyA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgaHRtbHNyYyA9IGh0bWxzcmMuZGV0YWlsO1xuICAgICAgICBpZiAoaHRtbHNyYy5pbmRleE9mKFwiTm8gcHJldmlld1wiKSA+PSAwKSB7XG4gICAgICAgICAgICBhbGVydChcbiAgICAgICAgICAgICAgICBgRXJyb3I6IE5vdCBhYmxlIHRvIGZpbmQgYSBxdWVzdGlvbiBmb3IgJHtzZWxlY3RvcklkfSBiYXNlZCBvbiB0aGUgY3JpdGVyaWFgLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5hYmxlIHRvIGZpbmQgYSBxdWVzdGlvbiBmb3IgJHtzZWxlY3RvcklkfWApO1xuICAgICAgICB9XG4gICAgICAgIGxldCByZXM7XG4gICAgICAgIGlmIChvcHRzLnRpbWVkKSB7XG4gICAgICAgICAgICAvLyB0aW1lZCBjb21wb25lbnRzIGFyZSBub3QgcmVuZGVyZWQgaW1tZWRpYXRlbHksIG9ubHkgd2hlbiB0aGUgc3R1ZGVudFxuICAgICAgICAgICAgLy8gc3RhcnRzIHRoZSBhc3Nlc3NtZW50IGFuZCB2aXNpdHMgdGhpcyBwYXJ0aWN1bGFyIGVudHJ5LlxuICAgICAgICAgICAgcmVzID0gY3JlYXRlVGltZWRDb21wb25lbnQoaHRtbHNyYywge1xuICAgICAgICAgICAgICAgIHRpbWVkOiB0cnVlLFxuICAgICAgICAgICAgICAgIHNlbGVjdG9yX2lkOiBzZWxlY3RvcklkLFxuICAgICAgICAgICAgICAgIGFzc2Vzc21lbnRUYWtlbjogb3B0cy5hc3Nlc3NtZW50VGFrZW4sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vIHJlcGxhY2UgdGhlIGVudHJ5IGluIHRoZSB0aW1lZCBhc3Nlc3NtZW50J3MgbGlzdCBvZiBjb21wb25lbnRzXG4gICAgICAgICAgICAvLyB3aXRoIHRoZSBjb21wb25lbnQgY3JlYXRlZCBieSBjcmVhdGVUaW1lZENvbXBvbmVudFxuICAgICAgICAgICAgZm9yIChsZXQgY29tcG9uZW50IG9mIG9wdHMucnFhKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNvbXBvbmVudC5xdWVzdGlvbiA9PSBzZWxmKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5xdWVzdGlvbiA9IHJlcy5xdWVzdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VsZi5yZWFsQ29tcG9uZW50ID0gcmVzLnF1ZXN0aW9uO1xuICAgICAgICAgICAgc2VsZi5jb250YWluZXJEaXYgPSByZXMucXVlc3Rpb24uY29udGFpbmVyRGl2O1xuICAgICAgICAgICAgc2VsZi5yZWFsQ29tcG9uZW50LnNlbGVjdG9ySWQgPSBzZWxlY3RvcklkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGRhdGEudG9nZ2xlT3B0aW9ucykge1xuICAgICAgICAgICAgICAgIHZhciB0b2dnbGVMYWJlbHMgPSBkYXRhLnRvZ2dsZUxhYmVscztcbiAgICAgICAgICAgICAgICBpZiAodG9nZ2xlTGFiZWxzKSB7XG4gICAgICAgICAgICAgICAgICAgIHRvZ2dsZUxhYmVscyA9IHRvZ2dsZUxhYmVsc1xuICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoXCJ0b2dnbGVsYWJlbHM6XCIsIFwiXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAudHJpbSgpO1xuICAgICAgICAgICAgICAgICAgICB0b2dnbGVMYWJlbHMgPSB0b2dnbGVMYWJlbHMuc3BsaXQoXCIsXCIpO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciB0ID0gMDsgdCA8IHRvZ2dsZUxhYmVscy5sZW5ndGg7IHQrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9nZ2xlTGFiZWxzW3RdID0gdG9nZ2xlTGFiZWxzW3RdLnRyaW0oKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgdG9nZ2xlUXVlc3Rpb25zID0gdGhpcy5xdWVzdGlvbnMuc3BsaXQoXCIsIFwiKTtcbiAgICAgICAgICAgICAgICB2YXIgdG9nZ2xlVUkgPSBcIlwiO1xuICAgICAgICAgICAgICAgIC8vIGNoZWNrIHNvIHRoYXQgb25seSB0aGUgZmlyc3QgdG9nZ2xlIHNlbGVjdCBxdWVzdGlvbiBvbiB0aGUgYXNzaWdubWVudHMgcGFnZSBoYXMgYSBwcmV2aWV3IHBhbmVsIGNyZWF0ZWQsIHRoZW4gYWxsIHRvZ2dsZSBzZWxlY3QgcHJldmlld3MgdXNlIHRoaXMgc2FtZSBwYW5lbFxuICAgICAgICAgICAgICAgIGlmICghZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb21wb25lbnQtcHJldmlld1wiKSkge1xuICAgICAgICAgICAgICAgICAgICB0b2dnbGVVSSArPVxuICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgaWQ9XCJjb21wb25lbnQtcHJldmlld1wiIGNsYXNzPVwiY29sLW1kLTYgdG9nZ2xlLXByZXZpZXdcIiBzdHlsZT1cInotaW5kZXg6IDk5OTtcIj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICc8ZGl2IGlkPVwidG9nZ2xlLWJ1dHRvbnNcIj48L2Rpdj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICc8ZGl2IGlkPVwidG9nZ2xlLXByZXZpZXdcIj48L2Rpdj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiPC9kaXY+XCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIGRyb3Bkb3duIG1lbnUgY29udGFpbmluZyB0aGUgcXVlc3Rpb24gb3B0aW9uc1xuICAgICAgICAgICAgICAgIHRvZ2dsZVVJICs9XG4gICAgICAgICAgICAgICAgICAgICc8bGFiZWwgZm9yPVwiJyArXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdG9ySWQgK1xuICAgICAgICAgICAgICAgICAgICAnLXRvZ2dsZVF1ZXN0aW9uXCIgc3R5bGU9XCJtYXJnaW4tbGVmdDogMTBweFwiPlRvZ2dsZSBRdWVzdGlvbjo8L2xhYmVsPjxzZWxlY3QgaWQ9XCInICtcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0b3JJZCArXG4gICAgICAgICAgICAgICAgICAgICctdG9nZ2xlUXVlc3Rpb25cIj4nO1xuICAgICAgICAgICAgICAgIHZhciBpO1xuICAgICAgICAgICAgICAgIHZhciB0b2dnbGVRdWVzdGlvbkhUTUxTcmM7XG4gICAgICAgICAgICAgICAgdmFyIHRvZ2dsZVF1ZXN0aW9uU3Vic3RyaW5nO1xuICAgICAgICAgICAgICAgIHZhciB0b2dnbGVRdWVzdGlvblR5cGU7XG4gICAgICAgICAgICAgICAgdmFyIHRvZ2dsZVF1ZXN0aW9uVHlwZXMgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdG9nZ2xlUXVlc3Rpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHRvZ2dsZVF1ZXN0aW9uSFRNTFNyYyA9IGF3YWl0IHRoaXMuZ2V0VG9nZ2xlU3JjKFxuICAgICAgICAgICAgICAgICAgICAgICAgdG9nZ2xlUXVlc3Rpb25zW2ldLFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB0b2dnbGVRdWVzdGlvblN1YnN0cmluZyA9XG4gICAgICAgICAgICAgICAgICAgICAgICB0b2dnbGVRdWVzdGlvbkhUTUxTcmMuc3BsaXQoJ2RhdGEtY29tcG9uZW50PVwiJylbMV07XG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoXG4gICAgICAgICAgICAgICAgICAgICAgICB0b2dnbGVRdWVzdGlvblN1YnN0cmluZy5zbGljZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvZ2dsZVF1ZXN0aW9uU3Vic3RyaW5nLmluZGV4T2YoJ1wiJyksXG4gICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcImFjdGl2ZWNvZGVcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2dnbGVRdWVzdGlvblR5cGUgPSBcIkFjdGl2ZSBXcml0ZSBDb2RlXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiY2xpY2thYmxlYXJlYVwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvZ2dsZVF1ZXN0aW9uVHlwZSA9IFwiQ2xpY2thYmxlIEFyZWFcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJkcmFnbmRyb3BcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2dnbGVRdWVzdGlvblR5cGUgPSBcIkRyYWcgbiBEcm9wXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiZmlsbGludGhlYmxhbmtcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2dnbGVRdWVzdGlvblR5cGUgPSBcIkZpbGwgaW4gdGhlIEJsYW5rXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwibXVsdGlwbGVjaG9pY2VcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2dnbGVRdWVzdGlvblR5cGUgPSBcIk11bHRpcGxlIENob2ljZVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcInBhcnNvbnNcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2dnbGVRdWVzdGlvblR5cGUgPSBcIlBhcnNvbnMgTWl4ZWQtVXAgQ29kZVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcInNob3J0YW5zd2VyXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9nZ2xlUXVlc3Rpb25UeXBlID0gXCJTaG9ydCBBbnN3ZXJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0b2dnbGVRdWVzdGlvblR5cGVzW2ldID0gdG9nZ2xlUXVlc3Rpb25UeXBlO1xuICAgICAgICAgICAgICAgICAgICB0b2dnbGVVSSArPSAnPG9wdGlvbiB2YWx1ZT1cIicgKyB0b2dnbGVRdWVzdGlvbnNbaV0gKyAnXCI+JztcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRvZ2dsZUxhYmVscykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRvZ2dsZUxhYmVsc1tpXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvZ2dsZVVJICs9IHRvZ2dsZUxhYmVsc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9nZ2xlVUkgKz1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9nZ2xlUXVlc3Rpb25UeXBlICsgXCIgLSBcIiArIHRvZ2dsZVF1ZXN0aW9uc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvZ2dsZVVJICs9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9nZ2xlUXVlc3Rpb25UeXBlICsgXCIgLSBcIiArIHRvZ2dsZVF1ZXN0aW9uc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoaSA9PSAwICYmIGRhdGEudG9nZ2xlT3B0aW9ucy5pbmNsdWRlcyhcImxvY2tcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvZ2dsZVVJICs9IFwiIChvbmx5IHRoaXMgcXVlc3Rpb24gd2lsbCBiZSBncmFkZWQpXCI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdG9nZ2xlVUkgKz0gXCI8L29wdGlvbj5cIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdG9nZ2xlVUkgKz1cbiAgICAgICAgICAgICAgICAgICAgJzwvc2VsZWN0PjxkaXYgaWQ9XCInICtcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0b3JJZCArXG4gICAgICAgICAgICAgICAgICAgICctdG9nZ2xlU2VsZWN0ZWRRdWVzdGlvblwiPic7XG4gICAgICAgICAgICAgICAgdmFyIHRvZ2dsZUZpcnN0SUQgPSBodG1sc3JjLnNwbGl0KCdpZD1cIicpWzFdO1xuICAgICAgICAgICAgICAgIHRvZ2dsZUZpcnN0SUQgPSB0b2dnbGVGaXJzdElELnNwbGl0KCdcIicpWzBdO1xuICAgICAgICAgICAgICAgIGh0bWxzcmMgPSB0b2dnbGVVSSArIGh0bWxzcmMgKyBcIjwvZGl2PlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8ganVzdCByZW5kZXIgdGhpcyBjb21wb25lbnQgb24gdGhlIHBhZ2UgaW4gaXRzIHVzdWFsIHBsYWNlXG4gICAgICAgICAgICBhd2FpdCByZW5kZXJSdW5lc3RvbmVDb21wb25lbnQoaHRtbHNyYywgc2VsZWN0b3JJZCwge1xuICAgICAgICAgICAgICAgIHNlbGVjdG9yX2lkOiBzZWxlY3RvcklkLFxuICAgICAgICAgICAgICAgIGlzX3RvZ2dsZTogdGhpcy50b2dnbGVPcHRpb25zLFxuICAgICAgICAgICAgICAgIGlzX3NlbGVjdDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB1c2VSdW5lc3RvbmVTZXJ2aWNlczogdHJ1ZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKGRhdGEudG9nZ2xlT3B0aW9ucykge1xuICAgICAgICAgICAgICAgIGhpZGVFbGVtZW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29tcG9uZW50LXByZXZpZXdcIikpO1xuICAgICAgICAgICAgICAgIHZhciB0b2dnbGVRdWVzdGlvblNlbGVjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuICAgICAgICAgICAgICAgICAgICBzZWxlY3RvcklkICsgXCItdG9nZ2xlUXVlc3Rpb25cIixcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCB0b2dnbGVRdWVzdGlvblNlbGVjdC5vcHRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvZ2dsZVF1ZXN0aW9uU2VsZWN0Lm9wdGlvbnNbaV0udmFsdWUgPT0gdG9nZ2xlRmlyc3RJRFxuICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvZ2dsZVF1ZXN0aW9uU2VsZWN0LnZhbHVlID0gdG9nZ2xlRmlyc3RJRDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzZWxlY3RvckVsZW1lbnQgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHNlbGVjdG9ySWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0b3JFbGVtZW50LmRhdGFzZXQudG9nZ2xlQ3VycmVudCA9IHRvZ2dsZUZpcnN0SUQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RvckVsZW1lbnQuZGF0YXNldC50b2dnbGVDdXJyZW50VHlwZSA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9nZ2xlUXVlc3Rpb25UeXBlc1swXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRvZ2dsZVF1ZXN0aW9uU2VsZWN0LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICAgICAgICAgIFwiY2hhbmdlXCIsXG4gICAgICAgICAgICAgICAgICAgIGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMudG9nZ2xlUHJldmlldyhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2dnbGVRdWVzdGlvblNlbGVjdC5wYXJlbnRFbGVtZW50LmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEudG9nZ2xlT3B0aW9ucyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2dnbGVRdWVzdGlvblR5cGVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9nQm9va0V2ZW50KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudDogXCJ2aWV3X3RvZ2dsZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdDogdG9nZ2xlUXVlc3Rpb25TZWxlY3QudmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGl2X2lkOiB0b2dnbGVRdWVzdGlvblNlbGVjdC5wYXJlbnRFbGVtZW50LmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0uYmluZCh0aGlzKSxcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9XG5cbiAgICAvLyByZXRyaWV2ZSBodG1sIHNvdXJjZSBvZiBhIHF1ZXN0aW9uLCBmb3IgdXNlIGluIHZhcmlvdXMgdG9nZ2xlIGZ1bmN0aW9uYWxpdGllc1xuICAgIGFzeW5jIGdldFRvZ2dsZVNyYyh0b2dnbGVRdWVzdGlvbklEKSB7XG4gICAgICAgIGxldCByZXF1ZXN0ID0gbmV3IFJlcXVlc3QoXG4gICAgICAgICAgICBgJHtlQm9va0NvbmZpZy5uZXdfc2VydmVyX3ByZWZpeH0vYXNzZXNzbWVudC9odG1sc3JjP2FjaWQ9JHt0b2dnbGVRdWVzdGlvbklEfWAsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgKTtcbiAgICAgICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2gocmVxdWVzdCk7XG4gICAgICAgIGxldCBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICBsZXQgaHRtbHNyYyA9IGRhdGEuZGV0YWlsO1xuICAgICAgICByZXR1cm4gaHRtbHNyYztcbiAgICB9XG5cbiAgICAvLyBvbiBjaGFuZ2luZyB0aGUgdmFsdWUgb2YgdG9nZ2xlIHNlbGVjdCBkcm9wZG93biwgcmVuZGVyIHNlbGVjdGVkIHF1ZXN0aW9uIGluIHByZXZpZXcgcGFuZWwsIGFkZCBhcHByb3ByaWF0ZSBidXR0b25zLCB0aGVuIG1ha2UgcHJldmlldyBwYW5lbCB2aXNpYmxlXG4gICAgYXN5bmMgdG9nZ2xlUHJldmlldyhwYXJlbnRJRCwgdG9nZ2xlT3B0aW9ucywgdG9nZ2xlUXVlc3Rpb25UeXBlcykge1xuICAgICAgICBjb25zdCB0b2dnbGVCdXR0b25zID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0b2dnbGUtYnV0dG9uc1wiKTtcbiAgICAgICAgdG9nZ2xlQnV0dG9ucy5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgICB2YXIgcGFyZW50RGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocGFyZW50SUQpO1xuICAgICAgICB2YXIgdG9nZ2xlUXVlc3Rpb25TZWxlY3QgPSBwYXJlbnREaXYuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzZWxlY3RcIilbMF07XG4gICAgICAgIHZhciBzZWxlY3RlZFF1ZXN0aW9uID1cbiAgICAgICAgICAgIHRvZ2dsZVF1ZXN0aW9uU2VsZWN0Lm9wdGlvbnNbdG9nZ2xlUXVlc3Rpb25TZWxlY3Quc2VsZWN0ZWRJbmRleF1cbiAgICAgICAgICAgICAgICAudmFsdWU7XG4gICAgICAgIHZhciBodG1sc3JjID0gYXdhaXQgdGhpcy5nZXRUb2dnbGVTcmMoc2VsZWN0ZWRRdWVzdGlvbik7XG4gICAgICAgIHJlbmRlclJ1bmVzdG9uZUNvbXBvbmVudChodG1sc3JjLCBcInRvZ2dsZS1wcmV2aWV3XCIsIHtcbiAgICAgICAgICAgIHNlbGVjdG9yX2lkOiBcInRvZ2dsZS1wcmV2aWV3XCIsXG4gICAgICAgICAgICBpc190b2dnbGU6IHRoaXMudG9nZ2xlT3B0aW9ucyxcbiAgICAgICAgICAgIGlzX3NlbGVjdDogdHJ1ZSxcbiAgICAgICAgICAgIHVzZVJ1bmVzdG9uZVNlcnZpY2VzOiB0cnVlLFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBhZGQgXCJDbG9zZSBQcmV2aWV3XCIgYnV0dG9uIHRvIHRoZSBwcmV2aWV3IHBhbmVsXG4gICAgICAgIGxldCBjbG9zZUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICAgIGNsb3NlQnV0dG9uLnRleHRDb250ZW50ID0gXCJDbG9zZSBQcmV2aWV3XCI7XG4gICAgICAgIGNsb3NlQnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJidG5cIiwgXCJidG4tZGVmYXVsdFwiKTtcbiAgICAgICAgY2xvc2VCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgIFwiY2xpY2tcIixcbiAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRvZ2dsZS1wcmV2aWV3XCIpLmlubmVySFRNTCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgdG9nZ2xlUXVlc3Rpb25TZWxlY3QudmFsdWUgPVxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChwYXJlbnRJRCkuZGF0YXNldC50b2dnbGVDdXJyZW50O1xuICAgICAgICAgICAgICAgIGhpZGVFbGVtZW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29tcG9uZW50LXByZXZpZXdcIikpO1xuICAgICAgICAgICAgICAgIHRoaXMubG9nQm9va0V2ZW50KHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQ6IFwiY2xvc2VfdG9nZ2xlXCIsXG4gICAgICAgICAgICAgICAgICAgIGFjdDogdG9nZ2xlUXVlc3Rpb25TZWxlY3QudmFsdWUsXG4gICAgICAgICAgICAgICAgICAgIGRpdl9pZDogdG9nZ2xlUXVlc3Rpb25TZWxlY3QucGFyZW50RWxlbWVudC5pZCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSxcbiAgICAgICAgKTtcbiAgICAgICAgdG9nZ2xlQnV0dG9ucy5hcHBlbmRDaGlsZChjbG9zZUJ1dHRvbik7XG5cbiAgICAgICAgLy8gaWYgXCJsb2NrXCIgaXMgbm90IGluIHRvZ2dsZSBvcHRpb25zLCB0aGVuIGFsbG93IGFkZGluZyBtb3JlIGJ1dHRvbnMgdG8gdGhlIHByZXZpZXcgcGFuZWxcbiAgICAgICAgaWYgKCF0b2dnbGVPcHRpb25zLmluY2x1ZGVzKFwibG9ja1wiKSkge1xuICAgICAgICAgICAgbGV0IHNldEJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICAgICAgICBzZXRCdXR0b24udGV4dENvbnRlbnQgPSBcIlNlbGVjdCB0aGlzIFByb2JsZW1cIjtcbiAgICAgICAgICAgIHNldEJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwiYnRuXCIsIFwiYnRuLXByaW1hcnlcIik7XG4gICAgICAgICAgICBzZXRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgICAgICBcImNsaWNrXCIsXG4gICAgICAgICAgICAgICAgYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnRvZ2dsZVNldChcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudElELFxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRRdWVzdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgIGh0bWxzcmMsXG4gICAgICAgICAgICAgICAgICAgICAgICB0b2dnbGVRdWVzdGlvblR5cGVzLFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBoaWRlRWxlbWVudChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbXBvbmVudC1wcmV2aWV3XCIpKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2dCb29rRXZlbnQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQ6IFwic2VsZWN0X3RvZ2dsZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgYWN0OiBzZWxlY3RlZFF1ZXN0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGl2X2lkOiBwYXJlbnRJRCxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHRvZ2dsZUJ1dHRvbnMuYXBwZW5kQ2hpbGQoc2V0QnV0dG9uKTtcblxuICAgICAgICAgICAgLy8gaWYgXCJ0cmFuc2ZlclwiIGluIHRvZ2dsZSBvcHRpb25zLCBhbmQgaWYgY3VycmVudCBxdWVzdGlvbiB0eXBlIGlzIFBhcnNvbnMgYW5kIHNlbGVjdGVkIHF1ZXN0aW9uIHR5cGUgaXMgYWN0aXZlIGNvZGUsIHRoZW4gYWRkIFwiVHJhbnNmZXJcIiBidXR0b24gdG8gcHJldmlldyBwYW5lbFxuICAgICAgICAgICAgaWYgKHRvZ2dsZU9wdGlvbnMuaW5jbHVkZXMoXCJ0cmFuc2ZlclwiKSkge1xuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50VHlwZSA9XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHBhcmVudElEKS5kYXRhc2V0LnRvZ2dsZUN1cnJlbnRUeXBlO1xuICAgICAgICAgICAgICAgIHZhciBzZWxlY3RlZFR5cGUgPVxuICAgICAgICAgICAgICAgICAgICB0b2dnbGVRdWVzdGlvblR5cGVzW3RvZ2dsZVF1ZXN0aW9uU2VsZWN0LnNlbGVjdGVkSW5kZXhdO1xuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFR5cGUgPT0gXCJQYXJzb25zIE1peGVkLVVwIENvZGVcIiAmJlxuICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZFR5cGUgPT0gXCJBY3RpdmUgV3JpdGUgQ29kZVwiXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCB0cmFuc2ZlckJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICAgICAgICAgICAgICAgIHRyYW5zZmVyQnV0dG9uLnRleHRDb250ZW50ID0gXCJUcmFuc2ZlciBSZXNwb25zZVwiO1xuICAgICAgICAgICAgICAgICAgICB0cmFuc2ZlckJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwiYnRuXCIsIFwiYnRuLXByaW1hcnlcIik7XG4gICAgICAgICAgICAgICAgICAgIHRyYW5zZmVyQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsaWNrXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy50b2dnbGVUcmFuc2ZlcihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50SUQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkUXVlc3Rpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGh0bWxzcmMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvZ2dsZVF1ZXN0aW9uVHlwZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0uYmluZCh0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgdG9nZ2xlQnV0dG9ucy5hcHBlbmRDaGlsZCh0cmFuc2ZlckJ1dHRvbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc2hvd0VsZW1lbnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb21wb25lbnQtcHJldmlld1wiKSk7XG4gICAgfVxuXG4gICAgLy8gb24gY2xpY2tpbmcgXCJTZWxlY3QgdGhpcyBQcm9ibGVtXCIgYnV0dG9uLCBjbG9zZSBwcmV2aWV3IHBhbmVsLCByZXBsYWNlIGN1cnJlbnQgcXVlc3Rpb24gaW4gYXNzaWdubWVudHMgcGFnZSB3aXRoIHNlbGVjdGVkIHF1ZXN0aW9uLCBhbmQgc2VuZCByZXF1ZXN0IHRvIHVwZGF0ZSBncmFkaW5nIGRhdGFiYXNlXG4gICAgLy8gXyBgdG9nZ2xlU2V0YFxuICAgIGFzeW5jIHRvZ2dsZVNldChwYXJlbnRJRCwgc2VsZWN0ZWRRdWVzdGlvbiwgaHRtbHNyYywgdG9nZ2xlUXVlc3Rpb25UeXBlcykge1xuICAgICAgICB2YXIgc2VsZWN0b3JJZCA9IHBhcmVudElEICsgXCItdG9nZ2xlU2VsZWN0ZWRRdWVzdGlvblwiO1xuICAgICAgICB2YXIgdG9nZ2xlUXVlc3Rpb25TZWxlY3QgPSBkb2N1bWVudFxuICAgICAgICAgICAgLmdldEVsZW1lbnRCeUlkKHBhcmVudElEKVxuICAgICAgICAgICAgLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic2VsZWN0XCIpWzBdO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChzZWxlY3RvcklkKS5pbm5lckhUTUwgPSBcIlwiOyAvLyBuZWVkIHRvIGNoZWNrIHdoZXRoZXIgdGhpcyBpcyBldmVuIG5lY2Vzc2FyeVxuICAgICAgICAvLyBUZWFyIHRoZSBwcmV2aWV3IGRvd24gZmlyc3Q6IGl0IGhvbGRzIGEgY29weSBvZiB0aGUgcXVlc3Rpb24gd2UgYXJlXG4gICAgICAgIC8vIGFib3V0IHRvIHJlbmRlciwgYW5kIHR3byBsaXZlIGNvcGllcyBvZiB0aGUgc2FtZSBkaXZpZCBhdCBvbmNlXG4gICAgICAgIC8vIGNvbmZ1c2UgY29tcG9uZW50cyB0aGF0IGxvb2sgdGhlaXIgcGllY2VzIHVwIGJ5IGlkLlxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRvZ2dsZS1wcmV2aWV3XCIpLmlubmVySFRNTCA9IFwiXCI7XG4gICAgICAgIGF3YWl0IHJlbmRlclJ1bmVzdG9uZUNvbXBvbmVudChodG1sc3JjLCBzZWxlY3RvcklkLCB7XG4gICAgICAgICAgICBzZWxlY3Rvcl9pZDogc2VsZWN0b3JJZCxcbiAgICAgICAgICAgIGlzX3RvZ2dsZTogdGhpcy50b2dnbGVPcHRpb25zLFxuICAgICAgICAgICAgaXNfc2VsZWN0OiB0cnVlLFxuICAgICAgICAgICAgdXNlUnVuZXN0b25lU2VydmljZXM6IHRydWUsXG4gICAgICAgIH0pO1xuICAgICAgICBsZXQgcmVxdWVzdCA9IG5ldyBSZXF1ZXN0KFxuICAgICAgICAgICAgYCR7ZUJvb2tDb25maWcubmV3X3NlcnZlcl9wcmVmaXh9L2Fzc2Vzc21lbnQvc2V0X3NlbGVjdGVkX3F1ZXN0aW9uP21ldGFpZD0ke3BhcmVudElEfSZzZWxlY3RlZD0ke3NlbGVjdGVkUXVlc3Rpb259YCxcbiAgICAgICAgICAgIHt9LFxuICAgICAgICApO1xuICAgICAgICBhd2FpdCBmZXRjaChyZXF1ZXN0KTtcbiAgICAgICAgbGV0IHBhcmVudERpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHBhcmVudElEKTtcbiAgICAgICAgcGFyZW50RGl2LmRhdGFzZXQudG9nZ2xlQ3VycmVudCA9IHNlbGVjdGVkUXVlc3Rpb247XG4gICAgICAgIHBhcmVudERpdi5kYXRhc2V0LnRvZ2dsZUN1cnJlbnRUeXBlID1cbiAgICAgICAgICAgIHRvZ2dsZVF1ZXN0aW9uVHlwZXNbdG9nZ2xlUXVlc3Rpb25TZWxlY3Quc2VsZWN0ZWRJbmRleF07XG4gICAgfVxuXG4gICAgLy8gb24gY2xpY2tpbmcgXCJUcmFuc2ZlclwiIGJ1dHRvbiwgZXh0cmFjdCB0aGUgY3VycmVudCB0ZXh0IGFuZCBpbmRlbnRhdGlvbiBvZiB0aGUgUGFyc29ucyBibG9ja3MgaW4gdGhlIGFuc3dlciBzcGFjZSwgdGhlbiBwYXN0ZSB0aGF0IGludG8gdGhlIHNlbGVjdGVkIGFjdGl2ZSBjb2RlIHF1ZXN0aW9uXG4gICAgYXN5bmMgdG9nZ2xlVHJhbnNmZXIoXG4gICAgICAgIHBhcmVudElELFxuICAgICAgICBzZWxlY3RlZFF1ZXN0aW9uLFxuICAgICAgICBodG1sc3JjLFxuICAgICAgICB0b2dnbGVRdWVzdGlvblR5cGVzLFxuICAgICkge1xuICAgICAgICAvLyByZXRyaWV2ZSBhbGwgUGFyc29ucyBsaW5lcyB3aXRoaW4gdGhlIGFuc3dlciBzcGFjZSBhbmQgbG9vcCB0aHJvdWdoIHRoaXMgbGlzdFxuICAgICAgICB2YXIgY3VycmVudFBhcnNvbnMgPSBkb2N1bWVudFxuICAgICAgICAgICAgLmdldEVsZW1lbnRCeUlkKHBhcmVudElEICsgXCItdG9nZ2xlU2VsZWN0ZWRRdWVzdGlvblwiKVxuICAgICAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoXCJkaXZbY2xhc3NePSdhbnN3ZXInXVwiKVswXVxuICAgICAgICAgICAgLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJwcmV0dHlwcmludCBsYW5nLXB5XCIpO1xuICAgICAgICB2YXIgY3VycmVudFBhcnNvbnNDbGFzcztcbiAgICAgICAgdmFyIGN1cnJlbnRCbG9ja0luZGVudDtcbiAgICAgICAgdmFyIGluZGVudENvdW50O1xuICAgICAgICB2YXIgaW5kZW50O1xuICAgICAgICB2YXIgcGFyc29uc0xpbmU7XG4gICAgICAgIHZhciBwYXJzb25zTGluZXMgPSBgYDtcbiAgICAgICAgdmFyIGNvdW50O1xuICAgICAgICBmb3IgKHZhciBwID0gMDsgcCA8IGN1cnJlbnRQYXJzb25zLmxlbmd0aDsgcCsrKSB7XG4gICAgICAgICAgICBpbmRlbnRDb3VudCA9IDA7XG4gICAgICAgICAgICBpbmRlbnQgPSBcIlwiO1xuICAgICAgICAgICAgLy8gZm9yIFBhcnNvbnMgYmxvY2tzIHRoYXQgaGF2ZSBidWlsdC1pbiBpbmRlbnRhdGlvbiBpbiB0aGVpciBsaW5lc1xuICAgICAgICAgICAgY3VycmVudFBhcnNvbnNDbGFzcyA9IGN1cnJlbnRQYXJzb25zW3BdLmNsYXNzTGlzdFsyXTtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UGFyc29uc0NsYXNzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRQYXJzb25zQ2xhc3MuaW5jbHVkZXMoXCJpbmRlbnRcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5kZW50Q291bnQgPVxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VJbnQoaW5kZW50Q291bnQpICtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlSW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRQYXJzb25zQ2xhc3Muc2xpY2UoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDYsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRQYXJzb25zQ2xhc3MubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGZvciBQYXJzb25zIGFuc3dlciBzcGFjZXMgd2l0aCB2ZXJ0aWNhbCBsaW5lcyB0aGF0IGFsbG93IHN0dWRlbnQgdG8gZGVmaW5lIHRoZWlyIG93biBsaW5lIGluZGVudGF0aW9uXG4gICAgICAgICAgICBjdXJyZW50QmxvY2tJbmRlbnQgPVxuICAgICAgICAgICAgICAgIGN1cnJlbnRQYXJzb25zW3BdLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5zdHlsZS5sZWZ0O1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRCbG9ja0luZGVudCkge1xuICAgICAgICAgICAgICAgIGluZGVudENvdW50ID1cbiAgICAgICAgICAgICAgICAgICAgcGFyc2VJbnQoaW5kZW50Q291bnQpICtcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VJbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50QmxvY2tJbmRlbnQuc2xpY2UoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50QmxvY2tJbmRlbnQuaW5kZXhPZihcInB4XCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgKSAvIDMwLFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yICh2YXIgZCA9IDA7IGQgPCBpbmRlbnRDb3VudDsgZCsrKSB7XG4gICAgICAgICAgICAgICAgaW5kZW50ICs9IFwiICAgIFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gcmV0cmlldmUgZWFjaCB0ZXh0IHNuaXBwZXQgb2YgZWFjaCBQYXJzb25zIGxpbmUgYW5kIGxvb3AgdGhyb3VnaCB0aGlzIGxpc3RcbiAgICAgICAgICAgIHBhcnNvbnNMaW5lID0gY3VycmVudFBhcnNvbnNbcF0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzcGFuXCIpO1xuICAgICAgICAgICAgY291bnQgPSAwO1xuICAgICAgICAgICAgZm9yICh2YXIgbCA9IDA7IGwgPCBwYXJzb25zTGluZS5sZW5ndGg7IGwrKykge1xuICAgICAgICAgICAgICAgIGlmIChwYXJzb25zTGluZVtsXS5jaGlsZE5vZGVzWzBdLm5vZGVOYW1lID09IFwiI3RleHRcIikge1xuICAgICAgICAgICAgICAgICAgICAvLyBQYXJzb25zIGJsb2NrcyBoYXZlIGRpZmZlcmluZyBhbW91bnRzIG9mIGhpZXJhcmNoeSBsZXZlbHMgKHNwYW5zIHdpdGhpbiBzcGFucylcbiAgICAgICAgICAgICAgICAgICAgaWYgKHAgPT0gMCAmJiBjb3VudCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBuZWVkIGRpZmZlcmVudCBjaGVjayB0aGFuIGwgPT0gMCBiZWNhdXNlIHRoZSBsIG51bWJlcmluZyBkb2Vzbid0IGFsaWduIHdpdGggbG9jYXRpb24gd2l0aGluIGxpbmUgZHVlIHRvIGluY29uc2lzdGVudCBzcGFuIGhlaXJhcmNoeVxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc29uc0xpbmVzICs9IGluZGVudCArIHBhcnNvbnNMaW5lW2xdLmlubmVySFRNTDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY291bnQgIT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc29uc0xpbmVzICs9IHBhcnNvbnNMaW5lW2xdLmlubmVySFRNTDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJzb25zTGluZXMgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNvbnNMaW5lcyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGAgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGVudCArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyc29uc0xpbmVbbF0uaW5uZXJIVE1MO1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc29uc0xpbmVzID0gcGFyc29uc0xpbmVzLnJlcGxhY2UoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb3VudCsrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIHJlcGxhY2UgYWxsIGV4aXN0aW5nIGNvZGUgd2l0aGluIHNlbGVjdGVkIGFjdGl2ZSBjb2RlIHF1ZXN0aW9uIHdpdGggZXh0cmFjdGVkIFBhcnNvbnMgdGV4dFxuICAgICAgICB2YXIgaHRtbHNyY0Zvcm1lciA9IGh0bWxzcmMuc2xpY2UoXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgaHRtbHNyYy5pbmRleE9mKFwiPHRleHRhcmVhXCIpICtcbiAgICAgICAgICAgICAgICBodG1sc3JjLnNwbGl0KFwiPHRleHRhcmVhXCIpWzFdLmluZGV4T2YoXCI+XCIpICtcbiAgICAgICAgICAgICAgICAxMCxcbiAgICAgICAgKTtcbiAgICAgICAgdmFyIGh0bWxzcmNMYXR0ZXIgPSBodG1sc3JjLnNsaWNlKFxuICAgICAgICAgICAgaHRtbHNyYy5pbmRleE9mKFwiPC90ZXh0YXJlYT5cIiksXG4gICAgICAgICAgICBodG1sc3JjLmxlbmd0aCxcbiAgICAgICAgKTtcbiAgICAgICAgaHRtbHNyYyA9IGh0bWxzcmNGb3JtZXIgKyBwYXJzb25zTGluZXMgKyBodG1sc3JjTGF0dGVyO1xuXG4gICAgICAgIGF3YWl0IHRoaXMudG9nZ2xlU2V0KFxuICAgICAgICAgICAgcGFyZW50SUQsXG4gICAgICAgICAgICBzZWxlY3RlZFF1ZXN0aW9uLFxuICAgICAgICAgICAgaHRtbHNyYyxcbiAgICAgICAgICAgIHRvZ2dsZVF1ZXN0aW9uVHlwZXMsXG4gICAgICAgICk7XG4gICAgICAgIGhpZGVFbGVtZW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29tcG9uZW50LXByZXZpZXdcIikpO1xuICAgIH1cbn1cblxuLy8gVGhlIHByZXZpZXcgcGFuZWwgaXMgc2hhcmVkIGJ5IGFsbCB0b2dnbGUgcXVlc3Rpb25zIG9uIGEgcGFnZSBhbmQgbWF5IG5vdFxuLy8gZXhpc3QgeWV0IHdoZW4gaGlkZGVuL3Nob3duLlxuZnVuY3Rpb24gaGlkZUVsZW1lbnQoZWxlbWVudCkge1xuICAgIGlmIChlbGVtZW50KSB7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gc2hvd0VsZW1lbnQoZWxlbWVudCkge1xuICAgIGlmIChlbGVtZW50KSB7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9IFwiXCI7XG4gICAgfVxufVxuXG5pZiAodHlwZW9mIHdpbmRvdy5jb21wb25lbnRfZmFjdG9yeSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHdpbmRvdy5jb21wb25lbnRfZmFjdG9yeSA9IHt9O1xufVxuXG53aW5kb3cuY29tcG9uZW50X2ZhY3Rvcnkuc2VsZWN0cXVlc3Rpb24gPSBmdW5jdGlvbiAob3B0cykge1xuICAgIHJldHVybiBuZXcgU2VsZWN0T25lKG9wdHMpO1xufTtcblxuLypcbiAqIFdoZW4gdGhlIHBhZ2UgaXMgbG9hZGVkIGFuZCB0aGUgbG9naW4gY2hlY2tzIGFyZSBjb21wbGV0ZSBmaW5kIGFuZCByZW5kZXJcbiAqIGVhY2ggc2VsZWN0cXVlc3Rpb24gY29tcG9uZW50IHRoYXQgaXMgbm90IHBhcnQgb2YgYSB0aW1lZEFzc2Vzc21lbnQuXG4gKiovXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwicnVuZXN0b25lOmxvZ2luLWNvbXBsZXRlXCIsIGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgc2VsUXVlc3Rpb25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcbiAgICAgICAgXCJbZGF0YS1jb21wb25lbnQ9c2VsZWN0cXVlc3Rpb25dXCIsXG4gICAgKTtcbiAgICBmb3IgKGxldCBjcSBvZiBzZWxRdWVzdGlvbnMpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmICghY3EuY2xvc2VzdChcIltkYXRhLWNvbXBvbmVudD10aW1lZEFzc2Vzc21lbnRdXCIpKSB7XG4gICAgICAgICAgICAgICAgLy8gSWYgdGhpcyBlbGVtZW50IGV4aXN0cyB3aXRoaW4gYSB0aW1lZCBjb21wb25lbnQsIGRvbid0IHJlbmRlciBpdCBoZXJlXG4gICAgICAgICAgICAgICAgbGV0IHRtcCA9IG5ldyBTZWxlY3RPbmUoeyBvcmlnOiBjcSB9KTtcbiAgICAgICAgICAgICAgICBhd2FpdCB0bXAuaW5pdGlhbGl6ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBFcnJvciByZW5kZXJpbmcgTmV3IEV4ZXJjaXNlICR7Y3EuaWR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgRGV0YWlsczogJHtlcnJ9YCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIuc3RhY2spO1xuICAgICAgICB9XG4gICAgfVxufSk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=