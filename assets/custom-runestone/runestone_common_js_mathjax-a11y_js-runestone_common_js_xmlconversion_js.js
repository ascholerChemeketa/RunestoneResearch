"use strict";
(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_common_js_mathjax-a11y_js-runestone_common_js_xmlconversion_js"],{

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

/***/ 47937:
/*!*********************************************!*\
  !*** ./runestone/common/js/mathjax-a11y.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   disableMathJaxTabStops: () => (/* binding */ disableMathJaxTabStops),
/* harmony export */   getAccessibleElementText: () => (/* binding */ getAccessibleElementText),
/* harmony export */   getMathJaxSpeechDescendantText: () => (/* binding */ getMathJaxSpeechDescendantText),
/* harmony export */   getMathJaxSpeechText: () => (/* binding */ getMathJaxSpeechText)
/* harmony export */ });
/* ***********************************
 * |docname| - MathJax accessibility helpers
 * ***********************************
 * Utilities for interactive elements that contain MathJax-rendered content.
 */

const mathSpeechSelector =
    "mjx-container, .MathJax, [data-semantic-speech-none]";
const mathSpeechDescendantSelector =
    "mjx-container[aria-label], .MathJax[aria-label], [data-semantic-speech-none]";

/**
 * Return MathJax's speech text for a rendered math element.
 */
function getMathJaxSpeechText(element) {
    if (!element || element.nodeType !== Node.ELEMENT_NODE) {
        return "";
    }
    if (!element.matches(mathSpeechSelector)) {
        return "";
    }
    return (
        element.getAttribute("data-semantic-speech-none") ||
        element.getAttribute("aria-label") ||
        ""
    )
        .replace(/\s+/g, " ")
        .trim();
}

/**
 * Return the speech text from the first MathJax descendant of an element.
 */
function getMathJaxSpeechDescendantText(element) {
    return getMathJaxSpeechText(
        element?.querySelector?.(mathSpeechDescendantSelector),
    );
}

/**
 * Return an accessible text equivalent for content that can include MathJax.
 */
function getAccessibleElementText(element) {
    const parts = [];
    const visit = (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
            parts.push(node.textContent);
            return;
        }
        if (node.nodeType !== Node.ELEMENT_NODE) {
            return;
        }
        const nodeElement = node;
        const speechText = getMathJaxSpeechText(nodeElement);
        if (speechText) {
            parts.push(speechText);
            return;
        }
        if (nodeElement.matches(".process-math")) {
            const descendantSpeech =
                getMathJaxSpeechDescendantText(nodeElement);
            if (descendantSpeech) {
                parts.push(descendantSpeech);
                return;
            }
        }
        if (nodeElement.getAttribute("aria-hidden") === "true") {
            return;
        }
        if (nodeElement.tagName === "IMG") {
            parts.push(nodeElement.getAttribute("alt") || "");
            return;
        }
        for (const child of nodeElement.childNodes) {
            visit(child);
        }
    };
    if (element) {
        visit(element);
    }
    return parts.join(" ").replace(/\s+/g, " ").trim();
}

/**
 * Remove rendered MathJax content from the tab order within each container.
 */
function disableMathJaxTabStops(root, containerSelectors) {
    const mathSelectors = [
        ".MathJax",
        "mjx-container",
        ".process-math",
        ".MathJax [tabindex]",
        "mjx-container [tabindex]",
        ".process-math [tabindex]",
    ];
    const selector = containerSelectors
        .flatMap((containerSelector) =>
            mathSelectors.map(
                (mathSelector) => containerSelector + " " + mathSelector,
            ),
        )
        .join(", ");
    for (const mathElement of root.querySelectorAll(selector)) {
        mathElement.setAttribute("tabindex", "-1");
    }
}


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuZXN0b25lX2NvbW1vbl9qc19tYXRoamF4LWExMXlfanMtcnVuZXN0b25lX2NvbW1vbl9qc194bWxjb252ZXJzaW9uX2pzLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxnQkFBZ0IscUJBQXFCO0FBQ3JDLGdCQUFnQixxQkFBcUI7QUFDckM7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxrQkFBa0Isc0JBQXNCO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0IsSUFBSSxFQUFFLE1BQU0sS0FBSyxJQUFJO0FBQzNDO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2hJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2NvbW1vbi9qcy94bWxjb252ZXJzaW9uLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvY29tbW9uL2pzL21hdGhqYXgtYTExeS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQmFzZSBjbGFzcyBmb3IgY29udmVydGluZyBhIHF1ZXN0aW9uIGF1dGhvcmVkIGFzIFhNTCBpbnRvIHRoZSBKU09OIHNoYXBlIHRoZVxuICogaW50ZXJhY3RpdmUgY29tcG9uZW50cyBjb25zdW1lOlxuICpcbiAqICAgeyBzdGF0ZW1lbnQsIGZlZWRiYWNrLFxuICogICAgIGxlZnQ6ICBbe2lkLCBsYWJlbCwgZmVlZGJhY2s/fSwgLi4uXSwgICAvLyA8cHJlbWlzZT4gZWxlbWVudHNcbiAqICAgICByaWdodDogW3tpZCwgbGFiZWwsIGZlZWRiYWNrP30sIC4uLl0sICAgLy8gPHJlc3BvbnNlPiBlbGVtZW50c1xuICogICAgIGNvcnJlY3RBbnN3ZXJzOiBbW2xlZnRJZCwgcmlnaHRJZF0sIC4uLl0gfVxuICpcbiAqIEEgPHByZW1pc2U+IG9yIDxyZXNwb25zZT4gbWF5IGNhcnJ5IGl0cyBvd24gPGZlZWRiYWNrPiAoUHJlVGVYdCBcImNhcmRzb3J0XCJcbiAqIHdpdGggZmVlZGJhY2sgb24gY2FyZHMpOyBpdCBpcyBpbmNsdWRlZCBvbmx5IHdoZW4gcHJlc2VudCBhbmQgbm9uLWVtcHR5LlxuICpcbiAqIFRoZSBwaWVjZXMgZXZlcnkgcXVlc3Rpb24gdHlwZSBzaGFyZXMgLS0gcGFyc2luZywgdGhlIDxzdGF0ZW1lbnQ+LzxmZWVkYmFjaz5cbiAqIHRhZ3MsIGFuZCB0aGUgPHByZW1pc2U+LzxyZXNwb25zZT4gbGlzdHMgLS0gbGl2ZSBoZXJlLiBIb3cgdGhlIGFuc3dlciBrZXkgaXNcbiAqIGV4cHJlc3NlZCBkaWZmZXJzIGJldHdlZW4gY29tcG9uZW50cywgc28gc3ViY2xhc3NlcyBvdmVycmlkZSBjb3JyZWN0QW5zd2VycygpLlxuICovXG5leHBvcnQgY2xhc3MgUXVlc3Rpb25YbWxDb252ZXJ0ZXIge1xuICAgIGNvbnN0cnVjdG9yKHhtbFN0cmluZykge1xuICAgICAgICBjb25zdCBwYXJzZXIgPSBuZXcgRE9NUGFyc2VyKCk7XG4gICAgICAgIC8vIFBhcnNlIGFzIEhUTUwgc28gdGhhdCBtYXJrdXAgaW5zaWRlIDxzdGF0ZW1lbnQ+LzxsYWJlbD4gKGUuZy4gPHA+LFxuICAgICAgICAvLyBtYXRoIHNwYW5zKSBpcyBwcmVzZXJ2ZWQgYW5kIHJlYWNoYWJsZSB2aWEgaW5uZXJIVE1MLlxuICAgICAgICB0aGlzLmRvYyA9IHBhcnNlci5wYXJzZUZyb21TdHJpbmcoXG4gICAgICAgICAgICBleHBhbmRTZWxmQ2xvc2luZ1RhZ3MoeG1sU3RyaW5nKSxcbiAgICAgICAgICAgIFwidGV4dC9odG1sXCIsXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IGVyciA9IHRoaXMuZG9jLnF1ZXJ5U2VsZWN0b3IoXCJwYXJzZXJlcnJvclwiKTtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiWE1MIHBhcnNlIGVycm9yOiBcIiArIGVyci50ZXh0Q29udGVudCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gVGhlIHF1ZXN0aW9uJ3Mgcm9vdCBlbGVtZW50LCBlLmcuIDxkcmFnbmRyb3A+IG9yIDxtYXRjaGluZz4uXG4gICAgICAgIHRoaXMucm9vdCA9IHRoaXMuZG9jLmJvZHkuZmlyc3RFbGVtZW50Q2hpbGQgfHwgdGhpcy5kb2MuYm9keTtcbiAgICB9XG5cbiAgICAvLyBUaGUgcXVlc3Rpb24tbGV2ZWwgPHN0YXRlbWVudD4gb3IgPGZlZWRiYWNrPjogYSBjaGlsZCBvZiB0aGUgcm9vdCwgbm90XG4gICAgLy8gdGhlIDxmZWVkYmFjaz4gb2YgYSBjYXJkLCB3aGljaCBtYXkgY29tZSBmaXJzdCBpbiBkb2N1bWVudCBvcmRlci5cbiAgICByb290Q2hpbGQodGFnTmFtZSkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgY2hpbGRFbGVtZW50KHRoaXMucm9vdCwgdGFnTmFtZSkgfHwgdGhpcy5kb2MucXVlcnlTZWxlY3Rvcih0YWdOYW1lKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIGdldFN0YXRlbWVudCgpIHtcbiAgICAgICAgY29uc3QgZWwgPSB0aGlzLnJvb3RDaGlsZChcInN0YXRlbWVudFwiKTtcbiAgICAgICAgcmV0dXJuIGVsID8gZWwuaW5uZXJIVE1MLnRyaW0oKSA6IFwiXCI7XG4gICAgfVxuXG4gICAgZ2V0RmVlZGJhY2soKSB7XG4gICAgICAgIGNvbnN0IGVsID0gdGhpcy5yb290Q2hpbGQoXCJmZWVkYmFja1wiKTtcbiAgICAgICAgcmV0dXJuIGVsID8gZWwuaW5uZXJIVE1MLnRyaW0oKSA6IFwiXCI7XG4gICAgfVxuXG4gICAgLy8gRXh0cmFjdCBbeyBpZCwgbGFiZWwsIGZlZWRiYWNrPyB9LCAuLi5dIGZyb20gZXZlcnkgPHByZW1pc2U+IG9yXG4gICAgLy8gPHJlc3BvbnNlPiBlbGVtZW50LiBpbm5lckhUTUwgcHJlc2VydmVzIGFueSBtYXJrdXAgaW5zaWRlIHRoZSBsYWJlbC5cbiAgICBpdGVtc0Zyb20odGFnTmFtZSkge1xuICAgICAgICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLmRvYy5xdWVyeVNlbGVjdG9yQWxsKHRhZ05hbWUpKS5tYXAoKGVsKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpZEVsID0gY2hpbGRFbGVtZW50KGVsLCBcImlkXCIpO1xuICAgICAgICAgICAgY29uc3QgbGFiZWxFbCA9IGNoaWxkRWxlbWVudChlbCwgXCJsYWJlbFwiKTtcbiAgICAgICAgICAgIGNvbnN0IGZlZWRiYWNrRWwgPSBjaGlsZEVsZW1lbnQoZWwsIFwiZmVlZGJhY2tcIik7XG4gICAgICAgICAgICBjb25zdCBpdGVtID0ge1xuICAgICAgICAgICAgICAgIGlkOiBpZEVsID8gaWRFbC50ZXh0Q29udGVudC50cmltKCkgOiBcIlwiLFxuICAgICAgICAgICAgICAgIGxhYmVsOiBsYWJlbEVsID8gbGFiZWxFbC5pbm5lckhUTUwudHJpbSgpIDogXCJcIixcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBjb25zdCBmZWVkYmFjayA9IGZlZWRiYWNrRWwgPyBmZWVkYmFja0VsLmlubmVySFRNTC50cmltKCkgOiBcIlwiO1xuICAgICAgICAgICAgaWYgKGZlZWRiYWNrKSB7XG4gICAgICAgICAgICAgICAgaXRlbS5mZWVkYmFjayA9IGZlZWRiYWNrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIFJldHVybnMgdGhlIGFuc3dlciBrZXkgYXMgW1tsZWZ0SWQsIHJpZ2h0SWRdLCAuLi5dLiBUaGUgd2F5IGFuc3dlcnMgYXJlXG4gICAgLy8gZXhwcmVzc2VkIGluIHRoZSBYTUwgaXMgY29tcG9uZW50IHNwZWNpZmljLCBzbyBzdWJjbGFzc2VzIG11c3QgaW1wbGVtZW50XG4gICAgLy8gdGhpcy5cbiAgICBjb3JyZWN0QW5zd2VycygpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgXCJjb3JyZWN0QW5zd2VycygpIG11c3QgYmUgaW1wbGVtZW50ZWQgYnkgYSBzdWJjbGFzcyBvZiBRdWVzdGlvblhtbENvbnZlcnRlclwiLFxuICAgICAgICApO1xuICAgIH1cblxuICAgIHRvSnNvbigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0YXRlbWVudDogdGhpcy5nZXRTdGF0ZW1lbnQoKSxcbiAgICAgICAgICAgIGZlZWRiYWNrOiB0aGlzLmdldEZlZWRiYWNrKCksXG4gICAgICAgICAgICBsZWZ0OiB0aGlzLml0ZW1zRnJvbShcInByZW1pc2VcIiksXG4gICAgICAgICAgICByaWdodDogdGhpcy5pdGVtc0Zyb20oXCJyZXNwb25zZVwiKSxcbiAgICAgICAgICAgIGNvcnJlY3RBbnN3ZXJzOiB0aGlzLmNvcnJlY3RBbnN3ZXJzKCksXG4gICAgICAgIH07XG4gICAgfVxufVxuXG5mdW5jdGlvbiBjaGlsZEVsZW1lbnQocGFyZW50LCB0YWdOYW1lKSB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20ocGFyZW50LmNoaWxkcmVuKS5maW5kKFxuICAgICAgICAoY2hpbGQpID0+IGNoaWxkLmxvY2FsTmFtZSA9PT0gdGFnTmFtZSxcbiAgICApO1xufVxuXG4vLyBIVE1MIGVsZW1lbnRzIHRoYXQgYXJlIGxlZ2l0aW1hdGVseSB3cml0dGVuIGFzIDx0YWcvPi5cbmNvbnN0IFZPSURfRUxFTUVOVFMgPSBuZXcgU2V0KFtcbiAgICBcImFyZWFcIixcbiAgICBcImJhc2VcIixcbiAgICBcImJyXCIsXG4gICAgXCJjb2xcIixcbiAgICBcImVtYmVkXCIsXG4gICAgXCJoclwiLFxuICAgIFwiaW1nXCIsXG4gICAgXCJpbnB1dFwiLFxuICAgIFwibGlua1wiLFxuICAgIFwibWV0YVwiLFxuICAgIFwicGFyYW1cIixcbiAgICBcInNvdXJjZVwiLFxuICAgIFwidHJhY2tcIixcbiAgICBcIndiclwiLFxuXSk7XG5cbi8qXG4gKiBUaGUgSFRNTCBwYXJzZXIgaWdub3JlcyB0aGUgc2xhc2ggaW4gPGZlZWRiYWNrLz4gYW5kIHRyZWF0cyBpdCBhcyBhbiBvcGVuXG4gKiB0YWcsIHNvIGV2ZXJ5dGhpbmcgYWZ0ZXIgaXQgd291bGQgZW5kIHVwIGluc2lkZSB0aGUgZW1wdHkgZWxlbWVudC4gQW4gWE1MXG4gKiBzZXJpYWxpemVyIChseG1sLCB3aGVuIHRoZSBtYW5pZmVzdCBpcyBzdG9yZWQgaW4gdGhlIGRhdGFiYXNlKSB3cml0ZXMgZW1wdHlcbiAqIGVsZW1lbnRzIHRoYXQgd2F5LCBlLmcuIGFuIGV4ZXJjaXNlIHdpdGggbm8gPGZlZWRiYWNrPiBvciBhbiA8YW5zd2VyLz4uXG4gKi9cbmZ1bmN0aW9uIGV4cGFuZFNlbGZDbG9zaW5nVGFncyh4bWxTdHJpbmcpIHtcbiAgICByZXR1cm4geG1sU3RyaW5nLnJlcGxhY2UoXG4gICAgICAgIC88KFtBLVphLXpdW1xcdzotXSopKCg/OlxccytbXjw+XSo/KT8pXFxzKlxcLz4vZyxcbiAgICAgICAgKG1hdGNoLCB0YWcsIGF0dHJzKSA9PlxuICAgICAgICAgICAgVk9JRF9FTEVNRU5UUy5oYXModGFnLnRvTG93ZXJDYXNlKCkpXG4gICAgICAgICAgICAgICAgPyBtYXRjaFxuICAgICAgICAgICAgICAgIDogYDwke3RhZ30ke2F0dHJzfT48LyR7dGFnfT5gLFxuICAgICk7XG59XG4iLCIvKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogfGRvY25hbWV8IC0gTWF0aEpheCBhY2Nlc3NpYmlsaXR5IGhlbHBlcnNcbiAqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBVdGlsaXRpZXMgZm9yIGludGVyYWN0aXZlIGVsZW1lbnRzIHRoYXQgY29udGFpbiBNYXRoSmF4LXJlbmRlcmVkIGNvbnRlbnQuXG4gKi9cblxuY29uc3QgbWF0aFNwZWVjaFNlbGVjdG9yID1cbiAgICBcIm1qeC1jb250YWluZXIsIC5NYXRoSmF4LCBbZGF0YS1zZW1hbnRpYy1zcGVlY2gtbm9uZV1cIjtcbmNvbnN0IG1hdGhTcGVlY2hEZXNjZW5kYW50U2VsZWN0b3IgPVxuICAgIFwibWp4LWNvbnRhaW5lclthcmlhLWxhYmVsXSwgLk1hdGhKYXhbYXJpYS1sYWJlbF0sIFtkYXRhLXNlbWFudGljLXNwZWVjaC1ub25lXVwiO1xuXG4vKipcbiAqIFJldHVybiBNYXRoSmF4J3Mgc3BlZWNoIHRleHQgZm9yIGEgcmVuZGVyZWQgbWF0aCBlbGVtZW50LlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWF0aEpheFNwZWVjaFRleHQoZWxlbWVudCkge1xuICAgIGlmICghZWxlbWVudCB8fCBlbGVtZW50Lm5vZGVUeXBlICE9PSBOb2RlLkVMRU1FTlRfTk9ERSkge1xuICAgICAgICByZXR1cm4gXCJcIjtcbiAgICB9XG4gICAgaWYgKCFlbGVtZW50Lm1hdGNoZXMobWF0aFNwZWVjaFNlbGVjdG9yKSkge1xuICAgICAgICByZXR1cm4gXCJcIjtcbiAgICB9XG4gICAgcmV0dXJuIChcbiAgICAgICAgZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXNlbWFudGljLXNwZWVjaC1ub25lXCIpIHx8XG4gICAgICAgIGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiYXJpYS1sYWJlbFwiKSB8fFxuICAgICAgICBcIlwiXG4gICAgKVxuICAgICAgICAucmVwbGFjZSgvXFxzKy9nLCBcIiBcIilcbiAgICAgICAgLnRyaW0oKTtcbn1cblxuLyoqXG4gKiBSZXR1cm4gdGhlIHNwZWVjaCB0ZXh0IGZyb20gdGhlIGZpcnN0IE1hdGhKYXggZGVzY2VuZGFudCBvZiBhbiBlbGVtZW50LlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWF0aEpheFNwZWVjaERlc2NlbmRhbnRUZXh0KGVsZW1lbnQpIHtcbiAgICByZXR1cm4gZ2V0TWF0aEpheFNwZWVjaFRleHQoXG4gICAgICAgIGVsZW1lbnQ/LnF1ZXJ5U2VsZWN0b3I/LihtYXRoU3BlZWNoRGVzY2VuZGFudFNlbGVjdG9yKSxcbiAgICApO1xufVxuXG4vKipcbiAqIFJldHVybiBhbiBhY2Nlc3NpYmxlIHRleHQgZXF1aXZhbGVudCBmb3IgY29udGVudCB0aGF0IGNhbiBpbmNsdWRlIE1hdGhKYXguXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRBY2Nlc3NpYmxlRWxlbWVudFRleHQoZWxlbWVudCkge1xuICAgIGNvbnN0IHBhcnRzID0gW107XG4gICAgY29uc3QgdmlzaXQgPSAobm9kZSkgPT4ge1xuICAgICAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gTm9kZS5URVhUX05PREUpIHtcbiAgICAgICAgICAgIHBhcnRzLnB1c2gobm9kZS50ZXh0Q29udGVudCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5vZGUubm9kZVR5cGUgIT09IE5vZGUuRUxFTUVOVF9OT0RFKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgbm9kZUVsZW1lbnQgPSBub2RlO1xuICAgICAgICBjb25zdCBzcGVlY2hUZXh0ID0gZ2V0TWF0aEpheFNwZWVjaFRleHQobm9kZUVsZW1lbnQpO1xuICAgICAgICBpZiAoc3BlZWNoVGV4dCkge1xuICAgICAgICAgICAgcGFydHMucHVzaChzcGVlY2hUZXh0KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAobm9kZUVsZW1lbnQubWF0Y2hlcyhcIi5wcm9jZXNzLW1hdGhcIikpIHtcbiAgICAgICAgICAgIGNvbnN0IGRlc2NlbmRhbnRTcGVlY2ggPVxuICAgICAgICAgICAgICAgIGdldE1hdGhKYXhTcGVlY2hEZXNjZW5kYW50VGV4dChub2RlRWxlbWVudCk7XG4gICAgICAgICAgICBpZiAoZGVzY2VuZGFudFNwZWVjaCkge1xuICAgICAgICAgICAgICAgIHBhcnRzLnB1c2goZGVzY2VuZGFudFNwZWVjaCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChub2RlRWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJhcmlhLWhpZGRlblwiKSA9PT0gXCJ0cnVlXCIpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAobm9kZUVsZW1lbnQudGFnTmFtZSA9PT0gXCJJTUdcIikge1xuICAgICAgICAgICAgcGFydHMucHVzaChub2RlRWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJhbHRcIikgfHwgXCJcIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiBub2RlRWxlbWVudC5jaGlsZE5vZGVzKSB7XG4gICAgICAgICAgICB2aXNpdChjaGlsZCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIGlmIChlbGVtZW50KSB7XG4gICAgICAgIHZpc2l0KGVsZW1lbnQpO1xuICAgIH1cbiAgICByZXR1cm4gcGFydHMuam9pbihcIiBcIikucmVwbGFjZSgvXFxzKy9nLCBcIiBcIikudHJpbSgpO1xufVxuXG4vKipcbiAqIFJlbW92ZSByZW5kZXJlZCBNYXRoSmF4IGNvbnRlbnQgZnJvbSB0aGUgdGFiIG9yZGVyIHdpdGhpbiBlYWNoIGNvbnRhaW5lci5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRpc2FibGVNYXRoSmF4VGFiU3RvcHMocm9vdCwgY29udGFpbmVyU2VsZWN0b3JzKSB7XG4gICAgY29uc3QgbWF0aFNlbGVjdG9ycyA9IFtcbiAgICAgICAgXCIuTWF0aEpheFwiLFxuICAgICAgICBcIm1qeC1jb250YWluZXJcIixcbiAgICAgICAgXCIucHJvY2Vzcy1tYXRoXCIsXG4gICAgICAgIFwiLk1hdGhKYXggW3RhYmluZGV4XVwiLFxuICAgICAgICBcIm1qeC1jb250YWluZXIgW3RhYmluZGV4XVwiLFxuICAgICAgICBcIi5wcm9jZXNzLW1hdGggW3RhYmluZGV4XVwiLFxuICAgIF07XG4gICAgY29uc3Qgc2VsZWN0b3IgPSBjb250YWluZXJTZWxlY3RvcnNcbiAgICAgICAgLmZsYXRNYXAoKGNvbnRhaW5lclNlbGVjdG9yKSA9PlxuICAgICAgICAgICAgbWF0aFNlbGVjdG9ycy5tYXAoXG4gICAgICAgICAgICAgICAgKG1hdGhTZWxlY3RvcikgPT4gY29udGFpbmVyU2VsZWN0b3IgKyBcIiBcIiArIG1hdGhTZWxlY3RvcixcbiAgICAgICAgICAgICksXG4gICAgICAgIClcbiAgICAgICAgLmpvaW4oXCIsIFwiKTtcbiAgICBmb3IgKGNvbnN0IG1hdGhFbGVtZW50IG9mIHJvb3QucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikpIHtcbiAgICAgICAgbWF0aEVsZW1lbnQuc2V0QXR0cmlidXRlKFwidGFiaW5kZXhcIiwgXCItMVwiKTtcbiAgICB9XG59XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=