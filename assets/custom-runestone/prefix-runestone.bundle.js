(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone"],{

/***/ 19359:
/*!****************************************!*\
  !*** ./runestone/common/js/pretext.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _runestonebase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./runestonebase.js */ 78673);
/*
    Support functions for PreTeXt books running on Runestone

*/



function setupPTXEvents() {
    let rb = new _runestonebase_js__WEBPACK_IMPORTED_MODULE_0__["default"]();
    // log an event when a knowl is opened.
    document.querySelectorAll("[data-knowl]").forEach((el) => {
        el.addEventListener("click", function () {
            let div_id = el.getAttribute("data-knowl");
            rb.logBookEvent({ event: "knowl", act: "click", div_id: div_id });
        });
    });
    let born_hidden = document.querySelectorAll("details.born-hidden-knowl");
    born_hidden.forEach((el) => {
        // log an event when a knowl is opened that was born hidden
        el.addEventListener("toggle", function () {
            if (el.open) {
                let div_id = el.id;
                rb.logBookEvent({
                    event: "knowl",
                    act: "open",
                    div_id: div_id,
                });
            }
        });
    });
    // log an event when a sage cell is evaluated
    document.querySelectorAll(".sagecell_evalButton").forEach((btn) => {
        btn.addEventListener("click", function () {
            let container = btn.closest(".ptx-sagecell");
            let codeInput = container
                ? container.querySelector(".sagecell_input")
                : null;
            let code = codeInput ? codeInput.textContent : "";
            let div_id = container ? container.id : null;
            if (!div_id) {
                console.warn(
                    "Could not find container or div_id for sagecell button",
                );
                return;
            }

            rb.logBookEvent({ event: "sage", act: "run", div_id: div_id });
        });
    });
    if (typeof eBookConfig !== "undefined" && !eBookConfig.isInstructor) {
        document.querySelectorAll(".commentary").forEach((el) => {
            el.style.display = "none";
        });
    }
}

window.addEventListener("load", function () {
    console.log("setting up pretext");
    setupPTXEvents();
    let wrap = document.getElementById("primary-navbar-sticky-wrapper");
    if (wrap) {
        wrap.style.overflow = "visible";
    }
});


/***/ }),

/***/ 19695:
/*!***********************************************!*\
  !*** ./runestone/common/js/presenter_mode.js ***!
  \***********************************************/
/***/ (() => {

// Instructor-only "Code Presenter" view for Sphinx book pages: hides the
// prose and steps through the interactive exercises one at a time.

var codeExercises = []; // Array of top-level .runestone exercise divs
var presentModeInitialized = false;

// Elements a presenter wants to keep on screen.
const KEEP_VISIBLE =
    "h1, .presentation-title, .btn-presenter, .runestone, .runestone *, section, .pre, code";

function sectionContent() {
    return [...document.querySelectorAll("section *")].filter(
        (el) => !el.matches(KEEP_VISIBLE),
    );
}

function presentToggle() {
    if (!presentModeInitialized) {
        presentModeSetup();
        presentModeInitialized = true;
    }
    let bod = document.body;
    let presentClass = "present";
    let fullHeightClass = "full-height";
    let bottomClass = "bottom";
    if (bod.classList.contains(presentClass)) {
        for (const el of sectionContent()) {
            el.classList.remove("hidden"); //show everything
        }
        document
            .getElementById("completionButton")
            ?.classList.remove("hidden");
        bod.classList.remove(presentClass);
        for (const el of document.querySelectorAll("." + fullHeightClass)) {
            el.classList.remove(fullHeightClass);
        }
        for (const el of document.querySelectorAll("." + bottomClass)) {
            el.classList.remove(bottomClass);
        }
        localStorage.setItem("presentMode", "text");
        for (const exercise of codeExercises) {
            exercise.classList.remove("hidden");
        }
    } else {
        for (const el of sectionContent()) {
            el.classList.add("hidden"); // hide extraneous stuff
        }
        document.getElementById("completionButton")?.classList.add("hidden");
        bod.classList.add(presentClass);
        bod.classList.add(fullHeightClass);
        document.documentElement.classList.add(fullHeightClass);
        for (const el of document.querySelectorAll("section .runestone")) {
            el.classList.add(fullHeightClass);
        }
        for (const el of document.querySelectorAll(".ac-caption")) {
            el.classList.add(bottomClass);
        }
        localStorage.setItem("presentMode", presentClass);
        activateExercise();
    }
}

function presentModeSetup() {
    // moved this out of configure

    // this still leaves some things semi-messed up when you exit presenter mode.
    // but instructors will probably just learn to refresh the page.
    for (const component of document.querySelectorAll(
        "[data-childcomponent]",
    )) {
        component.classList.add("runestone");
        const parentDiv = component.parentElement?.closest("div");
        if (parentDiv && !parentDiv.matches("section")) {
            parentDiv.classList.add("runestone");
            parentDiv.style.maxWidth = "none";
        }
        const parts = component.querySelectorAll(".ac_code_div, .ac_output");
        if (parts.length) {
            const block = document.createElement("div");
            block.className = "ac-block";
            block.style.width = "100%";
            parts[0].before(block);
            for (const part of parts) {
                block.appendChild(part);
            }
        }
    }

    for (const img of document.querySelectorAll("section img")) {
        const wrapper = document.createElement("div");
        wrapper.className = "runestone";
        img.replaceWith(wrapper);
        wrapper.appendChild(img);
    }
    // top-level exercises only: skip .runestone nested inside another
    codeExercises = [...document.querySelectorAll(".runestone")].filter(
        (el) => !el.parentElement.closest(".runestone"),
    );
    for (const heading of document.querySelectorAll("h1")) {
        heading.insertAdjacentHTML(
            "beforebegin",
            "<div class='presentation-title'> \
        <button class='prev-exercise btn-presenter btn-grey-outline' onclick='prevExercise()'>Back</button> \
        <button class='next-exercise btn-presenter btn-grey-solid' onclick='nextExercise()'>Next</button> \
      </div>",
        );
    }
}

function getActiveExercise() {
    return codeExercises.filter((el) => el.classList.contains("active"));
}

function activateExercise(index) {
    if (typeof index == "undefined") {
        index = 0;
    }

    if (codeExercises.length) {
        for (const el of getActiveExercise()) {
            el.classList.remove("active");
        }
        const active = codeExercises[index];
        active.classList.add("active");
        active.classList.remove("hidden");
        for (const el of codeExercises) {
            if (el !== active) {
                el.classList.add("hidden");
            }
        }
    }
}

window.nextExercise = function () {
    let active = getActiveExercise()[0];
    let nextIndex = codeExercises.indexOf(active) + 1;
    if (nextIndex < codeExercises.length) {
        activateExercise(nextIndex);
    }
};

window.prevExercise = function () {
    let active = getActiveExercise()[0];
    let prevIndex = codeExercises.indexOf(active) - 1;
    if (prevIndex >= 0) {
        activateExercise(prevIndex);
    }
};

function configure() {
    let rightNav = document.querySelector(".navbar-right");
    if (!rightNav) {
        return;
    }
    rightNav.insertAdjacentHTML(
        "afterbegin",
        "<li class='dropdown view-toggle'> \
      <label>View: \
        <select class='mode-select'> \
          <option value='text'>Textbook</option> \
          <option value='present'>Code Presenter</option> \
        </select> \
      </label> \
    </li>",
    );

    document
        .querySelector(".mode-select")
        .addEventListener("change", presentToggle);
}

document.addEventListener("runestone:login-complete", function () {
    // if user is instructor, enable presenter mode
    if (eBookConfig.isInstructor) {
        configure();
    }
});


/***/ }),

/***/ 34089:
/*!****************************************!*\
  !*** ./runestone/common/js/domutil.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   animate: () => (/* binding */ animate),
/* harmony export */   escapeHtml: () => (/* binding */ escapeHtml),
/* harmony export */   getDataValue: () => (/* binding */ getDataValue),
/* harmony export */   outerHeight: () => (/* binding */ outerHeight),
/* harmony export */   outerWidth: () => (/* binding */ outerWidth),
/* harmony export */   toggleDisplay: () => (/* binding */ toggleDisplay)
/* harmony export */ });
/* ***********************************
 * |docname| - small DOM helpers
 * ***********************************
 * Helpers that replace common jQuery idioms as components are migrated to
 * plain DOM APIs.
 */

const rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/;

/**
 * Read a data-* attribute with the same type coercion jQuery's .data()
 * performed: "true"/"false"/"null" become their JS values, numeric strings
 * become numbers, JSON-looking strings are parsed, everything else is
 * returned as a string. Returns undefined when the attribute is absent.
 *
 * @param {Element} element
 * @param {string} name - the part of the attribute name after "data-"
 */
function getDataValue(element, name) {
    const data = element.getAttribute(`data-${name}`);
    if (data === null) {
        return undefined;
    }
    if (data === "true") return true;
    if (data === "false") return false;
    if (data === "null") return null;
    // Only convert to a number if it doesn't change the string.
    if (data === +data + "") return +data;
    if (rbrace.test(data)) {
        try {
            return JSON.parse(data);
        } catch (e) {
            return data;
        }
    }
    return data;
}

/**
 * Show or hide an element by toggling inline display, like jQuery's .toggle().
 */
function toggleDisplay(element) {
    if (!element) return;
    if (isHidden(element)) {
        element.style.display = "";
        if (isHidden(element)) {
            element.style.display = "block";
        }
    } else {
        element.style.display = "none";
    }
}

function isHidden(element) {
    if (element.style.display === "none") return true;
    const win = element.ownerDocument.defaultView;
    return win.getComputedStyle(element).display === "none";
}

/**
 * Width of an element including margins, like jQuery's .outerWidth(true).
 */
function outerWidth(element) {
    const style = getComputedStyle(element);
    return (
        element.getBoundingClientRect().width +
        (parseFloat(style.marginLeft) || 0) +
        (parseFloat(style.marginRight) || 0)
    );
}

/**
 * Height of an element including margins, like jQuery's .outerHeight(true).
 */
function outerHeight(element) {
    const style = getComputedStyle(element);
    return (
        element.getBoundingClientRect().height +
        (parseFloat(style.marginTop) || 0) +
        (parseFloat(style.marginBottom) || 0)
    );
}

// Properties that take a bare number rather than a px length.
const unitless = new Set(["opacity", "zIndex", "fontWeight"]);

const kebab = /-([a-z])/g;
const camelCase = (name) => name.replace(kebab, (m, c) => c.toUpperCase());

function parseColor(value) {
    if (!value) return null;
    let m = value.match(/^#([0-9a-f]{3})$/i);
    if (m) {
        return [...m[1]].map((c) => parseInt(c + c, 16));
    }
    m = value.match(/^#([0-9a-f]{6})$/i);
    if (m) {
        return [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16));
    }
    m = value.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (m) {
        return [+m[1], +m[2], +m[3]];
    }
    return null;
}

/**
 * A requestAnimationFrame tween covering the subset of jQuery's .animate()
 * the components use: numeric CSS properties (px, or bare for opacity-like
 * properties) and colors, plus start/progress/complete callbacks. progress
 * receives the 0..1 fraction as its second argument, matching the jQuery
 * callback shape used by existing callers.
 */
function animate(element, properties, options = {}) {
    const duration = options.duration ?? 400;
    const computed = getComputedStyle(element);
    const tweens = [];
    for (const [name, target] of Object.entries(properties)) {
        const prop = camelCase(name);
        if (typeof target === "number") {
            const from = parseFloat(computed[prop]) || 0;
            const unit = unitless.has(prop) ? "" : "px";
            tweens.push((p) => {
                element.style[prop] = from + (target - from) * p + unit;
            });
        } else {
            const fromColor = parseColor(computed[prop]);
            const toColor = parseColor(target);
            if (fromColor && toColor) {
                tweens.push((p) => {
                    const mixed = fromColor.map((f, i) =>
                        Math.round(f + (toColor[i] - f) * p),
                    );
                    element.style[prop] = `rgb(${mixed.join(", ")})`;
                });
            } else {
                // Not interpolatable; just apply the final value at the end.
                tweens.push((p) => {
                    if (p === 1) element.style[prop] = target;
                });
            }
        }
    }
    if (options.start) options.start();
    const t0 = performance.now();
    function step(now) {
        const p = Math.min(1, (now - t0) / duration);
        for (const tween of tweens) tween(p);
        if (options.progress) options.progress(null, p, null);
        if (p < 1) {
            requestAnimationFrame(step);
        } else if (options.complete) {
            options.complete();
        }
    }
    requestAnimationFrame(step);
}

/**
 * Escape a value for interpolation into an HTML string. Use this (or
 * textContent) for anything a user or the server may have supplied --
 * student answers, names, filenames, program output.
 *
 * @param {*} str - converted with String(); null/undefined become ""
 * @returns {string}
 */
function escapeHtml(str) {
    if (str === null || str === undefined) {
        return "";
    }
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/'/g, "&#x27;")
        .replace(/"/g, "&quot;");
}


/***/ }),

/***/ 38073:
/*!******************************************************!*\
  !*** ./runestone/common/js/pretext-iframe-resize.js ***!
  \******************************************************/
/***/ (() => {

// Used for experimental custom runestone components implemented inside
// iframes. This script should automatically request that the iframe get
// resized to fit the content and update when content does.

// It will not install if the page is not inside an iframe, or if the page does not have a
// wrapper element with the attribute data-pretext-frame-resize="lti.frameResize".
// The wrapper element should be the outermost element of the interactive's -if.html page.

// PreTeXt's parent page loads lti_iframe_resizer.js. It identifies the
// sending iframe by contentWindow and expects a height in pixels.
function installPretextIframeResize() {
    if (window.parent === window) return;

    // PreTeXt marks the content wrapper on an interactive's -if.html page.
    const wrapper = document.querySelector(
        '[data-pretext-frame-resize="lti.frameResize"]',
    );
    if (!wrapper) return;
    // The generated aspect ratio reserves space before the component renders.
    // Once JS runs, use the component's actual height instead.
    wrapper.style.aspectRatio = "auto";

    let pending = false;
    let lastHeight = -1;
    const reportHeight = () => {
        pending = false;
        const height = Math.ceil(
            wrapper.getBoundingClientRect().bottom + window.scrollY,
        );
        if (height === lastHeight) return;
        lastHeight = height;
        window.parent.postMessage(
            { subject: "lti.frameResize", height },
            window.location.origin === "null" ? "*" : window.location.origin,
        );
    };
    const scheduleReport = () => {
        if (pending) return;
        pending = true;
        window.requestAnimationFrame(reportHeight);
    };

    // Runestone renders asynchronously, and later actions may change height.
    // Observe content rather than the viewport that the parent resizes.
    if (window.ResizeObserver) {
        new ResizeObserver(scheduleReport).observe(wrapper, {
            box: "border-box",
        });
    }
    scheduleReport();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", installPretextIframeResize, {
        once: true,
    });
} else {
    installPretextIframeResize();
}


/***/ }),

/***/ 45631:
/*!**************************************************!*\
  !*** ./runestone/common/css/presenter_mode.less ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 59782:
/*!************************************************!*\
  !*** ./runestone/common/js/user-highlights.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _domutil_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./domutil.js */ 34089);
/* harmony import */ var _bookfuncs_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./bookfuncs.js */ 83057);
/* harmony import */ var _css_user_highlights_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../css/user-highlights.css */ 77427);
/* Page-completion tracking: the "Mark as Completed" button, the last-page
 * bookmark, and the table-of-contents progress decorations. (The file name
 * is historical.) */







/*
 * GET a server endpoint that answers either JSON or the literal string
 * "None". Returns the parsed JSON or null.
 */
async function fetchJson(url, params) {
    let fullUrl = params ? `${url}?${new URLSearchParams(params)}` : url;
    try {
        let response = await fetch(fullUrl);
        if (!response.ok) {
            console.log("Request Failed for " + fullUrl);
            return null;
        }
        let text = await response.text();
        if (text == "None" || text === "") {
            return null;
        }
        return JSON.parse(text);
    } catch (err) {
        console.log("Request Failed for " + fullUrl);
        console.log(err);
        return null;
    }
}

async function getCompletions() {
    // Get the completion status
    var currentPathname = window.location.pathname;
    if (currentPathname.indexOf("?") !== -1) {
        currentPathname = currentPathname.substring(
            0,
            currentPathname.lastIndexOf("?"),
        );
    }
    var data = await fetchJson(
        `${eBookConfig.new_server_prefix}/logger/getCompletionStatus`,
        {
            lastPageUrl: currentPathname,
            isPtxBook: isPreTeXt(),
        },
    );
    if (data) {
        var completionData = data.detail;
        var completionClass, completionMsg;
        if (completionData[0].completionStatus == 1) {
            completionClass = "buttonConfirmCompletion";
            completionMsg =
                "<i class='glyphicon glyphicon-ok'></i> Completed. Well Done!";
        } else {
            completionClass = "buttonAskCompletion";
            completionMsg = "Mark as Completed";
        }
        let scp = document.querySelector("#scprogresscontainer");
        if (scp) {
            scp.classList.add("ptx-runestone-container");
            scp.insertAdjacentHTML(
                "beforeend",
                '<div style="text-align:center"><button class="btn btn-lg ' +
                    completionClass +
                    '" id="completionButton">' +
                    completionMsg +
                    "</button></div>",
            );
        }
    }
}

function showLastPositionBanner() {
    var lastPositionVal = getUrlVar("lastPosition");
    if (lastPositionVal !== null) {
        document.body.insertAdjacentHTML(
            "beforeend",
            '<img src="../_static/last-point.png" style="position:absolute; padding-top:55px; left: 10px; top: ' +
                parseInt(lastPositionVal) +
                'px;"/>',
        );
        window.scrollTo({
            top: parseInt(lastPositionVal),
            behavior: "smooth",
        });
    }
}

function addNavigationAndCompletionButtons() {
    var completionButton = document.getElementById("completionButton");
    var navLinkBgRight = document.getElementById("navLinkBgRight");
    var navLinkBgLeft = document.getElementById("navLinkBgLeft");
    var relationsNext = document.getElementById("relations-next");
    var navLinkBgRightHiddenPosition = navLinkBgRight
        ? -(0,_domutil_js__WEBPACK_IMPORTED_MODULE_0__.outerWidth)(navLinkBgRight) - 5
        : -5;
    var navLinkBgRightHalfOpen;
    var navLinkBgRightFullOpen = 0;

    if (completionButton?.classList.contains("buttonAskCompletion")) {
        navLinkBgRightHalfOpen = navLinkBgRightHiddenPosition + 70;
    } else if (
        completionButton?.classList.contains("buttonConfirmCompletion")
    ) {
        navLinkBgRightHalfOpen = 0;
    }
    var relationsNextIconInitialPosition = relationsNext
        ? getComputedStyle(relationsNext).right
        : "0px";
    var relationsNextIconNewPosition = -(navLinkBgRightHiddenPosition + 35);

    if (navLinkBgRight) {
        navLinkBgRight.style.right = navLinkBgRightHiddenPosition + "px";
        navLinkBgRight.style.display = "";
        var navBgShown = false;
        window.addEventListener("scroll", function () {
            if (
                window.scrollY + window.innerHeight >=
                document.documentElement.scrollHeight
            ) {
                (0,_domutil_js__WEBPACK_IMPORTED_MODULE_0__.animate)(
                    navLinkBgRight,
                    { right: navLinkBgRightHalfOpen },
                    { duration: 200 },
                );
                if (navLinkBgLeft) {
                    (0,_domutil_js__WEBPACK_IMPORTED_MODULE_0__.animate)(navLinkBgLeft, { left: 0 }, { duration: 200 });
                }
                if (
                    relationsNext &&
                    completionButton?.classList.contains(
                        "buttonConfirmCompletion",
                    )
                ) {
                    (0,_domutil_js__WEBPACK_IMPORTED_MODULE_0__.animate)(
                        relationsNext,
                        { right: relationsNextIconNewPosition },
                        { duration: 200 },
                    );
                }
                navBgShown = true;
            } else if (navBgShown) {
                (0,_domutil_js__WEBPACK_IMPORTED_MODULE_0__.animate)(
                    navLinkBgRight,
                    { right: navLinkBgRightHiddenPosition },
                    { duration: 200 },
                );
                if (navLinkBgLeft) {
                    (0,_domutil_js__WEBPACK_IMPORTED_MODULE_0__.animate)(navLinkBgLeft, { left: -65 }, { duration: 200 });
                }
                if (relationsNext) {
                    (0,_domutil_js__WEBPACK_IMPORTED_MODULE_0__.animate)(relationsNext, {
                        right: relationsNextIconInitialPosition,
                    });
                }
                navBgShown = false;
            }
        });
    }

    var completionFlag = 0;
    if (completionButton?.classList.contains("buttonAskCompletion")) {
        completionFlag = 0;
    } else {
        completionFlag = 1;
    }
    // Make sure we mark this page as visited regardless of how flakey
    // the onunload handlers become.
    processPageState(completionFlag, true, false, false);
    completionButton?.addEventListener("click", function () {
        var markingComplete = false;
        var markingIncomplete = false;
        if (completionButton.classList.contains("buttonAskCompletion")) {
            completionButton.classList.remove("buttonAskCompletion");
            completionButton.classList.add("buttonConfirmCompletion");
            completionButton.innerHTML =
                "<i class='glyphicon glyphicon-ok'></i> Completed. Well Done!";
            if (navLinkBgRight) {
                (0,_domutil_js__WEBPACK_IMPORTED_MODULE_0__.animate)(navLinkBgRight, { right: navLinkBgRightFullOpen });
            }
            if (relationsNext) {
                (0,_domutil_js__WEBPACK_IMPORTED_MODULE_0__.animate)(relationsNext, {
                    right: relationsNextIconNewPosition,
                });
            }
            navLinkBgRightHalfOpen = 0;
            completionFlag = 1;
            markingComplete = true;
        } else if (
            completionButton.classList.contains("buttonConfirmCompletion")
        ) {
            completionButton.classList.remove("buttonConfirmCompletion");
            completionButton.classList.add("buttonAskCompletion");
            completionButton.innerHTML = "Mark as Completed";
            navLinkBgRightHalfOpen = navLinkBgRightHiddenPosition + 70;
            if (navLinkBgRight) {
                (0,_domutil_js__WEBPACK_IMPORTED_MODULE_0__.animate)(navLinkBgRight, { right: navLinkBgRightHalfOpen });
            }
            if (relationsNext) {
                (0,_domutil_js__WEBPACK_IMPORTED_MODULE_0__.animate)(relationsNext, {
                    right: relationsNextIconInitialPosition,
                });
            }
            completionFlag = 0;
            markingIncomplete = true;
        }
        processPageState(
            completionFlag,
            false,
            markingComplete,
            markingIncomplete,
        );
    });
}

// _ decorateTableOfContents
// -------------------------
async function decorateTableOfContents() {
    if (
        window.location.href.toLowerCase().indexOf("toc.html") != -1 ||
        window.location.href.toLowerCase().indexOf("index.html") != -1 ||
        window.location.href.toLowerCase().indexOf("frontmatter") != -1
    ) {
        if (!isPreTeXt()) {
            let data = await fetchJson(
                `${eBookConfig.new_server_prefix}/logger/getAllCompletionStatus`,
            );
            if (data) {
                let subChapterList = data.detail;
                let allSubChapterURLs = document.querySelectorAll(
                    "#main-content div li a",
                );
                for (let item of subChapterList) {
                    for (var s = 0; s < allSubChapterURLs.length; s++) {
                        if (
                            allSubChapterURLs[s].href.indexOf(
                                item.chapterName + "/" + item.subChapterName,
                            ) != -1
                        ) {
                            if (item.completionStatus == 1) {
                                decorateTocEntry(
                                    allSubChapterURLs[s].parentElement,
                                    "completed",
                                    "infoTextCompleted",
                                    "- Completed this topic on " + item.endDate,
                                );
                            } else if (item.completionStatus == 0) {
                                decorateTocEntry(
                                    allSubChapterURLs[s].parentElement,
                                    "active",
                                    "infoTextActive",
                                    "Last read this topic on " + item.endDate,
                                );
                            }
                        }
                    }
                }
            }
        }
        let lastPage = await fetchJson(
            `${eBookConfig.new_server_prefix}/logger/getlastpage`,
            { course: eBookConfig.course },
        );
        if (lastPage) {
            let lastPageData = lastPage.detail;
            if (lastPageData.lastPageChapter != null) {
                let continueReading =
                    document.getElementById("continue-reading");
                if (continueReading) {
                    continueReading.style.display = "";
                    continueReading.innerHTML =
                        '<div id="jump-to-chapter" class="alert alert-info" ><strong>You were Last Reading:</strong> ' +
                        lastPageData.lastPageChapter +
                        (lastPageData.lastPageSubchapter
                            ? " &gt; " + lastPageData.lastPageSubchapter
                            : "") +
                        ' <a href="' +
                        lastPageData.lastPageUrl +
                        "?lastPosition=" +
                        lastPageData.lastPageScrollLocation +
                        '">Continue Reading</a></div>';
                }
            }
        }
    }
}

/*
 * Add a status class and a hover-revealed date annotation to one entry in
 * the table of contents.
 */
function decorateTocEntry(entry, entryClass, infoClass, infoText) {
    entry.classList.add(entryClass);
    let info = document.createElement("span");
    info.className = infoClass;
    info.textContent = infoText;
    entry.appendChild(info);
    let link = entry.children[0];
    if (link && link !== info) {
        link.addEventListener("mouseenter", function () {
            info.style.display = "";
        });
        link.addEventListener("mouseleave", function () {
            info.style.display = "none";
        });
    }
}

async function enableCompletions() {
    // The completion button must exist before the navigation logic looks
    // for it (the jQuery version used a synchronous request here).
    // Only subchapters have progress to fetch or record; the table of
    // contents decorations below belong to pages that are not.
    const subchapterPage = (0,_bookfuncs_js__WEBPACK_IMPORTED_MODULE_1__.isSubchapterPage)();
    if (subchapterPage) {
        await getCompletions();
    }
    showLastPositionBanner();
    if (subchapterPage) {
        addNavigationAndCompletionButtons();
    }
    await decorateTableOfContents();
}

// call enable user highlights after login
document.addEventListener("runestone:login", enableCompletions);

function isPreTeXt() {
    let ptxMarker = document.querySelector("body.pretext");
    if (ptxMarker) {
        return true;
    } else {
        return false;
    }
}
// _ processPageState
// -------------------------
async function processPageState(
    completionFlag,
    pageLoad,
    markingComplete,
    markingIncomplete,
) {
    /*Log last page visited*/
    var currentPathname = window.location.pathname;
    if (currentPathname.indexOf("?") !== -1) {
        currentPathname = currentPathname.substring(
            0,
            currentPathname.lastIndexOf("?"),
        );
    }
    // Is this a ptx book?
    let isPtxBook = isPreTeXt();
    var data = {
        lastPageUrl: currentPathname,
        lastPageScrollLocation: Math.round(window.scrollY),
        completionFlag: completionFlag,
        pageLoad: pageLoad,
        markingComplete: markingComplete,
        markingIncomplete: markingIncomplete,
        course: eBookConfig.course,
        isPtxBook: isPtxBook,
    };
    let url = `${eBookConfig.new_server_prefix}/logger/updatelastpage`;
    try {
        await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json; charset=utf-8" },
            body: JSON.stringify(data),
        });
    } catch (err) {
        console.log("Request Failed for " + url);
        console.log(err);
    }
}

function getUrlVar(name) {
    return new URLSearchParams(window.location.search).get(name);
}


/***/ }),

/***/ 67799:
/*!**********************************************!*\
  !*** ./runestone/splice/js/spliceWrapper.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SpliceWrapper: () => (/* binding */ SpliceWrapper)
/* harmony export */ });
/* harmony import */ var _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/runestonebase.js */ 78673);

class SpliceWrapper extends _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor() {
        super();
        /**
         * Iframes the grading interface is currently displaying, mapped to the
         * saved state of the attempt being reviewed. See ``registerGraderFrame``.
         */
        this.graderFrames = new Map();
        this.initSplice();
    }
    /**
     * Tell the wrapper that ``frame`` is showing one student's attempt to an
     * instructor rather than being worked by its owner. While it is registered
     * ``SPLICE.getState`` is answered with ``state`` instead of whatever the
     * server has for the logged-in user -- which would be the *instructor's*
     * work -- and anything the activity reports back is dropped, so poking at
     * it while grading never writes to an answer table.
     */
    registerGraderFrame(frame, state) {
        this.graderFrames.set(frame, state);
    }
    unregisterGraderFrame(frame) {
        this.graderFrames.delete(frame);
    }
    handleGraderFrameMessage(event, state) {
        if (event.data.subject == "SPLICE.getState") {
            event.source.postMessage({
                message_id: event.data.message_id,
                subject: "SPLICE.getState.response",
                state: state,
            }, "*");
        }
        // Scores and events raised from a grader frame belong to nobody: the
        // instructor is looking at someone else's attempt, so we drop them.
    }
    initSplice() {
        // SPLICE Events
        window.addEventListener("message", async (event) => {
            var sourceIframe = this.sendingIframe(event);
            console.log(`SpliceWrapper: received message subject: ${event.data.subject} from iframe: ${sourceIframe ? sourceIframe.id : "unknown"}`);
            if (sourceIframe && this.graderFrames.has(sourceIframe)) {
                this.handleGraderFrameMessage(event, this.graderFrames.get(sourceIframe));
                return;
            }
            if (event.data.subject == "SPLICE.reportScoreAndState") {
                this.handleScoreAndState(event, sourceIframe);
            }
            else if (event.data.subject == "SPLICE.sendEvent") {
                this.handleSpliceEvent(event, sourceIframe);
            }
            else if (event.data.subject == "SPLICE.getState") {
                await this.handleGetState(event, sourceIframe);
            }
            else if (event.origin === "https://www.myopenmath.com" &&
                typeof event.data === "string" &&
                event.data.indexOf("lti.ext.imathas.result") != -1) {
                // proof of concept for My Open Math
                let msgdata = JSON.parse(event.data);
                let jwt = basicParseJwt(msgdata.jwt);
                console.log("Result received from frame " +
                    msgdata.frame_id +
                    " with score " +
                    jwt.score);
                // todo send score to server
                // does MOM have a way to get the state?
                // todo send state to server
            }
        });
    }
    getUniqueID(event, frame) {
        // Determine the unique identifier for this activity
        // The SPLICE protocol allows for two possibilities
        // 1. activity_id is the unique id as assigned by the provider
        // 2. activity_id is the iframe src url
        // if the activity_id is set there may also be another attribute called domain
        // On Runestone we will try to map the activity to the div_id of the enclosing RS component
        // if possible, otherwise we will use the activity_id or iframe src
        // If an interactive is included in an exercises this allows us to map the score
        // to the id the instructor used to assign the problem.
        if (frame) {
            let rsDiv = frame.closest("[data-component]");
            if (rsDiv) {
                return rsDiv.id;
            }
        }
        let location = event.data.activity_id;
        if (!location) {
            if (frame) {
                location = frame.src;
            }
            else {
                location = "unknown";
                console.error("Could not find iframe that sent the SPLICE event");
            }
        }
        return location;
    }
    handleScoreAndState(event, frame) {
        console.log("Got SPLICE.reportScoreAndState");
        console.log(event.data.activity_id);
        console.log(event.data.score);
        console.log(event.data.state);
        let location = this.getUniqueID(event, frame);
        this.logBookEvent({
            event: event.data.subject,
            div_id: location,
            act: `score: ${event.data.score}`,
            score: event.data.score,
            percent: event.data.score,
            correct: event.data.score == 1.0 ? true : false,
            answer: JSON.stringify(event.data.state),
        });
    }
    sendingIframe(event) {
        // determine the iframe that sent the event
        // you would think that event.source would be the iframe
        // but it is not and getting the location out of event.source
        // creates CORS issues.
        for (const f of document.getElementsByTagName("iframe")) {
            if (f.contentWindow === event.source)
                return f;
        }
        return undefined;
    }
    async getSavedState(location) {
        // fetch the state from the server
        try {
            const response = await fetch("/ns/assessment/results", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    div_id: location,
                    course: eBookConfig.course,
                    event: "SPLICE.getState",
                }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        }
        catch (error) {
            console.error("Error fetching SPLICE state:", error);
            return null;
        }
    }
    async handleGetState(event, frame) {
        console.log("Got SPLICE.getState");
        console.log(event.data.activity_id);
        console.log(event.data.state);
        // subject is SPLICE.getState.response
        let location = this.getUniqueID(event, frame);
        let res = await this.getSavedState(location);
        let state = res === null || res === void 0 ? void 0 : res.detail.answer;
        event.source.postMessage({
            message_id: event.data.message_id,
            subject: "SPLICE.getState.response",
            state: state,
        }, "*");
    }
    handleSpliceEvent(event, frame) {
        // handle generic SPLICE events, such as logged clicks
        // or other events.  SPLICE does not require that we do
        // anything with them, but in keeping with our tradition
        // we will save them to the useinfo table in the database
        // in case they prove to be useful for research later
        console.log("Got SPLICE.sendEvent");
        console.log(event.data.activity_id);
        console.log(event.data.name);
        let location = this.getUniqueID(event, frame);
        this.logBookEvent({
            event: event.data.subject,
            div_id: location,
            act: event.data.name || "unknown",
        });
    }
    // these stubs are not implemented, but are required by the RunestoneBase class
    checkLocalStorage() { }
    setLocalStorage() { }
    restoreAnswers() { }
    disableInteraction() { }
}
function basicParseJwt(token) {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(window
        .atob(base64)
        .split("")
        .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
    })
        .join(""));
    return JSON.parse(jsonPayload);
}


/***/ }),

/***/ 69041:
/*!******************************!*\
  !*** ./ptxrs-bootstrap.less ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 75523:
/*!***************************************************!*\
  !*** ./runestone/common/css/material-symbols.css ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 77427:
/*!**************************************************!*\
  !*** ./runestone/common/css/user-highlights.css ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 78673:
/*!**********************************************!*\
  !*** ./runestone/common/js/runestonebase.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ RunestoneBase)
/* harmony export */ });
/* harmony import */ var _bookfuncs_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./bookfuncs.js */ 83057);
/* harmony import */ var _domutil_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./domutil.js */ 34089);
/* ********************************
 * |docname| - Runestone Base Class
 * ********************************
 * All runestone components should inherit from RunestoneBase. In addition all runestone components should do the following things:
 *
 * 1.   Ensure that they are wrapped in a div with the class runestone
 * 2.   Write their source AND their generated html to the database if the database is configured
 * 3.   Properly save and restore their answers using the checkServer mechanism in this base class. Each component must provide an implementation of:
 *
 *      -    checkLocalStorage
 *      -    setLocalStorage
 *      -    restoreAnswers
 *      -    disableInteraction
 *
 * 4.   provide a Selenium based unit test
 */



//import "./../styles/runestone.css";

var NO_DECORATE = [
    "parsonsMove",
    "showeval",
    "video",
    "poll",
    "view_toggle",
    "dashboard",
    "selectquestion",
    "codelens",
    "peer",
];
class RunestoneBase {
    constructor(opts) {
        this.component_ready_promise = new Promise(
            (resolve) => (this._component_ready_resolve_fn = resolve),
        );
        this.optional = false;
        if (typeof window.allComponents === "undefined") {
            window.allComponents = [];
        }
        window.allComponents.push(this);
        if (opts) {
            this.sid = opts.sid;
            this.graderactive = opts.graderactive;
            this.showfeedback = true;
            if (opts.timed) {
                this.isTimed = true;
            }
            if (opts.enforceDeadline) {
                this.deadline = opts.deadline;
            }
            this.optional = this.parseBooleanAttribute(
                opts.orig,
                "data-optional",
            );
            if (opts.selector_id) {
                this.selector_id = opts.selector_id;
            }
            if (typeof opts.assessmentTaken !== "undefined") {
                this.assessmentTaken = opts.assessmentTaken;
            } else {
                // default to true as this opt is only provided from a timedAssessment
                this.assessmentTaken = true;
            }
            // This is for the selectquestion points
            // If a selectquestion is part of a timed exam it will get
            // the timedWrapper options.
            if (typeof opts.timedWrapper !== "undefined") {
                this.timedWrapper = opts.timedWrapper;
            } else {
                // However sometimes selectquestions
                // are used in regular assignments.  The hacky way to detect this
                // is to look for doAssignment in the URL and then grab
                // the assignment name from the heading.
                if (location.href.indexOf("doAssignment") >= 0) {
                    this.timedWrapper =
                        document.querySelector("h1#assignment_name")
                            ?.textContent || "";
                } else {
                    this.timedWrapper = null;
                }
            }
            if (opts.orig && (0,_domutil_js__WEBPACK_IMPORTED_MODULE_1__.getDataValue)(opts.orig, "question_label")) {
                this.question_label = (0,_domutil_js__WEBPACK_IMPORTED_MODULE_1__.getDataValue)(opts.orig, "question_label");
            }
            this.is_toggle =  true ? opts.is_toggle : 0;
            this.is_select =  true ? opts.is_select : 0;
        }
        if (opts && typeof opts.preamble !== "undefined") {
            this.preamble = opts.preamble;
            let y = document.createElement("div");
            y.classList.add("hidden-content");
            y.classList.add("process-math");
            y.innerHTML = "\\(" + this.preamble + "\\)";
            // This is a hack to get the preamble into the DOM so that MathJax can process it.
            opts.orig.appendChild(y);
            y.id = "ltx_preamble";
            y.style.display = "none";
            // queueMathJax typesets this before the component's own math.
            this.preambleDiv = y;
        }

        this.jsonHeaders = new Headers({
            "Content-type": "application/json; charset=utf-8",
            Accept: "application/json",
        });
    }

    // Helper for parsing boolean data-* attributes
    // Unset/"false"/"no" means false, anything else, including empty string means true
    parseBooleanAttribute(element, attributeName) {
        const attrValue = element.getAttribute(attributeName);
        if (attrValue === null) {
            return false;
        }
        const lowerValue = attrValue.toLowerCase();
        if (lowerValue === "false" || lowerValue === "no") {
            return false;
        }
        return true;
    }

    // _`logBookEvent`
    //----------------
    // This function sends the provided ``eventInfo`` to the `hsblog endpoint` of the server. Awaiting this function returns either ``undefined`` (if Runestone services are not available) or the data returned by the server as a JavaScript object (already JSON-decoded).
    async logBookEvent(eventInfo) {
        if (this.graderactive) {
            return;
        }
        let post_return;
        eventInfo.course_name = eBookConfig.course;
        eventInfo.clientLoginStatus = eBookConfig.isLoggedIn;
        eventInfo.timezoneoffset = new Date().getTimezoneOffset() / 60;
        // For selectquestions we need to log using the selector_id for real time scoring
        if (this.selector_id) {
            eventInfo.selector_id = this.selector_id;
        }
        if (typeof this.percent === "number") {
            eventInfo.percent = this.percent;
        }
        if (window.assignmentId) {
            eventInfo.assignment_id = window.assignmentId;
        }
        if (
            eBookConfig.isLoggedIn &&
            eBookConfig.useRunestoneServices &&
            eBookConfig.logLevel > 0
        ) {
            post_return = this.postLogMessage(eventInfo);
        }
        if (!this.isTimed || eBookConfig.debug) {
            let prefix = eBookConfig.isLoggedIn ? "Save" : "Not";
            console.log(`${prefix} logging event ` + JSON.stringify(eventInfo));
        }
        // When selectquestions are part of an assignment especially toggle questions
        // we need to count using the selector_id of the select question.
        // We  also need to log an event for that selector so that we will know
        // that interaction has taken place.  This is **independent** of how the
        // autograder will ultimately grade the question!
        if (this.selector_id) {
            eventInfo.div_id = this.selector_id.replace(
                "-toggleSelectedQuestion",
                "",
            );
            eventInfo.event = "selectquestion";
            eventInfo.act = "interaction";
            this.postLogMessage(eventInfo);
        }
        if (
            typeof _bookfuncs_js__WEBPACK_IMPORTED_MODULE_0__.pageProgressTracker.updateProgress === "function" &&
            eventInfo.act != "edit" &&
            this.optional == false
        ) {
            _bookfuncs_js__WEBPACK_IMPORTED_MODULE_0__.pageProgressTracker.updateProgress(eventInfo.div_id);
        }
        // if the event is in the NO_DECORATE list then don't decorate the status
        if (NO_DECORATE.indexOf(eventInfo.event) === -1) {
            this.decorateStatus();
        }
        return post_return;
    }

    async postLogMessage(eventInfo) {
        var post_return;
        let request = new Request(
            `${eBookConfig.new_server_prefix}/logger/bookevent`,
            {
                method: "POST",
                headers: this.jsonHeaders,
                body: JSON.stringify(eventInfo),
            },
        );
        let response;
        try {
            response = await fetch(request);
            if (!response.ok) {
                if (response.status === 422) {
                    // Get details about why this is unprocesable.
                    post_return = await response.json();
                    console.log(JSON.stringify(post_return.detail, null, 4));
                    throw new Error("Unprocessable Request");
                } else if (response.status == 401) {
                    post_return = await response.json();
                    console.log(
                        `Missing authentication token ${post_return.detail}`,
                    );
                    throw new Error("Missing authentication token");
                }
                throw new Error(`Failed to save the log entry
                    Status: ${response.status}`);
            }
            post_return = await response.json();
        } catch (e) {
            let detail = "none";
            if (post_return && post_return.detail) {
                detail = post_return.detail;
            }
            // ``response`` is unset if fetch itself rejected.
            let statusCode = response ? response.status : "no response";
            if (eBookConfig.useRunestoneServices) {
                alert(`Error: Your action was not saved!
                    The error was ${e}
                    Status Code: ${statusCode}
                    Detail: ${JSON.stringify(detail, null, 4)}.
                    Please report this error!`);
            }
            // send a request to save this error
            console.log(
                `Error: ${e} Detail: ${detail} Status Code: ${statusCode}`,
            );
            return post_return;
        }
        // The log entry is saved. Everything below only updates the score display on
        // an assignment page; a failure here is a display bug, not a lost submission,
        // so it must never reach the alert above. See issue #1393.
        this.showReturnedScore(post_return);
        return post_return;
    }
    // update the score for the question and the total score
    // the presence of the gradeBox is used to determine if we are on an assignment page.
    updateScores(gradeBox, scoreSpec) {
        if (!scoreSpec.assigned || scoreSpec.score === null) {
            // Not every component has a matching message div, and select questions
            // name theirs after the selector rather than the rendered question.
            let messageBox = document.getElementById(`${this.divid}_message`);
            if (messageBox) {
                messageBox.innerHTML =
                    "Score not updated.  Submissions are closed.";
            }
            return;
        }
        let scoreSpan = gradeBox.getElementsByClassName("qscore")[0];
        if (scoreSpan) {
            scoreSpan.innerHTML = scoreSpec.score.toFixed(1);
        }
        let allScores = document.getElementsByClassName("qscore");
        let allmax = document.getElementsByClassName("qmaxscore");
        let total = 0;
        let max = 0;
        for (let i = 0; i < allScores.length; i++) {
            total += parseFloat(allScores[i].innerHTML);
            max += parseFloat(allmax[i].innerHTML);
        }
        let totalSpan = document.getElementById("total_score");
        if (totalSpan) {
            totalSpan.innerHTML = total.toFixed(1);
        }
        let maxSpan = document.getElementById("total_max");
        if (maxSpan) {
            maxSpan.innerHTML = max;
        }
        let percentSpan = document.getElementById("total_percent");
        if (percentSpan) {
            percentSpan.innerHTML = ((total / max) * 100).toFixed(2);
        }
    }

    // Update the score shown on an assignment page from the score spec a logging
    // endpoint returned in ``detail``. Never throws: the answer is already saved.
    showReturnedScore(post_return) {
        try {
            let scoreSpec = post_return ? post_return.detail : null;
            // Only graded events come back with a score spec. Ungraded ones --
            // view_toggle, selectquestion, parsonsMove and friends -- have no score
            // to report, so there is nothing to update.
            if (scoreSpec && "assigned" in scoreSpec && !this.isTimed) {
                let boxId = this.selector_id
                    ? this.selector_id.replace("-toggleSelectedQuestion", "")
                    : this.divid;
                let gradeBox = document.getElementById(`${boxId}_score`);
                if (gradeBox) {
                    this.updateScores(gradeBox, scoreSpec);
                }
            }
        } catch (e) {
            console.error(`Could not update the score display: ${e}`);
        }
    }

    // .. _logRunEvent:
    //
    // logRunEvent
    // -----------
    // This function sends the provided ``eventInfo`` to the `runlog endpoint`. When awaited, this function returns the data (decoded from JSON) the server sent back.
    async logRunEvent(eventInfo) {
        let post_promise = "done";
        if (this.graderactive) {
            return;
        }
        eventInfo.course = eBookConfig.course;
        eventInfo.clientLoginStatus = eBookConfig.isLoggedIn;
        eventInfo.timezoneoffset = new Date().getTimezoneOffset() / 60;
        if (this.forceSave || "to_save" in eventInfo === false) {
            eventInfo.save_code = "True";
        }
        if (typeof eventInfo.errinfo !== "undefined") {
            eventInfo.errinfo = eventInfo.errinfo.toString();
        }
        // A run is graded when the question is scored on interaction, which needs
        // the same assignment and selectquestion context as ``logBookEvent``.
        if (this.selector_id) {
            eventInfo.selector_id = this.selector_id;
        }
        if (window.assignmentId) {
            eventInfo.assignment_id = window.assignmentId;
        }
        if (
            eBookConfig.isLoggedIn &&
            eBookConfig.useRunestoneServices &&
            eBookConfig.logLevel > 0
        ) {
            let request = new Request(
                `${eBookConfig.new_server_prefix}/logger/runlog`,
                {
                    method: "POST",
                    headers: this.jsonHeaders,
                    body: JSON.stringify(eventInfo),
                },
            );
            let response = await fetch(request);
            if (!response.ok) {
                post_promise = await response.json();
                if (eBookConfig.useRunestoneServices) {
                    alert(`Failed to save your code
                        Status is ${response.status}
                        Detail: ${JSON.stringify(
                            post_promise.detail,
                            null,
                            4,
                        )}`);
                } else {
                    console.log(
                        `Did not save the code.
                         Status: ${response.status}
                         Detail: ${JSON.stringify(
                             post_promise.detail,
                             null,
                             4,
                         )}`,
                    );
                }
            } else {
                post_promise = await response.json();
                this.showReturnedScore(post_promise);
            }
        }
        if (!this.isTimed || eBookConfig.debug) {
            console.log("running " + JSON.stringify(eventInfo));
        }
        if (
            typeof _bookfuncs_js__WEBPACK_IMPORTED_MODULE_0__.pageProgressTracker.updateProgress === "function" &&
            this.optional == false
        ) {
            _bookfuncs_js__WEBPACK_IMPORTED_MODULE_0__.pageProgressTracker.updateProgress(eventInfo.div_id);
        }
        return post_promise;
    }
    /* Checking/loading from storage
    **WARNING:**  DO NOT `await` this function!
    This function, although async, does not explicitly resolve its promise by returning a value.  The reason for this is because it is called by the constructor for nearly every component.  In Javascript constructors cannot be async!

    One of the recommended ways to handle the async requirements from within a constructor is to use an attribute as a promise and resolve that attribute at the appropriate time.
    */
    async checkServer(
        // A string specifying the event name to use for querying the :ref:`getAssessResults` endpoint.
        eventInfo,
        // If true, this function will invoke ``indicate_component_ready()`` just before it returns. This is provided since most components are ready after this function completes its work.
        //
        // TODO: This defaults to false, to avoid causing problems with any components that haven't been updated and tested. After all Runestone components have been updated, default this to true and remove the extra parameter from most calls to this function.
        will_be_ready = false,
    ) {
        // Check if the server has stored answer
        let self = this;
        this.checkServerComplete = new Promise(function (resolve, reject) {
            self.csresolver = resolve;
        });
        if (
            eBookConfig.isLoggedIn &&
            (this.useRunestoneServices || this.graderactive)
        ) {
            let data = {};
            data.div_id = this.divid;
            data.course = eBookConfig.course;
            data.event = eventInfo;
            if (this.graderactive && this.deadline) {
                data.deadline = this.deadline;
                data.rawdeadline = this.rawdeadline;
                data.tzoff = this.tzoff;
            }
            if (this.sid) {
                data.sid = this.sid;
            }
            if (!(data.div_id && data.course && data.event)) {
                console.log(
                    `A required field is missing data ${data.div_id}:${data.course}:${data.event}`,
                );
            }
            // If we are NOT in practice mode and we are not in a peer exercise
            // and assessmentTaken is true
            if (
                !eBookConfig.practice_mode &&
                !eBookConfig.peer &&
                this.assessmentTaken
            ) {
                let request = new Request(
                    `${eBookConfig.new_server_prefix}/assessment/results`,
                    {
                        method: "POST",
                        body: JSON.stringify(data),
                        headers: this.jsonHeaders,
                    },
                );
                try {
                    let response = await fetch(request);
                    console.log(`Response from server: ${response.status}`);
                    if (response.ok) {
                        data = await response.json();
                        data = data.detail;
                        console.log(
                            `Data from server: ${JSON.stringify(data)} calling repopulateFromStorage`,
                        );
                        this.repopulateFromStorage(data);
                        this.attempted = true;
                        if (typeof data.correct !== "undefined") {
                            this.correct = data.correct;
                        } else {
                            this.correct = null;
                        }
                        console.log(`resolving checkServer with server data`);
                        this.csresolver("server");
                    } else {
                        console.log(
                            `HTTP Error getting results: ${response.statusText}`,
                        );
                        this.checkLocalStorage(); // just go right to local storage
                        console.log(`resolving checkServer with local data`);
                        this.csresolver("local");
                    }
                } catch (err) {
                    console.log(`Error getting results: ${err}`);
                    try {
                        this.checkLocalStorage();
                    } catch (err) {
                        console.log(err);
                    }
                }
            } else {
                this.loadData({});
                console.log(`resolving checkServer no answer given`);
                this.csresolver("not taken");
            }
        } else {
            this.checkLocalStorage(); // just go right to local storage
            console.log(`resolving checkServer with local data`);
            this.csresolver("local");
        }

        if (will_be_ready) {
            this.indicate_component_ready();
        }
    }

    // This method assumes that ``this.componentDiv`` refers to the ``div`` containing the component, and that this component's ID is set.
    indicate_component_ready() {
        // Add a class to indicate the component is now ready.
        this.containerDiv.classList.add("runestone-component-ready");
        // Resolve the ``this.component_ready_promise``.
        this._component_ready_resolve_fn();
    }

    loadData(data) {
        // for most classes, loadData doesn't do anything. But for Parsons, and perhaps others in the future,
        // initialization can happen even when there's no history to be loaded
        return null;
    }

    /**
     * repopulateFromStorage is called after a successful API call is made to ``getAssessResults`` in
     * the checkServer method in this class
     *
     * ``restoreAnswers,`` ``setLocalStorage`` and ``checkLocalStorage`` are defined in the child classes.
     *
     * @param {*} data - a JSON object representing the data needed to restore a previous answer for a component
     * @param {*} status - the http status
     * @param {*} whatever - ignored
     */
    repopulateFromStorage(data) {
        // decide whether to use the server's answer (if there is one) or to load from storage
        if (data !== null && data !== "no data" && this.shouldUseServer(data)) {
            this.restoreAnswers(data);
            this.setLocalStorage(data);
        } else {
            this.checkLocalStorage();
        }
        this.decorateStatus();
    }
    shouldUseServer(data) {
        // returns true if server data is more recent than local storage or if server storage is correct
        if (
            data.correct === "T" ||
            data.correct === true ||
            localStorage.length === 0 ||
            this.graderactive === true ||
            this.isTimed
        ) {
            return true;
        }
        let ex = localStorage.getItem(this.localStorageKey());
        if (ex === null) {
            return true;
        }
        let storedData;
        try {
            storedData = JSON.parse(ex);
        } catch (err) {
            // error while parsing; likely due to bad value stored in storage
            console.log(err.message);
            localStorage.removeItem(this.localStorageKey());
            // definitely don't want to use local storage here
            return true;
        }
        if (data.answer == storedData.answer) return true;
        let storageDate = new Date(storedData.timestamp);
        let serverDate = new Date(data.timestamp);
        return serverDate >= storageDate;
    }
    // Return the key which to be used when accessing local storage.
    localStorageKey() {
        return (
            eBookConfig.email +
            ":" +
            eBookConfig.course +
            ":" +
            this.divid +
            "-given"
        );
    }
    addCaption(elType) {
        //someElement.parentNode.insertBefore(newElement, someElement.nextSibling);
        if (!this.isTimed) {
            var capDiv = document.createElement("p");
            if (this.question_label) {
                // Display caption based on whether Runestone services have been detected
                this.caption = eBookConfig.useRunestoneServices
                    ? `Activity: ${this.question_label} ${this.caption}  <span class="runestone_caption_divid">(${this.divid})</span>`
                    : `Activity: ${this.question_label} ${this.caption}`; // Without runestone
                capDiv.innerHTML = this.caption;
                capDiv.classList.add(`${elType}_caption`);
            } else {
                // Display caption based on whether Runestone services have been detected
                capDiv.innerHTML = eBookConfig.useRunestoneServices
                    ? this.caption + " (" + this.divid + ")"
                    : this.caption; // Without runestone
                capDiv.classList.add(`${elType}_caption`);
                capDiv.classList.add(`${elType}_caption_text`);
            }
            this.capDiv = capDiv;
            //this.outerDiv.parentNode.insertBefore(capDiv, this.outerDiv.nextSibling);
            this.containerDiv.appendChild(capDiv);
        }
    }

    hasUserActivity() {
        return this.isAnswered;
    }

    checkCurrentAnswer() {
        console.log(
            "Each component should provide an implementation of checkCurrentAnswer",
        );
    }

    async logCurrentAnswer() {
        console.log(
            "Each component should provide an implementation of logCurrentAnswer",
        );
    }
    renderFeedback() {
        console.log(
            "Each component should provide an implementation of renderFeedback",
        );
    }
    disableInteraction() {
        console.log(
            "Each component should provide an implementation of disableInteraction",
        );
    }

    toString() {
        return `${this.constructor.name}: ${this.divid}`;
    }

    /**
     * Queue MathJax rendering for `component`.
     *
     * This is the only MathJax entry point interactive components should use.
     * It waits for the page's initial MathJax pass when one is configured. The
     * returned promise always resolves to `null` when MathJax is unavailable
     * or failed to load, allowing callers to perform their post-render layout
     * and accessibility work in `.then()` without their own feature checks or
     * polling. A genuine MathJax typesetting error still rejects the promise.
     *
     * MathJax 4 chains `typesetPromise` calls itself, so calls run in the
     * order they are made (issue #1582). MathJax 3 does not, so for it the
     * calls are chained here.
     *
     * Templates that define `window.runestoneMathReady` must settle it after
     * either a successful initial typeset or a MathJax load failure.
     */
    async queueMathJax(component) {
        const mathJax = await getMathJax();
        if (!mathJax) return null;
        if (this.preambleDiv) {
            // Typesetting the preamble registers its \newcommand and
            // \DeclareMathOperator definitions with the TeX input jax.
            // Those definitions are global and persist for every later
            // typesetPromise call on the page, so the component does not
            // need its own copy of the preamble -- see issue #1248, where
            // prepending a copy put the raw macro source on screen.
            await typeset(mathJax, [this.preambleDiv]);
        }
        return typeset(mathJax, [component]);
    }

    decorateStatus() {
        if (this.isTimed || eBookConfig.peer) return;
        let rsDiv = this.containerDiv
            ? this.containerDiv.closest("div.runestone")
            : null;
        if (!rsDiv) return;
        rsDiv.classList.remove("notAnswered");
        rsDiv.classList.remove("isInCorrect");
        rsDiv.classList.remove("isCorrect");
        let assignmentInfo = localStorage.getItem(
            `currentAssignmentInfo_${eBookConfig.course}`,
        );
        let questions = [];
        if (assignmentInfo) {
            questions = JSON.parse(assignmentInfo).questions;
        }
        if (questions.indexOf(this.divid) >= 0) {
            rsDiv.classList.add("isAssigned");
        }
        if (this.correct) {
            rsDiv.classList.add("isCorrect");
        } else {
            if (this.correct === null || typeof this.correct === "undefined") {
                rsDiv.classList.add("notAnswered");
            } else {
                rsDiv.classList.add("isInCorrect");
            }
        }
    }
}

// Resolve to the page's MathJax once its initial typesetting pass is done, or
// to null when MathJax is missing or failed to load.
async function getMathJax() {
    // PreTeXt/Runestone pages resolve this after their initial page-level
    // typesetting pass. Standalone pages can use MathJax's startup promise.
    const readiness =
        window.runestoneMathReady ?? globalThis.MathJax?.startup?.promise;
    if (readiness) {
        try {
            await readiness;
        } catch {
            return null;
        }
    }

    const mathJax = globalThis.MathJax;
    return typeof mathJax?.typesetPromise === "function" ? mathJax : null;
}

// MathJax 3 needs overlapping typesetPromise calls chained by the caller.
let mathJax3Chain = Promise.resolve();

function typeset(mathJax, elements) {
    if (!mathJax.version?.startsWith("3.")) {
        return mathJax.typesetPromise(elements);
    }
    const run = mathJax3Chain.then(() => mathJax.typesetPromise(elements));
    // A failed typeset rejects for its caller but must not stall later ones.
    mathJax3Chain = run.catch(() => {});
    return run;
}

window.RunestoneBase = RunestoneBase;


/***/ }),

/***/ 80184:
/*!**************************!*\
  !*** ./webpack.index.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   runestone_auto_import: () => (/* binding */ runestone_auto_import),
/* harmony export */   runestone_import: () => (/* binding */ runestone_import)
/* harmony export */ });
/* harmony import */ var _ptxrs_bootstrap_less__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ptxrs-bootstrap.less */ 69041);
/* harmony import */ var _runestone_common_css_material_symbols_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./runestone/common/css/material-symbols.css */ 75523);
/* harmony import */ var _runestone_common_js_bookfuncs_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./runestone/common/js/bookfuncs.js */ 83057);
/* harmony import */ var _runestone_common_js_user_highlights_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./runestone/common/js/user-highlights.js */ 59782);
/* harmony import */ var _runestone_common_js_pretext_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./runestone/common/js/pretext.js */ 19359);
/* harmony import */ var _runestone_common_js_pretext_iframe_resize_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./runestone/common/js/pretext-iframe-resize.js */ 38073);
/* harmony import */ var _runestone_common_js_pretext_iframe_resize_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_runestone_common_js_pretext_iframe_resize_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _runestone_common_js_theme_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./runestone/common/js/theme.js */ 94564);
/* harmony import */ var _runestone_common_js_presenter_mode_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./runestone/common/js/presenter_mode.js */ 19695);
/* harmony import */ var _runestone_common_js_presenter_mode_js__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_runestone_common_js_presenter_mode_js__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _runestone_common_css_presenter_mode_less__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./runestone/common/css/presenter_mode.less */ 45631);
/* harmony import */ var _runestone_common_js_renderComponent_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./runestone/common/js/renderComponent.js */ 98098);
/* harmony import */ var _runestone_common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./runestone/common/js/runestonebase.js */ 78673);
/* harmony import */ var _runestone_splice_js_spliceWrapper_ts__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./runestone/splice/js/spliceWrapper.ts */ 67799);
// ***********************************************************************************
// |docname| - A framework allowing a Runestone component to load only the JS it needs
// ***********************************************************************************
// The JavaScript required by all Runestone components is quite large and results in slow page loads. This approach enables a Runestone component to load only the JavaScript it needs, rather than loading JavaScript for all the components regardless of which are actually used.
//
// To accomplish this, webpack's split-chunks ability analyzes all JS, starting from this file. The dynamic imports below are transformed by webpack into the dynamic fetches of just the JS required by each file and all its dependencies. (If using static imports, webpack will assume that all files are already statically loaded via script tags, defeating the purpose of this framework.)
//
// However, this approach leads to complexity:
//
// -    The ``data-component`` attribute of each component must be kept in sync with the keys of the ``module_map`` below.
// -    The values in the ``module_map`` must be kept in sync with the JavaScript files which implement each of the components.

// Static imports
// ==============
// These imports are (we assume) needed by all pages. However, it would be much better to load these in the modules that actually use them.
//
// These are static imports; code in `dynamically loaded components`_ deals with dynamic imports.
//
// jQuery UI is no longer loaded globally: the vendored pytutor bundle
// (codelens) carries its own jQuery, jQuery UI, and jQuery UI CSS, and no
// other component uses it.
// i18n is now handled by the dependency-free runestone/common/js/rsi18n.js;
// the vendored Wikimedia jquery.i18n plugin has been removed.

// common styles come from here

// Self-hosted icon font for the ``material-symbols-outlined`` spans that
// components render; without it the icon names show up as literal text.


// Misc





// These are only needed for the Runestone book, but not in a library mode (such as pretext). I would prefer to dynamically load them. However, these scripts are so small I haven't bothered to do so.







// Dynamically loaded components
// =============================
// This provides a list of modules that components can dynamically import. Webpack will create a list of imports for each based on its analysis.
const module_map = {
    // Wrap each import in a function, so that it won't occur until the function is called. While something cleaner would be nice, webpack can't analyze things like ``import(expression)``.
    //
    // The keys must match the value of each component's ``data-component`` attribute -- the ``runestone_import`` and ``runestone_auto_import`` functions assume this.
    activecode: () => Promise.all(/*! import() */[__webpack_require__.e("vendors-node_modules_sql_js_dist_sql-wasm_js"), __webpack_require__.e("vendors-node_modules_byte-base64_lib_js-node_modules_codemirror_addon_comment_comment_js-node-8b2590"), __webpack_require__.e("runestone_codelens_js_pytutor-embed_bundle_js"), __webpack_require__.e("runestone_activecode_js_acfactory_js-node_modules_codemirror_addon_hint_show-hint_css-node_mo-3de613"), __webpack_require__.e("runestone_common_js_rsi18n_js")]).then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/activecode/js/acfactory.js */ 49917)),
    // Always import the timed version of a component if available, since the timed components also define the component's factory and include the component as well. Note that ``acfactory`` imports the timed components of ActiveCode, so it follows this pattern.
    clickablearea: () =>
        Promise.all(/*! import() */[__webpack_require__.e("runestone_clickableArea_js_timedclickable_js"), __webpack_require__.e("runestone_clickableArea_css_clickable_css")]).then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/clickableArea/js/timedclickable.js */ 44892)),
    codelens: () => Promise.all(/*! import() */[__webpack_require__.e("runestone_codelens_js_pytutor-embed_bundle_js"), __webpack_require__.e("runestone_codelens_js_codelens_js")]).then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/codelens/js/codelens.js */ 76412)),
    datafile: () => __webpack_require__.e(/*! import() */ "runestone_datafile_js_datafile_js").then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/datafile/js/datafile.js */ 33580)),
    dragndrop: () => Promise.all(/*! import() */[__webpack_require__.e("runestone_dragndrop_js_timeddnd_js"), __webpack_require__.e("runestone_common_js_mathjax-a11y_js-runestone_common_js_rsi18n_js")]).then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/dragndrop/js/timeddnd.js */ 17558)),
    fillintheblank: () => Promise.all(/*! import() */[__webpack_require__.e("runestone_fitb_js_timedfitb_js"), __webpack_require__.e("runestone_common_js_rsi18n_js-runestone_fitb_css_fitb_css")]).then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/fitb/js/timedfitb.js */ 1103)),
    groupsub: () => __webpack_require__.e(/*! import() */ "runestone_groupsub_js_groupsub_js").then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/groupsub/js/groupsub.js */ 24616)),
    matching: () => Promise.all(/*! import() */[__webpack_require__.e("runestone_matching_js_matching_js"), __webpack_require__.e("runestone_common_js_mathjax-a11y_js-runestone_common_js_xmlconversion_js")]).then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/matching/js/matching.js */ 17352)),
    multiplechoice: () => Promise.all(/*! import() */[__webpack_require__.e("runestone_mchoice_js_timedmc_js"), __webpack_require__.e("runestone_common_js_mathjax-a11y_js-runestone_mchoice_css_mchoice_css")]).then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/mchoice/js/timedmc.js */ 86001)),
    hparsons: () => Promise.all(/*! import() */[__webpack_require__.e("vendors-node_modules_sql_js_dist_sql-wasm_js"), __webpack_require__.e("vendors-node_modules_sortablejs_modular_sortable_esm_js-node_modules_highlight_js_es_core_js--8c942a"), __webpack_require__.e("runestone_common_js_mathjax-a11y_js-runestone_parsons_js_parsons-i18n_en_js-runestone_parsons-1c071d"), __webpack_require__.e("runestone_hparsons_js_hparsons_js")]).then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/hparsons/js/hparsons.js */ 47272)),
    parsons: () => Promise.all(/*! import() */[__webpack_require__.e("runestone_common_js_mathjax-a11y_js-runestone_parsons_js_parsons-i18n_en_js-runestone_parsons-1c071d"), __webpack_require__.e("runestone_parsons_js_timedparsons_js")]).then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/parsons/js/timedparsons.js */ 23405)),
    poll: () => __webpack_require__.e(/*! import() */ "runestone_poll_js_poll_js").then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/poll/js/poll.js */ 11168)),
    selectquestion: () => Promise.all(/*! import() */[__webpack_require__.e("runestone_selectquestion_js_selectone_js"), __webpack_require__.e("runestone_selectquestion_css_selectquestion_css")]).then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/selectquestion/js/selectone.js */ 10662)),
    shortanswer: () =>
        Promise.all(/*! import() */[__webpack_require__.e("runestone_shortanswer_js_timed_shortanswer_js"), __webpack_require__.e("runestone_shortanswer_css_shortanswer_css")]).then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/shortanswer/js/timed_shortanswer.js */ 68950)),
    showeval: () => __webpack_require__.e(/*! import() */ "runestone_showeval_js_showEval_js").then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/showeval/js/showEval.js */ 8824)),
    tabbedStuff: () => __webpack_require__.e(/*! import() */ "runestone_tabbedStuff_js_tabbedstuff_js").then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/tabbedStuff/js/tabbedstuff.js */ 76442)),
    timedAssessment: () => Promise.all(/*! import() */[__webpack_require__.e("vendors-node_modules_sql_js_dist_sql-wasm_js"), __webpack_require__.e("vendors-node_modules_byte-base64_lib_js-node_modules_codemirror_addon_comment_comment_js-node-8b2590"), __webpack_require__.e("runestone_codelens_js_pytutor-embed_bundle_js"), __webpack_require__.e("runestone_common_js_mathjax-a11y_js-runestone_parsons_js_parsons-i18n_en_js-runestone_parsons-1c071d"), __webpack_require__.e("runestone_activecode_js_acfactory_js-node_modules_codemirror_addon_hint_show-hint_css-node_mo-3de613"), __webpack_require__.e("runestone_parsons_js_timedparsons_js"), __webpack_require__.e("runestone_dragndrop_js_timeddnd_js"), __webpack_require__.e("runestone_fitb_js_timedfitb_js"), __webpack_require__.e("runestone_matching_js_matching_js"), __webpack_require__.e("runestone_mchoice_js_timedmc_js"), __webpack_require__.e("runestone_clickableArea_js_timedclickable_js"), __webpack_require__.e("runestone_selectquestion_js_selectone_js"), __webpack_require__.e("runestone_shortanswer_js_timed_shortanswer_js"), __webpack_require__.e("runestone_timed_js_timed_js-runestone_clickableArea_css_clickable_css-runestone_fitb_css_fitb-cd9fb1")]).then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/timed/js/timed.js */ 4968)),
    // TODO: since this isn't in a ``data-component``, need to trigger an import of this code manually.
    webwork: () => __webpack_require__.e(/*! import() */ "runestone_webwork_js_webwork_js").then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/webwork/js/webwork.js */ 84680)),
    youtube: () => __webpack_require__.e(/*! import() */ "runestone_video_js_runestonevideo_js").then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/video/js/runestonevideo.js */ 86915)),
    doenet: () => Promise.resolve(), // Doenet is loaded separately
};

const module_map_cache = {};
const QUEUE_FLUSH_TIME_MS = 10;
const queue = [];
let queueLastFlush = 0;
/**
 * Queue imports that are requested within `QUEUE_FLUSH_TIME_MS` of each other.
 * All such imports are imported at once, and then a promise is fired after all
 * the imports in the queue window have completed.
 */
function queueImport(component_name) {
    let resolve = null;
    let reject = null;
    const retPromise = new Promise((r, rej) => {
        resolve = r;
        reject = rej;
    });
    const item = { component_name, resolve, reject };
    queue.push(item);
    window.setTimeout(flushQueue, QUEUE_FLUSH_TIME_MS + 1);

    return retPromise;
}
async function flushQueue() {
    if (queue.length === 0) {
        return;
    }
    if (Date.now() - queueLastFlush < QUEUE_FLUSH_TIME_MS) {
        window.setTimeout(flushQueue, QUEUE_FLUSH_TIME_MS + 1);
        return;
    }
    // If we made it here, it has been at least QUEUE_FLUSH_TIME_MS since
    // the last time we flushed the queue. Therefore, we should start flushing.
    // We copy everything we flush and empty the array first.
    queueLastFlush = Date.now();
    const toFlush = [...queue];
    queue.length = 0;
    console.log(
        "Webpack is starting the loading process for the following Runestone modules",
        toFlush.map((item) => item.component_name),
    );
    const flushedPromise = toFlush.map(async (item) => {
        try {
            await module_map[item.component_name]();
            console.log(
                `Runestone component ${item.component_name} has been loaded`,
            );
            return item;
        } catch (e) {
            item.reject(e);
        }
    });
    const flushed = await Promise.all(flushedPromise);
    try {
        flushed.forEach(function (item) {
            if (item) {
                item.resolve();
            }
        });
    } catch (e) {
        console.error(e);
    }
}

// .. _dynamic import machinery:
//
// Dynamic import machinery
// ========================
// Fulfill a promise when the Runestone pre-login complete event occurs.
let pre_login_complete_promise = new Promise((resolve) =>
    document.addEventListener("runestone:pre-login-complete", resolve),
);
let loadedComponents;
// Provide a simple function to import the JS for all components on the page.
function runestone_auto_import() {
    // Create a set of ``data-component`` values, to avoid duplication.
    const s = new Set(
        // All Runestone components have a ``data-component`` attribute.
        [...document.querySelectorAll("[data-component]")].map((element) =>
            element.getAttribute("data-component"),
        ),
    );
    // webwork questions are not wrapped in div with a data-component so we have to check a different way
    if (document.querySelector(".webwork-button")) {
        s.add("webwork");
    }

    // Load JS for each of the components found.
    const a = [...s].map((value) => {
        let z;
        console.log(`Loading Runestone component: ${value}`);
        try {
            z = (module_map[value] || (() => Promise.resolve()))();
        } catch (e) {
            console.error(`Error loading ${value}:`, e);
        }
        z.error = (msg) => console.error(`Error in ${value}:`, msg);
        return z;
    });

    // Send the Runestone login complete event when all JS is loaded and the pre-login is also complete.
    Promise.all([pre_login_complete_promise, ...a]).then(function () {
        if (!document.body.dataset.reactInUse) {
            document.dispatchEvent(new CustomEvent("runestone:login-complete"));
        }
    });
}

pre_login_complete_promise.then(() => {
    console.log("Runestone pre-login complete");
});

// Load component JS when the document is ready.
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runestone_auto_import);
} else {
    runestone_auto_import();
}

// Provide a function to import one specific `Runestone` component.
// the import function inside module_map is async -- runestone_import
// should be awaited when necessary to ensure the import completes
async function runestone_import(component_name) {
    if (module_map_cache[component_name]) {
        return module_map_cache[component_name];
    }
    console.log(
        `Runestone component ${component_name} is being queued for import`,
    );
    const promise = queueImport(component_name);
    module_map_cache[component_name] = promise;
    return promise;
}

async function popupScratchAC() {
    // load the activecode bundle
    await runestone_import("activecode");
    // scratchDiv will be defined if we have already created a scratch
    // activecode.  If its not defined then we need to get it ready to toggle
    if (!eBookConfig.scratchDiv) {
        window.ACFactory.createScratchActivecode();
        let divid = eBookConfig.scratchDiv;
        window.componentMap[divid] = ACFactory.createActiveCode(
            document.getElementById(divid),
            eBookConfig.acDefaultLanguage,
        );
        if (eBookConfig.isLoggedIn) {
            window.componentMap[divid].enableSaveLoad();
        }
    }
    setTimeout(() => {
        window.ACFactory.toggleScratchActivecode();
    }, 100);
}

// Set the directory containing this script as the `path <https://webpack.js.org/guides/public-path/#on-the-fly>`_ for all webpacked scripts.
const script_src = document.currentScript.src;
__webpack_require__.p = script_src.substring(
    0,
    script_src.lastIndexOf("/") + 1,
);

var splice = new _runestone_splice_js_spliceWrapper_ts__WEBPACK_IMPORTED_MODULE_11__.SpliceWrapper();
// The grading interface needs the singleton so it can register the iframes it
// is displaying; see SpliceWrapper.registerGraderFrame.
window.spliceWrapper = splice;

// Manual exports
// ==============
// Webpack's ``output.library`` setting doesn't seem to work with the split chunks plugin; do all exports manually through the ``window`` object instead.

const rc = {};
rc.runestone_import = runestone_import;
rc.runestone_auto_import = runestone_auto_import;
rc.getSwitch = _runestone_common_js_theme_js__WEBPACK_IMPORTED_MODULE_6__.getSwitch;
rc.switchTheme = _runestone_common_js_theme_js__WEBPACK_IMPORTED_MODULE_6__.switchTheme;
rc.popupScratchAC = popupScratchAC;
rc.renderOneComponent = _runestone_common_js_renderComponent_js__WEBPACK_IMPORTED_MODULE_9__.renderOneComponent;
window.componentMap = {};
window.runestoneComponents = rc;


/***/ }),

/***/ 83057:
/*!******************************************!*\
  !*** ./runestone/common/js/bookfuncs.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AD_DISMISSED_KEY: () => (/* binding */ AD_DISMISSED_KEY),
/* harmony export */   AD_DISMISS_MS: () => (/* binding */ AD_DISMISS_MS),
/* harmony export */   AD_LAST_PAGEVIEW_KEY: () => (/* binding */ AD_LAST_PAGEVIEW_KEY),
/* harmony export */   AD_VISIT_GAP_MS: () => (/* binding */ AD_VISIT_GAP_MS),
/* harmony export */   BANNER_COPY: () => (/* binding */ BANNER_COPY),
/* harmony export */   MIN_TERM_STUDENTS: () => (/* binding */ MIN_TERM_STUDENTS),
/* harmony export */   NON_CONTENT_PAGES: () => (/* binding */ NON_CONTENT_PAGES),
/* harmony export */   PageProgressBar: () => (/* binding */ PageProgressBar),
/* harmony export */   RS_CONSOLE_LOG_KEY: () => (/* binding */ RS_CONSOLE_LOG_KEY),
/* harmony export */   adRecentlyDismissed: () => (/* binding */ adRecentlyDismissed),
/* harmony export */   adVisitInProgress: () => (/* binding */ adVisitInProgress),
/* harmony export */   applyEbookConfigOverride: () => (/* binding */ applyEbookConfigOverride),
/* harmony export */   countActivitiesInPage: () => (/* binding */ countActivitiesInPage),
/* harmony export */   describeStudentCount: () => (/* binding */ describeStudentCount),
/* harmony export */   fetchTermStudents: () => (/* binding */ fetchTermStudents),
/* harmony export */   isCourseStarted: () => (/* binding */ isCourseStarted),
/* harmony export */   isNonContentPage: () => (/* binding */ isNonContentPage),
/* harmony export */   isSubchapterPage: () => (/* binding */ isSubchapterPage),
/* harmony export */   looksLikeLatexMath: () => (/* binding */ looksLikeLatexMath),
/* harmony export */   pageProgressTracker: () => (/* binding */ pageProgressTracker),
/* harmony export */   placeAdBanner: () => (/* binding */ placeAdBanner),
/* harmony export */   resolveBannerCopy: () => (/* binding */ resolveBannerCopy),
/* harmony export */   rsGetConsoleLog: () => (/* binding */ rsGetConsoleLog)
/* harmony export */ });
/* harmony import */ var _runestonebase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./runestonebase.js */ 78673);
/* harmony import */ var marked__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! marked */ 60023);
/**
 *
 * User: bmiller
 * Original: 2011-04-20
 * Date: 2019-06-14
 * Time: 2:01 PM
 * This change marks the beginning of version 4.0 of the runestone components
 * Login/logout is no longer handled through javascript but rather server side.
 * Many of the components depend on the runestone:login event so we will keep that
 * for now to keep the churn fairly minimal.
 */

/*

 Copyright (C) 2011  Brad Miller  bonelake@gmail.com

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.

 */




// ---------------------------------------------------------------------------
// Server-supplied eBookConfig values (issue #1392)
//
// A PreTeXt page served by a Runestone server sets ``ebook_config_override``
// right after the book template's own eBookConfig assignments.  The server is
// the authority for those values (course, user, activities, ...), so they win
// over whatever the template wrote.  This runs when the module is evaluated,
// before anything else reads eBookConfig.
// ---------------------------------------------------------------------------
function applyEbookConfigOverride() {
    const override = window.ebook_config_override;
    if (override && typeof override === "object") {
        window.eBookConfig = Object.assign(window.eBookConfig || {}, override);
    }
}
applyEbookConfigOverride();

var rb = new _runestonebase_js__WEBPACK_IMPORTED_MODULE_0__["default"]();

// ---------------------------------------------------------------------------
// Console capture for problem reports
//
// The browser gives page scripts no way to read what is already in the devtools
// console, so we buffer console output ourselves from the moment this module is
// evaluated.  The buffer is written through to sessionStorage (debounced, and
// again on pagehide) so the "Report a Problem" form can always read it back
// into a hidden field, letting recent log output and uncaught errors ride along
// with the report.  We can't rely on stashing it only when the Problem Report
// link is clicked: a beforeunload "Leave site?" prompt (e.g. from timed exams)
// can get in the way of that.
// ---------------------------------------------------------------------------
const RS_CONSOLE_LOG_KEY = "rs_console_log";
const RS_LOG_BUFFER_MAX = 200;
const RS_LOG_PERSIST_DELAY_MS = 500;
const rsConsoleBuffer = [];
let rsPersistTimer = null;

function rsPersistConsoleLog() {
    if (rsPersistTimer) {
        clearTimeout(rsPersistTimer);
        rsPersistTimer = null;
    }
    try {
        sessionStorage.setItem(RS_CONSOLE_LOG_KEY, rsGetConsoleLog());
    } catch (e) {
        // sessionStorage may be unavailable (e.g. private mode) or full; the
        // report form simply won't be prefilled with the log.
    }
}

function rsSchedulePersist() {
    if (!rsPersistTimer) {
        rsPersistTimer = setTimeout(
            rsPersistConsoleLog,
            RS_LOG_PERSIST_DELAY_MS,
        );
    }
}

function rsFormatLogArg(arg) {
    if (typeof arg === "string") return arg;
    if (arg instanceof Error) return `${arg.name}: ${arg.message}`;
    try {
        return JSON.stringify(arg);
    } catch (e) {
        return String(arg);
    }
}

function rsRecordLog(level, args) {
    try {
        const line = `[${level}] ${Array.from(args).map(rsFormatLogArg).join(" ")}`;
        rsConsoleBuffer.push(line);
        if (rsConsoleBuffer.length > RS_LOG_BUFFER_MAX) rsConsoleBuffer.shift();
        rsSchedulePersist();
    } catch (e) {
        // Never let log capture throw and break the page.
    }
}

(function installConsoleCapture() {
    if (window.__rsConsoleCaptureInstalled) return;
    window.__rsConsoleCaptureInstalled = true;
    for (const level of ["log", "info", "warn", "error"]) {
        const orig = console[level] ? console[level].bind(console) : null;
        console[level] = function (...args) {
            rsRecordLog(level, args);
            if (orig) orig(...args);
        };
    }
    // console.log() never sees uncaught errors or rejected promises, so listen
    // for those directly.
    window.addEventListener("error", (e) => {
        if (e.message) {
            rsRecordLog("uncaught", [
                `${e.message} @ ${e.filename || "?"}:${e.lineno || "?"}`,
            ]);
        }
    });
    window.addEventListener("unhandledrejection", (e) => {
        rsRecordLog("promise", [rsFormatLogArg(e.reason)]);
    });
    // Catch anything logged inside the debounce window before we navigate away.
    window.addEventListener("pagehide", rsPersistConsoleLog);
})();

/** Recent buffered console output, newest last, as a single string. */
function rsGetConsoleLog() {
    return rsConsoleBuffer.join("\n");
}

//
// Page decoration functions
//
/*
Maybe something like this at the top:

Active assignment: [Ch 15 reading]      [Exit assignment link]
On page (3 of 7) [Select input showing current page, can select others]
Becoming this if not on a page in assignment

Active assignment: [Ch 15 reading]      [Exit assignment link]
This page is not part of that assignment. Select a page to return to it:
[Select input]
*/
function addReadingList() {
    let assignment_info_string = localStorage.getItem(
        `currentAssignmentInfo_${eBookConfig.course}`,
    );

    if (assignment_info_string && eBookConfig.readings) {
        var top,
            bottom,
            active,
            page_name,
            exit_link,
            fst,
            snd,
            new_pos,
            path_parts,
            new_pos_link;
        var assignment_info = JSON.parse(assignment_info_string);
        let assignment_id = assignment_info.id;
        let assignment_name = assignment_info.name;
        let reading_names = assignment_info.readingNames;

        active = document.createElement("div");
        active.textContent = "Active assignment: ";

        page_name = document.createElement("a");
        page_name.textContent = assignment_name;
        page_name.href = `/assignment/student/doAssignment?assignment_id=${assignment_id}`;

        active.append(page_name);

        exit_link = document.createElement("a");
        exit_link.textContent = " Exit Assignment";
        exit_link.href = window.location.pathname;

        exit_link.addEventListener("click", function (event) {
            localStorage.removeItem(
                `currentAssignmentInfo_${eBookConfig.course}`,
            );
        });

        //active.append(exit_link)

        let cur_path_parts = window.location.pathname.split("/");
        let name =
            cur_path_parts[cur_path_parts.length - 2] +
            "/" +
            cur_path_parts[cur_path_parts.length - 1];
        // if body has pretext class, then strip the leading path parts from each of the strings in eBookConfig.readings
        let body = document.getElementsByTagName("body")[0];
        let ptxbook = false;
        let endLop = 2;
        if (body.classList.contains("pretext")) {
            ptxbook = true;
            eBookConfig.readings = eBookConfig.readings.map((r) =>
                r.split("/").pop(),
            );
            name = name.split("/").pop();
            endLop = 1;
        }

        let position = eBookConfig.readings.indexOf(name);
        let num_readings = eBookConfig.readings.length;
        // get prev name
        if (position > 0) {
            new_pos = eBookConfig.readings[position - 1];
            path_parts = cur_path_parts.slice(
                0,
                cur_path_parts.length - endLop,
            );
            path_parts.push(new_pos);
            new_pos_link = path_parts.join("/");
            fst = active.cloneNode(true);
            let txt = document.createElement("p");
            txt.textContent = `Page ${position + 1} of ${num_readings}, `;
            var fst_lnk = document.createElement("a");
            //fst_lnk.className = "btn btn-lg reading-navigation prev-reading";
            fst_lnk.href = new_pos_link;
            fst_lnk.textContent = `Back to page ${
                position
            } of ${num_readings}: ${reading_names[position - 1]}.`;
            txt.append(fst_lnk);
            fst.append(txt);
        } else if (position == 0) {
            fst = active.cloneNode(true);
            let txt = document.createElement("p");
            txt.textContent = `Page 1 of ${num_readings}.`;
            fst.append(txt);
        } else {
            // this isn't a reading page in the assignment, check to see if any
            // activities on this page are assigned to the current assignment
            let exerciseOnPage = false;
            let pageExercises = Object.keys(componentMap);
            if (pageExercises.length == 0) {
                pageExercises = document.querySelectorAll("[data-component]");
                pageExercises = Array.from(pageExercises).map(function (el) {
                    return el.id;
                });
            }
            for (let ex of pageExercises) {
                if (assignment_info.questions.includes(ex)) {
                    exerciseOnPage = true;
                    break;
                }
            }
            new_pos = eBookConfig.readings[0];
            path_parts = cur_path_parts.slice(
                0,
                cur_path_parts.length - endLop,
            );
            path_parts.push(new_pos);
            new_pos_link = path_parts.join("/");
            fst = active.cloneNode(true);
            let txt = document.createElement("p");
            if (exerciseOnPage) {
                txt.textContent =
                    "This page has activities assigned to the current assignment.";
            } else {
                txt.textContent =
                    "Notice: this page is not part of the assignment.";
            }
            txt.append(exit_link);
            fst.append(txt);
        }
        if (position == eBookConfig.readings.length - 1) {
            // no more readings
            snd = active;
            let txt = document.createElement("p");
            txt.textContent = `Page ${num_readings} of ${num_readings}: ${reading_names[position]}`;
            snd.append(txt);
        } else if (position >= 0) {
            // get next name
            new_pos = eBookConfig.readings[position + 1];
            path_parts = cur_path_parts.slice(
                0,
                cur_path_parts.length - endLop,
            );
            path_parts.push(new_pos);
            new_pos_link = path_parts.join("/");
            snd = active;
            var snd_lnk = document.createElement("a");
            //snd_lnk.className = "btn btn-lg reading-navigation next-reading";
            snd_lnk.href = new_pos_link;
            snd_lnk.textContent = `Continue to page ${
                position + 2
            } of ${num_readings}: ${reading_names[position + 1]}`;
            let txt = document.createElement("p");
            txt.append(snd_lnk);
            snd.append(txt);
        } else {
            snd = active.cloneNode(true);
            let txt = document.createElement("p");
            txt.textContent =
                "Notice: this page is not part of the assignment. To remove this warning click ";
            let exit_clone = exit_link.cloneNode(true);

            exit_clone.addEventListener("click", function (event) {
                localStorage.removeItem(
                    `currentAssignmentInfo_${eBookConfig.course}`,
                );
            });
            txt.append(exit_clone);
            snd.append(txt);
        }

        top = document.createElement("div");
        top.className = "ptx-runestone-container";
        fst.className = "runestone assignment-nav top-assignment-nav";
        //top.style.backgroundColor = "var(--componentBgColor)"
        //top.style.borderColor = "var(--componentBorderColor)"
        //top.style.borderWidth = "1px"
        top.append(fst);
        //top.append(snd);

        bottom = document.createElement("div");
        bottom.className = "ptx-runestone-container";
        snd.className = "runestone assignment-nav bottom-assignment-nav";
        //bottom.style.backgroundColor = "var(--componentBgColor)"
        //bottom.style.borderColor = "var(--componentBorderColor)"
        //bottom.style.borderWidth = "1px"

        //bottom.append(active.cloneNode(true));
        //bottom.append(fst.cloneNode(true));
        bottom.append(snd);

        // check the body tag to see if it has a pretext class (no jquery)
        if (ptxbook) {
            //append parts to the header and progress container
            let content = document.getElementById("ptx-content");
            if (content) {
                content.insertBefore(top, content.firstChild);
            }
            let pc = document.getElementById("scprogresscontainer");
            if (pc) {
                pc.style.marginBottom = "20px";
                pc.appendChild(bottom);
            }
            return;
        }
        const mainContent = document.getElementById("main-content");
        if (mainContent && snd) {
            mainContent.insertBefore(top, mainContent.firstChild);
            mainContent.appendChild(bottom);
        }
    }
}

/**
 * Build the activity dictionary for the progress bar by scanning the page.
 *
 * This is the fallback used when the server did not send activity counts --
 * i.e. when nobody is logged in and the page is being browsed.  The keys are
 * the div_ids that ``updateProgress`` increments, so they have to be the ids of
 * the elements carrying ``data-component``.  Those are not always the first
 * child of the ``.runestone`` wrapper: PreTeXt, for instance, emits an
 * ``exercise-statement`` div ahead of the component for multiple choice
 * questions.  Keying off the first child in that case gave every such question
 * on the page the same empty key, so eight exercises counted as one.
 *
 * @param {ParentNode} root - where to look; defaults to the whole document.
 * @returns {Object} activity ids mapped to 0, plus the ``page`` pseudo-activity.
 */
// Navigation and reference pages rather than content: they carry no activities,
// so they get no progress bar, no completion button and no highlighting. Keep
// this as the single list -- it used to be spelled out separately in
// user-highlights.js and the sphinx progress template, and the copies had
// drifted apart (genindex.html was missing here, which left a progress bar on
// the Book Index page).
const NON_CONTENT_PAGES = [
    "index.html",
    "genindex.html",
    "toctree.html",
    "toc.html",
    "navhelp.html",
    "assignments.html",
    "Exercises.html",
    "search.html",
];

function isCourseStarted() {
    let startDate = eBookConfig.termStartDate; // format is "2026-09-22"
    if (!startDate) {
        return false;
    }
    let today = new Date();
    let start = new Date(startDate);
    return today >= start;
}

function courseNotStartedMessage() {
    const formattedDate = new Date(
        eBookConfig.termStartDate,
    ).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    return (
        "Course has not started yet. Progress will be tracked starting on " +
        formattedDate
    );
}

/** True when pathname names one of the NON_CONTENT_PAGES. */
function isNonContentPage(pathname = window.location.pathname) {
    let page = pathname.split("/").pop().toLowerCase();
    return NON_CONTENT_PAGES.some((p) => p.toLowerCase() === page);
}

/**
 * True when pathname is a book page the server keeps reading progress for:
 * a subchapter. The interactives also load on assignment pages, and a
 * PreTeXt book's root, part, chapter, introduction and front matter pages
 * are not subchapters either; asking the progress endpoints about any of
 * them only earns a 422.
 */
function isSubchapterPage(
    pathname = window.location.pathname,
    activities = window.eBookConfig?.activities,
) {
    if (!pathname.includes("/books/published/") || isNonContentPage(pathname)) {
        return false;
    }
    // serve_page sends the chapter it found for the page, null when the page
    // is not a subchapter. Pages rendered by an older server don't send it.
    return (
        !(activities && "page_chapter" in activities) ||
        !!activities.page_chapter
    );
}

function countActivitiesInPage(root = document) {
    let activities = { page: 0 };
    root.querySelectorAll(".runestone").forEach(function (e, index) {
        // A component may be the wrapper itself or somewhere inside it. Nested
        // parts of a component (mchoice answers, feedback) also carry
        // data-component, but querySelector returns the outermost match first.
        let component = e.matches("[data-component]")
            ? e
            : e.querySelector("[data-component]");
        let id = component?.id || e.firstElementChild?.id;
        // Without an id we cannot match this activity to a completion event,
        // but it is still one activity: give it a key of its own so it is not
        // folded together with every other unidentified one on the page.
        activities[id || `unidentified-activity-${index}`] = 0;
    });
    return activities;
}

class PageProgressBar {
    constructor(actDict) {
        this.possible = 0;
        // The page itself counts as one item and is attempted as soon as it is
        // opened. That is what lets a page with no activities on it still be
        // completed.
        this.total = 1;
        // page_chapter rides along for isSubchapterPage; it is not an
        // activity. Copy rather than delete so that check still sees it.
        if (actDict && "page_chapter" in actDict) {
            actDict = { ...actDict };
            delete actDict.page_chapter;
        }
        if (actDict && "assignment_spec" in actDict) {
            this.assignment_spec = actDict.assignment_spec;
            delete actDict.assignment_spec;
        }
        if (actDict && Object.keys(actDict).length > 0) {
            this.activities = actDict;
        } else {
            this.activities = countActivitiesInPage();
        }
        // Both dicts are expected to carry a `page` entry for the page itself:
        // countActivitiesInPage() adds one, and the server sends the page's own
        // question row under that key. Older servers keyed that row by its
        // question name instead, which made the page look like an extra
        // activity; nothing we can do about that here, but keep the fallback so
        // a server that sends no page entry at all still lines up.
        if (!("page" in this.activities)) {
            this.activities.page = 1;
        }
        this.calculateProgress();
        // Hide the progress bar on navigation pages, which have no activities.
        if (isNonContentPage()) {
            const scprogresscontainer = document.getElementById(
                "scprogresscontainer",
            );
            if (scprogresscontainer) scprogresscontainer.style.display = "none";
        }
        this.renderProgress();
    }

    calculateProgress() {
        for (let k in this.activities) {
            if (k !== undefined) {
                this.possible++;
                if (this.activities[k] > 0) {
                    this.total++;
                }
            }
        }
    }

    get activitiesAttempted() {
        return Math.max(this.total, 0);
    }

    get activitiesPossible() {
        return Math.max(this.possible, 0);
    }

    renderProgress() {
        let value = 0;
        const scprogresstotal = document.getElementById("scprogresstotal");
        if (scprogresstotal)
            scprogresstotal.textContent = this.activitiesAttempted;
        const scprogressposs = document.getElementById("scprogressposs");
        if (scprogressposs)
            scprogressposs.textContent = this.activitiesPossible;
        try {
            value = (100 * this.total) / this.possible;
        } catch (e) {
            value = 0;
        }
        let progressText = document.getElementById("scprogress-activity-count");
        // Warn if course not started
        if (progressText && !isCourseStarted()) {
            progressText.appendChild(
                document.createTextNode(courseNotStartedMessage()),
            );
        }
        // Replace #subchapterprogress div with a native <progress> element if not already done
        let subchapterprogress = document.getElementById("subchapterprogress");
        if (subchapterprogress && subchapterprogress.tagName !== "PROGRESS") {
            // Replace the div with a <progress> element
            const progressElem = document.createElement("progress");
            progressElem.id = "subchapterprogress";
            progressElem.max = 100;
            progressElem.value = value;
            // Copy over any classes from the old div
            progressElem.className = subchapterprogress.className;
            subchapterprogress.replaceWith(progressElem);
            subchapterprogress = progressElem;
        } else if (subchapterprogress) {
            subchapterprogress.max = 100;
            subchapterprogress.value = value;
        }
        if (this.assignment_spec) {
            // If the user has completed all activities, send the reading score.
            // This handles the case where there are no activities on the page or
            //  where the user completed activities on the assignment page and now
            //  is viewing the reading page.
            // activities_required counts activities the reader completes, so
            // compare against activitiesAttempted rather than total -- total
            // includes the page itself, which used to send the reading score
            // one activity early.
            let completeActivities = this.activitiesAttempted;
            let requiredActivities = this.assignment_spec.activities_required;
            if (
                requiredActivities === null ||
                requiredActivities === undefined
            ) {
                // Nothing specific is required on this page, so opening it is
                // enough. Record how many activities are here for the check in
                // updateProgress().
                requiredActivities = 0;
                this.assignment_spec.activities_required =
                    this.activitiesPossible;
            }
            if (completeActivities >= requiredActivities) {
                this.sendCompletedReadingScore().then(() => {
                    console.log("Reading score sent for page");
                    // wait a tick then mark the page complete
                    // this is needed to let the progress bar update before marking complete
                    setTimeout(() => {
                        let cb = document.getElementById("completionButton");
                        if (
                            cb &&
                            cb.textContent.toLowerCase() === "mark as completed"
                        ) {
                            cb.click();
                        }
                    }, 500);
                });
            }
        }
        if (!eBookConfig.isLoggedIn) {
            const subchapterDiv = document.getElementById("subchapterprogress");
            if (subchapterDiv) subchapterDiv.classList.add("loggedout");
        }
    }

    updateProgress(div_id) {
        this.activities[div_id]++;
        // Only update the progress bar on the first interaction with an object.
        if (this.activities[div_id] === 1) {
            this.total++;
            let val = (100 * this.total) / this.possible;
            const scprogresstotal2 = document.getElementById("scprogresstotal");
            if (scprogresstotal2)
                scprogresstotal2.textContent = this.activitiesAttempted;
            const scprogressposs2 = document.getElementById("scprogressposs");
            if (scprogressposs2)
                scprogressposs2.textContent = this.activitiesPossible;
            let subchapterprogress2 =
                document.getElementById("subchapterprogress");
            if (
                subchapterprogress2 &&
                subchapterprogress2.tagName === "PROGRESS"
            ) {
                subchapterprogress2.value = val;
            }
            if (
                this.assignment_spec &&
                this.assignment_spec.activities_required !== null &&
                this.activitiesAttempted >=
                    this.assignment_spec.activities_required
            ) {
                console.log("Required activities completed");
                this.sendCompletedReadingScore().then(() => {
                    console.log("Reading score sent");
                });
            }
            if (
                val == 100.0 &&
                (function () {
                    const cb = document.getElementById("completionButton");
                    return (
                        cb &&
                        cb.textContent &&
                        cb.textContent.toLowerCase() === "mark as completed"
                    );
                })()
            ) {
                const cb = document.getElementById("completionButton");
                if (cb && typeof cb.click === "function") {
                    cb.click();
                }
            }
        }
    }

    async sendCompletedReadingScore() {
        let headers = new Headers({
            "Content-type": "application/json; charset=utf-8",
            Accept: "application/json",
        });
        let data = { ...this.assignment_spec };
        let request = new Request(
            `${eBookConfig.new_server_prefix}/logger/update_reading_score`,
            {
                method: "POST",
                body: JSON.stringify(data),
                headers: headers,
            },
        );
        try {
            let response = await fetch(request);
            if (!response.ok) {
                console.error(
                    `Failed to send reading score! ${response.statusText}`,
                );
            }
            data = await response.json();
        } catch (e) {
            console.error(`Error sending reading score ${e}`);
        }
    }
}

var pageProgressTracker = {};

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
}

let studyCluesConversationId = -1;

function appendStudyCluesMessage(messagesEl, role, text, isHtml = false) {
    const bubble = document.createElement("div");
    bubble.className = `studyclues-message ${role}`;
    if (isHtml) {
        bubble.innerHTML = text;
    } else {
        bubble.textContent = text;
    }
    messagesEl.appendChild(bubble);
    messagesEl.scrollTop = messagesEl.scrollHeight;
}

function createStudyCluesWidget() {
    if (document.getElementById("studyclues-fab")) {
        return;
    }

    const style = document.createElement("style");
    style.textContent = `
        #studyclues-fab {
            position: fixed;
            right: 24px;
            bottom: 24px;
            z-index: 9999;
            border: none;
            border-radius: 9999px;
            padding: 12px 18px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            color: #fff;
            background: #2563eb;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        }

        #studyclues-chat {
            position: fixed;
            right: 24px;
            bottom: 78px;
            z-index: 9999;
            width: min(420px, calc(100vw - 32px));
            height: min(520px, calc(100vh - 120px));
            background: #fff;
            border: 1px solid #d1d5db;
            border-radius: 12px;
            box-shadow: 0 14px 36px rgba(0, 0, 0, 0.25);
            display: none;
            flex-direction: column;
            overflow: hidden;
        }

        #studyclues-chat.open {
            display: flex;
        }

        .studyclues-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px 12px;
            border-bottom: 1px solid #e5e7eb;
            font-weight: 600;
            background: #f9fafb;
        }

        .studyclues-close {
            border: none;
            background: transparent;
            cursor: pointer;
            font-size: 16px;
            line-height: 1;
        }

        .studyclues-coach-toggle {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 12px;
            font-weight: 500;
            color: #4b5563;
        }

        .studyclues-coach-toggle input[type="checkbox"] {
            appearance: none;
            -webkit-appearance: none;
            width: 32px;
            height: 18px;
            border-radius: 9999px;
            background: #d1d5db;
            cursor: pointer;
            position: relative;
            transition: background 0.2s;
            flex-shrink: 0;
        }

        .studyclues-coach-toggle input[type="checkbox"]::after {
            content: "";
            position: absolute;
            top: 2px;
            left: 2px;
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: #fff;
            transition: transform 0.2s;
        }

        .studyclues-coach-toggle input[type="checkbox"]:checked {
            background: #2563eb;
        }

        .studyclues-coach-toggle input[type="checkbox"]:checked::after {
            transform: translateX(14px);
        }

        .studyclues-messages {
            flex: 1;
            overflow-y: auto;
            padding: 12px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            background: var(--background);
            color: var(--bodyFont);
        }

        .studyclues-message {
            max-width: 85%;
            padding: 10px 12px;
            border-radius: 10px;
            white-space: pre-wrap;
            word-break: break-word;
            font-size: 14px;
            line-height: 1.4;
        }

        .studyclues-message.user {
            margin-left: auto;
            background: var(--componentBgColor);
            border: 1px solid #bfdbfe;
            color: var(--bodyFont);
        }

        .studyclues-message.assistant {
            margin-right: auto;
            background: var(--background);
            border: 1px solid var(--grayToWhite);
            color: var(--bodyFont);
        }

        .studyclues-message.studyclues-loading {
            color: var(--bodyFont);
            font-style: italic;
        }

        .studyclues-spinner {
            display: inline-flex;
            align-items: center;
            gap: 4px;
        }

        .studyclues-spinner-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #6b7280;
            opacity: 0.35;
            animation: studyclues-dot-pulse 1s infinite ease-in-out;
        }

        .studyclues-spinner-dot:nth-child(2) {
            animation-delay: 0.15s;
        }

        .studyclues-spinner-dot:nth-child(3) {
            animation-delay: 0.3s;
        }

        @keyframes studyclues-dot-pulse {
            0%,
            80%,
            100% {
                opacity: 0.35;
                transform: scale(1);
            }
            40% {
                opacity: 1;
                transform: scale(1.2);
            }
        }

        .studyclues-inputbar {
            display: flex;
            gap: 8px;
            padding: 10px;
            border-top: 1px solid #e5e7eb;
            background: #fff;
        }

        .studyclues-inputbar input {
            flex: 1;
            min-width: 0;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            padding: 8px 10px;
            font-size: 14px;
        }

        .studyclues-inputbar button {
            border: none;
            border-radius: 8px;
            padding: 8px 12px;
            cursor: pointer;
            color: #fff;
            background: #2563eb;
            font-weight: 600;
        }
    `;
    document.head.appendChild(style);

    const button = document.createElement("button");
    button.id = "studyclues-fab";
    button.textContent = "StudyClues Chat";

    const chat = document.createElement("div");
    chat.id = "studyclues-chat";
    chat.innerHTML = `
        <div class="studyclues-header">
            <span>StudyClues</span>
            <label class="studyclues-coach-toggle">
                <input type="checkbox" id="studyclues-coach-mode" checked />
                Coach Mode
            </label>
            <button class="studyclues-close" aria-label="Close chat">✕</button>
        </div>
        <div class="studyclues-messages"></div>
        <div class="studyclues-inputbar">
            <input type="text" placeholder="Ask a question about this course..." />
            <button type="button">Send</button>
        </div>
    `;

    document.body.appendChild(button);
    document.body.appendChild(chat);

    const closeBtn = chat.querySelector(".studyclues-close");
    const messagesEl = chat.querySelector(".studyclues-messages");
    const inputEl = chat.querySelector(".studyclues-inputbar input");
    const sendBtn = chat.querySelector(".studyclues-inputbar button");
    const coachToggle = chat.querySelector("#studyclues-coach-mode");

    let coachMode = coachToggle.checked;
    coachToggle.addEventListener("change", () => {
        coachMode = coachToggle.checked;
    });

    const toggleChat = () => {
        chat.classList.toggle("open");
        if (chat.classList.contains("open")) {
            inputEl.focus();
        }
    };

    const sendMessage = async () => {
        let query = inputEl.value.trim();
        if (!query) {
            return;
        }
        var sectionInfo = "";
        // find the section title on the page to include in the initial query
        if (
            document.querySelector("body.pretext") &&
            document.querySelector("section.section")
        ) {
            let section = document.querySelector("section.section");
            let sectionTitle = section.querySelector("span.title").innerText;
            let sectionNumber =
                section.querySelector("span.codenumber").innerText;
            sectionInfo = `${sectionNumber} ${sectionTitle}`;
        } else {
            let sectionSpan = document.querySelector("span.section-number");
            if (sectionSpan) {
                sectionInfo = sectionSpan.parentElement.innerText.trim();
            }
        }
        if (studyCluesConversationId === -1) {
            if (sectionInfo) {
                query = `Regarding section "${sectionInfo}": ${query}`;
            }
        }
        rb.logBookEvent({
            event: "studyclues_query",
            act: `query: ${query}`,
            div_id: `${sectionInfo}`,
        });
        appendStudyCluesMessage(messagesEl, "user", query); // todo: make this conditional on being a book page and on the book being one of the supported books
        inputEl.value = "";
        sendBtn.disabled = true;

        const loadingBubble = document.createElement("div");
        loadingBubble.className =
            "studyclues-message assistant studyclues-loading";
        loadingBubble.innerHTML =
            'Thinking <span class="studyclues-spinner"><span class="studyclues-spinner-dot"></span><span class="studyclues-spinner-dot"></span><span class="studyclues-spinner-dot"></span></span>';
        messagesEl.appendChild(loadingBubble);
        messagesEl.scrollTop = messagesEl.scrollHeight;

        try {
            const response = await fetch(
                `/assignment/student/studyclues_query`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    body: JSON.stringify({
                        query,
                        conversation_id: studyCluesConversationId,
                        coachMode,
                    }),
                },
            );

            if (!response.ok) {
                throw new Error(
                    `Request failed with status ${response.status}`,
                );
            }

            const payload = await response.json();
            const detail = payload?.detail || {};
            const studycluesResponse = detail?.response || {};
            const llmResponse = studycluesResponse?.llm_response;
            const references = studycluesResponse?.references || {};

            if (typeof detail.conversation_id === "number") {
                studyCluesConversationId = detail.conversation_id;
            }

            const markdownResponse = (
                llmResponse || "No response available from StudyClues."
            ).replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, key) => {
                const url = references[key]?.content_url;
                return url ? `[${text}](${url})` : match;
            });
            const formattedResponse = marked__WEBPACK_IMPORTED_MODULE_1__.marked.parse(markdownResponse);
            // add a target="_blank" to all links in the formatted response
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = formattedResponse;
            tempDiv.querySelectorAll("a").forEach((a) => {
                a.setAttribute("target", "_blank");
            });
            const finalFormattedResponse = tempDiv.innerHTML;
            appendStudyCluesMessage(
                messagesEl,
                "assistant",
                finalFormattedResponse,
                true,
            );
            rb.logBookEvent({
                event: "studyclues_response",
                act: `coach:${coachMode}:response:${markdownResponse.substring(0, 512)}`,
                div_id: `${sectionInfo}`,
            });
        } catch (err) {
            appendStudyCluesMessage(
                messagesEl,
                "assistant",
                "Sorry, StudyClues is unavailable right now. Please try again.",
            );
            console.error("StudyClues chat error:", err);
        } finally {
            loadingBubble.remove();
            sendBtn.disabled = false;
            inputEl.focus();
        }
    };

    button.addEventListener("click", toggleChat);
    closeBtn.addEventListener("click", toggleChat);
    sendBtn.addEventListener("click", sendMessage);
    inputEl.addEventListener("keydown", (evt) => {
        if (evt.key === "Enter") {
            evt.preventDefault();
            sendMessage();
        }
    });
}

function shouldShowStudyCluesWidget() {
    if (!(
        location.pathname.includes("/ns/books/") ||
        location.pathname.includes("doAssignment")
    )) {
        return false;
    }

    return eBookConfig.course_attrs?.studyClues === "True";
}

async function handlePageSetup() {
    var mess;
    if (eBookConfig.useRunestoneServices) {
        let headers = new Headers({
            "Content-type": "application/json; charset=utf-8",
            Accept: "application/json",
        });
        let data = {
            timezoneoffset: new Date().getTimezoneOffset() / 60,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        };
        let RS_info = getCookie("RS_info");
        var tz_match = false;
        if (RS_info) {
            try {
                let cleaned = RS_info.replace(/\\054/g, ","); // handle octal comma encoding
                let info = JSON.parse(decodeURIComponent(cleaned));
                info = JSON.parse(decodeURIComponent(info));
                if (
                    info.timezone === data.timezone &&
                    info.tz_offset === data.timezoneoffset
                ) {
                    console.log(
                        "Timezone cookie matches, not sending timezone to server",
                    );
                    tz_match = true;
                }
            } catch (e) {
                console.error(
                    "Error parsing RS_info cookie, sending timezone to server",
                );
            }
        }
        if (tz_match === false) {
            // Set a cookie so we don't have to do this again for a while.
            let request = new Request(
                `${eBookConfig.new_server_prefix}/logger/set_tz_offset`,
                {
                    method: "POST",
                    body: JSON.stringify(data),
                    headers: headers,
                },
            );
            try {
                let response = await fetch(request);
                if (!response.ok) {
                    console.error(
                        `Failed to set timezone! ${response.statusText}`,
                    );
                }
                data = await response.json();
            } catch (e) {
                console.error(`Error setting timezone ${e}`);
            }
        }
    }

    // PTX generated pages may have stale HTML. Forcibly re-render the content
    // of the progress container. Any logic that modifies the progress container
    // should be done after this point, or it will be overwritten.
    const scprogresscontainer = document.getElementById("scprogresscontainer");
    if (scprogresscontainer)
        scprogresscontainer.innerHTML = `
            <div id="scprogress-activity-count">
                You have attempted <span id="scprogresstotal"></span> of
                <span id="scprogressposs"></span> activities on this page.
            </div>
            <div id="subchapterprogress" aria-label="Page progress"></div>
        `;

    console.log(`This page served by ${eBookConfig.served_by}`);
    if (eBookConfig.isLoggedIn) {
        mess = `username: ${eBookConfig.username}`;
        if (!eBookConfig.isInstructor) {
            const ipDropdown = document.getElementById("ip_dropdown_link");
            if (ipDropdown && typeof ipDropdown.remove === "function") {
                ipDropdown.remove();
            }
            const instPeer = document.getElementById("inst_peer_link");
            if (instPeer && typeof instPeer.remove === "function") {
                instPeer.remove();
            }
        }
        document.dispatchEvent(new Event("runestone:login"));

        addReadingList();

        // Warn if the course has not started yet
        if (!isCourseStarted()) {
            const ptxContent = document.getElementById("ptx-content");
            if (ptxContent) {
                const warningContainer = document.createElement("div");
                warningContainer.className = "ptx-runestone-container";
                const warningDiv = document.createElement("div");
                warningDiv.className =
                    "course-not-started-warning alert alert-danger";
                warningDiv.textContent = courseNotStartedMessage();
                warningContainer.appendChild(warningDiv);
                ptxContent.insertBefore(
                    warningContainer,
                    ptxContent.firstChild,
                );
            }
        }

        // Only show the StudyClues widget on book/assignment pages for courses with the studyClues attribute set.
        if (shouldShowStudyCluesWidget()) {
            createStudyCluesWidget();
        }
    } else {
        mess = "Not logged in";
        document.dispatchEvent(new Event("runestone:logout"));
        let bw = document.getElementById("browsing_warning");
        if (bw) {
            bw.innerHTML =
                "<p class='navbar_message'>Saving and Logging are Disabled</p>";
        }
        let aw = document.getElementById("ad_warning");
        if (aw) {
            aw.innerHTML =
                "<p class='navbar_message'>🚫 Log-in to Remove <a href='/admin/legal/ads'>Ads!</a> 🚫 &nbsp;</p>";
        }
    }
    document.querySelectorAll(".loggedinuser").forEach((el) => {
        el.innerHTML = mess;
    });

    pageProgressTracker = new PageProgressBar(eBookConfig.activities);
    notifyRunestoneComponents();
}

function setupNavbarLoggedIn() {
    const profileLink = document.getElementById("profilelink");
    if (profileLink) profileLink.style.removeProperty("display");
    const passwordLink = document.getElementById("passwordlink");
    if (passwordLink) passwordLink.style.removeProperty("display");
    const registerLink = document.getElementById("registerlink");
    if (registerLink) registerLink.style.display = "none";
    document.querySelectorAll("li.loginout").forEach((el) => {
        el.innerHTML = '<a href="/admin/auth/logout">Log Out</a>';
    });
}
document.addEventListener("runestone:login", setupNavbarLoggedIn);

function setupNavbarLoggedOut() {
    if (eBookConfig.useRunestoneServices) {
        console.log("setup navbar for logged out");
        const registerLink = document.getElementById("registerlink");
        if (registerLink) registerLink.style.removeProperty("display");
        const profileLink = document.getElementById("profilelink");
        if (profileLink) profileLink.style.display = "none";
        const passwordLink = document.getElementById("passwordlink");
        if (passwordLink) passwordLink.style.display = "none";
        const ipDropdown = document.getElementById("ip_dropdown_link");
        if (ipDropdown) ipDropdown.style.display = "none";
        const instPeer = document.getElementById("inst_peer_link");
        if (instPeer) instPeer.style.display = "none";
        document.querySelectorAll("li.loginout").forEach((el) => {
            el.innerHTML =
                '<a href="' +
                eBookConfig.app +
                '/default/user/login">Login</a>';
        });
        document.querySelectorAll(".footer").forEach((el) => {
            el.innerHTML = "user not logged in";
        });
    }
}
document.addEventListener("runestone:logout", setupNavbarLoggedOut);

function notifyRunestoneComponents() {
    // Runestone components wait until login process is over to load components because of storage issues. This triggers the `dynamic import machinery`, which then sends the login complete signal when this and all dynamic imports are finished.
    console.log("triggering runestone:pre-login-complete");
    document.dispatchEvent(new Event("runestone:pre-login-complete"));
}

// The original two appeals, still used for the inline ad (pages with no PreTeXt
// masthead or navbar). Sphinx books carry the same copy in their own layout
// template as ``ad=1`` and ``ad=2``.
const LEGACY_AD_COPY = [
    "Runestone Academy can only continue if we get support from individuals like you. As a student you are well aware of the high cost of textbooks.  Our mission is to provide great books to you for free, but we ask that you consider a $10 donation, more if you can or less if $10 is a burden.",
    "Making great stuff takes time and $$.  If you appreciate the book you are reading now and want to keep quality materials free for other students please consider a donation to Runestone Academy. We ask that you consider a $10 donation, but if you can give more thats great, if $10 is too much for your budget we would be happy with whatever you can afford as a show of support.",
];

// The PreTeXt banner rotates between these at random. Each has its own ``ad``
// number, starting after the legacy ones, so donate-page visits in the access
// logs can be credited to the copy that sent them. The term-students appeal
// needs a live count from the book server; ``headline`` is a function of it.
const BANNER_COPY = [
    {
        ad: 3,
        headline: "This book is free, and we want to keep it that way.",
        body: "Runestone Academy is a 501(c)(3) nonprofit supported by readers like you. If this book is helping you, a $10 gift keeps it free for the next student.",
        button: "Donate $10",
    },
    {
        ad: 4,
        needsTermStudents: true,
        headline: ({ count, since }) =>
            `${describeStudentCount(count)} students have started using Runestone books since ${since}.`,
        body: "We don't charge for them, and we never will. If Runestone is helping you, a tax-deductible gift helps keep it that way.",
        button: "Chip in",
    },
    {
        ad: 5,
        headline: "Free textbooks aren't free to make.",
        body: "If this book is helping you, please consider a tax-deductible $10 gift to Runestone Academy. Any amount helps.",
        button: "Donate",
    },
];

// Early in a term (and on a dev server) the count is too small to impress, so
// the banner uses one of the other appeals instead.
const MIN_TERM_STUDENTS = 1000;

/**
 * Round down to two significant figures so the banner reads "More than
 * 48,000" rather than a suspiciously precise 48,213, and never overstates.
 */
function describeStudentCount(count) {
    const magnitude = 10 ** Math.max(0, Math.floor(Math.log10(count)) - 1);
    const rounded = Math.floor(count / magnitude) * magnitude;
    const shown = rounded.toLocaleString("en-US");
    return rounded < count ? `More than ${shown}` : shown;
}

/**
 * Fetch the number of students who joined since the term began, formatted for
 * the headline, or null when it is unavailable or too small to use.
 */
async function fetchTermStudents() {
    try {
        const response = await fetch(
            `${eBookConfig.new_server_prefix}/books/term_students`,
        );
        if (!response.ok) {
            return null;
        }
        const { count, since } = await response.json();
        if (!(count >= MIN_TERM_STUDENTS) || !since) {
            return null;
        }
        // ``since`` is a bare date; format it in UTC so a reader west of
        // Greenwich does not see "July 31" for August 1.
        const sinceText = new Date(`${since}T00:00:00Z`).toLocaleDateString(
            "en-US",
            { month: "long", day: "numeric", timeZone: "UTC" },
        );
        return { count, since: sinceText };
    } catch (e) {
        console.error("Failed to fetch term students:", e);
        return null;
    }
}

/**
 * Resolve ``BANNER_COPY[index]`` to plain strings. If the term-students appeal
 * cannot get its count, fall back to the next appeal that needs nothing.
 */
async function resolveBannerCopy(index) {
    const copy = BANNER_COPY[index];
    if (!copy.needsTermStudents) {
        return copy;
    }
    const stats = await fetchTermStudents();
    if (stats) {
        return { ...copy, headline: copy.headline(stats) };
    }
    return BANNER_COPY[(index + 1) % BANNER_COPY.length];
}

// When a reader closes the PreTeXt top-of-page banner we leave them alone for
// two days, on every book, by remembering when they did it.
const AD_DISMISSED_KEY = "rs_ad_dismissed_at";
const AD_DISMISS_MS = 48 * 60 * 60 * 1000;

function adRecentlyDismissed(now = Date.now()) {
    let dismissedAt;
    try {
        dismissedAt = Number(localStorage.getItem(AD_DISMISSED_KEY));
    } catch (e) {
        return false;
    }
    // A timestamp from the future (the clock was moved back) must not
    // silence the banner for however long that gap is.
    return (
        dismissedAt > 0 &&
        dismissedAt <= now &&
        now - dismissedAt < AD_DISMISS_MS
    );
}

// Even undismissed, the banner appears only on the first page of a visit, not
// on every page a student loads while working through a chapter. A visit ends
// after 30 minutes without a page view (the usual analytics definition); the
// clock lives in localStorage rather than sessionStorage so that opening a
// chapter in a new tab does not count as a new visit.
const AD_LAST_PAGEVIEW_KEY = "rs_ad_last_pageview";
const AD_VISIT_GAP_MS = 30 * 60 * 1000;

/**
 * Record this page view and report whether it continues a visit already under
 * way. Every page view extends the visit, including ones where the banner was
 * held back for a dismissal, so a dismissal that expires mid-visit waits for
 * the next visit instead of popping up between pages.
 */
function adVisitInProgress(now = Date.now()) {
    let lastPageview;
    try {
        lastPageview = Number(localStorage.getItem(AD_LAST_PAGEVIEW_KEY));
        localStorage.setItem(AD_LAST_PAGEVIEW_KEY, String(now));
    } catch (e) {
        return false;
    }
    return (
        lastPageview > 0 &&
        lastPageview <= now &&
        now - lastPageview < AD_VISIT_GAP_MS
    );
}

function dismissAd(banner) {
    try {
        localStorage.setItem(AD_DISMISSED_KEY, String(Date.now()));
    } catch (e) {
        // Storage blocked: the banner still closes, it just comes back on
        // the next page.
    }
    banner.remove();
}

function shouldShowAd() {
    return (
        (typeof showAd !== "undefined" && showAd) ||
        eBookConfig.course_attrs?.showAd
    );
}

/**
 * PreTeXt books get a dismissible banner across the top of the page, above the
 * masthead and navbar, instead of an ad dropped into the middle of the
 * reading. Authors objected to the interruption.
 */
async function placeAdBanner(
    topOfPage,
    index = Math.floor(Math.random() * BANNER_COPY.length),
) {
    if (document.getElementById("rs-ad-banner")) {
        return null;
    }
    // Always record the page view, even when a dismissal is holding the
    // banner back, so the visit clock stays current.
    const continuingVisit = adVisitInProgress();
    if (continuingVisit || adRecentlyDismissed()) {
        return null;
    }
    const copy = await resolveBannerCopy(index);
    // Another call may have placed a banner while we waited on the count.
    if (document.getElementById("rs-ad-banner")) {
        return null;
    }
    const banner = document.createElement("aside");
    banner.id = "rs-ad-banner";
    banner.className = "adbanner";
    banner.setAttribute("aria-label", "Support Runestone Academy");
    banner.innerHTML = `
        <div class="adbanner-text">
            <strong>${copy.headline}</strong>
            <p>${copy.body}</p>
        </div>
        <div class="adbanner-donate">
            <a href="/admin/auth/donate?ad=${copy.ad}">${copy.button}</a>
        </div>
        <button type="button" class="adbanner-close"
            aria-label="Dismiss for 48 hours" title="Dismiss for 48 hours">&times;</button>`;
    banner
        .querySelector(".adbanner-close")
        .addEventListener("click", () => dismissAd(banner));
    topOfPage.before(banner);
    return banner;
}

// Sphinx books (and any page without a PreTeXt masthead or navbar) keep the
// old behavior: the appeal appears after a randomly chosen component.
function placeInlineAd() {
    let adNum = Math.floor(Math.random() * LEGACY_AD_COPY.length) + 1;
    let adTemplate = LEGACY_AD_COPY.map(
        (text, i) => `
         <aside id="adcopy_${i + 1}" class="adcopy" style="display: none;">
           <strong>Before you keep reading...</strong>
           <p>${text}
           </p>
           <div class="donate${"ab"[i]}">
           <a href="/admin/auth/donate?ad=${i + 1}">Support Runestone Academy Today</a>
           </div>
         </aside>`,
    ).join("");
    if (!document.getElementById("adcopy_1")) {
        document.body.insertAdjacentHTML("beforeend", adTemplate);
    }
    let adBlock = document.getElementById(`adcopy_${adNum}`);
    let rsElements = document.querySelectorAll(".runestone");
    if (rsElements.length > 0) {
        let randomIndex = Math.floor(Math.random() * rsElements.length);
        rsElements[randomIndex].after(adBlock);
        // find the a tag within the ad block and change the href from /runestone/default/donate to /admin/auth/donate
        const aTag = adBlock.querySelector("a");
        if (aTag && aTag.href.includes("/runestone/default/donate")) {
            aTag.href = aTag.href.replace(
                "/runestone/default/donate",
                "/admin/auth/donate",
            );
        }
        adBlock.style.display = "block";
    }
}

function placeAdCopy() {
    if (!shouldShowAd()) {
        return;
    }
    let topOfPage =
        document.getElementById("ptx-masthead") ||
        document.getElementById("ptx-navbar");
    if (topOfPage) {
        placeAdBanner(topOfPage);
    } else {
        placeInlineAd();
    }
}

// initialize stuff
document.addEventListener("DOMContentLoaded", function () {
    if (eBookConfig) {
        handlePageSetup();
        placeAdCopy();
    } else {
        if (typeof eBookConfig === "undefined") {
            console.log(
                "eBookConfig is not defined.  This page must not be set up for Runestone",
            );
        }
    }
});

// misc stuff
// todo:  This could be further distributed but making a video.js file just for one function seems dumb.
window.addEventListener("load", function () {
    // add the video play button overlay image
    document.querySelectorAll(".video-play-overlay").forEach(function (el) {
        el.style.backgroundImage =
            "url('{{pathto('_static/play_overlay_icon.png', 1)}}')";
    });

    // This function is needed to allow the dropdown search bar to work;
    // The default behaviour is that the dropdown menu closes when something in
    // it (like the search bar) is clicked
    document
        .querySelectorAll(".dropdown input, .dropdown label")
        .forEach(function (el) {
            el.addEventListener("click", function (e) {
                e.stopPropagation();
            });
        });

    // re-write some urls
    // This is tricker than it looks and you have to obey the rules for # anchors
    // The #anchors must come after the query string as the server basically ignores any part
    // of a url that comes after # - like a comment...
    if (location.href.includes("mode=browsing")) {
        let queryString = "?mode=browsing";
        document.querySelectorAll("a").forEach((link) => {
            let anchorText = "";
            if (
                link.href.includes("books/published") &&
                !link.href.includes("?mode=browsing")
            ) {
                if (link.href.includes("#")) {
                    let aPoint = link.href.indexOf("#");
                    anchorText = link.href.substring(aPoint);
                    link.href = link.href.substring(0, aPoint);
                }
                link.href = link.href.includes("?")
                    ? link.href + queryString.replace("?", "&") + anchorText
                    : link.href + queryString + anchorText;
            }
        });
    }
});

// The Bust Menu
/*
Course Home
Assignments
Progress
Peer Instruction (Student)
------
Instructor Dashboard
Peer Instruction (Instructor)
Author Interface (optional)
Editor Interface (optional)
Request Invoice
------
Change Course
Profile
Log Out
*/
window.addEventListener("DOMContentLoaded", function (event) {
    const oldDropDown = this.document.querySelector(
        ".dropdown-content[data-deprecated]",
    );
    if (oldDropDown) oldDropDown.remove();

    const itemTemplate = this.document.getElementById(
        "ptx-user-dropdown-content_item-template",
    );
    const sepTemplate = this.document.getElementById(
        "ptx-user-dropdown-content_separator-template",
    );
    const menuContentArea = this.document.getElementById(
        "ptx-user-dropdown_rs-content",
    );

    if (!itemTemplate || !sepTemplate || !menuContentArea) {
        console.warn("Missing template or content area for user dropdown");
        return;
    }

    function makeLink(url, title, icon = null, ariaLabel = null) {
        // All we should assume about the item template is that it has an anchor element
        const link = itemTemplate.content.cloneNode(true);
        const linkAnchor = link.querySelector("a");
        if (url) {
            linkAnchor.href = url;
        }
        linkAnchor.innerText = "";
        const contentSpan = document.createElement("span");
        contentSpan.style.display = "inline-flex";
        contentSpan.style.alignItems = "center";
        contentSpan.style.gap = "0.35rem";
        const iconElement = document.createElement("span");
        iconElement.setAttribute("aria-hidden", "true");
        iconElement.className = "material-symbols-outlined";
        iconElement.style.display = "inline-flex";
        iconElement.style.alignItems = "center";
        iconElement.style.justifyContent = "center";
        iconElement.style.width = "1.25em";
        iconElement.style.minWidth = "1.25em";
        if (icon) {
            iconElement.innerText = icon;
        } else {
            iconElement.style.visibility = "hidden";
            iconElement.innerText = "home";
        }
        contentSpan.appendChild(iconElement);
        let linkTitle = document.createElement("span");
        linkTitle.innerText = title;
        contentSpan.appendChild(linkTitle);
        linkAnchor.appendChild(contentSpan);
        if (ariaLabel) {
            linkAnchor.ariaLabel = ariaLabel;
        }
        if (!url) {
            const info = document.createElement("span");
            info.className = linkAnchor.className;
            if (title.length > 30) {
                info.innerText = title.slice(0, 12) + "..." + title.slice(-15);
                // add hover to show full title
                info.title = title;
                info.style.cursor = "help";
            } else {
                info.innerText = title;
            }
            info.style.display = "flex";
            info.style.justifyContent = "center";
            info.style.alignItems = "center";
            linkAnchor.replaceWith(info);
        }
        // return entire item template, not just link
        return link;
    }
    // limit length of eBookConfig.course to 30 characters to prevent overly long course names in the menu but preserve the last 15 characters
    menuContentArea.appendChild(makeLink(null, eBookConfig.course));
    menuContentArea.appendChild(sepTemplate.content.cloneNode(true));

    menuContentArea.appendChild(
        makeLink("/ns/course/index", "Course Home", "home"),
    );
    menuContentArea.appendChild(
        makeLink("/assignment/student/chooseAssignment", "Assignments", "edit"),
    );
    menuContentArea.appendChild(
        makeLink(
            "/assignment/peer/student",
            "Peer Instruction (Student)",
            "groups_3",
        ),
    );
    menuContentArea.appendChild(
        makeLink("/assignment/student/studentreport", "Progress"),
    );
    if (eBookConfig.isInstructor) {
        menuContentArea.appendChild(sepTemplate.content.cloneNode(true));
        menuContentArea.appendChild(
            makeLink(
                "/admin/instructor/menu",
                "Instructor Dashboard",
                "settings",
            ),
        );
        menuContentArea.appendChild(
            makeLink(
                "/assignment/peer/instructor",
                "Peer Instruction (Instructor)",
                "groups_3",
            ),
        );
        // On runestone.academy the author server is its own host, so this has to
        // be absolute. Single-proxy deployments set authorServerUrl to /author.
        let authorUrl =
            (eBookConfig.authorServerUrl ||
                "https://author.runestone.academy/author") + "/";
        let editorUrl =
            eBookConfig.editorServerUrl || "/admin/editor/manage_exercises";

        if (eBookConfig.isAuthor) {
            menuContentArea.appendChild(
                makeLink(authorUrl, "Author Dashboard"),
            );
        }
        if (eBookConfig.isEditor) {
            menuContentArea.appendChild(
                makeLink(editorUrl, "Editor Dashboard"),
            );
        }
        menuContentArea.appendChild(
            makeLink(
                "/assignment/instructor/invoice_request",
                "Request Invoice",
            ),
        );
    }
    menuContentArea.appendChild(sepTemplate.content.cloneNode(true));
    menuContentArea.appendChild(
        makeLink("/admin/auth/my_courses", "Change Course", "newsstand"),
    );
    menuContentArea.appendChild(makeLink("/admin/auth/profile", "Profile"));
    menuContentArea.appendChild(makeLink("/admin/auth/logout", "Log Out"));
    menuContentArea.appendChild(sepTemplate.content.cloneNode(true));
    const problemReportLink = makeLink(
        "/admin/problem/report",
        "Problem Report",
        "bug_report",
    );
    // The log is already persisted continuously; flush now so nothing in the
    // debounce window is lost.
    const problemReportAnchor = problemReportLink.querySelector("a");
    if (problemReportAnchor) {
        problemReportAnchor.addEventListener("click", rsPersistConsoleLog);
    }
    menuContentArea.appendChild(problemReportLink);
});

/**
 * Returns true if the string appears to contain LaTeX math.
 */
function looksLikeLatexMath(text) {
    if (typeof text !== "string") return false;

    // Common LaTeX math delimiters
    const mathDelimiters = [
        /\$\$[\s\S]+?\$\$/, // $$ ... $$
        /\$[^$\n]+?\$/, // $ ... $
        /\\\[[\s\S]+?\\\]/, // \[ ... \]
        /\\\([\s\S]+?\\\)/, // \( ... \)
    ];

    // Common math commands (avoid generic \text or \ref-only cases)
    const mathCommands =
        /\\(frac|sqrt|sum|prod|int|lim|sin|cos|tan|log|ln|alpha|beta|gamma|pi|theta|sigma|Delta|cdot|times|leq|geq|neq)\b/;

    // Superscripts/subscripts like x^2 or a_i
    const superSubScript = /[a-zA-Z0-9]\s*[\^_]\s*\{?.+?\}?/;

    return (
        mathDelimiters.some((re) => re.test(text)) ||
        mathCommands.test(text) ||
        superSubScript.test(text)
    );
}


/***/ }),

/***/ 94564:
/*!**************************************!*\
  !*** ./runestone/common/js/theme.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getSwitch: () => (/* binding */ getSwitch),
/* harmony export */   switchTheme: () => (/* binding */ switchTheme)
/* harmony export */ });
function getSwitch() {
    const toggleSwitch = document.querySelector(
        '.theme-switch input[type="checkbox"]',
    );
    const currentTheme = localStorage.getItem("theme")
        ? localStorage.getItem("theme")
        : null;

    if (currentTheme) {
        document.documentElement.setAttribute("data-theme", currentTheme);

        if (currentTheme === "dark") {
            toggleSwitch.checked = true;
        }
    }
}

function switchTheme() {
    var checkBox = document.getElementById("checkbox");
    if (checkBox.checked == true) {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark"); //add this
    } else {
        document.documentElement.setAttribute("data-theme", "light");
        localStorage.setItem("theme", "light"); //add this
    }
}


/***/ }),

/***/ 98098:
/*!************************************************!*\
  !*** ./runestone/common/js/renderComponent.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createTimedComponent: () => (/* binding */ createTimedComponent),
/* harmony export */   renderOneComponent: () => (/* binding */ renderOneComponent),
/* harmony export */   renderRunestoneComponent: () => (/* binding */ renderRunestoneComponent)
/* harmony export */ });
/* harmony import */ var _webpack_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../webpack.index.js */ 80184);
/* harmony import */ var _domutil_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./domutil.js */ 34089);



async function renderRunestoneComponent(
    componentSrc,
    whereDiv,
    moreOpts,
) {
    /**
     *  The easy part is adding the componentSrc to the existing div.
     *  The tedious part is calling the right functions to turn the
     *  source into the actual component.
     */
    let target = document.getElementById(whereDiv);
    if (!target) {
        return;
    }
    if (!componentSrc) {
        target.innerHTML = `<p>Sorry, no source is available for preview.</p>`;
        return;
    }
    let patt = /..\/_images/g;
    componentSrc = componentSrc.replace(
        patt,
        `${eBookConfig.app}/books/published/${eBookConfig.basecourse}/_images`,
    );
    target.innerHTML = componentSrc;

    if (typeof window.componentMap === "undefined") {
        window.componentMap = {};
    }

    let componentElement = target.querySelector("[data-component]");
    let componentKind = componentElement?.dataset.component;
    // Import the JavaScript for this component before proceeding.
    await (0,_webpack_index_js__WEBPACK_IMPORTED_MODULE_0__.runestone_import)(componentKind);
    let opt = {};
    opt.orig = componentElement;
    if (opt.orig) {
        opt.lang = (0,_domutil_js__WEBPACK_IMPORTED_MODULE_1__.getDataValue)(opt.orig, "lang");
        opt.useRunestoneServices = true;
        opt.graderactive = false;
        opt.python3 = true;
        if (typeof moreOpts !== "undefined") {
            for (let key in moreOpts) {
                opt[key] = moreOpts[key];
            }
        }
    }

    if (typeof component_factory === "undefined") {
        alert("Error:  Missing the component factory!");
    } else {
        if (!window.component_factory[componentKind] && !target.innerHTML) {
            target.innerHTML = `<p>Preview not available for ${componentKind}</p>`;
        } else {
            let res = window.component_factory[componentKind](opt);
            if (componentKind === "activecode") {
                if (moreOpts.multiGrader) {
                    window.componentMap[
                        `${moreOpts.gradingContainer} ${res.divid}`
                    ] = res;
                } else {
                    window.componentMap[res.divid] = res;
                }
            }
        }
    }
}

function createTimedComponent(componentSrc, moreOpts) {
    /* The important distinction is that the component does not really need to be rendered
    into the page, in fact, due to the async nature of getting the source the list of questions
    is made and the original html is replaced by the look of the exam.
    */

    let patt = /..\/_images/g;
    componentSrc = componentSrc.replace(
        patt,
        `${eBookConfig.app}/books/published/${eBookConfig.basecourse}/_images`,
    );

    let parsed = document.createElement("div");
    parsed.innerHTML = componentSrc;
    let componentElement = parsed.querySelector("[data-component]");
    let componentKind = componentElement?.dataset.component;
    let origId = componentElement?.getAttribute("id");

    // Double check -- if the component source is not in the DOM, then briefly add it
    // and call the constructor.
    if (!document.getElementById(origId)) {
        let hdiv = document.createElement("div");
        hdiv.style.display = "none";
        hdiv.innerHTML = componentSrc;
        document.body.appendChild(hdiv);
    }

    let ret;
    let opts = {
        orig: document.getElementById(origId),
        timed: true,
    };
    if (typeof moreOpts !== "undefined") {
        for (let key in moreOpts) {
            opts[key] = moreOpts[key];
        }
    }

    if (componentKind in window.component_factory) {
        ret = window.component_factory[componentKind](opts);
    }

    let rdict = {};
    rdict.question = ret;
    return rdict;
}

// For integration with the React overhault of Pretext
// 1. Disable the automatic instantiation at the end of each component.js
// 2. react will search for all ".runestone" and will call this function for each of them.
async function renderOneComponent(rsDiv) {
    // Find the actual component inside the runestone component.
    let component = rsDiv.querySelector("[data-component]");
    if (component == null) {
        console.log(
            "Render was called for a component, but now [data-component] attribute is present. This may mean the component has already been rendered.",
        );
        return;
    }
    let componentKind = component.dataset.component;
    await (0,_webpack_index_js__WEBPACK_IMPORTED_MODULE_0__.runestone_import)(componentKind);
    if (!rsDiv.closest("[data-component=timedAssessment]")) {
        // If this element exists within a timed component, don't render it here
        try {
            let divid = component.id;
            window.componentMap[divid] = window.component_factory[
                componentKind
            ]({
                orig: component,
                useRunestoneServices: eBookConfig.useRunestoneServices,
            });
        } catch (err) {
            console.log(`Error rendering ${componentKind} Problem ${component.id}
                         Details: ${err}`);
        }
    }
}


/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["vendors-node_modules_marked_lib_marked_esm_js"], () => (__webpack_exec__(80184)));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZml4LXJ1bmVzdG9uZS5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQTtBQUNBOztBQUVBOztBQUUrQzs7QUFFL0M7QUFDQSxpQkFBaUIseURBQWE7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsOENBQThDO0FBQzVFLFNBQVM7QUFDVCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSw4QkFBOEIsMkNBQTJDO0FBQ3pFLFNBQVM7QUFDVCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOzs7Ozs7Ozs7OztBQy9ERDtBQUNBOztBQUVBLHdCQUF3QjtBQUN4Qjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBLHdDQUF3QztBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNoTEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHNCQUFzQixTQUFTOztBQUUvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFNBQVM7QUFDcEIsV0FBVyxRQUFRO0FBQ25CO0FBQ087QUFDUCw4Q0FBOEMsS0FBSztBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkIsZUFBZSxFQUFFLGFBQWE7QUFDM0QsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOENBQThDLFlBQVksS0FBSyxNQUFNO0FBQ3JFO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLE1BQU07QUFDakMsdUJBQXVCLFlBQVk7QUFDbkMsU0FBUztBQUNULDREQUE0RDtBQUM1RDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckIsaUJBQWlCO0FBQ2pCOztBQUVBO0FBQ0E7QUFDQSxrREFBa0QsZ0JBQWdCO0FBQ2xFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUMsS0FBSyxJQUFJLElBQUk7QUFDOUMsYUFBYTtBQUNiLHNDQUFzQywwQ0FBTTtBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE4QixVQUFVLFlBQVksbUNBQW1DO0FBQ3ZGLDJCQUEyQixZQUFZO0FBQ3ZDLGFBQWE7QUFDYixVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0NBQStDO0FBQy9DO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4REFBOEQ7QUFDOUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLDhCQUE4QjtBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbURBQW1ELG9CQUFvQjtBQUN2RTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Qsd0RBQXdELEVBQUU7QUFDMUQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx1Q0FBdUMsc0JBQXNCO0FBQzdEO0FBQ0EsNEJBQTRCLHFCQUFxQjtBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0R0FBNEc7QUFDNUc7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSw0Q0FBNEM7QUFDckM7QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixjQUFjO0FBQ25DLGVBQWUsNkJBQTZCLG9EQUFvRCxNQUFNO0FBQ3RHO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBLDBDQUEwQyxNQUFNO0FBQ2hEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0EsZUFBZSw4QkFBOEI7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IsZUFBZTtBQUMvQjtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUM7QUFDckM7QUFDQSxzQ0FBc0MsTUFBTTtBQUM1QztBQUNBLGNBQWMsZ0RBQWdEO0FBQzlEO0FBQ0EsaUJBQWlCO0FBQ2pCLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ087QUFDQTs7QUFFQTtBQUNQO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsMEVBQTBFO0FBQzFFO0FBQ0E7QUFDTztBQUNBOztBQUVQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQixjQUFjO0FBQ3BDLGlCQUFpQixVQUFVO0FBQzNCO0FBQ0E7QUFDQSw2Q0FBNkMsUUFBUSxJQUFJLFlBQVk7QUFDckU7QUFDQTtBQUNBLGtGQUFrRjtBQUNsRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCLE1BQU0sc0NBQXNDO0FBQ3pFO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0EsK0JBQStCLFFBQVE7QUFDdkMsNENBQTRDLE1BQU07QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0RBQW9ELE1BQU07QUFDMUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQiw0Q0FBNEM7QUFDaEUsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrREFBa0Q7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDTztBQUNQOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG9EQUFvRCxNQUFNOztBQUUxRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDM3ZETztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRU87QUFDUDtBQUNBO0FBQ0E7QUFDQSwrQ0FBK0M7QUFDL0MsTUFBTTtBQUNOO0FBQ0EsZ0RBQWdEO0FBQ2hEO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDMUI2RDtBQUNqQjs7QUFFckM7QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxnQkFBZ0IsbUJBQW1CLHVCQUF1QjtBQUNyRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxVQUFVLG1FQUFnQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIseURBQVk7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQSwrREFBK0QsY0FBYztBQUM3RSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsMkJBQTJCLEVBQUUsVUFBVTtBQUNsRTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRU87QUFDUDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLGdCQUFnQixtQkFBbUIsdUJBQXVCO0FBQ3JFOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVLG1FQUFnQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsVUFBVTtBQUNWLDJDQUEyQyxlQUFlLFVBQVU7QUFDcEUsb0NBQW9DLElBQUk7QUFDeEM7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9jb21tb24vanMvcHJldGV4dC5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2NvbW1vbi9qcy9wcmVzZW50ZXJfbW9kZS5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2NvbW1vbi9qcy9kb211dGlsLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvY29tbW9uL2pzL3ByZXRleHQtaWZyYW1lLXJlc2l6ZS5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2NvbW1vbi9jc3MvcHJlc2VudGVyX21vZGUubGVzcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2NvbW1vbi9qcy91c2VyLWhpZ2hsaWdodHMuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9zcGxpY2UvanMvc3BsaWNlV3JhcHBlci50cyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcHR4cnMtYm9vdHN0cmFwLmxlc3MiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9jb21tb24vY3NzL21hdGVyaWFsLXN5bWJvbHMuY3NzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvY29tbW9uL2Nzcy91c2VyLWhpZ2hsaWdodHMuY3NzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvY29tbW9uL2pzL3J1bmVzdG9uZWJhc2UuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3dlYnBhY2suaW5kZXguanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9jb21tb24vanMvYm9va2Z1bmNzLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvY29tbW9uL2pzL3RoZW1lLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvY29tbW9uL2pzL3JlbmRlckNvbXBvbmVudC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICAgIFN1cHBvcnQgZnVuY3Rpb25zIGZvciBQcmVUZVh0IGJvb2tzIHJ1bm5pbmcgb24gUnVuZXN0b25lXG5cbiovXG5cbmltcG9ydCBSdW5lc3RvbmVCYXNlIGZyb20gXCIuL3J1bmVzdG9uZWJhc2UuanNcIjtcblxuZnVuY3Rpb24gc2V0dXBQVFhFdmVudHMoKSB7XG4gICAgbGV0IHJiID0gbmV3IFJ1bmVzdG9uZUJhc2UoKTtcbiAgICAvLyBsb2cgYW4gZXZlbnQgd2hlbiBhIGtub3dsIGlzIG9wZW5lZC5cbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiW2RhdGEta25vd2xdXCIpLmZvckVhY2goKGVsKSA9PiB7XG4gICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBsZXQgZGl2X2lkID0gZWwuZ2V0QXR0cmlidXRlKFwiZGF0YS1rbm93bFwiKTtcbiAgICAgICAgICAgIHJiLmxvZ0Jvb2tFdmVudCh7IGV2ZW50OiBcImtub3dsXCIsIGFjdDogXCJjbGlja1wiLCBkaXZfaWQ6IGRpdl9pZCB9KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgbGV0IGJvcm5faGlkZGVuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcImRldGFpbHMuYm9ybi1oaWRkZW4ta25vd2xcIik7XG4gICAgYm9ybl9oaWRkZW4uZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgICAgLy8gbG9nIGFuIGV2ZW50IHdoZW4gYSBrbm93bCBpcyBvcGVuZWQgdGhhdCB3YXMgYm9ybiBoaWRkZW5cbiAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcihcInRvZ2dsZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoZWwub3Blbikge1xuICAgICAgICAgICAgICAgIGxldCBkaXZfaWQgPSBlbC5pZDtcbiAgICAgICAgICAgICAgICByYi5sb2dCb29rRXZlbnQoe1xuICAgICAgICAgICAgICAgICAgICBldmVudDogXCJrbm93bFwiLFxuICAgICAgICAgICAgICAgICAgICBhY3Q6IFwib3BlblwiLFxuICAgICAgICAgICAgICAgICAgICBkaXZfaWQ6IGRpdl9pZCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgLy8gbG9nIGFuIGV2ZW50IHdoZW4gYSBzYWdlIGNlbGwgaXMgZXZhbHVhdGVkXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5zYWdlY2VsbF9ldmFsQnV0dG9uXCIpLmZvckVhY2goKGJ0bikgPT4ge1xuICAgICAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGxldCBjb250YWluZXIgPSBidG4uY2xvc2VzdChcIi5wdHgtc2FnZWNlbGxcIik7XG4gICAgICAgICAgICBsZXQgY29kZUlucHV0ID0gY29udGFpbmVyXG4gICAgICAgICAgICAgICAgPyBjb250YWluZXIucXVlcnlTZWxlY3RvcihcIi5zYWdlY2VsbF9pbnB1dFwiKVxuICAgICAgICAgICAgICAgIDogbnVsbDtcbiAgICAgICAgICAgIGxldCBjb2RlID0gY29kZUlucHV0ID8gY29kZUlucHV0LnRleHRDb250ZW50IDogXCJcIjtcbiAgICAgICAgICAgIGxldCBkaXZfaWQgPSBjb250YWluZXIgPyBjb250YWluZXIuaWQgOiBudWxsO1xuICAgICAgICAgICAgaWYgKCFkaXZfaWQpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgICAgICAgICAgIFwiQ291bGQgbm90IGZpbmQgY29udGFpbmVyIG9yIGRpdl9pZCBmb3Igc2FnZWNlbGwgYnV0dG9uXCIsXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJiLmxvZ0Jvb2tFdmVudCh7IGV2ZW50OiBcInNhZ2VcIiwgYWN0OiBcInJ1blwiLCBkaXZfaWQ6IGRpdl9pZCB9KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgaWYgKHR5cGVvZiBlQm9va0NvbmZpZyAhPT0gXCJ1bmRlZmluZWRcIiAmJiAhZUJvb2tDb25maWcuaXNJbnN0cnVjdG9yKSB7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY29tbWVudGFyeVwiKS5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgICAgICAgZWwuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgY29uc29sZS5sb2coXCJzZXR0aW5nIHVwIHByZXRleHRcIik7XG4gICAgc2V0dXBQVFhFdmVudHMoKTtcbiAgICBsZXQgd3JhcCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHJpbWFyeS1uYXZiYXItc3RpY2t5LXdyYXBwZXJcIik7XG4gICAgaWYgKHdyYXApIHtcbiAgICAgICAgd3JhcC5zdHlsZS5vdmVyZmxvdyA9IFwidmlzaWJsZVwiO1xuICAgIH1cbn0pO1xuIiwiLy8gSW5zdHJ1Y3Rvci1vbmx5IFwiQ29kZSBQcmVzZW50ZXJcIiB2aWV3IGZvciBTcGhpbnggYm9vayBwYWdlczogaGlkZXMgdGhlXG4vLyBwcm9zZSBhbmQgc3RlcHMgdGhyb3VnaCB0aGUgaW50ZXJhY3RpdmUgZXhlcmNpc2VzIG9uZSBhdCBhIHRpbWUuXG5cbnZhciBjb2RlRXhlcmNpc2VzID0gW107IC8vIEFycmF5IG9mIHRvcC1sZXZlbCAucnVuZXN0b25lIGV4ZXJjaXNlIGRpdnNcbnZhciBwcmVzZW50TW9kZUluaXRpYWxpemVkID0gZmFsc2U7XG5cbi8vIEVsZW1lbnRzIGEgcHJlc2VudGVyIHdhbnRzIHRvIGtlZXAgb24gc2NyZWVuLlxuY29uc3QgS0VFUF9WSVNJQkxFID1cbiAgICBcImgxLCAucHJlc2VudGF0aW9uLXRpdGxlLCAuYnRuLXByZXNlbnRlciwgLnJ1bmVzdG9uZSwgLnJ1bmVzdG9uZSAqLCBzZWN0aW9uLCAucHJlLCBjb2RlXCI7XG5cbmZ1bmN0aW9uIHNlY3Rpb25Db250ZW50KCkge1xuICAgIHJldHVybiBbLi4uZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcInNlY3Rpb24gKlwiKV0uZmlsdGVyKFxuICAgICAgICAoZWwpID0+ICFlbC5tYXRjaGVzKEtFRVBfVklTSUJMRSksXG4gICAgKTtcbn1cblxuZnVuY3Rpb24gcHJlc2VudFRvZ2dsZSgpIHtcbiAgICBpZiAoIXByZXNlbnRNb2RlSW5pdGlhbGl6ZWQpIHtcbiAgICAgICAgcHJlc2VudE1vZGVTZXR1cCgpO1xuICAgICAgICBwcmVzZW50TW9kZUluaXRpYWxpemVkID0gdHJ1ZTtcbiAgICB9XG4gICAgbGV0IGJvZCA9IGRvY3VtZW50LmJvZHk7XG4gICAgbGV0IHByZXNlbnRDbGFzcyA9IFwicHJlc2VudFwiO1xuICAgIGxldCBmdWxsSGVpZ2h0Q2xhc3MgPSBcImZ1bGwtaGVpZ2h0XCI7XG4gICAgbGV0IGJvdHRvbUNsYXNzID0gXCJib3R0b21cIjtcbiAgICBpZiAoYm9kLmNsYXNzTGlzdC5jb250YWlucyhwcmVzZW50Q2xhc3MpKSB7XG4gICAgICAgIGZvciAoY29uc3QgZWwgb2Ygc2VjdGlvbkNvbnRlbnQoKSkge1xuICAgICAgICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTsgLy9zaG93IGV2ZXJ5dGhpbmdcbiAgICAgICAgfVxuICAgICAgICBkb2N1bWVudFxuICAgICAgICAgICAgLmdldEVsZW1lbnRCeUlkKFwiY29tcGxldGlvbkJ1dHRvblwiKVxuICAgICAgICAgICAgPy5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xuICAgICAgICBib2QuY2xhc3NMaXN0LnJlbW92ZShwcmVzZW50Q2xhc3MpO1xuICAgICAgICBmb3IgKGNvbnN0IGVsIG9mIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuXCIgKyBmdWxsSGVpZ2h0Q2xhc3MpKSB7XG4gICAgICAgICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKGZ1bGxIZWlnaHRDbGFzcyk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCBlbCBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLlwiICsgYm90dG9tQ2xhc3MpKSB7XG4gICAgICAgICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKGJvdHRvbUNsYXNzKTtcbiAgICAgICAgfVxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInByZXNlbnRNb2RlXCIsIFwidGV4dFwiKTtcbiAgICAgICAgZm9yIChjb25zdCBleGVyY2lzZSBvZiBjb2RlRXhlcmNpc2VzKSB7XG4gICAgICAgICAgICBleGVyY2lzZS5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZm9yIChjb25zdCBlbCBvZiBzZWN0aW9uQ29udGVudCgpKSB7XG4gICAgICAgICAgICBlbC5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpOyAvLyBoaWRlIGV4dHJhbmVvdXMgc3R1ZmZcbiAgICAgICAgfVxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbXBsZXRpb25CdXR0b25cIik/LmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gICAgICAgIGJvZC5jbGFzc0xpc3QuYWRkKHByZXNlbnRDbGFzcyk7XG4gICAgICAgIGJvZC5jbGFzc0xpc3QuYWRkKGZ1bGxIZWlnaHRDbGFzcyk7XG4gICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc0xpc3QuYWRkKGZ1bGxIZWlnaHRDbGFzcyk7XG4gICAgICAgIGZvciAoY29uc3QgZWwgb2YgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcInNlY3Rpb24gLnJ1bmVzdG9uZVwiKSkge1xuICAgICAgICAgICAgZWwuY2xhc3NMaXN0LmFkZChmdWxsSGVpZ2h0Q2xhc3MpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3QgZWwgb2YgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5hYy1jYXB0aW9uXCIpKSB7XG4gICAgICAgICAgICBlbC5jbGFzc0xpc3QuYWRkKGJvdHRvbUNsYXNzKTtcbiAgICAgICAgfVxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInByZXNlbnRNb2RlXCIsIHByZXNlbnRDbGFzcyk7XG4gICAgICAgIGFjdGl2YXRlRXhlcmNpc2UoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHByZXNlbnRNb2RlU2V0dXAoKSB7XG4gICAgLy8gbW92ZWQgdGhpcyBvdXQgb2YgY29uZmlndXJlXG5cbiAgICAvLyB0aGlzIHN0aWxsIGxlYXZlcyBzb21lIHRoaW5ncyBzZW1pLW1lc3NlZCB1cCB3aGVuIHlvdSBleGl0IHByZXNlbnRlciBtb2RlLlxuICAgIC8vIGJ1dCBpbnN0cnVjdG9ycyB3aWxsIHByb2JhYmx5IGp1c3QgbGVhcm4gdG8gcmVmcmVzaCB0aGUgcGFnZS5cbiAgICBmb3IgKGNvbnN0IGNvbXBvbmVudCBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFxuICAgICAgICBcIltkYXRhLWNoaWxkY29tcG9uZW50XVwiLFxuICAgICkpIHtcbiAgICAgICAgY29tcG9uZW50LmNsYXNzTGlzdC5hZGQoXCJydW5lc3RvbmVcIik7XG4gICAgICAgIGNvbnN0IHBhcmVudERpdiA9IGNvbXBvbmVudC5wYXJlbnRFbGVtZW50Py5jbG9zZXN0KFwiZGl2XCIpO1xuICAgICAgICBpZiAocGFyZW50RGl2ICYmICFwYXJlbnREaXYubWF0Y2hlcyhcInNlY3Rpb25cIikpIHtcbiAgICAgICAgICAgIHBhcmVudERpdi5jbGFzc0xpc3QuYWRkKFwicnVuZXN0b25lXCIpO1xuICAgICAgICAgICAgcGFyZW50RGl2LnN0eWxlLm1heFdpZHRoID0gXCJub25lXCI7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcGFydHMgPSBjb21wb25lbnQucXVlcnlTZWxlY3RvckFsbChcIi5hY19jb2RlX2RpdiwgLmFjX291dHB1dFwiKTtcbiAgICAgICAgaWYgKHBhcnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgY29uc3QgYmxvY2sgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgYmxvY2suY2xhc3NOYW1lID0gXCJhYy1ibG9ja1wiO1xuICAgICAgICAgICAgYmxvY2suc3R5bGUud2lkdGggPSBcIjEwMCVcIjtcbiAgICAgICAgICAgIHBhcnRzWzBdLmJlZm9yZShibG9jayk7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHBhcnQgb2YgcGFydHMpIHtcbiAgICAgICAgICAgICAgICBibG9jay5hcHBlbmRDaGlsZChwYXJ0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZvciAoY29uc3QgaW1nIG9mIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJzZWN0aW9uIGltZ1wiKSkge1xuICAgICAgICBjb25zdCB3cmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgd3JhcHBlci5jbGFzc05hbWUgPSBcInJ1bmVzdG9uZVwiO1xuICAgICAgICBpbWcucmVwbGFjZVdpdGgod3JhcHBlcik7XG4gICAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoaW1nKTtcbiAgICB9XG4gICAgLy8gdG9wLWxldmVsIGV4ZXJjaXNlcyBvbmx5OiBza2lwIC5ydW5lc3RvbmUgbmVzdGVkIGluc2lkZSBhbm90aGVyXG4gICAgY29kZUV4ZXJjaXNlcyA9IFsuLi5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnJ1bmVzdG9uZVwiKV0uZmlsdGVyKFxuICAgICAgICAoZWwpID0+ICFlbC5wYXJlbnRFbGVtZW50LmNsb3Nlc3QoXCIucnVuZXN0b25lXCIpLFxuICAgICk7XG4gICAgZm9yIChjb25zdCBoZWFkaW5nIG9mIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJoMVwiKSkge1xuICAgICAgICBoZWFkaW5nLmluc2VydEFkamFjZW50SFRNTChcbiAgICAgICAgICAgIFwiYmVmb3JlYmVnaW5cIixcbiAgICAgICAgICAgIFwiPGRpdiBjbGFzcz0ncHJlc2VudGF0aW9uLXRpdGxlJz4gXFxcbiAgICAgICAgPGJ1dHRvbiBjbGFzcz0ncHJldi1leGVyY2lzZSBidG4tcHJlc2VudGVyIGJ0bi1ncmV5LW91dGxpbmUnIG9uY2xpY2s9J3ByZXZFeGVyY2lzZSgpJz5CYWNrPC9idXR0b24+IFxcXG4gICAgICAgIDxidXR0b24gY2xhc3M9J25leHQtZXhlcmNpc2UgYnRuLXByZXNlbnRlciBidG4tZ3JleS1zb2xpZCcgb25jbGljaz0nbmV4dEV4ZXJjaXNlKCknPk5leHQ8L2J1dHRvbj4gXFxcbiAgICAgIDwvZGl2PlwiLFxuICAgICAgICApO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZ2V0QWN0aXZlRXhlcmNpc2UoKSB7XG4gICAgcmV0dXJuIGNvZGVFeGVyY2lzZXMuZmlsdGVyKChlbCkgPT4gZWwuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYWN0aXZlXCIpKTtcbn1cblxuZnVuY3Rpb24gYWN0aXZhdGVFeGVyY2lzZShpbmRleCkge1xuICAgIGlmICh0eXBlb2YgaW5kZXggPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBpbmRleCA9IDA7XG4gICAgfVxuXG4gICAgaWYgKGNvZGVFeGVyY2lzZXMubGVuZ3RoKSB7XG4gICAgICAgIGZvciAoY29uc3QgZWwgb2YgZ2V0QWN0aXZlRXhlcmNpc2UoKSkge1xuICAgICAgICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBhY3RpdmUgPSBjb2RlRXhlcmNpc2VzW2luZGV4XTtcbiAgICAgICAgYWN0aXZlLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XG4gICAgICAgIGFjdGl2ZS5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xuICAgICAgICBmb3IgKGNvbnN0IGVsIG9mIGNvZGVFeGVyY2lzZXMpIHtcbiAgICAgICAgICAgIGlmIChlbCAhPT0gYWN0aXZlKSB7XG4gICAgICAgICAgICAgICAgZWwuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxud2luZG93Lm5leHRFeGVyY2lzZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgYWN0aXZlID0gZ2V0QWN0aXZlRXhlcmNpc2UoKVswXTtcbiAgICBsZXQgbmV4dEluZGV4ID0gY29kZUV4ZXJjaXNlcy5pbmRleE9mKGFjdGl2ZSkgKyAxO1xuICAgIGlmIChuZXh0SW5kZXggPCBjb2RlRXhlcmNpc2VzLmxlbmd0aCkge1xuICAgICAgICBhY3RpdmF0ZUV4ZXJjaXNlKG5leHRJbmRleCk7XG4gICAgfVxufTtcblxud2luZG93LnByZXZFeGVyY2lzZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgYWN0aXZlID0gZ2V0QWN0aXZlRXhlcmNpc2UoKVswXTtcbiAgICBsZXQgcHJldkluZGV4ID0gY29kZUV4ZXJjaXNlcy5pbmRleE9mKGFjdGl2ZSkgLSAxO1xuICAgIGlmIChwcmV2SW5kZXggPj0gMCkge1xuICAgICAgICBhY3RpdmF0ZUV4ZXJjaXNlKHByZXZJbmRleCk7XG4gICAgfVxufTtcblxuZnVuY3Rpb24gY29uZmlndXJlKCkge1xuICAgIGxldCByaWdodE5hdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubmF2YmFyLXJpZ2h0XCIpO1xuICAgIGlmICghcmlnaHROYXYpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByaWdodE5hdi5pbnNlcnRBZGphY2VudEhUTUwoXG4gICAgICAgIFwiYWZ0ZXJiZWdpblwiLFxuICAgICAgICBcIjxsaSBjbGFzcz0nZHJvcGRvd24gdmlldy10b2dnbGUnPiBcXFxuICAgICAgPGxhYmVsPlZpZXc6IFxcXG4gICAgICAgIDxzZWxlY3QgY2xhc3M9J21vZGUtc2VsZWN0Jz4gXFxcbiAgICAgICAgICA8b3B0aW9uIHZhbHVlPSd0ZXh0Jz5UZXh0Ym9vazwvb3B0aW9uPiBcXFxuICAgICAgICAgIDxvcHRpb24gdmFsdWU9J3ByZXNlbnQnPkNvZGUgUHJlc2VudGVyPC9vcHRpb24+IFxcXG4gICAgICAgIDwvc2VsZWN0PiBcXFxuICAgICAgPC9sYWJlbD4gXFxcbiAgICA8L2xpPlwiLFxuICAgICk7XG5cbiAgICBkb2N1bWVudFxuICAgICAgICAucXVlcnlTZWxlY3RvcihcIi5tb2RlLXNlbGVjdFwiKVxuICAgICAgICAuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCBwcmVzZW50VG9nZ2xlKTtcbn1cblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInJ1bmVzdG9uZTpsb2dpbi1jb21wbGV0ZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgLy8gaWYgdXNlciBpcyBpbnN0cnVjdG9yLCBlbmFibGUgcHJlc2VudGVyIG1vZGVcbiAgICBpZiAoZUJvb2tDb25maWcuaXNJbnN0cnVjdG9yKSB7XG4gICAgICAgIGNvbmZpZ3VyZSgpO1xuICAgIH1cbn0pO1xuIiwiLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIHxkb2NuYW1lfCAtIHNtYWxsIERPTSBoZWxwZXJzXG4gKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogSGVscGVycyB0aGF0IHJlcGxhY2UgY29tbW9uIGpRdWVyeSBpZGlvbXMgYXMgY29tcG9uZW50cyBhcmUgbWlncmF0ZWQgdG9cbiAqIHBsYWluIERPTSBBUElzLlxuICovXG5cbmNvbnN0IHJicmFjZSA9IC9eKD86XFx7W1xcd1xcV10qXFx9fFxcW1tcXHdcXFddKlxcXSkkLztcblxuLyoqXG4gKiBSZWFkIGEgZGF0YS0qIGF0dHJpYnV0ZSB3aXRoIHRoZSBzYW1lIHR5cGUgY29lcmNpb24galF1ZXJ5J3MgLmRhdGEoKVxuICogcGVyZm9ybWVkOiBcInRydWVcIi9cImZhbHNlXCIvXCJudWxsXCIgYmVjb21lIHRoZWlyIEpTIHZhbHVlcywgbnVtZXJpYyBzdHJpbmdzXG4gKiBiZWNvbWUgbnVtYmVycywgSlNPTi1sb29raW5nIHN0cmluZ3MgYXJlIHBhcnNlZCwgZXZlcnl0aGluZyBlbHNlIGlzXG4gKiByZXR1cm5lZCBhcyBhIHN0cmluZy4gUmV0dXJucyB1bmRlZmluZWQgd2hlbiB0aGUgYXR0cmlidXRlIGlzIGFic2VudC5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnRcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gdGhlIHBhcnQgb2YgdGhlIGF0dHJpYnV0ZSBuYW1lIGFmdGVyIFwiZGF0YS1cIlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RGF0YVZhbHVlKGVsZW1lbnQsIG5hbWUpIHtcbiAgICBjb25zdCBkYXRhID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoYGRhdGEtJHtuYW1lfWApO1xuICAgIGlmIChkYXRhID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGlmIChkYXRhID09PSBcInRydWVcIikgcmV0dXJuIHRydWU7XG4gICAgaWYgKGRhdGEgPT09IFwiZmFsc2VcIikgcmV0dXJuIGZhbHNlO1xuICAgIGlmIChkYXRhID09PSBcIm51bGxcIikgcmV0dXJuIG51bGw7XG4gICAgLy8gT25seSBjb252ZXJ0IHRvIGEgbnVtYmVyIGlmIGl0IGRvZXNuJ3QgY2hhbmdlIHRoZSBzdHJpbmcuXG4gICAgaWYgKGRhdGEgPT09ICtkYXRhICsgXCJcIikgcmV0dXJuICtkYXRhO1xuICAgIGlmIChyYnJhY2UudGVzdChkYXRhKSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UoZGF0YSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBkYXRhO1xufVxuXG4vKipcbiAqIFNob3cgb3IgaGlkZSBhbiBlbGVtZW50IGJ5IHRvZ2dsaW5nIGlubGluZSBkaXNwbGF5LCBsaWtlIGpRdWVyeSdzIC50b2dnbGUoKS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRvZ2dsZURpc3BsYXkoZWxlbWVudCkge1xuICAgIGlmICghZWxlbWVudCkgcmV0dXJuO1xuICAgIGlmIChpc0hpZGRlbihlbGVtZW50KSkge1xuICAgICAgICBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPSBcIlwiO1xuICAgICAgICBpZiAoaXNIaWRkZW4oZWxlbWVudCkpIHtcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gaXNIaWRkZW4oZWxlbWVudCkge1xuICAgIGlmIChlbGVtZW50LnN0eWxlLmRpc3BsYXkgPT09IFwibm9uZVwiKSByZXR1cm4gdHJ1ZTtcbiAgICBjb25zdCB3aW4gPSBlbGVtZW50Lm93bmVyRG9jdW1lbnQuZGVmYXVsdFZpZXc7XG4gICAgcmV0dXJuIHdpbi5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpLmRpc3BsYXkgPT09IFwibm9uZVwiO1xufVxuXG4vKipcbiAqIFdpZHRoIG9mIGFuIGVsZW1lbnQgaW5jbHVkaW5nIG1hcmdpbnMsIGxpa2UgalF1ZXJ5J3MgLm91dGVyV2lkdGgodHJ1ZSkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBvdXRlcldpZHRoKGVsZW1lbnQpIHtcbiAgICBjb25zdCBzdHlsZSA9IGdldENvbXB1dGVkU3R5bGUoZWxlbWVudCk7XG4gICAgcmV0dXJuIChcbiAgICAgICAgZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCArXG4gICAgICAgIChwYXJzZUZsb2F0KHN0eWxlLm1hcmdpbkxlZnQpIHx8IDApICtcbiAgICAgICAgKHBhcnNlRmxvYXQoc3R5bGUubWFyZ2luUmlnaHQpIHx8IDApXG4gICAgKTtcbn1cblxuLyoqXG4gKiBIZWlnaHQgb2YgYW4gZWxlbWVudCBpbmNsdWRpbmcgbWFyZ2lucywgbGlrZSBqUXVlcnkncyAub3V0ZXJIZWlnaHQodHJ1ZSkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBvdXRlckhlaWdodChlbGVtZW50KSB7XG4gICAgY29uc3Qgc3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpO1xuICAgIHJldHVybiAoXG4gICAgICAgIGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0ICtcbiAgICAgICAgKHBhcnNlRmxvYXQoc3R5bGUubWFyZ2luVG9wKSB8fCAwKSArXG4gICAgICAgIChwYXJzZUZsb2F0KHN0eWxlLm1hcmdpbkJvdHRvbSkgfHwgMClcbiAgICApO1xufVxuXG4vLyBQcm9wZXJ0aWVzIHRoYXQgdGFrZSBhIGJhcmUgbnVtYmVyIHJhdGhlciB0aGFuIGEgcHggbGVuZ3RoLlxuY29uc3QgdW5pdGxlc3MgPSBuZXcgU2V0KFtcIm9wYWNpdHlcIiwgXCJ6SW5kZXhcIiwgXCJmb250V2VpZ2h0XCJdKTtcblxuY29uc3Qga2ViYWIgPSAvLShbYS16XSkvZztcbmNvbnN0IGNhbWVsQ2FzZSA9IChuYW1lKSA9PiBuYW1lLnJlcGxhY2Uoa2ViYWIsIChtLCBjKSA9PiBjLnRvVXBwZXJDYXNlKCkpO1xuXG5mdW5jdGlvbiBwYXJzZUNvbG9yKHZhbHVlKSB7XG4gICAgaWYgKCF2YWx1ZSkgcmV0dXJuIG51bGw7XG4gICAgbGV0IG0gPSB2YWx1ZS5tYXRjaCgvXiMoWzAtOWEtZl17M30pJC9pKTtcbiAgICBpZiAobSkge1xuICAgICAgICByZXR1cm4gWy4uLm1bMV1dLm1hcCgoYykgPT4gcGFyc2VJbnQoYyArIGMsIDE2KSk7XG4gICAgfVxuICAgIG0gPSB2YWx1ZS5tYXRjaCgvXiMoWzAtOWEtZl17Nn0pJC9pKTtcbiAgICBpZiAobSkge1xuICAgICAgICByZXR1cm4gWzAsIDIsIDRdLm1hcCgoaSkgPT4gcGFyc2VJbnQobVsxXS5zbGljZShpLCBpICsgMiksIDE2KSk7XG4gICAgfVxuICAgIG0gPSB2YWx1ZS5tYXRjaCgvXnJnYmE/XFwoKFxcZCspLFxccyooXFxkKyksXFxzKihcXGQrKS8pO1xuICAgIGlmIChtKSB7XG4gICAgICAgIHJldHVybiBbK21bMV0sICttWzJdLCArbVszXV07XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xufVxuXG4vKipcbiAqIEEgcmVxdWVzdEFuaW1hdGlvbkZyYW1lIHR3ZWVuIGNvdmVyaW5nIHRoZSBzdWJzZXQgb2YgalF1ZXJ5J3MgLmFuaW1hdGUoKVxuICogdGhlIGNvbXBvbmVudHMgdXNlOiBudW1lcmljIENTUyBwcm9wZXJ0aWVzIChweCwgb3IgYmFyZSBmb3Igb3BhY2l0eS1saWtlXG4gKiBwcm9wZXJ0aWVzKSBhbmQgY29sb3JzLCBwbHVzIHN0YXJ0L3Byb2dyZXNzL2NvbXBsZXRlIGNhbGxiYWNrcy4gcHJvZ3Jlc3NcbiAqIHJlY2VpdmVzIHRoZSAwLi4xIGZyYWN0aW9uIGFzIGl0cyBzZWNvbmQgYXJndW1lbnQsIG1hdGNoaW5nIHRoZSBqUXVlcnlcbiAqIGNhbGxiYWNrIHNoYXBlIHVzZWQgYnkgZXhpc3RpbmcgY2FsbGVycy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFuaW1hdGUoZWxlbWVudCwgcHJvcGVydGllcywgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgZHVyYXRpb24gPSBvcHRpb25zLmR1cmF0aW9uID8/IDQwMDtcbiAgICBjb25zdCBjb21wdXRlZCA9IGdldENvbXB1dGVkU3R5bGUoZWxlbWVudCk7XG4gICAgY29uc3QgdHdlZW5zID0gW107XG4gICAgZm9yIChjb25zdCBbbmFtZSwgdGFyZ2V0XSBvZiBPYmplY3QuZW50cmllcyhwcm9wZXJ0aWVzKSkge1xuICAgICAgICBjb25zdCBwcm9wID0gY2FtZWxDYXNlKG5hbWUpO1xuICAgICAgICBpZiAodHlwZW9mIHRhcmdldCA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgY29uc3QgZnJvbSA9IHBhcnNlRmxvYXQoY29tcHV0ZWRbcHJvcF0pIHx8IDA7XG4gICAgICAgICAgICBjb25zdCB1bml0ID0gdW5pdGxlc3MuaGFzKHByb3ApID8gXCJcIiA6IFwicHhcIjtcbiAgICAgICAgICAgIHR3ZWVucy5wdXNoKChwKSA9PiB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZVtwcm9wXSA9IGZyb20gKyAodGFyZ2V0IC0gZnJvbSkgKiBwICsgdW5pdDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgZnJvbUNvbG9yID0gcGFyc2VDb2xvcihjb21wdXRlZFtwcm9wXSk7XG4gICAgICAgICAgICBjb25zdCB0b0NvbG9yID0gcGFyc2VDb2xvcih0YXJnZXQpO1xuICAgICAgICAgICAgaWYgKGZyb21Db2xvciAmJiB0b0NvbG9yKSB7XG4gICAgICAgICAgICAgICAgdHdlZW5zLnB1c2goKHApID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbWl4ZWQgPSBmcm9tQ29sb3IubWFwKChmLCBpKSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5yb3VuZChmICsgKHRvQ29sb3JbaV0gLSBmKSAqIHApLFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlW3Byb3BdID0gYHJnYigke21peGVkLmpvaW4oXCIsIFwiKX0pYDtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gTm90IGludGVycG9sYXRhYmxlOyBqdXN0IGFwcGx5IHRoZSBmaW5hbCB2YWx1ZSBhdCB0aGUgZW5kLlxuICAgICAgICAgICAgICAgIHR3ZWVucy5wdXNoKChwKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwID09PSAxKSBlbGVtZW50LnN0eWxlW3Byb3BdID0gdGFyZ2V0O1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChvcHRpb25zLnN0YXJ0KSBvcHRpb25zLnN0YXJ0KCk7XG4gICAgY29uc3QgdDAgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICBmdW5jdGlvbiBzdGVwKG5vdykge1xuICAgICAgICBjb25zdCBwID0gTWF0aC5taW4oMSwgKG5vdyAtIHQwKSAvIGR1cmF0aW9uKTtcbiAgICAgICAgZm9yIChjb25zdCB0d2VlbiBvZiB0d2VlbnMpIHR3ZWVuKHApO1xuICAgICAgICBpZiAob3B0aW9ucy5wcm9ncmVzcykgb3B0aW9ucy5wcm9ncmVzcyhudWxsLCBwLCBudWxsKTtcbiAgICAgICAgaWYgKHAgPCAxKSB7XG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc3RlcCk7XG4gICAgICAgIH0gZWxzZSBpZiAob3B0aW9ucy5jb21wbGV0ZSkge1xuICAgICAgICAgICAgb3B0aW9ucy5jb21wbGV0ZSgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShzdGVwKTtcbn1cblxuLyoqXG4gKiBFc2NhcGUgYSB2YWx1ZSBmb3IgaW50ZXJwb2xhdGlvbiBpbnRvIGFuIEhUTUwgc3RyaW5nLiBVc2UgdGhpcyAob3JcbiAqIHRleHRDb250ZW50KSBmb3IgYW55dGhpbmcgYSB1c2VyIG9yIHRoZSBzZXJ2ZXIgbWF5IGhhdmUgc3VwcGxpZWQgLS1cbiAqIHN0dWRlbnQgYW5zd2VycywgbmFtZXMsIGZpbGVuYW1lcywgcHJvZ3JhbSBvdXRwdXQuXG4gKlxuICogQHBhcmFtIHsqfSBzdHIgLSBjb252ZXJ0ZWQgd2l0aCBTdHJpbmcoKTsgbnVsbC91bmRlZmluZWQgYmVjb21lIFwiXCJcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBlc2NhcGVIdG1sKHN0cikge1xuICAgIGlmIChzdHIgPT09IG51bGwgfHwgc3RyID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfVxuICAgIHJldHVybiBTdHJpbmcoc3RyKVxuICAgICAgICAucmVwbGFjZSgvJi9nLCBcIiZhbXA7XCIpXG4gICAgICAgIC5yZXBsYWNlKC88L2csIFwiJmx0O1wiKVxuICAgICAgICAucmVwbGFjZSgvPi9nLCBcIiZndDtcIilcbiAgICAgICAgLnJlcGxhY2UoLycvZywgXCImI3gyNztcIilcbiAgICAgICAgLnJlcGxhY2UoL1wiL2csIFwiJnF1b3Q7XCIpO1xufVxuIiwiLy8gVXNlZCBmb3IgZXhwZXJpbWVudGFsIGN1c3RvbSBydW5lc3RvbmUgY29tcG9uZW50cyBpbXBsZW1lbnRlZCBpbnNpZGVcbi8vIGlmcmFtZXMuIFRoaXMgc2NyaXB0IHNob3VsZCBhdXRvbWF0aWNhbGx5IHJlcXVlc3QgdGhhdCB0aGUgaWZyYW1lIGdldFxuLy8gcmVzaXplZCB0byBmaXQgdGhlIGNvbnRlbnQgYW5kIHVwZGF0ZSB3aGVuIGNvbnRlbnQgZG9lcy5cblxuLy8gSXQgd2lsbCBub3QgaW5zdGFsbCBpZiB0aGUgcGFnZSBpcyBub3QgaW5zaWRlIGFuIGlmcmFtZSwgb3IgaWYgdGhlIHBhZ2UgZG9lcyBub3QgaGF2ZSBhXG4vLyB3cmFwcGVyIGVsZW1lbnQgd2l0aCB0aGUgYXR0cmlidXRlIGRhdGEtcHJldGV4dC1mcmFtZS1yZXNpemU9XCJsdGkuZnJhbWVSZXNpemVcIi5cbi8vIFRoZSB3cmFwcGVyIGVsZW1lbnQgc2hvdWxkIGJlIHRoZSBvdXRlcm1vc3QgZWxlbWVudCBvZiB0aGUgaW50ZXJhY3RpdmUncyAtaWYuaHRtbCBwYWdlLlxuXG4vLyBQcmVUZVh0J3MgcGFyZW50IHBhZ2UgbG9hZHMgbHRpX2lmcmFtZV9yZXNpemVyLmpzLiBJdCBpZGVudGlmaWVzIHRoZVxuLy8gc2VuZGluZyBpZnJhbWUgYnkgY29udGVudFdpbmRvdyBhbmQgZXhwZWN0cyBhIGhlaWdodCBpbiBwaXhlbHMuXG5mdW5jdGlvbiBpbnN0YWxsUHJldGV4dElmcmFtZVJlc2l6ZSgpIHtcbiAgICBpZiAod2luZG93LnBhcmVudCA9PT0gd2luZG93KSByZXR1cm47XG5cbiAgICAvLyBQcmVUZVh0IG1hcmtzIHRoZSBjb250ZW50IHdyYXBwZXIgb24gYW4gaW50ZXJhY3RpdmUncyAtaWYuaHRtbCBwYWdlLlxuICAgIGNvbnN0IHdyYXBwZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICAnW2RhdGEtcHJldGV4dC1mcmFtZS1yZXNpemU9XCJsdGkuZnJhbWVSZXNpemVcIl0nLFxuICAgICk7XG4gICAgaWYgKCF3cmFwcGVyKSByZXR1cm47XG4gICAgLy8gVGhlIGdlbmVyYXRlZCBhc3BlY3QgcmF0aW8gcmVzZXJ2ZXMgc3BhY2UgYmVmb3JlIHRoZSBjb21wb25lbnQgcmVuZGVycy5cbiAgICAvLyBPbmNlIEpTIHJ1bnMsIHVzZSB0aGUgY29tcG9uZW50J3MgYWN0dWFsIGhlaWdodCBpbnN0ZWFkLlxuICAgIHdyYXBwZXIuc3R5bGUuYXNwZWN0UmF0aW8gPSBcImF1dG9cIjtcblxuICAgIGxldCBwZW5kaW5nID0gZmFsc2U7XG4gICAgbGV0IGxhc3RIZWlnaHQgPSAtMTtcbiAgICBjb25zdCByZXBvcnRIZWlnaHQgPSAoKSA9PiB7XG4gICAgICAgIHBlbmRpbmcgPSBmYWxzZTtcbiAgICAgICAgY29uc3QgaGVpZ2h0ID0gTWF0aC5jZWlsKFxuICAgICAgICAgICAgd3JhcHBlci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5ib3R0b20gKyB3aW5kb3cuc2Nyb2xsWSxcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKGhlaWdodCA9PT0gbGFzdEhlaWdodCkgcmV0dXJuO1xuICAgICAgICBsYXN0SGVpZ2h0ID0gaGVpZ2h0O1xuICAgICAgICB3aW5kb3cucGFyZW50LnBvc3RNZXNzYWdlKFxuICAgICAgICAgICAgeyBzdWJqZWN0OiBcImx0aS5mcmFtZVJlc2l6ZVwiLCBoZWlnaHQgfSxcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4gPT09IFwibnVsbFwiID8gXCIqXCIgOiB3aW5kb3cubG9jYXRpb24ub3JpZ2luLFxuICAgICAgICApO1xuICAgIH07XG4gICAgY29uc3Qgc2NoZWR1bGVSZXBvcnQgPSAoKSA9PiB7XG4gICAgICAgIGlmIChwZW5kaW5nKSByZXR1cm47XG4gICAgICAgIHBlbmRpbmcgPSB0cnVlO1xuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlcG9ydEhlaWdodCk7XG4gICAgfTtcblxuICAgIC8vIFJ1bmVzdG9uZSByZW5kZXJzIGFzeW5jaHJvbm91c2x5LCBhbmQgbGF0ZXIgYWN0aW9ucyBtYXkgY2hhbmdlIGhlaWdodC5cbiAgICAvLyBPYnNlcnZlIGNvbnRlbnQgcmF0aGVyIHRoYW4gdGhlIHZpZXdwb3J0IHRoYXQgdGhlIHBhcmVudCByZXNpemVzLlxuICAgIGlmICh3aW5kb3cuUmVzaXplT2JzZXJ2ZXIpIHtcbiAgICAgICAgbmV3IFJlc2l6ZU9ic2VydmVyKHNjaGVkdWxlUmVwb3J0KS5vYnNlcnZlKHdyYXBwZXIsIHtcbiAgICAgICAgICAgIGJveDogXCJib3JkZXItYm94XCIsXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBzY2hlZHVsZVJlcG9ydCgpO1xufVxuXG5pZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gXCJsb2FkaW5nXCIpIHtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBpbnN0YWxsUHJldGV4dElmcmFtZVJlc2l6ZSwge1xuICAgICAgICBvbmNlOiB0cnVlLFxuICAgIH0pO1xufSBlbHNlIHtcbiAgICBpbnN0YWxsUHJldGV4dElmcmFtZVJlc2l6ZSgpO1xufVxuIiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLyogUGFnZS1jb21wbGV0aW9uIHRyYWNraW5nOiB0aGUgXCJNYXJrIGFzIENvbXBsZXRlZFwiIGJ1dHRvbiwgdGhlIGxhc3QtcGFnZVxuICogYm9va21hcmssIGFuZCB0aGUgdGFibGUtb2YtY29udGVudHMgcHJvZ3Jlc3MgZGVjb3JhdGlvbnMuIChUaGUgZmlsZSBuYW1lXG4gKiBpcyBoaXN0b3JpY2FsLikgKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCB7IG91dGVyV2lkdGgsIGFuaW1hdGUgfSBmcm9tIFwiLi9kb211dGlsLmpzXCI7XG5pbXBvcnQgeyBpc1N1YmNoYXB0ZXJQYWdlIH0gZnJvbSBcIi4vYm9va2Z1bmNzLmpzXCI7XG5pbXBvcnQgXCIuLi9jc3MvdXNlci1oaWdobGlnaHRzLmNzc1wiO1xuXG4vKlxuICogR0VUIGEgc2VydmVyIGVuZHBvaW50IHRoYXQgYW5zd2VycyBlaXRoZXIgSlNPTiBvciB0aGUgbGl0ZXJhbCBzdHJpbmdcbiAqIFwiTm9uZVwiLiBSZXR1cm5zIHRoZSBwYXJzZWQgSlNPTiBvciBudWxsLlxuICovXG5hc3luYyBmdW5jdGlvbiBmZXRjaEpzb24odXJsLCBwYXJhbXMpIHtcbiAgICBsZXQgZnVsbFVybCA9IHBhcmFtcyA/IGAke3VybH0/JHtuZXcgVVJMU2VhcmNoUGFyYW1zKHBhcmFtcyl9YCA6IHVybDtcbiAgICB0cnkge1xuICAgICAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChmdWxsVXJsKTtcbiAgICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJSZXF1ZXN0IEZhaWxlZCBmb3IgXCIgKyBmdWxsVXJsKTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGxldCB0ZXh0ID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xuICAgICAgICBpZiAodGV4dCA9PSBcIk5vbmVcIiB8fCB0ZXh0ID09PSBcIlwiKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZSh0ZXh0KTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJSZXF1ZXN0IEZhaWxlZCBmb3IgXCIgKyBmdWxsVXJsKTtcbiAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBnZXRDb21wbGV0aW9ucygpIHtcbiAgICAvLyBHZXQgdGhlIGNvbXBsZXRpb24gc3RhdHVzXG4gICAgdmFyIGN1cnJlbnRQYXRobmFtZSA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZTtcbiAgICBpZiAoY3VycmVudFBhdGhuYW1lLmluZGV4T2YoXCI/XCIpICE9PSAtMSkge1xuICAgICAgICBjdXJyZW50UGF0aG5hbWUgPSBjdXJyZW50UGF0aG5hbWUuc3Vic3RyaW5nKFxuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIGN1cnJlbnRQYXRobmFtZS5sYXN0SW5kZXhPZihcIj9cIiksXG4gICAgICAgICk7XG4gICAgfVxuICAgIHZhciBkYXRhID0gYXdhaXQgZmV0Y2hKc29uKFxuICAgICAgICBgJHtlQm9va0NvbmZpZy5uZXdfc2VydmVyX3ByZWZpeH0vbG9nZ2VyL2dldENvbXBsZXRpb25TdGF0dXNgLFxuICAgICAgICB7XG4gICAgICAgICAgICBsYXN0UGFnZVVybDogY3VycmVudFBhdGhuYW1lLFxuICAgICAgICAgICAgaXNQdHhCb29rOiBpc1ByZVRlWHQoKSxcbiAgICAgICAgfSxcbiAgICApO1xuICAgIGlmIChkYXRhKSB7XG4gICAgICAgIHZhciBjb21wbGV0aW9uRGF0YSA9IGRhdGEuZGV0YWlsO1xuICAgICAgICB2YXIgY29tcGxldGlvbkNsYXNzLCBjb21wbGV0aW9uTXNnO1xuICAgICAgICBpZiAoY29tcGxldGlvbkRhdGFbMF0uY29tcGxldGlvblN0YXR1cyA9PSAxKSB7XG4gICAgICAgICAgICBjb21wbGV0aW9uQ2xhc3MgPSBcImJ1dHRvbkNvbmZpcm1Db21wbGV0aW9uXCI7XG4gICAgICAgICAgICBjb21wbGV0aW9uTXNnID1cbiAgICAgICAgICAgICAgICBcIjxpIGNsYXNzPSdnbHlwaGljb24gZ2x5cGhpY29uLW9rJz48L2k+IENvbXBsZXRlZC4gV2VsbCBEb25lIVwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29tcGxldGlvbkNsYXNzID0gXCJidXR0b25Bc2tDb21wbGV0aW9uXCI7XG4gICAgICAgICAgICBjb21wbGV0aW9uTXNnID0gXCJNYXJrIGFzIENvbXBsZXRlZFwiO1xuICAgICAgICB9XG4gICAgICAgIGxldCBzY3AgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3NjcHJvZ3Jlc3Njb250YWluZXJcIik7XG4gICAgICAgIGlmIChzY3ApIHtcbiAgICAgICAgICAgIHNjcC5jbGFzc0xpc3QuYWRkKFwicHR4LXJ1bmVzdG9uZS1jb250YWluZXJcIik7XG4gICAgICAgICAgICBzY3AuaW5zZXJ0QWRqYWNlbnRIVE1MKFxuICAgICAgICAgICAgICAgIFwiYmVmb3JlZW5kXCIsXG4gICAgICAgICAgICAgICAgJzxkaXYgc3R5bGU9XCJ0ZXh0LWFsaWduOmNlbnRlclwiPjxidXR0b24gY2xhc3M9XCJidG4gYnRuLWxnICcgK1xuICAgICAgICAgICAgICAgICAgICBjb21wbGV0aW9uQ2xhc3MgK1xuICAgICAgICAgICAgICAgICAgICAnXCIgaWQ9XCJjb21wbGV0aW9uQnV0dG9uXCI+JyArXG4gICAgICAgICAgICAgICAgICAgIGNvbXBsZXRpb25Nc2cgK1xuICAgICAgICAgICAgICAgICAgICBcIjwvYnV0dG9uPjwvZGl2PlwiLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gc2hvd0xhc3RQb3NpdGlvbkJhbm5lcigpIHtcbiAgICB2YXIgbGFzdFBvc2l0aW9uVmFsID0gZ2V0VXJsVmFyKFwibGFzdFBvc2l0aW9uXCIpO1xuICAgIGlmIChsYXN0UG9zaXRpb25WYWwgIT09IG51bGwpIHtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5pbnNlcnRBZGphY2VudEhUTUwoXG4gICAgICAgICAgICBcImJlZm9yZWVuZFwiLFxuICAgICAgICAgICAgJzxpbWcgc3JjPVwiLi4vX3N0YXRpYy9sYXN0LXBvaW50LnBuZ1wiIHN0eWxlPVwicG9zaXRpb246YWJzb2x1dGU7IHBhZGRpbmctdG9wOjU1cHg7IGxlZnQ6IDEwcHg7IHRvcDogJyArXG4gICAgICAgICAgICAgICAgcGFyc2VJbnQobGFzdFBvc2l0aW9uVmFsKSArXG4gICAgICAgICAgICAgICAgJ3B4O1wiLz4nLFxuICAgICAgICApO1xuICAgICAgICB3aW5kb3cuc2Nyb2xsVG8oe1xuICAgICAgICAgICAgdG9wOiBwYXJzZUludChsYXN0UG9zaXRpb25WYWwpLFxuICAgICAgICAgICAgYmVoYXZpb3I6IFwic21vb3RoXCIsXG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gYWRkTmF2aWdhdGlvbkFuZENvbXBsZXRpb25CdXR0b25zKCkge1xuICAgIHZhciBjb21wbGV0aW9uQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb21wbGV0aW9uQnV0dG9uXCIpO1xuICAgIHZhciBuYXZMaW5rQmdSaWdodCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmF2TGlua0JnUmlnaHRcIik7XG4gICAgdmFyIG5hdkxpbmtCZ0xlZnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5hdkxpbmtCZ0xlZnRcIik7XG4gICAgdmFyIHJlbGF0aW9uc05leHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlbGF0aW9ucy1uZXh0XCIpO1xuICAgIHZhciBuYXZMaW5rQmdSaWdodEhpZGRlblBvc2l0aW9uID0gbmF2TGlua0JnUmlnaHRcbiAgICAgICAgPyAtb3V0ZXJXaWR0aChuYXZMaW5rQmdSaWdodCkgLSA1XG4gICAgICAgIDogLTU7XG4gICAgdmFyIG5hdkxpbmtCZ1JpZ2h0SGFsZk9wZW47XG4gICAgdmFyIG5hdkxpbmtCZ1JpZ2h0RnVsbE9wZW4gPSAwO1xuXG4gICAgaWYgKGNvbXBsZXRpb25CdXR0b24/LmNsYXNzTGlzdC5jb250YWlucyhcImJ1dHRvbkFza0NvbXBsZXRpb25cIikpIHtcbiAgICAgICAgbmF2TGlua0JnUmlnaHRIYWxmT3BlbiA9IG5hdkxpbmtCZ1JpZ2h0SGlkZGVuUG9zaXRpb24gKyA3MDtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgICBjb21wbGV0aW9uQnV0dG9uPy5jbGFzc0xpc3QuY29udGFpbnMoXCJidXR0b25Db25maXJtQ29tcGxldGlvblwiKVxuICAgICkge1xuICAgICAgICBuYXZMaW5rQmdSaWdodEhhbGZPcGVuID0gMDtcbiAgICB9XG4gICAgdmFyIHJlbGF0aW9uc05leHRJY29uSW5pdGlhbFBvc2l0aW9uID0gcmVsYXRpb25zTmV4dFxuICAgICAgICA/IGdldENvbXB1dGVkU3R5bGUocmVsYXRpb25zTmV4dCkucmlnaHRcbiAgICAgICAgOiBcIjBweFwiO1xuICAgIHZhciByZWxhdGlvbnNOZXh0SWNvbk5ld1Bvc2l0aW9uID0gLShuYXZMaW5rQmdSaWdodEhpZGRlblBvc2l0aW9uICsgMzUpO1xuXG4gICAgaWYgKG5hdkxpbmtCZ1JpZ2h0KSB7XG4gICAgICAgIG5hdkxpbmtCZ1JpZ2h0LnN0eWxlLnJpZ2h0ID0gbmF2TGlua0JnUmlnaHRIaWRkZW5Qb3NpdGlvbiArIFwicHhcIjtcbiAgICAgICAgbmF2TGlua0JnUmlnaHQuc3R5bGUuZGlzcGxheSA9IFwiXCI7XG4gICAgICAgIHZhciBuYXZCZ1Nob3duID0gZmFsc2U7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICB3aW5kb3cuc2Nyb2xsWSArIHdpbmRvdy5pbm5lckhlaWdodCA+PVxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxIZWlnaHRcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIGFuaW1hdGUoXG4gICAgICAgICAgICAgICAgICAgIG5hdkxpbmtCZ1JpZ2h0LFxuICAgICAgICAgICAgICAgICAgICB7IHJpZ2h0OiBuYXZMaW5rQmdSaWdodEhhbGZPcGVuIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgZHVyYXRpb246IDIwMCB9LFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgaWYgKG5hdkxpbmtCZ0xlZnQpIHtcbiAgICAgICAgICAgICAgICAgICAgYW5pbWF0ZShuYXZMaW5rQmdMZWZ0LCB7IGxlZnQ6IDAgfSwgeyBkdXJhdGlvbjogMjAwIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgIHJlbGF0aW9uc05leHQgJiZcbiAgICAgICAgICAgICAgICAgICAgY29tcGxldGlvbkJ1dHRvbj8uY2xhc3NMaXN0LmNvbnRhaW5zKFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJidXR0b25Db25maXJtQ29tcGxldGlvblwiLFxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIGFuaW1hdGUoXG4gICAgICAgICAgICAgICAgICAgICAgICByZWxhdGlvbnNOZXh0LFxuICAgICAgICAgICAgICAgICAgICAgICAgeyByaWdodDogcmVsYXRpb25zTmV4dEljb25OZXdQb3NpdGlvbiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgeyBkdXJhdGlvbjogMjAwIH0sXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG5hdkJnU2hvd24gPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChuYXZCZ1Nob3duKSB7XG4gICAgICAgICAgICAgICAgYW5pbWF0ZShcbiAgICAgICAgICAgICAgICAgICAgbmF2TGlua0JnUmlnaHQsXG4gICAgICAgICAgICAgICAgICAgIHsgcmlnaHQ6IG5hdkxpbmtCZ1JpZ2h0SGlkZGVuUG9zaXRpb24gfSxcbiAgICAgICAgICAgICAgICAgICAgeyBkdXJhdGlvbjogMjAwIH0sXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBpZiAobmF2TGlua0JnTGVmdCkge1xuICAgICAgICAgICAgICAgICAgICBhbmltYXRlKG5hdkxpbmtCZ0xlZnQsIHsgbGVmdDogLTY1IH0sIHsgZHVyYXRpb246IDIwMCB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHJlbGF0aW9uc05leHQpIHtcbiAgICAgICAgICAgICAgICAgICAgYW5pbWF0ZShyZWxhdGlvbnNOZXh0LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICByaWdodDogcmVsYXRpb25zTmV4dEljb25Jbml0aWFsUG9zaXRpb24sXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBuYXZCZ1Nob3duID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHZhciBjb21wbGV0aW9uRmxhZyA9IDA7XG4gICAgaWYgKGNvbXBsZXRpb25CdXR0b24/LmNsYXNzTGlzdC5jb250YWlucyhcImJ1dHRvbkFza0NvbXBsZXRpb25cIikpIHtcbiAgICAgICAgY29tcGxldGlvbkZsYWcgPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbXBsZXRpb25GbGFnID0gMTtcbiAgICB9XG4gICAgLy8gTWFrZSBzdXJlIHdlIG1hcmsgdGhpcyBwYWdlIGFzIHZpc2l0ZWQgcmVnYXJkbGVzcyBvZiBob3cgZmxha2V5XG4gICAgLy8gdGhlIG9udW5sb2FkIGhhbmRsZXJzIGJlY29tZS5cbiAgICBwcm9jZXNzUGFnZVN0YXRlKGNvbXBsZXRpb25GbGFnLCB0cnVlLCBmYWxzZSwgZmFsc2UpO1xuICAgIGNvbXBsZXRpb25CdXR0b24/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBtYXJraW5nQ29tcGxldGUgPSBmYWxzZTtcbiAgICAgICAgdmFyIG1hcmtpbmdJbmNvbXBsZXRlID0gZmFsc2U7XG4gICAgICAgIGlmIChjb21wbGV0aW9uQnV0dG9uLmNsYXNzTGlzdC5jb250YWlucyhcImJ1dHRvbkFza0NvbXBsZXRpb25cIikpIHtcbiAgICAgICAgICAgIGNvbXBsZXRpb25CdXR0b24uY2xhc3NMaXN0LnJlbW92ZShcImJ1dHRvbkFza0NvbXBsZXRpb25cIik7XG4gICAgICAgICAgICBjb21wbGV0aW9uQnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJidXR0b25Db25maXJtQ29tcGxldGlvblwiKTtcbiAgICAgICAgICAgIGNvbXBsZXRpb25CdXR0b24uaW5uZXJIVE1MID1cbiAgICAgICAgICAgICAgICBcIjxpIGNsYXNzPSdnbHlwaGljb24gZ2x5cGhpY29uLW9rJz48L2k+IENvbXBsZXRlZC4gV2VsbCBEb25lIVwiO1xuICAgICAgICAgICAgaWYgKG5hdkxpbmtCZ1JpZ2h0KSB7XG4gICAgICAgICAgICAgICAgYW5pbWF0ZShuYXZMaW5rQmdSaWdodCwgeyByaWdodDogbmF2TGlua0JnUmlnaHRGdWxsT3BlbiB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChyZWxhdGlvbnNOZXh0KSB7XG4gICAgICAgICAgICAgICAgYW5pbWF0ZShyZWxhdGlvbnNOZXh0LCB7XG4gICAgICAgICAgICAgICAgICAgIHJpZ2h0OiByZWxhdGlvbnNOZXh0SWNvbk5ld1Bvc2l0aW9uLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbmF2TGlua0JnUmlnaHRIYWxmT3BlbiA9IDA7XG4gICAgICAgICAgICBjb21wbGV0aW9uRmxhZyA9IDE7XG4gICAgICAgICAgICBtYXJraW5nQ29tcGxldGUgPSB0cnVlO1xuICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgY29tcGxldGlvbkJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoXCJidXR0b25Db25maXJtQ29tcGxldGlvblwiKVxuICAgICAgICApIHtcbiAgICAgICAgICAgIGNvbXBsZXRpb25CdXR0b24uY2xhc3NMaXN0LnJlbW92ZShcImJ1dHRvbkNvbmZpcm1Db21wbGV0aW9uXCIpO1xuICAgICAgICAgICAgY29tcGxldGlvbkJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwiYnV0dG9uQXNrQ29tcGxldGlvblwiKTtcbiAgICAgICAgICAgIGNvbXBsZXRpb25CdXR0b24uaW5uZXJIVE1MID0gXCJNYXJrIGFzIENvbXBsZXRlZFwiO1xuICAgICAgICAgICAgbmF2TGlua0JnUmlnaHRIYWxmT3BlbiA9IG5hdkxpbmtCZ1JpZ2h0SGlkZGVuUG9zaXRpb24gKyA3MDtcbiAgICAgICAgICAgIGlmIChuYXZMaW5rQmdSaWdodCkge1xuICAgICAgICAgICAgICAgIGFuaW1hdGUobmF2TGlua0JnUmlnaHQsIHsgcmlnaHQ6IG5hdkxpbmtCZ1JpZ2h0SGFsZk9wZW4gfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocmVsYXRpb25zTmV4dCkge1xuICAgICAgICAgICAgICAgIGFuaW1hdGUocmVsYXRpb25zTmV4dCwge1xuICAgICAgICAgICAgICAgICAgICByaWdodDogcmVsYXRpb25zTmV4dEljb25Jbml0aWFsUG9zaXRpb24sXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb21wbGV0aW9uRmxhZyA9IDA7XG4gICAgICAgICAgICBtYXJraW5nSW5jb21wbGV0ZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcHJvY2Vzc1BhZ2VTdGF0ZShcbiAgICAgICAgICAgIGNvbXBsZXRpb25GbGFnLFxuICAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgICBtYXJraW5nQ29tcGxldGUsXG4gICAgICAgICAgICBtYXJraW5nSW5jb21wbGV0ZSxcbiAgICAgICAgKTtcbiAgICB9KTtcbn1cblxuLy8gXyBkZWNvcmF0ZVRhYmxlT2ZDb250ZW50c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuYXN5bmMgZnVuY3Rpb24gZGVjb3JhdGVUYWJsZU9mQ29udGVudHMoKSB7XG4gICAgaWYgKFxuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZi50b0xvd2VyQ2FzZSgpLmluZGV4T2YoXCJ0b2MuaHRtbFwiKSAhPSAtMSB8fFxuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZi50b0xvd2VyQ2FzZSgpLmluZGV4T2YoXCJpbmRleC5odG1sXCIpICE9IC0xIHx8XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihcImZyb250bWF0dGVyXCIpICE9IC0xXG4gICAgKSB7XG4gICAgICAgIGlmICghaXNQcmVUZVh0KCkpIHtcbiAgICAgICAgICAgIGxldCBkYXRhID0gYXdhaXQgZmV0Y2hKc29uKFxuICAgICAgICAgICAgICAgIGAke2VCb29rQ29uZmlnLm5ld19zZXJ2ZXJfcHJlZml4fS9sb2dnZXIvZ2V0QWxsQ29tcGxldGlvblN0YXR1c2AsXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgaWYgKGRhdGEpIHtcbiAgICAgICAgICAgICAgICBsZXQgc3ViQ2hhcHRlckxpc3QgPSBkYXRhLmRldGFpbDtcbiAgICAgICAgICAgICAgICBsZXQgYWxsU3ViQ2hhcHRlclVSTHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFxuICAgICAgICAgICAgICAgICAgICBcIiNtYWluLWNvbnRlbnQgZGl2IGxpIGFcIixcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGl0ZW0gb2Ygc3ViQ2hhcHRlckxpc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgcyA9IDA7IHMgPCBhbGxTdWJDaGFwdGVyVVJMcy5sZW5ndGg7IHMrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsbFN1YkNoYXB0ZXJVUkxzW3NdLmhyZWYuaW5kZXhPZihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5jaGFwdGVyTmFtZSArIFwiL1wiICsgaXRlbS5zdWJDaGFwdGVyTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApICE9IC0xXG4gICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5jb21wbGV0aW9uU3RhdHVzID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVjb3JhdGVUb2NFbnRyeShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsbFN1YkNoYXB0ZXJVUkxzW3NdLnBhcmVudEVsZW1lbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNvbXBsZXRlZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJpbmZvVGV4dENvbXBsZXRlZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCItIENvbXBsZXRlZCB0aGlzIHRvcGljIG9uIFwiICsgaXRlbS5lbmREYXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaXRlbS5jb21wbGV0aW9uU3RhdHVzID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVjb3JhdGVUb2NFbnRyeShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsbFN1YkNoYXB0ZXJVUkxzW3NdLnBhcmVudEVsZW1lbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFjdGl2ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJpbmZvVGV4dEFjdGl2ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJMYXN0IHJlYWQgdGhpcyB0b3BpYyBvbiBcIiArIGl0ZW0uZW5kRGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGxhc3RQYWdlID0gYXdhaXQgZmV0Y2hKc29uKFxuICAgICAgICAgICAgYCR7ZUJvb2tDb25maWcubmV3X3NlcnZlcl9wcmVmaXh9L2xvZ2dlci9nZXRsYXN0cGFnZWAsXG4gICAgICAgICAgICB7IGNvdXJzZTogZUJvb2tDb25maWcuY291cnNlIH0sXG4gICAgICAgICk7XG4gICAgICAgIGlmIChsYXN0UGFnZSkge1xuICAgICAgICAgICAgbGV0IGxhc3RQYWdlRGF0YSA9IGxhc3RQYWdlLmRldGFpbDtcbiAgICAgICAgICAgIGlmIChsYXN0UGFnZURhdGEubGFzdFBhZ2VDaGFwdGVyICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBsZXQgY29udGludWVSZWFkaW5nID1cbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb250aW51ZS1yZWFkaW5nXCIpO1xuICAgICAgICAgICAgICAgIGlmIChjb250aW51ZVJlYWRpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWVSZWFkaW5nLnN0eWxlLmRpc3BsYXkgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZVJlYWRpbmcuaW5uZXJIVE1MID1cbiAgICAgICAgICAgICAgICAgICAgICAgICc8ZGl2IGlkPVwianVtcC10by1jaGFwdGVyXCIgY2xhc3M9XCJhbGVydCBhbGVydC1pbmZvXCIgPjxzdHJvbmc+WW91IHdlcmUgTGFzdCBSZWFkaW5nOjwvc3Ryb25nPiAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RQYWdlRGF0YS5sYXN0UGFnZUNoYXB0ZXIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgKGxhc3RQYWdlRGF0YS5sYXN0UGFnZVN1YmNoYXB0ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IFwiICZndDsgXCIgKyBsYXN0UGFnZURhdGEubGFzdFBhZ2VTdWJjaGFwdGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBcIlwiKSArXG4gICAgICAgICAgICAgICAgICAgICAgICAnIDxhIGhyZWY9XCInICtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RQYWdlRGF0YS5sYXN0UGFnZVVybCArXG4gICAgICAgICAgICAgICAgICAgICAgICBcIj9sYXN0UG9zaXRpb249XCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgbGFzdFBhZ2VEYXRhLmxhc3RQYWdlU2Nyb2xsTG9jYXRpb24gK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ1wiPkNvbnRpbnVlIFJlYWRpbmc8L2E+PC9kaXY+JztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8qXG4gKiBBZGQgYSBzdGF0dXMgY2xhc3MgYW5kIGEgaG92ZXItcmV2ZWFsZWQgZGF0ZSBhbm5vdGF0aW9uIHRvIG9uZSBlbnRyeSBpblxuICogdGhlIHRhYmxlIG9mIGNvbnRlbnRzLlxuICovXG5mdW5jdGlvbiBkZWNvcmF0ZVRvY0VudHJ5KGVudHJ5LCBlbnRyeUNsYXNzLCBpbmZvQ2xhc3MsIGluZm9UZXh0KSB7XG4gICAgZW50cnkuY2xhc3NMaXN0LmFkZChlbnRyeUNsYXNzKTtcbiAgICBsZXQgaW5mbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgIGluZm8uY2xhc3NOYW1lID0gaW5mb0NsYXNzO1xuICAgIGluZm8udGV4dENvbnRlbnQgPSBpbmZvVGV4dDtcbiAgICBlbnRyeS5hcHBlbmRDaGlsZChpbmZvKTtcbiAgICBsZXQgbGluayA9IGVudHJ5LmNoaWxkcmVuWzBdO1xuICAgIGlmIChsaW5rICYmIGxpbmsgIT09IGluZm8pIHtcbiAgICAgICAgbGluay5hZGRFdmVudExpc3RlbmVyKFwibW91c2VlbnRlclwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpbmZvLnN0eWxlLmRpc3BsYXkgPSBcIlwiO1xuICAgICAgICB9KTtcbiAgICAgICAgbGluay5hZGRFdmVudExpc3RlbmVyKFwibW91c2VsZWF2ZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpbmZvLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBlbmFibGVDb21wbGV0aW9ucygpIHtcbiAgICAvLyBUaGUgY29tcGxldGlvbiBidXR0b24gbXVzdCBleGlzdCBiZWZvcmUgdGhlIG5hdmlnYXRpb24gbG9naWMgbG9va3NcbiAgICAvLyBmb3IgaXQgKHRoZSBqUXVlcnkgdmVyc2lvbiB1c2VkIGEgc3luY2hyb25vdXMgcmVxdWVzdCBoZXJlKS5cbiAgICAvLyBPbmx5IHN1YmNoYXB0ZXJzIGhhdmUgcHJvZ3Jlc3MgdG8gZmV0Y2ggb3IgcmVjb3JkOyB0aGUgdGFibGUgb2ZcbiAgICAvLyBjb250ZW50cyBkZWNvcmF0aW9ucyBiZWxvdyBiZWxvbmcgdG8gcGFnZXMgdGhhdCBhcmUgbm90LlxuICAgIGNvbnN0IHN1YmNoYXB0ZXJQYWdlID0gaXNTdWJjaGFwdGVyUGFnZSgpO1xuICAgIGlmIChzdWJjaGFwdGVyUGFnZSkge1xuICAgICAgICBhd2FpdCBnZXRDb21wbGV0aW9ucygpO1xuICAgIH1cbiAgICBzaG93TGFzdFBvc2l0aW9uQmFubmVyKCk7XG4gICAgaWYgKHN1YmNoYXB0ZXJQYWdlKSB7XG4gICAgICAgIGFkZE5hdmlnYXRpb25BbmRDb21wbGV0aW9uQnV0dG9ucygpO1xuICAgIH1cbiAgICBhd2FpdCBkZWNvcmF0ZVRhYmxlT2ZDb250ZW50cygpO1xufVxuXG4vLyBjYWxsIGVuYWJsZSB1c2VyIGhpZ2hsaWdodHMgYWZ0ZXIgbG9naW5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJydW5lc3RvbmU6bG9naW5cIiwgZW5hYmxlQ29tcGxldGlvbnMpO1xuXG5mdW5jdGlvbiBpc1ByZVRlWHQoKSB7XG4gICAgbGV0IHB0eE1hcmtlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJib2R5LnByZXRleHRcIik7XG4gICAgaWYgKHB0eE1hcmtlcikge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufVxuLy8gXyBwcm9jZXNzUGFnZVN0YXRlXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5hc3luYyBmdW5jdGlvbiBwcm9jZXNzUGFnZVN0YXRlKFxuICAgIGNvbXBsZXRpb25GbGFnLFxuICAgIHBhZ2VMb2FkLFxuICAgIG1hcmtpbmdDb21wbGV0ZSxcbiAgICBtYXJraW5nSW5jb21wbGV0ZSxcbikge1xuICAgIC8qTG9nIGxhc3QgcGFnZSB2aXNpdGVkKi9cbiAgICB2YXIgY3VycmVudFBhdGhuYW1lID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lO1xuICAgIGlmIChjdXJyZW50UGF0aG5hbWUuaW5kZXhPZihcIj9cIikgIT09IC0xKSB7XG4gICAgICAgIGN1cnJlbnRQYXRobmFtZSA9IGN1cnJlbnRQYXRobmFtZS5zdWJzdHJpbmcoXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgY3VycmVudFBhdGhuYW1lLmxhc3RJbmRleE9mKFwiP1wiKSxcbiAgICAgICAgKTtcbiAgICB9XG4gICAgLy8gSXMgdGhpcyBhIHB0eCBib29rP1xuICAgIGxldCBpc1B0eEJvb2sgPSBpc1ByZVRlWHQoKTtcbiAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgbGFzdFBhZ2VVcmw6IGN1cnJlbnRQYXRobmFtZSxcbiAgICAgICAgbGFzdFBhZ2VTY3JvbGxMb2NhdGlvbjogTWF0aC5yb3VuZCh3aW5kb3cuc2Nyb2xsWSksXG4gICAgICAgIGNvbXBsZXRpb25GbGFnOiBjb21wbGV0aW9uRmxhZyxcbiAgICAgICAgcGFnZUxvYWQ6IHBhZ2VMb2FkLFxuICAgICAgICBtYXJraW5nQ29tcGxldGU6IG1hcmtpbmdDb21wbGV0ZSxcbiAgICAgICAgbWFya2luZ0luY29tcGxldGU6IG1hcmtpbmdJbmNvbXBsZXRlLFxuICAgICAgICBjb3Vyc2U6IGVCb29rQ29uZmlnLmNvdXJzZSxcbiAgICAgICAgaXNQdHhCb29rOiBpc1B0eEJvb2ssXG4gICAgfTtcbiAgICBsZXQgdXJsID0gYCR7ZUJvb2tDb25maWcubmV3X3NlcnZlcl9wcmVmaXh9L2xvZ2dlci91cGRhdGVsYXN0cGFnZWA7XG4gICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgZmV0Y2godXJsLCB7XG4gICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICAgICAgaGVhZGVyczogeyBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLThcIiB9LFxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZGF0YSksXG4gICAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlJlcXVlc3QgRmFpbGVkIGZvciBcIiArIHVybCk7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBnZXRVcmxWYXIobmFtZSkge1xuICAgIHJldHVybiBuZXcgVVJMU2VhcmNoUGFyYW1zKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gpLmdldChuYW1lKTtcbn1cbiIsImltcG9ydCBSdW5lc3RvbmVCYXNlIGZyb20gXCIuLi8uLi9jb21tb24vanMvcnVuZXN0b25lYmFzZS5qc1wiO1xuXG5pbnRlcmZhY2UgU3BsaWNlTWVzc2FnZURhdGEge1xuICAgIHN1YmplY3Q6IHN0cmluZztcbiAgICBhY3Rpdml0eV9pZD86IHN0cmluZztcbiAgICBzY29yZT86IG51bWJlcjtcbiAgICBzdGF0ZT86IHVua25vd247XG4gICAgbmFtZT86IHN0cmluZztcbiAgICBtZXNzYWdlX2lkPzogc3RyaW5nO1xuICAgIGZyYW1lX2lkPzogc3RyaW5nO1xuICAgIGp3dD86IHN0cmluZztcbn1cblxuaW50ZXJmYWNlIFNhdmVkU3RhdGVSZXNwb25zZSB7XG4gICAgZGV0YWlsOiB7XG4gICAgICAgIGFuc3dlcjogdW5rbm93bjtcbiAgICB9O1xufVxuXG5pbnRlcmZhY2UgSnd0UGF5bG9hZCB7XG4gICAgc2NvcmU6IG51bWJlcjtcbiAgICBba2V5OiBzdHJpbmddOiB1bmtub3duO1xufVxuXG5kZWNsYXJlIGNvbnN0IGVCb29rQ29uZmlnOiB7XG4gICAgY291cnNlOiBzdHJpbmc7XG4gICAgW2tleTogc3RyaW5nXTogdW5rbm93bjtcbn07XG5cbmV4cG9ydCBjbGFzcyBTcGxpY2VXcmFwcGVyIGV4dGVuZHMgUnVuZXN0b25lQmFzZSB7XG4gICAgLyoqXG4gICAgICogSWZyYW1lcyB0aGUgZ3JhZGluZyBpbnRlcmZhY2UgaXMgY3VycmVudGx5IGRpc3BsYXlpbmcsIG1hcHBlZCB0byB0aGVcbiAgICAgKiBzYXZlZCBzdGF0ZSBvZiB0aGUgYXR0ZW1wdCBiZWluZyByZXZpZXdlZC4gU2VlIGBgcmVnaXN0ZXJHcmFkZXJGcmFtZWBgLlxuICAgICAqL1xuICAgIGdyYWRlckZyYW1lczogTWFwPEhUTUxJRnJhbWVFbGVtZW50LCB1bmtub3duPiA9IG5ldyBNYXAoKTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmluaXRTcGxpY2UoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUZWxsIHRoZSB3cmFwcGVyIHRoYXQgYGBmcmFtZWBgIGlzIHNob3dpbmcgb25lIHN0dWRlbnQncyBhdHRlbXB0IHRvIGFuXG4gICAgICogaW5zdHJ1Y3RvciByYXRoZXIgdGhhbiBiZWluZyB3b3JrZWQgYnkgaXRzIG93bmVyLiBXaGlsZSBpdCBpcyByZWdpc3RlcmVkXG4gICAgICogYGBTUExJQ0UuZ2V0U3RhdGVgYCBpcyBhbnN3ZXJlZCB3aXRoIGBgc3RhdGVgYCBpbnN0ZWFkIG9mIHdoYXRldmVyIHRoZVxuICAgICAqIHNlcnZlciBoYXMgZm9yIHRoZSBsb2dnZWQtaW4gdXNlciAtLSB3aGljaCB3b3VsZCBiZSB0aGUgKmluc3RydWN0b3IncypcbiAgICAgKiB3b3JrIC0tIGFuZCBhbnl0aGluZyB0aGUgYWN0aXZpdHkgcmVwb3J0cyBiYWNrIGlzIGRyb3BwZWQsIHNvIHBva2luZyBhdFxuICAgICAqIGl0IHdoaWxlIGdyYWRpbmcgbmV2ZXIgd3JpdGVzIHRvIGFuIGFuc3dlciB0YWJsZS5cbiAgICAgKi9cbiAgICByZWdpc3RlckdyYWRlckZyYW1lKGZyYW1lOiBIVE1MSUZyYW1lRWxlbWVudCwgc3RhdGU6IHVua25vd24pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5ncmFkZXJGcmFtZXMuc2V0KGZyYW1lLCBzdGF0ZSk7XG4gICAgfVxuXG4gICAgdW5yZWdpc3RlckdyYWRlckZyYW1lKGZyYW1lOiBIVE1MSUZyYW1lRWxlbWVudCk6IHZvaWQge1xuICAgICAgICB0aGlzLmdyYWRlckZyYW1lcy5kZWxldGUoZnJhbWUpO1xuICAgIH1cblxuICAgIGhhbmRsZUdyYWRlckZyYW1lTWVzc2FnZShldmVudDogTWVzc2FnZUV2ZW50PFNwbGljZU1lc3NhZ2VEYXRhPiwgc3RhdGU6IHVua25vd24pOiB2b2lkIHtcbiAgICAgICAgaWYgKGV2ZW50LmRhdGEuc3ViamVjdCA9PSBcIlNQTElDRS5nZXRTdGF0ZVwiKSB7XG4gICAgICAgICAgICAoZXZlbnQuc291cmNlIGFzIFdpbmRvdykucG9zdE1lc3NhZ2UoXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlX2lkOiBldmVudC5kYXRhLm1lc3NhZ2VfaWQsXG4gICAgICAgICAgICAgICAgICAgIHN1YmplY3Q6IFwiU1BMSUNFLmdldFN0YXRlLnJlc3BvbnNlXCIsXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlOiBzdGF0ZSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwiKlwiXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIC8vIFNjb3JlcyBhbmQgZXZlbnRzIHJhaXNlZCBmcm9tIGEgZ3JhZGVyIGZyYW1lIGJlbG9uZyB0byBub2JvZHk6IHRoZVxuICAgICAgICAvLyBpbnN0cnVjdG9yIGlzIGxvb2tpbmcgYXQgc29tZW9uZSBlbHNlJ3MgYXR0ZW1wdCwgc28gd2UgZHJvcCB0aGVtLlxuICAgIH1cblxuICAgIGluaXRTcGxpY2UoKTogdm9pZCB7XG4gICAgICAgIC8vIFNQTElDRSBFdmVudHNcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIGFzeW5jIChldmVudDogTWVzc2FnZUV2ZW50PFNwbGljZU1lc3NhZ2VEYXRhPikgPT4ge1xuICAgICAgICAgICAgdmFyIHNvdXJjZUlmcmFtZSA9IHRoaXMuc2VuZGluZ0lmcmFtZShldmVudCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgU3BsaWNlV3JhcHBlcjogcmVjZWl2ZWQgbWVzc2FnZSBzdWJqZWN0OiAke2V2ZW50LmRhdGEuc3ViamVjdH0gZnJvbSBpZnJhbWU6ICR7c291cmNlSWZyYW1lID8gc291cmNlSWZyYW1lLmlkIDogXCJ1bmtub3duXCJ9YCk7XG4gICAgICAgICAgICBpZiAoc291cmNlSWZyYW1lICYmIHRoaXMuZ3JhZGVyRnJhbWVzLmhhcyhzb3VyY2VJZnJhbWUpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVHcmFkZXJGcmFtZU1lc3NhZ2UoZXZlbnQsIHRoaXMuZ3JhZGVyRnJhbWVzLmdldChzb3VyY2VJZnJhbWUpKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZXZlbnQuZGF0YS5zdWJqZWN0ID09IFwiU1BMSUNFLnJlcG9ydFNjb3JlQW5kU3RhdGVcIikge1xuICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlU2NvcmVBbmRTdGF0ZShldmVudCwgc291cmNlSWZyYW1lKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXZlbnQuZGF0YS5zdWJqZWN0ID09IFwiU1BMSUNFLnNlbmRFdmVudFwiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVTcGxpY2VFdmVudChldmVudCwgc291cmNlSWZyYW1lKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXZlbnQuZGF0YS5zdWJqZWN0ID09IFwiU1BMSUNFLmdldFN0YXRlXCIpIHtcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmhhbmRsZUdldFN0YXRlKGV2ZW50LCBzb3VyY2VJZnJhbWUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgICAgICBldmVudC5vcmlnaW4gPT09IFwiaHR0cHM6Ly93d3cubXlvcGVubWF0aC5jb21cIiAmJlxuICAgICAgICAgICAgICAgIHR5cGVvZiBldmVudC5kYXRhID09PSBcInN0cmluZ1wiICYmXG4gICAgICAgICAgICAgICAgKGV2ZW50LmRhdGEgYXMgdW5rbm93biBhcyBzdHJpbmcpLmluZGV4T2YoXCJsdGkuZXh0LmltYXRoYXMucmVzdWx0XCIpICE9IC0xXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAvLyBwcm9vZiBvZiBjb25jZXB0IGZvciBNeSBPcGVuIE1hdGhcbiAgICAgICAgICAgICAgICBsZXQgbXNnZGF0YSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSBhcyB1bmtub3duIGFzIHN0cmluZyk7XG4gICAgICAgICAgICAgICAgbGV0IGp3dCA9IGJhc2ljUGFyc2VKd3QobXNnZGF0YS5qd3QpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgICAgICAgICAgICBcIlJlc3VsdCByZWNlaXZlZCBmcm9tIGZyYW1lIFwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1zZ2RhdGEuZnJhbWVfaWQgK1xuICAgICAgICAgICAgICAgICAgICAgICAgXCIgd2l0aCBzY29yZSBcIiArXG4gICAgICAgICAgICAgICAgICAgICAgICBqd3Quc2NvcmVcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIC8vIHRvZG8gc2VuZCBzY29yZSB0byBzZXJ2ZXJcbiAgICAgICAgICAgICAgICAvLyBkb2VzIE1PTSBoYXZlIGEgd2F5IHRvIGdldCB0aGUgc3RhdGU/XG4gICAgICAgICAgICAgICAgLy8gdG9kbyBzZW5kIHN0YXRlIHRvIHNlcnZlclxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBnZXRVbmlxdWVJRChldmVudDogTWVzc2FnZUV2ZW50PFNwbGljZU1lc3NhZ2VEYXRhPiwgZnJhbWU6IEhUTUxJRnJhbWVFbGVtZW50IHwgdW5kZWZpbmVkKTogc3RyaW5nIHtcbiAgICAgICAgLy8gRGV0ZXJtaW5lIHRoZSB1bmlxdWUgaWRlbnRpZmllciBmb3IgdGhpcyBhY3Rpdml0eVxuICAgICAgICAvLyBUaGUgU1BMSUNFIHByb3RvY29sIGFsbG93cyBmb3IgdHdvIHBvc3NpYmlsaXRpZXNcbiAgICAgICAgLy8gMS4gYWN0aXZpdHlfaWQgaXMgdGhlIHVuaXF1ZSBpZCBhcyBhc3NpZ25lZCBieSB0aGUgcHJvdmlkZXJcbiAgICAgICAgLy8gMi4gYWN0aXZpdHlfaWQgaXMgdGhlIGlmcmFtZSBzcmMgdXJsXG4gICAgICAgIC8vIGlmIHRoZSBhY3Rpdml0eV9pZCBpcyBzZXQgdGhlcmUgbWF5IGFsc28gYmUgYW5vdGhlciBhdHRyaWJ1dGUgY2FsbGVkIGRvbWFpblxuICAgICAgICAvLyBPbiBSdW5lc3RvbmUgd2Ugd2lsbCB0cnkgdG8gbWFwIHRoZSBhY3Rpdml0eSB0byB0aGUgZGl2X2lkIG9mIHRoZSBlbmNsb3NpbmcgUlMgY29tcG9uZW50XG4gICAgICAgIC8vIGlmIHBvc3NpYmxlLCBvdGhlcndpc2Ugd2Ugd2lsbCB1c2UgdGhlIGFjdGl2aXR5X2lkIG9yIGlmcmFtZSBzcmNcbiAgICAgICAgLy8gSWYgYW4gaW50ZXJhY3RpdmUgaXMgaW5jbHVkZWQgaW4gYW4gZXhlcmNpc2VzIHRoaXMgYWxsb3dzIHVzIHRvIG1hcCB0aGUgc2NvcmVcbiAgICAgICAgLy8gdG8gdGhlIGlkIHRoZSBpbnN0cnVjdG9yIHVzZWQgdG8gYXNzaWduIHRoZSBwcm9ibGVtLlxuICAgICAgICBpZiAoZnJhbWUpIHtcbiAgICAgICAgICAgIGxldCByc0RpdiA9IGZyYW1lLmNsb3Nlc3QoXCJbZGF0YS1jb21wb25lbnRdXCIpO1xuICAgICAgICAgICAgaWYgKHJzRGl2KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJzRGl2LmlkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGxldCBsb2NhdGlvbiA9IGV2ZW50LmRhdGEuYWN0aXZpdHlfaWQ7XG4gICAgICAgIGlmICghbG9jYXRpb24pIHtcbiAgICAgICAgICAgIGlmIChmcmFtZSkge1xuICAgICAgICAgICAgICAgIGxvY2F0aW9uID0gZnJhbWUuc3JjO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsb2NhdGlvbiA9IFwidW5rbm93blwiO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAgICAgICAgICAgICAgIFwiQ291bGQgbm90IGZpbmQgaWZyYW1lIHRoYXQgc2VudCB0aGUgU1BMSUNFIGV2ZW50XCJcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBsb2NhdGlvbjtcbiAgICB9XG5cbiAgICBoYW5kbGVTY29yZUFuZFN0YXRlKGV2ZW50OiBNZXNzYWdlRXZlbnQ8U3BsaWNlTWVzc2FnZURhdGE+LCBmcmFtZTogSFRNTElGcmFtZUVsZW1lbnQgfCB1bmRlZmluZWQpOiB2b2lkIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJHb3QgU1BMSUNFLnJlcG9ydFNjb3JlQW5kU3RhdGVcIik7XG4gICAgICAgIGNvbnNvbGUubG9nKGV2ZW50LmRhdGEuYWN0aXZpdHlfaWQpO1xuICAgICAgICBjb25zb2xlLmxvZyhldmVudC5kYXRhLnNjb3JlKTtcbiAgICAgICAgY29uc29sZS5sb2coZXZlbnQuZGF0YS5zdGF0ZSk7XG4gICAgICAgIGxldCBsb2NhdGlvbiA9IHRoaXMuZ2V0VW5pcXVlSUQoZXZlbnQsIGZyYW1lKTtcbiAgICAgICAgdGhpcy5sb2dCb29rRXZlbnQoe1xuICAgICAgICAgICAgZXZlbnQ6IGV2ZW50LmRhdGEuc3ViamVjdCxcbiAgICAgICAgICAgIGRpdl9pZDogbG9jYXRpb24sXG4gICAgICAgICAgICBhY3Q6IGBzY29yZTogJHtldmVudC5kYXRhLnNjb3JlfWAsXG4gICAgICAgICAgICBzY29yZTogZXZlbnQuZGF0YS5zY29yZSxcbiAgICAgICAgICAgIHBlcmNlbnQ6IGV2ZW50LmRhdGEuc2NvcmUsXG4gICAgICAgICAgICBjb3JyZWN0OiBldmVudC5kYXRhLnNjb3JlID09IDEuMCA/IHRydWUgOiBmYWxzZSxcbiAgICAgICAgICAgIGFuc3dlcjogSlNPTi5zdHJpbmdpZnkoZXZlbnQuZGF0YS5zdGF0ZSksXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHNlbmRpbmdJZnJhbWUoZXZlbnQ6IE1lc3NhZ2VFdmVudCk6IEhUTUxJRnJhbWVFbGVtZW50IHwgdW5kZWZpbmVkIHtcbiAgICAgICAgLy8gZGV0ZXJtaW5lIHRoZSBpZnJhbWUgdGhhdCBzZW50IHRoZSBldmVudFxuICAgICAgICAvLyB5b3Ugd291bGQgdGhpbmsgdGhhdCBldmVudC5zb3VyY2Ugd291bGQgYmUgdGhlIGlmcmFtZVxuICAgICAgICAvLyBidXQgaXQgaXMgbm90IGFuZCBnZXR0aW5nIHRoZSBsb2NhdGlvbiBvdXQgb2YgZXZlbnQuc291cmNlXG4gICAgICAgIC8vIGNyZWF0ZXMgQ09SUyBpc3N1ZXMuXG4gICAgICAgIGZvciAoY29uc3QgZiBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImlmcmFtZVwiKSkge1xuICAgICAgICAgICAgaWYgKGYuY29udGVudFdpbmRvdyA9PT0gZXZlbnQuc291cmNlKSByZXR1cm4gZjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGFzeW5jIGdldFNhdmVkU3RhdGUobG9jYXRpb246IHN0cmluZyk6IFByb21pc2U8U2F2ZWRTdGF0ZVJlc3BvbnNlIHwgbnVsbD4ge1xuICAgICAgICAvLyBmZXRjaCB0aGUgc3RhdGUgZnJvbSB0aGUgc2VydmVyXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFwiL25zL2Fzc2Vzc21lbnQvcmVzdWx0c1wiLCB7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgICAgICBkaXZfaWQ6IGxvY2F0aW9uLFxuICAgICAgICAgICAgICAgICAgICBjb3Vyc2U6IGVCb29rQ29uZmlnLmNvdXJzZSxcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQ6IFwiU1BMSUNFLmdldFN0YXRlXCIsXG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEhUVFAgZXJyb3IhIHN0YXR1czogJHtyZXNwb25zZS5zdGF0dXN9YCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBkYXRhOiBTYXZlZFN0YXRlUmVzcG9uc2UgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBmZXRjaGluZyBTUExJQ0Ugc3RhdGU6XCIsIGVycm9yKTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgaGFuZGxlR2V0U3RhdGUoZXZlbnQ6IE1lc3NhZ2VFdmVudDxTcGxpY2VNZXNzYWdlRGF0YT4sIGZyYW1lOiBIVE1MSUZyYW1lRWxlbWVudCB8IHVuZGVmaW5lZCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkdvdCBTUExJQ0UuZ2V0U3RhdGVcIik7XG4gICAgICAgIGNvbnNvbGUubG9nKGV2ZW50LmRhdGEuYWN0aXZpdHlfaWQpO1xuICAgICAgICBjb25zb2xlLmxvZyhldmVudC5kYXRhLnN0YXRlKTtcbiAgICAgICAgLy8gc3ViamVjdCBpcyBTUExJQ0UuZ2V0U3RhdGUucmVzcG9uc2VcbiAgICAgICAgbGV0IGxvY2F0aW9uID0gdGhpcy5nZXRVbmlxdWVJRChldmVudCwgZnJhbWUpO1xuICAgICAgICBsZXQgcmVzID0gYXdhaXQgdGhpcy5nZXRTYXZlZFN0YXRlKGxvY2F0aW9uKTtcbiAgICAgICAgbGV0IHN0YXRlID0gcmVzPy5kZXRhaWwuYW5zd2VyO1xuICAgICAgICAoZXZlbnQuc291cmNlIGFzIFdpbmRvdykucG9zdE1lc3NhZ2UoXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZV9pZDogZXZlbnQuZGF0YS5tZXNzYWdlX2lkLFxuICAgICAgICAgICAgICAgIHN1YmplY3Q6IFwiU1BMSUNFLmdldFN0YXRlLnJlc3BvbnNlXCIsXG4gICAgICAgICAgICAgICAgc3RhdGU6IHN0YXRlLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiKlwiXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgaGFuZGxlU3BsaWNlRXZlbnQoZXZlbnQ6IE1lc3NhZ2VFdmVudDxTcGxpY2VNZXNzYWdlRGF0YT4sIGZyYW1lOiBIVE1MSUZyYW1lRWxlbWVudCB8IHVuZGVmaW5lZCk6IHZvaWQge1xuICAgICAgICAvLyBoYW5kbGUgZ2VuZXJpYyBTUExJQ0UgZXZlbnRzLCBzdWNoIGFzIGxvZ2dlZCBjbGlja3NcbiAgICAgICAgLy8gb3Igb3RoZXIgZXZlbnRzLiAgU1BMSUNFIGRvZXMgbm90IHJlcXVpcmUgdGhhdCB3ZSBkb1xuICAgICAgICAvLyBhbnl0aGluZyB3aXRoIHRoZW0sIGJ1dCBpbiBrZWVwaW5nIHdpdGggb3VyIHRyYWRpdGlvblxuICAgICAgICAvLyB3ZSB3aWxsIHNhdmUgdGhlbSB0byB0aGUgdXNlaW5mbyB0YWJsZSBpbiB0aGUgZGF0YWJhc2VcbiAgICAgICAgLy8gaW4gY2FzZSB0aGV5IHByb3ZlIHRvIGJlIHVzZWZ1bCBmb3IgcmVzZWFyY2ggbGF0ZXJcbiAgICAgICAgY29uc29sZS5sb2coXCJHb3QgU1BMSUNFLnNlbmRFdmVudFwiKTtcbiAgICAgICAgY29uc29sZS5sb2coZXZlbnQuZGF0YS5hY3Rpdml0eV9pZCk7XG4gICAgICAgIGNvbnNvbGUubG9nKGV2ZW50LmRhdGEubmFtZSk7XG4gICAgICAgIGxldCBsb2NhdGlvbiA9IHRoaXMuZ2V0VW5pcXVlSUQoZXZlbnQsIGZyYW1lKTtcbiAgICAgICAgdGhpcy5sb2dCb29rRXZlbnQoe1xuICAgICAgICAgICAgZXZlbnQ6IGV2ZW50LmRhdGEuc3ViamVjdCxcbiAgICAgICAgICAgIGRpdl9pZDogbG9jYXRpb24sXG4gICAgICAgICAgICBhY3Q6IGV2ZW50LmRhdGEubmFtZSB8fCBcInVua25vd25cIixcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gdGhlc2Ugc3R1YnMgYXJlIG5vdCBpbXBsZW1lbnRlZCwgYnV0IGFyZSByZXF1aXJlZCBieSB0aGUgUnVuZXN0b25lQmFzZSBjbGFzc1xuICAgIGNoZWNrTG9jYWxTdG9yYWdlKCk6IHZvaWQge31cbiAgICBzZXRMb2NhbFN0b3JhZ2UoKTogdm9pZCB7fVxuICAgIHJlc3RvcmVBbnN3ZXJzKCk6IHZvaWQge31cbiAgICBkaXNhYmxlSW50ZXJhY3Rpb24oKTogdm9pZCB7fVxufVxuXG5mdW5jdGlvbiBiYXNpY1BhcnNlSnd0KHRva2VuOiBzdHJpbmcpOiBKd3RQYXlsb2FkIHtcbiAgICB2YXIgYmFzZTY0VXJsID0gdG9rZW4uc3BsaXQoXCIuXCIpWzFdO1xuICAgIHZhciBiYXNlNjQgPSBiYXNlNjRVcmwucmVwbGFjZSgvLS9nLCBcIitcIikucmVwbGFjZSgvXy9nLCBcIi9cIik7XG4gICAgdmFyIGpzb25QYXlsb2FkID0gZGVjb2RlVVJJQ29tcG9uZW50KFxuICAgICAgICB3aW5kb3dcbiAgICAgICAgICAgIC5hdG9iKGJhc2U2NClcbiAgICAgICAgICAgIC5zcGxpdChcIlwiKVxuICAgICAgICAgICAgLm1hcChmdW5jdGlvbiAoYzogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCIlXCIgKyAoXCIwMFwiICsgYy5jaGFyQ29kZUF0KDApLnRvU3RyaW5nKDE2KSkuc2xpY2UoLTIpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5qb2luKFwiXCIpXG4gICAgKTtcbiAgICByZXR1cm4gSlNPTi5wYXJzZShqc29uUGF5bG9hZCkgYXMgSnd0UGF5bG9hZDtcbn1cbiIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiB8ZG9jbmFtZXwgLSBSdW5lc3RvbmUgQmFzZSBDbGFzc1xuICogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIEFsbCBydW5lc3RvbmUgY29tcG9uZW50cyBzaG91bGQgaW5oZXJpdCBmcm9tIFJ1bmVzdG9uZUJhc2UuIEluIGFkZGl0aW9uIGFsbCBydW5lc3RvbmUgY29tcG9uZW50cyBzaG91bGQgZG8gdGhlIGZvbGxvd2luZyB0aGluZ3M6XG4gKlxuICogMS4gICBFbnN1cmUgdGhhdCB0aGV5IGFyZSB3cmFwcGVkIGluIGEgZGl2IHdpdGggdGhlIGNsYXNzIHJ1bmVzdG9uZVxuICogMi4gICBXcml0ZSB0aGVpciBzb3VyY2UgQU5EIHRoZWlyIGdlbmVyYXRlZCBodG1sIHRvIHRoZSBkYXRhYmFzZSBpZiB0aGUgZGF0YWJhc2UgaXMgY29uZmlndXJlZFxuICogMy4gICBQcm9wZXJseSBzYXZlIGFuZCByZXN0b3JlIHRoZWlyIGFuc3dlcnMgdXNpbmcgdGhlIGNoZWNrU2VydmVyIG1lY2hhbmlzbSBpbiB0aGlzIGJhc2UgY2xhc3MuIEVhY2ggY29tcG9uZW50IG11c3QgcHJvdmlkZSBhbiBpbXBsZW1lbnRhdGlvbiBvZjpcbiAqXG4gKiAgICAgIC0gICAgY2hlY2tMb2NhbFN0b3JhZ2VcbiAqICAgICAgLSAgICBzZXRMb2NhbFN0b3JhZ2VcbiAqICAgICAgLSAgICByZXN0b3JlQW5zd2Vyc1xuICogICAgICAtICAgIGRpc2FibGVJbnRlcmFjdGlvblxuICpcbiAqIDQuICAgcHJvdmlkZSBhIFNlbGVuaXVtIGJhc2VkIHVuaXQgdGVzdFxuICovXG5cbmltcG9ydCB7IHBhZ2VQcm9ncmVzc1RyYWNrZXIgfSBmcm9tIFwiLi9ib29rZnVuY3MuanNcIjtcbmltcG9ydCB7IGdldERhdGFWYWx1ZSB9IGZyb20gXCIuL2RvbXV0aWwuanNcIjtcbi8vaW1wb3J0IFwiLi8uLi9zdHlsZXMvcnVuZXN0b25lLmNzc1wiO1xuXG52YXIgTk9fREVDT1JBVEUgPSBbXG4gICAgXCJwYXJzb25zTW92ZVwiLFxuICAgIFwic2hvd2V2YWxcIixcbiAgICBcInZpZGVvXCIsXG4gICAgXCJwb2xsXCIsXG4gICAgXCJ2aWV3X3RvZ2dsZVwiLFxuICAgIFwiZGFzaGJvYXJkXCIsXG4gICAgXCJzZWxlY3RxdWVzdGlvblwiLFxuICAgIFwiY29kZWxlbnNcIixcbiAgICBcInBlZXJcIixcbl07XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSdW5lc3RvbmVCYXNlIHtcbiAgICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgICAgIHRoaXMuY29tcG9uZW50X3JlYWR5X3Byb21pc2UgPSBuZXcgUHJvbWlzZShcbiAgICAgICAgICAgIChyZXNvbHZlKSA9PiAodGhpcy5fY29tcG9uZW50X3JlYWR5X3Jlc29sdmVfZm4gPSByZXNvbHZlKSxcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5vcHRpb25hbCA9IGZhbHNlO1xuICAgICAgICBpZiAodHlwZW9mIHdpbmRvdy5hbGxDb21wb25lbnRzID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICB3aW5kb3cuYWxsQ29tcG9uZW50cyA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIHdpbmRvdy5hbGxDb21wb25lbnRzLnB1c2godGhpcyk7XG4gICAgICAgIGlmIChvcHRzKSB7XG4gICAgICAgICAgICB0aGlzLnNpZCA9IG9wdHMuc2lkO1xuICAgICAgICAgICAgdGhpcy5ncmFkZXJhY3RpdmUgPSBvcHRzLmdyYWRlcmFjdGl2ZTtcbiAgICAgICAgICAgIHRoaXMuc2hvd2ZlZWRiYWNrID0gdHJ1ZTtcbiAgICAgICAgICAgIGlmIChvcHRzLnRpbWVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pc1RpbWVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvcHRzLmVuZm9yY2VEZWFkbGluZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZGVhZGxpbmUgPSBvcHRzLmRlYWRsaW5lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5vcHRpb25hbCA9IHRoaXMucGFyc2VCb29sZWFuQXR0cmlidXRlKFxuICAgICAgICAgICAgICAgIG9wdHMub3JpZyxcbiAgICAgICAgICAgICAgICBcImRhdGEtb3B0aW9uYWxcIixcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBpZiAob3B0cy5zZWxlY3Rvcl9pZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0b3JfaWQgPSBvcHRzLnNlbGVjdG9yX2lkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHR5cGVvZiBvcHRzLmFzc2Vzc21lbnRUYWtlbiAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgIHRoaXMuYXNzZXNzbWVudFRha2VuID0gb3B0cy5hc3Nlc3NtZW50VGFrZW47XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGRlZmF1bHQgdG8gdHJ1ZSBhcyB0aGlzIG9wdCBpcyBvbmx5IHByb3ZpZGVkIGZyb20gYSB0aW1lZEFzc2Vzc21lbnRcbiAgICAgICAgICAgICAgICB0aGlzLmFzc2Vzc21lbnRUYWtlbiA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBUaGlzIGlzIGZvciB0aGUgc2VsZWN0cXVlc3Rpb24gcG9pbnRzXG4gICAgICAgICAgICAvLyBJZiBhIHNlbGVjdHF1ZXN0aW9uIGlzIHBhcnQgb2YgYSB0aW1lZCBleGFtIGl0IHdpbGwgZ2V0XG4gICAgICAgICAgICAvLyB0aGUgdGltZWRXcmFwcGVyIG9wdGlvbnMuXG4gICAgICAgICAgICBpZiAodHlwZW9mIG9wdHMudGltZWRXcmFwcGVyICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50aW1lZFdyYXBwZXIgPSBvcHRzLnRpbWVkV3JhcHBlcjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gSG93ZXZlciBzb21ldGltZXMgc2VsZWN0cXVlc3Rpb25zXG4gICAgICAgICAgICAgICAgLy8gYXJlIHVzZWQgaW4gcmVndWxhciBhc3NpZ25tZW50cy4gIFRoZSBoYWNreSB3YXkgdG8gZGV0ZWN0IHRoaXNcbiAgICAgICAgICAgICAgICAvLyBpcyB0byBsb29rIGZvciBkb0Fzc2lnbm1lbnQgaW4gdGhlIFVSTCBhbmQgdGhlbiBncmFiXG4gICAgICAgICAgICAgICAgLy8gdGhlIGFzc2lnbm1lbnQgbmFtZSBmcm9tIHRoZSBoZWFkaW5nLlxuICAgICAgICAgICAgICAgIGlmIChsb2NhdGlvbi5ocmVmLmluZGV4T2YoXCJkb0Fzc2lnbm1lbnRcIikgPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRpbWVkV3JhcHBlciA9XG4gICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiaDEjYXNzaWdubWVudF9uYW1lXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPy50ZXh0Q29udGVudCB8fCBcIlwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGltZWRXcmFwcGVyID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAob3B0cy5vcmlnICYmIGdldERhdGFWYWx1ZShvcHRzLm9yaWcsIFwicXVlc3Rpb25fbGFiZWxcIikpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnF1ZXN0aW9uX2xhYmVsID0gZ2V0RGF0YVZhbHVlKG9wdHMub3JpZywgXCJxdWVzdGlvbl9sYWJlbFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuaXNfdG9nZ2xlID0gdHJ1ZSA/IG9wdHMuaXNfdG9nZ2xlIDogZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmlzX3NlbGVjdCA9IHRydWUgPyBvcHRzLmlzX3NlbGVjdCA6IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRzICYmIHR5cGVvZiBvcHRzLnByZWFtYmxlICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICB0aGlzLnByZWFtYmxlID0gb3B0cy5wcmVhbWJsZTtcbiAgICAgICAgICAgIGxldCB5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgIHkuY2xhc3NMaXN0LmFkZChcImhpZGRlbi1jb250ZW50XCIpO1xuICAgICAgICAgICAgeS5jbGFzc0xpc3QuYWRkKFwicHJvY2Vzcy1tYXRoXCIpO1xuICAgICAgICAgICAgeS5pbm5lckhUTUwgPSBcIlxcXFwoXCIgKyB0aGlzLnByZWFtYmxlICsgXCJcXFxcKVwiO1xuICAgICAgICAgICAgLy8gVGhpcyBpcyBhIGhhY2sgdG8gZ2V0IHRoZSBwcmVhbWJsZSBpbnRvIHRoZSBET00gc28gdGhhdCBNYXRoSmF4IGNhbiBwcm9jZXNzIGl0LlxuICAgICAgICAgICAgb3B0cy5vcmlnLmFwcGVuZENoaWxkKHkpO1xuICAgICAgICAgICAgeS5pZCA9IFwibHR4X3ByZWFtYmxlXCI7XG4gICAgICAgICAgICB5LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgICAgIC8vIHF1ZXVlTWF0aEpheCB0eXBlc2V0cyB0aGlzIGJlZm9yZSB0aGUgY29tcG9uZW50J3Mgb3duIG1hdGguXG4gICAgICAgICAgICB0aGlzLnByZWFtYmxlRGl2ID0geTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuanNvbkhlYWRlcnMgPSBuZXcgSGVhZGVycyh7XG4gICAgICAgICAgICBcIkNvbnRlbnQtdHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLThcIixcbiAgICAgICAgICAgIEFjY2VwdDogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIEhlbHBlciBmb3IgcGFyc2luZyBib29sZWFuIGRhdGEtKiBhdHRyaWJ1dGVzXG4gICAgLy8gVW5zZXQvXCJmYWxzZVwiL1wibm9cIiBtZWFucyBmYWxzZSwgYW55dGhpbmcgZWxzZSwgaW5jbHVkaW5nIGVtcHR5IHN0cmluZyBtZWFucyB0cnVlXG4gICAgcGFyc2VCb29sZWFuQXR0cmlidXRlKGVsZW1lbnQsIGF0dHJpYnV0ZU5hbWUpIHtcbiAgICAgICAgY29uc3QgYXR0clZhbHVlID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoYXR0cmlidXRlTmFtZSk7XG4gICAgICAgIGlmIChhdHRyVmFsdWUgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBsb3dlclZhbHVlID0gYXR0clZhbHVlLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGlmIChsb3dlclZhbHVlID09PSBcImZhbHNlXCIgfHwgbG93ZXJWYWx1ZSA9PT0gXCJub1wiKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLy8gX2Bsb2dCb29rRXZlbnRgXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gVGhpcyBmdW5jdGlvbiBzZW5kcyB0aGUgcHJvdmlkZWQgYGBldmVudEluZm9gYCB0byB0aGUgYGhzYmxvZyBlbmRwb2ludGAgb2YgdGhlIHNlcnZlci4gQXdhaXRpbmcgdGhpcyBmdW5jdGlvbiByZXR1cm5zIGVpdGhlciBgYHVuZGVmaW5lZGBgIChpZiBSdW5lc3RvbmUgc2VydmljZXMgYXJlIG5vdCBhdmFpbGFibGUpIG9yIHRoZSBkYXRhIHJldHVybmVkIGJ5IHRoZSBzZXJ2ZXIgYXMgYSBKYXZhU2NyaXB0IG9iamVjdCAoYWxyZWFkeSBKU09OLWRlY29kZWQpLlxuICAgIGFzeW5jIGxvZ0Jvb2tFdmVudChldmVudEluZm8pIHtcbiAgICAgICAgaWYgKHRoaXMuZ3JhZGVyYWN0aXZlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHBvc3RfcmV0dXJuO1xuICAgICAgICBldmVudEluZm8uY291cnNlX25hbWUgPSBlQm9va0NvbmZpZy5jb3Vyc2U7XG4gICAgICAgIGV2ZW50SW5mby5jbGllbnRMb2dpblN0YXR1cyA9IGVCb29rQ29uZmlnLmlzTG9nZ2VkSW47XG4gICAgICAgIGV2ZW50SW5mby50aW1lem9uZW9mZnNldCA9IG5ldyBEYXRlKCkuZ2V0VGltZXpvbmVPZmZzZXQoKSAvIDYwO1xuICAgICAgICAvLyBGb3Igc2VsZWN0cXVlc3Rpb25zIHdlIG5lZWQgdG8gbG9nIHVzaW5nIHRoZSBzZWxlY3Rvcl9pZCBmb3IgcmVhbCB0aW1lIHNjb3JpbmdcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0b3JfaWQpIHtcbiAgICAgICAgICAgIGV2ZW50SW5mby5zZWxlY3Rvcl9pZCA9IHRoaXMuc2VsZWN0b3JfaWQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLnBlcmNlbnQgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgIGV2ZW50SW5mby5wZXJjZW50ID0gdGhpcy5wZXJjZW50O1xuICAgICAgICB9XG4gICAgICAgIGlmICh3aW5kb3cuYXNzaWdubWVudElkKSB7XG4gICAgICAgICAgICBldmVudEluZm8uYXNzaWdubWVudF9pZCA9IHdpbmRvdy5hc3NpZ25tZW50SWQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgZUJvb2tDb25maWcuaXNMb2dnZWRJbiAmJlxuICAgICAgICAgICAgZUJvb2tDb25maWcudXNlUnVuZXN0b25lU2VydmljZXMgJiZcbiAgICAgICAgICAgIGVCb29rQ29uZmlnLmxvZ0xldmVsID4gMFxuICAgICAgICApIHtcbiAgICAgICAgICAgIHBvc3RfcmV0dXJuID0gdGhpcy5wb3N0TG9nTWVzc2FnZShldmVudEluZm8pO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5pc1RpbWVkIHx8IGVCb29rQ29uZmlnLmRlYnVnKSB7XG4gICAgICAgICAgICBsZXQgcHJlZml4ID0gZUJvb2tDb25maWcuaXNMb2dnZWRJbiA/IFwiU2F2ZVwiIDogXCJOb3RcIjtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGAke3ByZWZpeH0gbG9nZ2luZyBldmVudCBgICsgSlNPTi5zdHJpbmdpZnkoZXZlbnRJbmZvKSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gV2hlbiBzZWxlY3RxdWVzdGlvbnMgYXJlIHBhcnQgb2YgYW4gYXNzaWdubWVudCBlc3BlY2lhbGx5IHRvZ2dsZSBxdWVzdGlvbnNcbiAgICAgICAgLy8gd2UgbmVlZCB0byBjb3VudCB1c2luZyB0aGUgc2VsZWN0b3JfaWQgb2YgdGhlIHNlbGVjdCBxdWVzdGlvbi5cbiAgICAgICAgLy8gV2UgIGFsc28gbmVlZCB0byBsb2cgYW4gZXZlbnQgZm9yIHRoYXQgc2VsZWN0b3Igc28gdGhhdCB3ZSB3aWxsIGtub3dcbiAgICAgICAgLy8gdGhhdCBpbnRlcmFjdGlvbiBoYXMgdGFrZW4gcGxhY2UuICBUaGlzIGlzICoqaW5kZXBlbmRlbnQqKiBvZiBob3cgdGhlXG4gICAgICAgIC8vIGF1dG9ncmFkZXIgd2lsbCB1bHRpbWF0ZWx5IGdyYWRlIHRoZSBxdWVzdGlvbiFcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0b3JfaWQpIHtcbiAgICAgICAgICAgIGV2ZW50SW5mby5kaXZfaWQgPSB0aGlzLnNlbGVjdG9yX2lkLnJlcGxhY2UoXG4gICAgICAgICAgICAgICAgXCItdG9nZ2xlU2VsZWN0ZWRRdWVzdGlvblwiLFxuICAgICAgICAgICAgICAgIFwiXCIsXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgZXZlbnRJbmZvLmV2ZW50ID0gXCJzZWxlY3RxdWVzdGlvblwiO1xuICAgICAgICAgICAgZXZlbnRJbmZvLmFjdCA9IFwiaW50ZXJhY3Rpb25cIjtcbiAgICAgICAgICAgIHRoaXMucG9zdExvZ01lc3NhZ2UoZXZlbnRJbmZvKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoXG4gICAgICAgICAgICB0eXBlb2YgcGFnZVByb2dyZXNzVHJhY2tlci51cGRhdGVQcm9ncmVzcyA9PT0gXCJmdW5jdGlvblwiICYmXG4gICAgICAgICAgICBldmVudEluZm8uYWN0ICE9IFwiZWRpdFwiICYmXG4gICAgICAgICAgICB0aGlzLm9wdGlvbmFsID09IGZhbHNlXG4gICAgICAgICkge1xuICAgICAgICAgICAgcGFnZVByb2dyZXNzVHJhY2tlci51cGRhdGVQcm9ncmVzcyhldmVudEluZm8uZGl2X2lkKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBpZiB0aGUgZXZlbnQgaXMgaW4gdGhlIE5PX0RFQ09SQVRFIGxpc3QgdGhlbiBkb24ndCBkZWNvcmF0ZSB0aGUgc3RhdHVzXG4gICAgICAgIGlmIChOT19ERUNPUkFURS5pbmRleE9mKGV2ZW50SW5mby5ldmVudCkgPT09IC0xKSB7XG4gICAgICAgICAgICB0aGlzLmRlY29yYXRlU3RhdHVzKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBvc3RfcmV0dXJuO1xuICAgIH1cblxuICAgIGFzeW5jIHBvc3RMb2dNZXNzYWdlKGV2ZW50SW5mbykge1xuICAgICAgICB2YXIgcG9zdF9yZXR1cm47XG4gICAgICAgIGxldCByZXF1ZXN0ID0gbmV3IFJlcXVlc3QoXG4gICAgICAgICAgICBgJHtlQm9va0NvbmZpZy5uZXdfc2VydmVyX3ByZWZpeH0vbG9nZ2VyL2Jvb2tldmVudGAsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB0aGlzLmpzb25IZWFkZXJzLFxuICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGV2ZW50SW5mbyksXG4gICAgICAgICAgICB9LFxuICAgICAgICApO1xuICAgICAgICBsZXQgcmVzcG9uc2U7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXNwb25zZSA9IGF3YWl0IGZldGNoKHJlcXVlc3QpO1xuICAgICAgICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDQyMikge1xuICAgICAgICAgICAgICAgICAgICAvLyBHZXQgZGV0YWlscyBhYm91dCB3aHkgdGhpcyBpcyB1bnByb2Nlc2FibGUuXG4gICAgICAgICAgICAgICAgICAgIHBvc3RfcmV0dXJuID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShwb3N0X3JldHVybi5kZXRhaWwsIG51bGwsIDQpKTtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5wcm9jZXNzYWJsZSBSZXF1ZXN0XCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocmVzcG9uc2Uuc3RhdHVzID09IDQwMSkge1xuICAgICAgICAgICAgICAgICAgICBwb3N0X3JldHVybiA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgICAgICAgICAgICAgICBgTWlzc2luZyBhdXRoZW50aWNhdGlvbiB0b2tlbiAke3Bvc3RfcmV0dXJuLmRldGFpbH1gLFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNaXNzaW5nIGF1dGhlbnRpY2F0aW9uIHRva2VuXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEZhaWxlZCB0byBzYXZlIHRoZSBsb2cgZW50cnlcbiAgICAgICAgICAgICAgICAgICAgU3RhdHVzOiAke3Jlc3BvbnNlLnN0YXR1c31gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBvc3RfcmV0dXJuID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBsZXQgZGV0YWlsID0gXCJub25lXCI7XG4gICAgICAgICAgICBpZiAocG9zdF9yZXR1cm4gJiYgcG9zdF9yZXR1cm4uZGV0YWlsKSB7XG4gICAgICAgICAgICAgICAgZGV0YWlsID0gcG9zdF9yZXR1cm4uZGV0YWlsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gYGByZXNwb25zZWBgIGlzIHVuc2V0IGlmIGZldGNoIGl0c2VsZiByZWplY3RlZC5cbiAgICAgICAgICAgIGxldCBzdGF0dXNDb2RlID0gcmVzcG9uc2UgPyByZXNwb25zZS5zdGF0dXMgOiBcIm5vIHJlc3BvbnNlXCI7XG4gICAgICAgICAgICBpZiAoZUJvb2tDb25maWcudXNlUnVuZXN0b25lU2VydmljZXMpIHtcbiAgICAgICAgICAgICAgICBhbGVydChgRXJyb3I6IFlvdXIgYWN0aW9uIHdhcyBub3Qgc2F2ZWQhXG4gICAgICAgICAgICAgICAgICAgIFRoZSBlcnJvciB3YXMgJHtlfVxuICAgICAgICAgICAgICAgICAgICBTdGF0dXMgQ29kZTogJHtzdGF0dXNDb2RlfVxuICAgICAgICAgICAgICAgICAgICBEZXRhaWw6ICR7SlNPTi5zdHJpbmdpZnkoZGV0YWlsLCBudWxsLCA0KX0uXG4gICAgICAgICAgICAgICAgICAgIFBsZWFzZSByZXBvcnQgdGhpcyBlcnJvciFgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHNlbmQgYSByZXF1ZXN0IHRvIHNhdmUgdGhpcyBlcnJvclxuICAgICAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgICAgICAgYEVycm9yOiAke2V9IERldGFpbDogJHtkZXRhaWx9IFN0YXR1cyBDb2RlOiAke3N0YXR1c0NvZGV9YCxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gcG9zdF9yZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gVGhlIGxvZyBlbnRyeSBpcyBzYXZlZC4gRXZlcnl0aGluZyBiZWxvdyBvbmx5IHVwZGF0ZXMgdGhlIHNjb3JlIGRpc3BsYXkgb25cbiAgICAgICAgLy8gYW4gYXNzaWdubWVudCBwYWdlOyBhIGZhaWx1cmUgaGVyZSBpcyBhIGRpc3BsYXkgYnVnLCBub3QgYSBsb3N0IHN1Ym1pc3Npb24sXG4gICAgICAgIC8vIHNvIGl0IG11c3QgbmV2ZXIgcmVhY2ggdGhlIGFsZXJ0IGFib3ZlLiBTZWUgaXNzdWUgIzEzOTMuXG4gICAgICAgIHRoaXMuc2hvd1JldHVybmVkU2NvcmUocG9zdF9yZXR1cm4pO1xuICAgICAgICByZXR1cm4gcG9zdF9yZXR1cm47XG4gICAgfVxuICAgIC8vIHVwZGF0ZSB0aGUgc2NvcmUgZm9yIHRoZSBxdWVzdGlvbiBhbmQgdGhlIHRvdGFsIHNjb3JlXG4gICAgLy8gdGhlIHByZXNlbmNlIG9mIHRoZSBncmFkZUJveCBpcyB1c2VkIHRvIGRldGVybWluZSBpZiB3ZSBhcmUgb24gYW4gYXNzaWdubWVudCBwYWdlLlxuICAgIHVwZGF0ZVNjb3JlcyhncmFkZUJveCwgc2NvcmVTcGVjKSB7XG4gICAgICAgIGlmICghc2NvcmVTcGVjLmFzc2lnbmVkIHx8IHNjb3JlU3BlYy5zY29yZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgLy8gTm90IGV2ZXJ5IGNvbXBvbmVudCBoYXMgYSBtYXRjaGluZyBtZXNzYWdlIGRpdiwgYW5kIHNlbGVjdCBxdWVzdGlvbnNcbiAgICAgICAgICAgIC8vIG5hbWUgdGhlaXJzIGFmdGVyIHRoZSBzZWxlY3RvciByYXRoZXIgdGhhbiB0aGUgcmVuZGVyZWQgcXVlc3Rpb24uXG4gICAgICAgICAgICBsZXQgbWVzc2FnZUJveCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGAke3RoaXMuZGl2aWR9X21lc3NhZ2VgKTtcbiAgICAgICAgICAgIGlmIChtZXNzYWdlQm94KSB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZUJveC5pbm5lckhUTUwgPVxuICAgICAgICAgICAgICAgICAgICBcIlNjb3JlIG5vdCB1cGRhdGVkLiAgU3VibWlzc2lvbnMgYXJlIGNsb3NlZC5cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgc2NvcmVTcGFuID0gZ3JhZGVCb3guZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInFzY29yZVwiKVswXTtcbiAgICAgICAgaWYgKHNjb3JlU3Bhbikge1xuICAgICAgICAgICAgc2NvcmVTcGFuLmlubmVySFRNTCA9IHNjb3JlU3BlYy5zY29yZS50b0ZpeGVkKDEpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBhbGxTY29yZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwicXNjb3JlXCIpO1xuICAgICAgICBsZXQgYWxsbWF4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInFtYXhzY29yZVwiKTtcbiAgICAgICAgbGV0IHRvdGFsID0gMDtcbiAgICAgICAgbGV0IG1heCA9IDA7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYWxsU2NvcmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0b3RhbCArPSBwYXJzZUZsb2F0KGFsbFNjb3Jlc1tpXS5pbm5lckhUTUwpO1xuICAgICAgICAgICAgbWF4ICs9IHBhcnNlRmxvYXQoYWxsbWF4W2ldLmlubmVySFRNTCk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHRvdGFsU3BhbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidG90YWxfc2NvcmVcIik7XG4gICAgICAgIGlmICh0b3RhbFNwYW4pIHtcbiAgICAgICAgICAgIHRvdGFsU3Bhbi5pbm5lckhUTUwgPSB0b3RhbC50b0ZpeGVkKDEpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBtYXhTcGFuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0b3RhbF9tYXhcIik7XG4gICAgICAgIGlmIChtYXhTcGFuKSB7XG4gICAgICAgICAgICBtYXhTcGFuLmlubmVySFRNTCA9IG1heDtcbiAgICAgICAgfVxuICAgICAgICBsZXQgcGVyY2VudFNwYW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRvdGFsX3BlcmNlbnRcIik7XG4gICAgICAgIGlmIChwZXJjZW50U3Bhbikge1xuICAgICAgICAgICAgcGVyY2VudFNwYW4uaW5uZXJIVE1MID0gKCh0b3RhbCAvIG1heCkgKiAxMDApLnRvRml4ZWQoMik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBVcGRhdGUgdGhlIHNjb3JlIHNob3duIG9uIGFuIGFzc2lnbm1lbnQgcGFnZSBmcm9tIHRoZSBzY29yZSBzcGVjIGEgbG9nZ2luZ1xuICAgIC8vIGVuZHBvaW50IHJldHVybmVkIGluIGBgZGV0YWlsYGAuIE5ldmVyIHRocm93czogdGhlIGFuc3dlciBpcyBhbHJlYWR5IHNhdmVkLlxuICAgIHNob3dSZXR1cm5lZFNjb3JlKHBvc3RfcmV0dXJuKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgc2NvcmVTcGVjID0gcG9zdF9yZXR1cm4gPyBwb3N0X3JldHVybi5kZXRhaWwgOiBudWxsO1xuICAgICAgICAgICAgLy8gT25seSBncmFkZWQgZXZlbnRzIGNvbWUgYmFjayB3aXRoIGEgc2NvcmUgc3BlYy4gVW5ncmFkZWQgb25lcyAtLVxuICAgICAgICAgICAgLy8gdmlld190b2dnbGUsIHNlbGVjdHF1ZXN0aW9uLCBwYXJzb25zTW92ZSBhbmQgZnJpZW5kcyAtLSBoYXZlIG5vIHNjb3JlXG4gICAgICAgICAgICAvLyB0byByZXBvcnQsIHNvIHRoZXJlIGlzIG5vdGhpbmcgdG8gdXBkYXRlLlxuICAgICAgICAgICAgaWYgKHNjb3JlU3BlYyAmJiBcImFzc2lnbmVkXCIgaW4gc2NvcmVTcGVjICYmICF0aGlzLmlzVGltZWQpIHtcbiAgICAgICAgICAgICAgICBsZXQgYm94SWQgPSB0aGlzLnNlbGVjdG9yX2lkXG4gICAgICAgICAgICAgICAgICAgID8gdGhpcy5zZWxlY3Rvcl9pZC5yZXBsYWNlKFwiLXRvZ2dsZVNlbGVjdGVkUXVlc3Rpb25cIiwgXCJcIilcbiAgICAgICAgICAgICAgICAgICAgOiB0aGlzLmRpdmlkO1xuICAgICAgICAgICAgICAgIGxldCBncmFkZUJveCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGAke2JveElkfV9zY29yZWApO1xuICAgICAgICAgICAgICAgIGlmIChncmFkZUJveCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVNjb3JlcyhncmFkZUJveCwgc2NvcmVTcGVjKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYENvdWxkIG5vdCB1cGRhdGUgdGhlIHNjb3JlIGRpc3BsYXk6ICR7ZX1gKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIC4uIF9sb2dSdW5FdmVudDpcbiAgICAvL1xuICAgIC8vIGxvZ1J1bkV2ZW50XG4gICAgLy8gLS0tLS0tLS0tLS1cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIHNlbmRzIHRoZSBwcm92aWRlZCBgYGV2ZW50SW5mb2BgIHRvIHRoZSBgcnVubG9nIGVuZHBvaW50YC4gV2hlbiBhd2FpdGVkLCB0aGlzIGZ1bmN0aW9uIHJldHVybnMgdGhlIGRhdGEgKGRlY29kZWQgZnJvbSBKU09OKSB0aGUgc2VydmVyIHNlbnQgYmFjay5cbiAgICBhc3luYyBsb2dSdW5FdmVudChldmVudEluZm8pIHtcbiAgICAgICAgbGV0IHBvc3RfcHJvbWlzZSA9IFwiZG9uZVwiO1xuICAgICAgICBpZiAodGhpcy5ncmFkZXJhY3RpdmUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBldmVudEluZm8uY291cnNlID0gZUJvb2tDb25maWcuY291cnNlO1xuICAgICAgICBldmVudEluZm8uY2xpZW50TG9naW5TdGF0dXMgPSBlQm9va0NvbmZpZy5pc0xvZ2dlZEluO1xuICAgICAgICBldmVudEluZm8udGltZXpvbmVvZmZzZXQgPSBuZXcgRGF0ZSgpLmdldFRpbWV6b25lT2Zmc2V0KCkgLyA2MDtcbiAgICAgICAgaWYgKHRoaXMuZm9yY2VTYXZlIHx8IFwidG9fc2F2ZVwiIGluIGV2ZW50SW5mbyA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGV2ZW50SW5mby5zYXZlX2NvZGUgPSBcIlRydWVcIjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGV2ZW50SW5mby5lcnJpbmZvICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBldmVudEluZm8uZXJyaW5mbyA9IGV2ZW50SW5mby5lcnJpbmZvLnRvU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQSBydW4gaXMgZ3JhZGVkIHdoZW4gdGhlIHF1ZXN0aW9uIGlzIHNjb3JlZCBvbiBpbnRlcmFjdGlvbiwgd2hpY2ggbmVlZHNcbiAgICAgICAgLy8gdGhlIHNhbWUgYXNzaWdubWVudCBhbmQgc2VsZWN0cXVlc3Rpb24gY29udGV4dCBhcyBgYGxvZ0Jvb2tFdmVudGBgLlxuICAgICAgICBpZiAodGhpcy5zZWxlY3Rvcl9pZCkge1xuICAgICAgICAgICAgZXZlbnRJbmZvLnNlbGVjdG9yX2lkID0gdGhpcy5zZWxlY3Rvcl9pZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAod2luZG93LmFzc2lnbm1lbnRJZCkge1xuICAgICAgICAgICAgZXZlbnRJbmZvLmFzc2lnbm1lbnRfaWQgPSB3aW5kb3cuYXNzaWdubWVudElkO1xuICAgICAgICB9XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIGVCb29rQ29uZmlnLmlzTG9nZ2VkSW4gJiZcbiAgICAgICAgICAgIGVCb29rQ29uZmlnLnVzZVJ1bmVzdG9uZVNlcnZpY2VzICYmXG4gICAgICAgICAgICBlQm9va0NvbmZpZy5sb2dMZXZlbCA+IDBcbiAgICAgICAgKSB7XG4gICAgICAgICAgICBsZXQgcmVxdWVzdCA9IG5ldyBSZXF1ZXN0KFxuICAgICAgICAgICAgICAgIGAke2VCb29rQ29uZmlnLm5ld19zZXJ2ZXJfcHJlZml4fS9sb2dnZXIvcnVubG9nYCxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHRoaXMuanNvbkhlYWRlcnMsXG4gICAgICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGV2ZW50SW5mbyksXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChyZXF1ZXN0KTtcbiAgICAgICAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgICAgICAgICBwb3N0X3Byb21pc2UgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICAgICAgICAgICAgaWYgKGVCb29rQ29uZmlnLnVzZVJ1bmVzdG9uZVNlcnZpY2VzKSB7XG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KGBGYWlsZWQgdG8gc2F2ZSB5b3VyIGNvZGVcbiAgICAgICAgICAgICAgICAgICAgICAgIFN0YXR1cyBpcyAke3Jlc3BvbnNlLnN0YXR1c31cbiAgICAgICAgICAgICAgICAgICAgICAgIERldGFpbDogJHtKU09OLnN0cmluZ2lmeShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3N0X3Byb21pc2UuZGV0YWlsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgNCxcbiAgICAgICAgICAgICAgICAgICAgICAgICl9YCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgICAgICAgICAgICAgICBgRGlkIG5vdCBzYXZlIHRoZSBjb2RlLlxuICAgICAgICAgICAgICAgICAgICAgICAgIFN0YXR1czogJHtyZXNwb25zZS5zdGF0dXN9XG4gICAgICAgICAgICAgICAgICAgICAgICAgRGV0YWlsOiAke0pTT04uc3RyaW5naWZ5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3N0X3Byb21pc2UuZGV0YWlsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICA0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICl9YCxcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHBvc3RfcHJvbWlzZSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dSZXR1cm5lZFNjb3JlKHBvc3RfcHJvbWlzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLmlzVGltZWQgfHwgZUJvb2tDb25maWcuZGVidWcpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicnVubmluZyBcIiArIEpTT04uc3RyaW5naWZ5KGV2ZW50SW5mbykpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHR5cGVvZiBwYWdlUHJvZ3Jlc3NUcmFja2VyLnVwZGF0ZVByb2dyZXNzID09PSBcImZ1bmN0aW9uXCIgJiZcbiAgICAgICAgICAgIHRoaXMub3B0aW9uYWwgPT0gZmFsc2VcbiAgICAgICAgKSB7XG4gICAgICAgICAgICBwYWdlUHJvZ3Jlc3NUcmFja2VyLnVwZGF0ZVByb2dyZXNzKGV2ZW50SW5mby5kaXZfaWQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwb3N0X3Byb21pc2U7XG4gICAgfVxuICAgIC8qIENoZWNraW5nL2xvYWRpbmcgZnJvbSBzdG9yYWdlXG4gICAgKipXQVJOSU5HOioqICBETyBOT1QgYGF3YWl0YCB0aGlzIGZ1bmN0aW9uIVxuICAgIFRoaXMgZnVuY3Rpb24sIGFsdGhvdWdoIGFzeW5jLCBkb2VzIG5vdCBleHBsaWNpdGx5IHJlc29sdmUgaXRzIHByb21pc2UgYnkgcmV0dXJuaW5nIGEgdmFsdWUuICBUaGUgcmVhc29uIGZvciB0aGlzIGlzIGJlY2F1c2UgaXQgaXMgY2FsbGVkIGJ5IHRoZSBjb25zdHJ1Y3RvciBmb3IgbmVhcmx5IGV2ZXJ5IGNvbXBvbmVudC4gIEluIEphdmFzY3JpcHQgY29uc3RydWN0b3JzIGNhbm5vdCBiZSBhc3luYyFcblxuICAgIE9uZSBvZiB0aGUgcmVjb21tZW5kZWQgd2F5cyB0byBoYW5kbGUgdGhlIGFzeW5jIHJlcXVpcmVtZW50cyBmcm9tIHdpdGhpbiBhIGNvbnN0cnVjdG9yIGlzIHRvIHVzZSBhbiBhdHRyaWJ1dGUgYXMgYSBwcm9taXNlIGFuZCByZXNvbHZlIHRoYXQgYXR0cmlidXRlIGF0IHRoZSBhcHByb3ByaWF0ZSB0aW1lLlxuICAgICovXG4gICAgYXN5bmMgY2hlY2tTZXJ2ZXIoXG4gICAgICAgIC8vIEEgc3RyaW5nIHNwZWNpZnlpbmcgdGhlIGV2ZW50IG5hbWUgdG8gdXNlIGZvciBxdWVyeWluZyB0aGUgOnJlZjpgZ2V0QXNzZXNzUmVzdWx0c2AgZW5kcG9pbnQuXG4gICAgICAgIGV2ZW50SW5mbyxcbiAgICAgICAgLy8gSWYgdHJ1ZSwgdGhpcyBmdW5jdGlvbiB3aWxsIGludm9rZSBgYGluZGljYXRlX2NvbXBvbmVudF9yZWFkeSgpYGAganVzdCBiZWZvcmUgaXQgcmV0dXJucy4gVGhpcyBpcyBwcm92aWRlZCBzaW5jZSBtb3N0IGNvbXBvbmVudHMgYXJlIHJlYWR5IGFmdGVyIHRoaXMgZnVuY3Rpb24gY29tcGxldGVzIGl0cyB3b3JrLlxuICAgICAgICAvL1xuICAgICAgICAvLyBUT0RPOiBUaGlzIGRlZmF1bHRzIHRvIGZhbHNlLCB0byBhdm9pZCBjYXVzaW5nIHByb2JsZW1zIHdpdGggYW55IGNvbXBvbmVudHMgdGhhdCBoYXZlbid0IGJlZW4gdXBkYXRlZCBhbmQgdGVzdGVkLiBBZnRlciBhbGwgUnVuZXN0b25lIGNvbXBvbmVudHMgaGF2ZSBiZWVuIHVwZGF0ZWQsIGRlZmF1bHQgdGhpcyB0byB0cnVlIGFuZCByZW1vdmUgdGhlIGV4dHJhIHBhcmFtZXRlciBmcm9tIG1vc3QgY2FsbHMgdG8gdGhpcyBmdW5jdGlvbi5cbiAgICAgICAgd2lsbF9iZV9yZWFkeSA9IGZhbHNlLFxuICAgICkge1xuICAgICAgICAvLyBDaGVjayBpZiB0aGUgc2VydmVyIGhhcyBzdG9yZWQgYW5zd2VyXG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgdGhpcy5jaGVja1NlcnZlckNvbXBsZXRlID0gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgc2VsZi5jc3Jlc29sdmVyID0gcmVzb2x2ZTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIGVCb29rQ29uZmlnLmlzTG9nZ2VkSW4gJiZcbiAgICAgICAgICAgICh0aGlzLnVzZVJ1bmVzdG9uZVNlcnZpY2VzIHx8IHRoaXMuZ3JhZGVyYWN0aXZlKVxuICAgICAgICApIHtcbiAgICAgICAgICAgIGxldCBkYXRhID0ge307XG4gICAgICAgICAgICBkYXRhLmRpdl9pZCA9IHRoaXMuZGl2aWQ7XG4gICAgICAgICAgICBkYXRhLmNvdXJzZSA9IGVCb29rQ29uZmlnLmNvdXJzZTtcbiAgICAgICAgICAgIGRhdGEuZXZlbnQgPSBldmVudEluZm87XG4gICAgICAgICAgICBpZiAodGhpcy5ncmFkZXJhY3RpdmUgJiYgdGhpcy5kZWFkbGluZSkge1xuICAgICAgICAgICAgICAgIGRhdGEuZGVhZGxpbmUgPSB0aGlzLmRlYWRsaW5lO1xuICAgICAgICAgICAgICAgIGRhdGEucmF3ZGVhZGxpbmUgPSB0aGlzLnJhd2RlYWRsaW5lO1xuICAgICAgICAgICAgICAgIGRhdGEudHpvZmYgPSB0aGlzLnR6b2ZmO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuc2lkKSB7XG4gICAgICAgICAgICAgICAgZGF0YS5zaWQgPSB0aGlzLnNpZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghKGRhdGEuZGl2X2lkICYmIGRhdGEuY291cnNlICYmIGRhdGEuZXZlbnQpKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgICAgICAgICAgIGBBIHJlcXVpcmVkIGZpZWxkIGlzIG1pc3NpbmcgZGF0YSAke2RhdGEuZGl2X2lkfToke2RhdGEuY291cnNlfToke2RhdGEuZXZlbnR9YCxcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gSWYgd2UgYXJlIE5PVCBpbiBwcmFjdGljZSBtb2RlIGFuZCB3ZSBhcmUgbm90IGluIGEgcGVlciBleGVyY2lzZVxuICAgICAgICAgICAgLy8gYW5kIGFzc2Vzc21lbnRUYWtlbiBpcyB0cnVlXG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgIWVCb29rQ29uZmlnLnByYWN0aWNlX21vZGUgJiZcbiAgICAgICAgICAgICAgICAhZUJvb2tDb25maWcucGVlciAmJlxuICAgICAgICAgICAgICAgIHRoaXMuYXNzZXNzbWVudFRha2VuXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBsZXQgcmVxdWVzdCA9IG5ldyBSZXF1ZXN0KFxuICAgICAgICAgICAgICAgICAgICBgJHtlQm9va0NvbmZpZy5uZXdfc2VydmVyX3ByZWZpeH0vYXNzZXNzbWVudC9yZXN1bHRzYCxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGRhdGEpLFxuICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVyczogdGhpcy5qc29uSGVhZGVycyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHJlcXVlc3QpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgUmVzcG9uc2UgZnJvbSBzZXJ2ZXI6ICR7cmVzcG9uc2Uuc3RhdHVzfWApO1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2Uub2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhID0gZGF0YS5kZXRhaWw7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBgRGF0YSBmcm9tIHNlcnZlcjogJHtKU09OLnN0cmluZ2lmeShkYXRhKX0gY2FsbGluZyByZXBvcHVsYXRlRnJvbVN0b3JhZ2VgLFxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVwb3B1bGF0ZUZyb21TdG9yYWdlKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hdHRlbXB0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBkYXRhLmNvcnJlY3QgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvcnJlY3QgPSBkYXRhLmNvcnJlY3Q7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29ycmVjdCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgcmVzb2x2aW5nIGNoZWNrU2VydmVyIHdpdGggc2VydmVyIGRhdGFgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3NyZXNvbHZlcihcInNlcnZlclwiKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBIVFRQIEVycm9yIGdldHRpbmcgcmVzdWx0czogJHtyZXNwb25zZS5zdGF0dXNUZXh0fWAsXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGVja0xvY2FsU3RvcmFnZSgpOyAvLyBqdXN0IGdvIHJpZ2h0IHRvIGxvY2FsIHN0b3JhZ2VcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGByZXNvbHZpbmcgY2hlY2tTZXJ2ZXIgd2l0aCBsb2NhbCBkYXRhYCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNzcmVzb2x2ZXIoXCJsb2NhbFwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgRXJyb3IgZ2V0dGluZyByZXN1bHRzOiAke2Vycn1gKTtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tMb2NhbFN0b3JhZ2UoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWREYXRhKHt9KTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgcmVzb2x2aW5nIGNoZWNrU2VydmVyIG5vIGFuc3dlciBnaXZlbmApO1xuICAgICAgICAgICAgICAgIHRoaXMuY3NyZXNvbHZlcihcIm5vdCB0YWtlblwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY2hlY2tMb2NhbFN0b3JhZ2UoKTsgLy8ganVzdCBnbyByaWdodCB0byBsb2NhbCBzdG9yYWdlXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgcmVzb2x2aW5nIGNoZWNrU2VydmVyIHdpdGggbG9jYWwgZGF0YWApO1xuICAgICAgICAgICAgdGhpcy5jc3Jlc29sdmVyKFwibG9jYWxcIik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAod2lsbF9iZV9yZWFkeSkge1xuICAgICAgICAgICAgdGhpcy5pbmRpY2F0ZV9jb21wb25lbnRfcmVhZHkoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFRoaXMgbWV0aG9kIGFzc3VtZXMgdGhhdCBgYHRoaXMuY29tcG9uZW50RGl2YGAgcmVmZXJzIHRvIHRoZSBgYGRpdmBgIGNvbnRhaW5pbmcgdGhlIGNvbXBvbmVudCwgYW5kIHRoYXQgdGhpcyBjb21wb25lbnQncyBJRCBpcyBzZXQuXG4gICAgaW5kaWNhdGVfY29tcG9uZW50X3JlYWR5KCkge1xuICAgICAgICAvLyBBZGQgYSBjbGFzcyB0byBpbmRpY2F0ZSB0aGUgY29tcG9uZW50IGlzIG5vdyByZWFkeS5cbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYuY2xhc3NMaXN0LmFkZChcInJ1bmVzdG9uZS1jb21wb25lbnQtcmVhZHlcIik7XG4gICAgICAgIC8vIFJlc29sdmUgdGhlIGBgdGhpcy5jb21wb25lbnRfcmVhZHlfcHJvbWlzZWBgLlxuICAgICAgICB0aGlzLl9jb21wb25lbnRfcmVhZHlfcmVzb2x2ZV9mbigpO1xuICAgIH1cblxuICAgIGxvYWREYXRhKGRhdGEpIHtcbiAgICAgICAgLy8gZm9yIG1vc3QgY2xhc3NlcywgbG9hZERhdGEgZG9lc24ndCBkbyBhbnl0aGluZy4gQnV0IGZvciBQYXJzb25zLCBhbmQgcGVyaGFwcyBvdGhlcnMgaW4gdGhlIGZ1dHVyZSxcbiAgICAgICAgLy8gaW5pdGlhbGl6YXRpb24gY2FuIGhhcHBlbiBldmVuIHdoZW4gdGhlcmUncyBubyBoaXN0b3J5IHRvIGJlIGxvYWRlZFxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZXBvcHVsYXRlRnJvbVN0b3JhZ2UgaXMgY2FsbGVkIGFmdGVyIGEgc3VjY2Vzc2Z1bCBBUEkgY2FsbCBpcyBtYWRlIHRvIGBgZ2V0QXNzZXNzUmVzdWx0c2BgIGluXG4gICAgICogdGhlIGNoZWNrU2VydmVyIG1ldGhvZCBpbiB0aGlzIGNsYXNzXG4gICAgICpcbiAgICAgKiBgYHJlc3RvcmVBbnN3ZXJzLGBgIGBgc2V0TG9jYWxTdG9yYWdlYGAgYW5kIGBgY2hlY2tMb2NhbFN0b3JhZ2VgYCBhcmUgZGVmaW5lZCBpbiB0aGUgY2hpbGQgY2xhc3Nlcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Kn0gZGF0YSAtIGEgSlNPTiBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBkYXRhIG5lZWRlZCB0byByZXN0b3JlIGEgcHJldmlvdXMgYW5zd2VyIGZvciBhIGNvbXBvbmVudFxuICAgICAqIEBwYXJhbSB7Kn0gc3RhdHVzIC0gdGhlIGh0dHAgc3RhdHVzXG4gICAgICogQHBhcmFtIHsqfSB3aGF0ZXZlciAtIGlnbm9yZWRcbiAgICAgKi9cbiAgICByZXBvcHVsYXRlRnJvbVN0b3JhZ2UoZGF0YSkge1xuICAgICAgICAvLyBkZWNpZGUgd2hldGhlciB0byB1c2UgdGhlIHNlcnZlcidzIGFuc3dlciAoaWYgdGhlcmUgaXMgb25lKSBvciB0byBsb2FkIGZyb20gc3RvcmFnZVxuICAgICAgICBpZiAoZGF0YSAhPT0gbnVsbCAmJiBkYXRhICE9PSBcIm5vIGRhdGFcIiAmJiB0aGlzLnNob3VsZFVzZVNlcnZlcihkYXRhKSkge1xuICAgICAgICAgICAgdGhpcy5yZXN0b3JlQW5zd2VycyhkYXRhKTtcbiAgICAgICAgICAgIHRoaXMuc2V0TG9jYWxTdG9yYWdlKGRhdGEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jaGVja0xvY2FsU3RvcmFnZSgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGVjb3JhdGVTdGF0dXMoKTtcbiAgICB9XG4gICAgc2hvdWxkVXNlU2VydmVyKGRhdGEpIHtcbiAgICAgICAgLy8gcmV0dXJucyB0cnVlIGlmIHNlcnZlciBkYXRhIGlzIG1vcmUgcmVjZW50IHRoYW4gbG9jYWwgc3RvcmFnZSBvciBpZiBzZXJ2ZXIgc3RvcmFnZSBpcyBjb3JyZWN0XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIGRhdGEuY29ycmVjdCA9PT0gXCJUXCIgfHxcbiAgICAgICAgICAgIGRhdGEuY29ycmVjdCA9PT0gdHJ1ZSB8fFxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLmxlbmd0aCA9PT0gMCB8fFxuICAgICAgICAgICAgdGhpcy5ncmFkZXJhY3RpdmUgPT09IHRydWUgfHxcbiAgICAgICAgICAgIHRoaXMuaXNUaW1lZFxuICAgICAgICApIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGxldCBleCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMubG9jYWxTdG9yYWdlS2V5KCkpO1xuICAgICAgICBpZiAoZXggPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGxldCBzdG9yZWREYXRhO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgc3RvcmVkRGF0YSA9IEpTT04ucGFyc2UoZXgpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIC8vIGVycm9yIHdoaWxlIHBhcnNpbmc7IGxpa2VseSBkdWUgdG8gYmFkIHZhbHVlIHN0b3JlZCBpbiBzdG9yYWdlXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIubWVzc2FnZSk7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSh0aGlzLmxvY2FsU3RvcmFnZUtleSgpKTtcbiAgICAgICAgICAgIC8vIGRlZmluaXRlbHkgZG9uJ3Qgd2FudCB0byB1c2UgbG9jYWwgc3RvcmFnZSBoZXJlXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGF0YS5hbnN3ZXIgPT0gc3RvcmVkRGF0YS5hbnN3ZXIpIHJldHVybiB0cnVlO1xuICAgICAgICBsZXQgc3RvcmFnZURhdGUgPSBuZXcgRGF0ZShzdG9yZWREYXRhLnRpbWVzdGFtcCk7XG4gICAgICAgIGxldCBzZXJ2ZXJEYXRlID0gbmV3IERhdGUoZGF0YS50aW1lc3RhbXApO1xuICAgICAgICByZXR1cm4gc2VydmVyRGF0ZSA+PSBzdG9yYWdlRGF0ZTtcbiAgICB9XG4gICAgLy8gUmV0dXJuIHRoZSBrZXkgd2hpY2ggdG8gYmUgdXNlZCB3aGVuIGFjY2Vzc2luZyBsb2NhbCBzdG9yYWdlLlxuICAgIGxvY2FsU3RvcmFnZUtleSgpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIGVCb29rQ29uZmlnLmVtYWlsICtcbiAgICAgICAgICAgIFwiOlwiICtcbiAgICAgICAgICAgIGVCb29rQ29uZmlnLmNvdXJzZSArXG4gICAgICAgICAgICBcIjpcIiArXG4gICAgICAgICAgICB0aGlzLmRpdmlkICtcbiAgICAgICAgICAgIFwiLWdpdmVuXCJcbiAgICAgICAgKTtcbiAgICB9XG4gICAgYWRkQ2FwdGlvbihlbFR5cGUpIHtcbiAgICAgICAgLy9zb21lRWxlbWVudC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShuZXdFbGVtZW50LCBzb21lRWxlbWVudC5uZXh0U2libGluZyk7XG4gICAgICAgIGlmICghdGhpcy5pc1RpbWVkKSB7XG4gICAgICAgICAgICB2YXIgY2FwRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgICAgICAgICBpZiAodGhpcy5xdWVzdGlvbl9sYWJlbCkge1xuICAgICAgICAgICAgICAgIC8vIERpc3BsYXkgY2FwdGlvbiBiYXNlZCBvbiB3aGV0aGVyIFJ1bmVzdG9uZSBzZXJ2aWNlcyBoYXZlIGJlZW4gZGV0ZWN0ZWRcbiAgICAgICAgICAgICAgICB0aGlzLmNhcHRpb24gPSBlQm9va0NvbmZpZy51c2VSdW5lc3RvbmVTZXJ2aWNlc1xuICAgICAgICAgICAgICAgICAgICA/IGBBY3Rpdml0eTogJHt0aGlzLnF1ZXN0aW9uX2xhYmVsfSAke3RoaXMuY2FwdGlvbn0gIDxzcGFuIGNsYXNzPVwicnVuZXN0b25lX2NhcHRpb25fZGl2aWRcIj4oJHt0aGlzLmRpdmlkfSk8L3NwYW4+YFxuICAgICAgICAgICAgICAgICAgICA6IGBBY3Rpdml0eTogJHt0aGlzLnF1ZXN0aW9uX2xhYmVsfSAke3RoaXMuY2FwdGlvbn1gOyAvLyBXaXRob3V0IHJ1bmVzdG9uZVxuICAgICAgICAgICAgICAgIGNhcERpdi5pbm5lckhUTUwgPSB0aGlzLmNhcHRpb247XG4gICAgICAgICAgICAgICAgY2FwRGl2LmNsYXNzTGlzdC5hZGQoYCR7ZWxUeXBlfV9jYXB0aW9uYCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIERpc3BsYXkgY2FwdGlvbiBiYXNlZCBvbiB3aGV0aGVyIFJ1bmVzdG9uZSBzZXJ2aWNlcyBoYXZlIGJlZW4gZGV0ZWN0ZWRcbiAgICAgICAgICAgICAgICBjYXBEaXYuaW5uZXJIVE1MID0gZUJvb2tDb25maWcudXNlUnVuZXN0b25lU2VydmljZXNcbiAgICAgICAgICAgICAgICAgICAgPyB0aGlzLmNhcHRpb24gKyBcIiAoXCIgKyB0aGlzLmRpdmlkICsgXCIpXCJcbiAgICAgICAgICAgICAgICAgICAgOiB0aGlzLmNhcHRpb247IC8vIFdpdGhvdXQgcnVuZXN0b25lXG4gICAgICAgICAgICAgICAgY2FwRGl2LmNsYXNzTGlzdC5hZGQoYCR7ZWxUeXBlfV9jYXB0aW9uYCk7XG4gICAgICAgICAgICAgICAgY2FwRGl2LmNsYXNzTGlzdC5hZGQoYCR7ZWxUeXBlfV9jYXB0aW9uX3RleHRgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuY2FwRGl2ID0gY2FwRGl2O1xuICAgICAgICAgICAgLy90aGlzLm91dGVyRGl2LnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGNhcERpdiwgdGhpcy5vdXRlckRpdi5uZXh0U2libGluZyk7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZChjYXBEaXYpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaGFzVXNlckFjdGl2aXR5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pc0Fuc3dlcmVkO1xuICAgIH1cblxuICAgIGNoZWNrQ3VycmVudEFuc3dlcigpIHtcbiAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgICBcIkVhY2ggY29tcG9uZW50IHNob3VsZCBwcm92aWRlIGFuIGltcGxlbWVudGF0aW9uIG9mIGNoZWNrQ3VycmVudEFuc3dlclwiLFxuICAgICAgICApO1xuICAgIH1cblxuICAgIGFzeW5jIGxvZ0N1cnJlbnRBbnN3ZXIoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgICAgXCJFYWNoIGNvbXBvbmVudCBzaG91bGQgcHJvdmlkZSBhbiBpbXBsZW1lbnRhdGlvbiBvZiBsb2dDdXJyZW50QW5zd2VyXCIsXG4gICAgICAgICk7XG4gICAgfVxuICAgIHJlbmRlckZlZWRiYWNrKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAgIFwiRWFjaCBjb21wb25lbnQgc2hvdWxkIHByb3ZpZGUgYW4gaW1wbGVtZW50YXRpb24gb2YgcmVuZGVyRmVlZGJhY2tcIixcbiAgICAgICAgKTtcbiAgICB9XG4gICAgZGlzYWJsZUludGVyYWN0aW9uKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAgIFwiRWFjaCBjb21wb25lbnQgc2hvdWxkIHByb3ZpZGUgYW4gaW1wbGVtZW50YXRpb24gb2YgZGlzYWJsZUludGVyYWN0aW9uXCIsXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiBgJHt0aGlzLmNvbnN0cnVjdG9yLm5hbWV9OiAke3RoaXMuZGl2aWR9YDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBRdWV1ZSBNYXRoSmF4IHJlbmRlcmluZyBmb3IgYGNvbXBvbmVudGAuXG4gICAgICpcbiAgICAgKiBUaGlzIGlzIHRoZSBvbmx5IE1hdGhKYXggZW50cnkgcG9pbnQgaW50ZXJhY3RpdmUgY29tcG9uZW50cyBzaG91bGQgdXNlLlxuICAgICAqIEl0IHdhaXRzIGZvciB0aGUgcGFnZSdzIGluaXRpYWwgTWF0aEpheCBwYXNzIHdoZW4gb25lIGlzIGNvbmZpZ3VyZWQuIFRoZVxuICAgICAqIHJldHVybmVkIHByb21pc2UgYWx3YXlzIHJlc29sdmVzIHRvIGBudWxsYCB3aGVuIE1hdGhKYXggaXMgdW5hdmFpbGFibGVcbiAgICAgKiBvciBmYWlsZWQgdG8gbG9hZCwgYWxsb3dpbmcgY2FsbGVycyB0byBwZXJmb3JtIHRoZWlyIHBvc3QtcmVuZGVyIGxheW91dFxuICAgICAqIGFuZCBhY2Nlc3NpYmlsaXR5IHdvcmsgaW4gYC50aGVuKClgIHdpdGhvdXQgdGhlaXIgb3duIGZlYXR1cmUgY2hlY2tzIG9yXG4gICAgICogcG9sbGluZy4gQSBnZW51aW5lIE1hdGhKYXggdHlwZXNldHRpbmcgZXJyb3Igc3RpbGwgcmVqZWN0cyB0aGUgcHJvbWlzZS5cbiAgICAgKlxuICAgICAqIE1hdGhKYXggNCBjaGFpbnMgYHR5cGVzZXRQcm9taXNlYCBjYWxscyBpdHNlbGYsIHNvIGNhbGxzIHJ1biBpbiB0aGVcbiAgICAgKiBvcmRlciB0aGV5IGFyZSBtYWRlIChpc3N1ZSAjMTU4MikuIE1hdGhKYXggMyBkb2VzIG5vdCwgc28gZm9yIGl0IHRoZVxuICAgICAqIGNhbGxzIGFyZSBjaGFpbmVkIGhlcmUuXG4gICAgICpcbiAgICAgKiBUZW1wbGF0ZXMgdGhhdCBkZWZpbmUgYHdpbmRvdy5ydW5lc3RvbmVNYXRoUmVhZHlgIG11c3Qgc2V0dGxlIGl0IGFmdGVyXG4gICAgICogZWl0aGVyIGEgc3VjY2Vzc2Z1bCBpbml0aWFsIHR5cGVzZXQgb3IgYSBNYXRoSmF4IGxvYWQgZmFpbHVyZS5cbiAgICAgKi9cbiAgICBhc3luYyBxdWV1ZU1hdGhKYXgoY29tcG9uZW50KSB7XG4gICAgICAgIGNvbnN0IG1hdGhKYXggPSBhd2FpdCBnZXRNYXRoSmF4KCk7XG4gICAgICAgIGlmICghbWF0aEpheCkgcmV0dXJuIG51bGw7XG4gICAgICAgIGlmICh0aGlzLnByZWFtYmxlRGl2KSB7XG4gICAgICAgICAgICAvLyBUeXBlc2V0dGluZyB0aGUgcHJlYW1ibGUgcmVnaXN0ZXJzIGl0cyBcXG5ld2NvbW1hbmQgYW5kXG4gICAgICAgICAgICAvLyBcXERlY2xhcmVNYXRoT3BlcmF0b3IgZGVmaW5pdGlvbnMgd2l0aCB0aGUgVGVYIGlucHV0IGpheC5cbiAgICAgICAgICAgIC8vIFRob3NlIGRlZmluaXRpb25zIGFyZSBnbG9iYWwgYW5kIHBlcnNpc3QgZm9yIGV2ZXJ5IGxhdGVyXG4gICAgICAgICAgICAvLyB0eXBlc2V0UHJvbWlzZSBjYWxsIG9uIHRoZSBwYWdlLCBzbyB0aGUgY29tcG9uZW50IGRvZXMgbm90XG4gICAgICAgICAgICAvLyBuZWVkIGl0cyBvd24gY29weSBvZiB0aGUgcHJlYW1ibGUgLS0gc2VlIGlzc3VlICMxMjQ4LCB3aGVyZVxuICAgICAgICAgICAgLy8gcHJlcGVuZGluZyBhIGNvcHkgcHV0IHRoZSByYXcgbWFjcm8gc291cmNlIG9uIHNjcmVlbi5cbiAgICAgICAgICAgIGF3YWl0IHR5cGVzZXQobWF0aEpheCwgW3RoaXMucHJlYW1ibGVEaXZdKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHlwZXNldChtYXRoSmF4LCBbY29tcG9uZW50XSk7XG4gICAgfVxuXG4gICAgZGVjb3JhdGVTdGF0dXMoKSB7XG4gICAgICAgIGlmICh0aGlzLmlzVGltZWQgfHwgZUJvb2tDb25maWcucGVlcikgcmV0dXJuO1xuICAgICAgICBsZXQgcnNEaXYgPSB0aGlzLmNvbnRhaW5lckRpdlxuICAgICAgICAgICAgPyB0aGlzLmNvbnRhaW5lckRpdi5jbG9zZXN0KFwiZGl2LnJ1bmVzdG9uZVwiKVxuICAgICAgICAgICAgOiBudWxsO1xuICAgICAgICBpZiAoIXJzRGl2KSByZXR1cm47XG4gICAgICAgIHJzRGl2LmNsYXNzTGlzdC5yZW1vdmUoXCJub3RBbnN3ZXJlZFwiKTtcbiAgICAgICAgcnNEaXYuY2xhc3NMaXN0LnJlbW92ZShcImlzSW5Db3JyZWN0XCIpO1xuICAgICAgICByc0Rpdi5jbGFzc0xpc3QucmVtb3ZlKFwiaXNDb3JyZWN0XCIpO1xuICAgICAgICBsZXQgYXNzaWdubWVudEluZm8gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcbiAgICAgICAgICAgIGBjdXJyZW50QXNzaWdubWVudEluZm9fJHtlQm9va0NvbmZpZy5jb3Vyc2V9YCxcbiAgICAgICAgKTtcbiAgICAgICAgbGV0IHF1ZXN0aW9ucyA9IFtdO1xuICAgICAgICBpZiAoYXNzaWdubWVudEluZm8pIHtcbiAgICAgICAgICAgIHF1ZXN0aW9ucyA9IEpTT04ucGFyc2UoYXNzaWdubWVudEluZm8pLnF1ZXN0aW9ucztcbiAgICAgICAgfVxuICAgICAgICBpZiAocXVlc3Rpb25zLmluZGV4T2YodGhpcy5kaXZpZCkgPj0gMCkge1xuICAgICAgICAgICAgcnNEaXYuY2xhc3NMaXN0LmFkZChcImlzQXNzaWduZWRcIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY29ycmVjdCkge1xuICAgICAgICAgICAgcnNEaXYuY2xhc3NMaXN0LmFkZChcImlzQ29ycmVjdFwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNvcnJlY3QgPT09IG51bGwgfHwgdHlwZW9mIHRoaXMuY29ycmVjdCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgIHJzRGl2LmNsYXNzTGlzdC5hZGQoXCJub3RBbnN3ZXJlZFwiKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcnNEaXYuY2xhc3NMaXN0LmFkZChcImlzSW5Db3JyZWN0XCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG4vLyBSZXNvbHZlIHRvIHRoZSBwYWdlJ3MgTWF0aEpheCBvbmNlIGl0cyBpbml0aWFsIHR5cGVzZXR0aW5nIHBhc3MgaXMgZG9uZSwgb3Jcbi8vIHRvIG51bGwgd2hlbiBNYXRoSmF4IGlzIG1pc3Npbmcgb3IgZmFpbGVkIHRvIGxvYWQuXG5hc3luYyBmdW5jdGlvbiBnZXRNYXRoSmF4KCkge1xuICAgIC8vIFByZVRlWHQvUnVuZXN0b25lIHBhZ2VzIHJlc29sdmUgdGhpcyBhZnRlciB0aGVpciBpbml0aWFsIHBhZ2UtbGV2ZWxcbiAgICAvLyB0eXBlc2V0dGluZyBwYXNzLiBTdGFuZGFsb25lIHBhZ2VzIGNhbiB1c2UgTWF0aEpheCdzIHN0YXJ0dXAgcHJvbWlzZS5cbiAgICBjb25zdCByZWFkaW5lc3MgPVxuICAgICAgICB3aW5kb3cucnVuZXN0b25lTWF0aFJlYWR5ID8/IGdsb2JhbFRoaXMuTWF0aEpheD8uc3RhcnR1cD8ucHJvbWlzZTtcbiAgICBpZiAocmVhZGluZXNzKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBhd2FpdCByZWFkaW5lc3M7XG4gICAgICAgIH0gY2F0Y2gge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBtYXRoSmF4ID0gZ2xvYmFsVGhpcy5NYXRoSmF4O1xuICAgIHJldHVybiB0eXBlb2YgbWF0aEpheD8udHlwZXNldFByb21pc2UgPT09IFwiZnVuY3Rpb25cIiA/IG1hdGhKYXggOiBudWxsO1xufVxuXG4vLyBNYXRoSmF4IDMgbmVlZHMgb3ZlcmxhcHBpbmcgdHlwZXNldFByb21pc2UgY2FsbHMgY2hhaW5lZCBieSB0aGUgY2FsbGVyLlxubGV0IG1hdGhKYXgzQ2hhaW4gPSBQcm9taXNlLnJlc29sdmUoKTtcblxuZnVuY3Rpb24gdHlwZXNldChtYXRoSmF4LCBlbGVtZW50cykge1xuICAgIGlmICghbWF0aEpheC52ZXJzaW9uPy5zdGFydHNXaXRoKFwiMy5cIikpIHtcbiAgICAgICAgcmV0dXJuIG1hdGhKYXgudHlwZXNldFByb21pc2UoZWxlbWVudHMpO1xuICAgIH1cbiAgICBjb25zdCBydW4gPSBtYXRoSmF4M0NoYWluLnRoZW4oKCkgPT4gbWF0aEpheC50eXBlc2V0UHJvbWlzZShlbGVtZW50cykpO1xuICAgIC8vIEEgZmFpbGVkIHR5cGVzZXQgcmVqZWN0cyBmb3IgaXRzIGNhbGxlciBidXQgbXVzdCBub3Qgc3RhbGwgbGF0ZXIgb25lcy5cbiAgICBtYXRoSmF4M0NoYWluID0gcnVuLmNhdGNoKCgpID0+IHt9KTtcbiAgICByZXR1cm4gcnVuO1xufVxuXG53aW5kb3cuUnVuZXN0b25lQmFzZSA9IFJ1bmVzdG9uZUJhc2U7XG4iLCIvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy8gfGRvY25hbWV8IC0gQSBmcmFtZXdvcmsgYWxsb3dpbmcgYSBSdW5lc3RvbmUgY29tcG9uZW50IHRvIGxvYWQgb25seSB0aGUgSlMgaXQgbmVlZHNcbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyBUaGUgSmF2YVNjcmlwdCByZXF1aXJlZCBieSBhbGwgUnVuZXN0b25lIGNvbXBvbmVudHMgaXMgcXVpdGUgbGFyZ2UgYW5kIHJlc3VsdHMgaW4gc2xvdyBwYWdlIGxvYWRzLiBUaGlzIGFwcHJvYWNoIGVuYWJsZXMgYSBSdW5lc3RvbmUgY29tcG9uZW50IHRvIGxvYWQgb25seSB0aGUgSmF2YVNjcmlwdCBpdCBuZWVkcywgcmF0aGVyIHRoYW4gbG9hZGluZyBKYXZhU2NyaXB0IGZvciBhbGwgdGhlIGNvbXBvbmVudHMgcmVnYXJkbGVzcyBvZiB3aGljaCBhcmUgYWN0dWFsbHkgdXNlZC5cbi8vXG4vLyBUbyBhY2NvbXBsaXNoIHRoaXMsIHdlYnBhY2sncyBzcGxpdC1jaHVua3MgYWJpbGl0eSBhbmFseXplcyBhbGwgSlMsIHN0YXJ0aW5nIGZyb20gdGhpcyBmaWxlLiBUaGUgZHluYW1pYyBpbXBvcnRzIGJlbG93IGFyZSB0cmFuc2Zvcm1lZCBieSB3ZWJwYWNrIGludG8gdGhlIGR5bmFtaWMgZmV0Y2hlcyBvZiBqdXN0IHRoZSBKUyByZXF1aXJlZCBieSBlYWNoIGZpbGUgYW5kIGFsbCBpdHMgZGVwZW5kZW5jaWVzLiAoSWYgdXNpbmcgc3RhdGljIGltcG9ydHMsIHdlYnBhY2sgd2lsbCBhc3N1bWUgdGhhdCBhbGwgZmlsZXMgYXJlIGFscmVhZHkgc3RhdGljYWxseSBsb2FkZWQgdmlhIHNjcmlwdCB0YWdzLCBkZWZlYXRpbmcgdGhlIHB1cnBvc2Ugb2YgdGhpcyBmcmFtZXdvcmsuKVxuLy9cbi8vIEhvd2V2ZXIsIHRoaXMgYXBwcm9hY2ggbGVhZHMgdG8gY29tcGxleGl0eTpcbi8vXG4vLyAtICAgIFRoZSBgYGRhdGEtY29tcG9uZW50YGAgYXR0cmlidXRlIG9mIGVhY2ggY29tcG9uZW50IG11c3QgYmUga2VwdCBpbiBzeW5jIHdpdGggdGhlIGtleXMgb2YgdGhlIGBgbW9kdWxlX21hcGBgIGJlbG93LlxuLy8gLSAgICBUaGUgdmFsdWVzIGluIHRoZSBgYG1vZHVsZV9tYXBgYCBtdXN0IGJlIGtlcHQgaW4gc3luYyB3aXRoIHRoZSBKYXZhU2NyaXB0IGZpbGVzIHdoaWNoIGltcGxlbWVudCBlYWNoIG9mIHRoZSBjb21wb25lbnRzLlxuXG4vLyBTdGF0aWMgaW1wb3J0c1xuLy8gPT09PT09PT09PT09PT1cbi8vIFRoZXNlIGltcG9ydHMgYXJlICh3ZSBhc3N1bWUpIG5lZWRlZCBieSBhbGwgcGFnZXMuIEhvd2V2ZXIsIGl0IHdvdWxkIGJlIG11Y2ggYmV0dGVyIHRvIGxvYWQgdGhlc2UgaW4gdGhlIG1vZHVsZXMgdGhhdCBhY3R1YWxseSB1c2UgdGhlbS5cbi8vXG4vLyBUaGVzZSBhcmUgc3RhdGljIGltcG9ydHM7IGNvZGUgaW4gYGR5bmFtaWNhbGx5IGxvYWRlZCBjb21wb25lbnRzYF8gZGVhbHMgd2l0aCBkeW5hbWljIGltcG9ydHMuXG4vL1xuLy8galF1ZXJ5IFVJIGlzIG5vIGxvbmdlciBsb2FkZWQgZ2xvYmFsbHk6IHRoZSB2ZW5kb3JlZCBweXR1dG9yIGJ1bmRsZVxuLy8gKGNvZGVsZW5zKSBjYXJyaWVzIGl0cyBvd24galF1ZXJ5LCBqUXVlcnkgVUksIGFuZCBqUXVlcnkgVUkgQ1NTLCBhbmQgbm9cbi8vIG90aGVyIGNvbXBvbmVudCB1c2VzIGl0LlxuLy8gaTE4biBpcyBub3cgaGFuZGxlZCBieSB0aGUgZGVwZW5kZW5jeS1mcmVlIHJ1bmVzdG9uZS9jb21tb24vanMvcnNpMThuLmpzO1xuLy8gdGhlIHZlbmRvcmVkIFdpa2ltZWRpYSBqcXVlcnkuaTE4biBwbHVnaW4gaGFzIGJlZW4gcmVtb3ZlZC5cblxuLy8gY29tbW9uIHN0eWxlcyBjb21lIGZyb20gaGVyZVxuaW1wb3J0IFwiLi9wdHhycy1ib290c3RyYXAubGVzc1wiO1xuLy8gU2VsZi1ob3N0ZWQgaWNvbiBmb250IGZvciB0aGUgYGBtYXRlcmlhbC1zeW1ib2xzLW91dGxpbmVkYGAgc3BhbnMgdGhhdFxuLy8gY29tcG9uZW50cyByZW5kZXI7IHdpdGhvdXQgaXQgdGhlIGljb24gbmFtZXMgc2hvdyB1cCBhcyBsaXRlcmFsIHRleHQuXG5pbXBvcnQgXCIuL3J1bmVzdG9uZS9jb21tb24vY3NzL21hdGVyaWFsLXN5bWJvbHMuY3NzXCI7XG5cbi8vIE1pc2NcbmltcG9ydCBcIi4vcnVuZXN0b25lL2NvbW1vbi9qcy9ib29rZnVuY3MuanNcIjtcbmltcG9ydCBcIi4vcnVuZXN0b25lL2NvbW1vbi9qcy91c2VyLWhpZ2hsaWdodHMuanNcIjtcbmltcG9ydCBcIi4vcnVuZXN0b25lL2NvbW1vbi9qcy9wcmV0ZXh0LmpzXCI7XG5pbXBvcnQgXCIuL3J1bmVzdG9uZS9jb21tb24vanMvcHJldGV4dC1pZnJhbWUtcmVzaXplLmpzXCI7XG5cbi8vIFRoZXNlIGFyZSBvbmx5IG5lZWRlZCBmb3IgdGhlIFJ1bmVzdG9uZSBib29rLCBidXQgbm90IGluIGEgbGlicmFyeSBtb2RlIChzdWNoIGFzIHByZXRleHQpLiBJIHdvdWxkIHByZWZlciB0byBkeW5hbWljYWxseSBsb2FkIHRoZW0uIEhvd2V2ZXIsIHRoZXNlIHNjcmlwdHMgYXJlIHNvIHNtYWxsIEkgaGF2ZW4ndCBib3RoZXJlZCB0byBkbyBzby5cbmltcG9ydCB7IGdldFN3aXRjaCwgc3dpdGNoVGhlbWUgfSBmcm9tIFwiLi9ydW5lc3RvbmUvY29tbW9uL2pzL3RoZW1lLmpzXCI7XG5pbXBvcnQgXCIuL3J1bmVzdG9uZS9jb21tb24vanMvcHJlc2VudGVyX21vZGUuanNcIjtcbmltcG9ydCBcIi4vcnVuZXN0b25lL2NvbW1vbi9jc3MvcHJlc2VudGVyX21vZGUubGVzc1wiO1xuaW1wb3J0IHsgcmVuZGVyT25lQ29tcG9uZW50IH0gZnJvbSBcIi4vcnVuZXN0b25lL2NvbW1vbi9qcy9yZW5kZXJDb21wb25lbnQuanNcIjtcbmltcG9ydCBSdW5lc3RvbmVCYXNlIGZyb20gXCIuL3J1bmVzdG9uZS9jb21tb24vanMvcnVuZXN0b25lYmFzZS5qc1wiO1xuaW1wb3J0IHsgU3BsaWNlV3JhcHBlciB9IGZyb20gXCIuL3J1bmVzdG9uZS9zcGxpY2UvanMvc3BsaWNlV3JhcHBlci50c1wiO1xuXG4vLyBEeW5hbWljYWxseSBsb2FkZWQgY29tcG9uZW50c1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFRoaXMgcHJvdmlkZXMgYSBsaXN0IG9mIG1vZHVsZXMgdGhhdCBjb21wb25lbnRzIGNhbiBkeW5hbWljYWxseSBpbXBvcnQuIFdlYnBhY2sgd2lsbCBjcmVhdGUgYSBsaXN0IG9mIGltcG9ydHMgZm9yIGVhY2ggYmFzZWQgb24gaXRzIGFuYWx5c2lzLlxuY29uc3QgbW9kdWxlX21hcCA9IHtcbiAgICAvLyBXcmFwIGVhY2ggaW1wb3J0IGluIGEgZnVuY3Rpb24sIHNvIHRoYXQgaXQgd29uJ3Qgb2NjdXIgdW50aWwgdGhlIGZ1bmN0aW9uIGlzIGNhbGxlZC4gV2hpbGUgc29tZXRoaW5nIGNsZWFuZXIgd291bGQgYmUgbmljZSwgd2VicGFjayBjYW4ndCBhbmFseXplIHRoaW5ncyBsaWtlIGBgaW1wb3J0KGV4cHJlc3Npb24pYGAuXG4gICAgLy9cbiAgICAvLyBUaGUga2V5cyBtdXN0IG1hdGNoIHRoZSB2YWx1ZSBvZiBlYWNoIGNvbXBvbmVudCdzIGBgZGF0YS1jb21wb25lbnRgYCBhdHRyaWJ1dGUgLS0gdGhlIGBgcnVuZXN0b25lX2ltcG9ydGBgIGFuZCBgYHJ1bmVzdG9uZV9hdXRvX2ltcG9ydGBgIGZ1bmN0aW9ucyBhc3N1bWUgdGhpcy5cbiAgICBhY3RpdmVjb2RlOiAoKSA9PiBpbXBvcnQoXCIuL3J1bmVzdG9uZS9hY3RpdmVjb2RlL2pzL2FjZmFjdG9yeS5qc1wiKSxcbiAgICAvLyBBbHdheXMgaW1wb3J0IHRoZSB0aW1lZCB2ZXJzaW9uIG9mIGEgY29tcG9uZW50IGlmIGF2YWlsYWJsZSwgc2luY2UgdGhlIHRpbWVkIGNvbXBvbmVudHMgYWxzbyBkZWZpbmUgdGhlIGNvbXBvbmVudCdzIGZhY3RvcnkgYW5kIGluY2x1ZGUgdGhlIGNvbXBvbmVudCBhcyB3ZWxsLiBOb3RlIHRoYXQgYGBhY2ZhY3RvcnlgYCBpbXBvcnRzIHRoZSB0aW1lZCBjb21wb25lbnRzIG9mIEFjdGl2ZUNvZGUsIHNvIGl0IGZvbGxvd3MgdGhpcyBwYXR0ZXJuLlxuICAgIGNsaWNrYWJsZWFyZWE6ICgpID0+XG4gICAgICAgIGltcG9ydChcIi4vcnVuZXN0b25lL2NsaWNrYWJsZUFyZWEvanMvdGltZWRjbGlja2FibGUuanNcIiksXG4gICAgY29kZWxlbnM6ICgpID0+IGltcG9ydChcIi4vcnVuZXN0b25lL2NvZGVsZW5zL2pzL2NvZGVsZW5zLmpzXCIpLFxuICAgIGRhdGFmaWxlOiAoKSA9PiBpbXBvcnQoXCIuL3J1bmVzdG9uZS9kYXRhZmlsZS9qcy9kYXRhZmlsZS5qc1wiKSxcbiAgICBkcmFnbmRyb3A6ICgpID0+IGltcG9ydChcIi4vcnVuZXN0b25lL2RyYWduZHJvcC9qcy90aW1lZGRuZC5qc1wiKSxcbiAgICBmaWxsaW50aGVibGFuazogKCkgPT4gaW1wb3J0KFwiLi9ydW5lc3RvbmUvZml0Yi9qcy90aW1lZGZpdGIuanNcIiksXG4gICAgZ3JvdXBzdWI6ICgpID0+IGltcG9ydChcIi4vcnVuZXN0b25lL2dyb3Vwc3ViL2pzL2dyb3Vwc3ViLmpzXCIpLFxuICAgIG1hdGNoaW5nOiAoKSA9PiBpbXBvcnQoXCIuL3J1bmVzdG9uZS9tYXRjaGluZy9qcy9tYXRjaGluZy5qc1wiKSxcbiAgICBtdWx0aXBsZWNob2ljZTogKCkgPT4gaW1wb3J0KFwiLi9ydW5lc3RvbmUvbWNob2ljZS9qcy90aW1lZG1jLmpzXCIpLFxuICAgIGhwYXJzb25zOiAoKSA9PiBpbXBvcnQoXCIuL3J1bmVzdG9uZS9ocGFyc29ucy9qcy9ocGFyc29ucy5qc1wiKSxcbiAgICBwYXJzb25zOiAoKSA9PiBpbXBvcnQoXCIuL3J1bmVzdG9uZS9wYXJzb25zL2pzL3RpbWVkcGFyc29ucy5qc1wiKSxcbiAgICBwb2xsOiAoKSA9PiBpbXBvcnQoXCIuL3J1bmVzdG9uZS9wb2xsL2pzL3BvbGwuanNcIiksXG4gICAgc2VsZWN0cXVlc3Rpb246ICgpID0+IGltcG9ydChcIi4vcnVuZXN0b25lL3NlbGVjdHF1ZXN0aW9uL2pzL3NlbGVjdG9uZS5qc1wiKSxcbiAgICBzaG9ydGFuc3dlcjogKCkgPT5cbiAgICAgICAgaW1wb3J0KFwiLi9ydW5lc3RvbmUvc2hvcnRhbnN3ZXIvanMvdGltZWRfc2hvcnRhbnN3ZXIuanNcIiksXG4gICAgc2hvd2V2YWw6ICgpID0+IGltcG9ydChcIi4vcnVuZXN0b25lL3Nob3dldmFsL2pzL3Nob3dFdmFsLmpzXCIpLFxuICAgIHRhYmJlZFN0dWZmOiAoKSA9PiBpbXBvcnQoXCIuL3J1bmVzdG9uZS90YWJiZWRTdHVmZi9qcy90YWJiZWRzdHVmZi5qc1wiKSxcbiAgICB0aW1lZEFzc2Vzc21lbnQ6ICgpID0+IGltcG9ydChcIi4vcnVuZXN0b25lL3RpbWVkL2pzL3RpbWVkLmpzXCIpLFxuICAgIC8vIFRPRE86IHNpbmNlIHRoaXMgaXNuJ3QgaW4gYSBgYGRhdGEtY29tcG9uZW50YGAsIG5lZWQgdG8gdHJpZ2dlciBhbiBpbXBvcnQgb2YgdGhpcyBjb2RlIG1hbnVhbGx5LlxuICAgIHdlYndvcms6ICgpID0+IGltcG9ydChcIi4vcnVuZXN0b25lL3dlYndvcmsvanMvd2Vid29yay5qc1wiKSxcbiAgICB5b3V0dWJlOiAoKSA9PiBpbXBvcnQoXCIuL3J1bmVzdG9uZS92aWRlby9qcy9ydW5lc3RvbmV2aWRlby5qc1wiKSxcbiAgICBkb2VuZXQ6ICgpID0+IFByb21pc2UucmVzb2x2ZSgpLCAvLyBEb2VuZXQgaXMgbG9hZGVkIHNlcGFyYXRlbHlcbn07XG5cbmNvbnN0IG1vZHVsZV9tYXBfY2FjaGUgPSB7fTtcbmNvbnN0IFFVRVVFX0ZMVVNIX1RJTUVfTVMgPSAxMDtcbmNvbnN0IHF1ZXVlID0gW107XG5sZXQgcXVldWVMYXN0Rmx1c2ggPSAwO1xuLyoqXG4gKiBRdWV1ZSBpbXBvcnRzIHRoYXQgYXJlIHJlcXVlc3RlZCB3aXRoaW4gYFFVRVVFX0ZMVVNIX1RJTUVfTVNgIG9mIGVhY2ggb3RoZXIuXG4gKiBBbGwgc3VjaCBpbXBvcnRzIGFyZSBpbXBvcnRlZCBhdCBvbmNlLCBhbmQgdGhlbiBhIHByb21pc2UgaXMgZmlyZWQgYWZ0ZXIgYWxsXG4gKiB0aGUgaW1wb3J0cyBpbiB0aGUgcXVldWUgd2luZG93IGhhdmUgY29tcGxldGVkLlxuICovXG5mdW5jdGlvbiBxdWV1ZUltcG9ydChjb21wb25lbnRfbmFtZSkge1xuICAgIGxldCByZXNvbHZlID0gbnVsbDtcbiAgICBsZXQgcmVqZWN0ID0gbnVsbDtcbiAgICBjb25zdCByZXRQcm9taXNlID0gbmV3IFByb21pc2UoKHIsIHJlaikgPT4ge1xuICAgICAgICByZXNvbHZlID0gcjtcbiAgICAgICAgcmVqZWN0ID0gcmVqO1xuICAgIH0pO1xuICAgIGNvbnN0IGl0ZW0gPSB7IGNvbXBvbmVudF9uYW1lLCByZXNvbHZlLCByZWplY3QgfTtcbiAgICBxdWV1ZS5wdXNoKGl0ZW0pO1xuICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZsdXNoUXVldWUsIFFVRVVFX0ZMVVNIX1RJTUVfTVMgKyAxKTtcblxuICAgIHJldHVybiByZXRQcm9taXNlO1xufVxuYXN5bmMgZnVuY3Rpb24gZmx1c2hRdWV1ZSgpIHtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKERhdGUubm93KCkgLSBxdWV1ZUxhc3RGbHVzaCA8IFFVRVVFX0ZMVVNIX1RJTUVfTVMpIHtcbiAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZmx1c2hRdWV1ZSwgUVVFVUVfRkxVU0hfVElNRV9NUyArIDEpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIElmIHdlIG1hZGUgaXQgaGVyZSwgaXQgaGFzIGJlZW4gYXQgbGVhc3QgUVVFVUVfRkxVU0hfVElNRV9NUyBzaW5jZVxuICAgIC8vIHRoZSBsYXN0IHRpbWUgd2UgZmx1c2hlZCB0aGUgcXVldWUuIFRoZXJlZm9yZSwgd2Ugc2hvdWxkIHN0YXJ0IGZsdXNoaW5nLlxuICAgIC8vIFdlIGNvcHkgZXZlcnl0aGluZyB3ZSBmbHVzaCBhbmQgZW1wdHkgdGhlIGFycmF5IGZpcnN0LlxuICAgIHF1ZXVlTGFzdEZsdXNoID0gRGF0ZS5ub3coKTtcbiAgICBjb25zdCB0b0ZsdXNoID0gWy4uLnF1ZXVlXTtcbiAgICBxdWV1ZS5sZW5ndGggPSAwO1xuICAgIGNvbnNvbGUubG9nKFxuICAgICAgICBcIldlYnBhY2sgaXMgc3RhcnRpbmcgdGhlIGxvYWRpbmcgcHJvY2VzcyBmb3IgdGhlIGZvbGxvd2luZyBSdW5lc3RvbmUgbW9kdWxlc1wiLFxuICAgICAgICB0b0ZsdXNoLm1hcCgoaXRlbSkgPT4gaXRlbS5jb21wb25lbnRfbmFtZSksXG4gICAgKTtcbiAgICBjb25zdCBmbHVzaGVkUHJvbWlzZSA9IHRvRmx1c2gubWFwKGFzeW5jIChpdGVtKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBhd2FpdCBtb2R1bGVfbWFwW2l0ZW0uY29tcG9uZW50X25hbWVdKCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAgICAgICBgUnVuZXN0b25lIGNvbXBvbmVudCAke2l0ZW0uY29tcG9uZW50X25hbWV9IGhhcyBiZWVuIGxvYWRlZGAsXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGl0ZW0ucmVqZWN0KGUpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgY29uc3QgZmx1c2hlZCA9IGF3YWl0IFByb21pc2UuYWxsKGZsdXNoZWRQcm9taXNlKTtcbiAgICB0cnkge1xuICAgICAgICBmbHVzaGVkLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgIGlmIChpdGVtKSB7XG4gICAgICAgICAgICAgICAgaXRlbS5yZXNvbHZlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICB9XG59XG5cbi8vIC4uIF9keW5hbWljIGltcG9ydCBtYWNoaW5lcnk6XG4vL1xuLy8gRHluYW1pYyBpbXBvcnQgbWFjaGluZXJ5XG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIEZ1bGZpbGwgYSBwcm9taXNlIHdoZW4gdGhlIFJ1bmVzdG9uZSBwcmUtbG9naW4gY29tcGxldGUgZXZlbnQgb2NjdXJzLlxubGV0IHByZV9sb2dpbl9jb21wbGV0ZV9wcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInJ1bmVzdG9uZTpwcmUtbG9naW4tY29tcGxldGVcIiwgcmVzb2x2ZSksXG4pO1xubGV0IGxvYWRlZENvbXBvbmVudHM7XG4vLyBQcm92aWRlIGEgc2ltcGxlIGZ1bmN0aW9uIHRvIGltcG9ydCB0aGUgSlMgZm9yIGFsbCBjb21wb25lbnRzIG9uIHRoZSBwYWdlLlxuZXhwb3J0IGZ1bmN0aW9uIHJ1bmVzdG9uZV9hdXRvX2ltcG9ydCgpIHtcbiAgICAvLyBDcmVhdGUgYSBzZXQgb2YgYGBkYXRhLWNvbXBvbmVudGBgIHZhbHVlcywgdG8gYXZvaWQgZHVwbGljYXRpb24uXG4gICAgY29uc3QgcyA9IG5ldyBTZXQoXG4gICAgICAgIC8vIEFsbCBSdW5lc3RvbmUgY29tcG9uZW50cyBoYXZlIGEgYGBkYXRhLWNvbXBvbmVudGBgIGF0dHJpYnV0ZS5cbiAgICAgICAgWy4uLmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJbZGF0YS1jb21wb25lbnRdXCIpXS5tYXAoKGVsZW1lbnQpID0+XG4gICAgICAgICAgICBlbGVtZW50LmdldEF0dHJpYnV0ZShcImRhdGEtY29tcG9uZW50XCIpLFxuICAgICAgICApLFxuICAgICk7XG4gICAgLy8gd2Vid29yayBxdWVzdGlvbnMgYXJlIG5vdCB3cmFwcGVkIGluIGRpdiB3aXRoIGEgZGF0YS1jb21wb25lbnQgc28gd2UgaGF2ZSB0byBjaGVjayBhIGRpZmZlcmVudCB3YXlcbiAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi53ZWJ3b3JrLWJ1dHRvblwiKSkge1xuICAgICAgICBzLmFkZChcIndlYndvcmtcIik7XG4gICAgfVxuXG4gICAgLy8gTG9hZCBKUyBmb3IgZWFjaCBvZiB0aGUgY29tcG9uZW50cyBmb3VuZC5cbiAgICBjb25zdCBhID0gWy4uLnNdLm1hcCgodmFsdWUpID0+IHtcbiAgICAgICAgbGV0IHo7XG4gICAgICAgIGNvbnNvbGUubG9nKGBMb2FkaW5nIFJ1bmVzdG9uZSBjb21wb25lbnQ6ICR7dmFsdWV9YCk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB6ID0gKG1vZHVsZV9tYXBbdmFsdWVdIHx8ICgoKSA9PiBQcm9taXNlLnJlc29sdmUoKSkpKCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYEVycm9yIGxvYWRpbmcgJHt2YWx1ZX06YCwgZSk7XG4gICAgICAgIH1cbiAgICAgICAgei5lcnJvciA9IChtc2cpID0+IGNvbnNvbGUuZXJyb3IoYEVycm9yIGluICR7dmFsdWV9OmAsIG1zZyk7XG4gICAgICAgIHJldHVybiB6O1xuICAgIH0pO1xuXG4gICAgLy8gU2VuZCB0aGUgUnVuZXN0b25lIGxvZ2luIGNvbXBsZXRlIGV2ZW50IHdoZW4gYWxsIEpTIGlzIGxvYWRlZCBhbmQgdGhlIHByZS1sb2dpbiBpcyBhbHNvIGNvbXBsZXRlLlxuICAgIFByb21pc2UuYWxsKFtwcmVfbG9naW5fY29tcGxldGVfcHJvbWlzZSwgLi4uYV0pLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIWRvY3VtZW50LmJvZHkuZGF0YXNldC5yZWFjdEluVXNlKSB7XG4gICAgICAgICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChcInJ1bmVzdG9uZTpsb2dpbi1jb21wbGV0ZVwiKSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxucHJlX2xvZ2luX2NvbXBsZXRlX3Byb21pc2UudGhlbigoKSA9PiB7XG4gICAgY29uc29sZS5sb2coXCJSdW5lc3RvbmUgcHJlLWxvZ2luIGNvbXBsZXRlXCIpO1xufSk7XG5cbi8vIExvYWQgY29tcG9uZW50IEpTIHdoZW4gdGhlIGRvY3VtZW50IGlzIHJlYWR5LlxuaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgPT09IFwibG9hZGluZ1wiKSB7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgcnVuZXN0b25lX2F1dG9faW1wb3J0KTtcbn0gZWxzZSB7XG4gICAgcnVuZXN0b25lX2F1dG9faW1wb3J0KCk7XG59XG5cbi8vIFByb3ZpZGUgYSBmdW5jdGlvbiB0byBpbXBvcnQgb25lIHNwZWNpZmljIGBSdW5lc3RvbmVgIGNvbXBvbmVudC5cbi8vIHRoZSBpbXBvcnQgZnVuY3Rpb24gaW5zaWRlIG1vZHVsZV9tYXAgaXMgYXN5bmMgLS0gcnVuZXN0b25lX2ltcG9ydFxuLy8gc2hvdWxkIGJlIGF3YWl0ZWQgd2hlbiBuZWNlc3NhcnkgdG8gZW5zdXJlIHRoZSBpbXBvcnQgY29tcGxldGVzXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcnVuZXN0b25lX2ltcG9ydChjb21wb25lbnRfbmFtZSkge1xuICAgIGlmIChtb2R1bGVfbWFwX2NhY2hlW2NvbXBvbmVudF9uYW1lXSkge1xuICAgICAgICByZXR1cm4gbW9kdWxlX21hcF9jYWNoZVtjb21wb25lbnRfbmFtZV07XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKFxuICAgICAgICBgUnVuZXN0b25lIGNvbXBvbmVudCAke2NvbXBvbmVudF9uYW1lfSBpcyBiZWluZyBxdWV1ZWQgZm9yIGltcG9ydGAsXG4gICAgKTtcbiAgICBjb25zdCBwcm9taXNlID0gcXVldWVJbXBvcnQoY29tcG9uZW50X25hbWUpO1xuICAgIG1vZHVsZV9tYXBfY2FjaGVbY29tcG9uZW50X25hbWVdID0gcHJvbWlzZTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcG9wdXBTY3JhdGNoQUMoKSB7XG4gICAgLy8gbG9hZCB0aGUgYWN0aXZlY29kZSBidW5kbGVcbiAgICBhd2FpdCBydW5lc3RvbmVfaW1wb3J0KFwiYWN0aXZlY29kZVwiKTtcbiAgICAvLyBzY3JhdGNoRGl2IHdpbGwgYmUgZGVmaW5lZCBpZiB3ZSBoYXZlIGFscmVhZHkgY3JlYXRlZCBhIHNjcmF0Y2hcbiAgICAvLyBhY3RpdmVjb2RlLiAgSWYgaXRzIG5vdCBkZWZpbmVkIHRoZW4gd2UgbmVlZCB0byBnZXQgaXQgcmVhZHkgdG8gdG9nZ2xlXG4gICAgaWYgKCFlQm9va0NvbmZpZy5zY3JhdGNoRGl2KSB7XG4gICAgICAgIHdpbmRvdy5BQ0ZhY3RvcnkuY3JlYXRlU2NyYXRjaEFjdGl2ZWNvZGUoKTtcbiAgICAgICAgbGV0IGRpdmlkID0gZUJvb2tDb25maWcuc2NyYXRjaERpdjtcbiAgICAgICAgd2luZG93LmNvbXBvbmVudE1hcFtkaXZpZF0gPSBBQ0ZhY3RvcnkuY3JlYXRlQWN0aXZlQ29kZShcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGRpdmlkKSxcbiAgICAgICAgICAgIGVCb29rQ29uZmlnLmFjRGVmYXVsdExhbmd1YWdlLFxuICAgICAgICApO1xuICAgICAgICBpZiAoZUJvb2tDb25maWcuaXNMb2dnZWRJbikge1xuICAgICAgICAgICAgd2luZG93LmNvbXBvbmVudE1hcFtkaXZpZF0uZW5hYmxlU2F2ZUxvYWQoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgd2luZG93LkFDRmFjdG9yeS50b2dnbGVTY3JhdGNoQWN0aXZlY29kZSgpO1xuICAgIH0sIDEwMCk7XG59XG5cbi8vIFNldCB0aGUgZGlyZWN0b3J5IGNvbnRhaW5pbmcgdGhpcyBzY3JpcHQgYXMgdGhlIGBwYXRoIDxodHRwczovL3dlYnBhY2suanMub3JnL2d1aWRlcy9wdWJsaWMtcGF0aC8jb24tdGhlLWZseT5gXyBmb3IgYWxsIHdlYnBhY2tlZCBzY3JpcHRzLlxuY29uc3Qgc2NyaXB0X3NyYyA9IGRvY3VtZW50LmN1cnJlbnRTY3JpcHQuc3JjO1xuX193ZWJwYWNrX3B1YmxpY19wYXRoX18gPSBzY3JpcHRfc3JjLnN1YnN0cmluZyhcbiAgICAwLFxuICAgIHNjcmlwdF9zcmMubGFzdEluZGV4T2YoXCIvXCIpICsgMSxcbik7XG5cbnZhciBzcGxpY2UgPSBuZXcgU3BsaWNlV3JhcHBlcigpO1xuLy8gVGhlIGdyYWRpbmcgaW50ZXJmYWNlIG5lZWRzIHRoZSBzaW5nbGV0b24gc28gaXQgY2FuIHJlZ2lzdGVyIHRoZSBpZnJhbWVzIGl0XG4vLyBpcyBkaXNwbGF5aW5nOyBzZWUgU3BsaWNlV3JhcHBlci5yZWdpc3RlckdyYWRlckZyYW1lLlxud2luZG93LnNwbGljZVdyYXBwZXIgPSBzcGxpY2U7XG5cbi8vIE1hbnVhbCBleHBvcnRzXG4vLyA9PT09PT09PT09PT09PVxuLy8gV2VicGFjaydzIGBgb3V0cHV0LmxpYnJhcnlgYCBzZXR0aW5nIGRvZXNuJ3Qgc2VlbSB0byB3b3JrIHdpdGggdGhlIHNwbGl0IGNodW5rcyBwbHVnaW47IGRvIGFsbCBleHBvcnRzIG1hbnVhbGx5IHRocm91Z2ggdGhlIGBgd2luZG93YGAgb2JqZWN0IGluc3RlYWQuXG5cbmNvbnN0IHJjID0ge307XG5yYy5ydW5lc3RvbmVfaW1wb3J0ID0gcnVuZXN0b25lX2ltcG9ydDtcbnJjLnJ1bmVzdG9uZV9hdXRvX2ltcG9ydCA9IHJ1bmVzdG9uZV9hdXRvX2ltcG9ydDtcbnJjLmdldFN3aXRjaCA9IGdldFN3aXRjaDtcbnJjLnN3aXRjaFRoZW1lID0gc3dpdGNoVGhlbWU7XG5yYy5wb3B1cFNjcmF0Y2hBQyA9IHBvcHVwU2NyYXRjaEFDO1xucmMucmVuZGVyT25lQ29tcG9uZW50ID0gcmVuZGVyT25lQ29tcG9uZW50O1xud2luZG93LmNvbXBvbmVudE1hcCA9IHt9O1xud2luZG93LnJ1bmVzdG9uZUNvbXBvbmVudHMgPSByYztcbiIsIi8qKlxuICpcbiAqIFVzZXI6IGJtaWxsZXJcbiAqIE9yaWdpbmFsOiAyMDExLTA0LTIwXG4gKiBEYXRlOiAyMDE5LTA2LTE0XG4gKiBUaW1lOiAyOjAxIFBNXG4gKiBUaGlzIGNoYW5nZSBtYXJrcyB0aGUgYmVnaW5uaW5nIG9mIHZlcnNpb24gNC4wIG9mIHRoZSBydW5lc3RvbmUgY29tcG9uZW50c1xuICogTG9naW4vbG9nb3V0IGlzIG5vIGxvbmdlciBoYW5kbGVkIHRocm91Z2ggamF2YXNjcmlwdCBidXQgcmF0aGVyIHNlcnZlciBzaWRlLlxuICogTWFueSBvZiB0aGUgY29tcG9uZW50cyBkZXBlbmQgb24gdGhlIHJ1bmVzdG9uZTpsb2dpbiBldmVudCBzbyB3ZSB3aWxsIGtlZXAgdGhhdFxuICogZm9yIG5vdyB0byBrZWVwIHRoZSBjaHVybiBmYWlybHkgbWluaW1hbC5cbiAqL1xuXG4vKlxuXG4gQ29weXJpZ2h0IChDKSAyMDExICBCcmFkIE1pbGxlciAgYm9uZWxha2VAZ21haWwuY29tXG5cbiBUaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4gdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG4gVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG5cbiAqL1xuXG5pbXBvcnQgUnVuZXN0b25lQmFzZSBmcm9tIFwiLi9ydW5lc3RvbmViYXNlLmpzXCI7XG5pbXBvcnQgeyBtYXJrZWQgfSBmcm9tIFwibWFya2VkXCI7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gU2VydmVyLXN1cHBsaWVkIGVCb29rQ29uZmlnIHZhbHVlcyAoaXNzdWUgIzEzOTIpXG4vL1xuLy8gQSBQcmVUZVh0IHBhZ2Ugc2VydmVkIGJ5IGEgUnVuZXN0b25lIHNlcnZlciBzZXRzIGBgZWJvb2tfY29uZmlnX292ZXJyaWRlYGBcbi8vIHJpZ2h0IGFmdGVyIHRoZSBib29rIHRlbXBsYXRlJ3Mgb3duIGVCb29rQ29uZmlnIGFzc2lnbm1lbnRzLiAgVGhlIHNlcnZlciBpc1xuLy8gdGhlIGF1dGhvcml0eSBmb3IgdGhvc2UgdmFsdWVzIChjb3Vyc2UsIHVzZXIsIGFjdGl2aXRpZXMsIC4uLiksIHNvIHRoZXkgd2luXG4vLyBvdmVyIHdoYXRldmVyIHRoZSB0ZW1wbGF0ZSB3cm90ZS4gIFRoaXMgcnVucyB3aGVuIHRoZSBtb2R1bGUgaXMgZXZhbHVhdGVkLFxuLy8gYmVmb3JlIGFueXRoaW5nIGVsc2UgcmVhZHMgZUJvb2tDb25maWcuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmV4cG9ydCBmdW5jdGlvbiBhcHBseUVib29rQ29uZmlnT3ZlcnJpZGUoKSB7XG4gICAgY29uc3Qgb3ZlcnJpZGUgPSB3aW5kb3cuZWJvb2tfY29uZmlnX292ZXJyaWRlO1xuICAgIGlmIChvdmVycmlkZSAmJiB0eXBlb2Ygb3ZlcnJpZGUgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgd2luZG93LmVCb29rQ29uZmlnID0gT2JqZWN0LmFzc2lnbih3aW5kb3cuZUJvb2tDb25maWcgfHwge30sIG92ZXJyaWRlKTtcbiAgICB9XG59XG5hcHBseUVib29rQ29uZmlnT3ZlcnJpZGUoKTtcblxudmFyIHJiID0gbmV3IFJ1bmVzdG9uZUJhc2UoKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBDb25zb2xlIGNhcHR1cmUgZm9yIHByb2JsZW0gcmVwb3J0c1xuLy9cbi8vIFRoZSBicm93c2VyIGdpdmVzIHBhZ2Ugc2NyaXB0cyBubyB3YXkgdG8gcmVhZCB3aGF0IGlzIGFscmVhZHkgaW4gdGhlIGRldnRvb2xzXG4vLyBjb25zb2xlLCBzbyB3ZSBidWZmZXIgY29uc29sZSBvdXRwdXQgb3Vyc2VsdmVzIGZyb20gdGhlIG1vbWVudCB0aGlzIG1vZHVsZSBpc1xuLy8gZXZhbHVhdGVkLiAgVGhlIGJ1ZmZlciBpcyB3cml0dGVuIHRocm91Z2ggdG8gc2Vzc2lvblN0b3JhZ2UgKGRlYm91bmNlZCwgYW5kXG4vLyBhZ2FpbiBvbiBwYWdlaGlkZSkgc28gdGhlIFwiUmVwb3J0IGEgUHJvYmxlbVwiIGZvcm0gY2FuIGFsd2F5cyByZWFkIGl0IGJhY2tcbi8vIGludG8gYSBoaWRkZW4gZmllbGQsIGxldHRpbmcgcmVjZW50IGxvZyBvdXRwdXQgYW5kIHVuY2F1Z2h0IGVycm9ycyByaWRlIGFsb25nXG4vLyB3aXRoIHRoZSByZXBvcnQuICBXZSBjYW4ndCByZWx5IG9uIHN0YXNoaW5nIGl0IG9ubHkgd2hlbiB0aGUgUHJvYmxlbSBSZXBvcnRcbi8vIGxpbmsgaXMgY2xpY2tlZDogYSBiZWZvcmV1bmxvYWQgXCJMZWF2ZSBzaXRlP1wiIHByb21wdCAoZS5nLiBmcm9tIHRpbWVkIGV4YW1zKVxuLy8gY2FuIGdldCBpbiB0aGUgd2F5IG9mIHRoYXQuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmV4cG9ydCBjb25zdCBSU19DT05TT0xFX0xPR19LRVkgPSBcInJzX2NvbnNvbGVfbG9nXCI7XG5jb25zdCBSU19MT0dfQlVGRkVSX01BWCA9IDIwMDtcbmNvbnN0IFJTX0xPR19QRVJTSVNUX0RFTEFZX01TID0gNTAwO1xuY29uc3QgcnNDb25zb2xlQnVmZmVyID0gW107XG5sZXQgcnNQZXJzaXN0VGltZXIgPSBudWxsO1xuXG5mdW5jdGlvbiByc1BlcnNpc3RDb25zb2xlTG9nKCkge1xuICAgIGlmIChyc1BlcnNpc3RUaW1lcikge1xuICAgICAgICBjbGVhclRpbWVvdXQocnNQZXJzaXN0VGltZXIpO1xuICAgICAgICByc1BlcnNpc3RUaW1lciA9IG51bGw7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oUlNfQ09OU09MRV9MT0dfS0VZLCByc0dldENvbnNvbGVMb2coKSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBzZXNzaW9uU3RvcmFnZSBtYXkgYmUgdW5hdmFpbGFibGUgKGUuZy4gcHJpdmF0ZSBtb2RlKSBvciBmdWxsOyB0aGVcbiAgICAgICAgLy8gcmVwb3J0IGZvcm0gc2ltcGx5IHdvbid0IGJlIHByZWZpbGxlZCB3aXRoIHRoZSBsb2cuXG4gICAgfVxufVxuXG5mdW5jdGlvbiByc1NjaGVkdWxlUGVyc2lzdCgpIHtcbiAgICBpZiAoIXJzUGVyc2lzdFRpbWVyKSB7XG4gICAgICAgIHJzUGVyc2lzdFRpbWVyID0gc2V0VGltZW91dChcbiAgICAgICAgICAgIHJzUGVyc2lzdENvbnNvbGVMb2csXG4gICAgICAgICAgICBSU19MT0dfUEVSU0lTVF9ERUxBWV9NUyxcbiAgICAgICAgKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHJzRm9ybWF0TG9nQXJnKGFyZykge1xuICAgIGlmICh0eXBlb2YgYXJnID09PSBcInN0cmluZ1wiKSByZXR1cm4gYXJnO1xuICAgIGlmIChhcmcgaW5zdGFuY2VvZiBFcnJvcikgcmV0dXJuIGAke2FyZy5uYW1lfTogJHthcmcubWVzc2FnZX1gO1xuICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShhcmcpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIFN0cmluZyhhcmcpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gcnNSZWNvcmRMb2cobGV2ZWwsIGFyZ3MpIHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCBsaW5lID0gYFske2xldmVsfV0gJHtBcnJheS5mcm9tKGFyZ3MpLm1hcChyc0Zvcm1hdExvZ0FyZykuam9pbihcIiBcIil9YDtcbiAgICAgICAgcnNDb25zb2xlQnVmZmVyLnB1c2gobGluZSk7XG4gICAgICAgIGlmIChyc0NvbnNvbGVCdWZmZXIubGVuZ3RoID4gUlNfTE9HX0JVRkZFUl9NQVgpIHJzQ29uc29sZUJ1ZmZlci5zaGlmdCgpO1xuICAgICAgICByc1NjaGVkdWxlUGVyc2lzdCgpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gTmV2ZXIgbGV0IGxvZyBjYXB0dXJlIHRocm93IGFuZCBicmVhayB0aGUgcGFnZS5cbiAgICB9XG59XG5cbihmdW5jdGlvbiBpbnN0YWxsQ29uc29sZUNhcHR1cmUoKSB7XG4gICAgaWYgKHdpbmRvdy5fX3JzQ29uc29sZUNhcHR1cmVJbnN0YWxsZWQpIHJldHVybjtcbiAgICB3aW5kb3cuX19yc0NvbnNvbGVDYXB0dXJlSW5zdGFsbGVkID0gdHJ1ZTtcbiAgICBmb3IgKGNvbnN0IGxldmVsIG9mIFtcImxvZ1wiLCBcImluZm9cIiwgXCJ3YXJuXCIsIFwiZXJyb3JcIl0pIHtcbiAgICAgICAgY29uc3Qgb3JpZyA9IGNvbnNvbGVbbGV2ZWxdID8gY29uc29sZVtsZXZlbF0uYmluZChjb25zb2xlKSA6IG51bGw7XG4gICAgICAgIGNvbnNvbGVbbGV2ZWxdID0gZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgIHJzUmVjb3JkTG9nKGxldmVsLCBhcmdzKTtcbiAgICAgICAgICAgIGlmIChvcmlnKSBvcmlnKC4uLmFyZ3MpO1xuICAgICAgICB9O1xuICAgIH1cbiAgICAvLyBjb25zb2xlLmxvZygpIG5ldmVyIHNlZXMgdW5jYXVnaHQgZXJyb3JzIG9yIHJlamVjdGVkIHByb21pc2VzLCBzbyBsaXN0ZW5cbiAgICAvLyBmb3IgdGhvc2UgZGlyZWN0bHkuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJlcnJvclwiLCAoZSkgPT4ge1xuICAgICAgICBpZiAoZS5tZXNzYWdlKSB7XG4gICAgICAgICAgICByc1JlY29yZExvZyhcInVuY2F1Z2h0XCIsIFtcbiAgICAgICAgICAgICAgICBgJHtlLm1lc3NhZ2V9IEAgJHtlLmZpbGVuYW1lIHx8IFwiP1wifToke2UubGluZW5vIHx8IFwiP1wifWAsXG4gICAgICAgICAgICBdKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwidW5oYW5kbGVkcmVqZWN0aW9uXCIsIChlKSA9PiB7XG4gICAgICAgIHJzUmVjb3JkTG9nKFwicHJvbWlzZVwiLCBbcnNGb3JtYXRMb2dBcmcoZS5yZWFzb24pXSk7XG4gICAgfSk7XG4gICAgLy8gQ2F0Y2ggYW55dGhpbmcgbG9nZ2VkIGluc2lkZSB0aGUgZGVib3VuY2Ugd2luZG93IGJlZm9yZSB3ZSBuYXZpZ2F0ZSBhd2F5LlxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicGFnZWhpZGVcIiwgcnNQZXJzaXN0Q29uc29sZUxvZyk7XG59KSgpO1xuXG4vKiogUmVjZW50IGJ1ZmZlcmVkIGNvbnNvbGUgb3V0cHV0LCBuZXdlc3QgbGFzdCwgYXMgYSBzaW5nbGUgc3RyaW5nLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJzR2V0Q29uc29sZUxvZygpIHtcbiAgICByZXR1cm4gcnNDb25zb2xlQnVmZmVyLmpvaW4oXCJcXG5cIik7XG59XG5cbi8vXG4vLyBQYWdlIGRlY29yYXRpb24gZnVuY3Rpb25zXG4vL1xuLypcbk1heWJlIHNvbWV0aGluZyBsaWtlIHRoaXMgYXQgdGhlIHRvcDpcblxuQWN0aXZlIGFzc2lnbm1lbnQ6IFtDaCAxNSByZWFkaW5nXSAgICAgIFtFeGl0IGFzc2lnbm1lbnQgbGlua11cbk9uIHBhZ2UgKDMgb2YgNykgW1NlbGVjdCBpbnB1dCBzaG93aW5nIGN1cnJlbnQgcGFnZSwgY2FuIHNlbGVjdCBvdGhlcnNdXG5CZWNvbWluZyB0aGlzIGlmIG5vdCBvbiBhIHBhZ2UgaW4gYXNzaWdubWVudFxuXG5BY3RpdmUgYXNzaWdubWVudDogW0NoIDE1IHJlYWRpbmddICAgICAgW0V4aXQgYXNzaWdubWVudCBsaW5rXVxuVGhpcyBwYWdlIGlzIG5vdCBwYXJ0IG9mIHRoYXQgYXNzaWdubWVudC4gU2VsZWN0IGEgcGFnZSB0byByZXR1cm4gdG8gaXQ6XG5bU2VsZWN0IGlucHV0XVxuKi9cbmZ1bmN0aW9uIGFkZFJlYWRpbmdMaXN0KCkge1xuICAgIGxldCBhc3NpZ25tZW50X2luZm9fc3RyaW5nID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXG4gICAgICAgIGBjdXJyZW50QXNzaWdubWVudEluZm9fJHtlQm9va0NvbmZpZy5jb3Vyc2V9YCxcbiAgICApO1xuXG4gICAgaWYgKGFzc2lnbm1lbnRfaW5mb19zdHJpbmcgJiYgZUJvb2tDb25maWcucmVhZGluZ3MpIHtcbiAgICAgICAgdmFyIHRvcCxcbiAgICAgICAgICAgIGJvdHRvbSxcbiAgICAgICAgICAgIGFjdGl2ZSxcbiAgICAgICAgICAgIHBhZ2VfbmFtZSxcbiAgICAgICAgICAgIGV4aXRfbGluayxcbiAgICAgICAgICAgIGZzdCxcbiAgICAgICAgICAgIHNuZCxcbiAgICAgICAgICAgIG5ld19wb3MsXG4gICAgICAgICAgICBwYXRoX3BhcnRzLFxuICAgICAgICAgICAgbmV3X3Bvc19saW5rO1xuICAgICAgICB2YXIgYXNzaWdubWVudF9pbmZvID0gSlNPTi5wYXJzZShhc3NpZ25tZW50X2luZm9fc3RyaW5nKTtcbiAgICAgICAgbGV0IGFzc2lnbm1lbnRfaWQgPSBhc3NpZ25tZW50X2luZm8uaWQ7XG4gICAgICAgIGxldCBhc3NpZ25tZW50X25hbWUgPSBhc3NpZ25tZW50X2luZm8ubmFtZTtcbiAgICAgICAgbGV0IHJlYWRpbmdfbmFtZXMgPSBhc3NpZ25tZW50X2luZm8ucmVhZGluZ05hbWVzO1xuXG4gICAgICAgIGFjdGl2ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGFjdGl2ZS50ZXh0Q29udGVudCA9IFwiQWN0aXZlIGFzc2lnbm1lbnQ6IFwiO1xuXG4gICAgICAgIHBhZ2VfbmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xuICAgICAgICBwYWdlX25hbWUudGV4dENvbnRlbnQgPSBhc3NpZ25tZW50X25hbWU7XG4gICAgICAgIHBhZ2VfbmFtZS5ocmVmID0gYC9hc3NpZ25tZW50L3N0dWRlbnQvZG9Bc3NpZ25tZW50P2Fzc2lnbm1lbnRfaWQ9JHthc3NpZ25tZW50X2lkfWA7XG5cbiAgICAgICAgYWN0aXZlLmFwcGVuZChwYWdlX25hbWUpO1xuXG4gICAgICAgIGV4aXRfbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xuICAgICAgICBleGl0X2xpbmsudGV4dENvbnRlbnQgPSBcIiBFeGl0IEFzc2lnbm1lbnRcIjtcbiAgICAgICAgZXhpdF9saW5rLmhyZWYgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWU7XG5cbiAgICAgICAgZXhpdF9saW5rLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFxuICAgICAgICAgICAgICAgIGBjdXJyZW50QXNzaWdubWVudEluZm9fJHtlQm9va0NvbmZpZy5jb3Vyc2V9YCxcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vYWN0aXZlLmFwcGVuZChleGl0X2xpbmspXG5cbiAgICAgICAgbGV0IGN1cl9wYXRoX3BhcnRzID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLnNwbGl0KFwiL1wiKTtcbiAgICAgICAgbGV0IG5hbWUgPVxuICAgICAgICAgICAgY3VyX3BhdGhfcGFydHNbY3VyX3BhdGhfcGFydHMubGVuZ3RoIC0gMl0gK1xuICAgICAgICAgICAgXCIvXCIgK1xuICAgICAgICAgICAgY3VyX3BhdGhfcGFydHNbY3VyX3BhdGhfcGFydHMubGVuZ3RoIC0gMV07XG4gICAgICAgIC8vIGlmIGJvZHkgaGFzIHByZXRleHQgY2xhc3MsIHRoZW4gc3RyaXAgdGhlIGxlYWRpbmcgcGF0aCBwYXJ0cyBmcm9tIGVhY2ggb2YgdGhlIHN0cmluZ3MgaW4gZUJvb2tDb25maWcucmVhZGluZ3NcbiAgICAgICAgbGV0IGJvZHkgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImJvZHlcIilbMF07XG4gICAgICAgIGxldCBwdHhib29rID0gZmFsc2U7XG4gICAgICAgIGxldCBlbmRMb3AgPSAyO1xuICAgICAgICBpZiAoYm9keS5jbGFzc0xpc3QuY29udGFpbnMoXCJwcmV0ZXh0XCIpKSB7XG4gICAgICAgICAgICBwdHhib29rID0gdHJ1ZTtcbiAgICAgICAgICAgIGVCb29rQ29uZmlnLnJlYWRpbmdzID0gZUJvb2tDb25maWcucmVhZGluZ3MubWFwKChyKSA9PlxuICAgICAgICAgICAgICAgIHIuc3BsaXQoXCIvXCIpLnBvcCgpLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIG5hbWUgPSBuYW1lLnNwbGl0KFwiL1wiKS5wb3AoKTtcbiAgICAgICAgICAgIGVuZExvcCA9IDE7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcG9zaXRpb24gPSBlQm9va0NvbmZpZy5yZWFkaW5ncy5pbmRleE9mKG5hbWUpO1xuICAgICAgICBsZXQgbnVtX3JlYWRpbmdzID0gZUJvb2tDb25maWcucmVhZGluZ3MubGVuZ3RoO1xuICAgICAgICAvLyBnZXQgcHJldiBuYW1lXG4gICAgICAgIGlmIChwb3NpdGlvbiA+IDApIHtcbiAgICAgICAgICAgIG5ld19wb3MgPSBlQm9va0NvbmZpZy5yZWFkaW5nc1twb3NpdGlvbiAtIDFdO1xuICAgICAgICAgICAgcGF0aF9wYXJ0cyA9IGN1cl9wYXRoX3BhcnRzLnNsaWNlKFxuICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgY3VyX3BhdGhfcGFydHMubGVuZ3RoIC0gZW5kTG9wLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHBhdGhfcGFydHMucHVzaChuZXdfcG9zKTtcbiAgICAgICAgICAgIG5ld19wb3NfbGluayA9IHBhdGhfcGFydHMuam9pbihcIi9cIik7XG4gICAgICAgICAgICBmc3QgPSBhY3RpdmUuY2xvbmVOb2RlKHRydWUpO1xuICAgICAgICAgICAgbGV0IHR4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuICAgICAgICAgICAgdHh0LnRleHRDb250ZW50ID0gYFBhZ2UgJHtwb3NpdGlvbiArIDF9IG9mICR7bnVtX3JlYWRpbmdzfSwgYDtcbiAgICAgICAgICAgIHZhciBmc3RfbG5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XG4gICAgICAgICAgICAvL2ZzdF9sbmsuY2xhc3NOYW1lID0gXCJidG4gYnRuLWxnIHJlYWRpbmctbmF2aWdhdGlvbiBwcmV2LXJlYWRpbmdcIjtcbiAgICAgICAgICAgIGZzdF9sbmsuaHJlZiA9IG5ld19wb3NfbGluaztcbiAgICAgICAgICAgIGZzdF9sbmsudGV4dENvbnRlbnQgPSBgQmFjayB0byBwYWdlICR7XG4gICAgICAgICAgICAgICAgcG9zaXRpb25cbiAgICAgICAgICAgIH0gb2YgJHtudW1fcmVhZGluZ3N9OiAke3JlYWRpbmdfbmFtZXNbcG9zaXRpb24gLSAxXX0uYDtcbiAgICAgICAgICAgIHR4dC5hcHBlbmQoZnN0X2xuayk7XG4gICAgICAgICAgICBmc3QuYXBwZW5kKHR4dCk7XG4gICAgICAgIH0gZWxzZSBpZiAocG9zaXRpb24gPT0gMCkge1xuICAgICAgICAgICAgZnN0ID0gYWN0aXZlLmNsb25lTm9kZSh0cnVlKTtcbiAgICAgICAgICAgIGxldCB0eHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICAgICAgICAgIHR4dC50ZXh0Q29udGVudCA9IGBQYWdlIDEgb2YgJHtudW1fcmVhZGluZ3N9LmA7XG4gICAgICAgICAgICBmc3QuYXBwZW5kKHR4dCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyB0aGlzIGlzbid0IGEgcmVhZGluZyBwYWdlIGluIHRoZSBhc3NpZ25tZW50LCBjaGVjayB0byBzZWUgaWYgYW55XG4gICAgICAgICAgICAvLyBhY3Rpdml0aWVzIG9uIHRoaXMgcGFnZSBhcmUgYXNzaWduZWQgdG8gdGhlIGN1cnJlbnQgYXNzaWdubWVudFxuICAgICAgICAgICAgbGV0IGV4ZXJjaXNlT25QYWdlID0gZmFsc2U7XG4gICAgICAgICAgICBsZXQgcGFnZUV4ZXJjaXNlcyA9IE9iamVjdC5rZXlzKGNvbXBvbmVudE1hcCk7XG4gICAgICAgICAgICBpZiAocGFnZUV4ZXJjaXNlcy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgICAgIHBhZ2VFeGVyY2lzZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiW2RhdGEtY29tcG9uZW50XVwiKTtcbiAgICAgICAgICAgICAgICBwYWdlRXhlcmNpc2VzID0gQXJyYXkuZnJvbShwYWdlRXhlcmNpc2VzKS5tYXAoZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlbC5pZDtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAobGV0IGV4IG9mIHBhZ2VFeGVyY2lzZXMpIHtcbiAgICAgICAgICAgICAgICBpZiAoYXNzaWdubWVudF9pbmZvLnF1ZXN0aW9ucy5pbmNsdWRlcyhleCkpIHtcbiAgICAgICAgICAgICAgICAgICAgZXhlcmNpc2VPblBhZ2UgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBuZXdfcG9zID0gZUJvb2tDb25maWcucmVhZGluZ3NbMF07XG4gICAgICAgICAgICBwYXRoX3BhcnRzID0gY3VyX3BhdGhfcGFydHMuc2xpY2UoXG4gICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICBjdXJfcGF0aF9wYXJ0cy5sZW5ndGggLSBlbmRMb3AsXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcGF0aF9wYXJ0cy5wdXNoKG5ld19wb3MpO1xuICAgICAgICAgICAgbmV3X3Bvc19saW5rID0gcGF0aF9wYXJ0cy5qb2luKFwiL1wiKTtcbiAgICAgICAgICAgIGZzdCA9IGFjdGl2ZS5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICAgICAgICBsZXQgdHh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgICAgICAgICBpZiAoZXhlcmNpc2VPblBhZ2UpIHtcbiAgICAgICAgICAgICAgICB0eHQudGV4dENvbnRlbnQgPVxuICAgICAgICAgICAgICAgICAgICBcIlRoaXMgcGFnZSBoYXMgYWN0aXZpdGllcyBhc3NpZ25lZCB0byB0aGUgY3VycmVudCBhc3NpZ25tZW50LlwiO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0eHQudGV4dENvbnRlbnQgPVxuICAgICAgICAgICAgICAgICAgICBcIk5vdGljZTogdGhpcyBwYWdlIGlzIG5vdCBwYXJ0IG9mIHRoZSBhc3NpZ25tZW50LlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdHh0LmFwcGVuZChleGl0X2xpbmspO1xuICAgICAgICAgICAgZnN0LmFwcGVuZCh0eHQpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwb3NpdGlvbiA9PSBlQm9va0NvbmZpZy5yZWFkaW5ncy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAvLyBubyBtb3JlIHJlYWRpbmdzXG4gICAgICAgICAgICBzbmQgPSBhY3RpdmU7XG4gICAgICAgICAgICBsZXQgdHh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgICAgICAgICB0eHQudGV4dENvbnRlbnQgPSBgUGFnZSAke251bV9yZWFkaW5nc30gb2YgJHtudW1fcmVhZGluZ3N9OiAke3JlYWRpbmdfbmFtZXNbcG9zaXRpb25dfWA7XG4gICAgICAgICAgICBzbmQuYXBwZW5kKHR4dCk7XG4gICAgICAgIH0gZWxzZSBpZiAocG9zaXRpb24gPj0gMCkge1xuICAgICAgICAgICAgLy8gZ2V0IG5leHQgbmFtZVxuICAgICAgICAgICAgbmV3X3BvcyA9IGVCb29rQ29uZmlnLnJlYWRpbmdzW3Bvc2l0aW9uICsgMV07XG4gICAgICAgICAgICBwYXRoX3BhcnRzID0gY3VyX3BhdGhfcGFydHMuc2xpY2UoXG4gICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICBjdXJfcGF0aF9wYXJ0cy5sZW5ndGggLSBlbmRMb3AsXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcGF0aF9wYXJ0cy5wdXNoKG5ld19wb3MpO1xuICAgICAgICAgICAgbmV3X3Bvc19saW5rID0gcGF0aF9wYXJ0cy5qb2luKFwiL1wiKTtcbiAgICAgICAgICAgIHNuZCA9IGFjdGl2ZTtcbiAgICAgICAgICAgIHZhciBzbmRfbG5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XG4gICAgICAgICAgICAvL3NuZF9sbmsuY2xhc3NOYW1lID0gXCJidG4gYnRuLWxnIHJlYWRpbmctbmF2aWdhdGlvbiBuZXh0LXJlYWRpbmdcIjtcbiAgICAgICAgICAgIHNuZF9sbmsuaHJlZiA9IG5ld19wb3NfbGluaztcbiAgICAgICAgICAgIHNuZF9sbmsudGV4dENvbnRlbnQgPSBgQ29udGludWUgdG8gcGFnZSAke1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uICsgMlxuICAgICAgICAgICAgfSBvZiAke251bV9yZWFkaW5nc306ICR7cmVhZGluZ19uYW1lc1twb3NpdGlvbiArIDFdfWA7XG4gICAgICAgICAgICBsZXQgdHh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgICAgICAgICB0eHQuYXBwZW5kKHNuZF9sbmspO1xuICAgICAgICAgICAgc25kLmFwcGVuZCh0eHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc25kID0gYWN0aXZlLmNsb25lTm9kZSh0cnVlKTtcbiAgICAgICAgICAgIGxldCB0eHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICAgICAgICAgIHR4dC50ZXh0Q29udGVudCA9XG4gICAgICAgICAgICAgICAgXCJOb3RpY2U6IHRoaXMgcGFnZSBpcyBub3QgcGFydCBvZiB0aGUgYXNzaWdubWVudC4gVG8gcmVtb3ZlIHRoaXMgd2FybmluZyBjbGljayBcIjtcbiAgICAgICAgICAgIGxldCBleGl0X2Nsb25lID0gZXhpdF9saW5rLmNsb25lTm9kZSh0cnVlKTtcblxuICAgICAgICAgICAgZXhpdF9jbG9uZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXG4gICAgICAgICAgICAgICAgICAgIGBjdXJyZW50QXNzaWdubWVudEluZm9fJHtlQm9va0NvbmZpZy5jb3Vyc2V9YCxcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0eHQuYXBwZW5kKGV4aXRfY2xvbmUpO1xuICAgICAgICAgICAgc25kLmFwcGVuZCh0eHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgdG9wID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdG9wLmNsYXNzTmFtZSA9IFwicHR4LXJ1bmVzdG9uZS1jb250YWluZXJcIjtcbiAgICAgICAgZnN0LmNsYXNzTmFtZSA9IFwicnVuZXN0b25lIGFzc2lnbm1lbnQtbmF2IHRvcC1hc3NpZ25tZW50LW5hdlwiO1xuICAgICAgICAvL3RvcC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcInZhcigtLWNvbXBvbmVudEJnQ29sb3IpXCJcbiAgICAgICAgLy90b3Auc3R5bGUuYm9yZGVyQ29sb3IgPSBcInZhcigtLWNvbXBvbmVudEJvcmRlckNvbG9yKVwiXG4gICAgICAgIC8vdG9wLnN0eWxlLmJvcmRlcldpZHRoID0gXCIxcHhcIlxuICAgICAgICB0b3AuYXBwZW5kKGZzdCk7XG4gICAgICAgIC8vdG9wLmFwcGVuZChzbmQpO1xuXG4gICAgICAgIGJvdHRvbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGJvdHRvbS5jbGFzc05hbWUgPSBcInB0eC1ydW5lc3RvbmUtY29udGFpbmVyXCI7XG4gICAgICAgIHNuZC5jbGFzc05hbWUgPSBcInJ1bmVzdG9uZSBhc3NpZ25tZW50LW5hdiBib3R0b20tYXNzaWdubWVudC1uYXZcIjtcbiAgICAgICAgLy9ib3R0b20uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJ2YXIoLS1jb21wb25lbnRCZ0NvbG9yKVwiXG4gICAgICAgIC8vYm90dG9tLnN0eWxlLmJvcmRlckNvbG9yID0gXCJ2YXIoLS1jb21wb25lbnRCb3JkZXJDb2xvcilcIlxuICAgICAgICAvL2JvdHRvbS5zdHlsZS5ib3JkZXJXaWR0aCA9IFwiMXB4XCJcblxuICAgICAgICAvL2JvdHRvbS5hcHBlbmQoYWN0aXZlLmNsb25lTm9kZSh0cnVlKSk7XG4gICAgICAgIC8vYm90dG9tLmFwcGVuZChmc3QuY2xvbmVOb2RlKHRydWUpKTtcbiAgICAgICAgYm90dG9tLmFwcGVuZChzbmQpO1xuXG4gICAgICAgIC8vIGNoZWNrIHRoZSBib2R5IHRhZyB0byBzZWUgaWYgaXQgaGFzIGEgcHJldGV4dCBjbGFzcyAobm8ganF1ZXJ5KVxuICAgICAgICBpZiAocHR4Ym9vaykge1xuICAgICAgICAgICAgLy9hcHBlbmQgcGFydHMgdG8gdGhlIGhlYWRlciBhbmQgcHJvZ3Jlc3MgY29udGFpbmVyXG4gICAgICAgICAgICBsZXQgY29udGVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHR4LWNvbnRlbnRcIik7XG4gICAgICAgICAgICBpZiAoY29udGVudCkge1xuICAgICAgICAgICAgICAgIGNvbnRlbnQuaW5zZXJ0QmVmb3JlKHRvcCwgY29udGVudC5maXJzdENoaWxkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBwYyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2Nwcm9ncmVzc2NvbnRhaW5lclwiKTtcbiAgICAgICAgICAgIGlmIChwYykge1xuICAgICAgICAgICAgICAgIHBjLnN0eWxlLm1hcmdpbkJvdHRvbSA9IFwiMjBweFwiO1xuICAgICAgICAgICAgICAgIHBjLmFwcGVuZENoaWxkKGJvdHRvbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbWFpbkNvbnRlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1haW4tY29udGVudFwiKTtcbiAgICAgICAgaWYgKG1haW5Db250ZW50ICYmIHNuZCkge1xuICAgICAgICAgICAgbWFpbkNvbnRlbnQuaW5zZXJ0QmVmb3JlKHRvcCwgbWFpbkNvbnRlbnQuZmlyc3RDaGlsZCk7XG4gICAgICAgICAgICBtYWluQ29udGVudC5hcHBlbmRDaGlsZChib3R0b20pO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vKipcbiAqIEJ1aWxkIHRoZSBhY3Rpdml0eSBkaWN0aW9uYXJ5IGZvciB0aGUgcHJvZ3Jlc3MgYmFyIGJ5IHNjYW5uaW5nIHRoZSBwYWdlLlxuICpcbiAqIFRoaXMgaXMgdGhlIGZhbGxiYWNrIHVzZWQgd2hlbiB0aGUgc2VydmVyIGRpZCBub3Qgc2VuZCBhY3Rpdml0eSBjb3VudHMgLS1cbiAqIGkuZS4gd2hlbiBub2JvZHkgaXMgbG9nZ2VkIGluIGFuZCB0aGUgcGFnZSBpcyBiZWluZyBicm93c2VkLiAgVGhlIGtleXMgYXJlXG4gKiB0aGUgZGl2X2lkcyB0aGF0IGBgdXBkYXRlUHJvZ3Jlc3NgYCBpbmNyZW1lbnRzLCBzbyB0aGV5IGhhdmUgdG8gYmUgdGhlIGlkcyBvZlxuICogdGhlIGVsZW1lbnRzIGNhcnJ5aW5nIGBgZGF0YS1jb21wb25lbnRgYC4gIFRob3NlIGFyZSBub3QgYWx3YXlzIHRoZSBmaXJzdFxuICogY2hpbGQgb2YgdGhlIGBgLnJ1bmVzdG9uZWBgIHdyYXBwZXI6IFByZVRlWHQsIGZvciBpbnN0YW5jZSwgZW1pdHMgYW5cbiAqIGBgZXhlcmNpc2Utc3RhdGVtZW50YGAgZGl2IGFoZWFkIG9mIHRoZSBjb21wb25lbnQgZm9yIG11bHRpcGxlIGNob2ljZVxuICogcXVlc3Rpb25zLiAgS2V5aW5nIG9mZiB0aGUgZmlyc3QgY2hpbGQgaW4gdGhhdCBjYXNlIGdhdmUgZXZlcnkgc3VjaCBxdWVzdGlvblxuICogb24gdGhlIHBhZ2UgdGhlIHNhbWUgZW1wdHkga2V5LCBzbyBlaWdodCBleGVyY2lzZXMgY291bnRlZCBhcyBvbmUuXG4gKlxuICogQHBhcmFtIHtQYXJlbnROb2RlfSByb290IC0gd2hlcmUgdG8gbG9vazsgZGVmYXVsdHMgdG8gdGhlIHdob2xlIGRvY3VtZW50LlxuICogQHJldHVybnMge09iamVjdH0gYWN0aXZpdHkgaWRzIG1hcHBlZCB0byAwLCBwbHVzIHRoZSBgYHBhZ2VgYCBwc2V1ZG8tYWN0aXZpdHkuXG4gKi9cbi8vIE5hdmlnYXRpb24gYW5kIHJlZmVyZW5jZSBwYWdlcyByYXRoZXIgdGhhbiBjb250ZW50OiB0aGV5IGNhcnJ5IG5vIGFjdGl2aXRpZXMsXG4vLyBzbyB0aGV5IGdldCBubyBwcm9ncmVzcyBiYXIsIG5vIGNvbXBsZXRpb24gYnV0dG9uIGFuZCBubyBoaWdobGlnaHRpbmcuIEtlZXBcbi8vIHRoaXMgYXMgdGhlIHNpbmdsZSBsaXN0IC0tIGl0IHVzZWQgdG8gYmUgc3BlbGxlZCBvdXQgc2VwYXJhdGVseSBpblxuLy8gdXNlci1oaWdobGlnaHRzLmpzIGFuZCB0aGUgc3BoaW54IHByb2dyZXNzIHRlbXBsYXRlLCBhbmQgdGhlIGNvcGllcyBoYWRcbi8vIGRyaWZ0ZWQgYXBhcnQgKGdlbmluZGV4Lmh0bWwgd2FzIG1pc3NpbmcgaGVyZSwgd2hpY2ggbGVmdCBhIHByb2dyZXNzIGJhciBvblxuLy8gdGhlIEJvb2sgSW5kZXggcGFnZSkuXG5leHBvcnQgY29uc3QgTk9OX0NPTlRFTlRfUEFHRVMgPSBbXG4gICAgXCJpbmRleC5odG1sXCIsXG4gICAgXCJnZW5pbmRleC5odG1sXCIsXG4gICAgXCJ0b2N0cmVlLmh0bWxcIixcbiAgICBcInRvYy5odG1sXCIsXG4gICAgXCJuYXZoZWxwLmh0bWxcIixcbiAgICBcImFzc2lnbm1lbnRzLmh0bWxcIixcbiAgICBcIkV4ZXJjaXNlcy5odG1sXCIsXG4gICAgXCJzZWFyY2guaHRtbFwiLFxuXTtcblxuZXhwb3J0IGZ1bmN0aW9uIGlzQ291cnNlU3RhcnRlZCgpIHtcbiAgICBsZXQgc3RhcnREYXRlID0gZUJvb2tDb25maWcudGVybVN0YXJ0RGF0ZTsgLy8gZm9ybWF0IGlzIFwiMjAyNi0wOS0yMlwiXG4gICAgaWYgKCFzdGFydERhdGUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBsZXQgdG9kYXkgPSBuZXcgRGF0ZSgpO1xuICAgIGxldCBzdGFydCA9IG5ldyBEYXRlKHN0YXJ0RGF0ZSk7XG4gICAgcmV0dXJuIHRvZGF5ID49IHN0YXJ0O1xufVxuXG5mdW5jdGlvbiBjb3Vyc2VOb3RTdGFydGVkTWVzc2FnZSgpIHtcbiAgICBjb25zdCBmb3JtYXR0ZWREYXRlID0gbmV3IERhdGUoXG4gICAgICAgIGVCb29rQ29uZmlnLnRlcm1TdGFydERhdGUsXG4gICAgKS50b0xvY2FsZURhdGVTdHJpbmcodW5kZWZpbmVkLCB7XG4gICAgICAgIHllYXI6IFwibnVtZXJpY1wiLFxuICAgICAgICBtb250aDogXCJsb25nXCIsXG4gICAgICAgIGRheTogXCJudW1lcmljXCIsXG4gICAgfSk7XG4gICAgcmV0dXJuIChcbiAgICAgICAgXCJDb3Vyc2UgaGFzIG5vdCBzdGFydGVkIHlldC4gUHJvZ3Jlc3Mgd2lsbCBiZSB0cmFja2VkIHN0YXJ0aW5nIG9uIFwiICtcbiAgICAgICAgZm9ybWF0dGVkRGF0ZVxuICAgICk7XG59XG5cbi8qKiBUcnVlIHdoZW4gcGF0aG5hbWUgbmFtZXMgb25lIG9mIHRoZSBOT05fQ09OVEVOVF9QQUdFUy4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc05vbkNvbnRlbnRQYWdlKHBhdGhuYW1lID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lKSB7XG4gICAgbGV0IHBhZ2UgPSBwYXRobmFtZS5zcGxpdChcIi9cIikucG9wKCkudG9Mb3dlckNhc2UoKTtcbiAgICByZXR1cm4gTk9OX0NPTlRFTlRfUEFHRVMuc29tZSgocCkgPT4gcC50b0xvd2VyQ2FzZSgpID09PSBwYWdlKTtcbn1cblxuLyoqXG4gKiBUcnVlIHdoZW4gcGF0aG5hbWUgaXMgYSBib29rIHBhZ2UgdGhlIHNlcnZlciBrZWVwcyByZWFkaW5nIHByb2dyZXNzIGZvcjpcbiAqIGEgc3ViY2hhcHRlci4gVGhlIGludGVyYWN0aXZlcyBhbHNvIGxvYWQgb24gYXNzaWdubWVudCBwYWdlcywgYW5kIGFcbiAqIFByZVRlWHQgYm9vaydzIHJvb3QsIHBhcnQsIGNoYXB0ZXIsIGludHJvZHVjdGlvbiBhbmQgZnJvbnQgbWF0dGVyIHBhZ2VzXG4gKiBhcmUgbm90IHN1YmNoYXB0ZXJzIGVpdGhlcjsgYXNraW5nIHRoZSBwcm9ncmVzcyBlbmRwb2ludHMgYWJvdXQgYW55IG9mXG4gKiB0aGVtIG9ubHkgZWFybnMgYSA0MjIuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1N1YmNoYXB0ZXJQYWdlKFxuICAgIHBhdGhuYW1lID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLFxuICAgIGFjdGl2aXRpZXMgPSB3aW5kb3cuZUJvb2tDb25maWc/LmFjdGl2aXRpZXMsXG4pIHtcbiAgICBpZiAoIXBhdGhuYW1lLmluY2x1ZGVzKFwiL2Jvb2tzL3B1Ymxpc2hlZC9cIikgfHwgaXNOb25Db250ZW50UGFnZShwYXRobmFtZSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICAvLyBzZXJ2ZV9wYWdlIHNlbmRzIHRoZSBjaGFwdGVyIGl0IGZvdW5kIGZvciB0aGUgcGFnZSwgbnVsbCB3aGVuIHRoZSBwYWdlXG4gICAgLy8gaXMgbm90IGEgc3ViY2hhcHRlci4gUGFnZXMgcmVuZGVyZWQgYnkgYW4gb2xkZXIgc2VydmVyIGRvbid0IHNlbmQgaXQuXG4gICAgcmV0dXJuIChcbiAgICAgICAgIShhY3Rpdml0aWVzICYmIFwicGFnZV9jaGFwdGVyXCIgaW4gYWN0aXZpdGllcykgfHxcbiAgICAgICAgISFhY3Rpdml0aWVzLnBhZ2VfY2hhcHRlclxuICAgICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb3VudEFjdGl2aXRpZXNJblBhZ2Uocm9vdCA9IGRvY3VtZW50KSB7XG4gICAgbGV0IGFjdGl2aXRpZXMgPSB7IHBhZ2U6IDAgfTtcbiAgICByb290LnF1ZXJ5U2VsZWN0b3JBbGwoXCIucnVuZXN0b25lXCIpLmZvckVhY2goZnVuY3Rpb24gKGUsIGluZGV4KSB7XG4gICAgICAgIC8vIEEgY29tcG9uZW50IG1heSBiZSB0aGUgd3JhcHBlciBpdHNlbGYgb3Igc29tZXdoZXJlIGluc2lkZSBpdC4gTmVzdGVkXG4gICAgICAgIC8vIHBhcnRzIG9mIGEgY29tcG9uZW50IChtY2hvaWNlIGFuc3dlcnMsIGZlZWRiYWNrKSBhbHNvIGNhcnJ5XG4gICAgICAgIC8vIGRhdGEtY29tcG9uZW50LCBidXQgcXVlcnlTZWxlY3RvciByZXR1cm5zIHRoZSBvdXRlcm1vc3QgbWF0Y2ggZmlyc3QuXG4gICAgICAgIGxldCBjb21wb25lbnQgPSBlLm1hdGNoZXMoXCJbZGF0YS1jb21wb25lbnRdXCIpXG4gICAgICAgICAgICA/IGVcbiAgICAgICAgICAgIDogZS5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtY29tcG9uZW50XVwiKTtcbiAgICAgICAgbGV0IGlkID0gY29tcG9uZW50Py5pZCB8fCBlLmZpcnN0RWxlbWVudENoaWxkPy5pZDtcbiAgICAgICAgLy8gV2l0aG91dCBhbiBpZCB3ZSBjYW5ub3QgbWF0Y2ggdGhpcyBhY3Rpdml0eSB0byBhIGNvbXBsZXRpb24gZXZlbnQsXG4gICAgICAgIC8vIGJ1dCBpdCBpcyBzdGlsbCBvbmUgYWN0aXZpdHk6IGdpdmUgaXQgYSBrZXkgb2YgaXRzIG93biBzbyBpdCBpcyBub3RcbiAgICAgICAgLy8gZm9sZGVkIHRvZ2V0aGVyIHdpdGggZXZlcnkgb3RoZXIgdW5pZGVudGlmaWVkIG9uZSBvbiB0aGUgcGFnZS5cbiAgICAgICAgYWN0aXZpdGllc1tpZCB8fCBgdW5pZGVudGlmaWVkLWFjdGl2aXR5LSR7aW5kZXh9YF0gPSAwO1xuICAgIH0pO1xuICAgIHJldHVybiBhY3Rpdml0aWVzO1xufVxuXG5leHBvcnQgY2xhc3MgUGFnZVByb2dyZXNzQmFyIHtcbiAgICBjb25zdHJ1Y3RvcihhY3REaWN0KSB7XG4gICAgICAgIHRoaXMucG9zc2libGUgPSAwO1xuICAgICAgICAvLyBUaGUgcGFnZSBpdHNlbGYgY291bnRzIGFzIG9uZSBpdGVtIGFuZCBpcyBhdHRlbXB0ZWQgYXMgc29vbiBhcyBpdCBpc1xuICAgICAgICAvLyBvcGVuZWQuIFRoYXQgaXMgd2hhdCBsZXRzIGEgcGFnZSB3aXRoIG5vIGFjdGl2aXRpZXMgb24gaXQgc3RpbGwgYmVcbiAgICAgICAgLy8gY29tcGxldGVkLlxuICAgICAgICB0aGlzLnRvdGFsID0gMTtcbiAgICAgICAgLy8gcGFnZV9jaGFwdGVyIHJpZGVzIGFsb25nIGZvciBpc1N1YmNoYXB0ZXJQYWdlOyBpdCBpcyBub3QgYW5cbiAgICAgICAgLy8gYWN0aXZpdHkuIENvcHkgcmF0aGVyIHRoYW4gZGVsZXRlIHNvIHRoYXQgY2hlY2sgc3RpbGwgc2VlcyBpdC5cbiAgICAgICAgaWYgKGFjdERpY3QgJiYgXCJwYWdlX2NoYXB0ZXJcIiBpbiBhY3REaWN0KSB7XG4gICAgICAgICAgICBhY3REaWN0ID0geyAuLi5hY3REaWN0IH07XG4gICAgICAgICAgICBkZWxldGUgYWN0RGljdC5wYWdlX2NoYXB0ZXI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFjdERpY3QgJiYgXCJhc3NpZ25tZW50X3NwZWNcIiBpbiBhY3REaWN0KSB7XG4gICAgICAgICAgICB0aGlzLmFzc2lnbm1lbnRfc3BlYyA9IGFjdERpY3QuYXNzaWdubWVudF9zcGVjO1xuICAgICAgICAgICAgZGVsZXRlIGFjdERpY3QuYXNzaWdubWVudF9zcGVjO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhY3REaWN0ICYmIE9iamVjdC5rZXlzKGFjdERpY3QpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuYWN0aXZpdGllcyA9IGFjdERpY3Q7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmFjdGl2aXRpZXMgPSBjb3VudEFjdGl2aXRpZXNJblBhZ2UoKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBCb3RoIGRpY3RzIGFyZSBleHBlY3RlZCB0byBjYXJyeSBhIGBwYWdlYCBlbnRyeSBmb3IgdGhlIHBhZ2UgaXRzZWxmOlxuICAgICAgICAvLyBjb3VudEFjdGl2aXRpZXNJblBhZ2UoKSBhZGRzIG9uZSwgYW5kIHRoZSBzZXJ2ZXIgc2VuZHMgdGhlIHBhZ2UncyBvd25cbiAgICAgICAgLy8gcXVlc3Rpb24gcm93IHVuZGVyIHRoYXQga2V5LiBPbGRlciBzZXJ2ZXJzIGtleWVkIHRoYXQgcm93IGJ5IGl0c1xuICAgICAgICAvLyBxdWVzdGlvbiBuYW1lIGluc3RlYWQsIHdoaWNoIG1hZGUgdGhlIHBhZ2UgbG9vayBsaWtlIGFuIGV4dHJhXG4gICAgICAgIC8vIGFjdGl2aXR5OyBub3RoaW5nIHdlIGNhbiBkbyBhYm91dCB0aGF0IGhlcmUsIGJ1dCBrZWVwIHRoZSBmYWxsYmFjayBzb1xuICAgICAgICAvLyBhIHNlcnZlciB0aGF0IHNlbmRzIG5vIHBhZ2UgZW50cnkgYXQgYWxsIHN0aWxsIGxpbmVzIHVwLlxuICAgICAgICBpZiAoIShcInBhZ2VcIiBpbiB0aGlzLmFjdGl2aXRpZXMpKSB7XG4gICAgICAgICAgICB0aGlzLmFjdGl2aXRpZXMucGFnZSA9IDE7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jYWxjdWxhdGVQcm9ncmVzcygpO1xuICAgICAgICAvLyBIaWRlIHRoZSBwcm9ncmVzcyBiYXIgb24gbmF2aWdhdGlvbiBwYWdlcywgd2hpY2ggaGF2ZSBubyBhY3Rpdml0aWVzLlxuICAgICAgICBpZiAoaXNOb25Db250ZW50UGFnZSgpKSB7XG4gICAgICAgICAgICBjb25zdCBzY3Byb2dyZXNzY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG4gICAgICAgICAgICAgICAgXCJzY3Byb2dyZXNzY29udGFpbmVyXCIsXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgaWYgKHNjcHJvZ3Jlc3Njb250YWluZXIpIHNjcHJvZ3Jlc3Njb250YWluZXIuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVuZGVyUHJvZ3Jlc3MoKTtcbiAgICB9XG5cbiAgICBjYWxjdWxhdGVQcm9ncmVzcygpIHtcbiAgICAgICAgZm9yIChsZXQgayBpbiB0aGlzLmFjdGl2aXRpZXMpIHtcbiAgICAgICAgICAgIGlmIChrICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBvc3NpYmxlKys7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuYWN0aXZpdGllc1trXSA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50b3RhbCsrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldCBhY3Rpdml0aWVzQXR0ZW1wdGVkKCkge1xuICAgICAgICByZXR1cm4gTWF0aC5tYXgodGhpcy50b3RhbCwgMCk7XG4gICAgfVxuXG4gICAgZ2V0IGFjdGl2aXRpZXNQb3NzaWJsZSgpIHtcbiAgICAgICAgcmV0dXJuIE1hdGgubWF4KHRoaXMucG9zc2libGUsIDApO1xuICAgIH1cblxuICAgIHJlbmRlclByb2dyZXNzKCkge1xuICAgICAgICBsZXQgdmFsdWUgPSAwO1xuICAgICAgICBjb25zdCBzY3Byb2dyZXNzdG90YWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNjcHJvZ3Jlc3N0b3RhbFwiKTtcbiAgICAgICAgaWYgKHNjcHJvZ3Jlc3N0b3RhbClcbiAgICAgICAgICAgIHNjcHJvZ3Jlc3N0b3RhbC50ZXh0Q29udGVudCA9IHRoaXMuYWN0aXZpdGllc0F0dGVtcHRlZDtcbiAgICAgICAgY29uc3Qgc2Nwcm9ncmVzc3Bvc3MgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNjcHJvZ3Jlc3Nwb3NzXCIpO1xuICAgICAgICBpZiAoc2Nwcm9ncmVzc3Bvc3MpXG4gICAgICAgICAgICBzY3Byb2dyZXNzcG9zcy50ZXh0Q29udGVudCA9IHRoaXMuYWN0aXZpdGllc1Bvc3NpYmxlO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdmFsdWUgPSAoMTAwICogdGhpcy50b3RhbCkgLyB0aGlzLnBvc3NpYmxlO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHByb2dyZXNzVGV4dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2Nwcm9ncmVzcy1hY3Rpdml0eS1jb3VudFwiKTtcbiAgICAgICAgLy8gV2FybiBpZiBjb3Vyc2Ugbm90IHN0YXJ0ZWRcbiAgICAgICAgaWYgKHByb2dyZXNzVGV4dCAmJiAhaXNDb3Vyc2VTdGFydGVkKCkpIHtcbiAgICAgICAgICAgIHByb2dyZXNzVGV4dC5hcHBlbmRDaGlsZChcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjb3Vyc2VOb3RTdGFydGVkTWVzc2FnZSgpKSxcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gUmVwbGFjZSAjc3ViY2hhcHRlcnByb2dyZXNzIGRpdiB3aXRoIGEgbmF0aXZlIDxwcm9ncmVzcz4gZWxlbWVudCBpZiBub3QgYWxyZWFkeSBkb25lXG4gICAgICAgIGxldCBzdWJjaGFwdGVycHJvZ3Jlc3MgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN1YmNoYXB0ZXJwcm9ncmVzc1wiKTtcbiAgICAgICAgaWYgKHN1YmNoYXB0ZXJwcm9ncmVzcyAmJiBzdWJjaGFwdGVycHJvZ3Jlc3MudGFnTmFtZSAhPT0gXCJQUk9HUkVTU1wiKSB7XG4gICAgICAgICAgICAvLyBSZXBsYWNlIHRoZSBkaXYgd2l0aCBhIDxwcm9ncmVzcz4gZWxlbWVudFxuICAgICAgICAgICAgY29uc3QgcHJvZ3Jlc3NFbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInByb2dyZXNzXCIpO1xuICAgICAgICAgICAgcHJvZ3Jlc3NFbGVtLmlkID0gXCJzdWJjaGFwdGVycHJvZ3Jlc3NcIjtcbiAgICAgICAgICAgIHByb2dyZXNzRWxlbS5tYXggPSAxMDA7XG4gICAgICAgICAgICBwcm9ncmVzc0VsZW0udmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICAgIC8vIENvcHkgb3ZlciBhbnkgY2xhc3NlcyBmcm9tIHRoZSBvbGQgZGl2XG4gICAgICAgICAgICBwcm9ncmVzc0VsZW0uY2xhc3NOYW1lID0gc3ViY2hhcHRlcnByb2dyZXNzLmNsYXNzTmFtZTtcbiAgICAgICAgICAgIHN1YmNoYXB0ZXJwcm9ncmVzcy5yZXBsYWNlV2l0aChwcm9ncmVzc0VsZW0pO1xuICAgICAgICAgICAgc3ViY2hhcHRlcnByb2dyZXNzID0gcHJvZ3Jlc3NFbGVtO1xuICAgICAgICB9IGVsc2UgaWYgKHN1YmNoYXB0ZXJwcm9ncmVzcykge1xuICAgICAgICAgICAgc3ViY2hhcHRlcnByb2dyZXNzLm1heCA9IDEwMDtcbiAgICAgICAgICAgIHN1YmNoYXB0ZXJwcm9ncmVzcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmFzc2lnbm1lbnRfc3BlYykge1xuICAgICAgICAgICAgLy8gSWYgdGhlIHVzZXIgaGFzIGNvbXBsZXRlZCBhbGwgYWN0aXZpdGllcywgc2VuZCB0aGUgcmVhZGluZyBzY29yZS5cbiAgICAgICAgICAgIC8vIFRoaXMgaGFuZGxlcyB0aGUgY2FzZSB3aGVyZSB0aGVyZSBhcmUgbm8gYWN0aXZpdGllcyBvbiB0aGUgcGFnZSBvclxuICAgICAgICAgICAgLy8gIHdoZXJlIHRoZSB1c2VyIGNvbXBsZXRlZCBhY3Rpdml0aWVzIG9uIHRoZSBhc3NpZ25tZW50IHBhZ2UgYW5kIG5vd1xuICAgICAgICAgICAgLy8gIGlzIHZpZXdpbmcgdGhlIHJlYWRpbmcgcGFnZS5cbiAgICAgICAgICAgIC8vIGFjdGl2aXRpZXNfcmVxdWlyZWQgY291bnRzIGFjdGl2aXRpZXMgdGhlIHJlYWRlciBjb21wbGV0ZXMsIHNvXG4gICAgICAgICAgICAvLyBjb21wYXJlIGFnYWluc3QgYWN0aXZpdGllc0F0dGVtcHRlZCByYXRoZXIgdGhhbiB0b3RhbCAtLSB0b3RhbFxuICAgICAgICAgICAgLy8gaW5jbHVkZXMgdGhlIHBhZ2UgaXRzZWxmLCB3aGljaCB1c2VkIHRvIHNlbmQgdGhlIHJlYWRpbmcgc2NvcmVcbiAgICAgICAgICAgIC8vIG9uZSBhY3Rpdml0eSBlYXJseS5cbiAgICAgICAgICAgIGxldCBjb21wbGV0ZUFjdGl2aXRpZXMgPSB0aGlzLmFjdGl2aXRpZXNBdHRlbXB0ZWQ7XG4gICAgICAgICAgICBsZXQgcmVxdWlyZWRBY3Rpdml0aWVzID0gdGhpcy5hc3NpZ25tZW50X3NwZWMuYWN0aXZpdGllc19yZXF1aXJlZDtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICByZXF1aXJlZEFjdGl2aXRpZXMgPT09IG51bGwgfHxcbiAgICAgICAgICAgICAgICByZXF1aXJlZEFjdGl2aXRpZXMgPT09IHVuZGVmaW5lZFxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgLy8gTm90aGluZyBzcGVjaWZpYyBpcyByZXF1aXJlZCBvbiB0aGlzIHBhZ2UsIHNvIG9wZW5pbmcgaXQgaXNcbiAgICAgICAgICAgICAgICAvLyBlbm91Z2guIFJlY29yZCBob3cgbWFueSBhY3Rpdml0aWVzIGFyZSBoZXJlIGZvciB0aGUgY2hlY2sgaW5cbiAgICAgICAgICAgICAgICAvLyB1cGRhdGVQcm9ncmVzcygpLlxuICAgICAgICAgICAgICAgIHJlcXVpcmVkQWN0aXZpdGllcyA9IDA7XG4gICAgICAgICAgICAgICAgdGhpcy5hc3NpZ25tZW50X3NwZWMuYWN0aXZpdGllc19yZXF1aXJlZCA9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWN0aXZpdGllc1Bvc3NpYmxlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNvbXBsZXRlQWN0aXZpdGllcyA+PSByZXF1aXJlZEFjdGl2aXRpZXMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbmRDb21wbGV0ZWRSZWFkaW5nU2NvcmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJSZWFkaW5nIHNjb3JlIHNlbnQgZm9yIHBhZ2VcIik7XG4gICAgICAgICAgICAgICAgICAgIC8vIHdhaXQgYSB0aWNrIHRoZW4gbWFyayB0aGUgcGFnZSBjb21wbGV0ZVxuICAgICAgICAgICAgICAgICAgICAvLyB0aGlzIGlzIG5lZWRlZCB0byBsZXQgdGhlIHByb2dyZXNzIGJhciB1cGRhdGUgYmVmb3JlIG1hcmtpbmcgY29tcGxldGVcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgY2IgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbXBsZXRpb25CdXR0b25cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2IgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYi50ZXh0Q29udGVudC50b0xvd2VyQ2FzZSgpID09PSBcIm1hcmsgYXMgY29tcGxldGVkXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiLmNsaWNrKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sIDUwMCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFlQm9va0NvbmZpZy5pc0xvZ2dlZEluKSB7XG4gICAgICAgICAgICBjb25zdCBzdWJjaGFwdGVyRGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdWJjaGFwdGVycHJvZ3Jlc3NcIik7XG4gICAgICAgICAgICBpZiAoc3ViY2hhcHRlckRpdikgc3ViY2hhcHRlckRpdi5jbGFzc0xpc3QuYWRkKFwibG9nZ2Vkb3V0XCIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXBkYXRlUHJvZ3Jlc3MoZGl2X2lkKSB7XG4gICAgICAgIHRoaXMuYWN0aXZpdGllc1tkaXZfaWRdKys7XG4gICAgICAgIC8vIE9ubHkgdXBkYXRlIHRoZSBwcm9ncmVzcyBiYXIgb24gdGhlIGZpcnN0IGludGVyYWN0aW9uIHdpdGggYW4gb2JqZWN0LlxuICAgICAgICBpZiAodGhpcy5hY3Rpdml0aWVzW2Rpdl9pZF0gPT09IDEpIHtcbiAgICAgICAgICAgIHRoaXMudG90YWwrKztcbiAgICAgICAgICAgIGxldCB2YWwgPSAoMTAwICogdGhpcy50b3RhbCkgLyB0aGlzLnBvc3NpYmxlO1xuICAgICAgICAgICAgY29uc3Qgc2Nwcm9ncmVzc3RvdGFsMiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2Nwcm9ncmVzc3RvdGFsXCIpO1xuICAgICAgICAgICAgaWYgKHNjcHJvZ3Jlc3N0b3RhbDIpXG4gICAgICAgICAgICAgICAgc2Nwcm9ncmVzc3RvdGFsMi50ZXh0Q29udGVudCA9IHRoaXMuYWN0aXZpdGllc0F0dGVtcHRlZDtcbiAgICAgICAgICAgIGNvbnN0IHNjcHJvZ3Jlc3Nwb3NzMiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2Nwcm9ncmVzc3Bvc3NcIik7XG4gICAgICAgICAgICBpZiAoc2Nwcm9ncmVzc3Bvc3MyKVxuICAgICAgICAgICAgICAgIHNjcHJvZ3Jlc3Nwb3NzMi50ZXh0Q29udGVudCA9IHRoaXMuYWN0aXZpdGllc1Bvc3NpYmxlO1xuICAgICAgICAgICAgbGV0IHN1YmNoYXB0ZXJwcm9ncmVzczIgPVxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3ViY2hhcHRlcnByb2dyZXNzXCIpO1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIHN1YmNoYXB0ZXJwcm9ncmVzczIgJiZcbiAgICAgICAgICAgICAgICBzdWJjaGFwdGVycHJvZ3Jlc3MyLnRhZ05hbWUgPT09IFwiUFJPR1JFU1NcIlxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgc3ViY2hhcHRlcnByb2dyZXNzMi52YWx1ZSA9IHZhbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICB0aGlzLmFzc2lnbm1lbnRfc3BlYyAmJlxuICAgICAgICAgICAgICAgIHRoaXMuYXNzaWdubWVudF9zcGVjLmFjdGl2aXRpZXNfcmVxdWlyZWQgIT09IG51bGwgJiZcbiAgICAgICAgICAgICAgICB0aGlzLmFjdGl2aXRpZXNBdHRlbXB0ZWQgPj1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hc3NpZ25tZW50X3NwZWMuYWN0aXZpdGllc19yZXF1aXJlZFxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJSZXF1aXJlZCBhY3Rpdml0aWVzIGNvbXBsZXRlZFwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbmRDb21wbGV0ZWRSZWFkaW5nU2NvcmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJSZWFkaW5nIHNjb3JlIHNlbnRcIik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgdmFsID09IDEwMC4wICYmXG4gICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2IgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbXBsZXRpb25CdXR0b25cIik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICBjYiAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgY2IudGV4dENvbnRlbnQgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIGNiLnRleHRDb250ZW50LnRvTG93ZXJDYXNlKCkgPT09IFwibWFyayBhcyBjb21wbGV0ZWRcIlxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0pKClcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNiID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb21wbGV0aW9uQnV0dG9uXCIpO1xuICAgICAgICAgICAgICAgIGlmIChjYiAmJiB0eXBlb2YgY2IuY2xpY2sgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgICAgICBjYi5jbGljaygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFzeW5jIHNlbmRDb21wbGV0ZWRSZWFkaW5nU2NvcmUoKSB7XG4gICAgICAgIGxldCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoe1xuICAgICAgICAgICAgXCJDb250ZW50LXR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04XCIsXG4gICAgICAgICAgICBBY2NlcHQ6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgICB9KTtcbiAgICAgICAgbGV0IGRhdGEgPSB7IC4uLnRoaXMuYXNzaWdubWVudF9zcGVjIH07XG4gICAgICAgIGxldCByZXF1ZXN0ID0gbmV3IFJlcXVlc3QoXG4gICAgICAgICAgICBgJHtlQm9va0NvbmZpZy5uZXdfc2VydmVyX3ByZWZpeH0vbG9nZ2VyL3VwZGF0ZV9yZWFkaW5nX3Njb3JlYCxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGRhdGEpLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IGhlYWRlcnMsXG4gICAgICAgICAgICB9LFxuICAgICAgICApO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2gocmVxdWVzdCk7XG4gICAgICAgICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcbiAgICAgICAgICAgICAgICAgICAgYEZhaWxlZCB0byBzZW5kIHJlYWRpbmcgc2NvcmUhICR7cmVzcG9uc2Uuc3RhdHVzVGV4dH1gLFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGBFcnJvciBzZW5kaW5nIHJlYWRpbmcgc2NvcmUgJHtlfWApO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgdmFyIHBhZ2VQcm9ncmVzc1RyYWNrZXIgPSB7fTtcblxuZnVuY3Rpb24gZ2V0Q29va2llKG5hbWUpIHtcbiAgICBjb25zdCB2YWx1ZSA9IGA7ICR7ZG9jdW1lbnQuY29va2llfWA7XG4gICAgY29uc3QgcGFydHMgPSB2YWx1ZS5zcGxpdChgOyAke25hbWV9PWApO1xuICAgIGlmIChwYXJ0cy5sZW5ndGggPT09IDIpIHJldHVybiBwYXJ0cy5wb3AoKS5zcGxpdChcIjtcIikuc2hpZnQoKTtcbn1cblxubGV0IHN0dWR5Q2x1ZXNDb252ZXJzYXRpb25JZCA9IC0xO1xuXG5mdW5jdGlvbiBhcHBlbmRTdHVkeUNsdWVzTWVzc2FnZShtZXNzYWdlc0VsLCByb2xlLCB0ZXh0LCBpc0h0bWwgPSBmYWxzZSkge1xuICAgIGNvbnN0IGJ1YmJsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgYnViYmxlLmNsYXNzTmFtZSA9IGBzdHVkeWNsdWVzLW1lc3NhZ2UgJHtyb2xlfWA7XG4gICAgaWYgKGlzSHRtbCkge1xuICAgICAgICBidWJibGUuaW5uZXJIVE1MID0gdGV4dDtcbiAgICB9IGVsc2Uge1xuICAgICAgICBidWJibGUudGV4dENvbnRlbnQgPSB0ZXh0O1xuICAgIH1cbiAgICBtZXNzYWdlc0VsLmFwcGVuZENoaWxkKGJ1YmJsZSk7XG4gICAgbWVzc2FnZXNFbC5zY3JvbGxUb3AgPSBtZXNzYWdlc0VsLnNjcm9sbEhlaWdodDtcbn1cblxuZnVuY3Rpb24gY3JlYXRlU3R1ZHlDbHVlc1dpZGdldCgpIHtcbiAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdHVkeWNsdWVzLWZhYlwiKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gICAgc3R5bGUudGV4dENvbnRlbnQgPSBgXG4gICAgICAgICNzdHVkeWNsdWVzLWZhYiB7XG4gICAgICAgICAgICBwb3NpdGlvbjogZml4ZWQ7XG4gICAgICAgICAgICByaWdodDogMjRweDtcbiAgICAgICAgICAgIGJvdHRvbTogMjRweDtcbiAgICAgICAgICAgIHotaW5kZXg6IDk5OTk7XG4gICAgICAgICAgICBib3JkZXI6IG5vbmU7XG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiA5OTk5cHg7XG4gICAgICAgICAgICBwYWRkaW5nOiAxMnB4IDE4cHg7XG4gICAgICAgICAgICBmb250LXNpemU6IDE0cHg7XG4gICAgICAgICAgICBmb250LXdlaWdodDogNjAwO1xuICAgICAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgICAgICAgICAgY29sb3I6ICNmZmY7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiAjMjU2M2ViO1xuICAgICAgICAgICAgYm94LXNoYWRvdzogMCA4cHggMjRweCByZ2JhKDAsIDAsIDAsIDAuMik7XG4gICAgICAgIH1cblxuICAgICAgICAjc3R1ZHljbHVlcy1jaGF0IHtcbiAgICAgICAgICAgIHBvc2l0aW9uOiBmaXhlZDtcbiAgICAgICAgICAgIHJpZ2h0OiAyNHB4O1xuICAgICAgICAgICAgYm90dG9tOiA3OHB4O1xuICAgICAgICAgICAgei1pbmRleDogOTk5OTtcbiAgICAgICAgICAgIHdpZHRoOiBtaW4oNDIwcHgsIGNhbGMoMTAwdncgLSAzMnB4KSk7XG4gICAgICAgICAgICBoZWlnaHQ6IG1pbig1MjBweCwgY2FsYygxMDB2aCAtIDEyMHB4KSk7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiAjZmZmO1xuICAgICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgI2QxZDVkYjtcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDEycHg7XG4gICAgICAgICAgICBib3gtc2hhZG93OiAwIDE0cHggMzZweCByZ2JhKDAsIDAsIDAsIDAuMjUpO1xuICAgICAgICAgICAgZGlzcGxheTogbm9uZTtcbiAgICAgICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgICAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgICAgICB9XG5cbiAgICAgICAgI3N0dWR5Y2x1ZXMtY2hhdC5vcGVuIHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIH1cblxuICAgICAgICAuc3R1ZHljbHVlcy1oZWFkZXIge1xuICAgICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gICAgICAgICAgICBwYWRkaW5nOiAxMHB4IDEycHg7XG4gICAgICAgICAgICBib3JkZXItYm90dG9tOiAxcHggc29saWQgI2U1ZTdlYjtcbiAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiAjZjlmYWZiO1xuICAgICAgICB9XG5cbiAgICAgICAgLnN0dWR5Y2x1ZXMtY2xvc2Uge1xuICAgICAgICAgICAgYm9yZGVyOiBub25lO1xuICAgICAgICAgICAgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7XG4gICAgICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICAgICAgICBmb250LXNpemU6IDE2cHg7XG4gICAgICAgICAgICBsaW5lLWhlaWdodDogMTtcbiAgICAgICAgfVxuXG4gICAgICAgIC5zdHVkeWNsdWVzLWNvYWNoLXRvZ2dsZSB7XG4gICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgICAgIGdhcDogNnB4O1xuICAgICAgICAgICAgZm9udC1zaXplOiAxMnB4O1xuICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICAgICAgICAgIGNvbG9yOiAjNGI1NTYzO1xuICAgICAgICB9XG5cbiAgICAgICAgLnN0dWR5Y2x1ZXMtY29hY2gtdG9nZ2xlIGlucHV0W3R5cGU9XCJjaGVja2JveFwiXSB7XG4gICAgICAgICAgICBhcHBlYXJhbmNlOiBub25lO1xuICAgICAgICAgICAgLXdlYmtpdC1hcHBlYXJhbmNlOiBub25lO1xuICAgICAgICAgICAgd2lkdGg6IDMycHg7XG4gICAgICAgICAgICBoZWlnaHQ6IDE4cHg7XG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiA5OTk5cHg7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiAjZDFkNWRiO1xuICAgICAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgICAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgICAgICAgICAgdHJhbnNpdGlvbjogYmFja2dyb3VuZCAwLjJzO1xuICAgICAgICAgICAgZmxleC1zaHJpbms6IDA7XG4gICAgICAgIH1cblxuICAgICAgICAuc3R1ZHljbHVlcy1jb2FjaC10b2dnbGUgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdOjphZnRlciB7XG4gICAgICAgICAgICBjb250ZW50OiBcIlwiO1xuICAgICAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgICAgICAgdG9wOiAycHg7XG4gICAgICAgICAgICBsZWZ0OiAycHg7XG4gICAgICAgICAgICB3aWR0aDogMTRweDtcbiAgICAgICAgICAgIGhlaWdodDogMTRweDtcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgICAgICAgICAgIGJhY2tncm91bmQ6ICNmZmY7XG4gICAgICAgICAgICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4ycztcbiAgICAgICAgfVxuXG4gICAgICAgIC5zdHVkeWNsdWVzLWNvYWNoLXRvZ2dsZSBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl06Y2hlY2tlZCB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiAjMjU2M2ViO1xuICAgICAgICB9XG5cbiAgICAgICAgLnN0dWR5Y2x1ZXMtY29hY2gtdG9nZ2xlIGlucHV0W3R5cGU9XCJjaGVja2JveFwiXTpjaGVja2VkOjphZnRlciB7XG4gICAgICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMTRweCk7XG4gICAgICAgIH1cblxuICAgICAgICAuc3R1ZHljbHVlcy1tZXNzYWdlcyB7XG4gICAgICAgICAgICBmbGV4OiAxO1xuICAgICAgICAgICAgb3ZlcmZsb3cteTogYXV0bztcbiAgICAgICAgICAgIHBhZGRpbmc6IDEycHg7XG4gICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgICAgIGdhcDogMTBweDtcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IHZhcigtLWJhY2tncm91bmQpO1xuICAgICAgICAgICAgY29sb3I6IHZhcigtLWJvZHlGb250KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC5zdHVkeWNsdWVzLW1lc3NhZ2Uge1xuICAgICAgICAgICAgbWF4LXdpZHRoOiA4NSU7XG4gICAgICAgICAgICBwYWRkaW5nOiAxMHB4IDEycHg7XG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiAxMHB4O1xuICAgICAgICAgICAgd2hpdGUtc3BhY2U6IHByZS13cmFwO1xuICAgICAgICAgICAgd29yZC1icmVhazogYnJlYWstd29yZDtcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICAgICAgICAgIGxpbmUtaGVpZ2h0OiAxLjQ7XG4gICAgICAgIH1cblxuICAgICAgICAuc3R1ZHljbHVlcy1tZXNzYWdlLnVzZXIge1xuICAgICAgICAgICAgbWFyZ2luLWxlZnQ6IGF1dG87XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiB2YXIoLS1jb21wb25lbnRCZ0NvbG9yKTtcbiAgICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkICNiZmRiZmU7XG4gICAgICAgICAgICBjb2xvcjogdmFyKC0tYm9keUZvbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLnN0dWR5Y2x1ZXMtbWVzc2FnZS5hc3Npc3RhbnQge1xuICAgICAgICAgICAgbWFyZ2luLXJpZ2h0OiBhdXRvO1xuICAgICAgICAgICAgYmFja2dyb3VuZDogdmFyKC0tYmFja2dyb3VuZCk7XG4gICAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1ncmF5VG9XaGl0ZSk7XG4gICAgICAgICAgICBjb2xvcjogdmFyKC0tYm9keUZvbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLnN0dWR5Y2x1ZXMtbWVzc2FnZS5zdHVkeWNsdWVzLWxvYWRpbmcge1xuICAgICAgICAgICAgY29sb3I6IHZhcigtLWJvZHlGb250KTtcbiAgICAgICAgICAgIGZvbnQtc3R5bGU6IGl0YWxpYztcbiAgICAgICAgfVxuXG4gICAgICAgIC5zdHVkeWNsdWVzLXNwaW5uZXIge1xuICAgICAgICAgICAgZGlzcGxheTogaW5saW5lLWZsZXg7XG4gICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICAgICAgZ2FwOiA0cHg7XG4gICAgICAgIH1cblxuICAgICAgICAuc3R1ZHljbHVlcy1zcGlubmVyLWRvdCB7XG4gICAgICAgICAgICB3aWR0aDogNnB4O1xuICAgICAgICAgICAgaGVpZ2h0OiA2cHg7XG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiA1MCU7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiAjNmI3MjgwO1xuICAgICAgICAgICAgb3BhY2l0eTogMC4zNTtcbiAgICAgICAgICAgIGFuaW1hdGlvbjogc3R1ZHljbHVlcy1kb3QtcHVsc2UgMXMgaW5maW5pdGUgZWFzZS1pbi1vdXQ7XG4gICAgICAgIH1cblxuICAgICAgICAuc3R1ZHljbHVlcy1zcGlubmVyLWRvdDpudGgtY2hpbGQoMikge1xuICAgICAgICAgICAgYW5pbWF0aW9uLWRlbGF5OiAwLjE1cztcbiAgICAgICAgfVxuXG4gICAgICAgIC5zdHVkeWNsdWVzLXNwaW5uZXItZG90Om50aC1jaGlsZCgzKSB7XG4gICAgICAgICAgICBhbmltYXRpb24tZGVsYXk6IDAuM3M7XG4gICAgICAgIH1cblxuICAgICAgICBAa2V5ZnJhbWVzIHN0dWR5Y2x1ZXMtZG90LXB1bHNlIHtcbiAgICAgICAgICAgIDAlLFxuICAgICAgICAgICAgODAlLFxuICAgICAgICAgICAgMTAwJSB7XG4gICAgICAgICAgICAgICAgb3BhY2l0eTogMC4zNTtcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgNDAlIHtcbiAgICAgICAgICAgICAgICBvcGFjaXR5OiAxO1xuICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogc2NhbGUoMS4yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC5zdHVkeWNsdWVzLWlucHV0YmFyIHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICBnYXA6IDhweDtcbiAgICAgICAgICAgIHBhZGRpbmc6IDEwcHg7XG4gICAgICAgICAgICBib3JkZXItdG9wOiAxcHggc29saWQgI2U1ZTdlYjtcbiAgICAgICAgICAgIGJhY2tncm91bmQ6ICNmZmY7XG4gICAgICAgIH1cblxuICAgICAgICAuc3R1ZHljbHVlcy1pbnB1dGJhciBpbnB1dCB7XG4gICAgICAgICAgICBmbGV4OiAxO1xuICAgICAgICAgICAgbWluLXdpZHRoOiAwO1xuICAgICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgI2QxZDVkYjtcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDhweDtcbiAgICAgICAgICAgIHBhZGRpbmc6IDhweCAxMHB4O1xuICAgICAgICAgICAgZm9udC1zaXplOiAxNHB4O1xuICAgICAgICB9XG5cbiAgICAgICAgLnN0dWR5Y2x1ZXMtaW5wdXRiYXIgYnV0dG9uIHtcbiAgICAgICAgICAgIGJvcmRlcjogbm9uZTtcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDhweDtcbiAgICAgICAgICAgIHBhZGRpbmc6IDhweCAxMnB4O1xuICAgICAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgICAgICAgICAgY29sb3I6ICNmZmY7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiAjMjU2M2ViO1xuICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgICAgICAgfVxuICAgIGA7XG4gICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzdHlsZSk7XG5cbiAgICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgIGJ1dHRvbi5pZCA9IFwic3R1ZHljbHVlcy1mYWJcIjtcbiAgICBidXR0b24udGV4dENvbnRlbnQgPSBcIlN0dWR5Q2x1ZXMgQ2hhdFwiO1xuXG4gICAgY29uc3QgY2hhdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgY2hhdC5pZCA9IFwic3R1ZHljbHVlcy1jaGF0XCI7XG4gICAgY2hhdC5pbm5lckhUTUwgPSBgXG4gICAgICAgIDxkaXYgY2xhc3M9XCJzdHVkeWNsdWVzLWhlYWRlclwiPlxuICAgICAgICAgICAgPHNwYW4+U3R1ZHlDbHVlczwvc3Bhbj5cbiAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cInN0dWR5Y2x1ZXMtY29hY2gtdG9nZ2xlXCI+XG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGlkPVwic3R1ZHljbHVlcy1jb2FjaC1tb2RlXCIgY2hlY2tlZCAvPlxuICAgICAgICAgICAgICAgIENvYWNoIE1vZGVcbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwic3R1ZHljbHVlcy1jbG9zZVwiIGFyaWEtbGFiZWw9XCJDbG9zZSBjaGF0XCI+4pyVPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwic3R1ZHljbHVlcy1tZXNzYWdlc1wiPjwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwic3R1ZHljbHVlcy1pbnB1dGJhclwiPlxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgcGxhY2Vob2xkZXI9XCJBc2sgYSBxdWVzdGlvbiBhYm91dCB0aGlzIGNvdXJzZS4uLlwiIC8+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIj5TZW5kPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgIGA7XG5cbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGJ1dHRvbik7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChjaGF0KTtcblxuICAgIGNvbnN0IGNsb3NlQnRuID0gY2hhdC5xdWVyeVNlbGVjdG9yKFwiLnN0dWR5Y2x1ZXMtY2xvc2VcIik7XG4gICAgY29uc3QgbWVzc2FnZXNFbCA9IGNoYXQucXVlcnlTZWxlY3RvcihcIi5zdHVkeWNsdWVzLW1lc3NhZ2VzXCIpO1xuICAgIGNvbnN0IGlucHV0RWwgPSBjaGF0LnF1ZXJ5U2VsZWN0b3IoXCIuc3R1ZHljbHVlcy1pbnB1dGJhciBpbnB1dFwiKTtcbiAgICBjb25zdCBzZW5kQnRuID0gY2hhdC5xdWVyeVNlbGVjdG9yKFwiLnN0dWR5Y2x1ZXMtaW5wdXRiYXIgYnV0dG9uXCIpO1xuICAgIGNvbnN0IGNvYWNoVG9nZ2xlID0gY2hhdC5xdWVyeVNlbGVjdG9yKFwiI3N0dWR5Y2x1ZXMtY29hY2gtbW9kZVwiKTtcblxuICAgIGxldCBjb2FjaE1vZGUgPSBjb2FjaFRvZ2dsZS5jaGVja2VkO1xuICAgIGNvYWNoVG9nZ2xlLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKCkgPT4ge1xuICAgICAgICBjb2FjaE1vZGUgPSBjb2FjaFRvZ2dsZS5jaGVja2VkO1xuICAgIH0pO1xuXG4gICAgY29uc3QgdG9nZ2xlQ2hhdCA9ICgpID0+IHtcbiAgICAgICAgY2hhdC5jbGFzc0xpc3QudG9nZ2xlKFwib3BlblwiKTtcbiAgICAgICAgaWYgKGNoYXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwib3BlblwiKSkge1xuICAgICAgICAgICAgaW5wdXRFbC5mb2N1cygpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGNvbnN0IHNlbmRNZXNzYWdlID0gYXN5bmMgKCkgPT4ge1xuICAgICAgICBsZXQgcXVlcnkgPSBpbnB1dEVsLnZhbHVlLnRyaW0oKTtcbiAgICAgICAgaWYgKCFxdWVyeSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBzZWN0aW9uSW5mbyA9IFwiXCI7XG4gICAgICAgIC8vIGZpbmQgdGhlIHNlY3Rpb24gdGl0bGUgb24gdGhlIHBhZ2UgdG8gaW5jbHVkZSBpbiB0aGUgaW5pdGlhbCBxdWVyeVxuICAgICAgICBpZiAoXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiYm9keS5wcmV0ZXh0XCIpICYmXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwic2VjdGlvbi5zZWN0aW9uXCIpXG4gICAgICAgICkge1xuICAgICAgICAgICAgbGV0IHNlY3Rpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwic2VjdGlvbi5zZWN0aW9uXCIpO1xuICAgICAgICAgICAgbGV0IHNlY3Rpb25UaXRsZSA9IHNlY3Rpb24ucXVlcnlTZWxlY3RvcihcInNwYW4udGl0bGVcIikuaW5uZXJUZXh0O1xuICAgICAgICAgICAgbGV0IHNlY3Rpb25OdW1iZXIgPVxuICAgICAgICAgICAgICAgIHNlY3Rpb24ucXVlcnlTZWxlY3RvcihcInNwYW4uY29kZW51bWJlclwiKS5pbm5lclRleHQ7XG4gICAgICAgICAgICBzZWN0aW9uSW5mbyA9IGAke3NlY3Rpb25OdW1iZXJ9ICR7c2VjdGlvblRpdGxlfWA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgc2VjdGlvblNwYW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwic3Bhbi5zZWN0aW9uLW51bWJlclwiKTtcbiAgICAgICAgICAgIGlmIChzZWN0aW9uU3Bhbikge1xuICAgICAgICAgICAgICAgIHNlY3Rpb25JbmZvID0gc2VjdGlvblNwYW4ucGFyZW50RWxlbWVudC5pbm5lclRleHQudHJpbSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChzdHVkeUNsdWVzQ29udmVyc2F0aW9uSWQgPT09IC0xKSB7XG4gICAgICAgICAgICBpZiAoc2VjdGlvbkluZm8pIHtcbiAgICAgICAgICAgICAgICBxdWVyeSA9IGBSZWdhcmRpbmcgc2VjdGlvbiBcIiR7c2VjdGlvbkluZm99XCI6ICR7cXVlcnl9YDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByYi5sb2dCb29rRXZlbnQoe1xuICAgICAgICAgICAgZXZlbnQ6IFwic3R1ZHljbHVlc19xdWVyeVwiLFxuICAgICAgICAgICAgYWN0OiBgcXVlcnk6ICR7cXVlcnl9YCxcbiAgICAgICAgICAgIGRpdl9pZDogYCR7c2VjdGlvbkluZm99YCxcbiAgICAgICAgfSk7XG4gICAgICAgIGFwcGVuZFN0dWR5Q2x1ZXNNZXNzYWdlKG1lc3NhZ2VzRWwsIFwidXNlclwiLCBxdWVyeSk7IC8vIHRvZG86IG1ha2UgdGhpcyBjb25kaXRpb25hbCBvbiBiZWluZyBhIGJvb2sgcGFnZSBhbmQgb24gdGhlIGJvb2sgYmVpbmcgb25lIG9mIHRoZSBzdXBwb3J0ZWQgYm9va3NcbiAgICAgICAgaW5wdXRFbC52YWx1ZSA9IFwiXCI7XG4gICAgICAgIHNlbmRCdG4uZGlzYWJsZWQgPSB0cnVlO1xuXG4gICAgICAgIGNvbnN0IGxvYWRpbmdCdWJibGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBsb2FkaW5nQnViYmxlLmNsYXNzTmFtZSA9XG4gICAgICAgICAgICBcInN0dWR5Y2x1ZXMtbWVzc2FnZSBhc3Npc3RhbnQgc3R1ZHljbHVlcy1sb2FkaW5nXCI7XG4gICAgICAgIGxvYWRpbmdCdWJibGUuaW5uZXJIVE1MID1cbiAgICAgICAgICAgICdUaGlua2luZyA8c3BhbiBjbGFzcz1cInN0dWR5Y2x1ZXMtc3Bpbm5lclwiPjxzcGFuIGNsYXNzPVwic3R1ZHljbHVlcy1zcGlubmVyLWRvdFwiPjwvc3Bhbj48c3BhbiBjbGFzcz1cInN0dWR5Y2x1ZXMtc3Bpbm5lci1kb3RcIj48L3NwYW4+PHNwYW4gY2xhc3M9XCJzdHVkeWNsdWVzLXNwaW5uZXItZG90XCI+PC9zcGFuPjwvc3Bhbj4nO1xuICAgICAgICBtZXNzYWdlc0VsLmFwcGVuZENoaWxkKGxvYWRpbmdCdWJibGUpO1xuICAgICAgICBtZXNzYWdlc0VsLnNjcm9sbFRvcCA9IG1lc3NhZ2VzRWwuc2Nyb2xsSGVpZ2h0O1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFxuICAgICAgICAgICAgICAgIGAvYXNzaWdubWVudC9zdHVkZW50L3N0dWR5Y2x1ZXNfcXVlcnlgLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBBY2NlcHQ6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBxdWVyeSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnZlcnNhdGlvbl9pZDogc3R1ZHlDbHVlc0NvbnZlcnNhdGlvbklkLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29hY2hNb2RlLFxuICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgICAgICAgYFJlcXVlc3QgZmFpbGVkIHdpdGggc3RhdHVzICR7cmVzcG9uc2Uuc3RhdHVzfWAsXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgcGF5bG9hZCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgICAgIGNvbnN0IGRldGFpbCA9IHBheWxvYWQ/LmRldGFpbCB8fCB7fTtcbiAgICAgICAgICAgIGNvbnN0IHN0dWR5Y2x1ZXNSZXNwb25zZSA9IGRldGFpbD8ucmVzcG9uc2UgfHwge307XG4gICAgICAgICAgICBjb25zdCBsbG1SZXNwb25zZSA9IHN0dWR5Y2x1ZXNSZXNwb25zZT8ubGxtX3Jlc3BvbnNlO1xuICAgICAgICAgICAgY29uc3QgcmVmZXJlbmNlcyA9IHN0dWR5Y2x1ZXNSZXNwb25zZT8ucmVmZXJlbmNlcyB8fCB7fTtcblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBkZXRhaWwuY29udmVyc2F0aW9uX2lkID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICAgICAgc3R1ZHlDbHVlc0NvbnZlcnNhdGlvbklkID0gZGV0YWlsLmNvbnZlcnNhdGlvbl9pZDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgbWFya2Rvd25SZXNwb25zZSA9IChcbiAgICAgICAgICAgICAgICBsbG1SZXNwb25zZSB8fCBcIk5vIHJlc3BvbnNlIGF2YWlsYWJsZSBmcm9tIFN0dWR5Q2x1ZXMuXCJcbiAgICAgICAgICAgICkucmVwbGFjZSgvXFxbKFteXFxdXSspXFxdXFwoKFteKV0rKVxcKS9nLCAobWF0Y2gsIHRleHQsIGtleSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHVybCA9IHJlZmVyZW5jZXNba2V5XT8uY29udGVudF91cmw7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVybCA/IGBbJHt0ZXh0fV0oJHt1cmx9KWAgOiBtYXRjaDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc3QgZm9ybWF0dGVkUmVzcG9uc2UgPSBtYXJrZWQucGFyc2UobWFya2Rvd25SZXNwb25zZSk7XG4gICAgICAgICAgICAvLyBhZGQgYSB0YXJnZXQ9XCJfYmxhbmtcIiB0byBhbGwgbGlua3MgaW4gdGhlIGZvcm1hdHRlZCByZXNwb25zZVxuICAgICAgICAgICAgY29uc3QgdGVtcERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICB0ZW1wRGl2LmlubmVySFRNTCA9IGZvcm1hdHRlZFJlc3BvbnNlO1xuICAgICAgICAgICAgdGVtcERpdi5xdWVyeVNlbGVjdG9yQWxsKFwiYVwiKS5mb3JFYWNoKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgYS5zZXRBdHRyaWJ1dGUoXCJ0YXJnZXRcIiwgXCJfYmxhbmtcIik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnN0IGZpbmFsRm9ybWF0dGVkUmVzcG9uc2UgPSB0ZW1wRGl2LmlubmVySFRNTDtcbiAgICAgICAgICAgIGFwcGVuZFN0dWR5Q2x1ZXNNZXNzYWdlKFxuICAgICAgICAgICAgICAgIG1lc3NhZ2VzRWwsXG4gICAgICAgICAgICAgICAgXCJhc3Npc3RhbnRcIixcbiAgICAgICAgICAgICAgICBmaW5hbEZvcm1hdHRlZFJlc3BvbnNlLFxuICAgICAgICAgICAgICAgIHRydWUsXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmIubG9nQm9va0V2ZW50KHtcbiAgICAgICAgICAgICAgICBldmVudDogXCJzdHVkeWNsdWVzX3Jlc3BvbnNlXCIsXG4gICAgICAgICAgICAgICAgYWN0OiBgY29hY2g6JHtjb2FjaE1vZGV9OnJlc3BvbnNlOiR7bWFya2Rvd25SZXNwb25zZS5zdWJzdHJpbmcoMCwgNTEyKX1gLFxuICAgICAgICAgICAgICAgIGRpdl9pZDogYCR7c2VjdGlvbkluZm99YCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGFwcGVuZFN0dWR5Q2x1ZXNNZXNzYWdlKFxuICAgICAgICAgICAgICAgIG1lc3NhZ2VzRWwsXG4gICAgICAgICAgICAgICAgXCJhc3Npc3RhbnRcIixcbiAgICAgICAgICAgICAgICBcIlNvcnJ5LCBTdHVkeUNsdWVzIGlzIHVuYXZhaWxhYmxlIHJpZ2h0IG5vdy4gUGxlYXNlIHRyeSBhZ2Fpbi5cIixcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiU3R1ZHlDbHVlcyBjaGF0IGVycm9yOlwiLCBlcnIpO1xuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgbG9hZGluZ0J1YmJsZS5yZW1vdmUoKTtcbiAgICAgICAgICAgIHNlbmRCdG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIGlucHV0RWwuZm9jdXMoKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRvZ2dsZUNoYXQpO1xuICAgIGNsb3NlQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0b2dnbGVDaGF0KTtcbiAgICBzZW5kQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBzZW5kTWVzc2FnZSk7XG4gICAgaW5wdXRFbC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCAoZXZ0KSA9PiB7XG4gICAgICAgIGlmIChldnQua2V5ID09PSBcIkVudGVyXCIpIHtcbiAgICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgc2VuZE1lc3NhZ2UoKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBzaG91bGRTaG93U3R1ZHlDbHVlc1dpZGdldCgpIHtcbiAgICBpZiAoIShcbiAgICAgICAgbG9jYXRpb24ucGF0aG5hbWUuaW5jbHVkZXMoXCIvbnMvYm9va3MvXCIpIHx8XG4gICAgICAgIGxvY2F0aW9uLnBhdGhuYW1lLmluY2x1ZGVzKFwiZG9Bc3NpZ25tZW50XCIpXG4gICAgKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIGVCb29rQ29uZmlnLmNvdXJzZV9hdHRycz8uc3R1ZHlDbHVlcyA9PT0gXCJUcnVlXCI7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZVBhZ2VTZXR1cCgpIHtcbiAgICB2YXIgbWVzcztcbiAgICBpZiAoZUJvb2tDb25maWcudXNlUnVuZXN0b25lU2VydmljZXMpIHtcbiAgICAgICAgbGV0IGhlYWRlcnMgPSBuZXcgSGVhZGVycyh7XG4gICAgICAgICAgICBcIkNvbnRlbnQtdHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLThcIixcbiAgICAgICAgICAgIEFjY2VwdDogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgIH0pO1xuICAgICAgICBsZXQgZGF0YSA9IHtcbiAgICAgICAgICAgIHRpbWV6b25lb2Zmc2V0OiBuZXcgRGF0ZSgpLmdldFRpbWV6b25lT2Zmc2V0KCkgLyA2MCxcbiAgICAgICAgICAgIHRpbWV6b25lOiBJbnRsLkRhdGVUaW1lRm9ybWF0KCkucmVzb2x2ZWRPcHRpb25zKCkudGltZVpvbmUsXG4gICAgICAgIH07XG4gICAgICAgIGxldCBSU19pbmZvID0gZ2V0Q29va2llKFwiUlNfaW5mb1wiKTtcbiAgICAgICAgdmFyIHR6X21hdGNoID0gZmFsc2U7XG4gICAgICAgIGlmIChSU19pbmZvKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGxldCBjbGVhbmVkID0gUlNfaW5mby5yZXBsYWNlKC9cXFxcMDU0L2csIFwiLFwiKTsgLy8gaGFuZGxlIG9jdGFsIGNvbW1hIGVuY29kaW5nXG4gICAgICAgICAgICAgICAgbGV0IGluZm8gPSBKU09OLnBhcnNlKGRlY29kZVVSSUNvbXBvbmVudChjbGVhbmVkKSk7XG4gICAgICAgICAgICAgICAgaW5mbyA9IEpTT04ucGFyc2UoZGVjb2RlVVJJQ29tcG9uZW50KGluZm8pKTtcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgIGluZm8udGltZXpvbmUgPT09IGRhdGEudGltZXpvbmUgJiZcbiAgICAgICAgICAgICAgICAgICAgaW5mby50el9vZmZzZXQgPT09IGRhdGEudGltZXpvbmVvZmZzZXRcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlRpbWV6b25lIGNvb2tpZSBtYXRjaGVzLCBub3Qgc2VuZGluZyB0aW1lem9uZSB0byBzZXJ2ZXJcIixcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgdHpfbWF0Y2ggPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFxuICAgICAgICAgICAgICAgICAgICBcIkVycm9yIHBhcnNpbmcgUlNfaW5mbyBjb29raWUsIHNlbmRpbmcgdGltZXpvbmUgdG8gc2VydmVyXCIsXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodHpfbWF0Y2ggPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAvLyBTZXQgYSBjb29raWUgc28gd2UgZG9uJ3QgaGF2ZSB0byBkbyB0aGlzIGFnYWluIGZvciBhIHdoaWxlLlxuICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSBuZXcgUmVxdWVzdChcbiAgICAgICAgICAgICAgICBgJHtlQm9va0NvbmZpZy5uZXdfc2VydmVyX3ByZWZpeH0vbG9nZ2VyL3NldF90el9vZmZzZXRgLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZGF0YSksXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IGhlYWRlcnMsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGxldCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHJlcXVlc3QpO1xuICAgICAgICAgICAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcbiAgICAgICAgICAgICAgICAgICAgICAgIGBGYWlsZWQgdG8gc2V0IHRpbWV6b25lISAke3Jlc3BvbnNlLnN0YXR1c1RleHR9YCxcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGBFcnJvciBzZXR0aW5nIHRpbWV6b25lICR7ZX1gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFBUWCBnZW5lcmF0ZWQgcGFnZXMgbWF5IGhhdmUgc3RhbGUgSFRNTC4gRm9yY2libHkgcmUtcmVuZGVyIHRoZSBjb250ZW50XG4gICAgLy8gb2YgdGhlIHByb2dyZXNzIGNvbnRhaW5lci4gQW55IGxvZ2ljIHRoYXQgbW9kaWZpZXMgdGhlIHByb2dyZXNzIGNvbnRhaW5lclxuICAgIC8vIHNob3VsZCBiZSBkb25lIGFmdGVyIHRoaXMgcG9pbnQsIG9yIGl0IHdpbGwgYmUgb3ZlcndyaXR0ZW4uXG4gICAgY29uc3Qgc2Nwcm9ncmVzc2NvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2Nwcm9ncmVzc2NvbnRhaW5lclwiKTtcbiAgICBpZiAoc2Nwcm9ncmVzc2NvbnRhaW5lcilcbiAgICAgICAgc2Nwcm9ncmVzc2NvbnRhaW5lci5pbm5lckhUTUwgPSBgXG4gICAgICAgICAgICA8ZGl2IGlkPVwic2Nwcm9ncmVzcy1hY3Rpdml0eS1jb3VudFwiPlxuICAgICAgICAgICAgICAgIFlvdSBoYXZlIGF0dGVtcHRlZCA8c3BhbiBpZD1cInNjcHJvZ3Jlc3N0b3RhbFwiPjwvc3Bhbj4gb2ZcbiAgICAgICAgICAgICAgICA8c3BhbiBpZD1cInNjcHJvZ3Jlc3Nwb3NzXCI+PC9zcGFuPiBhY3Rpdml0aWVzIG9uIHRoaXMgcGFnZS5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBpZD1cInN1YmNoYXB0ZXJwcm9ncmVzc1wiIGFyaWEtbGFiZWw9XCJQYWdlIHByb2dyZXNzXCI+PC9kaXY+XG4gICAgICAgIGA7XG5cbiAgICBjb25zb2xlLmxvZyhgVGhpcyBwYWdlIHNlcnZlZCBieSAke2VCb29rQ29uZmlnLnNlcnZlZF9ieX1gKTtcbiAgICBpZiAoZUJvb2tDb25maWcuaXNMb2dnZWRJbikge1xuICAgICAgICBtZXNzID0gYHVzZXJuYW1lOiAke2VCb29rQ29uZmlnLnVzZXJuYW1lfWA7XG4gICAgICAgIGlmICghZUJvb2tDb25maWcuaXNJbnN0cnVjdG9yKSB7XG4gICAgICAgICAgICBjb25zdCBpcERyb3Bkb3duID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpcF9kcm9wZG93bl9saW5rXCIpO1xuICAgICAgICAgICAgaWYgKGlwRHJvcGRvd24gJiYgdHlwZW9mIGlwRHJvcGRvd24ucmVtb3ZlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICBpcERyb3Bkb3duLnJlbW92ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgaW5zdFBlZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImluc3RfcGVlcl9saW5rXCIpO1xuICAgICAgICAgICAgaWYgKGluc3RQZWVyICYmIHR5cGVvZiBpbnN0UGVlci5yZW1vdmUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgIGluc3RQZWVyLnJlbW92ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KFwicnVuZXN0b25lOmxvZ2luXCIpKTtcblxuICAgICAgICBhZGRSZWFkaW5nTGlzdCgpO1xuXG4gICAgICAgIC8vIFdhcm4gaWYgdGhlIGNvdXJzZSBoYXMgbm90IHN0YXJ0ZWQgeWV0XG4gICAgICAgIGlmICghaXNDb3Vyc2VTdGFydGVkKCkpIHtcbiAgICAgICAgICAgIGNvbnN0IHB0eENvbnRlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInB0eC1jb250ZW50XCIpO1xuICAgICAgICAgICAgaWYgKHB0eENvbnRlbnQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB3YXJuaW5nQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgICAgICB3YXJuaW5nQ29udGFpbmVyLmNsYXNzTmFtZSA9IFwicHR4LXJ1bmVzdG9uZS1jb250YWluZXJcIjtcbiAgICAgICAgICAgICAgICBjb25zdCB3YXJuaW5nRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgICAgICB3YXJuaW5nRGl2LmNsYXNzTmFtZSA9XG4gICAgICAgICAgICAgICAgICAgIFwiY291cnNlLW5vdC1zdGFydGVkLXdhcm5pbmcgYWxlcnQgYWxlcnQtZGFuZ2VyXCI7XG4gICAgICAgICAgICAgICAgd2FybmluZ0Rpdi50ZXh0Q29udGVudCA9IGNvdXJzZU5vdFN0YXJ0ZWRNZXNzYWdlKCk7XG4gICAgICAgICAgICAgICAgd2FybmluZ0NvbnRhaW5lci5hcHBlbmRDaGlsZCh3YXJuaW5nRGl2KTtcbiAgICAgICAgICAgICAgICBwdHhDb250ZW50Lmluc2VydEJlZm9yZShcbiAgICAgICAgICAgICAgICAgICAgd2FybmluZ0NvbnRhaW5lcixcbiAgICAgICAgICAgICAgICAgICAgcHR4Q29udGVudC5maXJzdENoaWxkLFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBPbmx5IHNob3cgdGhlIFN0dWR5Q2x1ZXMgd2lkZ2V0IG9uIGJvb2svYXNzaWdubWVudCBwYWdlcyBmb3IgY291cnNlcyB3aXRoIHRoZSBzdHVkeUNsdWVzIGF0dHJpYnV0ZSBzZXQuXG4gICAgICAgIGlmIChzaG91bGRTaG93U3R1ZHlDbHVlc1dpZGdldCgpKSB7XG4gICAgICAgICAgICBjcmVhdGVTdHVkeUNsdWVzV2lkZ2V0KCk7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICBtZXNzID0gXCJOb3QgbG9nZ2VkIGluXCI7XG4gICAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KFwicnVuZXN0b25lOmxvZ291dFwiKSk7XG4gICAgICAgIGxldCBidyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnJvd3Npbmdfd2FybmluZ1wiKTtcbiAgICAgICAgaWYgKGJ3KSB7XG4gICAgICAgICAgICBidy5pbm5lckhUTUwgPVxuICAgICAgICAgICAgICAgIFwiPHAgY2xhc3M9J25hdmJhcl9tZXNzYWdlJz5TYXZpbmcgYW5kIExvZ2dpbmcgYXJlIERpc2FibGVkPC9wPlwiO1xuICAgICAgICB9XG4gICAgICAgIGxldCBhdyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWRfd2FybmluZ1wiKTtcbiAgICAgICAgaWYgKGF3KSB7XG4gICAgICAgICAgICBhdy5pbm5lckhUTUwgPVxuICAgICAgICAgICAgICAgIFwiPHAgY2xhc3M9J25hdmJhcl9tZXNzYWdlJz7wn5qrIExvZy1pbiB0byBSZW1vdmUgPGEgaHJlZj0nL2FkbWluL2xlZ2FsL2Fkcyc+QWRzITwvYT4g8J+aqyAmbmJzcDs8L3A+XCI7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5sb2dnZWRpbnVzZXJcIikuZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgICAgZWwuaW5uZXJIVE1MID0gbWVzcztcbiAgICB9KTtcblxuICAgIHBhZ2VQcm9ncmVzc1RyYWNrZXIgPSBuZXcgUGFnZVByb2dyZXNzQmFyKGVCb29rQ29uZmlnLmFjdGl2aXRpZXMpO1xuICAgIG5vdGlmeVJ1bmVzdG9uZUNvbXBvbmVudHMoKTtcbn1cblxuZnVuY3Rpb24gc2V0dXBOYXZiYXJMb2dnZWRJbigpIHtcbiAgICBjb25zdCBwcm9maWxlTGluayA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHJvZmlsZWxpbmtcIik7XG4gICAgaWYgKHByb2ZpbGVMaW5rKSBwcm9maWxlTGluay5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcImRpc3BsYXlcIik7XG4gICAgY29uc3QgcGFzc3dvcmRMaW5rID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwYXNzd29yZGxpbmtcIik7XG4gICAgaWYgKHBhc3N3b3JkTGluaykgcGFzc3dvcmRMaW5rLnN0eWxlLnJlbW92ZVByb3BlcnR5KFwiZGlzcGxheVwiKTtcbiAgICBjb25zdCByZWdpc3RlckxpbmsgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlZ2lzdGVybGlua1wiKTtcbiAgICBpZiAocmVnaXN0ZXJMaW5rKSByZWdpc3Rlckxpbmsuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJsaS5sb2dpbm91dFwiKS5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgICBlbC5pbm5lckhUTUwgPSAnPGEgaHJlZj1cIi9hZG1pbi9hdXRoL2xvZ291dFwiPkxvZyBPdXQ8L2E+JztcbiAgICB9KTtcbn1cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJydW5lc3RvbmU6bG9naW5cIiwgc2V0dXBOYXZiYXJMb2dnZWRJbik7XG5cbmZ1bmN0aW9uIHNldHVwTmF2YmFyTG9nZ2VkT3V0KCkge1xuICAgIGlmIChlQm9va0NvbmZpZy51c2VSdW5lc3RvbmVTZXJ2aWNlcykge1xuICAgICAgICBjb25zb2xlLmxvZyhcInNldHVwIG5hdmJhciBmb3IgbG9nZ2VkIG91dFwiKTtcbiAgICAgICAgY29uc3QgcmVnaXN0ZXJMaW5rID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZWdpc3RlcmxpbmtcIik7XG4gICAgICAgIGlmIChyZWdpc3RlckxpbmspIHJlZ2lzdGVyTGluay5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcImRpc3BsYXlcIik7XG4gICAgICAgIGNvbnN0IHByb2ZpbGVMaW5rID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwcm9maWxlbGlua1wiKTtcbiAgICAgICAgaWYgKHByb2ZpbGVMaW5rKSBwcm9maWxlTGluay5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgIGNvbnN0IHBhc3N3b3JkTGluayA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGFzc3dvcmRsaW5rXCIpO1xuICAgICAgICBpZiAocGFzc3dvcmRMaW5rKSBwYXNzd29yZExpbmsuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICBjb25zdCBpcERyb3Bkb3duID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpcF9kcm9wZG93bl9saW5rXCIpO1xuICAgICAgICBpZiAoaXBEcm9wZG93bikgaXBEcm9wZG93bi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgIGNvbnN0IGluc3RQZWVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpbnN0X3BlZXJfbGlua1wiKTtcbiAgICAgICAgaWYgKGluc3RQZWVyKSBpbnN0UGVlci5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJsaS5sb2dpbm91dFwiKS5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgICAgICAgZWwuaW5uZXJIVE1MID1cbiAgICAgICAgICAgICAgICAnPGEgaHJlZj1cIicgK1xuICAgICAgICAgICAgICAgIGVCb29rQ29uZmlnLmFwcCArXG4gICAgICAgICAgICAgICAgJy9kZWZhdWx0L3VzZXIvbG9naW5cIj5Mb2dpbjwvYT4nO1xuICAgICAgICB9KTtcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5mb290ZXJcIikuZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgICAgICAgIGVsLmlubmVySFRNTCA9IFwidXNlciBub3QgbG9nZ2VkIGluXCI7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJydW5lc3RvbmU6bG9nb3V0XCIsIHNldHVwTmF2YmFyTG9nZ2VkT3V0KTtcblxuZnVuY3Rpb24gbm90aWZ5UnVuZXN0b25lQ29tcG9uZW50cygpIHtcbiAgICAvLyBSdW5lc3RvbmUgY29tcG9uZW50cyB3YWl0IHVudGlsIGxvZ2luIHByb2Nlc3MgaXMgb3ZlciB0byBsb2FkIGNvbXBvbmVudHMgYmVjYXVzZSBvZiBzdG9yYWdlIGlzc3Vlcy4gVGhpcyB0cmlnZ2VycyB0aGUgYGR5bmFtaWMgaW1wb3J0IG1hY2hpbmVyeWAsIHdoaWNoIHRoZW4gc2VuZHMgdGhlIGxvZ2luIGNvbXBsZXRlIHNpZ25hbCB3aGVuIHRoaXMgYW5kIGFsbCBkeW5hbWljIGltcG9ydHMgYXJlIGZpbmlzaGVkLlxuICAgIGNvbnNvbGUubG9nKFwidHJpZ2dlcmluZyBydW5lc3RvbmU6cHJlLWxvZ2luLWNvbXBsZXRlXCIpO1xuICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KFwicnVuZXN0b25lOnByZS1sb2dpbi1jb21wbGV0ZVwiKSk7XG59XG5cbi8vIFRoZSBvcmlnaW5hbCB0d28gYXBwZWFscywgc3RpbGwgdXNlZCBmb3IgdGhlIGlubGluZSBhZCAocGFnZXMgd2l0aCBubyBQcmVUZVh0XG4vLyBtYXN0aGVhZCBvciBuYXZiYXIpLiBTcGhpbnggYm9va3MgY2FycnkgdGhlIHNhbWUgY29weSBpbiB0aGVpciBvd24gbGF5b3V0XG4vLyB0ZW1wbGF0ZSBhcyBgYGFkPTFgYCBhbmQgYGBhZD0yYGAuXG5jb25zdCBMRUdBQ1lfQURfQ09QWSA9IFtcbiAgICBcIlJ1bmVzdG9uZSBBY2FkZW15IGNhbiBvbmx5IGNvbnRpbnVlIGlmIHdlIGdldCBzdXBwb3J0IGZyb20gaW5kaXZpZHVhbHMgbGlrZSB5b3UuIEFzIGEgc3R1ZGVudCB5b3UgYXJlIHdlbGwgYXdhcmUgb2YgdGhlIGhpZ2ggY29zdCBvZiB0ZXh0Ym9va3MuICBPdXIgbWlzc2lvbiBpcyB0byBwcm92aWRlIGdyZWF0IGJvb2tzIHRvIHlvdSBmb3IgZnJlZSwgYnV0IHdlIGFzayB0aGF0IHlvdSBjb25zaWRlciBhICQxMCBkb25hdGlvbiwgbW9yZSBpZiB5b3UgY2FuIG9yIGxlc3MgaWYgJDEwIGlzIGEgYnVyZGVuLlwiLFxuICAgIFwiTWFraW5nIGdyZWF0IHN0dWZmIHRha2VzIHRpbWUgYW5kICQkLiAgSWYgeW91IGFwcHJlY2lhdGUgdGhlIGJvb2sgeW91IGFyZSByZWFkaW5nIG5vdyBhbmQgd2FudCB0byBrZWVwIHF1YWxpdHkgbWF0ZXJpYWxzIGZyZWUgZm9yIG90aGVyIHN0dWRlbnRzIHBsZWFzZSBjb25zaWRlciBhIGRvbmF0aW9uIHRvIFJ1bmVzdG9uZSBBY2FkZW15LiBXZSBhc2sgdGhhdCB5b3UgY29uc2lkZXIgYSAkMTAgZG9uYXRpb24sIGJ1dCBpZiB5b3UgY2FuIGdpdmUgbW9yZSB0aGF0cyBncmVhdCwgaWYgJDEwIGlzIHRvbyBtdWNoIGZvciB5b3VyIGJ1ZGdldCB3ZSB3b3VsZCBiZSBoYXBweSB3aXRoIHdoYXRldmVyIHlvdSBjYW4gYWZmb3JkIGFzIGEgc2hvdyBvZiBzdXBwb3J0LlwiLFxuXTtcblxuLy8gVGhlIFByZVRlWHQgYmFubmVyIHJvdGF0ZXMgYmV0d2VlbiB0aGVzZSBhdCByYW5kb20uIEVhY2ggaGFzIGl0cyBvd24gYGBhZGBgXG4vLyBudW1iZXIsIHN0YXJ0aW5nIGFmdGVyIHRoZSBsZWdhY3kgb25lcywgc28gZG9uYXRlLXBhZ2UgdmlzaXRzIGluIHRoZSBhY2Nlc3Ncbi8vIGxvZ3MgY2FuIGJlIGNyZWRpdGVkIHRvIHRoZSBjb3B5IHRoYXQgc2VudCB0aGVtLiBUaGUgdGVybS1zdHVkZW50cyBhcHBlYWxcbi8vIG5lZWRzIGEgbGl2ZSBjb3VudCBmcm9tIHRoZSBib29rIHNlcnZlcjsgYGBoZWFkbGluZWBgIGlzIGEgZnVuY3Rpb24gb2YgaXQuXG5leHBvcnQgY29uc3QgQkFOTkVSX0NPUFkgPSBbXG4gICAge1xuICAgICAgICBhZDogMyxcbiAgICAgICAgaGVhZGxpbmU6IFwiVGhpcyBib29rIGlzIGZyZWUsIGFuZCB3ZSB3YW50IHRvIGtlZXAgaXQgdGhhdCB3YXkuXCIsXG4gICAgICAgIGJvZHk6IFwiUnVuZXN0b25lIEFjYWRlbXkgaXMgYSA1MDEoYykoMykgbm9ucHJvZml0IHN1cHBvcnRlZCBieSByZWFkZXJzIGxpa2UgeW91LiBJZiB0aGlzIGJvb2sgaXMgaGVscGluZyB5b3UsIGEgJDEwIGdpZnQga2VlcHMgaXQgZnJlZSBmb3IgdGhlIG5leHQgc3R1ZGVudC5cIixcbiAgICAgICAgYnV0dG9uOiBcIkRvbmF0ZSAkMTBcIixcbiAgICB9LFxuICAgIHtcbiAgICAgICAgYWQ6IDQsXG4gICAgICAgIG5lZWRzVGVybVN0dWRlbnRzOiB0cnVlLFxuICAgICAgICBoZWFkbGluZTogKHsgY291bnQsIHNpbmNlIH0pID0+XG4gICAgICAgICAgICBgJHtkZXNjcmliZVN0dWRlbnRDb3VudChjb3VudCl9IHN0dWRlbnRzIGhhdmUgc3RhcnRlZCB1c2luZyBSdW5lc3RvbmUgYm9va3Mgc2luY2UgJHtzaW5jZX0uYCxcbiAgICAgICAgYm9keTogXCJXZSBkb24ndCBjaGFyZ2UgZm9yIHRoZW0sIGFuZCB3ZSBuZXZlciB3aWxsLiBJZiBSdW5lc3RvbmUgaXMgaGVscGluZyB5b3UsIGEgdGF4LWRlZHVjdGlibGUgZ2lmdCBoZWxwcyBrZWVwIGl0IHRoYXQgd2F5LlwiLFxuICAgICAgICBidXR0b246IFwiQ2hpcCBpblwiLFxuICAgIH0sXG4gICAge1xuICAgICAgICBhZDogNSxcbiAgICAgICAgaGVhZGxpbmU6IFwiRnJlZSB0ZXh0Ym9va3MgYXJlbid0IGZyZWUgdG8gbWFrZS5cIixcbiAgICAgICAgYm9keTogXCJJZiB0aGlzIGJvb2sgaXMgaGVscGluZyB5b3UsIHBsZWFzZSBjb25zaWRlciBhIHRheC1kZWR1Y3RpYmxlICQxMCBnaWZ0IHRvIFJ1bmVzdG9uZSBBY2FkZW15LiBBbnkgYW1vdW50IGhlbHBzLlwiLFxuICAgICAgICBidXR0b246IFwiRG9uYXRlXCIsXG4gICAgfSxcbl07XG5cbi8vIEVhcmx5IGluIGEgdGVybSAoYW5kIG9uIGEgZGV2IHNlcnZlcikgdGhlIGNvdW50IGlzIHRvbyBzbWFsbCB0byBpbXByZXNzLCBzb1xuLy8gdGhlIGJhbm5lciB1c2VzIG9uZSBvZiB0aGUgb3RoZXIgYXBwZWFscyBpbnN0ZWFkLlxuZXhwb3J0IGNvbnN0IE1JTl9URVJNX1NUVURFTlRTID0gMTAwMDtcblxuLyoqXG4gKiBSb3VuZCBkb3duIHRvIHR3byBzaWduaWZpY2FudCBmaWd1cmVzIHNvIHRoZSBiYW5uZXIgcmVhZHMgXCJNb3JlIHRoYW5cbiAqIDQ4LDAwMFwiIHJhdGhlciB0aGFuIGEgc3VzcGljaW91c2x5IHByZWNpc2UgNDgsMjEzLCBhbmQgbmV2ZXIgb3ZlcnN0YXRlcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlc2NyaWJlU3R1ZGVudENvdW50KGNvdW50KSB7XG4gICAgY29uc3QgbWFnbml0dWRlID0gMTAgKiogTWF0aC5tYXgoMCwgTWF0aC5mbG9vcihNYXRoLmxvZzEwKGNvdW50KSkgLSAxKTtcbiAgICBjb25zdCByb3VuZGVkID0gTWF0aC5mbG9vcihjb3VudCAvIG1hZ25pdHVkZSkgKiBtYWduaXR1ZGU7XG4gICAgY29uc3Qgc2hvd24gPSByb3VuZGVkLnRvTG9jYWxlU3RyaW5nKFwiZW4tVVNcIik7XG4gICAgcmV0dXJuIHJvdW5kZWQgPCBjb3VudCA/IGBNb3JlIHRoYW4gJHtzaG93bn1gIDogc2hvd247XG59XG5cbi8qKlxuICogRmV0Y2ggdGhlIG51bWJlciBvZiBzdHVkZW50cyB3aG8gam9pbmVkIHNpbmNlIHRoZSB0ZXJtIGJlZ2FuLCBmb3JtYXR0ZWQgZm9yXG4gKiB0aGUgaGVhZGxpbmUsIG9yIG51bGwgd2hlbiBpdCBpcyB1bmF2YWlsYWJsZSBvciB0b28gc21hbGwgdG8gdXNlLlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmV0Y2hUZXJtU3R1ZGVudHMoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChcbiAgICAgICAgICAgIGAke2VCb29rQ29uZmlnLm5ld19zZXJ2ZXJfcHJlZml4fS9ib29rcy90ZXJtX3N0dWRlbnRzYCxcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgeyBjb3VudCwgc2luY2UgfSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgaWYgKCEoY291bnQgPj0gTUlOX1RFUk1fU1RVREVOVFMpIHx8ICFzaW5jZSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgLy8gYGBzaW5jZWBgIGlzIGEgYmFyZSBkYXRlOyBmb3JtYXQgaXQgaW4gVVRDIHNvIGEgcmVhZGVyIHdlc3Qgb2ZcbiAgICAgICAgLy8gR3JlZW53aWNoIGRvZXMgbm90IHNlZSBcIkp1bHkgMzFcIiBmb3IgQXVndXN0IDEuXG4gICAgICAgIGNvbnN0IHNpbmNlVGV4dCA9IG5ldyBEYXRlKGAke3NpbmNlfVQwMDowMDowMFpgKS50b0xvY2FsZURhdGVTdHJpbmcoXG4gICAgICAgICAgICBcImVuLVVTXCIsXG4gICAgICAgICAgICB7IG1vbnRoOiBcImxvbmdcIiwgZGF5OiBcIm51bWVyaWNcIiwgdGltZVpvbmU6IFwiVVRDXCIgfSxcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIHsgY291bnQsIHNpbmNlOiBzaW5jZVRleHQgfTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJGYWlsZWQgdG8gZmV0Y2ggdGVybSBzdHVkZW50czpcIiwgZSk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbn1cblxuLyoqXG4gKiBSZXNvbHZlIGBgQkFOTkVSX0NPUFlbaW5kZXhdYGAgdG8gcGxhaW4gc3RyaW5ncy4gSWYgdGhlIHRlcm0tc3R1ZGVudHMgYXBwZWFsXG4gKiBjYW5ub3QgZ2V0IGl0cyBjb3VudCwgZmFsbCBiYWNrIHRvIHRoZSBuZXh0IGFwcGVhbCB0aGF0IG5lZWRzIG5vdGhpbmcuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZXNvbHZlQmFubmVyQ29weShpbmRleCkge1xuICAgIGNvbnN0IGNvcHkgPSBCQU5ORVJfQ09QWVtpbmRleF07XG4gICAgaWYgKCFjb3B5Lm5lZWRzVGVybVN0dWRlbnRzKSB7XG4gICAgICAgIHJldHVybiBjb3B5O1xuICAgIH1cbiAgICBjb25zdCBzdGF0cyA9IGF3YWl0IGZldGNoVGVybVN0dWRlbnRzKCk7XG4gICAgaWYgKHN0YXRzKSB7XG4gICAgICAgIHJldHVybiB7IC4uLmNvcHksIGhlYWRsaW5lOiBjb3B5LmhlYWRsaW5lKHN0YXRzKSB9O1xuICAgIH1cbiAgICByZXR1cm4gQkFOTkVSX0NPUFlbKGluZGV4ICsgMSkgJSBCQU5ORVJfQ09QWS5sZW5ndGhdO1xufVxuXG4vLyBXaGVuIGEgcmVhZGVyIGNsb3NlcyB0aGUgUHJlVGVYdCB0b3Atb2YtcGFnZSBiYW5uZXIgd2UgbGVhdmUgdGhlbSBhbG9uZSBmb3Jcbi8vIHR3byBkYXlzLCBvbiBldmVyeSBib29rLCBieSByZW1lbWJlcmluZyB3aGVuIHRoZXkgZGlkIGl0LlxuZXhwb3J0IGNvbnN0IEFEX0RJU01JU1NFRF9LRVkgPSBcInJzX2FkX2Rpc21pc3NlZF9hdFwiO1xuZXhwb3J0IGNvbnN0IEFEX0RJU01JU1NfTVMgPSA0OCAqIDYwICogNjAgKiAxMDAwO1xuXG5leHBvcnQgZnVuY3Rpb24gYWRSZWNlbnRseURpc21pc3NlZChub3cgPSBEYXRlLm5vdygpKSB7XG4gICAgbGV0IGRpc21pc3NlZEF0O1xuICAgIHRyeSB7XG4gICAgICAgIGRpc21pc3NlZEF0ID0gTnVtYmVyKGxvY2FsU3RvcmFnZS5nZXRJdGVtKEFEX0RJU01JU1NFRF9LRVkpKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgLy8gQSB0aW1lc3RhbXAgZnJvbSB0aGUgZnV0dXJlICh0aGUgY2xvY2sgd2FzIG1vdmVkIGJhY2spIG11c3Qgbm90XG4gICAgLy8gc2lsZW5jZSB0aGUgYmFubmVyIGZvciBob3dldmVyIGxvbmcgdGhhdCBnYXAgaXMuXG4gICAgcmV0dXJuIChcbiAgICAgICAgZGlzbWlzc2VkQXQgPiAwICYmXG4gICAgICAgIGRpc21pc3NlZEF0IDw9IG5vdyAmJlxuICAgICAgICBub3cgLSBkaXNtaXNzZWRBdCA8IEFEX0RJU01JU1NfTVNcbiAgICApO1xufVxuXG4vLyBFdmVuIHVuZGlzbWlzc2VkLCB0aGUgYmFubmVyIGFwcGVhcnMgb25seSBvbiB0aGUgZmlyc3QgcGFnZSBvZiBhIHZpc2l0LCBub3Rcbi8vIG9uIGV2ZXJ5IHBhZ2UgYSBzdHVkZW50IGxvYWRzIHdoaWxlIHdvcmtpbmcgdGhyb3VnaCBhIGNoYXB0ZXIuIEEgdmlzaXQgZW5kc1xuLy8gYWZ0ZXIgMzAgbWludXRlcyB3aXRob3V0IGEgcGFnZSB2aWV3ICh0aGUgdXN1YWwgYW5hbHl0aWNzIGRlZmluaXRpb24pOyB0aGVcbi8vIGNsb2NrIGxpdmVzIGluIGxvY2FsU3RvcmFnZSByYXRoZXIgdGhhbiBzZXNzaW9uU3RvcmFnZSBzbyB0aGF0IG9wZW5pbmcgYVxuLy8gY2hhcHRlciBpbiBhIG5ldyB0YWIgZG9lcyBub3QgY291bnQgYXMgYSBuZXcgdmlzaXQuXG5leHBvcnQgY29uc3QgQURfTEFTVF9QQUdFVklFV19LRVkgPSBcInJzX2FkX2xhc3RfcGFnZXZpZXdcIjtcbmV4cG9ydCBjb25zdCBBRF9WSVNJVF9HQVBfTVMgPSAzMCAqIDYwICogMTAwMDtcblxuLyoqXG4gKiBSZWNvcmQgdGhpcyBwYWdlIHZpZXcgYW5kIHJlcG9ydCB3aGV0aGVyIGl0IGNvbnRpbnVlcyBhIHZpc2l0IGFscmVhZHkgdW5kZXJcbiAqIHdheS4gRXZlcnkgcGFnZSB2aWV3IGV4dGVuZHMgdGhlIHZpc2l0LCBpbmNsdWRpbmcgb25lcyB3aGVyZSB0aGUgYmFubmVyIHdhc1xuICogaGVsZCBiYWNrIGZvciBhIGRpc21pc3NhbCwgc28gYSBkaXNtaXNzYWwgdGhhdCBleHBpcmVzIG1pZC12aXNpdCB3YWl0cyBmb3JcbiAqIHRoZSBuZXh0IHZpc2l0IGluc3RlYWQgb2YgcG9wcGluZyB1cCBiZXR3ZWVuIHBhZ2VzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYWRWaXNpdEluUHJvZ3Jlc3Mobm93ID0gRGF0ZS5ub3coKSkge1xuICAgIGxldCBsYXN0UGFnZXZpZXc7XG4gICAgdHJ5IHtcbiAgICAgICAgbGFzdFBhZ2V2aWV3ID0gTnVtYmVyKGxvY2FsU3RvcmFnZS5nZXRJdGVtKEFEX0xBU1RfUEFHRVZJRVdfS0VZKSk7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKEFEX0xBU1RfUEFHRVZJRVdfS0VZLCBTdHJpbmcobm93KSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiAoXG4gICAgICAgIGxhc3RQYWdldmlldyA+IDAgJiZcbiAgICAgICAgbGFzdFBhZ2V2aWV3IDw9IG5vdyAmJlxuICAgICAgICBub3cgLSBsYXN0UGFnZXZpZXcgPCBBRF9WSVNJVF9HQVBfTVNcbiAgICApO1xufVxuXG5mdW5jdGlvbiBkaXNtaXNzQWQoYmFubmVyKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oQURfRElTTUlTU0VEX0tFWSwgU3RyaW5nKERhdGUubm93KCkpKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIFN0b3JhZ2UgYmxvY2tlZDogdGhlIGJhbm5lciBzdGlsbCBjbG9zZXMsIGl0IGp1c3QgY29tZXMgYmFjayBvblxuICAgICAgICAvLyB0aGUgbmV4dCBwYWdlLlxuICAgIH1cbiAgICBiYW5uZXIucmVtb3ZlKCk7XG59XG5cbmZ1bmN0aW9uIHNob3VsZFNob3dBZCgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgICAodHlwZW9mIHNob3dBZCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBzaG93QWQpIHx8XG4gICAgICAgIGVCb29rQ29uZmlnLmNvdXJzZV9hdHRycz8uc2hvd0FkXG4gICAgKTtcbn1cblxuLyoqXG4gKiBQcmVUZVh0IGJvb2tzIGdldCBhIGRpc21pc3NpYmxlIGJhbm5lciBhY3Jvc3MgdGhlIHRvcCBvZiB0aGUgcGFnZSwgYWJvdmUgdGhlXG4gKiBtYXN0aGVhZCBhbmQgbmF2YmFyLCBpbnN0ZWFkIG9mIGFuIGFkIGRyb3BwZWQgaW50byB0aGUgbWlkZGxlIG9mIHRoZVxuICogcmVhZGluZy4gQXV0aG9ycyBvYmplY3RlZCB0byB0aGUgaW50ZXJydXB0aW9uLlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcGxhY2VBZEJhbm5lcihcbiAgICB0b3BPZlBhZ2UsXG4gICAgaW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBCQU5ORVJfQ09QWS5sZW5ndGgpLFxuKSB7XG4gICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicnMtYWQtYmFubmVyXCIpKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICAvLyBBbHdheXMgcmVjb3JkIHRoZSBwYWdlIHZpZXcsIGV2ZW4gd2hlbiBhIGRpc21pc3NhbCBpcyBob2xkaW5nIHRoZVxuICAgIC8vIGJhbm5lciBiYWNrLCBzbyB0aGUgdmlzaXQgY2xvY2sgc3RheXMgY3VycmVudC5cbiAgICBjb25zdCBjb250aW51aW5nVmlzaXQgPSBhZFZpc2l0SW5Qcm9ncmVzcygpO1xuICAgIGlmIChjb250aW51aW5nVmlzaXQgfHwgYWRSZWNlbnRseURpc21pc3NlZCgpKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBjb3B5ID0gYXdhaXQgcmVzb2x2ZUJhbm5lckNvcHkoaW5kZXgpO1xuICAgIC8vIEFub3RoZXIgY2FsbCBtYXkgaGF2ZSBwbGFjZWQgYSBiYW5uZXIgd2hpbGUgd2Ugd2FpdGVkIG9uIHRoZSBjb3VudC5cbiAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJycy1hZC1iYW5uZXJcIikpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNvbnN0IGJhbm5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhc2lkZVwiKTtcbiAgICBiYW5uZXIuaWQgPSBcInJzLWFkLWJhbm5lclwiO1xuICAgIGJhbm5lci5jbGFzc05hbWUgPSBcImFkYmFubmVyXCI7XG4gICAgYmFubmVyLnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIiwgXCJTdXBwb3J0IFJ1bmVzdG9uZSBBY2FkZW15XCIpO1xuICAgIGJhbm5lci5pbm5lckhUTUwgPSBgXG4gICAgICAgIDxkaXYgY2xhc3M9XCJhZGJhbm5lci10ZXh0XCI+XG4gICAgICAgICAgICA8c3Ryb25nPiR7Y29weS5oZWFkbGluZX08L3N0cm9uZz5cbiAgICAgICAgICAgIDxwPiR7Y29weS5ib2R5fTwvcD5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJhZGJhbm5lci1kb25hdGVcIj5cbiAgICAgICAgICAgIDxhIGhyZWY9XCIvYWRtaW4vYXV0aC9kb25hdGU/YWQ9JHtjb3B5LmFkfVwiPiR7Y29weS5idXR0b259PC9hPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJhZGJhbm5lci1jbG9zZVwiXG4gICAgICAgICAgICBhcmlhLWxhYmVsPVwiRGlzbWlzcyBmb3IgNDggaG91cnNcIiB0aXRsZT1cIkRpc21pc3MgZm9yIDQ4IGhvdXJzXCI+JnRpbWVzOzwvYnV0dG9uPmA7XG4gICAgYmFubmVyXG4gICAgICAgIC5xdWVyeVNlbGVjdG9yKFwiLmFkYmFubmVyLWNsb3NlXCIpXG4gICAgICAgIC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gZGlzbWlzc0FkKGJhbm5lcikpO1xuICAgIHRvcE9mUGFnZS5iZWZvcmUoYmFubmVyKTtcbiAgICByZXR1cm4gYmFubmVyO1xufVxuXG4vLyBTcGhpbnggYm9va3MgKGFuZCBhbnkgcGFnZSB3aXRob3V0IGEgUHJlVGVYdCBtYXN0aGVhZCBvciBuYXZiYXIpIGtlZXAgdGhlXG4vLyBvbGQgYmVoYXZpb3I6IHRoZSBhcHBlYWwgYXBwZWFycyBhZnRlciBhIHJhbmRvbWx5IGNob3NlbiBjb21wb25lbnQuXG5mdW5jdGlvbiBwbGFjZUlubGluZUFkKCkge1xuICAgIGxldCBhZE51bSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIExFR0FDWV9BRF9DT1BZLmxlbmd0aCkgKyAxO1xuICAgIGxldCBhZFRlbXBsYXRlID0gTEVHQUNZX0FEX0NPUFkubWFwKFxuICAgICAgICAodGV4dCwgaSkgPT4gYFxuICAgICAgICAgPGFzaWRlIGlkPVwiYWRjb3B5XyR7aSArIDF9XCIgY2xhc3M9XCJhZGNvcHlcIiBzdHlsZT1cImRpc3BsYXk6IG5vbmU7XCI+XG4gICAgICAgICAgIDxzdHJvbmc+QmVmb3JlIHlvdSBrZWVwIHJlYWRpbmcuLi48L3N0cm9uZz5cbiAgICAgICAgICAgPHA+JHt0ZXh0fVxuICAgICAgICAgICA8L3A+XG4gICAgICAgICAgIDxkaXYgY2xhc3M9XCJkb25hdGUke1wiYWJcIltpXX1cIj5cbiAgICAgICAgICAgPGEgaHJlZj1cIi9hZG1pbi9hdXRoL2RvbmF0ZT9hZD0ke2kgKyAxfVwiPlN1cHBvcnQgUnVuZXN0b25lIEFjYWRlbXkgVG9kYXk8L2E+XG4gICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgPC9hc2lkZT5gLFxuICAgICkuam9pbihcIlwiKTtcbiAgICBpZiAoIWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWRjb3B5XzFcIikpIHtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5pbnNlcnRBZGphY2VudEhUTUwoXCJiZWZvcmVlbmRcIiwgYWRUZW1wbGF0ZSk7XG4gICAgfVxuICAgIGxldCBhZEJsb2NrID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYGFkY29weV8ke2FkTnVtfWApO1xuICAgIGxldCByc0VsZW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ydW5lc3RvbmVcIik7XG4gICAgaWYgKHJzRWxlbWVudHMubGVuZ3RoID4gMCkge1xuICAgICAgICBsZXQgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiByc0VsZW1lbnRzLmxlbmd0aCk7XG4gICAgICAgIHJzRWxlbWVudHNbcmFuZG9tSW5kZXhdLmFmdGVyKGFkQmxvY2spO1xuICAgICAgICAvLyBmaW5kIHRoZSBhIHRhZyB3aXRoaW4gdGhlIGFkIGJsb2NrIGFuZCBjaGFuZ2UgdGhlIGhyZWYgZnJvbSAvcnVuZXN0b25lL2RlZmF1bHQvZG9uYXRlIHRvIC9hZG1pbi9hdXRoL2RvbmF0ZVxuICAgICAgICBjb25zdCBhVGFnID0gYWRCbG9jay5xdWVyeVNlbGVjdG9yKFwiYVwiKTtcbiAgICAgICAgaWYgKGFUYWcgJiYgYVRhZy5ocmVmLmluY2x1ZGVzKFwiL3J1bmVzdG9uZS9kZWZhdWx0L2RvbmF0ZVwiKSkge1xuICAgICAgICAgICAgYVRhZy5ocmVmID0gYVRhZy5ocmVmLnJlcGxhY2UoXG4gICAgICAgICAgICAgICAgXCIvcnVuZXN0b25lL2RlZmF1bHQvZG9uYXRlXCIsXG4gICAgICAgICAgICAgICAgXCIvYWRtaW4vYXV0aC9kb25hdGVcIixcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgYWRCbG9jay5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gcGxhY2VBZENvcHkoKSB7XG4gICAgaWYgKCFzaG91bGRTaG93QWQoKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGxldCB0b3BPZlBhZ2UgPVxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInB0eC1tYXN0aGVhZFwiKSB8fFxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInB0eC1uYXZiYXJcIik7XG4gICAgaWYgKHRvcE9mUGFnZSkge1xuICAgICAgICBwbGFjZUFkQmFubmVyKHRvcE9mUGFnZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcGxhY2VJbmxpbmVBZCgpO1xuICAgIH1cbn1cblxuLy8gaW5pdGlhbGl6ZSBzdHVmZlxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgZnVuY3Rpb24gKCkge1xuICAgIGlmIChlQm9va0NvbmZpZykge1xuICAgICAgICBoYW5kbGVQYWdlU2V0dXAoKTtcbiAgICAgICAgcGxhY2VBZENvcHkoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodHlwZW9mIGVCb29rQ29uZmlnID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAgICAgICBcImVCb29rQ29uZmlnIGlzIG5vdCBkZWZpbmVkLiAgVGhpcyBwYWdlIG11c3Qgbm90IGJlIHNldCB1cCBmb3IgUnVuZXN0b25lXCIsXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxufSk7XG5cbi8vIG1pc2Mgc3R1ZmZcbi8vIHRvZG86ICBUaGlzIGNvdWxkIGJlIGZ1cnRoZXIgZGlzdHJpYnV0ZWQgYnV0IG1ha2luZyBhIHZpZGVvLmpzIGZpbGUganVzdCBmb3Igb25lIGZ1bmN0aW9uIHNlZW1zIGR1bWIuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgZnVuY3Rpb24gKCkge1xuICAgIC8vIGFkZCB0aGUgdmlkZW8gcGxheSBidXR0b24gb3ZlcmxheSBpbWFnZVxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIudmlkZW8tcGxheS1vdmVybGF5XCIpLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIGVsLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9XG4gICAgICAgICAgICBcInVybCgne3twYXRodG8oJ19zdGF0aWMvcGxheV9vdmVybGF5X2ljb24ucG5nJywgMSl9fScpXCI7XG4gICAgfSk7XG5cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIGlzIG5lZWRlZCB0byBhbGxvdyB0aGUgZHJvcGRvd24gc2VhcmNoIGJhciB0byB3b3JrO1xuICAgIC8vIFRoZSBkZWZhdWx0IGJlaGF2aW91ciBpcyB0aGF0IHRoZSBkcm9wZG93biBtZW51IGNsb3NlcyB3aGVuIHNvbWV0aGluZyBpblxuICAgIC8vIGl0IChsaWtlIHRoZSBzZWFyY2ggYmFyKSBpcyBjbGlja2VkXG4gICAgZG9jdW1lbnRcbiAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZHJvcGRvd24gaW5wdXQsIC5kcm9wZG93biBsYWJlbFwiKVxuICAgICAgICAuZm9yRWFjaChmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAvLyByZS13cml0ZSBzb21lIHVybHNcbiAgICAvLyBUaGlzIGlzIHRyaWNrZXIgdGhhbiBpdCBsb29rcyBhbmQgeW91IGhhdmUgdG8gb2JleSB0aGUgcnVsZXMgZm9yICMgYW5jaG9yc1xuICAgIC8vIFRoZSAjYW5jaG9ycyBtdXN0IGNvbWUgYWZ0ZXIgdGhlIHF1ZXJ5IHN0cmluZyBhcyB0aGUgc2VydmVyIGJhc2ljYWxseSBpZ25vcmVzIGFueSBwYXJ0XG4gICAgLy8gb2YgYSB1cmwgdGhhdCBjb21lcyBhZnRlciAjIC0gbGlrZSBhIGNvbW1lbnQuLi5cbiAgICBpZiAobG9jYXRpb24uaHJlZi5pbmNsdWRlcyhcIm1vZGU9YnJvd3NpbmdcIikpIHtcbiAgICAgICAgbGV0IHF1ZXJ5U3RyaW5nID0gXCI/bW9kZT1icm93c2luZ1wiO1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiYVwiKS5mb3JFYWNoKChsaW5rKSA9PiB7XG4gICAgICAgICAgICBsZXQgYW5jaG9yVGV4dCA9IFwiXCI7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgbGluay5ocmVmLmluY2x1ZGVzKFwiYm9va3MvcHVibGlzaGVkXCIpICYmXG4gICAgICAgICAgICAgICAgIWxpbmsuaHJlZi5pbmNsdWRlcyhcIj9tb2RlPWJyb3dzaW5nXCIpXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBpZiAobGluay5ocmVmLmluY2x1ZGVzKFwiI1wiKSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgYVBvaW50ID0gbGluay5ocmVmLmluZGV4T2YoXCIjXCIpO1xuICAgICAgICAgICAgICAgICAgICBhbmNob3JUZXh0ID0gbGluay5ocmVmLnN1YnN0cmluZyhhUG9pbnQpO1xuICAgICAgICAgICAgICAgICAgICBsaW5rLmhyZWYgPSBsaW5rLmhyZWYuc3Vic3RyaW5nKDAsIGFQb2ludCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxpbmsuaHJlZiA9IGxpbmsuaHJlZi5pbmNsdWRlcyhcIj9cIilcbiAgICAgICAgICAgICAgICAgICAgPyBsaW5rLmhyZWYgKyBxdWVyeVN0cmluZy5yZXBsYWNlKFwiP1wiLCBcIiZcIikgKyBhbmNob3JUZXh0XG4gICAgICAgICAgICAgICAgICAgIDogbGluay5ocmVmICsgcXVlcnlTdHJpbmcgKyBhbmNob3JUZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59KTtcblxuLy8gVGhlIEJ1c3QgTWVudVxuLypcbkNvdXJzZSBIb21lXG5Bc3NpZ25tZW50c1xuUHJvZ3Jlc3NcblBlZXIgSW5zdHJ1Y3Rpb24gKFN0dWRlbnQpXG4tLS0tLS1cbkluc3RydWN0b3IgRGFzaGJvYXJkXG5QZWVyIEluc3RydWN0aW9uIChJbnN0cnVjdG9yKVxuQXV0aG9yIEludGVyZmFjZSAob3B0aW9uYWwpXG5FZGl0b3IgSW50ZXJmYWNlIChvcHRpb25hbClcblJlcXVlc3QgSW52b2ljZVxuLS0tLS0tXG5DaGFuZ2UgQ291cnNlXG5Qcm9maWxlXG5Mb2cgT3V0XG4qL1xud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIGNvbnN0IG9sZERyb3BEb3duID0gdGhpcy5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICBcIi5kcm9wZG93bi1jb250ZW50W2RhdGEtZGVwcmVjYXRlZF1cIixcbiAgICApO1xuICAgIGlmIChvbGREcm9wRG93bikgb2xkRHJvcERvd24ucmVtb3ZlKCk7XG5cbiAgICBjb25zdCBpdGVtVGVtcGxhdGUgPSB0aGlzLmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuICAgICAgICBcInB0eC11c2VyLWRyb3Bkb3duLWNvbnRlbnRfaXRlbS10ZW1wbGF0ZVwiLFxuICAgICk7XG4gICAgY29uc3Qgc2VwVGVtcGxhdGUgPSB0aGlzLmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuICAgICAgICBcInB0eC11c2VyLWRyb3Bkb3duLWNvbnRlbnRfc2VwYXJhdG9yLXRlbXBsYXRlXCIsXG4gICAgKTtcbiAgICBjb25zdCBtZW51Q29udGVudEFyZWEgPSB0aGlzLmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuICAgICAgICBcInB0eC11c2VyLWRyb3Bkb3duX3JzLWNvbnRlbnRcIixcbiAgICApO1xuXG4gICAgaWYgKCFpdGVtVGVtcGxhdGUgfHwgIXNlcFRlbXBsYXRlIHx8ICFtZW51Q29udGVudEFyZWEpIHtcbiAgICAgICAgY29uc29sZS53YXJuKFwiTWlzc2luZyB0ZW1wbGF0ZSBvciBjb250ZW50IGFyZWEgZm9yIHVzZXIgZHJvcGRvd25cIik7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYWtlTGluayh1cmwsIHRpdGxlLCBpY29uID0gbnVsbCwgYXJpYUxhYmVsID0gbnVsbCkge1xuICAgICAgICAvLyBBbGwgd2Ugc2hvdWxkIGFzc3VtZSBhYm91dCB0aGUgaXRlbSB0ZW1wbGF0ZSBpcyB0aGF0IGl0IGhhcyBhbiBhbmNob3IgZWxlbWVudFxuICAgICAgICBjb25zdCBsaW5rID0gaXRlbVRlbXBsYXRlLmNvbnRlbnQuY2xvbmVOb2RlKHRydWUpO1xuICAgICAgICBjb25zdCBsaW5rQW5jaG9yID0gbGluay5xdWVyeVNlbGVjdG9yKFwiYVwiKTtcbiAgICAgICAgaWYgKHVybCkge1xuICAgICAgICAgICAgbGlua0FuY2hvci5ocmVmID0gdXJsO1xuICAgICAgICB9XG4gICAgICAgIGxpbmtBbmNob3IuaW5uZXJUZXh0ID0gXCJcIjtcbiAgICAgICAgY29uc3QgY29udGVudFNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICAgICAgY29udGVudFNwYW4uc3R5bGUuZGlzcGxheSA9IFwiaW5saW5lLWZsZXhcIjtcbiAgICAgICAgY29udGVudFNwYW4uc3R5bGUuYWxpZ25JdGVtcyA9IFwiY2VudGVyXCI7XG4gICAgICAgIGNvbnRlbnRTcGFuLnN0eWxlLmdhcCA9IFwiMC4zNXJlbVwiO1xuICAgICAgICBjb25zdCBpY29uRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgICAgICBpY29uRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJhcmlhLWhpZGRlblwiLCBcInRydWVcIik7XG4gICAgICAgIGljb25FbGVtZW50LmNsYXNzTmFtZSA9IFwibWF0ZXJpYWwtc3ltYm9scy1vdXRsaW5lZFwiO1xuICAgICAgICBpY29uRWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gXCJpbmxpbmUtZmxleFwiO1xuICAgICAgICBpY29uRWxlbWVudC5zdHlsZS5hbGlnbkl0ZW1zID0gXCJjZW50ZXJcIjtcbiAgICAgICAgaWNvbkVsZW1lbnQuc3R5bGUuanVzdGlmeUNvbnRlbnQgPSBcImNlbnRlclwiO1xuICAgICAgICBpY29uRWxlbWVudC5zdHlsZS53aWR0aCA9IFwiMS4yNWVtXCI7XG4gICAgICAgIGljb25FbGVtZW50LnN0eWxlLm1pbldpZHRoID0gXCIxLjI1ZW1cIjtcbiAgICAgICAgaWYgKGljb24pIHtcbiAgICAgICAgICAgIGljb25FbGVtZW50LmlubmVyVGV4dCA9IGljb247XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpY29uRWxlbWVudC5zdHlsZS52aXNpYmlsaXR5ID0gXCJoaWRkZW5cIjtcbiAgICAgICAgICAgIGljb25FbGVtZW50LmlubmVyVGV4dCA9IFwiaG9tZVwiO1xuICAgICAgICB9XG4gICAgICAgIGNvbnRlbnRTcGFuLmFwcGVuZENoaWxkKGljb25FbGVtZW50KTtcbiAgICAgICAgbGV0IGxpbmtUaXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgICAgICBsaW5rVGl0bGUuaW5uZXJUZXh0ID0gdGl0bGU7XG4gICAgICAgIGNvbnRlbnRTcGFuLmFwcGVuZENoaWxkKGxpbmtUaXRsZSk7XG4gICAgICAgIGxpbmtBbmNob3IuYXBwZW5kQ2hpbGQoY29udGVudFNwYW4pO1xuICAgICAgICBpZiAoYXJpYUxhYmVsKSB7XG4gICAgICAgICAgICBsaW5rQW5jaG9yLmFyaWFMYWJlbCA9IGFyaWFMYWJlbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXVybCkge1xuICAgICAgICAgICAgY29uc3QgaW5mbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgICAgICAgICAgaW5mby5jbGFzc05hbWUgPSBsaW5rQW5jaG9yLmNsYXNzTmFtZTtcbiAgICAgICAgICAgIGlmICh0aXRsZS5sZW5ndGggPiAzMCkge1xuICAgICAgICAgICAgICAgIGluZm8uaW5uZXJUZXh0ID0gdGl0bGUuc2xpY2UoMCwgMTIpICsgXCIuLi5cIiArIHRpdGxlLnNsaWNlKC0xNSk7XG4gICAgICAgICAgICAgICAgLy8gYWRkIGhvdmVyIHRvIHNob3cgZnVsbCB0aXRsZVxuICAgICAgICAgICAgICAgIGluZm8udGl0bGUgPSB0aXRsZTtcbiAgICAgICAgICAgICAgICBpbmZvLnN0eWxlLmN1cnNvciA9IFwiaGVscFwiO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpbmZvLmlubmVyVGV4dCA9IHRpdGxlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaW5mby5zdHlsZS5kaXNwbGF5ID0gXCJmbGV4XCI7XG4gICAgICAgICAgICBpbmZvLnN0eWxlLmp1c3RpZnlDb250ZW50ID0gXCJjZW50ZXJcIjtcbiAgICAgICAgICAgIGluZm8uc3R5bGUuYWxpZ25JdGVtcyA9IFwiY2VudGVyXCI7XG4gICAgICAgICAgICBsaW5rQW5jaG9yLnJlcGxhY2VXaXRoKGluZm8pO1xuICAgICAgICB9XG4gICAgICAgIC8vIHJldHVybiBlbnRpcmUgaXRlbSB0ZW1wbGF0ZSwgbm90IGp1c3QgbGlua1xuICAgICAgICByZXR1cm4gbGluaztcbiAgICB9XG4gICAgLy8gbGltaXQgbGVuZ3RoIG9mIGVCb29rQ29uZmlnLmNvdXJzZSB0byAzMCBjaGFyYWN0ZXJzIHRvIHByZXZlbnQgb3Zlcmx5IGxvbmcgY291cnNlIG5hbWVzIGluIHRoZSBtZW51IGJ1dCBwcmVzZXJ2ZSB0aGUgbGFzdCAxNSBjaGFyYWN0ZXJzXG4gICAgbWVudUNvbnRlbnRBcmVhLmFwcGVuZENoaWxkKG1ha2VMaW5rKG51bGwsIGVCb29rQ29uZmlnLmNvdXJzZSkpO1xuICAgIG1lbnVDb250ZW50QXJlYS5hcHBlbmRDaGlsZChzZXBUZW1wbGF0ZS5jb250ZW50LmNsb25lTm9kZSh0cnVlKSk7XG5cbiAgICBtZW51Q29udGVudEFyZWEuYXBwZW5kQ2hpbGQoXG4gICAgICAgIG1ha2VMaW5rKFwiL25zL2NvdXJzZS9pbmRleFwiLCBcIkNvdXJzZSBIb21lXCIsIFwiaG9tZVwiKSxcbiAgICApO1xuICAgIG1lbnVDb250ZW50QXJlYS5hcHBlbmRDaGlsZChcbiAgICAgICAgbWFrZUxpbmsoXCIvYXNzaWdubWVudC9zdHVkZW50L2Nob29zZUFzc2lnbm1lbnRcIiwgXCJBc3NpZ25tZW50c1wiLCBcImVkaXRcIiksXG4gICAgKTtcbiAgICBtZW51Q29udGVudEFyZWEuYXBwZW5kQ2hpbGQoXG4gICAgICAgIG1ha2VMaW5rKFxuICAgICAgICAgICAgXCIvYXNzaWdubWVudC9wZWVyL3N0dWRlbnRcIixcbiAgICAgICAgICAgIFwiUGVlciBJbnN0cnVjdGlvbiAoU3R1ZGVudClcIixcbiAgICAgICAgICAgIFwiZ3JvdXBzXzNcIixcbiAgICAgICAgKSxcbiAgICApO1xuICAgIG1lbnVDb250ZW50QXJlYS5hcHBlbmRDaGlsZChcbiAgICAgICAgbWFrZUxpbmsoXCIvYXNzaWdubWVudC9zdHVkZW50L3N0dWRlbnRyZXBvcnRcIiwgXCJQcm9ncmVzc1wiKSxcbiAgICApO1xuICAgIGlmIChlQm9va0NvbmZpZy5pc0luc3RydWN0b3IpIHtcbiAgICAgICAgbWVudUNvbnRlbnRBcmVhLmFwcGVuZENoaWxkKHNlcFRlbXBsYXRlLmNvbnRlbnQuY2xvbmVOb2RlKHRydWUpKTtcbiAgICAgICAgbWVudUNvbnRlbnRBcmVhLmFwcGVuZENoaWxkKFxuICAgICAgICAgICAgbWFrZUxpbmsoXG4gICAgICAgICAgICAgICAgXCIvYWRtaW4vaW5zdHJ1Y3Rvci9tZW51XCIsXG4gICAgICAgICAgICAgICAgXCJJbnN0cnVjdG9yIERhc2hib2FyZFwiLFxuICAgICAgICAgICAgICAgIFwic2V0dGluZ3NcIixcbiAgICAgICAgICAgICksXG4gICAgICAgICk7XG4gICAgICAgIG1lbnVDb250ZW50QXJlYS5hcHBlbmRDaGlsZChcbiAgICAgICAgICAgIG1ha2VMaW5rKFxuICAgICAgICAgICAgICAgIFwiL2Fzc2lnbm1lbnQvcGVlci9pbnN0cnVjdG9yXCIsXG4gICAgICAgICAgICAgICAgXCJQZWVyIEluc3RydWN0aW9uIChJbnN0cnVjdG9yKVwiLFxuICAgICAgICAgICAgICAgIFwiZ3JvdXBzXzNcIixcbiAgICAgICAgICAgICksXG4gICAgICAgICk7XG4gICAgICAgIC8vIE9uIHJ1bmVzdG9uZS5hY2FkZW15IHRoZSBhdXRob3Igc2VydmVyIGlzIGl0cyBvd24gaG9zdCwgc28gdGhpcyBoYXMgdG9cbiAgICAgICAgLy8gYmUgYWJzb2x1dGUuIFNpbmdsZS1wcm94eSBkZXBsb3ltZW50cyBzZXQgYXV0aG9yU2VydmVyVXJsIHRvIC9hdXRob3IuXG4gICAgICAgIGxldCBhdXRob3JVcmwgPVxuICAgICAgICAgICAgKGVCb29rQ29uZmlnLmF1dGhvclNlcnZlclVybCB8fFxuICAgICAgICAgICAgICAgIFwiaHR0cHM6Ly9hdXRob3IucnVuZXN0b25lLmFjYWRlbXkvYXV0aG9yXCIpICsgXCIvXCI7XG4gICAgICAgIGxldCBlZGl0b3JVcmwgPVxuICAgICAgICAgICAgZUJvb2tDb25maWcuZWRpdG9yU2VydmVyVXJsIHx8IFwiL2FkbWluL2VkaXRvci9tYW5hZ2VfZXhlcmNpc2VzXCI7XG5cbiAgICAgICAgaWYgKGVCb29rQ29uZmlnLmlzQXV0aG9yKSB7XG4gICAgICAgICAgICBtZW51Q29udGVudEFyZWEuYXBwZW5kQ2hpbGQoXG4gICAgICAgICAgICAgICAgbWFrZUxpbmsoYXV0aG9yVXJsLCBcIkF1dGhvciBEYXNoYm9hcmRcIiksXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlQm9va0NvbmZpZy5pc0VkaXRvcikge1xuICAgICAgICAgICAgbWVudUNvbnRlbnRBcmVhLmFwcGVuZENoaWxkKFxuICAgICAgICAgICAgICAgIG1ha2VMaW5rKGVkaXRvclVybCwgXCJFZGl0b3IgRGFzaGJvYXJkXCIpLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICBtZW51Q29udGVudEFyZWEuYXBwZW5kQ2hpbGQoXG4gICAgICAgICAgICBtYWtlTGluayhcbiAgICAgICAgICAgICAgICBcIi9hc3NpZ25tZW50L2luc3RydWN0b3IvaW52b2ljZV9yZXF1ZXN0XCIsXG4gICAgICAgICAgICAgICAgXCJSZXF1ZXN0IEludm9pY2VcIixcbiAgICAgICAgICAgICksXG4gICAgICAgICk7XG4gICAgfVxuICAgIG1lbnVDb250ZW50QXJlYS5hcHBlbmRDaGlsZChzZXBUZW1wbGF0ZS5jb250ZW50LmNsb25lTm9kZSh0cnVlKSk7XG4gICAgbWVudUNvbnRlbnRBcmVhLmFwcGVuZENoaWxkKFxuICAgICAgICBtYWtlTGluayhcIi9hZG1pbi9hdXRoL215X2NvdXJzZXNcIiwgXCJDaGFuZ2UgQ291cnNlXCIsIFwibmV3c3N0YW5kXCIpLFxuICAgICk7XG4gICAgbWVudUNvbnRlbnRBcmVhLmFwcGVuZENoaWxkKG1ha2VMaW5rKFwiL2FkbWluL2F1dGgvcHJvZmlsZVwiLCBcIlByb2ZpbGVcIikpO1xuICAgIG1lbnVDb250ZW50QXJlYS5hcHBlbmRDaGlsZChtYWtlTGluayhcIi9hZG1pbi9hdXRoL2xvZ291dFwiLCBcIkxvZyBPdXRcIikpO1xuICAgIG1lbnVDb250ZW50QXJlYS5hcHBlbmRDaGlsZChzZXBUZW1wbGF0ZS5jb250ZW50LmNsb25lTm9kZSh0cnVlKSk7XG4gICAgY29uc3QgcHJvYmxlbVJlcG9ydExpbmsgPSBtYWtlTGluayhcbiAgICAgICAgXCIvYWRtaW4vcHJvYmxlbS9yZXBvcnRcIixcbiAgICAgICAgXCJQcm9ibGVtIFJlcG9ydFwiLFxuICAgICAgICBcImJ1Z19yZXBvcnRcIixcbiAgICApO1xuICAgIC8vIFRoZSBsb2cgaXMgYWxyZWFkeSBwZXJzaXN0ZWQgY29udGludW91c2x5OyBmbHVzaCBub3cgc28gbm90aGluZyBpbiB0aGVcbiAgICAvLyBkZWJvdW5jZSB3aW5kb3cgaXMgbG9zdC5cbiAgICBjb25zdCBwcm9ibGVtUmVwb3J0QW5jaG9yID0gcHJvYmxlbVJlcG9ydExpbmsucXVlcnlTZWxlY3RvcihcImFcIik7XG4gICAgaWYgKHByb2JsZW1SZXBvcnRBbmNob3IpIHtcbiAgICAgICAgcHJvYmxlbVJlcG9ydEFuY2hvci5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcnNQZXJzaXN0Q29uc29sZUxvZyk7XG4gICAgfVxuICAgIG1lbnVDb250ZW50QXJlYS5hcHBlbmRDaGlsZChwcm9ibGVtUmVwb3J0TGluayk7XG59KTtcblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgdGhlIHN0cmluZyBhcHBlYXJzIHRvIGNvbnRhaW4gTGFUZVggbWF0aC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxvb2tzTGlrZUxhdGV4TWF0aCh0ZXh0KSB7XG4gICAgaWYgKHR5cGVvZiB0ZXh0ICE9PSBcInN0cmluZ1wiKSByZXR1cm4gZmFsc2U7XG5cbiAgICAvLyBDb21tb24gTGFUZVggbWF0aCBkZWxpbWl0ZXJzXG4gICAgY29uc3QgbWF0aERlbGltaXRlcnMgPSBbXG4gICAgICAgIC9cXCRcXCRbXFxzXFxTXSs/XFwkXFwkLywgLy8gJCQgLi4uICQkXG4gICAgICAgIC9cXCRbXiRcXG5dKz9cXCQvLCAvLyAkIC4uLiAkXG4gICAgICAgIC9cXFxcXFxbW1xcc1xcU10rP1xcXFxcXF0vLCAvLyBcXFsgLi4uIFxcXVxuICAgICAgICAvXFxcXFxcKFtcXHNcXFNdKz9cXFxcXFwpLywgLy8gXFwoIC4uLiBcXClcbiAgICBdO1xuXG4gICAgLy8gQ29tbW9uIG1hdGggY29tbWFuZHMgKGF2b2lkIGdlbmVyaWMgXFx0ZXh0IG9yIFxccmVmLW9ubHkgY2FzZXMpXG4gICAgY29uc3QgbWF0aENvbW1hbmRzID1cbiAgICAgICAgL1xcXFwoZnJhY3xzcXJ0fHN1bXxwcm9kfGludHxsaW18c2lufGNvc3x0YW58bG9nfGxufGFscGhhfGJldGF8Z2FtbWF8cGl8dGhldGF8c2lnbWF8RGVsdGF8Y2RvdHx0aW1lc3xsZXF8Z2VxfG5lcSlcXGIvO1xuXG4gICAgLy8gU3VwZXJzY3JpcHRzL3N1YnNjcmlwdHMgbGlrZSB4XjIgb3IgYV9pXG4gICAgY29uc3Qgc3VwZXJTdWJTY3JpcHQgPSAvW2EtekEtWjAtOV1cXHMqW1xcXl9dXFxzKlxcez8uKz9cXH0/LztcblxuICAgIHJldHVybiAoXG4gICAgICAgIG1hdGhEZWxpbWl0ZXJzLnNvbWUoKHJlKSA9PiByZS50ZXN0KHRleHQpKSB8fFxuICAgICAgICBtYXRoQ29tbWFuZHMudGVzdCh0ZXh0KSB8fFxuICAgICAgICBzdXBlclN1YlNjcmlwdC50ZXN0KHRleHQpXG4gICAgKTtcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBnZXRTd2l0Y2goKSB7XG4gICAgY29uc3QgdG9nZ2xlU3dpdGNoID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgJy50aGVtZS1zd2l0Y2ggaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJyxcbiAgICApO1xuICAgIGNvbnN0IGN1cnJlbnRUaGVtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwidGhlbWVcIilcbiAgICAgICAgPyBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInRoZW1lXCIpXG4gICAgICAgIDogbnVsbDtcblxuICAgIGlmIChjdXJyZW50VGhlbWUpIHtcbiAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNldEF0dHJpYnV0ZShcImRhdGEtdGhlbWVcIiwgY3VycmVudFRoZW1lKTtcblxuICAgICAgICBpZiAoY3VycmVudFRoZW1lID09PSBcImRhcmtcIikge1xuICAgICAgICAgICAgdG9nZ2xlU3dpdGNoLmNoZWNrZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc3dpdGNoVGhlbWUoKSB7XG4gICAgdmFyIGNoZWNrQm94ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaGVja2JveFwiKTtcbiAgICBpZiAoY2hlY2tCb3guY2hlY2tlZCA9PSB0cnVlKSB7XG4gICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJkYXRhLXRoZW1lXCIsIFwiZGFya1wiKTtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJ0aGVtZVwiLCBcImRhcmtcIik7IC8vYWRkIHRoaXNcbiAgICB9IGVsc2Uge1xuICAgICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2V0QXR0cmlidXRlKFwiZGF0YS10aGVtZVwiLCBcImxpZ2h0XCIpO1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInRoZW1lXCIsIFwibGlnaHRcIik7IC8vYWRkIHRoaXNcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBydW5lc3RvbmVfaW1wb3J0IH0gZnJvbSBcIi4uLy4uLy4uL3dlYnBhY2suaW5kZXguanNcIjtcbmltcG9ydCB7IGdldERhdGFWYWx1ZSB9IGZyb20gXCIuL2RvbXV0aWwuanNcIjtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlbmRlclJ1bmVzdG9uZUNvbXBvbmVudChcbiAgICBjb21wb25lbnRTcmMsXG4gICAgd2hlcmVEaXYsXG4gICAgbW9yZU9wdHMsXG4pIHtcbiAgICAvKipcbiAgICAgKiAgVGhlIGVhc3kgcGFydCBpcyBhZGRpbmcgdGhlIGNvbXBvbmVudFNyYyB0byB0aGUgZXhpc3RpbmcgZGl2LlxuICAgICAqICBUaGUgdGVkaW91cyBwYXJ0IGlzIGNhbGxpbmcgdGhlIHJpZ2h0IGZ1bmN0aW9ucyB0byB0dXJuIHRoZVxuICAgICAqICBzb3VyY2UgaW50byB0aGUgYWN0dWFsIGNvbXBvbmVudC5cbiAgICAgKi9cbiAgICBsZXQgdGFyZ2V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQod2hlcmVEaXYpO1xuICAgIGlmICghdGFyZ2V0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFjb21wb25lbnRTcmMpIHtcbiAgICAgICAgdGFyZ2V0LmlubmVySFRNTCA9IGA8cD5Tb3JyeSwgbm8gc291cmNlIGlzIGF2YWlsYWJsZSBmb3IgcHJldmlldy48L3A+YDtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBsZXQgcGF0dCA9IC8uLlxcL19pbWFnZXMvZztcbiAgICBjb21wb25lbnRTcmMgPSBjb21wb25lbnRTcmMucmVwbGFjZShcbiAgICAgICAgcGF0dCxcbiAgICAgICAgYCR7ZUJvb2tDb25maWcuYXBwfS9ib29rcy9wdWJsaXNoZWQvJHtlQm9va0NvbmZpZy5iYXNlY291cnNlfS9faW1hZ2VzYCxcbiAgICApO1xuICAgIHRhcmdldC5pbm5lckhUTUwgPSBjb21wb25lbnRTcmM7XG5cbiAgICBpZiAodHlwZW9mIHdpbmRvdy5jb21wb25lbnRNYXAgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgd2luZG93LmNvbXBvbmVudE1hcCA9IHt9O1xuICAgIH1cblxuICAgIGxldCBjb21wb25lbnRFbGVtZW50ID0gdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1jb21wb25lbnRdXCIpO1xuICAgIGxldCBjb21wb25lbnRLaW5kID0gY29tcG9uZW50RWxlbWVudD8uZGF0YXNldC5jb21wb25lbnQ7XG4gICAgLy8gSW1wb3J0IHRoZSBKYXZhU2NyaXB0IGZvciB0aGlzIGNvbXBvbmVudCBiZWZvcmUgcHJvY2VlZGluZy5cbiAgICBhd2FpdCBydW5lc3RvbmVfaW1wb3J0KGNvbXBvbmVudEtpbmQpO1xuICAgIGxldCBvcHQgPSB7fTtcbiAgICBvcHQub3JpZyA9IGNvbXBvbmVudEVsZW1lbnQ7XG4gICAgaWYgKG9wdC5vcmlnKSB7XG4gICAgICAgIG9wdC5sYW5nID0gZ2V0RGF0YVZhbHVlKG9wdC5vcmlnLCBcImxhbmdcIik7XG4gICAgICAgIG9wdC51c2VSdW5lc3RvbmVTZXJ2aWNlcyA9IHRydWU7XG4gICAgICAgIG9wdC5ncmFkZXJhY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgb3B0LnB5dGhvbjMgPSB0cnVlO1xuICAgICAgICBpZiAodHlwZW9mIG1vcmVPcHRzICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBrZXkgaW4gbW9yZU9wdHMpIHtcbiAgICAgICAgICAgICAgICBvcHRba2V5XSA9IG1vcmVPcHRzW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGNvbXBvbmVudF9mYWN0b3J5ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGFsZXJ0KFwiRXJyb3I6ICBNaXNzaW5nIHRoZSBjb21wb25lbnQgZmFjdG9yeSFcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCF3aW5kb3cuY29tcG9uZW50X2ZhY3RvcnlbY29tcG9uZW50S2luZF0gJiYgIXRhcmdldC5pbm5lckhUTUwpIHtcbiAgICAgICAgICAgIHRhcmdldC5pbm5lckhUTUwgPSBgPHA+UHJldmlldyBub3QgYXZhaWxhYmxlIGZvciAke2NvbXBvbmVudEtpbmR9PC9wPmA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgcmVzID0gd2luZG93LmNvbXBvbmVudF9mYWN0b3J5W2NvbXBvbmVudEtpbmRdKG9wdCk7XG4gICAgICAgICAgICBpZiAoY29tcG9uZW50S2luZCA9PT0gXCJhY3RpdmVjb2RlXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAobW9yZU9wdHMubXVsdGlHcmFkZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmNvbXBvbmVudE1hcFtcbiAgICAgICAgICAgICAgICAgICAgICAgIGAke21vcmVPcHRzLmdyYWRpbmdDb250YWluZXJ9ICR7cmVzLmRpdmlkfWBcbiAgICAgICAgICAgICAgICAgICAgXSA9IHJlcztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuY29tcG9uZW50TWFwW3Jlcy5kaXZpZF0gPSByZXM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlVGltZWRDb21wb25lbnQoY29tcG9uZW50U3JjLCBtb3JlT3B0cykge1xuICAgIC8qIFRoZSBpbXBvcnRhbnQgZGlzdGluY3Rpb24gaXMgdGhhdCB0aGUgY29tcG9uZW50IGRvZXMgbm90IHJlYWxseSBuZWVkIHRvIGJlIHJlbmRlcmVkXG4gICAgaW50byB0aGUgcGFnZSwgaW4gZmFjdCwgZHVlIHRvIHRoZSBhc3luYyBuYXR1cmUgb2YgZ2V0dGluZyB0aGUgc291cmNlIHRoZSBsaXN0IG9mIHF1ZXN0aW9uc1xuICAgIGlzIG1hZGUgYW5kIHRoZSBvcmlnaW5hbCBodG1sIGlzIHJlcGxhY2VkIGJ5IHRoZSBsb29rIG9mIHRoZSBleGFtLlxuICAgICovXG5cbiAgICBsZXQgcGF0dCA9IC8uLlxcL19pbWFnZXMvZztcbiAgICBjb21wb25lbnRTcmMgPSBjb21wb25lbnRTcmMucmVwbGFjZShcbiAgICAgICAgcGF0dCxcbiAgICAgICAgYCR7ZUJvb2tDb25maWcuYXBwfS9ib29rcy9wdWJsaXNoZWQvJHtlQm9va0NvbmZpZy5iYXNlY291cnNlfS9faW1hZ2VzYCxcbiAgICApO1xuXG4gICAgbGV0IHBhcnNlZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgcGFyc2VkLmlubmVySFRNTCA9IGNvbXBvbmVudFNyYztcbiAgICBsZXQgY29tcG9uZW50RWxlbWVudCA9IHBhcnNlZC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtY29tcG9uZW50XVwiKTtcbiAgICBsZXQgY29tcG9uZW50S2luZCA9IGNvbXBvbmVudEVsZW1lbnQ/LmRhdGFzZXQuY29tcG9uZW50O1xuICAgIGxldCBvcmlnSWQgPSBjb21wb25lbnRFbGVtZW50Py5nZXRBdHRyaWJ1dGUoXCJpZFwiKTtcblxuICAgIC8vIERvdWJsZSBjaGVjayAtLSBpZiB0aGUgY29tcG9uZW50IHNvdXJjZSBpcyBub3QgaW4gdGhlIERPTSwgdGhlbiBicmllZmx5IGFkZCBpdFxuICAgIC8vIGFuZCBjYWxsIHRoZSBjb25zdHJ1Y3Rvci5cbiAgICBpZiAoIWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG9yaWdJZCkpIHtcbiAgICAgICAgbGV0IGhkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBoZGl2LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgaGRpdi5pbm5lckhUTUwgPSBjb21wb25lbnRTcmM7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaGRpdik7XG4gICAgfVxuXG4gICAgbGV0IHJldDtcbiAgICBsZXQgb3B0cyA9IHtcbiAgICAgICAgb3JpZzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQob3JpZ0lkKSxcbiAgICAgICAgdGltZWQ6IHRydWUsXG4gICAgfTtcbiAgICBpZiAodHlwZW9mIG1vcmVPcHRzICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGZvciAobGV0IGtleSBpbiBtb3JlT3B0cykge1xuICAgICAgICAgICAgb3B0c1trZXldID0gbW9yZU9wdHNba2V5XTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChjb21wb25lbnRLaW5kIGluIHdpbmRvdy5jb21wb25lbnRfZmFjdG9yeSkge1xuICAgICAgICByZXQgPSB3aW5kb3cuY29tcG9uZW50X2ZhY3RvcnlbY29tcG9uZW50S2luZF0ob3B0cyk7XG4gICAgfVxuXG4gICAgbGV0IHJkaWN0ID0ge307XG4gICAgcmRpY3QucXVlc3Rpb24gPSByZXQ7XG4gICAgcmV0dXJuIHJkaWN0O1xufVxuXG4vLyBGb3IgaW50ZWdyYXRpb24gd2l0aCB0aGUgUmVhY3Qgb3ZlcmhhdWx0IG9mIFByZXRleHRcbi8vIDEuIERpc2FibGUgdGhlIGF1dG9tYXRpYyBpbnN0YW50aWF0aW9uIGF0IHRoZSBlbmQgb2YgZWFjaCBjb21wb25lbnQuanNcbi8vIDIuIHJlYWN0IHdpbGwgc2VhcmNoIGZvciBhbGwgXCIucnVuZXN0b25lXCIgYW5kIHdpbGwgY2FsbCB0aGlzIGZ1bmN0aW9uIGZvciBlYWNoIG9mIHRoZW0uXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVuZGVyT25lQ29tcG9uZW50KHJzRGl2KSB7XG4gICAgLy8gRmluZCB0aGUgYWN0dWFsIGNvbXBvbmVudCBpbnNpZGUgdGhlIHJ1bmVzdG9uZSBjb21wb25lbnQuXG4gICAgbGV0IGNvbXBvbmVudCA9IHJzRGl2LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1jb21wb25lbnRdXCIpO1xuICAgIGlmIChjb21wb25lbnQgPT0gbnVsbCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAgIFwiUmVuZGVyIHdhcyBjYWxsZWQgZm9yIGEgY29tcG9uZW50LCBidXQgbm93IFtkYXRhLWNvbXBvbmVudF0gYXR0cmlidXRlIGlzIHByZXNlbnQuIFRoaXMgbWF5IG1lYW4gdGhlIGNvbXBvbmVudCBoYXMgYWxyZWFkeSBiZWVuIHJlbmRlcmVkLlwiLFxuICAgICAgICApO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGxldCBjb21wb25lbnRLaW5kID0gY29tcG9uZW50LmRhdGFzZXQuY29tcG9uZW50O1xuICAgIGF3YWl0IHJ1bmVzdG9uZV9pbXBvcnQoY29tcG9uZW50S2luZCk7XG4gICAgaWYgKCFyc0Rpdi5jbG9zZXN0KFwiW2RhdGEtY29tcG9uZW50PXRpbWVkQXNzZXNzbWVudF1cIikpIHtcbiAgICAgICAgLy8gSWYgdGhpcyBlbGVtZW50IGV4aXN0cyB3aXRoaW4gYSB0aW1lZCBjb21wb25lbnQsIGRvbid0IHJlbmRlciBpdCBoZXJlXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgZGl2aWQgPSBjb21wb25lbnQuaWQ7XG4gICAgICAgICAgICB3aW5kb3cuY29tcG9uZW50TWFwW2RpdmlkXSA9IHdpbmRvdy5jb21wb25lbnRfZmFjdG9yeVtcbiAgICAgICAgICAgICAgICBjb21wb25lbnRLaW5kXG4gICAgICAgICAgICBdKHtcbiAgICAgICAgICAgICAgICBvcmlnOiBjb21wb25lbnQsXG4gICAgICAgICAgICAgICAgdXNlUnVuZXN0b25lU2VydmljZXM6IGVCb29rQ29uZmlnLnVzZVJ1bmVzdG9uZVNlcnZpY2VzLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYEVycm9yIHJlbmRlcmluZyAke2NvbXBvbmVudEtpbmR9IFByb2JsZW0gJHtjb21wb25lbnQuaWR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgRGV0YWlsczogJHtlcnJ9YCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=