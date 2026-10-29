"use strict";
(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_dragndrop_js_timeddnd_js"],{

/***/ 2053:
/*!**********************************************************!*\
  !*** ./runestone/dragndrop/js/dragndrop-i18n.sr-Cyrl.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/rsi18n.js */ 54250);


(0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.load)({
    "sr-Cyrl": {
        msg_dragndrop_correct_answer: "Тачан одговор!",
        msg_dragndrop_incorrect_answer:
            "Нетачно. Добили сте $1 тачних и $2 нетачних од $3. Остало вам је $4 празнина.",
        msg_dragndrop_place_more:
            "Молимо вас да поставите све картице пре провере одговора. Остало вам је још $1 за постављање.",
        msg_dragndrop_check_me: "Провери",
        msg_dragndrop_reset: "Поништи",
        msg_dragndrop_card_feedback: "Повратна информација за $1",
        msg_dragndrop_card_feedback_tip: "Прикажи повратну информацију",
    },
});


/***/ }),

/***/ 8152:
/*!**********************************************!*\
  !*** ./runestone/common/js/xmlconversion.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   QuestionXmlConverter: () => (/* binding */ QuestionXmlConverter)
/* harmony export */ });
/*
 * Base class for converting a question authored as XML into the JSON shape the
 * interactive components consume:
 *
 *   { statement, feedback,
 *     left:  [{id, label, feedback?}, ...],   // <premise> elements
 *     right: [{id, label, feedback?}, ...],   // <response> elements
 *     correctAnswers: [[leftId, rightId], ...] }
 *
 * A <premise> or <response> may carry its own <feedback> (PreTeXt "cardsort"
 * with feedback on cards); it is included only when present and non-empty.
 *
 * The pieces every question type shares -- parsing, the <statement>/<feedback>
 * tags, and the <premise>/<response> lists -- live here. How the answer key is
 * expressed differs between components, so subclasses override correctAnswers().
 */
class QuestionXmlConverter {
    constructor(xmlString) {
        const parser = new DOMParser();
        // Parse as HTML so that markup inside <statement>/<label> (e.g. <p>,
        // math spans) is preserved and reachable via innerHTML.
        this.doc = parser.parseFromString(
            expandSelfClosingTags(xmlString),
            "text/html",
        );
        const err = this.doc.querySelector("parsererror");
        if (err) {
            throw new Error("XML parse error: " + err.textContent);
        }
        // The question's root element, e.g. <dragndrop> or <matching>.
        this.root = this.doc.body.firstElementChild || this.doc.body;
    }

    // The question-level <statement> or <feedback>: a child of the root, not
    // the <feedback> of a card, which may come first in document order.
    rootChild(tagName) {
        return (
            childElement(this.root, tagName) || this.doc.querySelector(tagName)
        );
    }

    getStatement() {
        const el = this.rootChild("statement");
        return el ? el.innerHTML.trim() : "";
    }

    getFeedback() {
        const el = this.rootChild("feedback");
        return el ? el.innerHTML.trim() : "";
    }

    // Extract [{ id, label, feedback? }, ...] from every <premise> or
    // <response> element. innerHTML preserves any markup inside the label.
    itemsFrom(tagName) {
        return Array.from(this.doc.querySelectorAll(tagName)).map((el) => {
            const idEl = childElement(el, "id");
            const labelEl = childElement(el, "label");
            const feedbackEl = childElement(el, "feedback");
            const item = {
                id: idEl ? idEl.textContent.trim() : "",
                label: labelEl ? labelEl.innerHTML.trim() : "",
            };
            const feedback = feedbackEl ? feedbackEl.innerHTML.trim() : "";
            if (feedback) {
                item.feedback = feedback;
            }
            return item;
        });
    }

    // Returns the answer key as [[leftId, rightId], ...]. The way answers are
    // expressed in the XML is component specific, so subclasses must implement
    // this.
    correctAnswers() {
        throw new Error(
            "correctAnswers() must be implemented by a subclass of QuestionXmlConverter",
        );
    }

    toJson() {
        return {
            statement: this.getStatement(),
            feedback: this.getFeedback(),
            left: this.itemsFrom("premise"),
            right: this.itemsFrom("response"),
            correctAnswers: this.correctAnswers(),
        };
    }
}

function childElement(parent, tagName) {
    return Array.from(parent.children).find(
        (child) => child.localName === tagName,
    );
}

// HTML elements that are legitimately written as <tag/>.
const VOID_ELEMENTS = new Set([
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
]);

/*
 * The HTML parser ignores the slash in <feedback/> and treats it as an open
 * tag, so everything after it would end up inside the empty element. An XML
 * serializer (lxml, when the manifest is stored in the database) writes empty
 * elements that way, e.g. an exercise with no <feedback> or an <answer/>.
 */
function expandSelfClosingTags(xmlString) {
    return xmlString.replace(
        /<([A-Za-z][\w:-]*)((?:\s+[^<>]*?)?)\s*\/>/g,
        (match, tag, attrs) =>
            VOID_ELEMENTS.has(tag.toLowerCase())
                ? match
                : `<${tag}${attrs}></${tag}>`,
    );
}


/***/ }),

/***/ 17558:
/*!********************************************!*\
  !*** ./runestone/dragndrop/js/timeddnd.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TimedDragNDrop)
/* harmony export */ });
/* harmony import */ var _dragndrop_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dragndrop.js */ 23332);




class TimedDragNDrop extends _dragndrop_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(opts) {
        super(opts);
        this.finishSettingUp();
        this.renderTimedIcon(this.containerDiv);
        this.hideButtons();
    }
    hideButtons() {
        this.submitButton.style.display = "none";
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
        // Returns if the question was correct.    Used for timed assessment grading.
        if (this.unansweredNum === this.premiseArray.length) {
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
        this.feedBackDiv.style.display = "none";
    }
}

if (typeof window.component_factory === "undefined") {
    window.component_factory = {};
}
window.component_factory["dragndrop"] = function (opts) {
    if (opts.timed) {
        return new TimedDragNDrop(opts);
    }
    return new _dragndrop_js__WEBPACK_IMPORTED_MODULE_0__["default"](opts);
};


/***/ }),

/***/ 23332:
/*!*********************************************!*\
  !*** ./runestone/dragndrop/js/dragndrop.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DragNDrop)
/* harmony export */ });
/* harmony import */ var _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/runestonebase.js */ 78673);
/* harmony import */ var _common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../common/js/rsi18n.js */ 54250);
/* harmony import */ var _common_js_mathjax_a11y_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../common/js/mathjax-a11y.js */ 47937);
/* harmony import */ var _xmlconversion_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./xmlconversion.js */ 61920);
/* harmony import */ var _css_dragndrop_less__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../css/dragndrop.less */ 76512);
/* harmony import */ var _dragndrop_i18n_en_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./dragndrop-i18n.en.js */ 32552);
/* harmony import */ var _dragndrop_i18n_pt_br_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./dragndrop-i18n.pt-br.js */ 81264);
/* harmony import */ var _dragndrop_i18n_sr_Cyrl_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./dragndrop-i18n.sr-Cyrl.js */ 2053);
/*==========================================
=======     Master dragndrop.js     ========
============================================
===     This file contains the JS for    ===
=== the Runestone Drag n drop component. ===
============================================
===              Created by              ===
===           Isaiah Mayerchak           ===
===                7/6/15                ===
===              Brad MIller             ===
===                2/7/19                ===
===               12/30/24               ===
==========================================*/

/*
 * Some terminology:
 * - draggable: the element that is being dragged
 * - dropzone: the element that is being dropped on
 * - premise: the element that is being dragged
 * - response: the element that is being dropped on
 * - category: each premis and response have a category.  Several premises can have the same category
 * and be dropped onto the same response.  If a premise has no response its category will not be in
 * the list of categories.
 *
 * Key variables:
 * - dragArray: an array of draggable elements
 * - dropArray: an array of dropzone elements
 * - categories: an array of all categories
 */










//import "./DragDropTouch.js";

// The student must have at least this many gradeable tries before misplaced
// blocks are colored red.
const MIN_TRIES_FOR_COLOR = 3;

class DragNDrop extends _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(opts) {
        super(opts);
        var orig = opts.orig; // entire <ul> element that will be replaced by new HTML
        this.origElem = orig;
        this.divid = orig.id;
        this.useRunestoneServices = opts.useRunestoneServices;
        this.random = true;
        //check if the original element has a data-random attribute set to the value "no"
        if (this.origElem.dataset.random === "no") {
            this.random = false;
        }
        this.feedback = "";
        this.question = "";
        this.selectedPremise = null;
        this.activeResponse = null;
        // Number of times the student has submitted a gradeable attempt (one
        // where they have placed enough blocks). Misplaced blocks are only
        // colored red once this reaches MIN_TRIES_FOR_COLOR.
        this.tries = 0;
        this.populate(); // Populates this.responseArray, this.premiseArray, this.feedback and this.question
        this.createNewElements();
        this.caption = "Drag-N-Drop";
        this.addCaption("runestone");
        if (typeof Prism !== "undefined") {
            Prism.highlightAllUnder(this.containerDiv);
        }
    }

    /*======================
    === Update variables ===
    ======================*/
    populate() {
        this.responseArray = [];
        this.premiseArray = [];
        // Feedback an author attached to an individual premise or response,
        // keyed by element id: { label, feedback }.
        this.cardFeedback = {};
        let invisibleErrorDiv = document.createElement("div");
        invisibleErrorDiv.classList.add("ptx-runestone-container");
        document.body.appendChild(invisibleErrorDiv);
        console.log("Populating DragNDrop with premises and responses");
        // A question may be authored as a <script> block -- either XML
        // (type="text/xml") or JSON -- in the same shape used by matching,
        // instead of the legacy data-subcomponent markup.
        const script = this.origElem.querySelector("script");
        if (script) {
            this.populateFromScript(script, invisibleErrorDiv);
        } else {
            this.populateFromHtml(invisibleErrorDiv);
        }
    }

    /*
     * Build the premises/responses from the legacy markup where each
     * draggable/dropzone is a data-subcomponent element linked by data-category.
     */
    populateFromHtml(invisibleErrorDiv) {
        this.cards = this.origElem.querySelectorAll(
            "[data-subcomponent='draggable']",
        );
        for (let element of this.cards) {
            this.makePremise(
                element.id,
                element.innerHTML,
                this.getCategory(element),
                invisibleErrorDiv,
            );
        }
        if (this.random) {
            // Shuffle the premiseArray if random is true
            this.premiseArray = shuffleArray(this.premiseArray);
        }
        for (let element of this.origElem.querySelectorAll(
            "[data-subcomponent='dropzone']",
        )) {
            this.makeResponse(
                element.getAttribute("for").replace("drag", "drop"),
                element.innerHTML,
                this.getCategory(element),
            );
        }

        this.question = this.origElem.querySelector(
            "[data-subcomponent='question']",
        ).innerHTML;
        let feedback = this.origElem.querySelector(
            "[data-subcomponent='feedback']",
        );
        if (feedback) {
            this.feedback = feedback.innerHTML;
        }
    }

    /*
     * Build the premises/responses from a <script> representation of the
     * question. The script holds either XML (type="text/xml", parsed by
     * DragndropXmlConverter) or JSON; both yield the same shape used by
     * matching.js:
     *   { statement, feedback,
     *     left:  [{id, label, feedback?}, ...],   // draggables (premises)
     *     right: [{id, label, feedback?}, ...],   // dropzones (responses)
     *     correctAnswers: [[leftId, rightId], ...] }
     * A premise belongs in the dropzone given by its correctAnswers pair, so we
     * use the response id as the shared category. Several premises may map to
     * the same response (many-to-one). A premise that appears in no pair is a
     * distractor and gets a category that matches no dropzone. A card's
     * optional feedback is shown when that card ends up in the wrong place.
     */
    populateFromScript(script, invisibleErrorDiv) {
        let data;
        try {
            if (script.type == "text/xml") {
                data = new _xmlconversion_js__WEBPACK_IMPORTED_MODULE_3__.DragndropXmlConverter(script.textContent).toJson();
            } else {
                data = JSON.parse(script.textContent);
            }
        } catch (err) {
            console.error("Failed to parse dragndrop question data:", err);
            return;
        }
        this.boxData = data;
        let premiseCategory = {};
        for (let pair of data.correctAnswers || []) {
            premiseCategory[pair[0]] = pair[1];
        }
        for (let item of data.left || []) {
            let category = premiseCategory[item.id] || "distractor-" + item.id;
            this.makePremise(item.id, item.label, category, invisibleErrorDiv);
            this.addCardFeedback(item);
        }
        if (this.random) {
            // Shuffle the premiseArray if random is true
            this.premiseArray = shuffleArray(this.premiseArray);
        }
        for (let item of data.right || []) {
            // A response's category is its own id; the premises that belong in
            // it share that category.
            this.makeResponse(item.id, item.label, item.id);
            this.addCardFeedback(item);
        }
        this.question = data.statement || "";
        this.feedback = data.feedback || "";
    }

    addCardFeedback(item) {
        if (item.feedback) {
            this.cardFeedback[item.id] = {
                label: item.label,
                feedback: item.feedback,
            };
        }
    }

    /*
     * Create a draggable premise span and register it. Shared by the HTML and
     * JSON population paths.
     */
    makePremise(id, label, category, invisibleErrorDiv) {
        let replaceSpan = document.createElement("span");
        replaceSpan.innerHTML = label;
        replaceSpan.id = id;
        replaceSpan.setAttribute("draggable", "true");
        replaceSpan.classList.add("draggable-drag");
        replaceSpan.classList.add("premise");
        replaceSpan.tabIndex = 0;
        replaceSpan.setAttribute("role", "button");
        replaceSpan.dataset.category = category;
        replaceSpan.dataset.parent_id = this.divid;
        this.premiseArray.push(replaceSpan);
        this.updatePremiseAriaLabel(replaceSpan);
        this.setDragListeners(replaceSpan);
        // now create an error message for when the premise is dropped in the wrong place
        let errorMessage = document.createElement("div");
        errorMessage.classList.add("visuallyhidden");
        errorMessage.innerHTML =
            "Incorrect drop zone for " + replaceSpan.innerHTML;
        errorMessage.setAttribute("role", "alert");
        errorMessage.id = replaceSpan.id + "_error";
        invisibleErrorDiv.appendChild(errorMessage);
        return replaceSpan;
    }

    /*
     * Create a dropzone response span and register it. Shared by the HTML and
     * JSON population paths.
     */
    makeResponse(id, label, category) {
        let replaceSpan = document.createElement("span");
        replaceSpan.innerHTML = label;
        replaceSpan.id = id;
        replaceSpan.classList.add("draggable-drop", "drop-label", "response");
        // Responses enter the tab order only while a premise is selected.
        replaceSpan.tabIndex = -1;
        replaceSpan.setAttribute("role", "button");
        replaceSpan.dataset.category = category;
        replaceSpan.dataset.parent_id = this.divid;
        this.responseArray.push(replaceSpan);
        this.setDropListeners(replaceSpan);
        return replaceSpan;
    }

    getCategory(elem) {
        if (elem.dataset.category) {
            return elem.dataset.category;
        } else {
            // if no category then use the for attribute or the id
            // this is for backwards compatibility
            if (elem.hasAttribute("for")) {
                return elem.getAttribute("for");
            } else {
                return elem.id;
            }
        }
    }
    /*========================================
    == Create new HTML elements and replace ==
    ==      original element with them      ==
    ========================================*/
    createNewElements() {
        this.containerDiv = document.createElement("div");
        this.containerDiv.id = this.divid;
        this.containerDiv.classList.add("draggable-container");
        this.containerDiv.addEventListener("keydown", (ev) => {
            if (
                (ev.key === "Escape" || ev.key === "Esc") &&
                this.closeCardInfo({ restoreFocus: true })
            ) {
                ev.preventDefault();
            } else if (
                (ev.key === "Escape" || ev.key === "Esc") &&
                this.selectedPremise
            ) {
                ev.preventDefault();
                this.deselectPremise({ restoreFocus: true });
            }
        });
        // Any other click closes an open card feedback popover; clicks on the
        // info button or the popover itself don't propagate this far.
        document.addEventListener("click", () => this.closeCardInfo());
        this.keyboardInstructionDiv = document.createElement("div");
        this.keyboardInstructionDiv.classList.add("visuallyhidden");
        this.keyboardInstructionDiv.setAttribute("aria-live", "polite");
        this.keyboardInstructionDiv.setAttribute("aria-atomic", "true");
        this.containerDiv.appendChild(this.keyboardInstructionDiv);
        this.statementDiv = document.createElement("div");
        this.statementDiv.classList.add("cardsort-statement");
        this.statementDiv.classList.add("exercise-statement");
        try {
            this.statementDiv.innerHTML = this.question;
        } catch (error) {
            console.error("Error setting statementDiv innerHTML:", error);
        }
        this.containerDiv.appendChild(this.statementDiv);
        this.dragDropWrapDiv = document.createElement("div"); // Holds the draggables/dropzones, prevents feedback from bleeding in
        this.dragDropWrapDiv.style.display = "block";
        this.dragDropWrapDiv.classList.add("dragndrop-keyboard-surface");
        this.dragDropWrapDiv.tabIndex = -1;
        this.dragDropWrapDiv.addEventListener("keydown", (ev) => {
            this.handleKeyboardApplicationKeydown(ev);
        });
        this.containerDiv.appendChild(this.dragDropWrapDiv);
        this.draggableDiv = document.createElement("div");
        this.draggableDiv.classList.add("rsdraggable", "dragzone");
        this.addDragDivListeners();
        this.dropZoneDiv = document.createElement("div");
        this.dropZoneDiv.classList.add("rsdraggable");
        this.dragDropWrapDiv.appendChild(this.draggableDiv);
        this.dragDropWrapDiv.appendChild(this.dropZoneDiv);
        this.createButtons();
        this.checkServer("dragNdrop", true);
        if (eBookConfig.practice_mode) {
            this.finishSettingUp();
        }
        this.ivp = this.isValidPremise.bind(this);
        this.queueMathJax(this.containerDiv).then(() => {
            this.disablePremiseMathTabStops();
            this.updatePremiseAriaLabels();
        });
    }

    finishSettingUp() {
        this.appendReplacementSpans();
        this.createFeedbackDiv();
        console.log("Replacing origElem with containerDiv");
        this.origElem.parentNode.replaceChild(this.containerDiv, this.origElem);
        if (!this.hasStoredDropzones) {
            this.minheight = this.draggableDiv.offsetHeight;
            // Ensure MathJax has completed before adjusting the zone widths
            this.queueMathJax(this.containerDiv).then(() => {
                this.disablePremiseMathTabStops();
                this.updatePremiseAriaLabels();
                this.adjustDragDropWidths();
            });
        }
        this.draggableDiv.style.minHeight = this.minheight.toString() + "px";
        if (this.dropZoneDiv.offsetHeight > this.minheight) {
            this.dragDropWrapDiv.style.minHeight =
                this.dropZoneDiv.offsetHeight.toString() + "px";
        } else {
            this.dragDropWrapDiv.style.minHeight =
                this.minheight.toString() + "px";
        }
        this.draggableDiv.style.width = `${this.dragwidth}%`;
        this.dropZoneDiv.style.width = `${this.dropwidth}%`;
    }
    addDragDivListeners() {
        let self = this;
        this.draggableDiv.addEventListener(
            "dragover",
            function (ev) {
                ev.preventDefault();
                if (this.draggableDiv.classList.contains("possibleDrop")) {
                    return;
                }
                this.draggableDiv.classList.add("possibleDrop");
            }.bind(this),
        );
        this.draggableDiv.addEventListener(
            "drop",
            function (ev) {
                this.isAnswered = true;
                ev.preventDefault();
                this.setPointerDragActive(false);
                if (this.draggableDiv.classList.contains("possibleDrop")) {
                    this.draggableDiv.classList.remove("possibleDrop");
                }
                var data = ev.dataTransfer.getData("draggableID");
                var draggedSpan = document.getElementById(data);
                if (
                    !this.draggableDiv.contains(draggedSpan) &&
                    !this.strangerDanger(draggedSpan)
                ) {
                    // Make sure element isn't already there--prevents erros w/appending child
                    this.draggableDiv.appendChild(draggedSpan);
                    this.updatePremiseAriaLabel(draggedSpan);
                    this.adjustDragDropWidths();
                    this.minheight = this.draggableDiv.offsetHeight;
                    this.dragDropWrapDiv.style.minHeight =
                        this.minheight.toString() + "px";
                    this.logBookEvent({
                        event: "dragNdrop-drop",
                        div_id: this.divid,
                        act: `${data} -> dragzone`,
                    });
                }
            }.bind(this),
        );
        this.draggableDiv.addEventListener(
            "dragleave",
            function (e) {
                if (!this.draggableDiv.classList.contains("possibleDrop")) {
                    return;
                }
                this.draggableDiv.classList.remove("possibleDrop");
            }.bind(this),
        );
    }
    createButtons() {
        this.buttonDiv = document.createElement("div");
        this.buttonDiv.classList.add("dnd-button-container");
        this.submitButton = document.createElement("button"); // Check me button
        this.submitButton.textContent = (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_1__.t)("msg_dragndrop_check_me");
        this.submitButton.setAttribute("class", "btn btn-success drag-button");
        this.submitButton.setAttribute("name", "do answer");
        this.submitButton.setAttribute("type", "button");
        this.submitButton.onclick = function () {
            this.checkCurrentAnswer();
            // Only count this as a try once the student has placed enough
            // blocks to be graded.
            if (this.enoughPlaced) {
                this.tries++;
            }
            this.renderFeedback();
            this.logCurrentAnswer();
        }.bind(this);
        this.resetButton = document.createElement("button"); // Check me button
        this.resetButton.textContent = (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_1__.t)("msg_dragndrop_reset");
        this.resetButton.setAttribute(
            "class",
            "btn btn-default drag-button drag-reset",
        );
        this.resetButton.setAttribute("name", "do answer");
        this.resetButton.onclick = function () {
            this.resetDraggables();
        }.bind(this);
        this.buttonDiv.appendChild(this.submitButton);
        this.buttonDiv.appendChild(this.resetButton);
        this.containerDiv.appendChild(this.buttonDiv);
    }
    appendReplacementSpans() {
        if (
            this.answerState === undefined ||
            Object.keys(this.answerState).length === 0
        ) {
            this.answerState = {};
            for (let element of this.premiseArray) {
                this.draggableDiv.appendChild(element);
            }
            for (let element of this.responseArray) {
                this.dropZoneDiv.appendChild(element);
            }
        } else {
            let placedPremises = [];
            for (let response of this.responseArray) {
                this.dropZoneDiv.appendChild(response);
                if (this.answerState[response.id]) {
                    for (let premise of this.answerState[response.id]) {
                        placedPremises.push(premise);
                        let foundPremise = this.findPremise(premise);
                        if (foundPremise) {
                            response.appendChild(foundPremise);
                        } else {
                            console.warn(
                                `Premise with ID ${premise} not found in premiseArray`,
                            );
                        }
                    }
                }
            }
            for (let premise of this.premiseArray) {
                if (placedPremises.indexOf(premise.id) == -1) {
                    this.draggableDiv.appendChild(premise);
                }
            }
        }
        this.updatePremiseAriaLabels();
    }

    getResponseLabel(response) {
        if (!response) {
            return "";
        }
        const responseClone = response.cloneNode(true);
        for (const premise of responseClone.querySelectorAll(
            ".premise, .draggable-card-info",
        )) {
            premise.remove();
        }
        return (0,_common_js_mathjax_a11y_js__WEBPACK_IMPORTED_MODULE_2__.getAccessibleElementText)(responseClone);
    }

    updatePremiseAriaLabel(premise) {
        // Every move of a premise ends here. Feedback about where it was is
        // stale once it moves, and its info control would be left behind.
        let info = this.cardInfoFor(premise);
        if (info && premise.nextElementSibling !== info) {
            this.removeCardInfo(premise);
        }
        // A premise returned to the left column is no longer misplaced.
        if (premise.parentElement === this.draggableDiv) {
            this.clearPremiseIncorrect(premise);
        }
        const premiseLabel = (0,_common_js_mathjax_a11y_js__WEBPACK_IMPORTED_MODULE_2__.getAccessibleElementText)(premise);
        const response = this.responseArray.includes(premise.parentElement)
            ? premise.parentElement
            : null;
        const placementLabel = response
            ? "placed in " + this.getResponseLabel(response)
            : "unplaced";
        premise.setAttribute(
            "aria-label",
            premiseLabel + " matching premise, " + placementLabel,
        );
    }

    updatePremiseAriaLabels() {
        for (const premise of this.premiseArray) {
            this.updatePremiseAriaLabel(premise);
        }
    }

    findPremise(id) {
        for (let premise of this.premiseArray) {
            if (premise.id == id) {
                return premise;
            }
        }
    }

    countSavedPremises() {
        // Count how many premises are saved in the answerState
        let count = 0;
        let names = {};
        for (let response of this.answerState) {
            if (response.length > 0) {
                for (let premise of response) {
                    if (!names[premise]) {
                        count++;
                        names[premise] = true;
                    }
                }
            }
        }
        return count;
    }

    setDragListeners(dgSpan) {
        dgSpan.setAttribute("aria-pressed", "false");
        dgSpan.addEventListener("dragstart", (ev) => {
            this.deselectPremise();
            this.setPointerDragActive(true);
            ev.dataTransfer.setData("draggableID", ev.target.id);
        });
        dgSpan.addEventListener("dragend", () => {
            this.setPointerDragActive(false);
        });
        dgSpan.addEventListener("dragover", function (ev) {
            ev.preventDefault();
        });
        dgSpan.addEventListener(
            "drop",
            function (ev) {
                this.isAnswered = true;
                ev.preventDefault();
                this.setPointerDragActive(false);
                var data = ev.dataTransfer.getData("draggableID");
                var draggedSpan = document.getElementById(data);
                if (
                    draggedSpan != ev.target &&
                    !this.strangerDanger(draggedSpan)
                ) {
                    // Make sure element isn't already there--prevents errors w/appending child
                    this.draggableDiv.appendChild(draggedSpan);
                    this.updatePremiseAriaLabel(draggedSpan);
                }
            }.bind(this),
        );

        dgSpan.addEventListener("click", (ev) => {
            ev.preventDefault();
            if (this.selectedPremise === dgSpan) {
                this.deselectPremise();
            } else {
                this.selectPremise(dgSpan);
            }
        });

        // Enter or Space picks up a premise. Pressing the same key again puts
        // it down; Escape is handled at the component level so it also works
        // after focus has moved to a response or button.
        dgSpan.addEventListener("keydown", (ev) => {
            if (ev.target !== dgSpan) {
                return;
            }
            if (ev.key === "Enter" || ev.key === " ") {
                ev.preventDefault();
                if (this.selectedPremise === dgSpan) {
                    this.deselectPremise();
                } else {
                    this.selectPremise(dgSpan);
                }
            } else if (
                !this.selectedPremise &&
                (ev.key === "ArrowUp" || ev.key === "ArrowDown")
            ) {
                ev.preventDefault();
                this.movePremiseFocus(dgSpan, ev.key === "ArrowDown");
            } else if (
                !this.selectedPremise &&
                (ev.key === "ArrowLeft" || ev.key === "ArrowRight")
            ) {
                ev.preventDefault();
                this.focusFirstPremiseInColumn(ev.key === "ArrowRight");
            }
        });
    }

    disablePremiseMathTabStops(root = this.containerDiv) {
        (0,_common_js_mathjax_a11y_js__WEBPACK_IMPORTED_MODULE_2__.disableMathJaxTabStops)(root, [".premise", ".response"]);
    }

    movePremiseFocus(premise, moveDown) {
        const premiseTabOrder = Array.from(
            this.containerDiv.querySelectorAll(".premise"),
        ).filter((item) => this.premiseArray.includes(item));
        const currentIndex = premiseTabOrder.indexOf(premise);
        if (currentIndex === -1) {
            return;
        }
        const targetIndex = Math.max(
            0,
            Math.min(
                currentIndex + (moveDown ? 1 : -1),
                premiseTabOrder.length - 1,
            ),
        );
        premiseTabOrder[targetIndex]?.focus();
    }

    focusFirstPremiseInColumn(rightColumn) {
        const column = rightColumn ? this.dropZoneDiv : this.draggableDiv;
        const firstPremise = Array.from(
            column.querySelectorAll(".premise"),
        ).find((item) => this.premiseArray.includes(item));
        firstPremise?.focus();
    }

    setDropListeners(dpSpan) {
        dpSpan.addEventListener(
            "dragover",
            function (ev) {
                this.isAnswered = true;
                ev.preventDefault();
                const dropTarget = ev.currentTarget;
                if (dropTarget.classList.contains("possibleDrop")) {
                    return;
                }
                if (dropTarget.classList.contains("draggable-drop")) {
                    dropTarget.classList.add("possibleDrop");
                }
            }.bind(this),
        );
        dpSpan.addEventListener(
            "dragleave",
            function (ev) {
                this.isAnswered = true;
                ev.preventDefault();
                const dropTarget = ev.currentTarget;
                if (!dropTarget.classList.contains("possibleDrop")) {
                    return;
                }
                dropTarget.classList.remove("possibleDrop");
            }.bind(this),
        );
        dpSpan.addEventListener(
            "drop",
            function (ev) {
                this.isAnswered = true;
                ev.preventDefault();
                this.setPointerDragActive(false);
                const dropTarget = ev.currentTarget;
                if (dropTarget.classList.contains("possibleDrop")) {
                    dropTarget.classList.remove("possibleDrop");
                }
                var data = ev.dataTransfer.getData("draggableID");
                var draggedSpan = document.getElementById(data);
                if (
                    dropTarget.classList.contains("draggable-drop") &&
                    !this.strangerDanger(draggedSpan)
                ) {
                    // Make sure element isn't already there--prevents errors w/appending child
                    dropTarget.appendChild(draggedSpan);
                    this.updatePremiseAriaLabel(draggedSpan);
                    // log a drop event
                    this.logBookEvent({
                        event: "dragNdrop-drop",
                        div_id: this.divid,
                        act: `${data} -> ${dropTarget.id}`,
                    });
                }
                this.queueMathJax(this.containerDiv).then(() => {
                    this.disablePremiseMathTabStops();
                    this.updatePremiseAriaLabels();
                    this.adjustDragDropWidths();
                });
            }.bind(this),
        );

        dpSpan.addEventListener("click", (ev) => {
            if (!this.selectedPremise || ev.target.closest(".premise")) {
                return;
            }
            ev.preventDefault();
            this.placeSelectedPremise(dpSpan);
        });

        // Add keyboard navigation for dropping premises
        dpSpan.addEventListener("keydown", (ev) => {
            if (ev.target !== dpSpan || !this.selectedPremise) {
                return;
            }
            if (ev.key === "Enter" || ev.key === " ") {
                ev.preventDefault();
                this.placeSelectedPremise(dpSpan);
            } else if (ev.key === "Tab") {
                ev.preventDefault();
                this.moveResponseFocus(dpSpan, ev.shiftKey);
            } else if (ev.key === "ArrowUp" || ev.key === "ArrowDown") {
                ev.preventDefault();
                this.moveSelectedPremiseVertically(ev.key === "ArrowDown");
            } else if (ev.key === "ArrowLeft") {
                ev.preventDefault();
                this.returnSelectedPremise();
            } else if (ev.key === "ArrowRight") {
                ev.preventDefault();
                this.moveSelectedPremiseRight(dpSpan);
            }
        });
        // Moving focus with Tab or Shift+Tab previews the selected premise in
        // the newly focused response, just as the vertical arrow keys do.
        dpSpan.addEventListener("focus", () => {
            if (this.selectedPremise) {
                this.setActiveResponse(dpSpan);
            }
        });
    }

    setPointerDragActive(active) {
        this.containerDiv.classList.toggle("pointer-drag-active", active);
    }

    announceKeyboardInstruction(message) {
        if (this.keyboardInstructionDiv) {
            this.keyboardInstructionDiv.textContent = message;
        }
    }

    enterKeyboardApplicationMode(premise) {
        if (!this.dragDropWrapDiv) {
            return;
        }
        const premiseLabel = (0,_common_js_mathjax_a11y_js__WEBPACK_IMPORTED_MODULE_2__.getAccessibleElementText)(premise);
        this.dragDropWrapDiv.tabIndex = 0;
        this.dragDropWrapDiv.setAttribute("role", "application");
        this.dragDropWrapDiv.setAttribute(
            "aria-label",
            `Drag and drop placement for ${premiseLabel}`,
        );
        if (this.activeResponse) {
            this.dragDropWrapDiv.setAttribute(
                "aria-activedescendant",
                this.activeResponse.id,
            );
        }
        this.announceKeyboardInstruction(
            `Moving ${premiseLabel}. Use arrow keys to choose a target, Enter to place, or Escape to cancel.`,
        );
        this.dragDropWrapDiv.focus();
    }

    exitKeyboardApplicationMode() {
        if (!this.dragDropWrapDiv) {
            return;
        }
        this.dragDropWrapDiv.removeAttribute("role");
        this.dragDropWrapDiv.removeAttribute("aria-label");
        this.dragDropWrapDiv.removeAttribute("aria-activedescendant");
        this.dragDropWrapDiv.tabIndex = -1;
    }

    focusKeyboardApplicationSurface() {
        if (this.selectedPremise && this.dragDropWrapDiv) {
            this.dragDropWrapDiv.focus();
        }
    }

    setActiveResponse(response, { movePremise = true } = {}) {
        if (!response) {
            return;
        }
        this.activeResponse = response;
        if (this.dragDropWrapDiv && this.selectedPremise) {
            this.dragDropWrapDiv.setAttribute(
                "aria-activedescendant",
                response.id,
            );
        }
        if (
            movePremise &&
            this.selectedPremise &&
            this.selectedPremise.parentElement !== response
        ) {
            this.moveSelectedPremise(response, response.id);
        }
    }

    moveActiveResponse({ moveBackward = false, wrap = false } = {}) {
        if (!this.selectedPremise || this.responseArray.length === 0) {
            return;
        }
        const offset = moveBackward ? -1 : 1;
        const currentIndex = this.responseArray.indexOf(this.activeResponse);
        let targetIndex;
        if (currentIndex === -1) {
            targetIndex = moveBackward ? this.responseArray.length - 1 : 0;
        } else {
            targetIndex = currentIndex + offset;
        }
        if (wrap) {
            targetIndex =
                (targetIndex + this.responseArray.length) %
                this.responseArray.length;
        } else {
            targetIndex = Math.max(
                0,
                Math.min(targetIndex, this.responseArray.length - 1),
            );
        }
        this.setActiveResponse(this.responseArray[targetIndex]);
        this.focusKeyboardApplicationSurface();
    }

    handleKeyboardApplicationKeydown(ev) {
        if (ev.target !== this.dragDropWrapDiv || !this.selectedPremise) {
            return;
        }
        if (ev.key === "Enter" || ev.key === " ") {
            ev.preventDefault();
            ev.stopPropagation();
            this.placeSelectedPremise(
                this.activeResponse || this.responseArray[0],
            );
        } else if (ev.key === "Escape" || ev.key === "Esc") {
            ev.preventDefault();
            ev.stopPropagation();
            this.deselectPremise({ restoreFocus: true });
        } else if (ev.key === "Tab") {
            ev.preventDefault();
            ev.stopPropagation();
            this.moveActiveResponse({ moveBackward: ev.shiftKey, wrap: true });
        } else if (ev.key === "ArrowUp" || ev.key === "ArrowDown") {
            ev.preventDefault();
            ev.stopPropagation();
            this.moveActiveResponse({
                moveBackward: ev.key === "ArrowUp",
                wrap: false,
            });
        } else if (ev.key === "ArrowLeft") {
            ev.preventDefault();
            ev.stopPropagation();
            this.returnSelectedPremise();
            this.focusKeyboardApplicationSurface();
        } else if (ev.key === "ArrowRight") {
            ev.preventDefault();
            ev.stopPropagation();
            this.moveSelectedPremiseRight(
                this.activeResponse || this.responseArray[0],
            );
            this.focusKeyboardApplicationSurface();
        }
    }

    moveResponseFocus(response, moveBackward) {
        const currentIndex = this.responseArray.indexOf(response);
        const offset = moveBackward ? -1 : 1;
        const targetIndex =
            (currentIndex + offset + this.responseArray.length) %
            this.responseArray.length;
        this.responseArray[targetIndex]?.focus();
    }

    moveSelectedPremiseVertically(moveDown) {
        const premise = this.selectedPremise;
        if (!premise || this.responseArray.length === 0) {
            return;
        }

        const currentIndex = this.responseArray.indexOf(premise.parentElement);
        let targetIndex;
        if (currentIndex === -1) {
            targetIndex = moveDown ? 0 : this.responseArray.length - 1;
        } else {
            targetIndex = currentIndex + (moveDown ? 1 : -1);
            targetIndex = Math.max(
                0,
                Math.min(targetIndex, this.responseArray.length - 1),
            );
        }

        const response = this.responseArray[targetIndex];
        this.activeResponse = response;
        if (response !== premise.parentElement) {
            this.moveSelectedPremise(response, response.id);
        }
        response.focus();
    }

    returnSelectedPremise() {
        const premise = this.selectedPremise;
        if (!premise || premise.parentElement === this.draggableDiv) {
            return;
        }
        this.moveSelectedPremise(this.draggableDiv, "dragzone");
        this.announceKeyboardInstruction("Returned to unplaced list.");
    }

    moveSelectedPremiseRight(response) {
        const premise = this.selectedPremise;
        if (!premise || premise.parentElement !== this.draggableDiv) {
            return;
        }
        this.moveSelectedPremise(response, response.id);
    }

    moveSelectedPremise(destination, destinationName) {
        const premise = this.selectedPremise;
        if (!premise || premise.parentElement === destination) {
            return;
        }
        if (this.responseArray.includes(destination)) {
            this.activeResponse = destination;
        }
        destination.appendChild(premise);
        this.updatePremiseAriaLabel(premise);
        this.isAnswered = true;
        this.logBookEvent({
            event: "dragNdrop-drop",
            div_id: this.divid,
            act: `${premise.id} -> ${destinationName}`,
        });
        this.queueMathJax(this.containerDiv).then(() => {
            this.disablePremiseMathTabStops();
            this.updatePremiseAriaLabels();
            this.adjustDragDropWidths();
        });
    }

    placeSelectedPremise(response) {
        const premise = this.selectedPremise;
        if (!premise || this.strangerDanger(premise)) {
            return;
        }

        if (premise.parentElement === this.draggableDiv) {
            this.deselectPremise();
            premise.focus();
            return;
        }

        this.moveSelectedPremise(response, response.id);
        this.deselectPremise();
        premise.focus();
    }

    selectPremise(premise) {
        this.deselectPremise();
        this.selectedPremise = premise;
        premise.classList.add("selected");
        premise.setAttribute("aria-pressed", "true");
        const currentResponse = this.responseArray.includes(
            premise.parentElement,
        )
            ? premise.parentElement
            : this.responseArray[0];
        this.activeResponse = currentResponse || null;
        this.updateKeyboardNavigation();
        if (currentResponse && premise.parentElement !== currentResponse) {
            this.moveSelectedPremise(currentResponse, currentResponse.id);
        }
        this.enterKeyboardApplicationMode(premise);
    }

    deselectPremise({ restoreFocus = false } = {}) {
        const premise = this.selectedPremise;
        if (!premise) {
            return;
        }
        premise.classList.remove("selected");
        premise.setAttribute("aria-pressed", "false");
        this.selectedPremise = null;
        this.activeResponse = null;
        this.exitKeyboardApplicationMode();
        this.updateKeyboardNavigation();
        if (restoreFocus) {
            premise.focus();
        }
    }

    updateKeyboardNavigation() {
        const premiseTabIndex = this.selectedPremise ? -1 : 0;
        const responseTabIndex = this.selectedPremise ? 0 : -1;
        for (const premise of this.premiseArray) {
            premise.tabIndex = premiseTabIndex;
        }
        for (const response of this.responseArray) {
            response.tabIndex = responseTabIndex;
        }
    }

    adjustDragDropWidths() {
        // Temporarily minimize the dragzone width to the content
        this.draggableDiv.style.width = "fit-content";

        const dragzoneWidth = this.draggableDiv.offsetWidth;
        const totalWidth = this.dragDropWrapDiv.offsetWidth;

        let dragzonePercent = Math.ceil((dragzoneWidth / totalWidth) * 100);
        dragzonePercent = Math.max(28, Math.min(dragzonePercent, 48));
        const dropzonePercent = 100 - dragzonePercent - 4; // 4 accounts for zone padding

        this.dragwidth = dragzonePercent;
        this.dropwidth = dropzonePercent;

        this.draggableDiv.style.width = `${dragzonePercent}%`;
        this.dropZoneDiv.style.width = `${dropzonePercent}%`;
    }

    createFeedbackDiv() {
        if (!this.feedBackDiv) {
            this.feedBackDiv = document.createElement("div");
            this.feedBackDiv.id = this.divid + "_feedback";
            this.feedBackDiv.classList.add("exercise-content");
            this.feedBackDiv.setAttribute("aria-live", "polite");
            this.feedBackDiv.setAttribute("role", "status");
            this.containerDiv.appendChild(this.feedBackDiv);
        }
    }
    /*=======================
    == Auxiliary functions ==
    =======================*/
    /* leaving the name as is, because it reminds me of Isaiah! */
    strangerDanger(testSpan) {
        // Returns true if the test span doesn't belong to this instance of DragNDrop
        if (testSpan.dataset.parent_id != this.divid) {
            return true;
        } else {
            return false;
        }
    }
    /*==============================
    == Reset button functionality ==
    ==============================*/
    resetDraggables() {
        this.deselectPremise();
        this.dropZoneDiv.innerHTML = "";
        for (let response of this.responseArray) {
            response.classList.remove("drop-incorrect");
            this.dropZoneDiv.appendChild(response);
        }
        this.draggableDiv.innerHTML = "";
        // Shuffle the premiseArray if random is true
        if (this.random) {
            this.premiseArray = shuffleArray(this.premiseArray);
        }
        for (let premise of this.premiseArray) {
            // Clear any incorrect highlighting left over from a previous check
            this.clearPremiseIncorrect(premise);
            this.draggableDiv.appendChild(premise);
        }
        this.updatePremiseAriaLabels();
        this.answerState = {};
        // Start the "3 tries before red" cycle over after a reset
        this.tries = 0;
        this.clearCardInfo();
        this.feedBackDiv.style.display = "none";
        this.adjustDragDropWidths();
        this.minheight = this.draggableDiv.offsetHeight;
        this.dragDropWrapDiv.style.minHeight = this.minheight.toString() + "px";
        this.feedBackDiv.style.visibility = "hidden";
        this.logBookEvent({
            event: "dragNdrop-reset",
            div_id: this.divid,
            act: "reset",
        });
        this.setLocalStorage({ correct: "F" });
    }
    /*===========================
    == Evaluation and feedback ==
    ===========================*/
    // The responses in their on-screen order. The dropzone column also holds
    // the info controls of responses with feedback, so skip anything else.
    placedResponses() {
        return Array.from(this.dropZoneDiv.children).filter((el) =>
            this.responseArray.includes(el),
        );
    }

    getAllCategories() {
        this.categories = [];
        for (let response of this.placedResponses()) {
            this.categories.push(response.dataset.category);
        }
        return this.categories;
    }

    checkCurrentAnswer() {
        let categories = this.getAllCategories();
        this.correct = true;
        this.unansweredNum = 0;
        this.incorrectNum = 0;
        this.correctNum = 0;
        this.placedNum = 0;
        this.dragNum = this.premiseArray.length;
        // Distractors are premises whose category does not match any dropzone,
        // i.e. blocks that are not meant to be placed.
        let distractorNum = 0;

        for (let response of this.placedResponses()) {
            // ignore drop zone children that aren't premises
            for (let premise of Array.from(response.childNodes).filter(
                this.ivp,
            )) {
                this.placedNum++;
                if (premise.dataset.category == response.dataset.category) {
                    this.correctNum++;
                } else {
                    this.incorrectNum++;
                }
            }
        }
        for (let premise of this.premiseArray) {
            if (categories.indexOf(premise.dataset.category) == -1) {
                distractorNum++;
            }
        }
        for (let premise of Array.from(this.draggableDiv.childNodes).filter(
            this.ivp,
        )) {
            if (categories.indexOf(premise.dataset.category) == -1) {
                this.correctNum++;
            } else {
                this.unansweredNum++;
            }
        }
        // The student must attempt to place every block that belongs in a
        // dropzone (total premises minus the distractors) before we give any
        // correctness feedback.
        this.requiredPlacements = this.premiseArray.length - distractorNum;
        this.enoughPlaced = this.placedNum >= this.requiredPlacements;
        this.percent = this.correctNum / this.premiseArray.length;
        console.log(this.percent, this.incorrectNum, this.unansweredNum);
        if (this.percent < 1.0) {
            this.correct = false;
        }
        this.setLocalStorage({ correct: this.correct ? "T" : "F" });
    }

    isCorrectDrop(response) {
        // Returns true if all premises in the response are in the correct category
        // and all premises in the category are in the response
        // used by renderFeedback
        let correct = true;
        let correctPlacements = 0;
        for (let premise of Array.from(response.childNodes).filter(this.ivp)) {
            if (premise.dataset.category != response.dataset.category) {
                correct = false;
            } else {
                correctPlacements++;
            }
        }
        let catCount = 0;
        for (let premis of this.premiseArray) {
            if (premis.dataset.category == response.dataset.category) {
                catCount++;
            }
        }
        return correct && correctPlacements == catCount;
    }

    isValidPremise(premise) {
        if (this.premiseArray.includes(premise)) {
            return true;
        } else {
            return false;
        }
    }

    async logCurrentAnswer(sid) {
        let answer = JSON.stringify(this.answerState);
        let data = {
            event: "dragNdrop",
            act: answer,
            answer: answer,
            min_height: Math.round(this.minheight),
            drag_width: this.dragwidth,
            drop_width: this.dropwidth,
            div_id: this.divid,
            correct: this.correct,
            correctNum: this.correctNum,
            dragNum: this.dragNum,
        };
        if (typeof sid !== "undefined") {
            data.sid = sid;
        }
        await this.logBookEvent(data);
    }
    clearPremiseIncorrect(premise) {
        premise.classList.remove("drop-incorrect");
        premise.setAttribute("aria-invalid", "false");
        premise.removeAttribute("aria-errormessage");
        document
            .getElementById(premise.id + "_error")
            ?.classList.add("visuallyhidden");
    }
    clearIncorrectHighlights() {
        // Remove the red "drop-incorrect" highlighting and related a11y
        // attributes from every placed premise.
        for (let response of this.placedResponses()) {
            for (let premise of Array.from(response.childNodes).filter(
                this.ivp,
            )) {
                this.clearPremiseIncorrect(premise);
            }
        }
    }
    renderFeedback() {
        if (!this.feedBackDiv) {
            this.createFeedbackDiv();
        }
        // The reset button hides the feedback area with display:none, so make
        // sure it is shown again whenever we render feedback.
        this.feedBackDiv.style.display = "";
        this.feedBackDiv.style.visibility = "visible";
        this.clearCardInfo();

        // Requirement 1: don't give any correctness feedback until the student
        // has attempted to place all the blocks that belong in a dropzone.
        if (!this.enoughPlaced) {
            this.clearIncorrectHighlights();
            let remaining = this.requiredPlacements - this.placedNum;
            var msgPlaceMore = (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_1__.t)("msg_dragndrop_place_more", remaining);
            setTimeout(() => {
                this.feedBackDiv.innerHTML = `<div class="para">${msgPlaceMore}</div>`;
            }, 10);
            this.feedBackDiv.className =
                "alert alert-warning draggable-feedback exercise-content";
            this.queueMathJax(this.feedBackDiv);
            return;
        }

        // Requirement 2: only color the misplaced blocks red once the student
        // has had at least MIN_TRIES_FOR_COLOR gradeable tries.
        let showColors = this.tries >= MIN_TRIES_FOR_COLOR;
        for (let response of this.placedResponses()) {
            // iterate over all the premises in the response
            for (let premise of Array.from(response.childNodes).filter(
                this.ivp,
            )) {
                // if the premise is not in the correct category, add the class
                if (
                    showColors &&
                    premise.dataset.category != response.dataset.category
                ) {
                    premise.classList.add("drop-incorrect");
                    premise.setAttribute("aria-invalid", "true");
                    premise.setAttribute(
                        "aria-errormessage",
                        premise.id + "_error",
                    );
                    document
                        .getElementById(premise.id + "_error")
                        .classList.remove("visuallyhidden");
                } else {
                    this.clearPremiseIncorrect(premise);
                }
            }
        }
        if (this.correct) {
            var msgCorrect = (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_1__.t)("msg_dragndrop_correct_answer");
            setTimeout(() => {
                this.feedBackDiv.innerHTML = msgCorrect;
            }, 10);
            this.feedBackDiv.className =
                "alert alert-info draggable-feedback exercise-content";
        } else {
            var msgIncorrect = (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_1__.t)(
                "msg_dragndrop_incorrect_answer",
                this.correctNum,
                this.incorrectNum,
                this.dragNum,
                this.unansweredNum,
            );
            // this.feedback comes from the author (a hint maybe).
            // Typeset once the delayed write has put the feedback's math in place.
            setTimeout(() => {
                this.feedBackDiv.innerHTML = `<div class="para">${msgIncorrect}</div> ${this.feedback}`;
                this.queueMathJax(this.feedBackDiv);
            }, 10);
            // Feedback on individual cards says which cards are wrong, so like
            // the red coloring it waits for MIN_TRIES_FOR_COLOR tries.
            if (showColors) {
                this.addCardInfo();
            }
            this.feedBackDiv.className =
                "alert alert-danger draggable-feedback exercise-content";
        }
    }
    /*
     * Cards that are out of place: a premise that is not in the response it
     * belongs in (or a distractor that was placed), and a response whose
     * contents are wrong.
     */
    misplacedCards() {
        let cards = [];
        for (let premise of this.premiseArray) {
            let parent = premise.parentElement;
            let placedIn = this.responseArray.includes(parent) ? parent : null;
            let isDistractor = !this.responseArray.some(
                (r) => r.dataset.category == premise.dataset.category,
            );
            let misplaced = placedIn
                ? placedIn.dataset.category != premise.dataset.category
                : !isDistractor;
            if (misplaced) cards.push(premise);
        }
        for (let response of this.responseArray) {
            if (!this.isCorrectDrop(response)) cards.push(response);
        }
        return cards;
    }

    /*
     * Give every misplaced card that has author feedback an info button (a
     * disclosure) that shows the feedback in a popover below the card. Cards
     * have role=button, and a button nested in one is hidden from screen
     * readers, so the control is a sibling of the card instead: a zero height
     * box that CSS draws onto the card. A premise's comes after it, at its
     * bottom-right corner. A response's comes before it, at its top-right
     * corner beside its label, clear of the last premise placed in it.
     */
    addCardInfo() {
        for (let card of this.misplacedCards()) {
            let entry = this.cardFeedback[card.id];
            if (!entry) continue;
            let info = document.createElement("div");
            info.classList.add("draggable-card-info");
            info.dataset.card = card.id;
            let button = document.createElement("button");
            button.type = "button";
            button.classList.add("draggable-card-info-button");
            let cardLabel = this.premiseArray.includes(card)
                ? (0,_common_js_mathjax_a11y_js__WEBPACK_IMPORTED_MODULE_2__.getAccessibleElementText)(card)
                : this.getResponseLabel(card);
            button.setAttribute(
                "aria-label",
                (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_1__.t)("msg_dragndrop_card_feedback", cardLabel.trim()),
            );
            button.title = (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_1__.t)("msg_dragndrop_card_feedback_tip");
            button.setAttribute("aria-expanded", "false");
            button.setAttribute("aria-controls", card.id + "_info");
            button.innerHTML = '<span aria-hidden="true">i</span>';
            button.addEventListener("click", (ev) => {
                // Inside a response, a click would otherwise place the
                // selected premise.
                ev.stopPropagation();
                this.toggleCardInfo(card);
            });
            let popover = document.createElement("div");
            popover.id = card.id + "_info";
            popover.classList.add("draggable-card-info-popover");
            popover.hidden = true;
            popover.innerHTML = entry.feedback;
            popover.addEventListener("click", (ev) => ev.stopPropagation());
            info.append(button, popover);
            card.classList.add("has-card-info");
            if (this.premiseArray.includes(card)) {
                card.after(info);
            } else {
                info.classList.add("for-response");
                card.before(info);
            }
            this.queueMathJax(popover);
        }
    }

    cardInfoFor(card) {
        if (!this.containerDiv) return null;
        return Array.from(
            this.containerDiv.querySelectorAll(".draggable-card-info"),
        ).find((info) => info.dataset.card === card.id);
    }

    removeCardInfo(card) {
        this.cardInfoFor(card)?.remove();
        card.classList.remove("has-card-info");
    }

    clearCardInfo() {
        for (let info of this.containerDiv.querySelectorAll(
            ".draggable-card-info",
        )) {
            info.remove();
        }
        for (let card of this.containerDiv.querySelectorAll(".has-card-info")) {
            card.classList.remove("has-card-info");
        }
    }

    // Open or close a card's feedback popover. Returns false if it has none.
    toggleCardInfo(card) {
        let info = this.cardInfoFor(card);
        if (!info) return false;
        let popover = info.querySelector(".draggable-card-info-popover");
        let opening = popover.hidden;
        this.closeCardInfo();
        popover.hidden = !opening;
        info.classList.toggle("open", opening);
        info.querySelector("button").setAttribute(
            "aria-expanded",
            String(opening),
        );
        return true;
    }

    // Close any open popover, optionally moving focus back to its button if
    // focus was inside it. Returns true if one was open.
    closeCardInfo({ restoreFocus = false } = {}) {
        let closed = false;
        for (let info of this.containerDiv.querySelectorAll(
            ".draggable-card-info.open",
        )) {
            let button = info.querySelector("button");
            let hadFocus = info.contains(document.activeElement);
            info.classList.remove("open");
            info.querySelector(".draggable-card-info-popover").hidden = true;
            button.setAttribute("aria-expanded", "false");
            if (restoreFocus && hadFocus) button.focus();
            closed = true;
        }
        return closed;
    }

    /*===================================
    === Checking/restoring from storage ===
    ===================================*/
    restoreAnswers(data) {
        // Restore answers from storage retrieval done in RunestoneBase
        this.hasStoredDropzones = true;
        this.minheight = data.min_height;
        this.dragwidth = data.drag_width;
        this.dropwidth = data.drop_width;
        this.answerState = JSON.parse(data.answer);
        this.correct = data.correct;
        this.finishSettingUp();
    }

    checkLocalStorage() {
        if (this.graderactive) {
            this.finishSettingUp();
            return;
        }
        var storedObj;
        this.hasStoredDropzones = false;
        var len = localStorage.length;
        if (len > 0) {
            var ex = localStorage.getItem(this.localStorageKey());
            if (ex !== null) {
                this.hasStoredDropzones = true;
                let error = false;
                try {
                    storedObj = JSON.parse(ex);
                    this.minheight = storedObj.min_height;
                    this.dragwidth = storedObj.drag_width;
                    this.dropwidth = storedObj.drop_width;
                } catch (err) {
                    // error while parsing; likely due to bad value stored in storage
                    console.log(
                        `Error parsing stored DragNDrop data for ${this.divid}: ${err}`,
                    );
                    error = true;
                }
                if (error || storedObj.timestamp < eBookConfig.termStartDate) {
                    localStorage.removeItem(this.localStorageKey());
                    this.hasStoredDropzones = false;
                    this.finishSettingUp();
                    return;
                }
                localStorage.removeItem(this.localStorageKey());
                this.answerState = storedObj.answer;
                if (this.useRunestoneServices) {
                    // store answer in database
                    let answer = JSON.stringify(this.answerState);
                    this.logBookEvent({
                        event: "dragNdrop",
                        act: answer,
                        answer: answer,
                        min_height: Math.round(this.minheight),
                        drag_width: this.dragwidth,
                        drop_width: this.dropwidth,
                        div_id: this.divid,
                        correct: storedObj.correct,
                    });
                }
            }
        }
        this.finishSettingUp();
    }

    setLocalStorage(data) {
        if (data.answer === undefined) {
            // If we didn't load from the server, we must generate the data
            this.answerState = {};
            for (let response of this.placedResponses()) {
                this.answerState[response.id] = [];
                for (let premise of response.childNodes) {
                    if (
                        premise.nodeType !== Node.TEXT_NODE &&
                        this.premiseArray.includes(premise)
                    ) {
                        this.answerState[response.id].push(premise.id);
                    }
                }
            }
        }
        var timeStamp = new Date();
        var correct = data.correct;
        var storageObj = {
            answer: this.answerState,
            min_height: this.minheight,
            timestamp: timeStamp,
            correct: correct,
            drag_width: this.dragwidth,
            drop_width: this.dropwidth,
        };
        localStorage.setItem(
            this.localStorageKey(),
            JSON.stringify(storageObj),
        );
    }

    disableInteraction() {
        this.resetButton.style.display = "none";
        for (var i = 0; i < this.premiseArray.length; i++) {
            // No more dragging
            this.premiseArray[i].draggable = false;
            this.premiseArray[i].style.cursor = "initial";
        }
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        // Generate a random index between 0 and i
        const j = Math.floor(Math.random() * (i + 1));
        // Swap elements at indices i and j
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/*=================================
== Find the custom HTML tags and ==
==   execute our code on them    ==
=================================*/
document.addEventListener("runestone:login-complete", function () {
    const elements = document.querySelectorAll("[data-component=dragndrop]");
    elements.forEach((element) => {
        const opts = {
            orig: element,
            useRunestoneServices: eBookConfig.useRunestoneServices,
        };
        if (!element.closest("[data-component=timedAssessment]")) {
            // If this element exists within a timed component, don't render it here
            try {
                window.componentMap[element.id] = new DragNDrop(opts);
            } catch (err) {
                console.log(
                    `Error rendering DragNDrop Problem ${element.id}: ${err}`,
                );
            }
        }
    });
});


/***/ }),

/***/ 32552:
/*!*****************************************************!*\
  !*** ./runestone/dragndrop/js/dragndrop-i18n.en.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/rsi18n.js */ 54250);


(0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.load)({
    en: {
        msg_dragndrop_correct_answer: "You are correct!",
        msg_dragndrop_incorrect_answer:
            "Incorrect. Of the cards you have sorted you placed $1 correctly and $2 incorrectly. You have $4 left to place.",
        msg_dragndrop_place_more:
            "Please place all of the cards before checking your answer. You have $1 left to place.",
        msg_dragndrop_check_me: "Check me",
        msg_dragndrop_reset: "Reset",
        msg_dragndrop_card_feedback: "Feedback for $1",
        msg_dragndrop_card_feedback_tip: "Show feedback",
    },
});


/***/ }),

/***/ 61920:
/*!*************************************************!*\
  !*** ./runestone/dragndrop/js/xmlconversion.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DragndropXmlConverter: () => (/* binding */ DragndropXmlConverter)
/* harmony export */ });
/* harmony import */ var _common_js_xmlconversion_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/xmlconversion.js */ 8152);


/*
 * Drag-n-drop expresses its answer key as <answer> elements with premise and
 * response id attributes, which reads more clearly than matching's <edge> form:
 *
 *   <answer premise="left-1" response="right-2"/>
 *
 * Several <answer>s may share the same response (many premises -> one dropzone).
 */
class DragndropXmlConverter extends _common_js_xmlconversion_js__WEBPACK_IMPORTED_MODULE_0__.QuestionXmlConverter {
    correctAnswers() {
        return Array.from(this.doc.querySelectorAll("answer")).map((a) => [
            a.getAttribute("premise"),
            a.getAttribute("response"),
        ]);
    }
}


/***/ }),

/***/ 76512:
/*!************************************************!*\
  !*** ./runestone/dragndrop/css/dragndrop.less ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 81264:
/*!********************************************************!*\
  !*** ./runestone/dragndrop/js/dragndrop-i18n.pt-br.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/rsi18n.js */ 54250);


(0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.load)({
    "pt-br": {
        msg_dragndrop_correct_answer: "Correto!",
        msg_dragndrop_incorrect_answer:
            "Incorreto. Você teve $1 correto(s) e $2 incorreto(s) de $3. Você deixou $4 em branco.",
        msg_dragndrop_place_more:
            "Por favor, posicione todos os cartões antes de verificar sua resposta. Você ainda tem $1 para posicionar.",
        msg_dragndrop_check_me: "Verificar",
        msg_dragndrop_reset: "Resetar",
        msg_dragndrop_card_feedback: "Comentário sobre $1",
        msg_dragndrop_card_feedback_tip: "Mostrar comentário",
    },
});


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RCx1Q0FBdUMsdURBQUM7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCO0FBQzFCO0FBQ0EsbURBQW1ELFNBQVM7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLG9GQUF3QjtBQUN2Qzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCLG9GQUF3QjtBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBLG9CQUFvQjtBQUNwQjtBQUNB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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULCtCQUErQixjQUFjO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0IsbUNBQW1DO0FBQ2xFOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLHVEQUFDO0FBQ2hDO0FBQ0Esa0VBQWtFLGFBQWE7QUFDL0UsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2Qix1REFBQztBQUM5QjtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxVQUFVO0FBQ1YsK0JBQStCLHVEQUFDO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtFQUFrRSxhQUFhLFNBQVMsY0FBYztBQUN0RztBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0Isb0ZBQXdCO0FBQzFDO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQix1REFBQztBQUNqQjtBQUNBLDJCQUEyQix1REFBQztBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxvQkFBb0IsdUJBQXVCLElBQUk7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEIsNENBQTRDO0FBQzVDO0FBQ0EsbUVBQW1FLFdBQVcsSUFBSSxJQUFJO0FBQ3RGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esd0JBQXdCLDhCQUE4QjtBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxtQ0FBbUMsT0FBTztBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQSx5REFBeUQsV0FBVyxJQUFJLElBQUk7QUFDNUU7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLENBQUM7Ozs7Ozs7Ozs7Ozs7QUN2akRnRDs7QUFFakQsMERBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0FDZHVFOztBQUV4RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ08sb0NBQW9DLDZFQUFvQjtBQUMvRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDakJBOzs7Ozs7Ozs7Ozs7O0FDQWlEOztBQUVqRCwwREFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2RyYWduZHJvcC9qcy9kcmFnbmRyb3AtaTE4bi5zci1DeXJsLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvY29tbW9uL2pzL3htbGNvbnZlcnNpb24uanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9kcmFnbmRyb3AvanMvdGltZWRkbmQuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9kcmFnbmRyb3AvanMvZHJhZ25kcm9wLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvZHJhZ25kcm9wL2pzL2RyYWduZHJvcC1pMThuLmVuLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvZHJhZ25kcm9wL2pzL3htbGNvbnZlcnNpb24uanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9kcmFnbmRyb3AvY3NzL2RyYWduZHJvcC5sZXNzP2I4NWMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9kcmFnbmRyb3AvanMvZHJhZ25kcm9wLWkxOG4ucHQtYnIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgbG9hZCB9IGZyb20gXCIuLi8uLi9jb21tb24vanMvcnNpMThuLmpzXCI7XG5cbmxvYWQoe1xuICAgIFwic3ItQ3lybFwiOiB7XG4gICAgICAgIG1zZ19kcmFnbmRyb3BfY29ycmVjdF9hbnN3ZXI6IFwi0KLQsNGH0LDQvSDQvtC00LPQvtCy0L7RgCFcIixcbiAgICAgICAgbXNnX2RyYWduZHJvcF9pbmNvcnJlY3RfYW5zd2VyOlxuICAgICAgICAgICAgXCLQndC10YLQsNGH0L3Qvi4g0JTQvtCx0LjQu9C4INGB0YLQtSAkMSDRgtCw0YfQvdC40YUg0LggJDIg0L3QtdGC0LDRh9C90LjRhSDQvtC0ICQzLiDQntGB0YLQsNC70L4g0LLQsNC8INGY0LUgJDQg0L/RgNCw0LfQvdC40L3QsC5cIixcbiAgICAgICAgbXNnX2RyYWduZHJvcF9wbGFjZV9tb3JlOlxuICAgICAgICAgICAgXCLQnNC+0LvQuNC80L4g0LLQsNGBINC00LAg0L/QvtGB0YLQsNCy0LjRgtC1INGB0LLQtSDQutCw0YDRgtC40YbQtSDQv9GA0LUg0L/RgNC+0LLQtdGA0LUg0L7QtNCz0L7QstC+0YDQsC4g0J7RgdGC0LDQu9C+INCy0LDQvCDRmNC1INGY0L7RiCAkMSDQt9CwINC/0L7RgdGC0LDQstGZ0LDRmtC1LlwiLFxuICAgICAgICBtc2dfZHJhZ25kcm9wX2NoZWNrX21lOiBcItCf0YDQvtCy0LXRgNC4XCIsXG4gICAgICAgIG1zZ19kcmFnbmRyb3BfcmVzZXQ6IFwi0J/QvtC90LjRiNGC0LhcIixcbiAgICAgICAgbXNnX2RyYWduZHJvcF9jYXJkX2ZlZWRiYWNrOiBcItCf0L7QstGA0LDRgtC90LAg0LjQvdGE0L7RgNC80LDRhtC40ZjQsCDQt9CwICQxXCIsXG4gICAgICAgIG1zZ19kcmFnbmRyb3BfY2FyZF9mZWVkYmFja190aXA6IFwi0J/RgNC40LrQsNC20Lgg0L/QvtCy0YDQsNGC0L3RgyDQuNC90YTQvtGA0LzQsNGG0LjRmNGDXCIsXG4gICAgfSxcbn0pO1xuIiwiLypcbiAqIEJhc2UgY2xhc3MgZm9yIGNvbnZlcnRpbmcgYSBxdWVzdGlvbiBhdXRob3JlZCBhcyBYTUwgaW50byB0aGUgSlNPTiBzaGFwZSB0aGVcbiAqIGludGVyYWN0aXZlIGNvbXBvbmVudHMgY29uc3VtZTpcbiAqXG4gKiAgIHsgc3RhdGVtZW50LCBmZWVkYmFjayxcbiAqICAgICBsZWZ0OiAgW3tpZCwgbGFiZWwsIGZlZWRiYWNrP30sIC4uLl0sICAgLy8gPHByZW1pc2U+IGVsZW1lbnRzXG4gKiAgICAgcmlnaHQ6IFt7aWQsIGxhYmVsLCBmZWVkYmFjaz99LCAuLi5dLCAgIC8vIDxyZXNwb25zZT4gZWxlbWVudHNcbiAqICAgICBjb3JyZWN0QW5zd2VyczogW1tsZWZ0SWQsIHJpZ2h0SWRdLCAuLi5dIH1cbiAqXG4gKiBBIDxwcmVtaXNlPiBvciA8cmVzcG9uc2U+IG1heSBjYXJyeSBpdHMgb3duIDxmZWVkYmFjaz4gKFByZVRlWHQgXCJjYXJkc29ydFwiXG4gKiB3aXRoIGZlZWRiYWNrIG9uIGNhcmRzKTsgaXQgaXMgaW5jbHVkZWQgb25seSB3aGVuIHByZXNlbnQgYW5kIG5vbi1lbXB0eS5cbiAqXG4gKiBUaGUgcGllY2VzIGV2ZXJ5IHF1ZXN0aW9uIHR5cGUgc2hhcmVzIC0tIHBhcnNpbmcsIHRoZSA8c3RhdGVtZW50Pi88ZmVlZGJhY2s+XG4gKiB0YWdzLCBhbmQgdGhlIDxwcmVtaXNlPi88cmVzcG9uc2U+IGxpc3RzIC0tIGxpdmUgaGVyZS4gSG93IHRoZSBhbnN3ZXIga2V5IGlzXG4gKiBleHByZXNzZWQgZGlmZmVycyBiZXR3ZWVuIGNvbXBvbmVudHMsIHNvIHN1YmNsYXNzZXMgb3ZlcnJpZGUgY29ycmVjdEFuc3dlcnMoKS5cbiAqL1xuZXhwb3J0IGNsYXNzIFF1ZXN0aW9uWG1sQ29udmVydGVyIHtcbiAgICBjb25zdHJ1Y3Rvcih4bWxTdHJpbmcpIHtcbiAgICAgICAgY29uc3QgcGFyc2VyID0gbmV3IERPTVBhcnNlcigpO1xuICAgICAgICAvLyBQYXJzZSBhcyBIVE1MIHNvIHRoYXQgbWFya3VwIGluc2lkZSA8c3RhdGVtZW50Pi88bGFiZWw+IChlLmcuIDxwPixcbiAgICAgICAgLy8gbWF0aCBzcGFucykgaXMgcHJlc2VydmVkIGFuZCByZWFjaGFibGUgdmlhIGlubmVySFRNTC5cbiAgICAgICAgdGhpcy5kb2MgPSBwYXJzZXIucGFyc2VGcm9tU3RyaW5nKFxuICAgICAgICAgICAgZXhwYW5kU2VsZkNsb3NpbmdUYWdzKHhtbFN0cmluZyksXG4gICAgICAgICAgICBcInRleHQvaHRtbFwiLFxuICAgICAgICApO1xuICAgICAgICBjb25zdCBlcnIgPSB0aGlzLmRvYy5xdWVyeVNlbGVjdG9yKFwicGFyc2VyZXJyb3JcIik7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlhNTCBwYXJzZSBlcnJvcjogXCIgKyBlcnIudGV4dENvbnRlbnQpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFRoZSBxdWVzdGlvbidzIHJvb3QgZWxlbWVudCwgZS5nLiA8ZHJhZ25kcm9wPiBvciA8bWF0Y2hpbmc+LlxuICAgICAgICB0aGlzLnJvb3QgPSB0aGlzLmRvYy5ib2R5LmZpcnN0RWxlbWVudENoaWxkIHx8IHRoaXMuZG9jLmJvZHk7XG4gICAgfVxuXG4gICAgLy8gVGhlIHF1ZXN0aW9uLWxldmVsIDxzdGF0ZW1lbnQ+IG9yIDxmZWVkYmFjaz46IGEgY2hpbGQgb2YgdGhlIHJvb3QsIG5vdFxuICAgIC8vIHRoZSA8ZmVlZGJhY2s+IG9mIGEgY2FyZCwgd2hpY2ggbWF5IGNvbWUgZmlyc3QgaW4gZG9jdW1lbnQgb3JkZXIuXG4gICAgcm9vdENoaWxkKHRhZ05hbWUpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIGNoaWxkRWxlbWVudCh0aGlzLnJvb3QsIHRhZ05hbWUpIHx8IHRoaXMuZG9jLnF1ZXJ5U2VsZWN0b3IodGFnTmFtZSlcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBnZXRTdGF0ZW1lbnQoKSB7XG4gICAgICAgIGNvbnN0IGVsID0gdGhpcy5yb290Q2hpbGQoXCJzdGF0ZW1lbnRcIik7XG4gICAgICAgIHJldHVybiBlbCA/IGVsLmlubmVySFRNTC50cmltKCkgOiBcIlwiO1xuICAgIH1cblxuICAgIGdldEZlZWRiYWNrKCkge1xuICAgICAgICBjb25zdCBlbCA9IHRoaXMucm9vdENoaWxkKFwiZmVlZGJhY2tcIik7XG4gICAgICAgIHJldHVybiBlbCA/IGVsLmlubmVySFRNTC50cmltKCkgOiBcIlwiO1xuICAgIH1cblxuICAgIC8vIEV4dHJhY3QgW3sgaWQsIGxhYmVsLCBmZWVkYmFjaz8gfSwgLi4uXSBmcm9tIGV2ZXJ5IDxwcmVtaXNlPiBvclxuICAgIC8vIDxyZXNwb25zZT4gZWxlbWVudC4gaW5uZXJIVE1MIHByZXNlcnZlcyBhbnkgbWFya3VwIGluc2lkZSB0aGUgbGFiZWwuXG4gICAgaXRlbXNGcm9tKHRhZ05hbWUpIHtcbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy5kb2MucXVlcnlTZWxlY3RvckFsbCh0YWdOYW1lKSkubWFwKChlbCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaWRFbCA9IGNoaWxkRWxlbWVudChlbCwgXCJpZFwiKTtcbiAgICAgICAgICAgIGNvbnN0IGxhYmVsRWwgPSBjaGlsZEVsZW1lbnQoZWwsIFwibGFiZWxcIik7XG4gICAgICAgICAgICBjb25zdCBmZWVkYmFja0VsID0gY2hpbGRFbGVtZW50KGVsLCBcImZlZWRiYWNrXCIpO1xuICAgICAgICAgICAgY29uc3QgaXRlbSA9IHtcbiAgICAgICAgICAgICAgICBpZDogaWRFbCA/IGlkRWwudGV4dENvbnRlbnQudHJpbSgpIDogXCJcIixcbiAgICAgICAgICAgICAgICBsYWJlbDogbGFiZWxFbCA/IGxhYmVsRWwuaW5uZXJIVE1MLnRyaW0oKSA6IFwiXCIsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgY29uc3QgZmVlZGJhY2sgPSBmZWVkYmFja0VsID8gZmVlZGJhY2tFbC5pbm5lckhUTUwudHJpbSgpIDogXCJcIjtcbiAgICAgICAgICAgIGlmIChmZWVkYmFjaykge1xuICAgICAgICAgICAgICAgIGl0ZW0uZmVlZGJhY2sgPSBmZWVkYmFjaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBpdGVtO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBSZXR1cm5zIHRoZSBhbnN3ZXIga2V5IGFzIFtbbGVmdElkLCByaWdodElkXSwgLi4uXS4gVGhlIHdheSBhbnN3ZXJzIGFyZVxuICAgIC8vIGV4cHJlc3NlZCBpbiB0aGUgWE1MIGlzIGNvbXBvbmVudCBzcGVjaWZpYywgc28gc3ViY2xhc3NlcyBtdXN0IGltcGxlbWVudFxuICAgIC8vIHRoaXMuXG4gICAgY29ycmVjdEFuc3dlcnMoKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgIFwiY29ycmVjdEFuc3dlcnMoKSBtdXN0IGJlIGltcGxlbWVudGVkIGJ5IGEgc3ViY2xhc3Mgb2YgUXVlc3Rpb25YbWxDb252ZXJ0ZXJcIixcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICB0b0pzb24oKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGF0ZW1lbnQ6IHRoaXMuZ2V0U3RhdGVtZW50KCksXG4gICAgICAgICAgICBmZWVkYmFjazogdGhpcy5nZXRGZWVkYmFjaygpLFxuICAgICAgICAgICAgbGVmdDogdGhpcy5pdGVtc0Zyb20oXCJwcmVtaXNlXCIpLFxuICAgICAgICAgICAgcmlnaHQ6IHRoaXMuaXRlbXNGcm9tKFwicmVzcG9uc2VcIiksXG4gICAgICAgICAgICBjb3JyZWN0QW5zd2VyczogdGhpcy5jb3JyZWN0QW5zd2VycygpLFxuICAgICAgICB9O1xuICAgIH1cbn1cblxuZnVuY3Rpb24gY2hpbGRFbGVtZW50KHBhcmVudCwgdGFnTmFtZSkge1xuICAgIHJldHVybiBBcnJheS5mcm9tKHBhcmVudC5jaGlsZHJlbikuZmluZChcbiAgICAgICAgKGNoaWxkKSA9PiBjaGlsZC5sb2NhbE5hbWUgPT09IHRhZ05hbWUsXG4gICAgKTtcbn1cblxuLy8gSFRNTCBlbGVtZW50cyB0aGF0IGFyZSBsZWdpdGltYXRlbHkgd3JpdHRlbiBhcyA8dGFnLz4uXG5jb25zdCBWT0lEX0VMRU1FTlRTID0gbmV3IFNldChbXG4gICAgXCJhcmVhXCIsXG4gICAgXCJiYXNlXCIsXG4gICAgXCJiclwiLFxuICAgIFwiY29sXCIsXG4gICAgXCJlbWJlZFwiLFxuICAgIFwiaHJcIixcbiAgICBcImltZ1wiLFxuICAgIFwiaW5wdXRcIixcbiAgICBcImxpbmtcIixcbiAgICBcIm1ldGFcIixcbiAgICBcInBhcmFtXCIsXG4gICAgXCJzb3VyY2VcIixcbiAgICBcInRyYWNrXCIsXG4gICAgXCJ3YnJcIixcbl0pO1xuXG4vKlxuICogVGhlIEhUTUwgcGFyc2VyIGlnbm9yZXMgdGhlIHNsYXNoIGluIDxmZWVkYmFjay8+IGFuZCB0cmVhdHMgaXQgYXMgYW4gb3BlblxuICogdGFnLCBzbyBldmVyeXRoaW5nIGFmdGVyIGl0IHdvdWxkIGVuZCB1cCBpbnNpZGUgdGhlIGVtcHR5IGVsZW1lbnQuIEFuIFhNTFxuICogc2VyaWFsaXplciAobHhtbCwgd2hlbiB0aGUgbWFuaWZlc3QgaXMgc3RvcmVkIGluIHRoZSBkYXRhYmFzZSkgd3JpdGVzIGVtcHR5XG4gKiBlbGVtZW50cyB0aGF0IHdheSwgZS5nLiBhbiBleGVyY2lzZSB3aXRoIG5vIDxmZWVkYmFjaz4gb3IgYW4gPGFuc3dlci8+LlxuICovXG5mdW5jdGlvbiBleHBhbmRTZWxmQ2xvc2luZ1RhZ3MoeG1sU3RyaW5nKSB7XG4gICAgcmV0dXJuIHhtbFN0cmluZy5yZXBsYWNlKFxuICAgICAgICAvPChbQS1aYS16XVtcXHc6LV0qKSgoPzpcXHMrW148Pl0qPyk/KVxccypcXC8+L2csXG4gICAgICAgIChtYXRjaCwgdGFnLCBhdHRycykgPT5cbiAgICAgICAgICAgIFZPSURfRUxFTUVOVFMuaGFzKHRhZy50b0xvd2VyQ2FzZSgpKVxuICAgICAgICAgICAgICAgID8gbWF0Y2hcbiAgICAgICAgICAgICAgICA6IGA8JHt0YWd9JHthdHRyc30+PC8ke3RhZ30+YCxcbiAgICApO1xufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCBEcmFnTkRyb3AgZnJvbSBcIi4vZHJhZ25kcm9wLmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRpbWVkRHJhZ05Ecm9wIGV4dGVuZHMgRHJhZ05Ecm9wIHtcbiAgICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgICAgIHN1cGVyKG9wdHMpO1xuICAgICAgICB0aGlzLmZpbmlzaFNldHRpbmdVcCgpO1xuICAgICAgICB0aGlzLnJlbmRlclRpbWVkSWNvbih0aGlzLmNvbnRhaW5lckRpdik7XG4gICAgICAgIHRoaXMuaGlkZUJ1dHRvbnMoKTtcbiAgICB9XG4gICAgaGlkZUJ1dHRvbnMoKSB7XG4gICAgICAgIHRoaXMuc3VibWl0QnV0dG9uLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICB9XG4gICAgcmVuZGVyVGltZWRJY29uKGNvbXBvbmVudCkge1xuICAgICAgICAvLyByZW5kZXJzIHRoZSBjbG9jayBpY29uIG9uIHRpbWVkIGNvbXBvbmVudHMuICAgIFRoZSBjb21wb25lbnQgcGFyYW1ldGVyXG4gICAgICAgIC8vIGlzIHRoZSBlbGVtZW50IHRoYXQgdGhlIGljb24gc2hvdWxkIGJlIGFwcGVuZGVkIHRvLlxuICAgICAgICB2YXIgdGltZUljb25EaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB2YXIgdGltZUljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xuICAgICAgICB0aW1lSWNvbi5zcmMgPSBcIi4uL19zdGF0aWMvY2xvY2sucG5nXCI7XG4gICAgICAgIHRpbWVJY29uLnN0eWxlLndpZHRoID0gXCIxNXB4XCI7XG4gICAgICAgIHRpbWVJY29uLnN0eWxlLmhlaWdodCA9IFwiMTVweFwiO1xuICAgICAgICB0aW1lSWNvbkRpdi5jbGFzc05hbWUgPSBcInRpbWVUaXBcIjtcbiAgICAgICAgdGltZUljb25EaXYudGl0bGUgPSBcIlwiO1xuICAgICAgICB0aW1lSWNvbkRpdi5hcHBlbmRDaGlsZCh0aW1lSWNvbik7XG4gICAgICAgIGNvbXBvbmVudC5pbnNlcnRCZWZvcmUodGltZUljb25EaXYsIGNvbXBvbmVudC5maXJzdENoaWxkKTtcbiAgICB9XG4gICAgY2hlY2tDb3JyZWN0VGltZWQoKSB7XG4gICAgICAgIC8vIFJldHVybnMgaWYgdGhlIHF1ZXN0aW9uIHdhcyBjb3JyZWN0LiAgICBVc2VkIGZvciB0aW1lZCBhc3Nlc3NtZW50IGdyYWRpbmcuXG4gICAgICAgIGlmICh0aGlzLnVuYW5zd2VyZWROdW0gPT09IHRoaXMucHJlbWlzZUFycmF5Lmxlbmd0aCkge1xuICAgICAgICAgICAgdGhpcy5jb3JyZWN0ID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBzd2l0Y2ggKHRoaXMuY29ycmVjdCkge1xuICAgICAgICAgICAgY2FzZSB0cnVlOlxuICAgICAgICAgICAgICAgIHJldHVybiBcIlRcIjtcbiAgICAgICAgICAgIGNhc2UgZmFsc2U6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiRlwiO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBoaWRlRmVlZGJhY2soKSB7XG4gICAgICAgIHRoaXMuZmVlZEJhY2tEaXYuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgIH1cbn1cblxuaWYgKHR5cGVvZiB3aW5kb3cuY29tcG9uZW50X2ZhY3RvcnkgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB3aW5kb3cuY29tcG9uZW50X2ZhY3RvcnkgPSB7fTtcbn1cbndpbmRvdy5jb21wb25lbnRfZmFjdG9yeVtcImRyYWduZHJvcFwiXSA9IGZ1bmN0aW9uIChvcHRzKSB7XG4gICAgaWYgKG9wdHMudGltZWQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBUaW1lZERyYWdORHJvcChvcHRzKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBEcmFnTkRyb3Aob3B0cyk7XG59O1xuIiwiLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09PT09PT0gICAgIE1hc3RlciBkcmFnbmRyb3AuanMgICAgID09PT09PT09XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT09ICAgICBUaGlzIGZpbGUgY29udGFpbnMgdGhlIEpTIGZvciAgICA9PT1cbj09PSB0aGUgUnVuZXN0b25lIERyYWcgbiBkcm9wIGNvbXBvbmVudC4gPT09XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT09ICAgICAgICAgICAgICBDcmVhdGVkIGJ5ICAgICAgICAgICAgICA9PT1cbj09PSAgICAgICAgICAgSXNhaWFoIE1heWVyY2hhayAgICAgICAgICAgPT09XG49PT0gICAgICAgICAgICAgICAgNy82LzE1ICAgICAgICAgICAgICAgID09PVxuPT09ICAgICAgICAgICAgICBCcmFkIE1JbGxlciAgICAgICAgICAgICA9PT1cbj09PSAgICAgICAgICAgICAgICAyLzcvMTkgICAgICAgICAgICAgICAgPT09XG49PT0gICAgICAgICAgICAgICAxMi8zMC8yNCAgICAgICAgICAgICAgID09PVxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cblxuLypcbiAqIFNvbWUgdGVybWlub2xvZ3k6XG4gKiAtIGRyYWdnYWJsZTogdGhlIGVsZW1lbnQgdGhhdCBpcyBiZWluZyBkcmFnZ2VkXG4gKiAtIGRyb3B6b25lOiB0aGUgZWxlbWVudCB0aGF0IGlzIGJlaW5nIGRyb3BwZWQgb25cbiAqIC0gcHJlbWlzZTogdGhlIGVsZW1lbnQgdGhhdCBpcyBiZWluZyBkcmFnZ2VkXG4gKiAtIHJlc3BvbnNlOiB0aGUgZWxlbWVudCB0aGF0IGlzIGJlaW5nIGRyb3BwZWQgb25cbiAqIC0gY2F0ZWdvcnk6IGVhY2ggcHJlbWlzIGFuZCByZXNwb25zZSBoYXZlIGEgY2F0ZWdvcnkuICBTZXZlcmFsIHByZW1pc2VzIGNhbiBoYXZlIHRoZSBzYW1lIGNhdGVnb3J5XG4gKiBhbmQgYmUgZHJvcHBlZCBvbnRvIHRoZSBzYW1lIHJlc3BvbnNlLiAgSWYgYSBwcmVtaXNlIGhhcyBubyByZXNwb25zZSBpdHMgY2F0ZWdvcnkgd2lsbCBub3QgYmUgaW5cbiAqIHRoZSBsaXN0IG9mIGNhdGVnb3JpZXMuXG4gKlxuICogS2V5IHZhcmlhYmxlczpcbiAqIC0gZHJhZ0FycmF5OiBhbiBhcnJheSBvZiBkcmFnZ2FibGUgZWxlbWVudHNcbiAqIC0gZHJvcEFycmF5OiBhbiBhcnJheSBvZiBkcm9wem9uZSBlbGVtZW50c1xuICogLSBjYXRlZ29yaWVzOiBhbiBhcnJheSBvZiBhbGwgY2F0ZWdvcmllc1xuICovXG5cInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IFJ1bmVzdG9uZUJhc2UgZnJvbSBcIi4uLy4uL2NvbW1vbi9qcy9ydW5lc3RvbmViYXNlLmpzXCI7XG5pbXBvcnQgeyB0IH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9qcy9yc2kxOG4uanNcIjtcbmltcG9ydCB7XG4gICAgZGlzYWJsZU1hdGhKYXhUYWJTdG9wcyxcbiAgICBnZXRBY2Nlc3NpYmxlRWxlbWVudFRleHQsXG59IGZyb20gXCIuLi8uLi9jb21tb24vanMvbWF0aGpheC1hMTF5LmpzXCI7XG5pbXBvcnQgeyBEcmFnbmRyb3BYbWxDb252ZXJ0ZXIgfSBmcm9tIFwiLi94bWxjb252ZXJzaW9uLmpzXCI7XG5pbXBvcnQgXCIuLi9jc3MvZHJhZ25kcm9wLmxlc3NcIjtcbmltcG9ydCBcIi4vZHJhZ25kcm9wLWkxOG4uZW4uanNcIjtcbmltcG9ydCBcIi4vZHJhZ25kcm9wLWkxOG4ucHQtYnIuanNcIjtcbmltcG9ydCBcIi4vZHJhZ25kcm9wLWkxOG4uc3ItQ3lybC5qc1wiO1xuLy9pbXBvcnQgXCIuL0RyYWdEcm9wVG91Y2guanNcIjtcblxuLy8gVGhlIHN0dWRlbnQgbXVzdCBoYXZlIGF0IGxlYXN0IHRoaXMgbWFueSBncmFkZWFibGUgdHJpZXMgYmVmb3JlIG1pc3BsYWNlZFxuLy8gYmxvY2tzIGFyZSBjb2xvcmVkIHJlZC5cbmNvbnN0IE1JTl9UUklFU19GT1JfQ09MT1IgPSAzO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEcmFnTkRyb3AgZXh0ZW5kcyBSdW5lc3RvbmVCYXNlIHtcbiAgICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgICAgIHN1cGVyKG9wdHMpO1xuICAgICAgICB2YXIgb3JpZyA9IG9wdHMub3JpZzsgLy8gZW50aXJlIDx1bD4gZWxlbWVudCB0aGF0IHdpbGwgYmUgcmVwbGFjZWQgYnkgbmV3IEhUTUxcbiAgICAgICAgdGhpcy5vcmlnRWxlbSA9IG9yaWc7XG4gICAgICAgIHRoaXMuZGl2aWQgPSBvcmlnLmlkO1xuICAgICAgICB0aGlzLnVzZVJ1bmVzdG9uZVNlcnZpY2VzID0gb3B0cy51c2VSdW5lc3RvbmVTZXJ2aWNlcztcbiAgICAgICAgdGhpcy5yYW5kb20gPSB0cnVlO1xuICAgICAgICAvL2NoZWNrIGlmIHRoZSBvcmlnaW5hbCBlbGVtZW50IGhhcyBhIGRhdGEtcmFuZG9tIGF0dHJpYnV0ZSBzZXQgdG8gdGhlIHZhbHVlIFwibm9cIlxuICAgICAgICBpZiAodGhpcy5vcmlnRWxlbS5kYXRhc2V0LnJhbmRvbSA9PT0gXCJub1wiKSB7XG4gICAgICAgICAgICB0aGlzLnJhbmRvbSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZmVlZGJhY2sgPSBcIlwiO1xuICAgICAgICB0aGlzLnF1ZXN0aW9uID0gXCJcIjtcbiAgICAgICAgdGhpcy5zZWxlY3RlZFByZW1pc2UgPSBudWxsO1xuICAgICAgICB0aGlzLmFjdGl2ZVJlc3BvbnNlID0gbnVsbDtcbiAgICAgICAgLy8gTnVtYmVyIG9mIHRpbWVzIHRoZSBzdHVkZW50IGhhcyBzdWJtaXR0ZWQgYSBncmFkZWFibGUgYXR0ZW1wdCAob25lXG4gICAgICAgIC8vIHdoZXJlIHRoZXkgaGF2ZSBwbGFjZWQgZW5vdWdoIGJsb2NrcykuIE1pc3BsYWNlZCBibG9ja3MgYXJlIG9ubHlcbiAgICAgICAgLy8gY29sb3JlZCByZWQgb25jZSB0aGlzIHJlYWNoZXMgTUlOX1RSSUVTX0ZPUl9DT0xPUi5cbiAgICAgICAgdGhpcy50cmllcyA9IDA7XG4gICAgICAgIHRoaXMucG9wdWxhdGUoKTsgLy8gUG9wdWxhdGVzIHRoaXMucmVzcG9uc2VBcnJheSwgdGhpcy5wcmVtaXNlQXJyYXksIHRoaXMuZmVlZGJhY2sgYW5kIHRoaXMucXVlc3Rpb25cbiAgICAgICAgdGhpcy5jcmVhdGVOZXdFbGVtZW50cygpO1xuICAgICAgICB0aGlzLmNhcHRpb24gPSBcIkRyYWctTi1Ecm9wXCI7XG4gICAgICAgIHRoaXMuYWRkQ2FwdGlvbihcInJ1bmVzdG9uZVwiKTtcbiAgICAgICAgaWYgKHR5cGVvZiBQcmlzbSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgUHJpc20uaGlnaGxpZ2h0QWxsVW5kZXIodGhpcy5jb250YWluZXJEaXYpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyo9PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT09IFVwZGF0ZSB2YXJpYWJsZXMgPT09XG4gICAgPT09PT09PT09PT09PT09PT09PT09PSovXG4gICAgcG9wdWxhdGUoKSB7XG4gICAgICAgIHRoaXMucmVzcG9uc2VBcnJheSA9IFtdO1xuICAgICAgICB0aGlzLnByZW1pc2VBcnJheSA9IFtdO1xuICAgICAgICAvLyBGZWVkYmFjayBhbiBhdXRob3IgYXR0YWNoZWQgdG8gYW4gaW5kaXZpZHVhbCBwcmVtaXNlIG9yIHJlc3BvbnNlLFxuICAgICAgICAvLyBrZXllZCBieSBlbGVtZW50IGlkOiB7IGxhYmVsLCBmZWVkYmFjayB9LlxuICAgICAgICB0aGlzLmNhcmRGZWVkYmFjayA9IHt9O1xuICAgICAgICBsZXQgaW52aXNpYmxlRXJyb3JEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBpbnZpc2libGVFcnJvckRpdi5jbGFzc0xpc3QuYWRkKFwicHR4LXJ1bmVzdG9uZS1jb250YWluZXJcIik7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaW52aXNpYmxlRXJyb3JEaXYpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIlBvcHVsYXRpbmcgRHJhZ05Ecm9wIHdpdGggcHJlbWlzZXMgYW5kIHJlc3BvbnNlc1wiKTtcbiAgICAgICAgLy8gQSBxdWVzdGlvbiBtYXkgYmUgYXV0aG9yZWQgYXMgYSA8c2NyaXB0PiBibG9jayAtLSBlaXRoZXIgWE1MXG4gICAgICAgIC8vICh0eXBlPVwidGV4dC94bWxcIikgb3IgSlNPTiAtLSBpbiB0aGUgc2FtZSBzaGFwZSB1c2VkIGJ5IG1hdGNoaW5nLFxuICAgICAgICAvLyBpbnN0ZWFkIG9mIHRoZSBsZWdhY3kgZGF0YS1zdWJjb21wb25lbnQgbWFya3VwLlxuICAgICAgICBjb25zdCBzY3JpcHQgPSB0aGlzLm9yaWdFbGVtLnF1ZXJ5U2VsZWN0b3IoXCJzY3JpcHRcIik7XG4gICAgICAgIGlmIChzY3JpcHQpIHtcbiAgICAgICAgICAgIHRoaXMucG9wdWxhdGVGcm9tU2NyaXB0KHNjcmlwdCwgaW52aXNpYmxlRXJyb3JEaXYpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wb3B1bGF0ZUZyb21IdG1sKGludmlzaWJsZUVycm9yRGl2KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qXG4gICAgICogQnVpbGQgdGhlIHByZW1pc2VzL3Jlc3BvbnNlcyBmcm9tIHRoZSBsZWdhY3kgbWFya3VwIHdoZXJlIGVhY2hcbiAgICAgKiBkcmFnZ2FibGUvZHJvcHpvbmUgaXMgYSBkYXRhLXN1YmNvbXBvbmVudCBlbGVtZW50IGxpbmtlZCBieSBkYXRhLWNhdGVnb3J5LlxuICAgICAqL1xuICAgIHBvcHVsYXRlRnJvbUh0bWwoaW52aXNpYmxlRXJyb3JEaXYpIHtcbiAgICAgICAgdGhpcy5jYXJkcyA9IHRoaXMub3JpZ0VsZW0ucXVlcnlTZWxlY3RvckFsbChcbiAgICAgICAgICAgIFwiW2RhdGEtc3ViY29tcG9uZW50PSdkcmFnZ2FibGUnXVwiLFxuICAgICAgICApO1xuICAgICAgICBmb3IgKGxldCBlbGVtZW50IG9mIHRoaXMuY2FyZHMpIHtcbiAgICAgICAgICAgIHRoaXMubWFrZVByZW1pc2UoXG4gICAgICAgICAgICAgICAgZWxlbWVudC5pZCxcbiAgICAgICAgICAgICAgICBlbGVtZW50LmlubmVySFRNTCxcbiAgICAgICAgICAgICAgICB0aGlzLmdldENhdGVnb3J5KGVsZW1lbnQpLFxuICAgICAgICAgICAgICAgIGludmlzaWJsZUVycm9yRGl2LFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5yYW5kb20pIHtcbiAgICAgICAgICAgIC8vIFNodWZmbGUgdGhlIHByZW1pc2VBcnJheSBpZiByYW5kb20gaXMgdHJ1ZVxuICAgICAgICAgICAgdGhpcy5wcmVtaXNlQXJyYXkgPSBzaHVmZmxlQXJyYXkodGhpcy5wcmVtaXNlQXJyYXkpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGVsZW1lbnQgb2YgdGhpcy5vcmlnRWxlbS5xdWVyeVNlbGVjdG9yQWxsKFxuICAgICAgICAgICAgXCJbZGF0YS1zdWJjb21wb25lbnQ9J2Ryb3B6b25lJ11cIixcbiAgICAgICAgKSkge1xuICAgICAgICAgICAgdGhpcy5tYWtlUmVzcG9uc2UoXG4gICAgICAgICAgICAgICAgZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJmb3JcIikucmVwbGFjZShcImRyYWdcIiwgXCJkcm9wXCIpLFxuICAgICAgICAgICAgICAgIGVsZW1lbnQuaW5uZXJIVE1MLFxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0Q2F0ZWdvcnkoZWxlbWVudCksXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5xdWVzdGlvbiA9IHRoaXMub3JpZ0VsZW0ucXVlcnlTZWxlY3RvcihcbiAgICAgICAgICAgIFwiW2RhdGEtc3ViY29tcG9uZW50PSdxdWVzdGlvbiddXCIsXG4gICAgICAgICkuaW5uZXJIVE1MO1xuICAgICAgICBsZXQgZmVlZGJhY2sgPSB0aGlzLm9yaWdFbGVtLnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgICAgICBcIltkYXRhLXN1YmNvbXBvbmVudD0nZmVlZGJhY2snXVwiLFxuICAgICAgICApO1xuICAgICAgICBpZiAoZmVlZGJhY2spIHtcbiAgICAgICAgICAgIHRoaXMuZmVlZGJhY2sgPSBmZWVkYmFjay5pbm5lckhUTUw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKlxuICAgICAqIEJ1aWxkIHRoZSBwcmVtaXNlcy9yZXNwb25zZXMgZnJvbSBhIDxzY3JpcHQ+IHJlcHJlc2VudGF0aW9uIG9mIHRoZVxuICAgICAqIHF1ZXN0aW9uLiBUaGUgc2NyaXB0IGhvbGRzIGVpdGhlciBYTUwgKHR5cGU9XCJ0ZXh0L3htbFwiLCBwYXJzZWQgYnlcbiAgICAgKiBEcmFnbmRyb3BYbWxDb252ZXJ0ZXIpIG9yIEpTT047IGJvdGggeWllbGQgdGhlIHNhbWUgc2hhcGUgdXNlZCBieVxuICAgICAqIG1hdGNoaW5nLmpzOlxuICAgICAqICAgeyBzdGF0ZW1lbnQsIGZlZWRiYWNrLFxuICAgICAqICAgICBsZWZ0OiAgW3tpZCwgbGFiZWwsIGZlZWRiYWNrP30sIC4uLl0sICAgLy8gZHJhZ2dhYmxlcyAocHJlbWlzZXMpXG4gICAgICogICAgIHJpZ2h0OiBbe2lkLCBsYWJlbCwgZmVlZGJhY2s/fSwgLi4uXSwgICAvLyBkcm9wem9uZXMgKHJlc3BvbnNlcylcbiAgICAgKiAgICAgY29ycmVjdEFuc3dlcnM6IFtbbGVmdElkLCByaWdodElkXSwgLi4uXSB9XG4gICAgICogQSBwcmVtaXNlIGJlbG9uZ3MgaW4gdGhlIGRyb3B6b25lIGdpdmVuIGJ5IGl0cyBjb3JyZWN0QW5zd2VycyBwYWlyLCBzbyB3ZVxuICAgICAqIHVzZSB0aGUgcmVzcG9uc2UgaWQgYXMgdGhlIHNoYXJlZCBjYXRlZ29yeS4gU2V2ZXJhbCBwcmVtaXNlcyBtYXkgbWFwIHRvXG4gICAgICogdGhlIHNhbWUgcmVzcG9uc2UgKG1hbnktdG8tb25lKS4gQSBwcmVtaXNlIHRoYXQgYXBwZWFycyBpbiBubyBwYWlyIGlzIGFcbiAgICAgKiBkaXN0cmFjdG9yIGFuZCBnZXRzIGEgY2F0ZWdvcnkgdGhhdCBtYXRjaGVzIG5vIGRyb3B6b25lLiBBIGNhcmQnc1xuICAgICAqIG9wdGlvbmFsIGZlZWRiYWNrIGlzIHNob3duIHdoZW4gdGhhdCBjYXJkIGVuZHMgdXAgaW4gdGhlIHdyb25nIHBsYWNlLlxuICAgICAqL1xuICAgIHBvcHVsYXRlRnJvbVNjcmlwdChzY3JpcHQsIGludmlzaWJsZUVycm9yRGl2KSB7XG4gICAgICAgIGxldCBkYXRhO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKHNjcmlwdC50eXBlID09IFwidGV4dC94bWxcIikge1xuICAgICAgICAgICAgICAgIGRhdGEgPSBuZXcgRHJhZ25kcm9wWG1sQ29udmVydGVyKHNjcmlwdC50ZXh0Q29udGVudCkudG9Kc29uKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRhdGEgPSBKU09OLnBhcnNlKHNjcmlwdC50ZXh0Q29udGVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkZhaWxlZCB0byBwYXJzZSBkcmFnbmRyb3AgcXVlc3Rpb24gZGF0YTpcIiwgZXJyKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmJveERhdGEgPSBkYXRhO1xuICAgICAgICBsZXQgcHJlbWlzZUNhdGVnb3J5ID0ge307XG4gICAgICAgIGZvciAobGV0IHBhaXIgb2YgZGF0YS5jb3JyZWN0QW5zd2VycyB8fCBbXSkge1xuICAgICAgICAgICAgcHJlbWlzZUNhdGVnb3J5W3BhaXJbMF1dID0gcGFpclsxXTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpdGVtIG9mIGRhdGEubGVmdCB8fCBbXSkge1xuICAgICAgICAgICAgbGV0IGNhdGVnb3J5ID0gcHJlbWlzZUNhdGVnb3J5W2l0ZW0uaWRdIHx8IFwiZGlzdHJhY3Rvci1cIiArIGl0ZW0uaWQ7XG4gICAgICAgICAgICB0aGlzLm1ha2VQcmVtaXNlKGl0ZW0uaWQsIGl0ZW0ubGFiZWwsIGNhdGVnb3J5LCBpbnZpc2libGVFcnJvckRpdik7XG4gICAgICAgICAgICB0aGlzLmFkZENhcmRGZWVkYmFjayhpdGVtKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5yYW5kb20pIHtcbiAgICAgICAgICAgIC8vIFNodWZmbGUgdGhlIHByZW1pc2VBcnJheSBpZiByYW5kb20gaXMgdHJ1ZVxuICAgICAgICAgICAgdGhpcy5wcmVtaXNlQXJyYXkgPSBzaHVmZmxlQXJyYXkodGhpcy5wcmVtaXNlQXJyYXkpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGl0ZW0gb2YgZGF0YS5yaWdodCB8fCBbXSkge1xuICAgICAgICAgICAgLy8gQSByZXNwb25zZSdzIGNhdGVnb3J5IGlzIGl0cyBvd24gaWQ7IHRoZSBwcmVtaXNlcyB0aGF0IGJlbG9uZyBpblxuICAgICAgICAgICAgLy8gaXQgc2hhcmUgdGhhdCBjYXRlZ29yeS5cbiAgICAgICAgICAgIHRoaXMubWFrZVJlc3BvbnNlKGl0ZW0uaWQsIGl0ZW0ubGFiZWwsIGl0ZW0uaWQpO1xuICAgICAgICAgICAgdGhpcy5hZGRDYXJkRmVlZGJhY2soaXRlbSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5xdWVzdGlvbiA9IGRhdGEuc3RhdGVtZW50IHx8IFwiXCI7XG4gICAgICAgIHRoaXMuZmVlZGJhY2sgPSBkYXRhLmZlZWRiYWNrIHx8IFwiXCI7XG4gICAgfVxuXG4gICAgYWRkQ2FyZEZlZWRiYWNrKGl0ZW0pIHtcbiAgICAgICAgaWYgKGl0ZW0uZmVlZGJhY2spIHtcbiAgICAgICAgICAgIHRoaXMuY2FyZEZlZWRiYWNrW2l0ZW0uaWRdID0ge1xuICAgICAgICAgICAgICAgIGxhYmVsOiBpdGVtLmxhYmVsLFxuICAgICAgICAgICAgICAgIGZlZWRiYWNrOiBpdGVtLmZlZWRiYWNrLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qXG4gICAgICogQ3JlYXRlIGEgZHJhZ2dhYmxlIHByZW1pc2Ugc3BhbiBhbmQgcmVnaXN0ZXIgaXQuIFNoYXJlZCBieSB0aGUgSFRNTCBhbmRcbiAgICAgKiBKU09OIHBvcHVsYXRpb24gcGF0aHMuXG4gICAgICovXG4gICAgbWFrZVByZW1pc2UoaWQsIGxhYmVsLCBjYXRlZ29yeSwgaW52aXNpYmxlRXJyb3JEaXYpIHtcbiAgICAgICAgbGV0IHJlcGxhY2VTcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgICAgIHJlcGxhY2VTcGFuLmlubmVySFRNTCA9IGxhYmVsO1xuICAgICAgICByZXBsYWNlU3Bhbi5pZCA9IGlkO1xuICAgICAgICByZXBsYWNlU3Bhbi5zZXRBdHRyaWJ1dGUoXCJkcmFnZ2FibGVcIiwgXCJ0cnVlXCIpO1xuICAgICAgICByZXBsYWNlU3Bhbi5jbGFzc0xpc3QuYWRkKFwiZHJhZ2dhYmxlLWRyYWdcIik7XG4gICAgICAgIHJlcGxhY2VTcGFuLmNsYXNzTGlzdC5hZGQoXCJwcmVtaXNlXCIpO1xuICAgICAgICByZXBsYWNlU3Bhbi50YWJJbmRleCA9IDA7XG4gICAgICAgIHJlcGxhY2VTcGFuLnNldEF0dHJpYnV0ZShcInJvbGVcIiwgXCJidXR0b25cIik7XG4gICAgICAgIHJlcGxhY2VTcGFuLmRhdGFzZXQuY2F0ZWdvcnkgPSBjYXRlZ29yeTtcbiAgICAgICAgcmVwbGFjZVNwYW4uZGF0YXNldC5wYXJlbnRfaWQgPSB0aGlzLmRpdmlkO1xuICAgICAgICB0aGlzLnByZW1pc2VBcnJheS5wdXNoKHJlcGxhY2VTcGFuKTtcbiAgICAgICAgdGhpcy51cGRhdGVQcmVtaXNlQXJpYUxhYmVsKHJlcGxhY2VTcGFuKTtcbiAgICAgICAgdGhpcy5zZXREcmFnTGlzdGVuZXJzKHJlcGxhY2VTcGFuKTtcbiAgICAgICAgLy8gbm93IGNyZWF0ZSBhbiBlcnJvciBtZXNzYWdlIGZvciB3aGVuIHRoZSBwcmVtaXNlIGlzIGRyb3BwZWQgaW4gdGhlIHdyb25nIHBsYWNlXG4gICAgICAgIGxldCBlcnJvck1lc3NhZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBlcnJvck1lc3NhZ2UuY2xhc3NMaXN0LmFkZChcInZpc3VhbGx5aGlkZGVuXCIpO1xuICAgICAgICBlcnJvck1lc3NhZ2UuaW5uZXJIVE1MID1cbiAgICAgICAgICAgIFwiSW5jb3JyZWN0IGRyb3Agem9uZSBmb3IgXCIgKyByZXBsYWNlU3Bhbi5pbm5lckhUTUw7XG4gICAgICAgIGVycm9yTWVzc2FnZS5zZXRBdHRyaWJ1dGUoXCJyb2xlXCIsIFwiYWxlcnRcIik7XG4gICAgICAgIGVycm9yTWVzc2FnZS5pZCA9IHJlcGxhY2VTcGFuLmlkICsgXCJfZXJyb3JcIjtcbiAgICAgICAgaW52aXNpYmxlRXJyb3JEaXYuYXBwZW5kQ2hpbGQoZXJyb3JNZXNzYWdlKTtcbiAgICAgICAgcmV0dXJuIHJlcGxhY2VTcGFuO1xuICAgIH1cblxuICAgIC8qXG4gICAgICogQ3JlYXRlIGEgZHJvcHpvbmUgcmVzcG9uc2Ugc3BhbiBhbmQgcmVnaXN0ZXIgaXQuIFNoYXJlZCBieSB0aGUgSFRNTCBhbmRcbiAgICAgKiBKU09OIHBvcHVsYXRpb24gcGF0aHMuXG4gICAgICovXG4gICAgbWFrZVJlc3BvbnNlKGlkLCBsYWJlbCwgY2F0ZWdvcnkpIHtcbiAgICAgICAgbGV0IHJlcGxhY2VTcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgICAgIHJlcGxhY2VTcGFuLmlubmVySFRNTCA9IGxhYmVsO1xuICAgICAgICByZXBsYWNlU3Bhbi5pZCA9IGlkO1xuICAgICAgICByZXBsYWNlU3Bhbi5jbGFzc0xpc3QuYWRkKFwiZHJhZ2dhYmxlLWRyb3BcIiwgXCJkcm9wLWxhYmVsXCIsIFwicmVzcG9uc2VcIik7XG4gICAgICAgIC8vIFJlc3BvbnNlcyBlbnRlciB0aGUgdGFiIG9yZGVyIG9ubHkgd2hpbGUgYSBwcmVtaXNlIGlzIHNlbGVjdGVkLlxuICAgICAgICByZXBsYWNlU3Bhbi50YWJJbmRleCA9IC0xO1xuICAgICAgICByZXBsYWNlU3Bhbi5zZXRBdHRyaWJ1dGUoXCJyb2xlXCIsIFwiYnV0dG9uXCIpO1xuICAgICAgICByZXBsYWNlU3Bhbi5kYXRhc2V0LmNhdGVnb3J5ID0gY2F0ZWdvcnk7XG4gICAgICAgIHJlcGxhY2VTcGFuLmRhdGFzZXQucGFyZW50X2lkID0gdGhpcy5kaXZpZDtcbiAgICAgICAgdGhpcy5yZXNwb25zZUFycmF5LnB1c2gocmVwbGFjZVNwYW4pO1xuICAgICAgICB0aGlzLnNldERyb3BMaXN0ZW5lcnMocmVwbGFjZVNwYW4pO1xuICAgICAgICByZXR1cm4gcmVwbGFjZVNwYW47XG4gICAgfVxuXG4gICAgZ2V0Q2F0ZWdvcnkoZWxlbSkge1xuICAgICAgICBpZiAoZWxlbS5kYXRhc2V0LmNhdGVnb3J5KSB7XG4gICAgICAgICAgICByZXR1cm4gZWxlbS5kYXRhc2V0LmNhdGVnb3J5O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gaWYgbm8gY2F0ZWdvcnkgdGhlbiB1c2UgdGhlIGZvciBhdHRyaWJ1dGUgb3IgdGhlIGlkXG4gICAgICAgICAgICAvLyB0aGlzIGlzIGZvciBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eVxuICAgICAgICAgICAgaWYgKGVsZW0uaGFzQXR0cmlidXRlKFwiZm9yXCIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVsZW0uZ2V0QXR0cmlidXRlKFwiZm9yXCIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZWxlbS5pZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICA9PSBDcmVhdGUgbmV3IEhUTUwgZWxlbWVudHMgYW5kIHJlcGxhY2UgPT1cbiAgICA9PSAgICAgIG9yaWdpbmFsIGVsZW1lbnQgd2l0aCB0aGVtICAgICAgPT1cbiAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbiAgICBjcmVhdGVOZXdFbGVtZW50cygpIHtcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5pZCA9IHRoaXMuZGl2aWQ7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmNsYXNzTGlzdC5hZGQoXCJkcmFnZ2FibGUtY29udGFpbmVyXCIpO1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCAoZXYpID0+IHtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAoZXYua2V5ID09PSBcIkVzY2FwZVwiIHx8IGV2LmtleSA9PT0gXCJFc2NcIikgJiZcbiAgICAgICAgICAgICAgICB0aGlzLmNsb3NlQ2FyZEluZm8oeyByZXN0b3JlRm9jdXM6IHRydWUgfSlcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgICAgIChldi5rZXkgPT09IFwiRXNjYXBlXCIgfHwgZXYua2V5ID09PSBcIkVzY1wiKSAmJlxuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRQcmVtaXNlXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuZGVzZWxlY3RQcmVtaXNlKHsgcmVzdG9yZUZvY3VzOiB0cnVlIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgLy8gQW55IG90aGVyIGNsaWNrIGNsb3NlcyBhbiBvcGVuIGNhcmQgZmVlZGJhY2sgcG9wb3ZlcjsgY2xpY2tzIG9uIHRoZVxuICAgICAgICAvLyBpbmZvIGJ1dHRvbiBvciB0aGUgcG9wb3ZlciBpdHNlbGYgZG9uJ3QgcHJvcGFnYXRlIHRoaXMgZmFyLlxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy5jbG9zZUNhcmRJbmZvKCkpO1xuICAgICAgICB0aGlzLmtleWJvYXJkSW5zdHJ1Y3Rpb25EaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB0aGlzLmtleWJvYXJkSW5zdHJ1Y3Rpb25EaXYuY2xhc3NMaXN0LmFkZChcInZpc3VhbGx5aGlkZGVuXCIpO1xuICAgICAgICB0aGlzLmtleWJvYXJkSW5zdHJ1Y3Rpb25EaXYuc2V0QXR0cmlidXRlKFwiYXJpYS1saXZlXCIsIFwicG9saXRlXCIpO1xuICAgICAgICB0aGlzLmtleWJvYXJkSW5zdHJ1Y3Rpb25EaXYuc2V0QXR0cmlidXRlKFwiYXJpYS1hdG9taWNcIiwgXCJ0cnVlXCIpO1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZCh0aGlzLmtleWJvYXJkSW5zdHJ1Y3Rpb25EaXYpO1xuICAgICAgICB0aGlzLnN0YXRlbWVudERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHRoaXMuc3RhdGVtZW50RGl2LmNsYXNzTGlzdC5hZGQoXCJjYXJkc29ydC1zdGF0ZW1lbnRcIik7XG4gICAgICAgIHRoaXMuc3RhdGVtZW50RGl2LmNsYXNzTGlzdC5hZGQoXCJleGVyY2lzZS1zdGF0ZW1lbnRcIik7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLnN0YXRlbWVudERpdi5pbm5lckhUTUwgPSB0aGlzLnF1ZXN0aW9uO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yIHNldHRpbmcgc3RhdGVtZW50RGl2IGlubmVySFRNTDpcIiwgZXJyb3IpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmFwcGVuZENoaWxkKHRoaXMuc3RhdGVtZW50RGl2KTtcbiAgICAgICAgdGhpcy5kcmFnRHJvcFdyYXBEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpOyAvLyBIb2xkcyB0aGUgZHJhZ2dhYmxlcy9kcm9wem9uZXMsIHByZXZlbnRzIGZlZWRiYWNrIGZyb20gYmxlZWRpbmcgaW5cbiAgICAgICAgdGhpcy5kcmFnRHJvcFdyYXBEaXYuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgICAgdGhpcy5kcmFnRHJvcFdyYXBEaXYuY2xhc3NMaXN0LmFkZChcImRyYWduZHJvcC1rZXlib2FyZC1zdXJmYWNlXCIpO1xuICAgICAgICB0aGlzLmRyYWdEcm9wV3JhcERpdi50YWJJbmRleCA9IC0xO1xuICAgICAgICB0aGlzLmRyYWdEcm9wV3JhcERpdi5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCAoZXYpID0+IHtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlS2V5Ym9hcmRBcHBsaWNhdGlvbktleWRvd24oZXYpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYuYXBwZW5kQ2hpbGQodGhpcy5kcmFnRHJvcFdyYXBEaXYpO1xuICAgICAgICB0aGlzLmRyYWdnYWJsZURpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHRoaXMuZHJhZ2dhYmxlRGl2LmNsYXNzTGlzdC5hZGQoXCJyc2RyYWdnYWJsZVwiLCBcImRyYWd6b25lXCIpO1xuICAgICAgICB0aGlzLmFkZERyYWdEaXZMaXN0ZW5lcnMoKTtcbiAgICAgICAgdGhpcy5kcm9wWm9uZURpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHRoaXMuZHJvcFpvbmVEaXYuY2xhc3NMaXN0LmFkZChcInJzZHJhZ2dhYmxlXCIpO1xuICAgICAgICB0aGlzLmRyYWdEcm9wV3JhcERpdi5hcHBlbmRDaGlsZCh0aGlzLmRyYWdnYWJsZURpdik7XG4gICAgICAgIHRoaXMuZHJhZ0Ryb3BXcmFwRGl2LmFwcGVuZENoaWxkKHRoaXMuZHJvcFpvbmVEaXYpO1xuICAgICAgICB0aGlzLmNyZWF0ZUJ1dHRvbnMoKTtcbiAgICAgICAgdGhpcy5jaGVja1NlcnZlcihcImRyYWdOZHJvcFwiLCB0cnVlKTtcbiAgICAgICAgaWYgKGVCb29rQ29uZmlnLnByYWN0aWNlX21vZGUpIHtcbiAgICAgICAgICAgIHRoaXMuZmluaXNoU2V0dGluZ1VwKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pdnAgPSB0aGlzLmlzVmFsaWRQcmVtaXNlLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMucXVldWVNYXRoSmF4KHRoaXMuY29udGFpbmVyRGl2KS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZGlzYWJsZVByZW1pc2VNYXRoVGFiU3RvcHMoKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUHJlbWlzZUFyaWFMYWJlbHMoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZmluaXNoU2V0dGluZ1VwKCkge1xuICAgICAgICB0aGlzLmFwcGVuZFJlcGxhY2VtZW50U3BhbnMoKTtcbiAgICAgICAgdGhpcy5jcmVhdGVGZWVkYmFja0RpdigpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIlJlcGxhY2luZyBvcmlnRWxlbSB3aXRoIGNvbnRhaW5lckRpdlwiKTtcbiAgICAgICAgdGhpcy5vcmlnRWxlbS5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZCh0aGlzLmNvbnRhaW5lckRpdiwgdGhpcy5vcmlnRWxlbSk7XG4gICAgICAgIGlmICghdGhpcy5oYXNTdG9yZWREcm9wem9uZXMpIHtcbiAgICAgICAgICAgIHRoaXMubWluaGVpZ2h0ID0gdGhpcy5kcmFnZ2FibGVEaXYub2Zmc2V0SGVpZ2h0O1xuICAgICAgICAgICAgLy8gRW5zdXJlIE1hdGhKYXggaGFzIGNvbXBsZXRlZCBiZWZvcmUgYWRqdXN0aW5nIHRoZSB6b25lIHdpZHRoc1xuICAgICAgICAgICAgdGhpcy5xdWV1ZU1hdGhKYXgodGhpcy5jb250YWluZXJEaXYpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZGlzYWJsZVByZW1pc2VNYXRoVGFiU3RvcHMoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVByZW1pc2VBcmlhTGFiZWxzKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGp1c3REcmFnRHJvcFdpZHRocygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kcmFnZ2FibGVEaXYuc3R5bGUubWluSGVpZ2h0ID0gdGhpcy5taW5oZWlnaHQudG9TdHJpbmcoKSArIFwicHhcIjtcbiAgICAgICAgaWYgKHRoaXMuZHJvcFpvbmVEaXYub2Zmc2V0SGVpZ2h0ID4gdGhpcy5taW5oZWlnaHQpIHtcbiAgICAgICAgICAgIHRoaXMuZHJhZ0Ryb3BXcmFwRGl2LnN0eWxlLm1pbkhlaWdodCA9XG4gICAgICAgICAgICAgICAgdGhpcy5kcm9wWm9uZURpdi5vZmZzZXRIZWlnaHQudG9TdHJpbmcoKSArIFwicHhcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZHJhZ0Ryb3BXcmFwRGl2LnN0eWxlLm1pbkhlaWdodCA9XG4gICAgICAgICAgICAgICAgdGhpcy5taW5oZWlnaHQudG9TdHJpbmcoKSArIFwicHhcIjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRyYWdnYWJsZURpdi5zdHlsZS53aWR0aCA9IGAke3RoaXMuZHJhZ3dpZHRofSVgO1xuICAgICAgICB0aGlzLmRyb3Bab25lRGl2LnN0eWxlLndpZHRoID0gYCR7dGhpcy5kcm9wd2lkdGh9JWA7XG4gICAgfVxuICAgIGFkZERyYWdEaXZMaXN0ZW5lcnMoKSB7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgdGhpcy5kcmFnZ2FibGVEaXYuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgIFwiZHJhZ292ZXJcIixcbiAgICAgICAgICAgIGZ1bmN0aW9uIChldikge1xuICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZHJhZ2dhYmxlRGl2LmNsYXNzTGlzdC5jb250YWlucyhcInBvc3NpYmxlRHJvcFwiKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuZHJhZ2dhYmxlRGl2LmNsYXNzTGlzdC5hZGQoXCJwb3NzaWJsZURyb3BcIik7XG4gICAgICAgICAgICB9LmJpbmQodGhpcyksXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuZHJhZ2dhYmxlRGl2LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICBcImRyb3BcIixcbiAgICAgICAgICAgIGZ1bmN0aW9uIChldikge1xuICAgICAgICAgICAgICAgIHRoaXMuaXNBbnN3ZXJlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFBvaW50ZXJEcmFnQWN0aXZlKGZhbHNlKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5kcmFnZ2FibGVEaXYuY2xhc3NMaXN0LmNvbnRhaW5zKFwicG9zc2libGVEcm9wXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZHJhZ2dhYmxlRGl2LmNsYXNzTGlzdC5yZW1vdmUoXCJwb3NzaWJsZURyb3BcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBkYXRhID0gZXYuZGF0YVRyYW5zZmVyLmdldERhdGEoXCJkcmFnZ2FibGVJRFwiKTtcbiAgICAgICAgICAgICAgICB2YXIgZHJhZ2dlZFNwYW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChkYXRhKTtcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICF0aGlzLmRyYWdnYWJsZURpdi5jb250YWlucyhkcmFnZ2VkU3BhbikgJiZcbiAgICAgICAgICAgICAgICAgICAgIXRoaXMuc3RyYW5nZXJEYW5nZXIoZHJhZ2dlZFNwYW4pXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIE1ha2Ugc3VyZSBlbGVtZW50IGlzbid0IGFscmVhZHkgdGhlcmUtLXByZXZlbnRzIGVycm9zIHcvYXBwZW5kaW5nIGNoaWxkXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZHJhZ2dhYmxlRGl2LmFwcGVuZENoaWxkKGRyYWdnZWRTcGFuKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVQcmVtaXNlQXJpYUxhYmVsKGRyYWdnZWRTcGFuKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGp1c3REcmFnRHJvcFdpZHRocygpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm1pbmhlaWdodCA9IHRoaXMuZHJhZ2dhYmxlRGl2Lm9mZnNldEhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kcmFnRHJvcFdyYXBEaXYuc3R5bGUubWluSGVpZ2h0ID1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWluaGVpZ2h0LnRvU3RyaW5nKCkgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9nQm9va0V2ZW50KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50OiBcImRyYWdOZHJvcC1kcm9wXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXZfaWQ6IHRoaXMuZGl2aWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBhY3Q6IGAke2RhdGF9IC0+IGRyYWd6b25lYCxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpLFxuICAgICAgICApO1xuICAgICAgICB0aGlzLmRyYWdnYWJsZURpdi5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgXCJkcmFnbGVhdmVcIixcbiAgICAgICAgICAgIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmRyYWdnYWJsZURpdi5jbGFzc0xpc3QuY29udGFpbnMoXCJwb3NzaWJsZURyb3BcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmRyYWdnYWJsZURpdi5jbGFzc0xpc3QucmVtb3ZlKFwicG9zc2libGVEcm9wXCIpO1xuICAgICAgICAgICAgfS5iaW5kKHRoaXMpLFxuICAgICAgICApO1xuICAgIH1cbiAgICBjcmVhdGVCdXR0b25zKCkge1xuICAgICAgICB0aGlzLmJ1dHRvbkRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHRoaXMuYnV0dG9uRGl2LmNsYXNzTGlzdC5hZGQoXCJkbmQtYnV0dG9uLWNvbnRhaW5lclwiKTtcbiAgICAgICAgdGhpcy5zdWJtaXRCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpOyAvLyBDaGVjayBtZSBidXR0b25cbiAgICAgICAgdGhpcy5zdWJtaXRCdXR0b24udGV4dENvbnRlbnQgPSB0KFwibXNnX2RyYWduZHJvcF9jaGVja19tZVwiKTtcbiAgICAgICAgdGhpcy5zdWJtaXRCdXR0b24uc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJidG4gYnRuLXN1Y2Nlc3MgZHJhZy1idXR0b25cIik7XG4gICAgICAgIHRoaXMuc3VibWl0QnV0dG9uLnNldEF0dHJpYnV0ZShcIm5hbWVcIiwgXCJkbyBhbnN3ZXJcIik7XG4gICAgICAgIHRoaXMuc3VibWl0QnV0dG9uLnNldEF0dHJpYnV0ZShcInR5cGVcIiwgXCJidXR0b25cIik7XG4gICAgICAgIHRoaXMuc3VibWl0QnV0dG9uLm9uY2xpY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLmNoZWNrQ3VycmVudEFuc3dlcigpO1xuICAgICAgICAgICAgLy8gT25seSBjb3VudCB0aGlzIGFzIGEgdHJ5IG9uY2UgdGhlIHN0dWRlbnQgaGFzIHBsYWNlZCBlbm91Z2hcbiAgICAgICAgICAgIC8vIGJsb2NrcyB0byBiZSBncmFkZWQuXG4gICAgICAgICAgICBpZiAodGhpcy5lbm91Z2hQbGFjZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRyaWVzKys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnJlbmRlckZlZWRiYWNrKCk7XG4gICAgICAgICAgICB0aGlzLmxvZ0N1cnJlbnRBbnN3ZXIoKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLnJlc2V0QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTsgLy8gQ2hlY2sgbWUgYnV0dG9uXG4gICAgICAgIHRoaXMucmVzZXRCdXR0b24udGV4dENvbnRlbnQgPSB0KFwibXNnX2RyYWduZHJvcF9yZXNldFwiKTtcbiAgICAgICAgdGhpcy5yZXNldEJ1dHRvbi5zZXRBdHRyaWJ1dGUoXG4gICAgICAgICAgICBcImNsYXNzXCIsXG4gICAgICAgICAgICBcImJ0biBidG4tZGVmYXVsdCBkcmFnLWJ1dHRvbiBkcmFnLXJlc2V0XCIsXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMucmVzZXRCdXR0b24uc2V0QXR0cmlidXRlKFwibmFtZVwiLCBcImRvIGFuc3dlclwiKTtcbiAgICAgICAgdGhpcy5yZXNldEJ1dHRvbi5vbmNsaWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5yZXNldERyYWdnYWJsZXMoKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmJ1dHRvbkRpdi5hcHBlbmRDaGlsZCh0aGlzLnN1Ym1pdEJ1dHRvbik7XG4gICAgICAgIHRoaXMuYnV0dG9uRGl2LmFwcGVuZENoaWxkKHRoaXMucmVzZXRCdXR0b24pO1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZCh0aGlzLmJ1dHRvbkRpdik7XG4gICAgfVxuICAgIGFwcGVuZFJlcGxhY2VtZW50U3BhbnMoKSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHRoaXMuYW5zd2VyU3RhdGUgPT09IHVuZGVmaW5lZCB8fFxuICAgICAgICAgICAgT2JqZWN0LmtleXModGhpcy5hbnN3ZXJTdGF0ZSkubGVuZ3RoID09PSAwXG4gICAgICAgICkge1xuICAgICAgICAgICAgdGhpcy5hbnN3ZXJTdGF0ZSA9IHt9O1xuICAgICAgICAgICAgZm9yIChsZXQgZWxlbWVudCBvZiB0aGlzLnByZW1pc2VBcnJheSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZHJhZ2dhYmxlRGl2LmFwcGVuZENoaWxkKGVsZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChsZXQgZWxlbWVudCBvZiB0aGlzLnJlc3BvbnNlQXJyYXkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRyb3Bab25lRGl2LmFwcGVuZENoaWxkKGVsZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IHBsYWNlZFByZW1pc2VzID0gW107XG4gICAgICAgICAgICBmb3IgKGxldCByZXNwb25zZSBvZiB0aGlzLnJlc3BvbnNlQXJyYXkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRyb3Bab25lRGl2LmFwcGVuZENoaWxkKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5hbnN3ZXJTdGF0ZVtyZXNwb25zZS5pZF0pIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgcHJlbWlzZSBvZiB0aGlzLmFuc3dlclN0YXRlW3Jlc3BvbnNlLmlkXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2VkUHJlbWlzZXMucHVzaChwcmVtaXNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBmb3VuZFByZW1pc2UgPSB0aGlzLmZpbmRQcmVtaXNlKHByZW1pc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZvdW5kUHJlbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlLmFwcGVuZENoaWxkKGZvdW5kUHJlbWlzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYFByZW1pc2Ugd2l0aCBJRCAke3ByZW1pc2V9IG5vdCBmb3VuZCBpbiBwcmVtaXNlQXJyYXlgLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGxldCBwcmVtaXNlIG9mIHRoaXMucHJlbWlzZUFycmF5KSB7XG4gICAgICAgICAgICAgICAgaWYgKHBsYWNlZFByZW1pc2VzLmluZGV4T2YocHJlbWlzZS5pZCkgPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kcmFnZ2FibGVEaXYuYXBwZW5kQ2hpbGQocHJlbWlzZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMudXBkYXRlUHJlbWlzZUFyaWFMYWJlbHMoKTtcbiAgICB9XG5cbiAgICBnZXRSZXNwb25zZUxhYmVsKHJlc3BvbnNlKSB7XG4gICAgICAgIGlmICghcmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlQ2xvbmUgPSByZXNwb25zZS5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICAgIGZvciAoY29uc3QgcHJlbWlzZSBvZiByZXNwb25zZUNsb25lLnF1ZXJ5U2VsZWN0b3JBbGwoXG4gICAgICAgICAgICBcIi5wcmVtaXNlLCAuZHJhZ2dhYmxlLWNhcmQtaW5mb1wiLFxuICAgICAgICApKSB7XG4gICAgICAgICAgICBwcmVtaXNlLnJlbW92ZSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBnZXRBY2Nlc3NpYmxlRWxlbWVudFRleHQocmVzcG9uc2VDbG9uZSk7XG4gICAgfVxuXG4gICAgdXBkYXRlUHJlbWlzZUFyaWFMYWJlbChwcmVtaXNlKSB7XG4gICAgICAgIC8vIEV2ZXJ5IG1vdmUgb2YgYSBwcmVtaXNlIGVuZHMgaGVyZS4gRmVlZGJhY2sgYWJvdXQgd2hlcmUgaXQgd2FzIGlzXG4gICAgICAgIC8vIHN0YWxlIG9uY2UgaXQgbW92ZXMsIGFuZCBpdHMgaW5mbyBjb250cm9sIHdvdWxkIGJlIGxlZnQgYmVoaW5kLlxuICAgICAgICBsZXQgaW5mbyA9IHRoaXMuY2FyZEluZm9Gb3IocHJlbWlzZSk7XG4gICAgICAgIGlmIChpbmZvICYmIHByZW1pc2UubmV4dEVsZW1lbnRTaWJsaW5nICE9PSBpbmZvKSB7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZUNhcmRJbmZvKHByZW1pc2UpO1xuICAgICAgICB9XG4gICAgICAgIC8vIEEgcHJlbWlzZSByZXR1cm5lZCB0byB0aGUgbGVmdCBjb2x1bW4gaXMgbm8gbG9uZ2VyIG1pc3BsYWNlZC5cbiAgICAgICAgaWYgKHByZW1pc2UucGFyZW50RWxlbWVudCA9PT0gdGhpcy5kcmFnZ2FibGVEaXYpIHtcbiAgICAgICAgICAgIHRoaXMuY2xlYXJQcmVtaXNlSW5jb3JyZWN0KHByZW1pc2UpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHByZW1pc2VMYWJlbCA9IGdldEFjY2Vzc2libGVFbGVtZW50VGV4dChwcmVtaXNlKTtcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSB0aGlzLnJlc3BvbnNlQXJyYXkuaW5jbHVkZXMocHJlbWlzZS5wYXJlbnRFbGVtZW50KVxuICAgICAgICAgICAgPyBwcmVtaXNlLnBhcmVudEVsZW1lbnRcbiAgICAgICAgICAgIDogbnVsbDtcbiAgICAgICAgY29uc3QgcGxhY2VtZW50TGFiZWwgPSByZXNwb25zZVxuICAgICAgICAgICAgPyBcInBsYWNlZCBpbiBcIiArIHRoaXMuZ2V0UmVzcG9uc2VMYWJlbChyZXNwb25zZSlcbiAgICAgICAgICAgIDogXCJ1bnBsYWNlZFwiO1xuICAgICAgICBwcmVtaXNlLnNldEF0dHJpYnV0ZShcbiAgICAgICAgICAgIFwiYXJpYS1sYWJlbFwiLFxuICAgICAgICAgICAgcHJlbWlzZUxhYmVsICsgXCIgbWF0Y2hpbmcgcHJlbWlzZSwgXCIgKyBwbGFjZW1lbnRMYWJlbCxcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICB1cGRhdGVQcmVtaXNlQXJpYUxhYmVscygpIHtcbiAgICAgICAgZm9yIChjb25zdCBwcmVtaXNlIG9mIHRoaXMucHJlbWlzZUFycmF5KSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVByZW1pc2VBcmlhTGFiZWwocHJlbWlzZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmaW5kUHJlbWlzZShpZCkge1xuICAgICAgICBmb3IgKGxldCBwcmVtaXNlIG9mIHRoaXMucHJlbWlzZUFycmF5KSB7XG4gICAgICAgICAgICBpZiAocHJlbWlzZS5pZCA9PSBpZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBwcmVtaXNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY291bnRTYXZlZFByZW1pc2VzKCkge1xuICAgICAgICAvLyBDb3VudCBob3cgbWFueSBwcmVtaXNlcyBhcmUgc2F2ZWQgaW4gdGhlIGFuc3dlclN0YXRlXG4gICAgICAgIGxldCBjb3VudCA9IDA7XG4gICAgICAgIGxldCBuYW1lcyA9IHt9O1xuICAgICAgICBmb3IgKGxldCByZXNwb25zZSBvZiB0aGlzLmFuc3dlclN0YXRlKSB7XG4gICAgICAgICAgICBpZiAocmVzcG9uc2UubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IHByZW1pc2Ugb2YgcmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFuYW1lc1twcmVtaXNlXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY291bnQrKztcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWVzW3ByZW1pc2VdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY291bnQ7XG4gICAgfVxuXG4gICAgc2V0RHJhZ0xpc3RlbmVycyhkZ1NwYW4pIHtcbiAgICAgICAgZGdTcGFuLnNldEF0dHJpYnV0ZShcImFyaWEtcHJlc3NlZFwiLCBcImZhbHNlXCIpO1xuICAgICAgICBkZ1NwYW4uYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdzdGFydFwiLCAoZXYpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZGVzZWxlY3RQcmVtaXNlKCk7XG4gICAgICAgICAgICB0aGlzLnNldFBvaW50ZXJEcmFnQWN0aXZlKHRydWUpO1xuICAgICAgICAgICAgZXYuZGF0YVRyYW5zZmVyLnNldERhdGEoXCJkcmFnZ2FibGVJRFwiLCBldi50YXJnZXQuaWQpO1xuICAgICAgICB9KTtcbiAgICAgICAgZGdTcGFuLmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnZW5kXCIsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0UG9pbnRlckRyYWdBY3RpdmUoZmFsc2UpO1xuICAgICAgICB9KTtcbiAgICAgICAgZGdTcGFuLmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnb3ZlclwiLCBmdW5jdGlvbiAoZXYpIHtcbiAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH0pO1xuICAgICAgICBkZ1NwYW4uYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgIFwiZHJvcFwiLFxuICAgICAgICAgICAgZnVuY3Rpb24gKGV2KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pc0Fuc3dlcmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0UG9pbnRlckRyYWdBY3RpdmUoZmFsc2UpO1xuICAgICAgICAgICAgICAgIHZhciBkYXRhID0gZXYuZGF0YVRyYW5zZmVyLmdldERhdGEoXCJkcmFnZ2FibGVJRFwiKTtcbiAgICAgICAgICAgICAgICB2YXIgZHJhZ2dlZFNwYW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChkYXRhKTtcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgIGRyYWdnZWRTcGFuICE9IGV2LnRhcmdldCAmJlxuICAgICAgICAgICAgICAgICAgICAhdGhpcy5zdHJhbmdlckRhbmdlcihkcmFnZ2VkU3BhbilcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gTWFrZSBzdXJlIGVsZW1lbnQgaXNuJ3QgYWxyZWFkeSB0aGVyZS0tcHJldmVudHMgZXJyb3JzIHcvYXBwZW5kaW5nIGNoaWxkXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZHJhZ2dhYmxlRGl2LmFwcGVuZENoaWxkKGRyYWdnZWRTcGFuKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVQcmVtaXNlQXJpYUxhYmVsKGRyYWdnZWRTcGFuKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LmJpbmQodGhpcyksXG4gICAgICAgICk7XG5cbiAgICAgICAgZGdTcGFuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXYpID0+IHtcbiAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBpZiAodGhpcy5zZWxlY3RlZFByZW1pc2UgPT09IGRnU3Bhbikge1xuICAgICAgICAgICAgICAgIHRoaXMuZGVzZWxlY3RQcmVtaXNlKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0UHJlbWlzZShkZ1NwYW4pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBFbnRlciBvciBTcGFjZSBwaWNrcyB1cCBhIHByZW1pc2UuIFByZXNzaW5nIHRoZSBzYW1lIGtleSBhZ2FpbiBwdXRzXG4gICAgICAgIC8vIGl0IGRvd247IEVzY2FwZSBpcyBoYW5kbGVkIGF0IHRoZSBjb21wb25lbnQgbGV2ZWwgc28gaXQgYWxzbyB3b3Jrc1xuICAgICAgICAvLyBhZnRlciBmb2N1cyBoYXMgbW92ZWQgdG8gYSByZXNwb25zZSBvciBidXR0b24uXG4gICAgICAgIGRnU3Bhbi5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCAoZXYpID0+IHtcbiAgICAgICAgICAgIGlmIChldi50YXJnZXQgIT09IGRnU3Bhbikge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChldi5rZXkgPT09IFwiRW50ZXJcIiB8fCBldi5rZXkgPT09IFwiIFwiKSB7XG4gICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zZWxlY3RlZFByZW1pc2UgPT09IGRnU3Bhbikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRlc2VsZWN0UHJlbWlzZSgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0UHJlbWlzZShkZ1NwYW4pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgIXRoaXMuc2VsZWN0ZWRQcmVtaXNlICYmXG4gICAgICAgICAgICAgICAgKGV2LmtleSA9PT0gXCJBcnJvd1VwXCIgfHwgZXYua2V5ID09PSBcIkFycm93RG93blwiKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB0aGlzLm1vdmVQcmVtaXNlRm9jdXMoZGdTcGFuLCBldi5rZXkgPT09IFwiQXJyb3dEb3duXCIpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgICAgICAhdGhpcy5zZWxlY3RlZFByZW1pc2UgJiZcbiAgICAgICAgICAgICAgICAoZXYua2V5ID09PSBcIkFycm93TGVmdFwiIHx8IGV2LmtleSA9PT0gXCJBcnJvd1JpZ2h0XCIpXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuZm9jdXNGaXJzdFByZW1pc2VJbkNvbHVtbihldi5rZXkgPT09IFwiQXJyb3dSaWdodFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZGlzYWJsZVByZW1pc2VNYXRoVGFiU3RvcHMocm9vdCA9IHRoaXMuY29udGFpbmVyRGl2KSB7XG4gICAgICAgIGRpc2FibGVNYXRoSmF4VGFiU3RvcHMocm9vdCwgW1wiLnByZW1pc2VcIiwgXCIucmVzcG9uc2VcIl0pO1xuICAgIH1cblxuICAgIG1vdmVQcmVtaXNlRm9jdXMocHJlbWlzZSwgbW92ZURvd24pIHtcbiAgICAgICAgY29uc3QgcHJlbWlzZVRhYk9yZGVyID0gQXJyYXkuZnJvbShcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyRGl2LnF1ZXJ5U2VsZWN0b3JBbGwoXCIucHJlbWlzZVwiKSxcbiAgICAgICAgKS5maWx0ZXIoKGl0ZW0pID0+IHRoaXMucHJlbWlzZUFycmF5LmluY2x1ZGVzKGl0ZW0pKTtcbiAgICAgICAgY29uc3QgY3VycmVudEluZGV4ID0gcHJlbWlzZVRhYk9yZGVyLmluZGV4T2YocHJlbWlzZSk7XG4gICAgICAgIGlmIChjdXJyZW50SW5kZXggPT09IC0xKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdGFyZ2V0SW5kZXggPSBNYXRoLm1heChcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICBNYXRoLm1pbihcbiAgICAgICAgICAgICAgICBjdXJyZW50SW5kZXggKyAobW92ZURvd24gPyAxIDogLTEpLFxuICAgICAgICAgICAgICAgIHByZW1pc2VUYWJPcmRlci5sZW5ndGggLSAxLFxuICAgICAgICAgICAgKSxcbiAgICAgICAgKTtcbiAgICAgICAgcHJlbWlzZVRhYk9yZGVyW3RhcmdldEluZGV4XT8uZm9jdXMoKTtcbiAgICB9XG5cbiAgICBmb2N1c0ZpcnN0UHJlbWlzZUluQ29sdW1uKHJpZ2h0Q29sdW1uKSB7XG4gICAgICAgIGNvbnN0IGNvbHVtbiA9IHJpZ2h0Q29sdW1uID8gdGhpcy5kcm9wWm9uZURpdiA6IHRoaXMuZHJhZ2dhYmxlRGl2O1xuICAgICAgICBjb25zdCBmaXJzdFByZW1pc2UgPSBBcnJheS5mcm9tKFxuICAgICAgICAgICAgY29sdW1uLnF1ZXJ5U2VsZWN0b3JBbGwoXCIucHJlbWlzZVwiKSxcbiAgICAgICAgKS5maW5kKChpdGVtKSA9PiB0aGlzLnByZW1pc2VBcnJheS5pbmNsdWRlcyhpdGVtKSk7XG4gICAgICAgIGZpcnN0UHJlbWlzZT8uZm9jdXMoKTtcbiAgICB9XG5cbiAgICBzZXREcm9wTGlzdGVuZXJzKGRwU3Bhbikge1xuICAgICAgICBkcFNwYW4uYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgIFwiZHJhZ292ZXJcIixcbiAgICAgICAgICAgIGZ1bmN0aW9uIChldikge1xuICAgICAgICAgICAgICAgIHRoaXMuaXNBbnN3ZXJlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBjb25zdCBkcm9wVGFyZ2V0ID0gZXYuY3VycmVudFRhcmdldDtcbiAgICAgICAgICAgICAgICBpZiAoZHJvcFRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJwb3NzaWJsZURyb3BcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZHJvcFRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJkcmFnZ2FibGUtZHJvcFwiKSkge1xuICAgICAgICAgICAgICAgICAgICBkcm9wVGFyZ2V0LmNsYXNzTGlzdC5hZGQoXCJwb3NzaWJsZURyb3BcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpLFxuICAgICAgICApO1xuICAgICAgICBkcFNwYW4uYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgIFwiZHJhZ2xlYXZlXCIsXG4gICAgICAgICAgICBmdW5jdGlvbiAoZXYpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmlzQW5zd2VyZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgY29uc3QgZHJvcFRhcmdldCA9IGV2LmN1cnJlbnRUYXJnZXQ7XG4gICAgICAgICAgICAgICAgaWYgKCFkcm9wVGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcInBvc3NpYmxlRHJvcFwiKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGRyb3BUYXJnZXQuY2xhc3NMaXN0LnJlbW92ZShcInBvc3NpYmxlRHJvcFwiKTtcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSxcbiAgICAgICAgKTtcbiAgICAgICAgZHBTcGFuLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICBcImRyb3BcIixcbiAgICAgICAgICAgIGZ1bmN0aW9uIChldikge1xuICAgICAgICAgICAgICAgIHRoaXMuaXNBbnN3ZXJlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFBvaW50ZXJEcmFnQWN0aXZlKGZhbHNlKTtcbiAgICAgICAgICAgICAgICBjb25zdCBkcm9wVGFyZ2V0ID0gZXYuY3VycmVudFRhcmdldDtcbiAgICAgICAgICAgICAgICBpZiAoZHJvcFRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJwb3NzaWJsZURyb3BcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgZHJvcFRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKFwicG9zc2libGVEcm9wXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgZGF0YSA9IGV2LmRhdGFUcmFuc2Zlci5nZXREYXRhKFwiZHJhZ2dhYmxlSURcIik7XG4gICAgICAgICAgICAgICAgdmFyIGRyYWdnZWRTcGFuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZGF0YSk7XG4gICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICBkcm9wVGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcImRyYWdnYWJsZS1kcm9wXCIpICYmXG4gICAgICAgICAgICAgICAgICAgICF0aGlzLnN0cmFuZ2VyRGFuZ2VyKGRyYWdnZWRTcGFuKVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAvLyBNYWtlIHN1cmUgZWxlbWVudCBpc24ndCBhbHJlYWR5IHRoZXJlLS1wcmV2ZW50cyBlcnJvcnMgdy9hcHBlbmRpbmcgY2hpbGRcbiAgICAgICAgICAgICAgICAgICAgZHJvcFRhcmdldC5hcHBlbmRDaGlsZChkcmFnZ2VkU3Bhbik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlUHJlbWlzZUFyaWFMYWJlbChkcmFnZ2VkU3Bhbik7XG4gICAgICAgICAgICAgICAgICAgIC8vIGxvZyBhIGRyb3AgZXZlbnRcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2dCb29rRXZlbnQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQ6IFwiZHJhZ05kcm9wLWRyb3BcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpdl9pZDogdGhpcy5kaXZpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdDogYCR7ZGF0YX0gLT4gJHtkcm9wVGFyZ2V0LmlkfWAsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnF1ZXVlTWF0aEpheCh0aGlzLmNvbnRhaW5lckRpdikudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzYWJsZVByZW1pc2VNYXRoVGFiU3RvcHMoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVQcmVtaXNlQXJpYUxhYmVscygpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkanVzdERyYWdEcm9wV2lkdGhzKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LmJpbmQodGhpcyksXG4gICAgICAgICk7XG5cbiAgICAgICAgZHBTcGFuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXYpID0+IHtcbiAgICAgICAgICAgIGlmICghdGhpcy5zZWxlY3RlZFByZW1pc2UgfHwgZXYudGFyZ2V0LmNsb3Nlc3QoXCIucHJlbWlzZVwiKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLnBsYWNlU2VsZWN0ZWRQcmVtaXNlKGRwU3Bhbik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIEFkZCBrZXlib2FyZCBuYXZpZ2F0aW9uIGZvciBkcm9wcGluZyBwcmVtaXNlc1xuICAgICAgICBkcFNwYW4uYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgKGV2KSA9PiB7XG4gICAgICAgICAgICBpZiAoZXYudGFyZ2V0ICE9PSBkcFNwYW4gfHwgIXRoaXMuc2VsZWN0ZWRQcmVtaXNlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGV2LmtleSA9PT0gXCJFbnRlclwiIHx8IGV2LmtleSA9PT0gXCIgXCIpIHtcbiAgICAgICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHRoaXMucGxhY2VTZWxlY3RlZFByZW1pc2UoZHBTcGFuKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXYua2V5ID09PSBcIlRhYlwiKSB7XG4gICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB0aGlzLm1vdmVSZXNwb25zZUZvY3VzKGRwU3BhbiwgZXYuc2hpZnRLZXkpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChldi5rZXkgPT09IFwiQXJyb3dVcFwiIHx8IGV2LmtleSA9PT0gXCJBcnJvd0Rvd25cIikge1xuICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5tb3ZlU2VsZWN0ZWRQcmVtaXNlVmVydGljYWxseShldi5rZXkgPT09IFwiQXJyb3dEb3duXCIpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChldi5rZXkgPT09IFwiQXJyb3dMZWZ0XCIpIHtcbiAgICAgICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHRoaXMucmV0dXJuU2VsZWN0ZWRQcmVtaXNlKCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGV2LmtleSA9PT0gXCJBcnJvd1JpZ2h0XCIpIHtcbiAgICAgICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHRoaXMubW92ZVNlbGVjdGVkUHJlbWlzZVJpZ2h0KGRwU3Bhbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICAvLyBNb3ZpbmcgZm9jdXMgd2l0aCBUYWIgb3IgU2hpZnQrVGFiIHByZXZpZXdzIHRoZSBzZWxlY3RlZCBwcmVtaXNlIGluXG4gICAgICAgIC8vIHRoZSBuZXdseSBmb2N1c2VkIHJlc3BvbnNlLCBqdXN0IGFzIHRoZSB2ZXJ0aWNhbCBhcnJvdyBrZXlzIGRvLlxuICAgICAgICBkcFNwYW4uYWRkRXZlbnRMaXN0ZW5lcihcImZvY3VzXCIsICgpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLnNlbGVjdGVkUHJlbWlzZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0QWN0aXZlUmVzcG9uc2UoZHBTcGFuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgc2V0UG9pbnRlckRyYWdBY3RpdmUoYWN0aXZlKSB7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmNsYXNzTGlzdC50b2dnbGUoXCJwb2ludGVyLWRyYWctYWN0aXZlXCIsIGFjdGl2ZSk7XG4gICAgfVxuXG4gICAgYW5ub3VuY2VLZXlib2FyZEluc3RydWN0aW9uKG1lc3NhZ2UpIHtcbiAgICAgICAgaWYgKHRoaXMua2V5Ym9hcmRJbnN0cnVjdGlvbkRpdikge1xuICAgICAgICAgICAgdGhpcy5rZXlib2FyZEluc3RydWN0aW9uRGl2LnRleHRDb250ZW50ID0gbWVzc2FnZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGVudGVyS2V5Ym9hcmRBcHBsaWNhdGlvbk1vZGUocHJlbWlzZSkge1xuICAgICAgICBpZiAoIXRoaXMuZHJhZ0Ryb3BXcmFwRGl2KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcHJlbWlzZUxhYmVsID0gZ2V0QWNjZXNzaWJsZUVsZW1lbnRUZXh0KHByZW1pc2UpO1xuICAgICAgICB0aGlzLmRyYWdEcm9wV3JhcERpdi50YWJJbmRleCA9IDA7XG4gICAgICAgIHRoaXMuZHJhZ0Ryb3BXcmFwRGl2LnNldEF0dHJpYnV0ZShcInJvbGVcIiwgXCJhcHBsaWNhdGlvblwiKTtcbiAgICAgICAgdGhpcy5kcmFnRHJvcFdyYXBEaXYuc2V0QXR0cmlidXRlKFxuICAgICAgICAgICAgXCJhcmlhLWxhYmVsXCIsXG4gICAgICAgICAgICBgRHJhZyBhbmQgZHJvcCBwbGFjZW1lbnQgZm9yICR7cHJlbWlzZUxhYmVsfWAsXG4gICAgICAgICk7XG4gICAgICAgIGlmICh0aGlzLmFjdGl2ZVJlc3BvbnNlKSB7XG4gICAgICAgICAgICB0aGlzLmRyYWdEcm9wV3JhcERpdi5zZXRBdHRyaWJ1dGUoXG4gICAgICAgICAgICAgICAgXCJhcmlhLWFjdGl2ZWRlc2NlbmRhbnRcIixcbiAgICAgICAgICAgICAgICB0aGlzLmFjdGl2ZVJlc3BvbnNlLmlkLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmFubm91bmNlS2V5Ym9hcmRJbnN0cnVjdGlvbihcbiAgICAgICAgICAgIGBNb3ZpbmcgJHtwcmVtaXNlTGFiZWx9LiBVc2UgYXJyb3cga2V5cyB0byBjaG9vc2UgYSB0YXJnZXQsIEVudGVyIHRvIHBsYWNlLCBvciBFc2NhcGUgdG8gY2FuY2VsLmAsXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuZHJhZ0Ryb3BXcmFwRGl2LmZvY3VzKCk7XG4gICAgfVxuXG4gICAgZXhpdEtleWJvYXJkQXBwbGljYXRpb25Nb2RlKCkge1xuICAgICAgICBpZiAoIXRoaXMuZHJhZ0Ryb3BXcmFwRGl2KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kcmFnRHJvcFdyYXBEaXYucmVtb3ZlQXR0cmlidXRlKFwicm9sZVwiKTtcbiAgICAgICAgdGhpcy5kcmFnRHJvcFdyYXBEaXYucmVtb3ZlQXR0cmlidXRlKFwiYXJpYS1sYWJlbFwiKTtcbiAgICAgICAgdGhpcy5kcmFnRHJvcFdyYXBEaXYucmVtb3ZlQXR0cmlidXRlKFwiYXJpYS1hY3RpdmVkZXNjZW5kYW50XCIpO1xuICAgICAgICB0aGlzLmRyYWdEcm9wV3JhcERpdi50YWJJbmRleCA9IC0xO1xuICAgIH1cblxuICAgIGZvY3VzS2V5Ym9hcmRBcHBsaWNhdGlvblN1cmZhY2UoKSB7XG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGVkUHJlbWlzZSAmJiB0aGlzLmRyYWdEcm9wV3JhcERpdikge1xuICAgICAgICAgICAgdGhpcy5kcmFnRHJvcFdyYXBEaXYuZm9jdXMoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldEFjdGl2ZVJlc3BvbnNlKHJlc3BvbnNlLCB7IG1vdmVQcmVtaXNlID0gdHJ1ZSB9ID0ge30pIHtcbiAgICAgICAgaWYgKCFyZXNwb25zZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYWN0aXZlUmVzcG9uc2UgPSByZXNwb25zZTtcbiAgICAgICAgaWYgKHRoaXMuZHJhZ0Ryb3BXcmFwRGl2ICYmIHRoaXMuc2VsZWN0ZWRQcmVtaXNlKSB7XG4gICAgICAgICAgICB0aGlzLmRyYWdEcm9wV3JhcERpdi5zZXRBdHRyaWJ1dGUoXG4gICAgICAgICAgICAgICAgXCJhcmlhLWFjdGl2ZWRlc2NlbmRhbnRcIixcbiAgICAgICAgICAgICAgICByZXNwb25zZS5pZCxcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgbW92ZVByZW1pc2UgJiZcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRQcmVtaXNlICYmXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkUHJlbWlzZS5wYXJlbnRFbGVtZW50ICE9PSByZXNwb25zZVxuICAgICAgICApIHtcbiAgICAgICAgICAgIHRoaXMubW92ZVNlbGVjdGVkUHJlbWlzZShyZXNwb25zZSwgcmVzcG9uc2UuaWQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbW92ZUFjdGl2ZVJlc3BvbnNlKHsgbW92ZUJhY2t3YXJkID0gZmFsc2UsIHdyYXAgPSBmYWxzZSB9ID0ge30pIHtcbiAgICAgICAgaWYgKCF0aGlzLnNlbGVjdGVkUHJlbWlzZSB8fCB0aGlzLnJlc3BvbnNlQXJyYXkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgb2Zmc2V0ID0gbW92ZUJhY2t3YXJkID8gLTEgOiAxO1xuICAgICAgICBjb25zdCBjdXJyZW50SW5kZXggPSB0aGlzLnJlc3BvbnNlQXJyYXkuaW5kZXhPZih0aGlzLmFjdGl2ZVJlc3BvbnNlKTtcbiAgICAgICAgbGV0IHRhcmdldEluZGV4O1xuICAgICAgICBpZiAoY3VycmVudEluZGV4ID09PSAtMSkge1xuICAgICAgICAgICAgdGFyZ2V0SW5kZXggPSBtb3ZlQmFja3dhcmQgPyB0aGlzLnJlc3BvbnNlQXJyYXkubGVuZ3RoIC0gMSA6IDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0YXJnZXRJbmRleCA9IGN1cnJlbnRJbmRleCArIG9mZnNldDtcbiAgICAgICAgfVxuICAgICAgICBpZiAod3JhcCkge1xuICAgICAgICAgICAgdGFyZ2V0SW5kZXggPVxuICAgICAgICAgICAgICAgICh0YXJnZXRJbmRleCArIHRoaXMucmVzcG9uc2VBcnJheS5sZW5ndGgpICVcbiAgICAgICAgICAgICAgICB0aGlzLnJlc3BvbnNlQXJyYXkubGVuZ3RoO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGFyZ2V0SW5kZXggPSBNYXRoLm1heChcbiAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgIE1hdGgubWluKHRhcmdldEluZGV4LCB0aGlzLnJlc3BvbnNlQXJyYXkubGVuZ3RoIC0gMSksXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2V0QWN0aXZlUmVzcG9uc2UodGhpcy5yZXNwb25zZUFycmF5W3RhcmdldEluZGV4XSk7XG4gICAgICAgIHRoaXMuZm9jdXNLZXlib2FyZEFwcGxpY2F0aW9uU3VyZmFjZSgpO1xuICAgIH1cblxuICAgIGhhbmRsZUtleWJvYXJkQXBwbGljYXRpb25LZXlkb3duKGV2KSB7XG4gICAgICAgIGlmIChldi50YXJnZXQgIT09IHRoaXMuZHJhZ0Ryb3BXcmFwRGl2IHx8ICF0aGlzLnNlbGVjdGVkUHJlbWlzZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChldi5rZXkgPT09IFwiRW50ZXJcIiB8fCBldi5rZXkgPT09IFwiIFwiKSB7XG4gICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICB0aGlzLnBsYWNlU2VsZWN0ZWRQcmVtaXNlKFxuICAgICAgICAgICAgICAgIHRoaXMuYWN0aXZlUmVzcG9uc2UgfHwgdGhpcy5yZXNwb25zZUFycmF5WzBdLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIGlmIChldi5rZXkgPT09IFwiRXNjYXBlXCIgfHwgZXYua2V5ID09PSBcIkVzY1wiKSB7XG4gICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICB0aGlzLmRlc2VsZWN0UHJlbWlzZSh7IHJlc3RvcmVGb2N1czogdHJ1ZSB9KTtcbiAgICAgICAgfSBlbHNlIGlmIChldi5rZXkgPT09IFwiVGFiXCIpIHtcbiAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIHRoaXMubW92ZUFjdGl2ZVJlc3BvbnNlKHsgbW92ZUJhY2t3YXJkOiBldi5zaGlmdEtleSwgd3JhcDogdHJ1ZSB9KTtcbiAgICAgICAgfSBlbHNlIGlmIChldi5rZXkgPT09IFwiQXJyb3dVcFwiIHx8IGV2LmtleSA9PT0gXCJBcnJvd0Rvd25cIikge1xuICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgdGhpcy5tb3ZlQWN0aXZlUmVzcG9uc2Uoe1xuICAgICAgICAgICAgICAgIG1vdmVCYWNrd2FyZDogZXYua2V5ID09PSBcIkFycm93VXBcIixcbiAgICAgICAgICAgICAgICB3cmFwOiBmYWxzZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKGV2LmtleSA9PT0gXCJBcnJvd0xlZnRcIikge1xuICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgdGhpcy5yZXR1cm5TZWxlY3RlZFByZW1pc2UoKTtcbiAgICAgICAgICAgIHRoaXMuZm9jdXNLZXlib2FyZEFwcGxpY2F0aW9uU3VyZmFjZSgpO1xuICAgICAgICB9IGVsc2UgaWYgKGV2LmtleSA9PT0gXCJBcnJvd1JpZ2h0XCIpIHtcbiAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIHRoaXMubW92ZVNlbGVjdGVkUHJlbWlzZVJpZ2h0KFxuICAgICAgICAgICAgICAgIHRoaXMuYWN0aXZlUmVzcG9uc2UgfHwgdGhpcy5yZXNwb25zZUFycmF5WzBdLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHRoaXMuZm9jdXNLZXlib2FyZEFwcGxpY2F0aW9uU3VyZmFjZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbW92ZVJlc3BvbnNlRm9jdXMocmVzcG9uc2UsIG1vdmVCYWNrd2FyZCkge1xuICAgICAgICBjb25zdCBjdXJyZW50SW5kZXggPSB0aGlzLnJlc3BvbnNlQXJyYXkuaW5kZXhPZihyZXNwb25zZSk7XG4gICAgICAgIGNvbnN0IG9mZnNldCA9IG1vdmVCYWNrd2FyZCA/IC0xIDogMTtcbiAgICAgICAgY29uc3QgdGFyZ2V0SW5kZXggPVxuICAgICAgICAgICAgKGN1cnJlbnRJbmRleCArIG9mZnNldCArIHRoaXMucmVzcG9uc2VBcnJheS5sZW5ndGgpICVcbiAgICAgICAgICAgIHRoaXMucmVzcG9uc2VBcnJheS5sZW5ndGg7XG4gICAgICAgIHRoaXMucmVzcG9uc2VBcnJheVt0YXJnZXRJbmRleF0/LmZvY3VzKCk7XG4gICAgfVxuXG4gICAgbW92ZVNlbGVjdGVkUHJlbWlzZVZlcnRpY2FsbHkobW92ZURvd24pIHtcbiAgICAgICAgY29uc3QgcHJlbWlzZSA9IHRoaXMuc2VsZWN0ZWRQcmVtaXNlO1xuICAgICAgICBpZiAoIXByZW1pc2UgfHwgdGhpcy5yZXNwb25zZUFycmF5Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY3VycmVudEluZGV4ID0gdGhpcy5yZXNwb25zZUFycmF5LmluZGV4T2YocHJlbWlzZS5wYXJlbnRFbGVtZW50KTtcbiAgICAgICAgbGV0IHRhcmdldEluZGV4O1xuICAgICAgICBpZiAoY3VycmVudEluZGV4ID09PSAtMSkge1xuICAgICAgICAgICAgdGFyZ2V0SW5kZXggPSBtb3ZlRG93biA/IDAgOiB0aGlzLnJlc3BvbnNlQXJyYXkubGVuZ3RoIC0gMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRhcmdldEluZGV4ID0gY3VycmVudEluZGV4ICsgKG1vdmVEb3duID8gMSA6IC0xKTtcbiAgICAgICAgICAgIHRhcmdldEluZGV4ID0gTWF0aC5tYXgoXG4gICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICBNYXRoLm1pbih0YXJnZXRJbmRleCwgdGhpcy5yZXNwb25zZUFycmF5Lmxlbmd0aCAtIDEpLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gdGhpcy5yZXNwb25zZUFycmF5W3RhcmdldEluZGV4XTtcbiAgICAgICAgdGhpcy5hY3RpdmVSZXNwb25zZSA9IHJlc3BvbnNlO1xuICAgICAgICBpZiAocmVzcG9uc2UgIT09IHByZW1pc2UucGFyZW50RWxlbWVudCkge1xuICAgICAgICAgICAgdGhpcy5tb3ZlU2VsZWN0ZWRQcmVtaXNlKHJlc3BvbnNlLCByZXNwb25zZS5pZCk7XG4gICAgICAgIH1cbiAgICAgICAgcmVzcG9uc2UuZm9jdXMoKTtcbiAgICB9XG5cbiAgICByZXR1cm5TZWxlY3RlZFByZW1pc2UoKSB7XG4gICAgICAgIGNvbnN0IHByZW1pc2UgPSB0aGlzLnNlbGVjdGVkUHJlbWlzZTtcbiAgICAgICAgaWYgKCFwcmVtaXNlIHx8IHByZW1pc2UucGFyZW50RWxlbWVudCA9PT0gdGhpcy5kcmFnZ2FibGVEaXYpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm1vdmVTZWxlY3RlZFByZW1pc2UodGhpcy5kcmFnZ2FibGVEaXYsIFwiZHJhZ3pvbmVcIik7XG4gICAgICAgIHRoaXMuYW5ub3VuY2VLZXlib2FyZEluc3RydWN0aW9uKFwiUmV0dXJuZWQgdG8gdW5wbGFjZWQgbGlzdC5cIik7XG4gICAgfVxuXG4gICAgbW92ZVNlbGVjdGVkUHJlbWlzZVJpZ2h0KHJlc3BvbnNlKSB7XG4gICAgICAgIGNvbnN0IHByZW1pc2UgPSB0aGlzLnNlbGVjdGVkUHJlbWlzZTtcbiAgICAgICAgaWYgKCFwcmVtaXNlIHx8IHByZW1pc2UucGFyZW50RWxlbWVudCAhPT0gdGhpcy5kcmFnZ2FibGVEaXYpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm1vdmVTZWxlY3RlZFByZW1pc2UocmVzcG9uc2UsIHJlc3BvbnNlLmlkKTtcbiAgICB9XG5cbiAgICBtb3ZlU2VsZWN0ZWRQcmVtaXNlKGRlc3RpbmF0aW9uLCBkZXN0aW5hdGlvbk5hbWUpIHtcbiAgICAgICAgY29uc3QgcHJlbWlzZSA9IHRoaXMuc2VsZWN0ZWRQcmVtaXNlO1xuICAgICAgICBpZiAoIXByZW1pc2UgfHwgcHJlbWlzZS5wYXJlbnRFbGVtZW50ID09PSBkZXN0aW5hdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnJlc3BvbnNlQXJyYXkuaW5jbHVkZXMoZGVzdGluYXRpb24pKSB7XG4gICAgICAgICAgICB0aGlzLmFjdGl2ZVJlc3BvbnNlID0gZGVzdGluYXRpb247XG4gICAgICAgIH1cbiAgICAgICAgZGVzdGluYXRpb24uYXBwZW5kQ2hpbGQocHJlbWlzZSk7XG4gICAgICAgIHRoaXMudXBkYXRlUHJlbWlzZUFyaWFMYWJlbChwcmVtaXNlKTtcbiAgICAgICAgdGhpcy5pc0Fuc3dlcmVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5sb2dCb29rRXZlbnQoe1xuICAgICAgICAgICAgZXZlbnQ6IFwiZHJhZ05kcm9wLWRyb3BcIixcbiAgICAgICAgICAgIGRpdl9pZDogdGhpcy5kaXZpZCxcbiAgICAgICAgICAgIGFjdDogYCR7cHJlbWlzZS5pZH0gLT4gJHtkZXN0aW5hdGlvbk5hbWV9YCxcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMucXVldWVNYXRoSmF4KHRoaXMuY29udGFpbmVyRGl2KS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZGlzYWJsZVByZW1pc2VNYXRoVGFiU3RvcHMoKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUHJlbWlzZUFyaWFMYWJlbHMoKTtcbiAgICAgICAgICAgIHRoaXMuYWRqdXN0RHJhZ0Ryb3BXaWR0aHMoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcGxhY2VTZWxlY3RlZFByZW1pc2UocmVzcG9uc2UpIHtcbiAgICAgICAgY29uc3QgcHJlbWlzZSA9IHRoaXMuc2VsZWN0ZWRQcmVtaXNlO1xuICAgICAgICBpZiAoIXByZW1pc2UgfHwgdGhpcy5zdHJhbmdlckRhbmdlcihwcmVtaXNlKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHByZW1pc2UucGFyZW50RWxlbWVudCA9PT0gdGhpcy5kcmFnZ2FibGVEaXYpIHtcbiAgICAgICAgICAgIHRoaXMuZGVzZWxlY3RQcmVtaXNlKCk7XG4gICAgICAgICAgICBwcmVtaXNlLmZvY3VzKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm1vdmVTZWxlY3RlZFByZW1pc2UocmVzcG9uc2UsIHJlc3BvbnNlLmlkKTtcbiAgICAgICAgdGhpcy5kZXNlbGVjdFByZW1pc2UoKTtcbiAgICAgICAgcHJlbWlzZS5mb2N1cygpO1xuICAgIH1cblxuICAgIHNlbGVjdFByZW1pc2UocHJlbWlzZSkge1xuICAgICAgICB0aGlzLmRlc2VsZWN0UHJlbWlzZSgpO1xuICAgICAgICB0aGlzLnNlbGVjdGVkUHJlbWlzZSA9IHByZW1pc2U7XG4gICAgICAgIHByZW1pc2UuY2xhc3NMaXN0LmFkZChcInNlbGVjdGVkXCIpO1xuICAgICAgICBwcmVtaXNlLnNldEF0dHJpYnV0ZShcImFyaWEtcHJlc3NlZFwiLCBcInRydWVcIik7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRSZXNwb25zZSA9IHRoaXMucmVzcG9uc2VBcnJheS5pbmNsdWRlcyhcbiAgICAgICAgICAgIHByZW1pc2UucGFyZW50RWxlbWVudCxcbiAgICAgICAgKVxuICAgICAgICAgICAgPyBwcmVtaXNlLnBhcmVudEVsZW1lbnRcbiAgICAgICAgICAgIDogdGhpcy5yZXNwb25zZUFycmF5WzBdO1xuICAgICAgICB0aGlzLmFjdGl2ZVJlc3BvbnNlID0gY3VycmVudFJlc3BvbnNlIHx8IG51bGw7XG4gICAgICAgIHRoaXMudXBkYXRlS2V5Ym9hcmROYXZpZ2F0aW9uKCk7XG4gICAgICAgIGlmIChjdXJyZW50UmVzcG9uc2UgJiYgcHJlbWlzZS5wYXJlbnRFbGVtZW50ICE9PSBjdXJyZW50UmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHRoaXMubW92ZVNlbGVjdGVkUHJlbWlzZShjdXJyZW50UmVzcG9uc2UsIGN1cnJlbnRSZXNwb25zZS5pZCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lbnRlcktleWJvYXJkQXBwbGljYXRpb25Nb2RlKHByZW1pc2UpO1xuICAgIH1cblxuICAgIGRlc2VsZWN0UHJlbWlzZSh7IHJlc3RvcmVGb2N1cyA9IGZhbHNlIH0gPSB7fSkge1xuICAgICAgICBjb25zdCBwcmVtaXNlID0gdGhpcy5zZWxlY3RlZFByZW1pc2U7XG4gICAgICAgIGlmICghcHJlbWlzZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHByZW1pc2UuY2xhc3NMaXN0LnJlbW92ZShcInNlbGVjdGVkXCIpO1xuICAgICAgICBwcmVtaXNlLnNldEF0dHJpYnV0ZShcImFyaWEtcHJlc3NlZFwiLCBcImZhbHNlXCIpO1xuICAgICAgICB0aGlzLnNlbGVjdGVkUHJlbWlzZSA9IG51bGw7XG4gICAgICAgIHRoaXMuYWN0aXZlUmVzcG9uc2UgPSBudWxsO1xuICAgICAgICB0aGlzLmV4aXRLZXlib2FyZEFwcGxpY2F0aW9uTW9kZSgpO1xuICAgICAgICB0aGlzLnVwZGF0ZUtleWJvYXJkTmF2aWdhdGlvbigpO1xuICAgICAgICBpZiAocmVzdG9yZUZvY3VzKSB7XG4gICAgICAgICAgICBwcmVtaXNlLmZvY3VzKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1cGRhdGVLZXlib2FyZE5hdmlnYXRpb24oKSB7XG4gICAgICAgIGNvbnN0IHByZW1pc2VUYWJJbmRleCA9IHRoaXMuc2VsZWN0ZWRQcmVtaXNlID8gLTEgOiAwO1xuICAgICAgICBjb25zdCByZXNwb25zZVRhYkluZGV4ID0gdGhpcy5zZWxlY3RlZFByZW1pc2UgPyAwIDogLTE7XG4gICAgICAgIGZvciAoY29uc3QgcHJlbWlzZSBvZiB0aGlzLnByZW1pc2VBcnJheSkge1xuICAgICAgICAgICAgcHJlbWlzZS50YWJJbmRleCA9IHByZW1pc2VUYWJJbmRleDtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IHJlc3BvbnNlIG9mIHRoaXMucmVzcG9uc2VBcnJheSkge1xuICAgICAgICAgICAgcmVzcG9uc2UudGFiSW5kZXggPSByZXNwb25zZVRhYkluZGV4O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYWRqdXN0RHJhZ0Ryb3BXaWR0aHMoKSB7XG4gICAgICAgIC8vIFRlbXBvcmFyaWx5IG1pbmltaXplIHRoZSBkcmFnem9uZSB3aWR0aCB0byB0aGUgY29udGVudFxuICAgICAgICB0aGlzLmRyYWdnYWJsZURpdi5zdHlsZS53aWR0aCA9IFwiZml0LWNvbnRlbnRcIjtcblxuICAgICAgICBjb25zdCBkcmFnem9uZVdpZHRoID0gdGhpcy5kcmFnZ2FibGVEaXYub2Zmc2V0V2lkdGg7XG4gICAgICAgIGNvbnN0IHRvdGFsV2lkdGggPSB0aGlzLmRyYWdEcm9wV3JhcERpdi5vZmZzZXRXaWR0aDtcblxuICAgICAgICBsZXQgZHJhZ3pvbmVQZXJjZW50ID0gTWF0aC5jZWlsKChkcmFnem9uZVdpZHRoIC8gdG90YWxXaWR0aCkgKiAxMDApO1xuICAgICAgICBkcmFnem9uZVBlcmNlbnQgPSBNYXRoLm1heCgyOCwgTWF0aC5taW4oZHJhZ3pvbmVQZXJjZW50LCA0OCkpO1xuICAgICAgICBjb25zdCBkcm9wem9uZVBlcmNlbnQgPSAxMDAgLSBkcmFnem9uZVBlcmNlbnQgLSA0OyAvLyA0IGFjY291bnRzIGZvciB6b25lIHBhZGRpbmdcblxuICAgICAgICB0aGlzLmRyYWd3aWR0aCA9IGRyYWd6b25lUGVyY2VudDtcbiAgICAgICAgdGhpcy5kcm9wd2lkdGggPSBkcm9wem9uZVBlcmNlbnQ7XG5cbiAgICAgICAgdGhpcy5kcmFnZ2FibGVEaXYuc3R5bGUud2lkdGggPSBgJHtkcmFnem9uZVBlcmNlbnR9JWA7XG4gICAgICAgIHRoaXMuZHJvcFpvbmVEaXYuc3R5bGUud2lkdGggPSBgJHtkcm9wem9uZVBlcmNlbnR9JWA7XG4gICAgfVxuXG4gICAgY3JlYXRlRmVlZGJhY2tEaXYoKSB7XG4gICAgICAgIGlmICghdGhpcy5mZWVkQmFja0Rpdikge1xuICAgICAgICAgICAgdGhpcy5mZWVkQmFja0RpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICB0aGlzLmZlZWRCYWNrRGl2LmlkID0gdGhpcy5kaXZpZCArIFwiX2ZlZWRiYWNrXCI7XG4gICAgICAgICAgICB0aGlzLmZlZWRCYWNrRGl2LmNsYXNzTGlzdC5hZGQoXCJleGVyY2lzZS1jb250ZW50XCIpO1xuICAgICAgICAgICAgdGhpcy5mZWVkQmFja0Rpdi5zZXRBdHRyaWJ1dGUoXCJhcmlhLWxpdmVcIiwgXCJwb2xpdGVcIik7XG4gICAgICAgICAgICB0aGlzLmZlZWRCYWNrRGl2LnNldEF0dHJpYnV0ZShcInJvbGVcIiwgXCJzdGF0dXNcIik7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZCh0aGlzLmZlZWRCYWNrRGl2KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKj09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT0gQXV4aWxpYXJ5IGZ1bmN0aW9ucyA9PVxuICAgID09PT09PT09PT09PT09PT09PT09PT09Ki9cbiAgICAvKiBsZWF2aW5nIHRoZSBuYW1lIGFzIGlzLCBiZWNhdXNlIGl0IHJlbWluZHMgbWUgb2YgSXNhaWFoISAqL1xuICAgIHN0cmFuZ2VyRGFuZ2VyKHRlc3RTcGFuKSB7XG4gICAgICAgIC8vIFJldHVybnMgdHJ1ZSBpZiB0aGUgdGVzdCBzcGFuIGRvZXNuJ3QgYmVsb25nIHRvIHRoaXMgaW5zdGFuY2Ugb2YgRHJhZ05Ecm9wXG4gICAgICAgIGlmICh0ZXN0U3Bhbi5kYXRhc2V0LnBhcmVudF9pZCAhPSB0aGlzLmRpdmlkKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09IFJlc2V0IGJ1dHRvbiBmdW5jdGlvbmFsaXR5ID09XG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbiAgICByZXNldERyYWdnYWJsZXMoKSB7XG4gICAgICAgIHRoaXMuZGVzZWxlY3RQcmVtaXNlKCk7XG4gICAgICAgIHRoaXMuZHJvcFpvbmVEaXYuaW5uZXJIVE1MID0gXCJcIjtcbiAgICAgICAgZm9yIChsZXQgcmVzcG9uc2Ugb2YgdGhpcy5yZXNwb25zZUFycmF5KSB7XG4gICAgICAgICAgICByZXNwb25zZS5jbGFzc0xpc3QucmVtb3ZlKFwiZHJvcC1pbmNvcnJlY3RcIik7XG4gICAgICAgICAgICB0aGlzLmRyb3Bab25lRGl2LmFwcGVuZENoaWxkKHJlc3BvbnNlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRyYWdnYWJsZURpdi5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgICAvLyBTaHVmZmxlIHRoZSBwcmVtaXNlQXJyYXkgaWYgcmFuZG9tIGlzIHRydWVcbiAgICAgICAgaWYgKHRoaXMucmFuZG9tKSB7XG4gICAgICAgICAgICB0aGlzLnByZW1pc2VBcnJheSA9IHNodWZmbGVBcnJheSh0aGlzLnByZW1pc2VBcnJheSk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgcHJlbWlzZSBvZiB0aGlzLnByZW1pc2VBcnJheSkge1xuICAgICAgICAgICAgLy8gQ2xlYXIgYW55IGluY29ycmVjdCBoaWdobGlnaHRpbmcgbGVmdCBvdmVyIGZyb20gYSBwcmV2aW91cyBjaGVja1xuICAgICAgICAgICAgdGhpcy5jbGVhclByZW1pc2VJbmNvcnJlY3QocHJlbWlzZSk7XG4gICAgICAgICAgICB0aGlzLmRyYWdnYWJsZURpdi5hcHBlbmRDaGlsZChwcmVtaXNlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnVwZGF0ZVByZW1pc2VBcmlhTGFiZWxzKCk7XG4gICAgICAgIHRoaXMuYW5zd2VyU3RhdGUgPSB7fTtcbiAgICAgICAgLy8gU3RhcnQgdGhlIFwiMyB0cmllcyBiZWZvcmUgcmVkXCIgY3ljbGUgb3ZlciBhZnRlciBhIHJlc2V0XG4gICAgICAgIHRoaXMudHJpZXMgPSAwO1xuICAgICAgICB0aGlzLmNsZWFyQ2FyZEluZm8oKTtcbiAgICAgICAgdGhpcy5mZWVkQmFja0Rpdi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgIHRoaXMuYWRqdXN0RHJhZ0Ryb3BXaWR0aHMoKTtcbiAgICAgICAgdGhpcy5taW5oZWlnaHQgPSB0aGlzLmRyYWdnYWJsZURpdi5vZmZzZXRIZWlnaHQ7XG4gICAgICAgIHRoaXMuZHJhZ0Ryb3BXcmFwRGl2LnN0eWxlLm1pbkhlaWdodCA9IHRoaXMubWluaGVpZ2h0LnRvU3RyaW5nKCkgKyBcInB4XCI7XG4gICAgICAgIHRoaXMuZmVlZEJhY2tEaXYuc3R5bGUudmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XG4gICAgICAgIHRoaXMubG9nQm9va0V2ZW50KHtcbiAgICAgICAgICAgIGV2ZW50OiBcImRyYWdOZHJvcC1yZXNldFwiLFxuICAgICAgICAgICAgZGl2X2lkOiB0aGlzLmRpdmlkLFxuICAgICAgICAgICAgYWN0OiBcInJlc2V0XCIsXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnNldExvY2FsU3RvcmFnZSh7IGNvcnJlY3Q6IFwiRlwiIH0pO1xuICAgIH1cbiAgICAvKj09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09IEV2YWx1YXRpb24gYW5kIGZlZWRiYWNrID09XG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbiAgICAvLyBUaGUgcmVzcG9uc2VzIGluIHRoZWlyIG9uLXNjcmVlbiBvcmRlci4gVGhlIGRyb3B6b25lIGNvbHVtbiBhbHNvIGhvbGRzXG4gICAgLy8gdGhlIGluZm8gY29udHJvbHMgb2YgcmVzcG9uc2VzIHdpdGggZmVlZGJhY2ssIHNvIHNraXAgYW55dGhpbmcgZWxzZS5cbiAgICBwbGFjZWRSZXNwb25zZXMoKSB7XG4gICAgICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMuZHJvcFpvbmVEaXYuY2hpbGRyZW4pLmZpbHRlcigoZWwpID0+XG4gICAgICAgICAgICB0aGlzLnJlc3BvbnNlQXJyYXkuaW5jbHVkZXMoZWwpLFxuICAgICAgICApO1xuICAgIH1cblxuICAgIGdldEFsbENhdGVnb3JpZXMoKSB7XG4gICAgICAgIHRoaXMuY2F0ZWdvcmllcyA9IFtdO1xuICAgICAgICBmb3IgKGxldCByZXNwb25zZSBvZiB0aGlzLnBsYWNlZFJlc3BvbnNlcygpKSB7XG4gICAgICAgICAgICB0aGlzLmNhdGVnb3JpZXMucHVzaChyZXNwb25zZS5kYXRhc2V0LmNhdGVnb3J5KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5jYXRlZ29yaWVzO1xuICAgIH1cblxuICAgIGNoZWNrQ3VycmVudEFuc3dlcigpIHtcbiAgICAgICAgbGV0IGNhdGVnb3JpZXMgPSB0aGlzLmdldEFsbENhdGVnb3JpZXMoKTtcbiAgICAgICAgdGhpcy5jb3JyZWN0ID0gdHJ1ZTtcbiAgICAgICAgdGhpcy51bmFuc3dlcmVkTnVtID0gMDtcbiAgICAgICAgdGhpcy5pbmNvcnJlY3ROdW0gPSAwO1xuICAgICAgICB0aGlzLmNvcnJlY3ROdW0gPSAwO1xuICAgICAgICB0aGlzLnBsYWNlZE51bSA9IDA7XG4gICAgICAgIHRoaXMuZHJhZ051bSA9IHRoaXMucHJlbWlzZUFycmF5Lmxlbmd0aDtcbiAgICAgICAgLy8gRGlzdHJhY3RvcnMgYXJlIHByZW1pc2VzIHdob3NlIGNhdGVnb3J5IGRvZXMgbm90IG1hdGNoIGFueSBkcm9wem9uZSxcbiAgICAgICAgLy8gaS5lLiBibG9ja3MgdGhhdCBhcmUgbm90IG1lYW50IHRvIGJlIHBsYWNlZC5cbiAgICAgICAgbGV0IGRpc3RyYWN0b3JOdW0gPSAwO1xuXG4gICAgICAgIGZvciAobGV0IHJlc3BvbnNlIG9mIHRoaXMucGxhY2VkUmVzcG9uc2VzKCkpIHtcbiAgICAgICAgICAgIC8vIGlnbm9yZSBkcm9wIHpvbmUgY2hpbGRyZW4gdGhhdCBhcmVuJ3QgcHJlbWlzZXNcbiAgICAgICAgICAgIGZvciAobGV0IHByZW1pc2Ugb2YgQXJyYXkuZnJvbShyZXNwb25zZS5jaGlsZE5vZGVzKS5maWx0ZXIoXG4gICAgICAgICAgICAgICAgdGhpcy5pdnAsXG4gICAgICAgICAgICApKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wbGFjZWROdW0rKztcbiAgICAgICAgICAgICAgICBpZiAocHJlbWlzZS5kYXRhc2V0LmNhdGVnb3J5ID09IHJlc3BvbnNlLmRhdGFzZXQuY2F0ZWdvcnkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb3JyZWN0TnVtKys7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbmNvcnJlY3ROdW0rKztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgcHJlbWlzZSBvZiB0aGlzLnByZW1pc2VBcnJheSkge1xuICAgICAgICAgICAgaWYgKGNhdGVnb3JpZXMuaW5kZXhPZihwcmVtaXNlLmRhdGFzZXQuY2F0ZWdvcnkpID09IC0xKSB7XG4gICAgICAgICAgICAgICAgZGlzdHJhY3Rvck51bSsrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IHByZW1pc2Ugb2YgQXJyYXkuZnJvbSh0aGlzLmRyYWdnYWJsZURpdi5jaGlsZE5vZGVzKS5maWx0ZXIoXG4gICAgICAgICAgICB0aGlzLml2cCxcbiAgICAgICAgKSkge1xuICAgICAgICAgICAgaWYgKGNhdGVnb3JpZXMuaW5kZXhPZihwcmVtaXNlLmRhdGFzZXQuY2F0ZWdvcnkpID09IC0xKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb3JyZWN0TnVtKys7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudW5hbnN3ZXJlZE51bSsrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIFRoZSBzdHVkZW50IG11c3QgYXR0ZW1wdCB0byBwbGFjZSBldmVyeSBibG9jayB0aGF0IGJlbG9uZ3MgaW4gYVxuICAgICAgICAvLyBkcm9wem9uZSAodG90YWwgcHJlbWlzZXMgbWludXMgdGhlIGRpc3RyYWN0b3JzKSBiZWZvcmUgd2UgZ2l2ZSBhbnlcbiAgICAgICAgLy8gY29ycmVjdG5lc3MgZmVlZGJhY2suXG4gICAgICAgIHRoaXMucmVxdWlyZWRQbGFjZW1lbnRzID0gdGhpcy5wcmVtaXNlQXJyYXkubGVuZ3RoIC0gZGlzdHJhY3Rvck51bTtcbiAgICAgICAgdGhpcy5lbm91Z2hQbGFjZWQgPSB0aGlzLnBsYWNlZE51bSA+PSB0aGlzLnJlcXVpcmVkUGxhY2VtZW50cztcbiAgICAgICAgdGhpcy5wZXJjZW50ID0gdGhpcy5jb3JyZWN0TnVtIC8gdGhpcy5wcmVtaXNlQXJyYXkubGVuZ3RoO1xuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLnBlcmNlbnQsIHRoaXMuaW5jb3JyZWN0TnVtLCB0aGlzLnVuYW5zd2VyZWROdW0pO1xuICAgICAgICBpZiAodGhpcy5wZXJjZW50IDwgMS4wKSB7XG4gICAgICAgICAgICB0aGlzLmNvcnJlY3QgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNldExvY2FsU3RvcmFnZSh7IGNvcnJlY3Q6IHRoaXMuY29ycmVjdCA/IFwiVFwiIDogXCJGXCIgfSk7XG4gICAgfVxuXG4gICAgaXNDb3JyZWN0RHJvcChyZXNwb25zZSkge1xuICAgICAgICAvLyBSZXR1cm5zIHRydWUgaWYgYWxsIHByZW1pc2VzIGluIHRoZSByZXNwb25zZSBhcmUgaW4gdGhlIGNvcnJlY3QgY2F0ZWdvcnlcbiAgICAgICAgLy8gYW5kIGFsbCBwcmVtaXNlcyBpbiB0aGUgY2F0ZWdvcnkgYXJlIGluIHRoZSByZXNwb25zZVxuICAgICAgICAvLyB1c2VkIGJ5IHJlbmRlckZlZWRiYWNrXG4gICAgICAgIGxldCBjb3JyZWN0ID0gdHJ1ZTtcbiAgICAgICAgbGV0IGNvcnJlY3RQbGFjZW1lbnRzID0gMDtcbiAgICAgICAgZm9yIChsZXQgcHJlbWlzZSBvZiBBcnJheS5mcm9tKHJlc3BvbnNlLmNoaWxkTm9kZXMpLmZpbHRlcih0aGlzLml2cCkpIHtcbiAgICAgICAgICAgIGlmIChwcmVtaXNlLmRhdGFzZXQuY2F0ZWdvcnkgIT0gcmVzcG9uc2UuZGF0YXNldC5jYXRlZ29yeSkge1xuICAgICAgICAgICAgICAgIGNvcnJlY3QgPSBmYWxzZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29ycmVjdFBsYWNlbWVudHMrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBsZXQgY2F0Q291bnQgPSAwO1xuICAgICAgICBmb3IgKGxldCBwcmVtaXMgb2YgdGhpcy5wcmVtaXNlQXJyYXkpIHtcbiAgICAgICAgICAgIGlmIChwcmVtaXMuZGF0YXNldC5jYXRlZ29yeSA9PSByZXNwb25zZS5kYXRhc2V0LmNhdGVnb3J5KSB7XG4gICAgICAgICAgICAgICAgY2F0Q291bnQrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29ycmVjdCAmJiBjb3JyZWN0UGxhY2VtZW50cyA9PSBjYXRDb3VudDtcbiAgICB9XG5cbiAgICBpc1ZhbGlkUHJlbWlzZShwcmVtaXNlKSB7XG4gICAgICAgIGlmICh0aGlzLnByZW1pc2VBcnJheS5pbmNsdWRlcyhwcmVtaXNlKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyBsb2dDdXJyZW50QW5zd2VyKHNpZCkge1xuICAgICAgICBsZXQgYW5zd2VyID0gSlNPTi5zdHJpbmdpZnkodGhpcy5hbnN3ZXJTdGF0ZSk7XG4gICAgICAgIGxldCBkYXRhID0ge1xuICAgICAgICAgICAgZXZlbnQ6IFwiZHJhZ05kcm9wXCIsXG4gICAgICAgICAgICBhY3Q6IGFuc3dlcixcbiAgICAgICAgICAgIGFuc3dlcjogYW5zd2VyLFxuICAgICAgICAgICAgbWluX2hlaWdodDogTWF0aC5yb3VuZCh0aGlzLm1pbmhlaWdodCksXG4gICAgICAgICAgICBkcmFnX3dpZHRoOiB0aGlzLmRyYWd3aWR0aCxcbiAgICAgICAgICAgIGRyb3Bfd2lkdGg6IHRoaXMuZHJvcHdpZHRoLFxuICAgICAgICAgICAgZGl2X2lkOiB0aGlzLmRpdmlkLFxuICAgICAgICAgICAgY29ycmVjdDogdGhpcy5jb3JyZWN0LFxuICAgICAgICAgICAgY29ycmVjdE51bTogdGhpcy5jb3JyZWN0TnVtLFxuICAgICAgICAgICAgZHJhZ051bTogdGhpcy5kcmFnTnVtLFxuICAgICAgICB9O1xuICAgICAgICBpZiAodHlwZW9mIHNpZCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgZGF0YS5zaWQgPSBzaWQ7XG4gICAgICAgIH1cbiAgICAgICAgYXdhaXQgdGhpcy5sb2dCb29rRXZlbnQoZGF0YSk7XG4gICAgfVxuICAgIGNsZWFyUHJlbWlzZUluY29ycmVjdChwcmVtaXNlKSB7XG4gICAgICAgIHByZW1pc2UuY2xhc3NMaXN0LnJlbW92ZShcImRyb3AtaW5jb3JyZWN0XCIpO1xuICAgICAgICBwcmVtaXNlLnNldEF0dHJpYnV0ZShcImFyaWEtaW52YWxpZFwiLCBcImZhbHNlXCIpO1xuICAgICAgICBwcmVtaXNlLnJlbW92ZUF0dHJpYnV0ZShcImFyaWEtZXJyb3JtZXNzYWdlXCIpO1xuICAgICAgICBkb2N1bWVudFxuICAgICAgICAgICAgLmdldEVsZW1lbnRCeUlkKHByZW1pc2UuaWQgKyBcIl9lcnJvclwiKVxuICAgICAgICAgICAgPy5jbGFzc0xpc3QuYWRkKFwidmlzdWFsbHloaWRkZW5cIik7XG4gICAgfVxuICAgIGNsZWFySW5jb3JyZWN0SGlnaGxpZ2h0cygpIHtcbiAgICAgICAgLy8gUmVtb3ZlIHRoZSByZWQgXCJkcm9wLWluY29ycmVjdFwiIGhpZ2hsaWdodGluZyBhbmQgcmVsYXRlZCBhMTF5XG4gICAgICAgIC8vIGF0dHJpYnV0ZXMgZnJvbSBldmVyeSBwbGFjZWQgcHJlbWlzZS5cbiAgICAgICAgZm9yIChsZXQgcmVzcG9uc2Ugb2YgdGhpcy5wbGFjZWRSZXNwb25zZXMoKSkge1xuICAgICAgICAgICAgZm9yIChsZXQgcHJlbWlzZSBvZiBBcnJheS5mcm9tKHJlc3BvbnNlLmNoaWxkTm9kZXMpLmZpbHRlcihcbiAgICAgICAgICAgICAgICB0aGlzLml2cCxcbiAgICAgICAgICAgICkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNsZWFyUHJlbWlzZUluY29ycmVjdChwcmVtaXNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZW5kZXJGZWVkYmFjaygpIHtcbiAgICAgICAgaWYgKCF0aGlzLmZlZWRCYWNrRGl2KSB7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZUZlZWRiYWNrRGl2KCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gVGhlIHJlc2V0IGJ1dHRvbiBoaWRlcyB0aGUgZmVlZGJhY2sgYXJlYSB3aXRoIGRpc3BsYXk6bm9uZSwgc28gbWFrZVxuICAgICAgICAvLyBzdXJlIGl0IGlzIHNob3duIGFnYWluIHdoZW5ldmVyIHdlIHJlbmRlciBmZWVkYmFjay5cbiAgICAgICAgdGhpcy5mZWVkQmFja0Rpdi5zdHlsZS5kaXNwbGF5ID0gXCJcIjtcbiAgICAgICAgdGhpcy5mZWVkQmFja0Rpdi5zdHlsZS52aXNpYmlsaXR5ID0gXCJ2aXNpYmxlXCI7XG4gICAgICAgIHRoaXMuY2xlYXJDYXJkSW5mbygpO1xuXG4gICAgICAgIC8vIFJlcXVpcmVtZW50IDE6IGRvbid0IGdpdmUgYW55IGNvcnJlY3RuZXNzIGZlZWRiYWNrIHVudGlsIHRoZSBzdHVkZW50XG4gICAgICAgIC8vIGhhcyBhdHRlbXB0ZWQgdG8gcGxhY2UgYWxsIHRoZSBibG9ja3MgdGhhdCBiZWxvbmcgaW4gYSBkcm9wem9uZS5cbiAgICAgICAgaWYgKCF0aGlzLmVub3VnaFBsYWNlZCkge1xuICAgICAgICAgICAgdGhpcy5jbGVhckluY29ycmVjdEhpZ2hsaWdodHMoKTtcbiAgICAgICAgICAgIGxldCByZW1haW5pbmcgPSB0aGlzLnJlcXVpcmVkUGxhY2VtZW50cyAtIHRoaXMucGxhY2VkTnVtO1xuICAgICAgICAgICAgdmFyIG1zZ1BsYWNlTW9yZSA9IHQoXCJtc2dfZHJhZ25kcm9wX3BsYWNlX21vcmVcIiwgcmVtYWluaW5nKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZmVlZEJhY2tEaXYuaW5uZXJIVE1MID0gYDxkaXYgY2xhc3M9XCJwYXJhXCI+JHttc2dQbGFjZU1vcmV9PC9kaXY+YDtcbiAgICAgICAgICAgIH0sIDEwKTtcbiAgICAgICAgICAgIHRoaXMuZmVlZEJhY2tEaXYuY2xhc3NOYW1lID1cbiAgICAgICAgICAgICAgICBcImFsZXJ0IGFsZXJ0LXdhcm5pbmcgZHJhZ2dhYmxlLWZlZWRiYWNrIGV4ZXJjaXNlLWNvbnRlbnRcIjtcbiAgICAgICAgICAgIHRoaXMucXVldWVNYXRoSmF4KHRoaXMuZmVlZEJhY2tEaXYpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmVxdWlyZW1lbnQgMjogb25seSBjb2xvciB0aGUgbWlzcGxhY2VkIGJsb2NrcyByZWQgb25jZSB0aGUgc3R1ZGVudFxuICAgICAgICAvLyBoYXMgaGFkIGF0IGxlYXN0IE1JTl9UUklFU19GT1JfQ09MT1IgZ3JhZGVhYmxlIHRyaWVzLlxuICAgICAgICBsZXQgc2hvd0NvbG9ycyA9IHRoaXMudHJpZXMgPj0gTUlOX1RSSUVTX0ZPUl9DT0xPUjtcbiAgICAgICAgZm9yIChsZXQgcmVzcG9uc2Ugb2YgdGhpcy5wbGFjZWRSZXNwb25zZXMoKSkge1xuICAgICAgICAgICAgLy8gaXRlcmF0ZSBvdmVyIGFsbCB0aGUgcHJlbWlzZXMgaW4gdGhlIHJlc3BvbnNlXG4gICAgICAgICAgICBmb3IgKGxldCBwcmVtaXNlIG9mIEFycmF5LmZyb20ocmVzcG9uc2UuY2hpbGROb2RlcykuZmlsdGVyKFxuICAgICAgICAgICAgICAgIHRoaXMuaXZwLFxuICAgICAgICAgICAgKSkge1xuICAgICAgICAgICAgICAgIC8vIGlmIHRoZSBwcmVtaXNlIGlzIG5vdCBpbiB0aGUgY29ycmVjdCBjYXRlZ29yeSwgYWRkIHRoZSBjbGFzc1xuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgc2hvd0NvbG9ycyAmJlxuICAgICAgICAgICAgICAgICAgICBwcmVtaXNlLmRhdGFzZXQuY2F0ZWdvcnkgIT0gcmVzcG9uc2UuZGF0YXNldC5jYXRlZ29yeVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICBwcmVtaXNlLmNsYXNzTGlzdC5hZGQoXCJkcm9wLWluY29ycmVjdFwiKTtcbiAgICAgICAgICAgICAgICAgICAgcHJlbWlzZS5zZXRBdHRyaWJ1dGUoXCJhcmlhLWludmFsaWRcIiwgXCJ0cnVlXCIpO1xuICAgICAgICAgICAgICAgICAgICBwcmVtaXNlLnNldEF0dHJpYnV0ZShcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJpYS1lcnJvcm1lc3NhZ2VcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZW1pc2UuaWQgKyBcIl9lcnJvclwiLFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudFxuICAgICAgICAgICAgICAgICAgICAgICAgLmdldEVsZW1lbnRCeUlkKHByZW1pc2UuaWQgKyBcIl9lcnJvclwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmNsYXNzTGlzdC5yZW1vdmUoXCJ2aXN1YWxseWhpZGRlblwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsZWFyUHJlbWlzZUluY29ycmVjdChwcmVtaXNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY29ycmVjdCkge1xuICAgICAgICAgICAgdmFyIG1zZ0NvcnJlY3QgPSB0KFwibXNnX2RyYWduZHJvcF9jb3JyZWN0X2Fuc3dlclwiKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZmVlZEJhY2tEaXYuaW5uZXJIVE1MID0gbXNnQ29ycmVjdDtcbiAgICAgICAgICAgIH0sIDEwKTtcbiAgICAgICAgICAgIHRoaXMuZmVlZEJhY2tEaXYuY2xhc3NOYW1lID1cbiAgICAgICAgICAgICAgICBcImFsZXJ0IGFsZXJ0LWluZm8gZHJhZ2dhYmxlLWZlZWRiYWNrIGV4ZXJjaXNlLWNvbnRlbnRcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBtc2dJbmNvcnJlY3QgPSB0KFxuICAgICAgICAgICAgICAgIFwibXNnX2RyYWduZHJvcF9pbmNvcnJlY3RfYW5zd2VyXCIsXG4gICAgICAgICAgICAgICAgdGhpcy5jb3JyZWN0TnVtLFxuICAgICAgICAgICAgICAgIHRoaXMuaW5jb3JyZWN0TnVtLFxuICAgICAgICAgICAgICAgIHRoaXMuZHJhZ051bSxcbiAgICAgICAgICAgICAgICB0aGlzLnVuYW5zd2VyZWROdW0sXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgLy8gdGhpcy5mZWVkYmFjayBjb21lcyBmcm9tIHRoZSBhdXRob3IgKGEgaGludCBtYXliZSkuXG4gICAgICAgICAgICAvLyBUeXBlc2V0IG9uY2UgdGhlIGRlbGF5ZWQgd3JpdGUgaGFzIHB1dCB0aGUgZmVlZGJhY2sncyBtYXRoIGluIHBsYWNlLlxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5mZWVkQmFja0Rpdi5pbm5lckhUTUwgPSBgPGRpdiBjbGFzcz1cInBhcmFcIj4ke21zZ0luY29ycmVjdH08L2Rpdj4gJHt0aGlzLmZlZWRiYWNrfWA7XG4gICAgICAgICAgICAgICAgdGhpcy5xdWV1ZU1hdGhKYXgodGhpcy5mZWVkQmFja0Rpdik7XG4gICAgICAgICAgICB9LCAxMCk7XG4gICAgICAgICAgICAvLyBGZWVkYmFjayBvbiBpbmRpdmlkdWFsIGNhcmRzIHNheXMgd2hpY2ggY2FyZHMgYXJlIHdyb25nLCBzbyBsaWtlXG4gICAgICAgICAgICAvLyB0aGUgcmVkIGNvbG9yaW5nIGl0IHdhaXRzIGZvciBNSU5fVFJJRVNfRk9SX0NPTE9SIHRyaWVzLlxuICAgICAgICAgICAgaWYgKHNob3dDb2xvcnMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZENhcmRJbmZvKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmZlZWRCYWNrRGl2LmNsYXNzTmFtZSA9XG4gICAgICAgICAgICAgICAgXCJhbGVydCBhbGVydC1kYW5nZXIgZHJhZ2dhYmxlLWZlZWRiYWNrIGV4ZXJjaXNlLWNvbnRlbnRcIjtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKlxuICAgICAqIENhcmRzIHRoYXQgYXJlIG91dCBvZiBwbGFjZTogYSBwcmVtaXNlIHRoYXQgaXMgbm90IGluIHRoZSByZXNwb25zZSBpdFxuICAgICAqIGJlbG9uZ3MgaW4gKG9yIGEgZGlzdHJhY3RvciB0aGF0IHdhcyBwbGFjZWQpLCBhbmQgYSByZXNwb25zZSB3aG9zZVxuICAgICAqIGNvbnRlbnRzIGFyZSB3cm9uZy5cbiAgICAgKi9cbiAgICBtaXNwbGFjZWRDYXJkcygpIHtcbiAgICAgICAgbGV0IGNhcmRzID0gW107XG4gICAgICAgIGZvciAobGV0IHByZW1pc2Ugb2YgdGhpcy5wcmVtaXNlQXJyYXkpIHtcbiAgICAgICAgICAgIGxldCBwYXJlbnQgPSBwcmVtaXNlLnBhcmVudEVsZW1lbnQ7XG4gICAgICAgICAgICBsZXQgcGxhY2VkSW4gPSB0aGlzLnJlc3BvbnNlQXJyYXkuaW5jbHVkZXMocGFyZW50KSA/IHBhcmVudCA6IG51bGw7XG4gICAgICAgICAgICBsZXQgaXNEaXN0cmFjdG9yID0gIXRoaXMucmVzcG9uc2VBcnJheS5zb21lKFxuICAgICAgICAgICAgICAgIChyKSA9PiByLmRhdGFzZXQuY2F0ZWdvcnkgPT0gcHJlbWlzZS5kYXRhc2V0LmNhdGVnb3J5LFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGxldCBtaXNwbGFjZWQgPSBwbGFjZWRJblxuICAgICAgICAgICAgICAgID8gcGxhY2VkSW4uZGF0YXNldC5jYXRlZ29yeSAhPSBwcmVtaXNlLmRhdGFzZXQuY2F0ZWdvcnlcbiAgICAgICAgICAgICAgICA6ICFpc0Rpc3RyYWN0b3I7XG4gICAgICAgICAgICBpZiAobWlzcGxhY2VkKSBjYXJkcy5wdXNoKHByZW1pc2UpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IHJlc3BvbnNlIG9mIHRoaXMucmVzcG9uc2VBcnJheSkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmlzQ29ycmVjdERyb3AocmVzcG9uc2UpKSBjYXJkcy5wdXNoKHJlc3BvbnNlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2FyZHM7XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBHaXZlIGV2ZXJ5IG1pc3BsYWNlZCBjYXJkIHRoYXQgaGFzIGF1dGhvciBmZWVkYmFjayBhbiBpbmZvIGJ1dHRvbiAoYVxuICAgICAqIGRpc2Nsb3N1cmUpIHRoYXQgc2hvd3MgdGhlIGZlZWRiYWNrIGluIGEgcG9wb3ZlciBiZWxvdyB0aGUgY2FyZC4gQ2FyZHNcbiAgICAgKiBoYXZlIHJvbGU9YnV0dG9uLCBhbmQgYSBidXR0b24gbmVzdGVkIGluIG9uZSBpcyBoaWRkZW4gZnJvbSBzY3JlZW5cbiAgICAgKiByZWFkZXJzLCBzbyB0aGUgY29udHJvbCBpcyBhIHNpYmxpbmcgb2YgdGhlIGNhcmQgaW5zdGVhZDogYSB6ZXJvIGhlaWdodFxuICAgICAqIGJveCB0aGF0IENTUyBkcmF3cyBvbnRvIHRoZSBjYXJkLiBBIHByZW1pc2UncyBjb21lcyBhZnRlciBpdCwgYXQgaXRzXG4gICAgICogYm90dG9tLXJpZ2h0IGNvcm5lci4gQSByZXNwb25zZSdzIGNvbWVzIGJlZm9yZSBpdCwgYXQgaXRzIHRvcC1yaWdodFxuICAgICAqIGNvcm5lciBiZXNpZGUgaXRzIGxhYmVsLCBjbGVhciBvZiB0aGUgbGFzdCBwcmVtaXNlIHBsYWNlZCBpbiBpdC5cbiAgICAgKi9cbiAgICBhZGRDYXJkSW5mbygpIHtcbiAgICAgICAgZm9yIChsZXQgY2FyZCBvZiB0aGlzLm1pc3BsYWNlZENhcmRzKCkpIHtcbiAgICAgICAgICAgIGxldCBlbnRyeSA9IHRoaXMuY2FyZEZlZWRiYWNrW2NhcmQuaWRdO1xuICAgICAgICAgICAgaWYgKCFlbnRyeSkgY29udGludWU7XG4gICAgICAgICAgICBsZXQgaW5mbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICBpbmZvLmNsYXNzTGlzdC5hZGQoXCJkcmFnZ2FibGUtY2FyZC1pbmZvXCIpO1xuICAgICAgICAgICAgaW5mby5kYXRhc2V0LmNhcmQgPSBjYXJkLmlkO1xuICAgICAgICAgICAgbGV0IGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICAgICAgICBidXR0b24udHlwZSA9IFwiYnV0dG9uXCI7XG4gICAgICAgICAgICBidXR0b24uY2xhc3NMaXN0LmFkZChcImRyYWdnYWJsZS1jYXJkLWluZm8tYnV0dG9uXCIpO1xuICAgICAgICAgICAgbGV0IGNhcmRMYWJlbCA9IHRoaXMucHJlbWlzZUFycmF5LmluY2x1ZGVzKGNhcmQpXG4gICAgICAgICAgICAgICAgPyBnZXRBY2Nlc3NpYmxlRWxlbWVudFRleHQoY2FyZClcbiAgICAgICAgICAgICAgICA6IHRoaXMuZ2V0UmVzcG9uc2VMYWJlbChjYXJkKTtcbiAgICAgICAgICAgIGJ1dHRvbi5zZXRBdHRyaWJ1dGUoXG4gICAgICAgICAgICAgICAgXCJhcmlhLWxhYmVsXCIsXG4gICAgICAgICAgICAgICAgdChcIm1zZ19kcmFnbmRyb3BfY2FyZF9mZWVkYmFja1wiLCBjYXJkTGFiZWwudHJpbSgpKSxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBidXR0b24udGl0bGUgPSB0KFwibXNnX2RyYWduZHJvcF9jYXJkX2ZlZWRiYWNrX3RpcFwiKTtcbiAgICAgICAgICAgIGJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJhcmlhLWV4cGFuZGVkXCIsIFwiZmFsc2VcIik7XG4gICAgICAgICAgICBidXR0b24uc2V0QXR0cmlidXRlKFwiYXJpYS1jb250cm9sc1wiLCBjYXJkLmlkICsgXCJfaW5mb1wiKTtcbiAgICAgICAgICAgIGJ1dHRvbi5pbm5lckhUTUwgPSAnPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+aTwvc3Bhbj4nO1xuICAgICAgICAgICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXYpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBJbnNpZGUgYSByZXNwb25zZSwgYSBjbGljayB3b3VsZCBvdGhlcndpc2UgcGxhY2UgdGhlXG4gICAgICAgICAgICAgICAgLy8gc2VsZWN0ZWQgcHJlbWlzZS5cbiAgICAgICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICB0aGlzLnRvZ2dsZUNhcmRJbmZvKGNhcmQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBsZXQgcG9wb3ZlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICBwb3BvdmVyLmlkID0gY2FyZC5pZCArIFwiX2luZm9cIjtcbiAgICAgICAgICAgIHBvcG92ZXIuY2xhc3NMaXN0LmFkZChcImRyYWdnYWJsZS1jYXJkLWluZm8tcG9wb3ZlclwiKTtcbiAgICAgICAgICAgIHBvcG92ZXIuaGlkZGVuID0gdHJ1ZTtcbiAgICAgICAgICAgIHBvcG92ZXIuaW5uZXJIVE1MID0gZW50cnkuZmVlZGJhY2s7XG4gICAgICAgICAgICBwb3BvdmVyLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXYpID0+IGV2LnN0b3BQcm9wYWdhdGlvbigpKTtcbiAgICAgICAgICAgIGluZm8uYXBwZW5kKGJ1dHRvbiwgcG9wb3Zlcik7XG4gICAgICAgICAgICBjYXJkLmNsYXNzTGlzdC5hZGQoXCJoYXMtY2FyZC1pbmZvXCIpO1xuICAgICAgICAgICAgaWYgKHRoaXMucHJlbWlzZUFycmF5LmluY2x1ZGVzKGNhcmQpKSB7XG4gICAgICAgICAgICAgICAgY2FyZC5hZnRlcihpbmZvKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaW5mby5jbGFzc0xpc3QuYWRkKFwiZm9yLXJlc3BvbnNlXCIpO1xuICAgICAgICAgICAgICAgIGNhcmQuYmVmb3JlKGluZm8pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5xdWV1ZU1hdGhKYXgocG9wb3Zlcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjYXJkSW5mb0ZvcihjYXJkKSB7XG4gICAgICAgIGlmICghdGhpcy5jb250YWluZXJEaXYpIHJldHVybiBudWxsO1xuICAgICAgICByZXR1cm4gQXJyYXkuZnJvbShcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyRGl2LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZHJhZ2dhYmxlLWNhcmQtaW5mb1wiKSxcbiAgICAgICAgKS5maW5kKChpbmZvKSA9PiBpbmZvLmRhdGFzZXQuY2FyZCA9PT0gY2FyZC5pZCk7XG4gICAgfVxuXG4gICAgcmVtb3ZlQ2FyZEluZm8oY2FyZCkge1xuICAgICAgICB0aGlzLmNhcmRJbmZvRm9yKGNhcmQpPy5yZW1vdmUoKTtcbiAgICAgICAgY2FyZC5jbGFzc0xpc3QucmVtb3ZlKFwiaGFzLWNhcmQtaW5mb1wiKTtcbiAgICB9XG5cbiAgICBjbGVhckNhcmRJbmZvKCkge1xuICAgICAgICBmb3IgKGxldCBpbmZvIG9mIHRoaXMuY29udGFpbmVyRGl2LnF1ZXJ5U2VsZWN0b3JBbGwoXG4gICAgICAgICAgICBcIi5kcmFnZ2FibGUtY2FyZC1pbmZvXCIsXG4gICAgICAgICkpIHtcbiAgICAgICAgICAgIGluZm8ucmVtb3ZlKCk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgY2FyZCBvZiB0aGlzLmNvbnRhaW5lckRpdi5xdWVyeVNlbGVjdG9yQWxsKFwiLmhhcy1jYXJkLWluZm9cIikpIHtcbiAgICAgICAgICAgIGNhcmQuY2xhc3NMaXN0LnJlbW92ZShcImhhcy1jYXJkLWluZm9cIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBPcGVuIG9yIGNsb3NlIGEgY2FyZCdzIGZlZWRiYWNrIHBvcG92ZXIuIFJldHVybnMgZmFsc2UgaWYgaXQgaGFzIG5vbmUuXG4gICAgdG9nZ2xlQ2FyZEluZm8oY2FyZCkge1xuICAgICAgICBsZXQgaW5mbyA9IHRoaXMuY2FyZEluZm9Gb3IoY2FyZCk7XG4gICAgICAgIGlmICghaW5mbykgcmV0dXJuIGZhbHNlO1xuICAgICAgICBsZXQgcG9wb3ZlciA9IGluZm8ucXVlcnlTZWxlY3RvcihcIi5kcmFnZ2FibGUtY2FyZC1pbmZvLXBvcG92ZXJcIik7XG4gICAgICAgIGxldCBvcGVuaW5nID0gcG9wb3Zlci5oaWRkZW47XG4gICAgICAgIHRoaXMuY2xvc2VDYXJkSW5mbygpO1xuICAgICAgICBwb3BvdmVyLmhpZGRlbiA9ICFvcGVuaW5nO1xuICAgICAgICBpbmZvLmNsYXNzTGlzdC50b2dnbGUoXCJvcGVuXCIsIG9wZW5pbmcpO1xuICAgICAgICBpbmZvLnF1ZXJ5U2VsZWN0b3IoXCJidXR0b25cIikuc2V0QXR0cmlidXRlKFxuICAgICAgICAgICAgXCJhcmlhLWV4cGFuZGVkXCIsXG4gICAgICAgICAgICBTdHJpbmcob3BlbmluZyksXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIENsb3NlIGFueSBvcGVuIHBvcG92ZXIsIG9wdGlvbmFsbHkgbW92aW5nIGZvY3VzIGJhY2sgdG8gaXRzIGJ1dHRvbiBpZlxuICAgIC8vIGZvY3VzIHdhcyBpbnNpZGUgaXQuIFJldHVybnMgdHJ1ZSBpZiBvbmUgd2FzIG9wZW4uXG4gICAgY2xvc2VDYXJkSW5mbyh7IHJlc3RvcmVGb2N1cyA9IGZhbHNlIH0gPSB7fSkge1xuICAgICAgICBsZXQgY2xvc2VkID0gZmFsc2U7XG4gICAgICAgIGZvciAobGV0IGluZm8gb2YgdGhpcy5jb250YWluZXJEaXYucXVlcnlTZWxlY3RvckFsbChcbiAgICAgICAgICAgIFwiLmRyYWdnYWJsZS1jYXJkLWluZm8ub3BlblwiLFxuICAgICAgICApKSB7XG4gICAgICAgICAgICBsZXQgYnV0dG9uID0gaW5mby5xdWVyeVNlbGVjdG9yKFwiYnV0dG9uXCIpO1xuICAgICAgICAgICAgbGV0IGhhZEZvY3VzID0gaW5mby5jb250YWlucyhkb2N1bWVudC5hY3RpdmVFbGVtZW50KTtcbiAgICAgICAgICAgIGluZm8uY2xhc3NMaXN0LnJlbW92ZShcIm9wZW5cIik7XG4gICAgICAgICAgICBpbmZvLnF1ZXJ5U2VsZWN0b3IoXCIuZHJhZ2dhYmxlLWNhcmQtaW5mby1wb3BvdmVyXCIpLmhpZGRlbiA9IHRydWU7XG4gICAgICAgICAgICBidXR0b24uc2V0QXR0cmlidXRlKFwiYXJpYS1leHBhbmRlZFwiLCBcImZhbHNlXCIpO1xuICAgICAgICAgICAgaWYgKHJlc3RvcmVGb2N1cyAmJiBoYWRGb2N1cykgYnV0dG9uLmZvY3VzKCk7XG4gICAgICAgICAgICBjbG9zZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjbG9zZWQ7XG4gICAgfVxuXG4gICAgLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09PSBDaGVja2luZy9yZXN0b3JpbmcgZnJvbSBzdG9yYWdlID09PVxuICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbiAgICByZXN0b3JlQW5zd2VycyhkYXRhKSB7XG4gICAgICAgIC8vIFJlc3RvcmUgYW5zd2VycyBmcm9tIHN0b3JhZ2UgcmV0cmlldmFsIGRvbmUgaW4gUnVuZXN0b25lQmFzZVxuICAgICAgICB0aGlzLmhhc1N0b3JlZERyb3B6b25lcyA9IHRydWU7XG4gICAgICAgIHRoaXMubWluaGVpZ2h0ID0gZGF0YS5taW5faGVpZ2h0O1xuICAgICAgICB0aGlzLmRyYWd3aWR0aCA9IGRhdGEuZHJhZ193aWR0aDtcbiAgICAgICAgdGhpcy5kcm9wd2lkdGggPSBkYXRhLmRyb3Bfd2lkdGg7XG4gICAgICAgIHRoaXMuYW5zd2VyU3RhdGUgPSBKU09OLnBhcnNlKGRhdGEuYW5zd2VyKTtcbiAgICAgICAgdGhpcy5jb3JyZWN0ID0gZGF0YS5jb3JyZWN0O1xuICAgICAgICB0aGlzLmZpbmlzaFNldHRpbmdVcCgpO1xuICAgIH1cblxuICAgIGNoZWNrTG9jYWxTdG9yYWdlKCkge1xuICAgICAgICBpZiAodGhpcy5ncmFkZXJhY3RpdmUpIHtcbiAgICAgICAgICAgIHRoaXMuZmluaXNoU2V0dGluZ1VwKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHN0b3JlZE9iajtcbiAgICAgICAgdGhpcy5oYXNTdG9yZWREcm9wem9uZXMgPSBmYWxzZTtcbiAgICAgICAgdmFyIGxlbiA9IGxvY2FsU3RvcmFnZS5sZW5ndGg7XG4gICAgICAgIGlmIChsZW4gPiAwKSB7XG4gICAgICAgICAgICB2YXIgZXggPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLmxvY2FsU3RvcmFnZUtleSgpKTtcbiAgICAgICAgICAgIGlmIChleCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuaGFzU3RvcmVkRHJvcHpvbmVzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBsZXQgZXJyb3IgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBzdG9yZWRPYmogPSBKU09OLnBhcnNlKGV4KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5taW5oZWlnaHQgPSBzdG9yZWRPYmoubWluX2hlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kcmFnd2lkdGggPSBzdG9yZWRPYmouZHJhZ193aWR0aDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kcm9wd2lkdGggPSBzdG9yZWRPYmouZHJvcF93aWR0aDtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZXJyb3Igd2hpbGUgcGFyc2luZzsgbGlrZWx5IGR1ZSB0byBiYWQgdmFsdWUgc3RvcmVkIGluIHN0b3JhZ2VcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgICAgICAgICAgICAgICBgRXJyb3IgcGFyc2luZyBzdG9yZWQgRHJhZ05Ecm9wIGRhdGEgZm9yICR7dGhpcy5kaXZpZH06ICR7ZXJyfWAsXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGVycm9yIHx8IHN0b3JlZE9iai50aW1lc3RhbXAgPCBlQm9va0NvbmZpZy50ZXJtU3RhcnREYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKHRoaXMubG9jYWxTdG9yYWdlS2V5KCkpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmhhc1N0b3JlZERyb3B6b25lcyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmZpbmlzaFNldHRpbmdVcCgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKHRoaXMubG9jYWxTdG9yYWdlS2V5KCkpO1xuICAgICAgICAgICAgICAgIHRoaXMuYW5zd2VyU3RhdGUgPSBzdG9yZWRPYmouYW5zd2VyO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnVzZVJ1bmVzdG9uZVNlcnZpY2VzKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHN0b3JlIGFuc3dlciBpbiBkYXRhYmFzZVxuICAgICAgICAgICAgICAgICAgICBsZXQgYW5zd2VyID0gSlNPTi5zdHJpbmdpZnkodGhpcy5hbnN3ZXJTdGF0ZSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9nQm9va0V2ZW50KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50OiBcImRyYWdOZHJvcFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgYWN0OiBhbnN3ZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICBhbnN3ZXI6IGFuc3dlcixcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbl9oZWlnaHQ6IE1hdGgucm91bmQodGhpcy5taW5oZWlnaHQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgZHJhZ193aWR0aDogdGhpcy5kcmFnd2lkdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICBkcm9wX3dpZHRoOiB0aGlzLmRyb3B3aWR0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpdl9pZDogdGhpcy5kaXZpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvcnJlY3Q6IHN0b3JlZE9iai5jb3JyZWN0LFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5maW5pc2hTZXR0aW5nVXAoKTtcbiAgICB9XG5cbiAgICBzZXRMb2NhbFN0b3JhZ2UoZGF0YSkge1xuICAgICAgICBpZiAoZGF0YS5hbnN3ZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgLy8gSWYgd2UgZGlkbid0IGxvYWQgZnJvbSB0aGUgc2VydmVyLCB3ZSBtdXN0IGdlbmVyYXRlIHRoZSBkYXRhXG4gICAgICAgICAgICB0aGlzLmFuc3dlclN0YXRlID0ge307XG4gICAgICAgICAgICBmb3IgKGxldCByZXNwb25zZSBvZiB0aGlzLnBsYWNlZFJlc3BvbnNlcygpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hbnN3ZXJTdGF0ZVtyZXNwb25zZS5pZF0gPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBwcmVtaXNlIG9mIHJlc3BvbnNlLmNoaWxkTm9kZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJlbWlzZS5ub2RlVHlwZSAhPT0gTm9kZS5URVhUX05PREUgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJlbWlzZUFycmF5LmluY2x1ZGVzKHByZW1pc2UpXG4gICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hbnN3ZXJTdGF0ZVtyZXNwb25zZS5pZF0ucHVzaChwcmVtaXNlLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgdGltZVN0YW1wID0gbmV3IERhdGUoKTtcbiAgICAgICAgdmFyIGNvcnJlY3QgPSBkYXRhLmNvcnJlY3Q7XG4gICAgICAgIHZhciBzdG9yYWdlT2JqID0ge1xuICAgICAgICAgICAgYW5zd2VyOiB0aGlzLmFuc3dlclN0YXRlLFxuICAgICAgICAgICAgbWluX2hlaWdodDogdGhpcy5taW5oZWlnaHQsXG4gICAgICAgICAgICB0aW1lc3RhbXA6IHRpbWVTdGFtcCxcbiAgICAgICAgICAgIGNvcnJlY3Q6IGNvcnJlY3QsXG4gICAgICAgICAgICBkcmFnX3dpZHRoOiB0aGlzLmRyYWd3aWR0aCxcbiAgICAgICAgICAgIGRyb3Bfd2lkdGg6IHRoaXMuZHJvcHdpZHRoLFxuICAgICAgICB9O1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcbiAgICAgICAgICAgIHRoaXMubG9jYWxTdG9yYWdlS2V5KCksXG4gICAgICAgICAgICBKU09OLnN0cmluZ2lmeShzdG9yYWdlT2JqKSxcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBkaXNhYmxlSW50ZXJhY3Rpb24oKSB7XG4gICAgICAgIHRoaXMucmVzZXRCdXR0b24uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucHJlbWlzZUFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAvLyBObyBtb3JlIGRyYWdnaW5nXG4gICAgICAgICAgICB0aGlzLnByZW1pc2VBcnJheVtpXS5kcmFnZ2FibGUgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMucHJlbWlzZUFycmF5W2ldLnN0eWxlLmN1cnNvciA9IFwiaW5pdGlhbFwiO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBzaHVmZmxlQXJyYXkoYXJyYXkpIHtcbiAgICBmb3IgKGxldCBpID0gYXJyYXkubGVuZ3RoIC0gMTsgaSA+IDA7IGktLSkge1xuICAgICAgICAvLyBHZW5lcmF0ZSBhIHJhbmRvbSBpbmRleCBiZXR3ZWVuIDAgYW5kIGlcbiAgICAgICAgY29uc3QgaiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChpICsgMSkpO1xuICAgICAgICAvLyBTd2FwIGVsZW1lbnRzIGF0IGluZGljZXMgaSBhbmQgalxuICAgICAgICBbYXJyYXlbaV0sIGFycmF5W2pdXSA9IFthcnJheVtqXSwgYXJyYXlbaV1dO1xuICAgIH1cbiAgICByZXR1cm4gYXJyYXk7XG59XG5cbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PSBGaW5kIHRoZSBjdXN0b20gSFRNTCB0YWdzIGFuZCA9PVxuPT0gICBleGVjdXRlIG91ciBjb2RlIG9uIHRoZW0gICAgPT1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwicnVuZXN0b25lOmxvZ2luLWNvbXBsZXRlXCIsIGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBlbGVtZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJbZGF0YS1jb21wb25lbnQ9ZHJhZ25kcm9wXVwiKTtcbiAgICBlbGVtZW50cy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICAgIGNvbnN0IG9wdHMgPSB7XG4gICAgICAgICAgICBvcmlnOiBlbGVtZW50LFxuICAgICAgICAgICAgdXNlUnVuZXN0b25lU2VydmljZXM6IGVCb29rQ29uZmlnLnVzZVJ1bmVzdG9uZVNlcnZpY2VzLFxuICAgICAgICB9O1xuICAgICAgICBpZiAoIWVsZW1lbnQuY2xvc2VzdChcIltkYXRhLWNvbXBvbmVudD10aW1lZEFzc2Vzc21lbnRdXCIpKSB7XG4gICAgICAgICAgICAvLyBJZiB0aGlzIGVsZW1lbnQgZXhpc3RzIHdpdGhpbiBhIHRpbWVkIGNvbXBvbmVudCwgZG9uJ3QgcmVuZGVyIGl0IGhlcmVcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgd2luZG93LmNvbXBvbmVudE1hcFtlbGVtZW50LmlkXSA9IG5ldyBEcmFnTkRyb3Aob3B0cyk7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAgICAgICAgICAgYEVycm9yIHJlbmRlcmluZyBEcmFnTkRyb3AgUHJvYmxlbSAke2VsZW1lbnQuaWR9OiAke2Vycn1gLFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbn0pO1xuIiwiaW1wb3J0IHsgbG9hZCB9IGZyb20gXCIuLi8uLi9jb21tb24vanMvcnNpMThuLmpzXCI7XG5cbmxvYWQoe1xuICAgIGVuOiB7XG4gICAgICAgIG1zZ19kcmFnbmRyb3BfY29ycmVjdF9hbnN3ZXI6IFwiWW91IGFyZSBjb3JyZWN0IVwiLFxuICAgICAgICBtc2dfZHJhZ25kcm9wX2luY29ycmVjdF9hbnN3ZXI6XG4gICAgICAgICAgICBcIkluY29ycmVjdC4gT2YgdGhlIGNhcmRzIHlvdSBoYXZlIHNvcnRlZCB5b3UgcGxhY2VkICQxIGNvcnJlY3RseSBhbmQgJDIgaW5jb3JyZWN0bHkuIFlvdSBoYXZlICQ0IGxlZnQgdG8gcGxhY2UuXCIsXG4gICAgICAgIG1zZ19kcmFnbmRyb3BfcGxhY2VfbW9yZTpcbiAgICAgICAgICAgIFwiUGxlYXNlIHBsYWNlIGFsbCBvZiB0aGUgY2FyZHMgYmVmb3JlIGNoZWNraW5nIHlvdXIgYW5zd2VyLiBZb3UgaGF2ZSAkMSBsZWZ0IHRvIHBsYWNlLlwiLFxuICAgICAgICBtc2dfZHJhZ25kcm9wX2NoZWNrX21lOiBcIkNoZWNrIG1lXCIsXG4gICAgICAgIG1zZ19kcmFnbmRyb3BfcmVzZXQ6IFwiUmVzZXRcIixcbiAgICAgICAgbXNnX2RyYWduZHJvcF9jYXJkX2ZlZWRiYWNrOiBcIkZlZWRiYWNrIGZvciAkMVwiLFxuICAgICAgICBtc2dfZHJhZ25kcm9wX2NhcmRfZmVlZGJhY2tfdGlwOiBcIlNob3cgZmVlZGJhY2tcIixcbiAgICB9LFxufSk7XG4iLCJpbXBvcnQgeyBRdWVzdGlvblhtbENvbnZlcnRlciB9IGZyb20gXCIuLi8uLi9jb21tb24vanMveG1sY29udmVyc2lvbi5qc1wiO1xuXG4vKlxuICogRHJhZy1uLWRyb3AgZXhwcmVzc2VzIGl0cyBhbnN3ZXIga2V5IGFzIDxhbnN3ZXI+IGVsZW1lbnRzIHdpdGggcHJlbWlzZSBhbmRcbiAqIHJlc3BvbnNlIGlkIGF0dHJpYnV0ZXMsIHdoaWNoIHJlYWRzIG1vcmUgY2xlYXJseSB0aGFuIG1hdGNoaW5nJ3MgPGVkZ2U+IGZvcm06XG4gKlxuICogICA8YW5zd2VyIHByZW1pc2U9XCJsZWZ0LTFcIiByZXNwb25zZT1cInJpZ2h0LTJcIi8+XG4gKlxuICogU2V2ZXJhbCA8YW5zd2VyPnMgbWF5IHNoYXJlIHRoZSBzYW1lIHJlc3BvbnNlIChtYW55IHByZW1pc2VzIC0+IG9uZSBkcm9wem9uZSkuXG4gKi9cbmV4cG9ydCBjbGFzcyBEcmFnbmRyb3BYbWxDb252ZXJ0ZXIgZXh0ZW5kcyBRdWVzdGlvblhtbENvbnZlcnRlciB7XG4gICAgY29ycmVjdEFuc3dlcnMoKSB7XG4gICAgICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMuZG9jLnF1ZXJ5U2VsZWN0b3JBbGwoXCJhbnN3ZXJcIikpLm1hcCgoYSkgPT4gW1xuICAgICAgICAgICAgYS5nZXRBdHRyaWJ1dGUoXCJwcmVtaXNlXCIpLFxuICAgICAgICAgICAgYS5nZXRBdHRyaWJ1dGUoXCJyZXNwb25zZVwiKSxcbiAgICAgICAgXSk7XG4gICAgfVxufVxuIiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiaW1wb3J0IHsgbG9hZCB9IGZyb20gXCIuLi8uLi9jb21tb24vanMvcnNpMThuLmpzXCI7XG5cbmxvYWQoe1xuICAgIFwicHQtYnJcIjoge1xuICAgICAgICBtc2dfZHJhZ25kcm9wX2NvcnJlY3RfYW5zd2VyOiBcIkNvcnJldG8hXCIsXG4gICAgICAgIG1zZ19kcmFnbmRyb3BfaW5jb3JyZWN0X2Fuc3dlcjpcbiAgICAgICAgICAgIFwiSW5jb3JyZXRvLiBWb2PDqiB0ZXZlICQxIGNvcnJldG8ocykgZSAkMiBpbmNvcnJldG8ocykgZGUgJDMuIFZvY8OqIGRlaXhvdSAkNCBlbSBicmFuY28uXCIsXG4gICAgICAgIG1zZ19kcmFnbmRyb3BfcGxhY2VfbW9yZTpcbiAgICAgICAgICAgIFwiUG9yIGZhdm9yLCBwb3NpY2lvbmUgdG9kb3Mgb3MgY2FydMO1ZXMgYW50ZXMgZGUgdmVyaWZpY2FyIHN1YSByZXNwb3N0YS4gVm9jw6ogYWluZGEgdGVtICQxIHBhcmEgcG9zaWNpb25hci5cIixcbiAgICAgICAgbXNnX2RyYWduZHJvcF9jaGVja19tZTogXCJWZXJpZmljYXJcIixcbiAgICAgICAgbXNnX2RyYWduZHJvcF9yZXNldDogXCJSZXNldGFyXCIsXG4gICAgICAgIG1zZ19kcmFnbmRyb3BfY2FyZF9mZWVkYmFjazogXCJDb21lbnTDoXJpbyBzb2JyZSAkMVwiLFxuICAgICAgICBtc2dfZHJhZ25kcm9wX2NhcmRfZmVlZGJhY2tfdGlwOiBcIk1vc3RyYXIgY29tZW50w6FyaW9cIixcbiAgICB9LFxufSk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=