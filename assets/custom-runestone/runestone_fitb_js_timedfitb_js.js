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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2ZpdGIvanMvdGltZWRmaXRiLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvZml0Yi9qcy9maXRiLWkxOG4ucHQtYnIuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9maXRiL2pzL2xpYnMvYWxlYVBSTkctMS4xLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvZml0Yi9qcy9maXRiLWkxOG4uZW4uanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9maXRiL2Nzcy9maXRiLmNzcz85ZWJkIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvZml0Yi9qcy9maXRiLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvZml0Yi9qcy9maXRiLWkxOG4uc3ItQ3lybC5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2ZpdGIvanMvZml0Yi11dGlscy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRklUQiBmcm9tIFwiLi9maXRiLmpzXCI7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaW1lZEZJVEIgZXh0ZW5kcyBGSVRCIHtcbiAgICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgICAgIHN1cGVyKG9wdHMpO1xuICAgICAgICB0aGlzLnJlbmRlclRpbWVkSWNvbih0aGlzLmlucHV0RGl2KTtcbiAgICAgICAgdGhpcy5oaWRlQnV0dG9ucygpO1xuICAgICAgICB0aGlzLm5lZWRzUmVpbml0aWFsaXphdGlvbiA9IHRydWU7XG4gICAgfVxuICAgIGhpZGVCdXR0b25zKCkge1xuICAgICAgICBpZiAodGhpcy5zdWJtaXRCdXR0b24pIHRoaXMuc3VibWl0QnV0dG9uLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgaWYgKHRoaXMuY29tcGFyZUJ1dHRvbikgdGhpcy5jb21wYXJlQnV0dG9uLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICB9XG4gICAgcmVuZGVyVGltZWRJY29uKGNvbXBvbmVudCkge1xuICAgICAgICAvLyByZW5kZXJzIHRoZSBjbG9jayBpY29uIG9uIHRpbWVkIGNvbXBvbmVudHMuICAgIFRoZSBjb21wb25lbnQgcGFyYW1ldGVyXG4gICAgICAgIC8vIGlzIHRoZSBlbGVtZW50IHRoYXQgdGhlIGljb24gc2hvdWxkIGJlIGFwcGVuZGVkIHRvLlxuICAgICAgICB2YXIgdGltZUljb25EaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB2YXIgdGltZUljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xuICAgICAgICB0aW1lSWNvbi5zcmMgPSBcIi4uL19zdGF0aWMvY2xvY2sucG5nXCI7XG4gICAgICAgIHRpbWVJY29uLnN0eWxlLndpZHRoID0gXCIxNXB4XCI7XG4gICAgICAgIHRpbWVJY29uLnN0eWxlLmhlaWdodCA9IFwiMTVweFwiO1xuICAgICAgICB0aW1lSWNvbkRpdi5jbGFzc05hbWUgPSBcInRpbWVUaXBcIjtcbiAgICAgICAgdGltZUljb25EaXYudGl0bGUgPSBcIlwiO1xuICAgICAgICB0aW1lSWNvbkRpdi5hcHBlbmRDaGlsZCh0aW1lSWNvbik7XG4gICAgICAgIGlmIChjb21wb25lbnQpIHtcbiAgICAgICAgICAgIGlmIChjb21wb25lbnQuZmlyc3RDaGlsZCkge1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5pbnNlcnRCZWZvcmUodGltZUljb25EaXYsIGNvbXBvbmVudC5maXJzdENoaWxkKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmFwcGVuZENoaWxkKHRpbWVJY29uRGl2KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBjaGVja0NvcnJlY3RUaW1lZCgpIHtcbiAgICAgICAgLy8gUmV0dXJucyBpZiB0aGUgcXVlc3Rpb24gd2FzIGNvcnJlY3QsIGluY29ycmVjdCwgb3Igc2tpcHBlZCAocmV0dXJuIG51bGwgaW4gdGhlIGxhc3QgY2FzZSlcbiAgICAgICAgc3dpdGNoICh0aGlzLmNvcnJlY3QpIHtcbiAgICAgICAgICAgIGNhc2UgdHJ1ZTpcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJUXCI7XG4gICAgICAgICAgICBjYXNlIGZhbHNlOlxuICAgICAgICAgICAgICAgIHJldHVybiBcIkZcIjtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaGlkZUZlZWRiYWNrKCkge1xuICAgICAgICAvLyBBbHNvIGRyb3BzIGVhY2ggYmxhbmsncyBhcmlhLWRlc2NyaWJlZGJ5OiBoaWRkZW4gdGV4dCBpcyBzdGlsbCByZWFkXG4gICAgICAgIC8vIG91dCB3aGVuIGEgZGVzY3JpcHRpb24gcG9pbnRzIGF0IGl0LCBzbyBsZWF2aW5nIHRoZSBsaW5rcyBpbiBwbGFjZVxuICAgICAgICAvLyB3b3VsZCBhbm5vdW5jZSBmZWVkYmFjayB0aGUgc3R1ZGVudCBpcyBub3Qgc3VwcG9zZWQgdG8gaGF2ZSB5ZXQuXG4gICAgICAgIHRoaXMuY2xlYXJCbGFua0ZlZWRiYWNrKCk7XG4gICAgICAgIHRoaXMuZmVlZEJhY2tEaXYuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgIH1cblxuICAgIHJlaW5pdGlhbGl6ZUxpc3RlbmVycygpIHtcbiAgICAgICAgdGhpcy5zZXR1cEJsYW5rcygpO1xuICAgIH1cbn1cblxuaWYgKHR5cGVvZiB3aW5kb3cuY29tcG9uZW50X2ZhY3RvcnkgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB3aW5kb3cuY29tcG9uZW50X2ZhY3RvcnkgPSB7fTtcbn1cbndpbmRvdy5jb21wb25lbnRfZmFjdG9yeS5maWxsaW50aGVibGFuayA9IGZ1bmN0aW9uIChvcHRzKSB7XG4gICAgaWYgKG9wdHMudGltZWQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBUaW1lZEZJVEIob3B0cyk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgRklUQihvcHRzKTtcbn07XG4iLCJpbXBvcnQgeyBsb2FkIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9qcy9yc2kxOG4uanNcIjtcblxubG9hZCh7XG4gICAgXCJwdC1iclwiOiB7XG4gICAgICAgIG1zZ19ub19hbnN3ZXI6IFwiTmVuaHVtYSByZXNwb3N0YSBkYWRhLlwiLFxuICAgICAgICBtc2dfZml0Yl9jaGVja19tZTogXCJWZXJpZmljYXJcIixcbiAgICAgICAgbXNnX2ZpdGJfY29tcGFyZV9tZTogXCJDb21wYXJhclwiXG4gICAgfSxcbn0pO1xuIiwiLyovLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5hbGVhUFJORyAxLjFcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuaHR0cHM6Ly9naXRodWIuY29tL21hY21jbWVhbnMvYWxlYVBSTkcvYmxvYi9tYXN0ZXIvYWxlYVBSTkctMS4xLmpzXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbk9yaWdpbmFsIHdvcmsgY29weXJpZ2h0IMKpIDIwMTAgSm9oYW5uZXMgQmFhZ8O4ZSwgdW5kZXIgTUlUIGxpY2Vuc2VcblRoaXMgaXMgYSBkZXJpdmF0aXZlIHdvcmsgY29weXJpZ2h0IChjKSAyMDE3LTIwMjAsIFcuIE1hY1wiIE1jTWVhbnMsIHVuZGVyIEJTRCBsaWNlbnNlLlxuUmVkaXN0cmlidXRpb24gYW5kIHVzZSBpbiBzb3VyY2UgYW5kIGJpbmFyeSBmb3Jtcywgd2l0aCBvciB3aXRob3V0IG1vZGlmaWNhdGlvbiwgYXJlIHBlcm1pdHRlZCBwcm92aWRlZCB0aGF0IHRoZSBmb2xsb3dpbmcgY29uZGl0aW9ucyBhcmUgbWV0OlxuMS4gUmVkaXN0cmlidXRpb25zIG9mIHNvdXJjZSBjb2RlIG11c3QgcmV0YWluIHRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlLCB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyLlxuMi4gUmVkaXN0cmlidXRpb25zIGluIGJpbmFyeSBmb3JtIG11c3QgcmVwcm9kdWNlIHRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlLCB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyIGluIHRoZSBkb2N1bWVudGF0aW9uIGFuZC9vciBvdGhlciBtYXRlcmlhbHMgcHJvdmlkZWQgd2l0aCB0aGUgZGlzdHJpYnV0aW9uLlxuMy4gTmVpdGhlciB0aGUgbmFtZSBvZiB0aGUgY29weXJpZ2h0IGhvbGRlciBub3IgdGhlIG5hbWVzIG9mIGl0cyBjb250cmlidXRvcnMgbWF5IGJlIHVzZWQgdG8gZW5kb3JzZSBvciBwcm9tb3RlIHByb2R1Y3RzIGRlcml2ZWQgZnJvbSB0aGlzIHNvZnR3YXJlIHdpdGhvdXQgc3BlY2lmaWMgcHJpb3Igd3JpdHRlbiBwZXJtaXNzaW9uLlxuVEhJUyBTT0ZUV0FSRSBJUyBQUk9WSURFRCBCWSBUSEUgQ09QWVJJR0hUIEhPTERFUlMgQU5EIENPTlRSSUJVVE9SUyBcIkFTIElTXCIgQU5EIEFOWSBFWFBSRVNTIE9SIElNUExJRUQgV0FSUkFOVElFUywgSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFRIRSBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZIEFORCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBUkUgRElTQ0xBSU1FRC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIENPUFlSSUdIVCBIT0xERVIgT1IgQ09OVFJJQlVUT1JTIEJFIExJQUJMRSBGT1IgQU5ZIERJUkVDVCwgSU5ESVJFQ1QsIElOQ0lERU5UQUwsIFNQRUNJQUwsIEVYRU1QTEFSWSwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTIChJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgUFJPQ1VSRU1FTlQgT0YgU1VCU1RJVFVURSBHT09EUyBPUiBTRVJWSUNFUzsgTE9TUyBPRiBVU0UsIERBVEEsIE9SIFBST0ZJVFM7IE9SIEJVU0lORVNTIElOVEVSUlVQVElPTikgSE9XRVZFUiBDQVVTRUQgQU5EIE9OIEFOWSBUSEVPUlkgT0YgTElBQklMSVRZLCBXSEVUSEVSIElOIENPTlRSQUNULCBTVFJJQ1QgTElBQklMSVRZLCBPUiBUT1JUIChJTkNMVURJTkcgTkVHTElHRU5DRSBPUiBPVEhFUldJU0UpIEFSSVNJTkcgSU4gQU5ZIFdBWSBPVVQgT0YgVEhFIFVTRSBPRiBUSElTIFNPRlRXQVJFLCBFVkVOIElGIEFEVklTRUQgT0YgVEhFIFBPU1NJQklMSVRZIE9GIFNVQ0ggREFNQUdFLlxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLyovXG5leHBvcnQgZnVuY3Rpb24gYWxlYVBSTkcoKSB7XG4gICAgcmV0dXJuKCBmdW5jdGlvbiggYXJncyApIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAgICAgY29uc3QgdmVyc2lvbiA9ICdhbGVhUFJORyAxLjEuMCc7XG5cbiAgICAgICAgdmFyIHMwXG4gICAgICAgICAgICAsIHMxXG4gICAgICAgICAgICAsIHMyXG4gICAgICAgICAgICAsIGNcbiAgICAgICAgICAgICwgdWludGEgPSBuZXcgVWludDMyQXJyYXkoIDMgKVxuICAgICAgICAgICAgLCBpbml0aWFsQXJnc1xuICAgICAgICAgICAgLCBtYXNodmVyID0gJydcbiAgICAgICAgO1xuXG4gICAgICAgIC8qIHByaXZhdGU6IGluaXRpYWxpemVzIGdlbmVyYXRvciB3aXRoIHNwZWNpZmllZCBzZWVkICovXG4gICAgICAgIGZ1bmN0aW9uIF9pbml0U3RhdGUoIF9pbnRlcm5hbFNlZWQgKSB7XG4gICAgICAgICAgICB2YXIgbWFzaCA9IE1hc2goKTtcblxuICAgICAgICAgICAgLy8gaW50ZXJuYWwgc3RhdGUgb2YgZ2VuZXJhdG9yXG4gICAgICAgICAgICBzMCA9IG1hc2goICcgJyApO1xuICAgICAgICAgICAgczEgPSBtYXNoKCAnICcgKTtcbiAgICAgICAgICAgIHMyID0gbWFzaCggJyAnICk7XG5cbiAgICAgICAgICAgIGMgPSAxO1xuXG4gICAgICAgICAgICBmb3IoIHZhciBpID0gMDsgaSA8IF9pbnRlcm5hbFNlZWQubGVuZ3RoOyBpKysgKSB7XG4gICAgICAgICAgICAgICAgczAgLT0gbWFzaCggX2ludGVybmFsU2VlZFsgaSBdICk7XG4gICAgICAgICAgICAgICAgaWYoIHMwIDwgMCApIHsgczAgKz0gMTsgfVxuXG4gICAgICAgICAgICAgICAgczEgLT0gbWFzaCggX2ludGVybmFsU2VlZFsgaSBdICk7XG4gICAgICAgICAgICAgICAgaWYoIHMxIDwgMCApIHsgczEgKz0gMTsgfVxuXG4gICAgICAgICAgICAgICAgczIgLT0gbWFzaCggX2ludGVybmFsU2VlZFsgaSBdICk7XG4gICAgICAgICAgICAgICAgaWYoIHMyIDwgMCApIHsgczIgKz0gMTsgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBtYXNodmVyID0gbWFzaC52ZXJzaW9uO1xuXG4gICAgICAgICAgICBtYXNoID0gbnVsbDtcbiAgICAgICAgfTtcblxuICAgICAgICAvKiBwcml2YXRlOiBkZXBlbmRlbnQgc3RyaW5nIGhhc2ggZnVuY3Rpb24gKi9cbiAgICAgICAgZnVuY3Rpb24gTWFzaCgpIHtcbiAgICAgICAgICAgIHZhciBuID0gNDAyMjg3MTE5NzsgLy8gMHhlZmM4MjQ5ZFxuXG4gICAgICAgICAgICB2YXIgbWFzaCA9IGZ1bmN0aW9uKCBkYXRhICkge1xuICAgICAgICAgICAgICAgIGRhdGEgPSBkYXRhLnRvU3RyaW5nKCk7XG5cbiAgICAgICAgICAgICAgICAvLyBjYWNoZSB0aGUgbGVuZ3RoXG4gICAgICAgICAgICAgICAgZm9yKCB2YXIgaSA9IDAsIGwgPSBkYXRhLmxlbmd0aDsgaSA8IGw7IGkrKyApIHtcbiAgICAgICAgICAgICAgICAgICAgbiArPSBkYXRhLmNoYXJDb2RlQXQoIGkgKTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgaCA9IDAuMDI1MTk2MDMyODI0MTY5MzggKiBuO1xuXG4gICAgICAgICAgICAgICAgICAgIG4gID0gaCA+Pj4gMDtcbiAgICAgICAgICAgICAgICAgICAgaCAtPSBuO1xuICAgICAgICAgICAgICAgICAgICBoICo9IG47XG4gICAgICAgICAgICAgICAgICAgIG4gID0gaCA+Pj4gMDtcbiAgICAgICAgICAgICAgICAgICAgaCAtPSBuO1xuICAgICAgICAgICAgICAgICAgICBuICs9IGggKiA0Mjk0OTY3Mjk2OyAvLyAweDEwMDAwMDAwMCAgICAgIDJeMzJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuICggbiA+Pj4gMCApICogMi4zMjgzMDY0MzY1Mzg2OTYzZS0xMDsgLy8gMl4tMzJcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIG1hc2gudmVyc2lvbiA9ICdNYXNoIDAuOSc7XG4gICAgICAgICAgICByZXR1cm4gbWFzaDtcbiAgICAgICAgfTtcblxuXG4gICAgICAgIC8qIHByaXZhdGU6IGNoZWNrIGlmIG51bWJlciBpcyBpbnRlZ2VyICovXG4gICAgICAgIGZ1bmN0aW9uIF9pc0ludGVnZXIoIF9pbnQgKSB7XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VJbnQoIF9pbnQsIDEwICkgPT09IF9pbnQ7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyogcHVibGljOiByZXR1cm4gYSAzMi1iaXQgZnJhY3Rpb24gaW4gdGhlIHJhbmdlIFswLCAxXVxuICAgICAgICBUaGlzIGlzIHRoZSBtYWluIGZ1bmN0aW9uIHJldHVybmVkIHdoZW4gYWxlYVBSTkcgaXMgaW5zdGFudGlhdGVkXG4gICAgICAgICovXG4gICAgICAgIHZhciByYW5kb20gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciB0ID0gMjA5MTYzOSAqIHMwICsgYyAqIDIuMzI4MzA2NDM2NTM4Njk2M2UtMTA7IC8vIDJeLTMyXG5cbiAgICAgICAgICAgIHMwID0gczE7XG4gICAgICAgICAgICBzMSA9IHMyO1xuXG4gICAgICAgICAgICByZXR1cm4gczIgPSB0IC0gKCBjID0gdCB8IDAgKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKiBwdWJsaWM6IHJldHVybiBhIDUzLWJpdCBmcmFjdGlvbiBpbiB0aGUgcmFuZ2UgWzAsIDFdICovXG4gICAgICAgIHJhbmRvbS5mcmFjdDUzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gcmFuZG9tKCkgKyAoIHJhbmRvbSgpICogMHgyMDAwMDAgIHwgMCApICogMS4xMTAyMjMwMjQ2MjUxNTY1ZS0xNjsgLy8gMl4tNTNcbiAgICAgICAgfTtcblxuICAgICAgICAvKiBwdWJsaWM6IHJldHVybiBhbiB1bnNpZ25lZCBpbnRlZ2VyIGluIHRoZSByYW5nZSBbMCwgMl4zMl0gKi9cbiAgICAgICAgcmFuZG9tLmludDMyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gcmFuZG9tKCkgKiAweDEwMDAwMDAwMDsgLy8gMl4zMlxuICAgICAgICB9O1xuXG4gICAgICAgIC8qIHB1YmxpYzogYWR2YW5jZSB0aGUgZ2VuZXJhdG9yIHRoZSBzcGVjaWZpZWQgYW1vdW50IG9mIGN5Y2xlcyAqL1xuICAgICAgICByYW5kb20uY3ljbGUgPSBmdW5jdGlvbiggX3J1biApIHtcbiAgICAgICAgICAgIF9ydW4gPSB0eXBlb2YgX3J1biA9PT0gJ3VuZGVmaW5lZCcgPyAxIDogK19ydW47XG4gICAgICAgICAgICBpZiggX3J1biA8IDEgKSB7IF9ydW4gPSAxOyB9XG4gICAgICAgICAgICBmb3IoIHZhciBpID0gMDsgaSA8IF9ydW47IGkrKyApIHsgcmFuZG9tKCk7IH1cbiAgICAgICAgfTtcblxuICAgICAgICAvKiBwdWJsaWM6IHJldHVybiBpbmNsdXNpdmUgcmFuZ2UgKi9cbiAgICAgICAgcmFuZG9tLnJhbmdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgbG9Cb3VuZFxuICAgICAgICAgICAgICAgICwgaGlCb3VuZFxuICAgICAgICAgICAgO1xuXG4gICAgICAgICAgICBpZiggYXJndW1lbnRzLmxlbmd0aCA9PT0gMSApIHtcbiAgICAgICAgICAgICAgICBsb0JvdW5kID0gMDtcbiAgICAgICAgICAgICAgICBoaUJvdW5kID0gYXJndW1lbnRzWyAwIF07XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbG9Cb3VuZCA9IGFyZ3VtZW50c1sgMCBdO1xuICAgICAgICAgICAgICAgIGhpQm91bmQgPSBhcmd1bWVudHNbIDEgXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYoIGFyZ3VtZW50c1sgMCBdID4gYXJndW1lbnRzWyAxIF0gKSB7XG4gICAgICAgICAgICAgICAgbG9Cb3VuZCA9IGFyZ3VtZW50c1sgMSBdO1xuICAgICAgICAgICAgICAgIGhpQm91bmQgPSBhcmd1bWVudHNbIDAgXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gcmV0dXJuIGludGVnZXJcbiAgICAgICAgICAgIGlmKCBfaXNJbnRlZ2VyKCBsb0JvdW5kICkgJiYgX2lzSW50ZWdlciggaGlCb3VuZCApICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBNYXRoLmZsb29yKCByYW5kb20oKSAqICggaGlCb3VuZCAtIGxvQm91bmQgKyAxICkgKSArIGxvQm91bmQ7XG5cbiAgICAgICAgICAgIC8vIHJldHVybiBmbG9hdFxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmFuZG9tKCkgKiAoIGhpQm91bmQgLSBsb0JvdW5kICkgKyBsb0JvdW5kO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qIHB1YmxpYzogaW5pdGlhbGl6ZSBnZW5lcmF0b3Igd2l0aCB0aGUgc2VlZCB2YWx1ZXMgdXNlZCB1cG9uIGluc3RhbnRpYXRpb24gKi9cbiAgICAgICAgcmFuZG9tLnJlc3RhcnQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIF9pbml0U3RhdGUoIGluaXRpYWxBcmdzICk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyogcHVibGljOiBzZWVkaW5nIGZ1bmN0aW9uICovXG4gICAgICAgIHJhbmRvbS5zZWVkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBfaW5pdFN0YXRlKCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggYXJndW1lbnRzICkgKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKiBwdWJsaWM6IHNob3cgdGhlIHZlcnNpb24gb2YgdGhlIFJORyAqL1xuICAgICAgICByYW5kb20udmVyc2lvbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHZlcnNpb247XG4gICAgICAgIH07XG5cbiAgICAgICAgLyogcHVibGljOiBzaG93IHRoZSB2ZXJzaW9uIG9mIHRoZSBSTkcgYW5kIHRoZSBNYXNoIHN0cmluZyBoYXNoZXIgKi9cbiAgICAgICAgcmFuZG9tLnZlcnNpb25zID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdmVyc2lvbiArICcsICcgKyBtYXNodmVyO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIHdoZW4gbm8gc2VlZCBpcyBzcGVjaWZpZWQsIGNyZWF0ZSBhIHJhbmRvbSBvbmUgZnJvbSBXaW5kb3dzIENyeXB0byAoTW9udGUgQ2FybG8gYXBwbGljYXRpb24pXG4gICAgICAgIGlmKCBhcmdzLmxlbmd0aCA9PT0gMCApIHtcbiAgICAgICAgICAgICB3aW5kb3cuY3J5cHRvLmdldFJhbmRvbVZhbHVlcyggdWludGEgKTtcbiAgICAgICAgICAgICBhcmdzID0gWyB1aW50YVsgMCBdLCB1aW50YVsgMSBdLCB1aW50YVsgMiBdIF07XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gc3RvcmUgdGhlIHNlZWQgdXNlZCB3aGVuIHRoZSBSTkcgd2FzIGluc3RhbnRpYXRlZCwgaWYgYW55XG4gICAgICAgIGluaXRpYWxBcmdzID0gYXJncztcblxuICAgICAgICAvLyBpbml0aWFsaXplIHRoZSBSTkdcbiAgICAgICAgX2luaXRTdGF0ZSggYXJncyApO1xuXG4gICAgICAgIHJldHVybiByYW5kb207XG5cbiAgICB9KSggQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoIGFyZ3VtZW50cyApICk7XG59OyIsImltcG9ydCB7IGxvYWQgfSBmcm9tIFwiLi4vLi4vY29tbW9uL2pzL3JzaTE4bi5qc1wiO1xuXG5sb2FkKHtcbiAgICBlbjoge1xuICAgICAgICBtc2dfbm9fYW5zd2VyOiBcIk5vIGFuc3dlciBwcm92aWRlZC5cIixcbiAgICAgICAgbXNnX2ZpdGJfY2hlY2tfbWU6IFwiQ2hlY2sgbWVcIixcbiAgICAgICAgbXNnX2ZpdGJfY29tcGFyZV9tZTogXCJDb21wYXJlIG1lXCIsXG4gICAgICAgIG1zZ19maXRiX3JhbmRvbWl6ZTogXCJSYW5kb21pemVcIixcbiAgICAgICAgLy8gQWNjZXNzaWJsZSBuYW1lcy4gQSBzY3JlZW4gcmVhZGVyIHJlYWRzIG9ubHkgYSBmaWVsZCdzIG93biBuYW1lIHdoZW5cbiAgICAgICAgLy8gZm9jdXMgbGFuZHMgb24gaXQsIHNvIHRoZSBwcm9tcHQgaGFzIHRvIHRyYXZlbCB3aXRoIHRoZSBibGFuay5cbiAgICAgICAgLy8gJDEgPSBibGFuayBudW1iZXIsICQyID0gbnVtYmVyIG9mIGJsYW5rcywgJDMgPSB0aGUgcHJvbXB0IHRleHQuXG4gICAgICAgIG1zZ19maXRiX2JsYW5rX2xhYmVsOiBcIkJsYW5rICQxIG9mICQyLiAkM1wiLFxuICAgICAgICAvLyAkMSA9IHRoZSBwcm9tcHQgdGV4dC5cbiAgICAgICAgbXNnX2ZpdGJfYmxhbmtfbGFiZWxfc2luZ2xlOiBcIkZpbGwgaW4gdGhlIGJsYW5rLiAkMVwiLFxuICAgICAgICAvLyBVc2VkIHdoZW4gdGhlIHByb21wdCBoYXMgbm8gdGV4dCB0byByZWFkLCBlLmcuIGFuIGltYWdlLW9ubHkgcHJvYmxlbS5cbiAgICAgICAgbXNnX2ZpdGJfYmxhbmtfZmFsbGJhY2s6IFwiQmxhbmsgJDEgb2YgJDJcIixcbiAgICAgICAgbXNnX2ZpdGJfYmxhbmtfZmFsbGJhY2tfc2luZ2xlOiBcIkZpbGwgaW4gdGhlIGJsYW5rXCIsXG4gICAgICAgIC8vIEhvdyBhIGJsYW5rIGlzIHNwb2tlbiB3aGVyZSBpdCBhcHBlYXJzIGluIHRoZSBwcm9tcHQgdGV4dC4gJDEgPSBpdHNcbiAgICAgICAgLy8gbnVtYmVyLlxuICAgICAgICBtc2dfZml0Yl9ibGFua19uOiBcImJsYW5rICQxXCIsXG4gICAgICAgIG1zZ19maXRiX2dyb3VwX2xhYmVsOiBcIkZpbGwgaW4gdGhlIGJsYW5rIHF1ZXN0aW9uXCIsXG4gICAgICAgIC8vICQxID0gdGhlIHF1ZXN0aW9uIG51bWJlciBzaG93biBpbiB0aGUgY2FwdGlvbi5cbiAgICAgICAgbXNnX2ZpdGJfZ3JvdXBfbGFiZWxfbnVtYmVyZWQ6IFwiRmlsbCBpbiB0aGUgYmxhbmsgcXVlc3Rpb24gJDFcIixcbiAgICAgICAgbXNnX2ZpdGJfY29ycmVjdDogXCJDb3JyZWN0OlwiLFxuICAgICAgICBtc2dfZml0Yl9pbmNvcnJlY3Q6IFwiSW5jb3JyZWN0OlwiLFxuICAgICAgICBtc2dfZml0Yl9yZXN1bHRfY29ycmVjdDogXCJBbGwgYmxhbmtzIGNvcnJlY3QuXCIsXG4gICAgICAgIG1zZ19maXRiX3Jlc3VsdF9pbmNvcnJlY3Q6IFwiU29tZSBibGFua3MgYXJlIGluY29ycmVjdC5cIixcbiAgICAgICAgbXNnX2ZpdGJfdG9wX2Fuc3dlcnM6IFwiVG9wIEFuc3dlcnNcIixcbiAgICAgICAgbXNnX2ZpdGJfY2xvc2U6IFwiQ2xvc2VcIixcbiAgICB9LFxufSk7XG4iLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy8gfGRvY25hbWV8IC0tIGZpbGwtaW4tdGhlLWJsYW5rIGNsaWVudC1zaWRlIGNvZGVcbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyBUaGlzIGZpbGUgY29udGFpbnMgdGhlIEpTIGZvciB0aGUgUnVuZXN0b25lIGZpbGxpbnRoZWJsYW5rIGNvbXBvbmVudC4gSXQgd2FzIGNyZWF0ZWQgQnkgSXNhaWFoIE1heWVyY2hhayBhbmQgS2lyYnkgT2xzb24sIDYvNC8xNSB0aGVuIHJldmlzZWQgYnkgQnJhZCBNaWxsZXIsIDIvNy8yMC5cbi8vXG4vLyBEYXRhIHN0b3JhZ2Ugbm90ZXNcbi8vID09PT09PT09PT09PT09PT09PVxuLy9cbi8vIEluaXRpYWwgcHJvYmxlbSByZXN0b3JlXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW4gdGhlIGNvbnN0cnVjdG9yLCB0aGlzIGNvZGUgKHRoZSBjbGllbnQpIHJlc3RvcmVzIHRoZSBwcm9ibGVtIGJ5IGNhbGxpbmcgYGBjaGVja1NlcnZlcmBgLiBUbyBkbyBzbywgZWl0aGVyIHRoZSBzZXJ2ZXIgc2VuZHMgb3IgbG9jYWwgc3RvcmFnZSBoYXM6XG4vL1xuLy8gLSAgICBzZWVkICh1c2VkIG9ubHkgZm9yIGR5bmFtaWMgcHJvYmxlbXMpXG4vLyAtICAgIGFuc3dlclxuLy8gLSAgICBkaXNwbGF5RmVlZCAoc2VydmVyLXNpZGUgZ3JhZGluZyBvbmx5OyBvdGhlcndpc2UsIHRoaXMgaXMgZ2VuZXJhdGVkIGxvY2FsbHkgYnkgY2xpZW50IGNvZGUpXG4vLyAtICAgIGNvcnJlY3QgKFNTRylcbi8vIC0gICAgaXNDb3JyZWN0QXJyYXkgKFNTRylcbi8vIC0gICAgcHJvYmxlbUh0bWwgKFNTRyB3aXRoIGR5bmFtaWMgcHJvYmxlbXMgb25seSlcbi8vXG4vLyBJZiBhbnkgb2YgdGhlIGFuc3dlcnMgYXJlIGNvcnJlY3QsIHRoZW4gdGhlIGNsaWVudCBzaG93cyBmZWVkYmFjay4gVGhpcyBpcyBpbXBsZW1lbnRlZCBpbiByZXN0b3JlQW5zd2Vyc18uXG4vL1xuLy8gR3JhZGluZ1xuLy8gLS0tLS0tLVxuLy8gV2hlbiB0aGUgdXNlciBwcmVzc2VzIHRoZSBcIkNoZWNrIG1lXCIgYnV0dG9uLCB0aGUgbG9nQ3VycmVudEFuc3dlcl8gZnVuY3Rpb246XG4vL1xuLy8gLSAgICBTYXZlcyB0aGUgZm9sbG93aW5nIHRvIGxvY2FsIHN0b3JhZ2U6XG4vL1xuLy8gICAgICAtICAgc2VlZFxuLy8gICAgICAtICAgYW5zd2VyXG4vLyAgICAgIC0gICB0aW1lc3RhbXBcbi8vICAgICAgLSAgIHByb2JsZW1IdG1sXG4vL1xuLy8gICAgICBOb3RlIHRoYXQgdGhlcmUncyBubyBwb2ludCBpbiBzYXZpbmcgZGlzcGxheUZlZWQsIGNvcnJlY3QsIG9yIGlzQ29ycmVjdEFycmF5LCBzaW5jZSB0aGVzZSB2YWx1ZXMgYXBwbGllZCB0byB0aGUgcHJldmlvdXMgYW5zd2VyLCBub3QgdGhlIG5ldyBhbnN3ZXIganVzdCBzdWJtaXR0ZWQuXG4vL1xuLy8gLSAgICBTZW5kcyB0aGUgZm9sbG93aW5nIHRvIHRoZSBzZXJ2ZXI7IHN0b3AgYWZ0ZXIgdGhpcyBmb3IgY2xpZW50LXNpZGUgZ3JhZGluZzpcbi8vXG4vLyAgICAgIC0gICBzZWVkIChpZ25vcmVkIGZvciBzZXJ2ZXItc2lkZSBncmFkaW5nKVxuLy8gICAgICAtICAgYW5zd2VyXG4vLyAgICAgIC0gICBjb3JyZWN0IChpZ25vcmVkIGZvciBTU0cpXG4vLyAgICAgIC0gICBwZXJjZW50IChpZ25vcmVkIGZvciBTU0cpXG4vL1xuLy8gLSAgICBSZWNlaXZlcyB0aGUgZm9sbG93aW5nIGZyb20gdGhlIHNlcnZlcjpcbi8vXG4vLyAgICAgIC0gICB0aW1lc3RhbXBcbi8vICAgICAgLSAgIGRpc3BsYXlGZWVkXG4vLyAgICAgIC0gICBjb3JyZWN0XG4vLyAgICAgIC0gICBpc0NvcnJlY3RBcnJheVxuLy9cbi8vIC0gICAgU2F2ZXMgdGhlIGZvbGxvd2luZyB0byBsb2NhbCBzdG9yYWdlOlxuLy9cbi8vICAgICAgLSAgIHNlZWRcbi8vICAgICAgLSAgIGFuc3dlclxuLy8gICAgICAtICAgdGltZXN0YW1wXG4vLyAgICAgIC0gICBkaXNwbGF5RmVlZCAoU1NHIG9ubHkpXG4vLyAgICAgIC0gICBjb3JyZWN0IChTU0cgb25seSlcbi8vICAgICAgLSAgIGlzQ29ycmVjdEFycmF5IChTU0cgb25seSlcbi8vICAgICAgLSAgIHByb2JsZW1IdG1sXG4vL1xuLy8gUmFuZG9taXplXG4vLyAtLS0tLS0tLS1cbi8vIFdoZW4gdGhlIHVzZXIgcHJlc3NlcyB0aGUgXCJSYW5kb21pemVcIiBidXR0b24gKHdoaWNoIGlzIG9ubHkgYXZhaWxhYmxlIGZvciBkeW5hbWljIHByb2JsZW1zKSwgdGhlIHJhbmRvbWl6ZV8gZnVuY3Rpb246XG4vL1xuLy8gLSAgICBGb3IgdGhlIGNsaWVudC1zaWRlIGNhc2UsIHNldHMgdGhlIHNlZWQgdG8gYSBuZXcsIHJhbmRvbSB2YWx1ZS4gRm9yIHRoZSBzZXJ2ZXItc2lkZSBjYXNlLCByZXF1ZXN0cyBhIG5ldyBzZWVkIGFuZCBwcm9ibGVtSHRtbCBmcm9tIHRoZSBzZXJ2ZXIuXG4vLyAtICAgIFNldHMgdGhlIGFuc3dlciB0byBhbiBhcnJheSBvZiBlbXB0eSBzdHJpbmdzLlxuLy8gLSAgICBTYXZlcyB0aGUgdXN1YWwgbG9jYWwgZGF0YS5cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCBSdW5lc3RvbmVCYXNlIGZyb20gXCIuLi8uLi9jb21tb24vanMvcnVuZXN0b25lYmFzZS5qc1wiO1xuaW1wb3J0IHsgdCB9IGZyb20gXCIuLi8uLi9jb21tb24vanMvcnNpMThuLmpzXCI7XG5pbXBvcnQge1xuICAgIHJlbmRlckR5bmFtaWNDb250ZW50LFxuICAgIGNoZWNrQW5zd2Vyc0NvcmUsXG4gICAgcmVuZGVyRHluYW1pY0ZlZWRiYWNrLFxufSBmcm9tIFwiLi9maXRiLXV0aWxzLmpzXCI7XG5pbXBvcnQgXCIuL2ZpdGItaTE4bi5lbi5qc1wiO1xuaW1wb3J0IFwiLi9maXRiLWkxOG4ucHQtYnIuanNcIjtcbmltcG9ydCBcIi4vZml0Yi1pMThuLnNyLUN5cmwuanNcIjtcbmltcG9ydCBcIi4uL2Nzcy9maXRiLmNzc1wiO1xuXG4vLyBPYmplY3QgY29udGFpbmluZyBhbGwgaW5zdGFuY2VzIG9mIEZJVEIgdGhhdCBhcmVuJ3QgYSBjaGlsZCBvZiBhIHRpbWVkIGFzc2Vzc21lbnQuXG5leHBvcnQgdmFyIEZJVEJMaXN0ID0ge307XG5cbi8vIEZJVEIgY29uc3RydWN0b3JcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZJVEIgZXh0ZW5kcyBSdW5lc3RvbmVCYXNlIHtcbiAgICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgICAgIHN1cGVyKG9wdHMpO1xuICAgICAgICB2YXIgb3JpZyA9IG9wdHMub3JpZzsgLy8gZW50aXJlIDxwPiBlbGVtZW50XG4gICAgICAgIHRoaXMudXNlUnVuZXN0b25lU2VydmljZXMgPSBvcHRzLnVzZVJ1bmVzdG9uZVNlcnZpY2VzO1xuICAgICAgICB0aGlzLm9yaWdFbGVtID0gb3JpZztcbiAgICAgICAgdGhpcy5kaXZpZCA9IG9yaWcuaWQ7XG4gICAgICAgIHRoaXMuY29ycmVjdCA9IG51bGw7XG4gICAgICAgIC8vIFNlZSBjb21tZW50cyBpbiBmaXRiLnB5IGZvciB0aGUgZm9ybWF0IG9mIGBgZmVlZGJhY2tBcnJheWBgICh3aGljaCBpcyBpZGVudGljYWwgaW4gYm90aCBmaWxlcykuXG4gICAgICAgIC8vXG4gICAgICAgIC8vIEZpbmQgdGhlIHNjcmlwdCB0YWcgY29udGFpbmluZyBKU09OIGFuZCBwYXJzZSBpdC4gU2VlIGBTTyA8aHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvOTMyMDQyNy9iZXN0LXByYWN0aWNlLWZvci1lbWJlZGRpbmctYXJiaXRyYXJ5LWpzb24taW4tdGhlLWRvbT5gX18uIElmIHRoaXMgdGFnIGRvZXNuJ3QgZXhpc3QsIHRoZW4gbm8gZmVlZGJhY2sgaXMgYXZhaWxhYmxlOyBzZXJ2ZXItc2lkZSBncmFkaW5nIHdpbGwgYmUgcGVyZm9ybWVkLlxuICAgICAgICAvL1xuICAgICAgICAvLyBBIGRlc3RydWN0dXJpbmcgYXNzaWdubWVudCB3b3VsZCBiZSBwZXJmZWN0LCBidXQgdGhleSBkb24ndCB3b3JrIHdpdGggYGB0aGlzLmJsYWhgYCBhbmQgYGB3aXRoYGAgc3RhdGVtZW50cyBhcmVuJ3Qgc3VwcG9ydGVkIGluIHN0cmljdCBtb2RlLlxuICAgICAgICBjb25zdCBqc29uX2VsZW1lbnQgPSB0aGlzLnNjcmlwdFNlbGVjdG9yKHRoaXMub3JpZ0VsZW0pO1xuICAgICAgICBjb25zdCBkaWN0XyA9IEpTT04ucGFyc2UoanNvbl9lbGVtZW50LnRleHRDb250ZW50KTtcbiAgICAgICAganNvbl9lbGVtZW50LnJlbW92ZSgpO1xuICAgICAgICAvLyBDaGVjayBmb3Igb2xkZXIgdmVyc2lvbnMgdGhhdCBoYXZlIHJhdyBodG1sIGNvbnRlbnQuXG4gICAgICAgIGlmIChkaWN0Xy5wcm9ibGVtSHRtbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAvLyBpZiBkaWN0Xy5wcm9ibGVtSHRtbCBzdGFydHMgd2l0aCAmbHQ7IHRoZW4gdW5lc2NhcGUgaXQgdGhpcyBoYXBwZW5zIGZvciBwcmV2aWV3c1xuICAgICAgICAgICAgLy8gd2hlbiB0aGUgcHJvYmxlbSBjb21lcyBmcm9tIHRoZSBEQlxuICAgICAgICAgICAgaWYgKGRpY3RfLnByb2JsZW1IdG1sLnN0YXJ0c1dpdGgoXCImbHQ7XCIpKSB7XG4gICAgICAgICAgICAgICAgZGljdF8ucHJvYmxlbUh0bWwgPSBkaWN0Xy5wcm9ibGVtSHRtbFxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvJmx0Oy9nLCBcIjxcIilcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLyZndDsvZywgXCI+XCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGVCb29rQ29uZmlnLnVzZVJ1bmVzdG9uZVNlcnZpY2VzKSB7XG4gICAgICAgICAgICAgICAgZGljdF8ucHJvYmxlbUh0bWwgPSBkaWN0Xy5wcm9ibGVtSHRtbC5yZXBsYWNlKFxuICAgICAgICAgICAgICAgICAgICAvc3JjPVwiZXh0ZXJuYWwvZyxcbiAgICAgICAgICAgICAgICAgICAgJ3NyYz1cIicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgYC9ucy9ib29rcy9wdWJsaXNoZWQvJHtlQm9va0NvbmZpZy5iYXNlY291cnNlfWAgK1xuICAgICAgICAgICAgICAgICAgICAgICAgXCIvZXh0ZXJuYWxcIixcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnByb2JsZW1IdG1sID0gZGljdF8ucHJvYmxlbUh0bWw7XG4gICAgICAgICAgICB0aGlzLmR5bl92YXJzID0gZGljdF8uZHluX3ZhcnM7XG4gICAgICAgICAgICB0aGlzLmJsYW5rTmFtZXMgPSBkaWN0Xy5ibGFua05hbWVzO1xuICAgICAgICAgICAgdGhpcy5mZWVkYmFja0FycmF5ID0gZGljdF8uZmVlZGJhY2tBcnJheTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucHJvYmxlbUh0bWwgPSB0aGlzLm9yaWdFbGVtLmlubmVySFRNTDtcbiAgICAgICAgICAgIHRoaXMuZmVlZGJhY2tBcnJheSA9IGRpY3RfO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jcmVhdGVGSVRCRWxlbWVudCgpO1xuICAgICAgICB0aGlzLnNldHVwQmxhbmtzKCk7XG4gICAgICAgIHRoaXMuY2FwdGlvbiA9IFwiRmlsbCBpbiB0aGUgQmxhbmtcIjtcbiAgICAgICAgdGhpcy5hZGRDYXB0aW9uKFwicnVuZXN0b25lXCIpO1xuICAgICAgICB0aGlzLnNldEdyb3VwTGFiZWwoKTtcblxuICAgICAgICAvLyBEZWZpbmUgYSBwcm9taXNlIHdoaWNoIGltcG9ydHMgYW55IGxpYnJhcmllcyBuZWVkZWQgYnkgZHluYW1pYyBwcm9ibGVtcy5cbiAgICAgICAgdGhpcy5keW5faW1wb3J0cyA9IHt9O1xuICAgICAgICBsZXQgaW1wb3J0c19wcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIGlmIChkaWN0Xy5keW5faW1wb3J0cyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAvLyBDb2xsZWN0IGFsbCBpbXBvcnQgcHJvbWlzZXMuXG4gICAgICAgICAgICBsZXQgaW1wb3J0X3Byb21pc2VzID0gW107XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGltcG9ydF8gb2YgZGljdF8uZHluX2ltcG9ydHMpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGltcG9ydF8pIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gRm9yIGltcG9ydHMga25vd24gYXQgd2VicGFjayBidWlsZCwgYnJpbmcgdGhlc2UgaW4uXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJCVE1cIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIGltcG9ydF9wcm9taXNlcy5wdXNoKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltcG9ydChcImJ0bS1leHByZXNzaW9ucy9zcmMvQlRNX3Jvb3QuanNcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIC8vIEFsbG93IGZvciBsb2NhbCBpbXBvcnRzLCB1c3VhbGx5IGZyb20gcHJvYmxlbXMgZGVmaW5lZCBvdXRzaWRlIHRoZSBSdW5lc3RvbmUgQ29tcG9uZW50cy5cbiAgICAgICAgICAgICAgICAgICAgLy8gUmVsYXRpdmUgVVJMIHNob3VsZCBiZSByZWxhdGl2ZSB0byBkb2N1bWVudCBiYXNlLCBub3QgdGhpcyBsaWJyYXJ5XG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBhYnNvbHV0ZVVybCA9IG5ldyBVUkwoaW1wb3J0XywgZG9jdW1lbnQuYmFzZVVSSSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuaHJlZjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGltcG9ydF9wcm9taXNlcy5wdXNoKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltcG9ydCgvKiB3ZWJwYWNrSWdub3JlOiB0cnVlICovIGFic29sdXRlVXJsKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIENvbWJpbmUgdGhlIHJlc3VsdGluZyBtb2R1bGUgbmFtZXNwYWNlIG9iamVjdHMgd2hlbiB0aGVzZSBwcm9taXNlcyByZXNvbHZlLlxuICAgICAgICAgICAgaW1wb3J0c19wcm9taXNlID0gUHJvbWlzZS5hbGwoaW1wb3J0X3Byb21pc2VzKVxuICAgICAgICAgICAgICAgIC50aGVuKFxuICAgICAgICAgICAgICAgICAgICAobW9kdWxlX25hbWVzcGFjZV9hcnIpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAodGhpcy5keW5faW1wb3J0cyA9IE9iamVjdC5hc3NpZ24oXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge30sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4ubW9kdWxlX25hbWVzcGFjZV9hcnIsXG4gICAgICAgICAgICAgICAgICAgICAgICApKSxcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgYEZhaWxlZCBkeW5hbWljIGltcG9ydDogJHtlcnJ9LmA7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZXNvbHZlIHRoZXNlIHByb21pc2VzLlxuICAgICAgICBpbXBvcnRzX3Byb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNoZWNrU2VydmVyKFwiZmlsbGJcIiwgZmFsc2UpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIE9uZSBvcHRpb24gZm9yIGEgZHluYW1pYyBwcm9ibGVtIGlzIHRvIHByb2R1Y2UgYSBzdGF0aWMgcHJvYmxlbSBieSBwcm92aWRpbmcgYSBmaXhlZCBzZWVkIHZhbHVlLiBUaGlzIGlzIHR5cGljYWxseSB1c2VkIHdoZW4gdGhlIGdvYWwgaXMgdG8gcmVuZGVyIHRoZSBwcm9ibGVtIGFzIGFuIGltYWdlIGZvciBpbmNsdXNpb24gaW4gc3RhdGljIGNvbnRlbnQgKGEgUERGLCBldGMuKS4gVG8gc3VwcG9ydCB0aGlzLCBjb25zaWRlciB0aGUgZm9sbG93aW5nIGNhc2VzOlxuICAgICAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAgICAgLy8vIENhc2UgIEhhcyBzdGF0aWMgc2VlZD8gIElzIGEgY2xpZW50LXNpZGUsIGR5bmFtaWMgcHJvYmxlbT8gIEhhcyBsb2NhbCBzZWVkPyAgUmVzdWx0XG4gICAgICAgICAgICAgICAgLy8vIDAgICAgIE5vICAgICAgICAgICAgICAgIE5vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFggICAgICAgICAgICAgICAgTm8gYWN0aW9uIG5lZWRlZC5cbiAgICAgICAgICAgICAgICAvLy8gMSAgICAgTm8gICAgICAgICAgICAgICAgWWVzICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTm8gICAgICAgICAgICAgICB0aGlzLnJhbmRvbWl6ZSgpLlxuICAgICAgICAgICAgICAgIC8vLyAyICAgICBObyAgICAgICAgICAgICAgICBZZXMgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBZZXMgICAgICAgICAgICAgIE5vIGFjdGlvbiBuZWVkZWQgLS0gcHJvYmxlbSBhbHJlYWR5IHJlc3RvcmVkIGZyb20gbG9jYWwgc3RvcmFnZS5cbiAgICAgICAgICAgICAgICAvLy8gMyAgICAgWWVzICAgICAgICAgICAgICAgTm8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgWCAgICAgICAgICAgICAgICBXYXJuaW5nOiBzZWVkIGlnbm9yZWQuXG4gICAgICAgICAgICAgICAgLy8vIDQgICAgIFllcyAgICAgICAgICAgICAgIFllcyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE5vICAgICAgICAgICAgICAgQXNzaWduIHNlZWQ7IHRoaXMucmVuZGVyRHluYW1pY0NvbnRlbnQoKS5cbiAgICAgICAgICAgICAgICAvLy8gNSAgICAgWWVzICAgICAgICAgICAgICAgWWVzICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgWWVzICAgICAgICAgICAgICBJZiBzZWVkcyBkaWZmZXIsIGlzc3VlIHdhcm5pbmcuIE5vIGFkZGl0aW9uYWwgYWN0aW9uIG5lZWRlZCAtLSBwcm9ibGVtIGFscmVhZHkgcmVzdG9yZWQgZnJvbSBsb2NhbCBzdG9yYWdlLlxuXG4gICAgICAgICAgICAgICAgY29uc3QgaGFzX3N0YXRpY19zZWVkID0gZGljdF8uc3RhdGljX3NlZWQgIT09IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICBjb25zdCBpc19jbGllbnRfZHluYW1pYyA9IHR5cGVvZiB0aGlzLmR5bl92YXJzID09PSBcInN0cmluZ1wiO1xuICAgICAgICAgICAgICAgIGNvbnN0IGhhc19sb2NhbF9zZWVkID0gdGhpcy5zZWVkICE9PSB1bmRlZmluZWQ7XG5cbiAgICAgICAgICAgICAgICAvLyBDYXNlIDFcbiAgICAgICAgICAgICAgICBpZiAoIWhhc19zdGF0aWNfc2VlZCAmJiBpc19jbGllbnRfZHluYW1pYyAmJiAhaGFzX2xvY2FsX3NlZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yYW5kb21pemUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gQ2FzZSAzXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoaGFzX3N0YXRpY19zZWVkICYmICFpc19jbGllbnRfZHluYW1pYykge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmFzc2VydChcbiAgICAgICAgICAgICAgICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJXYXJuaW5nOiB0aGUgcHJvdmlkZWQgc3RhdGljIHNlZWQgd2FzIGlnbm9yZWQsIGJlY2F1c2UgaXQgb25seSBhZmZlY3RzIGNsaWVudC1zaWRlLCBkeW5hbWljIHByb2JsZW1zLlwiLFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBDYXNlIDRcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChcbiAgICAgICAgICAgICAgICAgICAgaGFzX3N0YXRpY19zZWVkICYmXG4gICAgICAgICAgICAgICAgICAgIGlzX2NsaWVudF9keW5hbWljICYmXG4gICAgICAgICAgICAgICAgICAgICFoYXNfbG9jYWxfc2VlZFxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlZWQgPSBkaWN0Xy5zdGF0aWNfc2VlZDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJEeW5hbWljQ29udGVudCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBDYXNlIDVcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChcbiAgICAgICAgICAgICAgICAgICAgaGFzX3N0YXRpY19zZWVkICYmXG4gICAgICAgICAgICAgICAgICAgIGlzX2NsaWVudF9keW5hbWljICYmXG4gICAgICAgICAgICAgICAgICAgIGhhc19sb2NhbF9zZWVkICYmXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VlZCAhPT0gZGljdF8uc3RhdGljX3NlZWRcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5hc3NlcnQoXG4gICAgICAgICAgICAgICAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiV2FybmluZzogdGhlIHByb3ZpZGVkIHN0YXRpYyBzZWVkIHdhcyBvdmVycmlkZGVuIGJ5IHRoZSBzZWVkIGZvdW5kIGluIGxvY2FsIHN0b3JhZ2UuXCIsXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIENhc2VzIDAgYW5kIDJcbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gTm8gYWN0aW9uIG5lZWRlZC5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIFByaXNtICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIFByaXNtLmhpZ2hsaWdodEFsbFVuZGVyKHRoaXMuY29udGFpbmVyRGl2KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLmluZGljYXRlX2NvbXBvbmVudF9yZWFkeSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnR5cGVzZXRQcm9tcHQoKTtcbiAgICB9XG5cbiAgICAvLyBGaW5kIHRoZSBzY3JpcHQgdGFnIGNvbnRhaW5pbmcgSlNPTiBpbiBhIGdpdmVuIHJvb3QgRE9NIG5vZGUuXG4gICAgc2NyaXB0U2VsZWN0b3Iocm9vdF9ub2RlKSB7XG4gICAgICAgIHJldHVybiByb290X25vZGUucXVlcnlTZWxlY3Rvcihgc2NyaXB0W3R5cGU9XCJhcHBsaWNhdGlvbi9qc29uXCJdYCk7XG4gICAgfVxuXG4gICAgLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT09PSAgIEZ1bmN0aW9ucyBnZW5lcmF0aW5nIGZpbmFsIEhUTUwgICA9PT09XG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG4gICAgY3JlYXRlRklUQkVsZW1lbnQoKSB7XG4gICAgICAgIHRoaXMucmVuZGVyRklUQklucHV0KCk7XG4gICAgICAgIHRoaXMucmVuZGVyRklUQkJ1dHRvbnMoKTtcbiAgICAgICAgdGhpcy5yZW5kZXJGSVRCRmVlZGJhY2tEaXYoKTtcbiAgICAgICAgLy8gcmVwbGFjZXMgdGhlIGludGVybWVkaWF0ZSBIVE1MIGZvciB0aGlzIGNvbXBvbmVudCB3aXRoIHRoZSByZW5kZXJlZCBIVE1MIG9mIHRoaXMgY29tcG9uZW50XG4gICAgICAgIHRoaXMub3JpZ0VsZW0ucmVwbGFjZVdpdGgodGhpcy5jb250YWluZXJEaXYpO1xuICAgIH1cbiAgICByZW5kZXJGSVRCSW5wdXQoKSB7XG4gICAgICAgIC8vIFRoZSB0ZXh0IFtpbnB1dF0gZWxlbWVudHMgYXJlIGNyZWF0ZWQgYnkgdGhlIHRlbXBsYXRlLlxuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmlkID0gdGhpcy5kaXZpZDtcbiAgICAgICAgLy8gQ3JlYXRlIGFub3RoZXIgY29udGFpbmVyIHdoaWNoIHN0b3JlcyB0aGUgcHJvYmxlbSBkZXNjcmlwdGlvbi5cbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbkRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb25EaXYuY2xhc3NMaXN0LmFkZChcImV4ZXJjaXNlLXN0YXRlbWVudFwiKTtcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYuYXBwZW5kQ2hpbGQodGhpcy5kZXNjcmlwdGlvbkRpdik7XG4gICAgICAgIC8vIENvcHkgdGhlIG9yaWdpbmFsIGVsZW1lbnRzIHRvIHRoZSBjb250YWluZXIgaG9sZGluZyB3aGF0IHRoZSB1c2VyIHdpbGwgc2VlIChjbGllbnQtc2lkZSBncmFkaW5nIG9ubHkpLlxuICAgICAgICBpZiAodGhpcy5wcm9ibGVtSHRtbCkge1xuICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvbkRpdi5pbm5lckhUTUwgPSB0aGlzLnByb2JsZW1IdG1sO1xuICAgICAgICAgICAgLy8gU2F2ZSBvcmlnaW5hbCBIVE1MICh3aXRoIHRlbXBsYXRlcykgdXNlZCBpbiBkeW5hbWljIHByb2JsZW1zLlxuICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvbkRpdi5vcmlnSW5uZXJIVE1MID0gdGhpcy5wcm9ibGVtSHRtbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlbmRlckZJVEJCdXR0b25zKCkge1xuICAgICAgICAvLyBcInN1Ym1pdFwiIGJ1dHRvblxuICAgICAgICB0aGlzLnN1Ym1pdEJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICAgIHRoaXMuc3VibWl0QnV0dG9uLnRleHRDb250ZW50ID0gdChcIm1zZ19maXRiX2NoZWNrX21lXCIpO1xuICAgICAgICB0aGlzLnN1Ym1pdEJ1dHRvbi5jbGFzc05hbWUgPSBcImJ0biBidG4tc3VjY2Vzc1wiO1xuICAgICAgICB0aGlzLnN1Ym1pdEJ1dHRvbi5uYW1lID0gXCJkbyBhbnN3ZXJcIjtcbiAgICAgICAgdGhpcy5zdWJtaXRCdXR0b24udHlwZSA9IFwiYnV0dG9uXCI7XG4gICAgICAgIHRoaXMuc3VibWl0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICBcImNsaWNrXCIsXG4gICAgICAgICAgICBhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jaGVja0N1cnJlbnRBbnN3ZXIoKTtcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmxvZ0N1cnJlbnRBbnN3ZXIoKTtcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSxcbiAgICAgICAgICAgIGZhbHNlLFxuICAgICAgICApO1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZCh0aGlzLnN1Ym1pdEJ1dHRvbik7XG5cbiAgICAgICAgLy8gXCJjb21wYXJlIG1lXCIgYnV0dG9uXG4gICAgICAgIGlmICh0aGlzLnVzZVJ1bmVzdG9uZVNlcnZpY2VzKSB7XG4gICAgICAgICAgICB0aGlzLmNvbXBhcmVCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgICAgICAgICAgdGhpcy5jb21wYXJlQnV0dG9uLmNsYXNzTmFtZSA9IFwiYnRuIGJ0bi1kZWZhdWx0XCI7XG4gICAgICAgICAgICB0aGlzLmNvbXBhcmVCdXR0b24uaWQgPSB0aGlzLm9yaWdFbGVtLmlkICsgXCJfYmNvbXBcIjtcbiAgICAgICAgICAgIHRoaXMuY29tcGFyZUJ1dHRvbi50eXBlID0gXCJidXR0b25cIjtcbiAgICAgICAgICAgIHRoaXMuY29tcGFyZUJ1dHRvbi5kaXNhYmxlZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmNvbXBhcmVCdXR0b24ubmFtZSA9IFwiY29tcGFyZVwiO1xuICAgICAgICAgICAgdGhpcy5jb21wYXJlQnV0dG9uLnRleHRDb250ZW50ID0gdChcIm1zZ19maXRiX2NvbXBhcmVfbWVcIik7XG4gICAgICAgICAgICB0aGlzLmNvbXBhcmVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgICAgICBcImNsaWNrXCIsXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbXBhcmVGSVRCQW5zd2VycygpO1xuICAgICAgICAgICAgICAgIH0uYmluZCh0aGlzKSxcbiAgICAgICAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZCh0aGlzLmNvbXBhcmVCdXR0b24pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmFuZG9taXplIGJ1dHRvbiBmb3IgZHluYW1pYyBwcm9ibGVtcy5cbiAgICAgICAgaWYgKHRoaXMuZHluX3ZhcnMpIHtcbiAgICAgICAgICAgIHRoaXMucmFuZG9taXplQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICAgICAgICAgIHRoaXMucmFuZG9taXplQnV0dG9uLmNsYXNzTmFtZSA9IFwiYnRuIGJ0bi1kZWZhdWx0XCI7XG4gICAgICAgICAgICAvLyBOb3QgYGBfYmNvbXBgYDsgdGhhdCBpcyB0aGUgY29tcGFyZSBidXR0b24ncyBpZCwgYW5kIGR5bmFtaWNcbiAgICAgICAgICAgIC8vIHByb2JsZW1zIHRoYXQgb2ZmZXIgYm90aCB3b3VsZCBoYXZlIHByb2R1Y2VkIGEgZHVwbGljYXRlIGlkLlxuICAgICAgICAgICAgdGhpcy5yYW5kb21pemVCdXR0b24uaWQgPSB0aGlzLm9yaWdFbGVtLmlkICsgXCJfYnJhbmRcIjtcbiAgICAgICAgICAgIHRoaXMucmFuZG9taXplQnV0dG9uLnR5cGUgPSBcImJ1dHRvblwiO1xuICAgICAgICAgICAgdGhpcy5yYW5kb21pemVCdXR0b24ubmFtZSA9IFwicmFuZG9taXplXCI7XG4gICAgICAgICAgICB0aGlzLnJhbmRvbWl6ZUJ1dHRvbi50ZXh0Q29udGVudCA9IHQoXCJtc2dfZml0Yl9yYW5kb21pemVcIik7XG4gICAgICAgICAgICB0aGlzLnJhbmRvbWl6ZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgICAgIFwiY2xpY2tcIixcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmFuZG9taXplKCk7XG4gICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpLFxuICAgICAgICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmFwcGVuZENoaWxkKHRoaXMucmFuZG9taXplQnV0dG9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIikpO1xuICAgIH1cbiAgICByZW5kZXJGSVRCRmVlZGJhY2tEaXYoKSB7XG4gICAgICAgIHRoaXMuZmVlZEJhY2tEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB0aGlzLmZlZWRCYWNrRGl2LmlkID0gdGhpcy5kaXZpZCArIFwiX2ZlZWRiYWNrXCI7XG4gICAgICAgIC8vIGBgcm9sZT1cInN0YXR1c1wiYGAgaXMgYW4gaW1wbGljaXRseSBwb2xpdGUgbGl2ZSByZWdpb24uIFRoZSBwcmV2aW91c1xuICAgICAgICAvLyBgYHJvbGU9XCJhbGVydFwiYGAgd2FzIGFzc2VydGl2ZSwgY29udHJhZGljdGluZyB0aGUgcG9saXRlIHNldHRpbmdcbiAgICAgICAgLy8gYmVzaWRlIGl0IGFuZCBpbnRlcnJ1cHRpbmcgd2hhdGV2ZXIgdGhlIHNjcmVlbiByZWFkZXIgd2FzIHNheWluZy5cbiAgICAgICAgdGhpcy5mZWVkQmFja0Rpdi5zZXRBdHRyaWJ1dGUoXCJyb2xlXCIsIFwic3RhdHVzXCIpO1xuICAgICAgICB0aGlzLmZlZWRCYWNrRGl2LnNldEF0dHJpYnV0ZShcImFyaWEtbGl2ZVwiLCBcInBvbGl0ZVwiKTtcbiAgICAgICAgdGhpcy5mZWVkQmFja0Rpdi5zZXRBdHRyaWJ1dGUoXCJhcmlhLWF0b21pY1wiLCBcInRydWVcIik7XG4gICAgICAgIHRoaXMuZmVlZEJhY2tEaXYuY2xhc3NMaXN0LmFkZChcImZpdGItZmVlZGJhY2tcIik7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmFwcGVuZENoaWxkKHRoaXMuZmVlZEJhY2tEaXYpO1xuICAgIH1cblxuICAgIGNsZWFyRmVlZGJhY2tEaXYoKSB7XG4gICAgICAgIC8vIFNldHRpbmcgdGhlIGBgb3V0ZXJIVE1MYGAgcmVtb3ZlcyB0aGlzIGZyb20gdGhlIERPTS4gVXNlIGFuIGFsdGVybmF0aXZlIHByb2Nlc3MgLS0gcmVtb3ZlIHRoZSBjbGFzcyAod2hpY2ggbWFrZXMgaXQgcmVkL2dyZWVuIGJhc2VkIG9uIGdyYWRpbmcpIGFuZCBjb250ZW50LlxuICAgICAgICB0aGlzLmZlZWRCYWNrRGl2LmlubmVySFRNTCA9IFwiXCI7XG4gICAgICAgIC8vIEtlZXAgYGBmaXRiLWZlZWRiYWNrYGA7IG9ubHkgdGhlIGFsZXJ0IGNvbG91cmluZyBpcyBwZXItZ3JhZGUuXG4gICAgICAgIHRoaXMuZmVlZEJhY2tEaXYuY2xhc3NOYW1lID0gXCJmaXRiLWZlZWRiYWNrXCI7XG4gICAgICAgIHRoaXMuY2xlYXJCbGFua0ZlZWRiYWNrKCk7XG4gICAgfVxuXG4gICAgLy8gRHJvcCB0aGUgcGVyLWJsYW5rIGdyYWRpbmcgc3RhdGUsIHNvIGEgc3RhbGUgYGBhcmlhLWRlc2NyaWJlZGJ5YGAgbmV2ZXJcbiAgICAvLyBwb2ludHMgYXQgZmVlZGJhY2sgdGhhdCBoYXMgYWxyZWFkeSBiZWVuIHJlbW92ZWQgZnJvbSB0aGUgcGFnZS5cbiAgICBjbGVhckJsYW5rRmVlZGJhY2soKSB7XG4gICAgICAgIGZvciAoY29uc3QgYmxhbmsgb2YgdGhpcy5ibGFua0FycmF5IHx8IFtdKSB7XG4gICAgICAgICAgICBibGFuay5jbGFzc0xpc3QucmVtb3ZlKFwiaW5wdXQtdmFsaWRhdGlvbi1lcnJvclwiKTtcbiAgICAgICAgICAgIGJsYW5rLnJlbW92ZUF0dHJpYnV0ZShcImFyaWEtaW52YWxpZFwiKTtcbiAgICAgICAgICAgIGJsYW5rLnJlbW92ZUF0dHJpYnV0ZShcImFyaWEtZGVzY3JpYmVkYnlcIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBVcGRhdGUgdGhlIHByb2JsZW0ncyBkZXNjcmlwdGlvbiBiYXNlZCBvbiBkeW5hbWljYWxseS1nZW5lcmF0ZWQgY29udGVudC5cbiAgICByZW5kZXJEeW5hbWljQ29udGVudCgpIHtcbiAgICAgICAgLy8gYGB0aGlzLmR5bl92YXJzYGAgY2FuIGJlIHRydWU7IGlmIHNvLCBkb24ndCByZW5kZXIgaXQsIHNpbmNlIHRoZSBzZXJ2ZXIgZG9lcyBhbGwgdGhlIHJlbmRlcmluZy5cbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmR5bl92YXJzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICBsZXQgaHRtbF9ub2RlcztcbiAgICAgICAgICAgIFtodG1sX25vZGVzLCB0aGlzLmR5bl92YXJzX2V2YWxdID0gcmVuZGVyRHluYW1pY0NvbnRlbnQoXG4gICAgICAgICAgICAgICAgdGhpcy5zZWVkLFxuICAgICAgICAgICAgICAgIHRoaXMuZHluX3ZhcnMsXG4gICAgICAgICAgICAgICAgdGhpcy5keW5faW1wb3J0cyxcbiAgICAgICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uRGl2Lm9yaWdJbm5lckhUTUwsXG4gICAgICAgICAgICAgICAgdGhpcy5kaXZpZCxcbiAgICAgICAgICAgICAgICB0aGlzLnByZXBhcmVDaGVja0Fuc3dlcnMuYmluZCh0aGlzKSxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uRGl2LnJlcGxhY2VDaGlsZHJlbiguLi5odG1sX25vZGVzKTtcblxuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmR5bl92YXJzX2V2YWwuYWZ0ZXJDb250ZW50UmVuZGVyID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmR5bl92YXJzX2V2YWwuYWZ0ZXJDb250ZW50UmVuZGVyKHRoaXMuZHluX3ZhcnNfZXZhbCk7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuYXNzZXJ0KFxuICAgICAgICAgICAgICAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBgRXJyb3IgaW4gcHJvYmxlbSAke3RoaXMuZGl2aWR9IGludm9raW5nIGFmdGVyQ29udGVudFJlbmRlcmAsXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuc2V0dXBCbGFua3MoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldHVwQmxhbmtzKCkge1xuICAgICAgICAvLyBGaW5kIGFuZCBmb3JtYXQgdGhlIGJsYW5rcy4gSWYgYSBkeW5hbWljIHByb2JsZW0ganVzdCBjaGFuZ2VkIHRoZSBIVE1MLCB0aGlzIHdpbGwgZmluZCB0aGUgbmV3bHktY3JlYXRlZCBibGFua3MuXG4gICAgICAgIC8vIFdBUk5JTkcgLSB0aGlzIGFzc3VtZXMgdGhhdCBhbGwgdGV4dC9udW1iZXIgaW5wdXRzIGluIHRoZSBkZXNjcmlwdGlvbkRpdiBhcmUgdGhlIGJsYW5rcy5cbiAgICAgICAgLy8gSWRlYWxseSwgdGhlcmUgc2hvdWxkIGJlIHNvbWUgdW5pcXVlIGF0dHJpYnV0ZSB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlbGVjdCB0aGUgYmxhbmtzLlxuICAgICAgICBjb25zdCBiYSA9IHRoaXMuZGVzY3JpcHRpb25EaXYucXVlcnlTZWxlY3RvckFsbChcbiAgICAgICAgICAgICdpbnB1dFt0eXBlPVwidGV4dFwiXSxpbnB1dFt0eXBlPVwibnVtYmVyXCJdJyxcbiAgICAgICAgKTtcbiAgICAgICAgYmEuZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgICAgICAgIGVsLmNsYXNzTmFtZSA9IFwiZm9ybSBmb3JtLWNvbnRyb2wgc2VsZWN0d2lkdGhhdXRvXCI7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmJsYW5rQXJyYXkgPSBBcnJheS5mcm9tKGJhKTtcbiAgICAgICAgZm9yIChsZXQgYmxhbmsgb2YgdGhpcy5ibGFua0FycmF5KSB7XG4gICAgICAgICAgICBibGFuay5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIHRoaXMucmVjb3JkQW5zd2VyZWQuYmluZCh0aGlzKSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sYWJlbEJsYW5rcygpO1xuICAgIH1cblxuICAgIC8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09PT0gIEFjY2Vzc2libGUgbmFtZXMgZm9yIHRoZSBibGFua3MgID09PT1cbiAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbiAgICAvLyBOYW1lIHRoZSBleGVyY2lzZSBhcyBhIHdob2xlLCBzbyBlbnRlcmluZyBpdCBhbm5vdW5jZXMgd2hhdCBpdCBpcyByYXRoZXJcbiAgICAvLyB0aGFuIGFuIGFub255bW91cyBncm91cCBvZiB0ZXh0IGJveGVzLlxuICAgIHNldEdyb3VwTGFiZWwoKSB7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2LnNldEF0dHJpYnV0ZShcInJvbGVcIiwgXCJncm91cFwiKTtcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYuc2V0QXR0cmlidXRlKFxuICAgICAgICAgICAgXCJhcmlhLWxhYmVsXCIsXG4gICAgICAgICAgICB0aGlzLnF1ZXN0aW9uX2xhYmVsXG4gICAgICAgICAgICAgICAgPyB0KFwibXNnX2ZpdGJfZ3JvdXBfbGFiZWxfbnVtYmVyZWRcIiwgdGhpcy5xdWVzdGlvbl9sYWJlbClcbiAgICAgICAgICAgICAgICA6IHQoXCJtc2dfZml0Yl9ncm91cF9sYWJlbFwiKSxcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBBIHNjcmVlbiByZWFkZXIgYW5ub3VuY2VzIGEgZm9ybSBmaWVsZCdzIGFjY2Vzc2libGUgbmFtZSB3aGVuIGZvY3VzIGxhbmRzXG4gICAgLy8gb24gaXQgYW5kIG5vdGhpbmcgZWxzZSAtLSB0aGUgcHJvbXB0IHRleHQgYXJvdW5kIHRoZSBmaWVsZCBpcyBuZXZlciByZWFkXG4gICAgLy8gaW4gZm9ybXMgbW9kZS4gRXZlcnkgYmxhbmsgd2FzIG5hbWVkIFwiaW5wdXQgYXJlYVwiLCBzbyB0YWJiaW5nIGludG8gYVxuICAgIC8vIHF1ZXN0aW9uIHNhaWQgbm90aGluZyBhYm91dCB0aGUgcXVlc3Rpb24uIEJ1aWxkIGVhY2ggbmFtZSBvdXQgb2YgdGhlXG4gICAgLy8gcHJvbXB0IGluc3RlYWQsIHNwZWxsaW5nIG91dCBldmVyeSBibGFuayBpbiB0aGF0IHByb21wdCBhcyBcImJsYW5rIDFcIixcbiAgICAvLyBcImJsYW5rIDJcIiwgLi4uIHNvIHRoZSBnYXBzIGhhdmUgYXVkaWJsZSBwb3NpdGlvbnMuXG4gICAgbGFiZWxCbGFua3MoKSB7XG4gICAgICAgIGNvbnN0IHRvdGFsID0gdGhpcy5ibGFua0FycmF5Lmxlbmd0aDtcbiAgICAgICAgdGhpcy5ibGFua0FycmF5LmZvckVhY2goKGJsYW5rLCBpKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjb250ZXh0ID0gdGhpcy5ibGFua0NvbnRleHQoYmxhbmssIGkpO1xuICAgICAgICAgICAgbGV0IGxhYmVsO1xuICAgICAgICAgICAgaWYgKHRvdGFsID09PSAxKSB7XG4gICAgICAgICAgICAgICAgbGFiZWwgPSBjb250ZXh0XG4gICAgICAgICAgICAgICAgICAgID8gdChcIm1zZ19maXRiX2JsYW5rX2xhYmVsX3NpbmdsZVwiLCBjb250ZXh0KVxuICAgICAgICAgICAgICAgICAgICA6IHQoXCJtc2dfZml0Yl9ibGFua19mYWxsYmFja19zaW5nbGVcIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxhYmVsID0gY29udGV4dFxuICAgICAgICAgICAgICAgICAgICA/IHQoXCJtc2dfZml0Yl9ibGFua19sYWJlbFwiLCBpICsgMSwgdG90YWwsIGNvbnRleHQpXG4gICAgICAgICAgICAgICAgICAgIDogdChcIm1zZ19maXRiX2JsYW5rX2ZhbGxiYWNrXCIsIGkgKyAxLCB0b3RhbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBibGFuay5zZXRBdHRyaWJ1dGUoXCJhcmlhLWxhYmVsXCIsIGxhYmVsKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gVGhlIHByb21wdCB0ZXh0IHRvIHJlYWQgb3V0IGZvciBibGFuayBgYGlgYC5cbiAgICBibGFua0NvbnRleHQoYmxhbmssIGkpIHtcbiAgICAgICAgY29uc3QgYmxvY2sgPSB0aGlzLmJsYW5rQmxvY2soYmxhbmspO1xuICAgICAgICBsZXQgdGV4dCA9IHRoaXMuYmxhbmtDb250ZXh0VGV4dChibG9jayk7XG4gICAgICAgIC8vIE5ld2xpbmVzIGFyZSBvbmx5IHNpZ25pZmljYW50IGluIGEgY29kZSBsaXN0aW5nLCBhbmQgdGhlcmUgdGhlIHVzZWZ1bFxuICAgICAgICAvLyBjb250ZXh0IGlzIHRoZSBibGFuaydzIG93biBsaW5lOiByZWFkaW5nIGEgd2hvbGUgcHJvZ3JhbSBhbG91ZCBvblxuICAgICAgICAvLyBldmVyeSBUYWIgaXMgYXMgdW51c2FibGUgYXMgcmVhZGluZyBub3RoaW5nLiBGYWxsIGJhY2sgdG8gdGhlIGVudGlyZVxuICAgICAgICAvLyBsaXN0aW5nIGZvciBhIGJsYW5rIHRoYXQgc2l0cyBhbG9uZSBvbiBpdHMgbGluZSwgd2hpY2ggc2F5cyBub3RoaW5nXG4gICAgICAgIC8vIGJ5IGl0c2VsZi5cbiAgICAgICAgaWYgKGJsb2NrLnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJwcmVcIikge1xuICAgICAgICAgICAgY29uc3QgbWFya2VyID0gdChcIm1zZ19maXRiX2JsYW5rX25cIiwgaSArIDEpO1xuICAgICAgICAgICAgY29uc3QgbGluZSA9IHRleHQuc3BsaXQoXCJcXG5cIikuZmluZCgobCkgPT4gbC5pbmNsdWRlcyhtYXJrZXIpKTtcbiAgICAgICAgICAgIGlmIChsaW5lICE9PSB1bmRlZmluZWQgJiYgbGluZS5yZXBsYWNlKG1hcmtlciwgXCJcIikudHJpbSgpKSB7XG4gICAgICAgICAgICAgICAgdGV4dCA9IGxpbmU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIHRleHRcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxzKy9nLCBcIiBcIilcbiAgICAgICAgICAgICAgICAvLyBBIGJsYW5rIGlzIHBhZGRlZCB3aXRoIHNwYWNlcyBzbyBpdCBuZXZlciBydW5zIGludG8gdGhlIHdvcmRzXG4gICAgICAgICAgICAgICAgLy8gYmVzaWRlIGl0OyBwdWxsIHRoZSBwYWRkaW5nIGJhY2sgb2ZmIHB1bmN0dWF0aW9uLCB3aGljaFxuICAgICAgICAgICAgICAgIC8vIG90aGVyd2lzZSByZWFkcyBhcyBcImJsYW5rIDEgLCB0aGVuXCIuXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xccysoWywuOzohPylcXF19XSkvZywgXCIkMVwiKVxuICAgICAgICAgICAgICAgIC50cmltKClcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBUaGUgYmxvY2sgdGhlIGJsYW5rIHNpdHMgaW4gLS0gaXRzIHNlbnRlbmNlLCBsaXN0IGl0ZW0gb3IgdGFibGUgY2VsbCAtLVxuICAgIC8vIHdoaWNoIGlzIHRoZSB1c2VmdWwgdW5pdCBvZiBjb250ZXh0LiBGYWxscyBiYWNrIHRvIHRoZSB3aG9sZSBwcm9tcHQuXG4gICAgYmxhbmtCbG9jayhibGFuaykge1xuICAgICAgICBjb25zdCBibG9jayA9IGJsYW5rLmNsb3Nlc3QoXG4gICAgICAgICAgICBcInAsbGksZGQsZHQsdGQsdGgscHJlLGJsb2NrcXVvdGUsc2VjdGlvbixkaXYsaDEsaDIsaDMsaDQsaDUsaDZcIixcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIGJsb2NrICYmIHRoaXMuZGVzY3JpcHRpb25EaXYuY29udGFpbnMoYmxvY2spXG4gICAgICAgICAgICA/IGJsb2NrXG4gICAgICAgICAgICA6IHRoaXMuZGVzY3JpcHRpb25EaXY7XG4gICAgfVxuXG4gICAgLy8gRmxhdHRlbiBhbiBlbGVtZW50IGludG8gdGhlIHRleHQgYSBzY3JlZW4gcmVhZGVyIHdvdWxkIGhlYXIsIHdpdGggZWFjaFxuICAgIC8vIGJsYW5rIHJlcGxhY2VkIGJ5IGl0cyBzcG9rZW4gbnVtYmVyLiBXaGl0ZXNwYWNlIGlzIG5vdCBub3JtYWxpemVkIGhlcmUuXG4gICAgYmxhbmtDb250ZXh0VGV4dChyb290KSB7XG4gICAgICAgIGNvbnN0IHBhcnRzID0gW107XG4gICAgICAgIGNvbnN0IHdhbGsgPSAobm9kZSkgPT4ge1xuICAgICAgICAgICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFKSB7XG4gICAgICAgICAgICAgICAgcGFydHMucHVzaChub2RlLm5vZGVWYWx1ZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG5vZGUubm9kZVR5cGUgIT09IE5vZGUuRUxFTUVOVF9OT0RFKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gU2tpcCB3aGF0ZXZlciBpcyBhbHJlYWR5IGhpZGRlbiBmcm9tIGFzc2lzdGl2ZSB0ZWNobm9sb2d5LiBUaGlzXG4gICAgICAgICAgICAvLyBhbHNvIGRyb3BzIE1hdGhKYXgncyB2aXN1YWwgb3V0cHV0LCBsZWF2aW5nIGl0cyBhc3Npc3RpdmUgTWF0aE1MLlxuICAgICAgICAgICAgaWYgKG5vZGUuZ2V0QXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIikgPT09IFwidHJ1ZVwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgdGFnID0gbm9kZS50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICBpZiAodGFnID09PSBcInNjcmlwdFwiIHx8IHRhZyA9PT0gXCJzdHlsZVwiIHx8IHRhZyA9PT0gXCJ0ZW1wbGF0ZVwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgYmxhbmtJbmRleCA9IHRoaXMuYmxhbmtBcnJheS5pbmRleE9mKG5vZGUpO1xuICAgICAgICAgICAgaWYgKGJsYW5rSW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgcGFydHMucHVzaChgICR7dChcIm1zZ19maXRiX2JsYW5rX25cIiwgYmxhbmtJbmRleCArIDEpfSBgKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGFnID09PSBcImJyXCIpIHtcbiAgICAgICAgICAgICAgICBwYXJ0cy5wdXNoKFwiIFwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGFnID09PSBcImltZ1wiKSB7XG4gICAgICAgICAgICAgICAgcGFydHMucHVzaChgICR7bm9kZS5nZXRBdHRyaWJ1dGUoXCJhbHRcIikgfHwgXCJcIn0gYCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRhZyA9PT0gXCJpbnB1dFwiIHx8IHRhZyA9PT0gXCJzZWxlY3RcIiB8fCB0YWcgPT09IFwidGV4dGFyZWFcIikge1xuICAgICAgICAgICAgICAgIC8vIFNvbWUgb3RoZXIgY29udHJvbCB0aGUgYXV0aG9yIHB1dCBpbiB0aGUgcHJvbXB0OiByZWFkIHRoZVxuICAgICAgICAgICAgICAgIC8vIG5hbWUgaXQgY2FycmllcyByYXRoZXIgdGhhbiBkZXNjZW5kaW5nIGludG8gaXQuXG4gICAgICAgICAgICAgICAgcGFydHMucHVzaChgICR7bm9kZS5nZXRBdHRyaWJ1dGUoXCJhcmlhLWxhYmVsXCIpIHx8IFwiXCJ9IGApO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2Ygbm9kZS5jaGlsZE5vZGVzKSB7XG4gICAgICAgICAgICAgICAgd2FsayhjaGlsZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHdhbGsocm9vdCk7XG4gICAgICAgIC8vIFdoaXRlc3BhY2UgaXMgbGVmdCBhcy1pczsgdGhlIGNhbGxlciBkZWNpZGVzIHdoZXRoZXIgbmV3bGluZXMgbWF0dGVyLlxuICAgICAgICByZXR1cm4gcGFydHMuam9pbihcIlwiKTtcbiAgICB9XG5cbiAgICAvLyBNYXRoSmF4IHJld3JpdGVzIHRoZSBwcm9tcHQgYXN5bmNocm9ub3VzbHksIGFmdGVyIHRoZSBibGFua3MgaGF2ZSBiZWVuXG4gICAgLy8gbmFtZWQ7IHJlYnVpbGQgdGhlIG5hbWVzIG9uY2UgaXQgaXMgZG9uZSBzbyB0aGV5IGhvbGQgdGhlIHR5cGVzZXQgdGV4dFxuICAgIC8vIGluc3RlYWQgb2YgcmF3IExhVGVYLlxuICAgIHR5cGVzZXRQcm9tcHQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnF1ZXVlTWF0aEpheCh0aGlzLmRlc2NyaXB0aW9uRGl2KS50aGVuKCgpID0+XG4gICAgICAgICAgICB0aGlzLmxhYmVsQmxhbmtzKCksXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gVGhpcyB0ZWxscyB0aW1lZCBxdWVzdGlvbnMgdGhhdCB0aGUgZml0YiBibGFua3MgcmVjZWl2ZWQgc29tZSBpbnRlcmFjdGlvbi5cbiAgICByZWNvcmRBbnN3ZXJlZCgpIHtcbiAgICAgICAgdGhpcy5pc0Fuc3dlcmVkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAvKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT09IENoZWNraW5nL2xvYWRpbmcgZnJvbSBzdG9yYWdlID09PVxuICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbiAgICByZXN0b3JlQW5zd2VycyhkYXRhKSB7XG4gICAgICAgIC8vIFJlc3RvcmUgdGhlIHNlZWQgZmlyc3QsIHNpbmNlIHRoZSBkeW5hbWljIHJlbmRlciBjbGVhcnMgYWxsIHRoZSBibGFua3MuXG4gICAgICAgIHRoaXMuc2VlZCA9IGRhdGEuc2VlZDtcbiAgICAgICAgdGhpcy5yZW5kZXJEeW5hbWljQ29udGVudCgpO1xuICAgICAgICB0aGlzLnR5cGVzZXRQcm9tcHQoKTtcblxuICAgICAgICB2YXIgYXJyO1xuICAgICAgICAvLyBSZXN0b3JlIGFuc3dlcnMgZnJvbSBzdG9yYWdlIHJldHJpZXZhbCBkb25lIGluIFJ1bmVzdG9uZUJhc2UuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBUaGUgbmV3ZXIgZm9ybWF0IGVuY29kZXMgZGF0YSBhcyBhIEpTT04gb2JqZWN0LlxuICAgICAgICAgICAgYXJyID0gSlNPTi5wYXJzZShkYXRhLmFuc3dlcik7XG4gICAgICAgICAgICAvLyBUaGUgcmVzdWx0IHNob3VsZCBiZSBhbiBhcnJheS4gSWYgbm90LCB0cnkgY29tbWEgcGFyc2luZyBpbnN0ZWFkLlxuICAgICAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGFycikpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAvLyBUaGUgb2xkIGZvcm1hdCBkaWRuJ3QuXG4gICAgICAgICAgICBhcnIgPSAoZGF0YS5hbnN3ZXIgfHwgXCJcIikuc3BsaXQoXCIsXCIpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBoYXNBbnN3ZXIgPSBmYWxzZTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmJsYW5rQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuYmxhbmtBcnJheVtpXS52YWx1ZSA9IGFycltpXSB8fCBcIlwiO1xuICAgICAgICAgICAgaWYgKGFycltpXSkge1xuICAgICAgICAgICAgICAgIGhhc0Fuc3dlciA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gSXMgdGhpcyBjbGllbnQtc2lkZSBncmFkaW5nLCBvciBzZXJ2ZXItc2lkZSBncmFkaW5nP1xuICAgICAgICBpZiAodGhpcy5mZWVkYmFja0FycmF5KSB7XG4gICAgICAgICAgICAvLyBGb3IgY2xpZW50LXNpZGUgZ3JhZGluZywgcmUtZ2VuZXJhdGUgZmVlZGJhY2sgaWYgdGhlcmUncyBhbiBhbnN3ZXIuXG4gICAgICAgICAgICBpZiAoaGFzQW5zd2VyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jaGVja0N1cnJlbnRBbnN3ZXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIEZvciBzZXJ2ZXItc2lkZSBncmFkaW5nLCB1c2UgdGhlIHByb3ZpZGVkIGZlZWRiYWNrIGZyb20gdGhlIHNlcnZlciBvciBsb2NhbCBzdG9yYWdlLlxuICAgICAgICAgICAgdGhpcy5kaXNwbGF5RmVlZCA9IGRhdGEuZGlzcGxheUZlZWQ7XG4gICAgICAgICAgICB0aGlzLmNvcnJlY3QgPSBkYXRhLmNvcnJlY3Q7XG4gICAgICAgICAgICB0aGlzLmlzQ29ycmVjdEFycmF5ID0gZGF0YS5pc0NvcnJlY3RBcnJheTtcbiAgICAgICAgICAgIC8vIE9ubHkgcmVuZGVyIGlmIGFsbCB0aGUgZGF0YSBpcyBwcmVzZW50OyBsb2NhbCBzdG9yYWdlIG1pZ2h0IGhhdmUgb2xkIGRhdGEgbWlzc2luZyBzb21lIG9mIHRoZXNlIGl0ZW1zLlxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIHR5cGVvZiB0aGlzLmRpc3BsYXlGZWVkICE9PSBcInVuZGVmaW5lZFwiICYmXG4gICAgICAgICAgICAgICAgdHlwZW9mIHRoaXMuY29ycmVjdCAhPT0gXCJ1bmRlZmluZWRcIiAmJlxuICAgICAgICAgICAgICAgIHR5cGVvZiB0aGlzLmlzQ29ycmVjdEFycmF5ICE9PSBcInVuZGVmaW5lZFwiXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlckZlZWRiYWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBGb3Igc2VydmVyLXNpZGUgZHluYW1pYyBwcm9ibGVtcywgc2hvdyB0aGUgcmVuZGVyZWQgcHJvYmxlbSB0ZXh0LlxuICAgICAgICAgICAgdGhpcy5wcm9ibGVtSHRtbCA9IGRhdGEucHJvYmxlbUh0bWw7XG4gICAgICAgICAgICBpZiAodGhpcy5wcm9ibGVtSHRtbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb25EaXYuaW5uZXJIVE1MID0gdGhpcy5wcm9ibGVtSHRtbDtcbiAgICAgICAgICAgICAgICB0aGlzLnR5cGVzZXRQcm9tcHQoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNldHVwQmxhbmtzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjaGVja0xvY2FsU3RvcmFnZSgpIHtcbiAgICAgICAgLy8gTG9hZHMgcHJldmlvdXMgYW5zd2VycyBmcm9tIGxvY2FsIHN0b3JhZ2UgaWYgdGhleSBleGlzdFxuICAgICAgICB2YXIgc3RvcmVkRGF0YTtcbiAgICAgICAgaWYgKHRoaXMuZ3JhZGVyYWN0aXZlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGxlbiA9IGxvY2FsU3RvcmFnZS5sZW5ndGg7XG4gICAgICAgIGlmIChsZW4gPiAwKSB7XG4gICAgICAgICAgICB2YXIgZXggPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLmxvY2FsU3RvcmFnZUtleSgpKTtcbiAgICAgICAgICAgIGlmIChleCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGxldCBlcnJvciA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHN0b3JlZERhdGEgPSBKU09OLnBhcnNlKGV4KTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZXJyb3Igd2hpbGUgcGFyc2luZzsgbGlrZWx5IGR1ZSB0byBiYWQgdmFsdWUgc3RvcmVkIGluIHN0b3JhZ2VcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgICAgICAgICAgICAgICBgRXJyb3IgcGFyc2luZyBzdG9yZWQgRklUQiBkYXRhIGZvciAke3RoaXMuZGl2aWR9OiAke2Vyci5tZXNzYWdlfWAsXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGVycm9yIHx8IHN0b3JlZERhdGEudGltZXN0YW1wIDwgZUJvb2tDb25maWcudGVybVN0YXJ0RGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSh0aGlzLmxvY2FsU3RvcmFnZUtleSgpKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJlc3RvcmVBbnN3ZXJzKHN0b3JlZERhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0TG9jYWxTdG9yYWdlKGRhdGEpIHtcbiAgICAgICAgbGV0IGtleSA9IHRoaXMubG9jYWxTdG9yYWdlS2V5KCk7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICAgIH1cblxuICAgIGNoZWNrQ3VycmVudEFuc3dlcigpIHtcbiAgICAgICAgLy8gU3RhcnQgb2YgdGhlIGV2YWx1YXRpb24gY2hhaW5cbiAgICAgICAgdGhpcy5pc0NvcnJlY3RBcnJheSA9IFtdO1xuICAgICAgICB0aGlzLmRpc3BsYXlGZWVkID0gW107XG4gICAgICAgIGNvbnN0IHBjYSA9IHRoaXMucHJlcGFyZUNoZWNrQW5zd2VycygpO1xuXG4gICAgICAgIGlmICh0aGlzLnVzZVJ1bmVzdG9uZVNlcnZpY2VzKSB7XG4gICAgICAgICAgICBpZiAoZUJvb2tDb25maWcuZW5hYmxlQ29tcGFyZU1lKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbmFibGVDb21wYXJlQnV0dG9uKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBHcmFkZSBsb2NhbGx5IGlmIHdlIGNhbid0IGFzayB0aGUgc2VydmVyIHRvIGdyYWRlLlxuICAgICAgICBpZiAodGhpcy5mZWVkYmFja0FycmF5KSB7XG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgLy8gQW4gYXJyYXkgb2YgSFRNTCBmZWVkYmFjay5cbiAgICAgICAgICAgICAgICB0aGlzLmRpc3BsYXlGZWVkLFxuICAgICAgICAgICAgICAgIC8vIHRydWUsIGZhbHNlLCBvciBudWxsICh0aGUgcXVlc3Rpb24gd2Fzbid0IGFuc3dlcmVkKS5cbiAgICAgICAgICAgICAgICB0aGlzLmNvcnJlY3QsXG4gICAgICAgICAgICAgICAgLy8gQW4gYXJyYXkgb2YgdHJ1ZSwgZmFsc2UsIG9yIG51bGwgKHRoZSBxdWVzdGlvbiB3YXNuJ3QgYW5zd2VyZWQpLlxuICAgICAgICAgICAgICAgIHRoaXMuaXNDb3JyZWN0QXJyYXksXG4gICAgICAgICAgICAgICAgdGhpcy5wZXJjZW50LFxuICAgICAgICAgICAgXSA9IGNoZWNrQW5zd2Vyc0NvcmUoLi4ucGNhKTtcbiAgICAgICAgICAgIGlmICghdGhpcy5pc1RpbWVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJGZWVkYmFjaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gSW5wdXRzOlxuICAgIC8vXG4gICAgLy8gLSBTdHJpbmdzIGVudGVyZWQgYnkgdGhlIHN0dWRlbnQgaW4gYGB0aGlzLmJsYW5rQXJyYXlbaV0udmFsdWVgYC5cbiAgICAvLyAtIEZlZWRiYWNrIGluIGBgdGhpcy5mZWVkYmFja0FycmF5YGAuXG4gICAgcHJlcGFyZUNoZWNrQW5zd2VycygpIHtcbiAgICAgICAgdGhpcy5naXZlbl9hcnIgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmJsYW5rQXJyYXkubGVuZ3RoOyBpKyspXG4gICAgICAgICAgICB0aGlzLmdpdmVuX2Fyci5wdXNoKHRoaXMuYmxhbmtBcnJheVtpXS52YWx1ZSk7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICB0aGlzLmJsYW5rTmFtZXMsXG4gICAgICAgICAgICB0aGlzLmdpdmVuX2FycixcbiAgICAgICAgICAgIHRoaXMuZmVlZGJhY2tBcnJheSxcbiAgICAgICAgICAgIHRoaXMuZHluX3ZhcnNfZXZhbCxcbiAgICAgICAgXTtcbiAgICB9XG5cbiAgICAvLyBfYHJhbmRvbWl6ZWA6IFRoaXMgaGFuZGxlcyBhIGNsaWNrIHRvIHRoZSBcIlJhbmRvbWl6ZVwiIGJ1dHRvbi5cbiAgICBhc3luYyByYW5kb21pemUoKSB7XG4gICAgICAgIC8vIFVzZSB0aGUgY2xpZW50LXNpZGUgY2FzZSBvciB0aGUgc2VydmVyLXNpZGUgY2FzZT9cbiAgICAgICAgaWYgKHRoaXMuZmVlZGJhY2tBcnJheSkge1xuICAgICAgICAgICAgLy8gVGhpcyBpcyB0aGUgY2xpZW50LXNpZGUgY2FzZS5cbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICB0aGlzLnNlZWQgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyICoqIDMyKTtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyRHluYW1pY0NvbnRlbnQoKTtcbiAgICAgICAgICAgIHRoaXMudHlwZXNldFByb21wdCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gVGhpcyBpcyB0aGUgc2VydmVyLXNpZGUgY2FzZS4gU2VuZCBhIHJlcXVlc3QgdG8gdGhlIGByZXN1bHRzIDxnZXRBc3Nlc3NSZXN1bHRzPmAgZW5kcG9pbnQgd2l0aCBgYG5ld19zZWVkYGAgc2V0IHRvIFRydWUuXG4gICAgICAgICAgICBjb25zdCByZXF1ZXN0ID0gbmV3IFJlcXVlc3QoXCIvYXNzZXNzbWVudC9yZXN1bHRzXCIsIHtcbiAgICAgICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICAgICAgZGl2X2lkOiB0aGlzLmRpdmlkLFxuICAgICAgICAgICAgICAgICAgICBjb3Vyc2U6IGVCb29rQ29uZmlnLmNvdXJzZSxcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQ6IFwiZmlsbGJcIixcbiAgICAgICAgICAgICAgICAgICAgc2lkOiB0aGlzLnNpZCxcbiAgICAgICAgICAgICAgICAgICAgbmV3X3NlZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgaGVhZGVyczogdGhpcy5qc29uSGVhZGVycyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChyZXF1ZXN0KTtcbiAgICAgICAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgICAgICAgICBhbGVydChgSFRUUCBlcnJvciBnZXR0aW5nIHJlc3VsdHM6ICR7cmVzcG9uc2Uuc3RhdHVzVGV4dH1gKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gZGF0YS5kZXRhaWw7XG4gICAgICAgICAgICB0aGlzLnNlZWQgPSByZXMuc2VlZDtcbiAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb25EaXYuaW5uZXJIVE1MID0gcmVzLnByb2JsZW1IdG1sO1xuICAgICAgICAgICAgdGhpcy50eXBlc2V0UHJvbXB0KCk7XG4gICAgICAgICAgICB0aGlzLnNldHVwQmxhbmtzKCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gV2hlbiBnZXR0aW5nIGEgbmV3IHNlZWQsIGNsZWFyIGFsbCB0aGUgb2xkIGFuc3dlcnMgYW5kIGZlZWRiYWNrLlxuICAgICAgICB0aGlzLmdpdmVuX2FyciA9IEFycmF5KHRoaXMuYmxhbmtBcnJheS5sZW5ndGgpLmZpbGwoXCJcIik7XG4gICAgICAgIHRoaXMuYmxhbmtBcnJheS5mb3JFYWNoKChlbCkgPT4gKGVsLnZhbHVlID0gXCJcIikpO1xuICAgICAgICB0aGlzLmNsZWFyRmVlZGJhY2tEaXYoKTtcbiAgICAgICAgdGhpcy5zYXZlQW5zd2Vyc0xvY2FsbHlPbmx5KCk7XG4gICAgfVxuXG4gICAgLy8gU2F2ZSB0aGUgYW5zd2VycyBhbmQgYXNzb2NpYXRlZCBkYXRhIGxvY2FsbHk7IGRvbid0IHNhdmUgZmVlZGJhY2sgcHJvdmlkZWQgYnkgdGhlIHNlcnZlciBmb3IgdGhpcyBhbnN3ZXIuIEl0IGFzc3VtZXMgdGhhdCBgYHRoaXMuZ2l2ZW5fYXJyYGAgY29udGFpbnMgdGhlIGN1cnJlbnQgYW5zd2Vycy5cbiAgICBzYXZlQW5zd2Vyc0xvY2FsbHlPbmx5KCkge1xuICAgICAgICB0aGlzLnNldExvY2FsU3RvcmFnZSh7XG4gICAgICAgICAgICAvLyBUaGUgc2VlZCBpcyB1c2VkIGZvciBjbGllbnQtc2lkZSBvcGVyYXRpb24sIGJ1dCBkb2Vzbid0IG1hdHRlciBmb3Igc2VydmVyLXNpZGUuXG4gICAgICAgICAgICBzZWVkOiB0aGlzLnNlZWQsXG4gICAgICAgICAgICBhbnN3ZXI6IEpTT04uc3RyaW5naWZ5KHRoaXMuZ2l2ZW5fYXJyKSxcbiAgICAgICAgICAgIHRpbWVzdGFtcDogbmV3IERhdGUoKSxcbiAgICAgICAgICAgIC8vIFRoaXMgaXMgb25seSBuZWVkZWQgZm9yIHNlcnZlci1zaWRlIGdyYWRpbmcgd2l0aCBkeW5hbWljIHByb2JsZW1zLlxuICAgICAgICAgICAgcHJvYmxlbUh0bWw6IHRoaXMuZGVzY3JpcHRpb25EaXYuaW5uZXJIVE1MLFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBfYGxvZ0N1cnJlbnRBbnN3ZXJgOiBTYXZlIHRoZSBjdXJyZW50IHN0YXRlIG9mIHRoZSBwcm9ibGVtIHRvIGxvY2FsIHN0b3JhZ2UgYW5kIHRoZSBzZXJ2ZXI7IGRpc3BsYXkgc2VydmVyIGZlZWRiYWNrLlxuICAgIGFzeW5jIGxvZ0N1cnJlbnRBbnN3ZXIoc2lkKSB7XG4gICAgICAgIGxldCBhbnN3ZXIgPSBKU09OLnN0cmluZ2lmeSh0aGlzLmdpdmVuX2Fycik7XG4gICAgICAgIGxldCBmZWVkYmFjayA9IHRydWU7XG4gICAgICAgIC8vIFNhdmUgdGhlIGFuc3dlciBsb2NhbGx5LlxuICAgICAgICB0aGlzLnNhdmVBbnN3ZXJzTG9jYWxseU9ubHkoKTtcbiAgICAgICAgLy8gU2F2ZSB0aGUgYW5zd2VyIHRvIHRoZSBzZXJ2ZXIuXG4gICAgICAgIGNvbnN0IGRhdGEgPSB7XG4gICAgICAgICAgICBldmVudDogXCJmaWxsYlwiLFxuICAgICAgICAgICAgZGl2X2lkOiB0aGlzLmRpdmlkLFxuICAgICAgICAgICAgYWN0OiBhbnN3ZXIgfHwgXCJcIixcbiAgICAgICAgICAgIHNlZWQ6IHRoaXMuc2VlZCxcbiAgICAgICAgICAgIGFuc3dlcjogYW5zd2VyIHx8IFwiXCIsXG4gICAgICAgICAgICBjb3JyZWN0OiB0aGlzLmNvcnJlY3QgPyBcIlRcIiA6IFwiRlwiLFxuICAgICAgICAgICAgcGVyY2VudDogdGhpcy5wZXJjZW50LFxuICAgICAgICB9O1xuICAgICAgICBpZiAodHlwZW9mIHNpZCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgZGF0YS5zaWQgPSBzaWQ7XG4gICAgICAgICAgICBmZWVkYmFjayA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHNlcnZlcl9kYXRhID0gYXdhaXQgdGhpcy5sb2dCb29rRXZlbnQoZGF0YSk7XG4gICAgICAgIGlmICghZmVlZGJhY2spIHJldHVybjtcbiAgICAgICAgLy8gTm9uLXNlcnZlciBzaWRlIGdyYWRlZCBwcm9ibGVtcyBhcmUgZG9uZSBhdCB0aGlzIHBvaW50OyBsaWtld2lzZSwgc3RvcCBoZXJlIGlmIHRoZSBzZXJ2ZXIgZGlkbid0IHJlc3BvbmQuXG4gICAgICAgIGlmICh0aGlzLmZlZWRiYWNrQXJyYXkgfHwgIXNlcnZlcl9kYXRhKSB7XG4gICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgfVxuICAgICAgICAvLyBUaGlzIGlzIHRoZSBzZXJ2ZXItc2lkZSBjYXNlLiBPbiBzdWNjZXNzLCB1cGRhdGUgdGhlIGZlZWRiYWNrIGZyb20gdGhlIHNlcnZlcidzIGdyYWRlLlxuICAgICAgICBjb25zdCByZXMgPSBzZXJ2ZXJfZGF0YS5kZXRhaWw7XG4gICAgICAgIHRoaXMudGltZXN0YW1wID0gcmVzLnRpbWVzdGFtcDtcbiAgICAgICAgdGhpcy5kaXNwbGF5RmVlZCA9IHJlcy5kaXNwbGF5RmVlZDtcbiAgICAgICAgdGhpcy5jb3JyZWN0ID0gcmVzLmNvcnJlY3Q7XG4gICAgICAgIHRoaXMuaXNDb3JyZWN0QXJyYXkgPSByZXMuaXNDb3JyZWN0QXJyYXk7XG4gICAgICAgIHRoaXMuc2V0TG9jYWxTdG9yYWdlKHtcbiAgICAgICAgICAgIHNlZWQ6IHRoaXMuc2VlZCxcbiAgICAgICAgICAgIGFuc3dlcjogYW5zd2VyLFxuICAgICAgICAgICAgdGltZXN0YW1wOiB0aGlzLnRpbWVzdGFtcCxcbiAgICAgICAgICAgIHByb2JsZW1IdG1sOiB0aGlzLmRlc2NyaXB0aW9uRGl2LmlubmVySFRNTCxcbiAgICAgICAgICAgIGRpc3BsYXlGZWVkOiB0aGlzLmRpc3BsYXlGZWVkLFxuICAgICAgICAgICAgY29ycmVjdDogdGhpcy5jb3JyZWN0LFxuICAgICAgICAgICAgaXNDb3JyZWN0QXJyYXk6IHRoaXMuaXNDb3JyZWN0QXJyYXksXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnJlbmRlckZlZWRiYWNrKCk7XG4gICAgICAgIHJldHVybiBzZXJ2ZXJfZGF0YTtcbiAgICB9XG5cbiAgICAvKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09PSBFdmFsdWF0aW9uIG9mIGFuc3dlciBhbmQgPT09XG4gICAgPT09ICAgICBkaXNwbGF5IGZlZWRiYWNrICAgICA9PT1cbiAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuICAgIHJlbmRlckZlZWRiYWNrKCkge1xuICAgICAgICAvLyBTdGFydCBmcm9tIGEgY2xlYW4gc2xhdGU6IGEgcHJldmlvdXMgZ3JhZGUgbWF5IGhhdmUgbGVmdCBhblxuICAgICAgICAvLyBgYGFyaWEtZGVzY3JpYmVkYnlgYCBwb2ludGluZyBhdCBmZWVkYmFjayBhYm91dCB0byBiZSByZXBsYWNlZC5cbiAgICAgICAgdGhpcy5jbGVhckJsYW5rRmVlZGJhY2soKTtcbiAgICAgICAgaWYgKHRoaXMuY29ycmVjdCkge1xuICAgICAgICAgICAgdGhpcy5mZWVkQmFja0Rpdi5jbGFzc05hbWUgPSBcImFsZXJ0IGFsZXJ0LWluZm8gZml0Yi1mZWVkYmFja1wiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHRoaXMuZGlzcGxheUZlZWQgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRpc3BsYXlGZWVkID0gXCJcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZmVlZEJhY2tEaXYuY2xhc3NOYW1lID0gXCJhbGVydCBhbGVydC1kYW5nZXIgZml0Yi1mZWVkYmFja1wiO1xuICAgICAgICB9XG4gICAgICAgIC8vIE1hcmsgdGhlIGJsYW5rcyB0aGVtc2VsdmVzLiBUaGUgcmVkIGJvcmRlciBpcyBpbnZpc2libGUgdG8gYSBzY3JlZW5cbiAgICAgICAgLy8gcmVhZGVyOyBgYGFyaWEtaW52YWxpZGBgIGlzIHdoYXQgaXQgcmVwb3J0cyB3aGVuIGZvY3VzIHJldHVybnMuXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5ibGFua0FycmF5Lmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICBjb25zdCB3cm9uZyA9ICF0aGlzLmNvcnJlY3QgJiYgdGhpcy5pc0NvcnJlY3RBcnJheVtqXSAhPT0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuYmxhbmtBcnJheVtqXS5jbGFzc0xpc3QudG9nZ2xlKFxuICAgICAgICAgICAgICAgIFwiaW5wdXQtdmFsaWRhdGlvbi1lcnJvclwiLFxuICAgICAgICAgICAgICAgIHdyb25nLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHRoaXMuYmxhbmtBcnJheVtqXS5zZXRBdHRyaWJ1dGUoXG4gICAgICAgICAgICAgICAgXCJhcmlhLWludmFsaWRcIixcbiAgICAgICAgICAgICAgICB3cm9uZyA/IFwidHJ1ZVwiIDogXCJmYWxzZVwiLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEEgc2luZ2xlIHBpZWNlIG9mIGZlZWRiYWNrIGlzIG5vdCBhIGxpc3Q7IGRvbid0IG1ha2UgYSBzY3JlZW4gcmVhZGVyXG4gICAgICAgIC8vIGFubm91bmNlIFwibGlzdCwgMSBpdGVtXCIgZm9yIGl0LlxuICAgICAgICBjb25zdCBzaW5nbGUgPSB0aGlzLmRpc3BsYXlGZWVkLmxlbmd0aCA9PT0gMTtcbiAgICAgICAgY29uc3QgbGlzdCA9IHNpbmdsZVxuICAgICAgICAgICAgPyBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KClcbiAgICAgICAgICAgIDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInVsXCIpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZGlzcGxheUZlZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBkZiA9IHRoaXMuZGlzcGxheUZlZWRbaV07XG4gICAgICAgICAgICBjb25zdCBvayA9IHRoaXMuaXNDb3JyZWN0QXJyYXlbaV0gPT09IHRydWU7XG4gICAgICAgICAgICAvLyBSZW5kZXIgYW55IGR5bmFtaWMgZmVlZGJhY2sgaW4gdGhlIHByb3ZpZGVkIGZlZWRiYWNrLCBmb3IgY2xpZW50LXNpZGUgZ3JhZGluZyBvZiBkeW5hbWljIHByb2JsZW1zLlxuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmR5bl92YXJzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAgICAgZGYgPSByZW5kZXJEeW5hbWljRmVlZGJhY2soXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYmxhbmtOYW1lcyxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5naXZlbl9hcnIsXG4gICAgICAgICAgICAgICAgICAgIGksXG4gICAgICAgICAgICAgICAgICAgIGRmLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmR5bl92YXJzX2V2YWwsXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAvLyBDb252ZXJ0IHRoZSByZXR1cm5lZCBOb2RlTGlzdCBpbnRvIGEgc3RyaW5nIG9mIEhUTUwuXG4gICAgICAgICAgICAgICAgZGYgPVxuICAgICAgICAgICAgICAgICAgICBkZj8uWzBdICE9PSB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICAgICAgICAgID8gZGZbMF0ucGFyZW50RWxlbWVudC5pbm5lckhUTUxcbiAgICAgICAgICAgICAgICAgICAgICAgIDogXCJObyBmZWVkYmFjayBwcm92aWRlZFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgaXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoc2luZ2xlID8gXCJzcGFuXCIgOiBcImxpXCIpO1xuICAgICAgICAgICAgaXRlbS5pZCA9IGAke3RoaXMuZGl2aWR9X2ZlZWRiYWNrXyR7aX1gO1xuICAgICAgICAgICAgLy8gVGhlIGNoZWNrIG9yIGNyb3NzIGlzIGRlY29yYXRpb24gLS0gc2NyZWVuIHJlYWRlcnMgZWl0aGVyIHNraXAgaXRcbiAgICAgICAgICAgIC8vIG9yIHJlYWQgdGhlIGVtb2ppJ3MgbmFtZS4gSGlkZSBpdCBhbmQgc2F5IHRoZSB3b3JkIGluc3RlYWQuXG4gICAgICAgICAgICBjb25zdCBtYXJrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgICAgICAgICBtYXJrLnNldEF0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIsIFwidHJ1ZVwiKTtcbiAgICAgICAgICAgIG1hcmsudGV4dENvbnRlbnQgPSBvayA/IFwi4pyU77iPXCIgOiBcIuKclu+4j1wiO1xuICAgICAgICAgICAgY29uc3Qgc3Bva2VuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgICAgICAgICBzcG9rZW4uY2xhc3NOYW1lID0gXCJ2aXN1YWxseWhpZGRlblwiO1xuICAgICAgICAgICAgc3Bva2VuLnRleHRDb250ZW50ID0gYCR7XG4gICAgICAgICAgICAgICAgb2sgPyB0KFwibXNnX2ZpdGJfY29ycmVjdFwiKSA6IHQoXCJtc2dfZml0Yl9pbmNvcnJlY3RcIilcbiAgICAgICAgICAgIH0gYDtcbiAgICAgICAgICAgIGNvbnN0IGJvZHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICAgICAgICAgIGJvZHkuaW5uZXJIVE1MID0gZGYgPz8gXCJcIjtcbiAgICAgICAgICAgIGl0ZW0uYXBwZW5kKG1hcmssIGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiIFwiKSwgc3Bva2VuLCBib2R5KTtcbiAgICAgICAgICAgIGxpc3QuYXBwZW5kQ2hpbGQoaXRlbSk7XG4gICAgICAgICAgICAvLyBUaWUgdGhlIGZlZWRiYWNrIHRvIHRoZSBibGFuayBpdCBncmFkZXMsIHNvIHRhYmJpbmcgYmFjayBpbnRvIGFcbiAgICAgICAgICAgIC8vIHdyb25nIGFuc3dlciByZXBlYXRzIHdoeSBpdCB3YXMgd3JvbmcuXG4gICAgICAgICAgICBpZiAodGhpcy5ibGFua0FycmF5W2ldKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ibGFua0FycmF5W2ldLnNldEF0dHJpYnV0ZShcImFyaWEtZGVzY3JpYmVkYnlcIiwgaXRlbS5pZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5mZWVkQmFja0Rpdi5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgICBpZiAodGhpcy5kaXNwbGF5RmVlZC5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAvLyBXaXRoIHNldmVyYWwgYmxhbmtzIHRoZSBwZXItYmxhbmsgbWFya3MgYXJlIGVhc3kgdG8gbG9zZSB0cmFja1xuICAgICAgICAgICAgLy8gb2Y7IGxlYWQgdGhlIGFubm91bmNlbWVudCB3aXRoIHRoZSBvdmVyYWxsIHZlcmRpY3QuXG4gICAgICAgICAgICBjb25zdCBzdW1tYXJ5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgIHN1bW1hcnkuY2xhc3NOYW1lID0gXCJ2aXN1YWxseWhpZGRlblwiO1xuICAgICAgICAgICAgc3VtbWFyeS50ZXh0Q29udGVudCA9IHRoaXMuY29ycmVjdFxuICAgICAgICAgICAgICAgID8gdChcIm1zZ19maXRiX3Jlc3VsdF9jb3JyZWN0XCIpXG4gICAgICAgICAgICAgICAgOiB0KFwibXNnX2ZpdGJfcmVzdWx0X2luY29ycmVjdFwiKTtcbiAgICAgICAgICAgIHRoaXMuZmVlZEJhY2tEaXYuYXBwZW5kQ2hpbGQoc3VtbWFyeSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5mZWVkQmFja0Rpdi5hcHBlbmRDaGlsZChsaXN0KTtcbiAgICAgICAgdGhpcy5xdWV1ZU1hdGhKYXgodGhpcy5mZWVkQmFja0Rpdik7XG4gICAgfVxuXG4gICAgLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT09IEZ1bmN0aW9ucyBmb3IgY29tcGFyZSBidXR0b24gPT09XG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG4gICAgZW5hYmxlQ29tcGFyZUJ1dHRvbigpIHtcbiAgICAgICAgdGhpcy5jb21wYXJlQnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XG4gICAgfVxuICAgIC8vIF9gY29tcGFyZUZJVEJBbnN3ZXJzYFxuICAgIGFzeW5jIGNvbXBhcmVGSVRCQW5zd2VycygpIHtcbiAgICAgICAgdmFyIGRhdGEgPSB7fTtcbiAgICAgICAgZGF0YS5kaXZfaWQgPSB0aGlzLmRpdmlkO1xuICAgICAgICBkYXRhLmNvdXJzZSA9IGVCb29rQ29uZmlnLmNvdXJzZTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMoZGF0YSk7XG4gICAgICAgICAgICBjb25zdCByZXNwID0gYXdhaXQgZmV0Y2goXG4gICAgICAgICAgICAgICAgYCR7ZUJvb2tDb25maWcubmV3X3NlcnZlcl9wcmVmaXh9L2Fzc2Vzc21lbnQvZ2V0dG9wMTBBbnN3ZXJzPyR7cGFyYW1zLnRvU3RyaW5nKCl9YCxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjb25zdCBqc29uID0gYXdhaXQgcmVzcC5qc29uKCk7XG4gICAgICAgICAgICB0aGlzLmNvbXBhcmVGSVRCKGpzb24pO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgZmV0Y2hpbmcgdG9wIGFuc3dlcnM6XCIsIGUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNvbXBhcmVGSVRCKGRhdGEsIHN0YXR1cywgd2hhdGV2ZXIpIHtcbiAgICAgICAgY29uc3QgYW5zd2VycyA9IGRhdGEuZGV0YWlsLnJlcztcbiAgICAgICAgY29uc3QgdGl0bGVJZCA9IGAke3RoaXMuZGl2aWR9X2NvbXBhcmVfdGl0bGVgO1xuICAgICAgICAvLyBBIHJlYWwgaGVhZGVyIHJvdywgbWFya2VkIHVwIGFzIG9uZSwgc28gYSBzY3JlZW4gcmVhZGVyIGNhbiBhbm5vdW5jZVxuICAgICAgICAvLyB0aGUgY29sdW1uIHdoZW4gcmVhZGluZyBkb3duIHRoZSB0YWJsZS5cbiAgICAgICAgbGV0IGJvZHkgPSBcIjx0YWJsZT48dGhlYWQ+PHRyPlwiO1xuICAgICAgICBib2R5ICs9IFwiPHRoIHNjb3BlPSdjb2wnPkFuc3dlcjwvdGg+PHRoIHNjb3BlPSdjb2wnPkNvdW50PC90aD5cIjtcbiAgICAgICAgYm9keSArPSBcIjwvdHI+PC90aGVhZD48dGJvZHk+XCI7XG4gICAgICAgIGZvciAoY29uc3Qgcm93IGluIGFuc3dlcnMpIHtcbiAgICAgICAgICAgIGJvZHkgKz1cbiAgICAgICAgICAgICAgICBcIjx0cj48dGQ+XCIgK1xuICAgICAgICAgICAgICAgIGFuc3dlcnNbcm93XS5hbnN3ZXIgK1xuICAgICAgICAgICAgICAgIFwiPC90ZD48dGQ+XCIgK1xuICAgICAgICAgICAgICAgIGFuc3dlcnNbcm93XS5jb3VudCArXG4gICAgICAgICAgICAgICAgXCIgdGltZXM8L3RkPjwvdHI+XCI7XG4gICAgICAgIH1cbiAgICAgICAgYm9keSArPSBcIjwvdGJvZHk+PC90YWJsZT5cIjtcblxuICAgICAgICAvLyBTaW1wbGUgbW9kYWwgd2l0aG91dCBCb290c3RyYXAvalF1ZXJ5XG4gICAgICAgIGNvbnN0IHByZXZpb3VzbHlGb2N1c2VkID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcbiAgICAgICAgY29uc3Qgb3ZlcmxheSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIG92ZXJsYXkuc3R5bGUucG9zaXRpb24gPSBcImZpeGVkXCI7XG4gICAgICAgIG92ZXJsYXkuc3R5bGUuaW5zZXQgPSBcIjBcIjtcbiAgICAgICAgb3ZlcmxheS5zdHlsZS5iYWNrZ3JvdW5kID0gXCJyZ2JhKDAsMCwwLDAuNSlcIjtcbiAgICAgICAgb3ZlcmxheS5zdHlsZS56SW5kZXggPSBcIjk5OTlcIjtcblxuICAgICAgICBjb25zdCBkaWFsb2cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBkaWFsb2cuY2xhc3NOYW1lID0gXCJjb21wYXJlLW1vZGFsXCI7XG4gICAgICAgIC8vIEFubm91bmNlIHRoaXMgYXMgYSBkaWFsb2cgbmFtZWQgYnkgaXRzIGhlYWRpbmcsIGFuZCBoaWRlIHRoZSBwYWdlXG4gICAgICAgIC8vIGJlaGluZCBpdCBmcm9tIGFzc2lzdGl2ZSB0ZWNobm9sb2d5IHdoaWxlIGl0IGlzIG9wZW4uXG4gICAgICAgIGRpYWxvZy5zZXRBdHRyaWJ1dGUoXCJyb2xlXCIsIFwiZGlhbG9nXCIpO1xuICAgICAgICBkaWFsb2cuc2V0QXR0cmlidXRlKFwiYXJpYS1tb2RhbFwiLCBcInRydWVcIik7XG4gICAgICAgIGRpYWxvZy5zZXRBdHRyaWJ1dGUoXCJhcmlhLWxhYmVsbGVkYnlcIiwgdGl0bGVJZCk7XG4gICAgICAgIGRpYWxvZy50YWJJbmRleCA9IC0xO1xuICAgICAgICBkaWFsb2cuc3R5bGUubWF4V2lkdGggPSBcIjcyMHB4XCI7XG4gICAgICAgIGRpYWxvZy5zdHlsZS5tYXJnaW4gPSBcIjEwdmggYXV0b1wiO1xuICAgICAgICBkaWFsb2cuc3R5bGUuYmFja2dyb3VuZCA9IFwiI2ZmZlwiO1xuICAgICAgICBkaWFsb2cuc3R5bGUuYm9yZGVyUmFkaXVzID0gXCI2cHhcIjtcbiAgICAgICAgZGlhbG9nLnN0eWxlLmJveFNoYWRvdyA9IFwiMCAycHggMTJweCByZ2JhKDAsMCwwLDAuMylcIjtcbiAgICAgICAgZGlhbG9nLnN0eWxlLnBhZGRpbmcgPSBcIjE2cHhcIjtcblxuICAgICAgICBjb25zdCBjbG9zZSA9ICgpID0+IHtcbiAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIG9uS2V5ZG93biwgdHJ1ZSk7XG4gICAgICAgICAgICBvdmVybGF5LnJlbW92ZSgpO1xuICAgICAgICAgICAgLy8gUHV0IHRoZSB1c2VyIGJhY2sgd2hlcmUgdGhleSB3ZXJlLCBub3QgYXQgdGhlIHRvcCBvZiB0aGUgcGFnZS5cbiAgICAgICAgICAgIGlmIChwcmV2aW91c2x5Rm9jdXNlZCAmJiBwcmV2aW91c2x5Rm9jdXNlZC5mb2N1cykge1xuICAgICAgICAgICAgICAgIHByZXZpb3VzbHlGb2N1c2VkLmZvY3VzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIC8vIEVzY2FwZSBjbG9zZXMsIGFuZCBUYWIgY3ljbGVzIGluc2lkZSB0aGUgZGlhbG9nOiBgYGFyaWEtbW9kYWxgYCB0ZWxsc1xuICAgICAgICAvLyBhIHNjcmVlbiByZWFkZXIgdGhlIHJlc3Qgb2YgdGhlIHBhZ2UgaXMgaW5lcnQsIGJ1dCBkb2VzIG5vdCBrZWVwIHRoZVxuICAgICAgICAvLyBrZXlib2FyZCBmcm9tIHRhYmJpbmcgb3V0IGludG8gaXQuXG4gICAgICAgIGNvbnN0IG9uS2V5ZG93biA9IChldikgPT4ge1xuICAgICAgICAgICAgaWYgKGV2LmtleSA9PT0gXCJFc2NhcGVcIikge1xuICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgY2xvc2UoKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZXYua2V5ICE9PSBcIlRhYlwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgZm9jdXNhYmxlID0gZGlhbG9nLnF1ZXJ5U2VsZWN0b3JBbGwoXG4gICAgICAgICAgICAgICAgXCJidXR0b24sIFtocmVmXSwgaW5wdXQsIHNlbGVjdCwgdGV4dGFyZWEsIFt0YWJpbmRleF06bm90KFt0YWJpbmRleD0nLTEnXSlcIixcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBpZiAoIWZvY3VzYWJsZS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBmaXJzdCA9IGZvY3VzYWJsZVswXTtcbiAgICAgICAgICAgIGNvbnN0IGxhc3QgPSBmb2N1c2FibGVbZm9jdXNhYmxlLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgaWYgKGV2LnNoaWZ0S2V5ICYmIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IGZpcnN0KSB7XG4gICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBsYXN0LmZvY3VzKCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCFldi5zaGlmdEtleSAmJiBkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBsYXN0KSB7XG4gICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBmaXJzdC5mb2N1cygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IGhlYWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGNvbnN0IGNsb3NlQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICAgICAgY2xvc2VCdG4udHlwZSA9IFwiYnV0dG9uXCI7XG4gICAgICAgIC8vIFRoZSBnbHlwaCBpcyBkZWNvcmF0aW9uOyB0aGUgYnV0dG9uIG5lZWRzIGEgbmFtZSB0aGF0IGNhbiBiZSBzcG9rZW4uXG4gICAgICAgIGNvbnN0IGNsb3NlR2x5cGggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICAgICAgY2xvc2VHbHlwaC5zZXRBdHRyaWJ1dGUoXCJhcmlhLWhpZGRlblwiLCBcInRydWVcIik7XG4gICAgICAgIGNsb3NlR2x5cGgudGV4dENvbnRlbnQgPSBcIlxcdTAwZDdcIjtcbiAgICAgICAgY2xvc2VCdG4uYXBwZW5kQ2hpbGQoY2xvc2VHbHlwaCk7XG4gICAgICAgIGNsb3NlQnRuLnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIiwgdChcIm1zZ19maXRiX2Nsb3NlXCIpKTtcbiAgICAgICAgY2xvc2VCdG4uc3R5bGUuZmxvYXQgPSBcInJpZ2h0XCI7XG4gICAgICAgIGNsb3NlQnRuLmNsYXNzTmFtZSA9IFwiYnRuIGJ0bi1saWdodFwiO1xuICAgICAgICBjbG9zZUJ0bi5vbmNsaWNrID0gY2xvc2U7XG4gICAgICAgIGNvbnN0IHRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImg0XCIpO1xuICAgICAgICB0aXRsZS5jbGFzc05hbWUgPSBcIm1vZGFsLXRpdGxlXCI7XG4gICAgICAgIHRpdGxlLmlkID0gdGl0bGVJZDtcbiAgICAgICAgdGl0bGUudGV4dENvbnRlbnQgPSB0KFwibXNnX2ZpdGJfdG9wX2Fuc3dlcnNcIik7XG4gICAgICAgIGhlYWRlci5hcHBlbmRDaGlsZChjbG9zZUJ0bik7XG4gICAgICAgIGhlYWRlci5hcHBlbmRDaGlsZCh0aXRsZSk7XG5cbiAgICAgICAgY29uc3QgbW9kYWxCb2R5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgbW9kYWxCb2R5LmlubmVySFRNTCA9IGJvZHk7XG5cbiAgICAgICAgZGlhbG9nLmFwcGVuZENoaWxkKGhlYWRlcik7XG4gICAgICAgIGRpYWxvZy5hcHBlbmRDaGlsZChtb2RhbEJvZHkpO1xuICAgICAgICBvdmVybGF5LmFwcGVuZENoaWxkKGRpYWxvZyk7XG4gICAgICAgIG92ZXJsYXkuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldikgPT4ge1xuICAgICAgICAgICAgaWYgKGV2LnRhcmdldCA9PT0gb3ZlcmxheSkge1xuICAgICAgICAgICAgICAgIGNsb3NlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKG92ZXJsYXkpO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBvbktleWRvd24sIHRydWUpO1xuICAgICAgICBkaWFsb2cuZm9jdXMoKTtcbiAgICB9XG5cbiAgICBkaXNhYmxlSW50ZXJhY3Rpb24oKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5ibGFua0FycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAvLyBSZWFkLW9ubHkgcmF0aGVyIHRoYW4gZGlzYWJsZWQ6IGEgZGlzYWJsZWQgaW5wdXQgaXMgc2tpcHBlZCBieVxuICAgICAgICAgICAgLy8gdGhlIGtleWJvYXJkIGFuZCBieSBzY3JlZW4gcmVhZGVycywgc28gYSBzdHVkZW50IHJldmlld2luZyBhXG4gICAgICAgICAgICAvLyBmaW5pc2hlZCB0aW1lZCBleGFtIGNvdWxkIG5vIGxvbmdlciBoZWFyIHdoYXQgdGhleSBhbnN3ZXJlZC5cbiAgICAgICAgICAgIHRoaXMuYmxhbmtBcnJheVtpXS5yZWFkT25seSA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmJsYW5rQXJyYXlbaV0uc2V0QXR0cmlidXRlKFwiYXJpYS1kaXNhYmxlZFwiLCBcInRydWVcIik7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PSBGaW5kIHRoZSBjdXN0b20gSFRNTCB0YWdzIGFuZCA9PVxuPT0gICBleGVjdXRlIG91ciBjb2RlIG9uIHRoZW0gICAgPT1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwicnVuZXN0b25lOmxvZ2luLWNvbXBsZXRlXCIsIGZ1bmN0aW9uICgpIHtcbiAgICBkb2N1bWVudFxuICAgICAgICAucXVlcnlTZWxlY3RvckFsbChcIltkYXRhLWNvbXBvbmVudD1maWxsaW50aGVibGFua11cIilcbiAgICAgICAgLmZvckVhY2goZnVuY3Rpb24gKGVsLCBpbmRleCkge1xuICAgICAgICAgICAgdmFyIG9wdHMgPSB7XG4gICAgICAgICAgICAgICAgb3JpZzogZWwsXG4gICAgICAgICAgICAgICAgdXNlUnVuZXN0b25lU2VydmljZXM6IGVCb29rQ29uZmlnLnVzZVJ1bmVzdG9uZVNlcnZpY2VzLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmICghZWwuY2xvc2VzdChcIltkYXRhLWNvbXBvbmVudD10aW1lZEFzc2Vzc21lbnRdXCIpKSB7XG4gICAgICAgICAgICAgICAgLy8gSWYgdGhpcyBlbGVtZW50IGV4aXN0cyB3aXRoaW4gYSB0aW1lZCBjb21wb25lbnQsIGRvbid0IHJlbmRlciBpdCBoZXJlXG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgRklUQkxpc3RbZWwuaWRdID0gbmV3IEZJVEIob3B0cyk7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5jb21wb25lbnRNYXBbZWwuaWRdID0gRklUQkxpc3RbZWwuaWRdO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmFzc2VydChcbiAgICAgICAgICAgICAgICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgYEVycm9yIHJlbmRlcmluZyBGaWxsIGluIHRoZSBCbGFuayBQcm9ibGVtICR7ZWwuaWR9XG4gICAgICAgICAgICAgICAgICAgICBEZXRhaWxzOiAke2Vycn1gLFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG59KTtcbiIsImltcG9ydCB7IGxvYWQgfSBmcm9tIFwiLi4vLi4vY29tbW9uL2pzL3JzaTE4bi5qc1wiO1xuXG5sb2FkKHtcbiAgICBcInNyLUN5cmxcIjoge1xuICAgICAgICBtc2dfbm9fYW5zd2VyOiBcItCd0LXQvtC00LPQvtCy0L7RgNC10L3Qvi5cIixcbiAgICAgICAgbXNnX2ZpdGJfY2hlY2tfbWU6IFwi0J/RgNC+0LLQtdGA0LhcIixcbiAgICAgICAgbXNnX2ZpdGJfY29tcGFyZV9tZTogXCLQo9C/0L7RgNC10LTQuFwiLFxuICAgIH0sXG59KTtcbiIsIi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyB8ZG9jbmFtZXwgLSBncmFkaW5nLXJlbGF0ZWQgdXRpbGl0aWVzIGZvciBGSVRCIHF1ZXN0aW9uc1xuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vIFRoaXMgY29kZSBydW5zIGJvdGggb24gdGhlIHNlcnZlciAoZm9yIHNlcnZlci1zaWRlIGdyYWRpbmcpIGFuZCBvbiB0aGUgY2xpZW50LiBJdCdzIHBsYWNlZCBoZXJlIGFzIGEgc2V0IG9mIGZ1bmN0aW9ucyBzcGVjaWZpY2FsbHkgZm9yIHRoaXMgcHVycG9zZS5cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCB7IGFsZWFQUk5HIH0gZnJvbSBcIi4vbGlicy9hbGVhUFJORy0xLjEuanNcIjtcblxuLy8gSW5jbHVkZXNcbi8vID09PT09PT09XG4vLyBOb25lLlxuLy9cbi8vXG4vLyBHbG9iYWxzXG4vLyA9PT09PT09XG5mdW5jdGlvbiByZW5kZXJfaHRtbChodG1sX2luLCBkeW5fdmFyc19ldmFsKSB7XG4gICAgLy8gQ2hhbmdlIHRoZSByZXBsYWNlbWVudCB0b2tlbnMgaW4gdGhlIEhUTUwgaW50byB0YWdzLCBzbyB3ZSBjYW4gcmVwbGFjZSB0aGVtIHVzaW5nIFhNTC4gVGhlIGhvcnJpYmxlIHJlZ2V4IGlzOlxuICAgIC8vXG4gICAgLy8gTG9vayBmb3IgdGhlIGNoYXJhY3RlcnMgYGBbJT1gYCAodGhlIG9wZW5pbmcgZGVsaW1pdGVyKVxuICAgIC8vLyBcXFslPVxuICAgIC8vIEZvbGxvd2VkIGJ5IGFueSBhbW91bnQgb2Ygd2hpdGVzcGFjZS5cbiAgICAvLy8gXFxzKlxuICAgIC8vIFN0YXJ0IGEgZ3JvdXAgdGhhdCB3aWxsIGNhcHR1cmUgdGhlIGNvbnRlbnRzIChleGNsdWRpbmcgd2hpdGVzcGFjZSkgb2YgdGhlIHRva2Vucy4gRm9yIGV4YW1wbGUsIGdpdmVuIGBgWyU9IGZvbygpICVdYGAsIHRoZSBjb250ZW50cyBpcyBgYGZvbygpYGAuXG4gICAgLy8vIChcbiAgICAvLyBEb24ndCBjYXB0dXJlIHRoZSBjb250ZW50cyBvZiB0aGlzIGdyb3VwLCBzaW5jZSBpdCdzIG9ubHkgYSBzaW5nbGUgY2hhcmFjdGVyLiBNYXRjaCBhbnkgY2hhcmFjdGVyLi4uXG4gICAgLy8vIChcbiAgICAvLy8gPzouXG4gICAgLy8vIC4uLnRoYXQgZG9lc24ndCBlbmQgd2l0aCBgYCVdYGAgKHRoZSBjbG9zaW5nIGRlbGltaXRlcikuXG4gICAgLy8vICg/ISVdKVxuICAgIC8vLyApXG4gICAgLy8gTWF0Y2ggdGhpcyAoYW55dGhpbmcgYnV0IHRoZSBjbG9zaW5nIGRlbGltaXRlcikgYXMgbXVjaCBhcyB3ZSBjYW4uXG4gICAgLy8vICopXG4gICAgLy8gTmV4dCwgbG9vayBmb3IgYW55IHdoaXRlc3BhY2UuXG4gICAgLy8vIFxccypcbiAgICAvLyBGaW5hbGx5LCBsb29rIGZvciB0aGUgY2xvc2luZyBkZWxpbWl0ZXIgYGAlXWBgLlxuICAgIC8vLyAlXFxdXG4gICAgY29uc3QgaHRtbF9yZXBsYWNlZCA9IGh0bWxfaW4ucmVwbGFjZUFsbChcbiAgICAgICAgL1xcWyU9XFxzKigoPzouKD8hJV0pKSopXFxzKiVcXF0vZyxcbiAgICAgICAgLy8gUmVwbGFjZSBpdCB3aXRoIGEgYDxzY3JpcHQtZXZhbD5gIHRhZy4gUXVvdGUgdGhlIHN0cmluZywgd2hpY2ggd2lsbCBhdXRvbWF0aWNhbGx5IGVzY2FwZSBhbnkgZG91YmxlIHF1b3RlcywgdXNpbmcgSlNPTi5cbiAgICAgICAgKG1hdGNoLCBncm91cDEpID0+XG4gICAgICAgICAgICBgPHNjcmlwdC1ldmFsIGV4cHI9JHtKU09OLnN0cmluZ2lmeShncm91cDEpfT48L3NjcmlwdC1ldmFsPmAsXG4gICAgKTtcbiAgICAvLyBHaXZlbiBIVE1MLCB0dXJuIGl0IGludG8gYSBET00uIFdhbGsgdGhlIGBgPHNjcmlwdC1ldmFsPmBgIHRhZ3MsIHBlcmZvcm1pbmcgdGhlIHJlcXVlc3RlZCBldmFsdWF0aW9uIG9uIHRoZW0uXG4gICAgLy9cbiAgICAvLyBTZWUgYERPTVBhcnNlciA8aHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0RPTVBhcnNlcj5gXy5cbiAgICBjb25zdCBwYXJzZXIgPSBuZXcgRE9NUGFyc2VyKCk7XG4gICAgLy8gU2VlIGBET01QYXJzZXIucGFyc2VGcm9tU3RyaW5nKCkgPGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9ET01QYXJzZXIvcGFyc2VGcm9tU3RyaW5nPmBfLlxuICAgIGNvbnN0IGRvYyA9IHBhcnNlci5wYXJzZUZyb21TdHJpbmcoaHRtbF9yZXBsYWNlZCwgXCJ0ZXh0L2h0bWxcIik7XG4gICAgY29uc3Qgc2NyaXB0X2V2YWxfdGFncyA9IGRvYy5nZXRFbGVtZW50c0J5VGFnTmFtZShcInNjcmlwdC1ldmFsXCIpO1xuICAgIHdoaWxlIChzY3JpcHRfZXZhbF90YWdzLmxlbmd0aCkge1xuICAgICAgICAvLyBHZXQgdGhlIGZpcnN0IHRhZy4gSXQgd2lsbCBiZSByZW1vdmVkIGZyb20gdGhlIGNvbGxlY3Rpb24gYWZ0ZXIgaXQncyByZXBsYWNlZCB3aXRoIGl0cyB2YWx1ZS5cbiAgICAgICAgY29uc3Qgc2NyaXB0X2V2YWxfdGFnID0gc2NyaXB0X2V2YWxfdGFnc1swXTtcbiAgICAgICAgLy8gU2VlIGlmIHRoaXMgYGA8c2NyaXB0LWV2YWw+YGAgdGFnIGhhcyBhcyBgYEBleHByYGAgYXR0cmlidXRlLlxuICAgICAgICBjb25zdCBleHByID0gc2NyaXB0X2V2YWxfdGFnLmdldEF0dHJpYnV0ZShcImV4cHJcIik7XG4gICAgICAgIC8vIElmIHNvLCBldmFsdWF0ZSBpdC5cbiAgICAgICAgaWYgKGV4cHIpIHtcbiAgICAgICAgICAgIGNvbnN0IGV2YWxfcmVzdWx0ID0gd2luZG93LkZ1bmN0aW9uKFxuICAgICAgICAgICAgICAgIFwidlwiLFxuICAgICAgICAgICAgICAgIC4uLk9iamVjdC5rZXlzKGR5bl92YXJzX2V2YWwpLFxuICAgICAgICAgICAgICAgIGBcInVzZSBzdHJpY3Q7XCJcXG5yZXR1cm4gJHtleHByfTtgLFxuICAgICAgICAgICAgKShkeW5fdmFyc19ldmFsLCAuLi5PYmplY3QudmFsdWVzKGR5bl92YXJzX2V2YWwpKTtcbiAgICAgICAgICAgIC8vIFJlcGxhY2UgdGhlIHRhZyB3aXRoIHRoZSByZXN1bHRpbmcgdmFsdWUuXG4gICAgICAgICAgICBzY3JpcHRfZXZhbF90YWcucmVwbGFjZVdpdGgoZXZhbF9yZXN1bHQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIHRoZSBib2R5IGNvbnRlbnRzLiBOb3RlIHRoYXQgdGhlIGBgRE9NUGFyc2VyYGAgY29uc3RydWN0cyBhbiBlbnRpcmUgZG9jdW1lbnQsIG5vdCBqdXN0IHRoZSBkb2N1bWVudCBmcmFnbWVudCB3ZSBwYXNzZWQgaXQuIFRoZXJlZm9yZSwgZXh0cmFjdCB0aGUgZGVzaXJlZCBmcmFnbWVudCBhbmQgcmV0dXJuIHRoYXQuIE5vdGUgdGhhdCB3ZSBuZWVkIHRvIHVzZSBgY2hpbGROb2RlcyA8aHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL05vZGUvY2hpbGROb2Rlcz5gXywgd2hpY2ggaW5jbHVkZXMgbm9uLWVsZW1lbnQgY2hpbGRyZW4gbGlrZSB0ZXh0IGFuZCBjb21tZW50czsgdXNpbmcgYGBjaGlsZHJlbmBgIG9taXRzIHRoZXNlIG5vbi1lbGVtZW50IGNoaWxkcmVuLlxuICAgIHJldHVybiBkb2MuYm9keS5jaGlsZE5vZGVzO1xufVxuXG4vLyBGdW5jdGlvbnNcbi8vID09PT09PT09PVxuLy8gVXBkYXRlIHRoZSBwcm9ibGVtJ3MgZGVzY3JpcHRpb24gYmFzZWQgb24gZHluYW1pY2FsbHktZ2VuZXJhdGVkIGNvbnRlbnQuXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyRHluYW1pY0NvbnRlbnQoXG4gICAgc2VlZCxcbiAgICBkeW5fdmFycyxcbiAgICBkeW5faW1wb3J0cyxcbiAgICBodG1sX2luLFxuICAgIGRpdmlkLFxuICAgIHByZXBhcmVDaGVja0Fuc3dlcnMsXG4pIHtcbiAgICAvLyBJbml0aWFsaXplIFJORyB3aXRoIGBgc2VlZGBgLlxuICAgIGNvbnN0IHJhbmQgPSBhbGVhUFJORyhzZWVkKTtcblxuICAgIC8vIFNlZSBgUkFORF9GVU5DIDxSQU5EX0ZVTkM+YF8sIHdoaWNoIHJlZmVycyB0byBgYHJhbmRgYCBhYm92ZS5cbiAgICBjb25zdCBkeW5fdmFyc19ldmFsID0gd2luZG93LkZ1bmN0aW9uKFxuICAgICAgICBcInZcIixcbiAgICAgICAgXCJyYW5kXCIsXG4gICAgICAgIC4uLk9iamVjdC5rZXlzKGR5bl9pbXBvcnRzKSxcbiAgICAgICAgYFwidXNlIHN0cmljdFwiO1xcbiR7ZHluX3ZhcnN9O1xcbnJldHVybiB2O2AsXG4gICAgKShcbiAgICAgICAgLy8gV2Ugd2FudCB2LmRpdmlkID0gZGl2aWQgYW5kIHYucHJlcGFyZUNoZWNrQW5zd2VycyA9IHByZXBhcmVDaGVja0Fuc3dlcnMuIEluIGNvbnRyYXN0LCB0aGUga2V5L3ZhbHVlcyBwYWlycyBvZiBkeW5faW1wb3J0cyBzaG91bGQgYmUgZGlyZWN0bHkgYXNzaWduZWQgdG8gdiwgaGVuY2UgdGhlIE9iamVjdC5hc3NpZ24uXG4gICAgICAgIE9iamVjdC5hc3NpZ24oeyBkaXZpZCwgcHJlcGFyZUNoZWNrQW5zd2VycyB9LCBkeW5faW1wb3J0cyksXG4gICAgICAgIHJhbmQsXG4gICAgICAgIC8vIEluIGFkZGl0aW9uIHRvIHByb3ZpZGluZyB0aGlzIGluIHYsIG1ha2UgaXQgYXZhaWxhYmxlIGluIHRoZSBmdW5jdGlvbiBhcyB3ZWxsLCBzaW5jZSBtb3N0IHByb2JsZW0gYXV0aG9ycyB3aWxsIHdyaXRlIGBgZm9vID0gbmV3IEJUTSgpYGAgKGZvciBleGFtcGxlLCBhc3N1bWluZyBCVE0gaXMgaW4gZHluX2ltcG9ydHMpIGluc3RlYWQgb2YgYGBmb28gPSBuZXcgdi5CVE0oKWBgICh3aGljaCBpcyB1bnVzdWFsIHN5bnRheCkuXG4gICAgICAgIC4uLk9iamVjdC52YWx1ZXMoZHluX2ltcG9ydHMpLFxuICAgICk7XG5cbiAgICBsZXQgaHRtbF9vdXQ7XG4gICAgaWYgKHR5cGVvZiBkeW5fdmFyc19ldmFsLmJlZm9yZUNvbnRlbnRSZW5kZXIgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZHluX3ZhcnNfZXZhbC5iZWZvcmVDb250ZW50UmVuZGVyKGR5bl92YXJzX2V2YWwpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuYXNzZXJ0KFxuICAgICAgICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgICAgICAgIGBFcnJvciBpbiBwcm9ibGVtICR7ZGl2aWR9IGludm9raW5nIGJlZm9yZUNvbnRlbnRSZW5kZXJgLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgfVxuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBodG1sX291dCA9IHJlbmRlcl9odG1sKGh0bWxfaW4sIGR5bl92YXJzX2V2YWwpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBjb25zb2xlLmFzc2VydChmYWxzZSwgYEVycm9yIHJlbmRlcmluZyBwcm9ibGVtICR7ZGl2aWR9IHRleHQuYCk7XG4gICAgICAgIHRocm93IGVycjtcbiAgICB9XG5cbiAgICAvLyB0aGUgYWZ0ZXJDb250ZW50UmVuZGVyIGV2ZW50IHdpbGwgYmUgY2FsbGVkIGJ5IHRoZSBjYWxsZXIgb2YgdGhpcyBmdW5jdGlvbiAoYWZ0ZXIgaXQgdXBkYXRlZCB0aGUgSFRNTCBiYXNlZCBvbiB0aGUgY29udGVudHMgb2YgaHRtbF9vdXQpLlxuICAgIHJldHVybiBbaHRtbF9vdXQsIGR5bl92YXJzX2V2YWxdO1xufVxuXG4vLyBHaXZlbiBzdHVkZW50IGFuc3dlcnMsIGdyYWRlIHRoZW0gYW5kIHByb3ZpZGUgZmVlZGJhY2suXG4vL1xuLy8gT3V0cHV0czpcbi8vXG4vLyAtICAgIGBgZGlzcGxheUZlZWRgYCBpcyBhbiBhcnJheSBvZiBIVE1MIGZlZWRiYWNrLlxuLy8gLSAgICBgYGlzQ29ycmVjdEFycmF5YGAgaXMgYW4gYXJyYXkgb2YgdHJ1ZSwgZmFsc2UsIG9yIG51bGwgKHRoZSBxdWVzdGlvbiB3YXNuJ3QgYW5zd2VyZWQpLlxuLy8gLSAgICBgYGNvcnJlY3RgYCBpcyB0cnVlLCBmYWxzZSwgb3IgbnVsbCAodGhlIHF1ZXN0aW9uIHdhc24ndCBhbnN3ZXJlZCkuXG4vLyAtICAgIGBgcGVyY2VudGBgIGlzIHRoZSBwZXJjZW50YWdlIG9mIGNvcnJlY3QgYW5zd2VycyAoZnJvbSAwIHRvIDEsIG5vdCAwIHRvIDEwMCkuXG5leHBvcnQgZnVuY3Rpb24gY2hlY2tBbnN3ZXJzQ29yZShcbiAgICAvLyBfYGJsYW5rTmFtZXNEaWN0YDogQW4gZGljdCBvZiB7YmxhbmtfbmFtZSwgYmxhbmtfaW5kZXh9IHNwZWNpZnlpbmcgdGhlIG5hbWUgZm9yIGVhY2ggbmFtZWQgYmxhbmsuXG4gICAgYmxhbmtOYW1lc0RpY3QsXG4gICAgLy8gX2BnaXZlbl9hcnJgOiBBbiBhcnJheSBvZiBzdHJpbmdzIGNvbnRhaW5pbmcgc3R1ZGVudC1wcm92aWRlZCBhbnN3ZXJzIGZvciBlYWNoIGJsYW5rLlxuICAgIGdpdmVuX2FycixcbiAgICAvLyBBIDItRCBhcnJheSBvZiBzdHJpbmdzIGdpdmluZyBmZWVkYmFjayBmb3IgZWFjaCBibGFuay5cbiAgICBmZWVkYmFja0FycmF5LFxuICAgIC8vIF9gZHluX3ZhcnNfZXZhbGA6IEEgZGljdCBwcm9kdWNlZCBieSBldmFsdWF0aW5nIHRoZSBKYXZhU2NyaXB0IGZvciBhIGR5bmFtaWMgZXhlcmNpc2UuXG4gICAgZHluX3ZhcnNfZXZhbCxcbikge1xuICAgIGlmIChcbiAgICAgICAgZHluX3ZhcnNfZXZhbCAmJlxuICAgICAgICB0eXBlb2YgZHluX3ZhcnNfZXZhbC5iZWZvcmVDaGVja0Fuc3dlcnMgPT09IFwiZnVuY3Rpb25cIlxuICAgICkge1xuICAgICAgICBjb25zdCBbbmFtZWRCbGFua1ZhbHVlcywgZ2l2ZW5fYXJyX2NvbnZlcnRlZF0gPSBwYXJzZUFuc3dlcnMoXG4gICAgICAgICAgICBibGFua05hbWVzRGljdCxcbiAgICAgICAgICAgIGdpdmVuX2FycixcbiAgICAgICAgICAgIGR5bl92YXJzX2V2YWwsXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IGR2ZV9ibGFua3MgPSBPYmplY3QuYXNzaWduKHt9LCBkeW5fdmFyc19ldmFsLCBuYW1lZEJsYW5rVmFsdWVzKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGR5bl92YXJzX2V2YWwuYmVmb3JlQ2hlY2tBbnN3ZXJzKGR2ZV9ibGFua3MsIGdpdmVuX2Fycl9jb252ZXJ0ZWQpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuYXNzZXJ0KGZhbHNlLCBcIkVycm9yIGNhbGxpbmcgYmVmb3JlQ2hlY2tBbnN3ZXJzXCIpO1xuICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gS2VlcCB0cmFjayBpZiBhbGwgYW5zd2VycyBhcmUgY29ycmVjdCBvciBub3QuXG4gICAgbGV0IGNvcnJlY3QgPSB0cnVlO1xuICAgIGNvbnN0IGlzQ29ycmVjdEFycmF5ID0gW107XG4gICAgY29uc3QgZGlzcGxheUZlZWQgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGdpdmVuX2Fyci5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBnaXZlbiA9IGdpdmVuX2FycltpXTtcbiAgICAgICAgLy8gSWYgdGhpcyBibGFuayBpcyBlbXB0eSwgcHJvdmlkZSBubyBmZWVkYmFjayBmb3IgaXQuXG4gICAgICAgIGlmIChnaXZlbiA9PT0gXCJcIikge1xuICAgICAgICAgICAgaXNDb3JyZWN0QXJyYXkucHVzaChudWxsKTtcbiAgICAgICAgICAgIC8vIFRPRE86IHNob3VsZCBiZSBsb2NhbGl6ZWQsIGUuZy4gdChcIm1zZ19ub19hbnN3ZXJcIikuXG4gICAgICAgICAgICBkaXNwbGF5RmVlZC5wdXNoKFwiTm8gYW5zd2VyIHByb3ZpZGVkLlwiKTtcbiAgICAgICAgICAgIGNvcnJlY3QgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIExvb2sgdGhyb3VnaCBhbGwgZmVlZGJhY2sgZm9yIHRoaXMgYmxhbmsuIFRoZSBsYXN0IGVsZW1lbnQgaW4gdGhlIGFycmF5IGFsd2F5cyBtYXRjaGVzLiBJZiBubyBmZWVkYmFjayBmb3IgdGhpcyBibGFuayBleGlzdHMsIHVzZSBhbiBlbXB0eSBsaXN0LlxuICAgICAgICAgICAgY29uc3QgZmJsID0gZmVlZGJhY2tBcnJheVtpXSB8fCBbXTtcbiAgICAgICAgICAgIGxldCBqO1xuICAgICAgICAgICAgZm9yIChqID0gMDsgaiA8IGZibC5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIC8vIFRoZSBsYXN0IGl0ZW0gb2YgZmVlZGJhY2sgYWx3YXlzIG1hdGNoZXMuXG4gICAgICAgICAgICAgICAgaWYgKGogPT09IGZibC5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXlGZWVkLnB1c2goZmJsW2pdW1wiZmVlZGJhY2tcIl0pO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gSWYgdGhpcyBpcyBhIHJlZ2V4cC4uLlxuICAgICAgICAgICAgICAgIGlmIChcInJlZ2V4XCIgaW4gZmJsW2pdKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhdHQgPSBSZWdFeHAoZmJsW2pdW1wicmVnZXhcIl0sIGZibFtqXVtcInJlZ2V4RmxhZ3NcIl0pO1xuICAgICAgICAgICAgICAgICAgICBpZiAocGF0dC50ZXN0KGdpdmVuKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheUZlZWQucHVzaChmYmxbal1bXCJmZWVkYmFja1wiXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoXCJudW1iZXJcIiBpbiBmYmxbal0pIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gVGhpcyBpcyBhIG51bWJlci5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgW21pbiwgbWF4XSA9IGZibFtqXVtcIm51bWJlclwiXTtcbiAgICAgICAgICAgICAgICAgICAgLy8gQ29udmVydCB0aGUgZ2l2ZW4gc3RyaW5nIHRvIGEgbnVtYmVyLiBXaGlsZSB0aGVyZSBhcmUgYGxvdHMgb2Ygd2F5cyA8aHR0cHM6Ly9jb2RlcndhbGwuY29tL3AvNXRsaG13L2NvbnZlcnRpbmctc3RyaW5ncy10by1udW1iZXItaW4tamF2YXNjcmlwdC1waXRmYWxscz5gXyB0byBkbyB0aGlzOyB0aGlzIHZlcnNpb24gc3VwcG9ydHMgb3RoZXIgYmFzZXMgKGhleC9iaW5hcnkvb2N0YWwpIGFzIHdlbGwgYXMgZmxvYXRzLlxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhY3R1YWwgPSArZ2l2ZW47XG4gICAgICAgICAgICAgICAgICAgIGlmIChhY3R1YWwgPj0gbWluICYmIGFjdHVhbCA8PSBtYXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXlGZWVkLnB1c2goZmJsW2pdW1wiZmVlZGJhY2tcIl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgdGhpcyBpcyBhIGR5bmFtaWMgc29sdXRpb24sIHRoZXkgc2hvdWxkIHByb3ZpZGUgYSB0ZXN0aW5nIGZ1bmN0aW9uXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChkeW5fdmFyc19ldmFsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IFtuYW1lZEJsYW5rVmFsdWVzLCBnaXZlbl9hcnJfY29udmVydGVkXSA9XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUFuc3dlcnMoYmxhbmtOYW1lc0RpY3QsIGdpdmVuX2FyciwgZHluX3ZhcnNfZXZhbCk7XG4gICAgICAgICAgICAgICAgICAgIC8vIElmIHRoZXJlIHdhcyBhIHBhcnNlIGVycm9yLCB0aGVuIGl0IHN0dWRlbnQncyBhbnN3ZXIgaXMgaW5jb3JyZWN0LlxuICAgICAgICAgICAgICAgICAgICBpZiAoZ2l2ZW5fYXJyX2NvbnZlcnRlZFtpXSBpbnN0YW5jZW9mIFR5cGVFcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheUZlZWQucHVzaChnaXZlbl9hcnJfY29udmVydGVkW2ldLm1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ291bnQgdGhpcyBhcyB3cm9uZyBieSBtYWtpbmcgaiAhPSAwIC0tIHNlZSB0aGUgY29kZSB0aGF0IHJ1bnMgaW1tZWRpYXRlbHkgYWZ0ZXIgdGhlIGV4ZWN1dGluZyB0aGUgYnJlYWsuXG4gICAgICAgICAgICAgICAgICAgICAgICBqID0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vIENyZWF0ZSBhIGZ1bmN0aW9uIHRvIHdyYXAgdGhlIGV4cHJlc3Npb24gdG8gZXZhbHVhdGUuIFNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9GdW5jdGlvbi9GdW5jdGlvbi5cbiAgICAgICAgICAgICAgICAgICAgLy8gUGFzcyB0aGUgYW5zd2VyLCBhcnJheSBvZiBhbGwgYW5zd2VycywgdGhlbiBhbGwgZW50cmllcyBpbiBgYHRoaXMuZHluX3ZhcnNfZXZhbGBgIGRpY3QgYXMgZnVuY3Rpb24gcGFyYW1ldGVycy5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaXNfZXF1YWwgPSB3aW5kb3cuRnVuY3Rpb24oXG4gICAgICAgICAgICAgICAgICAgICAgICBcImFuc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJhbnNfYXJyYXlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLk9iamVjdC5rZXlzKGR5bl92YXJzX2V2YWwpLFxuICAgICAgICAgICAgICAgICAgICAgICAgLi4uT2JqZWN0LmtleXMobmFtZWRCbGFua1ZhbHVlcyksXG4gICAgICAgICAgICAgICAgICAgICAgICBgXCJ1c2Ugc3RyaWN0O1wiXFxucmV0dXJuICR7ZmJsW2pdW1wic29sdXRpb25fY29kZVwiXX07YCxcbiAgICAgICAgICAgICAgICAgICAgKShcbiAgICAgICAgICAgICAgICAgICAgICAgIGdpdmVuX2Fycl9jb252ZXJ0ZWRbaV0sXG4gICAgICAgICAgICAgICAgICAgICAgICBnaXZlbl9hcnJfY29udmVydGVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgLi4uT2JqZWN0LnZhbHVlcyhkeW5fdmFyc19ldmFsKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLk9iamVjdC52YWx1ZXMobmFtZWRCbGFua1ZhbHVlcyksXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIC8vIElmIHN0dWRlbnQncyBhbnN3ZXIgaXMgZXF1YWwgdG8gdGhpcyBpdGVtLCB0aGVuIGFwcGVuZCB0aGlzIGl0ZW0ncyBmZWVkYmFjay5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzX2VxdWFsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5RmVlZC5wdXNoKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVvZiBpc19lcXVhbCA9PT0gXCJzdHJpbmdcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IGlzX2VxdWFsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogZmJsW2pdW1wiZmVlZGJhY2tcIl0sXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgdGhpcyBpcyBOT1QgYSBkeW5hbWljIHNvbHV0aW9uLCBidXQgZ2l2ZW4gYSB0ZXN0aW5nIGZ1bmN0aW9uXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChcInNvbHV0aW9uX2NvZGVcIiBpbiBmYmxbal0pIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gQ3JlYXRlIGEgZnVuY3Rpb24gdG8gd3JhcCB0aGUgZXhwcmVzc2lvbiB0byBldmFsdWF0ZS4gU2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0Z1bmN0aW9uL0Z1bmN0aW9uLlxuICAgICAgICAgICAgICAgICAgICAvLyBQYXNzIHRoZSBhbnN3ZXIsIGFycmF5IG9mIGFsbCBhbnN3ZXJzLCB0aGVuIGFsbCBlbnRyaWVzIGluIGBgdGhpcy5keW5fdmFyc19ldmFsYGAgZGljdCBhcyBmdW5jdGlvbiBwYXJhbWV0ZXJzLlxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpc19lcXVhbCA9IHdpbmRvdy5GdW5jdGlvbihcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYW5zXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImFuc19hcnJheVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgYFwidXNlIHN0cmljdDtcIlxcbnJldHVybiAke2ZibFtqXVtcInNvbHV0aW9uX2NvZGVcIl19O2AsXG4gICAgICAgICAgICAgICAgICAgICkoZ2l2ZW4sIGdpdmVuX2Fycik7XG4gICAgICAgICAgICAgICAgICAgIC8vIElmIHN0dWRlbnQncyBhbnN3ZXIgaXMgZXF1YWwgdG8gdGhpcyBpdGVtLCB0aGVuIGFwcGVuZCB0aGlzIGl0ZW0ncyBmZWVkYmFjay5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzX2VxdWFsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5RmVlZC5wdXNoKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVvZiBpc19lcXVhbCA9PT0gXCJzdHJpbmdcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IGlzX2VxdWFsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogZmJsW2pdW1wiZmVlZGJhY2tcIl0sXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBVbmRlZmluZWQgbWV0aG9kIG9mIHRlc3RpbmcuXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuYXNzZXJ0KFwibnVtYmVyXCIgaW4gZmJsW2pdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFRoZSBhbnN3ZXIgaXMgY29ycmVjdCBpZiBpdCBtYXRjaGVkIHRoZSBmaXJzdCBlbGVtZW50IGluIHRoZSBhcnJheS4gQSBzcGVjaWFsIGNhc2U6IGlmIG9ubHkgb25lIGFuc3dlciBpcyBwcm92aWRlZCwgY291bnQgaXQgd3Jvbmc7IHRoaXMgaXMgYSBtaXNmb3JtZWQgcHJvYmxlbS5cbiAgICAgICAgICAgIGNvbnN0IGlzX2NvcnJlY3QgPSBqID09PSAwICYmIGZibC5sZW5ndGggPiAxO1xuICAgICAgICAgICAgaXNDb3JyZWN0QXJyYXkucHVzaChpc19jb3JyZWN0KTtcbiAgICAgICAgICAgIGlmICghaXNfY29ycmVjdCkge1xuICAgICAgICAgICAgICAgIGNvcnJlY3QgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChcbiAgICAgICAgZHluX3ZhcnNfZXZhbCAmJlxuICAgICAgICB0eXBlb2YgZHluX3ZhcnNfZXZhbC5hZnRlckNoZWNrQW5zd2VycyA9PT0gXCJmdW5jdGlvblwiXG4gICAgKSB7XG4gICAgICAgIGNvbnN0IFtuYW1lZEJsYW5rVmFsdWVzLCBnaXZlbl9hcnJfY29udmVydGVkXSA9IHBhcnNlQW5zd2VycyhcbiAgICAgICAgICAgIGJsYW5rTmFtZXNEaWN0LFxuICAgICAgICAgICAgZ2l2ZW5fYXJyLFxuICAgICAgICAgICAgZHluX3ZhcnNfZXZhbCxcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgZHZlX2JsYW5rcyA9IE9iamVjdC5hc3NpZ24oe30sIGR5bl92YXJzX2V2YWwsIG5hbWVkQmxhbmtWYWx1ZXMpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZHluX3ZhcnNfZXZhbC5hZnRlckNoZWNrQW5zd2VycyhkdmVfYmxhbmtzLCBnaXZlbl9hcnJfY29udmVydGVkKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmFzc2VydChmYWxzZSwgXCJFcnJvciBjYWxsaW5nIGFmdGVyQ2hlY2tBbnN3ZXJzXCIpO1xuICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgcGVyY2VudCA9XG4gICAgICAgIGlzQ29ycmVjdEFycmF5LmZpbHRlcihCb29sZWFuKS5sZW5ndGggLyBpc0NvcnJlY3RBcnJheS5sZW5ndGg7XG4gICAgcmV0dXJuIFtkaXNwbGF5RmVlZCwgY29ycmVjdCwgaXNDb3JyZWN0QXJyYXksIHBlcmNlbnRdO1xufVxuXG4vLyBVc2UgdGhlIHByb3ZpZGVkIHBhcnNlcnMgdG8gY29udmVydCBhIHN0dWRlbnQncyBhbnN3ZXJzIChhcyBzdHJpbmdzKSB0byB0aGUgdHlwZSBwcm9kdWNlZCBieSB0aGUgcGFyc2VyIGZvciBlYWNoIGJsYW5rLlxuZnVuY3Rpb24gcGFyc2VBbnN3ZXJzKFxuICAgIC8vIFNlZSBibGFua05hbWVzRGljdF8uXG4gICAgYmxhbmtOYW1lc0RpY3QsXG4gICAgLy8gU2VlIGdpdmVuX2Fycl8uXG4gICAgZ2l2ZW5fYXJyLFxuICAgIC8vIFNlZSBgZHluX3ZhcnNfZXZhbGAuXG4gICAgZHluX3ZhcnNfZXZhbCxcbikge1xuICAgIC8vIFByb3ZpZGUgYSBkaWN0IG9mIHtibGFua19uYW1lLCBjb252ZXJ0ZXJfYW5zd2VyX3ZhbHVlfS5cbiAgICBjb25zdCBuYW1lZEJsYW5rVmFsdWVzID0gZ2V0TmFtZWRCbGFua1ZhbHVlcyhcbiAgICAgICAgZ2l2ZW5fYXJyLFxuICAgICAgICBibGFua05hbWVzRGljdCxcbiAgICAgICAgZHluX3ZhcnNfZXZhbCxcbiAgICApO1xuICAgIC8vIEludmVydCBibGFua05hbWVkRGljdDogY29tcHV0ZSBhbiBhcnJheSBvZiBbYmxhbmtfMF9uYW1lLCAuLi5dLiBOb3RlIHRoYXQgdGhlIGFycmF5IG1heSBiZSBzcGFyc2U6IGl0IG9ubHkgY29udGFpbnMgdmFsdWVzIGZvciBuYW1lZCBibGFua3MuXG4gICAgY29uc3QgZ2l2ZW5fYXJyX25hbWVzID0gW107XG4gICAgZm9yIChjb25zdCBbaywgdl0gb2YgT2JqZWN0LmVudHJpZXMoYmxhbmtOYW1lc0RpY3QpKSB7XG4gICAgICAgIGdpdmVuX2Fycl9uYW1lc1t2XSA9IGs7XG4gICAgfVxuICAgIC8vIENvbXB1dGUgYW4gYXJyYXkgb2YgW2NvbnZlcnRlZF9ibGFua18wX3ZhbCwgLi4uXS4gTm90ZSB0aGF0IHRoaXMgcmUtY29udmVydHMgYWxsIHRoZSB2YWx1ZXMsIHJhdGhlciB0aGFuIChwb3NzaWJseSBkZWVwKSBjb3B5aW5nIHRoZSB2YWx1ZXMgZnJvbSBhbHJlYWR5LWNvbnZlcnRlZCBuYW1lZCBibGFua3MuXG4gICAgY29uc3QgZ2l2ZW5fYXJyX2NvbnZlcnRlZCA9IGdpdmVuX2Fyci5tYXAoKHZhbHVlLCBpbmRleCkgPT5cbiAgICAgICAgdHlwZV9jb252ZXJ0KGdpdmVuX2Fycl9uYW1lc1tpbmRleF0sIHZhbHVlLCBpbmRleCwgZHluX3ZhcnNfZXZhbCksXG4gICAgKTtcblxuICAgIHJldHVybiBbbmFtZWRCbGFua1ZhbHVlcywgZ2l2ZW5fYXJyX2NvbnZlcnRlZF07XG59XG5cbi8vIFJlbmRlciB0aGUgZmVlZGJhY2sgZm9yIGEgZHluYW1pYyBwcm9ibGVtLlxuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlckR5bmFtaWNGZWVkYmFjayhcbiAgICAvLyBTZWUgYmxhbmtOYW1lc0RpY3RfLlxuICAgIGJsYW5rTmFtZXNEaWN0LFxuICAgIC8vIFNlZSBnaXZlbl9hcnJfLlxuICAgIGdpdmVuX2FycixcbiAgICAvLyBUaGUgaW5kZXggb2YgdGhpcyBibGFuayBpbiBnaXZlbl9hcnJfLlxuICAgIGluZGV4LFxuICAgIC8vIFRoZSBmZWVkYmFjayBmb3IgdGhpcyBibGFuaywgY29udGFpbmluZyBhIHRlbXBsYXRlIHRvIGJlIHJlbmRlcmVkLlxuICAgIGRpc3BsYXlGZWVkX2ksXG4gICAgLy8gU2VlIGR5bl92YXJzX2V2YWxfLlxuICAgIGR5bl92YXJzX2V2YWwsXG4pIHtcbiAgICAvLyBVc2UgdGhlIGFuc3dlciwgYW4gYXJyYXkgb2YgYWxsIGFuc3dlcnMsIHRoZSB2YWx1ZSBvZiBhbGwgbmFtZWQgYmxhbmtzLCBhbmQgYWxsIHNvbHV0aW9uIHZhcmlhYmxlcyBmb3IgdGhlIHRlbXBsYXRlLlxuICAgIGNvbnN0IG5hbWVkQmxhbmtWYWx1ZXMgPSBnZXROYW1lZEJsYW5rVmFsdWVzKFxuICAgICAgICBnaXZlbl9hcnIsXG4gICAgICAgIGJsYW5rTmFtZXNEaWN0LFxuICAgICAgICBkeW5fdmFyc19ldmFsLFxuICAgICk7XG4gICAgY29uc3Qgc29sX3ZhcnNfcGx1cyA9IE9iamVjdC5hc3NpZ24oXG4gICAgICAgIHtcbiAgICAgICAgICAgIGFuczogZ2l2ZW5fYXJyW2luZGV4XSxcbiAgICAgICAgICAgIGFuc19hcnJheTogZ2l2ZW5fYXJyLFxuICAgICAgICB9LFxuICAgICAgICBkeW5fdmFyc19ldmFsLFxuICAgICAgICBuYW1lZEJsYW5rVmFsdWVzLFxuICAgICk7XG4gICAgdHJ5IHtcbiAgICAgICAgZGlzcGxheUZlZWRfaSA9IHJlbmRlcl9odG1sKGRpc3BsYXlGZWVkX2ksIHNvbF92YXJzX3BsdXMpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBjb25zb2xlLmFzc2VydChmYWxzZSwgYEVycm9yIGV2YWx1YXRpbmcgZmVlZGJhY2sgaW5kZXggJHtpbmRleH0uYCk7XG4gICAgICAgIHRocm93IGVycjtcbiAgICB9XG5cbiAgICByZXR1cm4gZGlzcGxheUZlZWRfaTtcbn1cblxuLy8gVXRpbGl0aWVzXG4vLyAtLS0tLS0tLS1cbi8vIEZvciBlYWNoIG5hbWVkIGJsYW5rLCBnZXQgdGhlIHZhbHVlIGZvciB0aGUgYmxhbms6IHRoZSB2YWx1ZSBvZiBlYWNoIGBgYmxhbmtOYW1lYGAgZ2l2ZXMgdGhlIGluZGV4IG9mIHRoZSBibGFuayBmb3IgdGhhdCBuYW1lLlxuZnVuY3Rpb24gZ2V0TmFtZWRCbGFua1ZhbHVlcyhnaXZlbl9hcnIsIGJsYW5rTmFtZXNEaWN0LCBkeW5fdmFyc19ldmFsKSB7XG4gICAgY29uc3QgbmFtZWRCbGFua1ZhbHVlcyA9IHt9O1xuICAgIGZvciAoY29uc3QgW2JsYW5rX25hbWUsIGJsYW5rX2luZGV4XSBvZiBPYmplY3QuZW50cmllcyhibGFua05hbWVzRGljdCkpIHtcbiAgICAgICAgbmFtZWRCbGFua1ZhbHVlc1tibGFua19uYW1lXSA9IHR5cGVfY29udmVydChcbiAgICAgICAgICAgIGJsYW5rX25hbWUsXG4gICAgICAgICAgICBnaXZlbl9hcnJbYmxhbmtfaW5kZXhdLFxuICAgICAgICAgICAgYmxhbmtfaW5kZXgsXG4gICAgICAgICAgICBkeW5fdmFyc19ldmFsLFxuICAgICAgICApO1xuICAgIH1cbiAgICByZXR1cm4gbmFtZWRCbGFua1ZhbHVlcztcbn1cblxuLy8gQ29udmVydCBhIHZhbHVlIGdpdmVuIGl0cyB0eXBlLlxuZnVuY3Rpb24gdHlwZV9jb252ZXJ0KG5hbWUsIHZhbHVlLCBpbmRleCwgZHluX3ZhcnNfZXZhbCkge1xuICAgIC8vIFRoZSBjb252ZXJ0ZXIgY2FuIGJlIGRlZmluZWQgYnkgaW5kZXgsIG5hbWUsIG9yIGJ5IGEgc2luZ2xlIHZhbHVlICh3aGljaCBhcHBsaWVzIHRvIGFsbCBibGFua3MpLiBJZiBub3QgcHJvdmlkZWQsIGp1c3QgcGFzcyB0aGUgZGF0YSB0aHJvdWdoLlxuICAgIGNvbnN0IHR5cGVzID0gZHluX3ZhcnNfZXZhbC50eXBlcyB8fCBwYXNzX3Rocm91Z2g7XG4gICAgY29uc3QgY29udmVydGVyID0gdHlwZXNbbmFtZV0gfHwgdHlwZXNbaW5kZXhdIHx8IHR5cGVzO1xuICAgIC8vIEVTNSBoYWNrOiBpdCBkb2Vzbid0IHN1cHBvcnQgYmluYXJ5IHZhbHVlcywgYW5kIGpzMnB5IGRvZXNuJ3QgYWxsb3cgbWUgdG8gb3ZlcnJpZGUgdGhlIGBgTnVtYmVyYGAgY2xhc3MuIFNvLCBkZWZpbmUgdGhlIHdvcmthcm91bmQgY2xhc3MgYGBOdW1iZXJfYGAgYW5kIHVzZSBpdCBpZiBhdmFpbGFibGUuXG4gICAgaWYgKGNvbnZlcnRlciA9PT0gTnVtYmVyICYmIHR5cGVvZiBOdW1iZXJfICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGNvbnZlcnRlciA9IE51bWJlcl87XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIHRoZSBjb252ZXJ0ZWQgdHlwZS4gSWYgdGhlIGNvbnZlcnRlciByYWlzZXMgYSBUeXBlRXJyb3IsIHJldHVybiB0aGF0OyBpdCB3aWxsIGJlIGRpc3BsYXllZCB0byB0aGUgdXNlciwgc2luY2Ugd2UgYXNzdW1lIHR5cGUgZXJyb3JzIGFyZSBhIHdheSBmb3IgdGhlIHBhcnNlciB0byBleHBsYWluIHRvIHRoZSB1c2VyIHdoeSB0aGUgcGFyc2UgZmFpbGVkLiBGb3IgYWxsIG90aGVyIGVycm9ycywgcmUtdGhyb3cgaXQgc2luY2Ugc29tZXRoaW5nIHdlbnQgd3JvbmcuXG4gICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIGNvbnZlcnRlcih2YWx1ZSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGlmIChlcnIgaW5zdGFuY2VvZiBUeXBlRXJyb3IpIHtcbiAgICAgICAgICAgIHJldHVybiBlcnI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8vIEEgcGFzcy10aHJvdWdoIFwiY29udmVydGVyXCIuXG5mdW5jdGlvbiBwYXNzX3Rocm91Z2godmFsKSB7XG4gICAgcmV0dXJuIHZhbDtcbn1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==