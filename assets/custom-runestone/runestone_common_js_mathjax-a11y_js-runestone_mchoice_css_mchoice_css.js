"use strict";
(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_common_js_mathjax-a11y_js-runestone_mchoice_css_mchoice_css"],{

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuZXN0b25lX2NvbW1vbl9qc19tYXRoamF4LWExMXlfanMtcnVuZXN0b25lX21jaG9pY2VfY3NzX21jaG9pY2VfY3NzLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2NvbW1vbi9qcy9tYXRoamF4LWExMXkuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIHxkb2NuYW1lfCAtIE1hdGhKYXggYWNjZXNzaWJpbGl0eSBoZWxwZXJzXG4gKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogVXRpbGl0aWVzIGZvciBpbnRlcmFjdGl2ZSBlbGVtZW50cyB0aGF0IGNvbnRhaW4gTWF0aEpheC1yZW5kZXJlZCBjb250ZW50LlxuICovXG5cbmNvbnN0IG1hdGhTcGVlY2hTZWxlY3RvciA9XG4gICAgXCJtangtY29udGFpbmVyLCAuTWF0aEpheCwgW2RhdGEtc2VtYW50aWMtc3BlZWNoLW5vbmVdXCI7XG5jb25zdCBtYXRoU3BlZWNoRGVzY2VuZGFudFNlbGVjdG9yID1cbiAgICBcIm1qeC1jb250YWluZXJbYXJpYS1sYWJlbF0sIC5NYXRoSmF4W2FyaWEtbGFiZWxdLCBbZGF0YS1zZW1hbnRpYy1zcGVlY2gtbm9uZV1cIjtcblxuLyoqXG4gKiBSZXR1cm4gTWF0aEpheCdzIHNwZWVjaCB0ZXh0IGZvciBhIHJlbmRlcmVkIG1hdGggZWxlbWVudC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE1hdGhKYXhTcGVlY2hUZXh0KGVsZW1lbnQpIHtcbiAgICBpZiAoIWVsZW1lbnQgfHwgZWxlbWVudC5ub2RlVHlwZSAhPT0gTm9kZS5FTEVNRU5UX05PREUpIHtcbiAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfVxuICAgIGlmICghZWxlbWVudC5tYXRjaGVzKG1hdGhTcGVlY2hTZWxlY3RvcikpIHtcbiAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfVxuICAgIHJldHVybiAoXG4gICAgICAgIGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiZGF0YS1zZW1hbnRpYy1zcGVlY2gtbm9uZVwiKSB8fFxuICAgICAgICBlbGVtZW50LmdldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIikgfHxcbiAgICAgICAgXCJcIlxuICAgIClcbiAgICAgICAgLnJlcGxhY2UoL1xccysvZywgXCIgXCIpXG4gICAgICAgIC50cmltKCk7XG59XG5cbi8qKlxuICogUmV0dXJuIHRoZSBzcGVlY2ggdGV4dCBmcm9tIHRoZSBmaXJzdCBNYXRoSmF4IGRlc2NlbmRhbnQgb2YgYW4gZWxlbWVudC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE1hdGhKYXhTcGVlY2hEZXNjZW5kYW50VGV4dChlbGVtZW50KSB7XG4gICAgcmV0dXJuIGdldE1hdGhKYXhTcGVlY2hUZXh0KFxuICAgICAgICBlbGVtZW50Py5xdWVyeVNlbGVjdG9yPy4obWF0aFNwZWVjaERlc2NlbmRhbnRTZWxlY3RvciksXG4gICAgKTtcbn1cblxuLyoqXG4gKiBSZXR1cm4gYW4gYWNjZXNzaWJsZSB0ZXh0IGVxdWl2YWxlbnQgZm9yIGNvbnRlbnQgdGhhdCBjYW4gaW5jbHVkZSBNYXRoSmF4LlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0QWNjZXNzaWJsZUVsZW1lbnRUZXh0KGVsZW1lbnQpIHtcbiAgICBjb25zdCBwYXJ0cyA9IFtdO1xuICAgIGNvbnN0IHZpc2l0ID0gKG5vZGUpID0+IHtcbiAgICAgICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFKSB7XG4gICAgICAgICAgICBwYXJ0cy5wdXNoKG5vZGUudGV4dENvbnRlbnQpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChub2RlLm5vZGVUeXBlICE9PSBOb2RlLkVMRU1FTlRfTk9ERSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG5vZGVFbGVtZW50ID0gbm9kZTtcbiAgICAgICAgY29uc3Qgc3BlZWNoVGV4dCA9IGdldE1hdGhKYXhTcGVlY2hUZXh0KG5vZGVFbGVtZW50KTtcbiAgICAgICAgaWYgKHNwZWVjaFRleHQpIHtcbiAgICAgICAgICAgIHBhcnRzLnB1c2goc3BlZWNoVGV4dCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5vZGVFbGVtZW50Lm1hdGNoZXMoXCIucHJvY2Vzcy1tYXRoXCIpKSB7XG4gICAgICAgICAgICBjb25zdCBkZXNjZW5kYW50U3BlZWNoID1cbiAgICAgICAgICAgICAgICBnZXRNYXRoSmF4U3BlZWNoRGVzY2VuZGFudFRleHQobm9kZUVsZW1lbnQpO1xuICAgICAgICAgICAgaWYgKGRlc2NlbmRhbnRTcGVlY2gpIHtcbiAgICAgICAgICAgICAgICBwYXJ0cy5wdXNoKGRlc2NlbmRhbnRTcGVlY2gpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobm9kZUVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIikgPT09IFwidHJ1ZVwiKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5vZGVFbGVtZW50LnRhZ05hbWUgPT09IFwiSU1HXCIpIHtcbiAgICAgICAgICAgIHBhcnRzLnB1c2gobm9kZUVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiYWx0XCIpIHx8IFwiXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2Ygbm9kZUVsZW1lbnQuY2hpbGROb2Rlcykge1xuICAgICAgICAgICAgdmlzaXQoY2hpbGQpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBpZiAoZWxlbWVudCkge1xuICAgICAgICB2aXNpdChlbGVtZW50KTtcbiAgICB9XG4gICAgcmV0dXJuIHBhcnRzLmpvaW4oXCIgXCIpLnJlcGxhY2UoL1xccysvZywgXCIgXCIpLnRyaW0oKTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgcmVuZGVyZWQgTWF0aEpheCBjb250ZW50IGZyb20gdGhlIHRhYiBvcmRlciB3aXRoaW4gZWFjaCBjb250YWluZXIuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkaXNhYmxlTWF0aEpheFRhYlN0b3BzKHJvb3QsIGNvbnRhaW5lclNlbGVjdG9ycykge1xuICAgIGNvbnN0IG1hdGhTZWxlY3RvcnMgPSBbXG4gICAgICAgIFwiLk1hdGhKYXhcIixcbiAgICAgICAgXCJtangtY29udGFpbmVyXCIsXG4gICAgICAgIFwiLnByb2Nlc3MtbWF0aFwiLFxuICAgICAgICBcIi5NYXRoSmF4IFt0YWJpbmRleF1cIixcbiAgICAgICAgXCJtangtY29udGFpbmVyIFt0YWJpbmRleF1cIixcbiAgICAgICAgXCIucHJvY2Vzcy1tYXRoIFt0YWJpbmRleF1cIixcbiAgICBdO1xuICAgIGNvbnN0IHNlbGVjdG9yID0gY29udGFpbmVyU2VsZWN0b3JzXG4gICAgICAgIC5mbGF0TWFwKChjb250YWluZXJTZWxlY3RvcikgPT5cbiAgICAgICAgICAgIG1hdGhTZWxlY3RvcnMubWFwKFxuICAgICAgICAgICAgICAgIChtYXRoU2VsZWN0b3IpID0+IGNvbnRhaW5lclNlbGVjdG9yICsgXCIgXCIgKyBtYXRoU2VsZWN0b3IsXG4gICAgICAgICAgICApLFxuICAgICAgICApXG4gICAgICAgIC5qb2luKFwiLCBcIik7XG4gICAgZm9yIChjb25zdCBtYXRoRWxlbWVudCBvZiByb290LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpKSB7XG4gICAgICAgIG1hdGhFbGVtZW50LnNldEF0dHJpYnV0ZShcInRhYmluZGV4XCIsIFwiLTFcIik7XG4gICAgfVxufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9