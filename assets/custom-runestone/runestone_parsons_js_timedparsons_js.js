(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_parsons_js_timedparsons_js"],{

/***/ 8354:
/*!*****************************************!*\
  !*** ./runestone/parsons/js/parsons.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Parsons)
/* harmony export */ });
/* harmony import */ var _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/runestonebase.js */ 78673);
/* harmony import */ var _common_js_mathjax_a11y_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../common/js/mathjax-a11y.js */ 47937);
/* harmony import */ var _common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../common/js/rsi18n.js */ 54250);
/* harmony import */ var _common_js_domutil_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../common/js/domutil.js */ 34089);
/* harmony import */ var _parsons_i18n_en_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./parsons-i18n.en.js */ 75794);
/* harmony import */ var _parsons_i18n_pt_br_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./parsons-i18n.pt-br.js */ 56906);
/* harmony import */ var _parsons_i18n_sr_Cyrl_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./parsons-i18n.sr-Cyrl.js */ 29119);
/* harmony import */ var _prettify_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./prettify.js */ 78811);
/* harmony import */ var _prettify_js__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_prettify_js__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _css_parsons_less__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../css/parsons.less */ 91032);
/* harmony import */ var _css_prettify_css__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../css/prettify.css */ 95762);
/* harmony import */ var _lineGrader__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./lineGrader */ 40771);
/* harmony import */ var _dagGrader__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./dagGrader */ 49647);
/* harmony import */ var _parsonsLine__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./parsonsLine */ 33760);
/* harmony import */ var _parsonsBlock__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./parsonsBlock */ 44065);
/* harmony import */ var _placeholderBlock_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./placeholderBlock.js */ 67216);
/* harmony import */ var _placeholderLine_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./placeholderLine.js */ 39147);
/* harmony import */ var _settledBlock_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./settledBlock.js */ 25888);
/* =====================================================================
==== Parsons Runestone Directive Javascript ============================
======== Renders a Parsons problem based on the HTML created by the
======== parsons.py script and the RST file.
==== CONTRIBUTORS ======================================================
======== Isaiah Mayerchak
======== Jeff Rick
======== Barbara Ericson
======== Cole Bowers
==== Adapted form the original JS Parsons by ===========================
======== Ville Karavirta
======== Petri Ihantola
======== Juha Helminen
======== Mike Hewner
===================================================================== */
/* =====================================================================
==== LineBasedGrader Object ============================================
======== Used for grading a Parsons problem.
==== PROPERTIES ========================================================
======== problem: the Parsons problem
===================================================================== */
















// CodeTailor-related imports Updated 10/26/2025




/* =====================================================================
==== Parsons Object ====================================================
======== The model and view of a Parsons problem based on what is
======== specified in the HTML, which is based on what is specified
======== in the RST file
==== PROPERTIES ========================================================
======== options: options largely specified from the HTML
======== grader: a LineGrader for grading the problem
======== lines: an array of all ParsonsLine as specified in the problem
======== solution: an array of ParsonsLine in the solution
======== blocks: the current blocks
======== sourceArea: the element that contains the source blocks
======== answerArea: the element that contains the answer blocks
===================================================================== */

/* =====================================================================
==== INITIALIZATION ====================================================
=====================================================================  */

class Parsons extends _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(opts) {
        super(opts);
        var orig = opts.orig; // entire <pre> element that will be replaced by new HTML
        this.containerDiv = orig;
        this.origElem = orig.querySelector("pre.parsonsblocks");
        // Find the question text and store it in .question
        this.question = orig.querySelector(".parsons_question");
        this.useRunestoneServices = opts.useRunestoneServices;
        this.divid = opts.orig.id;
        // Set the storageId (key for storing data)
        var storageId = super.localStorageKey();
        this.storageId = storageId;
        this.children = this.origElem.childNodes; // this contains all of the child elements of the entire tag...
        this.contentArray = [];
        Parsons.counter++; //    Unique identifier
        this.counterId = "parsons-" + Parsons.counter;

        // for (var i = 0; i < this.children.length; i++) {
        //     if ($(this.children[i]).is("[data-question]")) {
        //         this.question = this.children[i];
        //         break;
        //     }
        // }
        this.initializeOptions();
        this.grader =
            this.options.grader === "dag"
                ? new _dagGrader__WEBPACK_IMPORTED_MODULE_11__["default"](this)
                : new _lineGrader__WEBPACK_IMPORTED_MODULE_10__["default"](this);
        this.grader.showfeedback = this.showfeedback;
        var fulltext = this.origElem.innerHTML;
        this.blockIndex = 0;
        this.checkCount = 0;
        this.numDistinct = 0;
        this.hasSolved = false;
        // Only trim trailing whitespace here. A leading trim() would strip real
        // leading indentation off the first line of the first block whenever the
        // <pre> tag's own leading newline has already been consumed by the browser's
        // HTML parser (a well-known <pre> quirk), silently de-indenting only the
        // first block relative to every other block. Blank leading/trailing lines
        // within a block are still discarded further down, per block.
        // - Note - reverted the above after request from barbarer trimEnd -> trim
        this.initializeLines(fulltext.trim());
        this.initializeView();
        this.caption = "Parsons";
        this.addCaption("runestone");
        // Check the server for an answer to complete things
        this.checkServer("parsons", true);
        this.runnableDiv = null;
    }
    // Based on the data-fields in the original HTML, initialize options
    initializeOptions() {
        var options = {
            pixelsPerIndent: 30,
        };
        // add maxdist and order if present
        var maxdist = (0,_common_js_domutil_js__WEBPACK_IMPORTED_MODULE_3__.getDataValue)(this.origElem, "maxdist");
        var order = (0,_common_js_domutil_js__WEBPACK_IMPORTED_MODULE_3__.getDataValue)(this.origElem, "order");
        var noindent = (0,_common_js_domutil_js__WEBPACK_IMPORTED_MODULE_3__.getDataValue)(this.origElem, "noindent");
        var adaptive = (0,_common_js_domutil_js__WEBPACK_IMPORTED_MODULE_3__.getDataValue)(this.origElem, "adaptive");
        var numbered = (0,_common_js_domutil_js__WEBPACK_IMPORTED_MODULE_3__.getDataValue)(this.origElem, "numbered");
        var grader = (0,_common_js_domutil_js__WEBPACK_IMPORTED_MODULE_3__.getDataValue)(this.origElem, "grader");
        // CodeTailor: proactively set the puzzle as scaffolding puzzle to differentiate with other puzzle practice formats
        var scaffolding = (0,_common_js_domutil_js__WEBPACK_IMPORTED_MODULE_3__.getDataValue)(this.origElem, "scaffolding");
        options["numbered"] = numbered;
        options["grader"] = grader;
        options["scaffolding"] = scaffolding;
        if (maxdist !== undefined) {
            options["maxdist"] = maxdist;
        }
        if (order !== undefined) {
            // convert order string to array of numbers
            order = order.match(/\d+/g);
            for (var i = 0; i < order.length; i++) {
                order[i] = parseInt(order[i]);
            }
            options["order"] = order;
        }
        if (noindent == undefined) {
            noindent = false;
        }
        options["noindent"] = noindent;
        this.noindent = noindent;
        if (adaptive == undefined) {
            adaptive = false;
        } else if (adaptive) {
            this.initializeAdaptive();
        }
        options["adaptive"] = adaptive;
        // add locale and language
        var locale = eBookConfig.locale;
        if (locale == undefined) {
            locale = "en";
        }
        options["locale"] = locale;
        var language = (0,_common_js_domutil_js__WEBPACK_IMPORTED_MODULE_3__.getDataValue)(this.origElem, "language");
        if (language == undefined) {
            language = eBookConfig.language;
            if (language == undefined) {
                language = "python";
            }
        }
        options["language"] = language;
        var prettifyLanguage = {
            python: "prettyprint lang-py",
            java: "prettyprint lang-java",
            javascript: "prettyprint lang-js",
            html: "prettyprint lang-html",
            c: "prettyprint lang-c",
            "c++": "prettyprint lang-cpp",
            cpp: "prettyprint lang-cpp",
            ruby: "prettyprint lang-rb",
        }[language];
        if (prettifyLanguage == undefined) {
            prettifyLanguage = "";
        }
        options["prettifyLanguage"] = prettifyLanguage;
        //runnable if the parent has a parsons-runnable attr
        options["runnable"] = (0,_common_js_domutil_js__WEBPACK_IMPORTED_MODULE_3__.getDataValue)(this.origElem, "runnable");
        // Parse block explanations if present
        var explanationsRaw = this.origElem.getAttribute("data-explanations");
        if (explanationsRaw) {
            try {
                this.blockExplanations = JSON.parse(explanationsRaw);
            } catch (e) {
                this.blockExplanations = {};
            }
        } else {
            this.blockExplanations = {};
        }
        this.options = options;
    }
    getBlockLabel(block) {
        return (0,_common_js_mathjax_a11y_js__WEBPACK_IMPORTED_MODULE_1__.getAccessibleElementText)(block.view) || (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_2__.t)("msg_parson_block");
    }

    isIncorrectBlock(block) {
        return (
            block.view.classList.contains("incorrectPosition") ||
            block.view.classList.contains("indentLeft") ||
            block.view.classList.contains("indentRight")
        );
    }

    getKeyboardBlockLocation(block) {
        const inSource = block.inSourceArea();
        const blocks = inSource
            ? this.enabledSourceBlocks()
            : this.enabledAnswerBlocks();
        const position = blocks.indexOf(block) + 1;
        const location = [
            (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_2__.t)(
                inSource
                    ? "msg_parson_keyboard_unplaced_position"
                    : "msg_parson_keyboard_answer_position",
                position,
                blocks.length,
            ),
        ];

        if (!inSource && this.usesIndentation()) {
            location.push(
                (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_2__.t)(
                    block.indent === 1
                        ? "msg_parson_keyboard_tab_in"
                        : "msg_parson_keyboard_tabs_in",
                    block.indent,
                ),
            );
        }

        const pairedBin = block.pairedBin();
        if (pairedBin !== -1) {
            const options = this.blocks.filter(
                (candidate) =>
                    candidate.enabled() && candidate.pairedBin() === pairedBin,
            );
            if (options.length > 1) {
                location.push(
                    (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_2__.t)(
                        "msg_parson_keyboard_options",
                        options.indexOf(block) + 1,
                        options.length,
                    ),
                );
            }
        }

        return location.join(". ") + ".";
    }

    updateBlockAriaLabel(block) {
        const label = [this.getBlockLabel(block)];
        if (this.isIncorrectBlock(block)) {
            label.push((0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_2__.t)("msg_parson_incorrect"));
        }
        block.view.setAttribute("aria-label", label.join(". "));
    }

    updateBlockAriaLabels() {
        this.blocks.forEach((block) => this.updateBlockAriaLabel(block));
    }

    showMessage(message, className = "alert alert-info") {
        this.messageDiv.style.visibility = "visible";
        this.messageDiv.setAttribute("class", className);
        this.messageDiv.replaceChildren();
        const messageVersion = (this.messageVersion || 0) + 1;
        this.messageVersion = messageVersion;
        setTimeout(() => {
            if (this.messageVersion === messageVersion) {
                this.messageDiv.innerHTML = message;
            }
        }, 10);
    }

    showKeyboardEntryHint() {
        this.keyboardTip.innerHTML = (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_2__.t)("msg_parson_enter_activate");
        this.keyboardTip.style.display = "";
        // Drop and re-add the class (with a reflow in between) so the attention
        // animation replays every time the user tabs back onto the problem.
        this.keyboardTip.classList.remove("parsons-entry-hint");
        void this.keyboardTip.offsetWidth;
        this.keyboardTip.classList.add("parsons-entry-hint");
        this.sourceLabel.style.display = "none";
        this.answerLabel.style.display = "none";
    }

    hideKeyboardEntryHint() {
        this.keyboardTip.innerHTML = (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_2__.t)("msg_parson_arrow_navigate");
        this.keyboardTip.style.display = "none";
        this.keyboardTip.classList.remove("parsons-entry-hint");
        this.sourceLabel.style.display = "";
        this.answerLabel.style.display = "";
    }

    disableBlockMathTabStops() {
        (0,_common_js_mathjax_a11y_js__WEBPACK_IMPORTED_MODULE_1__.disableMathJaxTabStops)(this.outerDiv, [".block"]);
    }

    observeMathJaxSpeech() {
        if (
            this.mathJaxSpeechObserver ||
            typeof MutationObserver === "undefined"
        ) {
            return;
        }

        this.mathJaxSpeechObserver = new MutationObserver((mutations) => {
            const changedBlocks = new Set();
            for (const mutation of mutations) {
                const block = mutation.target.closest?.(".block");
                if (block) {
                    changedBlocks.add(block);
                }
            }
            if (changedBlocks.size === 0) return;

            this.disableBlockMathTabStops();
            changedBlocks.forEach((view) => {
                const block = this.blocks.find((item) => item.view === view);
                if (block) this.updateBlockAriaLabel(block);
            });
        });
        this.mathJaxSpeechObserver.observe(this.outerDiv, {
            subtree: true,
            attributes: true,
            attributeFilter: ["data-semantic-speech-none"],
        });
    }

    // Based on what is specified in the original HTML, create the HTML view
    initializeView() {
        this.outerDiv = document.createElement("div");
        this.outerDiv.classList.add("parsons");
        this.outerDiv.id = this.counterId;
        this.outerDiv.addEventListener(
            "keydown",
            (event) => this.handleKeyboardMovementKeydown(event),
            true,
        );
        // parsons-text exists in source, make sure it has exercise-statement class
        let parsonsTextDiv = this.containerDiv.querySelector(".parsons-text");
        if (
            parsonsTextDiv &&
            !parsonsTextDiv.classList.contains("exercise-statement")
        )
            parsonsTextDiv.classList.add("exercise-statement");
        this.keyboardTip = document.createElement("div");
        this.keyboardTip.setAttribute("role", "tooltip");
        this.keyboardTip.id = this.counterId + "-tip";
        this.keyboardTip.innerHTML = (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_2__.t)("msg_parson_arrow_navigate");
        this.outerDiv.appendChild(this.keyboardTip);
        this.keyboardTip.style.display = "none";
        this.sortContainerDiv = document.createElement("div");
        this.sortContainerDiv.classList.add("sortable-code-container");
        this.sortContainerDiv.setAttribute(
            "aria-describedby",
            this.counterId + "-tip",
        );
        this.sortContainerDiv.tabIndex = 0;
        this.sortContainerDiv.setAttribute("role", "button");
        this.sortContainerDiv.setAttribute(
            "aria-label",
            (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_2__.t)("msg_parson_keyboard_entry_label"),
        );
        this.sortContainerDiv.addEventListener("focus", () => {
            if (
                !this.keyboardInputActive &&
                this.sortContainerDiv.matches(":focus-visible")
            ) {
                this.showKeyboardEntryHint();
            }
        });
        this.sortContainerDiv.addEventListener("keydown", (event) => {
            if (
                event.target === this.sortContainerDiv &&
                (event.key === "Enter" || event.key === " ")
            ) {
                this.startKeyboardInteraction();
                event.preventDefault();
                event.stopPropagation();
            }
        });
        this.sortContainerDiv.addEventListener("click", (event) => {
            if (event.target === this.sortContainerDiv) {
                this.startKeyboardInteraction();
            }
        });
        this.keyboardApplication = document.createElement("div");
        this.keyboardApplication.classList.add("parsons-keyboard-application");
        this.keyboardApplication.setAttribute("role", "application");
        this.keyboardApplication.tabIndex = -1;
        this.keyboardApplication.addEventListener("blur", () => {
            if (this.keyboardInputActive) {
                this.cancelKeyboardMovement();
            }
        });
        this.sortContainerDiv.addEventListener("blur", (event) => {
            if (
                this.keyboardInputActive &&
                event.relatedTarget !== this.keyboardApplication
            ) {
                this.cancelKeyboardMovement();
            } else if (!this.keyboardInputActive) {
                this.hideKeyboardEntryHint();
            }
        });
        this.sortContainerDiv.appendChild(this.keyboardApplication);
        this.outerDiv.appendChild(this.sortContainerDiv);
        this.sourceRegionDiv = document.createElement("div");
        this.sourceRegionDiv.id = this.counterId + "-sourceRegion";
        this.sourceRegionDiv.classList.add("sortable-code");
        this.sourceLabel = document.createElement("div");
        this.sourceLabel.setAttribute("role", "tooltip");
        this.sourceLabel.id = this.counterId + "-sourceTip";
        this.sourceLabel.innerHTML = (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_2__.t)("msg_parson_drag_from_here");
        this.sourceRegionDiv.appendChild(this.sourceLabel);
        this.sortContainerDiv.appendChild(this.sourceRegionDiv);
        this.sourceArea = document.createElement("div");
        this.sourceArea.id = this.counterId + "-source";
        this.sourceArea.classList.add("source");
        this.sourceArea.setAttribute(
            "aria-describedby",
            this.counterId + "-sourceTip",
        );
        this.sourceRegionDiv.appendChild(this.sourceArea);
        this.answerRegionDiv = document.createElement("div");
        this.answerRegionDiv.id = this.counterId + "-answerRegion";
        this.answerRegionDiv.classList.add("sortable-code");
        this.answerLabel = document.createElement("div");
        this.answerLabel.setAttribute("role", "tooltip");
        this.answerLabel.id = this.counterId + "-answerTip";
        this.answerLabel.innerHTML = (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_2__.t)("msg_parson_drag_to_here");
        this.answerRegionDiv.appendChild(this.answerLabel);
        this.sortContainerDiv.appendChild(this.answerRegionDiv);
        this.answerArea = document.createElement("div");
        this.answerArea.id = this.counterId + "-answer";
        this.answerArea.setAttribute(
            "aria-describedby",
            this.counterId + "-answerTip",
        );
        this.answerRegionDiv.appendChild(this.answerArea);
        this.parsonsControlDiv = document.createElement("div");
        this.parsonsControlDiv.classList.add("parsons-controls");
        this.outerDiv.appendChild(this.parsonsControlDiv);
        var that = this;
        this.checkButton = document.createElement("button");
        this.checkButton.className = "btn btn-success";
        this.checkButton.textContent = (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_2__.t)("msg_parson_check_me");
        this.checkButton.id = this.counterId + "-check";
        this.parsonsControlDiv.appendChild(this.checkButton);
        this.checkButton.type = "button";
        this.checkButton.addEventListener("click", function (event) {
            event.preventDefault();
            that.checkCurrentAnswer();
            that.logCurrentAnswer();
            that.renderFeedback();
        });
        this.resetButton = document.createElement("button");
        this.resetButton.className = "btn btn-default";
        this.resetButton.textContent = (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_2__.t)("msg_parson_reset");
        this.resetButton.id = this.counterId + "-reset";
        this.resetButton.type = "button";
        this.parsonsControlDiv.appendChild(this.resetButton);
        this.resetButton.addEventListener("click", function (event) {
            event.preventDefault();
            that.clearFeedback();
            that.checkButton.disabled = false;
            that.resetView();
            that.checkCount = 0;
            that.logMove("reset");
            that.setLocalStorage();
        });
        if (this.options.adaptive) {
            this.helpButton = document.createElement("button");
            this.helpButton.className = "btn btn-primary";
            this.helpButton.textContent = (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_2__.t)("msg_parson_help");
            this.helpButton.id = this.counterId + "-help";
            this.helpButton.disabled = false; // bje
            this.parsonsControlDiv.appendChild(this.helpButton);
            this.helpButton.addEventListener("click", function (event) {
                event.preventDefault();
                that.helpMe();
            });
        }
        this.messageDiv = document.createElement("div");
        this.messageDiv.id = this.counterId + "-message";
        this.messageDiv.setAttribute("aria-live", "polite");
        this.messageDiv.setAttribute("role", "status");
        this.parsonsControlDiv.appendChild(this.messageDiv);
        this.messageDiv.style.visibility = "hidden";
        this.origElem.replaceWith(this.outerDiv);
        const sqContainer = this.outerDiv.closest(".sqcontainer");
        if (sqContainer) {
            sqContainer.style.maxWidth = "none";
        }
        if (this.outerDiv) {
            if (this.question.innerHTML.match(/^\s+$/)) {
                this.question.remove();
            } else {
                this.outerDiv.prepend(this.question);
            }
        }
    }
    // Initialize lines and solution properties
    // CodeTailor: a big change is in this function - included #settled blocks and placeholder blocks
    initializeLines(text) {
        this.lines = [];
        // Create the initial blocks
        var textBlocks = text.split("---");
        if (textBlocks.length === 1) {
            // If there are no ---, then every line is its own block
            textBlocks = text.split("\n");
        }
        var solution = [];
        var indents = [];
        // CodeTailor: Parsons puzzle wise, the biggest change is in this section
        if (this.options.scaffolding === true) {
            var placeholderNeeded = false;
            // if there is a placeholder needed to be created at the end
            for (var i = 0; i < textBlocks.length; i++) {
                var textBlock = textBlocks[i];
                // Figure out options based on the #option
                // Remove the options from the code
                // only options are #paired or #distractor
                var options = {};
                var distractIndex;
                var distractHelptext = "";
                var tagIndex;
                var tag;
                var dependsIndex;
                var depends = [];
                if (textBlock.includes("#paired:")) {
                    distractIndex = textBlock.indexOf("#paired:");
                    distractHelptext = textBlock
                        .substring(distractIndex + 8, textBlock.length)
                        .trim();
                    textBlock = textBlock.substring(0, distractIndex + 7);
                } else if (textBlock.includes("#distractor:")) {
                    distractIndex = textBlock.indexOf("#distractor:");
                    distractHelptext = textBlock
                        .substring(distractIndex + 12, textBlock.length)
                        .trim();
                    textBlock = textBlock.substring(0, distractIndex + 11);
                } else if (textBlock.includes("#settled")) {
                    var settledIndex = textBlock.indexOf("#settled");
                    distractHelptext = textBlock
                        .substring(settledIndex + 8, textBlock.length)
                        .trim();
                    textBlock = textBlock.substring(0, settledIndex + 8);
                } else if (textBlock.includes("#tag:")) {
                    textBlock = textBlock.replace(/#tag:.*;.*;/, (s) =>
                        s.replace(/\s+/g, ""),
                    ); // remove whitespace in tag and depends list
                    tagIndex = textBlock.indexOf("#tag:");
                    tag = textBlock.substring(
                        tagIndex + 5,
                        textBlock.indexOf(";", tagIndex + 5),
                    );
                    if (tag == "") tag = "block-" + i;
                    dependsIndex = textBlock.indexOf(";depends:");
                    let dependsString = textBlock.substring(
                        dependsIndex + 9,
                        textBlock.indexOf(";", dependsIndex + 9),
                    );
                    depends =
                        dependsString.length > 0
                            ? dependsString.split(",")
                            : [];
                }
                if (textBlock.includes('class="displaymath')) {
                    options["displaymath"] = true;
                } else {
                    options["displaymath"] = false;
                }

                textBlock = textBlock.replace(
                    /#(paired|distractor|settled|tag:.*;.*;)/,
                    function (mystring, arg1) {
                        options[arg1] = true;
                        return "";
                    },
                );

                // if block is #settled - create a placeholder line (PH) before the lines,
                //          if it is not the first block, and the previous block is not settled
                // If lines are: settled, line 1, line 2, line 3, settled, line 4:
                // Create settled, line 1, line 2, line 3, PH1, settled, line 4, PH2
                // If lines are: line 1, settled, settled, line 2, line 3, line 4, settled:
                // Create line 1, PH1, settled, settled, line 2, line 3, line 4, PH2, settled
                if (
                    options["settled"] &&
                    i > 0 &&
                    lines.length > 0 &&
                    !lines[lines.length - 1].isSettled
                ) {
                    var placeholderLine = new _placeholderLine_js__WEBPACK_IMPORTED_MODULE_15__["default"](this);
                    lines.push(placeholderLine);
                    placeholderLine.distractor = true;
                    placeholderLine.paired = false;
                    placeholderLine.distractHelptext = "";
                    placeholderLine.groupWithNext = false;
                    placeholderLine.indent = 0;
                }

                if (options["settled"]) {
                    placeholderNeeded = true;
                }

                // Create lines
                var lines = [];
                if (!options["displaymath"]) {
                    var split = textBlock.split("\n");
                } else {
                    var split = [textBlock];
                }
                for (var j = 0; j < split.length; j++) {
                    var code = split[j];
                    // discard blank rows
                    if (!/^\s*$/.test(code)) {
                        var line = new _parsonsLine__WEBPACK_IMPORTED_MODULE_12__["default"](
                            this,
                            code,
                            options["displaymath"],
                        );
                        lines.push(line);
                        if (options["paired"]) {
                            line.distractor = true;
                            line.paired = true;
                            line.distractHelptext = distractHelptext;
                        } else if (options["distractor"]) {
                            line.distractor = true;
                            line.paired = false;
                            line.distractHelptext = distractHelptext;
                        } else if (options["settled"]) {
                            // settled lines: fixed solution lines
                            line.distractor = false;
                            line.paired = false;
                            line.isSettled = true;
                            solution.push(line);
                        } else {
                            line.distractor = false;
                            line.paired = false;
                            if (this.options.grader === "dag") {
                                line.tag = tag;
                                line.depends = depends;
                            }
                            solution.push(line);
                        }
                        if (indents.indexOf(line.indent) == -1) {
                            indents.push(line.indent);
                        }
                    }
                }
                if (lines.length > 0) {
                    // Add groupWithNext
                    for (j = 0; j < lines.length - 1; j++) {
                        lines[j].groupWithNext = true;
                    }
                    lines[lines.length - 1].groupWithNext = false;
                }
            }
            if (placeholderNeeded && !lines[lines.length - 1].isSettled) {
                // if there is a settled line before the ending lines
                var placeholderLine = new _placeholderLine_js__WEBPACK_IMPORTED_MODULE_15__["default"](this);
                lines.push(placeholderLine);
                placeholderLine.distractor = true;
                placeholderLine.paired = false;
                placeholderLine.distractHelptext = "";
                placeholderLine.groupWithNext = false;
            }
            // CodeTailor: Normalize the indents for java - sometimes java indent directly uses 8 spaces for method indent
            if (this.options.language === "java") {
                let classLineIndent = null;
                let methodLineIndent = null;

                for (let i = 0; i < this.lines.length; i++) {
                    const lineText = this.lines[i].text;

                    if (
                        classLineIndent === null &&
                        (lineText.includes("public class") ||
                            lineText.startsWith("import"))
                    ) {
                        classLineIndent = this.lines[i].indent;
                    }

                    if (
                        methodLineIndent === null &&
                        lineText.includes("public static")
                    ) {
                        methodLineIndent = this.lines[i].indent;
                    }

                    // Break early once both are found
                    if (classLineIndent !== null && methodLineIndent !== null) {
                        break;
                    }
                }

                // Detected Java 8-space indent — will shift levels down by one.
                if (classLineIndent === 0 && methodLineIndent === 8) {
                    indents = indents.sort(function (a, b) {
                        return a - b;
                    });

                    for (let i = 0; i < this.lines.length; i++) {
                        let line = this.lines[i];
                        let originalIndent = line.indent;
                        let normalizedLevel = indents.indexOf(originalIndent);
                        if (normalizedLevel > 0) {
                            normalizedLevel -= 1;
                        }
                        line.indent = normalizedLevel;
                    }
                } else {
                    indents = indents.sort(function (a, b) {
                        return a - b;
                    });
                    for (let i = 0; i < this.lines.length; i++) {
                        let line = this.lines[i];
                        line.indent = indents.indexOf(line.indent);
                    }
                }
            } else {
                // Python - Original behavior
                indents = indents.sort(function (a, b) {
                    return a - b;
                });
                for (let i = 0; i < this.lines.length; i++) {
                    let line = this.lines[i];
                    line.indent = indents.indexOf(line.indent);
                }
            }
            this.solution = solution;
        } else {
            // Normal Parsons puzzle initialization
            for (var i = 0; i < textBlocks.length; i++) {
                var textBlock = textBlocks[i];
                // Figure out options based on the #option
                // Remove the options from the code
                // only options are #paired or #distractor
                var options = {};
                var distractIndex;
                var distractHelptext = "";
                var tagIndex;
                var tag;
                var dependsIndex;
                var depends = [];
                if (textBlock.includes("#paired:")) {
                    distractIndex = textBlock.indexOf("#paired:");
                    distractHelptext = textBlock
                        .substring(distractIndex + 8, textBlock.length)
                        .trim();
                    textBlock = textBlock.substring(0, distractIndex + 7);
                } else if (textBlock.includes("#distractor:")) {
                    distractIndex = textBlock.indexOf("#distractor:");
                    distractHelptext = textBlock
                        .substring(distractIndex + 12, textBlock.length)
                        .trim();
                    textBlock = textBlock.substring(0, distractIndex + 11);
                } else if (textBlock.includes("#tag:")) {
                    textBlock = textBlock.replace(/#tag:.*;.*;/, (s) =>
                        s.replace(/\s+/g, ""),
                    ); // remove whitespace in tag and depends list
                    tagIndex = textBlock.indexOf("#tag:");
                    tag = textBlock.substring(
                        tagIndex + 5,
                        textBlock.indexOf(";", tagIndex + 5),
                    );
                    if (tag == "") tag = "block-" + i;
                    dependsIndex = textBlock.indexOf(";depends:");
                    let dependsString = textBlock.substring(
                        dependsIndex + 9,
                        textBlock.indexOf(";", dependsIndex + 9),
                    );
                    depends =
                        dependsString.length > 0
                            ? dependsString.split(",")
                            : [];
                }
                if (textBlock.includes('class="displaymath')) {
                    options["displaymath"] = true;
                } else {
                    options["displaymath"] = false;
                }
                textBlock = textBlock.replace(
                    /\s*#(paired|distractor|tag:.*;.*;)\s*/g,
                    function (mystring, arg1) {
                        options[arg1] = true;
                        return "";
                    },
                );
                // Create lines
                var lines = [];
                if (!options["displaymath"]) {
                    var split = textBlock.split("\n");
                } else {
                    var split = [textBlock];
                }

                for (var j = 0; j < split.length; j++) {
                    var code = split[j];
                    let isBlank = /^\s*$/.test(code);
                    // discard up to one blank leading or trailing line
                    if (isBlank && (j == 0 || j == split.length - 1)) {
                        continue;
                    }
                    var line = new _parsonsLine__WEBPACK_IMPORTED_MODULE_12__["default"](
                        this,
                        code,
                        options["displaymath"],
                    );
                    lines.push(line);
                    if (options["paired"]) {
                        line.distractor = true;
                        line.paired = true;
                        line.distractHelptext = distractHelptext;
                    } else if (options["distractor"]) {
                        line.distractor = true;
                        line.paired = false;
                        line.distractHelptext = distractHelptext;
                    } else {
                        line.distractor = false;
                        line.paired = false;
                        if (this.options.grader === "dag") {
                            line.tag = tag;
                            line.depends = depends;
                        }
                        solution.push(line);
                    }
                    if (indents.indexOf(line.indent) == -1) {
                        indents.push(line.indent);
                    }
                }
                if (lines.length > 0) {
                    // Add groupWithNext
                    for (j = 0; j < lines.length - 1; j++) {
                        lines[j].groupWithNext = true;
                    }
                    lines[lines.length - 1].groupWithNext = false;
                }
            }
            // Normalize the indents
            indents = indents.sort(function (a, b) {
                return a - b;
            });
            for (i = 0; i < this.lines.length; i++) {
                line = this.lines[i];
                line.indent = indents.indexOf(line.indent);
            }
            this.solution = solution;
        }
    }
    // Based on the blocks, create the source and answer areas
    async initializeAreas(sourceBlocks, answerBlocks, options) {
        // Create blocks property as the sum of the two
        const parent = this.outerDiv.parentNode;
        var blocks = [];
        var i, block;
        for (i = 0; i < sourceBlocks.length; i++) {
            block = sourceBlocks[i];
            blocks.push(block);
            this.sourceArea.appendChild(block.view);
        }
        for (i = 0; i < answerBlocks.length; i++) {
            block = answerBlocks[i];
            blocks.push(block);
            this.answerArea.appendChild(block.view);
        }
        this.blocks = blocks;
        this.observeMathJaxSpeech();
        // If present, disable some blocks
        var disabled = options.disabled;
        if (disabled !== undefined) {
            for (i = 0; i < blocks.length; i++) {
                block = blocks[i];
                if (disabled.includes(block.lines[0].index)) {
                    block.view.classList.add("disabled");
                }
            }
        }
        // Determine how much indent should be possible in the answer area
        var indent = 0;
        if (!this.noindent) {
            if (
                this.options.language == "natural" ||
                this.options.language == "math" ||
                this.options.language == "text"
            ) {
                indent = this.solutionIndent();
            } else {
                indent = Math.max(0, this.solutionIndent());
            }
        }
        this.indent = indent;
        // For rendering, place in an onscreen position
        var isHidden = this.outerDiv.offsetParent == null;
        var replaceElement;
        if (isHidden) {
            replaceElement = document.createElement("div");
            if (parent) {
                parent.replaceChild(replaceElement, this.outerDiv);
            }
            // add runestone-sphinx class so the css rules for parsons will apply
            this.outerDiv.classList.add("runestone-sphinx");
            document.body.appendChild(this.outerDiv);
        }

        // only do prettify if prism is not loaded
        if (
            this.options.prettifyLanguage !== "" &&
            typeof Prism === "undefined"
        ) {
            prettyPrint();
        }

        const lang = this.options["language"];
        if (lang && typeof Prism !== "undefined") {
            const codeEls = this.containerDiv.querySelectorAll("code");
            for (const el of codeEls) {
                el.classList.add(`language-${lang}`);
            }
            Prism.highlightAllUnder(this.containerDiv);
        }

        for (let i = 0; i < this.lines.length; i++) {
            this.lines[i].initializeWidth();
        }

        // Set the source width to its max value.  This allows the blocks to be created
        // at their "natural" size. As long as that is smaller than the max.
        // This allows us to use sensible functions to determine the correct heights
        // and widths for the drag and drop areas.
        // Like most of the sizing, this is a bit of a hack.
        const availableWidth = this.outerDiv.offsetWidth;
        const answerIndentSpace = this.options.pixelsPerIndent * this.indent;
        const marginFudge = 80; // margins, padding, etc...
        let maxSourceAreaWidth =
            (availableWidth - answerIndentSpace - marginFudge) / 2;
        if (this.options.numbered != undefined) {
            maxSourceAreaWidth -= 25;
        }
        this.sourceArea.style.width = maxSourceAreaWidth + "px"; // likely reduced later

        // Layout the areas
        var areaWidth, areaHeight;
        // Establish the width and height of the droppable areas
        var item;
        areaHeight = 20;
        var height_add = 0;
        if (this.options.numbered != undefined) {
            height_add = 1;
        }

        // Use two explicit passes — first measure all widths (with MathJax awaited per block for math),
        // then apply the final areaWidth to all blocks and measure heights.
        areaWidth = 0;
        let self = this;

        // Pass 1: render math (if needed) and measure natural width of each block
        const isMath =
            this.options.language == "natural" ||
            this.options.language == "math" ||
            this.options.language == "text";
        for (i = 0; i < blocks.length; i++) {
            const item = blocks[i].view;
            if (isMath) {
                await self.queueMathJax(item);
            }
            areaWidth = Math.max(areaWidth, item.getBoundingClientRect().width);
        }
        this.disableBlockMathTabStops();
        this.updateBlockAriaLabels();
        // Pass 2: apply uniform width to all blocks, then measure heights
        for (i = 0; i < blocks.length; i++) {
            const item = blocks[i].view;
            item.style.width = areaWidth - 22 + "px";
            var addition = 3.8;
            const style = getComputedStyle(item);
            const outerH =
                item.getBoundingClientRect().height +
                parseFloat(style.marginTop) +
                parseFloat(style.marginBottom);
            if (outerH != 38) {
                addition = (3.1 * (outerH - 38)) / 21;
            }
            areaHeight += outerH + height_add * addition;
        }

        // sometimes we have a problem with hidden elements not getting the right height
        // just make sure that we have a reasonable height. There must be a better way to
        // do this.
        if (this.isTimed && areaHeight < blocks.length * 38) {
            areaHeight = blocks.length * 50;
        }
        this.areaWidth = areaWidth;
        if (this.options.numbered != undefined) {
            this.areaWidth += 25;
            //areaHeight += (blocks.length);
        }
        if (indent > 0 && indent <= 4) {
            this.answerArea.classList.add("answer" + indent);
        } else {
            this.answerArea.classList.add("answer");
        }
        // Initialize paired distractor decoration
        var bins = [];
        var bin = [];
        for (i = 0; i < this.lines.length; i++) {
            var line = this.lines[i];
            if (line.block() == undefined) {
                if (bin.length > 0) {
                    bins.push(bin);
                    bin = [];
                }
            } else {
                bin.push(line);
                if (!line.groupWithNext) {
                    bins.push(bin);
                    bin = [];
                }
            }
        }
        var pairedBins = [];
        var lineNumbers = [];
        var pairedDivs = [];
        var j;
        if (this.pairDistractors || !this.options.adaptive) {
            for (i = bins.length - 1; i > -1; i--) {
                bin = bins[i];
                if (bin[0].paired) {
                    // Add all in bin to line numbers
                    for (j = bin.length - 1; j > -1; j--) {
                        lineNumbers.unshift(bin[j].index);
                    }
                } else {
                    if (lineNumbers.length > 0) {
                        // Add all in bin to line numbers
                        for (j = bin.length - 1; j > -1; j--) {
                            lineNumbers.unshift(bin[j].index);
                        }
                        pairedBins.unshift(lineNumbers);
                        lineNumbers = [];
                    }
                }
            }
            for (i = 0; i < pairedBins.length; i++) {
                var pairedDiv = document.createElement("div");
                pairedDiv.classList.add("paired");
                pairedDiv.innerHTML =
                    "<span id='st' style='vertical-align: middle; font-weight: bold'>or{</span>";
                pairedDivs.push(pairedDiv);
                this.sourceArea.appendChild(pairedDiv);
            }
        } else {
            pairedBins = [];
        }
        this.areaHeight = areaHeight;
        this.sourceArea.style.width = `${this.areaWidth + 2}px`;
        this.sourceArea.style.height = `${this.areaHeight}px`;
        this.answerArea.style.width = `${this.options.pixelsPerIndent * indent + this.areaWidth + 2}px`;
        this.answerArea.style.height = `${this.areaHeight}px`;

        this.pairedBins = pairedBins;
        this.pairedDivs = pairedDivs;
        if (this.options.numbered != undefined) {
            this.addBlockLabels(sourceBlocks.concat(answerBlocks));
        }
        // Update the view
        this.state = undefined; // needs to be here for loading from storage
        this.updateView();
        // Put back into the offscreen position
        if (isHidden) {
            replaceElement.parentNode.replaceChild(
                this.outerDiv,
                replaceElement,
            );
        }
    }

    // Make blocks interactive (both drag-and-drop and keyboard)
    initializeInteractivity() {
        for (var i = 0; i < this.blocks.length; i++) {
            this.blocks[i].initializeInteractivity();
        }
        this.initializeTabIndex();
        let self = this;
        if (
            this.options.language == "natural" ||
            this.options.language == "math" ||
            this.options.language == "text"
        ) {
            // MathJax typesets in call order, so this runs after the
            // per-block items have reached their final layout.
            self.queueMathJax(self.outerDiv).then(() => {
                // Recalculate areaWidth and areaHeight from all blocks (source + answer)
                // now that MathJax has rendered to final dimensions.
                var newAreaWidth = 0;
                var newAreaHeight = 20;
                var height_add = self.options.numbered != undefined ? 1 : 0;
                var sourceBlocks = self.sourceBlocks();
                var answerBlocks = self.answerBlocks();
                var allBlocks = sourceBlocks.concat(answerBlocks);

                // First pass: find max natural width across all blocks
                for (var i = 0; i < allBlocks.length; i++) {
                    var blockViewEl = allBlocks[i].view;
                    blockViewEl.style.width = ""; // release fixed width to get natural width
                    var bvStyle = getComputedStyle(blockViewEl);
                    var bvWidth =
                        blockViewEl.getBoundingClientRect().width +
                        parseFloat(bvStyle.marginLeft || 0) +
                        parseFloat(bvStyle.marginRight || 0);
                    newAreaWidth = Math.max(newAreaWidth, bvWidth);
                }

                var baseWidth = newAreaWidth - 22;
                var answerWidth =
                    newAreaWidth +
                    self.indent * self.options.pixelsPerIndent -
                    22;

                // Second pass: apply correct width and accumulate height
                for (var i = 0; i < allBlocks.length; i++) {
                    var blockEl = allBlocks[i].view;
                    blockEl.style.width = baseWidth + "px";
                    var bStyle = getComputedStyle(blockEl);
                    var outerH =
                        blockEl.getBoundingClientRect().height +
                        parseFloat(bStyle.marginTop || 0) +
                        parseFloat(bStyle.marginBottom || 0);
                    var addition = 3.8;
                    if (outerH != 38) {
                        addition = (3.1 * (outerH - 38)) / 21;
                    }
                    newAreaHeight += outerH + height_add * addition;
                }

                self.areaWidth = newAreaWidth;
                self.areaHeight = newAreaHeight;

                // Resize source and answer areas
                self.sourceArea.style.width = newAreaWidth + 2 + "px";
                self.sourceArea.style.height = newAreaHeight + "px";
                self.answerArea.style.width =
                    self.options.pixelsPerIndent * self.indent +
                    newAreaWidth +
                    2 +
                    "px";
                self.answerArea.style.height = newAreaHeight + "px";

                // Reposition source blocks
                var positionTop = 0;
                for (var i = 0; i < sourceBlocks.length; i++) {
                    var sv = sourceBlocks[i].view;
                    sv.style.left = "0px";
                    sv.style.top = positionTop + "px";
                    sv.style.width = baseWidth + "px";
                    sv.style.zIndex = 2;
                    var svStyle = getComputedStyle(sv);
                    positionTop +=
                        sv.getBoundingClientRect().height +
                        parseFloat(svStyle.marginTop || 0) +
                        parseFloat(svStyle.marginBottom || 0);
                }

                // Reposition paired distractor brackets
                for (var i = 0; i < self.pairedBins.length; i++) {
                    var bin = self.pairedBins[i];
                    var matching = [];
                    for (var j = 0; j < sourceBlocks.length; j++) {
                        if (sourceBlocks[j].matchesBin(bin)) {
                            matching.push(sourceBlocks[j]);
                        }
                    }
                    var div = self.pairedDivs[i];
                    if (matching.length == 0) {
                        div.style.display = "none";
                    } else {
                        div.style.display = "";
                        var height = -5;
                        var lastView = matching[matching.length - 1].view;
                        var firstView = matching[0].view;
                        var lastTop =
                            parseFloat(getComputedStyle(lastView).top) || 0;
                        var firstTop =
                            parseFloat(getComputedStyle(firstView).top) ||
                            0;
                        height += lastTop;
                        height -= firstTop;
                        var lastStyle = getComputedStyle(lastView);
                        height +=
                            lastView.getBoundingClientRect().height +
                            parseFloat(lastStyle.marginTop || 0) +
                            parseFloat(lastStyle.marginBottom || 0);
                        div.style.left = "-6px";
                        div.style.top = getComputedStyle(firstView).top;
                        div.style.width = baseWidth + 34 + "px";
                        div.style.height = height + "px";
                        div.style.zIndex = 1;
                        div.style.textIndent = "-30px";
                        div.style.paddingTop = (height - 70) / 2 + "px";
                        div.style.overflow = "visible";
                        div.style.fontSize = "43px";
                        div.style.verticalAlign = "middle";
                        div.style.color =
                            "var(--parsonsLabelColor, #5858e0)";
                        div.innerHTML =
                            "<span id='st' style='vertical-align: middle; font-weight: bold; font-size: 15px'>or</span>{";
                    }
                }

                // Reposition answer blocks
                positionTop = 0;
                for (var i = 0; i < answerBlocks.length; i++) {
                    var block = answerBlocks[i];
                    var indent =
                        block.indent * self.options.pixelsPerIndent;
                    var bv = block.view;
                    bv.style.left = indent + "px";
                    bv.style.top = positionTop + "px";
                    bv.style.width = answerWidth - indent + "px";
                    bv.style.zIndex = 2;
                    var bvStyle2 = getComputedStyle(bv);
                    positionTop +=
                        bv.getBoundingClientRect().height +
                        parseFloat(bvStyle2.marginTop || 0) +
                        parseFloat(bvStyle2.marginBottom || 0);
                }
            });
        }
    }
    // Make the problem, rather than an individual block, keyboard accessible.
    initializeTabIndex() {
        this.sortContainerDiv.tabIndex = 0;
        for (const block of this.blocks) {
            if (block.view.classList.contains("disabled")) {
                block.view.removeAttribute("tabindex");
            } else {
                block.view.setAttribute("tabindex", "-1");
            }
        }
        return this;
    }
    /* =====================================================================
    ==== SERVER COMMUNICATION ==============================================
    ===================================================================== */
    // Return the argument that is newer based on the timestamp
    newerData(dataA, dataB) {
        var dateA = dataA.timestamp;
        var dateB = dataB.timestamp;
        if (dateA == undefined) {
            return dataB;
        }
        if (dateB == undefined) {
            return dataA;
        }
        dateA = this.dateFromTimestamp(dateA);
        dateB = this.dateFromTimestamp(dateB);
        if (dateA > dateB) {
            return dataA;
        } else {
            return dataB;
        }
    }
    // Based on the data, load
    async loadData(data) {
        // guard against any failure to load/adapt problem
        try {
            if (this.options.scaffolding === true) {
                var sourceHash = data.source;
                if (sourceHash == undefined) {
                    // maintain backwards compatibility
                    sourceHash = data.trash;
                }
                var answerHash = data.answer;
                var adaptiveHash = data.adaptive;
                var options;
                if (adaptiveHash == undefined) {
                    options = {};
                } else {
                    options = this.optionsFromHash(adaptiveHash);
                }
                if (options.noindent !== undefined) {
                    this.noindent = true;
                }
                if (options.checkCount !== undefined) {
                    this.checkCount = options.checkCount;
                }
                if (options.hasSolved !== undefined) {
                    this.hasSolved = options.hasSolved;
                }
                await this.initializeAreas(
                    this.blocksFromSource(),
                    this.settledBlocksFromSource(),
                    options,
                );
            } else {
                var sourceHash = data.source;
                if (sourceHash == undefined) {
                    // maintain backwards compatibility
                    sourceHash = data.trash;
                }
                var answerHash = data.answer;
                var adaptiveHash = data.adaptive;
                var options;
                if (adaptiveHash == undefined) {
                    options = {};
                } else {
                    options = this.optionsFromHash(adaptiveHash);
                }
                if (options.noindent !== undefined) {
                    this.noindent = true;
                }
                if (options.checkCount !== undefined) {
                    this.checkCount = options.checkCount;
                }
                if (options.hasSolved !== undefined) {
                    this.hasSolved = options.hasSolved;
                }
                if (
                    sourceHash == undefined ||
                    answerHash == undefined ||
                    answerHash.length == 1
                ) {
                    await this.initializeAreas(
                        this.blocksFromSource(),
                        [],
                        options,
                    );
                } else {
                    await this.initializeAreas(
                        this.blocksFromHash(sourceHash),
                        this.blocksFromHash(answerHash),
                        options,
                    );
                    this.grade = this.grader.grade();
                    if (this.grade == "correct") {
                        this.correct = true;
                    } else if (this.answerLines().length == 0) {
                        this.correct = null;
                    } else {
                        this.correct = false;
                    }
                }
            }
        } catch (err) {
            // if anything goes wrong, just initialize based on problem source
            await this.initializeAreas(this.blocksFromSource(), [], options);
            console.log(
                `Error restoring answer for student ${data.sid} in ${data.div_id}. Defaulting to original state.`,
            );
        }
        // Start the interface
        if (this.needsReinitialization !== true) {
            this.initializeInteractivity();
            // This is a bit of a hack to get the blocks to be in the right place
            // when the page loads.  It is needed because the blocks are not
            // visible when the page loads, so the size is off.  This forces
            // a realignment.
            if (this.isTimed && !this.assessmentTaken) {
                await this.resetView();
            }
        }
    }
    // Return what is stored in local storage
    localData() {
        var data = localStorage.getItem(this.storageId);
        if (data !== null) {
            if (data.charAt(0) == "{") {
                data = JSON.parse(data);
            } else {
                data = {};
            }
        } else {
            data = {};
        }
        return data;
    }
    // RunestoneBase: Sent when the server has data
    restoreAnswers(serverData) {
        this.loadData(serverData);
    }
    // RunestoneBase: Load what is in local storage
    checkLocalStorage() {
        if (this.graderactive) {
            return;
        }
        const localData = this.localData();
        if (
            localData.timestamp &&
            localData.timestamp < eBookConfig.termStartDate
        ) {
            localStorage.removeItem(this.storageId);
            localData = {};
        }
        this.loadData(localData);
    }
    // RunestoneBase: Set the state of the problem in local storage
    setLocalStorage(data) {
        var toStore;
        if (data == undefined) {
            toStore = {
                source: this.sourceHash(),
                answer: this.answerHash(),
                timestamp: new Date(),
            };
            var adaptiveHash = this.adaptiveHash();
            if (adaptiveHash.length > 0) {
                toStore.adaptive = adaptiveHash;
            }
        } else {
            toStore = data;
        }
        localStorage.setItem(this.storageId, JSON.stringify(toStore));
    }

    async updatePlaceholders() {
        setTimeout(() => {
            var answerBlocks = this.answerBlocks();
            var i, hasNormalBlock;
            var placeholder;
            // hide placeholder
            for (i = 0; i < answerBlocks.length; ++i) {
                // checking on placeholders
                if (answerBlocks[i].isPlaceholder) {
                    placeholder = answerBlocks[i];
                    hasNormalBlock = false;
                    if (
                        i > 0 &&
                        !answerBlocks[i - 1].isSettled &&
                        !answerBlocks[i - 1].isPlaceholder
                    ) {
                        hasNormalBlock = true;
                    }
                    if (
                        i < answerBlocks.length - 1 &&
                        !answerBlocks[i + 1].isSettled &&
                        !answerBlocks[i + 1].isPlaceholder
                    ) {
                        hasNormalBlock = true;
                    }

                    if (hasNormalBlock) {
                        // if a placeholder has a normal block before or after, hide it;
                        if (!placeholder.view.classList.contains("hide")) {
                            placeholder.view.classList.add("hide");
                            for (
                                var j = 0;
                                j < answerBlocks.length - 1 - i;
                                j++
                            ) {
                                placeholder.moveDown();
                            }
                        }
                    }
                }
            }
        }, 5);

        setTimeout(() => {
            var answerBlocks = this.answerBlocks();
            var contentLength = 0;
            while (
                contentLength < answerBlocks.length &&
                !answerBlocks[contentLength].view.classList.contains("hide")
            ) {
                contentLength++;
            }
            // show placeholder when needed
            var prevIsSettled = true;
            if (this.firstBlockSettled) {
                prevIsSettled = false;
            }
            var settledCount = 0;
            var i;
            for (i = 0; i < contentLength; ++i) {
                // locate two consecutive settled blocks
                if (answerBlocks[i].isSettled && prevIsSettled) {
                    break;
                }
                if (answerBlocks[i].isSettled) {
                    prevIsSettled = true;
                    settledCount++;
                } else {
                    prevIsSettled = false;
                }
            }
            var placeholder;
            if (
                i < contentLength ||
                (answerBlocks[contentLength - 1] &&
                    answerBlocks[contentLength - 1].isSettled &&
                    !this.lastBlockSettled)
            ) {
                // looking for the placeholder block that should be after "settledCount" number of settled blocks;
                var placeholderIndex;
                for (
                    placeholderIndex = answerBlocks.length - 1;
                    placeholderIndex >= contentLength;
                    placeholderIndex--
                ) {
                    if (
                        answerBlocks[placeholderIndex].afterSettledBlockCount ==
                        settledCount
                    ) {
                        placeholder = answerBlocks[placeholderIndex];
                        break;
                    }
                }
                if (
                    answerBlocks[placeholderIndex].afterSettledBlockCount !=
                    settledCount
                ) {
                    console.log("error moving up; no placeholder found");
                    return;
                }
                if (placeholder.view.classList.contains("hide")) {
                    placeholder.view.classList.remove("hide");
                    // should be moved right before the block answerBlocks[i]
                    for (var j = 0; j < placeholderIndex - i; j++) {
                        placeholder.moveUp();
                    }
                }
            }
        }, 10);
    }

    /* =====================================================================
    ==== LOGGING ===========================================================
    ===================================================================== */
    // Log the interaction with the problem to the server:
    //   start: the user started interacting with this problem
    //   move: the user moved a block to a new position
    //   reset: the reset button was pressed
    //   removeDistractor: "Help Me" removed a distractor
    //   removeIndentation: "Help Me" removed indentation
    //   combineBlocks: "Help Me" combined blocks
    logMove(activity) {
        var event = {
            event: "parsonsMove",
            div_id: this.divid,
            storageid: super.localStorageKey(),
        };
        var act = activity + "|" + this.sourceHash() + "|" + this.answerHash();
        var adaptiveHash = this.adaptiveHash();
        if (adaptiveHash !== "") {
            act = act + "|" + adaptiveHash;
        }
        event.act = act;
        this.logBookEvent(event);
    }
    // Log the answer to the problem
    //   correct: The answer given matches the solution
    //   incorrect*: The answer is wrong for various reasons
    async logCurrentAnswer(sid) {
        var event = {
            event: "parsons",
            div_id: this.divid,
        };
        var answerHash = this.answerHash();
        event.answer = answerHash;
        var sourceHash = this.sourceHash();
        event.source = sourceHash;
        var act = sourceHash + "|" + answerHash;
        var adaptiveHash = this.adaptiveHash();
        if (adaptiveHash !== "") {
            event.adaptive = adaptiveHash;
            act = act + "|" + adaptiveHash;
        }
        if (this.grade == "correct") {
            act = "correct|" + act;
            event.correct = "T";
        } else {
            act = "incorrect|" + act;
            event.correct = "F";
        }
        event.act = act;

        if (typeof sid !== "undefined") {
            event.sid = sid;
        }

        await this.logBookEvent(event);
    }
    /* =====================================================================
    ==== ACCESSING =========================================================
    ===================================================================== */
    // Answer the hash of the adaptive state
    adaptiveHash() {
        if (!this.options.adaptive) {
            return "";
        }
        var hash = [];
        for (var i = 0; i < this.blocks.length; i++) {
            var block = this.blocks[i];
            if (!block.enabled()) {
                hash.push("d" + block.lines[0].index);
            }
        }
        if (this.noindent !== this.options.noindent) {
            hash.push("i");
        }
        hash.push("c" + this.checkCount);
        if (this.hasSolved) {
            hash.push("s");
        }
        return hash.join("-");
    }
    // Create options for creating blocks based on a hash
    optionsFromHash(hash) {
        var split;
        if (hash === "-" || hash === "" || hash === null) {
            split = [];
        } else {
            split = hash.split("-");
        }
        var options = {};
        var disabled = [];
        for (var i = 0; i < split.length; i++) {
            var key = split[i];
            if (key[0] == "i") {
                options.noindent = true;
            } else if (key[0] == "d") {
                disabled.push(parseInt(key.slice(1)));
            } else if (key[0] == "s") {
                options.hasSolved = true;
            } else if (key[0] == "c") {
                options.checkCount = parseInt(key.slice(1));
            }
        }
        if (disabled.length > 0) {
            options.disabled = disabled;
        }
        return options;
    }
    // Answer the hash of the answer area
    answerHash() {
        var hash = [];
        var blocks = this.answerBlocks();
        for (var i = 0; i < blocks.length; i++) {
            hash.push(blocks[i].hash());
        }
        if (hash.length === 0) {
            return "-";
        } else {
            return hash.join("-");
        }
    }
    // Answer the hash of the source area
    sourceHash() {
        var hash = [];
        var blocks = this.sourceBlocks();
        for (var i = 0; i < blocks.length; i++) {
            hash.push(blocks[i].hash());
        }
        if (hash.length === 0) {
            return "-";
        } else {
            return hash.join("-");
        }
    }
    // Inter-problem adaptive changes
    // Based on the recentAttempts, remove distractors, add indent, combine blocks
    adaptBlocks(input) {
        var blocks = [];
        var distractors = [];
        var block;
        for (var i = 0; i < input.length; i++) {
            block = input[i];
            if (block.isDistractor()) {
                distractors.push(block);
            } else {
                blocks.push(block);
            }
        }
        this.recentAttempts = localStorage.getItem(
            this.adaptiveId + "recentAttempts",
        );
        if (this.recentAttempts == undefined || this.recentAttempts == "NaN") {
            this.recentAttempts = 3;
        }
        var lastestAttemptCount = this.recentAttempts;
        var nBlocks = blocks.length;
        var nBlocksToCombine = 0;
        var nDistractors = distractors.length;
        var nToRemove = 0;
        this.pairDistractors = true;
        var giveIndentation = false;
        if (lastestAttemptCount < 2) {
            // 1 Try
            this.pairDistractors = false;
            this.limitDistractors = false;
        } else if (lastestAttemptCount < 4) {
            // 2-3 Tries
            // Do nothing they are doing normal
            this.pairDistractors = true;
        } else if (lastestAttemptCount < 6) {
            // 4-5 Tries
            // pair distractors
            this.pairDistractors = true;
        } else if (lastestAttemptCount < 8) {
            // 6-7 Tries
            // Remove 50% of distractors
            nToRemove = 0.5 * nDistractors;
            this.pairDistractors = true;
        } else {
            // 8+ Tries
            // Remove all of distractors
            nToRemove = nDistractors;
            this.pairDistractors = true;
        }
        /*
        else if(lastestAttemptCount < 12) { //10-11
            // Remove all distractors and give indentation
            nToRemove = nDistractors;
            giveIndentation = true;
            this.pairDistractors = true;
        } else if(lastestAttemptCount < 14) { // 12-13 Tries
            // Remove all of distractors
            // give indentation
            // reduce problem to 3/4 size
            giveIndentation = true;
            nToRemove = nDistractors;
            nBlocksToCombine = .25 * nBlocks;
            this.pairDistractors = true;
        } else { // >= 14 Tries
            // Remove all of distractors
            // give indentation
            // reduce problem to 1/2 size
            giveIndentation = true;
            nToRemove = nDistractors;
            nBlocksToCombine = .5 * nBlocks;
            this.pairDistractors = true;
        }
        */
        nBlocksToCombine = Math.min(nBlocksToCombine, nBlocks - 3);
        // Never combine so where there are less than three blocks left
        // Remove distractors
        distractors = this.shuffled(distractors);
        distractors = distractors.slice(0, nToRemove);
        var output = [];
        for (i = 0; i < input.length; i++) {
            block = input[i];
            if (!block.isDistractor()) {
                output.push(block);
            } else if (distractors.indexOf(block) == -1) {
                output.push(block);
            }
        }
        //var output = input;
        if (giveIndentation) {
            for (let i = 0; i < output.length; i++) {
                output[i].addIndent();
            }
            this.indent = 0;
            this.noindent = true;
        }
        // combine blocks
        var solution = [];
        for (i = 0; i < this.lines.length; i++) {
            for (var j = 0; j < output.length; j++) {
                if (output[j].lines[0].index == i) {
                    solution.push(output[j]);
                }
            }
        }
        for (let i = 0; i < nBlocksToCombine; i++) {
            // combine one set of blocks
            var best = -10;
            var combineIndex = -10;
            for (j = 0; j < solution.length - 1; j++) {
                block = solution[j];
                var next = solution[j + 1];
                var rating = 10 - block.lines.length - next.lines.length;
                var blockIndent = block.minimumLineIndent();
                var nextIndent = next.minimumLineIndent();
                if (blockIndent == nextIndent) {
                    rating += 2;
                } else if (blockIndent > nextIndent) {
                    rating -= 1;
                }
                if (
                    block.lines[block.lines.length - 1].indent ==
                    next.lines[0].indent
                ) {
                    rating += 1;
                }
                if (rating >= best) {
                    best = rating;
                    combineIndex = j;
                }
            }
            block = solution[combineIndex];
            next = solution[combineIndex + 1];
            for (j = 0; j < next.lines.length; j++) {
                block.addLine(next.lines[j]);
            }
            var newSolution = [];
            for (j = 0; j < solution.length; j++) {
                if (j !== combineIndex + 1) {
                    newSolution.push(solution[j]);
                }
            }
            var solution = newSolution;
        }
        // reorder
        var combinedOutput = [];
        for (i = 0; i < output.length; i++) {
            for (j = 0; j < solution.length; j++) {
                if (output[i].lines[0].index == solution[j].lines[0].index) {
                    combinedOutput.push(solution[j]);
                }
            }
        }
        return combinedOutput;
    }
    // Return an array of code blocks based on what is specified in the problem
    blocksFromSource() {
        var unorderedBlocks = [];
        var originalBlocks = [];
        var blocks = [];
        var lines = [];
        var block, line, i;
        for (i = 0; i < this.lines.length; i++) {
            line = this.lines[i];
            // CodeTailor: do not include place holder or settled solution lines in source blocks
            if (line.isPlaceholderLine || line.isSettled) {
                continue;
            }
            lines.push(line);
            if (!line.groupWithNext) {
                unorderedBlocks.push(new _parsonsBlock__WEBPACK_IMPORTED_MODULE_13__["default"](this, lines));
                lines = [];
            }
        }
        originalBlocks = unorderedBlocks;
        // Trim the distractors
        var removedBlocks = [];
        if (this.options.maxdist !== undefined) {
            var maxdist = this.options.maxdist;
            var distractors = [];
            for (i = 0; i < unorderedBlocks.length; i++) {
                block = unorderedBlocks[i];
                if (block.lines[0].distractor) {
                    distractors.push(block);
                }
            }
            if (maxdist < distractors.length) {
                distractors = this.shuffled(distractors);
                distractors = distractors.slice(0, maxdist);
                for (i = 0; i < unorderedBlocks.length; i++) {
                    block = unorderedBlocks[i];
                    if (block.lines[0].distractor) {
                        if (distractors.indexOf(block) > -1) {
                            blocks.push(block);
                        } else {
                            removedBlocks.push(i);
                        }
                    } else {
                        blocks.push(block);
                    }
                }
                unorderedBlocks = blocks;
                blocks = [];
            }
        }

        // This is necessary, set the pairDistractors value before blocks get shuffled - William Li (August 2020)
        if (this.recentAttempts < 2) {
            // 1 Try
            this.pairDistractors = false;
        } else {
            this.pairDistractors = true;
        }

        if (this.options.order === undefined) {
            // Shuffle, respecting paired distractors
            var chunks = [],
                chunk = [];
            for (i = 0; i < unorderedBlocks.length; i++) {
                block = unorderedBlocks[i];
                if (block.lines[0].paired && this.pairDistractors) {
                    // William Li (August 2020)
                    chunk.push(block);
                } else {
                    chunk = [];
                    chunk.push(block);
                    chunks.push(chunk);
                }
            }
            chunks = this.shuffled(chunks);
            for (i = 0; i < chunks.length; i++) {
                chunk = chunks[i];
                if (chunk.length > 1) {
                    // shuffle paired distractors
                    chunk = this.shuffled(chunk);
                    for (j = 0; j < chunk.length; j++) {
                        blocks.push(chunk[j]);
                    }
                } else {
                    blocks.push(chunk[0]);
                }
            }
        } else {
            // Order according to order specified
            for (i = 0; i < this.options.order.length; i++) {
                block = originalBlocks[this.options.order[i]];
                if (
                    block !== undefined &&
                    removedBlocks.indexOf(this.options.order[i]) < 0
                ) {
                    blocks.push(block);
                }
            }
        }
        this.pairDistractors = true;
        if (this.options.adaptive) {
            this.limitDistractors = true;
            blocks = this.adaptBlocks(blocks);
            if (!this.limitDistractors) {
                for (i = 0; i < removedBlocks.length; i++) {
                    var index =
                        this.options.order == undefined
                            ? Math.random(0, blocks.length)
                            : this.options.order.indexOf(removedBlocks[i]);
                    blocks.splice(index, 0, originalBlocks[removedBlocks[i]]);
                }
            }
        }
        if (this.pairDistractors && this.options.order != undefined) {
            //move pairs together
            //Go through array looking for ditractor and its pair
            for (i = 1; i < originalBlocks.length; i++) {
                if (
                    originalBlocks[i].lines[0].paired &&
                    blocks.indexOf(originalBlocks[i]) >= 0
                ) {
                    var j = i;
                    while (blocks.indexOf(originalBlocks[j - 1]) < 0) {
                        // find the paired distractor or solution block it will be next to
                        j--;
                    }
                    var indexTo = blocks.indexOf(originalBlocks[j - 1]);
                    var indexFrom = blocks.indexOf(originalBlocks[i]);
                    blocks.splice(indexFrom, 1);
                    blocks.splice(indexTo, 0, originalBlocks[i]);
                }
            }
        }
        return blocks;
    }
    // Return a codeblock that corresponds to the hash
    blockFromHash(hash) {
        var split = hash.split("_");
        var lines = [];
        for (var i = 0; i < split.length - 1; i++) {
            lines.push(this.lines[split[i]]);
        }
        var block = new _parsonsBlock__WEBPACK_IMPORTED_MODULE_13__["default"](this, lines);
        if (this.noindent) {
            block.indent = 0;
        } else {
            block.indent = Number(split[split.length - 1]);
        }
        return block;
    }
    // Return an array of codeblocks that corresponds to the hash
    blocksFromHash(hash) {
        var split;
        if (hash === "-" || hash === "" || hash === null) {
            split = [];
        } else {
            split = hash.split("-");
        }
        var blocks = [];
        for (var i = 0; i < split.length; i++) {
            blocks.push(this.blockFromHash(split[i]));
        }
        if (this.options.adaptive) {
            return this.adaptBlocks(blocks);
        } else {
            return blocks;
        }
    }

    // CodeTailor: Return a list of blocks with placeholders that should be provided in the answer area.
    settledBlocksFromSource() {
        var blocks = [];
        var lines = [];
        var answerBlocksCount = 0;
        var line, i;
        var settledBlocksBeforeCount = 0;
        var prevSettledBlock = undefined;
        var prevPlaceholderSize = 0;

        for (i = 0; i < this.lines.length; i++) {
            line = this.lines[i];
            lines.push(line);
            if (!line.groupWithNext) {
                if (line.isPlaceholderLine) {
                    // found a placeholder line. a placeholder line has at least one normal block before it.
                    // also a placeholder line always has "groupWithNext" false.
                    blocks.push(
                        new _placeholderBlock_js__WEBPACK_IMPORTED_MODULE_14__["default"](
                            this,
                            lines,
                            answerBlocksCount,
                            settledBlocksBeforeCount,
                        ),
                    );
                    // update the number of blocks missing for the settled block above
                    if (prevSettledBlock) {
                        prevSettledBlock.setBlocksAfter(answerBlocksCount);
                    }
                    // save the current number of answer blocks to update the tooltip for the settled block below
                    prevPlaceholderSize = answerBlocksCount;
                    // reset answer block count
                    answerBlocksCount = 0;
                    lines = [];
                } else if (line.isSettled) {
                    if (blocks.length == 0) {
                        this.firstBlockSettled = true;
                    }
                    var set = new _settledBlock_js__WEBPACK_IMPORTED_MODULE_16__["default"](this, lines);
                    if (!this.noindent) {
                        set.indent = lines[0].indent;
                    }
                    console.log("settled block set", set);
                    blocks.push(set);
                    if (prevPlaceholderSize > 0) {
                        set.setBlocksBefore(prevPlaceholderSize);
                    }
                    prevSettledBlock = set;
                    settledBlocksBeforeCount++;
                    answerBlocksCount = 0;
                    lines = [];
                } else {
                    if (!lines[0].distractor) {
                        answerBlocksCount++;
                    }
                    lines = [];
                }
            }
        }
        if (blocks.length > 0 && blocks[blocks.length - 1].isSettled) {
            this.lastBlockSettled = true;
        }
        console.log("settledblocksfromsource", blocks);
        return blocks;
    }

    // Return a block object by the full id including id prefix
    getBlockById(id) {
        for (var i = 0; i < this.blocks.length; i++) {
            var block = this.blocks[i];
            if (block.view.id == id) {
                return block;
            }
        }
        return undefined;
    }
    // Return array of codeblocks that are the solution
    solutionBlocks() {
        var solutionBlocks = [];
        var solutionLines = [];
        for (var i = 0; i < this.lines.length; i++) {
            if (!this.lines[i].distractor) {
                solutionLines.push(this.lines[i]);
            }
        }
        var block = solutionLines[0].block();
        solutionBlocks.push(block);
        for (let i = 1; i < solutionLines.length; i++) {
            var nextBlock = solutionLines[i].block();
            if (block !== nextBlock) {
                block = nextBlock;
                solutionBlocks.push(block);
            }
        }
        return solutionBlocks;
    }
    // Return array of codeblocks based on what is in the source field
    sourceBlocks() {
        var sourceBlocks = [];
        var children = this.sourceArea.children;
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            if (child.classList.contains("block")) {
                sourceBlocks.push(this.getBlockById(child.id));
            }
        }
        return sourceBlocks;
    }
    // Return array of enabled codeblocks based on what is in the source field
    enabledSourceBlocks() {
        var all = this.sourceBlocks();
        var enabled = [];
        for (var i = 0; i < all.length; i++) {
            var block = all[i];
            if (block.enabled()) {
                enabled.push(block);
            }
        }
        return enabled;
    }
    // Return array of codeblocks based on what is in the answer field
    answerBlocks() {
        var answerBlocks = [];
        var children = this.answerArea.childNodes;
        for (var i = 0; i < children.length; i++) {
            var block = this.getBlockById(children[i].id);
            if (block !== undefined) {
                answerBlocks.push(block);
            }
        }
        return answerBlocks;
    }
    // Return array of enabled codeblocks based on what is in the answer field
    enabledAnswerBlocks() {
        var all = this.answerBlocks();
        var enabled = [];
        for (var i = 0; i < all.length; i++) {
            var block = all[i];
            if (block.enabled()) {
                enabled.push(block);
            }
        }
        return enabled;
    }
    // Return array of codelines based on what is in the answer field
    answerLines() {
        var answerLines = [];
        var blocks = this.answerBlocks();
        for (var i = 0; i < blocks.length; i++) {
            var block = blocks[i];
            if (!block.isPlaceholder) {
                // CodeTailor: adding non placeholder block
                for (var j = 0; j < block.lines.length; j++) {
                    answerLines.push(block.lines[j]);
                }
            }
        }
        return answerLines;
    }
    // Go up the hierarchy until you get to a block; return that block element
    getBlockFor(element) {
        var check = element;
        while (!check.classList.contains("block")) {
            check = check.parentElement;
        }
        return check;
    }
    // Return the maximum indent for the solution
    solutionIndent() {
        var indent = 0;
        for (var i = 0; i < this.blocks.length; i++) {
            var block = this.blocks[i];
            indent = Math.max(indent, block.solutionIndent());
        }
        return indent;
    }
    /* =====================================================================
    ==== ACTION ============================================================
    ===================================================================== */
    // The "Check Me" button was pressed.
    checkCurrentAnswer() {
        if (!this.hasSolved) {
            this.checkCount++;
            this.clearFeedback();
            if (this.adaptiveId == undefined) {
                this.adaptiveId = this.storageId;
            }
            // TODO - rendering feedback is buried in the grader.grade method.
            // to disable feedback set this.grader.showfeedback boolean
            this.grader.showfeedback = false;
            this.grade = this.grader.grade();
            if (this.grade == "correct") {
                this.hasSolved = true;
                this.correct = true;
                this.checkButton.disabled = true;
                // CodeTailor: make the Copy Answer button visible when the puzzle is solved
                if (this.hasSolved && this.options.scaffolding) {
                    const copyBtn = document.querySelector(
                        `#copy-answer-button-${this.divid}`,
                    ); // copy-answer-button-${puzzleScaffoldingDivid}
                    if (copyBtn) {
                        copyBtn.classList.remove("copy-button-hide");
                    }
                }
                localStorage.setItem(this.adaptiveId + "Solved", true);
                this.recentAttempts = this.checkCount;
                localStorage.setItem(
                    this.adaptiveId + "recentAttempts",
                    this.recentAttempts,
                );
            }
            localStorage.setItem(
                this.adaptiveId + this.divid + "Count",
                this.checkCount,
            );
            this.setLocalStorage();
            // if not solved and not too short then check if should provide help
            if (!this.hasSolved && this.grade !== "incorrectTooShort") {
                if (this.canHelp) {
                    // only count the attempt if the answer is different (to prevent gaming)
                    var answerHash = this.answerHash();
                    if (this.lastAnswerHash !== answerHash) {
                        this.numDistinct++;
                        this.lastAnswerHash = answerHash;
                    }
                    // if time to offer help
                    if (this.numDistinct == 3 && !this.gotHelp) {
                        this.pendingHelpMessage = (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_2__.t)("msg_parson_help_info");
                    } // end if
                } // end if can help
            } // end if not solved
        } // end outer if not solved

        // if now or previous was correct, display runnable
        if (this.hasSolved && this.options.runnable) {
            if (!this.runnableDiv)
                this.generateRunableVersion(); //reveal "reset" runnable
            else this.runnableDiv.style.display = null;
        }
    }

    // Conver the parsons-runnable into an activecode and display it
    generateRunableVersion() {
        this.runnableDiv = document.getElementById(this.divid + "-runnable");
        this.runnableDiv.style.display = null;

        let parsonsText = "";
        for (let b of this.answerBlocks()) {
            for (let l of b.lines) {
                parsonsText += "    ".repeat(l.indent) + l.text + "\n";
            }
        }
        parsonsText = parsonsText.slice(0, -1); // remove last newline

        const textEl = this.runnableDiv.querySelector("textarea");
        textEl.innerHTML = textEl.innerHTML.replace(
            "==PARSONSCODE==",
            parsonsText,
        );

        // data-component="parsons-runnable" marks it as waiting to be turned into an activecode
        const activeCodeToBe = this.runnableDiv.querySelector(
            '[data-component="parsons-runnable"]',
        );
        activeCodeToBe.dataset.component = "activecode";

        window.runestoneComponents.renderOneComponent(this.runnableDiv);
    }

    renderFeedback() {
        this.grader.showfeedback = true;
        this.grade = this.grader.graderState;
        var answerArea = this.answerArea;

        // When feedback is suppressed the messages are simply not written.
        var feedbackArea = this.showfeedback === true ? this.messageDiv : null;
        var setFeedback = (className, message) => {
            if (feedbackArea) {
                const helpMessage = this.pendingHelpMessage;
                this.pendingHelpMessage = undefined;
                this.showMessage(
                    helpMessage ? `${message} ${helpMessage}` : message,
                    className,
                );
            }
        };

        if (this.grade === "correct") {
            answerArea.classList.add("correct");
            this.messageDiv.style.visibility = "visible";
            let message =
                this.checkCount > 1
                    ? (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_2__.t)("msg_parson_correct", this.checkCount)
                    : (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_2__.t)("msg_parson_correct_first_try");
            if (this.options.runnable)
                message += " " + (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_2__.t)("msg_parson_correct_runnable");
            setFeedback("alert alert-info", message);
            // Show block explanations after solving
            this.showBlockExplanations();
        }

        if (this.grade === "incorrectTooShort") {
            // too little code
            answerArea.classList.add("incorrect");
            this.messageDiv.style.visibility = "visible";
            setFeedback("alert alert-danger", (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_2__.t)("msg_parson_too_short"));
        }

        if (this.grade === "incorrectIndent") {
            var incorrectBlocks = [];
            for (let i = 0; i < this.grader.indentLeft.length; i++) {
                block = this.grader.indentLeft[i].block();
                if (incorrectBlocks.indexOf(block) == -1) {
                    incorrectBlocks.push(block);
                    block.view.classList.add("indentLeft");
                }
            }
            for (let i = 0; i < this.grader.indentRight.length; i++) {
                block = this.grader.indentRight[i].block();
                if (incorrectBlocks.indexOf(block) == -1) {
                    incorrectBlocks.push(block);
                    block.view.classList.add("indentRight");
                }
            }
            this.messageDiv.style.visibility = "visible";
            setFeedback(
                "alert alert-danger",
                incorrectBlocks.length == 1
                    ? (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_2__.t)("msg_parson_wrong_indent")
                    : (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_2__.t)("msg_parson_wrong_indents"),
            );
        }

        if (this.grade === "incorrectMoveBlocks") {
            var answerBlocks = this.answerBlocks();
            var inSolution = [];
            var inSolutionIndexes = [];
            var notInSolution = [];
            for (let i = 0; i < answerBlocks.length; i++) {
                var block = answerBlocks[i];
                var index = this.solution.indexOf(block.lines[0]);
                if (index == -1) {
                    notInSolution.push(block);
                } else {
                    inSolution.push(block);
                    inSolutionIndexes.push(index);
                }
            }
            var lisIndexes = this.grader.inverseLISIndices(
                inSolutionIndexes,
                inSolution,
            );
            for (let i = 0; i < lisIndexes.length; i++) {
                notInSolution.push(inSolution[lisIndexes[i]]);
            }
            answerArea.classList.add("incorrect");
            this.messageDiv.style.visibility = "visible";
            if (this.showfeedback === true) {
                for (let i = 0; i < notInSolution.length; i++) {
                    notInSolution[i].view.classList.add("incorrectPosition");
                }
            }
            setFeedback("alert alert-danger", (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_2__.t)("msg_parson_wrong_order"));
        }

        this.updateBlockAriaLabels();
    }

    // Show explanations for blocks after the student solves the exercise
    // Uses the same tooltip mechanism as distractor help text (hover to see)
    showBlockExplanations() {
        if (
            !this.blockExplanations ||
            Object.keys(this.blockExplanations).length === 0
        ) {
            return;
        }
        this.hideBlockExplanations(); // clear any previous
        var answerBlocks = this.answerBlocks();
        for (var i = 0; i < answerBlocks.length; i++) {
            var block = answerBlocks[i];
            var blockIndex = block.lines[0].index;
            // The explanation map keys are block indices as they appear in the original source
            // Try matching by the block's first line index in the original order
            var explanation = this.blockExplanations[String(blockIndex)];
            if (!explanation) {
                // Also try by position in the answer area
                explanation = this.blockExplanations[String(i)];
            }
            if (explanation) {
                // Use the same tooltip approach as distractors:
                // set data-toggle="tooltip" and title attribute for hover display
                block.view.setAttribute("data-toggle", "tooltip");
                block.view.setAttribute("title", explanation);
                block.view.classList.add("has-explanation");
            }
        }
    }

    // Remove all block explanations (tooltip attributes)
    hideBlockExplanations() {
        for (const view of this.answerArea.querySelectorAll(
            ".has-explanation",
        )) {
            view.removeAttribute("data-toggle");
            view.removeAttribute("title");
            view.removeAttribute("data-original-title");
            view.classList.remove("has-explanation");
        }
    }

    /* =====================================================================
    ==== ADAPTIVE ==========================================================
    ===================================================================== */
    // Initialize this problem as adaptive
    //    helpCount = number of checks before help is given (negative)
    //    canHelp = boolean as to whether help can be provided
    //    checkCount = how many times it has been checked before correct
    //    userRating = 0..100 how good the person is at solving problems
    initializeAdaptive() {
        this.adaptiveId = super.localStorageKey();
        this.canHelp = true;
        //this.helpCount = -3; // Number of checks before help is offered
        this.checkCount = 0;
        this.numDistinct = 0; // number of distinct solution attempts (different from previous)
        this.gotHelp = false;
        // Initialize the userRating
        var storageProblem = localStorage.getItem(this.adaptiveId + "Problem");
        if (storageProblem == this.divid) {
            // Already in this problem
            this.checkCount = localStorage.getItem(
                this.adaptiveId + this.divid + "Count",
            );
            if (this.checkCount == undefined) {
                this.checkCount = 0;
            }
            return this;
        }
        var count = localStorage.getItem(
            this.adaptiveId + this.divid + "Count",
        );
        if (count == undefined || count == "NaN") {
            count = 0;
        }
        this.checkCount = count;
        this.recentAttempts = localStorage.getItem(
            this.adaptiveId + "recentAttempts",
        );
        if (this.recentAttempts == undefined || this.recentAttempts == "NaN") {
            this.recentAttempts = 3;
        }
        localStorage.setItem(
            this.adaptiveId + "recentAttempts",
            this.recentAttempts,
        );
        localStorage.setItem(this.adaptiveId + "Problem", this.divid);
        localStorage.setItem(
            this.adaptiveId + this.divid + "Count",
            this.checkCount,
        );
        localStorage.setItem(this.adaptiveId + "Solved", false);
    }
    // Return a boolean of whether the user must deal with indentation
    usesIndentation() {
        if (this.noindent || this.solutionIndent() == 0) {
            // was $(this.answerArea).hasClass("answer") - bje changed
            return false;
        } else {
            return true;
        }
    }
    // Find a distractor to remove to make the problem easier
    //  * try first in the answer area
    //  * if not, try the source area
    //  * if not, return undefined
    distractorToRemove() {
        var blocks = this.enabledAnswerBlocks();
        var block;
        for (let i = 0; i < blocks.length; i++) {
            block = blocks[i];
            if (block.isDistractor()) {
                return block;
            }
        }
        blocks = this.enabledSourceBlocks();
        for (let i = 0; i < blocks.length; i++) {
            block = blocks[i];
            if (block.isDistractor()) {
                return block;
            }
        }
        return undefined;
    }
    // Return the number of blocks that exist
    numberOfBlocks(fIncludeDistractors = true) {
        var numberOfBlocks = 0;
        for (var i = 0; i < this.blocks.length; i++) {
            if (
                this.blocks[i].enabled() &&
                (fIncludeDistractors || !this.blocks[i].isDistractor())
            ) {
                numberOfBlocks += 1;
            }
        }
        return numberOfBlocks;
    }
    // Remove this distractors to make the problem easier
    removeDistractor(block) {
        this.showMessage((0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_2__.t)("msg_parson_not_solution"));
        // Stop ability to select
        if (block.lines[0].distractHelptext) {
            block.view.setAttribute("data-toggle", "tooltip");
            block.view.setAttribute("title", block.lines[0].distractHelptext);
        }
        block.disable();
        // If in answer area, move to source area
        if (!block.inSourceArea()) {
            var sourceRect = this.sourceArea.getBoundingClientRect();
            var startX = block.pageXCenter() - 1;
            var startY = block.pageYCenter();
            var endX =
                sourceRect.left + window.pageXOffset + sourceRect.width / 2;
            var endY =
                sourceRect.top +
                window.pageYOffset +
                block.view.getBoundingClientRect().height / 2;
            var slideUnderBlock = block.slideUnderBlock();
            if (slideUnderBlock !== undefined) {
                endY +=
                    slideUnderBlock.view.getBoundingClientRect().height + 20;
                endY +=
                    parseInt(getComputedStyle(slideUnderBlock.view).top) || 0;
            }
            var that = this;
            block.view.style.borderColor = "var(--boxBorderColor, #000)";
            block.view.style.backgroundColor = "var(--background, #fff)";
            (0,_common_js_domutil_js__WEBPACK_IMPORTED_MODULE_3__.animate)(
                block.view,
                {
                    opacity: 1.0,
                },
                {
                    duration:
                        Math.sqrt(
                            Math.pow(endY - startY, 2) +
                                Math.pow(endX - startX, 2),
                        ) *
                            4 +
                        500,
                    start: function () {
                        that.moving = block;
                        that.movingX = startX;
                        that.movingY = startY;
                        that.updateView();
                    },
                    progress: function (a, p, c) {
                        that.movingX = startX * (1 - p) + endX * p;
                        that.movingY = startY * (1 - p) + endY * p;
                        that.updateView();
                    },
                    complete: function () {
                        delete that.moving;
                        delete that.movingX;
                        delete that.movingY;
                        that.updateView();
                        (0,_common_js_domutil_js__WEBPACK_IMPORTED_MODULE_3__.animate)(
                            block.view,
                            {
                                opacity: 0.3,
                                "border-color": "#d3d3d3",
                                "background-color": "#efefef",
                            },
                            {
                                duration: 1000,
                                complete: function () {
                                    block.view.style.opacity = "";
                                    block.view.style.borderColor = "";
                                    block.view.style.backgroundColor = "";
                                    block.view.classList.add("disabled");
                                },
                            },
                        );
                    },
                },
            );
        } else {
            block.view.style.borderColor = "var(--boxBorderColor, #000)";
            block.view.style.backgroundColor = "var(--background, #fff)";
            (0,_common_js_domutil_js__WEBPACK_IMPORTED_MODULE_3__.animate)(
                block.view,
                {
                    opacity: 0.3,
                    "border-color": "#d3d3d3",
                    "background-color": "#efefef",
                },
                {
                    duration: 2000,
                    complete: function () {
                        block.view.style.borderColor = "";
                        block.view.style.backgroundColor = "";
                    },
                },
            );
        }
    }
    // Give the user the indentation
    removeIndentation() {
        this.showMessage((0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_2__.t)("msg_parson_provided_indent"));
        // Move and resize blocks
        var blockWidth = 200;
        for (var i = 0; i < this.lines.length; i++) {
            var line = this.lines[i];
            var expandedWidth =
                line.width + line.indent * this.options.pixelsPerIndent + 30;
            blockWidth = Math.max(blockWidth, expandedWidth);
        }
        if (this.options.numbered != undefined) {
            blockWidth += 25;
        }
        this.areaWidth = blockWidth + 22;
        var block, indent;
        var sourceBlocks = this.sourceBlocks();
        for (let i = 0; i < sourceBlocks.length; i++) {
            block = sourceBlocks[i];
            indent = block.solutionIndent();
            if (indent == 0) {
                (0,_common_js_domutil_js__WEBPACK_IMPORTED_MODULE_3__.animate)(
                    block.view,
                    {
                        width: blockWidth,
                    },
                    {
                        duration: 1000,
                    },
                );
            } else {
                (0,_common_js_domutil_js__WEBPACK_IMPORTED_MODULE_3__.animate)(
                    block.view,
                    {
                        width:
                            blockWidth - indent * this.options.pixelsPerIndent,
                        "padding-left":
                            indent * this.options.pixelsPerIndent + 10,
                    },
                    {
                        duration: 1000,
                    },
                );
            }
        }
        for (let i = 0; i < this.pairedDivs.length; i++) {
            (0,_common_js_domutil_js__WEBPACK_IMPORTED_MODULE_3__.animate)(
                this.pairedDivs[i],
                {
                    width: blockWidth + 34,
                },
                {
                    duration: 1000,
                },
            );
        }
        var answerBlocks = this.answerBlocks();
        for (let i = 0; i < answerBlocks.length; i++) {
            block = answerBlocks[i];
            indent = block.solutionIndent();
            if (indent == 0) {
                (0,_common_js_domutil_js__WEBPACK_IMPORTED_MODULE_3__.animate)(
                    block.view,
                    {
                        left: 0,
                        width: blockWidth,
                    },
                    {
                        duration: 1000,
                    },
                );
            } else {
                (0,_common_js_domutil_js__WEBPACK_IMPORTED_MODULE_3__.animate)(
                    block.view,
                    {
                        left: 0,
                        width:
                            blockWidth - indent * this.options.pixelsPerIndent,
                        "padding-left":
                            indent * this.options.pixelsPerIndent + 10,
                    },
                    {
                        duration: 1000,
                    },
                );
            }
        }
        // Resize answer and source area
        this.answerArea.classList.remove(
            "answer1",
            "answer2",
            "answer3",
            "answer4",
        );
        this.answerArea.classList.add("answer");
        this.indent = 0;
        this.noindent = true;
        (0,_common_js_domutil_js__WEBPACK_IMPORTED_MODULE_3__.animate)(
            this.sourceArea,
            {
                width: this.areaWidth + 2,
            },
            {
                duration: 1000,
            },
        );
        (0,_common_js_domutil_js__WEBPACK_IMPORTED_MODULE_3__.animate)(
            this.answerArea,
            {
                width: this.areaWidth + 2,
            },
            {
                duration: 1000,
            },
        );
        // Change the model (with view) once the resize animations are done
        (0,_common_js_domutil_js__WEBPACK_IMPORTED_MODULE_3__.animate)(
            this.answerArea,
            {
                opacity: 1.0,
            },
            {
                duration: 1100,
                complete: function () {
                    // Update the model
                    for (let i = 0; i < sourceBlocks.length; i++) {
                        sourceBlocks[i].addIndent();
                    }
                    for (let i = 0; i < answerBlocks.length; i++) {
                        answerBlocks[i].addIndent();
                    }
                },
            },
        );
    }

    // first check if any solution blocks are in the source still (left side) and not
    // in the answer
    getSolutionBlockInSource() {
        var solutionBlocks = this.solutionBlocks();
        var answerBlocks = this.answerBlocks();
        var sourceBlocks = this.sourceBlocks();
        var solBlock = null;
        var currBlock = null;

        // loop through sourceBlocks and return a block if it is not in the solution
        for (var i = 0; i < sourceBlocks.length; i++) {
            // get the current block from the source
            currBlock = sourceBlocks[i];

            // if currBlock is in the solution and isn't the first block and isn't in the answer
            if (
                solutionBlocks.indexOf(currBlock) > 0 &&
                answerBlocks.indexOf(currBlock) < 0
            ) {
                return currBlock;
            }
        }
        // didn't find any block in the source that is in the solution
        return null;
    }

    // Find a block2 that is furthest from block1 in the answer
    // don't use the very first block in the solution as block2
    getFurthestBlock() {
        var solutionBlocks = this.solutionBlocks();
        var answerBlocks = this.answerBlocks();
        var maxDist = 0;
        var dist = 0;
        var maxBlock = null;
        var currBlock = null;
        var indexSol = 0;
        var prevBlock = null;
        var indexPrev = 0;

        // loop through the blocks in the answer
        for (var i = 0; i < answerBlocks.length; i++) {
            currBlock = answerBlocks[i];
            indexSol = solutionBlocks.indexOf(currBlock);
            if (indexSol > 0) {
                prevBlock = solutionBlocks[indexSol - 1];
                indexPrev = answerBlocks.indexOf(prevBlock);
                // calculate the distance in the answer
                dist = Math.abs(i - indexPrev);
                if (dist > maxDist) {
                    maxDist = dist;
                    maxBlock = currBlock;
                }
            }
        }
        return maxBlock;
    }

    // Combine blocks together
    combineBlocks() {
        var solutionBlocks = this.solutionBlocks();
        var answerBlocks = this.answerBlocks();
        var sourceBlocks = this.sourceBlocks();

        this.showMessage((0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_2__.t)("msg_parson_combined_blocks"));
        var block1 = null;
        var block2 = null;

        // get a solution block that is still in source (not answer), if any
        block2 = this.getSolutionBlockInSource();

        // if none in source get block that is furthest from block1
        if (block2 == null) {
            block2 = this.getFurthestBlock();
        }

        // get block1 (above block2) in solution
        var index = solutionBlocks.indexOf(block2);
        block1 = solutionBlocks[index - 1];

        // get index of each in answer
        var index1 = answerBlocks.indexOf(block1);
        var index2 = answerBlocks.indexOf(block2);
        var move = false;

        // if both in answer set move based on if directly above each other
        if (index1 >= 0 && index2 >= 0) {
            move = index1 + 1 !== index2;

            // else if both in source set move again based on if above each other
        } else if (index1 < 0 && index2 < 0) {
            index1 = sourceBlocks.indexOf(block1);
            index2 = sourceBlocks.indexOf(block2);
            move = index1 + 1 !== index2;

            // one in source and one in answer so must move
        } else {
            move = true;
            if (index1 < 0) {
                index1 = sourceBlocks.indexOf(block1);
            }
            if (index2 < 0) {
                index2 = sourceBlocks.indexOf(block2);
            }
        }

        var subtract = index2 < index1; // is block2 higher

        if (move) {
            // Move the block
            var startX = block2.pageXCenter() - 1;
            var startY = block2.pageYCenter();
            var endX = block1.pageXCenter() - 1;
            var endY =
                block1.pageYCenter() +
                block1.view.getBoundingClientRect().height / 2 +
                5;
            if (subtract) {
                endY -= block2.view.getBoundingClientRect().height / 2;
            } else {
                endY += block2.view.getBoundingClientRect().height / 2;
            }
            var that = this;
            (0,_common_js_domutil_js__WEBPACK_IMPORTED_MODULE_3__.animate)(
                block2.view,
                {
                    opacity: 1,
                },
                {
                    duration: 1000, // 1 seccond
                    start: function () {
                        block1.view.style.borderColor =
                            "var(--boxBorderColor, #000)";
                        block1.view.style.backgroundColor =
                            "var(--background, #fff)";
                        block2.view.style.borderColor =
                            "var(--boxBorderColor, #000)";
                        block2.view.style.backgroundColor =
                            "var(--background, #fff)";
                        block2.lines[0].index += 1000;
                        that.moving = block2;
                        that.movingX = startX;
                        that.movingY = startY;
                        that.updateView();
                    },
                    progress: function (a, p, c) {
                        that.movingX = startX * (1 - p) + endX * p;
                        that.movingY = startY * (1 - p) + endY * p;
                        that.updateView();
                    },
                    complete: function () {
                        delete that.moving;
                        delete that.movingX;
                        delete that.movingY;
                        that.updateView();
                        block2.lines[0].index -= 1000;
                        block1.consumeBlock(block2);
                        (0,_common_js_domutil_js__WEBPACK_IMPORTED_MODULE_3__.animate)(
                            block1.view,
                            {
                                "border-color": "#d3d3d3",
                                "background-color": "#efefef",
                            },
                            {
                                duration: 1000,
                                complete: function () {
                                    block1.view.style.borderColor = "";
                                    block1.view.style.backgroundColor = "";
                                },
                            },
                        );
                    },
                },
            );
        } else {
            (0,_common_js_domutil_js__WEBPACK_IMPORTED_MODULE_3__.animate)(
                block2.view,
                {
                    opacity: 1,
                },
                {
                    duration: 1000,
                    start: function () {
                        block1.view.style.borderColor =
                            "var(--boxBorderColor, #000)";
                        block1.view.style.backgroundColor =
                            "var(--background, #fff)";
                        block2.view.style.borderColor =
                            "var(--boxBorderColor, #000)";
                        block2.view.style.backgroundColor =
                            "var(--background, #fff)";
                    },
                    complete: function () {
                        block1.consumeBlock(block2);
                        (0,_common_js_domutil_js__WEBPACK_IMPORTED_MODULE_3__.animate)(
                            block1.view,
                            {
                                "border-color": "#d3d3d3",
                                "background-color": "#efefef",
                            },
                            {
                                duration: 1000,
                                complete: function () {
                                    block1.view.style.borderColor = "";
                                    block1.view.style.backgroundColor = "";
                                },
                            },
                        );
                    },
                },
            );
        }
    }
    // Adapt the problem to be easier
    //  * remove a distractor until none are present
    //  * combine blocks until 3 are left
    makeEasier() {
        var distractorToRemove = this.distractorToRemove();
        if (
            distractorToRemove !== undefined &&
            !distractorToRemove.inSourceArea()
        ) {
            this.removeDistractor(distractorToRemove);
            this.logMove("removedDistractor-" + distractorToRemove.hash());
        } else {
            var numberOfBlocks = this.numberOfBlocks(false);
            if (numberOfBlocks > 3) {
                this.combineBlocks();
                this.logMove("combinedBlocks");
            } else {
                this.showMessage((0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_2__.t)("msg_parson_three_blocks_left"));
                this.canHelp = false;
            }
            //if (numberOfBlocks < 5) {
            //	this.canHelp = false;
            //	this.helpButton.disabled = true;
            //}
        }
    }
    // The "Help Me" button was pressed and the problem should be simplified
    helpMe() {
        this.clearFeedback();
        //this.helpCount = -1; // amount to allow for multiple helps in a row
        //if (this.helpCount < 0) {
        //	this.helpCount = Math.max(this.helpCount, -1); // min 1 attempt before more help
        //this.helpButton.disabled = true;
        //}
        // if less than 3 attempts
        if (this.numDistinct < 3) {
            this.showMessage((0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_2__.t)("msg_parson_atleast_three_attempts"));
        }
        // otherwise give help
        else {
            this.gotHelp = true;
            this.makeEasier();
        }
    }
    /* =====================================================================
    ==== UTILITY ===========================================================
    ===================================================================== */
    // Return a date from a timestamp (either mySQL or JS format)
    dateFromTimestamp(timestamp) {
        var date = new Date(timestamp);
        if (isNaN(date.getTime())) {
            var t = timestamp.split(/[- :]/);
            date = new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5]);
        }
        return date;
    }
    // A function for returning a shuffled version of an array
    shuffled(array) {
        var currentIndex = array.length;
        var returnArray = array.slice();
        var temporaryValue, randomIndex;
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            // And swap it with the current element.
            temporaryValue = returnArray[currentIndex];
            returnArray[currentIndex] = returnArray[randomIndex];
            returnArray[randomIndex] = temporaryValue;
        }
        return returnArray;
    }
    /* =====================================================================
    ==== KEYBOARD INTERACTION ==============================================
    ===================================================================== */
    // When the user has entered the Parsons problem via keyboard mode
    enterKeyboardMode() {
        this.keyboardTip.innerHTML = (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_2__.t)("msg_parson_arrow_navigate");
        this.keyboardTip.style.display = "";
        // The ongoing navigation tip is a quiet instruction, not a call to act.
        this.keyboardTip.classList.remove("parsons-entry-hint");
        this.sourceLabel.style.display = "none";
        this.answerLabel.style.display = "none";
    }
    startKeyboardInteraction() {
        if (this.keyboardInputActive) {
            return;
        }
        const block =
            this.enabledAnswerBlocks().find((item) =>
                this.isIncorrectBlock(item),
            ) ||
            this.enabledSourceBlocks()[0] ||
            this.enabledAnswerBlocks()[0];
        if (!block) {
            return;
        }
        this.enterKeyboardMode();
        this.textFocus = block;
        this.textMove = false;
        block.makeTabIndex();
        block.view.classList.add("down");
        this.enterKeyboardNavigationMode(block, true);
    }

    enterKeyboardNavigationMode(block, includeInstructions = false) {
        this.keyboardInputActive = true;
        const label = [
            (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_2__.t)("msg_parson_keyboard_selected", this.getBlockLabel(block)),
        ];
        if (this.isIncorrectBlock(block)) {
            label.push((0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_2__.t)("msg_parson_incorrect"));
        }
        label.push(this.getKeyboardBlockLocation(block));
        this.keyboardApplication.setAttribute(
            "aria-label",
            includeInstructions
                ? (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_2__.t)("msg_parson_keyboard_instructions") + " " + label.join(". ")
                : label.join(". "),
        );
        this.keyboardApplication.focus();
    }

    enterKeyboardMovementMode(block) {
        this.keyboardMovementMode = true;
        this.keyboardInputActive = true;
        this.keyboardApplication.setAttribute(
            "aria-label",
            this.getKeyboardBlockLocation(block),
        );
        this.keyboardApplication.focus();
    }

    exitKeyboardMovementMode() {
        this.keyboardMovementMode = false;
        if (this.textFocus) {
            this.enterKeyboardNavigationMode(this.textFocus);
        }
    }

    cancelKeyboardMovement(returnFocusToEntry = false) {
        const block = this.textFocus;
        this.keyboardMovementMode = false;
        this.keyboardInputActive = false;
        this.textMove = false;
        this.textMoving = false;
        if (block) {
            block.view.classList.remove("down", "up");
        }
        this.textFocus = undefined;
        this.exitKeyboardMode();
        if (returnFocusToEntry) {
            this.sortContainerDiv.focus();
        }
    }

    selectKeyboardBlock(block) {
        const previousBlock = this.textFocus;
        if (previousBlock && previousBlock !== block) {
            previousBlock.view.classList.remove("down", "up");
        }
        this.textFocus = block;
        this.textMove = false;
        block.makeTabIndex();
        block.view.classList.add("down");
        this.enterKeyboardNavigationMode(block);
    }

    exitKeyboardModeForTab() {
        this.cancelKeyboardMovement();
    }

    handleKeyboardMovementKeydown(event) {
        if (!this.keyboardInputActive || !this.textFocus) {
            return;
        }
        const block = this.textFocus;
        const wasMoving = this.textMove;
        const previousParent = block.view.parentElement;
        const previousIndex = Array.prototype.indexOf.call(
            previousParent.children,
            block.view,
        );
        const previousIndent = block.indent;
        switch (event.key) {
            case "Tab":
                this.exitKeyboardModeForTab();
                return;
            case "ArrowLeft":
                this.textMove ? block.moveLeft() : block.selectLeft();
                break;
            case "ArrowUp":
                this.textMove ? block.moveUp() : block.selectUp();
                break;
            case "ArrowRight":
                this.textMove ? block.moveRight() : block.selectRight();
                break;
            case "ArrowDown":
                this.textMove ? block.moveDown() : block.selectDown();
                break;
            case "Enter":
            case " ":
                block.toggleMove();
                if (!this.textMove) {
                    this.exitKeyboardMovementMode();
                }
                event.preventDefault();
                event.stopPropagation?.();
                return;
            case "Escape":
            case "Esc":
                this.cancelKeyboardMovement(true);
                event.preventDefault();
                event.stopPropagation?.();
                return;
            default:
                return;
        }
        event.preventDefault();
        event.stopPropagation?.();
        this.textMoving = false;
        const placementChanged =
            wasMoving &&
            (block.view.parentElement !== previousParent ||
                block.indent !== previousIndent ||
                Array.prototype.indexOf.call(
                    block.view.parentElement.children,
                    block.view,
                ) !== previousIndex);
        if (placementChanged) {
            this.clearFeedback();
        }
        if (this.textMove) {
            this.enterKeyboardMovementMode(block);
        } else {
            this.keyboardApplication.focus();
        }
    }

    // When the user leaves the Parsons problem via keyboard mode
    exitKeyboardMode() {
        this.keyboardApplication.removeAttribute("aria-label");
        this.sortContainerDiv.setAttribute(
            "aria-label",
            (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_2__.t)("msg_parson_keyboard_entry_label"),
        );
        this.hideKeyboardEntryHint();
    }
    /* =====================================================================
    ==== VIEW ==============================================================
    ===================================================================== */
    // Clear any feedback from the answer area
    clearFeedback() {
        this.answerArea.classList.remove("incorrect", "correct");
        var children = this.answerArea.children;
        for (var i = 0; i < children.length; i++) {
            children[i].classList.remove(
                "correctPosition",
                "incorrectPosition",
                "indentLeft",
                "indentRight",
            );
        }
        this.messageDiv.style.visibility = "hidden";
        this.pendingHelpMessage = undefined;
        this.hideBlockExplanations();
        this.updateBlockAriaLabels();
    }
    // Disable the interface
    async disableInteraction() {
        // Disable blocks
        await this.checkServerComplete;
        console.log("disabling blocks");
        if (this.blocks !== undefined) {
            for (var i = 0; i < this.blocks.length; i++) {
                var block = this.blocks[i];
                block.disable();
            }
        }
        // Hide buttons
        this.checkButton.style.display = "none";
        this.resetButton.style.display = "none";
    }
    // Based on the moving element, etc., establish the moving state
    //   rest: not moving
    //   source: moving inside source area
    //   answer: moving inside answer area
    //   moving: moving outside areas
    movingState() {
        if (this.moving == undefined) {
            return "rest";
        }
        var x = this.movingX - window.pageXOffset;
        var y = this.movingY - window.pageYOffset;
        // Check if in answer area
        var bounds = this.answerArea.getBoundingClientRect();
        if (
            x >= bounds.left &&
            x <= bounds.right &&
            y >= bounds.top &&
            y <= bounds.bottom
        ) {
            return "answer";
        }
        // Check if in source area
        bounds = this.sourceArea.getBoundingClientRect();
        if (
            x >= bounds.left &&
            x <= bounds.right &&
            y >= bounds.top &&
            y <= bounds.bottom
        ) {
            return "source";
        }
        return "moving";
    }
    // Absolutely position a block or indicator view inside its area
    placeView(el, left, top, width, zIndex) {
        el.style.left = left + "px";
        el.style.top = top + "px";
        el.style.width = width + "px";
        el.style.zIndex = zIndex;
    }
    // Update the Parsons view
    // This gets called when dragging a block
    updateView() {
        // Based on the new and the old state, figure out what to update
        var state = this.state;
        var newState = this.movingState();
        var updateSource = true;
        var updateAnswer = true;
        var updateMoving = newState == "moving";
        if (state == newState) {
            if (newState == "rest") {
                updateSource = false;
                updateAnswer = false;
            } else if (newState == "source") {
                updateAnswer = false;
            } else if (newState == "answer") {
                updateSource = false;
            } else if (newState == "moving") {
                updateAnswer = false;
                updateSource = false;
            }
        }
        var movingHeight;
        if (this.moving !== undefined) {
            // Must get height here as detached items don't have height
            movingHeight = (0,_common_js_domutil_js__WEBPACK_IMPORTED_MODULE_3__.outerHeight)(this.moving.view);
            this.moving.view.remove();
        }
        var positionTop, width;
        var baseWidth = this.areaWidth - 22;
        // Update the Source Area
        if (updateSource) {
            positionTop = 0;
            var blocks = this.sourceBlocks();
            if (newState == "source") {
                var hasInserted = false;
                var movingBin = this.moving.pairedBin();
                var binForBlock = [];
                for (i = 0; i < blocks.length; i++) {
                    binForBlock.push(blocks[i].pairedBin());
                }
                if (!binForBlock.includes(movingBin)) {
                    movingBin = -1;
                }
                var insertPositions = [];
                if (binForBlock.length == 0) {
                    insertPositions.push(0);
                } else {
                    if (movingBin == -1) {
                        insertPositions.push(0);
                    } else if (binForBlock[0] == movingBin) {
                        insertPositions.push(0);
                    }
                    for (i = 1; i < blocks.length; i++) {
                        if (binForBlock[i - 1] == movingBin) {
                            insertPositions.push(i);
                        } else if (binForBlock[i] == movingBin) {
                            insertPositions.push(i);
                        } else if (
                            movingBin == -1 &&
                            binForBlock[i - 1] != binForBlock[i]
                        ) {
                            insertPositions.push(i);
                        }
                    }
                    if (movingBin == -1) {
                        insertPositions.push(binForBlock.length);
                    } else if (
                        binForBlock[binForBlock.length - 1] == movingBin
                    ) {
                        insertPositions.push(binForBlock.length);
                    }
                }
                var x =
                    this.movingX -
                    this.sourceArea.getBoundingClientRect().left -
                    window.pageXOffset -
                    baseWidth / 2 -
                    11;
                var y =
                    this.movingY -
                    this.sourceArea.getBoundingClientRect().top -
                    window.pageYOffset;
                for (i = 0; i < blocks.length; i++) {
                    var item = blocks[i];
                    var j;
                    if (!hasInserted && insertPositions.includes(i)) {
                        var testHeight = (0,_common_js_domutil_js__WEBPACK_IMPORTED_MODULE_3__.outerHeight)(item.view);
                        for (j = i + 1; j < blocks.length; j++) {
                            if (insertPositions.includes(j)) {
                                break;
                            }
                            testHeight += (0,_common_js_domutil_js__WEBPACK_IMPORTED_MODULE_3__.outerHeight)(blocks[j].view);
                        }
                        if (
                            y - positionTop < movingHeight + testHeight / 2 ||
                            i == insertPositions[insertPositions.length - 1]
                        ) {
                            hasInserted = true;
                            this.sourceArea.insertBefore(
                                this.moving.view,
                                item.view,
                            );
                            this.placeView(
                                this.moving.view,
                                x,
                                y - movingHeight / 2,
                                baseWidth,
                                3,
                            );
                            positionTop = positionTop + movingHeight;
                        }
                    }
                    this.placeView(item.view, 0, positionTop, baseWidth, 2);
                    positionTop = positionTop + (0,_common_js_domutil_js__WEBPACK_IMPORTED_MODULE_3__.outerHeight)(item.view);
                }
                if (!hasInserted) {
                    this.sourceArea.appendChild(this.moving.view);
                    this.placeView(
                        this.moving.view,
                        x,
                        y - (0,_common_js_domutil_js__WEBPACK_IMPORTED_MODULE_3__.outerHeight)(this.moving.view) / 2,
                        baseWidth,
                        3,
                    );
                }
            } else {
                for (var i = 0; i < blocks.length; i++) {
                    item = blocks[i];
                    this.placeView(item.view, 0, positionTop, baseWidth, 2);
                    positionTop = positionTop + (0,_common_js_domutil_js__WEBPACK_IMPORTED_MODULE_3__.outerHeight)(item.view);
                }
            }
            // Update the Paired Distractor Indicators
            for (i = 0; i < this.pairedBins.length; i++) {
                var bin = this.pairedBins[i];
                var matching = [];
                for (j = 0; j < blocks.length; j++) {
                    block = blocks[j];
                    if (block.matchesBin(bin)) {
                        matching.push(block);
                    }
                }
                var div = this.pairedDivs[i];
                if (matching.length == 0) {
                    div.style.display = "none";
                } else {
                    div.style.display = "";
                    var height = -5;
                    var lastView = matching[matching.length - 1].view;
                    height += parseInt(getComputedStyle(lastView).top);
                    height -= parseInt(getComputedStyle(matching[0].view).top);
                    height += (0,_common_js_domutil_js__WEBPACK_IMPORTED_MODULE_3__.outerHeight)(lastView);
                    div.style.left = "-6px";
                    div.style.top = getComputedStyle(matching[0].view).top;
                    div.style.width = baseWidth + 34 + "px";
                    div.style.height = height + "px";
                    div.style.zIndex = 1;
                    div.style.textIndent = "-30px";
                    div.style.paddingTop = (height - 70) / 2 + "px";
                    div.style.overflow = "visible";
                    div.style.fontSize = "43px";
                    div.style.verticalAlign = "middle";
                    div.style.color = "var(--parsonsLabelColor, #5858e0)";
                    div.innerHTML =
                        "<span id= 'st' style = 'vertical-align: middle; font-weight: bold; font-size: 15px'>or</span>{";
                }
                if (matching.length == 1) {
                    div.innerHTML = "";
                }
            }
        }
        // Update the Answer Area
        if (updateAnswer) {
            var block, indent;
            positionTop = 0;
            width =
                this.areaWidth +
                this.indent * this.options.pixelsPerIndent -
                22;
            var blocks = this.answerBlocks();
            if (newState == "answer") {
                var hasInserted = false;
                var x =
                    this.movingX -
                    this.answerArea.getBoundingClientRect().left -
                    window.pageXOffset -
                    baseWidth / 2 -
                    11;
                var movingIndent = Math.round(x / this.options.pixelsPerIndent);
                if (movingIndent < 0) {
                    movingIndent = 0;
                } else if (movingIndent > this.indent) {
                    movingIndent = this.indent;
                } else {
                    x = movingIndent * this.options.pixelsPerIndent;
                }
                var y =
                    this.movingY -
                    this.answerArea.getBoundingClientRect().top -
                    window.pageYOffset;
                this.moving.indent = movingIndent;
                for (i = 0; i < blocks.length; i++) {
                    block = blocks[i];
                    if (!hasInserted) {
                        if (
                            y - positionTop <
                            (movingHeight + (0,_common_js_domutil_js__WEBPACK_IMPORTED_MODULE_3__.outerHeight)(block.view)) / 2
                        ) {
                            hasInserted = true;
                            this.answerArea.insertBefore(
                                this.moving.view,
                                block.view,
                            );
                            this.placeView(
                                this.moving.view,
                                x,
                                y - movingHeight / 2,
                                baseWidth,
                                3,
                            );
                            positionTop = positionTop + movingHeight;
                        }
                    }
                    indent = block.indent * this.options.pixelsPerIndent;
                    this.placeView(
                        block.view,
                        indent,
                        positionTop,
                        width - indent,
                        2,
                    );
                    positionTop = positionTop + (0,_common_js_domutil_js__WEBPACK_IMPORTED_MODULE_3__.outerHeight)(block.view);
                }
                if (!hasInserted) {
                    this.answerArea.appendChild(this.moving.view);
                    this.placeView(
                        this.moving.view,
                        x,
                        y - (0,_common_js_domutil_js__WEBPACK_IMPORTED_MODULE_3__.outerHeight)(this.moving.view) / 2,
                        baseWidth,
                        3,
                    );
                }
            } else {
                for (let i = 0; i < blocks.length; i++) {
                    block = blocks[i];
                    indent = block.indent * this.options.pixelsPerIndent;
                    this.placeView(
                        block.view,
                        indent,
                        positionTop,
                        width - indent,
                        2,
                    );
                    positionTop = positionTop + (0,_common_js_domutil_js__WEBPACK_IMPORTED_MODULE_3__.outerHeight)(block.view);
                }
            }
        }
        // Update the Moving Area
        if (updateMoving) {
            // Add it to the lowest place in the source area
            movingBin = this.moving.pairedBin();
            if (movingBin == -1) {
                this.sourceArea.appendChild(this.moving.view);
            } else {
                var before;
                blocks = this.sourceBlocks;
                for (i = 0; i < blocks.length; i++) {
                    block = blocks[i];
                    if (block.pairedBin() == movingBin) {
                        before = i + 1;
                    }
                }
                if (before == undefined || before == blocks.length) {
                    this.sourceArea.appendChild(this.moving.view);
                } else {
                    this.sourceArea.insertBefore(
                        this.moving.view,
                        blocks[before].view,
                    );
                }
            }
            // Place in the middle of the mouse cursor
            this.placeView(
                this.moving.view,
                this.movingX -
                    this.sourceArea.getBoundingClientRect().left -
                    window.pageXOffset -
                    (0,_common_js_domutil_js__WEBPACK_IMPORTED_MODULE_3__.outerWidth)(this.moving.view) / 2,
                this.movingY -
                    this.sourceArea.getBoundingClientRect().top -
                    window.pageYOffset -
                    movingHeight / 2,
                baseWidth,
                3,
            );
        }
        state = newState;
        this.state = state;
    }
    addBlockLabels(blocks) {
        var bin = -1;
        var binCount = 0;
        var binChildren = 0;
        var blocksNotInBins = 0;
        for (let i = 0; i < blocks.length; i++) {
            if (blocks[i].pairedBin() == -1) {
                blocksNotInBins++;
            }
        }
        for (let i = 0; i < blocks.length; i++) {
            var currentBin = blocks[i].pairedBin();
            if (currentBin == -1 || currentBin != bin) {
                bin = currentBin;
                binChildren = 0;
                binCount++;
            }
            var label =
                "" +
                binCount +
                (currentBin != -1
                    ? String.fromCharCode(97 + binChildren)
                    : " ");
            if (
                binCount < 10 &&
                blocksNotInBins + this.pairedBins.length >= 10
            ) {
                label += " ";
            }
            blocks[i].addLabel(label, 0);
            binChildren++;
        }
        if (blocksNotInBins + this.pairedBins.length >= 10) {
            this.areaWidth += 5;
            this.sourceArea.style.width =
                (parseFloat(getComputedStyle(this.sourceArea).width) || 0) +
                5 +
                "px";
            this.answerArea.style.width =
                (parseFloat(getComputedStyle(this.answerArea).width) || 0) +
                5 +
                "px";
        }
    }
    // Put all the blocks back into the source area, reshuffling as necessary
    async resetView() {
        // Clear everything
        this.clearFeedback();
        // CodeTailor: Hide the Copy Answer Button again
        if (this.options.scaffolding === true) {
            const copyBtn = document.querySelector(
                `#copy-answer-button-${this.divid}`,
            ); // copy-answer-button-${puzzleScaffoldingDivid}
            if (copyBtn) {
                copyBtn.classList.add("copy-button-hide");
            }
        }
        var scrollTop = document.body.scrollTop;
        var block;
        for (let i = 0; i < this.blocks.length; i++) {
            block = this.blocks[i];
            for (var j = 0; j < block.lines.length; j++) {
                var children =
                    block.lines[j].view.querySelectorAll(".block-label");
                for (var c = 0; c < children.length; c++) {
                    children[c].remove();
                }
            }
            block.destroy();
            this.blocks[i].view.remove();
        }
        delete this.blocks;
        this.blockIndex = 0;
        if (this.pairedDivs) {
            for (let i = 0; i < this.pairedDivs.length; i++) {
                this.pairedDivs[i].remove();
            }
        }
        this.sourceArea.setAttribute("style", "");
        this.answerArea.className = "";
        this.answerArea.setAttribute("style", "");
        this.noindent = this.options.noindent;
        // Reinitialize
        if (this.hasSolved) {
            this.checkCount = 0;
            this.numDistinct = 0;
            this.hasSolved = false;
            if (this.options.adaptive) {
                this.canHelp = true;
            }
            //this.helpCount = -3; // enable after 3 failed attempts
            //this.helpButton.disabled = true;
            localStorage.setItem(this.adaptiveId + "Problem", this.divid);
            localStorage.setItem(
                this.adaptiveId + this.divid + "Count",
                this.checkCount,
            );
            localStorage.setItem(this.adaptiveId + "Solved", false);
        }
        if (this.options.scaffolding === true) {
            // CodeTailor: initialize the pre-placed Parsons blocks including the settled blocks, if any.
            await this.initializeAreas(
                this.blocksFromSource(),
                this.settledBlocksFromSource(),
                {},
            );
        } else {
            await this.initializeAreas(this.blocksFromSource(), [], {});
        }
        this.initializeInteractivity();
        document.body.scrollTop = scrollTop;
        if (this.runnableDiv) {
            // hide the rendered runnable - will get reused as is if rerevealed
            this.runnableDiv.style.display = "none";
        }
    }
}

Parsons.counter = 0;

document.addEventListener("runestone:login-complete", function () {
    for (const el of document.querySelectorAll("[data-component=parsons]")) {
        if (el.closest("[data-component=timedAssessment]") === null) {
            try {
                window.componentMap[el.id] = new Parsons({
                    orig: el,
                    useRunestoneServices: eBookConfig.useRunestoneServices,
                });
            } catch (err) {
                console.log(`Error rendering Parsons Problem ${el.id}
                             Details: ${err}`);
                console.log(err.stack);
            }
        }
    }
});


/***/ }),

/***/ 23405:
/*!**********************************************!*\
  !*** ./runestone/parsons/js/timedparsons.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TimedParsons)
/* harmony export */ });
/* harmony import */ var _parsons__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./parsons */ 8354);


class TimedParsons extends _parsons__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(opts) {
        super(opts);
        // todo -- make this configurable
        if (opts.timedfeedback) {
            this.showfeedback = true;
        } else {
            this.showfeedback = false;
        }
        this.grader.showfeedback = this.showfeedback;
        this.hideFeedback();
        this.checkButton.style.display = "none";
        if (this.helpButton) {
            this.helpButton.style.display = "none";
        }
        this.resetButton.style.display = "none";
    }
    checkCorrectTimed() {
        return this.correct ? "T" : "F";
    }
    hideFeedback() {
        this.messageDiv.style.display = "none";
    }
}

if (typeof window.component_factory === "undefined") {
    window.component_factory = {};
}
window.component_factory["parsons"] = function (opts) {
    if (opts.timed) {
        return new TimedParsons(opts);
    }
    return new _parsons__WEBPACK_IMPORTED_MODULE_0__["default"](opts);
};


/***/ }),

/***/ 25888:
/*!**********************************************!*\
  !*** ./runestone/parsons/js/settledBlock.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SettledBlock)
/* harmony export */ });
/* harmony import */ var _parsonsBlock__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./parsonsBlock */ 44065);


class SettledBlock extends _parsonsBlock__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(problem, lines) {
        // problem: Parsons instance
        // lines: lines inside the block
        super(problem, lines);

        this.isSettled = true;
        //update its indent to follow the indentation of the lines inside

        // add a css class
        this.view.classList.add("settled-block", "disabled");

        this.tooltipSpan = document.createElement("span");
        this.tooltipSpan.classList.add("settled-tooltip");
        this.view.append(this.tooltipSpan);
        this.tooltipSpan.textContent = "OK";
    }

    setBlocksBefore(num) {
        this.blocksBefore = num;
        var beforePlural = num > 1 ? "s" : "";
        if (this.blocksAfter) {
            var afterPlural = this.blocksAfter > 1 ? "s" : "";
            this.tooltipSpan.innerHTML = `${num} block${beforePlural} ⬆️️), ${this.blocksAfter} block${afterPlural} ⬇️`;
        } else {
            this.tooltipSpan.innerHTML = `${num} block${beforePlural} ⬆️️`;
        }
    }

    setBlocksAfter(num) {
        this.blocksAfter = num;
        var afterPlural = num > 1 ? "s" : "";
        if (this.blocksBefore) {
            var beforePlural = this.blocksBefore > 1 ? "s" : "";
            this.tooltipSpan.innerHTML = `${this.blocksBefore} block${beforePlural} ⬆️, ${num} block${afterPlural} ⬇️`;
        } else {
            this.tooltipSpan.innerHTML = `${num} block${afterPlural} ️️⬇️`;
        }
    }
}


/***/ }),

/***/ 33760:
/*!*********************************************!*\
  !*** ./runestone/parsons/js/parsonsLine.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ParsonsLine)
/* harmony export */ });
/* harmony import */ var _common_js_domutil_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/domutil.js */ 34089);
/* =====================================================================
==== ParsonsLine Object ================================================
======== The model and view of a line of code.
======== Based on what is specified in the problem.
======== ParsonBlock objects have one or more of these.
==== PROPERTIES ========================================================
======== problem: the Parsons problem
======== index: the index of the line in the problem
======== text: the text of the code line
======== indent: the indent level
======== view: an element for viewing this object
======== distractor: whether it is a distractor
======== paired: whether it is a paired distractor
======== groupWithNext: whether it is grouped with the following line
======== width: the pixel width when rendered
============ in the initial grouping
===================================================================== */
// Initialize from codestring



class ParsonsLine {
    constructor(problem, codestring, displaymath) {
        this.problem = problem;
        this.index = problem.lines.length;
        // removes trailing whitespace
        var trimmed = codestring.replace(/\s*$/, "");
        // CodeTailor: Actions are required only if the puzzle well be served as scaffolding puzzle in CodeTailor
        // So here we use problem.options.scaffolding to determine if the puzzle is a scaffolding puzzle
        if (this.problem.options.scaffolding === true) {
            function hasTopLevelClass(lines) {
                return lines.some(
                    ({ text }) =>
                        text.trimStart().toLowerCase().startsWith("class "), // now check for “class ” at position 0
                );
            }
            if (this.problem.noindent) {
                this.text = trimmed;
            } else {
                // remove any leading whitespace
                this.text = trimmed.replace(/^\s*/, "");
            }

            if (this.problem.options.language == "java") {
                this.text = this.text.replace(/\t/g, "    ");
                if (this.text.toLowerCase().startsWith("public class")) {
                    this.indent = 0; // Set indent to 0 for class start
                } else {
                    this.indent = trimmed.length - this.text.length; // Calculate normal indentation
                }
            } else {
                const allLines = this.problem.lines;
                // put indentation of import line as 0
                if (this.text.toLowerCase().startsWith("import")) {
                    this.indent = 0;
                }

                // Check if the line is a class definition - if so, then do not set up indentation of def line as 0
                if (hasTopLevelClass(allLines)) {
                    if (this.text.toLowerCase().startsWith("class")) {
                        this.indent = 0; // Set indent to 0 for class start
                    } else {
                        this.indent = trimmed.length - this.text.length; // Calculate normal indentation
                    }
                } else {
                    // Check if the line is a function definition - if so, then set up indentation of def line as 0
                    if (this.text.toLowerCase().startsWith("def")) {
                        this.indent = 0; // Set indent to 0 for def start
                    } else {
                        this.indent = trimmed.length - this.text.length; // Calculate normal indentation
                    }
                }
            }
        } else {
            this.text = trimmed.replace(/^\s*/, "");
            this.indent = trimmed.length - this.text.length;
        }
        // Create the View
        var view;
        // TODO: this does not work with display math... Perhaps with pretext we should have html as a language and do nothing?

        if (
            problem.options.language == "natural" ||
            problem.options.language == "math" ||
            problem.options.language == "text"
        ) {
            if (!displaymath) {
                view = document.createElement("p");
            } else {
                view = document.createElement("div");
            }
        } else {
            view = document.createElement("code");
            if (problem.options.prettifyLanguage) {
                view.classList.add(
                    ...problem.options.prettifyLanguage.split(" "),
                );
            }
        }
        view.id = problem.counterId + "-line-" + this.index;
        view.innerHTML += this.text;
        this.view = view;
        problem.lines.push(this);
    }
    // Initialize what width the line would naturally have (without indent)
    initializeWidth() {
        // this.width does not appear to be used anywhere later
        // since changing the value of this.width appears to have no effect. - Vincent Qiu (September 2020)
        this.width =
            (0,_common_js_domutil_js__WEBPACK_IMPORTED_MODULE_0__.outerWidth)(this.view) -
            this.problem.options.pixelsPerIndent * this.indent;

        // Pass this information on to be used in class Parsons function initializeAreas
        // to manually determine appropriate widths - Vincent Qiu (September 2020)
        this.view.fontSize = window
            .getComputedStyle(this.view, null)
            .getPropertyValue("font-size");
        this.view.pixelsPerIndent = this.problem.options.pixelsPerIndent;
        this.view.indent = this.indent;

        // Figure out which typeface will be rendered by comparing text widths to browser default - Vincent Qiu (September 2020)
        var tempCanvas = document.createElement("canvas");
        var tempCanvasCtx = tempCanvas.getContext("2d");
        var possibleFonts = window
            .getComputedStyle(this.view, null)
            .getPropertyValue("font-family")
            .split(", ");
        var fillerText = "abcdefghijklmnopqrstuvwxyz0123456789,./!@#$%^&*-+";
        tempCanvasCtx.font = this.view.fontSize + " serif";
        var serifWidth = tempCanvasCtx.measureText(fillerText).width;
        for (let i = 0; i < possibleFonts.length; i++) {
            if (possibleFonts[i].includes('"')) {
                possibleFonts[i] = possibleFonts[i].replaceAll('"', "");
            }
            if (possibleFonts[i].includes("'")) {
                possibleFonts[i] = possibleFonts[i].replaceAll("'", "");
            }
            tempCanvasCtx.font = this.view.fontSize + " " + possibleFonts[i];
            if (tempCanvasCtx.measureText(fillerText).width !== serifWidth) {
                this.view.fontFamily = possibleFonts[i];
                break;
            }
        }
    }
    // Answer the block that this line is currently in
    block() {
        for (let i = 0; i < this.problem.blocks.length; i++) {
            var block = this.problem.blocks[i];
            for (var j = 0; j < block.lines.length; j++) {
                if (block.lines[j] === this) {
                    return block;
                }
            }
        }
        return undefined;
    }
    // Answer the indent based on the view
    viewIndent() {
        if (this.problem.noindent) {
            return this.indent;
        } else {
            var block = this.block();
            return this.indent - block.solutionIndent() + block.indent;
        }
    }
}


/***/ }),

/***/ 39147:
/*!*************************************************!*\
  !*** ./runestone/parsons/js/placeholderLine.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PlaceholderLine)
/* harmony export */ });
/* harmony import */ var _parsonsLine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./parsonsLine */ 33760);


class PlaceholderLine extends _parsonsLine__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(problem) {
        super(problem, "placeholder", false);
        this.isPlaceholderLine = true;
    }
}


/***/ }),

/***/ 40771:
/*!********************************************!*\
  !*** ./runestone/parsons/js/lineGrader.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ LineBasedGrader)
/* harmony export */ });
class LineBasedGrader {
    constructor(problem) {
        this.problem = problem;
    }
    // Use a LIS (Longest Increasing Subsequence) algorithm to return the indexes
    // that are not part of that subsequence.
    inverseLISIndices(arr) {
        // Get all subsequences
        var allSubsequences = [];
        for (var i = 0; i < arr.length; i++) {
            var subsequenceForCurrent = [arr[i]];
            for (var j = 0; j < i; j++) {
                if (
                    arr[j] < arr[i] &&
                    allSubsequences[j].length + 1 > subsequenceForCurrent.length
                ) {
                    subsequenceForCurrent = allSubsequences[j].concat(arr[i]);
                }
            }
            allSubsequences.push(subsequenceForCurrent);
        }
        // Figure out the longest one
        var longestSubsequenceLength = -1;
        var longestSubsequence;
        for (let i in allSubsequences) {
            var subs = allSubsequences[i];
            if (subs.length > longestSubsequenceLength) {
                longestSubsequenceLength = subs.length;
                longestSubsequence = subs;
            }
        }
        // Create the inverse indexes
        var indexes = [];
        var lIndex = 0;
        for (let i = 0; i < arr.length; i++) {
            if (lIndex > longestSubsequence.length) {
                indexes.push(i);
            } else {
                if (arr[i] == longestSubsequence[lIndex]) {
                    lIndex += 1;
                } else {
                    indexes.push(i);
                }
            }
        }
        return indexes;
    }
    // grade that element, returning the state
    grade() {
        var problem = this.problem;
        problem.clearFeedback();
        this.correctLines = 0;
        this.percentLines = 0;
        this.incorrectIndents = 0;
        var solutionLines = problem.solution;
        var answerLines = problem.answerLines();
        var i;
        var state;
        this.percentLines =
            Math.min(answerLines.length, solutionLines.length) /
            Math.max(answerLines.length, solutionLines.length);
        if (answerLines.length < solutionLines.length) {
            state = "incorrectTooShort";
            this.correctLength = false;
        } else if (answerLines.length == solutionLines.length) {
            this.correctLength = true;
        } else {
            state = "incorrectMoveBlocks";
            this.correctLength = false;
        }

        // Determine whether the code **that is there** is in the correct order
        // If there is too much or too little code this only matters for
        // calculating a percentage score.
        let isCorrectOrder = this.checkCorrectOrdering(
            solutionLines,
            answerLines,
        );

        // Determine whether blocks are indented correctly
        let isCorrectIndents = this.checkCorrectIndentation(
            solutionLines,
            answerLines,
        );

        if (isCorrectIndents && isCorrectOrder && this.correctLength) {
            // Perfect
            state = "correct";
        } else if (this.correctLength && isCorrectOrder) {
            state = "incorrectIndent";
        } else if (!isCorrectOrder && state != "incorrectTooShort") {
            state = "incorrectMoveBlocks";
        }
        this.calculatePercent();
        this.graderState = state;

        return state;
    }

    checkCorrectIndentation(solutionLines, answerLines) {
        if (!this.problem.usesIndentation()) return true;

        this.indentLeft = [];
        this.indentRight = [];
        let loopLimit = Math.min(solutionLines.length, answerLines.length);
        for (let i = 0; i < loopLimit; i++) {
            if (answerLines[i].viewIndent() < solutionLines[i].indent) {
                this.indentRight.push(answerLines[i]);
            } else if (answerLines[i].viewIndent() > solutionLines[i].indent) {
                this.indentLeft.push(answerLines[i]);
            }
        }
        this.incorrectIndents =
            this.indentLeft.length + this.indentRight.length;

        return this.incorrectIndents == 0;
    }

    checkCorrectOrdering(solutionLines, answerLines) {
        let isCorrectOrder = true;
        this.correctLines = 0;
        this.solutionLength = solutionLines.length;
        let loopLimit = Math.min(solutionLines.length, answerLines.length);
        for (let i = 0; i < loopLimit; i++) {
            if (answerLines[i].text !== solutionLines[i].text) {
                isCorrectOrder = false;
            } else {
                this.correctLines += 1;
            }
        }
        return isCorrectOrder;
    }

    calculatePercent() {
        let numLines = this.percentLines * 0.2;
        let lines = this.problem.answerLines().length;
        let numCorrectBlocks = (this.correctLines / lines) * 0.4;
        let numCorrectIndents =
            ((this.correctLines - this.incorrectIndents) / lines) * 0.4;

        let score = numLines + numCorrectBlocks + numCorrectIndents;
        score = Math.max(score, 0);
        this.problem.percent = score;
    }
}


/***/ }),

/***/ 44065:
/*!**********************************************!*\
  !*** ./runestone/parsons/js/parsonsBlock.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ParsonsBlock)
/* harmony export */ });
/* harmony import */ var _hammer_min_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./hammer.min.js */ 88210);
/* harmony import */ var _hammer_min_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_hammer_min_js__WEBPACK_IMPORTED_MODULE_0__);
/* =====================================================================
==== ParsonsBlock Object ===============================================
======== The model and view of a code block.
==== PROPERTIES ========================================================
======== problem: the Parsons problem
======== lines: an array of ParsonsLine in this block
======== indent: indent based on movement
======== view: an element for viewing this object
======== labels: [label, line] the labels numbering the block and the lines they go on
======== hammer: the controller based on hammer.js
===================================================================== */



const INDENT_CLASSES = [
    "indent1",
    "indent2",
    "indent3",
    "indent4",
    "indent5",
    "indent6",
];

// Initialize based on the problem and the lines
class ParsonsBlock {
    constructor(problem, lines) {
        this.problem = problem;
        this.lines = lines;
        this.indent = 0;
        this.labels = [];
        // Create view, adding view of lines and updating indent
        var view = document.createElement("div");
        view.id = problem.counterId + "-block-" + problem.blockIndex;
        problem.blockIndex += 1;
        view.classList.add("block");
        view.setAttribute("role", "button");
        var sharedIndent = lines[0].indent;
        for (let i = 1; i < lines.length; i++) {
            sharedIndent = Math.min(sharedIndent, lines[i].indent);
        }
        var lineDiv = document.createElement("div");
        lineDiv.classList.add("lines");
        view.append(lineDiv);
        for (let i = 0; i < lines.length; i++) {
            var line = lines[i];
            var lineIndent;
            if (problem.noindent) {
                lineIndent = line.indent;
            } else {
                lineIndent = line.indent - sharedIndent;
            }
            line.view.classList.remove(...INDENT_CLASSES);
            if (
                this.problem.options.language != "natural" &&
                this.problem.options.language != "math" &&
                this.problem.options.language != "text"
            ) {
                if (lineIndent > 0) {
                    line.view.classList.add("indent" + lineIndent);
                }
            }
            lineDiv.appendChild(line.view);
        }
        var labelDiv = document.createElement("div");
        labelDiv.classList.add("labels");
        if (this.problem.options.numbered == "left") {
            lineDiv.classList.add("border_left");
            view.prepend(labelDiv);
            view.style.justifyContent = "flex-start";
        } else if (this.problem.options.numbered == "right") {
            labelDiv.classList.add("border_left");
            labelDiv.style.float = "right";
            view.style.justifyContent = "space-between";
            view.append(labelDiv);
        }
        this.view = view;
        // is not placeholder by default
        this.isPlaceholder = false;
    }
    // Add a line (from another block) to this block
    addLine(line) {
        line.view.classList.remove(...INDENT_CLASSES);
        if (this.problem.noindent) {
            if (line.indent > 0) {
                line.view.classList.add("indent" + line.indent);
            }
        } else {
            var lines = this.lines;
            var sharedIndent = lines[0].indent;
            for (let i = 1; i < lines.length; i++) {
                sharedIndent = Math.min(sharedIndent, lines[i].indent);
            }
            if (sharedIndent < line.indent) {
                line.view.classList.add(
                    "indent" + (line.indent - sharedIndent),
                );
            } else if (sharedIndent > line.indent) {
                for (let i = 0; i < lines.length; i++) {
                    lines[i].view.classList.remove(...INDENT_CLASSES);
                    // todo: if language is natural or math then don't do this
                    if (
                        this.problem.options.language !== "natural" &&
                        this.problem.options.language !== "math" &&
                        this.problem
                    ) {
                        lines[i].view.classList.add(
                            "indent" + (lines[i].indent - line.indent),
                        );
                    }
                }
            }
        }
        this.lines.push(line);
        this.view.querySelector(".lines").appendChild(line.view);
    }
    // Add the contents of that block to myself and then delete that block
    consumeBlock(block) {
        for (let i = 0; i < block.lines.length; i++) {
            this.addLine(block.lines[i]);
        }
        if (block.view.getAttribute("tabindex") == "0") {
            this.makeTabIndex();
        }
        block.view.remove();
        var newBlocks = [];
        for (let i = 0; i < this.problem.blocks.length; i++) {
            if (this.problem.blocks[i] !== block) {
                newBlocks.push(this.problem.blocks[i]);
            }
        }
        for (let i = 0; i < block.labels.length; i++) {
            this.addLabel(
                block.labels[i][0],
                this.lines.length - block.lines.length + block.labels[i][1],
            );
        }
        this.problem.blocks = newBlocks;
        this.problem.state = undefined;
        this.problem.updateView();
    }
    // Update the model and view when block is converted to contain indent
    addIndent() {
        // Update the lines model / view
        for (let i = 0; i < this.lines.length; i++) {
            var line = this.lines[i];
            if (line.indent > 0) {
                line.view.classList.remove(...INDENT_CLASSES);
                line.view.classList.add("indent" + line.indent);
            }
        }
        // Update the block model / view
        this.indent = 0;
        this.view.style.paddingLeft = "";
        this.view.style.width = this.problem.areaWidth - 22 + "px";
    }
    // Add a label to block and update its view
    addLabel(label, line) {
        var div = document.createElement("div");
        div.classList.add("block-label");
        if (this.problem.options.numbered == "right") {
            div.classList.add("right-label");
        }
        if (this.problem.options.numbered == "left") {
            div.classList.add("left-label");
        }
        div.append(document.createTextNode(label));
        this.view.querySelector(".labels").append(div);
        if (this.labels.length != 0) {
            div.style.marginTop =
                (line - this.labels[this.labels.length - 1][1] - 1) *
                    this.lines[line].view.offsetHeight +
                "px";
        }
        this.labels.push([label, line]);
    }
    // Initialize Interactivity
    initializeInteractivity() {
        // Always set up a click handler, even if not currently enabled, so that it can be re-enabled later
        this.clickHandler = (event) => {
            if (!this.enabled()) {
                return;
            }
            if (
                !this.problem.keyboardInputActive ||
                this.problem.textFocus !== this
            ) {
                return;
            }
            event.preventDefault();
            this.toggleMove();
        };
        // If the block is disabled, don't add the event listeners yet.
        if (this.view.classList.contains("disabled")) {
            return this;
        }
        this.view.setAttribute("tabindex", "-1");
        this.view.addEventListener("click", this.clickHandler);
        this.hammer = new (_hammer_min_js__WEBPACK_IMPORTED_MODULE_0___default().Manager)(this.view, {
            recognizers: [
                [
                    (_hammer_min_js__WEBPACK_IMPORTED_MODULE_0___default().Pan),
                    {
                        direction: (_hammer_min_js__WEBPACK_IMPORTED_MODULE_0___default().DIRECTION_ALL),
                        threshold: 0,
                        pointers: 1,
                    },
                ],
            ],
        });
        var that = this;
        this.hammer.on("panstart", function (event) {
            that.panStart(event);
        });
        this.hammer.on("panend", function (event) {
            that.panEnd(event);
        });
        this.hammer.on("panmove", function (event) {
            that.panMove(event);
        });
    }
    // Return a boolean as to whether this block is able to be selected
    enabled() {
        return (
            !this.view.classList.contains("disabled") &&
            this.view.getAttribute("tabindex") !== null
        );
    }
    // Return a boolean as to whether this block is a distractor
    isDistractor() {
        return this.lines[0].distractor;
    }
    // Return a boolean as to whether this block is in the source area
    inSourceArea() {
        var children = this.problem.sourceArea.childNodes;
        for (let i = 0; i < children.length; i++) {
            var item = children[i];
            if (item.id == this.view.id) {
                return true;
            }
        }
        return false;
    }
    // Return the page X position of the center of the view
    pageXCenter() {
        var boundingRect = this.view.getBoundingClientRect();
        var pageXCenter =
            window.pageXOffset + boundingRect.left + boundingRect.width / 2;
        return pageXCenter;
    }
    // Return the page Y position of the center of the view
    pageYCenter() {
        var boundingRect = this.view.getBoundingClientRect();
        var pageYCenter =
            window.pageYOffset + boundingRect.top + boundingRect.height / 2;
        return pageYCenter;
    }
    // Of all the line indents, return the minimum value
    minimumLineIndent() {
        var minimumLineIndent = this.lines[0].indent;
        for (let i = 1; i < this.lines.length; i++) {
            minimumLineIndent = Math.min(
                this.lines[i].indent,
                minimumLineIndent,
            );
        }
        return minimumLineIndent;
    }
    // Return the last block in the source area that matches the paired bin it is in
    slideUnderBlock() {
        var sourceBlocks = this.problem.sourceBlocks();
        if (sourceBlocks.length == 0) {
            return undefined;
        }
        var pairedBin = this.pairedBin();
        if (pairedBin == -1) {
            return sourceBlocks[sourceBlocks.length - 1];
        }
        for (let i = sourceBlocks.length - 1; i >= 0; i--) {
            var block = sourceBlocks[i];
            if (block.pairedBin() == pairedBin) {
                return block;
            }
        }
        return sourceBlocks[sourceBlocks.length - 1];
    }
    // Return which paired bin it is in (-1) if not
    pairedBin() {
        var pairedBins = this.problem.pairedBins;
        for (var i = 0; i < pairedBins.length; i++) {
            if (this.matchesBin(pairedBins[i])) {
                return i;
            }
        }
        return -1;
    }
    // Return true if all lines are in that bin
    matchesBin(bin) {
        for (var i = 0; i < this.lines.length; i++) {
            var test = this.lines[i].index;
            if (bin.indexOf(test) == -1) {
                return false;
            }
        }
        return true;
    }
    // Return a list of indexes where this block could be inserted before
    validSourceIndexes() {
        var blocks = this.problem.sourceBlocks();
        var indexes = [];
        var pairedBin = this.pairedBin();
        var i, lastBin;
        if (pairedBin >= 0) {
            for (i = 0; i < blocks.length; i++) {
                var block = blocks[i];
                if (block.view.id !== this.view.id) {
                    var blockBin = block.pairedBin();
                    if (blockBin == pairedBin) {
                        indexes.push(i);
                    } else if (lastBin == pairedBin) {
                        indexes.push(i);
                    }
                    lastBin = blockBin;
                }
            }
            if (lastBin == pairedBin) {
                indexes.push(blocks.length);
            }
            if (indexes.length > 0) {
                return indexes;
            }
        }
        for (i = 0; i < blocks.length; i++) {
            let block = blocks[i];
            if (block.view.id !== this.view.id) {
                let blockBin = block.pairedBin();
                if (blockBin !== lastBin) {
                    indexes.push(i);
                } else if (blockBin == -1) {
                    indexes.push(i);
                }
                lastBin = blockBin;
            }
        }
        indexes.push(blocks.length);
        return indexes;
    }
    // A measure of how far the middle of this block is vertically positioned
    verticalOffset() {
        var verticalOffset;
        if (this.inSourceArea()) {
            verticalOffset =
                this.problem.sourceArea.getBoundingClientRect().top;
        } else {
            verticalOffset =
                this.problem.answerArea.getBoundingClientRect().top;
        }
        verticalOffset =
            this.view.getBoundingClientRect().top +
            this.view.getBoundingClientRect().bottom -
            verticalOffset * 2;
        return verticalOffset;
    }
    // This block just gained textual focus
    newFocus(event) {
        if (!this.problem.keyboardInputActive) {
            return;
        }
        if (this.problem.textFocus == undefined) {
            this.problem.enterKeyboardMode();
            this.problem.textFocus = this;
            this.problem.textMove = false;
            this.view.classList.add("down");
        } else if (this.problem.textFocus == this) {
            if (this.problem.textMove) {
                this.view.classList.add("up");
            } else {
                this.view.classList.add("down");
            }
        } else {
            // already in keyboard mode
            this.problem.textFocus = this;
            this.problem.textMove = false;
            this.view.classList.add("down");
        }
        this.problem.textMoving = false;
        if (!this.problem.keyboardInputActive) {
            this.problem.enterKeyboardNavigationMode(this);
        }
    }
    // This block just lost textual focus
    releaseFocus(event) {
        if (this.problem.keyboardInputActive) {
            this.problem.cancelKeyboardMovement();
            return;
        }
        if (!this.problem.keyboardMovementMode) {
            this.view.classList.remove("down", "up");
        }
        if (this.problem.textFocus == this) {
            if (
                !this.problem.textMoving &&
                !this.problem.keyboardMovementMode
            ) {
                // exit out of problem but stay way into problem
                this.problem.textFocus = undefined;
                if (this.problem.textMove) {
                    this.problem.logMove("kmove");
                    this.problem.textMove = false;
                    // CodeTailor: update placeholders
                    this.problem.updatePlaceholders();
                }
                this.problem.exitKeyboardMode();
            }
        } else {
            // become selectable, but not active
            this.view.setAttribute("tabindex", "-1");
            this.view.removeEventListener("focus", this.focusHandler);
            this.view.removeEventListener("blur", this.blurHandler);
            this.view.removeEventListener("keydown", this.keydownHandler);
        }
    }
    // Make this block into the keyboard entry point
    makeTabIndex() {
        this.view.setAttribute("tabindex", "-1");
        if (this.focusHandler === undefined) {
            this.focusHandler = (event) => this.newFocus(event);
            this.blurHandler = (event) => this.releaseFocus(event);
            this.keydownHandler = (event) => this.keyDown(event);
        }
        // re-adding an identical listener is a no-op, so repeated calls are safe
        this.view.addEventListener("focus", this.focusHandler);
        this.view.addEventListener("blur", this.blurHandler);
        this.view.addEventListener("keydown", this.keydownHandler);
    }
    // Called to disable interaction for the future
    disable() {
        if (this.hammer !== undefined) {
            this.hammer.set({ enable: false });
        }
        this.view.removeEventListener("click", this.clickHandler);
        if (this.view.getAttribute("tabindex") == "0") {
            this.releaseFocus();
            this.view.removeAttribute("tabindex");
            this.problem.initializeTabIndex();
        } else {
            this.view.removeAttribute("tabindex");
        }
    }
    // Enable functionality after reset button has been pressed
    resetView() {
        if (this.hammer !== undefined) {
            this.hammer.set({ enable: true });
        }
        if (!this.view.hasAttribute("tabindex")) {
            this.view.setAttribute("tabindex", "-1");
        }
        this.view.addEventListener("click", this.clickHandler);
        this.view.style.opacity = "";
    }
    // Called to destroy interaction for the future
    destroy() {
        if (this.hammer !== undefined) {
            this.hammer.destroy();
            delete this.hammer;
        }
        this.view.removeEventListener("click", this.clickHandler);
        if (this.view.getAttribute("tabindex") == "0") {
            this.releaseFocus();
        }
        this.view.removeAttribute("tabindex");
    }
    // Called when a block is picked up
    panStart(event) {
        this.problem.clearFeedback();
        if (this.problem.started == undefined) {
            // log the first time that something gets moved
            this.problem.started = true;
            this.problem.logMove("start");
        }
        if (this.problem.textFocus !== undefined) {
            // stop text focus when dragging
            this.problem.textFocus.releaseFocus();
        }
        this.problem.moving = this;
        // Update the view
        this.problem.movingX = event.srcEvent.pageX;
        this.problem.movingY = event.srcEvent.pageY;
        this.problem.updateView();
    }
    // Called when a block is dropped
    panEnd(event) {
        this.problem.isAnswered = true;
        delete this.problem.moving;
        delete this.problem.movingX;
        delete this.problem.movingY;
        this.problem.updateView();
        this.problem.logMove("move");
        this.problem.updatePlaceholders();
    }
    // Called when a block is moved
    panMove(event) {
        // Update the view
        this.problem.movingX = event.srcEvent.pageX;
        this.problem.movingY = event.srcEvent.pageY;
        this.problem.updateView();
    }
    // Handle a keypress event when in focus
    keyDown(event) {
        if (this.problem.started == undefined) {
            // log the first time that something gets moved
            this.problem.started = true;
            this.problem.logMove("kstart");
        }
        switch (event.keyCode) {
            case 37: // left
                if (this.problem.textMove) {
                    this.moveLeft();
                } else {
                    this.selectLeft();
                }
                break;
            case 38: // up
                if (this.problem.textMove) {
                    this.moveUp();
                } else {
                    this.selectUp();
                }
                event.preventDefault();
                break;
            case 39: // right
                if (this.problem.textMove) {
                    this.moveRight();
                } else {
                    this.selectRight();
                }
                event.preventDefault();
                break;
            case 40: // down
                if (this.problem.textMove) {
                    this.moveDown();
                } else {
                    this.selectDown();
                }
                event.preventDefault();
                break;
            case 32: // space
                this.toggleMove();
                event.preventDefault();
                break;
            case 13: // enter
                this.toggleMove();
                event.preventDefault();
                break;
        }
    }
    // Move block left
    moveLeft() {
        var index, block;
        if (!this.inSourceArea()) {
            if (this.indent == 0) {
                // move to source area
                var blocks = this.problem.sourceBlocks();
                var offset = this.verticalOffset();
                var validSourceIndexes = this.validSourceIndexes();
                for (var i = 0; i < validSourceIndexes.length; i++) {
                    index = validSourceIndexes[i];
                    if (index == blocks.length) {
                        this.problem.textMoving = true;
                        this.problem.sourceArea.appendChild(this.view);
                        if (!this.problem.keyboardMovementMode) {
                            this.view.focus();
                        }
                        this.problem.state = undefined;
                        this.problem.updateView();
                        return this;
                    } else {
                        block = blocks[index];
                        if (block.verticalOffset() >= offset) {
                            break;
                        }
                    }
                }
                this.problem.textMoving = true;
                this.problem.sourceArea.insertBefore(this.view, block.view);
                if (!this.problem.keyboardMovementMode) {
                    this.view.focus();
                }
            } else {
                // reduce indent
                this.indent = this.indent - 1;
            }
            this.problem.state = undefined;
            this.problem.updateView();
        }
    }
    // Move block up
    moveUp() {
        if (this.inSourceArea()) {
            let blocks = this.problem.sourceBlocks();
            var offset = this.verticalOffset();
            var validSourceIndexes = this.validSourceIndexes();
            for (let i = 0; i < validSourceIndexes.length; i++) {
                var index =
                    validSourceIndexes[validSourceIndexes.length - 1 - i];
                if (index < blocks.length) {
                    var block = blocks[index];
                    if (block.verticalOffset() < offset) {
                        this.problem.textMoving = true;
                        this.problem.sourceArea.insertBefore(
                            this.view,
                            block.view,
                        );
                        if (!this.problem.keyboardMovementMode) {
                            this.view.focus();
                        }
                        this.problem.state = undefined;
                        this.problem.updateView();
                        return this;
                    }
                }
            }
        } else {
            let blocks = this.problem.answerBlocks();
            for (let i = 0; i < blocks.length; i++) {
                if (blocks[i].view.id == this.view.id) {
                    if (i == 0) {
                        return this;
                    }
                    this.problem.textMoving = true;
                    this.problem.answerArea.insertBefore(
                        this.view,
                        blocks[i - 1].view,
                    );
                    if (!this.problem.keyboardMovementMode) {
                        this.view.focus();
                    }
                    this.problem.state = undefined;
                    this.problem.updateView();
                }
            }
        }
    }
    // Move block right
    moveRight() {
        if (this.inSourceArea()) {
            // move to answer area
            this.indent = 0;
            var offset = this.verticalOffset();
            var answerBlocks = this.problem.answerBlocks();
            for (var i = 0; i < answerBlocks.length; i++) {
                var item = answerBlocks[i];
                var itemOffset = item.verticalOffset();
                if (itemOffset >= offset) {
                    this.problem.textMoving = true;
                    this.problem.answerArea.insertBefore(this.view, item.view);
                    if (!this.problem.keyboardMovementMode) {
                        this.view.focus();
                    }
                    this.problem.state = undefined;
                    this.problem.updateView();
                    return this;
                }
            }
            this.problem.textMoving = true;
            this.problem.answerArea.appendChild(this.view);
            if (!this.problem.keyboardMovementMode) {
                this.view.focus();
            }
            this.problem.state = undefined;
            this.problem.updateView();
        } else {
            // in answer area: increase the indent
            if (this.indent !== this.problem.indent) {
                this.indent = this.indent + 1;
                this.problem.state = undefined;
                this.problem.updateView();
            }
        }
    }
    // Move block down
    moveDown() {
        if (this.inSourceArea()) {
            let blocks = this.problem.sourceBlocks();
            var validSourceIndexes = this.validSourceIndexes();
            for (let i = 0; i < blocks.length; i++) {
                if (blocks[i].view.id == this.view.id) {
                    var myIndex = i;
                }
            }
            for (let i = 0; i < validSourceIndexes.length; i++) {
                var index = validSourceIndexes[i];
                if (index == blocks.length) {
                    this.problem.textMoving = true;
                    this.problem.sourceArea.appendChild(this.view);
                    if (!this.problem.keyboardMovementMode) {
                        this.view.focus();
                    }
                    this.problem.state = undefined;
                    this.problem.updateView();
                    return this;
                } else if (index - myIndex > 1) {
                    this.problem.textMoving = true;
                    this.problem.sourceArea.insertBefore(
                        this.view,
                        blocks[index].view,
                    );
                    if (!this.problem.keyboardMovementMode) {
                        this.view.focus();
                    }
                    this.problem.state = undefined;
                    this.problem.updateView();
                    return this;
                }
            }
        } else {
            let blocks = this.problem.answerBlocks();
            for (var i = 0; i < blocks.length; i++) {
                if (blocks[i].view.id == this.view.id) {
                    if (i == blocks.length - 1) {
                        return this;
                    } else if (i == blocks.length - 2) {
                        this.problem.textMoving = true;
                        this.problem.answerArea.appendChild(this.view);
                    } else {
                        this.problem.textMoving = true;
                        this.problem.answerArea.insertBefore(
                            this.view,
                            blocks[i + 2].view,
                        );
                    }
                    if (!this.problem.keyboardMovementMode) {
                        this.view.focus();
                    }
                    this.problem.state = undefined;
                    this.problem.updateView();
                }
            }
        }
    }
    // Move selection left
    selectLeft() {
        if (!this.inSourceArea()) {
            var offset = this.verticalOffset();
            var sourceBlocks = this.problem.enabledSourceBlocks();
            if (sourceBlocks.length == 0) {
                return this;
            }
            var chooseNext = sourceBlocks[0];
            var chooseOffset = chooseNext.verticalOffset() - offset;
            for (var i = 1; i < sourceBlocks.length; i++) {
                var item = sourceBlocks[i];
                var itemOffset = item.verticalOffset() - offset;
                if (Math.abs(itemOffset) < Math.abs(chooseOffset)) {
                    chooseNext = item;
                    chooseOffset = itemOffset;
                }
            }
            this.problem.selectKeyboardBlock(chooseNext);
        }
    }
    // Move selection up
    selectUp() {
        var chooseNext = false;
        var blocks;
        if (this.inSourceArea()) {
            blocks = this.problem.enabledSourceBlocks();
        } else {
            blocks = this.problem.enabledAnswerBlocks();
        }
        for (var i = blocks.length - 1; i >= 0; i--) {
            var item = blocks[i];
            if (chooseNext) {
                this.problem.selectKeyboardBlock(item);
                return this;
            } else {
                if (item.view.id == this.view.id) {
                    chooseNext = true;
                }
            }
        }
    }
    // Move selection right
    selectRight() {
        if (this.inSourceArea()) {
            var offset = this.verticalOffset();
            var blocks = this.problem.enabledAnswerBlocks();
            if (blocks.length == 0) {
                return this;
            }
            var chooseNext = blocks[0];
            var chooseOffset = chooseNext.verticalOffset() - offset;
            for (var i = 1; i < blocks.length; i++) {
                var item = blocks[i];
                var itemOffset = item.verticalOffset() - offset;
                if (Math.abs(itemOffset) < Math.abs(chooseOffset)) {
                    chooseNext = item;
                    chooseOffset = itemOffset;
                }
            }
            this.problem.selectKeyboardBlock(chooseNext);
        }
    }
    // Move selection down
    selectDown() {
        var chooseNext = false;
        var blocks;
        if (this.inSourceArea()) {
            blocks = this.problem.enabledSourceBlocks();
        } else {
            blocks = this.problem.enabledAnswerBlocks();
        }
        for (var i = 0; i < blocks.length; i++) {
            var item = blocks[i];
            if (chooseNext) {
                this.problem.selectKeyboardBlock(item);
                return this;
            } else {
                if (item.view.id == this.view.id) {
                    chooseNext = true;
                }
            }
        }
    }
    // Toggle whether to move this block
    toggleMove() {
        if (this.problem.textMove) {
            this.view.classList.remove("up");
            this.view.classList.add("down");
            this.problem.textMove = false;
            this.problem.logMove("kmove");
            if (!this.isPlaceholder) {
                this.problem.updatePlaceholders();
            }
        } else {
            this.view.classList.remove("down");
            this.view.classList.add("up");
            this.problem.textMove = true;
            this.problem.enterKeyboardMovementMode(this);
        }
    }
    // Answer a string that represents this codeblock for saving
    hash() {
        var hash = "";
        for (var i = 0; i < this.lines.length; i++) {
            hash += this.lines[i].index + "_";
        }
        hash += this.indent;
        return hash;
    }
    // Answer what the indent should be for the solution
    solutionIndent() {
        var sharedIndent = this.lines[0].indent;
        for (var i = 1; i < this.lines.length; i++) {
            sharedIndent = Math.min(sharedIndent, this.lines[i].indent);
        }
        return sharedIndent;
    }
}


/***/ }),

/***/ 49647:
/*!*******************************************!*\
  !*** ./runestone/parsons/js/dagGrader.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DAGGrader)
/* harmony export */ });
/* harmony import */ var _lineGrader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lineGrader */ 40771);
/* harmony import */ var _dagHelpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dagHelpers */ 79863);



function graphToNX(answerLines) {
    var graph = new _dagHelpers__WEBPACK_IMPORTED_MODULE_1__.DiGraph();
    for (let line1 of answerLines) {
        graph.addNode(line1.tag);
        for (let line2tag of line1.depends) {
            // the depends graph lists the *incoming* edges of a node
            graph.addEdge(line2tag, line1.tag);
        }
    }
    return graph;
}

function isVertexCover(graph, vertexCover) {
    for (let edge of graph.edges()) {
        if (!(vertexCover.has(edge[0]) || vertexCover.has(edge[1]))) {
            return false;
        }
    }
    return true;
}

// Find all subsets of the set using the correspondence of subsets of
// a set to binary string whose length are the size of the set
function allSubsets(arr) {
    let subsets = {};
    for (let i = 0; i <= arr.length; i++) {
        subsets[i] = [];
    }
    for (let i = 0; i < Math.pow(2, arr.length); i++) {
        let bin = i.toString(2);
        while (bin.length < arr.length) {
            bin = "0" + bin;
        }
        let subset = new Set();
        for (let j = 0; j < bin.length; j++) {
            if (bin[j] == "1") {
                subset.add(arr[j]);
            }
        }
        subsets[subset.size].push(subset);
    }
    return subsets;
}

class DAGGrader extends _lineGrader__WEBPACK_IMPORTED_MODULE_0__["default"] {
    inverseLISIndices(arr, inSolution) {
        // For more details and a proof of the correctness of the algorithm, see the paper: https://arxiv.org/abs/2204.04196

        var solution = this.problem.solution;
        var answerLines = inSolution.map((block) => block.lines[0]); // assume NOT adaptive for DAG grading (for now)

        let graph = graphToNX(solution);

        let seen = new Set();
        let problematicSubgraph = new _dagHelpers__WEBPACK_IMPORTED_MODULE_1__.DiGraph();
        for (let line1 of answerLines) {
            for (let line2 of seen) {
                let problematic = (0,_dagHelpers__WEBPACK_IMPORTED_MODULE_1__.hasPath)(graph, {
                    source: line1.tag,
                    target: line2.tag,
                });
                if (problematic) {
                    problematicSubgraph.addEdge(line1.tag, line2.tag);
                }
            }

            seen.add(line1);
        }

        let mvc = null;
        let subsets = allSubsets(problematicSubgraph.nodes());
        for (let i = 0; i <= problematicSubgraph.numberOfNodes(); i++) {
            for (let subset of subsets[i]) {
                if (isVertexCover(problematicSubgraph, subset)) {
                    mvc = subset;
                    break;
                }
            }
            if (mvc != null) {
                break;
            }
        }

        let indices = [...mvc].map((tag) => {
            for (let i = 0; i < answerLines.length; i++) {
                if (answerLines[i].tag === tag) return i;
            }
        });
        return indices;
    }

    checkCorrectIndentation() {
        if (!this.problem.usesIndentation()) return true;

        this.indentLeft = [];
        this.indentRight = [];
        // For dag problems, only check the indentation of each block in the problem
        for (const block of this.problem.blocks) {
            // Skip distractor blocks
            if (block.isDistractor()) continue;

            const curIndent = block.indent;
            const expectedIndent = block.solutionIndent();
            // If missmatch, add first line of block to the correct indent list for
            // UI updating
            if (curIndent < expectedIndent)
                this.indentRight.push(block.lines[0]);
            else if (curIndent > expectedIndent)
                this.indentLeft.push(block.lines[0]);
        }

        this.incorrectIndents =
            this.indentLeft.length + this.indentRight.length;

        return this.incorrectIndents == 0;
    }

    checkCorrectOrdering(solutionLines, answerLines) {
        if (!(0,_dagHelpers__WEBPACK_IMPORTED_MODULE_1__.isDirectedAcyclicGraph)(graphToNX(solutionLines))) {
            throw "Dependency between blocks does not form a Directed Acyclic Graph; Problem unsolvable.";
        }

        let seen = new Set();
        let isCorrectOrder = true;
        this.correctLines = 0;
        this.solutionLength = solutionLines.length;
        let loopLimit = Math.min(solutionLines.length, answerLines.length);
        for (let i = 0; i < loopLimit; i++) {
            let line = answerLines[i];
            if (line.distractor) {
                isCorrectOrder = false;
            } else {
                for (let j = 0; j < line.depends.length; j++) {
                    if (!seen.has(line.depends[j])) {
                        isCorrectOrder = false;
                    }
                }
            }
            if (isCorrectOrder) {
                this.correctLines += 1;
            }
            seen.add(line.tag);
        }
        return isCorrectOrder;
    }
}


/***/ }),

/***/ 67216:
/*!**************************************************!*\
  !*** ./runestone/parsons/js/placeholderBlock.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PlaceholderBlock)
/* harmony export */ });
/* harmony import */ var _parsonsBlock__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./parsonsBlock */ 44065);
/* harmony import */ var _parsonsLine__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./parsonsLine */ 33760);



class PlaceholderBlock extends _parsonsBlock__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(
        problem,
        placeholderLines,
        placeholderSize,
        afterSettledBlockCount,
    ) {
        // problem: Parsons instance
        // size: how many blocks it is holding

        // have to have at least one parsonslines, otherwise will be error in ParsonsBlock.
        super(problem, placeholderLines);
        this.placeholderLines = placeholderLines;
        this.afterSettledBlockCount = afterSettledBlockCount;

        // create a normal parsons block, but use css to control visibility of normal content
        this.view.classList.add("placeholder-block", "disabled");

        // create a new div displaying how many blocks are missing
        this.placeholderSize = placeholderSize;
        var content = document.createElement("div");
        content.classList.add("placeholder-text");
        if (placeholderSize > 1) {
            content.innerText = `${placeholderSize} blocks are missing here`;
        } else {
            content.innerText = `${placeholderSize} block is missing here`;
        }
        this.view.append(content);

        this.isPlaceholder = true;
    }
}


/***/ }),

/***/ 78811:
/*!******************************************!*\
  !*** ./runestone/parsons/js/prettify.js ***!
  \******************************************/
/***/ (() => {

// TODO - How much of this is needed? Lots of overlap with what syntax highlighting
// via pretext theme does...

function H() {
    var x =
        navigator &&
        navigator.userAgent &&
        /\bMSIE 6\./.test(navigator.userAgent);
    H = function() {
        return x;
    };
    return x;
}
(function() {
    function x(b) {
        b = b.split(/ /g);
        var a = {};
        for (var c = b.length; --c >= 0; ) {
            var d = b[c];
            if (d) a[d] = null;
        }
        return a;
    }
    var y = "break continue do else for if return while ",
        U =
            y +
            "auto case char const default double enum extern float goto int long register short signed sizeof static struct switch typedef union unsigned void volatile ",
        D =
            U +
            "catch class delete false import new operator private protected public this throw true try ",
        I =
            D +
            "alignof align_union asm axiom bool concept concept_map const_cast constexpr decltype dynamic_cast explicit export friend inline late_check mutable namespace nullptr reinterpret_cast static_assert static_cast template typeid typename typeof using virtual wchar_t where ",
        J =
            D +
            "boolean byte extends final finally implements import instanceof null native package strictfp super synchronized throws transient ",
        V =
            J +
            "as base by checked decimal delegate descending event fixed foreach from group implicit in interface internal into is lock object out override orderby params readonly ref sbyte sealed stackalloc string select uint ulong unchecked unsafe ushort var ",
        K =
            D +
            "debugger eval export function get null set undefined var with Infinity NaN ",
        L =
            "caller delete die do dump elsif eval exit foreach for goto if import last local my next no our print package redo require sub undef unless until use wantarray while BEGIN END ",
        M =
            y +
            "and as assert class def del elif except exec finally from global import in is lambda nonlocal not or pass print raise try with yield False True None ",
        N =
            y +
            "alias and begin case class def defined elsif end ensure false in module next nil not or redo rescue retry self super then true undef unless until when yield BEGIN END ",
        O = y + "case done elif esac eval fi function in local set then until ",
        W = I + V + K + L + M + N + O;
    function X(b) {
        return (b >= "a" && b <= "z") || (b >= "A" && b <= "Z");
    }
    function u(b, a, c, d) {
        b.unshift(c, d || 0);
        try {
            a.splice.apply(a, b);
        } finally {
            b.splice(0, 2);
        }
    }
    var Y = (function() {
            var b = [
                    "!",
                    "!=",
                    "!==",
                    "#",
                    "%",
                    "%=",
                    "&",
                    "&&",
                    "&&=",
                    "&=",
                    "(",
                    "*",
                    "*=",
                    "+=",
                    ",",
                    "-=",
                    "->",
                    "/",
                    "/=",
                    ":",
                    "::",
                    ";",
                    "<",
                    "<<",
                    "<<=",
                    "<=",
                    "=",
                    "==",
                    "===",
                    ">",
                    ">=",
                    ">>",
                    ">>=",
                    ">>>",
                    ">>>=",
                    "?",
                    "@",
                    "[",
                    "^",
                    "^=",
                    "^^",
                    "^^=",
                    "{",
                    "|",
                    "|=",
                    "||",
                    "||=",
                    "~",
                    "break",
                    "case",
                    "continue",
                    "delete",
                    "do",
                    "else",
                    "finally",
                    "instanceof",
                    "return",
                    "throw",
                    "try",
                    "typeof"
                ],
                a =
                    "(?:(?:(?:^|[^0-9.])\\.{1,3})|(?:(?:^|[^\\+])\\+)|(?:(?:^|[^\\-])-)";
            for (var c = 0; c < b.length; ++c) {
                var d = b[c];
                a += X(d.charAt(0))
                    ? "|\\b" + d
                    : "|" + d.replace(/([^=<>:&])/g, "\\$1");
            }
            a += "|^)\\s*$";
            return new RegExp(a);
        })(),
        P = /&/g,
        Q = /</g,
        R = />/g,
        Z = /\"/g;
    function $(b) {
        return b
            .replace(P, "&amp;")
            .replace(Q, "&lt;")
            .replace(R, "&gt;")
            .replace(Z, "&quot;");
    }
    function E(b) {
        return b
            .replace(P, "&amp;")
            .replace(Q, "&lt;")
            .replace(R, "&gt;");
    }
    var aa = /&lt;/g,
        ba = /&gt;/g,
        ca = /&apos;/g,
        da = /&quot;/g,
        ea = /&amp;/g,
        fa = /&nbsp;/g;
    function ga(b) {
        var a = b.indexOf("&");
        if (a < 0) return b;
        for (--a; (a = b.indexOf("&#", a + 1)) >= 0; ) {
            var c = b.indexOf(";", a);
            if (c >= 0) {
                var d = b.substring(a + 3, c),
                    g = 10;
                if (d && d.charAt(0) === "x") {
                    d = d.substring(1);
                    g = 16;
                }
                var e = parseInt(d, g);
                if (!isNaN(e))
                    b =
                        b.substring(0, a) +
                        String.fromCharCode(e) +
                        b.substring(c + 1);
            }
        }
        return b
            .replace(aa, "<")
            .replace(ba, ">")
            .replace(ca, "'")
            .replace(da, '"')
            .replace(ea, "&")
            .replace(fa, " ");
    }
    function S(b) {
        return "XMP" === b.tagName;
    }
    function z(b, a) {
        switch (b.nodeType) {
            case 1:
                var c = b.tagName.toLowerCase();
                a.push("<", c);
                for (var d = 0; d < b.attributes.length; ++d) {
                    var g = b.attributes[d];
                    if (!g.specified) continue;
                    a.push(" ");
                    z(g, a);
                }
                a.push(">");
                for (var e = b.firstChild; e; e = e.nextSibling) z(e, a);
                if (b.firstChild || !/^(?:br|link|img)$/.test(c))
                    a.push("</", c, ">");
                break;
            case 2:
                a.push(b.name.toLowerCase(), '="', $(b.value), '"');
                break;
            case 3:
            case 4:
                a.push(E(b.nodeValue));
                break;
        }
    }
    var F = null;
    function ha(b) {
        if (null === F) {
            var a = document.createElement("PRE");
            a.appendChild(
                document.createTextNode(
                    '<!DOCTYPE foo PUBLIC "foo bar">\n<foo />'
                )
            );
            F = !/</.test(a.innerHTML);
        }
        if (F) {
            var c = b.innerHTML;
            if (S(b)) c = E(c);
            return c;
        }
        var d = [];
        for (var g = b.firstChild; g; g = g.nextSibling) z(g, d);
        return d.join("");
    }
    function ia(b) {
        var a = 0;
        return function(c) {
            var d = null,
                g = 0;
            for (var e = 0, h = c.length; e < h; ++e) {
                var f = c.charAt(e);
                switch (f) {
                    case "\t":
                        if (!d) d = [];
                        d.push(c.substring(g, e));
                        var i = b - (a % b);
                        a += i;
                        for (; i >= 0; i -= "                ".length)
                            d.push("                ".substring(0, i));
                        g = e + 1;
                        break;
                    case "\n":
                        a = 0;
                        break;
                    default:
                        ++a;
                }
            }
            if (!d) return c;
            d.push(c.substring(g));
            return d.join("");
        };
    }
    var ja = /(?:[^<]+|<!--[\s\S]*?--\>|<!\[CDATA\[([\s\S]*?)\]\]>|<\/?[a-zA-Z][^>]*>|<)/g,
        ka = /^<!--/,
        la = /^<\[CDATA\[/,
        ma = /^<br\b/i;
    function na(b) {
        var a = b.match(ja),
            c = [],
            d = 0,
            g = [];
        if (a)
            for (var e = 0, h = a.length; e < h; ++e) {
                var f = a[e];
                if (f.length > 1 && f.charAt(0) === "<") {
                    if (ka.test(f)) continue;
                    if (la.test(f)) {
                        c.push(f.substring(9, f.length - 3));
                        d += f.length - 12;
                    } else if (ma.test(f)) {
                        c.push("\n");
                        ++d;
                    } else g.push(d, f);
                } else {
                    var i = ga(f);
                    c.push(i);
                    d += i.length;
                }
            }
        return {
            source: c.join(""),
            tags: g
        };
    }
    function v(b, a) {
        var c = {};
        (function() {
            var g = b.concat(a);
            for (var e = g.length; --e >= 0; ) {
                var h = g[e],
                    f = h[3];
                if (f) for (var i = f.length; --i >= 0; ) c[f.charAt(i)] = h;
            }
        })();
        var d = a.length;
        return function(g, e) {
            e = e || 0;
            var h = [e, "pln"],
                f = "",
                i = 0,
                j = g;
            while (j.length) {
                var o,
                    m = null,
                    k,
                    l = c[j.charAt(0)];
                if (l) {
                    k = j.match(l[1]);
                    m = k[0];
                    o = l[0];
                } else {
                    for (var n = 0; n < d; ++n) {
                        l = a[n];
                        var p = l[2];
                        if (p && !p.test(f)) continue;
                        k = j.match(l[1]);
                        if (k) {
                            m = k[0];
                            o = l[0];
                            break;
                        }
                    }
                    if (!m) {
                        o = "pln";
                        m = j.substring(0, 1);
                    }
                }
                h.push(e + i, o);
                i += m.length;
                j = j.substring(m.length);
                if (o !== "com" && /\S/.test(m)) f = m;
            }
            return h;
        };
    }
    var oa = v(
        [],
        [
            ["pln", /^[^<]+/, null],
            ["dec", /^<!\w[^>]*(?:>|$)/, null],
            ["com", /^<!--[\s\S]*?(?:--\>|$)/, null],
            ["src", /^<\?[\s\S]*?(?:\?>|$)/, null],
            ["src", /^<%[\s\S]*?(?:%>|$)/, null],
            ["src", /^<(script|style|xmp)\b[^>]*>[\s\S]*?<\/\1\b[^>]*>/i, null],
            ["tag", /^<\/?\w[^<>]*>/, null]
        ]
    );
    function pa(b) {
        var a = oa(b);
        for (var c = 0; c < a.length; c += 2)
            if (a[c + 1] === "src") {
                var d, g;
                d = a[c];
                g = c + 2 < a.length ? a[c + 2] : b.length;
                var e = b.substring(d, g),
                    h = e.match(/^(<[^>]*>)([\s\S]*)(<\/[^>]*>)$/);
                if (h)
                    a.splice(
                        c,
                        2,
                        d,
                        "tag",
                        d + h[1].length,
                        "src",
                        d + h[1].length + (h[2] || "").length,
                        "tag"
                    );
            }
        return a;
    }
    var qa = v(
        [
            ["atv", /^\'[^\']*(?:\'|$)/, null, "'"],
            ["atv", /^\"[^\"]*(?:\"|$)/, null, '"'],
            ["pun", /^[<>\/=]+/, null, "<>/="]
        ],
        [
            ["tag", /^[\w:\-]+/, /^</],
            ["atv", /^[\w\-]+/, /^=/],
            ["atn", /^[\w:\-]+/, null],
            ["pln", /^\s+/, null, " \t\r\n"]
        ]
    );
    function ra(b, a) {
        for (var c = 0; c < a.length; c += 2) {
            var d = a[c + 1];
            if (d === "tag") {
                var g, e;
                g = a[c];
                e = c + 2 < a.length ? a[c + 2] : b.length;
                var h = b.substring(g, e),
                    f = qa(h, g);
                u(f, a, c, 2);
                c += f.length - 2;
            }
        }
        return a;
    }
    function r(b) {
        var a = [],
            c = [];
        if (b.tripleQuotedStrings)
            a.push([
                "str",
                /^(?:\'\'\'(?:[^\'\\]|\\[\s\S]|\'{1,2}(?=[^\']))*(?:\'\'\'|$)|\"\"\"(?:[^\"\\]|\\[\s\S]|\"{1,2}(?=[^\"]))*(?:\"\"\"|$)|\'(?:[^\\\']|\\[\s\S])*(?:\'|$)|\"(?:[^\\\"]|\\[\s\S])*(?:\"|$))/,
                null,
                "'\""
            ]);
        else if (b.multiLineStrings)
            a.push([
                "str",
                /^(?:\'(?:[^\\\']|\\[\s\S])*(?:\'|$)|\"(?:[^\\\"]|\\[\s\S])*(?:\"|$)|\`(?:[^\\\`]|\\[\s\S])*(?:\`|$))/,
                null,
                "'\"`"
            ]);
        else
            a.push([
                "str",
                /^(?:\'(?:[^\\\'\r\n]|\\.)*(?:\'|$)|\"(?:[^\\\"\r\n]|\\.)*(?:\"|$))/,
                null,
                "\"'"
            ]);
        c.push(["pln", /^(?:[^\'\"\`\/\#]+)/, null, " \r\n"]);
        if (b.hashComments) a.push(["com", /^#[^\r\n]*/, null, "#"]);
        if (b.cStyleComments) c.push(["com", /^\/\/[^\r\n]*/, null]);
        if (b.regexLiterals)
            c.push([
                "str",
                /^\/(?:[^\\\*\/\[]|\\[\s\S]|\[(?:[^\]\\]|\\.)*(?:\]|$))+(?:\/|$)/,
                Y
            ]);
        if (b.cStyleComments) c.push(["com", /^\/\*[\s\S]*?(?:\*\/|$)/, null]);
        var d = x(b.keywords);
        b = null;
        var g = v(a, c),
            e = v(
                [],
                [
                    ["pln", /^\s+/, null, " \r\n"],
                    ["pln", /^[a-z_$@][a-z_$@0-9]*/i, null],
                    ["lit", /^0x[a-f0-9]+[a-z]/i, null],
                    [
                        "lit",
                        /^(?:\d(?:_\d+)*\d*(?:\.\d*)?|\.\d+)(?:e[+\-]?\d+)?[a-z]*/i,
                        null,
                        "123456789"
                    ],
                    ["pun", /^[^\s\w\.$@]+/, null]
                ]
            );
        function h(f, i) {
            for (var j = 0; j < i.length; j += 2) {
                var o = i[j + 1];
                if (o === "pln") {
                    var m, k, l, n;
                    m = i[j];
                    k = j + 2 < i.length ? i[j + 2] : f.length;
                    l = f.substring(m, k);
                    n = e(l, m);
                    for (var p = 0, t = n.length; p < t; p += 2) {
                        var w = n[p + 1];
                        if (w === "pln") {
                            var A = n[p],
                                B = p + 2 < t ? n[p + 2] : l.length,
                                s = f.substring(A, B);
                            if (s === ".") n[p + 1] = "pun";
                            else if (s in d) n[p + 1] = "kwd";
                            else if (/^@?[A-Z][A-Z$]*[a-z][A-Za-z$]*$/.test(s))
                                n[p + 1] = s.charAt(0) === "@" ? "lit" : "typ";
                        }
                    }
                    u(n, i, j, 2);
                    j += n.length - 2;
                }
            }
            return i;
        }
        return function(f) {
            var i = g(f);
            i = h(f, i);
            return i;
        };
    }
    var G = r({
        keywords: W,
        hashComments: true,
        cStyleComments: true,
        multiLineStrings: true,
        regexLiterals: true
    });
    function sa(b, a) {
        for (var c = 0; c < a.length; c += 2) {
            var d = a[c + 1];
            if (d === "src") {
                var g, e;
                g = a[c];
                e = c + 2 < a.length ? a[c + 2] : b.length;
                var h = G(b.substring(g, e));
                for (var f = 0, i = h.length; f < i; f += 2) h[f] += g;
                u(h, a, c, 2);
                c += h.length - 2;
            }
        }
        return a;
    }
    function ta(b, a) {
        var c = false;
        for (var d = 0; d < a.length; d += 2) {
            var g = a[d + 1],
                e,
                h;
            if (g === "atn") {
                e = a[d];
                h = d + 2 < a.length ? a[d + 2] : b.length;
                c = /^on|^style$/i.test(b.substring(e, h));
            } else if (g === "atv") {
                if (c) {
                    e = a[d];
                    h = d + 2 < a.length ? a[d + 2] : b.length;
                    var f = b.substring(e, h),
                        i = f.length,
                        j =
                            i >= 2 &&
                            /^[\"\']/.test(f) &&
                            f.charAt(0) === f.charAt(i - 1),
                        o,
                        m,
                        k;
                    if (j) {
                        m = e + 1;
                        k = h - 1;
                        o = f;
                    } else {
                        m = e + 1;
                        k = h - 1;
                        o = f.substring(1, f.length - 1);
                    }
                    var l = G(o);
                    for (var n = 0, p = l.length; n < p; n += 2) l[n] += m;
                    if (j) {
                        l.push(k, "atv");
                        u(l, a, d + 2, 0);
                    } else u(l, a, d, 2);
                }
                c = false;
            }
        }
        return a;
    }
    function ua(b) {
        var a = pa(b);
        a = ra(b, a);
        a = sa(b, a);
        a = ta(b, a);
        return a;
    }
    function va(b, a, c) {
        var d = [],
            g = 0,
            e = null,
            h = null,
            f = 0,
            i = 0,
            j = ia(8);
        function o(k) {
            if (k > g) {
                if (e && e !== h) {
                    d.push("</span>");
                    e = null;
                }
                if (!e && h) {
                    e = h;
                    d.push('<span class="', e, '">');
                }
                var l = E(j(b.substring(g, k)))
                    .replace(/(\r\n?|\n| ) /g, "$1&nbsp;")
                    .replace(/\r\n?|\n/g, "<br />");
                d.push(l);
                g = k;
            }
        }
        while (true) {
            var m;
            m = f < a.length ? (i < c.length ? a[f] <= c[i] : true) : false;
            if (m) {
                o(a[f]);
                if (e) {
                    d.push("</span>");
                    e = null;
                }
                d.push(a[f + 1]);
                f += 2;
            } else if (i < c.length) {
                o(c[i]);
                h = c[i + 1];
                i += 2;
            } else break;
        }
        o(b.length);
        if (e) d.push("</span>");
        return d.join("");
    }
    var C = {};
    function q(b, a) {
        for (var c = a.length; --c >= 0; ) {
            var d = a[c];
            if (!C.hasOwnProperty(d)) C[d] = b;
            else if ("console" in window)
                console.log("cannot override language handler %s", d);
        }
    }
    q(G, ["default-code"]);
    q(ua, ["default-markup", "html", "htm", "xhtml", "xml", "xsl"]);
    q(
        r({
            keywords: I,
            hashComments: true,
            cStyleComments: true
        }),
        ["c", "cc", "cpp", "cs", "cxx", "cyc"]
    );
    q(
        r({
            keywords: J,
            cStyleComments: true
        }),
        ["java"]
    );
    q(
        r({
            keywords: O,
            hashComments: true,
            multiLineStrings: true
        }),
        ["bsh", "csh", "sh"]
    );
    q(
        r({
            keywords: M,
            hashComments: true,
            multiLineStrings: true,
            tripleQuotedStrings: true
        }),
        ["cv", "py"]
    );
    q(
        r({
            keywords: L,
            hashComments: true,
            multiLineStrings: true,
            regexLiterals: true
        }),
        ["perl", "pl", "pm"]
    );
    q(
        r({
            keywords: N,
            hashComments: true,
            multiLineStrings: true,
            regexLiterals: true
        }),
        ["rb"]
    );
    q(
        r({
            keywords: K,
            cStyleComments: true,
            regexLiterals: true
        }),
        ["js"]
    );
    function T(b, a) {
        try {
            var c = na(b),
                d = c.source,
                g = c.tags;
            if (!C.hasOwnProperty(a))
                a = /^\s*</.test(d) ? "default-markup" : "default-code";
            var e = C[a].call({}, d);
            return va(d, g, e);
        } catch (h) {
            if ("console" in window) {
                console.log(h);
                console.trace();
            }
            return b;
        }
    }
    function wa(b) {
        var a = H(),
            c = [
                document.getElementsByTagName("pre"),
                document.getElementsByTagName("code"),
                document.getElementsByTagName("li"),
                document.getElementsByTagName("xmp")
            ],
            d = [];
        for (var g = 0; g < c.length; ++g)
            for (var e = 0; e < c[g].length; ++e) d.push(c[g][e]);
        c = null;
        var h = 0;
        function f() {
            var i = new Date().getTime() + 250;
            for (; h < d.length && new Date().getTime() < i; h++) {
                var j = d[h];
                if (j.className && j.className.indexOf("prettyprint") >= 0) {
                    var o = j.className.match(/\blang-(\w+)\b/);
                    if (o) o = o[1];
                    var m = false;
                    for (var k = j.parentNode; k; k = k.parentNode)
                        if (
                            (k.tagName === "pre" ||
                                k.tagName === "code" ||
                                k.tagName === "xmp") &&
                            k.className &&
                            k.className.indexOf("prettyprint") >= 0
                        ) {
                            m = true;
                            break;
                        }
                    if (!m) {
                        var l = ha(j);
                        l = l.replace(/(?:\r\n?|\n)$/, "");
                        var n = T(l, o);
                        if (!S(j)) j.innerHTML = n;
                        else {
                            var p = document.createElement("PRE");
                            for (var t = 0; t < j.attributes.length; ++t) {
                                var w = j.attributes[t];
                                if (w.specified)
                                    p.setAttribute(w.name, w.value);
                            }
                            p.innerHTML = n;
                            j.parentNode.replaceChild(p, j);
                            p = j;
                        }
                        if (a && j.tagName === "PRE") {
                            var A = j.getElementsByTagName("br");
                            for (var B = A.length; --B >= 0; ) {
                                var s = A[B];
                                s.parentNode.replaceChild(
                                    document.createTextNode("\r\n"),
                                    s
                                );
                            }
                        }
                    }
                }
            }
            if (h < d.length) setTimeout(f, 250);
            else if (b) b();
        }
        f();
    }
    window.PR_normalizedHtml = z;
    window.prettyPrintOne = T;
    window.prettyPrint = wa;
    window.PR = {
        createSimpleLexer: v,
        registerLangHandler: q,
        sourceDecorator: r,
        PR_ATTRIB_NAME: "atn",
        PR_ATTRIB_VALUE: "atv",
        PR_COMMENT: "com",
        PR_DECLARATION: "dec",
        PR_KEYWORD: "kwd",
        PR_LITERAL: "lit",
        PR_PLAIN: "pln",
        PR_PUNCTUATION: "pun",
        PR_SOURCE: "src",
        PR_STRING: "str",
        PR_TAG: "tag",
        PR_TYPE: "typ"
    };
})();


/***/ }),

/***/ 79863:
/*!********************************************!*\
  !*** ./runestone/parsons/js/dagHelpers.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DiGraph: () => (/* binding */ DiGraph),
/* harmony export */   hasPath: () => (/* binding */ hasPath),
/* harmony export */   isDirectedAcyclicGraph: () => (/* binding */ isDirectedAcyclicGraph)
/* harmony export */ });

/**
 * This file adapted from JSNetworkX: https://github.com/fkling/JSNetworkX
 * Copyright (C) 2012 Felix Kling <felix.kling@gmx.net>
 * JSNetworkX is distributed with the BSD license
 */

function hasPath(G, { source, target }) {
    try {
        bidirectionalShortestPath(G, source, target);
    } catch (error) {
        if (error instanceof JSNetworkXNoPath) {
            return false;
        }
        throw error;
    }
    return true;
}

function nodesAreEqual(a, b) {
    return a === b || (typeof a === "object" && a.toString() === b.toString());
}

function bidirectionalShortestPath(G, source, target) {
    // call helper to do the real work
    var [pred, succ, w] = bidirectionalPredSucc(G, source, target);

    // build path from pred+w+succ
    var path = [];
    // from source to w
    while (w != null) {
        path.push(w);
        w = pred.get(w);
    }
    w = succ.get(path[0]);
    path.reverse();
    // from w to target
    while (w != null) {
        path.push(w);
        w = succ.get(w);
    }
    return path;
}

function bidirectionalPredSucc(G, source, target) {
    // does BFS from both source and target and meets in the middle
    if (nodesAreEqual(source, target)) {
        return [new Map([[source, null]]), new Map([[target, null]]), source];
    }

    // handle either directed or undirected
    var gpred, gsucc;
    gpred = G.predecessorsIter.bind(G);
    gsucc = G.successorsIter.bind(G);

    // predecesssor and successors in search
    var pred = new Map([[source, null]]);
    var succ = new Map([[target, null]]);
    //
    // initialize fringes, start with forward
    var forwardFringe = [source];
    var reverseFringe = [target];
    var thisLevel;

    /*jshint newcap:false*/
    while (forwardFringe.length > 0 && reverseFringe.length > 0) {
        if (forwardFringe.length <= reverseFringe.length) {
            thisLevel = forwardFringe;
            forwardFringe = [];
            for (let v of thisLevel) {
                for (let w of gsucc(v)) {
                    if (!pred.has(w)) {
                        forwardFringe.push(w);
                        pred.set(w, v);
                    }
                    if (succ.has(w)) {
                        return [pred, succ, w]; // found path
                    }
                }
            }
        } else {
            thisLevel = reverseFringe;
            reverseFringe = [];
            for (let v of thisLevel) {
                for (let w of gpred(v)) {
                    if (!succ.has(w)) {
                        reverseFringe.push(w);
                        succ.set(w, v);
                    }
                    if (pred.has(w)) {
                        return [pred, succ, w]; // found path
                    }
                }
            }
        }
    }
    throw new JSNetworkXNoPath(
        "No path between " +
            source.toString() +
            " and " +
            target.toString() +
            ".",
    );
}

function topologicalSort(G, optNbunch) {
    // nonrecursive version
    var seen = new Set();
    var orderExplored = []; // provide order and
    // fast search without more general priorityDictionary
    var explored = new Set();

    if (optNbunch == null) {
        optNbunch = G.nodesIter();
    }

    for (let v of optNbunch) {
        // process all vertices in G
        if (explored.has(v)) {
            return; // continue
        }

        var fringe = [v]; // nodes yet to look at
        while (fringe.length > 0) {
            var w = fringe[fringe.length - 1]; // depth first search
            if (explored.has(w)) {
                // already looked down this branch
                fringe.pop();
                continue;
            }
            seen.add(w); // mark as seen
            // Check successors for cycles for new nodes
            var newNodes = [];
            /*eslint-disable no-loop-func*/
            G.get(w).forEach(function (_, n) {
                if (!explored.has(n)) {
                    if (seen.has(n)) {
                        // CYCLE !!
                        throw new JSNetworkXUnfeasible(
                            "Graph contains a cycle.",
                        );
                    }
                    newNodes.push(n);
                }
            });
            /*eslint-enable no-loop-func*/
            if (newNodes.length > 0) {
                // add new nodes to fringe
                fringe.push.apply(fringe, newNodes);
            } else {
                explored.add(w);
                orderExplored.unshift(w);
            }
        }
    }

    return orderExplored;
}

function isDirectedAcyclicGraph(G) {
    try {
        topologicalSort(G);
        return true;
    } catch (ex) {
        if (ex instanceof JSNetworkXUnfeasible) {
            return false;
        }
        throw ex;
    }
}

class DiGraph {
    constructor() {
        this.graph = {}; // dictionary for graph attributes
        this.node = new Map(); // dictionary for node attributes
        // We store two adjacency lists:
        // the predecessors of node n are stored in the dict self.pred
        // the successors of node n are stored in the dict self.succ=self.adj
        this.adj = new Map(); // empty adjacency dictionary
        this.pred = new Map(); // predecessor
        this.succ = this.adj; // successor

        this.edge = this.adj;
    }

    addNode(n) {
        if (!this.succ.has(n)) {
            this.succ.set(n, new Map());
            this.pred.set(n, new Map());
            this.node.set(n);
        }
    }

    addEdge(u, v) {
        // add nodes
        if (!this.succ.has(u)) {
            this.succ.set(u, new Map());
            this.pred.set(u, new Map());
            this.node.set(u, {});
        }

        if (!this.succ.has(v)) {
            this.succ.set(v, new Map());
            this.pred.set(v, new Map());
            this.node.set(v, {});
        }

        // add the edge
        var datadict = this.adj.get(u).get(v) || {};
        this.succ.get(u).set(v, datadict);
        this.pred.get(v).set(u, datadict);
    }

    nodes(optData = false) {
        return Array.from(optData ? this.node.entries() : this.node.keys());
    }

    edges(optNbunch, optData = false) {
        return Array.from(this.edgesIter(optNbunch, optData));
    }

    nodesIter(optData = false) {
        if (optData) {
            return toIterator(this.node);
        }
        return this.node.keys();
    }

    get(n) {
        var value = this.adj.get(n);
        if (typeof value === "undefined") {
            throw new KeyError("Graph does not contain node " + n + ".");
        }
        return value;
    }

    numberOfNodes() {
        return this.node.size;
    }

    *nbunchIter(optNbunch) {
        if (optNbunch == null) {
            // include all nodes
            /*jshint expr:true*/
            yield* this.adj.keys();
        } else if (this.hasNode(optNbunch)) {
            // if nbunch is a single node
            yield optNbunch;
        } else {
            // if nbunch is a sequence of nodes
            var adj = this.adj;

            try {
                for (var n of toIterator(optNbunch)) {
                    if (adj.has(n)) {
                        yield n;
                    }
                }
            } catch (ex) {
                if (ex instanceof TypeError) {
                    throw new JSNetworkXError(
                        "nbunch is not a node or a sequence of nodes",
                    );
                }
            }
        }
    }

    *edgesIter(optNbunch, optData = false) {
        // handle calls with opt_data being the only argument
        if (isBoolean(optNbunch)) {
            optData = optNbunch;
            optNbunch = undefined;
        }

        var nodesNbrs;

        if (optNbunch === undefined) {
            nodesNbrs = this.adj;
        } else {
            nodesNbrs = mapIterator(this.nbunchIter(optNbunch), (n) =>
                tuple2(n, this.adj.get(n)),
            );
        }

        for (var nodeNbrs of nodesNbrs) {
            for (var nbrData of nodeNbrs[1]) {
                var result = [nodeNbrs[0], nbrData[0]];
                if (optData) {
                    result[2] = nbrData[1];
                }
                yield result;
            }
        }
    }

    reverse(optCopy = true) {
        var H;
        if (optCopy) {
            H = new this.constructor(null, {
                name: "Reverse of (" + this.name + ")",
            });
            H.addNodesFrom(this);
            H.addEdgesFrom(
                mapIterator(this.edgesIter(null, true), (edge) =>
                    tuple3c(edge[1], edge[0], deepcopy(edge[2]), edge),
                ),
            );
            H.graph = deepcopy(this.graph);
            H.node = deepcopy(this.node);
        } else {
            var thisPred = this.pred;
            var thisSucc = this.succ;

            this.succ = thisPred;
            this.pred = thisSucc;
            this.adj = this.succ;
            H = this;
        }
        return H;
    }

    successorsIter(n) {
        var nbrs = this.succ.get(n);
        if (nbrs !== undefined) {
            return nbrs.keys();
        }
        throw new JSNetworkXError(
            sprintf('The node "%j" is not in the digraph.', n),
        );
    }

    predecessorsIter(n) {
        var nbrs = this.pred.get(n);
        if (nbrs !== undefined) {
            return nbrs.keys();
        }
        throw new JSNetworkXError(
            sprintf('The node "%j" is not in the digraph.', n),
        );
    }

    successors(n) {
        return Array.from(this.successorsIter(n));
    }

    predecessors(n) {
        return Array.from(this.predecessorsIter(n));
    }
}

class JSNetworkXException {
    constructor(message) {
        this.name = "JSNetworkXException";
        this.message = message;
    }
}

class JSNetworkXAlgorithmError extends JSNetworkXException {
    constructor(message) {
        super(message);
        this.name = "JSNetworkXAlgorithmError";
    }
}

class JSNetworkXError extends JSNetworkXException {
    constructor(message) {
        super(message);
        this.name = "JSNetworkXError";
    }
}

class JSNetworkXUnfeasible extends JSNetworkXAlgorithmError {
    constructor(message) {
        super(message);
        this.name = "JSNetworkXUnfeasible";
    }
}

class JSNetworkXNoPath extends JSNetworkXUnfeasible {
    constructor(message) {
        super(message);
        this.name = "JSNetworkXNoPath";
    }
}

// function from LoDash, needed by functions from JSNetworkX
function isObjectLike(value) {
    return !!value && typeof value == "object";
}

// function from LoDash, needed by functions from JSNetworkX
function isBoolean(value) {
    var boolTag = "[object Boolean]";
    return (
        value === true ||
        value === false ||
        (isObjectLike(value) &&
            Object.prototype.toString.call(value) == boolTag)
    );
}


/***/ }),

/***/ 88210:
/*!********************************************!*\
  !*** ./runestone/parsons/js/hammer.min.js ***!
  \********************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_RESULT__;/*! Hammer.JS - v2.0.8 - 2016-04-23
 * http://hammerjs.github.io/
 *
 * Copyright (c) 2016 Jorik Tangelder;
 * Licensed under the MIT license */
!function(a,b,c,d){"use strict";function e(a,b,c){return setTimeout(j(a,c),b)}function f(a,b,c){return Array.isArray(a)?(g(a,c[b],c),!0):!1}function g(a,b,c){var e;if(a)if(a.forEach)a.forEach(b,c);else if(a.length!==d)for(e=0;e<a.length;)b.call(c,a[e],e,a),e++;else for(e in a)a.hasOwnProperty(e)&&b.call(c,a[e],e,a)}function h(b,c,d){var e="DEPRECATED METHOD: "+c+"\n"+d+" AT \n";return function(){var c=new Error("get-stack-trace"),d=c&&c.stack?c.stack.replace(/^[^\(]+?[\n$]/gm,"").replace(/^\s+at\s+/gm,"").replace(/^Object.<anonymous>\s*\(/gm,"{anonymous}()@"):"Unknown Stack Trace",f=a.console&&(a.console.warn||a.console.log);return f&&f.call(a.console,e,d),b.apply(this,arguments)}}function i(a,b,c){var d,e=b.prototype;d=a.prototype=Object.create(e),d.constructor=a,d._super=e,c&&la(d,c)}function j(a,b){return function(){return a.apply(b,arguments)}}function k(a,b){return typeof a==oa?a.apply(b?b[0]||d:d,b):a}function l(a,b){return a===d?b:a}function m(a,b,c){g(q(b),function(b){a.addEventListener(b,c,!1)})}function n(a,b,c){g(q(b),function(b){a.removeEventListener(b,c,!1)})}function o(a,b){for(;a;){if(a==b)return!0;a=a.parentNode}return!1}function p(a,b){return a.indexOf(b)>-1}function q(a){return a.trim().split(/\s+/g)}function r(a,b,c){if(a.indexOf&&!c)return a.indexOf(b);for(var d=0;d<a.length;){if(c&&a[d][c]==b||!c&&a[d]===b)return d;d++}return-1}function s(a){return Array.prototype.slice.call(a,0)}function t(a,b,c){for(var d=[],e=[],f=0;f<a.length;){var g=b?a[f][b]:a[f];r(e,g)<0&&d.push(a[f]),e[f]=g,f++}return c&&(d=b?d.sort(function(a,c){return a[b]>c[b]}):d.sort()),d}function u(a,b){for(var c,e,f=b[0].toUpperCase()+b.slice(1),g=0;g<ma.length;){if(c=ma[g],e=c?c+f:b,e in a)return e;g++}return d}function v(){return ua++}function w(b){var c=b.ownerDocument||b;return c.defaultView||c.parentWindow||a}function x(a,b){var c=this;this.manager=a,this.callback=b,this.element=a.element,this.target=a.options.inputTarget,this.domHandler=function(b){k(a.options.enable,[a])&&c.handler(b)},this.init()}function y(a){var b,c=a.options.inputClass;return new(b=c?c:xa?M:ya?P:wa?R:L)(a,z)}function z(a,b,c){var d=c.pointers.length,e=c.changedPointers.length,f=b&Ea&&d-e===0,g=b&(Ga|Ha)&&d-e===0;c.isFirst=!!f,c.isFinal=!!g,f&&(a.session={}),c.eventType=b,A(a,c),a.emit("hammer.input",c),a.recognize(c),a.session.prevInput=c}function A(a,b){var c=a.session,d=b.pointers,e=d.length;c.firstInput||(c.firstInput=D(b)),e>1&&!c.firstMultiple?c.firstMultiple=D(b):1===e&&(c.firstMultiple=!1);var f=c.firstInput,g=c.firstMultiple,h=g?g.center:f.center,i=b.center=E(d);b.timeStamp=ra(),b.deltaTime=b.timeStamp-f.timeStamp,b.angle=I(h,i),b.distance=H(h,i),B(c,b),b.offsetDirection=G(b.deltaX,b.deltaY);var j=F(b.deltaTime,b.deltaX,b.deltaY);b.overallVelocityX=j.x,b.overallVelocityY=j.y,b.overallVelocity=qa(j.x)>qa(j.y)?j.x:j.y,b.scale=g?K(g.pointers,d):1,b.rotation=g?J(g.pointers,d):0,b.maxPointers=c.prevInput?b.pointers.length>c.prevInput.maxPointers?b.pointers.length:c.prevInput.maxPointers:b.pointers.length,C(c,b);var k=a.element;o(b.srcEvent.target,k)&&(k=b.srcEvent.target),b.target=k}function B(a,b){var c=b.center,d=a.offsetDelta||{},e=a.prevDelta||{},f=a.prevInput||{};b.eventType!==Ea&&f.eventType!==Ga||(e=a.prevDelta={x:f.deltaX||0,y:f.deltaY||0},d=a.offsetDelta={x:c.x,y:c.y}),b.deltaX=e.x+(c.x-d.x),b.deltaY=e.y+(c.y-d.y)}function C(a,b){var c,e,f,g,h=a.lastInterval||b,i=b.timeStamp-h.timeStamp;if(b.eventType!=Ha&&(i>Da||h.velocity===d)){var j=b.deltaX-h.deltaX,k=b.deltaY-h.deltaY,l=F(i,j,k);e=l.x,f=l.y,c=qa(l.x)>qa(l.y)?l.x:l.y,g=G(j,k),a.lastInterval=b}else c=h.velocity,e=h.velocityX,f=h.velocityY,g=h.direction;b.velocity=c,b.velocityX=e,b.velocityY=f,b.direction=g}function D(a){for(var b=[],c=0;c<a.pointers.length;)b[c]={clientX:pa(a.pointers[c].clientX),clientY:pa(a.pointers[c].clientY)},c++;return{timeStamp:ra(),pointers:b,center:E(b),deltaX:a.deltaX,deltaY:a.deltaY}}function E(a){var b=a.length;if(1===b)return{x:pa(a[0].clientX),y:pa(a[0].clientY)};for(var c=0,d=0,e=0;b>e;)c+=a[e].clientX,d+=a[e].clientY,e++;return{x:pa(c/b),y:pa(d/b)}}function F(a,b,c){return{x:b/a||0,y:c/a||0}}function G(a,b){return a===b?Ia:qa(a)>=qa(b)?0>a?Ja:Ka:0>b?La:Ma}function H(a,b,c){c||(c=Qa);var d=b[c[0]]-a[c[0]],e=b[c[1]]-a[c[1]];return Math.sqrt(d*d+e*e)}function I(a,b,c){c||(c=Qa);var d=b[c[0]]-a[c[0]],e=b[c[1]]-a[c[1]];return 180*Math.atan2(e,d)/Math.PI}function J(a,b){return I(b[1],b[0],Ra)+I(a[1],a[0],Ra)}function K(a,b){return H(b[0],b[1],Ra)/H(a[0],a[1],Ra)}function L(){this.evEl=Ta,this.evWin=Ua,this.pressed=!1,x.apply(this,arguments)}function M(){this.evEl=Xa,this.evWin=Ya,x.apply(this,arguments),this.store=this.manager.session.pointerEvents=[]}function N(){this.evTarget=$a,this.evWin=_a,this.started=!1,x.apply(this,arguments)}function O(a,b){var c=s(a.touches),d=s(a.changedTouches);return b&(Ga|Ha)&&(c=t(c.concat(d),"identifier",!0)),[c,d]}function P(){this.evTarget=bb,this.targetIds={},x.apply(this,arguments)}function Q(a,b){var c=s(a.touches),d=this.targetIds;if(b&(Ea|Fa)&&1===c.length)return d[c[0].identifier]=!0,[c,c];var e,f,g=s(a.changedTouches),h=[],i=this.target;if(f=c.filter(function(a){return o(a.target,i)}),b===Ea)for(e=0;e<f.length;)d[f[e].identifier]=!0,e++;for(e=0;e<g.length;)d[g[e].identifier]&&h.push(g[e]),b&(Ga|Ha)&&delete d[g[e].identifier],e++;return h.length?[t(f.concat(h),"identifier",!0),h]:void 0}function R(){x.apply(this,arguments);var a=j(this.handler,this);this.touch=new P(this.manager,a),this.mouse=new L(this.manager,a),this.primaryTouch=null,this.lastTouches=[]}function S(a,b){a&Ea?(this.primaryTouch=b.changedPointers[0].identifier,T.call(this,b)):a&(Ga|Ha)&&T.call(this,b)}function T(a){var b=a.changedPointers[0];if(b.identifier===this.primaryTouch){var c={x:b.clientX,y:b.clientY};this.lastTouches.push(c);var d=this.lastTouches,e=function(){var a=d.indexOf(c);a>-1&&d.splice(a,1)};setTimeout(e,cb)}}function U(a){for(var b=a.srcEvent.clientX,c=a.srcEvent.clientY,d=0;d<this.lastTouches.length;d++){var e=this.lastTouches[d],f=Math.abs(b-e.x),g=Math.abs(c-e.y);if(db>=f&&db>=g)return!0}return!1}function V(a,b){this.manager=a,this.set(b)}function W(a){if(p(a,jb))return jb;var b=p(a,kb),c=p(a,lb);return b&&c?jb:b||c?b?kb:lb:p(a,ib)?ib:hb}function X(){if(!fb)return!1;var b={},c=a.CSS&&a.CSS.supports;return["auto","manipulation","pan-y","pan-x","pan-x pan-y","none"].forEach(function(d){b[d]=c?a.CSS.supports("touch-action",d):!0}),b}function Y(a){this.options=la({},this.defaults,a||{}),this.id=v(),this.manager=null,this.options.enable=l(this.options.enable,!0),this.state=nb,this.simultaneous={},this.requireFail=[]}function Z(a){return a&sb?"cancel":a&qb?"end":a&pb?"move":a&ob?"start":""}function $(a){return a==Ma?"down":a==La?"up":a==Ja?"left":a==Ka?"right":""}function _(a,b){var c=b.manager;return c?c.get(a):a}function aa(){Y.apply(this,arguments)}function ba(){aa.apply(this,arguments),this.pX=null,this.pY=null}function ca(){aa.apply(this,arguments)}function da(){Y.apply(this,arguments),this._timer=null,this._input=null}function ea(){aa.apply(this,arguments)}function fa(){aa.apply(this,arguments)}function ga(){Y.apply(this,arguments),this.pTime=!1,this.pCenter=!1,this._timer=null,this._input=null,this.count=0}function ha(a,b){return b=b||{},b.recognizers=l(b.recognizers,ha.defaults.preset),new ia(a,b)}function ia(a,b){this.options=la({},ha.defaults,b||{}),this.options.inputTarget=this.options.inputTarget||a,this.handlers={},this.session={},this.recognizers=[],this.oldCssProps={},this.element=a,this.input=y(this),this.touchAction=new V(this,this.options.touchAction),ja(this,!0),g(this.options.recognizers,function(a){var b=this.add(new a[0](a[1]));a[2]&&b.recognizeWith(a[2]),a[3]&&b.requireFailure(a[3])},this)}function ja(a,b){var c=a.element;if(c.style){var d;g(a.options.cssProps,function(e,f){d=u(c.style,f),b?(a.oldCssProps[d]=c.style[d],c.style[d]=e):c.style[d]=a.oldCssProps[d]||""}),b||(a.oldCssProps={})}}function ka(a,c){var d=b.createEvent("Event");d.initEvent(a,!0,!0),d.gesture=c,c.target.dispatchEvent(d)}var la,ma=["","webkit","Moz","MS","ms","o"],na=b.createElement("div"),oa="function",pa=Math.round,qa=Math.abs,ra=Date.now;la="function"!=typeof Object.assign?function(a){if(a===d||null===a)throw new TypeError("Cannot convert undefined or null to object");for(var b=Object(a),c=1;c<arguments.length;c++){var e=arguments[c];if(e!==d&&null!==e)for(var f in e)e.hasOwnProperty(f)&&(b[f]=e[f])}return b}:Object.assign;var sa=h(function(a,b,c){for(var e=Object.keys(b),f=0;f<e.length;)(!c||c&&a[e[f]]===d)&&(a[e[f]]=b[e[f]]),f++;return a},"extend","Use `assign`."),ta=h(function(a,b){return sa(a,b,!0)},"merge","Use `assign`."),ua=1,va=/mobile|tablet|ip(ad|hone|od)|android/i,wa="ontouchstart"in a,xa=u(a,"PointerEvent")!==d,ya=wa&&va.test(navigator.userAgent),za="touch",Aa="pen",Ba="mouse",Ca="kinect",Da=25,Ea=1,Fa=2,Ga=4,Ha=8,Ia=1,Ja=2,Ka=4,La=8,Ma=16,Na=Ja|Ka,Oa=La|Ma,Pa=Na|Oa,Qa=["x","y"],Ra=["clientX","clientY"];x.prototype={handler:function(){},init:function(){this.evEl&&m(this.element,this.evEl,this.domHandler),this.evTarget&&m(this.target,this.evTarget,this.domHandler),this.evWin&&m(w(this.element),this.evWin,this.domHandler)},destroy:function(){this.evEl&&n(this.element,this.evEl,this.domHandler),this.evTarget&&n(this.target,this.evTarget,this.domHandler),this.evWin&&n(w(this.element),this.evWin,this.domHandler)}};var Sa={mousedown:Ea,mousemove:Fa,mouseup:Ga},Ta="mousedown",Ua="mousemove mouseup";i(L,x,{handler:function(a){var b=Sa[a.type];b&Ea&&0===a.button&&(this.pressed=!0),b&Fa&&1!==a.which&&(b=Ga),this.pressed&&(b&Ga&&(this.pressed=!1),this.callback(this.manager,b,{pointers:[a],changedPointers:[a],pointerType:Ba,srcEvent:a}))}});var Va={pointerdown:Ea,pointermove:Fa,pointerup:Ga,pointercancel:Ha,pointerout:Ha},Wa={2:za,3:Aa,4:Ba,5:Ca},Xa="pointerdown",Ya="pointermove pointerup pointercancel";a.MSPointerEvent&&!a.PointerEvent&&(Xa="MSPointerDown",Ya="MSPointerMove MSPointerUp MSPointerCancel"),i(M,x,{handler:function(a){var b=this.store,c=!1,d=a.type.toLowerCase().replace("ms",""),e=Va[d],f=Wa[a.pointerType]||a.pointerType,g=f==za,h=r(b,a.pointerId,"pointerId");e&Ea&&(0===a.button||g)?0>h&&(b.push(a),h=b.length-1):e&(Ga|Ha)&&(c=!0),0>h||(b[h]=a,this.callback(this.manager,e,{pointers:b,changedPointers:[a],pointerType:f,srcEvent:a}),c&&b.splice(h,1))}});var Za={touchstart:Ea,touchmove:Fa,touchend:Ga,touchcancel:Ha},$a="touchstart",_a="touchstart touchmove touchend touchcancel";i(N,x,{handler:function(a){var b=Za[a.type];if(b===Ea&&(this.started=!0),this.started){var c=O.call(this,a,b);b&(Ga|Ha)&&c[0].length-c[1].length===0&&(this.started=!1),this.callback(this.manager,b,{pointers:c[0],changedPointers:c[1],pointerType:za,srcEvent:a})}}});var ab={touchstart:Ea,touchmove:Fa,touchend:Ga,touchcancel:Ha},bb="touchstart touchmove touchend touchcancel";i(P,x,{handler:function(a){var b=ab[a.type],c=Q.call(this,a,b);c&&this.callback(this.manager,b,{pointers:c[0],changedPointers:c[1],pointerType:za,srcEvent:a})}});var cb=2500,db=25;i(R,x,{handler:function(a,b,c){var d=c.pointerType==za,e=c.pointerType==Ba;if(!(e&&c.sourceCapabilities&&c.sourceCapabilities.firesTouchEvents)){if(d)S.call(this,b,c);else if(e&&U.call(this,c))return;this.callback(a,b,c)}},destroy:function(){this.touch.destroy(),this.mouse.destroy()}});var eb=u(na.style,"touchAction"),fb=eb!==d,gb="compute",hb="auto",ib="manipulation",jb="none",kb="pan-x",lb="pan-y",mb=X();V.prototype={set:function(a){a==gb&&(a=this.compute()),fb&&this.manager.element.style&&mb[a]&&(this.manager.element.style[eb]=a),this.actions=a.toLowerCase().trim()},update:function(){this.set(this.manager.options.touchAction)},compute:function(){var a=[];return g(this.manager.recognizers,function(b){k(b.options.enable,[b])&&(a=a.concat(b.getTouchAction()))}),W(a.join(" "))},preventDefaults:function(a){var b=a.srcEvent,c=a.offsetDirection;if(this.manager.session.prevented)return void b.preventDefault();var d=this.actions,e=p(d,jb)&&!mb[jb],f=p(d,lb)&&!mb[lb],g=p(d,kb)&&!mb[kb];if(e){var h=1===a.pointers.length,i=a.distance<2,j=a.deltaTime<250;if(h&&i&&j)return}return g&&f?void 0:e||f&&c&Na||g&&c&Oa?this.preventSrc(b):void 0},preventSrc:function(a){this.manager.session.prevented=!0,a.preventDefault()}};var nb=1,ob=2,pb=4,qb=8,rb=qb,sb=16,tb=32;Y.prototype={defaults:{},set:function(a){return la(this.options,a),this.manager&&this.manager.touchAction.update(),this},recognizeWith:function(a){if(f(a,"recognizeWith",this))return this;var b=this.simultaneous;return a=_(a,this),b[a.id]||(b[a.id]=a,a.recognizeWith(this)),this},dropRecognizeWith:function(a){return f(a,"dropRecognizeWith",this)?this:(a=_(a,this),delete this.simultaneous[a.id],this)},requireFailure:function(a){if(f(a,"requireFailure",this))return this;var b=this.requireFail;return a=_(a,this),-1===r(b,a)&&(b.push(a),a.requireFailure(this)),this},dropRequireFailure:function(a){if(f(a,"dropRequireFailure",this))return this;a=_(a,this);var b=r(this.requireFail,a);return b>-1&&this.requireFail.splice(b,1),this},hasRequireFailures:function(){return this.requireFail.length>0},canRecognizeWith:function(a){return!!this.simultaneous[a.id]},emit:function(a){function b(b){c.manager.emit(b,a)}var c=this,d=this.state;qb>d&&b(c.options.event+Z(d)),b(c.options.event),a.additionalEvent&&b(a.additionalEvent),d>=qb&&b(c.options.event+Z(d))},tryEmit:function(a){return this.canEmit()?this.emit(a):void(this.state=tb)},canEmit:function(){for(var a=0;a<this.requireFail.length;){if(!(this.requireFail[a].state&(tb|nb)))return!1;a++}return!0},recognize:function(a){var b=la({},a);return k(this.options.enable,[this,b])?(this.state&(rb|sb|tb)&&(this.state=nb),this.state=this.process(b),void(this.state&(ob|pb|qb|sb)&&this.tryEmit(b))):(this.reset(),void(this.state=tb))},process:function(a){},getTouchAction:function(){},reset:function(){}},i(aa,Y,{defaults:{pointers:1},attrTest:function(a){var b=this.options.pointers;return 0===b||a.pointers.length===b},process:function(a){var b=this.state,c=a.eventType,d=b&(ob|pb),e=this.attrTest(a);return d&&(c&Ha||!e)?b|sb:d||e?c&Ga?b|qb:b&ob?b|pb:ob:tb}}),i(ba,aa,{defaults:{event:"pan",threshold:10,pointers:1,direction:Pa},getTouchAction:function(){var a=this.options.direction,b=[];return a&Na&&b.push(lb),a&Oa&&b.push(kb),b},directionTest:function(a){var b=this.options,c=!0,d=a.distance,e=a.direction,f=a.deltaX,g=a.deltaY;return e&b.direction||(b.direction&Na?(e=0===f?Ia:0>f?Ja:Ka,c=f!=this.pX,d=Math.abs(a.deltaX)):(e=0===g?Ia:0>g?La:Ma,c=g!=this.pY,d=Math.abs(a.deltaY))),a.direction=e,c&&d>b.threshold&&e&b.direction},attrTest:function(a){return aa.prototype.attrTest.call(this,a)&&(this.state&ob||!(this.state&ob)&&this.directionTest(a))},emit:function(a){this.pX=a.deltaX,this.pY=a.deltaY;var b=$(a.direction);b&&(a.additionalEvent=this.options.event+b),this._super.emit.call(this,a)}}),i(ca,aa,{defaults:{event:"pinch",threshold:0,pointers:2},getTouchAction:function(){return[jb]},attrTest:function(a){return this._super.attrTest.call(this,a)&&(Math.abs(a.scale-1)>this.options.threshold||this.state&ob)},emit:function(a){if(1!==a.scale){var b=a.scale<1?"in":"out";a.additionalEvent=this.options.event+b}this._super.emit.call(this,a)}}),i(da,Y,{defaults:{event:"press",pointers:1,time:251,threshold:9},getTouchAction:function(){return[hb]},process:function(a){var b=this.options,c=a.pointers.length===b.pointers,d=a.distance<b.threshold,f=a.deltaTime>b.time;if(this._input=a,!d||!c||a.eventType&(Ga|Ha)&&!f)this.reset();else if(a.eventType&Ea)this.reset(),this._timer=e(function(){this.state=rb,this.tryEmit()},b.time,this);else if(a.eventType&Ga)return rb;return tb},reset:function(){clearTimeout(this._timer)},emit:function(a){this.state===rb&&(a&&a.eventType&Ga?this.manager.emit(this.options.event+"up",a):(this._input.timeStamp=ra(),this.manager.emit(this.options.event,this._input)))}}),i(ea,aa,{defaults:{event:"rotate",threshold:0,pointers:2},getTouchAction:function(){return[jb]},attrTest:function(a){return this._super.attrTest.call(this,a)&&(Math.abs(a.rotation)>this.options.threshold||this.state&ob)}}),i(fa,aa,{defaults:{event:"swipe",threshold:10,velocity:.3,direction:Na|Oa,pointers:1},getTouchAction:function(){return ba.prototype.getTouchAction.call(this)},attrTest:function(a){var b,c=this.options.direction;return c&(Na|Oa)?b=a.overallVelocity:c&Na?b=a.overallVelocityX:c&Oa&&(b=a.overallVelocityY),this._super.attrTest.call(this,a)&&c&a.offsetDirection&&a.distance>this.options.threshold&&a.maxPointers==this.options.pointers&&qa(b)>this.options.velocity&&a.eventType&Ga},emit:function(a){var b=$(a.offsetDirection);b&&this.manager.emit(this.options.event+b,a),this.manager.emit(this.options.event,a)}}),i(ga,Y,{defaults:{event:"tap",pointers:1,taps:1,interval:300,time:250,threshold:9,posThreshold:10},getTouchAction:function(){return[ib]},process:function(a){var b=this.options,c=a.pointers.length===b.pointers,d=a.distance<b.threshold,f=a.deltaTime<b.time;if(this.reset(),a.eventType&Ea&&0===this.count)return this.failTimeout();if(d&&f&&c){if(a.eventType!=Ga)return this.failTimeout();var g=this.pTime?a.timeStamp-this.pTime<b.interval:!0,h=!this.pCenter||H(this.pCenter,a.center)<b.posThreshold;this.pTime=a.timeStamp,this.pCenter=a.center,h&&g?this.count+=1:this.count=1,this._input=a;var i=this.count%b.taps;if(0===i)return this.hasRequireFailures()?(this._timer=e(function(){this.state=rb,this.tryEmit()},b.interval,this),ob):rb}return tb},failTimeout:function(){return this._timer=e(function(){this.state=tb},this.options.interval,this),tb},reset:function(){clearTimeout(this._timer)},emit:function(){this.state==rb&&(this._input.tapCount=this.count,this.manager.emit(this.options.event,this._input))}}),ha.VERSION="2.0.8",ha.defaults={domEvents:!1,touchAction:gb,enable:!0,inputTarget:null,inputClass:null,preset:[[ea,{enable:!1}],[ca,{enable:!1},["rotate"]],[fa,{direction:Na}],[ba,{direction:Na},["swipe"]],[ga],[ga,{event:"doubletap",taps:2},["tap"]],[da]],cssProps:{userSelect:"none",touchSelect:"none",touchCallout:"none",contentZooming:"none",userDrag:"none",tapHighlightColor:"rgba(0,0,0,0)"}};var ub=1,vb=2;ia.prototype={set:function(a){return la(this.options,a),a.touchAction&&this.touchAction.update(),a.inputTarget&&(this.input.destroy(),this.input.target=a.inputTarget,this.input.init()),this},stop:function(a){this.session.stopped=a?vb:ub},recognize:function(a){var b=this.session;if(!b.stopped){this.touchAction.preventDefaults(a);var c,d=this.recognizers,e=b.curRecognizer;(!e||e&&e.state&rb)&&(e=b.curRecognizer=null);for(var f=0;f<d.length;)c=d[f],b.stopped===vb||e&&c!=e&&!c.canRecognizeWith(e)?c.reset():c.recognize(a),!e&&c.state&(ob|pb|qb)&&(e=b.curRecognizer=c),f++}},get:function(a){if(a instanceof Y)return a;for(var b=this.recognizers,c=0;c<b.length;c++)if(b[c].options.event==a)return b[c];return null},add:function(a){if(f(a,"add",this))return this;var b=this.get(a.options.event);return b&&this.remove(b),this.recognizers.push(a),a.manager=this,this.touchAction.update(),a},remove:function(a){if(f(a,"remove",this))return this;if(a=this.get(a)){var b=this.recognizers,c=r(b,a);-1!==c&&(b.splice(c,1),this.touchAction.update())}return this},on:function(a,b){if(a!==d&&b!==d){var c=this.handlers;return g(q(a),function(a){c[a]=c[a]||[],c[a].push(b)}),this}},off:function(a,b){if(a!==d){var c=this.handlers;return g(q(a),function(a){b?c[a]&&c[a].splice(r(c[a],b),1):delete c[a]}),this}},emit:function(a,b){this.options.domEvents&&ka(a,b);var c=this.handlers[a]&&this.handlers[a].slice();if(c&&c.length){b.type=a,b.preventDefault=function(){b.srcEvent.preventDefault()};for(var d=0;d<c.length;)c[d](b),d++}},destroy:function(){this.element&&ja(this,!1),this.handlers={},this.session={},this.input.destroy(),this.element=null}},la(ha,{INPUT_START:Ea,INPUT_MOVE:Fa,INPUT_END:Ga,INPUT_CANCEL:Ha,STATE_POSSIBLE:nb,STATE_BEGAN:ob,STATE_CHANGED:pb,STATE_ENDED:qb,STATE_RECOGNIZED:rb,STATE_CANCELLED:sb,STATE_FAILED:tb,DIRECTION_NONE:Ia,DIRECTION_LEFT:Ja,DIRECTION_RIGHT:Ka,DIRECTION_UP:La,DIRECTION_DOWN:Ma,DIRECTION_HORIZONTAL:Na,DIRECTION_VERTICAL:Oa,DIRECTION_ALL:Pa,Manager:ia,Input:x,TouchAction:V,TouchInput:P,MouseInput:L,PointerEventInput:M,TouchMouseInput:R,SingleTouchInput:N,Recognizer:Y,AttrRecognizer:aa,Tap:ga,Pan:ba,Swipe:fa,Pinch:ca,Rotate:ea,Press:da,on:m,off:n,each:g,merge:ta,extend:sa,assign:la,inherit:i,bindFn:j,prefixed:u});var wb="undefined"!=typeof a?a:"undefined"!=typeof self?self:{};wb.Hammer=ha, true?!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(){return ha}).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)):0}(window,document,"Hammer");
//# sourceMappingURL=hammer.min.js.map

/***/ }),

/***/ 91032:
/*!********************************************!*\
  !*** ./runestone/parsons/css/parsons.less ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 95762:
/*!********************************************!*\
  !*** ./runestone/parsons/css/prettify.css ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuZXN0b25lX3BhcnNvbnNfanNfdGltZWRwYXJzb25zX2pzLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDYTs7QUFFZ0Q7QUFJcEI7QUFDSztBQU1WO0FBQ047QUFDRztBQUNFO0FBQ1o7QUFDTTtBQUNBO0FBQ2M7QUFDUDtBQUNJO0FBQ0U7QUFDMUM7QUFDcUQ7QUFDRjtBQUNOOztBQUU3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFZSxzQkFBc0IsbUVBQWE7QUFDbEQ7QUFDQTtBQUNBLDhCQUE4QjtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrREFBa0Q7QUFDbEQ7QUFDQSwyQkFBMkI7QUFDM0I7O0FBRUEsMkJBQTJCLDBCQUEwQjtBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLG1EQUFTO0FBQy9CLHNCQUFzQixvREFBZTtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0IsbUVBQVk7QUFDbEMsb0JBQW9CLG1FQUFZO0FBQ2hDLHVCQUF1QixtRUFBWTtBQUNuQyx1QkFBdUIsbUVBQVk7QUFDbkMsdUJBQXVCLG1FQUFZO0FBQ25DLHFCQUFxQixtRUFBWTtBQUNqQztBQUNBLDBCQUEwQixtRUFBWTtBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsa0JBQWtCO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLG1FQUFZO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsbUVBQVk7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLG9GQUF3QixnQkFBZ0IsdURBQUM7QUFDeEQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLHVEQUFDO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGdCQUFnQix1REFBQztBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLHVEQUFDO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLHVEQUFDO0FBQ3hCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQSxxQ0FBcUMsdURBQUM7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EscUNBQXFDLHVEQUFDO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxRQUFRLGtGQUFzQjtBQUM5Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUMsdURBQUM7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSx1REFBQztBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQyx1REFBQztBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQyx1REFBQztBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0RBQWtEO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0MsMEJBQTBCO0FBQzlEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qix3QkFBd0I7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0Isa0JBQWtCO0FBQzFDO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBLGNBQWM7QUFDZDtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsbUJBQW1CO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksdURBQUM7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixxQkFBcUI7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLHdCQUF3QjtBQUNwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCLCtEQUFjO0FBQ3hDO0FBQ0E7QUFDQSxvQkFBb0IsMkRBQVU7QUFDOUI7QUFDQSxtQ0FBbUMscUVBQW9CO0FBQ3ZEO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixxQkFBcUI7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHVCQUF1QjtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOENBQThDLFFBQVE7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsdUJBQXVCO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsdUJBQXVCO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsbUJBQW1CO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0I7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLG1CQUFtQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsZUFBZTtBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCLGNBQWM7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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LDJCQUEyQixRQUFRLG1CQUFtQixVQUFVLG9CQUFvQiwwQkFBMEIsNkNBQTZDLFFBQVEsb0JBQW9CLGdDQUFnQyxpREFBaUQsZ0JBQWdCLHFDQUFxQyw2QkFBNkIsWUFBWSxXQUFXLGNBQWMsb0JBQW9CLDBDQUEwQyxnQkFBZ0IseUNBQXlDLFFBQVEsNmxCQUE2bEIsRUFBRSxnRUFBZ0UsYUFBYSxLQUFxQyxDQUFDLG1DQUFPLFdBQVcsVUFBVTtBQUFBLGtHQUFDLENBQUMsQ0FBb0UsQ0FBQztBQUMxa29CLHNDOzs7Ozs7Ozs7Ozs7QUNOQTs7Ozs7Ozs7Ozs7OztBQ0FBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9wYXJzb25zL2pzL3BhcnNvbnMuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9wYXJzb25zL2pzL3RpbWVkcGFyc29ucy5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL3BhcnNvbnMvanMvc2V0dGxlZEJsb2NrLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvcGFyc29ucy9qcy9wYXJzb25zTGluZS5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL3BhcnNvbnMvanMvcGxhY2Vob2xkZXJMaW5lLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvcGFyc29ucy9qcy9saW5lR3JhZGVyLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvcGFyc29ucy9qcy9wYXJzb25zQmxvY2suanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9wYXJzb25zL2pzL2RhZ0dyYWRlci5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL3BhcnNvbnMvanMvcGxhY2Vob2xkZXJCbG9jay5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL3BhcnNvbnMvanMvcHJldHRpZnkuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9wYXJzb25zL2pzL2RhZ0hlbHBlcnMuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9wYXJzb25zL2pzL2hhbW1lci5taW4uanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9wYXJzb25zL2Nzcy9wYXJzb25zLmxlc3M/ZjIwNiIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL3BhcnNvbnMvY3NzL3ByZXR0aWZ5LmNzcz8wZTVjIl0sInNvdXJjZXNDb250ZW50IjpbIi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT09PSBQYXJzb25zIFJ1bmVzdG9uZSBEaXJlY3RpdmUgSmF2YXNjcmlwdCA9PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PT09PT09PSBSZW5kZXJzIGEgUGFyc29ucyBwcm9ibGVtIGJhc2VkIG9uIHRoZSBIVE1MIGNyZWF0ZWQgYnkgdGhlXG49PT09PT09PSBwYXJzb25zLnB5IHNjcmlwdCBhbmQgdGhlIFJTVCBmaWxlLlxuPT09PSBDT05UUklCVVRPUlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PT09PT09PSBJc2FpYWggTWF5ZXJjaGFrXG49PT09PT09PSBKZWZmIFJpY2tcbj09PT09PT09IEJhcmJhcmEgRXJpY3NvblxuPT09PT09PT0gQ29sZSBCb3dlcnNcbj09PT0gQWRhcHRlZCBmb3JtIHRoZSBvcmlnaW5hbCBKUyBQYXJzb25zIGJ5ID09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT09PT09PT0gVmlsbGUgS2FyYXZpcnRhXG49PT09PT09PSBQZXRyaSBJaGFudG9sYVxuPT09PT09PT0gSnVoYSBIZWxtaW5lblxuPT09PT09PT0gTWlrZSBIZXduZXJcbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PT09IExpbmVCYXNlZEdyYWRlciBPYmplY3QgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09PT09PT09IFVzZWQgZm9yIGdyYWRpbmcgYSBQYXJzb25zIHByb2JsZW0uXG49PT09IFBST1BFUlRJRVMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09PT09PT09IHByb2JsZW06IHRoZSBQYXJzb25zIHByb2JsZW1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCBSdW5lc3RvbmVCYXNlIGZyb20gXCIuLi8uLi9jb21tb24vanMvcnVuZXN0b25lYmFzZS5qc1wiO1xuaW1wb3J0IHtcbiAgICBkaXNhYmxlTWF0aEpheFRhYlN0b3BzLFxuICAgIGdldEFjY2Vzc2libGVFbGVtZW50VGV4dCxcbn0gZnJvbSBcIi4uLy4uL2NvbW1vbi9qcy9tYXRoamF4LWExMXkuanNcIjtcbmltcG9ydCB7IHQgfSBmcm9tIFwiLi4vLi4vY29tbW9uL2pzL3JzaTE4bi5qc1wiO1xuaW1wb3J0IHtcbiAgICBnZXREYXRhVmFsdWUsXG4gICAgYW5pbWF0ZSxcbiAgICBvdXRlckhlaWdodCxcbiAgICBvdXRlcldpZHRoLFxufSBmcm9tIFwiLi4vLi4vY29tbW9uL2pzL2RvbXV0aWwuanNcIjtcbmltcG9ydCBcIi4vcGFyc29ucy1pMThuLmVuLmpzXCI7XG5pbXBvcnQgXCIuL3BhcnNvbnMtaTE4bi5wdC1ici5qc1wiO1xuaW1wb3J0IFwiLi9wYXJzb25zLWkxOG4uc3ItQ3lybC5qc1wiO1xuaW1wb3J0IFwiLi9wcmV0dGlmeS5qc1wiO1xuaW1wb3J0IFwiLi4vY3NzL3BhcnNvbnMubGVzc1wiO1xuaW1wb3J0IFwiLi4vY3NzL3ByZXR0aWZ5LmNzc1wiO1xuaW1wb3J0IExpbmVCYXNlZEdyYWRlciBmcm9tIFwiLi9saW5lR3JhZGVyXCI7XG5pbXBvcnQgREFHR3JhZGVyIGZyb20gXCIuL2RhZ0dyYWRlclwiO1xuaW1wb3J0IFBhcnNvbnNMaW5lIGZyb20gXCIuL3BhcnNvbnNMaW5lXCI7XG5pbXBvcnQgUGFyc29uc0Jsb2NrIGZyb20gXCIuL3BhcnNvbnNCbG9ja1wiO1xuLy8gQ29kZVRhaWxvci1yZWxhdGVkIGltcG9ydHMgVXBkYXRlZCAxMC8yNi8yMDI1XG5pbXBvcnQgUGxhY2Vob2xkZXJCbG9jayBmcm9tIFwiLi9wbGFjZWhvbGRlckJsb2NrLmpzXCI7XG5pbXBvcnQgUGxhY2Vob2xkZXJMaW5lIGZyb20gXCIuL3BsYWNlaG9sZGVyTGluZS5qc1wiO1xuaW1wb3J0IFNldHRsZWRCbG9jayBmcm9tIFwiLi9zZXR0bGVkQmxvY2suanNcIjtcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PT09IFBhcnNvbnMgT2JqZWN0ID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09PT09PT09IFRoZSBtb2RlbCBhbmQgdmlldyBvZiBhIFBhcnNvbnMgcHJvYmxlbSBiYXNlZCBvbiB3aGF0IGlzXG49PT09PT09PSBzcGVjaWZpZWQgaW4gdGhlIEhUTUwsIHdoaWNoIGlzIGJhc2VkIG9uIHdoYXQgaXMgc3BlY2lmaWVkXG49PT09PT09PSBpbiB0aGUgUlNUIGZpbGVcbj09PT0gUFJPUEVSVElFUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT09PT09PT0gb3B0aW9uczogb3B0aW9ucyBsYXJnZWx5IHNwZWNpZmllZCBmcm9tIHRoZSBIVE1MXG49PT09PT09PSBncmFkZXI6IGEgTGluZUdyYWRlciBmb3IgZ3JhZGluZyB0aGUgcHJvYmxlbVxuPT09PT09PT0gbGluZXM6IGFuIGFycmF5IG9mIGFsbCBQYXJzb25zTGluZSBhcyBzcGVjaWZpZWQgaW4gdGhlIHByb2JsZW1cbj09PT09PT09IHNvbHV0aW9uOiBhbiBhcnJheSBvZiBQYXJzb25zTGluZSBpbiB0aGUgc29sdXRpb25cbj09PT09PT09IGJsb2NrczogdGhlIGN1cnJlbnQgYmxvY2tzXG49PT09PT09PSBzb3VyY2VBcmVhOiB0aGUgZWxlbWVudCB0aGF0IGNvbnRhaW5zIHRoZSBzb3VyY2UgYmxvY2tzXG49PT09PT09PSBhbnN3ZXJBcmVhOiB0aGUgZWxlbWVudCB0aGF0IGNvbnRhaW5zIHRoZSBhbnN3ZXIgYmxvY2tzXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PT09IElOSVRJQUxJWkFUSU9OID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAgKi9cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGFyc29ucyBleHRlbmRzIFJ1bmVzdG9uZUJhc2Uge1xuICAgIGNvbnN0cnVjdG9yKG9wdHMpIHtcbiAgICAgICAgc3VwZXIob3B0cyk7XG4gICAgICAgIHZhciBvcmlnID0gb3B0cy5vcmlnOyAvLyBlbnRpcmUgPHByZT4gZWxlbWVudCB0aGF0IHdpbGwgYmUgcmVwbGFjZWQgYnkgbmV3IEhUTUxcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYgPSBvcmlnO1xuICAgICAgICB0aGlzLm9yaWdFbGVtID0gb3JpZy5xdWVyeVNlbGVjdG9yKFwicHJlLnBhcnNvbnNibG9ja3NcIik7XG4gICAgICAgIC8vIEZpbmQgdGhlIHF1ZXN0aW9uIHRleHQgYW5kIHN0b3JlIGl0IGluIC5xdWVzdGlvblxuICAgICAgICB0aGlzLnF1ZXN0aW9uID0gb3JpZy5xdWVyeVNlbGVjdG9yKFwiLnBhcnNvbnNfcXVlc3Rpb25cIik7XG4gICAgICAgIHRoaXMudXNlUnVuZXN0b25lU2VydmljZXMgPSBvcHRzLnVzZVJ1bmVzdG9uZVNlcnZpY2VzO1xuICAgICAgICB0aGlzLmRpdmlkID0gb3B0cy5vcmlnLmlkO1xuICAgICAgICAvLyBTZXQgdGhlIHN0b3JhZ2VJZCAoa2V5IGZvciBzdG9yaW5nIGRhdGEpXG4gICAgICAgIHZhciBzdG9yYWdlSWQgPSBzdXBlci5sb2NhbFN0b3JhZ2VLZXkoKTtcbiAgICAgICAgdGhpcy5zdG9yYWdlSWQgPSBzdG9yYWdlSWQ7XG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSB0aGlzLm9yaWdFbGVtLmNoaWxkTm9kZXM7IC8vIHRoaXMgY29udGFpbnMgYWxsIG9mIHRoZSBjaGlsZCBlbGVtZW50cyBvZiB0aGUgZW50aXJlIHRhZy4uLlxuICAgICAgICB0aGlzLmNvbnRlbnRBcnJheSA9IFtdO1xuICAgICAgICBQYXJzb25zLmNvdW50ZXIrKzsgLy8gICAgVW5pcXVlIGlkZW50aWZpZXJcbiAgICAgICAgdGhpcy5jb3VudGVySWQgPSBcInBhcnNvbnMtXCIgKyBQYXJzb25zLmNvdW50ZXI7XG5cbiAgICAgICAgLy8gZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIC8vICAgICBpZiAoJCh0aGlzLmNoaWxkcmVuW2ldKS5pcyhcIltkYXRhLXF1ZXN0aW9uXVwiKSkge1xuICAgICAgICAvLyAgICAgICAgIHRoaXMucXVlc3Rpb24gPSB0aGlzLmNoaWxkcmVuW2ldO1xuICAgICAgICAvLyAgICAgICAgIGJyZWFrO1xuICAgICAgICAvLyAgICAgfVxuICAgICAgICAvLyB9XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZU9wdGlvbnMoKTtcbiAgICAgICAgdGhpcy5ncmFkZXIgPVxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLmdyYWRlciA9PT0gXCJkYWdcIlxuICAgICAgICAgICAgICAgID8gbmV3IERBR0dyYWRlcih0aGlzKVxuICAgICAgICAgICAgICAgIDogbmV3IExpbmVCYXNlZEdyYWRlcih0aGlzKTtcbiAgICAgICAgdGhpcy5ncmFkZXIuc2hvd2ZlZWRiYWNrID0gdGhpcy5zaG93ZmVlZGJhY2s7XG4gICAgICAgIHZhciBmdWxsdGV4dCA9IHRoaXMub3JpZ0VsZW0uaW5uZXJIVE1MO1xuICAgICAgICB0aGlzLmJsb2NrSW5kZXggPSAwO1xuICAgICAgICB0aGlzLmNoZWNrQ291bnQgPSAwO1xuICAgICAgICB0aGlzLm51bURpc3RpbmN0ID0gMDtcbiAgICAgICAgdGhpcy5oYXNTb2x2ZWQgPSBmYWxzZTtcbiAgICAgICAgLy8gT25seSB0cmltIHRyYWlsaW5nIHdoaXRlc3BhY2UgaGVyZS4gQSBsZWFkaW5nIHRyaW0oKSB3b3VsZCBzdHJpcCByZWFsXG4gICAgICAgIC8vIGxlYWRpbmcgaW5kZW50YXRpb24gb2ZmIHRoZSBmaXJzdCBsaW5lIG9mIHRoZSBmaXJzdCBibG9jayB3aGVuZXZlciB0aGVcbiAgICAgICAgLy8gPHByZT4gdGFnJ3Mgb3duIGxlYWRpbmcgbmV3bGluZSBoYXMgYWxyZWFkeSBiZWVuIGNvbnN1bWVkIGJ5IHRoZSBicm93c2VyJ3NcbiAgICAgICAgLy8gSFRNTCBwYXJzZXIgKGEgd2VsbC1rbm93biA8cHJlPiBxdWlyayksIHNpbGVudGx5IGRlLWluZGVudGluZyBvbmx5IHRoZVxuICAgICAgICAvLyBmaXJzdCBibG9jayByZWxhdGl2ZSB0byBldmVyeSBvdGhlciBibG9jay4gQmxhbmsgbGVhZGluZy90cmFpbGluZyBsaW5lc1xuICAgICAgICAvLyB3aXRoaW4gYSBibG9jayBhcmUgc3RpbGwgZGlzY2FyZGVkIGZ1cnRoZXIgZG93biwgcGVyIGJsb2NrLlxuICAgICAgICAvLyAtIE5vdGUgLSByZXZlcnRlZCB0aGUgYWJvdmUgYWZ0ZXIgcmVxdWVzdCBmcm9tIGJhcmJhcmVyIHRyaW1FbmQgLT4gdHJpbVxuICAgICAgICB0aGlzLmluaXRpYWxpemVMaW5lcyhmdWxsdGV4dC50cmltKCkpO1xuICAgICAgICB0aGlzLmluaXRpYWxpemVWaWV3KCk7XG4gICAgICAgIHRoaXMuY2FwdGlvbiA9IFwiUGFyc29uc1wiO1xuICAgICAgICB0aGlzLmFkZENhcHRpb24oXCJydW5lc3RvbmVcIik7XG4gICAgICAgIC8vIENoZWNrIHRoZSBzZXJ2ZXIgZm9yIGFuIGFuc3dlciB0byBjb21wbGV0ZSB0aGluZ3NcbiAgICAgICAgdGhpcy5jaGVja1NlcnZlcihcInBhcnNvbnNcIiwgdHJ1ZSk7XG4gICAgICAgIHRoaXMucnVubmFibGVEaXYgPSBudWxsO1xuICAgIH1cbiAgICAvLyBCYXNlZCBvbiB0aGUgZGF0YS1maWVsZHMgaW4gdGhlIG9yaWdpbmFsIEhUTUwsIGluaXRpYWxpemUgb3B0aW9uc1xuICAgIGluaXRpYWxpemVPcHRpb25zKCkge1xuICAgICAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgIHBpeGVsc1BlckluZGVudDogMzAsXG4gICAgICAgIH07XG4gICAgICAgIC8vIGFkZCBtYXhkaXN0IGFuZCBvcmRlciBpZiBwcmVzZW50XG4gICAgICAgIHZhciBtYXhkaXN0ID0gZ2V0RGF0YVZhbHVlKHRoaXMub3JpZ0VsZW0sIFwibWF4ZGlzdFwiKTtcbiAgICAgICAgdmFyIG9yZGVyID0gZ2V0RGF0YVZhbHVlKHRoaXMub3JpZ0VsZW0sIFwib3JkZXJcIik7XG4gICAgICAgIHZhciBub2luZGVudCA9IGdldERhdGFWYWx1ZSh0aGlzLm9yaWdFbGVtLCBcIm5vaW5kZW50XCIpO1xuICAgICAgICB2YXIgYWRhcHRpdmUgPSBnZXREYXRhVmFsdWUodGhpcy5vcmlnRWxlbSwgXCJhZGFwdGl2ZVwiKTtcbiAgICAgICAgdmFyIG51bWJlcmVkID0gZ2V0RGF0YVZhbHVlKHRoaXMub3JpZ0VsZW0sIFwibnVtYmVyZWRcIik7XG4gICAgICAgIHZhciBncmFkZXIgPSBnZXREYXRhVmFsdWUodGhpcy5vcmlnRWxlbSwgXCJncmFkZXJcIik7XG4gICAgICAgIC8vIENvZGVUYWlsb3I6IHByb2FjdGl2ZWx5IHNldCB0aGUgcHV6emxlIGFzIHNjYWZmb2xkaW5nIHB1enpsZSB0byBkaWZmZXJlbnRpYXRlIHdpdGggb3RoZXIgcHV6emxlIHByYWN0aWNlIGZvcm1hdHNcbiAgICAgICAgdmFyIHNjYWZmb2xkaW5nID0gZ2V0RGF0YVZhbHVlKHRoaXMub3JpZ0VsZW0sIFwic2NhZmZvbGRpbmdcIik7XG4gICAgICAgIG9wdGlvbnNbXCJudW1iZXJlZFwiXSA9IG51bWJlcmVkO1xuICAgICAgICBvcHRpb25zW1wiZ3JhZGVyXCJdID0gZ3JhZGVyO1xuICAgICAgICBvcHRpb25zW1wic2NhZmZvbGRpbmdcIl0gPSBzY2FmZm9sZGluZztcbiAgICAgICAgaWYgKG1heGRpc3QgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgb3B0aW9uc1tcIm1heGRpc3RcIl0gPSBtYXhkaXN0O1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcmRlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAvLyBjb252ZXJ0IG9yZGVyIHN0cmluZyB0byBhcnJheSBvZiBudW1iZXJzXG4gICAgICAgICAgICBvcmRlciA9IG9yZGVyLm1hdGNoKC9cXGQrL2cpO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvcmRlci5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIG9yZGVyW2ldID0gcGFyc2VJbnQob3JkZXJbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3B0aW9uc1tcIm9yZGVyXCJdID0gb3JkZXI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5vaW5kZW50ID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgbm9pbmRlbnQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBvcHRpb25zW1wibm9pbmRlbnRcIl0gPSBub2luZGVudDtcbiAgICAgICAgdGhpcy5ub2luZGVudCA9IG5vaW5kZW50O1xuICAgICAgICBpZiAoYWRhcHRpdmUgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBhZGFwdGl2ZSA9IGZhbHNlO1xuICAgICAgICB9IGVsc2UgaWYgKGFkYXB0aXZlKSB7XG4gICAgICAgICAgICB0aGlzLmluaXRpYWxpemVBZGFwdGl2ZSgpO1xuICAgICAgICB9XG4gICAgICAgIG9wdGlvbnNbXCJhZGFwdGl2ZVwiXSA9IGFkYXB0aXZlO1xuICAgICAgICAvLyBhZGQgbG9jYWxlIGFuZCBsYW5ndWFnZVxuICAgICAgICB2YXIgbG9jYWxlID0gZUJvb2tDb25maWcubG9jYWxlO1xuICAgICAgICBpZiAobG9jYWxlID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgbG9jYWxlID0gXCJlblwiO1xuICAgICAgICB9XG4gICAgICAgIG9wdGlvbnNbXCJsb2NhbGVcIl0gPSBsb2NhbGU7XG4gICAgICAgIHZhciBsYW5ndWFnZSA9IGdldERhdGFWYWx1ZSh0aGlzLm9yaWdFbGVtLCBcImxhbmd1YWdlXCIpO1xuICAgICAgICBpZiAobGFuZ3VhZ2UgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBsYW5ndWFnZSA9IGVCb29rQ29uZmlnLmxhbmd1YWdlO1xuICAgICAgICAgICAgaWYgKGxhbmd1YWdlID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGxhbmd1YWdlID0gXCJweXRob25cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBvcHRpb25zW1wibGFuZ3VhZ2VcIl0gPSBsYW5ndWFnZTtcbiAgICAgICAgdmFyIHByZXR0aWZ5TGFuZ3VhZ2UgPSB7XG4gICAgICAgICAgICBweXRob246IFwicHJldHR5cHJpbnQgbGFuZy1weVwiLFxuICAgICAgICAgICAgamF2YTogXCJwcmV0dHlwcmludCBsYW5nLWphdmFcIixcbiAgICAgICAgICAgIGphdmFzY3JpcHQ6IFwicHJldHR5cHJpbnQgbGFuZy1qc1wiLFxuICAgICAgICAgICAgaHRtbDogXCJwcmV0dHlwcmludCBsYW5nLWh0bWxcIixcbiAgICAgICAgICAgIGM6IFwicHJldHR5cHJpbnQgbGFuZy1jXCIsXG4gICAgICAgICAgICBcImMrK1wiOiBcInByZXR0eXByaW50IGxhbmctY3BwXCIsXG4gICAgICAgICAgICBjcHA6IFwicHJldHR5cHJpbnQgbGFuZy1jcHBcIixcbiAgICAgICAgICAgIHJ1Ynk6IFwicHJldHR5cHJpbnQgbGFuZy1yYlwiLFxuICAgICAgICB9W2xhbmd1YWdlXTtcbiAgICAgICAgaWYgKHByZXR0aWZ5TGFuZ3VhZ2UgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBwcmV0dGlmeUxhbmd1YWdlID0gXCJcIjtcbiAgICAgICAgfVxuICAgICAgICBvcHRpb25zW1wicHJldHRpZnlMYW5ndWFnZVwiXSA9IHByZXR0aWZ5TGFuZ3VhZ2U7XG4gICAgICAgIC8vcnVubmFibGUgaWYgdGhlIHBhcmVudCBoYXMgYSBwYXJzb25zLXJ1bm5hYmxlIGF0dHJcbiAgICAgICAgb3B0aW9uc1tcInJ1bm5hYmxlXCJdID0gZ2V0RGF0YVZhbHVlKHRoaXMub3JpZ0VsZW0sIFwicnVubmFibGVcIik7XG4gICAgICAgIC8vIFBhcnNlIGJsb2NrIGV4cGxhbmF0aW9ucyBpZiBwcmVzZW50XG4gICAgICAgIHZhciBleHBsYW5hdGlvbnNSYXcgPSB0aGlzLm9yaWdFbGVtLmdldEF0dHJpYnV0ZShcImRhdGEtZXhwbGFuYXRpb25zXCIpO1xuICAgICAgICBpZiAoZXhwbGFuYXRpb25zUmF3KSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHRoaXMuYmxvY2tFeHBsYW5hdGlvbnMgPSBKU09OLnBhcnNlKGV4cGxhbmF0aW9uc1Jhdyk7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ibG9ja0V4cGxhbmF0aW9ucyA9IHt9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5ibG9ja0V4cGxhbmF0aW9ucyA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgfVxuICAgIGdldEJsb2NrTGFiZWwoYmxvY2spIHtcbiAgICAgICAgcmV0dXJuIGdldEFjY2Vzc2libGVFbGVtZW50VGV4dChibG9jay52aWV3KSB8fCB0KFwibXNnX3BhcnNvbl9ibG9ja1wiKTtcbiAgICB9XG5cbiAgICBpc0luY29ycmVjdEJsb2NrKGJsb2NrKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICBibG9jay52aWV3LmNsYXNzTGlzdC5jb250YWlucyhcImluY29ycmVjdFBvc2l0aW9uXCIpIHx8XG4gICAgICAgICAgICBibG9jay52aWV3LmNsYXNzTGlzdC5jb250YWlucyhcImluZGVudExlZnRcIikgfHxcbiAgICAgICAgICAgIGJsb2NrLnZpZXcuY2xhc3NMaXN0LmNvbnRhaW5zKFwiaW5kZW50UmlnaHRcIilcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBnZXRLZXlib2FyZEJsb2NrTG9jYXRpb24oYmxvY2spIHtcbiAgICAgICAgY29uc3QgaW5Tb3VyY2UgPSBibG9jay5pblNvdXJjZUFyZWEoKTtcbiAgICAgICAgY29uc3QgYmxvY2tzID0gaW5Tb3VyY2VcbiAgICAgICAgICAgID8gdGhpcy5lbmFibGVkU291cmNlQmxvY2tzKClcbiAgICAgICAgICAgIDogdGhpcy5lbmFibGVkQW5zd2VyQmxvY2tzKCk7XG4gICAgICAgIGNvbnN0IHBvc2l0aW9uID0gYmxvY2tzLmluZGV4T2YoYmxvY2spICsgMTtcbiAgICAgICAgY29uc3QgbG9jYXRpb24gPSBbXG4gICAgICAgICAgICB0KFxuICAgICAgICAgICAgICAgIGluU291cmNlXG4gICAgICAgICAgICAgICAgICAgID8gXCJtc2dfcGFyc29uX2tleWJvYXJkX3VucGxhY2VkX3Bvc2l0aW9uXCJcbiAgICAgICAgICAgICAgICAgICAgOiBcIm1zZ19wYXJzb25fa2V5Ym9hcmRfYW5zd2VyX3Bvc2l0aW9uXCIsXG4gICAgICAgICAgICAgICAgcG9zaXRpb24sXG4gICAgICAgICAgICAgICAgYmxvY2tzLmxlbmd0aCxcbiAgICAgICAgICAgICksXG4gICAgICAgIF07XG5cbiAgICAgICAgaWYgKCFpblNvdXJjZSAmJiB0aGlzLnVzZXNJbmRlbnRhdGlvbigpKSB7XG4gICAgICAgICAgICBsb2NhdGlvbi5wdXNoKFxuICAgICAgICAgICAgICAgIHQoXG4gICAgICAgICAgICAgICAgICAgIGJsb2NrLmluZGVudCA9PT0gMVxuICAgICAgICAgICAgICAgICAgICAgICAgPyBcIm1zZ19wYXJzb25fa2V5Ym9hcmRfdGFiX2luXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIDogXCJtc2dfcGFyc29uX2tleWJvYXJkX3RhYnNfaW5cIixcbiAgICAgICAgICAgICAgICAgICAgYmxvY2suaW5kZW50LFxuICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcGFpcmVkQmluID0gYmxvY2sucGFpcmVkQmluKCk7XG4gICAgICAgIGlmIChwYWlyZWRCaW4gIT09IC0xKSB7XG4gICAgICAgICAgICBjb25zdCBvcHRpb25zID0gdGhpcy5ibG9ja3MuZmlsdGVyKFxuICAgICAgICAgICAgICAgIChjYW5kaWRhdGUpID0+XG4gICAgICAgICAgICAgICAgICAgIGNhbmRpZGF0ZS5lbmFibGVkKCkgJiYgY2FuZGlkYXRlLnBhaXJlZEJpbigpID09PSBwYWlyZWRCaW4sXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgIGxvY2F0aW9uLnB1c2goXG4gICAgICAgICAgICAgICAgICAgIHQoXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm1zZ19wYXJzb25fa2V5Ym9hcmRfb3B0aW9uc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5pbmRleE9mKGJsb2NrKSArIDEsXG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLmxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGxvY2F0aW9uLmpvaW4oXCIuIFwiKSArIFwiLlwiO1xuICAgIH1cblxuICAgIHVwZGF0ZUJsb2NrQXJpYUxhYmVsKGJsb2NrKSB7XG4gICAgICAgIGNvbnN0IGxhYmVsID0gW3RoaXMuZ2V0QmxvY2tMYWJlbChibG9jayldO1xuICAgICAgICBpZiAodGhpcy5pc0luY29ycmVjdEJsb2NrKGJsb2NrKSkge1xuICAgICAgICAgICAgbGFiZWwucHVzaCh0KFwibXNnX3BhcnNvbl9pbmNvcnJlY3RcIikpO1xuICAgICAgICB9XG4gICAgICAgIGJsb2NrLnZpZXcuc2V0QXR0cmlidXRlKFwiYXJpYS1sYWJlbFwiLCBsYWJlbC5qb2luKFwiLiBcIikpO1xuICAgIH1cblxuICAgIHVwZGF0ZUJsb2NrQXJpYUxhYmVscygpIHtcbiAgICAgICAgdGhpcy5ibG9ja3MuZm9yRWFjaCgoYmxvY2spID0+IHRoaXMudXBkYXRlQmxvY2tBcmlhTGFiZWwoYmxvY2spKTtcbiAgICB9XG5cbiAgICBzaG93TWVzc2FnZShtZXNzYWdlLCBjbGFzc05hbWUgPSBcImFsZXJ0IGFsZXJ0LWluZm9cIikge1xuICAgICAgICB0aGlzLm1lc3NhZ2VEaXYuc3R5bGUudmlzaWJpbGl0eSA9IFwidmlzaWJsZVwiO1xuICAgICAgICB0aGlzLm1lc3NhZ2VEaXYuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgY2xhc3NOYW1lKTtcbiAgICAgICAgdGhpcy5tZXNzYWdlRGl2LnJlcGxhY2VDaGlsZHJlbigpO1xuICAgICAgICBjb25zdCBtZXNzYWdlVmVyc2lvbiA9ICh0aGlzLm1lc3NhZ2VWZXJzaW9uIHx8IDApICsgMTtcbiAgICAgICAgdGhpcy5tZXNzYWdlVmVyc2lvbiA9IG1lc3NhZ2VWZXJzaW9uO1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLm1lc3NhZ2VWZXJzaW9uID09PSBtZXNzYWdlVmVyc2lvbikge1xuICAgICAgICAgICAgICAgIHRoaXMubWVzc2FnZURpdi5pbm5lckhUTUwgPSBtZXNzYWdlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCAxMCk7XG4gICAgfVxuXG4gICAgc2hvd0tleWJvYXJkRW50cnlIaW50KCkge1xuICAgICAgICB0aGlzLmtleWJvYXJkVGlwLmlubmVySFRNTCA9IHQoXCJtc2dfcGFyc29uX2VudGVyX2FjdGl2YXRlXCIpO1xuICAgICAgICB0aGlzLmtleWJvYXJkVGlwLnN0eWxlLmRpc3BsYXkgPSBcIlwiO1xuICAgICAgICAvLyBEcm9wIGFuZCByZS1hZGQgdGhlIGNsYXNzICh3aXRoIGEgcmVmbG93IGluIGJldHdlZW4pIHNvIHRoZSBhdHRlbnRpb25cbiAgICAgICAgLy8gYW5pbWF0aW9uIHJlcGxheXMgZXZlcnkgdGltZSB0aGUgdXNlciB0YWJzIGJhY2sgb250byB0aGUgcHJvYmxlbS5cbiAgICAgICAgdGhpcy5rZXlib2FyZFRpcC5jbGFzc0xpc3QucmVtb3ZlKFwicGFyc29ucy1lbnRyeS1oaW50XCIpO1xuICAgICAgICB2b2lkIHRoaXMua2V5Ym9hcmRUaXAub2Zmc2V0V2lkdGg7XG4gICAgICAgIHRoaXMua2V5Ym9hcmRUaXAuY2xhc3NMaXN0LmFkZChcInBhcnNvbnMtZW50cnktaGludFwiKTtcbiAgICAgICAgdGhpcy5zb3VyY2VMYWJlbC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgIHRoaXMuYW5zd2VyTGFiZWwuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgIH1cblxuICAgIGhpZGVLZXlib2FyZEVudHJ5SGludCgpIHtcbiAgICAgICAgdGhpcy5rZXlib2FyZFRpcC5pbm5lckhUTUwgPSB0KFwibXNnX3BhcnNvbl9hcnJvd19uYXZpZ2F0ZVwiKTtcbiAgICAgICAgdGhpcy5rZXlib2FyZFRpcC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgIHRoaXMua2V5Ym9hcmRUaXAuY2xhc3NMaXN0LnJlbW92ZShcInBhcnNvbnMtZW50cnktaGludFwiKTtcbiAgICAgICAgdGhpcy5zb3VyY2VMYWJlbC5zdHlsZS5kaXNwbGF5ID0gXCJcIjtcbiAgICAgICAgdGhpcy5hbnN3ZXJMYWJlbC5zdHlsZS5kaXNwbGF5ID0gXCJcIjtcbiAgICB9XG5cbiAgICBkaXNhYmxlQmxvY2tNYXRoVGFiU3RvcHMoKSB7XG4gICAgICAgIGRpc2FibGVNYXRoSmF4VGFiU3RvcHModGhpcy5vdXRlckRpdiwgW1wiLmJsb2NrXCJdKTtcbiAgICB9XG5cbiAgICBvYnNlcnZlTWF0aEpheFNwZWVjaCgpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgdGhpcy5tYXRoSmF4U3BlZWNoT2JzZXJ2ZXIgfHxcbiAgICAgICAgICAgIHR5cGVvZiBNdXRhdGlvbk9ic2VydmVyID09PSBcInVuZGVmaW5lZFwiXG4gICAgICAgICkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5tYXRoSmF4U3BlZWNoT2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigobXV0YXRpb25zKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjaGFuZ2VkQmxvY2tzID0gbmV3IFNldCgpO1xuICAgICAgICAgICAgZm9yIChjb25zdCBtdXRhdGlvbiBvZiBtdXRhdGlvbnMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBibG9jayA9IG11dGF0aW9uLnRhcmdldC5jbG9zZXN0Py4oXCIuYmxvY2tcIik7XG4gICAgICAgICAgICAgICAgaWYgKGJsb2NrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZWRCbG9ja3MuYWRkKGJsb2NrKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2hhbmdlZEJsb2Nrcy5zaXplID09PSAwKSByZXR1cm47XG5cbiAgICAgICAgICAgIHRoaXMuZGlzYWJsZUJsb2NrTWF0aFRhYlN0b3BzKCk7XG4gICAgICAgICAgICBjaGFuZ2VkQmxvY2tzLmZvckVhY2goKHZpZXcpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBibG9jayA9IHRoaXMuYmxvY2tzLmZpbmQoKGl0ZW0pID0+IGl0ZW0udmlldyA9PT0gdmlldyk7XG4gICAgICAgICAgICAgICAgaWYgKGJsb2NrKSB0aGlzLnVwZGF0ZUJsb2NrQXJpYUxhYmVsKGJsb2NrKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5tYXRoSmF4U3BlZWNoT2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLm91dGVyRGl2LCB7XG4gICAgICAgICAgICBzdWJ0cmVlOiB0cnVlLFxuICAgICAgICAgICAgYXR0cmlidXRlczogdHJ1ZSxcbiAgICAgICAgICAgIGF0dHJpYnV0ZUZpbHRlcjogW1wiZGF0YS1zZW1hbnRpYy1zcGVlY2gtbm9uZVwiXSxcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gQmFzZWQgb24gd2hhdCBpcyBzcGVjaWZpZWQgaW4gdGhlIG9yaWdpbmFsIEhUTUwsIGNyZWF0ZSB0aGUgSFRNTCB2aWV3XG4gICAgaW5pdGlhbGl6ZVZpZXcoKSB7XG4gICAgICAgIHRoaXMub3V0ZXJEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB0aGlzLm91dGVyRGl2LmNsYXNzTGlzdC5hZGQoXCJwYXJzb25zXCIpO1xuICAgICAgICB0aGlzLm91dGVyRGl2LmlkID0gdGhpcy5jb3VudGVySWQ7XG4gICAgICAgIHRoaXMub3V0ZXJEaXYuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgIFwia2V5ZG93blwiLFxuICAgICAgICAgICAgKGV2ZW50KSA9PiB0aGlzLmhhbmRsZUtleWJvYXJkTW92ZW1lbnRLZXlkb3duKGV2ZW50KSxcbiAgICAgICAgICAgIHRydWUsXG4gICAgICAgICk7XG4gICAgICAgIC8vIHBhcnNvbnMtdGV4dCBleGlzdHMgaW4gc291cmNlLCBtYWtlIHN1cmUgaXQgaGFzIGV4ZXJjaXNlLXN0YXRlbWVudCBjbGFzc1xuICAgICAgICBsZXQgcGFyc29uc1RleHREaXYgPSB0aGlzLmNvbnRhaW5lckRpdi5xdWVyeVNlbGVjdG9yKFwiLnBhcnNvbnMtdGV4dFwiKTtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgcGFyc29uc1RleHREaXYgJiZcbiAgICAgICAgICAgICFwYXJzb25zVGV4dERpdi5jbGFzc0xpc3QuY29udGFpbnMoXCJleGVyY2lzZS1zdGF0ZW1lbnRcIilcbiAgICAgICAgKVxuICAgICAgICAgICAgcGFyc29uc1RleHREaXYuY2xhc3NMaXN0LmFkZChcImV4ZXJjaXNlLXN0YXRlbWVudFwiKTtcbiAgICAgICAgdGhpcy5rZXlib2FyZFRpcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHRoaXMua2V5Ym9hcmRUaXAuc2V0QXR0cmlidXRlKFwicm9sZVwiLCBcInRvb2x0aXBcIik7XG4gICAgICAgIHRoaXMua2V5Ym9hcmRUaXAuaWQgPSB0aGlzLmNvdW50ZXJJZCArIFwiLXRpcFwiO1xuICAgICAgICB0aGlzLmtleWJvYXJkVGlwLmlubmVySFRNTCA9IHQoXCJtc2dfcGFyc29uX2Fycm93X25hdmlnYXRlXCIpO1xuICAgICAgICB0aGlzLm91dGVyRGl2LmFwcGVuZENoaWxkKHRoaXMua2V5Ym9hcmRUaXApO1xuICAgICAgICB0aGlzLmtleWJvYXJkVGlwLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgdGhpcy5zb3J0Q29udGFpbmVyRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdGhpcy5zb3J0Q29udGFpbmVyRGl2LmNsYXNzTGlzdC5hZGQoXCJzb3J0YWJsZS1jb2RlLWNvbnRhaW5lclwiKTtcbiAgICAgICAgdGhpcy5zb3J0Q29udGFpbmVyRGl2LnNldEF0dHJpYnV0ZShcbiAgICAgICAgICAgIFwiYXJpYS1kZXNjcmliZWRieVwiLFxuICAgICAgICAgICAgdGhpcy5jb3VudGVySWQgKyBcIi10aXBcIixcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5zb3J0Q29udGFpbmVyRGl2LnRhYkluZGV4ID0gMDtcbiAgICAgICAgdGhpcy5zb3J0Q29udGFpbmVyRGl2LnNldEF0dHJpYnV0ZShcInJvbGVcIiwgXCJidXR0b25cIik7XG4gICAgICAgIHRoaXMuc29ydENvbnRhaW5lckRpdi5zZXRBdHRyaWJ1dGUoXG4gICAgICAgICAgICBcImFyaWEtbGFiZWxcIixcbiAgICAgICAgICAgIHQoXCJtc2dfcGFyc29uX2tleWJvYXJkX2VudHJ5X2xhYmVsXCIpLFxuICAgICAgICApO1xuICAgICAgICB0aGlzLnNvcnRDb250YWluZXJEaXYuYWRkRXZlbnRMaXN0ZW5lcihcImZvY3VzXCIsICgpID0+IHtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAhdGhpcy5rZXlib2FyZElucHV0QWN0aXZlICYmXG4gICAgICAgICAgICAgICAgdGhpcy5zb3J0Q29udGFpbmVyRGl2Lm1hdGNoZXMoXCI6Zm9jdXMtdmlzaWJsZVwiKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zaG93S2V5Ym9hcmRFbnRyeUhpbnQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuc29ydENvbnRhaW5lckRpdi5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBldmVudC50YXJnZXQgPT09IHRoaXMuc29ydENvbnRhaW5lckRpdiAmJlxuICAgICAgICAgICAgICAgIChldmVudC5rZXkgPT09IFwiRW50ZXJcIiB8fCBldmVudC5rZXkgPT09IFwiIFwiKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydEtleWJvYXJkSW50ZXJhY3Rpb24oKTtcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5zb3J0Q29udGFpbmVyRGl2LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGlmIChldmVudC50YXJnZXQgPT09IHRoaXMuc29ydENvbnRhaW5lckRpdikge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhcnRLZXlib2FyZEludGVyYWN0aW9uKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmtleWJvYXJkQXBwbGljYXRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB0aGlzLmtleWJvYXJkQXBwbGljYXRpb24uY2xhc3NMaXN0LmFkZChcInBhcnNvbnMta2V5Ym9hcmQtYXBwbGljYXRpb25cIik7XG4gICAgICAgIHRoaXMua2V5Ym9hcmRBcHBsaWNhdGlvbi5zZXRBdHRyaWJ1dGUoXCJyb2xlXCIsIFwiYXBwbGljYXRpb25cIik7XG4gICAgICAgIHRoaXMua2V5Ym9hcmRBcHBsaWNhdGlvbi50YWJJbmRleCA9IC0xO1xuICAgICAgICB0aGlzLmtleWJvYXJkQXBwbGljYXRpb24uYWRkRXZlbnRMaXN0ZW5lcihcImJsdXJcIiwgKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMua2V5Ym9hcmRJbnB1dEFjdGl2ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY2FuY2VsS2V5Ym9hcmRNb3ZlbWVudCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5zb3J0Q29udGFpbmVyRGl2LmFkZEV2ZW50TGlzdGVuZXIoXCJibHVyXCIsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIHRoaXMua2V5Ym9hcmRJbnB1dEFjdGl2ZSAmJlxuICAgICAgICAgICAgICAgIGV2ZW50LnJlbGF0ZWRUYXJnZXQgIT09IHRoaXMua2V5Ym9hcmRBcHBsaWNhdGlvblxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jYW5jZWxLZXlib2FyZE1vdmVtZW50KCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLmtleWJvYXJkSW5wdXRBY3RpdmUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmhpZGVLZXlib2FyZEVudHJ5SGludCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5zb3J0Q29udGFpbmVyRGl2LmFwcGVuZENoaWxkKHRoaXMua2V5Ym9hcmRBcHBsaWNhdGlvbik7XG4gICAgICAgIHRoaXMub3V0ZXJEaXYuYXBwZW5kQ2hpbGQodGhpcy5zb3J0Q29udGFpbmVyRGl2KTtcbiAgICAgICAgdGhpcy5zb3VyY2VSZWdpb25EaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB0aGlzLnNvdXJjZVJlZ2lvbkRpdi5pZCA9IHRoaXMuY291bnRlcklkICsgXCItc291cmNlUmVnaW9uXCI7XG4gICAgICAgIHRoaXMuc291cmNlUmVnaW9uRGl2LmNsYXNzTGlzdC5hZGQoXCJzb3J0YWJsZS1jb2RlXCIpO1xuICAgICAgICB0aGlzLnNvdXJjZUxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdGhpcy5zb3VyY2VMYWJlbC5zZXRBdHRyaWJ1dGUoXCJyb2xlXCIsIFwidG9vbHRpcFwiKTtcbiAgICAgICAgdGhpcy5zb3VyY2VMYWJlbC5pZCA9IHRoaXMuY291bnRlcklkICsgXCItc291cmNlVGlwXCI7XG4gICAgICAgIHRoaXMuc291cmNlTGFiZWwuaW5uZXJIVE1MID0gdChcIm1zZ19wYXJzb25fZHJhZ19mcm9tX2hlcmVcIik7XG4gICAgICAgIHRoaXMuc291cmNlUmVnaW9uRGl2LmFwcGVuZENoaWxkKHRoaXMuc291cmNlTGFiZWwpO1xuICAgICAgICB0aGlzLnNvcnRDb250YWluZXJEaXYuYXBwZW5kQ2hpbGQodGhpcy5zb3VyY2VSZWdpb25EaXYpO1xuICAgICAgICB0aGlzLnNvdXJjZUFyZWEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB0aGlzLnNvdXJjZUFyZWEuaWQgPSB0aGlzLmNvdW50ZXJJZCArIFwiLXNvdXJjZVwiO1xuICAgICAgICB0aGlzLnNvdXJjZUFyZWEuY2xhc3NMaXN0LmFkZChcInNvdXJjZVwiKTtcbiAgICAgICAgdGhpcy5zb3VyY2VBcmVhLnNldEF0dHJpYnV0ZShcbiAgICAgICAgICAgIFwiYXJpYS1kZXNjcmliZWRieVwiLFxuICAgICAgICAgICAgdGhpcy5jb3VudGVySWQgKyBcIi1zb3VyY2VUaXBcIixcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5zb3VyY2VSZWdpb25EaXYuYXBwZW5kQ2hpbGQodGhpcy5zb3VyY2VBcmVhKTtcbiAgICAgICAgdGhpcy5hbnN3ZXJSZWdpb25EaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB0aGlzLmFuc3dlclJlZ2lvbkRpdi5pZCA9IHRoaXMuY291bnRlcklkICsgXCItYW5zd2VyUmVnaW9uXCI7XG4gICAgICAgIHRoaXMuYW5zd2VyUmVnaW9uRGl2LmNsYXNzTGlzdC5hZGQoXCJzb3J0YWJsZS1jb2RlXCIpO1xuICAgICAgICB0aGlzLmFuc3dlckxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdGhpcy5hbnN3ZXJMYWJlbC5zZXRBdHRyaWJ1dGUoXCJyb2xlXCIsIFwidG9vbHRpcFwiKTtcbiAgICAgICAgdGhpcy5hbnN3ZXJMYWJlbC5pZCA9IHRoaXMuY291bnRlcklkICsgXCItYW5zd2VyVGlwXCI7XG4gICAgICAgIHRoaXMuYW5zd2VyTGFiZWwuaW5uZXJIVE1MID0gdChcIm1zZ19wYXJzb25fZHJhZ190b19oZXJlXCIpO1xuICAgICAgICB0aGlzLmFuc3dlclJlZ2lvbkRpdi5hcHBlbmRDaGlsZCh0aGlzLmFuc3dlckxhYmVsKTtcbiAgICAgICAgdGhpcy5zb3J0Q29udGFpbmVyRGl2LmFwcGVuZENoaWxkKHRoaXMuYW5zd2VyUmVnaW9uRGl2KTtcbiAgICAgICAgdGhpcy5hbnN3ZXJBcmVhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdGhpcy5hbnN3ZXJBcmVhLmlkID0gdGhpcy5jb3VudGVySWQgKyBcIi1hbnN3ZXJcIjtcbiAgICAgICAgdGhpcy5hbnN3ZXJBcmVhLnNldEF0dHJpYnV0ZShcbiAgICAgICAgICAgIFwiYXJpYS1kZXNjcmliZWRieVwiLFxuICAgICAgICAgICAgdGhpcy5jb3VudGVySWQgKyBcIi1hbnN3ZXJUaXBcIixcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5hbnN3ZXJSZWdpb25EaXYuYXBwZW5kQ2hpbGQodGhpcy5hbnN3ZXJBcmVhKTtcbiAgICAgICAgdGhpcy5wYXJzb25zQ29udHJvbERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHRoaXMucGFyc29uc0NvbnRyb2xEaXYuY2xhc3NMaXN0LmFkZChcInBhcnNvbnMtY29udHJvbHNcIik7XG4gICAgICAgIHRoaXMub3V0ZXJEaXYuYXBwZW5kQ2hpbGQodGhpcy5wYXJzb25zQ29udHJvbERpdik7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgdGhpcy5jaGVja0J1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICAgIHRoaXMuY2hlY2tCdXR0b24uY2xhc3NOYW1lID0gXCJidG4gYnRuLXN1Y2Nlc3NcIjtcbiAgICAgICAgdGhpcy5jaGVja0J1dHRvbi50ZXh0Q29udGVudCA9IHQoXCJtc2dfcGFyc29uX2NoZWNrX21lXCIpO1xuICAgICAgICB0aGlzLmNoZWNrQnV0dG9uLmlkID0gdGhpcy5jb3VudGVySWQgKyBcIi1jaGVja1wiO1xuICAgICAgICB0aGlzLnBhcnNvbnNDb250cm9sRGl2LmFwcGVuZENoaWxkKHRoaXMuY2hlY2tCdXR0b24pO1xuICAgICAgICB0aGlzLmNoZWNrQnV0dG9uLnR5cGUgPSBcImJ1dHRvblwiO1xuICAgICAgICB0aGlzLmNoZWNrQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGF0LmNoZWNrQ3VycmVudEFuc3dlcigpO1xuICAgICAgICAgICAgdGhhdC5sb2dDdXJyZW50QW5zd2VyKCk7XG4gICAgICAgICAgICB0aGF0LnJlbmRlckZlZWRiYWNrKCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnJlc2V0QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICAgICAgdGhpcy5yZXNldEJ1dHRvbi5jbGFzc05hbWUgPSBcImJ0biBidG4tZGVmYXVsdFwiO1xuICAgICAgICB0aGlzLnJlc2V0QnV0dG9uLnRleHRDb250ZW50ID0gdChcIm1zZ19wYXJzb25fcmVzZXRcIik7XG4gICAgICAgIHRoaXMucmVzZXRCdXR0b24uaWQgPSB0aGlzLmNvdW50ZXJJZCArIFwiLXJlc2V0XCI7XG4gICAgICAgIHRoaXMucmVzZXRCdXR0b24udHlwZSA9IFwiYnV0dG9uXCI7XG4gICAgICAgIHRoaXMucGFyc29uc0NvbnRyb2xEaXYuYXBwZW5kQ2hpbGQodGhpcy5yZXNldEJ1dHRvbik7XG4gICAgICAgIHRoaXMucmVzZXRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoYXQuY2xlYXJGZWVkYmFjaygpO1xuICAgICAgICAgICAgdGhhdC5jaGVja0J1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhhdC5yZXNldFZpZXcoKTtcbiAgICAgICAgICAgIHRoYXQuY2hlY2tDb3VudCA9IDA7XG4gICAgICAgICAgICB0aGF0LmxvZ01vdmUoXCJyZXNldFwiKTtcbiAgICAgICAgICAgIHRoYXQuc2V0TG9jYWxTdG9yYWdlKCk7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmFkYXB0aXZlKSB7XG4gICAgICAgICAgICB0aGlzLmhlbHBCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgICAgICAgICAgdGhpcy5oZWxwQnV0dG9uLmNsYXNzTmFtZSA9IFwiYnRuIGJ0bi1wcmltYXJ5XCI7XG4gICAgICAgICAgICB0aGlzLmhlbHBCdXR0b24udGV4dENvbnRlbnQgPSB0KFwibXNnX3BhcnNvbl9oZWxwXCIpO1xuICAgICAgICAgICAgdGhpcy5oZWxwQnV0dG9uLmlkID0gdGhpcy5jb3VudGVySWQgKyBcIi1oZWxwXCI7XG4gICAgICAgICAgICB0aGlzLmhlbHBCdXR0b24uZGlzYWJsZWQgPSBmYWxzZTsgLy8gYmplXG4gICAgICAgICAgICB0aGlzLnBhcnNvbnNDb250cm9sRGl2LmFwcGVuZENoaWxkKHRoaXMuaGVscEJ1dHRvbik7XG4gICAgICAgICAgICB0aGlzLmhlbHBCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgdGhhdC5oZWxwTWUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubWVzc2FnZURpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHRoaXMubWVzc2FnZURpdi5pZCA9IHRoaXMuY291bnRlcklkICsgXCItbWVzc2FnZVwiO1xuICAgICAgICB0aGlzLm1lc3NhZ2VEaXYuc2V0QXR0cmlidXRlKFwiYXJpYS1saXZlXCIsIFwicG9saXRlXCIpO1xuICAgICAgICB0aGlzLm1lc3NhZ2VEaXYuc2V0QXR0cmlidXRlKFwicm9sZVwiLCBcInN0YXR1c1wiKTtcbiAgICAgICAgdGhpcy5wYXJzb25zQ29udHJvbERpdi5hcHBlbmRDaGlsZCh0aGlzLm1lc3NhZ2VEaXYpO1xuICAgICAgICB0aGlzLm1lc3NhZ2VEaXYuc3R5bGUudmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XG4gICAgICAgIHRoaXMub3JpZ0VsZW0ucmVwbGFjZVdpdGgodGhpcy5vdXRlckRpdik7XG4gICAgICAgIGNvbnN0IHNxQ29udGFpbmVyID0gdGhpcy5vdXRlckRpdi5jbG9zZXN0KFwiLnNxY29udGFpbmVyXCIpO1xuICAgICAgICBpZiAoc3FDb250YWluZXIpIHtcbiAgICAgICAgICAgIHNxQ29udGFpbmVyLnN0eWxlLm1heFdpZHRoID0gXCJub25lXCI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMub3V0ZXJEaXYpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnF1ZXN0aW9uLmlubmVySFRNTC5tYXRjaCgvXlxccyskLykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnF1ZXN0aW9uLnJlbW92ZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLm91dGVyRGl2LnByZXBlbmQodGhpcy5xdWVzdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gSW5pdGlhbGl6ZSBsaW5lcyBhbmQgc29sdXRpb24gcHJvcGVydGllc1xuICAgIC8vIENvZGVUYWlsb3I6IGEgYmlnIGNoYW5nZSBpcyBpbiB0aGlzIGZ1bmN0aW9uIC0gaW5jbHVkZWQgI3NldHRsZWQgYmxvY2tzIGFuZCBwbGFjZWhvbGRlciBibG9ja3NcbiAgICBpbml0aWFsaXplTGluZXModGV4dCkge1xuICAgICAgICB0aGlzLmxpbmVzID0gW107XG4gICAgICAgIC8vIENyZWF0ZSB0aGUgaW5pdGlhbCBibG9ja3NcbiAgICAgICAgdmFyIHRleHRCbG9ja3MgPSB0ZXh0LnNwbGl0KFwiLS0tXCIpO1xuICAgICAgICBpZiAodGV4dEJsb2Nrcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIC8vIElmIHRoZXJlIGFyZSBubyAtLS0sIHRoZW4gZXZlcnkgbGluZSBpcyBpdHMgb3duIGJsb2NrXG4gICAgICAgICAgICB0ZXh0QmxvY2tzID0gdGV4dC5zcGxpdChcIlxcblwiKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgc29sdXRpb24gPSBbXTtcbiAgICAgICAgdmFyIGluZGVudHMgPSBbXTtcbiAgICAgICAgLy8gQ29kZVRhaWxvcjogUGFyc29ucyBwdXp6bGUgd2lzZSwgdGhlIGJpZ2dlc3QgY2hhbmdlIGlzIGluIHRoaXMgc2VjdGlvblxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnNjYWZmb2xkaW5nID09PSB0cnVlKSB7XG4gICAgICAgICAgICB2YXIgcGxhY2Vob2xkZXJOZWVkZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIC8vIGlmIHRoZXJlIGlzIGEgcGxhY2Vob2xkZXIgbmVlZGVkIHRvIGJlIGNyZWF0ZWQgYXQgdGhlIGVuZFxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0ZXh0QmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRleHRCbG9jayA9IHRleHRCbG9ja3NbaV07XG4gICAgICAgICAgICAgICAgLy8gRmlndXJlIG91dCBvcHRpb25zIGJhc2VkIG9uIHRoZSAjb3B0aW9uXG4gICAgICAgICAgICAgICAgLy8gUmVtb3ZlIHRoZSBvcHRpb25zIGZyb20gdGhlIGNvZGVcbiAgICAgICAgICAgICAgICAvLyBvbmx5IG9wdGlvbnMgYXJlICNwYWlyZWQgb3IgI2Rpc3RyYWN0b3JcbiAgICAgICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHt9O1xuICAgICAgICAgICAgICAgIHZhciBkaXN0cmFjdEluZGV4O1xuICAgICAgICAgICAgICAgIHZhciBkaXN0cmFjdEhlbHB0ZXh0ID0gXCJcIjtcbiAgICAgICAgICAgICAgICB2YXIgdGFnSW5kZXg7XG4gICAgICAgICAgICAgICAgdmFyIHRhZztcbiAgICAgICAgICAgICAgICB2YXIgZGVwZW5kc0luZGV4O1xuICAgICAgICAgICAgICAgIHZhciBkZXBlbmRzID0gW107XG4gICAgICAgICAgICAgICAgaWYgKHRleHRCbG9jay5pbmNsdWRlcyhcIiNwYWlyZWQ6XCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIGRpc3RyYWN0SW5kZXggPSB0ZXh0QmxvY2suaW5kZXhPZihcIiNwYWlyZWQ6XCIpO1xuICAgICAgICAgICAgICAgICAgICBkaXN0cmFjdEhlbHB0ZXh0ID0gdGV4dEJsb2NrXG4gICAgICAgICAgICAgICAgICAgICAgICAuc3Vic3RyaW5nKGRpc3RyYWN0SW5kZXggKyA4LCB0ZXh0QmxvY2subGVuZ3RoKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRyaW0oKTtcbiAgICAgICAgICAgICAgICAgICAgdGV4dEJsb2NrID0gdGV4dEJsb2NrLnN1YnN0cmluZygwLCBkaXN0cmFjdEluZGV4ICsgNyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0ZXh0QmxvY2suaW5jbHVkZXMoXCIjZGlzdHJhY3RvcjpcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgZGlzdHJhY3RJbmRleCA9IHRleHRCbG9jay5pbmRleE9mKFwiI2Rpc3RyYWN0b3I6XCIpO1xuICAgICAgICAgICAgICAgICAgICBkaXN0cmFjdEhlbHB0ZXh0ID0gdGV4dEJsb2NrXG4gICAgICAgICAgICAgICAgICAgICAgICAuc3Vic3RyaW5nKGRpc3RyYWN0SW5kZXggKyAxMiwgdGV4dEJsb2NrLmxlbmd0aClcbiAgICAgICAgICAgICAgICAgICAgICAgIC50cmltKCk7XG4gICAgICAgICAgICAgICAgICAgIHRleHRCbG9jayA9IHRleHRCbG9jay5zdWJzdHJpbmcoMCwgZGlzdHJhY3RJbmRleCArIDExKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRleHRCbG9jay5pbmNsdWRlcyhcIiNzZXR0bGVkXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzZXR0bGVkSW5kZXggPSB0ZXh0QmxvY2suaW5kZXhPZihcIiNzZXR0bGVkXCIpO1xuICAgICAgICAgICAgICAgICAgICBkaXN0cmFjdEhlbHB0ZXh0ID0gdGV4dEJsb2NrXG4gICAgICAgICAgICAgICAgICAgICAgICAuc3Vic3RyaW5nKHNldHRsZWRJbmRleCArIDgsIHRleHRCbG9jay5sZW5ndGgpXG4gICAgICAgICAgICAgICAgICAgICAgICAudHJpbSgpO1xuICAgICAgICAgICAgICAgICAgICB0ZXh0QmxvY2sgPSB0ZXh0QmxvY2suc3Vic3RyaW5nKDAsIHNldHRsZWRJbmRleCArIDgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGV4dEJsb2NrLmluY2x1ZGVzKFwiI3RhZzpcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgdGV4dEJsb2NrID0gdGV4dEJsb2NrLnJlcGxhY2UoLyN0YWc6Lio7Lio7LywgKHMpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICBzLnJlcGxhY2UoL1xccysvZywgXCJcIiksXG4gICAgICAgICAgICAgICAgICAgICk7IC8vIHJlbW92ZSB3aGl0ZXNwYWNlIGluIHRhZyBhbmQgZGVwZW5kcyBsaXN0XG4gICAgICAgICAgICAgICAgICAgIHRhZ0luZGV4ID0gdGV4dEJsb2NrLmluZGV4T2YoXCIjdGFnOlwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGFnID0gdGV4dEJsb2NrLnN1YnN0cmluZyhcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhZ0luZGV4ICsgNSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHRCbG9jay5pbmRleE9mKFwiO1wiLCB0YWdJbmRleCArIDUpLFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGFnID09IFwiXCIpIHRhZyA9IFwiYmxvY2stXCIgKyBpO1xuICAgICAgICAgICAgICAgICAgICBkZXBlbmRzSW5kZXggPSB0ZXh0QmxvY2suaW5kZXhPZihcIjtkZXBlbmRzOlwiKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGRlcGVuZHNTdHJpbmcgPSB0ZXh0QmxvY2suc3Vic3RyaW5nKFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVwZW5kc0luZGV4ICsgOSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHRCbG9jay5pbmRleE9mKFwiO1wiLCBkZXBlbmRzSW5kZXggKyA5KSxcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgZGVwZW5kcyA9XG4gICAgICAgICAgICAgICAgICAgICAgICBkZXBlbmRzU3RyaW5nLmxlbmd0aCA+IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IGRlcGVuZHNTdHJpbmcuc3BsaXQoXCIsXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBbXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRleHRCbG9jay5pbmNsdWRlcygnY2xhc3M9XCJkaXNwbGF5bWF0aCcpKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnNbXCJkaXNwbGF5bWF0aFwiXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9uc1tcImRpc3BsYXltYXRoXCJdID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGV4dEJsb2NrID0gdGV4dEJsb2NrLnJlcGxhY2UoXG4gICAgICAgICAgICAgICAgICAgIC8jKHBhaXJlZHxkaXN0cmFjdG9yfHNldHRsZWR8dGFnOi4qOy4qOykvLFxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAobXlzdHJpbmcsIGFyZzEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnNbYXJnMV0gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIC8vIGlmIGJsb2NrIGlzICNzZXR0bGVkIC0gY3JlYXRlIGEgcGxhY2Vob2xkZXIgbGluZSAoUEgpIGJlZm9yZSB0aGUgbGluZXMsXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgaWYgaXQgaXMgbm90IHRoZSBmaXJzdCBibG9jaywgYW5kIHRoZSBwcmV2aW91cyBibG9jayBpcyBub3Qgc2V0dGxlZFxuICAgICAgICAgICAgICAgIC8vIElmIGxpbmVzIGFyZTogc2V0dGxlZCwgbGluZSAxLCBsaW5lIDIsIGxpbmUgMywgc2V0dGxlZCwgbGluZSA0OlxuICAgICAgICAgICAgICAgIC8vIENyZWF0ZSBzZXR0bGVkLCBsaW5lIDEsIGxpbmUgMiwgbGluZSAzLCBQSDEsIHNldHRsZWQsIGxpbmUgNCwgUEgyXG4gICAgICAgICAgICAgICAgLy8gSWYgbGluZXMgYXJlOiBsaW5lIDEsIHNldHRsZWQsIHNldHRsZWQsIGxpbmUgMiwgbGluZSAzLCBsaW5lIDQsIHNldHRsZWQ6XG4gICAgICAgICAgICAgICAgLy8gQ3JlYXRlIGxpbmUgMSwgUEgxLCBzZXR0bGVkLCBzZXR0bGVkLCBsaW5lIDIsIGxpbmUgMywgbGluZSA0LCBQSDIsIHNldHRsZWRcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnNbXCJzZXR0bGVkXCJdICYmXG4gICAgICAgICAgICAgICAgICAgIGkgPiAwICYmXG4gICAgICAgICAgICAgICAgICAgIGxpbmVzLmxlbmd0aCA+IDAgJiZcbiAgICAgICAgICAgICAgICAgICAgIWxpbmVzW2xpbmVzLmxlbmd0aCAtIDFdLmlzU2V0dGxlZFxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcGxhY2Vob2xkZXJMaW5lID0gbmV3IFBsYWNlaG9sZGVyTGluZSh0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgbGluZXMucHVzaChwbGFjZWhvbGRlckxpbmUpO1xuICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlckxpbmUuZGlzdHJhY3RvciA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyTGluZS5wYWlyZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXJMaW5lLmRpc3RyYWN0SGVscHRleHQgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlckxpbmUuZ3JvdXBXaXRoTmV4dCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlckxpbmUuaW5kZW50ID0gMDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAob3B0aW9uc1tcInNldHRsZWRcIl0pIHtcbiAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXJOZWVkZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIENyZWF0ZSBsaW5lc1xuICAgICAgICAgICAgICAgIHZhciBsaW5lcyA9IFtdO1xuICAgICAgICAgICAgICAgIGlmICghb3B0aW9uc1tcImRpc3BsYXltYXRoXCJdKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzcGxpdCA9IHRleHRCbG9jay5zcGxpdChcIlxcblwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3BsaXQgPSBbdGV4dEJsb2NrXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBzcGxpdC5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY29kZSA9IHNwbGl0W2pdO1xuICAgICAgICAgICAgICAgICAgICAvLyBkaXNjYXJkIGJsYW5rIHJvd3NcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEvXlxccyokLy50ZXN0KGNvZGUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGluZSA9IG5ldyBQYXJzb25zTGluZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvZGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uc1tcImRpc3BsYXltYXRoXCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVzLnB1c2gobGluZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAob3B0aW9uc1tcInBhaXJlZFwiXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmUuZGlzdHJhY3RvciA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluZS5wYWlyZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmUuZGlzdHJhY3RIZWxwdGV4dCA9IGRpc3RyYWN0SGVscHRleHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnNbXCJkaXN0cmFjdG9yXCJdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluZS5kaXN0cmFjdG9yID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5lLnBhaXJlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmUuZGlzdHJhY3RIZWxwdGV4dCA9IGRpc3RyYWN0SGVscHRleHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnNbXCJzZXR0bGVkXCJdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2V0dGxlZCBsaW5lczogZml4ZWQgc29sdXRpb24gbGluZXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5lLmRpc3RyYWN0b3IgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5lLnBhaXJlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmUuaXNTZXR0bGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb2x1dGlvbi5wdXNoKGxpbmUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5lLmRpc3RyYWN0b3IgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5lLnBhaXJlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZ3JhZGVyID09PSBcImRhZ1wiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmUudGFnID0gdGFnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5lLmRlcGVuZHMgPSBkZXBlbmRzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb2x1dGlvbi5wdXNoKGxpbmUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluZGVudHMuaW5kZXhPZihsaW5lLmluZGVudCkgPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRlbnRzLnB1c2gobGluZS5pbmRlbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChsaW5lcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEFkZCBncm91cFdpdGhOZXh0XG4gICAgICAgICAgICAgICAgICAgIGZvciAoaiA9IDA7IGogPCBsaW5lcy5sZW5ndGggLSAxOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVzW2pdLmdyb3VwV2l0aE5leHQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGxpbmVzW2xpbmVzLmxlbmd0aCAtIDFdLmdyb3VwV2l0aE5leHQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocGxhY2Vob2xkZXJOZWVkZWQgJiYgIWxpbmVzW2xpbmVzLmxlbmd0aCAtIDFdLmlzU2V0dGxlZCkge1xuICAgICAgICAgICAgICAgIC8vIGlmIHRoZXJlIGlzIGEgc2V0dGxlZCBsaW5lIGJlZm9yZSB0aGUgZW5kaW5nIGxpbmVzXG4gICAgICAgICAgICAgICAgdmFyIHBsYWNlaG9sZGVyTGluZSA9IG5ldyBQbGFjZWhvbGRlckxpbmUodGhpcyk7XG4gICAgICAgICAgICAgICAgbGluZXMucHVzaChwbGFjZWhvbGRlckxpbmUpO1xuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyTGluZS5kaXN0cmFjdG9yID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlckxpbmUucGFpcmVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgcGxhY2Vob2xkZXJMaW5lLmRpc3RyYWN0SGVscHRleHQgPSBcIlwiO1xuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyTGluZS5ncm91cFdpdGhOZXh0ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBDb2RlVGFpbG9yOiBOb3JtYWxpemUgdGhlIGluZGVudHMgZm9yIGphdmEgLSBzb21ldGltZXMgamF2YSBpbmRlbnQgZGlyZWN0bHkgdXNlcyA4IHNwYWNlcyBmb3IgbWV0aG9kIGluZGVudFxuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5sYW5ndWFnZSA9PT0gXCJqYXZhXCIpIHtcbiAgICAgICAgICAgICAgICBsZXQgY2xhc3NMaW5lSW5kZW50ID0gbnVsbDtcbiAgICAgICAgICAgICAgICBsZXQgbWV0aG9kTGluZUluZGVudCA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbGluZVRleHQgPSB0aGlzLmxpbmVzW2ldLnRleHQ7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NMaW5lSW5kZW50ID09PSBudWxsICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAobGluZVRleHQuaW5jbHVkZXMoXCJwdWJsaWMgY2xhc3NcIikgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5lVGV4dC5zdGFydHNXaXRoKFwiaW1wb3J0XCIpKVxuICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTGluZUluZGVudCA9IHRoaXMubGluZXNbaV0uaW5kZW50O1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kTGluZUluZGVudCA9PT0gbnVsbCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgbGluZVRleHQuaW5jbHVkZXMoXCJwdWJsaWMgc3RhdGljXCIpXG4gICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kTGluZUluZGVudCA9IHRoaXMubGluZXNbaV0uaW5kZW50O1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gQnJlYWsgZWFybHkgb25jZSBib3RoIGFyZSBmb3VuZFxuICAgICAgICAgICAgICAgICAgICBpZiAoY2xhc3NMaW5lSW5kZW50ICE9PSBudWxsICYmIG1ldGhvZExpbmVJbmRlbnQgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gRGV0ZWN0ZWQgSmF2YSA4LXNwYWNlIGluZGVudCDigJQgd2lsbCBzaGlmdCBsZXZlbHMgZG93biBieSBvbmUuXG4gICAgICAgICAgICAgICAgaWYgKGNsYXNzTGluZUluZGVudCA9PT0gMCAmJiBtZXRob2RMaW5lSW5kZW50ID09PSA4KSB7XG4gICAgICAgICAgICAgICAgICAgIGluZGVudHMgPSBpbmRlbnRzLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhIC0gYjtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmxpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbGluZSA9IHRoaXMubGluZXNbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgb3JpZ2luYWxJbmRlbnQgPSBsaW5lLmluZGVudDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBub3JtYWxpemVkTGV2ZWwgPSBpbmRlbnRzLmluZGV4T2Yob3JpZ2luYWxJbmRlbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5vcm1hbGl6ZWRMZXZlbCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBub3JtYWxpemVkTGV2ZWwgLT0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmUuaW5kZW50ID0gbm9ybWFsaXplZExldmVsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaW5kZW50cyA9IGluZGVudHMuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGEgLSBiO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmxpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbGluZSA9IHRoaXMubGluZXNbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lLmluZGVudCA9IGluZGVudHMuaW5kZXhPZihsaW5lLmluZGVudCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIFB5dGhvbiAtIE9yaWdpbmFsIGJlaGF2aW9yXG4gICAgICAgICAgICAgICAgaW5kZW50cyA9IGluZGVudHMuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYSAtIGI7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmxpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBsaW5lID0gdGhpcy5saW5lc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgbGluZS5pbmRlbnQgPSBpbmRlbnRzLmluZGV4T2YobGluZS5pbmRlbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc29sdXRpb24gPSBzb2x1dGlvbjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIE5vcm1hbCBQYXJzb25zIHB1enpsZSBpbml0aWFsaXphdGlvblxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0ZXh0QmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRleHRCbG9jayA9IHRleHRCbG9ja3NbaV07XG4gICAgICAgICAgICAgICAgLy8gRmlndXJlIG91dCBvcHRpb25zIGJhc2VkIG9uIHRoZSAjb3B0aW9uXG4gICAgICAgICAgICAgICAgLy8gUmVtb3ZlIHRoZSBvcHRpb25zIGZyb20gdGhlIGNvZGVcbiAgICAgICAgICAgICAgICAvLyBvbmx5IG9wdGlvbnMgYXJlICNwYWlyZWQgb3IgI2Rpc3RyYWN0b3JcbiAgICAgICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHt9O1xuICAgICAgICAgICAgICAgIHZhciBkaXN0cmFjdEluZGV4O1xuICAgICAgICAgICAgICAgIHZhciBkaXN0cmFjdEhlbHB0ZXh0ID0gXCJcIjtcbiAgICAgICAgICAgICAgICB2YXIgdGFnSW5kZXg7XG4gICAgICAgICAgICAgICAgdmFyIHRhZztcbiAgICAgICAgICAgICAgICB2YXIgZGVwZW5kc0luZGV4O1xuICAgICAgICAgICAgICAgIHZhciBkZXBlbmRzID0gW107XG4gICAgICAgICAgICAgICAgaWYgKHRleHRCbG9jay5pbmNsdWRlcyhcIiNwYWlyZWQ6XCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIGRpc3RyYWN0SW5kZXggPSB0ZXh0QmxvY2suaW5kZXhPZihcIiNwYWlyZWQ6XCIpO1xuICAgICAgICAgICAgICAgICAgICBkaXN0cmFjdEhlbHB0ZXh0ID0gdGV4dEJsb2NrXG4gICAgICAgICAgICAgICAgICAgICAgICAuc3Vic3RyaW5nKGRpc3RyYWN0SW5kZXggKyA4LCB0ZXh0QmxvY2subGVuZ3RoKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRyaW0oKTtcbiAgICAgICAgICAgICAgICAgICAgdGV4dEJsb2NrID0gdGV4dEJsb2NrLnN1YnN0cmluZygwLCBkaXN0cmFjdEluZGV4ICsgNyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0ZXh0QmxvY2suaW5jbHVkZXMoXCIjZGlzdHJhY3RvcjpcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgZGlzdHJhY3RJbmRleCA9IHRleHRCbG9jay5pbmRleE9mKFwiI2Rpc3RyYWN0b3I6XCIpO1xuICAgICAgICAgICAgICAgICAgICBkaXN0cmFjdEhlbHB0ZXh0ID0gdGV4dEJsb2NrXG4gICAgICAgICAgICAgICAgICAgICAgICAuc3Vic3RyaW5nKGRpc3RyYWN0SW5kZXggKyAxMiwgdGV4dEJsb2NrLmxlbmd0aClcbiAgICAgICAgICAgICAgICAgICAgICAgIC50cmltKCk7XG4gICAgICAgICAgICAgICAgICAgIHRleHRCbG9jayA9IHRleHRCbG9jay5zdWJzdHJpbmcoMCwgZGlzdHJhY3RJbmRleCArIDExKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRleHRCbG9jay5pbmNsdWRlcyhcIiN0YWc6XCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRleHRCbG9jayA9IHRleHRCbG9jay5yZXBsYWNlKC8jdGFnOi4qOy4qOy8sIChzKSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgcy5yZXBsYWNlKC9cXHMrL2csIFwiXCIpLFxuICAgICAgICAgICAgICAgICAgICApOyAvLyByZW1vdmUgd2hpdGVzcGFjZSBpbiB0YWcgYW5kIGRlcGVuZHMgbGlzdFxuICAgICAgICAgICAgICAgICAgICB0YWdJbmRleCA9IHRleHRCbG9jay5pbmRleE9mKFwiI3RhZzpcIik7XG4gICAgICAgICAgICAgICAgICAgIHRhZyA9IHRleHRCbG9jay5zdWJzdHJpbmcoXG4gICAgICAgICAgICAgICAgICAgICAgICB0YWdJbmRleCArIDUsXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0QmxvY2suaW5kZXhPZihcIjtcIiwgdGFnSW5kZXggKyA1KSxcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhZyA9PSBcIlwiKSB0YWcgPSBcImJsb2NrLVwiICsgaTtcbiAgICAgICAgICAgICAgICAgICAgZGVwZW5kc0luZGV4ID0gdGV4dEJsb2NrLmluZGV4T2YoXCI7ZGVwZW5kczpcIik7XG4gICAgICAgICAgICAgICAgICAgIGxldCBkZXBlbmRzU3RyaW5nID0gdGV4dEJsb2NrLnN1YnN0cmluZyhcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlcGVuZHNJbmRleCArIDksXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0QmxvY2suaW5kZXhPZihcIjtcIiwgZGVwZW5kc0luZGV4ICsgOSksXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIGRlcGVuZHMgPVxuICAgICAgICAgICAgICAgICAgICAgICAgZGVwZW5kc1N0cmluZy5sZW5ndGggPiAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBkZXBlbmRzU3RyaW5nLnNwbGl0KFwiLFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogW107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0ZXh0QmxvY2suaW5jbHVkZXMoJ2NsYXNzPVwiZGlzcGxheW1hdGgnKSkge1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zW1wiZGlzcGxheW1hdGhcIl0gPSB0cnVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnNbXCJkaXNwbGF5bWF0aFwiXSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0ZXh0QmxvY2sgPSB0ZXh0QmxvY2sucmVwbGFjZShcbiAgICAgICAgICAgICAgICAgICAgL1xccyojKHBhaXJlZHxkaXN0cmFjdG9yfHRhZzouKjsuKjspXFxzKi9nLFxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAobXlzdHJpbmcsIGFyZzEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnNbYXJnMV0gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAvLyBDcmVhdGUgbGluZXNcbiAgICAgICAgICAgICAgICB2YXIgbGluZXMgPSBbXTtcbiAgICAgICAgICAgICAgICBpZiAoIW9wdGlvbnNbXCJkaXNwbGF5bWF0aFwiXSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3BsaXQgPSB0ZXh0QmxvY2suc3BsaXQoXCJcXG5cIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNwbGl0ID0gW3RleHRCbG9ja107XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBzcGxpdC5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY29kZSA9IHNwbGl0W2pdO1xuICAgICAgICAgICAgICAgICAgICBsZXQgaXNCbGFuayA9IC9eXFxzKiQvLnRlc3QoY29kZSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIGRpc2NhcmQgdXAgdG8gb25lIGJsYW5rIGxlYWRpbmcgb3IgdHJhaWxpbmcgbGluZVxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNCbGFuayAmJiAoaiA9PSAwIHx8IGogPT0gc3BsaXQubGVuZ3RoIC0gMSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHZhciBsaW5lID0gbmV3IFBhcnNvbnNMaW5lKFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zW1wiZGlzcGxheW1hdGhcIl0sXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIGxpbmVzLnB1c2gobGluZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcHRpb25zW1wicGFpcmVkXCJdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lLmRpc3RyYWN0b3IgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGluZS5wYWlyZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGluZS5kaXN0cmFjdEhlbHB0ZXh0ID0gZGlzdHJhY3RIZWxwdGV4dDtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChvcHRpb25zW1wiZGlzdHJhY3RvclwiXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGluZS5kaXN0cmFjdG9yID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmUucGFpcmVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lLmRpc3RyYWN0SGVscHRleHQgPSBkaXN0cmFjdEhlbHB0ZXh0O1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGluZS5kaXN0cmFjdG9yID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lLnBhaXJlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5ncmFkZXIgPT09IFwiZGFnXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5lLnRhZyA9IHRhZztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5lLmRlcGVuZHMgPSBkZXBlbmRzO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgc29sdXRpb24ucHVzaChsaW5lKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZW50cy5pbmRleE9mKGxpbmUuaW5kZW50KSA9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZW50cy5wdXNoKGxpbmUuaW5kZW50KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobGluZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBBZGQgZ3JvdXBXaXRoTmV4dFxuICAgICAgICAgICAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgbGluZXMubGVuZ3RoIC0gMTsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lc1tqXS5ncm91cFdpdGhOZXh0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBsaW5lc1tsaW5lcy5sZW5ndGggLSAxXS5ncm91cFdpdGhOZXh0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gTm9ybWFsaXplIHRoZSBpbmRlbnRzXG4gICAgICAgICAgICBpbmRlbnRzID0gaW5kZW50cy5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGEgLSBiO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5saW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGxpbmUgPSB0aGlzLmxpbmVzW2ldO1xuICAgICAgICAgICAgICAgIGxpbmUuaW5kZW50ID0gaW5kZW50cy5pbmRleE9mKGxpbmUuaW5kZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc29sdXRpb24gPSBzb2x1dGlvbjtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBCYXNlZCBvbiB0aGUgYmxvY2tzLCBjcmVhdGUgdGhlIHNvdXJjZSBhbmQgYW5zd2VyIGFyZWFzXG4gICAgYXN5bmMgaW5pdGlhbGl6ZUFyZWFzKHNvdXJjZUJsb2NrcywgYW5zd2VyQmxvY2tzLCBvcHRpb25zKSB7XG4gICAgICAgIC8vIENyZWF0ZSBibG9ja3MgcHJvcGVydHkgYXMgdGhlIHN1bSBvZiB0aGUgdHdvXG4gICAgICAgIGNvbnN0IHBhcmVudCA9IHRoaXMub3V0ZXJEaXYucGFyZW50Tm9kZTtcbiAgICAgICAgdmFyIGJsb2NrcyA9IFtdO1xuICAgICAgICB2YXIgaSwgYmxvY2s7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBzb3VyY2VCbG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGJsb2NrID0gc291cmNlQmxvY2tzW2ldO1xuICAgICAgICAgICAgYmxvY2tzLnB1c2goYmxvY2spO1xuICAgICAgICAgICAgdGhpcy5zb3VyY2VBcmVhLmFwcGVuZENoaWxkKGJsb2NrLnZpZXcpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBhbnN3ZXJCbG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGJsb2NrID0gYW5zd2VyQmxvY2tzW2ldO1xuICAgICAgICAgICAgYmxvY2tzLnB1c2goYmxvY2spO1xuICAgICAgICAgICAgdGhpcy5hbnN3ZXJBcmVhLmFwcGVuZENoaWxkKGJsb2NrLnZpZXcpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYmxvY2tzID0gYmxvY2tzO1xuICAgICAgICB0aGlzLm9ic2VydmVNYXRoSmF4U3BlZWNoKCk7XG4gICAgICAgIC8vIElmIHByZXNlbnQsIGRpc2FibGUgc29tZSBibG9ja3NcbiAgICAgICAgdmFyIGRpc2FibGVkID0gb3B0aW9ucy5kaXNhYmxlZDtcbiAgICAgICAgaWYgKGRpc2FibGVkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBibG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBibG9jayA9IGJsb2Nrc1tpXTtcbiAgICAgICAgICAgICAgICBpZiAoZGlzYWJsZWQuaW5jbHVkZXMoYmxvY2subGluZXNbMF0uaW5kZXgpKSB7XG4gICAgICAgICAgICAgICAgICAgIGJsb2NrLnZpZXcuY2xhc3NMaXN0LmFkZChcImRpc2FibGVkXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBEZXRlcm1pbmUgaG93IG11Y2ggaW5kZW50IHNob3VsZCBiZSBwb3NzaWJsZSBpbiB0aGUgYW5zd2VyIGFyZWFcbiAgICAgICAgdmFyIGluZGVudCA9IDA7XG4gICAgICAgIGlmICghdGhpcy5ub2luZGVudCkge1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5sYW5ndWFnZSA9PSBcIm5hdHVyYWxcIiB8fFxuICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5sYW5ndWFnZSA9PSBcIm1hdGhcIiB8fFxuICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5sYW5ndWFnZSA9PSBcInRleHRcIlxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgaW5kZW50ID0gdGhpcy5zb2x1dGlvbkluZGVudCgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpbmRlbnQgPSBNYXRoLm1heCgwLCB0aGlzLnNvbHV0aW9uSW5kZW50KCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuaW5kZW50ID0gaW5kZW50O1xuICAgICAgICAvLyBGb3IgcmVuZGVyaW5nLCBwbGFjZSBpbiBhbiBvbnNjcmVlbiBwb3NpdGlvblxuICAgICAgICB2YXIgaXNIaWRkZW4gPSB0aGlzLm91dGVyRGl2Lm9mZnNldFBhcmVudCA9PSBudWxsO1xuICAgICAgICB2YXIgcmVwbGFjZUVsZW1lbnQ7XG4gICAgICAgIGlmIChpc0hpZGRlbikge1xuICAgICAgICAgICAgcmVwbGFjZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgaWYgKHBhcmVudCkge1xuICAgICAgICAgICAgICAgIHBhcmVudC5yZXBsYWNlQ2hpbGQocmVwbGFjZUVsZW1lbnQsIHRoaXMub3V0ZXJEaXYpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gYWRkIHJ1bmVzdG9uZS1zcGhpbnggY2xhc3Mgc28gdGhlIGNzcyBydWxlcyBmb3IgcGFyc29ucyB3aWxsIGFwcGx5XG4gICAgICAgICAgICB0aGlzLm91dGVyRGl2LmNsYXNzTGlzdC5hZGQoXCJydW5lc3RvbmUtc3BoaW54XCIpO1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLm91dGVyRGl2KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG9ubHkgZG8gcHJldHRpZnkgaWYgcHJpc20gaXMgbm90IGxvYWRlZFxuICAgICAgICBpZiAoXG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMucHJldHRpZnlMYW5ndWFnZSAhPT0gXCJcIiAmJlxuICAgICAgICAgICAgdHlwZW9mIFByaXNtID09PSBcInVuZGVmaW5lZFwiXG4gICAgICAgICkge1xuICAgICAgICAgICAgcHJldHR5UHJpbnQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGxhbmcgPSB0aGlzLm9wdGlvbnNbXCJsYW5ndWFnZVwiXTtcbiAgICAgICAgaWYgKGxhbmcgJiYgdHlwZW9mIFByaXNtICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBjb25zdCBjb2RlRWxzID0gdGhpcy5jb250YWluZXJEaXYucXVlcnlTZWxlY3RvckFsbChcImNvZGVcIik7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGVsIG9mIGNvZGVFbHMpIHtcbiAgICAgICAgICAgICAgICBlbC5jbGFzc0xpc3QuYWRkKGBsYW5ndWFnZS0ke2xhbmd9YCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBQcmlzbS5oaWdobGlnaHRBbGxVbmRlcih0aGlzLmNvbnRhaW5lckRpdik7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMubGluZXNbaV0uaW5pdGlhbGl6ZVdpZHRoKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTZXQgdGhlIHNvdXJjZSB3aWR0aCB0byBpdHMgbWF4IHZhbHVlLiAgVGhpcyBhbGxvd3MgdGhlIGJsb2NrcyB0byBiZSBjcmVhdGVkXG4gICAgICAgIC8vIGF0IHRoZWlyIFwibmF0dXJhbFwiIHNpemUuIEFzIGxvbmcgYXMgdGhhdCBpcyBzbWFsbGVyIHRoYW4gdGhlIG1heC5cbiAgICAgICAgLy8gVGhpcyBhbGxvd3MgdXMgdG8gdXNlIHNlbnNpYmxlIGZ1bmN0aW9ucyB0byBkZXRlcm1pbmUgdGhlIGNvcnJlY3QgaGVpZ2h0c1xuICAgICAgICAvLyBhbmQgd2lkdGhzIGZvciB0aGUgZHJhZyBhbmQgZHJvcCBhcmVhcy5cbiAgICAgICAgLy8gTGlrZSBtb3N0IG9mIHRoZSBzaXppbmcsIHRoaXMgaXMgYSBiaXQgb2YgYSBoYWNrLlxuICAgICAgICBjb25zdCBhdmFpbGFibGVXaWR0aCA9IHRoaXMub3V0ZXJEaXYub2Zmc2V0V2lkdGg7XG4gICAgICAgIGNvbnN0IGFuc3dlckluZGVudFNwYWNlID0gdGhpcy5vcHRpb25zLnBpeGVsc1BlckluZGVudCAqIHRoaXMuaW5kZW50O1xuICAgICAgICBjb25zdCBtYXJnaW5GdWRnZSA9IDgwOyAvLyBtYXJnaW5zLCBwYWRkaW5nLCBldGMuLi5cbiAgICAgICAgbGV0IG1heFNvdXJjZUFyZWFXaWR0aCA9XG4gICAgICAgICAgICAoYXZhaWxhYmxlV2lkdGggLSBhbnN3ZXJJbmRlbnRTcGFjZSAtIG1hcmdpbkZ1ZGdlKSAvIDI7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMubnVtYmVyZWQgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBtYXhTb3VyY2VBcmVhV2lkdGggLT0gMjU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zb3VyY2VBcmVhLnN0eWxlLndpZHRoID0gbWF4U291cmNlQXJlYVdpZHRoICsgXCJweFwiOyAvLyBsaWtlbHkgcmVkdWNlZCBsYXRlclxuXG4gICAgICAgIC8vIExheW91dCB0aGUgYXJlYXNcbiAgICAgICAgdmFyIGFyZWFXaWR0aCwgYXJlYUhlaWdodDtcbiAgICAgICAgLy8gRXN0YWJsaXNoIHRoZSB3aWR0aCBhbmQgaGVpZ2h0IG9mIHRoZSBkcm9wcGFibGUgYXJlYXNcbiAgICAgICAgdmFyIGl0ZW07XG4gICAgICAgIGFyZWFIZWlnaHQgPSAyMDtcbiAgICAgICAgdmFyIGhlaWdodF9hZGQgPSAwO1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLm51bWJlcmVkICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgaGVpZ2h0X2FkZCA9IDE7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBVc2UgdHdvIGV4cGxpY2l0IHBhc3NlcyDigJQgZmlyc3QgbWVhc3VyZSBhbGwgd2lkdGhzICh3aXRoIE1hdGhKYXggYXdhaXRlZCBwZXIgYmxvY2sgZm9yIG1hdGgpLFxuICAgICAgICAvLyB0aGVuIGFwcGx5IHRoZSBmaW5hbCBhcmVhV2lkdGggdG8gYWxsIGJsb2NrcyBhbmQgbWVhc3VyZSBoZWlnaHRzLlxuICAgICAgICBhcmVhV2lkdGggPSAwO1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgLy8gUGFzcyAxOiByZW5kZXIgbWF0aCAoaWYgbmVlZGVkKSBhbmQgbWVhc3VyZSBuYXR1cmFsIHdpZHRoIG9mIGVhY2ggYmxvY2tcbiAgICAgICAgY29uc3QgaXNNYXRoID1cbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5sYW5ndWFnZSA9PSBcIm5hdHVyYWxcIiB8fFxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLmxhbmd1YWdlID09IFwibWF0aFwiIHx8XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMubGFuZ3VhZ2UgPT0gXCJ0ZXh0XCI7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBibG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSBibG9ja3NbaV0udmlldztcbiAgICAgICAgICAgIGlmIChpc01hdGgpIHtcbiAgICAgICAgICAgICAgICBhd2FpdCBzZWxmLnF1ZXVlTWF0aEpheChpdGVtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFyZWFXaWR0aCA9IE1hdGgubWF4KGFyZWFXaWR0aCwgaXRlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kaXNhYmxlQmxvY2tNYXRoVGFiU3RvcHMoKTtcbiAgICAgICAgdGhpcy51cGRhdGVCbG9ja0FyaWFMYWJlbHMoKTtcbiAgICAgICAgLy8gUGFzcyAyOiBhcHBseSB1bmlmb3JtIHdpZHRoIHRvIGFsbCBibG9ja3MsIHRoZW4gbWVhc3VyZSBoZWlnaHRzXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBibG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSBibG9ja3NbaV0udmlldztcbiAgICAgICAgICAgIGl0ZW0uc3R5bGUud2lkdGggPSBhcmVhV2lkdGggLSAyMiArIFwicHhcIjtcbiAgICAgICAgICAgIHZhciBhZGRpdGlvbiA9IDMuODtcbiAgICAgICAgICAgIGNvbnN0IHN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShpdGVtKTtcbiAgICAgICAgICAgIGNvbnN0IG91dGVySCA9XG4gICAgICAgICAgICAgICAgaXRlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQgK1xuICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQoc3R5bGUubWFyZ2luVG9wKSArXG4gICAgICAgICAgICAgICAgcGFyc2VGbG9hdChzdHlsZS5tYXJnaW5Cb3R0b20pO1xuICAgICAgICAgICAgaWYgKG91dGVySCAhPSAzOCkge1xuICAgICAgICAgICAgICAgIGFkZGl0aW9uID0gKDMuMSAqIChvdXRlckggLSAzOCkpIC8gMjE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhcmVhSGVpZ2h0ICs9IG91dGVySCArIGhlaWdodF9hZGQgKiBhZGRpdGlvbjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHNvbWV0aW1lcyB3ZSBoYXZlIGEgcHJvYmxlbSB3aXRoIGhpZGRlbiBlbGVtZW50cyBub3QgZ2V0dGluZyB0aGUgcmlnaHQgaGVpZ2h0XG4gICAgICAgIC8vIGp1c3QgbWFrZSBzdXJlIHRoYXQgd2UgaGF2ZSBhIHJlYXNvbmFibGUgaGVpZ2h0LiBUaGVyZSBtdXN0IGJlIGEgYmV0dGVyIHdheSB0b1xuICAgICAgICAvLyBkbyB0aGlzLlxuICAgICAgICBpZiAodGhpcy5pc1RpbWVkICYmIGFyZWFIZWlnaHQgPCBibG9ja3MubGVuZ3RoICogMzgpIHtcbiAgICAgICAgICAgIGFyZWFIZWlnaHQgPSBibG9ja3MubGVuZ3RoICogNTA7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hcmVhV2lkdGggPSBhcmVhV2lkdGg7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMubnVtYmVyZWQgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLmFyZWFXaWR0aCArPSAyNTtcbiAgICAgICAgICAgIC8vYXJlYUhlaWdodCArPSAoYmxvY2tzLmxlbmd0aCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGluZGVudCA+IDAgJiYgaW5kZW50IDw9IDQpIHtcbiAgICAgICAgICAgIHRoaXMuYW5zd2VyQXJlYS5jbGFzc0xpc3QuYWRkKFwiYW5zd2VyXCIgKyBpbmRlbnQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5hbnN3ZXJBcmVhLmNsYXNzTGlzdC5hZGQoXCJhbnN3ZXJcIik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gSW5pdGlhbGl6ZSBwYWlyZWQgZGlzdHJhY3RvciBkZWNvcmF0aW9uXG4gICAgICAgIHZhciBiaW5zID0gW107XG4gICAgICAgIHZhciBiaW4gPSBbXTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMubGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBsaW5lID0gdGhpcy5saW5lc1tpXTtcbiAgICAgICAgICAgIGlmIChsaW5lLmJsb2NrKCkgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgaWYgKGJpbi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGJpbnMucHVzaChiaW4pO1xuICAgICAgICAgICAgICAgICAgICBiaW4gPSBbXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGJpbi5wdXNoKGxpbmUpO1xuICAgICAgICAgICAgICAgIGlmICghbGluZS5ncm91cFdpdGhOZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgIGJpbnMucHVzaChiaW4pO1xuICAgICAgICAgICAgICAgICAgICBiaW4gPSBbXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHBhaXJlZEJpbnMgPSBbXTtcbiAgICAgICAgdmFyIGxpbmVOdW1iZXJzID0gW107XG4gICAgICAgIHZhciBwYWlyZWREaXZzID0gW107XG4gICAgICAgIHZhciBqO1xuICAgICAgICBpZiAodGhpcy5wYWlyRGlzdHJhY3RvcnMgfHwgIXRoaXMub3B0aW9ucy5hZGFwdGl2ZSkge1xuICAgICAgICAgICAgZm9yIChpID0gYmlucy5sZW5ndGggLSAxOyBpID4gLTE7IGktLSkge1xuICAgICAgICAgICAgICAgIGJpbiA9IGJpbnNbaV07XG4gICAgICAgICAgICAgICAgaWYgKGJpblswXS5wYWlyZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gQWRkIGFsbCBpbiBiaW4gdG8gbGluZSBudW1iZXJzXG4gICAgICAgICAgICAgICAgICAgIGZvciAoaiA9IGJpbi5sZW5ndGggLSAxOyBqID4gLTE7IGotLSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGluZU51bWJlcnMudW5zaGlmdChiaW5bal0uaW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxpbmVOdW1iZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFkZCBhbGwgaW4gYmluIHRvIGxpbmUgbnVtYmVyc1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChqID0gYmluLmxlbmd0aCAtIDE7IGogPiAtMTsgai0tKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluZU51bWJlcnMudW5zaGlmdChiaW5bal0uaW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcGFpcmVkQmlucy51bnNoaWZ0KGxpbmVOdW1iZXJzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVOdW1iZXJzID0gW107XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgcGFpcmVkQmlucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBwYWlyZWREaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgICAgIHBhaXJlZERpdi5jbGFzc0xpc3QuYWRkKFwicGFpcmVkXCIpO1xuICAgICAgICAgICAgICAgIHBhaXJlZERpdi5pbm5lckhUTUwgPVxuICAgICAgICAgICAgICAgICAgICBcIjxzcGFuIGlkPSdzdCcgc3R5bGU9J3ZlcnRpY2FsLWFsaWduOiBtaWRkbGU7IGZvbnQtd2VpZ2h0OiBib2xkJz5vcns8L3NwYW4+XCI7XG4gICAgICAgICAgICAgICAgcGFpcmVkRGl2cy5wdXNoKHBhaXJlZERpdik7XG4gICAgICAgICAgICAgICAgdGhpcy5zb3VyY2VBcmVhLmFwcGVuZENoaWxkKHBhaXJlZERpdik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwYWlyZWRCaW5zID0gW107XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hcmVhSGVpZ2h0ID0gYXJlYUhlaWdodDtcbiAgICAgICAgdGhpcy5zb3VyY2VBcmVhLnN0eWxlLndpZHRoID0gYCR7dGhpcy5hcmVhV2lkdGggKyAyfXB4YDtcbiAgICAgICAgdGhpcy5zb3VyY2VBcmVhLnN0eWxlLmhlaWdodCA9IGAke3RoaXMuYXJlYUhlaWdodH1weGA7XG4gICAgICAgIHRoaXMuYW5zd2VyQXJlYS5zdHlsZS53aWR0aCA9IGAke3RoaXMub3B0aW9ucy5waXhlbHNQZXJJbmRlbnQgKiBpbmRlbnQgKyB0aGlzLmFyZWFXaWR0aCArIDJ9cHhgO1xuICAgICAgICB0aGlzLmFuc3dlckFyZWEuc3R5bGUuaGVpZ2h0ID0gYCR7dGhpcy5hcmVhSGVpZ2h0fXB4YDtcblxuICAgICAgICB0aGlzLnBhaXJlZEJpbnMgPSBwYWlyZWRCaW5zO1xuICAgICAgICB0aGlzLnBhaXJlZERpdnMgPSBwYWlyZWREaXZzO1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLm51bWJlcmVkICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5hZGRCbG9ja0xhYmVscyhzb3VyY2VCbG9ja3MuY29uY2F0KGFuc3dlckJsb2NrcykpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFVwZGF0ZSB0aGUgdmlld1xuICAgICAgICB0aGlzLnN0YXRlID0gdW5kZWZpbmVkOyAvLyBuZWVkcyB0byBiZSBoZXJlIGZvciBsb2FkaW5nIGZyb20gc3RvcmFnZVxuICAgICAgICB0aGlzLnVwZGF0ZVZpZXcoKTtcbiAgICAgICAgLy8gUHV0IGJhY2sgaW50byB0aGUgb2Zmc2NyZWVuIHBvc2l0aW9uXG4gICAgICAgIGlmIChpc0hpZGRlbikge1xuICAgICAgICAgICAgcmVwbGFjZUVsZW1lbnQucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQoXG4gICAgICAgICAgICAgICAgdGhpcy5vdXRlckRpdixcbiAgICAgICAgICAgICAgICByZXBsYWNlRWxlbWVudCxcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBNYWtlIGJsb2NrcyBpbnRlcmFjdGl2ZSAoYm90aCBkcmFnLWFuZC1kcm9wIGFuZCBrZXlib2FyZClcbiAgICBpbml0aWFsaXplSW50ZXJhY3Rpdml0eSgpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5ibG9ja3NbaV0uaW5pdGlhbGl6ZUludGVyYWN0aXZpdHkoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmluaXRpYWxpemVUYWJJbmRleCgpO1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5sYW5ndWFnZSA9PSBcIm5hdHVyYWxcIiB8fFxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLmxhbmd1YWdlID09IFwibWF0aFwiIHx8XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMubGFuZ3VhZ2UgPT0gXCJ0ZXh0XCJcbiAgICAgICAgKSB7XG4gICAgICAgICAgICAvLyBNYXRoSmF4IHR5cGVzZXRzIGluIGNhbGwgb3JkZXIsIHNvIHRoaXMgcnVucyBhZnRlciB0aGVcbiAgICAgICAgICAgIC8vIHBlci1ibG9jayBpdGVtcyBoYXZlIHJlYWNoZWQgdGhlaXIgZmluYWwgbGF5b3V0LlxuICAgICAgICAgICAgc2VsZi5xdWV1ZU1hdGhKYXgoc2VsZi5vdXRlckRpdikudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gUmVjYWxjdWxhdGUgYXJlYVdpZHRoIGFuZCBhcmVhSGVpZ2h0IGZyb20gYWxsIGJsb2NrcyAoc291cmNlICsgYW5zd2VyKVxuICAgICAgICAgICAgICAgIC8vIG5vdyB0aGF0IE1hdGhKYXggaGFzIHJlbmRlcmVkIHRvIGZpbmFsIGRpbWVuc2lvbnMuXG4gICAgICAgICAgICAgICAgdmFyIG5ld0FyZWFXaWR0aCA9IDA7XG4gICAgICAgICAgICAgICAgdmFyIG5ld0FyZWFIZWlnaHQgPSAyMDtcbiAgICAgICAgICAgICAgICB2YXIgaGVpZ2h0X2FkZCA9IHNlbGYub3B0aW9ucy5udW1iZXJlZCAhPSB1bmRlZmluZWQgPyAxIDogMDtcbiAgICAgICAgICAgICAgICB2YXIgc291cmNlQmxvY2tzID0gc2VsZi5zb3VyY2VCbG9ja3MoKTtcbiAgICAgICAgICAgICAgICB2YXIgYW5zd2VyQmxvY2tzID0gc2VsZi5hbnN3ZXJCbG9ja3MoKTtcbiAgICAgICAgICAgICAgICB2YXIgYWxsQmxvY2tzID0gc291cmNlQmxvY2tzLmNvbmNhdChhbnN3ZXJCbG9ja3MpO1xuXG4gICAgICAgICAgICAgICAgLy8gRmlyc3QgcGFzczogZmluZCBtYXggbmF0dXJhbCB3aWR0aCBhY3Jvc3MgYWxsIGJsb2Nrc1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYWxsQmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBibG9ja1ZpZXdFbCA9IGFsbEJsb2Nrc1tpXS52aWV3O1xuICAgICAgICAgICAgICAgICAgICBibG9ja1ZpZXdFbC5zdHlsZS53aWR0aCA9IFwiXCI7IC8vIHJlbGVhc2UgZml4ZWQgd2lkdGggdG8gZ2V0IG5hdHVyYWwgd2lkdGhcbiAgICAgICAgICAgICAgICAgICAgdmFyIGJ2U3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKGJsb2NrVmlld0VsKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGJ2V2lkdGggPVxuICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2tWaWV3RWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGggK1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdChidlN0eWxlLm1hcmdpbkxlZnQgfHwgMCkgK1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdChidlN0eWxlLm1hcmdpblJpZ2h0IHx8IDApO1xuICAgICAgICAgICAgICAgICAgICBuZXdBcmVhV2lkdGggPSBNYXRoLm1heChuZXdBcmVhV2lkdGgsIGJ2V2lkdGgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBiYXNlV2lkdGggPSBuZXdBcmVhV2lkdGggLSAyMjtcbiAgICAgICAgICAgICAgICB2YXIgYW5zd2VyV2lkdGggPVxuICAgICAgICAgICAgICAgICAgICBuZXdBcmVhV2lkdGggK1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmluZGVudCAqIHNlbGYub3B0aW9ucy5waXhlbHNQZXJJbmRlbnQgLVxuICAgICAgICAgICAgICAgICAgICAyMjtcblxuICAgICAgICAgICAgICAgIC8vIFNlY29uZCBwYXNzOiBhcHBseSBjb3JyZWN0IHdpZHRoIGFuZCBhY2N1bXVsYXRlIGhlaWdodFxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYWxsQmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBibG9ja0VsID0gYWxsQmxvY2tzW2ldLnZpZXc7XG4gICAgICAgICAgICAgICAgICAgIGJsb2NrRWwuc3R5bGUud2lkdGggPSBiYXNlV2lkdGggKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgICAgIHZhciBiU3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKGJsb2NrRWwpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgb3V0ZXJIID1cbiAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrRWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0ICtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQoYlN0eWxlLm1hcmdpblRvcCB8fCAwKSArXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KGJTdHlsZS5tYXJnaW5Cb3R0b20gfHwgMCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhZGRpdGlvbiA9IDMuODtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG91dGVySCAhPSAzOCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWRkaXRpb24gPSAoMy4xICogKG91dGVySCAtIDM4KSkgLyAyMTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBuZXdBcmVhSGVpZ2h0ICs9IG91dGVySCArIGhlaWdodF9hZGQgKiBhZGRpdGlvbjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBzZWxmLmFyZWFXaWR0aCA9IG5ld0FyZWFXaWR0aDtcbiAgICAgICAgICAgICAgICBzZWxmLmFyZWFIZWlnaHQgPSBuZXdBcmVhSGVpZ2h0O1xuXG4gICAgICAgICAgICAgICAgLy8gUmVzaXplIHNvdXJjZSBhbmQgYW5zd2VyIGFyZWFzXG4gICAgICAgICAgICAgICAgc2VsZi5zb3VyY2VBcmVhLnN0eWxlLndpZHRoID0gbmV3QXJlYVdpZHRoICsgMiArIFwicHhcIjtcbiAgICAgICAgICAgICAgICBzZWxmLnNvdXJjZUFyZWEuc3R5bGUuaGVpZ2h0ID0gbmV3QXJlYUhlaWdodCArIFwicHhcIjtcbiAgICAgICAgICAgICAgICBzZWxmLmFuc3dlckFyZWEuc3R5bGUud2lkdGggPVxuICAgICAgICAgICAgICAgICAgICBzZWxmLm9wdGlvbnMucGl4ZWxzUGVySW5kZW50ICogc2VsZi5pbmRlbnQgK1xuICAgICAgICAgICAgICAgICAgICBuZXdBcmVhV2lkdGggK1xuICAgICAgICAgICAgICAgICAgICAyICtcbiAgICAgICAgICAgICAgICAgICAgXCJweFwiO1xuICAgICAgICAgICAgICAgIHNlbGYuYW5zd2VyQXJlYS5zdHlsZS5oZWlnaHQgPSBuZXdBcmVhSGVpZ2h0ICsgXCJweFwiO1xuXG4gICAgICAgICAgICAgICAgLy8gUmVwb3NpdGlvbiBzb3VyY2UgYmxvY2tzXG4gICAgICAgICAgICAgICAgdmFyIHBvc2l0aW9uVG9wID0gMDtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNvdXJjZUJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3YgPSBzb3VyY2VCbG9ja3NbaV0udmlldztcbiAgICAgICAgICAgICAgICAgICAgc3Yuc3R5bGUubGVmdCA9IFwiMHB4XCI7XG4gICAgICAgICAgICAgICAgICAgIHN2LnN0eWxlLnRvcCA9IHBvc2l0aW9uVG9wICsgXCJweFwiO1xuICAgICAgICAgICAgICAgICAgICBzdi5zdHlsZS53aWR0aCA9IGJhc2VXaWR0aCArIFwicHhcIjtcbiAgICAgICAgICAgICAgICAgICAgc3Yuc3R5bGUuekluZGV4ID0gMjtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN2U3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKHN2KTtcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25Ub3AgKz1cbiAgICAgICAgICAgICAgICAgICAgICAgIHN2LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodCArXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KHN2U3R5bGUubWFyZ2luVG9wIHx8IDApICtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQoc3ZTdHlsZS5tYXJnaW5Cb3R0b20gfHwgMCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gUmVwb3NpdGlvbiBwYWlyZWQgZGlzdHJhY3RvciBicmFja2V0c1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2VsZi5wYWlyZWRCaW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBiaW4gPSBzZWxmLnBhaXJlZEJpbnNbaV07XG4gICAgICAgICAgICAgICAgICAgIHZhciBtYXRjaGluZyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHNvdXJjZUJsb2Nrcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNvdXJjZUJsb2Nrc1tqXS5tYXRjaGVzQmluKGJpbikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXRjaGluZy5wdXNoKHNvdXJjZUJsb2Nrc1tqXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdmFyIGRpdiA9IHNlbGYucGFpcmVkRGl2c1tpXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1hdGNoaW5nLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXYuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGl2LnN0eWxlLmRpc3BsYXkgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGhlaWdodCA9IC01O1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxhc3RWaWV3ID0gbWF0Y2hpbmdbbWF0Y2hpbmcubGVuZ3RoIC0gMV0udmlldztcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmaXJzdFZpZXcgPSBtYXRjaGluZ1swXS52aWV3O1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxhc3RUb3AgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQoZ2V0Q29tcHV0ZWRTdHlsZShsYXN0VmlldykudG9wKSB8fCAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZpcnN0VG9wID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KGdldENvbXB1dGVkU3R5bGUoZmlyc3RWaWV3KS50b3ApIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodCArPSBsYXN0VG9wO1xuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0IC09IGZpcnN0VG9wO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxhc3RTdHlsZSA9IGdldENvbXB1dGVkU3R5bGUobGFzdFZpZXcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0ICs9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdFZpZXcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0ICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KGxhc3RTdHlsZS5tYXJnaW5Ub3AgfHwgMCkgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQobGFzdFN0eWxlLm1hcmdpbkJvdHRvbSB8fCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpdi5zdHlsZS5sZWZ0ID0gXCItNnB4XCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXYuc3R5bGUudG9wID0gZ2V0Q29tcHV0ZWRTdHlsZShmaXJzdFZpZXcpLnRvcDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpdi5zdHlsZS53aWR0aCA9IGJhc2VXaWR0aCArIDM0ICsgXCJweFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGl2LnN0eWxlLmhlaWdodCA9IGhlaWdodCArIFwicHhcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpdi5zdHlsZS56SW5kZXggPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGl2LnN0eWxlLnRleHRJbmRlbnQgPSBcIi0zMHB4XCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXYuc3R5bGUucGFkZGluZ1RvcCA9IChoZWlnaHQgLSA3MCkgLyAyICsgXCJweFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGl2LnN0eWxlLm92ZXJmbG93ID0gXCJ2aXNpYmxlXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXYuc3R5bGUuZm9udFNpemUgPSBcIjQzcHhcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpdi5zdHlsZS52ZXJ0aWNhbEFsaWduID0gXCJtaWRkbGVcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpdi5zdHlsZS5jb2xvciA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ2YXIoLS1wYXJzb25zTGFiZWxDb2xvciwgIzU4NThlMClcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpdi5pbm5lckhUTUwgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiPHNwYW4gaWQ9J3N0JyBzdHlsZT0ndmVydGljYWwtYWxpZ246IG1pZGRsZTsgZm9udC13ZWlnaHQ6IGJvbGQ7IGZvbnQtc2l6ZTogMTVweCc+b3I8L3NwYW4+e1wiO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gUmVwb3NpdGlvbiBhbnN3ZXIgYmxvY2tzXG4gICAgICAgICAgICAgICAgcG9zaXRpb25Ub3AgPSAwO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYW5zd2VyQmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBibG9jayA9IGFuc3dlckJsb2Nrc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGluZGVudCA9XG4gICAgICAgICAgICAgICAgICAgICAgICBibG9jay5pbmRlbnQgKiBzZWxmLm9wdGlvbnMucGl4ZWxzUGVySW5kZW50O1xuICAgICAgICAgICAgICAgICAgICB2YXIgYnYgPSBibG9jay52aWV3O1xuICAgICAgICAgICAgICAgICAgICBidi5zdHlsZS5sZWZ0ID0gaW5kZW50ICsgXCJweFwiO1xuICAgICAgICAgICAgICAgICAgICBidi5zdHlsZS50b3AgPSBwb3NpdGlvblRvcCArIFwicHhcIjtcbiAgICAgICAgICAgICAgICAgICAgYnYuc3R5bGUud2lkdGggPSBhbnN3ZXJXaWR0aCAtIGluZGVudCArIFwicHhcIjtcbiAgICAgICAgICAgICAgICAgICAgYnYuc3R5bGUuekluZGV4ID0gMjtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGJ2U3R5bGUyID0gZ2V0Q29tcHV0ZWRTdHlsZShidik7XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uVG9wICs9XG4gICAgICAgICAgICAgICAgICAgICAgICBidi5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQgK1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdChidlN0eWxlMi5tYXJnaW5Ub3AgfHwgMCkgK1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdChidlN0eWxlMi5tYXJnaW5Cb3R0b20gfHwgMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gTWFrZSB0aGUgcHJvYmxlbSwgcmF0aGVyIHRoYW4gYW4gaW5kaXZpZHVhbCBibG9jaywga2V5Ym9hcmQgYWNjZXNzaWJsZS5cbiAgICBpbml0aWFsaXplVGFiSW5kZXgoKSB7XG4gICAgICAgIHRoaXMuc29ydENvbnRhaW5lckRpdi50YWJJbmRleCA9IDA7XG4gICAgICAgIGZvciAoY29uc3QgYmxvY2sgb2YgdGhpcy5ibG9ja3MpIHtcbiAgICAgICAgICAgIGlmIChibG9jay52aWV3LmNsYXNzTGlzdC5jb250YWlucyhcImRpc2FibGVkXCIpKSB7XG4gICAgICAgICAgICAgICAgYmxvY2sudmlldy5yZW1vdmVBdHRyaWJ1dGUoXCJ0YWJpbmRleFwiKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYmxvY2sudmlldy5zZXRBdHRyaWJ1dGUoXCJ0YWJpbmRleFwiLCBcIi0xXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICA9PT09IFNFUlZFUiBDT01NVU5JQ0FUSU9OID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbiAgICAvLyBSZXR1cm4gdGhlIGFyZ3VtZW50IHRoYXQgaXMgbmV3ZXIgYmFzZWQgb24gdGhlIHRpbWVzdGFtcFxuICAgIG5ld2VyRGF0YShkYXRhQSwgZGF0YUIpIHtcbiAgICAgICAgdmFyIGRhdGVBID0gZGF0YUEudGltZXN0YW1wO1xuICAgICAgICB2YXIgZGF0ZUIgPSBkYXRhQi50aW1lc3RhbXA7XG4gICAgICAgIGlmIChkYXRlQSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBkYXRhQjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGF0ZUIgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gZGF0YUE7XG4gICAgICAgIH1cbiAgICAgICAgZGF0ZUEgPSB0aGlzLmRhdGVGcm9tVGltZXN0YW1wKGRhdGVBKTtcbiAgICAgICAgZGF0ZUIgPSB0aGlzLmRhdGVGcm9tVGltZXN0YW1wKGRhdGVCKTtcbiAgICAgICAgaWYgKGRhdGVBID4gZGF0ZUIpIHtcbiAgICAgICAgICAgIHJldHVybiBkYXRhQTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBkYXRhQjtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBCYXNlZCBvbiB0aGUgZGF0YSwgbG9hZFxuICAgIGFzeW5jIGxvYWREYXRhKGRhdGEpIHtcbiAgICAgICAgLy8gZ3VhcmQgYWdhaW5zdCBhbnkgZmFpbHVyZSB0byBsb2FkL2FkYXB0IHByb2JsZW1cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2NhZmZvbGRpbmcgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICB2YXIgc291cmNlSGFzaCA9IGRhdGEuc291cmNlO1xuICAgICAgICAgICAgICAgIGlmIChzb3VyY2VIYXNoID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBtYWludGFpbiBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eVxuICAgICAgICAgICAgICAgICAgICBzb3VyY2VIYXNoID0gZGF0YS50cmFzaDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIGFuc3dlckhhc2ggPSBkYXRhLmFuc3dlcjtcbiAgICAgICAgICAgICAgICB2YXIgYWRhcHRpdmVIYXNoID0gZGF0YS5hZGFwdGl2ZTtcbiAgICAgICAgICAgICAgICB2YXIgb3B0aW9ucztcbiAgICAgICAgICAgICAgICBpZiAoYWRhcHRpdmVIYXNoID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zID0ge307XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucyA9IHRoaXMub3B0aW9uc0Zyb21IYXNoKGFkYXB0aXZlSGFzaCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLm5vaW5kZW50ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2luZGVudCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLmNoZWNrQ291bnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoZWNrQ291bnQgPSBvcHRpb25zLmNoZWNrQ291bnQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLmhhc1NvbHZlZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGFzU29sdmVkID0gb3B0aW9ucy5oYXNTb2x2ZWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuaW5pdGlhbGl6ZUFyZWFzKFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJsb2Nrc0Zyb21Tb3VyY2UoKSxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXR0bGVkQmxvY2tzRnJvbVNvdXJjZSgpLFxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBzb3VyY2VIYXNoID0gZGF0YS5zb3VyY2U7XG4gICAgICAgICAgICAgICAgaWYgKHNvdXJjZUhhc2ggPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIG1haW50YWluIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5XG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZUhhc2ggPSBkYXRhLnRyYXNoO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgYW5zd2VySGFzaCA9IGRhdGEuYW5zd2VyO1xuICAgICAgICAgICAgICAgIHZhciBhZGFwdGl2ZUhhc2ggPSBkYXRhLmFkYXB0aXZlO1xuICAgICAgICAgICAgICAgIHZhciBvcHRpb25zO1xuICAgICAgICAgICAgICAgIGlmIChhZGFwdGl2ZUhhc2ggPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zID0gdGhpcy5vcHRpb25zRnJvbUhhc2goYWRhcHRpdmVIYXNoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMubm9pbmRlbnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5vaW5kZW50ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMuY2hlY2tDb3VudCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tDb3VudCA9IG9wdGlvbnMuY2hlY2tDb3VudDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMuaGFzU29sdmVkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oYXNTb2x2ZWQgPSBvcHRpb25zLmhhc1NvbHZlZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICBzb3VyY2VIYXNoID09IHVuZGVmaW5lZCB8fFxuICAgICAgICAgICAgICAgICAgICBhbnN3ZXJIYXNoID09IHVuZGVmaW5lZCB8fFxuICAgICAgICAgICAgICAgICAgICBhbnN3ZXJIYXNoLmxlbmd0aCA9PSAxXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuaW5pdGlhbGl6ZUFyZWFzKFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ibG9ja3NGcm9tU291cmNlKCksXG4gICAgICAgICAgICAgICAgICAgICAgICBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMsXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5pbml0aWFsaXplQXJlYXMoXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJsb2Nrc0Zyb21IYXNoKHNvdXJjZUhhc2gpLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ibG9ja3NGcm9tSGFzaChhbnN3ZXJIYXNoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMsXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ3JhZGUgPSB0aGlzLmdyYWRlci5ncmFkZSgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5ncmFkZSA9PSBcImNvcnJlY3RcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb3JyZWN0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmFuc3dlckxpbmVzKCkubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29ycmVjdCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvcnJlY3QgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAvLyBpZiBhbnl0aGluZyBnb2VzIHdyb25nLCBqdXN0IGluaXRpYWxpemUgYmFzZWQgb24gcHJvYmxlbSBzb3VyY2VcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuaW5pdGlhbGl6ZUFyZWFzKHRoaXMuYmxvY2tzRnJvbVNvdXJjZSgpLCBbXSwgb3B0aW9ucyk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAgICAgICBgRXJyb3IgcmVzdG9yaW5nIGFuc3dlciBmb3Igc3R1ZGVudCAke2RhdGEuc2lkfSBpbiAke2RhdGEuZGl2X2lkfS4gRGVmYXVsdGluZyB0byBvcmlnaW5hbCBzdGF0ZS5gLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBTdGFydCB0aGUgaW50ZXJmYWNlXG4gICAgICAgIGlmICh0aGlzLm5lZWRzUmVpbml0aWFsaXphdGlvbiAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgdGhpcy5pbml0aWFsaXplSW50ZXJhY3Rpdml0eSgpO1xuICAgICAgICAgICAgLy8gVGhpcyBpcyBhIGJpdCBvZiBhIGhhY2sgdG8gZ2V0IHRoZSBibG9ja3MgdG8gYmUgaW4gdGhlIHJpZ2h0IHBsYWNlXG4gICAgICAgICAgICAvLyB3aGVuIHRoZSBwYWdlIGxvYWRzLiAgSXQgaXMgbmVlZGVkIGJlY2F1c2UgdGhlIGJsb2NrcyBhcmUgbm90XG4gICAgICAgICAgICAvLyB2aXNpYmxlIHdoZW4gdGhlIHBhZ2UgbG9hZHMsIHNvIHRoZSBzaXplIGlzIG9mZi4gIFRoaXMgZm9yY2VzXG4gICAgICAgICAgICAvLyBhIHJlYWxpZ25tZW50LlxuICAgICAgICAgICAgaWYgKHRoaXMuaXNUaW1lZCAmJiAhdGhpcy5hc3Nlc3NtZW50VGFrZW4pIHtcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnJlc2V0VmlldygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8vIFJldHVybiB3aGF0IGlzIHN0b3JlZCBpbiBsb2NhbCBzdG9yYWdlXG4gICAgbG9jYWxEYXRhKCkge1xuICAgICAgICB2YXIgZGF0YSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMuc3RvcmFnZUlkKTtcbiAgICAgICAgaWYgKGRhdGEgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGlmIChkYXRhLmNoYXJBdCgwKSA9PSBcIntcIikge1xuICAgICAgICAgICAgICAgIGRhdGEgPSBKU09OLnBhcnNlKGRhdGEpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkYXRhID0ge307XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkYXRhID0ge307XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuICAgIC8vIFJ1bmVzdG9uZUJhc2U6IFNlbnQgd2hlbiB0aGUgc2VydmVyIGhhcyBkYXRhXG4gICAgcmVzdG9yZUFuc3dlcnMoc2VydmVyRGF0YSkge1xuICAgICAgICB0aGlzLmxvYWREYXRhKHNlcnZlckRhdGEpO1xuICAgIH1cbiAgICAvLyBSdW5lc3RvbmVCYXNlOiBMb2FkIHdoYXQgaXMgaW4gbG9jYWwgc3RvcmFnZVxuICAgIGNoZWNrTG9jYWxTdG9yYWdlKCkge1xuICAgICAgICBpZiAodGhpcy5ncmFkZXJhY3RpdmUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBsb2NhbERhdGEgPSB0aGlzLmxvY2FsRGF0YSgpO1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICBsb2NhbERhdGEudGltZXN0YW1wICYmXG4gICAgICAgICAgICBsb2NhbERhdGEudGltZXN0YW1wIDwgZUJvb2tDb25maWcudGVybVN0YXJ0RGF0ZVxuICAgICAgICApIHtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKHRoaXMuc3RvcmFnZUlkKTtcbiAgICAgICAgICAgIGxvY2FsRGF0YSA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubG9hZERhdGEobG9jYWxEYXRhKTtcbiAgICB9XG4gICAgLy8gUnVuZXN0b25lQmFzZTogU2V0IHRoZSBzdGF0ZSBvZiB0aGUgcHJvYmxlbSBpbiBsb2NhbCBzdG9yYWdlXG4gICAgc2V0TG9jYWxTdG9yYWdlKGRhdGEpIHtcbiAgICAgICAgdmFyIHRvU3RvcmU7XG4gICAgICAgIGlmIChkYXRhID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdG9TdG9yZSA9IHtcbiAgICAgICAgICAgICAgICBzb3VyY2U6IHRoaXMuc291cmNlSGFzaCgpLFxuICAgICAgICAgICAgICAgIGFuc3dlcjogdGhpcy5hbnN3ZXJIYXNoKCksXG4gICAgICAgICAgICAgICAgdGltZXN0YW1wOiBuZXcgRGF0ZSgpLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHZhciBhZGFwdGl2ZUhhc2ggPSB0aGlzLmFkYXB0aXZlSGFzaCgpO1xuICAgICAgICAgICAgaWYgKGFkYXB0aXZlSGFzaC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdG9TdG9yZS5hZGFwdGl2ZSA9IGFkYXB0aXZlSGFzaDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRvU3RvcmUgPSBkYXRhO1xuICAgICAgICB9XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMuc3RvcmFnZUlkLCBKU09OLnN0cmluZ2lmeSh0b1N0b3JlKSk7XG4gICAgfVxuXG4gICAgYXN5bmMgdXBkYXRlUGxhY2Vob2xkZXJzKCkge1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHZhciBhbnN3ZXJCbG9ja3MgPSB0aGlzLmFuc3dlckJsb2NrcygpO1xuICAgICAgICAgICAgdmFyIGksIGhhc05vcm1hbEJsb2NrO1xuICAgICAgICAgICAgdmFyIHBsYWNlaG9sZGVyO1xuICAgICAgICAgICAgLy8gaGlkZSBwbGFjZWhvbGRlclxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGFuc3dlckJsb2Nrcy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgIC8vIGNoZWNraW5nIG9uIHBsYWNlaG9sZGVyc1xuICAgICAgICAgICAgICAgIGlmIChhbnN3ZXJCbG9ja3NbaV0uaXNQbGFjZWhvbGRlcikge1xuICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlciA9IGFuc3dlckJsb2Nrc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgaGFzTm9ybWFsQmxvY2sgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgaSA+IDAgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICFhbnN3ZXJCbG9ja3NbaSAtIDFdLmlzU2V0dGxlZCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgIWFuc3dlckJsb2Nrc1tpIC0gMV0uaXNQbGFjZWhvbGRlclxuICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhc05vcm1hbEJsb2NrID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICBpIDwgYW5zd2VyQmxvY2tzLmxlbmd0aCAtIDEgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICFhbnN3ZXJCbG9ja3NbaSArIDFdLmlzU2V0dGxlZCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgIWFuc3dlckJsb2Nrc1tpICsgMV0uaXNQbGFjZWhvbGRlclxuICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhc05vcm1hbEJsb2NrID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChoYXNOb3JtYWxCbG9jaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgYSBwbGFjZWhvbGRlciBoYXMgYSBub3JtYWwgYmxvY2sgYmVmb3JlIG9yIGFmdGVyLCBoaWRlIGl0O1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFwbGFjZWhvbGRlci52aWV3LmNsYXNzTGlzdC5jb250YWlucyhcImhpZGVcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlci52aWV3LmNsYXNzTGlzdC5hZGQoXCJoaWRlXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBqID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaiA8IGFuc3dlckJsb2Nrcy5sZW5ndGggLSAxIC0gaTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaisrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyLm1vdmVEb3duKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LCA1KTtcblxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHZhciBhbnN3ZXJCbG9ja3MgPSB0aGlzLmFuc3dlckJsb2NrcygpO1xuICAgICAgICAgICAgdmFyIGNvbnRlbnRMZW5ndGggPSAwO1xuICAgICAgICAgICAgd2hpbGUgKFxuICAgICAgICAgICAgICAgIGNvbnRlbnRMZW5ndGggPCBhbnN3ZXJCbG9ja3MubGVuZ3RoICYmXG4gICAgICAgICAgICAgICAgIWFuc3dlckJsb2Nrc1tjb250ZW50TGVuZ3RoXS52aWV3LmNsYXNzTGlzdC5jb250YWlucyhcImhpZGVcIilcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIGNvbnRlbnRMZW5ndGgrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHNob3cgcGxhY2Vob2xkZXIgd2hlbiBuZWVkZWRcbiAgICAgICAgICAgIHZhciBwcmV2SXNTZXR0bGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIGlmICh0aGlzLmZpcnN0QmxvY2tTZXR0bGVkKSB7XG4gICAgICAgICAgICAgICAgcHJldklzU2V0dGxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHNldHRsZWRDb3VudCA9IDA7XG4gICAgICAgICAgICB2YXIgaTtcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBjb250ZW50TGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICAvLyBsb2NhdGUgdHdvIGNvbnNlY3V0aXZlIHNldHRsZWQgYmxvY2tzXG4gICAgICAgICAgICAgICAgaWYgKGFuc3dlckJsb2Nrc1tpXS5pc1NldHRsZWQgJiYgcHJldklzU2V0dGxlZCkge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGFuc3dlckJsb2Nrc1tpXS5pc1NldHRsZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJldklzU2V0dGxlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHNldHRsZWRDb3VudCsrO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHByZXZJc1NldHRsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgcGxhY2Vob2xkZXI7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgaSA8IGNvbnRlbnRMZW5ndGggfHxcbiAgICAgICAgICAgICAgICAoYW5zd2VyQmxvY2tzW2NvbnRlbnRMZW5ndGggLSAxXSAmJlxuICAgICAgICAgICAgICAgICAgICBhbnN3ZXJCbG9ja3NbY29udGVudExlbmd0aCAtIDFdLmlzU2V0dGxlZCAmJlxuICAgICAgICAgICAgICAgICAgICAhdGhpcy5sYXN0QmxvY2tTZXR0bGVkKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgLy8gbG9va2luZyBmb3IgdGhlIHBsYWNlaG9sZGVyIGJsb2NrIHRoYXQgc2hvdWxkIGJlIGFmdGVyIFwic2V0dGxlZENvdW50XCIgbnVtYmVyIG9mIHNldHRsZWQgYmxvY2tzO1xuICAgICAgICAgICAgICAgIHZhciBwbGFjZWhvbGRlckluZGV4O1xuICAgICAgICAgICAgICAgIGZvciAoXG4gICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVySW5kZXggPSBhbnN3ZXJCbG9ja3MubGVuZ3RoIC0gMTtcbiAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXJJbmRleCA+PSBjb250ZW50TGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlckluZGV4LS1cbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgYW5zd2VyQmxvY2tzW3BsYWNlaG9sZGVySW5kZXhdLmFmdGVyU2V0dGxlZEJsb2NrQ291bnQgPT1cbiAgICAgICAgICAgICAgICAgICAgICAgIHNldHRsZWRDb3VudFxuICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyID0gYW5zd2VyQmxvY2tzW3BsYWNlaG9sZGVySW5kZXhdO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICBhbnN3ZXJCbG9ja3NbcGxhY2Vob2xkZXJJbmRleF0uYWZ0ZXJTZXR0bGVkQmxvY2tDb3VudCAhPVxuICAgICAgICAgICAgICAgICAgICBzZXR0bGVkQ291bnRcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciBtb3ZpbmcgdXA7IG5vIHBsYWNlaG9sZGVyIGZvdW5kXCIpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChwbGFjZWhvbGRlci52aWV3LmNsYXNzTGlzdC5jb250YWlucyhcImhpZGVcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXIudmlldy5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gc2hvdWxkIGJlIG1vdmVkIHJpZ2h0IGJlZm9yZSB0aGUgYmxvY2sgYW5zd2VyQmxvY2tzW2ldXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgcGxhY2Vob2xkZXJJbmRleCAtIGk7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXIubW92ZVVwKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIDEwKTtcbiAgICB9XG5cbiAgICAvKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICA9PT09IExPR0dJTkcgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbiAgICAvLyBMb2cgdGhlIGludGVyYWN0aW9uIHdpdGggdGhlIHByb2JsZW0gdG8gdGhlIHNlcnZlcjpcbiAgICAvLyAgIHN0YXJ0OiB0aGUgdXNlciBzdGFydGVkIGludGVyYWN0aW5nIHdpdGggdGhpcyBwcm9ibGVtXG4gICAgLy8gICBtb3ZlOiB0aGUgdXNlciBtb3ZlZCBhIGJsb2NrIHRvIGEgbmV3IHBvc2l0aW9uXG4gICAgLy8gICByZXNldDogdGhlIHJlc2V0IGJ1dHRvbiB3YXMgcHJlc3NlZFxuICAgIC8vICAgcmVtb3ZlRGlzdHJhY3RvcjogXCJIZWxwIE1lXCIgcmVtb3ZlZCBhIGRpc3RyYWN0b3JcbiAgICAvLyAgIHJlbW92ZUluZGVudGF0aW9uOiBcIkhlbHAgTWVcIiByZW1vdmVkIGluZGVudGF0aW9uXG4gICAgLy8gICBjb21iaW5lQmxvY2tzOiBcIkhlbHAgTWVcIiBjb21iaW5lZCBibG9ja3NcbiAgICBsb2dNb3ZlKGFjdGl2aXR5KSB7XG4gICAgICAgIHZhciBldmVudCA9IHtcbiAgICAgICAgICAgIGV2ZW50OiBcInBhcnNvbnNNb3ZlXCIsXG4gICAgICAgICAgICBkaXZfaWQ6IHRoaXMuZGl2aWQsXG4gICAgICAgICAgICBzdG9yYWdlaWQ6IHN1cGVyLmxvY2FsU3RvcmFnZUtleSgpLFxuICAgICAgICB9O1xuICAgICAgICB2YXIgYWN0ID0gYWN0aXZpdHkgKyBcInxcIiArIHRoaXMuc291cmNlSGFzaCgpICsgXCJ8XCIgKyB0aGlzLmFuc3dlckhhc2goKTtcbiAgICAgICAgdmFyIGFkYXB0aXZlSGFzaCA9IHRoaXMuYWRhcHRpdmVIYXNoKCk7XG4gICAgICAgIGlmIChhZGFwdGl2ZUhhc2ggIT09IFwiXCIpIHtcbiAgICAgICAgICAgIGFjdCA9IGFjdCArIFwifFwiICsgYWRhcHRpdmVIYXNoO1xuICAgICAgICB9XG4gICAgICAgIGV2ZW50LmFjdCA9IGFjdDtcbiAgICAgICAgdGhpcy5sb2dCb29rRXZlbnQoZXZlbnQpO1xuICAgIH1cbiAgICAvLyBMb2cgdGhlIGFuc3dlciB0byB0aGUgcHJvYmxlbVxuICAgIC8vICAgY29ycmVjdDogVGhlIGFuc3dlciBnaXZlbiBtYXRjaGVzIHRoZSBzb2x1dGlvblxuICAgIC8vICAgaW5jb3JyZWN0KjogVGhlIGFuc3dlciBpcyB3cm9uZyBmb3IgdmFyaW91cyByZWFzb25zXG4gICAgYXN5bmMgbG9nQ3VycmVudEFuc3dlcihzaWQpIHtcbiAgICAgICAgdmFyIGV2ZW50ID0ge1xuICAgICAgICAgICAgZXZlbnQ6IFwicGFyc29uc1wiLFxuICAgICAgICAgICAgZGl2X2lkOiB0aGlzLmRpdmlkLFxuICAgICAgICB9O1xuICAgICAgICB2YXIgYW5zd2VySGFzaCA9IHRoaXMuYW5zd2VySGFzaCgpO1xuICAgICAgICBldmVudC5hbnN3ZXIgPSBhbnN3ZXJIYXNoO1xuICAgICAgICB2YXIgc291cmNlSGFzaCA9IHRoaXMuc291cmNlSGFzaCgpO1xuICAgICAgICBldmVudC5zb3VyY2UgPSBzb3VyY2VIYXNoO1xuICAgICAgICB2YXIgYWN0ID0gc291cmNlSGFzaCArIFwifFwiICsgYW5zd2VySGFzaDtcbiAgICAgICAgdmFyIGFkYXB0aXZlSGFzaCA9IHRoaXMuYWRhcHRpdmVIYXNoKCk7XG4gICAgICAgIGlmIChhZGFwdGl2ZUhhc2ggIT09IFwiXCIpIHtcbiAgICAgICAgICAgIGV2ZW50LmFkYXB0aXZlID0gYWRhcHRpdmVIYXNoO1xuICAgICAgICAgICAgYWN0ID0gYWN0ICsgXCJ8XCIgKyBhZGFwdGl2ZUhhc2g7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuZ3JhZGUgPT0gXCJjb3JyZWN0XCIpIHtcbiAgICAgICAgICAgIGFjdCA9IFwiY29ycmVjdHxcIiArIGFjdDtcbiAgICAgICAgICAgIGV2ZW50LmNvcnJlY3QgPSBcIlRcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFjdCA9IFwiaW5jb3JyZWN0fFwiICsgYWN0O1xuICAgICAgICAgICAgZXZlbnQuY29ycmVjdCA9IFwiRlwiO1xuICAgICAgICB9XG4gICAgICAgIGV2ZW50LmFjdCA9IGFjdDtcblxuICAgICAgICBpZiAodHlwZW9mIHNpZCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgZXZlbnQuc2lkID0gc2lkO1xuICAgICAgICB9XG5cbiAgICAgICAgYXdhaXQgdGhpcy5sb2dCb29rRXZlbnQoZXZlbnQpO1xuICAgIH1cbiAgICAvKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICA9PT09IEFDQ0VTU0lORyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbiAgICAvLyBBbnN3ZXIgdGhlIGhhc2ggb2YgdGhlIGFkYXB0aXZlIHN0YXRlXG4gICAgYWRhcHRpdmVIYXNoKCkge1xuICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5hZGFwdGl2ZSkge1xuICAgICAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGhhc2ggPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGJsb2NrID0gdGhpcy5ibG9ja3NbaV07XG4gICAgICAgICAgICBpZiAoIWJsb2NrLmVuYWJsZWQoKSkge1xuICAgICAgICAgICAgICAgIGhhc2gucHVzaChcImRcIiArIGJsb2NrLmxpbmVzWzBdLmluZGV4KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5ub2luZGVudCAhPT0gdGhpcy5vcHRpb25zLm5vaW5kZW50KSB7XG4gICAgICAgICAgICBoYXNoLnB1c2goXCJpXCIpO1xuICAgICAgICB9XG4gICAgICAgIGhhc2gucHVzaChcImNcIiArIHRoaXMuY2hlY2tDb3VudCk7XG4gICAgICAgIGlmICh0aGlzLmhhc1NvbHZlZCkge1xuICAgICAgICAgICAgaGFzaC5wdXNoKFwic1wiKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaGFzaC5qb2luKFwiLVwiKTtcbiAgICB9XG4gICAgLy8gQ3JlYXRlIG9wdGlvbnMgZm9yIGNyZWF0aW5nIGJsb2NrcyBiYXNlZCBvbiBhIGhhc2hcbiAgICBvcHRpb25zRnJvbUhhc2goaGFzaCkge1xuICAgICAgICB2YXIgc3BsaXQ7XG4gICAgICAgIGlmIChoYXNoID09PSBcIi1cIiB8fCBoYXNoID09PSBcIlwiIHx8IGhhc2ggPT09IG51bGwpIHtcbiAgICAgICAgICAgIHNwbGl0ID0gW107XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzcGxpdCA9IGhhc2guc3BsaXQoXCItXCIpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBvcHRpb25zID0ge307XG4gICAgICAgIHZhciBkaXNhYmxlZCA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNwbGl0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIga2V5ID0gc3BsaXRbaV07XG4gICAgICAgICAgICBpZiAoa2V5WzBdID09IFwiaVwiKSB7XG4gICAgICAgICAgICAgICAgb3B0aW9ucy5ub2luZGVudCA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGtleVswXSA9PSBcImRcIikge1xuICAgICAgICAgICAgICAgIGRpc2FibGVkLnB1c2gocGFyc2VJbnQoa2V5LnNsaWNlKDEpKSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGtleVswXSA9PSBcInNcIikge1xuICAgICAgICAgICAgICAgIG9wdGlvbnMuaGFzU29sdmVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoa2V5WzBdID09IFwiY1wiKSB7XG4gICAgICAgICAgICAgICAgb3B0aW9ucy5jaGVja0NvdW50ID0gcGFyc2VJbnQoa2V5LnNsaWNlKDEpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoZGlzYWJsZWQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgb3B0aW9ucy5kaXNhYmxlZCA9IGRpc2FibGVkO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvcHRpb25zO1xuICAgIH1cbiAgICAvLyBBbnN3ZXIgdGhlIGhhc2ggb2YgdGhlIGFuc3dlciBhcmVhXG4gICAgYW5zd2VySGFzaCgpIHtcbiAgICAgICAgdmFyIGhhc2ggPSBbXTtcbiAgICAgICAgdmFyIGJsb2NrcyA9IHRoaXMuYW5zd2VyQmxvY2tzKCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBoYXNoLnB1c2goYmxvY2tzW2ldLmhhc2goKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGhhc2gubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gXCItXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gaGFzaC5qb2luKFwiLVwiKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBBbnN3ZXIgdGhlIGhhc2ggb2YgdGhlIHNvdXJjZSBhcmVhXG4gICAgc291cmNlSGFzaCgpIHtcbiAgICAgICAgdmFyIGhhc2ggPSBbXTtcbiAgICAgICAgdmFyIGJsb2NrcyA9IHRoaXMuc291cmNlQmxvY2tzKCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBoYXNoLnB1c2goYmxvY2tzW2ldLmhhc2goKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGhhc2gubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gXCItXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gaGFzaC5qb2luKFwiLVwiKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBJbnRlci1wcm9ibGVtIGFkYXB0aXZlIGNoYW5nZXNcbiAgICAvLyBCYXNlZCBvbiB0aGUgcmVjZW50QXR0ZW1wdHMsIHJlbW92ZSBkaXN0cmFjdG9ycywgYWRkIGluZGVudCwgY29tYmluZSBibG9ja3NcbiAgICBhZGFwdEJsb2NrcyhpbnB1dCkge1xuICAgICAgICB2YXIgYmxvY2tzID0gW107XG4gICAgICAgIHZhciBkaXN0cmFjdG9ycyA9IFtdO1xuICAgICAgICB2YXIgYmxvY2s7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaW5wdXQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGJsb2NrID0gaW5wdXRbaV07XG4gICAgICAgICAgICBpZiAoYmxvY2suaXNEaXN0cmFjdG9yKCkpIHtcbiAgICAgICAgICAgICAgICBkaXN0cmFjdG9ycy5wdXNoKGJsb2NrKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYmxvY2tzLnB1c2goYmxvY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVjZW50QXR0ZW1wdHMgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcbiAgICAgICAgICAgIHRoaXMuYWRhcHRpdmVJZCArIFwicmVjZW50QXR0ZW1wdHNcIixcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKHRoaXMucmVjZW50QXR0ZW1wdHMgPT0gdW5kZWZpbmVkIHx8IHRoaXMucmVjZW50QXR0ZW1wdHMgPT0gXCJOYU5cIikge1xuICAgICAgICAgICAgdGhpcy5yZWNlbnRBdHRlbXB0cyA9IDM7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGxhc3Rlc3RBdHRlbXB0Q291bnQgPSB0aGlzLnJlY2VudEF0dGVtcHRzO1xuICAgICAgICB2YXIgbkJsb2NrcyA9IGJsb2Nrcy5sZW5ndGg7XG4gICAgICAgIHZhciBuQmxvY2tzVG9Db21iaW5lID0gMDtcbiAgICAgICAgdmFyIG5EaXN0cmFjdG9ycyA9IGRpc3RyYWN0b3JzLmxlbmd0aDtcbiAgICAgICAgdmFyIG5Ub1JlbW92ZSA9IDA7XG4gICAgICAgIHRoaXMucGFpckRpc3RyYWN0b3JzID0gdHJ1ZTtcbiAgICAgICAgdmFyIGdpdmVJbmRlbnRhdGlvbiA9IGZhbHNlO1xuICAgICAgICBpZiAobGFzdGVzdEF0dGVtcHRDb3VudCA8IDIpIHtcbiAgICAgICAgICAgIC8vIDEgVHJ5XG4gICAgICAgICAgICB0aGlzLnBhaXJEaXN0cmFjdG9ycyA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5saW1pdERpc3RyYWN0b3JzID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSBpZiAobGFzdGVzdEF0dGVtcHRDb3VudCA8IDQpIHtcbiAgICAgICAgICAgIC8vIDItMyBUcmllc1xuICAgICAgICAgICAgLy8gRG8gbm90aGluZyB0aGV5IGFyZSBkb2luZyBub3JtYWxcbiAgICAgICAgICAgIHRoaXMucGFpckRpc3RyYWN0b3JzID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmIChsYXN0ZXN0QXR0ZW1wdENvdW50IDwgNikge1xuICAgICAgICAgICAgLy8gNC01IFRyaWVzXG4gICAgICAgICAgICAvLyBwYWlyIGRpc3RyYWN0b3JzXG4gICAgICAgICAgICB0aGlzLnBhaXJEaXN0cmFjdG9ycyA9IHRydWU7XG4gICAgICAgIH0gZWxzZSBpZiAobGFzdGVzdEF0dGVtcHRDb3VudCA8IDgpIHtcbiAgICAgICAgICAgIC8vIDYtNyBUcmllc1xuICAgICAgICAgICAgLy8gUmVtb3ZlIDUwJSBvZiBkaXN0cmFjdG9yc1xuICAgICAgICAgICAgblRvUmVtb3ZlID0gMC41ICogbkRpc3RyYWN0b3JzO1xuICAgICAgICAgICAgdGhpcy5wYWlyRGlzdHJhY3RvcnMgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gOCsgVHJpZXNcbiAgICAgICAgICAgIC8vIFJlbW92ZSBhbGwgb2YgZGlzdHJhY3RvcnNcbiAgICAgICAgICAgIG5Ub1JlbW92ZSA9IG5EaXN0cmFjdG9ycztcbiAgICAgICAgICAgIHRoaXMucGFpckRpc3RyYWN0b3JzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICAvKlxuICAgICAgICBlbHNlIGlmKGxhc3Rlc3RBdHRlbXB0Q291bnQgPCAxMikgeyAvLzEwLTExXG4gICAgICAgICAgICAvLyBSZW1vdmUgYWxsIGRpc3RyYWN0b3JzIGFuZCBnaXZlIGluZGVudGF0aW9uXG4gICAgICAgICAgICBuVG9SZW1vdmUgPSBuRGlzdHJhY3RvcnM7XG4gICAgICAgICAgICBnaXZlSW5kZW50YXRpb24gPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5wYWlyRGlzdHJhY3RvcnMgPSB0cnVlO1xuICAgICAgICB9IGVsc2UgaWYobGFzdGVzdEF0dGVtcHRDb3VudCA8IDE0KSB7IC8vIDEyLTEzIFRyaWVzXG4gICAgICAgICAgICAvLyBSZW1vdmUgYWxsIG9mIGRpc3RyYWN0b3JzXG4gICAgICAgICAgICAvLyBnaXZlIGluZGVudGF0aW9uXG4gICAgICAgICAgICAvLyByZWR1Y2UgcHJvYmxlbSB0byAzLzQgc2l6ZVxuICAgICAgICAgICAgZ2l2ZUluZGVudGF0aW9uID0gdHJ1ZTtcbiAgICAgICAgICAgIG5Ub1JlbW92ZSA9IG5EaXN0cmFjdG9ycztcbiAgICAgICAgICAgIG5CbG9ja3NUb0NvbWJpbmUgPSAuMjUgKiBuQmxvY2tzO1xuICAgICAgICAgICAgdGhpcy5wYWlyRGlzdHJhY3RvcnMgPSB0cnVlO1xuICAgICAgICB9IGVsc2UgeyAvLyA+PSAxNCBUcmllc1xuICAgICAgICAgICAgLy8gUmVtb3ZlIGFsbCBvZiBkaXN0cmFjdG9yc1xuICAgICAgICAgICAgLy8gZ2l2ZSBpbmRlbnRhdGlvblxuICAgICAgICAgICAgLy8gcmVkdWNlIHByb2JsZW0gdG8gMS8yIHNpemVcbiAgICAgICAgICAgIGdpdmVJbmRlbnRhdGlvbiA9IHRydWU7XG4gICAgICAgICAgICBuVG9SZW1vdmUgPSBuRGlzdHJhY3RvcnM7XG4gICAgICAgICAgICBuQmxvY2tzVG9Db21iaW5lID0gLjUgKiBuQmxvY2tzO1xuICAgICAgICAgICAgdGhpcy5wYWlyRGlzdHJhY3RvcnMgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgICovXG4gICAgICAgIG5CbG9ja3NUb0NvbWJpbmUgPSBNYXRoLm1pbihuQmxvY2tzVG9Db21iaW5lLCBuQmxvY2tzIC0gMyk7XG4gICAgICAgIC8vIE5ldmVyIGNvbWJpbmUgc28gd2hlcmUgdGhlcmUgYXJlIGxlc3MgdGhhbiB0aHJlZSBibG9ja3MgbGVmdFxuICAgICAgICAvLyBSZW1vdmUgZGlzdHJhY3RvcnNcbiAgICAgICAgZGlzdHJhY3RvcnMgPSB0aGlzLnNodWZmbGVkKGRpc3RyYWN0b3JzKTtcbiAgICAgICAgZGlzdHJhY3RvcnMgPSBkaXN0cmFjdG9ycy5zbGljZSgwLCBuVG9SZW1vdmUpO1xuICAgICAgICB2YXIgb3V0cHV0ID0gW107XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBpbnB1dC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYmxvY2sgPSBpbnB1dFtpXTtcbiAgICAgICAgICAgIGlmICghYmxvY2suaXNEaXN0cmFjdG9yKCkpIHtcbiAgICAgICAgICAgICAgICBvdXRwdXQucHVzaChibG9jayk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGRpc3RyYWN0b3JzLmluZGV4T2YoYmxvY2spID09IC0xKSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0LnB1c2goYmxvY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vdmFyIG91dHB1dCA9IGlucHV0O1xuICAgICAgICBpZiAoZ2l2ZUluZGVudGF0aW9uKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG91dHB1dC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIG91dHB1dFtpXS5hZGRJbmRlbnQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuaW5kZW50ID0gMDtcbiAgICAgICAgICAgIHRoaXMubm9pbmRlbnQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIC8vIGNvbWJpbmUgYmxvY2tzXG4gICAgICAgIHZhciBzb2x1dGlvbiA9IFtdO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5saW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBvdXRwdXQubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICBpZiAob3V0cHV0W2pdLmxpbmVzWzBdLmluZGV4ID09IGkpIHtcbiAgICAgICAgICAgICAgICAgICAgc29sdXRpb24ucHVzaChvdXRwdXRbal0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5CbG9ja3NUb0NvbWJpbmU7IGkrKykge1xuICAgICAgICAgICAgLy8gY29tYmluZSBvbmUgc2V0IG9mIGJsb2Nrc1xuICAgICAgICAgICAgdmFyIGJlc3QgPSAtMTA7XG4gICAgICAgICAgICB2YXIgY29tYmluZUluZGV4ID0gLTEwO1xuICAgICAgICAgICAgZm9yIChqID0gMDsgaiA8IHNvbHV0aW9uLmxlbmd0aCAtIDE7IGorKykge1xuICAgICAgICAgICAgICAgIGJsb2NrID0gc29sdXRpb25bal07XG4gICAgICAgICAgICAgICAgdmFyIG5leHQgPSBzb2x1dGlvbltqICsgMV07XG4gICAgICAgICAgICAgICAgdmFyIHJhdGluZyA9IDEwIC0gYmxvY2subGluZXMubGVuZ3RoIC0gbmV4dC5saW5lcy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgdmFyIGJsb2NrSW5kZW50ID0gYmxvY2subWluaW11bUxpbmVJbmRlbnQoKTtcbiAgICAgICAgICAgICAgICB2YXIgbmV4dEluZGVudCA9IG5leHQubWluaW11bUxpbmVJbmRlbnQoKTtcbiAgICAgICAgICAgICAgICBpZiAoYmxvY2tJbmRlbnQgPT0gbmV4dEluZGVudCkge1xuICAgICAgICAgICAgICAgICAgICByYXRpbmcgKz0gMjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGJsb2NrSW5kZW50ID4gbmV4dEluZGVudCkge1xuICAgICAgICAgICAgICAgICAgICByYXRpbmcgLT0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICBibG9jay5saW5lc1tibG9jay5saW5lcy5sZW5ndGggLSAxXS5pbmRlbnQgPT1cbiAgICAgICAgICAgICAgICAgICAgbmV4dC5saW5lc1swXS5pbmRlbnRcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgcmF0aW5nICs9IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChyYXRpbmcgPj0gYmVzdCkge1xuICAgICAgICAgICAgICAgICAgICBiZXN0ID0gcmF0aW5nO1xuICAgICAgICAgICAgICAgICAgICBjb21iaW5lSW5kZXggPSBqO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJsb2NrID0gc29sdXRpb25bY29tYmluZUluZGV4XTtcbiAgICAgICAgICAgIG5leHQgPSBzb2x1dGlvbltjb21iaW5lSW5kZXggKyAxXTtcbiAgICAgICAgICAgIGZvciAoaiA9IDA7IGogPCBuZXh0LmxpbmVzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgYmxvY2suYWRkTGluZShuZXh0LmxpbmVzW2pdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBuZXdTb2x1dGlvbiA9IFtdO1xuICAgICAgICAgICAgZm9yIChqID0gMDsgaiA8IHNvbHV0aW9uLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGogIT09IGNvbWJpbmVJbmRleCArIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3U29sdXRpb24ucHVzaChzb2x1dGlvbltqXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHNvbHV0aW9uID0gbmV3U29sdXRpb247XG4gICAgICAgIH1cbiAgICAgICAgLy8gcmVvcmRlclxuICAgICAgICB2YXIgY29tYmluZWRPdXRwdXQgPSBbXTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IG91dHB1dC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgZm9yIChqID0gMDsgaiA8IHNvbHV0aW9uLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgaWYgKG91dHB1dFtpXS5saW5lc1swXS5pbmRleCA9PSBzb2x1dGlvbltqXS5saW5lc1swXS5pbmRleCkge1xuICAgICAgICAgICAgICAgICAgICBjb21iaW5lZE91dHB1dC5wdXNoKHNvbHV0aW9uW2pdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvbWJpbmVkT3V0cHV0O1xuICAgIH1cbiAgICAvLyBSZXR1cm4gYW4gYXJyYXkgb2YgY29kZSBibG9ja3MgYmFzZWQgb24gd2hhdCBpcyBzcGVjaWZpZWQgaW4gdGhlIHByb2JsZW1cbiAgICBibG9ja3NGcm9tU291cmNlKCkge1xuICAgICAgICB2YXIgdW5vcmRlcmVkQmxvY2tzID0gW107XG4gICAgICAgIHZhciBvcmlnaW5hbEJsb2NrcyA9IFtdO1xuICAgICAgICB2YXIgYmxvY2tzID0gW107XG4gICAgICAgIHZhciBsaW5lcyA9IFtdO1xuICAgICAgICB2YXIgYmxvY2ssIGxpbmUsIGk7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLmxpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsaW5lID0gdGhpcy5saW5lc1tpXTtcbiAgICAgICAgICAgIC8vIENvZGVUYWlsb3I6IGRvIG5vdCBpbmNsdWRlIHBsYWNlIGhvbGRlciBvciBzZXR0bGVkIHNvbHV0aW9uIGxpbmVzIGluIHNvdXJjZSBibG9ja3NcbiAgICAgICAgICAgIGlmIChsaW5lLmlzUGxhY2Vob2xkZXJMaW5lIHx8IGxpbmUuaXNTZXR0bGVkKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsaW5lcy5wdXNoKGxpbmUpO1xuICAgICAgICAgICAgaWYgKCFsaW5lLmdyb3VwV2l0aE5leHQpIHtcbiAgICAgICAgICAgICAgICB1bm9yZGVyZWRCbG9ja3MucHVzaChuZXcgUGFyc29uc0Jsb2NrKHRoaXMsIGxpbmVzKSk7XG4gICAgICAgICAgICAgICAgbGluZXMgPSBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBvcmlnaW5hbEJsb2NrcyA9IHVub3JkZXJlZEJsb2NrcztcbiAgICAgICAgLy8gVHJpbSB0aGUgZGlzdHJhY3RvcnNcbiAgICAgICAgdmFyIHJlbW92ZWRCbG9ja3MgPSBbXTtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5tYXhkaXN0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHZhciBtYXhkaXN0ID0gdGhpcy5vcHRpb25zLm1heGRpc3Q7XG4gICAgICAgICAgICB2YXIgZGlzdHJhY3RvcnMgPSBbXTtcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCB1bm9yZGVyZWRCbG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBibG9jayA9IHVub3JkZXJlZEJsb2Nrc1tpXTtcbiAgICAgICAgICAgICAgICBpZiAoYmxvY2subGluZXNbMF0uZGlzdHJhY3Rvcikge1xuICAgICAgICAgICAgICAgICAgICBkaXN0cmFjdG9ycy5wdXNoKGJsb2NrKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobWF4ZGlzdCA8IGRpc3RyYWN0b3JzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGRpc3RyYWN0b3JzID0gdGhpcy5zaHVmZmxlZChkaXN0cmFjdG9ycyk7XG4gICAgICAgICAgICAgICAgZGlzdHJhY3RvcnMgPSBkaXN0cmFjdG9ycy5zbGljZSgwLCBtYXhkaXN0KTtcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdW5vcmRlcmVkQmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGJsb2NrID0gdW5vcmRlcmVkQmxvY2tzW2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYmxvY2subGluZXNbMF0uZGlzdHJhY3Rvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRpc3RyYWN0b3JzLmluZGV4T2YoYmxvY2spID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBibG9ja3MucHVzaChibG9jayk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbW92ZWRCbG9ja3MucHVzaChpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsb2Nrcy5wdXNoKGJsb2NrKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB1bm9yZGVyZWRCbG9ja3MgPSBibG9ja3M7XG4gICAgICAgICAgICAgICAgYmxvY2tzID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUaGlzIGlzIG5lY2Vzc2FyeSwgc2V0IHRoZSBwYWlyRGlzdHJhY3RvcnMgdmFsdWUgYmVmb3JlIGJsb2NrcyBnZXQgc2h1ZmZsZWQgLSBXaWxsaWFtIExpIChBdWd1c3QgMjAyMClcbiAgICAgICAgaWYgKHRoaXMucmVjZW50QXR0ZW1wdHMgPCAyKSB7XG4gICAgICAgICAgICAvLyAxIFRyeVxuICAgICAgICAgICAgdGhpcy5wYWlyRGlzdHJhY3RvcnMgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucGFpckRpc3RyYWN0b3JzID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMub3JkZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgLy8gU2h1ZmZsZSwgcmVzcGVjdGluZyBwYWlyZWQgZGlzdHJhY3RvcnNcbiAgICAgICAgICAgIHZhciBjaHVua3MgPSBbXSxcbiAgICAgICAgICAgICAgICBjaHVuayA9IFtdO1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHVub3JkZXJlZEJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGJsb2NrID0gdW5vcmRlcmVkQmxvY2tzW2ldO1xuICAgICAgICAgICAgICAgIGlmIChibG9jay5saW5lc1swXS5wYWlyZWQgJiYgdGhpcy5wYWlyRGlzdHJhY3RvcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gV2lsbGlhbSBMaSAoQXVndXN0IDIwMjApXG4gICAgICAgICAgICAgICAgICAgIGNodW5rLnB1c2goYmxvY2spO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNodW5rID0gW107XG4gICAgICAgICAgICAgICAgICAgIGNodW5rLnB1c2goYmxvY2spO1xuICAgICAgICAgICAgICAgICAgICBjaHVua3MucHVzaChjaHVuayk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2h1bmtzID0gdGhpcy5zaHVmZmxlZChjaHVua3MpO1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGNodW5rcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGNodW5rID0gY2h1bmtzW2ldO1xuICAgICAgICAgICAgICAgIGlmIChjaHVuay5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHNodWZmbGUgcGFpcmVkIGRpc3RyYWN0b3JzXG4gICAgICAgICAgICAgICAgICAgIGNodW5rID0gdGhpcy5zaHVmZmxlZChjaHVuayk7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoaiA9IDA7IGogPCBjaHVuay5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2tzLnB1c2goY2h1bmtbal0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYmxvY2tzLnB1c2goY2h1bmtbMF0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIE9yZGVyIGFjY29yZGluZyB0byBvcmRlciBzcGVjaWZpZWRcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLm9wdGlvbnMub3JkZXIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBibG9jayA9IG9yaWdpbmFsQmxvY2tzW3RoaXMub3B0aW9ucy5vcmRlcltpXV07XG4gICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICBibG9jayAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgICAgICAgICAgICAgIHJlbW92ZWRCbG9ja3MuaW5kZXhPZih0aGlzLm9wdGlvbnMub3JkZXJbaV0pIDwgMFxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICBibG9ja3MucHVzaChibG9jayk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMucGFpckRpc3RyYWN0b3JzID0gdHJ1ZTtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5hZGFwdGl2ZSkge1xuICAgICAgICAgICAgdGhpcy5saW1pdERpc3RyYWN0b3JzID0gdHJ1ZTtcbiAgICAgICAgICAgIGJsb2NrcyA9IHRoaXMuYWRhcHRCbG9ja3MoYmxvY2tzKTtcbiAgICAgICAgICAgIGlmICghdGhpcy5saW1pdERpc3RyYWN0b3JzKSB7XG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHJlbW92ZWRCbG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGluZGV4ID1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5vcmRlciA9PSB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IE1hdGgucmFuZG9tKDAsIGJsb2Nrcy5sZW5ndGgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiB0aGlzLm9wdGlvbnMub3JkZXIuaW5kZXhPZihyZW1vdmVkQmxvY2tzW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgYmxvY2tzLnNwbGljZShpbmRleCwgMCwgb3JpZ2luYWxCbG9ja3NbcmVtb3ZlZEJsb2Nrc1tpXV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5wYWlyRGlzdHJhY3RvcnMgJiYgdGhpcy5vcHRpb25zLm9yZGVyICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgLy9tb3ZlIHBhaXJzIHRvZ2V0aGVyXG4gICAgICAgICAgICAvL0dvIHRocm91Z2ggYXJyYXkgbG9va2luZyBmb3IgZGl0cmFjdG9yIGFuZCBpdHMgcGFpclxuICAgICAgICAgICAgZm9yIChpID0gMTsgaSA8IG9yaWdpbmFsQmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbEJsb2Nrc1tpXS5saW5lc1swXS5wYWlyZWQgJiZcbiAgICAgICAgICAgICAgICAgICAgYmxvY2tzLmluZGV4T2Yob3JpZ2luYWxCbG9ja3NbaV0pID49IDBcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGogPSBpO1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoYmxvY2tzLmluZGV4T2Yob3JpZ2luYWxCbG9ja3NbaiAtIDFdKSA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZpbmQgdGhlIHBhaXJlZCBkaXN0cmFjdG9yIG9yIHNvbHV0aW9uIGJsb2NrIGl0IHdpbGwgYmUgbmV4dCB0b1xuICAgICAgICAgICAgICAgICAgICAgICAgai0tO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHZhciBpbmRleFRvID0gYmxvY2tzLmluZGV4T2Yob3JpZ2luYWxCbG9ja3NbaiAtIDFdKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGluZGV4RnJvbSA9IGJsb2Nrcy5pbmRleE9mKG9yaWdpbmFsQmxvY2tzW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgYmxvY2tzLnNwbGljZShpbmRleEZyb20sIDEpO1xuICAgICAgICAgICAgICAgICAgICBibG9ja3Muc3BsaWNlKGluZGV4VG8sIDAsIG9yaWdpbmFsQmxvY2tzW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGJsb2NrcztcbiAgICB9XG4gICAgLy8gUmV0dXJuIGEgY29kZWJsb2NrIHRoYXQgY29ycmVzcG9uZHMgdG8gdGhlIGhhc2hcbiAgICBibG9ja0Zyb21IYXNoKGhhc2gpIHtcbiAgICAgICAgdmFyIHNwbGl0ID0gaGFzaC5zcGxpdChcIl9cIik7XG4gICAgICAgIHZhciBsaW5lcyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNwbGl0Lmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgICAgICAgbGluZXMucHVzaCh0aGlzLmxpbmVzW3NwbGl0W2ldXSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGJsb2NrID0gbmV3IFBhcnNvbnNCbG9jayh0aGlzLCBsaW5lcyk7XG4gICAgICAgIGlmICh0aGlzLm5vaW5kZW50KSB7XG4gICAgICAgICAgICBibG9jay5pbmRlbnQgPSAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYmxvY2suaW5kZW50ID0gTnVtYmVyKHNwbGl0W3NwbGl0Lmxlbmd0aCAtIDFdKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYmxvY2s7XG4gICAgfVxuICAgIC8vIFJldHVybiBhbiBhcnJheSBvZiBjb2RlYmxvY2tzIHRoYXQgY29ycmVzcG9uZHMgdG8gdGhlIGhhc2hcbiAgICBibG9ja3NGcm9tSGFzaChoYXNoKSB7XG4gICAgICAgIHZhciBzcGxpdDtcbiAgICAgICAgaWYgKGhhc2ggPT09IFwiLVwiIHx8IGhhc2ggPT09IFwiXCIgfHwgaGFzaCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgc3BsaXQgPSBbXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNwbGl0ID0gaGFzaC5zcGxpdChcIi1cIik7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGJsb2NrcyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNwbGl0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBibG9ja3MucHVzaCh0aGlzLmJsb2NrRnJvbUhhc2goc3BsaXRbaV0pKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmFkYXB0aXZlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5hZGFwdEJsb2NrcyhibG9ja3MpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGJsb2NrcztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIENvZGVUYWlsb3I6IFJldHVybiBhIGxpc3Qgb2YgYmxvY2tzIHdpdGggcGxhY2Vob2xkZXJzIHRoYXQgc2hvdWxkIGJlIHByb3ZpZGVkIGluIHRoZSBhbnN3ZXIgYXJlYS5cbiAgICBzZXR0bGVkQmxvY2tzRnJvbVNvdXJjZSgpIHtcbiAgICAgICAgdmFyIGJsb2NrcyA9IFtdO1xuICAgICAgICB2YXIgbGluZXMgPSBbXTtcbiAgICAgICAgdmFyIGFuc3dlckJsb2Nrc0NvdW50ID0gMDtcbiAgICAgICAgdmFyIGxpbmUsIGk7XG4gICAgICAgIHZhciBzZXR0bGVkQmxvY2tzQmVmb3JlQ291bnQgPSAwO1xuICAgICAgICB2YXIgcHJldlNldHRsZWRCbG9jayA9IHVuZGVmaW5lZDtcbiAgICAgICAgdmFyIHByZXZQbGFjZWhvbGRlclNpemUgPSAwO1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLmxpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsaW5lID0gdGhpcy5saW5lc1tpXTtcbiAgICAgICAgICAgIGxpbmVzLnB1c2gobGluZSk7XG4gICAgICAgICAgICBpZiAoIWxpbmUuZ3JvdXBXaXRoTmV4dCkge1xuICAgICAgICAgICAgICAgIGlmIChsaW5lLmlzUGxhY2Vob2xkZXJMaW5lKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGZvdW5kIGEgcGxhY2Vob2xkZXIgbGluZS4gYSBwbGFjZWhvbGRlciBsaW5lIGhhcyBhdCBsZWFzdCBvbmUgbm9ybWFsIGJsb2NrIGJlZm9yZSBpdC5cbiAgICAgICAgICAgICAgICAgICAgLy8gYWxzbyBhIHBsYWNlaG9sZGVyIGxpbmUgYWx3YXlzIGhhcyBcImdyb3VwV2l0aE5leHRcIiBmYWxzZS5cbiAgICAgICAgICAgICAgICAgICAgYmxvY2tzLnB1c2goXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgUGxhY2Vob2xkZXJCbG9jayhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuc3dlckJsb2Nrc0NvdW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldHRsZWRCbG9ja3NCZWZvcmVDb3VudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIC8vIHVwZGF0ZSB0aGUgbnVtYmVyIG9mIGJsb2NrcyBtaXNzaW5nIGZvciB0aGUgc2V0dGxlZCBibG9jayBhYm92ZVxuICAgICAgICAgICAgICAgICAgICBpZiAocHJldlNldHRsZWRCbG9jaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJldlNldHRsZWRCbG9jay5zZXRCbG9ja3NBZnRlcihhbnN3ZXJCbG9ja3NDb3VudCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gc2F2ZSB0aGUgY3VycmVudCBudW1iZXIgb2YgYW5zd2VyIGJsb2NrcyB0byB1cGRhdGUgdGhlIHRvb2x0aXAgZm9yIHRoZSBzZXR0bGVkIGJsb2NrIGJlbG93XG4gICAgICAgICAgICAgICAgICAgIHByZXZQbGFjZWhvbGRlclNpemUgPSBhbnN3ZXJCbG9ja3NDb3VudDtcbiAgICAgICAgICAgICAgICAgICAgLy8gcmVzZXQgYW5zd2VyIGJsb2NrIGNvdW50XG4gICAgICAgICAgICAgICAgICAgIGFuc3dlckJsb2Nrc0NvdW50ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgbGluZXMgPSBbXTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGxpbmUuaXNTZXR0bGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChibG9ja3MubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmlyc3RCbG9ja1NldHRsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHZhciBzZXQgPSBuZXcgU2V0dGxlZEJsb2NrKHRoaXMsIGxpbmVzKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLm5vaW5kZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXQuaW5kZW50ID0gbGluZXNbMF0uaW5kZW50O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2V0dGxlZCBibG9jayBzZXRcIiwgc2V0KTtcbiAgICAgICAgICAgICAgICAgICAgYmxvY2tzLnB1c2goc2V0KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByZXZQbGFjZWhvbGRlclNpemUgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXQuc2V0QmxvY2tzQmVmb3JlKHByZXZQbGFjZWhvbGRlclNpemUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHByZXZTZXR0bGVkQmxvY2sgPSBzZXQ7XG4gICAgICAgICAgICAgICAgICAgIHNldHRsZWRCbG9ja3NCZWZvcmVDb3VudCsrO1xuICAgICAgICAgICAgICAgICAgICBhbnN3ZXJCbG9ja3NDb3VudCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGxpbmVzID0gW107XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFsaW5lc1swXS5kaXN0cmFjdG9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbnN3ZXJCbG9ja3NDb3VudCsrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGxpbmVzID0gW107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChibG9ja3MubGVuZ3RoID4gMCAmJiBibG9ja3NbYmxvY2tzLmxlbmd0aCAtIDFdLmlzU2V0dGxlZCkge1xuICAgICAgICAgICAgdGhpcy5sYXN0QmxvY2tTZXR0bGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyhcInNldHRsZWRibG9ja3Nmcm9tc291cmNlXCIsIGJsb2Nrcyk7XG4gICAgICAgIHJldHVybiBibG9ja3M7XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIGEgYmxvY2sgb2JqZWN0IGJ5IHRoZSBmdWxsIGlkIGluY2x1ZGluZyBpZCBwcmVmaXhcbiAgICBnZXRCbG9ja0J5SWQoaWQpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGJsb2NrID0gdGhpcy5ibG9ja3NbaV07XG4gICAgICAgICAgICBpZiAoYmxvY2sudmlldy5pZCA9PSBpZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBibG9jaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICAvLyBSZXR1cm4gYXJyYXkgb2YgY29kZWJsb2NrcyB0aGF0IGFyZSB0aGUgc29sdXRpb25cbiAgICBzb2x1dGlvbkJsb2NrcygpIHtcbiAgICAgICAgdmFyIHNvbHV0aW9uQmxvY2tzID0gW107XG4gICAgICAgIHZhciBzb2x1dGlvbkxpbmVzID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5saW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmxpbmVzW2ldLmRpc3RyYWN0b3IpIHtcbiAgICAgICAgICAgICAgICBzb2x1dGlvbkxpbmVzLnB1c2godGhpcy5saW5lc1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGJsb2NrID0gc29sdXRpb25MaW5lc1swXS5ibG9jaygpO1xuICAgICAgICBzb2x1dGlvbkJsb2Nrcy5wdXNoKGJsb2NrKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBzb2x1dGlvbkxpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgbmV4dEJsb2NrID0gc29sdXRpb25MaW5lc1tpXS5ibG9jaygpO1xuICAgICAgICAgICAgaWYgKGJsb2NrICE9PSBuZXh0QmxvY2spIHtcbiAgICAgICAgICAgICAgICBibG9jayA9IG5leHRCbG9jaztcbiAgICAgICAgICAgICAgICBzb2x1dGlvbkJsb2Nrcy5wdXNoKGJsb2NrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc29sdXRpb25CbG9ja3M7XG4gICAgfVxuICAgIC8vIFJldHVybiBhcnJheSBvZiBjb2RlYmxvY2tzIGJhc2VkIG9uIHdoYXQgaXMgaW4gdGhlIHNvdXJjZSBmaWVsZFxuICAgIHNvdXJjZUJsb2NrcygpIHtcbiAgICAgICAgdmFyIHNvdXJjZUJsb2NrcyA9IFtdO1xuICAgICAgICB2YXIgY2hpbGRyZW4gPSB0aGlzLnNvdXJjZUFyZWEuY2hpbGRyZW47XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBjaGlsZCA9IGNoaWxkcmVuW2ldO1xuICAgICAgICAgICAgaWYgKGNoaWxkLmNsYXNzTGlzdC5jb250YWlucyhcImJsb2NrXCIpKSB7XG4gICAgICAgICAgICAgICAgc291cmNlQmxvY2tzLnB1c2godGhpcy5nZXRCbG9ja0J5SWQoY2hpbGQuaWQpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc291cmNlQmxvY2tzO1xuICAgIH1cbiAgICAvLyBSZXR1cm4gYXJyYXkgb2YgZW5hYmxlZCBjb2RlYmxvY2tzIGJhc2VkIG9uIHdoYXQgaXMgaW4gdGhlIHNvdXJjZSBmaWVsZFxuICAgIGVuYWJsZWRTb3VyY2VCbG9ja3MoKSB7XG4gICAgICAgIHZhciBhbGwgPSB0aGlzLnNvdXJjZUJsb2NrcygpO1xuICAgICAgICB2YXIgZW5hYmxlZCA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFsbC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGJsb2NrID0gYWxsW2ldO1xuICAgICAgICAgICAgaWYgKGJsb2NrLmVuYWJsZWQoKSkge1xuICAgICAgICAgICAgICAgIGVuYWJsZWQucHVzaChibG9jayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVuYWJsZWQ7XG4gICAgfVxuICAgIC8vIFJldHVybiBhcnJheSBvZiBjb2RlYmxvY2tzIGJhc2VkIG9uIHdoYXQgaXMgaW4gdGhlIGFuc3dlciBmaWVsZFxuICAgIGFuc3dlckJsb2NrcygpIHtcbiAgICAgICAgdmFyIGFuc3dlckJsb2NrcyA9IFtdO1xuICAgICAgICB2YXIgY2hpbGRyZW4gPSB0aGlzLmFuc3dlckFyZWEuY2hpbGROb2RlcztcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGJsb2NrID0gdGhpcy5nZXRCbG9ja0J5SWQoY2hpbGRyZW5baV0uaWQpO1xuICAgICAgICAgICAgaWYgKGJsb2NrICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBhbnN3ZXJCbG9ja3MucHVzaChibG9jayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFuc3dlckJsb2NrcztcbiAgICB9XG4gICAgLy8gUmV0dXJuIGFycmF5IG9mIGVuYWJsZWQgY29kZWJsb2NrcyBiYXNlZCBvbiB3aGF0IGlzIGluIHRoZSBhbnN3ZXIgZmllbGRcbiAgICBlbmFibGVkQW5zd2VyQmxvY2tzKCkge1xuICAgICAgICB2YXIgYWxsID0gdGhpcy5hbnN3ZXJCbG9ja3MoKTtcbiAgICAgICAgdmFyIGVuYWJsZWQgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhbGwubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBibG9jayA9IGFsbFtpXTtcbiAgICAgICAgICAgIGlmIChibG9jay5lbmFibGVkKCkpIHtcbiAgICAgICAgICAgICAgICBlbmFibGVkLnB1c2goYmxvY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlbmFibGVkO1xuICAgIH1cbiAgICAvLyBSZXR1cm4gYXJyYXkgb2YgY29kZWxpbmVzIGJhc2VkIG9uIHdoYXQgaXMgaW4gdGhlIGFuc3dlciBmaWVsZFxuICAgIGFuc3dlckxpbmVzKCkge1xuICAgICAgICB2YXIgYW5zd2VyTGluZXMgPSBbXTtcbiAgICAgICAgdmFyIGJsb2NrcyA9IHRoaXMuYW5zd2VyQmxvY2tzKCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgYmxvY2sgPSBibG9ja3NbaV07XG4gICAgICAgICAgICBpZiAoIWJsb2NrLmlzUGxhY2Vob2xkZXIpIHtcbiAgICAgICAgICAgICAgICAvLyBDb2RlVGFpbG9yOiBhZGRpbmcgbm9uIHBsYWNlaG9sZGVyIGJsb2NrXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBibG9jay5saW5lcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICBhbnN3ZXJMaW5lcy5wdXNoKGJsb2NrLmxpbmVzW2pdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFuc3dlckxpbmVzO1xuICAgIH1cbiAgICAvLyBHbyB1cCB0aGUgaGllcmFyY2h5IHVudGlsIHlvdSBnZXQgdG8gYSBibG9jazsgcmV0dXJuIHRoYXQgYmxvY2sgZWxlbWVudFxuICAgIGdldEJsb2NrRm9yKGVsZW1lbnQpIHtcbiAgICAgICAgdmFyIGNoZWNrID0gZWxlbWVudDtcbiAgICAgICAgd2hpbGUgKCFjaGVjay5jbGFzc0xpc3QuY29udGFpbnMoXCJibG9ja1wiKSkge1xuICAgICAgICAgICAgY2hlY2sgPSBjaGVjay5wYXJlbnRFbGVtZW50O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjaGVjaztcbiAgICB9XG4gICAgLy8gUmV0dXJuIHRoZSBtYXhpbXVtIGluZGVudCBmb3IgdGhlIHNvbHV0aW9uXG4gICAgc29sdXRpb25JbmRlbnQoKSB7XG4gICAgICAgIHZhciBpbmRlbnQgPSAwO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgYmxvY2sgPSB0aGlzLmJsb2Nrc1tpXTtcbiAgICAgICAgICAgIGluZGVudCA9IE1hdGgubWF4KGluZGVudCwgYmxvY2suc29sdXRpb25JbmRlbnQoKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGluZGVudDtcbiAgICB9XG4gICAgLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT09PSBBQ1RJT04gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG4gICAgLy8gVGhlIFwiQ2hlY2sgTWVcIiBidXR0b24gd2FzIHByZXNzZWQuXG4gICAgY2hlY2tDdXJyZW50QW5zd2VyKCkge1xuICAgICAgICBpZiAoIXRoaXMuaGFzU29sdmVkKSB7XG4gICAgICAgICAgICB0aGlzLmNoZWNrQ291bnQrKztcbiAgICAgICAgICAgIHRoaXMuY2xlYXJGZWVkYmFjaygpO1xuICAgICAgICAgICAgaWYgKHRoaXMuYWRhcHRpdmVJZCA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFkYXB0aXZlSWQgPSB0aGlzLnN0b3JhZ2VJZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFRPRE8gLSByZW5kZXJpbmcgZmVlZGJhY2sgaXMgYnVyaWVkIGluIHRoZSBncmFkZXIuZ3JhZGUgbWV0aG9kLlxuICAgICAgICAgICAgLy8gdG8gZGlzYWJsZSBmZWVkYmFjayBzZXQgdGhpcy5ncmFkZXIuc2hvd2ZlZWRiYWNrIGJvb2xlYW5cbiAgICAgICAgICAgIHRoaXMuZ3JhZGVyLnNob3dmZWVkYmFjayA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5ncmFkZSA9IHRoaXMuZ3JhZGVyLmdyYWRlKCk7XG4gICAgICAgICAgICBpZiAodGhpcy5ncmFkZSA9PSBcImNvcnJlY3RcIikge1xuICAgICAgICAgICAgICAgIHRoaXMuaGFzU29sdmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLmNvcnJlY3QgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tCdXR0b24uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIC8vIENvZGVUYWlsb3I6IG1ha2UgdGhlIENvcHkgQW5zd2VyIGJ1dHRvbiB2aXNpYmxlIHdoZW4gdGhlIHB1enpsZSBpcyBzb2x2ZWRcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5oYXNTb2x2ZWQgJiYgdGhpcy5vcHRpb25zLnNjYWZmb2xkaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvcHlCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICAgICAgICAgICAgICAgICAgYCNjb3B5LWFuc3dlci1idXR0b24tJHt0aGlzLmRpdmlkfWAsXG4gICAgICAgICAgICAgICAgICAgICk7IC8vIGNvcHktYW5zd2VyLWJ1dHRvbi0ke3B1enpsZVNjYWZmb2xkaW5nRGl2aWR9XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb3B5QnRuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb3B5QnRuLmNsYXNzTGlzdC5yZW1vdmUoXCJjb3B5LWJ1dHRvbi1oaWRlXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMuYWRhcHRpdmVJZCArIFwiU29sdmVkXCIsIHRydWUpO1xuICAgICAgICAgICAgICAgIHRoaXMucmVjZW50QXR0ZW1wdHMgPSB0aGlzLmNoZWNrQ291bnQ7XG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRhcHRpdmVJZCArIFwicmVjZW50QXR0ZW1wdHNcIixcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWNlbnRBdHRlbXB0cyxcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXG4gICAgICAgICAgICAgICAgdGhpcy5hZGFwdGl2ZUlkICsgdGhpcy5kaXZpZCArIFwiQ291bnRcIixcbiAgICAgICAgICAgICAgICB0aGlzLmNoZWNrQ291bnQsXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgdGhpcy5zZXRMb2NhbFN0b3JhZ2UoKTtcbiAgICAgICAgICAgIC8vIGlmIG5vdCBzb2x2ZWQgYW5kIG5vdCB0b28gc2hvcnQgdGhlbiBjaGVjayBpZiBzaG91bGQgcHJvdmlkZSBoZWxwXG4gICAgICAgICAgICBpZiAoIXRoaXMuaGFzU29sdmVkICYmIHRoaXMuZ3JhZGUgIT09IFwiaW5jb3JyZWN0VG9vU2hvcnRcIikge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNhbkhlbHApIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gb25seSBjb3VudCB0aGUgYXR0ZW1wdCBpZiB0aGUgYW5zd2VyIGlzIGRpZmZlcmVudCAodG8gcHJldmVudCBnYW1pbmcpXG4gICAgICAgICAgICAgICAgICAgIHZhciBhbnN3ZXJIYXNoID0gdGhpcy5hbnN3ZXJIYXNoKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmxhc3RBbnN3ZXJIYXNoICE9PSBhbnN3ZXJIYXNoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm51bURpc3RpbmN0Kys7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxhc3RBbnN3ZXJIYXNoID0gYW5zd2VySGFzaDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBpZiB0aW1lIHRvIG9mZmVyIGhlbHBcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMubnVtRGlzdGluY3QgPT0gMyAmJiAhdGhpcy5nb3RIZWxwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBlbmRpbmdIZWxwTWVzc2FnZSA9IHQoXCJtc2dfcGFyc29uX2hlbHBfaW5mb1wiKTtcbiAgICAgICAgICAgICAgICAgICAgfSAvLyBlbmQgaWZcbiAgICAgICAgICAgICAgICB9IC8vIGVuZCBpZiBjYW4gaGVscFxuICAgICAgICAgICAgfSAvLyBlbmQgaWYgbm90IHNvbHZlZFxuICAgICAgICB9IC8vIGVuZCBvdXRlciBpZiBub3Qgc29sdmVkXG5cbiAgICAgICAgLy8gaWYgbm93IG9yIHByZXZpb3VzIHdhcyBjb3JyZWN0LCBkaXNwbGF5IHJ1bm5hYmxlXG4gICAgICAgIGlmICh0aGlzLmhhc1NvbHZlZCAmJiB0aGlzLm9wdGlvbnMucnVubmFibGUpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5ydW5uYWJsZURpdilcbiAgICAgICAgICAgICAgICB0aGlzLmdlbmVyYXRlUnVuYWJsZVZlcnNpb24oKTsgLy9yZXZlYWwgXCJyZXNldFwiIHJ1bm5hYmxlXG4gICAgICAgICAgICBlbHNlIHRoaXMucnVubmFibGVEaXYuc3R5bGUuZGlzcGxheSA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBDb252ZXIgdGhlIHBhcnNvbnMtcnVubmFibGUgaW50byBhbiBhY3RpdmVjb2RlIGFuZCBkaXNwbGF5IGl0XG4gICAgZ2VuZXJhdGVSdW5hYmxlVmVyc2lvbigpIHtcbiAgICAgICAgdGhpcy5ydW5uYWJsZURpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuZGl2aWQgKyBcIi1ydW5uYWJsZVwiKTtcbiAgICAgICAgdGhpcy5ydW5uYWJsZURpdi5zdHlsZS5kaXNwbGF5ID0gbnVsbDtcblxuICAgICAgICBsZXQgcGFyc29uc1RleHQgPSBcIlwiO1xuICAgICAgICBmb3IgKGxldCBiIG9mIHRoaXMuYW5zd2VyQmxvY2tzKCkpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGwgb2YgYi5saW5lcykge1xuICAgICAgICAgICAgICAgIHBhcnNvbnNUZXh0ICs9IFwiICAgIFwiLnJlcGVhdChsLmluZGVudCkgKyBsLnRleHQgKyBcIlxcblwiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHBhcnNvbnNUZXh0ID0gcGFyc29uc1RleHQuc2xpY2UoMCwgLTEpOyAvLyByZW1vdmUgbGFzdCBuZXdsaW5lXG5cbiAgICAgICAgY29uc3QgdGV4dEVsID0gdGhpcy5ydW5uYWJsZURpdi5xdWVyeVNlbGVjdG9yKFwidGV4dGFyZWFcIik7XG4gICAgICAgIHRleHRFbC5pbm5lckhUTUwgPSB0ZXh0RWwuaW5uZXJIVE1MLnJlcGxhY2UoXG4gICAgICAgICAgICBcIj09UEFSU09OU0NPREU9PVwiLFxuICAgICAgICAgICAgcGFyc29uc1RleHQsXG4gICAgICAgICk7XG5cbiAgICAgICAgLy8gZGF0YS1jb21wb25lbnQ9XCJwYXJzb25zLXJ1bm5hYmxlXCIgbWFya3MgaXQgYXMgd2FpdGluZyB0byBiZSB0dXJuZWQgaW50byBhbiBhY3RpdmVjb2RlXG4gICAgICAgIGNvbnN0IGFjdGl2ZUNvZGVUb0JlID0gdGhpcy5ydW5uYWJsZURpdi5xdWVyeVNlbGVjdG9yKFxuICAgICAgICAgICAgJ1tkYXRhLWNvbXBvbmVudD1cInBhcnNvbnMtcnVubmFibGVcIl0nLFxuICAgICAgICApO1xuICAgICAgICBhY3RpdmVDb2RlVG9CZS5kYXRhc2V0LmNvbXBvbmVudCA9IFwiYWN0aXZlY29kZVwiO1xuXG4gICAgICAgIHdpbmRvdy5ydW5lc3RvbmVDb21wb25lbnRzLnJlbmRlck9uZUNvbXBvbmVudCh0aGlzLnJ1bm5hYmxlRGl2KTtcbiAgICB9XG5cbiAgICByZW5kZXJGZWVkYmFjaygpIHtcbiAgICAgICAgdGhpcy5ncmFkZXIuc2hvd2ZlZWRiYWNrID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5ncmFkZSA9IHRoaXMuZ3JhZGVyLmdyYWRlclN0YXRlO1xuICAgICAgICB2YXIgYW5zd2VyQXJlYSA9IHRoaXMuYW5zd2VyQXJlYTtcblxuICAgICAgICAvLyBXaGVuIGZlZWRiYWNrIGlzIHN1cHByZXNzZWQgdGhlIG1lc3NhZ2VzIGFyZSBzaW1wbHkgbm90IHdyaXR0ZW4uXG4gICAgICAgIHZhciBmZWVkYmFja0FyZWEgPSB0aGlzLnNob3dmZWVkYmFjayA9PT0gdHJ1ZSA/IHRoaXMubWVzc2FnZURpdiA6IG51bGw7XG4gICAgICAgIHZhciBzZXRGZWVkYmFjayA9IChjbGFzc05hbWUsIG1lc3NhZ2UpID0+IHtcbiAgICAgICAgICAgIGlmIChmZWVkYmFja0FyZWEpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBoZWxwTWVzc2FnZSA9IHRoaXMucGVuZGluZ0hlbHBNZXNzYWdlO1xuICAgICAgICAgICAgICAgIHRoaXMucGVuZGluZ0hlbHBNZXNzYWdlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIHRoaXMuc2hvd01lc3NhZ2UoXG4gICAgICAgICAgICAgICAgICAgIGhlbHBNZXNzYWdlID8gYCR7bWVzc2FnZX0gJHtoZWxwTWVzc2FnZX1gIDogbWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lLFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKHRoaXMuZ3JhZGUgPT09IFwiY29ycmVjdFwiKSB7XG4gICAgICAgICAgICBhbnN3ZXJBcmVhLmNsYXNzTGlzdC5hZGQoXCJjb3JyZWN0XCIpO1xuICAgICAgICAgICAgdGhpcy5tZXNzYWdlRGl2LnN0eWxlLnZpc2liaWxpdHkgPSBcInZpc2libGVcIjtcbiAgICAgICAgICAgIGxldCBtZXNzYWdlID1cbiAgICAgICAgICAgICAgICB0aGlzLmNoZWNrQ291bnQgPiAxXG4gICAgICAgICAgICAgICAgICAgID8gdChcIm1zZ19wYXJzb25fY29ycmVjdFwiLCB0aGlzLmNoZWNrQ291bnQpXG4gICAgICAgICAgICAgICAgICAgIDogdChcIm1zZ19wYXJzb25fY29ycmVjdF9maXJzdF90cnlcIik7XG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnJ1bm5hYmxlKVxuICAgICAgICAgICAgICAgIG1lc3NhZ2UgKz0gXCIgXCIgKyB0KFwibXNnX3BhcnNvbl9jb3JyZWN0X3J1bm5hYmxlXCIpO1xuICAgICAgICAgICAgc2V0RmVlZGJhY2soXCJhbGVydCBhbGVydC1pbmZvXCIsIG1lc3NhZ2UpO1xuICAgICAgICAgICAgLy8gU2hvdyBibG9jayBleHBsYW5hdGlvbnMgYWZ0ZXIgc29sdmluZ1xuICAgICAgICAgICAgdGhpcy5zaG93QmxvY2tFeHBsYW5hdGlvbnMoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmdyYWRlID09PSBcImluY29ycmVjdFRvb1Nob3J0XCIpIHtcbiAgICAgICAgICAgIC8vIHRvbyBsaXR0bGUgY29kZVxuICAgICAgICAgICAgYW5zd2VyQXJlYS5jbGFzc0xpc3QuYWRkKFwiaW5jb3JyZWN0XCIpO1xuICAgICAgICAgICAgdGhpcy5tZXNzYWdlRGl2LnN0eWxlLnZpc2liaWxpdHkgPSBcInZpc2libGVcIjtcbiAgICAgICAgICAgIHNldEZlZWRiYWNrKFwiYWxlcnQgYWxlcnQtZGFuZ2VyXCIsIHQoXCJtc2dfcGFyc29uX3Rvb19zaG9ydFwiKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5ncmFkZSA9PT0gXCJpbmNvcnJlY3RJbmRlbnRcIikge1xuICAgICAgICAgICAgdmFyIGluY29ycmVjdEJsb2NrcyA9IFtdO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmdyYWRlci5pbmRlbnRMZWZ0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgYmxvY2sgPSB0aGlzLmdyYWRlci5pbmRlbnRMZWZ0W2ldLmJsb2NrKCk7XG4gICAgICAgICAgICAgICAgaWYgKGluY29ycmVjdEJsb2Nrcy5pbmRleE9mKGJsb2NrKSA9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICBpbmNvcnJlY3RCbG9ja3MucHVzaChibG9jayk7XG4gICAgICAgICAgICAgICAgICAgIGJsb2NrLnZpZXcuY2xhc3NMaXN0LmFkZChcImluZGVudExlZnRcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmdyYWRlci5pbmRlbnRSaWdodC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGJsb2NrID0gdGhpcy5ncmFkZXIuaW5kZW50UmlnaHRbaV0uYmxvY2soKTtcbiAgICAgICAgICAgICAgICBpZiAoaW5jb3JyZWN0QmxvY2tzLmluZGV4T2YoYmxvY2spID09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIGluY29ycmVjdEJsb2Nrcy5wdXNoKGJsb2NrKTtcbiAgICAgICAgICAgICAgICAgICAgYmxvY2sudmlldy5jbGFzc0xpc3QuYWRkKFwiaW5kZW50UmlnaHRcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5tZXNzYWdlRGl2LnN0eWxlLnZpc2liaWxpdHkgPSBcInZpc2libGVcIjtcbiAgICAgICAgICAgIHNldEZlZWRiYWNrKFxuICAgICAgICAgICAgICAgIFwiYWxlcnQgYWxlcnQtZGFuZ2VyXCIsXG4gICAgICAgICAgICAgICAgaW5jb3JyZWN0QmxvY2tzLmxlbmd0aCA9PSAxXG4gICAgICAgICAgICAgICAgICAgID8gdChcIm1zZ19wYXJzb25fd3JvbmdfaW5kZW50XCIpXG4gICAgICAgICAgICAgICAgICAgIDogdChcIm1zZ19wYXJzb25fd3JvbmdfaW5kZW50c1wiKSxcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5ncmFkZSA9PT0gXCJpbmNvcnJlY3RNb3ZlQmxvY2tzXCIpIHtcbiAgICAgICAgICAgIHZhciBhbnN3ZXJCbG9ja3MgPSB0aGlzLmFuc3dlckJsb2NrcygpO1xuICAgICAgICAgICAgdmFyIGluU29sdXRpb24gPSBbXTtcbiAgICAgICAgICAgIHZhciBpblNvbHV0aW9uSW5kZXhlcyA9IFtdO1xuICAgICAgICAgICAgdmFyIG5vdEluU29sdXRpb24gPSBbXTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYW5zd2VyQmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGJsb2NrID0gYW5zd2VyQmxvY2tzW2ldO1xuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IHRoaXMuc29sdXRpb24uaW5kZXhPZihibG9jay5saW5lc1swXSk7XG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ID09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIG5vdEluU29sdXRpb24ucHVzaChibG9jayk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaW5Tb2x1dGlvbi5wdXNoKGJsb2NrKTtcbiAgICAgICAgICAgICAgICAgICAgaW5Tb2x1dGlvbkluZGV4ZXMucHVzaChpbmRleCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGxpc0luZGV4ZXMgPSB0aGlzLmdyYWRlci5pbnZlcnNlTElTSW5kaWNlcyhcbiAgICAgICAgICAgICAgICBpblNvbHV0aW9uSW5kZXhlcyxcbiAgICAgICAgICAgICAgICBpblNvbHV0aW9uLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGlzSW5kZXhlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIG5vdEluU29sdXRpb24ucHVzaChpblNvbHV0aW9uW2xpc0luZGV4ZXNbaV1dKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFuc3dlckFyZWEuY2xhc3NMaXN0LmFkZChcImluY29ycmVjdFwiKTtcbiAgICAgICAgICAgIHRoaXMubWVzc2FnZURpdi5zdHlsZS52aXNpYmlsaXR5ID0gXCJ2aXNpYmxlXCI7XG4gICAgICAgICAgICBpZiAodGhpcy5zaG93ZmVlZGJhY2sgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vdEluU29sdXRpb24ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgbm90SW5Tb2x1dGlvbltpXS52aWV3LmNsYXNzTGlzdC5hZGQoXCJpbmNvcnJlY3RQb3NpdGlvblwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZXRGZWVkYmFjayhcImFsZXJ0IGFsZXJ0LWRhbmdlclwiLCB0KFwibXNnX3BhcnNvbl93cm9uZ19vcmRlclwiKSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnVwZGF0ZUJsb2NrQXJpYUxhYmVscygpO1xuICAgIH1cblxuICAgIC8vIFNob3cgZXhwbGFuYXRpb25zIGZvciBibG9ja3MgYWZ0ZXIgdGhlIHN0dWRlbnQgc29sdmVzIHRoZSBleGVyY2lzZVxuICAgIC8vIFVzZXMgdGhlIHNhbWUgdG9vbHRpcCBtZWNoYW5pc20gYXMgZGlzdHJhY3RvciBoZWxwIHRleHQgKGhvdmVyIHRvIHNlZSlcbiAgICBzaG93QmxvY2tFeHBsYW5hdGlvbnMoKSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgICF0aGlzLmJsb2NrRXhwbGFuYXRpb25zIHx8XG4gICAgICAgICAgICBPYmplY3Qua2V5cyh0aGlzLmJsb2NrRXhwbGFuYXRpb25zKS5sZW5ndGggPT09IDBcbiAgICAgICAgKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5oaWRlQmxvY2tFeHBsYW5hdGlvbnMoKTsgLy8gY2xlYXIgYW55IHByZXZpb3VzXG4gICAgICAgIHZhciBhbnN3ZXJCbG9ja3MgPSB0aGlzLmFuc3dlckJsb2NrcygpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFuc3dlckJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGJsb2NrID0gYW5zd2VyQmxvY2tzW2ldO1xuICAgICAgICAgICAgdmFyIGJsb2NrSW5kZXggPSBibG9jay5saW5lc1swXS5pbmRleDtcbiAgICAgICAgICAgIC8vIFRoZSBleHBsYW5hdGlvbiBtYXAga2V5cyBhcmUgYmxvY2sgaW5kaWNlcyBhcyB0aGV5IGFwcGVhciBpbiB0aGUgb3JpZ2luYWwgc291cmNlXG4gICAgICAgICAgICAvLyBUcnkgbWF0Y2hpbmcgYnkgdGhlIGJsb2NrJ3MgZmlyc3QgbGluZSBpbmRleCBpbiB0aGUgb3JpZ2luYWwgb3JkZXJcbiAgICAgICAgICAgIHZhciBleHBsYW5hdGlvbiA9IHRoaXMuYmxvY2tFeHBsYW5hdGlvbnNbU3RyaW5nKGJsb2NrSW5kZXgpXTtcbiAgICAgICAgICAgIGlmICghZXhwbGFuYXRpb24pIHtcbiAgICAgICAgICAgICAgICAvLyBBbHNvIHRyeSBieSBwb3NpdGlvbiBpbiB0aGUgYW5zd2VyIGFyZWFcbiAgICAgICAgICAgICAgICBleHBsYW5hdGlvbiA9IHRoaXMuYmxvY2tFeHBsYW5hdGlvbnNbU3RyaW5nKGkpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChleHBsYW5hdGlvbikge1xuICAgICAgICAgICAgICAgIC8vIFVzZSB0aGUgc2FtZSB0b29sdGlwIGFwcHJvYWNoIGFzIGRpc3RyYWN0b3JzOlxuICAgICAgICAgICAgICAgIC8vIHNldCBkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIiBhbmQgdGl0bGUgYXR0cmlidXRlIGZvciBob3ZlciBkaXNwbGF5XG4gICAgICAgICAgICAgICAgYmxvY2sudmlldy5zZXRBdHRyaWJ1dGUoXCJkYXRhLXRvZ2dsZVwiLCBcInRvb2x0aXBcIik7XG4gICAgICAgICAgICAgICAgYmxvY2sudmlldy5zZXRBdHRyaWJ1dGUoXCJ0aXRsZVwiLCBleHBsYW5hdGlvbik7XG4gICAgICAgICAgICAgICAgYmxvY2sudmlldy5jbGFzc0xpc3QuYWRkKFwiaGFzLWV4cGxhbmF0aW9uXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmVtb3ZlIGFsbCBibG9jayBleHBsYW5hdGlvbnMgKHRvb2x0aXAgYXR0cmlidXRlcylcbiAgICBoaWRlQmxvY2tFeHBsYW5hdGlvbnMoKSB7XG4gICAgICAgIGZvciAoY29uc3QgdmlldyBvZiB0aGlzLmFuc3dlckFyZWEucXVlcnlTZWxlY3RvckFsbChcbiAgICAgICAgICAgIFwiLmhhcy1leHBsYW5hdGlvblwiLFxuICAgICAgICApKSB7XG4gICAgICAgICAgICB2aWV3LnJlbW92ZUF0dHJpYnV0ZShcImRhdGEtdG9nZ2xlXCIpO1xuICAgICAgICAgICAgdmlldy5yZW1vdmVBdHRyaWJ1dGUoXCJ0aXRsZVwiKTtcbiAgICAgICAgICAgIHZpZXcucmVtb3ZlQXR0cmlidXRlKFwiZGF0YS1vcmlnaW5hbC10aXRsZVwiKTtcbiAgICAgICAgICAgIHZpZXcuY2xhc3NMaXN0LnJlbW92ZShcImhhcy1leHBsYW5hdGlvblwiKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09PT0gQURBUFRJVkUgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuICAgIC8vIEluaXRpYWxpemUgdGhpcyBwcm9ibGVtIGFzIGFkYXB0aXZlXG4gICAgLy8gICAgaGVscENvdW50ID0gbnVtYmVyIG9mIGNoZWNrcyBiZWZvcmUgaGVscCBpcyBnaXZlbiAobmVnYXRpdmUpXG4gICAgLy8gICAgY2FuSGVscCA9IGJvb2xlYW4gYXMgdG8gd2hldGhlciBoZWxwIGNhbiBiZSBwcm92aWRlZFxuICAgIC8vICAgIGNoZWNrQ291bnQgPSBob3cgbWFueSB0aW1lcyBpdCBoYXMgYmVlbiBjaGVja2VkIGJlZm9yZSBjb3JyZWN0XG4gICAgLy8gICAgdXNlclJhdGluZyA9IDAuLjEwMCBob3cgZ29vZCB0aGUgcGVyc29uIGlzIGF0IHNvbHZpbmcgcHJvYmxlbXNcbiAgICBpbml0aWFsaXplQWRhcHRpdmUoKSB7XG4gICAgICAgIHRoaXMuYWRhcHRpdmVJZCA9IHN1cGVyLmxvY2FsU3RvcmFnZUtleSgpO1xuICAgICAgICB0aGlzLmNhbkhlbHAgPSB0cnVlO1xuICAgICAgICAvL3RoaXMuaGVscENvdW50ID0gLTM7IC8vIE51bWJlciBvZiBjaGVja3MgYmVmb3JlIGhlbHAgaXMgb2ZmZXJlZFxuICAgICAgICB0aGlzLmNoZWNrQ291bnQgPSAwO1xuICAgICAgICB0aGlzLm51bURpc3RpbmN0ID0gMDsgLy8gbnVtYmVyIG9mIGRpc3RpbmN0IHNvbHV0aW9uIGF0dGVtcHRzIChkaWZmZXJlbnQgZnJvbSBwcmV2aW91cylcbiAgICAgICAgdGhpcy5nb3RIZWxwID0gZmFsc2U7XG4gICAgICAgIC8vIEluaXRpYWxpemUgdGhlIHVzZXJSYXRpbmdcbiAgICAgICAgdmFyIHN0b3JhZ2VQcm9ibGVtID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5hZGFwdGl2ZUlkICsgXCJQcm9ibGVtXCIpO1xuICAgICAgICBpZiAoc3RvcmFnZVByb2JsZW0gPT0gdGhpcy5kaXZpZCkge1xuICAgICAgICAgICAgLy8gQWxyZWFkeSBpbiB0aGlzIHByb2JsZW1cbiAgICAgICAgICAgIHRoaXMuY2hlY2tDb3VudCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFxuICAgICAgICAgICAgICAgIHRoaXMuYWRhcHRpdmVJZCArIHRoaXMuZGl2aWQgKyBcIkNvdW50XCIsXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tDb3VudCA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNoZWNrQ291bnQgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGNvdW50ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXG4gICAgICAgICAgICB0aGlzLmFkYXB0aXZlSWQgKyB0aGlzLmRpdmlkICsgXCJDb3VudFwiLFxuICAgICAgICApO1xuICAgICAgICBpZiAoY291bnQgPT0gdW5kZWZpbmVkIHx8IGNvdW50ID09IFwiTmFOXCIpIHtcbiAgICAgICAgICAgIGNvdW50ID0gMDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNoZWNrQ291bnQgPSBjb3VudDtcbiAgICAgICAgdGhpcy5yZWNlbnRBdHRlbXB0cyA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFxuICAgICAgICAgICAgdGhpcy5hZGFwdGl2ZUlkICsgXCJyZWNlbnRBdHRlbXB0c1wiLFxuICAgICAgICApO1xuICAgICAgICBpZiAodGhpcy5yZWNlbnRBdHRlbXB0cyA9PSB1bmRlZmluZWQgfHwgdGhpcy5yZWNlbnRBdHRlbXB0cyA9PSBcIk5hTlwiKSB7XG4gICAgICAgICAgICB0aGlzLnJlY2VudEF0dGVtcHRzID0gMztcbiAgICAgICAgfVxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcbiAgICAgICAgICAgIHRoaXMuYWRhcHRpdmVJZCArIFwicmVjZW50QXR0ZW1wdHNcIixcbiAgICAgICAgICAgIHRoaXMucmVjZW50QXR0ZW1wdHMsXG4gICAgICAgICk7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMuYWRhcHRpdmVJZCArIFwiUHJvYmxlbVwiLCB0aGlzLmRpdmlkKTtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXG4gICAgICAgICAgICB0aGlzLmFkYXB0aXZlSWQgKyB0aGlzLmRpdmlkICsgXCJDb3VudFwiLFxuICAgICAgICAgICAgdGhpcy5jaGVja0NvdW50LFxuICAgICAgICApO1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0aGlzLmFkYXB0aXZlSWQgKyBcIlNvbHZlZFwiLCBmYWxzZSk7XG4gICAgfVxuICAgIC8vIFJldHVybiBhIGJvb2xlYW4gb2Ygd2hldGhlciB0aGUgdXNlciBtdXN0IGRlYWwgd2l0aCBpbmRlbnRhdGlvblxuICAgIHVzZXNJbmRlbnRhdGlvbigpIHtcbiAgICAgICAgaWYgKHRoaXMubm9pbmRlbnQgfHwgdGhpcy5zb2x1dGlvbkluZGVudCgpID09IDApIHtcbiAgICAgICAgICAgIC8vIHdhcyAkKHRoaXMuYW5zd2VyQXJlYSkuaGFzQ2xhc3MoXCJhbnN3ZXJcIikgLSBiamUgY2hhbmdlZFxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gRmluZCBhIGRpc3RyYWN0b3IgdG8gcmVtb3ZlIHRvIG1ha2UgdGhlIHByb2JsZW0gZWFzaWVyXG4gICAgLy8gICogdHJ5IGZpcnN0IGluIHRoZSBhbnN3ZXIgYXJlYVxuICAgIC8vICAqIGlmIG5vdCwgdHJ5IHRoZSBzb3VyY2UgYXJlYVxuICAgIC8vICAqIGlmIG5vdCwgcmV0dXJuIHVuZGVmaW5lZFxuICAgIGRpc3RyYWN0b3JUb1JlbW92ZSgpIHtcbiAgICAgICAgdmFyIGJsb2NrcyA9IHRoaXMuZW5hYmxlZEFuc3dlckJsb2NrcygpO1xuICAgICAgICB2YXIgYmxvY2s7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBibG9jayA9IGJsb2Nrc1tpXTtcbiAgICAgICAgICAgIGlmIChibG9jay5pc0Rpc3RyYWN0b3IoKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBibG9jaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBibG9ja3MgPSB0aGlzLmVuYWJsZWRTb3VyY2VCbG9ja3MoKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBibG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGJsb2NrID0gYmxvY2tzW2ldO1xuICAgICAgICAgICAgaWYgKGJsb2NrLmlzRGlzdHJhY3RvcigpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGJsb2NrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIC8vIFJldHVybiB0aGUgbnVtYmVyIG9mIGJsb2NrcyB0aGF0IGV4aXN0XG4gICAgbnVtYmVyT2ZCbG9ja3MoZkluY2x1ZGVEaXN0cmFjdG9ycyA9IHRydWUpIHtcbiAgICAgICAgdmFyIG51bWJlck9mQmxvY2tzID0gMDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIHRoaXMuYmxvY2tzW2ldLmVuYWJsZWQoKSAmJlxuICAgICAgICAgICAgICAgIChmSW5jbHVkZURpc3RyYWN0b3JzIHx8ICF0aGlzLmJsb2Nrc1tpXS5pc0Rpc3RyYWN0b3IoKSlcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIG51bWJlck9mQmxvY2tzICs9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bWJlck9mQmxvY2tzO1xuICAgIH1cbiAgICAvLyBSZW1vdmUgdGhpcyBkaXN0cmFjdG9ycyB0byBtYWtlIHRoZSBwcm9ibGVtIGVhc2llclxuICAgIHJlbW92ZURpc3RyYWN0b3IoYmxvY2spIHtcbiAgICAgICAgdGhpcy5zaG93TWVzc2FnZSh0KFwibXNnX3BhcnNvbl9ub3Rfc29sdXRpb25cIikpO1xuICAgICAgICAvLyBTdG9wIGFiaWxpdHkgdG8gc2VsZWN0XG4gICAgICAgIGlmIChibG9jay5saW5lc1swXS5kaXN0cmFjdEhlbHB0ZXh0KSB7XG4gICAgICAgICAgICBibG9jay52aWV3LnNldEF0dHJpYnV0ZShcImRhdGEtdG9nZ2xlXCIsIFwidG9vbHRpcFwiKTtcbiAgICAgICAgICAgIGJsb2NrLnZpZXcuc2V0QXR0cmlidXRlKFwidGl0bGVcIiwgYmxvY2subGluZXNbMF0uZGlzdHJhY3RIZWxwdGV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgYmxvY2suZGlzYWJsZSgpO1xuICAgICAgICAvLyBJZiBpbiBhbnN3ZXIgYXJlYSwgbW92ZSB0byBzb3VyY2UgYXJlYVxuICAgICAgICBpZiAoIWJsb2NrLmluU291cmNlQXJlYSgpKSB7XG4gICAgICAgICAgICB2YXIgc291cmNlUmVjdCA9IHRoaXMuc291cmNlQXJlYS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgIHZhciBzdGFydFggPSBibG9jay5wYWdlWENlbnRlcigpIC0gMTtcbiAgICAgICAgICAgIHZhciBzdGFydFkgPSBibG9jay5wYWdlWUNlbnRlcigpO1xuICAgICAgICAgICAgdmFyIGVuZFggPVxuICAgICAgICAgICAgICAgIHNvdXJjZVJlY3QubGVmdCArIHdpbmRvdy5wYWdlWE9mZnNldCArIHNvdXJjZVJlY3Qud2lkdGggLyAyO1xuICAgICAgICAgICAgdmFyIGVuZFkgPVxuICAgICAgICAgICAgICAgIHNvdXJjZVJlY3QudG9wICtcbiAgICAgICAgICAgICAgICB3aW5kb3cucGFnZVlPZmZzZXQgK1xuICAgICAgICAgICAgICAgIGJsb2NrLnZpZXcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0IC8gMjtcbiAgICAgICAgICAgIHZhciBzbGlkZVVuZGVyQmxvY2sgPSBibG9jay5zbGlkZVVuZGVyQmxvY2soKTtcbiAgICAgICAgICAgIGlmIChzbGlkZVVuZGVyQmxvY2sgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGVuZFkgKz1cbiAgICAgICAgICAgICAgICAgICAgc2xpZGVVbmRlckJsb2NrLnZpZXcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0ICsgMjA7XG4gICAgICAgICAgICAgICAgZW5kWSArPVxuICAgICAgICAgICAgICAgICAgICBwYXJzZUludChnZXRDb21wdXRlZFN0eWxlKHNsaWRlVW5kZXJCbG9jay52aWV3KS50b3ApIHx8IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICAgICAgICBibG9jay52aWV3LnN0eWxlLmJvcmRlckNvbG9yID0gXCJ2YXIoLS1ib3hCb3JkZXJDb2xvciwgIzAwMClcIjtcbiAgICAgICAgICAgIGJsb2NrLnZpZXcuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJ2YXIoLS1iYWNrZ3JvdW5kLCAjZmZmKVwiO1xuICAgICAgICAgICAgYW5pbWF0ZShcbiAgICAgICAgICAgICAgICBibG9jay52aWV3LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogMS4wLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjpcbiAgICAgICAgICAgICAgICAgICAgICAgIE1hdGguc3FydChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBNYXRoLnBvdyhlbmRZIC0gc3RhcnRZLCAyKSArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1hdGgucG93KGVuZFggLSBzdGFydFgsIDIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgKSAqXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgNCArXG4gICAgICAgICAgICAgICAgICAgICAgICA1MDAsXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0Lm1vdmluZyA9IGJsb2NrO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5tb3ZpbmdYID0gc3RhcnRYO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5tb3ZpbmdZID0gc3RhcnRZO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC51cGRhdGVWaWV3KCk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHByb2dyZXNzOiBmdW5jdGlvbiAoYSwgcCwgYykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5tb3ZpbmdYID0gc3RhcnRYICogKDEgLSBwKSArIGVuZFggKiBwO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5tb3ZpbmdZID0gc3RhcnRZICogKDEgLSBwKSArIGVuZFkgKiBwO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC51cGRhdGVWaWV3KCk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgdGhhdC5tb3Zpbmc7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgdGhhdC5tb3ZpbmdYO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHRoYXQubW92aW5nWTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQudXBkYXRlVmlldygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0ZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBibG9jay52aWV3LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogMC4zLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImJvcmRlci1jb2xvclwiOiBcIiNkM2QzZDNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJiYWNrZ3JvdW5kLWNvbG9yXCI6IFwiI2VmZWZlZlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogMTAwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrLnZpZXcuc3R5bGUub3BhY2l0eSA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBibG9jay52aWV3LnN0eWxlLmJvcmRlckNvbG9yID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrLnZpZXcuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrLnZpZXcuY2xhc3NMaXN0LmFkZChcImRpc2FibGVkXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYmxvY2sudmlldy5zdHlsZS5ib3JkZXJDb2xvciA9IFwidmFyKC0tYm94Qm9yZGVyQ29sb3IsICMwMDApXCI7XG4gICAgICAgICAgICBibG9jay52aWV3LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwidmFyKC0tYmFja2dyb3VuZCwgI2ZmZilcIjtcbiAgICAgICAgICAgIGFuaW1hdGUoXG4gICAgICAgICAgICAgICAgYmxvY2sudmlldyxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IDAuMyxcbiAgICAgICAgICAgICAgICAgICAgXCJib3JkZXItY29sb3JcIjogXCIjZDNkM2QzXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiYmFja2dyb3VuZC1jb2xvclwiOiBcIiNlZmVmZWZcIixcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDIwMDAsXG4gICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBibG9jay52aWV3LnN0eWxlLmJvcmRlckNvbG9yID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrLnZpZXcuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBHaXZlIHRoZSB1c2VyIHRoZSBpbmRlbnRhdGlvblxuICAgIHJlbW92ZUluZGVudGF0aW9uKCkge1xuICAgICAgICB0aGlzLnNob3dNZXNzYWdlKHQoXCJtc2dfcGFyc29uX3Byb3ZpZGVkX2luZGVudFwiKSk7XG4gICAgICAgIC8vIE1vdmUgYW5kIHJlc2l6ZSBibG9ja3NcbiAgICAgICAgdmFyIGJsb2NrV2lkdGggPSAyMDA7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5saW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGxpbmUgPSB0aGlzLmxpbmVzW2ldO1xuICAgICAgICAgICAgdmFyIGV4cGFuZGVkV2lkdGggPVxuICAgICAgICAgICAgICAgIGxpbmUud2lkdGggKyBsaW5lLmluZGVudCAqIHRoaXMub3B0aW9ucy5waXhlbHNQZXJJbmRlbnQgKyAzMDtcbiAgICAgICAgICAgIGJsb2NrV2lkdGggPSBNYXRoLm1heChibG9ja1dpZHRoLCBleHBhbmRlZFdpZHRoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLm51bWJlcmVkICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgYmxvY2tXaWR0aCArPSAyNTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmFyZWFXaWR0aCA9IGJsb2NrV2lkdGggKyAyMjtcbiAgICAgICAgdmFyIGJsb2NrLCBpbmRlbnQ7XG4gICAgICAgIHZhciBzb3VyY2VCbG9ja3MgPSB0aGlzLnNvdXJjZUJsb2NrcygpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNvdXJjZUJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYmxvY2sgPSBzb3VyY2VCbG9ja3NbaV07XG4gICAgICAgICAgICBpbmRlbnQgPSBibG9jay5zb2x1dGlvbkluZGVudCgpO1xuICAgICAgICAgICAgaWYgKGluZGVudCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgYW5pbWF0ZShcbiAgICAgICAgICAgICAgICAgICAgYmxvY2sudmlldyxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IGJsb2NrV2lkdGgsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiAxMDAwLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGFuaW1hdGUoXG4gICAgICAgICAgICAgICAgICAgIGJsb2NrLnZpZXcsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrV2lkdGggLSBpbmRlbnQgKiB0aGlzLm9wdGlvbnMucGl4ZWxzUGVySW5kZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwYWRkaW5nLWxlZnRcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRlbnQgKiB0aGlzLm9wdGlvbnMucGl4ZWxzUGVySW5kZW50ICsgMTAsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiAxMDAwLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBhaXJlZERpdnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFuaW1hdGUoXG4gICAgICAgICAgICAgICAgdGhpcy5wYWlyZWREaXZzW2ldLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IGJsb2NrV2lkdGggKyAzNCxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDEwMDAsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGFuc3dlckJsb2NrcyA9IHRoaXMuYW5zd2VyQmxvY2tzKCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYW5zd2VyQmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBibG9jayA9IGFuc3dlckJsb2Nrc1tpXTtcbiAgICAgICAgICAgIGluZGVudCA9IGJsb2NrLnNvbHV0aW9uSW5kZW50KCk7XG4gICAgICAgICAgICBpZiAoaW5kZW50ID09IDApIHtcbiAgICAgICAgICAgICAgICBhbmltYXRlKFxuICAgICAgICAgICAgICAgICAgICBibG9jay52aWV3LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IGJsb2NrV2lkdGgsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiAxMDAwLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGFuaW1hdGUoXG4gICAgICAgICAgICAgICAgICAgIGJsb2NrLnZpZXcsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBibG9ja1dpZHRoIC0gaW5kZW50ICogdGhpcy5vcHRpb25zLnBpeGVsc1BlckluZGVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicGFkZGluZy1sZWZ0XCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZW50ICogdGhpcy5vcHRpb25zLnBpeGVsc1BlckluZGVudCArIDEwLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogMTAwMCxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIFJlc2l6ZSBhbnN3ZXIgYW5kIHNvdXJjZSBhcmVhXG4gICAgICAgIHRoaXMuYW5zd2VyQXJlYS5jbGFzc0xpc3QucmVtb3ZlKFxuICAgICAgICAgICAgXCJhbnN3ZXIxXCIsXG4gICAgICAgICAgICBcImFuc3dlcjJcIixcbiAgICAgICAgICAgIFwiYW5zd2VyM1wiLFxuICAgICAgICAgICAgXCJhbnN3ZXI0XCIsXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuYW5zd2VyQXJlYS5jbGFzc0xpc3QuYWRkKFwiYW5zd2VyXCIpO1xuICAgICAgICB0aGlzLmluZGVudCA9IDA7XG4gICAgICAgIHRoaXMubm9pbmRlbnQgPSB0cnVlO1xuICAgICAgICBhbmltYXRlKFxuICAgICAgICAgICAgdGhpcy5zb3VyY2VBcmVhLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLmFyZWFXaWR0aCArIDIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiAxMDAwLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgKTtcbiAgICAgICAgYW5pbWF0ZShcbiAgICAgICAgICAgIHRoaXMuYW5zd2VyQXJlYSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy5hcmVhV2lkdGggKyAyLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogMTAwMCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICk7XG4gICAgICAgIC8vIENoYW5nZSB0aGUgbW9kZWwgKHdpdGggdmlldykgb25jZSB0aGUgcmVzaXplIGFuaW1hdGlvbnMgYXJlIGRvbmVcbiAgICAgICAgYW5pbWF0ZShcbiAgICAgICAgICAgIHRoaXMuYW5zd2VyQXJlYSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBvcGFjaXR5OiAxLjAsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiAxMTAwLFxuICAgICAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFVwZGF0ZSB0aGUgbW9kZWxcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzb3VyY2VCbG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZUJsb2Nrc1tpXS5hZGRJbmRlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFuc3dlckJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgYW5zd2VyQmxvY2tzW2ldLmFkZEluZGVudCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gZmlyc3QgY2hlY2sgaWYgYW55IHNvbHV0aW9uIGJsb2NrcyBhcmUgaW4gdGhlIHNvdXJjZSBzdGlsbCAobGVmdCBzaWRlKSBhbmQgbm90XG4gICAgLy8gaW4gdGhlIGFuc3dlclxuICAgIGdldFNvbHV0aW9uQmxvY2tJblNvdXJjZSgpIHtcbiAgICAgICAgdmFyIHNvbHV0aW9uQmxvY2tzID0gdGhpcy5zb2x1dGlvbkJsb2NrcygpO1xuICAgICAgICB2YXIgYW5zd2VyQmxvY2tzID0gdGhpcy5hbnN3ZXJCbG9ja3MoKTtcbiAgICAgICAgdmFyIHNvdXJjZUJsb2NrcyA9IHRoaXMuc291cmNlQmxvY2tzKCk7XG4gICAgICAgIHZhciBzb2xCbG9jayA9IG51bGw7XG4gICAgICAgIHZhciBjdXJyQmxvY2sgPSBudWxsO1xuXG4gICAgICAgIC8vIGxvb3AgdGhyb3VnaCBzb3VyY2VCbG9ja3MgYW5kIHJldHVybiBhIGJsb2NrIGlmIGl0IGlzIG5vdCBpbiB0aGUgc29sdXRpb25cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzb3VyY2VCbG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIC8vIGdldCB0aGUgY3VycmVudCBibG9jayBmcm9tIHRoZSBzb3VyY2VcbiAgICAgICAgICAgIGN1cnJCbG9jayA9IHNvdXJjZUJsb2Nrc1tpXTtcblxuICAgICAgICAgICAgLy8gaWYgY3VyckJsb2NrIGlzIGluIHRoZSBzb2x1dGlvbiBhbmQgaXNuJ3QgdGhlIGZpcnN0IGJsb2NrIGFuZCBpc24ndCBpbiB0aGUgYW5zd2VyXG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgc29sdXRpb25CbG9ja3MuaW5kZXhPZihjdXJyQmxvY2spID4gMCAmJlxuICAgICAgICAgICAgICAgIGFuc3dlckJsb2Nrcy5pbmRleE9mKGN1cnJCbG9jaykgPCAwXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3VyckJsb2NrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIGRpZG4ndCBmaW5kIGFueSBibG9jayBpbiB0aGUgc291cmNlIHRoYXQgaXMgaW4gdGhlIHNvbHV0aW9uXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8vIEZpbmQgYSBibG9jazIgdGhhdCBpcyBmdXJ0aGVzdCBmcm9tIGJsb2NrMSBpbiB0aGUgYW5zd2VyXG4gICAgLy8gZG9uJ3QgdXNlIHRoZSB2ZXJ5IGZpcnN0IGJsb2NrIGluIHRoZSBzb2x1dGlvbiBhcyBibG9jazJcbiAgICBnZXRGdXJ0aGVzdEJsb2NrKCkge1xuICAgICAgICB2YXIgc29sdXRpb25CbG9ja3MgPSB0aGlzLnNvbHV0aW9uQmxvY2tzKCk7XG4gICAgICAgIHZhciBhbnN3ZXJCbG9ja3MgPSB0aGlzLmFuc3dlckJsb2NrcygpO1xuICAgICAgICB2YXIgbWF4RGlzdCA9IDA7XG4gICAgICAgIHZhciBkaXN0ID0gMDtcbiAgICAgICAgdmFyIG1heEJsb2NrID0gbnVsbDtcbiAgICAgICAgdmFyIGN1cnJCbG9jayA9IG51bGw7XG4gICAgICAgIHZhciBpbmRleFNvbCA9IDA7XG4gICAgICAgIHZhciBwcmV2QmxvY2sgPSBudWxsO1xuICAgICAgICB2YXIgaW5kZXhQcmV2ID0gMDtcblxuICAgICAgICAvLyBsb29wIHRocm91Z2ggdGhlIGJsb2NrcyBpbiB0aGUgYW5zd2VyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYW5zd2VyQmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjdXJyQmxvY2sgPSBhbnN3ZXJCbG9ja3NbaV07XG4gICAgICAgICAgICBpbmRleFNvbCA9IHNvbHV0aW9uQmxvY2tzLmluZGV4T2YoY3VyckJsb2NrKTtcbiAgICAgICAgICAgIGlmIChpbmRleFNvbCA+IDApIHtcbiAgICAgICAgICAgICAgICBwcmV2QmxvY2sgPSBzb2x1dGlvbkJsb2Nrc1tpbmRleFNvbCAtIDFdO1xuICAgICAgICAgICAgICAgIGluZGV4UHJldiA9IGFuc3dlckJsb2Nrcy5pbmRleE9mKHByZXZCbG9jayk7XG4gICAgICAgICAgICAgICAgLy8gY2FsY3VsYXRlIHRoZSBkaXN0YW5jZSBpbiB0aGUgYW5zd2VyXG4gICAgICAgICAgICAgICAgZGlzdCA9IE1hdGguYWJzKGkgLSBpbmRleFByZXYpO1xuICAgICAgICAgICAgICAgIGlmIChkaXN0ID4gbWF4RGlzdCkge1xuICAgICAgICAgICAgICAgICAgICBtYXhEaXN0ID0gZGlzdDtcbiAgICAgICAgICAgICAgICAgICAgbWF4QmxvY2sgPSBjdXJyQmxvY2s7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtYXhCbG9jaztcbiAgICB9XG5cbiAgICAvLyBDb21iaW5lIGJsb2NrcyB0b2dldGhlclxuICAgIGNvbWJpbmVCbG9ja3MoKSB7XG4gICAgICAgIHZhciBzb2x1dGlvbkJsb2NrcyA9IHRoaXMuc29sdXRpb25CbG9ja3MoKTtcbiAgICAgICAgdmFyIGFuc3dlckJsb2NrcyA9IHRoaXMuYW5zd2VyQmxvY2tzKCk7XG4gICAgICAgIHZhciBzb3VyY2VCbG9ja3MgPSB0aGlzLnNvdXJjZUJsb2NrcygpO1xuXG4gICAgICAgIHRoaXMuc2hvd01lc3NhZ2UodChcIm1zZ19wYXJzb25fY29tYmluZWRfYmxvY2tzXCIpKTtcbiAgICAgICAgdmFyIGJsb2NrMSA9IG51bGw7XG4gICAgICAgIHZhciBibG9jazIgPSBudWxsO1xuXG4gICAgICAgIC8vIGdldCBhIHNvbHV0aW9uIGJsb2NrIHRoYXQgaXMgc3RpbGwgaW4gc291cmNlIChub3QgYW5zd2VyKSwgaWYgYW55XG4gICAgICAgIGJsb2NrMiA9IHRoaXMuZ2V0U29sdXRpb25CbG9ja0luU291cmNlKCk7XG5cbiAgICAgICAgLy8gaWYgbm9uZSBpbiBzb3VyY2UgZ2V0IGJsb2NrIHRoYXQgaXMgZnVydGhlc3QgZnJvbSBibG9jazFcbiAgICAgICAgaWYgKGJsb2NrMiA9PSBudWxsKSB7XG4gICAgICAgICAgICBibG9jazIgPSB0aGlzLmdldEZ1cnRoZXN0QmxvY2soKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGdldCBibG9jazEgKGFib3ZlIGJsb2NrMikgaW4gc29sdXRpb25cbiAgICAgICAgdmFyIGluZGV4ID0gc29sdXRpb25CbG9ja3MuaW5kZXhPZihibG9jazIpO1xuICAgICAgICBibG9jazEgPSBzb2x1dGlvbkJsb2Nrc1tpbmRleCAtIDFdO1xuXG4gICAgICAgIC8vIGdldCBpbmRleCBvZiBlYWNoIGluIGFuc3dlclxuICAgICAgICB2YXIgaW5kZXgxID0gYW5zd2VyQmxvY2tzLmluZGV4T2YoYmxvY2sxKTtcbiAgICAgICAgdmFyIGluZGV4MiA9IGFuc3dlckJsb2Nrcy5pbmRleE9mKGJsb2NrMik7XG4gICAgICAgIHZhciBtb3ZlID0gZmFsc2U7XG5cbiAgICAgICAgLy8gaWYgYm90aCBpbiBhbnN3ZXIgc2V0IG1vdmUgYmFzZWQgb24gaWYgZGlyZWN0bHkgYWJvdmUgZWFjaCBvdGhlclxuICAgICAgICBpZiAoaW5kZXgxID49IDAgJiYgaW5kZXgyID49IDApIHtcbiAgICAgICAgICAgIG1vdmUgPSBpbmRleDEgKyAxICE9PSBpbmRleDI7XG5cbiAgICAgICAgICAgIC8vIGVsc2UgaWYgYm90aCBpbiBzb3VyY2Ugc2V0IG1vdmUgYWdhaW4gYmFzZWQgb24gaWYgYWJvdmUgZWFjaCBvdGhlclxuICAgICAgICB9IGVsc2UgaWYgKGluZGV4MSA8IDAgJiYgaW5kZXgyIDwgMCkge1xuICAgICAgICAgICAgaW5kZXgxID0gc291cmNlQmxvY2tzLmluZGV4T2YoYmxvY2sxKTtcbiAgICAgICAgICAgIGluZGV4MiA9IHNvdXJjZUJsb2Nrcy5pbmRleE9mKGJsb2NrMik7XG4gICAgICAgICAgICBtb3ZlID0gaW5kZXgxICsgMSAhPT0gaW5kZXgyO1xuXG4gICAgICAgICAgICAvLyBvbmUgaW4gc291cmNlIGFuZCBvbmUgaW4gYW5zd2VyIHNvIG11c3QgbW92ZVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbW92ZSA9IHRydWU7XG4gICAgICAgICAgICBpZiAoaW5kZXgxIDwgMCkge1xuICAgICAgICAgICAgICAgIGluZGV4MSA9IHNvdXJjZUJsb2Nrcy5pbmRleE9mKGJsb2NrMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaW5kZXgyIDwgMCkge1xuICAgICAgICAgICAgICAgIGluZGV4MiA9IHNvdXJjZUJsb2Nrcy5pbmRleE9mKGJsb2NrMik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc3VidHJhY3QgPSBpbmRleDIgPCBpbmRleDE7IC8vIGlzIGJsb2NrMiBoaWdoZXJcblxuICAgICAgICBpZiAobW92ZSkge1xuICAgICAgICAgICAgLy8gTW92ZSB0aGUgYmxvY2tcbiAgICAgICAgICAgIHZhciBzdGFydFggPSBibG9jazIucGFnZVhDZW50ZXIoKSAtIDE7XG4gICAgICAgICAgICB2YXIgc3RhcnRZID0gYmxvY2syLnBhZ2VZQ2VudGVyKCk7XG4gICAgICAgICAgICB2YXIgZW5kWCA9IGJsb2NrMS5wYWdlWENlbnRlcigpIC0gMTtcbiAgICAgICAgICAgIHZhciBlbmRZID1cbiAgICAgICAgICAgICAgICBibG9jazEucGFnZVlDZW50ZXIoKSArXG4gICAgICAgICAgICAgICAgYmxvY2sxLnZpZXcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0IC8gMiArXG4gICAgICAgICAgICAgICAgNTtcbiAgICAgICAgICAgIGlmIChzdWJ0cmFjdCkge1xuICAgICAgICAgICAgICAgIGVuZFkgLT0gYmxvY2syLnZpZXcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0IC8gMjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZW5kWSArPSBibG9jazIudmlldy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQgLyAyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICAgICAgYW5pbWF0ZShcbiAgICAgICAgICAgICAgICBibG9jazIudmlldyxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IDEsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiAxMDAwLCAvLyAxIHNlY2NvbmRcbiAgICAgICAgICAgICAgICAgICAgc3RhcnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrMS52aWV3LnN0eWxlLmJvcmRlckNvbG9yID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInZhcigtLWJveEJvcmRlckNvbG9yLCAjMDAwKVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2sxLnZpZXcuc3R5bGUuYmFja2dyb3VuZENvbG9yID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInZhcigtLWJhY2tncm91bmQsICNmZmYpXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBibG9jazIudmlldy5zdHlsZS5ib3JkZXJDb2xvciA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ2YXIoLS1ib3hCb3JkZXJDb2xvciwgIzAwMClcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrMi52aWV3LnN0eWxlLmJhY2tncm91bmRDb2xvciA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ2YXIoLS1iYWNrZ3JvdW5kLCAjZmZmKVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2syLmxpbmVzWzBdLmluZGV4ICs9IDEwMDA7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0Lm1vdmluZyA9IGJsb2NrMjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQubW92aW5nWCA9IHN0YXJ0WDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQubW92aW5nWSA9IHN0YXJ0WTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQudXBkYXRlVmlldygpO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBwcm9ncmVzczogZnVuY3Rpb24gKGEsIHAsIGMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQubW92aW5nWCA9IHN0YXJ0WCAqICgxIC0gcCkgKyBlbmRYICogcDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQubW92aW5nWSA9IHN0YXJ0WSAqICgxIC0gcCkgKyBlbmRZICogcDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQudXBkYXRlVmlldygpO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHRoYXQubW92aW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHRoYXQubW92aW5nWDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGF0Lm1vdmluZ1k7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0LnVwZGF0ZVZpZXcoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrMi5saW5lc1swXS5pbmRleCAtPSAxMDAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2sxLmNvbnN1bWVCbG9jayhibG9jazIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0ZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBibG9jazEudmlldyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYm9yZGVyLWNvbG9yXCI6IFwiI2QzZDNkM1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImJhY2tncm91bmQtY29sb3JcIjogXCIjZWZlZmVmXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiAxMDAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2sxLnZpZXcuc3R5bGUuYm9yZGVyQ29sb3IgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2sxLnZpZXcuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFuaW1hdGUoXG4gICAgICAgICAgICAgICAgYmxvY2syLnZpZXcsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAxLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogMTAwMCxcbiAgICAgICAgICAgICAgICAgICAgc3RhcnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrMS52aWV3LnN0eWxlLmJvcmRlckNvbG9yID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInZhcigtLWJveEJvcmRlckNvbG9yLCAjMDAwKVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2sxLnZpZXcuc3R5bGUuYmFja2dyb3VuZENvbG9yID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInZhcigtLWJhY2tncm91bmQsICNmZmYpXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBibG9jazIudmlldy5zdHlsZS5ib3JkZXJDb2xvciA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ2YXIoLS1ib3hCb3JkZXJDb2xvciwgIzAwMClcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrMi52aWV3LnN0eWxlLmJhY2tncm91bmRDb2xvciA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ2YXIoLS1iYWNrZ3JvdW5kLCAjZmZmKVwiO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2sxLmNvbnN1bWVCbG9jayhibG9jazIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0ZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBibG9jazEudmlldyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYm9yZGVyLWNvbG9yXCI6IFwiI2QzZDNkM1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImJhY2tncm91bmQtY29sb3JcIjogXCIjZWZlZmVmXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiAxMDAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2sxLnZpZXcuc3R5bGUuYm9yZGVyQ29sb3IgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2sxLnZpZXcuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBBZGFwdCB0aGUgcHJvYmxlbSB0byBiZSBlYXNpZXJcbiAgICAvLyAgKiByZW1vdmUgYSBkaXN0cmFjdG9yIHVudGlsIG5vbmUgYXJlIHByZXNlbnRcbiAgICAvLyAgKiBjb21iaW5lIGJsb2NrcyB1bnRpbCAzIGFyZSBsZWZ0XG4gICAgbWFrZUVhc2llcigpIHtcbiAgICAgICAgdmFyIGRpc3RyYWN0b3JUb1JlbW92ZSA9IHRoaXMuZGlzdHJhY3RvclRvUmVtb3ZlKCk7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIGRpc3RyYWN0b3JUb1JlbW92ZSAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgICAgICAhZGlzdHJhY3RvclRvUmVtb3ZlLmluU291cmNlQXJlYSgpXG4gICAgICAgICkge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVEaXN0cmFjdG9yKGRpc3RyYWN0b3JUb1JlbW92ZSk7XG4gICAgICAgICAgICB0aGlzLmxvZ01vdmUoXCJyZW1vdmVkRGlzdHJhY3Rvci1cIiArIGRpc3RyYWN0b3JUb1JlbW92ZS5oYXNoKCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIG51bWJlck9mQmxvY2tzID0gdGhpcy5udW1iZXJPZkJsb2NrcyhmYWxzZSk7XG4gICAgICAgICAgICBpZiAobnVtYmVyT2ZCbG9ja3MgPiAzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb21iaW5lQmxvY2tzKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2dNb3ZlKFwiY29tYmluZWRCbG9ja3NcIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuc2hvd01lc3NhZ2UodChcIm1zZ19wYXJzb25fdGhyZWVfYmxvY2tzX2xlZnRcIikpO1xuICAgICAgICAgICAgICAgIHRoaXMuY2FuSGVscCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy9pZiAobnVtYmVyT2ZCbG9ja3MgPCA1KSB7XG4gICAgICAgICAgICAvL1x0dGhpcy5jYW5IZWxwID0gZmFsc2U7XG4gICAgICAgICAgICAvL1x0dGhpcy5oZWxwQnV0dG9uLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIC8vfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8vIFRoZSBcIkhlbHAgTWVcIiBidXR0b24gd2FzIHByZXNzZWQgYW5kIHRoZSBwcm9ibGVtIHNob3VsZCBiZSBzaW1wbGlmaWVkXG4gICAgaGVscE1lKCkge1xuICAgICAgICB0aGlzLmNsZWFyRmVlZGJhY2soKTtcbiAgICAgICAgLy90aGlzLmhlbHBDb3VudCA9IC0xOyAvLyBhbW91bnQgdG8gYWxsb3cgZm9yIG11bHRpcGxlIGhlbHBzIGluIGEgcm93XG4gICAgICAgIC8vaWYgKHRoaXMuaGVscENvdW50IDwgMCkge1xuICAgICAgICAvL1x0dGhpcy5oZWxwQ291bnQgPSBNYXRoLm1heCh0aGlzLmhlbHBDb3VudCwgLTEpOyAvLyBtaW4gMSBhdHRlbXB0IGJlZm9yZSBtb3JlIGhlbHBcbiAgICAgICAgLy90aGlzLmhlbHBCdXR0b24uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICAvL31cbiAgICAgICAgLy8gaWYgbGVzcyB0aGFuIDMgYXR0ZW1wdHNcbiAgICAgICAgaWYgKHRoaXMubnVtRGlzdGluY3QgPCAzKSB7XG4gICAgICAgICAgICB0aGlzLnNob3dNZXNzYWdlKHQoXCJtc2dfcGFyc29uX2F0bGVhc3RfdGhyZWVfYXR0ZW1wdHNcIikpO1xuICAgICAgICB9XG4gICAgICAgIC8vIG90aGVyd2lzZSBnaXZlIGhlbHBcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmdvdEhlbHAgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5tYWtlRWFzaWVyKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT09PSBVVElMSVRZID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG4gICAgLy8gUmV0dXJuIGEgZGF0ZSBmcm9tIGEgdGltZXN0YW1wIChlaXRoZXIgbXlTUUwgb3IgSlMgZm9ybWF0KVxuICAgIGRhdGVGcm9tVGltZXN0YW1wKHRpbWVzdGFtcCkge1xuICAgICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKHRpbWVzdGFtcCk7XG4gICAgICAgIGlmIChpc05hTihkYXRlLmdldFRpbWUoKSkpIHtcbiAgICAgICAgICAgIHZhciB0ID0gdGltZXN0YW1wLnNwbGl0KC9bLSA6XS8pO1xuICAgICAgICAgICAgZGF0ZSA9IG5ldyBEYXRlKHRbMF0sIHRbMV0gLSAxLCB0WzJdLCB0WzNdLCB0WzRdLCB0WzVdKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGF0ZTtcbiAgICB9XG4gICAgLy8gQSBmdW5jdGlvbiBmb3IgcmV0dXJuaW5nIGEgc2h1ZmZsZWQgdmVyc2lvbiBvZiBhbiBhcnJheVxuICAgIHNodWZmbGVkKGFycmF5KSB7XG4gICAgICAgIHZhciBjdXJyZW50SW5kZXggPSBhcnJheS5sZW5ndGg7XG4gICAgICAgIHZhciByZXR1cm5BcnJheSA9IGFycmF5LnNsaWNlKCk7XG4gICAgICAgIHZhciB0ZW1wb3JhcnlWYWx1ZSwgcmFuZG9tSW5kZXg7XG4gICAgICAgIC8vIFdoaWxlIHRoZXJlIHJlbWFpbiBlbGVtZW50cyB0byBzaHVmZmxlLi4uXG4gICAgICAgIHdoaWxlICgwICE9PSBjdXJyZW50SW5kZXgpIHtcbiAgICAgICAgICAgIC8vIFBpY2sgYSByZW1haW5pbmcgZWxlbWVudC4uLlxuICAgICAgICAgICAgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjdXJyZW50SW5kZXgpO1xuICAgICAgICAgICAgY3VycmVudEluZGV4IC09IDE7XG4gICAgICAgICAgICAvLyBBbmQgc3dhcCBpdCB3aXRoIHRoZSBjdXJyZW50IGVsZW1lbnQuXG4gICAgICAgICAgICB0ZW1wb3JhcnlWYWx1ZSA9IHJldHVybkFycmF5W2N1cnJlbnRJbmRleF07XG4gICAgICAgICAgICByZXR1cm5BcnJheVtjdXJyZW50SW5kZXhdID0gcmV0dXJuQXJyYXlbcmFuZG9tSW5kZXhdO1xuICAgICAgICAgICAgcmV0dXJuQXJyYXlbcmFuZG9tSW5kZXhdID0gdGVtcG9yYXJ5VmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldHVybkFycmF5O1xuICAgIH1cbiAgICAvKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICA9PT09IEtFWUJPQVJEIElOVEVSQUNUSU9OID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbiAgICAvLyBXaGVuIHRoZSB1c2VyIGhhcyBlbnRlcmVkIHRoZSBQYXJzb25zIHByb2JsZW0gdmlhIGtleWJvYXJkIG1vZGVcbiAgICBlbnRlcktleWJvYXJkTW9kZSgpIHtcbiAgICAgICAgdGhpcy5rZXlib2FyZFRpcC5pbm5lckhUTUwgPSB0KFwibXNnX3BhcnNvbl9hcnJvd19uYXZpZ2F0ZVwiKTtcbiAgICAgICAgdGhpcy5rZXlib2FyZFRpcC5zdHlsZS5kaXNwbGF5ID0gXCJcIjtcbiAgICAgICAgLy8gVGhlIG9uZ29pbmcgbmF2aWdhdGlvbiB0aXAgaXMgYSBxdWlldCBpbnN0cnVjdGlvbiwgbm90IGEgY2FsbCB0byBhY3QuXG4gICAgICAgIHRoaXMua2V5Ym9hcmRUaXAuY2xhc3NMaXN0LnJlbW92ZShcInBhcnNvbnMtZW50cnktaGludFwiKTtcbiAgICAgICAgdGhpcy5zb3VyY2VMYWJlbC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgIHRoaXMuYW5zd2VyTGFiZWwuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgIH1cbiAgICBzdGFydEtleWJvYXJkSW50ZXJhY3Rpb24oKSB7XG4gICAgICAgIGlmICh0aGlzLmtleWJvYXJkSW5wdXRBY3RpdmUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBibG9jayA9XG4gICAgICAgICAgICB0aGlzLmVuYWJsZWRBbnN3ZXJCbG9ja3MoKS5maW5kKChpdGVtKSA9PlxuICAgICAgICAgICAgICAgIHRoaXMuaXNJbmNvcnJlY3RCbG9jayhpdGVtKSxcbiAgICAgICAgICAgICkgfHxcbiAgICAgICAgICAgIHRoaXMuZW5hYmxlZFNvdXJjZUJsb2NrcygpWzBdIHx8XG4gICAgICAgICAgICB0aGlzLmVuYWJsZWRBbnN3ZXJCbG9ja3MoKVswXTtcbiAgICAgICAgaWYgKCFibG9jaykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZW50ZXJLZXlib2FyZE1vZGUoKTtcbiAgICAgICAgdGhpcy50ZXh0Rm9jdXMgPSBibG9jaztcbiAgICAgICAgdGhpcy50ZXh0TW92ZSA9IGZhbHNlO1xuICAgICAgICBibG9jay5tYWtlVGFiSW5kZXgoKTtcbiAgICAgICAgYmxvY2sudmlldy5jbGFzc0xpc3QuYWRkKFwiZG93blwiKTtcbiAgICAgICAgdGhpcy5lbnRlcktleWJvYXJkTmF2aWdhdGlvbk1vZGUoYmxvY2ssIHRydWUpO1xuICAgIH1cblxuICAgIGVudGVyS2V5Ym9hcmROYXZpZ2F0aW9uTW9kZShibG9jaywgaW5jbHVkZUluc3RydWN0aW9ucyA9IGZhbHNlKSB7XG4gICAgICAgIHRoaXMua2V5Ym9hcmRJbnB1dEFjdGl2ZSA9IHRydWU7XG4gICAgICAgIGNvbnN0IGxhYmVsID0gW1xuICAgICAgICAgICAgdChcIm1zZ19wYXJzb25fa2V5Ym9hcmRfc2VsZWN0ZWRcIiwgdGhpcy5nZXRCbG9ja0xhYmVsKGJsb2NrKSksXG4gICAgICAgIF07XG4gICAgICAgIGlmICh0aGlzLmlzSW5jb3JyZWN0QmxvY2soYmxvY2spKSB7XG4gICAgICAgICAgICBsYWJlbC5wdXNoKHQoXCJtc2dfcGFyc29uX2luY29ycmVjdFwiKSk7XG4gICAgICAgIH1cbiAgICAgICAgbGFiZWwucHVzaCh0aGlzLmdldEtleWJvYXJkQmxvY2tMb2NhdGlvbihibG9jaykpO1xuICAgICAgICB0aGlzLmtleWJvYXJkQXBwbGljYXRpb24uc2V0QXR0cmlidXRlKFxuICAgICAgICAgICAgXCJhcmlhLWxhYmVsXCIsXG4gICAgICAgICAgICBpbmNsdWRlSW5zdHJ1Y3Rpb25zXG4gICAgICAgICAgICAgICAgPyB0KFwibXNnX3BhcnNvbl9rZXlib2FyZF9pbnN0cnVjdGlvbnNcIikgKyBcIiBcIiArIGxhYmVsLmpvaW4oXCIuIFwiKVxuICAgICAgICAgICAgICAgIDogbGFiZWwuam9pbihcIi4gXCIpLFxuICAgICAgICApO1xuICAgICAgICB0aGlzLmtleWJvYXJkQXBwbGljYXRpb24uZm9jdXMoKTtcbiAgICB9XG5cbiAgICBlbnRlcktleWJvYXJkTW92ZW1lbnRNb2RlKGJsb2NrKSB7XG4gICAgICAgIHRoaXMua2V5Ym9hcmRNb3ZlbWVudE1vZGUgPSB0cnVlO1xuICAgICAgICB0aGlzLmtleWJvYXJkSW5wdXRBY3RpdmUgPSB0cnVlO1xuICAgICAgICB0aGlzLmtleWJvYXJkQXBwbGljYXRpb24uc2V0QXR0cmlidXRlKFxuICAgICAgICAgICAgXCJhcmlhLWxhYmVsXCIsXG4gICAgICAgICAgICB0aGlzLmdldEtleWJvYXJkQmxvY2tMb2NhdGlvbihibG9jayksXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMua2V5Ym9hcmRBcHBsaWNhdGlvbi5mb2N1cygpO1xuICAgIH1cblxuICAgIGV4aXRLZXlib2FyZE1vdmVtZW50TW9kZSgpIHtcbiAgICAgICAgdGhpcy5rZXlib2FyZE1vdmVtZW50TW9kZSA9IGZhbHNlO1xuICAgICAgICBpZiAodGhpcy50ZXh0Rm9jdXMpIHtcbiAgICAgICAgICAgIHRoaXMuZW50ZXJLZXlib2FyZE5hdmlnYXRpb25Nb2RlKHRoaXMudGV4dEZvY3VzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNhbmNlbEtleWJvYXJkTW92ZW1lbnQocmV0dXJuRm9jdXNUb0VudHJ5ID0gZmFsc2UpIHtcbiAgICAgICAgY29uc3QgYmxvY2sgPSB0aGlzLnRleHRGb2N1cztcbiAgICAgICAgdGhpcy5rZXlib2FyZE1vdmVtZW50TW9kZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmtleWJvYXJkSW5wdXRBY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy50ZXh0TW92ZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLnRleHRNb3ZpbmcgPSBmYWxzZTtcbiAgICAgICAgaWYgKGJsb2NrKSB7XG4gICAgICAgICAgICBibG9jay52aWV3LmNsYXNzTGlzdC5yZW1vdmUoXCJkb3duXCIsIFwidXBcIik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50ZXh0Rm9jdXMgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMuZXhpdEtleWJvYXJkTW9kZSgpO1xuICAgICAgICBpZiAocmV0dXJuRm9jdXNUb0VudHJ5KSB7XG4gICAgICAgICAgICB0aGlzLnNvcnRDb250YWluZXJEaXYuZm9jdXMoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNlbGVjdEtleWJvYXJkQmxvY2soYmxvY2spIHtcbiAgICAgICAgY29uc3QgcHJldmlvdXNCbG9jayA9IHRoaXMudGV4dEZvY3VzO1xuICAgICAgICBpZiAocHJldmlvdXNCbG9jayAmJiBwcmV2aW91c0Jsb2NrICE9PSBibG9jaykge1xuICAgICAgICAgICAgcHJldmlvdXNCbG9jay52aWV3LmNsYXNzTGlzdC5yZW1vdmUoXCJkb3duXCIsIFwidXBcIik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50ZXh0Rm9jdXMgPSBibG9jaztcbiAgICAgICAgdGhpcy50ZXh0TW92ZSA9IGZhbHNlO1xuICAgICAgICBibG9jay5tYWtlVGFiSW5kZXgoKTtcbiAgICAgICAgYmxvY2sudmlldy5jbGFzc0xpc3QuYWRkKFwiZG93blwiKTtcbiAgICAgICAgdGhpcy5lbnRlcktleWJvYXJkTmF2aWdhdGlvbk1vZGUoYmxvY2spO1xuICAgIH1cblxuICAgIGV4aXRLZXlib2FyZE1vZGVGb3JUYWIoKSB7XG4gICAgICAgIHRoaXMuY2FuY2VsS2V5Ym9hcmRNb3ZlbWVudCgpO1xuICAgIH1cblxuICAgIGhhbmRsZUtleWJvYXJkTW92ZW1lbnRLZXlkb3duKGV2ZW50KSB7XG4gICAgICAgIGlmICghdGhpcy5rZXlib2FyZElucHV0QWN0aXZlIHx8ICF0aGlzLnRleHRGb2N1cykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGJsb2NrID0gdGhpcy50ZXh0Rm9jdXM7XG4gICAgICAgIGNvbnN0IHdhc01vdmluZyA9IHRoaXMudGV4dE1vdmU7XG4gICAgICAgIGNvbnN0IHByZXZpb3VzUGFyZW50ID0gYmxvY2sudmlldy5wYXJlbnRFbGVtZW50O1xuICAgICAgICBjb25zdCBwcmV2aW91c0luZGV4ID0gQXJyYXkucHJvdG90eXBlLmluZGV4T2YuY2FsbChcbiAgICAgICAgICAgIHByZXZpb3VzUGFyZW50LmNoaWxkcmVuLFxuICAgICAgICAgICAgYmxvY2sudmlldyxcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgcHJldmlvdXNJbmRlbnQgPSBibG9jay5pbmRlbnQ7XG4gICAgICAgIHN3aXRjaCAoZXZlbnQua2V5KSB7XG4gICAgICAgICAgICBjYXNlIFwiVGFiXCI6XG4gICAgICAgICAgICAgICAgdGhpcy5leGl0S2V5Ym9hcmRNb2RlRm9yVGFiKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgY2FzZSBcIkFycm93TGVmdFwiOlxuICAgICAgICAgICAgICAgIHRoaXMudGV4dE1vdmUgPyBibG9jay5tb3ZlTGVmdCgpIDogYmxvY2suc2VsZWN0TGVmdCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIkFycm93VXBcIjpcbiAgICAgICAgICAgICAgICB0aGlzLnRleHRNb3ZlID8gYmxvY2subW92ZVVwKCkgOiBibG9jay5zZWxlY3RVcCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIkFycm93UmlnaHRcIjpcbiAgICAgICAgICAgICAgICB0aGlzLnRleHRNb3ZlID8gYmxvY2subW92ZVJpZ2h0KCkgOiBibG9jay5zZWxlY3RSaWdodCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIkFycm93RG93blwiOlxuICAgICAgICAgICAgICAgIHRoaXMudGV4dE1vdmUgPyBibG9jay5tb3ZlRG93bigpIDogYmxvY2suc2VsZWN0RG93bigpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIkVudGVyXCI6XG4gICAgICAgICAgICBjYXNlIFwiIFwiOlxuICAgICAgICAgICAgICAgIGJsb2NrLnRvZ2dsZU1vdmUoKTtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMudGV4dE1vdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5leGl0S2V5Ym9hcmRNb3ZlbWVudE1vZGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24/LigpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIGNhc2UgXCJFc2NhcGVcIjpcbiAgICAgICAgICAgIGNhc2UgXCJFc2NcIjpcbiAgICAgICAgICAgICAgICB0aGlzLmNhbmNlbEtleWJvYXJkTW92ZW1lbnQodHJ1ZSk7XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24/LigpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbj8uKCk7XG4gICAgICAgIHRoaXMudGV4dE1vdmluZyA9IGZhbHNlO1xuICAgICAgICBjb25zdCBwbGFjZW1lbnRDaGFuZ2VkID1cbiAgICAgICAgICAgIHdhc01vdmluZyAmJlxuICAgICAgICAgICAgKGJsb2NrLnZpZXcucGFyZW50RWxlbWVudCAhPT0gcHJldmlvdXNQYXJlbnQgfHxcbiAgICAgICAgICAgICAgICBibG9jay5pbmRlbnQgIT09IHByZXZpb3VzSW5kZW50IHx8XG4gICAgICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLmluZGV4T2YuY2FsbChcbiAgICAgICAgICAgICAgICAgICAgYmxvY2sudmlldy5wYXJlbnRFbGVtZW50LmNoaWxkcmVuLFxuICAgICAgICAgICAgICAgICAgICBibG9jay52aWV3LFxuICAgICAgICAgICAgICAgICkgIT09IHByZXZpb3VzSW5kZXgpO1xuICAgICAgICBpZiAocGxhY2VtZW50Q2hhbmdlZCkge1xuICAgICAgICAgICAgdGhpcy5jbGVhckZlZWRiYWNrKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMudGV4dE1vdmUpIHtcbiAgICAgICAgICAgIHRoaXMuZW50ZXJLZXlib2FyZE1vdmVtZW50TW9kZShibG9jayk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmtleWJvYXJkQXBwbGljYXRpb24uZm9jdXMoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFdoZW4gdGhlIHVzZXIgbGVhdmVzIHRoZSBQYXJzb25zIHByb2JsZW0gdmlhIGtleWJvYXJkIG1vZGVcbiAgICBleGl0S2V5Ym9hcmRNb2RlKCkge1xuICAgICAgICB0aGlzLmtleWJvYXJkQXBwbGljYXRpb24ucmVtb3ZlQXR0cmlidXRlKFwiYXJpYS1sYWJlbFwiKTtcbiAgICAgICAgdGhpcy5zb3J0Q29udGFpbmVyRGl2LnNldEF0dHJpYnV0ZShcbiAgICAgICAgICAgIFwiYXJpYS1sYWJlbFwiLFxuICAgICAgICAgICAgdChcIm1zZ19wYXJzb25fa2V5Ym9hcmRfZW50cnlfbGFiZWxcIiksXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuaGlkZUtleWJvYXJkRW50cnlIaW50KCk7XG4gICAgfVxuICAgIC8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09PT0gVklFVyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuICAgIC8vIENsZWFyIGFueSBmZWVkYmFjayBmcm9tIHRoZSBhbnN3ZXIgYXJlYVxuICAgIGNsZWFyRmVlZGJhY2soKSB7XG4gICAgICAgIHRoaXMuYW5zd2VyQXJlYS5jbGFzc0xpc3QucmVtb3ZlKFwiaW5jb3JyZWN0XCIsIFwiY29ycmVjdFwiKTtcbiAgICAgICAgdmFyIGNoaWxkcmVuID0gdGhpcy5hbnN3ZXJBcmVhLmNoaWxkcmVuO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjaGlsZHJlbltpXS5jbGFzc0xpc3QucmVtb3ZlKFxuICAgICAgICAgICAgICAgIFwiY29ycmVjdFBvc2l0aW9uXCIsXG4gICAgICAgICAgICAgICAgXCJpbmNvcnJlY3RQb3NpdGlvblwiLFxuICAgICAgICAgICAgICAgIFwiaW5kZW50TGVmdFwiLFxuICAgICAgICAgICAgICAgIFwiaW5kZW50UmlnaHRcIixcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5tZXNzYWdlRGl2LnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuICAgICAgICB0aGlzLnBlbmRpbmdIZWxwTWVzc2FnZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5oaWRlQmxvY2tFeHBsYW5hdGlvbnMoKTtcbiAgICAgICAgdGhpcy51cGRhdGVCbG9ja0FyaWFMYWJlbHMoKTtcbiAgICB9XG4gICAgLy8gRGlzYWJsZSB0aGUgaW50ZXJmYWNlXG4gICAgYXN5bmMgZGlzYWJsZUludGVyYWN0aW9uKCkge1xuICAgICAgICAvLyBEaXNhYmxlIGJsb2Nrc1xuICAgICAgICBhd2FpdCB0aGlzLmNoZWNrU2VydmVyQ29tcGxldGU7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiZGlzYWJsaW5nIGJsb2Nrc1wiKTtcbiAgICAgICAgaWYgKHRoaXMuYmxvY2tzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5ibG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgYmxvY2sgPSB0aGlzLmJsb2Nrc1tpXTtcbiAgICAgICAgICAgICAgICBibG9jay5kaXNhYmxlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gSGlkZSBidXR0b25zXG4gICAgICAgIHRoaXMuY2hlY2tCdXR0b24uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICB0aGlzLnJlc2V0QnV0dG9uLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICB9XG4gICAgLy8gQmFzZWQgb24gdGhlIG1vdmluZyBlbGVtZW50LCBldGMuLCBlc3RhYmxpc2ggdGhlIG1vdmluZyBzdGF0ZVxuICAgIC8vICAgcmVzdDogbm90IG1vdmluZ1xuICAgIC8vICAgc291cmNlOiBtb3ZpbmcgaW5zaWRlIHNvdXJjZSBhcmVhXG4gICAgLy8gICBhbnN3ZXI6IG1vdmluZyBpbnNpZGUgYW5zd2VyIGFyZWFcbiAgICAvLyAgIG1vdmluZzogbW92aW5nIG91dHNpZGUgYXJlYXNcbiAgICBtb3ZpbmdTdGF0ZSgpIHtcbiAgICAgICAgaWYgKHRoaXMubW92aW5nID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIFwicmVzdFwiO1xuICAgICAgICB9XG4gICAgICAgIHZhciB4ID0gdGhpcy5tb3ZpbmdYIC0gd2luZG93LnBhZ2VYT2Zmc2V0O1xuICAgICAgICB2YXIgeSA9IHRoaXMubW92aW5nWSAtIHdpbmRvdy5wYWdlWU9mZnNldDtcbiAgICAgICAgLy8gQ2hlY2sgaWYgaW4gYW5zd2VyIGFyZWFcbiAgICAgICAgdmFyIGJvdW5kcyA9IHRoaXMuYW5zd2VyQXJlYS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgeCA+PSBib3VuZHMubGVmdCAmJlxuICAgICAgICAgICAgeCA8PSBib3VuZHMucmlnaHQgJiZcbiAgICAgICAgICAgIHkgPj0gYm91bmRzLnRvcCAmJlxuICAgICAgICAgICAgeSA8PSBib3VuZHMuYm90dG9tXG4gICAgICAgICkge1xuICAgICAgICAgICAgcmV0dXJuIFwiYW5zd2VyXCI7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQ2hlY2sgaWYgaW4gc291cmNlIGFyZWFcbiAgICAgICAgYm91bmRzID0gdGhpcy5zb3VyY2VBcmVhLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICB4ID49IGJvdW5kcy5sZWZ0ICYmXG4gICAgICAgICAgICB4IDw9IGJvdW5kcy5yaWdodCAmJlxuICAgICAgICAgICAgeSA+PSBib3VuZHMudG9wICYmXG4gICAgICAgICAgICB5IDw9IGJvdW5kcy5ib3R0b21cbiAgICAgICAgKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJzb3VyY2VcIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gXCJtb3ZpbmdcIjtcbiAgICB9XG4gICAgLy8gQWJzb2x1dGVseSBwb3NpdGlvbiBhIGJsb2NrIG9yIGluZGljYXRvciB2aWV3IGluc2lkZSBpdHMgYXJlYVxuICAgIHBsYWNlVmlldyhlbCwgbGVmdCwgdG9wLCB3aWR0aCwgekluZGV4KSB7XG4gICAgICAgIGVsLnN0eWxlLmxlZnQgPSBsZWZ0ICsgXCJweFwiO1xuICAgICAgICBlbC5zdHlsZS50b3AgPSB0b3AgKyBcInB4XCI7XG4gICAgICAgIGVsLnN0eWxlLndpZHRoID0gd2lkdGggKyBcInB4XCI7XG4gICAgICAgIGVsLnN0eWxlLnpJbmRleCA9IHpJbmRleDtcbiAgICB9XG4gICAgLy8gVXBkYXRlIHRoZSBQYXJzb25zIHZpZXdcbiAgICAvLyBUaGlzIGdldHMgY2FsbGVkIHdoZW4gZHJhZ2dpbmcgYSBibG9ja1xuICAgIHVwZGF0ZVZpZXcoKSB7XG4gICAgICAgIC8vIEJhc2VkIG9uIHRoZSBuZXcgYW5kIHRoZSBvbGQgc3RhdGUsIGZpZ3VyZSBvdXQgd2hhdCB0byB1cGRhdGVcbiAgICAgICAgdmFyIHN0YXRlID0gdGhpcy5zdGF0ZTtcbiAgICAgICAgdmFyIG5ld1N0YXRlID0gdGhpcy5tb3ZpbmdTdGF0ZSgpO1xuICAgICAgICB2YXIgdXBkYXRlU291cmNlID0gdHJ1ZTtcbiAgICAgICAgdmFyIHVwZGF0ZUFuc3dlciA9IHRydWU7XG4gICAgICAgIHZhciB1cGRhdGVNb3ZpbmcgPSBuZXdTdGF0ZSA9PSBcIm1vdmluZ1wiO1xuICAgICAgICBpZiAoc3RhdGUgPT0gbmV3U3RhdGUpIHtcbiAgICAgICAgICAgIGlmIChuZXdTdGF0ZSA9PSBcInJlc3RcIikge1xuICAgICAgICAgICAgICAgIHVwZGF0ZVNvdXJjZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHVwZGF0ZUFuc3dlciA9IGZhbHNlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChuZXdTdGF0ZSA9PSBcInNvdXJjZVwiKSB7XG4gICAgICAgICAgICAgICAgdXBkYXRlQW5zd2VyID0gZmFsc2U7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG5ld1N0YXRlID09IFwiYW5zd2VyXCIpIHtcbiAgICAgICAgICAgICAgICB1cGRhdGVTb3VyY2UgPSBmYWxzZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobmV3U3RhdGUgPT0gXCJtb3ZpbmdcIikge1xuICAgICAgICAgICAgICAgIHVwZGF0ZUFuc3dlciA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHVwZGF0ZVNvdXJjZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciBtb3ZpbmdIZWlnaHQ7XG4gICAgICAgIGlmICh0aGlzLm1vdmluZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAvLyBNdXN0IGdldCBoZWlnaHQgaGVyZSBhcyBkZXRhY2hlZCBpdGVtcyBkb24ndCBoYXZlIGhlaWdodFxuICAgICAgICAgICAgbW92aW5nSGVpZ2h0ID0gb3V0ZXJIZWlnaHQodGhpcy5tb3Zpbmcudmlldyk7XG4gICAgICAgICAgICB0aGlzLm1vdmluZy52aWV3LnJlbW92ZSgpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBwb3NpdGlvblRvcCwgd2lkdGg7XG4gICAgICAgIHZhciBiYXNlV2lkdGggPSB0aGlzLmFyZWFXaWR0aCAtIDIyO1xuICAgICAgICAvLyBVcGRhdGUgdGhlIFNvdXJjZSBBcmVhXG4gICAgICAgIGlmICh1cGRhdGVTb3VyY2UpIHtcbiAgICAgICAgICAgIHBvc2l0aW9uVG9wID0gMDtcbiAgICAgICAgICAgIHZhciBibG9ja3MgPSB0aGlzLnNvdXJjZUJsb2NrcygpO1xuICAgICAgICAgICAgaWYgKG5ld1N0YXRlID09IFwic291cmNlXCIpIHtcbiAgICAgICAgICAgICAgICB2YXIgaGFzSW5zZXJ0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB2YXIgbW92aW5nQmluID0gdGhpcy5tb3ZpbmcucGFpcmVkQmluKCk7XG4gICAgICAgICAgICAgICAgdmFyIGJpbkZvckJsb2NrID0gW107XG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBiaW5Gb3JCbG9jay5wdXNoKGJsb2Nrc1tpXS5wYWlyZWRCaW4oKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghYmluRm9yQmxvY2suaW5jbHVkZXMobW92aW5nQmluKSkge1xuICAgICAgICAgICAgICAgICAgICBtb3ZpbmdCaW4gPSAtMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIGluc2VydFBvc2l0aW9ucyA9IFtdO1xuICAgICAgICAgICAgICAgIGlmIChiaW5Gb3JCbG9jay5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBpbnNlcnRQb3NpdGlvbnMucHVzaCgwKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAobW92aW5nQmluID09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnNlcnRQb3NpdGlvbnMucHVzaCgwKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChiaW5Gb3JCbG9ja1swXSA9PSBtb3ZpbmdCaW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydFBvc2l0aW9ucy5wdXNoKDApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGZvciAoaSA9IDE7IGkgPCBibG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChiaW5Gb3JCbG9ja1tpIC0gMV0gPT0gbW92aW5nQmluKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5zZXJ0UG9zaXRpb25zLnB1c2goaSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGJpbkZvckJsb2NrW2ldID09IG1vdmluZ0Jpbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydFBvc2l0aW9ucy5wdXNoKGkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb3ZpbmdCaW4gPT0gLTEgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiaW5Gb3JCbG9ja1tpIC0gMV0gIT0gYmluRm9yQmxvY2tbaV1cbiAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydFBvc2l0aW9ucy5wdXNoKGkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChtb3ZpbmdCaW4gPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydFBvc2l0aW9ucy5wdXNoKGJpbkZvckJsb2NrLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICBiaW5Gb3JCbG9ja1tiaW5Gb3JCbG9jay5sZW5ndGggLSAxXSA9PSBtb3ZpbmdCaW5cbiAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnNlcnRQb3NpdGlvbnMucHVzaChiaW5Gb3JCbG9jay5sZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciB4ID1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3ZpbmdYIC1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zb3VyY2VBcmVhLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQgLVxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cucGFnZVhPZmZzZXQgLVxuICAgICAgICAgICAgICAgICAgICBiYXNlV2lkdGggLyAyIC1cbiAgICAgICAgICAgICAgICAgICAgMTE7XG4gICAgICAgICAgICAgICAgdmFyIHkgPVxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmluZ1kgLVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNvdXJjZUFyZWEuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wIC1cbiAgICAgICAgICAgICAgICAgICAgd2luZG93LnBhZ2VZT2Zmc2V0O1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBibG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSBibG9ja3NbaV07XG4gICAgICAgICAgICAgICAgICAgIHZhciBqO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWhhc0luc2VydGVkICYmIGluc2VydFBvc2l0aW9ucy5pbmNsdWRlcyhpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRlc3RIZWlnaHQgPSBvdXRlckhlaWdodChpdGVtLnZpZXcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChqID0gaSArIDE7IGogPCBibG9ja3MubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5zZXJ0UG9zaXRpb25zLmluY2x1ZGVzKGopKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXN0SGVpZ2h0ICs9IG91dGVySGVpZ2h0KGJsb2Nrc1tqXS52aWV3KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB5IC0gcG9zaXRpb25Ub3AgPCBtb3ZpbmdIZWlnaHQgKyB0ZXN0SGVpZ2h0IC8gMiB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGkgPT0gaW5zZXJ0UG9zaXRpb25zW2luc2VydFBvc2l0aW9ucy5sZW5ndGggLSAxXVxuICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFzSW5zZXJ0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc291cmNlQXJlYS5pbnNlcnRCZWZvcmUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubW92aW5nLnZpZXcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0udmlldyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGxhY2VWaWV3KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmluZy52aWV3LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5IC0gbW92aW5nSGVpZ2h0IC8gMixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFzZVdpZHRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25Ub3AgPSBwb3NpdGlvblRvcCArIG1vdmluZ0hlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBsYWNlVmlldyhpdGVtLnZpZXcsIDAsIHBvc2l0aW9uVG9wLCBiYXNlV2lkdGgsIDIpO1xuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvblRvcCA9IHBvc2l0aW9uVG9wICsgb3V0ZXJIZWlnaHQoaXRlbS52aWV3KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFoYXNJbnNlcnRlZCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNvdXJjZUFyZWEuYXBwZW5kQ2hpbGQodGhpcy5tb3Zpbmcudmlldyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGxhY2VWaWV3KFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3ZpbmcudmlldyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHgsXG4gICAgICAgICAgICAgICAgICAgICAgICB5IC0gb3V0ZXJIZWlnaHQodGhpcy5tb3ZpbmcudmlldykgLyAyLFxuICAgICAgICAgICAgICAgICAgICAgICAgYmFzZVdpZHRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgMyxcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0gPSBibG9ja3NbaV07XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGxhY2VWaWV3KGl0ZW0udmlldywgMCwgcG9zaXRpb25Ub3AsIGJhc2VXaWR0aCwgMik7XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uVG9wID0gcG9zaXRpb25Ub3AgKyBvdXRlckhlaWdodChpdGVtLnZpZXcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFVwZGF0ZSB0aGUgUGFpcmVkIERpc3RyYWN0b3IgSW5kaWNhdG9yc1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMucGFpcmVkQmlucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBiaW4gPSB0aGlzLnBhaXJlZEJpbnNbaV07XG4gICAgICAgICAgICAgICAgdmFyIG1hdGNoaW5nID0gW107XG4gICAgICAgICAgICAgICAgZm9yIChqID0gMDsgaiA8IGJsb2Nrcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICBibG9jayA9IGJsb2Nrc1tqXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJsb2NrLm1hdGNoZXNCaW4oYmluKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2hpbmcucHVzaChibG9jayk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIGRpdiA9IHRoaXMucGFpcmVkRGl2c1tpXTtcbiAgICAgICAgICAgICAgICBpZiAobWF0Y2hpbmcubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgZGl2LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBkaXYuc3R5bGUuZGlzcGxheSA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgIHZhciBoZWlnaHQgPSAtNTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxhc3RWaWV3ID0gbWF0Y2hpbmdbbWF0Y2hpbmcubGVuZ3RoIC0gMV0udmlldztcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0ICs9IHBhcnNlSW50KGdldENvbXB1dGVkU3R5bGUobGFzdFZpZXcpLnRvcCk7XG4gICAgICAgICAgICAgICAgICAgIGhlaWdodCAtPSBwYXJzZUludChnZXRDb21wdXRlZFN0eWxlKG1hdGNoaW5nWzBdLnZpZXcpLnRvcCk7XG4gICAgICAgICAgICAgICAgICAgIGhlaWdodCArPSBvdXRlckhlaWdodChsYXN0Vmlldyk7XG4gICAgICAgICAgICAgICAgICAgIGRpdi5zdHlsZS5sZWZ0ID0gXCItNnB4XCI7XG4gICAgICAgICAgICAgICAgICAgIGRpdi5zdHlsZS50b3AgPSBnZXRDb21wdXRlZFN0eWxlKG1hdGNoaW5nWzBdLnZpZXcpLnRvcDtcbiAgICAgICAgICAgICAgICAgICAgZGl2LnN0eWxlLndpZHRoID0gYmFzZVdpZHRoICsgMzQgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgICAgIGRpdi5zdHlsZS5oZWlnaHQgPSBoZWlnaHQgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgICAgIGRpdi5zdHlsZS56SW5kZXggPSAxO1xuICAgICAgICAgICAgICAgICAgICBkaXYuc3R5bGUudGV4dEluZGVudCA9IFwiLTMwcHhcIjtcbiAgICAgICAgICAgICAgICAgICAgZGl2LnN0eWxlLnBhZGRpbmdUb3AgPSAoaGVpZ2h0IC0gNzApIC8gMiArIFwicHhcIjtcbiAgICAgICAgICAgICAgICAgICAgZGl2LnN0eWxlLm92ZXJmbG93ID0gXCJ2aXNpYmxlXCI7XG4gICAgICAgICAgICAgICAgICAgIGRpdi5zdHlsZS5mb250U2l6ZSA9IFwiNDNweFwiO1xuICAgICAgICAgICAgICAgICAgICBkaXYuc3R5bGUudmVydGljYWxBbGlnbiA9IFwibWlkZGxlXCI7XG4gICAgICAgICAgICAgICAgICAgIGRpdi5zdHlsZS5jb2xvciA9IFwidmFyKC0tcGFyc29uc0xhYmVsQ29sb3IsICM1ODU4ZTApXCI7XG4gICAgICAgICAgICAgICAgICAgIGRpdi5pbm5lckhUTUwgPVxuICAgICAgICAgICAgICAgICAgICAgICAgXCI8c3BhbiBpZD0gJ3N0JyBzdHlsZSA9ICd2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlOyBmb250LXdlaWdodDogYm9sZDsgZm9udC1zaXplOiAxNXB4Jz5vcjwvc3Bhbj57XCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChtYXRjaGluZy5sZW5ndGggPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBkaXYuaW5uZXJIVE1MID0gXCJcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gVXBkYXRlIHRoZSBBbnN3ZXIgQXJlYVxuICAgICAgICBpZiAodXBkYXRlQW5zd2VyKSB7XG4gICAgICAgICAgICB2YXIgYmxvY2ssIGluZGVudDtcbiAgICAgICAgICAgIHBvc2l0aW9uVG9wID0gMDtcbiAgICAgICAgICAgIHdpZHRoID1cbiAgICAgICAgICAgICAgICB0aGlzLmFyZWFXaWR0aCArXG4gICAgICAgICAgICAgICAgdGhpcy5pbmRlbnQgKiB0aGlzLm9wdGlvbnMucGl4ZWxzUGVySW5kZW50IC1cbiAgICAgICAgICAgICAgICAyMjtcbiAgICAgICAgICAgIHZhciBibG9ja3MgPSB0aGlzLmFuc3dlckJsb2NrcygpO1xuICAgICAgICAgICAgaWYgKG5ld1N0YXRlID09IFwiYW5zd2VyXCIpIHtcbiAgICAgICAgICAgICAgICB2YXIgaGFzSW5zZXJ0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB2YXIgeCA9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubW92aW5nWCAtXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYW5zd2VyQXJlYS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0IC1cbiAgICAgICAgICAgICAgICAgICAgd2luZG93LnBhZ2VYT2Zmc2V0IC1cbiAgICAgICAgICAgICAgICAgICAgYmFzZVdpZHRoIC8gMiAtXG4gICAgICAgICAgICAgICAgICAgIDExO1xuICAgICAgICAgICAgICAgIHZhciBtb3ZpbmdJbmRlbnQgPSBNYXRoLnJvdW5kKHggLyB0aGlzLm9wdGlvbnMucGl4ZWxzUGVySW5kZW50KTtcbiAgICAgICAgICAgICAgICBpZiAobW92aW5nSW5kZW50IDwgMCkge1xuICAgICAgICAgICAgICAgICAgICBtb3ZpbmdJbmRlbnQgPSAwO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobW92aW5nSW5kZW50ID4gdGhpcy5pbmRlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgbW92aW5nSW5kZW50ID0gdGhpcy5pbmRlbnQ7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgeCA9IG1vdmluZ0luZGVudCAqIHRoaXMub3B0aW9ucy5waXhlbHNQZXJJbmRlbnQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciB5ID1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3ZpbmdZIC1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hbnN3ZXJBcmVhLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCAtXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5wYWdlWU9mZnNldDtcbiAgICAgICAgICAgICAgICB0aGlzLm1vdmluZy5pbmRlbnQgPSBtb3ZpbmdJbmRlbnQ7XG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBibG9jayA9IGJsb2Nrc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFoYXNJbnNlcnRlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHkgLSBwb3NpdGlvblRvcCA8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKG1vdmluZ0hlaWdodCArIG91dGVySGVpZ2h0KGJsb2NrLnZpZXcpKSAvIDJcbiAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhc0luc2VydGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFuc3dlckFyZWEuaW5zZXJ0QmVmb3JlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmluZy52aWV3LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBibG9jay52aWV3LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbGFjZVZpZXcoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubW92aW5nLnZpZXcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHkgLSBtb3ZpbmdIZWlnaHQgLyAyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYXNlV2lkdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvblRvcCA9IHBvc2l0aW9uVG9wICsgbW92aW5nSGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGluZGVudCA9IGJsb2NrLmluZGVudCAqIHRoaXMub3B0aW9ucy5waXhlbHNQZXJJbmRlbnQ7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGxhY2VWaWV3KFxuICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2sudmlldyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uVG9wLFxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGggLSBpbmRlbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAyLFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvblRvcCA9IHBvc2l0aW9uVG9wICsgb3V0ZXJIZWlnaHQoYmxvY2sudmlldyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghaGFzSW5zZXJ0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hbnN3ZXJBcmVhLmFwcGVuZENoaWxkKHRoaXMubW92aW5nLnZpZXcpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBsYWNlVmlldyhcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubW92aW5nLnZpZXcsXG4gICAgICAgICAgICAgICAgICAgICAgICB4LFxuICAgICAgICAgICAgICAgICAgICAgICAgeSAtIG91dGVySGVpZ2h0KHRoaXMubW92aW5nLnZpZXcpIC8gMixcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhc2VXaWR0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgIDMsXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBibG9jayA9IGJsb2Nrc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgaW5kZW50ID0gYmxvY2suaW5kZW50ICogdGhpcy5vcHRpb25zLnBpeGVsc1BlckluZGVudDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbGFjZVZpZXcoXG4gICAgICAgICAgICAgICAgICAgICAgICBibG9jay52aWV3LFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25Ub3AsXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aCAtIGluZGVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgIDIsXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uVG9wID0gcG9zaXRpb25Ub3AgKyBvdXRlckhlaWdodChibG9jay52aWV3KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gVXBkYXRlIHRoZSBNb3ZpbmcgQXJlYVxuICAgICAgICBpZiAodXBkYXRlTW92aW5nKSB7XG4gICAgICAgICAgICAvLyBBZGQgaXQgdG8gdGhlIGxvd2VzdCBwbGFjZSBpbiB0aGUgc291cmNlIGFyZWFcbiAgICAgICAgICAgIG1vdmluZ0JpbiA9IHRoaXMubW92aW5nLnBhaXJlZEJpbigpO1xuICAgICAgICAgICAgaWYgKG1vdmluZ0JpbiA9PSAtMSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc291cmNlQXJlYS5hcHBlbmRDaGlsZCh0aGlzLm1vdmluZy52aWV3KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGJlZm9yZTtcbiAgICAgICAgICAgICAgICBibG9ja3MgPSB0aGlzLnNvdXJjZUJsb2NrcztcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgYmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGJsb2NrID0gYmxvY2tzW2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYmxvY2sucGFpcmVkQmluKCkgPT0gbW92aW5nQmluKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBiZWZvcmUgPSBpICsgMTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoYmVmb3JlID09IHVuZGVmaW5lZCB8fCBiZWZvcmUgPT0gYmxvY2tzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNvdXJjZUFyZWEuYXBwZW5kQ2hpbGQodGhpcy5tb3Zpbmcudmlldyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zb3VyY2VBcmVhLmluc2VydEJlZm9yZShcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubW92aW5nLnZpZXcsXG4gICAgICAgICAgICAgICAgICAgICAgICBibG9ja3NbYmVmb3JlXS52aWV3LFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFBsYWNlIGluIHRoZSBtaWRkbGUgb2YgdGhlIG1vdXNlIGN1cnNvclxuICAgICAgICAgICAgdGhpcy5wbGFjZVZpZXcoXG4gICAgICAgICAgICAgICAgdGhpcy5tb3ZpbmcudmlldyxcbiAgICAgICAgICAgICAgICB0aGlzLm1vdmluZ1ggLVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNvdXJjZUFyZWEuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdCAtXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5wYWdlWE9mZnNldCAtXG4gICAgICAgICAgICAgICAgICAgIG91dGVyV2lkdGgodGhpcy5tb3ZpbmcudmlldykgLyAyLFxuICAgICAgICAgICAgICAgIHRoaXMubW92aW5nWSAtXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc291cmNlQXJlYS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgLVxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cucGFnZVlPZmZzZXQgLVxuICAgICAgICAgICAgICAgICAgICBtb3ZpbmdIZWlnaHQgLyAyLFxuICAgICAgICAgICAgICAgIGJhc2VXaWR0aCxcbiAgICAgICAgICAgICAgICAzLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICBzdGF0ZSA9IG5ld1N0YXRlO1xuICAgICAgICB0aGlzLnN0YXRlID0gc3RhdGU7XG4gICAgfVxuICAgIGFkZEJsb2NrTGFiZWxzKGJsb2Nrcykge1xuICAgICAgICB2YXIgYmluID0gLTE7XG4gICAgICAgIHZhciBiaW5Db3VudCA9IDA7XG4gICAgICAgIHZhciBiaW5DaGlsZHJlbiA9IDA7XG4gICAgICAgIHZhciBibG9ja3NOb3RJbkJpbnMgPSAwO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGJsb2Nrc1tpXS5wYWlyZWRCaW4oKSA9PSAtMSkge1xuICAgICAgICAgICAgICAgIGJsb2Nrc05vdEluQmlucysrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgY3VycmVudEJpbiA9IGJsb2Nrc1tpXS5wYWlyZWRCaW4oKTtcbiAgICAgICAgICAgIGlmIChjdXJyZW50QmluID09IC0xIHx8IGN1cnJlbnRCaW4gIT0gYmluKSB7XG4gICAgICAgICAgICAgICAgYmluID0gY3VycmVudEJpbjtcbiAgICAgICAgICAgICAgICBiaW5DaGlsZHJlbiA9IDA7XG4gICAgICAgICAgICAgICAgYmluQ291bnQrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBsYWJlbCA9XG4gICAgICAgICAgICAgICAgXCJcIiArXG4gICAgICAgICAgICAgICAgYmluQ291bnQgK1xuICAgICAgICAgICAgICAgIChjdXJyZW50QmluICE9IC0xXG4gICAgICAgICAgICAgICAgICAgID8gU3RyaW5nLmZyb21DaGFyQ29kZSg5NyArIGJpbkNoaWxkcmVuKVxuICAgICAgICAgICAgICAgICAgICA6IFwiIFwiKTtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBiaW5Db3VudCA8IDEwICYmXG4gICAgICAgICAgICAgICAgYmxvY2tzTm90SW5CaW5zICsgdGhpcy5wYWlyZWRCaW5zLmxlbmd0aCA+PSAxMFxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgbGFiZWwgKz0gXCIgXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBibG9ja3NbaV0uYWRkTGFiZWwobGFiZWwsIDApO1xuICAgICAgICAgICAgYmluQ2hpbGRyZW4rKztcbiAgICAgICAgfVxuICAgICAgICBpZiAoYmxvY2tzTm90SW5CaW5zICsgdGhpcy5wYWlyZWRCaW5zLmxlbmd0aCA+PSAxMCkge1xuICAgICAgICAgICAgdGhpcy5hcmVhV2lkdGggKz0gNTtcbiAgICAgICAgICAgIHRoaXMuc291cmNlQXJlYS5zdHlsZS53aWR0aCA9XG4gICAgICAgICAgICAgICAgKHBhcnNlRmxvYXQoZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLnNvdXJjZUFyZWEpLndpZHRoKSB8fCAwKSArXG4gICAgICAgICAgICAgICAgNSArXG4gICAgICAgICAgICAgICAgXCJweFwiO1xuICAgICAgICAgICAgdGhpcy5hbnN3ZXJBcmVhLnN0eWxlLndpZHRoID1cbiAgICAgICAgICAgICAgICAocGFyc2VGbG9hdChnZXRDb21wdXRlZFN0eWxlKHRoaXMuYW5zd2VyQXJlYSkud2lkdGgpIHx8IDApICtcbiAgICAgICAgICAgICAgICA1ICtcbiAgICAgICAgICAgICAgICBcInB4XCI7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gUHV0IGFsbCB0aGUgYmxvY2tzIGJhY2sgaW50byB0aGUgc291cmNlIGFyZWEsIHJlc2h1ZmZsaW5nIGFzIG5lY2Vzc2FyeVxuICAgIGFzeW5jIHJlc2V0VmlldygpIHtcbiAgICAgICAgLy8gQ2xlYXIgZXZlcnl0aGluZ1xuICAgICAgICB0aGlzLmNsZWFyRmVlZGJhY2soKTtcbiAgICAgICAgLy8gQ29kZVRhaWxvcjogSGlkZSB0aGUgQ29weSBBbnN3ZXIgQnV0dG9uIGFnYWluXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2NhZmZvbGRpbmcgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGNvbnN0IGNvcHlCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICAgICAgICAgIGAjY29weS1hbnN3ZXItYnV0dG9uLSR7dGhpcy5kaXZpZH1gLFxuICAgICAgICAgICAgKTsgLy8gY29weS1hbnN3ZXItYnV0dG9uLSR7cHV6emxlU2NhZmZvbGRpbmdEaXZpZH1cbiAgICAgICAgICAgIGlmIChjb3B5QnRuKSB7XG4gICAgICAgICAgICAgICAgY29weUJ0bi5jbGFzc0xpc3QuYWRkKFwiY29weS1idXR0b24taGlkZVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgc2Nyb2xsVG9wID0gZG9jdW1lbnQuYm9keS5zY3JvbGxUb3A7XG4gICAgICAgIHZhciBibG9jaztcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYmxvY2sgPSB0aGlzLmJsb2Nrc1tpXTtcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgYmxvY2subGluZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgY2hpbGRyZW4gPVxuICAgICAgICAgICAgICAgICAgICBibG9jay5saW5lc1tqXS52aWV3LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuYmxvY2stbGFiZWxcIik7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgYyA9IDA7IGMgPCBjaGlsZHJlbi5sZW5ndGg7IGMrKykge1xuICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbltjXS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBibG9jay5kZXN0cm95KCk7XG4gICAgICAgICAgICB0aGlzLmJsb2Nrc1tpXS52aWV3LnJlbW92ZSgpO1xuICAgICAgICB9XG4gICAgICAgIGRlbGV0ZSB0aGlzLmJsb2NrcztcbiAgICAgICAgdGhpcy5ibG9ja0luZGV4ID0gMDtcbiAgICAgICAgaWYgKHRoaXMucGFpcmVkRGl2cykge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBhaXJlZERpdnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBhaXJlZERpdnNbaV0ucmVtb3ZlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zb3VyY2VBcmVhLnNldEF0dHJpYnV0ZShcInN0eWxlXCIsIFwiXCIpO1xuICAgICAgICB0aGlzLmFuc3dlckFyZWEuY2xhc3NOYW1lID0gXCJcIjtcbiAgICAgICAgdGhpcy5hbnN3ZXJBcmVhLnNldEF0dHJpYnV0ZShcInN0eWxlXCIsIFwiXCIpO1xuICAgICAgICB0aGlzLm5vaW5kZW50ID0gdGhpcy5vcHRpb25zLm5vaW5kZW50O1xuICAgICAgICAvLyBSZWluaXRpYWxpemVcbiAgICAgICAgaWYgKHRoaXMuaGFzU29sdmVkKSB7XG4gICAgICAgICAgICB0aGlzLmNoZWNrQ291bnQgPSAwO1xuICAgICAgICAgICAgdGhpcy5udW1EaXN0aW5jdCA9IDA7XG4gICAgICAgICAgICB0aGlzLmhhc1NvbHZlZCA9IGZhbHNlO1xuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5hZGFwdGl2ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY2FuSGVscCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvL3RoaXMuaGVscENvdW50ID0gLTM7IC8vIGVuYWJsZSBhZnRlciAzIGZhaWxlZCBhdHRlbXB0c1xuICAgICAgICAgICAgLy90aGlzLmhlbHBCdXR0b24uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0odGhpcy5hZGFwdGl2ZUlkICsgXCJQcm9ibGVtXCIsIHRoaXMuZGl2aWQpO1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXG4gICAgICAgICAgICAgICAgdGhpcy5hZGFwdGl2ZUlkICsgdGhpcy5kaXZpZCArIFwiQ291bnRcIixcbiAgICAgICAgICAgICAgICB0aGlzLmNoZWNrQ291bnQsXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0odGhpcy5hZGFwdGl2ZUlkICsgXCJTb2x2ZWRcIiwgZmFsc2UpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2NhZmZvbGRpbmcgPT09IHRydWUpIHtcbiAgICAgICAgICAgIC8vIENvZGVUYWlsb3I6IGluaXRpYWxpemUgdGhlIHByZS1wbGFjZWQgUGFyc29ucyBibG9ja3MgaW5jbHVkaW5nIHRoZSBzZXR0bGVkIGJsb2NrcywgaWYgYW55LlxuICAgICAgICAgICAgYXdhaXQgdGhpcy5pbml0aWFsaXplQXJlYXMoXG4gICAgICAgICAgICAgICAgdGhpcy5ibG9ja3NGcm9tU291cmNlKCksXG4gICAgICAgICAgICAgICAgdGhpcy5zZXR0bGVkQmxvY2tzRnJvbVNvdXJjZSgpLFxuICAgICAgICAgICAgICAgIHt9LFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuaW5pdGlhbGl6ZUFyZWFzKHRoaXMuYmxvY2tzRnJvbVNvdXJjZSgpLCBbXSwge30pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZUludGVyYWN0aXZpdHkoKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5zY3JvbGxUb3AgPSBzY3JvbGxUb3A7XG4gICAgICAgIGlmICh0aGlzLnJ1bm5hYmxlRGl2KSB7XG4gICAgICAgICAgICAvLyBoaWRlIHRoZSByZW5kZXJlZCBydW5uYWJsZSAtIHdpbGwgZ2V0IHJldXNlZCBhcyBpcyBpZiByZXJldmVhbGVkXG4gICAgICAgICAgICB0aGlzLnJ1bm5hYmxlRGl2LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuUGFyc29ucy5jb3VudGVyID0gMDtcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInJ1bmVzdG9uZTpsb2dpbi1jb21wbGV0ZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgZm9yIChjb25zdCBlbCBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiW2RhdGEtY29tcG9uZW50PXBhcnNvbnNdXCIpKSB7XG4gICAgICAgIGlmIChlbC5jbG9zZXN0KFwiW2RhdGEtY29tcG9uZW50PXRpbWVkQXNzZXNzbWVudF1cIikgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgd2luZG93LmNvbXBvbmVudE1hcFtlbC5pZF0gPSBuZXcgUGFyc29ucyh7XG4gICAgICAgICAgICAgICAgICAgIG9yaWc6IGVsLFxuICAgICAgICAgICAgICAgICAgICB1c2VSdW5lc3RvbmVTZXJ2aWNlczogZUJvb2tDb25maWcudXNlUnVuZXN0b25lU2VydmljZXMsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgRXJyb3IgcmVuZGVyaW5nIFBhcnNvbnMgUHJvYmxlbSAke2VsLmlkfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBEZXRhaWxzOiAke2Vycn1gKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIuc3RhY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSk7XG4iLCJpbXBvcnQgUGFyc29ucyBmcm9tIFwiLi9wYXJzb25zXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRpbWVkUGFyc29ucyBleHRlbmRzIFBhcnNvbnMge1xuICAgIGNvbnN0cnVjdG9yKG9wdHMpIHtcbiAgICAgICAgc3VwZXIob3B0cyk7XG4gICAgICAgIC8vIHRvZG8gLS0gbWFrZSB0aGlzIGNvbmZpZ3VyYWJsZVxuICAgICAgICBpZiAob3B0cy50aW1lZGZlZWRiYWNrKSB7XG4gICAgICAgICAgICB0aGlzLnNob3dmZWVkYmFjayA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnNob3dmZWVkYmFjayA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZ3JhZGVyLnNob3dmZWVkYmFjayA9IHRoaXMuc2hvd2ZlZWRiYWNrO1xuICAgICAgICB0aGlzLmhpZGVGZWVkYmFjaygpO1xuICAgICAgICB0aGlzLmNoZWNrQnV0dG9uLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgaWYgKHRoaXMuaGVscEJ1dHRvbikge1xuICAgICAgICAgICAgdGhpcy5oZWxwQnV0dG9uLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlc2V0QnV0dG9uLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICB9XG4gICAgY2hlY2tDb3JyZWN0VGltZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvcnJlY3QgPyBcIlRcIiA6IFwiRlwiO1xuICAgIH1cbiAgICBoaWRlRmVlZGJhY2soKSB7XG4gICAgICAgIHRoaXMubWVzc2FnZURpdi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgfVxufVxuXG5pZiAodHlwZW9mIHdpbmRvdy5jb21wb25lbnRfZmFjdG9yeSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHdpbmRvdy5jb21wb25lbnRfZmFjdG9yeSA9IHt9O1xufVxud2luZG93LmNvbXBvbmVudF9mYWN0b3J5W1wicGFyc29uc1wiXSA9IGZ1bmN0aW9uIChvcHRzKSB7XG4gICAgaWYgKG9wdHMudGltZWQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBUaW1lZFBhcnNvbnMob3B0cyk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgUGFyc29ucyhvcHRzKTtcbn07XG4iLCJpbXBvcnQgUGFyc29uc0Jsb2NrIGZyb20gXCIuL3BhcnNvbnNCbG9ja1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZXR0bGVkQmxvY2sgZXh0ZW5kcyBQYXJzb25zQmxvY2sge1xuICAgIGNvbnN0cnVjdG9yKHByb2JsZW0sIGxpbmVzKSB7XG4gICAgICAgIC8vIHByb2JsZW06IFBhcnNvbnMgaW5zdGFuY2VcbiAgICAgICAgLy8gbGluZXM6IGxpbmVzIGluc2lkZSB0aGUgYmxvY2tcbiAgICAgICAgc3VwZXIocHJvYmxlbSwgbGluZXMpO1xuXG4gICAgICAgIHRoaXMuaXNTZXR0bGVkID0gdHJ1ZTtcbiAgICAgICAgLy91cGRhdGUgaXRzIGluZGVudCB0byBmb2xsb3cgdGhlIGluZGVudGF0aW9uIG9mIHRoZSBsaW5lcyBpbnNpZGVcblxuICAgICAgICAvLyBhZGQgYSBjc3MgY2xhc3NcbiAgICAgICAgdGhpcy52aWV3LmNsYXNzTGlzdC5hZGQoXCJzZXR0bGVkLWJsb2NrXCIsIFwiZGlzYWJsZWRcIik7XG5cbiAgICAgICAgdGhpcy50b29sdGlwU3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgICAgICB0aGlzLnRvb2x0aXBTcGFuLmNsYXNzTGlzdC5hZGQoXCJzZXR0bGVkLXRvb2x0aXBcIik7XG4gICAgICAgIHRoaXMudmlldy5hcHBlbmQodGhpcy50b29sdGlwU3Bhbik7XG4gICAgICAgIHRoaXMudG9vbHRpcFNwYW4udGV4dENvbnRlbnQgPSBcIk9LXCI7XG4gICAgfVxuXG4gICAgc2V0QmxvY2tzQmVmb3JlKG51bSkge1xuICAgICAgICB0aGlzLmJsb2Nrc0JlZm9yZSA9IG51bTtcbiAgICAgICAgdmFyIGJlZm9yZVBsdXJhbCA9IG51bSA+IDEgPyBcInNcIiA6IFwiXCI7XG4gICAgICAgIGlmICh0aGlzLmJsb2Nrc0FmdGVyKSB7XG4gICAgICAgICAgICB2YXIgYWZ0ZXJQbHVyYWwgPSB0aGlzLmJsb2Nrc0FmdGVyID4gMSA/IFwic1wiIDogXCJcIjtcbiAgICAgICAgICAgIHRoaXMudG9vbHRpcFNwYW4uaW5uZXJIVE1MID0gYCR7bnVtfSBibG9jayR7YmVmb3JlUGx1cmFsfSDirIbvuI/vuI8pLCAke3RoaXMuYmxvY2tzQWZ0ZXJ9IGJsb2NrJHthZnRlclBsdXJhbH0g4qyH77iPYDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudG9vbHRpcFNwYW4uaW5uZXJIVE1MID0gYCR7bnVtfSBibG9jayR7YmVmb3JlUGx1cmFsfSDirIbvuI/vuI9gO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0QmxvY2tzQWZ0ZXIobnVtKSB7XG4gICAgICAgIHRoaXMuYmxvY2tzQWZ0ZXIgPSBudW07XG4gICAgICAgIHZhciBhZnRlclBsdXJhbCA9IG51bSA+IDEgPyBcInNcIiA6IFwiXCI7XG4gICAgICAgIGlmICh0aGlzLmJsb2Nrc0JlZm9yZSkge1xuICAgICAgICAgICAgdmFyIGJlZm9yZVBsdXJhbCA9IHRoaXMuYmxvY2tzQmVmb3JlID4gMSA/IFwic1wiIDogXCJcIjtcbiAgICAgICAgICAgIHRoaXMudG9vbHRpcFNwYW4uaW5uZXJIVE1MID0gYCR7dGhpcy5ibG9ja3NCZWZvcmV9IGJsb2NrJHtiZWZvcmVQbHVyYWx9IOKshu+4jywgJHtudW19IGJsb2NrJHthZnRlclBsdXJhbH0g4qyH77iPYDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudG9vbHRpcFNwYW4uaW5uZXJIVE1MID0gYCR7bnVtfSBibG9jayR7YWZ0ZXJQbHVyYWx9IO+4j++4j+Ksh++4j2A7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCIvKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09PT0gUGFyc29uc0xpbmUgT2JqZWN0ID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT09PT09PT0gVGhlIG1vZGVsIGFuZCB2aWV3IG9mIGEgbGluZSBvZiBjb2RlLlxuPT09PT09PT0gQmFzZWQgb24gd2hhdCBpcyBzcGVjaWZpZWQgaW4gdGhlIHByb2JsZW0uXG49PT09PT09PSBQYXJzb25CbG9jayBvYmplY3RzIGhhdmUgb25lIG9yIG1vcmUgb2YgdGhlc2UuXG49PT09IFBST1BFUlRJRVMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09PT09PT09IHByb2JsZW06IHRoZSBQYXJzb25zIHByb2JsZW1cbj09PT09PT09IGluZGV4OiB0aGUgaW5kZXggb2YgdGhlIGxpbmUgaW4gdGhlIHByb2JsZW1cbj09PT09PT09IHRleHQ6IHRoZSB0ZXh0IG9mIHRoZSBjb2RlIGxpbmVcbj09PT09PT09IGluZGVudDogdGhlIGluZGVudCBsZXZlbFxuPT09PT09PT0gdmlldzogYW4gZWxlbWVudCBmb3Igdmlld2luZyB0aGlzIG9iamVjdFxuPT09PT09PT0gZGlzdHJhY3Rvcjogd2hldGhlciBpdCBpcyBhIGRpc3RyYWN0b3Jcbj09PT09PT09IHBhaXJlZDogd2hldGhlciBpdCBpcyBhIHBhaXJlZCBkaXN0cmFjdG9yXG49PT09PT09PSBncm91cFdpdGhOZXh0OiB3aGV0aGVyIGl0IGlzIGdyb3VwZWQgd2l0aCB0aGUgZm9sbG93aW5nIGxpbmVcbj09PT09PT09IHdpZHRoOiB0aGUgcGl4ZWwgd2lkdGggd2hlbiByZW5kZXJlZFxuPT09PT09PT09PT09IGluIHRoZSBpbml0aWFsIGdyb3VwaW5nXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbi8vIEluaXRpYWxpemUgZnJvbSBjb2Rlc3RyaW5nXG5cbmltcG9ydCB7IG91dGVyV2lkdGggfSBmcm9tIFwiLi4vLi4vY29tbW9uL2pzL2RvbXV0aWwuanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGFyc29uc0xpbmUge1xuICAgIGNvbnN0cnVjdG9yKHByb2JsZW0sIGNvZGVzdHJpbmcsIGRpc3BsYXltYXRoKSB7XG4gICAgICAgIHRoaXMucHJvYmxlbSA9IHByb2JsZW07XG4gICAgICAgIHRoaXMuaW5kZXggPSBwcm9ibGVtLmxpbmVzLmxlbmd0aDtcbiAgICAgICAgLy8gcmVtb3ZlcyB0cmFpbGluZyB3aGl0ZXNwYWNlXG4gICAgICAgIHZhciB0cmltbWVkID0gY29kZXN0cmluZy5yZXBsYWNlKC9cXHMqJC8sIFwiXCIpO1xuICAgICAgICAvLyBDb2RlVGFpbG9yOiBBY3Rpb25zIGFyZSByZXF1aXJlZCBvbmx5IGlmIHRoZSBwdXp6bGUgd2VsbCBiZSBzZXJ2ZWQgYXMgc2NhZmZvbGRpbmcgcHV6emxlIGluIENvZGVUYWlsb3JcbiAgICAgICAgLy8gU28gaGVyZSB3ZSB1c2UgcHJvYmxlbS5vcHRpb25zLnNjYWZmb2xkaW5nIHRvIGRldGVybWluZSBpZiB0aGUgcHV6emxlIGlzIGEgc2NhZmZvbGRpbmcgcHV6emxlXG4gICAgICAgIGlmICh0aGlzLnByb2JsZW0ub3B0aW9ucy5zY2FmZm9sZGluZyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgZnVuY3Rpb24gaGFzVG9wTGV2ZWxDbGFzcyhsaW5lcykge1xuICAgICAgICAgICAgICAgIHJldHVybiBsaW5lcy5zb21lKFxuICAgICAgICAgICAgICAgICAgICAoeyB0ZXh0IH0pID0+XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0LnRyaW1TdGFydCgpLnRvTG93ZXJDYXNlKCkuc3RhcnRzV2l0aChcImNsYXNzIFwiKSwgLy8gbm93IGNoZWNrIGZvciDigJxjbGFzcyDigJ0gYXQgcG9zaXRpb24gMFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5wcm9ibGVtLm5vaW5kZW50KSB7XG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0ID0gdHJpbW1lZDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gcmVtb3ZlIGFueSBsZWFkaW5nIHdoaXRlc3BhY2VcbiAgICAgICAgICAgICAgICB0aGlzLnRleHQgPSB0cmltbWVkLnJlcGxhY2UoL15cXHMqLywgXCJcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLnByb2JsZW0ub3B0aW9ucy5sYW5ndWFnZSA9PSBcImphdmFcIikge1xuICAgICAgICAgICAgICAgIHRoaXMudGV4dCA9IHRoaXMudGV4dC5yZXBsYWNlKC9cXHQvZywgXCIgICAgXCIpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnRleHQudG9Mb3dlckNhc2UoKS5zdGFydHNXaXRoKFwicHVibGljIGNsYXNzXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5kZW50ID0gMDsgLy8gU2V0IGluZGVudCB0byAwIGZvciBjbGFzcyBzdGFydFxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5kZW50ID0gdHJpbW1lZC5sZW5ndGggLSB0aGlzLnRleHQubGVuZ3RoOyAvLyBDYWxjdWxhdGUgbm9ybWFsIGluZGVudGF0aW9uXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBhbGxMaW5lcyA9IHRoaXMucHJvYmxlbS5saW5lcztcbiAgICAgICAgICAgICAgICAvLyBwdXQgaW5kZW50YXRpb24gb2YgaW1wb3J0IGxpbmUgYXMgMFxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnRleHQudG9Mb3dlckNhc2UoKS5zdGFydHNXaXRoKFwiaW1wb3J0XCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5kZW50ID0gMDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBDaGVjayBpZiB0aGUgbGluZSBpcyBhIGNsYXNzIGRlZmluaXRpb24gLSBpZiBzbywgdGhlbiBkbyBub3Qgc2V0IHVwIGluZGVudGF0aW9uIG9mIGRlZiBsaW5lIGFzIDBcbiAgICAgICAgICAgICAgICBpZiAoaGFzVG9wTGV2ZWxDbGFzcyhhbGxMaW5lcykpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMudGV4dC50b0xvd2VyQ2FzZSgpLnN0YXJ0c1dpdGgoXCJjbGFzc1wiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbmRlbnQgPSAwOyAvLyBTZXQgaW5kZW50IHRvIDAgZm9yIGNsYXNzIHN0YXJ0XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmluZGVudCA9IHRyaW1tZWQubGVuZ3RoIC0gdGhpcy50ZXh0Lmxlbmd0aDsgLy8gQ2FsY3VsYXRlIG5vcm1hbCBpbmRlbnRhdGlvblxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIGxpbmUgaXMgYSBmdW5jdGlvbiBkZWZpbml0aW9uIC0gaWYgc28sIHRoZW4gc2V0IHVwIGluZGVudGF0aW9uIG9mIGRlZiBsaW5lIGFzIDBcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMudGV4dC50b0xvd2VyQ2FzZSgpLnN0YXJ0c1dpdGgoXCJkZWZcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5kZW50ID0gMDsgLy8gU2V0IGluZGVudCB0byAwIGZvciBkZWYgc3RhcnRcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5kZW50ID0gdHJpbW1lZC5sZW5ndGggLSB0aGlzLnRleHQubGVuZ3RoOyAvLyBDYWxjdWxhdGUgbm9ybWFsIGluZGVudGF0aW9uXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnRleHQgPSB0cmltbWVkLnJlcGxhY2UoL15cXHMqLywgXCJcIik7XG4gICAgICAgICAgICB0aGlzLmluZGVudCA9IHRyaW1tZWQubGVuZ3RoIC0gdGhpcy50ZXh0Lmxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgICAvLyBDcmVhdGUgdGhlIFZpZXdcbiAgICAgICAgdmFyIHZpZXc7XG4gICAgICAgIC8vIFRPRE86IHRoaXMgZG9lcyBub3Qgd29yayB3aXRoIGRpc3BsYXkgbWF0aC4uLiBQZXJoYXBzIHdpdGggcHJldGV4dCB3ZSBzaG91bGQgaGF2ZSBodG1sIGFzIGEgbGFuZ3VhZ2UgYW5kIGRvIG5vdGhpbmc/XG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgcHJvYmxlbS5vcHRpb25zLmxhbmd1YWdlID09IFwibmF0dXJhbFwiIHx8XG4gICAgICAgICAgICBwcm9ibGVtLm9wdGlvbnMubGFuZ3VhZ2UgPT0gXCJtYXRoXCIgfHxcbiAgICAgICAgICAgIHByb2JsZW0ub3B0aW9ucy5sYW5ndWFnZSA9PSBcInRleHRcIlxuICAgICAgICApIHtcbiAgICAgICAgICAgIGlmICghZGlzcGxheW1hdGgpIHtcbiAgICAgICAgICAgICAgICB2aWV3ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZpZXcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmlldyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjb2RlXCIpO1xuICAgICAgICAgICAgaWYgKHByb2JsZW0ub3B0aW9ucy5wcmV0dGlmeUxhbmd1YWdlKSB7XG4gICAgICAgICAgICAgICAgdmlldy5jbGFzc0xpc3QuYWRkKFxuICAgICAgICAgICAgICAgICAgICAuLi5wcm9ibGVtLm9wdGlvbnMucHJldHRpZnlMYW5ndWFnZS5zcGxpdChcIiBcIiksXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2aWV3LmlkID0gcHJvYmxlbS5jb3VudGVySWQgKyBcIi1saW5lLVwiICsgdGhpcy5pbmRleDtcbiAgICAgICAgdmlldy5pbm5lckhUTUwgKz0gdGhpcy50ZXh0O1xuICAgICAgICB0aGlzLnZpZXcgPSB2aWV3O1xuICAgICAgICBwcm9ibGVtLmxpbmVzLnB1c2godGhpcyk7XG4gICAgfVxuICAgIC8vIEluaXRpYWxpemUgd2hhdCB3aWR0aCB0aGUgbGluZSB3b3VsZCBuYXR1cmFsbHkgaGF2ZSAod2l0aG91dCBpbmRlbnQpXG4gICAgaW5pdGlhbGl6ZVdpZHRoKCkge1xuICAgICAgICAvLyB0aGlzLndpZHRoIGRvZXMgbm90IGFwcGVhciB0byBiZSB1c2VkIGFueXdoZXJlIGxhdGVyXG4gICAgICAgIC8vIHNpbmNlIGNoYW5naW5nIHRoZSB2YWx1ZSBvZiB0aGlzLndpZHRoIGFwcGVhcnMgdG8gaGF2ZSBubyBlZmZlY3QuIC0gVmluY2VudCBRaXUgKFNlcHRlbWJlciAyMDIwKVxuICAgICAgICB0aGlzLndpZHRoID1cbiAgICAgICAgICAgIG91dGVyV2lkdGgodGhpcy52aWV3KSAtXG4gICAgICAgICAgICB0aGlzLnByb2JsZW0ub3B0aW9ucy5waXhlbHNQZXJJbmRlbnQgKiB0aGlzLmluZGVudDtcblxuICAgICAgICAvLyBQYXNzIHRoaXMgaW5mb3JtYXRpb24gb24gdG8gYmUgdXNlZCBpbiBjbGFzcyBQYXJzb25zIGZ1bmN0aW9uIGluaXRpYWxpemVBcmVhc1xuICAgICAgICAvLyB0byBtYW51YWxseSBkZXRlcm1pbmUgYXBwcm9wcmlhdGUgd2lkdGhzIC0gVmluY2VudCBRaXUgKFNlcHRlbWJlciAyMDIwKVxuICAgICAgICB0aGlzLnZpZXcuZm9udFNpemUgPSB3aW5kb3dcbiAgICAgICAgICAgIC5nZXRDb21wdXRlZFN0eWxlKHRoaXMudmlldywgbnVsbClcbiAgICAgICAgICAgIC5nZXRQcm9wZXJ0eVZhbHVlKFwiZm9udC1zaXplXCIpO1xuICAgICAgICB0aGlzLnZpZXcucGl4ZWxzUGVySW5kZW50ID0gdGhpcy5wcm9ibGVtLm9wdGlvbnMucGl4ZWxzUGVySW5kZW50O1xuICAgICAgICB0aGlzLnZpZXcuaW5kZW50ID0gdGhpcy5pbmRlbnQ7XG5cbiAgICAgICAgLy8gRmlndXJlIG91dCB3aGljaCB0eXBlZmFjZSB3aWxsIGJlIHJlbmRlcmVkIGJ5IGNvbXBhcmluZyB0ZXh0IHdpZHRocyB0byBicm93c2VyIGRlZmF1bHQgLSBWaW5jZW50IFFpdSAoU2VwdGVtYmVyIDIwMjApXG4gICAgICAgIHZhciB0ZW1wQ2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgICAgICAgdmFyIHRlbXBDYW52YXNDdHggPSB0ZW1wQ2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcbiAgICAgICAgdmFyIHBvc3NpYmxlRm9udHMgPSB3aW5kb3dcbiAgICAgICAgICAgIC5nZXRDb21wdXRlZFN0eWxlKHRoaXMudmlldywgbnVsbClcbiAgICAgICAgICAgIC5nZXRQcm9wZXJ0eVZhbHVlKFwiZm9udC1mYW1pbHlcIilcbiAgICAgICAgICAgIC5zcGxpdChcIiwgXCIpO1xuICAgICAgICB2YXIgZmlsbGVyVGV4dCA9IFwiYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5LC4vIUAjJCVeJiotK1wiO1xuICAgICAgICB0ZW1wQ2FudmFzQ3R4LmZvbnQgPSB0aGlzLnZpZXcuZm9udFNpemUgKyBcIiBzZXJpZlwiO1xuICAgICAgICB2YXIgc2VyaWZXaWR0aCA9IHRlbXBDYW52YXNDdHgubWVhc3VyZVRleHQoZmlsbGVyVGV4dCkud2lkdGg7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcG9zc2libGVGb250cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHBvc3NpYmxlRm9udHNbaV0uaW5jbHVkZXMoJ1wiJykpIHtcbiAgICAgICAgICAgICAgICBwb3NzaWJsZUZvbnRzW2ldID0gcG9zc2libGVGb250c1tpXS5yZXBsYWNlQWxsKCdcIicsIFwiXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBvc3NpYmxlRm9udHNbaV0uaW5jbHVkZXMoXCInXCIpKSB7XG4gICAgICAgICAgICAgICAgcG9zc2libGVGb250c1tpXSA9IHBvc3NpYmxlRm9udHNbaV0ucmVwbGFjZUFsbChcIidcIiwgXCJcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0ZW1wQ2FudmFzQ3R4LmZvbnQgPSB0aGlzLnZpZXcuZm9udFNpemUgKyBcIiBcIiArIHBvc3NpYmxlRm9udHNbaV07XG4gICAgICAgICAgICBpZiAodGVtcENhbnZhc0N0eC5tZWFzdXJlVGV4dChmaWxsZXJUZXh0KS53aWR0aCAhPT0gc2VyaWZXaWR0aCkge1xuICAgICAgICAgICAgICAgIHRoaXMudmlldy5mb250RmFtaWx5ID0gcG9zc2libGVGb250c1tpXTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBBbnN3ZXIgdGhlIGJsb2NrIHRoYXQgdGhpcyBsaW5lIGlzIGN1cnJlbnRseSBpblxuICAgIGJsb2NrKCkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucHJvYmxlbS5ibG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBibG9jayA9IHRoaXMucHJvYmxlbS5ibG9ja3NbaV07XG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGJsb2NrLmxpbmVzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGJsb2NrLmxpbmVzW2pdID09PSB0aGlzKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBibG9jaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgLy8gQW5zd2VyIHRoZSBpbmRlbnQgYmFzZWQgb24gdGhlIHZpZXdcbiAgICB2aWV3SW5kZW50KCkge1xuICAgICAgICBpZiAodGhpcy5wcm9ibGVtLm5vaW5kZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pbmRlbnQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgYmxvY2sgPSB0aGlzLmJsb2NrKCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pbmRlbnQgLSBibG9jay5zb2x1dGlvbkluZGVudCgpICsgYmxvY2suaW5kZW50O1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IFBhcnNvbnNMaW5lIGZyb20gXCIuL3BhcnNvbnNMaW5lXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBsYWNlaG9sZGVyTGluZSBleHRlbmRzIFBhcnNvbnNMaW5lIHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9ibGVtKSB7XG4gICAgICAgIHN1cGVyKHByb2JsZW0sIFwicGxhY2Vob2xkZXJcIiwgZmFsc2UpO1xuICAgICAgICB0aGlzLmlzUGxhY2Vob2xkZXJMaW5lID0gdHJ1ZTtcbiAgICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBMaW5lQmFzZWRHcmFkZXIge1xuICAgIGNvbnN0cnVjdG9yKHByb2JsZW0pIHtcbiAgICAgICAgdGhpcy5wcm9ibGVtID0gcHJvYmxlbTtcbiAgICB9XG4gICAgLy8gVXNlIGEgTElTIChMb25nZXN0IEluY3JlYXNpbmcgU3Vic2VxdWVuY2UpIGFsZ29yaXRobSB0byByZXR1cm4gdGhlIGluZGV4ZXNcbiAgICAvLyB0aGF0IGFyZSBub3QgcGFydCBvZiB0aGF0IHN1YnNlcXVlbmNlLlxuICAgIGludmVyc2VMSVNJbmRpY2VzKGFycikge1xuICAgICAgICAvLyBHZXQgYWxsIHN1YnNlcXVlbmNlc1xuICAgICAgICB2YXIgYWxsU3Vic2VxdWVuY2VzID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgc3Vic2VxdWVuY2VGb3JDdXJyZW50ID0gW2FycltpXV07XG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGk7IGorKykge1xuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgYXJyW2pdIDwgYXJyW2ldICYmXG4gICAgICAgICAgICAgICAgICAgIGFsbFN1YnNlcXVlbmNlc1tqXS5sZW5ndGggKyAxID4gc3Vic2VxdWVuY2VGb3JDdXJyZW50Lmxlbmd0aFxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICBzdWJzZXF1ZW5jZUZvckN1cnJlbnQgPSBhbGxTdWJzZXF1ZW5jZXNbal0uY29uY2F0KGFycltpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYWxsU3Vic2VxdWVuY2VzLnB1c2goc3Vic2VxdWVuY2VGb3JDdXJyZW50KTtcbiAgICAgICAgfVxuICAgICAgICAvLyBGaWd1cmUgb3V0IHRoZSBsb25nZXN0IG9uZVxuICAgICAgICB2YXIgbG9uZ2VzdFN1YnNlcXVlbmNlTGVuZ3RoID0gLTE7XG4gICAgICAgIHZhciBsb25nZXN0U3Vic2VxdWVuY2U7XG4gICAgICAgIGZvciAobGV0IGkgaW4gYWxsU3Vic2VxdWVuY2VzKSB7XG4gICAgICAgICAgICB2YXIgc3VicyA9IGFsbFN1YnNlcXVlbmNlc1tpXTtcbiAgICAgICAgICAgIGlmIChzdWJzLmxlbmd0aCA+IGxvbmdlc3RTdWJzZXF1ZW5jZUxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGxvbmdlc3RTdWJzZXF1ZW5jZUxlbmd0aCA9IHN1YnMubGVuZ3RoO1xuICAgICAgICAgICAgICAgIGxvbmdlc3RTdWJzZXF1ZW5jZSA9IHN1YnM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBpbnZlcnNlIGluZGV4ZXNcbiAgICAgICAgdmFyIGluZGV4ZXMgPSBbXTtcbiAgICAgICAgdmFyIGxJbmRleCA9IDA7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAobEluZGV4ID4gbG9uZ2VzdFN1YnNlcXVlbmNlLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGluZGV4ZXMucHVzaChpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGFycltpXSA9PSBsb25nZXN0U3Vic2VxdWVuY2VbbEluZGV4XSkge1xuICAgICAgICAgICAgICAgICAgICBsSW5kZXggKz0gMTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpbmRleGVzLnB1c2goaSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpbmRleGVzO1xuICAgIH1cbiAgICAvLyBncmFkZSB0aGF0IGVsZW1lbnQsIHJldHVybmluZyB0aGUgc3RhdGVcbiAgICBncmFkZSgpIHtcbiAgICAgICAgdmFyIHByb2JsZW0gPSB0aGlzLnByb2JsZW07XG4gICAgICAgIHByb2JsZW0uY2xlYXJGZWVkYmFjaygpO1xuICAgICAgICB0aGlzLmNvcnJlY3RMaW5lcyA9IDA7XG4gICAgICAgIHRoaXMucGVyY2VudExpbmVzID0gMDtcbiAgICAgICAgdGhpcy5pbmNvcnJlY3RJbmRlbnRzID0gMDtcbiAgICAgICAgdmFyIHNvbHV0aW9uTGluZXMgPSBwcm9ibGVtLnNvbHV0aW9uO1xuICAgICAgICB2YXIgYW5zd2VyTGluZXMgPSBwcm9ibGVtLmFuc3dlckxpbmVzKCk7XG4gICAgICAgIHZhciBpO1xuICAgICAgICB2YXIgc3RhdGU7XG4gICAgICAgIHRoaXMucGVyY2VudExpbmVzID1cbiAgICAgICAgICAgIE1hdGgubWluKGFuc3dlckxpbmVzLmxlbmd0aCwgc29sdXRpb25MaW5lcy5sZW5ndGgpIC9cbiAgICAgICAgICAgIE1hdGgubWF4KGFuc3dlckxpbmVzLmxlbmd0aCwgc29sdXRpb25MaW5lcy5sZW5ndGgpO1xuICAgICAgICBpZiAoYW5zd2VyTGluZXMubGVuZ3RoIDwgc29sdXRpb25MaW5lcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHN0YXRlID0gXCJpbmNvcnJlY3RUb29TaG9ydFwiO1xuICAgICAgICAgICAgdGhpcy5jb3JyZWN0TGVuZ3RoID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSBpZiAoYW5zd2VyTGluZXMubGVuZ3RoID09IHNvbHV0aW9uTGluZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLmNvcnJlY3RMZW5ndGggPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RhdGUgPSBcImluY29ycmVjdE1vdmVCbG9ja3NcIjtcbiAgICAgICAgICAgIHRoaXMuY29ycmVjdExlbmd0aCA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGNvZGUgKip0aGF0IGlzIHRoZXJlKiogaXMgaW4gdGhlIGNvcnJlY3Qgb3JkZXJcbiAgICAgICAgLy8gSWYgdGhlcmUgaXMgdG9vIG11Y2ggb3IgdG9vIGxpdHRsZSBjb2RlIHRoaXMgb25seSBtYXR0ZXJzIGZvclxuICAgICAgICAvLyBjYWxjdWxhdGluZyBhIHBlcmNlbnRhZ2Ugc2NvcmUuXG4gICAgICAgIGxldCBpc0NvcnJlY3RPcmRlciA9IHRoaXMuY2hlY2tDb3JyZWN0T3JkZXJpbmcoXG4gICAgICAgICAgICBzb2x1dGlvbkxpbmVzLFxuICAgICAgICAgICAgYW5zd2VyTGluZXMsXG4gICAgICAgICk7XG5cbiAgICAgICAgLy8gRGV0ZXJtaW5lIHdoZXRoZXIgYmxvY2tzIGFyZSBpbmRlbnRlZCBjb3JyZWN0bHlcbiAgICAgICAgbGV0IGlzQ29ycmVjdEluZGVudHMgPSB0aGlzLmNoZWNrQ29ycmVjdEluZGVudGF0aW9uKFxuICAgICAgICAgICAgc29sdXRpb25MaW5lcyxcbiAgICAgICAgICAgIGFuc3dlckxpbmVzLFxuICAgICAgICApO1xuXG4gICAgICAgIGlmIChpc0NvcnJlY3RJbmRlbnRzICYmIGlzQ29ycmVjdE9yZGVyICYmIHRoaXMuY29ycmVjdExlbmd0aCkge1xuICAgICAgICAgICAgLy8gUGVyZmVjdFxuICAgICAgICAgICAgc3RhdGUgPSBcImNvcnJlY3RcIjtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmNvcnJlY3RMZW5ndGggJiYgaXNDb3JyZWN0T3JkZXIpIHtcbiAgICAgICAgICAgIHN0YXRlID0gXCJpbmNvcnJlY3RJbmRlbnRcIjtcbiAgICAgICAgfSBlbHNlIGlmICghaXNDb3JyZWN0T3JkZXIgJiYgc3RhdGUgIT0gXCJpbmNvcnJlY3RUb29TaG9ydFwiKSB7XG4gICAgICAgICAgICBzdGF0ZSA9IFwiaW5jb3JyZWN0TW92ZUJsb2Nrc1wiO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2FsY3VsYXRlUGVyY2VudCgpO1xuICAgICAgICB0aGlzLmdyYWRlclN0YXRlID0gc3RhdGU7XG5cbiAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH1cblxuICAgIGNoZWNrQ29ycmVjdEluZGVudGF0aW9uKHNvbHV0aW9uTGluZXMsIGFuc3dlckxpbmVzKSB7XG4gICAgICAgIGlmICghdGhpcy5wcm9ibGVtLnVzZXNJbmRlbnRhdGlvbigpKSByZXR1cm4gdHJ1ZTtcblxuICAgICAgICB0aGlzLmluZGVudExlZnQgPSBbXTtcbiAgICAgICAgdGhpcy5pbmRlbnRSaWdodCA9IFtdO1xuICAgICAgICBsZXQgbG9vcExpbWl0ID0gTWF0aC5taW4oc29sdXRpb25MaW5lcy5sZW5ndGgsIGFuc3dlckxpbmVzLmxlbmd0aCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbG9vcExpbWl0OyBpKyspIHtcbiAgICAgICAgICAgIGlmIChhbnN3ZXJMaW5lc1tpXS52aWV3SW5kZW50KCkgPCBzb2x1dGlvbkxpbmVzW2ldLmluZGVudCkge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5kZW50UmlnaHQucHVzaChhbnN3ZXJMaW5lc1tpXSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGFuc3dlckxpbmVzW2ldLnZpZXdJbmRlbnQoKSA+IHNvbHV0aW9uTGluZXNbaV0uaW5kZW50KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbmRlbnRMZWZ0LnB1c2goYW5zd2VyTGluZXNbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuaW5jb3JyZWN0SW5kZW50cyA9XG4gICAgICAgICAgICB0aGlzLmluZGVudExlZnQubGVuZ3RoICsgdGhpcy5pbmRlbnRSaWdodC5sZW5ndGg7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuaW5jb3JyZWN0SW5kZW50cyA9PSAwO1xuICAgIH1cblxuICAgIGNoZWNrQ29ycmVjdE9yZGVyaW5nKHNvbHV0aW9uTGluZXMsIGFuc3dlckxpbmVzKSB7XG4gICAgICAgIGxldCBpc0NvcnJlY3RPcmRlciA9IHRydWU7XG4gICAgICAgIHRoaXMuY29ycmVjdExpbmVzID0gMDtcbiAgICAgICAgdGhpcy5zb2x1dGlvbkxlbmd0aCA9IHNvbHV0aW9uTGluZXMubGVuZ3RoO1xuICAgICAgICBsZXQgbG9vcExpbWl0ID0gTWF0aC5taW4oc29sdXRpb25MaW5lcy5sZW5ndGgsIGFuc3dlckxpbmVzLmxlbmd0aCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbG9vcExpbWl0OyBpKyspIHtcbiAgICAgICAgICAgIGlmIChhbnN3ZXJMaW5lc1tpXS50ZXh0ICE9PSBzb2x1dGlvbkxpbmVzW2ldLnRleHQpIHtcbiAgICAgICAgICAgICAgICBpc0NvcnJlY3RPcmRlciA9IGZhbHNlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvcnJlY3RMaW5lcyArPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpc0NvcnJlY3RPcmRlcjtcbiAgICB9XG5cbiAgICBjYWxjdWxhdGVQZXJjZW50KCkge1xuICAgICAgICBsZXQgbnVtTGluZXMgPSB0aGlzLnBlcmNlbnRMaW5lcyAqIDAuMjtcbiAgICAgICAgbGV0IGxpbmVzID0gdGhpcy5wcm9ibGVtLmFuc3dlckxpbmVzKCkubGVuZ3RoO1xuICAgICAgICBsZXQgbnVtQ29ycmVjdEJsb2NrcyA9ICh0aGlzLmNvcnJlY3RMaW5lcyAvIGxpbmVzKSAqIDAuNDtcbiAgICAgICAgbGV0IG51bUNvcnJlY3RJbmRlbnRzID1cbiAgICAgICAgICAgICgodGhpcy5jb3JyZWN0TGluZXMgLSB0aGlzLmluY29ycmVjdEluZGVudHMpIC8gbGluZXMpICogMC40O1xuXG4gICAgICAgIGxldCBzY29yZSA9IG51bUxpbmVzICsgbnVtQ29ycmVjdEJsb2NrcyArIG51bUNvcnJlY3RJbmRlbnRzO1xuICAgICAgICBzY29yZSA9IE1hdGgubWF4KHNjb3JlLCAwKTtcbiAgICAgICAgdGhpcy5wcm9ibGVtLnBlcmNlbnQgPSBzY29yZTtcbiAgICB9XG59XG4iLCIvKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09PT0gUGFyc29uc0Jsb2NrIE9iamVjdCA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT09PT09PT0gVGhlIG1vZGVsIGFuZCB2aWV3IG9mIGEgY29kZSBibG9jay5cbj09PT0gUFJPUEVSVElFUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT09PT09PT0gcHJvYmxlbTogdGhlIFBhcnNvbnMgcHJvYmxlbVxuPT09PT09PT0gbGluZXM6IGFuIGFycmF5IG9mIFBhcnNvbnNMaW5lIGluIHRoaXMgYmxvY2tcbj09PT09PT09IGluZGVudDogaW5kZW50IGJhc2VkIG9uIG1vdmVtZW50XG49PT09PT09PSB2aWV3OiBhbiBlbGVtZW50IGZvciB2aWV3aW5nIHRoaXMgb2JqZWN0XG49PT09PT09PSBsYWJlbHM6IFtsYWJlbCwgbGluZV0gdGhlIGxhYmVscyBudW1iZXJpbmcgdGhlIGJsb2NrIGFuZCB0aGUgbGluZXMgdGhleSBnbyBvblxuPT09PT09PT0gaGFtbWVyOiB0aGUgY29udHJvbGxlciBiYXNlZCBvbiBoYW1tZXIuanNcbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5pbXBvcnQgSGFtbWVyIGZyb20gXCIuL2hhbW1lci5taW4uanNcIjtcblxuY29uc3QgSU5ERU5UX0NMQVNTRVMgPSBbXG4gICAgXCJpbmRlbnQxXCIsXG4gICAgXCJpbmRlbnQyXCIsXG4gICAgXCJpbmRlbnQzXCIsXG4gICAgXCJpbmRlbnQ0XCIsXG4gICAgXCJpbmRlbnQ1XCIsXG4gICAgXCJpbmRlbnQ2XCIsXG5dO1xuXG4vLyBJbml0aWFsaXplIGJhc2VkIG9uIHRoZSBwcm9ibGVtIGFuZCB0aGUgbGluZXNcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhcnNvbnNCbG9jayB7XG4gICAgY29uc3RydWN0b3IocHJvYmxlbSwgbGluZXMpIHtcbiAgICAgICAgdGhpcy5wcm9ibGVtID0gcHJvYmxlbTtcbiAgICAgICAgdGhpcy5saW5lcyA9IGxpbmVzO1xuICAgICAgICB0aGlzLmluZGVudCA9IDA7XG4gICAgICAgIHRoaXMubGFiZWxzID0gW107XG4gICAgICAgIC8vIENyZWF0ZSB2aWV3LCBhZGRpbmcgdmlldyBvZiBsaW5lcyBhbmQgdXBkYXRpbmcgaW5kZW50XG4gICAgICAgIHZhciB2aWV3ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdmlldy5pZCA9IHByb2JsZW0uY291bnRlcklkICsgXCItYmxvY2stXCIgKyBwcm9ibGVtLmJsb2NrSW5kZXg7XG4gICAgICAgIHByb2JsZW0uYmxvY2tJbmRleCArPSAxO1xuICAgICAgICB2aWV3LmNsYXNzTGlzdC5hZGQoXCJibG9ja1wiKTtcbiAgICAgICAgdmlldy5zZXRBdHRyaWJ1dGUoXCJyb2xlXCIsIFwiYnV0dG9uXCIpO1xuICAgICAgICB2YXIgc2hhcmVkSW5kZW50ID0gbGluZXNbMF0uaW5kZW50O1xuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IGxpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBzaGFyZWRJbmRlbnQgPSBNYXRoLm1pbihzaGFyZWRJbmRlbnQsIGxpbmVzW2ldLmluZGVudCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGxpbmVEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBsaW5lRGl2LmNsYXNzTGlzdC5hZGQoXCJsaW5lc1wiKTtcbiAgICAgICAgdmlldy5hcHBlbmQobGluZURpdik7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBsaW5lID0gbGluZXNbaV07XG4gICAgICAgICAgICB2YXIgbGluZUluZGVudDtcbiAgICAgICAgICAgIGlmIChwcm9ibGVtLm5vaW5kZW50KSB7XG4gICAgICAgICAgICAgICAgbGluZUluZGVudCA9IGxpbmUuaW5kZW50O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsaW5lSW5kZW50ID0gbGluZS5pbmRlbnQgLSBzaGFyZWRJbmRlbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsaW5lLnZpZXcuY2xhc3NMaXN0LnJlbW92ZSguLi5JTkRFTlRfQ0xBU1NFUyk7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLm9wdGlvbnMubGFuZ3VhZ2UgIT0gXCJuYXR1cmFsXCIgJiZcbiAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0ub3B0aW9ucy5sYW5ndWFnZSAhPSBcIm1hdGhcIiAmJlxuICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS5vcHRpb25zLmxhbmd1YWdlICE9IFwidGV4dFwiXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBpZiAobGluZUluZGVudCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgbGluZS52aWV3LmNsYXNzTGlzdC5hZGQoXCJpbmRlbnRcIiArIGxpbmVJbmRlbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxpbmVEaXYuYXBwZW5kQ2hpbGQobGluZS52aWV3KTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbGFiZWxEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBsYWJlbERpdi5jbGFzc0xpc3QuYWRkKFwibGFiZWxzXCIpO1xuICAgICAgICBpZiAodGhpcy5wcm9ibGVtLm9wdGlvbnMubnVtYmVyZWQgPT0gXCJsZWZ0XCIpIHtcbiAgICAgICAgICAgIGxpbmVEaXYuY2xhc3NMaXN0LmFkZChcImJvcmRlcl9sZWZ0XCIpO1xuICAgICAgICAgICAgdmlldy5wcmVwZW5kKGxhYmVsRGl2KTtcbiAgICAgICAgICAgIHZpZXcuc3R5bGUuanVzdGlmeUNvbnRlbnQgPSBcImZsZXgtc3RhcnRcIjtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnByb2JsZW0ub3B0aW9ucy5udW1iZXJlZCA9PSBcInJpZ2h0XCIpIHtcbiAgICAgICAgICAgIGxhYmVsRGl2LmNsYXNzTGlzdC5hZGQoXCJib3JkZXJfbGVmdFwiKTtcbiAgICAgICAgICAgIGxhYmVsRGl2LnN0eWxlLmZsb2F0ID0gXCJyaWdodFwiO1xuICAgICAgICAgICAgdmlldy5zdHlsZS5qdXN0aWZ5Q29udGVudCA9IFwic3BhY2UtYmV0d2VlblwiO1xuICAgICAgICAgICAgdmlldy5hcHBlbmQobGFiZWxEaXYpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudmlldyA9IHZpZXc7XG4gICAgICAgIC8vIGlzIG5vdCBwbGFjZWhvbGRlciBieSBkZWZhdWx0XG4gICAgICAgIHRoaXMuaXNQbGFjZWhvbGRlciA9IGZhbHNlO1xuICAgIH1cbiAgICAvLyBBZGQgYSBsaW5lIChmcm9tIGFub3RoZXIgYmxvY2spIHRvIHRoaXMgYmxvY2tcbiAgICBhZGRMaW5lKGxpbmUpIHtcbiAgICAgICAgbGluZS52aWV3LmNsYXNzTGlzdC5yZW1vdmUoLi4uSU5ERU5UX0NMQVNTRVMpO1xuICAgICAgICBpZiAodGhpcy5wcm9ibGVtLm5vaW5kZW50KSB7XG4gICAgICAgICAgICBpZiAobGluZS5pbmRlbnQgPiAwKSB7XG4gICAgICAgICAgICAgICAgbGluZS52aWV3LmNsYXNzTGlzdC5hZGQoXCJpbmRlbnRcIiArIGxpbmUuaW5kZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBsaW5lcyA9IHRoaXMubGluZXM7XG4gICAgICAgICAgICB2YXIgc2hhcmVkSW5kZW50ID0gbGluZXNbMF0uaW5kZW50O1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHNoYXJlZEluZGVudCA9IE1hdGgubWluKHNoYXJlZEluZGVudCwgbGluZXNbaV0uaW5kZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzaGFyZWRJbmRlbnQgPCBsaW5lLmluZGVudCkge1xuICAgICAgICAgICAgICAgIGxpbmUudmlldy5jbGFzc0xpc3QuYWRkKFxuICAgICAgICAgICAgICAgICAgICBcImluZGVudFwiICsgKGxpbmUuaW5kZW50IC0gc2hhcmVkSW5kZW50KSxcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChzaGFyZWRJbmRlbnQgPiBsaW5lLmluZGVudCkge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgbGluZXNbaV0udmlldy5jbGFzc0xpc3QucmVtb3ZlKC4uLklOREVOVF9DTEFTU0VTKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gdG9kbzogaWYgbGFuZ3VhZ2UgaXMgbmF0dXJhbCBvciBtYXRoIHRoZW4gZG9uJ3QgZG8gdGhpc1xuICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0ub3B0aW9ucy5sYW5ndWFnZSAhPT0gXCJuYXR1cmFsXCIgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS5vcHRpb25zLmxhbmd1YWdlICE9PSBcIm1hdGhcIiAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtXG4gICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGluZXNbaV0udmlldy5jbGFzc0xpc3QuYWRkKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiaW5kZW50XCIgKyAobGluZXNbaV0uaW5kZW50IC0gbGluZS5pbmRlbnQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxpbmVzLnB1c2gobGluZSk7XG4gICAgICAgIHRoaXMudmlldy5xdWVyeVNlbGVjdG9yKFwiLmxpbmVzXCIpLmFwcGVuZENoaWxkKGxpbmUudmlldyk7XG4gICAgfVxuICAgIC8vIEFkZCB0aGUgY29udGVudHMgb2YgdGhhdCBibG9jayB0byBteXNlbGYgYW5kIHRoZW4gZGVsZXRlIHRoYXQgYmxvY2tcbiAgICBjb25zdW1lQmxvY2soYmxvY2spIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBibG9jay5saW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5hZGRMaW5lKGJsb2NrLmxpbmVzW2ldKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYmxvY2sudmlldy5nZXRBdHRyaWJ1dGUoXCJ0YWJpbmRleFwiKSA9PSBcIjBcIikge1xuICAgICAgICAgICAgdGhpcy5tYWtlVGFiSW5kZXgoKTtcbiAgICAgICAgfVxuICAgICAgICBibG9jay52aWV3LnJlbW92ZSgpO1xuICAgICAgICB2YXIgbmV3QmxvY2tzID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wcm9ibGVtLmJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJvYmxlbS5ibG9ja3NbaV0gIT09IGJsb2NrKSB7XG4gICAgICAgICAgICAgICAgbmV3QmxvY2tzLnB1c2godGhpcy5wcm9ibGVtLmJsb2Nrc1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBibG9jay5sYWJlbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuYWRkTGFiZWwoXG4gICAgICAgICAgICAgICAgYmxvY2subGFiZWxzW2ldWzBdLFxuICAgICAgICAgICAgICAgIHRoaXMubGluZXMubGVuZ3RoIC0gYmxvY2subGluZXMubGVuZ3RoICsgYmxvY2subGFiZWxzW2ldWzFdLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnByb2JsZW0uYmxvY2tzID0gbmV3QmxvY2tzO1xuICAgICAgICB0aGlzLnByb2JsZW0uc3RhdGUgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMucHJvYmxlbS51cGRhdGVWaWV3KCk7XG4gICAgfVxuICAgIC8vIFVwZGF0ZSB0aGUgbW9kZWwgYW5kIHZpZXcgd2hlbiBibG9jayBpcyBjb252ZXJ0ZWQgdG8gY29udGFpbiBpbmRlbnRcbiAgICBhZGRJbmRlbnQoKSB7XG4gICAgICAgIC8vIFVwZGF0ZSB0aGUgbGluZXMgbW9kZWwgLyB2aWV3XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5saW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGxpbmUgPSB0aGlzLmxpbmVzW2ldO1xuICAgICAgICAgICAgaWYgKGxpbmUuaW5kZW50ID4gMCkge1xuICAgICAgICAgICAgICAgIGxpbmUudmlldy5jbGFzc0xpc3QucmVtb3ZlKC4uLklOREVOVF9DTEFTU0VTKTtcbiAgICAgICAgICAgICAgICBsaW5lLnZpZXcuY2xhc3NMaXN0LmFkZChcImluZGVudFwiICsgbGluZS5pbmRlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIFVwZGF0ZSB0aGUgYmxvY2sgbW9kZWwgLyB2aWV3XG4gICAgICAgIHRoaXMuaW5kZW50ID0gMDtcbiAgICAgICAgdGhpcy52aWV3LnN0eWxlLnBhZGRpbmdMZWZ0ID0gXCJcIjtcbiAgICAgICAgdGhpcy52aWV3LnN0eWxlLndpZHRoID0gdGhpcy5wcm9ibGVtLmFyZWFXaWR0aCAtIDIyICsgXCJweFwiO1xuICAgIH1cbiAgICAvLyBBZGQgYSBsYWJlbCB0byBibG9jayBhbmQgdXBkYXRlIGl0cyB2aWV3XG4gICAgYWRkTGFiZWwobGFiZWwsIGxpbmUpIHtcbiAgICAgICAgdmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGRpdi5jbGFzc0xpc3QuYWRkKFwiYmxvY2stbGFiZWxcIik7XG4gICAgICAgIGlmICh0aGlzLnByb2JsZW0ub3B0aW9ucy5udW1iZXJlZCA9PSBcInJpZ2h0XCIpIHtcbiAgICAgICAgICAgIGRpdi5jbGFzc0xpc3QuYWRkKFwicmlnaHQtbGFiZWxcIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMucHJvYmxlbS5vcHRpb25zLm51bWJlcmVkID09IFwibGVmdFwiKSB7XG4gICAgICAgICAgICBkaXYuY2xhc3NMaXN0LmFkZChcImxlZnQtbGFiZWxcIik7XG4gICAgICAgIH1cbiAgICAgICAgZGl2LmFwcGVuZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShsYWJlbCkpO1xuICAgICAgICB0aGlzLnZpZXcucXVlcnlTZWxlY3RvcihcIi5sYWJlbHNcIikuYXBwZW5kKGRpdik7XG4gICAgICAgIGlmICh0aGlzLmxhYmVscy5sZW5ndGggIT0gMCkge1xuICAgICAgICAgICAgZGl2LnN0eWxlLm1hcmdpblRvcCA9XG4gICAgICAgICAgICAgICAgKGxpbmUgLSB0aGlzLmxhYmVsc1t0aGlzLmxhYmVscy5sZW5ndGggLSAxXVsxXSAtIDEpICpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5saW5lc1tsaW5lXS52aWV3Lm9mZnNldEhlaWdodCArXG4gICAgICAgICAgICAgICAgXCJweFwiO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubGFiZWxzLnB1c2goW2xhYmVsLCBsaW5lXSk7XG4gICAgfVxuICAgIC8vIEluaXRpYWxpemUgSW50ZXJhY3Rpdml0eVxuICAgIGluaXRpYWxpemVJbnRlcmFjdGl2aXR5KCkge1xuICAgICAgICAvLyBBbHdheXMgc2V0IHVwIGEgY2xpY2sgaGFuZGxlciwgZXZlbiBpZiBub3QgY3VycmVudGx5IGVuYWJsZWQsIHNvIHRoYXQgaXQgY2FuIGJlIHJlLWVuYWJsZWQgbGF0ZXJcbiAgICAgICAgdGhpcy5jbGlja0hhbmRsZXIgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGlmICghdGhpcy5lbmFibGVkKCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgIXRoaXMucHJvYmxlbS5rZXlib2FyZElucHV0QWN0aXZlIHx8XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnRleHRGb2N1cyAhPT0gdGhpc1xuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMudG9nZ2xlTW92ZSgpO1xuICAgICAgICB9O1xuICAgICAgICAvLyBJZiB0aGUgYmxvY2sgaXMgZGlzYWJsZWQsIGRvbid0IGFkZCB0aGUgZXZlbnQgbGlzdGVuZXJzIHlldC5cbiAgICAgICAgaWYgKHRoaXMudmlldy5jbGFzc0xpc3QuY29udGFpbnMoXCJkaXNhYmxlZFwiKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy52aWV3LnNldEF0dHJpYnV0ZShcInRhYmluZGV4XCIsIFwiLTFcIik7XG4gICAgICAgIHRoaXMudmlldy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy5jbGlja0hhbmRsZXIpO1xuICAgICAgICB0aGlzLmhhbW1lciA9IG5ldyBIYW1tZXIuTWFuYWdlcih0aGlzLnZpZXcsIHtcbiAgICAgICAgICAgIHJlY29nbml6ZXJzOiBbXG4gICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICBIYW1tZXIuUGFuLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXJlY3Rpb246IEhhbW1lci5ESVJFQ1RJT05fQUxMLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyZXNob2xkOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRlcnM6IDEsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICAgIHRoaXMuaGFtbWVyLm9uKFwicGFuc3RhcnRcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICB0aGF0LnBhblN0YXJ0KGV2ZW50KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuaGFtbWVyLm9uKFwicGFuZW5kXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgdGhhdC5wYW5FbmQoZXZlbnQpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5oYW1tZXIub24oXCJwYW5tb3ZlXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgdGhhdC5wYW5Nb3ZlKGV2ZW50KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8vIFJldHVybiBhIGJvb2xlYW4gYXMgdG8gd2hldGhlciB0aGlzIGJsb2NrIGlzIGFibGUgdG8gYmUgc2VsZWN0ZWRcbiAgICBlbmFibGVkKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgIXRoaXMudmlldy5jbGFzc0xpc3QuY29udGFpbnMoXCJkaXNhYmxlZFwiKSAmJlxuICAgICAgICAgICAgdGhpcy52aWV3LmdldEF0dHJpYnV0ZShcInRhYmluZGV4XCIpICE9PSBudWxsXG4gICAgICAgICk7XG4gICAgfVxuICAgIC8vIFJldHVybiBhIGJvb2xlYW4gYXMgdG8gd2hldGhlciB0aGlzIGJsb2NrIGlzIGEgZGlzdHJhY3RvclxuICAgIGlzRGlzdHJhY3RvcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubGluZXNbMF0uZGlzdHJhY3RvcjtcbiAgICB9XG4gICAgLy8gUmV0dXJuIGEgYm9vbGVhbiBhcyB0byB3aGV0aGVyIHRoaXMgYmxvY2sgaXMgaW4gdGhlIHNvdXJjZSBhcmVhXG4gICAgaW5Tb3VyY2VBcmVhKCkge1xuICAgICAgICB2YXIgY2hpbGRyZW4gPSB0aGlzLnByb2JsZW0uc291cmNlQXJlYS5jaGlsZE5vZGVzO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgaXRlbSA9IGNoaWxkcmVuW2ldO1xuICAgICAgICAgICAgaWYgKGl0ZW0uaWQgPT0gdGhpcy52aWV3LmlkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICAvLyBSZXR1cm4gdGhlIHBhZ2UgWCBwb3NpdGlvbiBvZiB0aGUgY2VudGVyIG9mIHRoZSB2aWV3XG4gICAgcGFnZVhDZW50ZXIoKSB7XG4gICAgICAgIHZhciBib3VuZGluZ1JlY3QgPSB0aGlzLnZpZXcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIHZhciBwYWdlWENlbnRlciA9XG4gICAgICAgICAgICB3aW5kb3cucGFnZVhPZmZzZXQgKyBib3VuZGluZ1JlY3QubGVmdCArIGJvdW5kaW5nUmVjdC53aWR0aCAvIDI7XG4gICAgICAgIHJldHVybiBwYWdlWENlbnRlcjtcbiAgICB9XG4gICAgLy8gUmV0dXJuIHRoZSBwYWdlIFkgcG9zaXRpb24gb2YgdGhlIGNlbnRlciBvZiB0aGUgdmlld1xuICAgIHBhZ2VZQ2VudGVyKCkge1xuICAgICAgICB2YXIgYm91bmRpbmdSZWN0ID0gdGhpcy52aWV3LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICB2YXIgcGFnZVlDZW50ZXIgPVxuICAgICAgICAgICAgd2luZG93LnBhZ2VZT2Zmc2V0ICsgYm91bmRpbmdSZWN0LnRvcCArIGJvdW5kaW5nUmVjdC5oZWlnaHQgLyAyO1xuICAgICAgICByZXR1cm4gcGFnZVlDZW50ZXI7XG4gICAgfVxuICAgIC8vIE9mIGFsbCB0aGUgbGluZSBpbmRlbnRzLCByZXR1cm4gdGhlIG1pbmltdW0gdmFsdWVcbiAgICBtaW5pbXVtTGluZUluZGVudCgpIHtcbiAgICAgICAgdmFyIG1pbmltdW1MaW5lSW5kZW50ID0gdGhpcy5saW5lc1swXS5pbmRlbnQ7XG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgdGhpcy5saW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbWluaW11bUxpbmVJbmRlbnQgPSBNYXRoLm1pbihcbiAgICAgICAgICAgICAgICB0aGlzLmxpbmVzW2ldLmluZGVudCxcbiAgICAgICAgICAgICAgICBtaW5pbXVtTGluZUluZGVudCxcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1pbmltdW1MaW5lSW5kZW50O1xuICAgIH1cbiAgICAvLyBSZXR1cm4gdGhlIGxhc3QgYmxvY2sgaW4gdGhlIHNvdXJjZSBhcmVhIHRoYXQgbWF0Y2hlcyB0aGUgcGFpcmVkIGJpbiBpdCBpcyBpblxuICAgIHNsaWRlVW5kZXJCbG9jaygpIHtcbiAgICAgICAgdmFyIHNvdXJjZUJsb2NrcyA9IHRoaXMucHJvYmxlbS5zb3VyY2VCbG9ja3MoKTtcbiAgICAgICAgaWYgKHNvdXJjZUJsb2Nrcy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcGFpcmVkQmluID0gdGhpcy5wYWlyZWRCaW4oKTtcbiAgICAgICAgaWYgKHBhaXJlZEJpbiA9PSAtMSkge1xuICAgICAgICAgICAgcmV0dXJuIHNvdXJjZUJsb2Nrc1tzb3VyY2VCbG9ja3MubGVuZ3RoIC0gMV07XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IHNvdXJjZUJsb2Nrcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgdmFyIGJsb2NrID0gc291cmNlQmxvY2tzW2ldO1xuICAgICAgICAgICAgaWYgKGJsb2NrLnBhaXJlZEJpbigpID09IHBhaXJlZEJpbikge1xuICAgICAgICAgICAgICAgIHJldHVybiBibG9jaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc291cmNlQmxvY2tzW3NvdXJjZUJsb2Nrcy5sZW5ndGggLSAxXTtcbiAgICB9XG4gICAgLy8gUmV0dXJuIHdoaWNoIHBhaXJlZCBiaW4gaXQgaXMgaW4gKC0xKSBpZiBub3RcbiAgICBwYWlyZWRCaW4oKSB7XG4gICAgICAgIHZhciBwYWlyZWRCaW5zID0gdGhpcy5wcm9ibGVtLnBhaXJlZEJpbnM7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGFpcmVkQmlucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMubWF0Y2hlc0JpbihwYWlyZWRCaW5zW2ldKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9XG4gICAgLy8gUmV0dXJuIHRydWUgaWYgYWxsIGxpbmVzIGFyZSBpbiB0aGF0IGJpblxuICAgIG1hdGNoZXNCaW4oYmluKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5saW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHRlc3QgPSB0aGlzLmxpbmVzW2ldLmluZGV4O1xuICAgICAgICAgICAgaWYgKGJpbi5pbmRleE9mKHRlc3QpID09IC0xKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICAvLyBSZXR1cm4gYSBsaXN0IG9mIGluZGV4ZXMgd2hlcmUgdGhpcyBibG9jayBjb3VsZCBiZSBpbnNlcnRlZCBiZWZvcmVcbiAgICB2YWxpZFNvdXJjZUluZGV4ZXMoKSB7XG4gICAgICAgIHZhciBibG9ja3MgPSB0aGlzLnByb2JsZW0uc291cmNlQmxvY2tzKCk7XG4gICAgICAgIHZhciBpbmRleGVzID0gW107XG4gICAgICAgIHZhciBwYWlyZWRCaW4gPSB0aGlzLnBhaXJlZEJpbigpO1xuICAgICAgICB2YXIgaSwgbGFzdEJpbjtcbiAgICAgICAgaWYgKHBhaXJlZEJpbiA+PSAwKSB7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgYmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGJsb2NrID0gYmxvY2tzW2ldO1xuICAgICAgICAgICAgICAgIGlmIChibG9jay52aWV3LmlkICE9PSB0aGlzLnZpZXcuaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGJsb2NrQmluID0gYmxvY2sucGFpcmVkQmluKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChibG9ja0JpbiA9PSBwYWlyZWRCaW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4ZXMucHVzaChpKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChsYXN0QmluID09IHBhaXJlZEJpbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXhlcy5wdXNoKGkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGxhc3RCaW4gPSBibG9ja0JpbjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobGFzdEJpbiA9PSBwYWlyZWRCaW4pIHtcbiAgICAgICAgICAgICAgICBpbmRleGVzLnB1c2goYmxvY2tzLmxlbmd0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaW5kZXhlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGluZGV4ZXM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IGJsb2NrID0gYmxvY2tzW2ldO1xuICAgICAgICAgICAgaWYgKGJsb2NrLnZpZXcuaWQgIT09IHRoaXMudmlldy5pZCkge1xuICAgICAgICAgICAgICAgIGxldCBibG9ja0JpbiA9IGJsb2NrLnBhaXJlZEJpbigpO1xuICAgICAgICAgICAgICAgIGlmIChibG9ja0JpbiAhPT0gbGFzdEJpbikge1xuICAgICAgICAgICAgICAgICAgICBpbmRleGVzLnB1c2goaSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChibG9ja0JpbiA9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICBpbmRleGVzLnB1c2goaSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxhc3RCaW4gPSBibG9ja0JpbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpbmRleGVzLnB1c2goYmxvY2tzLmxlbmd0aCk7XG4gICAgICAgIHJldHVybiBpbmRleGVzO1xuICAgIH1cbiAgICAvLyBBIG1lYXN1cmUgb2YgaG93IGZhciB0aGUgbWlkZGxlIG9mIHRoaXMgYmxvY2sgaXMgdmVydGljYWxseSBwb3NpdGlvbmVkXG4gICAgdmVydGljYWxPZmZzZXQoKSB7XG4gICAgICAgIHZhciB2ZXJ0aWNhbE9mZnNldDtcbiAgICAgICAgaWYgKHRoaXMuaW5Tb3VyY2VBcmVhKCkpIHtcbiAgICAgICAgICAgIHZlcnRpY2FsT2Zmc2V0ID1cbiAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0uc291cmNlQXJlYS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3A7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2ZXJ0aWNhbE9mZnNldCA9XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLmFuc3dlckFyZWEuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wO1xuICAgICAgICB9XG4gICAgICAgIHZlcnRpY2FsT2Zmc2V0ID1cbiAgICAgICAgICAgIHRoaXMudmlldy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgK1xuICAgICAgICAgICAgdGhpcy52aWV3LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmJvdHRvbSAtXG4gICAgICAgICAgICB2ZXJ0aWNhbE9mZnNldCAqIDI7XG4gICAgICAgIHJldHVybiB2ZXJ0aWNhbE9mZnNldDtcbiAgICB9XG4gICAgLy8gVGhpcyBibG9jayBqdXN0IGdhaW5lZCB0ZXh0dWFsIGZvY3VzXG4gICAgbmV3Rm9jdXMoZXZlbnQpIHtcbiAgICAgICAgaWYgKCF0aGlzLnByb2JsZW0ua2V5Ym9hcmRJbnB1dEFjdGl2ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnByb2JsZW0udGV4dEZvY3VzID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5wcm9ibGVtLmVudGVyS2V5Ym9hcmRNb2RlKCk7XG4gICAgICAgICAgICB0aGlzLnByb2JsZW0udGV4dEZvY3VzID0gdGhpcztcbiAgICAgICAgICAgIHRoaXMucHJvYmxlbS50ZXh0TW92ZSA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy52aWV3LmNsYXNzTGlzdC5hZGQoXCJkb3duXCIpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMucHJvYmxlbS50ZXh0Rm9jdXMgPT0gdGhpcykge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJvYmxlbS50ZXh0TW92ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMudmlldy5jbGFzc0xpc3QuYWRkKFwidXBcIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudmlldy5jbGFzc0xpc3QuYWRkKFwiZG93blwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGFscmVhZHkgaW4ga2V5Ym9hcmQgbW9kZVxuICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnRleHRGb2N1cyA9IHRoaXM7XG4gICAgICAgICAgICB0aGlzLnByb2JsZW0udGV4dE1vdmUgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMudmlldy5jbGFzc0xpc3QuYWRkKFwiZG93blwiKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnByb2JsZW0udGV4dE1vdmluZyA9IGZhbHNlO1xuICAgICAgICBpZiAoIXRoaXMucHJvYmxlbS5rZXlib2FyZElucHV0QWN0aXZlKSB7XG4gICAgICAgICAgICB0aGlzLnByb2JsZW0uZW50ZXJLZXlib2FyZE5hdmlnYXRpb25Nb2RlKHRoaXMpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIFRoaXMgYmxvY2sganVzdCBsb3N0IHRleHR1YWwgZm9jdXNcbiAgICByZWxlYXNlRm9jdXMoZXZlbnQpIHtcbiAgICAgICAgaWYgKHRoaXMucHJvYmxlbS5rZXlib2FyZElucHV0QWN0aXZlKSB7XG4gICAgICAgICAgICB0aGlzLnByb2JsZW0uY2FuY2VsS2V5Ym9hcmRNb3ZlbWVudCgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5wcm9ibGVtLmtleWJvYXJkTW92ZW1lbnRNb2RlKSB7XG4gICAgICAgICAgICB0aGlzLnZpZXcuY2xhc3NMaXN0LnJlbW92ZShcImRvd25cIiwgXCJ1cFwiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5wcm9ibGVtLnRleHRGb2N1cyA9PSB0aGlzKSB7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgIXRoaXMucHJvYmxlbS50ZXh0TW92aW5nICYmXG4gICAgICAgICAgICAgICAgIXRoaXMucHJvYmxlbS5rZXlib2FyZE1vdmVtZW50TW9kZVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgLy8gZXhpdCBvdXQgb2YgcHJvYmxlbSBidXQgc3RheSB3YXkgaW50byBwcm9ibGVtXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnRleHRGb2N1cyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wcm9ibGVtLnRleHRNb3ZlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS5sb2dNb3ZlKFwia21vdmVcIik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS50ZXh0TW92ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAvLyBDb2RlVGFpbG9yOiB1cGRhdGUgcGxhY2Vob2xkZXJzXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS51cGRhdGVQbGFjZWhvbGRlcnMoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLmV4aXRLZXlib2FyZE1vZGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGJlY29tZSBzZWxlY3RhYmxlLCBidXQgbm90IGFjdGl2ZVxuICAgICAgICAgICAgdGhpcy52aWV3LnNldEF0dHJpYnV0ZShcInRhYmluZGV4XCIsIFwiLTFcIik7XG4gICAgICAgICAgICB0aGlzLnZpZXcucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImZvY3VzXCIsIHRoaXMuZm9jdXNIYW5kbGVyKTtcbiAgICAgICAgICAgIHRoaXMudmlldy5yZW1vdmVFdmVudExpc3RlbmVyKFwiYmx1clwiLCB0aGlzLmJsdXJIYW5kbGVyKTtcbiAgICAgICAgICAgIHRoaXMudmlldy5yZW1vdmVFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCB0aGlzLmtleWRvd25IYW5kbGVyKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBNYWtlIHRoaXMgYmxvY2sgaW50byB0aGUga2V5Ym9hcmQgZW50cnkgcG9pbnRcbiAgICBtYWtlVGFiSW5kZXgoKSB7XG4gICAgICAgIHRoaXMudmlldy5zZXRBdHRyaWJ1dGUoXCJ0YWJpbmRleFwiLCBcIi0xXCIpO1xuICAgICAgICBpZiAodGhpcy5mb2N1c0hhbmRsZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5mb2N1c0hhbmRsZXIgPSAoZXZlbnQpID0+IHRoaXMubmV3Rm9jdXMoZXZlbnQpO1xuICAgICAgICAgICAgdGhpcy5ibHVySGFuZGxlciA9IChldmVudCkgPT4gdGhpcy5yZWxlYXNlRm9jdXMoZXZlbnQpO1xuICAgICAgICAgICAgdGhpcy5rZXlkb3duSGFuZGxlciA9IChldmVudCkgPT4gdGhpcy5rZXlEb3duKGV2ZW50KTtcbiAgICAgICAgfVxuICAgICAgICAvLyByZS1hZGRpbmcgYW4gaWRlbnRpY2FsIGxpc3RlbmVyIGlzIGEgbm8tb3AsIHNvIHJlcGVhdGVkIGNhbGxzIGFyZSBzYWZlXG4gICAgICAgIHRoaXMudmlldy5hZGRFdmVudExpc3RlbmVyKFwiZm9jdXNcIiwgdGhpcy5mb2N1c0hhbmRsZXIpO1xuICAgICAgICB0aGlzLnZpZXcuYWRkRXZlbnRMaXN0ZW5lcihcImJsdXJcIiwgdGhpcy5ibHVySGFuZGxlcik7XG4gICAgICAgIHRoaXMudmlldy5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCB0aGlzLmtleWRvd25IYW5kbGVyKTtcbiAgICB9XG4gICAgLy8gQ2FsbGVkIHRvIGRpc2FibGUgaW50ZXJhY3Rpb24gZm9yIHRoZSBmdXR1cmVcbiAgICBkaXNhYmxlKCkge1xuICAgICAgICBpZiAodGhpcy5oYW1tZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5oYW1tZXIuc2V0KHsgZW5hYmxlOiBmYWxzZSB9KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnZpZXcucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuY2xpY2tIYW5kbGVyKTtcbiAgICAgICAgaWYgKHRoaXMudmlldy5nZXRBdHRyaWJ1dGUoXCJ0YWJpbmRleFwiKSA9PSBcIjBcIikge1xuICAgICAgICAgICAgdGhpcy5yZWxlYXNlRm9jdXMoKTtcbiAgICAgICAgICAgIHRoaXMudmlldy5yZW1vdmVBdHRyaWJ1dGUoXCJ0YWJpbmRleFwiKTtcbiAgICAgICAgICAgIHRoaXMucHJvYmxlbS5pbml0aWFsaXplVGFiSW5kZXgoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudmlldy5yZW1vdmVBdHRyaWJ1dGUoXCJ0YWJpbmRleFwiKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBFbmFibGUgZnVuY3Rpb25hbGl0eSBhZnRlciByZXNldCBidXR0b24gaGFzIGJlZW4gcHJlc3NlZFxuICAgIHJlc2V0VmlldygpIHtcbiAgICAgICAgaWYgKHRoaXMuaGFtbWVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuaGFtbWVyLnNldCh7IGVuYWJsZTogdHJ1ZSB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMudmlldy5oYXNBdHRyaWJ1dGUoXCJ0YWJpbmRleFwiKSkge1xuICAgICAgICAgICAgdGhpcy52aWV3LnNldEF0dHJpYnV0ZShcInRhYmluZGV4XCIsIFwiLTFcIik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy52aWV3LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLmNsaWNrSGFuZGxlcik7XG4gICAgICAgIHRoaXMudmlldy5zdHlsZS5vcGFjaXR5ID0gXCJcIjtcbiAgICB9XG4gICAgLy8gQ2FsbGVkIHRvIGRlc3Ryb3kgaW50ZXJhY3Rpb24gZm9yIHRoZSBmdXR1cmVcbiAgICBkZXN0cm95KCkge1xuICAgICAgICBpZiAodGhpcy5oYW1tZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5oYW1tZXIuZGVzdHJveSgpO1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMuaGFtbWVyO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudmlldy5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy5jbGlja0hhbmRsZXIpO1xuICAgICAgICBpZiAodGhpcy52aWV3LmdldEF0dHJpYnV0ZShcInRhYmluZGV4XCIpID09IFwiMFwiKSB7XG4gICAgICAgICAgICB0aGlzLnJlbGVhc2VGb2N1cygpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudmlldy5yZW1vdmVBdHRyaWJ1dGUoXCJ0YWJpbmRleFwiKTtcbiAgICB9XG4gICAgLy8gQ2FsbGVkIHdoZW4gYSBibG9jayBpcyBwaWNrZWQgdXBcbiAgICBwYW5TdGFydChldmVudCkge1xuICAgICAgICB0aGlzLnByb2JsZW0uY2xlYXJGZWVkYmFjaygpO1xuICAgICAgICBpZiAodGhpcy5wcm9ibGVtLnN0YXJ0ZWQgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAvLyBsb2cgdGhlIGZpcnN0IHRpbWUgdGhhdCBzb21ldGhpbmcgZ2V0cyBtb3ZlZFxuICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnN0YXJ0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5wcm9ibGVtLmxvZ01vdmUoXCJzdGFydFwiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5wcm9ibGVtLnRleHRGb2N1cyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAvLyBzdG9wIHRleHQgZm9jdXMgd2hlbiBkcmFnZ2luZ1xuICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnRleHRGb2N1cy5yZWxlYXNlRm9jdXMoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnByb2JsZW0ubW92aW5nID0gdGhpcztcbiAgICAgICAgLy8gVXBkYXRlIHRoZSB2aWV3XG4gICAgICAgIHRoaXMucHJvYmxlbS5tb3ZpbmdYID0gZXZlbnQuc3JjRXZlbnQucGFnZVg7XG4gICAgICAgIHRoaXMucHJvYmxlbS5tb3ZpbmdZID0gZXZlbnQuc3JjRXZlbnQucGFnZVk7XG4gICAgICAgIHRoaXMucHJvYmxlbS51cGRhdGVWaWV3KCk7XG4gICAgfVxuICAgIC8vIENhbGxlZCB3aGVuIGEgYmxvY2sgaXMgZHJvcHBlZFxuICAgIHBhbkVuZChldmVudCkge1xuICAgICAgICB0aGlzLnByb2JsZW0uaXNBbnN3ZXJlZCA9IHRydWU7XG4gICAgICAgIGRlbGV0ZSB0aGlzLnByb2JsZW0ubW92aW5nO1xuICAgICAgICBkZWxldGUgdGhpcy5wcm9ibGVtLm1vdmluZ1g7XG4gICAgICAgIGRlbGV0ZSB0aGlzLnByb2JsZW0ubW92aW5nWTtcbiAgICAgICAgdGhpcy5wcm9ibGVtLnVwZGF0ZVZpZXcoKTtcbiAgICAgICAgdGhpcy5wcm9ibGVtLmxvZ01vdmUoXCJtb3ZlXCIpO1xuICAgICAgICB0aGlzLnByb2JsZW0udXBkYXRlUGxhY2Vob2xkZXJzKCk7XG4gICAgfVxuICAgIC8vIENhbGxlZCB3aGVuIGEgYmxvY2sgaXMgbW92ZWRcbiAgICBwYW5Nb3ZlKGV2ZW50KSB7XG4gICAgICAgIC8vIFVwZGF0ZSB0aGUgdmlld1xuICAgICAgICB0aGlzLnByb2JsZW0ubW92aW5nWCA9IGV2ZW50LnNyY0V2ZW50LnBhZ2VYO1xuICAgICAgICB0aGlzLnByb2JsZW0ubW92aW5nWSA9IGV2ZW50LnNyY0V2ZW50LnBhZ2VZO1xuICAgICAgICB0aGlzLnByb2JsZW0udXBkYXRlVmlldygpO1xuICAgIH1cbiAgICAvLyBIYW5kbGUgYSBrZXlwcmVzcyBldmVudCB3aGVuIGluIGZvY3VzXG4gICAga2V5RG93bihldmVudCkge1xuICAgICAgICBpZiAodGhpcy5wcm9ibGVtLnN0YXJ0ZWQgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAvLyBsb2cgdGhlIGZpcnN0IHRpbWUgdGhhdCBzb21ldGhpbmcgZ2V0cyBtb3ZlZFxuICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnN0YXJ0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5wcm9ibGVtLmxvZ01vdmUoXCJrc3RhcnRcIik7XG4gICAgICAgIH1cbiAgICAgICAgc3dpdGNoIChldmVudC5rZXlDb2RlKSB7XG4gICAgICAgICAgICBjYXNlIDM3OiAvLyBsZWZ0XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucHJvYmxlbS50ZXh0TW92ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmVMZWZ0KCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RMZWZ0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAzODogLy8gdXBcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wcm9ibGVtLnRleHRNb3ZlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubW92ZVVwKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RVcCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAzOTogLy8gcmlnaHRcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wcm9ibGVtLnRleHRNb3ZlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubW92ZVJpZ2h0KCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RSaWdodCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSA0MDogLy8gZG93blxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnByb2JsZW0udGV4dE1vdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3ZlRG93bigpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0RG93bigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAzMjogLy8gc3BhY2VcbiAgICAgICAgICAgICAgICB0aGlzLnRvZ2dsZU1vdmUoKTtcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAxMzogLy8gZW50ZXJcbiAgICAgICAgICAgICAgICB0aGlzLnRvZ2dsZU1vdmUoKTtcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIE1vdmUgYmxvY2sgbGVmdFxuICAgIG1vdmVMZWZ0KCkge1xuICAgICAgICB2YXIgaW5kZXgsIGJsb2NrO1xuICAgICAgICBpZiAoIXRoaXMuaW5Tb3VyY2VBcmVhKCkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmluZGVudCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgLy8gbW92ZSB0byBzb3VyY2UgYXJlYVxuICAgICAgICAgICAgICAgIHZhciBibG9ja3MgPSB0aGlzLnByb2JsZW0uc291cmNlQmxvY2tzKCk7XG4gICAgICAgICAgICAgICAgdmFyIG9mZnNldCA9IHRoaXMudmVydGljYWxPZmZzZXQoKTtcbiAgICAgICAgICAgICAgICB2YXIgdmFsaWRTb3VyY2VJbmRleGVzID0gdGhpcy52YWxpZFNvdXJjZUluZGV4ZXMoKTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZhbGlkU291cmNlSW5kZXhlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpbmRleCA9IHZhbGlkU291cmNlSW5kZXhlc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4ID09IGJsb2Nrcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS50ZXh0TW92aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS5zb3VyY2VBcmVhLmFwcGVuZENoaWxkKHRoaXMudmlldyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMucHJvYmxlbS5rZXlib2FyZE1vdmVtZW50TW9kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudmlldy5mb2N1cygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnN0YXRlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnVwZGF0ZVZpZXcoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2sgPSBibG9ja3NbaW5kZXhdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGJsb2NrLnZlcnRpY2FsT2Zmc2V0KCkgPj0gb2Zmc2V0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnRleHRNb3ZpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS5zb3VyY2VBcmVhLmluc2VydEJlZm9yZSh0aGlzLnZpZXcsIGJsb2NrLnZpZXcpO1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5wcm9ibGVtLmtleWJvYXJkTW92ZW1lbnRNb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmlldy5mb2N1cygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gcmVkdWNlIGluZGVudFxuICAgICAgICAgICAgICAgIHRoaXMuaW5kZW50ID0gdGhpcy5pbmRlbnQgLSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnN0YXRlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnVwZGF0ZVZpZXcoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBNb3ZlIGJsb2NrIHVwXG4gICAgbW92ZVVwKCkge1xuICAgICAgICBpZiAodGhpcy5pblNvdXJjZUFyZWEoKSkge1xuICAgICAgICAgICAgbGV0IGJsb2NrcyA9IHRoaXMucHJvYmxlbS5zb3VyY2VCbG9ja3MoKTtcbiAgICAgICAgICAgIHZhciBvZmZzZXQgPSB0aGlzLnZlcnRpY2FsT2Zmc2V0KCk7XG4gICAgICAgICAgICB2YXIgdmFsaWRTb3VyY2VJbmRleGVzID0gdGhpcy52YWxpZFNvdXJjZUluZGV4ZXMoKTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmFsaWRTb3VyY2VJbmRleGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID1cbiAgICAgICAgICAgICAgICAgICAgdmFsaWRTb3VyY2VJbmRleGVzW3ZhbGlkU291cmNlSW5kZXhlcy5sZW5ndGggLSAxIC0gaV07XG4gICAgICAgICAgICAgICAgaWYgKGluZGV4IDwgYmxvY2tzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYmxvY2sgPSBibG9ja3NbaW5kZXhdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYmxvY2sudmVydGljYWxPZmZzZXQoKSA8IG9mZnNldCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnRleHRNb3ZpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnNvdXJjZUFyZWEuaW5zZXJ0QmVmb3JlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudmlldyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBibG9jay52aWV3LFxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5wcm9ibGVtLmtleWJvYXJkTW92ZW1lbnRNb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52aWV3LmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0uc3RhdGUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0udXBkYXRlVmlldygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgYmxvY2tzID0gdGhpcy5wcm9ibGVtLmFuc3dlckJsb2NrcygpO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBibG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoYmxvY2tzW2ldLnZpZXcuaWQgPT0gdGhpcy52aWV3LmlkKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS50ZXh0TW92aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLmFuc3dlckFyZWEuaW5zZXJ0QmVmb3JlKFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52aWV3LFxuICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2tzW2kgLSAxXS52aWV3LFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMucHJvYmxlbS5rZXlib2FyZE1vdmVtZW50TW9kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52aWV3LmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnN0YXRlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0udXBkYXRlVmlldygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBNb3ZlIGJsb2NrIHJpZ2h0XG4gICAgbW92ZVJpZ2h0KCkge1xuICAgICAgICBpZiAodGhpcy5pblNvdXJjZUFyZWEoKSkge1xuICAgICAgICAgICAgLy8gbW92ZSB0byBhbnN3ZXIgYXJlYVxuICAgICAgICAgICAgdGhpcy5pbmRlbnQgPSAwO1xuICAgICAgICAgICAgdmFyIG9mZnNldCA9IHRoaXMudmVydGljYWxPZmZzZXQoKTtcbiAgICAgICAgICAgIHZhciBhbnN3ZXJCbG9ja3MgPSB0aGlzLnByb2JsZW0uYW5zd2VyQmxvY2tzKCk7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFuc3dlckJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBpdGVtID0gYW5zd2VyQmxvY2tzW2ldO1xuICAgICAgICAgICAgICAgIHZhciBpdGVtT2Zmc2V0ID0gaXRlbS52ZXJ0aWNhbE9mZnNldCgpO1xuICAgICAgICAgICAgICAgIGlmIChpdGVtT2Zmc2V0ID49IG9mZnNldCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0udGV4dE1vdmluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS5hbnN3ZXJBcmVhLmluc2VydEJlZm9yZSh0aGlzLnZpZXcsIGl0ZW0udmlldyk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5wcm9ibGVtLmtleWJvYXJkTW92ZW1lbnRNb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnZpZXcuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0uc3RhdGUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS51cGRhdGVWaWV3KCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucHJvYmxlbS50ZXh0TW92aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMucHJvYmxlbS5hbnN3ZXJBcmVhLmFwcGVuZENoaWxkKHRoaXMudmlldyk7XG4gICAgICAgICAgICBpZiAoIXRoaXMucHJvYmxlbS5rZXlib2FyZE1vdmVtZW50TW9kZSkge1xuICAgICAgICAgICAgICAgIHRoaXMudmlldy5mb2N1cygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnN0YXRlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnVwZGF0ZVZpZXcoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGluIGFuc3dlciBhcmVhOiBpbmNyZWFzZSB0aGUgaW5kZW50XG4gICAgICAgICAgICBpZiAodGhpcy5pbmRlbnQgIT09IHRoaXMucHJvYmxlbS5pbmRlbnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmluZGVudCA9IHRoaXMuaW5kZW50ICsgMTtcbiAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0uc3RhdGUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnVwZGF0ZVZpZXcoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBNb3ZlIGJsb2NrIGRvd25cbiAgICBtb3ZlRG93bigpIHtcbiAgICAgICAgaWYgKHRoaXMuaW5Tb3VyY2VBcmVhKCkpIHtcbiAgICAgICAgICAgIGxldCBibG9ja3MgPSB0aGlzLnByb2JsZW0uc291cmNlQmxvY2tzKCk7XG4gICAgICAgICAgICB2YXIgdmFsaWRTb3VyY2VJbmRleGVzID0gdGhpcy52YWxpZFNvdXJjZUluZGV4ZXMoKTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGJsb2Nrc1tpXS52aWV3LmlkID09IHRoaXMudmlldy5pZCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbXlJbmRleCA9IGk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2YWxpZFNvdXJjZUluZGV4ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSB2YWxpZFNvdXJjZUluZGV4ZXNbaV07XG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ID09IGJsb2Nrcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnRleHRNb3ZpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0uc291cmNlQXJlYS5hcHBlbmRDaGlsZCh0aGlzLnZpZXcpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMucHJvYmxlbS5rZXlib2FyZE1vdmVtZW50TW9kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52aWV3LmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnN0YXRlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0udXBkYXRlVmlldygpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGluZGV4IC0gbXlJbmRleCA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnRleHRNb3ZpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0uc291cmNlQXJlYS5pbnNlcnRCZWZvcmUoXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnZpZXcsXG4gICAgICAgICAgICAgICAgICAgICAgICBibG9ja3NbaW5kZXhdLnZpZXcsXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5wcm9ibGVtLmtleWJvYXJkTW92ZW1lbnRNb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnZpZXcuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0uc3RhdGUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS51cGRhdGVWaWV3KCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBibG9ja3MgPSB0aGlzLnByb2JsZW0uYW5zd2VyQmxvY2tzKCk7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChibG9ja3NbaV0udmlldy5pZCA9PSB0aGlzLnZpZXcuaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGkgPT0gYmxvY2tzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGkgPT0gYmxvY2tzLmxlbmd0aCAtIDIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS50ZXh0TW92aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS5hbnN3ZXJBcmVhLmFwcGVuZENoaWxkKHRoaXMudmlldyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0udGV4dE1vdmluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0uYW5zd2VyQXJlYS5pbnNlcnRCZWZvcmUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52aWV3LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsb2Nrc1tpICsgMl0udmlldyxcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLnByb2JsZW0ua2V5Ym9hcmRNb3ZlbWVudE1vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudmlldy5mb2N1cygpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS5zdGF0ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnVwZGF0ZVZpZXcoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gTW92ZSBzZWxlY3Rpb24gbGVmdFxuICAgIHNlbGVjdExlZnQoKSB7XG4gICAgICAgIGlmICghdGhpcy5pblNvdXJjZUFyZWEoKSkge1xuICAgICAgICAgICAgdmFyIG9mZnNldCA9IHRoaXMudmVydGljYWxPZmZzZXQoKTtcbiAgICAgICAgICAgIHZhciBzb3VyY2VCbG9ja3MgPSB0aGlzLnByb2JsZW0uZW5hYmxlZFNvdXJjZUJsb2NrcygpO1xuICAgICAgICAgICAgaWYgKHNvdXJjZUJsb2Nrcy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGNob29zZU5leHQgPSBzb3VyY2VCbG9ja3NbMF07XG4gICAgICAgICAgICB2YXIgY2hvb3NlT2Zmc2V0ID0gY2hvb3NlTmV4dC52ZXJ0aWNhbE9mZnNldCgpIC0gb2Zmc2V0O1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBzb3VyY2VCbG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IHNvdXJjZUJsb2Nrc1tpXTtcbiAgICAgICAgICAgICAgICB2YXIgaXRlbU9mZnNldCA9IGl0ZW0udmVydGljYWxPZmZzZXQoKSAtIG9mZnNldDtcbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5hYnMoaXRlbU9mZnNldCkgPCBNYXRoLmFicyhjaG9vc2VPZmZzZXQpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNob29zZU5leHQgPSBpdGVtO1xuICAgICAgICAgICAgICAgICAgICBjaG9vc2VPZmZzZXQgPSBpdGVtT2Zmc2V0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucHJvYmxlbS5zZWxlY3RLZXlib2FyZEJsb2NrKGNob29zZU5leHQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIE1vdmUgc2VsZWN0aW9uIHVwXG4gICAgc2VsZWN0VXAoKSB7XG4gICAgICAgIHZhciBjaG9vc2VOZXh0ID0gZmFsc2U7XG4gICAgICAgIHZhciBibG9ja3M7XG4gICAgICAgIGlmICh0aGlzLmluU291cmNlQXJlYSgpKSB7XG4gICAgICAgICAgICBibG9ja3MgPSB0aGlzLnByb2JsZW0uZW5hYmxlZFNvdXJjZUJsb2NrcygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYmxvY2tzID0gdGhpcy5wcm9ibGVtLmVuYWJsZWRBbnN3ZXJCbG9ja3MoKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBpID0gYmxvY2tzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICB2YXIgaXRlbSA9IGJsb2Nrc1tpXTtcbiAgICAgICAgICAgIGlmIChjaG9vc2VOZXh0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnNlbGVjdEtleWJvYXJkQmxvY2soaXRlbSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChpdGVtLnZpZXcuaWQgPT0gdGhpcy52aWV3LmlkKSB7XG4gICAgICAgICAgICAgICAgICAgIGNob29zZU5leHQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBNb3ZlIHNlbGVjdGlvbiByaWdodFxuICAgIHNlbGVjdFJpZ2h0KCkge1xuICAgICAgICBpZiAodGhpcy5pblNvdXJjZUFyZWEoKSkge1xuICAgICAgICAgICAgdmFyIG9mZnNldCA9IHRoaXMudmVydGljYWxPZmZzZXQoKTtcbiAgICAgICAgICAgIHZhciBibG9ja3MgPSB0aGlzLnByb2JsZW0uZW5hYmxlZEFuc3dlckJsb2NrcygpO1xuICAgICAgICAgICAgaWYgKGJsb2Nrcy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGNob29zZU5leHQgPSBibG9ja3NbMF07XG4gICAgICAgICAgICB2YXIgY2hvb3NlT2Zmc2V0ID0gY2hvb3NlTmV4dC52ZXJ0aWNhbE9mZnNldCgpIC0gb2Zmc2V0O1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBibG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IGJsb2Nrc1tpXTtcbiAgICAgICAgICAgICAgICB2YXIgaXRlbU9mZnNldCA9IGl0ZW0udmVydGljYWxPZmZzZXQoKSAtIG9mZnNldDtcbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5hYnMoaXRlbU9mZnNldCkgPCBNYXRoLmFicyhjaG9vc2VPZmZzZXQpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNob29zZU5leHQgPSBpdGVtO1xuICAgICAgICAgICAgICAgICAgICBjaG9vc2VPZmZzZXQgPSBpdGVtT2Zmc2V0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucHJvYmxlbS5zZWxlY3RLZXlib2FyZEJsb2NrKGNob29zZU5leHQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIE1vdmUgc2VsZWN0aW9uIGRvd25cbiAgICBzZWxlY3REb3duKCkge1xuICAgICAgICB2YXIgY2hvb3NlTmV4dCA9IGZhbHNlO1xuICAgICAgICB2YXIgYmxvY2tzO1xuICAgICAgICBpZiAodGhpcy5pblNvdXJjZUFyZWEoKSkge1xuICAgICAgICAgICAgYmxvY2tzID0gdGhpcy5wcm9ibGVtLmVuYWJsZWRTb3VyY2VCbG9ja3MoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGJsb2NrcyA9IHRoaXMucHJvYmxlbS5lbmFibGVkQW5zd2VyQmxvY2tzKCk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBibG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBpdGVtID0gYmxvY2tzW2ldO1xuICAgICAgICAgICAgaWYgKGNob29zZU5leHQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0uc2VsZWN0S2V5Ym9hcmRCbG9jayhpdGVtKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0udmlldy5pZCA9PSB0aGlzLnZpZXcuaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgY2hvb3NlTmV4dCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8vIFRvZ2dsZSB3aGV0aGVyIHRvIG1vdmUgdGhpcyBibG9ja1xuICAgIHRvZ2dsZU1vdmUoKSB7XG4gICAgICAgIGlmICh0aGlzLnByb2JsZW0udGV4dE1vdmUpIHtcbiAgICAgICAgICAgIHRoaXMudmlldy5jbGFzc0xpc3QucmVtb3ZlKFwidXBcIik7XG4gICAgICAgICAgICB0aGlzLnZpZXcuY2xhc3NMaXN0LmFkZChcImRvd25cIik7XG4gICAgICAgICAgICB0aGlzLnByb2JsZW0udGV4dE1vdmUgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMucHJvYmxlbS5sb2dNb3ZlKFwia21vdmVcIik7XG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNQbGFjZWhvbGRlcikge1xuICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS51cGRhdGVQbGFjZWhvbGRlcnMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudmlldy5jbGFzc0xpc3QucmVtb3ZlKFwiZG93blwiKTtcbiAgICAgICAgICAgIHRoaXMudmlldy5jbGFzc0xpc3QuYWRkKFwidXBcIik7XG4gICAgICAgICAgICB0aGlzLnByb2JsZW0udGV4dE1vdmUgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5wcm9ibGVtLmVudGVyS2V5Ym9hcmRNb3ZlbWVudE1vZGUodGhpcyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gQW5zd2VyIGEgc3RyaW5nIHRoYXQgcmVwcmVzZW50cyB0aGlzIGNvZGVibG9jayBmb3Igc2F2aW5nXG4gICAgaGFzaCgpIHtcbiAgICAgICAgdmFyIGhhc2ggPSBcIlwiO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGhhc2ggKz0gdGhpcy5saW5lc1tpXS5pbmRleCArIFwiX1wiO1xuICAgICAgICB9XG4gICAgICAgIGhhc2ggKz0gdGhpcy5pbmRlbnQ7XG4gICAgICAgIHJldHVybiBoYXNoO1xuICAgIH1cbiAgICAvLyBBbnN3ZXIgd2hhdCB0aGUgaW5kZW50IHNob3VsZCBiZSBmb3IgdGhlIHNvbHV0aW9uXG4gICAgc29sdXRpb25JbmRlbnQoKSB7XG4gICAgICAgIHZhciBzaGFyZWRJbmRlbnQgPSB0aGlzLmxpbmVzWzBdLmluZGVudDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCB0aGlzLmxpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBzaGFyZWRJbmRlbnQgPSBNYXRoLm1pbihzaGFyZWRJbmRlbnQsIHRoaXMubGluZXNbaV0uaW5kZW50KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc2hhcmVkSW5kZW50O1xuICAgIH1cbn1cbiIsImltcG9ydCBMaW5lQmFzZWRHcmFkZXIgZnJvbSBcIi4vbGluZUdyYWRlclwiO1xuaW1wb3J0IHsgRGlHcmFwaCwgaGFzUGF0aCwgaXNEaXJlY3RlZEFjeWNsaWNHcmFwaCB9IGZyb20gXCIuL2RhZ0hlbHBlcnNcIjtcblxuZnVuY3Rpb24gZ3JhcGhUb05YKGFuc3dlckxpbmVzKSB7XG4gICAgdmFyIGdyYXBoID0gbmV3IERpR3JhcGgoKTtcbiAgICBmb3IgKGxldCBsaW5lMSBvZiBhbnN3ZXJMaW5lcykge1xuICAgICAgICBncmFwaC5hZGROb2RlKGxpbmUxLnRhZyk7XG4gICAgICAgIGZvciAobGV0IGxpbmUydGFnIG9mIGxpbmUxLmRlcGVuZHMpIHtcbiAgICAgICAgICAgIC8vIHRoZSBkZXBlbmRzIGdyYXBoIGxpc3RzIHRoZSAqaW5jb21pbmcqIGVkZ2VzIG9mIGEgbm9kZVxuICAgICAgICAgICAgZ3JhcGguYWRkRWRnZShsaW5lMnRhZywgbGluZTEudGFnKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZ3JhcGg7XG59XG5cbmZ1bmN0aW9uIGlzVmVydGV4Q292ZXIoZ3JhcGgsIHZlcnRleENvdmVyKSB7XG4gICAgZm9yIChsZXQgZWRnZSBvZiBncmFwaC5lZGdlcygpKSB7XG4gICAgICAgIGlmICghKHZlcnRleENvdmVyLmhhcyhlZGdlWzBdKSB8fCB2ZXJ0ZXhDb3Zlci5oYXMoZWRnZVsxXSkpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG59XG5cbi8vIEZpbmQgYWxsIHN1YnNldHMgb2YgdGhlIHNldCB1c2luZyB0aGUgY29ycmVzcG9uZGVuY2Ugb2Ygc3Vic2V0cyBvZlxuLy8gYSBzZXQgdG8gYmluYXJ5IHN0cmluZyB3aG9zZSBsZW5ndGggYXJlIHRoZSBzaXplIG9mIHRoZSBzZXRcbmZ1bmN0aW9uIGFsbFN1YnNldHMoYXJyKSB7XG4gICAgbGV0IHN1YnNldHMgPSB7fTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8PSBhcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgc3Vic2V0c1tpXSA9IFtdO1xuICAgIH1cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IE1hdGgucG93KDIsIGFyci5sZW5ndGgpOyBpKyspIHtcbiAgICAgICAgbGV0IGJpbiA9IGkudG9TdHJpbmcoMik7XG4gICAgICAgIHdoaWxlIChiaW4ubGVuZ3RoIDwgYXJyLmxlbmd0aCkge1xuICAgICAgICAgICAgYmluID0gXCIwXCIgKyBiaW47XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHN1YnNldCA9IG5ldyBTZXQoKTtcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBiaW4ubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIGlmIChiaW5bal0gPT0gXCIxXCIpIHtcbiAgICAgICAgICAgICAgICBzdWJzZXQuYWRkKGFycltqXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgc3Vic2V0c1tzdWJzZXQuc2l6ZV0ucHVzaChzdWJzZXQpO1xuICAgIH1cbiAgICByZXR1cm4gc3Vic2V0cztcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgREFHR3JhZGVyIGV4dGVuZHMgTGluZUJhc2VkR3JhZGVyIHtcbiAgICBpbnZlcnNlTElTSW5kaWNlcyhhcnIsIGluU29sdXRpb24pIHtcbiAgICAgICAgLy8gRm9yIG1vcmUgZGV0YWlscyBhbmQgYSBwcm9vZiBvZiB0aGUgY29ycmVjdG5lc3Mgb2YgdGhlIGFsZ29yaXRobSwgc2VlIHRoZSBwYXBlcjogaHR0cHM6Ly9hcnhpdi5vcmcvYWJzLzIyMDQuMDQxOTZcblxuICAgICAgICB2YXIgc29sdXRpb24gPSB0aGlzLnByb2JsZW0uc29sdXRpb247XG4gICAgICAgIHZhciBhbnN3ZXJMaW5lcyA9IGluU29sdXRpb24ubWFwKChibG9jaykgPT4gYmxvY2subGluZXNbMF0pOyAvLyBhc3N1bWUgTk9UIGFkYXB0aXZlIGZvciBEQUcgZ3JhZGluZyAoZm9yIG5vdylcblxuICAgICAgICBsZXQgZ3JhcGggPSBncmFwaFRvTlgoc29sdXRpb24pO1xuXG4gICAgICAgIGxldCBzZWVuID0gbmV3IFNldCgpO1xuICAgICAgICBsZXQgcHJvYmxlbWF0aWNTdWJncmFwaCA9IG5ldyBEaUdyYXBoKCk7XG4gICAgICAgIGZvciAobGV0IGxpbmUxIG9mIGFuc3dlckxpbmVzKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBsaW5lMiBvZiBzZWVuKSB7XG4gICAgICAgICAgICAgICAgbGV0IHByb2JsZW1hdGljID0gaGFzUGF0aChncmFwaCwge1xuICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IGxpbmUxLnRhZyxcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiBsaW5lMi50YWcsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgaWYgKHByb2JsZW1hdGljKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb2JsZW1hdGljU3ViZ3JhcGguYWRkRWRnZShsaW5lMS50YWcsIGxpbmUyLnRhZyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzZWVuLmFkZChsaW5lMSk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgbXZjID0gbnVsbDtcbiAgICAgICAgbGV0IHN1YnNldHMgPSBhbGxTdWJzZXRzKHByb2JsZW1hdGljU3ViZ3JhcGgubm9kZXMoKSk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDw9IHByb2JsZW1hdGljU3ViZ3JhcGgubnVtYmVyT2ZOb2RlcygpOyBpKyspIHtcbiAgICAgICAgICAgIGZvciAobGV0IHN1YnNldCBvZiBzdWJzZXRzW2ldKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzVmVydGV4Q292ZXIocHJvYmxlbWF0aWNTdWJncmFwaCwgc3Vic2V0KSkge1xuICAgICAgICAgICAgICAgICAgICBtdmMgPSBzdWJzZXQ7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChtdmMgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGluZGljZXMgPSBbLi4ubXZjXS5tYXAoKHRhZykgPT4ge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhbnN3ZXJMaW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChhbnN3ZXJMaW5lc1tpXS50YWcgPT09IHRhZykgcmV0dXJuIGk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gaW5kaWNlcztcbiAgICB9XG5cbiAgICBjaGVja0NvcnJlY3RJbmRlbnRhdGlvbigpIHtcbiAgICAgICAgaWYgKCF0aGlzLnByb2JsZW0udXNlc0luZGVudGF0aW9uKCkpIHJldHVybiB0cnVlO1xuXG4gICAgICAgIHRoaXMuaW5kZW50TGVmdCA9IFtdO1xuICAgICAgICB0aGlzLmluZGVudFJpZ2h0ID0gW107XG4gICAgICAgIC8vIEZvciBkYWcgcHJvYmxlbXMsIG9ubHkgY2hlY2sgdGhlIGluZGVudGF0aW9uIG9mIGVhY2ggYmxvY2sgaW4gdGhlIHByb2JsZW1cbiAgICAgICAgZm9yIChjb25zdCBibG9jayBvZiB0aGlzLnByb2JsZW0uYmxvY2tzKSB7XG4gICAgICAgICAgICAvLyBTa2lwIGRpc3RyYWN0b3IgYmxvY2tzXG4gICAgICAgICAgICBpZiAoYmxvY2suaXNEaXN0cmFjdG9yKCkpIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICBjb25zdCBjdXJJbmRlbnQgPSBibG9jay5pbmRlbnQ7XG4gICAgICAgICAgICBjb25zdCBleHBlY3RlZEluZGVudCA9IGJsb2NrLnNvbHV0aW9uSW5kZW50KCk7XG4gICAgICAgICAgICAvLyBJZiBtaXNzbWF0Y2gsIGFkZCBmaXJzdCBsaW5lIG9mIGJsb2NrIHRvIHRoZSBjb3JyZWN0IGluZGVudCBsaXN0IGZvclxuICAgICAgICAgICAgLy8gVUkgdXBkYXRpbmdcbiAgICAgICAgICAgIGlmIChjdXJJbmRlbnQgPCBleHBlY3RlZEluZGVudClcbiAgICAgICAgICAgICAgICB0aGlzLmluZGVudFJpZ2h0LnB1c2goYmxvY2subGluZXNbMF0pO1xuICAgICAgICAgICAgZWxzZSBpZiAoY3VySW5kZW50ID4gZXhwZWN0ZWRJbmRlbnQpXG4gICAgICAgICAgICAgICAgdGhpcy5pbmRlbnRMZWZ0LnB1c2goYmxvY2subGluZXNbMF0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5pbmNvcnJlY3RJbmRlbnRzID1cbiAgICAgICAgICAgIHRoaXMuaW5kZW50TGVmdC5sZW5ndGggKyB0aGlzLmluZGVudFJpZ2h0Lmxlbmd0aDtcblxuICAgICAgICByZXR1cm4gdGhpcy5pbmNvcnJlY3RJbmRlbnRzID09IDA7XG4gICAgfVxuXG4gICAgY2hlY2tDb3JyZWN0T3JkZXJpbmcoc29sdXRpb25MaW5lcywgYW5zd2VyTGluZXMpIHtcbiAgICAgICAgaWYgKCFpc0RpcmVjdGVkQWN5Y2xpY0dyYXBoKGdyYXBoVG9OWChzb2x1dGlvbkxpbmVzKSkpIHtcbiAgICAgICAgICAgIHRocm93IFwiRGVwZW5kZW5jeSBiZXR3ZWVuIGJsb2NrcyBkb2VzIG5vdCBmb3JtIGEgRGlyZWN0ZWQgQWN5Y2xpYyBHcmFwaDsgUHJvYmxlbSB1bnNvbHZhYmxlLlwiO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHNlZW4gPSBuZXcgU2V0KCk7XG4gICAgICAgIGxldCBpc0NvcnJlY3RPcmRlciA9IHRydWU7XG4gICAgICAgIHRoaXMuY29ycmVjdExpbmVzID0gMDtcbiAgICAgICAgdGhpcy5zb2x1dGlvbkxlbmd0aCA9IHNvbHV0aW9uTGluZXMubGVuZ3RoO1xuICAgICAgICBsZXQgbG9vcExpbWl0ID0gTWF0aC5taW4oc29sdXRpb25MaW5lcy5sZW5ndGgsIGFuc3dlckxpbmVzLmxlbmd0aCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbG9vcExpbWl0OyBpKyspIHtcbiAgICAgICAgICAgIGxldCBsaW5lID0gYW5zd2VyTGluZXNbaV07XG4gICAgICAgICAgICBpZiAobGluZS5kaXN0cmFjdG9yKSB7XG4gICAgICAgICAgICAgICAgaXNDb3JyZWN0T3JkZXIgPSBmYWxzZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBsaW5lLmRlcGVuZHMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFzZWVuLmhhcyhsaW5lLmRlcGVuZHNbal0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpc0NvcnJlY3RPcmRlciA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlzQ29ycmVjdE9yZGVyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb3JyZWN0TGluZXMgKz0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlZW4uYWRkKGxpbmUudGFnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaXNDb3JyZWN0T3JkZXI7XG4gICAgfVxufVxuIiwiaW1wb3J0IFBhcnNvbnNCbG9jayBmcm9tIFwiLi9wYXJzb25zQmxvY2tcIjtcbmltcG9ydCBQYXJzb25zTGluZSBmcm9tIFwiLi9wYXJzb25zTGluZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQbGFjZWhvbGRlckJsb2NrIGV4dGVuZHMgUGFyc29uc0Jsb2NrIHtcbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJvYmxlbSxcbiAgICAgICAgcGxhY2Vob2xkZXJMaW5lcyxcbiAgICAgICAgcGxhY2Vob2xkZXJTaXplLFxuICAgICAgICBhZnRlclNldHRsZWRCbG9ja0NvdW50LFxuICAgICkge1xuICAgICAgICAvLyBwcm9ibGVtOiBQYXJzb25zIGluc3RhbmNlXG4gICAgICAgIC8vIHNpemU6IGhvdyBtYW55IGJsb2NrcyBpdCBpcyBob2xkaW5nXG5cbiAgICAgICAgLy8gaGF2ZSB0byBoYXZlIGF0IGxlYXN0IG9uZSBwYXJzb25zbGluZXMsIG90aGVyd2lzZSB3aWxsIGJlIGVycm9yIGluIFBhcnNvbnNCbG9jay5cbiAgICAgICAgc3VwZXIocHJvYmxlbSwgcGxhY2Vob2xkZXJMaW5lcyk7XG4gICAgICAgIHRoaXMucGxhY2Vob2xkZXJMaW5lcyA9IHBsYWNlaG9sZGVyTGluZXM7XG4gICAgICAgIHRoaXMuYWZ0ZXJTZXR0bGVkQmxvY2tDb3VudCA9IGFmdGVyU2V0dGxlZEJsb2NrQ291bnQ7XG5cbiAgICAgICAgLy8gY3JlYXRlIGEgbm9ybWFsIHBhcnNvbnMgYmxvY2ssIGJ1dCB1c2UgY3NzIHRvIGNvbnRyb2wgdmlzaWJpbGl0eSBvZiBub3JtYWwgY29udGVudFxuICAgICAgICB0aGlzLnZpZXcuY2xhc3NMaXN0LmFkZChcInBsYWNlaG9sZGVyLWJsb2NrXCIsIFwiZGlzYWJsZWRcIik7XG5cbiAgICAgICAgLy8gY3JlYXRlIGEgbmV3IGRpdiBkaXNwbGF5aW5nIGhvdyBtYW55IGJsb2NrcyBhcmUgbWlzc2luZ1xuICAgICAgICB0aGlzLnBsYWNlaG9sZGVyU2l6ZSA9IHBsYWNlaG9sZGVyU2l6ZTtcbiAgICAgICAgdmFyIGNvbnRlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBjb250ZW50LmNsYXNzTGlzdC5hZGQoXCJwbGFjZWhvbGRlci10ZXh0XCIpO1xuICAgICAgICBpZiAocGxhY2Vob2xkZXJTaXplID4gMSkge1xuICAgICAgICAgICAgY29udGVudC5pbm5lclRleHQgPSBgJHtwbGFjZWhvbGRlclNpemV9IGJsb2NrcyBhcmUgbWlzc2luZyBoZXJlYDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnRlbnQuaW5uZXJUZXh0ID0gYCR7cGxhY2Vob2xkZXJTaXplfSBibG9jayBpcyBtaXNzaW5nIGhlcmVgO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudmlldy5hcHBlbmQoY29udGVudCk7XG5cbiAgICAgICAgdGhpcy5pc1BsYWNlaG9sZGVyID0gdHJ1ZTtcbiAgICB9XG59XG4iLCIvLyBUT0RPIC0gSG93IG11Y2ggb2YgdGhpcyBpcyBuZWVkZWQ/IExvdHMgb2Ygb3ZlcmxhcCB3aXRoIHdoYXQgc3ludGF4IGhpZ2hsaWdodGluZ1xyXG4vLyB2aWEgcHJldGV4dCB0aGVtZSBkb2VzLi4uXHJcblxyXG5mdW5jdGlvbiBIKCkge1xyXG4gICAgdmFyIHggPVxyXG4gICAgICAgIG5hdmlnYXRvciAmJlxyXG4gICAgICAgIG5hdmlnYXRvci51c2VyQWdlbnQgJiZcclxuICAgICAgICAvXFxiTVNJRSA2XFwuLy50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xyXG4gICAgSCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB4O1xyXG4gICAgfTtcclxuICAgIHJldHVybiB4O1xyXG59XHJcbihmdW5jdGlvbigpIHtcclxuICAgIGZ1bmN0aW9uIHgoYikge1xyXG4gICAgICAgIGIgPSBiLnNwbGl0KC8gL2cpO1xyXG4gICAgICAgIHZhciBhID0ge307XHJcbiAgICAgICAgZm9yICh2YXIgYyA9IGIubGVuZ3RoOyAtLWMgPj0gMDsgKSB7XHJcbiAgICAgICAgICAgIHZhciBkID0gYltjXTtcclxuICAgICAgICAgICAgaWYgKGQpIGFbZF0gPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYTtcclxuICAgIH1cclxuICAgIHZhciB5ID0gXCJicmVhayBjb250aW51ZSBkbyBlbHNlIGZvciBpZiByZXR1cm4gd2hpbGUgXCIsXHJcbiAgICAgICAgVSA9XHJcbiAgICAgICAgICAgIHkgK1xyXG4gICAgICAgICAgICBcImF1dG8gY2FzZSBjaGFyIGNvbnN0IGRlZmF1bHQgZG91YmxlIGVudW0gZXh0ZXJuIGZsb2F0IGdvdG8gaW50IGxvbmcgcmVnaXN0ZXIgc2hvcnQgc2lnbmVkIHNpemVvZiBzdGF0aWMgc3RydWN0IHN3aXRjaCB0eXBlZGVmIHVuaW9uIHVuc2lnbmVkIHZvaWQgdm9sYXRpbGUgXCIsXHJcbiAgICAgICAgRCA9XHJcbiAgICAgICAgICAgIFUgK1xyXG4gICAgICAgICAgICBcImNhdGNoIGNsYXNzIGRlbGV0ZSBmYWxzZSBpbXBvcnQgbmV3IG9wZXJhdG9yIHByaXZhdGUgcHJvdGVjdGVkIHB1YmxpYyB0aGlzIHRocm93IHRydWUgdHJ5IFwiLFxyXG4gICAgICAgIEkgPVxyXG4gICAgICAgICAgICBEICtcclxuICAgICAgICAgICAgXCJhbGlnbm9mIGFsaWduX3VuaW9uIGFzbSBheGlvbSBib29sIGNvbmNlcHQgY29uY2VwdF9tYXAgY29uc3RfY2FzdCBjb25zdGV4cHIgZGVjbHR5cGUgZHluYW1pY19jYXN0IGV4cGxpY2l0IGV4cG9ydCBmcmllbmQgaW5saW5lIGxhdGVfY2hlY2sgbXV0YWJsZSBuYW1lc3BhY2UgbnVsbHB0ciByZWludGVycHJldF9jYXN0IHN0YXRpY19hc3NlcnQgc3RhdGljX2Nhc3QgdGVtcGxhdGUgdHlwZWlkIHR5cGVuYW1lIHR5cGVvZiB1c2luZyB2aXJ0dWFsIHdjaGFyX3Qgd2hlcmUgXCIsXHJcbiAgICAgICAgSiA9XHJcbiAgICAgICAgICAgIEQgK1xyXG4gICAgICAgICAgICBcImJvb2xlYW4gYnl0ZSBleHRlbmRzIGZpbmFsIGZpbmFsbHkgaW1wbGVtZW50cyBpbXBvcnQgaW5zdGFuY2VvZiBudWxsIG5hdGl2ZSBwYWNrYWdlIHN0cmljdGZwIHN1cGVyIHN5bmNocm9uaXplZCB0aHJvd3MgdHJhbnNpZW50IFwiLFxyXG4gICAgICAgIFYgPVxyXG4gICAgICAgICAgICBKICtcclxuICAgICAgICAgICAgXCJhcyBiYXNlIGJ5IGNoZWNrZWQgZGVjaW1hbCBkZWxlZ2F0ZSBkZXNjZW5kaW5nIGV2ZW50IGZpeGVkIGZvcmVhY2ggZnJvbSBncm91cCBpbXBsaWNpdCBpbiBpbnRlcmZhY2UgaW50ZXJuYWwgaW50byBpcyBsb2NrIG9iamVjdCBvdXQgb3ZlcnJpZGUgb3JkZXJieSBwYXJhbXMgcmVhZG9ubHkgcmVmIHNieXRlIHNlYWxlZCBzdGFja2FsbG9jIHN0cmluZyBzZWxlY3QgdWludCB1bG9uZyB1bmNoZWNrZWQgdW5zYWZlIHVzaG9ydCB2YXIgXCIsXHJcbiAgICAgICAgSyA9XHJcbiAgICAgICAgICAgIEQgK1xyXG4gICAgICAgICAgICBcImRlYnVnZ2VyIGV2YWwgZXhwb3J0IGZ1bmN0aW9uIGdldCBudWxsIHNldCB1bmRlZmluZWQgdmFyIHdpdGggSW5maW5pdHkgTmFOIFwiLFxyXG4gICAgICAgIEwgPVxyXG4gICAgICAgICAgICBcImNhbGxlciBkZWxldGUgZGllIGRvIGR1bXAgZWxzaWYgZXZhbCBleGl0IGZvcmVhY2ggZm9yIGdvdG8gaWYgaW1wb3J0IGxhc3QgbG9jYWwgbXkgbmV4dCBubyBvdXIgcHJpbnQgcGFja2FnZSByZWRvIHJlcXVpcmUgc3ViIHVuZGVmIHVubGVzcyB1bnRpbCB1c2Ugd2FudGFycmF5IHdoaWxlIEJFR0lOIEVORCBcIixcclxuICAgICAgICBNID1cclxuICAgICAgICAgICAgeSArXHJcbiAgICAgICAgICAgIFwiYW5kIGFzIGFzc2VydCBjbGFzcyBkZWYgZGVsIGVsaWYgZXhjZXB0IGV4ZWMgZmluYWxseSBmcm9tIGdsb2JhbCBpbXBvcnQgaW4gaXMgbGFtYmRhIG5vbmxvY2FsIG5vdCBvciBwYXNzIHByaW50IHJhaXNlIHRyeSB3aXRoIHlpZWxkIEZhbHNlIFRydWUgTm9uZSBcIixcclxuICAgICAgICBOID1cclxuICAgICAgICAgICAgeSArXHJcbiAgICAgICAgICAgIFwiYWxpYXMgYW5kIGJlZ2luIGNhc2UgY2xhc3MgZGVmIGRlZmluZWQgZWxzaWYgZW5kIGVuc3VyZSBmYWxzZSBpbiBtb2R1bGUgbmV4dCBuaWwgbm90IG9yIHJlZG8gcmVzY3VlIHJldHJ5IHNlbGYgc3VwZXIgdGhlbiB0cnVlIHVuZGVmIHVubGVzcyB1bnRpbCB3aGVuIHlpZWxkIEJFR0lOIEVORCBcIixcclxuICAgICAgICBPID0geSArIFwiY2FzZSBkb25lIGVsaWYgZXNhYyBldmFsIGZpIGZ1bmN0aW9uIGluIGxvY2FsIHNldCB0aGVuIHVudGlsIFwiLFxyXG4gICAgICAgIFcgPSBJICsgViArIEsgKyBMICsgTSArIE4gKyBPO1xyXG4gICAgZnVuY3Rpb24gWChiKSB7XHJcbiAgICAgICAgcmV0dXJuIChiID49IFwiYVwiICYmIGIgPD0gXCJ6XCIpIHx8IChiID49IFwiQVwiICYmIGIgPD0gXCJaXCIpO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gdShiLCBhLCBjLCBkKSB7XHJcbiAgICAgICAgYi51bnNoaWZ0KGMsIGQgfHwgMCk7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgYS5zcGxpY2UuYXBwbHkoYSwgYik7XHJcbiAgICAgICAgfSBmaW5hbGx5IHtcclxuICAgICAgICAgICAgYi5zcGxpY2UoMCwgMik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgdmFyIFkgPSAoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBiID0gW1xyXG4gICAgICAgICAgICAgICAgICAgIFwiIVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiIT1cIixcclxuICAgICAgICAgICAgICAgICAgICBcIiE9PVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiI1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiJVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiJT1cIixcclxuICAgICAgICAgICAgICAgICAgICBcIiZcIixcclxuICAgICAgICAgICAgICAgICAgICBcIiYmXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCImJj1cIixcclxuICAgICAgICAgICAgICAgICAgICBcIiY9XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCIoXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCIqXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCIqPVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiKz1cIixcclxuICAgICAgICAgICAgICAgICAgICBcIixcIixcclxuICAgICAgICAgICAgICAgICAgICBcIi09XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCItPlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiL1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiLz1cIixcclxuICAgICAgICAgICAgICAgICAgICBcIjpcIixcclxuICAgICAgICAgICAgICAgICAgICBcIjo6XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCI7XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCI8XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCI8PFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiPDw9XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCI8PVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiPVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiPT1cIixcclxuICAgICAgICAgICAgICAgICAgICBcIj09PVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiPlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiPj1cIixcclxuICAgICAgICAgICAgICAgICAgICBcIj4+XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCI+Pj1cIixcclxuICAgICAgICAgICAgICAgICAgICBcIj4+PlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiPj4+PVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiP1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiQFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiW1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiXlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiXj1cIixcclxuICAgICAgICAgICAgICAgICAgICBcIl5eXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJeXj1cIixcclxuICAgICAgICAgICAgICAgICAgICBcIntcIixcclxuICAgICAgICAgICAgICAgICAgICBcInxcIixcclxuICAgICAgICAgICAgICAgICAgICBcInw9XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJ8fFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwifHw9XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJ+XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJicmVha1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiY2FzZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiY29udGludWVcIixcclxuICAgICAgICAgICAgICAgICAgICBcImRlbGV0ZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZG9cIixcclxuICAgICAgICAgICAgICAgICAgICBcImVsc2VcIixcclxuICAgICAgICAgICAgICAgICAgICBcImZpbmFsbHlcIixcclxuICAgICAgICAgICAgICAgICAgICBcImluc3RhbmNlb2ZcIixcclxuICAgICAgICAgICAgICAgICAgICBcInJldHVyblwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwidGhyb3dcIixcclxuICAgICAgICAgICAgICAgICAgICBcInRyeVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwidHlwZW9mXCJcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBhID1cclxuICAgICAgICAgICAgICAgICAgICBcIig/Oig/Oig/Ol58W14wLTkuXSlcXFxcLnsxLDN9KXwoPzooPzpefFteXFxcXCtdKVxcXFwrKXwoPzooPzpefFteXFxcXC1dKS0pXCI7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGMgPSAwOyBjIDwgYi5sZW5ndGg7ICsrYykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGQgPSBiW2NdO1xyXG4gICAgICAgICAgICAgICAgYSArPSBYKGQuY2hhckF0KDApKVxyXG4gICAgICAgICAgICAgICAgICAgID8gXCJ8XFxcXGJcIiArIGRcclxuICAgICAgICAgICAgICAgICAgICA6IFwifFwiICsgZC5yZXBsYWNlKC8oW149PD46Jl0pL2csIFwiXFxcXCQxXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGEgKz0gXCJ8XilcXFxccyokXCI7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUmVnRXhwKGEpO1xyXG4gICAgICAgIH0pKCksXHJcbiAgICAgICAgUCA9IC8mL2csXHJcbiAgICAgICAgUSA9IC88L2csXHJcbiAgICAgICAgUiA9IC8+L2csXHJcbiAgICAgICAgWiA9IC9cXFwiL2c7XHJcbiAgICBmdW5jdGlvbiAkKGIpIHtcclxuICAgICAgICByZXR1cm4gYlxyXG4gICAgICAgICAgICAucmVwbGFjZShQLCBcIiZhbXA7XCIpXHJcbiAgICAgICAgICAgIC5yZXBsYWNlKFEsIFwiJmx0O1wiKVxyXG4gICAgICAgICAgICAucmVwbGFjZShSLCBcIiZndDtcIilcclxuICAgICAgICAgICAgLnJlcGxhY2UoWiwgXCImcXVvdDtcIik7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBFKGIpIHtcclxuICAgICAgICByZXR1cm4gYlxyXG4gICAgICAgICAgICAucmVwbGFjZShQLCBcIiZhbXA7XCIpXHJcbiAgICAgICAgICAgIC5yZXBsYWNlKFEsIFwiJmx0O1wiKVxyXG4gICAgICAgICAgICAucmVwbGFjZShSLCBcIiZndDtcIik7XHJcbiAgICB9XHJcbiAgICB2YXIgYWEgPSAvJmx0Oy9nLFxyXG4gICAgICAgIGJhID0gLyZndDsvZyxcclxuICAgICAgICBjYSA9IC8mYXBvczsvZyxcclxuICAgICAgICBkYSA9IC8mcXVvdDsvZyxcclxuICAgICAgICBlYSA9IC8mYW1wOy9nLFxyXG4gICAgICAgIGZhID0gLyZuYnNwOy9nO1xyXG4gICAgZnVuY3Rpb24gZ2EoYikge1xyXG4gICAgICAgIHZhciBhID0gYi5pbmRleE9mKFwiJlwiKTtcclxuICAgICAgICBpZiAoYSA8IDApIHJldHVybiBiO1xyXG4gICAgICAgIGZvciAoLS1hOyAoYSA9IGIuaW5kZXhPZihcIiYjXCIsIGEgKyAxKSkgPj0gMDsgKSB7XHJcbiAgICAgICAgICAgIHZhciBjID0gYi5pbmRleE9mKFwiO1wiLCBhKTtcclxuICAgICAgICAgICAgaWYgKGMgPj0gMCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGQgPSBiLnN1YnN0cmluZyhhICsgMywgYyksXHJcbiAgICAgICAgICAgICAgICAgICAgZyA9IDEwO1xyXG4gICAgICAgICAgICAgICAgaWYgKGQgJiYgZC5jaGFyQXQoMCkgPT09IFwieFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZCA9IGQuc3Vic3RyaW5nKDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIGcgPSAxNjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZhciBlID0gcGFyc2VJbnQoZCwgZyk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWlzTmFOKGUpKVxyXG4gICAgICAgICAgICAgICAgICAgIGIgPVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBiLnN1YnN0cmluZygwLCBhKSArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFN0cmluZy5mcm9tQ2hhckNvZGUoZSkgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBiLnN1YnN0cmluZyhjICsgMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGJcclxuICAgICAgICAgICAgLnJlcGxhY2UoYWEsIFwiPFwiKVxyXG4gICAgICAgICAgICAucmVwbGFjZShiYSwgXCI+XCIpXHJcbiAgICAgICAgICAgIC5yZXBsYWNlKGNhLCBcIidcIilcclxuICAgICAgICAgICAgLnJlcGxhY2UoZGEsICdcIicpXHJcbiAgICAgICAgICAgIC5yZXBsYWNlKGVhLCBcIiZcIilcclxuICAgICAgICAgICAgLnJlcGxhY2UoZmEsIFwiIFwiKTtcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIFMoYikge1xyXG4gICAgICAgIHJldHVybiBcIlhNUFwiID09PSBiLnRhZ05hbWU7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiB6KGIsIGEpIHtcclxuICAgICAgICBzd2l0Y2ggKGIubm9kZVR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgdmFyIGMgPSBiLnRhZ05hbWUudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICAgICAgICAgIGEucHVzaChcIjxcIiwgYyk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBkID0gMDsgZCA8IGIuYXR0cmlidXRlcy5sZW5ndGg7ICsrZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBnID0gYi5hdHRyaWJ1dGVzW2RdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghZy5zcGVjaWZpZWQpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGEucHVzaChcIiBcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgeihnLCBhKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGEucHVzaChcIj5cIik7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBlID0gYi5maXJzdENoaWxkOyBlOyBlID0gZS5uZXh0U2libGluZykgeihlLCBhKTtcclxuICAgICAgICAgICAgICAgIGlmIChiLmZpcnN0Q2hpbGQgfHwgIS9eKD86YnJ8bGlua3xpbWcpJC8udGVzdChjKSlcclxuICAgICAgICAgICAgICAgICAgICBhLnB1c2goXCI8L1wiLCBjLCBcIj5cIik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgICAgYS5wdXNoKGIubmFtZS50b0xvd2VyQ2FzZSgpLCAnPVwiJywgJChiLnZhbHVlKSwgJ1wiJyk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgICAgICBjYXNlIDQ6XHJcbiAgICAgICAgICAgICAgICBhLnB1c2goRShiLm5vZGVWYWx1ZSkpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgdmFyIEYgPSBudWxsO1xyXG4gICAgZnVuY3Rpb24gaGEoYikge1xyXG4gICAgICAgIGlmIChudWxsID09PSBGKSB7XHJcbiAgICAgICAgICAgIHZhciBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIlBSRVwiKTtcclxuICAgICAgICAgICAgYS5hcHBlbmRDaGlsZChcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFxyXG4gICAgICAgICAgICAgICAgICAgICc8IURPQ1RZUEUgZm9vIFBVQkxJQyBcImZvbyBiYXJcIj5cXG48Zm9vIC8+J1xyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBGID0gIS88Ly50ZXN0KGEuaW5uZXJIVE1MKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKEYpIHtcclxuICAgICAgICAgICAgdmFyIGMgPSBiLmlubmVySFRNTDtcclxuICAgICAgICAgICAgaWYgKFMoYikpIGMgPSBFKGMpO1xyXG4gICAgICAgICAgICByZXR1cm4gYztcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGQgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBnID0gYi5maXJzdENoaWxkOyBnOyBnID0gZy5uZXh0U2libGluZykgeihnLCBkKTtcclxuICAgICAgICByZXR1cm4gZC5qb2luKFwiXCIpO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gaWEoYikge1xyXG4gICAgICAgIHZhciBhID0gMDtcclxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oYykge1xyXG4gICAgICAgICAgICB2YXIgZCA9IG51bGwsXHJcbiAgICAgICAgICAgICAgICBnID0gMDtcclxuICAgICAgICAgICAgZm9yICh2YXIgZSA9IDAsIGggPSBjLmxlbmd0aDsgZSA8IGg7ICsrZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGYgPSBjLmNoYXJBdChlKTtcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAoZikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJcXHRcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFkKSBkID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGQucHVzaChjLnN1YnN0cmluZyhnLCBlKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpID0gYiAtIChhICUgYik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGEgKz0gaTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICg7IGkgPj0gMDsgaSAtPSBcIiAgICAgICAgICAgICAgICBcIi5sZW5ndGgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkLnB1c2goXCIgICAgICAgICAgICAgICAgXCIuc3Vic3RyaW5nKDAsIGkpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZyA9IGUgKyAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiXFxuXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGEgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICArK2E7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCFkKSByZXR1cm4gYztcclxuICAgICAgICAgICAgZC5wdXNoKGMuc3Vic3RyaW5nKGcpKTtcclxuICAgICAgICAgICAgcmV0dXJuIGQuam9pbihcIlwiKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgdmFyIGphID0gLyg/OltePF0rfDwhLS1bXFxzXFxTXSo/LS1cXD58PCFcXFtDREFUQVxcWyhbXFxzXFxTXSo/KVxcXVxcXT58PFxcLz9bYS16QS1aXVtePl0qPnw8KS9nLFxyXG4gICAgICAgIGthID0gL148IS0tLyxcclxuICAgICAgICBsYSA9IC9ePFxcW0NEQVRBXFxbLyxcclxuICAgICAgICBtYSA9IC9ePGJyXFxiL2k7XHJcbiAgICBmdW5jdGlvbiBuYShiKSB7XHJcbiAgICAgICAgdmFyIGEgPSBiLm1hdGNoKGphKSxcclxuICAgICAgICAgICAgYyA9IFtdLFxyXG4gICAgICAgICAgICBkID0gMCxcclxuICAgICAgICAgICAgZyA9IFtdO1xyXG4gICAgICAgIGlmIChhKVxyXG4gICAgICAgICAgICBmb3IgKHZhciBlID0gMCwgaCA9IGEubGVuZ3RoOyBlIDwgaDsgKytlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZiA9IGFbZV07XHJcbiAgICAgICAgICAgICAgICBpZiAoZi5sZW5ndGggPiAxICYmIGYuY2hhckF0KDApID09PSBcIjxcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChrYS50ZXN0KGYpKSBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobGEudGVzdChmKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjLnB1c2goZi5zdWJzdHJpbmcoOSwgZi5sZW5ndGggLSAzKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGQgKz0gZi5sZW5ndGggLSAxMjtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG1hLnRlc3QoZikpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYy5wdXNoKFwiXFxuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICArK2Q7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGcucHVzaChkLCBmKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGkgPSBnYShmKTtcclxuICAgICAgICAgICAgICAgICAgICBjLnB1c2goaSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZCArPSBpLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHNvdXJjZTogYy5qb2luKFwiXCIpLFxyXG4gICAgICAgICAgICB0YWdzOiBnXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIHYoYiwgYSkge1xyXG4gICAgICAgIHZhciBjID0ge307XHJcbiAgICAgICAgKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgZyA9IGIuY29uY2F0KGEpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBlID0gZy5sZW5ndGg7IC0tZSA+PSAwOyApIHtcclxuICAgICAgICAgICAgICAgIHZhciBoID0gZ1tlXSxcclxuICAgICAgICAgICAgICAgICAgICBmID0gaFszXTtcclxuICAgICAgICAgICAgICAgIGlmIChmKSBmb3IgKHZhciBpID0gZi5sZW5ndGg7IC0taSA+PSAwOyApIGNbZi5jaGFyQXQoaSldID0gaDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pKCk7XHJcbiAgICAgICAgdmFyIGQgPSBhLmxlbmd0aDtcclxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oZywgZSkge1xyXG4gICAgICAgICAgICBlID0gZSB8fCAwO1xyXG4gICAgICAgICAgICB2YXIgaCA9IFtlLCBcInBsblwiXSxcclxuICAgICAgICAgICAgICAgIGYgPSBcIlwiLFxyXG4gICAgICAgICAgICAgICAgaSA9IDAsXHJcbiAgICAgICAgICAgICAgICBqID0gZztcclxuICAgICAgICAgICAgd2hpbGUgKGoubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbyxcclxuICAgICAgICAgICAgICAgICAgICBtID0gbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBrLFxyXG4gICAgICAgICAgICAgICAgICAgIGwgPSBjW2ouY2hhckF0KDApXTtcclxuICAgICAgICAgICAgICAgIGlmIChsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgayA9IGoubWF0Y2gobFsxXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgbSA9IGtbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgbyA9IGxbMF07XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIG4gPSAwOyBuIDwgZDsgKytuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGwgPSBhW25dO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcCA9IGxbMl07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwICYmICFwLnRlc3QoZikpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBrID0gai5tYXRjaChsWzFdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG0gPSBrWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbyA9IGxbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAoIW0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbyA9IFwicGxuXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG0gPSBqLnN1YnN0cmluZygwLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBoLnB1c2goZSArIGksIG8pO1xyXG4gICAgICAgICAgICAgICAgaSArPSBtLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgIGogPSBqLnN1YnN0cmluZyhtLmxlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICBpZiAobyAhPT0gXCJjb21cIiAmJiAvXFxTLy50ZXN0KG0pKSBmID0gbTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gaDtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgdmFyIG9hID0gdihcclxuICAgICAgICBbXSxcclxuICAgICAgICBbXHJcbiAgICAgICAgICAgIFtcInBsblwiLCAvXltePF0rLywgbnVsbF0sXHJcbiAgICAgICAgICAgIFtcImRlY1wiLCAvXjwhXFx3W14+XSooPzo+fCQpLywgbnVsbF0sXHJcbiAgICAgICAgICAgIFtcImNvbVwiLCAvXjwhLS1bXFxzXFxTXSo/KD86LS1cXD58JCkvLCBudWxsXSxcclxuICAgICAgICAgICAgW1wic3JjXCIsIC9ePFxcP1tcXHNcXFNdKj8oPzpcXD8+fCQpLywgbnVsbF0sXHJcbiAgICAgICAgICAgIFtcInNyY1wiLCAvXjwlW1xcc1xcU10qPyg/OiU+fCQpLywgbnVsbF0sXHJcbiAgICAgICAgICAgIFtcInNyY1wiLCAvXjwoc2NyaXB0fHN0eWxlfHhtcClcXGJbXj5dKj5bXFxzXFxTXSo/PFxcL1xcMVxcYltePl0qPi9pLCBudWxsXSxcclxuICAgICAgICAgICAgW1widGFnXCIsIC9ePFxcLz9cXHdbXjw+XSo+LywgbnVsbF1cclxuICAgICAgICBdXHJcbiAgICApO1xyXG4gICAgZnVuY3Rpb24gcGEoYikge1xyXG4gICAgICAgIHZhciBhID0gb2EoYik7XHJcbiAgICAgICAgZm9yICh2YXIgYyA9IDA7IGMgPCBhLmxlbmd0aDsgYyArPSAyKVxyXG4gICAgICAgICAgICBpZiAoYVtjICsgMV0gPT09IFwic3JjXCIpIHtcclxuICAgICAgICAgICAgICAgIHZhciBkLCBnO1xyXG4gICAgICAgICAgICAgICAgZCA9IGFbY107XHJcbiAgICAgICAgICAgICAgICBnID0gYyArIDIgPCBhLmxlbmd0aCA/IGFbYyArIDJdIDogYi5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICB2YXIgZSA9IGIuc3Vic3RyaW5nKGQsIGcpLFxyXG4gICAgICAgICAgICAgICAgICAgIGggPSBlLm1hdGNoKC9eKDxbXj5dKj4pKFtcXHNcXFNdKikoPFxcL1tePl0qPikkLyk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaClcclxuICAgICAgICAgICAgICAgICAgICBhLnNwbGljZShcclxuICAgICAgICAgICAgICAgICAgICAgICAgYyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgMixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0YWdcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZCArIGhbMV0ubGVuZ3RoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInNyY1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkICsgaFsxXS5sZW5ndGggKyAoaFsyXSB8fCBcIlwiKS5sZW5ndGgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidGFnXCJcclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGE7XHJcbiAgICB9XHJcbiAgICB2YXIgcWEgPSB2KFxyXG4gICAgICAgIFtcclxuICAgICAgICAgICAgW1wiYXR2XCIsIC9eXFwnW15cXCddKig/OlxcJ3wkKS8sIG51bGwsIFwiJ1wiXSxcclxuICAgICAgICAgICAgW1wiYXR2XCIsIC9eXFxcIlteXFxcIl0qKD86XFxcInwkKS8sIG51bGwsICdcIiddLFxyXG4gICAgICAgICAgICBbXCJwdW5cIiwgL15bPD5cXC89XSsvLCBudWxsLCBcIjw+Lz1cIl1cclxuICAgICAgICBdLFxyXG4gICAgICAgIFtcclxuICAgICAgICAgICAgW1widGFnXCIsIC9eW1xcdzpcXC1dKy8sIC9ePC9dLFxyXG4gICAgICAgICAgICBbXCJhdHZcIiwgL15bXFx3XFwtXSsvLCAvXj0vXSxcclxuICAgICAgICAgICAgW1wiYXRuXCIsIC9eW1xcdzpcXC1dKy8sIG51bGxdLFxyXG4gICAgICAgICAgICBbXCJwbG5cIiwgL15cXHMrLywgbnVsbCwgXCIgXFx0XFxyXFxuXCJdXHJcbiAgICAgICAgXVxyXG4gICAgKTtcclxuICAgIGZ1bmN0aW9uIHJhKGIsIGEpIHtcclxuICAgICAgICBmb3IgKHZhciBjID0gMDsgYyA8IGEubGVuZ3RoOyBjICs9IDIpIHtcclxuICAgICAgICAgICAgdmFyIGQgPSBhW2MgKyAxXTtcclxuICAgICAgICAgICAgaWYgKGQgPT09IFwidGFnXCIpIHtcclxuICAgICAgICAgICAgICAgIHZhciBnLCBlO1xyXG4gICAgICAgICAgICAgICAgZyA9IGFbY107XHJcbiAgICAgICAgICAgICAgICBlID0gYyArIDIgPCBhLmxlbmd0aCA/IGFbYyArIDJdIDogYi5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICB2YXIgaCA9IGIuc3Vic3RyaW5nKGcsIGUpLFxyXG4gICAgICAgICAgICAgICAgICAgIGYgPSBxYShoLCBnKTtcclxuICAgICAgICAgICAgICAgIHUoZiwgYSwgYywgMik7XHJcbiAgICAgICAgICAgICAgICBjICs9IGYubGVuZ3RoIC0gMjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYTtcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIHIoYikge1xyXG4gICAgICAgIHZhciBhID0gW10sXHJcbiAgICAgICAgICAgIGMgPSBbXTtcclxuICAgICAgICBpZiAoYi50cmlwbGVRdW90ZWRTdHJpbmdzKVxyXG4gICAgICAgICAgICBhLnB1c2goW1xyXG4gICAgICAgICAgICAgICAgXCJzdHJcIixcclxuICAgICAgICAgICAgICAgIC9eKD86XFwnXFwnXFwnKD86W15cXCdcXFxcXXxcXFxcW1xcc1xcU118XFwnezEsMn0oPz1bXlxcJ10pKSooPzpcXCdcXCdcXCd8JCl8XFxcIlxcXCJcXFwiKD86W15cXFwiXFxcXF18XFxcXFtcXHNcXFNdfFxcXCJ7MSwyfSg/PVteXFxcIl0pKSooPzpcXFwiXFxcIlxcXCJ8JCl8XFwnKD86W15cXFxcXFwnXXxcXFxcW1xcc1xcU10pKig/OlxcJ3wkKXxcXFwiKD86W15cXFxcXFxcIl18XFxcXFtcXHNcXFNdKSooPzpcXFwifCQpKS8sXHJcbiAgICAgICAgICAgICAgICBudWxsLFxyXG4gICAgICAgICAgICAgICAgXCInXFxcIlwiXHJcbiAgICAgICAgICAgIF0pO1xyXG4gICAgICAgIGVsc2UgaWYgKGIubXVsdGlMaW5lU3RyaW5ncylcclxuICAgICAgICAgICAgYS5wdXNoKFtcclxuICAgICAgICAgICAgICAgIFwic3RyXCIsXHJcbiAgICAgICAgICAgICAgICAvXig/OlxcJyg/OlteXFxcXFxcJ118XFxcXFtcXHNcXFNdKSooPzpcXCd8JCl8XFxcIig/OlteXFxcXFxcXCJdfFxcXFxbXFxzXFxTXSkqKD86XFxcInwkKXxcXGAoPzpbXlxcXFxcXGBdfFxcXFxbXFxzXFxTXSkqKD86XFxgfCQpKS8sXHJcbiAgICAgICAgICAgICAgICBudWxsLFxyXG4gICAgICAgICAgICAgICAgXCInXFxcImBcIlxyXG4gICAgICAgICAgICBdKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIGEucHVzaChbXHJcbiAgICAgICAgICAgICAgICBcInN0clwiLFxyXG4gICAgICAgICAgICAgICAgL14oPzpcXCcoPzpbXlxcXFxcXCdcXHJcXG5dfFxcXFwuKSooPzpcXCd8JCl8XFxcIig/OlteXFxcXFxcXCJcXHJcXG5dfFxcXFwuKSooPzpcXFwifCQpKS8sXHJcbiAgICAgICAgICAgICAgICBudWxsLFxyXG4gICAgICAgICAgICAgICAgXCJcXFwiJ1wiXHJcbiAgICAgICAgICAgIF0pO1xyXG4gICAgICAgIGMucHVzaChbXCJwbG5cIiwgL14oPzpbXlxcJ1xcXCJcXGBcXC9cXCNdKykvLCBudWxsLCBcIiBcXHJcXG5cIl0pO1xyXG4gICAgICAgIGlmIChiLmhhc2hDb21tZW50cykgYS5wdXNoKFtcImNvbVwiLCAvXiNbXlxcclxcbl0qLywgbnVsbCwgXCIjXCJdKTtcclxuICAgICAgICBpZiAoYi5jU3R5bGVDb21tZW50cykgYy5wdXNoKFtcImNvbVwiLCAvXlxcL1xcL1teXFxyXFxuXSovLCBudWxsXSk7XHJcbiAgICAgICAgaWYgKGIucmVnZXhMaXRlcmFscylcclxuICAgICAgICAgICAgYy5wdXNoKFtcclxuICAgICAgICAgICAgICAgIFwic3RyXCIsXHJcbiAgICAgICAgICAgICAgICAvXlxcLyg/OlteXFxcXFxcKlxcL1xcW118XFxcXFtcXHNcXFNdfFxcWyg/OlteXFxdXFxcXF18XFxcXC4pKig/OlxcXXwkKSkrKD86XFwvfCQpLyxcclxuICAgICAgICAgICAgICAgIFlcclxuICAgICAgICAgICAgXSk7XHJcbiAgICAgICAgaWYgKGIuY1N0eWxlQ29tbWVudHMpIGMucHVzaChbXCJjb21cIiwgL15cXC9cXCpbXFxzXFxTXSo/KD86XFwqXFwvfCQpLywgbnVsbF0pO1xyXG4gICAgICAgIHZhciBkID0geChiLmtleXdvcmRzKTtcclxuICAgICAgICBiID0gbnVsbDtcclxuICAgICAgICB2YXIgZyA9IHYoYSwgYyksXHJcbiAgICAgICAgICAgIGUgPSB2KFxyXG4gICAgICAgICAgICAgICAgW10sXHJcbiAgICAgICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAgICAgW1wicGxuXCIsIC9eXFxzKy8sIG51bGwsIFwiIFxcclxcblwiXSxcclxuICAgICAgICAgICAgICAgICAgICBbXCJwbG5cIiwgL15bYS16XyRAXVthLXpfJEAwLTldKi9pLCBudWxsXSxcclxuICAgICAgICAgICAgICAgICAgICBbXCJsaXRcIiwgL14weFthLWYwLTldK1thLXpdL2ksIG51bGxdLFxyXG4gICAgICAgICAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJsaXRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgL14oPzpcXGQoPzpfXFxkKykqXFxkKig/OlxcLlxcZCopP3xcXC5cXGQrKSg/OmVbK1xcLV0/XFxkKyk/W2Etel0qL2ksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiMTIzNDU2Nzg5XCJcclxuICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgIFtcInB1blwiLCAvXlteXFxzXFx3XFwuJEBdKy8sIG51bGxdXHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgZnVuY3Rpb24gaChmLCBpKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgaS5sZW5ndGg7IGogKz0gMikge1xyXG4gICAgICAgICAgICAgICAgdmFyIG8gPSBpW2ogKyAxXTtcclxuICAgICAgICAgICAgICAgIGlmIChvID09PSBcInBsblwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG0sIGssIGwsIG47XHJcbiAgICAgICAgICAgICAgICAgICAgbSA9IGlbal07XHJcbiAgICAgICAgICAgICAgICAgICAgayA9IGogKyAyIDwgaS5sZW5ndGggPyBpW2ogKyAyXSA6IGYubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgICAgIGwgPSBmLnN1YnN0cmluZyhtLCBrKTtcclxuICAgICAgICAgICAgICAgICAgICBuID0gZShsLCBtKTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBwID0gMCwgdCA9IG4ubGVuZ3RoOyBwIDwgdDsgcCArPSAyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB3ID0gbltwICsgMV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3ID09PSBcInBsblwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgQSA9IG5bcF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQiA9IHAgKyAyIDwgdCA/IG5bcCArIDJdIDogbC5sZW5ndGgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcyA9IGYuc3Vic3RyaW5nKEEsIEIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHMgPT09IFwiLlwiKSBuW3AgKyAxXSA9IFwicHVuXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChzIGluIGQpIG5bcCArIDFdID0gXCJrd2RcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKC9eQD9bQS1aXVtBLVokXSpbYS16XVtBLVphLXokXSokLy50ZXN0KHMpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5bcCArIDFdID0gcy5jaGFyQXQoMCkgPT09IFwiQFwiID8gXCJsaXRcIiA6IFwidHlwXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdShuLCBpLCBqLCAyKTtcclxuICAgICAgICAgICAgICAgICAgICBqICs9IG4ubGVuZ3RoIC0gMjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gaTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGYpIHtcclxuICAgICAgICAgICAgdmFyIGkgPSBnKGYpO1xyXG4gICAgICAgICAgICBpID0gaChmLCBpKTtcclxuICAgICAgICAgICAgcmV0dXJuIGk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIHZhciBHID0gcih7XHJcbiAgICAgICAga2V5d29yZHM6IFcsXHJcbiAgICAgICAgaGFzaENvbW1lbnRzOiB0cnVlLFxyXG4gICAgICAgIGNTdHlsZUNvbW1lbnRzOiB0cnVlLFxyXG4gICAgICAgIG11bHRpTGluZVN0cmluZ3M6IHRydWUsXHJcbiAgICAgICAgcmVnZXhMaXRlcmFsczogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICBmdW5jdGlvbiBzYShiLCBhKSB7XHJcbiAgICAgICAgZm9yICh2YXIgYyA9IDA7IGMgPCBhLmxlbmd0aDsgYyArPSAyKSB7XHJcbiAgICAgICAgICAgIHZhciBkID0gYVtjICsgMV07XHJcbiAgICAgICAgICAgIGlmIChkID09PSBcInNyY1wiKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZywgZTtcclxuICAgICAgICAgICAgICAgIGcgPSBhW2NdO1xyXG4gICAgICAgICAgICAgICAgZSA9IGMgKyAyIDwgYS5sZW5ndGggPyBhW2MgKyAyXSA6IGIubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgdmFyIGggPSBHKGIuc3Vic3RyaW5nKGcsIGUpKTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGYgPSAwLCBpID0gaC5sZW5ndGg7IGYgPCBpOyBmICs9IDIpIGhbZl0gKz0gZztcclxuICAgICAgICAgICAgICAgIHUoaCwgYSwgYywgMik7XHJcbiAgICAgICAgICAgICAgICBjICs9IGgubGVuZ3RoIC0gMjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYTtcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIHRhKGIsIGEpIHtcclxuICAgICAgICB2YXIgYyA9IGZhbHNlO1xyXG4gICAgICAgIGZvciAodmFyIGQgPSAwOyBkIDwgYS5sZW5ndGg7IGQgKz0gMikge1xyXG4gICAgICAgICAgICB2YXIgZyA9IGFbZCArIDFdLFxyXG4gICAgICAgICAgICAgICAgZSxcclxuICAgICAgICAgICAgICAgIGg7XHJcbiAgICAgICAgICAgIGlmIChnID09PSBcImF0blwiKSB7XHJcbiAgICAgICAgICAgICAgICBlID0gYVtkXTtcclxuICAgICAgICAgICAgICAgIGggPSBkICsgMiA8IGEubGVuZ3RoID8gYVtkICsgMl0gOiBiLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgIGMgPSAvXm9ufF5zdHlsZSQvaS50ZXN0KGIuc3Vic3RyaW5nKGUsIGgpKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChnID09PSBcImF0dlwiKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYykge1xyXG4gICAgICAgICAgICAgICAgICAgIGUgPSBhW2RdO1xyXG4gICAgICAgICAgICAgICAgICAgIGggPSBkICsgMiA8IGEubGVuZ3RoID8gYVtkICsgMl0gOiBiLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZiA9IGIuc3Vic3RyaW5nKGUsIGgpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpID0gZi5sZW5ndGgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGogPVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaSA+PSAyICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvXltcXFwiXFwnXS8udGVzdChmKSAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZi5jaGFyQXQoMCkgPT09IGYuY2hhckF0KGkgLSAxKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaztcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtID0gZSArIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGsgPSBoIC0gMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbyA9IGY7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbSA9IGUgKyAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBrID0gaCAtIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG8gPSBmLnN1YnN0cmluZygxLCBmLmxlbmd0aCAtIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB2YXIgbCA9IEcobyk7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgbiA9IDAsIHAgPSBsLmxlbmd0aDsgbiA8IHA7IG4gKz0gMikgbFtuXSArPSBtO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChqKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGwucHVzaChrLCBcImF0dlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdShsLCBhLCBkICsgMiwgMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHUobCwgYSwgZCwgMik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGE7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiB1YShiKSB7XHJcbiAgICAgICAgdmFyIGEgPSBwYShiKTtcclxuICAgICAgICBhID0gcmEoYiwgYSk7XHJcbiAgICAgICAgYSA9IHNhKGIsIGEpO1xyXG4gICAgICAgIGEgPSB0YShiLCBhKTtcclxuICAgICAgICByZXR1cm4gYTtcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIHZhKGIsIGEsIGMpIHtcclxuICAgICAgICB2YXIgZCA9IFtdLFxyXG4gICAgICAgICAgICBnID0gMCxcclxuICAgICAgICAgICAgZSA9IG51bGwsXHJcbiAgICAgICAgICAgIGggPSBudWxsLFxyXG4gICAgICAgICAgICBmID0gMCxcclxuICAgICAgICAgICAgaSA9IDAsXHJcbiAgICAgICAgICAgIGogPSBpYSg4KTtcclxuICAgICAgICBmdW5jdGlvbiBvKGspIHtcclxuICAgICAgICAgICAgaWYgKGsgPiBnKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZSAmJiBlICE9PSBoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZC5wdXNoKFwiPC9zcGFuPlwiKTtcclxuICAgICAgICAgICAgICAgICAgICBlID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICghZSAmJiBoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZSA9IGg7XHJcbiAgICAgICAgICAgICAgICAgICAgZC5wdXNoKCc8c3BhbiBjbGFzcz1cIicsIGUsICdcIj4nKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZhciBsID0gRShqKGIuc3Vic3RyaW5nKGcsIGspKSlcclxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvKFxcclxcbj98XFxufCApIC9nLCBcIiQxJm5ic3A7XCIpXHJcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcclxcbj98XFxuL2csIFwiPGJyIC8+XCIpO1xyXG4gICAgICAgICAgICAgICAgZC5wdXNoKGwpO1xyXG4gICAgICAgICAgICAgICAgZyA9IGs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgd2hpbGUgKHRydWUpIHtcclxuICAgICAgICAgICAgdmFyIG07XHJcbiAgICAgICAgICAgIG0gPSBmIDwgYS5sZW5ndGggPyAoaSA8IGMubGVuZ3RoID8gYVtmXSA8PSBjW2ldIDogdHJ1ZSkgOiBmYWxzZTtcclxuICAgICAgICAgICAgaWYgKG0pIHtcclxuICAgICAgICAgICAgICAgIG8oYVtmXSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGQucHVzaChcIjwvc3Bhbj5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBkLnB1c2goYVtmICsgMV0pO1xyXG4gICAgICAgICAgICAgICAgZiArPSAyO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGkgPCBjLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgbyhjW2ldKTtcclxuICAgICAgICAgICAgICAgIGggPSBjW2kgKyAxXTtcclxuICAgICAgICAgICAgICAgIGkgKz0gMjtcclxuICAgICAgICAgICAgfSBlbHNlIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBvKGIubGVuZ3RoKTtcclxuICAgICAgICBpZiAoZSkgZC5wdXNoKFwiPC9zcGFuPlwiKTtcclxuICAgICAgICByZXR1cm4gZC5qb2luKFwiXCIpO1xyXG4gICAgfVxyXG4gICAgdmFyIEMgPSB7fTtcclxuICAgIGZ1bmN0aW9uIHEoYiwgYSkge1xyXG4gICAgICAgIGZvciAodmFyIGMgPSBhLmxlbmd0aDsgLS1jID49IDA7ICkge1xyXG4gICAgICAgICAgICB2YXIgZCA9IGFbY107XHJcbiAgICAgICAgICAgIGlmICghQy5oYXNPd25Qcm9wZXJ0eShkKSkgQ1tkXSA9IGI7XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKFwiY29uc29sZVwiIGluIHdpbmRvdylcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY2Fubm90IG92ZXJyaWRlIGxhbmd1YWdlIGhhbmRsZXIgJXNcIiwgZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcShHLCBbXCJkZWZhdWx0LWNvZGVcIl0pO1xyXG4gICAgcSh1YSwgW1wiZGVmYXVsdC1tYXJrdXBcIiwgXCJodG1sXCIsIFwiaHRtXCIsIFwieGh0bWxcIiwgXCJ4bWxcIiwgXCJ4c2xcIl0pO1xyXG4gICAgcShcclxuICAgICAgICByKHtcclxuICAgICAgICAgICAga2V5d29yZHM6IEksXHJcbiAgICAgICAgICAgIGhhc2hDb21tZW50czogdHJ1ZSxcclxuICAgICAgICAgICAgY1N0eWxlQ29tbWVudHM6IHRydWVcclxuICAgICAgICB9KSxcclxuICAgICAgICBbXCJjXCIsIFwiY2NcIiwgXCJjcHBcIiwgXCJjc1wiLCBcImN4eFwiLCBcImN5Y1wiXVxyXG4gICAgKTtcclxuICAgIHEoXHJcbiAgICAgICAgcih7XHJcbiAgICAgICAgICAgIGtleXdvcmRzOiBKLFxyXG4gICAgICAgICAgICBjU3R5bGVDb21tZW50czogdHJ1ZVxyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIFtcImphdmFcIl1cclxuICAgICk7XHJcbiAgICBxKFxyXG4gICAgICAgIHIoe1xyXG4gICAgICAgICAgICBrZXl3b3JkczogTyxcclxuICAgICAgICAgICAgaGFzaENvbW1lbnRzOiB0cnVlLFxyXG4gICAgICAgICAgICBtdWx0aUxpbmVTdHJpbmdzOiB0cnVlXHJcbiAgICAgICAgfSksXHJcbiAgICAgICAgW1wiYnNoXCIsIFwiY3NoXCIsIFwic2hcIl1cclxuICAgICk7XHJcbiAgICBxKFxyXG4gICAgICAgIHIoe1xyXG4gICAgICAgICAgICBrZXl3b3JkczogTSxcclxuICAgICAgICAgICAgaGFzaENvbW1lbnRzOiB0cnVlLFxyXG4gICAgICAgICAgICBtdWx0aUxpbmVTdHJpbmdzOiB0cnVlLFxyXG4gICAgICAgICAgICB0cmlwbGVRdW90ZWRTdHJpbmdzOiB0cnVlXHJcbiAgICAgICAgfSksXHJcbiAgICAgICAgW1wiY3ZcIiwgXCJweVwiXVxyXG4gICAgKTtcclxuICAgIHEoXHJcbiAgICAgICAgcih7XHJcbiAgICAgICAgICAgIGtleXdvcmRzOiBMLFxyXG4gICAgICAgICAgICBoYXNoQ29tbWVudHM6IHRydWUsXHJcbiAgICAgICAgICAgIG11bHRpTGluZVN0cmluZ3M6IHRydWUsXHJcbiAgICAgICAgICAgIHJlZ2V4TGl0ZXJhbHM6IHRydWVcclxuICAgICAgICB9KSxcclxuICAgICAgICBbXCJwZXJsXCIsIFwicGxcIiwgXCJwbVwiXVxyXG4gICAgKTtcclxuICAgIHEoXHJcbiAgICAgICAgcih7XHJcbiAgICAgICAgICAgIGtleXdvcmRzOiBOLFxyXG4gICAgICAgICAgICBoYXNoQ29tbWVudHM6IHRydWUsXHJcbiAgICAgICAgICAgIG11bHRpTGluZVN0cmluZ3M6IHRydWUsXHJcbiAgICAgICAgICAgIHJlZ2V4TGl0ZXJhbHM6IHRydWVcclxuICAgICAgICB9KSxcclxuICAgICAgICBbXCJyYlwiXVxyXG4gICAgKTtcclxuICAgIHEoXHJcbiAgICAgICAgcih7XHJcbiAgICAgICAgICAgIGtleXdvcmRzOiBLLFxyXG4gICAgICAgICAgICBjU3R5bGVDb21tZW50czogdHJ1ZSxcclxuICAgICAgICAgICAgcmVnZXhMaXRlcmFsczogdHJ1ZVxyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIFtcImpzXCJdXHJcbiAgICApO1xyXG4gICAgZnVuY3Rpb24gVChiLCBhKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgdmFyIGMgPSBuYShiKSxcclxuICAgICAgICAgICAgICAgIGQgPSBjLnNvdXJjZSxcclxuICAgICAgICAgICAgICAgIGcgPSBjLnRhZ3M7XHJcbiAgICAgICAgICAgIGlmICghQy5oYXNPd25Qcm9wZXJ0eShhKSlcclxuICAgICAgICAgICAgICAgIGEgPSAvXlxccyo8Ly50ZXN0KGQpID8gXCJkZWZhdWx0LW1hcmt1cFwiIDogXCJkZWZhdWx0LWNvZGVcIjtcclxuICAgICAgICAgICAgdmFyIGUgPSBDW2FdLmNhbGwoe30sIGQpO1xyXG4gICAgICAgICAgICByZXR1cm4gdmEoZCwgZywgZSk7XHJcbiAgICAgICAgfSBjYXRjaCAoaCkge1xyXG4gICAgICAgICAgICBpZiAoXCJjb25zb2xlXCIgaW4gd2luZG93KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhoKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUudHJhY2UoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gYjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiB3YShiKSB7XHJcbiAgICAgICAgdmFyIGEgPSBIKCksXHJcbiAgICAgICAgICAgIGMgPSBbXHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInByZVwiKSxcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiY29kZVwiKSxcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwibGlcIiksXHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInhtcFwiKVxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICBkID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgZyA9IDA7IGcgPCBjLmxlbmd0aDsgKytnKVxyXG4gICAgICAgICAgICBmb3IgKHZhciBlID0gMDsgZSA8IGNbZ10ubGVuZ3RoOyArK2UpIGQucHVzaChjW2ddW2VdKTtcclxuICAgICAgICBjID0gbnVsbDtcclxuICAgICAgICB2YXIgaCA9IDA7XHJcbiAgICAgICAgZnVuY3Rpb24gZigpIHtcclxuICAgICAgICAgICAgdmFyIGkgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKSArIDI1MDtcclxuICAgICAgICAgICAgZm9yICg7IGggPCBkLmxlbmd0aCAmJiBuZXcgRGF0ZSgpLmdldFRpbWUoKSA8IGk7IGgrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGogPSBkW2hdO1xyXG4gICAgICAgICAgICAgICAgaWYgKGouY2xhc3NOYW1lICYmIGouY2xhc3NOYW1lLmluZGV4T2YoXCJwcmV0dHlwcmludFwiKSA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG8gPSBqLmNsYXNzTmFtZS5tYXRjaCgvXFxibGFuZy0oXFx3KylcXGIvKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobykgbyA9IG9bMV07XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG0gPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBrID0gai5wYXJlbnROb2RlOyBrOyBrID0gay5wYXJlbnROb2RlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoay50YWdOYW1lID09PSBcInByZVwiIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgay50YWdOYW1lID09PSBcImNvZGVcIiB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGsudGFnTmFtZSA9PT0gXCJ4bXBcIikgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGsuY2xhc3NOYW1lICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrLmNsYXNzTmFtZS5pbmRleE9mKFwicHJldHR5cHJpbnRcIikgPj0gMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG0gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAoIW0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGwgPSBoYShqKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbCA9IGwucmVwbGFjZSgvKD86XFxyXFxuP3xcXG4pJC8sIFwiXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbiA9IFQobCwgbyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghUyhqKSkgai5pbm5lckhUTUwgPSBuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIlBSRVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHQgPSAwOyB0IDwgai5hdHRyaWJ1dGVzLmxlbmd0aDsgKyt0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHcgPSBqLmF0dHJpYnV0ZXNbdF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHcuc3BlY2lmaWVkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwLnNldEF0dHJpYnV0ZSh3Lm5hbWUsIHcudmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcC5pbm5lckhUTUwgPSBuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgai5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChwLCBqKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHAgPSBqO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhICYmIGoudGFnTmFtZSA9PT0gXCJQUkVcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIEEgPSBqLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYnJcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBCID0gQS5sZW5ndGg7IC0tQiA+PSAwOyApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcyA9IEFbQl07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcy5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCJcXHJcXG5cIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChoIDwgZC5sZW5ndGgpIHNldFRpbWVvdXQoZiwgMjUwKTtcclxuICAgICAgICAgICAgZWxzZSBpZiAoYikgYigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmKCk7XHJcbiAgICB9XHJcbiAgICB3aW5kb3cuUFJfbm9ybWFsaXplZEh0bWwgPSB6O1xyXG4gICAgd2luZG93LnByZXR0eVByaW50T25lID0gVDtcclxuICAgIHdpbmRvdy5wcmV0dHlQcmludCA9IHdhO1xyXG4gICAgd2luZG93LlBSID0ge1xyXG4gICAgICAgIGNyZWF0ZVNpbXBsZUxleGVyOiB2LFxyXG4gICAgICAgIHJlZ2lzdGVyTGFuZ0hhbmRsZXI6IHEsXHJcbiAgICAgICAgc291cmNlRGVjb3JhdG9yOiByLFxyXG4gICAgICAgIFBSX0FUVFJJQl9OQU1FOiBcImF0blwiLFxyXG4gICAgICAgIFBSX0FUVFJJQl9WQUxVRTogXCJhdHZcIixcclxuICAgICAgICBQUl9DT01NRU5UOiBcImNvbVwiLFxyXG4gICAgICAgIFBSX0RFQ0xBUkFUSU9OOiBcImRlY1wiLFxyXG4gICAgICAgIFBSX0tFWVdPUkQ6IFwia3dkXCIsXHJcbiAgICAgICAgUFJfTElURVJBTDogXCJsaXRcIixcclxuICAgICAgICBQUl9QTEFJTjogXCJwbG5cIixcclxuICAgICAgICBQUl9QVU5DVFVBVElPTjogXCJwdW5cIixcclxuICAgICAgICBQUl9TT1VSQ0U6IFwic3JjXCIsXHJcbiAgICAgICAgUFJfU1RSSU5HOiBcInN0clwiLFxyXG4gICAgICAgIFBSX1RBRzogXCJ0YWdcIixcclxuICAgICAgICBQUl9UWVBFOiBcInR5cFwiXHJcbiAgICB9O1xyXG59KSgpO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcbi8qKlxuICogVGhpcyBmaWxlIGFkYXB0ZWQgZnJvbSBKU05ldHdvcmtYOiBodHRwczovL2dpdGh1Yi5jb20vZmtsaW5nL0pTTmV0d29ya1hcbiAqIENvcHlyaWdodCAoQykgMjAxMiBGZWxpeCBLbGluZyA8ZmVsaXgua2xpbmdAZ214Lm5ldD5cbiAqIEpTTmV0d29ya1ggaXMgZGlzdHJpYnV0ZWQgd2l0aCB0aGUgQlNEIGxpY2Vuc2VcbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gaGFzUGF0aChHLCB7IHNvdXJjZSwgdGFyZ2V0IH0pIHtcbiAgICB0cnkge1xuICAgICAgICBiaWRpcmVjdGlvbmFsU2hvcnRlc3RQYXRoKEcsIHNvdXJjZSwgdGFyZ2V0KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBKU05ldHdvcmtYTm9QYXRoKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBub2Rlc0FyZUVxdWFsKGEsIGIpIHtcbiAgICByZXR1cm4gYSA9PT0gYiB8fCAodHlwZW9mIGEgPT09IFwib2JqZWN0XCIgJiYgYS50b1N0cmluZygpID09PSBiLnRvU3RyaW5nKCkpO1xufVxuXG5mdW5jdGlvbiBiaWRpcmVjdGlvbmFsU2hvcnRlc3RQYXRoKEcsIHNvdXJjZSwgdGFyZ2V0KSB7XG4gICAgLy8gY2FsbCBoZWxwZXIgdG8gZG8gdGhlIHJlYWwgd29ya1xuICAgIHZhciBbcHJlZCwgc3VjYywgd10gPSBiaWRpcmVjdGlvbmFsUHJlZFN1Y2MoRywgc291cmNlLCB0YXJnZXQpO1xuXG4gICAgLy8gYnVpbGQgcGF0aCBmcm9tIHByZWQrdytzdWNjXG4gICAgdmFyIHBhdGggPSBbXTtcbiAgICAvLyBmcm9tIHNvdXJjZSB0byB3XG4gICAgd2hpbGUgKHcgIT0gbnVsbCkge1xuICAgICAgICBwYXRoLnB1c2godyk7XG4gICAgICAgIHcgPSBwcmVkLmdldCh3KTtcbiAgICB9XG4gICAgdyA9IHN1Y2MuZ2V0KHBhdGhbMF0pO1xuICAgIHBhdGgucmV2ZXJzZSgpO1xuICAgIC8vIGZyb20gdyB0byB0YXJnZXRcbiAgICB3aGlsZSAodyAhPSBudWxsKSB7XG4gICAgICAgIHBhdGgucHVzaCh3KTtcbiAgICAgICAgdyA9IHN1Y2MuZ2V0KHcpO1xuICAgIH1cbiAgICByZXR1cm4gcGF0aDtcbn1cblxuZnVuY3Rpb24gYmlkaXJlY3Rpb25hbFByZWRTdWNjKEcsIHNvdXJjZSwgdGFyZ2V0KSB7XG4gICAgLy8gZG9lcyBCRlMgZnJvbSBib3RoIHNvdXJjZSBhbmQgdGFyZ2V0IGFuZCBtZWV0cyBpbiB0aGUgbWlkZGxlXG4gICAgaWYgKG5vZGVzQXJlRXF1YWwoc291cmNlLCB0YXJnZXQpKSB7XG4gICAgICAgIHJldHVybiBbbmV3IE1hcChbW3NvdXJjZSwgbnVsbF1dKSwgbmV3IE1hcChbW3RhcmdldCwgbnVsbF1dKSwgc291cmNlXTtcbiAgICB9XG5cbiAgICAvLyBoYW5kbGUgZWl0aGVyIGRpcmVjdGVkIG9yIHVuZGlyZWN0ZWRcbiAgICB2YXIgZ3ByZWQsIGdzdWNjO1xuICAgIGdwcmVkID0gRy5wcmVkZWNlc3NvcnNJdGVyLmJpbmQoRyk7XG4gICAgZ3N1Y2MgPSBHLnN1Y2Nlc3NvcnNJdGVyLmJpbmQoRyk7XG5cbiAgICAvLyBwcmVkZWNlc3Nzb3IgYW5kIHN1Y2Nlc3NvcnMgaW4gc2VhcmNoXG4gICAgdmFyIHByZWQgPSBuZXcgTWFwKFtbc291cmNlLCBudWxsXV0pO1xuICAgIHZhciBzdWNjID0gbmV3IE1hcChbW3RhcmdldCwgbnVsbF1dKTtcbiAgICAvL1xuICAgIC8vIGluaXRpYWxpemUgZnJpbmdlcywgc3RhcnQgd2l0aCBmb3J3YXJkXG4gICAgdmFyIGZvcndhcmRGcmluZ2UgPSBbc291cmNlXTtcbiAgICB2YXIgcmV2ZXJzZUZyaW5nZSA9IFt0YXJnZXRdO1xuICAgIHZhciB0aGlzTGV2ZWw7XG5cbiAgICAvKmpzaGludCBuZXdjYXA6ZmFsc2UqL1xuICAgIHdoaWxlIChmb3J3YXJkRnJpbmdlLmxlbmd0aCA+IDAgJiYgcmV2ZXJzZUZyaW5nZS5sZW5ndGggPiAwKSB7XG4gICAgICAgIGlmIChmb3J3YXJkRnJpbmdlLmxlbmd0aCA8PSByZXZlcnNlRnJpbmdlLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhpc0xldmVsID0gZm9yd2FyZEZyaW5nZTtcbiAgICAgICAgICAgIGZvcndhcmRGcmluZ2UgPSBbXTtcbiAgICAgICAgICAgIGZvciAobGV0IHYgb2YgdGhpc0xldmVsKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgdyBvZiBnc3VjYyh2KSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXByZWQuaGFzKHcpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3J3YXJkRnJpbmdlLnB1c2godyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVkLnNldCh3LCB2KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoc3VjYy5oYXModykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbcHJlZCwgc3VjYywgd107IC8vIGZvdW5kIHBhdGhcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXNMZXZlbCA9IHJldmVyc2VGcmluZ2U7XG4gICAgICAgICAgICByZXZlcnNlRnJpbmdlID0gW107XG4gICAgICAgICAgICBmb3IgKGxldCB2IG9mIHRoaXNMZXZlbCkge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IHcgb2YgZ3ByZWQodikpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFzdWNjLmhhcyh3KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV2ZXJzZUZyaW5nZS5wdXNoKHcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3VjYy5zZXQodywgdik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHByZWQuaGFzKHcpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gW3ByZWQsIHN1Y2MsIHddOyAvLyBmb3VuZCBwYXRoXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgdGhyb3cgbmV3IEpTTmV0d29ya1hOb1BhdGgoXG4gICAgICAgIFwiTm8gcGF0aCBiZXR3ZWVuIFwiICtcbiAgICAgICAgICAgIHNvdXJjZS50b1N0cmluZygpICtcbiAgICAgICAgICAgIFwiIGFuZCBcIiArXG4gICAgICAgICAgICB0YXJnZXQudG9TdHJpbmcoKSArXG4gICAgICAgICAgICBcIi5cIixcbiAgICApO1xufVxuXG5mdW5jdGlvbiB0b3BvbG9naWNhbFNvcnQoRywgb3B0TmJ1bmNoKSB7XG4gICAgLy8gbm9ucmVjdXJzaXZlIHZlcnNpb25cbiAgICB2YXIgc2VlbiA9IG5ldyBTZXQoKTtcbiAgICB2YXIgb3JkZXJFeHBsb3JlZCA9IFtdOyAvLyBwcm92aWRlIG9yZGVyIGFuZFxuICAgIC8vIGZhc3Qgc2VhcmNoIHdpdGhvdXQgbW9yZSBnZW5lcmFsIHByaW9yaXR5RGljdGlvbmFyeVxuICAgIHZhciBleHBsb3JlZCA9IG5ldyBTZXQoKTtcblxuICAgIGlmIChvcHROYnVuY2ggPT0gbnVsbCkge1xuICAgICAgICBvcHROYnVuY2ggPSBHLm5vZGVzSXRlcigpO1xuICAgIH1cblxuICAgIGZvciAobGV0IHYgb2Ygb3B0TmJ1bmNoKSB7XG4gICAgICAgIC8vIHByb2Nlc3MgYWxsIHZlcnRpY2VzIGluIEdcbiAgICAgICAgaWYgKGV4cGxvcmVkLmhhcyh2KSkge1xuICAgICAgICAgICAgcmV0dXJuOyAvLyBjb250aW51ZVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGZyaW5nZSA9IFt2XTsgLy8gbm9kZXMgeWV0IHRvIGxvb2sgYXRcbiAgICAgICAgd2hpbGUgKGZyaW5nZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB2YXIgdyA9IGZyaW5nZVtmcmluZ2UubGVuZ3RoIC0gMV07IC8vIGRlcHRoIGZpcnN0IHNlYXJjaFxuICAgICAgICAgICAgaWYgKGV4cGxvcmVkLmhhcyh3KSkge1xuICAgICAgICAgICAgICAgIC8vIGFscmVhZHkgbG9va2VkIGRvd24gdGhpcyBicmFuY2hcbiAgICAgICAgICAgICAgICBmcmluZ2UucG9wKCk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZWVuLmFkZCh3KTsgLy8gbWFyayBhcyBzZWVuXG4gICAgICAgICAgICAvLyBDaGVjayBzdWNjZXNzb3JzIGZvciBjeWNsZXMgZm9yIG5ldyBub2Rlc1xuICAgICAgICAgICAgdmFyIG5ld05vZGVzID0gW107XG4gICAgICAgICAgICAvKmVzbGludC1kaXNhYmxlIG5vLWxvb3AtZnVuYyovXG4gICAgICAgICAgICBHLmdldCh3KS5mb3JFYWNoKGZ1bmN0aW9uIChfLCBuKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFleHBsb3JlZC5oYXMobikpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlZW4uaGFzKG4pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBDWUNMRSAhIVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEpTTmV0d29ya1hVbmZlYXNpYmxlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiR3JhcGggY29udGFpbnMgYSBjeWNsZS5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbmV3Tm9kZXMucHVzaChuKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8qZXNsaW50LWVuYWJsZSBuby1sb29wLWZ1bmMqL1xuICAgICAgICAgICAgaWYgKG5ld05vZGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAvLyBhZGQgbmV3IG5vZGVzIHRvIGZyaW5nZVxuICAgICAgICAgICAgICAgIGZyaW5nZS5wdXNoLmFwcGx5KGZyaW5nZSwgbmV3Tm9kZXMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBleHBsb3JlZC5hZGQodyk7XG4gICAgICAgICAgICAgICAgb3JkZXJFeHBsb3JlZC51bnNoaWZ0KHcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG9yZGVyRXhwbG9yZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0RpcmVjdGVkQWN5Y2xpY0dyYXBoKEcpIHtcbiAgICB0cnkge1xuICAgICAgICB0b3BvbG9naWNhbFNvcnQoRyk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgIGlmIChleCBpbnN0YW5jZW9mIEpTTmV0d29ya1hVbmZlYXNpYmxlKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgZXg7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgRGlHcmFwaCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZ3JhcGggPSB7fTsgLy8gZGljdGlvbmFyeSBmb3IgZ3JhcGggYXR0cmlidXRlc1xuICAgICAgICB0aGlzLm5vZGUgPSBuZXcgTWFwKCk7IC8vIGRpY3Rpb25hcnkgZm9yIG5vZGUgYXR0cmlidXRlc1xuICAgICAgICAvLyBXZSBzdG9yZSB0d28gYWRqYWNlbmN5IGxpc3RzOlxuICAgICAgICAvLyB0aGUgcHJlZGVjZXNzb3JzIG9mIG5vZGUgbiBhcmUgc3RvcmVkIGluIHRoZSBkaWN0IHNlbGYucHJlZFxuICAgICAgICAvLyB0aGUgc3VjY2Vzc29ycyBvZiBub2RlIG4gYXJlIHN0b3JlZCBpbiB0aGUgZGljdCBzZWxmLnN1Y2M9c2VsZi5hZGpcbiAgICAgICAgdGhpcy5hZGogPSBuZXcgTWFwKCk7IC8vIGVtcHR5IGFkamFjZW5jeSBkaWN0aW9uYXJ5XG4gICAgICAgIHRoaXMucHJlZCA9IG5ldyBNYXAoKTsgLy8gcHJlZGVjZXNzb3JcbiAgICAgICAgdGhpcy5zdWNjID0gdGhpcy5hZGo7IC8vIHN1Y2Nlc3NvclxuXG4gICAgICAgIHRoaXMuZWRnZSA9IHRoaXMuYWRqO1xuICAgIH1cblxuICAgIGFkZE5vZGUobikge1xuICAgICAgICBpZiAoIXRoaXMuc3VjYy5oYXMobikpIHtcbiAgICAgICAgICAgIHRoaXMuc3VjYy5zZXQobiwgbmV3IE1hcCgpKTtcbiAgICAgICAgICAgIHRoaXMucHJlZC5zZXQobiwgbmV3IE1hcCgpKTtcbiAgICAgICAgICAgIHRoaXMubm9kZS5zZXQobik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhZGRFZGdlKHUsIHYpIHtcbiAgICAgICAgLy8gYWRkIG5vZGVzXG4gICAgICAgIGlmICghdGhpcy5zdWNjLmhhcyh1KSkge1xuICAgICAgICAgICAgdGhpcy5zdWNjLnNldCh1LCBuZXcgTWFwKCkpO1xuICAgICAgICAgICAgdGhpcy5wcmVkLnNldCh1LCBuZXcgTWFwKCkpO1xuICAgICAgICAgICAgdGhpcy5ub2RlLnNldCh1LCB7fSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMuc3VjYy5oYXModikpIHtcbiAgICAgICAgICAgIHRoaXMuc3VjYy5zZXQodiwgbmV3IE1hcCgpKTtcbiAgICAgICAgICAgIHRoaXMucHJlZC5zZXQodiwgbmV3IE1hcCgpKTtcbiAgICAgICAgICAgIHRoaXMubm9kZS5zZXQodiwge30pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gYWRkIHRoZSBlZGdlXG4gICAgICAgIHZhciBkYXRhZGljdCA9IHRoaXMuYWRqLmdldCh1KS5nZXQodikgfHwge307XG4gICAgICAgIHRoaXMuc3VjYy5nZXQodSkuc2V0KHYsIGRhdGFkaWN0KTtcbiAgICAgICAgdGhpcy5wcmVkLmdldCh2KS5zZXQodSwgZGF0YWRpY3QpO1xuICAgIH1cblxuICAgIG5vZGVzKG9wdERhdGEgPSBmYWxzZSkge1xuICAgICAgICByZXR1cm4gQXJyYXkuZnJvbShvcHREYXRhID8gdGhpcy5ub2RlLmVudHJpZXMoKSA6IHRoaXMubm9kZS5rZXlzKCkpO1xuICAgIH1cblxuICAgIGVkZ2VzKG9wdE5idW5jaCwgb3B0RGF0YSA9IGZhbHNlKSB7XG4gICAgICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMuZWRnZXNJdGVyKG9wdE5idW5jaCwgb3B0RGF0YSkpO1xuICAgIH1cblxuICAgIG5vZGVzSXRlcihvcHREYXRhID0gZmFsc2UpIHtcbiAgICAgICAgaWYgKG9wdERhdGEpIHtcbiAgICAgICAgICAgIHJldHVybiB0b0l0ZXJhdG9yKHRoaXMubm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMubm9kZS5rZXlzKCk7XG4gICAgfVxuXG4gICAgZ2V0KG4pIHtcbiAgICAgICAgdmFyIHZhbHVlID0gdGhpcy5hZGouZ2V0KG4pO1xuICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgS2V5RXJyb3IoXCJHcmFwaCBkb2VzIG5vdCBjb250YWluIG5vZGUgXCIgKyBuICsgXCIuXCIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBudW1iZXJPZk5vZGVzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5ub2RlLnNpemU7XG4gICAgfVxuXG4gICAgKm5idW5jaEl0ZXIob3B0TmJ1bmNoKSB7XG4gICAgICAgIGlmIChvcHROYnVuY2ggPT0gbnVsbCkge1xuICAgICAgICAgICAgLy8gaW5jbHVkZSBhbGwgbm9kZXNcbiAgICAgICAgICAgIC8qanNoaW50IGV4cHI6dHJ1ZSovXG4gICAgICAgICAgICB5aWVsZCogdGhpcy5hZGoua2V5cygpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaGFzTm9kZShvcHROYnVuY2gpKSB7XG4gICAgICAgICAgICAvLyBpZiBuYnVuY2ggaXMgYSBzaW5nbGUgbm9kZVxuICAgICAgICAgICAgeWllbGQgb3B0TmJ1bmNoO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gaWYgbmJ1bmNoIGlzIGEgc2VxdWVuY2Ugb2Ygbm9kZXNcbiAgICAgICAgICAgIHZhciBhZGogPSB0aGlzLmFkajtcblxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBuIG9mIHRvSXRlcmF0b3Iob3B0TmJ1bmNoKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYWRqLmhhcyhuKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgeWllbGQgbjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgICAgICAgICAgaWYgKGV4IGluc3RhbmNlb2YgVHlwZUVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBKU05ldHdvcmtYRXJyb3IoXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm5idW5jaCBpcyBub3QgYSBub2RlIG9yIGEgc2VxdWVuY2Ugb2Ygbm9kZXNcIixcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAqZWRnZXNJdGVyKG9wdE5idW5jaCwgb3B0RGF0YSA9IGZhbHNlKSB7XG4gICAgICAgIC8vIGhhbmRsZSBjYWxscyB3aXRoIG9wdF9kYXRhIGJlaW5nIHRoZSBvbmx5IGFyZ3VtZW50XG4gICAgICAgIGlmIChpc0Jvb2xlYW4ob3B0TmJ1bmNoKSkge1xuICAgICAgICAgICAgb3B0RGF0YSA9IG9wdE5idW5jaDtcbiAgICAgICAgICAgIG9wdE5idW5jaCA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBub2Rlc05icnM7XG5cbiAgICAgICAgaWYgKG9wdE5idW5jaCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBub2Rlc05icnMgPSB0aGlzLmFkajtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5vZGVzTmJycyA9IG1hcEl0ZXJhdG9yKHRoaXMubmJ1bmNoSXRlcihvcHROYnVuY2gpLCAobikgPT5cbiAgICAgICAgICAgICAgICB0dXBsZTIobiwgdGhpcy5hZGouZ2V0KG4pKSxcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciBub2RlTmJycyBvZiBub2Rlc05icnMpIHtcbiAgICAgICAgICAgIGZvciAodmFyIG5ickRhdGEgb2Ygbm9kZU5icnNbMV0pIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gW25vZGVOYnJzWzBdLCBuYnJEYXRhWzBdXTtcbiAgICAgICAgICAgICAgICBpZiAob3B0RGF0YSkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRbMl0gPSBuYnJEYXRhWzFdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB5aWVsZCByZXN1bHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXZlcnNlKG9wdENvcHkgPSB0cnVlKSB7XG4gICAgICAgIHZhciBIO1xuICAgICAgICBpZiAob3B0Q29weSkge1xuICAgICAgICAgICAgSCA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yKG51bGwsIHtcbiAgICAgICAgICAgICAgICBuYW1lOiBcIlJldmVyc2Ugb2YgKFwiICsgdGhpcy5uYW1lICsgXCIpXCIsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIEguYWRkTm9kZXNGcm9tKHRoaXMpO1xuICAgICAgICAgICAgSC5hZGRFZGdlc0Zyb20oXG4gICAgICAgICAgICAgICAgbWFwSXRlcmF0b3IodGhpcy5lZGdlc0l0ZXIobnVsbCwgdHJ1ZSksIChlZGdlKSA9PlxuICAgICAgICAgICAgICAgICAgICB0dXBsZTNjKGVkZ2VbMV0sIGVkZ2VbMF0sIGRlZXBjb3B5KGVkZ2VbMl0pLCBlZGdlKSxcbiAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIEguZ3JhcGggPSBkZWVwY29weSh0aGlzLmdyYXBoKTtcbiAgICAgICAgICAgIEgubm9kZSA9IGRlZXBjb3B5KHRoaXMubm9kZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgdGhpc1ByZWQgPSB0aGlzLnByZWQ7XG4gICAgICAgICAgICB2YXIgdGhpc1N1Y2MgPSB0aGlzLnN1Y2M7XG5cbiAgICAgICAgICAgIHRoaXMuc3VjYyA9IHRoaXNQcmVkO1xuICAgICAgICAgICAgdGhpcy5wcmVkID0gdGhpc1N1Y2M7XG4gICAgICAgICAgICB0aGlzLmFkaiA9IHRoaXMuc3VjYztcbiAgICAgICAgICAgIEggPSB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBIO1xuICAgIH1cblxuICAgIHN1Y2Nlc3NvcnNJdGVyKG4pIHtcbiAgICAgICAgdmFyIG5icnMgPSB0aGlzLnN1Y2MuZ2V0KG4pO1xuICAgICAgICBpZiAobmJycyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gbmJycy5rZXlzKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgbmV3IEpTTmV0d29ya1hFcnJvcihcbiAgICAgICAgICAgIHNwcmludGYoJ1RoZSBub2RlIFwiJWpcIiBpcyBub3QgaW4gdGhlIGRpZ3JhcGguJywgbiksXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgcHJlZGVjZXNzb3JzSXRlcihuKSB7XG4gICAgICAgIHZhciBuYnJzID0gdGhpcy5wcmVkLmdldChuKTtcbiAgICAgICAgaWYgKG5icnMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIG5icnMua2V5cygpO1xuICAgICAgICB9XG4gICAgICAgIHRocm93IG5ldyBKU05ldHdvcmtYRXJyb3IoXG4gICAgICAgICAgICBzcHJpbnRmKCdUaGUgbm9kZSBcIiVqXCIgaXMgbm90IGluIHRoZSBkaWdyYXBoLicsIG4pLFxuICAgICAgICApO1xuICAgIH1cblxuICAgIHN1Y2Nlc3NvcnMobikge1xuICAgICAgICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLnN1Y2Nlc3NvcnNJdGVyKG4pKTtcbiAgICB9XG5cbiAgICBwcmVkZWNlc3NvcnMobikge1xuICAgICAgICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLnByZWRlY2Vzc29yc0l0ZXIobikpO1xuICAgIH1cbn1cblxuY2xhc3MgSlNOZXR3b3JrWEV4Y2VwdGlvbiB7XG4gICAgY29uc3RydWN0b3IobWVzc2FnZSkge1xuICAgICAgICB0aGlzLm5hbWUgPSBcIkpTTmV0d29ya1hFeGNlcHRpb25cIjtcbiAgICAgICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbiAgICB9XG59XG5cbmNsYXNzIEpTTmV0d29ya1hBbGdvcml0aG1FcnJvciBleHRlbmRzIEpTTmV0d29ya1hFeGNlcHRpb24ge1xuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2UpIHtcbiAgICAgICAgc3VwZXIobWVzc2FnZSk7XG4gICAgICAgIHRoaXMubmFtZSA9IFwiSlNOZXR3b3JrWEFsZ29yaXRobUVycm9yXCI7XG4gICAgfVxufVxuXG5jbGFzcyBKU05ldHdvcmtYRXJyb3IgZXh0ZW5kcyBKU05ldHdvcmtYRXhjZXB0aW9uIHtcbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlKSB7XG4gICAgICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgICAgICB0aGlzLm5hbWUgPSBcIkpTTmV0d29ya1hFcnJvclwiO1xuICAgIH1cbn1cblxuY2xhc3MgSlNOZXR3b3JrWFVuZmVhc2libGUgZXh0ZW5kcyBKU05ldHdvcmtYQWxnb3JpdGhtRXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2UpIHtcbiAgICAgICAgc3VwZXIobWVzc2FnZSk7XG4gICAgICAgIHRoaXMubmFtZSA9IFwiSlNOZXR3b3JrWFVuZmVhc2libGVcIjtcbiAgICB9XG59XG5cbmNsYXNzIEpTTmV0d29ya1hOb1BhdGggZXh0ZW5kcyBKU05ldHdvcmtYVW5mZWFzaWJsZSB7XG4gICAgY29uc3RydWN0b3IobWVzc2FnZSkge1xuICAgICAgICBzdXBlcihtZXNzYWdlKTtcbiAgICAgICAgdGhpcy5uYW1lID0gXCJKU05ldHdvcmtYTm9QYXRoXCI7XG4gICAgfVxufVxuXG4vLyBmdW5jdGlvbiBmcm9tIExvRGFzaCwgbmVlZGVkIGJ5IGZ1bmN0aW9ucyBmcm9tIEpTTmV0d29ya1hcbmZ1bmN0aW9uIGlzT2JqZWN0TGlrZSh2YWx1ZSkge1xuICAgIHJldHVybiAhIXZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PSBcIm9iamVjdFwiO1xufVxuXG4vLyBmdW5jdGlvbiBmcm9tIExvRGFzaCwgbmVlZGVkIGJ5IGZ1bmN0aW9ucyBmcm9tIEpTTmV0d29ya1hcbmZ1bmN0aW9uIGlzQm9vbGVhbih2YWx1ZSkge1xuICAgIHZhciBib29sVGFnID0gXCJbb2JqZWN0IEJvb2xlYW5dXCI7XG4gICAgcmV0dXJuIChcbiAgICAgICAgdmFsdWUgPT09IHRydWUgfHxcbiAgICAgICAgdmFsdWUgPT09IGZhbHNlIHx8XG4gICAgICAgIChpc09iamVjdExpa2UodmFsdWUpICYmXG4gICAgICAgICAgICBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpID09IGJvb2xUYWcpXG4gICAgKTtcbn1cbiIsIi8qISBIYW1tZXIuSlMgLSB2Mi4wLjggLSAyMDE2LTA0LTIzXG4gKiBodHRwOi8vaGFtbWVyanMuZ2l0aHViLmlvL1xuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNiBKb3JpayBUYW5nZWxkZXI7XG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgKi9cbiFmdW5jdGlvbihhLGIsYyxkKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBlKGEsYixjKXtyZXR1cm4gc2V0VGltZW91dChqKGEsYyksYil9ZnVuY3Rpb24gZihhLGIsYyl7cmV0dXJuIEFycmF5LmlzQXJyYXkoYSk/KGcoYSxjW2JdLGMpLCEwKTohMX1mdW5jdGlvbiBnKGEsYixjKXt2YXIgZTtpZihhKWlmKGEuZm9yRWFjaClhLmZvckVhY2goYixjKTtlbHNlIGlmKGEubGVuZ3RoIT09ZClmb3IoZT0wO2U8YS5sZW5ndGg7KWIuY2FsbChjLGFbZV0sZSxhKSxlKys7ZWxzZSBmb3IoZSBpbiBhKWEuaGFzT3duUHJvcGVydHkoZSkmJmIuY2FsbChjLGFbZV0sZSxhKX1mdW5jdGlvbiBoKGIsYyxkKXt2YXIgZT1cIkRFUFJFQ0FURUQgTUVUSE9EOiBcIitjK1wiXFxuXCIrZCtcIiBBVCBcXG5cIjtyZXR1cm4gZnVuY3Rpb24oKXt2YXIgYz1uZXcgRXJyb3IoXCJnZXQtc3RhY2stdHJhY2VcIiksZD1jJiZjLnN0YWNrP2Muc3RhY2sucmVwbGFjZSgvXlteXFwoXSs/W1xcbiRdL2dtLFwiXCIpLnJlcGxhY2UoL15cXHMrYXRcXHMrL2dtLFwiXCIpLnJlcGxhY2UoL15PYmplY3QuPGFub255bW91cz5cXHMqXFwoL2dtLFwie2Fub255bW91c30oKUBcIik6XCJVbmtub3duIFN0YWNrIFRyYWNlXCIsZj1hLmNvbnNvbGUmJihhLmNvbnNvbGUud2Fybnx8YS5jb25zb2xlLmxvZyk7cmV0dXJuIGYmJmYuY2FsbChhLmNvbnNvbGUsZSxkKSxiLmFwcGx5KHRoaXMsYXJndW1lbnRzKX19ZnVuY3Rpb24gaShhLGIsYyl7dmFyIGQsZT1iLnByb3RvdHlwZTtkPWEucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoZSksZC5jb25zdHJ1Y3Rvcj1hLGQuX3N1cGVyPWUsYyYmbGEoZCxjKX1mdW5jdGlvbiBqKGEsYil7cmV0dXJuIGZ1bmN0aW9uKCl7cmV0dXJuIGEuYXBwbHkoYixhcmd1bWVudHMpfX1mdW5jdGlvbiBrKGEsYil7cmV0dXJuIHR5cGVvZiBhPT1vYT9hLmFwcGx5KGI/YlswXXx8ZDpkLGIpOmF9ZnVuY3Rpb24gbChhLGIpe3JldHVybiBhPT09ZD9iOmF9ZnVuY3Rpb24gbShhLGIsYyl7ZyhxKGIpLGZ1bmN0aW9uKGIpe2EuYWRkRXZlbnRMaXN0ZW5lcihiLGMsITEpfSl9ZnVuY3Rpb24gbihhLGIsYyl7ZyhxKGIpLGZ1bmN0aW9uKGIpe2EucmVtb3ZlRXZlbnRMaXN0ZW5lcihiLGMsITEpfSl9ZnVuY3Rpb24gbyhhLGIpe2Zvcig7YTspe2lmKGE9PWIpcmV0dXJuITA7YT1hLnBhcmVudE5vZGV9cmV0dXJuITF9ZnVuY3Rpb24gcChhLGIpe3JldHVybiBhLmluZGV4T2YoYik+LTF9ZnVuY3Rpb24gcShhKXtyZXR1cm4gYS50cmltKCkuc3BsaXQoL1xccysvZyl9ZnVuY3Rpb24gcihhLGIsYyl7aWYoYS5pbmRleE9mJiYhYylyZXR1cm4gYS5pbmRleE9mKGIpO2Zvcih2YXIgZD0wO2Q8YS5sZW5ndGg7KXtpZihjJiZhW2RdW2NdPT1ifHwhYyYmYVtkXT09PWIpcmV0dXJuIGQ7ZCsrfXJldHVybi0xfWZ1bmN0aW9uIHMoYSl7cmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGEsMCl9ZnVuY3Rpb24gdChhLGIsYyl7Zm9yKHZhciBkPVtdLGU9W10sZj0wO2Y8YS5sZW5ndGg7KXt2YXIgZz1iP2FbZl1bYl06YVtmXTtyKGUsZyk8MCYmZC5wdXNoKGFbZl0pLGVbZl09ZyxmKyt9cmV0dXJuIGMmJihkPWI/ZC5zb3J0KGZ1bmN0aW9uKGEsYyl7cmV0dXJuIGFbYl0+Y1tiXX0pOmQuc29ydCgpKSxkfWZ1bmN0aW9uIHUoYSxiKXtmb3IodmFyIGMsZSxmPWJbMF0udG9VcHBlckNhc2UoKStiLnNsaWNlKDEpLGc9MDtnPG1hLmxlbmd0aDspe2lmKGM9bWFbZ10sZT1jP2MrZjpiLGUgaW4gYSlyZXR1cm4gZTtnKyt9cmV0dXJuIGR9ZnVuY3Rpb24gdigpe3JldHVybiB1YSsrfWZ1bmN0aW9uIHcoYil7dmFyIGM9Yi5vd25lckRvY3VtZW50fHxiO3JldHVybiBjLmRlZmF1bHRWaWV3fHxjLnBhcmVudFdpbmRvd3x8YX1mdW5jdGlvbiB4KGEsYil7dmFyIGM9dGhpczt0aGlzLm1hbmFnZXI9YSx0aGlzLmNhbGxiYWNrPWIsdGhpcy5lbGVtZW50PWEuZWxlbWVudCx0aGlzLnRhcmdldD1hLm9wdGlvbnMuaW5wdXRUYXJnZXQsdGhpcy5kb21IYW5kbGVyPWZ1bmN0aW9uKGIpe2soYS5vcHRpb25zLmVuYWJsZSxbYV0pJiZjLmhhbmRsZXIoYil9LHRoaXMuaW5pdCgpfWZ1bmN0aW9uIHkoYSl7dmFyIGIsYz1hLm9wdGlvbnMuaW5wdXRDbGFzcztyZXR1cm4gbmV3KGI9Yz9jOnhhP006eWE/UDp3YT9SOkwpKGEseil9ZnVuY3Rpb24geihhLGIsYyl7dmFyIGQ9Yy5wb2ludGVycy5sZW5ndGgsZT1jLmNoYW5nZWRQb2ludGVycy5sZW5ndGgsZj1iJkVhJiZkLWU9PT0wLGc9YiYoR2F8SGEpJiZkLWU9PT0wO2MuaXNGaXJzdD0hIWYsYy5pc0ZpbmFsPSEhZyxmJiYoYS5zZXNzaW9uPXt9KSxjLmV2ZW50VHlwZT1iLEEoYSxjKSxhLmVtaXQoXCJoYW1tZXIuaW5wdXRcIixjKSxhLnJlY29nbml6ZShjKSxhLnNlc3Npb24ucHJldklucHV0PWN9ZnVuY3Rpb24gQShhLGIpe3ZhciBjPWEuc2Vzc2lvbixkPWIucG9pbnRlcnMsZT1kLmxlbmd0aDtjLmZpcnN0SW5wdXR8fChjLmZpcnN0SW5wdXQ9RChiKSksZT4xJiYhYy5maXJzdE11bHRpcGxlP2MuZmlyc3RNdWx0aXBsZT1EKGIpOjE9PT1lJiYoYy5maXJzdE11bHRpcGxlPSExKTt2YXIgZj1jLmZpcnN0SW5wdXQsZz1jLmZpcnN0TXVsdGlwbGUsaD1nP2cuY2VudGVyOmYuY2VudGVyLGk9Yi5jZW50ZXI9RShkKTtiLnRpbWVTdGFtcD1yYSgpLGIuZGVsdGFUaW1lPWIudGltZVN0YW1wLWYudGltZVN0YW1wLGIuYW5nbGU9SShoLGkpLGIuZGlzdGFuY2U9SChoLGkpLEIoYyxiKSxiLm9mZnNldERpcmVjdGlvbj1HKGIuZGVsdGFYLGIuZGVsdGFZKTt2YXIgaj1GKGIuZGVsdGFUaW1lLGIuZGVsdGFYLGIuZGVsdGFZKTtiLm92ZXJhbGxWZWxvY2l0eVg9ai54LGIub3ZlcmFsbFZlbG9jaXR5WT1qLnksYi5vdmVyYWxsVmVsb2NpdHk9cWEoai54KT5xYShqLnkpP2oueDpqLnksYi5zY2FsZT1nP0soZy5wb2ludGVycyxkKToxLGIucm90YXRpb249Zz9KKGcucG9pbnRlcnMsZCk6MCxiLm1heFBvaW50ZXJzPWMucHJldklucHV0P2IucG9pbnRlcnMubGVuZ3RoPmMucHJldklucHV0Lm1heFBvaW50ZXJzP2IucG9pbnRlcnMubGVuZ3RoOmMucHJldklucHV0Lm1heFBvaW50ZXJzOmIucG9pbnRlcnMubGVuZ3RoLEMoYyxiKTt2YXIgaz1hLmVsZW1lbnQ7byhiLnNyY0V2ZW50LnRhcmdldCxrKSYmKGs9Yi5zcmNFdmVudC50YXJnZXQpLGIudGFyZ2V0PWt9ZnVuY3Rpb24gQihhLGIpe3ZhciBjPWIuY2VudGVyLGQ9YS5vZmZzZXREZWx0YXx8e30sZT1hLnByZXZEZWx0YXx8e30sZj1hLnByZXZJbnB1dHx8e307Yi5ldmVudFR5cGUhPT1FYSYmZi5ldmVudFR5cGUhPT1HYXx8KGU9YS5wcmV2RGVsdGE9e3g6Zi5kZWx0YVh8fDAseTpmLmRlbHRhWXx8MH0sZD1hLm9mZnNldERlbHRhPXt4OmMueCx5OmMueX0pLGIuZGVsdGFYPWUueCsoYy54LWQueCksYi5kZWx0YVk9ZS55KyhjLnktZC55KX1mdW5jdGlvbiBDKGEsYil7dmFyIGMsZSxmLGcsaD1hLmxhc3RJbnRlcnZhbHx8YixpPWIudGltZVN0YW1wLWgudGltZVN0YW1wO2lmKGIuZXZlbnRUeXBlIT1IYSYmKGk+RGF8fGgudmVsb2NpdHk9PT1kKSl7dmFyIGo9Yi5kZWx0YVgtaC5kZWx0YVgsaz1iLmRlbHRhWS1oLmRlbHRhWSxsPUYoaSxqLGspO2U9bC54LGY9bC55LGM9cWEobC54KT5xYShsLnkpP2wueDpsLnksZz1HKGosayksYS5sYXN0SW50ZXJ2YWw9Yn1lbHNlIGM9aC52ZWxvY2l0eSxlPWgudmVsb2NpdHlYLGY9aC52ZWxvY2l0eVksZz1oLmRpcmVjdGlvbjtiLnZlbG9jaXR5PWMsYi52ZWxvY2l0eVg9ZSxiLnZlbG9jaXR5WT1mLGIuZGlyZWN0aW9uPWd9ZnVuY3Rpb24gRChhKXtmb3IodmFyIGI9W10sYz0wO2M8YS5wb2ludGVycy5sZW5ndGg7KWJbY109e2NsaWVudFg6cGEoYS5wb2ludGVyc1tjXS5jbGllbnRYKSxjbGllbnRZOnBhKGEucG9pbnRlcnNbY10uY2xpZW50WSl9LGMrKztyZXR1cm57dGltZVN0YW1wOnJhKCkscG9pbnRlcnM6YixjZW50ZXI6RShiKSxkZWx0YVg6YS5kZWx0YVgsZGVsdGFZOmEuZGVsdGFZfX1mdW5jdGlvbiBFKGEpe3ZhciBiPWEubGVuZ3RoO2lmKDE9PT1iKXJldHVybnt4OnBhKGFbMF0uY2xpZW50WCkseTpwYShhWzBdLmNsaWVudFkpfTtmb3IodmFyIGM9MCxkPTAsZT0wO2I+ZTspYys9YVtlXS5jbGllbnRYLGQrPWFbZV0uY2xpZW50WSxlKys7cmV0dXJue3g6cGEoYy9iKSx5OnBhKGQvYil9fWZ1bmN0aW9uIEYoYSxiLGMpe3JldHVybnt4OmIvYXx8MCx5OmMvYXx8MH19ZnVuY3Rpb24gRyhhLGIpe3JldHVybiBhPT09Yj9JYTpxYShhKT49cWEoYik/MD5hP0phOkthOjA+Yj9MYTpNYX1mdW5jdGlvbiBIKGEsYixjKXtjfHwoYz1RYSk7dmFyIGQ9YltjWzBdXS1hW2NbMF1dLGU9YltjWzFdXS1hW2NbMV1dO3JldHVybiBNYXRoLnNxcnQoZCpkK2UqZSl9ZnVuY3Rpb24gSShhLGIsYyl7Y3x8KGM9UWEpO3ZhciBkPWJbY1swXV0tYVtjWzBdXSxlPWJbY1sxXV0tYVtjWzFdXTtyZXR1cm4gMTgwKk1hdGguYXRhbjIoZSxkKS9NYXRoLlBJfWZ1bmN0aW9uIEooYSxiKXtyZXR1cm4gSShiWzFdLGJbMF0sUmEpK0koYVsxXSxhWzBdLFJhKX1mdW5jdGlvbiBLKGEsYil7cmV0dXJuIEgoYlswXSxiWzFdLFJhKS9IKGFbMF0sYVsxXSxSYSl9ZnVuY3Rpb24gTCgpe3RoaXMuZXZFbD1UYSx0aGlzLmV2V2luPVVhLHRoaXMucHJlc3NlZD0hMSx4LmFwcGx5KHRoaXMsYXJndW1lbnRzKX1mdW5jdGlvbiBNKCl7dGhpcy5ldkVsPVhhLHRoaXMuZXZXaW49WWEseC5hcHBseSh0aGlzLGFyZ3VtZW50cyksdGhpcy5zdG9yZT10aGlzLm1hbmFnZXIuc2Vzc2lvbi5wb2ludGVyRXZlbnRzPVtdfWZ1bmN0aW9uIE4oKXt0aGlzLmV2VGFyZ2V0PSRhLHRoaXMuZXZXaW49X2EsdGhpcy5zdGFydGVkPSExLHguYXBwbHkodGhpcyxhcmd1bWVudHMpfWZ1bmN0aW9uIE8oYSxiKXt2YXIgYz1zKGEudG91Y2hlcyksZD1zKGEuY2hhbmdlZFRvdWNoZXMpO3JldHVybiBiJihHYXxIYSkmJihjPXQoYy5jb25jYXQoZCksXCJpZGVudGlmaWVyXCIsITApKSxbYyxkXX1mdW5jdGlvbiBQKCl7dGhpcy5ldlRhcmdldD1iYix0aGlzLnRhcmdldElkcz17fSx4LmFwcGx5KHRoaXMsYXJndW1lbnRzKX1mdW5jdGlvbiBRKGEsYil7dmFyIGM9cyhhLnRvdWNoZXMpLGQ9dGhpcy50YXJnZXRJZHM7aWYoYiYoRWF8RmEpJiYxPT09Yy5sZW5ndGgpcmV0dXJuIGRbY1swXS5pZGVudGlmaWVyXT0hMCxbYyxjXTt2YXIgZSxmLGc9cyhhLmNoYW5nZWRUb3VjaGVzKSxoPVtdLGk9dGhpcy50YXJnZXQ7aWYoZj1jLmZpbHRlcihmdW5jdGlvbihhKXtyZXR1cm4gbyhhLnRhcmdldCxpKX0pLGI9PT1FYSlmb3IoZT0wO2U8Zi5sZW5ndGg7KWRbZltlXS5pZGVudGlmaWVyXT0hMCxlKys7Zm9yKGU9MDtlPGcubGVuZ3RoOylkW2dbZV0uaWRlbnRpZmllcl0mJmgucHVzaChnW2VdKSxiJihHYXxIYSkmJmRlbGV0ZSBkW2dbZV0uaWRlbnRpZmllcl0sZSsrO3JldHVybiBoLmxlbmd0aD9bdChmLmNvbmNhdChoKSxcImlkZW50aWZpZXJcIiwhMCksaF06dm9pZCAwfWZ1bmN0aW9uIFIoKXt4LmFwcGx5KHRoaXMsYXJndW1lbnRzKTt2YXIgYT1qKHRoaXMuaGFuZGxlcix0aGlzKTt0aGlzLnRvdWNoPW5ldyBQKHRoaXMubWFuYWdlcixhKSx0aGlzLm1vdXNlPW5ldyBMKHRoaXMubWFuYWdlcixhKSx0aGlzLnByaW1hcnlUb3VjaD1udWxsLHRoaXMubGFzdFRvdWNoZXM9W119ZnVuY3Rpb24gUyhhLGIpe2EmRWE/KHRoaXMucHJpbWFyeVRvdWNoPWIuY2hhbmdlZFBvaW50ZXJzWzBdLmlkZW50aWZpZXIsVC5jYWxsKHRoaXMsYikpOmEmKEdhfEhhKSYmVC5jYWxsKHRoaXMsYil9ZnVuY3Rpb24gVChhKXt2YXIgYj1hLmNoYW5nZWRQb2ludGVyc1swXTtpZihiLmlkZW50aWZpZXI9PT10aGlzLnByaW1hcnlUb3VjaCl7dmFyIGM9e3g6Yi5jbGllbnRYLHk6Yi5jbGllbnRZfTt0aGlzLmxhc3RUb3VjaGVzLnB1c2goYyk7dmFyIGQ9dGhpcy5sYXN0VG91Y2hlcyxlPWZ1bmN0aW9uKCl7dmFyIGE9ZC5pbmRleE9mKGMpO2E+LTEmJmQuc3BsaWNlKGEsMSl9O3NldFRpbWVvdXQoZSxjYil9fWZ1bmN0aW9uIFUoYSl7Zm9yKHZhciBiPWEuc3JjRXZlbnQuY2xpZW50WCxjPWEuc3JjRXZlbnQuY2xpZW50WSxkPTA7ZDx0aGlzLmxhc3RUb3VjaGVzLmxlbmd0aDtkKyspe3ZhciBlPXRoaXMubGFzdFRvdWNoZXNbZF0sZj1NYXRoLmFicyhiLWUueCksZz1NYXRoLmFicyhjLWUueSk7aWYoZGI+PWYmJmRiPj1nKXJldHVybiEwfXJldHVybiExfWZ1bmN0aW9uIFYoYSxiKXt0aGlzLm1hbmFnZXI9YSx0aGlzLnNldChiKX1mdW5jdGlvbiBXKGEpe2lmKHAoYSxqYikpcmV0dXJuIGpiO3ZhciBiPXAoYSxrYiksYz1wKGEsbGIpO3JldHVybiBiJiZjP2piOmJ8fGM/Yj9rYjpsYjpwKGEsaWIpP2liOmhifWZ1bmN0aW9uIFgoKXtpZighZmIpcmV0dXJuITE7dmFyIGI9e30sYz1hLkNTUyYmYS5DU1Muc3VwcG9ydHM7cmV0dXJuW1wiYXV0b1wiLFwibWFuaXB1bGF0aW9uXCIsXCJwYW4teVwiLFwicGFuLXhcIixcInBhbi14IHBhbi15XCIsXCJub25lXCJdLmZvckVhY2goZnVuY3Rpb24oZCl7YltkXT1jP2EuQ1NTLnN1cHBvcnRzKFwidG91Y2gtYWN0aW9uXCIsZCk6ITB9KSxifWZ1bmN0aW9uIFkoYSl7dGhpcy5vcHRpb25zPWxhKHt9LHRoaXMuZGVmYXVsdHMsYXx8e30pLHRoaXMuaWQ9digpLHRoaXMubWFuYWdlcj1udWxsLHRoaXMub3B0aW9ucy5lbmFibGU9bCh0aGlzLm9wdGlvbnMuZW5hYmxlLCEwKSx0aGlzLnN0YXRlPW5iLHRoaXMuc2ltdWx0YW5lb3VzPXt9LHRoaXMucmVxdWlyZUZhaWw9W119ZnVuY3Rpb24gWihhKXtyZXR1cm4gYSZzYj9cImNhbmNlbFwiOmEmcWI/XCJlbmRcIjphJnBiP1wibW92ZVwiOmEmb2I/XCJzdGFydFwiOlwiXCJ9ZnVuY3Rpb24gJChhKXtyZXR1cm4gYT09TWE/XCJkb3duXCI6YT09TGE/XCJ1cFwiOmE9PUphP1wibGVmdFwiOmE9PUthP1wicmlnaHRcIjpcIlwifWZ1bmN0aW9uIF8oYSxiKXt2YXIgYz1iLm1hbmFnZXI7cmV0dXJuIGM/Yy5nZXQoYSk6YX1mdW5jdGlvbiBhYSgpe1kuYXBwbHkodGhpcyxhcmd1bWVudHMpfWZ1bmN0aW9uIGJhKCl7YWEuYXBwbHkodGhpcyxhcmd1bWVudHMpLHRoaXMucFg9bnVsbCx0aGlzLnBZPW51bGx9ZnVuY3Rpb24gY2EoKXthYS5hcHBseSh0aGlzLGFyZ3VtZW50cyl9ZnVuY3Rpb24gZGEoKXtZLmFwcGx5KHRoaXMsYXJndW1lbnRzKSx0aGlzLl90aW1lcj1udWxsLHRoaXMuX2lucHV0PW51bGx9ZnVuY3Rpb24gZWEoKXthYS5hcHBseSh0aGlzLGFyZ3VtZW50cyl9ZnVuY3Rpb24gZmEoKXthYS5hcHBseSh0aGlzLGFyZ3VtZW50cyl9ZnVuY3Rpb24gZ2EoKXtZLmFwcGx5KHRoaXMsYXJndW1lbnRzKSx0aGlzLnBUaW1lPSExLHRoaXMucENlbnRlcj0hMSx0aGlzLl90aW1lcj1udWxsLHRoaXMuX2lucHV0PW51bGwsdGhpcy5jb3VudD0wfWZ1bmN0aW9uIGhhKGEsYil7cmV0dXJuIGI9Ynx8e30sYi5yZWNvZ25pemVycz1sKGIucmVjb2duaXplcnMsaGEuZGVmYXVsdHMucHJlc2V0KSxuZXcgaWEoYSxiKX1mdW5jdGlvbiBpYShhLGIpe3RoaXMub3B0aW9ucz1sYSh7fSxoYS5kZWZhdWx0cyxifHx7fSksdGhpcy5vcHRpb25zLmlucHV0VGFyZ2V0PXRoaXMub3B0aW9ucy5pbnB1dFRhcmdldHx8YSx0aGlzLmhhbmRsZXJzPXt9LHRoaXMuc2Vzc2lvbj17fSx0aGlzLnJlY29nbml6ZXJzPVtdLHRoaXMub2xkQ3NzUHJvcHM9e30sdGhpcy5lbGVtZW50PWEsdGhpcy5pbnB1dD15KHRoaXMpLHRoaXMudG91Y2hBY3Rpb249bmV3IFYodGhpcyx0aGlzLm9wdGlvbnMudG91Y2hBY3Rpb24pLGphKHRoaXMsITApLGcodGhpcy5vcHRpb25zLnJlY29nbml6ZXJzLGZ1bmN0aW9uKGEpe3ZhciBiPXRoaXMuYWRkKG5ldyBhWzBdKGFbMV0pKTthWzJdJiZiLnJlY29nbml6ZVdpdGgoYVsyXSksYVszXSYmYi5yZXF1aXJlRmFpbHVyZShhWzNdKX0sdGhpcyl9ZnVuY3Rpb24gamEoYSxiKXt2YXIgYz1hLmVsZW1lbnQ7aWYoYy5zdHlsZSl7dmFyIGQ7ZyhhLm9wdGlvbnMuY3NzUHJvcHMsZnVuY3Rpb24oZSxmKXtkPXUoYy5zdHlsZSxmKSxiPyhhLm9sZENzc1Byb3BzW2RdPWMuc3R5bGVbZF0sYy5zdHlsZVtkXT1lKTpjLnN0eWxlW2RdPWEub2xkQ3NzUHJvcHNbZF18fFwiXCJ9KSxifHwoYS5vbGRDc3NQcm9wcz17fSl9fWZ1bmN0aW9uIGthKGEsYyl7dmFyIGQ9Yi5jcmVhdGVFdmVudChcIkV2ZW50XCIpO2QuaW5pdEV2ZW50KGEsITAsITApLGQuZ2VzdHVyZT1jLGMudGFyZ2V0LmRpc3BhdGNoRXZlbnQoZCl9dmFyIGxhLG1hPVtcIlwiLFwid2Via2l0XCIsXCJNb3pcIixcIk1TXCIsXCJtc1wiLFwib1wiXSxuYT1iLmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiksb2E9XCJmdW5jdGlvblwiLHBhPU1hdGgucm91bmQscWE9TWF0aC5hYnMscmE9RGF0ZS5ub3c7bGE9XCJmdW5jdGlvblwiIT10eXBlb2YgT2JqZWN0LmFzc2lnbj9mdW5jdGlvbihhKXtpZihhPT09ZHx8bnVsbD09PWEpdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjb252ZXJ0IHVuZGVmaW5lZCBvciBudWxsIHRvIG9iamVjdFwiKTtmb3IodmFyIGI9T2JqZWN0KGEpLGM9MTtjPGFyZ3VtZW50cy5sZW5ndGg7YysrKXt2YXIgZT1hcmd1bWVudHNbY107aWYoZSE9PWQmJm51bGwhPT1lKWZvcih2YXIgZiBpbiBlKWUuaGFzT3duUHJvcGVydHkoZikmJihiW2ZdPWVbZl0pfXJldHVybiBifTpPYmplY3QuYXNzaWduO3ZhciBzYT1oKGZ1bmN0aW9uKGEsYixjKXtmb3IodmFyIGU9T2JqZWN0LmtleXMoYiksZj0wO2Y8ZS5sZW5ndGg7KSghY3x8YyYmYVtlW2ZdXT09PWQpJiYoYVtlW2ZdXT1iW2VbZl1dKSxmKys7cmV0dXJuIGF9LFwiZXh0ZW5kXCIsXCJVc2UgYGFzc2lnbmAuXCIpLHRhPWgoZnVuY3Rpb24oYSxiKXtyZXR1cm4gc2EoYSxiLCEwKX0sXCJtZXJnZVwiLFwiVXNlIGBhc3NpZ25gLlwiKSx1YT0xLHZhPS9tb2JpbGV8dGFibGV0fGlwKGFkfGhvbmV8b2QpfGFuZHJvaWQvaSx3YT1cIm9udG91Y2hzdGFydFwiaW4gYSx4YT11KGEsXCJQb2ludGVyRXZlbnRcIikhPT1kLHlhPXdhJiZ2YS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpLHphPVwidG91Y2hcIixBYT1cInBlblwiLEJhPVwibW91c2VcIixDYT1cImtpbmVjdFwiLERhPTI1LEVhPTEsRmE9MixHYT00LEhhPTgsSWE9MSxKYT0yLEthPTQsTGE9OCxNYT0xNixOYT1KYXxLYSxPYT1MYXxNYSxQYT1OYXxPYSxRYT1bXCJ4XCIsXCJ5XCJdLFJhPVtcImNsaWVudFhcIixcImNsaWVudFlcIl07eC5wcm90b3R5cGU9e2hhbmRsZXI6ZnVuY3Rpb24oKXt9LGluaXQ6ZnVuY3Rpb24oKXt0aGlzLmV2RWwmJm0odGhpcy5lbGVtZW50LHRoaXMuZXZFbCx0aGlzLmRvbUhhbmRsZXIpLHRoaXMuZXZUYXJnZXQmJm0odGhpcy50YXJnZXQsdGhpcy5ldlRhcmdldCx0aGlzLmRvbUhhbmRsZXIpLHRoaXMuZXZXaW4mJm0odyh0aGlzLmVsZW1lbnQpLHRoaXMuZXZXaW4sdGhpcy5kb21IYW5kbGVyKX0sZGVzdHJveTpmdW5jdGlvbigpe3RoaXMuZXZFbCYmbih0aGlzLmVsZW1lbnQsdGhpcy5ldkVsLHRoaXMuZG9tSGFuZGxlciksdGhpcy5ldlRhcmdldCYmbih0aGlzLnRhcmdldCx0aGlzLmV2VGFyZ2V0LHRoaXMuZG9tSGFuZGxlciksdGhpcy5ldldpbiYmbih3KHRoaXMuZWxlbWVudCksdGhpcy5ldldpbix0aGlzLmRvbUhhbmRsZXIpfX07dmFyIFNhPXttb3VzZWRvd246RWEsbW91c2Vtb3ZlOkZhLG1vdXNldXA6R2F9LFRhPVwibW91c2Vkb3duXCIsVWE9XCJtb3VzZW1vdmUgbW91c2V1cFwiO2koTCx4LHtoYW5kbGVyOmZ1bmN0aW9uKGEpe3ZhciBiPVNhW2EudHlwZV07YiZFYSYmMD09PWEuYnV0dG9uJiYodGhpcy5wcmVzc2VkPSEwKSxiJkZhJiYxIT09YS53aGljaCYmKGI9R2EpLHRoaXMucHJlc3NlZCYmKGImR2EmJih0aGlzLnByZXNzZWQ9ITEpLHRoaXMuY2FsbGJhY2sodGhpcy5tYW5hZ2VyLGIse3BvaW50ZXJzOlthXSxjaGFuZ2VkUG9pbnRlcnM6W2FdLHBvaW50ZXJUeXBlOkJhLHNyY0V2ZW50OmF9KSl9fSk7dmFyIFZhPXtwb2ludGVyZG93bjpFYSxwb2ludGVybW92ZTpGYSxwb2ludGVydXA6R2EscG9pbnRlcmNhbmNlbDpIYSxwb2ludGVyb3V0OkhhfSxXYT17Mjp6YSwzOkFhLDQ6QmEsNTpDYX0sWGE9XCJwb2ludGVyZG93blwiLFlhPVwicG9pbnRlcm1vdmUgcG9pbnRlcnVwIHBvaW50ZXJjYW5jZWxcIjthLk1TUG9pbnRlckV2ZW50JiYhYS5Qb2ludGVyRXZlbnQmJihYYT1cIk1TUG9pbnRlckRvd25cIixZYT1cIk1TUG9pbnRlck1vdmUgTVNQb2ludGVyVXAgTVNQb2ludGVyQ2FuY2VsXCIpLGkoTSx4LHtoYW5kbGVyOmZ1bmN0aW9uKGEpe3ZhciBiPXRoaXMuc3RvcmUsYz0hMSxkPWEudHlwZS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoXCJtc1wiLFwiXCIpLGU9VmFbZF0sZj1XYVthLnBvaW50ZXJUeXBlXXx8YS5wb2ludGVyVHlwZSxnPWY9PXphLGg9cihiLGEucG9pbnRlcklkLFwicG9pbnRlcklkXCIpO2UmRWEmJigwPT09YS5idXR0b258fGcpPzA+aCYmKGIucHVzaChhKSxoPWIubGVuZ3RoLTEpOmUmKEdhfEhhKSYmKGM9ITApLDA+aHx8KGJbaF09YSx0aGlzLmNhbGxiYWNrKHRoaXMubWFuYWdlcixlLHtwb2ludGVyczpiLGNoYW5nZWRQb2ludGVyczpbYV0scG9pbnRlclR5cGU6ZixzcmNFdmVudDphfSksYyYmYi5zcGxpY2UoaCwxKSl9fSk7dmFyIFphPXt0b3VjaHN0YXJ0OkVhLHRvdWNobW92ZTpGYSx0b3VjaGVuZDpHYSx0b3VjaGNhbmNlbDpIYX0sJGE9XCJ0b3VjaHN0YXJ0XCIsX2E9XCJ0b3VjaHN0YXJ0IHRvdWNobW92ZSB0b3VjaGVuZCB0b3VjaGNhbmNlbFwiO2koTix4LHtoYW5kbGVyOmZ1bmN0aW9uKGEpe3ZhciBiPVphW2EudHlwZV07aWYoYj09PUVhJiYodGhpcy5zdGFydGVkPSEwKSx0aGlzLnN0YXJ0ZWQpe3ZhciBjPU8uY2FsbCh0aGlzLGEsYik7YiYoR2F8SGEpJiZjWzBdLmxlbmd0aC1jWzFdLmxlbmd0aD09PTAmJih0aGlzLnN0YXJ0ZWQ9ITEpLHRoaXMuY2FsbGJhY2sodGhpcy5tYW5hZ2VyLGIse3BvaW50ZXJzOmNbMF0sY2hhbmdlZFBvaW50ZXJzOmNbMV0scG9pbnRlclR5cGU6emEsc3JjRXZlbnQ6YX0pfX19KTt2YXIgYWI9e3RvdWNoc3RhcnQ6RWEsdG91Y2htb3ZlOkZhLHRvdWNoZW5kOkdhLHRvdWNoY2FuY2VsOkhhfSxiYj1cInRvdWNoc3RhcnQgdG91Y2htb3ZlIHRvdWNoZW5kIHRvdWNoY2FuY2VsXCI7aShQLHgse2hhbmRsZXI6ZnVuY3Rpb24oYSl7dmFyIGI9YWJbYS50eXBlXSxjPVEuY2FsbCh0aGlzLGEsYik7YyYmdGhpcy5jYWxsYmFjayh0aGlzLm1hbmFnZXIsYix7cG9pbnRlcnM6Y1swXSxjaGFuZ2VkUG9pbnRlcnM6Y1sxXSxwb2ludGVyVHlwZTp6YSxzcmNFdmVudDphfSl9fSk7dmFyIGNiPTI1MDAsZGI9MjU7aShSLHgse2hhbmRsZXI6ZnVuY3Rpb24oYSxiLGMpe3ZhciBkPWMucG9pbnRlclR5cGU9PXphLGU9Yy5wb2ludGVyVHlwZT09QmE7aWYoIShlJiZjLnNvdXJjZUNhcGFiaWxpdGllcyYmYy5zb3VyY2VDYXBhYmlsaXRpZXMuZmlyZXNUb3VjaEV2ZW50cykpe2lmKGQpUy5jYWxsKHRoaXMsYixjKTtlbHNlIGlmKGUmJlUuY2FsbCh0aGlzLGMpKXJldHVybjt0aGlzLmNhbGxiYWNrKGEsYixjKX19LGRlc3Ryb3k6ZnVuY3Rpb24oKXt0aGlzLnRvdWNoLmRlc3Ryb3koKSx0aGlzLm1vdXNlLmRlc3Ryb3koKX19KTt2YXIgZWI9dShuYS5zdHlsZSxcInRvdWNoQWN0aW9uXCIpLGZiPWViIT09ZCxnYj1cImNvbXB1dGVcIixoYj1cImF1dG9cIixpYj1cIm1hbmlwdWxhdGlvblwiLGpiPVwibm9uZVwiLGtiPVwicGFuLXhcIixsYj1cInBhbi15XCIsbWI9WCgpO1YucHJvdG90eXBlPXtzZXQ6ZnVuY3Rpb24oYSl7YT09Z2ImJihhPXRoaXMuY29tcHV0ZSgpKSxmYiYmdGhpcy5tYW5hZ2VyLmVsZW1lbnQuc3R5bGUmJm1iW2FdJiYodGhpcy5tYW5hZ2VyLmVsZW1lbnQuc3R5bGVbZWJdPWEpLHRoaXMuYWN0aW9ucz1hLnRvTG93ZXJDYXNlKCkudHJpbSgpfSx1cGRhdGU6ZnVuY3Rpb24oKXt0aGlzLnNldCh0aGlzLm1hbmFnZXIub3B0aW9ucy50b3VjaEFjdGlvbil9LGNvbXB1dGU6ZnVuY3Rpb24oKXt2YXIgYT1bXTtyZXR1cm4gZyh0aGlzLm1hbmFnZXIucmVjb2duaXplcnMsZnVuY3Rpb24oYil7ayhiLm9wdGlvbnMuZW5hYmxlLFtiXSkmJihhPWEuY29uY2F0KGIuZ2V0VG91Y2hBY3Rpb24oKSkpfSksVyhhLmpvaW4oXCIgXCIpKX0scHJldmVudERlZmF1bHRzOmZ1bmN0aW9uKGEpe3ZhciBiPWEuc3JjRXZlbnQsYz1hLm9mZnNldERpcmVjdGlvbjtpZih0aGlzLm1hbmFnZXIuc2Vzc2lvbi5wcmV2ZW50ZWQpcmV0dXJuIHZvaWQgYi5wcmV2ZW50RGVmYXVsdCgpO3ZhciBkPXRoaXMuYWN0aW9ucyxlPXAoZCxqYikmJiFtYltqYl0sZj1wKGQsbGIpJiYhbWJbbGJdLGc9cChkLGtiKSYmIW1iW2tiXTtpZihlKXt2YXIgaD0xPT09YS5wb2ludGVycy5sZW5ndGgsaT1hLmRpc3RhbmNlPDIsaj1hLmRlbHRhVGltZTwyNTA7aWYoaCYmaSYmailyZXR1cm59cmV0dXJuIGcmJmY/dm9pZCAwOmV8fGYmJmMmTmF8fGcmJmMmT2E/dGhpcy5wcmV2ZW50U3JjKGIpOnZvaWQgMH0scHJldmVudFNyYzpmdW5jdGlvbihhKXt0aGlzLm1hbmFnZXIuc2Vzc2lvbi5wcmV2ZW50ZWQ9ITAsYS5wcmV2ZW50RGVmYXVsdCgpfX07dmFyIG5iPTEsb2I9MixwYj00LHFiPTgscmI9cWIsc2I9MTYsdGI9MzI7WS5wcm90b3R5cGU9e2RlZmF1bHRzOnt9LHNldDpmdW5jdGlvbihhKXtyZXR1cm4gbGEodGhpcy5vcHRpb25zLGEpLHRoaXMubWFuYWdlciYmdGhpcy5tYW5hZ2VyLnRvdWNoQWN0aW9uLnVwZGF0ZSgpLHRoaXN9LHJlY29nbml6ZVdpdGg6ZnVuY3Rpb24oYSl7aWYoZihhLFwicmVjb2duaXplV2l0aFwiLHRoaXMpKXJldHVybiB0aGlzO3ZhciBiPXRoaXMuc2ltdWx0YW5lb3VzO3JldHVybiBhPV8oYSx0aGlzKSxiW2EuaWRdfHwoYlthLmlkXT1hLGEucmVjb2duaXplV2l0aCh0aGlzKSksdGhpc30sZHJvcFJlY29nbml6ZVdpdGg6ZnVuY3Rpb24oYSl7cmV0dXJuIGYoYSxcImRyb3BSZWNvZ25pemVXaXRoXCIsdGhpcyk/dGhpczooYT1fKGEsdGhpcyksZGVsZXRlIHRoaXMuc2ltdWx0YW5lb3VzW2EuaWRdLHRoaXMpfSxyZXF1aXJlRmFpbHVyZTpmdW5jdGlvbihhKXtpZihmKGEsXCJyZXF1aXJlRmFpbHVyZVwiLHRoaXMpKXJldHVybiB0aGlzO3ZhciBiPXRoaXMucmVxdWlyZUZhaWw7cmV0dXJuIGE9XyhhLHRoaXMpLC0xPT09cihiLGEpJiYoYi5wdXNoKGEpLGEucmVxdWlyZUZhaWx1cmUodGhpcykpLHRoaXN9LGRyb3BSZXF1aXJlRmFpbHVyZTpmdW5jdGlvbihhKXtpZihmKGEsXCJkcm9wUmVxdWlyZUZhaWx1cmVcIix0aGlzKSlyZXR1cm4gdGhpczthPV8oYSx0aGlzKTt2YXIgYj1yKHRoaXMucmVxdWlyZUZhaWwsYSk7cmV0dXJuIGI+LTEmJnRoaXMucmVxdWlyZUZhaWwuc3BsaWNlKGIsMSksdGhpc30saGFzUmVxdWlyZUZhaWx1cmVzOmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMucmVxdWlyZUZhaWwubGVuZ3RoPjB9LGNhblJlY29nbml6ZVdpdGg6ZnVuY3Rpb24oYSl7cmV0dXJuISF0aGlzLnNpbXVsdGFuZW91c1thLmlkXX0sZW1pdDpmdW5jdGlvbihhKXtmdW5jdGlvbiBiKGIpe2MubWFuYWdlci5lbWl0KGIsYSl9dmFyIGM9dGhpcyxkPXRoaXMuc3RhdGU7cWI+ZCYmYihjLm9wdGlvbnMuZXZlbnQrWihkKSksYihjLm9wdGlvbnMuZXZlbnQpLGEuYWRkaXRpb25hbEV2ZW50JiZiKGEuYWRkaXRpb25hbEV2ZW50KSxkPj1xYiYmYihjLm9wdGlvbnMuZXZlbnQrWihkKSl9LHRyeUVtaXQ6ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMuY2FuRW1pdCgpP3RoaXMuZW1pdChhKTp2b2lkKHRoaXMuc3RhdGU9dGIpfSxjYW5FbWl0OmZ1bmN0aW9uKCl7Zm9yKHZhciBhPTA7YTx0aGlzLnJlcXVpcmVGYWlsLmxlbmd0aDspe2lmKCEodGhpcy5yZXF1aXJlRmFpbFthXS5zdGF0ZSYodGJ8bmIpKSlyZXR1cm4hMTthKyt9cmV0dXJuITB9LHJlY29nbml6ZTpmdW5jdGlvbihhKXt2YXIgYj1sYSh7fSxhKTtyZXR1cm4gayh0aGlzLm9wdGlvbnMuZW5hYmxlLFt0aGlzLGJdKT8odGhpcy5zdGF0ZSYocmJ8c2J8dGIpJiYodGhpcy5zdGF0ZT1uYiksdGhpcy5zdGF0ZT10aGlzLnByb2Nlc3MoYiksdm9pZCh0aGlzLnN0YXRlJihvYnxwYnxxYnxzYikmJnRoaXMudHJ5RW1pdChiKSkpOih0aGlzLnJlc2V0KCksdm9pZCh0aGlzLnN0YXRlPXRiKSl9LHByb2Nlc3M6ZnVuY3Rpb24oYSl7fSxnZXRUb3VjaEFjdGlvbjpmdW5jdGlvbigpe30scmVzZXQ6ZnVuY3Rpb24oKXt9fSxpKGFhLFkse2RlZmF1bHRzOntwb2ludGVyczoxfSxhdHRyVGVzdDpmdW5jdGlvbihhKXt2YXIgYj10aGlzLm9wdGlvbnMucG9pbnRlcnM7cmV0dXJuIDA9PT1ifHxhLnBvaW50ZXJzLmxlbmd0aD09PWJ9LHByb2Nlc3M6ZnVuY3Rpb24oYSl7dmFyIGI9dGhpcy5zdGF0ZSxjPWEuZXZlbnRUeXBlLGQ9YiYob2J8cGIpLGU9dGhpcy5hdHRyVGVzdChhKTtyZXR1cm4gZCYmKGMmSGF8fCFlKT9ifHNiOmR8fGU/YyZHYT9ifHFiOmImb2I/YnxwYjpvYjp0Yn19KSxpKGJhLGFhLHtkZWZhdWx0czp7ZXZlbnQ6XCJwYW5cIix0aHJlc2hvbGQ6MTAscG9pbnRlcnM6MSxkaXJlY3Rpb246UGF9LGdldFRvdWNoQWN0aW9uOmZ1bmN0aW9uKCl7dmFyIGE9dGhpcy5vcHRpb25zLmRpcmVjdGlvbixiPVtdO3JldHVybiBhJk5hJiZiLnB1c2gobGIpLGEmT2EmJmIucHVzaChrYiksYn0sZGlyZWN0aW9uVGVzdDpmdW5jdGlvbihhKXt2YXIgYj10aGlzLm9wdGlvbnMsYz0hMCxkPWEuZGlzdGFuY2UsZT1hLmRpcmVjdGlvbixmPWEuZGVsdGFYLGc9YS5kZWx0YVk7cmV0dXJuIGUmYi5kaXJlY3Rpb258fChiLmRpcmVjdGlvbiZOYT8oZT0wPT09Zj9JYTowPmY/SmE6S2EsYz1mIT10aGlzLnBYLGQ9TWF0aC5hYnMoYS5kZWx0YVgpKTooZT0wPT09Zz9JYTowPmc/TGE6TWEsYz1nIT10aGlzLnBZLGQ9TWF0aC5hYnMoYS5kZWx0YVkpKSksYS5kaXJlY3Rpb249ZSxjJiZkPmIudGhyZXNob2xkJiZlJmIuZGlyZWN0aW9ufSxhdHRyVGVzdDpmdW5jdGlvbihhKXtyZXR1cm4gYWEucHJvdG90eXBlLmF0dHJUZXN0LmNhbGwodGhpcyxhKSYmKHRoaXMuc3RhdGUmb2J8fCEodGhpcy5zdGF0ZSZvYikmJnRoaXMuZGlyZWN0aW9uVGVzdChhKSl9LGVtaXQ6ZnVuY3Rpb24oYSl7dGhpcy5wWD1hLmRlbHRhWCx0aGlzLnBZPWEuZGVsdGFZO3ZhciBiPSQoYS5kaXJlY3Rpb24pO2ImJihhLmFkZGl0aW9uYWxFdmVudD10aGlzLm9wdGlvbnMuZXZlbnQrYiksdGhpcy5fc3VwZXIuZW1pdC5jYWxsKHRoaXMsYSl9fSksaShjYSxhYSx7ZGVmYXVsdHM6e2V2ZW50OlwicGluY2hcIix0aHJlc2hvbGQ6MCxwb2ludGVyczoyfSxnZXRUb3VjaEFjdGlvbjpmdW5jdGlvbigpe3JldHVybltqYl19LGF0dHJUZXN0OmZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLl9zdXBlci5hdHRyVGVzdC5jYWxsKHRoaXMsYSkmJihNYXRoLmFicyhhLnNjYWxlLTEpPnRoaXMub3B0aW9ucy50aHJlc2hvbGR8fHRoaXMuc3RhdGUmb2IpfSxlbWl0OmZ1bmN0aW9uKGEpe2lmKDEhPT1hLnNjYWxlKXt2YXIgYj1hLnNjYWxlPDE/XCJpblwiOlwib3V0XCI7YS5hZGRpdGlvbmFsRXZlbnQ9dGhpcy5vcHRpb25zLmV2ZW50K2J9dGhpcy5fc3VwZXIuZW1pdC5jYWxsKHRoaXMsYSl9fSksaShkYSxZLHtkZWZhdWx0czp7ZXZlbnQ6XCJwcmVzc1wiLHBvaW50ZXJzOjEsdGltZToyNTEsdGhyZXNob2xkOjl9LGdldFRvdWNoQWN0aW9uOmZ1bmN0aW9uKCl7cmV0dXJuW2hiXX0scHJvY2VzczpmdW5jdGlvbihhKXt2YXIgYj10aGlzLm9wdGlvbnMsYz1hLnBvaW50ZXJzLmxlbmd0aD09PWIucG9pbnRlcnMsZD1hLmRpc3RhbmNlPGIudGhyZXNob2xkLGY9YS5kZWx0YVRpbWU+Yi50aW1lO2lmKHRoaXMuX2lucHV0PWEsIWR8fCFjfHxhLmV2ZW50VHlwZSYoR2F8SGEpJiYhZil0aGlzLnJlc2V0KCk7ZWxzZSBpZihhLmV2ZW50VHlwZSZFYSl0aGlzLnJlc2V0KCksdGhpcy5fdGltZXI9ZShmdW5jdGlvbigpe3RoaXMuc3RhdGU9cmIsdGhpcy50cnlFbWl0KCl9LGIudGltZSx0aGlzKTtlbHNlIGlmKGEuZXZlbnRUeXBlJkdhKXJldHVybiByYjtyZXR1cm4gdGJ9LHJlc2V0OmZ1bmN0aW9uKCl7Y2xlYXJUaW1lb3V0KHRoaXMuX3RpbWVyKX0sZW1pdDpmdW5jdGlvbihhKXt0aGlzLnN0YXRlPT09cmImJihhJiZhLmV2ZW50VHlwZSZHYT90aGlzLm1hbmFnZXIuZW1pdCh0aGlzLm9wdGlvbnMuZXZlbnQrXCJ1cFwiLGEpOih0aGlzLl9pbnB1dC50aW1lU3RhbXA9cmEoKSx0aGlzLm1hbmFnZXIuZW1pdCh0aGlzLm9wdGlvbnMuZXZlbnQsdGhpcy5faW5wdXQpKSl9fSksaShlYSxhYSx7ZGVmYXVsdHM6e2V2ZW50Olwicm90YXRlXCIsdGhyZXNob2xkOjAscG9pbnRlcnM6Mn0sZ2V0VG91Y2hBY3Rpb246ZnVuY3Rpb24oKXtyZXR1cm5bamJdfSxhdHRyVGVzdDpmdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5fc3VwZXIuYXR0clRlc3QuY2FsbCh0aGlzLGEpJiYoTWF0aC5hYnMoYS5yb3RhdGlvbik+dGhpcy5vcHRpb25zLnRocmVzaG9sZHx8dGhpcy5zdGF0ZSZvYil9fSksaShmYSxhYSx7ZGVmYXVsdHM6e2V2ZW50Olwic3dpcGVcIix0aHJlc2hvbGQ6MTAsdmVsb2NpdHk6LjMsZGlyZWN0aW9uOk5hfE9hLHBvaW50ZXJzOjF9LGdldFRvdWNoQWN0aW9uOmZ1bmN0aW9uKCl7cmV0dXJuIGJhLnByb3RvdHlwZS5nZXRUb3VjaEFjdGlvbi5jYWxsKHRoaXMpfSxhdHRyVGVzdDpmdW5jdGlvbihhKXt2YXIgYixjPXRoaXMub3B0aW9ucy5kaXJlY3Rpb247cmV0dXJuIGMmKE5hfE9hKT9iPWEub3ZlcmFsbFZlbG9jaXR5OmMmTmE/Yj1hLm92ZXJhbGxWZWxvY2l0eVg6YyZPYSYmKGI9YS5vdmVyYWxsVmVsb2NpdHlZKSx0aGlzLl9zdXBlci5hdHRyVGVzdC5jYWxsKHRoaXMsYSkmJmMmYS5vZmZzZXREaXJlY3Rpb24mJmEuZGlzdGFuY2U+dGhpcy5vcHRpb25zLnRocmVzaG9sZCYmYS5tYXhQb2ludGVycz09dGhpcy5vcHRpb25zLnBvaW50ZXJzJiZxYShiKT50aGlzLm9wdGlvbnMudmVsb2NpdHkmJmEuZXZlbnRUeXBlJkdhfSxlbWl0OmZ1bmN0aW9uKGEpe3ZhciBiPSQoYS5vZmZzZXREaXJlY3Rpb24pO2ImJnRoaXMubWFuYWdlci5lbWl0KHRoaXMub3B0aW9ucy5ldmVudCtiLGEpLHRoaXMubWFuYWdlci5lbWl0KHRoaXMub3B0aW9ucy5ldmVudCxhKX19KSxpKGdhLFkse2RlZmF1bHRzOntldmVudDpcInRhcFwiLHBvaW50ZXJzOjEsdGFwczoxLGludGVydmFsOjMwMCx0aW1lOjI1MCx0aHJlc2hvbGQ6OSxwb3NUaHJlc2hvbGQ6MTB9LGdldFRvdWNoQWN0aW9uOmZ1bmN0aW9uKCl7cmV0dXJuW2liXX0scHJvY2VzczpmdW5jdGlvbihhKXt2YXIgYj10aGlzLm9wdGlvbnMsYz1hLnBvaW50ZXJzLmxlbmd0aD09PWIucG9pbnRlcnMsZD1hLmRpc3RhbmNlPGIudGhyZXNob2xkLGY9YS5kZWx0YVRpbWU8Yi50aW1lO2lmKHRoaXMucmVzZXQoKSxhLmV2ZW50VHlwZSZFYSYmMD09PXRoaXMuY291bnQpcmV0dXJuIHRoaXMuZmFpbFRpbWVvdXQoKTtpZihkJiZmJiZjKXtpZihhLmV2ZW50VHlwZSE9R2EpcmV0dXJuIHRoaXMuZmFpbFRpbWVvdXQoKTt2YXIgZz10aGlzLnBUaW1lP2EudGltZVN0YW1wLXRoaXMucFRpbWU8Yi5pbnRlcnZhbDohMCxoPSF0aGlzLnBDZW50ZXJ8fEgodGhpcy5wQ2VudGVyLGEuY2VudGVyKTxiLnBvc1RocmVzaG9sZDt0aGlzLnBUaW1lPWEudGltZVN0YW1wLHRoaXMucENlbnRlcj1hLmNlbnRlcixoJiZnP3RoaXMuY291bnQrPTE6dGhpcy5jb3VudD0xLHRoaXMuX2lucHV0PWE7dmFyIGk9dGhpcy5jb3VudCViLnRhcHM7aWYoMD09PWkpcmV0dXJuIHRoaXMuaGFzUmVxdWlyZUZhaWx1cmVzKCk/KHRoaXMuX3RpbWVyPWUoZnVuY3Rpb24oKXt0aGlzLnN0YXRlPXJiLHRoaXMudHJ5RW1pdCgpfSxiLmludGVydmFsLHRoaXMpLG9iKTpyYn1yZXR1cm4gdGJ9LGZhaWxUaW1lb3V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3RpbWVyPWUoZnVuY3Rpb24oKXt0aGlzLnN0YXRlPXRifSx0aGlzLm9wdGlvbnMuaW50ZXJ2YWwsdGhpcyksdGJ9LHJlc2V0OmZ1bmN0aW9uKCl7Y2xlYXJUaW1lb3V0KHRoaXMuX3RpbWVyKX0sZW1pdDpmdW5jdGlvbigpe3RoaXMuc3RhdGU9PXJiJiYodGhpcy5faW5wdXQudGFwQ291bnQ9dGhpcy5jb3VudCx0aGlzLm1hbmFnZXIuZW1pdCh0aGlzLm9wdGlvbnMuZXZlbnQsdGhpcy5faW5wdXQpKX19KSxoYS5WRVJTSU9OPVwiMi4wLjhcIixoYS5kZWZhdWx0cz17ZG9tRXZlbnRzOiExLHRvdWNoQWN0aW9uOmdiLGVuYWJsZTohMCxpbnB1dFRhcmdldDpudWxsLGlucHV0Q2xhc3M6bnVsbCxwcmVzZXQ6W1tlYSx7ZW5hYmxlOiExfV0sW2NhLHtlbmFibGU6ITF9LFtcInJvdGF0ZVwiXV0sW2ZhLHtkaXJlY3Rpb246TmF9XSxbYmEse2RpcmVjdGlvbjpOYX0sW1wic3dpcGVcIl1dLFtnYV0sW2dhLHtldmVudDpcImRvdWJsZXRhcFwiLHRhcHM6Mn0sW1widGFwXCJdXSxbZGFdXSxjc3NQcm9wczp7dXNlclNlbGVjdDpcIm5vbmVcIix0b3VjaFNlbGVjdDpcIm5vbmVcIix0b3VjaENhbGxvdXQ6XCJub25lXCIsY29udGVudFpvb21pbmc6XCJub25lXCIsdXNlckRyYWc6XCJub25lXCIsdGFwSGlnaGxpZ2h0Q29sb3I6XCJyZ2JhKDAsMCwwLDApXCJ9fTt2YXIgdWI9MSx2Yj0yO2lhLnByb3RvdHlwZT17c2V0OmZ1bmN0aW9uKGEpe3JldHVybiBsYSh0aGlzLm9wdGlvbnMsYSksYS50b3VjaEFjdGlvbiYmdGhpcy50b3VjaEFjdGlvbi51cGRhdGUoKSxhLmlucHV0VGFyZ2V0JiYodGhpcy5pbnB1dC5kZXN0cm95KCksdGhpcy5pbnB1dC50YXJnZXQ9YS5pbnB1dFRhcmdldCx0aGlzLmlucHV0LmluaXQoKSksdGhpc30sc3RvcDpmdW5jdGlvbihhKXt0aGlzLnNlc3Npb24uc3RvcHBlZD1hP3ZiOnVifSxyZWNvZ25pemU6ZnVuY3Rpb24oYSl7dmFyIGI9dGhpcy5zZXNzaW9uO2lmKCFiLnN0b3BwZWQpe3RoaXMudG91Y2hBY3Rpb24ucHJldmVudERlZmF1bHRzKGEpO3ZhciBjLGQ9dGhpcy5yZWNvZ25pemVycyxlPWIuY3VyUmVjb2duaXplcjsoIWV8fGUmJmUuc3RhdGUmcmIpJiYoZT1iLmN1clJlY29nbml6ZXI9bnVsbCk7Zm9yKHZhciBmPTA7ZjxkLmxlbmd0aDspYz1kW2ZdLGIuc3RvcHBlZD09PXZifHxlJiZjIT1lJiYhYy5jYW5SZWNvZ25pemVXaXRoKGUpP2MucmVzZXQoKTpjLnJlY29nbml6ZShhKSwhZSYmYy5zdGF0ZSYob2J8cGJ8cWIpJiYoZT1iLmN1clJlY29nbml6ZXI9YyksZisrfX0sZ2V0OmZ1bmN0aW9uKGEpe2lmKGEgaW5zdGFuY2VvZiBZKXJldHVybiBhO2Zvcih2YXIgYj10aGlzLnJlY29nbml6ZXJzLGM9MDtjPGIubGVuZ3RoO2MrKylpZihiW2NdLm9wdGlvbnMuZXZlbnQ9PWEpcmV0dXJuIGJbY107cmV0dXJuIG51bGx9LGFkZDpmdW5jdGlvbihhKXtpZihmKGEsXCJhZGRcIix0aGlzKSlyZXR1cm4gdGhpczt2YXIgYj10aGlzLmdldChhLm9wdGlvbnMuZXZlbnQpO3JldHVybiBiJiZ0aGlzLnJlbW92ZShiKSx0aGlzLnJlY29nbml6ZXJzLnB1c2goYSksYS5tYW5hZ2VyPXRoaXMsdGhpcy50b3VjaEFjdGlvbi51cGRhdGUoKSxhfSxyZW1vdmU6ZnVuY3Rpb24oYSl7aWYoZihhLFwicmVtb3ZlXCIsdGhpcykpcmV0dXJuIHRoaXM7aWYoYT10aGlzLmdldChhKSl7dmFyIGI9dGhpcy5yZWNvZ25pemVycyxjPXIoYixhKTstMSE9PWMmJihiLnNwbGljZShjLDEpLHRoaXMudG91Y2hBY3Rpb24udXBkYXRlKCkpfXJldHVybiB0aGlzfSxvbjpmdW5jdGlvbihhLGIpe2lmKGEhPT1kJiZiIT09ZCl7dmFyIGM9dGhpcy5oYW5kbGVycztyZXR1cm4gZyhxKGEpLGZ1bmN0aW9uKGEpe2NbYV09Y1thXXx8W10sY1thXS5wdXNoKGIpfSksdGhpc319LG9mZjpmdW5jdGlvbihhLGIpe2lmKGEhPT1kKXt2YXIgYz10aGlzLmhhbmRsZXJzO3JldHVybiBnKHEoYSksZnVuY3Rpb24oYSl7Yj9jW2FdJiZjW2FdLnNwbGljZShyKGNbYV0sYiksMSk6ZGVsZXRlIGNbYV19KSx0aGlzfX0sZW1pdDpmdW5jdGlvbihhLGIpe3RoaXMub3B0aW9ucy5kb21FdmVudHMmJmthKGEsYik7dmFyIGM9dGhpcy5oYW5kbGVyc1thXSYmdGhpcy5oYW5kbGVyc1thXS5zbGljZSgpO2lmKGMmJmMubGVuZ3RoKXtiLnR5cGU9YSxiLnByZXZlbnREZWZhdWx0PWZ1bmN0aW9uKCl7Yi5zcmNFdmVudC5wcmV2ZW50RGVmYXVsdCgpfTtmb3IodmFyIGQ9MDtkPGMubGVuZ3RoOyljW2RdKGIpLGQrK319LGRlc3Ryb3k6ZnVuY3Rpb24oKXt0aGlzLmVsZW1lbnQmJmphKHRoaXMsITEpLHRoaXMuaGFuZGxlcnM9e30sdGhpcy5zZXNzaW9uPXt9LHRoaXMuaW5wdXQuZGVzdHJveSgpLHRoaXMuZWxlbWVudD1udWxsfX0sbGEoaGEse0lOUFVUX1NUQVJUOkVhLElOUFVUX01PVkU6RmEsSU5QVVRfRU5EOkdhLElOUFVUX0NBTkNFTDpIYSxTVEFURV9QT1NTSUJMRTpuYixTVEFURV9CRUdBTjpvYixTVEFURV9DSEFOR0VEOnBiLFNUQVRFX0VOREVEOnFiLFNUQVRFX1JFQ09HTklaRUQ6cmIsU1RBVEVfQ0FOQ0VMTEVEOnNiLFNUQVRFX0ZBSUxFRDp0YixESVJFQ1RJT05fTk9ORTpJYSxESVJFQ1RJT05fTEVGVDpKYSxESVJFQ1RJT05fUklHSFQ6S2EsRElSRUNUSU9OX1VQOkxhLERJUkVDVElPTl9ET1dOOk1hLERJUkVDVElPTl9IT1JJWk9OVEFMOk5hLERJUkVDVElPTl9WRVJUSUNBTDpPYSxESVJFQ1RJT05fQUxMOlBhLE1hbmFnZXI6aWEsSW5wdXQ6eCxUb3VjaEFjdGlvbjpWLFRvdWNoSW5wdXQ6UCxNb3VzZUlucHV0OkwsUG9pbnRlckV2ZW50SW5wdXQ6TSxUb3VjaE1vdXNlSW5wdXQ6UixTaW5nbGVUb3VjaElucHV0Ok4sUmVjb2duaXplcjpZLEF0dHJSZWNvZ25pemVyOmFhLFRhcDpnYSxQYW46YmEsU3dpcGU6ZmEsUGluY2g6Y2EsUm90YXRlOmVhLFByZXNzOmRhLG9uOm0sb2ZmOm4sZWFjaDpnLG1lcmdlOnRhLGV4dGVuZDpzYSxhc3NpZ246bGEsaW5oZXJpdDppLGJpbmRGbjpqLHByZWZpeGVkOnV9KTt2YXIgd2I9XCJ1bmRlZmluZWRcIiE9dHlwZW9mIGE/YTpcInVuZGVmaW5lZFwiIT10eXBlb2Ygc2VsZj9zZWxmOnt9O3diLkhhbW1lcj1oYSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKGZ1bmN0aW9uKCl7cmV0dXJuIGhhfSk6XCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZSYmbW9kdWxlLmV4cG9ydHM/bW9kdWxlLmV4cG9ydHM9aGE6YVtjXT1oYX0od2luZG93LGRvY3VtZW50LFwiSGFtbWVyXCIpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aGFtbWVyLm1pbi5qcy5tYXAiLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=