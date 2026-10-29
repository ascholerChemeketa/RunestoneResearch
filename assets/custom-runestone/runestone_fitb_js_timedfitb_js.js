"use strict";
(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_fitb_js_timedfitb_js"],{

/***/ 1103:
/*!****************************************!*\
  !*** ./runestone/fitb/js/timedfitb.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TimedFITB)
/* harmony export */ });
/* harmony import */ var _fitb_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./fitb.js */ 54088);

class TimedFITB extends _fitb_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(opts) {
        super(opts);
        this.renderTimedIcon(this.inputDiv);
        this.hideButtons();
        this.needsReinitialization = true;
    }
    hideButtons() {
        if (this.submitButton) this.submitButton.style.display = "none";
        if (this.compareButton) this.compareButton.style.display = "none";
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
        if (component) {
            if (component.firstChild) {
                component.insertBefore(timeIconDiv, component.firstChild);
            } else {
                component.appendChild(timeIconDiv);
            }
        }
    }
    checkCorrectTimed() {
        // Returns if the question was correct, incorrect, or skipped (return null in the last case)
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
        // Also drops each blank's aria-describedby: hidden text is still read
        // out when a description points at it, so leaving the links in place
        // would announce feedback the student is not supposed to have yet.
        this.clearBlankFeedback();
        this.feedBackDiv.style.display = "none";
    }

    reinitializeListeners() {
        this.setupBlanks();
    }
}

if (typeof window.component_factory === "undefined") {
    window.component_factory = {};
}
window.component_factory.fillintheblank = function (opts) {
    if (opts.timed) {
        return new TimedFITB(opts);
    }
    return new _fitb_js__WEBPACK_IMPORTED_MODULE_0__["default"](opts);
};


/***/ }),

/***/ 30612:
/*!**********************************************!*\
  !*** ./runestone/fitb/js/fitb-i18n.pt-br.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/rsi18n.js */ 54250);


(0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.load)({
    "pt-br": {
        msg_no_answer: "Nenhuma resposta dada.",
        msg_fitb_check_me: "Verificar",
        msg_fitb_compare_me: "Comparar"
    },
});


/***/ }),

/***/ 30923:
/*!************************************************!*\
  !*** ./runestone/fitb/js/libs/aleaPRNG-1.1.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   aleaPRNG: () => (/* binding */ aleaPRNG)
/* harmony export */ });
/*////////////////////////////////////////////////////////////////
aleaPRNG 1.1
//////////////////////////////////////////////////////////////////
https://github.com/macmcmeans/aleaPRNG/blob/master/aleaPRNG-1.1.js
//////////////////////////////////////////////////////////////////
Original work copyright © 2010 Johannes Baagøe, under MIT license
This is a derivative work copyright (c) 2017-2020, W. Mac" McMeans, under BSD license.
Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
////////////////////////////////////////////////////////////////*/
function aleaPRNG() {
    return( function( args ) {
        "use strict";

        const version = 'aleaPRNG 1.1.0';

        var s0
            , s1
            , s2
            , c
            , uinta = new Uint32Array( 3 )
            , initialArgs
            , mashver = ''
        ;

        /* private: initializes generator with specified seed */
        function _initState( _internalSeed ) {
            var mash = Mash();

            // internal state of generator
            s0 = mash( ' ' );
            s1 = mash( ' ' );
            s2 = mash( ' ' );

            c = 1;

            for( var i = 0; i < _internalSeed.length; i++ ) {
                s0 -= mash( _internalSeed[ i ] );
                if( s0 < 0 ) { s0 += 1; }

                s1 -= mash( _internalSeed[ i ] );
                if( s1 < 0 ) { s1 += 1; }

                s2 -= mash( _internalSeed[ i ] );
                if( s2 < 0 ) { s2 += 1; }
            }

            mashver = mash.version;

            mash = null;
        };

        /* private: dependent string hash function */
        function Mash() {
            var n = 4022871197; // 0xefc8249d

            var mash = function( data ) {
                data = data.toString();

                // cache the length
                for( var i = 0, l = data.length; i < l; i++ ) {
                    n += data.charCodeAt( i );

                    var h = 0.02519603282416938 * n;

                    n  = h >>> 0;
                    h -= n;
                    h *= n;
                    n  = h >>> 0;
                    h -= n;
                    n += h * 4294967296; // 0x100000000      2^32
                }
                return ( n >>> 0 ) * 2.3283064365386963e-10; // 2^-32
            };

            mash.version = 'Mash 0.9';
            return mash;
        };


        /* private: check if number is integer */
        function _isInteger( _int ) {
            return parseInt( _int, 10 ) === _int;
        };

        /* public: return a 32-bit fraction in the range [0, 1]
        This is the main function returned when aleaPRNG is instantiated
        */
        var random = function() {
            var t = 2091639 * s0 + c * 2.3283064365386963e-10; // 2^-32

            s0 = s1;
            s1 = s2;

            return s2 = t - ( c = t | 0 );
        };

        /* public: return a 53-bit fraction in the range [0, 1] */
        random.fract53 = function() {
            return random() + ( random() * 0x200000  | 0 ) * 1.1102230246251565e-16; // 2^-53
        };

        /* public: return an unsigned integer in the range [0, 2^32] */
        random.int32 = function() {
            return random() * 0x100000000; // 2^32
        };

        /* public: advance the generator the specified amount of cycles */
        random.cycle = function( _run ) {
            _run = typeof _run === 'undefined' ? 1 : +_run;
            if( _run < 1 ) { _run = 1; }
            for( var i = 0; i < _run; i++ ) { random(); }
        };

        /* public: return inclusive range */
        random.range = function() {
            var loBound
                , hiBound
            ;

            if( arguments.length === 1 ) {
                loBound = 0;
                hiBound = arguments[ 0 ];

            } else {
                loBound = arguments[ 0 ];
                hiBound = arguments[ 1 ];
            }

            if( arguments[ 0 ] > arguments[ 1 ] ) {
                loBound = arguments[ 1 ];
                hiBound = arguments[ 0 ];
            }

            // return integer
            if( _isInteger( loBound ) && _isInteger( hiBound ) ) {
                return Math.floor( random() * ( hiBound - loBound + 1 ) ) + loBound;

            // return float
            } else {
                return random() * ( hiBound - loBound ) + loBound;
            }
        };

        /* public: initialize generator with the seed values used upon instantiation */
        random.restart = function() {
            _initState( initialArgs );
        };

        /* public: seeding function */
        random.seed = function() {
            _initState( Array.prototype.slice.call( arguments ) );
        };

        /* public: show the version of the RNG */
        random.version = function() {
            return version;
        };

        /* public: show the version of the RNG and the Mash string hasher */
        random.versions = function() {
            return version + ', ' + mashver;
        };

        // when no seed is specified, create a random one from Windows Crypto (Monte Carlo application)
        if( args.length === 0 ) {
             window.crypto.getRandomValues( uinta );
             args = [ uinta[ 0 ], uinta[ 1 ], uinta[ 2 ] ];
        };

        // store the seed used when the RNG was instantiated, if any
        initialArgs = args;

        // initialize the RNG
        _initState( args );

        return random;

    })( Array.prototype.slice.call( arguments ) );
};

/***/ }),

/***/ 39604:
/*!*******************************************!*\
  !*** ./runestone/fitb/js/fitb-i18n.en.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/rsi18n.js */ 54250);


(0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.load)({
    en: {
        msg_no_answer: "No answer provided.",
        msg_fitb_check_me: "Check me",
        msg_fitb_compare_me: "Compare me",
        msg_fitb_randomize: "Randomize",
        // Accessible names. A screen reader reads only a field's own name when
        // focus lands on it, so the prompt has to travel with the blank.
        // $1 = blank number, $2 = number of blanks, $3 = the prompt text.
        msg_fitb_blank_label: "Blank $1 of $2. $3",
        // $1 = the prompt text.
        msg_fitb_blank_label_single: "Fill in the blank. $1",
        // Used when the prompt has no text to read, e.g. an image-only problem.
        msg_fitb_blank_fallback: "Blank $1 of $2",
        msg_fitb_blank_fallback_single: "Fill in the blank",
        // How a blank is spoken where it appears in the prompt text. $1 = its
        // number.
        msg_fitb_blank_n: "blank $1",
        msg_fitb_group_label: "Fill in the blank question",
        // $1 = the question number shown in the caption.
        msg_fitb_group_label_numbered: "Fill in the blank question $1",
        msg_fitb_correct: "Correct:",
        msg_fitb_incorrect: "Incorrect:",
        msg_fitb_result_correct: "All blanks correct.",
        msg_fitb_result_incorrect: "Some blanks are incorrect.",
        msg_fitb_top_answers: "Top Answers",
        msg_fitb_close: "Close",
    },
});


/***/ }),

/***/ 44695:
/*!*************************************!*\
  !*** ./runestone/fitb/css/fitb.css ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 54088:
/*!***********************************!*\
  !*** ./runestone/fitb/js/fitb.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FITBList: () => (/* binding */ FITBList),
/* harmony export */   "default": () => (/* binding */ FITB)
/* harmony export */ });
/* harmony import */ var _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/runestonebase.js */ 78673);
/* harmony import */ var _common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../common/js/rsi18n.js */ 54250);
/* harmony import */ var _fitb_utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./fitb-utils.js */ 84548);
/* harmony import */ var _fitb_i18n_en_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./fitb-i18n.en.js */ 39604);
/* harmony import */ var _fitb_i18n_pt_br_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./fitb-i18n.pt-br.js */ 30612);
/* harmony import */ var _fitb_i18n_sr_Cyrl_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./fitb-i18n.sr-Cyrl.js */ 61529);
/* harmony import */ var _css_fitb_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../css/fitb.css */ 44695);
// ***********************************************
// |docname| -- fill-in-the-blank client-side code
// ***********************************************
// This file contains the JS for the Runestone fillintheblank component. It was created By Isaiah Mayerchak and Kirby Olson, 6/4/15 then revised by Brad Miller, 2/7/20.
//
// Data storage notes
// ==================
//
// Initial problem restore
// -----------------------
// In the constructor, this code (the client) restores the problem by calling ``checkServer``. To do so, either the server sends or local storage has:
//
// -    seed (used only for dynamic problems)
// -    answer
// -    displayFeed (server-side grading only; otherwise, this is generated locally by client code)
// -    correct (SSG)
// -    isCorrectArray (SSG)
// -    problemHtml (SSG with dynamic problems only)
//
// If any of the answers are correct, then the client shows feedback. This is implemented in restoreAnswers_.
//
// Grading
// -------
// When the user presses the "Check me" button, the logCurrentAnswer_ function:
//
// -    Saves the following to local storage:
//
//      -   seed
//      -   answer
//      -   timestamp
//      -   problemHtml
//
//      Note that there's no point in saving displayFeed, correct, or isCorrectArray, since these values applied to the previous answer, not the new answer just submitted.
//
// -    Sends the following to the server; stop after this for client-side grading:
//
//      -   seed (ignored for server-side grading)
//      -   answer
//      -   correct (ignored for SSG)
//      -   percent (ignored for SSG)
//
// -    Receives the following from the server:
//
//      -   timestamp
//      -   displayFeed
//      -   correct
//      -   isCorrectArray
//
// -    Saves the following to local storage:
//
//      -   seed
//      -   answer
//      -   timestamp
//      -   displayFeed (SSG only)
//      -   correct (SSG only)
//      -   isCorrectArray (SSG only)
//      -   problemHtml
//
// Randomize
// ---------
// When the user presses the "Randomize" button (which is only available for dynamic problems), the randomize_ function:
//
// -    For the client-side case, sets the seed to a new, random value. For the server-side case, requests a new seed and problemHtml from the server.
// -    Sets the answer to an array of empty strings.
// -    Saves the usual local data.











// Object containing all instances of FITB that aren't a child of a timed assessment.
var FITBList = {};

// FITB constructor
class FITB extends _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(opts) {
        super(opts);
        var orig = opts.orig; // entire <p> element
        this.useRunestoneServices = opts.useRunestoneServices;
        this.origElem = orig;
        this.divid = orig.id;
        this.correct = null;
        // See comments in fitb.py for the format of ``feedbackArray`` (which is identical in both files).
        //
        // Find the script tag containing JSON and parse it. See `SO <https://stackoverflow.com/questions/9320427/best-practice-for-embedding-arbitrary-json-in-the-dom>`__. If this tag doesn't exist, then no feedback is available; server-side grading will be performed.
        //
        // A destructuring assignment would be perfect, but they don't work with ``this.blah`` and ``with`` statements aren't supported in strict mode.
        const json_element = this.scriptSelector(this.origElem);
        const dict_ = JSON.parse(json_element.textContent);
        json_element.remove();
        // Check for older versions that have raw html content.
        if (dict_.problemHtml !== undefined) {
            // if dict_.problemHtml starts with &lt; then unescape it this happens for previews
            // when the problem comes from the DB
            if (dict_.problemHtml.startsWith("&lt;")) {
                dict_.problemHtml = dict_.problemHtml
                    .replace(/&lt;/g, "<")
                    .replace(/&gt;/g, ">");
            }
            if (eBookConfig.useRunestoneServices) {
                dict_.problemHtml = dict_.problemHtml.replace(
                    /src="external/g,
                    'src="' +
                        `/ns/books/published/${eBookConfig.basecourse}` +
                        "/external",
                );
            }

            this.problemHtml = dict_.problemHtml;
            this.dyn_vars = dict_.dyn_vars;
            this.blankNames = dict_.blankNames;
            this.feedbackArray = dict_.feedbackArray;
        } else {
            this.problemHtml = this.origElem.innerHTML;
            this.feedbackArray = dict_;
        }

        this.createFITBElement();
        this.setupBlanks();
        this.caption = "Fill in the Blank";
        this.addCaption("runestone");
        this.setGroupLabel();

        // Define a promise which imports any libraries needed by dynamic problems.
        this.dyn_imports = {};
        let imports_promise = Promise.resolve();
        if (dict_.dyn_imports !== undefined) {
            // Collect all import promises.
            let import_promises = [];
            for (const import_ of dict_.dyn_imports) {
                switch (import_) {
                    // For imports known at webpack build, bring these in.
                    case "BTM":
                        import_promises.push(
                            __webpack_require__.e(/*! import() */ "vendors-node_modules_btm-expressions_src_BTM_root_js").then(__webpack_require__.bind(__webpack_require__, /*! btm-expressions/src/BTM_root.js */ 30571)),
                        );
                        break;
                    // Allow for local imports, usually from problems defined outside the Runestone Components.
                    // Relative URL should be relative to document base, not this library
                    default:
                        const absoluteUrl = new URL(import_, document.baseURI)
                            .href;
                        import_promises.push(
                            import(/* webpackIgnore: true */ absoluteUrl),
                        );
                        break;
                }
            }

            // Combine the resulting module namespace objects when these promises resolve.
            imports_promise = Promise.all(import_promises)
                .then(
                    (module_namespace_arr) =>
                        (this.dyn_imports = Object.assign(
                            {},
                            ...module_namespace_arr,
                        )),
                )
                .catch((err) => {
                    throw `Failed dynamic import: ${err}.`;
                });
        }

        // Resolve these promises.
        imports_promise.then(() => {
            this.checkServer("fillb", false).then(() => {
                // One option for a dynamic problem is to produce a static problem by providing a fixed seed value. This is typically used when the goal is to render the problem as an image for inclusion in static content (a PDF, etc.). To support this, consider the following cases:
                //
                /// Case  Has static seed?  Is a client-side, dynamic problem?  Has local seed?  Result
                /// 0     No                No                                  X                No action needed.
                /// 1     No                Yes                                 No               this.randomize().
                /// 2     No                Yes                                 Yes              No action needed -- problem already restored from local storage.
                /// 3     Yes               No                                  X                Warning: seed ignored.
                /// 4     Yes               Yes                                 No               Assign seed; this.renderDynamicContent().
                /// 5     Yes               Yes                                 Yes              If seeds differ, issue warning. No additional action needed -- problem already restored from local storage.

                const has_static_seed = dict_.static_seed !== undefined;
                const is_client_dynamic = typeof this.dyn_vars === "string";
                const has_local_seed = this.seed !== undefined;

                // Case 1
                if (!has_static_seed && is_client_dynamic && !has_local_seed) {
                    this.randomize();
                }
                // Case 3
                else if (has_static_seed && !is_client_dynamic) {
                    console.assert(
                        false,
                        "Warning: the provided static seed was ignored, because it only affects client-side, dynamic problems.",
                    );
                }
                // Case 4
                else if (
                    has_static_seed &&
                    is_client_dynamic &&
                    !has_local_seed
                ) {
                    this.seed = dict_.static_seed;
                    this.renderDynamicContent();
                }
                // Case 5
                else if (
                    has_static_seed &&
                    is_client_dynamic &&
                    has_local_seed &&
                    this.seed !== dict_.static_seed
                ) {
                    console.assert(
                        false,
                        "Warning: the provided static seed was overridden by the seed found in local storage.",
                    );
                }
                // Cases 0 and 2
                else {
                    // No action needed.
                }

                if (typeof Prism !== "undefined") {
                    Prism.highlightAllUnder(this.containerDiv);
                }

                this.indicate_component_ready();
            });
        });
        this.typesetPrompt();
    }

    // Find the script tag containing JSON in a given root DOM node.
    scriptSelector(root_node) {
        return root_node.querySelector(`script[type="application/json"]`);
    }

    /*===========================================
    ====   Functions generating final HTML   ====
    ===========================================*/
    createFITBElement() {
        this.renderFITBInput();
        this.renderFITBButtons();
        this.renderFITBFeedbackDiv();
        // replaces the intermediate HTML for this component with the rendered HTML of this component
        this.origElem.replaceWith(this.containerDiv);
    }
    renderFITBInput() {
        // The text [input] elements are created by the template.
        this.containerDiv = document.createElement("div");
        this.containerDiv.id = this.divid;
        // Create another container which stores the problem description.
        this.descriptionDiv = document.createElement("div");
        this.descriptionDiv.classList.add("exercise-statement");
        this.containerDiv.appendChild(this.descriptionDiv);
        // Copy the original elements to the container holding what the user will see (client-side grading only).
        if (this.problemHtml) {
            this.descriptionDiv.innerHTML = this.problemHtml;
            // Save original HTML (with templates) used in dynamic problems.
            this.descriptionDiv.origInnerHTML = this.problemHtml;
        }
    }

    renderFITBButtons() {
        // "submit" button
        this.submitButton = document.createElement("button");
        this.submitButton.textContent = (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_1__.t)("msg_fitb_check_me");
        this.submitButton.className = "btn btn-success";
        this.submitButton.name = "do answer";
        this.submitButton.type = "button";
        this.submitButton.addEventListener(
            "click",
            async function () {
                this.checkCurrentAnswer();
                await this.logCurrentAnswer();
            }.bind(this),
            false,
        );
        this.containerDiv.appendChild(this.submitButton);

        // "compare me" button
        if (this.useRunestoneServices) {
            this.compareButton = document.createElement("button");
            this.compareButton.className = "btn btn-default";
            this.compareButton.id = this.origElem.id + "_bcomp";
            this.compareButton.type = "button";
            this.compareButton.disabled = true;
            this.compareButton.name = "compare";
            this.compareButton.textContent = (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_1__.t)("msg_fitb_compare_me");
            this.compareButton.addEventListener(
                "click",
                function () {
                    this.compareFITBAnswers();
                }.bind(this),
                false,
            );
            this.containerDiv.appendChild(this.compareButton);
        }

        // Randomize button for dynamic problems.
        if (this.dyn_vars) {
            this.randomizeButton = document.createElement("button");
            this.randomizeButton.className = "btn btn-default";
            // Not ``_bcomp``; that is the compare button's id, and dynamic
            // problems that offer both would have produced a duplicate id.
            this.randomizeButton.id = this.origElem.id + "_brand";
            this.randomizeButton.type = "button";
            this.randomizeButton.name = "randomize";
            this.randomizeButton.textContent = (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_1__.t)("msg_fitb_randomize");
            this.randomizeButton.addEventListener(
                "click",
                function () {
                    this.randomize();
                }.bind(this),
                false,
            );
            this.containerDiv.appendChild(this.randomizeButton);
        }

        this.containerDiv.appendChild(document.createElement("div"));
    }
    renderFITBFeedbackDiv() {
        this.feedBackDiv = document.createElement("div");
        this.feedBackDiv.id = this.divid + "_feedback";
        // ``role="status"`` is an implicitly polite live region. The previous
        // ``role="alert"`` was assertive, contradicting the polite setting
        // beside it and interrupting whatever the screen reader was saying.
        this.feedBackDiv.setAttribute("role", "status");
        this.feedBackDiv.setAttribute("aria-live", "polite");
        this.feedBackDiv.setAttribute("aria-atomic", "true");
        this.feedBackDiv.classList.add("fitb-feedback");
        this.containerDiv.appendChild(this.feedBackDiv);
    }

    clearFeedbackDiv() {
        // Setting the ``outerHTML`` removes this from the DOM. Use an alternative process -- remove the class (which makes it red/green based on grading) and content.
        this.feedBackDiv.innerHTML = "";
        // Keep ``fitb-feedback``; only the alert colouring is per-grade.
        this.feedBackDiv.className = "fitb-feedback";
        this.clearBlankFeedback();
    }

    // Drop the per-blank grading state, so a stale ``aria-describedby`` never
    // points at feedback that has already been removed from the page.
    clearBlankFeedback() {
        for (const blank of this.blankArray || []) {
            blank.classList.remove("input-validation-error");
            blank.removeAttribute("aria-invalid");
            blank.removeAttribute("aria-describedby");
        }
    }

    // Update the problem's description based on dynamically-generated content.
    renderDynamicContent() {
        // ``this.dyn_vars`` can be true; if so, don't render it, since the server does all the rendering.
        if (typeof this.dyn_vars === "string") {
            let html_nodes;
            [html_nodes, this.dyn_vars_eval] = (0,_fitb_utils_js__WEBPACK_IMPORTED_MODULE_2__.renderDynamicContent)(
                this.seed,
                this.dyn_vars,
                this.dyn_imports,
                this.descriptionDiv.origInnerHTML,
                this.divid,
                this.prepareCheckAnswers.bind(this),
            );
            this.descriptionDiv.replaceChildren(...html_nodes);

            if (typeof this.dyn_vars_eval.afterContentRender === "function") {
                try {
                    this.dyn_vars_eval.afterContentRender(this.dyn_vars_eval);
                } catch (err) {
                    console.assert(
                        false,
                        `Error in problem ${this.divid} invoking afterContentRender`,
                    );
                    throw err;
                }
            }

            this.setupBlanks();
        }
    }

    setupBlanks() {
        // Find and format the blanks. If a dynamic problem just changed the HTML, this will find the newly-created blanks.
        // WARNING - this assumes that all text/number inputs in the descriptionDiv are the blanks.
        // Ideally, there should be some unique attribute that can be used to select the blanks.
        const ba = this.descriptionDiv.querySelectorAll(
            'input[type="text"],input[type="number"]',
        );
        ba.forEach((el) => {
            el.className = "form form-control selectwidthauto";
        });
        this.blankArray = Array.from(ba);
        for (let blank of this.blankArray) {
            blank.addEventListener("change", this.recordAnswered.bind(this));
        }
        this.labelBlanks();
    }

    /*========================================
    ====  Accessible names for the blanks  ====
    ========================================*/
    // Name the exercise as a whole, so entering it announces what it is rather
    // than an anonymous group of text boxes.
    setGroupLabel() {
        this.containerDiv.setAttribute("role", "group");
        this.containerDiv.setAttribute(
            "aria-label",
            this.question_label
                ? (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_1__.t)("msg_fitb_group_label_numbered", this.question_label)
                : (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_1__.t)("msg_fitb_group_label"),
        );
    }

    // A screen reader announces a form field's accessible name when focus lands
    // on it and nothing else -- the prompt text around the field is never read
    // in forms mode. Every blank was named "input area", so tabbing into a
    // question said nothing about the question. Build each name out of the
    // prompt instead, spelling out every blank in that prompt as "blank 1",
    // "blank 2", ... so the gaps have audible positions.
    labelBlanks() {
        const total = this.blankArray.length;
        this.blankArray.forEach((blank, i) => {
            const context = this.blankContext(blank, i);
            let label;
            if (total === 1) {
                label = context
                    ? (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_1__.t)("msg_fitb_blank_label_single", context)
                    : (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_1__.t)("msg_fitb_blank_fallback_single");
            } else {
                label = context
                    ? (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_1__.t)("msg_fitb_blank_label", i + 1, total, context)
                    : (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_1__.t)("msg_fitb_blank_fallback", i + 1, total);
            }
            blank.setAttribute("aria-label", label);
        });
    }

    // The prompt text to read out for blank ``i``.
    blankContext(blank, i) {
        const block = this.blankBlock(blank);
        let text = this.blankContextText(block);
        // Newlines are only significant in a code listing, and there the useful
        // context is the blank's own line: reading a whole program aloud on
        // every Tab is as unusable as reading nothing. Fall back to the entire
        // listing for a blank that sits alone on its line, which says nothing
        // by itself.
        if (block.tagName.toLowerCase() === "pre") {
            const marker = (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_1__.t)("msg_fitb_blank_n", i + 1);
            const line = text.split("\n").find((l) => l.includes(marker));
            if (line !== undefined && line.replace(marker, "").trim()) {
                text = line;
            }
        }
        return (
            text
                .replace(/\s+/g, " ")
                // A blank is padded with spaces so it never runs into the words
                // beside it; pull the padding back off punctuation, which
                // otherwise reads as "blank 1 , then".
                .replace(/\s+([,.;:!?)\]}])/g, "$1")
                .trim()
        );
    }

    // The block the blank sits in -- its sentence, list item or table cell --
    // which is the useful unit of context. Falls back to the whole prompt.
    blankBlock(blank) {
        const block = blank.closest(
            "p,li,dd,dt,td,th,pre,blockquote,section,div,h1,h2,h3,h4,h5,h6",
        );
        return block && this.descriptionDiv.contains(block)
            ? block
            : this.descriptionDiv;
    }

    // Flatten an element into the text a screen reader would hear, with each
    // blank replaced by its spoken number. Whitespace is not normalized here.
    blankContextText(root) {
        const parts = [];
        const walk = (node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                parts.push(node.nodeValue);
                return;
            }
            if (node.nodeType !== Node.ELEMENT_NODE) {
                return;
            }
            // Skip whatever is already hidden from assistive technology. This
            // also drops MathJax's visual output, leaving its assistive MathML.
            if (node.getAttribute("aria-hidden") === "true") {
                return;
            }
            const tag = node.tagName.toLowerCase();
            if (tag === "script" || tag === "style" || tag === "template") {
                return;
            }
            const blankIndex = this.blankArray.indexOf(node);
            if (blankIndex !== -1) {
                parts.push(` ${(0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_1__.t)("msg_fitb_blank_n", blankIndex + 1)} `);
                return;
            }
            if (tag === "br") {
                parts.push(" ");
                return;
            }
            if (tag === "img") {
                parts.push(` ${node.getAttribute("alt") || ""} `);
                return;
            }
            if (tag === "input" || tag === "select" || tag === "textarea") {
                // Some other control the author put in the prompt: read the
                // name it carries rather than descending into it.
                parts.push(` ${node.getAttribute("aria-label") || ""} `);
                return;
            }
            for (const child of node.childNodes) {
                walk(child);
            }
        };
        walk(root);
        // Whitespace is left as-is; the caller decides whether newlines matter.
        return parts.join("");
    }

    // MathJax rewrites the prompt asynchronously, after the blanks have been
    // named; rebuild the names once it is done so they hold the typeset text
    // instead of raw LaTeX.
    typesetPrompt() {
        return this.queueMathJax(this.descriptionDiv).then(() =>
            this.labelBlanks(),
        );
    }

    // This tells timed questions that the fitb blanks received some interaction.
    recordAnswered() {
        this.isAnswered = true;
    }

    /*===================================
    === Checking/loading from storage ===
    ===================================*/
    restoreAnswers(data) {
        // Restore the seed first, since the dynamic render clears all the blanks.
        this.seed = data.seed;
        this.renderDynamicContent();
        this.typesetPrompt();

        var arr;
        // Restore answers from storage retrieval done in RunestoneBase.
        try {
            // The newer format encodes data as a JSON object.
            arr = JSON.parse(data.answer);
            // The result should be an array. If not, try comma parsing instead.
            if (!Array.isArray(arr)) {
                throw new Error();
            }
        } catch (err) {
            // The old format didn't.
            arr = (data.answer || "").split(",");
        }
        let hasAnswer = false;
        for (var i = 0; i < this.blankArray.length; i++) {
            this.blankArray[i].value = arr[i] || "";
            if (arr[i]) {
                hasAnswer = true;
            }
        }
        // Is this client-side grading, or server-side grading?
        if (this.feedbackArray) {
            // For client-side grading, re-generate feedback if there's an answer.
            if (hasAnswer) {
                this.checkCurrentAnswer();
            }
        } else {
            // For server-side grading, use the provided feedback from the server or local storage.
            this.displayFeed = data.displayFeed;
            this.correct = data.correct;
            this.isCorrectArray = data.isCorrectArray;
            // Only render if all the data is present; local storage might have old data missing some of these items.
            if (
                typeof this.displayFeed !== "undefined" &&
                typeof this.correct !== "undefined" &&
                typeof this.isCorrectArray !== "undefined"
            ) {
                this.renderFeedback();
            }
            // For server-side dynamic problems, show the rendered problem text.
            this.problemHtml = data.problemHtml;
            if (this.problemHtml) {
                this.descriptionDiv.innerHTML = this.problemHtml;
                this.typesetPrompt();
                this.setupBlanks();
            }
        }
    }

    checkLocalStorage() {
        // Loads previous answers from local storage if they exist
        var storedData;
        if (this.graderactive) {
            return;
        }
        var len = localStorage.length;
        if (len > 0) {
            var ex = localStorage.getItem(this.localStorageKey());
            if (ex !== null) {
                let error = false;
                try {
                    storedData = JSON.parse(ex);
                } catch (err) {
                    // error while parsing; likely due to bad value stored in storage
                    console.log(
                        `Error parsing stored FITB data for ${this.divid}: ${err.message}`,
                    );
                    error = true;
                }
                if (error || storedData.timestamp < eBookConfig.termStartDate) {
                    localStorage.removeItem(this.localStorageKey());
                    return;
                }
                this.restoreAnswers(storedData);
            }
        }
    }

    setLocalStorage(data) {
        let key = this.localStorageKey();
        localStorage.setItem(key, JSON.stringify(data));
    }

    checkCurrentAnswer() {
        // Start of the evaluation chain
        this.isCorrectArray = [];
        this.displayFeed = [];
        const pca = this.prepareCheckAnswers();

        if (this.useRunestoneServices) {
            if (eBookConfig.enableCompareMe) {
                this.enableCompareButton();
            }
        }

        // Grade locally if we can't ask the server to grade.
        if (this.feedbackArray) {
            [
                // An array of HTML feedback.
                this.displayFeed,
                // true, false, or null (the question wasn't answered).
                this.correct,
                // An array of true, false, or null (the question wasn't answered).
                this.isCorrectArray,
                this.percent,
            ] = (0,_fitb_utils_js__WEBPACK_IMPORTED_MODULE_2__.checkAnswersCore)(...pca);
            if (!this.isTimed) {
                this.renderFeedback();
            }
        }
    }

    // Inputs:
    //
    // - Strings entered by the student in ``this.blankArray[i].value``.
    // - Feedback in ``this.feedbackArray``.
    prepareCheckAnswers() {
        this.given_arr = [];
        for (var i = 0; i < this.blankArray.length; i++)
            this.given_arr.push(this.blankArray[i].value);
        return [
            this.blankNames,
            this.given_arr,
            this.feedbackArray,
            this.dyn_vars_eval,
        ];
    }

    // _`randomize`: This handles a click to the "Randomize" button.
    async randomize() {
        // Use the client-side case or the server-side case?
        if (this.feedbackArray) {
            // This is the client-side case.
            //
            this.seed = Math.floor(Math.random() * 2 ** 32);
            this.renderDynamicContent();
            this.typesetPrompt();
        } else {
            // This is the server-side case. Send a request to the `results <getAssessResults>` endpoint with ``new_seed`` set to True.
            const request = new Request("/assessment/results", {
                method: "POST",
                body: JSON.stringify({
                    div_id: this.divid,
                    course: eBookConfig.course,
                    event: "fillb",
                    sid: this.sid,
                    new_seed: true,
                }),
                headers: this.jsonHeaders,
            });
            const response = await fetch(request);
            if (!response.ok) {
                alert(`HTTP error getting results: ${response.statusText}`);
                return;
            }
            const data = await response.json();
            const res = data.detail;
            this.seed = res.seed;
            this.descriptionDiv.innerHTML = res.problemHtml;
            this.typesetPrompt();
            this.setupBlanks();
        }
        // When getting a new seed, clear all the old answers and feedback.
        this.given_arr = Array(this.blankArray.length).fill("");
        this.blankArray.forEach((el) => (el.value = ""));
        this.clearFeedbackDiv();
        this.saveAnswersLocallyOnly();
    }

    // Save the answers and associated data locally; don't save feedback provided by the server for this answer. It assumes that ``this.given_arr`` contains the current answers.
    saveAnswersLocallyOnly() {
        this.setLocalStorage({
            // The seed is used for client-side operation, but doesn't matter for server-side.
            seed: this.seed,
            answer: JSON.stringify(this.given_arr),
            timestamp: new Date(),
            // This is only needed for server-side grading with dynamic problems.
            problemHtml: this.descriptionDiv.innerHTML,
        });
    }

    // _`logCurrentAnswer`: Save the current state of the problem to local storage and the server; display server feedback.
    async logCurrentAnswer(sid) {
        let answer = JSON.stringify(this.given_arr);
        let feedback = true;
        // Save the answer locally.
        this.saveAnswersLocallyOnly();
        // Save the answer to the server.
        const data = {
            event: "fillb",
            div_id: this.divid,
            act: answer || "",
            seed: this.seed,
            answer: answer || "",
            correct: this.correct ? "T" : "F",
            percent: this.percent,
        };
        if (typeof sid !== "undefined") {
            data.sid = sid;
            feedback = false;
        }
        const server_data = await this.logBookEvent(data);
        if (!feedback) return;
        // Non-server side graded problems are done at this point; likewise, stop here if the server didn't respond.
        if (this.feedbackArray || !server_data) {
            return data;
        }
        // This is the server-side case. On success, update the feedback from the server's grade.
        const res = server_data.detail;
        this.timestamp = res.timestamp;
        this.displayFeed = res.displayFeed;
        this.correct = res.correct;
        this.isCorrectArray = res.isCorrectArray;
        this.setLocalStorage({
            seed: this.seed,
            answer: answer,
            timestamp: this.timestamp,
            problemHtml: this.descriptionDiv.innerHTML,
            displayFeed: this.displayFeed,
            correct: this.correct,
            isCorrectArray: this.isCorrectArray,
        });
        this.renderFeedback();
        return server_data;
    }

    /*==============================
    === Evaluation of answer and ===
    ===     display feedback     ===
    ==============================*/
    renderFeedback() {
        // Start from a clean slate: a previous grade may have left an
        // ``aria-describedby`` pointing at feedback about to be replaced.
        this.clearBlankFeedback();
        if (this.correct) {
            this.feedBackDiv.className = "alert alert-info fitb-feedback";
        } else {
            if (this.displayFeed === null) {
                this.displayFeed = "";
            }
            this.feedBackDiv.className = "alert alert-danger fitb-feedback";
        }
        // Mark the blanks themselves. The red border is invisible to a screen
        // reader; ``aria-invalid`` is what it reports when focus returns.
        for (let j = 0; j < this.blankArray.length; j++) {
            const wrong = !this.correct && this.isCorrectArray[j] !== true;
            this.blankArray[j].classList.toggle(
                "input-validation-error",
                wrong,
            );
            this.blankArray[j].setAttribute(
                "aria-invalid",
                wrong ? "true" : "false",
            );
        }

        // A single piece of feedback is not a list; don't make a screen reader
        // announce "list, 1 item" for it.
        const single = this.displayFeed.length === 1;
        const list = single
            ? document.createDocumentFragment()
            : document.createElement("ul");
        for (var i = 0; i < this.displayFeed.length; i++) {
            let df = this.displayFeed[i];
            const ok = this.isCorrectArray[i] === true;
            // Render any dynamic feedback in the provided feedback, for client-side grading of dynamic problems.
            if (typeof this.dyn_vars === "string") {
                df = (0,_fitb_utils_js__WEBPACK_IMPORTED_MODULE_2__.renderDynamicFeedback)(
                    this.blankNames,
                    this.given_arr,
                    i,
                    df,
                    this.dyn_vars_eval,
                );
                // Convert the returned NodeList into a string of HTML.
                df =
                    df?.[0] !== undefined
                        ? df[0].parentElement.innerHTML
                        : "No feedback provided";
            }
            const item = document.createElement(single ? "span" : "li");
            item.id = `${this.divid}_feedback_${i}`;
            // The check or cross is decoration -- screen readers either skip it
            // or read the emoji's name. Hide it and say the word instead.
            const mark = document.createElement("span");
            mark.setAttribute("aria-hidden", "true");
            mark.textContent = ok ? "✔️" : "✖️";
            const spoken = document.createElement("span");
            spoken.className = "visuallyhidden";
            spoken.textContent = `${
                ok ? (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_1__.t)("msg_fitb_correct") : (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_1__.t)("msg_fitb_incorrect")
            } `;
            const body = document.createElement("span");
            body.innerHTML = df ?? "";
            item.append(mark, document.createTextNode(" "), spoken, body);
            list.appendChild(item);
            // Tie the feedback to the blank it grades, so tabbing back into a
            // wrong answer repeats why it was wrong.
            if (this.blankArray[i]) {
                this.blankArray[i].setAttribute("aria-describedby", item.id);
            }
        }
        this.feedBackDiv.innerHTML = "";
        if (this.displayFeed.length > 1) {
            // With several blanks the per-blank marks are easy to lose track
            // of; lead the announcement with the overall verdict.
            const summary = document.createElement("div");
            summary.className = "visuallyhidden";
            summary.textContent = this.correct
                ? (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_1__.t)("msg_fitb_result_correct")
                : (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_1__.t)("msg_fitb_result_incorrect");
            this.feedBackDiv.appendChild(summary);
        }
        this.feedBackDiv.appendChild(list);
        this.queueMathJax(this.feedBackDiv);
    }

    /*==================================
    === Functions for compare button ===
    ==================================*/
    enableCompareButton() {
        this.compareButton.disabled = false;
    }
    // _`compareFITBAnswers`
    async compareFITBAnswers() {
        var data = {};
        data.div_id = this.divid;
        data.course = eBookConfig.course;
        try {
            const params = new URLSearchParams(data);
            const resp = await fetch(
                `${eBookConfig.new_server_prefix}/assessment/gettop10Answers?${params.toString()}`,
            );
            const json = await resp.json();
            this.compareFITB(json);
        } catch (e) {
            console.error("Error fetching top answers:", e);
        }
    }
    compareFITB(data, status, whatever) {
        const answers = data.detail.res;
        const titleId = `${this.divid}_compare_title`;
        // A real header row, marked up as one, so a screen reader can announce
        // the column when reading down the table.
        let body = "<table><thead><tr>";
        body += "<th scope='col'>Answer</th><th scope='col'>Count</th>";
        body += "</tr></thead><tbody>";
        for (const row in answers) {
            body +=
                "<tr><td>" +
                answers[row].answer +
                "</td><td>" +
                answers[row].count +
                " times</td></tr>";
        }
        body += "</tbody></table>";

        // Simple modal without Bootstrap/jQuery
        const previouslyFocused = document.activeElement;
        const overlay = document.createElement("div");
        overlay.style.position = "fixed";
        overlay.style.inset = "0";
        overlay.style.background = "rgba(0,0,0,0.5)";
        overlay.style.zIndex = "9999";

        const dialog = document.createElement("div");
        dialog.className = "compare-modal";
        // Announce this as a dialog named by its heading, and hide the page
        // behind it from assistive technology while it is open.
        dialog.setAttribute("role", "dialog");
        dialog.setAttribute("aria-modal", "true");
        dialog.setAttribute("aria-labelledby", titleId);
        dialog.tabIndex = -1;
        dialog.style.maxWidth = "720px";
        dialog.style.margin = "10vh auto";
        dialog.style.background = "#fff";
        dialog.style.borderRadius = "6px";
        dialog.style.boxShadow = "0 2px 12px rgba(0,0,0,0.3)";
        dialog.style.padding = "16px";

        const close = () => {
            document.removeEventListener("keydown", onKeydown, true);
            overlay.remove();
            // Put the user back where they were, not at the top of the page.
            if (previouslyFocused && previouslyFocused.focus) {
                previouslyFocused.focus();
            }
        };
        // Escape closes, and Tab cycles inside the dialog: ``aria-modal`` tells
        // a screen reader the rest of the page is inert, but does not keep the
        // keyboard from tabbing out into it.
        const onKeydown = (ev) => {
            if (ev.key === "Escape") {
                ev.preventDefault();
                close();
                return;
            }
            if (ev.key !== "Tab") {
                return;
            }
            const focusable = dialog.querySelectorAll(
                "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])",
            );
            if (!focusable.length) {
                return;
            }
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (ev.shiftKey && document.activeElement === first) {
                ev.preventDefault();
                last.focus();
            } else if (!ev.shiftKey && document.activeElement === last) {
                ev.preventDefault();
                first.focus();
            }
        };

        const header = document.createElement("div");
        const closeBtn = document.createElement("button");
        closeBtn.type = "button";
        // The glyph is decoration; the button needs a name that can be spoken.
        const closeGlyph = document.createElement("span");
        closeGlyph.setAttribute("aria-hidden", "true");
        closeGlyph.textContent = "\u00d7";
        closeBtn.appendChild(closeGlyph);
        closeBtn.setAttribute("aria-label", (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_1__.t)("msg_fitb_close"));
        closeBtn.style.float = "right";
        closeBtn.className = "btn btn-light";
        closeBtn.onclick = close;
        const title = document.createElement("h4");
        title.className = "modal-title";
        title.id = titleId;
        title.textContent = (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_1__.t)("msg_fitb_top_answers");
        header.appendChild(closeBtn);
        header.appendChild(title);

        const modalBody = document.createElement("div");
        modalBody.innerHTML = body;

        dialog.appendChild(header);
        dialog.appendChild(modalBody);
        overlay.appendChild(dialog);
        overlay.addEventListener("click", (ev) => {
            if (ev.target === overlay) {
                close();
            }
        });
        document.body.appendChild(overlay);
        document.addEventListener("keydown", onKeydown, true);
        dialog.focus();
    }

    disableInteraction() {
        for (var i = 0; i < this.blankArray.length; i++) {
            // Read-only rather than disabled: a disabled input is skipped by
            // the keyboard and by screen readers, so a student reviewing a
            // finished timed exam could no longer hear what they answered.
            this.blankArray[i].readOnly = true;
            this.blankArray[i].setAttribute("aria-disabled", "true");
        }
    }
}

/*=================================
== Find the custom HTML tags and ==
==   execute our code on them    ==
=================================*/
document.addEventListener("runestone:login-complete", function () {
    document
        .querySelectorAll("[data-component=fillintheblank]")
        .forEach(function (el, index) {
            var opts = {
                orig: el,
                useRunestoneServices: eBookConfig.useRunestoneServices,
            };
            if (!el.closest("[data-component=timedAssessment]")) {
                // If this element exists within a timed component, don't render it here
                try {
                    FITBList[el.id] = new FITB(opts);
                    window.componentMap[el.id] = FITBList[el.id];
                } catch (err) {
                    console.assert(
                        false,
                        `Error rendering Fill in the Blank Problem ${el.id}
                     Details: ${err}`,
                    );
                }
            }
        });
});


/***/ }),

/***/ 61529:
/*!************************************************!*\
  !*** ./runestone/fitb/js/fitb-i18n.sr-Cyrl.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/rsi18n.js */ 54250);


(0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.load)({
    "sr-Cyrl": {
        msg_no_answer: "Неодговорено.",
        msg_fitb_check_me: "Провери",
        msg_fitb_compare_me: "Упореди",
    },
});


/***/ }),

/***/ 84548:
/*!*****************************************!*\
  !*** ./runestone/fitb/js/fitb-utils.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   checkAnswersCore: () => (/* binding */ checkAnswersCore),
/* harmony export */   renderDynamicContent: () => (/* binding */ renderDynamicContent),
/* harmony export */   renderDynamicFeedback: () => (/* binding */ renderDynamicFeedback)
/* harmony export */ });
/* harmony import */ var _libs_aleaPRNG_1_1_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./libs/aleaPRNG-1.1.js */ 30923);
// ********************************************************
// |docname| - grading-related utilities for FITB questions
// ********************************************************
// This code runs both on the server (for server-side grading) and on the client. It's placed here as a set of functions specifically for this purpose.





// Includes
// ========
// None.
//
//
// Globals
// =======
function render_html(html_in, dyn_vars_eval) {
    // Change the replacement tokens in the HTML into tags, so we can replace them using XML. The horrible regex is:
    //
    // Look for the characters ``[%=`` (the opening delimiter)
    /// \[%=
    // Followed by any amount of whitespace.
    /// \s*
    // Start a group that will capture the contents (excluding whitespace) of the tokens. For example, given ``[%= foo() %]``, the contents is ``foo()``.
    /// (
    // Don't capture the contents of this group, since it's only a single character. Match any character...
    /// (
    /// ?:.
    /// ...that doesn't end with ``%]`` (the closing delimiter).
    /// (?!%])
    /// )
    // Match this (anything but the closing delimiter) as much as we can.
    /// *)
    // Next, look for any whitespace.
    /// \s*
    // Finally, look for the closing delimiter ``%]``.
    /// %\]
    const html_replaced = html_in.replaceAll(
        /\[%=\s*((?:.(?!%]))*)\s*%\]/g,
        // Replace it with a `<script-eval>` tag. Quote the string, which will automatically escape any double quotes, using JSON.
        (match, group1) =>
            `<script-eval expr=${JSON.stringify(group1)}></script-eval>`,
    );
    // Given HTML, turn it into a DOM. Walk the ``<script-eval>`` tags, performing the requested evaluation on them.
    //
    // See `DOMParser <https://developer.mozilla.org/en-US/docs/Web/API/DOMParser>`_.
    const parser = new DOMParser();
    // See `DOMParser.parseFromString() <https://developer.mozilla.org/en-US/docs/Web/API/DOMParser/parseFromString>`_.
    const doc = parser.parseFromString(html_replaced, "text/html");
    const script_eval_tags = doc.getElementsByTagName("script-eval");
    while (script_eval_tags.length) {
        // Get the first tag. It will be removed from the collection after it's replaced with its value.
        const script_eval_tag = script_eval_tags[0];
        // See if this ``<script-eval>`` tag has as ``@expr`` attribute.
        const expr = script_eval_tag.getAttribute("expr");
        // If so, evaluate it.
        if (expr) {
            const eval_result = window.Function(
                "v",
                ...Object.keys(dyn_vars_eval),
                `"use strict;"\nreturn ${expr};`,
            )(dyn_vars_eval, ...Object.values(dyn_vars_eval));
            // Replace the tag with the resulting value.
            script_eval_tag.replaceWith(eval_result);
        }
    }

    // Return the body contents. Note that the ``DOMParser`` constructs an entire document, not just the document fragment we passed it. Therefore, extract the desired fragment and return that. Note that we need to use `childNodes <https://developer.mozilla.org/en-US/docs/Web/API/Node/childNodes>`_, which includes non-element children like text and comments; using ``children`` omits these non-element children.
    return doc.body.childNodes;
}

// Functions
// =========
// Update the problem's description based on dynamically-generated content.
function renderDynamicContent(
    seed,
    dyn_vars,
    dyn_imports,
    html_in,
    divid,
    prepareCheckAnswers,
) {
    // Initialize RNG with ``seed``.
    const rand = (0,_libs_aleaPRNG_1_1_js__WEBPACK_IMPORTED_MODULE_0__.aleaPRNG)(seed);

    // See `RAND_FUNC <RAND_FUNC>`_, which refers to ``rand`` above.
    const dyn_vars_eval = window.Function(
        "v",
        "rand",
        ...Object.keys(dyn_imports),
        `"use strict";\n${dyn_vars};\nreturn v;`,
    )(
        // We want v.divid = divid and v.prepareCheckAnswers = prepareCheckAnswers. In contrast, the key/values pairs of dyn_imports should be directly assigned to v, hence the Object.assign.
        Object.assign({ divid, prepareCheckAnswers }, dyn_imports),
        rand,
        // In addition to providing this in v, make it available in the function as well, since most problem authors will write ``foo = new BTM()`` (for example, assuming BTM is in dyn_imports) instead of ``foo = new v.BTM()`` (which is unusual syntax).
        ...Object.values(dyn_imports),
    );

    let html_out;
    if (typeof dyn_vars_eval.beforeContentRender === "function") {
        try {
            dyn_vars_eval.beforeContentRender(dyn_vars_eval);
        } catch (err) {
            console.assert(
                false,
                `Error in problem ${divid} invoking beforeContentRender`,
            );
            throw err;
        }
    }
    try {
        html_out = render_html(html_in, dyn_vars_eval);
    } catch (err) {
        console.assert(false, `Error rendering problem ${divid} text.`);
        throw err;
    }

    // the afterContentRender event will be called by the caller of this function (after it updated the HTML based on the contents of html_out).
    return [html_out, dyn_vars_eval];
}

// Given student answers, grade them and provide feedback.
//
// Outputs:
//
// -    ``displayFeed`` is an array of HTML feedback.
// -    ``isCorrectArray`` is an array of true, false, or null (the question wasn't answered).
// -    ``correct`` is true, false, or null (the question wasn't answered).
// -    ``percent`` is the percentage of correct answers (from 0 to 1, not 0 to 100).
function checkAnswersCore(
    // _`blankNamesDict`: An dict of {blank_name, blank_index} specifying the name for each named blank.
    blankNamesDict,
    // _`given_arr`: An array of strings containing student-provided answers for each blank.
    given_arr,
    // A 2-D array of strings giving feedback for each blank.
    feedbackArray,
    // _`dyn_vars_eval`: A dict produced by evaluating the JavaScript for a dynamic exercise.
    dyn_vars_eval,
) {
    if (
        dyn_vars_eval &&
        typeof dyn_vars_eval.beforeCheckAnswers === "function"
    ) {
        const [namedBlankValues, given_arr_converted] = parseAnswers(
            blankNamesDict,
            given_arr,
            dyn_vars_eval,
        );
        const dve_blanks = Object.assign({}, dyn_vars_eval, namedBlankValues);
        try {
            dyn_vars_eval.beforeCheckAnswers(dve_blanks, given_arr_converted);
        } catch (err) {
            console.assert(false, "Error calling beforeCheckAnswers");
            throw err;
        }
    }

    // Keep track if all answers are correct or not.
    let correct = true;
    const isCorrectArray = [];
    const displayFeed = [];
    for (let i = 0; i < given_arr.length; i++) {
        const given = given_arr[i];
        // If this blank is empty, provide no feedback for it.
        if (given === "") {
            isCorrectArray.push(null);
            // TODO: should be localized, e.g. t("msg_no_answer").
            displayFeed.push("No answer provided.");
            correct = false;
        } else {
            // Look through all feedback for this blank. The last element in the array always matches. If no feedback for this blank exists, use an empty list.
            const fbl = feedbackArray[i] || [];
            let j;
            for (j = 0; j < fbl.length; j++) {
                // The last item of feedback always matches.
                if (j === fbl.length - 1) {
                    displayFeed.push(fbl[j]["feedback"]);
                    break;
                }
                // If this is a regexp...
                if ("regex" in fbl[j]) {
                    const patt = RegExp(fbl[j]["regex"], fbl[j]["regexFlags"]);
                    if (patt.test(given)) {
                        displayFeed.push(fbl[j]["feedback"]);
                        break;
                    }
                } else if ("number" in fbl[j]) {
                    // This is a number.
                    const [min, max] = fbl[j]["number"];
                    // Convert the given string to a number. While there are `lots of ways <https://coderwall.com/p/5tlhmw/converting-strings-to-number-in-javascript-pitfalls>`_ to do this; this version supports other bases (hex/binary/octal) as well as floats.
                    const actual = +given;
                    if (actual >= min && actual <= max) {
                        displayFeed.push(fbl[j]["feedback"]);
                        break;
                    }
                    // If this is a dynamic solution, they should provide a testing function
                } else if (dyn_vars_eval) {
                    const [namedBlankValues, given_arr_converted] =
                        parseAnswers(blankNamesDict, given_arr, dyn_vars_eval);
                    // If there was a parse error, then it student's answer is incorrect.
                    if (given_arr_converted[i] instanceof TypeError) {
                        displayFeed.push(given_arr_converted[i].message);
                        // Count this as wrong by making j != 0 -- see the code that runs immediately after the executing the break.
                        j = 1;
                        break;
                    }
                    // Create a function to wrap the expression to evaluate. See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/Function.
                    // Pass the answer, array of all answers, then all entries in ``this.dyn_vars_eval`` dict as function parameters.
                    const is_equal = window.Function(
                        "ans",
                        "ans_array",
                        ...Object.keys(dyn_vars_eval),
                        ...Object.keys(namedBlankValues),
                        `"use strict;"\nreturn ${fbl[j]["solution_code"]};`,
                    )(
                        given_arr_converted[i],
                        given_arr_converted,
                        ...Object.values(dyn_vars_eval),
                        ...Object.values(namedBlankValues),
                    );
                    // If student's answer is equal to this item, then append this item's feedback.
                    if (is_equal) {
                        displayFeed.push(
                            typeof is_equal === "string"
                                ? is_equal
                                : fbl[j]["feedback"],
                        );
                        break;
                    }
                    // If this is NOT a dynamic solution, but given a testing function
                } else if ("solution_code" in fbl[j]) {
                    // Create a function to wrap the expression to evaluate. See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/Function.
                    // Pass the answer, array of all answers, then all entries in ``this.dyn_vars_eval`` dict as function parameters.
                    const is_equal = window.Function(
                        "ans",
                        "ans_array",
                        `"use strict;"\nreturn ${fbl[j]["solution_code"]};`,
                    )(given, given_arr);
                    // If student's answer is equal to this item, then append this item's feedback.
                    if (is_equal) {
                        displayFeed.push(
                            typeof is_equal === "string"
                                ? is_equal
                                : fbl[j]["feedback"],
                        );
                        break;
                    }
                } else {
                    // Undefined method of testing.
                    console.assert("number" in fbl[j]);
                }
            }

            // The answer is correct if it matched the first element in the array. A special case: if only one answer is provided, count it wrong; this is a misformed problem.
            const is_correct = j === 0 && fbl.length > 1;
            isCorrectArray.push(is_correct);
            if (!is_correct) {
                correct = false;
            }
        }
    }

    if (
        dyn_vars_eval &&
        typeof dyn_vars_eval.afterCheckAnswers === "function"
    ) {
        const [namedBlankValues, given_arr_converted] = parseAnswers(
            blankNamesDict,
            given_arr,
            dyn_vars_eval,
        );
        const dve_blanks = Object.assign({}, dyn_vars_eval, namedBlankValues);
        try {
            dyn_vars_eval.afterCheckAnswers(dve_blanks, given_arr_converted);
        } catch (err) {
            console.assert(false, "Error calling afterCheckAnswers");
            throw err;
        }
    }

    const percent =
        isCorrectArray.filter(Boolean).length / isCorrectArray.length;
    return [displayFeed, correct, isCorrectArray, percent];
}

// Use the provided parsers to convert a student's answers (as strings) to the type produced by the parser for each blank.
function parseAnswers(
    // See blankNamesDict_.
    blankNamesDict,
    // See given_arr_.
    given_arr,
    // See `dyn_vars_eval`.
    dyn_vars_eval,
) {
    // Provide a dict of {blank_name, converter_answer_value}.
    const namedBlankValues = getNamedBlankValues(
        given_arr,
        blankNamesDict,
        dyn_vars_eval,
    );
    // Invert blankNamedDict: compute an array of [blank_0_name, ...]. Note that the array may be sparse: it only contains values for named blanks.
    const given_arr_names = [];
    for (const [k, v] of Object.entries(blankNamesDict)) {
        given_arr_names[v] = k;
    }
    // Compute an array of [converted_blank_0_val, ...]. Note that this re-converts all the values, rather than (possibly deep) copying the values from already-converted named blanks.
    const given_arr_converted = given_arr.map((value, index) =>
        type_convert(given_arr_names[index], value, index, dyn_vars_eval),
    );

    return [namedBlankValues, given_arr_converted];
}

// Render the feedback for a dynamic problem.
function renderDynamicFeedback(
    // See blankNamesDict_.
    blankNamesDict,
    // See given_arr_.
    given_arr,
    // The index of this blank in given_arr_.
    index,
    // The feedback for this blank, containing a template to be rendered.
    displayFeed_i,
    // See dyn_vars_eval_.
    dyn_vars_eval,
) {
    // Use the answer, an array of all answers, the value of all named blanks, and all solution variables for the template.
    const namedBlankValues = getNamedBlankValues(
        given_arr,
        blankNamesDict,
        dyn_vars_eval,
    );
    const sol_vars_plus = Object.assign(
        {
            ans: given_arr[index],
            ans_array: given_arr,
        },
        dyn_vars_eval,
        namedBlankValues,
    );
    try {
        displayFeed_i = render_html(displayFeed_i, sol_vars_plus);
    } catch (err) {
        console.assert(false, `Error evaluating feedback index ${index}.`);
        throw err;
    }

    return displayFeed_i;
}

// Utilities
// ---------
// For each named blank, get the value for the blank: the value of each ``blankName`` gives the index of the blank for that name.
function getNamedBlankValues(given_arr, blankNamesDict, dyn_vars_eval) {
    const namedBlankValues = {};
    for (const [blank_name, blank_index] of Object.entries(blankNamesDict)) {
        namedBlankValues[blank_name] = type_convert(
            blank_name,
            given_arr[blank_index],
            blank_index,
            dyn_vars_eval,
        );
    }
    return namedBlankValues;
}

// Convert a value given its type.
function type_convert(name, value, index, dyn_vars_eval) {
    // The converter can be defined by index, name, or by a single value (which applies to all blanks). If not provided, just pass the data through.
    const types = dyn_vars_eval.types || pass_through;
    const converter = types[name] || types[index] || types;
    // ES5 hack: it doesn't support binary values, and js2py doesn't allow me to override the ``Number`` class. So, define the workaround class ``Number_`` and use it if available.
    if (converter === Number && typeof Number_ !== "undefined") {
        converter = Number_;
    }

    // Return the converted type. If the converter raises a TypeError, return that; it will be displayed to the user, since we assume type errors are a way for the parser to explain to the user why the parse failed. For all other errors, re-throw it since something went wrong.
    try {
        return converter(value);
    } catch (err) {
        if (err instanceof TypeError) {
            return err;
        } else {
            throw err;
        }
    }
}

// A pass-through "converter".
function pass_through(val) {
    return val;
}


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG9GQUFvRjtBQUNwRjtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2ZpdGIvanMvdGltZWRmaXRiLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvZml0Yi9qcy9maXRiLWkxOG4ucHQtYnIuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9maXRiL2pzL2xpYnMvYWxlYVBSTkctMS4xLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvZml0Yi9qcy9maXRiLWkxOG4uZW4uanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9maXRiL2Nzcy9maXRiLmNzcz85ZWJkIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvZml0Yi9qcy9maXRiLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvZml0Yi9qcy9maXRiLWkxOG4uc3ItQ3lybC5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2ZpdGIvanMvZml0Yi11dGlscy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRklUQiBmcm9tIFwiLi9maXRiLmpzXCI7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaW1lZEZJVEIgZXh0ZW5kcyBGSVRCIHtcbiAgICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgICAgIHN1cGVyKG9wdHMpO1xuICAgICAgICB0aGlzLnJlbmRlclRpbWVkSWNvbih0aGlzLmlucHV0RGl2KTtcbiAgICAgICAgdGhpcy5oaWRlQnV0dG9ucygpO1xuICAgICAgICB0aGlzLm5lZWRzUmVpbml0aWFsaXphdGlvbiA9IHRydWU7XG4gICAgfVxuICAgIGhpZGVCdXR0b25zKCkge1xuICAgICAgICBpZiAodGhpcy5zdWJtaXRCdXR0b24pIHRoaXMuc3VibWl0QnV0dG9uLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgaWYgKHRoaXMuY29tcGFyZUJ1dHRvbikgdGhpcy5jb21wYXJlQnV0dG9uLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICB9XG4gICAgcmVuZGVyVGltZWRJY29uKGNvbXBvbmVudCkge1xuICAgICAgICAvLyByZW5kZXJzIHRoZSBjbG9jayBpY29uIG9uIHRpbWVkIGNvbXBvbmVudHMuICAgIFRoZSBjb21wb25lbnQgcGFyYW1ldGVyXG4gICAgICAgIC8vIGlzIHRoZSBlbGVtZW50IHRoYXQgdGhlIGljb24gc2hvdWxkIGJlIGFwcGVuZGVkIHRvLlxuICAgICAgICB2YXIgdGltZUljb25EaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB2YXIgdGltZUljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xuICAgICAgICB0aW1lSWNvbi5zcmMgPSBcIi4uL19zdGF0aWMvY2xvY2sucG5nXCI7XG4gICAgICAgIHRpbWVJY29uLnN0eWxlLndpZHRoID0gXCIxNXB4XCI7XG4gICAgICAgIHRpbWVJY29uLnN0eWxlLmhlaWdodCA9IFwiMTVweFwiO1xuICAgICAgICB0aW1lSWNvbkRpdi5jbGFzc05hbWUgPSBcInRpbWVUaXBcIjtcbiAgICAgICAgdGltZUljb25EaXYudGl0bGUgPSBcIlwiO1xuICAgICAgICB0aW1lSWNvbkRpdi5hcHBlbmRDaGlsZCh0aW1lSWNvbik7XG4gICAgICAgIGlmIChjb21wb25lbnQpIHtcbiAgICAgICAgICAgIGlmIChjb21wb25lbnQuZmlyc3RDaGlsZCkge1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5pbnNlcnRCZWZvcmUodGltZUljb25EaXYsIGNvbXBvbmVudC5maXJzdENoaWxkKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmFwcGVuZENoaWxkKHRpbWVJY29uRGl2KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBjaGVja0NvcnJlY3RUaW1lZCgpIHtcbiAgICAgICAgLy8gUmV0dXJucyBpZiB0aGUgcXVlc3Rpb24gd2FzIGNvcnJlY3QsIGluY29ycmVjdCwgb3Igc2tpcHBlZCAocmV0dXJuIG51bGwgaW4gdGhlIGxhc3QgY2FzZSlcbiAgICAgICAgc3dpdGNoICh0aGlzLmNvcnJlY3QpIHtcbiAgICAgICAgICAgIGNhc2UgdHJ1ZTpcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJUXCI7XG4gICAgICAgICAgICBjYXNlIGZhbHNlOlxuICAgICAgICAgICAgICAgIHJldHVybiBcIkZcIjtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaGlkZUZlZWRiYWNrKCkge1xuICAgICAgICAvLyBBbHNvIGRyb3BzIGVhY2ggYmxhbmsncyBhcmlhLWRlc2NyaWJlZGJ5OiBoaWRkZW4gdGV4dCBpcyBzdGlsbCByZWFkXG4gICAgICAgIC8vIG91dCB3aGVuIGEgZGVzY3JpcHRpb24gcG9pbnRzIGF0IGl0LCBzbyBsZWF2aW5nIHRoZSBsaW5rcyBpbiBwbGFjZVxuICAgICAgICAvLyB3b3VsZCBhbm5vdW5jZSBmZWVkYmFjayB0aGUgc3R1ZGVudCBpcyBub3Qgc3VwcG9zZWQgdG8gaGF2ZSB5ZXQuXG4gICAgICAgIHRoaXMuY2xlYXJCbGFua0ZlZWRiYWNrKCk7XG4gICAgICAgIHRoaXMuZmVlZEJhY2tEaXYuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgIH1cblxuICAgIHJlaW5pdGlhbGl6ZUxpc3RlbmVycygpIHtcbiAgICAgICAgdGhpcy5zZXR1cEJsYW5rcygpO1xuICAgIH1cbn1cblxuaWYgKHR5cGVvZiB3aW5kb3cuY29tcG9uZW50X2ZhY3RvcnkgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB3aW5kb3cuY29tcG9uZW50X2ZhY3RvcnkgPSB7fTtcbn1cbndpbmRvdy5jb21wb25lbnRfZmFjdG9yeS5maWxsaW50aGVibGFuayA9IGZ1bmN0aW9uIChvcHRzKSB7XG4gICAgaWYgKG9wdHMudGltZWQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBUaW1lZEZJVEIob3B0cyk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgRklUQihvcHRzKTtcbn07XG4iLCJpbXBvcnQgeyBsb2FkIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9qcy9yc2kxOG4uanNcIjtcblxubG9hZCh7XG4gICAgXCJwdC1iclwiOiB7XG4gICAgICAgIG1zZ19ub19hbnN3ZXI6IFwiTmVuaHVtYSByZXNwb3N0YSBkYWRhLlwiLFxuICAgICAgICBtc2dfZml0Yl9jaGVja19tZTogXCJWZXJpZmljYXJcIixcbiAgICAgICAgbXNnX2ZpdGJfY29tcGFyZV9tZTogXCJDb21wYXJhclwiXG4gICAgfSxcbn0pO1xuIiwiLyovLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbmFsZWFQUk5HIDEuMVxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuaHR0cHM6Ly9naXRodWIuY29tL21hY21jbWVhbnMvYWxlYVBSTkcvYmxvYi9tYXN0ZXIvYWxlYVBSTkctMS4xLmpzXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5PcmlnaW5hbCB3b3JrIGNvcHlyaWdodCDCqSAyMDEwIEpvaGFubmVzIEJhYWfDuGUsIHVuZGVyIE1JVCBsaWNlbnNlXHJcblRoaXMgaXMgYSBkZXJpdmF0aXZlIHdvcmsgY29weXJpZ2h0IChjKSAyMDE3LTIwMjAsIFcuIE1hY1wiIE1jTWVhbnMsIHVuZGVyIEJTRCBsaWNlbnNlLlxyXG5SZWRpc3RyaWJ1dGlvbiBhbmQgdXNlIGluIHNvdXJjZSBhbmQgYmluYXJ5IGZvcm1zLCB3aXRoIG9yIHdpdGhvdXQgbW9kaWZpY2F0aW9uLCBhcmUgcGVybWl0dGVkIHByb3ZpZGVkIHRoYXQgdGhlIGZvbGxvd2luZyBjb25kaXRpb25zIGFyZSBtZXQ6XHJcbjEuIFJlZGlzdHJpYnV0aW9ucyBvZiBzb3VyY2UgY29kZSBtdXN0IHJldGFpbiB0aGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSwgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lci5cclxuMi4gUmVkaXN0cmlidXRpb25zIGluIGJpbmFyeSBmb3JtIG11c3QgcmVwcm9kdWNlIHRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlLCB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyIGluIHRoZSBkb2N1bWVudGF0aW9uIGFuZC9vciBvdGhlciBtYXRlcmlhbHMgcHJvdmlkZWQgd2l0aCB0aGUgZGlzdHJpYnV0aW9uLlxyXG4zLiBOZWl0aGVyIHRoZSBuYW1lIG9mIHRoZSBjb3B5cmlnaHQgaG9sZGVyIG5vciB0aGUgbmFtZXMgb2YgaXRzIGNvbnRyaWJ1dG9ycyBtYXkgYmUgdXNlZCB0byBlbmRvcnNlIG9yIHByb21vdGUgcHJvZHVjdHMgZGVyaXZlZCBmcm9tIHRoaXMgc29mdHdhcmUgd2l0aG91dCBzcGVjaWZpYyBwcmlvciB3cml0dGVuIHBlcm1pc3Npb24uXHJcblRISVMgU09GVFdBUkUgSVMgUFJPVklERUQgQlkgVEhFIENPUFlSSUdIVCBIT0xERVJTIEFORCBDT05UUklCVVRPUlMgXCJBUyBJU1wiIEFORCBBTlkgRVhQUkVTUyBPUiBJTVBMSUVEIFdBUlJBTlRJRVMsIElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBUSEUgSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSBBTkQgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQVJFIERJU0NMQUlNRUQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBDT1BZUklHSFQgSE9MREVSIE9SIENPTlRSSUJVVE9SUyBCRSBMSUFCTEUgRk9SIEFOWSBESVJFQ1QsIElORElSRUNULCBJTkNJREVOVEFMLCBTUEVDSUFMLCBFWEVNUExBUlksIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyAoSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFBST0NVUkVNRU5UIE9GIFNVQlNUSVRVVEUgR09PRFMgT1IgU0VSVklDRVM7IExPU1MgT0YgVVNFLCBEQVRBLCBPUiBQUk9GSVRTOyBPUiBCVVNJTkVTUyBJTlRFUlJVUFRJT04pIEhPV0VWRVIgQ0FVU0VEIEFORCBPTiBBTlkgVEhFT1JZIE9GIExJQUJJTElUWSwgV0hFVEhFUiBJTiBDT05UUkFDVCwgU1RSSUNUIExJQUJJTElUWSwgT1IgVE9SVCAoSU5DTFVESU5HIE5FR0xJR0VOQ0UgT1IgT1RIRVJXSVNFKSBBUklTSU5HIElOIEFOWSBXQVkgT1VUIE9GIFRIRSBVU0UgT0YgVEhJUyBTT0ZUV0FSRSwgRVZFTiBJRiBBRFZJU0VEIE9GIFRIRSBQT1NTSUJJTElUWSBPRiBTVUNIIERBTUFHRS5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLyovXHJcbmV4cG9ydCBmdW5jdGlvbiBhbGVhUFJORygpIHtcclxuICAgIHJldHVybiggZnVuY3Rpb24oIGFyZ3MgKSB7XHJcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgICAgIGNvbnN0IHZlcnNpb24gPSAnYWxlYVBSTkcgMS4xLjAnO1xyXG5cclxuICAgICAgICB2YXIgczBcclxuICAgICAgICAgICAgLCBzMVxyXG4gICAgICAgICAgICAsIHMyXHJcbiAgICAgICAgICAgICwgY1xyXG4gICAgICAgICAgICAsIHVpbnRhID0gbmV3IFVpbnQzMkFycmF5KCAzIClcclxuICAgICAgICAgICAgLCBpbml0aWFsQXJnc1xyXG4gICAgICAgICAgICAsIG1hc2h2ZXIgPSAnJ1xyXG4gICAgICAgIDtcclxuXHJcbiAgICAgICAgLyogcHJpdmF0ZTogaW5pdGlhbGl6ZXMgZ2VuZXJhdG9yIHdpdGggc3BlY2lmaWVkIHNlZWQgKi9cclxuICAgICAgICBmdW5jdGlvbiBfaW5pdFN0YXRlKCBfaW50ZXJuYWxTZWVkICkge1xyXG4gICAgICAgICAgICB2YXIgbWFzaCA9IE1hc2goKTtcclxuXHJcbiAgICAgICAgICAgIC8vIGludGVybmFsIHN0YXRlIG9mIGdlbmVyYXRvclxyXG4gICAgICAgICAgICBzMCA9IG1hc2goICcgJyApO1xyXG4gICAgICAgICAgICBzMSA9IG1hc2goICcgJyApO1xyXG4gICAgICAgICAgICBzMiA9IG1hc2goICcgJyApO1xyXG5cclxuICAgICAgICAgICAgYyA9IDE7XHJcblxyXG4gICAgICAgICAgICBmb3IoIHZhciBpID0gMDsgaSA8IF9pbnRlcm5hbFNlZWQubGVuZ3RoOyBpKysgKSB7XHJcbiAgICAgICAgICAgICAgICBzMCAtPSBtYXNoKCBfaW50ZXJuYWxTZWVkWyBpIF0gKTtcclxuICAgICAgICAgICAgICAgIGlmKCBzMCA8IDAgKSB7IHMwICs9IDE7IH1cclxuXHJcbiAgICAgICAgICAgICAgICBzMSAtPSBtYXNoKCBfaW50ZXJuYWxTZWVkWyBpIF0gKTtcclxuICAgICAgICAgICAgICAgIGlmKCBzMSA8IDAgKSB7IHMxICs9IDE7IH1cclxuXHJcbiAgICAgICAgICAgICAgICBzMiAtPSBtYXNoKCBfaW50ZXJuYWxTZWVkWyBpIF0gKTtcclxuICAgICAgICAgICAgICAgIGlmKCBzMiA8IDAgKSB7IHMyICs9IDE7IH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbWFzaHZlciA9IG1hc2gudmVyc2lvbjtcclxuXHJcbiAgICAgICAgICAgIG1hc2ggPSBudWxsO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qIHByaXZhdGU6IGRlcGVuZGVudCBzdHJpbmcgaGFzaCBmdW5jdGlvbiAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIE1hc2goKSB7XHJcbiAgICAgICAgICAgIHZhciBuID0gNDAyMjg3MTE5NzsgLy8gMHhlZmM4MjQ5ZFxyXG5cclxuICAgICAgICAgICAgdmFyIG1hc2ggPSBmdW5jdGlvbiggZGF0YSApIHtcclxuICAgICAgICAgICAgICAgIGRhdGEgPSBkYXRhLnRvU3RyaW5nKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gY2FjaGUgdGhlIGxlbmd0aFxyXG4gICAgICAgICAgICAgICAgZm9yKCB2YXIgaSA9IDAsIGwgPSBkYXRhLmxlbmd0aDsgaSA8IGw7IGkrKyApIHtcclxuICAgICAgICAgICAgICAgICAgICBuICs9IGRhdGEuY2hhckNvZGVBdCggaSApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgaCA9IDAuMDI1MTk2MDMyODI0MTY5MzggKiBuO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBuICA9IGggPj4+IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgaCAtPSBuO1xyXG4gICAgICAgICAgICAgICAgICAgIGggKj0gbjtcclxuICAgICAgICAgICAgICAgICAgICBuICA9IGggPj4+IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgaCAtPSBuO1xyXG4gICAgICAgICAgICAgICAgICAgIG4gKz0gaCAqIDQyOTQ5NjcyOTY7IC8vIDB4MTAwMDAwMDAwICAgICAgMl4zMlxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuICggbiA+Pj4gMCApICogMi4zMjgzMDY0MzY1Mzg2OTYzZS0xMDsgLy8gMl4tMzJcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIG1hc2gudmVyc2lvbiA9ICdNYXNoIDAuOSc7XHJcbiAgICAgICAgICAgIHJldHVybiBtYXNoO1xyXG4gICAgICAgIH07XHJcblxyXG5cclxuICAgICAgICAvKiBwcml2YXRlOiBjaGVjayBpZiBudW1iZXIgaXMgaW50ZWdlciAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIF9pc0ludGVnZXIoIF9pbnQgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBwYXJzZUludCggX2ludCwgMTAgKSA9PT0gX2ludDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKiBwdWJsaWM6IHJldHVybiBhIDMyLWJpdCBmcmFjdGlvbiBpbiB0aGUgcmFuZ2UgWzAsIDFdXHJcbiAgICAgICAgVGhpcyBpcyB0aGUgbWFpbiBmdW5jdGlvbiByZXR1cm5lZCB3aGVuIGFsZWFQUk5HIGlzIGluc3RhbnRpYXRlZFxyXG4gICAgICAgICovXHJcbiAgICAgICAgdmFyIHJhbmRvbSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgdCA9IDIwOTE2MzkgKiBzMCArIGMgKiAyLjMyODMwNjQzNjUzODY5NjNlLTEwOyAvLyAyXi0zMlxyXG5cclxuICAgICAgICAgICAgczAgPSBzMTtcclxuICAgICAgICAgICAgczEgPSBzMjtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBzMiA9IHQgLSAoIGMgPSB0IHwgMCApO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qIHB1YmxpYzogcmV0dXJuIGEgNTMtYml0IGZyYWN0aW9uIGluIHRoZSByYW5nZSBbMCwgMV0gKi9cclxuICAgICAgICByYW5kb20uZnJhY3Q1MyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmFuZG9tKCkgKyAoIHJhbmRvbSgpICogMHgyMDAwMDAgIHwgMCApICogMS4xMTAyMjMwMjQ2MjUxNTY1ZS0xNjsgLy8gMl4tNTNcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKiBwdWJsaWM6IHJldHVybiBhbiB1bnNpZ25lZCBpbnRlZ2VyIGluIHRoZSByYW5nZSBbMCwgMl4zMl0gKi9cclxuICAgICAgICByYW5kb20uaW50MzIgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJhbmRvbSgpICogMHgxMDAwMDAwMDA7IC8vIDJeMzJcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKiBwdWJsaWM6IGFkdmFuY2UgdGhlIGdlbmVyYXRvciB0aGUgc3BlY2lmaWVkIGFtb3VudCBvZiBjeWNsZXMgKi9cclxuICAgICAgICByYW5kb20uY3ljbGUgPSBmdW5jdGlvbiggX3J1biApIHtcclxuICAgICAgICAgICAgX3J1biA9IHR5cGVvZiBfcnVuID09PSAndW5kZWZpbmVkJyA/IDEgOiArX3J1bjtcclxuICAgICAgICAgICAgaWYoIF9ydW4gPCAxICkgeyBfcnVuID0gMTsgfVxyXG4gICAgICAgICAgICBmb3IoIHZhciBpID0gMDsgaSA8IF9ydW47IGkrKyApIHsgcmFuZG9tKCk7IH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKiBwdWJsaWM6IHJldHVybiBpbmNsdXNpdmUgcmFuZ2UgKi9cclxuICAgICAgICByYW5kb20ucmFuZ2UgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIGxvQm91bmRcclxuICAgICAgICAgICAgICAgICwgaGlCb3VuZFxyXG4gICAgICAgICAgICA7XHJcblxyXG4gICAgICAgICAgICBpZiggYXJndW1lbnRzLmxlbmd0aCA9PT0gMSApIHtcclxuICAgICAgICAgICAgICAgIGxvQm91bmQgPSAwO1xyXG4gICAgICAgICAgICAgICAgaGlCb3VuZCA9IGFyZ3VtZW50c1sgMCBdO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxvQm91bmQgPSBhcmd1bWVudHNbIDAgXTtcclxuICAgICAgICAgICAgICAgIGhpQm91bmQgPSBhcmd1bWVudHNbIDEgXTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYoIGFyZ3VtZW50c1sgMCBdID4gYXJndW1lbnRzWyAxIF0gKSB7XHJcbiAgICAgICAgICAgICAgICBsb0JvdW5kID0gYXJndW1lbnRzWyAxIF07XHJcbiAgICAgICAgICAgICAgICBoaUJvdW5kID0gYXJndW1lbnRzWyAwIF07XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIHJldHVybiBpbnRlZ2VyXHJcbiAgICAgICAgICAgIGlmKCBfaXNJbnRlZ2VyKCBsb0JvdW5kICkgJiYgX2lzSW50ZWdlciggaGlCb3VuZCApICkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoIHJhbmRvbSgpICogKCBoaUJvdW5kIC0gbG9Cb3VuZCArIDEgKSApICsgbG9Cb3VuZDtcclxuXHJcbiAgICAgICAgICAgIC8vIHJldHVybiBmbG9hdFxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJhbmRvbSgpICogKCBoaUJvdW5kIC0gbG9Cb3VuZCApICsgbG9Cb3VuZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qIHB1YmxpYzogaW5pdGlhbGl6ZSBnZW5lcmF0b3Igd2l0aCB0aGUgc2VlZCB2YWx1ZXMgdXNlZCB1cG9uIGluc3RhbnRpYXRpb24gKi9cclxuICAgICAgICByYW5kb20ucmVzdGFydCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBfaW5pdFN0YXRlKCBpbml0aWFsQXJncyApO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qIHB1YmxpYzogc2VlZGluZyBmdW5jdGlvbiAqL1xyXG4gICAgICAgIHJhbmRvbS5zZWVkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIF9pbml0U3RhdGUoIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKCBhcmd1bWVudHMgKSApO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qIHB1YmxpYzogc2hvdyB0aGUgdmVyc2lvbiBvZiB0aGUgUk5HICovXHJcbiAgICAgICAgcmFuZG9tLnZlcnNpb24gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHZlcnNpb247XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyogcHVibGljOiBzaG93IHRoZSB2ZXJzaW9uIG9mIHRoZSBSTkcgYW5kIHRoZSBNYXNoIHN0cmluZyBoYXNoZXIgKi9cclxuICAgICAgICByYW5kb20udmVyc2lvbnMgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHZlcnNpb24gKyAnLCAnICsgbWFzaHZlcjtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyB3aGVuIG5vIHNlZWQgaXMgc3BlY2lmaWVkLCBjcmVhdGUgYSByYW5kb20gb25lIGZyb20gV2luZG93cyBDcnlwdG8gKE1vbnRlIENhcmxvIGFwcGxpY2F0aW9uKVxyXG4gICAgICAgIGlmKCBhcmdzLmxlbmd0aCA9PT0gMCApIHtcclxuICAgICAgICAgICAgIHdpbmRvdy5jcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKCB1aW50YSApO1xyXG4gICAgICAgICAgICAgYXJncyA9IFsgdWludGFbIDAgXSwgdWludGFbIDEgXSwgdWludGFbIDIgXSBdO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vIHN0b3JlIHRoZSBzZWVkIHVzZWQgd2hlbiB0aGUgUk5HIHdhcyBpbnN0YW50aWF0ZWQsIGlmIGFueVxyXG4gICAgICAgIGluaXRpYWxBcmdzID0gYXJncztcclxuXHJcbiAgICAgICAgLy8gaW5pdGlhbGl6ZSB0aGUgUk5HXHJcbiAgICAgICAgX2luaXRTdGF0ZSggYXJncyApO1xyXG5cclxuICAgICAgICByZXR1cm4gcmFuZG9tO1xyXG5cclxuICAgIH0pKCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggYXJndW1lbnRzICkgKTtcclxufTsiLCJpbXBvcnQgeyBsb2FkIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9qcy9yc2kxOG4uanNcIjtcblxubG9hZCh7XG4gICAgZW46IHtcbiAgICAgICAgbXNnX25vX2Fuc3dlcjogXCJObyBhbnN3ZXIgcHJvdmlkZWQuXCIsXG4gICAgICAgIG1zZ19maXRiX2NoZWNrX21lOiBcIkNoZWNrIG1lXCIsXG4gICAgICAgIG1zZ19maXRiX2NvbXBhcmVfbWU6IFwiQ29tcGFyZSBtZVwiLFxuICAgICAgICBtc2dfZml0Yl9yYW5kb21pemU6IFwiUmFuZG9taXplXCIsXG4gICAgICAgIC8vIEFjY2Vzc2libGUgbmFtZXMuIEEgc2NyZWVuIHJlYWRlciByZWFkcyBvbmx5IGEgZmllbGQncyBvd24gbmFtZSB3aGVuXG4gICAgICAgIC8vIGZvY3VzIGxhbmRzIG9uIGl0LCBzbyB0aGUgcHJvbXB0IGhhcyB0byB0cmF2ZWwgd2l0aCB0aGUgYmxhbmsuXG4gICAgICAgIC8vICQxID0gYmxhbmsgbnVtYmVyLCAkMiA9IG51bWJlciBvZiBibGFua3MsICQzID0gdGhlIHByb21wdCB0ZXh0LlxuICAgICAgICBtc2dfZml0Yl9ibGFua19sYWJlbDogXCJCbGFuayAkMSBvZiAkMi4gJDNcIixcbiAgICAgICAgLy8gJDEgPSB0aGUgcHJvbXB0IHRleHQuXG4gICAgICAgIG1zZ19maXRiX2JsYW5rX2xhYmVsX3NpbmdsZTogXCJGaWxsIGluIHRoZSBibGFuay4gJDFcIixcbiAgICAgICAgLy8gVXNlZCB3aGVuIHRoZSBwcm9tcHQgaGFzIG5vIHRleHQgdG8gcmVhZCwgZS5nLiBhbiBpbWFnZS1vbmx5IHByb2JsZW0uXG4gICAgICAgIG1zZ19maXRiX2JsYW5rX2ZhbGxiYWNrOiBcIkJsYW5rICQxIG9mICQyXCIsXG4gICAgICAgIG1zZ19maXRiX2JsYW5rX2ZhbGxiYWNrX3NpbmdsZTogXCJGaWxsIGluIHRoZSBibGFua1wiLFxuICAgICAgICAvLyBIb3cgYSBibGFuayBpcyBzcG9rZW4gd2hlcmUgaXQgYXBwZWFycyBpbiB0aGUgcHJvbXB0IHRleHQuICQxID0gaXRzXG4gICAgICAgIC8vIG51bWJlci5cbiAgICAgICAgbXNnX2ZpdGJfYmxhbmtfbjogXCJibGFuayAkMVwiLFxuICAgICAgICBtc2dfZml0Yl9ncm91cF9sYWJlbDogXCJGaWxsIGluIHRoZSBibGFuayBxdWVzdGlvblwiLFxuICAgICAgICAvLyAkMSA9IHRoZSBxdWVzdGlvbiBudW1iZXIgc2hvd24gaW4gdGhlIGNhcHRpb24uXG4gICAgICAgIG1zZ19maXRiX2dyb3VwX2xhYmVsX251bWJlcmVkOiBcIkZpbGwgaW4gdGhlIGJsYW5rIHF1ZXN0aW9uICQxXCIsXG4gICAgICAgIG1zZ19maXRiX2NvcnJlY3Q6IFwiQ29ycmVjdDpcIixcbiAgICAgICAgbXNnX2ZpdGJfaW5jb3JyZWN0OiBcIkluY29ycmVjdDpcIixcbiAgICAgICAgbXNnX2ZpdGJfcmVzdWx0X2NvcnJlY3Q6IFwiQWxsIGJsYW5rcyBjb3JyZWN0LlwiLFxuICAgICAgICBtc2dfZml0Yl9yZXN1bHRfaW5jb3JyZWN0OiBcIlNvbWUgYmxhbmtzIGFyZSBpbmNvcnJlY3QuXCIsXG4gICAgICAgIG1zZ19maXRiX3RvcF9hbnN3ZXJzOiBcIlRvcCBBbnN3ZXJzXCIsXG4gICAgICAgIG1zZ19maXRiX2Nsb3NlOiBcIkNsb3NlXCIsXG4gICAgfSxcbn0pO1xuIiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vIHxkb2NuYW1lfCAtLSBmaWxsLWluLXRoZS1ibGFuayBjbGllbnQtc2lkZSBjb2RlXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy8gVGhpcyBmaWxlIGNvbnRhaW5zIHRoZSBKUyBmb3IgdGhlIFJ1bmVzdG9uZSBmaWxsaW50aGVibGFuayBjb21wb25lbnQuIEl0IHdhcyBjcmVhdGVkIEJ5IElzYWlhaCBNYXllcmNoYWsgYW5kIEtpcmJ5IE9sc29uLCA2LzQvMTUgdGhlbiByZXZpc2VkIGJ5IEJyYWQgTWlsbGVyLCAyLzcvMjAuXG4vL1xuLy8gRGF0YSBzdG9yYWdlIG5vdGVzXG4vLyA9PT09PT09PT09PT09PT09PT1cbi8vXG4vLyBJbml0aWFsIHByb2JsZW0gcmVzdG9yZVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEluIHRoZSBjb25zdHJ1Y3RvciwgdGhpcyBjb2RlICh0aGUgY2xpZW50KSByZXN0b3JlcyB0aGUgcHJvYmxlbSBieSBjYWxsaW5nIGBgY2hlY2tTZXJ2ZXJgYC4gVG8gZG8gc28sIGVpdGhlciB0aGUgc2VydmVyIHNlbmRzIG9yIGxvY2FsIHN0b3JhZ2UgaGFzOlxuLy9cbi8vIC0gICAgc2VlZCAodXNlZCBvbmx5IGZvciBkeW5hbWljIHByb2JsZW1zKVxuLy8gLSAgICBhbnN3ZXJcbi8vIC0gICAgZGlzcGxheUZlZWQgKHNlcnZlci1zaWRlIGdyYWRpbmcgb25seTsgb3RoZXJ3aXNlLCB0aGlzIGlzIGdlbmVyYXRlZCBsb2NhbGx5IGJ5IGNsaWVudCBjb2RlKVxuLy8gLSAgICBjb3JyZWN0IChTU0cpXG4vLyAtICAgIGlzQ29ycmVjdEFycmF5IChTU0cpXG4vLyAtICAgIHByb2JsZW1IdG1sIChTU0cgd2l0aCBkeW5hbWljIHByb2JsZW1zIG9ubHkpXG4vL1xuLy8gSWYgYW55IG9mIHRoZSBhbnN3ZXJzIGFyZSBjb3JyZWN0LCB0aGVuIHRoZSBjbGllbnQgc2hvd3MgZmVlZGJhY2suIFRoaXMgaXMgaW1wbGVtZW50ZWQgaW4gcmVzdG9yZUFuc3dlcnNfLlxuLy9cbi8vIEdyYWRpbmdcbi8vIC0tLS0tLS1cbi8vIFdoZW4gdGhlIHVzZXIgcHJlc3NlcyB0aGUgXCJDaGVjayBtZVwiIGJ1dHRvbiwgdGhlIGxvZ0N1cnJlbnRBbnN3ZXJfIGZ1bmN0aW9uOlxuLy9cbi8vIC0gICAgU2F2ZXMgdGhlIGZvbGxvd2luZyB0byBsb2NhbCBzdG9yYWdlOlxuLy9cbi8vICAgICAgLSAgIHNlZWRcbi8vICAgICAgLSAgIGFuc3dlclxuLy8gICAgICAtICAgdGltZXN0YW1wXG4vLyAgICAgIC0gICBwcm9ibGVtSHRtbFxuLy9cbi8vICAgICAgTm90ZSB0aGF0IHRoZXJlJ3Mgbm8gcG9pbnQgaW4gc2F2aW5nIGRpc3BsYXlGZWVkLCBjb3JyZWN0LCBvciBpc0NvcnJlY3RBcnJheSwgc2luY2UgdGhlc2UgdmFsdWVzIGFwcGxpZWQgdG8gdGhlIHByZXZpb3VzIGFuc3dlciwgbm90IHRoZSBuZXcgYW5zd2VyIGp1c3Qgc3VibWl0dGVkLlxuLy9cbi8vIC0gICAgU2VuZHMgdGhlIGZvbGxvd2luZyB0byB0aGUgc2VydmVyOyBzdG9wIGFmdGVyIHRoaXMgZm9yIGNsaWVudC1zaWRlIGdyYWRpbmc6XG4vL1xuLy8gICAgICAtICAgc2VlZCAoaWdub3JlZCBmb3Igc2VydmVyLXNpZGUgZ3JhZGluZylcbi8vICAgICAgLSAgIGFuc3dlclxuLy8gICAgICAtICAgY29ycmVjdCAoaWdub3JlZCBmb3IgU1NHKVxuLy8gICAgICAtICAgcGVyY2VudCAoaWdub3JlZCBmb3IgU1NHKVxuLy9cbi8vIC0gICAgUmVjZWl2ZXMgdGhlIGZvbGxvd2luZyBmcm9tIHRoZSBzZXJ2ZXI6XG4vL1xuLy8gICAgICAtICAgdGltZXN0YW1wXG4vLyAgICAgIC0gICBkaXNwbGF5RmVlZFxuLy8gICAgICAtICAgY29ycmVjdFxuLy8gICAgICAtICAgaXNDb3JyZWN0QXJyYXlcbi8vXG4vLyAtICAgIFNhdmVzIHRoZSBmb2xsb3dpbmcgdG8gbG9jYWwgc3RvcmFnZTpcbi8vXG4vLyAgICAgIC0gICBzZWVkXG4vLyAgICAgIC0gICBhbnN3ZXJcbi8vICAgICAgLSAgIHRpbWVzdGFtcFxuLy8gICAgICAtICAgZGlzcGxheUZlZWQgKFNTRyBvbmx5KVxuLy8gICAgICAtICAgY29ycmVjdCAoU1NHIG9ubHkpXG4vLyAgICAgIC0gICBpc0NvcnJlY3RBcnJheSAoU1NHIG9ubHkpXG4vLyAgICAgIC0gICBwcm9ibGVtSHRtbFxuLy9cbi8vIFJhbmRvbWl6ZVxuLy8gLS0tLS0tLS0tXG4vLyBXaGVuIHRoZSB1c2VyIHByZXNzZXMgdGhlIFwiUmFuZG9taXplXCIgYnV0dG9uICh3aGljaCBpcyBvbmx5IGF2YWlsYWJsZSBmb3IgZHluYW1pYyBwcm9ibGVtcyksIHRoZSByYW5kb21pemVfIGZ1bmN0aW9uOlxuLy9cbi8vIC0gICAgRm9yIHRoZSBjbGllbnQtc2lkZSBjYXNlLCBzZXRzIHRoZSBzZWVkIHRvIGEgbmV3LCByYW5kb20gdmFsdWUuIEZvciB0aGUgc2VydmVyLXNpZGUgY2FzZSwgcmVxdWVzdHMgYSBuZXcgc2VlZCBhbmQgcHJvYmxlbUh0bWwgZnJvbSB0aGUgc2VydmVyLlxuLy8gLSAgICBTZXRzIHRoZSBhbnN3ZXIgdG8gYW4gYXJyYXkgb2YgZW1wdHkgc3RyaW5ncy5cbi8vIC0gICAgU2F2ZXMgdGhlIHVzdWFsIGxvY2FsIGRhdGEuXG5cblwidXNlIHN0cmljdFwiO1xuXG5pbXBvcnQgUnVuZXN0b25lQmFzZSBmcm9tIFwiLi4vLi4vY29tbW9uL2pzL3J1bmVzdG9uZWJhc2UuanNcIjtcbmltcG9ydCB7IHQgfSBmcm9tIFwiLi4vLi4vY29tbW9uL2pzL3JzaTE4bi5qc1wiO1xuaW1wb3J0IHtcbiAgICByZW5kZXJEeW5hbWljQ29udGVudCxcbiAgICBjaGVja0Fuc3dlcnNDb3JlLFxuICAgIHJlbmRlckR5bmFtaWNGZWVkYmFjayxcbn0gZnJvbSBcIi4vZml0Yi11dGlscy5qc1wiO1xuaW1wb3J0IFwiLi9maXRiLWkxOG4uZW4uanNcIjtcbmltcG9ydCBcIi4vZml0Yi1pMThuLnB0LWJyLmpzXCI7XG5pbXBvcnQgXCIuL2ZpdGItaTE4bi5zci1DeXJsLmpzXCI7XG5pbXBvcnQgXCIuLi9jc3MvZml0Yi5jc3NcIjtcblxuLy8gT2JqZWN0IGNvbnRhaW5pbmcgYWxsIGluc3RhbmNlcyBvZiBGSVRCIHRoYXQgYXJlbid0IGEgY2hpbGQgb2YgYSB0aW1lZCBhc3Nlc3NtZW50LlxuZXhwb3J0IHZhciBGSVRCTGlzdCA9IHt9O1xuXG4vLyBGSVRCIGNvbnN0cnVjdG9yXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGSVRCIGV4dGVuZHMgUnVuZXN0b25lQmFzZSB7XG4gICAgY29uc3RydWN0b3Iob3B0cykge1xuICAgICAgICBzdXBlcihvcHRzKTtcbiAgICAgICAgdmFyIG9yaWcgPSBvcHRzLm9yaWc7IC8vIGVudGlyZSA8cD4gZWxlbWVudFxuICAgICAgICB0aGlzLnVzZVJ1bmVzdG9uZVNlcnZpY2VzID0gb3B0cy51c2VSdW5lc3RvbmVTZXJ2aWNlcztcbiAgICAgICAgdGhpcy5vcmlnRWxlbSA9IG9yaWc7XG4gICAgICAgIHRoaXMuZGl2aWQgPSBvcmlnLmlkO1xuICAgICAgICB0aGlzLmNvcnJlY3QgPSBudWxsO1xuICAgICAgICAvLyBTZWUgY29tbWVudHMgaW4gZml0Yi5weSBmb3IgdGhlIGZvcm1hdCBvZiBgYGZlZWRiYWNrQXJyYXlgYCAod2hpY2ggaXMgaWRlbnRpY2FsIGluIGJvdGggZmlsZXMpLlxuICAgICAgICAvL1xuICAgICAgICAvLyBGaW5kIHRoZSBzY3JpcHQgdGFnIGNvbnRhaW5pbmcgSlNPTiBhbmQgcGFyc2UgaXQuIFNlZSBgU08gPGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzkzMjA0MjcvYmVzdC1wcmFjdGljZS1mb3ItZW1iZWRkaW5nLWFyYml0cmFyeS1qc29uLWluLXRoZS1kb20+YF9fLiBJZiB0aGlzIHRhZyBkb2Vzbid0IGV4aXN0LCB0aGVuIG5vIGZlZWRiYWNrIGlzIGF2YWlsYWJsZTsgc2VydmVyLXNpZGUgZ3JhZGluZyB3aWxsIGJlIHBlcmZvcm1lZC5cbiAgICAgICAgLy9cbiAgICAgICAgLy8gQSBkZXN0cnVjdHVyaW5nIGFzc2lnbm1lbnQgd291bGQgYmUgcGVyZmVjdCwgYnV0IHRoZXkgZG9uJ3Qgd29yayB3aXRoIGBgdGhpcy5ibGFoYGAgYW5kIGBgd2l0aGBgIHN0YXRlbWVudHMgYXJlbid0IHN1cHBvcnRlZCBpbiBzdHJpY3QgbW9kZS5cbiAgICAgICAgY29uc3QganNvbl9lbGVtZW50ID0gdGhpcy5zY3JpcHRTZWxlY3Rvcih0aGlzLm9yaWdFbGVtKTtcbiAgICAgICAgY29uc3QgZGljdF8gPSBKU09OLnBhcnNlKGpzb25fZWxlbWVudC50ZXh0Q29udGVudCk7XG4gICAgICAgIGpzb25fZWxlbWVudC5yZW1vdmUoKTtcbiAgICAgICAgLy8gQ2hlY2sgZm9yIG9sZGVyIHZlcnNpb25zIHRoYXQgaGF2ZSByYXcgaHRtbCBjb250ZW50LlxuICAgICAgICBpZiAoZGljdF8ucHJvYmxlbUh0bWwgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgLy8gaWYgZGljdF8ucHJvYmxlbUh0bWwgc3RhcnRzIHdpdGggJmx0OyB0aGVuIHVuZXNjYXBlIGl0IHRoaXMgaGFwcGVucyBmb3IgcHJldmlld3NcbiAgICAgICAgICAgIC8vIHdoZW4gdGhlIHByb2JsZW0gY29tZXMgZnJvbSB0aGUgREJcbiAgICAgICAgICAgIGlmIChkaWN0Xy5wcm9ibGVtSHRtbC5zdGFydHNXaXRoKFwiJmx0O1wiKSkge1xuICAgICAgICAgICAgICAgIGRpY3RfLnByb2JsZW1IdG1sID0gZGljdF8ucHJvYmxlbUh0bWxcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLyZsdDsvZywgXCI8XCIpXG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8mZ3Q7L2csIFwiPlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChlQm9va0NvbmZpZy51c2VSdW5lc3RvbmVTZXJ2aWNlcykge1xuICAgICAgICAgICAgICAgIGRpY3RfLnByb2JsZW1IdG1sID0gZGljdF8ucHJvYmxlbUh0bWwucmVwbGFjZShcbiAgICAgICAgICAgICAgICAgICAgL3NyYz1cImV4dGVybmFsL2csXG4gICAgICAgICAgICAgICAgICAgICdzcmM9XCInICtcbiAgICAgICAgICAgICAgICAgICAgICAgIGAvbnMvYm9va3MvcHVibGlzaGVkLyR7ZUJvb2tDb25maWcuYmFzZWNvdXJzZX1gICtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiL2V4dGVybmFsXCIsXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5wcm9ibGVtSHRtbCA9IGRpY3RfLnByb2JsZW1IdG1sO1xuICAgICAgICAgICAgdGhpcy5keW5fdmFycyA9IGRpY3RfLmR5bl92YXJzO1xuICAgICAgICAgICAgdGhpcy5ibGFua05hbWVzID0gZGljdF8uYmxhbmtOYW1lcztcbiAgICAgICAgICAgIHRoaXMuZmVlZGJhY2tBcnJheSA9IGRpY3RfLmZlZWRiYWNrQXJyYXk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnByb2JsZW1IdG1sID0gdGhpcy5vcmlnRWxlbS5pbm5lckhUTUw7XG4gICAgICAgICAgICB0aGlzLmZlZWRiYWNrQXJyYXkgPSBkaWN0XztcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY3JlYXRlRklUQkVsZW1lbnQoKTtcbiAgICAgICAgdGhpcy5zZXR1cEJsYW5rcygpO1xuICAgICAgICB0aGlzLmNhcHRpb24gPSBcIkZpbGwgaW4gdGhlIEJsYW5rXCI7XG4gICAgICAgIHRoaXMuYWRkQ2FwdGlvbihcInJ1bmVzdG9uZVwiKTtcbiAgICAgICAgdGhpcy5zZXRHcm91cExhYmVsKCk7XG5cbiAgICAgICAgLy8gRGVmaW5lIGEgcHJvbWlzZSB3aGljaCBpbXBvcnRzIGFueSBsaWJyYXJpZXMgbmVlZGVkIGJ5IGR5bmFtaWMgcHJvYmxlbXMuXG4gICAgICAgIHRoaXMuZHluX2ltcG9ydHMgPSB7fTtcbiAgICAgICAgbGV0IGltcG9ydHNfcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICBpZiAoZGljdF8uZHluX2ltcG9ydHMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgLy8gQ29sbGVjdCBhbGwgaW1wb3J0IHByb21pc2VzLlxuICAgICAgICAgICAgbGV0IGltcG9ydF9wcm9taXNlcyA9IFtdO1xuICAgICAgICAgICAgZm9yIChjb25zdCBpbXBvcnRfIG9mIGRpY3RfLmR5bl9pbXBvcnRzKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChpbXBvcnRfKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEZvciBpbXBvcnRzIGtub3duIGF0IHdlYnBhY2sgYnVpbGQsIGJyaW5nIHRoZXNlIGluLlxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiQlRNXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICBpbXBvcnRfcHJvbWlzZXMucHVzaChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbXBvcnQoXCJidG0tZXhwcmVzc2lvbnMvc3JjL0JUTV9yb290LmpzXCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAvLyBBbGxvdyBmb3IgbG9jYWwgaW1wb3J0cywgdXN1YWxseSBmcm9tIHByb2JsZW1zIGRlZmluZWQgb3V0c2lkZSB0aGUgUnVuZXN0b25lIENvbXBvbmVudHMuXG4gICAgICAgICAgICAgICAgICAgIC8vIFJlbGF0aXZlIFVSTCBzaG91bGQgYmUgcmVsYXRpdmUgdG8gZG9jdW1lbnQgYmFzZSwgbm90IHRoaXMgbGlicmFyeVxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYWJzb2x1dGVVcmwgPSBuZXcgVVJMKGltcG9ydF8sIGRvY3VtZW50LmJhc2VVUkkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmhyZWY7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbXBvcnRfcHJvbWlzZXMucHVzaChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbXBvcnQoLyogd2VicGFja0lnbm9yZTogdHJ1ZSAqLyBhYnNvbHV0ZVVybCksXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBDb21iaW5lIHRoZSByZXN1bHRpbmcgbW9kdWxlIG5hbWVzcGFjZSBvYmplY3RzIHdoZW4gdGhlc2UgcHJvbWlzZXMgcmVzb2x2ZS5cbiAgICAgICAgICAgIGltcG9ydHNfcHJvbWlzZSA9IFByb21pc2UuYWxsKGltcG9ydF9wcm9taXNlcylcbiAgICAgICAgICAgICAgICAudGhlbihcbiAgICAgICAgICAgICAgICAgICAgKG1vZHVsZV9uYW1lc3BhY2VfYXJyKSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgKHRoaXMuZHluX2ltcG9ydHMgPSBPYmplY3QuYXNzaWduKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLm1vZHVsZV9uYW1lc3BhY2VfYXJyLFxuICAgICAgICAgICAgICAgICAgICAgICAgKSksXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IGBGYWlsZWQgZHluYW1pYyBpbXBvcnQ6ICR7ZXJyfS5gO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmVzb2x2ZSB0aGVzZSBwcm9taXNlcy5cbiAgICAgICAgaW1wb3J0c19wcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jaGVja1NlcnZlcihcImZpbGxiXCIsIGZhbHNlKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBPbmUgb3B0aW9uIGZvciBhIGR5bmFtaWMgcHJvYmxlbSBpcyB0byBwcm9kdWNlIGEgc3RhdGljIHByb2JsZW0gYnkgcHJvdmlkaW5nIGEgZml4ZWQgc2VlZCB2YWx1ZS4gVGhpcyBpcyB0eXBpY2FsbHkgdXNlZCB3aGVuIHRoZSBnb2FsIGlzIHRvIHJlbmRlciB0aGUgcHJvYmxlbSBhcyBhbiBpbWFnZSBmb3IgaW5jbHVzaW9uIGluIHN0YXRpYyBjb250ZW50IChhIFBERiwgZXRjLikuIFRvIHN1cHBvcnQgdGhpcywgY29uc2lkZXIgdGhlIGZvbGxvd2luZyBjYXNlczpcbiAgICAgICAgICAgICAgICAvL1xuICAgICAgICAgICAgICAgIC8vLyBDYXNlICBIYXMgc3RhdGljIHNlZWQ/ICBJcyBhIGNsaWVudC1zaWRlLCBkeW5hbWljIHByb2JsZW0/ICBIYXMgbG9jYWwgc2VlZD8gIFJlc3VsdFxuICAgICAgICAgICAgICAgIC8vLyAwICAgICBObyAgICAgICAgICAgICAgICBObyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBYICAgICAgICAgICAgICAgIE5vIGFjdGlvbiBuZWVkZWQuXG4gICAgICAgICAgICAgICAgLy8vIDEgICAgIE5vICAgICAgICAgICAgICAgIFllcyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE5vICAgICAgICAgICAgICAgdGhpcy5yYW5kb21pemUoKS5cbiAgICAgICAgICAgICAgICAvLy8gMiAgICAgTm8gICAgICAgICAgICAgICAgWWVzICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgWWVzICAgICAgICAgICAgICBObyBhY3Rpb24gbmVlZGVkIC0tIHByb2JsZW0gYWxyZWFkeSByZXN0b3JlZCBmcm9tIGxvY2FsIHN0b3JhZ2UuXG4gICAgICAgICAgICAgICAgLy8vIDMgICAgIFllcyAgICAgICAgICAgICAgIE5vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFggICAgICAgICAgICAgICAgV2FybmluZzogc2VlZCBpZ25vcmVkLlxuICAgICAgICAgICAgICAgIC8vLyA0ICAgICBZZXMgICAgICAgICAgICAgICBZZXMgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBObyAgICAgICAgICAgICAgIEFzc2lnbiBzZWVkOyB0aGlzLnJlbmRlckR5bmFtaWNDb250ZW50KCkuXG4gICAgICAgICAgICAgICAgLy8vIDUgICAgIFllcyAgICAgICAgICAgICAgIFllcyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFllcyAgICAgICAgICAgICAgSWYgc2VlZHMgZGlmZmVyLCBpc3N1ZSB3YXJuaW5nLiBObyBhZGRpdGlvbmFsIGFjdGlvbiBuZWVkZWQgLS0gcHJvYmxlbSBhbHJlYWR5IHJlc3RvcmVkIGZyb20gbG9jYWwgc3RvcmFnZS5cblxuICAgICAgICAgICAgICAgIGNvbnN0IGhhc19zdGF0aWNfc2VlZCA9IGRpY3RfLnN0YXRpY19zZWVkICE9PSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgY29uc3QgaXNfY2xpZW50X2R5bmFtaWMgPSB0eXBlb2YgdGhpcy5keW5fdmFycyA9PT0gXCJzdHJpbmdcIjtcbiAgICAgICAgICAgICAgICBjb25zdCBoYXNfbG9jYWxfc2VlZCA9IHRoaXMuc2VlZCAhPT0gdW5kZWZpbmVkO1xuXG4gICAgICAgICAgICAgICAgLy8gQ2FzZSAxXG4gICAgICAgICAgICAgICAgaWYgKCFoYXNfc3RhdGljX3NlZWQgJiYgaXNfY2xpZW50X2R5bmFtaWMgJiYgIWhhc19sb2NhbF9zZWVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmFuZG9taXplKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIENhc2UgM1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGhhc19zdGF0aWNfc2VlZCAmJiAhaXNfY2xpZW50X2R5bmFtaWMpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5hc3NlcnQoXG4gICAgICAgICAgICAgICAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiV2FybmluZzogdGhlIHByb3ZpZGVkIHN0YXRpYyBzZWVkIHdhcyBpZ25vcmVkLCBiZWNhdXNlIGl0IG9ubHkgYWZmZWN0cyBjbGllbnQtc2lkZSwgZHluYW1pYyBwcm9ibGVtcy5cIixcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gQ2FzZSA0XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgICAgIGhhc19zdGF0aWNfc2VlZCAmJlxuICAgICAgICAgICAgICAgICAgICBpc19jbGllbnRfZHluYW1pYyAmJlxuICAgICAgICAgICAgICAgICAgICAhaGFzX2xvY2FsX3NlZWRcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWVkID0gZGljdF8uc3RhdGljX3NlZWQ7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyRHluYW1pY0NvbnRlbnQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gQ2FzZSA1XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgICAgIGhhc19zdGF0aWNfc2VlZCAmJlxuICAgICAgICAgICAgICAgICAgICBpc19jbGllbnRfZHluYW1pYyAmJlxuICAgICAgICAgICAgICAgICAgICBoYXNfbG9jYWxfc2VlZCAmJlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlZWQgIT09IGRpY3RfLnN0YXRpY19zZWVkXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuYXNzZXJ0KFxuICAgICAgICAgICAgICAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIldhcm5pbmc6IHRoZSBwcm92aWRlZCBzdGF0aWMgc2VlZCB3YXMgb3ZlcnJpZGRlbiBieSB0aGUgc2VlZCBmb3VuZCBpbiBsb2NhbCBzdG9yYWdlLlwiLFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBDYXNlcyAwIGFuZCAyXG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIE5vIGFjdGlvbiBuZWVkZWQuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBQcmlzbSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgICAgICBQcmlzbS5oaWdobGlnaHRBbGxVbmRlcih0aGlzLmNvbnRhaW5lckRpdik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5pbmRpY2F0ZV9jb21wb25lbnRfcmVhZHkoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy50eXBlc2V0UHJvbXB0KCk7XG4gICAgfVxuXG4gICAgLy8gRmluZCB0aGUgc2NyaXB0IHRhZyBjb250YWluaW5nIEpTT04gaW4gYSBnaXZlbiByb290IERPTSBub2RlLlxuICAgIHNjcmlwdFNlbGVjdG9yKHJvb3Rfbm9kZSkge1xuICAgICAgICByZXR1cm4gcm9vdF9ub2RlLnF1ZXJ5U2VsZWN0b3IoYHNjcmlwdFt0eXBlPVwiYXBwbGljYXRpb24vanNvblwiXWApO1xuICAgIH1cblxuICAgIC8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09PT0gICBGdW5jdGlvbnMgZ2VuZXJhdGluZyBmaW5hbCBIVE1MICAgPT09PVxuICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuICAgIGNyZWF0ZUZJVEJFbGVtZW50KCkge1xuICAgICAgICB0aGlzLnJlbmRlckZJVEJJbnB1dCgpO1xuICAgICAgICB0aGlzLnJlbmRlckZJVEJCdXR0b25zKCk7XG4gICAgICAgIHRoaXMucmVuZGVyRklUQkZlZWRiYWNrRGl2KCk7XG4gICAgICAgIC8vIHJlcGxhY2VzIHRoZSBpbnRlcm1lZGlhdGUgSFRNTCBmb3IgdGhpcyBjb21wb25lbnQgd2l0aCB0aGUgcmVuZGVyZWQgSFRNTCBvZiB0aGlzIGNvbXBvbmVudFxuICAgICAgICB0aGlzLm9yaWdFbGVtLnJlcGxhY2VXaXRoKHRoaXMuY29udGFpbmVyRGl2KTtcbiAgICB9XG4gICAgcmVuZGVyRklUQklucHV0KCkge1xuICAgICAgICAvLyBUaGUgdGV4dCBbaW5wdXRdIGVsZW1lbnRzIGFyZSBjcmVhdGVkIGJ5IHRoZSB0ZW1wbGF0ZS5cbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5pZCA9IHRoaXMuZGl2aWQ7XG4gICAgICAgIC8vIENyZWF0ZSBhbm90aGVyIGNvbnRhaW5lciB3aGljaCBzdG9yZXMgdGhlIHByb2JsZW0gZGVzY3JpcHRpb24uXG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb25EaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uRGl2LmNsYXNzTGlzdC5hZGQoXCJleGVyY2lzZS1zdGF0ZW1lbnRcIik7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmFwcGVuZENoaWxkKHRoaXMuZGVzY3JpcHRpb25EaXYpO1xuICAgICAgICAvLyBDb3B5IHRoZSBvcmlnaW5hbCBlbGVtZW50cyB0byB0aGUgY29udGFpbmVyIGhvbGRpbmcgd2hhdCB0aGUgdXNlciB3aWxsIHNlZSAoY2xpZW50LXNpZGUgZ3JhZGluZyBvbmx5KS5cbiAgICAgICAgaWYgKHRoaXMucHJvYmxlbUh0bWwpIHtcbiAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb25EaXYuaW5uZXJIVE1MID0gdGhpcy5wcm9ibGVtSHRtbDtcbiAgICAgICAgICAgIC8vIFNhdmUgb3JpZ2luYWwgSFRNTCAod2l0aCB0ZW1wbGF0ZXMpIHVzZWQgaW4gZHluYW1pYyBwcm9ibGVtcy5cbiAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb25EaXYub3JpZ0lubmVySFRNTCA9IHRoaXMucHJvYmxlbUh0bWw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZW5kZXJGSVRCQnV0dG9ucygpIHtcbiAgICAgICAgLy8gXCJzdWJtaXRcIiBidXR0b25cbiAgICAgICAgdGhpcy5zdWJtaXRCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgICAgICB0aGlzLnN1Ym1pdEJ1dHRvbi50ZXh0Q29udGVudCA9IHQoXCJtc2dfZml0Yl9jaGVja19tZVwiKTtcbiAgICAgICAgdGhpcy5zdWJtaXRCdXR0b24uY2xhc3NOYW1lID0gXCJidG4gYnRuLXN1Y2Nlc3NcIjtcbiAgICAgICAgdGhpcy5zdWJtaXRCdXR0b24ubmFtZSA9IFwiZG8gYW5zd2VyXCI7XG4gICAgICAgIHRoaXMuc3VibWl0QnV0dG9uLnR5cGUgPSBcImJ1dHRvblwiO1xuICAgICAgICB0aGlzLnN1Ym1pdEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgXCJjbGlja1wiLFxuICAgICAgICAgICAgYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tDdXJyZW50QW5zd2VyKCk7XG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5sb2dDdXJyZW50QW5zd2VyKCk7XG4gICAgICAgICAgICB9LmJpbmQodGhpcyksXG4gICAgICAgICAgICBmYWxzZSxcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYuYXBwZW5kQ2hpbGQodGhpcy5zdWJtaXRCdXR0b24pO1xuXG4gICAgICAgIC8vIFwiY29tcGFyZSBtZVwiIGJ1dHRvblxuICAgICAgICBpZiAodGhpcy51c2VSdW5lc3RvbmVTZXJ2aWNlcykge1xuICAgICAgICAgICAgdGhpcy5jb21wYXJlQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICAgICAgICAgIHRoaXMuY29tcGFyZUJ1dHRvbi5jbGFzc05hbWUgPSBcImJ0biBidG4tZGVmYXVsdFwiO1xuICAgICAgICAgICAgdGhpcy5jb21wYXJlQnV0dG9uLmlkID0gdGhpcy5vcmlnRWxlbS5pZCArIFwiX2Jjb21wXCI7XG4gICAgICAgICAgICB0aGlzLmNvbXBhcmVCdXR0b24udHlwZSA9IFwiYnV0dG9uXCI7XG4gICAgICAgICAgICB0aGlzLmNvbXBhcmVCdXR0b24uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5jb21wYXJlQnV0dG9uLm5hbWUgPSBcImNvbXBhcmVcIjtcbiAgICAgICAgICAgIHRoaXMuY29tcGFyZUJ1dHRvbi50ZXh0Q29udGVudCA9IHQoXCJtc2dfZml0Yl9jb21wYXJlX21lXCIpO1xuICAgICAgICAgICAgdGhpcy5jb21wYXJlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICAgICAgXCJjbGlja1wiLFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb21wYXJlRklUQkFuc3dlcnMoKTtcbiAgICAgICAgICAgICAgICB9LmJpbmQodGhpcyksXG4gICAgICAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXJEaXYuYXBwZW5kQ2hpbGQodGhpcy5jb21wYXJlQnV0dG9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJhbmRvbWl6ZSBidXR0b24gZm9yIGR5bmFtaWMgcHJvYmxlbXMuXG4gICAgICAgIGlmICh0aGlzLmR5bl92YXJzKSB7XG4gICAgICAgICAgICB0aGlzLnJhbmRvbWl6ZUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICAgICAgICB0aGlzLnJhbmRvbWl6ZUJ1dHRvbi5jbGFzc05hbWUgPSBcImJ0biBidG4tZGVmYXVsdFwiO1xuICAgICAgICAgICAgLy8gTm90IGBgX2Jjb21wYGA7IHRoYXQgaXMgdGhlIGNvbXBhcmUgYnV0dG9uJ3MgaWQsIGFuZCBkeW5hbWljXG4gICAgICAgICAgICAvLyBwcm9ibGVtcyB0aGF0IG9mZmVyIGJvdGggd291bGQgaGF2ZSBwcm9kdWNlZCBhIGR1cGxpY2F0ZSBpZC5cbiAgICAgICAgICAgIHRoaXMucmFuZG9taXplQnV0dG9uLmlkID0gdGhpcy5vcmlnRWxlbS5pZCArIFwiX2JyYW5kXCI7XG4gICAgICAgICAgICB0aGlzLnJhbmRvbWl6ZUJ1dHRvbi50eXBlID0gXCJidXR0b25cIjtcbiAgICAgICAgICAgIHRoaXMucmFuZG9taXplQnV0dG9uLm5hbWUgPSBcInJhbmRvbWl6ZVwiO1xuICAgICAgICAgICAgdGhpcy5yYW5kb21pemVCdXR0b24udGV4dENvbnRlbnQgPSB0KFwibXNnX2ZpdGJfcmFuZG9taXplXCIpO1xuICAgICAgICAgICAgdGhpcy5yYW5kb21pemVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgICAgICBcImNsaWNrXCIsXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJhbmRvbWl6ZSgpO1xuICAgICAgICAgICAgICAgIH0uYmluZCh0aGlzKSxcbiAgICAgICAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZCh0aGlzLnJhbmRvbWl6ZUJ1dHRvbik7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpKTtcbiAgICB9XG4gICAgcmVuZGVyRklUQkZlZWRiYWNrRGl2KCkge1xuICAgICAgICB0aGlzLmZlZWRCYWNrRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdGhpcy5mZWVkQmFja0Rpdi5pZCA9IHRoaXMuZGl2aWQgKyBcIl9mZWVkYmFja1wiO1xuICAgICAgICAvLyBgYHJvbGU9XCJzdGF0dXNcImBgIGlzIGFuIGltcGxpY2l0bHkgcG9saXRlIGxpdmUgcmVnaW9uLiBUaGUgcHJldmlvdXNcbiAgICAgICAgLy8gYGByb2xlPVwiYWxlcnRcImBgIHdhcyBhc3NlcnRpdmUsIGNvbnRyYWRpY3RpbmcgdGhlIHBvbGl0ZSBzZXR0aW5nXG4gICAgICAgIC8vIGJlc2lkZSBpdCBhbmQgaW50ZXJydXB0aW5nIHdoYXRldmVyIHRoZSBzY3JlZW4gcmVhZGVyIHdhcyBzYXlpbmcuXG4gICAgICAgIHRoaXMuZmVlZEJhY2tEaXYuc2V0QXR0cmlidXRlKFwicm9sZVwiLCBcInN0YXR1c1wiKTtcbiAgICAgICAgdGhpcy5mZWVkQmFja0Rpdi5zZXRBdHRyaWJ1dGUoXCJhcmlhLWxpdmVcIiwgXCJwb2xpdGVcIik7XG4gICAgICAgIHRoaXMuZmVlZEJhY2tEaXYuc2V0QXR0cmlidXRlKFwiYXJpYS1hdG9taWNcIiwgXCJ0cnVlXCIpO1xuICAgICAgICB0aGlzLmZlZWRCYWNrRGl2LmNsYXNzTGlzdC5hZGQoXCJmaXRiLWZlZWRiYWNrXCIpO1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZCh0aGlzLmZlZWRCYWNrRGl2KTtcbiAgICB9XG5cbiAgICBjbGVhckZlZWRiYWNrRGl2KCkge1xuICAgICAgICAvLyBTZXR0aW5nIHRoZSBgYG91dGVySFRNTGBgIHJlbW92ZXMgdGhpcyBmcm9tIHRoZSBET00uIFVzZSBhbiBhbHRlcm5hdGl2ZSBwcm9jZXNzIC0tIHJlbW92ZSB0aGUgY2xhc3MgKHdoaWNoIG1ha2VzIGl0IHJlZC9ncmVlbiBiYXNlZCBvbiBncmFkaW5nKSBhbmQgY29udGVudC5cbiAgICAgICAgdGhpcy5mZWVkQmFja0Rpdi5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgICAvLyBLZWVwIGBgZml0Yi1mZWVkYmFja2BgOyBvbmx5IHRoZSBhbGVydCBjb2xvdXJpbmcgaXMgcGVyLWdyYWRlLlxuICAgICAgICB0aGlzLmZlZWRCYWNrRGl2LmNsYXNzTmFtZSA9IFwiZml0Yi1mZWVkYmFja1wiO1xuICAgICAgICB0aGlzLmNsZWFyQmxhbmtGZWVkYmFjaygpO1xuICAgIH1cblxuICAgIC8vIERyb3AgdGhlIHBlci1ibGFuayBncmFkaW5nIHN0YXRlLCBzbyBhIHN0YWxlIGBgYXJpYS1kZXNjcmliZWRieWBgIG5ldmVyXG4gICAgLy8gcG9pbnRzIGF0IGZlZWRiYWNrIHRoYXQgaGFzIGFscmVhZHkgYmVlbiByZW1vdmVkIGZyb20gdGhlIHBhZ2UuXG4gICAgY2xlYXJCbGFua0ZlZWRiYWNrKCkge1xuICAgICAgICBmb3IgKGNvbnN0IGJsYW5rIG9mIHRoaXMuYmxhbmtBcnJheSB8fCBbXSkge1xuICAgICAgICAgICAgYmxhbmsuY2xhc3NMaXN0LnJlbW92ZShcImlucHV0LXZhbGlkYXRpb24tZXJyb3JcIik7XG4gICAgICAgICAgICBibGFuay5yZW1vdmVBdHRyaWJ1dGUoXCJhcmlhLWludmFsaWRcIik7XG4gICAgICAgICAgICBibGFuay5yZW1vdmVBdHRyaWJ1dGUoXCJhcmlhLWRlc2NyaWJlZGJ5XCIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gVXBkYXRlIHRoZSBwcm9ibGVtJ3MgZGVzY3JpcHRpb24gYmFzZWQgb24gZHluYW1pY2FsbHktZ2VuZXJhdGVkIGNvbnRlbnQuXG4gICAgcmVuZGVyRHluYW1pY0NvbnRlbnQoKSB7XG4gICAgICAgIC8vIGBgdGhpcy5keW5fdmFyc2BgIGNhbiBiZSB0cnVlOyBpZiBzbywgZG9uJ3QgcmVuZGVyIGl0LCBzaW5jZSB0aGUgc2VydmVyIGRvZXMgYWxsIHRoZSByZW5kZXJpbmcuXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5keW5fdmFycyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgbGV0IGh0bWxfbm9kZXM7XG4gICAgICAgICAgICBbaHRtbF9ub2RlcywgdGhpcy5keW5fdmFyc19ldmFsXSA9IHJlbmRlckR5bmFtaWNDb250ZW50KFxuICAgICAgICAgICAgICAgIHRoaXMuc2VlZCxcbiAgICAgICAgICAgICAgICB0aGlzLmR5bl92YXJzLFxuICAgICAgICAgICAgICAgIHRoaXMuZHluX2ltcG9ydHMsXG4gICAgICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvbkRpdi5vcmlnSW5uZXJIVE1MLFxuICAgICAgICAgICAgICAgIHRoaXMuZGl2aWQsXG4gICAgICAgICAgICAgICAgdGhpcy5wcmVwYXJlQ2hlY2tBbnN3ZXJzLmJpbmQodGhpcyksXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvbkRpdi5yZXBsYWNlQ2hpbGRyZW4oLi4uaHRtbF9ub2Rlcyk7XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5keW5fdmFyc19ldmFsLmFmdGVyQ29udGVudFJlbmRlciA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5keW5fdmFyc19ldmFsLmFmdGVyQ29udGVudFJlbmRlcih0aGlzLmR5bl92YXJzX2V2YWwpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmFzc2VydChcbiAgICAgICAgICAgICAgICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgYEVycm9yIGluIHByb2JsZW0gJHt0aGlzLmRpdmlkfSBpbnZva2luZyBhZnRlckNvbnRlbnRSZW5kZXJgLFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnNldHVwQmxhbmtzKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXR1cEJsYW5rcygpIHtcbiAgICAgICAgLy8gRmluZCBhbmQgZm9ybWF0IHRoZSBibGFua3MuIElmIGEgZHluYW1pYyBwcm9ibGVtIGp1c3QgY2hhbmdlZCB0aGUgSFRNTCwgdGhpcyB3aWxsIGZpbmQgdGhlIG5ld2x5LWNyZWF0ZWQgYmxhbmtzLlxuICAgICAgICAvLyBXQVJOSU5HIC0gdGhpcyBhc3N1bWVzIHRoYXQgYWxsIHRleHQvbnVtYmVyIGlucHV0cyBpbiB0aGUgZGVzY3JpcHRpb25EaXYgYXJlIHRoZSBibGFua3MuXG4gICAgICAgIC8vIElkZWFsbHksIHRoZXJlIHNob3VsZCBiZSBzb21lIHVuaXF1ZSBhdHRyaWJ1dGUgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWxlY3QgdGhlIGJsYW5rcy5cbiAgICAgICAgY29uc3QgYmEgPSB0aGlzLmRlc2NyaXB0aW9uRGl2LnF1ZXJ5U2VsZWN0b3JBbGwoXG4gICAgICAgICAgICAnaW5wdXRbdHlwZT1cInRleHRcIl0saW5wdXRbdHlwZT1cIm51bWJlclwiXScsXG4gICAgICAgICk7XG4gICAgICAgIGJhLmZvckVhY2goKGVsKSA9PiB7XG4gICAgICAgICAgICBlbC5jbGFzc05hbWUgPSBcImZvcm0gZm9ybS1jb250cm9sIHNlbGVjdHdpZHRoYXV0b1wiO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5ibGFua0FycmF5ID0gQXJyYXkuZnJvbShiYSk7XG4gICAgICAgIGZvciAobGV0IGJsYW5rIG9mIHRoaXMuYmxhbmtBcnJheSkge1xuICAgICAgICAgICAgYmxhbmsuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCB0aGlzLnJlY29yZEFuc3dlcmVkLmJpbmQodGhpcykpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubGFiZWxCbGFua3MoKTtcbiAgICB9XG5cbiAgICAvKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICA9PT09ICBBY2Nlc3NpYmxlIG5hbWVzIGZvciB0aGUgYmxhbmtzICA9PT09XG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG4gICAgLy8gTmFtZSB0aGUgZXhlcmNpc2UgYXMgYSB3aG9sZSwgc28gZW50ZXJpbmcgaXQgYW5ub3VuY2VzIHdoYXQgaXQgaXMgcmF0aGVyXG4gICAgLy8gdGhhbiBhbiBhbm9ueW1vdXMgZ3JvdXAgb2YgdGV4dCBib3hlcy5cbiAgICBzZXRHcm91cExhYmVsKCkge1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5zZXRBdHRyaWJ1dGUoXCJyb2xlXCIsIFwiZ3JvdXBcIik7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2LnNldEF0dHJpYnV0ZShcbiAgICAgICAgICAgIFwiYXJpYS1sYWJlbFwiLFxuICAgICAgICAgICAgdGhpcy5xdWVzdGlvbl9sYWJlbFxuICAgICAgICAgICAgICAgID8gdChcIm1zZ19maXRiX2dyb3VwX2xhYmVsX251bWJlcmVkXCIsIHRoaXMucXVlc3Rpb25fbGFiZWwpXG4gICAgICAgICAgICAgICAgOiB0KFwibXNnX2ZpdGJfZ3JvdXBfbGFiZWxcIiksXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gQSBzY3JlZW4gcmVhZGVyIGFubm91bmNlcyBhIGZvcm0gZmllbGQncyBhY2Nlc3NpYmxlIG5hbWUgd2hlbiBmb2N1cyBsYW5kc1xuICAgIC8vIG9uIGl0IGFuZCBub3RoaW5nIGVsc2UgLS0gdGhlIHByb21wdCB0ZXh0IGFyb3VuZCB0aGUgZmllbGQgaXMgbmV2ZXIgcmVhZFxuICAgIC8vIGluIGZvcm1zIG1vZGUuIEV2ZXJ5IGJsYW5rIHdhcyBuYW1lZCBcImlucHV0IGFyZWFcIiwgc28gdGFiYmluZyBpbnRvIGFcbiAgICAvLyBxdWVzdGlvbiBzYWlkIG5vdGhpbmcgYWJvdXQgdGhlIHF1ZXN0aW9uLiBCdWlsZCBlYWNoIG5hbWUgb3V0IG9mIHRoZVxuICAgIC8vIHByb21wdCBpbnN0ZWFkLCBzcGVsbGluZyBvdXQgZXZlcnkgYmxhbmsgaW4gdGhhdCBwcm9tcHQgYXMgXCJibGFuayAxXCIsXG4gICAgLy8gXCJibGFuayAyXCIsIC4uLiBzbyB0aGUgZ2FwcyBoYXZlIGF1ZGlibGUgcG9zaXRpb25zLlxuICAgIGxhYmVsQmxhbmtzKCkge1xuICAgICAgICBjb25zdCB0b3RhbCA9IHRoaXMuYmxhbmtBcnJheS5sZW5ndGg7XG4gICAgICAgIHRoaXMuYmxhbmtBcnJheS5mb3JFYWNoKChibGFuaywgaSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgY29udGV4dCA9IHRoaXMuYmxhbmtDb250ZXh0KGJsYW5rLCBpKTtcbiAgICAgICAgICAgIGxldCBsYWJlbDtcbiAgICAgICAgICAgIGlmICh0b3RhbCA9PT0gMSkge1xuICAgICAgICAgICAgICAgIGxhYmVsID0gY29udGV4dFxuICAgICAgICAgICAgICAgICAgICA/IHQoXCJtc2dfZml0Yl9ibGFua19sYWJlbF9zaW5nbGVcIiwgY29udGV4dClcbiAgICAgICAgICAgICAgICAgICAgOiB0KFwibXNnX2ZpdGJfYmxhbmtfZmFsbGJhY2tfc2luZ2xlXCIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsYWJlbCA9IGNvbnRleHRcbiAgICAgICAgICAgICAgICAgICAgPyB0KFwibXNnX2ZpdGJfYmxhbmtfbGFiZWxcIiwgaSArIDEsIHRvdGFsLCBjb250ZXh0KVxuICAgICAgICAgICAgICAgICAgICA6IHQoXCJtc2dfZml0Yl9ibGFua19mYWxsYmFja1wiLCBpICsgMSwgdG90YWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYmxhbmsuc2V0QXR0cmlidXRlKFwiYXJpYS1sYWJlbFwiLCBsYWJlbCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIFRoZSBwcm9tcHQgdGV4dCB0byByZWFkIG91dCBmb3IgYmxhbmsgYGBpYGAuXG4gICAgYmxhbmtDb250ZXh0KGJsYW5rLCBpKSB7XG4gICAgICAgIGNvbnN0IGJsb2NrID0gdGhpcy5ibGFua0Jsb2NrKGJsYW5rKTtcbiAgICAgICAgbGV0IHRleHQgPSB0aGlzLmJsYW5rQ29udGV4dFRleHQoYmxvY2spO1xuICAgICAgICAvLyBOZXdsaW5lcyBhcmUgb25seSBzaWduaWZpY2FudCBpbiBhIGNvZGUgbGlzdGluZywgYW5kIHRoZXJlIHRoZSB1c2VmdWxcbiAgICAgICAgLy8gY29udGV4dCBpcyB0aGUgYmxhbmsncyBvd24gbGluZTogcmVhZGluZyBhIHdob2xlIHByb2dyYW0gYWxvdWQgb25cbiAgICAgICAgLy8gZXZlcnkgVGFiIGlzIGFzIHVudXNhYmxlIGFzIHJlYWRpbmcgbm90aGluZy4gRmFsbCBiYWNrIHRvIHRoZSBlbnRpcmVcbiAgICAgICAgLy8gbGlzdGluZyBmb3IgYSBibGFuayB0aGF0IHNpdHMgYWxvbmUgb24gaXRzIGxpbmUsIHdoaWNoIHNheXMgbm90aGluZ1xuICAgICAgICAvLyBieSBpdHNlbGYuXG4gICAgICAgIGlmIChibG9jay50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwicHJlXCIpIHtcbiAgICAgICAgICAgIGNvbnN0IG1hcmtlciA9IHQoXCJtc2dfZml0Yl9ibGFua19uXCIsIGkgKyAxKTtcbiAgICAgICAgICAgIGNvbnN0IGxpbmUgPSB0ZXh0LnNwbGl0KFwiXFxuXCIpLmZpbmQoKGwpID0+IGwuaW5jbHVkZXMobWFya2VyKSk7XG4gICAgICAgICAgICBpZiAobGluZSAhPT0gdW5kZWZpbmVkICYmIGxpbmUucmVwbGFjZShtYXJrZXIsIFwiXCIpLnRyaW0oKSkge1xuICAgICAgICAgICAgICAgIHRleHQgPSBsaW5lO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICB0ZXh0XG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xccysvZywgXCIgXCIpXG4gICAgICAgICAgICAgICAgLy8gQSBibGFuayBpcyBwYWRkZWQgd2l0aCBzcGFjZXMgc28gaXQgbmV2ZXIgcnVucyBpbnRvIHRoZSB3b3Jkc1xuICAgICAgICAgICAgICAgIC8vIGJlc2lkZSBpdDsgcHVsbCB0aGUgcGFkZGluZyBiYWNrIG9mZiBwdW5jdHVhdGlvbiwgd2hpY2hcbiAgICAgICAgICAgICAgICAvLyBvdGhlcndpc2UgcmVhZHMgYXMgXCJibGFuayAxICwgdGhlblwiLlxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXHMrKFssLjs6IT8pXFxdfV0pL2csIFwiJDFcIilcbiAgICAgICAgICAgICAgICAudHJpbSgpXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gVGhlIGJsb2NrIHRoZSBibGFuayBzaXRzIGluIC0tIGl0cyBzZW50ZW5jZSwgbGlzdCBpdGVtIG9yIHRhYmxlIGNlbGwgLS1cbiAgICAvLyB3aGljaCBpcyB0aGUgdXNlZnVsIHVuaXQgb2YgY29udGV4dC4gRmFsbHMgYmFjayB0byB0aGUgd2hvbGUgcHJvbXB0LlxuICAgIGJsYW5rQmxvY2soYmxhbmspIHtcbiAgICAgICAgY29uc3QgYmxvY2sgPSBibGFuay5jbG9zZXN0KFxuICAgICAgICAgICAgXCJwLGxpLGRkLGR0LHRkLHRoLHByZSxibG9ja3F1b3RlLHNlY3Rpb24sZGl2LGgxLGgyLGgzLGg0LGg1LGg2XCIsXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiBibG9jayAmJiB0aGlzLmRlc2NyaXB0aW9uRGl2LmNvbnRhaW5zKGJsb2NrKVxuICAgICAgICAgICAgPyBibG9ja1xuICAgICAgICAgICAgOiB0aGlzLmRlc2NyaXB0aW9uRGl2O1xuICAgIH1cblxuICAgIC8vIEZsYXR0ZW4gYW4gZWxlbWVudCBpbnRvIHRoZSB0ZXh0IGEgc2NyZWVuIHJlYWRlciB3b3VsZCBoZWFyLCB3aXRoIGVhY2hcbiAgICAvLyBibGFuayByZXBsYWNlZCBieSBpdHMgc3Bva2VuIG51bWJlci4gV2hpdGVzcGFjZSBpcyBub3Qgbm9ybWFsaXplZCBoZXJlLlxuICAgIGJsYW5rQ29udGV4dFRleHQocm9vdCkge1xuICAgICAgICBjb25zdCBwYXJ0cyA9IFtdO1xuICAgICAgICBjb25zdCB3YWxrID0gKG5vZGUpID0+IHtcbiAgICAgICAgICAgIGlmIChub2RlLm5vZGVUeXBlID09PSBOb2RlLlRFWFRfTk9ERSkge1xuICAgICAgICAgICAgICAgIHBhcnRzLnB1c2gobm9kZS5ub2RlVmFsdWUpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChub2RlLm5vZGVUeXBlICE9PSBOb2RlLkVMRU1FTlRfTk9ERSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFNraXAgd2hhdGV2ZXIgaXMgYWxyZWFkeSBoaWRkZW4gZnJvbSBhc3Npc3RpdmUgdGVjaG5vbG9neS4gVGhpc1xuICAgICAgICAgICAgLy8gYWxzbyBkcm9wcyBNYXRoSmF4J3MgdmlzdWFsIG91dHB1dCwgbGVhdmluZyBpdHMgYXNzaXN0aXZlIE1hdGhNTC5cbiAgICAgICAgICAgIGlmIChub2RlLmdldEF0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIpID09PSBcInRydWVcIikge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHRhZyA9IG5vZGUudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgaWYgKHRhZyA9PT0gXCJzY3JpcHRcIiB8fCB0YWcgPT09IFwic3R5bGVcIiB8fCB0YWcgPT09IFwidGVtcGxhdGVcIikge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGJsYW5rSW5kZXggPSB0aGlzLmJsYW5rQXJyYXkuaW5kZXhPZihub2RlKTtcbiAgICAgICAgICAgIGlmIChibGFua0luZGV4ICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIHBhcnRzLnB1c2goYCAke3QoXCJtc2dfZml0Yl9ibGFua19uXCIsIGJsYW5rSW5kZXggKyAxKX0gYCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRhZyA9PT0gXCJiclwiKSB7XG4gICAgICAgICAgICAgICAgcGFydHMucHVzaChcIiBcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRhZyA9PT0gXCJpbWdcIikge1xuICAgICAgICAgICAgICAgIHBhcnRzLnB1c2goYCAke25vZGUuZ2V0QXR0cmlidXRlKFwiYWx0XCIpIHx8IFwiXCJ9IGApO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0YWcgPT09IFwiaW5wdXRcIiB8fCB0YWcgPT09IFwic2VsZWN0XCIgfHwgdGFnID09PSBcInRleHRhcmVhXCIpIHtcbiAgICAgICAgICAgICAgICAvLyBTb21lIG90aGVyIGNvbnRyb2wgdGhlIGF1dGhvciBwdXQgaW4gdGhlIHByb21wdDogcmVhZCB0aGVcbiAgICAgICAgICAgICAgICAvLyBuYW1lIGl0IGNhcnJpZXMgcmF0aGVyIHRoYW4gZGVzY2VuZGluZyBpbnRvIGl0LlxuICAgICAgICAgICAgICAgIHBhcnRzLnB1c2goYCAke25vZGUuZ2V0QXR0cmlidXRlKFwiYXJpYS1sYWJlbFwiKSB8fCBcIlwifSBgKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIG5vZGUuY2hpbGROb2Rlcykge1xuICAgICAgICAgICAgICAgIHdhbGsoY2hpbGQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB3YWxrKHJvb3QpO1xuICAgICAgICAvLyBXaGl0ZXNwYWNlIGlzIGxlZnQgYXMtaXM7IHRoZSBjYWxsZXIgZGVjaWRlcyB3aGV0aGVyIG5ld2xpbmVzIG1hdHRlci5cbiAgICAgICAgcmV0dXJuIHBhcnRzLmpvaW4oXCJcIik7XG4gICAgfVxuXG4gICAgLy8gTWF0aEpheCByZXdyaXRlcyB0aGUgcHJvbXB0IGFzeW5jaHJvbm91c2x5LCBhZnRlciB0aGUgYmxhbmtzIGhhdmUgYmVlblxuICAgIC8vIG5hbWVkOyByZWJ1aWxkIHRoZSBuYW1lcyBvbmNlIGl0IGlzIGRvbmUgc28gdGhleSBob2xkIHRoZSB0eXBlc2V0IHRleHRcbiAgICAvLyBpbnN0ZWFkIG9mIHJhdyBMYVRlWC5cbiAgICB0eXBlc2V0UHJvbXB0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5xdWV1ZU1hdGhKYXgodGhpcy5kZXNjcmlwdGlvbkRpdikudGhlbigoKSA9PlxuICAgICAgICAgICAgdGhpcy5sYWJlbEJsYW5rcygpLFxuICAgICAgICApO1xuICAgIH1cblxuICAgIC8vIFRoaXMgdGVsbHMgdGltZWQgcXVlc3Rpb25zIHRoYXQgdGhlIGZpdGIgYmxhbmtzIHJlY2VpdmVkIHNvbWUgaW50ZXJhY3Rpb24uXG4gICAgcmVjb3JkQW5zd2VyZWQoKSB7XG4gICAgICAgIHRoaXMuaXNBbnN3ZXJlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09PSBDaGVja2luZy9sb2FkaW5nIGZyb20gc3RvcmFnZSA9PT1cbiAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG4gICAgcmVzdG9yZUFuc3dlcnMoZGF0YSkge1xuICAgICAgICAvLyBSZXN0b3JlIHRoZSBzZWVkIGZpcnN0LCBzaW5jZSB0aGUgZHluYW1pYyByZW5kZXIgY2xlYXJzIGFsbCB0aGUgYmxhbmtzLlxuICAgICAgICB0aGlzLnNlZWQgPSBkYXRhLnNlZWQ7XG4gICAgICAgIHRoaXMucmVuZGVyRHluYW1pY0NvbnRlbnQoKTtcbiAgICAgICAgdGhpcy50eXBlc2V0UHJvbXB0KCk7XG5cbiAgICAgICAgdmFyIGFycjtcbiAgICAgICAgLy8gUmVzdG9yZSBhbnN3ZXJzIGZyb20gc3RvcmFnZSByZXRyaWV2YWwgZG9uZSBpbiBSdW5lc3RvbmVCYXNlLlxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gVGhlIG5ld2VyIGZvcm1hdCBlbmNvZGVzIGRhdGEgYXMgYSBKU09OIG9iamVjdC5cbiAgICAgICAgICAgIGFyciA9IEpTT04ucGFyc2UoZGF0YS5hbnN3ZXIpO1xuICAgICAgICAgICAgLy8gVGhlIHJlc3VsdCBzaG91bGQgYmUgYW4gYXJyYXkuIElmIG5vdCwgdHJ5IGNvbW1hIHBhcnNpbmcgaW5zdGVhZC5cbiAgICAgICAgICAgIGlmICghQXJyYXkuaXNBcnJheShhcnIpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgLy8gVGhlIG9sZCBmb3JtYXQgZGlkbid0LlxuICAgICAgICAgICAgYXJyID0gKGRhdGEuYW5zd2VyIHx8IFwiXCIpLnNwbGl0KFwiLFwiKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgaGFzQW5zd2VyID0gZmFsc2U7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5ibGFua0FycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmJsYW5rQXJyYXlbaV0udmFsdWUgPSBhcnJbaV0gfHwgXCJcIjtcbiAgICAgICAgICAgIGlmIChhcnJbaV0pIHtcbiAgICAgICAgICAgICAgICBoYXNBbnN3ZXIgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIElzIHRoaXMgY2xpZW50LXNpZGUgZ3JhZGluZywgb3Igc2VydmVyLXNpZGUgZ3JhZGluZz9cbiAgICAgICAgaWYgKHRoaXMuZmVlZGJhY2tBcnJheSkge1xuICAgICAgICAgICAgLy8gRm9yIGNsaWVudC1zaWRlIGdyYWRpbmcsIHJlLWdlbmVyYXRlIGZlZWRiYWNrIGlmIHRoZXJlJ3MgYW4gYW5zd2VyLlxuICAgICAgICAgICAgaWYgKGhhc0Fuc3dlcikge1xuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tDdXJyZW50QW5zd2VyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBGb3Igc2VydmVyLXNpZGUgZ3JhZGluZywgdXNlIHRoZSBwcm92aWRlZCBmZWVkYmFjayBmcm9tIHRoZSBzZXJ2ZXIgb3IgbG9jYWwgc3RvcmFnZS5cbiAgICAgICAgICAgIHRoaXMuZGlzcGxheUZlZWQgPSBkYXRhLmRpc3BsYXlGZWVkO1xuICAgICAgICAgICAgdGhpcy5jb3JyZWN0ID0gZGF0YS5jb3JyZWN0O1xuICAgICAgICAgICAgdGhpcy5pc0NvcnJlY3RBcnJheSA9IGRhdGEuaXNDb3JyZWN0QXJyYXk7XG4gICAgICAgICAgICAvLyBPbmx5IHJlbmRlciBpZiBhbGwgdGhlIGRhdGEgaXMgcHJlc2VudDsgbG9jYWwgc3RvcmFnZSBtaWdodCBoYXZlIG9sZCBkYXRhIG1pc3Npbmcgc29tZSBvZiB0aGVzZSBpdGVtcy5cbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICB0eXBlb2YgdGhpcy5kaXNwbGF5RmVlZCAhPT0gXCJ1bmRlZmluZWRcIiAmJlxuICAgICAgICAgICAgICAgIHR5cGVvZiB0aGlzLmNvcnJlY3QgIT09IFwidW5kZWZpbmVkXCIgJiZcbiAgICAgICAgICAgICAgICB0eXBlb2YgdGhpcy5pc0NvcnJlY3RBcnJheSAhPT0gXCJ1bmRlZmluZWRcIlxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJGZWVkYmFjaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gRm9yIHNlcnZlci1zaWRlIGR5bmFtaWMgcHJvYmxlbXMsIHNob3cgdGhlIHJlbmRlcmVkIHByb2JsZW0gdGV4dC5cbiAgICAgICAgICAgIHRoaXMucHJvYmxlbUh0bWwgPSBkYXRhLnByb2JsZW1IdG1sO1xuICAgICAgICAgICAgaWYgKHRoaXMucHJvYmxlbUh0bWwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uRGl2LmlubmVySFRNTCA9IHRoaXMucHJvYmxlbUh0bWw7XG4gICAgICAgICAgICAgICAgdGhpcy50eXBlc2V0UHJvbXB0KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXR1cEJsYW5rcygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2hlY2tMb2NhbFN0b3JhZ2UoKSB7XG4gICAgICAgIC8vIExvYWRzIHByZXZpb3VzIGFuc3dlcnMgZnJvbSBsb2NhbCBzdG9yYWdlIGlmIHRoZXkgZXhpc3RcbiAgICAgICAgdmFyIHN0b3JlZERhdGE7XG4gICAgICAgIGlmICh0aGlzLmdyYWRlcmFjdGl2ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBsZW4gPSBsb2NhbFN0b3JhZ2UubGVuZ3RoO1xuICAgICAgICBpZiAobGVuID4gMCkge1xuICAgICAgICAgICAgdmFyIGV4ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5sb2NhbFN0b3JhZ2VLZXkoKSk7XG4gICAgICAgICAgICBpZiAoZXggIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBsZXQgZXJyb3IgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBzdG9yZWREYXRhID0gSlNPTi5wYXJzZShleCk7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGVycm9yIHdoaWxlIHBhcnNpbmc7IGxpa2VseSBkdWUgdG8gYmFkIHZhbHVlIHN0b3JlZCBpbiBzdG9yYWdlXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgICAgICAgICAgICAgICAgYEVycm9yIHBhcnNpbmcgc3RvcmVkIEZJVEIgZGF0YSBmb3IgJHt0aGlzLmRpdmlkfTogJHtlcnIubWVzc2FnZX1gLFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBlcnJvciA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChlcnJvciB8fCBzdG9yZWREYXRhLnRpbWVzdGFtcCA8IGVCb29rQ29uZmlnLnRlcm1TdGFydERhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0odGhpcy5sb2NhbFN0b3JhZ2VLZXkoKSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5yZXN0b3JlQW5zd2VycyhzdG9yZWREYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldExvY2FsU3RvcmFnZShkYXRhKSB7XG4gICAgICAgIGxldCBrZXkgPSB0aGlzLmxvY2FsU3RvcmFnZUtleSgpO1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICB9XG5cbiAgICBjaGVja0N1cnJlbnRBbnN3ZXIoKSB7XG4gICAgICAgIC8vIFN0YXJ0IG9mIHRoZSBldmFsdWF0aW9uIGNoYWluXG4gICAgICAgIHRoaXMuaXNDb3JyZWN0QXJyYXkgPSBbXTtcbiAgICAgICAgdGhpcy5kaXNwbGF5RmVlZCA9IFtdO1xuICAgICAgICBjb25zdCBwY2EgPSB0aGlzLnByZXBhcmVDaGVja0Fuc3dlcnMoKTtcblxuICAgICAgICBpZiAodGhpcy51c2VSdW5lc3RvbmVTZXJ2aWNlcykge1xuICAgICAgICAgICAgaWYgKGVCb29rQ29uZmlnLmVuYWJsZUNvbXBhcmVNZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZW5hYmxlQ29tcGFyZUJ1dHRvbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gR3JhZGUgbG9jYWxseSBpZiB3ZSBjYW4ndCBhc2sgdGhlIHNlcnZlciB0byBncmFkZS5cbiAgICAgICAgaWYgKHRoaXMuZmVlZGJhY2tBcnJheSkge1xuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgIC8vIEFuIGFycmF5IG9mIEhUTUwgZmVlZGJhY2suXG4gICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5RmVlZCxcbiAgICAgICAgICAgICAgICAvLyB0cnVlLCBmYWxzZSwgb3IgbnVsbCAodGhlIHF1ZXN0aW9uIHdhc24ndCBhbnN3ZXJlZCkuXG4gICAgICAgICAgICAgICAgdGhpcy5jb3JyZWN0LFxuICAgICAgICAgICAgICAgIC8vIEFuIGFycmF5IG9mIHRydWUsIGZhbHNlLCBvciBudWxsICh0aGUgcXVlc3Rpb24gd2Fzbid0IGFuc3dlcmVkKS5cbiAgICAgICAgICAgICAgICB0aGlzLmlzQ29ycmVjdEFycmF5LFxuICAgICAgICAgICAgICAgIHRoaXMucGVyY2VudCxcbiAgICAgICAgICAgIF0gPSBjaGVja0Fuc3dlcnNDb3JlKC4uLnBjYSk7XG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNUaW1lZCkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyRmVlZGJhY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIElucHV0czpcbiAgICAvL1xuICAgIC8vIC0gU3RyaW5ncyBlbnRlcmVkIGJ5IHRoZSBzdHVkZW50IGluIGBgdGhpcy5ibGFua0FycmF5W2ldLnZhbHVlYGAuXG4gICAgLy8gLSBGZWVkYmFjayBpbiBgYHRoaXMuZmVlZGJhY2tBcnJheWBgLlxuICAgIHByZXBhcmVDaGVja0Fuc3dlcnMoKSB7XG4gICAgICAgIHRoaXMuZ2l2ZW5fYXJyID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5ibGFua0FycmF5Lmxlbmd0aDsgaSsrKVxuICAgICAgICAgICAgdGhpcy5naXZlbl9hcnIucHVzaCh0aGlzLmJsYW5rQXJyYXlbaV0udmFsdWUpO1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgdGhpcy5ibGFua05hbWVzLFxuICAgICAgICAgICAgdGhpcy5naXZlbl9hcnIsXG4gICAgICAgICAgICB0aGlzLmZlZWRiYWNrQXJyYXksXG4gICAgICAgICAgICB0aGlzLmR5bl92YXJzX2V2YWwsXG4gICAgICAgIF07XG4gICAgfVxuXG4gICAgLy8gX2ByYW5kb21pemVgOiBUaGlzIGhhbmRsZXMgYSBjbGljayB0byB0aGUgXCJSYW5kb21pemVcIiBidXR0b24uXG4gICAgYXN5bmMgcmFuZG9taXplKCkge1xuICAgICAgICAvLyBVc2UgdGhlIGNsaWVudC1zaWRlIGNhc2Ugb3IgdGhlIHNlcnZlci1zaWRlIGNhc2U/XG4gICAgICAgIGlmICh0aGlzLmZlZWRiYWNrQXJyYXkpIHtcbiAgICAgICAgICAgIC8vIFRoaXMgaXMgdGhlIGNsaWVudC1zaWRlIGNhc2UuXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgdGhpcy5zZWVkID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMiAqKiAzMik7XG4gICAgICAgICAgICB0aGlzLnJlbmRlckR5bmFtaWNDb250ZW50KCk7XG4gICAgICAgICAgICB0aGlzLnR5cGVzZXRQcm9tcHQoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIFRoaXMgaXMgdGhlIHNlcnZlci1zaWRlIGNhc2UuIFNlbmQgYSByZXF1ZXN0IHRvIHRoZSBgcmVzdWx0cyA8Z2V0QXNzZXNzUmVzdWx0cz5gIGVuZHBvaW50IHdpdGggYGBuZXdfc2VlZGBgIHNldCB0byBUcnVlLlxuICAgICAgICAgICAgY29uc3QgcmVxdWVzdCA9IG5ldyBSZXF1ZXN0KFwiL2Fzc2Vzc21lbnQvcmVzdWx0c1wiLCB7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgICAgIGRpdl9pZDogdGhpcy5kaXZpZCxcbiAgICAgICAgICAgICAgICAgICAgY291cnNlOiBlQm9va0NvbmZpZy5jb3Vyc2UsXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50OiBcImZpbGxiXCIsXG4gICAgICAgICAgICAgICAgICAgIHNpZDogdGhpcy5zaWQsXG4gICAgICAgICAgICAgICAgICAgIG5ld19zZWVkOiB0cnVlLFxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHRoaXMuanNvbkhlYWRlcnMsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2gocmVxdWVzdCk7XG4gICAgICAgICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICAgICAgICAgICAgYWxlcnQoYEhUVFAgZXJyb3IgZ2V0dGluZyByZXN1bHRzOiAke3Jlc3BvbnNlLnN0YXR1c1RleHR9YCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGRhdGEuZGV0YWlsO1xuICAgICAgICAgICAgdGhpcy5zZWVkID0gcmVzLnNlZWQ7XG4gICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uRGl2LmlubmVySFRNTCA9IHJlcy5wcm9ibGVtSHRtbDtcbiAgICAgICAgICAgIHRoaXMudHlwZXNldFByb21wdCgpO1xuICAgICAgICAgICAgdGhpcy5zZXR1cEJsYW5rcygpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFdoZW4gZ2V0dGluZyBhIG5ldyBzZWVkLCBjbGVhciBhbGwgdGhlIG9sZCBhbnN3ZXJzIGFuZCBmZWVkYmFjay5cbiAgICAgICAgdGhpcy5naXZlbl9hcnIgPSBBcnJheSh0aGlzLmJsYW5rQXJyYXkubGVuZ3RoKS5maWxsKFwiXCIpO1xuICAgICAgICB0aGlzLmJsYW5rQXJyYXkuZm9yRWFjaCgoZWwpID0+IChlbC52YWx1ZSA9IFwiXCIpKTtcbiAgICAgICAgdGhpcy5jbGVhckZlZWRiYWNrRGl2KCk7XG4gICAgICAgIHRoaXMuc2F2ZUFuc3dlcnNMb2NhbGx5T25seSgpO1xuICAgIH1cblxuICAgIC8vIFNhdmUgdGhlIGFuc3dlcnMgYW5kIGFzc29jaWF0ZWQgZGF0YSBsb2NhbGx5OyBkb24ndCBzYXZlIGZlZWRiYWNrIHByb3ZpZGVkIGJ5IHRoZSBzZXJ2ZXIgZm9yIHRoaXMgYW5zd2VyLiBJdCBhc3N1bWVzIHRoYXQgYGB0aGlzLmdpdmVuX2FycmBgIGNvbnRhaW5zIHRoZSBjdXJyZW50IGFuc3dlcnMuXG4gICAgc2F2ZUFuc3dlcnNMb2NhbGx5T25seSgpIHtcbiAgICAgICAgdGhpcy5zZXRMb2NhbFN0b3JhZ2Uoe1xuICAgICAgICAgICAgLy8gVGhlIHNlZWQgaXMgdXNlZCBmb3IgY2xpZW50LXNpZGUgb3BlcmF0aW9uLCBidXQgZG9lc24ndCBtYXR0ZXIgZm9yIHNlcnZlci1zaWRlLlxuICAgICAgICAgICAgc2VlZDogdGhpcy5zZWVkLFxuICAgICAgICAgICAgYW5zd2VyOiBKU09OLnN0cmluZ2lmeSh0aGlzLmdpdmVuX2FyciksXG4gICAgICAgICAgICB0aW1lc3RhbXA6IG5ldyBEYXRlKCksXG4gICAgICAgICAgICAvLyBUaGlzIGlzIG9ubHkgbmVlZGVkIGZvciBzZXJ2ZXItc2lkZSBncmFkaW5nIHdpdGggZHluYW1pYyBwcm9ibGVtcy5cbiAgICAgICAgICAgIHByb2JsZW1IdG1sOiB0aGlzLmRlc2NyaXB0aW9uRGl2LmlubmVySFRNTCxcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gX2Bsb2dDdXJyZW50QW5zd2VyYDogU2F2ZSB0aGUgY3VycmVudCBzdGF0ZSBvZiB0aGUgcHJvYmxlbSB0byBsb2NhbCBzdG9yYWdlIGFuZCB0aGUgc2VydmVyOyBkaXNwbGF5IHNlcnZlciBmZWVkYmFjay5cbiAgICBhc3luYyBsb2dDdXJyZW50QW5zd2VyKHNpZCkge1xuICAgICAgICBsZXQgYW5zd2VyID0gSlNPTi5zdHJpbmdpZnkodGhpcy5naXZlbl9hcnIpO1xuICAgICAgICBsZXQgZmVlZGJhY2sgPSB0cnVlO1xuICAgICAgICAvLyBTYXZlIHRoZSBhbnN3ZXIgbG9jYWxseS5cbiAgICAgICAgdGhpcy5zYXZlQW5zd2Vyc0xvY2FsbHlPbmx5KCk7XG4gICAgICAgIC8vIFNhdmUgdGhlIGFuc3dlciB0byB0aGUgc2VydmVyLlxuICAgICAgICBjb25zdCBkYXRhID0ge1xuICAgICAgICAgICAgZXZlbnQ6IFwiZmlsbGJcIixcbiAgICAgICAgICAgIGRpdl9pZDogdGhpcy5kaXZpZCxcbiAgICAgICAgICAgIGFjdDogYW5zd2VyIHx8IFwiXCIsXG4gICAgICAgICAgICBzZWVkOiB0aGlzLnNlZWQsXG4gICAgICAgICAgICBhbnN3ZXI6IGFuc3dlciB8fCBcIlwiLFxuICAgICAgICAgICAgY29ycmVjdDogdGhpcy5jb3JyZWN0ID8gXCJUXCIgOiBcIkZcIixcbiAgICAgICAgICAgIHBlcmNlbnQ6IHRoaXMucGVyY2VudCxcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHR5cGVvZiBzaWQgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIGRhdGEuc2lkID0gc2lkO1xuICAgICAgICAgICAgZmVlZGJhY2sgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzZXJ2ZXJfZGF0YSA9IGF3YWl0IHRoaXMubG9nQm9va0V2ZW50KGRhdGEpO1xuICAgICAgICBpZiAoIWZlZWRiYWNrKSByZXR1cm47XG4gICAgICAgIC8vIE5vbi1zZXJ2ZXIgc2lkZSBncmFkZWQgcHJvYmxlbXMgYXJlIGRvbmUgYXQgdGhpcyBwb2ludDsgbGlrZXdpc2UsIHN0b3AgaGVyZSBpZiB0aGUgc2VydmVyIGRpZG4ndCByZXNwb25kLlxuICAgICAgICBpZiAodGhpcy5mZWVkYmFja0FycmF5IHx8ICFzZXJ2ZXJfZGF0YSkge1xuICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgIH1cbiAgICAgICAgLy8gVGhpcyBpcyB0aGUgc2VydmVyLXNpZGUgY2FzZS4gT24gc3VjY2VzcywgdXBkYXRlIHRoZSBmZWVkYmFjayBmcm9tIHRoZSBzZXJ2ZXIncyBncmFkZS5cbiAgICAgICAgY29uc3QgcmVzID0gc2VydmVyX2RhdGEuZGV0YWlsO1xuICAgICAgICB0aGlzLnRpbWVzdGFtcCA9IHJlcy50aW1lc3RhbXA7XG4gICAgICAgIHRoaXMuZGlzcGxheUZlZWQgPSByZXMuZGlzcGxheUZlZWQ7XG4gICAgICAgIHRoaXMuY29ycmVjdCA9IHJlcy5jb3JyZWN0O1xuICAgICAgICB0aGlzLmlzQ29ycmVjdEFycmF5ID0gcmVzLmlzQ29ycmVjdEFycmF5O1xuICAgICAgICB0aGlzLnNldExvY2FsU3RvcmFnZSh7XG4gICAgICAgICAgICBzZWVkOiB0aGlzLnNlZWQsXG4gICAgICAgICAgICBhbnN3ZXI6IGFuc3dlcixcbiAgICAgICAgICAgIHRpbWVzdGFtcDogdGhpcy50aW1lc3RhbXAsXG4gICAgICAgICAgICBwcm9ibGVtSHRtbDogdGhpcy5kZXNjcmlwdGlvbkRpdi5pbm5lckhUTUwsXG4gICAgICAgICAgICBkaXNwbGF5RmVlZDogdGhpcy5kaXNwbGF5RmVlZCxcbiAgICAgICAgICAgIGNvcnJlY3Q6IHRoaXMuY29ycmVjdCxcbiAgICAgICAgICAgIGlzQ29ycmVjdEFycmF5OiB0aGlzLmlzQ29ycmVjdEFycmF5LFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5yZW5kZXJGZWVkYmFjaygpO1xuICAgICAgICByZXR1cm4gc2VydmVyX2RhdGE7XG4gICAgfVxuXG4gICAgLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICA9PT0gRXZhbHVhdGlvbiBvZiBhbnN3ZXIgYW5kID09PVxuICAgID09PSAgICAgZGlzcGxheSBmZWVkYmFjayAgICAgPT09XG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbiAgICByZW5kZXJGZWVkYmFjaygpIHtcbiAgICAgICAgLy8gU3RhcnQgZnJvbSBhIGNsZWFuIHNsYXRlOiBhIHByZXZpb3VzIGdyYWRlIG1heSBoYXZlIGxlZnQgYW5cbiAgICAgICAgLy8gYGBhcmlhLWRlc2NyaWJlZGJ5YGAgcG9pbnRpbmcgYXQgZmVlZGJhY2sgYWJvdXQgdG8gYmUgcmVwbGFjZWQuXG4gICAgICAgIHRoaXMuY2xlYXJCbGFua0ZlZWRiYWNrKCk7XG4gICAgICAgIGlmICh0aGlzLmNvcnJlY3QpIHtcbiAgICAgICAgICAgIHRoaXMuZmVlZEJhY2tEaXYuY2xhc3NOYW1lID0gXCJhbGVydCBhbGVydC1pbmZvIGZpdGItZmVlZGJhY2tcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmRpc3BsYXlGZWVkID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5RmVlZCA9IFwiXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmZlZWRCYWNrRGl2LmNsYXNzTmFtZSA9IFwiYWxlcnQgYWxlcnQtZGFuZ2VyIGZpdGItZmVlZGJhY2tcIjtcbiAgICAgICAgfVxuICAgICAgICAvLyBNYXJrIHRoZSBibGFua3MgdGhlbXNlbHZlcy4gVGhlIHJlZCBib3JkZXIgaXMgaW52aXNpYmxlIHRvIGEgc2NyZWVuXG4gICAgICAgIC8vIHJlYWRlcjsgYGBhcmlhLWludmFsaWRgYCBpcyB3aGF0IGl0IHJlcG9ydHMgd2hlbiBmb2N1cyByZXR1cm5zLlxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuYmxhbmtBcnJheS5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgY29uc3Qgd3JvbmcgPSAhdGhpcy5jb3JyZWN0ICYmIHRoaXMuaXNDb3JyZWN0QXJyYXlbal0gIT09IHRydWU7XG4gICAgICAgICAgICB0aGlzLmJsYW5rQXJyYXlbal0uY2xhc3NMaXN0LnRvZ2dsZShcbiAgICAgICAgICAgICAgICBcImlucHV0LXZhbGlkYXRpb24tZXJyb3JcIixcbiAgICAgICAgICAgICAgICB3cm9uZyxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB0aGlzLmJsYW5rQXJyYXlbal0uc2V0QXR0cmlidXRlKFxuICAgICAgICAgICAgICAgIFwiYXJpYS1pbnZhbGlkXCIsXG4gICAgICAgICAgICAgICAgd3JvbmcgPyBcInRydWVcIiA6IFwiZmFsc2VcIixcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBIHNpbmdsZSBwaWVjZSBvZiBmZWVkYmFjayBpcyBub3QgYSBsaXN0OyBkb24ndCBtYWtlIGEgc2NyZWVuIHJlYWRlclxuICAgICAgICAvLyBhbm5vdW5jZSBcImxpc3QsIDEgaXRlbVwiIGZvciBpdC5cbiAgICAgICAgY29uc3Qgc2luZ2xlID0gdGhpcy5kaXNwbGF5RmVlZC5sZW5ndGggPT09IDE7XG4gICAgICAgIGNvbnN0IGxpc3QgPSBzaW5nbGVcbiAgICAgICAgICAgID8gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpXG4gICAgICAgICAgICA6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ1bFwiKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmRpc3BsYXlGZWVkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgZGYgPSB0aGlzLmRpc3BsYXlGZWVkW2ldO1xuICAgICAgICAgICAgY29uc3Qgb2sgPSB0aGlzLmlzQ29ycmVjdEFycmF5W2ldID09PSB0cnVlO1xuICAgICAgICAgICAgLy8gUmVuZGVyIGFueSBkeW5hbWljIGZlZWRiYWNrIGluIHRoZSBwcm92aWRlZCBmZWVkYmFjaywgZm9yIGNsaWVudC1zaWRlIGdyYWRpbmcgb2YgZHluYW1pYyBwcm9ibGVtcy5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5keW5fdmFycyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgIGRmID0gcmVuZGVyRHluYW1pY0ZlZWRiYWNrKFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJsYW5rTmFtZXMsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2l2ZW5fYXJyLFxuICAgICAgICAgICAgICAgICAgICBpLFxuICAgICAgICAgICAgICAgICAgICBkZixcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5keW5fdmFyc19ldmFsLFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgLy8gQ29udmVydCB0aGUgcmV0dXJuZWQgTm9kZUxpc3QgaW50byBhIHN0cmluZyBvZiBIVE1MLlxuICAgICAgICAgICAgICAgIGRmID1cbiAgICAgICAgICAgICAgICAgICAgZGY/LlswXSAhPT0gdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgICAgICAgICA/IGRmWzBdLnBhcmVudEVsZW1lbnQuaW5uZXJIVE1MXG4gICAgICAgICAgICAgICAgICAgICAgICA6IFwiTm8gZmVlZGJhY2sgcHJvdmlkZWRcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHNpbmdsZSA/IFwic3BhblwiIDogXCJsaVwiKTtcbiAgICAgICAgICAgIGl0ZW0uaWQgPSBgJHt0aGlzLmRpdmlkfV9mZWVkYmFja18ke2l9YDtcbiAgICAgICAgICAgIC8vIFRoZSBjaGVjayBvciBjcm9zcyBpcyBkZWNvcmF0aW9uIC0tIHNjcmVlbiByZWFkZXJzIGVpdGhlciBza2lwIGl0XG4gICAgICAgICAgICAvLyBvciByZWFkIHRoZSBlbW9qaSdzIG5hbWUuIEhpZGUgaXQgYW5kIHNheSB0aGUgd29yZCBpbnN0ZWFkLlxuICAgICAgICAgICAgY29uc3QgbWFyayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgICAgICAgICAgbWFyay5zZXRBdHRyaWJ1dGUoXCJhcmlhLWhpZGRlblwiLCBcInRydWVcIik7XG4gICAgICAgICAgICBtYXJrLnRleHRDb250ZW50ID0gb2sgPyBcIuKclO+4j1wiIDogXCLinJbvuI9cIjtcbiAgICAgICAgICAgIGNvbnN0IHNwb2tlbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgICAgICAgICAgc3Bva2VuLmNsYXNzTmFtZSA9IFwidmlzdWFsbHloaWRkZW5cIjtcbiAgICAgICAgICAgIHNwb2tlbi50ZXh0Q29udGVudCA9IGAke1xuICAgICAgICAgICAgICAgIG9rID8gdChcIm1zZ19maXRiX2NvcnJlY3RcIikgOiB0KFwibXNnX2ZpdGJfaW5jb3JyZWN0XCIpXG4gICAgICAgICAgICB9IGA7XG4gICAgICAgICAgICBjb25zdCBib2R5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgICAgICAgICBib2R5LmlubmVySFRNTCA9IGRmID8/IFwiXCI7XG4gICAgICAgICAgICBpdGVtLmFwcGVuZChtYXJrLCBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIiBcIiksIHNwb2tlbiwgYm9keSk7XG4gICAgICAgICAgICBsaXN0LmFwcGVuZENoaWxkKGl0ZW0pO1xuICAgICAgICAgICAgLy8gVGllIHRoZSBmZWVkYmFjayB0byB0aGUgYmxhbmsgaXQgZ3JhZGVzLCBzbyB0YWJiaW5nIGJhY2sgaW50byBhXG4gICAgICAgICAgICAvLyB3cm9uZyBhbnN3ZXIgcmVwZWF0cyB3aHkgaXQgd2FzIHdyb25nLlxuICAgICAgICAgICAgaWYgKHRoaXMuYmxhbmtBcnJheVtpXSkge1xuICAgICAgICAgICAgICAgIHRoaXMuYmxhbmtBcnJheVtpXS5zZXRBdHRyaWJ1dGUoXCJhcmlhLWRlc2NyaWJlZGJ5XCIsIGl0ZW0uaWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuZmVlZEJhY2tEaXYuaW5uZXJIVE1MID0gXCJcIjtcbiAgICAgICAgaWYgKHRoaXMuZGlzcGxheUZlZWQubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgLy8gV2l0aCBzZXZlcmFsIGJsYW5rcyB0aGUgcGVyLWJsYW5rIG1hcmtzIGFyZSBlYXN5IHRvIGxvc2UgdHJhY2tcbiAgICAgICAgICAgIC8vIG9mOyBsZWFkIHRoZSBhbm5vdW5jZW1lbnQgd2l0aCB0aGUgb3ZlcmFsbCB2ZXJkaWN0LlxuICAgICAgICAgICAgY29uc3Qgc3VtbWFyeSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICBzdW1tYXJ5LmNsYXNzTmFtZSA9IFwidmlzdWFsbHloaWRkZW5cIjtcbiAgICAgICAgICAgIHN1bW1hcnkudGV4dENvbnRlbnQgPSB0aGlzLmNvcnJlY3RcbiAgICAgICAgICAgICAgICA/IHQoXCJtc2dfZml0Yl9yZXN1bHRfY29ycmVjdFwiKVxuICAgICAgICAgICAgICAgIDogdChcIm1zZ19maXRiX3Jlc3VsdF9pbmNvcnJlY3RcIik7XG4gICAgICAgICAgICB0aGlzLmZlZWRCYWNrRGl2LmFwcGVuZENoaWxkKHN1bW1hcnkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZmVlZEJhY2tEaXYuYXBwZW5kQ2hpbGQobGlzdCk7XG4gICAgICAgIHRoaXMucXVldWVNYXRoSmF4KHRoaXMuZmVlZEJhY2tEaXYpO1xuICAgIH1cblxuICAgIC8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09PSBGdW5jdGlvbnMgZm9yIGNvbXBhcmUgYnV0dG9uID09PVxuICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuICAgIGVuYWJsZUNvbXBhcmVCdXR0b24oKSB7XG4gICAgICAgIHRoaXMuY29tcGFyZUJ1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgIH1cbiAgICAvLyBfYGNvbXBhcmVGSVRCQW5zd2Vyc2BcbiAgICBhc3luYyBjb21wYXJlRklUQkFuc3dlcnMoKSB7XG4gICAgICAgIHZhciBkYXRhID0ge307XG4gICAgICAgIGRhdGEuZGl2X2lkID0gdGhpcy5kaXZpZDtcbiAgICAgICAgZGF0YS5jb3Vyc2UgPSBlQm9va0NvbmZpZy5jb3Vyc2U7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBwYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKGRhdGEpO1xuICAgICAgICAgICAgY29uc3QgcmVzcCA9IGF3YWl0IGZldGNoKFxuICAgICAgICAgICAgICAgIGAke2VCb29rQ29uZmlnLm5ld19zZXJ2ZXJfcHJlZml4fS9hc3Nlc3NtZW50L2dldHRvcDEwQW5zd2Vycz8ke3BhcmFtcy50b1N0cmluZygpfWAsXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgY29uc3QganNvbiA9IGF3YWl0IHJlc3AuanNvbigpO1xuICAgICAgICAgICAgdGhpcy5jb21wYXJlRklUQihqc29uKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yIGZldGNoaW5nIHRvcCBhbnN3ZXJzOlwiLCBlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjb21wYXJlRklUQihkYXRhLCBzdGF0dXMsIHdoYXRldmVyKSB7XG4gICAgICAgIGNvbnN0IGFuc3dlcnMgPSBkYXRhLmRldGFpbC5yZXM7XG4gICAgICAgIGNvbnN0IHRpdGxlSWQgPSBgJHt0aGlzLmRpdmlkfV9jb21wYXJlX3RpdGxlYDtcbiAgICAgICAgLy8gQSByZWFsIGhlYWRlciByb3csIG1hcmtlZCB1cCBhcyBvbmUsIHNvIGEgc2NyZWVuIHJlYWRlciBjYW4gYW5ub3VuY2VcbiAgICAgICAgLy8gdGhlIGNvbHVtbiB3aGVuIHJlYWRpbmcgZG93biB0aGUgdGFibGUuXG4gICAgICAgIGxldCBib2R5ID0gXCI8dGFibGU+PHRoZWFkPjx0cj5cIjtcbiAgICAgICAgYm9keSArPSBcIjx0aCBzY29wZT0nY29sJz5BbnN3ZXI8L3RoPjx0aCBzY29wZT0nY29sJz5Db3VudDwvdGg+XCI7XG4gICAgICAgIGJvZHkgKz0gXCI8L3RyPjwvdGhlYWQ+PHRib2R5PlwiO1xuICAgICAgICBmb3IgKGNvbnN0IHJvdyBpbiBhbnN3ZXJzKSB7XG4gICAgICAgICAgICBib2R5ICs9XG4gICAgICAgICAgICAgICAgXCI8dHI+PHRkPlwiICtcbiAgICAgICAgICAgICAgICBhbnN3ZXJzW3Jvd10uYW5zd2VyICtcbiAgICAgICAgICAgICAgICBcIjwvdGQ+PHRkPlwiICtcbiAgICAgICAgICAgICAgICBhbnN3ZXJzW3Jvd10uY291bnQgK1xuICAgICAgICAgICAgICAgIFwiIHRpbWVzPC90ZD48L3RyPlwiO1xuICAgICAgICB9XG4gICAgICAgIGJvZHkgKz0gXCI8L3Rib2R5PjwvdGFibGU+XCI7XG5cbiAgICAgICAgLy8gU2ltcGxlIG1vZGFsIHdpdGhvdXQgQm9vdHN0cmFwL2pRdWVyeVxuICAgICAgICBjb25zdCBwcmV2aW91c2x5Rm9jdXNlZCA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG4gICAgICAgIGNvbnN0IG92ZXJsYXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBvdmVybGF5LnN0eWxlLnBvc2l0aW9uID0gXCJmaXhlZFwiO1xuICAgICAgICBvdmVybGF5LnN0eWxlLmluc2V0ID0gXCIwXCI7XG4gICAgICAgIG92ZXJsYXkuc3R5bGUuYmFja2dyb3VuZCA9IFwicmdiYSgwLDAsMCwwLjUpXCI7XG4gICAgICAgIG92ZXJsYXkuc3R5bGUuekluZGV4ID0gXCI5OTk5XCI7XG5cbiAgICAgICAgY29uc3QgZGlhbG9nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgZGlhbG9nLmNsYXNzTmFtZSA9IFwiY29tcGFyZS1tb2RhbFwiO1xuICAgICAgICAvLyBBbm5vdW5jZSB0aGlzIGFzIGEgZGlhbG9nIG5hbWVkIGJ5IGl0cyBoZWFkaW5nLCBhbmQgaGlkZSB0aGUgcGFnZVxuICAgICAgICAvLyBiZWhpbmQgaXQgZnJvbSBhc3Npc3RpdmUgdGVjaG5vbG9neSB3aGlsZSBpdCBpcyBvcGVuLlxuICAgICAgICBkaWFsb2cuc2V0QXR0cmlidXRlKFwicm9sZVwiLCBcImRpYWxvZ1wiKTtcbiAgICAgICAgZGlhbG9nLnNldEF0dHJpYnV0ZShcImFyaWEtbW9kYWxcIiwgXCJ0cnVlXCIpO1xuICAgICAgICBkaWFsb2cuc2V0QXR0cmlidXRlKFwiYXJpYS1sYWJlbGxlZGJ5XCIsIHRpdGxlSWQpO1xuICAgICAgICBkaWFsb2cudGFiSW5kZXggPSAtMTtcbiAgICAgICAgZGlhbG9nLnN0eWxlLm1heFdpZHRoID0gXCI3MjBweFwiO1xuICAgICAgICBkaWFsb2cuc3R5bGUubWFyZ2luID0gXCIxMHZoIGF1dG9cIjtcbiAgICAgICAgZGlhbG9nLnN0eWxlLmJhY2tncm91bmQgPSBcIiNmZmZcIjtcbiAgICAgICAgZGlhbG9nLnN0eWxlLmJvcmRlclJhZGl1cyA9IFwiNnB4XCI7XG4gICAgICAgIGRpYWxvZy5zdHlsZS5ib3hTaGFkb3cgPSBcIjAgMnB4IDEycHggcmdiYSgwLDAsMCwwLjMpXCI7XG4gICAgICAgIGRpYWxvZy5zdHlsZS5wYWRkaW5nID0gXCIxNnB4XCI7XG5cbiAgICAgICAgY29uc3QgY2xvc2UgPSAoKSA9PiB7XG4gICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBvbktleWRvd24sIHRydWUpO1xuICAgICAgICAgICAgb3ZlcmxheS5yZW1vdmUoKTtcbiAgICAgICAgICAgIC8vIFB1dCB0aGUgdXNlciBiYWNrIHdoZXJlIHRoZXkgd2VyZSwgbm90IGF0IHRoZSB0b3Agb2YgdGhlIHBhZ2UuXG4gICAgICAgICAgICBpZiAocHJldmlvdXNseUZvY3VzZWQgJiYgcHJldmlvdXNseUZvY3VzZWQuZm9jdXMpIHtcbiAgICAgICAgICAgICAgICBwcmV2aW91c2x5Rm9jdXNlZC5mb2N1cygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICAvLyBFc2NhcGUgY2xvc2VzLCBhbmQgVGFiIGN5Y2xlcyBpbnNpZGUgdGhlIGRpYWxvZzogYGBhcmlhLW1vZGFsYGAgdGVsbHNcbiAgICAgICAgLy8gYSBzY3JlZW4gcmVhZGVyIHRoZSByZXN0IG9mIHRoZSBwYWdlIGlzIGluZXJ0LCBidXQgZG9lcyBub3Qga2VlcCB0aGVcbiAgICAgICAgLy8ga2V5Ym9hcmQgZnJvbSB0YWJiaW5nIG91dCBpbnRvIGl0LlxuICAgICAgICBjb25zdCBvbktleWRvd24gPSAoZXYpID0+IHtcbiAgICAgICAgICAgIGlmIChldi5rZXkgPT09IFwiRXNjYXBlXCIpIHtcbiAgICAgICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGNsb3NlKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGV2LmtleSAhPT0gXCJUYWJcIikge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGZvY3VzYWJsZSA9IGRpYWxvZy5xdWVyeVNlbGVjdG9yQWxsKFxuICAgICAgICAgICAgICAgIFwiYnV0dG9uLCBbaHJlZl0sIGlucHV0LCBzZWxlY3QsIHRleHRhcmVhLCBbdGFiaW5kZXhdOm5vdChbdGFiaW5kZXg9Jy0xJ10pXCIsXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgaWYgKCFmb2N1c2FibGUubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgZmlyc3QgPSBmb2N1c2FibGVbMF07XG4gICAgICAgICAgICBjb25zdCBsYXN0ID0gZm9jdXNhYmxlW2ZvY3VzYWJsZS5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgIGlmIChldi5zaGlmdEtleSAmJiBkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBmaXJzdCkge1xuICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgbGFzdC5mb2N1cygpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICghZXYuc2hpZnRLZXkgJiYgZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gbGFzdCkge1xuICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgZmlyc3QuZm9jdXMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBoZWFkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBjb25zdCBjbG9zZUJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICAgIGNsb3NlQnRuLnR5cGUgPSBcImJ1dHRvblwiO1xuICAgICAgICAvLyBUaGUgZ2x5cGggaXMgZGVjb3JhdGlvbjsgdGhlIGJ1dHRvbiBuZWVkcyBhIG5hbWUgdGhhdCBjYW4gYmUgc3Bva2VuLlxuICAgICAgICBjb25zdCBjbG9zZUdseXBoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgICAgIGNsb3NlR2x5cGguc2V0QXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIiwgXCJ0cnVlXCIpO1xuICAgICAgICBjbG9zZUdseXBoLnRleHRDb250ZW50ID0gXCJcXHUwMGQ3XCI7XG4gICAgICAgIGNsb3NlQnRuLmFwcGVuZENoaWxkKGNsb3NlR2x5cGgpO1xuICAgICAgICBjbG9zZUJ0bi5zZXRBdHRyaWJ1dGUoXCJhcmlhLWxhYmVsXCIsIHQoXCJtc2dfZml0Yl9jbG9zZVwiKSk7XG4gICAgICAgIGNsb3NlQnRuLnN0eWxlLmZsb2F0ID0gXCJyaWdodFwiO1xuICAgICAgICBjbG9zZUJ0bi5jbGFzc05hbWUgPSBcImJ0biBidG4tbGlnaHRcIjtcbiAgICAgICAgY2xvc2VCdG4ub25jbGljayA9IGNsb3NlO1xuICAgICAgICBjb25zdCB0aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoNFwiKTtcbiAgICAgICAgdGl0bGUuY2xhc3NOYW1lID0gXCJtb2RhbC10aXRsZVwiO1xuICAgICAgICB0aXRsZS5pZCA9IHRpdGxlSWQ7XG4gICAgICAgIHRpdGxlLnRleHRDb250ZW50ID0gdChcIm1zZ19maXRiX3RvcF9hbnN3ZXJzXCIpO1xuICAgICAgICBoZWFkZXIuYXBwZW5kQ2hpbGQoY2xvc2VCdG4pO1xuICAgICAgICBoZWFkZXIuYXBwZW5kQ2hpbGQodGl0bGUpO1xuXG4gICAgICAgIGNvbnN0IG1vZGFsQm9keSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIG1vZGFsQm9keS5pbm5lckhUTUwgPSBib2R5O1xuXG4gICAgICAgIGRpYWxvZy5hcHBlbmRDaGlsZChoZWFkZXIpO1xuICAgICAgICBkaWFsb2cuYXBwZW5kQ2hpbGQobW9kYWxCb2R5KTtcbiAgICAgICAgb3ZlcmxheS5hcHBlbmRDaGlsZChkaWFsb2cpO1xuICAgICAgICBvdmVybGF5LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXYpID0+IHtcbiAgICAgICAgICAgIGlmIChldi50YXJnZXQgPT09IG92ZXJsYXkpIHtcbiAgICAgICAgICAgICAgICBjbG9zZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChvdmVybGF5KTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgb25LZXlkb3duLCB0cnVlKTtcbiAgICAgICAgZGlhbG9nLmZvY3VzKCk7XG4gICAgfVxuXG4gICAgZGlzYWJsZUludGVyYWN0aW9uKCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYmxhbmtBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgLy8gUmVhZC1vbmx5IHJhdGhlciB0aGFuIGRpc2FibGVkOiBhIGRpc2FibGVkIGlucHV0IGlzIHNraXBwZWQgYnlcbiAgICAgICAgICAgIC8vIHRoZSBrZXlib2FyZCBhbmQgYnkgc2NyZWVuIHJlYWRlcnMsIHNvIGEgc3R1ZGVudCByZXZpZXdpbmcgYVxuICAgICAgICAgICAgLy8gZmluaXNoZWQgdGltZWQgZXhhbSBjb3VsZCBubyBsb25nZXIgaGVhciB3aGF0IHRoZXkgYW5zd2VyZWQuXG4gICAgICAgICAgICB0aGlzLmJsYW5rQXJyYXlbaV0ucmVhZE9ubHkgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5ibGFua0FycmF5W2ldLnNldEF0dHJpYnV0ZShcImFyaWEtZGlzYWJsZWRcIiwgXCJ0cnVlXCIpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT0gRmluZCB0aGUgY3VzdG9tIEhUTUwgdGFncyBhbmQgPT1cbj09ICAgZXhlY3V0ZSBvdXIgY29kZSBvbiB0aGVtICAgID09XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInJ1bmVzdG9uZTpsb2dpbi1jb21wbGV0ZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgZG9jdW1lbnRcbiAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoXCJbZGF0YS1jb21wb25lbnQ9ZmlsbGludGhlYmxhbmtdXCIpXG4gICAgICAgIC5mb3JFYWNoKGZ1bmN0aW9uIChlbCwgaW5kZXgpIHtcbiAgICAgICAgICAgIHZhciBvcHRzID0ge1xuICAgICAgICAgICAgICAgIG9yaWc6IGVsLFxuICAgICAgICAgICAgICAgIHVzZVJ1bmVzdG9uZVNlcnZpY2VzOiBlQm9va0NvbmZpZy51c2VSdW5lc3RvbmVTZXJ2aWNlcyxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAoIWVsLmNsb3Nlc3QoXCJbZGF0YS1jb21wb25lbnQ9dGltZWRBc3Nlc3NtZW50XVwiKSkge1xuICAgICAgICAgICAgICAgIC8vIElmIHRoaXMgZWxlbWVudCBleGlzdHMgd2l0aGluIGEgdGltZWQgY29tcG9uZW50LCBkb24ndCByZW5kZXIgaXQgaGVyZVxuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIEZJVEJMaXN0W2VsLmlkXSA9IG5ldyBGSVRCKG9wdHMpO1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuY29tcG9uZW50TWFwW2VsLmlkXSA9IEZJVEJMaXN0W2VsLmlkXTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5hc3NlcnQoXG4gICAgICAgICAgICAgICAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGBFcnJvciByZW5kZXJpbmcgRmlsbCBpbiB0aGUgQmxhbmsgUHJvYmxlbSAke2VsLmlkfVxuICAgICAgICAgICAgICAgICAgICAgRGV0YWlsczogJHtlcnJ9YCxcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xufSk7XG4iLCJpbXBvcnQgeyBsb2FkIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9qcy9yc2kxOG4uanNcIjtcblxubG9hZCh7XG4gICAgXCJzci1DeXJsXCI6IHtcbiAgICAgICAgbXNnX25vX2Fuc3dlcjogXCLQndC10L7QtNCz0L7QstC+0YDQtdC90L4uXCIsXG4gICAgICAgIG1zZ19maXRiX2NoZWNrX21lOiBcItCf0YDQvtCy0LXRgNC4XCIsXG4gICAgICAgIG1zZ19maXRiX2NvbXBhcmVfbWU6IFwi0KPQv9C+0YDQtdC00LhcIixcbiAgICB9LFxufSk7XG4iLCIvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy8gfGRvY25hbWV8IC0gZ3JhZGluZy1yZWxhdGVkIHV0aWxpdGllcyBmb3IgRklUQiBxdWVzdGlvbnNcbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyBUaGlzIGNvZGUgcnVucyBib3RoIG9uIHRoZSBzZXJ2ZXIgKGZvciBzZXJ2ZXItc2lkZSBncmFkaW5nKSBhbmQgb24gdGhlIGNsaWVudC4gSXQncyBwbGFjZWQgaGVyZSBhcyBhIHNldCBvZiBmdW5jdGlvbnMgc3BlY2lmaWNhbGx5IGZvciB0aGlzIHB1cnBvc2UuXG5cblwidXNlIHN0cmljdFwiO1xuXG5pbXBvcnQgeyBhbGVhUFJORyB9IGZyb20gXCIuL2xpYnMvYWxlYVBSTkctMS4xLmpzXCI7XG5cbi8vIEluY2x1ZGVzXG4vLyA9PT09PT09PVxuLy8gTm9uZS5cbi8vXG4vL1xuLy8gR2xvYmFsc1xuLy8gPT09PT09PVxuZnVuY3Rpb24gcmVuZGVyX2h0bWwoaHRtbF9pbiwgZHluX3ZhcnNfZXZhbCkge1xuICAgIC8vIENoYW5nZSB0aGUgcmVwbGFjZW1lbnQgdG9rZW5zIGluIHRoZSBIVE1MIGludG8gdGFncywgc28gd2UgY2FuIHJlcGxhY2UgdGhlbSB1c2luZyBYTUwuIFRoZSBob3JyaWJsZSByZWdleCBpczpcbiAgICAvL1xuICAgIC8vIExvb2sgZm9yIHRoZSBjaGFyYWN0ZXJzIGBgWyU9YGAgKHRoZSBvcGVuaW5nIGRlbGltaXRlcilcbiAgICAvLy8gXFxbJT1cbiAgICAvLyBGb2xsb3dlZCBieSBhbnkgYW1vdW50IG9mIHdoaXRlc3BhY2UuXG4gICAgLy8vIFxccypcbiAgICAvLyBTdGFydCBhIGdyb3VwIHRoYXQgd2lsbCBjYXB0dXJlIHRoZSBjb250ZW50cyAoZXhjbHVkaW5nIHdoaXRlc3BhY2UpIG9mIHRoZSB0b2tlbnMuIEZvciBleGFtcGxlLCBnaXZlbiBgYFslPSBmb28oKSAlXWBgLCB0aGUgY29udGVudHMgaXMgYGBmb28oKWBgLlxuICAgIC8vLyAoXG4gICAgLy8gRG9uJ3QgY2FwdHVyZSB0aGUgY29udGVudHMgb2YgdGhpcyBncm91cCwgc2luY2UgaXQncyBvbmx5IGEgc2luZ2xlIGNoYXJhY3Rlci4gTWF0Y2ggYW55IGNoYXJhY3Rlci4uLlxuICAgIC8vLyAoXG4gICAgLy8vID86LlxuICAgIC8vLyAuLi50aGF0IGRvZXNuJ3QgZW5kIHdpdGggYGAlXWBgICh0aGUgY2xvc2luZyBkZWxpbWl0ZXIpLlxuICAgIC8vLyAoPyElXSlcbiAgICAvLy8gKVxuICAgIC8vIE1hdGNoIHRoaXMgKGFueXRoaW5nIGJ1dCB0aGUgY2xvc2luZyBkZWxpbWl0ZXIpIGFzIG11Y2ggYXMgd2UgY2FuLlxuICAgIC8vLyAqKVxuICAgIC8vIE5leHQsIGxvb2sgZm9yIGFueSB3aGl0ZXNwYWNlLlxuICAgIC8vLyBcXHMqXG4gICAgLy8gRmluYWxseSwgbG9vayBmb3IgdGhlIGNsb3NpbmcgZGVsaW1pdGVyIGBgJV1gYC5cbiAgICAvLy8gJVxcXVxuICAgIGNvbnN0IGh0bWxfcmVwbGFjZWQgPSBodG1sX2luLnJlcGxhY2VBbGwoXG4gICAgICAgIC9cXFslPVxccyooKD86Lig/ISVdKSkqKVxccyolXFxdL2csXG4gICAgICAgIC8vIFJlcGxhY2UgaXQgd2l0aCBhIGA8c2NyaXB0LWV2YWw+YCB0YWcuIFF1b3RlIHRoZSBzdHJpbmcsIHdoaWNoIHdpbGwgYXV0b21hdGljYWxseSBlc2NhcGUgYW55IGRvdWJsZSBxdW90ZXMsIHVzaW5nIEpTT04uXG4gICAgICAgIChtYXRjaCwgZ3JvdXAxKSA9PlxuICAgICAgICAgICAgYDxzY3JpcHQtZXZhbCBleHByPSR7SlNPTi5zdHJpbmdpZnkoZ3JvdXAxKX0+PC9zY3JpcHQtZXZhbD5gLFxuICAgICk7XG4gICAgLy8gR2l2ZW4gSFRNTCwgdHVybiBpdCBpbnRvIGEgRE9NLiBXYWxrIHRoZSBgYDxzY3JpcHQtZXZhbD5gYCB0YWdzLCBwZXJmb3JtaW5nIHRoZSByZXF1ZXN0ZWQgZXZhbHVhdGlvbiBvbiB0aGVtLlxuICAgIC8vXG4gICAgLy8gU2VlIGBET01QYXJzZXIgPGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9ET01QYXJzZXI+YF8uXG4gICAgY29uc3QgcGFyc2VyID0gbmV3IERPTVBhcnNlcigpO1xuICAgIC8vIFNlZSBgRE9NUGFyc2VyLnBhcnNlRnJvbVN0cmluZygpIDxodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRE9NUGFyc2VyL3BhcnNlRnJvbVN0cmluZz5gXy5cbiAgICBjb25zdCBkb2MgPSBwYXJzZXIucGFyc2VGcm9tU3RyaW5nKGh0bWxfcmVwbGFjZWQsIFwidGV4dC9odG1sXCIpO1xuICAgIGNvbnN0IHNjcmlwdF9ldmFsX3RhZ3MgPSBkb2MuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzY3JpcHQtZXZhbFwiKTtcbiAgICB3aGlsZSAoc2NyaXB0X2V2YWxfdGFncy5sZW5ndGgpIHtcbiAgICAgICAgLy8gR2V0IHRoZSBmaXJzdCB0YWcuIEl0IHdpbGwgYmUgcmVtb3ZlZCBmcm9tIHRoZSBjb2xsZWN0aW9uIGFmdGVyIGl0J3MgcmVwbGFjZWQgd2l0aCBpdHMgdmFsdWUuXG4gICAgICAgIGNvbnN0IHNjcmlwdF9ldmFsX3RhZyA9IHNjcmlwdF9ldmFsX3RhZ3NbMF07XG4gICAgICAgIC8vIFNlZSBpZiB0aGlzIGBgPHNjcmlwdC1ldmFsPmBgIHRhZyBoYXMgYXMgYGBAZXhwcmBgIGF0dHJpYnV0ZS5cbiAgICAgICAgY29uc3QgZXhwciA9IHNjcmlwdF9ldmFsX3RhZy5nZXRBdHRyaWJ1dGUoXCJleHByXCIpO1xuICAgICAgICAvLyBJZiBzbywgZXZhbHVhdGUgaXQuXG4gICAgICAgIGlmIChleHByKSB7XG4gICAgICAgICAgICBjb25zdCBldmFsX3Jlc3VsdCA9IHdpbmRvdy5GdW5jdGlvbihcbiAgICAgICAgICAgICAgICBcInZcIixcbiAgICAgICAgICAgICAgICAuLi5PYmplY3Qua2V5cyhkeW5fdmFyc19ldmFsKSxcbiAgICAgICAgICAgICAgICBgXCJ1c2Ugc3RyaWN0O1wiXFxucmV0dXJuICR7ZXhwcn07YCxcbiAgICAgICAgICAgICkoZHluX3ZhcnNfZXZhbCwgLi4uT2JqZWN0LnZhbHVlcyhkeW5fdmFyc19ldmFsKSk7XG4gICAgICAgICAgICAvLyBSZXBsYWNlIHRoZSB0YWcgd2l0aCB0aGUgcmVzdWx0aW5nIHZhbHVlLlxuICAgICAgICAgICAgc2NyaXB0X2V2YWxfdGFnLnJlcGxhY2VXaXRoKGV2YWxfcmVzdWx0KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJldHVybiB0aGUgYm9keSBjb250ZW50cy4gTm90ZSB0aGF0IHRoZSBgYERPTVBhcnNlcmBgIGNvbnN0cnVjdHMgYW4gZW50aXJlIGRvY3VtZW50LCBub3QganVzdCB0aGUgZG9jdW1lbnQgZnJhZ21lbnQgd2UgcGFzc2VkIGl0LiBUaGVyZWZvcmUsIGV4dHJhY3QgdGhlIGRlc2lyZWQgZnJhZ21lbnQgYW5kIHJldHVybiB0aGF0LiBOb3RlIHRoYXQgd2UgbmVlZCB0byB1c2UgYGNoaWxkTm9kZXMgPGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9Ob2RlL2NoaWxkTm9kZXM+YF8sIHdoaWNoIGluY2x1ZGVzIG5vbi1lbGVtZW50IGNoaWxkcmVuIGxpa2UgdGV4dCBhbmQgY29tbWVudHM7IHVzaW5nIGBgY2hpbGRyZW5gYCBvbWl0cyB0aGVzZSBub24tZWxlbWVudCBjaGlsZHJlbi5cbiAgICByZXR1cm4gZG9jLmJvZHkuY2hpbGROb2Rlcztcbn1cblxuLy8gRnVuY3Rpb25zXG4vLyA9PT09PT09PT1cbi8vIFVwZGF0ZSB0aGUgcHJvYmxlbSdzIGRlc2NyaXB0aW9uIGJhc2VkIG9uIGR5bmFtaWNhbGx5LWdlbmVyYXRlZCBjb250ZW50LlxuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlckR5bmFtaWNDb250ZW50KFxuICAgIHNlZWQsXG4gICAgZHluX3ZhcnMsXG4gICAgZHluX2ltcG9ydHMsXG4gICAgaHRtbF9pbixcbiAgICBkaXZpZCxcbiAgICBwcmVwYXJlQ2hlY2tBbnN3ZXJzLFxuKSB7XG4gICAgLy8gSW5pdGlhbGl6ZSBSTkcgd2l0aCBgYHNlZWRgYC5cbiAgICBjb25zdCByYW5kID0gYWxlYVBSTkcoc2VlZCk7XG5cbiAgICAvLyBTZWUgYFJBTkRfRlVOQyA8UkFORF9GVU5DPmBfLCB3aGljaCByZWZlcnMgdG8gYGByYW5kYGAgYWJvdmUuXG4gICAgY29uc3QgZHluX3ZhcnNfZXZhbCA9IHdpbmRvdy5GdW5jdGlvbihcbiAgICAgICAgXCJ2XCIsXG4gICAgICAgIFwicmFuZFwiLFxuICAgICAgICAuLi5PYmplY3Qua2V5cyhkeW5faW1wb3J0cyksXG4gICAgICAgIGBcInVzZSBzdHJpY3RcIjtcXG4ke2R5bl92YXJzfTtcXG5yZXR1cm4gdjtgLFxuICAgICkoXG4gICAgICAgIC8vIFdlIHdhbnQgdi5kaXZpZCA9IGRpdmlkIGFuZCB2LnByZXBhcmVDaGVja0Fuc3dlcnMgPSBwcmVwYXJlQ2hlY2tBbnN3ZXJzLiBJbiBjb250cmFzdCwgdGhlIGtleS92YWx1ZXMgcGFpcnMgb2YgZHluX2ltcG9ydHMgc2hvdWxkIGJlIGRpcmVjdGx5IGFzc2lnbmVkIHRvIHYsIGhlbmNlIHRoZSBPYmplY3QuYXNzaWduLlxuICAgICAgICBPYmplY3QuYXNzaWduKHsgZGl2aWQsIHByZXBhcmVDaGVja0Fuc3dlcnMgfSwgZHluX2ltcG9ydHMpLFxuICAgICAgICByYW5kLFxuICAgICAgICAvLyBJbiBhZGRpdGlvbiB0byBwcm92aWRpbmcgdGhpcyBpbiB2LCBtYWtlIGl0IGF2YWlsYWJsZSBpbiB0aGUgZnVuY3Rpb24gYXMgd2VsbCwgc2luY2UgbW9zdCBwcm9ibGVtIGF1dGhvcnMgd2lsbCB3cml0ZSBgYGZvbyA9IG5ldyBCVE0oKWBgIChmb3IgZXhhbXBsZSwgYXNzdW1pbmcgQlRNIGlzIGluIGR5bl9pbXBvcnRzKSBpbnN0ZWFkIG9mIGBgZm9vID0gbmV3IHYuQlRNKClgYCAod2hpY2ggaXMgdW51c3VhbCBzeW50YXgpLlxuICAgICAgICAuLi5PYmplY3QudmFsdWVzKGR5bl9pbXBvcnRzKSxcbiAgICApO1xuXG4gICAgbGV0IGh0bWxfb3V0O1xuICAgIGlmICh0eXBlb2YgZHluX3ZhcnNfZXZhbC5iZWZvcmVDb250ZW50UmVuZGVyID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGR5bl92YXJzX2V2YWwuYmVmb3JlQ29udGVudFJlbmRlcihkeW5fdmFyc19ldmFsKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmFzc2VydChcbiAgICAgICAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICAgICAgICBgRXJyb3IgaW4gcHJvYmxlbSAke2RpdmlkfSBpbnZva2luZyBiZWZvcmVDb250ZW50UmVuZGVyYCxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgIH1cbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaHRtbF9vdXQgPSByZW5kZXJfaHRtbChodG1sX2luLCBkeW5fdmFyc19ldmFsKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5hc3NlcnQoZmFsc2UsIGBFcnJvciByZW5kZXJpbmcgcHJvYmxlbSAke2RpdmlkfSB0ZXh0LmApO1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgfVxuXG4gICAgLy8gdGhlIGFmdGVyQ29udGVudFJlbmRlciBldmVudCB3aWxsIGJlIGNhbGxlZCBieSB0aGUgY2FsbGVyIG9mIHRoaXMgZnVuY3Rpb24gKGFmdGVyIGl0IHVwZGF0ZWQgdGhlIEhUTUwgYmFzZWQgb24gdGhlIGNvbnRlbnRzIG9mIGh0bWxfb3V0KS5cbiAgICByZXR1cm4gW2h0bWxfb3V0LCBkeW5fdmFyc19ldmFsXTtcbn1cblxuLy8gR2l2ZW4gc3R1ZGVudCBhbnN3ZXJzLCBncmFkZSB0aGVtIGFuZCBwcm92aWRlIGZlZWRiYWNrLlxuLy9cbi8vIE91dHB1dHM6XG4vL1xuLy8gLSAgICBgYGRpc3BsYXlGZWVkYGAgaXMgYW4gYXJyYXkgb2YgSFRNTCBmZWVkYmFjay5cbi8vIC0gICAgYGBpc0NvcnJlY3RBcnJheWBgIGlzIGFuIGFycmF5IG9mIHRydWUsIGZhbHNlLCBvciBudWxsICh0aGUgcXVlc3Rpb24gd2Fzbid0IGFuc3dlcmVkKS5cbi8vIC0gICAgYGBjb3JyZWN0YGAgaXMgdHJ1ZSwgZmFsc2UsIG9yIG51bGwgKHRoZSBxdWVzdGlvbiB3YXNuJ3QgYW5zd2VyZWQpLlxuLy8gLSAgICBgYHBlcmNlbnRgYCBpcyB0aGUgcGVyY2VudGFnZSBvZiBjb3JyZWN0IGFuc3dlcnMgKGZyb20gMCB0byAxLCBub3QgMCB0byAxMDApLlxuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrQW5zd2Vyc0NvcmUoXG4gICAgLy8gX2BibGFua05hbWVzRGljdGA6IEFuIGRpY3Qgb2Yge2JsYW5rX25hbWUsIGJsYW5rX2luZGV4fSBzcGVjaWZ5aW5nIHRoZSBuYW1lIGZvciBlYWNoIG5hbWVkIGJsYW5rLlxuICAgIGJsYW5rTmFtZXNEaWN0LFxuICAgIC8vIF9gZ2l2ZW5fYXJyYDogQW4gYXJyYXkgb2Ygc3RyaW5ncyBjb250YWluaW5nIHN0dWRlbnQtcHJvdmlkZWQgYW5zd2VycyBmb3IgZWFjaCBibGFuay5cbiAgICBnaXZlbl9hcnIsXG4gICAgLy8gQSAyLUQgYXJyYXkgb2Ygc3RyaW5ncyBnaXZpbmcgZmVlZGJhY2sgZm9yIGVhY2ggYmxhbmsuXG4gICAgZmVlZGJhY2tBcnJheSxcbiAgICAvLyBfYGR5bl92YXJzX2V2YWxgOiBBIGRpY3QgcHJvZHVjZWQgYnkgZXZhbHVhdGluZyB0aGUgSmF2YVNjcmlwdCBmb3IgYSBkeW5hbWljIGV4ZXJjaXNlLlxuICAgIGR5bl92YXJzX2V2YWwsXG4pIHtcbiAgICBpZiAoXG4gICAgICAgIGR5bl92YXJzX2V2YWwgJiZcbiAgICAgICAgdHlwZW9mIGR5bl92YXJzX2V2YWwuYmVmb3JlQ2hlY2tBbnN3ZXJzID09PSBcImZ1bmN0aW9uXCJcbiAgICApIHtcbiAgICAgICAgY29uc3QgW25hbWVkQmxhbmtWYWx1ZXMsIGdpdmVuX2Fycl9jb252ZXJ0ZWRdID0gcGFyc2VBbnN3ZXJzKFxuICAgICAgICAgICAgYmxhbmtOYW1lc0RpY3QsXG4gICAgICAgICAgICBnaXZlbl9hcnIsXG4gICAgICAgICAgICBkeW5fdmFyc19ldmFsLFxuICAgICAgICApO1xuICAgICAgICBjb25zdCBkdmVfYmxhbmtzID0gT2JqZWN0LmFzc2lnbih7fSwgZHluX3ZhcnNfZXZhbCwgbmFtZWRCbGFua1ZhbHVlcyk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBkeW5fdmFyc19ldmFsLmJlZm9yZUNoZWNrQW5zd2VycyhkdmVfYmxhbmtzLCBnaXZlbl9hcnJfY29udmVydGVkKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmFzc2VydChmYWxzZSwgXCJFcnJvciBjYWxsaW5nIGJlZm9yZUNoZWNrQW5zd2Vyc1wiKTtcbiAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIEtlZXAgdHJhY2sgaWYgYWxsIGFuc3dlcnMgYXJlIGNvcnJlY3Qgb3Igbm90LlxuICAgIGxldCBjb3JyZWN0ID0gdHJ1ZTtcbiAgICBjb25zdCBpc0NvcnJlY3RBcnJheSA9IFtdO1xuICAgIGNvbnN0IGRpc3BsYXlGZWVkID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBnaXZlbl9hcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgZ2l2ZW4gPSBnaXZlbl9hcnJbaV07XG4gICAgICAgIC8vIElmIHRoaXMgYmxhbmsgaXMgZW1wdHksIHByb3ZpZGUgbm8gZmVlZGJhY2sgZm9yIGl0LlxuICAgICAgICBpZiAoZ2l2ZW4gPT09IFwiXCIpIHtcbiAgICAgICAgICAgIGlzQ29ycmVjdEFycmF5LnB1c2gobnVsbCk7XG4gICAgICAgICAgICAvLyBUT0RPOiBzaG91bGQgYmUgbG9jYWxpemVkLCBlLmcuIHQoXCJtc2dfbm9fYW5zd2VyXCIpLlxuICAgICAgICAgICAgZGlzcGxheUZlZWQucHVzaChcIk5vIGFuc3dlciBwcm92aWRlZC5cIik7XG4gICAgICAgICAgICBjb3JyZWN0ID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBMb29rIHRocm91Z2ggYWxsIGZlZWRiYWNrIGZvciB0aGlzIGJsYW5rLiBUaGUgbGFzdCBlbGVtZW50IGluIHRoZSBhcnJheSBhbHdheXMgbWF0Y2hlcy4gSWYgbm8gZmVlZGJhY2sgZm9yIHRoaXMgYmxhbmsgZXhpc3RzLCB1c2UgYW4gZW1wdHkgbGlzdC5cbiAgICAgICAgICAgIGNvbnN0IGZibCA9IGZlZWRiYWNrQXJyYXlbaV0gfHwgW107XG4gICAgICAgICAgICBsZXQgajtcbiAgICAgICAgICAgIGZvciAoaiA9IDA7IGogPCBmYmwubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAvLyBUaGUgbGFzdCBpdGVtIG9mIGZlZWRiYWNrIGFsd2F5cyBtYXRjaGVzLlxuICAgICAgICAgICAgICAgIGlmIChqID09PSBmYmwubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5RmVlZC5wdXNoKGZibFtqXVtcImZlZWRiYWNrXCJdKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIElmIHRoaXMgaXMgYSByZWdleHAuLi5cbiAgICAgICAgICAgICAgICBpZiAoXCJyZWdleFwiIGluIGZibFtqXSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXR0ID0gUmVnRXhwKGZibFtqXVtcInJlZ2V4XCJdLCBmYmxbal1bXCJyZWdleEZsYWdzXCJdKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhdHQudGVzdChnaXZlbikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXlGZWVkLnB1c2goZmJsW2pdW1wiZmVlZGJhY2tcIl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFwibnVtYmVyXCIgaW4gZmJsW2pdKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFRoaXMgaXMgYSBudW1iZXIuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IFttaW4sIG1heF0gPSBmYmxbal1bXCJudW1iZXJcIl07XG4gICAgICAgICAgICAgICAgICAgIC8vIENvbnZlcnQgdGhlIGdpdmVuIHN0cmluZyB0byBhIG51bWJlci4gV2hpbGUgdGhlcmUgYXJlIGBsb3RzIG9mIHdheXMgPGh0dHBzOi8vY29kZXJ3YWxsLmNvbS9wLzV0bGhtdy9jb252ZXJ0aW5nLXN0cmluZ3MtdG8tbnVtYmVyLWluLWphdmFzY3JpcHQtcGl0ZmFsbHM+YF8gdG8gZG8gdGhpczsgdGhpcyB2ZXJzaW9uIHN1cHBvcnRzIG90aGVyIGJhc2VzIChoZXgvYmluYXJ5L29jdGFsKSBhcyB3ZWxsIGFzIGZsb2F0cy5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYWN0dWFsID0gK2dpdmVuO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYWN0dWFsID49IG1pbiAmJiBhY3R1YWwgPD0gbWF4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5RmVlZC5wdXNoKGZibFtqXVtcImZlZWRiYWNrXCJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vIElmIHRoaXMgaXMgYSBkeW5hbWljIHNvbHV0aW9uLCB0aGV5IHNob3VsZCBwcm92aWRlIGEgdGVzdGluZyBmdW5jdGlvblxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZHluX3ZhcnNfZXZhbCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBbbmFtZWRCbGFua1ZhbHVlcywgZ2l2ZW5fYXJyX2NvbnZlcnRlZF0gPVxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VBbnN3ZXJzKGJsYW5rTmFtZXNEaWN0LCBnaXZlbl9hcnIsIGR5bl92YXJzX2V2YWwpO1xuICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGVyZSB3YXMgYSBwYXJzZSBlcnJvciwgdGhlbiBpdCBzdHVkZW50J3MgYW5zd2VyIGlzIGluY29ycmVjdC5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGdpdmVuX2Fycl9jb252ZXJ0ZWRbaV0gaW5zdGFuY2VvZiBUeXBlRXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXlGZWVkLnB1c2goZ2l2ZW5fYXJyX2NvbnZlcnRlZFtpXS5tZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIENvdW50IHRoaXMgYXMgd3JvbmcgYnkgbWFraW5nIGogIT0gMCAtLSBzZWUgdGhlIGNvZGUgdGhhdCBydW5zIGltbWVkaWF0ZWx5IGFmdGVyIHRoZSBleGVjdXRpbmcgdGhlIGJyZWFrLlxuICAgICAgICAgICAgICAgICAgICAgICAgaiA9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBDcmVhdGUgYSBmdW5jdGlvbiB0byB3cmFwIHRoZSBleHByZXNzaW9uIHRvIGV2YWx1YXRlLiBTZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvRnVuY3Rpb24vRnVuY3Rpb24uXG4gICAgICAgICAgICAgICAgICAgIC8vIFBhc3MgdGhlIGFuc3dlciwgYXJyYXkgb2YgYWxsIGFuc3dlcnMsIHRoZW4gYWxsIGVudHJpZXMgaW4gYGB0aGlzLmR5bl92YXJzX2V2YWxgYCBkaWN0IGFzIGZ1bmN0aW9uIHBhcmFtZXRlcnMuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGlzX2VxdWFsID0gd2luZG93LkZ1bmN0aW9uKFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJhbnNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYW5zX2FycmF5XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAuLi5PYmplY3Qua2V5cyhkeW5fdmFyc19ldmFsKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLk9iamVjdC5rZXlzKG5hbWVkQmxhbmtWYWx1ZXMpLFxuICAgICAgICAgICAgICAgICAgICAgICAgYFwidXNlIHN0cmljdDtcIlxcbnJldHVybiAke2ZibFtqXVtcInNvbHV0aW9uX2NvZGVcIl19O2AsXG4gICAgICAgICAgICAgICAgICAgICkoXG4gICAgICAgICAgICAgICAgICAgICAgICBnaXZlbl9hcnJfY29udmVydGVkW2ldLFxuICAgICAgICAgICAgICAgICAgICAgICAgZ2l2ZW5fYXJyX2NvbnZlcnRlZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLk9iamVjdC52YWx1ZXMoZHluX3ZhcnNfZXZhbCksXG4gICAgICAgICAgICAgICAgICAgICAgICAuLi5PYmplY3QudmFsdWVzKG5hbWVkQmxhbmtWYWx1ZXMpLFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAvLyBJZiBzdHVkZW50J3MgYW5zd2VyIGlzIGVxdWFsIHRvIHRoaXMgaXRlbSwgdGhlbiBhcHBlbmQgdGhpcyBpdGVtJ3MgZmVlZGJhY2suXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc19lcXVhbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheUZlZWQucHVzaChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlb2YgaXNfZXF1YWwgPT09IFwic3RyaW5nXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBpc19lcXVhbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGZibFtqXVtcImZlZWRiYWNrXCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vIElmIHRoaXMgaXMgTk9UIGEgZHluYW1pYyBzb2x1dGlvbiwgYnV0IGdpdmVuIGEgdGVzdGluZyBmdW5jdGlvblxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoXCJzb2x1dGlvbl9jb2RlXCIgaW4gZmJsW2pdKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIENyZWF0ZSBhIGZ1bmN0aW9uIHRvIHdyYXAgdGhlIGV4cHJlc3Npb24gdG8gZXZhbHVhdGUuIFNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9GdW5jdGlvbi9GdW5jdGlvbi5cbiAgICAgICAgICAgICAgICAgICAgLy8gUGFzcyB0aGUgYW5zd2VyLCBhcnJheSBvZiBhbGwgYW5zd2VycywgdGhlbiBhbGwgZW50cmllcyBpbiBgYHRoaXMuZHluX3ZhcnNfZXZhbGBgIGRpY3QgYXMgZnVuY3Rpb24gcGFyYW1ldGVycy5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaXNfZXF1YWwgPSB3aW5kb3cuRnVuY3Rpb24oXG4gICAgICAgICAgICAgICAgICAgICAgICBcImFuc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJhbnNfYXJyYXlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGBcInVzZSBzdHJpY3Q7XCJcXG5yZXR1cm4gJHtmYmxbal1bXCJzb2x1dGlvbl9jb2RlXCJdfTtgLFxuICAgICAgICAgICAgICAgICAgICApKGdpdmVuLCBnaXZlbl9hcnIpO1xuICAgICAgICAgICAgICAgICAgICAvLyBJZiBzdHVkZW50J3MgYW5zd2VyIGlzIGVxdWFsIHRvIHRoaXMgaXRlbSwgdGhlbiBhcHBlbmQgdGhpcyBpdGVtJ3MgZmVlZGJhY2suXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc19lcXVhbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheUZlZWQucHVzaChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlb2YgaXNfZXF1YWwgPT09IFwic3RyaW5nXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBpc19lcXVhbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGZibFtqXVtcImZlZWRiYWNrXCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gVW5kZWZpbmVkIG1ldGhvZCBvZiB0ZXN0aW5nLlxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmFzc2VydChcIm51bWJlclwiIGluIGZibFtqXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBUaGUgYW5zd2VyIGlzIGNvcnJlY3QgaWYgaXQgbWF0Y2hlZCB0aGUgZmlyc3QgZWxlbWVudCBpbiB0aGUgYXJyYXkuIEEgc3BlY2lhbCBjYXNlOiBpZiBvbmx5IG9uZSBhbnN3ZXIgaXMgcHJvdmlkZWQsIGNvdW50IGl0IHdyb25nOyB0aGlzIGlzIGEgbWlzZm9ybWVkIHByb2JsZW0uXG4gICAgICAgICAgICBjb25zdCBpc19jb3JyZWN0ID0gaiA9PT0gMCAmJiBmYmwubGVuZ3RoID4gMTtcbiAgICAgICAgICAgIGlzQ29ycmVjdEFycmF5LnB1c2goaXNfY29ycmVjdCk7XG4gICAgICAgICAgICBpZiAoIWlzX2NvcnJlY3QpIHtcbiAgICAgICAgICAgICAgICBjb3JyZWN0ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICAgIGR5bl92YXJzX2V2YWwgJiZcbiAgICAgICAgdHlwZW9mIGR5bl92YXJzX2V2YWwuYWZ0ZXJDaGVja0Fuc3dlcnMgPT09IFwiZnVuY3Rpb25cIlxuICAgICkge1xuICAgICAgICBjb25zdCBbbmFtZWRCbGFua1ZhbHVlcywgZ2l2ZW5fYXJyX2NvbnZlcnRlZF0gPSBwYXJzZUFuc3dlcnMoXG4gICAgICAgICAgICBibGFua05hbWVzRGljdCxcbiAgICAgICAgICAgIGdpdmVuX2FycixcbiAgICAgICAgICAgIGR5bl92YXJzX2V2YWwsXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IGR2ZV9ibGFua3MgPSBPYmplY3QuYXNzaWduKHt9LCBkeW5fdmFyc19ldmFsLCBuYW1lZEJsYW5rVmFsdWVzKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGR5bl92YXJzX2V2YWwuYWZ0ZXJDaGVja0Fuc3dlcnMoZHZlX2JsYW5rcywgZ2l2ZW5fYXJyX2NvbnZlcnRlZCk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgY29uc29sZS5hc3NlcnQoZmFsc2UsIFwiRXJyb3IgY2FsbGluZyBhZnRlckNoZWNrQW5zd2Vyc1wiKTtcbiAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHBlcmNlbnQgPVxuICAgICAgICBpc0NvcnJlY3RBcnJheS5maWx0ZXIoQm9vbGVhbikubGVuZ3RoIC8gaXNDb3JyZWN0QXJyYXkubGVuZ3RoO1xuICAgIHJldHVybiBbZGlzcGxheUZlZWQsIGNvcnJlY3QsIGlzQ29ycmVjdEFycmF5LCBwZXJjZW50XTtcbn1cblxuLy8gVXNlIHRoZSBwcm92aWRlZCBwYXJzZXJzIHRvIGNvbnZlcnQgYSBzdHVkZW50J3MgYW5zd2VycyAoYXMgc3RyaW5ncykgdG8gdGhlIHR5cGUgcHJvZHVjZWQgYnkgdGhlIHBhcnNlciBmb3IgZWFjaCBibGFuay5cbmZ1bmN0aW9uIHBhcnNlQW5zd2VycyhcbiAgICAvLyBTZWUgYmxhbmtOYW1lc0RpY3RfLlxuICAgIGJsYW5rTmFtZXNEaWN0LFxuICAgIC8vIFNlZSBnaXZlbl9hcnJfLlxuICAgIGdpdmVuX2FycixcbiAgICAvLyBTZWUgYGR5bl92YXJzX2V2YWxgLlxuICAgIGR5bl92YXJzX2V2YWwsXG4pIHtcbiAgICAvLyBQcm92aWRlIGEgZGljdCBvZiB7YmxhbmtfbmFtZSwgY29udmVydGVyX2Fuc3dlcl92YWx1ZX0uXG4gICAgY29uc3QgbmFtZWRCbGFua1ZhbHVlcyA9IGdldE5hbWVkQmxhbmtWYWx1ZXMoXG4gICAgICAgIGdpdmVuX2FycixcbiAgICAgICAgYmxhbmtOYW1lc0RpY3QsXG4gICAgICAgIGR5bl92YXJzX2V2YWwsXG4gICAgKTtcbiAgICAvLyBJbnZlcnQgYmxhbmtOYW1lZERpY3Q6IGNvbXB1dGUgYW4gYXJyYXkgb2YgW2JsYW5rXzBfbmFtZSwgLi4uXS4gTm90ZSB0aGF0IHRoZSBhcnJheSBtYXkgYmUgc3BhcnNlOiBpdCBvbmx5IGNvbnRhaW5zIHZhbHVlcyBmb3IgbmFtZWQgYmxhbmtzLlxuICAgIGNvbnN0IGdpdmVuX2Fycl9uYW1lcyA9IFtdO1xuICAgIGZvciAoY29uc3QgW2ssIHZdIG9mIE9iamVjdC5lbnRyaWVzKGJsYW5rTmFtZXNEaWN0KSkge1xuICAgICAgICBnaXZlbl9hcnJfbmFtZXNbdl0gPSBrO1xuICAgIH1cbiAgICAvLyBDb21wdXRlIGFuIGFycmF5IG9mIFtjb252ZXJ0ZWRfYmxhbmtfMF92YWwsIC4uLl0uIE5vdGUgdGhhdCB0aGlzIHJlLWNvbnZlcnRzIGFsbCB0aGUgdmFsdWVzLCByYXRoZXIgdGhhbiAocG9zc2libHkgZGVlcCkgY29weWluZyB0aGUgdmFsdWVzIGZyb20gYWxyZWFkeS1jb252ZXJ0ZWQgbmFtZWQgYmxhbmtzLlxuICAgIGNvbnN0IGdpdmVuX2Fycl9jb252ZXJ0ZWQgPSBnaXZlbl9hcnIubWFwKCh2YWx1ZSwgaW5kZXgpID0+XG4gICAgICAgIHR5cGVfY29udmVydChnaXZlbl9hcnJfbmFtZXNbaW5kZXhdLCB2YWx1ZSwgaW5kZXgsIGR5bl92YXJzX2V2YWwpLFxuICAgICk7XG5cbiAgICByZXR1cm4gW25hbWVkQmxhbmtWYWx1ZXMsIGdpdmVuX2Fycl9jb252ZXJ0ZWRdO1xufVxuXG4vLyBSZW5kZXIgdGhlIGZlZWRiYWNrIGZvciBhIGR5bmFtaWMgcHJvYmxlbS5cbmV4cG9ydCBmdW5jdGlvbiByZW5kZXJEeW5hbWljRmVlZGJhY2soXG4gICAgLy8gU2VlIGJsYW5rTmFtZXNEaWN0Xy5cbiAgICBibGFua05hbWVzRGljdCxcbiAgICAvLyBTZWUgZ2l2ZW5fYXJyXy5cbiAgICBnaXZlbl9hcnIsXG4gICAgLy8gVGhlIGluZGV4IG9mIHRoaXMgYmxhbmsgaW4gZ2l2ZW5fYXJyXy5cbiAgICBpbmRleCxcbiAgICAvLyBUaGUgZmVlZGJhY2sgZm9yIHRoaXMgYmxhbmssIGNvbnRhaW5pbmcgYSB0ZW1wbGF0ZSB0byBiZSByZW5kZXJlZC5cbiAgICBkaXNwbGF5RmVlZF9pLFxuICAgIC8vIFNlZSBkeW5fdmFyc19ldmFsXy5cbiAgICBkeW5fdmFyc19ldmFsLFxuKSB7XG4gICAgLy8gVXNlIHRoZSBhbnN3ZXIsIGFuIGFycmF5IG9mIGFsbCBhbnN3ZXJzLCB0aGUgdmFsdWUgb2YgYWxsIG5hbWVkIGJsYW5rcywgYW5kIGFsbCBzb2x1dGlvbiB2YXJpYWJsZXMgZm9yIHRoZSB0ZW1wbGF0ZS5cbiAgICBjb25zdCBuYW1lZEJsYW5rVmFsdWVzID0gZ2V0TmFtZWRCbGFua1ZhbHVlcyhcbiAgICAgICAgZ2l2ZW5fYXJyLFxuICAgICAgICBibGFua05hbWVzRGljdCxcbiAgICAgICAgZHluX3ZhcnNfZXZhbCxcbiAgICApO1xuICAgIGNvbnN0IHNvbF92YXJzX3BsdXMgPSBPYmplY3QuYXNzaWduKFxuICAgICAgICB7XG4gICAgICAgICAgICBhbnM6IGdpdmVuX2FycltpbmRleF0sXG4gICAgICAgICAgICBhbnNfYXJyYXk6IGdpdmVuX2FycixcbiAgICAgICAgfSxcbiAgICAgICAgZHluX3ZhcnNfZXZhbCxcbiAgICAgICAgbmFtZWRCbGFua1ZhbHVlcyxcbiAgICApO1xuICAgIHRyeSB7XG4gICAgICAgIGRpc3BsYXlGZWVkX2kgPSByZW5kZXJfaHRtbChkaXNwbGF5RmVlZF9pLCBzb2xfdmFyc19wbHVzKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5hc3NlcnQoZmFsc2UsIGBFcnJvciBldmFsdWF0aW5nIGZlZWRiYWNrIGluZGV4ICR7aW5kZXh9LmApO1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRpc3BsYXlGZWVkX2k7XG59XG5cbi8vIFV0aWxpdGllc1xuLy8gLS0tLS0tLS0tXG4vLyBGb3IgZWFjaCBuYW1lZCBibGFuaywgZ2V0IHRoZSB2YWx1ZSBmb3IgdGhlIGJsYW5rOiB0aGUgdmFsdWUgb2YgZWFjaCBgYGJsYW5rTmFtZWBgIGdpdmVzIHRoZSBpbmRleCBvZiB0aGUgYmxhbmsgZm9yIHRoYXQgbmFtZS5cbmZ1bmN0aW9uIGdldE5hbWVkQmxhbmtWYWx1ZXMoZ2l2ZW5fYXJyLCBibGFua05hbWVzRGljdCwgZHluX3ZhcnNfZXZhbCkge1xuICAgIGNvbnN0IG5hbWVkQmxhbmtWYWx1ZXMgPSB7fTtcbiAgICBmb3IgKGNvbnN0IFtibGFua19uYW1lLCBibGFua19pbmRleF0gb2YgT2JqZWN0LmVudHJpZXMoYmxhbmtOYW1lc0RpY3QpKSB7XG4gICAgICAgIG5hbWVkQmxhbmtWYWx1ZXNbYmxhbmtfbmFtZV0gPSB0eXBlX2NvbnZlcnQoXG4gICAgICAgICAgICBibGFua19uYW1lLFxuICAgICAgICAgICAgZ2l2ZW5fYXJyW2JsYW5rX2luZGV4XSxcbiAgICAgICAgICAgIGJsYW5rX2luZGV4LFxuICAgICAgICAgICAgZHluX3ZhcnNfZXZhbCxcbiAgICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuIG5hbWVkQmxhbmtWYWx1ZXM7XG59XG5cbi8vIENvbnZlcnQgYSB2YWx1ZSBnaXZlbiBpdHMgdHlwZS5cbmZ1bmN0aW9uIHR5cGVfY29udmVydChuYW1lLCB2YWx1ZSwgaW5kZXgsIGR5bl92YXJzX2V2YWwpIHtcbiAgICAvLyBUaGUgY29udmVydGVyIGNhbiBiZSBkZWZpbmVkIGJ5IGluZGV4LCBuYW1lLCBvciBieSBhIHNpbmdsZSB2YWx1ZSAod2hpY2ggYXBwbGllcyB0byBhbGwgYmxhbmtzKS4gSWYgbm90IHByb3ZpZGVkLCBqdXN0IHBhc3MgdGhlIGRhdGEgdGhyb3VnaC5cbiAgICBjb25zdCB0eXBlcyA9IGR5bl92YXJzX2V2YWwudHlwZXMgfHwgcGFzc190aHJvdWdoO1xuICAgIGNvbnN0IGNvbnZlcnRlciA9IHR5cGVzW25hbWVdIHx8IHR5cGVzW2luZGV4XSB8fCB0eXBlcztcbiAgICAvLyBFUzUgaGFjazogaXQgZG9lc24ndCBzdXBwb3J0IGJpbmFyeSB2YWx1ZXMsIGFuZCBqczJweSBkb2Vzbid0IGFsbG93IG1lIHRvIG92ZXJyaWRlIHRoZSBgYE51bWJlcmBgIGNsYXNzLiBTbywgZGVmaW5lIHRoZSB3b3JrYXJvdW5kIGNsYXNzIGBgTnVtYmVyX2BgIGFuZCB1c2UgaXQgaWYgYXZhaWxhYmxlLlxuICAgIGlmIChjb252ZXJ0ZXIgPT09IE51bWJlciAmJiB0eXBlb2YgTnVtYmVyXyAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBjb252ZXJ0ZXIgPSBOdW1iZXJfO1xuICAgIH1cblxuICAgIC8vIFJldHVybiB0aGUgY29udmVydGVkIHR5cGUuIElmIHRoZSBjb252ZXJ0ZXIgcmFpc2VzIGEgVHlwZUVycm9yLCByZXR1cm4gdGhhdDsgaXQgd2lsbCBiZSBkaXNwbGF5ZWQgdG8gdGhlIHVzZXIsIHNpbmNlIHdlIGFzc3VtZSB0eXBlIGVycm9ycyBhcmUgYSB3YXkgZm9yIHRoZSBwYXJzZXIgdG8gZXhwbGFpbiB0byB0aGUgdXNlciB3aHkgdGhlIHBhcnNlIGZhaWxlZC4gRm9yIGFsbCBvdGhlciBlcnJvcnMsIHJlLXRocm93IGl0IHNpbmNlIHNvbWV0aGluZyB3ZW50IHdyb25nLlxuICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBjb252ZXJ0ZXIodmFsdWUpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBpZiAoZXJyIGluc3RhbmNlb2YgVHlwZUVycm9yKSB7XG4gICAgICAgICAgICByZXR1cm4gZXJyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vLyBBIHBhc3MtdGhyb3VnaCBcImNvbnZlcnRlclwiLlxuZnVuY3Rpb24gcGFzc190aHJvdWdoKHZhbCkge1xuICAgIHJldHVybiB2YWw7XG59XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=