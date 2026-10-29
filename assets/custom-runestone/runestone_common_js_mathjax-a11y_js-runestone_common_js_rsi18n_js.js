"use strict";
(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_common_js_mathjax-a11y_js-runestone_common_js_rsi18n_js"],{

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


/***/ }),

/***/ 54250:
/*!***************************************!*\
  !*** ./runestone/common/js/rsi18n.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   getLocale: () => (/* binding */ getLocale),
/* harmony export */   load: () => (/* binding */ load),
/* harmony export */   setLocale: () => (/* binding */ setLocale),
/* harmony export */   t: () => (/* binding */ t)
/* harmony export */ });
/*
 * rsi18n.js — lightweight, dependency-free i18n for Runestone interactives.
 *
 * Replaces the vendored Wikimedia jquery.i18n plugin for components that have
 * been migrated off jQuery. The catalog format is unchanged: messages are
 * keyed by name within a locale object and use positional $1, $2, ...
 * placeholders, so existing *-i18n.<locale>.js catalog files only need their
 * `$.i18n().load(...)` call swapped for `load(...)`.
 *
 * Usage:
 *   import { load, t } from "../../common/js/rsi18n.js";
 *   load({ en: { greeting: "Hello $1" } });
 *   t("greeting", "World");      // -> "Hello World"
 *   t("unknown_key");            // -> "unknown_key" (matches jquery.i18n)
 */


const FALLBACK = "en";
const catalogs = {};

function normalize(locale) {
    return String(locale || "").toLowerCase();
}

// Default locale from the document, falling back to the browser, then English.
// jquery.i18n derived the locale the same way, so behavior is preserved.
let currentLocale = normalize(
    (typeof document !== "undefined" && document.documentElement.lang) ||
        (typeof navigator !== "undefined" && navigator.language) ||
        FALLBACK,
);

function setLocale(locale) {
    currentLocale = normalize(locale);
}

function getLocale() {
    return currentLocale;
}

/**
 * Register messages. Accepts the same shape as $.i18n().load():
 *   { "en": { key: "msg $1" }, "pt-br": { key: "..." } }
 * Locale keys are normalized to lower-case so lookups are case-insensitive
 * (e.g. a "sr-Cyrl" catalog matches a document lang of "sr-cyrl").
 */
function load(messages) {
    for (const [locale, msgs] of Object.entries(messages)) {
        const key = normalize(locale);
        catalogs[key] = Object.assign(catalogs[key] || {}, msgs);
    }
}

// Lookup order: exact locale, then its primary subtag, then the fallback.
// e.g. "pt-br" -> "pt" -> "en".
function localeChain(locale) {
    const chain = [];
    if (locale) {
        chain.push(locale);
        const primary = locale.split("-")[0];
        if (primary && primary !== locale) {
            chain.push(primary);
        }
    }
    if (chain.indexOf(FALLBACK) === -1) {
        chain.push(FALLBACK);
    }
    return chain;
}

function lookup(key) {
    for (const locale of localeChain(currentLocale)) {
        const catalog = catalogs[locale];
        if (catalog && catalog[key] !== undefined) {
            return catalog[key];
        }
    }
    return undefined;
}

/**
 * Translate a message key, substituting positional $1, $2, ... arguments.
 * Unknown keys are returned verbatim, matching jquery.i18n's behavior.
 */
function t(key, ...args) {
    const msg = lookup(key);
    if (msg === undefined) {
        return key;
    }
    return msg.replace(/\$(\d+)/g, (match, n) => {
        const arg = args[Number(n) - 1];
        return arg === undefined ? match : String(arg);
    });
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ load, t, setLocale, getLocale });


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuZXN0b25lX2NvbW1vbl9qc19tYXRoamF4LWExMXlfanMtcnVuZXN0b25lX2NvbW1vbl9qc19yc2kxOG5fanMuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWMsVUFBVTtBQUN4QixZQUFZLE1BQU0sd0JBQXdCO0FBQzFDLGtDQUFrQztBQUNsQyxrQ0FBa0M7QUFDbEM7QUFDYTs7QUFFYjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFTztBQUNQO0FBQ0E7O0FBRU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxPQUFPLFFBQVEsZUFBZSxhQUFhO0FBQzNDO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBLHlEQUF5RDtBQUN6RDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUEsaUVBQWUsRUFBRSwrQkFBK0IsRUFBQyIsInNvdXJjZXMiOlsid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvY29tbW9uL2pzL21hdGhqYXgtYTExeS5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2NvbW1vbi9qcy9yc2kxOG4uanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIHxkb2NuYW1lfCAtIE1hdGhKYXggYWNjZXNzaWJpbGl0eSBoZWxwZXJzXG4gKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogVXRpbGl0aWVzIGZvciBpbnRlcmFjdGl2ZSBlbGVtZW50cyB0aGF0IGNvbnRhaW4gTWF0aEpheC1yZW5kZXJlZCBjb250ZW50LlxuICovXG5cbmNvbnN0IG1hdGhTcGVlY2hTZWxlY3RvciA9XG4gICAgXCJtangtY29udGFpbmVyLCAuTWF0aEpheCwgW2RhdGEtc2VtYW50aWMtc3BlZWNoLW5vbmVdXCI7XG5jb25zdCBtYXRoU3BlZWNoRGVzY2VuZGFudFNlbGVjdG9yID1cbiAgICBcIm1qeC1jb250YWluZXJbYXJpYS1sYWJlbF0sIC5NYXRoSmF4W2FyaWEtbGFiZWxdLCBbZGF0YS1zZW1hbnRpYy1zcGVlY2gtbm9uZV1cIjtcblxuLyoqXG4gKiBSZXR1cm4gTWF0aEpheCdzIHNwZWVjaCB0ZXh0IGZvciBhIHJlbmRlcmVkIG1hdGggZWxlbWVudC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE1hdGhKYXhTcGVlY2hUZXh0KGVsZW1lbnQpIHtcbiAgICBpZiAoIWVsZW1lbnQgfHwgZWxlbWVudC5ub2RlVHlwZSAhPT0gTm9kZS5FTEVNRU5UX05PREUpIHtcbiAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfVxuICAgIGlmICghZWxlbWVudC5tYXRjaGVzKG1hdGhTcGVlY2hTZWxlY3RvcikpIHtcbiAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfVxuICAgIHJldHVybiAoXG4gICAgICAgIGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiZGF0YS1zZW1hbnRpYy1zcGVlY2gtbm9uZVwiKSB8fFxuICAgICAgICBlbGVtZW50LmdldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIikgfHxcbiAgICAgICAgXCJcIlxuICAgIClcbiAgICAgICAgLnJlcGxhY2UoL1xccysvZywgXCIgXCIpXG4gICAgICAgIC50cmltKCk7XG59XG5cbi8qKlxuICogUmV0dXJuIHRoZSBzcGVlY2ggdGV4dCBmcm9tIHRoZSBmaXJzdCBNYXRoSmF4IGRlc2NlbmRhbnQgb2YgYW4gZWxlbWVudC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE1hdGhKYXhTcGVlY2hEZXNjZW5kYW50VGV4dChlbGVtZW50KSB7XG4gICAgcmV0dXJuIGdldE1hdGhKYXhTcGVlY2hUZXh0KFxuICAgICAgICBlbGVtZW50Py5xdWVyeVNlbGVjdG9yPy4obWF0aFNwZWVjaERlc2NlbmRhbnRTZWxlY3RvciksXG4gICAgKTtcbn1cblxuLyoqXG4gKiBSZXR1cm4gYW4gYWNjZXNzaWJsZSB0ZXh0IGVxdWl2YWxlbnQgZm9yIGNvbnRlbnQgdGhhdCBjYW4gaW5jbHVkZSBNYXRoSmF4LlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0QWNjZXNzaWJsZUVsZW1lbnRUZXh0KGVsZW1lbnQpIHtcbiAgICBjb25zdCBwYXJ0cyA9IFtdO1xuICAgIGNvbnN0IHZpc2l0ID0gKG5vZGUpID0+IHtcbiAgICAgICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFKSB7XG4gICAgICAgICAgICBwYXJ0cy5wdXNoKG5vZGUudGV4dENvbnRlbnQpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChub2RlLm5vZGVUeXBlICE9PSBOb2RlLkVMRU1FTlRfTk9ERSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG5vZGVFbGVtZW50ID0gbm9kZTtcbiAgICAgICAgY29uc3Qgc3BlZWNoVGV4dCA9IGdldE1hdGhKYXhTcGVlY2hUZXh0KG5vZGVFbGVtZW50KTtcbiAgICAgICAgaWYgKHNwZWVjaFRleHQpIHtcbiAgICAgICAgICAgIHBhcnRzLnB1c2goc3BlZWNoVGV4dCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5vZGVFbGVtZW50Lm1hdGNoZXMoXCIucHJvY2Vzcy1tYXRoXCIpKSB7XG4gICAgICAgICAgICBjb25zdCBkZXNjZW5kYW50U3BlZWNoID1cbiAgICAgICAgICAgICAgICBnZXRNYXRoSmF4U3BlZWNoRGVzY2VuZGFudFRleHQobm9kZUVsZW1lbnQpO1xuICAgICAgICAgICAgaWYgKGRlc2NlbmRhbnRTcGVlY2gpIHtcbiAgICAgICAgICAgICAgICBwYXJ0cy5wdXNoKGRlc2NlbmRhbnRTcGVlY2gpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobm9kZUVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIikgPT09IFwidHJ1ZVwiKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5vZGVFbGVtZW50LnRhZ05hbWUgPT09IFwiSU1HXCIpIHtcbiAgICAgICAgICAgIHBhcnRzLnB1c2gobm9kZUVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiYWx0XCIpIHx8IFwiXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2Ygbm9kZUVsZW1lbnQuY2hpbGROb2Rlcykge1xuICAgICAgICAgICAgdmlzaXQoY2hpbGQpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBpZiAoZWxlbWVudCkge1xuICAgICAgICB2aXNpdChlbGVtZW50KTtcbiAgICB9XG4gICAgcmV0dXJuIHBhcnRzLmpvaW4oXCIgXCIpLnJlcGxhY2UoL1xccysvZywgXCIgXCIpLnRyaW0oKTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgcmVuZGVyZWQgTWF0aEpheCBjb250ZW50IGZyb20gdGhlIHRhYiBvcmRlciB3aXRoaW4gZWFjaCBjb250YWluZXIuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkaXNhYmxlTWF0aEpheFRhYlN0b3BzKHJvb3QsIGNvbnRhaW5lclNlbGVjdG9ycykge1xuICAgIGNvbnN0IG1hdGhTZWxlY3RvcnMgPSBbXG4gICAgICAgIFwiLk1hdGhKYXhcIixcbiAgICAgICAgXCJtangtY29udGFpbmVyXCIsXG4gICAgICAgIFwiLnByb2Nlc3MtbWF0aFwiLFxuICAgICAgICBcIi5NYXRoSmF4IFt0YWJpbmRleF1cIixcbiAgICAgICAgXCJtangtY29udGFpbmVyIFt0YWJpbmRleF1cIixcbiAgICAgICAgXCIucHJvY2Vzcy1tYXRoIFt0YWJpbmRleF1cIixcbiAgICBdO1xuICAgIGNvbnN0IHNlbGVjdG9yID0gY29udGFpbmVyU2VsZWN0b3JzXG4gICAgICAgIC5mbGF0TWFwKChjb250YWluZXJTZWxlY3RvcikgPT5cbiAgICAgICAgICAgIG1hdGhTZWxlY3RvcnMubWFwKFxuICAgICAgICAgICAgICAgIChtYXRoU2VsZWN0b3IpID0+IGNvbnRhaW5lclNlbGVjdG9yICsgXCIgXCIgKyBtYXRoU2VsZWN0b3IsXG4gICAgICAgICAgICApLFxuICAgICAgICApXG4gICAgICAgIC5qb2luKFwiLCBcIik7XG4gICAgZm9yIChjb25zdCBtYXRoRWxlbWVudCBvZiByb290LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpKSB7XG4gICAgICAgIG1hdGhFbGVtZW50LnNldEF0dHJpYnV0ZShcInRhYmluZGV4XCIsIFwiLTFcIik7XG4gICAgfVxufVxuIiwiLypcbiAqIHJzaTE4bi5qcyDigJQgbGlnaHR3ZWlnaHQsIGRlcGVuZGVuY3ktZnJlZSBpMThuIGZvciBSdW5lc3RvbmUgaW50ZXJhY3RpdmVzLlxuICpcbiAqIFJlcGxhY2VzIHRoZSB2ZW5kb3JlZCBXaWtpbWVkaWEganF1ZXJ5LmkxOG4gcGx1Z2luIGZvciBjb21wb25lbnRzIHRoYXQgaGF2ZVxuICogYmVlbiBtaWdyYXRlZCBvZmYgalF1ZXJ5LiBUaGUgY2F0YWxvZyBmb3JtYXQgaXMgdW5jaGFuZ2VkOiBtZXNzYWdlcyBhcmVcbiAqIGtleWVkIGJ5IG5hbWUgd2l0aGluIGEgbG9jYWxlIG9iamVjdCBhbmQgdXNlIHBvc2l0aW9uYWwgJDEsICQyLCAuLi5cbiAqIHBsYWNlaG9sZGVycywgc28gZXhpc3RpbmcgKi1pMThuLjxsb2NhbGU+LmpzIGNhdGFsb2cgZmlsZXMgb25seSBuZWVkIHRoZWlyXG4gKiBgJC5pMThuKCkubG9hZCguLi4pYCBjYWxsIHN3YXBwZWQgZm9yIGBsb2FkKC4uLilgLlxuICpcbiAqIFVzYWdlOlxuICogICBpbXBvcnQgeyBsb2FkLCB0IH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9qcy9yc2kxOG4uanNcIjtcbiAqICAgbG9hZCh7IGVuOiB7IGdyZWV0aW5nOiBcIkhlbGxvICQxXCIgfSB9KTtcbiAqICAgdChcImdyZWV0aW5nXCIsIFwiV29ybGRcIik7ICAgICAgLy8gLT4gXCJIZWxsbyBXb3JsZFwiXG4gKiAgIHQoXCJ1bmtub3duX2tleVwiKTsgICAgICAgICAgICAvLyAtPiBcInVua25vd25fa2V5XCIgKG1hdGNoZXMganF1ZXJ5LmkxOG4pXG4gKi9cblwidXNlIHN0cmljdFwiO1xuXG5jb25zdCBGQUxMQkFDSyA9IFwiZW5cIjtcbmNvbnN0IGNhdGFsb2dzID0ge307XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZShsb2NhbGUpIHtcbiAgICByZXR1cm4gU3RyaW5nKGxvY2FsZSB8fCBcIlwiKS50b0xvd2VyQ2FzZSgpO1xufVxuXG4vLyBEZWZhdWx0IGxvY2FsZSBmcm9tIHRoZSBkb2N1bWVudCwgZmFsbGluZyBiYWNrIHRvIHRoZSBicm93c2VyLCB0aGVuIEVuZ2xpc2guXG4vLyBqcXVlcnkuaTE4biBkZXJpdmVkIHRoZSBsb2NhbGUgdGhlIHNhbWUgd2F5LCBzbyBiZWhhdmlvciBpcyBwcmVzZXJ2ZWQuXG5sZXQgY3VycmVudExvY2FsZSA9IG5vcm1hbGl6ZShcbiAgICAodHlwZW9mIGRvY3VtZW50ICE9PSBcInVuZGVmaW5lZFwiICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5sYW5nKSB8fFxuICAgICAgICAodHlwZW9mIG5hdmlnYXRvciAhPT0gXCJ1bmRlZmluZWRcIiAmJiBuYXZpZ2F0b3IubGFuZ3VhZ2UpIHx8XG4gICAgICAgIEZBTExCQUNLLFxuKTtcblxuZXhwb3J0IGZ1bmN0aW9uIHNldExvY2FsZShsb2NhbGUpIHtcbiAgICBjdXJyZW50TG9jYWxlID0gbm9ybWFsaXplKGxvY2FsZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRMb2NhbGUoKSB7XG4gICAgcmV0dXJuIGN1cnJlbnRMb2NhbGU7XG59XG5cbi8qKlxuICogUmVnaXN0ZXIgbWVzc2FnZXMuIEFjY2VwdHMgdGhlIHNhbWUgc2hhcGUgYXMgJC5pMThuKCkubG9hZCgpOlxuICogICB7IFwiZW5cIjogeyBrZXk6IFwibXNnICQxXCIgfSwgXCJwdC1iclwiOiB7IGtleTogXCIuLi5cIiB9IH1cbiAqIExvY2FsZSBrZXlzIGFyZSBub3JtYWxpemVkIHRvIGxvd2VyLWNhc2Ugc28gbG9va3VwcyBhcmUgY2FzZS1pbnNlbnNpdGl2ZVxuICogKGUuZy4gYSBcInNyLUN5cmxcIiBjYXRhbG9nIG1hdGNoZXMgYSBkb2N1bWVudCBsYW5nIG9mIFwic3ItY3lybFwiKS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxvYWQobWVzc2FnZXMpIHtcbiAgICBmb3IgKGNvbnN0IFtsb2NhbGUsIG1zZ3NdIG9mIE9iamVjdC5lbnRyaWVzKG1lc3NhZ2VzKSkge1xuICAgICAgICBjb25zdCBrZXkgPSBub3JtYWxpemUobG9jYWxlKTtcbiAgICAgICAgY2F0YWxvZ3Nba2V5XSA9IE9iamVjdC5hc3NpZ24oY2F0YWxvZ3Nba2V5XSB8fCB7fSwgbXNncyk7XG4gICAgfVxufVxuXG4vLyBMb29rdXAgb3JkZXI6IGV4YWN0IGxvY2FsZSwgdGhlbiBpdHMgcHJpbWFyeSBzdWJ0YWcsIHRoZW4gdGhlIGZhbGxiYWNrLlxuLy8gZS5nLiBcInB0LWJyXCIgLT4gXCJwdFwiIC0+IFwiZW5cIi5cbmZ1bmN0aW9uIGxvY2FsZUNoYWluKGxvY2FsZSkge1xuICAgIGNvbnN0IGNoYWluID0gW107XG4gICAgaWYgKGxvY2FsZSkge1xuICAgICAgICBjaGFpbi5wdXNoKGxvY2FsZSk7XG4gICAgICAgIGNvbnN0IHByaW1hcnkgPSBsb2NhbGUuc3BsaXQoXCItXCIpWzBdO1xuICAgICAgICBpZiAocHJpbWFyeSAmJiBwcmltYXJ5ICE9PSBsb2NhbGUpIHtcbiAgICAgICAgICAgIGNoYWluLnB1c2gocHJpbWFyeSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKGNoYWluLmluZGV4T2YoRkFMTEJBQ0spID09PSAtMSkge1xuICAgICAgICBjaGFpbi5wdXNoKEZBTExCQUNLKTtcbiAgICB9XG4gICAgcmV0dXJuIGNoYWluO1xufVxuXG5mdW5jdGlvbiBsb29rdXAoa2V5KSB7XG4gICAgZm9yIChjb25zdCBsb2NhbGUgb2YgbG9jYWxlQ2hhaW4oY3VycmVudExvY2FsZSkpIHtcbiAgICAgICAgY29uc3QgY2F0YWxvZyA9IGNhdGFsb2dzW2xvY2FsZV07XG4gICAgICAgIGlmIChjYXRhbG9nICYmIGNhdGFsb2dba2V5XSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gY2F0YWxvZ1trZXldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogVHJhbnNsYXRlIGEgbWVzc2FnZSBrZXksIHN1YnN0aXR1dGluZyBwb3NpdGlvbmFsICQxLCAkMiwgLi4uIGFyZ3VtZW50cy5cbiAqIFVua25vd24ga2V5cyBhcmUgcmV0dXJuZWQgdmVyYmF0aW0sIG1hdGNoaW5nIGpxdWVyeS5pMThuJ3MgYmVoYXZpb3IuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0KGtleSwgLi4uYXJncykge1xuICAgIGNvbnN0IG1zZyA9IGxvb2t1cChrZXkpO1xuICAgIGlmIChtc2cgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4ga2V5O1xuICAgIH1cbiAgICByZXR1cm4gbXNnLnJlcGxhY2UoL1xcJChcXGQrKS9nLCAobWF0Y2gsIG4pID0+IHtcbiAgICAgICAgY29uc3QgYXJnID0gYXJnc1tOdW1iZXIobikgLSAxXTtcbiAgICAgICAgcmV0dXJuIGFyZyA9PT0gdW5kZWZpbmVkID8gbWF0Y2ggOiBTdHJpbmcoYXJnKTtcbiAgICB9KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgeyBsb2FkLCB0LCBzZXRMb2NhbGUsIGdldExvY2FsZSB9O1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9