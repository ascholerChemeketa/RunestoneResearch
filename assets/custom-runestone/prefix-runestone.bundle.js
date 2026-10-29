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

/***/ 41669:
/*!*************************!*\
  !*** external "jQuery" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = jQuery;

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
/* harmony import */ var jquery_ui_jquery_ui_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jquery-ui/jquery-ui.js */ 67375);
/* harmony import */ var jquery_ui_jquery_ui_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery_ui_jquery_ui_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var jquery_ui_themes_base_jquery_ui_all_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! jquery-ui/themes/base/jquery.ui.all.css */ 62423);
/* harmony import */ var _ptxrs_bootstrap_less__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ptxrs-bootstrap.less */ 69041);
/* harmony import */ var _runestone_common_css_material_symbols_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./runestone/common/css/material-symbols.css */ 75523);
/* harmony import */ var _runestone_common_js_bookfuncs_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./runestone/common/js/bookfuncs.js */ 83057);
/* harmony import */ var _runestone_common_js_user_highlights_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./runestone/common/js/user-highlights.js */ 59782);
/* harmony import */ var _runestone_common_js_pretext_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./runestone/common/js/pretext.js */ 19359);
/* harmony import */ var _runestone_common_js_theme_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./runestone/common/js/theme.js */ 94564);
/* harmony import */ var _runestone_common_js_presenter_mode_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./runestone/common/js/presenter_mode.js */ 19695);
/* harmony import */ var _runestone_common_js_presenter_mode_js__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_runestone_common_js_presenter_mode_js__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _runestone_common_css_presenter_mode_less__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./runestone/common/css/presenter_mode.less */ 45631);
/* harmony import */ var _runestone_common_js_renderComponent_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./runestone/common/js/renderComponent.js */ 98098);
/* harmony import */ var _runestone_common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./runestone/common/js/runestonebase.js */ 78673);
/* harmony import */ var _runestone_splice_js_spliceWrapper_ts__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./runestone/splice/js/spliceWrapper.ts */ 67799);
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
// jQuery-related imports. jQuery UI is still needed by the vendored pytutor
// bundle (codelens); the jquery.idle-timer plugin was dead code and has been
// removed.


// i18n is now handled by the dependency-free runestone/common/js/rsi18n.js;
// the vendored Wikimedia jquery.i18n plugin has been removed.

// common styles come from here

// Self-hosted icon font for the ``material-symbols-outlined`` spans that
// components render; without it the icon names show up as literal text.

//import "./runestone/common/project_template/_templates/plugin_layouts/sphinx_bootstrap/static/bootstrap-sphinx.js";

// Misc




// These are only needed for the Runestone book, but not in a library mode (such as pretext). I would prefer to dynamically load them. However, these scripts are so small I haven't bothered to do so.







// Dynamically loaded components
// =============================
// This provides a list of modules that components can dynamically import. Webpack will create a list of imports for each based on its analysis.
const module_map = {
    // Wrap each import in a function, so that it won't occur until the function is called. While something cleaner would be nice, webpack can't analyze things like ``import(expression)``.
    //
    // The keys must match the value of each component's ``data-component`` attribute -- the ``runestone_import`` and ``runestone_auto_import`` functions assume this.
    activecode: () => Promise.all(/*! import() */[__webpack_require__.e("vendors-node_modules_handsontable_es_index_js-node_modules_handsontable_dist_handsontable_ful-dcc440"), __webpack_require__.e("vendors-node_modules_byte-base64_lib_js-node_modules_codemirror_addon_comment_comment_js-node-8b2590"), __webpack_require__.e("runestone_codelens_js_pytutor-embed_bundle_js-runestone_common_js_rsi18n_js"), __webpack_require__.e("node_modules_moment_locale_sync_recursive_-runestone_activecode_js_acfactory_js-node_modules_-ef73b3")]).then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/activecode/js/acfactory.js */ 49917)),
    // Always import the timed version of a component if available, since the timed components also define the component's factory and include the component as well. Note that ``acfactory`` imports the timed components of ActiveCode, so it follows this pattern.
    clickablearea: () =>
        Promise.all(/*! import() */[__webpack_require__.e("runestone_clickableArea_js_timedclickable_js"), __webpack_require__.e("runestone_clickableArea_css_clickable_css")]).then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/clickableArea/js/timedclickable.js */ 44892)),
    codelens: () => Promise.all(/*! import() */[__webpack_require__.e("runestone_codelens_js_pytutor-embed_bundle_js-runestone_common_js_rsi18n_js"), __webpack_require__.e("runestone_codelens_js_codelens_js")]).then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/codelens/js/codelens.js */ 76412)),
    datafile: () => __webpack_require__.e(/*! import() */ "runestone_datafile_js_datafile_js").then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/datafile/js/datafile.js */ 33580)),
    dragndrop: () => Promise.all(/*! import() */[__webpack_require__.e("runestone_dragndrop_js_timeddnd_js"), __webpack_require__.e("runestone_common_js_mathjax-a11y_js-runestone_common_js_rsi18n_js")]).then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/dragndrop/js/timeddnd.js */ 17558)),
    fillintheblank: () => Promise.all(/*! import() */[__webpack_require__.e("runestone_fitb_js_timedfitb_js"), __webpack_require__.e("runestone_common_js_rsi18n_js-runestone_fitb_css_fitb_css")]).then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/fitb/js/timedfitb.js */ 1103)),
    groupsub: () => __webpack_require__.e(/*! import() */ "runestone_groupsub_js_groupsub_js").then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/groupsub/js/groupsub.js */ 24616)),
    matching: () => Promise.all(/*! import() */[__webpack_require__.e("runestone_matching_js_matching_js"), __webpack_require__.e("runestone_common_js_mathjax-a11y_js-runestone_common_js_xmlconversion_js")]).then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/matching/js/matching.js */ 17352)),
    multiplechoice: () => Promise.all(/*! import() */[__webpack_require__.e("runestone_mchoice_js_timedmc_js"), __webpack_require__.e("runestone_common_js_mathjax-a11y_js-runestone_mchoice_css_mchoice_css")]).then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/mchoice/js/timedmc.js */ 86001)),
    hparsons: () => Promise.all(/*! import() */[__webpack_require__.e("vendors-node_modules_handsontable_es_index_js-node_modules_handsontable_dist_handsontable_ful-dcc440"), __webpack_require__.e("vendors-node_modules_sortablejs_modular_sortable_esm_js-node_modules_highlight_js_es_core_js--8c942a"), __webpack_require__.e("runestone_common_js_mathjax-a11y_js-runestone_parsons_js_parsons-i18n_en_js-runestone_parsons-1c071d"), __webpack_require__.e("node_modules_moment_locale_sync_recursive_-runestone_hparsons_js_hparsons_js")]).then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/hparsons/js/hparsons.js */ 47272)),
    parsons: () => Promise.all(/*! import() */[__webpack_require__.e("runestone_common_js_mathjax-a11y_js-runestone_parsons_js_parsons-i18n_en_js-runestone_parsons-1c071d"), __webpack_require__.e("runestone_parsons_js_timedparsons_js"), __webpack_require__.e("runestone_common_js_rsi18n_js")]).then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/parsons/js/timedparsons.js */ 23405)),
    poll: () => __webpack_require__.e(/*! import() */ "runestone_poll_js_poll_js").then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/poll/js/poll.js */ 11168)),
    selectquestion: () => Promise.all(/*! import() */[__webpack_require__.e("runestone_selectquestion_js_selectone_js"), __webpack_require__.e("runestone_selectquestion_css_selectquestion_css")]).then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/selectquestion/js/selectone.js */ 10662)),
    shortanswer: () =>
        Promise.all(/*! import() */[__webpack_require__.e("runestone_shortanswer_js_timed_shortanswer_js"), __webpack_require__.e("runestone_shortanswer_css_shortanswer_css")]).then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/shortanswer/js/timed_shortanswer.js */ 68950)),
    showeval: () => __webpack_require__.e(/*! import() */ "runestone_showeval_js_showEval_js").then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/showeval/js/showEval.js */ 8824)),
    tabbedStuff: () => __webpack_require__.e(/*! import() */ "runestone_tabbedStuff_js_tabbedstuff_js").then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/tabbedStuff/js/tabbedstuff.js */ 76442)),
    timedAssessment: () => Promise.all(/*! import() */[__webpack_require__.e("vendors-node_modules_handsontable_es_index_js-node_modules_handsontable_dist_handsontable_ful-dcc440"), __webpack_require__.e("vendors-node_modules_byte-base64_lib_js-node_modules_codemirror_addon_comment_comment_js-node-8b2590"), __webpack_require__.e("runestone_codelens_js_pytutor-embed_bundle_js-runestone_common_js_rsi18n_js"), __webpack_require__.e("runestone_common_js_mathjax-a11y_js-runestone_parsons_js_parsons-i18n_en_js-runestone_parsons-1c071d"), __webpack_require__.e("node_modules_moment_locale_sync_recursive_-runestone_activecode_js_acfactory_js-node_modules_-ef73b3"), __webpack_require__.e("runestone_parsons_js_timedparsons_js"), __webpack_require__.e("runestone_dragndrop_js_timeddnd_js"), __webpack_require__.e("runestone_fitb_js_timedfitb_js"), __webpack_require__.e("runestone_matching_js_matching_js"), __webpack_require__.e("runestone_mchoice_js_timedmc_js"), __webpack_require__.e("runestone_clickableArea_js_timedclickable_js"), __webpack_require__.e("runestone_selectquestion_js_selectone_js"), __webpack_require__.e("runestone_shortanswer_js_timed_shortanswer_js"), __webpack_require__.e("runestone_timed_js_timed_js-runestone_clickableArea_css_clickable_css-runestone_fitb_css_fitb-cd9fb1")]).then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/timed/js/timed.js */ 4968)),
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

var splice = new _runestone_splice_js_spliceWrapper_ts__WEBPACK_IMPORTED_MODULE_12__.SpliceWrapper();
// The grading interface needs the singleton so it can register the iframes it
// is displaying; see SpliceWrapper.registerGraderFrame.
window.spliceWrapper = splice;

// Manual exports
// ==============
// Webpack's ``output.library`` setting doesn't seem to work with the split chunks plugin; do all exports manually through the ``window`` object instead.

const rc = {};
rc.runestone_import = runestone_import;
rc.runestone_auto_import = runestone_auto_import;
rc.getSwitch = _runestone_common_js_theme_js__WEBPACK_IMPORTED_MODULE_7__.getSwitch;
rc.switchTheme = _runestone_common_js_theme_js__WEBPACK_IMPORTED_MODULE_7__.switchTheme;
rc.popupScratchAC = popupScratchAC;
rc.renderOneComponent = _runestone_common_js_renderComponent_js__WEBPACK_IMPORTED_MODULE_10__.renderOneComponent;
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
/******/ __webpack_require__.O(0, ["vendors-node_modules_jquery-ui_jquery-ui_js-node_modules_jquery-ui_themes_base_jquery_ui_all_-a237a9"], () => (__webpack_exec__(80184)));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZml4LXJ1bmVzdG9uZS5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQTtBQUNBOztBQUVBOztBQUUrQzs7QUFFL0M7QUFDQSxpQkFBaUIseURBQWE7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsOENBQThDO0FBQzVFLFNBQVM7QUFDVCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSw4QkFBOEIsMkNBQTJDO0FBQ3pFLFNBQVM7QUFDVCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOzs7Ozs7Ozs7OztBQy9ERDtBQUNBOztBQUVBLHdCQUF3QjtBQUN4Qjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBLHdDQUF3QztBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNoTEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHNCQUFzQixTQUFTOztBQUUvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFNBQVM7QUFDcEIsV0FBVyxRQUFRO0FBQ25CO0FBQ087QUFDUCw4Q0FBOEMsS0FBSztBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckIsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsK0NBQStDO0FBQy9DO0FBQ0EsU0FBUztBQUNULHFCQUFxQjtBQUNyQjtBQUNBLGVBQWUsOEJBQThCO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxREFBcUQsb0JBQW9CO0FBQ3pFO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVix5REFBeUQsRUFBRTtBQUMzRDtBQUNBO0FBQ0E7O0FBRU87O0FBRVA7QUFDQSxxQkFBcUIsRUFBRSxnQkFBZ0I7QUFDdkMsaUNBQWlDLEVBQUUsS0FBSztBQUN4Qyx1REFBdUQ7QUFDdkQ7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLDZDQUE2QyxLQUFLO0FBQ2xEO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkIsZUFBZSxFQUFFLGFBQWE7QUFDM0QsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOENBQThDLFlBQVksS0FBSyxNQUFNO0FBQ3JFO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLE1BQU07QUFDakMsdUJBQXVCLFlBQVk7QUFDbkMsU0FBUztBQUNULDREQUE0RDtBQUM1RDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrREFBa0Q7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDTztBQUNQOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG9EQUFvRCxNQUFNOztBQUUxRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDM3ZETztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRU87QUFDUDtBQUNBO0FBQ0E7QUFDQSwrQ0FBK0M7QUFDL0MsTUFBTTtBQUNOO0FBQ0EsZ0RBQWdEO0FBQ2hEO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDMUI2RDtBQUNqQjs7QUFFckM7QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxnQkFBZ0IsbUJBQW1CLHVCQUF1QjtBQUNyRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxVQUFVLG1FQUFnQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIseURBQVk7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQSwrREFBK0QsY0FBYztBQUM3RSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsMkJBQTJCLEVBQUUsVUFBVTtBQUNsRTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRU87QUFDUDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLGdCQUFnQixtQkFBbUIsdUJBQXVCO0FBQ3JFOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVLG1FQUFnQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsVUFBVTtBQUNWLDJDQUEyQyxlQUFlLFVBQVU7QUFDcEUsb0NBQW9DLElBQUk7QUFDeEM7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9jb21tb24vanMvcHJldGV4dC5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2NvbW1vbi9qcy9wcmVzZW50ZXJfbW9kZS5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2NvbW1vbi9qcy9kb211dGlsLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvZXh0ZXJuYWwgdmFyIFwialF1ZXJ5XCIiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9jb21tb24vY3NzL3ByZXNlbnRlcl9tb2RlLmxlc3M/Mjg0OSIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2NvbW1vbi9qcy91c2VyLWhpZ2hsaWdodHMuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9zcGxpY2UvanMvc3BsaWNlV3JhcHBlci50cyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcHR4cnMtYm9vdHN0cmFwLmxlc3M/ZmY5YiIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2NvbW1vbi9jc3MvbWF0ZXJpYWwtc3ltYm9scy5jc3M/MmQyYiIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2NvbW1vbi9jc3MvdXNlci1oaWdobGlnaHRzLmNzcz9hOTVlIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvY29tbW9uL2pzL3J1bmVzdG9uZWJhc2UuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3dlYnBhY2suaW5kZXguanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9jb21tb24vanMvYm9va2Z1bmNzLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvY29tbW9uL2pzL3RoZW1lLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvY29tbW9uL2pzL3JlbmRlckNvbXBvbmVudC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICAgIFN1cHBvcnQgZnVuY3Rpb25zIGZvciBQcmVUZVh0IGJvb2tzIHJ1bm5pbmcgb24gUnVuZXN0b25lXG5cbiovXG5cbmltcG9ydCBSdW5lc3RvbmVCYXNlIGZyb20gXCIuL3J1bmVzdG9uZWJhc2UuanNcIjtcblxuZnVuY3Rpb24gc2V0dXBQVFhFdmVudHMoKSB7XG4gICAgbGV0IHJiID0gbmV3IFJ1bmVzdG9uZUJhc2UoKTtcbiAgICAvLyBsb2cgYW4gZXZlbnQgd2hlbiBhIGtub3dsIGlzIG9wZW5lZC5cbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiW2RhdGEta25vd2xdXCIpLmZvckVhY2goKGVsKSA9PiB7XG4gICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBsZXQgZGl2X2lkID0gZWwuZ2V0QXR0cmlidXRlKFwiZGF0YS1rbm93bFwiKTtcbiAgICAgICAgICAgIHJiLmxvZ0Jvb2tFdmVudCh7IGV2ZW50OiBcImtub3dsXCIsIGFjdDogXCJjbGlja1wiLCBkaXZfaWQ6IGRpdl9pZCB9KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgbGV0IGJvcm5faGlkZGVuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcImRldGFpbHMuYm9ybi1oaWRkZW4ta25vd2xcIik7XG4gICAgYm9ybl9oaWRkZW4uZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgICAgLy8gbG9nIGFuIGV2ZW50IHdoZW4gYSBrbm93bCBpcyBvcGVuZWQgdGhhdCB3YXMgYm9ybiBoaWRkZW5cbiAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcihcInRvZ2dsZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoZWwub3Blbikge1xuICAgICAgICAgICAgICAgIGxldCBkaXZfaWQgPSBlbC5pZDtcbiAgICAgICAgICAgICAgICByYi5sb2dCb29rRXZlbnQoe1xuICAgICAgICAgICAgICAgICAgICBldmVudDogXCJrbm93bFwiLFxuICAgICAgICAgICAgICAgICAgICBhY3Q6IFwib3BlblwiLFxuICAgICAgICAgICAgICAgICAgICBkaXZfaWQ6IGRpdl9pZCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgLy8gbG9nIGFuIGV2ZW50IHdoZW4gYSBzYWdlIGNlbGwgaXMgZXZhbHVhdGVkXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5zYWdlY2VsbF9ldmFsQnV0dG9uXCIpLmZvckVhY2goKGJ0bikgPT4ge1xuICAgICAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGxldCBjb250YWluZXIgPSBidG4uY2xvc2VzdChcIi5wdHgtc2FnZWNlbGxcIik7XG4gICAgICAgICAgICBsZXQgY29kZUlucHV0ID0gY29udGFpbmVyXG4gICAgICAgICAgICAgICAgPyBjb250YWluZXIucXVlcnlTZWxlY3RvcihcIi5zYWdlY2VsbF9pbnB1dFwiKVxuICAgICAgICAgICAgICAgIDogbnVsbDtcbiAgICAgICAgICAgIGxldCBjb2RlID0gY29kZUlucHV0ID8gY29kZUlucHV0LnRleHRDb250ZW50IDogXCJcIjtcbiAgICAgICAgICAgIGxldCBkaXZfaWQgPSBjb250YWluZXIgPyBjb250YWluZXIuaWQgOiBudWxsO1xuICAgICAgICAgICAgaWYgKCFkaXZfaWQpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgICAgICAgICAgIFwiQ291bGQgbm90IGZpbmQgY29udGFpbmVyIG9yIGRpdl9pZCBmb3Igc2FnZWNlbGwgYnV0dG9uXCIsXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJiLmxvZ0Jvb2tFdmVudCh7IGV2ZW50OiBcInNhZ2VcIiwgYWN0OiBcInJ1blwiLCBkaXZfaWQ6IGRpdl9pZCB9KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgaWYgKHR5cGVvZiBlQm9va0NvbmZpZyAhPT0gXCJ1bmRlZmluZWRcIiAmJiAhZUJvb2tDb25maWcuaXNJbnN0cnVjdG9yKSB7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY29tbWVudGFyeVwiKS5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgICAgICAgZWwuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgY29uc29sZS5sb2coXCJzZXR0aW5nIHVwIHByZXRleHRcIik7XG4gICAgc2V0dXBQVFhFdmVudHMoKTtcbiAgICBsZXQgd3JhcCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHJpbWFyeS1uYXZiYXItc3RpY2t5LXdyYXBwZXJcIik7XG4gICAgaWYgKHdyYXApIHtcbiAgICAgICAgd3JhcC5zdHlsZS5vdmVyZmxvdyA9IFwidmlzaWJsZVwiO1xuICAgIH1cbn0pO1xuIiwiLy8gSW5zdHJ1Y3Rvci1vbmx5IFwiQ29kZSBQcmVzZW50ZXJcIiB2aWV3IGZvciBTcGhpbnggYm9vayBwYWdlczogaGlkZXMgdGhlXG4vLyBwcm9zZSBhbmQgc3RlcHMgdGhyb3VnaCB0aGUgaW50ZXJhY3RpdmUgZXhlcmNpc2VzIG9uZSBhdCBhIHRpbWUuXG5cbnZhciBjb2RlRXhlcmNpc2VzID0gW107IC8vIEFycmF5IG9mIHRvcC1sZXZlbCAucnVuZXN0b25lIGV4ZXJjaXNlIGRpdnNcbnZhciBwcmVzZW50TW9kZUluaXRpYWxpemVkID0gZmFsc2U7XG5cbi8vIEVsZW1lbnRzIGEgcHJlc2VudGVyIHdhbnRzIHRvIGtlZXAgb24gc2NyZWVuLlxuY29uc3QgS0VFUF9WSVNJQkxFID1cbiAgICBcImgxLCAucHJlc2VudGF0aW9uLXRpdGxlLCAuYnRuLXByZXNlbnRlciwgLnJ1bmVzdG9uZSwgLnJ1bmVzdG9uZSAqLCBzZWN0aW9uLCAucHJlLCBjb2RlXCI7XG5cbmZ1bmN0aW9uIHNlY3Rpb25Db250ZW50KCkge1xuICAgIHJldHVybiBbLi4uZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcInNlY3Rpb24gKlwiKV0uZmlsdGVyKFxuICAgICAgICAoZWwpID0+ICFlbC5tYXRjaGVzKEtFRVBfVklTSUJMRSksXG4gICAgKTtcbn1cblxuZnVuY3Rpb24gcHJlc2VudFRvZ2dsZSgpIHtcbiAgICBpZiAoIXByZXNlbnRNb2RlSW5pdGlhbGl6ZWQpIHtcbiAgICAgICAgcHJlc2VudE1vZGVTZXR1cCgpO1xuICAgICAgICBwcmVzZW50TW9kZUluaXRpYWxpemVkID0gdHJ1ZTtcbiAgICB9XG4gICAgbGV0IGJvZCA9IGRvY3VtZW50LmJvZHk7XG4gICAgbGV0IHByZXNlbnRDbGFzcyA9IFwicHJlc2VudFwiO1xuICAgIGxldCBmdWxsSGVpZ2h0Q2xhc3MgPSBcImZ1bGwtaGVpZ2h0XCI7XG4gICAgbGV0IGJvdHRvbUNsYXNzID0gXCJib3R0b21cIjtcbiAgICBpZiAoYm9kLmNsYXNzTGlzdC5jb250YWlucyhwcmVzZW50Q2xhc3MpKSB7XG4gICAgICAgIGZvciAoY29uc3QgZWwgb2Ygc2VjdGlvbkNvbnRlbnQoKSkge1xuICAgICAgICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTsgLy9zaG93IGV2ZXJ5dGhpbmdcbiAgICAgICAgfVxuICAgICAgICBkb2N1bWVudFxuICAgICAgICAgICAgLmdldEVsZW1lbnRCeUlkKFwiY29tcGxldGlvbkJ1dHRvblwiKVxuICAgICAgICAgICAgPy5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xuICAgICAgICBib2QuY2xhc3NMaXN0LnJlbW92ZShwcmVzZW50Q2xhc3MpO1xuICAgICAgICBmb3IgKGNvbnN0IGVsIG9mIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuXCIgKyBmdWxsSGVpZ2h0Q2xhc3MpKSB7XG4gICAgICAgICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKGZ1bGxIZWlnaHRDbGFzcyk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCBlbCBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLlwiICsgYm90dG9tQ2xhc3MpKSB7XG4gICAgICAgICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKGJvdHRvbUNsYXNzKTtcbiAgICAgICAgfVxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInByZXNlbnRNb2RlXCIsIFwidGV4dFwiKTtcbiAgICAgICAgZm9yIChjb25zdCBleGVyY2lzZSBvZiBjb2RlRXhlcmNpc2VzKSB7XG4gICAgICAgICAgICBleGVyY2lzZS5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZm9yIChjb25zdCBlbCBvZiBzZWN0aW9uQ29udGVudCgpKSB7XG4gICAgICAgICAgICBlbC5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpOyAvLyBoaWRlIGV4dHJhbmVvdXMgc3R1ZmZcbiAgICAgICAgfVxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbXBsZXRpb25CdXR0b25cIik/LmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gICAgICAgIGJvZC5jbGFzc0xpc3QuYWRkKHByZXNlbnRDbGFzcyk7XG4gICAgICAgIGJvZC5jbGFzc0xpc3QuYWRkKGZ1bGxIZWlnaHRDbGFzcyk7XG4gICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc0xpc3QuYWRkKGZ1bGxIZWlnaHRDbGFzcyk7XG4gICAgICAgIGZvciAoY29uc3QgZWwgb2YgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcInNlY3Rpb24gLnJ1bmVzdG9uZVwiKSkge1xuICAgICAgICAgICAgZWwuY2xhc3NMaXN0LmFkZChmdWxsSGVpZ2h0Q2xhc3MpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3QgZWwgb2YgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5hYy1jYXB0aW9uXCIpKSB7XG4gICAgICAgICAgICBlbC5jbGFzc0xpc3QuYWRkKGJvdHRvbUNsYXNzKTtcbiAgICAgICAgfVxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInByZXNlbnRNb2RlXCIsIHByZXNlbnRDbGFzcyk7XG4gICAgICAgIGFjdGl2YXRlRXhlcmNpc2UoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHByZXNlbnRNb2RlU2V0dXAoKSB7XG4gICAgLy8gbW92ZWQgdGhpcyBvdXQgb2YgY29uZmlndXJlXG5cbiAgICAvLyB0aGlzIHN0aWxsIGxlYXZlcyBzb21lIHRoaW5ncyBzZW1pLW1lc3NlZCB1cCB3aGVuIHlvdSBleGl0IHByZXNlbnRlciBtb2RlLlxuICAgIC8vIGJ1dCBpbnN0cnVjdG9ycyB3aWxsIHByb2JhYmx5IGp1c3QgbGVhcm4gdG8gcmVmcmVzaCB0aGUgcGFnZS5cbiAgICBmb3IgKGNvbnN0IGNvbXBvbmVudCBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFxuICAgICAgICBcIltkYXRhLWNoaWxkY29tcG9uZW50XVwiLFxuICAgICkpIHtcbiAgICAgICAgY29tcG9uZW50LmNsYXNzTGlzdC5hZGQoXCJydW5lc3RvbmVcIik7XG4gICAgICAgIGNvbnN0IHBhcmVudERpdiA9IGNvbXBvbmVudC5wYXJlbnRFbGVtZW50Py5jbG9zZXN0KFwiZGl2XCIpO1xuICAgICAgICBpZiAocGFyZW50RGl2ICYmICFwYXJlbnREaXYubWF0Y2hlcyhcInNlY3Rpb25cIikpIHtcbiAgICAgICAgICAgIHBhcmVudERpdi5jbGFzc0xpc3QuYWRkKFwicnVuZXN0b25lXCIpO1xuICAgICAgICAgICAgcGFyZW50RGl2LnN0eWxlLm1heFdpZHRoID0gXCJub25lXCI7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcGFydHMgPSBjb21wb25lbnQucXVlcnlTZWxlY3RvckFsbChcIi5hY19jb2RlX2RpdiwgLmFjX291dHB1dFwiKTtcbiAgICAgICAgaWYgKHBhcnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgY29uc3QgYmxvY2sgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgYmxvY2suY2xhc3NOYW1lID0gXCJhYy1ibG9ja1wiO1xuICAgICAgICAgICAgYmxvY2suc3R5bGUud2lkdGggPSBcIjEwMCVcIjtcbiAgICAgICAgICAgIHBhcnRzWzBdLmJlZm9yZShibG9jayk7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHBhcnQgb2YgcGFydHMpIHtcbiAgICAgICAgICAgICAgICBibG9jay5hcHBlbmRDaGlsZChwYXJ0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZvciAoY29uc3QgaW1nIG9mIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJzZWN0aW9uIGltZ1wiKSkge1xuICAgICAgICBjb25zdCB3cmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgd3JhcHBlci5jbGFzc05hbWUgPSBcInJ1bmVzdG9uZVwiO1xuICAgICAgICBpbWcucmVwbGFjZVdpdGgod3JhcHBlcik7XG4gICAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoaW1nKTtcbiAgICB9XG4gICAgLy8gdG9wLWxldmVsIGV4ZXJjaXNlcyBvbmx5OiBza2lwIC5ydW5lc3RvbmUgbmVzdGVkIGluc2lkZSBhbm90aGVyXG4gICAgY29kZUV4ZXJjaXNlcyA9IFsuLi5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnJ1bmVzdG9uZVwiKV0uZmlsdGVyKFxuICAgICAgICAoZWwpID0+ICFlbC5wYXJlbnRFbGVtZW50LmNsb3Nlc3QoXCIucnVuZXN0b25lXCIpLFxuICAgICk7XG4gICAgZm9yIChjb25zdCBoZWFkaW5nIG9mIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJoMVwiKSkge1xuICAgICAgICBoZWFkaW5nLmluc2VydEFkamFjZW50SFRNTChcbiAgICAgICAgICAgIFwiYmVmb3JlYmVnaW5cIixcbiAgICAgICAgICAgIFwiPGRpdiBjbGFzcz0ncHJlc2VudGF0aW9uLXRpdGxlJz4gXFxcbiAgICAgICAgPGJ1dHRvbiBjbGFzcz0ncHJldi1leGVyY2lzZSBidG4tcHJlc2VudGVyIGJ0bi1ncmV5LW91dGxpbmUnIG9uY2xpY2s9J3ByZXZFeGVyY2lzZSgpJz5CYWNrPC9idXR0b24+IFxcXG4gICAgICAgIDxidXR0b24gY2xhc3M9J25leHQtZXhlcmNpc2UgYnRuLXByZXNlbnRlciBidG4tZ3JleS1zb2xpZCcgb25jbGljaz0nbmV4dEV4ZXJjaXNlKCknPk5leHQ8L2J1dHRvbj4gXFxcbiAgICAgIDwvZGl2PlwiLFxuICAgICAgICApO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZ2V0QWN0aXZlRXhlcmNpc2UoKSB7XG4gICAgcmV0dXJuIGNvZGVFeGVyY2lzZXMuZmlsdGVyKChlbCkgPT4gZWwuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYWN0aXZlXCIpKTtcbn1cblxuZnVuY3Rpb24gYWN0aXZhdGVFeGVyY2lzZShpbmRleCkge1xuICAgIGlmICh0eXBlb2YgaW5kZXggPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBpbmRleCA9IDA7XG4gICAgfVxuXG4gICAgaWYgKGNvZGVFeGVyY2lzZXMubGVuZ3RoKSB7XG4gICAgICAgIGZvciAoY29uc3QgZWwgb2YgZ2V0QWN0aXZlRXhlcmNpc2UoKSkge1xuICAgICAgICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBhY3RpdmUgPSBjb2RlRXhlcmNpc2VzW2luZGV4XTtcbiAgICAgICAgYWN0aXZlLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XG4gICAgICAgIGFjdGl2ZS5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xuICAgICAgICBmb3IgKGNvbnN0IGVsIG9mIGNvZGVFeGVyY2lzZXMpIHtcbiAgICAgICAgICAgIGlmIChlbCAhPT0gYWN0aXZlKSB7XG4gICAgICAgICAgICAgICAgZWwuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxud2luZG93Lm5leHRFeGVyY2lzZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgYWN0aXZlID0gZ2V0QWN0aXZlRXhlcmNpc2UoKVswXTtcbiAgICBsZXQgbmV4dEluZGV4ID0gY29kZUV4ZXJjaXNlcy5pbmRleE9mKGFjdGl2ZSkgKyAxO1xuICAgIGlmIChuZXh0SW5kZXggPCBjb2RlRXhlcmNpc2VzLmxlbmd0aCkge1xuICAgICAgICBhY3RpdmF0ZUV4ZXJjaXNlKG5leHRJbmRleCk7XG4gICAgfVxufTtcblxud2luZG93LnByZXZFeGVyY2lzZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgYWN0aXZlID0gZ2V0QWN0aXZlRXhlcmNpc2UoKVswXTtcbiAgICBsZXQgcHJldkluZGV4ID0gY29kZUV4ZXJjaXNlcy5pbmRleE9mKGFjdGl2ZSkgLSAxO1xuICAgIGlmIChwcmV2SW5kZXggPj0gMCkge1xuICAgICAgICBhY3RpdmF0ZUV4ZXJjaXNlKHByZXZJbmRleCk7XG4gICAgfVxufTtcblxuZnVuY3Rpb24gY29uZmlndXJlKCkge1xuICAgIGxldCByaWdodE5hdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubmF2YmFyLXJpZ2h0XCIpO1xuICAgIGlmICghcmlnaHROYXYpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByaWdodE5hdi5pbnNlcnRBZGphY2VudEhUTUwoXG4gICAgICAgIFwiYWZ0ZXJiZWdpblwiLFxuICAgICAgICBcIjxsaSBjbGFzcz0nZHJvcGRvd24gdmlldy10b2dnbGUnPiBcXFxuICAgICAgPGxhYmVsPlZpZXc6IFxcXG4gICAgICAgIDxzZWxlY3QgY2xhc3M9J21vZGUtc2VsZWN0Jz4gXFxcbiAgICAgICAgICA8b3B0aW9uIHZhbHVlPSd0ZXh0Jz5UZXh0Ym9vazwvb3B0aW9uPiBcXFxuICAgICAgICAgIDxvcHRpb24gdmFsdWU9J3ByZXNlbnQnPkNvZGUgUHJlc2VudGVyPC9vcHRpb24+IFxcXG4gICAgICAgIDwvc2VsZWN0PiBcXFxuICAgICAgPC9sYWJlbD4gXFxcbiAgICA8L2xpPlwiLFxuICAgICk7XG5cbiAgICBkb2N1bWVudFxuICAgICAgICAucXVlcnlTZWxlY3RvcihcIi5tb2RlLXNlbGVjdFwiKVxuICAgICAgICAuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCBwcmVzZW50VG9nZ2xlKTtcbn1cblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInJ1bmVzdG9uZTpsb2dpbi1jb21wbGV0ZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgLy8gaWYgdXNlciBpcyBpbnN0cnVjdG9yLCBlbmFibGUgcHJlc2VudGVyIG1vZGVcbiAgICBpZiAoZUJvb2tDb25maWcuaXNJbnN0cnVjdG9yKSB7XG4gICAgICAgIGNvbmZpZ3VyZSgpO1xuICAgIH1cbn0pO1xuIiwiLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIHxkb2NuYW1lfCAtIHNtYWxsIERPTSBoZWxwZXJzXG4gKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogSGVscGVycyB0aGF0IHJlcGxhY2UgY29tbW9uIGpRdWVyeSBpZGlvbXMgYXMgY29tcG9uZW50cyBhcmUgbWlncmF0ZWQgdG9cbiAqIHBsYWluIERPTSBBUElzLlxuICovXG5cbmNvbnN0IHJicmFjZSA9IC9eKD86XFx7W1xcd1xcV10qXFx9fFxcW1tcXHdcXFddKlxcXSkkLztcblxuLyoqXG4gKiBSZWFkIGEgZGF0YS0qIGF0dHJpYnV0ZSB3aXRoIHRoZSBzYW1lIHR5cGUgY29lcmNpb24galF1ZXJ5J3MgLmRhdGEoKVxuICogcGVyZm9ybWVkOiBcInRydWVcIi9cImZhbHNlXCIvXCJudWxsXCIgYmVjb21lIHRoZWlyIEpTIHZhbHVlcywgbnVtZXJpYyBzdHJpbmdzXG4gKiBiZWNvbWUgbnVtYmVycywgSlNPTi1sb29raW5nIHN0cmluZ3MgYXJlIHBhcnNlZCwgZXZlcnl0aGluZyBlbHNlIGlzXG4gKiByZXR1cm5lZCBhcyBhIHN0cmluZy4gUmV0dXJucyB1bmRlZmluZWQgd2hlbiB0aGUgYXR0cmlidXRlIGlzIGFic2VudC5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnRcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gdGhlIHBhcnQgb2YgdGhlIGF0dHJpYnV0ZSBuYW1lIGFmdGVyIFwiZGF0YS1cIlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RGF0YVZhbHVlKGVsZW1lbnQsIG5hbWUpIHtcbiAgICBjb25zdCBkYXRhID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoYGRhdGEtJHtuYW1lfWApO1xuICAgIGlmIChkYXRhID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGlmIChkYXRhID09PSBcInRydWVcIikgcmV0dXJuIHRydWU7XG4gICAgaWYgKGRhdGEgPT09IFwiZmFsc2VcIikgcmV0dXJuIGZhbHNlO1xuICAgIGlmIChkYXRhID09PSBcIm51bGxcIikgcmV0dXJuIG51bGw7XG4gICAgLy8gT25seSBjb252ZXJ0IHRvIGEgbnVtYmVyIGlmIGl0IGRvZXNuJ3QgY2hhbmdlIHRoZSBzdHJpbmcuXG4gICAgaWYgKGRhdGEgPT09ICtkYXRhICsgXCJcIikgcmV0dXJuICtkYXRhO1xuICAgIGlmIChyYnJhY2UudGVzdChkYXRhKSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UoZGF0YSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBkYXRhO1xufVxuXG4vKipcbiAqIFNob3cgb3IgaGlkZSBhbiBlbGVtZW50IGJ5IHRvZ2dsaW5nIGlubGluZSBkaXNwbGF5LCBsaWtlIGpRdWVyeSdzIC50b2dnbGUoKS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRvZ2dsZURpc3BsYXkoZWxlbWVudCkge1xuICAgIGlmICghZWxlbWVudCkgcmV0dXJuO1xuICAgIGlmIChpc0hpZGRlbihlbGVtZW50KSkge1xuICAgICAgICBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPSBcIlwiO1xuICAgICAgICBpZiAoaXNIaWRkZW4oZWxlbWVudCkpIHtcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gaXNIaWRkZW4oZWxlbWVudCkge1xuICAgIGlmIChlbGVtZW50LnN0eWxlLmRpc3BsYXkgPT09IFwibm9uZVwiKSByZXR1cm4gdHJ1ZTtcbiAgICBjb25zdCB3aW4gPSBlbGVtZW50Lm93bmVyRG9jdW1lbnQuZGVmYXVsdFZpZXc7XG4gICAgcmV0dXJuIHdpbi5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpLmRpc3BsYXkgPT09IFwibm9uZVwiO1xufVxuXG4vKipcbiAqIFdpZHRoIG9mIGFuIGVsZW1lbnQgaW5jbHVkaW5nIG1hcmdpbnMsIGxpa2UgalF1ZXJ5J3MgLm91dGVyV2lkdGgodHJ1ZSkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBvdXRlcldpZHRoKGVsZW1lbnQpIHtcbiAgICBjb25zdCBzdHlsZSA9IGdldENvbXB1dGVkU3R5bGUoZWxlbWVudCk7XG4gICAgcmV0dXJuIChcbiAgICAgICAgZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCArXG4gICAgICAgIChwYXJzZUZsb2F0KHN0eWxlLm1hcmdpbkxlZnQpIHx8IDApICtcbiAgICAgICAgKHBhcnNlRmxvYXQoc3R5bGUubWFyZ2luUmlnaHQpIHx8IDApXG4gICAgKTtcbn1cblxuLyoqXG4gKiBIZWlnaHQgb2YgYW4gZWxlbWVudCBpbmNsdWRpbmcgbWFyZ2lucywgbGlrZSBqUXVlcnkncyAub3V0ZXJIZWlnaHQodHJ1ZSkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBvdXRlckhlaWdodChlbGVtZW50KSB7XG4gICAgY29uc3Qgc3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpO1xuICAgIHJldHVybiAoXG4gICAgICAgIGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0ICtcbiAgICAgICAgKHBhcnNlRmxvYXQoc3R5bGUubWFyZ2luVG9wKSB8fCAwKSArXG4gICAgICAgIChwYXJzZUZsb2F0KHN0eWxlLm1hcmdpbkJvdHRvbSkgfHwgMClcbiAgICApO1xufVxuXG4vLyBQcm9wZXJ0aWVzIHRoYXQgdGFrZSBhIGJhcmUgbnVtYmVyIHJhdGhlciB0aGFuIGEgcHggbGVuZ3RoLlxuY29uc3QgdW5pdGxlc3MgPSBuZXcgU2V0KFtcIm9wYWNpdHlcIiwgXCJ6SW5kZXhcIiwgXCJmb250V2VpZ2h0XCJdKTtcblxuY29uc3Qga2ViYWIgPSAvLShbYS16XSkvZztcbmNvbnN0IGNhbWVsQ2FzZSA9IChuYW1lKSA9PiBuYW1lLnJlcGxhY2Uoa2ViYWIsIChtLCBjKSA9PiBjLnRvVXBwZXJDYXNlKCkpO1xuXG5mdW5jdGlvbiBwYXJzZUNvbG9yKHZhbHVlKSB7XG4gICAgaWYgKCF2YWx1ZSkgcmV0dXJuIG51bGw7XG4gICAgbGV0IG0gPSB2YWx1ZS5tYXRjaCgvXiMoWzAtOWEtZl17M30pJC9pKTtcbiAgICBpZiAobSkge1xuICAgICAgICByZXR1cm4gWy4uLm1bMV1dLm1hcCgoYykgPT4gcGFyc2VJbnQoYyArIGMsIDE2KSk7XG4gICAgfVxuICAgIG0gPSB2YWx1ZS5tYXRjaCgvXiMoWzAtOWEtZl17Nn0pJC9pKTtcbiAgICBpZiAobSkge1xuICAgICAgICByZXR1cm4gWzAsIDIsIDRdLm1hcCgoaSkgPT4gcGFyc2VJbnQobVsxXS5zbGljZShpLCBpICsgMiksIDE2KSk7XG4gICAgfVxuICAgIG0gPSB2YWx1ZS5tYXRjaCgvXnJnYmE/XFwoKFxcZCspLFxccyooXFxkKyksXFxzKihcXGQrKS8pO1xuICAgIGlmIChtKSB7XG4gICAgICAgIHJldHVybiBbK21bMV0sICttWzJdLCArbVszXV07XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xufVxuXG4vKipcbiAqIEEgcmVxdWVzdEFuaW1hdGlvbkZyYW1lIHR3ZWVuIGNvdmVyaW5nIHRoZSBzdWJzZXQgb2YgalF1ZXJ5J3MgLmFuaW1hdGUoKVxuICogdGhlIGNvbXBvbmVudHMgdXNlOiBudW1lcmljIENTUyBwcm9wZXJ0aWVzIChweCwgb3IgYmFyZSBmb3Igb3BhY2l0eS1saWtlXG4gKiBwcm9wZXJ0aWVzKSBhbmQgY29sb3JzLCBwbHVzIHN0YXJ0L3Byb2dyZXNzL2NvbXBsZXRlIGNhbGxiYWNrcy4gcHJvZ3Jlc3NcbiAqIHJlY2VpdmVzIHRoZSAwLi4xIGZyYWN0aW9uIGFzIGl0cyBzZWNvbmQgYXJndW1lbnQsIG1hdGNoaW5nIHRoZSBqUXVlcnlcbiAqIGNhbGxiYWNrIHNoYXBlIHVzZWQgYnkgZXhpc3RpbmcgY2FsbGVycy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFuaW1hdGUoZWxlbWVudCwgcHJvcGVydGllcywgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgZHVyYXRpb24gPSBvcHRpb25zLmR1cmF0aW9uID8/IDQwMDtcbiAgICBjb25zdCBjb21wdXRlZCA9IGdldENvbXB1dGVkU3R5bGUoZWxlbWVudCk7XG4gICAgY29uc3QgdHdlZW5zID0gW107XG4gICAgZm9yIChjb25zdCBbbmFtZSwgdGFyZ2V0XSBvZiBPYmplY3QuZW50cmllcyhwcm9wZXJ0aWVzKSkge1xuICAgICAgICBjb25zdCBwcm9wID0gY2FtZWxDYXNlKG5hbWUpO1xuICAgICAgICBpZiAodHlwZW9mIHRhcmdldCA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgY29uc3QgZnJvbSA9IHBhcnNlRmxvYXQoY29tcHV0ZWRbcHJvcF0pIHx8IDA7XG4gICAgICAgICAgICBjb25zdCB1bml0ID0gdW5pdGxlc3MuaGFzKHByb3ApID8gXCJcIiA6IFwicHhcIjtcbiAgICAgICAgICAgIHR3ZWVucy5wdXNoKChwKSA9PiB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZVtwcm9wXSA9IGZyb20gKyAodGFyZ2V0IC0gZnJvbSkgKiBwICsgdW5pdDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgZnJvbUNvbG9yID0gcGFyc2VDb2xvcihjb21wdXRlZFtwcm9wXSk7XG4gICAgICAgICAgICBjb25zdCB0b0NvbG9yID0gcGFyc2VDb2xvcih0YXJnZXQpO1xuICAgICAgICAgICAgaWYgKGZyb21Db2xvciAmJiB0b0NvbG9yKSB7XG4gICAgICAgICAgICAgICAgdHdlZW5zLnB1c2goKHApID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbWl4ZWQgPSBmcm9tQ29sb3IubWFwKChmLCBpKSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5yb3VuZChmICsgKHRvQ29sb3JbaV0gLSBmKSAqIHApLFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlW3Byb3BdID0gYHJnYigke21peGVkLmpvaW4oXCIsIFwiKX0pYDtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gTm90IGludGVycG9sYXRhYmxlOyBqdXN0IGFwcGx5IHRoZSBmaW5hbCB2YWx1ZSBhdCB0aGUgZW5kLlxuICAgICAgICAgICAgICAgIHR3ZWVucy5wdXNoKChwKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwID09PSAxKSBlbGVtZW50LnN0eWxlW3Byb3BdID0gdGFyZ2V0O1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChvcHRpb25zLnN0YXJ0KSBvcHRpb25zLnN0YXJ0KCk7XG4gICAgY29uc3QgdDAgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICBmdW5jdGlvbiBzdGVwKG5vdykge1xuICAgICAgICBjb25zdCBwID0gTWF0aC5taW4oMSwgKG5vdyAtIHQwKSAvIGR1cmF0aW9uKTtcbiAgICAgICAgZm9yIChjb25zdCB0d2VlbiBvZiB0d2VlbnMpIHR3ZWVuKHApO1xuICAgICAgICBpZiAob3B0aW9ucy5wcm9ncmVzcykgb3B0aW9ucy5wcm9ncmVzcyhudWxsLCBwLCBudWxsKTtcbiAgICAgICAgaWYgKHAgPCAxKSB7XG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc3RlcCk7XG4gICAgICAgIH0gZWxzZSBpZiAob3B0aW9ucy5jb21wbGV0ZSkge1xuICAgICAgICAgICAgb3B0aW9ucy5jb21wbGV0ZSgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShzdGVwKTtcbn1cblxuLyoqXG4gKiBFc2NhcGUgYSB2YWx1ZSBmb3IgaW50ZXJwb2xhdGlvbiBpbnRvIGFuIEhUTUwgc3RyaW5nLiBVc2UgdGhpcyAob3JcbiAqIHRleHRDb250ZW50KSBmb3IgYW55dGhpbmcgYSB1c2VyIG9yIHRoZSBzZXJ2ZXIgbWF5IGhhdmUgc3VwcGxpZWQgLS1cbiAqIHN0dWRlbnQgYW5zd2VycywgbmFtZXMsIGZpbGVuYW1lcywgcHJvZ3JhbSBvdXRwdXQuXG4gKlxuICogQHBhcmFtIHsqfSBzdHIgLSBjb252ZXJ0ZWQgd2l0aCBTdHJpbmcoKTsgbnVsbC91bmRlZmluZWQgYmVjb21lIFwiXCJcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBlc2NhcGVIdG1sKHN0cikge1xuICAgIGlmIChzdHIgPT09IG51bGwgfHwgc3RyID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfVxuICAgIHJldHVybiBTdHJpbmcoc3RyKVxuICAgICAgICAucmVwbGFjZSgvJi9nLCBcIiZhbXA7XCIpXG4gICAgICAgIC5yZXBsYWNlKC88L2csIFwiJmx0O1wiKVxuICAgICAgICAucmVwbGFjZSgvPi9nLCBcIiZndDtcIilcbiAgICAgICAgLnJlcGxhY2UoLycvZywgXCImI3gyNztcIilcbiAgICAgICAgLnJlcGxhY2UoL1wiL2csIFwiJnF1b3Q7XCIpO1xufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBqUXVlcnk7IiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLyogUGFnZS1jb21wbGV0aW9uIHRyYWNraW5nOiB0aGUgXCJNYXJrIGFzIENvbXBsZXRlZFwiIGJ1dHRvbiwgdGhlIGxhc3QtcGFnZVxuICogYm9va21hcmssIGFuZCB0aGUgdGFibGUtb2YtY29udGVudHMgcHJvZ3Jlc3MgZGVjb3JhdGlvbnMuIChUaGUgZmlsZSBuYW1lXG4gKiBpcyBoaXN0b3JpY2FsLikgKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCB7IG91dGVyV2lkdGgsIGFuaW1hdGUgfSBmcm9tIFwiLi9kb211dGlsLmpzXCI7XG5pbXBvcnQgeyBpc1N1YmNoYXB0ZXJQYWdlIH0gZnJvbSBcIi4vYm9va2Z1bmNzLmpzXCI7XG5pbXBvcnQgXCIuLi9jc3MvdXNlci1oaWdobGlnaHRzLmNzc1wiO1xuXG4vKlxuICogR0VUIGEgc2VydmVyIGVuZHBvaW50IHRoYXQgYW5zd2VycyBlaXRoZXIgSlNPTiBvciB0aGUgbGl0ZXJhbCBzdHJpbmdcbiAqIFwiTm9uZVwiLiBSZXR1cm5zIHRoZSBwYXJzZWQgSlNPTiBvciBudWxsLlxuICovXG5hc3luYyBmdW5jdGlvbiBmZXRjaEpzb24odXJsLCBwYXJhbXMpIHtcbiAgICBsZXQgZnVsbFVybCA9IHBhcmFtcyA/IGAke3VybH0/JHtuZXcgVVJMU2VhcmNoUGFyYW1zKHBhcmFtcyl9YCA6IHVybDtcbiAgICB0cnkge1xuICAgICAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChmdWxsVXJsKTtcbiAgICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJSZXF1ZXN0IEZhaWxlZCBmb3IgXCIgKyBmdWxsVXJsKTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGxldCB0ZXh0ID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xuICAgICAgICBpZiAodGV4dCA9PSBcIk5vbmVcIiB8fCB0ZXh0ID09PSBcIlwiKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZSh0ZXh0KTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJSZXF1ZXN0IEZhaWxlZCBmb3IgXCIgKyBmdWxsVXJsKTtcbiAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBnZXRDb21wbGV0aW9ucygpIHtcbiAgICAvLyBHZXQgdGhlIGNvbXBsZXRpb24gc3RhdHVzXG4gICAgdmFyIGN1cnJlbnRQYXRobmFtZSA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZTtcbiAgICBpZiAoY3VycmVudFBhdGhuYW1lLmluZGV4T2YoXCI/XCIpICE9PSAtMSkge1xuICAgICAgICBjdXJyZW50UGF0aG5hbWUgPSBjdXJyZW50UGF0aG5hbWUuc3Vic3RyaW5nKFxuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIGN1cnJlbnRQYXRobmFtZS5sYXN0SW5kZXhPZihcIj9cIiksXG4gICAgICAgICk7XG4gICAgfVxuICAgIHZhciBkYXRhID0gYXdhaXQgZmV0Y2hKc29uKFxuICAgICAgICBgJHtlQm9va0NvbmZpZy5uZXdfc2VydmVyX3ByZWZpeH0vbG9nZ2VyL2dldENvbXBsZXRpb25TdGF0dXNgLFxuICAgICAgICB7XG4gICAgICAgICAgICBsYXN0UGFnZVVybDogY3VycmVudFBhdGhuYW1lLFxuICAgICAgICAgICAgaXNQdHhCb29rOiBpc1ByZVRlWHQoKSxcbiAgICAgICAgfSxcbiAgICApO1xuICAgIGlmIChkYXRhKSB7XG4gICAgICAgIHZhciBjb21wbGV0aW9uRGF0YSA9IGRhdGEuZGV0YWlsO1xuICAgICAgICB2YXIgY29tcGxldGlvbkNsYXNzLCBjb21wbGV0aW9uTXNnO1xuICAgICAgICBpZiAoY29tcGxldGlvbkRhdGFbMF0uY29tcGxldGlvblN0YXR1cyA9PSAxKSB7XG4gICAgICAgICAgICBjb21wbGV0aW9uQ2xhc3MgPSBcImJ1dHRvbkNvbmZpcm1Db21wbGV0aW9uXCI7XG4gICAgICAgICAgICBjb21wbGV0aW9uTXNnID1cbiAgICAgICAgICAgICAgICBcIjxpIGNsYXNzPSdnbHlwaGljb24gZ2x5cGhpY29uLW9rJz48L2k+IENvbXBsZXRlZC4gV2VsbCBEb25lIVwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29tcGxldGlvbkNsYXNzID0gXCJidXR0b25Bc2tDb21wbGV0aW9uXCI7XG4gICAgICAgICAgICBjb21wbGV0aW9uTXNnID0gXCJNYXJrIGFzIENvbXBsZXRlZFwiO1xuICAgICAgICB9XG4gICAgICAgIGxldCBzY3AgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3NjcHJvZ3Jlc3Njb250YWluZXJcIik7XG4gICAgICAgIGlmIChzY3ApIHtcbiAgICAgICAgICAgIHNjcC5jbGFzc0xpc3QuYWRkKFwicHR4LXJ1bmVzdG9uZS1jb250YWluZXJcIik7XG4gICAgICAgICAgICBzY3AuaW5zZXJ0QWRqYWNlbnRIVE1MKFxuICAgICAgICAgICAgICAgIFwiYmVmb3JlZW5kXCIsXG4gICAgICAgICAgICAgICAgJzxkaXYgc3R5bGU9XCJ0ZXh0LWFsaWduOmNlbnRlclwiPjxidXR0b24gY2xhc3M9XCJidG4gYnRuLWxnICcgK1xuICAgICAgICAgICAgICAgICAgICBjb21wbGV0aW9uQ2xhc3MgK1xuICAgICAgICAgICAgICAgICAgICAnXCIgaWQ9XCJjb21wbGV0aW9uQnV0dG9uXCI+JyArXG4gICAgICAgICAgICAgICAgICAgIGNvbXBsZXRpb25Nc2cgK1xuICAgICAgICAgICAgICAgICAgICBcIjwvYnV0dG9uPjwvZGl2PlwiLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gc2hvd0xhc3RQb3NpdGlvbkJhbm5lcigpIHtcbiAgICB2YXIgbGFzdFBvc2l0aW9uVmFsID0gZ2V0VXJsVmFyKFwibGFzdFBvc2l0aW9uXCIpO1xuICAgIGlmIChsYXN0UG9zaXRpb25WYWwgIT09IG51bGwpIHtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5pbnNlcnRBZGphY2VudEhUTUwoXG4gICAgICAgICAgICBcImJlZm9yZWVuZFwiLFxuICAgICAgICAgICAgJzxpbWcgc3JjPVwiLi4vX3N0YXRpYy9sYXN0LXBvaW50LnBuZ1wiIHN0eWxlPVwicG9zaXRpb246YWJzb2x1dGU7IHBhZGRpbmctdG9wOjU1cHg7IGxlZnQ6IDEwcHg7IHRvcDogJyArXG4gICAgICAgICAgICAgICAgcGFyc2VJbnQobGFzdFBvc2l0aW9uVmFsKSArXG4gICAgICAgICAgICAgICAgJ3B4O1wiLz4nLFxuICAgICAgICApO1xuICAgICAgICB3aW5kb3cuc2Nyb2xsVG8oe1xuICAgICAgICAgICAgdG9wOiBwYXJzZUludChsYXN0UG9zaXRpb25WYWwpLFxuICAgICAgICAgICAgYmVoYXZpb3I6IFwic21vb3RoXCIsXG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gYWRkTmF2aWdhdGlvbkFuZENvbXBsZXRpb25CdXR0b25zKCkge1xuICAgIHZhciBjb21wbGV0aW9uQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb21wbGV0aW9uQnV0dG9uXCIpO1xuICAgIHZhciBuYXZMaW5rQmdSaWdodCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmF2TGlua0JnUmlnaHRcIik7XG4gICAgdmFyIG5hdkxpbmtCZ0xlZnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5hdkxpbmtCZ0xlZnRcIik7XG4gICAgdmFyIHJlbGF0aW9uc05leHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlbGF0aW9ucy1uZXh0XCIpO1xuICAgIHZhciBuYXZMaW5rQmdSaWdodEhpZGRlblBvc2l0aW9uID0gbmF2TGlua0JnUmlnaHRcbiAgICAgICAgPyAtb3V0ZXJXaWR0aChuYXZMaW5rQmdSaWdodCkgLSA1XG4gICAgICAgIDogLTU7XG4gICAgdmFyIG5hdkxpbmtCZ1JpZ2h0SGFsZk9wZW47XG4gICAgdmFyIG5hdkxpbmtCZ1JpZ2h0RnVsbE9wZW4gPSAwO1xuXG4gICAgaWYgKGNvbXBsZXRpb25CdXR0b24/LmNsYXNzTGlzdC5jb250YWlucyhcImJ1dHRvbkFza0NvbXBsZXRpb25cIikpIHtcbiAgICAgICAgbmF2TGlua0JnUmlnaHRIYWxmT3BlbiA9IG5hdkxpbmtCZ1JpZ2h0SGlkZGVuUG9zaXRpb24gKyA3MDtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgICBjb21wbGV0aW9uQnV0dG9uPy5jbGFzc0xpc3QuY29udGFpbnMoXCJidXR0b25Db25maXJtQ29tcGxldGlvblwiKVxuICAgICkge1xuICAgICAgICBuYXZMaW5rQmdSaWdodEhhbGZPcGVuID0gMDtcbiAgICB9XG4gICAgdmFyIHJlbGF0aW9uc05leHRJY29uSW5pdGlhbFBvc2l0aW9uID0gcmVsYXRpb25zTmV4dFxuICAgICAgICA/IGdldENvbXB1dGVkU3R5bGUocmVsYXRpb25zTmV4dCkucmlnaHRcbiAgICAgICAgOiBcIjBweFwiO1xuICAgIHZhciByZWxhdGlvbnNOZXh0SWNvbk5ld1Bvc2l0aW9uID0gLShuYXZMaW5rQmdSaWdodEhpZGRlblBvc2l0aW9uICsgMzUpO1xuXG4gICAgaWYgKG5hdkxpbmtCZ1JpZ2h0KSB7XG4gICAgICAgIG5hdkxpbmtCZ1JpZ2h0LnN0eWxlLnJpZ2h0ID0gbmF2TGlua0JnUmlnaHRIaWRkZW5Qb3NpdGlvbiArIFwicHhcIjtcbiAgICAgICAgbmF2TGlua0JnUmlnaHQuc3R5bGUuZGlzcGxheSA9IFwiXCI7XG4gICAgICAgIHZhciBuYXZCZ1Nob3duID0gZmFsc2U7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICB3aW5kb3cuc2Nyb2xsWSArIHdpbmRvdy5pbm5lckhlaWdodCA+PVxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxIZWlnaHRcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIGFuaW1hdGUoXG4gICAgICAgICAgICAgICAgICAgIG5hdkxpbmtCZ1JpZ2h0LFxuICAgICAgICAgICAgICAgICAgICB7IHJpZ2h0OiBuYXZMaW5rQmdSaWdodEhhbGZPcGVuIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgZHVyYXRpb246IDIwMCB9LFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgaWYgKG5hdkxpbmtCZ0xlZnQpIHtcbiAgICAgICAgICAgICAgICAgICAgYW5pbWF0ZShuYXZMaW5rQmdMZWZ0LCB7IGxlZnQ6IDAgfSwgeyBkdXJhdGlvbjogMjAwIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgIHJlbGF0aW9uc05leHQgJiZcbiAgICAgICAgICAgICAgICAgICAgY29tcGxldGlvbkJ1dHRvbj8uY2xhc3NMaXN0LmNvbnRhaW5zKFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJidXR0b25Db25maXJtQ29tcGxldGlvblwiLFxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIGFuaW1hdGUoXG4gICAgICAgICAgICAgICAgICAgICAgICByZWxhdGlvbnNOZXh0LFxuICAgICAgICAgICAgICAgICAgICAgICAgeyByaWdodDogcmVsYXRpb25zTmV4dEljb25OZXdQb3NpdGlvbiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgeyBkdXJhdGlvbjogMjAwIH0sXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG5hdkJnU2hvd24gPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChuYXZCZ1Nob3duKSB7XG4gICAgICAgICAgICAgICAgYW5pbWF0ZShcbiAgICAgICAgICAgICAgICAgICAgbmF2TGlua0JnUmlnaHQsXG4gICAgICAgICAgICAgICAgICAgIHsgcmlnaHQ6IG5hdkxpbmtCZ1JpZ2h0SGlkZGVuUG9zaXRpb24gfSxcbiAgICAgICAgICAgICAgICAgICAgeyBkdXJhdGlvbjogMjAwIH0sXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBpZiAobmF2TGlua0JnTGVmdCkge1xuICAgICAgICAgICAgICAgICAgICBhbmltYXRlKG5hdkxpbmtCZ0xlZnQsIHsgbGVmdDogLTY1IH0sIHsgZHVyYXRpb246IDIwMCB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHJlbGF0aW9uc05leHQpIHtcbiAgICAgICAgICAgICAgICAgICAgYW5pbWF0ZShyZWxhdGlvbnNOZXh0LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICByaWdodDogcmVsYXRpb25zTmV4dEljb25Jbml0aWFsUG9zaXRpb24sXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBuYXZCZ1Nob3duID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHZhciBjb21wbGV0aW9uRmxhZyA9IDA7XG4gICAgaWYgKGNvbXBsZXRpb25CdXR0b24/LmNsYXNzTGlzdC5jb250YWlucyhcImJ1dHRvbkFza0NvbXBsZXRpb25cIikpIHtcbiAgICAgICAgY29tcGxldGlvbkZsYWcgPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbXBsZXRpb25GbGFnID0gMTtcbiAgICB9XG4gICAgLy8gTWFrZSBzdXJlIHdlIG1hcmsgdGhpcyBwYWdlIGFzIHZpc2l0ZWQgcmVnYXJkbGVzcyBvZiBob3cgZmxha2V5XG4gICAgLy8gdGhlIG9udW5sb2FkIGhhbmRsZXJzIGJlY29tZS5cbiAgICBwcm9jZXNzUGFnZVN0YXRlKGNvbXBsZXRpb25GbGFnLCB0cnVlLCBmYWxzZSwgZmFsc2UpO1xuICAgIGNvbXBsZXRpb25CdXR0b24/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBtYXJraW5nQ29tcGxldGUgPSBmYWxzZTtcbiAgICAgICAgdmFyIG1hcmtpbmdJbmNvbXBsZXRlID0gZmFsc2U7XG4gICAgICAgIGlmIChjb21wbGV0aW9uQnV0dG9uLmNsYXNzTGlzdC5jb250YWlucyhcImJ1dHRvbkFza0NvbXBsZXRpb25cIikpIHtcbiAgICAgICAgICAgIGNvbXBsZXRpb25CdXR0b24uY2xhc3NMaXN0LnJlbW92ZShcImJ1dHRvbkFza0NvbXBsZXRpb25cIik7XG4gICAgICAgICAgICBjb21wbGV0aW9uQnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJidXR0b25Db25maXJtQ29tcGxldGlvblwiKTtcbiAgICAgICAgICAgIGNvbXBsZXRpb25CdXR0b24uaW5uZXJIVE1MID1cbiAgICAgICAgICAgICAgICBcIjxpIGNsYXNzPSdnbHlwaGljb24gZ2x5cGhpY29uLW9rJz48L2k+IENvbXBsZXRlZC4gV2VsbCBEb25lIVwiO1xuICAgICAgICAgICAgaWYgKG5hdkxpbmtCZ1JpZ2h0KSB7XG4gICAgICAgICAgICAgICAgYW5pbWF0ZShuYXZMaW5rQmdSaWdodCwgeyByaWdodDogbmF2TGlua0JnUmlnaHRGdWxsT3BlbiB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChyZWxhdGlvbnNOZXh0KSB7XG4gICAgICAgICAgICAgICAgYW5pbWF0ZShyZWxhdGlvbnNOZXh0LCB7XG4gICAgICAgICAgICAgICAgICAgIHJpZ2h0OiByZWxhdGlvbnNOZXh0SWNvbk5ld1Bvc2l0aW9uLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbmF2TGlua0JnUmlnaHRIYWxmT3BlbiA9IDA7XG4gICAgICAgICAgICBjb21wbGV0aW9uRmxhZyA9IDE7XG4gICAgICAgICAgICBtYXJraW5nQ29tcGxldGUgPSB0cnVlO1xuICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgY29tcGxldGlvbkJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoXCJidXR0b25Db25maXJtQ29tcGxldGlvblwiKVxuICAgICAgICApIHtcbiAgICAgICAgICAgIGNvbXBsZXRpb25CdXR0b24uY2xhc3NMaXN0LnJlbW92ZShcImJ1dHRvbkNvbmZpcm1Db21wbGV0aW9uXCIpO1xuICAgICAgICAgICAgY29tcGxldGlvbkJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwiYnV0dG9uQXNrQ29tcGxldGlvblwiKTtcbiAgICAgICAgICAgIGNvbXBsZXRpb25CdXR0b24uaW5uZXJIVE1MID0gXCJNYXJrIGFzIENvbXBsZXRlZFwiO1xuICAgICAgICAgICAgbmF2TGlua0JnUmlnaHRIYWxmT3BlbiA9IG5hdkxpbmtCZ1JpZ2h0SGlkZGVuUG9zaXRpb24gKyA3MDtcbiAgICAgICAgICAgIGlmIChuYXZMaW5rQmdSaWdodCkge1xuICAgICAgICAgICAgICAgIGFuaW1hdGUobmF2TGlua0JnUmlnaHQsIHsgcmlnaHQ6IG5hdkxpbmtCZ1JpZ2h0SGFsZk9wZW4gfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocmVsYXRpb25zTmV4dCkge1xuICAgICAgICAgICAgICAgIGFuaW1hdGUocmVsYXRpb25zTmV4dCwge1xuICAgICAgICAgICAgICAgICAgICByaWdodDogcmVsYXRpb25zTmV4dEljb25Jbml0aWFsUG9zaXRpb24sXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb21wbGV0aW9uRmxhZyA9IDA7XG4gICAgICAgICAgICBtYXJraW5nSW5jb21wbGV0ZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcHJvY2Vzc1BhZ2VTdGF0ZShcbiAgICAgICAgICAgIGNvbXBsZXRpb25GbGFnLFxuICAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgICBtYXJraW5nQ29tcGxldGUsXG4gICAgICAgICAgICBtYXJraW5nSW5jb21wbGV0ZSxcbiAgICAgICAgKTtcbiAgICB9KTtcbn1cblxuLy8gXyBkZWNvcmF0ZVRhYmxlT2ZDb250ZW50c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuYXN5bmMgZnVuY3Rpb24gZGVjb3JhdGVUYWJsZU9mQ29udGVudHMoKSB7XG4gICAgaWYgKFxuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZi50b0xvd2VyQ2FzZSgpLmluZGV4T2YoXCJ0b2MuaHRtbFwiKSAhPSAtMSB8fFxuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZi50b0xvd2VyQ2FzZSgpLmluZGV4T2YoXCJpbmRleC5odG1sXCIpICE9IC0xIHx8XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihcImZyb250bWF0dGVyXCIpICE9IC0xXG4gICAgKSB7XG4gICAgICAgIGlmICghaXNQcmVUZVh0KCkpIHtcbiAgICAgICAgICAgIGxldCBkYXRhID0gYXdhaXQgZmV0Y2hKc29uKFxuICAgICAgICAgICAgICAgIGAke2VCb29rQ29uZmlnLm5ld19zZXJ2ZXJfcHJlZml4fS9sb2dnZXIvZ2V0QWxsQ29tcGxldGlvblN0YXR1c2AsXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgaWYgKGRhdGEpIHtcbiAgICAgICAgICAgICAgICBsZXQgc3ViQ2hhcHRlckxpc3QgPSBkYXRhLmRldGFpbDtcbiAgICAgICAgICAgICAgICBsZXQgYWxsU3ViQ2hhcHRlclVSTHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFxuICAgICAgICAgICAgICAgICAgICBcIiNtYWluLWNvbnRlbnQgZGl2IGxpIGFcIixcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGl0ZW0gb2Ygc3ViQ2hhcHRlckxpc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgcyA9IDA7IHMgPCBhbGxTdWJDaGFwdGVyVVJMcy5sZW5ndGg7IHMrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsbFN1YkNoYXB0ZXJVUkxzW3NdLmhyZWYuaW5kZXhPZihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5jaGFwdGVyTmFtZSArIFwiL1wiICsgaXRlbS5zdWJDaGFwdGVyTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApICE9IC0xXG4gICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5jb21wbGV0aW9uU3RhdHVzID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVjb3JhdGVUb2NFbnRyeShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsbFN1YkNoYXB0ZXJVUkxzW3NdLnBhcmVudEVsZW1lbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNvbXBsZXRlZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJpbmZvVGV4dENvbXBsZXRlZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCItIENvbXBsZXRlZCB0aGlzIHRvcGljIG9uIFwiICsgaXRlbS5lbmREYXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaXRlbS5jb21wbGV0aW9uU3RhdHVzID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVjb3JhdGVUb2NFbnRyeShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsbFN1YkNoYXB0ZXJVUkxzW3NdLnBhcmVudEVsZW1lbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFjdGl2ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJpbmZvVGV4dEFjdGl2ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJMYXN0IHJlYWQgdGhpcyB0b3BpYyBvbiBcIiArIGl0ZW0uZW5kRGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGxhc3RQYWdlID0gYXdhaXQgZmV0Y2hKc29uKFxuICAgICAgICAgICAgYCR7ZUJvb2tDb25maWcubmV3X3NlcnZlcl9wcmVmaXh9L2xvZ2dlci9nZXRsYXN0cGFnZWAsXG4gICAgICAgICAgICB7IGNvdXJzZTogZUJvb2tDb25maWcuY291cnNlIH0sXG4gICAgICAgICk7XG4gICAgICAgIGlmIChsYXN0UGFnZSkge1xuICAgICAgICAgICAgbGV0IGxhc3RQYWdlRGF0YSA9IGxhc3RQYWdlLmRldGFpbDtcbiAgICAgICAgICAgIGlmIChsYXN0UGFnZURhdGEubGFzdFBhZ2VDaGFwdGVyICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBsZXQgY29udGludWVSZWFkaW5nID1cbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb250aW51ZS1yZWFkaW5nXCIpO1xuICAgICAgICAgICAgICAgIGlmIChjb250aW51ZVJlYWRpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWVSZWFkaW5nLnN0eWxlLmRpc3BsYXkgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZVJlYWRpbmcuaW5uZXJIVE1MID1cbiAgICAgICAgICAgICAgICAgICAgICAgICc8ZGl2IGlkPVwianVtcC10by1jaGFwdGVyXCIgY2xhc3M9XCJhbGVydCBhbGVydC1pbmZvXCIgPjxzdHJvbmc+WW91IHdlcmUgTGFzdCBSZWFkaW5nOjwvc3Ryb25nPiAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RQYWdlRGF0YS5sYXN0UGFnZUNoYXB0ZXIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgKGxhc3RQYWdlRGF0YS5sYXN0UGFnZVN1YmNoYXB0ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IFwiICZndDsgXCIgKyBsYXN0UGFnZURhdGEubGFzdFBhZ2VTdWJjaGFwdGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBcIlwiKSArXG4gICAgICAgICAgICAgICAgICAgICAgICAnIDxhIGhyZWY9XCInICtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RQYWdlRGF0YS5sYXN0UGFnZVVybCArXG4gICAgICAgICAgICAgICAgICAgICAgICBcIj9sYXN0UG9zaXRpb249XCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgbGFzdFBhZ2VEYXRhLmxhc3RQYWdlU2Nyb2xsTG9jYXRpb24gK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ1wiPkNvbnRpbnVlIFJlYWRpbmc8L2E+PC9kaXY+JztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8qXG4gKiBBZGQgYSBzdGF0dXMgY2xhc3MgYW5kIGEgaG92ZXItcmV2ZWFsZWQgZGF0ZSBhbm5vdGF0aW9uIHRvIG9uZSBlbnRyeSBpblxuICogdGhlIHRhYmxlIG9mIGNvbnRlbnRzLlxuICovXG5mdW5jdGlvbiBkZWNvcmF0ZVRvY0VudHJ5KGVudHJ5LCBlbnRyeUNsYXNzLCBpbmZvQ2xhc3MsIGluZm9UZXh0KSB7XG4gICAgZW50cnkuY2xhc3NMaXN0LmFkZChlbnRyeUNsYXNzKTtcbiAgICBsZXQgaW5mbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgIGluZm8uY2xhc3NOYW1lID0gaW5mb0NsYXNzO1xuICAgIGluZm8udGV4dENvbnRlbnQgPSBpbmZvVGV4dDtcbiAgICBlbnRyeS5hcHBlbmRDaGlsZChpbmZvKTtcbiAgICBsZXQgbGluayA9IGVudHJ5LmNoaWxkcmVuWzBdO1xuICAgIGlmIChsaW5rICYmIGxpbmsgIT09IGluZm8pIHtcbiAgICAgICAgbGluay5hZGRFdmVudExpc3RlbmVyKFwibW91c2VlbnRlclwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpbmZvLnN0eWxlLmRpc3BsYXkgPSBcIlwiO1xuICAgICAgICB9KTtcbiAgICAgICAgbGluay5hZGRFdmVudExpc3RlbmVyKFwibW91c2VsZWF2ZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpbmZvLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBlbmFibGVDb21wbGV0aW9ucygpIHtcbiAgICAvLyBUaGUgY29tcGxldGlvbiBidXR0b24gbXVzdCBleGlzdCBiZWZvcmUgdGhlIG5hdmlnYXRpb24gbG9naWMgbG9va3NcbiAgICAvLyBmb3IgaXQgKHRoZSBqUXVlcnkgdmVyc2lvbiB1c2VkIGEgc3luY2hyb25vdXMgcmVxdWVzdCBoZXJlKS5cbiAgICAvLyBPbmx5IHN1YmNoYXB0ZXJzIGhhdmUgcHJvZ3Jlc3MgdG8gZmV0Y2ggb3IgcmVjb3JkOyB0aGUgdGFibGUgb2ZcbiAgICAvLyBjb250ZW50cyBkZWNvcmF0aW9ucyBiZWxvdyBiZWxvbmcgdG8gcGFnZXMgdGhhdCBhcmUgbm90LlxuICAgIGNvbnN0IHN1YmNoYXB0ZXJQYWdlID0gaXNTdWJjaGFwdGVyUGFnZSgpO1xuICAgIGlmIChzdWJjaGFwdGVyUGFnZSkge1xuICAgICAgICBhd2FpdCBnZXRDb21wbGV0aW9ucygpO1xuICAgIH1cbiAgICBzaG93TGFzdFBvc2l0aW9uQmFubmVyKCk7XG4gICAgaWYgKHN1YmNoYXB0ZXJQYWdlKSB7XG4gICAgICAgIGFkZE5hdmlnYXRpb25BbmRDb21wbGV0aW9uQnV0dG9ucygpO1xuICAgIH1cbiAgICBhd2FpdCBkZWNvcmF0ZVRhYmxlT2ZDb250ZW50cygpO1xufVxuXG4vLyBjYWxsIGVuYWJsZSB1c2VyIGhpZ2hsaWdodHMgYWZ0ZXIgbG9naW5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJydW5lc3RvbmU6bG9naW5cIiwgZW5hYmxlQ29tcGxldGlvbnMpO1xuXG5mdW5jdGlvbiBpc1ByZVRlWHQoKSB7XG4gICAgbGV0IHB0eE1hcmtlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJib2R5LnByZXRleHRcIik7XG4gICAgaWYgKHB0eE1hcmtlcikge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufVxuLy8gXyBwcm9jZXNzUGFnZVN0YXRlXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5hc3luYyBmdW5jdGlvbiBwcm9jZXNzUGFnZVN0YXRlKFxuICAgIGNvbXBsZXRpb25GbGFnLFxuICAgIHBhZ2VMb2FkLFxuICAgIG1hcmtpbmdDb21wbGV0ZSxcbiAgICBtYXJraW5nSW5jb21wbGV0ZSxcbikge1xuICAgIC8qTG9nIGxhc3QgcGFnZSB2aXNpdGVkKi9cbiAgICB2YXIgY3VycmVudFBhdGhuYW1lID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lO1xuICAgIGlmIChjdXJyZW50UGF0aG5hbWUuaW5kZXhPZihcIj9cIikgIT09IC0xKSB7XG4gICAgICAgIGN1cnJlbnRQYXRobmFtZSA9IGN1cnJlbnRQYXRobmFtZS5zdWJzdHJpbmcoXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgY3VycmVudFBhdGhuYW1lLmxhc3RJbmRleE9mKFwiP1wiKSxcbiAgICAgICAgKTtcbiAgICB9XG4gICAgLy8gSXMgdGhpcyBhIHB0eCBib29rP1xuICAgIGxldCBpc1B0eEJvb2sgPSBpc1ByZVRlWHQoKTtcbiAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgbGFzdFBhZ2VVcmw6IGN1cnJlbnRQYXRobmFtZSxcbiAgICAgICAgbGFzdFBhZ2VTY3JvbGxMb2NhdGlvbjogTWF0aC5yb3VuZCh3aW5kb3cuc2Nyb2xsWSksXG4gICAgICAgIGNvbXBsZXRpb25GbGFnOiBjb21wbGV0aW9uRmxhZyxcbiAgICAgICAgcGFnZUxvYWQ6IHBhZ2VMb2FkLFxuICAgICAgICBtYXJraW5nQ29tcGxldGU6IG1hcmtpbmdDb21wbGV0ZSxcbiAgICAgICAgbWFya2luZ0luY29tcGxldGU6IG1hcmtpbmdJbmNvbXBsZXRlLFxuICAgICAgICBjb3Vyc2U6IGVCb29rQ29uZmlnLmNvdXJzZSxcbiAgICAgICAgaXNQdHhCb29rOiBpc1B0eEJvb2ssXG4gICAgfTtcbiAgICBsZXQgdXJsID0gYCR7ZUJvb2tDb25maWcubmV3X3NlcnZlcl9wcmVmaXh9L2xvZ2dlci91cGRhdGVsYXN0cGFnZWA7XG4gICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgZmV0Y2godXJsLCB7XG4gICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICAgICAgaGVhZGVyczogeyBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLThcIiB9LFxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZGF0YSksXG4gICAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlJlcXVlc3QgRmFpbGVkIGZvciBcIiArIHVybCk7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBnZXRVcmxWYXIobmFtZSkge1xuICAgIHJldHVybiBuZXcgVVJMU2VhcmNoUGFyYW1zKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gpLmdldChuYW1lKTtcbn1cbiIsImltcG9ydCBSdW5lc3RvbmVCYXNlIGZyb20gXCIuLi8uLi9jb21tb24vanMvcnVuZXN0b25lYmFzZS5qc1wiO1xuXG5pbnRlcmZhY2UgU3BsaWNlTWVzc2FnZURhdGEge1xuICAgIHN1YmplY3Q6IHN0cmluZztcbiAgICBhY3Rpdml0eV9pZD86IHN0cmluZztcbiAgICBzY29yZT86IG51bWJlcjtcbiAgICBzdGF0ZT86IHVua25vd247XG4gICAgbmFtZT86IHN0cmluZztcbiAgICBtZXNzYWdlX2lkPzogc3RyaW5nO1xuICAgIGZyYW1lX2lkPzogc3RyaW5nO1xuICAgIGp3dD86IHN0cmluZztcbn1cblxuaW50ZXJmYWNlIFNhdmVkU3RhdGVSZXNwb25zZSB7XG4gICAgZGV0YWlsOiB7XG4gICAgICAgIGFuc3dlcjogdW5rbm93bjtcbiAgICB9O1xufVxuXG5pbnRlcmZhY2UgSnd0UGF5bG9hZCB7XG4gICAgc2NvcmU6IG51bWJlcjtcbiAgICBba2V5OiBzdHJpbmddOiB1bmtub3duO1xufVxuXG5kZWNsYXJlIGNvbnN0IGVCb29rQ29uZmlnOiB7XG4gICAgY291cnNlOiBzdHJpbmc7XG4gICAgW2tleTogc3RyaW5nXTogdW5rbm93bjtcbn07XG5cbmV4cG9ydCBjbGFzcyBTcGxpY2VXcmFwcGVyIGV4dGVuZHMgUnVuZXN0b25lQmFzZSB7XG4gICAgLyoqXG4gICAgICogSWZyYW1lcyB0aGUgZ3JhZGluZyBpbnRlcmZhY2UgaXMgY3VycmVudGx5IGRpc3BsYXlpbmcsIG1hcHBlZCB0byB0aGVcbiAgICAgKiBzYXZlZCBzdGF0ZSBvZiB0aGUgYXR0ZW1wdCBiZWluZyByZXZpZXdlZC4gU2VlIGBgcmVnaXN0ZXJHcmFkZXJGcmFtZWBgLlxuICAgICAqL1xuICAgIGdyYWRlckZyYW1lczogTWFwPEhUTUxJRnJhbWVFbGVtZW50LCB1bmtub3duPiA9IG5ldyBNYXAoKTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmluaXRTcGxpY2UoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUZWxsIHRoZSB3cmFwcGVyIHRoYXQgYGBmcmFtZWBgIGlzIHNob3dpbmcgb25lIHN0dWRlbnQncyBhdHRlbXB0IHRvIGFuXG4gICAgICogaW5zdHJ1Y3RvciByYXRoZXIgdGhhbiBiZWluZyB3b3JrZWQgYnkgaXRzIG93bmVyLiBXaGlsZSBpdCBpcyByZWdpc3RlcmVkXG4gICAgICogYGBTUExJQ0UuZ2V0U3RhdGVgYCBpcyBhbnN3ZXJlZCB3aXRoIGBgc3RhdGVgYCBpbnN0ZWFkIG9mIHdoYXRldmVyIHRoZVxuICAgICAqIHNlcnZlciBoYXMgZm9yIHRoZSBsb2dnZWQtaW4gdXNlciAtLSB3aGljaCB3b3VsZCBiZSB0aGUgKmluc3RydWN0b3IncypcbiAgICAgKiB3b3JrIC0tIGFuZCBhbnl0aGluZyB0aGUgYWN0aXZpdHkgcmVwb3J0cyBiYWNrIGlzIGRyb3BwZWQsIHNvIHBva2luZyBhdFxuICAgICAqIGl0IHdoaWxlIGdyYWRpbmcgbmV2ZXIgd3JpdGVzIHRvIGFuIGFuc3dlciB0YWJsZS5cbiAgICAgKi9cbiAgICByZWdpc3RlckdyYWRlckZyYW1lKGZyYW1lOiBIVE1MSUZyYW1lRWxlbWVudCwgc3RhdGU6IHVua25vd24pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5ncmFkZXJGcmFtZXMuc2V0KGZyYW1lLCBzdGF0ZSk7XG4gICAgfVxuXG4gICAgdW5yZWdpc3RlckdyYWRlckZyYW1lKGZyYW1lOiBIVE1MSUZyYW1lRWxlbWVudCk6IHZvaWQge1xuICAgICAgICB0aGlzLmdyYWRlckZyYW1lcy5kZWxldGUoZnJhbWUpO1xuICAgIH1cblxuICAgIGhhbmRsZUdyYWRlckZyYW1lTWVzc2FnZShldmVudDogTWVzc2FnZUV2ZW50PFNwbGljZU1lc3NhZ2VEYXRhPiwgc3RhdGU6IHVua25vd24pOiB2b2lkIHtcbiAgICAgICAgaWYgKGV2ZW50LmRhdGEuc3ViamVjdCA9PSBcIlNQTElDRS5nZXRTdGF0ZVwiKSB7XG4gICAgICAgICAgICAoZXZlbnQuc291cmNlIGFzIFdpbmRvdykucG9zdE1lc3NhZ2UoXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlX2lkOiBldmVudC5kYXRhLm1lc3NhZ2VfaWQsXG4gICAgICAgICAgICAgICAgICAgIHN1YmplY3Q6IFwiU1BMSUNFLmdldFN0YXRlLnJlc3BvbnNlXCIsXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlOiBzdGF0ZSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwiKlwiXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIC8vIFNjb3JlcyBhbmQgZXZlbnRzIHJhaXNlZCBmcm9tIGEgZ3JhZGVyIGZyYW1lIGJlbG9uZyB0byBub2JvZHk6IHRoZVxuICAgICAgICAvLyBpbnN0cnVjdG9yIGlzIGxvb2tpbmcgYXQgc29tZW9uZSBlbHNlJ3MgYXR0ZW1wdCwgc28gd2UgZHJvcCB0aGVtLlxuICAgIH1cblxuICAgIGluaXRTcGxpY2UoKTogdm9pZCB7XG4gICAgICAgIC8vIFNQTElDRSBFdmVudHNcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIGFzeW5jIChldmVudDogTWVzc2FnZUV2ZW50PFNwbGljZU1lc3NhZ2VEYXRhPikgPT4ge1xuICAgICAgICAgICAgdmFyIHNvdXJjZUlmcmFtZSA9IHRoaXMuc2VuZGluZ0lmcmFtZShldmVudCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgU3BsaWNlV3JhcHBlcjogcmVjZWl2ZWQgbWVzc2FnZSBzdWJqZWN0OiAke2V2ZW50LmRhdGEuc3ViamVjdH0gZnJvbSBpZnJhbWU6ICR7c291cmNlSWZyYW1lID8gc291cmNlSWZyYW1lLmlkIDogXCJ1bmtub3duXCJ9YCk7XG4gICAgICAgICAgICBpZiAoc291cmNlSWZyYW1lICYmIHRoaXMuZ3JhZGVyRnJhbWVzLmhhcyhzb3VyY2VJZnJhbWUpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVHcmFkZXJGcmFtZU1lc3NhZ2UoZXZlbnQsIHRoaXMuZ3JhZGVyRnJhbWVzLmdldChzb3VyY2VJZnJhbWUpKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZXZlbnQuZGF0YS5zdWJqZWN0ID09IFwiU1BMSUNFLnJlcG9ydFNjb3JlQW5kU3RhdGVcIikge1xuICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlU2NvcmVBbmRTdGF0ZShldmVudCwgc291cmNlSWZyYW1lKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXZlbnQuZGF0YS5zdWJqZWN0ID09IFwiU1BMSUNFLnNlbmRFdmVudFwiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVTcGxpY2VFdmVudChldmVudCwgc291cmNlSWZyYW1lKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXZlbnQuZGF0YS5zdWJqZWN0ID09IFwiU1BMSUNFLmdldFN0YXRlXCIpIHtcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmhhbmRsZUdldFN0YXRlKGV2ZW50LCBzb3VyY2VJZnJhbWUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgICAgICBldmVudC5vcmlnaW4gPT09IFwiaHR0cHM6Ly93d3cubXlvcGVubWF0aC5jb21cIiAmJlxuICAgICAgICAgICAgICAgIHR5cGVvZiBldmVudC5kYXRhID09PSBcInN0cmluZ1wiICYmXG4gICAgICAgICAgICAgICAgKGV2ZW50LmRhdGEgYXMgdW5rbm93biBhcyBzdHJpbmcpLmluZGV4T2YoXCJsdGkuZXh0LmltYXRoYXMucmVzdWx0XCIpICE9IC0xXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAvLyBwcm9vZiBvZiBjb25jZXB0IGZvciBNeSBPcGVuIE1hdGhcbiAgICAgICAgICAgICAgICBsZXQgbXNnZGF0YSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSBhcyB1bmtub3duIGFzIHN0cmluZyk7XG4gICAgICAgICAgICAgICAgbGV0IGp3dCA9IGJhc2ljUGFyc2VKd3QobXNnZGF0YS5qd3QpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgICAgICAgICAgICBcIlJlc3VsdCByZWNlaXZlZCBmcm9tIGZyYW1lIFwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1zZ2RhdGEuZnJhbWVfaWQgK1xuICAgICAgICAgICAgICAgICAgICAgICAgXCIgd2l0aCBzY29yZSBcIiArXG4gICAgICAgICAgICAgICAgICAgICAgICBqd3Quc2NvcmVcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIC8vIHRvZG8gc2VuZCBzY29yZSB0byBzZXJ2ZXJcbiAgICAgICAgICAgICAgICAvLyBkb2VzIE1PTSBoYXZlIGEgd2F5IHRvIGdldCB0aGUgc3RhdGU/XG4gICAgICAgICAgICAgICAgLy8gdG9kbyBzZW5kIHN0YXRlIHRvIHNlcnZlclxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBnZXRVbmlxdWVJRChldmVudDogTWVzc2FnZUV2ZW50PFNwbGljZU1lc3NhZ2VEYXRhPiwgZnJhbWU6IEhUTUxJRnJhbWVFbGVtZW50IHwgdW5kZWZpbmVkKTogc3RyaW5nIHtcbiAgICAgICAgLy8gRGV0ZXJtaW5lIHRoZSB1bmlxdWUgaWRlbnRpZmllciBmb3IgdGhpcyBhY3Rpdml0eVxuICAgICAgICAvLyBUaGUgU1BMSUNFIHByb3RvY29sIGFsbG93cyBmb3IgdHdvIHBvc3NpYmlsaXRpZXNcbiAgICAgICAgLy8gMS4gYWN0aXZpdHlfaWQgaXMgdGhlIHVuaXF1ZSBpZCBhcyBhc3NpZ25lZCBieSB0aGUgcHJvdmlkZXJcbiAgICAgICAgLy8gMi4gYWN0aXZpdHlfaWQgaXMgdGhlIGlmcmFtZSBzcmMgdXJsXG4gICAgICAgIC8vIGlmIHRoZSBhY3Rpdml0eV9pZCBpcyBzZXQgdGhlcmUgbWF5IGFsc28gYmUgYW5vdGhlciBhdHRyaWJ1dGUgY2FsbGVkIGRvbWFpblxuICAgICAgICAvLyBPbiBSdW5lc3RvbmUgd2Ugd2lsbCB0cnkgdG8gbWFwIHRoZSBhY3Rpdml0eSB0byB0aGUgZGl2X2lkIG9mIHRoZSBlbmNsb3NpbmcgUlMgY29tcG9uZW50XG4gICAgICAgIC8vIGlmIHBvc3NpYmxlLCBvdGhlcndpc2Ugd2Ugd2lsbCB1c2UgdGhlIGFjdGl2aXR5X2lkIG9yIGlmcmFtZSBzcmNcbiAgICAgICAgLy8gSWYgYW4gaW50ZXJhY3RpdmUgaXMgaW5jbHVkZWQgaW4gYW4gZXhlcmNpc2VzIHRoaXMgYWxsb3dzIHVzIHRvIG1hcCB0aGUgc2NvcmVcbiAgICAgICAgLy8gdG8gdGhlIGlkIHRoZSBpbnN0cnVjdG9yIHVzZWQgdG8gYXNzaWduIHRoZSBwcm9ibGVtLlxuICAgICAgICBpZiAoZnJhbWUpIHtcbiAgICAgICAgICAgIGxldCByc0RpdiA9IGZyYW1lLmNsb3Nlc3QoXCJbZGF0YS1jb21wb25lbnRdXCIpO1xuICAgICAgICAgICAgaWYgKHJzRGl2KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJzRGl2LmlkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGxldCBsb2NhdGlvbiA9IGV2ZW50LmRhdGEuYWN0aXZpdHlfaWQ7XG4gICAgICAgIGlmICghbG9jYXRpb24pIHtcbiAgICAgICAgICAgIGlmIChmcmFtZSkge1xuICAgICAgICAgICAgICAgIGxvY2F0aW9uID0gZnJhbWUuc3JjO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsb2NhdGlvbiA9IFwidW5rbm93blwiO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAgICAgICAgICAgICAgIFwiQ291bGQgbm90IGZpbmQgaWZyYW1lIHRoYXQgc2VudCB0aGUgU1BMSUNFIGV2ZW50XCJcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBsb2NhdGlvbjtcbiAgICB9XG5cbiAgICBoYW5kbGVTY29yZUFuZFN0YXRlKGV2ZW50OiBNZXNzYWdlRXZlbnQ8U3BsaWNlTWVzc2FnZURhdGE+LCBmcmFtZTogSFRNTElGcmFtZUVsZW1lbnQgfCB1bmRlZmluZWQpOiB2b2lkIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJHb3QgU1BMSUNFLnJlcG9ydFNjb3JlQW5kU3RhdGVcIik7XG4gICAgICAgIGNvbnNvbGUubG9nKGV2ZW50LmRhdGEuYWN0aXZpdHlfaWQpO1xuICAgICAgICBjb25zb2xlLmxvZyhldmVudC5kYXRhLnNjb3JlKTtcbiAgICAgICAgY29uc29sZS5sb2coZXZlbnQuZGF0YS5zdGF0ZSk7XG4gICAgICAgIGxldCBsb2NhdGlvbiA9IHRoaXMuZ2V0VW5pcXVlSUQoZXZlbnQsIGZyYW1lKTtcbiAgICAgICAgdGhpcy5sb2dCb29rRXZlbnQoe1xuICAgICAgICAgICAgZXZlbnQ6IGV2ZW50LmRhdGEuc3ViamVjdCxcbiAgICAgICAgICAgIGRpdl9pZDogbG9jYXRpb24sXG4gICAgICAgICAgICBhY3Q6IGBzY29yZTogJHtldmVudC5kYXRhLnNjb3JlfWAsXG4gICAgICAgICAgICBzY29yZTogZXZlbnQuZGF0YS5zY29yZSxcbiAgICAgICAgICAgIHBlcmNlbnQ6IGV2ZW50LmRhdGEuc2NvcmUsXG4gICAgICAgICAgICBjb3JyZWN0OiBldmVudC5kYXRhLnNjb3JlID09IDEuMCA/IHRydWUgOiBmYWxzZSxcbiAgICAgICAgICAgIGFuc3dlcjogSlNPTi5zdHJpbmdpZnkoZXZlbnQuZGF0YS5zdGF0ZSksXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHNlbmRpbmdJZnJhbWUoZXZlbnQ6IE1lc3NhZ2VFdmVudCk6IEhUTUxJRnJhbWVFbGVtZW50IHwgdW5kZWZpbmVkIHtcbiAgICAgICAgLy8gZGV0ZXJtaW5lIHRoZSBpZnJhbWUgdGhhdCBzZW50IHRoZSBldmVudFxuICAgICAgICAvLyB5b3Ugd291bGQgdGhpbmsgdGhhdCBldmVudC5zb3VyY2Ugd291bGQgYmUgdGhlIGlmcmFtZVxuICAgICAgICAvLyBidXQgaXQgaXMgbm90IGFuZCBnZXR0aW5nIHRoZSBsb2NhdGlvbiBvdXQgb2YgZXZlbnQuc291cmNlXG4gICAgICAgIC8vIGNyZWF0ZXMgQ09SUyBpc3N1ZXMuXG4gICAgICAgIGZvciAoY29uc3QgZiBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImlmcmFtZVwiKSkge1xuICAgICAgICAgICAgaWYgKGYuY29udGVudFdpbmRvdyA9PT0gZXZlbnQuc291cmNlKSByZXR1cm4gZjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGFzeW5jIGdldFNhdmVkU3RhdGUobG9jYXRpb246IHN0cmluZyk6IFByb21pc2U8U2F2ZWRTdGF0ZVJlc3BvbnNlIHwgbnVsbD4ge1xuICAgICAgICAvLyBmZXRjaCB0aGUgc3RhdGUgZnJvbSB0aGUgc2VydmVyXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFwiL25zL2Fzc2Vzc21lbnQvcmVzdWx0c1wiLCB7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgICAgICBkaXZfaWQ6IGxvY2F0aW9uLFxuICAgICAgICAgICAgICAgICAgICBjb3Vyc2U6IGVCb29rQ29uZmlnLmNvdXJzZSxcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQ6IFwiU1BMSUNFLmdldFN0YXRlXCIsXG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEhUVFAgZXJyb3IhIHN0YXR1czogJHtyZXNwb25zZS5zdGF0dXN9YCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBkYXRhOiBTYXZlZFN0YXRlUmVzcG9uc2UgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBmZXRjaGluZyBTUExJQ0Ugc3RhdGU6XCIsIGVycm9yKTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgaGFuZGxlR2V0U3RhdGUoZXZlbnQ6IE1lc3NhZ2VFdmVudDxTcGxpY2VNZXNzYWdlRGF0YT4sIGZyYW1lOiBIVE1MSUZyYW1lRWxlbWVudCB8IHVuZGVmaW5lZCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkdvdCBTUExJQ0UuZ2V0U3RhdGVcIik7XG4gICAgICAgIGNvbnNvbGUubG9nKGV2ZW50LmRhdGEuYWN0aXZpdHlfaWQpO1xuICAgICAgICBjb25zb2xlLmxvZyhldmVudC5kYXRhLnN0YXRlKTtcbiAgICAgICAgLy8gc3ViamVjdCBpcyBTUExJQ0UuZ2V0U3RhdGUucmVzcG9uc2VcbiAgICAgICAgbGV0IGxvY2F0aW9uID0gdGhpcy5nZXRVbmlxdWVJRChldmVudCwgZnJhbWUpO1xuICAgICAgICBsZXQgcmVzID0gYXdhaXQgdGhpcy5nZXRTYXZlZFN0YXRlKGxvY2F0aW9uKTtcbiAgICAgICAgbGV0IHN0YXRlID0gcmVzPy5kZXRhaWwuYW5zd2VyO1xuICAgICAgICAoZXZlbnQuc291cmNlIGFzIFdpbmRvdykucG9zdE1lc3NhZ2UoXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZV9pZDogZXZlbnQuZGF0YS5tZXNzYWdlX2lkLFxuICAgICAgICAgICAgICAgIHN1YmplY3Q6IFwiU1BMSUNFLmdldFN0YXRlLnJlc3BvbnNlXCIsXG4gICAgICAgICAgICAgICAgc3RhdGU6IHN0YXRlLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiKlwiXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgaGFuZGxlU3BsaWNlRXZlbnQoZXZlbnQ6IE1lc3NhZ2VFdmVudDxTcGxpY2VNZXNzYWdlRGF0YT4sIGZyYW1lOiBIVE1MSUZyYW1lRWxlbWVudCB8IHVuZGVmaW5lZCk6IHZvaWQge1xuICAgICAgICAvLyBoYW5kbGUgZ2VuZXJpYyBTUExJQ0UgZXZlbnRzLCBzdWNoIGFzIGxvZ2dlZCBjbGlja3NcbiAgICAgICAgLy8gb3Igb3RoZXIgZXZlbnRzLiAgU1BMSUNFIGRvZXMgbm90IHJlcXVpcmUgdGhhdCB3ZSBkb1xuICAgICAgICAvLyBhbnl0aGluZyB3aXRoIHRoZW0sIGJ1dCBpbiBrZWVwaW5nIHdpdGggb3VyIHRyYWRpdGlvblxuICAgICAgICAvLyB3ZSB3aWxsIHNhdmUgdGhlbSB0byB0aGUgdXNlaW5mbyB0YWJsZSBpbiB0aGUgZGF0YWJhc2VcbiAgICAgICAgLy8gaW4gY2FzZSB0aGV5IHByb3ZlIHRvIGJlIHVzZWZ1bCBmb3IgcmVzZWFyY2ggbGF0ZXJcbiAgICAgICAgY29uc29sZS5sb2coXCJHb3QgU1BMSUNFLnNlbmRFdmVudFwiKTtcbiAgICAgICAgY29uc29sZS5sb2coZXZlbnQuZGF0YS5hY3Rpdml0eV9pZCk7XG4gICAgICAgIGNvbnNvbGUubG9nKGV2ZW50LmRhdGEubmFtZSk7XG4gICAgICAgIGxldCBsb2NhdGlvbiA9IHRoaXMuZ2V0VW5pcXVlSUQoZXZlbnQsIGZyYW1lKTtcbiAgICAgICAgdGhpcy5sb2dCb29rRXZlbnQoe1xuICAgICAgICAgICAgZXZlbnQ6IGV2ZW50LmRhdGEuc3ViamVjdCxcbiAgICAgICAgICAgIGRpdl9pZDogbG9jYXRpb24sXG4gICAgICAgICAgICBhY3Q6IGV2ZW50LmRhdGEubmFtZSB8fCBcInVua25vd25cIixcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gdGhlc2Ugc3R1YnMgYXJlIG5vdCBpbXBsZW1lbnRlZCwgYnV0IGFyZSByZXF1aXJlZCBieSB0aGUgUnVuZXN0b25lQmFzZSBjbGFzc1xuICAgIGNoZWNrTG9jYWxTdG9yYWdlKCk6IHZvaWQge31cbiAgICBzZXRMb2NhbFN0b3JhZ2UoKTogdm9pZCB7fVxuICAgIHJlc3RvcmVBbnN3ZXJzKCk6IHZvaWQge31cbiAgICBkaXNhYmxlSW50ZXJhY3Rpb24oKTogdm9pZCB7fVxufVxuXG5mdW5jdGlvbiBiYXNpY1BhcnNlSnd0KHRva2VuOiBzdHJpbmcpOiBKd3RQYXlsb2FkIHtcbiAgICB2YXIgYmFzZTY0VXJsID0gdG9rZW4uc3BsaXQoXCIuXCIpWzFdO1xuICAgIHZhciBiYXNlNjQgPSBiYXNlNjRVcmwucmVwbGFjZSgvLS9nLCBcIitcIikucmVwbGFjZSgvXy9nLCBcIi9cIik7XG4gICAgdmFyIGpzb25QYXlsb2FkID0gZGVjb2RlVVJJQ29tcG9uZW50KFxuICAgICAgICB3aW5kb3dcbiAgICAgICAgICAgIC5hdG9iKGJhc2U2NClcbiAgICAgICAgICAgIC5zcGxpdChcIlwiKVxuICAgICAgICAgICAgLm1hcChmdW5jdGlvbiAoYzogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCIlXCIgKyAoXCIwMFwiICsgYy5jaGFyQ29kZUF0KDApLnRvU3RyaW5nKDE2KSkuc2xpY2UoLTIpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5qb2luKFwiXCIpXG4gICAgKTtcbiAgICByZXR1cm4gSlNPTi5wYXJzZShqc29uUGF5bG9hZCkgYXMgSnd0UGF5bG9hZDtcbn1cbiIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiB8ZG9jbmFtZXwgLSBSdW5lc3RvbmUgQmFzZSBDbGFzc1xuICogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIEFsbCBydW5lc3RvbmUgY29tcG9uZW50cyBzaG91bGQgaW5oZXJpdCBmcm9tIFJ1bmVzdG9uZUJhc2UuIEluIGFkZGl0aW9uIGFsbCBydW5lc3RvbmUgY29tcG9uZW50cyBzaG91bGQgZG8gdGhlIGZvbGxvd2luZyB0aGluZ3M6XG4gKlxuICogMS4gICBFbnN1cmUgdGhhdCB0aGV5IGFyZSB3cmFwcGVkIGluIGEgZGl2IHdpdGggdGhlIGNsYXNzIHJ1bmVzdG9uZVxuICogMi4gICBXcml0ZSB0aGVpciBzb3VyY2UgQU5EIHRoZWlyIGdlbmVyYXRlZCBodG1sIHRvIHRoZSBkYXRhYmFzZSBpZiB0aGUgZGF0YWJhc2UgaXMgY29uZmlndXJlZFxuICogMy4gICBQcm9wZXJseSBzYXZlIGFuZCByZXN0b3JlIHRoZWlyIGFuc3dlcnMgdXNpbmcgdGhlIGNoZWNrU2VydmVyIG1lY2hhbmlzbSBpbiB0aGlzIGJhc2UgY2xhc3MuIEVhY2ggY29tcG9uZW50IG11c3QgcHJvdmlkZSBhbiBpbXBsZW1lbnRhdGlvbiBvZjpcbiAqXG4gKiAgICAgIC0gICAgY2hlY2tMb2NhbFN0b3JhZ2VcbiAqICAgICAgLSAgICBzZXRMb2NhbFN0b3JhZ2VcbiAqICAgICAgLSAgICByZXN0b3JlQW5zd2Vyc1xuICogICAgICAtICAgIGRpc2FibGVJbnRlcmFjdGlvblxuICpcbiAqIDQuICAgcHJvdmlkZSBhIFNlbGVuaXVtIGJhc2VkIHVuaXQgdGVzdFxuICovXG5cbmltcG9ydCB7IHBhZ2VQcm9ncmVzc1RyYWNrZXIgfSBmcm9tIFwiLi9ib29rZnVuY3MuanNcIjtcbmltcG9ydCB7IGdldERhdGFWYWx1ZSB9IGZyb20gXCIuL2RvbXV0aWwuanNcIjtcbi8vaW1wb3J0IFwiLi8uLi9zdHlsZXMvcnVuZXN0b25lLmNzc1wiO1xuXG52YXIgTk9fREVDT1JBVEUgPSBbXG4gICAgXCJwYXJzb25zTW92ZVwiLFxuICAgIFwic2hvd2V2YWxcIixcbiAgICBcInZpZGVvXCIsXG4gICAgXCJwb2xsXCIsXG4gICAgXCJ2aWV3X3RvZ2dsZVwiLFxuICAgIFwiZGFzaGJvYXJkXCIsXG4gICAgXCJzZWxlY3RxdWVzdGlvblwiLFxuICAgIFwiY29kZWxlbnNcIixcbiAgICBcInBlZXJcIixcbl07XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSdW5lc3RvbmVCYXNlIHtcbiAgICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgICAgIHRoaXMuY29tcG9uZW50X3JlYWR5X3Byb21pc2UgPSBuZXcgUHJvbWlzZShcbiAgICAgICAgICAgIChyZXNvbHZlKSA9PiAodGhpcy5fY29tcG9uZW50X3JlYWR5X3Jlc29sdmVfZm4gPSByZXNvbHZlKSxcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5vcHRpb25hbCA9IGZhbHNlO1xuICAgICAgICBpZiAodHlwZW9mIHdpbmRvdy5hbGxDb21wb25lbnRzID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICB3aW5kb3cuYWxsQ29tcG9uZW50cyA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIHdpbmRvdy5hbGxDb21wb25lbnRzLnB1c2godGhpcyk7XG4gICAgICAgIGlmIChvcHRzKSB7XG4gICAgICAgICAgICB0aGlzLnNpZCA9IG9wdHMuc2lkO1xuICAgICAgICAgICAgdGhpcy5ncmFkZXJhY3RpdmUgPSBvcHRzLmdyYWRlcmFjdGl2ZTtcbiAgICAgICAgICAgIHRoaXMuc2hvd2ZlZWRiYWNrID0gdHJ1ZTtcbiAgICAgICAgICAgIGlmIChvcHRzLnRpbWVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pc1RpbWVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvcHRzLmVuZm9yY2VEZWFkbGluZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZGVhZGxpbmUgPSBvcHRzLmRlYWRsaW5lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5vcHRpb25hbCA9IHRoaXMucGFyc2VCb29sZWFuQXR0cmlidXRlKFxuICAgICAgICAgICAgICAgIG9wdHMub3JpZyxcbiAgICAgICAgICAgICAgICBcImRhdGEtb3B0aW9uYWxcIixcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBpZiAob3B0cy5zZWxlY3Rvcl9pZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0b3JfaWQgPSBvcHRzLnNlbGVjdG9yX2lkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHR5cGVvZiBvcHRzLmFzc2Vzc21lbnRUYWtlbiAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgIHRoaXMuYXNzZXNzbWVudFRha2VuID0gb3B0cy5hc3Nlc3NtZW50VGFrZW47XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGRlZmF1bHQgdG8gdHJ1ZSBhcyB0aGlzIG9wdCBpcyBvbmx5IHByb3ZpZGVkIGZyb20gYSB0aW1lZEFzc2Vzc21lbnRcbiAgICAgICAgICAgICAgICB0aGlzLmFzc2Vzc21lbnRUYWtlbiA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBUaGlzIGlzIGZvciB0aGUgc2VsZWN0cXVlc3Rpb24gcG9pbnRzXG4gICAgICAgICAgICAvLyBJZiBhIHNlbGVjdHF1ZXN0aW9uIGlzIHBhcnQgb2YgYSB0aW1lZCBleGFtIGl0IHdpbGwgZ2V0XG4gICAgICAgICAgICAvLyB0aGUgdGltZWRXcmFwcGVyIG9wdGlvbnMuXG4gICAgICAgICAgICBpZiAodHlwZW9mIG9wdHMudGltZWRXcmFwcGVyICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50aW1lZFdyYXBwZXIgPSBvcHRzLnRpbWVkV3JhcHBlcjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gSG93ZXZlciBzb21ldGltZXMgc2VsZWN0cXVlc3Rpb25zXG4gICAgICAgICAgICAgICAgLy8gYXJlIHVzZWQgaW4gcmVndWxhciBhc3NpZ25tZW50cy4gIFRoZSBoYWNreSB3YXkgdG8gZGV0ZWN0IHRoaXNcbiAgICAgICAgICAgICAgICAvLyBpcyB0byBsb29rIGZvciBkb0Fzc2lnbm1lbnQgaW4gdGhlIFVSTCBhbmQgdGhlbiBncmFiXG4gICAgICAgICAgICAgICAgLy8gdGhlIGFzc2lnbm1lbnQgbmFtZSBmcm9tIHRoZSBoZWFkaW5nLlxuICAgICAgICAgICAgICAgIGlmIChsb2NhdGlvbi5ocmVmLmluZGV4T2YoXCJkb0Fzc2lnbm1lbnRcIikgPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRpbWVkV3JhcHBlciA9XG4gICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiaDEjYXNzaWdubWVudF9uYW1lXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPy50ZXh0Q29udGVudCB8fCBcIlwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGltZWRXcmFwcGVyID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAob3B0cy5vcmlnICYmIGdldERhdGFWYWx1ZShvcHRzLm9yaWcsIFwicXVlc3Rpb25fbGFiZWxcIikpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnF1ZXN0aW9uX2xhYmVsID0gZ2V0RGF0YVZhbHVlKG9wdHMub3JpZywgXCJxdWVzdGlvbl9sYWJlbFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuaXNfdG9nZ2xlID0gdHJ1ZSA/IG9wdHMuaXNfdG9nZ2xlIDogZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmlzX3NlbGVjdCA9IHRydWUgPyBvcHRzLmlzX3NlbGVjdCA6IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRzICYmIHR5cGVvZiBvcHRzLnByZWFtYmxlICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICB0aGlzLnByZWFtYmxlID0gb3B0cy5wcmVhbWJsZTtcbiAgICAgICAgICAgIGxldCB5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgIHkuY2xhc3NMaXN0LmFkZChcImhpZGRlbi1jb250ZW50XCIpO1xuICAgICAgICAgICAgeS5jbGFzc0xpc3QuYWRkKFwicHJvY2Vzcy1tYXRoXCIpO1xuICAgICAgICAgICAgeS5pbm5lckhUTUwgPSBcIlxcXFwoXCIgKyB0aGlzLnByZWFtYmxlICsgXCJcXFxcKVwiO1xuICAgICAgICAgICAgLy8gVGhpcyBpcyBhIGhhY2sgdG8gZ2V0IHRoZSBwcmVhbWJsZSBpbnRvIHRoZSBET00gc28gdGhhdCBNYXRoSmF4IGNhbiBwcm9jZXNzIGl0LlxuICAgICAgICAgICAgb3B0cy5vcmlnLmFwcGVuZENoaWxkKHkpO1xuICAgICAgICAgICAgeS5pZCA9IFwibHR4X3ByZWFtYmxlXCI7XG4gICAgICAgICAgICB5LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgICAgIC8vIHF1ZXVlTWF0aEpheCB0eXBlc2V0cyB0aGlzIGJlZm9yZSB0aGUgY29tcG9uZW50J3Mgb3duIG1hdGguXG4gICAgICAgICAgICB0aGlzLnByZWFtYmxlRGl2ID0geTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuanNvbkhlYWRlcnMgPSBuZXcgSGVhZGVycyh7XG4gICAgICAgICAgICBcIkNvbnRlbnQtdHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLThcIixcbiAgICAgICAgICAgIEFjY2VwdDogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIEhlbHBlciBmb3IgcGFyc2luZyBib29sZWFuIGRhdGEtKiBhdHRyaWJ1dGVzXG4gICAgLy8gVW5zZXQvXCJmYWxzZVwiL1wibm9cIiBtZWFucyBmYWxzZSwgYW55dGhpbmcgZWxzZSwgaW5jbHVkaW5nIGVtcHR5IHN0cmluZyBtZWFucyB0cnVlXG4gICAgcGFyc2VCb29sZWFuQXR0cmlidXRlKGVsZW1lbnQsIGF0dHJpYnV0ZU5hbWUpIHtcbiAgICAgICAgY29uc3QgYXR0clZhbHVlID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoYXR0cmlidXRlTmFtZSk7XG4gICAgICAgIGlmIChhdHRyVmFsdWUgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBsb3dlclZhbHVlID0gYXR0clZhbHVlLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGlmIChsb3dlclZhbHVlID09PSBcImZhbHNlXCIgfHwgbG93ZXJWYWx1ZSA9PT0gXCJub1wiKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLy8gX2Bsb2dCb29rRXZlbnRgXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gVGhpcyBmdW5jdGlvbiBzZW5kcyB0aGUgcHJvdmlkZWQgYGBldmVudEluZm9gYCB0byB0aGUgYGhzYmxvZyBlbmRwb2ludGAgb2YgdGhlIHNlcnZlci4gQXdhaXRpbmcgdGhpcyBmdW5jdGlvbiByZXR1cm5zIGVpdGhlciBgYHVuZGVmaW5lZGBgIChpZiBSdW5lc3RvbmUgc2VydmljZXMgYXJlIG5vdCBhdmFpbGFibGUpIG9yIHRoZSBkYXRhIHJldHVybmVkIGJ5IHRoZSBzZXJ2ZXIgYXMgYSBKYXZhU2NyaXB0IG9iamVjdCAoYWxyZWFkeSBKU09OLWRlY29kZWQpLlxuICAgIGFzeW5jIGxvZ0Jvb2tFdmVudChldmVudEluZm8pIHtcbiAgICAgICAgaWYgKHRoaXMuZ3JhZGVyYWN0aXZlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHBvc3RfcmV0dXJuO1xuICAgICAgICBldmVudEluZm8uY291cnNlX25hbWUgPSBlQm9va0NvbmZpZy5jb3Vyc2U7XG4gICAgICAgIGV2ZW50SW5mby5jbGllbnRMb2dpblN0YXR1cyA9IGVCb29rQ29uZmlnLmlzTG9nZ2VkSW47XG4gICAgICAgIGV2ZW50SW5mby50aW1lem9uZW9mZnNldCA9IG5ldyBEYXRlKCkuZ2V0VGltZXpvbmVPZmZzZXQoKSAvIDYwO1xuICAgICAgICAvLyBGb3Igc2VsZWN0cXVlc3Rpb25zIHdlIG5lZWQgdG8gbG9nIHVzaW5nIHRoZSBzZWxlY3Rvcl9pZCBmb3IgcmVhbCB0aW1lIHNjb3JpbmdcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0b3JfaWQpIHtcbiAgICAgICAgICAgIGV2ZW50SW5mby5zZWxlY3Rvcl9pZCA9IHRoaXMuc2VsZWN0b3JfaWQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLnBlcmNlbnQgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgIGV2ZW50SW5mby5wZXJjZW50ID0gdGhpcy5wZXJjZW50O1xuICAgICAgICB9XG4gICAgICAgIGlmICh3aW5kb3cuYXNzaWdubWVudElkKSB7XG4gICAgICAgICAgICBldmVudEluZm8uYXNzaWdubWVudF9pZCA9IHdpbmRvdy5hc3NpZ25tZW50SWQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgZUJvb2tDb25maWcuaXNMb2dnZWRJbiAmJlxuICAgICAgICAgICAgZUJvb2tDb25maWcudXNlUnVuZXN0b25lU2VydmljZXMgJiZcbiAgICAgICAgICAgIGVCb29rQ29uZmlnLmxvZ0xldmVsID4gMFxuICAgICAgICApIHtcbiAgICAgICAgICAgIHBvc3RfcmV0dXJuID0gdGhpcy5wb3N0TG9nTWVzc2FnZShldmVudEluZm8pO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5pc1RpbWVkIHx8IGVCb29rQ29uZmlnLmRlYnVnKSB7XG4gICAgICAgICAgICBsZXQgcHJlZml4ID0gZUJvb2tDb25maWcuaXNMb2dnZWRJbiA/IFwiU2F2ZVwiIDogXCJOb3RcIjtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGAke3ByZWZpeH0gbG9nZ2luZyBldmVudCBgICsgSlNPTi5zdHJpbmdpZnkoZXZlbnRJbmZvKSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gV2hlbiBzZWxlY3RxdWVzdGlvbnMgYXJlIHBhcnQgb2YgYW4gYXNzaWdubWVudCBlc3BlY2lhbGx5IHRvZ2dsZSBxdWVzdGlvbnNcbiAgICAgICAgLy8gd2UgbmVlZCB0byBjb3VudCB1c2luZyB0aGUgc2VsZWN0b3JfaWQgb2YgdGhlIHNlbGVjdCBxdWVzdGlvbi5cbiAgICAgICAgLy8gV2UgIGFsc28gbmVlZCB0byBsb2cgYW4gZXZlbnQgZm9yIHRoYXQgc2VsZWN0b3Igc28gdGhhdCB3ZSB3aWxsIGtub3dcbiAgICAgICAgLy8gdGhhdCBpbnRlcmFjdGlvbiBoYXMgdGFrZW4gcGxhY2UuICBUaGlzIGlzICoqaW5kZXBlbmRlbnQqKiBvZiBob3cgdGhlXG4gICAgICAgIC8vIGF1dG9ncmFkZXIgd2lsbCB1bHRpbWF0ZWx5IGdyYWRlIHRoZSBxdWVzdGlvbiFcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0b3JfaWQpIHtcbiAgICAgICAgICAgIGV2ZW50SW5mby5kaXZfaWQgPSB0aGlzLnNlbGVjdG9yX2lkLnJlcGxhY2UoXG4gICAgICAgICAgICAgICAgXCItdG9nZ2xlU2VsZWN0ZWRRdWVzdGlvblwiLFxuICAgICAgICAgICAgICAgIFwiXCIsXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgZXZlbnRJbmZvLmV2ZW50ID0gXCJzZWxlY3RxdWVzdGlvblwiO1xuICAgICAgICAgICAgZXZlbnRJbmZvLmFjdCA9IFwiaW50ZXJhY3Rpb25cIjtcbiAgICAgICAgICAgIHRoaXMucG9zdExvZ01lc3NhZ2UoZXZlbnRJbmZvKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoXG4gICAgICAgICAgICB0eXBlb2YgcGFnZVByb2dyZXNzVHJhY2tlci51cGRhdGVQcm9ncmVzcyA9PT0gXCJmdW5jdGlvblwiICYmXG4gICAgICAgICAgICBldmVudEluZm8uYWN0ICE9IFwiZWRpdFwiICYmXG4gICAgICAgICAgICB0aGlzLm9wdGlvbmFsID09IGZhbHNlXG4gICAgICAgICkge1xuICAgICAgICAgICAgcGFnZVByb2dyZXNzVHJhY2tlci51cGRhdGVQcm9ncmVzcyhldmVudEluZm8uZGl2X2lkKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBpZiB0aGUgZXZlbnQgaXMgaW4gdGhlIE5PX0RFQ09SQVRFIGxpc3QgdGhlbiBkb24ndCBkZWNvcmF0ZSB0aGUgc3RhdHVzXG4gICAgICAgIGlmIChOT19ERUNPUkFURS5pbmRleE9mKGV2ZW50SW5mby5ldmVudCkgPT09IC0xKSB7XG4gICAgICAgICAgICB0aGlzLmRlY29yYXRlU3RhdHVzKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBvc3RfcmV0dXJuO1xuICAgIH1cblxuICAgIGFzeW5jIHBvc3RMb2dNZXNzYWdlKGV2ZW50SW5mbykge1xuICAgICAgICB2YXIgcG9zdF9yZXR1cm47XG4gICAgICAgIGxldCByZXF1ZXN0ID0gbmV3IFJlcXVlc3QoXG4gICAgICAgICAgICBgJHtlQm9va0NvbmZpZy5uZXdfc2VydmVyX3ByZWZpeH0vbG9nZ2VyL2Jvb2tldmVudGAsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB0aGlzLmpzb25IZWFkZXJzLFxuICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGV2ZW50SW5mbyksXG4gICAgICAgICAgICB9LFxuICAgICAgICApO1xuICAgICAgICBsZXQgcmVzcG9uc2U7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXNwb25zZSA9IGF3YWl0IGZldGNoKHJlcXVlc3QpO1xuICAgICAgICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDQyMikge1xuICAgICAgICAgICAgICAgICAgICAvLyBHZXQgZGV0YWlscyBhYm91dCB3aHkgdGhpcyBpcyB1bnByb2Nlc2FibGUuXG4gICAgICAgICAgICAgICAgICAgIHBvc3RfcmV0dXJuID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShwb3N0X3JldHVybi5kZXRhaWwsIG51bGwsIDQpKTtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5wcm9jZXNzYWJsZSBSZXF1ZXN0XCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocmVzcG9uc2Uuc3RhdHVzID09IDQwMSkge1xuICAgICAgICAgICAgICAgICAgICBwb3N0X3JldHVybiA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgICAgICAgICAgICAgICBgTWlzc2luZyBhdXRoZW50aWNhdGlvbiB0b2tlbiAke3Bvc3RfcmV0dXJuLmRldGFpbH1gLFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNaXNzaW5nIGF1dGhlbnRpY2F0aW9uIHRva2VuXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEZhaWxlZCB0byBzYXZlIHRoZSBsb2cgZW50cnlcbiAgICAgICAgICAgICAgICAgICAgU3RhdHVzOiAke3Jlc3BvbnNlLnN0YXR1c31gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBvc3RfcmV0dXJuID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBsZXQgZGV0YWlsID0gXCJub25lXCI7XG4gICAgICAgICAgICBpZiAocG9zdF9yZXR1cm4gJiYgcG9zdF9yZXR1cm4uZGV0YWlsKSB7XG4gICAgICAgICAgICAgICAgZGV0YWlsID0gcG9zdF9yZXR1cm4uZGV0YWlsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gYGByZXNwb25zZWBgIGlzIHVuc2V0IGlmIGZldGNoIGl0c2VsZiByZWplY3RlZC5cbiAgICAgICAgICAgIGxldCBzdGF0dXNDb2RlID0gcmVzcG9uc2UgPyByZXNwb25zZS5zdGF0dXMgOiBcIm5vIHJlc3BvbnNlXCI7XG4gICAgICAgICAgICBpZiAoZUJvb2tDb25maWcudXNlUnVuZXN0b25lU2VydmljZXMpIHtcbiAgICAgICAgICAgICAgICBhbGVydChgRXJyb3I6IFlvdXIgYWN0aW9uIHdhcyBub3Qgc2F2ZWQhXG4gICAgICAgICAgICAgICAgICAgIFRoZSBlcnJvciB3YXMgJHtlfVxuICAgICAgICAgICAgICAgICAgICBTdGF0dXMgQ29kZTogJHtzdGF0dXNDb2RlfVxuICAgICAgICAgICAgICAgICAgICBEZXRhaWw6ICR7SlNPTi5zdHJpbmdpZnkoZGV0YWlsLCBudWxsLCA0KX0uXG4gICAgICAgICAgICAgICAgICAgIFBsZWFzZSByZXBvcnQgdGhpcyBlcnJvciFgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHNlbmQgYSByZXF1ZXN0IHRvIHNhdmUgdGhpcyBlcnJvclxuICAgICAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgICAgICAgYEVycm9yOiAke2V9IERldGFpbDogJHtkZXRhaWx9IFN0YXR1cyBDb2RlOiAke3N0YXR1c0NvZGV9YCxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gcG9zdF9yZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gVGhlIGxvZyBlbnRyeSBpcyBzYXZlZC4gRXZlcnl0aGluZyBiZWxvdyBvbmx5IHVwZGF0ZXMgdGhlIHNjb3JlIGRpc3BsYXkgb25cbiAgICAgICAgLy8gYW4gYXNzaWdubWVudCBwYWdlOyBhIGZhaWx1cmUgaGVyZSBpcyBhIGRpc3BsYXkgYnVnLCBub3QgYSBsb3N0IHN1Ym1pc3Npb24sXG4gICAgICAgIC8vIHNvIGl0IG11c3QgbmV2ZXIgcmVhY2ggdGhlIGFsZXJ0IGFib3ZlLiBTZWUgaXNzdWUgIzEzOTMuXG4gICAgICAgIHRoaXMuc2hvd1JldHVybmVkU2NvcmUocG9zdF9yZXR1cm4pO1xuICAgICAgICByZXR1cm4gcG9zdF9yZXR1cm47XG4gICAgfVxuICAgIC8vIHVwZGF0ZSB0aGUgc2NvcmUgZm9yIHRoZSBxdWVzdGlvbiBhbmQgdGhlIHRvdGFsIHNjb3JlXG4gICAgLy8gdGhlIHByZXNlbmNlIG9mIHRoZSBncmFkZUJveCBpcyB1c2VkIHRvIGRldGVybWluZSBpZiB3ZSBhcmUgb24gYW4gYXNzaWdubWVudCBwYWdlLlxuICAgIHVwZGF0ZVNjb3JlcyhncmFkZUJveCwgc2NvcmVTcGVjKSB7XG4gICAgICAgIGlmICghc2NvcmVTcGVjLmFzc2lnbmVkIHx8IHNjb3JlU3BlYy5zY29yZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgLy8gTm90IGV2ZXJ5IGNvbXBvbmVudCBoYXMgYSBtYXRjaGluZyBtZXNzYWdlIGRpdiwgYW5kIHNlbGVjdCBxdWVzdGlvbnNcbiAgICAgICAgICAgIC8vIG5hbWUgdGhlaXJzIGFmdGVyIHRoZSBzZWxlY3RvciByYXRoZXIgdGhhbiB0aGUgcmVuZGVyZWQgcXVlc3Rpb24uXG4gICAgICAgICAgICBsZXQgbWVzc2FnZUJveCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGAke3RoaXMuZGl2aWR9X21lc3NhZ2VgKTtcbiAgICAgICAgICAgIGlmIChtZXNzYWdlQm94KSB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZUJveC5pbm5lckhUTUwgPVxuICAgICAgICAgICAgICAgICAgICBcIlNjb3JlIG5vdCB1cGRhdGVkLiAgU3VibWlzc2lvbnMgYXJlIGNsb3NlZC5cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgc2NvcmVTcGFuID0gZ3JhZGVCb3guZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInFzY29yZVwiKVswXTtcbiAgICAgICAgaWYgKHNjb3JlU3Bhbikge1xuICAgICAgICAgICAgc2NvcmVTcGFuLmlubmVySFRNTCA9IHNjb3JlU3BlYy5zY29yZS50b0ZpeGVkKDEpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBhbGxTY29yZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwicXNjb3JlXCIpO1xuICAgICAgICBsZXQgYWxsbWF4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInFtYXhzY29yZVwiKTtcbiAgICAgICAgbGV0IHRvdGFsID0gMDtcbiAgICAgICAgbGV0IG1heCA9IDA7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYWxsU2NvcmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0b3RhbCArPSBwYXJzZUZsb2F0KGFsbFNjb3Jlc1tpXS5pbm5lckhUTUwpO1xuICAgICAgICAgICAgbWF4ICs9IHBhcnNlRmxvYXQoYWxsbWF4W2ldLmlubmVySFRNTCk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHRvdGFsU3BhbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidG90YWxfc2NvcmVcIik7XG4gICAgICAgIGlmICh0b3RhbFNwYW4pIHtcbiAgICAgICAgICAgIHRvdGFsU3Bhbi5pbm5lckhUTUwgPSB0b3RhbC50b0ZpeGVkKDEpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBtYXhTcGFuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0b3RhbF9tYXhcIik7XG4gICAgICAgIGlmIChtYXhTcGFuKSB7XG4gICAgICAgICAgICBtYXhTcGFuLmlubmVySFRNTCA9IG1heDtcbiAgICAgICAgfVxuICAgICAgICBsZXQgcGVyY2VudFNwYW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRvdGFsX3BlcmNlbnRcIik7XG4gICAgICAgIGlmIChwZXJjZW50U3Bhbikge1xuICAgICAgICAgICAgcGVyY2VudFNwYW4uaW5uZXJIVE1MID0gKCh0b3RhbCAvIG1heCkgKiAxMDApLnRvRml4ZWQoMik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBVcGRhdGUgdGhlIHNjb3JlIHNob3duIG9uIGFuIGFzc2lnbm1lbnQgcGFnZSBmcm9tIHRoZSBzY29yZSBzcGVjIGEgbG9nZ2luZ1xuICAgIC8vIGVuZHBvaW50IHJldHVybmVkIGluIGBgZGV0YWlsYGAuIE5ldmVyIHRocm93czogdGhlIGFuc3dlciBpcyBhbHJlYWR5IHNhdmVkLlxuICAgIHNob3dSZXR1cm5lZFNjb3JlKHBvc3RfcmV0dXJuKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgc2NvcmVTcGVjID0gcG9zdF9yZXR1cm4gPyBwb3N0X3JldHVybi5kZXRhaWwgOiBudWxsO1xuICAgICAgICAgICAgLy8gT25seSBncmFkZWQgZXZlbnRzIGNvbWUgYmFjayB3aXRoIGEgc2NvcmUgc3BlYy4gVW5ncmFkZWQgb25lcyAtLVxuICAgICAgICAgICAgLy8gdmlld190b2dnbGUsIHNlbGVjdHF1ZXN0aW9uLCBwYXJzb25zTW92ZSBhbmQgZnJpZW5kcyAtLSBoYXZlIG5vIHNjb3JlXG4gICAgICAgICAgICAvLyB0byByZXBvcnQsIHNvIHRoZXJlIGlzIG5vdGhpbmcgdG8gdXBkYXRlLlxuICAgICAgICAgICAgaWYgKHNjb3JlU3BlYyAmJiBcImFzc2lnbmVkXCIgaW4gc2NvcmVTcGVjICYmICF0aGlzLmlzVGltZWQpIHtcbiAgICAgICAgICAgICAgICBsZXQgYm94SWQgPSB0aGlzLnNlbGVjdG9yX2lkXG4gICAgICAgICAgICAgICAgICAgID8gdGhpcy5zZWxlY3Rvcl9pZC5yZXBsYWNlKFwiLXRvZ2dsZVNlbGVjdGVkUXVlc3Rpb25cIiwgXCJcIilcbiAgICAgICAgICAgICAgICAgICAgOiB0aGlzLmRpdmlkO1xuICAgICAgICAgICAgICAgIGxldCBncmFkZUJveCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGAke2JveElkfV9zY29yZWApO1xuICAgICAgICAgICAgICAgIGlmIChncmFkZUJveCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVNjb3JlcyhncmFkZUJveCwgc2NvcmVTcGVjKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYENvdWxkIG5vdCB1cGRhdGUgdGhlIHNjb3JlIGRpc3BsYXk6ICR7ZX1gKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIC4uIF9sb2dSdW5FdmVudDpcbiAgICAvL1xuICAgIC8vIGxvZ1J1bkV2ZW50XG4gICAgLy8gLS0tLS0tLS0tLS1cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIHNlbmRzIHRoZSBwcm92aWRlZCBgYGV2ZW50SW5mb2BgIHRvIHRoZSBgcnVubG9nIGVuZHBvaW50YC4gV2hlbiBhd2FpdGVkLCB0aGlzIGZ1bmN0aW9uIHJldHVybnMgdGhlIGRhdGEgKGRlY29kZWQgZnJvbSBKU09OKSB0aGUgc2VydmVyIHNlbnQgYmFjay5cbiAgICBhc3luYyBsb2dSdW5FdmVudChldmVudEluZm8pIHtcbiAgICAgICAgbGV0IHBvc3RfcHJvbWlzZSA9IFwiZG9uZVwiO1xuICAgICAgICBpZiAodGhpcy5ncmFkZXJhY3RpdmUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBldmVudEluZm8uY291cnNlID0gZUJvb2tDb25maWcuY291cnNlO1xuICAgICAgICBldmVudEluZm8uY2xpZW50TG9naW5TdGF0dXMgPSBlQm9va0NvbmZpZy5pc0xvZ2dlZEluO1xuICAgICAgICBldmVudEluZm8udGltZXpvbmVvZmZzZXQgPSBuZXcgRGF0ZSgpLmdldFRpbWV6b25lT2Zmc2V0KCkgLyA2MDtcbiAgICAgICAgaWYgKHRoaXMuZm9yY2VTYXZlIHx8IFwidG9fc2F2ZVwiIGluIGV2ZW50SW5mbyA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGV2ZW50SW5mby5zYXZlX2NvZGUgPSBcIlRydWVcIjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGV2ZW50SW5mby5lcnJpbmZvICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBldmVudEluZm8uZXJyaW5mbyA9IGV2ZW50SW5mby5lcnJpbmZvLnRvU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQSBydW4gaXMgZ3JhZGVkIHdoZW4gdGhlIHF1ZXN0aW9uIGlzIHNjb3JlZCBvbiBpbnRlcmFjdGlvbiwgd2hpY2ggbmVlZHNcbiAgICAgICAgLy8gdGhlIHNhbWUgYXNzaWdubWVudCBhbmQgc2VsZWN0cXVlc3Rpb24gY29udGV4dCBhcyBgYGxvZ0Jvb2tFdmVudGBgLlxuICAgICAgICBpZiAodGhpcy5zZWxlY3Rvcl9pZCkge1xuICAgICAgICAgICAgZXZlbnRJbmZvLnNlbGVjdG9yX2lkID0gdGhpcy5zZWxlY3Rvcl9pZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAod2luZG93LmFzc2lnbm1lbnRJZCkge1xuICAgICAgICAgICAgZXZlbnRJbmZvLmFzc2lnbm1lbnRfaWQgPSB3aW5kb3cuYXNzaWdubWVudElkO1xuICAgICAgICB9XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIGVCb29rQ29uZmlnLmlzTG9nZ2VkSW4gJiZcbiAgICAgICAgICAgIGVCb29rQ29uZmlnLnVzZVJ1bmVzdG9uZVNlcnZpY2VzICYmXG4gICAgICAgICAgICBlQm9va0NvbmZpZy5sb2dMZXZlbCA+IDBcbiAgICAgICAgKSB7XG4gICAgICAgICAgICBsZXQgcmVxdWVzdCA9IG5ldyBSZXF1ZXN0KFxuICAgICAgICAgICAgICAgIGAke2VCb29rQ29uZmlnLm5ld19zZXJ2ZXJfcHJlZml4fS9sb2dnZXIvcnVubG9nYCxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHRoaXMuanNvbkhlYWRlcnMsXG4gICAgICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGV2ZW50SW5mbyksXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChyZXF1ZXN0KTtcbiAgICAgICAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgICAgICAgICBwb3N0X3Byb21pc2UgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICAgICAgICAgICAgaWYgKGVCb29rQ29uZmlnLnVzZVJ1bmVzdG9uZVNlcnZpY2VzKSB7XG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KGBGYWlsZWQgdG8gc2F2ZSB5b3VyIGNvZGVcbiAgICAgICAgICAgICAgICAgICAgICAgIFN0YXR1cyBpcyAke3Jlc3BvbnNlLnN0YXR1c31cbiAgICAgICAgICAgICAgICAgICAgICAgIERldGFpbDogJHtKU09OLnN0cmluZ2lmeShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3N0X3Byb21pc2UuZGV0YWlsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgNCxcbiAgICAgICAgICAgICAgICAgICAgICAgICl9YCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgICAgICAgICAgICAgICBgRGlkIG5vdCBzYXZlIHRoZSBjb2RlLlxuICAgICAgICAgICAgICAgICAgICAgICAgIFN0YXR1czogJHtyZXNwb25zZS5zdGF0dXN9XG4gICAgICAgICAgICAgICAgICAgICAgICAgRGV0YWlsOiAke0pTT04uc3RyaW5naWZ5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3N0X3Byb21pc2UuZGV0YWlsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICA0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICl9YCxcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHBvc3RfcHJvbWlzZSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dSZXR1cm5lZFNjb3JlKHBvc3RfcHJvbWlzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLmlzVGltZWQgfHwgZUJvb2tDb25maWcuZGVidWcpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicnVubmluZyBcIiArIEpTT04uc3RyaW5naWZ5KGV2ZW50SW5mbykpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHR5cGVvZiBwYWdlUHJvZ3Jlc3NUcmFja2VyLnVwZGF0ZVByb2dyZXNzID09PSBcImZ1bmN0aW9uXCIgJiZcbiAgICAgICAgICAgIHRoaXMub3B0aW9uYWwgPT0gZmFsc2VcbiAgICAgICAgKSB7XG4gICAgICAgICAgICBwYWdlUHJvZ3Jlc3NUcmFja2VyLnVwZGF0ZVByb2dyZXNzKGV2ZW50SW5mby5kaXZfaWQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwb3N0X3Byb21pc2U7XG4gICAgfVxuICAgIC8qIENoZWNraW5nL2xvYWRpbmcgZnJvbSBzdG9yYWdlXG4gICAgKipXQVJOSU5HOioqICBETyBOT1QgYGF3YWl0YCB0aGlzIGZ1bmN0aW9uIVxuICAgIFRoaXMgZnVuY3Rpb24sIGFsdGhvdWdoIGFzeW5jLCBkb2VzIG5vdCBleHBsaWNpdGx5IHJlc29sdmUgaXRzIHByb21pc2UgYnkgcmV0dXJuaW5nIGEgdmFsdWUuICBUaGUgcmVhc29uIGZvciB0aGlzIGlzIGJlY2F1c2UgaXQgaXMgY2FsbGVkIGJ5IHRoZSBjb25zdHJ1Y3RvciBmb3IgbmVhcmx5IGV2ZXJ5IGNvbXBvbmVudC4gIEluIEphdmFzY3JpcHQgY29uc3RydWN0b3JzIGNhbm5vdCBiZSBhc3luYyFcblxuICAgIE9uZSBvZiB0aGUgcmVjb21tZW5kZWQgd2F5cyB0byBoYW5kbGUgdGhlIGFzeW5jIHJlcXVpcmVtZW50cyBmcm9tIHdpdGhpbiBhIGNvbnN0cnVjdG9yIGlzIHRvIHVzZSBhbiBhdHRyaWJ1dGUgYXMgYSBwcm9taXNlIGFuZCByZXNvbHZlIHRoYXQgYXR0cmlidXRlIGF0IHRoZSBhcHByb3ByaWF0ZSB0aW1lLlxuICAgICovXG4gICAgYXN5bmMgY2hlY2tTZXJ2ZXIoXG4gICAgICAgIC8vIEEgc3RyaW5nIHNwZWNpZnlpbmcgdGhlIGV2ZW50IG5hbWUgdG8gdXNlIGZvciBxdWVyeWluZyB0aGUgOnJlZjpgZ2V0QXNzZXNzUmVzdWx0c2AgZW5kcG9pbnQuXG4gICAgICAgIGV2ZW50SW5mbyxcbiAgICAgICAgLy8gSWYgdHJ1ZSwgdGhpcyBmdW5jdGlvbiB3aWxsIGludm9rZSBgYGluZGljYXRlX2NvbXBvbmVudF9yZWFkeSgpYGAganVzdCBiZWZvcmUgaXQgcmV0dXJucy4gVGhpcyBpcyBwcm92aWRlZCBzaW5jZSBtb3N0IGNvbXBvbmVudHMgYXJlIHJlYWR5IGFmdGVyIHRoaXMgZnVuY3Rpb24gY29tcGxldGVzIGl0cyB3b3JrLlxuICAgICAgICAvL1xuICAgICAgICAvLyBUT0RPOiBUaGlzIGRlZmF1bHRzIHRvIGZhbHNlLCB0byBhdm9pZCBjYXVzaW5nIHByb2JsZW1zIHdpdGggYW55IGNvbXBvbmVudHMgdGhhdCBoYXZlbid0IGJlZW4gdXBkYXRlZCBhbmQgdGVzdGVkLiBBZnRlciBhbGwgUnVuZXN0b25lIGNvbXBvbmVudHMgaGF2ZSBiZWVuIHVwZGF0ZWQsIGRlZmF1bHQgdGhpcyB0byB0cnVlIGFuZCByZW1vdmUgdGhlIGV4dHJhIHBhcmFtZXRlciBmcm9tIG1vc3QgY2FsbHMgdG8gdGhpcyBmdW5jdGlvbi5cbiAgICAgICAgd2lsbF9iZV9yZWFkeSA9IGZhbHNlLFxuICAgICkge1xuICAgICAgICAvLyBDaGVjayBpZiB0aGUgc2VydmVyIGhhcyBzdG9yZWQgYW5zd2VyXG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgdGhpcy5jaGVja1NlcnZlckNvbXBsZXRlID0gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgc2VsZi5jc3Jlc29sdmVyID0gcmVzb2x2ZTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIGVCb29rQ29uZmlnLmlzTG9nZ2VkSW4gJiZcbiAgICAgICAgICAgICh0aGlzLnVzZVJ1bmVzdG9uZVNlcnZpY2VzIHx8IHRoaXMuZ3JhZGVyYWN0aXZlKVxuICAgICAgICApIHtcbiAgICAgICAgICAgIGxldCBkYXRhID0ge307XG4gICAgICAgICAgICBkYXRhLmRpdl9pZCA9IHRoaXMuZGl2aWQ7XG4gICAgICAgICAgICBkYXRhLmNvdXJzZSA9IGVCb29rQ29uZmlnLmNvdXJzZTtcbiAgICAgICAgICAgIGRhdGEuZXZlbnQgPSBldmVudEluZm87XG4gICAgICAgICAgICBpZiAodGhpcy5ncmFkZXJhY3RpdmUgJiYgdGhpcy5kZWFkbGluZSkge1xuICAgICAgICAgICAgICAgIGRhdGEuZGVhZGxpbmUgPSB0aGlzLmRlYWRsaW5lO1xuICAgICAgICAgICAgICAgIGRhdGEucmF3ZGVhZGxpbmUgPSB0aGlzLnJhd2RlYWRsaW5lO1xuICAgICAgICAgICAgICAgIGRhdGEudHpvZmYgPSB0aGlzLnR6b2ZmO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuc2lkKSB7XG4gICAgICAgICAgICAgICAgZGF0YS5zaWQgPSB0aGlzLnNpZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghKGRhdGEuZGl2X2lkICYmIGRhdGEuY291cnNlICYmIGRhdGEuZXZlbnQpKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgICAgICAgICAgIGBBIHJlcXVpcmVkIGZpZWxkIGlzIG1pc3NpbmcgZGF0YSAke2RhdGEuZGl2X2lkfToke2RhdGEuY291cnNlfToke2RhdGEuZXZlbnR9YCxcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gSWYgd2UgYXJlIE5PVCBpbiBwcmFjdGljZSBtb2RlIGFuZCB3ZSBhcmUgbm90IGluIGEgcGVlciBleGVyY2lzZVxuICAgICAgICAgICAgLy8gYW5kIGFzc2Vzc21lbnRUYWtlbiBpcyB0cnVlXG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgIWVCb29rQ29uZmlnLnByYWN0aWNlX21vZGUgJiZcbiAgICAgICAgICAgICAgICAhZUJvb2tDb25maWcucGVlciAmJlxuICAgICAgICAgICAgICAgIHRoaXMuYXNzZXNzbWVudFRha2VuXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBsZXQgcmVxdWVzdCA9IG5ldyBSZXF1ZXN0KFxuICAgICAgICAgICAgICAgICAgICBgJHtlQm9va0NvbmZpZy5uZXdfc2VydmVyX3ByZWZpeH0vYXNzZXNzbWVudC9yZXN1bHRzYCxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGRhdGEpLFxuICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVyczogdGhpcy5qc29uSGVhZGVycyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHJlcXVlc3QpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgUmVzcG9uc2UgZnJvbSBzZXJ2ZXI6ICR7cmVzcG9uc2Uuc3RhdHVzfWApO1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2Uub2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhID0gZGF0YS5kZXRhaWw7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBgRGF0YSBmcm9tIHNlcnZlcjogJHtKU09OLnN0cmluZ2lmeShkYXRhKX0gY2FsbGluZyByZXBvcHVsYXRlRnJvbVN0b3JhZ2VgLFxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVwb3B1bGF0ZUZyb21TdG9yYWdlKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hdHRlbXB0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBkYXRhLmNvcnJlY3QgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvcnJlY3QgPSBkYXRhLmNvcnJlY3Q7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29ycmVjdCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgcmVzb2x2aW5nIGNoZWNrU2VydmVyIHdpdGggc2VydmVyIGRhdGFgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3NyZXNvbHZlcihcInNlcnZlclwiKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBIVFRQIEVycm9yIGdldHRpbmcgcmVzdWx0czogJHtyZXNwb25zZS5zdGF0dXNUZXh0fWAsXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGVja0xvY2FsU3RvcmFnZSgpOyAvLyBqdXN0IGdvIHJpZ2h0IHRvIGxvY2FsIHN0b3JhZ2VcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGByZXNvbHZpbmcgY2hlY2tTZXJ2ZXIgd2l0aCBsb2NhbCBkYXRhYCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNzcmVzb2x2ZXIoXCJsb2NhbFwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgRXJyb3IgZ2V0dGluZyByZXN1bHRzOiAke2Vycn1gKTtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tMb2NhbFN0b3JhZ2UoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWREYXRhKHt9KTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgcmVzb2x2aW5nIGNoZWNrU2VydmVyIG5vIGFuc3dlciBnaXZlbmApO1xuICAgICAgICAgICAgICAgIHRoaXMuY3NyZXNvbHZlcihcIm5vdCB0YWtlblwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY2hlY2tMb2NhbFN0b3JhZ2UoKTsgLy8ganVzdCBnbyByaWdodCB0byBsb2NhbCBzdG9yYWdlXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgcmVzb2x2aW5nIGNoZWNrU2VydmVyIHdpdGggbG9jYWwgZGF0YWApO1xuICAgICAgICAgICAgdGhpcy5jc3Jlc29sdmVyKFwibG9jYWxcIik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAod2lsbF9iZV9yZWFkeSkge1xuICAgICAgICAgICAgdGhpcy5pbmRpY2F0ZV9jb21wb25lbnRfcmVhZHkoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFRoaXMgbWV0aG9kIGFzc3VtZXMgdGhhdCBgYHRoaXMuY29tcG9uZW50RGl2YGAgcmVmZXJzIHRvIHRoZSBgYGRpdmBgIGNvbnRhaW5pbmcgdGhlIGNvbXBvbmVudCwgYW5kIHRoYXQgdGhpcyBjb21wb25lbnQncyBJRCBpcyBzZXQuXG4gICAgaW5kaWNhdGVfY29tcG9uZW50X3JlYWR5KCkge1xuICAgICAgICAvLyBBZGQgYSBjbGFzcyB0byBpbmRpY2F0ZSB0aGUgY29tcG9uZW50IGlzIG5vdyByZWFkeS5cbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYuY2xhc3NMaXN0LmFkZChcInJ1bmVzdG9uZS1jb21wb25lbnQtcmVhZHlcIik7XG4gICAgICAgIC8vIFJlc29sdmUgdGhlIGBgdGhpcy5jb21wb25lbnRfcmVhZHlfcHJvbWlzZWBgLlxuICAgICAgICB0aGlzLl9jb21wb25lbnRfcmVhZHlfcmVzb2x2ZV9mbigpO1xuICAgIH1cblxuICAgIGxvYWREYXRhKGRhdGEpIHtcbiAgICAgICAgLy8gZm9yIG1vc3QgY2xhc3NlcywgbG9hZERhdGEgZG9lc24ndCBkbyBhbnl0aGluZy4gQnV0IGZvciBQYXJzb25zLCBhbmQgcGVyaGFwcyBvdGhlcnMgaW4gdGhlIGZ1dHVyZSxcbiAgICAgICAgLy8gaW5pdGlhbGl6YXRpb24gY2FuIGhhcHBlbiBldmVuIHdoZW4gdGhlcmUncyBubyBoaXN0b3J5IHRvIGJlIGxvYWRlZFxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZXBvcHVsYXRlRnJvbVN0b3JhZ2UgaXMgY2FsbGVkIGFmdGVyIGEgc3VjY2Vzc2Z1bCBBUEkgY2FsbCBpcyBtYWRlIHRvIGBgZ2V0QXNzZXNzUmVzdWx0c2BgIGluXG4gICAgICogdGhlIGNoZWNrU2VydmVyIG1ldGhvZCBpbiB0aGlzIGNsYXNzXG4gICAgICpcbiAgICAgKiBgYHJlc3RvcmVBbnN3ZXJzLGBgIGBgc2V0TG9jYWxTdG9yYWdlYGAgYW5kIGBgY2hlY2tMb2NhbFN0b3JhZ2VgYCBhcmUgZGVmaW5lZCBpbiB0aGUgY2hpbGQgY2xhc3Nlcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Kn0gZGF0YSAtIGEgSlNPTiBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBkYXRhIG5lZWRlZCB0byByZXN0b3JlIGEgcHJldmlvdXMgYW5zd2VyIGZvciBhIGNvbXBvbmVudFxuICAgICAqIEBwYXJhbSB7Kn0gc3RhdHVzIC0gdGhlIGh0dHAgc3RhdHVzXG4gICAgICogQHBhcmFtIHsqfSB3aGF0ZXZlciAtIGlnbm9yZWRcbiAgICAgKi9cbiAgICByZXBvcHVsYXRlRnJvbVN0b3JhZ2UoZGF0YSkge1xuICAgICAgICAvLyBkZWNpZGUgd2hldGhlciB0byB1c2UgdGhlIHNlcnZlcidzIGFuc3dlciAoaWYgdGhlcmUgaXMgb25lKSBvciB0byBsb2FkIGZyb20gc3RvcmFnZVxuICAgICAgICBpZiAoZGF0YSAhPT0gbnVsbCAmJiBkYXRhICE9PSBcIm5vIGRhdGFcIiAmJiB0aGlzLnNob3VsZFVzZVNlcnZlcihkYXRhKSkge1xuICAgICAgICAgICAgdGhpcy5yZXN0b3JlQW5zd2VycyhkYXRhKTtcbiAgICAgICAgICAgIHRoaXMuc2V0TG9jYWxTdG9yYWdlKGRhdGEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jaGVja0xvY2FsU3RvcmFnZSgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGVjb3JhdGVTdGF0dXMoKTtcbiAgICB9XG4gICAgc2hvdWxkVXNlU2VydmVyKGRhdGEpIHtcbiAgICAgICAgLy8gcmV0dXJucyB0cnVlIGlmIHNlcnZlciBkYXRhIGlzIG1vcmUgcmVjZW50IHRoYW4gbG9jYWwgc3RvcmFnZSBvciBpZiBzZXJ2ZXIgc3RvcmFnZSBpcyBjb3JyZWN0XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIGRhdGEuY29ycmVjdCA9PT0gXCJUXCIgfHxcbiAgICAgICAgICAgIGRhdGEuY29ycmVjdCA9PT0gdHJ1ZSB8fFxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLmxlbmd0aCA9PT0gMCB8fFxuICAgICAgICAgICAgdGhpcy5ncmFkZXJhY3RpdmUgPT09IHRydWUgfHxcbiAgICAgICAgICAgIHRoaXMuaXNUaW1lZFxuICAgICAgICApIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGxldCBleCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMubG9jYWxTdG9yYWdlS2V5KCkpO1xuICAgICAgICBpZiAoZXggPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGxldCBzdG9yZWREYXRhO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgc3RvcmVkRGF0YSA9IEpTT04ucGFyc2UoZXgpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIC8vIGVycm9yIHdoaWxlIHBhcnNpbmc7IGxpa2VseSBkdWUgdG8gYmFkIHZhbHVlIHN0b3JlZCBpbiBzdG9yYWdlXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIubWVzc2FnZSk7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSh0aGlzLmxvY2FsU3RvcmFnZUtleSgpKTtcbiAgICAgICAgICAgIC8vIGRlZmluaXRlbHkgZG9uJ3Qgd2FudCB0byB1c2UgbG9jYWwgc3RvcmFnZSBoZXJlXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGF0YS5hbnN3ZXIgPT0gc3RvcmVkRGF0YS5hbnN3ZXIpIHJldHVybiB0cnVlO1xuICAgICAgICBsZXQgc3RvcmFnZURhdGUgPSBuZXcgRGF0ZShzdG9yZWREYXRhLnRpbWVzdGFtcCk7XG4gICAgICAgIGxldCBzZXJ2ZXJEYXRlID0gbmV3IERhdGUoZGF0YS50aW1lc3RhbXApO1xuICAgICAgICByZXR1cm4gc2VydmVyRGF0ZSA+PSBzdG9yYWdlRGF0ZTtcbiAgICB9XG4gICAgLy8gUmV0dXJuIHRoZSBrZXkgd2hpY2ggdG8gYmUgdXNlZCB3aGVuIGFjY2Vzc2luZyBsb2NhbCBzdG9yYWdlLlxuICAgIGxvY2FsU3RvcmFnZUtleSgpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIGVCb29rQ29uZmlnLmVtYWlsICtcbiAgICAgICAgICAgIFwiOlwiICtcbiAgICAgICAgICAgIGVCb29rQ29uZmlnLmNvdXJzZSArXG4gICAgICAgICAgICBcIjpcIiArXG4gICAgICAgICAgICB0aGlzLmRpdmlkICtcbiAgICAgICAgICAgIFwiLWdpdmVuXCJcbiAgICAgICAgKTtcbiAgICB9XG4gICAgYWRkQ2FwdGlvbihlbFR5cGUpIHtcbiAgICAgICAgLy9zb21lRWxlbWVudC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShuZXdFbGVtZW50LCBzb21lRWxlbWVudC5uZXh0U2libGluZyk7XG4gICAgICAgIGlmICghdGhpcy5pc1RpbWVkKSB7XG4gICAgICAgICAgICB2YXIgY2FwRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgICAgICAgICBpZiAodGhpcy5xdWVzdGlvbl9sYWJlbCkge1xuICAgICAgICAgICAgICAgIC8vIERpc3BsYXkgY2FwdGlvbiBiYXNlZCBvbiB3aGV0aGVyIFJ1bmVzdG9uZSBzZXJ2aWNlcyBoYXZlIGJlZW4gZGV0ZWN0ZWRcbiAgICAgICAgICAgICAgICB0aGlzLmNhcHRpb24gPSBlQm9va0NvbmZpZy51c2VSdW5lc3RvbmVTZXJ2aWNlc1xuICAgICAgICAgICAgICAgICAgICA/IGBBY3Rpdml0eTogJHt0aGlzLnF1ZXN0aW9uX2xhYmVsfSAke3RoaXMuY2FwdGlvbn0gIDxzcGFuIGNsYXNzPVwicnVuZXN0b25lX2NhcHRpb25fZGl2aWRcIj4oJHt0aGlzLmRpdmlkfSk8L3NwYW4+YFxuICAgICAgICAgICAgICAgICAgICA6IGBBY3Rpdml0eTogJHt0aGlzLnF1ZXN0aW9uX2xhYmVsfSAke3RoaXMuY2FwdGlvbn1gOyAvLyBXaXRob3V0IHJ1bmVzdG9uZVxuICAgICAgICAgICAgICAgIGNhcERpdi5pbm5lckhUTUwgPSB0aGlzLmNhcHRpb247XG4gICAgICAgICAgICAgICAgY2FwRGl2LmNsYXNzTGlzdC5hZGQoYCR7ZWxUeXBlfV9jYXB0aW9uYCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIERpc3BsYXkgY2FwdGlvbiBiYXNlZCBvbiB3aGV0aGVyIFJ1bmVzdG9uZSBzZXJ2aWNlcyBoYXZlIGJlZW4gZGV0ZWN0ZWRcbiAgICAgICAgICAgICAgICBjYXBEaXYuaW5uZXJIVE1MID0gZUJvb2tDb25maWcudXNlUnVuZXN0b25lU2VydmljZXNcbiAgICAgICAgICAgICAgICAgICAgPyB0aGlzLmNhcHRpb24gKyBcIiAoXCIgKyB0aGlzLmRpdmlkICsgXCIpXCJcbiAgICAgICAgICAgICAgICAgICAgOiB0aGlzLmNhcHRpb247IC8vIFdpdGhvdXQgcnVuZXN0b25lXG4gICAgICAgICAgICAgICAgY2FwRGl2LmNsYXNzTGlzdC5hZGQoYCR7ZWxUeXBlfV9jYXB0aW9uYCk7XG4gICAgICAgICAgICAgICAgY2FwRGl2LmNsYXNzTGlzdC5hZGQoYCR7ZWxUeXBlfV9jYXB0aW9uX3RleHRgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuY2FwRGl2ID0gY2FwRGl2O1xuICAgICAgICAgICAgLy90aGlzLm91dGVyRGl2LnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGNhcERpdiwgdGhpcy5vdXRlckRpdi5uZXh0U2libGluZyk7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZChjYXBEaXYpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaGFzVXNlckFjdGl2aXR5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pc0Fuc3dlcmVkO1xuICAgIH1cblxuICAgIGNoZWNrQ3VycmVudEFuc3dlcigpIHtcbiAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgICBcIkVhY2ggY29tcG9uZW50IHNob3VsZCBwcm92aWRlIGFuIGltcGxlbWVudGF0aW9uIG9mIGNoZWNrQ3VycmVudEFuc3dlclwiLFxuICAgICAgICApO1xuICAgIH1cblxuICAgIGFzeW5jIGxvZ0N1cnJlbnRBbnN3ZXIoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgICAgXCJFYWNoIGNvbXBvbmVudCBzaG91bGQgcHJvdmlkZSBhbiBpbXBsZW1lbnRhdGlvbiBvZiBsb2dDdXJyZW50QW5zd2VyXCIsXG4gICAgICAgICk7XG4gICAgfVxuICAgIHJlbmRlckZlZWRiYWNrKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAgIFwiRWFjaCBjb21wb25lbnQgc2hvdWxkIHByb3ZpZGUgYW4gaW1wbGVtZW50YXRpb24gb2YgcmVuZGVyRmVlZGJhY2tcIixcbiAgICAgICAgKTtcbiAgICB9XG4gICAgZGlzYWJsZUludGVyYWN0aW9uKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAgIFwiRWFjaCBjb21wb25lbnQgc2hvdWxkIHByb3ZpZGUgYW4gaW1wbGVtZW50YXRpb24gb2YgZGlzYWJsZUludGVyYWN0aW9uXCIsXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiBgJHt0aGlzLmNvbnN0cnVjdG9yLm5hbWV9OiAke3RoaXMuZGl2aWR9YDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBRdWV1ZSBNYXRoSmF4IHJlbmRlcmluZyBmb3IgYGNvbXBvbmVudGAuXG4gICAgICpcbiAgICAgKiBUaGlzIGlzIHRoZSBvbmx5IE1hdGhKYXggZW50cnkgcG9pbnQgaW50ZXJhY3RpdmUgY29tcG9uZW50cyBzaG91bGQgdXNlLlxuICAgICAqIEl0IHdhaXRzIGZvciB0aGUgcGFnZSdzIGluaXRpYWwgTWF0aEpheCBwYXNzIHdoZW4gb25lIGlzIGNvbmZpZ3VyZWQuIFRoZVxuICAgICAqIHJldHVybmVkIHByb21pc2UgYWx3YXlzIHJlc29sdmVzIHRvIGBudWxsYCB3aGVuIE1hdGhKYXggaXMgdW5hdmFpbGFibGVcbiAgICAgKiBvciBmYWlsZWQgdG8gbG9hZCwgYWxsb3dpbmcgY2FsbGVycyB0byBwZXJmb3JtIHRoZWlyIHBvc3QtcmVuZGVyIGxheW91dFxuICAgICAqIGFuZCBhY2Nlc3NpYmlsaXR5IHdvcmsgaW4gYC50aGVuKClgIHdpdGhvdXQgdGhlaXIgb3duIGZlYXR1cmUgY2hlY2tzIG9yXG4gICAgICogcG9sbGluZy4gQSBnZW51aW5lIE1hdGhKYXggdHlwZXNldHRpbmcgZXJyb3Igc3RpbGwgcmVqZWN0cyB0aGUgcHJvbWlzZS5cbiAgICAgKlxuICAgICAqIE1hdGhKYXggNCBjaGFpbnMgYHR5cGVzZXRQcm9taXNlYCBjYWxscyBpdHNlbGYsIHNvIGNhbGxzIHJ1biBpbiB0aGVcbiAgICAgKiBvcmRlciB0aGV5IGFyZSBtYWRlIChpc3N1ZSAjMTU4MikuIE1hdGhKYXggMyBkb2VzIG5vdCwgc28gZm9yIGl0IHRoZVxuICAgICAqIGNhbGxzIGFyZSBjaGFpbmVkIGhlcmUuXG4gICAgICpcbiAgICAgKiBUZW1wbGF0ZXMgdGhhdCBkZWZpbmUgYHdpbmRvdy5ydW5lc3RvbmVNYXRoUmVhZHlgIG11c3Qgc2V0dGxlIGl0IGFmdGVyXG4gICAgICogZWl0aGVyIGEgc3VjY2Vzc2Z1bCBpbml0aWFsIHR5cGVzZXQgb3IgYSBNYXRoSmF4IGxvYWQgZmFpbHVyZS5cbiAgICAgKi9cbiAgICBhc3luYyBxdWV1ZU1hdGhKYXgoY29tcG9uZW50KSB7XG4gICAgICAgIGNvbnN0IG1hdGhKYXggPSBhd2FpdCBnZXRNYXRoSmF4KCk7XG4gICAgICAgIGlmICghbWF0aEpheCkgcmV0dXJuIG51bGw7XG4gICAgICAgIGlmICh0aGlzLnByZWFtYmxlRGl2KSB7XG4gICAgICAgICAgICAvLyBUeXBlc2V0dGluZyB0aGUgcHJlYW1ibGUgcmVnaXN0ZXJzIGl0cyBcXG5ld2NvbW1hbmQgYW5kXG4gICAgICAgICAgICAvLyBcXERlY2xhcmVNYXRoT3BlcmF0b3IgZGVmaW5pdGlvbnMgd2l0aCB0aGUgVGVYIGlucHV0IGpheC5cbiAgICAgICAgICAgIC8vIFRob3NlIGRlZmluaXRpb25zIGFyZSBnbG9iYWwgYW5kIHBlcnNpc3QgZm9yIGV2ZXJ5IGxhdGVyXG4gICAgICAgICAgICAvLyB0eXBlc2V0UHJvbWlzZSBjYWxsIG9uIHRoZSBwYWdlLCBzbyB0aGUgY29tcG9uZW50IGRvZXMgbm90XG4gICAgICAgICAgICAvLyBuZWVkIGl0cyBvd24gY29weSBvZiB0aGUgcHJlYW1ibGUgLS0gc2VlIGlzc3VlICMxMjQ4LCB3aGVyZVxuICAgICAgICAgICAgLy8gcHJlcGVuZGluZyBhIGNvcHkgcHV0IHRoZSByYXcgbWFjcm8gc291cmNlIG9uIHNjcmVlbi5cbiAgICAgICAgICAgIGF3YWl0IHR5cGVzZXQobWF0aEpheCwgW3RoaXMucHJlYW1ibGVEaXZdKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHlwZXNldChtYXRoSmF4LCBbY29tcG9uZW50XSk7XG4gICAgfVxuXG4gICAgZGVjb3JhdGVTdGF0dXMoKSB7XG4gICAgICAgIGlmICh0aGlzLmlzVGltZWQgfHwgZUJvb2tDb25maWcucGVlcikgcmV0dXJuO1xuICAgICAgICBsZXQgcnNEaXYgPSB0aGlzLmNvbnRhaW5lckRpdlxuICAgICAgICAgICAgPyB0aGlzLmNvbnRhaW5lckRpdi5jbG9zZXN0KFwiZGl2LnJ1bmVzdG9uZVwiKVxuICAgICAgICAgICAgOiBudWxsO1xuICAgICAgICBpZiAoIXJzRGl2KSByZXR1cm47XG4gICAgICAgIHJzRGl2LmNsYXNzTGlzdC5yZW1vdmUoXCJub3RBbnN3ZXJlZFwiKTtcbiAgICAgICAgcnNEaXYuY2xhc3NMaXN0LnJlbW92ZShcImlzSW5Db3JyZWN0XCIpO1xuICAgICAgICByc0Rpdi5jbGFzc0xpc3QucmVtb3ZlKFwiaXNDb3JyZWN0XCIpO1xuICAgICAgICBsZXQgYXNzaWdubWVudEluZm8gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcbiAgICAgICAgICAgIGBjdXJyZW50QXNzaWdubWVudEluZm9fJHtlQm9va0NvbmZpZy5jb3Vyc2V9YCxcbiAgICAgICAgKTtcbiAgICAgICAgbGV0IHF1ZXN0aW9ucyA9IFtdO1xuICAgICAgICBpZiAoYXNzaWdubWVudEluZm8pIHtcbiAgICAgICAgICAgIHF1ZXN0aW9ucyA9IEpTT04ucGFyc2UoYXNzaWdubWVudEluZm8pLnF1ZXN0aW9ucztcbiAgICAgICAgfVxuICAgICAgICBpZiAocXVlc3Rpb25zLmluZGV4T2YodGhpcy5kaXZpZCkgPj0gMCkge1xuICAgICAgICAgICAgcnNEaXYuY2xhc3NMaXN0LmFkZChcImlzQXNzaWduZWRcIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY29ycmVjdCkge1xuICAgICAgICAgICAgcnNEaXYuY2xhc3NMaXN0LmFkZChcImlzQ29ycmVjdFwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNvcnJlY3QgPT09IG51bGwgfHwgdHlwZW9mIHRoaXMuY29ycmVjdCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgIHJzRGl2LmNsYXNzTGlzdC5hZGQoXCJub3RBbnN3ZXJlZFwiKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcnNEaXYuY2xhc3NMaXN0LmFkZChcImlzSW5Db3JyZWN0XCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG4vLyBSZXNvbHZlIHRvIHRoZSBwYWdlJ3MgTWF0aEpheCBvbmNlIGl0cyBpbml0aWFsIHR5cGVzZXR0aW5nIHBhc3MgaXMgZG9uZSwgb3Jcbi8vIHRvIG51bGwgd2hlbiBNYXRoSmF4IGlzIG1pc3Npbmcgb3IgZmFpbGVkIHRvIGxvYWQuXG5hc3luYyBmdW5jdGlvbiBnZXRNYXRoSmF4KCkge1xuICAgIC8vIFByZVRlWHQvUnVuZXN0b25lIHBhZ2VzIHJlc29sdmUgdGhpcyBhZnRlciB0aGVpciBpbml0aWFsIHBhZ2UtbGV2ZWxcbiAgICAvLyB0eXBlc2V0dGluZyBwYXNzLiBTdGFuZGFsb25lIHBhZ2VzIGNhbiB1c2UgTWF0aEpheCdzIHN0YXJ0dXAgcHJvbWlzZS5cbiAgICBjb25zdCByZWFkaW5lc3MgPVxuICAgICAgICB3aW5kb3cucnVuZXN0b25lTWF0aFJlYWR5ID8/IGdsb2JhbFRoaXMuTWF0aEpheD8uc3RhcnR1cD8ucHJvbWlzZTtcbiAgICBpZiAocmVhZGluZXNzKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBhd2FpdCByZWFkaW5lc3M7XG4gICAgICAgIH0gY2F0Y2gge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBtYXRoSmF4ID0gZ2xvYmFsVGhpcy5NYXRoSmF4O1xuICAgIHJldHVybiB0eXBlb2YgbWF0aEpheD8udHlwZXNldFByb21pc2UgPT09IFwiZnVuY3Rpb25cIiA/IG1hdGhKYXggOiBudWxsO1xufVxuXG4vLyBNYXRoSmF4IDMgbmVlZHMgb3ZlcmxhcHBpbmcgdHlwZXNldFByb21pc2UgY2FsbHMgY2hhaW5lZCBieSB0aGUgY2FsbGVyLlxubGV0IG1hdGhKYXgzQ2hhaW4gPSBQcm9taXNlLnJlc29sdmUoKTtcblxuZnVuY3Rpb24gdHlwZXNldChtYXRoSmF4LCBlbGVtZW50cykge1xuICAgIGlmICghbWF0aEpheC52ZXJzaW9uPy5zdGFydHNXaXRoKFwiMy5cIikpIHtcbiAgICAgICAgcmV0dXJuIG1hdGhKYXgudHlwZXNldFByb21pc2UoZWxlbWVudHMpO1xuICAgIH1cbiAgICBjb25zdCBydW4gPSBtYXRoSmF4M0NoYWluLnRoZW4oKCkgPT4gbWF0aEpheC50eXBlc2V0UHJvbWlzZShlbGVtZW50cykpO1xuICAgIC8vIEEgZmFpbGVkIHR5cGVzZXQgcmVqZWN0cyBmb3IgaXRzIGNhbGxlciBidXQgbXVzdCBub3Qgc3RhbGwgbGF0ZXIgb25lcy5cbiAgICBtYXRoSmF4M0NoYWluID0gcnVuLmNhdGNoKCgpID0+IHt9KTtcbiAgICByZXR1cm4gcnVuO1xufVxuXG53aW5kb3cuUnVuZXN0b25lQmFzZSA9IFJ1bmVzdG9uZUJhc2U7XG4iLCIvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy8gfGRvY25hbWV8IC0gQSBmcmFtZXdvcmsgYWxsb3dpbmcgYSBSdW5lc3RvbmUgY29tcG9uZW50IHRvIGxvYWQgb25seSB0aGUgSlMgaXQgbmVlZHNcbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyBUaGUgSmF2YVNjcmlwdCByZXF1aXJlZCBieSBhbGwgUnVuZXN0b25lIGNvbXBvbmVudHMgaXMgcXVpdGUgbGFyZ2UgYW5kIHJlc3VsdHMgaW4gc2xvdyBwYWdlIGxvYWRzLiBUaGlzIGFwcHJvYWNoIGVuYWJsZXMgYSBSdW5lc3RvbmUgY29tcG9uZW50IHRvIGxvYWQgb25seSB0aGUgSmF2YVNjcmlwdCBpdCBuZWVkcywgcmF0aGVyIHRoYW4gbG9hZGluZyBKYXZhU2NyaXB0IGZvciBhbGwgdGhlIGNvbXBvbmVudHMgcmVnYXJkbGVzcyBvZiB3aGljaCBhcmUgYWN0dWFsbHkgdXNlZC5cbi8vXG4vLyBUbyBhY2NvbXBsaXNoIHRoaXMsIHdlYnBhY2sncyBzcGxpdC1jaHVua3MgYWJpbGl0eSBhbmFseXplcyBhbGwgSlMsIHN0YXJ0aW5nIGZyb20gdGhpcyBmaWxlLiBUaGUgZHluYW1pYyBpbXBvcnRzIGJlbG93IGFyZSB0cmFuc2Zvcm1lZCBieSB3ZWJwYWNrIGludG8gdGhlIGR5bmFtaWMgZmV0Y2hlcyBvZiBqdXN0IHRoZSBKUyByZXF1aXJlZCBieSBlYWNoIGZpbGUgYW5kIGFsbCBpdHMgZGVwZW5kZW5jaWVzLiAoSWYgdXNpbmcgc3RhdGljIGltcG9ydHMsIHdlYnBhY2sgd2lsbCBhc3N1bWUgdGhhdCBhbGwgZmlsZXMgYXJlIGFscmVhZHkgc3RhdGljYWxseSBsb2FkZWQgdmlhIHNjcmlwdCB0YWdzLCBkZWZlYXRpbmcgdGhlIHB1cnBvc2Ugb2YgdGhpcyBmcmFtZXdvcmsuKVxuLy9cbi8vIEhvd2V2ZXIsIHRoaXMgYXBwcm9hY2ggbGVhZHMgdG8gY29tcGxleGl0eTpcbi8vXG4vLyAtICAgIFRoZSBgYGRhdGEtY29tcG9uZW50YGAgYXR0cmlidXRlIG9mIGVhY2ggY29tcG9uZW50IG11c3QgYmUga2VwdCBpbiBzeW5jIHdpdGggdGhlIGtleXMgb2YgdGhlIGBgbW9kdWxlX21hcGBgIGJlbG93LlxuLy8gLSAgICBUaGUgdmFsdWVzIGluIHRoZSBgYG1vZHVsZV9tYXBgYCBtdXN0IGJlIGtlcHQgaW4gc3luYyB3aXRoIHRoZSBKYXZhU2NyaXB0IGZpbGVzIHdoaWNoIGltcGxlbWVudCBlYWNoIG9mIHRoZSBjb21wb25lbnRzLlxuXG4vLyBTdGF0aWMgaW1wb3J0c1xuLy8gPT09PT09PT09PT09PT1cbi8vIFRoZXNlIGltcG9ydHMgYXJlICh3ZSBhc3N1bWUpIG5lZWRlZCBieSBhbGwgcGFnZXMuIEhvd2V2ZXIsIGl0IHdvdWxkIGJlIG11Y2ggYmV0dGVyIHRvIGxvYWQgdGhlc2UgaW4gdGhlIG1vZHVsZXMgdGhhdCBhY3R1YWxseSB1c2UgdGhlbS5cbi8vXG4vLyBUaGVzZSBhcmUgc3RhdGljIGltcG9ydHM7IGNvZGUgaW4gYGR5bmFtaWNhbGx5IGxvYWRlZCBjb21wb25lbnRzYF8gZGVhbHMgd2l0aCBkeW5hbWljIGltcG9ydHMuXG4vL1xuLy8galF1ZXJ5LXJlbGF0ZWQgaW1wb3J0cy4galF1ZXJ5IFVJIGlzIHN0aWxsIG5lZWRlZCBieSB0aGUgdmVuZG9yZWQgcHl0dXRvclxuLy8gYnVuZGxlIChjb2RlbGVucyk7IHRoZSBqcXVlcnkuaWRsZS10aW1lciBwbHVnaW4gd2FzIGRlYWQgY29kZSBhbmQgaGFzIGJlZW5cbi8vIHJlbW92ZWQuXG5pbXBvcnQgXCJqcXVlcnktdWkvanF1ZXJ5LXVpLmpzXCI7XG5pbXBvcnQgXCJqcXVlcnktdWkvdGhlbWVzL2Jhc2UvanF1ZXJ5LnVpLmFsbC5jc3NcIjtcbi8vIGkxOG4gaXMgbm93IGhhbmRsZWQgYnkgdGhlIGRlcGVuZGVuY3ktZnJlZSBydW5lc3RvbmUvY29tbW9uL2pzL3JzaTE4bi5qcztcbi8vIHRoZSB2ZW5kb3JlZCBXaWtpbWVkaWEganF1ZXJ5LmkxOG4gcGx1Z2luIGhhcyBiZWVuIHJlbW92ZWQuXG5cbi8vIGNvbW1vbiBzdHlsZXMgY29tZSBmcm9tIGhlcmVcbmltcG9ydCBcIi4vcHR4cnMtYm9vdHN0cmFwLmxlc3NcIjtcbi8vIFNlbGYtaG9zdGVkIGljb24gZm9udCBmb3IgdGhlIGBgbWF0ZXJpYWwtc3ltYm9scy1vdXRsaW5lZGBgIHNwYW5zIHRoYXRcbi8vIGNvbXBvbmVudHMgcmVuZGVyOyB3aXRob3V0IGl0IHRoZSBpY29uIG5hbWVzIHNob3cgdXAgYXMgbGl0ZXJhbCB0ZXh0LlxuaW1wb3J0IFwiLi9ydW5lc3RvbmUvY29tbW9uL2Nzcy9tYXRlcmlhbC1zeW1ib2xzLmNzc1wiO1xuLy9pbXBvcnQgXCIuL3J1bmVzdG9uZS9jb21tb24vcHJvamVjdF90ZW1wbGF0ZS9fdGVtcGxhdGVzL3BsdWdpbl9sYXlvdXRzL3NwaGlueF9ib290c3RyYXAvc3RhdGljL2Jvb3RzdHJhcC1zcGhpbnguanNcIjtcblxuLy8gTWlzY1xuaW1wb3J0IFwiLi9ydW5lc3RvbmUvY29tbW9uL2pzL2Jvb2tmdW5jcy5qc1wiO1xuaW1wb3J0IFwiLi9ydW5lc3RvbmUvY29tbW9uL2pzL3VzZXItaGlnaGxpZ2h0cy5qc1wiO1xuaW1wb3J0IFwiLi9ydW5lc3RvbmUvY29tbW9uL2pzL3ByZXRleHQuanNcIjtcblxuLy8gVGhlc2UgYXJlIG9ubHkgbmVlZGVkIGZvciB0aGUgUnVuZXN0b25lIGJvb2ssIGJ1dCBub3QgaW4gYSBsaWJyYXJ5IG1vZGUgKHN1Y2ggYXMgcHJldGV4dCkuIEkgd291bGQgcHJlZmVyIHRvIGR5bmFtaWNhbGx5IGxvYWQgdGhlbS4gSG93ZXZlciwgdGhlc2Ugc2NyaXB0cyBhcmUgc28gc21hbGwgSSBoYXZlbid0IGJvdGhlcmVkIHRvIGRvIHNvLlxuaW1wb3J0IHsgZ2V0U3dpdGNoLCBzd2l0Y2hUaGVtZSB9IGZyb20gXCIuL3J1bmVzdG9uZS9jb21tb24vanMvdGhlbWUuanNcIjtcbmltcG9ydCBcIi4vcnVuZXN0b25lL2NvbW1vbi9qcy9wcmVzZW50ZXJfbW9kZS5qc1wiO1xuaW1wb3J0IFwiLi9ydW5lc3RvbmUvY29tbW9uL2Nzcy9wcmVzZW50ZXJfbW9kZS5sZXNzXCI7XG5pbXBvcnQgeyByZW5kZXJPbmVDb21wb25lbnQgfSBmcm9tIFwiLi9ydW5lc3RvbmUvY29tbW9uL2pzL3JlbmRlckNvbXBvbmVudC5qc1wiO1xuaW1wb3J0IFJ1bmVzdG9uZUJhc2UgZnJvbSBcIi4vcnVuZXN0b25lL2NvbW1vbi9qcy9ydW5lc3RvbmViYXNlLmpzXCI7XG5pbXBvcnQgeyBTcGxpY2VXcmFwcGVyIH0gZnJvbSBcIi4vcnVuZXN0b25lL3NwbGljZS9qcy9zcGxpY2VXcmFwcGVyLnRzXCI7XG5cbi8vIER5bmFtaWNhbGx5IGxvYWRlZCBjb21wb25lbnRzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gVGhpcyBwcm92aWRlcyBhIGxpc3Qgb2YgbW9kdWxlcyB0aGF0IGNvbXBvbmVudHMgY2FuIGR5bmFtaWNhbGx5IGltcG9ydC4gV2VicGFjayB3aWxsIGNyZWF0ZSBhIGxpc3Qgb2YgaW1wb3J0cyBmb3IgZWFjaCBiYXNlZCBvbiBpdHMgYW5hbHlzaXMuXG5jb25zdCBtb2R1bGVfbWFwID0ge1xuICAgIC8vIFdyYXAgZWFjaCBpbXBvcnQgaW4gYSBmdW5jdGlvbiwgc28gdGhhdCBpdCB3b24ndCBvY2N1ciB1bnRpbCB0aGUgZnVuY3Rpb24gaXMgY2FsbGVkLiBXaGlsZSBzb21ldGhpbmcgY2xlYW5lciB3b3VsZCBiZSBuaWNlLCB3ZWJwYWNrIGNhbid0IGFuYWx5emUgdGhpbmdzIGxpa2UgYGBpbXBvcnQoZXhwcmVzc2lvbilgYC5cbiAgICAvL1xuICAgIC8vIFRoZSBrZXlzIG11c3QgbWF0Y2ggdGhlIHZhbHVlIG9mIGVhY2ggY29tcG9uZW50J3MgYGBkYXRhLWNvbXBvbmVudGBgIGF0dHJpYnV0ZSAtLSB0aGUgYGBydW5lc3RvbmVfaW1wb3J0YGAgYW5kIGBgcnVuZXN0b25lX2F1dG9faW1wb3J0YGAgZnVuY3Rpb25zIGFzc3VtZSB0aGlzLlxuICAgIGFjdGl2ZWNvZGU6ICgpID0+IGltcG9ydChcIi4vcnVuZXN0b25lL2FjdGl2ZWNvZGUvanMvYWNmYWN0b3J5LmpzXCIpLFxuICAgIC8vIEFsd2F5cyBpbXBvcnQgdGhlIHRpbWVkIHZlcnNpb24gb2YgYSBjb21wb25lbnQgaWYgYXZhaWxhYmxlLCBzaW5jZSB0aGUgdGltZWQgY29tcG9uZW50cyBhbHNvIGRlZmluZSB0aGUgY29tcG9uZW50J3MgZmFjdG9yeSBhbmQgaW5jbHVkZSB0aGUgY29tcG9uZW50IGFzIHdlbGwuIE5vdGUgdGhhdCBgYGFjZmFjdG9yeWBgIGltcG9ydHMgdGhlIHRpbWVkIGNvbXBvbmVudHMgb2YgQWN0aXZlQ29kZSwgc28gaXQgZm9sbG93cyB0aGlzIHBhdHRlcm4uXG4gICAgY2xpY2thYmxlYXJlYTogKCkgPT5cbiAgICAgICAgaW1wb3J0KFwiLi9ydW5lc3RvbmUvY2xpY2thYmxlQXJlYS9qcy90aW1lZGNsaWNrYWJsZS5qc1wiKSxcbiAgICBjb2RlbGVuczogKCkgPT4gaW1wb3J0KFwiLi9ydW5lc3RvbmUvY29kZWxlbnMvanMvY29kZWxlbnMuanNcIiksXG4gICAgZGF0YWZpbGU6ICgpID0+IGltcG9ydChcIi4vcnVuZXN0b25lL2RhdGFmaWxlL2pzL2RhdGFmaWxlLmpzXCIpLFxuICAgIGRyYWduZHJvcDogKCkgPT4gaW1wb3J0KFwiLi9ydW5lc3RvbmUvZHJhZ25kcm9wL2pzL3RpbWVkZG5kLmpzXCIpLFxuICAgIGZpbGxpbnRoZWJsYW5rOiAoKSA9PiBpbXBvcnQoXCIuL3J1bmVzdG9uZS9maXRiL2pzL3RpbWVkZml0Yi5qc1wiKSxcbiAgICBncm91cHN1YjogKCkgPT4gaW1wb3J0KFwiLi9ydW5lc3RvbmUvZ3JvdXBzdWIvanMvZ3JvdXBzdWIuanNcIiksXG4gICAgbWF0Y2hpbmc6ICgpID0+IGltcG9ydChcIi4vcnVuZXN0b25lL21hdGNoaW5nL2pzL21hdGNoaW5nLmpzXCIpLFxuICAgIG11bHRpcGxlY2hvaWNlOiAoKSA9PiBpbXBvcnQoXCIuL3J1bmVzdG9uZS9tY2hvaWNlL2pzL3RpbWVkbWMuanNcIiksXG4gICAgaHBhcnNvbnM6ICgpID0+IGltcG9ydChcIi4vcnVuZXN0b25lL2hwYXJzb25zL2pzL2hwYXJzb25zLmpzXCIpLFxuICAgIHBhcnNvbnM6ICgpID0+IGltcG9ydChcIi4vcnVuZXN0b25lL3BhcnNvbnMvanMvdGltZWRwYXJzb25zLmpzXCIpLFxuICAgIHBvbGw6ICgpID0+IGltcG9ydChcIi4vcnVuZXN0b25lL3BvbGwvanMvcG9sbC5qc1wiKSxcbiAgICBzZWxlY3RxdWVzdGlvbjogKCkgPT4gaW1wb3J0KFwiLi9ydW5lc3RvbmUvc2VsZWN0cXVlc3Rpb24vanMvc2VsZWN0b25lLmpzXCIpLFxuICAgIHNob3J0YW5zd2VyOiAoKSA9PlxuICAgICAgICBpbXBvcnQoXCIuL3J1bmVzdG9uZS9zaG9ydGFuc3dlci9qcy90aW1lZF9zaG9ydGFuc3dlci5qc1wiKSxcbiAgICBzaG93ZXZhbDogKCkgPT4gaW1wb3J0KFwiLi9ydW5lc3RvbmUvc2hvd2V2YWwvanMvc2hvd0V2YWwuanNcIiksXG4gICAgdGFiYmVkU3R1ZmY6ICgpID0+IGltcG9ydChcIi4vcnVuZXN0b25lL3RhYmJlZFN0dWZmL2pzL3RhYmJlZHN0dWZmLmpzXCIpLFxuICAgIHRpbWVkQXNzZXNzbWVudDogKCkgPT4gaW1wb3J0KFwiLi9ydW5lc3RvbmUvdGltZWQvanMvdGltZWQuanNcIiksXG4gICAgLy8gVE9ETzogc2luY2UgdGhpcyBpc24ndCBpbiBhIGBgZGF0YS1jb21wb25lbnRgYCwgbmVlZCB0byB0cmlnZ2VyIGFuIGltcG9ydCBvZiB0aGlzIGNvZGUgbWFudWFsbHkuXG4gICAgd2Vid29yazogKCkgPT4gaW1wb3J0KFwiLi9ydW5lc3RvbmUvd2Vid29yay9qcy93ZWJ3b3JrLmpzXCIpLFxuICAgIHlvdXR1YmU6ICgpID0+IGltcG9ydChcIi4vcnVuZXN0b25lL3ZpZGVvL2pzL3J1bmVzdG9uZXZpZGVvLmpzXCIpLFxuICAgIGRvZW5ldDogKCkgPT4gUHJvbWlzZS5yZXNvbHZlKCksIC8vIERvZW5ldCBpcyBsb2FkZWQgc2VwYXJhdGVseVxufTtcblxuY29uc3QgbW9kdWxlX21hcF9jYWNoZSA9IHt9O1xuY29uc3QgUVVFVUVfRkxVU0hfVElNRV9NUyA9IDEwO1xuY29uc3QgcXVldWUgPSBbXTtcbmxldCBxdWV1ZUxhc3RGbHVzaCA9IDA7XG4vKipcbiAqIFF1ZXVlIGltcG9ydHMgdGhhdCBhcmUgcmVxdWVzdGVkIHdpdGhpbiBgUVVFVUVfRkxVU0hfVElNRV9NU2Agb2YgZWFjaCBvdGhlci5cbiAqIEFsbCBzdWNoIGltcG9ydHMgYXJlIGltcG9ydGVkIGF0IG9uY2UsIGFuZCB0aGVuIGEgcHJvbWlzZSBpcyBmaXJlZCBhZnRlciBhbGxcbiAqIHRoZSBpbXBvcnRzIGluIHRoZSBxdWV1ZSB3aW5kb3cgaGF2ZSBjb21wbGV0ZWQuXG4gKi9cbmZ1bmN0aW9uIHF1ZXVlSW1wb3J0KGNvbXBvbmVudF9uYW1lKSB7XG4gICAgbGV0IHJlc29sdmUgPSBudWxsO1xuICAgIGxldCByZWplY3QgPSBudWxsO1xuICAgIGNvbnN0IHJldFByb21pc2UgPSBuZXcgUHJvbWlzZSgociwgcmVqKSA9PiB7XG4gICAgICAgIHJlc29sdmUgPSByO1xuICAgICAgICByZWplY3QgPSByZWo7XG4gICAgfSk7XG4gICAgY29uc3QgaXRlbSA9IHsgY29tcG9uZW50X25hbWUsIHJlc29sdmUsIHJlamVjdCB9O1xuICAgIHF1ZXVlLnB1c2goaXRlbSk7XG4gICAgd2luZG93LnNldFRpbWVvdXQoZmx1c2hRdWV1ZSwgUVVFVUVfRkxVU0hfVElNRV9NUyArIDEpO1xuXG4gICAgcmV0dXJuIHJldFByb21pc2U7XG59XG5hc3luYyBmdW5jdGlvbiBmbHVzaFF1ZXVlKCkge1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoRGF0ZS5ub3coKSAtIHF1ZXVlTGFzdEZsdXNoIDwgUVVFVUVfRkxVU0hfVElNRV9NUykge1xuICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmbHVzaFF1ZXVlLCBRVUVVRV9GTFVTSF9USU1FX01TICsgMSk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gSWYgd2UgbWFkZSBpdCBoZXJlLCBpdCBoYXMgYmVlbiBhdCBsZWFzdCBRVUVVRV9GTFVTSF9USU1FX01TIHNpbmNlXG4gICAgLy8gdGhlIGxhc3QgdGltZSB3ZSBmbHVzaGVkIHRoZSBxdWV1ZS4gVGhlcmVmb3JlLCB3ZSBzaG91bGQgc3RhcnQgZmx1c2hpbmcuXG4gICAgLy8gV2UgY29weSBldmVyeXRoaW5nIHdlIGZsdXNoIGFuZCBlbXB0eSB0aGUgYXJyYXkgZmlyc3QuXG4gICAgcXVldWVMYXN0Rmx1c2ggPSBEYXRlLm5vdygpO1xuICAgIGNvbnN0IHRvRmx1c2ggPSBbLi4ucXVldWVdO1xuICAgIHF1ZXVlLmxlbmd0aCA9IDA7XG4gICAgY29uc29sZS5sb2coXG4gICAgICAgIFwiV2VicGFjayBpcyBzdGFydGluZyB0aGUgbG9hZGluZyBwcm9jZXNzIGZvciB0aGUgZm9sbG93aW5nIFJ1bmVzdG9uZSBtb2R1bGVzXCIsXG4gICAgICAgIHRvRmx1c2gubWFwKChpdGVtKSA9PiBpdGVtLmNvbXBvbmVudF9uYW1lKSxcbiAgICApO1xuICAgIGNvbnN0IGZsdXNoZWRQcm9taXNlID0gdG9GbHVzaC5tYXAoYXN5bmMgKGl0ZW0pID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGF3YWl0IG1vZHVsZV9tYXBbaXRlbS5jb21wb25lbnRfbmFtZV0oKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgICAgICAgIGBSdW5lc3RvbmUgY29tcG9uZW50ICR7aXRlbS5jb21wb25lbnRfbmFtZX0gaGFzIGJlZW4gbG9hZGVkYCxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gaXRlbTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgaXRlbS5yZWplY3QoZSk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCBmbHVzaGVkID0gYXdhaXQgUHJvbWlzZS5hbGwoZmx1c2hlZFByb21pc2UpO1xuICAgIHRyeSB7XG4gICAgICAgIGZsdXNoZWQuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgaWYgKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICBpdGVtLnJlc29sdmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgIH1cbn1cblxuLy8gLi4gX2R5bmFtaWMgaW1wb3J0IG1hY2hpbmVyeTpcbi8vXG4vLyBEeW5hbWljIGltcG9ydCBtYWNoaW5lcnlcbi8vID09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gRnVsZmlsbCBhIHByb21pc2Ugd2hlbiB0aGUgUnVuZXN0b25lIHByZS1sb2dpbiBjb21wbGV0ZSBldmVudCBvY2N1cnMuXG5sZXQgcHJlX2xvZ2luX2NvbXBsZXRlX3Byb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwicnVuZXN0b25lOnByZS1sb2dpbi1jb21wbGV0ZVwiLCByZXNvbHZlKSxcbik7XG5sZXQgbG9hZGVkQ29tcG9uZW50cztcbi8vIFByb3ZpZGUgYSBzaW1wbGUgZnVuY3Rpb24gdG8gaW1wb3J0IHRoZSBKUyBmb3IgYWxsIGNvbXBvbmVudHMgb24gdGhlIHBhZ2UuXG5leHBvcnQgZnVuY3Rpb24gcnVuZXN0b25lX2F1dG9faW1wb3J0KCkge1xuICAgIC8vIENyZWF0ZSBhIHNldCBvZiBgYGRhdGEtY29tcG9uZW50YGAgdmFsdWVzLCB0byBhdm9pZCBkdXBsaWNhdGlvbi5cbiAgICBjb25zdCBzID0gbmV3IFNldChcbiAgICAgICAgLy8gQWxsIFJ1bmVzdG9uZSBjb21wb25lbnRzIGhhdmUgYSBgYGRhdGEtY29tcG9uZW50YGAgYXR0cmlidXRlLlxuICAgICAgICBbLi4uZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIltkYXRhLWNvbXBvbmVudF1cIildLm1hcCgoZWxlbWVudCkgPT5cbiAgICAgICAgICAgIGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiZGF0YS1jb21wb25lbnRcIiksXG4gICAgICAgICksXG4gICAgKTtcbiAgICAvLyB3ZWJ3b3JrIHF1ZXN0aW9ucyBhcmUgbm90IHdyYXBwZWQgaW4gZGl2IHdpdGggYSBkYXRhLWNvbXBvbmVudCBzbyB3ZSBoYXZlIHRvIGNoZWNrIGEgZGlmZmVyZW50IHdheVxuICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLndlYndvcmstYnV0dG9uXCIpKSB7XG4gICAgICAgIHMuYWRkKFwid2Vid29ya1wiKTtcbiAgICB9XG5cbiAgICAvLyBMb2FkIEpTIGZvciBlYWNoIG9mIHRoZSBjb21wb25lbnRzIGZvdW5kLlxuICAgIGNvbnN0IGEgPSBbLi4uc10ubWFwKCh2YWx1ZSkgPT4ge1xuICAgICAgICBsZXQgejtcbiAgICAgICAgY29uc29sZS5sb2coYExvYWRpbmcgUnVuZXN0b25lIGNvbXBvbmVudDogJHt2YWx1ZX1gKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHogPSAobW9kdWxlX21hcFt2YWx1ZV0gfHwgKCgpID0+IFByb21pc2UucmVzb2x2ZSgpKSkoKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihgRXJyb3IgbG9hZGluZyAke3ZhbHVlfTpgLCBlKTtcbiAgICAgICAgfVxuICAgICAgICB6LmVycm9yID0gKG1zZykgPT4gY29uc29sZS5lcnJvcihgRXJyb3IgaW4gJHt2YWx1ZX06YCwgbXNnKTtcbiAgICAgICAgcmV0dXJuIHo7XG4gICAgfSk7XG5cbiAgICAvLyBTZW5kIHRoZSBSdW5lc3RvbmUgbG9naW4gY29tcGxldGUgZXZlbnQgd2hlbiBhbGwgSlMgaXMgbG9hZGVkIGFuZCB0aGUgcHJlLWxvZ2luIGlzIGFsc28gY29tcGxldGUuXG4gICAgUHJvbWlzZS5hbGwoW3ByZV9sb2dpbl9jb21wbGV0ZV9wcm9taXNlLCAuLi5hXSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghZG9jdW1lbnQuYm9keS5kYXRhc2V0LnJlYWN0SW5Vc2UpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KFwicnVuZXN0b25lOmxvZ2luLWNvbXBsZXRlXCIpKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5wcmVfbG9naW5fY29tcGxldGVfcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICBjb25zb2xlLmxvZyhcIlJ1bmVzdG9uZSBwcmUtbG9naW4gY29tcGxldGVcIik7XG59KTtcblxuLy8gTG9hZCBjb21wb25lbnQgSlMgd2hlbiB0aGUgZG9jdW1lbnQgaXMgcmVhZHkuXG5pZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gXCJsb2FkaW5nXCIpIHtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBydW5lc3RvbmVfYXV0b19pbXBvcnQpO1xufSBlbHNlIHtcbiAgICBydW5lc3RvbmVfYXV0b19pbXBvcnQoKTtcbn1cblxuLy8gUHJvdmlkZSBhIGZ1bmN0aW9uIHRvIGltcG9ydCBvbmUgc3BlY2lmaWMgYFJ1bmVzdG9uZWAgY29tcG9uZW50LlxuLy8gdGhlIGltcG9ydCBmdW5jdGlvbiBpbnNpZGUgbW9kdWxlX21hcCBpcyBhc3luYyAtLSBydW5lc3RvbmVfaW1wb3J0XG4vLyBzaG91bGQgYmUgYXdhaXRlZCB3aGVuIG5lY2Vzc2FyeSB0byBlbnN1cmUgdGhlIGltcG9ydCBjb21wbGV0ZXNcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBydW5lc3RvbmVfaW1wb3J0KGNvbXBvbmVudF9uYW1lKSB7XG4gICAgaWYgKG1vZHVsZV9tYXBfY2FjaGVbY29tcG9uZW50X25hbWVdKSB7XG4gICAgICAgIHJldHVybiBtb2R1bGVfbWFwX2NhY2hlW2NvbXBvbmVudF9uYW1lXTtcbiAgICB9XG4gICAgY29uc29sZS5sb2coXG4gICAgICAgIGBSdW5lc3RvbmUgY29tcG9uZW50ICR7Y29tcG9uZW50X25hbWV9IGlzIGJlaW5nIHF1ZXVlZCBmb3IgaW1wb3J0YCxcbiAgICApO1xuICAgIGNvbnN0IHByb21pc2UgPSBxdWV1ZUltcG9ydChjb21wb25lbnRfbmFtZSk7XG4gICAgbW9kdWxlX21hcF9jYWNoZVtjb21wb25lbnRfbmFtZV0gPSBwcm9taXNlO1xuICAgIHJldHVybiBwcm9taXNlO1xufVxuXG5hc3luYyBmdW5jdGlvbiBwb3B1cFNjcmF0Y2hBQygpIHtcbiAgICAvLyBsb2FkIHRoZSBhY3RpdmVjb2RlIGJ1bmRsZVxuICAgIGF3YWl0IHJ1bmVzdG9uZV9pbXBvcnQoXCJhY3RpdmVjb2RlXCIpO1xuICAgIC8vIHNjcmF0Y2hEaXYgd2lsbCBiZSBkZWZpbmVkIGlmIHdlIGhhdmUgYWxyZWFkeSBjcmVhdGVkIGEgc2NyYXRjaFxuICAgIC8vIGFjdGl2ZWNvZGUuICBJZiBpdHMgbm90IGRlZmluZWQgdGhlbiB3ZSBuZWVkIHRvIGdldCBpdCByZWFkeSB0byB0b2dnbGVcbiAgICBpZiAoIWVCb29rQ29uZmlnLnNjcmF0Y2hEaXYpIHtcbiAgICAgICAgd2luZG93LkFDRmFjdG9yeS5jcmVhdGVTY3JhdGNoQWN0aXZlY29kZSgpO1xuICAgICAgICBsZXQgZGl2aWQgPSBlQm9va0NvbmZpZy5zY3JhdGNoRGl2O1xuICAgICAgICB3aW5kb3cuY29tcG9uZW50TWFwW2RpdmlkXSA9IEFDRmFjdG9yeS5jcmVhdGVBY3RpdmVDb2RlKFxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZGl2aWQpLFxuICAgICAgICAgICAgZUJvb2tDb25maWcuYWNEZWZhdWx0TGFuZ3VhZ2UsXG4gICAgICAgICk7XG4gICAgICAgIGlmIChlQm9va0NvbmZpZy5pc0xvZ2dlZEluKSB7XG4gICAgICAgICAgICB3aW5kb3cuY29tcG9uZW50TWFwW2RpdmlkXS5lbmFibGVTYXZlTG9hZCgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB3aW5kb3cuQUNGYWN0b3J5LnRvZ2dsZVNjcmF0Y2hBY3RpdmVjb2RlKCk7XG4gICAgfSwgMTAwKTtcbn1cblxuLy8gU2V0IHRoZSBkaXJlY3RvcnkgY29udGFpbmluZyB0aGlzIHNjcmlwdCBhcyB0aGUgYHBhdGggPGh0dHBzOi8vd2VicGFjay5qcy5vcmcvZ3VpZGVzL3B1YmxpYy1wYXRoLyNvbi10aGUtZmx5PmBfIGZvciBhbGwgd2VicGFja2VkIHNjcmlwdHMuXG5jb25zdCBzY3JpcHRfc3JjID0gZG9jdW1lbnQuY3VycmVudFNjcmlwdC5zcmM7XG5fX3dlYnBhY2tfcHVibGljX3BhdGhfXyA9IHNjcmlwdF9zcmMuc3Vic3RyaW5nKFxuICAgIDAsXG4gICAgc2NyaXB0X3NyYy5sYXN0SW5kZXhPZihcIi9cIikgKyAxLFxuKTtcblxudmFyIHNwbGljZSA9IG5ldyBTcGxpY2VXcmFwcGVyKCk7XG4vLyBUaGUgZ3JhZGluZyBpbnRlcmZhY2UgbmVlZHMgdGhlIHNpbmdsZXRvbiBzbyBpdCBjYW4gcmVnaXN0ZXIgdGhlIGlmcmFtZXMgaXRcbi8vIGlzIGRpc3BsYXlpbmc7IHNlZSBTcGxpY2VXcmFwcGVyLnJlZ2lzdGVyR3JhZGVyRnJhbWUuXG53aW5kb3cuc3BsaWNlV3JhcHBlciA9IHNwbGljZTtcblxuLy8gTWFudWFsIGV4cG9ydHNcbi8vID09PT09PT09PT09PT09XG4vLyBXZWJwYWNrJ3MgYGBvdXRwdXQubGlicmFyeWBgIHNldHRpbmcgZG9lc24ndCBzZWVtIHRvIHdvcmsgd2l0aCB0aGUgc3BsaXQgY2h1bmtzIHBsdWdpbjsgZG8gYWxsIGV4cG9ydHMgbWFudWFsbHkgdGhyb3VnaCB0aGUgYGB3aW5kb3dgYCBvYmplY3QgaW5zdGVhZC5cblxuY29uc3QgcmMgPSB7fTtcbnJjLnJ1bmVzdG9uZV9pbXBvcnQgPSBydW5lc3RvbmVfaW1wb3J0O1xucmMucnVuZXN0b25lX2F1dG9faW1wb3J0ID0gcnVuZXN0b25lX2F1dG9faW1wb3J0O1xucmMuZ2V0U3dpdGNoID0gZ2V0U3dpdGNoO1xucmMuc3dpdGNoVGhlbWUgPSBzd2l0Y2hUaGVtZTtcbnJjLnBvcHVwU2NyYXRjaEFDID0gcG9wdXBTY3JhdGNoQUM7XG5yYy5yZW5kZXJPbmVDb21wb25lbnQgPSByZW5kZXJPbmVDb21wb25lbnQ7XG53aW5kb3cuY29tcG9uZW50TWFwID0ge307XG53aW5kb3cucnVuZXN0b25lQ29tcG9uZW50cyA9IHJjO1xuIiwiLyoqXG4gKlxuICogVXNlcjogYm1pbGxlclxuICogT3JpZ2luYWw6IDIwMTEtMDQtMjBcbiAqIERhdGU6IDIwMTktMDYtMTRcbiAqIFRpbWU6IDI6MDEgUE1cbiAqIFRoaXMgY2hhbmdlIG1hcmtzIHRoZSBiZWdpbm5pbmcgb2YgdmVyc2lvbiA0LjAgb2YgdGhlIHJ1bmVzdG9uZSBjb21wb25lbnRzXG4gKiBMb2dpbi9sb2dvdXQgaXMgbm8gbG9uZ2VyIGhhbmRsZWQgdGhyb3VnaCBqYXZhc2NyaXB0IGJ1dCByYXRoZXIgc2VydmVyIHNpZGUuXG4gKiBNYW55IG9mIHRoZSBjb21wb25lbnRzIGRlcGVuZCBvbiB0aGUgcnVuZXN0b25lOmxvZ2luIGV2ZW50IHNvIHdlIHdpbGwga2VlcCB0aGF0XG4gKiBmb3Igbm93IHRvIGtlZXAgdGhlIGNodXJuIGZhaXJseSBtaW5pbWFsLlxuICovXG5cbi8qXG5cbiBDb3B5cmlnaHQgKEMpIDIwMTEgIEJyYWQgTWlsbGVyICBib25lbGFrZUBnbWFpbC5jb21cblxuIFRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cbiBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG4gWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cblxuICovXG5cbmltcG9ydCBSdW5lc3RvbmVCYXNlIGZyb20gXCIuL3J1bmVzdG9uZWJhc2UuanNcIjtcbmltcG9ydCB7IG1hcmtlZCB9IGZyb20gXCJtYXJrZWRcIjtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBTZXJ2ZXItc3VwcGxpZWQgZUJvb2tDb25maWcgdmFsdWVzIChpc3N1ZSAjMTM5Milcbi8vXG4vLyBBIFByZVRlWHQgcGFnZSBzZXJ2ZWQgYnkgYSBSdW5lc3RvbmUgc2VydmVyIHNldHMgYGBlYm9va19jb25maWdfb3ZlcnJpZGVgYFxuLy8gcmlnaHQgYWZ0ZXIgdGhlIGJvb2sgdGVtcGxhdGUncyBvd24gZUJvb2tDb25maWcgYXNzaWdubWVudHMuICBUaGUgc2VydmVyIGlzXG4vLyB0aGUgYXV0aG9yaXR5IGZvciB0aG9zZSB2YWx1ZXMgKGNvdXJzZSwgdXNlciwgYWN0aXZpdGllcywgLi4uKSwgc28gdGhleSB3aW5cbi8vIG92ZXIgd2hhdGV2ZXIgdGhlIHRlbXBsYXRlIHdyb3RlLiAgVGhpcyBydW5zIHdoZW4gdGhlIG1vZHVsZSBpcyBldmFsdWF0ZWQsXG4vLyBiZWZvcmUgYW55dGhpbmcgZWxzZSByZWFkcyBlQm9va0NvbmZpZy5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZXhwb3J0IGZ1bmN0aW9uIGFwcGx5RWJvb2tDb25maWdPdmVycmlkZSgpIHtcbiAgICBjb25zdCBvdmVycmlkZSA9IHdpbmRvdy5lYm9va19jb25maWdfb3ZlcnJpZGU7XG4gICAgaWYgKG92ZXJyaWRlICYmIHR5cGVvZiBvdmVycmlkZSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICB3aW5kb3cuZUJvb2tDb25maWcgPSBPYmplY3QuYXNzaWduKHdpbmRvdy5lQm9va0NvbmZpZyB8fCB7fSwgb3ZlcnJpZGUpO1xuICAgIH1cbn1cbmFwcGx5RWJvb2tDb25maWdPdmVycmlkZSgpO1xuXG52YXIgcmIgPSBuZXcgUnVuZXN0b25lQmFzZSgpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIENvbnNvbGUgY2FwdHVyZSBmb3IgcHJvYmxlbSByZXBvcnRzXG4vL1xuLy8gVGhlIGJyb3dzZXIgZ2l2ZXMgcGFnZSBzY3JpcHRzIG5vIHdheSB0byByZWFkIHdoYXQgaXMgYWxyZWFkeSBpbiB0aGUgZGV2dG9vbHNcbi8vIGNvbnNvbGUsIHNvIHdlIGJ1ZmZlciBjb25zb2xlIG91dHB1dCBvdXJzZWx2ZXMgZnJvbSB0aGUgbW9tZW50IHRoaXMgbW9kdWxlIGlzXG4vLyBldmFsdWF0ZWQuICBUaGUgYnVmZmVyIGlzIHdyaXR0ZW4gdGhyb3VnaCB0byBzZXNzaW9uU3RvcmFnZSAoZGVib3VuY2VkLCBhbmRcbi8vIGFnYWluIG9uIHBhZ2VoaWRlKSBzbyB0aGUgXCJSZXBvcnQgYSBQcm9ibGVtXCIgZm9ybSBjYW4gYWx3YXlzIHJlYWQgaXQgYmFja1xuLy8gaW50byBhIGhpZGRlbiBmaWVsZCwgbGV0dGluZyByZWNlbnQgbG9nIG91dHB1dCBhbmQgdW5jYXVnaHQgZXJyb3JzIHJpZGUgYWxvbmdcbi8vIHdpdGggdGhlIHJlcG9ydC4gIFdlIGNhbid0IHJlbHkgb24gc3Rhc2hpbmcgaXQgb25seSB3aGVuIHRoZSBQcm9ibGVtIFJlcG9ydFxuLy8gbGluayBpcyBjbGlja2VkOiBhIGJlZm9yZXVubG9hZCBcIkxlYXZlIHNpdGU/XCIgcHJvbXB0IChlLmcuIGZyb20gdGltZWQgZXhhbXMpXG4vLyBjYW4gZ2V0IGluIHRoZSB3YXkgb2YgdGhhdC5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZXhwb3J0IGNvbnN0IFJTX0NPTlNPTEVfTE9HX0tFWSA9IFwicnNfY29uc29sZV9sb2dcIjtcbmNvbnN0IFJTX0xPR19CVUZGRVJfTUFYID0gMjAwO1xuY29uc3QgUlNfTE9HX1BFUlNJU1RfREVMQVlfTVMgPSA1MDA7XG5jb25zdCByc0NvbnNvbGVCdWZmZXIgPSBbXTtcbmxldCByc1BlcnNpc3RUaW1lciA9IG51bGw7XG5cbmZ1bmN0aW9uIHJzUGVyc2lzdENvbnNvbGVMb2coKSB7XG4gICAgaWYgKHJzUGVyc2lzdFRpbWVyKSB7XG4gICAgICAgIGNsZWFyVGltZW91dChyc1BlcnNpc3RUaW1lcik7XG4gICAgICAgIHJzUGVyc2lzdFRpbWVyID0gbnVsbDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShSU19DT05TT0xFX0xPR19LRVksIHJzR2V0Q29uc29sZUxvZygpKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIHNlc3Npb25TdG9yYWdlIG1heSBiZSB1bmF2YWlsYWJsZSAoZS5nLiBwcml2YXRlIG1vZGUpIG9yIGZ1bGw7IHRoZVxuICAgICAgICAvLyByZXBvcnQgZm9ybSBzaW1wbHkgd29uJ3QgYmUgcHJlZmlsbGVkIHdpdGggdGhlIGxvZy5cbiAgICB9XG59XG5cbmZ1bmN0aW9uIHJzU2NoZWR1bGVQZXJzaXN0KCkge1xuICAgIGlmICghcnNQZXJzaXN0VGltZXIpIHtcbiAgICAgICAgcnNQZXJzaXN0VGltZXIgPSBzZXRUaW1lb3V0KFxuICAgICAgICAgICAgcnNQZXJzaXN0Q29uc29sZUxvZyxcbiAgICAgICAgICAgIFJTX0xPR19QRVJTSVNUX0RFTEFZX01TLFxuICAgICAgICApO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gcnNGb3JtYXRMb2dBcmcoYXJnKSB7XG4gICAgaWYgKHR5cGVvZiBhcmcgPT09IFwic3RyaW5nXCIpIHJldHVybiBhcmc7XG4gICAgaWYgKGFyZyBpbnN0YW5jZW9mIEVycm9yKSByZXR1cm4gYCR7YXJnLm5hbWV9OiAke2FyZy5tZXNzYWdlfWA7XG4gICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGFyZyk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZXR1cm4gU3RyaW5nKGFyZyk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiByc1JlY29yZExvZyhsZXZlbCwgYXJncykge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGxpbmUgPSBgWyR7bGV2ZWx9XSAke0FycmF5LmZyb20oYXJncykubWFwKHJzRm9ybWF0TG9nQXJnKS5qb2luKFwiIFwiKX1gO1xuICAgICAgICByc0NvbnNvbGVCdWZmZXIucHVzaChsaW5lKTtcbiAgICAgICAgaWYgKHJzQ29uc29sZUJ1ZmZlci5sZW5ndGggPiBSU19MT0dfQlVGRkVSX01BWCkgcnNDb25zb2xlQnVmZmVyLnNoaWZ0KCk7XG4gICAgICAgIHJzU2NoZWR1bGVQZXJzaXN0KCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBOZXZlciBsZXQgbG9nIGNhcHR1cmUgdGhyb3cgYW5kIGJyZWFrIHRoZSBwYWdlLlxuICAgIH1cbn1cblxuKGZ1bmN0aW9uIGluc3RhbGxDb25zb2xlQ2FwdHVyZSgpIHtcbiAgICBpZiAod2luZG93Ll9fcnNDb25zb2xlQ2FwdHVyZUluc3RhbGxlZCkgcmV0dXJuO1xuICAgIHdpbmRvdy5fX3JzQ29uc29sZUNhcHR1cmVJbnN0YWxsZWQgPSB0cnVlO1xuICAgIGZvciAoY29uc3QgbGV2ZWwgb2YgW1wibG9nXCIsIFwiaW5mb1wiLCBcIndhcm5cIiwgXCJlcnJvclwiXSkge1xuICAgICAgICBjb25zdCBvcmlnID0gY29uc29sZVtsZXZlbF0gPyBjb25zb2xlW2xldmVsXS5iaW5kKGNvbnNvbGUpIDogbnVsbDtcbiAgICAgICAgY29uc29sZVtsZXZlbF0gPSBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgICAgICAgICAgcnNSZWNvcmRMb2cobGV2ZWwsIGFyZ3MpO1xuICAgICAgICAgICAgaWYgKG9yaWcpIG9yaWcoLi4uYXJncyk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIC8vIGNvbnNvbGUubG9nKCkgbmV2ZXIgc2VlcyB1bmNhdWdodCBlcnJvcnMgb3IgcmVqZWN0ZWQgcHJvbWlzZXMsIHNvIGxpc3RlblxuICAgIC8vIGZvciB0aG9zZSBkaXJlY3RseS5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImVycm9yXCIsIChlKSA9PiB7XG4gICAgICAgIGlmIChlLm1lc3NhZ2UpIHtcbiAgICAgICAgICAgIHJzUmVjb3JkTG9nKFwidW5jYXVnaHRcIiwgW1xuICAgICAgICAgICAgICAgIGAke2UubWVzc2FnZX0gQCAke2UuZmlsZW5hbWUgfHwgXCI/XCJ9OiR7ZS5saW5lbm8gfHwgXCI/XCJ9YCxcbiAgICAgICAgICAgIF0pO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJ1bmhhbmRsZWRyZWplY3Rpb25cIiwgKGUpID0+IHtcbiAgICAgICAgcnNSZWNvcmRMb2coXCJwcm9taXNlXCIsIFtyc0Zvcm1hdExvZ0FyZyhlLnJlYXNvbildKTtcbiAgICB9KTtcbiAgICAvLyBDYXRjaCBhbnl0aGluZyBsb2dnZWQgaW5zaWRlIHRoZSBkZWJvdW5jZSB3aW5kb3cgYmVmb3JlIHdlIG5hdmlnYXRlIGF3YXkuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJwYWdlaGlkZVwiLCByc1BlcnNpc3RDb25zb2xlTG9nKTtcbn0pKCk7XG5cbi8qKiBSZWNlbnQgYnVmZmVyZWQgY29uc29sZSBvdXRwdXQsIG5ld2VzdCBsYXN0LCBhcyBhIHNpbmdsZSBzdHJpbmcuICovXG5leHBvcnQgZnVuY3Rpb24gcnNHZXRDb25zb2xlTG9nKCkge1xuICAgIHJldHVybiByc0NvbnNvbGVCdWZmZXIuam9pbihcIlxcblwiKTtcbn1cblxuLy9cbi8vIFBhZ2UgZGVjb3JhdGlvbiBmdW5jdGlvbnNcbi8vXG4vKlxuTWF5YmUgc29tZXRoaW5nIGxpa2UgdGhpcyBhdCB0aGUgdG9wOlxuXG5BY3RpdmUgYXNzaWdubWVudDogW0NoIDE1IHJlYWRpbmddICAgICAgW0V4aXQgYXNzaWdubWVudCBsaW5rXVxuT24gcGFnZSAoMyBvZiA3KSBbU2VsZWN0IGlucHV0IHNob3dpbmcgY3VycmVudCBwYWdlLCBjYW4gc2VsZWN0IG90aGVyc11cbkJlY29taW5nIHRoaXMgaWYgbm90IG9uIGEgcGFnZSBpbiBhc3NpZ25tZW50XG5cbkFjdGl2ZSBhc3NpZ25tZW50OiBbQ2ggMTUgcmVhZGluZ10gICAgICBbRXhpdCBhc3NpZ25tZW50IGxpbmtdXG5UaGlzIHBhZ2UgaXMgbm90IHBhcnQgb2YgdGhhdCBhc3NpZ25tZW50LiBTZWxlY3QgYSBwYWdlIHRvIHJldHVybiB0byBpdDpcbltTZWxlY3QgaW5wdXRdXG4qL1xuZnVuY3Rpb24gYWRkUmVhZGluZ0xpc3QoKSB7XG4gICAgbGV0IGFzc2lnbm1lbnRfaW5mb19zdHJpbmcgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcbiAgICAgICAgYGN1cnJlbnRBc3NpZ25tZW50SW5mb18ke2VCb29rQ29uZmlnLmNvdXJzZX1gLFxuICAgICk7XG5cbiAgICBpZiAoYXNzaWdubWVudF9pbmZvX3N0cmluZyAmJiBlQm9va0NvbmZpZy5yZWFkaW5ncykge1xuICAgICAgICB2YXIgdG9wLFxuICAgICAgICAgICAgYm90dG9tLFxuICAgICAgICAgICAgYWN0aXZlLFxuICAgICAgICAgICAgcGFnZV9uYW1lLFxuICAgICAgICAgICAgZXhpdF9saW5rLFxuICAgICAgICAgICAgZnN0LFxuICAgICAgICAgICAgc25kLFxuICAgICAgICAgICAgbmV3X3BvcyxcbiAgICAgICAgICAgIHBhdGhfcGFydHMsXG4gICAgICAgICAgICBuZXdfcG9zX2xpbms7XG4gICAgICAgIHZhciBhc3NpZ25tZW50X2luZm8gPSBKU09OLnBhcnNlKGFzc2lnbm1lbnRfaW5mb19zdHJpbmcpO1xuICAgICAgICBsZXQgYXNzaWdubWVudF9pZCA9IGFzc2lnbm1lbnRfaW5mby5pZDtcbiAgICAgICAgbGV0IGFzc2lnbm1lbnRfbmFtZSA9IGFzc2lnbm1lbnRfaW5mby5uYW1lO1xuICAgICAgICBsZXQgcmVhZGluZ19uYW1lcyA9IGFzc2lnbm1lbnRfaW5mby5yZWFkaW5nTmFtZXM7XG5cbiAgICAgICAgYWN0aXZlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgYWN0aXZlLnRleHRDb250ZW50ID0gXCJBY3RpdmUgYXNzaWdubWVudDogXCI7XG5cbiAgICAgICAgcGFnZV9uYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XG4gICAgICAgIHBhZ2VfbmFtZS50ZXh0Q29udGVudCA9IGFzc2lnbm1lbnRfbmFtZTtcbiAgICAgICAgcGFnZV9uYW1lLmhyZWYgPSBgL2Fzc2lnbm1lbnQvc3R1ZGVudC9kb0Fzc2lnbm1lbnQ/YXNzaWdubWVudF9pZD0ke2Fzc2lnbm1lbnRfaWR9YDtcblxuICAgICAgICBhY3RpdmUuYXBwZW5kKHBhZ2VfbmFtZSk7XG5cbiAgICAgICAgZXhpdF9saW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XG4gICAgICAgIGV4aXRfbGluay50ZXh0Q29udGVudCA9IFwiIEV4aXQgQXNzaWdubWVudFwiO1xuICAgICAgICBleGl0X2xpbmsuaHJlZiA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZTtcblxuICAgICAgICBleGl0X2xpbmsuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXG4gICAgICAgICAgICAgICAgYGN1cnJlbnRBc3NpZ25tZW50SW5mb18ke2VCb29rQ29uZmlnLmNvdXJzZX1gLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy9hY3RpdmUuYXBwZW5kKGV4aXRfbGluaylcblxuICAgICAgICBsZXQgY3VyX3BhdGhfcGFydHMgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuc3BsaXQoXCIvXCIpO1xuICAgICAgICBsZXQgbmFtZSA9XG4gICAgICAgICAgICBjdXJfcGF0aF9wYXJ0c1tjdXJfcGF0aF9wYXJ0cy5sZW5ndGggLSAyXSArXG4gICAgICAgICAgICBcIi9cIiArXG4gICAgICAgICAgICBjdXJfcGF0aF9wYXJ0c1tjdXJfcGF0aF9wYXJ0cy5sZW5ndGggLSAxXTtcbiAgICAgICAgLy8gaWYgYm9keSBoYXMgcHJldGV4dCBjbGFzcywgdGhlbiBzdHJpcCB0aGUgbGVhZGluZyBwYXRoIHBhcnRzIGZyb20gZWFjaCBvZiB0aGUgc3RyaW5ncyBpbiBlQm9va0NvbmZpZy5yZWFkaW5nc1xuICAgICAgICBsZXQgYm9keSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYm9keVwiKVswXTtcbiAgICAgICAgbGV0IHB0eGJvb2sgPSBmYWxzZTtcbiAgICAgICAgbGV0IGVuZExvcCA9IDI7XG4gICAgICAgIGlmIChib2R5LmNsYXNzTGlzdC5jb250YWlucyhcInByZXRleHRcIikpIHtcbiAgICAgICAgICAgIHB0eGJvb2sgPSB0cnVlO1xuICAgICAgICAgICAgZUJvb2tDb25maWcucmVhZGluZ3MgPSBlQm9va0NvbmZpZy5yZWFkaW5ncy5tYXAoKHIpID0+XG4gICAgICAgICAgICAgICAgci5zcGxpdChcIi9cIikucG9wKCksXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgbmFtZSA9IG5hbWUuc3BsaXQoXCIvXCIpLnBvcCgpO1xuICAgICAgICAgICAgZW5kTG9wID0gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBwb3NpdGlvbiA9IGVCb29rQ29uZmlnLnJlYWRpbmdzLmluZGV4T2YobmFtZSk7XG4gICAgICAgIGxldCBudW1fcmVhZGluZ3MgPSBlQm9va0NvbmZpZy5yZWFkaW5ncy5sZW5ndGg7XG4gICAgICAgIC8vIGdldCBwcmV2IG5hbWVcbiAgICAgICAgaWYgKHBvc2l0aW9uID4gMCkge1xuICAgICAgICAgICAgbmV3X3BvcyA9IGVCb29rQ29uZmlnLnJlYWRpbmdzW3Bvc2l0aW9uIC0gMV07XG4gICAgICAgICAgICBwYXRoX3BhcnRzID0gY3VyX3BhdGhfcGFydHMuc2xpY2UoXG4gICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICBjdXJfcGF0aF9wYXJ0cy5sZW5ndGggLSBlbmRMb3AsXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcGF0aF9wYXJ0cy5wdXNoKG5ld19wb3MpO1xuICAgICAgICAgICAgbmV3X3Bvc19saW5rID0gcGF0aF9wYXJ0cy5qb2luKFwiL1wiKTtcbiAgICAgICAgICAgIGZzdCA9IGFjdGl2ZS5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICAgICAgICBsZXQgdHh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgICAgICAgICB0eHQudGV4dENvbnRlbnQgPSBgUGFnZSAke3Bvc2l0aW9uICsgMX0gb2YgJHtudW1fcmVhZGluZ3N9LCBgO1xuICAgICAgICAgICAgdmFyIGZzdF9sbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcbiAgICAgICAgICAgIC8vZnN0X2xuay5jbGFzc05hbWUgPSBcImJ0biBidG4tbGcgcmVhZGluZy1uYXZpZ2F0aW9uIHByZXYtcmVhZGluZ1wiO1xuICAgICAgICAgICAgZnN0X2xuay5ocmVmID0gbmV3X3Bvc19saW5rO1xuICAgICAgICAgICAgZnN0X2xuay50ZXh0Q29udGVudCA9IGBCYWNrIHRvIHBhZ2UgJHtcbiAgICAgICAgICAgICAgICBwb3NpdGlvblxuICAgICAgICAgICAgfSBvZiAke251bV9yZWFkaW5nc306ICR7cmVhZGluZ19uYW1lc1twb3NpdGlvbiAtIDFdfS5gO1xuICAgICAgICAgICAgdHh0LmFwcGVuZChmc3RfbG5rKTtcbiAgICAgICAgICAgIGZzdC5hcHBlbmQodHh0KTtcbiAgICAgICAgfSBlbHNlIGlmIChwb3NpdGlvbiA9PSAwKSB7XG4gICAgICAgICAgICBmc3QgPSBhY3RpdmUuY2xvbmVOb2RlKHRydWUpO1xuICAgICAgICAgICAgbGV0IHR4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuICAgICAgICAgICAgdHh0LnRleHRDb250ZW50ID0gYFBhZ2UgMSBvZiAke251bV9yZWFkaW5nc30uYDtcbiAgICAgICAgICAgIGZzdC5hcHBlbmQodHh0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIHRoaXMgaXNuJ3QgYSByZWFkaW5nIHBhZ2UgaW4gdGhlIGFzc2lnbm1lbnQsIGNoZWNrIHRvIHNlZSBpZiBhbnlcbiAgICAgICAgICAgIC8vIGFjdGl2aXRpZXMgb24gdGhpcyBwYWdlIGFyZSBhc3NpZ25lZCB0byB0aGUgY3VycmVudCBhc3NpZ25tZW50XG4gICAgICAgICAgICBsZXQgZXhlcmNpc2VPblBhZ2UgPSBmYWxzZTtcbiAgICAgICAgICAgIGxldCBwYWdlRXhlcmNpc2VzID0gT2JqZWN0LmtleXMoY29tcG9uZW50TWFwKTtcbiAgICAgICAgICAgIGlmIChwYWdlRXhlcmNpc2VzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgcGFnZUV4ZXJjaXNlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJbZGF0YS1jb21wb25lbnRdXCIpO1xuICAgICAgICAgICAgICAgIHBhZ2VFeGVyY2lzZXMgPSBBcnJheS5mcm9tKHBhZ2VFeGVyY2lzZXMpLm1hcChmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVsLmlkO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChsZXQgZXggb2YgcGFnZUV4ZXJjaXNlcykge1xuICAgICAgICAgICAgICAgIGlmIChhc3NpZ25tZW50X2luZm8ucXVlc3Rpb25zLmluY2x1ZGVzKGV4KSkge1xuICAgICAgICAgICAgICAgICAgICBleGVyY2lzZU9uUGFnZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5ld19wb3MgPSBlQm9va0NvbmZpZy5yZWFkaW5nc1swXTtcbiAgICAgICAgICAgIHBhdGhfcGFydHMgPSBjdXJfcGF0aF9wYXJ0cy5zbGljZShcbiAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgIGN1cl9wYXRoX3BhcnRzLmxlbmd0aCAtIGVuZExvcCxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBwYXRoX3BhcnRzLnB1c2gobmV3X3Bvcyk7XG4gICAgICAgICAgICBuZXdfcG9zX2xpbmsgPSBwYXRoX3BhcnRzLmpvaW4oXCIvXCIpO1xuICAgICAgICAgICAgZnN0ID0gYWN0aXZlLmNsb25lTm9kZSh0cnVlKTtcbiAgICAgICAgICAgIGxldCB0eHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICAgICAgICAgIGlmIChleGVyY2lzZU9uUGFnZSkge1xuICAgICAgICAgICAgICAgIHR4dC50ZXh0Q29udGVudCA9XG4gICAgICAgICAgICAgICAgICAgIFwiVGhpcyBwYWdlIGhhcyBhY3Rpdml0aWVzIGFzc2lnbmVkIHRvIHRoZSBjdXJyZW50IGFzc2lnbm1lbnQuXCI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHR4dC50ZXh0Q29udGVudCA9XG4gICAgICAgICAgICAgICAgICAgIFwiTm90aWNlOiB0aGlzIHBhZ2UgaXMgbm90IHBhcnQgb2YgdGhlIGFzc2lnbm1lbnQuXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0eHQuYXBwZW5kKGV4aXRfbGluayk7XG4gICAgICAgICAgICBmc3QuYXBwZW5kKHR4dCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBvc2l0aW9uID09IGVCb29rQ29uZmlnLnJlYWRpbmdzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgIC8vIG5vIG1vcmUgcmVhZGluZ3NcbiAgICAgICAgICAgIHNuZCA9IGFjdGl2ZTtcbiAgICAgICAgICAgIGxldCB0eHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICAgICAgICAgIHR4dC50ZXh0Q29udGVudCA9IGBQYWdlICR7bnVtX3JlYWRpbmdzfSBvZiAke251bV9yZWFkaW5nc306ICR7cmVhZGluZ19uYW1lc1twb3NpdGlvbl19YDtcbiAgICAgICAgICAgIHNuZC5hcHBlbmQodHh0KTtcbiAgICAgICAgfSBlbHNlIGlmIChwb3NpdGlvbiA+PSAwKSB7XG4gICAgICAgICAgICAvLyBnZXQgbmV4dCBuYW1lXG4gICAgICAgICAgICBuZXdfcG9zID0gZUJvb2tDb25maWcucmVhZGluZ3NbcG9zaXRpb24gKyAxXTtcbiAgICAgICAgICAgIHBhdGhfcGFydHMgPSBjdXJfcGF0aF9wYXJ0cy5zbGljZShcbiAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgIGN1cl9wYXRoX3BhcnRzLmxlbmd0aCAtIGVuZExvcCxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBwYXRoX3BhcnRzLnB1c2gobmV3X3Bvcyk7XG4gICAgICAgICAgICBuZXdfcG9zX2xpbmsgPSBwYXRoX3BhcnRzLmpvaW4oXCIvXCIpO1xuICAgICAgICAgICAgc25kID0gYWN0aXZlO1xuICAgICAgICAgICAgdmFyIHNuZF9sbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcbiAgICAgICAgICAgIC8vc25kX2xuay5jbGFzc05hbWUgPSBcImJ0biBidG4tbGcgcmVhZGluZy1uYXZpZ2F0aW9uIG5leHQtcmVhZGluZ1wiO1xuICAgICAgICAgICAgc25kX2xuay5ocmVmID0gbmV3X3Bvc19saW5rO1xuICAgICAgICAgICAgc25kX2xuay50ZXh0Q29udGVudCA9IGBDb250aW51ZSB0byBwYWdlICR7XG4gICAgICAgICAgICAgICAgcG9zaXRpb24gKyAyXG4gICAgICAgICAgICB9IG9mICR7bnVtX3JlYWRpbmdzfTogJHtyZWFkaW5nX25hbWVzW3Bvc2l0aW9uICsgMV19YDtcbiAgICAgICAgICAgIGxldCB0eHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICAgICAgICAgIHR4dC5hcHBlbmQoc25kX2xuayk7XG4gICAgICAgICAgICBzbmQuYXBwZW5kKHR4dCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzbmQgPSBhY3RpdmUuY2xvbmVOb2RlKHRydWUpO1xuICAgICAgICAgICAgbGV0IHR4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuICAgICAgICAgICAgdHh0LnRleHRDb250ZW50ID1cbiAgICAgICAgICAgICAgICBcIk5vdGljZTogdGhpcyBwYWdlIGlzIG5vdCBwYXJ0IG9mIHRoZSBhc3NpZ25tZW50LiBUbyByZW1vdmUgdGhpcyB3YXJuaW5nIGNsaWNrIFwiO1xuICAgICAgICAgICAgbGV0IGV4aXRfY2xvbmUgPSBleGl0X2xpbmsuY2xvbmVOb2RlKHRydWUpO1xuXG4gICAgICAgICAgICBleGl0X2Nsb25lLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcbiAgICAgICAgICAgICAgICAgICAgYGN1cnJlbnRBc3NpZ25tZW50SW5mb18ke2VCb29rQ29uZmlnLmNvdXJzZX1gLFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHR4dC5hcHBlbmQoZXhpdF9jbG9uZSk7XG4gICAgICAgICAgICBzbmQuYXBwZW5kKHR4dCk7XG4gICAgICAgIH1cblxuICAgICAgICB0b3AgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB0b3AuY2xhc3NOYW1lID0gXCJwdHgtcnVuZXN0b25lLWNvbnRhaW5lclwiO1xuICAgICAgICBmc3QuY2xhc3NOYW1lID0gXCJydW5lc3RvbmUgYXNzaWdubWVudC1uYXYgdG9wLWFzc2lnbm1lbnQtbmF2XCI7XG4gICAgICAgIC8vdG9wLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwidmFyKC0tY29tcG9uZW50QmdDb2xvcilcIlxuICAgICAgICAvL3RvcC5zdHlsZS5ib3JkZXJDb2xvciA9IFwidmFyKC0tY29tcG9uZW50Qm9yZGVyQ29sb3IpXCJcbiAgICAgICAgLy90b3Auc3R5bGUuYm9yZGVyV2lkdGggPSBcIjFweFwiXG4gICAgICAgIHRvcC5hcHBlbmQoZnN0KTtcbiAgICAgICAgLy90b3AuYXBwZW5kKHNuZCk7XG5cbiAgICAgICAgYm90dG9tID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgYm90dG9tLmNsYXNzTmFtZSA9IFwicHR4LXJ1bmVzdG9uZS1jb250YWluZXJcIjtcbiAgICAgICAgc25kLmNsYXNzTmFtZSA9IFwicnVuZXN0b25lIGFzc2lnbm1lbnQtbmF2IGJvdHRvbS1hc3NpZ25tZW50LW5hdlwiO1xuICAgICAgICAvL2JvdHRvbS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcInZhcigtLWNvbXBvbmVudEJnQ29sb3IpXCJcbiAgICAgICAgLy9ib3R0b20uc3R5bGUuYm9yZGVyQ29sb3IgPSBcInZhcigtLWNvbXBvbmVudEJvcmRlckNvbG9yKVwiXG4gICAgICAgIC8vYm90dG9tLnN0eWxlLmJvcmRlcldpZHRoID0gXCIxcHhcIlxuXG4gICAgICAgIC8vYm90dG9tLmFwcGVuZChhY3RpdmUuY2xvbmVOb2RlKHRydWUpKTtcbiAgICAgICAgLy9ib3R0b20uYXBwZW5kKGZzdC5jbG9uZU5vZGUodHJ1ZSkpO1xuICAgICAgICBib3R0b20uYXBwZW5kKHNuZCk7XG5cbiAgICAgICAgLy8gY2hlY2sgdGhlIGJvZHkgdGFnIHRvIHNlZSBpZiBpdCBoYXMgYSBwcmV0ZXh0IGNsYXNzIChubyBqcXVlcnkpXG4gICAgICAgIGlmIChwdHhib29rKSB7XG4gICAgICAgICAgICAvL2FwcGVuZCBwYXJ0cyB0byB0aGUgaGVhZGVyIGFuZCBwcm9ncmVzcyBjb250YWluZXJcbiAgICAgICAgICAgIGxldCBjb250ZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwdHgtY29udGVudFwiKTtcbiAgICAgICAgICAgIGlmIChjb250ZW50KSB7XG4gICAgICAgICAgICAgICAgY29udGVudC5pbnNlcnRCZWZvcmUodG9wLCBjb250ZW50LmZpcnN0Q2hpbGQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IHBjID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzY3Byb2dyZXNzY29udGFpbmVyXCIpO1xuICAgICAgICAgICAgaWYgKHBjKSB7XG4gICAgICAgICAgICAgICAgcGMuc3R5bGUubWFyZ2luQm90dG9tID0gXCIyMHB4XCI7XG4gICAgICAgICAgICAgICAgcGMuYXBwZW5kQ2hpbGQoYm90dG9tKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBtYWluQ29udGVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFpbi1jb250ZW50XCIpO1xuICAgICAgICBpZiAobWFpbkNvbnRlbnQgJiYgc25kKSB7XG4gICAgICAgICAgICBtYWluQ29udGVudC5pbnNlcnRCZWZvcmUodG9wLCBtYWluQ29udGVudC5maXJzdENoaWxkKTtcbiAgICAgICAgICAgIG1haW5Db250ZW50LmFwcGVuZENoaWxkKGJvdHRvbSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8qKlxuICogQnVpbGQgdGhlIGFjdGl2aXR5IGRpY3Rpb25hcnkgZm9yIHRoZSBwcm9ncmVzcyBiYXIgYnkgc2Nhbm5pbmcgdGhlIHBhZ2UuXG4gKlxuICogVGhpcyBpcyB0aGUgZmFsbGJhY2sgdXNlZCB3aGVuIHRoZSBzZXJ2ZXIgZGlkIG5vdCBzZW5kIGFjdGl2aXR5IGNvdW50cyAtLVxuICogaS5lLiB3aGVuIG5vYm9keSBpcyBsb2dnZWQgaW4gYW5kIHRoZSBwYWdlIGlzIGJlaW5nIGJyb3dzZWQuICBUaGUga2V5cyBhcmVcbiAqIHRoZSBkaXZfaWRzIHRoYXQgYGB1cGRhdGVQcm9ncmVzc2BgIGluY3JlbWVudHMsIHNvIHRoZXkgaGF2ZSB0byBiZSB0aGUgaWRzIG9mXG4gKiB0aGUgZWxlbWVudHMgY2FycnlpbmcgYGBkYXRhLWNvbXBvbmVudGBgLiAgVGhvc2UgYXJlIG5vdCBhbHdheXMgdGhlIGZpcnN0XG4gKiBjaGlsZCBvZiB0aGUgYGAucnVuZXN0b25lYGAgd3JhcHBlcjogUHJlVGVYdCwgZm9yIGluc3RhbmNlLCBlbWl0cyBhblxuICogYGBleGVyY2lzZS1zdGF0ZW1lbnRgYCBkaXYgYWhlYWQgb2YgdGhlIGNvbXBvbmVudCBmb3IgbXVsdGlwbGUgY2hvaWNlXG4gKiBxdWVzdGlvbnMuICBLZXlpbmcgb2ZmIHRoZSBmaXJzdCBjaGlsZCBpbiB0aGF0IGNhc2UgZ2F2ZSBldmVyeSBzdWNoIHF1ZXN0aW9uXG4gKiBvbiB0aGUgcGFnZSB0aGUgc2FtZSBlbXB0eSBrZXksIHNvIGVpZ2h0IGV4ZXJjaXNlcyBjb3VudGVkIGFzIG9uZS5cbiAqXG4gKiBAcGFyYW0ge1BhcmVudE5vZGV9IHJvb3QgLSB3aGVyZSB0byBsb29rOyBkZWZhdWx0cyB0byB0aGUgd2hvbGUgZG9jdW1lbnQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBhY3Rpdml0eSBpZHMgbWFwcGVkIHRvIDAsIHBsdXMgdGhlIGBgcGFnZWBgIHBzZXVkby1hY3Rpdml0eS5cbiAqL1xuLy8gTmF2aWdhdGlvbiBhbmQgcmVmZXJlbmNlIHBhZ2VzIHJhdGhlciB0aGFuIGNvbnRlbnQ6IHRoZXkgY2Fycnkgbm8gYWN0aXZpdGllcyxcbi8vIHNvIHRoZXkgZ2V0IG5vIHByb2dyZXNzIGJhciwgbm8gY29tcGxldGlvbiBidXR0b24gYW5kIG5vIGhpZ2hsaWdodGluZy4gS2VlcFxuLy8gdGhpcyBhcyB0aGUgc2luZ2xlIGxpc3QgLS0gaXQgdXNlZCB0byBiZSBzcGVsbGVkIG91dCBzZXBhcmF0ZWx5IGluXG4vLyB1c2VyLWhpZ2hsaWdodHMuanMgYW5kIHRoZSBzcGhpbnggcHJvZ3Jlc3MgdGVtcGxhdGUsIGFuZCB0aGUgY29waWVzIGhhZFxuLy8gZHJpZnRlZCBhcGFydCAoZ2VuaW5kZXguaHRtbCB3YXMgbWlzc2luZyBoZXJlLCB3aGljaCBsZWZ0IGEgcHJvZ3Jlc3MgYmFyIG9uXG4vLyB0aGUgQm9vayBJbmRleCBwYWdlKS5cbmV4cG9ydCBjb25zdCBOT05fQ09OVEVOVF9QQUdFUyA9IFtcbiAgICBcImluZGV4Lmh0bWxcIixcbiAgICBcImdlbmluZGV4Lmh0bWxcIixcbiAgICBcInRvY3RyZWUuaHRtbFwiLFxuICAgIFwidG9jLmh0bWxcIixcbiAgICBcIm5hdmhlbHAuaHRtbFwiLFxuICAgIFwiYXNzaWdubWVudHMuaHRtbFwiLFxuICAgIFwiRXhlcmNpc2VzLmh0bWxcIixcbiAgICBcInNlYXJjaC5odG1sXCIsXG5dO1xuXG5leHBvcnQgZnVuY3Rpb24gaXNDb3Vyc2VTdGFydGVkKCkge1xuICAgIGxldCBzdGFydERhdGUgPSBlQm9va0NvbmZpZy50ZXJtU3RhcnREYXRlOyAvLyBmb3JtYXQgaXMgXCIyMDI2LTA5LTIyXCJcbiAgICBpZiAoIXN0YXJ0RGF0ZSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGxldCB0b2RheSA9IG5ldyBEYXRlKCk7XG4gICAgbGV0IHN0YXJ0ID0gbmV3IERhdGUoc3RhcnREYXRlKTtcbiAgICByZXR1cm4gdG9kYXkgPj0gc3RhcnQ7XG59XG5cbmZ1bmN0aW9uIGNvdXJzZU5vdFN0YXJ0ZWRNZXNzYWdlKCkge1xuICAgIGNvbnN0IGZvcm1hdHRlZERhdGUgPSBuZXcgRGF0ZShcbiAgICAgICAgZUJvb2tDb25maWcudGVybVN0YXJ0RGF0ZSxcbiAgICApLnRvTG9jYWxlRGF0ZVN0cmluZyh1bmRlZmluZWQsIHtcbiAgICAgICAgeWVhcjogXCJudW1lcmljXCIsXG4gICAgICAgIG1vbnRoOiBcImxvbmdcIixcbiAgICAgICAgZGF5OiBcIm51bWVyaWNcIixcbiAgICB9KTtcbiAgICByZXR1cm4gKFxuICAgICAgICBcIkNvdXJzZSBoYXMgbm90IHN0YXJ0ZWQgeWV0LiBQcm9ncmVzcyB3aWxsIGJlIHRyYWNrZWQgc3RhcnRpbmcgb24gXCIgK1xuICAgICAgICBmb3JtYXR0ZWREYXRlXG4gICAgKTtcbn1cblxuLyoqIFRydWUgd2hlbiBwYXRobmFtZSBuYW1lcyBvbmUgb2YgdGhlIE5PTl9DT05URU5UX1BBR0VTLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzTm9uQ29udGVudFBhZ2UocGF0aG5hbWUgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUpIHtcbiAgICBsZXQgcGFnZSA9IHBhdGhuYW1lLnNwbGl0KFwiL1wiKS5wb3AoKS50b0xvd2VyQ2FzZSgpO1xuICAgIHJldHVybiBOT05fQ09OVEVOVF9QQUdFUy5zb21lKChwKSA9PiBwLnRvTG93ZXJDYXNlKCkgPT09IHBhZ2UpO1xufVxuXG4vKipcbiAqIFRydWUgd2hlbiBwYXRobmFtZSBpcyBhIGJvb2sgcGFnZSB0aGUgc2VydmVyIGtlZXBzIHJlYWRpbmcgcHJvZ3Jlc3MgZm9yOlxuICogYSBzdWJjaGFwdGVyLiBUaGUgaW50ZXJhY3RpdmVzIGFsc28gbG9hZCBvbiBhc3NpZ25tZW50IHBhZ2VzLCBhbmQgYVxuICogUHJlVGVYdCBib29rJ3Mgcm9vdCwgcGFydCwgY2hhcHRlciwgaW50cm9kdWN0aW9uIGFuZCBmcm9udCBtYXR0ZXIgcGFnZXNcbiAqIGFyZSBub3Qgc3ViY2hhcHRlcnMgZWl0aGVyOyBhc2tpbmcgdGhlIHByb2dyZXNzIGVuZHBvaW50cyBhYm91dCBhbnkgb2ZcbiAqIHRoZW0gb25seSBlYXJucyBhIDQyMi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzU3ViY2hhcHRlclBhZ2UoXG4gICAgcGF0aG5hbWUgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUsXG4gICAgYWN0aXZpdGllcyA9IHdpbmRvdy5lQm9va0NvbmZpZz8uYWN0aXZpdGllcyxcbikge1xuICAgIGlmICghcGF0aG5hbWUuaW5jbHVkZXMoXCIvYm9va3MvcHVibGlzaGVkL1wiKSB8fCBpc05vbkNvbnRlbnRQYWdlKHBhdGhuYW1lKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIC8vIHNlcnZlX3BhZ2Ugc2VuZHMgdGhlIGNoYXB0ZXIgaXQgZm91bmQgZm9yIHRoZSBwYWdlLCBudWxsIHdoZW4gdGhlIHBhZ2VcbiAgICAvLyBpcyBub3QgYSBzdWJjaGFwdGVyLiBQYWdlcyByZW5kZXJlZCBieSBhbiBvbGRlciBzZXJ2ZXIgZG9uJ3Qgc2VuZCBpdC5cbiAgICByZXR1cm4gKFxuICAgICAgICAhKGFjdGl2aXRpZXMgJiYgXCJwYWdlX2NoYXB0ZXJcIiBpbiBhY3Rpdml0aWVzKSB8fFxuICAgICAgICAhIWFjdGl2aXRpZXMucGFnZV9jaGFwdGVyXG4gICAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvdW50QWN0aXZpdGllc0luUGFnZShyb290ID0gZG9jdW1lbnQpIHtcbiAgICBsZXQgYWN0aXZpdGllcyA9IHsgcGFnZTogMCB9O1xuICAgIHJvb3QucXVlcnlTZWxlY3RvckFsbChcIi5ydW5lc3RvbmVcIikuZm9yRWFjaChmdW5jdGlvbiAoZSwgaW5kZXgpIHtcbiAgICAgICAgLy8gQSBjb21wb25lbnQgbWF5IGJlIHRoZSB3cmFwcGVyIGl0c2VsZiBvciBzb21ld2hlcmUgaW5zaWRlIGl0LiBOZXN0ZWRcbiAgICAgICAgLy8gcGFydHMgb2YgYSBjb21wb25lbnQgKG1jaG9pY2UgYW5zd2VycywgZmVlZGJhY2spIGFsc28gY2FycnlcbiAgICAgICAgLy8gZGF0YS1jb21wb25lbnQsIGJ1dCBxdWVyeVNlbGVjdG9yIHJldHVybnMgdGhlIG91dGVybW9zdCBtYXRjaCBmaXJzdC5cbiAgICAgICAgbGV0IGNvbXBvbmVudCA9IGUubWF0Y2hlcyhcIltkYXRhLWNvbXBvbmVudF1cIilcbiAgICAgICAgICAgID8gZVxuICAgICAgICAgICAgOiBlLnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1jb21wb25lbnRdXCIpO1xuICAgICAgICBsZXQgaWQgPSBjb21wb25lbnQ/LmlkIHx8IGUuZmlyc3RFbGVtZW50Q2hpbGQ/LmlkO1xuICAgICAgICAvLyBXaXRob3V0IGFuIGlkIHdlIGNhbm5vdCBtYXRjaCB0aGlzIGFjdGl2aXR5IHRvIGEgY29tcGxldGlvbiBldmVudCxcbiAgICAgICAgLy8gYnV0IGl0IGlzIHN0aWxsIG9uZSBhY3Rpdml0eTogZ2l2ZSBpdCBhIGtleSBvZiBpdHMgb3duIHNvIGl0IGlzIG5vdFxuICAgICAgICAvLyBmb2xkZWQgdG9nZXRoZXIgd2l0aCBldmVyeSBvdGhlciB1bmlkZW50aWZpZWQgb25lIG9uIHRoZSBwYWdlLlxuICAgICAgICBhY3Rpdml0aWVzW2lkIHx8IGB1bmlkZW50aWZpZWQtYWN0aXZpdHktJHtpbmRleH1gXSA9IDA7XG4gICAgfSk7XG4gICAgcmV0dXJuIGFjdGl2aXRpZXM7XG59XG5cbmV4cG9ydCBjbGFzcyBQYWdlUHJvZ3Jlc3NCYXIge1xuICAgIGNvbnN0cnVjdG9yKGFjdERpY3QpIHtcbiAgICAgICAgdGhpcy5wb3NzaWJsZSA9IDA7XG4gICAgICAgIC8vIFRoZSBwYWdlIGl0c2VsZiBjb3VudHMgYXMgb25lIGl0ZW0gYW5kIGlzIGF0dGVtcHRlZCBhcyBzb29uIGFzIGl0IGlzXG4gICAgICAgIC8vIG9wZW5lZC4gVGhhdCBpcyB3aGF0IGxldHMgYSBwYWdlIHdpdGggbm8gYWN0aXZpdGllcyBvbiBpdCBzdGlsbCBiZVxuICAgICAgICAvLyBjb21wbGV0ZWQuXG4gICAgICAgIHRoaXMudG90YWwgPSAxO1xuICAgICAgICAvLyBwYWdlX2NoYXB0ZXIgcmlkZXMgYWxvbmcgZm9yIGlzU3ViY2hhcHRlclBhZ2U7IGl0IGlzIG5vdCBhblxuICAgICAgICAvLyBhY3Rpdml0eS4gQ29weSByYXRoZXIgdGhhbiBkZWxldGUgc28gdGhhdCBjaGVjayBzdGlsbCBzZWVzIGl0LlxuICAgICAgICBpZiAoYWN0RGljdCAmJiBcInBhZ2VfY2hhcHRlclwiIGluIGFjdERpY3QpIHtcbiAgICAgICAgICAgIGFjdERpY3QgPSB7IC4uLmFjdERpY3QgfTtcbiAgICAgICAgICAgIGRlbGV0ZSBhY3REaWN0LnBhZ2VfY2hhcHRlcjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYWN0RGljdCAmJiBcImFzc2lnbm1lbnRfc3BlY1wiIGluIGFjdERpY3QpIHtcbiAgICAgICAgICAgIHRoaXMuYXNzaWdubWVudF9zcGVjID0gYWN0RGljdC5hc3NpZ25tZW50X3NwZWM7XG4gICAgICAgICAgICBkZWxldGUgYWN0RGljdC5hc3NpZ25tZW50X3NwZWM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFjdERpY3QgJiYgT2JqZWN0LmtleXMoYWN0RGljdCkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdGhpcy5hY3Rpdml0aWVzID0gYWN0RGljdDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYWN0aXZpdGllcyA9IGNvdW50QWN0aXZpdGllc0luUGFnZSgpO1xuICAgICAgICB9XG4gICAgICAgIC8vIEJvdGggZGljdHMgYXJlIGV4cGVjdGVkIHRvIGNhcnJ5IGEgYHBhZ2VgIGVudHJ5IGZvciB0aGUgcGFnZSBpdHNlbGY6XG4gICAgICAgIC8vIGNvdW50QWN0aXZpdGllc0luUGFnZSgpIGFkZHMgb25lLCBhbmQgdGhlIHNlcnZlciBzZW5kcyB0aGUgcGFnZSdzIG93blxuICAgICAgICAvLyBxdWVzdGlvbiByb3cgdW5kZXIgdGhhdCBrZXkuIE9sZGVyIHNlcnZlcnMga2V5ZWQgdGhhdCByb3cgYnkgaXRzXG4gICAgICAgIC8vIHF1ZXN0aW9uIG5hbWUgaW5zdGVhZCwgd2hpY2ggbWFkZSB0aGUgcGFnZSBsb29rIGxpa2UgYW4gZXh0cmFcbiAgICAgICAgLy8gYWN0aXZpdHk7IG5vdGhpbmcgd2UgY2FuIGRvIGFib3V0IHRoYXQgaGVyZSwgYnV0IGtlZXAgdGhlIGZhbGxiYWNrIHNvXG4gICAgICAgIC8vIGEgc2VydmVyIHRoYXQgc2VuZHMgbm8gcGFnZSBlbnRyeSBhdCBhbGwgc3RpbGwgbGluZXMgdXAuXG4gICAgICAgIGlmICghKFwicGFnZVwiIGluIHRoaXMuYWN0aXZpdGllcykpIHtcbiAgICAgICAgICAgIHRoaXMuYWN0aXZpdGllcy5wYWdlID0gMTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNhbGN1bGF0ZVByb2dyZXNzKCk7XG4gICAgICAgIC8vIEhpZGUgdGhlIHByb2dyZXNzIGJhciBvbiBuYXZpZ2F0aW9uIHBhZ2VzLCB3aGljaCBoYXZlIG5vIGFjdGl2aXRpZXMuXG4gICAgICAgIGlmIChpc05vbkNvbnRlbnRQYWdlKCkpIHtcbiAgICAgICAgICAgIGNvbnN0IHNjcHJvZ3Jlc3Njb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcbiAgICAgICAgICAgICAgICBcInNjcHJvZ3Jlc3Njb250YWluZXJcIixcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBpZiAoc2Nwcm9ncmVzc2NvbnRhaW5lcikgc2Nwcm9ncmVzc2NvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yZW5kZXJQcm9ncmVzcygpO1xuICAgIH1cblxuICAgIGNhbGN1bGF0ZVByb2dyZXNzKCkge1xuICAgICAgICBmb3IgKGxldCBrIGluIHRoaXMuYWN0aXZpdGllcykge1xuICAgICAgICAgICAgaWYgKGsgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHRoaXMucG9zc2libGUrKztcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5hY3Rpdml0aWVzW2tdID4gMCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdGFsKys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0IGFjdGl2aXRpZXNBdHRlbXB0ZWQoKSB7XG4gICAgICAgIHJldHVybiBNYXRoLm1heCh0aGlzLnRvdGFsLCAwKTtcbiAgICB9XG5cbiAgICBnZXQgYWN0aXZpdGllc1Bvc3NpYmxlKCkge1xuICAgICAgICByZXR1cm4gTWF0aC5tYXgodGhpcy5wb3NzaWJsZSwgMCk7XG4gICAgfVxuXG4gICAgcmVuZGVyUHJvZ3Jlc3MoKSB7XG4gICAgICAgIGxldCB2YWx1ZSA9IDA7XG4gICAgICAgIGNvbnN0IHNjcHJvZ3Jlc3N0b3RhbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2Nwcm9ncmVzc3RvdGFsXCIpO1xuICAgICAgICBpZiAoc2Nwcm9ncmVzc3RvdGFsKVxuICAgICAgICAgICAgc2Nwcm9ncmVzc3RvdGFsLnRleHRDb250ZW50ID0gdGhpcy5hY3Rpdml0aWVzQXR0ZW1wdGVkO1xuICAgICAgICBjb25zdCBzY3Byb2dyZXNzcG9zcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2Nwcm9ncmVzc3Bvc3NcIik7XG4gICAgICAgIGlmIChzY3Byb2dyZXNzcG9zcylcbiAgICAgICAgICAgIHNjcHJvZ3Jlc3Nwb3NzLnRleHRDb250ZW50ID0gdGhpcy5hY3Rpdml0aWVzUG9zc2libGU7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB2YWx1ZSA9ICgxMDAgKiB0aGlzLnRvdGFsKSAvIHRoaXMucG9zc2libGU7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHZhbHVlID0gMDtcbiAgICAgICAgfVxuICAgICAgICBsZXQgcHJvZ3Jlc3NUZXh0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzY3Byb2dyZXNzLWFjdGl2aXR5LWNvdW50XCIpO1xuICAgICAgICAvLyBXYXJuIGlmIGNvdXJzZSBub3Qgc3RhcnRlZFxuICAgICAgICBpZiAocHJvZ3Jlc3NUZXh0ICYmICFpc0NvdXJzZVN0YXJ0ZWQoKSkge1xuICAgICAgICAgICAgcHJvZ3Jlc3NUZXh0LmFwcGVuZENoaWxkKFxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNvdXJzZU5vdFN0YXJ0ZWRNZXNzYWdlKCkpLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBSZXBsYWNlICNzdWJjaGFwdGVycHJvZ3Jlc3MgZGl2IHdpdGggYSBuYXRpdmUgPHByb2dyZXNzPiBlbGVtZW50IGlmIG5vdCBhbHJlYWR5IGRvbmVcbiAgICAgICAgbGV0IHN1YmNoYXB0ZXJwcm9ncmVzcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3ViY2hhcHRlcnByb2dyZXNzXCIpO1xuICAgICAgICBpZiAoc3ViY2hhcHRlcnByb2dyZXNzICYmIHN1YmNoYXB0ZXJwcm9ncmVzcy50YWdOYW1lICE9PSBcIlBST0dSRVNTXCIpIHtcbiAgICAgICAgICAgIC8vIFJlcGxhY2UgdGhlIGRpdiB3aXRoIGEgPHByb2dyZXNzPiBlbGVtZW50XG4gICAgICAgICAgICBjb25zdCBwcm9ncmVzc0VsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicHJvZ3Jlc3NcIik7XG4gICAgICAgICAgICBwcm9ncmVzc0VsZW0uaWQgPSBcInN1YmNoYXB0ZXJwcm9ncmVzc1wiO1xuICAgICAgICAgICAgcHJvZ3Jlc3NFbGVtLm1heCA9IDEwMDtcbiAgICAgICAgICAgIHByb2dyZXNzRWxlbS52YWx1ZSA9IHZhbHVlO1xuICAgICAgICAgICAgLy8gQ29weSBvdmVyIGFueSBjbGFzc2VzIGZyb20gdGhlIG9sZCBkaXZcbiAgICAgICAgICAgIHByb2dyZXNzRWxlbS5jbGFzc05hbWUgPSBzdWJjaGFwdGVycHJvZ3Jlc3MuY2xhc3NOYW1lO1xuICAgICAgICAgICAgc3ViY2hhcHRlcnByb2dyZXNzLnJlcGxhY2VXaXRoKHByb2dyZXNzRWxlbSk7XG4gICAgICAgICAgICBzdWJjaGFwdGVycHJvZ3Jlc3MgPSBwcm9ncmVzc0VsZW07XG4gICAgICAgIH0gZWxzZSBpZiAoc3ViY2hhcHRlcnByb2dyZXNzKSB7XG4gICAgICAgICAgICBzdWJjaGFwdGVycHJvZ3Jlc3MubWF4ID0gMTAwO1xuICAgICAgICAgICAgc3ViY2hhcHRlcnByb2dyZXNzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuYXNzaWdubWVudF9zcGVjKSB7XG4gICAgICAgICAgICAvLyBJZiB0aGUgdXNlciBoYXMgY29tcGxldGVkIGFsbCBhY3Rpdml0aWVzLCBzZW5kIHRoZSByZWFkaW5nIHNjb3JlLlxuICAgICAgICAgICAgLy8gVGhpcyBoYW5kbGVzIHRoZSBjYXNlIHdoZXJlIHRoZXJlIGFyZSBubyBhY3Rpdml0aWVzIG9uIHRoZSBwYWdlIG9yXG4gICAgICAgICAgICAvLyAgd2hlcmUgdGhlIHVzZXIgY29tcGxldGVkIGFjdGl2aXRpZXMgb24gdGhlIGFzc2lnbm1lbnQgcGFnZSBhbmQgbm93XG4gICAgICAgICAgICAvLyAgaXMgdmlld2luZyB0aGUgcmVhZGluZyBwYWdlLlxuICAgICAgICAgICAgLy8gYWN0aXZpdGllc19yZXF1aXJlZCBjb3VudHMgYWN0aXZpdGllcyB0aGUgcmVhZGVyIGNvbXBsZXRlcywgc29cbiAgICAgICAgICAgIC8vIGNvbXBhcmUgYWdhaW5zdCBhY3Rpdml0aWVzQXR0ZW1wdGVkIHJhdGhlciB0aGFuIHRvdGFsIC0tIHRvdGFsXG4gICAgICAgICAgICAvLyBpbmNsdWRlcyB0aGUgcGFnZSBpdHNlbGYsIHdoaWNoIHVzZWQgdG8gc2VuZCB0aGUgcmVhZGluZyBzY29yZVxuICAgICAgICAgICAgLy8gb25lIGFjdGl2aXR5IGVhcmx5LlxuICAgICAgICAgICAgbGV0IGNvbXBsZXRlQWN0aXZpdGllcyA9IHRoaXMuYWN0aXZpdGllc0F0dGVtcHRlZDtcbiAgICAgICAgICAgIGxldCByZXF1aXJlZEFjdGl2aXRpZXMgPSB0aGlzLmFzc2lnbm1lbnRfc3BlYy5hY3Rpdml0aWVzX3JlcXVpcmVkO1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIHJlcXVpcmVkQWN0aXZpdGllcyA9PT0gbnVsbCB8fFxuICAgICAgICAgICAgICAgIHJlcXVpcmVkQWN0aXZpdGllcyA9PT0gdW5kZWZpbmVkXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAvLyBOb3RoaW5nIHNwZWNpZmljIGlzIHJlcXVpcmVkIG9uIHRoaXMgcGFnZSwgc28gb3BlbmluZyBpdCBpc1xuICAgICAgICAgICAgICAgIC8vIGVub3VnaC4gUmVjb3JkIGhvdyBtYW55IGFjdGl2aXRpZXMgYXJlIGhlcmUgZm9yIHRoZSBjaGVjayBpblxuICAgICAgICAgICAgICAgIC8vIHVwZGF0ZVByb2dyZXNzKCkuXG4gICAgICAgICAgICAgICAgcmVxdWlyZWRBY3Rpdml0aWVzID0gMDtcbiAgICAgICAgICAgICAgICB0aGlzLmFzc2lnbm1lbnRfc3BlYy5hY3Rpdml0aWVzX3JlcXVpcmVkID1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hY3Rpdml0aWVzUG9zc2libGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY29tcGxldGVBY3Rpdml0aWVzID49IHJlcXVpcmVkQWN0aXZpdGllcykge1xuICAgICAgICAgICAgICAgIHRoaXMuc2VuZENvbXBsZXRlZFJlYWRpbmdTY29yZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJlYWRpbmcgc2NvcmUgc2VudCBmb3IgcGFnZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gd2FpdCBhIHRpY2sgdGhlbiBtYXJrIHRoZSBwYWdlIGNvbXBsZXRlXG4gICAgICAgICAgICAgICAgICAgIC8vIHRoaXMgaXMgbmVlZGVkIHRvIGxldCB0aGUgcHJvZ3Jlc3MgYmFyIHVwZGF0ZSBiZWZvcmUgbWFya2luZyBjb21wbGV0ZVxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjYiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29tcGxldGlvbkJ1dHRvblwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYiAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiLnRleHRDb250ZW50LnRvTG93ZXJDYXNlKCkgPT09IFwibWFyayBhcyBjb21wbGV0ZWRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2IuY2xpY2soKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSwgNTAwKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoIWVCb29rQ29uZmlnLmlzTG9nZ2VkSW4pIHtcbiAgICAgICAgICAgIGNvbnN0IHN1YmNoYXB0ZXJEaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN1YmNoYXB0ZXJwcm9ncmVzc1wiKTtcbiAgICAgICAgICAgIGlmIChzdWJjaGFwdGVyRGl2KSBzdWJjaGFwdGVyRGl2LmNsYXNzTGlzdC5hZGQoXCJsb2dnZWRvdXRcIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1cGRhdGVQcm9ncmVzcyhkaXZfaWQpIHtcbiAgICAgICAgdGhpcy5hY3Rpdml0aWVzW2Rpdl9pZF0rKztcbiAgICAgICAgLy8gT25seSB1cGRhdGUgdGhlIHByb2dyZXNzIGJhciBvbiB0aGUgZmlyc3QgaW50ZXJhY3Rpb24gd2l0aCBhbiBvYmplY3QuXG4gICAgICAgIGlmICh0aGlzLmFjdGl2aXRpZXNbZGl2X2lkXSA9PT0gMSkge1xuICAgICAgICAgICAgdGhpcy50b3RhbCsrO1xuICAgICAgICAgICAgbGV0IHZhbCA9ICgxMDAgKiB0aGlzLnRvdGFsKSAvIHRoaXMucG9zc2libGU7XG4gICAgICAgICAgICBjb25zdCBzY3Byb2dyZXNzdG90YWwyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzY3Byb2dyZXNzdG90YWxcIik7XG4gICAgICAgICAgICBpZiAoc2Nwcm9ncmVzc3RvdGFsMilcbiAgICAgICAgICAgICAgICBzY3Byb2dyZXNzdG90YWwyLnRleHRDb250ZW50ID0gdGhpcy5hY3Rpdml0aWVzQXR0ZW1wdGVkO1xuICAgICAgICAgICAgY29uc3Qgc2Nwcm9ncmVzc3Bvc3MyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzY3Byb2dyZXNzcG9zc1wiKTtcbiAgICAgICAgICAgIGlmIChzY3Byb2dyZXNzcG9zczIpXG4gICAgICAgICAgICAgICAgc2Nwcm9ncmVzc3Bvc3MyLnRleHRDb250ZW50ID0gdGhpcy5hY3Rpdml0aWVzUG9zc2libGU7XG4gICAgICAgICAgICBsZXQgc3ViY2hhcHRlcnByb2dyZXNzMiA9XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdWJjaGFwdGVycHJvZ3Jlc3NcIik7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgc3ViY2hhcHRlcnByb2dyZXNzMiAmJlxuICAgICAgICAgICAgICAgIHN1YmNoYXB0ZXJwcm9ncmVzczIudGFnTmFtZSA9PT0gXCJQUk9HUkVTU1wiXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBzdWJjaGFwdGVycHJvZ3Jlc3MyLnZhbHVlID0gdmFsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIHRoaXMuYXNzaWdubWVudF9zcGVjICYmXG4gICAgICAgICAgICAgICAgdGhpcy5hc3NpZ25tZW50X3NwZWMuYWN0aXZpdGllc19yZXF1aXJlZCAhPT0gbnVsbCAmJlxuICAgICAgICAgICAgICAgIHRoaXMuYWN0aXZpdGllc0F0dGVtcHRlZCA+PVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFzc2lnbm1lbnRfc3BlYy5hY3Rpdml0aWVzX3JlcXVpcmVkXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJlcXVpcmVkIGFjdGl2aXRpZXMgY29tcGxldGVkXCIpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2VuZENvbXBsZXRlZFJlYWRpbmdTY29yZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJlYWRpbmcgc2NvcmUgc2VudFwiKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICB2YWwgPT0gMTAwLjAgJiZcbiAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjYiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29tcGxldGlvbkJ1dHRvblwiKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgIGNiICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBjYi50ZXh0Q29udGVudCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgY2IudGV4dENvbnRlbnQudG9Mb3dlckNhc2UoKSA9PT0gXCJtYXJrIGFzIGNvbXBsZXRlZFwiXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSkoKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY2IgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbXBsZXRpb25CdXR0b25cIik7XG4gICAgICAgICAgICAgICAgaWYgKGNiICYmIHR5cGVvZiBjYi5jbGljayA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGNiLmNsaWNrKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgc2VuZENvbXBsZXRlZFJlYWRpbmdTY29yZSgpIHtcbiAgICAgICAgbGV0IGhlYWRlcnMgPSBuZXcgSGVhZGVycyh7XG4gICAgICAgICAgICBcIkNvbnRlbnQtdHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLThcIixcbiAgICAgICAgICAgIEFjY2VwdDogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgIH0pO1xuICAgICAgICBsZXQgZGF0YSA9IHsgLi4udGhpcy5hc3NpZ25tZW50X3NwZWMgfTtcbiAgICAgICAgbGV0IHJlcXVlc3QgPSBuZXcgUmVxdWVzdChcbiAgICAgICAgICAgIGAke2VCb29rQ29uZmlnLm5ld19zZXJ2ZXJfcHJlZml4fS9sb2dnZXIvdXBkYXRlX3JlYWRpbmdfc2NvcmVgLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZGF0YSksXG4gICAgICAgICAgICAgICAgaGVhZGVyczogaGVhZGVycyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChyZXF1ZXN0KTtcbiAgICAgICAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFxuICAgICAgICAgICAgICAgICAgICBgRmFpbGVkIHRvIHNlbmQgcmVhZGluZyBzY29yZSEgJHtyZXNwb25zZS5zdGF0dXNUZXh0fWAsXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYEVycm9yIHNlbmRpbmcgcmVhZGluZyBzY29yZSAke2V9YCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCB2YXIgcGFnZVByb2dyZXNzVHJhY2tlciA9IHt9O1xuXG5mdW5jdGlvbiBnZXRDb29raWUobmFtZSkge1xuICAgIGNvbnN0IHZhbHVlID0gYDsgJHtkb2N1bWVudC5jb29raWV9YDtcbiAgICBjb25zdCBwYXJ0cyA9IHZhbHVlLnNwbGl0KGA7ICR7bmFtZX09YCk7XG4gICAgaWYgKHBhcnRzLmxlbmd0aCA9PT0gMikgcmV0dXJuIHBhcnRzLnBvcCgpLnNwbGl0KFwiO1wiKS5zaGlmdCgpO1xufVxuXG5sZXQgc3R1ZHlDbHVlc0NvbnZlcnNhdGlvbklkID0gLTE7XG5cbmZ1bmN0aW9uIGFwcGVuZFN0dWR5Q2x1ZXNNZXNzYWdlKG1lc3NhZ2VzRWwsIHJvbGUsIHRleHQsIGlzSHRtbCA9IGZhbHNlKSB7XG4gICAgY29uc3QgYnViYmxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBidWJibGUuY2xhc3NOYW1lID0gYHN0dWR5Y2x1ZXMtbWVzc2FnZSAke3JvbGV9YDtcbiAgICBpZiAoaXNIdG1sKSB7XG4gICAgICAgIGJ1YmJsZS5pbm5lckhUTUwgPSB0ZXh0O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGJ1YmJsZS50ZXh0Q29udGVudCA9IHRleHQ7XG4gICAgfVxuICAgIG1lc3NhZ2VzRWwuYXBwZW5kQ2hpbGQoYnViYmxlKTtcbiAgICBtZXNzYWdlc0VsLnNjcm9sbFRvcCA9IG1lc3NhZ2VzRWwuc2Nyb2xsSGVpZ2h0O1xufVxuXG5mdW5jdGlvbiBjcmVhdGVTdHVkeUNsdWVzV2lkZ2V0KCkge1xuICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN0dWR5Y2x1ZXMtZmFiXCIpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcbiAgICBzdHlsZS50ZXh0Q29udGVudCA9IGBcbiAgICAgICAgI3N0dWR5Y2x1ZXMtZmFiIHtcbiAgICAgICAgICAgIHBvc2l0aW9uOiBmaXhlZDtcbiAgICAgICAgICAgIHJpZ2h0OiAyNHB4O1xuICAgICAgICAgICAgYm90dG9tOiAyNHB4O1xuICAgICAgICAgICAgei1pbmRleDogOTk5OTtcbiAgICAgICAgICAgIGJvcmRlcjogbm9uZTtcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDk5OTlweDtcbiAgICAgICAgICAgIHBhZGRpbmc6IDEycHggMThweDtcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICAgICAgICBjb2xvcjogI2ZmZjtcbiAgICAgICAgICAgIGJhY2tncm91bmQ6ICMyNTYzZWI7XG4gICAgICAgICAgICBib3gtc2hhZG93OiAwIDhweCAyNHB4IHJnYmEoMCwgMCwgMCwgMC4yKTtcbiAgICAgICAgfVxuXG4gICAgICAgICNzdHVkeWNsdWVzLWNoYXQge1xuICAgICAgICAgICAgcG9zaXRpb246IGZpeGVkO1xuICAgICAgICAgICAgcmlnaHQ6IDI0cHg7XG4gICAgICAgICAgICBib3R0b206IDc4cHg7XG4gICAgICAgICAgICB6LWluZGV4OiA5OTk5O1xuICAgICAgICAgICAgd2lkdGg6IG1pbig0MjBweCwgY2FsYygxMDB2dyAtIDMycHgpKTtcbiAgICAgICAgICAgIGhlaWdodDogbWluKDUyMHB4LCBjYWxjKDEwMHZoIC0gMTIwcHgpKTtcbiAgICAgICAgICAgIGJhY2tncm91bmQ6ICNmZmY7XG4gICAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCAjZDFkNWRiO1xuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogMTJweDtcbiAgICAgICAgICAgIGJveC1zaGFkb3c6IDAgMTRweCAzNnB4IHJnYmEoMCwgMCwgMCwgMC4yNSk7XG4gICAgICAgICAgICBkaXNwbGF5OiBub25lO1xuICAgICAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgICAgIG92ZXJmbG93OiBoaWRkZW47XG4gICAgICAgIH1cblxuICAgICAgICAjc3R1ZHljbHVlcy1jaGF0Lm9wZW4ge1xuICAgICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgfVxuXG4gICAgICAgIC5zdHVkeWNsdWVzLWhlYWRlciB7XG4gICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgICAgICAgICAgIHBhZGRpbmc6IDEwcHggMTJweDtcbiAgICAgICAgICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjZTVlN2ViO1xuICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgICAgICAgICAgIGJhY2tncm91bmQ6ICNmOWZhZmI7XG4gICAgICAgIH1cblxuICAgICAgICAuc3R1ZHljbHVlcy1jbG9zZSB7XG4gICAgICAgICAgICBib3JkZXI6IG5vbmU7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcbiAgICAgICAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTZweDtcbiAgICAgICAgICAgIGxpbmUtaGVpZ2h0OiAxO1xuICAgICAgICB9XG5cbiAgICAgICAgLnN0dWR5Y2x1ZXMtY29hY2gtdG9nZ2xlIHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICAgICAgZ2FwOiA2cHg7XG4gICAgICAgICAgICBmb250LXNpemU6IDEycHg7XG4gICAgICAgICAgICBmb250LXdlaWdodDogNTAwO1xuICAgICAgICAgICAgY29sb3I6ICM0YjU1NjM7XG4gICAgICAgIH1cblxuICAgICAgICAuc3R1ZHljbHVlcy1jb2FjaC10b2dnbGUgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdIHtcbiAgICAgICAgICAgIGFwcGVhcmFuY2U6IG5vbmU7XG4gICAgICAgICAgICAtd2Via2l0LWFwcGVhcmFuY2U6IG5vbmU7XG4gICAgICAgICAgICB3aWR0aDogMzJweDtcbiAgICAgICAgICAgIGhlaWdodDogMThweDtcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDk5OTlweDtcbiAgICAgICAgICAgIGJhY2tncm91bmQ6ICNkMWQ1ZGI7XG4gICAgICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgICAgICAgICB0cmFuc2l0aW9uOiBiYWNrZ3JvdW5kIDAuMnM7XG4gICAgICAgICAgICBmbGV4LXNocmluazogMDtcbiAgICAgICAgfVxuXG4gICAgICAgIC5zdHVkeWNsdWVzLWNvYWNoLXRvZ2dsZSBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl06OmFmdGVyIHtcbiAgICAgICAgICAgIGNvbnRlbnQ6IFwiXCI7XG4gICAgICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICAgICAgICB0b3A6IDJweDtcbiAgICAgICAgICAgIGxlZnQ6IDJweDtcbiAgICAgICAgICAgIHdpZHRoOiAxNHB4O1xuICAgICAgICAgICAgaGVpZ2h0OiAxNHB4O1xuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogNTAlO1xuICAgICAgICAgICAgYmFja2dyb3VuZDogI2ZmZjtcbiAgICAgICAgICAgIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjJzO1xuICAgICAgICB9XG5cbiAgICAgICAgLnN0dWR5Y2x1ZXMtY29hY2gtdG9nZ2xlIGlucHV0W3R5cGU9XCJjaGVja2JveFwiXTpjaGVja2VkIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQ6ICMyNTYzZWI7XG4gICAgICAgIH1cblxuICAgICAgICAuc3R1ZHljbHVlcy1jb2FjaC10b2dnbGUgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdOmNoZWNrZWQ6OmFmdGVyIHtcbiAgICAgICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgxNHB4KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC5zdHVkeWNsdWVzLW1lc3NhZ2VzIHtcbiAgICAgICAgICAgIGZsZXg6IDE7XG4gICAgICAgICAgICBvdmVyZmxvdy15OiBhdXRvO1xuICAgICAgICAgICAgcGFkZGluZzogMTJweDtcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgICAgICAgZ2FwOiAxMHB4O1xuICAgICAgICAgICAgYmFja2dyb3VuZDogdmFyKC0tYmFja2dyb3VuZCk7XG4gICAgICAgICAgICBjb2xvcjogdmFyKC0tYm9keUZvbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLnN0dWR5Y2x1ZXMtbWVzc2FnZSB7XG4gICAgICAgICAgICBtYXgtd2lkdGg6IDg1JTtcbiAgICAgICAgICAgIHBhZGRpbmc6IDEwcHggMTJweDtcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDEwcHg7XG4gICAgICAgICAgICB3aGl0ZS1zcGFjZTogcHJlLXdyYXA7XG4gICAgICAgICAgICB3b3JkLWJyZWFrOiBicmVhay13b3JkO1xuICAgICAgICAgICAgZm9udC1zaXplOiAxNHB4O1xuICAgICAgICAgICAgbGluZS1oZWlnaHQ6IDEuNDtcbiAgICAgICAgfVxuXG4gICAgICAgIC5zdHVkeWNsdWVzLW1lc3NhZ2UudXNlciB7XG4gICAgICAgICAgICBtYXJnaW4tbGVmdDogYXV0bztcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IHZhcigtLWNvbXBvbmVudEJnQ29sb3IpO1xuICAgICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgI2JmZGJmZTtcbiAgICAgICAgICAgIGNvbG9yOiB2YXIoLS1ib2R5Rm9udCk7XG4gICAgICAgIH1cblxuICAgICAgICAuc3R1ZHljbHVlcy1tZXNzYWdlLmFzc2lzdGFudCB7XG4gICAgICAgICAgICBtYXJnaW4tcmlnaHQ6IGF1dG87XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiB2YXIoLS1iYWNrZ3JvdW5kKTtcbiAgICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWdyYXlUb1doaXRlKTtcbiAgICAgICAgICAgIGNvbG9yOiB2YXIoLS1ib2R5Rm9udCk7XG4gICAgICAgIH1cblxuICAgICAgICAuc3R1ZHljbHVlcy1tZXNzYWdlLnN0dWR5Y2x1ZXMtbG9hZGluZyB7XG4gICAgICAgICAgICBjb2xvcjogdmFyKC0tYm9keUZvbnQpO1xuICAgICAgICAgICAgZm9udC1zdHlsZTogaXRhbGljO1xuICAgICAgICB9XG5cbiAgICAgICAgLnN0dWR5Y2x1ZXMtc3Bpbm5lciB7XG4gICAgICAgICAgICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcbiAgICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgICAgICBnYXA6IDRweDtcbiAgICAgICAgfVxuXG4gICAgICAgIC5zdHVkeWNsdWVzLXNwaW5uZXItZG90IHtcbiAgICAgICAgICAgIHdpZHRoOiA2cHg7XG4gICAgICAgICAgICBoZWlnaHQ6IDZweDtcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgICAgICAgICAgIGJhY2tncm91bmQ6ICM2YjcyODA7XG4gICAgICAgICAgICBvcGFjaXR5OiAwLjM1O1xuICAgICAgICAgICAgYW5pbWF0aW9uOiBzdHVkeWNsdWVzLWRvdC1wdWxzZSAxcyBpbmZpbml0ZSBlYXNlLWluLW91dDtcbiAgICAgICAgfVxuXG4gICAgICAgIC5zdHVkeWNsdWVzLXNwaW5uZXItZG90Om50aC1jaGlsZCgyKSB7XG4gICAgICAgICAgICBhbmltYXRpb24tZGVsYXk6IDAuMTVzO1xuICAgICAgICB9XG5cbiAgICAgICAgLnN0dWR5Y2x1ZXMtc3Bpbm5lci1kb3Q6bnRoLWNoaWxkKDMpIHtcbiAgICAgICAgICAgIGFuaW1hdGlvbi1kZWxheTogMC4zcztcbiAgICAgICAgfVxuXG4gICAgICAgIEBrZXlmcmFtZXMgc3R1ZHljbHVlcy1kb3QtcHVsc2Uge1xuICAgICAgICAgICAgMCUsXG4gICAgICAgICAgICA4MCUsXG4gICAgICAgICAgICAxMDAlIHtcbiAgICAgICAgICAgICAgICBvcGFjaXR5OiAwLjM1O1xuICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICA0MCUge1xuICAgICAgICAgICAgICAgIG9wYWNpdHk6IDE7XG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtOiBzY2FsZSgxLjIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLnN0dWR5Y2x1ZXMtaW5wdXRiYXIge1xuICAgICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgICAgIGdhcDogOHB4O1xuICAgICAgICAgICAgcGFkZGluZzogMTBweDtcbiAgICAgICAgICAgIGJvcmRlci10b3A6IDFweCBzb2xpZCAjZTVlN2ViO1xuICAgICAgICAgICAgYmFja2dyb3VuZDogI2ZmZjtcbiAgICAgICAgfVxuXG4gICAgICAgIC5zdHVkeWNsdWVzLWlucHV0YmFyIGlucHV0IHtcbiAgICAgICAgICAgIGZsZXg6IDE7XG4gICAgICAgICAgICBtaW4td2lkdGg6IDA7XG4gICAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCAjZDFkNWRiO1xuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogOHB4O1xuICAgICAgICAgICAgcGFkZGluZzogOHB4IDEwcHg7XG4gICAgICAgICAgICBmb250LXNpemU6IDE0cHg7XG4gICAgICAgIH1cblxuICAgICAgICAuc3R1ZHljbHVlcy1pbnB1dGJhciBidXR0b24ge1xuICAgICAgICAgICAgYm9yZGVyOiBub25lO1xuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogOHB4O1xuICAgICAgICAgICAgcGFkZGluZzogOHB4IDEycHg7XG4gICAgICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICAgICAgICBjb2xvcjogI2ZmZjtcbiAgICAgICAgICAgIGJhY2tncm91bmQ6ICMyNTYzZWI7XG4gICAgICAgICAgICBmb250LXdlaWdodDogNjAwO1xuICAgICAgICB9XG4gICAgYDtcbiAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHN0eWxlKTtcblxuICAgIGNvbnN0IGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgYnV0dG9uLmlkID0gXCJzdHVkeWNsdWVzLWZhYlwiO1xuICAgIGJ1dHRvbi50ZXh0Q29udGVudCA9IFwiU3R1ZHlDbHVlcyBDaGF0XCI7XG5cbiAgICBjb25zdCBjaGF0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBjaGF0LmlkID0gXCJzdHVkeWNsdWVzLWNoYXRcIjtcbiAgICBjaGF0LmlubmVySFRNTCA9IGBcbiAgICAgICAgPGRpdiBjbGFzcz1cInN0dWR5Y2x1ZXMtaGVhZGVyXCI+XG4gICAgICAgICAgICA8c3Bhbj5TdHVkeUNsdWVzPC9zcGFuPlxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwic3R1ZHljbHVlcy1jb2FjaC10b2dnbGVcIj5cbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgaWQ9XCJzdHVkeWNsdWVzLWNvYWNoLW1vZGVcIiBjaGVja2VkIC8+XG4gICAgICAgICAgICAgICAgQ29hY2ggTW9kZVxuICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJzdHVkeWNsdWVzLWNsb3NlXCIgYXJpYS1sYWJlbD1cIkNsb3NlIGNoYXRcIj7inJU8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJzdHVkeWNsdWVzLW1lc3NhZ2VzXCI+PC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJzdHVkeWNsdWVzLWlucHV0YmFyXCI+XG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBwbGFjZWhvbGRlcj1cIkFzayBhIHF1ZXN0aW9uIGFib3V0IHRoaXMgY291cnNlLi4uXCIgLz5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiPlNlbmQ8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgYDtcblxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoYnV0dG9uKTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGNoYXQpO1xuXG4gICAgY29uc3QgY2xvc2VCdG4gPSBjaGF0LnF1ZXJ5U2VsZWN0b3IoXCIuc3R1ZHljbHVlcy1jbG9zZVwiKTtcbiAgICBjb25zdCBtZXNzYWdlc0VsID0gY2hhdC5xdWVyeVNlbGVjdG9yKFwiLnN0dWR5Y2x1ZXMtbWVzc2FnZXNcIik7XG4gICAgY29uc3QgaW5wdXRFbCA9IGNoYXQucXVlcnlTZWxlY3RvcihcIi5zdHVkeWNsdWVzLWlucHV0YmFyIGlucHV0XCIpO1xuICAgIGNvbnN0IHNlbmRCdG4gPSBjaGF0LnF1ZXJ5U2VsZWN0b3IoXCIuc3R1ZHljbHVlcy1pbnB1dGJhciBidXR0b25cIik7XG4gICAgY29uc3QgY29hY2hUb2dnbGUgPSBjaGF0LnF1ZXJ5U2VsZWN0b3IoXCIjc3R1ZHljbHVlcy1jb2FjaC1tb2RlXCIpO1xuXG4gICAgbGV0IGNvYWNoTW9kZSA9IGNvYWNoVG9nZ2xlLmNoZWNrZWQ7XG4gICAgY29hY2hUb2dnbGUuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoKSA9PiB7XG4gICAgICAgIGNvYWNoTW9kZSA9IGNvYWNoVG9nZ2xlLmNoZWNrZWQ7XG4gICAgfSk7XG5cbiAgICBjb25zdCB0b2dnbGVDaGF0ID0gKCkgPT4ge1xuICAgICAgICBjaGF0LmNsYXNzTGlzdC50b2dnbGUoXCJvcGVuXCIpO1xuICAgICAgICBpZiAoY2hhdC5jbGFzc0xpc3QuY29udGFpbnMoXCJvcGVuXCIpKSB7XG4gICAgICAgICAgICBpbnB1dEVsLmZvY3VzKCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc3Qgc2VuZE1lc3NhZ2UgPSBhc3luYyAoKSA9PiB7XG4gICAgICAgIGxldCBxdWVyeSA9IGlucHV0RWwudmFsdWUudHJpbSgpO1xuICAgICAgICBpZiAoIXF1ZXJ5KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHNlY3Rpb25JbmZvID0gXCJcIjtcbiAgICAgICAgLy8gZmluZCB0aGUgc2VjdGlvbiB0aXRsZSBvbiB0aGUgcGFnZSB0byBpbmNsdWRlIGluIHRoZSBpbml0aWFsIHF1ZXJ5XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJib2R5LnByZXRleHRcIikgJiZcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJzZWN0aW9uLnNlY3Rpb25cIilcbiAgICAgICAgKSB7XG4gICAgICAgICAgICBsZXQgc2VjdGlvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJzZWN0aW9uLnNlY3Rpb25cIik7XG4gICAgICAgICAgICBsZXQgc2VjdGlvblRpdGxlID0gc2VjdGlvbi5xdWVyeVNlbGVjdG9yKFwic3Bhbi50aXRsZVwiKS5pbm5lclRleHQ7XG4gICAgICAgICAgICBsZXQgc2VjdGlvbk51bWJlciA9XG4gICAgICAgICAgICAgICAgc2VjdGlvbi5xdWVyeVNlbGVjdG9yKFwic3Bhbi5jb2RlbnVtYmVyXCIpLmlubmVyVGV4dDtcbiAgICAgICAgICAgIHNlY3Rpb25JbmZvID0gYCR7c2VjdGlvbk51bWJlcn0gJHtzZWN0aW9uVGl0bGV9YDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBzZWN0aW9uU3BhbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJzcGFuLnNlY3Rpb24tbnVtYmVyXCIpO1xuICAgICAgICAgICAgaWYgKHNlY3Rpb25TcGFuKSB7XG4gICAgICAgICAgICAgICAgc2VjdGlvbkluZm8gPSBzZWN0aW9uU3Bhbi5wYXJlbnRFbGVtZW50LmlubmVyVGV4dC50cmltKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHN0dWR5Q2x1ZXNDb252ZXJzYXRpb25JZCA9PT0gLTEpIHtcbiAgICAgICAgICAgIGlmIChzZWN0aW9uSW5mbykge1xuICAgICAgICAgICAgICAgIHF1ZXJ5ID0gYFJlZ2FyZGluZyBzZWN0aW9uIFwiJHtzZWN0aW9uSW5mb31cIjogJHtxdWVyeX1gO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJiLmxvZ0Jvb2tFdmVudCh7XG4gICAgICAgICAgICBldmVudDogXCJzdHVkeWNsdWVzX3F1ZXJ5XCIsXG4gICAgICAgICAgICBhY3Q6IGBxdWVyeTogJHtxdWVyeX1gLFxuICAgICAgICAgICAgZGl2X2lkOiBgJHtzZWN0aW9uSW5mb31gLFxuICAgICAgICB9KTtcbiAgICAgICAgYXBwZW5kU3R1ZHlDbHVlc01lc3NhZ2UobWVzc2FnZXNFbCwgXCJ1c2VyXCIsIHF1ZXJ5KTsgLy8gdG9kbzogbWFrZSB0aGlzIGNvbmRpdGlvbmFsIG9uIGJlaW5nIGEgYm9vayBwYWdlIGFuZCBvbiB0aGUgYm9vayBiZWluZyBvbmUgb2YgdGhlIHN1cHBvcnRlZCBib29rc1xuICAgICAgICBpbnB1dEVsLnZhbHVlID0gXCJcIjtcbiAgICAgICAgc2VuZEJ0bi5kaXNhYmxlZCA9IHRydWU7XG5cbiAgICAgICAgY29uc3QgbG9hZGluZ0J1YmJsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGxvYWRpbmdCdWJibGUuY2xhc3NOYW1lID1cbiAgICAgICAgICAgIFwic3R1ZHljbHVlcy1tZXNzYWdlIGFzc2lzdGFudCBzdHVkeWNsdWVzLWxvYWRpbmdcIjtcbiAgICAgICAgbG9hZGluZ0J1YmJsZS5pbm5lckhUTUwgPVxuICAgICAgICAgICAgJ1RoaW5raW5nIDxzcGFuIGNsYXNzPVwic3R1ZHljbHVlcy1zcGlubmVyXCI+PHNwYW4gY2xhc3M9XCJzdHVkeWNsdWVzLXNwaW5uZXItZG90XCI+PC9zcGFuPjxzcGFuIGNsYXNzPVwic3R1ZHljbHVlcy1zcGlubmVyLWRvdFwiPjwvc3Bhbj48c3BhbiBjbGFzcz1cInN0dWR5Y2x1ZXMtc3Bpbm5lci1kb3RcIj48L3NwYW4+PC9zcGFuPic7XG4gICAgICAgIG1lc3NhZ2VzRWwuYXBwZW5kQ2hpbGQobG9hZGluZ0J1YmJsZSk7XG4gICAgICAgIG1lc3NhZ2VzRWwuc2Nyb2xsVG9wID0gbWVzc2FnZXNFbC5zY3JvbGxIZWlnaHQ7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXG4gICAgICAgICAgICAgICAgYC9hc3NpZ25tZW50L3N0dWRlbnQvc3R1ZHljbHVlc19xdWVyeWAsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIEFjY2VwdDogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXJ5LFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udmVyc2F0aW9uX2lkOiBzdHVkeUNsdWVzQ29udmVyc2F0aW9uSWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2FjaE1vZGUsXG4gICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgICAgICAgICBgUmVxdWVzdCBmYWlsZWQgd2l0aCBzdGF0dXMgJHtyZXNwb25zZS5zdGF0dXN9YCxcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBwYXlsb2FkID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICAgICAgY29uc3QgZGV0YWlsID0gcGF5bG9hZD8uZGV0YWlsIHx8IHt9O1xuICAgICAgICAgICAgY29uc3Qgc3R1ZHljbHVlc1Jlc3BvbnNlID0gZGV0YWlsPy5yZXNwb25zZSB8fCB7fTtcbiAgICAgICAgICAgIGNvbnN0IGxsbVJlc3BvbnNlID0gc3R1ZHljbHVlc1Jlc3BvbnNlPy5sbG1fcmVzcG9uc2U7XG4gICAgICAgICAgICBjb25zdCByZWZlcmVuY2VzID0gc3R1ZHljbHVlc1Jlc3BvbnNlPy5yZWZlcmVuY2VzIHx8IHt9O1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIGRldGFpbC5jb252ZXJzYXRpb25faWQgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgICAgICBzdHVkeUNsdWVzQ29udmVyc2F0aW9uSWQgPSBkZXRhaWwuY29udmVyc2F0aW9uX2lkO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBtYXJrZG93blJlc3BvbnNlID0gKFxuICAgICAgICAgICAgICAgIGxsbVJlc3BvbnNlIHx8IFwiTm8gcmVzcG9uc2UgYXZhaWxhYmxlIGZyb20gU3R1ZHlDbHVlcy5cIlxuICAgICAgICAgICAgKS5yZXBsYWNlKC9cXFsoW15cXF1dKylcXF1cXCgoW14pXSspXFwpL2csIChtYXRjaCwgdGV4dCwga2V5KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdXJsID0gcmVmZXJlbmNlc1trZXldPy5jb250ZW50X3VybDtcbiAgICAgICAgICAgICAgICByZXR1cm4gdXJsID8gYFske3RleHR9XSgke3VybH0pYCA6IG1hdGNoO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb25zdCBmb3JtYXR0ZWRSZXNwb25zZSA9IG1hcmtlZC5wYXJzZShtYXJrZG93blJlc3BvbnNlKTtcbiAgICAgICAgICAgIC8vIGFkZCBhIHRhcmdldD1cIl9ibGFua1wiIHRvIGFsbCBsaW5rcyBpbiB0aGUgZm9ybWF0dGVkIHJlc3BvbnNlXG4gICAgICAgICAgICBjb25zdCB0ZW1wRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgIHRlbXBEaXYuaW5uZXJIVE1MID0gZm9ybWF0dGVkUmVzcG9uc2U7XG4gICAgICAgICAgICB0ZW1wRGl2LnF1ZXJ5U2VsZWN0b3JBbGwoXCJhXCIpLmZvckVhY2goKGEpID0+IHtcbiAgICAgICAgICAgICAgICBhLnNldEF0dHJpYnV0ZShcInRhcmdldFwiLCBcIl9ibGFua1wiKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc3QgZmluYWxGb3JtYXR0ZWRSZXNwb25zZSA9IHRlbXBEaXYuaW5uZXJIVE1MO1xuICAgICAgICAgICAgYXBwZW5kU3R1ZHlDbHVlc01lc3NhZ2UoXG4gICAgICAgICAgICAgICAgbWVzc2FnZXNFbCxcbiAgICAgICAgICAgICAgICBcImFzc2lzdGFudFwiLFxuICAgICAgICAgICAgICAgIGZpbmFsRm9ybWF0dGVkUmVzcG9uc2UsXG4gICAgICAgICAgICAgICAgdHJ1ZSxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByYi5sb2dCb29rRXZlbnQoe1xuICAgICAgICAgICAgICAgIGV2ZW50OiBcInN0dWR5Y2x1ZXNfcmVzcG9uc2VcIixcbiAgICAgICAgICAgICAgICBhY3Q6IGBjb2FjaDoke2NvYWNoTW9kZX06cmVzcG9uc2U6JHttYXJrZG93blJlc3BvbnNlLnN1YnN0cmluZygwLCA1MTIpfWAsXG4gICAgICAgICAgICAgICAgZGl2X2lkOiBgJHtzZWN0aW9uSW5mb31gLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgYXBwZW5kU3R1ZHlDbHVlc01lc3NhZ2UoXG4gICAgICAgICAgICAgICAgbWVzc2FnZXNFbCxcbiAgICAgICAgICAgICAgICBcImFzc2lzdGFudFwiLFxuICAgICAgICAgICAgICAgIFwiU29ycnksIFN0dWR5Q2x1ZXMgaXMgdW5hdmFpbGFibGUgcmlnaHQgbm93LiBQbGVhc2UgdHJ5IGFnYWluLlwiLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJTdHVkeUNsdWVzIGNoYXQgZXJyb3I6XCIsIGVycik7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICBsb2FkaW5nQnViYmxlLnJlbW92ZSgpO1xuICAgICAgICAgICAgc2VuZEJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgaW5wdXRFbC5mb2N1cygpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdG9nZ2xlQ2hhdCk7XG4gICAgY2xvc2VCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRvZ2dsZUNoYXQpO1xuICAgIHNlbmRCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHNlbmRNZXNzYWdlKTtcbiAgICBpbnB1dEVsLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIChldnQpID0+IHtcbiAgICAgICAgaWYgKGV2dC5rZXkgPT09IFwiRW50ZXJcIikge1xuICAgICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBzZW5kTWVzc2FnZSgpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIHNob3VsZFNob3dTdHVkeUNsdWVzV2lkZ2V0KCkge1xuICAgIGlmICghKFxuICAgICAgICBsb2NhdGlvbi5wYXRobmFtZS5pbmNsdWRlcyhcIi9ucy9ib29rcy9cIikgfHxcbiAgICAgICAgbG9jYXRpb24ucGF0aG5hbWUuaW5jbHVkZXMoXCJkb0Fzc2lnbm1lbnRcIilcbiAgICApKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZUJvb2tDb25maWcuY291cnNlX2F0dHJzPy5zdHVkeUNsdWVzID09PSBcIlRydWVcIjtcbn1cblxuYXN5bmMgZnVuY3Rpb24gaGFuZGxlUGFnZVNldHVwKCkge1xuICAgIHZhciBtZXNzO1xuICAgIGlmIChlQm9va0NvbmZpZy51c2VSdW5lc3RvbmVTZXJ2aWNlcykge1xuICAgICAgICBsZXQgaGVhZGVycyA9IG5ldyBIZWFkZXJzKHtcbiAgICAgICAgICAgIFwiQ29udGVudC10eXBlXCI6IFwiYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOFwiLFxuICAgICAgICAgICAgQWNjZXB0OiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICAgICAgfSk7XG4gICAgICAgIGxldCBkYXRhID0ge1xuICAgICAgICAgICAgdGltZXpvbmVvZmZzZXQ6IG5ldyBEYXRlKCkuZ2V0VGltZXpvbmVPZmZzZXQoKSAvIDYwLFxuICAgICAgICAgICAgdGltZXpvbmU6IEludGwuRGF0ZVRpbWVGb3JtYXQoKS5yZXNvbHZlZE9wdGlvbnMoKS50aW1lWm9uZSxcbiAgICAgICAgfTtcbiAgICAgICAgbGV0IFJTX2luZm8gPSBnZXRDb29raWUoXCJSU19pbmZvXCIpO1xuICAgICAgICB2YXIgdHpfbWF0Y2ggPSBmYWxzZTtcbiAgICAgICAgaWYgKFJTX2luZm8pIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgbGV0IGNsZWFuZWQgPSBSU19pbmZvLnJlcGxhY2UoL1xcXFwwNTQvZywgXCIsXCIpOyAvLyBoYW5kbGUgb2N0YWwgY29tbWEgZW5jb2RpbmdcbiAgICAgICAgICAgICAgICBsZXQgaW5mbyA9IEpTT04ucGFyc2UoZGVjb2RlVVJJQ29tcG9uZW50KGNsZWFuZWQpKTtcbiAgICAgICAgICAgICAgICBpbmZvID0gSlNPTi5wYXJzZShkZWNvZGVVUklDb21wb25lbnQoaW5mbykpO1xuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgaW5mby50aW1lem9uZSA9PT0gZGF0YS50aW1lem9uZSAmJlxuICAgICAgICAgICAgICAgICAgICBpbmZvLnR6X29mZnNldCA9PT0gZGF0YS50aW1lem9uZW9mZnNldFxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiVGltZXpvbmUgY29va2llIG1hdGNoZXMsIG5vdCBzZW5kaW5nIHRpbWV6b25lIHRvIHNlcnZlclwiLFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB0el9tYXRjaCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAgICAgICAgICAgICAgIFwiRXJyb3IgcGFyc2luZyBSU19pbmZvIGNvb2tpZSwgc2VuZGluZyB0aW1lem9uZSB0byBzZXJ2ZXJcIixcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh0el9tYXRjaCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIC8vIFNldCBhIGNvb2tpZSBzbyB3ZSBkb24ndCBoYXZlIHRvIGRvIHRoaXMgYWdhaW4gZm9yIGEgd2hpbGUuXG4gICAgICAgICAgICBsZXQgcmVxdWVzdCA9IG5ldyBSZXF1ZXN0KFxuICAgICAgICAgICAgICAgIGAke2VCb29rQ29uZmlnLm5ld19zZXJ2ZXJfcHJlZml4fS9sb2dnZXIvc2V0X3R6X29mZnNldGAsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShkYXRhKSxcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczogaGVhZGVycyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2gocmVxdWVzdCk7XG4gICAgICAgICAgICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFxuICAgICAgICAgICAgICAgICAgICAgICAgYEZhaWxlZCB0byBzZXQgdGltZXpvbmUhICR7cmVzcG9uc2Uuc3RhdHVzVGV4dH1gLFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYEVycm9yIHNldHRpbmcgdGltZXpvbmUgJHtlfWApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gUFRYIGdlbmVyYXRlZCBwYWdlcyBtYXkgaGF2ZSBzdGFsZSBIVE1MLiBGb3JjaWJseSByZS1yZW5kZXIgdGhlIGNvbnRlbnRcbiAgICAvLyBvZiB0aGUgcHJvZ3Jlc3MgY29udGFpbmVyLiBBbnkgbG9naWMgdGhhdCBtb2RpZmllcyB0aGUgcHJvZ3Jlc3MgY29udGFpbmVyXG4gICAgLy8gc2hvdWxkIGJlIGRvbmUgYWZ0ZXIgdGhpcyBwb2ludCwgb3IgaXQgd2lsbCBiZSBvdmVyd3JpdHRlbi5cbiAgICBjb25zdCBzY3Byb2dyZXNzY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzY3Byb2dyZXNzY29udGFpbmVyXCIpO1xuICAgIGlmIChzY3Byb2dyZXNzY29udGFpbmVyKVxuICAgICAgICBzY3Byb2dyZXNzY29udGFpbmVyLmlubmVySFRNTCA9IGBcbiAgICAgICAgICAgIDxkaXYgaWQ9XCJzY3Byb2dyZXNzLWFjdGl2aXR5LWNvdW50XCI+XG4gICAgICAgICAgICAgICAgWW91IGhhdmUgYXR0ZW1wdGVkIDxzcGFuIGlkPVwic2Nwcm9ncmVzc3RvdGFsXCI+PC9zcGFuPiBvZlxuICAgICAgICAgICAgICAgIDxzcGFuIGlkPVwic2Nwcm9ncmVzc3Bvc3NcIj48L3NwYW4+IGFjdGl2aXRpZXMgb24gdGhpcyBwYWdlLlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGlkPVwic3ViY2hhcHRlcnByb2dyZXNzXCIgYXJpYS1sYWJlbD1cIlBhZ2UgcHJvZ3Jlc3NcIj48L2Rpdj5cbiAgICAgICAgYDtcblxuICAgIGNvbnNvbGUubG9nKGBUaGlzIHBhZ2Ugc2VydmVkIGJ5ICR7ZUJvb2tDb25maWcuc2VydmVkX2J5fWApO1xuICAgIGlmIChlQm9va0NvbmZpZy5pc0xvZ2dlZEluKSB7XG4gICAgICAgIG1lc3MgPSBgdXNlcm5hbWU6ICR7ZUJvb2tDb25maWcudXNlcm5hbWV9YDtcbiAgICAgICAgaWYgKCFlQm9va0NvbmZpZy5pc0luc3RydWN0b3IpIHtcbiAgICAgICAgICAgIGNvbnN0IGlwRHJvcGRvd24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImlwX2Ryb3Bkb3duX2xpbmtcIik7XG4gICAgICAgICAgICBpZiAoaXBEcm9wZG93biAmJiB0eXBlb2YgaXBEcm9wZG93bi5yZW1vdmUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgIGlwRHJvcGRvd24ucmVtb3ZlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBpbnN0UGVlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW5zdF9wZWVyX2xpbmtcIik7XG4gICAgICAgICAgICBpZiAoaW5zdFBlZXIgJiYgdHlwZW9mIGluc3RQZWVyLnJlbW92ZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgaW5zdFBlZXIucmVtb3ZlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoXCJydW5lc3RvbmU6bG9naW5cIikpO1xuXG4gICAgICAgIGFkZFJlYWRpbmdMaXN0KCk7XG5cbiAgICAgICAgLy8gV2FybiBpZiB0aGUgY291cnNlIGhhcyBub3Qgc3RhcnRlZCB5ZXRcbiAgICAgICAgaWYgKCFpc0NvdXJzZVN0YXJ0ZWQoKSkge1xuICAgICAgICAgICAgY29uc3QgcHR4Q29udGVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHR4LWNvbnRlbnRcIik7XG4gICAgICAgICAgICBpZiAocHR4Q29udGVudCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHdhcm5pbmdDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgICAgIHdhcm5pbmdDb250YWluZXIuY2xhc3NOYW1lID0gXCJwdHgtcnVuZXN0b25lLWNvbnRhaW5lclwiO1xuICAgICAgICAgICAgICAgIGNvbnN0IHdhcm5pbmdEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgICAgIHdhcm5pbmdEaXYuY2xhc3NOYW1lID1cbiAgICAgICAgICAgICAgICAgICAgXCJjb3Vyc2Utbm90LXN0YXJ0ZWQtd2FybmluZyBhbGVydCBhbGVydC1kYW5nZXJcIjtcbiAgICAgICAgICAgICAgICB3YXJuaW5nRGl2LnRleHRDb250ZW50ID0gY291cnNlTm90U3RhcnRlZE1lc3NhZ2UoKTtcbiAgICAgICAgICAgICAgICB3YXJuaW5nQ29udGFpbmVyLmFwcGVuZENoaWxkKHdhcm5pbmdEaXYpO1xuICAgICAgICAgICAgICAgIHB0eENvbnRlbnQuaW5zZXJ0QmVmb3JlKFxuICAgICAgICAgICAgICAgICAgICB3YXJuaW5nQ29udGFpbmVyLFxuICAgICAgICAgICAgICAgICAgICBwdHhDb250ZW50LmZpcnN0Q2hpbGQsXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE9ubHkgc2hvdyB0aGUgU3R1ZHlDbHVlcyB3aWRnZXQgb24gYm9vay9hc3NpZ25tZW50IHBhZ2VzIGZvciBjb3Vyc2VzIHdpdGggdGhlIHN0dWR5Q2x1ZXMgYXR0cmlidXRlIHNldC5cbiAgICAgICAgaWYgKHNob3VsZFNob3dTdHVkeUNsdWVzV2lkZ2V0KCkpIHtcbiAgICAgICAgICAgIGNyZWF0ZVN0dWR5Q2x1ZXNXaWRnZXQoKTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIG1lc3MgPSBcIk5vdCBsb2dnZWQgaW5cIjtcbiAgICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoXCJydW5lc3RvbmU6bG9nb3V0XCIpKTtcbiAgICAgICAgbGV0IGJ3ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJicm93c2luZ193YXJuaW5nXCIpO1xuICAgICAgICBpZiAoYncpIHtcbiAgICAgICAgICAgIGJ3LmlubmVySFRNTCA9XG4gICAgICAgICAgICAgICAgXCI8cCBjbGFzcz0nbmF2YmFyX21lc3NhZ2UnPlNhdmluZyBhbmQgTG9nZ2luZyBhcmUgRGlzYWJsZWQ8L3A+XCI7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGF3ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhZF93YXJuaW5nXCIpO1xuICAgICAgICBpZiAoYXcpIHtcbiAgICAgICAgICAgIGF3LmlubmVySFRNTCA9XG4gICAgICAgICAgICAgICAgXCI8cCBjbGFzcz0nbmF2YmFyX21lc3NhZ2UnPvCfmqsgTG9nLWluIHRvIFJlbW92ZSA8YSBocmVmPScvYWRtaW4vbGVnYWwvYWRzJz5BZHMhPC9hPiDwn5qrICZuYnNwOzwvcD5cIjtcbiAgICAgICAgfVxuICAgIH1cbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmxvZ2dlZGludXNlclwiKS5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgICBlbC5pbm5lckhUTUwgPSBtZXNzO1xuICAgIH0pO1xuXG4gICAgcGFnZVByb2dyZXNzVHJhY2tlciA9IG5ldyBQYWdlUHJvZ3Jlc3NCYXIoZUJvb2tDb25maWcuYWN0aXZpdGllcyk7XG4gICAgbm90aWZ5UnVuZXN0b25lQ29tcG9uZW50cygpO1xufVxuXG5mdW5jdGlvbiBzZXR1cE5hdmJhckxvZ2dlZEluKCkge1xuICAgIGNvbnN0IHByb2ZpbGVMaW5rID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwcm9maWxlbGlua1wiKTtcbiAgICBpZiAocHJvZmlsZUxpbmspIHByb2ZpbGVMaW5rLnN0eWxlLnJlbW92ZVByb3BlcnR5KFwiZGlzcGxheVwiKTtcbiAgICBjb25zdCBwYXNzd29yZExpbmsgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBhc3N3b3JkbGlua1wiKTtcbiAgICBpZiAocGFzc3dvcmRMaW5rKSBwYXNzd29yZExpbmsuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJkaXNwbGF5XCIpO1xuICAgIGNvbnN0IHJlZ2lzdGVyTGluayA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVnaXN0ZXJsaW5rXCIpO1xuICAgIGlmIChyZWdpc3RlckxpbmspIHJlZ2lzdGVyTGluay5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcImxpLmxvZ2lub3V0XCIpLmZvckVhY2goKGVsKSA9PiB7XG4gICAgICAgIGVsLmlubmVySFRNTCA9ICc8YSBocmVmPVwiL2FkbWluL2F1dGgvbG9nb3V0XCI+TG9nIE91dDwvYT4nO1xuICAgIH0pO1xufVxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInJ1bmVzdG9uZTpsb2dpblwiLCBzZXR1cE5hdmJhckxvZ2dlZEluKTtcblxuZnVuY3Rpb24gc2V0dXBOYXZiYXJMb2dnZWRPdXQoKSB7XG4gICAgaWYgKGVCb29rQ29uZmlnLnVzZVJ1bmVzdG9uZVNlcnZpY2VzKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwic2V0dXAgbmF2YmFyIGZvciBsb2dnZWQgb3V0XCIpO1xuICAgICAgICBjb25zdCByZWdpc3RlckxpbmsgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlZ2lzdGVybGlua1wiKTtcbiAgICAgICAgaWYgKHJlZ2lzdGVyTGluaykgcmVnaXN0ZXJMaW5rLnN0eWxlLnJlbW92ZVByb3BlcnR5KFwiZGlzcGxheVwiKTtcbiAgICAgICAgY29uc3QgcHJvZmlsZUxpbmsgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInByb2ZpbGVsaW5rXCIpO1xuICAgICAgICBpZiAocHJvZmlsZUxpbmspIHByb2ZpbGVMaW5rLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgY29uc3QgcGFzc3dvcmRMaW5rID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwYXNzd29yZGxpbmtcIik7XG4gICAgICAgIGlmIChwYXNzd29yZExpbmspIHBhc3N3b3JkTGluay5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgIGNvbnN0IGlwRHJvcGRvd24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImlwX2Ryb3Bkb3duX2xpbmtcIik7XG4gICAgICAgIGlmIChpcERyb3Bkb3duKSBpcERyb3Bkb3duLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgY29uc3QgaW5zdFBlZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImluc3RfcGVlcl9saW5rXCIpO1xuICAgICAgICBpZiAoaW5zdFBlZXIpIGluc3RQZWVyLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcImxpLmxvZ2lub3V0XCIpLmZvckVhY2goKGVsKSA9PiB7XG4gICAgICAgICAgICBlbC5pbm5lckhUTUwgPVxuICAgICAgICAgICAgICAgICc8YSBocmVmPVwiJyArXG4gICAgICAgICAgICAgICAgZUJvb2tDb25maWcuYXBwICtcbiAgICAgICAgICAgICAgICAnL2RlZmF1bHQvdXNlci9sb2dpblwiPkxvZ2luPC9hPic7XG4gICAgICAgIH0pO1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmZvb3RlclwiKS5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgICAgICAgZWwuaW5uZXJIVE1MID0gXCJ1c2VyIG5vdCBsb2dnZWQgaW5cIjtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInJ1bmVzdG9uZTpsb2dvdXRcIiwgc2V0dXBOYXZiYXJMb2dnZWRPdXQpO1xuXG5mdW5jdGlvbiBub3RpZnlSdW5lc3RvbmVDb21wb25lbnRzKCkge1xuICAgIC8vIFJ1bmVzdG9uZSBjb21wb25lbnRzIHdhaXQgdW50aWwgbG9naW4gcHJvY2VzcyBpcyBvdmVyIHRvIGxvYWQgY29tcG9uZW50cyBiZWNhdXNlIG9mIHN0b3JhZ2UgaXNzdWVzLiBUaGlzIHRyaWdnZXJzIHRoZSBgZHluYW1pYyBpbXBvcnQgbWFjaGluZXJ5YCwgd2hpY2ggdGhlbiBzZW5kcyB0aGUgbG9naW4gY29tcGxldGUgc2lnbmFsIHdoZW4gdGhpcyBhbmQgYWxsIGR5bmFtaWMgaW1wb3J0cyBhcmUgZmluaXNoZWQuXG4gICAgY29uc29sZS5sb2coXCJ0cmlnZ2VyaW5nIHJ1bmVzdG9uZTpwcmUtbG9naW4tY29tcGxldGVcIik7XG4gICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoXCJydW5lc3RvbmU6cHJlLWxvZ2luLWNvbXBsZXRlXCIpKTtcbn1cblxuLy8gVGhlIG9yaWdpbmFsIHR3byBhcHBlYWxzLCBzdGlsbCB1c2VkIGZvciB0aGUgaW5saW5lIGFkIChwYWdlcyB3aXRoIG5vIFByZVRlWHRcbi8vIG1hc3RoZWFkIG9yIG5hdmJhcikuIFNwaGlueCBib29rcyBjYXJyeSB0aGUgc2FtZSBjb3B5IGluIHRoZWlyIG93biBsYXlvdXRcbi8vIHRlbXBsYXRlIGFzIGBgYWQ9MWBgIGFuZCBgYGFkPTJgYC5cbmNvbnN0IExFR0FDWV9BRF9DT1BZID0gW1xuICAgIFwiUnVuZXN0b25lIEFjYWRlbXkgY2FuIG9ubHkgY29udGludWUgaWYgd2UgZ2V0IHN1cHBvcnQgZnJvbSBpbmRpdmlkdWFscyBsaWtlIHlvdS4gQXMgYSBzdHVkZW50IHlvdSBhcmUgd2VsbCBhd2FyZSBvZiB0aGUgaGlnaCBjb3N0IG9mIHRleHRib29rcy4gIE91ciBtaXNzaW9uIGlzIHRvIHByb3ZpZGUgZ3JlYXQgYm9va3MgdG8geW91IGZvciBmcmVlLCBidXQgd2UgYXNrIHRoYXQgeW91IGNvbnNpZGVyIGEgJDEwIGRvbmF0aW9uLCBtb3JlIGlmIHlvdSBjYW4gb3IgbGVzcyBpZiAkMTAgaXMgYSBidXJkZW4uXCIsXG4gICAgXCJNYWtpbmcgZ3JlYXQgc3R1ZmYgdGFrZXMgdGltZSBhbmQgJCQuICBJZiB5b3UgYXBwcmVjaWF0ZSB0aGUgYm9vayB5b3UgYXJlIHJlYWRpbmcgbm93IGFuZCB3YW50IHRvIGtlZXAgcXVhbGl0eSBtYXRlcmlhbHMgZnJlZSBmb3Igb3RoZXIgc3R1ZGVudHMgcGxlYXNlIGNvbnNpZGVyIGEgZG9uYXRpb24gdG8gUnVuZXN0b25lIEFjYWRlbXkuIFdlIGFzayB0aGF0IHlvdSBjb25zaWRlciBhICQxMCBkb25hdGlvbiwgYnV0IGlmIHlvdSBjYW4gZ2l2ZSBtb3JlIHRoYXRzIGdyZWF0LCBpZiAkMTAgaXMgdG9vIG11Y2ggZm9yIHlvdXIgYnVkZ2V0IHdlIHdvdWxkIGJlIGhhcHB5IHdpdGggd2hhdGV2ZXIgeW91IGNhbiBhZmZvcmQgYXMgYSBzaG93IG9mIHN1cHBvcnQuXCIsXG5dO1xuXG4vLyBUaGUgUHJlVGVYdCBiYW5uZXIgcm90YXRlcyBiZXR3ZWVuIHRoZXNlIGF0IHJhbmRvbS4gRWFjaCBoYXMgaXRzIG93biBgYGFkYGBcbi8vIG51bWJlciwgc3RhcnRpbmcgYWZ0ZXIgdGhlIGxlZ2FjeSBvbmVzLCBzbyBkb25hdGUtcGFnZSB2aXNpdHMgaW4gdGhlIGFjY2Vzc1xuLy8gbG9ncyBjYW4gYmUgY3JlZGl0ZWQgdG8gdGhlIGNvcHkgdGhhdCBzZW50IHRoZW0uIFRoZSB0ZXJtLXN0dWRlbnRzIGFwcGVhbFxuLy8gbmVlZHMgYSBsaXZlIGNvdW50IGZyb20gdGhlIGJvb2sgc2VydmVyOyBgYGhlYWRsaW5lYGAgaXMgYSBmdW5jdGlvbiBvZiBpdC5cbmV4cG9ydCBjb25zdCBCQU5ORVJfQ09QWSA9IFtcbiAgICB7XG4gICAgICAgIGFkOiAzLFxuICAgICAgICBoZWFkbGluZTogXCJUaGlzIGJvb2sgaXMgZnJlZSwgYW5kIHdlIHdhbnQgdG8ga2VlcCBpdCB0aGF0IHdheS5cIixcbiAgICAgICAgYm9keTogXCJSdW5lc3RvbmUgQWNhZGVteSBpcyBhIDUwMShjKSgzKSBub25wcm9maXQgc3VwcG9ydGVkIGJ5IHJlYWRlcnMgbGlrZSB5b3UuIElmIHRoaXMgYm9vayBpcyBoZWxwaW5nIHlvdSwgYSAkMTAgZ2lmdCBrZWVwcyBpdCBmcmVlIGZvciB0aGUgbmV4dCBzdHVkZW50LlwiLFxuICAgICAgICBidXR0b246IFwiRG9uYXRlICQxMFwiLFxuICAgIH0sXG4gICAge1xuICAgICAgICBhZDogNCxcbiAgICAgICAgbmVlZHNUZXJtU3R1ZGVudHM6IHRydWUsXG4gICAgICAgIGhlYWRsaW5lOiAoeyBjb3VudCwgc2luY2UgfSkgPT5cbiAgICAgICAgICAgIGAke2Rlc2NyaWJlU3R1ZGVudENvdW50KGNvdW50KX0gc3R1ZGVudHMgaGF2ZSBzdGFydGVkIHVzaW5nIFJ1bmVzdG9uZSBib29rcyBzaW5jZSAke3NpbmNlfS5gLFxuICAgICAgICBib2R5OiBcIldlIGRvbid0IGNoYXJnZSBmb3IgdGhlbSwgYW5kIHdlIG5ldmVyIHdpbGwuIElmIFJ1bmVzdG9uZSBpcyBoZWxwaW5nIHlvdSwgYSB0YXgtZGVkdWN0aWJsZSBnaWZ0IGhlbHBzIGtlZXAgaXQgdGhhdCB3YXkuXCIsXG4gICAgICAgIGJ1dHRvbjogXCJDaGlwIGluXCIsXG4gICAgfSxcbiAgICB7XG4gICAgICAgIGFkOiA1LFxuICAgICAgICBoZWFkbGluZTogXCJGcmVlIHRleHRib29rcyBhcmVuJ3QgZnJlZSB0byBtYWtlLlwiLFxuICAgICAgICBib2R5OiBcIklmIHRoaXMgYm9vayBpcyBoZWxwaW5nIHlvdSwgcGxlYXNlIGNvbnNpZGVyIGEgdGF4LWRlZHVjdGlibGUgJDEwIGdpZnQgdG8gUnVuZXN0b25lIEFjYWRlbXkuIEFueSBhbW91bnQgaGVscHMuXCIsXG4gICAgICAgIGJ1dHRvbjogXCJEb25hdGVcIixcbiAgICB9LFxuXTtcblxuLy8gRWFybHkgaW4gYSB0ZXJtIChhbmQgb24gYSBkZXYgc2VydmVyKSB0aGUgY291bnQgaXMgdG9vIHNtYWxsIHRvIGltcHJlc3MsIHNvXG4vLyB0aGUgYmFubmVyIHVzZXMgb25lIG9mIHRoZSBvdGhlciBhcHBlYWxzIGluc3RlYWQuXG5leHBvcnQgY29uc3QgTUlOX1RFUk1fU1RVREVOVFMgPSAxMDAwO1xuXG4vKipcbiAqIFJvdW5kIGRvd24gdG8gdHdvIHNpZ25pZmljYW50IGZpZ3VyZXMgc28gdGhlIGJhbm5lciByZWFkcyBcIk1vcmUgdGhhblxuICogNDgsMDAwXCIgcmF0aGVyIHRoYW4gYSBzdXNwaWNpb3VzbHkgcHJlY2lzZSA0OCwyMTMsIGFuZCBuZXZlciBvdmVyc3RhdGVzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVzY3JpYmVTdHVkZW50Q291bnQoY291bnQpIHtcbiAgICBjb25zdCBtYWduaXR1ZGUgPSAxMCAqKiBNYXRoLm1heCgwLCBNYXRoLmZsb29yKE1hdGgubG9nMTAoY291bnQpKSAtIDEpO1xuICAgIGNvbnN0IHJvdW5kZWQgPSBNYXRoLmZsb29yKGNvdW50IC8gbWFnbml0dWRlKSAqIG1hZ25pdHVkZTtcbiAgICBjb25zdCBzaG93biA9IHJvdW5kZWQudG9Mb2NhbGVTdHJpbmcoXCJlbi1VU1wiKTtcbiAgICByZXR1cm4gcm91bmRlZCA8IGNvdW50ID8gYE1vcmUgdGhhbiAke3Nob3dufWAgOiBzaG93bjtcbn1cblxuLyoqXG4gKiBGZXRjaCB0aGUgbnVtYmVyIG9mIHN0dWRlbnRzIHdobyBqb2luZWQgc2luY2UgdGhlIHRlcm0gYmVnYW4sIGZvcm1hdHRlZCBmb3JcbiAqIHRoZSBoZWFkbGluZSwgb3IgbnVsbCB3aGVuIGl0IGlzIHVuYXZhaWxhYmxlIG9yIHRvbyBzbWFsbCB0byB1c2UuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmZXRjaFRlcm1TdHVkZW50cygpIHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFxuICAgICAgICAgICAgYCR7ZUJvb2tDb25maWcubmV3X3NlcnZlcl9wcmVmaXh9L2Jvb2tzL3Rlcm1fc3R1ZGVudHNgLFxuICAgICAgICApO1xuICAgICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB7IGNvdW50LCBzaW5jZSB9ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICBpZiAoIShjb3VudCA+PSBNSU5fVEVSTV9TVFVERU5UUykgfHwgIXNpbmNlKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICAvLyBgYHNpbmNlYGAgaXMgYSBiYXJlIGRhdGU7IGZvcm1hdCBpdCBpbiBVVEMgc28gYSByZWFkZXIgd2VzdCBvZlxuICAgICAgICAvLyBHcmVlbndpY2ggZG9lcyBub3Qgc2VlIFwiSnVseSAzMVwiIGZvciBBdWd1c3QgMS5cbiAgICAgICAgY29uc3Qgc2luY2VUZXh0ID0gbmV3IERhdGUoYCR7c2luY2V9VDAwOjAwOjAwWmApLnRvTG9jYWxlRGF0ZVN0cmluZyhcbiAgICAgICAgICAgIFwiZW4tVVNcIixcbiAgICAgICAgICAgIHsgbW9udGg6IFwibG9uZ1wiLCBkYXk6IFwibnVtZXJpY1wiLCB0aW1lWm9uZTogXCJVVENcIiB9LFxuICAgICAgICApO1xuICAgICAgICByZXR1cm4geyBjb3VudCwgc2luY2U6IHNpbmNlVGV4dCB9O1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIkZhaWxlZCB0byBmZXRjaCB0ZXJtIHN0dWRlbnRzOlwiLCBlKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxufVxuXG4vKipcbiAqIFJlc29sdmUgYGBCQU5ORVJfQ09QWVtpbmRleF1gYCB0byBwbGFpbiBzdHJpbmdzLiBJZiB0aGUgdGVybS1zdHVkZW50cyBhcHBlYWxcbiAqIGNhbm5vdCBnZXQgaXRzIGNvdW50LCBmYWxsIGJhY2sgdG8gdGhlIG5leHQgYXBwZWFsIHRoYXQgbmVlZHMgbm90aGluZy5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlc29sdmVCYW5uZXJDb3B5KGluZGV4KSB7XG4gICAgY29uc3QgY29weSA9IEJBTk5FUl9DT1BZW2luZGV4XTtcbiAgICBpZiAoIWNvcHkubmVlZHNUZXJtU3R1ZGVudHMpIHtcbiAgICAgICAgcmV0dXJuIGNvcHk7XG4gICAgfVxuICAgIGNvbnN0IHN0YXRzID0gYXdhaXQgZmV0Y2hUZXJtU3R1ZGVudHMoKTtcbiAgICBpZiAoc3RhdHMpIHtcbiAgICAgICAgcmV0dXJuIHsgLi4uY29weSwgaGVhZGxpbmU6IGNvcHkuaGVhZGxpbmUoc3RhdHMpIH07XG4gICAgfVxuICAgIHJldHVybiBCQU5ORVJfQ09QWVsoaW5kZXggKyAxKSAlIEJBTk5FUl9DT1BZLmxlbmd0aF07XG59XG5cbi8vIFdoZW4gYSByZWFkZXIgY2xvc2VzIHRoZSBQcmVUZVh0IHRvcC1vZi1wYWdlIGJhbm5lciB3ZSBsZWF2ZSB0aGVtIGFsb25lIGZvclxuLy8gdHdvIGRheXMsIG9uIGV2ZXJ5IGJvb2ssIGJ5IHJlbWVtYmVyaW5nIHdoZW4gdGhleSBkaWQgaXQuXG5leHBvcnQgY29uc3QgQURfRElTTUlTU0VEX0tFWSA9IFwicnNfYWRfZGlzbWlzc2VkX2F0XCI7XG5leHBvcnQgY29uc3QgQURfRElTTUlTU19NUyA9IDQ4ICogNjAgKiA2MCAqIDEwMDA7XG5cbmV4cG9ydCBmdW5jdGlvbiBhZFJlY2VudGx5RGlzbWlzc2VkKG5vdyA9IERhdGUubm93KCkpIHtcbiAgICBsZXQgZGlzbWlzc2VkQXQ7XG4gICAgdHJ5IHtcbiAgICAgICAgZGlzbWlzc2VkQXQgPSBOdW1iZXIobG9jYWxTdG9yYWdlLmdldEl0ZW0oQURfRElTTUlTU0VEX0tFWSkpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICAvLyBBIHRpbWVzdGFtcCBmcm9tIHRoZSBmdXR1cmUgKHRoZSBjbG9jayB3YXMgbW92ZWQgYmFjaykgbXVzdCBub3RcbiAgICAvLyBzaWxlbmNlIHRoZSBiYW5uZXIgZm9yIGhvd2V2ZXIgbG9uZyB0aGF0IGdhcCBpcy5cbiAgICByZXR1cm4gKFxuICAgICAgICBkaXNtaXNzZWRBdCA+IDAgJiZcbiAgICAgICAgZGlzbWlzc2VkQXQgPD0gbm93ICYmXG4gICAgICAgIG5vdyAtIGRpc21pc3NlZEF0IDwgQURfRElTTUlTU19NU1xuICAgICk7XG59XG5cbi8vIEV2ZW4gdW5kaXNtaXNzZWQsIHRoZSBiYW5uZXIgYXBwZWFycyBvbmx5IG9uIHRoZSBmaXJzdCBwYWdlIG9mIGEgdmlzaXQsIG5vdFxuLy8gb24gZXZlcnkgcGFnZSBhIHN0dWRlbnQgbG9hZHMgd2hpbGUgd29ya2luZyB0aHJvdWdoIGEgY2hhcHRlci4gQSB2aXNpdCBlbmRzXG4vLyBhZnRlciAzMCBtaW51dGVzIHdpdGhvdXQgYSBwYWdlIHZpZXcgKHRoZSB1c3VhbCBhbmFseXRpY3MgZGVmaW5pdGlvbik7IHRoZVxuLy8gY2xvY2sgbGl2ZXMgaW4gbG9jYWxTdG9yYWdlIHJhdGhlciB0aGFuIHNlc3Npb25TdG9yYWdlIHNvIHRoYXQgb3BlbmluZyBhXG4vLyBjaGFwdGVyIGluIGEgbmV3IHRhYiBkb2VzIG5vdCBjb3VudCBhcyBhIG5ldyB2aXNpdC5cbmV4cG9ydCBjb25zdCBBRF9MQVNUX1BBR0VWSUVXX0tFWSA9IFwicnNfYWRfbGFzdF9wYWdldmlld1wiO1xuZXhwb3J0IGNvbnN0IEFEX1ZJU0lUX0dBUF9NUyA9IDMwICogNjAgKiAxMDAwO1xuXG4vKipcbiAqIFJlY29yZCB0aGlzIHBhZ2UgdmlldyBhbmQgcmVwb3J0IHdoZXRoZXIgaXQgY29udGludWVzIGEgdmlzaXQgYWxyZWFkeSB1bmRlclxuICogd2F5LiBFdmVyeSBwYWdlIHZpZXcgZXh0ZW5kcyB0aGUgdmlzaXQsIGluY2x1ZGluZyBvbmVzIHdoZXJlIHRoZSBiYW5uZXIgd2FzXG4gKiBoZWxkIGJhY2sgZm9yIGEgZGlzbWlzc2FsLCBzbyBhIGRpc21pc3NhbCB0aGF0IGV4cGlyZXMgbWlkLXZpc2l0IHdhaXRzIGZvclxuICogdGhlIG5leHQgdmlzaXQgaW5zdGVhZCBvZiBwb3BwaW5nIHVwIGJldHdlZW4gcGFnZXMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhZFZpc2l0SW5Qcm9ncmVzcyhub3cgPSBEYXRlLm5vdygpKSB7XG4gICAgbGV0IGxhc3RQYWdldmlldztcbiAgICB0cnkge1xuICAgICAgICBsYXN0UGFnZXZpZXcgPSBOdW1iZXIobG9jYWxTdG9yYWdlLmdldEl0ZW0oQURfTEFTVF9QQUdFVklFV19LRVkpKTtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oQURfTEFTVF9QQUdFVklFV19LRVksIFN0cmluZyhub3cpKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIChcbiAgICAgICAgbGFzdFBhZ2V2aWV3ID4gMCAmJlxuICAgICAgICBsYXN0UGFnZXZpZXcgPD0gbm93ICYmXG4gICAgICAgIG5vdyAtIGxhc3RQYWdldmlldyA8IEFEX1ZJU0lUX0dBUF9NU1xuICAgICk7XG59XG5cbmZ1bmN0aW9uIGRpc21pc3NBZChiYW5uZXIpIHtcbiAgICB0cnkge1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShBRF9ESVNNSVNTRURfS0VZLCBTdHJpbmcoRGF0ZS5ub3coKSkpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gU3RvcmFnZSBibG9ja2VkOiB0aGUgYmFubmVyIHN0aWxsIGNsb3NlcywgaXQganVzdCBjb21lcyBiYWNrIG9uXG4gICAgICAgIC8vIHRoZSBuZXh0IHBhZ2UuXG4gICAgfVxuICAgIGJhbm5lci5yZW1vdmUoKTtcbn1cblxuZnVuY3Rpb24gc2hvdWxkU2hvd0FkKCkge1xuICAgIHJldHVybiAoXG4gICAgICAgICh0eXBlb2Ygc2hvd0FkICE9PSBcInVuZGVmaW5lZFwiICYmIHNob3dBZCkgfHxcbiAgICAgICAgZUJvb2tDb25maWcuY291cnNlX2F0dHJzPy5zaG93QWRcbiAgICApO1xufVxuXG4vKipcbiAqIFByZVRlWHQgYm9va3MgZ2V0IGEgZGlzbWlzc2libGUgYmFubmVyIGFjcm9zcyB0aGUgdG9wIG9mIHRoZSBwYWdlLCBhYm92ZSB0aGVcbiAqIG1hc3RoZWFkIGFuZCBuYXZiYXIsIGluc3RlYWQgb2YgYW4gYWQgZHJvcHBlZCBpbnRvIHRoZSBtaWRkbGUgb2YgdGhlXG4gKiByZWFkaW5nLiBBdXRob3JzIG9iamVjdGVkIHRvIHRoZSBpbnRlcnJ1cHRpb24uXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBwbGFjZUFkQmFubmVyKFxuICAgIHRvcE9mUGFnZSxcbiAgICBpbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIEJBTk5FUl9DT1BZLmxlbmd0aCksXG4pIHtcbiAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJycy1hZC1iYW5uZXJcIikpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIC8vIEFsd2F5cyByZWNvcmQgdGhlIHBhZ2UgdmlldywgZXZlbiB3aGVuIGEgZGlzbWlzc2FsIGlzIGhvbGRpbmcgdGhlXG4gICAgLy8gYmFubmVyIGJhY2ssIHNvIHRoZSB2aXNpdCBjbG9jayBzdGF5cyBjdXJyZW50LlxuICAgIGNvbnN0IGNvbnRpbnVpbmdWaXNpdCA9IGFkVmlzaXRJblByb2dyZXNzKCk7XG4gICAgaWYgKGNvbnRpbnVpbmdWaXNpdCB8fCBhZFJlY2VudGx5RGlzbWlzc2VkKCkpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNvbnN0IGNvcHkgPSBhd2FpdCByZXNvbHZlQmFubmVyQ29weShpbmRleCk7XG4gICAgLy8gQW5vdGhlciBjYWxsIG1heSBoYXZlIHBsYWNlZCBhIGJhbm5lciB3aGlsZSB3ZSB3YWl0ZWQgb24gdGhlIGNvdW50LlxuICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJzLWFkLWJhbm5lclwiKSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3QgYmFubmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFzaWRlXCIpO1xuICAgIGJhbm5lci5pZCA9IFwicnMtYWQtYmFubmVyXCI7XG4gICAgYmFubmVyLmNsYXNzTmFtZSA9IFwiYWRiYW5uZXJcIjtcbiAgICBiYW5uZXIuc2V0QXR0cmlidXRlKFwiYXJpYS1sYWJlbFwiLCBcIlN1cHBvcnQgUnVuZXN0b25lIEFjYWRlbXlcIik7XG4gICAgYmFubmVyLmlubmVySFRNTCA9IGBcbiAgICAgICAgPGRpdiBjbGFzcz1cImFkYmFubmVyLXRleHRcIj5cbiAgICAgICAgICAgIDxzdHJvbmc+JHtjb3B5LmhlYWRsaW5lfTwvc3Ryb25nPlxuICAgICAgICAgICAgPHA+JHtjb3B5LmJvZHl9PC9wPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImFkYmFubmVyLWRvbmF0ZVwiPlxuICAgICAgICAgICAgPGEgaHJlZj1cIi9hZG1pbi9hdXRoL2RvbmF0ZT9hZD0ke2NvcHkuYWR9XCI+JHtjb3B5LmJ1dHRvbn08L2E+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImFkYmFubmVyLWNsb3NlXCJcbiAgICAgICAgICAgIGFyaWEtbGFiZWw9XCJEaXNtaXNzIGZvciA0OCBob3Vyc1wiIHRpdGxlPVwiRGlzbWlzcyBmb3IgNDggaG91cnNcIj4mdGltZXM7PC9idXR0b24+YDtcbiAgICBiYW5uZXJcbiAgICAgICAgLnF1ZXJ5U2VsZWN0b3IoXCIuYWRiYW5uZXItY2xvc2VcIilcbiAgICAgICAgLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiBkaXNtaXNzQWQoYmFubmVyKSk7XG4gICAgdG9wT2ZQYWdlLmJlZm9yZShiYW5uZXIpO1xuICAgIHJldHVybiBiYW5uZXI7XG59XG5cbi8vIFNwaGlueCBib29rcyAoYW5kIGFueSBwYWdlIHdpdGhvdXQgYSBQcmVUZVh0IG1hc3RoZWFkIG9yIG5hdmJhcikga2VlcCB0aGVcbi8vIG9sZCBiZWhhdmlvcjogdGhlIGFwcGVhbCBhcHBlYXJzIGFmdGVyIGEgcmFuZG9tbHkgY2hvc2VuIGNvbXBvbmVudC5cbmZ1bmN0aW9uIHBsYWNlSW5saW5lQWQoKSB7XG4gICAgbGV0IGFkTnVtID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogTEVHQUNZX0FEX0NPUFkubGVuZ3RoKSArIDE7XG4gICAgbGV0IGFkVGVtcGxhdGUgPSBMRUdBQ1lfQURfQ09QWS5tYXAoXG4gICAgICAgICh0ZXh0LCBpKSA9PiBgXG4gICAgICAgICA8YXNpZGUgaWQ9XCJhZGNvcHlfJHtpICsgMX1cIiBjbGFzcz1cImFkY29weVwiIHN0eWxlPVwiZGlzcGxheTogbm9uZTtcIj5cbiAgICAgICAgICAgPHN0cm9uZz5CZWZvcmUgeW91IGtlZXAgcmVhZGluZy4uLjwvc3Ryb25nPlxuICAgICAgICAgICA8cD4ke3RleHR9XG4gICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgPGRpdiBjbGFzcz1cImRvbmF0ZSR7XCJhYlwiW2ldfVwiPlxuICAgICAgICAgICA8YSBocmVmPVwiL2FkbWluL2F1dGgvZG9uYXRlP2FkPSR7aSArIDF9XCI+U3VwcG9ydCBSdW5lc3RvbmUgQWNhZGVteSBUb2RheTwvYT5cbiAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICA8L2FzaWRlPmAsXG4gICAgKS5qb2luKFwiXCIpO1xuICAgIGlmICghZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhZGNvcHlfMVwiKSkge1xuICAgICAgICBkb2N1bWVudC5ib2R5Lmluc2VydEFkamFjZW50SFRNTChcImJlZm9yZWVuZFwiLCBhZFRlbXBsYXRlKTtcbiAgICB9XG4gICAgbGV0IGFkQmxvY2sgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgYWRjb3B5XyR7YWROdW19YCk7XG4gICAgbGV0IHJzRWxlbWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnJ1bmVzdG9uZVwiKTtcbiAgICBpZiAocnNFbGVtZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGxldCByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHJzRWxlbWVudHMubGVuZ3RoKTtcbiAgICAgICAgcnNFbGVtZW50c1tyYW5kb21JbmRleF0uYWZ0ZXIoYWRCbG9jayk7XG4gICAgICAgIC8vIGZpbmQgdGhlIGEgdGFnIHdpdGhpbiB0aGUgYWQgYmxvY2sgYW5kIGNoYW5nZSB0aGUgaHJlZiBmcm9tIC9ydW5lc3RvbmUvZGVmYXVsdC9kb25hdGUgdG8gL2FkbWluL2F1dGgvZG9uYXRlXG4gICAgICAgIGNvbnN0IGFUYWcgPSBhZEJsb2NrLnF1ZXJ5U2VsZWN0b3IoXCJhXCIpO1xuICAgICAgICBpZiAoYVRhZyAmJiBhVGFnLmhyZWYuaW5jbHVkZXMoXCIvcnVuZXN0b25lL2RlZmF1bHQvZG9uYXRlXCIpKSB7XG4gICAgICAgICAgICBhVGFnLmhyZWYgPSBhVGFnLmhyZWYucmVwbGFjZShcbiAgICAgICAgICAgICAgICBcIi9ydW5lc3RvbmUvZGVmYXVsdC9kb25hdGVcIixcbiAgICAgICAgICAgICAgICBcIi9hZG1pbi9hdXRoL2RvbmF0ZVwiLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICBhZEJsb2NrLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBwbGFjZUFkQ29weSgpIHtcbiAgICBpZiAoIXNob3VsZFNob3dBZCgpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbGV0IHRvcE9mUGFnZSA9XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHR4LW1hc3RoZWFkXCIpIHx8XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHR4LW5hdmJhclwiKTtcbiAgICBpZiAodG9wT2ZQYWdlKSB7XG4gICAgICAgIHBsYWNlQWRCYW5uZXIodG9wT2ZQYWdlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBwbGFjZUlubGluZUFkKCk7XG4gICAgfVxufVxuXG4vLyBpbml0aWFsaXplIHN0dWZmXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGVCb29rQ29uZmlnKSB7XG4gICAgICAgIGhhbmRsZVBhZ2VTZXR1cCgpO1xuICAgICAgICBwbGFjZUFkQ29weSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0eXBlb2YgZUJvb2tDb25maWcgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgICAgICAgIFwiZUJvb2tDb25maWcgaXMgbm90IGRlZmluZWQuICBUaGlzIHBhZ2UgbXVzdCBub3QgYmUgc2V0IHVwIGZvciBSdW5lc3RvbmVcIixcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG59KTtcblxuLy8gbWlzYyBzdHVmZlxuLy8gdG9kbzogIFRoaXMgY291bGQgYmUgZnVydGhlciBkaXN0cmlidXRlZCBidXQgbWFraW5nIGEgdmlkZW8uanMgZmlsZSBqdXN0IGZvciBvbmUgZnVuY3Rpb24gc2VlbXMgZHVtYi5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgLy8gYWRkIHRoZSB2aWRlbyBwbGF5IGJ1dHRvbiBvdmVybGF5IGltYWdlXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi52aWRlby1wbGF5LW92ZXJsYXlcIikuZm9yRWFjaChmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgZWwuc3R5bGUuYmFja2dyb3VuZEltYWdlID1cbiAgICAgICAgICAgIFwidXJsKCd7e3BhdGh0bygnX3N0YXRpYy9wbGF5X292ZXJsYXlfaWNvbi5wbmcnLCAxKX19JylcIjtcbiAgICB9KTtcblxuICAgIC8vIFRoaXMgZnVuY3Rpb24gaXMgbmVlZGVkIHRvIGFsbG93IHRoZSBkcm9wZG93biBzZWFyY2ggYmFyIHRvIHdvcms7XG4gICAgLy8gVGhlIGRlZmF1bHQgYmVoYXZpb3VyIGlzIHRoYXQgdGhlIGRyb3Bkb3duIG1lbnUgY2xvc2VzIHdoZW4gc29tZXRoaW5nIGluXG4gICAgLy8gaXQgKGxpa2UgdGhlIHNlYXJjaCBiYXIpIGlzIGNsaWNrZWRcbiAgICBkb2N1bWVudFxuICAgICAgICAucXVlcnlTZWxlY3RvckFsbChcIi5kcm9wZG93biBpbnB1dCwgLmRyb3Bkb3duIGxhYmVsXCIpXG4gICAgICAgIC5mb3JFYWNoKGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgIC8vIHJlLXdyaXRlIHNvbWUgdXJsc1xuICAgIC8vIFRoaXMgaXMgdHJpY2tlciB0aGFuIGl0IGxvb2tzIGFuZCB5b3UgaGF2ZSB0byBvYmV5IHRoZSBydWxlcyBmb3IgIyBhbmNob3JzXG4gICAgLy8gVGhlICNhbmNob3JzIG11c3QgY29tZSBhZnRlciB0aGUgcXVlcnkgc3RyaW5nIGFzIHRoZSBzZXJ2ZXIgYmFzaWNhbGx5IGlnbm9yZXMgYW55IHBhcnRcbiAgICAvLyBvZiBhIHVybCB0aGF0IGNvbWVzIGFmdGVyICMgLSBsaWtlIGEgY29tbWVudC4uLlxuICAgIGlmIChsb2NhdGlvbi5ocmVmLmluY2x1ZGVzKFwibW9kZT1icm93c2luZ1wiKSkge1xuICAgICAgICBsZXQgcXVlcnlTdHJpbmcgPSBcIj9tb2RlPWJyb3dzaW5nXCI7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJhXCIpLmZvckVhY2goKGxpbmspID0+IHtcbiAgICAgICAgICAgIGxldCBhbmNob3JUZXh0ID0gXCJcIjtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBsaW5rLmhyZWYuaW5jbHVkZXMoXCJib29rcy9wdWJsaXNoZWRcIikgJiZcbiAgICAgICAgICAgICAgICAhbGluay5ocmVmLmluY2x1ZGVzKFwiP21vZGU9YnJvd3NpbmdcIilcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIGlmIChsaW5rLmhyZWYuaW5jbHVkZXMoXCIjXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBhUG9pbnQgPSBsaW5rLmhyZWYuaW5kZXhPZihcIiNcIik7XG4gICAgICAgICAgICAgICAgICAgIGFuY2hvclRleHQgPSBsaW5rLmhyZWYuc3Vic3RyaW5nKGFQb2ludCk7XG4gICAgICAgICAgICAgICAgICAgIGxpbmsuaHJlZiA9IGxpbmsuaHJlZi5zdWJzdHJpbmcoMCwgYVBvaW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbGluay5ocmVmID0gbGluay5ocmVmLmluY2x1ZGVzKFwiP1wiKVxuICAgICAgICAgICAgICAgICAgICA/IGxpbmsuaHJlZiArIHF1ZXJ5U3RyaW5nLnJlcGxhY2UoXCI/XCIsIFwiJlwiKSArIGFuY2hvclRleHRcbiAgICAgICAgICAgICAgICAgICAgOiBsaW5rLmhyZWYgKyBxdWVyeVN0cmluZyArIGFuY2hvclRleHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn0pO1xuXG4vLyBUaGUgQnVzdCBNZW51XG4vKlxuQ291cnNlIEhvbWVcbkFzc2lnbm1lbnRzXG5Qcm9ncmVzc1xuUGVlciBJbnN0cnVjdGlvbiAoU3R1ZGVudClcbi0tLS0tLVxuSW5zdHJ1Y3RvciBEYXNoYm9hcmRcblBlZXIgSW5zdHJ1Y3Rpb24gKEluc3RydWN0b3IpXG5BdXRob3IgSW50ZXJmYWNlIChvcHRpb25hbClcbkVkaXRvciBJbnRlcmZhY2UgKG9wdGlvbmFsKVxuUmVxdWVzdCBJbnZvaWNlXG4tLS0tLS1cbkNoYW5nZSBDb3Vyc2VcblByb2ZpbGVcbkxvZyBPdXRcbiovXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgY29uc3Qgb2xkRHJvcERvd24gPSB0aGlzLmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIFwiLmRyb3Bkb3duLWNvbnRlbnRbZGF0YS1kZXByZWNhdGVkXVwiLFxuICAgICk7XG4gICAgaWYgKG9sZERyb3BEb3duKSBvbGREcm9wRG93bi5yZW1vdmUoKTtcblxuICAgIGNvbnN0IGl0ZW1UZW1wbGF0ZSA9IHRoaXMuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG4gICAgICAgIFwicHR4LXVzZXItZHJvcGRvd24tY29udGVudF9pdGVtLXRlbXBsYXRlXCIsXG4gICAgKTtcbiAgICBjb25zdCBzZXBUZW1wbGF0ZSA9IHRoaXMuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG4gICAgICAgIFwicHR4LXVzZXItZHJvcGRvd24tY29udGVudF9zZXBhcmF0b3ItdGVtcGxhdGVcIixcbiAgICApO1xuICAgIGNvbnN0IG1lbnVDb250ZW50QXJlYSA9IHRoaXMuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG4gICAgICAgIFwicHR4LXVzZXItZHJvcGRvd25fcnMtY29udGVudFwiLFxuICAgICk7XG5cbiAgICBpZiAoIWl0ZW1UZW1wbGF0ZSB8fCAhc2VwVGVtcGxhdGUgfHwgIW1lbnVDb250ZW50QXJlYSkge1xuICAgICAgICBjb25zb2xlLndhcm4oXCJNaXNzaW5nIHRlbXBsYXRlIG9yIGNvbnRlbnQgYXJlYSBmb3IgdXNlciBkcm9wZG93blwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1ha2VMaW5rKHVybCwgdGl0bGUsIGljb24gPSBudWxsLCBhcmlhTGFiZWwgPSBudWxsKSB7XG4gICAgICAgIC8vIEFsbCB3ZSBzaG91bGQgYXNzdW1lIGFib3V0IHRoZSBpdGVtIHRlbXBsYXRlIGlzIHRoYXQgaXQgaGFzIGFuIGFuY2hvciBlbGVtZW50XG4gICAgICAgIGNvbnN0IGxpbmsgPSBpdGVtVGVtcGxhdGUuY29udGVudC5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICAgIGNvbnN0IGxpbmtBbmNob3IgPSBsaW5rLnF1ZXJ5U2VsZWN0b3IoXCJhXCIpO1xuICAgICAgICBpZiAodXJsKSB7XG4gICAgICAgICAgICBsaW5rQW5jaG9yLmhyZWYgPSB1cmw7XG4gICAgICAgIH1cbiAgICAgICAgbGlua0FuY2hvci5pbm5lclRleHQgPSBcIlwiO1xuICAgICAgICBjb25zdCBjb250ZW50U3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgICAgICBjb250ZW50U3Bhbi5zdHlsZS5kaXNwbGF5ID0gXCJpbmxpbmUtZmxleFwiO1xuICAgICAgICBjb250ZW50U3Bhbi5zdHlsZS5hbGlnbkl0ZW1zID0gXCJjZW50ZXJcIjtcbiAgICAgICAgY29udGVudFNwYW4uc3R5bGUuZ2FwID0gXCIwLjM1cmVtXCI7XG4gICAgICAgIGNvbnN0IGljb25FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgICAgIGljb25FbGVtZW50LnNldEF0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIsIFwidHJ1ZVwiKTtcbiAgICAgICAgaWNvbkVsZW1lbnQuY2xhc3NOYW1lID0gXCJtYXRlcmlhbC1zeW1ib2xzLW91dGxpbmVkXCI7XG4gICAgICAgIGljb25FbGVtZW50LnN0eWxlLmRpc3BsYXkgPSBcImlubGluZS1mbGV4XCI7XG4gICAgICAgIGljb25FbGVtZW50LnN0eWxlLmFsaWduSXRlbXMgPSBcImNlbnRlclwiO1xuICAgICAgICBpY29uRWxlbWVudC5zdHlsZS5qdXN0aWZ5Q29udGVudCA9IFwiY2VudGVyXCI7XG4gICAgICAgIGljb25FbGVtZW50LnN0eWxlLndpZHRoID0gXCIxLjI1ZW1cIjtcbiAgICAgICAgaWNvbkVsZW1lbnQuc3R5bGUubWluV2lkdGggPSBcIjEuMjVlbVwiO1xuICAgICAgICBpZiAoaWNvbikge1xuICAgICAgICAgICAgaWNvbkVsZW1lbnQuaW5uZXJUZXh0ID0gaWNvbjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGljb25FbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuICAgICAgICAgICAgaWNvbkVsZW1lbnQuaW5uZXJUZXh0ID0gXCJob21lXCI7XG4gICAgICAgIH1cbiAgICAgICAgY29udGVudFNwYW4uYXBwZW5kQ2hpbGQoaWNvbkVsZW1lbnQpO1xuICAgICAgICBsZXQgbGlua1RpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgICAgIGxpbmtUaXRsZS5pbm5lclRleHQgPSB0aXRsZTtcbiAgICAgICAgY29udGVudFNwYW4uYXBwZW5kQ2hpbGQobGlua1RpdGxlKTtcbiAgICAgICAgbGlua0FuY2hvci5hcHBlbmRDaGlsZChjb250ZW50U3Bhbik7XG4gICAgICAgIGlmIChhcmlhTGFiZWwpIHtcbiAgICAgICAgICAgIGxpbmtBbmNob3IuYXJpYUxhYmVsID0gYXJpYUxhYmVsO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdXJsKSB7XG4gICAgICAgICAgICBjb25zdCBpbmZvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgICAgICAgICBpbmZvLmNsYXNzTmFtZSA9IGxpbmtBbmNob3IuY2xhc3NOYW1lO1xuICAgICAgICAgICAgaWYgKHRpdGxlLmxlbmd0aCA+IDMwKSB7XG4gICAgICAgICAgICAgICAgaW5mby5pbm5lclRleHQgPSB0aXRsZS5zbGljZSgwLCAxMikgKyBcIi4uLlwiICsgdGl0bGUuc2xpY2UoLTE1KTtcbiAgICAgICAgICAgICAgICAvLyBhZGQgaG92ZXIgdG8gc2hvdyBmdWxsIHRpdGxlXG4gICAgICAgICAgICAgICAgaW5mby50aXRsZSA9IHRpdGxlO1xuICAgICAgICAgICAgICAgIGluZm8uc3R5bGUuY3Vyc29yID0gXCJoZWxwXCI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGluZm8uaW5uZXJUZXh0ID0gdGl0bGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpbmZvLnN0eWxlLmRpc3BsYXkgPSBcImZsZXhcIjtcbiAgICAgICAgICAgIGluZm8uc3R5bGUuanVzdGlmeUNvbnRlbnQgPSBcImNlbnRlclwiO1xuICAgICAgICAgICAgaW5mby5zdHlsZS5hbGlnbkl0ZW1zID0gXCJjZW50ZXJcIjtcbiAgICAgICAgICAgIGxpbmtBbmNob3IucmVwbGFjZVdpdGgoaW5mbyk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gcmV0dXJuIGVudGlyZSBpdGVtIHRlbXBsYXRlLCBub3QganVzdCBsaW5rXG4gICAgICAgIHJldHVybiBsaW5rO1xuICAgIH1cbiAgICAvLyBsaW1pdCBsZW5ndGggb2YgZUJvb2tDb25maWcuY291cnNlIHRvIDMwIGNoYXJhY3RlcnMgdG8gcHJldmVudCBvdmVybHkgbG9uZyBjb3Vyc2UgbmFtZXMgaW4gdGhlIG1lbnUgYnV0IHByZXNlcnZlIHRoZSBsYXN0IDE1IGNoYXJhY3RlcnNcbiAgICBtZW51Q29udGVudEFyZWEuYXBwZW5kQ2hpbGQobWFrZUxpbmsobnVsbCwgZUJvb2tDb25maWcuY291cnNlKSk7XG4gICAgbWVudUNvbnRlbnRBcmVhLmFwcGVuZENoaWxkKHNlcFRlbXBsYXRlLmNvbnRlbnQuY2xvbmVOb2RlKHRydWUpKTtcblxuICAgIG1lbnVDb250ZW50QXJlYS5hcHBlbmRDaGlsZChcbiAgICAgICAgbWFrZUxpbmsoXCIvbnMvY291cnNlL2luZGV4XCIsIFwiQ291cnNlIEhvbWVcIiwgXCJob21lXCIpLFxuICAgICk7XG4gICAgbWVudUNvbnRlbnRBcmVhLmFwcGVuZENoaWxkKFxuICAgICAgICBtYWtlTGluayhcIi9hc3NpZ25tZW50L3N0dWRlbnQvY2hvb3NlQXNzaWdubWVudFwiLCBcIkFzc2lnbm1lbnRzXCIsIFwiZWRpdFwiKSxcbiAgICApO1xuICAgIG1lbnVDb250ZW50QXJlYS5hcHBlbmRDaGlsZChcbiAgICAgICAgbWFrZUxpbmsoXG4gICAgICAgICAgICBcIi9hc3NpZ25tZW50L3BlZXIvc3R1ZGVudFwiLFxuICAgICAgICAgICAgXCJQZWVyIEluc3RydWN0aW9uIChTdHVkZW50KVwiLFxuICAgICAgICAgICAgXCJncm91cHNfM1wiLFxuICAgICAgICApLFxuICAgICk7XG4gICAgbWVudUNvbnRlbnRBcmVhLmFwcGVuZENoaWxkKFxuICAgICAgICBtYWtlTGluayhcIi9hc3NpZ25tZW50L3N0dWRlbnQvc3R1ZGVudHJlcG9ydFwiLCBcIlByb2dyZXNzXCIpLFxuICAgICk7XG4gICAgaWYgKGVCb29rQ29uZmlnLmlzSW5zdHJ1Y3Rvcikge1xuICAgICAgICBtZW51Q29udGVudEFyZWEuYXBwZW5kQ2hpbGQoc2VwVGVtcGxhdGUuY29udGVudC5jbG9uZU5vZGUodHJ1ZSkpO1xuICAgICAgICBtZW51Q29udGVudEFyZWEuYXBwZW5kQ2hpbGQoXG4gICAgICAgICAgICBtYWtlTGluayhcbiAgICAgICAgICAgICAgICBcIi9hZG1pbi9pbnN0cnVjdG9yL21lbnVcIixcbiAgICAgICAgICAgICAgICBcIkluc3RydWN0b3IgRGFzaGJvYXJkXCIsXG4gICAgICAgICAgICAgICAgXCJzZXR0aW5nc1wiLFxuICAgICAgICAgICAgKSxcbiAgICAgICAgKTtcbiAgICAgICAgbWVudUNvbnRlbnRBcmVhLmFwcGVuZENoaWxkKFxuICAgICAgICAgICAgbWFrZUxpbmsoXG4gICAgICAgICAgICAgICAgXCIvYXNzaWdubWVudC9wZWVyL2luc3RydWN0b3JcIixcbiAgICAgICAgICAgICAgICBcIlBlZXIgSW5zdHJ1Y3Rpb24gKEluc3RydWN0b3IpXCIsXG4gICAgICAgICAgICAgICAgXCJncm91cHNfM1wiLFxuICAgICAgICAgICAgKSxcbiAgICAgICAgKTtcbiAgICAgICAgLy8gT24gcnVuZXN0b25lLmFjYWRlbXkgdGhlIGF1dGhvciBzZXJ2ZXIgaXMgaXRzIG93biBob3N0LCBzbyB0aGlzIGhhcyB0b1xuICAgICAgICAvLyBiZSBhYnNvbHV0ZS4gU2luZ2xlLXByb3h5IGRlcGxveW1lbnRzIHNldCBhdXRob3JTZXJ2ZXJVcmwgdG8gL2F1dGhvci5cbiAgICAgICAgbGV0IGF1dGhvclVybCA9XG4gICAgICAgICAgICAoZUJvb2tDb25maWcuYXV0aG9yU2VydmVyVXJsIHx8XG4gICAgICAgICAgICAgICAgXCJodHRwczovL2F1dGhvci5ydW5lc3RvbmUuYWNhZGVteS9hdXRob3JcIikgKyBcIi9cIjtcbiAgICAgICAgbGV0IGVkaXRvclVybCA9XG4gICAgICAgICAgICBlQm9va0NvbmZpZy5lZGl0b3JTZXJ2ZXJVcmwgfHwgXCIvYWRtaW4vZWRpdG9yL21hbmFnZV9leGVyY2lzZXNcIjtcblxuICAgICAgICBpZiAoZUJvb2tDb25maWcuaXNBdXRob3IpIHtcbiAgICAgICAgICAgIG1lbnVDb250ZW50QXJlYS5hcHBlbmRDaGlsZChcbiAgICAgICAgICAgICAgICBtYWtlTGluayhhdXRob3JVcmwsIFwiQXV0aG9yIERhc2hib2FyZFwiKSxcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVCb29rQ29uZmlnLmlzRWRpdG9yKSB7XG4gICAgICAgICAgICBtZW51Q29udGVudEFyZWEuYXBwZW5kQ2hpbGQoXG4gICAgICAgICAgICAgICAgbWFrZUxpbmsoZWRpdG9yVXJsLCBcIkVkaXRvciBEYXNoYm9hcmRcIiksXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIG1lbnVDb250ZW50QXJlYS5hcHBlbmRDaGlsZChcbiAgICAgICAgICAgIG1ha2VMaW5rKFxuICAgICAgICAgICAgICAgIFwiL2Fzc2lnbm1lbnQvaW5zdHJ1Y3Rvci9pbnZvaWNlX3JlcXVlc3RcIixcbiAgICAgICAgICAgICAgICBcIlJlcXVlc3QgSW52b2ljZVwiLFxuICAgICAgICAgICAgKSxcbiAgICAgICAgKTtcbiAgICB9XG4gICAgbWVudUNvbnRlbnRBcmVhLmFwcGVuZENoaWxkKHNlcFRlbXBsYXRlLmNvbnRlbnQuY2xvbmVOb2RlKHRydWUpKTtcbiAgICBtZW51Q29udGVudEFyZWEuYXBwZW5kQ2hpbGQoXG4gICAgICAgIG1ha2VMaW5rKFwiL2FkbWluL2F1dGgvbXlfY291cnNlc1wiLCBcIkNoYW5nZSBDb3Vyc2VcIiwgXCJuZXdzc3RhbmRcIiksXG4gICAgKTtcbiAgICBtZW51Q29udGVudEFyZWEuYXBwZW5kQ2hpbGQobWFrZUxpbmsoXCIvYWRtaW4vYXV0aC9wcm9maWxlXCIsIFwiUHJvZmlsZVwiKSk7XG4gICAgbWVudUNvbnRlbnRBcmVhLmFwcGVuZENoaWxkKG1ha2VMaW5rKFwiL2FkbWluL2F1dGgvbG9nb3V0XCIsIFwiTG9nIE91dFwiKSk7XG4gICAgbWVudUNvbnRlbnRBcmVhLmFwcGVuZENoaWxkKHNlcFRlbXBsYXRlLmNvbnRlbnQuY2xvbmVOb2RlKHRydWUpKTtcbiAgICBjb25zdCBwcm9ibGVtUmVwb3J0TGluayA9IG1ha2VMaW5rKFxuICAgICAgICBcIi9hZG1pbi9wcm9ibGVtL3JlcG9ydFwiLFxuICAgICAgICBcIlByb2JsZW0gUmVwb3J0XCIsXG4gICAgICAgIFwiYnVnX3JlcG9ydFwiLFxuICAgICk7XG4gICAgLy8gVGhlIGxvZyBpcyBhbHJlYWR5IHBlcnNpc3RlZCBjb250aW51b3VzbHk7IGZsdXNoIG5vdyBzbyBub3RoaW5nIGluIHRoZVxuICAgIC8vIGRlYm91bmNlIHdpbmRvdyBpcyBsb3N0LlxuICAgIGNvbnN0IHByb2JsZW1SZXBvcnRBbmNob3IgPSBwcm9ibGVtUmVwb3J0TGluay5xdWVyeVNlbGVjdG9yKFwiYVwiKTtcbiAgICBpZiAocHJvYmxlbVJlcG9ydEFuY2hvcikge1xuICAgICAgICBwcm9ibGVtUmVwb3J0QW5jaG9yLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCByc1BlcnNpc3RDb25zb2xlTG9nKTtcbiAgICB9XG4gICAgbWVudUNvbnRlbnRBcmVhLmFwcGVuZENoaWxkKHByb2JsZW1SZXBvcnRMaW5rKTtcbn0pO1xuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgc3RyaW5nIGFwcGVhcnMgdG8gY29udGFpbiBMYVRlWCBtYXRoLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbG9va3NMaWtlTGF0ZXhNYXRoKHRleHQpIHtcbiAgICBpZiAodHlwZW9mIHRleHQgIT09IFwic3RyaW5nXCIpIHJldHVybiBmYWxzZTtcblxuICAgIC8vIENvbW1vbiBMYVRlWCBtYXRoIGRlbGltaXRlcnNcbiAgICBjb25zdCBtYXRoRGVsaW1pdGVycyA9IFtcbiAgICAgICAgL1xcJFxcJFtcXHNcXFNdKz9cXCRcXCQvLCAvLyAkJCAuLi4gJCRcbiAgICAgICAgL1xcJFteJFxcbl0rP1xcJC8sIC8vICQgLi4uICRcbiAgICAgICAgL1xcXFxcXFtbXFxzXFxTXSs/XFxcXFxcXS8sIC8vIFxcWyAuLi4gXFxdXG4gICAgICAgIC9cXFxcXFwoW1xcc1xcU10rP1xcXFxcXCkvLCAvLyBcXCggLi4uIFxcKVxuICAgIF07XG5cbiAgICAvLyBDb21tb24gbWF0aCBjb21tYW5kcyAoYXZvaWQgZ2VuZXJpYyBcXHRleHQgb3IgXFxyZWYtb25seSBjYXNlcylcbiAgICBjb25zdCBtYXRoQ29tbWFuZHMgPVxuICAgICAgICAvXFxcXChmcmFjfHNxcnR8c3VtfHByb2R8aW50fGxpbXxzaW58Y29zfHRhbnxsb2d8bG58YWxwaGF8YmV0YXxnYW1tYXxwaXx0aGV0YXxzaWdtYXxEZWx0YXxjZG90fHRpbWVzfGxlcXxnZXF8bmVxKVxcYi87XG5cbiAgICAvLyBTdXBlcnNjcmlwdHMvc3Vic2NyaXB0cyBsaWtlIHheMiBvciBhX2lcbiAgICBjb25zdCBzdXBlclN1YlNjcmlwdCA9IC9bYS16QS1aMC05XVxccypbXFxeX11cXHMqXFx7Py4rP1xcfT8vO1xuXG4gICAgcmV0dXJuIChcbiAgICAgICAgbWF0aERlbGltaXRlcnMuc29tZSgocmUpID0+IHJlLnRlc3QodGV4dCkpIHx8XG4gICAgICAgIG1hdGhDb21tYW5kcy50ZXN0KHRleHQpIHx8XG4gICAgICAgIHN1cGVyU3ViU2NyaXB0LnRlc3QodGV4dClcbiAgICApO1xufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIGdldFN3aXRjaCgpIHtcbiAgICBjb25zdCB0b2dnbGVTd2l0Y2ggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICAnLnRoZW1lLXN3aXRjaCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nLFxuICAgICk7XG4gICAgY29uc3QgY3VycmVudFRoZW1lID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJ0aGVtZVwiKVxuICAgICAgICA/IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwidGhlbWVcIilcbiAgICAgICAgOiBudWxsO1xuXG4gICAgaWYgKGN1cnJlbnRUaGVtZSkge1xuICAgICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2V0QXR0cmlidXRlKFwiZGF0YS10aGVtZVwiLCBjdXJyZW50VGhlbWUpO1xuXG4gICAgICAgIGlmIChjdXJyZW50VGhlbWUgPT09IFwiZGFya1wiKSB7XG4gICAgICAgICAgICB0b2dnbGVTd2l0Y2guY2hlY2tlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzd2l0Y2hUaGVtZSgpIHtcbiAgICB2YXIgY2hlY2tCb3ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNoZWNrYm94XCIpO1xuICAgIGlmIChjaGVja0JveC5jaGVja2VkID09IHRydWUpIHtcbiAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNldEF0dHJpYnV0ZShcImRhdGEtdGhlbWVcIiwgXCJkYXJrXCIpO1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInRoZW1lXCIsIFwiZGFya1wiKTsgLy9hZGQgdGhpc1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJkYXRhLXRoZW1lXCIsIFwibGlnaHRcIik7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwidGhlbWVcIiwgXCJsaWdodFwiKTsgLy9hZGQgdGhpc1xuICAgIH1cbn1cbiIsImltcG9ydCB7IHJ1bmVzdG9uZV9pbXBvcnQgfSBmcm9tIFwiLi4vLi4vLi4vd2VicGFjay5pbmRleC5qc1wiO1xuaW1wb3J0IHsgZ2V0RGF0YVZhbHVlIH0gZnJvbSBcIi4vZG9tdXRpbC5qc1wiO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVuZGVyUnVuZXN0b25lQ29tcG9uZW50KFxuICAgIGNvbXBvbmVudFNyYyxcbiAgICB3aGVyZURpdixcbiAgICBtb3JlT3B0cyxcbikge1xuICAgIC8qKlxuICAgICAqICBUaGUgZWFzeSBwYXJ0IGlzIGFkZGluZyB0aGUgY29tcG9uZW50U3JjIHRvIHRoZSBleGlzdGluZyBkaXYuXG4gICAgICogIFRoZSB0ZWRpb3VzIHBhcnQgaXMgY2FsbGluZyB0aGUgcmlnaHQgZnVuY3Rpb25zIHRvIHR1cm4gdGhlXG4gICAgICogIHNvdXJjZSBpbnRvIHRoZSBhY3R1YWwgY29tcG9uZW50LlxuICAgICAqL1xuICAgIGxldCB0YXJnZXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh3aGVyZURpdik7XG4gICAgaWYgKCF0YXJnZXQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIWNvbXBvbmVudFNyYykge1xuICAgICAgICB0YXJnZXQuaW5uZXJIVE1MID0gYDxwPlNvcnJ5LCBubyBzb3VyY2UgaXMgYXZhaWxhYmxlIGZvciBwcmV2aWV3LjwvcD5gO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGxldCBwYXR0ID0gLy4uXFwvX2ltYWdlcy9nO1xuICAgIGNvbXBvbmVudFNyYyA9IGNvbXBvbmVudFNyYy5yZXBsYWNlKFxuICAgICAgICBwYXR0LFxuICAgICAgICBgJHtlQm9va0NvbmZpZy5hcHB9L2Jvb2tzL3B1Ymxpc2hlZC8ke2VCb29rQ29uZmlnLmJhc2Vjb3Vyc2V9L19pbWFnZXNgLFxuICAgICk7XG4gICAgdGFyZ2V0LmlubmVySFRNTCA9IGNvbXBvbmVudFNyYztcblxuICAgIGlmICh0eXBlb2Ygd2luZG93LmNvbXBvbmVudE1hcCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICB3aW5kb3cuY29tcG9uZW50TWFwID0ge307XG4gICAgfVxuXG4gICAgbGV0IGNvbXBvbmVudEVsZW1lbnQgPSB0YXJnZXQucXVlcnlTZWxlY3RvcihcIltkYXRhLWNvbXBvbmVudF1cIik7XG4gICAgbGV0IGNvbXBvbmVudEtpbmQgPSBjb21wb25lbnRFbGVtZW50Py5kYXRhc2V0LmNvbXBvbmVudDtcbiAgICAvLyBJbXBvcnQgdGhlIEphdmFTY3JpcHQgZm9yIHRoaXMgY29tcG9uZW50IGJlZm9yZSBwcm9jZWVkaW5nLlxuICAgIGF3YWl0IHJ1bmVzdG9uZV9pbXBvcnQoY29tcG9uZW50S2luZCk7XG4gICAgbGV0IG9wdCA9IHt9O1xuICAgIG9wdC5vcmlnID0gY29tcG9uZW50RWxlbWVudDtcbiAgICBpZiAob3B0Lm9yaWcpIHtcbiAgICAgICAgb3B0LmxhbmcgPSBnZXREYXRhVmFsdWUob3B0Lm9yaWcsIFwibGFuZ1wiKTtcbiAgICAgICAgb3B0LnVzZVJ1bmVzdG9uZVNlcnZpY2VzID0gdHJ1ZTtcbiAgICAgICAgb3B0LmdyYWRlcmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICBvcHQucHl0aG9uMyA9IHRydWU7XG4gICAgICAgIGlmICh0eXBlb2YgbW9yZU9wdHMgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGtleSBpbiBtb3JlT3B0cykge1xuICAgICAgICAgICAgICAgIG9wdFtrZXldID0gbW9yZU9wdHNba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0eXBlb2YgY29tcG9uZW50X2ZhY3RvcnkgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgYWxlcnQoXCJFcnJvcjogIE1pc3NpbmcgdGhlIGNvbXBvbmVudCBmYWN0b3J5IVwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoIXdpbmRvdy5jb21wb25lbnRfZmFjdG9yeVtjb21wb25lbnRLaW5kXSAmJiAhdGFyZ2V0LmlubmVySFRNTCkge1xuICAgICAgICAgICAgdGFyZ2V0LmlubmVySFRNTCA9IGA8cD5QcmV2aWV3IG5vdCBhdmFpbGFibGUgZm9yICR7Y29tcG9uZW50S2luZH08L3A+YDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCByZXMgPSB3aW5kb3cuY29tcG9uZW50X2ZhY3RvcnlbY29tcG9uZW50S2luZF0ob3B0KTtcbiAgICAgICAgICAgIGlmIChjb21wb25lbnRLaW5kID09PSBcImFjdGl2ZWNvZGVcIikge1xuICAgICAgICAgICAgICAgIGlmIChtb3JlT3B0cy5tdWx0aUdyYWRlcikge1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuY29tcG9uZW50TWFwW1xuICAgICAgICAgICAgICAgICAgICAgICAgYCR7bW9yZU9wdHMuZ3JhZGluZ0NvbnRhaW5lcn0gJHtyZXMuZGl2aWR9YFxuICAgICAgICAgICAgICAgICAgICBdID0gcmVzO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5jb21wb25lbnRNYXBbcmVzLmRpdmlkXSA9IHJlcztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVUaW1lZENvbXBvbmVudChjb21wb25lbnRTcmMsIG1vcmVPcHRzKSB7XG4gICAgLyogVGhlIGltcG9ydGFudCBkaXN0aW5jdGlvbiBpcyB0aGF0IHRoZSBjb21wb25lbnQgZG9lcyBub3QgcmVhbGx5IG5lZWQgdG8gYmUgcmVuZGVyZWRcbiAgICBpbnRvIHRoZSBwYWdlLCBpbiBmYWN0LCBkdWUgdG8gdGhlIGFzeW5jIG5hdHVyZSBvZiBnZXR0aW5nIHRoZSBzb3VyY2UgdGhlIGxpc3Qgb2YgcXVlc3Rpb25zXG4gICAgaXMgbWFkZSBhbmQgdGhlIG9yaWdpbmFsIGh0bWwgaXMgcmVwbGFjZWQgYnkgdGhlIGxvb2sgb2YgdGhlIGV4YW0uXG4gICAgKi9cblxuICAgIGxldCBwYXR0ID0gLy4uXFwvX2ltYWdlcy9nO1xuICAgIGNvbXBvbmVudFNyYyA9IGNvbXBvbmVudFNyYy5yZXBsYWNlKFxuICAgICAgICBwYXR0LFxuICAgICAgICBgJHtlQm9va0NvbmZpZy5hcHB9L2Jvb2tzL3B1Ymxpc2hlZC8ke2VCb29rQ29uZmlnLmJhc2Vjb3Vyc2V9L19pbWFnZXNgLFxuICAgICk7XG5cbiAgICBsZXQgcGFyc2VkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBwYXJzZWQuaW5uZXJIVE1MID0gY29tcG9uZW50U3JjO1xuICAgIGxldCBjb21wb25lbnRFbGVtZW50ID0gcGFyc2VkLnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1jb21wb25lbnRdXCIpO1xuICAgIGxldCBjb21wb25lbnRLaW5kID0gY29tcG9uZW50RWxlbWVudD8uZGF0YXNldC5jb21wb25lbnQ7XG4gICAgbGV0IG9yaWdJZCA9IGNvbXBvbmVudEVsZW1lbnQ/LmdldEF0dHJpYnV0ZShcImlkXCIpO1xuXG4gICAgLy8gRG91YmxlIGNoZWNrIC0tIGlmIHRoZSBjb21wb25lbnQgc291cmNlIGlzIG5vdCBpbiB0aGUgRE9NLCB0aGVuIGJyaWVmbHkgYWRkIGl0XG4gICAgLy8gYW5kIGNhbGwgdGhlIGNvbnN0cnVjdG9yLlxuICAgIGlmICghZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQob3JpZ0lkKSkge1xuICAgICAgICBsZXQgaGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGhkaXYuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICBoZGl2LmlubmVySFRNTCA9IGNvbXBvbmVudFNyYztcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChoZGl2KTtcbiAgICB9XG5cbiAgICBsZXQgcmV0O1xuICAgIGxldCBvcHRzID0ge1xuICAgICAgICBvcmlnOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChvcmlnSWQpLFxuICAgICAgICB0aW1lZDogdHJ1ZSxcbiAgICB9O1xuICAgIGlmICh0eXBlb2YgbW9yZU9wdHMgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgZm9yIChsZXQga2V5IGluIG1vcmVPcHRzKSB7XG4gICAgICAgICAgICBvcHRzW2tleV0gPSBtb3JlT3B0c1trZXldO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGNvbXBvbmVudEtpbmQgaW4gd2luZG93LmNvbXBvbmVudF9mYWN0b3J5KSB7XG4gICAgICAgIHJldCA9IHdpbmRvdy5jb21wb25lbnRfZmFjdG9yeVtjb21wb25lbnRLaW5kXShvcHRzKTtcbiAgICB9XG5cbiAgICBsZXQgcmRpY3QgPSB7fTtcbiAgICByZGljdC5xdWVzdGlvbiA9IHJldDtcbiAgICByZXR1cm4gcmRpY3Q7XG59XG5cbi8vIEZvciBpbnRlZ3JhdGlvbiB3aXRoIHRoZSBSZWFjdCBvdmVyaGF1bHQgb2YgUHJldGV4dFxuLy8gMS4gRGlzYWJsZSB0aGUgYXV0b21hdGljIGluc3RhbnRpYXRpb24gYXQgdGhlIGVuZCBvZiBlYWNoIGNvbXBvbmVudC5qc1xuLy8gMi4gcmVhY3Qgd2lsbCBzZWFyY2ggZm9yIGFsbCBcIi5ydW5lc3RvbmVcIiBhbmQgd2lsbCBjYWxsIHRoaXMgZnVuY3Rpb24gZm9yIGVhY2ggb2YgdGhlbS5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZW5kZXJPbmVDb21wb25lbnQocnNEaXYpIHtcbiAgICAvLyBGaW5kIHRoZSBhY3R1YWwgY29tcG9uZW50IGluc2lkZSB0aGUgcnVuZXN0b25lIGNvbXBvbmVudC5cbiAgICBsZXQgY29tcG9uZW50ID0gcnNEaXYucXVlcnlTZWxlY3RvcihcIltkYXRhLWNvbXBvbmVudF1cIik7XG4gICAgaWYgKGNvbXBvbmVudCA9PSBudWxsKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgICAgXCJSZW5kZXIgd2FzIGNhbGxlZCBmb3IgYSBjb21wb25lbnQsIGJ1dCBub3cgW2RhdGEtY29tcG9uZW50XSBhdHRyaWJ1dGUgaXMgcHJlc2VudC4gVGhpcyBtYXkgbWVhbiB0aGUgY29tcG9uZW50IGhhcyBhbHJlYWR5IGJlZW4gcmVuZGVyZWQuXCIsXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbGV0IGNvbXBvbmVudEtpbmQgPSBjb21wb25lbnQuZGF0YXNldC5jb21wb25lbnQ7XG4gICAgYXdhaXQgcnVuZXN0b25lX2ltcG9ydChjb21wb25lbnRLaW5kKTtcbiAgICBpZiAoIXJzRGl2LmNsb3Nlc3QoXCJbZGF0YS1jb21wb25lbnQ9dGltZWRBc3Nlc3NtZW50XVwiKSkge1xuICAgICAgICAvLyBJZiB0aGlzIGVsZW1lbnQgZXhpc3RzIHdpdGhpbiBhIHRpbWVkIGNvbXBvbmVudCwgZG9uJ3QgcmVuZGVyIGl0IGhlcmVcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCBkaXZpZCA9IGNvbXBvbmVudC5pZDtcbiAgICAgICAgICAgIHdpbmRvdy5jb21wb25lbnRNYXBbZGl2aWRdID0gd2luZG93LmNvbXBvbmVudF9mYWN0b3J5W1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudEtpbmRcbiAgICAgICAgICAgIF0oe1xuICAgICAgICAgICAgICAgIG9yaWc6IGNvbXBvbmVudCxcbiAgICAgICAgICAgICAgICB1c2VSdW5lc3RvbmVTZXJ2aWNlczogZUJvb2tDb25maWcudXNlUnVuZXN0b25lU2VydmljZXMsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgRXJyb3IgcmVuZGVyaW5nICR7Y29tcG9uZW50S2luZH0gUHJvYmxlbSAke2NvbXBvbmVudC5pZH1cbiAgICAgICAgICAgICAgICAgICAgICAgICBEZXRhaWxzOiAke2Vycn1gKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==