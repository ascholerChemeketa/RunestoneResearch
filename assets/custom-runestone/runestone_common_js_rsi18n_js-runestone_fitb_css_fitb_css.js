"use strict";
(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_common_js_rsi18n_js-runestone_fitb_css_fitb_css"],{

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuZXN0b25lX2NvbW1vbl9qc19yc2kxOG5fanMtcnVuZXN0b25lX2ZpdGJfY3NzX2ZpdGJfY3NzLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjLFVBQVU7QUFDeEIsWUFBWSxNQUFNLHdCQUF3QjtBQUMxQyxrQ0FBa0M7QUFDbEMsa0NBQWtDO0FBQ2xDO0FBQ2E7O0FBRWI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRU87QUFDUDtBQUNBOztBQUVPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsT0FBTyxRQUFRLGVBQWUsYUFBYTtBQUMzQztBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQSx5REFBeUQ7QUFDekQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBLGlFQUFlLEVBQUUsK0JBQStCLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2NvbW1vbi9qcy9yc2kxOG4uanMiXSwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIHJzaTE4bi5qcyDigJQgbGlnaHR3ZWlnaHQsIGRlcGVuZGVuY3ktZnJlZSBpMThuIGZvciBSdW5lc3RvbmUgaW50ZXJhY3RpdmVzLlxuICpcbiAqIFJlcGxhY2VzIHRoZSB2ZW5kb3JlZCBXaWtpbWVkaWEganF1ZXJ5LmkxOG4gcGx1Z2luIGZvciBjb21wb25lbnRzIHRoYXQgaGF2ZVxuICogYmVlbiBtaWdyYXRlZCBvZmYgalF1ZXJ5LiBUaGUgY2F0YWxvZyBmb3JtYXQgaXMgdW5jaGFuZ2VkOiBtZXNzYWdlcyBhcmVcbiAqIGtleWVkIGJ5IG5hbWUgd2l0aGluIGEgbG9jYWxlIG9iamVjdCBhbmQgdXNlIHBvc2l0aW9uYWwgJDEsICQyLCAuLi5cbiAqIHBsYWNlaG9sZGVycywgc28gZXhpc3RpbmcgKi1pMThuLjxsb2NhbGU+LmpzIGNhdGFsb2cgZmlsZXMgb25seSBuZWVkIHRoZWlyXG4gKiBgJC5pMThuKCkubG9hZCguLi4pYCBjYWxsIHN3YXBwZWQgZm9yIGBsb2FkKC4uLilgLlxuICpcbiAqIFVzYWdlOlxuICogICBpbXBvcnQgeyBsb2FkLCB0IH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9qcy9yc2kxOG4uanNcIjtcbiAqICAgbG9hZCh7IGVuOiB7IGdyZWV0aW5nOiBcIkhlbGxvICQxXCIgfSB9KTtcbiAqICAgdChcImdyZWV0aW5nXCIsIFwiV29ybGRcIik7ICAgICAgLy8gLT4gXCJIZWxsbyBXb3JsZFwiXG4gKiAgIHQoXCJ1bmtub3duX2tleVwiKTsgICAgICAgICAgICAvLyAtPiBcInVua25vd25fa2V5XCIgKG1hdGNoZXMganF1ZXJ5LmkxOG4pXG4gKi9cblwidXNlIHN0cmljdFwiO1xuXG5jb25zdCBGQUxMQkFDSyA9IFwiZW5cIjtcbmNvbnN0IGNhdGFsb2dzID0ge307XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZShsb2NhbGUpIHtcbiAgICByZXR1cm4gU3RyaW5nKGxvY2FsZSB8fCBcIlwiKS50b0xvd2VyQ2FzZSgpO1xufVxuXG4vLyBEZWZhdWx0IGxvY2FsZSBmcm9tIHRoZSBkb2N1bWVudCwgZmFsbGluZyBiYWNrIHRvIHRoZSBicm93c2VyLCB0aGVuIEVuZ2xpc2guXG4vLyBqcXVlcnkuaTE4biBkZXJpdmVkIHRoZSBsb2NhbGUgdGhlIHNhbWUgd2F5LCBzbyBiZWhhdmlvciBpcyBwcmVzZXJ2ZWQuXG5sZXQgY3VycmVudExvY2FsZSA9IG5vcm1hbGl6ZShcbiAgICAodHlwZW9mIGRvY3VtZW50ICE9PSBcInVuZGVmaW5lZFwiICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5sYW5nKSB8fFxuICAgICAgICAodHlwZW9mIG5hdmlnYXRvciAhPT0gXCJ1bmRlZmluZWRcIiAmJiBuYXZpZ2F0b3IubGFuZ3VhZ2UpIHx8XG4gICAgICAgIEZBTExCQUNLLFxuKTtcblxuZXhwb3J0IGZ1bmN0aW9uIHNldExvY2FsZShsb2NhbGUpIHtcbiAgICBjdXJyZW50TG9jYWxlID0gbm9ybWFsaXplKGxvY2FsZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRMb2NhbGUoKSB7XG4gICAgcmV0dXJuIGN1cnJlbnRMb2NhbGU7XG59XG5cbi8qKlxuICogUmVnaXN0ZXIgbWVzc2FnZXMuIEFjY2VwdHMgdGhlIHNhbWUgc2hhcGUgYXMgJC5pMThuKCkubG9hZCgpOlxuICogICB7IFwiZW5cIjogeyBrZXk6IFwibXNnICQxXCIgfSwgXCJwdC1iclwiOiB7IGtleTogXCIuLi5cIiB9IH1cbiAqIExvY2FsZSBrZXlzIGFyZSBub3JtYWxpemVkIHRvIGxvd2VyLWNhc2Ugc28gbG9va3VwcyBhcmUgY2FzZS1pbnNlbnNpdGl2ZVxuICogKGUuZy4gYSBcInNyLUN5cmxcIiBjYXRhbG9nIG1hdGNoZXMgYSBkb2N1bWVudCBsYW5nIG9mIFwic3ItY3lybFwiKS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxvYWQobWVzc2FnZXMpIHtcbiAgICBmb3IgKGNvbnN0IFtsb2NhbGUsIG1zZ3NdIG9mIE9iamVjdC5lbnRyaWVzKG1lc3NhZ2VzKSkge1xuICAgICAgICBjb25zdCBrZXkgPSBub3JtYWxpemUobG9jYWxlKTtcbiAgICAgICAgY2F0YWxvZ3Nba2V5XSA9IE9iamVjdC5hc3NpZ24oY2F0YWxvZ3Nba2V5XSB8fCB7fSwgbXNncyk7XG4gICAgfVxufVxuXG4vLyBMb29rdXAgb3JkZXI6IGV4YWN0IGxvY2FsZSwgdGhlbiBpdHMgcHJpbWFyeSBzdWJ0YWcsIHRoZW4gdGhlIGZhbGxiYWNrLlxuLy8gZS5nLiBcInB0LWJyXCIgLT4gXCJwdFwiIC0+IFwiZW5cIi5cbmZ1bmN0aW9uIGxvY2FsZUNoYWluKGxvY2FsZSkge1xuICAgIGNvbnN0IGNoYWluID0gW107XG4gICAgaWYgKGxvY2FsZSkge1xuICAgICAgICBjaGFpbi5wdXNoKGxvY2FsZSk7XG4gICAgICAgIGNvbnN0IHByaW1hcnkgPSBsb2NhbGUuc3BsaXQoXCItXCIpWzBdO1xuICAgICAgICBpZiAocHJpbWFyeSAmJiBwcmltYXJ5ICE9PSBsb2NhbGUpIHtcbiAgICAgICAgICAgIGNoYWluLnB1c2gocHJpbWFyeSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKGNoYWluLmluZGV4T2YoRkFMTEJBQ0spID09PSAtMSkge1xuICAgICAgICBjaGFpbi5wdXNoKEZBTExCQUNLKTtcbiAgICB9XG4gICAgcmV0dXJuIGNoYWluO1xufVxuXG5mdW5jdGlvbiBsb29rdXAoa2V5KSB7XG4gICAgZm9yIChjb25zdCBsb2NhbGUgb2YgbG9jYWxlQ2hhaW4oY3VycmVudExvY2FsZSkpIHtcbiAgICAgICAgY29uc3QgY2F0YWxvZyA9IGNhdGFsb2dzW2xvY2FsZV07XG4gICAgICAgIGlmIChjYXRhbG9nICYmIGNhdGFsb2dba2V5XSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gY2F0YWxvZ1trZXldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogVHJhbnNsYXRlIGEgbWVzc2FnZSBrZXksIHN1YnN0aXR1dGluZyBwb3NpdGlvbmFsICQxLCAkMiwgLi4uIGFyZ3VtZW50cy5cbiAqIFVua25vd24ga2V5cyBhcmUgcmV0dXJuZWQgdmVyYmF0aW0sIG1hdGNoaW5nIGpxdWVyeS5pMThuJ3MgYmVoYXZpb3IuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0KGtleSwgLi4uYXJncykge1xuICAgIGNvbnN0IG1zZyA9IGxvb2t1cChrZXkpO1xuICAgIGlmIChtc2cgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4ga2V5O1xuICAgIH1cbiAgICByZXR1cm4gbXNnLnJlcGxhY2UoL1xcJChcXGQrKS9nLCAobWF0Y2gsIG4pID0+IHtcbiAgICAgICAgY29uc3QgYXJnID0gYXJnc1tOdW1iZXIobikgLSAxXTtcbiAgICAgICAgcmV0dXJuIGFyZyA9PT0gdW5kZWZpbmVkID8gbWF0Y2ggOiBTdHJpbmcoYXJnKTtcbiAgICB9KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgeyBsb2FkLCB0LCBzZXRMb2NhbGUsIGdldExvY2FsZSB9O1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9