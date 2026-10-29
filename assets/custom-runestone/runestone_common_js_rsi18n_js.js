"use strict";
(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_common_js_rsi18n_js"],{

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuZXN0b25lX2NvbW1vbl9qc19yc2kxOG5fanMuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWMsVUFBVTtBQUN4QixZQUFZLE1BQU0sd0JBQXdCO0FBQzFDLGtDQUFrQztBQUNsQyxrQ0FBa0M7QUFDbEM7QUFDYTs7QUFFYjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFTztBQUNQO0FBQ0E7O0FBRU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxPQUFPLFFBQVEsZUFBZSxhQUFhO0FBQzNDO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBLHlEQUF5RDtBQUN6RDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUEsaUVBQWUsRUFBRSwrQkFBK0IsRUFBQyIsInNvdXJjZXMiOlsid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvY29tbW9uL2pzL3JzaTE4bi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogcnNpMThuLmpzIOKAlCBsaWdodHdlaWdodCwgZGVwZW5kZW5jeS1mcmVlIGkxOG4gZm9yIFJ1bmVzdG9uZSBpbnRlcmFjdGl2ZXMuXG4gKlxuICogUmVwbGFjZXMgdGhlIHZlbmRvcmVkIFdpa2ltZWRpYSBqcXVlcnkuaTE4biBwbHVnaW4gZm9yIGNvbXBvbmVudHMgdGhhdCBoYXZlXG4gKiBiZWVuIG1pZ3JhdGVkIG9mZiBqUXVlcnkuIFRoZSBjYXRhbG9nIGZvcm1hdCBpcyB1bmNoYW5nZWQ6IG1lc3NhZ2VzIGFyZVxuICoga2V5ZWQgYnkgbmFtZSB3aXRoaW4gYSBsb2NhbGUgb2JqZWN0IGFuZCB1c2UgcG9zaXRpb25hbCAkMSwgJDIsIC4uLlxuICogcGxhY2Vob2xkZXJzLCBzbyBleGlzdGluZyAqLWkxOG4uPGxvY2FsZT4uanMgY2F0YWxvZyBmaWxlcyBvbmx5IG5lZWQgdGhlaXJcbiAqIGAkLmkxOG4oKS5sb2FkKC4uLilgIGNhbGwgc3dhcHBlZCBmb3IgYGxvYWQoLi4uKWAuXG4gKlxuICogVXNhZ2U6XG4gKiAgIGltcG9ydCB7IGxvYWQsIHQgfSBmcm9tIFwiLi4vLi4vY29tbW9uL2pzL3JzaTE4bi5qc1wiO1xuICogICBsb2FkKHsgZW46IHsgZ3JlZXRpbmc6IFwiSGVsbG8gJDFcIiB9IH0pO1xuICogICB0KFwiZ3JlZXRpbmdcIiwgXCJXb3JsZFwiKTsgICAgICAvLyAtPiBcIkhlbGxvIFdvcmxkXCJcbiAqICAgdChcInVua25vd25fa2V5XCIpOyAgICAgICAgICAgIC8vIC0+IFwidW5rbm93bl9rZXlcIiAobWF0Y2hlcyBqcXVlcnkuaTE4bilcbiAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbmNvbnN0IEZBTExCQUNLID0gXCJlblwiO1xuY29uc3QgY2F0YWxvZ3MgPSB7fTtcblxuZnVuY3Rpb24gbm9ybWFsaXplKGxvY2FsZSkge1xuICAgIHJldHVybiBTdHJpbmcobG9jYWxlIHx8IFwiXCIpLnRvTG93ZXJDYXNlKCk7XG59XG5cbi8vIERlZmF1bHQgbG9jYWxlIGZyb20gdGhlIGRvY3VtZW50LCBmYWxsaW5nIGJhY2sgdG8gdGhlIGJyb3dzZXIsIHRoZW4gRW5nbGlzaC5cbi8vIGpxdWVyeS5pMThuIGRlcml2ZWQgdGhlIGxvY2FsZSB0aGUgc2FtZSB3YXksIHNvIGJlaGF2aW9yIGlzIHByZXNlcnZlZC5cbmxldCBjdXJyZW50TG9jYWxlID0gbm9ybWFsaXplKFxuICAgICh0eXBlb2YgZG9jdW1lbnQgIT09IFwidW5kZWZpbmVkXCIgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmxhbmcpIHx8XG4gICAgICAgICh0eXBlb2YgbmF2aWdhdG9yICE9PSBcInVuZGVmaW5lZFwiICYmIG5hdmlnYXRvci5sYW5ndWFnZSkgfHxcbiAgICAgICAgRkFMTEJBQ0ssXG4pO1xuXG5leHBvcnQgZnVuY3Rpb24gc2V0TG9jYWxlKGxvY2FsZSkge1xuICAgIGN1cnJlbnRMb2NhbGUgPSBub3JtYWxpemUobG9jYWxlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldExvY2FsZSgpIHtcbiAgICByZXR1cm4gY3VycmVudExvY2FsZTtcbn1cblxuLyoqXG4gKiBSZWdpc3RlciBtZXNzYWdlcy4gQWNjZXB0cyB0aGUgc2FtZSBzaGFwZSBhcyAkLmkxOG4oKS5sb2FkKCk6XG4gKiAgIHsgXCJlblwiOiB7IGtleTogXCJtc2cgJDFcIiB9LCBcInB0LWJyXCI6IHsga2V5OiBcIi4uLlwiIH0gfVxuICogTG9jYWxlIGtleXMgYXJlIG5vcm1hbGl6ZWQgdG8gbG93ZXItY2FzZSBzbyBsb29rdXBzIGFyZSBjYXNlLWluc2Vuc2l0aXZlXG4gKiAoZS5nLiBhIFwic3ItQ3lybFwiIGNhdGFsb2cgbWF0Y2hlcyBhIGRvY3VtZW50IGxhbmcgb2YgXCJzci1jeXJsXCIpLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbG9hZChtZXNzYWdlcykge1xuICAgIGZvciAoY29uc3QgW2xvY2FsZSwgbXNnc10gb2YgT2JqZWN0LmVudHJpZXMobWVzc2FnZXMpKSB7XG4gICAgICAgIGNvbnN0IGtleSA9IG5vcm1hbGl6ZShsb2NhbGUpO1xuICAgICAgICBjYXRhbG9nc1trZXldID0gT2JqZWN0LmFzc2lnbihjYXRhbG9nc1trZXldIHx8IHt9LCBtc2dzKTtcbiAgICB9XG59XG5cbi8vIExvb2t1cCBvcmRlcjogZXhhY3QgbG9jYWxlLCB0aGVuIGl0cyBwcmltYXJ5IHN1YnRhZywgdGhlbiB0aGUgZmFsbGJhY2suXG4vLyBlLmcuIFwicHQtYnJcIiAtPiBcInB0XCIgLT4gXCJlblwiLlxuZnVuY3Rpb24gbG9jYWxlQ2hhaW4obG9jYWxlKSB7XG4gICAgY29uc3QgY2hhaW4gPSBbXTtcbiAgICBpZiAobG9jYWxlKSB7XG4gICAgICAgIGNoYWluLnB1c2gobG9jYWxlKTtcbiAgICAgICAgY29uc3QgcHJpbWFyeSA9IGxvY2FsZS5zcGxpdChcIi1cIilbMF07XG4gICAgICAgIGlmIChwcmltYXJ5ICYmIHByaW1hcnkgIT09IGxvY2FsZSkge1xuICAgICAgICAgICAgY2hhaW4ucHVzaChwcmltYXJ5KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoY2hhaW4uaW5kZXhPZihGQUxMQkFDSykgPT09IC0xKSB7XG4gICAgICAgIGNoYWluLnB1c2goRkFMTEJBQ0spO1xuICAgIH1cbiAgICByZXR1cm4gY2hhaW47XG59XG5cbmZ1bmN0aW9uIGxvb2t1cChrZXkpIHtcbiAgICBmb3IgKGNvbnN0IGxvY2FsZSBvZiBsb2NhbGVDaGFpbihjdXJyZW50TG9jYWxlKSkge1xuICAgICAgICBjb25zdCBjYXRhbG9nID0gY2F0YWxvZ3NbbG9jYWxlXTtcbiAgICAgICAgaWYgKGNhdGFsb2cgJiYgY2F0YWxvZ1trZXldICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBjYXRhbG9nW2tleV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBUcmFuc2xhdGUgYSBtZXNzYWdlIGtleSwgc3Vic3RpdHV0aW5nIHBvc2l0aW9uYWwgJDEsICQyLCAuLi4gYXJndW1lbnRzLlxuICogVW5rbm93biBrZXlzIGFyZSByZXR1cm5lZCB2ZXJiYXRpbSwgbWF0Y2hpbmcganF1ZXJ5LmkxOG4ncyBiZWhhdmlvci5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHQoa2V5LCAuLi5hcmdzKSB7XG4gICAgY29uc3QgbXNnID0gbG9va3VwKGtleSk7XG4gICAgaWYgKG1zZyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBrZXk7XG4gICAgfVxuICAgIHJldHVybiBtc2cucmVwbGFjZSgvXFwkKFxcZCspL2csIChtYXRjaCwgbikgPT4ge1xuICAgICAgICBjb25zdCBhcmcgPSBhcmdzW051bWJlcihuKSAtIDFdO1xuICAgICAgICByZXR1cm4gYXJnID09PSB1bmRlZmluZWQgPyBtYXRjaCA6IFN0cmluZyhhcmcpO1xuICAgIH0pO1xufVxuXG5leHBvcnQgZGVmYXVsdCB7IGxvYWQsIHQsIHNldExvY2FsZSwgZ2V0TG9jYWxlIH07XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=