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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuZXN0b25lX3BhcnNvbnNfanNfdGltZWRwYXJzb25zX2pzLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDYTs7QUFFZ0Q7QUFJcEI7QUFDSztBQU1WO0FBQ047QUFDRztBQUNFO0FBQ1o7QUFDTTtBQUNBO0FBQ2M7QUFDUDtBQUNJO0FBQ0U7QUFDMUM7QUFDcUQ7QUFDRjtBQUNOOztBQUU3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFZSxzQkFBc0IsbUVBQWE7QUFDbEQ7QUFDQTtBQUNBLDhCQUE4QjtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrREFBa0Q7QUFDbEQ7QUFDQSwyQkFBMkI7QUFDM0I7O0FBRUEsMkJBQTJCLDBCQUEwQjtBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLG1EQUFTO0FBQy9CLHNCQUFzQixvREFBZTtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0IsbUVBQVk7QUFDbEMsb0JBQW9CLG1FQUFZO0FBQ2hDLHVCQUF1QixtRUFBWTtBQUNuQyx1QkFBdUIsbUVBQVk7QUFDbkMsdUJBQXVCLG1FQUFZO0FBQ25DLHFCQUFxQixtRUFBWTtBQUNqQztBQUNBLDBCQUEwQixtRUFBWTtBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsa0JBQWtCO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLG1FQUFZO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsbUVBQVk7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLG9GQUF3QixnQkFBZ0IsdURBQUM7QUFDeEQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLHVEQUFDO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGdCQUFnQix1REFBQztBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLHVEQUFDO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLHVEQUFDO0FBQ3hCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQSxxQ0FBcUMsdURBQUM7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EscUNBQXFDLHVEQUFDO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxRQUFRLGtGQUFzQjtBQUM5Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUMsdURBQUM7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSx1REFBQztBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQyx1REFBQztBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQyx1REFBQztBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0RBQWtEO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0MsMEJBQTBCO0FBQzlEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qix3QkFBd0I7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0Isa0JBQWtCO0FBQzFDO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBLGNBQWM7QUFDZDtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsbUJBQW1CO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksdURBQUM7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixxQkFBcUI7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLHdCQUF3QjtBQUNwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCLCtEQUFjO0FBQ3hDO0FBQ0E7QUFDQSxvQkFBb0IsMkRBQVU7QUFDOUI7QUFDQSxtQ0FBbUMscUVBQW9CO0FBQ3ZEO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixxQkFBcUI7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHVCQUF1QjtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOENBQThDLFFBQVE7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsdUJBQXVCO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsdUJBQXVCO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsbUJBQW1CO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0I7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLG1CQUFtQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsZUFBZTtBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCLGNBQWM7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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Q0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDaFpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsYUFBYSxrQkFBa0IsNEJBQTRCLGtCQUFrQiw0Q0FBNEMsa0JBQWtCLE1BQU0saUNBQWlDLDZCQUE2QixXQUFXLHdCQUF3Qix3REFBd0Qsa0JBQWtCLDhDQUE4QyxrQkFBa0IsdUpBQXVKLFVBQVUseUVBQXlFLHlEQUF5RCxrQkFBa0Isb0JBQW9CLHFFQUFxRSxnQkFBZ0Isa0JBQWtCLDZCQUE2QixnQkFBZ0IsNkNBQTZDLGdCQUFnQixpQkFBaUIsa0JBQWtCLG1CQUFtQiwyQkFBMkIsRUFBRSxrQkFBa0IsbUJBQW1CLDhCQUE4QixFQUFFLGdCQUFnQixLQUFLLEVBQUUsRUFBRSxpQkFBaUIsZUFBZSxTQUFTLGdCQUFnQix1QkFBdUIsY0FBYyw4QkFBOEIsa0JBQWtCLHFDQUFxQyxZQUFZLFdBQVcsRUFBRSx3Q0FBd0MsSUFBSSxTQUFTLGNBQWMsdUNBQXVDLGtCQUFrQixzQkFBc0IsV0FBVyxFQUFFLHFCQUFxQixrQ0FBa0Msb0NBQW9DLGlCQUFpQixjQUFjLGdCQUFnQixnREFBZ0QsWUFBWSxFQUFFLHFDQUFxQyxJQUFJLFNBQVMsYUFBYSxZQUFZLGNBQWMseUJBQXlCLHdDQUF3QyxnQkFBZ0IsV0FBVyxvSEFBb0gsc0NBQXNDLGFBQWEsY0FBYyw2QkFBNkIsd0NBQXdDLGtCQUFrQix3RkFBd0YsNENBQTRDLHFGQUFxRixnQkFBZ0Isd0NBQXdDLHlHQUF5RywyRUFBMkUsb0lBQW9JLHVDQUF1QywwUkFBMFIsZ0JBQWdCLHlEQUF5RCxnQkFBZ0Isa0NBQWtDLGtCQUFrQixtQkFBbUIsb0RBQW9ELDRCQUE0QixrQkFBa0IsWUFBWSxnREFBZ0QsZ0JBQWdCLDBEQUEwRCw0Q0FBNEMsdURBQXVELGdFQUFnRSw0REFBNEQsdURBQXVELGNBQWMsaUJBQWlCLG9CQUFvQixPQUFPLG9FQUFvRSxLQUFLLE9BQU8sdUVBQXVFLGNBQWMsZUFBZSxnQkFBZ0IsdUNBQXVDLG9CQUFvQixJQUFJLHFDQUFxQyxPQUFPLHFCQUFxQixrQkFBa0IsT0FBTyxtQkFBbUIsZ0JBQWdCLGlEQUFpRCxrQkFBa0IsVUFBVSx3Q0FBd0MsMEJBQTBCLGtCQUFrQixVQUFVLHdDQUF3QyxtQ0FBbUMsZ0JBQWdCLHVDQUF1QyxnQkFBZ0IsdUNBQXVDLGFBQWEsbUVBQW1FLGFBQWEsb0dBQW9HLGFBQWEsdUVBQXVFLGdCQUFnQix5Q0FBeUMsMkRBQTJELGFBQWEsa0NBQWtDLHlCQUF5QixnQkFBZ0Isb0NBQW9DLDhEQUE4RCxpREFBaUQsMEJBQTBCLHFCQUFxQixpQkFBaUIsV0FBVywyQkFBMkIsUUFBUSxXQUFXLDJFQUEyRSwwREFBMEQsYUFBYSx3QkFBd0IsMkJBQTJCLDZHQUE2RyxnQkFBZ0Isa0dBQWtHLGNBQWMsMkJBQTJCLHFDQUFxQyxPQUFPLHlCQUF5Qix5QkFBeUIsb0NBQW9DLG1CQUFtQixxQkFBcUIsa0JBQWtCLGNBQWMsc0RBQXNELDBCQUEwQixLQUFLLDhEQUE4RCx5QkFBeUIsU0FBUyxnQkFBZ0IsMkJBQTJCLGNBQWMscUJBQXFCLHdCQUF3QiwwQ0FBMEMsYUFBYSxnQkFBZ0IsUUFBUSx5QkFBeUIsdUZBQXVGLDJDQUEyQyxJQUFJLGNBQWMsa0JBQWtCLG9CQUFvQixnSEFBZ0gscUJBQXFCLGNBQWMsNERBQTRELGNBQWMsNkRBQTZELGdCQUFnQixnQkFBZ0Isb0JBQW9CLGNBQWMsd0JBQXdCLGNBQWMsbURBQW1ELGNBQWMseUJBQXlCLGNBQWMsMERBQTBELGNBQWMseUJBQXlCLGNBQWMseUJBQXlCLGNBQWMscUdBQXFHLGlCQUFpQixjQUFjLCtEQUErRCxpQkFBaUIsa0JBQWtCLGtCQUFrQix1RUFBdUUsZ0JBQWdCLHdDQUF3Qyw0SUFBNEksK0JBQStCLHlEQUF5RCxPQUFPLGlCQUFpQixnQkFBZ0IsWUFBWSxNQUFNLG1DQUFtQyw0RkFBNEYsc0JBQXNCLEdBQUcsaUJBQWlCLDZCQUE2QiwyREFBMkQsMEhBQTBILGdEQUFnRCxxRkFBcUYsd0JBQXdCLG1CQUFtQixLQUFLLG1CQUFtQixtRUFBbUUsU0FBUyxlQUFlLHlCQUF5Qiw2QkFBNkIsV0FBVyw2Q0FBNkMsU0FBUyw4Q0FBOEMsa0JBQWtCLCtUQUErVCxhQUFhLG9CQUFvQixpQkFBaUIsMktBQTJLLG9CQUFvQiw2S0FBNkssUUFBUSxxQ0FBcUMsdUNBQXVDLE9BQU8sb0JBQW9CLGlCQUFpQixxSUFBcUksMkRBQTJELElBQUksRUFBRSxRQUFRLDBFQUEwRSxLQUFLLG9CQUFvQiwyREFBMkQsOEdBQThHLG9CQUFvQixnSkFBZ0osbUhBQW1ILHdEQUF3RCxxQkFBcUIsRUFBRSxRQUFRLHNEQUFzRCxnRUFBZ0UsT0FBTyxvQkFBb0IsaUJBQWlCLDJDQUEyQyx1QkFBdUIsd0ZBQXdGLDZEQUE2RCxJQUFJLEVBQUUsUUFBUSxzREFBc0QsZ0RBQWdELE9BQU8sb0JBQW9CLG9DQUFvQyxpQ0FBaUMsNkRBQTZELEdBQUcsRUFBRSxrQkFBa0IsT0FBTyx3QkFBd0IsNENBQTRDLHNFQUFzRSxzQkFBc0IsaUNBQWlDLHNCQUFzQixvQkFBb0IsMkNBQTJDLEVBQUUsMkhBQTJILGFBQWEsZ0JBQWdCLHdJQUF3SSxtQkFBbUIsMkNBQTJDLG9CQUFvQixTQUFTLDhDQUE4QywwREFBMEQsaUJBQWlCLDZCQUE2QixxQ0FBcUMsaUVBQWlFLDRFQUE0RSxNQUFNLDZEQUE2RCxrQkFBa0IsaUVBQWlFLHdCQUF3Qix1REFBdUQsMENBQTBDLGFBQWEsV0FBVyxpQkFBaUIsK0VBQStFLDJCQUEyQix5Q0FBeUMsd0JBQXdCLG1FQUFtRSwrQkFBK0IsNEZBQTRGLDRCQUE0QiwwQ0FBMEMsdUJBQXVCLHdFQUF3RSxnQ0FBZ0MsOENBQThDLFlBQVksNEJBQTRCLCtDQUErQywrQkFBK0IsaUNBQWlDLDhCQUE4QixnQ0FBZ0Msa0JBQWtCLGNBQWMsb0JBQW9CLHdCQUF3Qix3SEFBd0gscUJBQXFCLHVEQUF1RCxvQkFBb0IsWUFBWSwwQkFBMEIsRUFBRSxpREFBaUQsSUFBSSxTQUFTLHVCQUF1QixXQUFXLElBQUksOExBQThMLHNCQUFzQiw0QkFBNEIsb0JBQW9CLFNBQVMsVUFBVSxXQUFXLHNCQUFzQiw0QkFBNEIsb0NBQW9DLHFCQUFxQiw4REFBOEQsMERBQTBELFdBQVcsVUFBVSxpREFBaUQsMkJBQTJCLGtDQUFrQywyQ0FBMkMsMkJBQTJCLHlFQUF5RSx1TUFBdU0sc0JBQXNCLG9HQUFvRyxrQkFBa0Isa0NBQWtDLHFCQUFxQiwyRUFBMkUsV0FBVyxVQUFVLHFDQUFxQywyQkFBMkIsV0FBVyxzQkFBc0Isc0dBQXNHLGtCQUFrQixnQkFBZ0IsMkJBQTJCLHVDQUF1QywrQkFBK0IsVUFBVSxVQUFVLDhDQUE4QywyQkFBMkIsV0FBVyxxQkFBcUIsa0dBQWtHLDhEQUE4RCw2REFBNkQsNkJBQTZCLGNBQWMsaUNBQWlDLFVBQVUsa0JBQWtCLDBCQUEwQixrQkFBa0Isa0tBQWtLLFdBQVcsVUFBVSxzQ0FBc0MsMkJBQTJCLFdBQVcsc0JBQXNCLHdHQUF3RyxXQUFXLFVBQVUsa0VBQWtFLDJCQUEyQiw4Q0FBOEMsc0JBQXNCLCtCQUErQix5UUFBeVEsa0JBQWtCLDJCQUEyQixzRkFBc0YsVUFBVSxVQUFVLGdGQUFnRiwyQkFBMkIsV0FBVyxxQkFBcUIsa0dBQWtHLHlFQUF5RSxZQUFZLDZDQUE2QywrR0FBK0csMkZBQTJGLHdCQUF3QixvRUFBb0UsNkJBQTZCLHlCQUF5QixVQUFVLHdCQUF3QixnQ0FBZ0MsY0FBYyxnQ0FBZ0Msa0JBQWtCLDBCQUEwQixpQkFBaUIscUdBQXFHLGtDQUFrQyxvRkFBb0YsVUFBVSxPQUFPLFVBQVUsa0JBQWtCLGFBQWEsT0FBTyxhQUFhLHNCQUFzQix5QkFBeUIsMEJBQTBCLG1JQUFtSSxjQUFjLGNBQWMsZ0JBQWdCLGdLQUFnSyxrQkFBa0IsNkJBQTZCLHVCQUF1QixtQkFBbUIsZUFBZSxvQ0FBb0MsMkNBQTJDLDhDQUE4QyxZQUFZLFdBQVcsb0lBQW9JLGlCQUFpQiwyQkFBMkIsK0JBQStCLFdBQVcseUNBQXlDLFlBQVksaUJBQWlCLCtCQUErQixnQ0FBZ0MsNkZBQTZGLG9CQUFvQixrQ0FBa0Msa0JBQWtCLGdDQUFnQyxrREFBa0QsWUFBWSxrQkFBa0IsaUJBQWlCLG9CQUFvQiwwQkFBMEIsMkJBQTJCLFFBQVEsbUJBQW1CLFVBQVUsb0JBQW9CLDBCQUEwQiw2Q0FBNkMsUUFBUSxvQkFBb0IsZ0NBQWdDLGlEQUFpRCxnQkFBZ0IscUNBQXFDLDZCQUE2QixZQUFZLFdBQVcsY0FBYyxvQkFBb0IsMENBQTBDLGdCQUFnQix5Q0FBeUMsUUFBUSw2bEJBQTZsQixFQUFFLGdFQUFnRSxhQUFhLEtBQXFDLENBQUMsbUNBQU8sV0FBVyxVQUFVO0FBQUEsa0dBQUMsQ0FBQyxDQUFvRSxDQUFDO0FBQzFrb0Isc0M7Ozs7Ozs7Ozs7OztBQ05BOzs7Ozs7Ozs7Ozs7O0FDQUEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL3BhcnNvbnMvanMvcGFyc29ucy5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL3BhcnNvbnMvanMvdGltZWRwYXJzb25zLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvcGFyc29ucy9qcy9zZXR0bGVkQmxvY2suanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9wYXJzb25zL2pzL3BhcnNvbnNMaW5lLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvcGFyc29ucy9qcy9wbGFjZWhvbGRlckxpbmUuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9wYXJzb25zL2pzL2xpbmVHcmFkZXIuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9wYXJzb25zL2pzL3BhcnNvbnNCbG9jay5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL3BhcnNvbnMvanMvZGFnR3JhZGVyLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvcGFyc29ucy9qcy9wbGFjZWhvbGRlckJsb2NrLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvcGFyc29ucy9qcy9wcmV0dGlmeS5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL3BhcnNvbnMvanMvZGFnSGVscGVycy5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL3BhcnNvbnMvanMvaGFtbWVyLm1pbi5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL3BhcnNvbnMvY3NzL3BhcnNvbnMubGVzcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL3BhcnNvbnMvY3NzL3ByZXR0aWZ5LmNzcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09PT0gUGFyc29ucyBSdW5lc3RvbmUgRGlyZWN0aXZlIEphdmFzY3JpcHQgPT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT09PT09PT0gUmVuZGVycyBhIFBhcnNvbnMgcHJvYmxlbSBiYXNlZCBvbiB0aGUgSFRNTCBjcmVhdGVkIGJ5IHRoZVxuPT09PT09PT0gcGFyc29ucy5weSBzY3JpcHQgYW5kIHRoZSBSU1QgZmlsZS5cbj09PT0gQ09OVFJJQlVUT1JTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT09PT09PT0gSXNhaWFoIE1heWVyY2hha1xuPT09PT09PT0gSmVmZiBSaWNrXG49PT09PT09PSBCYXJiYXJhIEVyaWNzb25cbj09PT09PT09IENvbGUgQm93ZXJzXG49PT09IEFkYXB0ZWQgZm9ybSB0aGUgb3JpZ2luYWwgSlMgUGFyc29ucyBieSA9PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09PT09PT09IFZpbGxlIEthcmF2aXJ0YVxuPT09PT09PT0gUGV0cmkgSWhhbnRvbGFcbj09PT09PT09IEp1aGEgSGVsbWluZW5cbj09PT09PT09IE1pa2UgSGV3bmVyXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT09PSBMaW5lQmFzZWRHcmFkZXIgT2JqZWN0ID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PT09PT09PSBVc2VkIGZvciBncmFkaW5nIGEgUGFyc29ucyBwcm9ibGVtLlxuPT09PSBQUk9QRVJUSUVTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PT09PT09PSBwcm9ibGVtOiB0aGUgUGFyc29ucyBwcm9ibGVtXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblwidXNlIHN0cmljdFwiO1xuXG5pbXBvcnQgUnVuZXN0b25lQmFzZSBmcm9tIFwiLi4vLi4vY29tbW9uL2pzL3J1bmVzdG9uZWJhc2UuanNcIjtcbmltcG9ydCB7XG4gICAgZGlzYWJsZU1hdGhKYXhUYWJTdG9wcyxcbiAgICBnZXRBY2Nlc3NpYmxlRWxlbWVudFRleHQsXG59IGZyb20gXCIuLi8uLi9jb21tb24vanMvbWF0aGpheC1hMTF5LmpzXCI7XG5pbXBvcnQgeyB0IH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9qcy9yc2kxOG4uanNcIjtcbmltcG9ydCB7XG4gICAgZ2V0RGF0YVZhbHVlLFxuICAgIGFuaW1hdGUsXG4gICAgb3V0ZXJIZWlnaHQsXG4gICAgb3V0ZXJXaWR0aCxcbn0gZnJvbSBcIi4uLy4uL2NvbW1vbi9qcy9kb211dGlsLmpzXCI7XG5pbXBvcnQgXCIuL3BhcnNvbnMtaTE4bi5lbi5qc1wiO1xuaW1wb3J0IFwiLi9wYXJzb25zLWkxOG4ucHQtYnIuanNcIjtcbmltcG9ydCBcIi4vcGFyc29ucy1pMThuLnNyLUN5cmwuanNcIjtcbmltcG9ydCBcIi4vcHJldHRpZnkuanNcIjtcbmltcG9ydCBcIi4uL2Nzcy9wYXJzb25zLmxlc3NcIjtcbmltcG9ydCBcIi4uL2Nzcy9wcmV0dGlmeS5jc3NcIjtcbmltcG9ydCBMaW5lQmFzZWRHcmFkZXIgZnJvbSBcIi4vbGluZUdyYWRlclwiO1xuaW1wb3J0IERBR0dyYWRlciBmcm9tIFwiLi9kYWdHcmFkZXJcIjtcbmltcG9ydCBQYXJzb25zTGluZSBmcm9tIFwiLi9wYXJzb25zTGluZVwiO1xuaW1wb3J0IFBhcnNvbnNCbG9jayBmcm9tIFwiLi9wYXJzb25zQmxvY2tcIjtcbi8vIENvZGVUYWlsb3ItcmVsYXRlZCBpbXBvcnRzIFVwZGF0ZWQgMTAvMjYvMjAyNVxuaW1wb3J0IFBsYWNlaG9sZGVyQmxvY2sgZnJvbSBcIi4vcGxhY2Vob2xkZXJCbG9jay5qc1wiO1xuaW1wb3J0IFBsYWNlaG9sZGVyTGluZSBmcm9tIFwiLi9wbGFjZWhvbGRlckxpbmUuanNcIjtcbmltcG9ydCBTZXR0bGVkQmxvY2sgZnJvbSBcIi4vc2V0dGxlZEJsb2NrLmpzXCI7XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT09PSBQYXJzb25zIE9iamVjdCA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PT09PT09PSBUaGUgbW9kZWwgYW5kIHZpZXcgb2YgYSBQYXJzb25zIHByb2JsZW0gYmFzZWQgb24gd2hhdCBpc1xuPT09PT09PT0gc3BlY2lmaWVkIGluIHRoZSBIVE1MLCB3aGljaCBpcyBiYXNlZCBvbiB3aGF0IGlzIHNwZWNpZmllZFxuPT09PT09PT0gaW4gdGhlIFJTVCBmaWxlXG49PT09IFBST1BFUlRJRVMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09PT09PT09IG9wdGlvbnM6IG9wdGlvbnMgbGFyZ2VseSBzcGVjaWZpZWQgZnJvbSB0aGUgSFRNTFxuPT09PT09PT0gZ3JhZGVyOiBhIExpbmVHcmFkZXIgZm9yIGdyYWRpbmcgdGhlIHByb2JsZW1cbj09PT09PT09IGxpbmVzOiBhbiBhcnJheSBvZiBhbGwgUGFyc29uc0xpbmUgYXMgc3BlY2lmaWVkIGluIHRoZSBwcm9ibGVtXG49PT09PT09PSBzb2x1dGlvbjogYW4gYXJyYXkgb2YgUGFyc29uc0xpbmUgaW4gdGhlIHNvbHV0aW9uXG49PT09PT09PSBibG9ja3M6IHRoZSBjdXJyZW50IGJsb2Nrc1xuPT09PT09PT0gc291cmNlQXJlYTogdGhlIGVsZW1lbnQgdGhhdCBjb250YWlucyB0aGUgc291cmNlIGJsb2Nrc1xuPT09PT09PT0gYW5zd2VyQXJlYTogdGhlIGVsZW1lbnQgdGhhdCBjb250YWlucyB0aGUgYW5zd2VyIGJsb2Nrc1xuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT09PSBJTklUSUFMSVpBVElPTiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gICovXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhcnNvbnMgZXh0ZW5kcyBSdW5lc3RvbmVCYXNlIHtcbiAgICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgICAgIHN1cGVyKG9wdHMpO1xuICAgICAgICB2YXIgb3JpZyA9IG9wdHMub3JpZzsgLy8gZW50aXJlIDxwcmU+IGVsZW1lbnQgdGhhdCB3aWxsIGJlIHJlcGxhY2VkIGJ5IG5ldyBIVE1MXG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2ID0gb3JpZztcbiAgICAgICAgdGhpcy5vcmlnRWxlbSA9IG9yaWcucXVlcnlTZWxlY3RvcihcInByZS5wYXJzb25zYmxvY2tzXCIpO1xuICAgICAgICAvLyBGaW5kIHRoZSBxdWVzdGlvbiB0ZXh0IGFuZCBzdG9yZSBpdCBpbiAucXVlc3Rpb25cbiAgICAgICAgdGhpcy5xdWVzdGlvbiA9IG9yaWcucXVlcnlTZWxlY3RvcihcIi5wYXJzb25zX3F1ZXN0aW9uXCIpO1xuICAgICAgICB0aGlzLnVzZVJ1bmVzdG9uZVNlcnZpY2VzID0gb3B0cy51c2VSdW5lc3RvbmVTZXJ2aWNlcztcbiAgICAgICAgdGhpcy5kaXZpZCA9IG9wdHMub3JpZy5pZDtcbiAgICAgICAgLy8gU2V0IHRoZSBzdG9yYWdlSWQgKGtleSBmb3Igc3RvcmluZyBkYXRhKVxuICAgICAgICB2YXIgc3RvcmFnZUlkID0gc3VwZXIubG9jYWxTdG9yYWdlS2V5KCk7XG4gICAgICAgIHRoaXMuc3RvcmFnZUlkID0gc3RvcmFnZUlkO1xuICAgICAgICB0aGlzLmNoaWxkcmVuID0gdGhpcy5vcmlnRWxlbS5jaGlsZE5vZGVzOyAvLyB0aGlzIGNvbnRhaW5zIGFsbCBvZiB0aGUgY2hpbGQgZWxlbWVudHMgb2YgdGhlIGVudGlyZSB0YWcuLi5cbiAgICAgICAgdGhpcy5jb250ZW50QXJyYXkgPSBbXTtcbiAgICAgICAgUGFyc29ucy5jb3VudGVyKys7IC8vICAgIFVuaXF1ZSBpZGVudGlmaWVyXG4gICAgICAgIHRoaXMuY291bnRlcklkID0gXCJwYXJzb25zLVwiICsgUGFyc29ucy5jb3VudGVyO1xuXG4gICAgICAgIC8vIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAvLyAgICAgaWYgKCQodGhpcy5jaGlsZHJlbltpXSkuaXMoXCJbZGF0YS1xdWVzdGlvbl1cIikpIHtcbiAgICAgICAgLy8gICAgICAgICB0aGlzLnF1ZXN0aW9uID0gdGhpcy5jaGlsZHJlbltpXTtcbiAgICAgICAgLy8gICAgICAgICBicmVhaztcbiAgICAgICAgLy8gICAgIH1cbiAgICAgICAgLy8gfVxuICAgICAgICB0aGlzLmluaXRpYWxpemVPcHRpb25zKCk7XG4gICAgICAgIHRoaXMuZ3JhZGVyID1cbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5ncmFkZXIgPT09IFwiZGFnXCJcbiAgICAgICAgICAgICAgICA/IG5ldyBEQUdHcmFkZXIodGhpcylcbiAgICAgICAgICAgICAgICA6IG5ldyBMaW5lQmFzZWRHcmFkZXIodGhpcyk7XG4gICAgICAgIHRoaXMuZ3JhZGVyLnNob3dmZWVkYmFjayA9IHRoaXMuc2hvd2ZlZWRiYWNrO1xuICAgICAgICB2YXIgZnVsbHRleHQgPSB0aGlzLm9yaWdFbGVtLmlubmVySFRNTDtcbiAgICAgICAgdGhpcy5ibG9ja0luZGV4ID0gMDtcbiAgICAgICAgdGhpcy5jaGVja0NvdW50ID0gMDtcbiAgICAgICAgdGhpcy5udW1EaXN0aW5jdCA9IDA7XG4gICAgICAgIHRoaXMuaGFzU29sdmVkID0gZmFsc2U7XG4gICAgICAgIC8vIE9ubHkgdHJpbSB0cmFpbGluZyB3aGl0ZXNwYWNlIGhlcmUuIEEgbGVhZGluZyB0cmltKCkgd291bGQgc3RyaXAgcmVhbFxuICAgICAgICAvLyBsZWFkaW5nIGluZGVudGF0aW9uIG9mZiB0aGUgZmlyc3QgbGluZSBvZiB0aGUgZmlyc3QgYmxvY2sgd2hlbmV2ZXIgdGhlXG4gICAgICAgIC8vIDxwcmU+IHRhZydzIG93biBsZWFkaW5nIG5ld2xpbmUgaGFzIGFscmVhZHkgYmVlbiBjb25zdW1lZCBieSB0aGUgYnJvd3NlcidzXG4gICAgICAgIC8vIEhUTUwgcGFyc2VyIChhIHdlbGwta25vd24gPHByZT4gcXVpcmspLCBzaWxlbnRseSBkZS1pbmRlbnRpbmcgb25seSB0aGVcbiAgICAgICAgLy8gZmlyc3QgYmxvY2sgcmVsYXRpdmUgdG8gZXZlcnkgb3RoZXIgYmxvY2suIEJsYW5rIGxlYWRpbmcvdHJhaWxpbmcgbGluZXNcbiAgICAgICAgLy8gd2l0aGluIGEgYmxvY2sgYXJlIHN0aWxsIGRpc2NhcmRlZCBmdXJ0aGVyIGRvd24sIHBlciBibG9jay5cbiAgICAgICAgLy8gLSBOb3RlIC0gcmV2ZXJ0ZWQgdGhlIGFib3ZlIGFmdGVyIHJlcXVlc3QgZnJvbSBiYXJiYXJlciB0cmltRW5kIC0+IHRyaW1cbiAgICAgICAgdGhpcy5pbml0aWFsaXplTGluZXMoZnVsbHRleHQudHJpbSgpKTtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplVmlldygpO1xuICAgICAgICB0aGlzLmNhcHRpb24gPSBcIlBhcnNvbnNcIjtcbiAgICAgICAgdGhpcy5hZGRDYXB0aW9uKFwicnVuZXN0b25lXCIpO1xuICAgICAgICAvLyBDaGVjayB0aGUgc2VydmVyIGZvciBhbiBhbnN3ZXIgdG8gY29tcGxldGUgdGhpbmdzXG4gICAgICAgIHRoaXMuY2hlY2tTZXJ2ZXIoXCJwYXJzb25zXCIsIHRydWUpO1xuICAgICAgICB0aGlzLnJ1bm5hYmxlRGl2ID0gbnVsbDtcbiAgICB9XG4gICAgLy8gQmFzZWQgb24gdGhlIGRhdGEtZmllbGRzIGluIHRoZSBvcmlnaW5hbCBIVE1MLCBpbml0aWFsaXplIG9wdGlvbnNcbiAgICBpbml0aWFsaXplT3B0aW9ucygpIHtcbiAgICAgICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICAgICAgICBwaXhlbHNQZXJJbmRlbnQ6IDMwLFxuICAgICAgICB9O1xuICAgICAgICAvLyBhZGQgbWF4ZGlzdCBhbmQgb3JkZXIgaWYgcHJlc2VudFxuICAgICAgICB2YXIgbWF4ZGlzdCA9IGdldERhdGFWYWx1ZSh0aGlzLm9yaWdFbGVtLCBcIm1heGRpc3RcIik7XG4gICAgICAgIHZhciBvcmRlciA9IGdldERhdGFWYWx1ZSh0aGlzLm9yaWdFbGVtLCBcIm9yZGVyXCIpO1xuICAgICAgICB2YXIgbm9pbmRlbnQgPSBnZXREYXRhVmFsdWUodGhpcy5vcmlnRWxlbSwgXCJub2luZGVudFwiKTtcbiAgICAgICAgdmFyIGFkYXB0aXZlID0gZ2V0RGF0YVZhbHVlKHRoaXMub3JpZ0VsZW0sIFwiYWRhcHRpdmVcIik7XG4gICAgICAgIHZhciBudW1iZXJlZCA9IGdldERhdGFWYWx1ZSh0aGlzLm9yaWdFbGVtLCBcIm51bWJlcmVkXCIpO1xuICAgICAgICB2YXIgZ3JhZGVyID0gZ2V0RGF0YVZhbHVlKHRoaXMub3JpZ0VsZW0sIFwiZ3JhZGVyXCIpO1xuICAgICAgICAvLyBDb2RlVGFpbG9yOiBwcm9hY3RpdmVseSBzZXQgdGhlIHB1enpsZSBhcyBzY2FmZm9sZGluZyBwdXp6bGUgdG8gZGlmZmVyZW50aWF0ZSB3aXRoIG90aGVyIHB1enpsZSBwcmFjdGljZSBmb3JtYXRzXG4gICAgICAgIHZhciBzY2FmZm9sZGluZyA9IGdldERhdGFWYWx1ZSh0aGlzLm9yaWdFbGVtLCBcInNjYWZmb2xkaW5nXCIpO1xuICAgICAgICBvcHRpb25zW1wibnVtYmVyZWRcIl0gPSBudW1iZXJlZDtcbiAgICAgICAgb3B0aW9uc1tcImdyYWRlclwiXSA9IGdyYWRlcjtcbiAgICAgICAgb3B0aW9uc1tcInNjYWZmb2xkaW5nXCJdID0gc2NhZmZvbGRpbmc7XG4gICAgICAgIGlmIChtYXhkaXN0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIG9wdGlvbnNbXCJtYXhkaXN0XCJdID0gbWF4ZGlzdDtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3JkZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgLy8gY29udmVydCBvcmRlciBzdHJpbmcgdG8gYXJyYXkgb2YgbnVtYmVyc1xuICAgICAgICAgICAgb3JkZXIgPSBvcmRlci5tYXRjaCgvXFxkKy9nKTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb3JkZXIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBvcmRlcltpXSA9IHBhcnNlSW50KG9yZGVyW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9wdGlvbnNbXCJvcmRlclwiXSA9IG9yZGVyO1xuICAgICAgICB9XG4gICAgICAgIGlmIChub2luZGVudCA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIG5vaW5kZW50ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgb3B0aW9uc1tcIm5vaW5kZW50XCJdID0gbm9pbmRlbnQ7XG4gICAgICAgIHRoaXMubm9pbmRlbnQgPSBub2luZGVudDtcbiAgICAgICAgaWYgKGFkYXB0aXZlID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgYWRhcHRpdmUgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIGlmIChhZGFwdGl2ZSkge1xuICAgICAgICAgICAgdGhpcy5pbml0aWFsaXplQWRhcHRpdmUoKTtcbiAgICAgICAgfVxuICAgICAgICBvcHRpb25zW1wiYWRhcHRpdmVcIl0gPSBhZGFwdGl2ZTtcbiAgICAgICAgLy8gYWRkIGxvY2FsZSBhbmQgbGFuZ3VhZ2VcbiAgICAgICAgdmFyIGxvY2FsZSA9IGVCb29rQ29uZmlnLmxvY2FsZTtcbiAgICAgICAgaWYgKGxvY2FsZSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGxvY2FsZSA9IFwiZW5cIjtcbiAgICAgICAgfVxuICAgICAgICBvcHRpb25zW1wibG9jYWxlXCJdID0gbG9jYWxlO1xuICAgICAgICB2YXIgbGFuZ3VhZ2UgPSBnZXREYXRhVmFsdWUodGhpcy5vcmlnRWxlbSwgXCJsYW5ndWFnZVwiKTtcbiAgICAgICAgaWYgKGxhbmd1YWdlID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgbGFuZ3VhZ2UgPSBlQm9va0NvbmZpZy5sYW5ndWFnZTtcbiAgICAgICAgICAgIGlmIChsYW5ndWFnZSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBsYW5ndWFnZSA9IFwicHl0aG9uXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgb3B0aW9uc1tcImxhbmd1YWdlXCJdID0gbGFuZ3VhZ2U7XG4gICAgICAgIHZhciBwcmV0dGlmeUxhbmd1YWdlID0ge1xuICAgICAgICAgICAgcHl0aG9uOiBcInByZXR0eXByaW50IGxhbmctcHlcIixcbiAgICAgICAgICAgIGphdmE6IFwicHJldHR5cHJpbnQgbGFuZy1qYXZhXCIsXG4gICAgICAgICAgICBqYXZhc2NyaXB0OiBcInByZXR0eXByaW50IGxhbmctanNcIixcbiAgICAgICAgICAgIGh0bWw6IFwicHJldHR5cHJpbnQgbGFuZy1odG1sXCIsXG4gICAgICAgICAgICBjOiBcInByZXR0eXByaW50IGxhbmctY1wiLFxuICAgICAgICAgICAgXCJjKytcIjogXCJwcmV0dHlwcmludCBsYW5nLWNwcFwiLFxuICAgICAgICAgICAgY3BwOiBcInByZXR0eXByaW50IGxhbmctY3BwXCIsXG4gICAgICAgICAgICBydWJ5OiBcInByZXR0eXByaW50IGxhbmctcmJcIixcbiAgICAgICAgfVtsYW5ndWFnZV07XG4gICAgICAgIGlmIChwcmV0dGlmeUxhbmd1YWdlID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcHJldHRpZnlMYW5ndWFnZSA9IFwiXCI7XG4gICAgICAgIH1cbiAgICAgICAgb3B0aW9uc1tcInByZXR0aWZ5TGFuZ3VhZ2VcIl0gPSBwcmV0dGlmeUxhbmd1YWdlO1xuICAgICAgICAvL3J1bm5hYmxlIGlmIHRoZSBwYXJlbnQgaGFzIGEgcGFyc29ucy1ydW5uYWJsZSBhdHRyXG4gICAgICAgIG9wdGlvbnNbXCJydW5uYWJsZVwiXSA9IGdldERhdGFWYWx1ZSh0aGlzLm9yaWdFbGVtLCBcInJ1bm5hYmxlXCIpO1xuICAgICAgICAvLyBQYXJzZSBibG9jayBleHBsYW5hdGlvbnMgaWYgcHJlc2VudFxuICAgICAgICB2YXIgZXhwbGFuYXRpb25zUmF3ID0gdGhpcy5vcmlnRWxlbS5nZXRBdHRyaWJ1dGUoXCJkYXRhLWV4cGxhbmF0aW9uc1wiKTtcbiAgICAgICAgaWYgKGV4cGxhbmF0aW9uc1Jhdykge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICB0aGlzLmJsb2NrRXhwbGFuYXRpb25zID0gSlNPTi5wYXJzZShleHBsYW5hdGlvbnNSYXcpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuYmxvY2tFeHBsYW5hdGlvbnMgPSB7fTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYmxvY2tFeHBsYW5hdGlvbnMgPSB7fTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIH1cbiAgICBnZXRCbG9ja0xhYmVsKGJsb2NrKSB7XG4gICAgICAgIHJldHVybiBnZXRBY2Nlc3NpYmxlRWxlbWVudFRleHQoYmxvY2sudmlldykgfHwgdChcIm1zZ19wYXJzb25fYmxvY2tcIik7XG4gICAgfVxuXG4gICAgaXNJbmNvcnJlY3RCbG9jayhibG9jaykge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgYmxvY2sudmlldy5jbGFzc0xpc3QuY29udGFpbnMoXCJpbmNvcnJlY3RQb3NpdGlvblwiKSB8fFxuICAgICAgICAgICAgYmxvY2sudmlldy5jbGFzc0xpc3QuY29udGFpbnMoXCJpbmRlbnRMZWZ0XCIpIHx8XG4gICAgICAgICAgICBibG9jay52aWV3LmNsYXNzTGlzdC5jb250YWlucyhcImluZGVudFJpZ2h0XCIpXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgZ2V0S2V5Ym9hcmRCbG9ja0xvY2F0aW9uKGJsb2NrKSB7XG4gICAgICAgIGNvbnN0IGluU291cmNlID0gYmxvY2suaW5Tb3VyY2VBcmVhKCk7XG4gICAgICAgIGNvbnN0IGJsb2NrcyA9IGluU291cmNlXG4gICAgICAgICAgICA/IHRoaXMuZW5hYmxlZFNvdXJjZUJsb2NrcygpXG4gICAgICAgICAgICA6IHRoaXMuZW5hYmxlZEFuc3dlckJsb2NrcygpO1xuICAgICAgICBjb25zdCBwb3NpdGlvbiA9IGJsb2Nrcy5pbmRleE9mKGJsb2NrKSArIDE7XG4gICAgICAgIGNvbnN0IGxvY2F0aW9uID0gW1xuICAgICAgICAgICAgdChcbiAgICAgICAgICAgICAgICBpblNvdXJjZVxuICAgICAgICAgICAgICAgICAgICA/IFwibXNnX3BhcnNvbl9rZXlib2FyZF91bnBsYWNlZF9wb3NpdGlvblwiXG4gICAgICAgICAgICAgICAgICAgIDogXCJtc2dfcGFyc29uX2tleWJvYXJkX2Fuc3dlcl9wb3NpdGlvblwiLFxuICAgICAgICAgICAgICAgIHBvc2l0aW9uLFxuICAgICAgICAgICAgICAgIGJsb2Nrcy5sZW5ndGgsXG4gICAgICAgICAgICApLFxuICAgICAgICBdO1xuXG4gICAgICAgIGlmICghaW5Tb3VyY2UgJiYgdGhpcy51c2VzSW5kZW50YXRpb24oKSkge1xuICAgICAgICAgICAgbG9jYXRpb24ucHVzaChcbiAgICAgICAgICAgICAgICB0KFxuICAgICAgICAgICAgICAgICAgICBibG9jay5pbmRlbnQgPT09IDFcbiAgICAgICAgICAgICAgICAgICAgICAgID8gXCJtc2dfcGFyc29uX2tleWJvYXJkX3RhYl9pblwiXG4gICAgICAgICAgICAgICAgICAgICAgICA6IFwibXNnX3BhcnNvbl9rZXlib2FyZF90YWJzX2luXCIsXG4gICAgICAgICAgICAgICAgICAgIGJsb2NrLmluZGVudCxcbiAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHBhaXJlZEJpbiA9IGJsb2NrLnBhaXJlZEJpbigpO1xuICAgICAgICBpZiAocGFpcmVkQmluICE9PSAtMSkge1xuICAgICAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMuYmxvY2tzLmZpbHRlcihcbiAgICAgICAgICAgICAgICAoY2FuZGlkYXRlKSA9PlxuICAgICAgICAgICAgICAgICAgICBjYW5kaWRhdGUuZW5hYmxlZCgpICYmIGNhbmRpZGF0ZS5wYWlyZWRCaW4oKSA9PT0gcGFpcmVkQmluLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICBsb2NhdGlvbi5wdXNoKFxuICAgICAgICAgICAgICAgICAgICB0KFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJtc2dfcGFyc29uX2tleWJvYXJkX29wdGlvbnNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuaW5kZXhPZihibG9jaykgKyAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBsb2NhdGlvbi5qb2luKFwiLiBcIikgKyBcIi5cIjtcbiAgICB9XG5cbiAgICB1cGRhdGVCbG9ja0FyaWFMYWJlbChibG9jaykge1xuICAgICAgICBjb25zdCBsYWJlbCA9IFt0aGlzLmdldEJsb2NrTGFiZWwoYmxvY2spXTtcbiAgICAgICAgaWYgKHRoaXMuaXNJbmNvcnJlY3RCbG9jayhibG9jaykpIHtcbiAgICAgICAgICAgIGxhYmVsLnB1c2godChcIm1zZ19wYXJzb25faW5jb3JyZWN0XCIpKTtcbiAgICAgICAgfVxuICAgICAgICBibG9jay52aWV3LnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIiwgbGFiZWwuam9pbihcIi4gXCIpKTtcbiAgICB9XG5cbiAgICB1cGRhdGVCbG9ja0FyaWFMYWJlbHMoKSB7XG4gICAgICAgIHRoaXMuYmxvY2tzLmZvckVhY2goKGJsb2NrKSA9PiB0aGlzLnVwZGF0ZUJsb2NrQXJpYUxhYmVsKGJsb2NrKSk7XG4gICAgfVxuXG4gICAgc2hvd01lc3NhZ2UobWVzc2FnZSwgY2xhc3NOYW1lID0gXCJhbGVydCBhbGVydC1pbmZvXCIpIHtcbiAgICAgICAgdGhpcy5tZXNzYWdlRGl2LnN0eWxlLnZpc2liaWxpdHkgPSBcInZpc2libGVcIjtcbiAgICAgICAgdGhpcy5tZXNzYWdlRGl2LnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIGNsYXNzTmFtZSk7XG4gICAgICAgIHRoaXMubWVzc2FnZURpdi5yZXBsYWNlQ2hpbGRyZW4oKTtcbiAgICAgICAgY29uc3QgbWVzc2FnZVZlcnNpb24gPSAodGhpcy5tZXNzYWdlVmVyc2lvbiB8fCAwKSArIDE7XG4gICAgICAgIHRoaXMubWVzc2FnZVZlcnNpb24gPSBtZXNzYWdlVmVyc2lvbjtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5tZXNzYWdlVmVyc2lvbiA9PT0gbWVzc2FnZVZlcnNpb24pIHtcbiAgICAgICAgICAgICAgICB0aGlzLm1lc3NhZ2VEaXYuaW5uZXJIVE1MID0gbWVzc2FnZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgMTApO1xuICAgIH1cblxuICAgIHNob3dLZXlib2FyZEVudHJ5SGludCgpIHtcbiAgICAgICAgdGhpcy5rZXlib2FyZFRpcC5pbm5lckhUTUwgPSB0KFwibXNnX3BhcnNvbl9lbnRlcl9hY3RpdmF0ZVwiKTtcbiAgICAgICAgdGhpcy5rZXlib2FyZFRpcC5zdHlsZS5kaXNwbGF5ID0gXCJcIjtcbiAgICAgICAgLy8gRHJvcCBhbmQgcmUtYWRkIHRoZSBjbGFzcyAod2l0aCBhIHJlZmxvdyBpbiBiZXR3ZWVuKSBzbyB0aGUgYXR0ZW50aW9uXG4gICAgICAgIC8vIGFuaW1hdGlvbiByZXBsYXlzIGV2ZXJ5IHRpbWUgdGhlIHVzZXIgdGFicyBiYWNrIG9udG8gdGhlIHByb2JsZW0uXG4gICAgICAgIHRoaXMua2V5Ym9hcmRUaXAuY2xhc3NMaXN0LnJlbW92ZShcInBhcnNvbnMtZW50cnktaGludFwiKTtcbiAgICAgICAgdm9pZCB0aGlzLmtleWJvYXJkVGlwLm9mZnNldFdpZHRoO1xuICAgICAgICB0aGlzLmtleWJvYXJkVGlwLmNsYXNzTGlzdC5hZGQoXCJwYXJzb25zLWVudHJ5LWhpbnRcIik7XG4gICAgICAgIHRoaXMuc291cmNlTGFiZWwuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICB0aGlzLmFuc3dlckxhYmVsLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICB9XG5cbiAgICBoaWRlS2V5Ym9hcmRFbnRyeUhpbnQoKSB7XG4gICAgICAgIHRoaXMua2V5Ym9hcmRUaXAuaW5uZXJIVE1MID0gdChcIm1zZ19wYXJzb25fYXJyb3dfbmF2aWdhdGVcIik7XG4gICAgICAgIHRoaXMua2V5Ym9hcmRUaXAuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICB0aGlzLmtleWJvYXJkVGlwLmNsYXNzTGlzdC5yZW1vdmUoXCJwYXJzb25zLWVudHJ5LWhpbnRcIik7XG4gICAgICAgIHRoaXMuc291cmNlTGFiZWwuc3R5bGUuZGlzcGxheSA9IFwiXCI7XG4gICAgICAgIHRoaXMuYW5zd2VyTGFiZWwuc3R5bGUuZGlzcGxheSA9IFwiXCI7XG4gICAgfVxuXG4gICAgZGlzYWJsZUJsb2NrTWF0aFRhYlN0b3BzKCkge1xuICAgICAgICBkaXNhYmxlTWF0aEpheFRhYlN0b3BzKHRoaXMub3V0ZXJEaXYsIFtcIi5ibG9ja1wiXSk7XG4gICAgfVxuXG4gICAgb2JzZXJ2ZU1hdGhKYXhTcGVlY2goKSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHRoaXMubWF0aEpheFNwZWVjaE9ic2VydmVyIHx8XG4gICAgICAgICAgICB0eXBlb2YgTXV0YXRpb25PYnNlcnZlciA9PT0gXCJ1bmRlZmluZWRcIlxuICAgICAgICApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubWF0aEpheFNwZWVjaE9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKG11dGF0aW9ucykgPT4ge1xuICAgICAgICAgICAgY29uc3QgY2hhbmdlZEJsb2NrcyA9IG5ldyBTZXQoKTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgbXV0YXRpb24gb2YgbXV0YXRpb25zKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYmxvY2sgPSBtdXRhdGlvbi50YXJnZXQuY2xvc2VzdD8uKFwiLmJsb2NrXCIpO1xuICAgICAgICAgICAgICAgIGlmIChibG9jaykge1xuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VkQmxvY2tzLmFkZChibG9jayk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNoYW5nZWRCbG9ja3Muc2l6ZSA9PT0gMCkgcmV0dXJuO1xuXG4gICAgICAgICAgICB0aGlzLmRpc2FibGVCbG9ja01hdGhUYWJTdG9wcygpO1xuICAgICAgICAgICAgY2hhbmdlZEJsb2Nrcy5mb3JFYWNoKCh2aWV3KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgYmxvY2sgPSB0aGlzLmJsb2Nrcy5maW5kKChpdGVtKSA9PiBpdGVtLnZpZXcgPT09IHZpZXcpO1xuICAgICAgICAgICAgICAgIGlmIChibG9jaykgdGhpcy51cGRhdGVCbG9ja0FyaWFMYWJlbChibG9jayk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMubWF0aEpheFNwZWVjaE9ic2VydmVyLm9ic2VydmUodGhpcy5vdXRlckRpdiwge1xuICAgICAgICAgICAgc3VidHJlZTogdHJ1ZSxcbiAgICAgICAgICAgIGF0dHJpYnV0ZXM6IHRydWUsXG4gICAgICAgICAgICBhdHRyaWJ1dGVGaWx0ZXI6IFtcImRhdGEtc2VtYW50aWMtc3BlZWNoLW5vbmVcIl0sXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIEJhc2VkIG9uIHdoYXQgaXMgc3BlY2lmaWVkIGluIHRoZSBvcmlnaW5hbCBIVE1MLCBjcmVhdGUgdGhlIEhUTUwgdmlld1xuICAgIGluaXRpYWxpemVWaWV3KCkge1xuICAgICAgICB0aGlzLm91dGVyRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdGhpcy5vdXRlckRpdi5jbGFzc0xpc3QuYWRkKFwicGFyc29uc1wiKTtcbiAgICAgICAgdGhpcy5vdXRlckRpdi5pZCA9IHRoaXMuY291bnRlcklkO1xuICAgICAgICB0aGlzLm91dGVyRGl2LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICBcImtleWRvd25cIixcbiAgICAgICAgICAgIChldmVudCkgPT4gdGhpcy5oYW5kbGVLZXlib2FyZE1vdmVtZW50S2V5ZG93bihldmVudCksXG4gICAgICAgICAgICB0cnVlLFxuICAgICAgICApO1xuICAgICAgICAvLyBwYXJzb25zLXRleHQgZXhpc3RzIGluIHNvdXJjZSwgbWFrZSBzdXJlIGl0IGhhcyBleGVyY2lzZS1zdGF0ZW1lbnQgY2xhc3NcbiAgICAgICAgbGV0IHBhcnNvbnNUZXh0RGl2ID0gdGhpcy5jb250YWluZXJEaXYucXVlcnlTZWxlY3RvcihcIi5wYXJzb25zLXRleHRcIik7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHBhcnNvbnNUZXh0RGl2ICYmXG4gICAgICAgICAgICAhcGFyc29uc1RleHREaXYuY2xhc3NMaXN0LmNvbnRhaW5zKFwiZXhlcmNpc2Utc3RhdGVtZW50XCIpXG4gICAgICAgIClcbiAgICAgICAgICAgIHBhcnNvbnNUZXh0RGl2LmNsYXNzTGlzdC5hZGQoXCJleGVyY2lzZS1zdGF0ZW1lbnRcIik7XG4gICAgICAgIHRoaXMua2V5Ym9hcmRUaXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB0aGlzLmtleWJvYXJkVGlwLnNldEF0dHJpYnV0ZShcInJvbGVcIiwgXCJ0b29sdGlwXCIpO1xuICAgICAgICB0aGlzLmtleWJvYXJkVGlwLmlkID0gdGhpcy5jb3VudGVySWQgKyBcIi10aXBcIjtcbiAgICAgICAgdGhpcy5rZXlib2FyZFRpcC5pbm5lckhUTUwgPSB0KFwibXNnX3BhcnNvbl9hcnJvd19uYXZpZ2F0ZVwiKTtcbiAgICAgICAgdGhpcy5vdXRlckRpdi5hcHBlbmRDaGlsZCh0aGlzLmtleWJvYXJkVGlwKTtcbiAgICAgICAgdGhpcy5rZXlib2FyZFRpcC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgIHRoaXMuc29ydENvbnRhaW5lckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHRoaXMuc29ydENvbnRhaW5lckRpdi5jbGFzc0xpc3QuYWRkKFwic29ydGFibGUtY29kZS1jb250YWluZXJcIik7XG4gICAgICAgIHRoaXMuc29ydENvbnRhaW5lckRpdi5zZXRBdHRyaWJ1dGUoXG4gICAgICAgICAgICBcImFyaWEtZGVzY3JpYmVkYnlcIixcbiAgICAgICAgICAgIHRoaXMuY291bnRlcklkICsgXCItdGlwXCIsXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuc29ydENvbnRhaW5lckRpdi50YWJJbmRleCA9IDA7XG4gICAgICAgIHRoaXMuc29ydENvbnRhaW5lckRpdi5zZXRBdHRyaWJ1dGUoXCJyb2xlXCIsIFwiYnV0dG9uXCIpO1xuICAgICAgICB0aGlzLnNvcnRDb250YWluZXJEaXYuc2V0QXR0cmlidXRlKFxuICAgICAgICAgICAgXCJhcmlhLWxhYmVsXCIsXG4gICAgICAgICAgICB0KFwibXNnX3BhcnNvbl9rZXlib2FyZF9lbnRyeV9sYWJlbFwiKSxcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5zb3J0Q29udGFpbmVyRGl2LmFkZEV2ZW50TGlzdGVuZXIoXCJmb2N1c1wiLCAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgIXRoaXMua2V5Ym9hcmRJbnB1dEFjdGl2ZSAmJlxuICAgICAgICAgICAgICAgIHRoaXMuc29ydENvbnRhaW5lckRpdi5tYXRjaGVzKFwiOmZvY3VzLXZpc2libGVcIilcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2hvd0tleWJvYXJkRW50cnlIaW50KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnNvcnRDb250YWluZXJEaXYuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgZXZlbnQudGFyZ2V0ID09PSB0aGlzLnNvcnRDb250YWluZXJEaXYgJiZcbiAgICAgICAgICAgICAgICAoZXZlbnQua2V5ID09PSBcIkVudGVyXCIgfHwgZXZlbnQua2V5ID09PSBcIiBcIilcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhcnRLZXlib2FyZEludGVyYWN0aW9uKCk7XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuc29ydENvbnRhaW5lckRpdi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBpZiAoZXZlbnQudGFyZ2V0ID09PSB0aGlzLnNvcnRDb250YWluZXJEaXYpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0S2V5Ym9hcmRJbnRlcmFjdGlvbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5rZXlib2FyZEFwcGxpY2F0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdGhpcy5rZXlib2FyZEFwcGxpY2F0aW9uLmNsYXNzTGlzdC5hZGQoXCJwYXJzb25zLWtleWJvYXJkLWFwcGxpY2F0aW9uXCIpO1xuICAgICAgICB0aGlzLmtleWJvYXJkQXBwbGljYXRpb24uc2V0QXR0cmlidXRlKFwicm9sZVwiLCBcImFwcGxpY2F0aW9uXCIpO1xuICAgICAgICB0aGlzLmtleWJvYXJkQXBwbGljYXRpb24udGFiSW5kZXggPSAtMTtcbiAgICAgICAgdGhpcy5rZXlib2FyZEFwcGxpY2F0aW9uLmFkZEV2ZW50TGlzdGVuZXIoXCJibHVyXCIsICgpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmtleWJvYXJkSW5wdXRBY3RpdmUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNhbmNlbEtleWJvYXJkTW92ZW1lbnQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuc29ydENvbnRhaW5lckRpdi5hZGRFdmVudExpc3RlbmVyKFwiYmx1clwiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICB0aGlzLmtleWJvYXJkSW5wdXRBY3RpdmUgJiZcbiAgICAgICAgICAgICAgICBldmVudC5yZWxhdGVkVGFyZ2V0ICE9PSB0aGlzLmtleWJvYXJkQXBwbGljYXRpb25cbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHRoaXMuY2FuY2VsS2V5Ym9hcmRNb3ZlbWVudCgpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICghdGhpcy5rZXlib2FyZElucHV0QWN0aXZlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oaWRlS2V5Ym9hcmRFbnRyeUhpbnQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuc29ydENvbnRhaW5lckRpdi5hcHBlbmRDaGlsZCh0aGlzLmtleWJvYXJkQXBwbGljYXRpb24pO1xuICAgICAgICB0aGlzLm91dGVyRGl2LmFwcGVuZENoaWxkKHRoaXMuc29ydENvbnRhaW5lckRpdik7XG4gICAgICAgIHRoaXMuc291cmNlUmVnaW9uRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdGhpcy5zb3VyY2VSZWdpb25EaXYuaWQgPSB0aGlzLmNvdW50ZXJJZCArIFwiLXNvdXJjZVJlZ2lvblwiO1xuICAgICAgICB0aGlzLnNvdXJjZVJlZ2lvbkRpdi5jbGFzc0xpc3QuYWRkKFwic29ydGFibGUtY29kZVwiKTtcbiAgICAgICAgdGhpcy5zb3VyY2VMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHRoaXMuc291cmNlTGFiZWwuc2V0QXR0cmlidXRlKFwicm9sZVwiLCBcInRvb2x0aXBcIik7XG4gICAgICAgIHRoaXMuc291cmNlTGFiZWwuaWQgPSB0aGlzLmNvdW50ZXJJZCArIFwiLXNvdXJjZVRpcFwiO1xuICAgICAgICB0aGlzLnNvdXJjZUxhYmVsLmlubmVySFRNTCA9IHQoXCJtc2dfcGFyc29uX2RyYWdfZnJvbV9oZXJlXCIpO1xuICAgICAgICB0aGlzLnNvdXJjZVJlZ2lvbkRpdi5hcHBlbmRDaGlsZCh0aGlzLnNvdXJjZUxhYmVsKTtcbiAgICAgICAgdGhpcy5zb3J0Q29udGFpbmVyRGl2LmFwcGVuZENoaWxkKHRoaXMuc291cmNlUmVnaW9uRGl2KTtcbiAgICAgICAgdGhpcy5zb3VyY2VBcmVhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdGhpcy5zb3VyY2VBcmVhLmlkID0gdGhpcy5jb3VudGVySWQgKyBcIi1zb3VyY2VcIjtcbiAgICAgICAgdGhpcy5zb3VyY2VBcmVhLmNsYXNzTGlzdC5hZGQoXCJzb3VyY2VcIik7XG4gICAgICAgIHRoaXMuc291cmNlQXJlYS5zZXRBdHRyaWJ1dGUoXG4gICAgICAgICAgICBcImFyaWEtZGVzY3JpYmVkYnlcIixcbiAgICAgICAgICAgIHRoaXMuY291bnRlcklkICsgXCItc291cmNlVGlwXCIsXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuc291cmNlUmVnaW9uRGl2LmFwcGVuZENoaWxkKHRoaXMuc291cmNlQXJlYSk7XG4gICAgICAgIHRoaXMuYW5zd2VyUmVnaW9uRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdGhpcy5hbnN3ZXJSZWdpb25EaXYuaWQgPSB0aGlzLmNvdW50ZXJJZCArIFwiLWFuc3dlclJlZ2lvblwiO1xuICAgICAgICB0aGlzLmFuc3dlclJlZ2lvbkRpdi5jbGFzc0xpc3QuYWRkKFwic29ydGFibGUtY29kZVwiKTtcbiAgICAgICAgdGhpcy5hbnN3ZXJMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHRoaXMuYW5zd2VyTGFiZWwuc2V0QXR0cmlidXRlKFwicm9sZVwiLCBcInRvb2x0aXBcIik7XG4gICAgICAgIHRoaXMuYW5zd2VyTGFiZWwuaWQgPSB0aGlzLmNvdW50ZXJJZCArIFwiLWFuc3dlclRpcFwiO1xuICAgICAgICB0aGlzLmFuc3dlckxhYmVsLmlubmVySFRNTCA9IHQoXCJtc2dfcGFyc29uX2RyYWdfdG9faGVyZVwiKTtcbiAgICAgICAgdGhpcy5hbnN3ZXJSZWdpb25EaXYuYXBwZW5kQ2hpbGQodGhpcy5hbnN3ZXJMYWJlbCk7XG4gICAgICAgIHRoaXMuc29ydENvbnRhaW5lckRpdi5hcHBlbmRDaGlsZCh0aGlzLmFuc3dlclJlZ2lvbkRpdik7XG4gICAgICAgIHRoaXMuYW5zd2VyQXJlYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHRoaXMuYW5zd2VyQXJlYS5pZCA9IHRoaXMuY291bnRlcklkICsgXCItYW5zd2VyXCI7XG4gICAgICAgIHRoaXMuYW5zd2VyQXJlYS5zZXRBdHRyaWJ1dGUoXG4gICAgICAgICAgICBcImFyaWEtZGVzY3JpYmVkYnlcIixcbiAgICAgICAgICAgIHRoaXMuY291bnRlcklkICsgXCItYW5zd2VyVGlwXCIsXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuYW5zd2VyUmVnaW9uRGl2LmFwcGVuZENoaWxkKHRoaXMuYW5zd2VyQXJlYSk7XG4gICAgICAgIHRoaXMucGFyc29uc0NvbnRyb2xEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB0aGlzLnBhcnNvbnNDb250cm9sRGl2LmNsYXNzTGlzdC5hZGQoXCJwYXJzb25zLWNvbnRyb2xzXCIpO1xuICAgICAgICB0aGlzLm91dGVyRGl2LmFwcGVuZENoaWxkKHRoaXMucGFyc29uc0NvbnRyb2xEaXYpO1xuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICAgIHRoaXMuY2hlY2tCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgICAgICB0aGlzLmNoZWNrQnV0dG9uLmNsYXNzTmFtZSA9IFwiYnRuIGJ0bi1zdWNjZXNzXCI7XG4gICAgICAgIHRoaXMuY2hlY2tCdXR0b24udGV4dENvbnRlbnQgPSB0KFwibXNnX3BhcnNvbl9jaGVja19tZVwiKTtcbiAgICAgICAgdGhpcy5jaGVja0J1dHRvbi5pZCA9IHRoaXMuY291bnRlcklkICsgXCItY2hlY2tcIjtcbiAgICAgICAgdGhpcy5wYXJzb25zQ29udHJvbERpdi5hcHBlbmRDaGlsZCh0aGlzLmNoZWNrQnV0dG9uKTtcbiAgICAgICAgdGhpcy5jaGVja0J1dHRvbi50eXBlID0gXCJidXR0b25cIjtcbiAgICAgICAgdGhpcy5jaGVja0J1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhhdC5jaGVja0N1cnJlbnRBbnN3ZXIoKTtcbiAgICAgICAgICAgIHRoYXQubG9nQ3VycmVudEFuc3dlcigpO1xuICAgICAgICAgICAgdGhhdC5yZW5kZXJGZWVkYmFjaygpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5yZXNldEJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICAgIHRoaXMucmVzZXRCdXR0b24uY2xhc3NOYW1lID0gXCJidG4gYnRuLWRlZmF1bHRcIjtcbiAgICAgICAgdGhpcy5yZXNldEJ1dHRvbi50ZXh0Q29udGVudCA9IHQoXCJtc2dfcGFyc29uX3Jlc2V0XCIpO1xuICAgICAgICB0aGlzLnJlc2V0QnV0dG9uLmlkID0gdGhpcy5jb3VudGVySWQgKyBcIi1yZXNldFwiO1xuICAgICAgICB0aGlzLnJlc2V0QnV0dG9uLnR5cGUgPSBcImJ1dHRvblwiO1xuICAgICAgICB0aGlzLnBhcnNvbnNDb250cm9sRGl2LmFwcGVuZENoaWxkKHRoaXMucmVzZXRCdXR0b24pO1xuICAgICAgICB0aGlzLnJlc2V0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGF0LmNsZWFyRmVlZGJhY2soKTtcbiAgICAgICAgICAgIHRoYXQuY2hlY2tCdXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoYXQucmVzZXRWaWV3KCk7XG4gICAgICAgICAgICB0aGF0LmNoZWNrQ291bnQgPSAwO1xuICAgICAgICAgICAgdGhhdC5sb2dNb3ZlKFwicmVzZXRcIik7XG4gICAgICAgICAgICB0aGF0LnNldExvY2FsU3RvcmFnZSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5hZGFwdGl2ZSkge1xuICAgICAgICAgICAgdGhpcy5oZWxwQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICAgICAgICAgIHRoaXMuaGVscEJ1dHRvbi5jbGFzc05hbWUgPSBcImJ0biBidG4tcHJpbWFyeVwiO1xuICAgICAgICAgICAgdGhpcy5oZWxwQnV0dG9uLnRleHRDb250ZW50ID0gdChcIm1zZ19wYXJzb25faGVscFwiKTtcbiAgICAgICAgICAgIHRoaXMuaGVscEJ1dHRvbi5pZCA9IHRoaXMuY291bnRlcklkICsgXCItaGVscFwiO1xuICAgICAgICAgICAgdGhpcy5oZWxwQnV0dG9uLmRpc2FibGVkID0gZmFsc2U7IC8vIGJqZVxuICAgICAgICAgICAgdGhpcy5wYXJzb25zQ29udHJvbERpdi5hcHBlbmRDaGlsZCh0aGlzLmhlbHBCdXR0b24pO1xuICAgICAgICAgICAgdGhpcy5oZWxwQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHRoYXQuaGVscE1lKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm1lc3NhZ2VEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB0aGlzLm1lc3NhZ2VEaXYuaWQgPSB0aGlzLmNvdW50ZXJJZCArIFwiLW1lc3NhZ2VcIjtcbiAgICAgICAgdGhpcy5tZXNzYWdlRGl2LnNldEF0dHJpYnV0ZShcImFyaWEtbGl2ZVwiLCBcInBvbGl0ZVwiKTtcbiAgICAgICAgdGhpcy5tZXNzYWdlRGl2LnNldEF0dHJpYnV0ZShcInJvbGVcIiwgXCJzdGF0dXNcIik7XG4gICAgICAgIHRoaXMucGFyc29uc0NvbnRyb2xEaXYuYXBwZW5kQ2hpbGQodGhpcy5tZXNzYWdlRGl2KTtcbiAgICAgICAgdGhpcy5tZXNzYWdlRGl2LnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuICAgICAgICB0aGlzLm9yaWdFbGVtLnJlcGxhY2VXaXRoKHRoaXMub3V0ZXJEaXYpO1xuICAgICAgICBjb25zdCBzcUNvbnRhaW5lciA9IHRoaXMub3V0ZXJEaXYuY2xvc2VzdChcIi5zcWNvbnRhaW5lclwiKTtcbiAgICAgICAgaWYgKHNxQ29udGFpbmVyKSB7XG4gICAgICAgICAgICBzcUNvbnRhaW5lci5zdHlsZS5tYXhXaWR0aCA9IFwibm9uZVwiO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLm91dGVyRGl2KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5xdWVzdGlvbi5pbm5lckhUTUwubWF0Y2goL15cXHMrJC8pKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5xdWVzdGlvbi5yZW1vdmUoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vdXRlckRpdi5wcmVwZW5kKHRoaXMucXVlc3Rpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8vIEluaXRpYWxpemUgbGluZXMgYW5kIHNvbHV0aW9uIHByb3BlcnRpZXNcbiAgICAvLyBDb2RlVGFpbG9yOiBhIGJpZyBjaGFuZ2UgaXMgaW4gdGhpcyBmdW5jdGlvbiAtIGluY2x1ZGVkICNzZXR0bGVkIGJsb2NrcyBhbmQgcGxhY2Vob2xkZXIgYmxvY2tzXG4gICAgaW5pdGlhbGl6ZUxpbmVzKHRleHQpIHtcbiAgICAgICAgdGhpcy5saW5lcyA9IFtdO1xuICAgICAgICAvLyBDcmVhdGUgdGhlIGluaXRpYWwgYmxvY2tzXG4gICAgICAgIHZhciB0ZXh0QmxvY2tzID0gdGV4dC5zcGxpdChcIi0tLVwiKTtcbiAgICAgICAgaWYgKHRleHRCbG9ja3MubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAvLyBJZiB0aGVyZSBhcmUgbm8gLS0tLCB0aGVuIGV2ZXJ5IGxpbmUgaXMgaXRzIG93biBibG9ja1xuICAgICAgICAgICAgdGV4dEJsb2NrcyA9IHRleHQuc3BsaXQoXCJcXG5cIik7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHNvbHV0aW9uID0gW107XG4gICAgICAgIHZhciBpbmRlbnRzID0gW107XG4gICAgICAgIC8vIENvZGVUYWlsb3I6IFBhcnNvbnMgcHV6emxlIHdpc2UsIHRoZSBiaWdnZXN0IGNoYW5nZSBpcyBpbiB0aGlzIHNlY3Rpb25cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zY2FmZm9sZGluZyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgdmFyIHBsYWNlaG9sZGVyTmVlZGVkID0gZmFsc2U7XG4gICAgICAgICAgICAvLyBpZiB0aGVyZSBpcyBhIHBsYWNlaG9sZGVyIG5lZWRlZCB0byBiZSBjcmVhdGVkIGF0IHRoZSBlbmRcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGV4dEJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciB0ZXh0QmxvY2sgPSB0ZXh0QmxvY2tzW2ldO1xuICAgICAgICAgICAgICAgIC8vIEZpZ3VyZSBvdXQgb3B0aW9ucyBiYXNlZCBvbiB0aGUgI29wdGlvblxuICAgICAgICAgICAgICAgIC8vIFJlbW92ZSB0aGUgb3B0aW9ucyBmcm9tIHRoZSBjb2RlXG4gICAgICAgICAgICAgICAgLy8gb25seSBvcHRpb25zIGFyZSAjcGFpcmVkIG9yICNkaXN0cmFjdG9yXG4gICAgICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSB7fTtcbiAgICAgICAgICAgICAgICB2YXIgZGlzdHJhY3RJbmRleDtcbiAgICAgICAgICAgICAgICB2YXIgZGlzdHJhY3RIZWxwdGV4dCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgdmFyIHRhZ0luZGV4O1xuICAgICAgICAgICAgICAgIHZhciB0YWc7XG4gICAgICAgICAgICAgICAgdmFyIGRlcGVuZHNJbmRleDtcbiAgICAgICAgICAgICAgICB2YXIgZGVwZW5kcyA9IFtdO1xuICAgICAgICAgICAgICAgIGlmICh0ZXh0QmxvY2suaW5jbHVkZXMoXCIjcGFpcmVkOlwiKSkge1xuICAgICAgICAgICAgICAgICAgICBkaXN0cmFjdEluZGV4ID0gdGV4dEJsb2NrLmluZGV4T2YoXCIjcGFpcmVkOlwiKTtcbiAgICAgICAgICAgICAgICAgICAgZGlzdHJhY3RIZWxwdGV4dCA9IHRleHRCbG9ja1xuICAgICAgICAgICAgICAgICAgICAgICAgLnN1YnN0cmluZyhkaXN0cmFjdEluZGV4ICsgOCwgdGV4dEJsb2NrLmxlbmd0aClcbiAgICAgICAgICAgICAgICAgICAgICAgIC50cmltKCk7XG4gICAgICAgICAgICAgICAgICAgIHRleHRCbG9jayA9IHRleHRCbG9jay5zdWJzdHJpbmcoMCwgZGlzdHJhY3RJbmRleCArIDcpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGV4dEJsb2NrLmluY2x1ZGVzKFwiI2Rpc3RyYWN0b3I6XCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIGRpc3RyYWN0SW5kZXggPSB0ZXh0QmxvY2suaW5kZXhPZihcIiNkaXN0cmFjdG9yOlwiKTtcbiAgICAgICAgICAgICAgICAgICAgZGlzdHJhY3RIZWxwdGV4dCA9IHRleHRCbG9ja1xuICAgICAgICAgICAgICAgICAgICAgICAgLnN1YnN0cmluZyhkaXN0cmFjdEluZGV4ICsgMTIsIHRleHRCbG9jay5sZW5ndGgpXG4gICAgICAgICAgICAgICAgICAgICAgICAudHJpbSgpO1xuICAgICAgICAgICAgICAgICAgICB0ZXh0QmxvY2sgPSB0ZXh0QmxvY2suc3Vic3RyaW5nKDAsIGRpc3RyYWN0SW5kZXggKyAxMSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0ZXh0QmxvY2suaW5jbHVkZXMoXCIjc2V0dGxlZFwiKSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc2V0dGxlZEluZGV4ID0gdGV4dEJsb2NrLmluZGV4T2YoXCIjc2V0dGxlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgZGlzdHJhY3RIZWxwdGV4dCA9IHRleHRCbG9ja1xuICAgICAgICAgICAgICAgICAgICAgICAgLnN1YnN0cmluZyhzZXR0bGVkSW5kZXggKyA4LCB0ZXh0QmxvY2subGVuZ3RoKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRyaW0oKTtcbiAgICAgICAgICAgICAgICAgICAgdGV4dEJsb2NrID0gdGV4dEJsb2NrLnN1YnN0cmluZygwLCBzZXR0bGVkSW5kZXggKyA4KTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRleHRCbG9jay5pbmNsdWRlcyhcIiN0YWc6XCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRleHRCbG9jayA9IHRleHRCbG9jay5yZXBsYWNlKC8jdGFnOi4qOy4qOy8sIChzKSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgcy5yZXBsYWNlKC9cXHMrL2csIFwiXCIpLFxuICAgICAgICAgICAgICAgICAgICApOyAvLyByZW1vdmUgd2hpdGVzcGFjZSBpbiB0YWcgYW5kIGRlcGVuZHMgbGlzdFxuICAgICAgICAgICAgICAgICAgICB0YWdJbmRleCA9IHRleHRCbG9jay5pbmRleE9mKFwiI3RhZzpcIik7XG4gICAgICAgICAgICAgICAgICAgIHRhZyA9IHRleHRCbG9jay5zdWJzdHJpbmcoXG4gICAgICAgICAgICAgICAgICAgICAgICB0YWdJbmRleCArIDUsXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0QmxvY2suaW5kZXhPZihcIjtcIiwgdGFnSW5kZXggKyA1KSxcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhZyA9PSBcIlwiKSB0YWcgPSBcImJsb2NrLVwiICsgaTtcbiAgICAgICAgICAgICAgICAgICAgZGVwZW5kc0luZGV4ID0gdGV4dEJsb2NrLmluZGV4T2YoXCI7ZGVwZW5kczpcIik7XG4gICAgICAgICAgICAgICAgICAgIGxldCBkZXBlbmRzU3RyaW5nID0gdGV4dEJsb2NrLnN1YnN0cmluZyhcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlcGVuZHNJbmRleCArIDksXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0QmxvY2suaW5kZXhPZihcIjtcIiwgZGVwZW5kc0luZGV4ICsgOSksXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIGRlcGVuZHMgPVxuICAgICAgICAgICAgICAgICAgICAgICAgZGVwZW5kc1N0cmluZy5sZW5ndGggPiAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBkZXBlbmRzU3RyaW5nLnNwbGl0KFwiLFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogW107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0ZXh0QmxvY2suaW5jbHVkZXMoJ2NsYXNzPVwiZGlzcGxheW1hdGgnKSkge1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zW1wiZGlzcGxheW1hdGhcIl0gPSB0cnVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnNbXCJkaXNwbGF5bWF0aFwiXSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRleHRCbG9jayA9IHRleHRCbG9jay5yZXBsYWNlKFxuICAgICAgICAgICAgICAgICAgICAvIyhwYWlyZWR8ZGlzdHJhY3RvcnxzZXR0bGVkfHRhZzouKjsuKjspLyxcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKG15c3RyaW5nLCBhcmcxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zW2FyZzFdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICAvLyBpZiBibG9jayBpcyAjc2V0dGxlZCAtIGNyZWF0ZSBhIHBsYWNlaG9sZGVyIGxpbmUgKFBIKSBiZWZvcmUgdGhlIGxpbmVzLFxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgIGlmIGl0IGlzIG5vdCB0aGUgZmlyc3QgYmxvY2ssIGFuZCB0aGUgcHJldmlvdXMgYmxvY2sgaXMgbm90IHNldHRsZWRcbiAgICAgICAgICAgICAgICAvLyBJZiBsaW5lcyBhcmU6IHNldHRsZWQsIGxpbmUgMSwgbGluZSAyLCBsaW5lIDMsIHNldHRsZWQsIGxpbmUgNDpcbiAgICAgICAgICAgICAgICAvLyBDcmVhdGUgc2V0dGxlZCwgbGluZSAxLCBsaW5lIDIsIGxpbmUgMywgUEgxLCBzZXR0bGVkLCBsaW5lIDQsIFBIMlxuICAgICAgICAgICAgICAgIC8vIElmIGxpbmVzIGFyZTogbGluZSAxLCBzZXR0bGVkLCBzZXR0bGVkLCBsaW5lIDIsIGxpbmUgMywgbGluZSA0LCBzZXR0bGVkOlxuICAgICAgICAgICAgICAgIC8vIENyZWF0ZSBsaW5lIDEsIFBIMSwgc2V0dGxlZCwgc2V0dGxlZCwgbGluZSAyLCBsaW5lIDMsIGxpbmUgNCwgUEgyLCBzZXR0bGVkXG4gICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zW1wic2V0dGxlZFwiXSAmJlxuICAgICAgICAgICAgICAgICAgICBpID4gMCAmJlxuICAgICAgICAgICAgICAgICAgICBsaW5lcy5sZW5ndGggPiAwICYmXG4gICAgICAgICAgICAgICAgICAgICFsaW5lc1tsaW5lcy5sZW5ndGggLSAxXS5pc1NldHRsZWRcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBsYWNlaG9sZGVyTGluZSA9IG5ldyBQbGFjZWhvbGRlckxpbmUodGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIGxpbmVzLnB1c2gocGxhY2Vob2xkZXJMaW5lKTtcbiAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXJMaW5lLmRpc3RyYWN0b3IgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlckxpbmUucGFpcmVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyTGluZS5kaXN0cmFjdEhlbHB0ZXh0ID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXJMaW5lLmdyb3VwV2l0aE5leHQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXJMaW5lLmluZGVudCA9IDA7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnNbXCJzZXR0bGVkXCJdKSB7XG4gICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyTmVlZGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBDcmVhdGUgbGluZXNcbiAgICAgICAgICAgICAgICB2YXIgbGluZXMgPSBbXTtcbiAgICAgICAgICAgICAgICBpZiAoIW9wdGlvbnNbXCJkaXNwbGF5bWF0aFwiXSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3BsaXQgPSB0ZXh0QmxvY2suc3BsaXQoXCJcXG5cIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNwbGl0ID0gW3RleHRCbG9ja107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgc3BsaXQubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvZGUgPSBzcGxpdFtqXTtcbiAgICAgICAgICAgICAgICAgICAgLy8gZGlzY2FyZCBibGFuayByb3dzXG4gICAgICAgICAgICAgICAgICAgIGlmICghL15cXHMqJC8udGVzdChjb2RlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxpbmUgPSBuZXcgUGFyc29uc0xpbmUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2RlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnNbXCJkaXNwbGF5bWF0aFwiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lcy5wdXNoKGxpbmUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9wdGlvbnNbXCJwYWlyZWRcIl0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5lLmRpc3RyYWN0b3IgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmUucGFpcmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5lLmRpc3RyYWN0SGVscHRleHQgPSBkaXN0cmFjdEhlbHB0ZXh0O1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChvcHRpb25zW1wiZGlzdHJhY3RvclwiXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmUuZGlzdHJhY3RvciA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluZS5wYWlyZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5lLmRpc3RyYWN0SGVscHRleHQgPSBkaXN0cmFjdEhlbHB0ZXh0O1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChvcHRpb25zW1wic2V0dGxlZFwiXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNldHRsZWQgbGluZXM6IGZpeGVkIHNvbHV0aW9uIGxpbmVzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluZS5kaXN0cmFjdG9yID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluZS5wYWlyZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5lLmlzU2V0dGxlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc29sdXRpb24ucHVzaChsaW5lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluZS5kaXN0cmFjdG9yID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluZS5wYWlyZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmdyYWRlciA9PT0gXCJkYWdcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5lLnRhZyA9IHRhZztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluZS5kZXBlbmRzID0gZGVwZW5kcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc29sdXRpb24ucHVzaChsaW5lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmRlbnRzLmluZGV4T2YobGluZS5pbmRlbnQpID09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZW50cy5wdXNoKGxpbmUuaW5kZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobGluZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBBZGQgZ3JvdXBXaXRoTmV4dFxuICAgICAgICAgICAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgbGluZXMubGVuZ3RoIC0gMTsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lc1tqXS5ncm91cFdpdGhOZXh0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBsaW5lc1tsaW5lcy5sZW5ndGggLSAxXS5ncm91cFdpdGhOZXh0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBsYWNlaG9sZGVyTmVlZGVkICYmICFsaW5lc1tsaW5lcy5sZW5ndGggLSAxXS5pc1NldHRsZWQpIHtcbiAgICAgICAgICAgICAgICAvLyBpZiB0aGVyZSBpcyBhIHNldHRsZWQgbGluZSBiZWZvcmUgdGhlIGVuZGluZyBsaW5lc1xuICAgICAgICAgICAgICAgIHZhciBwbGFjZWhvbGRlckxpbmUgPSBuZXcgUGxhY2Vob2xkZXJMaW5lKHRoaXMpO1xuICAgICAgICAgICAgICAgIGxpbmVzLnB1c2gocGxhY2Vob2xkZXJMaW5lKTtcbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlckxpbmUuZGlzdHJhY3RvciA9IHRydWU7XG4gICAgICAgICAgICAgICAgcGxhY2Vob2xkZXJMaW5lLnBhaXJlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyTGluZS5kaXN0cmFjdEhlbHB0ZXh0ID0gXCJcIjtcbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlckxpbmUuZ3JvdXBXaXRoTmV4dCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gQ29kZVRhaWxvcjogTm9ybWFsaXplIHRoZSBpbmRlbnRzIGZvciBqYXZhIC0gc29tZXRpbWVzIGphdmEgaW5kZW50IGRpcmVjdGx5IHVzZXMgOCBzcGFjZXMgZm9yIG1ldGhvZCBpbmRlbnRcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMubGFuZ3VhZ2UgPT09IFwiamF2YVwiKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNsYXNzTGluZUluZGVudCA9IG51bGw7XG4gICAgICAgICAgICAgICAgbGV0IG1ldGhvZExpbmVJbmRlbnQgPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmxpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGxpbmVUZXh0ID0gdGhpcy5saW5lc1tpXS50ZXh0O1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTGluZUluZGVudCA9PT0gbnVsbCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgKGxpbmVUZXh0LmluY2x1ZGVzKFwicHVibGljIGNsYXNzXCIpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluZVRleHQuc3RhcnRzV2l0aChcImltcG9ydFwiKSlcbiAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc0xpbmVJbmRlbnQgPSB0aGlzLmxpbmVzW2ldLmluZGVudDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZExpbmVJbmRlbnQgPT09IG51bGwgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVUZXh0LmluY2x1ZGVzKFwicHVibGljIHN0YXRpY1wiKVxuICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZExpbmVJbmRlbnQgPSB0aGlzLmxpbmVzW2ldLmluZGVudDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIEJyZWFrIGVhcmx5IG9uY2UgYm90aCBhcmUgZm91bmRcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNsYXNzTGluZUluZGVudCAhPT0gbnVsbCAmJiBtZXRob2RMaW5lSW5kZW50ICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIERldGVjdGVkIEphdmEgOC1zcGFjZSBpbmRlbnQg4oCUIHdpbGwgc2hpZnQgbGV2ZWxzIGRvd24gYnkgb25lLlxuICAgICAgICAgICAgICAgIGlmIChjbGFzc0xpbmVJbmRlbnQgPT09IDAgJiYgbWV0aG9kTGluZUluZGVudCA9PT0gOCkge1xuICAgICAgICAgICAgICAgICAgICBpbmRlbnRzID0gaW5kZW50cy5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYSAtIGI7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5saW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGxpbmUgPSB0aGlzLmxpbmVzW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG9yaWdpbmFsSW5kZW50ID0gbGluZS5pbmRlbnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbm9ybWFsaXplZExldmVsID0gaW5kZW50cy5pbmRleE9mKG9yaWdpbmFsSW5kZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChub3JtYWxpemVkTGV2ZWwgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9ybWFsaXplZExldmVsIC09IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lLmluZGVudCA9IG5vcm1hbGl6ZWRMZXZlbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGluZGVudHMgPSBpbmRlbnRzLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhIC0gYjtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5saW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGxpbmUgPSB0aGlzLmxpbmVzW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGluZS5pbmRlbnQgPSBpbmRlbnRzLmluZGV4T2YobGluZS5pbmRlbnQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBQeXRob24gLSBPcmlnaW5hbCBiZWhhdmlvclxuICAgICAgICAgICAgICAgIGluZGVudHMgPSBpbmRlbnRzLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGEgLSBiO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5saW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgbGluZSA9IHRoaXMubGluZXNbaV07XG4gICAgICAgICAgICAgICAgICAgIGxpbmUuaW5kZW50ID0gaW5kZW50cy5pbmRleE9mKGxpbmUuaW5kZW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnNvbHV0aW9uID0gc29sdXRpb247XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBOb3JtYWwgUGFyc29ucyBwdXp6bGUgaW5pdGlhbGl6YXRpb25cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGV4dEJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciB0ZXh0QmxvY2sgPSB0ZXh0QmxvY2tzW2ldO1xuICAgICAgICAgICAgICAgIC8vIEZpZ3VyZSBvdXQgb3B0aW9ucyBiYXNlZCBvbiB0aGUgI29wdGlvblxuICAgICAgICAgICAgICAgIC8vIFJlbW92ZSB0aGUgb3B0aW9ucyBmcm9tIHRoZSBjb2RlXG4gICAgICAgICAgICAgICAgLy8gb25seSBvcHRpb25zIGFyZSAjcGFpcmVkIG9yICNkaXN0cmFjdG9yXG4gICAgICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSB7fTtcbiAgICAgICAgICAgICAgICB2YXIgZGlzdHJhY3RJbmRleDtcbiAgICAgICAgICAgICAgICB2YXIgZGlzdHJhY3RIZWxwdGV4dCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgdmFyIHRhZ0luZGV4O1xuICAgICAgICAgICAgICAgIHZhciB0YWc7XG4gICAgICAgICAgICAgICAgdmFyIGRlcGVuZHNJbmRleDtcbiAgICAgICAgICAgICAgICB2YXIgZGVwZW5kcyA9IFtdO1xuICAgICAgICAgICAgICAgIGlmICh0ZXh0QmxvY2suaW5jbHVkZXMoXCIjcGFpcmVkOlwiKSkge1xuICAgICAgICAgICAgICAgICAgICBkaXN0cmFjdEluZGV4ID0gdGV4dEJsb2NrLmluZGV4T2YoXCIjcGFpcmVkOlwiKTtcbiAgICAgICAgICAgICAgICAgICAgZGlzdHJhY3RIZWxwdGV4dCA9IHRleHRCbG9ja1xuICAgICAgICAgICAgICAgICAgICAgICAgLnN1YnN0cmluZyhkaXN0cmFjdEluZGV4ICsgOCwgdGV4dEJsb2NrLmxlbmd0aClcbiAgICAgICAgICAgICAgICAgICAgICAgIC50cmltKCk7XG4gICAgICAgICAgICAgICAgICAgIHRleHRCbG9jayA9IHRleHRCbG9jay5zdWJzdHJpbmcoMCwgZGlzdHJhY3RJbmRleCArIDcpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGV4dEJsb2NrLmluY2x1ZGVzKFwiI2Rpc3RyYWN0b3I6XCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIGRpc3RyYWN0SW5kZXggPSB0ZXh0QmxvY2suaW5kZXhPZihcIiNkaXN0cmFjdG9yOlwiKTtcbiAgICAgICAgICAgICAgICAgICAgZGlzdHJhY3RIZWxwdGV4dCA9IHRleHRCbG9ja1xuICAgICAgICAgICAgICAgICAgICAgICAgLnN1YnN0cmluZyhkaXN0cmFjdEluZGV4ICsgMTIsIHRleHRCbG9jay5sZW5ndGgpXG4gICAgICAgICAgICAgICAgICAgICAgICAudHJpbSgpO1xuICAgICAgICAgICAgICAgICAgICB0ZXh0QmxvY2sgPSB0ZXh0QmxvY2suc3Vic3RyaW5nKDAsIGRpc3RyYWN0SW5kZXggKyAxMSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0ZXh0QmxvY2suaW5jbHVkZXMoXCIjdGFnOlwiKSkge1xuICAgICAgICAgICAgICAgICAgICB0ZXh0QmxvY2sgPSB0ZXh0QmxvY2sucmVwbGFjZSgvI3RhZzouKjsuKjsvLCAocykgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgIHMucmVwbGFjZSgvXFxzKy9nLCBcIlwiKSxcbiAgICAgICAgICAgICAgICAgICAgKTsgLy8gcmVtb3ZlIHdoaXRlc3BhY2UgaW4gdGFnIGFuZCBkZXBlbmRzIGxpc3RcbiAgICAgICAgICAgICAgICAgICAgdGFnSW5kZXggPSB0ZXh0QmxvY2suaW5kZXhPZihcIiN0YWc6XCIpO1xuICAgICAgICAgICAgICAgICAgICB0YWcgPSB0ZXh0QmxvY2suc3Vic3RyaW5nKFxuICAgICAgICAgICAgICAgICAgICAgICAgdGFnSW5kZXggKyA1LFxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dEJsb2NrLmluZGV4T2YoXCI7XCIsIHRhZ0luZGV4ICsgNSksXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0YWcgPT0gXCJcIikgdGFnID0gXCJibG9jay1cIiArIGk7XG4gICAgICAgICAgICAgICAgICAgIGRlcGVuZHNJbmRleCA9IHRleHRCbG9jay5pbmRleE9mKFwiO2RlcGVuZHM6XCIpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgZGVwZW5kc1N0cmluZyA9IHRleHRCbG9jay5zdWJzdHJpbmcoXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXBlbmRzSW5kZXggKyA5LFxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dEJsb2NrLmluZGV4T2YoXCI7XCIsIGRlcGVuZHNJbmRleCArIDkpLFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBkZXBlbmRzID1cbiAgICAgICAgICAgICAgICAgICAgICAgIGRlcGVuZHNTdHJpbmcubGVuZ3RoID4gMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gZGVwZW5kc1N0cmluZy5zcGxpdChcIixcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFtdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodGV4dEJsb2NrLmluY2x1ZGVzKCdjbGFzcz1cImRpc3BsYXltYXRoJykpIHtcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9uc1tcImRpc3BsYXltYXRoXCJdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zW1wiZGlzcGxheW1hdGhcIl0gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGV4dEJsb2NrID0gdGV4dEJsb2NrLnJlcGxhY2UoXG4gICAgICAgICAgICAgICAgICAgIC9cXHMqIyhwYWlyZWR8ZGlzdHJhY3Rvcnx0YWc6Lio7Lio7KVxccyovZyxcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKG15c3RyaW5nLCBhcmcxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zW2FyZzFdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgLy8gQ3JlYXRlIGxpbmVzXG4gICAgICAgICAgICAgICAgdmFyIGxpbmVzID0gW107XG4gICAgICAgICAgICAgICAgaWYgKCFvcHRpb25zW1wiZGlzcGxheW1hdGhcIl0pIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNwbGl0ID0gdGV4dEJsb2NrLnNwbGl0KFwiXFxuXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzcGxpdCA9IFt0ZXh0QmxvY2tdO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgc3BsaXQubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvZGUgPSBzcGxpdFtqXTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGlzQmxhbmsgPSAvXlxccyokLy50ZXN0KGNvZGUpO1xuICAgICAgICAgICAgICAgICAgICAvLyBkaXNjYXJkIHVwIHRvIG9uZSBibGFuayBsZWFkaW5nIG9yIHRyYWlsaW5nIGxpbmVcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzQmxhbmsgJiYgKGogPT0gMCB8fCBqID09IHNwbGl0Lmxlbmd0aCAtIDEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB2YXIgbGluZSA9IG5ldyBQYXJzb25zTGluZShcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RlLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uc1tcImRpc3BsYXltYXRoXCJdLFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBsaW5lcy5wdXNoKGxpbmUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAob3B0aW9uc1tcInBhaXJlZFwiXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGluZS5kaXN0cmFjdG9yID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmUucGFpcmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmUuZGlzdHJhY3RIZWxwdGV4dCA9IGRpc3RyYWN0SGVscHRleHQ7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAob3B0aW9uc1tcImRpc3RyYWN0b3JcIl0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmUuZGlzdHJhY3RvciA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lLnBhaXJlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGluZS5kaXN0cmFjdEhlbHB0ZXh0ID0gZGlzdHJhY3RIZWxwdGV4dDtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmUuZGlzdHJhY3RvciA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGluZS5wYWlyZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZ3JhZGVyID09PSBcImRhZ1wiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluZS50YWcgPSB0YWc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluZS5kZXBlbmRzID0gZGVwZW5kcztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHNvbHV0aW9uLnB1c2gobGluZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGluZGVudHMuaW5kZXhPZihsaW5lLmluZGVudCkgPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGVudHMucHVzaChsaW5lLmluZGVudCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGxpbmVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gQWRkIGdyb3VwV2l0aE5leHRcbiAgICAgICAgICAgICAgICAgICAgZm9yIChqID0gMDsgaiA8IGxpbmVzLmxlbmd0aCAtIDE7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGluZXNbal0uZ3JvdXBXaXRoTmV4dCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbGluZXNbbGluZXMubGVuZ3RoIC0gMV0uZ3JvdXBXaXRoTmV4dCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIE5vcm1hbGl6ZSB0aGUgaW5kZW50c1xuICAgICAgICAgICAgaW5kZW50cyA9IGluZGVudHMuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgICAgIHJldHVybiBhIC0gYjtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMubGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsaW5lID0gdGhpcy5saW5lc1tpXTtcbiAgICAgICAgICAgICAgICBsaW5lLmluZGVudCA9IGluZGVudHMuaW5kZXhPZihsaW5lLmluZGVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnNvbHV0aW9uID0gc29sdXRpb247XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gQmFzZWQgb24gdGhlIGJsb2NrcywgY3JlYXRlIHRoZSBzb3VyY2UgYW5kIGFuc3dlciBhcmVhc1xuICAgIGFzeW5jIGluaXRpYWxpemVBcmVhcyhzb3VyY2VCbG9ja3MsIGFuc3dlckJsb2Nrcywgb3B0aW9ucykge1xuICAgICAgICAvLyBDcmVhdGUgYmxvY2tzIHByb3BlcnR5IGFzIHRoZSBzdW0gb2YgdGhlIHR3b1xuICAgICAgICBjb25zdCBwYXJlbnQgPSB0aGlzLm91dGVyRGl2LnBhcmVudE5vZGU7XG4gICAgICAgIHZhciBibG9ja3MgPSBbXTtcbiAgICAgICAgdmFyIGksIGJsb2NrO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgc291cmNlQmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBibG9jayA9IHNvdXJjZUJsb2Nrc1tpXTtcbiAgICAgICAgICAgIGJsb2Nrcy5wdXNoKGJsb2NrKTtcbiAgICAgICAgICAgIHRoaXMuc291cmNlQXJlYS5hcHBlbmRDaGlsZChibG9jay52aWV3KTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgYW5zd2VyQmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBibG9jayA9IGFuc3dlckJsb2Nrc1tpXTtcbiAgICAgICAgICAgIGJsb2Nrcy5wdXNoKGJsb2NrKTtcbiAgICAgICAgICAgIHRoaXMuYW5zd2VyQXJlYS5hcHBlbmRDaGlsZChibG9jay52aWV3KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmJsb2NrcyA9IGJsb2NrcztcbiAgICAgICAgdGhpcy5vYnNlcnZlTWF0aEpheFNwZWVjaCgpO1xuICAgICAgICAvLyBJZiBwcmVzZW50LCBkaXNhYmxlIHNvbWUgYmxvY2tzXG4gICAgICAgIHZhciBkaXNhYmxlZCA9IG9wdGlvbnMuZGlzYWJsZWQ7XG4gICAgICAgIGlmIChkaXNhYmxlZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgYmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgYmxvY2sgPSBibG9ja3NbaV07XG4gICAgICAgICAgICAgICAgaWYgKGRpc2FibGVkLmluY2x1ZGVzKGJsb2NrLmxpbmVzWzBdLmluZGV4KSkge1xuICAgICAgICAgICAgICAgICAgICBibG9jay52aWV3LmNsYXNzTGlzdC5hZGQoXCJkaXNhYmxlZFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gRGV0ZXJtaW5lIGhvdyBtdWNoIGluZGVudCBzaG91bGQgYmUgcG9zc2libGUgaW4gdGhlIGFuc3dlciBhcmVhXG4gICAgICAgIHZhciBpbmRlbnQgPSAwO1xuICAgICAgICBpZiAoIXRoaXMubm9pbmRlbnQpIHtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMubGFuZ3VhZ2UgPT0gXCJuYXR1cmFsXCIgfHxcbiAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMubGFuZ3VhZ2UgPT0gXCJtYXRoXCIgfHxcbiAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMubGFuZ3VhZ2UgPT0gXCJ0ZXh0XCJcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIGluZGVudCA9IHRoaXMuc29sdXRpb25JbmRlbnQoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaW5kZW50ID0gTWF0aC5tYXgoMCwgdGhpcy5zb2x1dGlvbkluZGVudCgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmluZGVudCA9IGluZGVudDtcbiAgICAgICAgLy8gRm9yIHJlbmRlcmluZywgcGxhY2UgaW4gYW4gb25zY3JlZW4gcG9zaXRpb25cbiAgICAgICAgdmFyIGlzSGlkZGVuID0gdGhpcy5vdXRlckRpdi5vZmZzZXRQYXJlbnQgPT0gbnVsbDtcbiAgICAgICAgdmFyIHJlcGxhY2VFbGVtZW50O1xuICAgICAgICBpZiAoaXNIaWRkZW4pIHtcbiAgICAgICAgICAgIHJlcGxhY2VFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgIGlmIChwYXJlbnQpIHtcbiAgICAgICAgICAgICAgICBwYXJlbnQucmVwbGFjZUNoaWxkKHJlcGxhY2VFbGVtZW50LCB0aGlzLm91dGVyRGl2KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGFkZCBydW5lc3RvbmUtc3BoaW54IGNsYXNzIHNvIHRoZSBjc3MgcnVsZXMgZm9yIHBhcnNvbnMgd2lsbCBhcHBseVxuICAgICAgICAgICAgdGhpcy5vdXRlckRpdi5jbGFzc0xpc3QuYWRkKFwicnVuZXN0b25lLXNwaGlueFwiKTtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5vdXRlckRpdik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBvbmx5IGRvIHByZXR0aWZ5IGlmIHByaXNtIGlzIG5vdCBsb2FkZWRcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLnByZXR0aWZ5TGFuZ3VhZ2UgIT09IFwiXCIgJiZcbiAgICAgICAgICAgIHR5cGVvZiBQcmlzbSA9PT0gXCJ1bmRlZmluZWRcIlxuICAgICAgICApIHtcbiAgICAgICAgICAgIHByZXR0eVByaW50KCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBsYW5nID0gdGhpcy5vcHRpb25zW1wibGFuZ3VhZ2VcIl07XG4gICAgICAgIGlmIChsYW5nICYmIHR5cGVvZiBQcmlzbSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgY29uc3QgY29kZUVscyA9IHRoaXMuY29udGFpbmVyRGl2LnF1ZXJ5U2VsZWN0b3JBbGwoXCJjb2RlXCIpO1xuICAgICAgICAgICAgZm9yIChjb25zdCBlbCBvZiBjb2RlRWxzKSB7XG4gICAgICAgICAgICAgICAgZWwuY2xhc3NMaXN0LmFkZChgbGFuZ3VhZ2UtJHtsYW5nfWApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgUHJpc20uaGlnaGxpZ2h0QWxsVW5kZXIodGhpcy5jb250YWluZXJEaXYpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmxpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmxpbmVzW2ldLmluaXRpYWxpemVXaWR0aCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gU2V0IHRoZSBzb3VyY2Ugd2lkdGggdG8gaXRzIG1heCB2YWx1ZS4gIFRoaXMgYWxsb3dzIHRoZSBibG9ja3MgdG8gYmUgY3JlYXRlZFxuICAgICAgICAvLyBhdCB0aGVpciBcIm5hdHVyYWxcIiBzaXplLiBBcyBsb25nIGFzIHRoYXQgaXMgc21hbGxlciB0aGFuIHRoZSBtYXguXG4gICAgICAgIC8vIFRoaXMgYWxsb3dzIHVzIHRvIHVzZSBzZW5zaWJsZSBmdW5jdGlvbnMgdG8gZGV0ZXJtaW5lIHRoZSBjb3JyZWN0IGhlaWdodHNcbiAgICAgICAgLy8gYW5kIHdpZHRocyBmb3IgdGhlIGRyYWcgYW5kIGRyb3AgYXJlYXMuXG4gICAgICAgIC8vIExpa2UgbW9zdCBvZiB0aGUgc2l6aW5nLCB0aGlzIGlzIGEgYml0IG9mIGEgaGFjay5cbiAgICAgICAgY29uc3QgYXZhaWxhYmxlV2lkdGggPSB0aGlzLm91dGVyRGl2Lm9mZnNldFdpZHRoO1xuICAgICAgICBjb25zdCBhbnN3ZXJJbmRlbnRTcGFjZSA9IHRoaXMub3B0aW9ucy5waXhlbHNQZXJJbmRlbnQgKiB0aGlzLmluZGVudDtcbiAgICAgICAgY29uc3QgbWFyZ2luRnVkZ2UgPSA4MDsgLy8gbWFyZ2lucywgcGFkZGluZywgZXRjLi4uXG4gICAgICAgIGxldCBtYXhTb3VyY2VBcmVhV2lkdGggPVxuICAgICAgICAgICAgKGF2YWlsYWJsZVdpZHRoIC0gYW5zd2VySW5kZW50U3BhY2UgLSBtYXJnaW5GdWRnZSkgLyAyO1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLm51bWJlcmVkICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgbWF4U291cmNlQXJlYVdpZHRoIC09IDI1O1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc291cmNlQXJlYS5zdHlsZS53aWR0aCA9IG1heFNvdXJjZUFyZWFXaWR0aCArIFwicHhcIjsgLy8gbGlrZWx5IHJlZHVjZWQgbGF0ZXJcblxuICAgICAgICAvLyBMYXlvdXQgdGhlIGFyZWFzXG4gICAgICAgIHZhciBhcmVhV2lkdGgsIGFyZWFIZWlnaHQ7XG4gICAgICAgIC8vIEVzdGFibGlzaCB0aGUgd2lkdGggYW5kIGhlaWdodCBvZiB0aGUgZHJvcHBhYmxlIGFyZWFzXG4gICAgICAgIHZhciBpdGVtO1xuICAgICAgICBhcmVhSGVpZ2h0ID0gMjA7XG4gICAgICAgIHZhciBoZWlnaHRfYWRkID0gMDtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5udW1iZXJlZCAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGhlaWdodF9hZGQgPSAxO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVXNlIHR3byBleHBsaWNpdCBwYXNzZXMg4oCUIGZpcnN0IG1lYXN1cmUgYWxsIHdpZHRocyAod2l0aCBNYXRoSmF4IGF3YWl0ZWQgcGVyIGJsb2NrIGZvciBtYXRoKSxcbiAgICAgICAgLy8gdGhlbiBhcHBseSB0aGUgZmluYWwgYXJlYVdpZHRoIHRvIGFsbCBibG9ja3MgYW5kIG1lYXN1cmUgaGVpZ2h0cy5cbiAgICAgICAgYXJlYVdpZHRoID0gMDtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIC8vIFBhc3MgMTogcmVuZGVyIG1hdGggKGlmIG5lZWRlZCkgYW5kIG1lYXN1cmUgbmF0dXJhbCB3aWR0aCBvZiBlYWNoIGJsb2NrXG4gICAgICAgIGNvbnN0IGlzTWF0aCA9XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMubGFuZ3VhZ2UgPT0gXCJuYXR1cmFsXCIgfHxcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5sYW5ndWFnZSA9PSBcIm1hdGhcIiB8fFxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLmxhbmd1YWdlID09IFwidGV4dFwiO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgYmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBpdGVtID0gYmxvY2tzW2ldLnZpZXc7XG4gICAgICAgICAgICBpZiAoaXNNYXRoKSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgc2VsZi5xdWV1ZU1hdGhKYXgoaXRlbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhcmVhV2lkdGggPSBNYXRoLm1heChhcmVhV2lkdGgsIGl0ZW0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGlzYWJsZUJsb2NrTWF0aFRhYlN0b3BzKCk7XG4gICAgICAgIHRoaXMudXBkYXRlQmxvY2tBcmlhTGFiZWxzKCk7XG4gICAgICAgIC8vIFBhc3MgMjogYXBwbHkgdW5pZm9ybSB3aWR0aCB0byBhbGwgYmxvY2tzLCB0aGVuIG1lYXN1cmUgaGVpZ2h0c1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgYmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBpdGVtID0gYmxvY2tzW2ldLnZpZXc7XG4gICAgICAgICAgICBpdGVtLnN0eWxlLndpZHRoID0gYXJlYVdpZHRoIC0gMjIgKyBcInB4XCI7XG4gICAgICAgICAgICB2YXIgYWRkaXRpb24gPSAzLjg7XG4gICAgICAgICAgICBjb25zdCBzdHlsZSA9IGdldENvbXB1dGVkU3R5bGUoaXRlbSk7XG4gICAgICAgICAgICBjb25zdCBvdXRlckggPVxuICAgICAgICAgICAgICAgIGl0ZW0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0ICtcbiAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KHN0eWxlLm1hcmdpblRvcCkgK1xuICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQoc3R5bGUubWFyZ2luQm90dG9tKTtcbiAgICAgICAgICAgIGlmIChvdXRlckggIT0gMzgpIHtcbiAgICAgICAgICAgICAgICBhZGRpdGlvbiA9ICgzLjEgKiAob3V0ZXJIIC0gMzgpKSAvIDIxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYXJlYUhlaWdodCArPSBvdXRlckggKyBoZWlnaHRfYWRkICogYWRkaXRpb247XG4gICAgICAgIH1cblxuICAgICAgICAvLyBzb21ldGltZXMgd2UgaGF2ZSBhIHByb2JsZW0gd2l0aCBoaWRkZW4gZWxlbWVudHMgbm90IGdldHRpbmcgdGhlIHJpZ2h0IGhlaWdodFxuICAgICAgICAvLyBqdXN0IG1ha2Ugc3VyZSB0aGF0IHdlIGhhdmUgYSByZWFzb25hYmxlIGhlaWdodC4gVGhlcmUgbXVzdCBiZSBhIGJldHRlciB3YXkgdG9cbiAgICAgICAgLy8gZG8gdGhpcy5cbiAgICAgICAgaWYgKHRoaXMuaXNUaW1lZCAmJiBhcmVhSGVpZ2h0IDwgYmxvY2tzLmxlbmd0aCAqIDM4KSB7XG4gICAgICAgICAgICBhcmVhSGVpZ2h0ID0gYmxvY2tzLmxlbmd0aCAqIDUwO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYXJlYVdpZHRoID0gYXJlYVdpZHRoO1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLm51bWJlcmVkICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5hcmVhV2lkdGggKz0gMjU7XG4gICAgICAgICAgICAvL2FyZWFIZWlnaHQgKz0gKGJsb2Nrcy5sZW5ndGgpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpbmRlbnQgPiAwICYmIGluZGVudCA8PSA0KSB7XG4gICAgICAgICAgICB0aGlzLmFuc3dlckFyZWEuY2xhc3NMaXN0LmFkZChcImFuc3dlclwiICsgaW5kZW50KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYW5zd2VyQXJlYS5jbGFzc0xpc3QuYWRkKFwiYW5zd2VyXCIpO1xuICAgICAgICB9XG4gICAgICAgIC8vIEluaXRpYWxpemUgcGFpcmVkIGRpc3RyYWN0b3IgZGVjb3JhdGlvblxuICAgICAgICB2YXIgYmlucyA9IFtdO1xuICAgICAgICB2YXIgYmluID0gW107XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLmxpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgbGluZSA9IHRoaXMubGluZXNbaV07XG4gICAgICAgICAgICBpZiAobGluZS5ibG9jaygpID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGlmIChiaW4ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBiaW5zLnB1c2goYmluKTtcbiAgICAgICAgICAgICAgICAgICAgYmluID0gW107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBiaW4ucHVzaChsaW5lKTtcbiAgICAgICAgICAgICAgICBpZiAoIWxpbmUuZ3JvdXBXaXRoTmV4dCkge1xuICAgICAgICAgICAgICAgICAgICBiaW5zLnB1c2goYmluKTtcbiAgICAgICAgICAgICAgICAgICAgYmluID0gW107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciBwYWlyZWRCaW5zID0gW107XG4gICAgICAgIHZhciBsaW5lTnVtYmVycyA9IFtdO1xuICAgICAgICB2YXIgcGFpcmVkRGl2cyA9IFtdO1xuICAgICAgICB2YXIgajtcbiAgICAgICAgaWYgKHRoaXMucGFpckRpc3RyYWN0b3JzIHx8ICF0aGlzLm9wdGlvbnMuYWRhcHRpdmUpIHtcbiAgICAgICAgICAgIGZvciAoaSA9IGJpbnMubGVuZ3RoIC0gMTsgaSA+IC0xOyBpLS0pIHtcbiAgICAgICAgICAgICAgICBiaW4gPSBiaW5zW2ldO1xuICAgICAgICAgICAgICAgIGlmIChiaW5bMF0ucGFpcmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEFkZCBhbGwgaW4gYmluIHRvIGxpbmUgbnVtYmVyc1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGogPSBiaW4ubGVuZ3RoIC0gMTsgaiA+IC0xOyBqLS0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVOdW1iZXJzLnVuc2hpZnQoYmluW2pdLmluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsaW5lTnVtYmVycy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBBZGQgYWxsIGluIGJpbiB0byBsaW5lIG51bWJlcnNcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaiA9IGJpbi5sZW5ndGggLSAxOyBqID4gLTE7IGotLSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVOdW1iZXJzLnVuc2hpZnQoYmluW2pdLmluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHBhaXJlZEJpbnMudW5zaGlmdChsaW5lTnVtYmVycyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lTnVtYmVycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHBhaXJlZEJpbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgcGFpcmVkRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgICAgICBwYWlyZWREaXYuY2xhc3NMaXN0LmFkZChcInBhaXJlZFwiKTtcbiAgICAgICAgICAgICAgICBwYWlyZWREaXYuaW5uZXJIVE1MID1cbiAgICAgICAgICAgICAgICAgICAgXCI8c3BhbiBpZD0nc3QnIHN0eWxlPSd2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlOyBmb250LXdlaWdodDogYm9sZCc+b3J7PC9zcGFuPlwiO1xuICAgICAgICAgICAgICAgIHBhaXJlZERpdnMucHVzaChwYWlyZWREaXYpO1xuICAgICAgICAgICAgICAgIHRoaXMuc291cmNlQXJlYS5hcHBlbmRDaGlsZChwYWlyZWREaXYpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGFpcmVkQmlucyA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYXJlYUhlaWdodCA9IGFyZWFIZWlnaHQ7XG4gICAgICAgIHRoaXMuc291cmNlQXJlYS5zdHlsZS53aWR0aCA9IGAke3RoaXMuYXJlYVdpZHRoICsgMn1weGA7XG4gICAgICAgIHRoaXMuc291cmNlQXJlYS5zdHlsZS5oZWlnaHQgPSBgJHt0aGlzLmFyZWFIZWlnaHR9cHhgO1xuICAgICAgICB0aGlzLmFuc3dlckFyZWEuc3R5bGUud2lkdGggPSBgJHt0aGlzLm9wdGlvbnMucGl4ZWxzUGVySW5kZW50ICogaW5kZW50ICsgdGhpcy5hcmVhV2lkdGggKyAyfXB4YDtcbiAgICAgICAgdGhpcy5hbnN3ZXJBcmVhLnN0eWxlLmhlaWdodCA9IGAke3RoaXMuYXJlYUhlaWdodH1weGA7XG5cbiAgICAgICAgdGhpcy5wYWlyZWRCaW5zID0gcGFpcmVkQmlucztcbiAgICAgICAgdGhpcy5wYWlyZWREaXZzID0gcGFpcmVkRGl2cztcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5udW1iZXJlZCAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuYWRkQmxvY2tMYWJlbHMoc291cmNlQmxvY2tzLmNvbmNhdChhbnN3ZXJCbG9ja3MpKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBVcGRhdGUgdGhlIHZpZXdcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHVuZGVmaW5lZDsgLy8gbmVlZHMgdG8gYmUgaGVyZSBmb3IgbG9hZGluZyBmcm9tIHN0b3JhZ2VcbiAgICAgICAgdGhpcy51cGRhdGVWaWV3KCk7XG4gICAgICAgIC8vIFB1dCBiYWNrIGludG8gdGhlIG9mZnNjcmVlbiBwb3NpdGlvblxuICAgICAgICBpZiAoaXNIaWRkZW4pIHtcbiAgICAgICAgICAgIHJlcGxhY2VFbGVtZW50LnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKFxuICAgICAgICAgICAgICAgIHRoaXMub3V0ZXJEaXYsXG4gICAgICAgICAgICAgICAgcmVwbGFjZUVsZW1lbnQsXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gTWFrZSBibG9ja3MgaW50ZXJhY3RpdmUgKGJvdGggZHJhZy1hbmQtZHJvcCBhbmQga2V5Ym9hcmQpXG4gICAgaW5pdGlhbGl6ZUludGVyYWN0aXZpdHkoKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5ibG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuYmxvY2tzW2ldLmluaXRpYWxpemVJbnRlcmFjdGl2aXR5KCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbml0aWFsaXplVGFiSW5kZXgoKTtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMubGFuZ3VhZ2UgPT0gXCJuYXR1cmFsXCIgfHxcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5sYW5ndWFnZSA9PSBcIm1hdGhcIiB8fFxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLmxhbmd1YWdlID09IFwidGV4dFwiXG4gICAgICAgICkge1xuICAgICAgICAgICAgLy8gTWF0aEpheCB0eXBlc2V0cyBpbiBjYWxsIG9yZGVyLCBzbyB0aGlzIHJ1bnMgYWZ0ZXIgdGhlXG4gICAgICAgICAgICAvLyBwZXItYmxvY2sgaXRlbXMgaGF2ZSByZWFjaGVkIHRoZWlyIGZpbmFsIGxheW91dC5cbiAgICAgICAgICAgIHNlbGYucXVldWVNYXRoSmF4KHNlbGYub3V0ZXJEaXYpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIFJlY2FsY3VsYXRlIGFyZWFXaWR0aCBhbmQgYXJlYUhlaWdodCBmcm9tIGFsbCBibG9ja3MgKHNvdXJjZSArIGFuc3dlcilcbiAgICAgICAgICAgICAgICAvLyBub3cgdGhhdCBNYXRoSmF4IGhhcyByZW5kZXJlZCB0byBmaW5hbCBkaW1lbnNpb25zLlxuICAgICAgICAgICAgICAgIHZhciBuZXdBcmVhV2lkdGggPSAwO1xuICAgICAgICAgICAgICAgIHZhciBuZXdBcmVhSGVpZ2h0ID0gMjA7XG4gICAgICAgICAgICAgICAgdmFyIGhlaWdodF9hZGQgPSBzZWxmLm9wdGlvbnMubnVtYmVyZWQgIT0gdW5kZWZpbmVkID8gMSA6IDA7XG4gICAgICAgICAgICAgICAgdmFyIHNvdXJjZUJsb2NrcyA9IHNlbGYuc291cmNlQmxvY2tzKCk7XG4gICAgICAgICAgICAgICAgdmFyIGFuc3dlckJsb2NrcyA9IHNlbGYuYW5zd2VyQmxvY2tzKCk7XG4gICAgICAgICAgICAgICAgdmFyIGFsbEJsb2NrcyA9IHNvdXJjZUJsb2Nrcy5jb25jYXQoYW5zd2VyQmxvY2tzKTtcblxuICAgICAgICAgICAgICAgIC8vIEZpcnN0IHBhc3M6IGZpbmQgbWF4IG5hdHVyYWwgd2lkdGggYWNyb3NzIGFsbCBibG9ja3NcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFsbEJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYmxvY2tWaWV3RWwgPSBhbGxCbG9ja3NbaV0udmlldztcbiAgICAgICAgICAgICAgICAgICAgYmxvY2tWaWV3RWwuc3R5bGUud2lkdGggPSBcIlwiOyAvLyByZWxlYXNlIGZpeGVkIHdpZHRoIHRvIGdldCBuYXR1cmFsIHdpZHRoXG4gICAgICAgICAgICAgICAgICAgIHZhciBidlN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShibG9ja1ZpZXdFbCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBidldpZHRoID1cbiAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrVmlld0VsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoICtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQoYnZTdHlsZS5tYXJnaW5MZWZ0IHx8IDApICtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQoYnZTdHlsZS5tYXJnaW5SaWdodCB8fCAwKTtcbiAgICAgICAgICAgICAgICAgICAgbmV3QXJlYVdpZHRoID0gTWF0aC5tYXgobmV3QXJlYVdpZHRoLCBidldpZHRoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgYmFzZVdpZHRoID0gbmV3QXJlYVdpZHRoIC0gMjI7XG4gICAgICAgICAgICAgICAgdmFyIGFuc3dlcldpZHRoID1cbiAgICAgICAgICAgICAgICAgICAgbmV3QXJlYVdpZHRoICtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5pbmRlbnQgKiBzZWxmLm9wdGlvbnMucGl4ZWxzUGVySW5kZW50IC1cbiAgICAgICAgICAgICAgICAgICAgMjI7XG5cbiAgICAgICAgICAgICAgICAvLyBTZWNvbmQgcGFzczogYXBwbHkgY29ycmVjdCB3aWR0aCBhbmQgYWNjdW11bGF0ZSBoZWlnaHRcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFsbEJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYmxvY2tFbCA9IGFsbEJsb2Nrc1tpXS52aWV3O1xuICAgICAgICAgICAgICAgICAgICBibG9ja0VsLnN0eWxlLndpZHRoID0gYmFzZVdpZHRoICsgXCJweFwiO1xuICAgICAgICAgICAgICAgICAgICB2YXIgYlN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShibG9ja0VsKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG91dGVySCA9XG4gICAgICAgICAgICAgICAgICAgICAgICBibG9ja0VsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodCArXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KGJTdHlsZS5tYXJnaW5Ub3AgfHwgMCkgK1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdChiU3R5bGUubWFyZ2luQm90dG9tIHx8IDApO1xuICAgICAgICAgICAgICAgICAgICB2YXIgYWRkaXRpb24gPSAzLjg7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvdXRlckggIT0gMzgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkZGl0aW9uID0gKDMuMSAqIChvdXRlckggLSAzOCkpIC8gMjE7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbmV3QXJlYUhlaWdodCArPSBvdXRlckggKyBoZWlnaHRfYWRkICogYWRkaXRpb247XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgc2VsZi5hcmVhV2lkdGggPSBuZXdBcmVhV2lkdGg7XG4gICAgICAgICAgICAgICAgc2VsZi5hcmVhSGVpZ2h0ID0gbmV3QXJlYUhlaWdodDtcblxuICAgICAgICAgICAgICAgIC8vIFJlc2l6ZSBzb3VyY2UgYW5kIGFuc3dlciBhcmVhc1xuICAgICAgICAgICAgICAgIHNlbGYuc291cmNlQXJlYS5zdHlsZS53aWR0aCA9IG5ld0FyZWFXaWR0aCArIDIgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgc2VsZi5zb3VyY2VBcmVhLnN0eWxlLmhlaWdodCA9IG5ld0FyZWFIZWlnaHQgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgc2VsZi5hbnN3ZXJBcmVhLnN0eWxlLndpZHRoID1cbiAgICAgICAgICAgICAgICAgICAgc2VsZi5vcHRpb25zLnBpeGVsc1BlckluZGVudCAqIHNlbGYuaW5kZW50ICtcbiAgICAgICAgICAgICAgICAgICAgbmV3QXJlYVdpZHRoICtcbiAgICAgICAgICAgICAgICAgICAgMiArXG4gICAgICAgICAgICAgICAgICAgIFwicHhcIjtcbiAgICAgICAgICAgICAgICBzZWxmLmFuc3dlckFyZWEuc3R5bGUuaGVpZ2h0ID0gbmV3QXJlYUhlaWdodCArIFwicHhcIjtcblxuICAgICAgICAgICAgICAgIC8vIFJlcG9zaXRpb24gc291cmNlIGJsb2Nrc1xuICAgICAgICAgICAgICAgIHZhciBwb3NpdGlvblRvcCA9IDA7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzb3VyY2VCbG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN2ID0gc291cmNlQmxvY2tzW2ldLnZpZXc7XG4gICAgICAgICAgICAgICAgICAgIHN2LnN0eWxlLmxlZnQgPSBcIjBweFwiO1xuICAgICAgICAgICAgICAgICAgICBzdi5zdHlsZS50b3AgPSBwb3NpdGlvblRvcCArIFwicHhcIjtcbiAgICAgICAgICAgICAgICAgICAgc3Yuc3R5bGUud2lkdGggPSBiYXNlV2lkdGggKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgICAgIHN2LnN0eWxlLnpJbmRleCA9IDI7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzdlN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShzdik7XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uVG9wICs9XG4gICAgICAgICAgICAgICAgICAgICAgICBzdi5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQgK1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdChzdlN0eWxlLm1hcmdpblRvcCB8fCAwKSArXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KHN2U3R5bGUubWFyZ2luQm90dG9tIHx8IDApO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIFJlcG9zaXRpb24gcGFpcmVkIGRpc3RyYWN0b3IgYnJhY2tldHNcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNlbGYucGFpcmVkQmlucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYmluID0gc2VsZi5wYWlyZWRCaW5zW2ldO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbWF0Y2hpbmcgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBzb3VyY2VCbG9ja3MubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzb3VyY2VCbG9ja3Nbal0ubWF0Y2hlc0JpbihiaW4pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2hpbmcucHVzaChzb3VyY2VCbG9ja3Nbal0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHZhciBkaXYgPSBzZWxmLnBhaXJlZERpdnNbaV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChtYXRjaGluZy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGl2LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpdi5zdHlsZS5kaXNwbGF5ID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBoZWlnaHQgPSAtNTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsYXN0VmlldyA9IG1hdGNoaW5nW21hdGNoaW5nLmxlbmd0aCAtIDFdLnZpZXc7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmlyc3RWaWV3ID0gbWF0Y2hpbmdbMF0udmlldztcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsYXN0VG9wID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KGdldENvbXB1dGVkU3R5bGUobGFzdFZpZXcpLnRvcCkgfHwgMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmaXJzdFRvcCA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdChnZXRDb21wdXRlZFN0eWxlKGZpcnN0VmlldykudG9wKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQgKz0gbGFzdFRvcDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodCAtPSBmaXJzdFRvcDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsYXN0U3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKGxhc3RWaWV3KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodCArPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RWaWV3LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodCArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdChsYXN0U3R5bGUubWFyZ2luVG9wIHx8IDApICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KGxhc3RTdHlsZS5tYXJnaW5Cb3R0b20gfHwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXYuc3R5bGUubGVmdCA9IFwiLTZweFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGl2LnN0eWxlLnRvcCA9IGdldENvbXB1dGVkU3R5bGUoZmlyc3RWaWV3KS50b3A7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXYuc3R5bGUud2lkdGggPSBiYXNlV2lkdGggKyAzNCArIFwicHhcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpdi5zdHlsZS5oZWlnaHQgPSBoZWlnaHQgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXYuc3R5bGUuekluZGV4ID0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpdi5zdHlsZS50ZXh0SW5kZW50ID0gXCItMzBweFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGl2LnN0eWxlLnBhZGRpbmdUb3AgPSAoaGVpZ2h0IC0gNzApIC8gMiArIFwicHhcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpdi5zdHlsZS5vdmVyZmxvdyA9IFwidmlzaWJsZVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGl2LnN0eWxlLmZvbnRTaXplID0gXCI0M3B4XCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXYuc3R5bGUudmVydGljYWxBbGlnbiA9IFwibWlkZGxlXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXYuc3R5bGUuY29sb3IgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidmFyKC0tcGFyc29uc0xhYmVsQ29sb3IsICM1ODU4ZTApXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXYuaW5uZXJIVE1MID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIjxzcGFuIGlkPSdzdCcgc3R5bGU9J3ZlcnRpY2FsLWFsaWduOiBtaWRkbGU7IGZvbnQtd2VpZ2h0OiBib2xkOyBmb250LXNpemU6IDE1cHgnPm9yPC9zcGFuPntcIjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIFJlcG9zaXRpb24gYW5zd2VyIGJsb2Nrc1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uVG9wID0gMDtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFuc3dlckJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYmxvY2sgPSBhbnN3ZXJCbG9ja3NbaV07XG4gICAgICAgICAgICAgICAgICAgIHZhciBpbmRlbnQgPVxuICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2suaW5kZW50ICogc2VsZi5vcHRpb25zLnBpeGVsc1BlckluZGVudDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGJ2ID0gYmxvY2sudmlldztcbiAgICAgICAgICAgICAgICAgICAgYnYuc3R5bGUubGVmdCA9IGluZGVudCArIFwicHhcIjtcbiAgICAgICAgICAgICAgICAgICAgYnYuc3R5bGUudG9wID0gcG9zaXRpb25Ub3AgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgICAgIGJ2LnN0eWxlLndpZHRoID0gYW5zd2VyV2lkdGggLSBpbmRlbnQgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgICAgIGJ2LnN0eWxlLnpJbmRleCA9IDI7XG4gICAgICAgICAgICAgICAgICAgIHZhciBidlN0eWxlMiA9IGdldENvbXB1dGVkU3R5bGUoYnYpO1xuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvblRvcCArPVxuICAgICAgICAgICAgICAgICAgICAgICAgYnYuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0ICtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQoYnZTdHlsZTIubWFyZ2luVG9wIHx8IDApICtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQoYnZTdHlsZTIubWFyZ2luQm90dG9tIHx8IDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIE1ha2UgdGhlIHByb2JsZW0sIHJhdGhlciB0aGFuIGFuIGluZGl2aWR1YWwgYmxvY2ssIGtleWJvYXJkIGFjY2Vzc2libGUuXG4gICAgaW5pdGlhbGl6ZVRhYkluZGV4KCkge1xuICAgICAgICB0aGlzLnNvcnRDb250YWluZXJEaXYudGFiSW5kZXggPSAwO1xuICAgICAgICBmb3IgKGNvbnN0IGJsb2NrIG9mIHRoaXMuYmxvY2tzKSB7XG4gICAgICAgICAgICBpZiAoYmxvY2sudmlldy5jbGFzc0xpc3QuY29udGFpbnMoXCJkaXNhYmxlZFwiKSkge1xuICAgICAgICAgICAgICAgIGJsb2NrLnZpZXcucmVtb3ZlQXR0cmlidXRlKFwidGFiaW5kZXhcIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGJsb2NrLnZpZXcuc2V0QXR0cmlidXRlKFwidGFiaW5kZXhcIiwgXCItMVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT09PSBTRVJWRVIgQ09NTVVOSUNBVElPTiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG4gICAgLy8gUmV0dXJuIHRoZSBhcmd1bWVudCB0aGF0IGlzIG5ld2VyIGJhc2VkIG9uIHRoZSB0aW1lc3RhbXBcbiAgICBuZXdlckRhdGEoZGF0YUEsIGRhdGFCKSB7XG4gICAgICAgIHZhciBkYXRlQSA9IGRhdGFBLnRpbWVzdGFtcDtcbiAgICAgICAgdmFyIGRhdGVCID0gZGF0YUIudGltZXN0YW1wO1xuICAgICAgICBpZiAoZGF0ZUEgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gZGF0YUI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRhdGVCID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIGRhdGFBO1xuICAgICAgICB9XG4gICAgICAgIGRhdGVBID0gdGhpcy5kYXRlRnJvbVRpbWVzdGFtcChkYXRlQSk7XG4gICAgICAgIGRhdGVCID0gdGhpcy5kYXRlRnJvbVRpbWVzdGFtcChkYXRlQik7XG4gICAgICAgIGlmIChkYXRlQSA+IGRhdGVCKSB7XG4gICAgICAgICAgICByZXR1cm4gZGF0YUE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZGF0YUI7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gQmFzZWQgb24gdGhlIGRhdGEsIGxvYWRcbiAgICBhc3luYyBsb2FkRGF0YShkYXRhKSB7XG4gICAgICAgIC8vIGd1YXJkIGFnYWluc3QgYW55IGZhaWx1cmUgdG8gbG9hZC9hZGFwdCBwcm9ibGVtXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnNjYWZmb2xkaW5nID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNvdXJjZUhhc2ggPSBkYXRhLnNvdXJjZTtcbiAgICAgICAgICAgICAgICBpZiAoc291cmNlSGFzaCA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gbWFpbnRhaW4gYmFja3dhcmRzIGNvbXBhdGliaWxpdHlcbiAgICAgICAgICAgICAgICAgICAgc291cmNlSGFzaCA9IGRhdGEudHJhc2g7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBhbnN3ZXJIYXNoID0gZGF0YS5hbnN3ZXI7XG4gICAgICAgICAgICAgICAgdmFyIGFkYXB0aXZlSGFzaCA9IGRhdGEuYWRhcHRpdmU7XG4gICAgICAgICAgICAgICAgdmFyIG9wdGlvbnM7XG4gICAgICAgICAgICAgICAgaWYgKGFkYXB0aXZlSGFzaCA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucyA9IHt9O1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnNGcm9tSGFzaChhZGFwdGl2ZUhhc2gpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5ub2luZGVudCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubm9pbmRlbnQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5jaGVja0NvdW50ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGVja0NvdW50ID0gb3B0aW9ucy5jaGVja0NvdW50O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5oYXNTb2x2ZWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmhhc1NvbHZlZCA9IG9wdGlvbnMuaGFzU29sdmVkO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmluaXRpYWxpemVBcmVhcyhcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ibG9ja3NGcm9tU291cmNlKCksXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0dGxlZEJsb2Nrc0Zyb21Tb3VyY2UoKSxcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucyxcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgc291cmNlSGFzaCA9IGRhdGEuc291cmNlO1xuICAgICAgICAgICAgICAgIGlmIChzb3VyY2VIYXNoID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBtYWludGFpbiBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eVxuICAgICAgICAgICAgICAgICAgICBzb3VyY2VIYXNoID0gZGF0YS50cmFzaDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIGFuc3dlckhhc2ggPSBkYXRhLmFuc3dlcjtcbiAgICAgICAgICAgICAgICB2YXIgYWRhcHRpdmVIYXNoID0gZGF0YS5hZGFwdGl2ZTtcbiAgICAgICAgICAgICAgICB2YXIgb3B0aW9ucztcbiAgICAgICAgICAgICAgICBpZiAoYWRhcHRpdmVIYXNoID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zID0ge307XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucyA9IHRoaXMub3B0aW9uc0Zyb21IYXNoKGFkYXB0aXZlSGFzaCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLm5vaW5kZW50ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2luZGVudCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLmNoZWNrQ291bnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoZWNrQ291bnQgPSBvcHRpb25zLmNoZWNrQ291bnQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLmhhc1NvbHZlZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGFzU29sdmVkID0gb3B0aW9ucy5oYXNTb2x2ZWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgc291cmNlSGFzaCA9PSB1bmRlZmluZWQgfHxcbiAgICAgICAgICAgICAgICAgICAgYW5zd2VySGFzaCA9PSB1bmRlZmluZWQgfHxcbiAgICAgICAgICAgICAgICAgICAgYW5zd2VySGFzaC5sZW5ndGggPT0gMVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmluaXRpYWxpemVBcmVhcyhcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYmxvY2tzRnJvbVNvdXJjZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgW10sXG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuaW5pdGlhbGl6ZUFyZWFzKFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ibG9ja3NGcm9tSGFzaChzb3VyY2VIYXNoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYmxvY2tzRnJvbUhhc2goYW5zd2VySGFzaCksXG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmdyYWRlID0gdGhpcy5ncmFkZXIuZ3JhZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZ3JhZGUgPT0gXCJjb3JyZWN0XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29ycmVjdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5hbnN3ZXJMaW5lcygpLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvcnJlY3QgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb3JyZWN0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgLy8gaWYgYW55dGhpbmcgZ29lcyB3cm9uZywganVzdCBpbml0aWFsaXplIGJhc2VkIG9uIHByb2JsZW0gc291cmNlXG4gICAgICAgICAgICBhd2FpdCB0aGlzLmluaXRpYWxpemVBcmVhcyh0aGlzLmJsb2Nrc0Zyb21Tb3VyY2UoKSwgW10sIG9wdGlvbnMpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgICAgICAgYEVycm9yIHJlc3RvcmluZyBhbnN3ZXIgZm9yIHN0dWRlbnQgJHtkYXRhLnNpZH0gaW4gJHtkYXRhLmRpdl9pZH0uIERlZmF1bHRpbmcgdG8gb3JpZ2luYWwgc3RhdGUuYCxcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gU3RhcnQgdGhlIGludGVyZmFjZVxuICAgICAgICBpZiAodGhpcy5uZWVkc1JlaW5pdGlhbGl6YXRpb24gIT09IHRydWUpIHtcbiAgICAgICAgICAgIHRoaXMuaW5pdGlhbGl6ZUludGVyYWN0aXZpdHkoKTtcbiAgICAgICAgICAgIC8vIFRoaXMgaXMgYSBiaXQgb2YgYSBoYWNrIHRvIGdldCB0aGUgYmxvY2tzIHRvIGJlIGluIHRoZSByaWdodCBwbGFjZVxuICAgICAgICAgICAgLy8gd2hlbiB0aGUgcGFnZSBsb2Fkcy4gIEl0IGlzIG5lZWRlZCBiZWNhdXNlIHRoZSBibG9ja3MgYXJlIG5vdFxuICAgICAgICAgICAgLy8gdmlzaWJsZSB3aGVuIHRoZSBwYWdlIGxvYWRzLCBzbyB0aGUgc2l6ZSBpcyBvZmYuICBUaGlzIGZvcmNlc1xuICAgICAgICAgICAgLy8gYSByZWFsaWdubWVudC5cbiAgICAgICAgICAgIGlmICh0aGlzLmlzVGltZWQgJiYgIXRoaXMuYXNzZXNzbWVudFRha2VuKSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5yZXNldFZpZXcoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBSZXR1cm4gd2hhdCBpcyBzdG9yZWQgaW4gbG9jYWwgc3RvcmFnZVxuICAgIGxvY2FsRGF0YSgpIHtcbiAgICAgICAgdmFyIGRhdGEgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLnN0b3JhZ2VJZCk7XG4gICAgICAgIGlmIChkYXRhICE9PSBudWxsKSB7XG4gICAgICAgICAgICBpZiAoZGF0YS5jaGFyQXQoMCkgPT0gXCJ7XCIpIHtcbiAgICAgICAgICAgICAgICBkYXRhID0gSlNPTi5wYXJzZShkYXRhKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZGF0YSA9IHt9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGF0YSA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cbiAgICAvLyBSdW5lc3RvbmVCYXNlOiBTZW50IHdoZW4gdGhlIHNlcnZlciBoYXMgZGF0YVxuICAgIHJlc3RvcmVBbnN3ZXJzKHNlcnZlckRhdGEpIHtcbiAgICAgICAgdGhpcy5sb2FkRGF0YShzZXJ2ZXJEYXRhKTtcbiAgICB9XG4gICAgLy8gUnVuZXN0b25lQmFzZTogTG9hZCB3aGF0IGlzIGluIGxvY2FsIHN0b3JhZ2VcbiAgICBjaGVja0xvY2FsU3RvcmFnZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuZ3JhZGVyYWN0aXZlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbG9jYWxEYXRhID0gdGhpcy5sb2NhbERhdGEoKTtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgbG9jYWxEYXRhLnRpbWVzdGFtcCAmJlxuICAgICAgICAgICAgbG9jYWxEYXRhLnRpbWVzdGFtcCA8IGVCb29rQ29uZmlnLnRlcm1TdGFydERhdGVcbiAgICAgICAgKSB7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSh0aGlzLnN0b3JhZ2VJZCk7XG4gICAgICAgICAgICBsb2NhbERhdGEgPSB7fTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxvYWREYXRhKGxvY2FsRGF0YSk7XG4gICAgfVxuICAgIC8vIFJ1bmVzdG9uZUJhc2U6IFNldCB0aGUgc3RhdGUgb2YgdGhlIHByb2JsZW0gaW4gbG9jYWwgc3RvcmFnZVxuICAgIHNldExvY2FsU3RvcmFnZShkYXRhKSB7XG4gICAgICAgIHZhciB0b1N0b3JlO1xuICAgICAgICBpZiAoZGF0YSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRvU3RvcmUgPSB7XG4gICAgICAgICAgICAgICAgc291cmNlOiB0aGlzLnNvdXJjZUhhc2goKSxcbiAgICAgICAgICAgICAgICBhbnN3ZXI6IHRoaXMuYW5zd2VySGFzaCgpLFxuICAgICAgICAgICAgICAgIHRpbWVzdGFtcDogbmV3IERhdGUoKSxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB2YXIgYWRhcHRpdmVIYXNoID0gdGhpcy5hZGFwdGl2ZUhhc2goKTtcbiAgICAgICAgICAgIGlmIChhZGFwdGl2ZUhhc2gubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHRvU3RvcmUuYWRhcHRpdmUgPSBhZGFwdGl2ZUhhc2g7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0b1N0b3JlID0gZGF0YTtcbiAgICAgICAgfVxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0aGlzLnN0b3JhZ2VJZCwgSlNPTi5zdHJpbmdpZnkodG9TdG9yZSkpO1xuICAgIH1cblxuICAgIGFzeW5jIHVwZGF0ZVBsYWNlaG9sZGVycygpIHtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICB2YXIgYW5zd2VyQmxvY2tzID0gdGhpcy5hbnN3ZXJCbG9ja3MoKTtcbiAgICAgICAgICAgIHZhciBpLCBoYXNOb3JtYWxCbG9jaztcbiAgICAgICAgICAgIHZhciBwbGFjZWhvbGRlcjtcbiAgICAgICAgICAgIC8vIGhpZGUgcGxhY2Vob2xkZXJcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBhbnN3ZXJCbG9ja3MubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICAvLyBjaGVja2luZyBvbiBwbGFjZWhvbGRlcnNcbiAgICAgICAgICAgICAgICBpZiAoYW5zd2VyQmxvY2tzW2ldLmlzUGxhY2Vob2xkZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXIgPSBhbnN3ZXJCbG9ja3NbaV07XG4gICAgICAgICAgICAgICAgICAgIGhhc05vcm1hbEJsb2NrID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgIGkgPiAwICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAhYW5zd2VyQmxvY2tzW2kgLSAxXS5pc1NldHRsZWQgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICFhbnN3ZXJCbG9ja3NbaSAtIDFdLmlzUGxhY2Vob2xkZXJcbiAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoYXNOb3JtYWxCbG9jayA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgaSA8IGFuc3dlckJsb2Nrcy5sZW5ndGggLSAxICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAhYW5zd2VyQmxvY2tzW2kgKyAxXS5pc1NldHRsZWQgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICFhbnN3ZXJCbG9ja3NbaSArIDFdLmlzUGxhY2Vob2xkZXJcbiAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoYXNOb3JtYWxCbG9jayA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoaGFzTm9ybWFsQmxvY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIGEgcGxhY2Vob2xkZXIgaGFzIGEgbm9ybWFsIGJsb2NrIGJlZm9yZSBvciBhZnRlciwgaGlkZSBpdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghcGxhY2Vob2xkZXIudmlldy5jbGFzc0xpc3QuY29udGFpbnMoXCJoaWRlXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXIudmlldy5jbGFzc0xpc3QuYWRkKFwiaGlkZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaiA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGogPCBhbnN3ZXJCbG9ja3MubGVuZ3RoIC0gMSAtIGk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGorK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlci5tb3ZlRG93bigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgNSk7XG5cbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICB2YXIgYW5zd2VyQmxvY2tzID0gdGhpcy5hbnN3ZXJCbG9ja3MoKTtcbiAgICAgICAgICAgIHZhciBjb250ZW50TGVuZ3RoID0gMDtcbiAgICAgICAgICAgIHdoaWxlIChcbiAgICAgICAgICAgICAgICBjb250ZW50TGVuZ3RoIDwgYW5zd2VyQmxvY2tzLmxlbmd0aCAmJlxuICAgICAgICAgICAgICAgICFhbnN3ZXJCbG9ja3NbY29udGVudExlbmd0aF0udmlldy5jbGFzc0xpc3QuY29udGFpbnMoXCJoaWRlXCIpXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBjb250ZW50TGVuZ3RoKys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBzaG93IHBsYWNlaG9sZGVyIHdoZW4gbmVlZGVkXG4gICAgICAgICAgICB2YXIgcHJldklzU2V0dGxlZCA9IHRydWU7XG4gICAgICAgICAgICBpZiAodGhpcy5maXJzdEJsb2NrU2V0dGxlZCkge1xuICAgICAgICAgICAgICAgIHByZXZJc1NldHRsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBzZXR0bGVkQ291bnQgPSAwO1xuICAgICAgICAgICAgdmFyIGk7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgY29udGVudExlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgLy8gbG9jYXRlIHR3byBjb25zZWN1dGl2ZSBzZXR0bGVkIGJsb2Nrc1xuICAgICAgICAgICAgICAgIGlmIChhbnN3ZXJCbG9ja3NbaV0uaXNTZXR0bGVkICYmIHByZXZJc1NldHRsZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChhbnN3ZXJCbG9ja3NbaV0uaXNTZXR0bGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHByZXZJc1NldHRsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBzZXR0bGVkQ291bnQrKztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBwcmV2SXNTZXR0bGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHBsYWNlaG9sZGVyO1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIGkgPCBjb250ZW50TGVuZ3RoIHx8XG4gICAgICAgICAgICAgICAgKGFuc3dlckJsb2Nrc1tjb250ZW50TGVuZ3RoIC0gMV0gJiZcbiAgICAgICAgICAgICAgICAgICAgYW5zd2VyQmxvY2tzW2NvbnRlbnRMZW5ndGggLSAxXS5pc1NldHRsZWQgJiZcbiAgICAgICAgICAgICAgICAgICAgIXRoaXMubGFzdEJsb2NrU2V0dGxlZClcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIC8vIGxvb2tpbmcgZm9yIHRoZSBwbGFjZWhvbGRlciBibG9jayB0aGF0IHNob3VsZCBiZSBhZnRlciBcInNldHRsZWRDb3VudFwiIG51bWJlciBvZiBzZXR0bGVkIGJsb2NrcztcbiAgICAgICAgICAgICAgICB2YXIgcGxhY2Vob2xkZXJJbmRleDtcbiAgICAgICAgICAgICAgICBmb3IgKFxuICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlckluZGV4ID0gYW5zd2VyQmxvY2tzLmxlbmd0aCAtIDE7XG4gICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVySW5kZXggPj0gY29udGVudExlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXJJbmRleC0tXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuc3dlckJsb2Nrc1twbGFjZWhvbGRlckluZGV4XS5hZnRlclNldHRsZWRCbG9ja0NvdW50ID09XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXR0bGVkQ291bnRcbiAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlciA9IGFuc3dlckJsb2Nrc1twbGFjZWhvbGRlckluZGV4XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgYW5zd2VyQmxvY2tzW3BsYWNlaG9sZGVySW5kZXhdLmFmdGVyU2V0dGxlZEJsb2NrQ291bnQgIT1cbiAgICAgICAgICAgICAgICAgICAgc2V0dGxlZENvdW50XG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgbW92aW5nIHVwOyBubyBwbGFjZWhvbGRlciBmb3VuZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocGxhY2Vob2xkZXIudmlldy5jbGFzc0xpc3QuY29udGFpbnMoXCJoaWRlXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyLnZpZXcuY2xhc3NMaXN0LnJlbW92ZShcImhpZGVcIik7XG4gICAgICAgICAgICAgICAgICAgIC8vIHNob3VsZCBiZSBtb3ZlZCByaWdodCBiZWZvcmUgdGhlIGJsb2NrIGFuc3dlckJsb2Nrc1tpXVxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHBsYWNlaG9sZGVySW5kZXggLSBpOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyLm1vdmVVcCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LCAxMCk7XG4gICAgfVxuXG4gICAgLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT09PSBMT0dHSU5HID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG4gICAgLy8gTG9nIHRoZSBpbnRlcmFjdGlvbiB3aXRoIHRoZSBwcm9ibGVtIHRvIHRoZSBzZXJ2ZXI6XG4gICAgLy8gICBzdGFydDogdGhlIHVzZXIgc3RhcnRlZCBpbnRlcmFjdGluZyB3aXRoIHRoaXMgcHJvYmxlbVxuICAgIC8vICAgbW92ZTogdGhlIHVzZXIgbW92ZWQgYSBibG9jayB0byBhIG5ldyBwb3NpdGlvblxuICAgIC8vICAgcmVzZXQ6IHRoZSByZXNldCBidXR0b24gd2FzIHByZXNzZWRcbiAgICAvLyAgIHJlbW92ZURpc3RyYWN0b3I6IFwiSGVscCBNZVwiIHJlbW92ZWQgYSBkaXN0cmFjdG9yXG4gICAgLy8gICByZW1vdmVJbmRlbnRhdGlvbjogXCJIZWxwIE1lXCIgcmVtb3ZlZCBpbmRlbnRhdGlvblxuICAgIC8vICAgY29tYmluZUJsb2NrczogXCJIZWxwIE1lXCIgY29tYmluZWQgYmxvY2tzXG4gICAgbG9nTW92ZShhY3Rpdml0eSkge1xuICAgICAgICB2YXIgZXZlbnQgPSB7XG4gICAgICAgICAgICBldmVudDogXCJwYXJzb25zTW92ZVwiLFxuICAgICAgICAgICAgZGl2X2lkOiB0aGlzLmRpdmlkLFxuICAgICAgICAgICAgc3RvcmFnZWlkOiBzdXBlci5sb2NhbFN0b3JhZ2VLZXkoKSxcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIGFjdCA9IGFjdGl2aXR5ICsgXCJ8XCIgKyB0aGlzLnNvdXJjZUhhc2goKSArIFwifFwiICsgdGhpcy5hbnN3ZXJIYXNoKCk7XG4gICAgICAgIHZhciBhZGFwdGl2ZUhhc2ggPSB0aGlzLmFkYXB0aXZlSGFzaCgpO1xuICAgICAgICBpZiAoYWRhcHRpdmVIYXNoICE9PSBcIlwiKSB7XG4gICAgICAgICAgICBhY3QgPSBhY3QgKyBcInxcIiArIGFkYXB0aXZlSGFzaDtcbiAgICAgICAgfVxuICAgICAgICBldmVudC5hY3QgPSBhY3Q7XG4gICAgICAgIHRoaXMubG9nQm9va0V2ZW50KGV2ZW50KTtcbiAgICB9XG4gICAgLy8gTG9nIHRoZSBhbnN3ZXIgdG8gdGhlIHByb2JsZW1cbiAgICAvLyAgIGNvcnJlY3Q6IFRoZSBhbnN3ZXIgZ2l2ZW4gbWF0Y2hlcyB0aGUgc29sdXRpb25cbiAgICAvLyAgIGluY29ycmVjdCo6IFRoZSBhbnN3ZXIgaXMgd3JvbmcgZm9yIHZhcmlvdXMgcmVhc29uc1xuICAgIGFzeW5jIGxvZ0N1cnJlbnRBbnN3ZXIoc2lkKSB7XG4gICAgICAgIHZhciBldmVudCA9IHtcbiAgICAgICAgICAgIGV2ZW50OiBcInBhcnNvbnNcIixcbiAgICAgICAgICAgIGRpdl9pZDogdGhpcy5kaXZpZCxcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIGFuc3dlckhhc2ggPSB0aGlzLmFuc3dlckhhc2goKTtcbiAgICAgICAgZXZlbnQuYW5zd2VyID0gYW5zd2VySGFzaDtcbiAgICAgICAgdmFyIHNvdXJjZUhhc2ggPSB0aGlzLnNvdXJjZUhhc2goKTtcbiAgICAgICAgZXZlbnQuc291cmNlID0gc291cmNlSGFzaDtcbiAgICAgICAgdmFyIGFjdCA9IHNvdXJjZUhhc2ggKyBcInxcIiArIGFuc3dlckhhc2g7XG4gICAgICAgIHZhciBhZGFwdGl2ZUhhc2ggPSB0aGlzLmFkYXB0aXZlSGFzaCgpO1xuICAgICAgICBpZiAoYWRhcHRpdmVIYXNoICE9PSBcIlwiKSB7XG4gICAgICAgICAgICBldmVudC5hZGFwdGl2ZSA9IGFkYXB0aXZlSGFzaDtcbiAgICAgICAgICAgIGFjdCA9IGFjdCArIFwifFwiICsgYWRhcHRpdmVIYXNoO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmdyYWRlID09IFwiY29ycmVjdFwiKSB7XG4gICAgICAgICAgICBhY3QgPSBcImNvcnJlY3R8XCIgKyBhY3Q7XG4gICAgICAgICAgICBldmVudC5jb3JyZWN0ID0gXCJUXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhY3QgPSBcImluY29ycmVjdHxcIiArIGFjdDtcbiAgICAgICAgICAgIGV2ZW50LmNvcnJlY3QgPSBcIkZcIjtcbiAgICAgICAgfVxuICAgICAgICBldmVudC5hY3QgPSBhY3Q7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBzaWQgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIGV2ZW50LnNpZCA9IHNpZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGF3YWl0IHRoaXMubG9nQm9va0V2ZW50KGV2ZW50KTtcbiAgICB9XG4gICAgLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT09PSBBQ0NFU1NJTkcgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG4gICAgLy8gQW5zd2VyIHRoZSBoYXNoIG9mIHRoZSBhZGFwdGl2ZSBzdGF0ZVxuICAgIGFkYXB0aXZlSGFzaCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLm9wdGlvbnMuYWRhcHRpdmUpIHtcbiAgICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICB9XG4gICAgICAgIHZhciBoYXNoID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5ibG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBibG9jayA9IHRoaXMuYmxvY2tzW2ldO1xuICAgICAgICAgICAgaWYgKCFibG9jay5lbmFibGVkKCkpIHtcbiAgICAgICAgICAgICAgICBoYXNoLnB1c2goXCJkXCIgKyBibG9jay5saW5lc1swXS5pbmRleCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMubm9pbmRlbnQgIT09IHRoaXMub3B0aW9ucy5ub2luZGVudCkge1xuICAgICAgICAgICAgaGFzaC5wdXNoKFwiaVwiKTtcbiAgICAgICAgfVxuICAgICAgICBoYXNoLnB1c2goXCJjXCIgKyB0aGlzLmNoZWNrQ291bnQpO1xuICAgICAgICBpZiAodGhpcy5oYXNTb2x2ZWQpIHtcbiAgICAgICAgICAgIGhhc2gucHVzaChcInNcIik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGhhc2guam9pbihcIi1cIik7XG4gICAgfVxuICAgIC8vIENyZWF0ZSBvcHRpb25zIGZvciBjcmVhdGluZyBibG9ja3MgYmFzZWQgb24gYSBoYXNoXG4gICAgb3B0aW9uc0Zyb21IYXNoKGhhc2gpIHtcbiAgICAgICAgdmFyIHNwbGl0O1xuICAgICAgICBpZiAoaGFzaCA9PT0gXCItXCIgfHwgaGFzaCA9PT0gXCJcIiB8fCBoYXNoID09PSBudWxsKSB7XG4gICAgICAgICAgICBzcGxpdCA9IFtdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3BsaXQgPSBoYXNoLnNwbGl0KFwiLVwiKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgb3B0aW9ucyA9IHt9O1xuICAgICAgICB2YXIgZGlzYWJsZWQgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzcGxpdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGtleSA9IHNwbGl0W2ldO1xuICAgICAgICAgICAgaWYgKGtleVswXSA9PSBcImlcIikge1xuICAgICAgICAgICAgICAgIG9wdGlvbnMubm9pbmRlbnQgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChrZXlbMF0gPT0gXCJkXCIpIHtcbiAgICAgICAgICAgICAgICBkaXNhYmxlZC5wdXNoKHBhcnNlSW50KGtleS5zbGljZSgxKSkpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChrZXlbMF0gPT0gXCJzXCIpIHtcbiAgICAgICAgICAgICAgICBvcHRpb25zLmhhc1NvbHZlZCA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGtleVswXSA9PSBcImNcIikge1xuICAgICAgICAgICAgICAgIG9wdGlvbnMuY2hlY2tDb3VudCA9IHBhcnNlSW50KGtleS5zbGljZSgxKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRpc2FibGVkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIG9wdGlvbnMuZGlzYWJsZWQgPSBkaXNhYmxlZDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3B0aW9ucztcbiAgICB9XG4gICAgLy8gQW5zd2VyIHRoZSBoYXNoIG9mIHRoZSBhbnN3ZXIgYXJlYVxuICAgIGFuc3dlckhhc2goKSB7XG4gICAgICAgIHZhciBoYXNoID0gW107XG4gICAgICAgIHZhciBibG9ja3MgPSB0aGlzLmFuc3dlckJsb2NrcygpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaGFzaC5wdXNoKGJsb2Nrc1tpXS5oYXNoKCkpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChoYXNoLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIFwiLVwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGhhc2guam9pbihcIi1cIik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gQW5zd2VyIHRoZSBoYXNoIG9mIHRoZSBzb3VyY2UgYXJlYVxuICAgIHNvdXJjZUhhc2goKSB7XG4gICAgICAgIHZhciBoYXNoID0gW107XG4gICAgICAgIHZhciBibG9ja3MgPSB0aGlzLnNvdXJjZUJsb2NrcygpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaGFzaC5wdXNoKGJsb2Nrc1tpXS5oYXNoKCkpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChoYXNoLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIFwiLVwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGhhc2guam9pbihcIi1cIik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gSW50ZXItcHJvYmxlbSBhZGFwdGl2ZSBjaGFuZ2VzXG4gICAgLy8gQmFzZWQgb24gdGhlIHJlY2VudEF0dGVtcHRzLCByZW1vdmUgZGlzdHJhY3RvcnMsIGFkZCBpbmRlbnQsIGNvbWJpbmUgYmxvY2tzXG4gICAgYWRhcHRCbG9ja3MoaW5wdXQpIHtcbiAgICAgICAgdmFyIGJsb2NrcyA9IFtdO1xuICAgICAgICB2YXIgZGlzdHJhY3RvcnMgPSBbXTtcbiAgICAgICAgdmFyIGJsb2NrO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGlucHV0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBibG9jayA9IGlucHV0W2ldO1xuICAgICAgICAgICAgaWYgKGJsb2NrLmlzRGlzdHJhY3RvcigpKSB7XG4gICAgICAgICAgICAgICAgZGlzdHJhY3RvcnMucHVzaChibG9jayk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGJsb2Nrcy5wdXNoKGJsb2NrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlY2VudEF0dGVtcHRzID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXG4gICAgICAgICAgICB0aGlzLmFkYXB0aXZlSWQgKyBcInJlY2VudEF0dGVtcHRzXCIsXG4gICAgICAgICk7XG4gICAgICAgIGlmICh0aGlzLnJlY2VudEF0dGVtcHRzID09IHVuZGVmaW5lZCB8fCB0aGlzLnJlY2VudEF0dGVtcHRzID09IFwiTmFOXCIpIHtcbiAgICAgICAgICAgIHRoaXMucmVjZW50QXR0ZW1wdHMgPSAzO1xuICAgICAgICB9XG4gICAgICAgIHZhciBsYXN0ZXN0QXR0ZW1wdENvdW50ID0gdGhpcy5yZWNlbnRBdHRlbXB0cztcbiAgICAgICAgdmFyIG5CbG9ja3MgPSBibG9ja3MubGVuZ3RoO1xuICAgICAgICB2YXIgbkJsb2Nrc1RvQ29tYmluZSA9IDA7XG4gICAgICAgIHZhciBuRGlzdHJhY3RvcnMgPSBkaXN0cmFjdG9ycy5sZW5ndGg7XG4gICAgICAgIHZhciBuVG9SZW1vdmUgPSAwO1xuICAgICAgICB0aGlzLnBhaXJEaXN0cmFjdG9ycyA9IHRydWU7XG4gICAgICAgIHZhciBnaXZlSW5kZW50YXRpb24gPSBmYWxzZTtcbiAgICAgICAgaWYgKGxhc3Rlc3RBdHRlbXB0Q291bnQgPCAyKSB7XG4gICAgICAgICAgICAvLyAxIFRyeVxuICAgICAgICAgICAgdGhpcy5wYWlyRGlzdHJhY3RvcnMgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMubGltaXREaXN0cmFjdG9ycyA9IGZhbHNlO1xuICAgICAgICB9IGVsc2UgaWYgKGxhc3Rlc3RBdHRlbXB0Q291bnQgPCA0KSB7XG4gICAgICAgICAgICAvLyAyLTMgVHJpZXNcbiAgICAgICAgICAgIC8vIERvIG5vdGhpbmcgdGhleSBhcmUgZG9pbmcgbm9ybWFsXG4gICAgICAgICAgICB0aGlzLnBhaXJEaXN0cmFjdG9ycyA9IHRydWU7XG4gICAgICAgIH0gZWxzZSBpZiAobGFzdGVzdEF0dGVtcHRDb3VudCA8IDYpIHtcbiAgICAgICAgICAgIC8vIDQtNSBUcmllc1xuICAgICAgICAgICAgLy8gcGFpciBkaXN0cmFjdG9yc1xuICAgICAgICAgICAgdGhpcy5wYWlyRGlzdHJhY3RvcnMgPSB0cnVlO1xuICAgICAgICB9IGVsc2UgaWYgKGxhc3Rlc3RBdHRlbXB0Q291bnQgPCA4KSB7XG4gICAgICAgICAgICAvLyA2LTcgVHJpZXNcbiAgICAgICAgICAgIC8vIFJlbW92ZSA1MCUgb2YgZGlzdHJhY3RvcnNcbiAgICAgICAgICAgIG5Ub1JlbW92ZSA9IDAuNSAqIG5EaXN0cmFjdG9ycztcbiAgICAgICAgICAgIHRoaXMucGFpckRpc3RyYWN0b3JzID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIDgrIFRyaWVzXG4gICAgICAgICAgICAvLyBSZW1vdmUgYWxsIG9mIGRpc3RyYWN0b3JzXG4gICAgICAgICAgICBuVG9SZW1vdmUgPSBuRGlzdHJhY3RvcnM7XG4gICAgICAgICAgICB0aGlzLnBhaXJEaXN0cmFjdG9ycyA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgLypcbiAgICAgICAgZWxzZSBpZihsYXN0ZXN0QXR0ZW1wdENvdW50IDwgMTIpIHsgLy8xMC0xMVxuICAgICAgICAgICAgLy8gUmVtb3ZlIGFsbCBkaXN0cmFjdG9ycyBhbmQgZ2l2ZSBpbmRlbnRhdGlvblxuICAgICAgICAgICAgblRvUmVtb3ZlID0gbkRpc3RyYWN0b3JzO1xuICAgICAgICAgICAgZ2l2ZUluZGVudGF0aW9uID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMucGFpckRpc3RyYWN0b3JzID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmKGxhc3Rlc3RBdHRlbXB0Q291bnQgPCAxNCkgeyAvLyAxMi0xMyBUcmllc1xuICAgICAgICAgICAgLy8gUmVtb3ZlIGFsbCBvZiBkaXN0cmFjdG9yc1xuICAgICAgICAgICAgLy8gZ2l2ZSBpbmRlbnRhdGlvblxuICAgICAgICAgICAgLy8gcmVkdWNlIHByb2JsZW0gdG8gMy80IHNpemVcbiAgICAgICAgICAgIGdpdmVJbmRlbnRhdGlvbiA9IHRydWU7XG4gICAgICAgICAgICBuVG9SZW1vdmUgPSBuRGlzdHJhY3RvcnM7XG4gICAgICAgICAgICBuQmxvY2tzVG9Db21iaW5lID0gLjI1ICogbkJsb2NrcztcbiAgICAgICAgICAgIHRoaXMucGFpckRpc3RyYWN0b3JzID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHsgLy8gPj0gMTQgVHJpZXNcbiAgICAgICAgICAgIC8vIFJlbW92ZSBhbGwgb2YgZGlzdHJhY3RvcnNcbiAgICAgICAgICAgIC8vIGdpdmUgaW5kZW50YXRpb25cbiAgICAgICAgICAgIC8vIHJlZHVjZSBwcm9ibGVtIHRvIDEvMiBzaXplXG4gICAgICAgICAgICBnaXZlSW5kZW50YXRpb24gPSB0cnVlO1xuICAgICAgICAgICAgblRvUmVtb3ZlID0gbkRpc3RyYWN0b3JzO1xuICAgICAgICAgICAgbkJsb2Nrc1RvQ29tYmluZSA9IC41ICogbkJsb2NrcztcbiAgICAgICAgICAgIHRoaXMucGFpckRpc3RyYWN0b3JzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICAqL1xuICAgICAgICBuQmxvY2tzVG9Db21iaW5lID0gTWF0aC5taW4obkJsb2Nrc1RvQ29tYmluZSwgbkJsb2NrcyAtIDMpO1xuICAgICAgICAvLyBOZXZlciBjb21iaW5lIHNvIHdoZXJlIHRoZXJlIGFyZSBsZXNzIHRoYW4gdGhyZWUgYmxvY2tzIGxlZnRcbiAgICAgICAgLy8gUmVtb3ZlIGRpc3RyYWN0b3JzXG4gICAgICAgIGRpc3RyYWN0b3JzID0gdGhpcy5zaHVmZmxlZChkaXN0cmFjdG9ycyk7XG4gICAgICAgIGRpc3RyYWN0b3JzID0gZGlzdHJhY3RvcnMuc2xpY2UoMCwgblRvUmVtb3ZlKTtcbiAgICAgICAgdmFyIG91dHB1dCA9IFtdO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgaW5wdXQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGJsb2NrID0gaW5wdXRbaV07XG4gICAgICAgICAgICBpZiAoIWJsb2NrLmlzRGlzdHJhY3RvcigpKSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0LnB1c2goYmxvY2spO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChkaXN0cmFjdG9ycy5pbmRleE9mKGJsb2NrKSA9PSAtMSkge1xuICAgICAgICAgICAgICAgIG91dHB1dC5wdXNoKGJsb2NrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvL3ZhciBvdXRwdXQgPSBpbnB1dDtcbiAgICAgICAgaWYgKGdpdmVJbmRlbnRhdGlvbikge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvdXRwdXQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBvdXRwdXRbaV0uYWRkSW5kZW50KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmluZGVudCA9IDA7XG4gICAgICAgICAgICB0aGlzLm5vaW5kZW50ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBjb21iaW5lIGJsb2Nrc1xuICAgICAgICB2YXIgc29sdXRpb24gPSBbXTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMubGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgb3V0cHV0Lmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgaWYgKG91dHB1dFtqXS5saW5lc1swXS5pbmRleCA9PSBpKSB7XG4gICAgICAgICAgICAgICAgICAgIHNvbHV0aW9uLnB1c2gob3V0cHV0W2pdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuQmxvY2tzVG9Db21iaW5lOyBpKyspIHtcbiAgICAgICAgICAgIC8vIGNvbWJpbmUgb25lIHNldCBvZiBibG9ja3NcbiAgICAgICAgICAgIHZhciBiZXN0ID0gLTEwO1xuICAgICAgICAgICAgdmFyIGNvbWJpbmVJbmRleCA9IC0xMDtcbiAgICAgICAgICAgIGZvciAoaiA9IDA7IGogPCBzb2x1dGlvbi5sZW5ndGggLSAxOyBqKyspIHtcbiAgICAgICAgICAgICAgICBibG9jayA9IHNvbHV0aW9uW2pdO1xuICAgICAgICAgICAgICAgIHZhciBuZXh0ID0gc29sdXRpb25baiArIDFdO1xuICAgICAgICAgICAgICAgIHZhciByYXRpbmcgPSAxMCAtIGJsb2NrLmxpbmVzLmxlbmd0aCAtIG5leHQubGluZXMubGVuZ3RoO1xuICAgICAgICAgICAgICAgIHZhciBibG9ja0luZGVudCA9IGJsb2NrLm1pbmltdW1MaW5lSW5kZW50KCk7XG4gICAgICAgICAgICAgICAgdmFyIG5leHRJbmRlbnQgPSBuZXh0Lm1pbmltdW1MaW5lSW5kZW50KCk7XG4gICAgICAgICAgICAgICAgaWYgKGJsb2NrSW5kZW50ID09IG5leHRJbmRlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmF0aW5nICs9IDI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChibG9ja0luZGVudCA+IG5leHRJbmRlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmF0aW5nIC09IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgYmxvY2subGluZXNbYmxvY2subGluZXMubGVuZ3RoIC0gMV0uaW5kZW50ID09XG4gICAgICAgICAgICAgICAgICAgIG5leHQubGluZXNbMF0uaW5kZW50XG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJhdGluZyArPSAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocmF0aW5nID49IGJlc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgYmVzdCA9IHJhdGluZztcbiAgICAgICAgICAgICAgICAgICAgY29tYmluZUluZGV4ID0gajtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBibG9jayA9IHNvbHV0aW9uW2NvbWJpbmVJbmRleF07XG4gICAgICAgICAgICBuZXh0ID0gc29sdXRpb25bY29tYmluZUluZGV4ICsgMV07XG4gICAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgbmV4dC5saW5lcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIGJsb2NrLmFkZExpbmUobmV4dC5saW5lc1tqXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgbmV3U29sdXRpb24gPSBbXTtcbiAgICAgICAgICAgIGZvciAoaiA9IDA7IGogPCBzb2x1dGlvbi5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIGlmIChqICE9PSBjb21iaW5lSW5kZXggKyAxKSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld1NvbHV0aW9uLnB1c2goc29sdXRpb25bal0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBzb2x1dGlvbiA9IG5ld1NvbHV0aW9uO1xuICAgICAgICB9XG4gICAgICAgIC8vIHJlb3JkZXJcbiAgICAgICAgdmFyIGNvbWJpbmVkT3V0cHV0ID0gW107XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBvdXRwdXQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGZvciAoaiA9IDA7IGogPCBzb2x1dGlvbi5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIGlmIChvdXRwdXRbaV0ubGluZXNbMF0uaW5kZXggPT0gc29sdXRpb25bal0ubGluZXNbMF0uaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgY29tYmluZWRPdXRwdXQucHVzaChzb2x1dGlvbltqXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb21iaW5lZE91dHB1dDtcbiAgICB9XG4gICAgLy8gUmV0dXJuIGFuIGFycmF5IG9mIGNvZGUgYmxvY2tzIGJhc2VkIG9uIHdoYXQgaXMgc3BlY2lmaWVkIGluIHRoZSBwcm9ibGVtXG4gICAgYmxvY2tzRnJvbVNvdXJjZSgpIHtcbiAgICAgICAgdmFyIHVub3JkZXJlZEJsb2NrcyA9IFtdO1xuICAgICAgICB2YXIgb3JpZ2luYWxCbG9ja3MgPSBbXTtcbiAgICAgICAgdmFyIGJsb2NrcyA9IFtdO1xuICAgICAgICB2YXIgbGluZXMgPSBbXTtcbiAgICAgICAgdmFyIGJsb2NrLCBsaW5lLCBpO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5saW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGluZSA9IHRoaXMubGluZXNbaV07XG4gICAgICAgICAgICAvLyBDb2RlVGFpbG9yOiBkbyBub3QgaW5jbHVkZSBwbGFjZSBob2xkZXIgb3Igc2V0dGxlZCBzb2x1dGlvbiBsaW5lcyBpbiBzb3VyY2UgYmxvY2tzXG4gICAgICAgICAgICBpZiAobGluZS5pc1BsYWNlaG9sZGVyTGluZSB8fCBsaW5lLmlzU2V0dGxlZCkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGluZXMucHVzaChsaW5lKTtcbiAgICAgICAgICAgIGlmICghbGluZS5ncm91cFdpdGhOZXh0KSB7XG4gICAgICAgICAgICAgICAgdW5vcmRlcmVkQmxvY2tzLnB1c2gobmV3IFBhcnNvbnNCbG9jayh0aGlzLCBsaW5lcykpO1xuICAgICAgICAgICAgICAgIGxpbmVzID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgb3JpZ2luYWxCbG9ja3MgPSB1bm9yZGVyZWRCbG9ja3M7XG4gICAgICAgIC8vIFRyaW0gdGhlIGRpc3RyYWN0b3JzXG4gICAgICAgIHZhciByZW1vdmVkQmxvY2tzID0gW107XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMubWF4ZGlzdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB2YXIgbWF4ZGlzdCA9IHRoaXMub3B0aW9ucy5tYXhkaXN0O1xuICAgICAgICAgICAgdmFyIGRpc3RyYWN0b3JzID0gW107XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdW5vcmRlcmVkQmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgYmxvY2sgPSB1bm9yZGVyZWRCbG9ja3NbaV07XG4gICAgICAgICAgICAgICAgaWYgKGJsb2NrLmxpbmVzWzBdLmRpc3RyYWN0b3IpIHtcbiAgICAgICAgICAgICAgICAgICAgZGlzdHJhY3RvcnMucHVzaChibG9jayk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG1heGRpc3QgPCBkaXN0cmFjdG9ycy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBkaXN0cmFjdG9ycyA9IHRoaXMuc2h1ZmZsZWQoZGlzdHJhY3RvcnMpO1xuICAgICAgICAgICAgICAgIGRpc3RyYWN0b3JzID0gZGlzdHJhY3RvcnMuc2xpY2UoMCwgbWF4ZGlzdCk7XG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHVub3JkZXJlZEJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBibG9jayA9IHVub3JkZXJlZEJsb2Nrc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJsb2NrLmxpbmVzWzBdLmRpc3RyYWN0b3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkaXN0cmFjdG9ycy5pbmRleE9mKGJsb2NrKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2tzLnB1c2goYmxvY2spO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZW1vdmVkQmxvY2tzLnB1c2goaSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBibG9ja3MucHVzaChibG9jayk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdW5vcmRlcmVkQmxvY2tzID0gYmxvY2tzO1xuICAgICAgICAgICAgICAgIGJsb2NrcyA9IFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gVGhpcyBpcyBuZWNlc3NhcnksIHNldCB0aGUgcGFpckRpc3RyYWN0b3JzIHZhbHVlIGJlZm9yZSBibG9ja3MgZ2V0IHNodWZmbGVkIC0gV2lsbGlhbSBMaSAoQXVndXN0IDIwMjApXG4gICAgICAgIGlmICh0aGlzLnJlY2VudEF0dGVtcHRzIDwgMikge1xuICAgICAgICAgICAgLy8gMSBUcnlcbiAgICAgICAgICAgIHRoaXMucGFpckRpc3RyYWN0b3JzID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnBhaXJEaXN0cmFjdG9ycyA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLm9yZGVyID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIC8vIFNodWZmbGUsIHJlc3BlY3RpbmcgcGFpcmVkIGRpc3RyYWN0b3JzXG4gICAgICAgICAgICB2YXIgY2h1bmtzID0gW10sXG4gICAgICAgICAgICAgICAgY2h1bmsgPSBbXTtcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCB1bm9yZGVyZWRCbG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBibG9jayA9IHVub3JkZXJlZEJsb2Nrc1tpXTtcbiAgICAgICAgICAgICAgICBpZiAoYmxvY2subGluZXNbMF0ucGFpcmVkICYmIHRoaXMucGFpckRpc3RyYWN0b3JzKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFdpbGxpYW0gTGkgKEF1Z3VzdCAyMDIwKVxuICAgICAgICAgICAgICAgICAgICBjaHVuay5wdXNoKGJsb2NrKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjaHVuayA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBjaHVuay5wdXNoKGJsb2NrKTtcbiAgICAgICAgICAgICAgICAgICAgY2h1bmtzLnB1c2goY2h1bmspO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNodW5rcyA9IHRoaXMuc2h1ZmZsZWQoY2h1bmtzKTtcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBjaHVua3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjaHVuayA9IGNodW5rc1tpXTtcbiAgICAgICAgICAgICAgICBpZiAoY2h1bmsubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBzaHVmZmxlIHBhaXJlZCBkaXN0cmFjdG9yc1xuICAgICAgICAgICAgICAgICAgICBjaHVuayA9IHRoaXMuc2h1ZmZsZWQoY2h1bmspO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgY2h1bmsubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsb2Nrcy5wdXNoKGNodW5rW2pdKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGJsb2Nrcy5wdXNoKGNodW5rWzBdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBPcmRlciBhY2NvcmRpbmcgdG8gb3JkZXIgc3BlY2lmaWVkXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5vcHRpb25zLm9yZGVyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgYmxvY2sgPSBvcmlnaW5hbEJsb2Nrc1t0aGlzLm9wdGlvbnMub3JkZXJbaV1dO1xuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgYmxvY2sgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICAgICAgICAgICAgICByZW1vdmVkQmxvY2tzLmluZGV4T2YodGhpcy5vcHRpb25zLm9yZGVyW2ldKSA8IDBcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgYmxvY2tzLnB1c2goYmxvY2spO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBhaXJEaXN0cmFjdG9ycyA9IHRydWU7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuYWRhcHRpdmUpIHtcbiAgICAgICAgICAgIHRoaXMubGltaXREaXN0cmFjdG9ycyA9IHRydWU7XG4gICAgICAgICAgICBibG9ja3MgPSB0aGlzLmFkYXB0QmxvY2tzKGJsb2Nrcyk7XG4gICAgICAgICAgICBpZiAoIXRoaXMubGltaXREaXN0cmFjdG9ycykge1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCByZW1vdmVkQmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpbmRleCA9XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMub3JkZXIgPT0gdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBNYXRoLnJhbmRvbSgwLCBibG9ja3MubGVuZ3RoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogdGhpcy5vcHRpb25zLm9yZGVyLmluZGV4T2YocmVtb3ZlZEJsb2Nrc1tpXSk7XG4gICAgICAgICAgICAgICAgICAgIGJsb2Nrcy5zcGxpY2UoaW5kZXgsIDAsIG9yaWdpbmFsQmxvY2tzW3JlbW92ZWRCbG9ja3NbaV1dKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMucGFpckRpc3RyYWN0b3JzICYmIHRoaXMub3B0aW9ucy5vcmRlciAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIC8vbW92ZSBwYWlycyB0b2dldGhlclxuICAgICAgICAgICAgLy9HbyB0aHJvdWdoIGFycmF5IGxvb2tpbmcgZm9yIGRpdHJhY3RvciBhbmQgaXRzIHBhaXJcbiAgICAgICAgICAgIGZvciAoaSA9IDE7IGkgPCBvcmlnaW5hbEJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWxCbG9ja3NbaV0ubGluZXNbMF0ucGFpcmVkICYmXG4gICAgICAgICAgICAgICAgICAgIGJsb2Nrcy5pbmRleE9mKG9yaWdpbmFsQmxvY2tzW2ldKSA+PSAwXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBqID0gaTtcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKGJsb2Nrcy5pbmRleE9mKG9yaWdpbmFsQmxvY2tzW2ogLSAxXSkgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBmaW5kIHRoZSBwYWlyZWQgZGlzdHJhY3RvciBvciBzb2x1dGlvbiBibG9jayBpdCB3aWxsIGJlIG5leHQgdG9cbiAgICAgICAgICAgICAgICAgICAgICAgIGotLTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXhUbyA9IGJsb2Nrcy5pbmRleE9mKG9yaWdpbmFsQmxvY2tzW2ogLSAxXSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpbmRleEZyb20gPSBibG9ja3MuaW5kZXhPZihvcmlnaW5hbEJsb2Nrc1tpXSk7XG4gICAgICAgICAgICAgICAgICAgIGJsb2Nrcy5zcGxpY2UoaW5kZXhGcm9tLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgYmxvY2tzLnNwbGljZShpbmRleFRvLCAwLCBvcmlnaW5hbEJsb2Nrc1tpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBibG9ja3M7XG4gICAgfVxuICAgIC8vIFJldHVybiBhIGNvZGVibG9jayB0aGF0IGNvcnJlc3BvbmRzIHRvIHRoZSBoYXNoXG4gICAgYmxvY2tGcm9tSGFzaChoYXNoKSB7XG4gICAgICAgIHZhciBzcGxpdCA9IGhhc2guc3BsaXQoXCJfXCIpO1xuICAgICAgICB2YXIgbGluZXMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzcGxpdC5sZW5ndGggLSAxOyBpKyspIHtcbiAgICAgICAgICAgIGxpbmVzLnB1c2godGhpcy5saW5lc1tzcGxpdFtpXV0pO1xuICAgICAgICB9XG4gICAgICAgIHZhciBibG9jayA9IG5ldyBQYXJzb25zQmxvY2sodGhpcywgbGluZXMpO1xuICAgICAgICBpZiAodGhpcy5ub2luZGVudCkge1xuICAgICAgICAgICAgYmxvY2suaW5kZW50ID0gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGJsb2NrLmluZGVudCA9IE51bWJlcihzcGxpdFtzcGxpdC5sZW5ndGggLSAxXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGJsb2NrO1xuICAgIH1cbiAgICAvLyBSZXR1cm4gYW4gYXJyYXkgb2YgY29kZWJsb2NrcyB0aGF0IGNvcnJlc3BvbmRzIHRvIHRoZSBoYXNoXG4gICAgYmxvY2tzRnJvbUhhc2goaGFzaCkge1xuICAgICAgICB2YXIgc3BsaXQ7XG4gICAgICAgIGlmIChoYXNoID09PSBcIi1cIiB8fCBoYXNoID09PSBcIlwiIHx8IGhhc2ggPT09IG51bGwpIHtcbiAgICAgICAgICAgIHNwbGl0ID0gW107XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzcGxpdCA9IGhhc2guc3BsaXQoXCItXCIpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBibG9ja3MgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzcGxpdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYmxvY2tzLnB1c2godGhpcy5ibG9ja0Zyb21IYXNoKHNwbGl0W2ldKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5hZGFwdGl2ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYWRhcHRCbG9ja3MoYmxvY2tzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBibG9ja3M7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBDb2RlVGFpbG9yOiBSZXR1cm4gYSBsaXN0IG9mIGJsb2NrcyB3aXRoIHBsYWNlaG9sZGVycyB0aGF0IHNob3VsZCBiZSBwcm92aWRlZCBpbiB0aGUgYW5zd2VyIGFyZWEuXG4gICAgc2V0dGxlZEJsb2Nrc0Zyb21Tb3VyY2UoKSB7XG4gICAgICAgIHZhciBibG9ja3MgPSBbXTtcbiAgICAgICAgdmFyIGxpbmVzID0gW107XG4gICAgICAgIHZhciBhbnN3ZXJCbG9ja3NDb3VudCA9IDA7XG4gICAgICAgIHZhciBsaW5lLCBpO1xuICAgICAgICB2YXIgc2V0dGxlZEJsb2Nrc0JlZm9yZUNvdW50ID0gMDtcbiAgICAgICAgdmFyIHByZXZTZXR0bGVkQmxvY2sgPSB1bmRlZmluZWQ7XG4gICAgICAgIHZhciBwcmV2UGxhY2Vob2xkZXJTaXplID0gMDtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5saW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGluZSA9IHRoaXMubGluZXNbaV07XG4gICAgICAgICAgICBsaW5lcy5wdXNoKGxpbmUpO1xuICAgICAgICAgICAgaWYgKCFsaW5lLmdyb3VwV2l0aE5leHQpIHtcbiAgICAgICAgICAgICAgICBpZiAobGluZS5pc1BsYWNlaG9sZGVyTGluZSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBmb3VuZCBhIHBsYWNlaG9sZGVyIGxpbmUuIGEgcGxhY2Vob2xkZXIgbGluZSBoYXMgYXQgbGVhc3Qgb25lIG5vcm1hbCBibG9jayBiZWZvcmUgaXQuXG4gICAgICAgICAgICAgICAgICAgIC8vIGFsc28gYSBwbGFjZWhvbGRlciBsaW5lIGFsd2F5cyBoYXMgXCJncm91cFdpdGhOZXh0XCIgZmFsc2UuXG4gICAgICAgICAgICAgICAgICAgIGJsb2Nrcy5wdXNoKFxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFBsYWNlaG9sZGVyQmxvY2soXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5lcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbnN3ZXJCbG9ja3NDb3VudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXR0bGVkQmxvY2tzQmVmb3JlQ291bnQsXG4gICAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAvLyB1cGRhdGUgdGhlIG51bWJlciBvZiBibG9ja3MgbWlzc2luZyBmb3IgdGhlIHNldHRsZWQgYmxvY2sgYWJvdmVcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByZXZTZXR0bGVkQmxvY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZXZTZXR0bGVkQmxvY2suc2V0QmxvY2tzQWZ0ZXIoYW5zd2VyQmxvY2tzQ291bnQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vIHNhdmUgdGhlIGN1cnJlbnQgbnVtYmVyIG9mIGFuc3dlciBibG9ja3MgdG8gdXBkYXRlIHRoZSB0b29sdGlwIGZvciB0aGUgc2V0dGxlZCBibG9jayBiZWxvd1xuICAgICAgICAgICAgICAgICAgICBwcmV2UGxhY2Vob2xkZXJTaXplID0gYW5zd2VyQmxvY2tzQ291bnQ7XG4gICAgICAgICAgICAgICAgICAgIC8vIHJlc2V0IGFuc3dlciBibG9jayBjb3VudFxuICAgICAgICAgICAgICAgICAgICBhbnN3ZXJCbG9ja3NDb3VudCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGxpbmVzID0gW107XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChsaW5lLmlzU2V0dGxlZCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYmxvY2tzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZpcnN0QmxvY2tTZXR0bGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB2YXIgc2V0ID0gbmV3IFNldHRsZWRCbG9jayh0aGlzLCBsaW5lcyk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5ub2luZGVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0LmluZGVudCA9IGxpbmVzWzBdLmluZGVudDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInNldHRsZWQgYmxvY2sgc2V0XCIsIHNldCk7XG4gICAgICAgICAgICAgICAgICAgIGJsb2Nrcy5wdXNoKHNldCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwcmV2UGxhY2Vob2xkZXJTaXplID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0LnNldEJsb2Nrc0JlZm9yZShwcmV2UGxhY2Vob2xkZXJTaXplKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBwcmV2U2V0dGxlZEJsb2NrID0gc2V0O1xuICAgICAgICAgICAgICAgICAgICBzZXR0bGVkQmxvY2tzQmVmb3JlQ291bnQrKztcbiAgICAgICAgICAgICAgICAgICAgYW5zd2VyQmxvY2tzQ291bnQgPSAwO1xuICAgICAgICAgICAgICAgICAgICBsaW5lcyA9IFtdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghbGluZXNbMF0uZGlzdHJhY3Rvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgYW5zd2VyQmxvY2tzQ291bnQrKztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBsaW5lcyA9IFtdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoYmxvY2tzLmxlbmd0aCA+IDAgJiYgYmxvY2tzW2Jsb2Nrcy5sZW5ndGggLSAxXS5pc1NldHRsZWQpIHtcbiAgICAgICAgICAgIHRoaXMubGFzdEJsb2NrU2V0dGxlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coXCJzZXR0bGVkYmxvY2tzZnJvbXNvdXJjZVwiLCBibG9ja3MpO1xuICAgICAgICByZXR1cm4gYmxvY2tzO1xuICAgIH1cblxuICAgIC8vIFJldHVybiBhIGJsb2NrIG9iamVjdCBieSB0aGUgZnVsbCBpZCBpbmNsdWRpbmcgaWQgcHJlZml4XG4gICAgZ2V0QmxvY2tCeUlkKGlkKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5ibG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBibG9jayA9IHRoaXMuYmxvY2tzW2ldO1xuICAgICAgICAgICAgaWYgKGJsb2NrLnZpZXcuaWQgPT0gaWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYmxvY2s7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgLy8gUmV0dXJuIGFycmF5IG9mIGNvZGVibG9ja3MgdGhhdCBhcmUgdGhlIHNvbHV0aW9uXG4gICAgc29sdXRpb25CbG9ja3MoKSB7XG4gICAgICAgIHZhciBzb2x1dGlvbkJsb2NrcyA9IFtdO1xuICAgICAgICB2YXIgc29sdXRpb25MaW5lcyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5saW5lc1tpXS5kaXN0cmFjdG9yKSB7XG4gICAgICAgICAgICAgICAgc29sdXRpb25MaW5lcy5wdXNoKHRoaXMubGluZXNbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciBibG9jayA9IHNvbHV0aW9uTGluZXNbMF0uYmxvY2soKTtcbiAgICAgICAgc29sdXRpb25CbG9ja3MucHVzaChibG9jayk7XG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgc29sdXRpb25MaW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIG5leHRCbG9jayA9IHNvbHV0aW9uTGluZXNbaV0uYmxvY2soKTtcbiAgICAgICAgICAgIGlmIChibG9jayAhPT0gbmV4dEJsb2NrKSB7XG4gICAgICAgICAgICAgICAgYmxvY2sgPSBuZXh0QmxvY2s7XG4gICAgICAgICAgICAgICAgc29sdXRpb25CbG9ja3MucHVzaChibG9jayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNvbHV0aW9uQmxvY2tzO1xuICAgIH1cbiAgICAvLyBSZXR1cm4gYXJyYXkgb2YgY29kZWJsb2NrcyBiYXNlZCBvbiB3aGF0IGlzIGluIHRoZSBzb3VyY2UgZmllbGRcbiAgICBzb3VyY2VCbG9ja3MoKSB7XG4gICAgICAgIHZhciBzb3VyY2VCbG9ja3MgPSBbXTtcbiAgICAgICAgdmFyIGNoaWxkcmVuID0gdGhpcy5zb3VyY2VBcmVhLmNoaWxkcmVuO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgY2hpbGQgPSBjaGlsZHJlbltpXTtcbiAgICAgICAgICAgIGlmIChjaGlsZC5jbGFzc0xpc3QuY29udGFpbnMoXCJibG9ja1wiKSkge1xuICAgICAgICAgICAgICAgIHNvdXJjZUJsb2Nrcy5wdXNoKHRoaXMuZ2V0QmxvY2tCeUlkKGNoaWxkLmlkKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNvdXJjZUJsb2NrcztcbiAgICB9XG4gICAgLy8gUmV0dXJuIGFycmF5IG9mIGVuYWJsZWQgY29kZWJsb2NrcyBiYXNlZCBvbiB3aGF0IGlzIGluIHRoZSBzb3VyY2UgZmllbGRcbiAgICBlbmFibGVkU291cmNlQmxvY2tzKCkge1xuICAgICAgICB2YXIgYWxsID0gdGhpcy5zb3VyY2VCbG9ja3MoKTtcbiAgICAgICAgdmFyIGVuYWJsZWQgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhbGwubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBibG9jayA9IGFsbFtpXTtcbiAgICAgICAgICAgIGlmIChibG9jay5lbmFibGVkKCkpIHtcbiAgICAgICAgICAgICAgICBlbmFibGVkLnB1c2goYmxvY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlbmFibGVkO1xuICAgIH1cbiAgICAvLyBSZXR1cm4gYXJyYXkgb2YgY29kZWJsb2NrcyBiYXNlZCBvbiB3aGF0IGlzIGluIHRoZSBhbnN3ZXIgZmllbGRcbiAgICBhbnN3ZXJCbG9ja3MoKSB7XG4gICAgICAgIHZhciBhbnN3ZXJCbG9ja3MgPSBbXTtcbiAgICAgICAgdmFyIGNoaWxkcmVuID0gdGhpcy5hbnN3ZXJBcmVhLmNoaWxkTm9kZXM7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBibG9jayA9IHRoaXMuZ2V0QmxvY2tCeUlkKGNoaWxkcmVuW2ldLmlkKTtcbiAgICAgICAgICAgIGlmIChibG9jayAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgYW5zd2VyQmxvY2tzLnB1c2goYmxvY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhbnN3ZXJCbG9ja3M7XG4gICAgfVxuICAgIC8vIFJldHVybiBhcnJheSBvZiBlbmFibGVkIGNvZGVibG9ja3MgYmFzZWQgb24gd2hhdCBpcyBpbiB0aGUgYW5zd2VyIGZpZWxkXG4gICAgZW5hYmxlZEFuc3dlckJsb2NrcygpIHtcbiAgICAgICAgdmFyIGFsbCA9IHRoaXMuYW5zd2VyQmxvY2tzKCk7XG4gICAgICAgIHZhciBlbmFibGVkID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYWxsLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgYmxvY2sgPSBhbGxbaV07XG4gICAgICAgICAgICBpZiAoYmxvY2suZW5hYmxlZCgpKSB7XG4gICAgICAgICAgICAgICAgZW5hYmxlZC5wdXNoKGJsb2NrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZW5hYmxlZDtcbiAgICB9XG4gICAgLy8gUmV0dXJuIGFycmF5IG9mIGNvZGVsaW5lcyBiYXNlZCBvbiB3aGF0IGlzIGluIHRoZSBhbnN3ZXIgZmllbGRcbiAgICBhbnN3ZXJMaW5lcygpIHtcbiAgICAgICAgdmFyIGFuc3dlckxpbmVzID0gW107XG4gICAgICAgIHZhciBibG9ja3MgPSB0aGlzLmFuc3dlckJsb2NrcygpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGJsb2NrID0gYmxvY2tzW2ldO1xuICAgICAgICAgICAgaWYgKCFibG9jay5pc1BsYWNlaG9sZGVyKSB7XG4gICAgICAgICAgICAgICAgLy8gQ29kZVRhaWxvcjogYWRkaW5nIG5vbiBwbGFjZWhvbGRlciBibG9ja1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgYmxvY2subGluZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgYW5zd2VyTGluZXMucHVzaChibG9jay5saW5lc1tqXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhbnN3ZXJMaW5lcztcbiAgICB9XG4gICAgLy8gR28gdXAgdGhlIGhpZXJhcmNoeSB1bnRpbCB5b3UgZ2V0IHRvIGEgYmxvY2s7IHJldHVybiB0aGF0IGJsb2NrIGVsZW1lbnRcbiAgICBnZXRCbG9ja0ZvcihlbGVtZW50KSB7XG4gICAgICAgIHZhciBjaGVjayA9IGVsZW1lbnQ7XG4gICAgICAgIHdoaWxlICghY2hlY2suY2xhc3NMaXN0LmNvbnRhaW5zKFwiYmxvY2tcIikpIHtcbiAgICAgICAgICAgIGNoZWNrID0gY2hlY2sucGFyZW50RWxlbWVudDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2hlY2s7XG4gICAgfVxuICAgIC8vIFJldHVybiB0aGUgbWF4aW11bSBpbmRlbnQgZm9yIHRoZSBzb2x1dGlvblxuICAgIHNvbHV0aW9uSW5kZW50KCkge1xuICAgICAgICB2YXIgaW5kZW50ID0gMDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGJsb2NrID0gdGhpcy5ibG9ja3NbaV07XG4gICAgICAgICAgICBpbmRlbnQgPSBNYXRoLm1heChpbmRlbnQsIGJsb2NrLnNvbHV0aW9uSW5kZW50KCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpbmRlbnQ7XG4gICAgfVxuICAgIC8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09PT0gQUNUSU9OID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuICAgIC8vIFRoZSBcIkNoZWNrIE1lXCIgYnV0dG9uIHdhcyBwcmVzc2VkLlxuICAgIGNoZWNrQ3VycmVudEFuc3dlcigpIHtcbiAgICAgICAgaWYgKCF0aGlzLmhhc1NvbHZlZCkge1xuICAgICAgICAgICAgdGhpcy5jaGVja0NvdW50Kys7XG4gICAgICAgICAgICB0aGlzLmNsZWFyRmVlZGJhY2soKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmFkYXB0aXZlSWQgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGFwdGl2ZUlkID0gdGhpcy5zdG9yYWdlSWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBUT0RPIC0gcmVuZGVyaW5nIGZlZWRiYWNrIGlzIGJ1cmllZCBpbiB0aGUgZ3JhZGVyLmdyYWRlIG1ldGhvZC5cbiAgICAgICAgICAgIC8vIHRvIGRpc2FibGUgZmVlZGJhY2sgc2V0IHRoaXMuZ3JhZGVyLnNob3dmZWVkYmFjayBib29sZWFuXG4gICAgICAgICAgICB0aGlzLmdyYWRlci5zaG93ZmVlZGJhY2sgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuZ3JhZGUgPSB0aGlzLmdyYWRlci5ncmFkZSgpO1xuICAgICAgICAgICAgaWYgKHRoaXMuZ3JhZGUgPT0gXCJjb3JyZWN0XCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmhhc1NvbHZlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5jb3JyZWN0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLmNoZWNrQnV0dG9uLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAvLyBDb2RlVGFpbG9yOiBtYWtlIHRoZSBDb3B5IEFuc3dlciBidXR0b24gdmlzaWJsZSB3aGVuIHRoZSBwdXp6bGUgaXMgc29sdmVkXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaGFzU29sdmVkICYmIHRoaXMub3B0aW9ucy5zY2FmZm9sZGluZykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjb3B5QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgICAgICAgICAgICAgICAgIGAjY29weS1hbnN3ZXItYnV0dG9uLSR7dGhpcy5kaXZpZH1gLFxuICAgICAgICAgICAgICAgICAgICApOyAvLyBjb3B5LWFuc3dlci1idXR0b24tJHtwdXp6bGVTY2FmZm9sZGluZ0RpdmlkfVxuICAgICAgICAgICAgICAgICAgICBpZiAoY29weUJ0bikge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29weUJ0bi5jbGFzc0xpc3QucmVtb3ZlKFwiY29weS1idXR0b24taGlkZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0aGlzLmFkYXB0aXZlSWQgKyBcIlNvbHZlZFwiLCB0cnVlKTtcbiAgICAgICAgICAgICAgICB0aGlzLnJlY2VudEF0dGVtcHRzID0gdGhpcy5jaGVja0NvdW50O1xuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkYXB0aXZlSWQgKyBcInJlY2VudEF0dGVtcHRzXCIsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVjZW50QXR0ZW1wdHMsXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFxuICAgICAgICAgICAgICAgIHRoaXMuYWRhcHRpdmVJZCArIHRoaXMuZGl2aWQgKyBcIkNvdW50XCIsXG4gICAgICAgICAgICAgICAgdGhpcy5jaGVja0NvdW50LFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHRoaXMuc2V0TG9jYWxTdG9yYWdlKCk7XG4gICAgICAgICAgICAvLyBpZiBub3Qgc29sdmVkIGFuZCBub3QgdG9vIHNob3J0IHRoZW4gY2hlY2sgaWYgc2hvdWxkIHByb3ZpZGUgaGVscFxuICAgICAgICAgICAgaWYgKCF0aGlzLmhhc1NvbHZlZCAmJiB0aGlzLmdyYWRlICE9PSBcImluY29ycmVjdFRvb1Nob3J0XCIpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jYW5IZWxwKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIG9ubHkgY291bnQgdGhlIGF0dGVtcHQgaWYgdGhlIGFuc3dlciBpcyBkaWZmZXJlbnQgKHRvIHByZXZlbnQgZ2FtaW5nKVxuICAgICAgICAgICAgICAgICAgICB2YXIgYW5zd2VySGFzaCA9IHRoaXMuYW5zd2VySGFzaCgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5sYXN0QW5zd2VySGFzaCAhPT0gYW5zd2VySGFzaCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5udW1EaXN0aW5jdCsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sYXN0QW5zd2VySGFzaCA9IGFuc3dlckhhc2g7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGltZSB0byBvZmZlciBoZWxwXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm51bURpc3RpbmN0ID09IDMgJiYgIXRoaXMuZ290SGVscCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wZW5kaW5nSGVscE1lc3NhZ2UgPSB0KFwibXNnX3BhcnNvbl9oZWxwX2luZm9cIik7XG4gICAgICAgICAgICAgICAgICAgIH0gLy8gZW5kIGlmXG4gICAgICAgICAgICAgICAgfSAvLyBlbmQgaWYgY2FuIGhlbHBcbiAgICAgICAgICAgIH0gLy8gZW5kIGlmIG5vdCBzb2x2ZWRcbiAgICAgICAgfSAvLyBlbmQgb3V0ZXIgaWYgbm90IHNvbHZlZFxuXG4gICAgICAgIC8vIGlmIG5vdyBvciBwcmV2aW91cyB3YXMgY29ycmVjdCwgZGlzcGxheSBydW5uYWJsZVxuICAgICAgICBpZiAodGhpcy5oYXNTb2x2ZWQgJiYgdGhpcy5vcHRpb25zLnJ1bm5hYmxlKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMucnVubmFibGVEaXYpXG4gICAgICAgICAgICAgICAgdGhpcy5nZW5lcmF0ZVJ1bmFibGVWZXJzaW9uKCk7IC8vcmV2ZWFsIFwicmVzZXRcIiBydW5uYWJsZVxuICAgICAgICAgICAgZWxzZSB0aGlzLnJ1bm5hYmxlRGl2LnN0eWxlLmRpc3BsYXkgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gQ29udmVyIHRoZSBwYXJzb25zLXJ1bm5hYmxlIGludG8gYW4gYWN0aXZlY29kZSBhbmQgZGlzcGxheSBpdFxuICAgIGdlbmVyYXRlUnVuYWJsZVZlcnNpb24oKSB7XG4gICAgICAgIHRoaXMucnVubmFibGVEaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmRpdmlkICsgXCItcnVubmFibGVcIik7XG4gICAgICAgIHRoaXMucnVubmFibGVEaXYuc3R5bGUuZGlzcGxheSA9IG51bGw7XG5cbiAgICAgICAgbGV0IHBhcnNvbnNUZXh0ID0gXCJcIjtcbiAgICAgICAgZm9yIChsZXQgYiBvZiB0aGlzLmFuc3dlckJsb2NrcygpKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBsIG9mIGIubGluZXMpIHtcbiAgICAgICAgICAgICAgICBwYXJzb25zVGV4dCArPSBcIiAgICBcIi5yZXBlYXQobC5pbmRlbnQpICsgbC50ZXh0ICsgXCJcXG5cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBwYXJzb25zVGV4dCA9IHBhcnNvbnNUZXh0LnNsaWNlKDAsIC0xKTsgLy8gcmVtb3ZlIGxhc3QgbmV3bGluZVxuXG4gICAgICAgIGNvbnN0IHRleHRFbCA9IHRoaXMucnVubmFibGVEaXYucXVlcnlTZWxlY3RvcihcInRleHRhcmVhXCIpO1xuICAgICAgICB0ZXh0RWwuaW5uZXJIVE1MID0gdGV4dEVsLmlubmVySFRNTC5yZXBsYWNlKFxuICAgICAgICAgICAgXCI9PVBBUlNPTlNDT0RFPT1cIixcbiAgICAgICAgICAgIHBhcnNvbnNUZXh0LFxuICAgICAgICApO1xuXG4gICAgICAgIC8vIGRhdGEtY29tcG9uZW50PVwicGFyc29ucy1ydW5uYWJsZVwiIG1hcmtzIGl0IGFzIHdhaXRpbmcgdG8gYmUgdHVybmVkIGludG8gYW4gYWN0aXZlY29kZVxuICAgICAgICBjb25zdCBhY3RpdmVDb2RlVG9CZSA9IHRoaXMucnVubmFibGVEaXYucXVlcnlTZWxlY3RvcihcbiAgICAgICAgICAgICdbZGF0YS1jb21wb25lbnQ9XCJwYXJzb25zLXJ1bm5hYmxlXCJdJyxcbiAgICAgICAgKTtcbiAgICAgICAgYWN0aXZlQ29kZVRvQmUuZGF0YXNldC5jb21wb25lbnQgPSBcImFjdGl2ZWNvZGVcIjtcblxuICAgICAgICB3aW5kb3cucnVuZXN0b25lQ29tcG9uZW50cy5yZW5kZXJPbmVDb21wb25lbnQodGhpcy5ydW5uYWJsZURpdik7XG4gICAgfVxuXG4gICAgcmVuZGVyRmVlZGJhY2soKSB7XG4gICAgICAgIHRoaXMuZ3JhZGVyLnNob3dmZWVkYmFjayA9IHRydWU7XG4gICAgICAgIHRoaXMuZ3JhZGUgPSB0aGlzLmdyYWRlci5ncmFkZXJTdGF0ZTtcbiAgICAgICAgdmFyIGFuc3dlckFyZWEgPSB0aGlzLmFuc3dlckFyZWE7XG5cbiAgICAgICAgLy8gV2hlbiBmZWVkYmFjayBpcyBzdXBwcmVzc2VkIHRoZSBtZXNzYWdlcyBhcmUgc2ltcGx5IG5vdCB3cml0dGVuLlxuICAgICAgICB2YXIgZmVlZGJhY2tBcmVhID0gdGhpcy5zaG93ZmVlZGJhY2sgPT09IHRydWUgPyB0aGlzLm1lc3NhZ2VEaXYgOiBudWxsO1xuICAgICAgICB2YXIgc2V0RmVlZGJhY2sgPSAoY2xhc3NOYW1lLCBtZXNzYWdlKSA9PiB7XG4gICAgICAgICAgICBpZiAoZmVlZGJhY2tBcmVhKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaGVscE1lc3NhZ2UgPSB0aGlzLnBlbmRpbmdIZWxwTWVzc2FnZTtcbiAgICAgICAgICAgICAgICB0aGlzLnBlbmRpbmdIZWxwTWVzc2FnZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dNZXNzYWdlKFxuICAgICAgICAgICAgICAgICAgICBoZWxwTWVzc2FnZSA/IGAke21lc3NhZ2V9ICR7aGVscE1lc3NhZ2V9YCA6IG1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZSxcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGlmICh0aGlzLmdyYWRlID09PSBcImNvcnJlY3RcIikge1xuICAgICAgICAgICAgYW5zd2VyQXJlYS5jbGFzc0xpc3QuYWRkKFwiY29ycmVjdFwiKTtcbiAgICAgICAgICAgIHRoaXMubWVzc2FnZURpdi5zdHlsZS52aXNpYmlsaXR5ID0gXCJ2aXNpYmxlXCI7XG4gICAgICAgICAgICBsZXQgbWVzc2FnZSA9XG4gICAgICAgICAgICAgICAgdGhpcy5jaGVja0NvdW50ID4gMVxuICAgICAgICAgICAgICAgICAgICA/IHQoXCJtc2dfcGFyc29uX2NvcnJlY3RcIiwgdGhpcy5jaGVja0NvdW50KVxuICAgICAgICAgICAgICAgICAgICA6IHQoXCJtc2dfcGFyc29uX2NvcnJlY3RfZmlyc3RfdHJ5XCIpO1xuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5ydW5uYWJsZSlcbiAgICAgICAgICAgICAgICBtZXNzYWdlICs9IFwiIFwiICsgdChcIm1zZ19wYXJzb25fY29ycmVjdF9ydW5uYWJsZVwiKTtcbiAgICAgICAgICAgIHNldEZlZWRiYWNrKFwiYWxlcnQgYWxlcnQtaW5mb1wiLCBtZXNzYWdlKTtcbiAgICAgICAgICAgIC8vIFNob3cgYmxvY2sgZXhwbGFuYXRpb25zIGFmdGVyIHNvbHZpbmdcbiAgICAgICAgICAgIHRoaXMuc2hvd0Jsb2NrRXhwbGFuYXRpb25zKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5ncmFkZSA9PT0gXCJpbmNvcnJlY3RUb29TaG9ydFwiKSB7XG4gICAgICAgICAgICAvLyB0b28gbGl0dGxlIGNvZGVcbiAgICAgICAgICAgIGFuc3dlckFyZWEuY2xhc3NMaXN0LmFkZChcImluY29ycmVjdFwiKTtcbiAgICAgICAgICAgIHRoaXMubWVzc2FnZURpdi5zdHlsZS52aXNpYmlsaXR5ID0gXCJ2aXNpYmxlXCI7XG4gICAgICAgICAgICBzZXRGZWVkYmFjayhcImFsZXJ0IGFsZXJ0LWRhbmdlclwiLCB0KFwibXNnX3BhcnNvbl90b29fc2hvcnRcIikpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZ3JhZGUgPT09IFwiaW5jb3JyZWN0SW5kZW50XCIpIHtcbiAgICAgICAgICAgIHZhciBpbmNvcnJlY3RCbG9ja3MgPSBbXTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5ncmFkZXIuaW5kZW50TGVmdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGJsb2NrID0gdGhpcy5ncmFkZXIuaW5kZW50TGVmdFtpXS5ibG9jaygpO1xuICAgICAgICAgICAgICAgIGlmIChpbmNvcnJlY3RCbG9ja3MuaW5kZXhPZihibG9jaykgPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5jb3JyZWN0QmxvY2tzLnB1c2goYmxvY2spO1xuICAgICAgICAgICAgICAgICAgICBibG9jay52aWV3LmNsYXNzTGlzdC5hZGQoXCJpbmRlbnRMZWZ0XCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5ncmFkZXIuaW5kZW50UmlnaHQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBibG9jayA9IHRoaXMuZ3JhZGVyLmluZGVudFJpZ2h0W2ldLmJsb2NrKCk7XG4gICAgICAgICAgICAgICAgaWYgKGluY29ycmVjdEJsb2Nrcy5pbmRleE9mKGJsb2NrKSA9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICBpbmNvcnJlY3RCbG9ja3MucHVzaChibG9jayk7XG4gICAgICAgICAgICAgICAgICAgIGJsb2NrLnZpZXcuY2xhc3NMaXN0LmFkZChcImluZGVudFJpZ2h0XCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMubWVzc2FnZURpdi5zdHlsZS52aXNpYmlsaXR5ID0gXCJ2aXNpYmxlXCI7XG4gICAgICAgICAgICBzZXRGZWVkYmFjayhcbiAgICAgICAgICAgICAgICBcImFsZXJ0IGFsZXJ0LWRhbmdlclwiLFxuICAgICAgICAgICAgICAgIGluY29ycmVjdEJsb2Nrcy5sZW5ndGggPT0gMVxuICAgICAgICAgICAgICAgICAgICA/IHQoXCJtc2dfcGFyc29uX3dyb25nX2luZGVudFwiKVxuICAgICAgICAgICAgICAgICAgICA6IHQoXCJtc2dfcGFyc29uX3dyb25nX2luZGVudHNcIiksXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZ3JhZGUgPT09IFwiaW5jb3JyZWN0TW92ZUJsb2Nrc1wiKSB7XG4gICAgICAgICAgICB2YXIgYW5zd2VyQmxvY2tzID0gdGhpcy5hbnN3ZXJCbG9ja3MoKTtcbiAgICAgICAgICAgIHZhciBpblNvbHV0aW9uID0gW107XG4gICAgICAgICAgICB2YXIgaW5Tb2x1dGlvbkluZGV4ZXMgPSBbXTtcbiAgICAgICAgICAgIHZhciBub3RJblNvbHV0aW9uID0gW107XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFuc3dlckJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBibG9jayA9IGFuc3dlckJsb2Nrc1tpXTtcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLnNvbHV0aW9uLmluZGV4T2YoYmxvY2subGluZXNbMF0pO1xuICAgICAgICAgICAgICAgIGlmIChpbmRleCA9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICBub3RJblNvbHV0aW9uLnB1c2goYmxvY2spO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGluU29sdXRpb24ucHVzaChibG9jayk7XG4gICAgICAgICAgICAgICAgICAgIGluU29sdXRpb25JbmRleGVzLnB1c2goaW5kZXgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBsaXNJbmRleGVzID0gdGhpcy5ncmFkZXIuaW52ZXJzZUxJU0luZGljZXMoXG4gICAgICAgICAgICAgICAgaW5Tb2x1dGlvbkluZGV4ZXMsXG4gICAgICAgICAgICAgICAgaW5Tb2x1dGlvbixcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpc0luZGV4ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBub3RJblNvbHV0aW9uLnB1c2goaW5Tb2x1dGlvbltsaXNJbmRleGVzW2ldXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhbnN3ZXJBcmVhLmNsYXNzTGlzdC5hZGQoXCJpbmNvcnJlY3RcIik7XG4gICAgICAgICAgICB0aGlzLm1lc3NhZ2VEaXYuc3R5bGUudmlzaWJpbGl0eSA9IFwidmlzaWJsZVwiO1xuICAgICAgICAgICAgaWYgKHRoaXMuc2hvd2ZlZWRiYWNrID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBub3RJblNvbHV0aW9uLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIG5vdEluU29sdXRpb25baV0udmlldy5jbGFzc0xpc3QuYWRkKFwiaW5jb3JyZWN0UG9zaXRpb25cIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2V0RmVlZGJhY2soXCJhbGVydCBhbGVydC1kYW5nZXJcIiwgdChcIm1zZ19wYXJzb25fd3Jvbmdfb3JkZXJcIikpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy51cGRhdGVCbG9ja0FyaWFMYWJlbHMoKTtcbiAgICB9XG5cbiAgICAvLyBTaG93IGV4cGxhbmF0aW9ucyBmb3IgYmxvY2tzIGFmdGVyIHRoZSBzdHVkZW50IHNvbHZlcyB0aGUgZXhlcmNpc2VcbiAgICAvLyBVc2VzIHRoZSBzYW1lIHRvb2x0aXAgbWVjaGFuaXNtIGFzIGRpc3RyYWN0b3IgaGVscCB0ZXh0IChob3ZlciB0byBzZWUpXG4gICAgc2hvd0Jsb2NrRXhwbGFuYXRpb25zKCkge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICAhdGhpcy5ibG9ja0V4cGxhbmF0aW9ucyB8fFxuICAgICAgICAgICAgT2JqZWN0LmtleXModGhpcy5ibG9ja0V4cGxhbmF0aW9ucykubGVuZ3RoID09PSAwXG4gICAgICAgICkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaGlkZUJsb2NrRXhwbGFuYXRpb25zKCk7IC8vIGNsZWFyIGFueSBwcmV2aW91c1xuICAgICAgICB2YXIgYW5zd2VyQmxvY2tzID0gdGhpcy5hbnN3ZXJCbG9ja3MoKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhbnN3ZXJCbG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBibG9jayA9IGFuc3dlckJsb2Nrc1tpXTtcbiAgICAgICAgICAgIHZhciBibG9ja0luZGV4ID0gYmxvY2subGluZXNbMF0uaW5kZXg7XG4gICAgICAgICAgICAvLyBUaGUgZXhwbGFuYXRpb24gbWFwIGtleXMgYXJlIGJsb2NrIGluZGljZXMgYXMgdGhleSBhcHBlYXIgaW4gdGhlIG9yaWdpbmFsIHNvdXJjZVxuICAgICAgICAgICAgLy8gVHJ5IG1hdGNoaW5nIGJ5IHRoZSBibG9jaydzIGZpcnN0IGxpbmUgaW5kZXggaW4gdGhlIG9yaWdpbmFsIG9yZGVyXG4gICAgICAgICAgICB2YXIgZXhwbGFuYXRpb24gPSB0aGlzLmJsb2NrRXhwbGFuYXRpb25zW1N0cmluZyhibG9ja0luZGV4KV07XG4gICAgICAgICAgICBpZiAoIWV4cGxhbmF0aW9uKSB7XG4gICAgICAgICAgICAgICAgLy8gQWxzbyB0cnkgYnkgcG9zaXRpb24gaW4gdGhlIGFuc3dlciBhcmVhXG4gICAgICAgICAgICAgICAgZXhwbGFuYXRpb24gPSB0aGlzLmJsb2NrRXhwbGFuYXRpb25zW1N0cmluZyhpKV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZXhwbGFuYXRpb24pIHtcbiAgICAgICAgICAgICAgICAvLyBVc2UgdGhlIHNhbWUgdG9vbHRpcCBhcHByb2FjaCBhcyBkaXN0cmFjdG9yczpcbiAgICAgICAgICAgICAgICAvLyBzZXQgZGF0YS10b2dnbGU9XCJ0b29sdGlwXCIgYW5kIHRpdGxlIGF0dHJpYnV0ZSBmb3IgaG92ZXIgZGlzcGxheVxuICAgICAgICAgICAgICAgIGJsb2NrLnZpZXcuc2V0QXR0cmlidXRlKFwiZGF0YS10b2dnbGVcIiwgXCJ0b29sdGlwXCIpO1xuICAgICAgICAgICAgICAgIGJsb2NrLnZpZXcuc2V0QXR0cmlidXRlKFwidGl0bGVcIiwgZXhwbGFuYXRpb24pO1xuICAgICAgICAgICAgICAgIGJsb2NrLnZpZXcuY2xhc3NMaXN0LmFkZChcImhhcy1leHBsYW5hdGlvblwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJlbW92ZSBhbGwgYmxvY2sgZXhwbGFuYXRpb25zICh0b29sdGlwIGF0dHJpYnV0ZXMpXG4gICAgaGlkZUJsb2NrRXhwbGFuYXRpb25zKCkge1xuICAgICAgICBmb3IgKGNvbnN0IHZpZXcgb2YgdGhpcy5hbnN3ZXJBcmVhLnF1ZXJ5U2VsZWN0b3JBbGwoXG4gICAgICAgICAgICBcIi5oYXMtZXhwbGFuYXRpb25cIixcbiAgICAgICAgKSkge1xuICAgICAgICAgICAgdmlldy5yZW1vdmVBdHRyaWJ1dGUoXCJkYXRhLXRvZ2dsZVwiKTtcbiAgICAgICAgICAgIHZpZXcucmVtb3ZlQXR0cmlidXRlKFwidGl0bGVcIik7XG4gICAgICAgICAgICB2aWV3LnJlbW92ZUF0dHJpYnV0ZShcImRhdGEtb3JpZ2luYWwtdGl0bGVcIik7XG4gICAgICAgICAgICB2aWV3LmNsYXNzTGlzdC5yZW1vdmUoXCJoYXMtZXhwbGFuYXRpb25cIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICA9PT09IEFEQVBUSVZFID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbiAgICAvLyBJbml0aWFsaXplIHRoaXMgcHJvYmxlbSBhcyBhZGFwdGl2ZVxuICAgIC8vICAgIGhlbHBDb3VudCA9IG51bWJlciBvZiBjaGVja3MgYmVmb3JlIGhlbHAgaXMgZ2l2ZW4gKG5lZ2F0aXZlKVxuICAgIC8vICAgIGNhbkhlbHAgPSBib29sZWFuIGFzIHRvIHdoZXRoZXIgaGVscCBjYW4gYmUgcHJvdmlkZWRcbiAgICAvLyAgICBjaGVja0NvdW50ID0gaG93IG1hbnkgdGltZXMgaXQgaGFzIGJlZW4gY2hlY2tlZCBiZWZvcmUgY29ycmVjdFxuICAgIC8vICAgIHVzZXJSYXRpbmcgPSAwLi4xMDAgaG93IGdvb2QgdGhlIHBlcnNvbiBpcyBhdCBzb2x2aW5nIHByb2JsZW1zXG4gICAgaW5pdGlhbGl6ZUFkYXB0aXZlKCkge1xuICAgICAgICB0aGlzLmFkYXB0aXZlSWQgPSBzdXBlci5sb2NhbFN0b3JhZ2VLZXkoKTtcbiAgICAgICAgdGhpcy5jYW5IZWxwID0gdHJ1ZTtcbiAgICAgICAgLy90aGlzLmhlbHBDb3VudCA9IC0zOyAvLyBOdW1iZXIgb2YgY2hlY2tzIGJlZm9yZSBoZWxwIGlzIG9mZmVyZWRcbiAgICAgICAgdGhpcy5jaGVja0NvdW50ID0gMDtcbiAgICAgICAgdGhpcy5udW1EaXN0aW5jdCA9IDA7IC8vIG51bWJlciBvZiBkaXN0aW5jdCBzb2x1dGlvbiBhdHRlbXB0cyAoZGlmZmVyZW50IGZyb20gcHJldmlvdXMpXG4gICAgICAgIHRoaXMuZ290SGVscCA9IGZhbHNlO1xuICAgICAgICAvLyBJbml0aWFsaXplIHRoZSB1c2VyUmF0aW5nXG4gICAgICAgIHZhciBzdG9yYWdlUHJvYmxlbSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMuYWRhcHRpdmVJZCArIFwiUHJvYmxlbVwiKTtcbiAgICAgICAgaWYgKHN0b3JhZ2VQcm9ibGVtID09IHRoaXMuZGl2aWQpIHtcbiAgICAgICAgICAgIC8vIEFscmVhZHkgaW4gdGhpcyBwcm9ibGVtXG4gICAgICAgICAgICB0aGlzLmNoZWNrQ291bnQgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcbiAgICAgICAgICAgICAgICB0aGlzLmFkYXB0aXZlSWQgKyB0aGlzLmRpdmlkICsgXCJDb3VudFwiLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrQ291bnQgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jaGVja0NvdW50ID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIHZhciBjb3VudCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFxuICAgICAgICAgICAgdGhpcy5hZGFwdGl2ZUlkICsgdGhpcy5kaXZpZCArIFwiQ291bnRcIixcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKGNvdW50ID09IHVuZGVmaW5lZCB8fCBjb3VudCA9PSBcIk5hTlwiKSB7XG4gICAgICAgICAgICBjb3VudCA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jaGVja0NvdW50ID0gY291bnQ7XG4gICAgICAgIHRoaXMucmVjZW50QXR0ZW1wdHMgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcbiAgICAgICAgICAgIHRoaXMuYWRhcHRpdmVJZCArIFwicmVjZW50QXR0ZW1wdHNcIixcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKHRoaXMucmVjZW50QXR0ZW1wdHMgPT0gdW5kZWZpbmVkIHx8IHRoaXMucmVjZW50QXR0ZW1wdHMgPT0gXCJOYU5cIikge1xuICAgICAgICAgICAgdGhpcy5yZWNlbnRBdHRlbXB0cyA9IDM7XG4gICAgICAgIH1cbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXG4gICAgICAgICAgICB0aGlzLmFkYXB0aXZlSWQgKyBcInJlY2VudEF0dGVtcHRzXCIsXG4gICAgICAgICAgICB0aGlzLnJlY2VudEF0dGVtcHRzLFxuICAgICAgICApO1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0aGlzLmFkYXB0aXZlSWQgKyBcIlByb2JsZW1cIiwgdGhpcy5kaXZpZCk7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFxuICAgICAgICAgICAgdGhpcy5hZGFwdGl2ZUlkICsgdGhpcy5kaXZpZCArIFwiQ291bnRcIixcbiAgICAgICAgICAgIHRoaXMuY2hlY2tDb3VudCxcbiAgICAgICAgKTtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0odGhpcy5hZGFwdGl2ZUlkICsgXCJTb2x2ZWRcIiwgZmFsc2UpO1xuICAgIH1cbiAgICAvLyBSZXR1cm4gYSBib29sZWFuIG9mIHdoZXRoZXIgdGhlIHVzZXIgbXVzdCBkZWFsIHdpdGggaW5kZW50YXRpb25cbiAgICB1c2VzSW5kZW50YXRpb24oKSB7XG4gICAgICAgIGlmICh0aGlzLm5vaW5kZW50IHx8IHRoaXMuc29sdXRpb25JbmRlbnQoKSA9PSAwKSB7XG4gICAgICAgICAgICAvLyB3YXMgJCh0aGlzLmFuc3dlckFyZWEpLmhhc0NsYXNzKFwiYW5zd2VyXCIpIC0gYmplIGNoYW5nZWRcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIEZpbmQgYSBkaXN0cmFjdG9yIHRvIHJlbW92ZSB0byBtYWtlIHRoZSBwcm9ibGVtIGVhc2llclxuICAgIC8vICAqIHRyeSBmaXJzdCBpbiB0aGUgYW5zd2VyIGFyZWFcbiAgICAvLyAgKiBpZiBub3QsIHRyeSB0aGUgc291cmNlIGFyZWFcbiAgICAvLyAgKiBpZiBub3QsIHJldHVybiB1bmRlZmluZWRcbiAgICBkaXN0cmFjdG9yVG9SZW1vdmUoKSB7XG4gICAgICAgIHZhciBibG9ja3MgPSB0aGlzLmVuYWJsZWRBbnN3ZXJCbG9ja3MoKTtcbiAgICAgICAgdmFyIGJsb2NrO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYmxvY2sgPSBibG9ja3NbaV07XG4gICAgICAgICAgICBpZiAoYmxvY2suaXNEaXN0cmFjdG9yKCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYmxvY2s7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYmxvY2tzID0gdGhpcy5lbmFibGVkU291cmNlQmxvY2tzKCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBibG9jayA9IGJsb2Nrc1tpXTtcbiAgICAgICAgICAgIGlmIChibG9jay5pc0Rpc3RyYWN0b3IoKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBibG9jaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICAvLyBSZXR1cm4gdGhlIG51bWJlciBvZiBibG9ja3MgdGhhdCBleGlzdFxuICAgIG51bWJlck9mQmxvY2tzKGZJbmNsdWRlRGlzdHJhY3RvcnMgPSB0cnVlKSB7XG4gICAgICAgIHZhciBudW1iZXJPZkJsb2NrcyA9IDA7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5ibG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICB0aGlzLmJsb2Nrc1tpXS5lbmFibGVkKCkgJiZcbiAgICAgICAgICAgICAgICAoZkluY2x1ZGVEaXN0cmFjdG9ycyB8fCAhdGhpcy5ibG9ja3NbaV0uaXNEaXN0cmFjdG9yKCkpXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBudW1iZXJPZkJsb2NrcyArPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudW1iZXJPZkJsb2NrcztcbiAgICB9XG4gICAgLy8gUmVtb3ZlIHRoaXMgZGlzdHJhY3RvcnMgdG8gbWFrZSB0aGUgcHJvYmxlbSBlYXNpZXJcbiAgICByZW1vdmVEaXN0cmFjdG9yKGJsb2NrKSB7XG4gICAgICAgIHRoaXMuc2hvd01lc3NhZ2UodChcIm1zZ19wYXJzb25fbm90X3NvbHV0aW9uXCIpKTtcbiAgICAgICAgLy8gU3RvcCBhYmlsaXR5IHRvIHNlbGVjdFxuICAgICAgICBpZiAoYmxvY2subGluZXNbMF0uZGlzdHJhY3RIZWxwdGV4dCkge1xuICAgICAgICAgICAgYmxvY2sudmlldy5zZXRBdHRyaWJ1dGUoXCJkYXRhLXRvZ2dsZVwiLCBcInRvb2x0aXBcIik7XG4gICAgICAgICAgICBibG9jay52aWV3LnNldEF0dHJpYnV0ZShcInRpdGxlXCIsIGJsb2NrLmxpbmVzWzBdLmRpc3RyYWN0SGVscHRleHQpO1xuICAgICAgICB9XG4gICAgICAgIGJsb2NrLmRpc2FibGUoKTtcbiAgICAgICAgLy8gSWYgaW4gYW5zd2VyIGFyZWEsIG1vdmUgdG8gc291cmNlIGFyZWFcbiAgICAgICAgaWYgKCFibG9jay5pblNvdXJjZUFyZWEoKSkge1xuICAgICAgICAgICAgdmFyIHNvdXJjZVJlY3QgPSB0aGlzLnNvdXJjZUFyZWEuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICB2YXIgc3RhcnRYID0gYmxvY2sucGFnZVhDZW50ZXIoKSAtIDE7XG4gICAgICAgICAgICB2YXIgc3RhcnRZID0gYmxvY2sucGFnZVlDZW50ZXIoKTtcbiAgICAgICAgICAgIHZhciBlbmRYID1cbiAgICAgICAgICAgICAgICBzb3VyY2VSZWN0LmxlZnQgKyB3aW5kb3cucGFnZVhPZmZzZXQgKyBzb3VyY2VSZWN0LndpZHRoIC8gMjtcbiAgICAgICAgICAgIHZhciBlbmRZID1cbiAgICAgICAgICAgICAgICBzb3VyY2VSZWN0LnRvcCArXG4gICAgICAgICAgICAgICAgd2luZG93LnBhZ2VZT2Zmc2V0ICtcbiAgICAgICAgICAgICAgICBibG9jay52aWV3LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodCAvIDI7XG4gICAgICAgICAgICB2YXIgc2xpZGVVbmRlckJsb2NrID0gYmxvY2suc2xpZGVVbmRlckJsb2NrKCk7XG4gICAgICAgICAgICBpZiAoc2xpZGVVbmRlckJsb2NrICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBlbmRZICs9XG4gICAgICAgICAgICAgICAgICAgIHNsaWRlVW5kZXJCbG9jay52aWV3LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodCArIDIwO1xuICAgICAgICAgICAgICAgIGVuZFkgKz1cbiAgICAgICAgICAgICAgICAgICAgcGFyc2VJbnQoZ2V0Q29tcHV0ZWRTdHlsZShzbGlkZVVuZGVyQmxvY2sudmlldykudG9wKSB8fCAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICAgICAgYmxvY2sudmlldy5zdHlsZS5ib3JkZXJDb2xvciA9IFwidmFyKC0tYm94Qm9yZGVyQ29sb3IsICMwMDApXCI7XG4gICAgICAgICAgICBibG9jay52aWV3LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwidmFyKC0tYmFja2dyb3VuZCwgI2ZmZilcIjtcbiAgICAgICAgICAgIGFuaW1hdGUoXG4gICAgICAgICAgICAgICAgYmxvY2sudmlldyxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IDEuMCxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246XG4gICAgICAgICAgICAgICAgICAgICAgICBNYXRoLnNxcnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5wb3coZW5kWSAtIHN0YXJ0WSwgMikgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBNYXRoLnBvdyhlbmRYIC0gc3RhcnRYLCAyKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICkgKlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDQgK1xuICAgICAgICAgICAgICAgICAgICAgICAgNTAwLFxuICAgICAgICAgICAgICAgICAgICBzdGFydDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5tb3ZpbmcgPSBibG9jaztcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQubW92aW5nWCA9IHN0YXJ0WDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQubW92aW5nWSA9IHN0YXJ0WTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQudXBkYXRlVmlldygpO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBwcm9ncmVzczogZnVuY3Rpb24gKGEsIHAsIGMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQubW92aW5nWCA9IHN0YXJ0WCAqICgxIC0gcCkgKyBlbmRYICogcDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQubW92aW5nWSA9IHN0YXJ0WSAqICgxIC0gcCkgKyBlbmRZICogcDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQudXBkYXRlVmlldygpO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHRoYXQubW92aW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHRoYXQubW92aW5nWDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGF0Lm1vdmluZ1k7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0LnVwZGF0ZVZpZXcoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdGUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2sudmlldyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IDAuMyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJib3JkZXItY29sb3JcIjogXCIjZDNkM2QzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYmFja2dyb3VuZC1jb2xvclwiOiBcIiNlZmVmZWZcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDEwMDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBibG9jay52aWV3LnN0eWxlLm9wYWNpdHkgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2sudmlldy5zdHlsZS5ib3JkZXJDb2xvciA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBibG9jay52aWV3LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBibG9jay52aWV3LmNsYXNzTGlzdC5hZGQoXCJkaXNhYmxlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGJsb2NrLnZpZXcuc3R5bGUuYm9yZGVyQ29sb3IgPSBcInZhcigtLWJveEJvcmRlckNvbG9yLCAjMDAwKVwiO1xuICAgICAgICAgICAgYmxvY2sudmlldy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcInZhcigtLWJhY2tncm91bmQsICNmZmYpXCI7XG4gICAgICAgICAgICBhbmltYXRlKFxuICAgICAgICAgICAgICAgIGJsb2NrLnZpZXcsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAwLjMsXG4gICAgICAgICAgICAgICAgICAgIFwiYm9yZGVyLWNvbG9yXCI6IFwiI2QzZDNkM1wiLFxuICAgICAgICAgICAgICAgICAgICBcImJhY2tncm91bmQtY29sb3JcIjogXCIjZWZlZmVmXCIsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiAyMDAwLFxuICAgICAgICAgICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2sudmlldy5zdHlsZS5ib3JkZXJDb2xvciA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBibG9jay52aWV3LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gR2l2ZSB0aGUgdXNlciB0aGUgaW5kZW50YXRpb25cbiAgICByZW1vdmVJbmRlbnRhdGlvbigpIHtcbiAgICAgICAgdGhpcy5zaG93TWVzc2FnZSh0KFwibXNnX3BhcnNvbl9wcm92aWRlZF9pbmRlbnRcIikpO1xuICAgICAgICAvLyBNb3ZlIGFuZCByZXNpemUgYmxvY2tzXG4gICAgICAgIHZhciBibG9ja1dpZHRoID0gMjAwO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBsaW5lID0gdGhpcy5saW5lc1tpXTtcbiAgICAgICAgICAgIHZhciBleHBhbmRlZFdpZHRoID1cbiAgICAgICAgICAgICAgICBsaW5lLndpZHRoICsgbGluZS5pbmRlbnQgKiB0aGlzLm9wdGlvbnMucGl4ZWxzUGVySW5kZW50ICsgMzA7XG4gICAgICAgICAgICBibG9ja1dpZHRoID0gTWF0aC5tYXgoYmxvY2tXaWR0aCwgZXhwYW5kZWRXaWR0aCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5udW1iZXJlZCAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGJsb2NrV2lkdGggKz0gMjU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hcmVhV2lkdGggPSBibG9ja1dpZHRoICsgMjI7XG4gICAgICAgIHZhciBibG9jaywgaW5kZW50O1xuICAgICAgICB2YXIgc291cmNlQmxvY2tzID0gdGhpcy5zb3VyY2VCbG9ja3MoKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzb3VyY2VCbG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGJsb2NrID0gc291cmNlQmxvY2tzW2ldO1xuICAgICAgICAgICAgaW5kZW50ID0gYmxvY2suc29sdXRpb25JbmRlbnQoKTtcbiAgICAgICAgICAgIGlmIChpbmRlbnQgPT0gMCkge1xuICAgICAgICAgICAgICAgIGFuaW1hdGUoXG4gICAgICAgICAgICAgICAgICAgIGJsb2NrLnZpZXcsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiBibG9ja1dpZHRoLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogMTAwMCxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBhbmltYXRlKFxuICAgICAgICAgICAgICAgICAgICBibG9jay52aWV3LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBibG9ja1dpZHRoIC0gaW5kZW50ICogdGhpcy5vcHRpb25zLnBpeGVsc1BlckluZGVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicGFkZGluZy1sZWZ0XCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZW50ICogdGhpcy5vcHRpb25zLnBpeGVsc1BlckluZGVudCArIDEwLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogMTAwMCxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wYWlyZWREaXZzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhbmltYXRlKFxuICAgICAgICAgICAgICAgIHRoaXMucGFpcmVkRGl2c1tpXSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiBibG9ja1dpZHRoICsgMzQsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiAxMDAwLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIHZhciBhbnN3ZXJCbG9ja3MgPSB0aGlzLmFuc3dlckJsb2NrcygpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFuc3dlckJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYmxvY2sgPSBhbnN3ZXJCbG9ja3NbaV07XG4gICAgICAgICAgICBpbmRlbnQgPSBibG9jay5zb2x1dGlvbkluZGVudCgpO1xuICAgICAgICAgICAgaWYgKGluZGVudCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgYW5pbWF0ZShcbiAgICAgICAgICAgICAgICAgICAgYmxvY2sudmlldyxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiBibG9ja1dpZHRoLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogMTAwMCxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBhbmltYXRlKFxuICAgICAgICAgICAgICAgICAgICBibG9jay52aWV3LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2tXaWR0aCAtIGluZGVudCAqIHRoaXMub3B0aW9ucy5waXhlbHNQZXJJbmRlbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInBhZGRpbmctbGVmdFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGVudCAqIHRoaXMub3B0aW9ucy5waXhlbHNQZXJJbmRlbnQgKyAxMCxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDEwMDAsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBSZXNpemUgYW5zd2VyIGFuZCBzb3VyY2UgYXJlYVxuICAgICAgICB0aGlzLmFuc3dlckFyZWEuY2xhc3NMaXN0LnJlbW92ZShcbiAgICAgICAgICAgIFwiYW5zd2VyMVwiLFxuICAgICAgICAgICAgXCJhbnN3ZXIyXCIsXG4gICAgICAgICAgICBcImFuc3dlcjNcIixcbiAgICAgICAgICAgIFwiYW5zd2VyNFwiLFxuICAgICAgICApO1xuICAgICAgICB0aGlzLmFuc3dlckFyZWEuY2xhc3NMaXN0LmFkZChcImFuc3dlclwiKTtcbiAgICAgICAgdGhpcy5pbmRlbnQgPSAwO1xuICAgICAgICB0aGlzLm5vaW5kZW50ID0gdHJ1ZTtcbiAgICAgICAgYW5pbWF0ZShcbiAgICAgICAgICAgIHRoaXMuc291cmNlQXJlYSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy5hcmVhV2lkdGggKyAyLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogMTAwMCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICk7XG4gICAgICAgIGFuaW1hdGUoXG4gICAgICAgICAgICB0aGlzLmFuc3dlckFyZWEsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMuYXJlYVdpZHRoICsgMixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZHVyYXRpb246IDEwMDAsXG4gICAgICAgICAgICB9LFxuICAgICAgICApO1xuICAgICAgICAvLyBDaGFuZ2UgdGhlIG1vZGVsICh3aXRoIHZpZXcpIG9uY2UgdGhlIHJlc2l6ZSBhbmltYXRpb25zIGFyZSBkb25lXG4gICAgICAgIGFuaW1hdGUoXG4gICAgICAgICAgICB0aGlzLmFuc3dlckFyZWEsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgb3BhY2l0eTogMS4wLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogMTEwMCxcbiAgICAgICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBVcGRhdGUgdGhlIG1vZGVsXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc291cmNlQmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VCbG9ja3NbaV0uYWRkSW5kZW50KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhbnN3ZXJCbG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuc3dlckJsb2Nrc1tpXS5hZGRJbmRlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICApO1xuICAgIH1cblxuICAgIC8vIGZpcnN0IGNoZWNrIGlmIGFueSBzb2x1dGlvbiBibG9ja3MgYXJlIGluIHRoZSBzb3VyY2Ugc3RpbGwgKGxlZnQgc2lkZSkgYW5kIG5vdFxuICAgIC8vIGluIHRoZSBhbnN3ZXJcbiAgICBnZXRTb2x1dGlvbkJsb2NrSW5Tb3VyY2UoKSB7XG4gICAgICAgIHZhciBzb2x1dGlvbkJsb2NrcyA9IHRoaXMuc29sdXRpb25CbG9ja3MoKTtcbiAgICAgICAgdmFyIGFuc3dlckJsb2NrcyA9IHRoaXMuYW5zd2VyQmxvY2tzKCk7XG4gICAgICAgIHZhciBzb3VyY2VCbG9ja3MgPSB0aGlzLnNvdXJjZUJsb2NrcygpO1xuICAgICAgICB2YXIgc29sQmxvY2sgPSBudWxsO1xuICAgICAgICB2YXIgY3VyckJsb2NrID0gbnVsbDtcblxuICAgICAgICAvLyBsb29wIHRocm91Z2ggc291cmNlQmxvY2tzIGFuZCByZXR1cm4gYSBibG9jayBpZiBpdCBpcyBub3QgaW4gdGhlIHNvbHV0aW9uXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc291cmNlQmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAvLyBnZXQgdGhlIGN1cnJlbnQgYmxvY2sgZnJvbSB0aGUgc291cmNlXG4gICAgICAgICAgICBjdXJyQmxvY2sgPSBzb3VyY2VCbG9ja3NbaV07XG5cbiAgICAgICAgICAgIC8vIGlmIGN1cnJCbG9jayBpcyBpbiB0aGUgc29sdXRpb24gYW5kIGlzbid0IHRoZSBmaXJzdCBibG9jayBhbmQgaXNuJ3QgaW4gdGhlIGFuc3dlclxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIHNvbHV0aW9uQmxvY2tzLmluZGV4T2YoY3VyckJsb2NrKSA+IDAgJiZcbiAgICAgICAgICAgICAgICBhbnN3ZXJCbG9ja3MuaW5kZXhPZihjdXJyQmxvY2spIDwgMFxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGN1cnJCbG9jaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBkaWRuJ3QgZmluZCBhbnkgYmxvY2sgaW4gdGhlIHNvdXJjZSB0aGF0IGlzIGluIHRoZSBzb2x1dGlvblxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBGaW5kIGEgYmxvY2syIHRoYXQgaXMgZnVydGhlc3QgZnJvbSBibG9jazEgaW4gdGhlIGFuc3dlclxuICAgIC8vIGRvbid0IHVzZSB0aGUgdmVyeSBmaXJzdCBibG9jayBpbiB0aGUgc29sdXRpb24gYXMgYmxvY2syXG4gICAgZ2V0RnVydGhlc3RCbG9jaygpIHtcbiAgICAgICAgdmFyIHNvbHV0aW9uQmxvY2tzID0gdGhpcy5zb2x1dGlvbkJsb2NrcygpO1xuICAgICAgICB2YXIgYW5zd2VyQmxvY2tzID0gdGhpcy5hbnN3ZXJCbG9ja3MoKTtcbiAgICAgICAgdmFyIG1heERpc3QgPSAwO1xuICAgICAgICB2YXIgZGlzdCA9IDA7XG4gICAgICAgIHZhciBtYXhCbG9jayA9IG51bGw7XG4gICAgICAgIHZhciBjdXJyQmxvY2sgPSBudWxsO1xuICAgICAgICB2YXIgaW5kZXhTb2wgPSAwO1xuICAgICAgICB2YXIgcHJldkJsb2NrID0gbnVsbDtcbiAgICAgICAgdmFyIGluZGV4UHJldiA9IDA7XG5cbiAgICAgICAgLy8gbG9vcCB0aHJvdWdoIHRoZSBibG9ja3MgaW4gdGhlIGFuc3dlclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFuc3dlckJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY3VyckJsb2NrID0gYW5zd2VyQmxvY2tzW2ldO1xuICAgICAgICAgICAgaW5kZXhTb2wgPSBzb2x1dGlvbkJsb2Nrcy5pbmRleE9mKGN1cnJCbG9jayk7XG4gICAgICAgICAgICBpZiAoaW5kZXhTb2wgPiAwKSB7XG4gICAgICAgICAgICAgICAgcHJldkJsb2NrID0gc29sdXRpb25CbG9ja3NbaW5kZXhTb2wgLSAxXTtcbiAgICAgICAgICAgICAgICBpbmRleFByZXYgPSBhbnN3ZXJCbG9ja3MuaW5kZXhPZihwcmV2QmxvY2spO1xuICAgICAgICAgICAgICAgIC8vIGNhbGN1bGF0ZSB0aGUgZGlzdGFuY2UgaW4gdGhlIGFuc3dlclxuICAgICAgICAgICAgICAgIGRpc3QgPSBNYXRoLmFicyhpIC0gaW5kZXhQcmV2KTtcbiAgICAgICAgICAgICAgICBpZiAoZGlzdCA+IG1heERpc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgbWF4RGlzdCA9IGRpc3Q7XG4gICAgICAgICAgICAgICAgICAgIG1heEJsb2NrID0gY3VyckJsb2NrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWF4QmxvY2s7XG4gICAgfVxuXG4gICAgLy8gQ29tYmluZSBibG9ja3MgdG9nZXRoZXJcbiAgICBjb21iaW5lQmxvY2tzKCkge1xuICAgICAgICB2YXIgc29sdXRpb25CbG9ja3MgPSB0aGlzLnNvbHV0aW9uQmxvY2tzKCk7XG4gICAgICAgIHZhciBhbnN3ZXJCbG9ja3MgPSB0aGlzLmFuc3dlckJsb2NrcygpO1xuICAgICAgICB2YXIgc291cmNlQmxvY2tzID0gdGhpcy5zb3VyY2VCbG9ja3MoKTtcblxuICAgICAgICB0aGlzLnNob3dNZXNzYWdlKHQoXCJtc2dfcGFyc29uX2NvbWJpbmVkX2Jsb2Nrc1wiKSk7XG4gICAgICAgIHZhciBibG9jazEgPSBudWxsO1xuICAgICAgICB2YXIgYmxvY2syID0gbnVsbDtcblxuICAgICAgICAvLyBnZXQgYSBzb2x1dGlvbiBibG9jayB0aGF0IGlzIHN0aWxsIGluIHNvdXJjZSAobm90IGFuc3dlciksIGlmIGFueVxuICAgICAgICBibG9jazIgPSB0aGlzLmdldFNvbHV0aW9uQmxvY2tJblNvdXJjZSgpO1xuXG4gICAgICAgIC8vIGlmIG5vbmUgaW4gc291cmNlIGdldCBibG9jayB0aGF0IGlzIGZ1cnRoZXN0IGZyb20gYmxvY2sxXG4gICAgICAgIGlmIChibG9jazIgPT0gbnVsbCkge1xuICAgICAgICAgICAgYmxvY2syID0gdGhpcy5nZXRGdXJ0aGVzdEJsb2NrKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBnZXQgYmxvY2sxIChhYm92ZSBibG9jazIpIGluIHNvbHV0aW9uXG4gICAgICAgIHZhciBpbmRleCA9IHNvbHV0aW9uQmxvY2tzLmluZGV4T2YoYmxvY2syKTtcbiAgICAgICAgYmxvY2sxID0gc29sdXRpb25CbG9ja3NbaW5kZXggLSAxXTtcblxuICAgICAgICAvLyBnZXQgaW5kZXggb2YgZWFjaCBpbiBhbnN3ZXJcbiAgICAgICAgdmFyIGluZGV4MSA9IGFuc3dlckJsb2Nrcy5pbmRleE9mKGJsb2NrMSk7XG4gICAgICAgIHZhciBpbmRleDIgPSBhbnN3ZXJCbG9ja3MuaW5kZXhPZihibG9jazIpO1xuICAgICAgICB2YXIgbW92ZSA9IGZhbHNlO1xuXG4gICAgICAgIC8vIGlmIGJvdGggaW4gYW5zd2VyIHNldCBtb3ZlIGJhc2VkIG9uIGlmIGRpcmVjdGx5IGFib3ZlIGVhY2ggb3RoZXJcbiAgICAgICAgaWYgKGluZGV4MSA+PSAwICYmIGluZGV4MiA+PSAwKSB7XG4gICAgICAgICAgICBtb3ZlID0gaW5kZXgxICsgMSAhPT0gaW5kZXgyO1xuXG4gICAgICAgICAgICAvLyBlbHNlIGlmIGJvdGggaW4gc291cmNlIHNldCBtb3ZlIGFnYWluIGJhc2VkIG9uIGlmIGFib3ZlIGVhY2ggb3RoZXJcbiAgICAgICAgfSBlbHNlIGlmIChpbmRleDEgPCAwICYmIGluZGV4MiA8IDApIHtcbiAgICAgICAgICAgIGluZGV4MSA9IHNvdXJjZUJsb2Nrcy5pbmRleE9mKGJsb2NrMSk7XG4gICAgICAgICAgICBpbmRleDIgPSBzb3VyY2VCbG9ja3MuaW5kZXhPZihibG9jazIpO1xuICAgICAgICAgICAgbW92ZSA9IGluZGV4MSArIDEgIT09IGluZGV4MjtcblxuICAgICAgICAgICAgLy8gb25lIGluIHNvdXJjZSBhbmQgb25lIGluIGFuc3dlciBzbyBtdXN0IG1vdmVcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1vdmUgPSB0cnVlO1xuICAgICAgICAgICAgaWYgKGluZGV4MSA8IDApIHtcbiAgICAgICAgICAgICAgICBpbmRleDEgPSBzb3VyY2VCbG9ja3MuaW5kZXhPZihibG9jazEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGluZGV4MiA8IDApIHtcbiAgICAgICAgICAgICAgICBpbmRleDIgPSBzb3VyY2VCbG9ja3MuaW5kZXhPZihibG9jazIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHN1YnRyYWN0ID0gaW5kZXgyIDwgaW5kZXgxOyAvLyBpcyBibG9jazIgaGlnaGVyXG5cbiAgICAgICAgaWYgKG1vdmUpIHtcbiAgICAgICAgICAgIC8vIE1vdmUgdGhlIGJsb2NrXG4gICAgICAgICAgICB2YXIgc3RhcnRYID0gYmxvY2syLnBhZ2VYQ2VudGVyKCkgLSAxO1xuICAgICAgICAgICAgdmFyIHN0YXJ0WSA9IGJsb2NrMi5wYWdlWUNlbnRlcigpO1xuICAgICAgICAgICAgdmFyIGVuZFggPSBibG9jazEucGFnZVhDZW50ZXIoKSAtIDE7XG4gICAgICAgICAgICB2YXIgZW5kWSA9XG4gICAgICAgICAgICAgICAgYmxvY2sxLnBhZ2VZQ2VudGVyKCkgK1xuICAgICAgICAgICAgICAgIGJsb2NrMS52aWV3LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodCAvIDIgK1xuICAgICAgICAgICAgICAgIDU7XG4gICAgICAgICAgICBpZiAoc3VidHJhY3QpIHtcbiAgICAgICAgICAgICAgICBlbmRZIC09IGJsb2NrMi52aWV3LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodCAvIDI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGVuZFkgKz0gYmxvY2syLnZpZXcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0IC8gMjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgICAgIGFuaW1hdGUoXG4gICAgICAgICAgICAgICAgYmxvY2syLnZpZXcsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAxLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogMTAwMCwgLy8gMSBzZWNjb25kXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBibG9jazEudmlldy5zdHlsZS5ib3JkZXJDb2xvciA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ2YXIoLS1ib3hCb3JkZXJDb2xvciwgIzAwMClcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrMS52aWV3LnN0eWxlLmJhY2tncm91bmRDb2xvciA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ2YXIoLS1iYWNrZ3JvdW5kLCAjZmZmKVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2syLnZpZXcuc3R5bGUuYm9yZGVyQ29sb3IgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidmFyKC0tYm94Qm9yZGVyQ29sb3IsICMwMDApXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBibG9jazIudmlldy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidmFyKC0tYmFja2dyb3VuZCwgI2ZmZilcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrMi5saW5lc1swXS5pbmRleCArPSAxMDAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5tb3ZpbmcgPSBibG9jazI7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0Lm1vdmluZ1ggPSBzdGFydFg7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0Lm1vdmluZ1kgPSBzdGFydFk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0LnVwZGF0ZVZpZXcoKTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgcHJvZ3Jlc3M6IGZ1bmN0aW9uIChhLCBwLCBjKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0Lm1vdmluZ1ggPSBzdGFydFggKiAoMSAtIHApICsgZW5kWCAqIHA7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0Lm1vdmluZ1kgPSBzdGFydFkgKiAoMSAtIHApICsgZW5kWSAqIHA7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0LnVwZGF0ZVZpZXcoKTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGF0Lm1vdmluZztcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGF0Lm1vdmluZ1g7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgdGhhdC5tb3ZpbmdZO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC51cGRhdGVWaWV3KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBibG9jazIubGluZXNbMF0uaW5kZXggLT0gMTAwMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrMS5jb25zdW1lQmxvY2soYmxvY2syKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdGUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2sxLnZpZXcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImJvcmRlci1jb2xvclwiOiBcIiNkM2QzZDNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJiYWNrZ3JvdW5kLWNvbG9yXCI6IFwiI2VmZWZlZlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogMTAwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrMS52aWV3LnN0eWxlLmJvcmRlckNvbG9yID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrMS52aWV3LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhbmltYXRlKFxuICAgICAgICAgICAgICAgIGJsb2NrMi52aWV3LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogMSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDEwMDAsXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBibG9jazEudmlldy5zdHlsZS5ib3JkZXJDb2xvciA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ2YXIoLS1ib3hCb3JkZXJDb2xvciwgIzAwMClcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrMS52aWV3LnN0eWxlLmJhY2tncm91bmRDb2xvciA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ2YXIoLS1iYWNrZ3JvdW5kLCAjZmZmKVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2syLnZpZXcuc3R5bGUuYm9yZGVyQ29sb3IgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidmFyKC0tYm94Qm9yZGVyQ29sb3IsICMwMDApXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBibG9jazIudmlldy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidmFyKC0tYmFja2dyb3VuZCwgI2ZmZilcIjtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrMS5jb25zdW1lQmxvY2soYmxvY2syKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdGUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2sxLnZpZXcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImJvcmRlci1jb2xvclwiOiBcIiNkM2QzZDNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJiYWNrZ3JvdW5kLWNvbG9yXCI6IFwiI2VmZWZlZlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogMTAwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrMS52aWV3LnN0eWxlLmJvcmRlckNvbG9yID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrMS52aWV3LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gQWRhcHQgdGhlIHByb2JsZW0gdG8gYmUgZWFzaWVyXG4gICAgLy8gICogcmVtb3ZlIGEgZGlzdHJhY3RvciB1bnRpbCBub25lIGFyZSBwcmVzZW50XG4gICAgLy8gICogY29tYmluZSBibG9ja3MgdW50aWwgMyBhcmUgbGVmdFxuICAgIG1ha2VFYXNpZXIoKSB7XG4gICAgICAgIHZhciBkaXN0cmFjdG9yVG9SZW1vdmUgPSB0aGlzLmRpc3RyYWN0b3JUb1JlbW92ZSgpO1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICBkaXN0cmFjdG9yVG9SZW1vdmUgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICAgICAgIWRpc3RyYWN0b3JUb1JlbW92ZS5pblNvdXJjZUFyZWEoKVxuICAgICAgICApIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlRGlzdHJhY3RvcihkaXN0cmFjdG9yVG9SZW1vdmUpO1xuICAgICAgICAgICAgdGhpcy5sb2dNb3ZlKFwicmVtb3ZlZERpc3RyYWN0b3ItXCIgKyBkaXN0cmFjdG9yVG9SZW1vdmUuaGFzaCgpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBudW1iZXJPZkJsb2NrcyA9IHRoaXMubnVtYmVyT2ZCbG9ja3MoZmFsc2UpO1xuICAgICAgICAgICAgaWYgKG51bWJlck9mQmxvY2tzID4gMykge1xuICAgICAgICAgICAgICAgIHRoaXMuY29tYmluZUJsb2NrcygpO1xuICAgICAgICAgICAgICAgIHRoaXMubG9nTW92ZShcImNvbWJpbmVkQmxvY2tzXCIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dNZXNzYWdlKHQoXCJtc2dfcGFyc29uX3RocmVlX2Jsb2Nrc19sZWZ0XCIpKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNhbkhlbHAgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vaWYgKG51bWJlck9mQmxvY2tzIDwgNSkge1xuICAgICAgICAgICAgLy9cdHRoaXMuY2FuSGVscCA9IGZhbHNlO1xuICAgICAgICAgICAgLy9cdHRoaXMuaGVscEJ1dHRvbi5kaXNhYmxlZCA9IHRydWU7XG4gICAgICAgICAgICAvL31cbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBUaGUgXCJIZWxwIE1lXCIgYnV0dG9uIHdhcyBwcmVzc2VkIGFuZCB0aGUgcHJvYmxlbSBzaG91bGQgYmUgc2ltcGxpZmllZFxuICAgIGhlbHBNZSgpIHtcbiAgICAgICAgdGhpcy5jbGVhckZlZWRiYWNrKCk7XG4gICAgICAgIC8vdGhpcy5oZWxwQ291bnQgPSAtMTsgLy8gYW1vdW50IHRvIGFsbG93IGZvciBtdWx0aXBsZSBoZWxwcyBpbiBhIHJvd1xuICAgICAgICAvL2lmICh0aGlzLmhlbHBDb3VudCA8IDApIHtcbiAgICAgICAgLy9cdHRoaXMuaGVscENvdW50ID0gTWF0aC5tYXgodGhpcy5oZWxwQ291bnQsIC0xKTsgLy8gbWluIDEgYXR0ZW1wdCBiZWZvcmUgbW9yZSBoZWxwXG4gICAgICAgIC8vdGhpcy5oZWxwQnV0dG9uLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgLy99XG4gICAgICAgIC8vIGlmIGxlc3MgdGhhbiAzIGF0dGVtcHRzXG4gICAgICAgIGlmICh0aGlzLm51bURpc3RpbmN0IDwgMykge1xuICAgICAgICAgICAgdGhpcy5zaG93TWVzc2FnZSh0KFwibXNnX3BhcnNvbl9hdGxlYXN0X3RocmVlX2F0dGVtcHRzXCIpKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBvdGhlcndpc2UgZ2l2ZSBoZWxwXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5nb3RIZWxwID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMubWFrZUVhc2llcigpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09PT0gVVRJTElUWSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuICAgIC8vIFJldHVybiBhIGRhdGUgZnJvbSBhIHRpbWVzdGFtcCAoZWl0aGVyIG15U1FMIG9yIEpTIGZvcm1hdClcbiAgICBkYXRlRnJvbVRpbWVzdGFtcCh0aW1lc3RhbXApIHtcbiAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSh0aW1lc3RhbXApO1xuICAgICAgICBpZiAoaXNOYU4oZGF0ZS5nZXRUaW1lKCkpKSB7XG4gICAgICAgICAgICB2YXIgdCA9IHRpbWVzdGFtcC5zcGxpdCgvWy0gOl0vKTtcbiAgICAgICAgICAgIGRhdGUgPSBuZXcgRGF0ZSh0WzBdLCB0WzFdIC0gMSwgdFsyXSwgdFszXSwgdFs0XSwgdFs1XSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRhdGU7XG4gICAgfVxuICAgIC8vIEEgZnVuY3Rpb24gZm9yIHJldHVybmluZyBhIHNodWZmbGVkIHZlcnNpb24gb2YgYW4gYXJyYXlcbiAgICBzaHVmZmxlZChhcnJheSkge1xuICAgICAgICB2YXIgY3VycmVudEluZGV4ID0gYXJyYXkubGVuZ3RoO1xuICAgICAgICB2YXIgcmV0dXJuQXJyYXkgPSBhcnJheS5zbGljZSgpO1xuICAgICAgICB2YXIgdGVtcG9yYXJ5VmFsdWUsIHJhbmRvbUluZGV4O1xuICAgICAgICAvLyBXaGlsZSB0aGVyZSByZW1haW4gZWxlbWVudHMgdG8gc2h1ZmZsZS4uLlxuICAgICAgICB3aGlsZSAoMCAhPT0gY3VycmVudEluZGV4KSB7XG4gICAgICAgICAgICAvLyBQaWNrIGEgcmVtYWluaW5nIGVsZW1lbnQuLi5cbiAgICAgICAgICAgIHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY3VycmVudEluZGV4KTtcbiAgICAgICAgICAgIGN1cnJlbnRJbmRleCAtPSAxO1xuICAgICAgICAgICAgLy8gQW5kIHN3YXAgaXQgd2l0aCB0aGUgY3VycmVudCBlbGVtZW50LlxuICAgICAgICAgICAgdGVtcG9yYXJ5VmFsdWUgPSByZXR1cm5BcnJheVtjdXJyZW50SW5kZXhdO1xuICAgICAgICAgICAgcmV0dXJuQXJyYXlbY3VycmVudEluZGV4XSA9IHJldHVybkFycmF5W3JhbmRvbUluZGV4XTtcbiAgICAgICAgICAgIHJldHVybkFycmF5W3JhbmRvbUluZGV4XSA9IHRlbXBvcmFyeVZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXR1cm5BcnJheTtcbiAgICB9XG4gICAgLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT09PSBLRVlCT0FSRCBJTlRFUkFDVElPTiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG4gICAgLy8gV2hlbiB0aGUgdXNlciBoYXMgZW50ZXJlZCB0aGUgUGFyc29ucyBwcm9ibGVtIHZpYSBrZXlib2FyZCBtb2RlXG4gICAgZW50ZXJLZXlib2FyZE1vZGUoKSB7XG4gICAgICAgIHRoaXMua2V5Ym9hcmRUaXAuaW5uZXJIVE1MID0gdChcIm1zZ19wYXJzb25fYXJyb3dfbmF2aWdhdGVcIik7XG4gICAgICAgIHRoaXMua2V5Ym9hcmRUaXAuc3R5bGUuZGlzcGxheSA9IFwiXCI7XG4gICAgICAgIC8vIFRoZSBvbmdvaW5nIG5hdmlnYXRpb24gdGlwIGlzIGEgcXVpZXQgaW5zdHJ1Y3Rpb24sIG5vdCBhIGNhbGwgdG8gYWN0LlxuICAgICAgICB0aGlzLmtleWJvYXJkVGlwLmNsYXNzTGlzdC5yZW1vdmUoXCJwYXJzb25zLWVudHJ5LWhpbnRcIik7XG4gICAgICAgIHRoaXMuc291cmNlTGFiZWwuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICB0aGlzLmFuc3dlckxhYmVsLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICB9XG4gICAgc3RhcnRLZXlib2FyZEludGVyYWN0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5rZXlib2FyZElucHV0QWN0aXZlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYmxvY2sgPVxuICAgICAgICAgICAgdGhpcy5lbmFibGVkQW5zd2VyQmxvY2tzKCkuZmluZCgoaXRlbSkgPT5cbiAgICAgICAgICAgICAgICB0aGlzLmlzSW5jb3JyZWN0QmxvY2soaXRlbSksXG4gICAgICAgICAgICApIHx8XG4gICAgICAgICAgICB0aGlzLmVuYWJsZWRTb3VyY2VCbG9ja3MoKVswXSB8fFxuICAgICAgICAgICAgdGhpcy5lbmFibGVkQW5zd2VyQmxvY2tzKClbMF07XG4gICAgICAgIGlmICghYmxvY2spIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVudGVyS2V5Ym9hcmRNb2RlKCk7XG4gICAgICAgIHRoaXMudGV4dEZvY3VzID0gYmxvY2s7XG4gICAgICAgIHRoaXMudGV4dE1vdmUgPSBmYWxzZTtcbiAgICAgICAgYmxvY2subWFrZVRhYkluZGV4KCk7XG4gICAgICAgIGJsb2NrLnZpZXcuY2xhc3NMaXN0LmFkZChcImRvd25cIik7XG4gICAgICAgIHRoaXMuZW50ZXJLZXlib2FyZE5hdmlnYXRpb25Nb2RlKGJsb2NrLCB0cnVlKTtcbiAgICB9XG5cbiAgICBlbnRlcktleWJvYXJkTmF2aWdhdGlvbk1vZGUoYmxvY2ssIGluY2x1ZGVJbnN0cnVjdGlvbnMgPSBmYWxzZSkge1xuICAgICAgICB0aGlzLmtleWJvYXJkSW5wdXRBY3RpdmUgPSB0cnVlO1xuICAgICAgICBjb25zdCBsYWJlbCA9IFtcbiAgICAgICAgICAgIHQoXCJtc2dfcGFyc29uX2tleWJvYXJkX3NlbGVjdGVkXCIsIHRoaXMuZ2V0QmxvY2tMYWJlbChibG9jaykpLFxuICAgICAgICBdO1xuICAgICAgICBpZiAodGhpcy5pc0luY29ycmVjdEJsb2NrKGJsb2NrKSkge1xuICAgICAgICAgICAgbGFiZWwucHVzaCh0KFwibXNnX3BhcnNvbl9pbmNvcnJlY3RcIikpO1xuICAgICAgICB9XG4gICAgICAgIGxhYmVsLnB1c2godGhpcy5nZXRLZXlib2FyZEJsb2NrTG9jYXRpb24oYmxvY2spKTtcbiAgICAgICAgdGhpcy5rZXlib2FyZEFwcGxpY2F0aW9uLnNldEF0dHJpYnV0ZShcbiAgICAgICAgICAgIFwiYXJpYS1sYWJlbFwiLFxuICAgICAgICAgICAgaW5jbHVkZUluc3RydWN0aW9uc1xuICAgICAgICAgICAgICAgID8gdChcIm1zZ19wYXJzb25fa2V5Ym9hcmRfaW5zdHJ1Y3Rpb25zXCIpICsgXCIgXCIgKyBsYWJlbC5qb2luKFwiLiBcIilcbiAgICAgICAgICAgICAgICA6IGxhYmVsLmpvaW4oXCIuIFwiKSxcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5rZXlib2FyZEFwcGxpY2F0aW9uLmZvY3VzKCk7XG4gICAgfVxuXG4gICAgZW50ZXJLZXlib2FyZE1vdmVtZW50TW9kZShibG9jaykge1xuICAgICAgICB0aGlzLmtleWJvYXJkTW92ZW1lbnRNb2RlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5rZXlib2FyZElucHV0QWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5rZXlib2FyZEFwcGxpY2F0aW9uLnNldEF0dHJpYnV0ZShcbiAgICAgICAgICAgIFwiYXJpYS1sYWJlbFwiLFxuICAgICAgICAgICAgdGhpcy5nZXRLZXlib2FyZEJsb2NrTG9jYXRpb24oYmxvY2spLFxuICAgICAgICApO1xuICAgICAgICB0aGlzLmtleWJvYXJkQXBwbGljYXRpb24uZm9jdXMoKTtcbiAgICB9XG5cbiAgICBleGl0S2V5Ym9hcmRNb3ZlbWVudE1vZGUoKSB7XG4gICAgICAgIHRoaXMua2V5Ym9hcmRNb3ZlbWVudE1vZGUgPSBmYWxzZTtcbiAgICAgICAgaWYgKHRoaXMudGV4dEZvY3VzKSB7XG4gICAgICAgICAgICB0aGlzLmVudGVyS2V5Ym9hcmROYXZpZ2F0aW9uTW9kZSh0aGlzLnRleHRGb2N1cyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjYW5jZWxLZXlib2FyZE1vdmVtZW50KHJldHVybkZvY3VzVG9FbnRyeSA9IGZhbHNlKSB7XG4gICAgICAgIGNvbnN0IGJsb2NrID0gdGhpcy50ZXh0Rm9jdXM7XG4gICAgICAgIHRoaXMua2V5Ym9hcmRNb3ZlbWVudE1vZGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5rZXlib2FyZElucHV0QWN0aXZlID0gZmFsc2U7XG4gICAgICAgIHRoaXMudGV4dE1vdmUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy50ZXh0TW92aW5nID0gZmFsc2U7XG4gICAgICAgIGlmIChibG9jaykge1xuICAgICAgICAgICAgYmxvY2sudmlldy5jbGFzc0xpc3QucmVtb3ZlKFwiZG93blwiLCBcInVwXCIpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudGV4dEZvY3VzID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLmV4aXRLZXlib2FyZE1vZGUoKTtcbiAgICAgICAgaWYgKHJldHVybkZvY3VzVG9FbnRyeSkge1xuICAgICAgICAgICAgdGhpcy5zb3J0Q29udGFpbmVyRGl2LmZvY3VzKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZWxlY3RLZXlib2FyZEJsb2NrKGJsb2NrKSB7XG4gICAgICAgIGNvbnN0IHByZXZpb3VzQmxvY2sgPSB0aGlzLnRleHRGb2N1cztcbiAgICAgICAgaWYgKHByZXZpb3VzQmxvY2sgJiYgcHJldmlvdXNCbG9jayAhPT0gYmxvY2spIHtcbiAgICAgICAgICAgIHByZXZpb3VzQmxvY2sudmlldy5jbGFzc0xpc3QucmVtb3ZlKFwiZG93blwiLCBcInVwXCIpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudGV4dEZvY3VzID0gYmxvY2s7XG4gICAgICAgIHRoaXMudGV4dE1vdmUgPSBmYWxzZTtcbiAgICAgICAgYmxvY2subWFrZVRhYkluZGV4KCk7XG4gICAgICAgIGJsb2NrLnZpZXcuY2xhc3NMaXN0LmFkZChcImRvd25cIik7XG4gICAgICAgIHRoaXMuZW50ZXJLZXlib2FyZE5hdmlnYXRpb25Nb2RlKGJsb2NrKTtcbiAgICB9XG5cbiAgICBleGl0S2V5Ym9hcmRNb2RlRm9yVGFiKCkge1xuICAgICAgICB0aGlzLmNhbmNlbEtleWJvYXJkTW92ZW1lbnQoKTtcbiAgICB9XG5cbiAgICBoYW5kbGVLZXlib2FyZE1vdmVtZW50S2V5ZG93bihldmVudCkge1xuICAgICAgICBpZiAoIXRoaXMua2V5Ym9hcmRJbnB1dEFjdGl2ZSB8fCAhdGhpcy50ZXh0Rm9jdXMpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBibG9jayA9IHRoaXMudGV4dEZvY3VzO1xuICAgICAgICBjb25zdCB3YXNNb3ZpbmcgPSB0aGlzLnRleHRNb3ZlO1xuICAgICAgICBjb25zdCBwcmV2aW91c1BhcmVudCA9IGJsb2NrLnZpZXcucGFyZW50RWxlbWVudDtcbiAgICAgICAgY29uc3QgcHJldmlvdXNJbmRleCA9IEFycmF5LnByb3RvdHlwZS5pbmRleE9mLmNhbGwoXG4gICAgICAgICAgICBwcmV2aW91c1BhcmVudC5jaGlsZHJlbixcbiAgICAgICAgICAgIGJsb2NrLnZpZXcsXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IHByZXZpb3VzSW5kZW50ID0gYmxvY2suaW5kZW50O1xuICAgICAgICBzd2l0Y2ggKGV2ZW50LmtleSkge1xuICAgICAgICAgICAgY2FzZSBcIlRhYlwiOlxuICAgICAgICAgICAgICAgIHRoaXMuZXhpdEtleWJvYXJkTW9kZUZvclRhYigpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIGNhc2UgXCJBcnJvd0xlZnRcIjpcbiAgICAgICAgICAgICAgICB0aGlzLnRleHRNb3ZlID8gYmxvY2subW92ZUxlZnQoKSA6IGJsb2NrLnNlbGVjdExlZnQoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJBcnJvd1VwXCI6XG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0TW92ZSA/IGJsb2NrLm1vdmVVcCgpIDogYmxvY2suc2VsZWN0VXAoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJBcnJvd1JpZ2h0XCI6XG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0TW92ZSA/IGJsb2NrLm1vdmVSaWdodCgpIDogYmxvY2suc2VsZWN0UmlnaHQoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJBcnJvd0Rvd25cIjpcbiAgICAgICAgICAgICAgICB0aGlzLnRleHRNb3ZlID8gYmxvY2subW92ZURvd24oKSA6IGJsb2NrLnNlbGVjdERvd24oKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJFbnRlclwiOlxuICAgICAgICAgICAgY2FzZSBcIiBcIjpcbiAgICAgICAgICAgICAgICBibG9jay50b2dnbGVNb3ZlKCk7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnRleHRNb3ZlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXhpdEtleWJvYXJkTW92ZW1lbnRNb2RlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uPy4oKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICBjYXNlIFwiRXNjYXBlXCI6XG4gICAgICAgICAgICBjYXNlIFwiRXNjXCI6XG4gICAgICAgICAgICAgICAgdGhpcy5jYW5jZWxLZXlib2FyZE1vdmVtZW50KHRydWUpO1xuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uPy4oKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24/LigpO1xuICAgICAgICB0aGlzLnRleHRNb3ZpbmcgPSBmYWxzZTtcbiAgICAgICAgY29uc3QgcGxhY2VtZW50Q2hhbmdlZCA9XG4gICAgICAgICAgICB3YXNNb3ZpbmcgJiZcbiAgICAgICAgICAgIChibG9jay52aWV3LnBhcmVudEVsZW1lbnQgIT09IHByZXZpb3VzUGFyZW50IHx8XG4gICAgICAgICAgICAgICAgYmxvY2suaW5kZW50ICE9PSBwcmV2aW91c0luZGVudCB8fFxuICAgICAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5pbmRleE9mLmNhbGwoXG4gICAgICAgICAgICAgICAgICAgIGJsb2NrLnZpZXcucGFyZW50RWxlbWVudC5jaGlsZHJlbixcbiAgICAgICAgICAgICAgICAgICAgYmxvY2sudmlldyxcbiAgICAgICAgICAgICAgICApICE9PSBwcmV2aW91c0luZGV4KTtcbiAgICAgICAgaWYgKHBsYWNlbWVudENoYW5nZWQpIHtcbiAgICAgICAgICAgIHRoaXMuY2xlYXJGZWVkYmFjaygpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnRleHRNb3ZlKSB7XG4gICAgICAgICAgICB0aGlzLmVudGVyS2V5Ym9hcmRNb3ZlbWVudE1vZGUoYmxvY2spO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5rZXlib2FyZEFwcGxpY2F0aW9uLmZvY3VzKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBXaGVuIHRoZSB1c2VyIGxlYXZlcyB0aGUgUGFyc29ucyBwcm9ibGVtIHZpYSBrZXlib2FyZCBtb2RlXG4gICAgZXhpdEtleWJvYXJkTW9kZSgpIHtcbiAgICAgICAgdGhpcy5rZXlib2FyZEFwcGxpY2F0aW9uLnJlbW92ZUF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIik7XG4gICAgICAgIHRoaXMuc29ydENvbnRhaW5lckRpdi5zZXRBdHRyaWJ1dGUoXG4gICAgICAgICAgICBcImFyaWEtbGFiZWxcIixcbiAgICAgICAgICAgIHQoXCJtc2dfcGFyc29uX2tleWJvYXJkX2VudHJ5X2xhYmVsXCIpLFxuICAgICAgICApO1xuICAgICAgICB0aGlzLmhpZGVLZXlib2FyZEVudHJ5SGludCgpO1xuICAgIH1cbiAgICAvKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICA9PT09IFZJRVcgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbiAgICAvLyBDbGVhciBhbnkgZmVlZGJhY2sgZnJvbSB0aGUgYW5zd2VyIGFyZWFcbiAgICBjbGVhckZlZWRiYWNrKCkge1xuICAgICAgICB0aGlzLmFuc3dlckFyZWEuY2xhc3NMaXN0LnJlbW92ZShcImluY29ycmVjdFwiLCBcImNvcnJlY3RcIik7XG4gICAgICAgIHZhciBjaGlsZHJlbiA9IHRoaXMuYW5zd2VyQXJlYS5jaGlsZHJlbjtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY2hpbGRyZW5baV0uY2xhc3NMaXN0LnJlbW92ZShcbiAgICAgICAgICAgICAgICBcImNvcnJlY3RQb3NpdGlvblwiLFxuICAgICAgICAgICAgICAgIFwiaW5jb3JyZWN0UG9zaXRpb25cIixcbiAgICAgICAgICAgICAgICBcImluZGVudExlZnRcIixcbiAgICAgICAgICAgICAgICBcImluZGVudFJpZ2h0XCIsXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubWVzc2FnZURpdi5zdHlsZS52aXNpYmlsaXR5ID0gXCJoaWRkZW5cIjtcbiAgICAgICAgdGhpcy5wZW5kaW5nSGVscE1lc3NhZ2UgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMuaGlkZUJsb2NrRXhwbGFuYXRpb25zKCk7XG4gICAgICAgIHRoaXMudXBkYXRlQmxvY2tBcmlhTGFiZWxzKCk7XG4gICAgfVxuICAgIC8vIERpc2FibGUgdGhlIGludGVyZmFjZVxuICAgIGFzeW5jIGRpc2FibGVJbnRlcmFjdGlvbigpIHtcbiAgICAgICAgLy8gRGlzYWJsZSBibG9ja3NcbiAgICAgICAgYXdhaXQgdGhpcy5jaGVja1NlcnZlckNvbXBsZXRlO1xuICAgICAgICBjb25zb2xlLmxvZyhcImRpc2FibGluZyBibG9ja3NcIik7XG4gICAgICAgIGlmICh0aGlzLmJsb2NrcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGJsb2NrID0gdGhpcy5ibG9ja3NbaV07XG4gICAgICAgICAgICAgICAgYmxvY2suZGlzYWJsZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIEhpZGUgYnV0dG9uc1xuICAgICAgICB0aGlzLmNoZWNrQnV0dG9uLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgdGhpcy5yZXNldEJ1dHRvbi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgfVxuICAgIC8vIEJhc2VkIG9uIHRoZSBtb3ZpbmcgZWxlbWVudCwgZXRjLiwgZXN0YWJsaXNoIHRoZSBtb3Zpbmcgc3RhdGVcbiAgICAvLyAgIHJlc3Q6IG5vdCBtb3ZpbmdcbiAgICAvLyAgIHNvdXJjZTogbW92aW5nIGluc2lkZSBzb3VyY2UgYXJlYVxuICAgIC8vICAgYW5zd2VyOiBtb3ZpbmcgaW5zaWRlIGFuc3dlciBhcmVhXG4gICAgLy8gICBtb3Zpbmc6IG1vdmluZyBvdXRzaWRlIGFyZWFzXG4gICAgbW92aW5nU3RhdGUoKSB7XG4gICAgICAgIGlmICh0aGlzLm1vdmluZyA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBcInJlc3RcIjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgeCA9IHRoaXMubW92aW5nWCAtIHdpbmRvdy5wYWdlWE9mZnNldDtcbiAgICAgICAgdmFyIHkgPSB0aGlzLm1vdmluZ1kgLSB3aW5kb3cucGFnZVlPZmZzZXQ7XG4gICAgICAgIC8vIENoZWNrIGlmIGluIGFuc3dlciBhcmVhXG4gICAgICAgIHZhciBib3VuZHMgPSB0aGlzLmFuc3dlckFyZWEuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHggPj0gYm91bmRzLmxlZnQgJiZcbiAgICAgICAgICAgIHggPD0gYm91bmRzLnJpZ2h0ICYmXG4gICAgICAgICAgICB5ID49IGJvdW5kcy50b3AgJiZcbiAgICAgICAgICAgIHkgPD0gYm91bmRzLmJvdHRvbVxuICAgICAgICApIHtcbiAgICAgICAgICAgIHJldHVybiBcImFuc3dlclwiO1xuICAgICAgICB9XG4gICAgICAgIC8vIENoZWNrIGlmIGluIHNvdXJjZSBhcmVhXG4gICAgICAgIGJvdW5kcyA9IHRoaXMuc291cmNlQXJlYS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgeCA+PSBib3VuZHMubGVmdCAmJlxuICAgICAgICAgICAgeCA8PSBib3VuZHMucmlnaHQgJiZcbiAgICAgICAgICAgIHkgPj0gYm91bmRzLnRvcCAmJlxuICAgICAgICAgICAgeSA8PSBib3VuZHMuYm90dG9tXG4gICAgICAgICkge1xuICAgICAgICAgICAgcmV0dXJuIFwic291cmNlXCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFwibW92aW5nXCI7XG4gICAgfVxuICAgIC8vIEFic29sdXRlbHkgcG9zaXRpb24gYSBibG9jayBvciBpbmRpY2F0b3IgdmlldyBpbnNpZGUgaXRzIGFyZWFcbiAgICBwbGFjZVZpZXcoZWwsIGxlZnQsIHRvcCwgd2lkdGgsIHpJbmRleCkge1xuICAgICAgICBlbC5zdHlsZS5sZWZ0ID0gbGVmdCArIFwicHhcIjtcbiAgICAgICAgZWwuc3R5bGUudG9wID0gdG9wICsgXCJweFwiO1xuICAgICAgICBlbC5zdHlsZS53aWR0aCA9IHdpZHRoICsgXCJweFwiO1xuICAgICAgICBlbC5zdHlsZS56SW5kZXggPSB6SW5kZXg7XG4gICAgfVxuICAgIC8vIFVwZGF0ZSB0aGUgUGFyc29ucyB2aWV3XG4gICAgLy8gVGhpcyBnZXRzIGNhbGxlZCB3aGVuIGRyYWdnaW5nIGEgYmxvY2tcbiAgICB1cGRhdGVWaWV3KCkge1xuICAgICAgICAvLyBCYXNlZCBvbiB0aGUgbmV3IGFuZCB0aGUgb2xkIHN0YXRlLCBmaWd1cmUgb3V0IHdoYXQgdG8gdXBkYXRlXG4gICAgICAgIHZhciBzdGF0ZSA9IHRoaXMuc3RhdGU7XG4gICAgICAgIHZhciBuZXdTdGF0ZSA9IHRoaXMubW92aW5nU3RhdGUoKTtcbiAgICAgICAgdmFyIHVwZGF0ZVNvdXJjZSA9IHRydWU7XG4gICAgICAgIHZhciB1cGRhdGVBbnN3ZXIgPSB0cnVlO1xuICAgICAgICB2YXIgdXBkYXRlTW92aW5nID0gbmV3U3RhdGUgPT0gXCJtb3ZpbmdcIjtcbiAgICAgICAgaWYgKHN0YXRlID09IG5ld1N0YXRlKSB7XG4gICAgICAgICAgICBpZiAobmV3U3RhdGUgPT0gXCJyZXN0XCIpIHtcbiAgICAgICAgICAgICAgICB1cGRhdGVTb3VyY2UgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB1cGRhdGVBbnN3ZXIgPSBmYWxzZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobmV3U3RhdGUgPT0gXCJzb3VyY2VcIikge1xuICAgICAgICAgICAgICAgIHVwZGF0ZUFuc3dlciA9IGZhbHNlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChuZXdTdGF0ZSA9PSBcImFuc3dlclwiKSB7XG4gICAgICAgICAgICAgICAgdXBkYXRlU291cmNlID0gZmFsc2U7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG5ld1N0YXRlID09IFwibW92aW5nXCIpIHtcbiAgICAgICAgICAgICAgICB1cGRhdGVBbnN3ZXIgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB1cGRhdGVTb3VyY2UgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgbW92aW5nSGVpZ2h0O1xuICAgICAgICBpZiAodGhpcy5tb3ZpbmcgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgLy8gTXVzdCBnZXQgaGVpZ2h0IGhlcmUgYXMgZGV0YWNoZWQgaXRlbXMgZG9uJ3QgaGF2ZSBoZWlnaHRcbiAgICAgICAgICAgIG1vdmluZ0hlaWdodCA9IG91dGVySGVpZ2h0KHRoaXMubW92aW5nLnZpZXcpO1xuICAgICAgICAgICAgdGhpcy5tb3Zpbmcudmlldy5yZW1vdmUoKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcG9zaXRpb25Ub3AsIHdpZHRoO1xuICAgICAgICB2YXIgYmFzZVdpZHRoID0gdGhpcy5hcmVhV2lkdGggLSAyMjtcbiAgICAgICAgLy8gVXBkYXRlIHRoZSBTb3VyY2UgQXJlYVxuICAgICAgICBpZiAodXBkYXRlU291cmNlKSB7XG4gICAgICAgICAgICBwb3NpdGlvblRvcCA9IDA7XG4gICAgICAgICAgICB2YXIgYmxvY2tzID0gdGhpcy5zb3VyY2VCbG9ja3MoKTtcbiAgICAgICAgICAgIGlmIChuZXdTdGF0ZSA9PSBcInNvdXJjZVwiKSB7XG4gICAgICAgICAgICAgICAgdmFyIGhhc0luc2VydGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdmFyIG1vdmluZ0JpbiA9IHRoaXMubW92aW5nLnBhaXJlZEJpbigpO1xuICAgICAgICAgICAgICAgIHZhciBiaW5Gb3JCbG9jayA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBibG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgYmluRm9yQmxvY2sucHVzaChibG9ja3NbaV0ucGFpcmVkQmluKCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIWJpbkZvckJsb2NrLmluY2x1ZGVzKG1vdmluZ0JpbikpIHtcbiAgICAgICAgICAgICAgICAgICAgbW92aW5nQmluID0gLTE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBpbnNlcnRQb3NpdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICAgICBpZiAoYmluRm9yQmxvY2subGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgaW5zZXJ0UG9zaXRpb25zLnB1c2goMCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1vdmluZ0JpbiA9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5zZXJ0UG9zaXRpb25zLnB1c2goMCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYmluRm9yQmxvY2tbMF0gPT0gbW92aW5nQmluKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnNlcnRQb3NpdGlvbnMucHVzaCgwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBmb3IgKGkgPSAxOyBpIDwgYmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYmluRm9yQmxvY2tbaSAtIDFdID09IG1vdmluZ0Jpbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydFBvc2l0aW9ucy5wdXNoKGkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChiaW5Gb3JCbG9ja1tpXSA9PSBtb3ZpbmdCaW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnNlcnRQb3NpdGlvbnMucHVzaChpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbW92aW5nQmluID09IC0xICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmluRm9yQmxvY2tbaSAtIDFdICE9IGJpbkZvckJsb2NrW2ldXG4gICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnNlcnRQb3NpdGlvbnMucHVzaChpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAobW92aW5nQmluID09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnNlcnRQb3NpdGlvbnMucHVzaChiaW5Gb3JCbG9jay5sZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgYmluRm9yQmxvY2tbYmluRm9yQmxvY2subGVuZ3RoIC0gMV0gPT0gbW92aW5nQmluXG4gICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5zZXJ0UG9zaXRpb25zLnB1c2goYmluRm9yQmxvY2subGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgeCA9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubW92aW5nWCAtXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc291cmNlQXJlYS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0IC1cbiAgICAgICAgICAgICAgICAgICAgd2luZG93LnBhZ2VYT2Zmc2V0IC1cbiAgICAgICAgICAgICAgICAgICAgYmFzZVdpZHRoIC8gMiAtXG4gICAgICAgICAgICAgICAgICAgIDExO1xuICAgICAgICAgICAgICAgIHZhciB5ID1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3ZpbmdZIC1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zb3VyY2VBcmVhLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCAtXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5wYWdlWU9mZnNldDtcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgYmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpdGVtID0gYmxvY2tzW2ldO1xuICAgICAgICAgICAgICAgICAgICB2YXIgajtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFoYXNJbnNlcnRlZCAmJiBpbnNlcnRQb3NpdGlvbnMuaW5jbHVkZXMoaSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ZXN0SGVpZ2h0ID0gb3V0ZXJIZWlnaHQoaXRlbS52aWV3KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaiA9IGkgKyAxOyBqIDwgYmxvY2tzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluc2VydFBvc2l0aW9ucy5pbmNsdWRlcyhqKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVzdEhlaWdodCArPSBvdXRlckhlaWdodChibG9ja3Nbal0udmlldyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeSAtIHBvc2l0aW9uVG9wIDwgbW92aW5nSGVpZ2h0ICsgdGVzdEhlaWdodCAvIDIgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpID09IGluc2VydFBvc2l0aW9uc1tpbnNlcnRQb3NpdGlvbnMubGVuZ3RoIC0gMV1cbiAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhc0luc2VydGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNvdXJjZUFyZWEuaW5zZXJ0QmVmb3JlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmluZy52aWV3LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLnZpZXcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsYWNlVmlldyhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3ZpbmcudmlldyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeSAtIG1vdmluZ0hlaWdodCAvIDIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhc2VXaWR0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgMyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uVG9wID0gcG9zaXRpb25Ub3AgKyBtb3ZpbmdIZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbGFjZVZpZXcoaXRlbS52aWV3LCAwLCBwb3NpdGlvblRvcCwgYmFzZVdpZHRoLCAyKTtcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25Ub3AgPSBwb3NpdGlvblRvcCArIG91dGVySGVpZ2h0KGl0ZW0udmlldyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghaGFzSW5zZXJ0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zb3VyY2VBcmVhLmFwcGVuZENoaWxkKHRoaXMubW92aW5nLnZpZXcpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBsYWNlVmlldyhcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubW92aW5nLnZpZXcsXG4gICAgICAgICAgICAgICAgICAgICAgICB4LFxuICAgICAgICAgICAgICAgICAgICAgICAgeSAtIG91dGVySGVpZ2h0KHRoaXMubW92aW5nLnZpZXcpIC8gMixcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhc2VXaWR0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgIDMsXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpdGVtID0gYmxvY2tzW2ldO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBsYWNlVmlldyhpdGVtLnZpZXcsIDAsIHBvc2l0aW9uVG9wLCBiYXNlV2lkdGgsIDIpO1xuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvblRvcCA9IHBvc2l0aW9uVG9wICsgb3V0ZXJIZWlnaHQoaXRlbS52aWV3KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBVcGRhdGUgdGhlIFBhaXJlZCBEaXN0cmFjdG9yIEluZGljYXRvcnNcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLnBhaXJlZEJpbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgYmluID0gdGhpcy5wYWlyZWRCaW5zW2ldO1xuICAgICAgICAgICAgICAgIHZhciBtYXRjaGluZyA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAoaiA9IDA7IGogPCBibG9ja3MubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgYmxvY2sgPSBibG9ja3Nbal07XG4gICAgICAgICAgICAgICAgICAgIGlmIChibG9jay5tYXRjaGVzQmluKGJpbikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoaW5nLnB1c2goYmxvY2spO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBkaXYgPSB0aGlzLnBhaXJlZERpdnNbaV07XG4gICAgICAgICAgICAgICAgaWYgKG1hdGNoaW5nLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGRpdi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZGl2LnN0eWxlLmRpc3BsYXkgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICB2YXIgaGVpZ2h0ID0gLTU7XG4gICAgICAgICAgICAgICAgICAgIHZhciBsYXN0VmlldyA9IG1hdGNoaW5nW21hdGNoaW5nLmxlbmd0aCAtIDFdLnZpZXc7XG4gICAgICAgICAgICAgICAgICAgIGhlaWdodCArPSBwYXJzZUludChnZXRDb21wdXRlZFN0eWxlKGxhc3RWaWV3KS50b3ApO1xuICAgICAgICAgICAgICAgICAgICBoZWlnaHQgLT0gcGFyc2VJbnQoZ2V0Q29tcHV0ZWRTdHlsZShtYXRjaGluZ1swXS52aWV3KS50b3ApO1xuICAgICAgICAgICAgICAgICAgICBoZWlnaHQgKz0gb3V0ZXJIZWlnaHQobGFzdFZpZXcpO1xuICAgICAgICAgICAgICAgICAgICBkaXYuc3R5bGUubGVmdCA9IFwiLTZweFwiO1xuICAgICAgICAgICAgICAgICAgICBkaXYuc3R5bGUudG9wID0gZ2V0Q29tcHV0ZWRTdHlsZShtYXRjaGluZ1swXS52aWV3KS50b3A7XG4gICAgICAgICAgICAgICAgICAgIGRpdi5zdHlsZS53aWR0aCA9IGJhc2VXaWR0aCArIDM0ICsgXCJweFwiO1xuICAgICAgICAgICAgICAgICAgICBkaXYuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0ICsgXCJweFwiO1xuICAgICAgICAgICAgICAgICAgICBkaXYuc3R5bGUuekluZGV4ID0gMTtcbiAgICAgICAgICAgICAgICAgICAgZGl2LnN0eWxlLnRleHRJbmRlbnQgPSBcIi0zMHB4XCI7XG4gICAgICAgICAgICAgICAgICAgIGRpdi5zdHlsZS5wYWRkaW5nVG9wID0gKGhlaWdodCAtIDcwKSAvIDIgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgICAgIGRpdi5zdHlsZS5vdmVyZmxvdyA9IFwidmlzaWJsZVwiO1xuICAgICAgICAgICAgICAgICAgICBkaXYuc3R5bGUuZm9udFNpemUgPSBcIjQzcHhcIjtcbiAgICAgICAgICAgICAgICAgICAgZGl2LnN0eWxlLnZlcnRpY2FsQWxpZ24gPSBcIm1pZGRsZVwiO1xuICAgICAgICAgICAgICAgICAgICBkaXYuc3R5bGUuY29sb3IgPSBcInZhcigtLXBhcnNvbnNMYWJlbENvbG9yLCAjNTg1OGUwKVwiO1xuICAgICAgICAgICAgICAgICAgICBkaXYuaW5uZXJIVE1MID1cbiAgICAgICAgICAgICAgICAgICAgICAgIFwiPHNwYW4gaWQ9ICdzdCcgc3R5bGUgPSAndmVydGljYWwtYWxpZ246IG1pZGRsZTsgZm9udC13ZWlnaHQ6IGJvbGQ7IGZvbnQtc2l6ZTogMTVweCc+b3I8L3NwYW4+e1wiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobWF0Y2hpbmcubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgZGl2LmlubmVySFRNTCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIFVwZGF0ZSB0aGUgQW5zd2VyIEFyZWFcbiAgICAgICAgaWYgKHVwZGF0ZUFuc3dlcikge1xuICAgICAgICAgICAgdmFyIGJsb2NrLCBpbmRlbnQ7XG4gICAgICAgICAgICBwb3NpdGlvblRvcCA9IDA7XG4gICAgICAgICAgICB3aWR0aCA9XG4gICAgICAgICAgICAgICAgdGhpcy5hcmVhV2lkdGggK1xuICAgICAgICAgICAgICAgIHRoaXMuaW5kZW50ICogdGhpcy5vcHRpb25zLnBpeGVsc1BlckluZGVudCAtXG4gICAgICAgICAgICAgICAgMjI7XG4gICAgICAgICAgICB2YXIgYmxvY2tzID0gdGhpcy5hbnN3ZXJCbG9ja3MoKTtcbiAgICAgICAgICAgIGlmIChuZXdTdGF0ZSA9PSBcImFuc3dlclwiKSB7XG4gICAgICAgICAgICAgICAgdmFyIGhhc0luc2VydGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdmFyIHggPVxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmluZ1ggLVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFuc3dlckFyZWEuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdCAtXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5wYWdlWE9mZnNldCAtXG4gICAgICAgICAgICAgICAgICAgIGJhc2VXaWR0aCAvIDIgLVxuICAgICAgICAgICAgICAgICAgICAxMTtcbiAgICAgICAgICAgICAgICB2YXIgbW92aW5nSW5kZW50ID0gTWF0aC5yb3VuZCh4IC8gdGhpcy5vcHRpb25zLnBpeGVsc1BlckluZGVudCk7XG4gICAgICAgICAgICAgICAgaWYgKG1vdmluZ0luZGVudCA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgbW92aW5nSW5kZW50ID0gMDtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG1vdmluZ0luZGVudCA+IHRoaXMuaW5kZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIG1vdmluZ0luZGVudCA9IHRoaXMuaW5kZW50O1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHggPSBtb3ZpbmdJbmRlbnQgKiB0aGlzLm9wdGlvbnMucGl4ZWxzUGVySW5kZW50O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgeSA9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubW92aW5nWSAtXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYW5zd2VyQXJlYS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgLVxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cucGFnZVlPZmZzZXQ7XG4gICAgICAgICAgICAgICAgdGhpcy5tb3ZpbmcuaW5kZW50ID0gbW92aW5nSW5kZW50O1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBibG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgYmxvY2sgPSBibG9ja3NbaV07XG4gICAgICAgICAgICAgICAgICAgIGlmICghaGFzSW5zZXJ0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB5IC0gcG9zaXRpb25Ub3AgPFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChtb3ZpbmdIZWlnaHQgKyBvdXRlckhlaWdodChibG9jay52aWV3KSkgLyAyXG4gICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYXNJbnNlcnRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hbnN3ZXJBcmVhLmluc2VydEJlZm9yZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3ZpbmcudmlldyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2sudmlldyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGxhY2VWaWV3KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmluZy52aWV3LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5IC0gbW92aW5nSGVpZ2h0IC8gMixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFzZVdpZHRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25Ub3AgPSBwb3NpdGlvblRvcCArIG1vdmluZ0hlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpbmRlbnQgPSBibG9jay5pbmRlbnQgKiB0aGlzLm9wdGlvbnMucGl4ZWxzUGVySW5kZW50O1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBsYWNlVmlldyhcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrLnZpZXcsXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRlbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvblRvcCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoIC0gaW5kZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgMixcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25Ub3AgPSBwb3NpdGlvblRvcCArIG91dGVySGVpZ2h0KGJsb2NrLnZpZXcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIWhhc0luc2VydGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYW5zd2VyQXJlYS5hcHBlbmRDaGlsZCh0aGlzLm1vdmluZy52aWV3KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbGFjZVZpZXcoXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmluZy52aWV3LFxuICAgICAgICAgICAgICAgICAgICAgICAgeCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHkgLSBvdXRlckhlaWdodCh0aGlzLm1vdmluZy52aWV3KSAvIDIsXG4gICAgICAgICAgICAgICAgICAgICAgICBiYXNlV2lkdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAzLFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBibG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgYmxvY2sgPSBibG9ja3NbaV07XG4gICAgICAgICAgICAgICAgICAgIGluZGVudCA9IGJsb2NrLmluZGVudCAqIHRoaXMub3B0aW9ucy5waXhlbHNQZXJJbmRlbnQ7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGxhY2VWaWV3KFxuICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2sudmlldyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uVG9wLFxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGggLSBpbmRlbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAyLFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvblRvcCA9IHBvc2l0aW9uVG9wICsgb3V0ZXJIZWlnaHQoYmxvY2sudmlldyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIFVwZGF0ZSB0aGUgTW92aW5nIEFyZWFcbiAgICAgICAgaWYgKHVwZGF0ZU1vdmluZykge1xuICAgICAgICAgICAgLy8gQWRkIGl0IHRvIHRoZSBsb3dlc3QgcGxhY2UgaW4gdGhlIHNvdXJjZSBhcmVhXG4gICAgICAgICAgICBtb3ZpbmdCaW4gPSB0aGlzLm1vdmluZy5wYWlyZWRCaW4oKTtcbiAgICAgICAgICAgIGlmIChtb3ZpbmdCaW4gPT0gLTEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNvdXJjZUFyZWEuYXBwZW5kQ2hpbGQodGhpcy5tb3Zpbmcudmlldyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBiZWZvcmU7XG4gICAgICAgICAgICAgICAgYmxvY2tzID0gdGhpcy5zb3VyY2VCbG9ja3M7XG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBibG9jayA9IGJsb2Nrc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJsb2NrLnBhaXJlZEJpbigpID09IG1vdmluZ0Jpbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgYmVmb3JlID0gaSArIDE7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGJlZm9yZSA9PSB1bmRlZmluZWQgfHwgYmVmb3JlID09IGJsb2Nrcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zb3VyY2VBcmVhLmFwcGVuZENoaWxkKHRoaXMubW92aW5nLnZpZXcpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc291cmNlQXJlYS5pbnNlcnRCZWZvcmUoXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmluZy52aWV3LFxuICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2tzW2JlZm9yZV0udmlldyxcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBQbGFjZSBpbiB0aGUgbWlkZGxlIG9mIHRoZSBtb3VzZSBjdXJzb3JcbiAgICAgICAgICAgIHRoaXMucGxhY2VWaWV3KFxuICAgICAgICAgICAgICAgIHRoaXMubW92aW5nLnZpZXcsXG4gICAgICAgICAgICAgICAgdGhpcy5tb3ZpbmdYIC1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zb3VyY2VBcmVhLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQgLVxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cucGFnZVhPZmZzZXQgLVxuICAgICAgICAgICAgICAgICAgICBvdXRlcldpZHRoKHRoaXMubW92aW5nLnZpZXcpIC8gMixcbiAgICAgICAgICAgICAgICB0aGlzLm1vdmluZ1kgLVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNvdXJjZUFyZWEuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wIC1cbiAgICAgICAgICAgICAgICAgICAgd2luZG93LnBhZ2VZT2Zmc2V0IC1cbiAgICAgICAgICAgICAgICAgICAgbW92aW5nSGVpZ2h0IC8gMixcbiAgICAgICAgICAgICAgICBiYXNlV2lkdGgsXG4gICAgICAgICAgICAgICAgMyxcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgc3RhdGUgPSBuZXdTdGF0ZTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHN0YXRlO1xuICAgIH1cbiAgICBhZGRCbG9ja0xhYmVscyhibG9ja3MpIHtcbiAgICAgICAgdmFyIGJpbiA9IC0xO1xuICAgICAgICB2YXIgYmluQ291bnQgPSAwO1xuICAgICAgICB2YXIgYmluQ2hpbGRyZW4gPSAwO1xuICAgICAgICB2YXIgYmxvY2tzTm90SW5CaW5zID0gMDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBibG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChibG9ja3NbaV0ucGFpcmVkQmluKCkgPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBibG9ja3NOb3RJbkJpbnMrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGN1cnJlbnRCaW4gPSBibG9ja3NbaV0ucGFpcmVkQmluKCk7XG4gICAgICAgICAgICBpZiAoY3VycmVudEJpbiA9PSAtMSB8fCBjdXJyZW50QmluICE9IGJpbikge1xuICAgICAgICAgICAgICAgIGJpbiA9IGN1cnJlbnRCaW47XG4gICAgICAgICAgICAgICAgYmluQ2hpbGRyZW4gPSAwO1xuICAgICAgICAgICAgICAgIGJpbkNvdW50Kys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgbGFiZWwgPVxuICAgICAgICAgICAgICAgIFwiXCIgK1xuICAgICAgICAgICAgICAgIGJpbkNvdW50ICtcbiAgICAgICAgICAgICAgICAoY3VycmVudEJpbiAhPSAtMVxuICAgICAgICAgICAgICAgICAgICA/IFN0cmluZy5mcm9tQ2hhckNvZGUoOTcgKyBiaW5DaGlsZHJlbilcbiAgICAgICAgICAgICAgICAgICAgOiBcIiBcIik7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgYmluQ291bnQgPCAxMCAmJlxuICAgICAgICAgICAgICAgIGJsb2Nrc05vdEluQmlucyArIHRoaXMucGFpcmVkQmlucy5sZW5ndGggPj0gMTBcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIGxhYmVsICs9IFwiIFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYmxvY2tzW2ldLmFkZExhYmVsKGxhYmVsLCAwKTtcbiAgICAgICAgICAgIGJpbkNoaWxkcmVuKys7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGJsb2Nrc05vdEluQmlucyArIHRoaXMucGFpcmVkQmlucy5sZW5ndGggPj0gMTApIHtcbiAgICAgICAgICAgIHRoaXMuYXJlYVdpZHRoICs9IDU7XG4gICAgICAgICAgICB0aGlzLnNvdXJjZUFyZWEuc3R5bGUud2lkdGggPVxuICAgICAgICAgICAgICAgIChwYXJzZUZsb2F0KGdldENvbXB1dGVkU3R5bGUodGhpcy5zb3VyY2VBcmVhKS53aWR0aCkgfHwgMCkgK1xuICAgICAgICAgICAgICAgIDUgK1xuICAgICAgICAgICAgICAgIFwicHhcIjtcbiAgICAgICAgICAgIHRoaXMuYW5zd2VyQXJlYS5zdHlsZS53aWR0aCA9XG4gICAgICAgICAgICAgICAgKHBhcnNlRmxvYXQoZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmFuc3dlckFyZWEpLndpZHRoKSB8fCAwKSArXG4gICAgICAgICAgICAgICAgNSArXG4gICAgICAgICAgICAgICAgXCJweFwiO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIFB1dCBhbGwgdGhlIGJsb2NrcyBiYWNrIGludG8gdGhlIHNvdXJjZSBhcmVhLCByZXNodWZmbGluZyBhcyBuZWNlc3NhcnlcbiAgICBhc3luYyByZXNldFZpZXcoKSB7XG4gICAgICAgIC8vIENsZWFyIGV2ZXJ5dGhpbmdcbiAgICAgICAgdGhpcy5jbGVhckZlZWRiYWNrKCk7XG4gICAgICAgIC8vIENvZGVUYWlsb3I6IEhpZGUgdGhlIENvcHkgQW5zd2VyIEJ1dHRvbiBhZ2FpblxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnNjYWZmb2xkaW5nID09PSB0cnVlKSB7XG4gICAgICAgICAgICBjb25zdCBjb3B5QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgICAgICAgICBgI2NvcHktYW5zd2VyLWJ1dHRvbi0ke3RoaXMuZGl2aWR9YCxcbiAgICAgICAgICAgICk7IC8vIGNvcHktYW5zd2VyLWJ1dHRvbi0ke3B1enpsZVNjYWZmb2xkaW5nRGl2aWR9XG4gICAgICAgICAgICBpZiAoY29weUJ0bikge1xuICAgICAgICAgICAgICAgIGNvcHlCdG4uY2xhc3NMaXN0LmFkZChcImNvcHktYnV0dG9uLWhpZGVcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHNjcm9sbFRvcCA9IGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wO1xuICAgICAgICB2YXIgYmxvY2s7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5ibG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGJsb2NrID0gdGhpcy5ibG9ja3NbaV07XG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGJsb2NrLmxpbmVzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNoaWxkcmVuID1cbiAgICAgICAgICAgICAgICAgICAgYmxvY2subGluZXNbal0udmlldy5xdWVyeVNlbGVjdG9yQWxsKFwiLmJsb2NrLWxhYmVsXCIpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGMgPSAwOyBjIDwgY2hpbGRyZW4ubGVuZ3RoOyBjKyspIHtcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW5bY10ucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYmxvY2suZGVzdHJveSgpO1xuICAgICAgICAgICAgdGhpcy5ibG9ja3NbaV0udmlldy5yZW1vdmUoKTtcbiAgICAgICAgfVxuICAgICAgICBkZWxldGUgdGhpcy5ibG9ja3M7XG4gICAgICAgIHRoaXMuYmxvY2tJbmRleCA9IDA7XG4gICAgICAgIGlmICh0aGlzLnBhaXJlZERpdnMpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wYWlyZWREaXZzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wYWlyZWREaXZzW2ldLnJlbW92ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuc291cmNlQXJlYS5zZXRBdHRyaWJ1dGUoXCJzdHlsZVwiLCBcIlwiKTtcbiAgICAgICAgdGhpcy5hbnN3ZXJBcmVhLmNsYXNzTmFtZSA9IFwiXCI7XG4gICAgICAgIHRoaXMuYW5zd2VyQXJlYS5zZXRBdHRyaWJ1dGUoXCJzdHlsZVwiLCBcIlwiKTtcbiAgICAgICAgdGhpcy5ub2luZGVudCA9IHRoaXMub3B0aW9ucy5ub2luZGVudDtcbiAgICAgICAgLy8gUmVpbml0aWFsaXplXG4gICAgICAgIGlmICh0aGlzLmhhc1NvbHZlZCkge1xuICAgICAgICAgICAgdGhpcy5jaGVja0NvdW50ID0gMDtcbiAgICAgICAgICAgIHRoaXMubnVtRGlzdGluY3QgPSAwO1xuICAgICAgICAgICAgdGhpcy5oYXNTb2x2ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuYWRhcHRpdmUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNhbkhlbHAgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy90aGlzLmhlbHBDb3VudCA9IC0zOyAvLyBlbmFibGUgYWZ0ZXIgMyBmYWlsZWQgYXR0ZW1wdHNcbiAgICAgICAgICAgIC8vdGhpcy5oZWxwQnV0dG9uLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMuYWRhcHRpdmVJZCArIFwiUHJvYmxlbVwiLCB0aGlzLmRpdmlkKTtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFxuICAgICAgICAgICAgICAgIHRoaXMuYWRhcHRpdmVJZCArIHRoaXMuZGl2aWQgKyBcIkNvdW50XCIsXG4gICAgICAgICAgICAgICAgdGhpcy5jaGVja0NvdW50LFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMuYWRhcHRpdmVJZCArIFwiU29sdmVkXCIsIGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnNjYWZmb2xkaW5nID09PSB0cnVlKSB7XG4gICAgICAgICAgICAvLyBDb2RlVGFpbG9yOiBpbml0aWFsaXplIHRoZSBwcmUtcGxhY2VkIFBhcnNvbnMgYmxvY2tzIGluY2x1ZGluZyB0aGUgc2V0dGxlZCBibG9ja3MsIGlmIGFueS5cbiAgICAgICAgICAgIGF3YWl0IHRoaXMuaW5pdGlhbGl6ZUFyZWFzKFxuICAgICAgICAgICAgICAgIHRoaXMuYmxvY2tzRnJvbVNvdXJjZSgpLFxuICAgICAgICAgICAgICAgIHRoaXMuc2V0dGxlZEJsb2Nrc0Zyb21Tb3VyY2UoKSxcbiAgICAgICAgICAgICAgICB7fSxcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmluaXRpYWxpemVBcmVhcyh0aGlzLmJsb2Nrc0Zyb21Tb3VyY2UoKSwgW10sIHt9KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmluaXRpYWxpemVJbnRlcmFjdGl2aXR5KCk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wID0gc2Nyb2xsVG9wO1xuICAgICAgICBpZiAodGhpcy5ydW5uYWJsZURpdikge1xuICAgICAgICAgICAgLy8gaGlkZSB0aGUgcmVuZGVyZWQgcnVubmFibGUgLSB3aWxsIGdldCByZXVzZWQgYXMgaXMgaWYgcmVyZXZlYWxlZFxuICAgICAgICAgICAgdGhpcy5ydW5uYWJsZURpdi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgIH1cbiAgICB9XG59XG5cblBhcnNvbnMuY291bnRlciA9IDA7XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJydW5lc3RvbmU6bG9naW4tY29tcGxldGVcIiwgZnVuY3Rpb24gKCkge1xuICAgIGZvciAoY29uc3QgZWwgb2YgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIltkYXRhLWNvbXBvbmVudD1wYXJzb25zXVwiKSkge1xuICAgICAgICBpZiAoZWwuY2xvc2VzdChcIltkYXRhLWNvbXBvbmVudD10aW1lZEFzc2Vzc21lbnRdXCIpID09PSBudWxsKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5jb21wb25lbnRNYXBbZWwuaWRdID0gbmV3IFBhcnNvbnMoe1xuICAgICAgICAgICAgICAgICAgICBvcmlnOiBlbCxcbiAgICAgICAgICAgICAgICAgICAgdXNlUnVuZXN0b25lU2VydmljZXM6IGVCb29rQ29uZmlnLnVzZVJ1bmVzdG9uZVNlcnZpY2VzLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYEVycm9yIHJlbmRlcmluZyBQYXJzb25zIFByb2JsZW0gJHtlbC5pZH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRGV0YWlsczogJHtlcnJ9YCk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyLnN0YWNrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0pO1xuIiwiaW1wb3J0IFBhcnNvbnMgZnJvbSBcIi4vcGFyc29uc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaW1lZFBhcnNvbnMgZXh0ZW5kcyBQYXJzb25zIHtcbiAgICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgICAgIHN1cGVyKG9wdHMpO1xuICAgICAgICAvLyB0b2RvIC0tIG1ha2UgdGhpcyBjb25maWd1cmFibGVcbiAgICAgICAgaWYgKG9wdHMudGltZWRmZWVkYmFjaykge1xuICAgICAgICAgICAgdGhpcy5zaG93ZmVlZGJhY2sgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zaG93ZmVlZGJhY2sgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmdyYWRlci5zaG93ZmVlZGJhY2sgPSB0aGlzLnNob3dmZWVkYmFjaztcbiAgICAgICAgdGhpcy5oaWRlRmVlZGJhY2soKTtcbiAgICAgICAgdGhpcy5jaGVja0J1dHRvbi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgIGlmICh0aGlzLmhlbHBCdXR0b24pIHtcbiAgICAgICAgICAgIHRoaXMuaGVscEJ1dHRvbi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yZXNldEJ1dHRvbi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgfVxuICAgIGNoZWNrQ29ycmVjdFRpbWVkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb3JyZWN0ID8gXCJUXCIgOiBcIkZcIjtcbiAgICB9XG4gICAgaGlkZUZlZWRiYWNrKCkge1xuICAgICAgICB0aGlzLm1lc3NhZ2VEaXYuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgIH1cbn1cblxuaWYgKHR5cGVvZiB3aW5kb3cuY29tcG9uZW50X2ZhY3RvcnkgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB3aW5kb3cuY29tcG9uZW50X2ZhY3RvcnkgPSB7fTtcbn1cbndpbmRvdy5jb21wb25lbnRfZmFjdG9yeVtcInBhcnNvbnNcIl0gPSBmdW5jdGlvbiAob3B0cykge1xuICAgIGlmIChvcHRzLnRpbWVkKSB7XG4gICAgICAgIHJldHVybiBuZXcgVGltZWRQYXJzb25zKG9wdHMpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFBhcnNvbnMob3B0cyk7XG59O1xuIiwiaW1wb3J0IFBhcnNvbnNCbG9jayBmcm9tIFwiLi9wYXJzb25zQmxvY2tcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2V0dGxlZEJsb2NrIGV4dGVuZHMgUGFyc29uc0Jsb2NrIHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9ibGVtLCBsaW5lcykge1xuICAgICAgICAvLyBwcm9ibGVtOiBQYXJzb25zIGluc3RhbmNlXG4gICAgICAgIC8vIGxpbmVzOiBsaW5lcyBpbnNpZGUgdGhlIGJsb2NrXG4gICAgICAgIHN1cGVyKHByb2JsZW0sIGxpbmVzKTtcblxuICAgICAgICB0aGlzLmlzU2V0dGxlZCA9IHRydWU7XG4gICAgICAgIC8vdXBkYXRlIGl0cyBpbmRlbnQgdG8gZm9sbG93IHRoZSBpbmRlbnRhdGlvbiBvZiB0aGUgbGluZXMgaW5zaWRlXG5cbiAgICAgICAgLy8gYWRkIGEgY3NzIGNsYXNzXG4gICAgICAgIHRoaXMudmlldy5jbGFzc0xpc3QuYWRkKFwic2V0dGxlZC1ibG9ja1wiLCBcImRpc2FibGVkXCIpO1xuXG4gICAgICAgIHRoaXMudG9vbHRpcFNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICAgICAgdGhpcy50b29sdGlwU3Bhbi5jbGFzc0xpc3QuYWRkKFwic2V0dGxlZC10b29sdGlwXCIpO1xuICAgICAgICB0aGlzLnZpZXcuYXBwZW5kKHRoaXMudG9vbHRpcFNwYW4pO1xuICAgICAgICB0aGlzLnRvb2x0aXBTcGFuLnRleHRDb250ZW50ID0gXCJPS1wiO1xuICAgIH1cblxuICAgIHNldEJsb2Nrc0JlZm9yZShudW0pIHtcbiAgICAgICAgdGhpcy5ibG9ja3NCZWZvcmUgPSBudW07XG4gICAgICAgIHZhciBiZWZvcmVQbHVyYWwgPSBudW0gPiAxID8gXCJzXCIgOiBcIlwiO1xuICAgICAgICBpZiAodGhpcy5ibG9ja3NBZnRlcikge1xuICAgICAgICAgICAgdmFyIGFmdGVyUGx1cmFsID0gdGhpcy5ibG9ja3NBZnRlciA+IDEgPyBcInNcIiA6IFwiXCI7XG4gICAgICAgICAgICB0aGlzLnRvb2x0aXBTcGFuLmlubmVySFRNTCA9IGAke251bX0gYmxvY2ske2JlZm9yZVBsdXJhbH0g4qyG77iP77iPKSwgJHt0aGlzLmJsb2Nrc0FmdGVyfSBibG9jayR7YWZ0ZXJQbHVyYWx9IOKsh++4j2A7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnRvb2x0aXBTcGFuLmlubmVySFRNTCA9IGAke251bX0gYmxvY2ske2JlZm9yZVBsdXJhbH0g4qyG77iP77iPYDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldEJsb2Nrc0FmdGVyKG51bSkge1xuICAgICAgICB0aGlzLmJsb2Nrc0FmdGVyID0gbnVtO1xuICAgICAgICB2YXIgYWZ0ZXJQbHVyYWwgPSBudW0gPiAxID8gXCJzXCIgOiBcIlwiO1xuICAgICAgICBpZiAodGhpcy5ibG9ja3NCZWZvcmUpIHtcbiAgICAgICAgICAgIHZhciBiZWZvcmVQbHVyYWwgPSB0aGlzLmJsb2Nrc0JlZm9yZSA+IDEgPyBcInNcIiA6IFwiXCI7XG4gICAgICAgICAgICB0aGlzLnRvb2x0aXBTcGFuLmlubmVySFRNTCA9IGAke3RoaXMuYmxvY2tzQmVmb3JlfSBibG9jayR7YmVmb3JlUGx1cmFsfSDirIbvuI8sICR7bnVtfSBibG9jayR7YWZ0ZXJQbHVyYWx9IOKsh++4j2A7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnRvb2x0aXBTcGFuLmlubmVySFRNTCA9IGAke251bX0gYmxvY2ske2FmdGVyUGx1cmFsfSDvuI/vuI/irIfvuI9gO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PT09IFBhcnNvbnNMaW5lIE9iamVjdCA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09PT09PT09IFRoZSBtb2RlbCBhbmQgdmlldyBvZiBhIGxpbmUgb2YgY29kZS5cbj09PT09PT09IEJhc2VkIG9uIHdoYXQgaXMgc3BlY2lmaWVkIGluIHRoZSBwcm9ibGVtLlxuPT09PT09PT0gUGFyc29uQmxvY2sgb2JqZWN0cyBoYXZlIG9uZSBvciBtb3JlIG9mIHRoZXNlLlxuPT09PSBQUk9QRVJUSUVTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PT09PT09PSBwcm9ibGVtOiB0aGUgUGFyc29ucyBwcm9ibGVtXG49PT09PT09PSBpbmRleDogdGhlIGluZGV4IG9mIHRoZSBsaW5lIGluIHRoZSBwcm9ibGVtXG49PT09PT09PSB0ZXh0OiB0aGUgdGV4dCBvZiB0aGUgY29kZSBsaW5lXG49PT09PT09PSBpbmRlbnQ6IHRoZSBpbmRlbnQgbGV2ZWxcbj09PT09PT09IHZpZXc6IGFuIGVsZW1lbnQgZm9yIHZpZXdpbmcgdGhpcyBvYmplY3Rcbj09PT09PT09IGRpc3RyYWN0b3I6IHdoZXRoZXIgaXQgaXMgYSBkaXN0cmFjdG9yXG49PT09PT09PSBwYWlyZWQ6IHdoZXRoZXIgaXQgaXMgYSBwYWlyZWQgZGlzdHJhY3RvclxuPT09PT09PT0gZ3JvdXBXaXRoTmV4dDogd2hldGhlciBpdCBpcyBncm91cGVkIHdpdGggdGhlIGZvbGxvd2luZyBsaW5lXG49PT09PT09PSB3aWR0aDogdGhlIHBpeGVsIHdpZHRoIHdoZW4gcmVuZGVyZWRcbj09PT09PT09PT09PSBpbiB0aGUgaW5pdGlhbCBncm91cGluZ1xuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG4vLyBJbml0aWFsaXplIGZyb20gY29kZXN0cmluZ1xuXG5pbXBvcnQgeyBvdXRlcldpZHRoIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9qcy9kb211dGlsLmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhcnNvbnNMaW5lIHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9ibGVtLCBjb2Rlc3RyaW5nLCBkaXNwbGF5bWF0aCkge1xuICAgICAgICB0aGlzLnByb2JsZW0gPSBwcm9ibGVtO1xuICAgICAgICB0aGlzLmluZGV4ID0gcHJvYmxlbS5saW5lcy5sZW5ndGg7XG4gICAgICAgIC8vIHJlbW92ZXMgdHJhaWxpbmcgd2hpdGVzcGFjZVxuICAgICAgICB2YXIgdHJpbW1lZCA9IGNvZGVzdHJpbmcucmVwbGFjZSgvXFxzKiQvLCBcIlwiKTtcbiAgICAgICAgLy8gQ29kZVRhaWxvcjogQWN0aW9ucyBhcmUgcmVxdWlyZWQgb25seSBpZiB0aGUgcHV6emxlIHdlbGwgYmUgc2VydmVkIGFzIHNjYWZmb2xkaW5nIHB1enpsZSBpbiBDb2RlVGFpbG9yXG4gICAgICAgIC8vIFNvIGhlcmUgd2UgdXNlIHByb2JsZW0ub3B0aW9ucy5zY2FmZm9sZGluZyB0byBkZXRlcm1pbmUgaWYgdGhlIHB1enpsZSBpcyBhIHNjYWZmb2xkaW5nIHB1enpsZVxuICAgICAgICBpZiAodGhpcy5wcm9ibGVtLm9wdGlvbnMuc2NhZmZvbGRpbmcgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGZ1bmN0aW9uIGhhc1RvcExldmVsQ2xhc3MobGluZXMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGluZXMuc29tZShcbiAgICAgICAgICAgICAgICAgICAgKHsgdGV4dCB9KSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dC50cmltU3RhcnQoKS50b0xvd2VyQ2FzZSgpLnN0YXJ0c1dpdGgoXCJjbGFzcyBcIiksIC8vIG5vdyBjaGVjayBmb3Ig4oCcY2xhc3Mg4oCdIGF0IHBvc2l0aW9uIDBcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMucHJvYmxlbS5ub2luZGVudCkge1xuICAgICAgICAgICAgICAgIHRoaXMudGV4dCA9IHRyaW1tZWQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIHJlbW92ZSBhbnkgbGVhZGluZyB3aGl0ZXNwYWNlXG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0ID0gdHJpbW1lZC5yZXBsYWNlKC9eXFxzKi8sIFwiXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5wcm9ibGVtLm9wdGlvbnMubGFuZ3VhZ2UgPT0gXCJqYXZhXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRleHQgPSB0aGlzLnRleHQucmVwbGFjZSgvXFx0L2csIFwiICAgIFwiKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50ZXh0LnRvTG93ZXJDYXNlKCkuc3RhcnRzV2l0aChcInB1YmxpYyBjbGFzc1wiKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmluZGVudCA9IDA7IC8vIFNldCBpbmRlbnQgdG8gMCBmb3IgY2xhc3Mgc3RhcnRcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmluZGVudCA9IHRyaW1tZWQubGVuZ3RoIC0gdGhpcy50ZXh0Lmxlbmd0aDsgLy8gQ2FsY3VsYXRlIG5vcm1hbCBpbmRlbnRhdGlvblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYWxsTGluZXMgPSB0aGlzLnByb2JsZW0ubGluZXM7XG4gICAgICAgICAgICAgICAgLy8gcHV0IGluZGVudGF0aW9uIG9mIGltcG9ydCBsaW5lIGFzIDBcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50ZXh0LnRvTG93ZXJDYXNlKCkuc3RhcnRzV2l0aChcImltcG9ydFwiKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmluZGVudCA9IDA7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIGxpbmUgaXMgYSBjbGFzcyBkZWZpbml0aW9uIC0gaWYgc28sIHRoZW4gZG8gbm90IHNldCB1cCBpbmRlbnRhdGlvbiBvZiBkZWYgbGluZSBhcyAwXG4gICAgICAgICAgICAgICAgaWYgKGhhc1RvcExldmVsQ2xhc3MoYWxsTGluZXMpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnRleHQudG9Mb3dlckNhc2UoKS5zdGFydHNXaXRoKFwiY2xhc3NcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5kZW50ID0gMDsgLy8gU2V0IGluZGVudCB0byAwIGZvciBjbGFzcyBzdGFydFxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbmRlbnQgPSB0cmltbWVkLmxlbmd0aCAtIHRoaXMudGV4dC5sZW5ndGg7IC8vIENhbGN1bGF0ZSBub3JtYWwgaW5kZW50YXRpb25cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIENoZWNrIGlmIHRoZSBsaW5lIGlzIGEgZnVuY3Rpb24gZGVmaW5pdGlvbiAtIGlmIHNvLCB0aGVuIHNldCB1cCBpbmRlbnRhdGlvbiBvZiBkZWYgbGluZSBhcyAwXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnRleHQudG9Mb3dlckNhc2UoKS5zdGFydHNXaXRoKFwiZGVmXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmluZGVudCA9IDA7IC8vIFNldCBpbmRlbnQgdG8gMCBmb3IgZGVmIHN0YXJ0XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmluZGVudCA9IHRyaW1tZWQubGVuZ3RoIC0gdGhpcy50ZXh0Lmxlbmd0aDsgLy8gQ2FsY3VsYXRlIG5vcm1hbCBpbmRlbnRhdGlvblxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy50ZXh0ID0gdHJpbW1lZC5yZXBsYWNlKC9eXFxzKi8sIFwiXCIpO1xuICAgICAgICAgICAgdGhpcy5pbmRlbnQgPSB0cmltbWVkLmxlbmd0aCAtIHRoaXMudGV4dC5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBWaWV3XG4gICAgICAgIHZhciB2aWV3O1xuICAgICAgICAvLyBUT0RPOiB0aGlzIGRvZXMgbm90IHdvcmsgd2l0aCBkaXNwbGF5IG1hdGguLi4gUGVyaGFwcyB3aXRoIHByZXRleHQgd2Ugc2hvdWxkIGhhdmUgaHRtbCBhcyBhIGxhbmd1YWdlIGFuZCBkbyBub3RoaW5nP1xuXG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHByb2JsZW0ub3B0aW9ucy5sYW5ndWFnZSA9PSBcIm5hdHVyYWxcIiB8fFxuICAgICAgICAgICAgcHJvYmxlbS5vcHRpb25zLmxhbmd1YWdlID09IFwibWF0aFwiIHx8XG4gICAgICAgICAgICBwcm9ibGVtLm9wdGlvbnMubGFuZ3VhZ2UgPT0gXCJ0ZXh0XCJcbiAgICAgICAgKSB7XG4gICAgICAgICAgICBpZiAoIWRpc3BsYXltYXRoKSB7XG4gICAgICAgICAgICAgICAgdmlldyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2aWV3ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZpZXcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY29kZVwiKTtcbiAgICAgICAgICAgIGlmIChwcm9ibGVtLm9wdGlvbnMucHJldHRpZnlMYW5ndWFnZSkge1xuICAgICAgICAgICAgICAgIHZpZXcuY2xhc3NMaXN0LmFkZChcbiAgICAgICAgICAgICAgICAgICAgLi4ucHJvYmxlbS5vcHRpb25zLnByZXR0aWZ5TGFuZ3VhZ2Uuc3BsaXQoXCIgXCIpLFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmlldy5pZCA9IHByb2JsZW0uY291bnRlcklkICsgXCItbGluZS1cIiArIHRoaXMuaW5kZXg7XG4gICAgICAgIHZpZXcuaW5uZXJIVE1MICs9IHRoaXMudGV4dDtcbiAgICAgICAgdGhpcy52aWV3ID0gdmlldztcbiAgICAgICAgcHJvYmxlbS5saW5lcy5wdXNoKHRoaXMpO1xuICAgIH1cbiAgICAvLyBJbml0aWFsaXplIHdoYXQgd2lkdGggdGhlIGxpbmUgd291bGQgbmF0dXJhbGx5IGhhdmUgKHdpdGhvdXQgaW5kZW50KVxuICAgIGluaXRpYWxpemVXaWR0aCgpIHtcbiAgICAgICAgLy8gdGhpcy53aWR0aCBkb2VzIG5vdCBhcHBlYXIgdG8gYmUgdXNlZCBhbnl3aGVyZSBsYXRlclxuICAgICAgICAvLyBzaW5jZSBjaGFuZ2luZyB0aGUgdmFsdWUgb2YgdGhpcy53aWR0aCBhcHBlYXJzIHRvIGhhdmUgbm8gZWZmZWN0LiAtIFZpbmNlbnQgUWl1IChTZXB0ZW1iZXIgMjAyMClcbiAgICAgICAgdGhpcy53aWR0aCA9XG4gICAgICAgICAgICBvdXRlcldpZHRoKHRoaXMudmlldykgLVxuICAgICAgICAgICAgdGhpcy5wcm9ibGVtLm9wdGlvbnMucGl4ZWxzUGVySW5kZW50ICogdGhpcy5pbmRlbnQ7XG5cbiAgICAgICAgLy8gUGFzcyB0aGlzIGluZm9ybWF0aW9uIG9uIHRvIGJlIHVzZWQgaW4gY2xhc3MgUGFyc29ucyBmdW5jdGlvbiBpbml0aWFsaXplQXJlYXNcbiAgICAgICAgLy8gdG8gbWFudWFsbHkgZGV0ZXJtaW5lIGFwcHJvcHJpYXRlIHdpZHRocyAtIFZpbmNlbnQgUWl1IChTZXB0ZW1iZXIgMjAyMClcbiAgICAgICAgdGhpcy52aWV3LmZvbnRTaXplID0gd2luZG93XG4gICAgICAgICAgICAuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLnZpZXcsIG51bGwpXG4gICAgICAgICAgICAuZ2V0UHJvcGVydHlWYWx1ZShcImZvbnQtc2l6ZVwiKTtcbiAgICAgICAgdGhpcy52aWV3LnBpeGVsc1BlckluZGVudCA9IHRoaXMucHJvYmxlbS5vcHRpb25zLnBpeGVsc1BlckluZGVudDtcbiAgICAgICAgdGhpcy52aWV3LmluZGVudCA9IHRoaXMuaW5kZW50O1xuXG4gICAgICAgIC8vIEZpZ3VyZSBvdXQgd2hpY2ggdHlwZWZhY2Ugd2lsbCBiZSByZW5kZXJlZCBieSBjb21wYXJpbmcgdGV4dCB3aWR0aHMgdG8gYnJvd3NlciBkZWZhdWx0IC0gVmluY2VudCBRaXUgKFNlcHRlbWJlciAyMDIwKVxuICAgICAgICB2YXIgdGVtcENhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG4gICAgICAgIHZhciB0ZW1wQ2FudmFzQ3R4ID0gdGVtcENhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgICAgIHZhciBwb3NzaWJsZUZvbnRzID0gd2luZG93XG4gICAgICAgICAgICAuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLnZpZXcsIG51bGwpXG4gICAgICAgICAgICAuZ2V0UHJvcGVydHlWYWx1ZShcImZvbnQtZmFtaWx5XCIpXG4gICAgICAgICAgICAuc3BsaXQoXCIsIFwiKTtcbiAgICAgICAgdmFyIGZpbGxlclRleHQgPSBcImFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSwuLyFAIyQlXiYqLStcIjtcbiAgICAgICAgdGVtcENhbnZhc0N0eC5mb250ID0gdGhpcy52aWV3LmZvbnRTaXplICsgXCIgc2VyaWZcIjtcbiAgICAgICAgdmFyIHNlcmlmV2lkdGggPSB0ZW1wQ2FudmFzQ3R4Lm1lYXN1cmVUZXh0KGZpbGxlclRleHQpLndpZHRoO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBvc3NpYmxlRm9udHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChwb3NzaWJsZUZvbnRzW2ldLmluY2x1ZGVzKCdcIicpKSB7XG4gICAgICAgICAgICAgICAgcG9zc2libGVGb250c1tpXSA9IHBvc3NpYmxlRm9udHNbaV0ucmVwbGFjZUFsbCgnXCInLCBcIlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwb3NzaWJsZUZvbnRzW2ldLmluY2x1ZGVzKFwiJ1wiKSkge1xuICAgICAgICAgICAgICAgIHBvc3NpYmxlRm9udHNbaV0gPSBwb3NzaWJsZUZvbnRzW2ldLnJlcGxhY2VBbGwoXCInXCIsIFwiXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGVtcENhbnZhc0N0eC5mb250ID0gdGhpcy52aWV3LmZvbnRTaXplICsgXCIgXCIgKyBwb3NzaWJsZUZvbnRzW2ldO1xuICAgICAgICAgICAgaWYgKHRlbXBDYW52YXNDdHgubWVhc3VyZVRleHQoZmlsbGVyVGV4dCkud2lkdGggIT09IHNlcmlmV2lkdGgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnZpZXcuZm9udEZhbWlseSA9IHBvc3NpYmxlRm9udHNbaV07XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gQW5zd2VyIHRoZSBibG9jayB0aGF0IHRoaXMgbGluZSBpcyBjdXJyZW50bHkgaW5cbiAgICBibG9jaygpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnByb2JsZW0uYmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgYmxvY2sgPSB0aGlzLnByb2JsZW0uYmxvY2tzW2ldO1xuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBibG9jay5saW5lcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIGlmIChibG9jay5saW5lc1tqXSA9PT0gdGhpcykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmxvY2s7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIC8vIEFuc3dlciB0aGUgaW5kZW50IGJhc2VkIG9uIHRoZSB2aWV3XG4gICAgdmlld0luZGVudCgpIHtcbiAgICAgICAgaWYgKHRoaXMucHJvYmxlbS5ub2luZGVudCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaW5kZW50O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIGJsb2NrID0gdGhpcy5ibG9jaygpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaW5kZW50IC0gYmxvY2suc29sdXRpb25JbmRlbnQoKSArIGJsb2NrLmluZGVudDtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCBQYXJzb25zTGluZSBmcm9tIFwiLi9wYXJzb25zTGluZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQbGFjZWhvbGRlckxpbmUgZXh0ZW5kcyBQYXJzb25zTGluZSB7XG4gICAgY29uc3RydWN0b3IocHJvYmxlbSkge1xuICAgICAgICBzdXBlcihwcm9ibGVtLCBcInBsYWNlaG9sZGVyXCIsIGZhbHNlKTtcbiAgICAgICAgdGhpcy5pc1BsYWNlaG9sZGVyTGluZSA9IHRydWU7XG4gICAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGluZUJhc2VkR3JhZGVyIHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9ibGVtKSB7XG4gICAgICAgIHRoaXMucHJvYmxlbSA9IHByb2JsZW07XG4gICAgfVxuICAgIC8vIFVzZSBhIExJUyAoTG9uZ2VzdCBJbmNyZWFzaW5nIFN1YnNlcXVlbmNlKSBhbGdvcml0aG0gdG8gcmV0dXJuIHRoZSBpbmRleGVzXG4gICAgLy8gdGhhdCBhcmUgbm90IHBhcnQgb2YgdGhhdCBzdWJzZXF1ZW5jZS5cbiAgICBpbnZlcnNlTElTSW5kaWNlcyhhcnIpIHtcbiAgICAgICAgLy8gR2V0IGFsbCBzdWJzZXF1ZW5jZXNcbiAgICAgICAgdmFyIGFsbFN1YnNlcXVlbmNlcyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHN1YnNlcXVlbmNlRm9yQ3VycmVudCA9IFthcnJbaV1dO1xuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBpOyBqKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgIGFycltqXSA8IGFycltpXSAmJlxuICAgICAgICAgICAgICAgICAgICBhbGxTdWJzZXF1ZW5jZXNbal0ubGVuZ3RoICsgMSA+IHN1YnNlcXVlbmNlRm9yQ3VycmVudC5sZW5ndGhcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgc3Vic2VxdWVuY2VGb3JDdXJyZW50ID0gYWxsU3Vic2VxdWVuY2VzW2pdLmNvbmNhdChhcnJbaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFsbFN1YnNlcXVlbmNlcy5wdXNoKHN1YnNlcXVlbmNlRm9yQ3VycmVudCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gRmlndXJlIG91dCB0aGUgbG9uZ2VzdCBvbmVcbiAgICAgICAgdmFyIGxvbmdlc3RTdWJzZXF1ZW5jZUxlbmd0aCA9IC0xO1xuICAgICAgICB2YXIgbG9uZ2VzdFN1YnNlcXVlbmNlO1xuICAgICAgICBmb3IgKGxldCBpIGluIGFsbFN1YnNlcXVlbmNlcykge1xuICAgICAgICAgICAgdmFyIHN1YnMgPSBhbGxTdWJzZXF1ZW5jZXNbaV07XG4gICAgICAgICAgICBpZiAoc3Vicy5sZW5ndGggPiBsb25nZXN0U3Vic2VxdWVuY2VMZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBsb25nZXN0U3Vic2VxdWVuY2VMZW5ndGggPSBzdWJzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBsb25nZXN0U3Vic2VxdWVuY2UgPSBzdWJzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIENyZWF0ZSB0aGUgaW52ZXJzZSBpbmRleGVzXG4gICAgICAgIHZhciBpbmRleGVzID0gW107XG4gICAgICAgIHZhciBsSW5kZXggPSAwO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGxJbmRleCA+IGxvbmdlc3RTdWJzZXF1ZW5jZS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBpbmRleGVzLnB1c2goaSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChhcnJbaV0gPT0gbG9uZ2VzdFN1YnNlcXVlbmNlW2xJbmRleF0pIHtcbiAgICAgICAgICAgICAgICAgICAgbEluZGV4ICs9IDE7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaW5kZXhlcy5wdXNoKGkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaW5kZXhlcztcbiAgICB9XG4gICAgLy8gZ3JhZGUgdGhhdCBlbGVtZW50LCByZXR1cm5pbmcgdGhlIHN0YXRlXG4gICAgZ3JhZGUoKSB7XG4gICAgICAgIHZhciBwcm9ibGVtID0gdGhpcy5wcm9ibGVtO1xuICAgICAgICBwcm9ibGVtLmNsZWFyRmVlZGJhY2soKTtcbiAgICAgICAgdGhpcy5jb3JyZWN0TGluZXMgPSAwO1xuICAgICAgICB0aGlzLnBlcmNlbnRMaW5lcyA9IDA7XG4gICAgICAgIHRoaXMuaW5jb3JyZWN0SW5kZW50cyA9IDA7XG4gICAgICAgIHZhciBzb2x1dGlvbkxpbmVzID0gcHJvYmxlbS5zb2x1dGlvbjtcbiAgICAgICAgdmFyIGFuc3dlckxpbmVzID0gcHJvYmxlbS5hbnN3ZXJMaW5lcygpO1xuICAgICAgICB2YXIgaTtcbiAgICAgICAgdmFyIHN0YXRlO1xuICAgICAgICB0aGlzLnBlcmNlbnRMaW5lcyA9XG4gICAgICAgICAgICBNYXRoLm1pbihhbnN3ZXJMaW5lcy5sZW5ndGgsIHNvbHV0aW9uTGluZXMubGVuZ3RoKSAvXG4gICAgICAgICAgICBNYXRoLm1heChhbnN3ZXJMaW5lcy5sZW5ndGgsIHNvbHV0aW9uTGluZXMubGVuZ3RoKTtcbiAgICAgICAgaWYgKGFuc3dlckxpbmVzLmxlbmd0aCA8IHNvbHV0aW9uTGluZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBzdGF0ZSA9IFwiaW5jb3JyZWN0VG9vU2hvcnRcIjtcbiAgICAgICAgICAgIHRoaXMuY29ycmVjdExlbmd0aCA9IGZhbHNlO1xuICAgICAgICB9IGVsc2UgaWYgKGFuc3dlckxpbmVzLmxlbmd0aCA9PSBzb2x1dGlvbkxpbmVzLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhpcy5jb3JyZWN0TGVuZ3RoID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0YXRlID0gXCJpbmNvcnJlY3RNb3ZlQmxvY2tzXCI7XG4gICAgICAgICAgICB0aGlzLmNvcnJlY3RMZW5ndGggPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIERldGVybWluZSB3aGV0aGVyIHRoZSBjb2RlICoqdGhhdCBpcyB0aGVyZSoqIGlzIGluIHRoZSBjb3JyZWN0IG9yZGVyXG4gICAgICAgIC8vIElmIHRoZXJlIGlzIHRvbyBtdWNoIG9yIHRvbyBsaXR0bGUgY29kZSB0aGlzIG9ubHkgbWF0dGVycyBmb3JcbiAgICAgICAgLy8gY2FsY3VsYXRpbmcgYSBwZXJjZW50YWdlIHNjb3JlLlxuICAgICAgICBsZXQgaXNDb3JyZWN0T3JkZXIgPSB0aGlzLmNoZWNrQ29ycmVjdE9yZGVyaW5nKFxuICAgICAgICAgICAgc29sdXRpb25MaW5lcyxcbiAgICAgICAgICAgIGFuc3dlckxpbmVzLFxuICAgICAgICApO1xuXG4gICAgICAgIC8vIERldGVybWluZSB3aGV0aGVyIGJsb2NrcyBhcmUgaW5kZW50ZWQgY29ycmVjdGx5XG4gICAgICAgIGxldCBpc0NvcnJlY3RJbmRlbnRzID0gdGhpcy5jaGVja0NvcnJlY3RJbmRlbnRhdGlvbihcbiAgICAgICAgICAgIHNvbHV0aW9uTGluZXMsXG4gICAgICAgICAgICBhbnN3ZXJMaW5lcyxcbiAgICAgICAgKTtcblxuICAgICAgICBpZiAoaXNDb3JyZWN0SW5kZW50cyAmJiBpc0NvcnJlY3RPcmRlciAmJiB0aGlzLmNvcnJlY3RMZW5ndGgpIHtcbiAgICAgICAgICAgIC8vIFBlcmZlY3RcbiAgICAgICAgICAgIHN0YXRlID0gXCJjb3JyZWN0XCI7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5jb3JyZWN0TGVuZ3RoICYmIGlzQ29ycmVjdE9yZGVyKSB7XG4gICAgICAgICAgICBzdGF0ZSA9IFwiaW5jb3JyZWN0SW5kZW50XCI7XG4gICAgICAgIH0gZWxzZSBpZiAoIWlzQ29ycmVjdE9yZGVyICYmIHN0YXRlICE9IFwiaW5jb3JyZWN0VG9vU2hvcnRcIikge1xuICAgICAgICAgICAgc3RhdGUgPSBcImluY29ycmVjdE1vdmVCbG9ja3NcIjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNhbGN1bGF0ZVBlcmNlbnQoKTtcbiAgICAgICAgdGhpcy5ncmFkZXJTdGF0ZSA9IHN0YXRlO1xuXG4gICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICB9XG5cbiAgICBjaGVja0NvcnJlY3RJbmRlbnRhdGlvbihzb2x1dGlvbkxpbmVzLCBhbnN3ZXJMaW5lcykge1xuICAgICAgICBpZiAoIXRoaXMucHJvYmxlbS51c2VzSW5kZW50YXRpb24oKSkgcmV0dXJuIHRydWU7XG5cbiAgICAgICAgdGhpcy5pbmRlbnRMZWZ0ID0gW107XG4gICAgICAgIHRoaXMuaW5kZW50UmlnaHQgPSBbXTtcbiAgICAgICAgbGV0IGxvb3BMaW1pdCA9IE1hdGgubWluKHNvbHV0aW9uTGluZXMubGVuZ3RoLCBhbnN3ZXJMaW5lcy5sZW5ndGgpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxvb3BMaW1pdDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoYW5zd2VyTGluZXNbaV0udmlld0luZGVudCgpIDwgc29sdXRpb25MaW5lc1tpXS5pbmRlbnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmluZGVudFJpZ2h0LnB1c2goYW5zd2VyTGluZXNbaV0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChhbnN3ZXJMaW5lc1tpXS52aWV3SW5kZW50KCkgPiBzb2x1dGlvbkxpbmVzW2ldLmluZGVudCkge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5kZW50TGVmdC5wdXNoKGFuc3dlckxpbmVzW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmluY29ycmVjdEluZGVudHMgPVxuICAgICAgICAgICAgdGhpcy5pbmRlbnRMZWZ0Lmxlbmd0aCArIHRoaXMuaW5kZW50UmlnaHQubGVuZ3RoO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmluY29ycmVjdEluZGVudHMgPT0gMDtcbiAgICB9XG5cbiAgICBjaGVja0NvcnJlY3RPcmRlcmluZyhzb2x1dGlvbkxpbmVzLCBhbnN3ZXJMaW5lcykge1xuICAgICAgICBsZXQgaXNDb3JyZWN0T3JkZXIgPSB0cnVlO1xuICAgICAgICB0aGlzLmNvcnJlY3RMaW5lcyA9IDA7XG4gICAgICAgIHRoaXMuc29sdXRpb25MZW5ndGggPSBzb2x1dGlvbkxpbmVzLmxlbmd0aDtcbiAgICAgICAgbGV0IGxvb3BMaW1pdCA9IE1hdGgubWluKHNvbHV0aW9uTGluZXMubGVuZ3RoLCBhbnN3ZXJMaW5lcy5sZW5ndGgpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxvb3BMaW1pdDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoYW5zd2VyTGluZXNbaV0udGV4dCAhPT0gc29sdXRpb25MaW5lc1tpXS50ZXh0KSB7XG4gICAgICAgICAgICAgICAgaXNDb3JyZWN0T3JkZXIgPSBmYWxzZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb3JyZWN0TGluZXMgKz0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaXNDb3JyZWN0T3JkZXI7XG4gICAgfVxuXG4gICAgY2FsY3VsYXRlUGVyY2VudCgpIHtcbiAgICAgICAgbGV0IG51bUxpbmVzID0gdGhpcy5wZXJjZW50TGluZXMgKiAwLjI7XG4gICAgICAgIGxldCBsaW5lcyA9IHRoaXMucHJvYmxlbS5hbnN3ZXJMaW5lcygpLmxlbmd0aDtcbiAgICAgICAgbGV0IG51bUNvcnJlY3RCbG9ja3MgPSAodGhpcy5jb3JyZWN0TGluZXMgLyBsaW5lcykgKiAwLjQ7XG4gICAgICAgIGxldCBudW1Db3JyZWN0SW5kZW50cyA9XG4gICAgICAgICAgICAoKHRoaXMuY29ycmVjdExpbmVzIC0gdGhpcy5pbmNvcnJlY3RJbmRlbnRzKSAvIGxpbmVzKSAqIDAuNDtcblxuICAgICAgICBsZXQgc2NvcmUgPSBudW1MaW5lcyArIG51bUNvcnJlY3RCbG9ja3MgKyBudW1Db3JyZWN0SW5kZW50cztcbiAgICAgICAgc2NvcmUgPSBNYXRoLm1heChzY29yZSwgMCk7XG4gICAgICAgIHRoaXMucHJvYmxlbS5wZXJjZW50ID0gc2NvcmU7XG4gICAgfVxufVxuIiwiLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PT09IFBhcnNvbnNCbG9jayBPYmplY3QgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09PT09PT09IFRoZSBtb2RlbCBhbmQgdmlldyBvZiBhIGNvZGUgYmxvY2suXG49PT09IFBST1BFUlRJRVMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09PT09PT09IHByb2JsZW06IHRoZSBQYXJzb25zIHByb2JsZW1cbj09PT09PT09IGxpbmVzOiBhbiBhcnJheSBvZiBQYXJzb25zTGluZSBpbiB0aGlzIGJsb2NrXG49PT09PT09PSBpbmRlbnQ6IGluZGVudCBiYXNlZCBvbiBtb3ZlbWVudFxuPT09PT09PT0gdmlldzogYW4gZWxlbWVudCBmb3Igdmlld2luZyB0aGlzIG9iamVjdFxuPT09PT09PT0gbGFiZWxzOiBbbGFiZWwsIGxpbmVdIHRoZSBsYWJlbHMgbnVtYmVyaW5nIHRoZSBibG9jayBhbmQgdGhlIGxpbmVzIHRoZXkgZ28gb25cbj09PT09PT09IGhhbW1lcjogdGhlIGNvbnRyb2xsZXIgYmFzZWQgb24gaGFtbWVyLmpzXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuaW1wb3J0IEhhbW1lciBmcm9tIFwiLi9oYW1tZXIubWluLmpzXCI7XG5cbmNvbnN0IElOREVOVF9DTEFTU0VTID0gW1xuICAgIFwiaW5kZW50MVwiLFxuICAgIFwiaW5kZW50MlwiLFxuICAgIFwiaW5kZW50M1wiLFxuICAgIFwiaW5kZW50NFwiLFxuICAgIFwiaW5kZW50NVwiLFxuICAgIFwiaW5kZW50NlwiLFxuXTtcblxuLy8gSW5pdGlhbGl6ZSBiYXNlZCBvbiB0aGUgcHJvYmxlbSBhbmQgdGhlIGxpbmVzXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYXJzb25zQmxvY2sge1xuICAgIGNvbnN0cnVjdG9yKHByb2JsZW0sIGxpbmVzKSB7XG4gICAgICAgIHRoaXMucHJvYmxlbSA9IHByb2JsZW07XG4gICAgICAgIHRoaXMubGluZXMgPSBsaW5lcztcbiAgICAgICAgdGhpcy5pbmRlbnQgPSAwO1xuICAgICAgICB0aGlzLmxhYmVscyA9IFtdO1xuICAgICAgICAvLyBDcmVhdGUgdmlldywgYWRkaW5nIHZpZXcgb2YgbGluZXMgYW5kIHVwZGF0aW5nIGluZGVudFxuICAgICAgICB2YXIgdmlldyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHZpZXcuaWQgPSBwcm9ibGVtLmNvdW50ZXJJZCArIFwiLWJsb2NrLVwiICsgcHJvYmxlbS5ibG9ja0luZGV4O1xuICAgICAgICBwcm9ibGVtLmJsb2NrSW5kZXggKz0gMTtcbiAgICAgICAgdmlldy5jbGFzc0xpc3QuYWRkKFwiYmxvY2tcIik7XG4gICAgICAgIHZpZXcuc2V0QXR0cmlidXRlKFwicm9sZVwiLCBcImJ1dHRvblwiKTtcbiAgICAgICAgdmFyIHNoYXJlZEluZGVudCA9IGxpbmVzWzBdLmluZGVudDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgc2hhcmVkSW5kZW50ID0gTWF0aC5taW4oc2hhcmVkSW5kZW50LCBsaW5lc1tpXS5pbmRlbnQpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBsaW5lRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgbGluZURpdi5jbGFzc0xpc3QuYWRkKFwibGluZXNcIik7XG4gICAgICAgIHZpZXcuYXBwZW5kKGxpbmVEaXYpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgbGluZSA9IGxpbmVzW2ldO1xuICAgICAgICAgICAgdmFyIGxpbmVJbmRlbnQ7XG4gICAgICAgICAgICBpZiAocHJvYmxlbS5ub2luZGVudCkge1xuICAgICAgICAgICAgICAgIGxpbmVJbmRlbnQgPSBsaW5lLmluZGVudDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGluZUluZGVudCA9IGxpbmUuaW5kZW50IC0gc2hhcmVkSW5kZW50O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGluZS52aWV3LmNsYXNzTGlzdC5yZW1vdmUoLi4uSU5ERU5UX0NMQVNTRVMpO1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS5vcHRpb25zLmxhbmd1YWdlICE9IFwibmF0dXJhbFwiICYmXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLm9wdGlvbnMubGFuZ3VhZ2UgIT0gXCJtYXRoXCIgJiZcbiAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0ub3B0aW9ucy5sYW5ndWFnZSAhPSBcInRleHRcIlxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgaWYgKGxpbmVJbmRlbnQgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGxpbmUudmlldy5jbGFzc0xpc3QuYWRkKFwiaW5kZW50XCIgKyBsaW5lSW5kZW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsaW5lRGl2LmFwcGVuZENoaWxkKGxpbmUudmlldyk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGxhYmVsRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgbGFiZWxEaXYuY2xhc3NMaXN0LmFkZChcImxhYmVsc1wiKTtcbiAgICAgICAgaWYgKHRoaXMucHJvYmxlbS5vcHRpb25zLm51bWJlcmVkID09IFwibGVmdFwiKSB7XG4gICAgICAgICAgICBsaW5lRGl2LmNsYXNzTGlzdC5hZGQoXCJib3JkZXJfbGVmdFwiKTtcbiAgICAgICAgICAgIHZpZXcucHJlcGVuZChsYWJlbERpdik7XG4gICAgICAgICAgICB2aWV3LnN0eWxlLmp1c3RpZnlDb250ZW50ID0gXCJmbGV4LXN0YXJ0XCI7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5wcm9ibGVtLm9wdGlvbnMubnVtYmVyZWQgPT0gXCJyaWdodFwiKSB7XG4gICAgICAgICAgICBsYWJlbERpdi5jbGFzc0xpc3QuYWRkKFwiYm9yZGVyX2xlZnRcIik7XG4gICAgICAgICAgICBsYWJlbERpdi5zdHlsZS5mbG9hdCA9IFwicmlnaHRcIjtcbiAgICAgICAgICAgIHZpZXcuc3R5bGUuanVzdGlmeUNvbnRlbnQgPSBcInNwYWNlLWJldHdlZW5cIjtcbiAgICAgICAgICAgIHZpZXcuYXBwZW5kKGxhYmVsRGl2KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnZpZXcgPSB2aWV3O1xuICAgICAgICAvLyBpcyBub3QgcGxhY2Vob2xkZXIgYnkgZGVmYXVsdFxuICAgICAgICB0aGlzLmlzUGxhY2Vob2xkZXIgPSBmYWxzZTtcbiAgICB9XG4gICAgLy8gQWRkIGEgbGluZSAoZnJvbSBhbm90aGVyIGJsb2NrKSB0byB0aGlzIGJsb2NrXG4gICAgYWRkTGluZShsaW5lKSB7XG4gICAgICAgIGxpbmUudmlldy5jbGFzc0xpc3QucmVtb3ZlKC4uLklOREVOVF9DTEFTU0VTKTtcbiAgICAgICAgaWYgKHRoaXMucHJvYmxlbS5ub2luZGVudCkge1xuICAgICAgICAgICAgaWYgKGxpbmUuaW5kZW50ID4gMCkge1xuICAgICAgICAgICAgICAgIGxpbmUudmlldy5jbGFzc0xpc3QuYWRkKFwiaW5kZW50XCIgKyBsaW5lLmluZGVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgbGluZXMgPSB0aGlzLmxpbmVzO1xuICAgICAgICAgICAgdmFyIHNoYXJlZEluZGVudCA9IGxpbmVzWzBdLmluZGVudDtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBzaGFyZWRJbmRlbnQgPSBNYXRoLm1pbihzaGFyZWRJbmRlbnQsIGxpbmVzW2ldLmluZGVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2hhcmVkSW5kZW50IDwgbGluZS5pbmRlbnQpIHtcbiAgICAgICAgICAgICAgICBsaW5lLnZpZXcuY2xhc3NMaXN0LmFkZChcbiAgICAgICAgICAgICAgICAgICAgXCJpbmRlbnRcIiArIChsaW5lLmluZGVudCAtIHNoYXJlZEluZGVudCksXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc2hhcmVkSW5kZW50ID4gbGluZS5pbmRlbnQpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGxpbmVzW2ldLnZpZXcuY2xhc3NMaXN0LnJlbW92ZSguLi5JTkRFTlRfQ0xBU1NFUyk7XG4gICAgICAgICAgICAgICAgICAgIC8vIHRvZG86IGlmIGxhbmd1YWdlIGlzIG5hdHVyYWwgb3IgbWF0aCB0aGVuIGRvbid0IGRvIHRoaXNcbiAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLm9wdGlvbnMubGFuZ3VhZ2UgIT09IFwibmF0dXJhbFwiICYmXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0ub3B0aW9ucy5sYW5ndWFnZSAhPT0gXCJtYXRoXCIgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbVxuICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVzW2ldLnZpZXcuY2xhc3NMaXN0LmFkZChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImluZGVudFwiICsgKGxpbmVzW2ldLmluZGVudCAtIGxpbmUuaW5kZW50KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5saW5lcy5wdXNoKGxpbmUpO1xuICAgICAgICB0aGlzLnZpZXcucXVlcnlTZWxlY3RvcihcIi5saW5lc1wiKS5hcHBlbmRDaGlsZChsaW5lLnZpZXcpO1xuICAgIH1cbiAgICAvLyBBZGQgdGhlIGNvbnRlbnRzIG9mIHRoYXQgYmxvY2sgdG8gbXlzZWxmIGFuZCB0aGVuIGRlbGV0ZSB0aGF0IGJsb2NrXG4gICAgY29uc3VtZUJsb2NrKGJsb2NrKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYmxvY2subGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuYWRkTGluZShibG9jay5saW5lc1tpXSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGJsb2NrLnZpZXcuZ2V0QXR0cmlidXRlKFwidGFiaW5kZXhcIikgPT0gXCIwXCIpIHtcbiAgICAgICAgICAgIHRoaXMubWFrZVRhYkluZGV4KCk7XG4gICAgICAgIH1cbiAgICAgICAgYmxvY2sudmlldy5yZW1vdmUoKTtcbiAgICAgICAgdmFyIG5ld0Jsb2NrcyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucHJvYmxlbS5ibG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByb2JsZW0uYmxvY2tzW2ldICE9PSBibG9jaykge1xuICAgICAgICAgICAgICAgIG5ld0Jsb2Nrcy5wdXNoKHRoaXMucHJvYmxlbS5ibG9ja3NbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYmxvY2subGFiZWxzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmFkZExhYmVsKFxuICAgICAgICAgICAgICAgIGJsb2NrLmxhYmVsc1tpXVswXSxcbiAgICAgICAgICAgICAgICB0aGlzLmxpbmVzLmxlbmd0aCAtIGJsb2NrLmxpbmVzLmxlbmd0aCArIGJsb2NrLmxhYmVsc1tpXVsxXSxcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wcm9ibGVtLmJsb2NrcyA9IG5ld0Jsb2NrcztcbiAgICAgICAgdGhpcy5wcm9ibGVtLnN0YXRlID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLnByb2JsZW0udXBkYXRlVmlldygpO1xuICAgIH1cbiAgICAvLyBVcGRhdGUgdGhlIG1vZGVsIGFuZCB2aWV3IHdoZW4gYmxvY2sgaXMgY29udmVydGVkIHRvIGNvbnRhaW4gaW5kZW50XG4gICAgYWRkSW5kZW50KCkge1xuICAgICAgICAvLyBVcGRhdGUgdGhlIGxpbmVzIG1vZGVsIC8gdmlld1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBsaW5lID0gdGhpcy5saW5lc1tpXTtcbiAgICAgICAgICAgIGlmIChsaW5lLmluZGVudCA+IDApIHtcbiAgICAgICAgICAgICAgICBsaW5lLnZpZXcuY2xhc3NMaXN0LnJlbW92ZSguLi5JTkRFTlRfQ0xBU1NFUyk7XG4gICAgICAgICAgICAgICAgbGluZS52aWV3LmNsYXNzTGlzdC5hZGQoXCJpbmRlbnRcIiArIGxpbmUuaW5kZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBVcGRhdGUgdGhlIGJsb2NrIG1vZGVsIC8gdmlld1xuICAgICAgICB0aGlzLmluZGVudCA9IDA7XG4gICAgICAgIHRoaXMudmlldy5zdHlsZS5wYWRkaW5nTGVmdCA9IFwiXCI7XG4gICAgICAgIHRoaXMudmlldy5zdHlsZS53aWR0aCA9IHRoaXMucHJvYmxlbS5hcmVhV2lkdGggLSAyMiArIFwicHhcIjtcbiAgICB9XG4gICAgLy8gQWRkIGEgbGFiZWwgdG8gYmxvY2sgYW5kIHVwZGF0ZSBpdHMgdmlld1xuICAgIGFkZExhYmVsKGxhYmVsLCBsaW5lKSB7XG4gICAgICAgIHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBkaXYuY2xhc3NMaXN0LmFkZChcImJsb2NrLWxhYmVsXCIpO1xuICAgICAgICBpZiAodGhpcy5wcm9ibGVtLm9wdGlvbnMubnVtYmVyZWQgPT0gXCJyaWdodFwiKSB7XG4gICAgICAgICAgICBkaXYuY2xhc3NMaXN0LmFkZChcInJpZ2h0LWxhYmVsXCIpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnByb2JsZW0ub3B0aW9ucy5udW1iZXJlZCA9PSBcImxlZnRcIikge1xuICAgICAgICAgICAgZGl2LmNsYXNzTGlzdC5hZGQoXCJsZWZ0LWxhYmVsXCIpO1xuICAgICAgICB9XG4gICAgICAgIGRpdi5hcHBlbmQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUobGFiZWwpKTtcbiAgICAgICAgdGhpcy52aWV3LnF1ZXJ5U2VsZWN0b3IoXCIubGFiZWxzXCIpLmFwcGVuZChkaXYpO1xuICAgICAgICBpZiAodGhpcy5sYWJlbHMubGVuZ3RoICE9IDApIHtcbiAgICAgICAgICAgIGRpdi5zdHlsZS5tYXJnaW5Ub3AgPVxuICAgICAgICAgICAgICAgIChsaW5lIC0gdGhpcy5sYWJlbHNbdGhpcy5sYWJlbHMubGVuZ3RoIC0gMV1bMV0gLSAxKSAqXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGluZXNbbGluZV0udmlldy5vZmZzZXRIZWlnaHQgK1xuICAgICAgICAgICAgICAgIFwicHhcIjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxhYmVscy5wdXNoKFtsYWJlbCwgbGluZV0pO1xuICAgIH1cbiAgICAvLyBJbml0aWFsaXplIEludGVyYWN0aXZpdHlcbiAgICBpbml0aWFsaXplSW50ZXJhY3Rpdml0eSgpIHtcbiAgICAgICAgLy8gQWx3YXlzIHNldCB1cCBhIGNsaWNrIGhhbmRsZXIsIGV2ZW4gaWYgbm90IGN1cnJlbnRseSBlbmFibGVkLCBzbyB0aGF0IGl0IGNhbiBiZSByZS1lbmFibGVkIGxhdGVyXG4gICAgICAgIHRoaXMuY2xpY2tIYW5kbGVyID0gKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuZW5hYmxlZCgpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICF0aGlzLnByb2JsZW0ua2V5Ym9hcmRJbnB1dEFjdGl2ZSB8fFxuICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS50ZXh0Rm9jdXMgIT09IHRoaXNcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLnRvZ2dsZU1vdmUoKTtcbiAgICAgICAgfTtcbiAgICAgICAgLy8gSWYgdGhlIGJsb2NrIGlzIGRpc2FibGVkLCBkb24ndCBhZGQgdGhlIGV2ZW50IGxpc3RlbmVycyB5ZXQuXG4gICAgICAgIGlmICh0aGlzLnZpZXcuY2xhc3NMaXN0LmNvbnRhaW5zKFwiZGlzYWJsZWRcIikpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudmlldy5zZXRBdHRyaWJ1dGUoXCJ0YWJpbmRleFwiLCBcIi0xXCIpO1xuICAgICAgICB0aGlzLnZpZXcuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuY2xpY2tIYW5kbGVyKTtcbiAgICAgICAgdGhpcy5oYW1tZXIgPSBuZXcgSGFtbWVyLk1hbmFnZXIodGhpcy52aWV3LCB7XG4gICAgICAgICAgICByZWNvZ25pemVyczogW1xuICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgSGFtbWVyLlBhbixcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlyZWN0aW9uOiBIYW1tZXIuRElSRUNUSU9OX0FMTCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocmVzaG9sZDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50ZXJzOiAxLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBdLFxuICAgICAgICB9KTtcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICB0aGlzLmhhbW1lci5vbihcInBhbnN0YXJ0XCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgdGhhdC5wYW5TdGFydChldmVudCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmhhbW1lci5vbihcInBhbmVuZFwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHRoYXQucGFuRW5kKGV2ZW50KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuaGFtbWVyLm9uKFwicGFubW92ZVwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHRoYXQucGFuTW92ZShldmVudCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvLyBSZXR1cm4gYSBib29sZWFuIGFzIHRvIHdoZXRoZXIgdGhpcyBibG9jayBpcyBhYmxlIHRvIGJlIHNlbGVjdGVkXG4gICAgZW5hYmxlZCgpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICF0aGlzLnZpZXcuY2xhc3NMaXN0LmNvbnRhaW5zKFwiZGlzYWJsZWRcIikgJiZcbiAgICAgICAgICAgIHRoaXMudmlldy5nZXRBdHRyaWJ1dGUoXCJ0YWJpbmRleFwiKSAhPT0gbnVsbFxuICAgICAgICApO1xuICAgIH1cbiAgICAvLyBSZXR1cm4gYSBib29sZWFuIGFzIHRvIHdoZXRoZXIgdGhpcyBibG9jayBpcyBhIGRpc3RyYWN0b3JcbiAgICBpc0Rpc3RyYWN0b3IoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxpbmVzWzBdLmRpc3RyYWN0b3I7XG4gICAgfVxuICAgIC8vIFJldHVybiBhIGJvb2xlYW4gYXMgdG8gd2hldGhlciB0aGlzIGJsb2NrIGlzIGluIHRoZSBzb3VyY2UgYXJlYVxuICAgIGluU291cmNlQXJlYSgpIHtcbiAgICAgICAgdmFyIGNoaWxkcmVuID0gdGhpcy5wcm9ibGVtLnNvdXJjZUFyZWEuY2hpbGROb2RlcztcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGl0ZW0gPSBjaGlsZHJlbltpXTtcbiAgICAgICAgICAgIGlmIChpdGVtLmlkID09IHRoaXMudmlldy5pZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgLy8gUmV0dXJuIHRoZSBwYWdlIFggcG9zaXRpb24gb2YgdGhlIGNlbnRlciBvZiB0aGUgdmlld1xuICAgIHBhZ2VYQ2VudGVyKCkge1xuICAgICAgICB2YXIgYm91bmRpbmdSZWN0ID0gdGhpcy52aWV3LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICB2YXIgcGFnZVhDZW50ZXIgPVxuICAgICAgICAgICAgd2luZG93LnBhZ2VYT2Zmc2V0ICsgYm91bmRpbmdSZWN0LmxlZnQgKyBib3VuZGluZ1JlY3Qud2lkdGggLyAyO1xuICAgICAgICByZXR1cm4gcGFnZVhDZW50ZXI7XG4gICAgfVxuICAgIC8vIFJldHVybiB0aGUgcGFnZSBZIHBvc2l0aW9uIG9mIHRoZSBjZW50ZXIgb2YgdGhlIHZpZXdcbiAgICBwYWdlWUNlbnRlcigpIHtcbiAgICAgICAgdmFyIGJvdW5kaW5nUmVjdCA9IHRoaXMudmlldy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgdmFyIHBhZ2VZQ2VudGVyID1cbiAgICAgICAgICAgIHdpbmRvdy5wYWdlWU9mZnNldCArIGJvdW5kaW5nUmVjdC50b3AgKyBib3VuZGluZ1JlY3QuaGVpZ2h0IC8gMjtcbiAgICAgICAgcmV0dXJuIHBhZ2VZQ2VudGVyO1xuICAgIH1cbiAgICAvLyBPZiBhbGwgdGhlIGxpbmUgaW5kZW50cywgcmV0dXJuIHRoZSBtaW5pbXVtIHZhbHVlXG4gICAgbWluaW11bUxpbmVJbmRlbnQoKSB7XG4gICAgICAgIHZhciBtaW5pbXVtTGluZUluZGVudCA9IHRoaXMubGluZXNbMF0uaW5kZW50O1xuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IHRoaXMubGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIG1pbmltdW1MaW5lSW5kZW50ID0gTWF0aC5taW4oXG4gICAgICAgICAgICAgICAgdGhpcy5saW5lc1tpXS5pbmRlbnQsXG4gICAgICAgICAgICAgICAgbWluaW11bUxpbmVJbmRlbnQsXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtaW5pbXVtTGluZUluZGVudDtcbiAgICB9XG4gICAgLy8gUmV0dXJuIHRoZSBsYXN0IGJsb2NrIGluIHRoZSBzb3VyY2UgYXJlYSB0aGF0IG1hdGNoZXMgdGhlIHBhaXJlZCBiaW4gaXQgaXMgaW5cbiAgICBzbGlkZVVuZGVyQmxvY2soKSB7XG4gICAgICAgIHZhciBzb3VyY2VCbG9ja3MgPSB0aGlzLnByb2JsZW0uc291cmNlQmxvY2tzKCk7XG4gICAgICAgIGlmIChzb3VyY2VCbG9ja3MubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHBhaXJlZEJpbiA9IHRoaXMucGFpcmVkQmluKCk7XG4gICAgICAgIGlmIChwYWlyZWRCaW4gPT0gLTEpIHtcbiAgICAgICAgICAgIHJldHVybiBzb3VyY2VCbG9ja3Nbc291cmNlQmxvY2tzLmxlbmd0aCAtIDFdO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGkgPSBzb3VyY2VCbG9ja3MubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIHZhciBibG9jayA9IHNvdXJjZUJsb2Nrc1tpXTtcbiAgICAgICAgICAgIGlmIChibG9jay5wYWlyZWRCaW4oKSA9PSBwYWlyZWRCaW4pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYmxvY2s7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNvdXJjZUJsb2Nrc1tzb3VyY2VCbG9ja3MubGVuZ3RoIC0gMV07XG4gICAgfVxuICAgIC8vIFJldHVybiB3aGljaCBwYWlyZWQgYmluIGl0IGlzIGluICgtMSkgaWYgbm90XG4gICAgcGFpcmVkQmluKCkge1xuICAgICAgICB2YXIgcGFpcmVkQmlucyA9IHRoaXMucHJvYmxlbS5wYWlyZWRCaW5zO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhaXJlZEJpbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLm1hdGNoZXNCaW4ocGFpcmVkQmluc1tpXSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gLTE7XG4gICAgfVxuICAgIC8vIFJldHVybiB0cnVlIGlmIGFsbCBsaW5lcyBhcmUgaW4gdGhhdCBiaW5cbiAgICBtYXRjaGVzQmluKGJpbikge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciB0ZXN0ID0gdGhpcy5saW5lc1tpXS5pbmRleDtcbiAgICAgICAgICAgIGlmIChiaW4uaW5kZXhPZih0ZXN0KSA9PSAtMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgLy8gUmV0dXJuIGEgbGlzdCBvZiBpbmRleGVzIHdoZXJlIHRoaXMgYmxvY2sgY291bGQgYmUgaW5zZXJ0ZWQgYmVmb3JlXG4gICAgdmFsaWRTb3VyY2VJbmRleGVzKCkge1xuICAgICAgICB2YXIgYmxvY2tzID0gdGhpcy5wcm9ibGVtLnNvdXJjZUJsb2NrcygpO1xuICAgICAgICB2YXIgaW5kZXhlcyA9IFtdO1xuICAgICAgICB2YXIgcGFpcmVkQmluID0gdGhpcy5wYWlyZWRCaW4oKTtcbiAgICAgICAgdmFyIGksIGxhc3RCaW47XG4gICAgICAgIGlmIChwYWlyZWRCaW4gPj0gMCkge1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBibG9jayA9IGJsb2Nrc1tpXTtcbiAgICAgICAgICAgICAgICBpZiAoYmxvY2sudmlldy5pZCAhPT0gdGhpcy52aWV3LmlkKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBibG9ja0JpbiA9IGJsb2NrLnBhaXJlZEJpbigpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYmxvY2tCaW4gPT0gcGFpcmVkQmluKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleGVzLnB1c2goaSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobGFzdEJpbiA9PSBwYWlyZWRCaW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4ZXMucHVzaChpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBsYXN0QmluID0gYmxvY2tCaW47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGxhc3RCaW4gPT0gcGFpcmVkQmluKSB7XG4gICAgICAgICAgICAgICAgaW5kZXhlcy5wdXNoKGJsb2Nrcy5sZW5ndGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGluZGV4ZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpbmRleGVzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBibG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBibG9jayA9IGJsb2Nrc1tpXTtcbiAgICAgICAgICAgIGlmIChibG9jay52aWV3LmlkICE9PSB0aGlzLnZpZXcuaWQpIHtcbiAgICAgICAgICAgICAgICBsZXQgYmxvY2tCaW4gPSBibG9jay5wYWlyZWRCaW4oKTtcbiAgICAgICAgICAgICAgICBpZiAoYmxvY2tCaW4gIT09IGxhc3RCaW4pIHtcbiAgICAgICAgICAgICAgICAgICAgaW5kZXhlcy5wdXNoKGkpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYmxvY2tCaW4gPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5kZXhlcy5wdXNoKGkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsYXN0QmluID0gYmxvY2tCaW47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaW5kZXhlcy5wdXNoKGJsb2Nrcy5sZW5ndGgpO1xuICAgICAgICByZXR1cm4gaW5kZXhlcztcbiAgICB9XG4gICAgLy8gQSBtZWFzdXJlIG9mIGhvdyBmYXIgdGhlIG1pZGRsZSBvZiB0aGlzIGJsb2NrIGlzIHZlcnRpY2FsbHkgcG9zaXRpb25lZFxuICAgIHZlcnRpY2FsT2Zmc2V0KCkge1xuICAgICAgICB2YXIgdmVydGljYWxPZmZzZXQ7XG4gICAgICAgIGlmICh0aGlzLmluU291cmNlQXJlYSgpKSB7XG4gICAgICAgICAgICB2ZXJ0aWNhbE9mZnNldCA9XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnNvdXJjZUFyZWEuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmVydGljYWxPZmZzZXQgPVxuICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS5hbnN3ZXJBcmVhLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcDtcbiAgICAgICAgfVxuICAgICAgICB2ZXJ0aWNhbE9mZnNldCA9XG4gICAgICAgICAgICB0aGlzLnZpZXcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wICtcbiAgICAgICAgICAgIHRoaXMudmlldy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5ib3R0b20gLVxuICAgICAgICAgICAgdmVydGljYWxPZmZzZXQgKiAyO1xuICAgICAgICByZXR1cm4gdmVydGljYWxPZmZzZXQ7XG4gICAgfVxuICAgIC8vIFRoaXMgYmxvY2sganVzdCBnYWluZWQgdGV4dHVhbCBmb2N1c1xuICAgIG5ld0ZvY3VzKGV2ZW50KSB7XG4gICAgICAgIGlmICghdGhpcy5wcm9ibGVtLmtleWJvYXJkSW5wdXRBY3RpdmUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5wcm9ibGVtLnRleHRGb2N1cyA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMucHJvYmxlbS5lbnRlcktleWJvYXJkTW9kZSgpO1xuICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnRleHRGb2N1cyA9IHRoaXM7XG4gICAgICAgICAgICB0aGlzLnByb2JsZW0udGV4dE1vdmUgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMudmlldy5jbGFzc0xpc3QuYWRkKFwiZG93blwiKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnByb2JsZW0udGV4dEZvY3VzID09IHRoaXMpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByb2JsZW0udGV4dE1vdmUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnZpZXcuY2xhc3NMaXN0LmFkZChcInVwXCIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnZpZXcuY2xhc3NMaXN0LmFkZChcImRvd25cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBhbHJlYWR5IGluIGtleWJvYXJkIG1vZGVcbiAgICAgICAgICAgIHRoaXMucHJvYmxlbS50ZXh0Rm9jdXMgPSB0aGlzO1xuICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnRleHRNb3ZlID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLnZpZXcuY2xhc3NMaXN0LmFkZChcImRvd25cIik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wcm9ibGVtLnRleHRNb3ZpbmcgPSBmYWxzZTtcbiAgICAgICAgaWYgKCF0aGlzLnByb2JsZW0ua2V5Ym9hcmRJbnB1dEFjdGl2ZSkge1xuICAgICAgICAgICAgdGhpcy5wcm9ibGVtLmVudGVyS2V5Ym9hcmROYXZpZ2F0aW9uTW9kZSh0aGlzKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBUaGlzIGJsb2NrIGp1c3QgbG9zdCB0ZXh0dWFsIGZvY3VzXG4gICAgcmVsZWFzZUZvY3VzKGV2ZW50KSB7XG4gICAgICAgIGlmICh0aGlzLnByb2JsZW0ua2V5Ym9hcmRJbnB1dEFjdGl2ZSkge1xuICAgICAgICAgICAgdGhpcy5wcm9ibGVtLmNhbmNlbEtleWJvYXJkTW92ZW1lbnQoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMucHJvYmxlbS5rZXlib2FyZE1vdmVtZW50TW9kZSkge1xuICAgICAgICAgICAgdGhpcy52aWV3LmNsYXNzTGlzdC5yZW1vdmUoXCJkb3duXCIsIFwidXBcIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMucHJvYmxlbS50ZXh0Rm9jdXMgPT0gdGhpcykge1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICF0aGlzLnByb2JsZW0udGV4dE1vdmluZyAmJlxuICAgICAgICAgICAgICAgICF0aGlzLnByb2JsZW0ua2V5Ym9hcmRNb3ZlbWVudE1vZGVcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIC8vIGV4aXQgb3V0IG9mIHByb2JsZW0gYnV0IHN0YXkgd2F5IGludG8gcHJvYmxlbVxuICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS50ZXh0Rm9jdXMgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucHJvYmxlbS50ZXh0TW92ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0ubG9nTW92ZShcImttb3ZlXCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0udGV4dE1vdmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgLy8gQ29kZVRhaWxvcjogdXBkYXRlIHBsYWNlaG9sZGVyc1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0udXBkYXRlUGxhY2Vob2xkZXJzKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS5leGl0S2V5Ym9hcmRNb2RlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBiZWNvbWUgc2VsZWN0YWJsZSwgYnV0IG5vdCBhY3RpdmVcbiAgICAgICAgICAgIHRoaXMudmlldy5zZXRBdHRyaWJ1dGUoXCJ0YWJpbmRleFwiLCBcIi0xXCIpO1xuICAgICAgICAgICAgdGhpcy52aWV3LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJmb2N1c1wiLCB0aGlzLmZvY3VzSGFuZGxlcik7XG4gICAgICAgICAgICB0aGlzLnZpZXcucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImJsdXJcIiwgdGhpcy5ibHVySGFuZGxlcik7XG4gICAgICAgICAgICB0aGlzLnZpZXcucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgdGhpcy5rZXlkb3duSGFuZGxlcik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gTWFrZSB0aGlzIGJsb2NrIGludG8gdGhlIGtleWJvYXJkIGVudHJ5IHBvaW50XG4gICAgbWFrZVRhYkluZGV4KCkge1xuICAgICAgICB0aGlzLnZpZXcuc2V0QXR0cmlidXRlKFwidGFiaW5kZXhcIiwgXCItMVwiKTtcbiAgICAgICAgaWYgKHRoaXMuZm9jdXNIYW5kbGVyID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuZm9jdXNIYW5kbGVyID0gKGV2ZW50KSA9PiB0aGlzLm5ld0ZvY3VzKGV2ZW50KTtcbiAgICAgICAgICAgIHRoaXMuYmx1ckhhbmRsZXIgPSAoZXZlbnQpID0+IHRoaXMucmVsZWFzZUZvY3VzKGV2ZW50KTtcbiAgICAgICAgICAgIHRoaXMua2V5ZG93bkhhbmRsZXIgPSAoZXZlbnQpID0+IHRoaXMua2V5RG93bihldmVudCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gcmUtYWRkaW5nIGFuIGlkZW50aWNhbCBsaXN0ZW5lciBpcyBhIG5vLW9wLCBzbyByZXBlYXRlZCBjYWxscyBhcmUgc2FmZVxuICAgICAgICB0aGlzLnZpZXcuYWRkRXZlbnRMaXN0ZW5lcihcImZvY3VzXCIsIHRoaXMuZm9jdXNIYW5kbGVyKTtcbiAgICAgICAgdGhpcy52aWV3LmFkZEV2ZW50TGlzdGVuZXIoXCJibHVyXCIsIHRoaXMuYmx1ckhhbmRsZXIpO1xuICAgICAgICB0aGlzLnZpZXcuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgdGhpcy5rZXlkb3duSGFuZGxlcik7XG4gICAgfVxuICAgIC8vIENhbGxlZCB0byBkaXNhYmxlIGludGVyYWN0aW9uIGZvciB0aGUgZnV0dXJlXG4gICAgZGlzYWJsZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuaGFtbWVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuaGFtbWVyLnNldCh7IGVuYWJsZTogZmFsc2UgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy52aWV3LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLmNsaWNrSGFuZGxlcik7XG4gICAgICAgIGlmICh0aGlzLnZpZXcuZ2V0QXR0cmlidXRlKFwidGFiaW5kZXhcIikgPT0gXCIwXCIpIHtcbiAgICAgICAgICAgIHRoaXMucmVsZWFzZUZvY3VzKCk7XG4gICAgICAgICAgICB0aGlzLnZpZXcucmVtb3ZlQXR0cmlidXRlKFwidGFiaW5kZXhcIik7XG4gICAgICAgICAgICB0aGlzLnByb2JsZW0uaW5pdGlhbGl6ZVRhYkluZGV4KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnZpZXcucmVtb3ZlQXR0cmlidXRlKFwidGFiaW5kZXhcIik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gRW5hYmxlIGZ1bmN0aW9uYWxpdHkgYWZ0ZXIgcmVzZXQgYnV0dG9uIGhhcyBiZWVuIHByZXNzZWRcbiAgICByZXNldFZpZXcoKSB7XG4gICAgICAgIGlmICh0aGlzLmhhbW1lciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLmhhbW1lci5zZXQoeyBlbmFibGU6IHRydWUgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLnZpZXcuaGFzQXR0cmlidXRlKFwidGFiaW5kZXhcIikpIHtcbiAgICAgICAgICAgIHRoaXMudmlldy5zZXRBdHRyaWJ1dGUoXCJ0YWJpbmRleFwiLCBcIi0xXCIpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudmlldy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy5jbGlja0hhbmRsZXIpO1xuICAgICAgICB0aGlzLnZpZXcuc3R5bGUub3BhY2l0eSA9IFwiXCI7XG4gICAgfVxuICAgIC8vIENhbGxlZCB0byBkZXN0cm95IGludGVyYWN0aW9uIGZvciB0aGUgZnV0dXJlXG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgaWYgKHRoaXMuaGFtbWVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuaGFtbWVyLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmhhbW1lcjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnZpZXcucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuY2xpY2tIYW5kbGVyKTtcbiAgICAgICAgaWYgKHRoaXMudmlldy5nZXRBdHRyaWJ1dGUoXCJ0YWJpbmRleFwiKSA9PSBcIjBcIikge1xuICAgICAgICAgICAgdGhpcy5yZWxlYXNlRm9jdXMoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnZpZXcucmVtb3ZlQXR0cmlidXRlKFwidGFiaW5kZXhcIik7XG4gICAgfVxuICAgIC8vIENhbGxlZCB3aGVuIGEgYmxvY2sgaXMgcGlja2VkIHVwXG4gICAgcGFuU3RhcnQoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5wcm9ibGVtLmNsZWFyRmVlZGJhY2soKTtcbiAgICAgICAgaWYgKHRoaXMucHJvYmxlbS5zdGFydGVkID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgLy8gbG9nIHRoZSBmaXJzdCB0aW1lIHRoYXQgc29tZXRoaW5nIGdldHMgbW92ZWRcbiAgICAgICAgICAgIHRoaXMucHJvYmxlbS5zdGFydGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMucHJvYmxlbS5sb2dNb3ZlKFwic3RhcnRcIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMucHJvYmxlbS50ZXh0Rm9jdXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgLy8gc3RvcCB0ZXh0IGZvY3VzIHdoZW4gZHJhZ2dpbmdcbiAgICAgICAgICAgIHRoaXMucHJvYmxlbS50ZXh0Rm9jdXMucmVsZWFzZUZvY3VzKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wcm9ibGVtLm1vdmluZyA9IHRoaXM7XG4gICAgICAgIC8vIFVwZGF0ZSB0aGUgdmlld1xuICAgICAgICB0aGlzLnByb2JsZW0ubW92aW5nWCA9IGV2ZW50LnNyY0V2ZW50LnBhZ2VYO1xuICAgICAgICB0aGlzLnByb2JsZW0ubW92aW5nWSA9IGV2ZW50LnNyY0V2ZW50LnBhZ2VZO1xuICAgICAgICB0aGlzLnByb2JsZW0udXBkYXRlVmlldygpO1xuICAgIH1cbiAgICAvLyBDYWxsZWQgd2hlbiBhIGJsb2NrIGlzIGRyb3BwZWRcbiAgICBwYW5FbmQoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5wcm9ibGVtLmlzQW5zd2VyZWQgPSB0cnVlO1xuICAgICAgICBkZWxldGUgdGhpcy5wcm9ibGVtLm1vdmluZztcbiAgICAgICAgZGVsZXRlIHRoaXMucHJvYmxlbS5tb3ZpbmdYO1xuICAgICAgICBkZWxldGUgdGhpcy5wcm9ibGVtLm1vdmluZ1k7XG4gICAgICAgIHRoaXMucHJvYmxlbS51cGRhdGVWaWV3KCk7XG4gICAgICAgIHRoaXMucHJvYmxlbS5sb2dNb3ZlKFwibW92ZVwiKTtcbiAgICAgICAgdGhpcy5wcm9ibGVtLnVwZGF0ZVBsYWNlaG9sZGVycygpO1xuICAgIH1cbiAgICAvLyBDYWxsZWQgd2hlbiBhIGJsb2NrIGlzIG1vdmVkXG4gICAgcGFuTW92ZShldmVudCkge1xuICAgICAgICAvLyBVcGRhdGUgdGhlIHZpZXdcbiAgICAgICAgdGhpcy5wcm9ibGVtLm1vdmluZ1ggPSBldmVudC5zcmNFdmVudC5wYWdlWDtcbiAgICAgICAgdGhpcy5wcm9ibGVtLm1vdmluZ1kgPSBldmVudC5zcmNFdmVudC5wYWdlWTtcbiAgICAgICAgdGhpcy5wcm9ibGVtLnVwZGF0ZVZpZXcoKTtcbiAgICB9XG4gICAgLy8gSGFuZGxlIGEga2V5cHJlc3MgZXZlbnQgd2hlbiBpbiBmb2N1c1xuICAgIGtleURvd24oZXZlbnQpIHtcbiAgICAgICAgaWYgKHRoaXMucHJvYmxlbS5zdGFydGVkID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgLy8gbG9nIHRoZSBmaXJzdCB0aW1lIHRoYXQgc29tZXRoaW5nIGdldHMgbW92ZWRcbiAgICAgICAgICAgIHRoaXMucHJvYmxlbS5zdGFydGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMucHJvYmxlbS5sb2dNb3ZlKFwia3N0YXJ0XCIpO1xuICAgICAgICB9XG4gICAgICAgIHN3aXRjaCAoZXZlbnQua2V5Q29kZSkge1xuICAgICAgICAgICAgY2FzZSAzNzogLy8gbGVmdFxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnByb2JsZW0udGV4dE1vdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3ZlTGVmdCgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0TGVmdCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMzg6IC8vIHVwXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucHJvYmxlbS50ZXh0TW92ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmVVcCgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0VXAoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMzk6IC8vIHJpZ2h0XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucHJvYmxlbS50ZXh0TW92ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmVSaWdodCgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0UmlnaHQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgNDA6IC8vIGRvd25cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wcm9ibGVtLnRleHRNb3ZlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubW92ZURvd24oKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdERvd24oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMzI6IC8vIHNwYWNlXG4gICAgICAgICAgICAgICAgdGhpcy50b2dnbGVNb3ZlKCk7XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMTM6IC8vIGVudGVyXG4gICAgICAgICAgICAgICAgdGhpcy50b2dnbGVNb3ZlKCk7XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBNb3ZlIGJsb2NrIGxlZnRcbiAgICBtb3ZlTGVmdCgpIHtcbiAgICAgICAgdmFyIGluZGV4LCBibG9jaztcbiAgICAgICAgaWYgKCF0aGlzLmluU291cmNlQXJlYSgpKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pbmRlbnQgPT0gMCkge1xuICAgICAgICAgICAgICAgIC8vIG1vdmUgdG8gc291cmNlIGFyZWFcbiAgICAgICAgICAgICAgICB2YXIgYmxvY2tzID0gdGhpcy5wcm9ibGVtLnNvdXJjZUJsb2NrcygpO1xuICAgICAgICAgICAgICAgIHZhciBvZmZzZXQgPSB0aGlzLnZlcnRpY2FsT2Zmc2V0KCk7XG4gICAgICAgICAgICAgICAgdmFyIHZhbGlkU291cmNlSW5kZXhlcyA9IHRoaXMudmFsaWRTb3VyY2VJbmRleGVzKCk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2YWxpZFNvdXJjZUluZGV4ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaW5kZXggPSB2YWxpZFNvdXJjZUluZGV4ZXNbaV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA9PSBibG9ja3MubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0udGV4dE1vdmluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0uc291cmNlQXJlYS5hcHBlbmRDaGlsZCh0aGlzLnZpZXcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLnByb2JsZW0ua2V5Ym9hcmRNb3ZlbWVudE1vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnZpZXcuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS5zdGF0ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS51cGRhdGVWaWV3KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrID0gYmxvY2tzW2luZGV4XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChibG9jay52ZXJ0aWNhbE9mZnNldCgpID49IG9mZnNldCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS50ZXh0TW92aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0uc291cmNlQXJlYS5pbnNlcnRCZWZvcmUodGhpcy52aWV3LCBibG9jay52aWV3KTtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMucHJvYmxlbS5rZXlib2FyZE1vdmVtZW50TW9kZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnZpZXcuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIHJlZHVjZSBpbmRlbnRcbiAgICAgICAgICAgICAgICB0aGlzLmluZGVudCA9IHRoaXMuaW5kZW50IC0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucHJvYmxlbS5zdGF0ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIHRoaXMucHJvYmxlbS51cGRhdGVWaWV3KCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gTW92ZSBibG9jayB1cFxuICAgIG1vdmVVcCgpIHtcbiAgICAgICAgaWYgKHRoaXMuaW5Tb3VyY2VBcmVhKCkpIHtcbiAgICAgICAgICAgIGxldCBibG9ja3MgPSB0aGlzLnByb2JsZW0uc291cmNlQmxvY2tzKCk7XG4gICAgICAgICAgICB2YXIgb2Zmc2V0ID0gdGhpcy52ZXJ0aWNhbE9mZnNldCgpO1xuICAgICAgICAgICAgdmFyIHZhbGlkU291cmNlSW5kZXhlcyA9IHRoaXMudmFsaWRTb3VyY2VJbmRleGVzKCk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZhbGlkU291cmNlSW5kZXhlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9XG4gICAgICAgICAgICAgICAgICAgIHZhbGlkU291cmNlSW5kZXhlc1t2YWxpZFNvdXJjZUluZGV4ZXMubGVuZ3RoIC0gMSAtIGldO1xuICAgICAgICAgICAgICAgIGlmIChpbmRleCA8IGJsb2Nrcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGJsb2NrID0gYmxvY2tzW2luZGV4XTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJsb2NrLnZlcnRpY2FsT2Zmc2V0KCkgPCBvZmZzZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS50ZXh0TW92aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS5zb3VyY2VBcmVhLmluc2VydEJlZm9yZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnZpZXcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2sudmlldyxcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMucHJvYmxlbS5rZXlib2FyZE1vdmVtZW50TW9kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudmlldy5mb2N1cygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnN0YXRlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnVwZGF0ZVZpZXcoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IGJsb2NrcyA9IHRoaXMucHJvYmxlbS5hbnN3ZXJCbG9ja3MoKTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGJsb2Nrc1tpXS52aWV3LmlkID09IHRoaXMudmlldy5pZCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaSA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0udGV4dE1vdmluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS5hbnN3ZXJBcmVhLmluc2VydEJlZm9yZShcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudmlldyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsb2Nrc1tpIC0gMV0udmlldyxcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLnByb2JsZW0ua2V5Ym9hcmRNb3ZlbWVudE1vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudmlldy5mb2N1cygpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS5zdGF0ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnVwZGF0ZVZpZXcoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gTW92ZSBibG9jayByaWdodFxuICAgIG1vdmVSaWdodCgpIHtcbiAgICAgICAgaWYgKHRoaXMuaW5Tb3VyY2VBcmVhKCkpIHtcbiAgICAgICAgICAgIC8vIG1vdmUgdG8gYW5zd2VyIGFyZWFcbiAgICAgICAgICAgIHRoaXMuaW5kZW50ID0gMDtcbiAgICAgICAgICAgIHZhciBvZmZzZXQgPSB0aGlzLnZlcnRpY2FsT2Zmc2V0KCk7XG4gICAgICAgICAgICB2YXIgYW5zd2VyQmxvY2tzID0gdGhpcy5wcm9ibGVtLmFuc3dlckJsb2NrcygpO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhbnN3ZXJCbG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IGFuc3dlckJsb2Nrc1tpXTtcbiAgICAgICAgICAgICAgICB2YXIgaXRlbU9mZnNldCA9IGl0ZW0udmVydGljYWxPZmZzZXQoKTtcbiAgICAgICAgICAgICAgICBpZiAoaXRlbU9mZnNldCA+PSBvZmZzZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnRleHRNb3ZpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0uYW5zd2VyQXJlYS5pbnNlcnRCZWZvcmUodGhpcy52aWV3LCBpdGVtLnZpZXcpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMucHJvYmxlbS5rZXlib2FyZE1vdmVtZW50TW9kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52aWV3LmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnN0YXRlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0udXBkYXRlVmlldygpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnByb2JsZW0udGV4dE1vdmluZyA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLnByb2JsZW0uYW5zd2VyQXJlYS5hcHBlbmRDaGlsZCh0aGlzLnZpZXcpO1xuICAgICAgICAgICAgaWYgKCF0aGlzLnByb2JsZW0ua2V5Ym9hcmRNb3ZlbWVudE1vZGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnZpZXcuZm9jdXMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucHJvYmxlbS5zdGF0ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIHRoaXMucHJvYmxlbS51cGRhdGVWaWV3KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBpbiBhbnN3ZXIgYXJlYTogaW5jcmVhc2UgdGhlIGluZGVudFxuICAgICAgICAgICAgaWYgKHRoaXMuaW5kZW50ICE9PSB0aGlzLnByb2JsZW0uaW5kZW50KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbmRlbnQgPSB0aGlzLmluZGVudCArIDE7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnN0YXRlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS51cGRhdGVWaWV3KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gTW92ZSBibG9jayBkb3duXG4gICAgbW92ZURvd24oKSB7XG4gICAgICAgIGlmICh0aGlzLmluU291cmNlQXJlYSgpKSB7XG4gICAgICAgICAgICBsZXQgYmxvY2tzID0gdGhpcy5wcm9ibGVtLnNvdXJjZUJsb2NrcygpO1xuICAgICAgICAgICAgdmFyIHZhbGlkU291cmNlSW5kZXhlcyA9IHRoaXMudmFsaWRTb3VyY2VJbmRleGVzKCk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChibG9ja3NbaV0udmlldy5pZCA9PSB0aGlzLnZpZXcuaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG15SW5kZXggPSBpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmFsaWRTb3VyY2VJbmRleGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gdmFsaWRTb3VyY2VJbmRleGVzW2ldO1xuICAgICAgICAgICAgICAgIGlmIChpbmRleCA9PSBibG9ja3MubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS50ZXh0TW92aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnNvdXJjZUFyZWEuYXBwZW5kQ2hpbGQodGhpcy52aWV3KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLnByb2JsZW0ua2V5Ym9hcmRNb3ZlbWVudE1vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudmlldy5mb2N1cygpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS5zdGF0ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnVwZGF0ZVZpZXcoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpbmRleCAtIG15SW5kZXggPiAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS50ZXh0TW92aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnNvdXJjZUFyZWEuaW5zZXJ0QmVmb3JlKFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52aWV3LFxuICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2tzW2luZGV4XS52aWV3LFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMucHJvYmxlbS5rZXlib2FyZE1vdmVtZW50TW9kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52aWV3LmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnN0YXRlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0udXBkYXRlVmlldygpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgYmxvY2tzID0gdGhpcy5wcm9ibGVtLmFuc3dlckJsb2NrcygpO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBibG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoYmxvY2tzW2ldLnZpZXcuaWQgPT0gdGhpcy52aWV3LmlkKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpID09IGJsb2Nrcy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpID09IGJsb2Nrcy5sZW5ndGggLSAyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0udGV4dE1vdmluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0uYW5zd2VyQXJlYS5hcHBlbmRDaGlsZCh0aGlzLnZpZXcpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnRleHRNb3ZpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLmFuc3dlckFyZWEuaW5zZXJ0QmVmb3JlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudmlldyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBibG9ja3NbaSArIDJdLnZpZXcsXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5wcm9ibGVtLmtleWJvYXJkTW92ZW1lbnRNb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnZpZXcuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0uc3RhdGUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS51cGRhdGVWaWV3KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8vIE1vdmUgc2VsZWN0aW9uIGxlZnRcbiAgICBzZWxlY3RMZWZ0KCkge1xuICAgICAgICBpZiAoIXRoaXMuaW5Tb3VyY2VBcmVhKCkpIHtcbiAgICAgICAgICAgIHZhciBvZmZzZXQgPSB0aGlzLnZlcnRpY2FsT2Zmc2V0KCk7XG4gICAgICAgICAgICB2YXIgc291cmNlQmxvY2tzID0gdGhpcy5wcm9ibGVtLmVuYWJsZWRTb3VyY2VCbG9ja3MoKTtcbiAgICAgICAgICAgIGlmIChzb3VyY2VCbG9ja3MubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBjaG9vc2VOZXh0ID0gc291cmNlQmxvY2tzWzBdO1xuICAgICAgICAgICAgdmFyIGNob29zZU9mZnNldCA9IGNob29zZU5leHQudmVydGljYWxPZmZzZXQoKSAtIG9mZnNldDtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgc291cmNlQmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSBzb3VyY2VCbG9ja3NbaV07XG4gICAgICAgICAgICAgICAgdmFyIGl0ZW1PZmZzZXQgPSBpdGVtLnZlcnRpY2FsT2Zmc2V0KCkgLSBvZmZzZXQ7XG4gICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKGl0ZW1PZmZzZXQpIDwgTWF0aC5hYnMoY2hvb3NlT2Zmc2V0KSkge1xuICAgICAgICAgICAgICAgICAgICBjaG9vc2VOZXh0ID0gaXRlbTtcbiAgICAgICAgICAgICAgICAgICAgY2hvb3NlT2Zmc2V0ID0gaXRlbU9mZnNldDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnByb2JsZW0uc2VsZWN0S2V5Ym9hcmRCbG9jayhjaG9vc2VOZXh0KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBNb3ZlIHNlbGVjdGlvbiB1cFxuICAgIHNlbGVjdFVwKCkge1xuICAgICAgICB2YXIgY2hvb3NlTmV4dCA9IGZhbHNlO1xuICAgICAgICB2YXIgYmxvY2tzO1xuICAgICAgICBpZiAodGhpcy5pblNvdXJjZUFyZWEoKSkge1xuICAgICAgICAgICAgYmxvY2tzID0gdGhpcy5wcm9ibGVtLmVuYWJsZWRTb3VyY2VCbG9ja3MoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGJsb2NrcyA9IHRoaXMucHJvYmxlbS5lbmFibGVkQW5zd2VyQmxvY2tzKCk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgaSA9IGJsb2Nrcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgdmFyIGl0ZW0gPSBibG9ja3NbaV07XG4gICAgICAgICAgICBpZiAoY2hvb3NlTmV4dCkge1xuICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS5zZWxlY3RLZXlib2FyZEJsb2NrKGl0ZW0pO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoaXRlbS52aWV3LmlkID09IHRoaXMudmlldy5pZCkge1xuICAgICAgICAgICAgICAgICAgICBjaG9vc2VOZXh0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gTW92ZSBzZWxlY3Rpb24gcmlnaHRcbiAgICBzZWxlY3RSaWdodCgpIHtcbiAgICAgICAgaWYgKHRoaXMuaW5Tb3VyY2VBcmVhKCkpIHtcbiAgICAgICAgICAgIHZhciBvZmZzZXQgPSB0aGlzLnZlcnRpY2FsT2Zmc2V0KCk7XG4gICAgICAgICAgICB2YXIgYmxvY2tzID0gdGhpcy5wcm9ibGVtLmVuYWJsZWRBbnN3ZXJCbG9ja3MoKTtcbiAgICAgICAgICAgIGlmIChibG9ja3MubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBjaG9vc2VOZXh0ID0gYmxvY2tzWzBdO1xuICAgICAgICAgICAgdmFyIGNob29zZU9mZnNldCA9IGNob29zZU5leHQudmVydGljYWxPZmZzZXQoKSAtIG9mZnNldDtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSBibG9ja3NbaV07XG4gICAgICAgICAgICAgICAgdmFyIGl0ZW1PZmZzZXQgPSBpdGVtLnZlcnRpY2FsT2Zmc2V0KCkgLSBvZmZzZXQ7XG4gICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKGl0ZW1PZmZzZXQpIDwgTWF0aC5hYnMoY2hvb3NlT2Zmc2V0KSkge1xuICAgICAgICAgICAgICAgICAgICBjaG9vc2VOZXh0ID0gaXRlbTtcbiAgICAgICAgICAgICAgICAgICAgY2hvb3NlT2Zmc2V0ID0gaXRlbU9mZnNldDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnByb2JsZW0uc2VsZWN0S2V5Ym9hcmRCbG9jayhjaG9vc2VOZXh0KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBNb3ZlIHNlbGVjdGlvbiBkb3duXG4gICAgc2VsZWN0RG93bigpIHtcbiAgICAgICAgdmFyIGNob29zZU5leHQgPSBmYWxzZTtcbiAgICAgICAgdmFyIGJsb2NrcztcbiAgICAgICAgaWYgKHRoaXMuaW5Tb3VyY2VBcmVhKCkpIHtcbiAgICAgICAgICAgIGJsb2NrcyA9IHRoaXMucHJvYmxlbS5lbmFibGVkU291cmNlQmxvY2tzKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBibG9ja3MgPSB0aGlzLnByb2JsZW0uZW5hYmxlZEFuc3dlckJsb2NrcygpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgaXRlbSA9IGJsb2Nrc1tpXTtcbiAgICAgICAgICAgIGlmIChjaG9vc2VOZXh0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnNlbGVjdEtleWJvYXJkQmxvY2soaXRlbSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChpdGVtLnZpZXcuaWQgPT0gdGhpcy52aWV3LmlkKSB7XG4gICAgICAgICAgICAgICAgICAgIGNob29zZU5leHQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBUb2dnbGUgd2hldGhlciB0byBtb3ZlIHRoaXMgYmxvY2tcbiAgICB0b2dnbGVNb3ZlKCkge1xuICAgICAgICBpZiAodGhpcy5wcm9ibGVtLnRleHRNb3ZlKSB7XG4gICAgICAgICAgICB0aGlzLnZpZXcuY2xhc3NMaXN0LnJlbW92ZShcInVwXCIpO1xuICAgICAgICAgICAgdGhpcy52aWV3LmNsYXNzTGlzdC5hZGQoXCJkb3duXCIpO1xuICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnRleHRNb3ZlID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLnByb2JsZW0ubG9nTW92ZShcImttb3ZlXCIpO1xuICAgICAgICAgICAgaWYgKCF0aGlzLmlzUGxhY2Vob2xkZXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0udXBkYXRlUGxhY2Vob2xkZXJzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnZpZXcuY2xhc3NMaXN0LnJlbW92ZShcImRvd25cIik7XG4gICAgICAgICAgICB0aGlzLnZpZXcuY2xhc3NMaXN0LmFkZChcInVwXCIpO1xuICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnRleHRNb3ZlID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMucHJvYmxlbS5lbnRlcktleWJvYXJkTW92ZW1lbnRNb2RlKHRoaXMpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIEFuc3dlciBhIHN0cmluZyB0aGF0IHJlcHJlc2VudHMgdGhpcyBjb2RlYmxvY2sgZm9yIHNhdmluZ1xuICAgIGhhc2goKSB7XG4gICAgICAgIHZhciBoYXNoID0gXCJcIjtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmxpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBoYXNoICs9IHRoaXMubGluZXNbaV0uaW5kZXggKyBcIl9cIjtcbiAgICAgICAgfVxuICAgICAgICBoYXNoICs9IHRoaXMuaW5kZW50O1xuICAgICAgICByZXR1cm4gaGFzaDtcbiAgICB9XG4gICAgLy8gQW5zd2VyIHdoYXQgdGhlIGluZGVudCBzaG91bGQgYmUgZm9yIHRoZSBzb2x1dGlvblxuICAgIHNvbHV0aW9uSW5kZW50KCkge1xuICAgICAgICB2YXIgc2hhcmVkSW5kZW50ID0gdGhpcy5saW5lc1swXS5pbmRlbnQ7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgdGhpcy5saW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgc2hhcmVkSW5kZW50ID0gTWF0aC5taW4oc2hhcmVkSW5kZW50LCB0aGlzLmxpbmVzW2ldLmluZGVudCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNoYXJlZEluZGVudDtcbiAgICB9XG59XG4iLCJpbXBvcnQgTGluZUJhc2VkR3JhZGVyIGZyb20gXCIuL2xpbmVHcmFkZXJcIjtcbmltcG9ydCB7IERpR3JhcGgsIGhhc1BhdGgsIGlzRGlyZWN0ZWRBY3ljbGljR3JhcGggfSBmcm9tIFwiLi9kYWdIZWxwZXJzXCI7XG5cbmZ1bmN0aW9uIGdyYXBoVG9OWChhbnN3ZXJMaW5lcykge1xuICAgIHZhciBncmFwaCA9IG5ldyBEaUdyYXBoKCk7XG4gICAgZm9yIChsZXQgbGluZTEgb2YgYW5zd2VyTGluZXMpIHtcbiAgICAgICAgZ3JhcGguYWRkTm9kZShsaW5lMS50YWcpO1xuICAgICAgICBmb3IgKGxldCBsaW5lMnRhZyBvZiBsaW5lMS5kZXBlbmRzKSB7XG4gICAgICAgICAgICAvLyB0aGUgZGVwZW5kcyBncmFwaCBsaXN0cyB0aGUgKmluY29taW5nKiBlZGdlcyBvZiBhIG5vZGVcbiAgICAgICAgICAgIGdyYXBoLmFkZEVkZ2UobGluZTJ0YWcsIGxpbmUxLnRhZyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGdyYXBoO1xufVxuXG5mdW5jdGlvbiBpc1ZlcnRleENvdmVyKGdyYXBoLCB2ZXJ0ZXhDb3Zlcikge1xuICAgIGZvciAobGV0IGVkZ2Ugb2YgZ3JhcGguZWRnZXMoKSkge1xuICAgICAgICBpZiAoISh2ZXJ0ZXhDb3Zlci5oYXMoZWRnZVswXSkgfHwgdmVydGV4Q292ZXIuaGFzKGVkZ2VbMV0pKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xufVxuXG4vLyBGaW5kIGFsbCBzdWJzZXRzIG9mIHRoZSBzZXQgdXNpbmcgdGhlIGNvcnJlc3BvbmRlbmNlIG9mIHN1YnNldHMgb2Zcbi8vIGEgc2V0IHRvIGJpbmFyeSBzdHJpbmcgd2hvc2UgbGVuZ3RoIGFyZSB0aGUgc2l6ZSBvZiB0aGUgc2V0XG5mdW5jdGlvbiBhbGxTdWJzZXRzKGFycikge1xuICAgIGxldCBzdWJzZXRzID0ge307XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPD0gYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHN1YnNldHNbaV0gPSBbXTtcbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBNYXRoLnBvdygyLCBhcnIubGVuZ3RoKTsgaSsrKSB7XG4gICAgICAgIGxldCBiaW4gPSBpLnRvU3RyaW5nKDIpO1xuICAgICAgICB3aGlsZSAoYmluLmxlbmd0aCA8IGFyci5sZW5ndGgpIHtcbiAgICAgICAgICAgIGJpbiA9IFwiMFwiICsgYmluO1xuICAgICAgICB9XG4gICAgICAgIGxldCBzdWJzZXQgPSBuZXcgU2V0KCk7XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgYmluLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICBpZiAoYmluW2pdID09IFwiMVwiKSB7XG4gICAgICAgICAgICAgICAgc3Vic2V0LmFkZChhcnJbal0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHN1YnNldHNbc3Vic2V0LnNpemVdLnB1c2goc3Vic2V0KTtcbiAgICB9XG4gICAgcmV0dXJuIHN1YnNldHM7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERBR0dyYWRlciBleHRlbmRzIExpbmVCYXNlZEdyYWRlciB7XG4gICAgaW52ZXJzZUxJU0luZGljZXMoYXJyLCBpblNvbHV0aW9uKSB7XG4gICAgICAgIC8vIEZvciBtb3JlIGRldGFpbHMgYW5kIGEgcHJvb2Ygb2YgdGhlIGNvcnJlY3RuZXNzIG9mIHRoZSBhbGdvcml0aG0sIHNlZSB0aGUgcGFwZXI6IGh0dHBzOi8vYXJ4aXYub3JnL2Ficy8yMjA0LjA0MTk2XG5cbiAgICAgICAgdmFyIHNvbHV0aW9uID0gdGhpcy5wcm9ibGVtLnNvbHV0aW9uO1xuICAgICAgICB2YXIgYW5zd2VyTGluZXMgPSBpblNvbHV0aW9uLm1hcCgoYmxvY2spID0+IGJsb2NrLmxpbmVzWzBdKTsgLy8gYXNzdW1lIE5PVCBhZGFwdGl2ZSBmb3IgREFHIGdyYWRpbmcgKGZvciBub3cpXG5cbiAgICAgICAgbGV0IGdyYXBoID0gZ3JhcGhUb05YKHNvbHV0aW9uKTtcblxuICAgICAgICBsZXQgc2VlbiA9IG5ldyBTZXQoKTtcbiAgICAgICAgbGV0IHByb2JsZW1hdGljU3ViZ3JhcGggPSBuZXcgRGlHcmFwaCgpO1xuICAgICAgICBmb3IgKGxldCBsaW5lMSBvZiBhbnN3ZXJMaW5lcykge1xuICAgICAgICAgICAgZm9yIChsZXQgbGluZTIgb2Ygc2Vlbikge1xuICAgICAgICAgICAgICAgIGxldCBwcm9ibGVtYXRpYyA9IGhhc1BhdGgoZ3JhcGgsIHtcbiAgICAgICAgICAgICAgICAgICAgc291cmNlOiBsaW5lMS50YWcsXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldDogbGluZTIudGFnLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGlmIChwcm9ibGVtYXRpYykge1xuICAgICAgICAgICAgICAgICAgICBwcm9ibGVtYXRpY1N1YmdyYXBoLmFkZEVkZ2UobGluZTEudGFnLCBsaW5lMi50YWcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2Vlbi5hZGQobGluZTEpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IG12YyA9IG51bGw7XG4gICAgICAgIGxldCBzdWJzZXRzID0gYWxsU3Vic2V0cyhwcm9ibGVtYXRpY1N1YmdyYXBoLm5vZGVzKCkpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8PSBwcm9ibGVtYXRpY1N1YmdyYXBoLm51bWJlck9mTm9kZXMoKTsgaSsrKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBzdWJzZXQgb2Ygc3Vic2V0c1tpXSkge1xuICAgICAgICAgICAgICAgIGlmIChpc1ZlcnRleENvdmVyKHByb2JsZW1hdGljU3ViZ3JhcGgsIHN1YnNldCkpIHtcbiAgICAgICAgICAgICAgICAgICAgbXZjID0gc3Vic2V0O1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobXZjICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBpbmRpY2VzID0gWy4uLm12Y10ubWFwKCh0YWcpID0+IHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYW5zd2VyTGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoYW5zd2VyTGluZXNbaV0udGFnID09PSB0YWcpIHJldHVybiBpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGluZGljZXM7XG4gICAgfVxuXG4gICAgY2hlY2tDb3JyZWN0SW5kZW50YXRpb24oKSB7XG4gICAgICAgIGlmICghdGhpcy5wcm9ibGVtLnVzZXNJbmRlbnRhdGlvbigpKSByZXR1cm4gdHJ1ZTtcblxuICAgICAgICB0aGlzLmluZGVudExlZnQgPSBbXTtcbiAgICAgICAgdGhpcy5pbmRlbnRSaWdodCA9IFtdO1xuICAgICAgICAvLyBGb3IgZGFnIHByb2JsZW1zLCBvbmx5IGNoZWNrIHRoZSBpbmRlbnRhdGlvbiBvZiBlYWNoIGJsb2NrIGluIHRoZSBwcm9ibGVtXG4gICAgICAgIGZvciAoY29uc3QgYmxvY2sgb2YgdGhpcy5wcm9ibGVtLmJsb2Nrcykge1xuICAgICAgICAgICAgLy8gU2tpcCBkaXN0cmFjdG9yIGJsb2Nrc1xuICAgICAgICAgICAgaWYgKGJsb2NrLmlzRGlzdHJhY3RvcigpKSBjb250aW51ZTtcblxuICAgICAgICAgICAgY29uc3QgY3VySW5kZW50ID0gYmxvY2suaW5kZW50O1xuICAgICAgICAgICAgY29uc3QgZXhwZWN0ZWRJbmRlbnQgPSBibG9jay5zb2x1dGlvbkluZGVudCgpO1xuICAgICAgICAgICAgLy8gSWYgbWlzc21hdGNoLCBhZGQgZmlyc3QgbGluZSBvZiBibG9jayB0byB0aGUgY29ycmVjdCBpbmRlbnQgbGlzdCBmb3JcbiAgICAgICAgICAgIC8vIFVJIHVwZGF0aW5nXG4gICAgICAgICAgICBpZiAoY3VySW5kZW50IDwgZXhwZWN0ZWRJbmRlbnQpXG4gICAgICAgICAgICAgICAgdGhpcy5pbmRlbnRSaWdodC5wdXNoKGJsb2NrLmxpbmVzWzBdKTtcbiAgICAgICAgICAgIGVsc2UgaWYgKGN1ckluZGVudCA+IGV4cGVjdGVkSW5kZW50KVxuICAgICAgICAgICAgICAgIHRoaXMuaW5kZW50TGVmdC5wdXNoKGJsb2NrLmxpbmVzWzBdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuaW5jb3JyZWN0SW5kZW50cyA9XG4gICAgICAgICAgICB0aGlzLmluZGVudExlZnQubGVuZ3RoICsgdGhpcy5pbmRlbnRSaWdodC5sZW5ndGg7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuaW5jb3JyZWN0SW5kZW50cyA9PSAwO1xuICAgIH1cblxuICAgIGNoZWNrQ29ycmVjdE9yZGVyaW5nKHNvbHV0aW9uTGluZXMsIGFuc3dlckxpbmVzKSB7XG4gICAgICAgIGlmICghaXNEaXJlY3RlZEFjeWNsaWNHcmFwaChncmFwaFRvTlgoc29sdXRpb25MaW5lcykpKSB7XG4gICAgICAgICAgICB0aHJvdyBcIkRlcGVuZGVuY3kgYmV0d2VlbiBibG9ja3MgZG9lcyBub3QgZm9ybSBhIERpcmVjdGVkIEFjeWNsaWMgR3JhcGg7IFByb2JsZW0gdW5zb2x2YWJsZS5cIjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBzZWVuID0gbmV3IFNldCgpO1xuICAgICAgICBsZXQgaXNDb3JyZWN0T3JkZXIgPSB0cnVlO1xuICAgICAgICB0aGlzLmNvcnJlY3RMaW5lcyA9IDA7XG4gICAgICAgIHRoaXMuc29sdXRpb25MZW5ndGggPSBzb2x1dGlvbkxpbmVzLmxlbmd0aDtcbiAgICAgICAgbGV0IGxvb3BMaW1pdCA9IE1hdGgubWluKHNvbHV0aW9uTGluZXMubGVuZ3RoLCBhbnN3ZXJMaW5lcy5sZW5ndGgpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxvb3BMaW1pdDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgbGluZSA9IGFuc3dlckxpbmVzW2ldO1xuICAgICAgICAgICAgaWYgKGxpbmUuZGlzdHJhY3Rvcikge1xuICAgICAgICAgICAgICAgIGlzQ29ycmVjdE9yZGVyID0gZmFsc2U7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgbGluZS5kZXBlbmRzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghc2Vlbi5oYXMobGluZS5kZXBlbmRzW2pdKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaXNDb3JyZWN0T3JkZXIgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpc0NvcnJlY3RPcmRlcikge1xuICAgICAgICAgICAgICAgIHRoaXMuY29ycmVjdExpbmVzICs9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZWVuLmFkZChsaW5lLnRhZyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGlzQ29ycmVjdE9yZGVyO1xuICAgIH1cbn1cbiIsImltcG9ydCBQYXJzb25zQmxvY2sgZnJvbSBcIi4vcGFyc29uc0Jsb2NrXCI7XG5pbXBvcnQgUGFyc29uc0xpbmUgZnJvbSBcIi4vcGFyc29uc0xpbmVcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGxhY2Vob2xkZXJCbG9jayBleHRlbmRzIFBhcnNvbnNCbG9jayB7XG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByb2JsZW0sXG4gICAgICAgIHBsYWNlaG9sZGVyTGluZXMsXG4gICAgICAgIHBsYWNlaG9sZGVyU2l6ZSxcbiAgICAgICAgYWZ0ZXJTZXR0bGVkQmxvY2tDb3VudCxcbiAgICApIHtcbiAgICAgICAgLy8gcHJvYmxlbTogUGFyc29ucyBpbnN0YW5jZVxuICAgICAgICAvLyBzaXplOiBob3cgbWFueSBibG9ja3MgaXQgaXMgaG9sZGluZ1xuXG4gICAgICAgIC8vIGhhdmUgdG8gaGF2ZSBhdCBsZWFzdCBvbmUgcGFyc29uc2xpbmVzLCBvdGhlcndpc2Ugd2lsbCBiZSBlcnJvciBpbiBQYXJzb25zQmxvY2suXG4gICAgICAgIHN1cGVyKHByb2JsZW0sIHBsYWNlaG9sZGVyTGluZXMpO1xuICAgICAgICB0aGlzLnBsYWNlaG9sZGVyTGluZXMgPSBwbGFjZWhvbGRlckxpbmVzO1xuICAgICAgICB0aGlzLmFmdGVyU2V0dGxlZEJsb2NrQ291bnQgPSBhZnRlclNldHRsZWRCbG9ja0NvdW50O1xuXG4gICAgICAgIC8vIGNyZWF0ZSBhIG5vcm1hbCBwYXJzb25zIGJsb2NrLCBidXQgdXNlIGNzcyB0byBjb250cm9sIHZpc2liaWxpdHkgb2Ygbm9ybWFsIGNvbnRlbnRcbiAgICAgICAgdGhpcy52aWV3LmNsYXNzTGlzdC5hZGQoXCJwbGFjZWhvbGRlci1ibG9ja1wiLCBcImRpc2FibGVkXCIpO1xuXG4gICAgICAgIC8vIGNyZWF0ZSBhIG5ldyBkaXYgZGlzcGxheWluZyBob3cgbWFueSBibG9ja3MgYXJlIG1pc3NpbmdcbiAgICAgICAgdGhpcy5wbGFjZWhvbGRlclNpemUgPSBwbGFjZWhvbGRlclNpemU7XG4gICAgICAgIHZhciBjb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgY29udGVudC5jbGFzc0xpc3QuYWRkKFwicGxhY2Vob2xkZXItdGV4dFwiKTtcbiAgICAgICAgaWYgKHBsYWNlaG9sZGVyU2l6ZSA+IDEpIHtcbiAgICAgICAgICAgIGNvbnRlbnQuaW5uZXJUZXh0ID0gYCR7cGxhY2Vob2xkZXJTaXplfSBibG9ja3MgYXJlIG1pc3NpbmcgaGVyZWA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb250ZW50LmlubmVyVGV4dCA9IGAke3BsYWNlaG9sZGVyU2l6ZX0gYmxvY2sgaXMgbWlzc2luZyBoZXJlYDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnZpZXcuYXBwZW5kKGNvbnRlbnQpO1xuXG4gICAgICAgIHRoaXMuaXNQbGFjZWhvbGRlciA9IHRydWU7XG4gICAgfVxufVxuIiwiLy8gVE9ETyAtIEhvdyBtdWNoIG9mIHRoaXMgaXMgbmVlZGVkPyBMb3RzIG9mIG92ZXJsYXAgd2l0aCB3aGF0IHN5bnRheCBoaWdobGlnaHRpbmdcbi8vIHZpYSBwcmV0ZXh0IHRoZW1lIGRvZXMuLi5cblxuZnVuY3Rpb24gSCgpIHtcbiAgICB2YXIgeCA9XG4gICAgICAgIG5hdmlnYXRvciAmJlxuICAgICAgICBuYXZpZ2F0b3IudXNlckFnZW50ICYmXG4gICAgICAgIC9cXGJNU0lFIDZcXC4vLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XG4gICAgSCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4geDtcbiAgICB9O1xuICAgIHJldHVybiB4O1xufVxuKGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIHgoYikge1xuICAgICAgICBiID0gYi5zcGxpdCgvIC9nKTtcbiAgICAgICAgdmFyIGEgPSB7fTtcbiAgICAgICAgZm9yICh2YXIgYyA9IGIubGVuZ3RoOyAtLWMgPj0gMDsgKSB7XG4gICAgICAgICAgICB2YXIgZCA9IGJbY107XG4gICAgICAgICAgICBpZiAoZCkgYVtkXSA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGE7XG4gICAgfVxuICAgIHZhciB5ID0gXCJicmVhayBjb250aW51ZSBkbyBlbHNlIGZvciBpZiByZXR1cm4gd2hpbGUgXCIsXG4gICAgICAgIFUgPVxuICAgICAgICAgICAgeSArXG4gICAgICAgICAgICBcImF1dG8gY2FzZSBjaGFyIGNvbnN0IGRlZmF1bHQgZG91YmxlIGVudW0gZXh0ZXJuIGZsb2F0IGdvdG8gaW50IGxvbmcgcmVnaXN0ZXIgc2hvcnQgc2lnbmVkIHNpemVvZiBzdGF0aWMgc3RydWN0IHN3aXRjaCB0eXBlZGVmIHVuaW9uIHVuc2lnbmVkIHZvaWQgdm9sYXRpbGUgXCIsXG4gICAgICAgIEQgPVxuICAgICAgICAgICAgVSArXG4gICAgICAgICAgICBcImNhdGNoIGNsYXNzIGRlbGV0ZSBmYWxzZSBpbXBvcnQgbmV3IG9wZXJhdG9yIHByaXZhdGUgcHJvdGVjdGVkIHB1YmxpYyB0aGlzIHRocm93IHRydWUgdHJ5IFwiLFxuICAgICAgICBJID1cbiAgICAgICAgICAgIEQgK1xuICAgICAgICAgICAgXCJhbGlnbm9mIGFsaWduX3VuaW9uIGFzbSBheGlvbSBib29sIGNvbmNlcHQgY29uY2VwdF9tYXAgY29uc3RfY2FzdCBjb25zdGV4cHIgZGVjbHR5cGUgZHluYW1pY19jYXN0IGV4cGxpY2l0IGV4cG9ydCBmcmllbmQgaW5saW5lIGxhdGVfY2hlY2sgbXV0YWJsZSBuYW1lc3BhY2UgbnVsbHB0ciByZWludGVycHJldF9jYXN0IHN0YXRpY19hc3NlcnQgc3RhdGljX2Nhc3QgdGVtcGxhdGUgdHlwZWlkIHR5cGVuYW1lIHR5cGVvZiB1c2luZyB2aXJ0dWFsIHdjaGFyX3Qgd2hlcmUgXCIsXG4gICAgICAgIEogPVxuICAgICAgICAgICAgRCArXG4gICAgICAgICAgICBcImJvb2xlYW4gYnl0ZSBleHRlbmRzIGZpbmFsIGZpbmFsbHkgaW1wbGVtZW50cyBpbXBvcnQgaW5zdGFuY2VvZiBudWxsIG5hdGl2ZSBwYWNrYWdlIHN0cmljdGZwIHN1cGVyIHN5bmNocm9uaXplZCB0aHJvd3MgdHJhbnNpZW50IFwiLFxuICAgICAgICBWID1cbiAgICAgICAgICAgIEogK1xuICAgICAgICAgICAgXCJhcyBiYXNlIGJ5IGNoZWNrZWQgZGVjaW1hbCBkZWxlZ2F0ZSBkZXNjZW5kaW5nIGV2ZW50IGZpeGVkIGZvcmVhY2ggZnJvbSBncm91cCBpbXBsaWNpdCBpbiBpbnRlcmZhY2UgaW50ZXJuYWwgaW50byBpcyBsb2NrIG9iamVjdCBvdXQgb3ZlcnJpZGUgb3JkZXJieSBwYXJhbXMgcmVhZG9ubHkgcmVmIHNieXRlIHNlYWxlZCBzdGFja2FsbG9jIHN0cmluZyBzZWxlY3QgdWludCB1bG9uZyB1bmNoZWNrZWQgdW5zYWZlIHVzaG9ydCB2YXIgXCIsXG4gICAgICAgIEsgPVxuICAgICAgICAgICAgRCArXG4gICAgICAgICAgICBcImRlYnVnZ2VyIGV2YWwgZXhwb3J0IGZ1bmN0aW9uIGdldCBudWxsIHNldCB1bmRlZmluZWQgdmFyIHdpdGggSW5maW5pdHkgTmFOIFwiLFxuICAgICAgICBMID1cbiAgICAgICAgICAgIFwiY2FsbGVyIGRlbGV0ZSBkaWUgZG8gZHVtcCBlbHNpZiBldmFsIGV4aXQgZm9yZWFjaCBmb3IgZ290byBpZiBpbXBvcnQgbGFzdCBsb2NhbCBteSBuZXh0IG5vIG91ciBwcmludCBwYWNrYWdlIHJlZG8gcmVxdWlyZSBzdWIgdW5kZWYgdW5sZXNzIHVudGlsIHVzZSB3YW50YXJyYXkgd2hpbGUgQkVHSU4gRU5EIFwiLFxuICAgICAgICBNID1cbiAgICAgICAgICAgIHkgK1xuICAgICAgICAgICAgXCJhbmQgYXMgYXNzZXJ0IGNsYXNzIGRlZiBkZWwgZWxpZiBleGNlcHQgZXhlYyBmaW5hbGx5IGZyb20gZ2xvYmFsIGltcG9ydCBpbiBpcyBsYW1iZGEgbm9ubG9jYWwgbm90IG9yIHBhc3MgcHJpbnQgcmFpc2UgdHJ5IHdpdGggeWllbGQgRmFsc2UgVHJ1ZSBOb25lIFwiLFxuICAgICAgICBOID1cbiAgICAgICAgICAgIHkgK1xuICAgICAgICAgICAgXCJhbGlhcyBhbmQgYmVnaW4gY2FzZSBjbGFzcyBkZWYgZGVmaW5lZCBlbHNpZiBlbmQgZW5zdXJlIGZhbHNlIGluIG1vZHVsZSBuZXh0IG5pbCBub3Qgb3IgcmVkbyByZXNjdWUgcmV0cnkgc2VsZiBzdXBlciB0aGVuIHRydWUgdW5kZWYgdW5sZXNzIHVudGlsIHdoZW4geWllbGQgQkVHSU4gRU5EIFwiLFxuICAgICAgICBPID0geSArIFwiY2FzZSBkb25lIGVsaWYgZXNhYyBldmFsIGZpIGZ1bmN0aW9uIGluIGxvY2FsIHNldCB0aGVuIHVudGlsIFwiLFxuICAgICAgICBXID0gSSArIFYgKyBLICsgTCArIE0gKyBOICsgTztcbiAgICBmdW5jdGlvbiBYKGIpIHtcbiAgICAgICAgcmV0dXJuIChiID49IFwiYVwiICYmIGIgPD0gXCJ6XCIpIHx8IChiID49IFwiQVwiICYmIGIgPD0gXCJaXCIpO1xuICAgIH1cbiAgICBmdW5jdGlvbiB1KGIsIGEsIGMsIGQpIHtcbiAgICAgICAgYi51bnNoaWZ0KGMsIGQgfHwgMCk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBhLnNwbGljZS5hcHBseShhLCBiKTtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgIGIuc3BsaWNlKDAsIDIpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHZhciBZID0gKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGIgPSBbXG4gICAgICAgICAgICAgICAgICAgIFwiIVwiLFxuICAgICAgICAgICAgICAgICAgICBcIiE9XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiIT09XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiI1wiLFxuICAgICAgICAgICAgICAgICAgICBcIiVcIixcbiAgICAgICAgICAgICAgICAgICAgXCIlPVwiLFxuICAgICAgICAgICAgICAgICAgICBcIiZcIixcbiAgICAgICAgICAgICAgICAgICAgXCImJlwiLFxuICAgICAgICAgICAgICAgICAgICBcIiYmPVwiLFxuICAgICAgICAgICAgICAgICAgICBcIiY9XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiKFwiLFxuICAgICAgICAgICAgICAgICAgICBcIipcIixcbiAgICAgICAgICAgICAgICAgICAgXCIqPVwiLFxuICAgICAgICAgICAgICAgICAgICBcIis9XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiLFwiLFxuICAgICAgICAgICAgICAgICAgICBcIi09XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiLT5cIixcbiAgICAgICAgICAgICAgICAgICAgXCIvXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiLz1cIixcbiAgICAgICAgICAgICAgICAgICAgXCI6XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiOjpcIixcbiAgICAgICAgICAgICAgICAgICAgXCI7XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiPFwiLFxuICAgICAgICAgICAgICAgICAgICBcIjw8XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiPDw9XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiPD1cIixcbiAgICAgICAgICAgICAgICAgICAgXCI9XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiPT1cIixcbiAgICAgICAgICAgICAgICAgICAgXCI9PT1cIixcbiAgICAgICAgICAgICAgICAgICAgXCI+XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiPj1cIixcbiAgICAgICAgICAgICAgICAgICAgXCI+PlwiLFxuICAgICAgICAgICAgICAgICAgICBcIj4+PVwiLFxuICAgICAgICAgICAgICAgICAgICBcIj4+PlwiLFxuICAgICAgICAgICAgICAgICAgICBcIj4+Pj1cIixcbiAgICAgICAgICAgICAgICAgICAgXCI/XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiQFwiLFxuICAgICAgICAgICAgICAgICAgICBcIltcIixcbiAgICAgICAgICAgICAgICAgICAgXCJeXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiXj1cIixcbiAgICAgICAgICAgICAgICAgICAgXCJeXlwiLFxuICAgICAgICAgICAgICAgICAgICBcIl5ePVwiLFxuICAgICAgICAgICAgICAgICAgICBcIntcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ8XCIsXG4gICAgICAgICAgICAgICAgICAgIFwifD1cIixcbiAgICAgICAgICAgICAgICAgICAgXCJ8fFwiLFxuICAgICAgICAgICAgICAgICAgICBcInx8PVwiLFxuICAgICAgICAgICAgICAgICAgICBcIn5cIixcbiAgICAgICAgICAgICAgICAgICAgXCJicmVha1wiLFxuICAgICAgICAgICAgICAgICAgICBcImNhc2VcIixcbiAgICAgICAgICAgICAgICAgICAgXCJjb250aW51ZVwiLFxuICAgICAgICAgICAgICAgICAgICBcImRlbGV0ZVwiLFxuICAgICAgICAgICAgICAgICAgICBcImRvXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiZWxzZVwiLFxuICAgICAgICAgICAgICAgICAgICBcImZpbmFsbHlcIixcbiAgICAgICAgICAgICAgICAgICAgXCJpbnN0YW5jZW9mXCIsXG4gICAgICAgICAgICAgICAgICAgIFwicmV0dXJuXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidGhyb3dcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0cnlcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0eXBlb2ZcIlxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgYSA9XG4gICAgICAgICAgICAgICAgICAgIFwiKD86KD86KD86XnxbXjAtOS5dKVxcXFwuezEsM30pfCg/Oig/Ol58W15cXFxcK10pXFxcXCspfCg/Oig/Ol58W15cXFxcLV0pLSlcIjtcbiAgICAgICAgICAgIGZvciAodmFyIGMgPSAwOyBjIDwgYi5sZW5ndGg7ICsrYykge1xuICAgICAgICAgICAgICAgIHZhciBkID0gYltjXTtcbiAgICAgICAgICAgICAgICBhICs9IFgoZC5jaGFyQXQoMCkpXG4gICAgICAgICAgICAgICAgICAgID8gXCJ8XFxcXGJcIiArIGRcbiAgICAgICAgICAgICAgICAgICAgOiBcInxcIiArIGQucmVwbGFjZSgvKFtePTw+OiZdKS9nLCBcIlxcXFwkMVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGEgKz0gXCJ8XilcXFxccyokXCI7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFJlZ0V4cChhKTtcbiAgICAgICAgfSkoKSxcbiAgICAgICAgUCA9IC8mL2csXG4gICAgICAgIFEgPSAvPC9nLFxuICAgICAgICBSID0gLz4vZyxcbiAgICAgICAgWiA9IC9cXFwiL2c7XG4gICAgZnVuY3Rpb24gJChiKSB7XG4gICAgICAgIHJldHVybiBiXG4gICAgICAgICAgICAucmVwbGFjZShQLCBcIiZhbXA7XCIpXG4gICAgICAgICAgICAucmVwbGFjZShRLCBcIiZsdDtcIilcbiAgICAgICAgICAgIC5yZXBsYWNlKFIsIFwiJmd0O1wiKVxuICAgICAgICAgICAgLnJlcGxhY2UoWiwgXCImcXVvdDtcIik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIEUoYikge1xuICAgICAgICByZXR1cm4gYlxuICAgICAgICAgICAgLnJlcGxhY2UoUCwgXCImYW1wO1wiKVxuICAgICAgICAgICAgLnJlcGxhY2UoUSwgXCImbHQ7XCIpXG4gICAgICAgICAgICAucmVwbGFjZShSLCBcIiZndDtcIik7XG4gICAgfVxuICAgIHZhciBhYSA9IC8mbHQ7L2csXG4gICAgICAgIGJhID0gLyZndDsvZyxcbiAgICAgICAgY2EgPSAvJmFwb3M7L2csXG4gICAgICAgIGRhID0gLyZxdW90Oy9nLFxuICAgICAgICBlYSA9IC8mYW1wOy9nLFxuICAgICAgICBmYSA9IC8mbmJzcDsvZztcbiAgICBmdW5jdGlvbiBnYShiKSB7XG4gICAgICAgIHZhciBhID0gYi5pbmRleE9mKFwiJlwiKTtcbiAgICAgICAgaWYgKGEgPCAwKSByZXR1cm4gYjtcbiAgICAgICAgZm9yICgtLWE7IChhID0gYi5pbmRleE9mKFwiJiNcIiwgYSArIDEpKSA+PSAwOyApIHtcbiAgICAgICAgICAgIHZhciBjID0gYi5pbmRleE9mKFwiO1wiLCBhKTtcbiAgICAgICAgICAgIGlmIChjID49IDApIHtcbiAgICAgICAgICAgICAgICB2YXIgZCA9IGIuc3Vic3RyaW5nKGEgKyAzLCBjKSxcbiAgICAgICAgICAgICAgICAgICAgZyA9IDEwO1xuICAgICAgICAgICAgICAgIGlmIChkICYmIGQuY2hhckF0KDApID09PSBcInhcIikge1xuICAgICAgICAgICAgICAgICAgICBkID0gZC5zdWJzdHJpbmcoMSk7XG4gICAgICAgICAgICAgICAgICAgIGcgPSAxNjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIGUgPSBwYXJzZUludChkLCBnKTtcbiAgICAgICAgICAgICAgICBpZiAoIWlzTmFOKGUpKVxuICAgICAgICAgICAgICAgICAgICBiID1cbiAgICAgICAgICAgICAgICAgICAgICAgIGIuc3Vic3RyaW5nKDAsIGEpICtcbiAgICAgICAgICAgICAgICAgICAgICAgIFN0cmluZy5mcm9tQ2hhckNvZGUoZSkgK1xuICAgICAgICAgICAgICAgICAgICAgICAgYi5zdWJzdHJpbmcoYyArIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBiXG4gICAgICAgICAgICAucmVwbGFjZShhYSwgXCI8XCIpXG4gICAgICAgICAgICAucmVwbGFjZShiYSwgXCI+XCIpXG4gICAgICAgICAgICAucmVwbGFjZShjYSwgXCInXCIpXG4gICAgICAgICAgICAucmVwbGFjZShkYSwgJ1wiJylcbiAgICAgICAgICAgIC5yZXBsYWNlKGVhLCBcIiZcIilcbiAgICAgICAgICAgIC5yZXBsYWNlKGZhLCBcIiBcIik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIFMoYikge1xuICAgICAgICByZXR1cm4gXCJYTVBcIiA9PT0gYi50YWdOYW1lO1xuICAgIH1cbiAgICBmdW5jdGlvbiB6KGIsIGEpIHtcbiAgICAgICAgc3dpdGNoIChiLm5vZGVUeXBlKSB7XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgdmFyIGMgPSBiLnRhZ05hbWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgICAgICBhLnB1c2goXCI8XCIsIGMpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGQgPSAwOyBkIDwgYi5hdHRyaWJ1dGVzLmxlbmd0aDsgKytkKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBnID0gYi5hdHRyaWJ1dGVzW2RdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWcuc3BlY2lmaWVkKSBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgYS5wdXNoKFwiIFwiKTtcbiAgICAgICAgICAgICAgICAgICAgeihnLCBhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYS5wdXNoKFwiPlwiKTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBlID0gYi5maXJzdENoaWxkOyBlOyBlID0gZS5uZXh0U2libGluZykgeihlLCBhKTtcbiAgICAgICAgICAgICAgICBpZiAoYi5maXJzdENoaWxkIHx8ICEvXig/OmJyfGxpbmt8aW1nKSQvLnRlc3QoYykpXG4gICAgICAgICAgICAgICAgICAgIGEucHVzaChcIjwvXCIsIGMsIFwiPlwiKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICBhLnB1c2goYi5uYW1lLnRvTG93ZXJDYXNlKCksICc9XCInLCAkKGIudmFsdWUpLCAnXCInKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgICAgICBhLnB1c2goRShiLm5vZGVWYWx1ZSkpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuICAgIHZhciBGID0gbnVsbDtcbiAgICBmdW5jdGlvbiBoYShiKSB7XG4gICAgICAgIGlmIChudWxsID09PSBGKSB7XG4gICAgICAgICAgICB2YXIgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJQUkVcIik7XG4gICAgICAgICAgICBhLmFwcGVuZENoaWxkKFxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFxuICAgICAgICAgICAgICAgICAgICAnPCFET0NUWVBFIGZvbyBQVUJMSUMgXCJmb28gYmFyXCI+XFxuPGZvbyAvPidcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgRiA9ICEvPC8udGVzdChhLmlubmVySFRNTCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKEYpIHtcbiAgICAgICAgICAgIHZhciBjID0gYi5pbm5lckhUTUw7XG4gICAgICAgICAgICBpZiAoUyhiKSkgYyA9IEUoYyk7XG4gICAgICAgICAgICByZXR1cm4gYztcbiAgICAgICAgfVxuICAgICAgICB2YXIgZCA9IFtdO1xuICAgICAgICBmb3IgKHZhciBnID0gYi5maXJzdENoaWxkOyBnOyBnID0gZy5uZXh0U2libGluZykgeihnLCBkKTtcbiAgICAgICAgcmV0dXJuIGQuam9pbihcIlwiKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gaWEoYikge1xuICAgICAgICB2YXIgYSA9IDA7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihjKSB7XG4gICAgICAgICAgICB2YXIgZCA9IG51bGwsXG4gICAgICAgICAgICAgICAgZyA9IDA7XG4gICAgICAgICAgICBmb3IgKHZhciBlID0gMCwgaCA9IGMubGVuZ3RoOyBlIDwgaDsgKytlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGYgPSBjLmNoYXJBdChlKTtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGYpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIlxcdFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFkKSBkID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICBkLnB1c2goYy5zdWJzdHJpbmcoZywgZSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGkgPSBiIC0gKGEgJSBiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGEgKz0gaTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoOyBpID49IDA7IGkgLT0gXCIgICAgICAgICAgICAgICAgXCIubGVuZ3RoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGQucHVzaChcIiAgICAgICAgICAgICAgICBcIi5zdWJzdHJpbmcoMCwgaSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZyA9IGUgKyAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJcXG5cIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIGEgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICArK2E7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFkKSByZXR1cm4gYztcbiAgICAgICAgICAgIGQucHVzaChjLnN1YnN0cmluZyhnKSk7XG4gICAgICAgICAgICByZXR1cm4gZC5qb2luKFwiXCIpO1xuICAgICAgICB9O1xuICAgIH1cbiAgICB2YXIgamEgPSAvKD86W148XSt8PCEtLVtcXHNcXFNdKj8tLVxcPnw8IVxcW0NEQVRBXFxbKFtcXHNcXFNdKj8pXFxdXFxdPnw8XFwvP1thLXpBLVpdW14+XSo+fDwpL2csXG4gICAgICAgIGthID0gL148IS0tLyxcbiAgICAgICAgbGEgPSAvXjxcXFtDREFUQVxcWy8sXG4gICAgICAgIG1hID0gL148YnJcXGIvaTtcbiAgICBmdW5jdGlvbiBuYShiKSB7XG4gICAgICAgIHZhciBhID0gYi5tYXRjaChqYSksXG4gICAgICAgICAgICBjID0gW10sXG4gICAgICAgICAgICBkID0gMCxcbiAgICAgICAgICAgIGcgPSBbXTtcbiAgICAgICAgaWYgKGEpXG4gICAgICAgICAgICBmb3IgKHZhciBlID0gMCwgaCA9IGEubGVuZ3RoOyBlIDwgaDsgKytlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGYgPSBhW2VdO1xuICAgICAgICAgICAgICAgIGlmIChmLmxlbmd0aCA+IDEgJiYgZi5jaGFyQXQoMCkgPT09IFwiPFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChrYS50ZXN0KGYpKSBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxhLnRlc3QoZikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGMucHVzaChmLnN1YnN0cmluZyg5LCBmLmxlbmd0aCAtIDMpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGQgKz0gZi5sZW5ndGggLSAxMjtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChtYS50ZXN0KGYpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjLnB1c2goXCJcXG5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICArK2Q7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBnLnB1c2goZCwgZik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGkgPSBnYShmKTtcbiAgICAgICAgICAgICAgICAgICAgYy5wdXNoKGkpO1xuICAgICAgICAgICAgICAgICAgICBkICs9IGkubGVuZ3RoO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHNvdXJjZTogYy5qb2luKFwiXCIpLFxuICAgICAgICAgICAgdGFnczogZ1xuICAgICAgICB9O1xuICAgIH1cbiAgICBmdW5jdGlvbiB2KGIsIGEpIHtcbiAgICAgICAgdmFyIGMgPSB7fTtcbiAgICAgICAgKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGcgPSBiLmNvbmNhdChhKTtcbiAgICAgICAgICAgIGZvciAodmFyIGUgPSBnLmxlbmd0aDsgLS1lID49IDA7ICkge1xuICAgICAgICAgICAgICAgIHZhciBoID0gZ1tlXSxcbiAgICAgICAgICAgICAgICAgICAgZiA9IGhbM107XG4gICAgICAgICAgICAgICAgaWYgKGYpIGZvciAodmFyIGkgPSBmLmxlbmd0aDsgLS1pID49IDA7ICkgY1tmLmNoYXJBdChpKV0gPSBoO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KSgpO1xuICAgICAgICB2YXIgZCA9IGEubGVuZ3RoO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oZywgZSkge1xuICAgICAgICAgICAgZSA9IGUgfHwgMDtcbiAgICAgICAgICAgIHZhciBoID0gW2UsIFwicGxuXCJdLFxuICAgICAgICAgICAgICAgIGYgPSBcIlwiLFxuICAgICAgICAgICAgICAgIGkgPSAwLFxuICAgICAgICAgICAgICAgIGogPSBnO1xuICAgICAgICAgICAgd2hpbGUgKGoubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdmFyIG8sXG4gICAgICAgICAgICAgICAgICAgIG0gPSBudWxsLFxuICAgICAgICAgICAgICAgICAgICBrLFxuICAgICAgICAgICAgICAgICAgICBsID0gY1tqLmNoYXJBdCgwKV07XG4gICAgICAgICAgICAgICAgaWYgKGwpIHtcbiAgICAgICAgICAgICAgICAgICAgayA9IGoubWF0Y2gobFsxXSk7XG4gICAgICAgICAgICAgICAgICAgIG0gPSBrWzBdO1xuICAgICAgICAgICAgICAgICAgICBvID0gbFswXTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBuID0gMDsgbiA8IGQ7ICsrbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgbCA9IGFbbl07XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcCA9IGxbMl07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocCAmJiAhcC50ZXN0KGYpKSBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGsgPSBqLm1hdGNoKGxbMV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtID0ga1swXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvID0gbFswXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoIW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG8gPSBcInBsblwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgbSA9IGouc3Vic3RyaW5nKDAsIDEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGgucHVzaChlICsgaSwgbyk7XG4gICAgICAgICAgICAgICAgaSArPSBtLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBqID0gai5zdWJzdHJpbmcobS5sZW5ndGgpO1xuICAgICAgICAgICAgICAgIGlmIChvICE9PSBcImNvbVwiICYmIC9cXFMvLnRlc3QobSkpIGYgPSBtO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGg7XG4gICAgICAgIH07XG4gICAgfVxuICAgIHZhciBvYSA9IHYoXG4gICAgICAgIFtdLFxuICAgICAgICBbXG4gICAgICAgICAgICBbXCJwbG5cIiwgL15bXjxdKy8sIG51bGxdLFxuICAgICAgICAgICAgW1wiZGVjXCIsIC9ePCFcXHdbXj5dKig/Oj58JCkvLCBudWxsXSxcbiAgICAgICAgICAgIFtcImNvbVwiLCAvXjwhLS1bXFxzXFxTXSo/KD86LS1cXD58JCkvLCBudWxsXSxcbiAgICAgICAgICAgIFtcInNyY1wiLCAvXjxcXD9bXFxzXFxTXSo/KD86XFw/PnwkKS8sIG51bGxdLFxuICAgICAgICAgICAgW1wic3JjXCIsIC9ePCVbXFxzXFxTXSo/KD86JT58JCkvLCBudWxsXSxcbiAgICAgICAgICAgIFtcInNyY1wiLCAvXjwoc2NyaXB0fHN0eWxlfHhtcClcXGJbXj5dKj5bXFxzXFxTXSo/PFxcL1xcMVxcYltePl0qPi9pLCBudWxsXSxcbiAgICAgICAgICAgIFtcInRhZ1wiLCAvXjxcXC8/XFx3W148Pl0qPi8sIG51bGxdXG4gICAgICAgIF1cbiAgICApO1xuICAgIGZ1bmN0aW9uIHBhKGIpIHtcbiAgICAgICAgdmFyIGEgPSBvYShiKTtcbiAgICAgICAgZm9yICh2YXIgYyA9IDA7IGMgPCBhLmxlbmd0aDsgYyArPSAyKVxuICAgICAgICAgICAgaWYgKGFbYyArIDFdID09PSBcInNyY1wiKSB7XG4gICAgICAgICAgICAgICAgdmFyIGQsIGc7XG4gICAgICAgICAgICAgICAgZCA9IGFbY107XG4gICAgICAgICAgICAgICAgZyA9IGMgKyAyIDwgYS5sZW5ndGggPyBhW2MgKyAyXSA6IGIubGVuZ3RoO1xuICAgICAgICAgICAgICAgIHZhciBlID0gYi5zdWJzdHJpbmcoZCwgZyksXG4gICAgICAgICAgICAgICAgICAgIGggPSBlLm1hdGNoKC9eKDxbXj5dKj4pKFtcXHNcXFNdKikoPFxcL1tePl0qPikkLyk7XG4gICAgICAgICAgICAgICAgaWYgKGgpXG4gICAgICAgICAgICAgICAgICAgIGEuc3BsaWNlKFxuICAgICAgICAgICAgICAgICAgICAgICAgYyxcbiAgICAgICAgICAgICAgICAgICAgICAgIDIsXG4gICAgICAgICAgICAgICAgICAgICAgICBkLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0YWdcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGQgKyBoWzFdLmxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3JjXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBkICsgaFsxXS5sZW5ndGggKyAoaFsyXSB8fCBcIlwiKS5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInRhZ1wiXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIHJldHVybiBhO1xuICAgIH1cbiAgICB2YXIgcWEgPSB2KFxuICAgICAgICBbXG4gICAgICAgICAgICBbXCJhdHZcIiwgL15cXCdbXlxcJ10qKD86XFwnfCQpLywgbnVsbCwgXCInXCJdLFxuICAgICAgICAgICAgW1wiYXR2XCIsIC9eXFxcIlteXFxcIl0qKD86XFxcInwkKS8sIG51bGwsICdcIiddLFxuICAgICAgICAgICAgW1wicHVuXCIsIC9eWzw+XFwvPV0rLywgbnVsbCwgXCI8Pi89XCJdXG4gICAgICAgIF0sXG4gICAgICAgIFtcbiAgICAgICAgICAgIFtcInRhZ1wiLCAvXltcXHc6XFwtXSsvLCAvXjwvXSxcbiAgICAgICAgICAgIFtcImF0dlwiLCAvXltcXHdcXC1dKy8sIC9ePS9dLFxuICAgICAgICAgICAgW1wiYXRuXCIsIC9eW1xcdzpcXC1dKy8sIG51bGxdLFxuICAgICAgICAgICAgW1wicGxuXCIsIC9eXFxzKy8sIG51bGwsIFwiIFxcdFxcclxcblwiXVxuICAgICAgICBdXG4gICAgKTtcbiAgICBmdW5jdGlvbiByYShiLCBhKSB7XG4gICAgICAgIGZvciAodmFyIGMgPSAwOyBjIDwgYS5sZW5ndGg7IGMgKz0gMikge1xuICAgICAgICAgICAgdmFyIGQgPSBhW2MgKyAxXTtcbiAgICAgICAgICAgIGlmIChkID09PSBcInRhZ1wiKSB7XG4gICAgICAgICAgICAgICAgdmFyIGcsIGU7XG4gICAgICAgICAgICAgICAgZyA9IGFbY107XG4gICAgICAgICAgICAgICAgZSA9IGMgKyAyIDwgYS5sZW5ndGggPyBhW2MgKyAyXSA6IGIubGVuZ3RoO1xuICAgICAgICAgICAgICAgIHZhciBoID0gYi5zdWJzdHJpbmcoZywgZSksXG4gICAgICAgICAgICAgICAgICAgIGYgPSBxYShoLCBnKTtcbiAgICAgICAgICAgICAgICB1KGYsIGEsIGMsIDIpO1xuICAgICAgICAgICAgICAgIGMgKz0gZi5sZW5ndGggLSAyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhO1xuICAgIH1cbiAgICBmdW5jdGlvbiByKGIpIHtcbiAgICAgICAgdmFyIGEgPSBbXSxcbiAgICAgICAgICAgIGMgPSBbXTtcbiAgICAgICAgaWYgKGIudHJpcGxlUXVvdGVkU3RyaW5ncylcbiAgICAgICAgICAgIGEucHVzaChbXG4gICAgICAgICAgICAgICAgXCJzdHJcIixcbiAgICAgICAgICAgICAgICAvXig/OlxcJ1xcJ1xcJyg/OlteXFwnXFxcXF18XFxcXFtcXHNcXFNdfFxcJ3sxLDJ9KD89W15cXCddKSkqKD86XFwnXFwnXFwnfCQpfFxcXCJcXFwiXFxcIig/OlteXFxcIlxcXFxdfFxcXFxbXFxzXFxTXXxcXFwiezEsMn0oPz1bXlxcXCJdKSkqKD86XFxcIlxcXCJcXFwifCQpfFxcJyg/OlteXFxcXFxcJ118XFxcXFtcXHNcXFNdKSooPzpcXCd8JCl8XFxcIig/OlteXFxcXFxcXCJdfFxcXFxbXFxzXFxTXSkqKD86XFxcInwkKSkvLFxuICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgXCInXFxcIlwiXG4gICAgICAgICAgICBdKTtcbiAgICAgICAgZWxzZSBpZiAoYi5tdWx0aUxpbmVTdHJpbmdzKVxuICAgICAgICAgICAgYS5wdXNoKFtcbiAgICAgICAgICAgICAgICBcInN0clwiLFxuICAgICAgICAgICAgICAgIC9eKD86XFwnKD86W15cXFxcXFwnXXxcXFxcW1xcc1xcU10pKig/OlxcJ3wkKXxcXFwiKD86W15cXFxcXFxcIl18XFxcXFtcXHNcXFNdKSooPzpcXFwifCQpfFxcYCg/OlteXFxcXFxcYF18XFxcXFtcXHNcXFNdKSooPzpcXGB8JCkpLyxcbiAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgIFwiJ1xcXCJgXCJcbiAgICAgICAgICAgIF0pO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICBhLnB1c2goW1xuICAgICAgICAgICAgICAgIFwic3RyXCIsXG4gICAgICAgICAgICAgICAgL14oPzpcXCcoPzpbXlxcXFxcXCdcXHJcXG5dfFxcXFwuKSooPzpcXCd8JCl8XFxcIig/OlteXFxcXFxcXCJcXHJcXG5dfFxcXFwuKSooPzpcXFwifCQpKS8sXG4gICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICBcIlxcXCInXCJcbiAgICAgICAgICAgIF0pO1xuICAgICAgICBjLnB1c2goW1wicGxuXCIsIC9eKD86W15cXCdcXFwiXFxgXFwvXFwjXSspLywgbnVsbCwgXCIgXFxyXFxuXCJdKTtcbiAgICAgICAgaWYgKGIuaGFzaENvbW1lbnRzKSBhLnB1c2goW1wiY29tXCIsIC9eI1teXFxyXFxuXSovLCBudWxsLCBcIiNcIl0pO1xuICAgICAgICBpZiAoYi5jU3R5bGVDb21tZW50cykgYy5wdXNoKFtcImNvbVwiLCAvXlxcL1xcL1teXFxyXFxuXSovLCBudWxsXSk7XG4gICAgICAgIGlmIChiLnJlZ2V4TGl0ZXJhbHMpXG4gICAgICAgICAgICBjLnB1c2goW1xuICAgICAgICAgICAgICAgIFwic3RyXCIsXG4gICAgICAgICAgICAgICAgL15cXC8oPzpbXlxcXFxcXCpcXC9cXFtdfFxcXFxbXFxzXFxTXXxcXFsoPzpbXlxcXVxcXFxdfFxcXFwuKSooPzpcXF18JCkpKyg/OlxcL3wkKS8sXG4gICAgICAgICAgICAgICAgWVxuICAgICAgICAgICAgXSk7XG4gICAgICAgIGlmIChiLmNTdHlsZUNvbW1lbnRzKSBjLnB1c2goW1wiY29tXCIsIC9eXFwvXFwqW1xcc1xcU10qPyg/OlxcKlxcL3wkKS8sIG51bGxdKTtcbiAgICAgICAgdmFyIGQgPSB4KGIua2V5d29yZHMpO1xuICAgICAgICBiID0gbnVsbDtcbiAgICAgICAgdmFyIGcgPSB2KGEsIGMpLFxuICAgICAgICAgICAgZSA9IHYoXG4gICAgICAgICAgICAgICAgW10sXG4gICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICBbXCJwbG5cIiwgL15cXHMrLywgbnVsbCwgXCIgXFxyXFxuXCJdLFxuICAgICAgICAgICAgICAgICAgICBbXCJwbG5cIiwgL15bYS16XyRAXVthLXpfJEAwLTldKi9pLCBudWxsXSxcbiAgICAgICAgICAgICAgICAgICAgW1wibGl0XCIsIC9eMHhbYS1mMC05XStbYS16XS9pLCBudWxsXSxcbiAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJsaXRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIC9eKD86XFxkKD86X1xcZCspKlxcZCooPzpcXC5cXGQqKT98XFwuXFxkKykoPzplWytcXC1dP1xcZCspP1thLXpdKi9pLFxuICAgICAgICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiMTIzNDU2Nzg5XCJcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgW1wicHVuXCIsIC9eW15cXHNcXHdcXC4kQF0rLywgbnVsbF1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICApO1xuICAgICAgICBmdW5jdGlvbiBoKGYsIGkpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgaS5sZW5ndGg7IGogKz0gMikge1xuICAgICAgICAgICAgICAgIHZhciBvID0gaVtqICsgMV07XG4gICAgICAgICAgICAgICAgaWYgKG8gPT09IFwicGxuXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG0sIGssIGwsIG47XG4gICAgICAgICAgICAgICAgICAgIG0gPSBpW2pdO1xuICAgICAgICAgICAgICAgICAgICBrID0gaiArIDIgPCBpLmxlbmd0aCA/IGlbaiArIDJdIDogZi5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgIGwgPSBmLnN1YnN0cmluZyhtLCBrKTtcbiAgICAgICAgICAgICAgICAgICAgbiA9IGUobCwgbSk7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHAgPSAwLCB0ID0gbi5sZW5ndGg7IHAgPCB0OyBwICs9IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB3ID0gbltwICsgMV07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodyA9PT0gXCJwbG5cIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBBID0gbltwXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQiA9IHAgKyAyIDwgdCA/IG5bcCArIDJdIDogbC5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHMgPSBmLnN1YnN0cmluZyhBLCBCKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocyA9PT0gXCIuXCIpIG5bcCArIDFdID0gXCJwdW5cIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChzIGluIGQpIG5bcCArIDFdID0gXCJrd2RcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICgvXkA/W0EtWl1bQS1aJF0qW2Etel1bQS1aYS16JF0qJC8udGVzdChzKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbltwICsgMV0gPSBzLmNoYXJBdCgwKSA9PT0gXCJAXCIgPyBcImxpdFwiIDogXCJ0eXBcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB1KG4sIGksIGosIDIpO1xuICAgICAgICAgICAgICAgICAgICBqICs9IG4ubGVuZ3RoIC0gMjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oZikge1xuICAgICAgICAgICAgdmFyIGkgPSBnKGYpO1xuICAgICAgICAgICAgaSA9IGgoZiwgaSk7XG4gICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgdmFyIEcgPSByKHtcbiAgICAgICAga2V5d29yZHM6IFcsXG4gICAgICAgIGhhc2hDb21tZW50czogdHJ1ZSxcbiAgICAgICAgY1N0eWxlQ29tbWVudHM6IHRydWUsXG4gICAgICAgIG11bHRpTGluZVN0cmluZ3M6IHRydWUsXG4gICAgICAgIHJlZ2V4TGl0ZXJhbHM6IHRydWVcbiAgICB9KTtcbiAgICBmdW5jdGlvbiBzYShiLCBhKSB7XG4gICAgICAgIGZvciAodmFyIGMgPSAwOyBjIDwgYS5sZW5ndGg7IGMgKz0gMikge1xuICAgICAgICAgICAgdmFyIGQgPSBhW2MgKyAxXTtcbiAgICAgICAgICAgIGlmIChkID09PSBcInNyY1wiKSB7XG4gICAgICAgICAgICAgICAgdmFyIGcsIGU7XG4gICAgICAgICAgICAgICAgZyA9IGFbY107XG4gICAgICAgICAgICAgICAgZSA9IGMgKyAyIDwgYS5sZW5ndGggPyBhW2MgKyAyXSA6IGIubGVuZ3RoO1xuICAgICAgICAgICAgICAgIHZhciBoID0gRyhiLnN1YnN0cmluZyhnLCBlKSk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgZiA9IDAsIGkgPSBoLmxlbmd0aDsgZiA8IGk7IGYgKz0gMikgaFtmXSArPSBnO1xuICAgICAgICAgICAgICAgIHUoaCwgYSwgYywgMik7XG4gICAgICAgICAgICAgICAgYyArPSBoLmxlbmd0aCAtIDI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGE7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHRhKGIsIGEpIHtcbiAgICAgICAgdmFyIGMgPSBmYWxzZTtcbiAgICAgICAgZm9yICh2YXIgZCA9IDA7IGQgPCBhLmxlbmd0aDsgZCArPSAyKSB7XG4gICAgICAgICAgICB2YXIgZyA9IGFbZCArIDFdLFxuICAgICAgICAgICAgICAgIGUsXG4gICAgICAgICAgICAgICAgaDtcbiAgICAgICAgICAgIGlmIChnID09PSBcImF0blwiKSB7XG4gICAgICAgICAgICAgICAgZSA9IGFbZF07XG4gICAgICAgICAgICAgICAgaCA9IGQgKyAyIDwgYS5sZW5ndGggPyBhW2QgKyAyXSA6IGIubGVuZ3RoO1xuICAgICAgICAgICAgICAgIGMgPSAvXm9ufF5zdHlsZSQvaS50ZXN0KGIuc3Vic3RyaW5nKGUsIGgpKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZyA9PT0gXCJhdHZcIikge1xuICAgICAgICAgICAgICAgIGlmIChjKSB7XG4gICAgICAgICAgICAgICAgICAgIGUgPSBhW2RdO1xuICAgICAgICAgICAgICAgICAgICBoID0gZCArIDIgPCBhLmxlbmd0aCA/IGFbZCArIDJdIDogYi5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmID0gYi5zdWJzdHJpbmcoZSwgaCksXG4gICAgICAgICAgICAgICAgICAgICAgICBpID0gZi5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgICAgICBqID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpID49IDIgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvXltcXFwiXFwnXS8udGVzdChmKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGYuY2hhckF0KDApID09PSBmLmNoYXJBdChpIC0gMSksXG4gICAgICAgICAgICAgICAgICAgICAgICBvLFxuICAgICAgICAgICAgICAgICAgICAgICAgbSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGs7XG4gICAgICAgICAgICAgICAgICAgIGlmIChqKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtID0gZSArIDE7XG4gICAgICAgICAgICAgICAgICAgICAgICBrID0gaCAtIDE7XG4gICAgICAgICAgICAgICAgICAgICAgICBvID0gZjtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG0gPSBlICsgMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGsgPSBoIC0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG8gPSBmLnN1YnN0cmluZygxLCBmLmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHZhciBsID0gRyhvKTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgbiA9IDAsIHAgPSBsLmxlbmd0aDsgbiA8IHA7IG4gKz0gMikgbFtuXSArPSBtO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaikge1xuICAgICAgICAgICAgICAgICAgICAgICAgbC5wdXNoKGssIFwiYXR2XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdShsLCBhLCBkICsgMiwgMCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB1KGwsIGEsIGQsIDIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGE7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHVhKGIpIHtcbiAgICAgICAgdmFyIGEgPSBwYShiKTtcbiAgICAgICAgYSA9IHJhKGIsIGEpO1xuICAgICAgICBhID0gc2EoYiwgYSk7XG4gICAgICAgIGEgPSB0YShiLCBhKTtcbiAgICAgICAgcmV0dXJuIGE7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHZhKGIsIGEsIGMpIHtcbiAgICAgICAgdmFyIGQgPSBbXSxcbiAgICAgICAgICAgIGcgPSAwLFxuICAgICAgICAgICAgZSA9IG51bGwsXG4gICAgICAgICAgICBoID0gbnVsbCxcbiAgICAgICAgICAgIGYgPSAwLFxuICAgICAgICAgICAgaSA9IDAsXG4gICAgICAgICAgICBqID0gaWEoOCk7XG4gICAgICAgIGZ1bmN0aW9uIG8oaykge1xuICAgICAgICAgICAgaWYgKGsgPiBnKSB7XG4gICAgICAgICAgICAgICAgaWYgKGUgJiYgZSAhPT0gaCkge1xuICAgICAgICAgICAgICAgICAgICBkLnB1c2goXCI8L3NwYW4+XCIpO1xuICAgICAgICAgICAgICAgICAgICBlID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFlICYmIGgpIHtcbiAgICAgICAgICAgICAgICAgICAgZSA9IGg7XG4gICAgICAgICAgICAgICAgICAgIGQucHVzaCgnPHNwYW4gY2xhc3M9XCInLCBlLCAnXCI+Jyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBsID0gRShqKGIuc3Vic3RyaW5nKGcsIGspKSlcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLyhcXHJcXG4/fFxcbnwgKSAvZywgXCIkMSZuYnNwO1wiKVxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxyXFxuP3xcXG4vZywgXCI8YnIgLz5cIik7XG4gICAgICAgICAgICAgICAgZC5wdXNoKGwpO1xuICAgICAgICAgICAgICAgIGcgPSBrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICB2YXIgbTtcbiAgICAgICAgICAgIG0gPSBmIDwgYS5sZW5ndGggPyAoaSA8IGMubGVuZ3RoID8gYVtmXSA8PSBjW2ldIDogdHJ1ZSkgOiBmYWxzZTtcbiAgICAgICAgICAgIGlmIChtKSB7XG4gICAgICAgICAgICAgICAgbyhhW2ZdKTtcbiAgICAgICAgICAgICAgICBpZiAoZSkge1xuICAgICAgICAgICAgICAgICAgICBkLnB1c2goXCI8L3NwYW4+XCIpO1xuICAgICAgICAgICAgICAgICAgICBlID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZC5wdXNoKGFbZiArIDFdKTtcbiAgICAgICAgICAgICAgICBmICs9IDI7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGkgPCBjLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIG8oY1tpXSk7XG4gICAgICAgICAgICAgICAgaCA9IGNbaSArIDFdO1xuICAgICAgICAgICAgICAgIGkgKz0gMjtcbiAgICAgICAgICAgIH0gZWxzZSBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBvKGIubGVuZ3RoKTtcbiAgICAgICAgaWYgKGUpIGQucHVzaChcIjwvc3Bhbj5cIik7XG4gICAgICAgIHJldHVybiBkLmpvaW4oXCJcIik7XG4gICAgfVxuICAgIHZhciBDID0ge307XG4gICAgZnVuY3Rpb24gcShiLCBhKSB7XG4gICAgICAgIGZvciAodmFyIGMgPSBhLmxlbmd0aDsgLS1jID49IDA7ICkge1xuICAgICAgICAgICAgdmFyIGQgPSBhW2NdO1xuICAgICAgICAgICAgaWYgKCFDLmhhc093blByb3BlcnR5KGQpKSBDW2RdID0gYjtcbiAgICAgICAgICAgIGVsc2UgaWYgKFwiY29uc29sZVwiIGluIHdpbmRvdylcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImNhbm5vdCBvdmVycmlkZSBsYW5ndWFnZSBoYW5kbGVyICVzXCIsIGQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHEoRywgW1wiZGVmYXVsdC1jb2RlXCJdKTtcbiAgICBxKHVhLCBbXCJkZWZhdWx0LW1hcmt1cFwiLCBcImh0bWxcIiwgXCJodG1cIiwgXCJ4aHRtbFwiLCBcInhtbFwiLCBcInhzbFwiXSk7XG4gICAgcShcbiAgICAgICAgcih7XG4gICAgICAgICAgICBrZXl3b3JkczogSSxcbiAgICAgICAgICAgIGhhc2hDb21tZW50czogdHJ1ZSxcbiAgICAgICAgICAgIGNTdHlsZUNvbW1lbnRzOiB0cnVlXG4gICAgICAgIH0pLFxuICAgICAgICBbXCJjXCIsIFwiY2NcIiwgXCJjcHBcIiwgXCJjc1wiLCBcImN4eFwiLCBcImN5Y1wiXVxuICAgICk7XG4gICAgcShcbiAgICAgICAgcih7XG4gICAgICAgICAgICBrZXl3b3JkczogSixcbiAgICAgICAgICAgIGNTdHlsZUNvbW1lbnRzOiB0cnVlXG4gICAgICAgIH0pLFxuICAgICAgICBbXCJqYXZhXCJdXG4gICAgKTtcbiAgICBxKFxuICAgICAgICByKHtcbiAgICAgICAgICAgIGtleXdvcmRzOiBPLFxuICAgICAgICAgICAgaGFzaENvbW1lbnRzOiB0cnVlLFxuICAgICAgICAgICAgbXVsdGlMaW5lU3RyaW5nczogdHJ1ZVxuICAgICAgICB9KSxcbiAgICAgICAgW1wiYnNoXCIsIFwiY3NoXCIsIFwic2hcIl1cbiAgICApO1xuICAgIHEoXG4gICAgICAgIHIoe1xuICAgICAgICAgICAga2V5d29yZHM6IE0sXG4gICAgICAgICAgICBoYXNoQ29tbWVudHM6IHRydWUsXG4gICAgICAgICAgICBtdWx0aUxpbmVTdHJpbmdzOiB0cnVlLFxuICAgICAgICAgICAgdHJpcGxlUXVvdGVkU3RyaW5nczogdHJ1ZVxuICAgICAgICB9KSxcbiAgICAgICAgW1wiY3ZcIiwgXCJweVwiXVxuICAgICk7XG4gICAgcShcbiAgICAgICAgcih7XG4gICAgICAgICAgICBrZXl3b3JkczogTCxcbiAgICAgICAgICAgIGhhc2hDb21tZW50czogdHJ1ZSxcbiAgICAgICAgICAgIG11bHRpTGluZVN0cmluZ3M6IHRydWUsXG4gICAgICAgICAgICByZWdleExpdGVyYWxzOiB0cnVlXG4gICAgICAgIH0pLFxuICAgICAgICBbXCJwZXJsXCIsIFwicGxcIiwgXCJwbVwiXVxuICAgICk7XG4gICAgcShcbiAgICAgICAgcih7XG4gICAgICAgICAgICBrZXl3b3JkczogTixcbiAgICAgICAgICAgIGhhc2hDb21tZW50czogdHJ1ZSxcbiAgICAgICAgICAgIG11bHRpTGluZVN0cmluZ3M6IHRydWUsXG4gICAgICAgICAgICByZWdleExpdGVyYWxzOiB0cnVlXG4gICAgICAgIH0pLFxuICAgICAgICBbXCJyYlwiXVxuICAgICk7XG4gICAgcShcbiAgICAgICAgcih7XG4gICAgICAgICAgICBrZXl3b3JkczogSyxcbiAgICAgICAgICAgIGNTdHlsZUNvbW1lbnRzOiB0cnVlLFxuICAgICAgICAgICAgcmVnZXhMaXRlcmFsczogdHJ1ZVxuICAgICAgICB9KSxcbiAgICAgICAgW1wianNcIl1cbiAgICApO1xuICAgIGZ1bmN0aW9uIFQoYiwgYSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdmFyIGMgPSBuYShiKSxcbiAgICAgICAgICAgICAgICBkID0gYy5zb3VyY2UsXG4gICAgICAgICAgICAgICAgZyA9IGMudGFncztcbiAgICAgICAgICAgIGlmICghQy5oYXNPd25Qcm9wZXJ0eShhKSlcbiAgICAgICAgICAgICAgICBhID0gL15cXHMqPC8udGVzdChkKSA/IFwiZGVmYXVsdC1tYXJrdXBcIiA6IFwiZGVmYXVsdC1jb2RlXCI7XG4gICAgICAgICAgICB2YXIgZSA9IENbYV0uY2FsbCh7fSwgZCk7XG4gICAgICAgICAgICByZXR1cm4gdmEoZCwgZywgZSk7XG4gICAgICAgIH0gY2F0Y2ggKGgpIHtcbiAgICAgICAgICAgIGlmIChcImNvbnNvbGVcIiBpbiB3aW5kb3cpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhoKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLnRyYWNlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYjtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiB3YShiKSB7XG4gICAgICAgIHZhciBhID0gSCgpLFxuICAgICAgICAgICAgYyA9IFtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInByZVwiKSxcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImNvZGVcIiksXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJsaVwiKSxcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInhtcFwiKVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIGQgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgZyA9IDA7IGcgPCBjLmxlbmd0aDsgKytnKVxuICAgICAgICAgICAgZm9yICh2YXIgZSA9IDA7IGUgPCBjW2ddLmxlbmd0aDsgKytlKSBkLnB1c2goY1tnXVtlXSk7XG4gICAgICAgIGMgPSBudWxsO1xuICAgICAgICB2YXIgaCA9IDA7XG4gICAgICAgIGZ1bmN0aW9uIGYoKSB7XG4gICAgICAgICAgICB2YXIgaSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpICsgMjUwO1xuICAgICAgICAgICAgZm9yICg7IGggPCBkLmxlbmd0aCAmJiBuZXcgRGF0ZSgpLmdldFRpbWUoKSA8IGk7IGgrKykge1xuICAgICAgICAgICAgICAgIHZhciBqID0gZFtoXTtcbiAgICAgICAgICAgICAgICBpZiAoai5jbGFzc05hbWUgJiYgai5jbGFzc05hbWUuaW5kZXhPZihcInByZXR0eXByaW50XCIpID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG8gPSBqLmNsYXNzTmFtZS5tYXRjaCgvXFxibGFuZy0oXFx3KylcXGIvKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG8pIG8gPSBvWzFdO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBrID0gai5wYXJlbnROb2RlOyBrOyBrID0gay5wYXJlbnROb2RlKVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChrLnRhZ05hbWUgPT09IFwicHJlXCIgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgay50YWdOYW1lID09PSBcImNvZGVcIiB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrLnRhZ05hbWUgPT09IFwieG1wXCIpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgay5jbGFzc05hbWUgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrLmNsYXNzTmFtZS5pbmRleE9mKFwicHJldHR5cHJpbnRcIikgPj0gMFxuICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICghbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGwgPSBoYShqKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGwgPSBsLnJlcGxhY2UoLyg/Olxcclxcbj98XFxuKSQvLCBcIlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuID0gVChsLCBvKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghUyhqKSkgai5pbm5lckhUTUwgPSBuO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiUFJFXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHQgPSAwOyB0IDwgai5hdHRyaWJ1dGVzLmxlbmd0aDsgKyt0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB3ID0gai5hdHRyaWJ1dGVzW3RdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAody5zcGVjaWZpZWQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwLnNldEF0dHJpYnV0ZSh3Lm5hbWUsIHcudmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwLmlubmVySFRNTCA9IG47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgai5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChwLCBqKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwID0gajtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhICYmIGoudGFnTmFtZSA9PT0gXCJQUkVcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBBID0gai5nZXRFbGVtZW50c0J5VGFnTmFtZShcImJyXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIEIgPSBBLmxlbmd0aDsgLS1CID49IDA7ICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcyA9IEFbQl07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHMucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIlxcclxcblwiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaCA8IGQubGVuZ3RoKSBzZXRUaW1lb3V0KGYsIDI1MCk7XG4gICAgICAgICAgICBlbHNlIGlmIChiKSBiKCk7XG4gICAgICAgIH1cbiAgICAgICAgZigpO1xuICAgIH1cbiAgICB3aW5kb3cuUFJfbm9ybWFsaXplZEh0bWwgPSB6O1xuICAgIHdpbmRvdy5wcmV0dHlQcmludE9uZSA9IFQ7XG4gICAgd2luZG93LnByZXR0eVByaW50ID0gd2E7XG4gICAgd2luZG93LlBSID0ge1xuICAgICAgICBjcmVhdGVTaW1wbGVMZXhlcjogdixcbiAgICAgICAgcmVnaXN0ZXJMYW5nSGFuZGxlcjogcSxcbiAgICAgICAgc291cmNlRGVjb3JhdG9yOiByLFxuICAgICAgICBQUl9BVFRSSUJfTkFNRTogXCJhdG5cIixcbiAgICAgICAgUFJfQVRUUklCX1ZBTFVFOiBcImF0dlwiLFxuICAgICAgICBQUl9DT01NRU5UOiBcImNvbVwiLFxuICAgICAgICBQUl9ERUNMQVJBVElPTjogXCJkZWNcIixcbiAgICAgICAgUFJfS0VZV09SRDogXCJrd2RcIixcbiAgICAgICAgUFJfTElURVJBTDogXCJsaXRcIixcbiAgICAgICAgUFJfUExBSU46IFwicGxuXCIsXG4gICAgICAgIFBSX1BVTkNUVUFUSU9OOiBcInB1blwiLFxuICAgICAgICBQUl9TT1VSQ0U6IFwic3JjXCIsXG4gICAgICAgIFBSX1NUUklORzogXCJzdHJcIixcbiAgICAgICAgUFJfVEFHOiBcInRhZ1wiLFxuICAgICAgICBQUl9UWVBFOiBcInR5cFwiXG4gICAgfTtcbn0pKCk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbi8qKlxuICogVGhpcyBmaWxlIGFkYXB0ZWQgZnJvbSBKU05ldHdvcmtYOiBodHRwczovL2dpdGh1Yi5jb20vZmtsaW5nL0pTTmV0d29ya1hcbiAqIENvcHlyaWdodCAoQykgMjAxMiBGZWxpeCBLbGluZyA8ZmVsaXgua2xpbmdAZ214Lm5ldD5cbiAqIEpTTmV0d29ya1ggaXMgZGlzdHJpYnV0ZWQgd2l0aCB0aGUgQlNEIGxpY2Vuc2VcbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gaGFzUGF0aChHLCB7IHNvdXJjZSwgdGFyZ2V0IH0pIHtcbiAgICB0cnkge1xuICAgICAgICBiaWRpcmVjdGlvbmFsU2hvcnRlc3RQYXRoKEcsIHNvdXJjZSwgdGFyZ2V0KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBKU05ldHdvcmtYTm9QYXRoKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBub2Rlc0FyZUVxdWFsKGEsIGIpIHtcbiAgICByZXR1cm4gYSA9PT0gYiB8fCAodHlwZW9mIGEgPT09IFwib2JqZWN0XCIgJiYgYS50b1N0cmluZygpID09PSBiLnRvU3RyaW5nKCkpO1xufVxuXG5mdW5jdGlvbiBiaWRpcmVjdGlvbmFsU2hvcnRlc3RQYXRoKEcsIHNvdXJjZSwgdGFyZ2V0KSB7XG4gICAgLy8gY2FsbCBoZWxwZXIgdG8gZG8gdGhlIHJlYWwgd29ya1xuICAgIHZhciBbcHJlZCwgc3VjYywgd10gPSBiaWRpcmVjdGlvbmFsUHJlZFN1Y2MoRywgc291cmNlLCB0YXJnZXQpO1xuXG4gICAgLy8gYnVpbGQgcGF0aCBmcm9tIHByZWQrdytzdWNjXG4gICAgdmFyIHBhdGggPSBbXTtcbiAgICAvLyBmcm9tIHNvdXJjZSB0byB3XG4gICAgd2hpbGUgKHcgIT0gbnVsbCkge1xuICAgICAgICBwYXRoLnB1c2godyk7XG4gICAgICAgIHcgPSBwcmVkLmdldCh3KTtcbiAgICB9XG4gICAgdyA9IHN1Y2MuZ2V0KHBhdGhbMF0pO1xuICAgIHBhdGgucmV2ZXJzZSgpO1xuICAgIC8vIGZyb20gdyB0byB0YXJnZXRcbiAgICB3aGlsZSAodyAhPSBudWxsKSB7XG4gICAgICAgIHBhdGgucHVzaCh3KTtcbiAgICAgICAgdyA9IHN1Y2MuZ2V0KHcpO1xuICAgIH1cbiAgICByZXR1cm4gcGF0aDtcbn1cblxuZnVuY3Rpb24gYmlkaXJlY3Rpb25hbFByZWRTdWNjKEcsIHNvdXJjZSwgdGFyZ2V0KSB7XG4gICAgLy8gZG9lcyBCRlMgZnJvbSBib3RoIHNvdXJjZSBhbmQgdGFyZ2V0IGFuZCBtZWV0cyBpbiB0aGUgbWlkZGxlXG4gICAgaWYgKG5vZGVzQXJlRXF1YWwoc291cmNlLCB0YXJnZXQpKSB7XG4gICAgICAgIHJldHVybiBbbmV3IE1hcChbW3NvdXJjZSwgbnVsbF1dKSwgbmV3IE1hcChbW3RhcmdldCwgbnVsbF1dKSwgc291cmNlXTtcbiAgICB9XG5cbiAgICAvLyBoYW5kbGUgZWl0aGVyIGRpcmVjdGVkIG9yIHVuZGlyZWN0ZWRcbiAgICB2YXIgZ3ByZWQsIGdzdWNjO1xuICAgIGdwcmVkID0gRy5wcmVkZWNlc3NvcnNJdGVyLmJpbmQoRyk7XG4gICAgZ3N1Y2MgPSBHLnN1Y2Nlc3NvcnNJdGVyLmJpbmQoRyk7XG5cbiAgICAvLyBwcmVkZWNlc3Nzb3IgYW5kIHN1Y2Nlc3NvcnMgaW4gc2VhcmNoXG4gICAgdmFyIHByZWQgPSBuZXcgTWFwKFtbc291cmNlLCBudWxsXV0pO1xuICAgIHZhciBzdWNjID0gbmV3IE1hcChbW3RhcmdldCwgbnVsbF1dKTtcbiAgICAvL1xuICAgIC8vIGluaXRpYWxpemUgZnJpbmdlcywgc3RhcnQgd2l0aCBmb3J3YXJkXG4gICAgdmFyIGZvcndhcmRGcmluZ2UgPSBbc291cmNlXTtcbiAgICB2YXIgcmV2ZXJzZUZyaW5nZSA9IFt0YXJnZXRdO1xuICAgIHZhciB0aGlzTGV2ZWw7XG5cbiAgICAvKmpzaGludCBuZXdjYXA6ZmFsc2UqL1xuICAgIHdoaWxlIChmb3J3YXJkRnJpbmdlLmxlbmd0aCA+IDAgJiYgcmV2ZXJzZUZyaW5nZS5sZW5ndGggPiAwKSB7XG4gICAgICAgIGlmIChmb3J3YXJkRnJpbmdlLmxlbmd0aCA8PSByZXZlcnNlRnJpbmdlLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhpc0xldmVsID0gZm9yd2FyZEZyaW5nZTtcbiAgICAgICAgICAgIGZvcndhcmRGcmluZ2UgPSBbXTtcbiAgICAgICAgICAgIGZvciAobGV0IHYgb2YgdGhpc0xldmVsKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgdyBvZiBnc3VjYyh2KSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXByZWQuaGFzKHcpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3J3YXJkRnJpbmdlLnB1c2godyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVkLnNldCh3LCB2KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoc3VjYy5oYXModykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbcHJlZCwgc3VjYywgd107IC8vIGZvdW5kIHBhdGhcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXNMZXZlbCA9IHJldmVyc2VGcmluZ2U7XG4gICAgICAgICAgICByZXZlcnNlRnJpbmdlID0gW107XG4gICAgICAgICAgICBmb3IgKGxldCB2IG9mIHRoaXNMZXZlbCkge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IHcgb2YgZ3ByZWQodikpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFzdWNjLmhhcyh3KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV2ZXJzZUZyaW5nZS5wdXNoKHcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3VjYy5zZXQodywgdik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHByZWQuaGFzKHcpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gW3ByZWQsIHN1Y2MsIHddOyAvLyBmb3VuZCBwYXRoXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgdGhyb3cgbmV3IEpTTmV0d29ya1hOb1BhdGgoXG4gICAgICAgIFwiTm8gcGF0aCBiZXR3ZWVuIFwiICtcbiAgICAgICAgICAgIHNvdXJjZS50b1N0cmluZygpICtcbiAgICAgICAgICAgIFwiIGFuZCBcIiArXG4gICAgICAgICAgICB0YXJnZXQudG9TdHJpbmcoKSArXG4gICAgICAgICAgICBcIi5cIixcbiAgICApO1xufVxuXG5mdW5jdGlvbiB0b3BvbG9naWNhbFNvcnQoRywgb3B0TmJ1bmNoKSB7XG4gICAgLy8gbm9ucmVjdXJzaXZlIHZlcnNpb25cbiAgICB2YXIgc2VlbiA9IG5ldyBTZXQoKTtcbiAgICB2YXIgb3JkZXJFeHBsb3JlZCA9IFtdOyAvLyBwcm92aWRlIG9yZGVyIGFuZFxuICAgIC8vIGZhc3Qgc2VhcmNoIHdpdGhvdXQgbW9yZSBnZW5lcmFsIHByaW9yaXR5RGljdGlvbmFyeVxuICAgIHZhciBleHBsb3JlZCA9IG5ldyBTZXQoKTtcblxuICAgIGlmIChvcHROYnVuY2ggPT0gbnVsbCkge1xuICAgICAgICBvcHROYnVuY2ggPSBHLm5vZGVzSXRlcigpO1xuICAgIH1cblxuICAgIGZvciAobGV0IHYgb2Ygb3B0TmJ1bmNoKSB7XG4gICAgICAgIC8vIHByb2Nlc3MgYWxsIHZlcnRpY2VzIGluIEdcbiAgICAgICAgaWYgKGV4cGxvcmVkLmhhcyh2KSkge1xuICAgICAgICAgICAgcmV0dXJuOyAvLyBjb250aW51ZVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGZyaW5nZSA9IFt2XTsgLy8gbm9kZXMgeWV0IHRvIGxvb2sgYXRcbiAgICAgICAgd2hpbGUgKGZyaW5nZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB2YXIgdyA9IGZyaW5nZVtmcmluZ2UubGVuZ3RoIC0gMV07IC8vIGRlcHRoIGZpcnN0IHNlYXJjaFxuICAgICAgICAgICAgaWYgKGV4cGxvcmVkLmhhcyh3KSkge1xuICAgICAgICAgICAgICAgIC8vIGFscmVhZHkgbG9va2VkIGRvd24gdGhpcyBicmFuY2hcbiAgICAgICAgICAgICAgICBmcmluZ2UucG9wKCk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZWVuLmFkZCh3KTsgLy8gbWFyayBhcyBzZWVuXG4gICAgICAgICAgICAvLyBDaGVjayBzdWNjZXNzb3JzIGZvciBjeWNsZXMgZm9yIG5ldyBub2Rlc1xuICAgICAgICAgICAgdmFyIG5ld05vZGVzID0gW107XG4gICAgICAgICAgICAvKmVzbGludC1kaXNhYmxlIG5vLWxvb3AtZnVuYyovXG4gICAgICAgICAgICBHLmdldCh3KS5mb3JFYWNoKGZ1bmN0aW9uIChfLCBuKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFleHBsb3JlZC5oYXMobikpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlZW4uaGFzKG4pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBDWUNMRSAhIVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEpTTmV0d29ya1hVbmZlYXNpYmxlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiR3JhcGggY29udGFpbnMgYSBjeWNsZS5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbmV3Tm9kZXMucHVzaChuKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8qZXNsaW50LWVuYWJsZSBuby1sb29wLWZ1bmMqL1xuICAgICAgICAgICAgaWYgKG5ld05vZGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAvLyBhZGQgbmV3IG5vZGVzIHRvIGZyaW5nZVxuICAgICAgICAgICAgICAgIGZyaW5nZS5wdXNoLmFwcGx5KGZyaW5nZSwgbmV3Tm9kZXMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBleHBsb3JlZC5hZGQodyk7XG4gICAgICAgICAgICAgICAgb3JkZXJFeHBsb3JlZC51bnNoaWZ0KHcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG9yZGVyRXhwbG9yZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0RpcmVjdGVkQWN5Y2xpY0dyYXBoKEcpIHtcbiAgICB0cnkge1xuICAgICAgICB0b3BvbG9naWNhbFNvcnQoRyk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgIGlmIChleCBpbnN0YW5jZW9mIEpTTmV0d29ya1hVbmZlYXNpYmxlKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgZXg7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgRGlHcmFwaCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZ3JhcGggPSB7fTsgLy8gZGljdGlvbmFyeSBmb3IgZ3JhcGggYXR0cmlidXRlc1xuICAgICAgICB0aGlzLm5vZGUgPSBuZXcgTWFwKCk7IC8vIGRpY3Rpb25hcnkgZm9yIG5vZGUgYXR0cmlidXRlc1xuICAgICAgICAvLyBXZSBzdG9yZSB0d28gYWRqYWNlbmN5IGxpc3RzOlxuICAgICAgICAvLyB0aGUgcHJlZGVjZXNzb3JzIG9mIG5vZGUgbiBhcmUgc3RvcmVkIGluIHRoZSBkaWN0IHNlbGYucHJlZFxuICAgICAgICAvLyB0aGUgc3VjY2Vzc29ycyBvZiBub2RlIG4gYXJlIHN0b3JlZCBpbiB0aGUgZGljdCBzZWxmLnN1Y2M9c2VsZi5hZGpcbiAgICAgICAgdGhpcy5hZGogPSBuZXcgTWFwKCk7IC8vIGVtcHR5IGFkamFjZW5jeSBkaWN0aW9uYXJ5XG4gICAgICAgIHRoaXMucHJlZCA9IG5ldyBNYXAoKTsgLy8gcHJlZGVjZXNzb3JcbiAgICAgICAgdGhpcy5zdWNjID0gdGhpcy5hZGo7IC8vIHN1Y2Nlc3NvclxuXG4gICAgICAgIHRoaXMuZWRnZSA9IHRoaXMuYWRqO1xuICAgIH1cblxuICAgIGFkZE5vZGUobikge1xuICAgICAgICBpZiAoIXRoaXMuc3VjYy5oYXMobikpIHtcbiAgICAgICAgICAgIHRoaXMuc3VjYy5zZXQobiwgbmV3IE1hcCgpKTtcbiAgICAgICAgICAgIHRoaXMucHJlZC5zZXQobiwgbmV3IE1hcCgpKTtcbiAgICAgICAgICAgIHRoaXMubm9kZS5zZXQobik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhZGRFZGdlKHUsIHYpIHtcbiAgICAgICAgLy8gYWRkIG5vZGVzXG4gICAgICAgIGlmICghdGhpcy5zdWNjLmhhcyh1KSkge1xuICAgICAgICAgICAgdGhpcy5zdWNjLnNldCh1LCBuZXcgTWFwKCkpO1xuICAgICAgICAgICAgdGhpcy5wcmVkLnNldCh1LCBuZXcgTWFwKCkpO1xuICAgICAgICAgICAgdGhpcy5ub2RlLnNldCh1LCB7fSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMuc3VjYy5oYXModikpIHtcbiAgICAgICAgICAgIHRoaXMuc3VjYy5zZXQodiwgbmV3IE1hcCgpKTtcbiAgICAgICAgICAgIHRoaXMucHJlZC5zZXQodiwgbmV3IE1hcCgpKTtcbiAgICAgICAgICAgIHRoaXMubm9kZS5zZXQodiwge30pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gYWRkIHRoZSBlZGdlXG4gICAgICAgIHZhciBkYXRhZGljdCA9IHRoaXMuYWRqLmdldCh1KS5nZXQodikgfHwge307XG4gICAgICAgIHRoaXMuc3VjYy5nZXQodSkuc2V0KHYsIGRhdGFkaWN0KTtcbiAgICAgICAgdGhpcy5wcmVkLmdldCh2KS5zZXQodSwgZGF0YWRpY3QpO1xuICAgIH1cblxuICAgIG5vZGVzKG9wdERhdGEgPSBmYWxzZSkge1xuICAgICAgICByZXR1cm4gQXJyYXkuZnJvbShvcHREYXRhID8gdGhpcy5ub2RlLmVudHJpZXMoKSA6IHRoaXMubm9kZS5rZXlzKCkpO1xuICAgIH1cblxuICAgIGVkZ2VzKG9wdE5idW5jaCwgb3B0RGF0YSA9IGZhbHNlKSB7XG4gICAgICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMuZWRnZXNJdGVyKG9wdE5idW5jaCwgb3B0RGF0YSkpO1xuICAgIH1cblxuICAgIG5vZGVzSXRlcihvcHREYXRhID0gZmFsc2UpIHtcbiAgICAgICAgaWYgKG9wdERhdGEpIHtcbiAgICAgICAgICAgIHJldHVybiB0b0l0ZXJhdG9yKHRoaXMubm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMubm9kZS5rZXlzKCk7XG4gICAgfVxuXG4gICAgZ2V0KG4pIHtcbiAgICAgICAgdmFyIHZhbHVlID0gdGhpcy5hZGouZ2V0KG4pO1xuICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgS2V5RXJyb3IoXCJHcmFwaCBkb2VzIG5vdCBjb250YWluIG5vZGUgXCIgKyBuICsgXCIuXCIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBudW1iZXJPZk5vZGVzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5ub2RlLnNpemU7XG4gICAgfVxuXG4gICAgKm5idW5jaEl0ZXIob3B0TmJ1bmNoKSB7XG4gICAgICAgIGlmIChvcHROYnVuY2ggPT0gbnVsbCkge1xuICAgICAgICAgICAgLy8gaW5jbHVkZSBhbGwgbm9kZXNcbiAgICAgICAgICAgIC8qanNoaW50IGV4cHI6dHJ1ZSovXG4gICAgICAgICAgICB5aWVsZCogdGhpcy5hZGoua2V5cygpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaGFzTm9kZShvcHROYnVuY2gpKSB7XG4gICAgICAgICAgICAvLyBpZiBuYnVuY2ggaXMgYSBzaW5nbGUgbm9kZVxuICAgICAgICAgICAgeWllbGQgb3B0TmJ1bmNoO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gaWYgbmJ1bmNoIGlzIGEgc2VxdWVuY2Ugb2Ygbm9kZXNcbiAgICAgICAgICAgIHZhciBhZGogPSB0aGlzLmFkajtcblxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBuIG9mIHRvSXRlcmF0b3Iob3B0TmJ1bmNoKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYWRqLmhhcyhuKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgeWllbGQgbjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgICAgICAgICAgaWYgKGV4IGluc3RhbmNlb2YgVHlwZUVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBKU05ldHdvcmtYRXJyb3IoXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm5idW5jaCBpcyBub3QgYSBub2RlIG9yIGEgc2VxdWVuY2Ugb2Ygbm9kZXNcIixcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAqZWRnZXNJdGVyKG9wdE5idW5jaCwgb3B0RGF0YSA9IGZhbHNlKSB7XG4gICAgICAgIC8vIGhhbmRsZSBjYWxscyB3aXRoIG9wdF9kYXRhIGJlaW5nIHRoZSBvbmx5IGFyZ3VtZW50XG4gICAgICAgIGlmIChpc0Jvb2xlYW4ob3B0TmJ1bmNoKSkge1xuICAgICAgICAgICAgb3B0RGF0YSA9IG9wdE5idW5jaDtcbiAgICAgICAgICAgIG9wdE5idW5jaCA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBub2Rlc05icnM7XG5cbiAgICAgICAgaWYgKG9wdE5idW5jaCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBub2Rlc05icnMgPSB0aGlzLmFkajtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5vZGVzTmJycyA9IG1hcEl0ZXJhdG9yKHRoaXMubmJ1bmNoSXRlcihvcHROYnVuY2gpLCAobikgPT5cbiAgICAgICAgICAgICAgICB0dXBsZTIobiwgdGhpcy5hZGouZ2V0KG4pKSxcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciBub2RlTmJycyBvZiBub2Rlc05icnMpIHtcbiAgICAgICAgICAgIGZvciAodmFyIG5ickRhdGEgb2Ygbm9kZU5icnNbMV0pIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gW25vZGVOYnJzWzBdLCBuYnJEYXRhWzBdXTtcbiAgICAgICAgICAgICAgICBpZiAob3B0RGF0YSkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRbMl0gPSBuYnJEYXRhWzFdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB5aWVsZCByZXN1bHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXZlcnNlKG9wdENvcHkgPSB0cnVlKSB7XG4gICAgICAgIHZhciBIO1xuICAgICAgICBpZiAob3B0Q29weSkge1xuICAgICAgICAgICAgSCA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yKG51bGwsIHtcbiAgICAgICAgICAgICAgICBuYW1lOiBcIlJldmVyc2Ugb2YgKFwiICsgdGhpcy5uYW1lICsgXCIpXCIsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIEguYWRkTm9kZXNGcm9tKHRoaXMpO1xuICAgICAgICAgICAgSC5hZGRFZGdlc0Zyb20oXG4gICAgICAgICAgICAgICAgbWFwSXRlcmF0b3IodGhpcy5lZGdlc0l0ZXIobnVsbCwgdHJ1ZSksIChlZGdlKSA9PlxuICAgICAgICAgICAgICAgICAgICB0dXBsZTNjKGVkZ2VbMV0sIGVkZ2VbMF0sIGRlZXBjb3B5KGVkZ2VbMl0pLCBlZGdlKSxcbiAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIEguZ3JhcGggPSBkZWVwY29weSh0aGlzLmdyYXBoKTtcbiAgICAgICAgICAgIEgubm9kZSA9IGRlZXBjb3B5KHRoaXMubm9kZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgdGhpc1ByZWQgPSB0aGlzLnByZWQ7XG4gICAgICAgICAgICB2YXIgdGhpc1N1Y2MgPSB0aGlzLnN1Y2M7XG5cbiAgICAgICAgICAgIHRoaXMuc3VjYyA9IHRoaXNQcmVkO1xuICAgICAgICAgICAgdGhpcy5wcmVkID0gdGhpc1N1Y2M7XG4gICAgICAgICAgICB0aGlzLmFkaiA9IHRoaXMuc3VjYztcbiAgICAgICAgICAgIEggPSB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBIO1xuICAgIH1cblxuICAgIHN1Y2Nlc3NvcnNJdGVyKG4pIHtcbiAgICAgICAgdmFyIG5icnMgPSB0aGlzLnN1Y2MuZ2V0KG4pO1xuICAgICAgICBpZiAobmJycyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gbmJycy5rZXlzKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgbmV3IEpTTmV0d29ya1hFcnJvcihcbiAgICAgICAgICAgIHNwcmludGYoJ1RoZSBub2RlIFwiJWpcIiBpcyBub3QgaW4gdGhlIGRpZ3JhcGguJywgbiksXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgcHJlZGVjZXNzb3JzSXRlcihuKSB7XG4gICAgICAgIHZhciBuYnJzID0gdGhpcy5wcmVkLmdldChuKTtcbiAgICAgICAgaWYgKG5icnMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIG5icnMua2V5cygpO1xuICAgICAgICB9XG4gICAgICAgIHRocm93IG5ldyBKU05ldHdvcmtYRXJyb3IoXG4gICAgICAgICAgICBzcHJpbnRmKCdUaGUgbm9kZSBcIiVqXCIgaXMgbm90IGluIHRoZSBkaWdyYXBoLicsIG4pLFxuICAgICAgICApO1xuICAgIH1cblxuICAgIHN1Y2Nlc3NvcnMobikge1xuICAgICAgICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLnN1Y2Nlc3NvcnNJdGVyKG4pKTtcbiAgICB9XG5cbiAgICBwcmVkZWNlc3NvcnMobikge1xuICAgICAgICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLnByZWRlY2Vzc29yc0l0ZXIobikpO1xuICAgIH1cbn1cblxuY2xhc3MgSlNOZXR3b3JrWEV4Y2VwdGlvbiB7XG4gICAgY29uc3RydWN0b3IobWVzc2FnZSkge1xuICAgICAgICB0aGlzLm5hbWUgPSBcIkpTTmV0d29ya1hFeGNlcHRpb25cIjtcbiAgICAgICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbiAgICB9XG59XG5cbmNsYXNzIEpTTmV0d29ya1hBbGdvcml0aG1FcnJvciBleHRlbmRzIEpTTmV0d29ya1hFeGNlcHRpb24ge1xuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2UpIHtcbiAgICAgICAgc3VwZXIobWVzc2FnZSk7XG4gICAgICAgIHRoaXMubmFtZSA9IFwiSlNOZXR3b3JrWEFsZ29yaXRobUVycm9yXCI7XG4gICAgfVxufVxuXG5jbGFzcyBKU05ldHdvcmtYRXJyb3IgZXh0ZW5kcyBKU05ldHdvcmtYRXhjZXB0aW9uIHtcbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlKSB7XG4gICAgICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgICAgICB0aGlzLm5hbWUgPSBcIkpTTmV0d29ya1hFcnJvclwiO1xuICAgIH1cbn1cblxuY2xhc3MgSlNOZXR3b3JrWFVuZmVhc2libGUgZXh0ZW5kcyBKU05ldHdvcmtYQWxnb3JpdGhtRXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2UpIHtcbiAgICAgICAgc3VwZXIobWVzc2FnZSk7XG4gICAgICAgIHRoaXMubmFtZSA9IFwiSlNOZXR3b3JrWFVuZmVhc2libGVcIjtcbiAgICB9XG59XG5cbmNsYXNzIEpTTmV0d29ya1hOb1BhdGggZXh0ZW5kcyBKU05ldHdvcmtYVW5mZWFzaWJsZSB7XG4gICAgY29uc3RydWN0b3IobWVzc2FnZSkge1xuICAgICAgICBzdXBlcihtZXNzYWdlKTtcbiAgICAgICAgdGhpcy5uYW1lID0gXCJKU05ldHdvcmtYTm9QYXRoXCI7XG4gICAgfVxufVxuXG4vLyBmdW5jdGlvbiBmcm9tIExvRGFzaCwgbmVlZGVkIGJ5IGZ1bmN0aW9ucyBmcm9tIEpTTmV0d29ya1hcbmZ1bmN0aW9uIGlzT2JqZWN0TGlrZSh2YWx1ZSkge1xuICAgIHJldHVybiAhIXZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PSBcIm9iamVjdFwiO1xufVxuXG4vLyBmdW5jdGlvbiBmcm9tIExvRGFzaCwgbmVlZGVkIGJ5IGZ1bmN0aW9ucyBmcm9tIEpTTmV0d29ya1hcbmZ1bmN0aW9uIGlzQm9vbGVhbih2YWx1ZSkge1xuICAgIHZhciBib29sVGFnID0gXCJbb2JqZWN0IEJvb2xlYW5dXCI7XG4gICAgcmV0dXJuIChcbiAgICAgICAgdmFsdWUgPT09IHRydWUgfHxcbiAgICAgICAgdmFsdWUgPT09IGZhbHNlIHx8XG4gICAgICAgIChpc09iamVjdExpa2UodmFsdWUpICYmXG4gICAgICAgICAgICBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpID09IGJvb2xUYWcpXG4gICAgKTtcbn1cbiIsIi8qISBIYW1tZXIuSlMgLSB2Mi4wLjggLSAyMDE2LTA0LTIzXG4gKiBodHRwOi8vaGFtbWVyanMuZ2l0aHViLmlvL1xuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNiBKb3JpayBUYW5nZWxkZXI7XG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgKi9cbiFmdW5jdGlvbihhLGIsYyxkKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBlKGEsYixjKXtyZXR1cm4gc2V0VGltZW91dChqKGEsYyksYil9ZnVuY3Rpb24gZihhLGIsYyl7cmV0dXJuIEFycmF5LmlzQXJyYXkoYSk/KGcoYSxjW2JdLGMpLCEwKTohMX1mdW5jdGlvbiBnKGEsYixjKXt2YXIgZTtpZihhKWlmKGEuZm9yRWFjaClhLmZvckVhY2goYixjKTtlbHNlIGlmKGEubGVuZ3RoIT09ZClmb3IoZT0wO2U8YS5sZW5ndGg7KWIuY2FsbChjLGFbZV0sZSxhKSxlKys7ZWxzZSBmb3IoZSBpbiBhKWEuaGFzT3duUHJvcGVydHkoZSkmJmIuY2FsbChjLGFbZV0sZSxhKX1mdW5jdGlvbiBoKGIsYyxkKXt2YXIgZT1cIkRFUFJFQ0FURUQgTUVUSE9EOiBcIitjK1wiXFxuXCIrZCtcIiBBVCBcXG5cIjtyZXR1cm4gZnVuY3Rpb24oKXt2YXIgYz1uZXcgRXJyb3IoXCJnZXQtc3RhY2stdHJhY2VcIiksZD1jJiZjLnN0YWNrP2Muc3RhY2sucmVwbGFjZSgvXlteXFwoXSs/W1xcbiRdL2dtLFwiXCIpLnJlcGxhY2UoL15cXHMrYXRcXHMrL2dtLFwiXCIpLnJlcGxhY2UoL15PYmplY3QuPGFub255bW91cz5cXHMqXFwoL2dtLFwie2Fub255bW91c30oKUBcIik6XCJVbmtub3duIFN0YWNrIFRyYWNlXCIsZj1hLmNvbnNvbGUmJihhLmNvbnNvbGUud2Fybnx8YS5jb25zb2xlLmxvZyk7cmV0dXJuIGYmJmYuY2FsbChhLmNvbnNvbGUsZSxkKSxiLmFwcGx5KHRoaXMsYXJndW1lbnRzKX19ZnVuY3Rpb24gaShhLGIsYyl7dmFyIGQsZT1iLnByb3RvdHlwZTtkPWEucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoZSksZC5jb25zdHJ1Y3Rvcj1hLGQuX3N1cGVyPWUsYyYmbGEoZCxjKX1mdW5jdGlvbiBqKGEsYil7cmV0dXJuIGZ1bmN0aW9uKCl7cmV0dXJuIGEuYXBwbHkoYixhcmd1bWVudHMpfX1mdW5jdGlvbiBrKGEsYil7cmV0dXJuIHR5cGVvZiBhPT1vYT9hLmFwcGx5KGI/YlswXXx8ZDpkLGIpOmF9ZnVuY3Rpb24gbChhLGIpe3JldHVybiBhPT09ZD9iOmF9ZnVuY3Rpb24gbShhLGIsYyl7ZyhxKGIpLGZ1bmN0aW9uKGIpe2EuYWRkRXZlbnRMaXN0ZW5lcihiLGMsITEpfSl9ZnVuY3Rpb24gbihhLGIsYyl7ZyhxKGIpLGZ1bmN0aW9uKGIpe2EucmVtb3ZlRXZlbnRMaXN0ZW5lcihiLGMsITEpfSl9ZnVuY3Rpb24gbyhhLGIpe2Zvcig7YTspe2lmKGE9PWIpcmV0dXJuITA7YT1hLnBhcmVudE5vZGV9cmV0dXJuITF9ZnVuY3Rpb24gcChhLGIpe3JldHVybiBhLmluZGV4T2YoYik+LTF9ZnVuY3Rpb24gcShhKXtyZXR1cm4gYS50cmltKCkuc3BsaXQoL1xccysvZyl9ZnVuY3Rpb24gcihhLGIsYyl7aWYoYS5pbmRleE9mJiYhYylyZXR1cm4gYS5pbmRleE9mKGIpO2Zvcih2YXIgZD0wO2Q8YS5sZW5ndGg7KXtpZihjJiZhW2RdW2NdPT1ifHwhYyYmYVtkXT09PWIpcmV0dXJuIGQ7ZCsrfXJldHVybi0xfWZ1bmN0aW9uIHMoYSl7cmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGEsMCl9ZnVuY3Rpb24gdChhLGIsYyl7Zm9yKHZhciBkPVtdLGU9W10sZj0wO2Y8YS5sZW5ndGg7KXt2YXIgZz1iP2FbZl1bYl06YVtmXTtyKGUsZyk8MCYmZC5wdXNoKGFbZl0pLGVbZl09ZyxmKyt9cmV0dXJuIGMmJihkPWI/ZC5zb3J0KGZ1bmN0aW9uKGEsYyl7cmV0dXJuIGFbYl0+Y1tiXX0pOmQuc29ydCgpKSxkfWZ1bmN0aW9uIHUoYSxiKXtmb3IodmFyIGMsZSxmPWJbMF0udG9VcHBlckNhc2UoKStiLnNsaWNlKDEpLGc9MDtnPG1hLmxlbmd0aDspe2lmKGM9bWFbZ10sZT1jP2MrZjpiLGUgaW4gYSlyZXR1cm4gZTtnKyt9cmV0dXJuIGR9ZnVuY3Rpb24gdigpe3JldHVybiB1YSsrfWZ1bmN0aW9uIHcoYil7dmFyIGM9Yi5vd25lckRvY3VtZW50fHxiO3JldHVybiBjLmRlZmF1bHRWaWV3fHxjLnBhcmVudFdpbmRvd3x8YX1mdW5jdGlvbiB4KGEsYil7dmFyIGM9dGhpczt0aGlzLm1hbmFnZXI9YSx0aGlzLmNhbGxiYWNrPWIsdGhpcy5lbGVtZW50PWEuZWxlbWVudCx0aGlzLnRhcmdldD1hLm9wdGlvbnMuaW5wdXRUYXJnZXQsdGhpcy5kb21IYW5kbGVyPWZ1bmN0aW9uKGIpe2soYS5vcHRpb25zLmVuYWJsZSxbYV0pJiZjLmhhbmRsZXIoYil9LHRoaXMuaW5pdCgpfWZ1bmN0aW9uIHkoYSl7dmFyIGIsYz1hLm9wdGlvbnMuaW5wdXRDbGFzcztyZXR1cm4gbmV3KGI9Yz9jOnhhP006eWE/UDp3YT9SOkwpKGEseil9ZnVuY3Rpb24geihhLGIsYyl7dmFyIGQ9Yy5wb2ludGVycy5sZW5ndGgsZT1jLmNoYW5nZWRQb2ludGVycy5sZW5ndGgsZj1iJkVhJiZkLWU9PT0wLGc9YiYoR2F8SGEpJiZkLWU9PT0wO2MuaXNGaXJzdD0hIWYsYy5pc0ZpbmFsPSEhZyxmJiYoYS5zZXNzaW9uPXt9KSxjLmV2ZW50VHlwZT1iLEEoYSxjKSxhLmVtaXQoXCJoYW1tZXIuaW5wdXRcIixjKSxhLnJlY29nbml6ZShjKSxhLnNlc3Npb24ucHJldklucHV0PWN9ZnVuY3Rpb24gQShhLGIpe3ZhciBjPWEuc2Vzc2lvbixkPWIucG9pbnRlcnMsZT1kLmxlbmd0aDtjLmZpcnN0SW5wdXR8fChjLmZpcnN0SW5wdXQ9RChiKSksZT4xJiYhYy5maXJzdE11bHRpcGxlP2MuZmlyc3RNdWx0aXBsZT1EKGIpOjE9PT1lJiYoYy5maXJzdE11bHRpcGxlPSExKTt2YXIgZj1jLmZpcnN0SW5wdXQsZz1jLmZpcnN0TXVsdGlwbGUsaD1nP2cuY2VudGVyOmYuY2VudGVyLGk9Yi5jZW50ZXI9RShkKTtiLnRpbWVTdGFtcD1yYSgpLGIuZGVsdGFUaW1lPWIudGltZVN0YW1wLWYudGltZVN0YW1wLGIuYW5nbGU9SShoLGkpLGIuZGlzdGFuY2U9SChoLGkpLEIoYyxiKSxiLm9mZnNldERpcmVjdGlvbj1HKGIuZGVsdGFYLGIuZGVsdGFZKTt2YXIgaj1GKGIuZGVsdGFUaW1lLGIuZGVsdGFYLGIuZGVsdGFZKTtiLm92ZXJhbGxWZWxvY2l0eVg9ai54LGIub3ZlcmFsbFZlbG9jaXR5WT1qLnksYi5vdmVyYWxsVmVsb2NpdHk9cWEoai54KT5xYShqLnkpP2oueDpqLnksYi5zY2FsZT1nP0soZy5wb2ludGVycyxkKToxLGIucm90YXRpb249Zz9KKGcucG9pbnRlcnMsZCk6MCxiLm1heFBvaW50ZXJzPWMucHJldklucHV0P2IucG9pbnRlcnMubGVuZ3RoPmMucHJldklucHV0Lm1heFBvaW50ZXJzP2IucG9pbnRlcnMubGVuZ3RoOmMucHJldklucHV0Lm1heFBvaW50ZXJzOmIucG9pbnRlcnMubGVuZ3RoLEMoYyxiKTt2YXIgaz1hLmVsZW1lbnQ7byhiLnNyY0V2ZW50LnRhcmdldCxrKSYmKGs9Yi5zcmNFdmVudC50YXJnZXQpLGIudGFyZ2V0PWt9ZnVuY3Rpb24gQihhLGIpe3ZhciBjPWIuY2VudGVyLGQ9YS5vZmZzZXREZWx0YXx8e30sZT1hLnByZXZEZWx0YXx8e30sZj1hLnByZXZJbnB1dHx8e307Yi5ldmVudFR5cGUhPT1FYSYmZi5ldmVudFR5cGUhPT1HYXx8KGU9YS5wcmV2RGVsdGE9e3g6Zi5kZWx0YVh8fDAseTpmLmRlbHRhWXx8MH0sZD1hLm9mZnNldERlbHRhPXt4OmMueCx5OmMueX0pLGIuZGVsdGFYPWUueCsoYy54LWQueCksYi5kZWx0YVk9ZS55KyhjLnktZC55KX1mdW5jdGlvbiBDKGEsYil7dmFyIGMsZSxmLGcsaD1hLmxhc3RJbnRlcnZhbHx8YixpPWIudGltZVN0YW1wLWgudGltZVN0YW1wO2lmKGIuZXZlbnRUeXBlIT1IYSYmKGk+RGF8fGgudmVsb2NpdHk9PT1kKSl7dmFyIGo9Yi5kZWx0YVgtaC5kZWx0YVgsaz1iLmRlbHRhWS1oLmRlbHRhWSxsPUYoaSxqLGspO2U9bC54LGY9bC55LGM9cWEobC54KT5xYShsLnkpP2wueDpsLnksZz1HKGosayksYS5sYXN0SW50ZXJ2YWw9Yn1lbHNlIGM9aC52ZWxvY2l0eSxlPWgudmVsb2NpdHlYLGY9aC52ZWxvY2l0eVksZz1oLmRpcmVjdGlvbjtiLnZlbG9jaXR5PWMsYi52ZWxvY2l0eVg9ZSxiLnZlbG9jaXR5WT1mLGIuZGlyZWN0aW9uPWd9ZnVuY3Rpb24gRChhKXtmb3IodmFyIGI9W10sYz0wO2M8YS5wb2ludGVycy5sZW5ndGg7KWJbY109e2NsaWVudFg6cGEoYS5wb2ludGVyc1tjXS5jbGllbnRYKSxjbGllbnRZOnBhKGEucG9pbnRlcnNbY10uY2xpZW50WSl9LGMrKztyZXR1cm57dGltZVN0YW1wOnJhKCkscG9pbnRlcnM6YixjZW50ZXI6RShiKSxkZWx0YVg6YS5kZWx0YVgsZGVsdGFZOmEuZGVsdGFZfX1mdW5jdGlvbiBFKGEpe3ZhciBiPWEubGVuZ3RoO2lmKDE9PT1iKXJldHVybnt4OnBhKGFbMF0uY2xpZW50WCkseTpwYShhWzBdLmNsaWVudFkpfTtmb3IodmFyIGM9MCxkPTAsZT0wO2I+ZTspYys9YVtlXS5jbGllbnRYLGQrPWFbZV0uY2xpZW50WSxlKys7cmV0dXJue3g6cGEoYy9iKSx5OnBhKGQvYil9fWZ1bmN0aW9uIEYoYSxiLGMpe3JldHVybnt4OmIvYXx8MCx5OmMvYXx8MH19ZnVuY3Rpb24gRyhhLGIpe3JldHVybiBhPT09Yj9JYTpxYShhKT49cWEoYik/MD5hP0phOkthOjA+Yj9MYTpNYX1mdW5jdGlvbiBIKGEsYixjKXtjfHwoYz1RYSk7dmFyIGQ9YltjWzBdXS1hW2NbMF1dLGU9YltjWzFdXS1hW2NbMV1dO3JldHVybiBNYXRoLnNxcnQoZCpkK2UqZSl9ZnVuY3Rpb24gSShhLGIsYyl7Y3x8KGM9UWEpO3ZhciBkPWJbY1swXV0tYVtjWzBdXSxlPWJbY1sxXV0tYVtjWzFdXTtyZXR1cm4gMTgwKk1hdGguYXRhbjIoZSxkKS9NYXRoLlBJfWZ1bmN0aW9uIEooYSxiKXtyZXR1cm4gSShiWzFdLGJbMF0sUmEpK0koYVsxXSxhWzBdLFJhKX1mdW5jdGlvbiBLKGEsYil7cmV0dXJuIEgoYlswXSxiWzFdLFJhKS9IKGFbMF0sYVsxXSxSYSl9ZnVuY3Rpb24gTCgpe3RoaXMuZXZFbD1UYSx0aGlzLmV2V2luPVVhLHRoaXMucHJlc3NlZD0hMSx4LmFwcGx5KHRoaXMsYXJndW1lbnRzKX1mdW5jdGlvbiBNKCl7dGhpcy5ldkVsPVhhLHRoaXMuZXZXaW49WWEseC5hcHBseSh0aGlzLGFyZ3VtZW50cyksdGhpcy5zdG9yZT10aGlzLm1hbmFnZXIuc2Vzc2lvbi5wb2ludGVyRXZlbnRzPVtdfWZ1bmN0aW9uIE4oKXt0aGlzLmV2VGFyZ2V0PSRhLHRoaXMuZXZXaW49X2EsdGhpcy5zdGFydGVkPSExLHguYXBwbHkodGhpcyxhcmd1bWVudHMpfWZ1bmN0aW9uIE8oYSxiKXt2YXIgYz1zKGEudG91Y2hlcyksZD1zKGEuY2hhbmdlZFRvdWNoZXMpO3JldHVybiBiJihHYXxIYSkmJihjPXQoYy5jb25jYXQoZCksXCJpZGVudGlmaWVyXCIsITApKSxbYyxkXX1mdW5jdGlvbiBQKCl7dGhpcy5ldlRhcmdldD1iYix0aGlzLnRhcmdldElkcz17fSx4LmFwcGx5KHRoaXMsYXJndW1lbnRzKX1mdW5jdGlvbiBRKGEsYil7dmFyIGM9cyhhLnRvdWNoZXMpLGQ9dGhpcy50YXJnZXRJZHM7aWYoYiYoRWF8RmEpJiYxPT09Yy5sZW5ndGgpcmV0dXJuIGRbY1swXS5pZGVudGlmaWVyXT0hMCxbYyxjXTt2YXIgZSxmLGc9cyhhLmNoYW5nZWRUb3VjaGVzKSxoPVtdLGk9dGhpcy50YXJnZXQ7aWYoZj1jLmZpbHRlcihmdW5jdGlvbihhKXtyZXR1cm4gbyhhLnRhcmdldCxpKX0pLGI9PT1FYSlmb3IoZT0wO2U8Zi5sZW5ndGg7KWRbZltlXS5pZGVudGlmaWVyXT0hMCxlKys7Zm9yKGU9MDtlPGcubGVuZ3RoOylkW2dbZV0uaWRlbnRpZmllcl0mJmgucHVzaChnW2VdKSxiJihHYXxIYSkmJmRlbGV0ZSBkW2dbZV0uaWRlbnRpZmllcl0sZSsrO3JldHVybiBoLmxlbmd0aD9bdChmLmNvbmNhdChoKSxcImlkZW50aWZpZXJcIiwhMCksaF06dm9pZCAwfWZ1bmN0aW9uIFIoKXt4LmFwcGx5KHRoaXMsYXJndW1lbnRzKTt2YXIgYT1qKHRoaXMuaGFuZGxlcix0aGlzKTt0aGlzLnRvdWNoPW5ldyBQKHRoaXMubWFuYWdlcixhKSx0aGlzLm1vdXNlPW5ldyBMKHRoaXMubWFuYWdlcixhKSx0aGlzLnByaW1hcnlUb3VjaD1udWxsLHRoaXMubGFzdFRvdWNoZXM9W119ZnVuY3Rpb24gUyhhLGIpe2EmRWE/KHRoaXMucHJpbWFyeVRvdWNoPWIuY2hhbmdlZFBvaW50ZXJzWzBdLmlkZW50aWZpZXIsVC5jYWxsKHRoaXMsYikpOmEmKEdhfEhhKSYmVC5jYWxsKHRoaXMsYil9ZnVuY3Rpb24gVChhKXt2YXIgYj1hLmNoYW5nZWRQb2ludGVyc1swXTtpZihiLmlkZW50aWZpZXI9PT10aGlzLnByaW1hcnlUb3VjaCl7dmFyIGM9e3g6Yi5jbGllbnRYLHk6Yi5jbGllbnRZfTt0aGlzLmxhc3RUb3VjaGVzLnB1c2goYyk7dmFyIGQ9dGhpcy5sYXN0VG91Y2hlcyxlPWZ1bmN0aW9uKCl7dmFyIGE9ZC5pbmRleE9mKGMpO2E+LTEmJmQuc3BsaWNlKGEsMSl9O3NldFRpbWVvdXQoZSxjYil9fWZ1bmN0aW9uIFUoYSl7Zm9yKHZhciBiPWEuc3JjRXZlbnQuY2xpZW50WCxjPWEuc3JjRXZlbnQuY2xpZW50WSxkPTA7ZDx0aGlzLmxhc3RUb3VjaGVzLmxlbmd0aDtkKyspe3ZhciBlPXRoaXMubGFzdFRvdWNoZXNbZF0sZj1NYXRoLmFicyhiLWUueCksZz1NYXRoLmFicyhjLWUueSk7aWYoZGI+PWYmJmRiPj1nKXJldHVybiEwfXJldHVybiExfWZ1bmN0aW9uIFYoYSxiKXt0aGlzLm1hbmFnZXI9YSx0aGlzLnNldChiKX1mdW5jdGlvbiBXKGEpe2lmKHAoYSxqYikpcmV0dXJuIGpiO3ZhciBiPXAoYSxrYiksYz1wKGEsbGIpO3JldHVybiBiJiZjP2piOmJ8fGM/Yj9rYjpsYjpwKGEsaWIpP2liOmhifWZ1bmN0aW9uIFgoKXtpZighZmIpcmV0dXJuITE7dmFyIGI9e30sYz1hLkNTUyYmYS5DU1Muc3VwcG9ydHM7cmV0dXJuW1wiYXV0b1wiLFwibWFuaXB1bGF0aW9uXCIsXCJwYW4teVwiLFwicGFuLXhcIixcInBhbi14IHBhbi15XCIsXCJub25lXCJdLmZvckVhY2goZnVuY3Rpb24oZCl7YltkXT1jP2EuQ1NTLnN1cHBvcnRzKFwidG91Y2gtYWN0aW9uXCIsZCk6ITB9KSxifWZ1bmN0aW9uIFkoYSl7dGhpcy5vcHRpb25zPWxhKHt9LHRoaXMuZGVmYXVsdHMsYXx8e30pLHRoaXMuaWQ9digpLHRoaXMubWFuYWdlcj1udWxsLHRoaXMub3B0aW9ucy5lbmFibGU9bCh0aGlzLm9wdGlvbnMuZW5hYmxlLCEwKSx0aGlzLnN0YXRlPW5iLHRoaXMuc2ltdWx0YW5lb3VzPXt9LHRoaXMucmVxdWlyZUZhaWw9W119ZnVuY3Rpb24gWihhKXtyZXR1cm4gYSZzYj9cImNhbmNlbFwiOmEmcWI/XCJlbmRcIjphJnBiP1wibW92ZVwiOmEmb2I/XCJzdGFydFwiOlwiXCJ9ZnVuY3Rpb24gJChhKXtyZXR1cm4gYT09TWE/XCJkb3duXCI6YT09TGE/XCJ1cFwiOmE9PUphP1wibGVmdFwiOmE9PUthP1wicmlnaHRcIjpcIlwifWZ1bmN0aW9uIF8oYSxiKXt2YXIgYz1iLm1hbmFnZXI7cmV0dXJuIGM/Yy5nZXQoYSk6YX1mdW5jdGlvbiBhYSgpe1kuYXBwbHkodGhpcyxhcmd1bWVudHMpfWZ1bmN0aW9uIGJhKCl7YWEuYXBwbHkodGhpcyxhcmd1bWVudHMpLHRoaXMucFg9bnVsbCx0aGlzLnBZPW51bGx9ZnVuY3Rpb24gY2EoKXthYS5hcHBseSh0aGlzLGFyZ3VtZW50cyl9ZnVuY3Rpb24gZGEoKXtZLmFwcGx5KHRoaXMsYXJndW1lbnRzKSx0aGlzLl90aW1lcj1udWxsLHRoaXMuX2lucHV0PW51bGx9ZnVuY3Rpb24gZWEoKXthYS5hcHBseSh0aGlzLGFyZ3VtZW50cyl9ZnVuY3Rpb24gZmEoKXthYS5hcHBseSh0aGlzLGFyZ3VtZW50cyl9ZnVuY3Rpb24gZ2EoKXtZLmFwcGx5KHRoaXMsYXJndW1lbnRzKSx0aGlzLnBUaW1lPSExLHRoaXMucENlbnRlcj0hMSx0aGlzLl90aW1lcj1udWxsLHRoaXMuX2lucHV0PW51bGwsdGhpcy5jb3VudD0wfWZ1bmN0aW9uIGhhKGEsYil7cmV0dXJuIGI9Ynx8e30sYi5yZWNvZ25pemVycz1sKGIucmVjb2duaXplcnMsaGEuZGVmYXVsdHMucHJlc2V0KSxuZXcgaWEoYSxiKX1mdW5jdGlvbiBpYShhLGIpe3RoaXMub3B0aW9ucz1sYSh7fSxoYS5kZWZhdWx0cyxifHx7fSksdGhpcy5vcHRpb25zLmlucHV0VGFyZ2V0PXRoaXMub3B0aW9ucy5pbnB1dFRhcmdldHx8YSx0aGlzLmhhbmRsZXJzPXt9LHRoaXMuc2Vzc2lvbj17fSx0aGlzLnJlY29nbml6ZXJzPVtdLHRoaXMub2xkQ3NzUHJvcHM9e30sdGhpcy5lbGVtZW50PWEsdGhpcy5pbnB1dD15KHRoaXMpLHRoaXMudG91Y2hBY3Rpb249bmV3IFYodGhpcyx0aGlzLm9wdGlvbnMudG91Y2hBY3Rpb24pLGphKHRoaXMsITApLGcodGhpcy5vcHRpb25zLnJlY29nbml6ZXJzLGZ1bmN0aW9uKGEpe3ZhciBiPXRoaXMuYWRkKG5ldyBhWzBdKGFbMV0pKTthWzJdJiZiLnJlY29nbml6ZVdpdGgoYVsyXSksYVszXSYmYi5yZXF1aXJlRmFpbHVyZShhWzNdKX0sdGhpcyl9ZnVuY3Rpb24gamEoYSxiKXt2YXIgYz1hLmVsZW1lbnQ7aWYoYy5zdHlsZSl7dmFyIGQ7ZyhhLm9wdGlvbnMuY3NzUHJvcHMsZnVuY3Rpb24oZSxmKXtkPXUoYy5zdHlsZSxmKSxiPyhhLm9sZENzc1Byb3BzW2RdPWMuc3R5bGVbZF0sYy5zdHlsZVtkXT1lKTpjLnN0eWxlW2RdPWEub2xkQ3NzUHJvcHNbZF18fFwiXCJ9KSxifHwoYS5vbGRDc3NQcm9wcz17fSl9fWZ1bmN0aW9uIGthKGEsYyl7dmFyIGQ9Yi5jcmVhdGVFdmVudChcIkV2ZW50XCIpO2QuaW5pdEV2ZW50KGEsITAsITApLGQuZ2VzdHVyZT1jLGMudGFyZ2V0LmRpc3BhdGNoRXZlbnQoZCl9dmFyIGxhLG1hPVtcIlwiLFwid2Via2l0XCIsXCJNb3pcIixcIk1TXCIsXCJtc1wiLFwib1wiXSxuYT1iLmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiksb2E9XCJmdW5jdGlvblwiLHBhPU1hdGgucm91bmQscWE9TWF0aC5hYnMscmE9RGF0ZS5ub3c7bGE9XCJmdW5jdGlvblwiIT10eXBlb2YgT2JqZWN0LmFzc2lnbj9mdW5jdGlvbihhKXtpZihhPT09ZHx8bnVsbD09PWEpdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjb252ZXJ0IHVuZGVmaW5lZCBvciBudWxsIHRvIG9iamVjdFwiKTtmb3IodmFyIGI9T2JqZWN0KGEpLGM9MTtjPGFyZ3VtZW50cy5sZW5ndGg7YysrKXt2YXIgZT1hcmd1bWVudHNbY107aWYoZSE9PWQmJm51bGwhPT1lKWZvcih2YXIgZiBpbiBlKWUuaGFzT3duUHJvcGVydHkoZikmJihiW2ZdPWVbZl0pfXJldHVybiBifTpPYmplY3QuYXNzaWduO3ZhciBzYT1oKGZ1bmN0aW9uKGEsYixjKXtmb3IodmFyIGU9T2JqZWN0LmtleXMoYiksZj0wO2Y8ZS5sZW5ndGg7KSghY3x8YyYmYVtlW2ZdXT09PWQpJiYoYVtlW2ZdXT1iW2VbZl1dKSxmKys7cmV0dXJuIGF9LFwiZXh0ZW5kXCIsXCJVc2UgYGFzc2lnbmAuXCIpLHRhPWgoZnVuY3Rpb24oYSxiKXtyZXR1cm4gc2EoYSxiLCEwKX0sXCJtZXJnZVwiLFwiVXNlIGBhc3NpZ25gLlwiKSx1YT0xLHZhPS9tb2JpbGV8dGFibGV0fGlwKGFkfGhvbmV8b2QpfGFuZHJvaWQvaSx3YT1cIm9udG91Y2hzdGFydFwiaW4gYSx4YT11KGEsXCJQb2ludGVyRXZlbnRcIikhPT1kLHlhPXdhJiZ2YS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpLHphPVwidG91Y2hcIixBYT1cInBlblwiLEJhPVwibW91c2VcIixDYT1cImtpbmVjdFwiLERhPTI1LEVhPTEsRmE9MixHYT00LEhhPTgsSWE9MSxKYT0yLEthPTQsTGE9OCxNYT0xNixOYT1KYXxLYSxPYT1MYXxNYSxQYT1OYXxPYSxRYT1bXCJ4XCIsXCJ5XCJdLFJhPVtcImNsaWVudFhcIixcImNsaWVudFlcIl07eC5wcm90b3R5cGU9e2hhbmRsZXI6ZnVuY3Rpb24oKXt9LGluaXQ6ZnVuY3Rpb24oKXt0aGlzLmV2RWwmJm0odGhpcy5lbGVtZW50LHRoaXMuZXZFbCx0aGlzLmRvbUhhbmRsZXIpLHRoaXMuZXZUYXJnZXQmJm0odGhpcy50YXJnZXQsdGhpcy5ldlRhcmdldCx0aGlzLmRvbUhhbmRsZXIpLHRoaXMuZXZXaW4mJm0odyh0aGlzLmVsZW1lbnQpLHRoaXMuZXZXaW4sdGhpcy5kb21IYW5kbGVyKX0sZGVzdHJveTpmdW5jdGlvbigpe3RoaXMuZXZFbCYmbih0aGlzLmVsZW1lbnQsdGhpcy5ldkVsLHRoaXMuZG9tSGFuZGxlciksdGhpcy5ldlRhcmdldCYmbih0aGlzLnRhcmdldCx0aGlzLmV2VGFyZ2V0LHRoaXMuZG9tSGFuZGxlciksdGhpcy5ldldpbiYmbih3KHRoaXMuZWxlbWVudCksdGhpcy5ldldpbix0aGlzLmRvbUhhbmRsZXIpfX07dmFyIFNhPXttb3VzZWRvd246RWEsbW91c2Vtb3ZlOkZhLG1vdXNldXA6R2F9LFRhPVwibW91c2Vkb3duXCIsVWE9XCJtb3VzZW1vdmUgbW91c2V1cFwiO2koTCx4LHtoYW5kbGVyOmZ1bmN0aW9uKGEpe3ZhciBiPVNhW2EudHlwZV07YiZFYSYmMD09PWEuYnV0dG9uJiYodGhpcy5wcmVzc2VkPSEwKSxiJkZhJiYxIT09YS53aGljaCYmKGI9R2EpLHRoaXMucHJlc3NlZCYmKGImR2EmJih0aGlzLnByZXNzZWQ9ITEpLHRoaXMuY2FsbGJhY2sodGhpcy5tYW5hZ2VyLGIse3BvaW50ZXJzOlthXSxjaGFuZ2VkUG9pbnRlcnM6W2FdLHBvaW50ZXJUeXBlOkJhLHNyY0V2ZW50OmF9KSl9fSk7dmFyIFZhPXtwb2ludGVyZG93bjpFYSxwb2ludGVybW92ZTpGYSxwb2ludGVydXA6R2EscG9pbnRlcmNhbmNlbDpIYSxwb2ludGVyb3V0OkhhfSxXYT17Mjp6YSwzOkFhLDQ6QmEsNTpDYX0sWGE9XCJwb2ludGVyZG93blwiLFlhPVwicG9pbnRlcm1vdmUgcG9pbnRlcnVwIHBvaW50ZXJjYW5jZWxcIjthLk1TUG9pbnRlckV2ZW50JiYhYS5Qb2ludGVyRXZlbnQmJihYYT1cIk1TUG9pbnRlckRvd25cIixZYT1cIk1TUG9pbnRlck1vdmUgTVNQb2ludGVyVXAgTVNQb2ludGVyQ2FuY2VsXCIpLGkoTSx4LHtoYW5kbGVyOmZ1bmN0aW9uKGEpe3ZhciBiPXRoaXMuc3RvcmUsYz0hMSxkPWEudHlwZS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoXCJtc1wiLFwiXCIpLGU9VmFbZF0sZj1XYVthLnBvaW50ZXJUeXBlXXx8YS5wb2ludGVyVHlwZSxnPWY9PXphLGg9cihiLGEucG9pbnRlcklkLFwicG9pbnRlcklkXCIpO2UmRWEmJigwPT09YS5idXR0b258fGcpPzA+aCYmKGIucHVzaChhKSxoPWIubGVuZ3RoLTEpOmUmKEdhfEhhKSYmKGM9ITApLDA+aHx8KGJbaF09YSx0aGlzLmNhbGxiYWNrKHRoaXMubWFuYWdlcixlLHtwb2ludGVyczpiLGNoYW5nZWRQb2ludGVyczpbYV0scG9pbnRlclR5cGU6ZixzcmNFdmVudDphfSksYyYmYi5zcGxpY2UoaCwxKSl9fSk7dmFyIFphPXt0b3VjaHN0YXJ0OkVhLHRvdWNobW92ZTpGYSx0b3VjaGVuZDpHYSx0b3VjaGNhbmNlbDpIYX0sJGE9XCJ0b3VjaHN0YXJ0XCIsX2E9XCJ0b3VjaHN0YXJ0IHRvdWNobW92ZSB0b3VjaGVuZCB0b3VjaGNhbmNlbFwiO2koTix4LHtoYW5kbGVyOmZ1bmN0aW9uKGEpe3ZhciBiPVphW2EudHlwZV07aWYoYj09PUVhJiYodGhpcy5zdGFydGVkPSEwKSx0aGlzLnN0YXJ0ZWQpe3ZhciBjPU8uY2FsbCh0aGlzLGEsYik7YiYoR2F8SGEpJiZjWzBdLmxlbmd0aC1jWzFdLmxlbmd0aD09PTAmJih0aGlzLnN0YXJ0ZWQ9ITEpLHRoaXMuY2FsbGJhY2sodGhpcy5tYW5hZ2VyLGIse3BvaW50ZXJzOmNbMF0sY2hhbmdlZFBvaW50ZXJzOmNbMV0scG9pbnRlclR5cGU6emEsc3JjRXZlbnQ6YX0pfX19KTt2YXIgYWI9e3RvdWNoc3RhcnQ6RWEsdG91Y2htb3ZlOkZhLHRvdWNoZW5kOkdhLHRvdWNoY2FuY2VsOkhhfSxiYj1cInRvdWNoc3RhcnQgdG91Y2htb3ZlIHRvdWNoZW5kIHRvdWNoY2FuY2VsXCI7aShQLHgse2hhbmRsZXI6ZnVuY3Rpb24oYSl7dmFyIGI9YWJbYS50eXBlXSxjPVEuY2FsbCh0aGlzLGEsYik7YyYmdGhpcy5jYWxsYmFjayh0aGlzLm1hbmFnZXIsYix7cG9pbnRlcnM6Y1swXSxjaGFuZ2VkUG9pbnRlcnM6Y1sxXSxwb2ludGVyVHlwZTp6YSxzcmNFdmVudDphfSl9fSk7dmFyIGNiPTI1MDAsZGI9MjU7aShSLHgse2hhbmRsZXI6ZnVuY3Rpb24oYSxiLGMpe3ZhciBkPWMucG9pbnRlclR5cGU9PXphLGU9Yy5wb2ludGVyVHlwZT09QmE7aWYoIShlJiZjLnNvdXJjZUNhcGFiaWxpdGllcyYmYy5zb3VyY2VDYXBhYmlsaXRpZXMuZmlyZXNUb3VjaEV2ZW50cykpe2lmKGQpUy5jYWxsKHRoaXMsYixjKTtlbHNlIGlmKGUmJlUuY2FsbCh0aGlzLGMpKXJldHVybjt0aGlzLmNhbGxiYWNrKGEsYixjKX19LGRlc3Ryb3k6ZnVuY3Rpb24oKXt0aGlzLnRvdWNoLmRlc3Ryb3koKSx0aGlzLm1vdXNlLmRlc3Ryb3koKX19KTt2YXIgZWI9dShuYS5zdHlsZSxcInRvdWNoQWN0aW9uXCIpLGZiPWViIT09ZCxnYj1cImNvbXB1dGVcIixoYj1cImF1dG9cIixpYj1cIm1hbmlwdWxhdGlvblwiLGpiPVwibm9uZVwiLGtiPVwicGFuLXhcIixsYj1cInBhbi15XCIsbWI9WCgpO1YucHJvdG90eXBlPXtzZXQ6ZnVuY3Rpb24oYSl7YT09Z2ImJihhPXRoaXMuY29tcHV0ZSgpKSxmYiYmdGhpcy5tYW5hZ2VyLmVsZW1lbnQuc3R5bGUmJm1iW2FdJiYodGhpcy5tYW5hZ2VyLmVsZW1lbnQuc3R5bGVbZWJdPWEpLHRoaXMuYWN0aW9ucz1hLnRvTG93ZXJDYXNlKCkudHJpbSgpfSx1cGRhdGU6ZnVuY3Rpb24oKXt0aGlzLnNldCh0aGlzLm1hbmFnZXIub3B0aW9ucy50b3VjaEFjdGlvbil9LGNvbXB1dGU6ZnVuY3Rpb24oKXt2YXIgYT1bXTtyZXR1cm4gZyh0aGlzLm1hbmFnZXIucmVjb2duaXplcnMsZnVuY3Rpb24oYil7ayhiLm9wdGlvbnMuZW5hYmxlLFtiXSkmJihhPWEuY29uY2F0KGIuZ2V0VG91Y2hBY3Rpb24oKSkpfSksVyhhLmpvaW4oXCIgXCIpKX0scHJldmVudERlZmF1bHRzOmZ1bmN0aW9uKGEpe3ZhciBiPWEuc3JjRXZlbnQsYz1hLm9mZnNldERpcmVjdGlvbjtpZih0aGlzLm1hbmFnZXIuc2Vzc2lvbi5wcmV2ZW50ZWQpcmV0dXJuIHZvaWQgYi5wcmV2ZW50RGVmYXVsdCgpO3ZhciBkPXRoaXMuYWN0aW9ucyxlPXAoZCxqYikmJiFtYltqYl0sZj1wKGQsbGIpJiYhbWJbbGJdLGc9cChkLGtiKSYmIW1iW2tiXTtpZihlKXt2YXIgaD0xPT09YS5wb2ludGVycy5sZW5ndGgsaT1hLmRpc3RhbmNlPDIsaj1hLmRlbHRhVGltZTwyNTA7aWYoaCYmaSYmailyZXR1cm59cmV0dXJuIGcmJmY/dm9pZCAwOmV8fGYmJmMmTmF8fGcmJmMmT2E/dGhpcy5wcmV2ZW50U3JjKGIpOnZvaWQgMH0scHJldmVudFNyYzpmdW5jdGlvbihhKXt0aGlzLm1hbmFnZXIuc2Vzc2lvbi5wcmV2ZW50ZWQ9ITAsYS5wcmV2ZW50RGVmYXVsdCgpfX07dmFyIG5iPTEsb2I9MixwYj00LHFiPTgscmI9cWIsc2I9MTYsdGI9MzI7WS5wcm90b3R5cGU9e2RlZmF1bHRzOnt9LHNldDpmdW5jdGlvbihhKXtyZXR1cm4gbGEodGhpcy5vcHRpb25zLGEpLHRoaXMubWFuYWdlciYmdGhpcy5tYW5hZ2VyLnRvdWNoQWN0aW9uLnVwZGF0ZSgpLHRoaXN9LHJlY29nbml6ZVdpdGg6ZnVuY3Rpb24oYSl7aWYoZihhLFwicmVjb2duaXplV2l0aFwiLHRoaXMpKXJldHVybiB0aGlzO3ZhciBiPXRoaXMuc2ltdWx0YW5lb3VzO3JldHVybiBhPV8oYSx0aGlzKSxiW2EuaWRdfHwoYlthLmlkXT1hLGEucmVjb2duaXplV2l0aCh0aGlzKSksdGhpc30sZHJvcFJlY29nbml6ZVdpdGg6ZnVuY3Rpb24oYSl7cmV0dXJuIGYoYSxcImRyb3BSZWNvZ25pemVXaXRoXCIsdGhpcyk/dGhpczooYT1fKGEsdGhpcyksZGVsZXRlIHRoaXMuc2ltdWx0YW5lb3VzW2EuaWRdLHRoaXMpfSxyZXF1aXJlRmFpbHVyZTpmdW5jdGlvbihhKXtpZihmKGEsXCJyZXF1aXJlRmFpbHVyZVwiLHRoaXMpKXJldHVybiB0aGlzO3ZhciBiPXRoaXMucmVxdWlyZUZhaWw7cmV0dXJuIGE9XyhhLHRoaXMpLC0xPT09cihiLGEpJiYoYi5wdXNoKGEpLGEucmVxdWlyZUZhaWx1cmUodGhpcykpLHRoaXN9LGRyb3BSZXF1aXJlRmFpbHVyZTpmdW5jdGlvbihhKXtpZihmKGEsXCJkcm9wUmVxdWlyZUZhaWx1cmVcIix0aGlzKSlyZXR1cm4gdGhpczthPV8oYSx0aGlzKTt2YXIgYj1yKHRoaXMucmVxdWlyZUZhaWwsYSk7cmV0dXJuIGI+LTEmJnRoaXMucmVxdWlyZUZhaWwuc3BsaWNlKGIsMSksdGhpc30saGFzUmVxdWlyZUZhaWx1cmVzOmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMucmVxdWlyZUZhaWwubGVuZ3RoPjB9LGNhblJlY29nbml6ZVdpdGg6ZnVuY3Rpb24oYSl7cmV0dXJuISF0aGlzLnNpbXVsdGFuZW91c1thLmlkXX0sZW1pdDpmdW5jdGlvbihhKXtmdW5jdGlvbiBiKGIpe2MubWFuYWdlci5lbWl0KGIsYSl9dmFyIGM9dGhpcyxkPXRoaXMuc3RhdGU7cWI+ZCYmYihjLm9wdGlvbnMuZXZlbnQrWihkKSksYihjLm9wdGlvbnMuZXZlbnQpLGEuYWRkaXRpb25hbEV2ZW50JiZiKGEuYWRkaXRpb25hbEV2ZW50KSxkPj1xYiYmYihjLm9wdGlvbnMuZXZlbnQrWihkKSl9LHRyeUVtaXQ6ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMuY2FuRW1pdCgpP3RoaXMuZW1pdChhKTp2b2lkKHRoaXMuc3RhdGU9dGIpfSxjYW5FbWl0OmZ1bmN0aW9uKCl7Zm9yKHZhciBhPTA7YTx0aGlzLnJlcXVpcmVGYWlsLmxlbmd0aDspe2lmKCEodGhpcy5yZXF1aXJlRmFpbFthXS5zdGF0ZSYodGJ8bmIpKSlyZXR1cm4hMTthKyt9cmV0dXJuITB9LHJlY29nbml6ZTpmdW5jdGlvbihhKXt2YXIgYj1sYSh7fSxhKTtyZXR1cm4gayh0aGlzLm9wdGlvbnMuZW5hYmxlLFt0aGlzLGJdKT8odGhpcy5zdGF0ZSYocmJ8c2J8dGIpJiYodGhpcy5zdGF0ZT1uYiksdGhpcy5zdGF0ZT10aGlzLnByb2Nlc3MoYiksdm9pZCh0aGlzLnN0YXRlJihvYnxwYnxxYnxzYikmJnRoaXMudHJ5RW1pdChiKSkpOih0aGlzLnJlc2V0KCksdm9pZCh0aGlzLnN0YXRlPXRiKSl9LHByb2Nlc3M6ZnVuY3Rpb24oYSl7fSxnZXRUb3VjaEFjdGlvbjpmdW5jdGlvbigpe30scmVzZXQ6ZnVuY3Rpb24oKXt9fSxpKGFhLFkse2RlZmF1bHRzOntwb2ludGVyczoxfSxhdHRyVGVzdDpmdW5jdGlvbihhKXt2YXIgYj10aGlzLm9wdGlvbnMucG9pbnRlcnM7cmV0dXJuIDA9PT1ifHxhLnBvaW50ZXJzLmxlbmd0aD09PWJ9LHByb2Nlc3M6ZnVuY3Rpb24oYSl7dmFyIGI9dGhpcy5zdGF0ZSxjPWEuZXZlbnRUeXBlLGQ9YiYob2J8cGIpLGU9dGhpcy5hdHRyVGVzdChhKTtyZXR1cm4gZCYmKGMmSGF8fCFlKT9ifHNiOmR8fGU/YyZHYT9ifHFiOmImb2I/YnxwYjpvYjp0Yn19KSxpKGJhLGFhLHtkZWZhdWx0czp7ZXZlbnQ6XCJwYW5cIix0aHJlc2hvbGQ6MTAscG9pbnRlcnM6MSxkaXJlY3Rpb246UGF9LGdldFRvdWNoQWN0aW9uOmZ1bmN0aW9uKCl7dmFyIGE9dGhpcy5vcHRpb25zLmRpcmVjdGlvbixiPVtdO3JldHVybiBhJk5hJiZiLnB1c2gobGIpLGEmT2EmJmIucHVzaChrYiksYn0sZGlyZWN0aW9uVGVzdDpmdW5jdGlvbihhKXt2YXIgYj10aGlzLm9wdGlvbnMsYz0hMCxkPWEuZGlzdGFuY2UsZT1hLmRpcmVjdGlvbixmPWEuZGVsdGFYLGc9YS5kZWx0YVk7cmV0dXJuIGUmYi5kaXJlY3Rpb258fChiLmRpcmVjdGlvbiZOYT8oZT0wPT09Zj9JYTowPmY/SmE6S2EsYz1mIT10aGlzLnBYLGQ9TWF0aC5hYnMoYS5kZWx0YVgpKTooZT0wPT09Zz9JYTowPmc/TGE6TWEsYz1nIT10aGlzLnBZLGQ9TWF0aC5hYnMoYS5kZWx0YVkpKSksYS5kaXJlY3Rpb249ZSxjJiZkPmIudGhyZXNob2xkJiZlJmIuZGlyZWN0aW9ufSxhdHRyVGVzdDpmdW5jdGlvbihhKXtyZXR1cm4gYWEucHJvdG90eXBlLmF0dHJUZXN0LmNhbGwodGhpcyxhKSYmKHRoaXMuc3RhdGUmb2J8fCEodGhpcy5zdGF0ZSZvYikmJnRoaXMuZGlyZWN0aW9uVGVzdChhKSl9LGVtaXQ6ZnVuY3Rpb24oYSl7dGhpcy5wWD1hLmRlbHRhWCx0aGlzLnBZPWEuZGVsdGFZO3ZhciBiPSQoYS5kaXJlY3Rpb24pO2ImJihhLmFkZGl0aW9uYWxFdmVudD10aGlzLm9wdGlvbnMuZXZlbnQrYiksdGhpcy5fc3VwZXIuZW1pdC5jYWxsKHRoaXMsYSl9fSksaShjYSxhYSx7ZGVmYXVsdHM6e2V2ZW50OlwicGluY2hcIix0aHJlc2hvbGQ6MCxwb2ludGVyczoyfSxnZXRUb3VjaEFjdGlvbjpmdW5jdGlvbigpe3JldHVybltqYl19LGF0dHJUZXN0OmZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLl9zdXBlci5hdHRyVGVzdC5jYWxsKHRoaXMsYSkmJihNYXRoLmFicyhhLnNjYWxlLTEpPnRoaXMub3B0aW9ucy50aHJlc2hvbGR8fHRoaXMuc3RhdGUmb2IpfSxlbWl0OmZ1bmN0aW9uKGEpe2lmKDEhPT1hLnNjYWxlKXt2YXIgYj1hLnNjYWxlPDE/XCJpblwiOlwib3V0XCI7YS5hZGRpdGlvbmFsRXZlbnQ9dGhpcy5vcHRpb25zLmV2ZW50K2J9dGhpcy5fc3VwZXIuZW1pdC5jYWxsKHRoaXMsYSl9fSksaShkYSxZLHtkZWZhdWx0czp7ZXZlbnQ6XCJwcmVzc1wiLHBvaW50ZXJzOjEsdGltZToyNTEsdGhyZXNob2xkOjl9LGdldFRvdWNoQWN0aW9uOmZ1bmN0aW9uKCl7cmV0dXJuW2hiXX0scHJvY2VzczpmdW5jdGlvbihhKXt2YXIgYj10aGlzLm9wdGlvbnMsYz1hLnBvaW50ZXJzLmxlbmd0aD09PWIucG9pbnRlcnMsZD1hLmRpc3RhbmNlPGIudGhyZXNob2xkLGY9YS5kZWx0YVRpbWU+Yi50aW1lO2lmKHRoaXMuX2lucHV0PWEsIWR8fCFjfHxhLmV2ZW50VHlwZSYoR2F8SGEpJiYhZil0aGlzLnJlc2V0KCk7ZWxzZSBpZihhLmV2ZW50VHlwZSZFYSl0aGlzLnJlc2V0KCksdGhpcy5fdGltZXI9ZShmdW5jdGlvbigpe3RoaXMuc3RhdGU9cmIsdGhpcy50cnlFbWl0KCl9LGIudGltZSx0aGlzKTtlbHNlIGlmKGEuZXZlbnRUeXBlJkdhKXJldHVybiByYjtyZXR1cm4gdGJ9LHJlc2V0OmZ1bmN0aW9uKCl7Y2xlYXJUaW1lb3V0KHRoaXMuX3RpbWVyKX0sZW1pdDpmdW5jdGlvbihhKXt0aGlzLnN0YXRlPT09cmImJihhJiZhLmV2ZW50VHlwZSZHYT90aGlzLm1hbmFnZXIuZW1pdCh0aGlzLm9wdGlvbnMuZXZlbnQrXCJ1cFwiLGEpOih0aGlzLl9pbnB1dC50aW1lU3RhbXA9cmEoKSx0aGlzLm1hbmFnZXIuZW1pdCh0aGlzLm9wdGlvbnMuZXZlbnQsdGhpcy5faW5wdXQpKSl9fSksaShlYSxhYSx7ZGVmYXVsdHM6e2V2ZW50Olwicm90YXRlXCIsdGhyZXNob2xkOjAscG9pbnRlcnM6Mn0sZ2V0VG91Y2hBY3Rpb246ZnVuY3Rpb24oKXtyZXR1cm5bamJdfSxhdHRyVGVzdDpmdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5fc3VwZXIuYXR0clRlc3QuY2FsbCh0aGlzLGEpJiYoTWF0aC5hYnMoYS5yb3RhdGlvbik+dGhpcy5vcHRpb25zLnRocmVzaG9sZHx8dGhpcy5zdGF0ZSZvYil9fSksaShmYSxhYSx7ZGVmYXVsdHM6e2V2ZW50Olwic3dpcGVcIix0aHJlc2hvbGQ6MTAsdmVsb2NpdHk6LjMsZGlyZWN0aW9uOk5hfE9hLHBvaW50ZXJzOjF9LGdldFRvdWNoQWN0aW9uOmZ1bmN0aW9uKCl7cmV0dXJuIGJhLnByb3RvdHlwZS5nZXRUb3VjaEFjdGlvbi5jYWxsKHRoaXMpfSxhdHRyVGVzdDpmdW5jdGlvbihhKXt2YXIgYixjPXRoaXMub3B0aW9ucy5kaXJlY3Rpb247cmV0dXJuIGMmKE5hfE9hKT9iPWEub3ZlcmFsbFZlbG9jaXR5OmMmTmE/Yj1hLm92ZXJhbGxWZWxvY2l0eVg6YyZPYSYmKGI9YS5vdmVyYWxsVmVsb2NpdHlZKSx0aGlzLl9zdXBlci5hdHRyVGVzdC5jYWxsKHRoaXMsYSkmJmMmYS5vZmZzZXREaXJlY3Rpb24mJmEuZGlzdGFuY2U+dGhpcy5vcHRpb25zLnRocmVzaG9sZCYmYS5tYXhQb2ludGVycz09dGhpcy5vcHRpb25zLnBvaW50ZXJzJiZxYShiKT50aGlzLm9wdGlvbnMudmVsb2NpdHkmJmEuZXZlbnRUeXBlJkdhfSxlbWl0OmZ1bmN0aW9uKGEpe3ZhciBiPSQoYS5vZmZzZXREaXJlY3Rpb24pO2ImJnRoaXMubWFuYWdlci5lbWl0KHRoaXMub3B0aW9ucy5ldmVudCtiLGEpLHRoaXMubWFuYWdlci5lbWl0KHRoaXMub3B0aW9ucy5ldmVudCxhKX19KSxpKGdhLFkse2RlZmF1bHRzOntldmVudDpcInRhcFwiLHBvaW50ZXJzOjEsdGFwczoxLGludGVydmFsOjMwMCx0aW1lOjI1MCx0aHJlc2hvbGQ6OSxwb3NUaHJlc2hvbGQ6MTB9LGdldFRvdWNoQWN0aW9uOmZ1bmN0aW9uKCl7cmV0dXJuW2liXX0scHJvY2VzczpmdW5jdGlvbihhKXt2YXIgYj10aGlzLm9wdGlvbnMsYz1hLnBvaW50ZXJzLmxlbmd0aD09PWIucG9pbnRlcnMsZD1hLmRpc3RhbmNlPGIudGhyZXNob2xkLGY9YS5kZWx0YVRpbWU8Yi50aW1lO2lmKHRoaXMucmVzZXQoKSxhLmV2ZW50VHlwZSZFYSYmMD09PXRoaXMuY291bnQpcmV0dXJuIHRoaXMuZmFpbFRpbWVvdXQoKTtpZihkJiZmJiZjKXtpZihhLmV2ZW50VHlwZSE9R2EpcmV0dXJuIHRoaXMuZmFpbFRpbWVvdXQoKTt2YXIgZz10aGlzLnBUaW1lP2EudGltZVN0YW1wLXRoaXMucFRpbWU8Yi5pbnRlcnZhbDohMCxoPSF0aGlzLnBDZW50ZXJ8fEgodGhpcy5wQ2VudGVyLGEuY2VudGVyKTxiLnBvc1RocmVzaG9sZDt0aGlzLnBUaW1lPWEudGltZVN0YW1wLHRoaXMucENlbnRlcj1hLmNlbnRlcixoJiZnP3RoaXMuY291bnQrPTE6dGhpcy5jb3VudD0xLHRoaXMuX2lucHV0PWE7dmFyIGk9dGhpcy5jb3VudCViLnRhcHM7aWYoMD09PWkpcmV0dXJuIHRoaXMuaGFzUmVxdWlyZUZhaWx1cmVzKCk/KHRoaXMuX3RpbWVyPWUoZnVuY3Rpb24oKXt0aGlzLnN0YXRlPXJiLHRoaXMudHJ5RW1pdCgpfSxiLmludGVydmFsLHRoaXMpLG9iKTpyYn1yZXR1cm4gdGJ9LGZhaWxUaW1lb3V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3RpbWVyPWUoZnVuY3Rpb24oKXt0aGlzLnN0YXRlPXRifSx0aGlzLm9wdGlvbnMuaW50ZXJ2YWwsdGhpcyksdGJ9LHJlc2V0OmZ1bmN0aW9uKCl7Y2xlYXJUaW1lb3V0KHRoaXMuX3RpbWVyKX0sZW1pdDpmdW5jdGlvbigpe3RoaXMuc3RhdGU9PXJiJiYodGhpcy5faW5wdXQudGFwQ291bnQ9dGhpcy5jb3VudCx0aGlzLm1hbmFnZXIuZW1pdCh0aGlzLm9wdGlvbnMuZXZlbnQsdGhpcy5faW5wdXQpKX19KSxoYS5WRVJTSU9OPVwiMi4wLjhcIixoYS5kZWZhdWx0cz17ZG9tRXZlbnRzOiExLHRvdWNoQWN0aW9uOmdiLGVuYWJsZTohMCxpbnB1dFRhcmdldDpudWxsLGlucHV0Q2xhc3M6bnVsbCxwcmVzZXQ6W1tlYSx7ZW5hYmxlOiExfV0sW2NhLHtlbmFibGU6ITF9LFtcInJvdGF0ZVwiXV0sW2ZhLHtkaXJlY3Rpb246TmF9XSxbYmEse2RpcmVjdGlvbjpOYX0sW1wic3dpcGVcIl1dLFtnYV0sW2dhLHtldmVudDpcImRvdWJsZXRhcFwiLHRhcHM6Mn0sW1widGFwXCJdXSxbZGFdXSxjc3NQcm9wczp7dXNlclNlbGVjdDpcIm5vbmVcIix0b3VjaFNlbGVjdDpcIm5vbmVcIix0b3VjaENhbGxvdXQ6XCJub25lXCIsY29udGVudFpvb21pbmc6XCJub25lXCIsdXNlckRyYWc6XCJub25lXCIsdGFwSGlnaGxpZ2h0Q29sb3I6XCJyZ2JhKDAsMCwwLDApXCJ9fTt2YXIgdWI9MSx2Yj0yO2lhLnByb3RvdHlwZT17c2V0OmZ1bmN0aW9uKGEpe3JldHVybiBsYSh0aGlzLm9wdGlvbnMsYSksYS50b3VjaEFjdGlvbiYmdGhpcy50b3VjaEFjdGlvbi51cGRhdGUoKSxhLmlucHV0VGFyZ2V0JiYodGhpcy5pbnB1dC5kZXN0cm95KCksdGhpcy5pbnB1dC50YXJnZXQ9YS5pbnB1dFRhcmdldCx0aGlzLmlucHV0LmluaXQoKSksdGhpc30sc3RvcDpmdW5jdGlvbihhKXt0aGlzLnNlc3Npb24uc3RvcHBlZD1hP3ZiOnVifSxyZWNvZ25pemU6ZnVuY3Rpb24oYSl7dmFyIGI9dGhpcy5zZXNzaW9uO2lmKCFiLnN0b3BwZWQpe3RoaXMudG91Y2hBY3Rpb24ucHJldmVudERlZmF1bHRzKGEpO3ZhciBjLGQ9dGhpcy5yZWNvZ25pemVycyxlPWIuY3VyUmVjb2duaXplcjsoIWV8fGUmJmUuc3RhdGUmcmIpJiYoZT1iLmN1clJlY29nbml6ZXI9bnVsbCk7Zm9yKHZhciBmPTA7ZjxkLmxlbmd0aDspYz1kW2ZdLGIuc3RvcHBlZD09PXZifHxlJiZjIT1lJiYhYy5jYW5SZWNvZ25pemVXaXRoKGUpP2MucmVzZXQoKTpjLnJlY29nbml6ZShhKSwhZSYmYy5zdGF0ZSYob2J8cGJ8cWIpJiYoZT1iLmN1clJlY29nbml6ZXI9YyksZisrfX0sZ2V0OmZ1bmN0aW9uKGEpe2lmKGEgaW5zdGFuY2VvZiBZKXJldHVybiBhO2Zvcih2YXIgYj10aGlzLnJlY29nbml6ZXJzLGM9MDtjPGIubGVuZ3RoO2MrKylpZihiW2NdLm9wdGlvbnMuZXZlbnQ9PWEpcmV0dXJuIGJbY107cmV0dXJuIG51bGx9LGFkZDpmdW5jdGlvbihhKXtpZihmKGEsXCJhZGRcIix0aGlzKSlyZXR1cm4gdGhpczt2YXIgYj10aGlzLmdldChhLm9wdGlvbnMuZXZlbnQpO3JldHVybiBiJiZ0aGlzLnJlbW92ZShiKSx0aGlzLnJlY29nbml6ZXJzLnB1c2goYSksYS5tYW5hZ2VyPXRoaXMsdGhpcy50b3VjaEFjdGlvbi51cGRhdGUoKSxhfSxyZW1vdmU6ZnVuY3Rpb24oYSl7aWYoZihhLFwicmVtb3ZlXCIsdGhpcykpcmV0dXJuIHRoaXM7aWYoYT10aGlzLmdldChhKSl7dmFyIGI9dGhpcy5yZWNvZ25pemVycyxjPXIoYixhKTstMSE9PWMmJihiLnNwbGljZShjLDEpLHRoaXMudG91Y2hBY3Rpb24udXBkYXRlKCkpfXJldHVybiB0aGlzfSxvbjpmdW5jdGlvbihhLGIpe2lmKGEhPT1kJiZiIT09ZCl7dmFyIGM9dGhpcy5oYW5kbGVycztyZXR1cm4gZyhxKGEpLGZ1bmN0aW9uKGEpe2NbYV09Y1thXXx8W10sY1thXS5wdXNoKGIpfSksdGhpc319LG9mZjpmdW5jdGlvbihhLGIpe2lmKGEhPT1kKXt2YXIgYz10aGlzLmhhbmRsZXJzO3JldHVybiBnKHEoYSksZnVuY3Rpb24oYSl7Yj9jW2FdJiZjW2FdLnNwbGljZShyKGNbYV0sYiksMSk6ZGVsZXRlIGNbYV19KSx0aGlzfX0sZW1pdDpmdW5jdGlvbihhLGIpe3RoaXMub3B0aW9ucy5kb21FdmVudHMmJmthKGEsYik7dmFyIGM9dGhpcy5oYW5kbGVyc1thXSYmdGhpcy5oYW5kbGVyc1thXS5zbGljZSgpO2lmKGMmJmMubGVuZ3RoKXtiLnR5cGU9YSxiLnByZXZlbnREZWZhdWx0PWZ1bmN0aW9uKCl7Yi5zcmNFdmVudC5wcmV2ZW50RGVmYXVsdCgpfTtmb3IodmFyIGQ9MDtkPGMubGVuZ3RoOyljW2RdKGIpLGQrK319LGRlc3Ryb3k6ZnVuY3Rpb24oKXt0aGlzLmVsZW1lbnQmJmphKHRoaXMsITEpLHRoaXMuaGFuZGxlcnM9e30sdGhpcy5zZXNzaW9uPXt9LHRoaXMuaW5wdXQuZGVzdHJveSgpLHRoaXMuZWxlbWVudD1udWxsfX0sbGEoaGEse0lOUFVUX1NUQVJUOkVhLElOUFVUX01PVkU6RmEsSU5QVVRfRU5EOkdhLElOUFVUX0NBTkNFTDpIYSxTVEFURV9QT1NTSUJMRTpuYixTVEFURV9CRUdBTjpvYixTVEFURV9DSEFOR0VEOnBiLFNUQVRFX0VOREVEOnFiLFNUQVRFX1JFQ09HTklaRUQ6cmIsU1RBVEVfQ0FOQ0VMTEVEOnNiLFNUQVRFX0ZBSUxFRDp0YixESVJFQ1RJT05fTk9ORTpJYSxESVJFQ1RJT05fTEVGVDpKYSxESVJFQ1RJT05fUklHSFQ6S2EsRElSRUNUSU9OX1VQOkxhLERJUkVDVElPTl9ET1dOOk1hLERJUkVDVElPTl9IT1JJWk9OVEFMOk5hLERJUkVDVElPTl9WRVJUSUNBTDpPYSxESVJFQ1RJT05fQUxMOlBhLE1hbmFnZXI6aWEsSW5wdXQ6eCxUb3VjaEFjdGlvbjpWLFRvdWNoSW5wdXQ6UCxNb3VzZUlucHV0OkwsUG9pbnRlckV2ZW50SW5wdXQ6TSxUb3VjaE1vdXNlSW5wdXQ6UixTaW5nbGVUb3VjaElucHV0Ok4sUmVjb2duaXplcjpZLEF0dHJSZWNvZ25pemVyOmFhLFRhcDpnYSxQYW46YmEsU3dpcGU6ZmEsUGluY2g6Y2EsUm90YXRlOmVhLFByZXNzOmRhLG9uOm0sb2ZmOm4sZWFjaDpnLG1lcmdlOnRhLGV4dGVuZDpzYSxhc3NpZ246bGEsaW5oZXJpdDppLGJpbmRGbjpqLHByZWZpeGVkOnV9KTt2YXIgd2I9XCJ1bmRlZmluZWRcIiE9dHlwZW9mIGE/YTpcInVuZGVmaW5lZFwiIT10eXBlb2Ygc2VsZj9zZWxmOnt9O3diLkhhbW1lcj1oYSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKGZ1bmN0aW9uKCl7cmV0dXJuIGhhfSk6XCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZSYmbW9kdWxlLmV4cG9ydHM/bW9kdWxlLmV4cG9ydHM9aGE6YVtjXT1oYX0od2luZG93LGRvY3VtZW50LFwiSGFtbWVyXCIpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aGFtbWVyLm1pbi5qcy5tYXAiLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=