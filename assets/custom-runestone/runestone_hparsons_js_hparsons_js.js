(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_hparsons_js_hparsons_js"],{

/***/ 2094:
/*!***********************************************!*\
  !*** ./runestone/hparsons/css/hljs-xcode.css ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 2759:
/*!**********************************************!*\
  !*** ./runestone/hparsons/js/SQLFeedback.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SQLFeedback)
/* harmony export */ });
/* harmony import */ var _hparsonsFeedback__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./hparsonsFeedback */ 76759);
/* harmony import */ var sql_js_dist_sql_wasm_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! sql.js/dist/sql-wasm.js */ 15826);
/* harmony import */ var sql_js_dist_sql_wasm_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(sql_js_dist_sql_wasm_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../common/js/rsi18n.js */ 54250);
/* harmony import */ var _common_js_resultTable_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../common/js/resultTable.js */ 66714);





var allDburls = {};

class SQLFeedback extends _hparsonsFeedback__WEBPACK_IMPORTED_MODULE_0__["default"] {
    createOutput() {
        var outDiv = document.createElement("div");
        outDiv.classList.add("hp_output");
        this.outDiv = outDiv;
        this.output = document.createElement("pre");
        this.output.id = this.hparsons.divid + "_stdout";
        this.output.style.visibility = "hidden";
        var clearDiv = document.createElement("div");
        clearDiv.style.clear = "both"; // needed to make parent div resize properly
        this.hparsons.outerDiv.appendChild(clearDiv);
        outDiv.appendChild(this.output);
        this.hparsons.outerDiv.appendChild(outDiv);
        clearDiv = document.createElement("div");
        clearDiv.style.clear = "both"; // needed to make parent div resize properly
        this.hparsons.outerDiv.appendChild(clearDiv);
    }

    renderFeedback() {
        if (this.testResult) {
            this.output.textContent = this.testResult;
            this.output.style.visibility = "visible";
        }
        this.outDiv.style.display = "block"; // hparsons.css hides .hp_output
    }

    clearFeedback() {
        this.outDiv.style.display = "none";
    }

    reset() {
        this.clearFeedback();
    }

    init() {
        // adapted from activecode-sql
        // fnprefix sets the path to load the sql-wasm.wasm file
        var bookprefix;
        var fnprefix;
        if (
            eBookConfig.useRunestoneServices ||
            window.location.search.includes("mode=browsing")
        ) {
            bookprefix = `/books/published/${eBookConfig.basecourse}`;
            fnprefix = bookprefix + "/_static";
        } else {
            // The else clause handles the case where you are building for a static web browser
            bookprefix = "";
            fnprefix = "/_static";
        }
        let SQLconfig = {
            locateFile: (filename) => `${fnprefix}/${filename}`,
        };
        var self = this.hparsons;
        sql_js_dist_sql_wasm_js__WEBPACK_IMPORTED_MODULE_1___default()(SQLconfig).then(function (SQL) {
            // set up call to load database asynchronously if given
            if (self.dburl) {
                if (self.dburl.startsWith("/_static")) {
                    self.dburl = `${bookprefix}${self.dburl}`;
                }
                self.runButton.setAttribute("disabled", "disabled");
                let buttonText = self.runButton.textContent;
                self.runButton.textContent = "Loading database...";
                if (!(self.dburl in allDburls)) {
                    let resolveFn;
                    const promise = new Promise((resolve) => {
                        resolveFn = resolve;
                    });
                    allDburls[self.dburl] = {
                        status: "loading",
                        xWaitFor: { promise, resolve: resolveFn },
                    };
                } else {
                    if (allDburls[self.dburl].status == "loading") {
                        allDburls[self.dburl].xWaitFor.promise.then(
                            function () {
                                self.db = allDburls[self.dburl].dbObject;
                                self.runButton.removeAttribute("disabled");
                                self.runButton.textContent = buttonText;
                            },
                        );
                        return;
                    }
                    self.db = allDburls[self.dburl].dbObject;
                    self.runButton.removeAttribute("disabled");
                    self.runButton.textContent = buttonText;
                    return;
                }
                var xhr = new XMLHttpRequest();
                // For example: https://github.com/lerocha/chinook-database/raw/master/ChinookDatabase/DataSources/Chinook_Sqlite.sqlite
                xhr.open("GET", self.dburl, true);
                xhr.responseType = "arraybuffer";
                xhr.onload = (e) => {
                    var uInt8Array = new Uint8Array(xhr.response);
                    self.db = new SQL.Database(uInt8Array);
                    allDburls[self.dburl].dbObject = self.db;
                    self.runButton.textContent = buttonText;
                    self.runButton.removeAttribute("disabled");
                    allDburls[self.dburl].db = uInt8Array;
                    allDburls[self.dburl].status = "ready";
                    allDburls[self.dburl].xWaitFor.resolve();
                    // contents is now [{columns:['col1','col2',...], values:[[first row], [second row], ...]}]
                };
                xhr.send();
            } else {
                self.db = new SQL.Database();
            }
        });
    }

    // adapted from activecode - SQL
    async runButtonHandler() {
        // Disable the run button until the run is finished.
        this.hparsons.runButton.disabled = true;
        try {
            await this.runProg();
        } catch (e) {
            console.log(`there was an error ${e} running the code`);
        }
        this.logCurrentAnswer();
        this.renderFeedback();
        // The run is finished; re-enable the button.
        this.hparsons.runButton.disabled = false;
    }

    // adapted from activecode-sql
    async runProg() {
        // Clear any old results
        let divid = this.hparsons.divid + "_sql_out";
        let respDiv = document.getElementById(divid);
        if (respDiv) {
            respDiv.parentElement.removeChild(respDiv);
        }
        this.output.textContent = "";
        // creating new results div
        respDiv = document.createElement("div");
        respDiv.id = divid;
        this.outDiv.appendChild(respDiv);
        // show the output div
        this.outDiv.style.display = "block"; // hparsons.css hides .hp_output

        // Run this query
        let query = await this.buildProg();
        if (!this.hparsons.db) {
            this.output.textContent = `Error: Database not initialized! DBURL: ${this.hparsons.dburl}`;
            return;
        }

        // When having prefix/suffix, the visualization is consistent with "showlastsql" option of sql activecode:
        //        only visualize last entry

        let executionSuccessFlag = true;
        // executing hidden prefix if exist
        if (query.prefix) {
            this.prefixresults = this.executeIteratedStatements(
                this.hparsons.db.iterateStatements(query.prefix),
            );
            if (this.prefixresults.at(-1).status == "failure") {
                // if error occured in hidden prefix, log and stop executing the rest
                this.visualizeResults(
                    respDiv,
                    this.prefixresults,
                    "Error executing hidden code in prefix",
                );
                executionSuccessFlag = false;
            }
        }

        // executing student input in micro Parsons
        if (executionSuccessFlag) {
            this.results = this.executeIteratedStatements(
                this.hparsons.db.iterateStatements(query.input),
            );
            if (this.results.at(-1).status == "failure") {
                // if error occured in student input, stop executing suffix/unitttest
                // and visualize the error
                this.visualizeResults(respDiv, this.results);
                executionSuccessFlag = false;
            } else if (!query.suffix) {
                this.visualizeResults(respDiv, this.results);
            }
        }

        // executing hidden suffix if exist
        // In most cases the suffix is just "select * from x" to
        //    get all data from the table to see if the operations the table is correct
        if (executionSuccessFlag && query.suffix) {
            this.suffixresults = this.executeIteratedStatements(
                this.hparsons.db.iterateStatements(query.suffix),
            );
            if (this.suffixresults.at(-1).status == "failure") {
                // if error occured in hidden suffix, visualize the results
                this.visualizeResults(
                    respDiv,
                    this.suffixresults,
                    "Error executing hidden code in suffix",
                );
                executionSuccessFlag = false;
            } else {
                this.visualizeResults(respDiv, this.suffixresults);
            }
        }

        // Now handle autograding
        // autograding takes the results of the hidden suffix if exist
        // otherwise take the result of student input
        if (this.hparsons.unittest) {
            if (executionSuccessFlag) {
                if (this.suffixresults) {
                    this.testResult = this.autograde(
                        this.suffixresults[this.suffixresults.length - 1],
                    );
                } else {
                    this.testResult = this.autograde(
                        this.results[this.results.length - 1],
                    );
                }
            } else {
                // unit test results when execution failed
                this.passed = 0;
                this.failed = 0;
                this.percent = NaN;
                this.unit_results = `percent:${this.percent}:passed:${this.passed}:failed:${this.failed}`;
                // Do not show unittest results if execution failed
                this.output.style.visibility = "hidden";
            }
        } else {
            this.output.style.visibility = "hidden";
        }

        return Promise.resolve("done");
    }

    // Refactored from activecode-sql.
    // Takes iterated statements from db.iterateStatemnts(queryString)
    // Returns Array<result>:
    /* each result: {
        status: "success" or "faliure",
        // for SELECT statements (?):
        columns: number of columns,
        values: data,
        rowcount: number of rows in data,
        // for INSERT, UPDATE, DELETE:
        operation: "INSERT", "UPDATE", or "DELETE",
        rowcount: number of rows modified,
        // when error occurred (aside from status):
        message: error message,
        sql: remaining SQL (?)
        // when no queries were executed:
        message: "no queries submitted"
    }*/
    // If an error occurs it will stop executing the rest of queries in it.
    // Thus the error result will always be the last item.
    executeIteratedStatements(it) {
        let results = [];
        try {
            for (let statement of it) {
                let columns = statement.getColumnNames();
                if (columns.length > 0) {
                    // data! probably a SELECT
                    let data = [];
                    while (statement.step()) {
                        data.push(statement.get());
                    }
                    results.push({
                        status: "success",
                        columns: columns,
                        values: data,
                        rowcount: data.length,
                    });
                } else {
                    let nsql = statement.getNormalizedSQL();
                    let prefix = nsql.substr(0, 6).toLowerCase();
                    statement.step(); // execute the query
                    // Try to detect INSERT/UPDATE/DELETE to give friendly feedback
                    // on rows modified - unfortunately, this won't catch such queries
                    // if they use CTEs.  There seems to be no reliable way of knowing
                    // when a SQLite query actually modified data.
                    if (
                        prefix === "insert" ||
                        prefix === "update" ||
                        prefix === "delete"
                    ) {
                        results.push({
                            status: "success",
                            operation: prefix,
                            rowcount: this.hparsons.db.getRowsModified(),
                        });
                    } else {
                        results.push({ status: "success" });
                    }
                }
            }
        } catch (e) {
            results.push({
                status: "failure",
                message: e.toString(),
                sql: it.getRemainingSQL(),
            });
        }
        if (results.length === 0) {
            results.push({
                status: "failure",
                message: "No queries submitted.",
            });
        }
        return results;
    }

    // output the results in the resultArray(Array<results>).
    // container: the container that contains the results
    // resultArray (Array<result>): see executeIteratedStatements
    // Each result will be in a separate row.
    // devNote will be displayed in the top row if exist;
    //     it usually won't happen unless something is wrong with prefix and suffix.
    //     ("error execution prefix/suffix")
    visualizeResults(container, resultArray, devNote) {
        if (devNote) {
            let section = document.createElement("div");
            section.setAttribute("class", "hp_sql_result");
            container.appendChild(section);
            let messageBox = document.createElement("pre");
            messageBox.textContent = devNote;
            messageBox.setAttribute("class", "hp_sql_result_failure");
            section.appendChild(messageBox);
        }
        for (let r of resultArray) {
            let section = document.createElement("div");
            section.setAttribute("class", "hp_sql_result");
            container.appendChild(section);
            if (r.status === "success") {
                if (r.columns) {
                    let tableDiv = document.createElement("div");
                    section.appendChild(tableDiv);
                    let maxHeight = 350;
                    if (resultArray.length > 1) maxHeight = 200; // max height smaller if lots of results
                    (0,_common_js_resultTable_js__WEBPACK_IMPORTED_MODULE_3__.createResultTable)(
                        r,
                        tableDiv,
                        maxHeight,
                        (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_2__.t)("msg_hparsons_query_results"),
                    );
                    let messageBox = document.createElement("pre");
                    let rmsg = r.rowcount !== 1 ? " rows " : " row ";
                    let msg = "" + r.rowcount + rmsg + "returned";
                    if (r.rowcount > 100) {
                        msg = msg + " (only first 100 rows displayed)";
                    }
                    msg = msg + ".";
                    messageBox.textContent = msg;
                    messageBox.setAttribute("class", "hp_sql_result_success");
                    section.appendChild(messageBox);
                } else if (r.rowcount) {
                    let messageBox = document.createElement("pre");
                    let op = r.operation;
                    op = op + (op.charAt(op.length - 1) === "e" ? "d." : "ed.");
                    let rmsg = r.rowcount !== 1 ? " rows " : " row ";
                    messageBox.textContent = "" + r.rowcount + rmsg + op;
                    messageBox.setAttribute("class", "hp_sql_result_success");
                    section.appendChild(messageBox);
                } else {
                    let messageBox = document.createElement("pre");
                    messageBox.textContent = "Operation succeeded.";
                    messageBox.setAttribute("class", "hp_sql_result_success");
                    section.appendChild(messageBox);
                }
            } else {
                let messageBox = document.createElement("pre");
                messageBox.textContent = r.message;
                messageBox.setAttribute("class", "hp_sql_result_failure");
                section.appendChild(messageBox);
            }
        }
    }

    // adapted from activecode
    async buildProg() {
        // assemble code from prefix, suffix, and editor for running.
        let prog = {};
        if (this.hparsons.hiddenPrefix) {
            prog.prefix = this.hparsons.hiddenPrefix;
        }
        prog.input =
            this.hparsons.hparsonsInput.getParsonsTextArray().join(" ") + "\n";
        if (this.hparsons.hiddenSuffix) {
            prog.suffix = this.hparsons.hiddenSuffix;
        }
        return Promise.resolve(prog);
    }

    // copied from activecode-sql
    async logCurrentAnswer() {
        if (this.unit_results) {
            let act = {
                scheme: "execution",
                correct: this.failed == 0 && this.passed != 0 ? "T" : "F",
                answer: this.hparsons.hparsonsInput.getParsonsTextArray(),
                percent: this.percent, // percent is null if there is execution error
            };
            let logData = {
                event: "hparsonsAnswer",
                div_id: this.hparsons.divid,
                act: JSON.stringify(act),
                percent: this.percent || 0,
                correct: act.correct,
                answer: JSON.stringify({ blocks: act.answer }),
            };
            await this.hparsons.logBookEvent(logData);
        }
    }

    // might move to base class if used by multiple execution based feedback
    autograde(result_table) {
        var tests = this.hparsons.unittest.split(/\n/);
        this.passed = 0;
        this.failed = 0;
        // Tests should be of the form
        // assert row,col oper value for example
        // assert 4,4 == 3
        var result = "";
        tests = tests.filter(function (s) {
            return s.indexOf("assert") > -1;
        });
        for (let test of tests) {
            let wlist = test.split(/\s+/);
            wlist.shift();
            let loc = wlist.shift();
            let oper = wlist.shift();
            let expected = wlist.join(" ");
            let [row, col] = loc.split(",");
            result += this.testOneAssert(
                row,
                col,
                oper,
                expected,
                result_table,
            );
            result += "\n";
        }
        let pct = (100 * this.passed) / (this.passed + this.failed);
        this.percent = pct;
        pct = pct.toLocaleString(undefined, { maximumFractionDigits: 2 });
        result += `You passed ${this.passed} out of ${
            this.passed + this.failed
        } tests for ${pct}%`;
        this.unit_results = `percent:${pct}:passed:${this.passed}:failed:${this.failed}`;
        return result;
    }

    // might move to base class if used by multiple execution based feedback
    testOneAssert(row, col, oper, expected, result_table) {
        // make sure row and col are in bounds
        let actual;
        let output = "";
        try {
            actual = result_table.values[row][col];
        } catch (e) {
            if (expected == "NO_DATA") {
                this.passed++;
                output = `Passed: No data in row ${row}, column ${col}`;
                return output;
            } else {
                output = `Failed: Not enough data to check row ${row} or column ${col}`;
                return output;
            }
        }
        const operators = {
            "==": function (operand1, operand2) {
                return operand1 == operand2;
            },
            "!=": function (operand1, operand2) {
                return operand1 != operand2;
            },
            ">": function (operand1, operand2) {
                return operand1 > operand2;
            },
            "<": function (operand1, operand2) {
                return operand1 > operand2;
            },
        };
        let res = operators[oper](actual, expected);
        if (res) {
            output = `Pass: ${actual} ${oper} ${expected} in row ${row} column ${result_table.columns[col]}`;
            this.passed++;
        } else {
            output = `Failed ${actual} ${oper} ${expected} in row ${row} column ${result_table.columns[col]}`;
            this.failed++;
        }
        return output;
    }
}


/***/ }),

/***/ 3636:
/*!******************************************************!*\
  !*** ./runestone/hparsons/js/hparsons-i18n.pt-br.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/rsi18n.js */ 54250);


(0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.load)({
    "pt-br": {
        msg_hparsons_drag_blocks_code:
            "Arraste ou clique nos blocos abaixo para formar seu código:",
        msg_hparsons_drag_blocks_answer:
            "Arraste ou clique nos blocos abaixo para formar sua resposta:",
        msg_hparsons_drop_blocks_code:
            "Seu código (clique em um bloco para removê-lo):",
        msg_hparsons_drop_blocks_answer:
            "Sua resposta (clique em um bloco para removê-lo):",
        msg_hparsons_available_blocks: "Blocos disponíveis",
        msg_hparsons_answer_area: "Área de resposta",
        msg_hparsons_keyboard_idle_instructions:
            "Pressione Enter para mover blocos com o teclado.",
        msg_hparsons_keyboard_instructions:
            "Use as setas Esquerda e Direita para escolher um bloco nesta área. Use as setas Para Cima e Para Baixo para alternar entre os blocos disponíveis e a área de resposta. Pressione Enter para mover o bloco atual. Pressione Escape ou Tab para terminar.",
        msg_hparsons_block_moved_to_answer: "$1 movido para a área de resposta",
        msg_hparsons_block_moved_to_available: "$1 movido para os blocos disponíveis",
        msg_hparsons_moving: "Movendo $1",
        msg_hparsons_keyboard_finished: "Movimentação de blocos pelo teclado concluída.",
        msg_hparsons_check_me: "Verificar",
        msg_hparsons_blocks_reset: "Blocos redefinidos.",
        msg_hparsons_run: "Executar",
        msg_hparsons_query_results: "Resultados da consulta",
    },
});


/***/ }),

/***/ 10245:
/*!*********************************************!*\
  !*** ./runestone/hparsons/css/hparsons.css ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 25833:
/*!**************************************************************!*\
  !*** ./runestone/hparsons/js/micro-parsons/micro-parsons.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   InitMicroParsons: () => (/* binding */ InitMicroParsons),
/* harmony export */   MicroParsonsElement: () => (/* binding */ MicroParsonsElement)
/* harmony export */ });
/* harmony import */ var _ParsonsInput__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ParsonsInput */ 39258);
/* harmony import */ var _style_style_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./style/style.css */ 84314);
/* harmony import */ var highlight_js_lib_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! highlight.js/lib/core */ 50011);
/* harmony import */ var highlight_js_lib_languages_javascript__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! highlight.js/lib/languages/javascript */ 15603);
/* harmony import */ var highlight_js_lib_languages_python__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! highlight.js/lib/languages/python */ 85262);
/* harmony import */ var highlight_js_lib_languages_java__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! highlight.js/lib/languages/java */ 83736);
/* harmony import */ var highlight_js_lib_languages_sql__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! highlight.js/lib/languages/sql */ 57470);
/* harmony import */ var highlight_js_lib_languages_xml__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! highlight.js/lib/languages/xml */ 69359);








highlight_js_lib_core__WEBPACK_IMPORTED_MODULE_2__["default"].registerLanguage("javascript", highlight_js_lib_languages_javascript__WEBPACK_IMPORTED_MODULE_3__["default"]);
highlight_js_lib_core__WEBPACK_IMPORTED_MODULE_2__["default"].registerLanguage("sql", highlight_js_lib_languages_sql__WEBPACK_IMPORTED_MODULE_6__["default"]);
highlight_js_lib_core__WEBPACK_IMPORTED_MODULE_2__["default"].registerLanguage("java", highlight_js_lib_languages_java__WEBPACK_IMPORTED_MODULE_5__["default"]);
highlight_js_lib_core__WEBPACK_IMPORTED_MODULE_2__["default"].registerLanguage("xml", highlight_js_lib_languages_xml__WEBPACK_IMPORTED_MODULE_7__["default"]);
highlight_js_lib_core__WEBPACK_IMPORTED_MODULE_2__["default"].registerLanguage("python", highlight_js_lib_languages_python__WEBPACK_IMPORTED_MODULE_4__["default"]);
class MicroParsonsElement extends HTMLElement {
    constructor() {
        super();
        this.logEvent = (eventContent) => {
            const ev = new CustomEvent("micro-parsons", {
                bubbles: true,
                detail: Object.assign({}, eventContent),
            });
            this.dispatchEvent(ev);
        };
        MicroParsonsElement.toolCount += 1;
        this.toolNumber = MicroParsonsElement.toolCount;
        this.root = this;
        const reusable = this.getAttribute("reuse") ? true : false;
        const randomize = this.getAttribute("randomize") ? true : false;
        this.hparsonsInput = new _ParsonsInput__WEBPACK_IMPORTED_MODULE_0__.ParsonsInput(this, reusable, randomize);
        // a div wrapping the input and the test case status
        // init regex input based on the input type
        this._parsonsData = new Array();
        this.parsonsExplanation = null;
        this.inputType = "parsons";
        // support all languages specified here, or "raw" for raw html.
        // for other languages or none, render text as-is.
        this.language = this.getAttribute("language") || "none";
        let languageMap = new Map(Object.entries({
            html: "xml",
            python: "python",
            javascript: "javascript",
            java: "java",
            sql: "sql",
        }));
        this.hljsLanguage = languageMap.get(this.language);
        this.initInput();
        this.temporaryInputEvent = null;
        this.codeBefore = null;
        this.codeAfter = null;
    }
    set parsonsData(data) {
        this._parsonsData = data;
        if (this.inputType == "parsons") {
            this.hparsonsInput.setSourceBlocks(data, this.parsonsExplanation);
        }
    }
    get parsonsData() {
        return this._parsonsData;
    }
    initInput() {
        // the only mode supporting is parsons right now; removed the text entry mode
        this.inputType = "parsons";
        this._parsonsData = new Array();
        this.parsonsExplanation = null;
        const reusable = this.getAttribute("reuse") != null ? true : false;
        const randomize = this.getAttribute("randomize") != null ? true : false;
        this.hparsonsInput = new _ParsonsInput__WEBPACK_IMPORTED_MODULE_0__.ParsonsInput(this, reusable, randomize);
        this.root.appendChild(this.hparsonsInput.el);
    }
    resetInput() {
        this.hparsonsInput.resetInput();
        const resetEvent = {
            type: "reset",
        };
        this.logEvent(resetEvent);
    }
    // restore student answer from outside storage
    restoreAnswer(answer) {
        this.hparsonsInput.restoreAnswer(answer);
    }
    restoreAnswerByIndices(indices) {
        this.hparsonsInput.restoreAnswerByIndices(indices);
    }
    getCurrentInput(addSpace) {
        return this.hparsonsInput.getText(addSpace);
    }
    getParsonsTextArray() {
        return this.hparsonsInput._getTextArray();
    }
    getBlockIndices() {
        return this.hparsonsInput.getBlockIndices();
    }
    refreshBlockAria() {
        this.hparsonsInput.refreshBlockAria();
    }
    setCodeContext(props) {
        if (props.before) {
            this.codeBefore = props.before;
            let container;
            if (this.querySelector(".context.before")) {
                container = this.querySelector(".context.before");
            }
            else {
                container = document.createElement("pre");
                container.className = "context before";
                this.querySelector(".hparsons-input").insertBefore(container, this.querySelector(".drop-area"));
            }
            container.innerHTML = this.codeBefore;
            if (this.hljsLanguage) {
                container.className = "context before";
                container.classList.add(this.hljsLanguage);
                highlight_js_lib_core__WEBPACK_IMPORTED_MODULE_2__["default"].highlightElement(container);
            }
        }
        if (props.after) {
            this.codeAfter = props.after;
            let container;
            if (this.querySelector(".context.after")) {
                container = this.querySelector(".context.after");
            }
            else {
                container = document.createElement("pre");
                container.className = "context after";
                this.querySelector(".hparsons-input").appendChild(container);
            }
            container.innerHTML = this.codeAfter;
            if (this.hljsLanguage) {
                container.className = "context after";
                container.classList.add(this.hljsLanguage);
                highlight_js_lib_core__WEBPACK_IMPORTED_MODULE_2__["default"].highlightElement(container);
            }
        }
    }
}
MicroParsonsElement.toolCount = 0;
const InitMicroParsons = (props) => {
    let parentElem;
    try {
        parentElem = document.querySelector(props.selector);
    }
    catch (_a) {
        throw "micro-parsons: init: selector error";
    }
    if (parentElem == null || parentElem.tagName != "DIV") {
        throw "micro-parsons: element not a div";
    }
    const language = ["javascript", "sql", "java", "html", "python", "raw"].indexOf(props.language || "") == -1
        ? ""
        : `language='${props.language}'`;
    const id = props.id ? `id='${props.id}'` : "";
    const innerHTML = `<micro-parsons ${props.reuse ? "reuse" : ""} ${props.randomize === false ? "" : "randomize"} ${language} ${id}></micro-parsons>`;
    parentElem.innerHTML = innerHTML;
    const mParsons = parentElem.firstChild;
    mParsons.parsonsExplanation = props.parsonsTooltips;
    mParsons.parsonsData = props.parsonsBlocks;
    if (props.context) {
        mParsons.setCodeContext(props.context);
    }
};
customElements.define("micro-parsons", MicroParsonsElement);


/***/ }),

/***/ 31278:
/*!************************************************!*\
  !*** ./runestone/hparsons/js/BlockFeedback.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ BlockFeedback)
/* harmony export */ });
/* harmony import */ var _hparsonsFeedback__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./hparsonsFeedback */ 76759);
/* harmony import */ var _common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../common/js/rsi18n.js */ 54250);
/* harmony import */ var _blockGrader_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./blockGrader.js */ 63618);
/* harmony import */ var _parsons_js_parsons_i18n_en_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../parsons/js/parsons-i18n.en.js */ 75794);
/* harmony import */ var _parsons_js_parsons_i18n_pt_br_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../parsons/js/parsons-i18n.pt-br.js */ 56906);
/* harmony import */ var _parsons_js_parsons_i18n_sr_Cyrl_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../parsons/js/parsons-i18n.sr-Cyrl.js */ 29119);







class BlockFeedback extends _hparsonsFeedback__WEBPACK_IMPORTED_MODULE_0__["default"] {
    createOutput() {
        // Block based grading output
        this.messageDiv = document.createElement("div");
        this.feedbackLiveRegion = document.createElement("div");
        this.feedbackLiveRegion.setAttribute("role", "status");
        this.feedbackLiveRegion.setAttribute("aria-live", "polite");
        this.feedbackLiveRegion.setAttribute("aria-atomic", "true");
        this.feedbackLiveRegion.classList.add("visuallyhidden");
        this.hparsons.outerDiv.appendChild(this.messageDiv);
        this.hparsons.outerDiv.appendChild(this.feedbackLiveRegion);
    }

    customizeUI() {
        this.hparsons.runButton.textContent = (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_1__.t)("msg_hparsons_check_me");
    }

    init() {
        this.checkCount = 0;
        this.solved = false;
        // TODO: not sure what is the best way to do this
        this.grader = new _blockGrader_js__WEBPACK_IMPORTED_MODULE_2__["default"]();
        // Grade on block *content*, not on block index. Two blocks holding the
        // same text are interchangeable, so a solution that uses the same text
        // twice (issue #1194: a query with two "=" blocks) must accept either
        // one in either position. Content is read from the authored source
        // blocks rather than from the DOM so that math blocks -- whose rendered
        // text MathJax rewrites -- still compare correctly.
        this.solution = this.hparsons.blockAnswer.map((index) =>
            this.blockContent(index),
        );
        this.grader.solution = this.solution;
        this.answerArea =
            this.hparsons.hparsonsInput.querySelector(".drop-area");
    }

    // The authored source text for a block index. An index with no source block
    // gets a sentinel that can never match a solution block.
    blockContent(index) {
        const blocks = this.hparsons.originalBlocks || [];
        const content = blocks[Number(index)];
        return content === undefined ? `\u0000unknown-block-${index}` : content;
    }

    // The contents of the blocks currently in the answer area, in order.
    currentAnswerContent() {
        return this.hparsons.hparsonsInput
            .getBlockIndices()
            .map((index) => this.blockContent(index));
    }

    // Called when check button clicked (block-based Feedback)
    async runButtonHandler() {
        this.checkCurrentAnswer();
        this.logCurrentAnswer();
        this.renderFeedback();
    }

    async logCurrentAnswer() {
        let act = {
            scheme: "block",
            correct: this.grader.graderState == "correct" ? "T" : "F",
            answer: this.hparsons.hparsonsInput.getBlockIndices(),
            percent: this.grader.percent,
        };
        let logData = {
            event: "hparsonsAnswer",
            div_id: this.hparsons.divid,
            act: JSON.stringify(act),
            answer: JSON.stringify({ blocks: act.answer }),
            percent: this.grader.percent,
            correct: act.correct,
        };
        await this.hparsons.logBookEvent(logData);
    }

    // Used for block-based feedback
    checkCurrentAnswer() {
        if (!this.solved) {
            this.checkCount++;
            this.clearFeedback();
            this.grader.answer = this.currentAnswerContent();
            this.grade = this.grader.grade();
            if (this.grade == "correct") {
                this.hparsons.runButton.disabled = true;
                this.solved = true;
            }
        }
    }

    renderFeedback() {
        this.grade = this.grader.graderState;
        var feedbackArea;
        var answerArea = this.answerArea;
        feedbackArea = this.messageDiv;

        if (this.grade === "correct") {
            answerArea.classList.add("correct");
            feedbackArea.style.display = "";
            feedbackArea.className = "hp_feedback alert alert-info";
            if (this.checkCount > 1) {
                feedbackArea.innerHTML = (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_1__.t)(
                    "msg_parson_correct",
                    this.checkCount,
                );
            } else {
                feedbackArea.innerHTML = (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_1__.t)("msg_parson_correct_first_try");
            }
            this.checkCount = 0;
        }

        if (this.grade === "incorrectTooShort") {
            // too little code
            answerArea.classList.add("incorrect");
            feedbackArea.style.display = "";
            feedbackArea.className = "hp_feedback alert alert-danger";
            feedbackArea.innerHTML = (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_1__.t)("msg_parson_too_short");
        }

        if (this.grade === "incorrectMoveBlocks") {
            var answerBlocks = this.answerArea.children;
            var inSolution = [];
            var inSolutionIndexes = [];
            var notInSolution = [];
            // Match each answer block to a solution position by content, not by
            // block index, so interchangeable blocks are not flagged. Each
            // solution position is claimed at most once, leftmost first, so
            // repeated content lines up in order.
            var claimed = new Set();
            for (let i = 0; i < answerBlocks.length; i++) {
                var block = answerBlocks[i];
                var content = this.blockContent(block.dataset.index);
                var index = -1;
                for (let j = 0; j < this.solution.length; j++) {
                    if (!claimed.has(j) && this.solution[j] === content) {
                        index = j;
                        claimed.add(j);
                        break;
                    }
                }
                if (index == -1) {
                    notInSolution.push(block);
                } else {
                    inSolution.push(block);
                    inSolutionIndexes.push(index);
                }
            }
            var lisIndexes = this.grader.inverseLISIndices(inSolutionIndexes);
            for (let i = 0; i < lisIndexes.length; i++) {
                notInSolution.push(inSolution[lisIndexes[i]]);
            }
            answerArea.classList.add("incorrect");
            feedbackArea.style.display = "";
            feedbackArea.className = "alert alert-danger";
            for (let i = 0; i < notInSolution.length; i++) {
                notInSolution[i].classList.add("incorrectPosition");
            }
            feedbackArea.innerHTML = (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_1__.t)("msg_parson_wrong_order");
        }
        this.announceFeedback();
        this.hparsons.hparsonsInput.refreshBlockAria();
    }

    announceFeedback(message = this.messageDiv.textContent.trim()) {
        if (this.feedbackAnnouncementTimeout) {
            clearTimeout(this.feedbackAnnouncementTimeout);
        }
        this.feedbackLiveRegion.textContent = "";
        this.feedbackAnnouncementTimeout = setTimeout(() => {
            this.feedbackLiveRegion.textContent = message;
            this.feedbackAnnouncementTimeout = null;
        }, 10);
    }

    // Feedback UI for Block-based Feedback
    clearFeedback() {
        this.answerArea.classList.remove("incorrect", "correct");
        var children = this.answerArea.childNodes;
        for (var i = 0; i < children.length; i++) {
            children[i].classList.remove(
                "correctPosition",
                "incorrectPosition",
            );
        }
        this.messageDiv.style.display = "none";
        if (this.feedbackAnnouncementTimeout) {
            clearTimeout(this.feedbackAnnouncementTimeout);
            this.feedbackAnnouncementTimeout = null;
        }
        this.feedbackLiveRegion.textContent = "";
        this.hparsons.hparsonsInput.refreshBlockAria();
    }

    reset() {
        if (this.solved) {
            this.checkCount = 0;
            this.hparsons.runButton.disabled = false;
            this.solved = false;
        }
        this.clearFeedback();
        this.announceFeedback((0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_1__.t)("msg_hparsons_blocks_reset"));
    }
}


/***/ }),

/***/ 39234:
/*!**********************!*\
  !*** path (ignored) ***!
  \**********************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ 39258:
/*!*************************************************************!*\
  !*** ./runestone/hparsons/js/micro-parsons/ParsonsInput.ts ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ParsonsInput: () => (/* binding */ ParsonsInput)
/* harmony export */ });
/* harmony import */ var sortablejs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! sortablejs */ 10246);
/* harmony import */ var _LoggingEvents__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./LoggingEvents */ 75410);
/* harmony import */ var highlight_js_lib_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! highlight.js/lib/core */ 50011);
/* harmony import */ var _common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../common/js/rsi18n.js */ 54250);
/* harmony import */ var _common_js_mathjax_a11y_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../common/js/mathjax-a11y.js */ 47937);





class ParsonsInput {
    constructor(parentElement, reusable, randomize) {
        this.getText = (addSpace) => {
            let ret = "";
            if (this._dropArea.hasChildNodes()) {
                let el = this._dropArea.firstChild;
                ret += this._getTextFromBlock(el);
                while (el.nextSibling) {
                    el = el.nextSibling;
                    ret += addSpace ? " " : "";
                    ret += this._getTextFromBlock(el);
                }
                return ret;
            }
            else {
                return ret;
            }
        };
        this.getBlockIndices = () => {
            const blocks = this._dropArea.querySelectorAll(".parsons-block");
            return Array.from(blocks).map((block) => parseInt(block.dataset.index || "-1"));
        };
        // getting the code from one block, and ignore tooltip text
        this._getTextFromBlock = (block) => {
            var _a;
            if (this.parentElement.language == "raw") {
                return block.innerHTML;
            }
            if (!block.lastChild || block.lastChild.nodeType != Node.ELEMENT_NODE) {
                return block.textContent || "";
            }
            const tooltipLength = block.lastChild.classList.contains("parsons-tooltip")
                ? ((_a = block.lastChild.textContent) === null || _a === void 0 ? void 0 : _a.length) || 0
                : 0;
            if (tooltipLength > 0) {
                return (block.textContent || "").slice(0, -tooltipLength);
            }
            return block.textContent || "";
        };
        this._getAccessibleBlockText = (block) => {
            const accessibleBlock = block.cloneNode(true);
            accessibleBlock
                .querySelectorAll(".parsons-tooltip")
                .forEach((tooltip) => tooltip.remove());
            return (0,_common_js_mathjax_a11y_js__WEBPACK_IMPORTED_MODULE_4__.getAccessibleElementText)(accessibleBlock);
        };
        this.setSourceBlocks = (data, tooltips) => {
            this.blockOrder = [];
            for (let i = 0; i < data.length; ++i) {
                this.blockOrder.push(i);
            }
            // shuffle source blocks if randomize
            if (this.randomize) {
                let originalOrder = JSON.stringify(this.blockOrder);
                this.shuffleArray(this.blockOrder);
                while (JSON.stringify(this.blockOrder) == originalOrder) {
                    this.shuffleArray(this.blockOrder);
                }
            }
            this.storedSourceBlocks = data;
            this.storedSourceBlockExplanations = tooltips;
            this._resetInput();
        };
        // TODO: not efficient enough. should not need to create new elements; simply sorting them should be good.
        this._resetInput = () => {
            // clearing previous blocks
            while (this._dragArea.firstChild) {
                this._dragArea.removeChild(this._dragArea.firstChild);
            }
            while (this._dropArea.firstChild) {
                this._dropArea.removeChild(this._dropArea.firstChild);
            }
            // add new blocks
            for (let i = 0; i < this.blockOrder.length; ++i) {
                const newBlock = document.createElement("div");
                newBlock.dataset.index = this.blockOrder[i].toString();
                this._dragArea.appendChild(newBlock);
                if (this.storedSourceBlocks[this.blockOrder[i]] === " ") {
                    newBlock.innerHTML = "&nbsp;";
                }
                else {
                    if (this.parentElement.hljsLanguage) {
                        newBlock.innerHTML = highlight_js_lib_core__WEBPACK_IMPORTED_MODULE_2__["default"].highlight(this.storedSourceBlocks[this.blockOrder[i]], { language: this.parentElement.hljsLanguage, ignoreIllegals: true }).value;
                    }
                    else if (this.parentElement.language == "raw") {
                        newBlock.innerHTML = this.storedSourceBlocks[this.blockOrder[i]];
                    }
                    else {
                        newBlock.innerText = this.storedSourceBlocks[this.blockOrder[i]];
                    }
                }
                newBlock.style.display = "inline-block";
                newBlock.classList.add("parsons-block");
                newBlock.onclick = (ev) => {
                    this._onBlockClicked(newBlock, ev);
                };
                // creating tooltip
                if (this.storedSourceBlockExplanations &&
                    this.storedSourceBlockExplanations[this.blockOrder[i]]) {
                    const tooltip = document.createElement("div");
                    tooltip.innerText =
                        this.storedSourceBlockExplanations[this.blockOrder[i]];
                    tooltip.classList.add("parsons-tooltip");
                    newBlock.appendChild(tooltip);
                }
            }
            this._updateBlockAria();
        };
        this._onBlockClicked = (block, ev) => {
            const blockText = this._getTextFromBlock(block).trim();
            let focusedBlock = block;
            if (block.parentElement == this._dragArea) {
                let endPosition;
                if (this.reusable) {
                    const blockCopy = block.cloneNode(true);
                    blockCopy.onclick = (ev) => this._onBlockClicked(blockCopy, ev);
                    this._dropArea.appendChild(blockCopy);
                    endPosition = this._getBlockPosition(blockCopy);
                    focusedBlock = blockCopy;
                }
                else {
                    this._dropArea.appendChild(block);
                    endPosition = this._getBlockPosition(block);
                }
                const inputEvent = {
                    type: "input",
                    action: _LoggingEvents__WEBPACK_IMPORTED_MODULE_1__.MicroParsonsEvent.InputAction.ADD,
                    position: [-1, endPosition],
                    answer: this._getTextArray(),
                };
                if (ev.isTrusted) {
                    // if false: could be triggered by restoreAnswer.
                    this.parentElement.logEvent(inputEvent);
                }
                this._updateBlockAria();
                this._refocusMovedBlock(focusedBlock);
                this._announce((0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_3__.t)("msg_hparsons_block_moved_to_answer", blockText));
            }
            else {
                const startPosition = this._getBlockPosition(block);
                if (this.reusable) {
                    this._dropArea.removeChild(block);
                }
                else {
                    this._dragArea.appendChild(block);
                }
                if (this.reusable) {
                    focusedBlock = this._allBlocks().find((sourceBlock) => sourceBlock.dataset.index === block.dataset.index);
                }
                const inputEvent = {
                    type: "input",
                    action: _LoggingEvents__WEBPACK_IMPORTED_MODULE_1__.MicroParsonsEvent.InputAction.REMOVE,
                    position: [startPosition, -1],
                    answer: this._getTextArray(),
                };
                this.parentElement.logEvent(inputEvent);
                this._updateBlockAria();
                this._refocusMovedBlock(focusedBlock);
                this._announce((0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_3__.t)("msg_hparsons_block_moved_to_available", blockText));
            }
        };
        this._initSortable = () => {
            if (this.reusable) {
                this._dragSortable = new sortablejs__WEBPACK_IMPORTED_MODULE_0__["default"](this._dragArea, {
                    group: {
                        name: "shared",
                        pull: "clone",
                        put: false,
                    },
                    sort: false,
                    direction: "horizontal",
                    animation: 150,
                    draggable: ".parsons-block",
                    onClone: (event) => {
                        const newBlock = event.clone;
                        newBlock.onclick = (ev) => this._onBlockClicked(newBlock, ev);
                    },
                });
                this._dropSortable = new sortablejs__WEBPACK_IMPORTED_MODULE_0__["default"](this._dropArea, {
                    group: "shared",
                    direction: "horizontal",
                    animation: 150,
                    draggable: ".parsons-block",
                    onAdd: (event) => {
                        const inputEvent = {
                            type: "input",
                            action: _LoggingEvents__WEBPACK_IMPORTED_MODULE_1__.MicroParsonsEvent.InputAction.ADD,
                            position: [-1, this._getBlockPosition(event.item)],
                            answer: this._getTextArray(),
                        };
                        this.parentElement.logEvent(inputEvent);
                        this._updateBlockAria();
                    },
                    onStart: (event) => {
                        this._prevPosition = this._getBlockPosition(event.item);
                    },
                    onEnd: (event) => {
                        let endposition;
                        let action = _LoggingEvents__WEBPACK_IMPORTED_MODULE_1__.MicroParsonsEvent.InputAction.MOVE;
                        const upperbound = this._dropArea.getBoundingClientRect().top;
                        const lowerbound = this._dropArea.getBoundingClientRect().bottom;
                        if (event.originalEvent.clientY > lowerbound ||
                            event.originalEvent.clientY < upperbound) {
                            const item = event.item;
                            if (item.parentNode) {
                                item.parentNode.removeChild(item);
                            }
                            endposition = -1;
                            action = _LoggingEvents__WEBPACK_IMPORTED_MODULE_1__.MicroParsonsEvent.InputAction.REMOVE;
                        }
                        else {
                            endposition = this._getBlockPosition(event.item);
                        }
                        const inputEvent = {
                            type: "input",
                            action: action,
                            position: [this._prevPosition, endposition],
                            answer: this._getTextArray(),
                        };
                        this.parentElement.logEvent(inputEvent);
                        this._updateBlockAria();
                    },
                });
            }
            else {
                this._dragSortable = new sortablejs__WEBPACK_IMPORTED_MODULE_0__["default"](this._dragArea, {
                    group: {
                        name: "shared",
                        // pull: 'clone',
                        // put: false
                    },
                    // sort: false,
                    direction: "horizontal",
                    animation: 150,
                    draggable: ".parsons-block",
                });
                this._dropSortable = new sortablejs__WEBPACK_IMPORTED_MODULE_0__["default"](this._dropArea, {
                    group: "shared",
                    direction: "horizontal",
                    animation: 150,
                    draggable: ".parsons-block",
                    onAdd: (event) => {
                        const inputEvent = {
                            type: "input",
                            action: _LoggingEvents__WEBPACK_IMPORTED_MODULE_1__.MicroParsonsEvent.InputAction.ADD,
                            position: [-1, this._getBlockPosition(event.item)],
                            answer: this._getTextArray(),
                        };
                        this.parentElement.logEvent(inputEvent);
                        this._updateBlockAria();
                    },
                    onStart: (event) => {
                        this._prevPosition = this._getBlockPosition(event.item);
                    },
                    onEnd: (event) => {
                        let endposition = this._getBlockPosition(event.item);
                        const action = endposition == -1
                            ? _LoggingEvents__WEBPACK_IMPORTED_MODULE_1__.MicroParsonsEvent.InputAction.REMOVE
                            : _LoggingEvents__WEBPACK_IMPORTED_MODULE_1__.MicroParsonsEvent.InputAction.MOVE;
                        const inputEvent = {
                            type: "input",
                            action: action,
                            position: [this._prevPosition, endposition],
                            answer: this._getTextArray(),
                        };
                        this.parentElement.logEvent(inputEvent);
                        this._updateBlockAria();
                    },
                });
            }
        };
        this.updateTestStatus = (result) => {
            if (this._dropArea.classList.contains(result)) {
                return;
            }
            if (this._dropArea.classList.contains("Pass")) {
                this._dropArea.classList.remove("Pass");
            }
            else if (this._dropArea.classList.contains("Fail")) {
                this._dropArea.classList.remove("Fail");
            }
            else if (this._dropArea.classList.contains("Error")) {
                this._dropArea.classList.remove("Error");
            }
            this._dropArea.classList.add(result);
        };
        // -----------------------------------------------------------------------
        // Accessibility helpers
        // -----------------------------------------------------------------------
        /** Sync block semantics while the combined keyboard surface owns focus. */
        this._updateBlockAria = () => {
            if (this._activeBlock && !this.el.contains(this._activeBlock)) {
                this._activeBlock = null;
            }
            const seenIds = new Set();
            const applyToArea = (area, areaName) => {
                const blocks = Array.from(area.querySelectorAll(".parsons-block"));
                blocks.forEach((block, i) => {
                    if (!block.id || seenIds.has(block.id)) {
                        this._nextBlockId += 1;
                        block.id = `${this.el.id}-block-${this._nextBlockId}`;
                    }
                    seenIds.add(block.id);
                    block.setAttribute("role", "option");
                    block.setAttribute("aria-label", `${this._getAccessibleBlockText(block)}, ${areaName}, item ${i + 1} of ${blocks.length}${block.classList.contains("incorrectPosition") ? ", incorrect" : ""}`);
                    block.setAttribute("aria-selected", String(block === this._activeBlock));
                    block.setAttribute("tabindex", "-1");
                });
            };
            applyToArea(this._dragArea, "available blocks");
            applyToArea(this._dropArea, "answer area");
        };
        this._allBlocks = () => [
            ...this._dragArea.querySelectorAll(".parsons-block"),
            ...this._dropArea.querySelectorAll(".parsons-block"),
        ];
        this.refreshBlockAria = () => {
            this._updateBlockAria();
        };
        this._getKeyboardBlockLocation = (block) => {
            const area = block.parentElement === this._dragArea
                ? this._dragArea
                : this._dropArea;
            const blocks = Array.from(area.querySelectorAll(".parsons-block"));
            const position = blocks.indexOf(block) + 1;
            return area === this._dragArea
                ? (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_3__.t)("msg_parson_keyboard_unplaced_position", position, blocks.length)
                : (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_3__.t)("msg_parson_keyboard_answer_position", position, blocks.length);
        };
        this._enterKeyboardNavigationMode = (block, includeInstructions = false) => {
            const label = [
                (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_3__.t)("msg_parson_keyboard_selected", this._getAccessibleBlockText(block)),
            ];
            if (block.classList.contains("incorrectPosition")) {
                label.push((0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_3__.t)("msg_parson_incorrect"));
            }
            label.push(this._getKeyboardBlockLocation(block));
            this._keyboardApplication.setAttribute("aria-label", includeInstructions
                ? `${(0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_3__.t)("msg_parson_keyboard_instructions")} ${label.join(". ")}`
                : label.join(". "));
            this._keyboardApplication.focus();
        };
        this._setActiveBlock = (block, includeInstructions = false) => {
            this._activeBlock = block;
            this._updateBlockAria();
            if (this._keyboardInputActive) {
                this._enterKeyboardNavigationMode(block, includeInstructions);
            }
        };
        /** Restore the keyboard surface after a pointer click moves a block. */
        this._refocusMovedBlock = (block) => {
            if (!this._keyboardInputActive)
                return;
            this._setActiveBlock(block);
        };
        this._enterKeyboardMovement = () => {
            const blocks = this._allBlocks();
            if (blocks.length === 0)
                return;
            this._keyboardInputActive = true;
            this._hideKeyboardEntryHint();
            this._keyboardInstructions.textContent =
                (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_3__.t)("msg_hparsons_keyboard_instructions");
            this._setActiveBlock(blocks[0], true);
            this._announce((0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_3__.t)("msg_hparsons_moving", this._getAccessibleBlockText(blocks[0])));
        };
        this._exitKeyboardMovement = (returnFocusToEntry = false) => {
            this._keyboardInputActive = false;
            this._activeBlock = null;
            this._keyboardApplication.removeAttribute("aria-label");
            this.el.setAttribute("aria-label", (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_3__.t)("msg_parson_keyboard_entry_label"));
            this._keyboardInstructions.textContent =
                (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_3__.t)("msg_hparsons_keyboard_idle_instructions");
            this._updateBlockAria();
            this._announce((0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_3__.t)("msg_hparsons_keyboard_finished"));
            if (returnFocusToEntry) {
                this.el.focus();
            }
        };
        this._moveActiveBlock = (ev) => {
            const block = this._activeBlock;
            if (!block)
                return;
            const wasInDragArea = block.parentElement === this._dragArea;
            this._onBlockClicked(block, ev);
            const movedBlock = wasInDragArea && this.reusable
                ? this._dropArea.lastElementChild
                : block;
            this._setActiveBlock(movedBlock);
        };
        /** Announce a message to screen readers via the live region. */
        this._announce = (message) => {
            // Clear first so repeated identical messages still trigger re-announcement
            this._liveRegion.textContent = "";
            setTimeout(() => {
                this._liveRegion.textContent = message;
            }, 10);
        };
        /** Use one Tab stop for both block areas and scope arrows to movement mode. */
        this._setupKeyboardNav = () => {
            this.el.addEventListener("focus", () => {
                if (!this._keyboardInputActive &&
                    this.el.matches(":focus-visible")) {
                    this._showKeyboardEntryHint();
                }
            });
            this.el.addEventListener("blur", (ev) => {
                if (this._keyboardInputActive &&
                    ev.relatedTarget !== this._keyboardApplication) {
                    this._exitKeyboardMovement();
                }
                else if (!this._keyboardInputActive) {
                    this._hideKeyboardEntryHint();
                }
            });
            this.el.addEventListener("click", (ev) => {
                if (ev.target === this.el &&
                    !this._keyboardInputActive) {
                    this._enterKeyboardMovement();
                }
            });
            this.el.addEventListener("keydown", (ev) => {
                if (!this._keyboardInputActive) {
                    if (ev.target !== this.el)
                        return;
                    if (ev.key === "Enter" || ev.key === " ") {
                        ev.preventDefault();
                        this._enterKeyboardMovement();
                    }
                    return;
                }
                if (!this.el.contains(ev.target))
                    return;
                if (ev.key === "Escape") {
                    ev.preventDefault();
                    this._exitKeyboardMovement(true);
                    return;
                }
                if (ev.key === "Tab") {
                    this._exitKeyboardMovement();
                    return;
                }
                const activeBlock = this._activeBlock;
                if (!activeBlock) {
                    const blocks = this._allBlocks();
                    if (blocks.length === 0) {
                        this._exitKeyboardMovement();
                        return;
                    }
                    this._setActiveBlock(blocks[0]);
                    return;
                }
                const currentArea = activeBlock.parentElement === this._dragArea
                    ? this._dragArea
                    : this._dropArea;
                const otherArea = currentArea === this._dragArea ? this._dropArea : this._dragArea;
                const currentBlocks = Array.from(currentArea.querySelectorAll(".parsons-block"));
                const index = currentBlocks.indexOf(activeBlock);
                if (ev.key === "ArrowRight") {
                    ev.preventDefault();
                    if (index < currentBlocks.length - 1)
                        this._setActiveBlock(currentBlocks[index + 1]);
                }
                else if (ev.key === "ArrowLeft") {
                    ev.preventDefault();
                    if (index > 0)
                        this._setActiveBlock(currentBlocks[index - 1]);
                }
                else if (ev.key === "ArrowUp" || ev.key === "ArrowDown") {
                    ev.preventDefault();
                    const otherBlocks = Array.from(otherArea.querySelectorAll(".parsons-block"));
                    if (otherBlocks.length > 0) {
                        this._setActiveBlock(otherBlocks[Math.min(index, otherBlocks.length - 1)]);
                    }
                }
                else if (ev.key === "Enter" || ev.key === " ") {
                    ev.preventDefault();
                    this._moveActiveBlock(ev);
                }
            });
        };
        this._showKeyboardEntryHint = () => {
            this._keyboardEntryHint.textContent = (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_3__.t)("msg_parson_enter_activate");
            this._keyboardEntryHint.style.display = "";
            this._keyboardEntryHint.classList.remove("parsons-entry-hint");
            void this._keyboardEntryHint.offsetWidth;
            this._keyboardEntryHint.classList.add("parsons-entry-hint");
        };
        this._hideKeyboardEntryHint = () => {
            this._keyboardEntryHint.style.display = "none";
            this._keyboardEntryHint.classList.remove("parsons-entry-hint");
        };
        this._getBlockPosition = (block) => {
            let position = -1;
            const parent = this._dropArea;
            if (parent) {
                for (position = 0; position < parent.childNodes.length; ++position) {
                    if (parent.childNodes[position] === block) {
                        break;
                    }
                }
            }
            return position;
        };
        this._getTextArray = () => {
            let answer = [];
            if (this._dropArea.hasChildNodes()) {
                let el = this._dropArea.firstChild;
                answer.push(this._getTextFromBlock(el));
                while (el.nextSibling) {
                    el = el.nextSibling;
                    answer.push(this._getTextFromBlock(el));
                }
            }
            return answer;
        };
        this.removeFormat = () => {
            if (this._dropArea.hasChildNodes()) {
                let el = this._dropArea.firstChild;
                el.style.removeProperty("background-color");
                while (el.nextSibling) {
                    el = el.nextSibling;
                    el.style.removeProperty("background-color");
                }
            }
        };
        this.resetInput = () => {
            if (this.reusable) {
                while (this._dropArea.firstChild) {
                    this._dropArea.removeChild(this._dropArea.firstChild);
                }
                this._updateBlockAria();
            }
            else {
                this._resetInput(); // _resetInput already calls _updateBlockAria
            }
        };
        this.el = document.createElement("div");
        this.el.classList.add("hparsons-input");
        this.parentElement = parentElement;
        this.el.id =
            "hparsonstool-" + this.parentElement.toolNumber + "-parsons-input";
        this._keyboardEntryHint = document.createElement("div");
        this._keyboardEntryHint.setAttribute("role", "tooltip");
        this._keyboardEntryHint.classList.add("hparsons-tip");
        this._keyboardEntryHint.style.display = "none";
        this.el.appendChild(this._keyboardEntryHint);
        const dragTip = document.createElement("div");
        dragTip.innerText = (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_3__.t)("msg_hparsons_drag_blocks_code");
        dragTip.classList.add("hparsons-drag-tip");
        dragTip.classList.add("hparsons-tip");
        this.el.append(dragTip);
        this._dragArea = document.createElement("div");
        this.el.appendChild(this._dragArea);
        this._dragArea.classList.add("drag-area");
        this._dragArea.setAttribute("role", "listbox");
        this._dragArea.setAttribute("aria-label", (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_3__.t)("msg_hparsons_available_blocks"));
        const dropTip = document.createElement("div");
        dropTip.innerText = (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_3__.t)("msg_hparsons_drop_blocks_code");
        dropTip.classList.add("hparsons-drop-tip");
        dropTip.classList.add("hparsons-tip");
        this.el.append(dropTip);
        this._dropArea = document.createElement("div");
        this.el.appendChild(this._dropArea);
        this._dropArea.classList.add("drop-area");
        this._dropArea.setAttribute("role", "listbox");
        this._dropArea.setAttribute("aria-label", (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_3__.t)("msg_hparsons_answer_area"));
        this._prevPosition = -1;
        // Visually-hidden live region for screen-reader announcements
        this._liveRegion = document.createElement("div");
        this._liveRegion.setAttribute("aria-live", "polite");
        this._liveRegion.setAttribute("aria-atomic", "true");
        this._liveRegion.classList.add("visuallyhidden");
        this.el.appendChild(this._liveRegion);
        this._activeBlock = null;
        this._keyboardInputActive = false;
        this._nextBlockId = 0;
        this._keyboardInstructions = document.createElement("span");
        this._keyboardInstructions.id = `${this.el.id}-keyboard-instructions`;
        this._keyboardInstructions.classList.add("visuallyhidden");
        this._keyboardInstructions.textContent =
            (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_3__.t)("msg_hparsons_keyboard_idle_instructions");
        this.el.appendChild(this._keyboardInstructions);
        this._keyboardApplication = document.createElement("div");
        this._keyboardApplication.classList.add("hparsons-keyboard-application");
        this._keyboardApplication.setAttribute("role", "application");
        this._keyboardApplication.tabIndex = -1;
        this._keyboardApplication.addEventListener("blur", () => {
            if (this._keyboardInputActive) {
                this._exitKeyboardMovement();
            }
        });
        this.el.appendChild(this._keyboardApplication);
        this.el.tabIndex = 0;
        this.el.setAttribute("role", "button");
        this.el.setAttribute("aria-label", (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_3__.t)("msg_parson_keyboard_entry_label"));
        this.el.setAttribute("aria-describedby", this._keyboardInstructions.id);
        this.storedSourceBlocks = [];
        this.blockOrder = [];
        this.storedSourceBlockExplanations = null;
        this.reusable = reusable;
        this.randomize = randomize;
        this._dragSortable = null;
        this._dropSortable = null;
        this._initSortable();
        this._setupKeyboardNav();
        this.initialized = false;
    }
    // Durstenfeld shuffle
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }
    restoreAnswer(answer) {
        this.resetInput();
        const space = /^\s+$/;
        for (let i = 0; i < answer.length; ++i) {
            let isAnswerSpace = space.test(answer[i]);
            if (this._dragArea.hasChildNodes()) {
                let el = this._dragArea.firstChild;
                while (el) {
                    if (isAnswerSpace) {
                        // current answer block is a list of space
                        if (space.test(this._getTextFromBlock(el)) &&
                            answer[i].length == this._getTextFromBlock(el).length) {
                            el.click();
                            break;
                        }
                    }
                    else if (this._getTextFromBlock(el) == answer[i]) {
                        // found the block
                        el.click();
                        break;
                    }
                    el = el.nextSibling;
                }
            }
        }
        const restoreEvent = {
            type: "restore",
            answer: answer,
        };
        this.parentElement.logEvent(restoreEvent);
    }
    restoreAnswerByIndices(indices) {
        this.resetInput();
        for (let i = 0; i < indices.length; ++i) {
            const target = String(indices[i]);
            if (this._dragArea.hasChildNodes()) {
                let el = this._dragArea.firstChild;
                while (el) {
                    if (el.dataset.index === target) {
                        el.click(); // preserve reusable/nonreusable behavior
                        break;
                    }
                    el = el.nextSibling;
                }
            }
        }
        // Keep logging type-compatible without touching LoggingEvents in this PR:
        const restoreEvent = {
            type: "restore",
            // store as strings to satisfy Array<string> type
            answer: indices.map(String),
        };
        this.parentElement.logEvent(restoreEvent);
    }
}


/***/ }),

/***/ 46490:
/*!********************!*\
  !*** fs (ignored) ***!
  \********************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ 47272:
/*!*******************************************!*\
  !*** ./runestone/hparsons/js/hparsons.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ HParsons),
/* harmony export */   hpList: () => (/* binding */ hpList)
/* harmony export */ });
/* harmony import */ var _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/runestonebase.js */ 78673);
/* harmony import */ var _common_js_mathjax_a11y_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../common/js/mathjax-a11y.js */ 47937);
/* harmony import */ var _common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../common/js/rsi18n.js */ 54250);
/* harmony import */ var _hparsons_i18n_en_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./hparsons-i18n.en.js */ 67892);
/* harmony import */ var _hparsons_i18n_pt_br_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./hparsons-i18n.pt-br.js */ 3636);
/* harmony import */ var _hparsons_i18n_sr_Cyrl_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./hparsons-i18n.sr-Cyrl.js */ 90777);
/* harmony import */ var _css_hljs_xcode_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../css/hljs-xcode.css */ 2094);
/* harmony import */ var _BlockFeedback_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./BlockFeedback.js */ 31278);
/* harmony import */ var _SQLFeedback_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./SQLFeedback.js */ 2759);
/* harmony import */ var _micro_parsons_micro_parsons__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./micro-parsons/micro-parsons */ 25833);
/* harmony import */ var _css_hparsons_css__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../css/hparsons.css */ 10245);










// The micro-parsons element source now lives alongside hparsons in ./micro-parsons.
// It is compiled directly by the interactives webpack/ts-loader build (no separate
// repo or npm tarball). micro-parsons.ts imports its own style/style.css.

// last to override micro-parsons css if needed


var hpList;
// Dictionary that contains all instances of horizontal Parsons problem objects
if (hpList === undefined) hpList = {};

class HParsons extends _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(opts) {
        super(opts);
        // getting settings
        var orig = opts.orig.querySelector("textarea");
        this.reuse = this.parseBooleanAttribute(orig, "data-reuse");
        this.randomize = this.parseBooleanAttribute(orig, "data-randomize");
        this.isBlockGrading = this.parseBooleanAttribute(
            orig,
            "data-blockanswer",
        );
        this.language = orig.getAttribute("data-language");
        // Detect math mode
        if (
            this.language == null &&
            orig.textContent.includes('span class="process-math"')
        ) {
            this.language = "math";
        }
        if (this.isBlockGrading) {
            // Extra whitespace in the attribute would otherwise produce empty
            // tokens, which Number() turns into a spurious block 0.
            this.blockAnswer = orig
                .getAttribute("data-blockanswer")
                .trim()
                .split(/\s+/);
        }
        this.divid = opts.orig.id;
        this.containerDiv = opts.orig;
        this.useRunestoneServices = opts.useRunestoneServices;

        // Set the storageId (key for storing data)
        var storageId = super.localStorageKey();
        this.storageId = storageId;

        this.origElem = orig;
        let statementElem = opts.orig.querySelector(".hp_question");
        if (statementElem) statementElem.classList.add("exercise-statement");
        this.origText = this.origElem.textContent;
        this.code = orig.textContent || "\n\n\n\n\n";
        this.dburl = orig.getAttribute("data-dburl");
        this.runButton = null;
        this.saveButton = null;
        this.loadButton = null;
        this.outerDiv = null;
        this.controlDiv = null;
        this.processContent(this.code);

        // Change to factory when more execution based feedback is included
        if (this.isBlockGrading) {
            this.feedbackController = new _BlockFeedback_js__WEBPACK_IMPORTED_MODULE_7__["default"](this);
        } else {
            this.feedbackController = new _SQLFeedback_js__WEBPACK_IMPORTED_MODULE_8__["default"](this);
        }

        // creating UI components
        this.createEditor();
        this.createControls();
        this.createOutput();
        this.feedbackController.customizeUI();

        if (orig.getAttribute("data-caption")) {
            this.caption = orig.getAttribute("data-caption");
        } else {
            this.caption = "MicroParsons";
        }
        this.addCaption("runestone");
        this.indicate_component_ready();

        // initializing functionalities for different feedback
        this.feedbackController.init();
        this.checkServer("hparsonsAnswer", true);
    }

    processContent(code) {
        // todo: add errors when blocks are nonexistent (maybe in python)?
        this.hiddenPrefix = this.processSingleContent(code, "--hiddenprefix--");
        this.originalBlocks = this.processSingleContent(code, "--blocks--")
            .split("\n")
            .slice(1, -1);
        this.hiddenSuffix = this.processSingleContent(code, "--hiddensuffix--");
        this.unittest = this.processSingleContent(code, "--unittest--");
    }

    processSingleContent(code, delimiter) {
        let index = code.indexOf(delimiter);
        if (index > -1) {
            let content = code.substring(index + delimiter.length);
            let endIndex = content.indexOf("\n--");
            content =
                endIndex > -1 ? content.substring(0, endIndex + 1) : content;
            return content;
        }
        return undefined;
    }

    // copied from activecode, already modified to add parsons
    createEditor() {
        this.outerDiv = document.createElement("div");
        this.origElem.replaceWith(this.outerDiv);
        this.outerDiv.id = `${this.divid}-container`;
        this.outerDiv.addEventListener("micro-parsons", (ev) => {
            const eventListRunestone = ["input", "reset"];
            if (eventListRunestone.includes(ev.detail.type)) {
                // only log the events in the event list
                this.logHorizontalParsonsEvent(ev.detail);
                // when event is input or reset: clear previous feedback
                this.feedbackController.clearFeedback();
            }
        });
        const props = {
            selector: `#${this.divid}-container`,
            id: `${this.divid}-hparsons`,
            reuse: this.reuse,
            randomize: this.randomize,
            parsonsBlocks: [...this.originalBlocks],
            language: this.language,
        };
        (0,_micro_parsons_micro_parsons__WEBPACK_IMPORTED_MODULE_9__.InitMicroParsons)(props);
        this.hparsonsInput = this.outerDiv.querySelector("micro-parsons");
        this.renderMathInBlocks();
        // Change "code" to "answer" in parsons direction for non-code languages
        if (this.language == null || this.language === "math") {
            this.outerDiv.querySelector(".hparsons-drag-tip").textContent = (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_2__.t)(
                "msg_hparsons_drag_blocks_answer",
            );
            this.outerDiv.querySelector(".hparsons-drop-tip").textContent = (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_2__.t)(
                "msg_hparsons_drop_blocks_answer",
            );
        }
    }

    createOutput() {
        this.feedbackController.createOutput();
    }

    createControls() {
        var ctrlDiv = document.createElement("div");
        ctrlDiv.classList.add("hp_actions");

        // Run Button
        this.runButton = document.createElement("button");
        this.runButton.classList.add("btn", "btn-success", "run-button");
        ctrlDiv.appendChild(this.runButton);
        this.runButton.setAttribute("type", "button");
        this.runButton.textContent = (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_2__.t)("msg_hparsons_run");
        var that = this;
        this.runButton.onclick = () => {
            that.feedbackController.runButtonHandler();
            that.setLocalStorage();
        };

        // Reset button
        var resetBtn;
        resetBtn = document.createElement("button");
        resetBtn.textContent = (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_2__.t)("msg_parson_reset");
        resetBtn.classList.add("btn", "btn-warning", "run-button");
        ctrlDiv.appendChild(resetBtn);
        this.resetButton = resetBtn;
        this.resetButton.onclick = () => {
            that.hparsonsInput.resetInput();
            that.setLocalStorage();
            that.feedbackController.reset();
            that.renderMathInBlocks();
        };
        resetBtn.setAttribute("type", "button");

        this.outerDiv.appendChild(ctrlDiv);
        this.controlDiv = ctrlDiv;
    }

    // Decodes escaped HTML entities (like &lt;) into raw characters
    decodeHTMLEntities(str) {
        const textarea = document.createElement("textarea");
        textarea.innerHTML = str;
        return textarea.value;
    }

    observeMathJaxTabStops() {
        if (this.mathTabStopObserver || typeof MutationObserver === "undefined") {
            return;
        }
        this.mathTabStopObserver = new MutationObserver((mutations) => {
            const needsCleanup = mutations.some(
                (mutation) =>
                    mutation.type === "childList" ||
                    mutation.target.getAttribute("tabindex") !== "-1",
            );
            if (needsCleanup) {
                (0,_common_js_mathjax_a11y_js__WEBPACK_IMPORTED_MODULE_1__.disableMathJaxTabStops)(this.hparsonsInput, [
                    ".parsons-block",
                ]);
            }
        });
        this.mathTabStopObserver.observe(this.hparsonsInput, {
            subtree: true,
            childList: true,
            attributes: true,
            attributeFilter: ["tabindex"],
        });
    }

    renderMathInBlocks() {
        if (this.language !== "math") return Promise.resolve();
        this.observeMathJaxTabStops();
        try {
            const blocks = this.hparsonsInput.querySelectorAll(
                ".parsons-block",
            );
            const renderPromises = Array.from(blocks, (block) => {
                // Decoding twice would turn an escaped "&lt;" into markup.
                if (!block.dataset.mathPrepared) {
                    block.dataset.mathPrepared = "true";
                    block.innerHTML = this.decodeHTMLEntities(block.innerHTML);
                    if (block.innerHTML.indexOf("process-math") !== -1) {
                        block.innerHTML = block.innerHTML.replace(
                            /<span class="process-math">|<\/span>/g,
                            "",
                        );
                    }
                }
                return this.queueMathJax(block);
            });
            return Promise.all(renderPromises).then(() => {
                (0,_common_js_mathjax_a11y_js__WEBPACK_IMPORTED_MODULE_1__.disableMathJaxTabStops)(this.hparsonsInput, [".parsons-block"]);
                this.hparsonsInput.refreshBlockAria();
            });
        } catch (error) {
            return Promise.reject(error);
        }
    }

    // Return previous answers in local storage
    //
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
        // TODO: not tested with server data yet.
        // Server side data should be:
        /*
            {
                answer: Array<string>, // list of answer block content
                count: ?number // number of previous attempts if block-based feedback
            }
        */
        if (serverData.answer) {
            const blocks = serverData.answer.blocks ?? serverData.answer;

            if (Array.isArray(blocks) && blocks.length > 0) {
                const first = blocks[0];

                // Prefer indices (numbers or numeric strings)
                const looksNumeric =
                    typeof first === "number" || /^\d+$/.test(String(first));
                if (looksNumeric && this.hparsonsInput.restoreAnswerByIndices) {
                    this.hparsonsInput.restoreAnswerByIndices(
                        blocks.map(Number),
                    );
                } else {
                    this.hparsonsInput.restoreAnswer(blocks);
                }
            }
        }
        if (serverData.count) {
            this.feedbackController.checkCount = serverData.count;
        }
        // Restoring rebuilds every block from its source, math markup and all.
        this.renderMathInBlocks();
    }

    // RunestoneBase: Load what is in local storage
    checkLocalStorage() {
        if (this.graderactive) {
            // Zihan: I think this means the component is still loading?
            return;
        }
        let localData = this.localData();
        // Guard against no timestamp as it was only added 3/24/2026
        if (
            localData.timestamp &&
            localData.timestamp < eBookConfig.termStartDate
        ) {
            localStorage.removeItem(this.storageId);
            return;
        }
        if (
            localData.answerIndices &&
            this.hparsonsInput.restoreAnswerByIndices
        ) {
            this.hparsonsInput.restoreAnswerByIndices(
                localData.answerIndices.map(Number),
            );
        } else if (localData.answer) {
            // Legacy restore (string-based)
            this.hparsonsInput.restoreAnswer(localData.answer);

            // Best-effort migration: persist indices after restoring
            if (this.isBlockGrading) {
                const migrated = this.hparsonsInput.getBlockIndices();
                localData.answerIndices = migrated;
                localStorage.setItem(this.storageId, JSON.stringify(localData));
            }
        }
        if (localData.count) {
            this.feedbackController.checkCount = localData.count;
        }
        // Restoring rebuilds every block from its source, math markup and all.
        this.renderMathInBlocks();
    }
    // RunestoneBase: Set the state of the problem in local storage
    setLocalStorage(data) {
        let currentState = {};
        if (data == undefined) {
            if (this.isBlockGrading) {
                const answerIndices = this.hparsonsInput.getBlockIndices();
                currentState = { answerIndices: answerIndices };
                currentState.count = this.feedbackController.checkCount;
            } else {
                const userAnswer = this.hparsonsInput.getParsonsTextArray();
                currentState = { answer: userAnswer };
            }
            currentState.timestamp = new Date();
        } else {
            currentState = data;
        }
        localStorage.setItem(this.storageId, JSON.stringify(currentState));
    }

    logHorizontalParsonsEvent(hparsonsEvent) {
        let ev = {
            event: "hparsons",
            div_id: this.divid,
            act: JSON.stringify(hparsonsEvent),
        };
        this.logBookEvent(ev);
    }
}

/*=================================
== Find the custom HTML tags and ==
==   execute our code on them    ==
=================================*/
document.addEventListener("runestone:login-complete", function () {
    document
        .querySelectorAll("[data-component=hparsons]")
        .forEach(function (el) {
            if (!el.closest("[data-component=timedAssessment]")) {
                // If this element exists within a timed component, don't render it here
                // try {
                hpList[el.id] = new HParsons({
                    orig: el,
                    useRunestoneServices: eBookConfig.useRunestoneServices,
                });
                // } catch (err) {
                //     console.log(`Error rendering ShortAnswer Problem ${this.id}
                //     Details: ${err}`);
                // }
            }
        });
});

if (typeof window.component_factory === "undefined") {
    window.component_factory = {};
}
window.component_factory["hparsons"] = function (opts) {
    return new HParsons(opts);
};


/***/ }),

/***/ 63618:
/*!**********************************************!*\
  !*** ./runestone/hparsons/js/blockGrader.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ BlockBasedGrader)
/* harmony export */ });
// This file is adapted from lineGrader in parsons directive.
// We could have fit our data structure to use the original LineBasedGrader directly,
// but that would result in changes in parsons directive affecting this, so we created a copy
// instead.

class BlockBasedGrader {
    constructor(problem) {
        this.problem = problem;
        this.percent = 0;
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
        this.correctLines = 0;
        this.percentLines = 0;
        var solutionLines = this.solution;
        var answerLines = this.answer;
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
            this.correctLength = false;
        }

        // Determine whether the code **that is there** is in the correct order
        // If there is too much or too little code this only matters for
        // calculating a percentage score.
        let isCorrectOrder = true;
        this.correctLines = 0;
        this.solutionLength = solutionLines.length;
        let loopLimit = Math.min(solutionLines.length, answerLines.length);
        for (i = 0; i < loopLimit; i++) {
            if (answerLines[i] !== solutionLines[i]) {
                isCorrectOrder = false;
            } else {
                this.correctLines += 1;
            }
        }

        if (isCorrectOrder && this.correctLength) {
            // Perfect
            state = "correct";
        } else if (!isCorrectOrder && state != "incorrectTooShort") {
            state = "incorrectMoveBlocks";
        } else if (!this.correctLength && state != "incorrectTooShort") {
            state = "incorrectMoveBlocks";
        }
        this.calculatePercent();
        this.graderState = state;
        return state;
    }

    calculatePercent() {
        let numLines = this.percentLines * 0.2;
        let lines = this.answer.length;
        let numCorrectBlocks = (this.correctLines / lines) * 0.8;

        this.percent = numLines + numCorrectBlocks;
    }
}


/***/ }),

/***/ 66714:
/*!********************************************!*\
  !*** ./runestone/common/js/resultTable.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createResultTable: () => (/* binding */ createResultTable)
/* harmony export */ });
// A read-only table of SQL query results, shared by activecode and hparsons.
//
// ``tableData`` is a result from sql.js: ``columns`` is the list of column
// names and ``values`` the list of rows. At most ``MAX_ROWS`` rows are shown;
// the callers already tell the reader when the result was cut short. The table
// scrolls inside a box no taller than ``maxHeight`` pixels, with the header row
// kept in view.

const MAX_ROWS = 100;

function createResultTable(tableData, container, maxHeight, caption) {
    const wrapper = document.createElement("div");
    wrapper.className = "sql_result_table";
    wrapper.style.maxHeight = `${maxHeight}px`;
    // A scrollable region must be reachable by keyboard to be scrolled.
    wrapper.tabIndex = 0;

    const table = document.createElement("table");
    if (caption) {
        const cap = table.createCaption();
        cap.className = "visuallyhidden";
        cap.textContent = caption;
        wrapper.setAttribute("aria-label", caption);
    }

    const headRow = table.createTHead().insertRow();
    for (const name of tableData.columns) {
        const th = document.createElement("th");
        th.scope = "col";
        th.textContent = name;
        headRow.appendChild(th);
    }

    const body = table.createTBody();
    for (const values of tableData.values.slice(0, MAX_ROWS)) {
        const row = body.insertRow();
        for (const value of values) {
            // sql.js gives NULL as null; show it as an empty cell.
            row.insertCell().textContent = value === null ? "" : String(value);
        }
    }

    wrapper.appendChild(table);
    container.appendChild(wrapper);
    return table;
}


/***/ }),

/***/ 67892:
/*!***************************************************!*\
  !*** ./runestone/hparsons/js/hparsons-i18n.en.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/rsi18n.js */ 54250);


(0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.load)({
    en: {
        msg_hparsons_drag_blocks_code:
            "Drag or click the blocks below to form your code:",
        msg_hparsons_drag_blocks_answer:
            "Drag or click the blocks below to form your answer:",
        msg_hparsons_drop_blocks_code:
            "Your code (click on a block to remove it):",
        msg_hparsons_drop_blocks_answer:
            "Your answer (click on a block to remove it):",
        msg_hparsons_available_blocks: "Available blocks",
        msg_hparsons_answer_area: "Answer area",
        msg_hparsons_keyboard_idle_instructions:
            "Press Enter to move blocks with the keyboard.",
        msg_hparsons_keyboard_instructions:
            "Use Left and Right Arrow to choose a block in this area. Use Up and Down Arrow to switch between available blocks and the answer area. Press Enter to move the current block. Press Escape or Tab to finish.",
        msg_hparsons_block_moved_to_answer: "$1 moved to answer area",
        msg_hparsons_block_moved_to_available: "$1 moved to available blocks",
        msg_hparsons_moving: "Moving $1",
        msg_hparsons_keyboard_finished: "Keyboard block movement finished.",
        msg_hparsons_check_me: "Check Me",
        msg_hparsons_blocks_reset: "Blocks reset.",
        msg_hparsons_run: "Run",
        msg_hparsons_query_results: "Query results",
    },
});


/***/ }),

/***/ 67920:
/*!************************!*\
  !*** crypto (ignored) ***!
  \************************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ 75410:
/*!**************************************************************!*\
  !*** ./runestone/hparsons/js/micro-parsons/LoggingEvents.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MicroParsonsEvent: () => (/* binding */ MicroParsonsEvent)
/* harmony export */ });
// This file contains the event definition for micro Parsons problems.
var MicroParsonsEvent;
(function (MicroParsonsEvent) {
    let InputAction;
    (function (InputAction) {
        InputAction["ADD"] = "add";
        InputAction["MOVE"] = "move";
        InputAction["REMOVE"] = "remove";
    })(InputAction = MicroParsonsEvent.InputAction || (MicroParsonsEvent.InputAction = {}));
})(MicroParsonsEvent || (MicroParsonsEvent = {}));


/***/ }),

/***/ 76759:
/*!***************************************************!*\
  !*** ./runestone/hparsons/js/hparsonsFeedback.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ HParsonsFeedback)
/* harmony export */ });
class HParsonsFeedback {
    constructor(hparsons) {
        this.hparsons = hparsons;
        this.percent = 0;
    }
    createOutput() {
        console.log("createOutput method not implemented in feedback!");
    }
    async runButtonHandler() {
        console.log("runButtonClicked method not implemented in feedback!");
    }
    customizeUI() {
        // used to change some minor UI, e.g. the text on Run button
    }
    init() {
        // initlizations functionalities such as preparing SQL,
        // or checking related options
    }

    clearFeedback() {
        // called when input is changed
        console.log("clearFeedback method not implemented in feedback!");
    }

    reset() {
        // called when reset is clicked
        console.log("reset method not implemented in feedback!");
    }
}


/***/ }),

/***/ 84314:
/*!*************************************************************!*\
  !*** ./runestone/hparsons/js/micro-parsons/style/style.css ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 90777:
/*!********************************************************!*\
  !*** ./runestone/hparsons/js/hparsons-i18n.sr-Cyrl.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/rsi18n.js */ 54250);


(0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.load)({
    "sr-Cyrl": {
        msg_hparsons_drag_blocks_code:
            "Превуците или кликните на блокове испод да саставите свој код:",
        msg_hparsons_drag_blocks_answer:
            "Превуците или кликните на блокове испод да саставите свој одговор:",
        msg_hparsons_drop_blocks_code:
            "Ваш код (кликните на блок да га уклоните):",
        msg_hparsons_drop_blocks_answer:
            "Ваш одговор (кликните на блок да га уклоните):",
        msg_hparsons_available_blocks: "Доступни блокови",
        msg_hparsons_answer_area: "Област одговора",
        msg_hparsons_keyboard_idle_instructions:
            "Притисните Enter да померате блокове тастатуром.",
        msg_hparsons_keyboard_instructions:
            "Користите стрелице налево и надесно да изаберете блок у овој области. Користите стрелице нагоре и надоле да прелазите између доступних блокова и области одговора. Притисните Enter да померите изабрани блок. Притисните Escape или Tab да завршите.",
        msg_hparsons_block_moved_to_answer: "$1 је премештен у област одговора",
        msg_hparsons_block_moved_to_available: "$1 је премештен међу доступне блокове",
        msg_hparsons_moving: "Премештање: $1",
        msg_hparsons_keyboard_finished: "Премештање блокова тастатуром је завршено.",
        msg_hparsons_check_me: "Провери",
        msg_hparsons_blocks_reset: "Блокови су ресетовани.",
        msg_hparsons_run: "Покрени",
        msg_hparsons_query_results: "Резултати упита",
    },
});


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Ozs7Ozs7QUMzQkQsZTs7Ozs7Ozs7Ozs7Ozs7O0FDQUEsc0VBQXNFO0FBQy9ELElBQVUsaUJBQWlCLENBcUNqQztBQXJDRCxXQUFpQixpQkFBaUI7SUFDaEMsSUFBWSxXQUlYO0lBSkQsV0FBWSxXQUFXO1FBQ3JCLDBCQUFXO1FBQ1gsNEJBQWE7UUFDYixnQ0FBaUI7SUFDbkIsQ0FBQyxFQUpXLFdBQVcsR0FBWCw2QkFBVyxLQUFYLDZCQUFXLFFBSXRCO0FBZ0NILENBQUMsRUFyQ2dCLGlCQUFpQixLQUFqQixpQkFBaUIsUUFxQ2pDOzs7Ozs7Ozs7Ozs7Ozs7O0FDdENjO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDNUJBOzs7Ozs7Ozs7Ozs7OztBQ0FpRDs7QUFFakQsMERBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2hwYXJzb25zL2Nzcy9obGpzLXhjb2RlLmNzcz8wMzQ4Iiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvaHBhcnNvbnMvanMvU1FMRmVlZGJhY2suanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9ocGFyc29ucy9qcy9ocGFyc29ucy1pMThuLnB0LWJyLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvaHBhcnNvbnMvY3NzL2hwYXJzb25zLmNzcz9mOWRhIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvaHBhcnNvbnMvanMvbWljcm8tcGFyc29ucy9taWNyby1wYXJzb25zLnRzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvaHBhcnNvbnMvanMvQmxvY2tGZWVkYmFjay5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzL2lnbm9yZWR8L2hvbWUvYW5kcmV3L3dzbC1wcm9ncmFtbW1pbmcvcnMvYmFzZXMvcnNwdHgvaW50ZXJhY3RpdmVzL25vZGVfbW9kdWxlcy9zcWwuanMvZGlzdHxwYXRoIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvaHBhcnNvbnMvanMvbWljcm8tcGFyc29ucy9QYXJzb25zSW5wdXQudHMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy9pZ25vcmVkfC9ob21lL2FuZHJldy93c2wtcHJvZ3JhbW1taW5nL3JzL2Jhc2VzL3JzcHR4L2ludGVyYWN0aXZlcy9ub2RlX21vZHVsZXMvc3FsLmpzL2Rpc3R8ZnMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9ocGFyc29ucy9qcy9ocGFyc29ucy5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2hwYXJzb25zL2pzL2Jsb2NrR3JhZGVyLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvY29tbW9uL2pzL3Jlc3VsdFRhYmxlLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvaHBhcnNvbnMvanMvaHBhcnNvbnMtaTE4bi5lbi5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzL2lnbm9yZWR8L2hvbWUvYW5kcmV3L3dzbC1wcm9ncmFtbW1pbmcvcnMvYmFzZXMvcnNwdHgvaW50ZXJhY3RpdmVzL25vZGVfbW9kdWxlcy9zcWwuanMvZGlzdHxjcnlwdG8iLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9ocGFyc29ucy9qcy9taWNyby1wYXJzb25zL0xvZ2dpbmdFdmVudHMudHMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9ocGFyc29ucy9qcy9ocGFyc29uc0ZlZWRiYWNrLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvaHBhcnNvbnMvanMvbWljcm8tcGFyc29ucy9zdHlsZS9zdHlsZS5jc3M/Y2IzMCIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2hwYXJzb25zL2pzL2hwYXJzb25zLWkxOG4uc3ItQ3lybC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCJpbXBvcnQgSFBhcnNvbnNGZWVkYmFjayBmcm9tIFwiLi9ocGFyc29uc0ZlZWRiYWNrXCI7XG5pbXBvcnQgaW5pdFNxbEpzIGZyb20gXCJzcWwuanMvZGlzdC9zcWwtd2FzbS5qc1wiO1xuaW1wb3J0IHsgdCB9IGZyb20gXCIuLi8uLi9jb21tb24vanMvcnNpMThuLmpzXCI7XG5pbXBvcnQgeyBjcmVhdGVSZXN1bHRUYWJsZSB9IGZyb20gXCIuLi8uLi9jb21tb24vanMvcmVzdWx0VGFibGUuanNcIjtcblxudmFyIGFsbERidXJscyA9IHt9O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTUUxGZWVkYmFjayBleHRlbmRzIEhQYXJzb25zRmVlZGJhY2sge1xuICAgIGNyZWF0ZU91dHB1dCgpIHtcbiAgICAgICAgdmFyIG91dERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIG91dERpdi5jbGFzc0xpc3QuYWRkKFwiaHBfb3V0cHV0XCIpO1xuICAgICAgICB0aGlzLm91dERpdiA9IG91dERpdjtcbiAgICAgICAgdGhpcy5vdXRwdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicHJlXCIpO1xuICAgICAgICB0aGlzLm91dHB1dC5pZCA9IHRoaXMuaHBhcnNvbnMuZGl2aWQgKyBcIl9zdGRvdXRcIjtcbiAgICAgICAgdGhpcy5vdXRwdXQuc3R5bGUudmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XG4gICAgICAgIHZhciBjbGVhckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGNsZWFyRGl2LnN0eWxlLmNsZWFyID0gXCJib3RoXCI7IC8vIG5lZWRlZCB0byBtYWtlIHBhcmVudCBkaXYgcmVzaXplIHByb3Blcmx5XG4gICAgICAgIHRoaXMuaHBhcnNvbnMub3V0ZXJEaXYuYXBwZW5kQ2hpbGQoY2xlYXJEaXYpO1xuICAgICAgICBvdXREaXYuYXBwZW5kQ2hpbGQodGhpcy5vdXRwdXQpO1xuICAgICAgICB0aGlzLmhwYXJzb25zLm91dGVyRGl2LmFwcGVuZENoaWxkKG91dERpdik7XG4gICAgICAgIGNsZWFyRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgY2xlYXJEaXYuc3R5bGUuY2xlYXIgPSBcImJvdGhcIjsgLy8gbmVlZGVkIHRvIG1ha2UgcGFyZW50IGRpdiByZXNpemUgcHJvcGVybHlcbiAgICAgICAgdGhpcy5ocGFyc29ucy5vdXRlckRpdi5hcHBlbmRDaGlsZChjbGVhckRpdik7XG4gICAgfVxuXG4gICAgcmVuZGVyRmVlZGJhY2soKSB7XG4gICAgICAgIGlmICh0aGlzLnRlc3RSZXN1bHQpIHtcbiAgICAgICAgICAgIHRoaXMub3V0cHV0LnRleHRDb250ZW50ID0gdGhpcy50ZXN0UmVzdWx0O1xuICAgICAgICAgICAgdGhpcy5vdXRwdXQuc3R5bGUudmlzaWJpbGl0eSA9IFwidmlzaWJsZVwiO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMub3V0RGl2LnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7IC8vIGhwYXJzb25zLmNzcyBoaWRlcyAuaHBfb3V0cHV0XG4gICAgfVxuXG4gICAgY2xlYXJGZWVkYmFjaygpIHtcbiAgICAgICAgdGhpcy5vdXREaXYuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgIH1cblxuICAgIHJlc2V0KCkge1xuICAgICAgICB0aGlzLmNsZWFyRmVlZGJhY2soKTtcbiAgICB9XG5cbiAgICBpbml0KCkge1xuICAgICAgICAvLyBhZGFwdGVkIGZyb20gYWN0aXZlY29kZS1zcWxcbiAgICAgICAgLy8gZm5wcmVmaXggc2V0cyB0aGUgcGF0aCB0byBsb2FkIHRoZSBzcWwtd2FzbS53YXNtIGZpbGVcbiAgICAgICAgdmFyIGJvb2twcmVmaXg7XG4gICAgICAgIHZhciBmbnByZWZpeDtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgZUJvb2tDb25maWcudXNlUnVuZXN0b25lU2VydmljZXMgfHxcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5zZWFyY2guaW5jbHVkZXMoXCJtb2RlPWJyb3dzaW5nXCIpXG4gICAgICAgICkge1xuICAgICAgICAgICAgYm9va3ByZWZpeCA9IGAvYm9va3MvcHVibGlzaGVkLyR7ZUJvb2tDb25maWcuYmFzZWNvdXJzZX1gO1xuICAgICAgICAgICAgZm5wcmVmaXggPSBib29rcHJlZml4ICsgXCIvX3N0YXRpY1wiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gVGhlIGVsc2UgY2xhdXNlIGhhbmRsZXMgdGhlIGNhc2Ugd2hlcmUgeW91IGFyZSBidWlsZGluZyBmb3IgYSBzdGF0aWMgd2ViIGJyb3dzZXJcbiAgICAgICAgICAgIGJvb2twcmVmaXggPSBcIlwiO1xuICAgICAgICAgICAgZm5wcmVmaXggPSBcIi9fc3RhdGljXCI7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IFNRTGNvbmZpZyA9IHtcbiAgICAgICAgICAgIGxvY2F0ZUZpbGU6IChmaWxlbmFtZSkgPT4gYCR7Zm5wcmVmaXh9LyR7ZmlsZW5hbWV9YCxcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzLmhwYXJzb25zO1xuICAgICAgICBpbml0U3FsSnMoU1FMY29uZmlnKS50aGVuKGZ1bmN0aW9uIChTUUwpIHtcbiAgICAgICAgICAgIC8vIHNldCB1cCBjYWxsIHRvIGxvYWQgZGF0YWJhc2UgYXN5bmNocm9ub3VzbHkgaWYgZ2l2ZW5cbiAgICAgICAgICAgIGlmIChzZWxmLmRidXJsKSB7XG4gICAgICAgICAgICAgICAgaWYgKHNlbGYuZGJ1cmwuc3RhcnRzV2l0aChcIi9fc3RhdGljXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZGJ1cmwgPSBgJHtib29rcHJlZml4fSR7c2VsZi5kYnVybH1gO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzZWxmLnJ1bkJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiLCBcImRpc2FibGVkXCIpO1xuICAgICAgICAgICAgICAgIGxldCBidXR0b25UZXh0ID0gc2VsZi5ydW5CdXR0b24udGV4dENvbnRlbnQ7XG4gICAgICAgICAgICAgICAgc2VsZi5ydW5CdXR0b24udGV4dENvbnRlbnQgPSBcIkxvYWRpbmcgZGF0YWJhc2UuLi5cIjtcbiAgICAgICAgICAgICAgICBpZiAoIShzZWxmLmRidXJsIGluIGFsbERidXJscykpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJlc29sdmVGbjtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlRm4gPSByZXNvbHZlO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgYWxsRGJ1cmxzW3NlbGYuZGJ1cmxdID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiBcImxvYWRpbmdcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHhXYWl0Rm9yOiB7IHByb21pc2UsIHJlc29sdmU6IHJlc29sdmVGbiB9LFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhbGxEYnVybHNbc2VsZi5kYnVybF0uc3RhdHVzID09IFwibG9hZGluZ1wiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbGxEYnVybHNbc2VsZi5kYnVybF0ueFdhaXRGb3IucHJvbWlzZS50aGVuKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5kYiA9IGFsbERidXJsc1tzZWxmLmRidXJsXS5kYk9iamVjdDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5ydW5CdXR0b24ucmVtb3ZlQXR0cmlidXRlKFwiZGlzYWJsZWRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYucnVuQnV0dG9uLnRleHRDb250ZW50ID0gYnV0dG9uVGV4dDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzZWxmLmRiID0gYWxsRGJ1cmxzW3NlbGYuZGJ1cmxdLmRiT2JqZWN0O1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnJ1bkJ1dHRvbi5yZW1vdmVBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5ydW5CdXR0b24udGV4dENvbnRlbnQgPSBidXR0b25UZXh0O1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgICAgICAgICAvLyBGb3IgZXhhbXBsZTogaHR0cHM6Ly9naXRodWIuY29tL2xlcm9jaGEvY2hpbm9vay1kYXRhYmFzZS9yYXcvbWFzdGVyL0NoaW5vb2tEYXRhYmFzZS9EYXRhU291cmNlcy9DaGlub29rX1NxbGl0ZS5zcWxpdGVcbiAgICAgICAgICAgICAgICB4aHIub3BlbihcIkdFVFwiLCBzZWxmLmRidXJsLCB0cnVlKTtcbiAgICAgICAgICAgICAgICB4aHIucmVzcG9uc2VUeXBlID0gXCJhcnJheWJ1ZmZlclwiO1xuICAgICAgICAgICAgICAgIHhoci5vbmxvYWQgPSAoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdUludDhBcnJheSA9IG5ldyBVaW50OEFycmF5KHhoci5yZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZGIgPSBuZXcgU1FMLkRhdGFiYXNlKHVJbnQ4QXJyYXkpO1xuICAgICAgICAgICAgICAgICAgICBhbGxEYnVybHNbc2VsZi5kYnVybF0uZGJPYmplY3QgPSBzZWxmLmRiO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnJ1bkJ1dHRvbi50ZXh0Q29udGVudCA9IGJ1dHRvblRleHQ7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYucnVuQnV0dG9uLnJlbW92ZUF0dHJpYnV0ZShcImRpc2FibGVkXCIpO1xuICAgICAgICAgICAgICAgICAgICBhbGxEYnVybHNbc2VsZi5kYnVybF0uZGIgPSB1SW50OEFycmF5O1xuICAgICAgICAgICAgICAgICAgICBhbGxEYnVybHNbc2VsZi5kYnVybF0uc3RhdHVzID0gXCJyZWFkeVwiO1xuICAgICAgICAgICAgICAgICAgICBhbGxEYnVybHNbc2VsZi5kYnVybF0ueFdhaXRGb3IucmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgICAgICAvLyBjb250ZW50cyBpcyBub3cgW3tjb2x1bW5zOlsnY29sMScsJ2NvbDInLC4uLl0sIHZhbHVlczpbW2ZpcnN0IHJvd10sIFtzZWNvbmQgcm93XSwgLi4uXX1dXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB4aHIuc2VuZCgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZWxmLmRiID0gbmV3IFNRTC5EYXRhYmFzZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBhZGFwdGVkIGZyb20gYWN0aXZlY29kZSAtIFNRTFxuICAgIGFzeW5jIHJ1bkJ1dHRvbkhhbmRsZXIoKSB7XG4gICAgICAgIC8vIERpc2FibGUgdGhlIHJ1biBidXR0b24gdW50aWwgdGhlIHJ1biBpcyBmaW5pc2hlZC5cbiAgICAgICAgdGhpcy5ocGFyc29ucy5ydW5CdXR0b24uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5ydW5Qcm9nKCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGB0aGVyZSB3YXMgYW4gZXJyb3IgJHtlfSBydW5uaW5nIHRoZSBjb2RlYCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sb2dDdXJyZW50QW5zd2VyKCk7XG4gICAgICAgIHRoaXMucmVuZGVyRmVlZGJhY2soKTtcbiAgICAgICAgLy8gVGhlIHJ1biBpcyBmaW5pc2hlZDsgcmUtZW5hYmxlIHRoZSBidXR0b24uXG4gICAgICAgIHRoaXMuaHBhcnNvbnMucnVuQnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gYWRhcHRlZCBmcm9tIGFjdGl2ZWNvZGUtc3FsXG4gICAgYXN5bmMgcnVuUHJvZygpIHtcbiAgICAgICAgLy8gQ2xlYXIgYW55IG9sZCByZXN1bHRzXG4gICAgICAgIGxldCBkaXZpZCA9IHRoaXMuaHBhcnNvbnMuZGl2aWQgKyBcIl9zcWxfb3V0XCI7XG4gICAgICAgIGxldCByZXNwRGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZGl2aWQpO1xuICAgICAgICBpZiAocmVzcERpdikge1xuICAgICAgICAgICAgcmVzcERpdi5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKHJlc3BEaXYpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMub3V0cHV0LnRleHRDb250ZW50ID0gXCJcIjtcbiAgICAgICAgLy8gY3JlYXRpbmcgbmV3IHJlc3VsdHMgZGl2XG4gICAgICAgIHJlc3BEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICByZXNwRGl2LmlkID0gZGl2aWQ7XG4gICAgICAgIHRoaXMub3V0RGl2LmFwcGVuZENoaWxkKHJlc3BEaXYpO1xuICAgICAgICAvLyBzaG93IHRoZSBvdXRwdXQgZGl2XG4gICAgICAgIHRoaXMub3V0RGl2LnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7IC8vIGhwYXJzb25zLmNzcyBoaWRlcyAuaHBfb3V0cHV0XG5cbiAgICAgICAgLy8gUnVuIHRoaXMgcXVlcnlcbiAgICAgICAgbGV0IHF1ZXJ5ID0gYXdhaXQgdGhpcy5idWlsZFByb2coKTtcbiAgICAgICAgaWYgKCF0aGlzLmhwYXJzb25zLmRiKSB7XG4gICAgICAgICAgICB0aGlzLm91dHB1dC50ZXh0Q29udGVudCA9IGBFcnJvcjogRGF0YWJhc2Ugbm90IGluaXRpYWxpemVkISBEQlVSTDogJHt0aGlzLmhwYXJzb25zLmRidXJsfWA7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBXaGVuIGhhdmluZyBwcmVmaXgvc3VmZml4LCB0aGUgdmlzdWFsaXphdGlvbiBpcyBjb25zaXN0ZW50IHdpdGggXCJzaG93bGFzdHNxbFwiIG9wdGlvbiBvZiBzcWwgYWN0aXZlY29kZTpcbiAgICAgICAgLy8gICAgICAgIG9ubHkgdmlzdWFsaXplIGxhc3QgZW50cnlcblxuICAgICAgICBsZXQgZXhlY3V0aW9uU3VjY2Vzc0ZsYWcgPSB0cnVlO1xuICAgICAgICAvLyBleGVjdXRpbmcgaGlkZGVuIHByZWZpeCBpZiBleGlzdFxuICAgICAgICBpZiAocXVlcnkucHJlZml4KSB7XG4gICAgICAgICAgICB0aGlzLnByZWZpeHJlc3VsdHMgPSB0aGlzLmV4ZWN1dGVJdGVyYXRlZFN0YXRlbWVudHMoXG4gICAgICAgICAgICAgICAgdGhpcy5ocGFyc29ucy5kYi5pdGVyYXRlU3RhdGVtZW50cyhxdWVyeS5wcmVmaXgpLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZWZpeHJlc3VsdHMuYXQoLTEpLnN0YXR1cyA9PSBcImZhaWx1cmVcIikge1xuICAgICAgICAgICAgICAgIC8vIGlmIGVycm9yIG9jY3VyZWQgaW4gaGlkZGVuIHByZWZpeCwgbG9nIGFuZCBzdG9wIGV4ZWN1dGluZyB0aGUgcmVzdFxuICAgICAgICAgICAgICAgIHRoaXMudmlzdWFsaXplUmVzdWx0cyhcbiAgICAgICAgICAgICAgICAgICAgcmVzcERpdixcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcmVmaXhyZXN1bHRzLFxuICAgICAgICAgICAgICAgICAgICBcIkVycm9yIGV4ZWN1dGluZyBoaWRkZW4gY29kZSBpbiBwcmVmaXhcIixcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIGV4ZWN1dGlvblN1Y2Nlc3NGbGFnID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBleGVjdXRpbmcgc3R1ZGVudCBpbnB1dCBpbiBtaWNybyBQYXJzb25zXG4gICAgICAgIGlmIChleGVjdXRpb25TdWNjZXNzRmxhZykge1xuICAgICAgICAgICAgdGhpcy5yZXN1bHRzID0gdGhpcy5leGVjdXRlSXRlcmF0ZWRTdGF0ZW1lbnRzKFxuICAgICAgICAgICAgICAgIHRoaXMuaHBhcnNvbnMuZGIuaXRlcmF0ZVN0YXRlbWVudHMocXVlcnkuaW5wdXQpLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmICh0aGlzLnJlc3VsdHMuYXQoLTEpLnN0YXR1cyA9PSBcImZhaWx1cmVcIikge1xuICAgICAgICAgICAgICAgIC8vIGlmIGVycm9yIG9jY3VyZWQgaW4gc3R1ZGVudCBpbnB1dCwgc3RvcCBleGVjdXRpbmcgc3VmZml4L3VuaXR0dGVzdFxuICAgICAgICAgICAgICAgIC8vIGFuZCB2aXN1YWxpemUgdGhlIGVycm9yXG4gICAgICAgICAgICAgICAgdGhpcy52aXN1YWxpemVSZXN1bHRzKHJlc3BEaXYsIHRoaXMucmVzdWx0cyk7XG4gICAgICAgICAgICAgICAgZXhlY3V0aW9uU3VjY2Vzc0ZsYWcgPSBmYWxzZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIXF1ZXJ5LnN1ZmZpeCkge1xuICAgICAgICAgICAgICAgIHRoaXMudmlzdWFsaXplUmVzdWx0cyhyZXNwRGl2LCB0aGlzLnJlc3VsdHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gZXhlY3V0aW5nIGhpZGRlbiBzdWZmaXggaWYgZXhpc3RcbiAgICAgICAgLy8gSW4gbW9zdCBjYXNlcyB0aGUgc3VmZml4IGlzIGp1c3QgXCJzZWxlY3QgKiBmcm9tIHhcIiB0b1xuICAgICAgICAvLyAgICBnZXQgYWxsIGRhdGEgZnJvbSB0aGUgdGFibGUgdG8gc2VlIGlmIHRoZSBvcGVyYXRpb25zIHRoZSB0YWJsZSBpcyBjb3JyZWN0XG4gICAgICAgIGlmIChleGVjdXRpb25TdWNjZXNzRmxhZyAmJiBxdWVyeS5zdWZmaXgpIHtcbiAgICAgICAgICAgIHRoaXMuc3VmZml4cmVzdWx0cyA9IHRoaXMuZXhlY3V0ZUl0ZXJhdGVkU3RhdGVtZW50cyhcbiAgICAgICAgICAgICAgICB0aGlzLmhwYXJzb25zLmRiLml0ZXJhdGVTdGF0ZW1lbnRzKHF1ZXJ5LnN1ZmZpeCksXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgaWYgKHRoaXMuc3VmZml4cmVzdWx0cy5hdCgtMSkuc3RhdHVzID09IFwiZmFpbHVyZVwiKSB7XG4gICAgICAgICAgICAgICAgLy8gaWYgZXJyb3Igb2NjdXJlZCBpbiBoaWRkZW4gc3VmZml4LCB2aXN1YWxpemUgdGhlIHJlc3VsdHNcbiAgICAgICAgICAgICAgICB0aGlzLnZpc3VhbGl6ZVJlc3VsdHMoXG4gICAgICAgICAgICAgICAgICAgIHJlc3BEaXYsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3VmZml4cmVzdWx0cyxcbiAgICAgICAgICAgICAgICAgICAgXCJFcnJvciBleGVjdXRpbmcgaGlkZGVuIGNvZGUgaW4gc3VmZml4XCIsXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBleGVjdXRpb25TdWNjZXNzRmxhZyA9IGZhbHNlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnZpc3VhbGl6ZVJlc3VsdHMocmVzcERpdiwgdGhpcy5zdWZmaXhyZXN1bHRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE5vdyBoYW5kbGUgYXV0b2dyYWRpbmdcbiAgICAgICAgLy8gYXV0b2dyYWRpbmcgdGFrZXMgdGhlIHJlc3VsdHMgb2YgdGhlIGhpZGRlbiBzdWZmaXggaWYgZXhpc3RcbiAgICAgICAgLy8gb3RoZXJ3aXNlIHRha2UgdGhlIHJlc3VsdCBvZiBzdHVkZW50IGlucHV0XG4gICAgICAgIGlmICh0aGlzLmhwYXJzb25zLnVuaXR0ZXN0KSB7XG4gICAgICAgICAgICBpZiAoZXhlY3V0aW9uU3VjY2Vzc0ZsYWcpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zdWZmaXhyZXN1bHRzKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGVzdFJlc3VsdCA9IHRoaXMuYXV0b2dyYWRlKFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdWZmaXhyZXN1bHRzW3RoaXMuc3VmZml4cmVzdWx0cy5sZW5ndGggLSAxXSxcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRlc3RSZXN1bHQgPSB0aGlzLmF1dG9ncmFkZShcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVzdWx0c1t0aGlzLnJlc3VsdHMubGVuZ3RoIC0gMV0sXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyB1bml0IHRlc3QgcmVzdWx0cyB3aGVuIGV4ZWN1dGlvbiBmYWlsZWRcbiAgICAgICAgICAgICAgICB0aGlzLnBhc3NlZCA9IDA7XG4gICAgICAgICAgICAgICAgdGhpcy5mYWlsZWQgPSAwO1xuICAgICAgICAgICAgICAgIHRoaXMucGVyY2VudCA9IE5hTjtcbiAgICAgICAgICAgICAgICB0aGlzLnVuaXRfcmVzdWx0cyA9IGBwZXJjZW50OiR7dGhpcy5wZXJjZW50fTpwYXNzZWQ6JHt0aGlzLnBhc3NlZH06ZmFpbGVkOiR7dGhpcy5mYWlsZWR9YDtcbiAgICAgICAgICAgICAgICAvLyBEbyBub3Qgc2hvdyB1bml0dGVzdCByZXN1bHRzIGlmIGV4ZWN1dGlvbiBmYWlsZWRcbiAgICAgICAgICAgICAgICB0aGlzLm91dHB1dC5zdHlsZS52aXNpYmlsaXR5ID0gXCJoaWRkZW5cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMub3V0cHV0LnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShcImRvbmVcIik7XG4gICAgfVxuXG4gICAgLy8gUmVmYWN0b3JlZCBmcm9tIGFjdGl2ZWNvZGUtc3FsLlxuICAgIC8vIFRha2VzIGl0ZXJhdGVkIHN0YXRlbWVudHMgZnJvbSBkYi5pdGVyYXRlU3RhdGVtbnRzKHF1ZXJ5U3RyaW5nKVxuICAgIC8vIFJldHVybnMgQXJyYXk8cmVzdWx0PjpcbiAgICAvKiBlYWNoIHJlc3VsdDoge1xuICAgICAgICBzdGF0dXM6IFwic3VjY2Vzc1wiIG9yIFwiZmFsaXVyZVwiLFxuICAgICAgICAvLyBmb3IgU0VMRUNUIHN0YXRlbWVudHMgKD8pOlxuICAgICAgICBjb2x1bW5zOiBudW1iZXIgb2YgY29sdW1ucyxcbiAgICAgICAgdmFsdWVzOiBkYXRhLFxuICAgICAgICByb3djb3VudDogbnVtYmVyIG9mIHJvd3MgaW4gZGF0YSxcbiAgICAgICAgLy8gZm9yIElOU0VSVCwgVVBEQVRFLCBERUxFVEU6XG4gICAgICAgIG9wZXJhdGlvbjogXCJJTlNFUlRcIiwgXCJVUERBVEVcIiwgb3IgXCJERUxFVEVcIixcbiAgICAgICAgcm93Y291bnQ6IG51bWJlciBvZiByb3dzIG1vZGlmaWVkLFxuICAgICAgICAvLyB3aGVuIGVycm9yIG9jY3VycmVkIChhc2lkZSBmcm9tIHN0YXR1cyk6XG4gICAgICAgIG1lc3NhZ2U6IGVycm9yIG1lc3NhZ2UsXG4gICAgICAgIHNxbDogcmVtYWluaW5nIFNRTCAoPylcbiAgICAgICAgLy8gd2hlbiBubyBxdWVyaWVzIHdlcmUgZXhlY3V0ZWQ6XG4gICAgICAgIG1lc3NhZ2U6IFwibm8gcXVlcmllcyBzdWJtaXR0ZWRcIlxuICAgIH0qL1xuICAgIC8vIElmIGFuIGVycm9yIG9jY3VycyBpdCB3aWxsIHN0b3AgZXhlY3V0aW5nIHRoZSByZXN0IG9mIHF1ZXJpZXMgaW4gaXQuXG4gICAgLy8gVGh1cyB0aGUgZXJyb3IgcmVzdWx0IHdpbGwgYWx3YXlzIGJlIHRoZSBsYXN0IGl0ZW0uXG4gICAgZXhlY3V0ZUl0ZXJhdGVkU3RhdGVtZW50cyhpdCkge1xuICAgICAgICBsZXQgcmVzdWx0cyA9IFtdO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZm9yIChsZXQgc3RhdGVtZW50IG9mIGl0KSB7XG4gICAgICAgICAgICAgICAgbGV0IGNvbHVtbnMgPSBzdGF0ZW1lbnQuZ2V0Q29sdW1uTmFtZXMoKTtcbiAgICAgICAgICAgICAgICBpZiAoY29sdW1ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGRhdGEhIHByb2JhYmx5IGEgU0VMRUNUXG4gICAgICAgICAgICAgICAgICAgIGxldCBkYXRhID0gW107XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChzdGF0ZW1lbnQuc3RlcCgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLnB1c2goc3RhdGVtZW50LmdldCgpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXN1bHRzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiBcInN1Y2Nlc3NcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbnM6IGNvbHVtbnMsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZXM6IGRhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgICByb3djb3VudDogZGF0YS5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBuc3FsID0gc3RhdGVtZW50LmdldE5vcm1hbGl6ZWRTUUwoKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHByZWZpeCA9IG5zcWwuc3Vic3RyKDAsIDYpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlbWVudC5zdGVwKCk7IC8vIGV4ZWN1dGUgdGhlIHF1ZXJ5XG4gICAgICAgICAgICAgICAgICAgIC8vIFRyeSB0byBkZXRlY3QgSU5TRVJUL1VQREFURS9ERUxFVEUgdG8gZ2l2ZSBmcmllbmRseSBmZWVkYmFja1xuICAgICAgICAgICAgICAgICAgICAvLyBvbiByb3dzIG1vZGlmaWVkIC0gdW5mb3J0dW5hdGVseSwgdGhpcyB3b24ndCBjYXRjaCBzdWNoIHF1ZXJpZXNcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhleSB1c2UgQ1RFcy4gIFRoZXJlIHNlZW1zIHRvIGJlIG5vIHJlbGlhYmxlIHdheSBvZiBrbm93aW5nXG4gICAgICAgICAgICAgICAgICAgIC8vIHdoZW4gYSBTUUxpdGUgcXVlcnkgYWN0dWFsbHkgbW9kaWZpZWQgZGF0YS5cbiAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJlZml4ID09PSBcImluc2VydFwiIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVmaXggPT09IFwidXBkYXRlXCIgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZWZpeCA9PT0gXCJkZWxldGVcIlxuICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdHMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiBcInN1Y2Nlc3NcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb246IHByZWZpeCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3djb3VudDogdGhpcy5ocGFyc29ucy5kYi5nZXRSb3dzTW9kaWZpZWQoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKHsgc3RhdHVzOiBcInN1Y2Nlc3NcIiB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgcmVzdWx0cy5wdXNoKHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IFwiZmFpbHVyZVwiLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGUudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICBzcWw6IGl0LmdldFJlbWFpbmluZ1NRTCgpLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlc3VsdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXN1bHRzLnB1c2goe1xuICAgICAgICAgICAgICAgIHN0YXR1czogXCJmYWlsdXJlXCIsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogXCJObyBxdWVyaWVzIHN1Ym1pdHRlZC5cIixcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH1cblxuICAgIC8vIG91dHB1dCB0aGUgcmVzdWx0cyBpbiB0aGUgcmVzdWx0QXJyYXkoQXJyYXk8cmVzdWx0cz4pLlxuICAgIC8vIGNvbnRhaW5lcjogdGhlIGNvbnRhaW5lciB0aGF0IGNvbnRhaW5zIHRoZSByZXN1bHRzXG4gICAgLy8gcmVzdWx0QXJyYXkgKEFycmF5PHJlc3VsdD4pOiBzZWUgZXhlY3V0ZUl0ZXJhdGVkU3RhdGVtZW50c1xuICAgIC8vIEVhY2ggcmVzdWx0IHdpbGwgYmUgaW4gYSBzZXBhcmF0ZSByb3cuXG4gICAgLy8gZGV2Tm90ZSB3aWxsIGJlIGRpc3BsYXllZCBpbiB0aGUgdG9wIHJvdyBpZiBleGlzdDtcbiAgICAvLyAgICAgaXQgdXN1YWxseSB3b24ndCBoYXBwZW4gdW5sZXNzIHNvbWV0aGluZyBpcyB3cm9uZyB3aXRoIHByZWZpeCBhbmQgc3VmZml4LlxuICAgIC8vICAgICAoXCJlcnJvciBleGVjdXRpb24gcHJlZml4L3N1ZmZpeFwiKVxuICAgIHZpc3VhbGl6ZVJlc3VsdHMoY29udGFpbmVyLCByZXN1bHRBcnJheSwgZGV2Tm90ZSkge1xuICAgICAgICBpZiAoZGV2Tm90ZSkge1xuICAgICAgICAgICAgbGV0IHNlY3Rpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgc2VjdGlvbi5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImhwX3NxbF9yZXN1bHRcIik7XG4gICAgICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoc2VjdGlvbik7XG4gICAgICAgICAgICBsZXQgbWVzc2FnZUJveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwcmVcIik7XG4gICAgICAgICAgICBtZXNzYWdlQm94LnRleHRDb250ZW50ID0gZGV2Tm90ZTtcbiAgICAgICAgICAgIG1lc3NhZ2VCb3guc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJocF9zcWxfcmVzdWx0X2ZhaWx1cmVcIik7XG4gICAgICAgICAgICBzZWN0aW9uLmFwcGVuZENoaWxkKG1lc3NhZ2VCb3gpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IHIgb2YgcmVzdWx0QXJyYXkpIHtcbiAgICAgICAgICAgIGxldCBzZWN0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgIHNlY3Rpb24uc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJocF9zcWxfcmVzdWx0XCIpO1xuICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHNlY3Rpb24pO1xuICAgICAgICAgICAgaWYgKHIuc3RhdHVzID09PSBcInN1Y2Nlc3NcIikge1xuICAgICAgICAgICAgICAgIGlmIChyLmNvbHVtbnMpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRhYmxlRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgICAgICAgICAgc2VjdGlvbi5hcHBlbmRDaGlsZCh0YWJsZURpdik7XG4gICAgICAgICAgICAgICAgICAgIGxldCBtYXhIZWlnaHQgPSAzNTA7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHRBcnJheS5sZW5ndGggPiAxKSBtYXhIZWlnaHQgPSAyMDA7IC8vIG1heCBoZWlnaHQgc21hbGxlciBpZiBsb3RzIG9mIHJlc3VsdHNcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlUmVzdWx0VGFibGUoXG4gICAgICAgICAgICAgICAgICAgICAgICByLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGFibGVEaXYsXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXhIZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgICAgICB0KFwibXNnX2hwYXJzb25zX3F1ZXJ5X3Jlc3VsdHNcIiksXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBtZXNzYWdlQm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInByZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJtc2cgPSByLnJvd2NvdW50ICE9PSAxID8gXCIgcm93cyBcIiA6IFwiIHJvdyBcIjtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG1zZyA9IFwiXCIgKyByLnJvd2NvdW50ICsgcm1zZyArIFwicmV0dXJuZWRcIjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHIucm93Y291bnQgPiAxMDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1zZyA9IG1zZyArIFwiIChvbmx5IGZpcnN0IDEwMCByb3dzIGRpc3BsYXllZClcIjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBtc2cgPSBtc2cgKyBcIi5cIjtcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZUJveC50ZXh0Q29udGVudCA9IG1zZztcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZUJveC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImhwX3NxbF9yZXN1bHRfc3VjY2Vzc1wiKTtcbiAgICAgICAgICAgICAgICAgICAgc2VjdGlvbi5hcHBlbmRDaGlsZChtZXNzYWdlQm94KTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHIucm93Y291bnQpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG1lc3NhZ2VCb3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicHJlXCIpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgb3AgPSByLm9wZXJhdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgb3AgPSBvcCArIChvcC5jaGFyQXQob3AubGVuZ3RoIC0gMSkgPT09IFwiZVwiID8gXCJkLlwiIDogXCJlZC5cIik7XG4gICAgICAgICAgICAgICAgICAgIGxldCBybXNnID0gci5yb3djb3VudCAhPT0gMSA/IFwiIHJvd3MgXCIgOiBcIiByb3cgXCI7XG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2VCb3gudGV4dENvbnRlbnQgPSBcIlwiICsgci5yb3djb3VudCArIHJtc2cgKyBvcDtcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZUJveC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImhwX3NxbF9yZXN1bHRfc3VjY2Vzc1wiKTtcbiAgICAgICAgICAgICAgICAgICAgc2VjdGlvbi5hcHBlbmRDaGlsZChtZXNzYWdlQm94KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsZXQgbWVzc2FnZUJveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwcmVcIik7XG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2VCb3gudGV4dENvbnRlbnQgPSBcIk9wZXJhdGlvbiBzdWNjZWVkZWQuXCI7XG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2VCb3guc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJocF9zcWxfcmVzdWx0X3N1Y2Nlc3NcIik7XG4gICAgICAgICAgICAgICAgICAgIHNlY3Rpb24uYXBwZW5kQ2hpbGQobWVzc2FnZUJveCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZXQgbWVzc2FnZUJveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwcmVcIik7XG4gICAgICAgICAgICAgICAgbWVzc2FnZUJveC50ZXh0Q29udGVudCA9IHIubWVzc2FnZTtcbiAgICAgICAgICAgICAgICBtZXNzYWdlQm94LnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiaHBfc3FsX3Jlc3VsdF9mYWlsdXJlXCIpO1xuICAgICAgICAgICAgICAgIHNlY3Rpb24uYXBwZW5kQ2hpbGQobWVzc2FnZUJveCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBhZGFwdGVkIGZyb20gYWN0aXZlY29kZVxuICAgIGFzeW5jIGJ1aWxkUHJvZygpIHtcbiAgICAgICAgLy8gYXNzZW1ibGUgY29kZSBmcm9tIHByZWZpeCwgc3VmZml4LCBhbmQgZWRpdG9yIGZvciBydW5uaW5nLlxuICAgICAgICBsZXQgcHJvZyA9IHt9O1xuICAgICAgICBpZiAodGhpcy5ocGFyc29ucy5oaWRkZW5QcmVmaXgpIHtcbiAgICAgICAgICAgIHByb2cucHJlZml4ID0gdGhpcy5ocGFyc29ucy5oaWRkZW5QcmVmaXg7XG4gICAgICAgIH1cbiAgICAgICAgcHJvZy5pbnB1dCA9XG4gICAgICAgICAgICB0aGlzLmhwYXJzb25zLmhwYXJzb25zSW5wdXQuZ2V0UGFyc29uc1RleHRBcnJheSgpLmpvaW4oXCIgXCIpICsgXCJcXG5cIjtcbiAgICAgICAgaWYgKHRoaXMuaHBhcnNvbnMuaGlkZGVuU3VmZml4KSB7XG4gICAgICAgICAgICBwcm9nLnN1ZmZpeCA9IHRoaXMuaHBhcnNvbnMuaGlkZGVuU3VmZml4O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocHJvZyk7XG4gICAgfVxuXG4gICAgLy8gY29waWVkIGZyb20gYWN0aXZlY29kZS1zcWxcbiAgICBhc3luYyBsb2dDdXJyZW50QW5zd2VyKCkge1xuICAgICAgICBpZiAodGhpcy51bml0X3Jlc3VsdHMpIHtcbiAgICAgICAgICAgIGxldCBhY3QgPSB7XG4gICAgICAgICAgICAgICAgc2NoZW1lOiBcImV4ZWN1dGlvblwiLFxuICAgICAgICAgICAgICAgIGNvcnJlY3Q6IHRoaXMuZmFpbGVkID09IDAgJiYgdGhpcy5wYXNzZWQgIT0gMCA/IFwiVFwiIDogXCJGXCIsXG4gICAgICAgICAgICAgICAgYW5zd2VyOiB0aGlzLmhwYXJzb25zLmhwYXJzb25zSW5wdXQuZ2V0UGFyc29uc1RleHRBcnJheSgpLFxuICAgICAgICAgICAgICAgIHBlcmNlbnQ6IHRoaXMucGVyY2VudCwgLy8gcGVyY2VudCBpcyBudWxsIGlmIHRoZXJlIGlzIGV4ZWN1dGlvbiBlcnJvclxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGxldCBsb2dEYXRhID0ge1xuICAgICAgICAgICAgICAgIGV2ZW50OiBcImhwYXJzb25zQW5zd2VyXCIsXG4gICAgICAgICAgICAgICAgZGl2X2lkOiB0aGlzLmhwYXJzb25zLmRpdmlkLFxuICAgICAgICAgICAgICAgIGFjdDogSlNPTi5zdHJpbmdpZnkoYWN0KSxcbiAgICAgICAgICAgICAgICBwZXJjZW50OiB0aGlzLnBlcmNlbnQgfHwgMCxcbiAgICAgICAgICAgICAgICBjb3JyZWN0OiBhY3QuY29ycmVjdCxcbiAgICAgICAgICAgICAgICBhbnN3ZXI6IEpTT04uc3RyaW5naWZ5KHsgYmxvY2tzOiBhY3QuYW5zd2VyIH0pLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuaHBhcnNvbnMubG9nQm9va0V2ZW50KGxvZ0RhdGEpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gbWlnaHQgbW92ZSB0byBiYXNlIGNsYXNzIGlmIHVzZWQgYnkgbXVsdGlwbGUgZXhlY3V0aW9uIGJhc2VkIGZlZWRiYWNrXG4gICAgYXV0b2dyYWRlKHJlc3VsdF90YWJsZSkge1xuICAgICAgICB2YXIgdGVzdHMgPSB0aGlzLmhwYXJzb25zLnVuaXR0ZXN0LnNwbGl0KC9cXG4vKTtcbiAgICAgICAgdGhpcy5wYXNzZWQgPSAwO1xuICAgICAgICB0aGlzLmZhaWxlZCA9IDA7XG4gICAgICAgIC8vIFRlc3RzIHNob3VsZCBiZSBvZiB0aGUgZm9ybVxuICAgICAgICAvLyBhc3NlcnQgcm93LGNvbCBvcGVyIHZhbHVlIGZvciBleGFtcGxlXG4gICAgICAgIC8vIGFzc2VydCA0LDQgPT0gM1xuICAgICAgICB2YXIgcmVzdWx0ID0gXCJcIjtcbiAgICAgICAgdGVzdHMgPSB0ZXN0cy5maWx0ZXIoZnVuY3Rpb24gKHMpIHtcbiAgICAgICAgICAgIHJldHVybiBzLmluZGV4T2YoXCJhc3NlcnRcIikgPiAtMTtcbiAgICAgICAgfSk7XG4gICAgICAgIGZvciAobGV0IHRlc3Qgb2YgdGVzdHMpIHtcbiAgICAgICAgICAgIGxldCB3bGlzdCA9IHRlc3Quc3BsaXQoL1xccysvKTtcbiAgICAgICAgICAgIHdsaXN0LnNoaWZ0KCk7XG4gICAgICAgICAgICBsZXQgbG9jID0gd2xpc3Quc2hpZnQoKTtcbiAgICAgICAgICAgIGxldCBvcGVyID0gd2xpc3Quc2hpZnQoKTtcbiAgICAgICAgICAgIGxldCBleHBlY3RlZCA9IHdsaXN0LmpvaW4oXCIgXCIpO1xuICAgICAgICAgICAgbGV0IFtyb3csIGNvbF0gPSBsb2Muc3BsaXQoXCIsXCIpO1xuICAgICAgICAgICAgcmVzdWx0ICs9IHRoaXMudGVzdE9uZUFzc2VydChcbiAgICAgICAgICAgICAgICByb3csXG4gICAgICAgICAgICAgICAgY29sLFxuICAgICAgICAgICAgICAgIG9wZXIsXG4gICAgICAgICAgICAgICAgZXhwZWN0ZWQsXG4gICAgICAgICAgICAgICAgcmVzdWx0X3RhYmxlLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJlc3VsdCArPSBcIlxcblwiO1xuICAgICAgICB9XG4gICAgICAgIGxldCBwY3QgPSAoMTAwICogdGhpcy5wYXNzZWQpIC8gKHRoaXMucGFzc2VkICsgdGhpcy5mYWlsZWQpO1xuICAgICAgICB0aGlzLnBlcmNlbnQgPSBwY3Q7XG4gICAgICAgIHBjdCA9IHBjdC50b0xvY2FsZVN0cmluZyh1bmRlZmluZWQsIHsgbWF4aW11bUZyYWN0aW9uRGlnaXRzOiAyIH0pO1xuICAgICAgICByZXN1bHQgKz0gYFlvdSBwYXNzZWQgJHt0aGlzLnBhc3NlZH0gb3V0IG9mICR7XG4gICAgICAgICAgICB0aGlzLnBhc3NlZCArIHRoaXMuZmFpbGVkXG4gICAgICAgIH0gdGVzdHMgZm9yICR7cGN0fSVgO1xuICAgICAgICB0aGlzLnVuaXRfcmVzdWx0cyA9IGBwZXJjZW50OiR7cGN0fTpwYXNzZWQ6JHt0aGlzLnBhc3NlZH06ZmFpbGVkOiR7dGhpcy5mYWlsZWR9YDtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvLyBtaWdodCBtb3ZlIHRvIGJhc2UgY2xhc3MgaWYgdXNlZCBieSBtdWx0aXBsZSBleGVjdXRpb24gYmFzZWQgZmVlZGJhY2tcbiAgICB0ZXN0T25lQXNzZXJ0KHJvdywgY29sLCBvcGVyLCBleHBlY3RlZCwgcmVzdWx0X3RhYmxlKSB7XG4gICAgICAgIC8vIG1ha2Ugc3VyZSByb3cgYW5kIGNvbCBhcmUgaW4gYm91bmRzXG4gICAgICAgIGxldCBhY3R1YWw7XG4gICAgICAgIGxldCBvdXRwdXQgPSBcIlwiO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgYWN0dWFsID0gcmVzdWx0X3RhYmxlLnZhbHVlc1tyb3ddW2NvbF07XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGlmIChleHBlY3RlZCA9PSBcIk5PX0RBVEFcIikge1xuICAgICAgICAgICAgICAgIHRoaXMucGFzc2VkKys7XG4gICAgICAgICAgICAgICAgb3V0cHV0ID0gYFBhc3NlZDogTm8gZGF0YSBpbiByb3cgJHtyb3d9LCBjb2x1bW4gJHtjb2x9YDtcbiAgICAgICAgICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBvdXRwdXQgPSBgRmFpbGVkOiBOb3QgZW5vdWdoIGRhdGEgdG8gY2hlY2sgcm93ICR7cm93fSBvciBjb2x1bW4gJHtjb2x9YDtcbiAgICAgICAgICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG9wZXJhdG9ycyA9IHtcbiAgICAgICAgICAgIFwiPT1cIjogZnVuY3Rpb24gKG9wZXJhbmQxLCBvcGVyYW5kMikge1xuICAgICAgICAgICAgICAgIHJldHVybiBvcGVyYW5kMSA9PSBvcGVyYW5kMjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcIiE9XCI6IGZ1bmN0aW9uIChvcGVyYW5kMSwgb3BlcmFuZDIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gb3BlcmFuZDEgIT0gb3BlcmFuZDI7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCI+XCI6IGZ1bmN0aW9uIChvcGVyYW5kMSwgb3BlcmFuZDIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gb3BlcmFuZDEgPiBvcGVyYW5kMjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcIjxcIjogZnVuY3Rpb24gKG9wZXJhbmQxLCBvcGVyYW5kMikge1xuICAgICAgICAgICAgICAgIHJldHVybiBvcGVyYW5kMSA+IG9wZXJhbmQyO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICAgICAgbGV0IHJlcyA9IG9wZXJhdG9yc1tvcGVyXShhY3R1YWwsIGV4cGVjdGVkKTtcbiAgICAgICAgaWYgKHJlcykge1xuICAgICAgICAgICAgb3V0cHV0ID0gYFBhc3M6ICR7YWN0dWFsfSAke29wZXJ9ICR7ZXhwZWN0ZWR9IGluIHJvdyAke3Jvd30gY29sdW1uICR7cmVzdWx0X3RhYmxlLmNvbHVtbnNbY29sXX1gO1xuICAgICAgICAgICAgdGhpcy5wYXNzZWQrKztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG91dHB1dCA9IGBGYWlsZWQgJHthY3R1YWx9ICR7b3Blcn0gJHtleHBlY3RlZH0gaW4gcm93ICR7cm93fSBjb2x1bW4gJHtyZXN1bHRfdGFibGUuY29sdW1uc1tjb2xdfWA7XG4gICAgICAgICAgICB0aGlzLmZhaWxlZCsrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgbG9hZCB9IGZyb20gXCIuLi8uLi9jb21tb24vanMvcnNpMThuLmpzXCI7XG5cbmxvYWQoe1xuICAgIFwicHQtYnJcIjoge1xuICAgICAgICBtc2dfaHBhcnNvbnNfZHJhZ19ibG9ja3NfY29kZTpcbiAgICAgICAgICAgIFwiQXJyYXN0ZSBvdSBjbGlxdWUgbm9zIGJsb2NvcyBhYmFpeG8gcGFyYSBmb3JtYXIgc2V1IGPDs2RpZ286XCIsXG4gICAgICAgIG1zZ19ocGFyc29uc19kcmFnX2Jsb2Nrc19hbnN3ZXI6XG4gICAgICAgICAgICBcIkFycmFzdGUgb3UgY2xpcXVlIG5vcyBibG9jb3MgYWJhaXhvIHBhcmEgZm9ybWFyIHN1YSByZXNwb3N0YTpcIixcbiAgICAgICAgbXNnX2hwYXJzb25zX2Ryb3BfYmxvY2tzX2NvZGU6XG4gICAgICAgICAgICBcIlNldSBjw7NkaWdvIChjbGlxdWUgZW0gdW0gYmxvY28gcGFyYSByZW1vdsOqLWxvKTpcIixcbiAgICAgICAgbXNnX2hwYXJzb25zX2Ryb3BfYmxvY2tzX2Fuc3dlcjpcbiAgICAgICAgICAgIFwiU3VhIHJlc3Bvc3RhIChjbGlxdWUgZW0gdW0gYmxvY28gcGFyYSByZW1vdsOqLWxvKTpcIixcbiAgICAgICAgbXNnX2hwYXJzb25zX2F2YWlsYWJsZV9ibG9ja3M6IFwiQmxvY29zIGRpc3BvbsOtdmVpc1wiLFxuICAgICAgICBtc2dfaHBhcnNvbnNfYW5zd2VyX2FyZWE6IFwiw4FyZWEgZGUgcmVzcG9zdGFcIixcbiAgICAgICAgbXNnX2hwYXJzb25zX2tleWJvYXJkX2lkbGVfaW5zdHJ1Y3Rpb25zOlxuICAgICAgICAgICAgXCJQcmVzc2lvbmUgRW50ZXIgcGFyYSBtb3ZlciBibG9jb3MgY29tIG8gdGVjbGFkby5cIixcbiAgICAgICAgbXNnX2hwYXJzb25zX2tleWJvYXJkX2luc3RydWN0aW9uczpcbiAgICAgICAgICAgIFwiVXNlIGFzIHNldGFzIEVzcXVlcmRhIGUgRGlyZWl0YSBwYXJhIGVzY29saGVyIHVtIGJsb2NvIG5lc3RhIMOhcmVhLiBVc2UgYXMgc2V0YXMgUGFyYSBDaW1hIGUgUGFyYSBCYWl4byBwYXJhIGFsdGVybmFyIGVudHJlIG9zIGJsb2NvcyBkaXNwb27DrXZlaXMgZSBhIMOhcmVhIGRlIHJlc3Bvc3RhLiBQcmVzc2lvbmUgRW50ZXIgcGFyYSBtb3ZlciBvIGJsb2NvIGF0dWFsLiBQcmVzc2lvbmUgRXNjYXBlIG91IFRhYiBwYXJhIHRlcm1pbmFyLlwiLFxuICAgICAgICBtc2dfaHBhcnNvbnNfYmxvY2tfbW92ZWRfdG9fYW5zd2VyOiBcIiQxIG1vdmlkbyBwYXJhIGEgw6FyZWEgZGUgcmVzcG9zdGFcIixcbiAgICAgICAgbXNnX2hwYXJzb25zX2Jsb2NrX21vdmVkX3RvX2F2YWlsYWJsZTogXCIkMSBtb3ZpZG8gcGFyYSBvcyBibG9jb3MgZGlzcG9uw612ZWlzXCIsXG4gICAgICAgIG1zZ19ocGFyc29uc19tb3Zpbmc6IFwiTW92ZW5kbyAkMVwiLFxuICAgICAgICBtc2dfaHBhcnNvbnNfa2V5Ym9hcmRfZmluaXNoZWQ6IFwiTW92aW1lbnRhw6fDo28gZGUgYmxvY29zIHBlbG8gdGVjbGFkbyBjb25jbHXDrWRhLlwiLFxuICAgICAgICBtc2dfaHBhcnNvbnNfY2hlY2tfbWU6IFwiVmVyaWZpY2FyXCIsXG4gICAgICAgIG1zZ19ocGFyc29uc19ibG9ja3NfcmVzZXQ6IFwiQmxvY29zIHJlZGVmaW5pZG9zLlwiLFxuICAgICAgICBtc2dfaHBhcnNvbnNfcnVuOiBcIkV4ZWN1dGFyXCIsXG4gICAgICAgIG1zZ19ocGFyc29uc19xdWVyeV9yZXN1bHRzOiBcIlJlc3VsdGFkb3MgZGEgY29uc3VsdGFcIixcbiAgICB9LFxufSk7XG4iLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCJpbXBvcnQgeyBNaWNyb1BhcnNvbnNFdmVudCB9IGZyb20gXCIuL0xvZ2dpbmdFdmVudHNcIjtcbmltcG9ydCB7IFBhcnNvbnNJbnB1dCB9IGZyb20gXCIuL1BhcnNvbnNJbnB1dFwiO1xuaW1wb3J0IFwiLi9zdHlsZS9zdHlsZS5jc3NcIjtcbmltcG9ydCBobGpzIGZyb20gXCJoaWdobGlnaHQuanMvbGliL2NvcmVcIjtcblxuaW1wb3J0IGphdmFzY3JpcHQgZnJvbSBcImhpZ2hsaWdodC5qcy9saWIvbGFuZ3VhZ2VzL2phdmFzY3JpcHRcIjtcbmltcG9ydCBweXRob24gZnJvbSBcImhpZ2hsaWdodC5qcy9saWIvbGFuZ3VhZ2VzL3B5dGhvblwiO1xuaW1wb3J0IGphdmEgZnJvbSBcImhpZ2hsaWdodC5qcy9saWIvbGFuZ3VhZ2VzL2phdmFcIjtcbmltcG9ydCBzcWwgZnJvbSBcImhpZ2hsaWdodC5qcy9saWIvbGFuZ3VhZ2VzL3NxbFwiO1xuaW1wb3J0IHhtbCBmcm9tIFwiaGlnaGxpZ2h0LmpzL2xpYi9sYW5ndWFnZXMveG1sXCI7XG5cbmhsanMucmVnaXN0ZXJMYW5ndWFnZShcImphdmFzY3JpcHRcIiwgamF2YXNjcmlwdCk7XG5obGpzLnJlZ2lzdGVyTGFuZ3VhZ2UoXCJzcWxcIiwgc3FsKTtcbmhsanMucmVnaXN0ZXJMYW5ndWFnZShcImphdmFcIiwgamF2YSk7XG5obGpzLnJlZ2lzdGVyTGFuZ3VhZ2UoXCJ4bWxcIiwgeG1sKTtcbmhsanMucmVnaXN0ZXJMYW5ndWFnZShcInB5dGhvblwiLCBweXRob24pO1xuXG5leHBvcnQgY2xhc3MgTWljcm9QYXJzb25zRWxlbWVudCBleHRlbmRzIEhUTUxFbGVtZW50IHtcbiAgcHJpdmF0ZSByb290OiBIVE1MRWxlbWVudDtcblxuICBwcml2YXRlIF9wYXJzb25zRGF0YTogQXJyYXk8c3RyaW5nPjtcbiAgcHVibGljIHBhcnNvbnNFeHBsYW5hdGlvbjogQXJyYXk8c3RyaW5nPiB8IG51bGw7XG4gIHB1YmxpYyBocGFyc29uc0lucHV0OiBJUGFyc29uc0lucHV0O1xuICBwcml2YXRlIGlucHV0VHlwZTogc3RyaW5nO1xuXG4gIHB1YmxpYyBzdGF0aWMgdG9vbENvdW50OiBudW1iZXIgPSAwO1xuXG4gIHB1YmxpYyB0b29sTnVtYmVyOiBudW1iZXI7XG5cbiAgcHVibGljIHRlbXBvcmFyeUlucHV0RXZlbnQ6IE1pY3JvUGFyc29uc0V2ZW50LklucHV0IHwgbnVsbDtcblxuICBwdWJsaWMgbGFuZ3VhZ2U6IHN0cmluZztcbiAgcHVibGljIGhsanNMYW5ndWFnZTogc3RyaW5nIHwgdW5kZWZpbmVkO1xuXG4gIHB1YmxpYyBjb2RlQmVmb3JlOiBzdHJpbmcgfCBudWxsO1xuICBwdWJsaWMgY29kZUFmdGVyOiBzdHJpbmcgfCBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICBNaWNyb1BhcnNvbnNFbGVtZW50LnRvb2xDb3VudCArPSAxO1xuICAgIHRoaXMudG9vbE51bWJlciA9IE1pY3JvUGFyc29uc0VsZW1lbnQudG9vbENvdW50O1xuXG4gICAgdGhpcy5yb290ID0gdGhpcztcblxuICAgIGNvbnN0IHJldXNhYmxlID0gdGhpcy5nZXRBdHRyaWJ1dGUoXCJyZXVzZVwiKSA/IHRydWUgOiBmYWxzZTtcbiAgICBjb25zdCByYW5kb21pemUgPSB0aGlzLmdldEF0dHJpYnV0ZShcInJhbmRvbWl6ZVwiKSA/IHRydWUgOiBmYWxzZTtcbiAgICB0aGlzLmhwYXJzb25zSW5wdXQgPSBuZXcgUGFyc29uc0lucHV0KHRoaXMsIHJldXNhYmxlLCByYW5kb21pemUpO1xuXG4gICAgLy8gYSBkaXYgd3JhcHBpbmcgdGhlIGlucHV0IGFuZCB0aGUgdGVzdCBjYXNlIHN0YXR1c1xuICAgIC8vIGluaXQgcmVnZXggaW5wdXQgYmFzZWQgb24gdGhlIGlucHV0IHR5cGVcbiAgICB0aGlzLl9wYXJzb25zRGF0YSA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XG4gICAgdGhpcy5wYXJzb25zRXhwbGFuYXRpb24gPSBudWxsO1xuICAgIHRoaXMuaW5wdXRUeXBlID0gXCJwYXJzb25zXCI7XG4gICAgLy8gc3VwcG9ydCBhbGwgbGFuZ3VhZ2VzIHNwZWNpZmllZCBoZXJlLCBvciBcInJhd1wiIGZvciByYXcgaHRtbC5cbiAgICAvLyBmb3Igb3RoZXIgbGFuZ3VhZ2VzIG9yIG5vbmUsIHJlbmRlciB0ZXh0IGFzLWlzLlxuICAgIHRoaXMubGFuZ3VhZ2UgPSB0aGlzLmdldEF0dHJpYnV0ZShcImxhbmd1YWdlXCIpIHx8IFwibm9uZVwiO1xuICAgIGxldCBsYW5ndWFnZU1hcCA9IG5ldyBNYXAoXG4gICAgICBPYmplY3QuZW50cmllcyh7XG4gICAgICAgIGh0bWw6IFwieG1sXCIsXG4gICAgICAgIHB5dGhvbjogXCJweXRob25cIixcbiAgICAgICAgamF2YXNjcmlwdDogXCJqYXZhc2NyaXB0XCIsXG4gICAgICAgIGphdmE6IFwiamF2YVwiLFxuICAgICAgICBzcWw6IFwic3FsXCIsXG4gICAgICB9KSxcbiAgICApO1xuICAgIHRoaXMuaGxqc0xhbmd1YWdlID0gbGFuZ3VhZ2VNYXAuZ2V0KHRoaXMubGFuZ3VhZ2UpO1xuXG4gICAgdGhpcy5pbml0SW5wdXQoKTtcbiAgICB0aGlzLnRlbXBvcmFyeUlucHV0RXZlbnQgPSBudWxsO1xuXG4gICAgdGhpcy5jb2RlQmVmb3JlID0gbnVsbDtcbiAgICB0aGlzLmNvZGVBZnRlciA9IG51bGw7XG4gIH1cblxuICBzZXQgcGFyc29uc0RhdGEoZGF0YTogQXJyYXk8c3RyaW5nPikge1xuICAgIHRoaXMuX3BhcnNvbnNEYXRhID0gZGF0YTtcbiAgICBpZiAodGhpcy5pbnB1dFR5cGUgPT0gXCJwYXJzb25zXCIpIHtcbiAgICAgICh0aGlzLmhwYXJzb25zSW5wdXQgYXMgUGFyc29uc0lucHV0KS5zZXRTb3VyY2VCbG9ja3MoXG4gICAgICAgIGRhdGEsXG4gICAgICAgIHRoaXMucGFyc29uc0V4cGxhbmF0aW9uLFxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBnZXQgcGFyc29uc0RhdGEoKTogQXJyYXk8c3RyaW5nPiB7XG4gICAgcmV0dXJuIHRoaXMuX3BhcnNvbnNEYXRhO1xuICB9XG5cbiAgcHVibGljIGxvZ0V2ZW50ID0gKGV2ZW50Q29udGVudDogYW55KTogdm9pZCA9PiB7XG4gICAgY29uc3QgZXYgPSBuZXcgQ3VzdG9tRXZlbnQoXCJtaWNyby1wYXJzb25zXCIsIHtcbiAgICAgIGJ1YmJsZXM6IHRydWUsXG4gICAgICBkZXRhaWw6IHsgLi4uZXZlbnRDb250ZW50IH0sXG4gICAgfSk7XG4gICAgdGhpcy5kaXNwYXRjaEV2ZW50KGV2KTtcbiAgfTtcblxuICBwcml2YXRlIGluaXRJbnB1dCgpIHtcbiAgICAvLyB0aGUgb25seSBtb2RlIHN1cHBvcnRpbmcgaXMgcGFyc29ucyByaWdodCBub3c7IHJlbW92ZWQgdGhlIHRleHQgZW50cnkgbW9kZVxuICAgIHRoaXMuaW5wdXRUeXBlID0gXCJwYXJzb25zXCI7XG4gICAgdGhpcy5fcGFyc29uc0RhdGEgPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xuICAgIHRoaXMucGFyc29uc0V4cGxhbmF0aW9uID0gbnVsbDtcbiAgICBjb25zdCByZXVzYWJsZSA9IHRoaXMuZ2V0QXR0cmlidXRlKFwicmV1c2VcIikgIT0gbnVsbCA/IHRydWUgOiBmYWxzZTtcbiAgICBjb25zdCByYW5kb21pemUgPSB0aGlzLmdldEF0dHJpYnV0ZShcInJhbmRvbWl6ZVwiKSAhPSBudWxsID8gdHJ1ZSA6IGZhbHNlO1xuICAgIHRoaXMuaHBhcnNvbnNJbnB1dCA9IG5ldyBQYXJzb25zSW5wdXQodGhpcywgcmV1c2FibGUsIHJhbmRvbWl6ZSk7XG4gICAgdGhpcy5yb290LmFwcGVuZENoaWxkKHRoaXMuaHBhcnNvbnNJbnB1dC5lbCk7XG4gIH1cblxuICBwdWJsaWMgcmVzZXRJbnB1dCgpIHtcbiAgICAodGhpcy5ocGFyc29uc0lucHV0IGFzIFBhcnNvbnNJbnB1dCkucmVzZXRJbnB1dCgpO1xuICAgIGNvbnN0IHJlc2V0RXZlbnQ6IE1pY3JvUGFyc29uc0V2ZW50LlJlc2V0ID0ge1xuICAgICAgdHlwZTogXCJyZXNldFwiLFxuICAgIH07XG4gICAgdGhpcy5sb2dFdmVudChyZXNldEV2ZW50KTtcbiAgfVxuXG4gIC8vIHJlc3RvcmUgc3R1ZGVudCBhbnN3ZXIgZnJvbSBvdXRzaWRlIHN0b3JhZ2VcbiAgcHVibGljIHJlc3RvcmVBbnN3ZXIoYW5zd2VyOiBBcnJheTxzdHJpbmc+KSB7XG4gICAgdGhpcy5ocGFyc29uc0lucHV0LnJlc3RvcmVBbnN3ZXIoYW5zd2VyKTtcbiAgfVxuXG4gIHB1YmxpYyByZXN0b3JlQW5zd2VyQnlJbmRpY2VzKGluZGljZXM6IEFycmF5PG51bWJlcj4pIHtcbiAgICAodGhpcy5ocGFyc29uc0lucHV0IGFzIFBhcnNvbnNJbnB1dCkucmVzdG9yZUFuc3dlckJ5SW5kaWNlcyhpbmRpY2VzKTtcbiAgfVxuXG4gIHB1YmxpYyBnZXRDdXJyZW50SW5wdXQoYWRkU3BhY2U6IGJvb2xlYW4pIHtcbiAgICByZXR1cm4gdGhpcy5ocGFyc29uc0lucHV0LmdldFRleHQoYWRkU3BhY2UpO1xuICB9XG5cbiAgcHVibGljIGdldFBhcnNvbnNUZXh0QXJyYXkoKSB7XG4gICAgcmV0dXJuICh0aGlzLmhwYXJzb25zSW5wdXQgYXMgUGFyc29uc0lucHV0KS5fZ2V0VGV4dEFycmF5KCk7XG4gIH1cblxuICBwdWJsaWMgZ2V0QmxvY2tJbmRpY2VzKCk6IG51bWJlcltdIHtcbiAgICByZXR1cm4gKHRoaXMuaHBhcnNvbnNJbnB1dCBhcyBQYXJzb25zSW5wdXQpLmdldEJsb2NrSW5kaWNlcygpO1xuICB9XG5cbiAgcHVibGljIHJlZnJlc2hCbG9ja0FyaWEoKTogdm9pZCB7XG4gICAgKHRoaXMuaHBhcnNvbnNJbnB1dCBhcyBQYXJzb25zSW5wdXQpLnJlZnJlc2hCbG9ja0FyaWEoKTtcbiAgfVxuXG4gIHB1YmxpYyBzZXRDb2RlQ29udGV4dChwcm9wczoge1xuICAgIGJlZm9yZTogc3RyaW5nIHwgbnVsbDtcbiAgICBhZnRlcjogc3RyaW5nIHwgbnVsbDtcbiAgfSkge1xuICAgIGlmIChwcm9wcy5iZWZvcmUpIHtcbiAgICAgIHRoaXMuY29kZUJlZm9yZSA9IHByb3BzLmJlZm9yZTtcbiAgICAgIGxldCBjb250YWluZXI6IEhUTUxQcmVFbGVtZW50O1xuICAgICAgaWYgKHRoaXMucXVlcnlTZWxlY3RvcihcIi5jb250ZXh0LmJlZm9yZVwiKSkge1xuICAgICAgICBjb250YWluZXIgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCIuY29udGV4dC5iZWZvcmVcIikgYXMgSFRNTFByZUVsZW1lbnQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicHJlXCIpO1xuICAgICAgICBjb250YWluZXIuY2xhc3NOYW1lID0gXCJjb250ZXh0IGJlZm9yZVwiO1xuICAgICAgICB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCIuaHBhcnNvbnMtaW5wdXRcIikhLmluc2VydEJlZm9yZShcbiAgICAgICAgICBjb250YWluZXIsXG4gICAgICAgICAgdGhpcy5xdWVyeVNlbGVjdG9yKFwiLmRyb3AtYXJlYVwiKSxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIGNvbnRhaW5lci5pbm5lckhUTUwgPSB0aGlzLmNvZGVCZWZvcmU7XG4gICAgICBpZiAodGhpcy5obGpzTGFuZ3VhZ2UpIHtcbiAgICAgICAgY29udGFpbmVyLmNsYXNzTmFtZSA9IFwiY29udGV4dCBiZWZvcmVcIjtcbiAgICAgICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQodGhpcy5obGpzTGFuZ3VhZ2UpO1xuICAgICAgICBobGpzLmhpZ2hsaWdodEVsZW1lbnQoY29udGFpbmVyKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHByb3BzLmFmdGVyKSB7XG4gICAgICB0aGlzLmNvZGVBZnRlciA9IHByb3BzLmFmdGVyO1xuICAgICAgbGV0IGNvbnRhaW5lcjogSFRNTFByZUVsZW1lbnQ7XG4gICAgICBpZiAodGhpcy5xdWVyeVNlbGVjdG9yKFwiLmNvbnRleHQuYWZ0ZXJcIikpIHtcbiAgICAgICAgY29udGFpbmVyID0gdGhpcy5xdWVyeVNlbGVjdG9yKFwiLmNvbnRleHQuYWZ0ZXJcIikgYXMgSFRNTFByZUVsZW1lbnQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicHJlXCIpO1xuICAgICAgICBjb250YWluZXIuY2xhc3NOYW1lID0gXCJjb250ZXh0IGFmdGVyXCI7XG4gICAgICAgIHRoaXMucXVlcnlTZWxlY3RvcihcIi5ocGFyc29ucy1pbnB1dFwiKSEuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcbiAgICAgIH1cbiAgICAgIGNvbnRhaW5lci5pbm5lckhUTUwgPSB0aGlzLmNvZGVBZnRlcjtcbiAgICAgIGlmICh0aGlzLmhsanNMYW5ndWFnZSkge1xuICAgICAgICBjb250YWluZXIuY2xhc3NOYW1lID0gXCJjb250ZXh0IGFmdGVyXCI7XG4gICAgICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKHRoaXMuaGxqc0xhbmd1YWdlKTtcbiAgICAgICAgaGxqcy5oaWdobGlnaHRFbGVtZW50KGNvbnRhaW5lcik7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCBJbml0TWljcm9QYXJzb25zID0gKHByb3BzOiBNaWNyb1BhcnNvbnNQcm9wcykgPT4ge1xuICBsZXQgcGFyZW50RWxlbTogSFRNTEVsZW1lbnQgfCBudWxsO1xuICB0cnkge1xuICAgIHBhcmVudEVsZW0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHByb3BzLnNlbGVjdG9yKTtcbiAgfSBjYXRjaCB7XG4gICAgdGhyb3cgXCJtaWNyby1wYXJzb25zOiBpbml0OiBzZWxlY3RvciBlcnJvclwiO1xuICB9XG4gIGlmIChwYXJlbnRFbGVtID09IG51bGwgfHwgcGFyZW50RWxlbS50YWdOYW1lICE9IFwiRElWXCIpIHtcbiAgICB0aHJvdyBcIm1pY3JvLXBhcnNvbnM6IGVsZW1lbnQgbm90IGEgZGl2XCI7XG4gIH1cbiAgY29uc3QgbGFuZ3VhZ2UgPVxuICAgIFtcImphdmFzY3JpcHRcIiwgXCJzcWxcIiwgXCJqYXZhXCIsIFwiaHRtbFwiLCBcInB5dGhvblwiLCBcInJhd1wiXS5pbmRleE9mKFxuICAgICAgcHJvcHMubGFuZ3VhZ2UgfHwgXCJcIixcbiAgICApID09IC0xXG4gICAgICA/IFwiXCJcbiAgICAgIDogYGxhbmd1YWdlPScke3Byb3BzLmxhbmd1YWdlfSdgO1xuICBjb25zdCBpZCA9IHByb3BzLmlkID8gYGlkPScke3Byb3BzLmlkfSdgIDogXCJcIjtcbiAgY29uc3QgaW5uZXJIVE1MID0gYDxtaWNyby1wYXJzb25zICR7cHJvcHMucmV1c2UgPyBcInJldXNlXCIgOiBcIlwifSAke3Byb3BzLnJhbmRvbWl6ZSA9PT0gZmFsc2UgPyBcIlwiIDogXCJyYW5kb21pemVcIn0gJHtsYW5ndWFnZX0gJHtpZH0+PC9taWNyby1wYXJzb25zPmA7XG4gIHBhcmVudEVsZW0uaW5uZXJIVE1MID0gaW5uZXJIVE1MO1xuICBjb25zdCBtUGFyc29ucyA9IHBhcmVudEVsZW0uZmlyc3RDaGlsZCBhcyBNaWNyb1BhcnNvbnNFbGVtZW50O1xuICBtUGFyc29ucy5wYXJzb25zRXhwbGFuYXRpb24gPSBwcm9wcy5wYXJzb25zVG9vbHRpcHM7XG4gIG1QYXJzb25zLnBhcnNvbnNEYXRhID0gcHJvcHMucGFyc29uc0Jsb2NrcztcbiAgaWYgKHByb3BzLmNvbnRleHQpIHtcbiAgICBtUGFyc29ucy5zZXRDb2RlQ29udGV4dChwcm9wcy5jb250ZXh0KTtcbiAgfVxufTtcblxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKFwibWljcm8tcGFyc29uc1wiLCBNaWNyb1BhcnNvbnNFbGVtZW50KTtcbiIsImltcG9ydCBIUGFyc29uc0ZlZWRiYWNrIGZyb20gXCIuL2hwYXJzb25zRmVlZGJhY2tcIjtcbmltcG9ydCB7IHQgfSBmcm9tIFwiLi4vLi4vY29tbW9uL2pzL3JzaTE4bi5qc1wiO1xuaW1wb3J0IEJsb2NrQmFzZWRHcmFkZXIgZnJvbSBcIi4vYmxvY2tHcmFkZXIuanNcIjtcbmltcG9ydCBcIi4uLy4uL3BhcnNvbnMvanMvcGFyc29ucy1pMThuLmVuLmpzXCI7XG5pbXBvcnQgXCIuLi8uLi9wYXJzb25zL2pzL3BhcnNvbnMtaTE4bi5wdC1ici5qc1wiO1xuaW1wb3J0IFwiLi4vLi4vcGFyc29ucy9qcy9wYXJzb25zLWkxOG4uc3ItQ3lybC5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCbG9ja0ZlZWRiYWNrIGV4dGVuZHMgSFBhcnNvbnNGZWVkYmFjayB7XG4gICAgY3JlYXRlT3V0cHV0KCkge1xuICAgICAgICAvLyBCbG9jayBiYXNlZCBncmFkaW5nIG91dHB1dFxuICAgICAgICB0aGlzLm1lc3NhZ2VEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB0aGlzLmZlZWRiYWNrTGl2ZVJlZ2lvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHRoaXMuZmVlZGJhY2tMaXZlUmVnaW9uLnNldEF0dHJpYnV0ZShcInJvbGVcIiwgXCJzdGF0dXNcIik7XG4gICAgICAgIHRoaXMuZmVlZGJhY2tMaXZlUmVnaW9uLnNldEF0dHJpYnV0ZShcImFyaWEtbGl2ZVwiLCBcInBvbGl0ZVwiKTtcbiAgICAgICAgdGhpcy5mZWVkYmFja0xpdmVSZWdpb24uc2V0QXR0cmlidXRlKFwiYXJpYS1hdG9taWNcIiwgXCJ0cnVlXCIpO1xuICAgICAgICB0aGlzLmZlZWRiYWNrTGl2ZVJlZ2lvbi5jbGFzc0xpc3QuYWRkKFwidmlzdWFsbHloaWRkZW5cIik7XG4gICAgICAgIHRoaXMuaHBhcnNvbnMub3V0ZXJEaXYuYXBwZW5kQ2hpbGQodGhpcy5tZXNzYWdlRGl2KTtcbiAgICAgICAgdGhpcy5ocGFyc29ucy5vdXRlckRpdi5hcHBlbmRDaGlsZCh0aGlzLmZlZWRiYWNrTGl2ZVJlZ2lvbik7XG4gICAgfVxuXG4gICAgY3VzdG9taXplVUkoKSB7XG4gICAgICAgIHRoaXMuaHBhcnNvbnMucnVuQnV0dG9uLnRleHRDb250ZW50ID0gdChcIm1zZ19ocGFyc29uc19jaGVja19tZVwiKTtcbiAgICB9XG5cbiAgICBpbml0KCkge1xuICAgICAgICB0aGlzLmNoZWNrQ291bnQgPSAwO1xuICAgICAgICB0aGlzLnNvbHZlZCA9IGZhbHNlO1xuICAgICAgICAvLyBUT0RPOiBub3Qgc3VyZSB3aGF0IGlzIHRoZSBiZXN0IHdheSB0byBkbyB0aGlzXG4gICAgICAgIHRoaXMuZ3JhZGVyID0gbmV3IEJsb2NrQmFzZWRHcmFkZXIoKTtcbiAgICAgICAgLy8gR3JhZGUgb24gYmxvY2sgKmNvbnRlbnQqLCBub3Qgb24gYmxvY2sgaW5kZXguIFR3byBibG9ja3MgaG9sZGluZyB0aGVcbiAgICAgICAgLy8gc2FtZSB0ZXh0IGFyZSBpbnRlcmNoYW5nZWFibGUsIHNvIGEgc29sdXRpb24gdGhhdCB1c2VzIHRoZSBzYW1lIHRleHRcbiAgICAgICAgLy8gdHdpY2UgKGlzc3VlICMxMTk0OiBhIHF1ZXJ5IHdpdGggdHdvIFwiPVwiIGJsb2NrcykgbXVzdCBhY2NlcHQgZWl0aGVyXG4gICAgICAgIC8vIG9uZSBpbiBlaXRoZXIgcG9zaXRpb24uIENvbnRlbnQgaXMgcmVhZCBmcm9tIHRoZSBhdXRob3JlZCBzb3VyY2VcbiAgICAgICAgLy8gYmxvY2tzIHJhdGhlciB0aGFuIGZyb20gdGhlIERPTSBzbyB0aGF0IG1hdGggYmxvY2tzIC0tIHdob3NlIHJlbmRlcmVkXG4gICAgICAgIC8vIHRleHQgTWF0aEpheCByZXdyaXRlcyAtLSBzdGlsbCBjb21wYXJlIGNvcnJlY3RseS5cbiAgICAgICAgdGhpcy5zb2x1dGlvbiA9IHRoaXMuaHBhcnNvbnMuYmxvY2tBbnN3ZXIubWFwKChpbmRleCkgPT5cbiAgICAgICAgICAgIHRoaXMuYmxvY2tDb250ZW50KGluZGV4KSxcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5ncmFkZXIuc29sdXRpb24gPSB0aGlzLnNvbHV0aW9uO1xuICAgICAgICB0aGlzLmFuc3dlckFyZWEgPVxuICAgICAgICAgICAgdGhpcy5ocGFyc29ucy5ocGFyc29uc0lucHV0LnF1ZXJ5U2VsZWN0b3IoXCIuZHJvcC1hcmVhXCIpO1xuICAgIH1cblxuICAgIC8vIFRoZSBhdXRob3JlZCBzb3VyY2UgdGV4dCBmb3IgYSBibG9jayBpbmRleC4gQW4gaW5kZXggd2l0aCBubyBzb3VyY2UgYmxvY2tcbiAgICAvLyBnZXRzIGEgc2VudGluZWwgdGhhdCBjYW4gbmV2ZXIgbWF0Y2ggYSBzb2x1dGlvbiBibG9jay5cbiAgICBibG9ja0NvbnRlbnQoaW5kZXgpIHtcbiAgICAgICAgY29uc3QgYmxvY2tzID0gdGhpcy5ocGFyc29ucy5vcmlnaW5hbEJsb2NrcyB8fCBbXTtcbiAgICAgICAgY29uc3QgY29udGVudCA9IGJsb2Nrc1tOdW1iZXIoaW5kZXgpXTtcbiAgICAgICAgcmV0dXJuIGNvbnRlbnQgPT09IHVuZGVmaW5lZCA/IGBcXHUwMDAwdW5rbm93bi1ibG9jay0ke2luZGV4fWAgOiBjb250ZW50O1xuICAgIH1cblxuICAgIC8vIFRoZSBjb250ZW50cyBvZiB0aGUgYmxvY2tzIGN1cnJlbnRseSBpbiB0aGUgYW5zd2VyIGFyZWEsIGluIG9yZGVyLlxuICAgIGN1cnJlbnRBbnN3ZXJDb250ZW50KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5ocGFyc29ucy5ocGFyc29uc0lucHV0XG4gICAgICAgICAgICAuZ2V0QmxvY2tJbmRpY2VzKClcbiAgICAgICAgICAgIC5tYXAoKGluZGV4KSA9PiB0aGlzLmJsb2NrQ29udGVudChpbmRleCkpO1xuICAgIH1cblxuICAgIC8vIENhbGxlZCB3aGVuIGNoZWNrIGJ1dHRvbiBjbGlja2VkIChibG9jay1iYXNlZCBGZWVkYmFjaylcbiAgICBhc3luYyBydW5CdXR0b25IYW5kbGVyKCkge1xuICAgICAgICB0aGlzLmNoZWNrQ3VycmVudEFuc3dlcigpO1xuICAgICAgICB0aGlzLmxvZ0N1cnJlbnRBbnN3ZXIoKTtcbiAgICAgICAgdGhpcy5yZW5kZXJGZWVkYmFjaygpO1xuICAgIH1cblxuICAgIGFzeW5jIGxvZ0N1cnJlbnRBbnN3ZXIoKSB7XG4gICAgICAgIGxldCBhY3QgPSB7XG4gICAgICAgICAgICBzY2hlbWU6IFwiYmxvY2tcIixcbiAgICAgICAgICAgIGNvcnJlY3Q6IHRoaXMuZ3JhZGVyLmdyYWRlclN0YXRlID09IFwiY29ycmVjdFwiID8gXCJUXCIgOiBcIkZcIixcbiAgICAgICAgICAgIGFuc3dlcjogdGhpcy5ocGFyc29ucy5ocGFyc29uc0lucHV0LmdldEJsb2NrSW5kaWNlcygpLFxuICAgICAgICAgICAgcGVyY2VudDogdGhpcy5ncmFkZXIucGVyY2VudCxcbiAgICAgICAgfTtcbiAgICAgICAgbGV0IGxvZ0RhdGEgPSB7XG4gICAgICAgICAgICBldmVudDogXCJocGFyc29uc0Fuc3dlclwiLFxuICAgICAgICAgICAgZGl2X2lkOiB0aGlzLmhwYXJzb25zLmRpdmlkLFxuICAgICAgICAgICAgYWN0OiBKU09OLnN0cmluZ2lmeShhY3QpLFxuICAgICAgICAgICAgYW5zd2VyOiBKU09OLnN0cmluZ2lmeSh7IGJsb2NrczogYWN0LmFuc3dlciB9KSxcbiAgICAgICAgICAgIHBlcmNlbnQ6IHRoaXMuZ3JhZGVyLnBlcmNlbnQsXG4gICAgICAgICAgICBjb3JyZWN0OiBhY3QuY29ycmVjdCxcbiAgICAgICAgfTtcbiAgICAgICAgYXdhaXQgdGhpcy5ocGFyc29ucy5sb2dCb29rRXZlbnQobG9nRGF0YSk7XG4gICAgfVxuXG4gICAgLy8gVXNlZCBmb3IgYmxvY2stYmFzZWQgZmVlZGJhY2tcbiAgICBjaGVja0N1cnJlbnRBbnN3ZXIoKSB7XG4gICAgICAgIGlmICghdGhpcy5zb2x2ZWQpIHtcbiAgICAgICAgICAgIHRoaXMuY2hlY2tDb3VudCsrO1xuICAgICAgICAgICAgdGhpcy5jbGVhckZlZWRiYWNrKCk7XG4gICAgICAgICAgICB0aGlzLmdyYWRlci5hbnN3ZXIgPSB0aGlzLmN1cnJlbnRBbnN3ZXJDb250ZW50KCk7XG4gICAgICAgICAgICB0aGlzLmdyYWRlID0gdGhpcy5ncmFkZXIuZ3JhZGUoKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmdyYWRlID09IFwiY29ycmVjdFwiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ocGFyc29ucy5ydW5CdXR0b24uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuc29sdmVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlbmRlckZlZWRiYWNrKCkge1xuICAgICAgICB0aGlzLmdyYWRlID0gdGhpcy5ncmFkZXIuZ3JhZGVyU3RhdGU7XG4gICAgICAgIHZhciBmZWVkYmFja0FyZWE7XG4gICAgICAgIHZhciBhbnN3ZXJBcmVhID0gdGhpcy5hbnN3ZXJBcmVhO1xuICAgICAgICBmZWVkYmFja0FyZWEgPSB0aGlzLm1lc3NhZ2VEaXY7XG5cbiAgICAgICAgaWYgKHRoaXMuZ3JhZGUgPT09IFwiY29ycmVjdFwiKSB7XG4gICAgICAgICAgICBhbnN3ZXJBcmVhLmNsYXNzTGlzdC5hZGQoXCJjb3JyZWN0XCIpO1xuICAgICAgICAgICAgZmVlZGJhY2tBcmVhLnN0eWxlLmRpc3BsYXkgPSBcIlwiO1xuICAgICAgICAgICAgZmVlZGJhY2tBcmVhLmNsYXNzTmFtZSA9IFwiaHBfZmVlZGJhY2sgYWxlcnQgYWxlcnQtaW5mb1wiO1xuICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tDb3VudCA+IDEpIHtcbiAgICAgICAgICAgICAgICBmZWVkYmFja0FyZWEuaW5uZXJIVE1MID0gdChcbiAgICAgICAgICAgICAgICAgICAgXCJtc2dfcGFyc29uX2NvcnJlY3RcIixcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGVja0NvdW50LFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZlZWRiYWNrQXJlYS5pbm5lckhUTUwgPSB0KFwibXNnX3BhcnNvbl9jb3JyZWN0X2ZpcnN0X3RyeVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuY2hlY2tDb3VudCA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5ncmFkZSA9PT0gXCJpbmNvcnJlY3RUb29TaG9ydFwiKSB7XG4gICAgICAgICAgICAvLyB0b28gbGl0dGxlIGNvZGVcbiAgICAgICAgICAgIGFuc3dlckFyZWEuY2xhc3NMaXN0LmFkZChcImluY29ycmVjdFwiKTtcbiAgICAgICAgICAgIGZlZWRiYWNrQXJlYS5zdHlsZS5kaXNwbGF5ID0gXCJcIjtcbiAgICAgICAgICAgIGZlZWRiYWNrQXJlYS5jbGFzc05hbWUgPSBcImhwX2ZlZWRiYWNrIGFsZXJ0IGFsZXJ0LWRhbmdlclwiO1xuICAgICAgICAgICAgZmVlZGJhY2tBcmVhLmlubmVySFRNTCA9IHQoXCJtc2dfcGFyc29uX3Rvb19zaG9ydFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmdyYWRlID09PSBcImluY29ycmVjdE1vdmVCbG9ja3NcIikge1xuICAgICAgICAgICAgdmFyIGFuc3dlckJsb2NrcyA9IHRoaXMuYW5zd2VyQXJlYS5jaGlsZHJlbjtcbiAgICAgICAgICAgIHZhciBpblNvbHV0aW9uID0gW107XG4gICAgICAgICAgICB2YXIgaW5Tb2x1dGlvbkluZGV4ZXMgPSBbXTtcbiAgICAgICAgICAgIHZhciBub3RJblNvbHV0aW9uID0gW107XG4gICAgICAgICAgICAvLyBNYXRjaCBlYWNoIGFuc3dlciBibG9jayB0byBhIHNvbHV0aW9uIHBvc2l0aW9uIGJ5IGNvbnRlbnQsIG5vdCBieVxuICAgICAgICAgICAgLy8gYmxvY2sgaW5kZXgsIHNvIGludGVyY2hhbmdlYWJsZSBibG9ja3MgYXJlIG5vdCBmbGFnZ2VkLiBFYWNoXG4gICAgICAgICAgICAvLyBzb2x1dGlvbiBwb3NpdGlvbiBpcyBjbGFpbWVkIGF0IG1vc3Qgb25jZSwgbGVmdG1vc3QgZmlyc3QsIHNvXG4gICAgICAgICAgICAvLyByZXBlYXRlZCBjb250ZW50IGxpbmVzIHVwIGluIG9yZGVyLlxuICAgICAgICAgICAgdmFyIGNsYWltZWQgPSBuZXcgU2V0KCk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFuc3dlckJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBibG9jayA9IGFuc3dlckJsb2Nrc1tpXTtcbiAgICAgICAgICAgICAgICB2YXIgY29udGVudCA9IHRoaXMuYmxvY2tDb250ZW50KGJsb2NrLmRhdGFzZXQuaW5kZXgpO1xuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IC0xO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5zb2x1dGlvbi5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWNsYWltZWQuaGFzKGopICYmIHRoaXMuc29sdXRpb25bal0gPT09IGNvbnRlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0gajtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYWltZWQuYWRkKGopO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ID09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIG5vdEluU29sdXRpb24ucHVzaChibG9jayk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaW5Tb2x1dGlvbi5wdXNoKGJsb2NrKTtcbiAgICAgICAgICAgICAgICAgICAgaW5Tb2x1dGlvbkluZGV4ZXMucHVzaChpbmRleCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGxpc0luZGV4ZXMgPSB0aGlzLmdyYWRlci5pbnZlcnNlTElTSW5kaWNlcyhpblNvbHV0aW9uSW5kZXhlcyk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpc0luZGV4ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBub3RJblNvbHV0aW9uLnB1c2goaW5Tb2x1dGlvbltsaXNJbmRleGVzW2ldXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhbnN3ZXJBcmVhLmNsYXNzTGlzdC5hZGQoXCJpbmNvcnJlY3RcIik7XG4gICAgICAgICAgICBmZWVkYmFja0FyZWEuc3R5bGUuZGlzcGxheSA9IFwiXCI7XG4gICAgICAgICAgICBmZWVkYmFja0FyZWEuY2xhc3NOYW1lID0gXCJhbGVydCBhbGVydC1kYW5nZXJcIjtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm90SW5Tb2x1dGlvbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIG5vdEluU29sdXRpb25baV0uY2xhc3NMaXN0LmFkZChcImluY29ycmVjdFBvc2l0aW9uXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZmVlZGJhY2tBcmVhLmlubmVySFRNTCA9IHQoXCJtc2dfcGFyc29uX3dyb25nX29yZGVyXCIpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYW5ub3VuY2VGZWVkYmFjaygpO1xuICAgICAgICB0aGlzLmhwYXJzb25zLmhwYXJzb25zSW5wdXQucmVmcmVzaEJsb2NrQXJpYSgpO1xuICAgIH1cblxuICAgIGFubm91bmNlRmVlZGJhY2sobWVzc2FnZSA9IHRoaXMubWVzc2FnZURpdi50ZXh0Q29udGVudC50cmltKCkpIHtcbiAgICAgICAgaWYgKHRoaXMuZmVlZGJhY2tBbm5vdW5jZW1lbnRUaW1lb3V0KSB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5mZWVkYmFja0Fubm91bmNlbWVudFRpbWVvdXQpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZmVlZGJhY2tMaXZlUmVnaW9uLnRleHRDb250ZW50ID0gXCJcIjtcbiAgICAgICAgdGhpcy5mZWVkYmFja0Fubm91bmNlbWVudFRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZmVlZGJhY2tMaXZlUmVnaW9uLnRleHRDb250ZW50ID0gbWVzc2FnZTtcbiAgICAgICAgICAgIHRoaXMuZmVlZGJhY2tBbm5vdW5jZW1lbnRUaW1lb3V0ID0gbnVsbDtcbiAgICAgICAgfSwgMTApO1xuICAgIH1cblxuICAgIC8vIEZlZWRiYWNrIFVJIGZvciBCbG9jay1iYXNlZCBGZWVkYmFja1xuICAgIGNsZWFyRmVlZGJhY2soKSB7XG4gICAgICAgIHRoaXMuYW5zd2VyQXJlYS5jbGFzc0xpc3QucmVtb3ZlKFwiaW5jb3JyZWN0XCIsIFwiY29ycmVjdFwiKTtcbiAgICAgICAgdmFyIGNoaWxkcmVuID0gdGhpcy5hbnN3ZXJBcmVhLmNoaWxkTm9kZXM7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNoaWxkcmVuW2ldLmNsYXNzTGlzdC5yZW1vdmUoXG4gICAgICAgICAgICAgICAgXCJjb3JyZWN0UG9zaXRpb25cIixcbiAgICAgICAgICAgICAgICBcImluY29ycmVjdFBvc2l0aW9uXCIsXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubWVzc2FnZURpdi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgIGlmICh0aGlzLmZlZWRiYWNrQW5ub3VuY2VtZW50VGltZW91dCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuZmVlZGJhY2tBbm5vdW5jZW1lbnRUaW1lb3V0KTtcbiAgICAgICAgICAgIHRoaXMuZmVlZGJhY2tBbm5vdW5jZW1lbnRUaW1lb3V0ID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmZlZWRiYWNrTGl2ZVJlZ2lvbi50ZXh0Q29udGVudCA9IFwiXCI7XG4gICAgICAgIHRoaXMuaHBhcnNvbnMuaHBhcnNvbnNJbnB1dC5yZWZyZXNoQmxvY2tBcmlhKCk7XG4gICAgfVxuXG4gICAgcmVzZXQoKSB7XG4gICAgICAgIGlmICh0aGlzLnNvbHZlZCkge1xuICAgICAgICAgICAgdGhpcy5jaGVja0NvdW50ID0gMDtcbiAgICAgICAgICAgIHRoaXMuaHBhcnNvbnMucnVuQnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLnNvbHZlZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2xlYXJGZWVkYmFjaygpO1xuICAgICAgICB0aGlzLmFubm91bmNlRmVlZGJhY2sodChcIm1zZ19ocGFyc29uc19ibG9ja3NfcmVzZXRcIikpO1xuICAgIH1cbn1cbiIsIi8qIChpZ25vcmVkKSAqLyIsImltcG9ydCBTb3J0YWJsZSBmcm9tIFwic29ydGFibGVqc1wiO1xuaW1wb3J0IHsgTWljcm9QYXJzb25zRXZlbnQgfSBmcm9tIFwiLi9Mb2dnaW5nRXZlbnRzXCI7XG5pbXBvcnQgaGxqcyBmcm9tIFwiaGlnaGxpZ2h0LmpzL2xpYi9jb3JlXCI7XG5pbXBvcnQgeyB0IH0gZnJvbSBcIi4uLy4uLy4uL2NvbW1vbi9qcy9yc2kxOG4uanNcIjtcbmltcG9ydCB7IGdldEFjY2Vzc2libGVFbGVtZW50VGV4dCB9IGZyb20gXCIuLi8uLi8uLi9jb21tb24vanMvbWF0aGpheC1hMTF5LmpzXCI7XG5cbmRlY2xhcmUgY2xhc3MgTWljcm9QYXJzb25zIHtcbiAgbG9nRXZlbnQoZXZlbnQ6IGFueSk6IHZvaWQ7XG4gIHB1YmxpYyB0ZW1wb3JhcnlJbnB1dEV2ZW50OiBhbnk7XG4gIHB1YmxpYyB0b29sTnVtYmVyOiBudW1iZXI7XG4gIHB1YmxpYyBsYW5ndWFnZTogc3RyaW5nO1xuICBwdWJsaWMgaGxqc0xhbmd1YWdlOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBjbGFzcyBQYXJzb25zSW5wdXQgaW1wbGVtZW50cyBJUGFyc29uc0lucHV0IHtcbiAgLy8gVGhlIGlucHV0IGVsZW1lbnRcbiAgcHVibGljIGVsOiBIVE1MRGl2RWxlbWVudDtcbiAgcHJpdmF0ZSBfZHJvcEFyZWE6IEhUTUxEaXZFbGVtZW50O1xuICBwcml2YXRlIF9kcmFnQXJlYTogSFRNTERpdkVsZW1lbnQ7XG4gIHByaXZhdGUgX2Ryb3BTb3J0YWJsZTogU29ydGFibGUgfCBudWxsO1xuICBwcml2YXRlIF9kcmFnU29ydGFibGU6IFNvcnRhYmxlIHwgbnVsbDtcbiAgcHVibGljIHBhcmVudEVsZW1lbnQ6IE1pY3JvUGFyc29ucztcbiAgcHJpdmF0ZSBfcHJldlBvc2l0aW9uOiBudW1iZXI7XG4gIHB1YmxpYyByZXVzYWJsZTogYm9vbGVhbjtcbiAgcHJpdmF0ZSByYW5kb21pemU6IGJvb2xlYW47XG4gIHByaXZhdGUgc3RvcmVkU291cmNlQmxvY2tzOiBBcnJheTxzdHJpbmc+O1xuICBwcml2YXRlIHN0b3JlZFNvdXJjZUJsb2NrRXhwbGFuYXRpb25zOiBBcnJheTxzdHJpbmc+IHwgbnVsbDtcbiAgcHJpdmF0ZSBibG9ja09yZGVyOiBBcnJheTxudW1iZXI+O1xuICBwcml2YXRlIGhsanNMYW5ndWFnZTogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICBwcml2YXRlIF9saXZlUmVnaW9uOiBIVE1MRGl2RWxlbWVudDtcblxuICBwcml2YXRlIF9hY3RpdmVCbG9jazogSFRNTERpdkVsZW1lbnQgfCBudWxsO1xuICBwcml2YXRlIF9rZXlib2FyZEVudHJ5SGludDogSFRNTERpdkVsZW1lbnQ7XG4gIHByaXZhdGUgX2tleWJvYXJkQXBwbGljYXRpb246IEhUTUxEaXZFbGVtZW50O1xuICBwcml2YXRlIF9rZXlib2FyZElucHV0QWN0aXZlOiBib29sZWFuO1xuICBwcml2YXRlIF9rZXlib2FyZEluc3RydWN0aW9uczogSFRNTFNwYW5FbGVtZW50O1xuICBwcml2YXRlIF9uZXh0QmxvY2tJZDogbnVtYmVyO1xuICAvLyBpZiB0aGUgaW5wdXQgaGFzIGJlZW4gaW5pdGlhbGl6ZWQgb25jZVxuICBwcml2YXRlIGluaXRpYWxpemVkOiBib29sZWFuO1xuICBjb25zdHJ1Y3RvcihcbiAgICBwYXJlbnRFbGVtZW50OiBNaWNyb1BhcnNvbnMsXG4gICAgcmV1c2FibGU6IGJvb2xlYW4sXG4gICAgcmFuZG9taXplOiBib29sZWFuLFxuICApIHtcbiAgICB0aGlzLmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICB0aGlzLmVsLmNsYXNzTGlzdC5hZGQoXCJocGFyc29ucy1pbnB1dFwiKTtcblxuICAgIHRoaXMucGFyZW50RWxlbWVudCA9IHBhcmVudEVsZW1lbnQ7XG5cbiAgICB0aGlzLmVsLmlkID1cbiAgICAgIFwiaHBhcnNvbnN0b29sLVwiICsgdGhpcy5wYXJlbnRFbGVtZW50LnRvb2xOdW1iZXIgKyBcIi1wYXJzb25zLWlucHV0XCI7XG5cbiAgICB0aGlzLl9rZXlib2FyZEVudHJ5SGludCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgdGhpcy5fa2V5Ym9hcmRFbnRyeUhpbnQuc2V0QXR0cmlidXRlKFwicm9sZVwiLCBcInRvb2x0aXBcIik7XG4gICAgdGhpcy5fa2V5Ym9hcmRFbnRyeUhpbnQuY2xhc3NMaXN0LmFkZChcImhwYXJzb25zLXRpcFwiKTtcbiAgICB0aGlzLl9rZXlib2FyZEVudHJ5SGludC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgdGhpcy5lbC5hcHBlbmRDaGlsZCh0aGlzLl9rZXlib2FyZEVudHJ5SGludCk7XG5cbiAgICBjb25zdCBkcmFnVGlwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBkcmFnVGlwLmlubmVyVGV4dCA9IHQoXCJtc2dfaHBhcnNvbnNfZHJhZ19ibG9ja3NfY29kZVwiKTtcbiAgICBkcmFnVGlwLmNsYXNzTGlzdC5hZGQoXCJocGFyc29ucy1kcmFnLXRpcFwiKTtcbiAgICBkcmFnVGlwLmNsYXNzTGlzdC5hZGQoXCJocGFyc29ucy10aXBcIik7XG4gICAgdGhpcy5lbC5hcHBlbmQoZHJhZ1RpcCk7XG5cbiAgICB0aGlzLl9kcmFnQXJlYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgdGhpcy5lbC5hcHBlbmRDaGlsZCh0aGlzLl9kcmFnQXJlYSk7XG4gICAgdGhpcy5fZHJhZ0FyZWEuY2xhc3NMaXN0LmFkZChcImRyYWctYXJlYVwiKTtcbiAgICB0aGlzLl9kcmFnQXJlYS5zZXRBdHRyaWJ1dGUoXCJyb2xlXCIsIFwibGlzdGJveFwiKTtcbiAgICB0aGlzLl9kcmFnQXJlYS5zZXRBdHRyaWJ1dGUoXG4gICAgICBcImFyaWEtbGFiZWxcIixcbiAgICAgIHQoXCJtc2dfaHBhcnNvbnNfYXZhaWxhYmxlX2Jsb2Nrc1wiKSxcbiAgICApO1xuXG4gICAgY29uc3QgZHJvcFRpcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgZHJvcFRpcC5pbm5lclRleHQgPSB0KFwibXNnX2hwYXJzb25zX2Ryb3BfYmxvY2tzX2NvZGVcIik7XG4gICAgZHJvcFRpcC5jbGFzc0xpc3QuYWRkKFwiaHBhcnNvbnMtZHJvcC10aXBcIik7XG4gICAgZHJvcFRpcC5jbGFzc0xpc3QuYWRkKFwiaHBhcnNvbnMtdGlwXCIpO1xuICAgIHRoaXMuZWwuYXBwZW5kKGRyb3BUaXApO1xuXG4gICAgdGhpcy5fZHJvcEFyZWEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIHRoaXMuZWwuYXBwZW5kQ2hpbGQodGhpcy5fZHJvcEFyZWEpO1xuICAgIHRoaXMuX2Ryb3BBcmVhLmNsYXNzTGlzdC5hZGQoXCJkcm9wLWFyZWFcIik7XG4gICAgdGhpcy5fZHJvcEFyZWEuc2V0QXR0cmlidXRlKFwicm9sZVwiLCBcImxpc3Rib3hcIik7XG4gICAgdGhpcy5fZHJvcEFyZWEuc2V0QXR0cmlidXRlKFwiYXJpYS1sYWJlbFwiLCB0KFwibXNnX2hwYXJzb25zX2Fuc3dlcl9hcmVhXCIpKTtcbiAgICB0aGlzLl9wcmV2UG9zaXRpb24gPSAtMTtcblxuICAgIC8vIFZpc3VhbGx5LWhpZGRlbiBsaXZlIHJlZ2lvbiBmb3Igc2NyZWVuLXJlYWRlciBhbm5vdW5jZW1lbnRzXG4gICAgdGhpcy5fbGl2ZVJlZ2lvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgdGhpcy5fbGl2ZVJlZ2lvbi5zZXRBdHRyaWJ1dGUoXCJhcmlhLWxpdmVcIiwgXCJwb2xpdGVcIik7XG4gICAgdGhpcy5fbGl2ZVJlZ2lvbi5zZXRBdHRyaWJ1dGUoXCJhcmlhLWF0b21pY1wiLCBcInRydWVcIik7XG4gICAgdGhpcy5fbGl2ZVJlZ2lvbi5jbGFzc0xpc3QuYWRkKFwidmlzdWFsbHloaWRkZW5cIik7XG4gICAgdGhpcy5lbC5hcHBlbmRDaGlsZCh0aGlzLl9saXZlUmVnaW9uKTtcblxuXG4gICAgdGhpcy5fYWN0aXZlQmxvY2sgPSBudWxsO1xuICAgIHRoaXMuX2tleWJvYXJkSW5wdXRBY3RpdmUgPSBmYWxzZTtcbiAgICB0aGlzLl9uZXh0QmxvY2tJZCA9IDA7XG4gICAgdGhpcy5fa2V5Ym9hcmRJbnN0cnVjdGlvbnMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICB0aGlzLl9rZXlib2FyZEluc3RydWN0aW9ucy5pZCA9IGAke3RoaXMuZWwuaWR9LWtleWJvYXJkLWluc3RydWN0aW9uc2A7XG4gICAgdGhpcy5fa2V5Ym9hcmRJbnN0cnVjdGlvbnMuY2xhc3NMaXN0LmFkZChcInZpc3VhbGx5aGlkZGVuXCIpO1xuICAgIHRoaXMuX2tleWJvYXJkSW5zdHJ1Y3Rpb25zLnRleHRDb250ZW50ID1cbiAgICAgIHQoXCJtc2dfaHBhcnNvbnNfa2V5Ym9hcmRfaWRsZV9pbnN0cnVjdGlvbnNcIik7XG4gICAgdGhpcy5lbC5hcHBlbmRDaGlsZCh0aGlzLl9rZXlib2FyZEluc3RydWN0aW9ucyk7XG4gICAgdGhpcy5fa2V5Ym9hcmRBcHBsaWNhdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgdGhpcy5fa2V5Ym9hcmRBcHBsaWNhdGlvbi5jbGFzc0xpc3QuYWRkKFwiaHBhcnNvbnMta2V5Ym9hcmQtYXBwbGljYXRpb25cIik7XG4gICAgdGhpcy5fa2V5Ym9hcmRBcHBsaWNhdGlvbi5zZXRBdHRyaWJ1dGUoXCJyb2xlXCIsIFwiYXBwbGljYXRpb25cIik7XG4gICAgdGhpcy5fa2V5Ym9hcmRBcHBsaWNhdGlvbi50YWJJbmRleCA9IC0xO1xuICAgIHRoaXMuX2tleWJvYXJkQXBwbGljYXRpb24uYWRkRXZlbnRMaXN0ZW5lcihcImJsdXJcIiwgKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuX2tleWJvYXJkSW5wdXRBY3RpdmUpIHtcbiAgICAgICAgdGhpcy5fZXhpdEtleWJvYXJkTW92ZW1lbnQoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLmVsLmFwcGVuZENoaWxkKHRoaXMuX2tleWJvYXJkQXBwbGljYXRpb24pO1xuICAgIHRoaXMuZWwudGFiSW5kZXggPSAwO1xuICAgIHRoaXMuZWwuc2V0QXR0cmlidXRlKFwicm9sZVwiLCBcImJ1dHRvblwiKTtcbiAgICB0aGlzLmVsLnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIiwgdChcIm1zZ19wYXJzb25fa2V5Ym9hcmRfZW50cnlfbGFiZWxcIikpO1xuICAgIHRoaXMuZWwuc2V0QXR0cmlidXRlKFwiYXJpYS1kZXNjcmliZWRieVwiLCB0aGlzLl9rZXlib2FyZEluc3RydWN0aW9ucy5pZCk7XG4gICAgdGhpcy5zdG9yZWRTb3VyY2VCbG9ja3MgPSBbXTtcbiAgICB0aGlzLmJsb2NrT3JkZXIgPSBbXTtcbiAgICB0aGlzLnN0b3JlZFNvdXJjZUJsb2NrRXhwbGFuYXRpb25zID0gbnVsbDtcblxuICAgIHRoaXMucmV1c2FibGUgPSByZXVzYWJsZTtcbiAgICB0aGlzLnJhbmRvbWl6ZSA9IHJhbmRvbWl6ZTtcblxuICAgIHRoaXMuX2RyYWdTb3J0YWJsZSA9IG51bGw7XG4gICAgdGhpcy5fZHJvcFNvcnRhYmxlID0gbnVsbDtcbiAgICB0aGlzLl9pbml0U29ydGFibGUoKTtcbiAgICB0aGlzLl9zZXR1cEtleWJvYXJkTmF2KCk7XG5cbiAgICB0aGlzLmluaXRpYWxpemVkID0gZmFsc2U7XG4gIH1cblxuICBwdWJsaWMgZ2V0VGV4dCA9IChhZGRTcGFjZTogYm9vbGVhbik6IHN0cmluZyA9PiB7XG4gICAgbGV0IHJldCA9IFwiXCI7XG4gICAgaWYgKHRoaXMuX2Ryb3BBcmVhLmhhc0NoaWxkTm9kZXMoKSkge1xuICAgICAgbGV0IGVsID0gdGhpcy5fZHJvcEFyZWEuZmlyc3RDaGlsZCBhcyBIVE1MRGl2RWxlbWVudDtcbiAgICAgIHJldCArPSB0aGlzLl9nZXRUZXh0RnJvbUJsb2NrKGVsKTtcbiAgICAgIHdoaWxlIChlbC5uZXh0U2libGluZykge1xuICAgICAgICBlbCA9IGVsLm5leHRTaWJsaW5nIGFzIEhUTUxEaXZFbGVtZW50O1xuICAgICAgICByZXQgKz0gYWRkU3BhY2UgPyBcIiBcIiA6IFwiXCI7XG4gICAgICAgIHJldCArPSB0aGlzLl9nZXRUZXh0RnJvbUJsb2NrKGVsKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuICB9O1xuXG4gIHB1YmxpYyBnZXRCbG9ja0luZGljZXMgPSAoKTogbnVtYmVyW10gPT4ge1xuICAgIGNvbnN0IGJsb2NrcyA9IHRoaXMuX2Ryb3BBcmVhLnF1ZXJ5U2VsZWN0b3JBbGwoXCIucGFyc29ucy1ibG9ja1wiKTtcbiAgICByZXR1cm4gQXJyYXkuZnJvbShibG9ja3MpLm1hcCgoYmxvY2spID0+XG4gICAgICBwYXJzZUludCgoYmxvY2sgYXMgSFRNTERpdkVsZW1lbnQpLmRhdGFzZXQuaW5kZXggfHwgXCItMVwiKSxcbiAgICApO1xuICB9O1xuXG4gIC8vIGdldHRpbmcgdGhlIGNvZGUgZnJvbSBvbmUgYmxvY2ssIGFuZCBpZ25vcmUgdG9vbHRpcCB0ZXh0XG4gIHByaXZhdGUgX2dldFRleHRGcm9tQmxvY2sgPSAoYmxvY2s6IEhUTUxEaXZFbGVtZW50KTogc3RyaW5nID0+IHtcbiAgICBpZiAodGhpcy5wYXJlbnRFbGVtZW50Lmxhbmd1YWdlID09IFwicmF3XCIpIHtcbiAgICAgIHJldHVybiBibG9jay5pbm5lckhUTUw7XG4gICAgfVxuICAgIGlmICghYmxvY2subGFzdENoaWxkIHx8IGJsb2NrLmxhc3RDaGlsZC5ub2RlVHlwZSAhPSBOb2RlLkVMRU1FTlRfTk9ERSkge1xuICAgICAgcmV0dXJuIGJsb2NrLnRleHRDb250ZW50IHx8IFwiXCI7XG4gICAgfVxuICAgIGNvbnN0IHRvb2x0aXBMZW5ndGggPSAoXG4gICAgICBibG9jay5sYXN0Q2hpbGQgYXMgSFRNTERpdkVsZW1lbnRcbiAgICApLmNsYXNzTGlzdC5jb250YWlucyhcInBhcnNvbnMtdG9vbHRpcFwiKVxuICAgICAgPyAoYmxvY2subGFzdENoaWxkIGFzIEhUTUxEaXZFbGVtZW50KS50ZXh0Q29udGVudD8ubGVuZ3RoIHx8IDBcbiAgICAgIDogMDtcbiAgICBpZiAodG9vbHRpcExlbmd0aCA+IDApIHtcbiAgICAgIHJldHVybiAoYmxvY2sudGV4dENvbnRlbnQgfHwgXCJcIikuc2xpY2UoMCwgLXRvb2x0aXBMZW5ndGgpO1xuICAgIH1cbiAgICByZXR1cm4gYmxvY2sudGV4dENvbnRlbnQgfHwgXCJcIjtcbiAgfTtcblxuICBwcml2YXRlIF9nZXRBY2Nlc3NpYmxlQmxvY2tUZXh0ID0gKGJsb2NrOiBIVE1MRGl2RWxlbWVudCk6IHN0cmluZyA9PiB7XG4gICAgY29uc3QgYWNjZXNzaWJsZUJsb2NrID0gYmxvY2suY2xvbmVOb2RlKHRydWUpIGFzIEhUTUxEaXZFbGVtZW50O1xuICAgIGFjY2Vzc2libGVCbG9ja1xuICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoXCIucGFyc29ucy10b29sdGlwXCIpXG4gICAgICAuZm9yRWFjaCgodG9vbHRpcCkgPT4gdG9vbHRpcC5yZW1vdmUoKSk7XG4gICAgcmV0dXJuIGdldEFjY2Vzc2libGVFbGVtZW50VGV4dChhY2Nlc3NpYmxlQmxvY2spO1xuICB9O1xuXG4gIC8vIER1cnN0ZW5mZWxkIHNodWZmbGVcbiAgcHJpdmF0ZSBzaHVmZmxlQXJyYXkoYXJyYXk6IEFycmF5PGFueT4pIHtcbiAgICBmb3IgKGxldCBpID0gYXJyYXkubGVuZ3RoIC0gMTsgaSA+IDA7IGktLSkge1xuICAgICAgbGV0IGogPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoaSArIDEpKTtcbiAgICAgIGxldCB0ZW1wID0gYXJyYXlbaV07XG4gICAgICBhcnJheVtpXSA9IGFycmF5W2pdO1xuICAgICAgYXJyYXlbal0gPSB0ZW1wO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBzZXRTb3VyY2VCbG9ja3MgPSAoXG4gICAgZGF0YTogQXJyYXk8c3RyaW5nPixcbiAgICB0b29sdGlwczogQXJyYXk8c3RyaW5nPiB8IG51bGwsXG4gICk6IHZvaWQgPT4ge1xuICAgIHRoaXMuYmxvY2tPcmRlciA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7ICsraSkge1xuICAgICAgdGhpcy5ibG9ja09yZGVyLnB1c2goaSk7XG4gICAgfVxuXG4gICAgLy8gc2h1ZmZsZSBzb3VyY2UgYmxvY2tzIGlmIHJhbmRvbWl6ZVxuICAgIGlmICh0aGlzLnJhbmRvbWl6ZSkge1xuICAgICAgbGV0IG9yaWdpbmFsT3JkZXIgPSBKU09OLnN0cmluZ2lmeSh0aGlzLmJsb2NrT3JkZXIpO1xuICAgICAgdGhpcy5zaHVmZmxlQXJyYXkodGhpcy5ibG9ja09yZGVyKTtcbiAgICAgIHdoaWxlIChKU09OLnN0cmluZ2lmeSh0aGlzLmJsb2NrT3JkZXIpID09IG9yaWdpbmFsT3JkZXIpIHtcbiAgICAgICAgdGhpcy5zaHVmZmxlQXJyYXkodGhpcy5ibG9ja09yZGVyKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnN0b3JlZFNvdXJjZUJsb2NrcyA9IGRhdGE7XG4gICAgdGhpcy5zdG9yZWRTb3VyY2VCbG9ja0V4cGxhbmF0aW9ucyA9IHRvb2x0aXBzO1xuICAgIHRoaXMuX3Jlc2V0SW5wdXQoKTtcbiAgfTtcblxuICAvLyBUT0RPOiBub3QgZWZmaWNpZW50IGVub3VnaC4gc2hvdWxkIG5vdCBuZWVkIHRvIGNyZWF0ZSBuZXcgZWxlbWVudHM7IHNpbXBseSBzb3J0aW5nIHRoZW0gc2hvdWxkIGJlIGdvb2QuXG4gIHByaXZhdGUgX3Jlc2V0SW5wdXQgPSAoKTogdm9pZCA9PiB7XG4gICAgLy8gY2xlYXJpbmcgcHJldmlvdXMgYmxvY2tzXG4gICAgd2hpbGUgKHRoaXMuX2RyYWdBcmVhLmZpcnN0Q2hpbGQpIHtcbiAgICAgIHRoaXMuX2RyYWdBcmVhLnJlbW92ZUNoaWxkKHRoaXMuX2RyYWdBcmVhLmZpcnN0Q2hpbGQpO1xuICAgIH1cbiAgICB3aGlsZSAodGhpcy5fZHJvcEFyZWEuZmlyc3RDaGlsZCkge1xuICAgICAgdGhpcy5fZHJvcEFyZWEucmVtb3ZlQ2hpbGQodGhpcy5fZHJvcEFyZWEuZmlyc3RDaGlsZCk7XG4gICAgfVxuXG4gICAgLy8gYWRkIG5ldyBibG9ja3NcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYmxvY2tPcmRlci5sZW5ndGg7ICsraSkge1xuICAgICAgY29uc3QgbmV3QmxvY2sgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgbmV3QmxvY2suZGF0YXNldC5pbmRleCA9IHRoaXMuYmxvY2tPcmRlcltpXS50b1N0cmluZygpO1xuICAgICAgdGhpcy5fZHJhZ0FyZWEuYXBwZW5kQ2hpbGQobmV3QmxvY2spO1xuICAgICAgaWYgKHRoaXMuc3RvcmVkU291cmNlQmxvY2tzW3RoaXMuYmxvY2tPcmRlcltpXV0gPT09IFwiIFwiKSB7XG4gICAgICAgIG5ld0Jsb2NrLmlubmVySFRNTCA9IFwiJm5ic3A7XCI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodGhpcy5wYXJlbnRFbGVtZW50LmhsanNMYW5ndWFnZSkge1xuICAgICAgICAgIG5ld0Jsb2NrLmlubmVySFRNTCA9IGhsanMuaGlnaGxpZ2h0KFxuICAgICAgICAgICAgdGhpcy5zdG9yZWRTb3VyY2VCbG9ja3NbdGhpcy5ibG9ja09yZGVyW2ldXSxcbiAgICAgICAgICAgIHsgbGFuZ3VhZ2U6IHRoaXMucGFyZW50RWxlbWVudC5obGpzTGFuZ3VhZ2UsIGlnbm9yZUlsbGVnYWxzOiB0cnVlIH0sXG4gICAgICAgICAgKS52YWx1ZTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnBhcmVudEVsZW1lbnQubGFuZ3VhZ2UgPT0gXCJyYXdcIikge1xuICAgICAgICAgIG5ld0Jsb2NrLmlubmVySFRNTCA9IHRoaXMuc3RvcmVkU291cmNlQmxvY2tzW3RoaXMuYmxvY2tPcmRlcltpXV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbmV3QmxvY2suaW5uZXJUZXh0ID0gdGhpcy5zdG9yZWRTb3VyY2VCbG9ja3NbdGhpcy5ibG9ja09yZGVyW2ldXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbmV3QmxvY2suc3R5bGUuZGlzcGxheSA9IFwiaW5saW5lLWJsb2NrXCI7XG4gICAgICBuZXdCbG9jay5jbGFzc0xpc3QuYWRkKFwicGFyc29ucy1ibG9ja1wiKTtcbiAgICAgIG5ld0Jsb2NrLm9uY2xpY2sgPSAoZXYpID0+IHtcbiAgICAgICAgdGhpcy5fb25CbG9ja0NsaWNrZWQobmV3QmxvY2ssIGV2KTtcbiAgICAgIH07XG4gICAgICAvLyBjcmVhdGluZyB0b29sdGlwXG4gICAgICBpZiAoXG4gICAgICAgIHRoaXMuc3RvcmVkU291cmNlQmxvY2tFeHBsYW5hdGlvbnMgJiZcbiAgICAgICAgdGhpcy5zdG9yZWRTb3VyY2VCbG9ja0V4cGxhbmF0aW9uc1t0aGlzLmJsb2NrT3JkZXJbaV1dXG4gICAgICApIHtcbiAgICAgICAgY29uc3QgdG9vbHRpcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHRvb2x0aXAuaW5uZXJUZXh0ID1cbiAgICAgICAgICB0aGlzLnN0b3JlZFNvdXJjZUJsb2NrRXhwbGFuYXRpb25zW3RoaXMuYmxvY2tPcmRlcltpXV07XG4gICAgICAgIHRvb2x0aXAuY2xhc3NMaXN0LmFkZChcInBhcnNvbnMtdG9vbHRpcFwiKTtcbiAgICAgICAgbmV3QmxvY2suYXBwZW5kQ2hpbGQodG9vbHRpcCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5fdXBkYXRlQmxvY2tBcmlhKCk7XG4gIH07XG5cbiAgcHJpdmF0ZSBfb25CbG9ja0NsaWNrZWQgPSAoYmxvY2s6IE5vZGUsIGV2OiBFdmVudCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IGJsb2NrVGV4dCA9IHRoaXMuX2dldFRleHRGcm9tQmxvY2soYmxvY2sgYXMgSFRNTERpdkVsZW1lbnQpLnRyaW0oKTtcbiAgICBsZXQgZm9jdXNlZEJsb2NrID0gYmxvY2sgYXMgSFRNTERpdkVsZW1lbnQ7XG4gICAgaWYgKGJsb2NrLnBhcmVudEVsZW1lbnQgPT0gdGhpcy5fZHJhZ0FyZWEpIHtcbiAgICAgIGxldCBlbmRQb3NpdGlvbjtcbiAgICAgIGlmICh0aGlzLnJldXNhYmxlKSB7XG4gICAgICAgIGNvbnN0IGJsb2NrQ29weSA9IGJsb2NrLmNsb25lTm9kZSh0cnVlKSBhcyBIVE1MRGl2RWxlbWVudDtcbiAgICAgICAgYmxvY2tDb3B5Lm9uY2xpY2sgPSAoZXYpID0+IHRoaXMuX29uQmxvY2tDbGlja2VkKGJsb2NrQ29weSwgZXYpO1xuICAgICAgICB0aGlzLl9kcm9wQXJlYS5hcHBlbmRDaGlsZChibG9ja0NvcHkpO1xuICAgICAgICBlbmRQb3NpdGlvbiA9IHRoaXMuX2dldEJsb2NrUG9zaXRpb24oYmxvY2tDb3B5KTtcbiAgICAgICAgZm9jdXNlZEJsb2NrID0gYmxvY2tDb3B5O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fZHJvcEFyZWEuYXBwZW5kQ2hpbGQoYmxvY2spO1xuICAgICAgICBlbmRQb3NpdGlvbiA9IHRoaXMuX2dldEJsb2NrUG9zaXRpb24oYmxvY2spO1xuICAgICAgfVxuICAgICAgY29uc3QgaW5wdXRFdmVudDogTWljcm9QYXJzb25zRXZlbnQuSW5wdXQgPSB7XG4gICAgICAgIHR5cGU6IFwiaW5wdXRcIixcbiAgICAgICAgYWN0aW9uOiBNaWNyb1BhcnNvbnNFdmVudC5JbnB1dEFjdGlvbi5BREQsXG4gICAgICAgIHBvc2l0aW9uOiBbLTEsIGVuZFBvc2l0aW9uXSxcbiAgICAgICAgYW5zd2VyOiB0aGlzLl9nZXRUZXh0QXJyYXkoKSxcbiAgICAgIH07XG4gICAgICBpZiAoZXYuaXNUcnVzdGVkKSB7XG4gICAgICAgIC8vIGlmIGZhbHNlOiBjb3VsZCBiZSB0cmlnZ2VyZWQgYnkgcmVzdG9yZUFuc3dlci5cbiAgICAgICAgdGhpcy5wYXJlbnRFbGVtZW50LmxvZ0V2ZW50KGlucHV0RXZlbnQpO1xuICAgICAgfVxuICAgICAgdGhpcy5fdXBkYXRlQmxvY2tBcmlhKCk7XG4gICAgICB0aGlzLl9yZWZvY3VzTW92ZWRCbG9jayhmb2N1c2VkQmxvY2spO1xuICAgICAgdGhpcy5fYW5ub3VuY2UoXG4gICAgICAgIHQoXCJtc2dfaHBhcnNvbnNfYmxvY2tfbW92ZWRfdG9fYW5zd2VyXCIsIGJsb2NrVGV4dCksXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBzdGFydFBvc2l0aW9uID0gdGhpcy5fZ2V0QmxvY2tQb3NpdGlvbihibG9jayk7XG4gICAgICBpZiAodGhpcy5yZXVzYWJsZSkge1xuICAgICAgICB0aGlzLl9kcm9wQXJlYS5yZW1vdmVDaGlsZChibG9jayk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9kcmFnQXJlYS5hcHBlbmRDaGlsZChibG9jayk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5yZXVzYWJsZSkge1xuICAgICAgICBmb2N1c2VkQmxvY2sgPSB0aGlzLl9hbGxCbG9ja3MoKS5maW5kKFxuICAgICAgICAgIChzb3VyY2VCbG9jaykgPT4gc291cmNlQmxvY2suZGF0YXNldC5pbmRleCA9PT0gYmxvY2suZGF0YXNldC5pbmRleCxcbiAgICAgICAgKSBhcyBIVE1MRGl2RWxlbWVudDtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGlucHV0RXZlbnQ6IE1pY3JvUGFyc29uc0V2ZW50LklucHV0ID0ge1xuICAgICAgICB0eXBlOiBcImlucHV0XCIsXG4gICAgICAgIGFjdGlvbjogTWljcm9QYXJzb25zRXZlbnQuSW5wdXRBY3Rpb24uUkVNT1ZFLFxuICAgICAgICBwb3NpdGlvbjogW3N0YXJ0UG9zaXRpb24sIC0xXSxcbiAgICAgICAgYW5zd2VyOiB0aGlzLl9nZXRUZXh0QXJyYXkoKSxcbiAgICAgIH07XG4gICAgICB0aGlzLnBhcmVudEVsZW1lbnQubG9nRXZlbnQoaW5wdXRFdmVudCk7XG4gICAgICB0aGlzLl91cGRhdGVCbG9ja0FyaWEoKTtcbiAgICAgIHRoaXMuX3JlZm9jdXNNb3ZlZEJsb2NrKGZvY3VzZWRCbG9jayk7XG4gICAgICB0aGlzLl9hbm5vdW5jZShcbiAgICAgICAgdChcIm1zZ19ocGFyc29uc19ibG9ja19tb3ZlZF90b19hdmFpbGFibGVcIiwgYmxvY2tUZXh0KSxcbiAgICAgICk7XG4gICAgfVxuICB9O1xuXG4gIHByaXZhdGUgX2luaXRTb3J0YWJsZSA9ICgpOiB2b2lkID0+IHtcbiAgICBpZiAodGhpcy5yZXVzYWJsZSkge1xuICAgICAgdGhpcy5fZHJhZ1NvcnRhYmxlID0gbmV3IFNvcnRhYmxlKHRoaXMuX2RyYWdBcmVhLCB7XG4gICAgICAgIGdyb3VwOiB7XG4gICAgICAgICAgbmFtZTogXCJzaGFyZWRcIixcbiAgICAgICAgICBwdWxsOiBcImNsb25lXCIsXG4gICAgICAgICAgcHV0OiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICAgICAgc29ydDogZmFsc2UsXG4gICAgICAgIGRpcmVjdGlvbjogXCJob3Jpem9udGFsXCIsXG4gICAgICAgIGFuaW1hdGlvbjogMTUwLFxuICAgICAgICBkcmFnZ2FibGU6IFwiLnBhcnNvbnMtYmxvY2tcIixcbiAgICAgICAgb25DbG9uZTogKGV2ZW50KSA9PiB7XG4gICAgICAgICAgY29uc3QgbmV3QmxvY2sgPSBldmVudC5jbG9uZTtcbiAgICAgICAgICBuZXdCbG9jay5vbmNsaWNrID0gKGV2KSA9PiB0aGlzLl9vbkJsb2NrQ2xpY2tlZChuZXdCbG9jaywgZXYpO1xuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuX2Ryb3BTb3J0YWJsZSA9IG5ldyBTb3J0YWJsZSh0aGlzLl9kcm9wQXJlYSwge1xuICAgICAgICBncm91cDogXCJzaGFyZWRcIixcbiAgICAgICAgZGlyZWN0aW9uOiBcImhvcml6b250YWxcIixcbiAgICAgICAgYW5pbWF0aW9uOiAxNTAsXG4gICAgICAgIGRyYWdnYWJsZTogXCIucGFyc29ucy1ibG9ja1wiLFxuICAgICAgICBvbkFkZDogKGV2ZW50KSA9PiB7XG4gICAgICAgICAgY29uc3QgaW5wdXRFdmVudDogTWljcm9QYXJzb25zRXZlbnQuSW5wdXQgPSB7XG4gICAgICAgICAgICB0eXBlOiBcImlucHV0XCIsXG4gICAgICAgICAgICBhY3Rpb246IE1pY3JvUGFyc29uc0V2ZW50LklucHV0QWN0aW9uLkFERCxcbiAgICAgICAgICAgIHBvc2l0aW9uOiBbLTEsIHRoaXMuX2dldEJsb2NrUG9zaXRpb24oZXZlbnQuaXRlbSldLFxuICAgICAgICAgICAgYW5zd2VyOiB0aGlzLl9nZXRUZXh0QXJyYXkoKSxcbiAgICAgICAgICB9O1xuICAgICAgICAgIHRoaXMucGFyZW50RWxlbWVudC5sb2dFdmVudChpbnB1dEV2ZW50KTtcbiAgICAgICAgICB0aGlzLl91cGRhdGVCbG9ja0FyaWEoKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25TdGFydDogKGV2ZW50KSA9PiB7XG4gICAgICAgICAgdGhpcy5fcHJldlBvc2l0aW9uID0gdGhpcy5fZ2V0QmxvY2tQb3NpdGlvbihldmVudC5pdGVtKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25FbmQ6IChldmVudCkgPT4ge1xuICAgICAgICAgIGxldCBlbmRwb3NpdGlvbjtcbiAgICAgICAgICBsZXQgYWN0aW9uID0gTWljcm9QYXJzb25zRXZlbnQuSW5wdXRBY3Rpb24uTU9WRTtcbiAgICAgICAgICBjb25zdCB1cHBlcmJvdW5kID0gdGhpcy5fZHJvcEFyZWEuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wO1xuICAgICAgICAgIGNvbnN0IGxvd2VyYm91bmQgPSB0aGlzLl9kcm9wQXJlYS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5ib3R0b207XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgKGV2ZW50IGFzIGFueSkub3JpZ2luYWxFdmVudC5jbGllbnRZID4gbG93ZXJib3VuZCB8fFxuICAgICAgICAgICAgKGV2ZW50IGFzIGFueSkub3JpZ2luYWxFdmVudC5jbGllbnRZIDwgdXBwZXJib3VuZFxuICAgICAgICAgICkge1xuICAgICAgICAgICAgY29uc3QgaXRlbSA9IGV2ZW50Lml0ZW0gYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgICAgICBpZiAoaXRlbS5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICAgIGl0ZW0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChpdGVtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVuZHBvc2l0aW9uID0gLTE7XG4gICAgICAgICAgICBhY3Rpb24gPSBNaWNyb1BhcnNvbnNFdmVudC5JbnB1dEFjdGlvbi5SRU1PVkU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVuZHBvc2l0aW9uID0gdGhpcy5fZ2V0QmxvY2tQb3NpdGlvbihldmVudC5pdGVtKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgaW5wdXRFdmVudDogTWljcm9QYXJzb25zRXZlbnQuSW5wdXQgPSB7XG4gICAgICAgICAgICB0eXBlOiBcImlucHV0XCIsXG4gICAgICAgICAgICBhY3Rpb246IGFjdGlvbixcbiAgICAgICAgICAgIHBvc2l0aW9uOiBbdGhpcy5fcHJldlBvc2l0aW9uLCBlbmRwb3NpdGlvbl0sXG4gICAgICAgICAgICBhbnN3ZXI6IHRoaXMuX2dldFRleHRBcnJheSgpLFxuICAgICAgICAgIH07XG4gICAgICAgICAgdGhpcy5wYXJlbnRFbGVtZW50LmxvZ0V2ZW50KGlucHV0RXZlbnQpO1xuICAgICAgICAgIHRoaXMuX3VwZGF0ZUJsb2NrQXJpYSgpO1xuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2RyYWdTb3J0YWJsZSA9IG5ldyBTb3J0YWJsZSh0aGlzLl9kcmFnQXJlYSwge1xuICAgICAgICBncm91cDoge1xuICAgICAgICAgIG5hbWU6IFwic2hhcmVkXCIsXG4gICAgICAgICAgLy8gcHVsbDogJ2Nsb25lJyxcbiAgICAgICAgICAvLyBwdXQ6IGZhbHNlXG4gICAgICAgIH0sXG4gICAgICAgIC8vIHNvcnQ6IGZhbHNlLFxuICAgICAgICBkaXJlY3Rpb246IFwiaG9yaXpvbnRhbFwiLFxuICAgICAgICBhbmltYXRpb246IDE1MCxcbiAgICAgICAgZHJhZ2dhYmxlOiBcIi5wYXJzb25zLWJsb2NrXCIsXG4gICAgICB9KTtcblxuICAgICAgdGhpcy5fZHJvcFNvcnRhYmxlID0gbmV3IFNvcnRhYmxlKHRoaXMuX2Ryb3BBcmVhLCB7XG4gICAgICAgIGdyb3VwOiBcInNoYXJlZFwiLFxuICAgICAgICBkaXJlY3Rpb246IFwiaG9yaXpvbnRhbFwiLFxuICAgICAgICBhbmltYXRpb246IDE1MCxcbiAgICAgICAgZHJhZ2dhYmxlOiBcIi5wYXJzb25zLWJsb2NrXCIsXG4gICAgICAgIG9uQWRkOiAoZXZlbnQpID0+IHtcbiAgICAgICAgICBjb25zdCBpbnB1dEV2ZW50OiBNaWNyb1BhcnNvbnNFdmVudC5JbnB1dCA9IHtcbiAgICAgICAgICAgIHR5cGU6IFwiaW5wdXRcIixcbiAgICAgICAgICAgIGFjdGlvbjogTWljcm9QYXJzb25zRXZlbnQuSW5wdXRBY3Rpb24uQURELFxuICAgICAgICAgICAgcG9zaXRpb246IFstMSwgdGhpcy5fZ2V0QmxvY2tQb3NpdGlvbihldmVudC5pdGVtKV0sXG4gICAgICAgICAgICBhbnN3ZXI6IHRoaXMuX2dldFRleHRBcnJheSgpLFxuICAgICAgICAgIH07XG4gICAgICAgICAgdGhpcy5wYXJlbnRFbGVtZW50LmxvZ0V2ZW50KGlucHV0RXZlbnQpO1xuICAgICAgICAgIHRoaXMuX3VwZGF0ZUJsb2NrQXJpYSgpO1xuICAgICAgICB9LFxuICAgICAgICBvblN0YXJ0OiAoZXZlbnQpID0+IHtcbiAgICAgICAgICB0aGlzLl9wcmV2UG9zaXRpb24gPSB0aGlzLl9nZXRCbG9ja1Bvc2l0aW9uKGV2ZW50Lml0ZW0pO1xuICAgICAgICB9LFxuICAgICAgICBvbkVuZDogKGV2ZW50KSA9PiB7XG4gICAgICAgICAgbGV0IGVuZHBvc2l0aW9uID0gdGhpcy5fZ2V0QmxvY2tQb3NpdGlvbihldmVudC5pdGVtKTtcbiAgICAgICAgICBjb25zdCBhY3Rpb24gPVxuICAgICAgICAgICAgZW5kcG9zaXRpb24gPT0gLTFcbiAgICAgICAgICAgICAgPyBNaWNyb1BhcnNvbnNFdmVudC5JbnB1dEFjdGlvbi5SRU1PVkVcbiAgICAgICAgICAgICAgOiBNaWNyb1BhcnNvbnNFdmVudC5JbnB1dEFjdGlvbi5NT1ZFO1xuICAgICAgICAgIGNvbnN0IGlucHV0RXZlbnQ6IE1pY3JvUGFyc29uc0V2ZW50LklucHV0ID0ge1xuICAgICAgICAgICAgdHlwZTogXCJpbnB1dFwiLFxuICAgICAgICAgICAgYWN0aW9uOiBhY3Rpb24sXG4gICAgICAgICAgICBwb3NpdGlvbjogW3RoaXMuX3ByZXZQb3NpdGlvbiwgZW5kcG9zaXRpb25dLFxuICAgICAgICAgICAgYW5zd2VyOiB0aGlzLl9nZXRUZXh0QXJyYXkoKSxcbiAgICAgICAgICB9O1xuICAgICAgICAgIHRoaXMucGFyZW50RWxlbWVudC5sb2dFdmVudChpbnB1dEV2ZW50KTtcbiAgICAgICAgICB0aGlzLl91cGRhdGVCbG9ja0FyaWEoKTtcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICBwdWJsaWMgdXBkYXRlVGVzdFN0YXR1cyA9IChyZXN1bHQ6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIGlmICh0aGlzLl9kcm9wQXJlYS5jbGFzc0xpc3QuY29udGFpbnMocmVzdWx0KSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy5fZHJvcEFyZWEuY2xhc3NMaXN0LmNvbnRhaW5zKFwiUGFzc1wiKSkge1xuICAgICAgdGhpcy5fZHJvcEFyZWEuY2xhc3NMaXN0LnJlbW92ZShcIlBhc3NcIik7XG4gICAgfSBlbHNlIGlmICh0aGlzLl9kcm9wQXJlYS5jbGFzc0xpc3QuY29udGFpbnMoXCJGYWlsXCIpKSB7XG4gICAgICB0aGlzLl9kcm9wQXJlYS5jbGFzc0xpc3QucmVtb3ZlKFwiRmFpbFwiKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuX2Ryb3BBcmVhLmNsYXNzTGlzdC5jb250YWlucyhcIkVycm9yXCIpKSB7XG4gICAgICB0aGlzLl9kcm9wQXJlYS5jbGFzc0xpc3QucmVtb3ZlKFwiRXJyb3JcIik7XG4gICAgfVxuICAgIHRoaXMuX2Ryb3BBcmVhLmNsYXNzTGlzdC5hZGQocmVzdWx0KTtcbiAgfTtcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBBY2Nlc3NpYmlsaXR5IGhlbHBlcnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvKiogU3luYyBibG9jayBzZW1hbnRpY3Mgd2hpbGUgdGhlIGNvbWJpbmVkIGtleWJvYXJkIHN1cmZhY2Ugb3ducyBmb2N1cy4gKi9cbiAgcHJpdmF0ZSBfdXBkYXRlQmxvY2tBcmlhID0gKCk6IHZvaWQgPT4ge1xuICAgIGlmICh0aGlzLl9hY3RpdmVCbG9jayAmJiAhdGhpcy5lbC5jb250YWlucyh0aGlzLl9hY3RpdmVCbG9jaykpIHtcbiAgICAgIHRoaXMuX2FjdGl2ZUJsb2NrID0gbnVsbDtcbiAgICB9XG4gICAgY29uc3Qgc2VlbklkcyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGNvbnN0IGFwcGx5VG9BcmVhID0gKGFyZWE6IEhUTUxEaXZFbGVtZW50LCBhcmVhTmFtZTogc3RyaW5nKSA9PiB7XG4gICAgICBjb25zdCBibG9ja3MgPSBBcnJheS5mcm9tKFxuICAgICAgICBhcmVhLnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTERpdkVsZW1lbnQ+KFwiLnBhcnNvbnMtYmxvY2tcIiksXG4gICAgICApO1xuICAgICAgYmxvY2tzLmZvckVhY2goKGJsb2NrLCBpKSA9PiB7XG4gICAgICAgIGlmICghYmxvY2suaWQgfHwgc2Vlbklkcy5oYXMoYmxvY2suaWQpKSB7XG4gICAgICAgICAgdGhpcy5fbmV4dEJsb2NrSWQgKz0gMTtcbiAgICAgICAgICBibG9jay5pZCA9IGAke3RoaXMuZWwuaWR9LWJsb2NrLSR7dGhpcy5fbmV4dEJsb2NrSWR9YDtcbiAgICAgICAgfVxuICAgICAgICBzZWVuSWRzLmFkZChibG9jay5pZCk7XG4gICAgICAgIGJsb2NrLnNldEF0dHJpYnV0ZShcInJvbGVcIiwgXCJvcHRpb25cIik7XG4gICAgICAgIGJsb2NrLnNldEF0dHJpYnV0ZShcbiAgICAgICAgICBcImFyaWEtbGFiZWxcIixcbiAgICAgICAgICBgJHt0aGlzLl9nZXRBY2Nlc3NpYmxlQmxvY2tUZXh0KGJsb2NrKX0sICR7YXJlYU5hbWV9LCBpdGVtICR7aSArIDF9IG9mICR7YmxvY2tzLmxlbmd0aH0ke2Jsb2NrLmNsYXNzTGlzdC5jb250YWlucyhcImluY29ycmVjdFBvc2l0aW9uXCIpID8gXCIsIGluY29ycmVjdFwiIDogXCJcIn1gLFxuICAgICAgICApO1xuICAgICAgICBibG9jay5zZXRBdHRyaWJ1dGUoXG4gICAgICAgICAgXCJhcmlhLXNlbGVjdGVkXCIsXG4gICAgICAgICAgU3RyaW5nKGJsb2NrID09PSB0aGlzLl9hY3RpdmVCbG9jayksXG4gICAgICAgICk7XG4gICAgICAgIGJsb2NrLnNldEF0dHJpYnV0ZShcInRhYmluZGV4XCIsIFwiLTFcIik7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIGFwcGx5VG9BcmVhKHRoaXMuX2RyYWdBcmVhLCBcImF2YWlsYWJsZSBibG9ja3NcIik7XG4gICAgYXBwbHlUb0FyZWEodGhpcy5fZHJvcEFyZWEsIFwiYW5zd2VyIGFyZWFcIik7XG4gIH07XG5cbiAgcHJpdmF0ZSBfYWxsQmxvY2tzID0gKCk6IEhUTUxEaXZFbGVtZW50W10gPT4gW1xuICAgIC4uLnRoaXMuX2RyYWdBcmVhLnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTERpdkVsZW1lbnQ+KFwiLnBhcnNvbnMtYmxvY2tcIiksXG4gICAgLi4udGhpcy5fZHJvcEFyZWEucXVlcnlTZWxlY3RvckFsbDxIVE1MRGl2RWxlbWVudD4oXCIucGFyc29ucy1ibG9ja1wiKSxcbiAgXTtcblxuICBwdWJsaWMgcmVmcmVzaEJsb2NrQXJpYSA9ICgpOiB2b2lkID0+IHtcbiAgICB0aGlzLl91cGRhdGVCbG9ja0FyaWEoKTtcbiAgfTtcblxuICBwcml2YXRlIF9nZXRLZXlib2FyZEJsb2NrTG9jYXRpb24gPSAoYmxvY2s6IEhUTUxEaXZFbGVtZW50KTogc3RyaW5nID0+IHtcbiAgICBjb25zdCBhcmVhID1cbiAgICAgIGJsb2NrLnBhcmVudEVsZW1lbnQgPT09IHRoaXMuX2RyYWdBcmVhXG4gICAgICAgID8gdGhpcy5fZHJhZ0FyZWFcbiAgICAgICAgOiB0aGlzLl9kcm9wQXJlYTtcbiAgICBjb25zdCBibG9ja3MgPSBBcnJheS5mcm9tKFxuICAgICAgYXJlYS5xdWVyeVNlbGVjdG9yQWxsPEhUTUxEaXZFbGVtZW50PihcIi5wYXJzb25zLWJsb2NrXCIpLFxuICAgICk7XG4gICAgY29uc3QgcG9zaXRpb24gPSBibG9ja3MuaW5kZXhPZihibG9jaykgKyAxO1xuICAgIHJldHVybiBhcmVhID09PSB0aGlzLl9kcmFnQXJlYVxuICAgICAgPyB0KFwibXNnX3BhcnNvbl9rZXlib2FyZF91bnBsYWNlZF9wb3NpdGlvblwiLCBwb3NpdGlvbiwgYmxvY2tzLmxlbmd0aClcbiAgICAgIDogdChcIm1zZ19wYXJzb25fa2V5Ym9hcmRfYW5zd2VyX3Bvc2l0aW9uXCIsIHBvc2l0aW9uLCBibG9ja3MubGVuZ3RoKTtcbiAgfTtcblxuICBwcml2YXRlIF9lbnRlcktleWJvYXJkTmF2aWdhdGlvbk1vZGUgPSAoXG4gICAgYmxvY2s6IEhUTUxEaXZFbGVtZW50LFxuICAgIGluY2x1ZGVJbnN0cnVjdGlvbnMgPSBmYWxzZSxcbiAgKTogdm9pZCA9PiB7XG4gICAgY29uc3QgbGFiZWwgPSBbXG4gICAgICB0KFwibXNnX3BhcnNvbl9rZXlib2FyZF9zZWxlY3RlZFwiLCB0aGlzLl9nZXRBY2Nlc3NpYmxlQmxvY2tUZXh0KGJsb2NrKSksXG4gICAgXTtcbiAgICBpZiAoYmxvY2suY2xhc3NMaXN0LmNvbnRhaW5zKFwiaW5jb3JyZWN0UG9zaXRpb25cIikpIHtcbiAgICAgIGxhYmVsLnB1c2godChcIm1zZ19wYXJzb25faW5jb3JyZWN0XCIpKTtcbiAgICB9XG4gICAgbGFiZWwucHVzaCh0aGlzLl9nZXRLZXlib2FyZEJsb2NrTG9jYXRpb24oYmxvY2spKTtcbiAgICB0aGlzLl9rZXlib2FyZEFwcGxpY2F0aW9uLnNldEF0dHJpYnV0ZShcbiAgICAgIFwiYXJpYS1sYWJlbFwiLFxuICAgICAgaW5jbHVkZUluc3RydWN0aW9uc1xuICAgICAgICA/IGAke3QoXCJtc2dfcGFyc29uX2tleWJvYXJkX2luc3RydWN0aW9uc1wiKX0gJHtsYWJlbC5qb2luKFwiLiBcIil9YFxuICAgICAgICA6IGxhYmVsLmpvaW4oXCIuIFwiKSxcbiAgICApO1xuICAgIHRoaXMuX2tleWJvYXJkQXBwbGljYXRpb24uZm9jdXMoKTtcbiAgfTtcblxuICBwcml2YXRlIF9zZXRBY3RpdmVCbG9jayA9IChcbiAgICBibG9jazogSFRNTERpdkVsZW1lbnQsXG4gICAgaW5jbHVkZUluc3RydWN0aW9ucyA9IGZhbHNlLFxuICApOiB2b2lkID0+IHtcbiAgICB0aGlzLl9hY3RpdmVCbG9jayA9IGJsb2NrO1xuICAgIHRoaXMuX3VwZGF0ZUJsb2NrQXJpYSgpO1xuICAgIGlmICh0aGlzLl9rZXlib2FyZElucHV0QWN0aXZlKSB7XG4gICAgICB0aGlzLl9lbnRlcktleWJvYXJkTmF2aWdhdGlvbk1vZGUoYmxvY2ssIGluY2x1ZGVJbnN0cnVjdGlvbnMpO1xuICAgIH1cbiAgfTtcblxuICAvKiogUmVzdG9yZSB0aGUga2V5Ym9hcmQgc3VyZmFjZSBhZnRlciBhIHBvaW50ZXIgY2xpY2sgbW92ZXMgYSBibG9jay4gKi9cbiAgcHJpdmF0ZSBfcmVmb2N1c01vdmVkQmxvY2sgPSAoYmxvY2s6IEhUTUxEaXZFbGVtZW50KTogdm9pZCA9PiB7XG4gICAgaWYgKCF0aGlzLl9rZXlib2FyZElucHV0QWN0aXZlKSByZXR1cm47XG4gICAgdGhpcy5fc2V0QWN0aXZlQmxvY2soYmxvY2spO1xuICB9O1xuXG4gIHByaXZhdGUgX2VudGVyS2V5Ym9hcmRNb3ZlbWVudCA9ICgpOiB2b2lkID0+IHtcbiAgICBjb25zdCBibG9ja3MgPSB0aGlzLl9hbGxCbG9ja3MoKTtcbiAgICBpZiAoYmxvY2tzLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuICAgIHRoaXMuX2tleWJvYXJkSW5wdXRBY3RpdmUgPSB0cnVlO1xuICAgIHRoaXMuX2hpZGVLZXlib2FyZEVudHJ5SGludCgpO1xuICAgIHRoaXMuX2tleWJvYXJkSW5zdHJ1Y3Rpb25zLnRleHRDb250ZW50ID1cbiAgICAgIHQoXCJtc2dfaHBhcnNvbnNfa2V5Ym9hcmRfaW5zdHJ1Y3Rpb25zXCIpO1xuICAgIHRoaXMuX3NldEFjdGl2ZUJsb2NrKGJsb2Nrc1swXSwgdHJ1ZSk7XG4gICAgdGhpcy5fYW5ub3VuY2UodChcIm1zZ19ocGFyc29uc19tb3ZpbmdcIiwgdGhpcy5fZ2V0QWNjZXNzaWJsZUJsb2NrVGV4dChibG9ja3NbMF0pKSk7XG4gIH07XG5cbiAgcHJpdmF0ZSBfZXhpdEtleWJvYXJkTW92ZW1lbnQgPSAocmV0dXJuRm9jdXNUb0VudHJ5ID0gZmFsc2UpOiB2b2lkID0+IHtcbiAgICB0aGlzLl9rZXlib2FyZElucHV0QWN0aXZlID0gZmFsc2U7XG4gICAgdGhpcy5fYWN0aXZlQmxvY2sgPSBudWxsO1xuICAgIHRoaXMuX2tleWJvYXJkQXBwbGljYXRpb24ucmVtb3ZlQXR0cmlidXRlKFwiYXJpYS1sYWJlbFwiKTtcbiAgICB0aGlzLmVsLnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIiwgdChcIm1zZ19wYXJzb25fa2V5Ym9hcmRfZW50cnlfbGFiZWxcIikpO1xuICAgIHRoaXMuX2tleWJvYXJkSW5zdHJ1Y3Rpb25zLnRleHRDb250ZW50ID1cbiAgICAgIHQoXCJtc2dfaHBhcnNvbnNfa2V5Ym9hcmRfaWRsZV9pbnN0cnVjdGlvbnNcIik7XG4gICAgdGhpcy5fdXBkYXRlQmxvY2tBcmlhKCk7XG4gICAgdGhpcy5fYW5ub3VuY2UodChcIm1zZ19ocGFyc29uc19rZXlib2FyZF9maW5pc2hlZFwiKSk7XG4gICAgaWYgKHJldHVybkZvY3VzVG9FbnRyeSkge1xuICAgICAgdGhpcy5lbC5mb2N1cygpO1xuICAgIH1cbiAgfTtcblxuICBwcml2YXRlIF9tb3ZlQWN0aXZlQmxvY2sgPSAoZXY6IEtleWJvYXJkRXZlbnQpOiB2b2lkID0+IHtcbiAgICBjb25zdCBibG9jayA9IHRoaXMuX2FjdGl2ZUJsb2NrO1xuICAgIGlmICghYmxvY2spIHJldHVybjtcbiAgICBjb25zdCB3YXNJbkRyYWdBcmVhID0gYmxvY2sucGFyZW50RWxlbWVudCA9PT0gdGhpcy5fZHJhZ0FyZWE7XG4gICAgdGhpcy5fb25CbG9ja0NsaWNrZWQoYmxvY2ssIGV2KTtcbiAgICBjb25zdCBtb3ZlZEJsb2NrID1cbiAgICAgIHdhc0luRHJhZ0FyZWEgJiYgdGhpcy5yZXVzYWJsZVxuICAgICAgICA/ICh0aGlzLl9kcm9wQXJlYS5sYXN0RWxlbWVudENoaWxkIGFzIEhUTUxEaXZFbGVtZW50KVxuICAgICAgICA6IGJsb2NrO1xuICAgIHRoaXMuX3NldEFjdGl2ZUJsb2NrKG1vdmVkQmxvY2spO1xuICB9O1xuXG4gIC8qKiBBbm5vdW5jZSBhIG1lc3NhZ2UgdG8gc2NyZWVuIHJlYWRlcnMgdmlhIHRoZSBsaXZlIHJlZ2lvbi4gKi9cbiAgcHJpdmF0ZSBfYW5ub3VuY2UgPSAobWVzc2FnZTogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgLy8gQ2xlYXIgZmlyc3Qgc28gcmVwZWF0ZWQgaWRlbnRpY2FsIG1lc3NhZ2VzIHN0aWxsIHRyaWdnZXIgcmUtYW5ub3VuY2VtZW50XG4gICAgdGhpcy5fbGl2ZVJlZ2lvbi50ZXh0Q29udGVudCA9IFwiXCI7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLl9saXZlUmVnaW9uLnRleHRDb250ZW50ID0gbWVzc2FnZTtcbiAgICB9LCAxMCk7XG4gIH07XG5cbiAgLyoqIFVzZSBvbmUgVGFiIHN0b3AgZm9yIGJvdGggYmxvY2sgYXJlYXMgYW5kIHNjb3BlIGFycm93cyB0byBtb3ZlbWVudCBtb2RlLiAqL1xuICBwcml2YXRlIF9zZXR1cEtleWJvYXJkTmF2ID0gKCk6IHZvaWQgPT4ge1xuICAgIHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcihcImZvY3VzXCIsICgpID0+IHtcbiAgICAgIGlmIChcbiAgICAgICAgIXRoaXMuX2tleWJvYXJkSW5wdXRBY3RpdmUgJiZcbiAgICAgICAgdGhpcy5lbC5tYXRjaGVzKFwiOmZvY3VzLXZpc2libGVcIilcbiAgICAgICkge1xuICAgICAgICB0aGlzLl9zaG93S2V5Ym9hcmRFbnRyeUhpbnQoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLmVsLmFkZEV2ZW50TGlzdGVuZXIoXCJibHVyXCIsIChldjogRm9jdXNFdmVudCkgPT4ge1xuICAgICAgaWYgKFxuICAgICAgICB0aGlzLl9rZXlib2FyZElucHV0QWN0aXZlICYmXG4gICAgICAgIGV2LnJlbGF0ZWRUYXJnZXQgIT09IHRoaXMuX2tleWJvYXJkQXBwbGljYXRpb25cbiAgICAgICkge1xuICAgICAgICB0aGlzLl9leGl0S2V5Ym9hcmRNb3ZlbWVudCgpO1xuICAgICAgfSBlbHNlIGlmICghdGhpcy5fa2V5Ym9hcmRJbnB1dEFjdGl2ZSkge1xuICAgICAgICB0aGlzLl9oaWRlS2V5Ym9hcmRFbnRyeUhpbnQoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLmVsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXY6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgIGlmIChcbiAgICAgICAgZXYudGFyZ2V0ID09PSB0aGlzLmVsICYmXG4gICAgICAgICF0aGlzLl9rZXlib2FyZElucHV0QWN0aXZlXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5fZW50ZXJLZXlib2FyZE1vdmVtZW50KCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLmVsLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIChldjogS2V5Ym9hcmRFdmVudCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLl9rZXlib2FyZElucHV0QWN0aXZlKSB7XG4gICAgICAgIGlmIChldi50YXJnZXQgIT09IHRoaXMuZWwpIHJldHVybjtcbiAgICAgICAgaWYgKGV2LmtleSA9PT0gXCJFbnRlclwiIHx8IGV2LmtleSA9PT0gXCIgXCIpIHtcbiAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIHRoaXMuX2VudGVyS2V5Ym9hcmRNb3ZlbWVudCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmICghdGhpcy5lbC5jb250YWlucyhldi50YXJnZXQgYXMgTm9kZSkpIHJldHVybjtcbiAgICAgIGlmIChldi5rZXkgPT09IFwiRXNjYXBlXCIpIHtcbiAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdGhpcy5fZXhpdEtleWJvYXJkTW92ZW1lbnQodHJ1ZSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChldi5rZXkgPT09IFwiVGFiXCIpIHtcbiAgICAgICAgdGhpcy5fZXhpdEtleWJvYXJkTW92ZW1lbnQoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgYWN0aXZlQmxvY2sgPSB0aGlzLl9hY3RpdmVCbG9jayBhcyBIVE1MRGl2RWxlbWVudDtcbiAgICAgIGlmICghYWN0aXZlQmxvY2spIHtcbiAgICAgICAgY29uc3QgYmxvY2tzID0gdGhpcy5fYWxsQmxvY2tzKCk7XG4gICAgICAgIGlmIChibG9ja3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgdGhpcy5fZXhpdEtleWJvYXJkTW92ZW1lbnQoKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fc2V0QWN0aXZlQmxvY2soYmxvY2tzWzBdKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgY3VycmVudEFyZWEgPVxuICAgICAgICBhY3RpdmVCbG9jay5wYXJlbnRFbGVtZW50ID09PSB0aGlzLl9kcmFnQXJlYVxuICAgICAgICAgID8gdGhpcy5fZHJhZ0FyZWFcbiAgICAgICAgICA6IHRoaXMuX2Ryb3BBcmVhO1xuICAgICAgY29uc3Qgb3RoZXJBcmVhID1cbiAgICAgICAgY3VycmVudEFyZWEgPT09IHRoaXMuX2RyYWdBcmVhID8gdGhpcy5fZHJvcEFyZWEgOiB0aGlzLl9kcmFnQXJlYTtcbiAgICAgIGNvbnN0IGN1cnJlbnRCbG9ja3MgPSBBcnJheS5mcm9tKFxuICAgICAgICBjdXJyZW50QXJlYS5xdWVyeVNlbGVjdG9yQWxsPEhUTUxEaXZFbGVtZW50PihcIi5wYXJzb25zLWJsb2NrXCIpLFxuICAgICAgKTtcbiAgICAgIGNvbnN0IGluZGV4ID0gY3VycmVudEJsb2Nrcy5pbmRleE9mKGFjdGl2ZUJsb2NrKTtcbiAgICAgIGlmIChldi5rZXkgPT09IFwiQXJyb3dSaWdodFwiKSB7XG4gICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGlmIChpbmRleCA8IGN1cnJlbnRCbG9ja3MubGVuZ3RoIC0gMSlcbiAgICAgICAgICB0aGlzLl9zZXRBY3RpdmVCbG9jayhjdXJyZW50QmxvY2tzW2luZGV4ICsgMV0pO1xuICAgICAgfSBlbHNlIGlmIChldi5rZXkgPT09IFwiQXJyb3dMZWZ0XCIpIHtcbiAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgaWYgKGluZGV4ID4gMCkgdGhpcy5fc2V0QWN0aXZlQmxvY2soY3VycmVudEJsb2Nrc1tpbmRleCAtIDFdKTtcbiAgICAgIH0gZWxzZSBpZiAoZXYua2V5ID09PSBcIkFycm93VXBcIiB8fCBldi5rZXkgPT09IFwiQXJyb3dEb3duXCIpIHtcbiAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgY29uc3Qgb3RoZXJCbG9ja3MgPSBBcnJheS5mcm9tKFxuICAgICAgICAgIG90aGVyQXJlYS5xdWVyeVNlbGVjdG9yQWxsPEhUTUxEaXZFbGVtZW50PihcIi5wYXJzb25zLWJsb2NrXCIpLFxuICAgICAgICApO1xuICAgICAgICBpZiAob3RoZXJCbG9ja3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHRoaXMuX3NldEFjdGl2ZUJsb2NrKG90aGVyQmxvY2tzW01hdGgubWluKGluZGV4LCBvdGhlckJsb2Nrcy5sZW5ndGggLSAxKV0pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGV2LmtleSA9PT0gXCJFbnRlclwiIHx8IGV2LmtleSA9PT0gXCIgXCIpIHtcbiAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdGhpcy5fbW92ZUFjdGl2ZUJsb2NrKGV2KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICBwcml2YXRlIF9zaG93S2V5Ym9hcmRFbnRyeUhpbnQgPSAoKTogdm9pZCA9PiB7XG4gICAgdGhpcy5fa2V5Ym9hcmRFbnRyeUhpbnQudGV4dENvbnRlbnQgPSB0KFwibXNnX3BhcnNvbl9lbnRlcl9hY3RpdmF0ZVwiKTtcbiAgICB0aGlzLl9rZXlib2FyZEVudHJ5SGludC5zdHlsZS5kaXNwbGF5ID0gXCJcIjtcbiAgICB0aGlzLl9rZXlib2FyZEVudHJ5SGludC5jbGFzc0xpc3QucmVtb3ZlKFwicGFyc29ucy1lbnRyeS1oaW50XCIpO1xuICAgIHZvaWQgdGhpcy5fa2V5Ym9hcmRFbnRyeUhpbnQub2Zmc2V0V2lkdGg7XG4gICAgdGhpcy5fa2V5Ym9hcmRFbnRyeUhpbnQuY2xhc3NMaXN0LmFkZChcInBhcnNvbnMtZW50cnktaGludFwiKTtcbiAgfTtcblxuICBwcml2YXRlIF9oaWRlS2V5Ym9hcmRFbnRyeUhpbnQgPSAoKTogdm9pZCA9PiB7XG4gICAgdGhpcy5fa2V5Ym9hcmRFbnRyeUhpbnQuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgIHRoaXMuX2tleWJvYXJkRW50cnlIaW50LmNsYXNzTGlzdC5yZW1vdmUoXCJwYXJzb25zLWVudHJ5LWhpbnRcIik7XG4gIH07XG5cbiAgcHJpdmF0ZSBfZ2V0QmxvY2tQb3NpdGlvbiA9IChibG9jazogTm9kZSk6IG51bWJlciA9PiB7XG4gICAgbGV0IHBvc2l0aW9uID0gLTE7XG4gICAgY29uc3QgcGFyZW50ID0gdGhpcy5fZHJvcEFyZWE7XG4gICAgaWYgKHBhcmVudCkge1xuICAgICAgZm9yIChwb3NpdGlvbiA9IDA7IHBvc2l0aW9uIDwgcGFyZW50LmNoaWxkTm9kZXMubGVuZ3RoOyArK3Bvc2l0aW9uKSB7XG4gICAgICAgIGlmIChwYXJlbnQuY2hpbGROb2Rlc1twb3NpdGlvbl0gPT09IGJsb2NrKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHBvc2l0aW9uO1xuICB9O1xuXG4gIHB1YmxpYyBfZ2V0VGV4dEFycmF5ID0gKCk6IEFycmF5PHN0cmluZz4gPT4ge1xuICAgIGxldCBhbnN3ZXI6IEFycmF5PHN0cmluZz4gPSBbXTtcbiAgICBpZiAodGhpcy5fZHJvcEFyZWEuaGFzQ2hpbGROb2RlcygpKSB7XG4gICAgICBsZXQgZWwgPSB0aGlzLl9kcm9wQXJlYS5maXJzdENoaWxkIGFzIEhUTUxEaXZFbGVtZW50O1xuICAgICAgYW5zd2VyLnB1c2godGhpcy5fZ2V0VGV4dEZyb21CbG9jayhlbCkpO1xuICAgICAgd2hpbGUgKGVsLm5leHRTaWJsaW5nKSB7XG4gICAgICAgIGVsID0gZWwubmV4dFNpYmxpbmcgYXMgSFRNTERpdkVsZW1lbnQ7XG4gICAgICAgIGFuc3dlci5wdXNoKHRoaXMuX2dldFRleHRGcm9tQmxvY2soZWwpKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGFuc3dlcjtcbiAgfTtcblxuICBwdWJsaWMgcmVtb3ZlRm9ybWF0ID0gKCk6IHZvaWQgPT4ge1xuICAgIGlmICh0aGlzLl9kcm9wQXJlYS5oYXNDaGlsZE5vZGVzKCkpIHtcbiAgICAgIGxldCBlbCA9IHRoaXMuX2Ryb3BBcmVhLmZpcnN0Q2hpbGQgYXMgSFRNTERpdkVsZW1lbnQ7XG4gICAgICBlbC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcImJhY2tncm91bmQtY29sb3JcIik7XG4gICAgICB3aGlsZSAoZWwubmV4dFNpYmxpbmcpIHtcbiAgICAgICAgZWwgPSBlbC5uZXh0U2libGluZyBhcyBIVE1MRGl2RWxlbWVudDtcbiAgICAgICAgZWwuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJiYWNrZ3JvdW5kLWNvbG9yXCIpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBwdWJsaWMgcmVzZXRJbnB1dCA9ICgpOiB2b2lkID0+IHtcbiAgICBpZiAodGhpcy5yZXVzYWJsZSkge1xuICAgICAgd2hpbGUgKHRoaXMuX2Ryb3BBcmVhLmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgdGhpcy5fZHJvcEFyZWEucmVtb3ZlQ2hpbGQodGhpcy5fZHJvcEFyZWEuZmlyc3RDaGlsZCk7XG4gICAgICB9XG4gICAgICB0aGlzLl91cGRhdGVCbG9ja0FyaWEoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fcmVzZXRJbnB1dCgpOyAvLyBfcmVzZXRJbnB1dCBhbHJlYWR5IGNhbGxzIF91cGRhdGVCbG9ja0FyaWFcbiAgICB9XG4gIH07XG5cbiAgcHVibGljIHJlc3RvcmVBbnN3ZXIoYW5zd2VyOiBBcnJheTxzdHJpbmc+KTogdm9pZCB7XG4gICAgdGhpcy5yZXNldElucHV0KCk7XG4gICAgY29uc3Qgc3BhY2UgPSAvXlxccyskLztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFuc3dlci5sZW5ndGg7ICsraSkge1xuICAgICAgbGV0IGlzQW5zd2VyU3BhY2UgPSBzcGFjZS50ZXN0KGFuc3dlcltpXSk7XG4gICAgICBpZiAodGhpcy5fZHJhZ0FyZWEuaGFzQ2hpbGROb2RlcygpKSB7XG4gICAgICAgIGxldCBlbCA9IHRoaXMuX2RyYWdBcmVhLmZpcnN0Q2hpbGQgYXMgSFRNTERpdkVsZW1lbnQ7XG4gICAgICAgIHdoaWxlIChlbCkge1xuICAgICAgICAgIGlmIChpc0Fuc3dlclNwYWNlKSB7XG4gICAgICAgICAgICAvLyBjdXJyZW50IGFuc3dlciBibG9jayBpcyBhIGxpc3Qgb2Ygc3BhY2VcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgc3BhY2UudGVzdCh0aGlzLl9nZXRUZXh0RnJvbUJsb2NrKGVsKSkgJiZcbiAgICAgICAgICAgICAgYW5zd2VyW2ldLmxlbmd0aCA9PSB0aGlzLl9nZXRUZXh0RnJvbUJsb2NrKGVsKS5sZW5ndGhcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICBlbC5jbGljaygpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2dldFRleHRGcm9tQmxvY2soZWwpID09IGFuc3dlcltpXSkge1xuICAgICAgICAgICAgLy8gZm91bmQgdGhlIGJsb2NrXG4gICAgICAgICAgICBlbC5jbGljaygpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsID0gZWwubmV4dFNpYmxpbmcgYXMgSFRNTERpdkVsZW1lbnQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgcmVzdG9yZUV2ZW50OiBNaWNyb1BhcnNvbnNFdmVudC5SZXN0b3JlQW5zd2VyID0ge1xuICAgICAgdHlwZTogXCJyZXN0b3JlXCIsXG4gICAgICBhbnN3ZXI6IGFuc3dlcixcbiAgICB9O1xuICAgIHRoaXMucGFyZW50RWxlbWVudC5sb2dFdmVudChyZXN0b3JlRXZlbnQpO1xuICB9XG5cbiAgcHVibGljIHJlc3RvcmVBbnN3ZXJCeUluZGljZXMoaW5kaWNlczogQXJyYXk8bnVtYmVyPik6IHZvaWQge1xuICAgIHRoaXMucmVzZXRJbnB1dCgpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbmRpY2VzLmxlbmd0aDsgKytpKSB7XG4gICAgICBjb25zdCB0YXJnZXQgPSBTdHJpbmcoaW5kaWNlc1tpXSk7XG5cbiAgICAgIGlmICh0aGlzLl9kcmFnQXJlYS5oYXNDaGlsZE5vZGVzKCkpIHtcbiAgICAgICAgbGV0IGVsID0gdGhpcy5fZHJhZ0FyZWEuZmlyc3RDaGlsZCBhcyBIVE1MRGl2RWxlbWVudDtcbiAgICAgICAgd2hpbGUgKGVsKSB7XG4gICAgICAgICAgaWYgKGVsLmRhdGFzZXQuaW5kZXggPT09IHRhcmdldCkge1xuICAgICAgICAgICAgZWwuY2xpY2soKTsgLy8gcHJlc2VydmUgcmV1c2FibGUvbm9ucmV1c2FibGUgYmVoYXZpb3JcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbCA9IGVsLm5leHRTaWJsaW5nIGFzIEhUTUxEaXZFbGVtZW50O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gS2VlcCBsb2dnaW5nIHR5cGUtY29tcGF0aWJsZSB3aXRob3V0IHRvdWNoaW5nIExvZ2dpbmdFdmVudHMgaW4gdGhpcyBQUjpcbiAgICBjb25zdCByZXN0b3JlRXZlbnQ6IE1pY3JvUGFyc29uc0V2ZW50LlJlc3RvcmVBbnN3ZXIgPSB7XG4gICAgICB0eXBlOiBcInJlc3RvcmVcIixcbiAgICAgIC8vIHN0b3JlIGFzIHN0cmluZ3MgdG8gc2F0aXNmeSBBcnJheTxzdHJpbmc+IHR5cGVcbiAgICAgIGFuc3dlcjogaW5kaWNlcy5tYXAoU3RyaW5nKSxcbiAgICB9O1xuICAgIHRoaXMucGFyZW50RWxlbWVudC5sb2dFdmVudChyZXN0b3JlRXZlbnQpO1xuICB9XG59XG4iLCIvKiAoaWdub3JlZCkgKi8iLCJpbXBvcnQgUnVuZXN0b25lQmFzZSBmcm9tIFwiLi4vLi4vY29tbW9uL2pzL3J1bmVzdG9uZWJhc2UuanNcIjtcbmltcG9ydCB7IGRpc2FibGVNYXRoSmF4VGFiU3RvcHMgfSBmcm9tIFwiLi4vLi4vY29tbW9uL2pzL21hdGhqYXgtYTExeS5qc1wiO1xuaW1wb3J0IHsgdCB9IGZyb20gXCIuLi8uLi9jb21tb24vanMvcnNpMThuLmpzXCI7XG5pbXBvcnQgXCIuL2hwYXJzb25zLWkxOG4uZW4uanNcIjtcbmltcG9ydCBcIi4vaHBhcnNvbnMtaTE4bi5wdC1ici5qc1wiO1xuaW1wb3J0IFwiLi9ocGFyc29ucy1pMThuLnNyLUN5cmwuanNcIjtcblxuaW1wb3J0IFwiLi4vY3NzL2hsanMteGNvZGUuY3NzXCI7XG5pbXBvcnQgQmxvY2tGZWVkYmFjayBmcm9tIFwiLi9CbG9ja0ZlZWRiYWNrLmpzXCI7XG5pbXBvcnQgU1FMRmVlZGJhY2sgZnJvbSBcIi4vU1FMRmVlZGJhY2suanNcIjtcbi8vIFRoZSBtaWNyby1wYXJzb25zIGVsZW1lbnQgc291cmNlIG5vdyBsaXZlcyBhbG9uZ3NpZGUgaHBhcnNvbnMgaW4gLi9taWNyby1wYXJzb25zLlxuLy8gSXQgaXMgY29tcGlsZWQgZGlyZWN0bHkgYnkgdGhlIGludGVyYWN0aXZlcyB3ZWJwYWNrL3RzLWxvYWRlciBidWlsZCAobm8gc2VwYXJhdGVcbi8vIHJlcG8gb3IgbnBtIHRhcmJhbGwpLiBtaWNyby1wYXJzb25zLnRzIGltcG9ydHMgaXRzIG93biBzdHlsZS9zdHlsZS5jc3MuXG5pbXBvcnQgeyBJbml0TWljcm9QYXJzb25zIH0gZnJvbSBcIi4vbWljcm8tcGFyc29ucy9taWNyby1wYXJzb25zXCI7XG4vLyBsYXN0IHRvIG92ZXJyaWRlIG1pY3JvLXBhcnNvbnMgY3NzIGlmIG5lZWRlZFxuaW1wb3J0IFwiLi4vY3NzL2hwYXJzb25zLmNzc1wiO1xuXG5leHBvcnQgdmFyIGhwTGlzdDtcbi8vIERpY3Rpb25hcnkgdGhhdCBjb250YWlucyBhbGwgaW5zdGFuY2VzIG9mIGhvcml6b250YWwgUGFyc29ucyBwcm9ibGVtIG9iamVjdHNcbmlmIChocExpc3QgPT09IHVuZGVmaW5lZCkgaHBMaXN0ID0ge307XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEhQYXJzb25zIGV4dGVuZHMgUnVuZXN0b25lQmFzZSB7XG4gICAgY29uc3RydWN0b3Iob3B0cykge1xuICAgICAgICBzdXBlcihvcHRzKTtcbiAgICAgICAgLy8gZ2V0dGluZyBzZXR0aW5nc1xuICAgICAgICB2YXIgb3JpZyA9IG9wdHMub3JpZy5xdWVyeVNlbGVjdG9yKFwidGV4dGFyZWFcIik7XG4gICAgICAgIHRoaXMucmV1c2UgPSB0aGlzLnBhcnNlQm9vbGVhbkF0dHJpYnV0ZShvcmlnLCBcImRhdGEtcmV1c2VcIik7XG4gICAgICAgIHRoaXMucmFuZG9taXplID0gdGhpcy5wYXJzZUJvb2xlYW5BdHRyaWJ1dGUob3JpZywgXCJkYXRhLXJhbmRvbWl6ZVwiKTtcbiAgICAgICAgdGhpcy5pc0Jsb2NrR3JhZGluZyA9IHRoaXMucGFyc2VCb29sZWFuQXR0cmlidXRlKFxuICAgICAgICAgICAgb3JpZyxcbiAgICAgICAgICAgIFwiZGF0YS1ibG9ja2Fuc3dlclwiLFxuICAgICAgICApO1xuICAgICAgICB0aGlzLmxhbmd1YWdlID0gb3JpZy5nZXRBdHRyaWJ1dGUoXCJkYXRhLWxhbmd1YWdlXCIpO1xuICAgICAgICAvLyBEZXRlY3QgbWF0aCBtb2RlXG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHRoaXMubGFuZ3VhZ2UgPT0gbnVsbCAmJlxuICAgICAgICAgICAgb3JpZy50ZXh0Q29udGVudC5pbmNsdWRlcygnc3BhbiBjbGFzcz1cInByb2Nlc3MtbWF0aFwiJylcbiAgICAgICAgKSB7XG4gICAgICAgICAgICB0aGlzLmxhbmd1YWdlID0gXCJtYXRoXCI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuaXNCbG9ja0dyYWRpbmcpIHtcbiAgICAgICAgICAgIC8vIEV4dHJhIHdoaXRlc3BhY2UgaW4gdGhlIGF0dHJpYnV0ZSB3b3VsZCBvdGhlcndpc2UgcHJvZHVjZSBlbXB0eVxuICAgICAgICAgICAgLy8gdG9rZW5zLCB3aGljaCBOdW1iZXIoKSB0dXJucyBpbnRvIGEgc3B1cmlvdXMgYmxvY2sgMC5cbiAgICAgICAgICAgIHRoaXMuYmxvY2tBbnN3ZXIgPSBvcmlnXG4gICAgICAgICAgICAgICAgLmdldEF0dHJpYnV0ZShcImRhdGEtYmxvY2thbnN3ZXJcIilcbiAgICAgICAgICAgICAgICAudHJpbSgpXG4gICAgICAgICAgICAgICAgLnNwbGl0KC9cXHMrLyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kaXZpZCA9IG9wdHMub3JpZy5pZDtcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYgPSBvcHRzLm9yaWc7XG4gICAgICAgIHRoaXMudXNlUnVuZXN0b25lU2VydmljZXMgPSBvcHRzLnVzZVJ1bmVzdG9uZVNlcnZpY2VzO1xuXG4gICAgICAgIC8vIFNldCB0aGUgc3RvcmFnZUlkIChrZXkgZm9yIHN0b3JpbmcgZGF0YSlcbiAgICAgICAgdmFyIHN0b3JhZ2VJZCA9IHN1cGVyLmxvY2FsU3RvcmFnZUtleSgpO1xuICAgICAgICB0aGlzLnN0b3JhZ2VJZCA9IHN0b3JhZ2VJZDtcblxuICAgICAgICB0aGlzLm9yaWdFbGVtID0gb3JpZztcbiAgICAgICAgbGV0IHN0YXRlbWVudEVsZW0gPSBvcHRzLm9yaWcucXVlcnlTZWxlY3RvcihcIi5ocF9xdWVzdGlvblwiKTtcbiAgICAgICAgaWYgKHN0YXRlbWVudEVsZW0pIHN0YXRlbWVudEVsZW0uY2xhc3NMaXN0LmFkZChcImV4ZXJjaXNlLXN0YXRlbWVudFwiKTtcbiAgICAgICAgdGhpcy5vcmlnVGV4dCA9IHRoaXMub3JpZ0VsZW0udGV4dENvbnRlbnQ7XG4gICAgICAgIHRoaXMuY29kZSA9IG9yaWcudGV4dENvbnRlbnQgfHwgXCJcXG5cXG5cXG5cXG5cXG5cIjtcbiAgICAgICAgdGhpcy5kYnVybCA9IG9yaWcuZ2V0QXR0cmlidXRlKFwiZGF0YS1kYnVybFwiKTtcbiAgICAgICAgdGhpcy5ydW5CdXR0b24gPSBudWxsO1xuICAgICAgICB0aGlzLnNhdmVCdXR0b24gPSBudWxsO1xuICAgICAgICB0aGlzLmxvYWRCdXR0b24gPSBudWxsO1xuICAgICAgICB0aGlzLm91dGVyRGl2ID0gbnVsbDtcbiAgICAgICAgdGhpcy5jb250cm9sRGl2ID0gbnVsbDtcbiAgICAgICAgdGhpcy5wcm9jZXNzQ29udGVudCh0aGlzLmNvZGUpO1xuXG4gICAgICAgIC8vIENoYW5nZSB0byBmYWN0b3J5IHdoZW4gbW9yZSBleGVjdXRpb24gYmFzZWQgZmVlZGJhY2sgaXMgaW5jbHVkZWRcbiAgICAgICAgaWYgKHRoaXMuaXNCbG9ja0dyYWRpbmcpIHtcbiAgICAgICAgICAgIHRoaXMuZmVlZGJhY2tDb250cm9sbGVyID0gbmV3IEJsb2NrRmVlZGJhY2sodGhpcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmZlZWRiYWNrQ29udHJvbGxlciA9IG5ldyBTUUxGZWVkYmFjayh0aGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNyZWF0aW5nIFVJIGNvbXBvbmVudHNcbiAgICAgICAgdGhpcy5jcmVhdGVFZGl0b3IoKTtcbiAgICAgICAgdGhpcy5jcmVhdGVDb250cm9scygpO1xuICAgICAgICB0aGlzLmNyZWF0ZU91dHB1dCgpO1xuICAgICAgICB0aGlzLmZlZWRiYWNrQ29udHJvbGxlci5jdXN0b21pemVVSSgpO1xuXG4gICAgICAgIGlmIChvcmlnLmdldEF0dHJpYnV0ZShcImRhdGEtY2FwdGlvblwiKSkge1xuICAgICAgICAgICAgdGhpcy5jYXB0aW9uID0gb3JpZy5nZXRBdHRyaWJ1dGUoXCJkYXRhLWNhcHRpb25cIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNhcHRpb24gPSBcIk1pY3JvUGFyc29uc1wiO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYWRkQ2FwdGlvbihcInJ1bmVzdG9uZVwiKTtcbiAgICAgICAgdGhpcy5pbmRpY2F0ZV9jb21wb25lbnRfcmVhZHkoKTtcblxuICAgICAgICAvLyBpbml0aWFsaXppbmcgZnVuY3Rpb25hbGl0aWVzIGZvciBkaWZmZXJlbnQgZmVlZGJhY2tcbiAgICAgICAgdGhpcy5mZWVkYmFja0NvbnRyb2xsZXIuaW5pdCgpO1xuICAgICAgICB0aGlzLmNoZWNrU2VydmVyKFwiaHBhcnNvbnNBbnN3ZXJcIiwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgcHJvY2Vzc0NvbnRlbnQoY29kZSkge1xuICAgICAgICAvLyB0b2RvOiBhZGQgZXJyb3JzIHdoZW4gYmxvY2tzIGFyZSBub25leGlzdGVudCAobWF5YmUgaW4gcHl0aG9uKT9cbiAgICAgICAgdGhpcy5oaWRkZW5QcmVmaXggPSB0aGlzLnByb2Nlc3NTaW5nbGVDb250ZW50KGNvZGUsIFwiLS1oaWRkZW5wcmVmaXgtLVwiKTtcbiAgICAgICAgdGhpcy5vcmlnaW5hbEJsb2NrcyA9IHRoaXMucHJvY2Vzc1NpbmdsZUNvbnRlbnQoY29kZSwgXCItLWJsb2Nrcy0tXCIpXG4gICAgICAgICAgICAuc3BsaXQoXCJcXG5cIilcbiAgICAgICAgICAgIC5zbGljZSgxLCAtMSk7XG4gICAgICAgIHRoaXMuaGlkZGVuU3VmZml4ID0gdGhpcy5wcm9jZXNzU2luZ2xlQ29udGVudChjb2RlLCBcIi0taGlkZGVuc3VmZml4LS1cIik7XG4gICAgICAgIHRoaXMudW5pdHRlc3QgPSB0aGlzLnByb2Nlc3NTaW5nbGVDb250ZW50KGNvZGUsIFwiLS11bml0dGVzdC0tXCIpO1xuICAgIH1cblxuICAgIHByb2Nlc3NTaW5nbGVDb250ZW50KGNvZGUsIGRlbGltaXRlcikge1xuICAgICAgICBsZXQgaW5kZXggPSBjb2RlLmluZGV4T2YoZGVsaW1pdGVyKTtcbiAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgIGxldCBjb250ZW50ID0gY29kZS5zdWJzdHJpbmcoaW5kZXggKyBkZWxpbWl0ZXIubGVuZ3RoKTtcbiAgICAgICAgICAgIGxldCBlbmRJbmRleCA9IGNvbnRlbnQuaW5kZXhPZihcIlxcbi0tXCIpO1xuICAgICAgICAgICAgY29udGVudCA9XG4gICAgICAgICAgICAgICAgZW5kSW5kZXggPiAtMSA/IGNvbnRlbnQuc3Vic3RyaW5nKDAsIGVuZEluZGV4ICsgMSkgOiBjb250ZW50O1xuICAgICAgICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICAvLyBjb3BpZWQgZnJvbSBhY3RpdmVjb2RlLCBhbHJlYWR5IG1vZGlmaWVkIHRvIGFkZCBwYXJzb25zXG4gICAgY3JlYXRlRWRpdG9yKCkge1xuICAgICAgICB0aGlzLm91dGVyRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdGhpcy5vcmlnRWxlbS5yZXBsYWNlV2l0aCh0aGlzLm91dGVyRGl2KTtcbiAgICAgICAgdGhpcy5vdXRlckRpdi5pZCA9IGAke3RoaXMuZGl2aWR9LWNvbnRhaW5lcmA7XG4gICAgICAgIHRoaXMub3V0ZXJEaXYuYWRkRXZlbnRMaXN0ZW5lcihcIm1pY3JvLXBhcnNvbnNcIiwgKGV2KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBldmVudExpc3RSdW5lc3RvbmUgPSBbXCJpbnB1dFwiLCBcInJlc2V0XCJdO1xuICAgICAgICAgICAgaWYgKGV2ZW50TGlzdFJ1bmVzdG9uZS5pbmNsdWRlcyhldi5kZXRhaWwudHlwZSkpIHtcbiAgICAgICAgICAgICAgICAvLyBvbmx5IGxvZyB0aGUgZXZlbnRzIGluIHRoZSBldmVudCBsaXN0XG4gICAgICAgICAgICAgICAgdGhpcy5sb2dIb3Jpem9udGFsUGFyc29uc0V2ZW50KGV2LmRldGFpbCk7XG4gICAgICAgICAgICAgICAgLy8gd2hlbiBldmVudCBpcyBpbnB1dCBvciByZXNldDogY2xlYXIgcHJldmlvdXMgZmVlZGJhY2tcbiAgICAgICAgICAgICAgICB0aGlzLmZlZWRiYWNrQ29udHJvbGxlci5jbGVhckZlZWRiYWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBwcm9wcyA9IHtcbiAgICAgICAgICAgIHNlbGVjdG9yOiBgIyR7dGhpcy5kaXZpZH0tY29udGFpbmVyYCxcbiAgICAgICAgICAgIGlkOiBgJHt0aGlzLmRpdmlkfS1ocGFyc29uc2AsXG4gICAgICAgICAgICByZXVzZTogdGhpcy5yZXVzZSxcbiAgICAgICAgICAgIHJhbmRvbWl6ZTogdGhpcy5yYW5kb21pemUsXG4gICAgICAgICAgICBwYXJzb25zQmxvY2tzOiBbLi4udGhpcy5vcmlnaW5hbEJsb2Nrc10sXG4gICAgICAgICAgICBsYW5ndWFnZTogdGhpcy5sYW5ndWFnZSxcbiAgICAgICAgfTtcbiAgICAgICAgSW5pdE1pY3JvUGFyc29ucyhwcm9wcyk7XG4gICAgICAgIHRoaXMuaHBhcnNvbnNJbnB1dCA9IHRoaXMub3V0ZXJEaXYucXVlcnlTZWxlY3RvcihcIm1pY3JvLXBhcnNvbnNcIik7XG4gICAgICAgIHRoaXMucmVuZGVyTWF0aEluQmxvY2tzKCk7XG4gICAgICAgIC8vIENoYW5nZSBcImNvZGVcIiB0byBcImFuc3dlclwiIGluIHBhcnNvbnMgZGlyZWN0aW9uIGZvciBub24tY29kZSBsYW5ndWFnZXNcbiAgICAgICAgaWYgKHRoaXMubGFuZ3VhZ2UgPT0gbnVsbCB8fCB0aGlzLmxhbmd1YWdlID09PSBcIm1hdGhcIikge1xuICAgICAgICAgICAgdGhpcy5vdXRlckRpdi5xdWVyeVNlbGVjdG9yKFwiLmhwYXJzb25zLWRyYWctdGlwXCIpLnRleHRDb250ZW50ID0gdChcbiAgICAgICAgICAgICAgICBcIm1zZ19ocGFyc29uc19kcmFnX2Jsb2Nrc19hbnN3ZXJcIixcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB0aGlzLm91dGVyRGl2LnF1ZXJ5U2VsZWN0b3IoXCIuaHBhcnNvbnMtZHJvcC10aXBcIikudGV4dENvbnRlbnQgPSB0KFxuICAgICAgICAgICAgICAgIFwibXNnX2hwYXJzb25zX2Ryb3BfYmxvY2tzX2Fuc3dlclwiLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNyZWF0ZU91dHB1dCgpIHtcbiAgICAgICAgdGhpcy5mZWVkYmFja0NvbnRyb2xsZXIuY3JlYXRlT3V0cHV0KCk7XG4gICAgfVxuXG4gICAgY3JlYXRlQ29udHJvbHMoKSB7XG4gICAgICAgIHZhciBjdHJsRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgY3RybERpdi5jbGFzc0xpc3QuYWRkKFwiaHBfYWN0aW9uc1wiKTtcblxuICAgICAgICAvLyBSdW4gQnV0dG9uXG4gICAgICAgIHRoaXMucnVuQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICAgICAgdGhpcy5ydW5CdXR0b24uY2xhc3NMaXN0LmFkZChcImJ0blwiLCBcImJ0bi1zdWNjZXNzXCIsIFwicnVuLWJ1dHRvblwiKTtcbiAgICAgICAgY3RybERpdi5hcHBlbmRDaGlsZCh0aGlzLnJ1bkJ1dHRvbik7XG4gICAgICAgIHRoaXMucnVuQnV0dG9uLnNldEF0dHJpYnV0ZShcInR5cGVcIiwgXCJidXR0b25cIik7XG4gICAgICAgIHRoaXMucnVuQnV0dG9uLnRleHRDb250ZW50ID0gdChcIm1zZ19ocGFyc29uc19ydW5cIik7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgdGhpcy5ydW5CdXR0b24ub25jbGljayA9ICgpID0+IHtcbiAgICAgICAgICAgIHRoYXQuZmVlZGJhY2tDb250cm9sbGVyLnJ1bkJ1dHRvbkhhbmRsZXIoKTtcbiAgICAgICAgICAgIHRoYXQuc2V0TG9jYWxTdG9yYWdlKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gUmVzZXQgYnV0dG9uXG4gICAgICAgIHZhciByZXNldEJ0bjtcbiAgICAgICAgcmVzZXRCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgICAgICByZXNldEJ0bi50ZXh0Q29udGVudCA9IHQoXCJtc2dfcGFyc29uX3Jlc2V0XCIpO1xuICAgICAgICByZXNldEJ0bi5jbGFzc0xpc3QuYWRkKFwiYnRuXCIsIFwiYnRuLXdhcm5pbmdcIiwgXCJydW4tYnV0dG9uXCIpO1xuICAgICAgICBjdHJsRGl2LmFwcGVuZENoaWxkKHJlc2V0QnRuKTtcbiAgICAgICAgdGhpcy5yZXNldEJ1dHRvbiA9IHJlc2V0QnRuO1xuICAgICAgICB0aGlzLnJlc2V0QnV0dG9uLm9uY2xpY2sgPSAoKSA9PiB7XG4gICAgICAgICAgICB0aGF0LmhwYXJzb25zSW5wdXQucmVzZXRJbnB1dCgpO1xuICAgICAgICAgICAgdGhhdC5zZXRMb2NhbFN0b3JhZ2UoKTtcbiAgICAgICAgICAgIHRoYXQuZmVlZGJhY2tDb250cm9sbGVyLnJlc2V0KCk7XG4gICAgICAgICAgICB0aGF0LnJlbmRlck1hdGhJbkJsb2NrcygpO1xuICAgICAgICB9O1xuICAgICAgICByZXNldEJ0bi5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwiYnV0dG9uXCIpO1xuXG4gICAgICAgIHRoaXMub3V0ZXJEaXYuYXBwZW5kQ2hpbGQoY3RybERpdik7XG4gICAgICAgIHRoaXMuY29udHJvbERpdiA9IGN0cmxEaXY7XG4gICAgfVxuXG4gICAgLy8gRGVjb2RlcyBlc2NhcGVkIEhUTUwgZW50aXRpZXMgKGxpa2UgJmx0OykgaW50byByYXcgY2hhcmFjdGVyc1xuICAgIGRlY29kZUhUTUxFbnRpdGllcyhzdHIpIHtcbiAgICAgICAgY29uc3QgdGV4dGFyZWEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGV4dGFyZWFcIik7XG4gICAgICAgIHRleHRhcmVhLmlubmVySFRNTCA9IHN0cjtcbiAgICAgICAgcmV0dXJuIHRleHRhcmVhLnZhbHVlO1xuICAgIH1cblxuICAgIG9ic2VydmVNYXRoSmF4VGFiU3RvcHMoKSB7XG4gICAgICAgIGlmICh0aGlzLm1hdGhUYWJTdG9wT2JzZXJ2ZXIgfHwgdHlwZW9mIE11dGF0aW9uT2JzZXJ2ZXIgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm1hdGhUYWJTdG9wT2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigobXV0YXRpb25zKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBuZWVkc0NsZWFudXAgPSBtdXRhdGlvbnMuc29tZShcbiAgICAgICAgICAgICAgICAobXV0YXRpb24pID0+XG4gICAgICAgICAgICAgICAgICAgIG11dGF0aW9uLnR5cGUgPT09IFwiY2hpbGRMaXN0XCIgfHxcbiAgICAgICAgICAgICAgICAgICAgbXV0YXRpb24udGFyZ2V0LmdldEF0dHJpYnV0ZShcInRhYmluZGV4XCIpICE9PSBcIi0xXCIsXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgaWYgKG5lZWRzQ2xlYW51cCkge1xuICAgICAgICAgICAgICAgIGRpc2FibGVNYXRoSmF4VGFiU3RvcHModGhpcy5ocGFyc29uc0lucHV0LCBbXG4gICAgICAgICAgICAgICAgICAgIFwiLnBhcnNvbnMtYmxvY2tcIixcbiAgICAgICAgICAgICAgICBdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMubWF0aFRhYlN0b3BPYnNlcnZlci5vYnNlcnZlKHRoaXMuaHBhcnNvbnNJbnB1dCwge1xuICAgICAgICAgICAgc3VidHJlZTogdHJ1ZSxcbiAgICAgICAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcbiAgICAgICAgICAgIGF0dHJpYnV0ZXM6IHRydWUsXG4gICAgICAgICAgICBhdHRyaWJ1dGVGaWx0ZXI6IFtcInRhYmluZGV4XCJdLFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICByZW5kZXJNYXRoSW5CbG9ja3MoKSB7XG4gICAgICAgIGlmICh0aGlzLmxhbmd1YWdlICE9PSBcIm1hdGhcIikgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICB0aGlzLm9ic2VydmVNYXRoSmF4VGFiU3RvcHMoKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGJsb2NrcyA9IHRoaXMuaHBhcnNvbnNJbnB1dC5xdWVyeVNlbGVjdG9yQWxsKFxuICAgICAgICAgICAgICAgIFwiLnBhcnNvbnMtYmxvY2tcIixcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjb25zdCByZW5kZXJQcm9taXNlcyA9IEFycmF5LmZyb20oYmxvY2tzLCAoYmxvY2spID0+IHtcbiAgICAgICAgICAgICAgICAvLyBEZWNvZGluZyB0d2ljZSB3b3VsZCB0dXJuIGFuIGVzY2FwZWQgXCImbHQ7XCIgaW50byBtYXJrdXAuXG4gICAgICAgICAgICAgICAgaWYgKCFibG9jay5kYXRhc2V0Lm1hdGhQcmVwYXJlZCkge1xuICAgICAgICAgICAgICAgICAgICBibG9jay5kYXRhc2V0Lm1hdGhQcmVwYXJlZCA9IFwidHJ1ZVwiO1xuICAgICAgICAgICAgICAgICAgICBibG9jay5pbm5lckhUTUwgPSB0aGlzLmRlY29kZUhUTUxFbnRpdGllcyhibG9jay5pbm5lckhUTUwpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYmxvY2suaW5uZXJIVE1MLmluZGV4T2YoXCJwcm9jZXNzLW1hdGhcIikgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBibG9jay5pbm5lckhUTUwgPSBibG9jay5pbm5lckhUTUwucmVwbGFjZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPHNwYW4gY2xhc3M9XCJwcm9jZXNzLW1hdGhcIj58PFxcL3NwYW4+L2csXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucXVldWVNYXRoSmF4KGJsb2NrKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKHJlbmRlclByb21pc2VzKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICBkaXNhYmxlTWF0aEpheFRhYlN0b3BzKHRoaXMuaHBhcnNvbnNJbnB1dCwgW1wiLnBhcnNvbnMtYmxvY2tcIl0pO1xuICAgICAgICAgICAgICAgIHRoaXMuaHBhcnNvbnNJbnB1dC5yZWZyZXNoQmxvY2tBcmlhKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlcnJvcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gcHJldmlvdXMgYW5zd2VycyBpbiBsb2NhbCBzdG9yYWdlXG4gICAgLy9cbiAgICBsb2NhbERhdGEoKSB7XG4gICAgICAgIHZhciBkYXRhID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5zdG9yYWdlSWQpO1xuICAgICAgICBpZiAoZGF0YSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKGRhdGEuY2hhckF0KDApID09IFwie1wiKSB7XG4gICAgICAgICAgICAgICAgZGF0YSA9IEpTT04ucGFyc2UoZGF0YSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRhdGEgPSB7fTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRhdGEgPSB7fTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG4gICAgLy8gUnVuZXN0b25lQmFzZTogU2VudCB3aGVuIHRoZSBzZXJ2ZXIgaGFzIGRhdGFcbiAgICByZXN0b3JlQW5zd2VycyhzZXJ2ZXJEYXRhKSB7XG4gICAgICAgIC8vIFRPRE86IG5vdCB0ZXN0ZWQgd2l0aCBzZXJ2ZXIgZGF0YSB5ZXQuXG4gICAgICAgIC8vIFNlcnZlciBzaWRlIGRhdGEgc2hvdWxkIGJlOlxuICAgICAgICAvKlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGFuc3dlcjogQXJyYXk8c3RyaW5nPiwgLy8gbGlzdCBvZiBhbnN3ZXIgYmxvY2sgY29udGVudFxuICAgICAgICAgICAgICAgIGNvdW50OiA/bnVtYmVyIC8vIG51bWJlciBvZiBwcmV2aW91cyBhdHRlbXB0cyBpZiBibG9jay1iYXNlZCBmZWVkYmFja1xuICAgICAgICAgICAgfVxuICAgICAgICAqL1xuICAgICAgICBpZiAoc2VydmVyRGF0YS5hbnN3ZXIpIHtcbiAgICAgICAgICAgIGNvbnN0IGJsb2NrcyA9IHNlcnZlckRhdGEuYW5zd2VyLmJsb2NrcyA/PyBzZXJ2ZXJEYXRhLmFuc3dlcjtcblxuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoYmxvY2tzKSAmJiBibG9ja3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGZpcnN0ID0gYmxvY2tzWzBdO1xuXG4gICAgICAgICAgICAgICAgLy8gUHJlZmVyIGluZGljZXMgKG51bWJlcnMgb3IgbnVtZXJpYyBzdHJpbmdzKVxuICAgICAgICAgICAgICAgIGNvbnN0IGxvb2tzTnVtZXJpYyA9XG4gICAgICAgICAgICAgICAgICAgIHR5cGVvZiBmaXJzdCA9PT0gXCJudW1iZXJcIiB8fCAvXlxcZCskLy50ZXN0KFN0cmluZyhmaXJzdCkpO1xuICAgICAgICAgICAgICAgIGlmIChsb29rc051bWVyaWMgJiYgdGhpcy5ocGFyc29uc0lucHV0LnJlc3RvcmVBbnN3ZXJCeUluZGljZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ocGFyc29uc0lucHV0LnJlc3RvcmVBbnN3ZXJCeUluZGljZXMoXG4gICAgICAgICAgICAgICAgICAgICAgICBibG9ja3MubWFwKE51bWJlciksXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ocGFyc29uc0lucHV0LnJlc3RvcmVBbnN3ZXIoYmxvY2tzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNlcnZlckRhdGEuY291bnQpIHtcbiAgICAgICAgICAgIHRoaXMuZmVlZGJhY2tDb250cm9sbGVyLmNoZWNrQ291bnQgPSBzZXJ2ZXJEYXRhLmNvdW50O1xuICAgICAgICB9XG4gICAgICAgIC8vIFJlc3RvcmluZyByZWJ1aWxkcyBldmVyeSBibG9jayBmcm9tIGl0cyBzb3VyY2UsIG1hdGggbWFya3VwIGFuZCBhbGwuXG4gICAgICAgIHRoaXMucmVuZGVyTWF0aEluQmxvY2tzKCk7XG4gICAgfVxuXG4gICAgLy8gUnVuZXN0b25lQmFzZTogTG9hZCB3aGF0IGlzIGluIGxvY2FsIHN0b3JhZ2VcbiAgICBjaGVja0xvY2FsU3RvcmFnZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuZ3JhZGVyYWN0aXZlKSB7XG4gICAgICAgICAgICAvLyBaaWhhbjogSSB0aGluayB0aGlzIG1lYW5zIHRoZSBjb21wb25lbnQgaXMgc3RpbGwgbG9hZGluZz9cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgbG9jYWxEYXRhID0gdGhpcy5sb2NhbERhdGEoKTtcbiAgICAgICAgLy8gR3VhcmQgYWdhaW5zdCBubyB0aW1lc3RhbXAgYXMgaXQgd2FzIG9ubHkgYWRkZWQgMy8yNC8yMDI2XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIGxvY2FsRGF0YS50aW1lc3RhbXAgJiZcbiAgICAgICAgICAgIGxvY2FsRGF0YS50aW1lc3RhbXAgPCBlQm9va0NvbmZpZy50ZXJtU3RhcnREYXRlXG4gICAgICAgICkge1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0odGhpcy5zdG9yYWdlSWQpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIGxvY2FsRGF0YS5hbnN3ZXJJbmRpY2VzICYmXG4gICAgICAgICAgICB0aGlzLmhwYXJzb25zSW5wdXQucmVzdG9yZUFuc3dlckJ5SW5kaWNlc1xuICAgICAgICApIHtcbiAgICAgICAgICAgIHRoaXMuaHBhcnNvbnNJbnB1dC5yZXN0b3JlQW5zd2VyQnlJbmRpY2VzKFxuICAgICAgICAgICAgICAgIGxvY2FsRGF0YS5hbnN3ZXJJbmRpY2VzLm1hcChOdW1iZXIpLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIGlmIChsb2NhbERhdGEuYW5zd2VyKSB7XG4gICAgICAgICAgICAvLyBMZWdhY3kgcmVzdG9yZSAoc3RyaW5nLWJhc2VkKVxuICAgICAgICAgICAgdGhpcy5ocGFyc29uc0lucHV0LnJlc3RvcmVBbnN3ZXIobG9jYWxEYXRhLmFuc3dlcik7XG5cbiAgICAgICAgICAgIC8vIEJlc3QtZWZmb3J0IG1pZ3JhdGlvbjogcGVyc2lzdCBpbmRpY2VzIGFmdGVyIHJlc3RvcmluZ1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNCbG9ja0dyYWRpbmcpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBtaWdyYXRlZCA9IHRoaXMuaHBhcnNvbnNJbnB1dC5nZXRCbG9ja0luZGljZXMoKTtcbiAgICAgICAgICAgICAgICBsb2NhbERhdGEuYW5zd2VySW5kaWNlcyA9IG1pZ3JhdGVkO1xuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMuc3RvcmFnZUlkLCBKU09OLnN0cmluZ2lmeShsb2NhbERhdGEpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobG9jYWxEYXRhLmNvdW50KSB7XG4gICAgICAgICAgICB0aGlzLmZlZWRiYWNrQ29udHJvbGxlci5jaGVja0NvdW50ID0gbG9jYWxEYXRhLmNvdW50O1xuICAgICAgICB9XG4gICAgICAgIC8vIFJlc3RvcmluZyByZWJ1aWxkcyBldmVyeSBibG9jayBmcm9tIGl0cyBzb3VyY2UsIG1hdGggbWFya3VwIGFuZCBhbGwuXG4gICAgICAgIHRoaXMucmVuZGVyTWF0aEluQmxvY2tzKCk7XG4gICAgfVxuICAgIC8vIFJ1bmVzdG9uZUJhc2U6IFNldCB0aGUgc3RhdGUgb2YgdGhlIHByb2JsZW0gaW4gbG9jYWwgc3RvcmFnZVxuICAgIHNldExvY2FsU3RvcmFnZShkYXRhKSB7XG4gICAgICAgIGxldCBjdXJyZW50U3RhdGUgPSB7fTtcbiAgICAgICAgaWYgKGRhdGEgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pc0Jsb2NrR3JhZGluZykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGFuc3dlckluZGljZXMgPSB0aGlzLmhwYXJzb25zSW5wdXQuZ2V0QmxvY2tJbmRpY2VzKCk7XG4gICAgICAgICAgICAgICAgY3VycmVudFN0YXRlID0geyBhbnN3ZXJJbmRpY2VzOiBhbnN3ZXJJbmRpY2VzIH07XG4gICAgICAgICAgICAgICAgY3VycmVudFN0YXRlLmNvdW50ID0gdGhpcy5mZWVkYmFja0NvbnRyb2xsZXIuY2hlY2tDb3VudDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdXNlckFuc3dlciA9IHRoaXMuaHBhcnNvbnNJbnB1dC5nZXRQYXJzb25zVGV4dEFycmF5KCk7XG4gICAgICAgICAgICAgICAgY3VycmVudFN0YXRlID0geyBhbnN3ZXI6IHVzZXJBbnN3ZXIgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGN1cnJlbnRTdGF0ZS50aW1lc3RhbXAgPSBuZXcgRGF0ZSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY3VycmVudFN0YXRlID0gZGF0YTtcbiAgICAgICAgfVxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0aGlzLnN0b3JhZ2VJZCwgSlNPTi5zdHJpbmdpZnkoY3VycmVudFN0YXRlKSk7XG4gICAgfVxuXG4gICAgbG9nSG9yaXpvbnRhbFBhcnNvbnNFdmVudChocGFyc29uc0V2ZW50KSB7XG4gICAgICAgIGxldCBldiA9IHtcbiAgICAgICAgICAgIGV2ZW50OiBcImhwYXJzb25zXCIsXG4gICAgICAgICAgICBkaXZfaWQ6IHRoaXMuZGl2aWQsXG4gICAgICAgICAgICBhY3Q6IEpTT04uc3RyaW5naWZ5KGhwYXJzb25zRXZlbnQpLFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmxvZ0Jvb2tFdmVudChldik7XG4gICAgfVxufVxuXG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT0gRmluZCB0aGUgY3VzdG9tIEhUTUwgdGFncyBhbmQgPT1cbj09ICAgZXhlY3V0ZSBvdXIgY29kZSBvbiB0aGVtICAgID09XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInJ1bmVzdG9uZTpsb2dpbi1jb21wbGV0ZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgZG9jdW1lbnRcbiAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoXCJbZGF0YS1jb21wb25lbnQ9aHBhcnNvbnNdXCIpXG4gICAgICAgIC5mb3JFYWNoKGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgICAgaWYgKCFlbC5jbG9zZXN0KFwiW2RhdGEtY29tcG9uZW50PXRpbWVkQXNzZXNzbWVudF1cIikpIHtcbiAgICAgICAgICAgICAgICAvLyBJZiB0aGlzIGVsZW1lbnQgZXhpc3RzIHdpdGhpbiBhIHRpbWVkIGNvbXBvbmVudCwgZG9uJ3QgcmVuZGVyIGl0IGhlcmVcbiAgICAgICAgICAgICAgICAvLyB0cnkge1xuICAgICAgICAgICAgICAgIGhwTGlzdFtlbC5pZF0gPSBuZXcgSFBhcnNvbnMoe1xuICAgICAgICAgICAgICAgICAgICBvcmlnOiBlbCxcbiAgICAgICAgICAgICAgICAgICAgdXNlUnVuZXN0b25lU2VydmljZXM6IGVCb29rQ29uZmlnLnVzZVJ1bmVzdG9uZVNlcnZpY2VzLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIC8vIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIC8vICAgICBjb25zb2xlLmxvZyhgRXJyb3IgcmVuZGVyaW5nIFNob3J0QW5zd2VyIFByb2JsZW0gJHt0aGlzLmlkfVxuICAgICAgICAgICAgICAgIC8vICAgICBEZXRhaWxzOiAke2Vycn1gKTtcbiAgICAgICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xufSk7XG5cbmlmICh0eXBlb2Ygd2luZG93LmNvbXBvbmVudF9mYWN0b3J5ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgd2luZG93LmNvbXBvbmVudF9mYWN0b3J5ID0ge307XG59XG53aW5kb3cuY29tcG9uZW50X2ZhY3RvcnlbXCJocGFyc29uc1wiXSA9IGZ1bmN0aW9uIChvcHRzKSB7XG4gICAgcmV0dXJuIG5ldyBIUGFyc29ucyhvcHRzKTtcbn07XG4iLCIvLyBUaGlzIGZpbGUgaXMgYWRhcHRlZCBmcm9tIGxpbmVHcmFkZXIgaW4gcGFyc29ucyBkaXJlY3RpdmUuXG4vLyBXZSBjb3VsZCBoYXZlIGZpdCBvdXIgZGF0YSBzdHJ1Y3R1cmUgdG8gdXNlIHRoZSBvcmlnaW5hbCBMaW5lQmFzZWRHcmFkZXIgZGlyZWN0bHksXG4vLyBidXQgdGhhdCB3b3VsZCByZXN1bHQgaW4gY2hhbmdlcyBpbiBwYXJzb25zIGRpcmVjdGl2ZSBhZmZlY3RpbmcgdGhpcywgc28gd2UgY3JlYXRlZCBhIGNvcHlcbi8vIGluc3RlYWQuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJsb2NrQmFzZWRHcmFkZXIge1xuICAgIGNvbnN0cnVjdG9yKHByb2JsZW0pIHtcbiAgICAgICAgdGhpcy5wcm9ibGVtID0gcHJvYmxlbTtcbiAgICAgICAgdGhpcy5wZXJjZW50ID0gMDtcbiAgICB9XG4gICAgLy8gVXNlIGEgTElTIChMb25nZXN0IEluY3JlYXNpbmcgU3Vic2VxdWVuY2UpIGFsZ29yaXRobSB0byByZXR1cm4gdGhlIGluZGV4ZXNcbiAgICAvLyB0aGF0IGFyZSBub3QgcGFydCBvZiB0aGF0IHN1YnNlcXVlbmNlLlxuICAgIGludmVyc2VMSVNJbmRpY2VzKGFycikge1xuICAgICAgICAvLyBHZXQgYWxsIHN1YnNlcXVlbmNlc1xuICAgICAgICB2YXIgYWxsU3Vic2VxdWVuY2VzID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgc3Vic2VxdWVuY2VGb3JDdXJyZW50ID0gW2FycltpXV07XG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGk7IGorKykge1xuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgYXJyW2pdIDwgYXJyW2ldICYmXG4gICAgICAgICAgICAgICAgICAgIGFsbFN1YnNlcXVlbmNlc1tqXS5sZW5ndGggKyAxID4gc3Vic2VxdWVuY2VGb3JDdXJyZW50Lmxlbmd0aFxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICBzdWJzZXF1ZW5jZUZvckN1cnJlbnQgPSBhbGxTdWJzZXF1ZW5jZXNbal0uY29uY2F0KGFycltpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYWxsU3Vic2VxdWVuY2VzLnB1c2goc3Vic2VxdWVuY2VGb3JDdXJyZW50KTtcbiAgICAgICAgfVxuICAgICAgICAvLyBGaWd1cmUgb3V0IHRoZSBsb25nZXN0IG9uZVxuICAgICAgICB2YXIgbG9uZ2VzdFN1YnNlcXVlbmNlTGVuZ3RoID0gLTE7XG4gICAgICAgIHZhciBsb25nZXN0U3Vic2VxdWVuY2U7XG4gICAgICAgIGZvciAobGV0IGkgaW4gYWxsU3Vic2VxdWVuY2VzKSB7XG4gICAgICAgICAgICB2YXIgc3VicyA9IGFsbFN1YnNlcXVlbmNlc1tpXTtcbiAgICAgICAgICAgIGlmIChzdWJzLmxlbmd0aCA+IGxvbmdlc3RTdWJzZXF1ZW5jZUxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGxvbmdlc3RTdWJzZXF1ZW5jZUxlbmd0aCA9IHN1YnMubGVuZ3RoO1xuICAgICAgICAgICAgICAgIGxvbmdlc3RTdWJzZXF1ZW5jZSA9IHN1YnM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBpbnZlcnNlIGluZGV4ZXNcbiAgICAgICAgdmFyIGluZGV4ZXMgPSBbXTtcbiAgICAgICAgdmFyIGxJbmRleCA9IDA7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAobEluZGV4ID4gbG9uZ2VzdFN1YnNlcXVlbmNlLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGluZGV4ZXMucHVzaChpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGFycltpXSA9PSBsb25nZXN0U3Vic2VxdWVuY2VbbEluZGV4XSkge1xuICAgICAgICAgICAgICAgICAgICBsSW5kZXggKz0gMTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpbmRleGVzLnB1c2goaSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpbmRleGVzO1xuICAgIH1cbiAgICAvLyBncmFkZSB0aGF0IGVsZW1lbnQsIHJldHVybmluZyB0aGUgc3RhdGVcbiAgICBncmFkZSgpIHtcbiAgICAgICAgdGhpcy5jb3JyZWN0TGluZXMgPSAwO1xuICAgICAgICB0aGlzLnBlcmNlbnRMaW5lcyA9IDA7XG4gICAgICAgIHZhciBzb2x1dGlvbkxpbmVzID0gdGhpcy5zb2x1dGlvbjtcbiAgICAgICAgdmFyIGFuc3dlckxpbmVzID0gdGhpcy5hbnN3ZXI7XG4gICAgICAgIHZhciBpO1xuICAgICAgICB2YXIgc3RhdGU7XG4gICAgICAgIHRoaXMucGVyY2VudExpbmVzID1cbiAgICAgICAgICAgIE1hdGgubWluKGFuc3dlckxpbmVzLmxlbmd0aCwgc29sdXRpb25MaW5lcy5sZW5ndGgpIC9cbiAgICAgICAgICAgIE1hdGgubWF4KGFuc3dlckxpbmVzLmxlbmd0aCwgc29sdXRpb25MaW5lcy5sZW5ndGgpO1xuICAgICAgICBpZiAoYW5zd2VyTGluZXMubGVuZ3RoIDwgc29sdXRpb25MaW5lcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHN0YXRlID0gXCJpbmNvcnJlY3RUb29TaG9ydFwiO1xuICAgICAgICAgICAgdGhpcy5jb3JyZWN0TGVuZ3RoID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSBpZiAoYW5zd2VyTGluZXMubGVuZ3RoID09IHNvbHV0aW9uTGluZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLmNvcnJlY3RMZW5ndGggPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jb3JyZWN0TGVuZ3RoID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBEZXRlcm1pbmUgd2hldGhlciB0aGUgY29kZSAqKnRoYXQgaXMgdGhlcmUqKiBpcyBpbiB0aGUgY29ycmVjdCBvcmRlclxuICAgICAgICAvLyBJZiB0aGVyZSBpcyB0b28gbXVjaCBvciB0b28gbGl0dGxlIGNvZGUgdGhpcyBvbmx5IG1hdHRlcnMgZm9yXG4gICAgICAgIC8vIGNhbGN1bGF0aW5nIGEgcGVyY2VudGFnZSBzY29yZS5cbiAgICAgICAgbGV0IGlzQ29ycmVjdE9yZGVyID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5jb3JyZWN0TGluZXMgPSAwO1xuICAgICAgICB0aGlzLnNvbHV0aW9uTGVuZ3RoID0gc29sdXRpb25MaW5lcy5sZW5ndGg7XG4gICAgICAgIGxldCBsb29wTGltaXQgPSBNYXRoLm1pbihzb2x1dGlvbkxpbmVzLmxlbmd0aCwgYW5zd2VyTGluZXMubGVuZ3RoKTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGxvb3BMaW1pdDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoYW5zd2VyTGluZXNbaV0gIT09IHNvbHV0aW9uTGluZXNbaV0pIHtcbiAgICAgICAgICAgICAgICBpc0NvcnJlY3RPcmRlciA9IGZhbHNlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvcnJlY3RMaW5lcyArPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzQ29ycmVjdE9yZGVyICYmIHRoaXMuY29ycmVjdExlbmd0aCkge1xuICAgICAgICAgICAgLy8gUGVyZmVjdFxuICAgICAgICAgICAgc3RhdGUgPSBcImNvcnJlY3RcIjtcbiAgICAgICAgfSBlbHNlIGlmICghaXNDb3JyZWN0T3JkZXIgJiYgc3RhdGUgIT0gXCJpbmNvcnJlY3RUb29TaG9ydFwiKSB7XG4gICAgICAgICAgICBzdGF0ZSA9IFwiaW5jb3JyZWN0TW92ZUJsb2Nrc1wiO1xuICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLmNvcnJlY3RMZW5ndGggJiYgc3RhdGUgIT0gXCJpbmNvcnJlY3RUb29TaG9ydFwiKSB7XG4gICAgICAgICAgICBzdGF0ZSA9IFwiaW5jb3JyZWN0TW92ZUJsb2Nrc1wiO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2FsY3VsYXRlUGVyY2VudCgpO1xuICAgICAgICB0aGlzLmdyYWRlclN0YXRlID0gc3RhdGU7XG4gICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICB9XG5cbiAgICBjYWxjdWxhdGVQZXJjZW50KCkge1xuICAgICAgICBsZXQgbnVtTGluZXMgPSB0aGlzLnBlcmNlbnRMaW5lcyAqIDAuMjtcbiAgICAgICAgbGV0IGxpbmVzID0gdGhpcy5hbnN3ZXIubGVuZ3RoO1xuICAgICAgICBsZXQgbnVtQ29ycmVjdEJsb2NrcyA9ICh0aGlzLmNvcnJlY3RMaW5lcyAvIGxpbmVzKSAqIDAuODtcblxuICAgICAgICB0aGlzLnBlcmNlbnQgPSBudW1MaW5lcyArIG51bUNvcnJlY3RCbG9ja3M7XG4gICAgfVxufVxuIiwiLy8gQSByZWFkLW9ubHkgdGFibGUgb2YgU1FMIHF1ZXJ5IHJlc3VsdHMsIHNoYXJlZCBieSBhY3RpdmVjb2RlIGFuZCBocGFyc29ucy5cbi8vXG4vLyBgYHRhYmxlRGF0YWBgIGlzIGEgcmVzdWx0IGZyb20gc3FsLmpzOiBgYGNvbHVtbnNgYCBpcyB0aGUgbGlzdCBvZiBjb2x1bW5cbi8vIG5hbWVzIGFuZCBgYHZhbHVlc2BgIHRoZSBsaXN0IG9mIHJvd3MuIEF0IG1vc3QgYGBNQVhfUk9XU2BgIHJvd3MgYXJlIHNob3duO1xuLy8gdGhlIGNhbGxlcnMgYWxyZWFkeSB0ZWxsIHRoZSByZWFkZXIgd2hlbiB0aGUgcmVzdWx0IHdhcyBjdXQgc2hvcnQuIFRoZSB0YWJsZVxuLy8gc2Nyb2xscyBpbnNpZGUgYSBib3ggbm8gdGFsbGVyIHRoYW4gYGBtYXhIZWlnaHRgYCBwaXhlbHMsIHdpdGggdGhlIGhlYWRlciByb3dcbi8vIGtlcHQgaW4gdmlldy5cblxuY29uc3QgTUFYX1JPV1MgPSAxMDA7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVSZXN1bHRUYWJsZSh0YWJsZURhdGEsIGNvbnRhaW5lciwgbWF4SGVpZ2h0LCBjYXB0aW9uKSB7XG4gICAgY29uc3Qgd3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgd3JhcHBlci5jbGFzc05hbWUgPSBcInNxbF9yZXN1bHRfdGFibGVcIjtcbiAgICB3cmFwcGVyLnN0eWxlLm1heEhlaWdodCA9IGAke21heEhlaWdodH1weGA7XG4gICAgLy8gQSBzY3JvbGxhYmxlIHJlZ2lvbiBtdXN0IGJlIHJlYWNoYWJsZSBieSBrZXlib2FyZCB0byBiZSBzY3JvbGxlZC5cbiAgICB3cmFwcGVyLnRhYkluZGV4ID0gMDtcblxuICAgIGNvbnN0IHRhYmxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRhYmxlXCIpO1xuICAgIGlmIChjYXB0aW9uKSB7XG4gICAgICAgIGNvbnN0IGNhcCA9IHRhYmxlLmNyZWF0ZUNhcHRpb24oKTtcbiAgICAgICAgY2FwLmNsYXNzTmFtZSA9IFwidmlzdWFsbHloaWRkZW5cIjtcbiAgICAgICAgY2FwLnRleHRDb250ZW50ID0gY2FwdGlvbjtcbiAgICAgICAgd3JhcHBlci5zZXRBdHRyaWJ1dGUoXCJhcmlhLWxhYmVsXCIsIGNhcHRpb24pO1xuICAgIH1cblxuICAgIGNvbnN0IGhlYWRSb3cgPSB0YWJsZS5jcmVhdGVUSGVhZCgpLmluc2VydFJvdygpO1xuICAgIGZvciAoY29uc3QgbmFtZSBvZiB0YWJsZURhdGEuY29sdW1ucykge1xuICAgICAgICBjb25zdCB0aCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiKTtcbiAgICAgICAgdGguc2NvcGUgPSBcImNvbFwiO1xuICAgICAgICB0aC50ZXh0Q29udGVudCA9IG5hbWU7XG4gICAgICAgIGhlYWRSb3cuYXBwZW5kQ2hpbGQodGgpO1xuICAgIH1cblxuICAgIGNvbnN0IGJvZHkgPSB0YWJsZS5jcmVhdGVUQm9keSgpO1xuICAgIGZvciAoY29uc3QgdmFsdWVzIG9mIHRhYmxlRGF0YS52YWx1ZXMuc2xpY2UoMCwgTUFYX1JPV1MpKSB7XG4gICAgICAgIGNvbnN0IHJvdyA9IGJvZHkuaW5zZXJ0Um93KCk7XG4gICAgICAgIGZvciAoY29uc3QgdmFsdWUgb2YgdmFsdWVzKSB7XG4gICAgICAgICAgICAvLyBzcWwuanMgZ2l2ZXMgTlVMTCBhcyBudWxsOyBzaG93IGl0IGFzIGFuIGVtcHR5IGNlbGwuXG4gICAgICAgICAgICByb3cuaW5zZXJ0Q2VsbCgpLnRleHRDb250ZW50ID0gdmFsdWUgPT09IG51bGwgPyBcIlwiIDogU3RyaW5nKHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQodGFibGUpO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh3cmFwcGVyKTtcbiAgICByZXR1cm4gdGFibGU7XG59XG4iLCJpbXBvcnQgeyBsb2FkIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9qcy9yc2kxOG4uanNcIjtcblxubG9hZCh7XG4gICAgZW46IHtcbiAgICAgICAgbXNnX2hwYXJzb25zX2RyYWdfYmxvY2tzX2NvZGU6XG4gICAgICAgICAgICBcIkRyYWcgb3IgY2xpY2sgdGhlIGJsb2NrcyBiZWxvdyB0byBmb3JtIHlvdXIgY29kZTpcIixcbiAgICAgICAgbXNnX2hwYXJzb25zX2RyYWdfYmxvY2tzX2Fuc3dlcjpcbiAgICAgICAgICAgIFwiRHJhZyBvciBjbGljayB0aGUgYmxvY2tzIGJlbG93IHRvIGZvcm0geW91ciBhbnN3ZXI6XCIsXG4gICAgICAgIG1zZ19ocGFyc29uc19kcm9wX2Jsb2Nrc19jb2RlOlxuICAgICAgICAgICAgXCJZb3VyIGNvZGUgKGNsaWNrIG9uIGEgYmxvY2sgdG8gcmVtb3ZlIGl0KTpcIixcbiAgICAgICAgbXNnX2hwYXJzb25zX2Ryb3BfYmxvY2tzX2Fuc3dlcjpcbiAgICAgICAgICAgIFwiWW91ciBhbnN3ZXIgKGNsaWNrIG9uIGEgYmxvY2sgdG8gcmVtb3ZlIGl0KTpcIixcbiAgICAgICAgbXNnX2hwYXJzb25zX2F2YWlsYWJsZV9ibG9ja3M6IFwiQXZhaWxhYmxlIGJsb2Nrc1wiLFxuICAgICAgICBtc2dfaHBhcnNvbnNfYW5zd2VyX2FyZWE6IFwiQW5zd2VyIGFyZWFcIixcbiAgICAgICAgbXNnX2hwYXJzb25zX2tleWJvYXJkX2lkbGVfaW5zdHJ1Y3Rpb25zOlxuICAgICAgICAgICAgXCJQcmVzcyBFbnRlciB0byBtb3ZlIGJsb2NrcyB3aXRoIHRoZSBrZXlib2FyZC5cIixcbiAgICAgICAgbXNnX2hwYXJzb25zX2tleWJvYXJkX2luc3RydWN0aW9uczpcbiAgICAgICAgICAgIFwiVXNlIExlZnQgYW5kIFJpZ2h0IEFycm93IHRvIGNob29zZSBhIGJsb2NrIGluIHRoaXMgYXJlYS4gVXNlIFVwIGFuZCBEb3duIEFycm93IHRvIHN3aXRjaCBiZXR3ZWVuIGF2YWlsYWJsZSBibG9ja3MgYW5kIHRoZSBhbnN3ZXIgYXJlYS4gUHJlc3MgRW50ZXIgdG8gbW92ZSB0aGUgY3VycmVudCBibG9jay4gUHJlc3MgRXNjYXBlIG9yIFRhYiB0byBmaW5pc2guXCIsXG4gICAgICAgIG1zZ19ocGFyc29uc19ibG9ja19tb3ZlZF90b19hbnN3ZXI6IFwiJDEgbW92ZWQgdG8gYW5zd2VyIGFyZWFcIixcbiAgICAgICAgbXNnX2hwYXJzb25zX2Jsb2NrX21vdmVkX3RvX2F2YWlsYWJsZTogXCIkMSBtb3ZlZCB0byBhdmFpbGFibGUgYmxvY2tzXCIsXG4gICAgICAgIG1zZ19ocGFyc29uc19tb3Zpbmc6IFwiTW92aW5nICQxXCIsXG4gICAgICAgIG1zZ19ocGFyc29uc19rZXlib2FyZF9maW5pc2hlZDogXCJLZXlib2FyZCBibG9jayBtb3ZlbWVudCBmaW5pc2hlZC5cIixcbiAgICAgICAgbXNnX2hwYXJzb25zX2NoZWNrX21lOiBcIkNoZWNrIE1lXCIsXG4gICAgICAgIG1zZ19ocGFyc29uc19ibG9ja3NfcmVzZXQ6IFwiQmxvY2tzIHJlc2V0LlwiLFxuICAgICAgICBtc2dfaHBhcnNvbnNfcnVuOiBcIlJ1blwiLFxuICAgICAgICBtc2dfaHBhcnNvbnNfcXVlcnlfcmVzdWx0czogXCJRdWVyeSByZXN1bHRzXCIsXG4gICAgfSxcbn0pO1xuIiwiLyogKGlnbm9yZWQpICovIiwiLy8gVGhpcyBmaWxlIGNvbnRhaW5zIHRoZSBldmVudCBkZWZpbml0aW9uIGZvciBtaWNybyBQYXJzb25zIHByb2JsZW1zLlxuZXhwb3J0IG5hbWVzcGFjZSBNaWNyb1BhcnNvbnNFdmVudCB7XG4gIGV4cG9ydCBlbnVtIElucHV0QWN0aW9uIHtcbiAgICBBREQgPSBcImFkZFwiLFxuICAgIE1PVkUgPSBcIm1vdmVcIixcbiAgICBSRU1PVkUgPSBcInJlbW92ZVwiLFxuICB9XG5cbiAgZXhwb3J0IHR5cGUgSW5wdXQgPSB7XG4gICAgdHlwZTogXCJpbnB1dFwiO1xuICAgIGFjdGlvbjogSW5wdXRBY3Rpb247XG4gICAgLy8gUG9zaXRpb246IFRoZSBpbmRleCBvZiB0aGUgYmxvY2sgYmVmb3JlIHRoZSBpbnB1dCBhY3Rpb24sIGFuZCBpbmRleCBvZiB0aGUgYmxvY2sgYWZ0ZXIgdGhlIGlucHV0IGFjdGlvbi5cbiAgICAvLyAtMSBpbmRpY2F0ZXMgdGhhdCB0aGUgYmxvY2sgaXMgbm90IGluIHRoZSBhbnN3ZXIuXG4gICAgLy8gZS5nLiBbLTEsIDBdIE1lYW5zIGEgYmxvY2sgaXMgKmFkZGVkKiB0byB0aGUgYW5zd2VyIHRvIHRoZSAqYmVnaW5uaW5nKjtcbiAgICAvLyAgICAgIFsyLCAtMV0gbWVhbnMgYSBibG9jayBhdCBpbmRleCAyIGlzICpyZW1vdmVkKiBmcm9tIHRoZSBhbnN3ZXI7XG4gICAgLy8gICAgICBbMSwgMl0gbWVhbnMgdGhlIG1vdmVkIGJsb2NrIHByZXZpb3VzbHkgaGFkIGFuIGluZGV4IG9mIDEuIEFmdGVyIG1vdmluZyBpdCwgaXRzIGluZGV4IGJlY29tZXMgMi5cbiAgICAvLyAqIE5vdGUxOiBJIHJlY29nbml6ZSBpdCBpcyBub3QgaWRlYWwgdG8gc3RvcmUgaW4gYSBsaXN0LCBidXQgdHVwbGVzIGFyZSBub3QgZGVmaW5lZCBpbiBKU09OLlxuICAgIC8vICogTm90ZTI6IFRoaXMgaW5wdXQgZXZlbnQgZG9lcyBub3QgY2FwdHVyZSB0aGUgbW92ZW1lbnQgaW4gdGhlIFwic291cmNlXCIgYmxvY2tzLlxuICAgIHBvc2l0aW9uOiBbbnVtYmVyLCBudW1iZXJdO1xuICAgIC8vIFRoZSBmaW5hbCBhbnN3ZXIgKmFmdGVyKiB0aGUgaW5wdXQgYWN0aW9uLlxuICAgIGFuc3dlcjogQXJyYXk8c3RyaW5nPjtcbiAgfTtcblxuICBleHBvcnQgdHlwZSBUb29sdGlwID0ge1xuICAgIHR5cGU6IFwidG9vbHRpcFwiO1xuICAgIGJsb2NrOiBzdHJpbmc7XG4gICAgdG9vbHRpcDogc3RyaW5nO1xuICAgIHNob3c6IGJvb2xlYW47IC8vIHRydWUgaWYgc2hvd2luZyB0aGUgdG9vbHRpcCwgZmFsc2UgaWYgaGlkaW5nXG4gIH07XG5cbiAgZXhwb3J0IHR5cGUgUmVzZXQgPSB7XG4gICAgdHlwZTogXCJyZXNldFwiO1xuICB9O1xuXG4gIGV4cG9ydCB0eXBlIFJlc3RvcmVBbnN3ZXIgPSB7XG4gICAgdHlwZTogXCJyZXN0b3JlXCI7XG4gICAgYW5zd2VyOiBBcnJheTxzdHJpbmc+O1xuICB9O1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgSFBhcnNvbnNGZWVkYmFjayB7XG4gICAgY29uc3RydWN0b3IoaHBhcnNvbnMpIHtcbiAgICAgICAgdGhpcy5ocGFyc29ucyA9IGhwYXJzb25zO1xuICAgICAgICB0aGlzLnBlcmNlbnQgPSAwO1xuICAgIH1cbiAgICBjcmVhdGVPdXRwdXQoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiY3JlYXRlT3V0cHV0IG1ldGhvZCBub3QgaW1wbGVtZW50ZWQgaW4gZmVlZGJhY2shXCIpO1xuICAgIH1cbiAgICBhc3luYyBydW5CdXR0b25IYW5kbGVyKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcInJ1bkJ1dHRvbkNsaWNrZWQgbWV0aG9kIG5vdCBpbXBsZW1lbnRlZCBpbiBmZWVkYmFjayFcIik7XG4gICAgfVxuICAgIGN1c3RvbWl6ZVVJKCkge1xuICAgICAgICAvLyB1c2VkIHRvIGNoYW5nZSBzb21lIG1pbm9yIFVJLCBlLmcuIHRoZSB0ZXh0IG9uIFJ1biBidXR0b25cbiAgICB9XG4gICAgaW5pdCgpIHtcbiAgICAgICAgLy8gaW5pdGxpemF0aW9ucyBmdW5jdGlvbmFsaXRpZXMgc3VjaCBhcyBwcmVwYXJpbmcgU1FMLFxuICAgICAgICAvLyBvciBjaGVja2luZyByZWxhdGVkIG9wdGlvbnNcbiAgICB9XG5cbiAgICBjbGVhckZlZWRiYWNrKCkge1xuICAgICAgICAvLyBjYWxsZWQgd2hlbiBpbnB1dCBpcyBjaGFuZ2VkXG4gICAgICAgIGNvbnNvbGUubG9nKFwiY2xlYXJGZWVkYmFjayBtZXRob2Qgbm90IGltcGxlbWVudGVkIGluIGZlZWRiYWNrIVwiKTtcbiAgICB9XG5cbiAgICByZXNldCgpIHtcbiAgICAgICAgLy8gY2FsbGVkIHdoZW4gcmVzZXQgaXMgY2xpY2tlZFxuICAgICAgICBjb25zb2xlLmxvZyhcInJlc2V0IG1ldGhvZCBub3QgaW1wbGVtZW50ZWQgaW4gZmVlZGJhY2shXCIpO1xuICAgIH1cbn1cbiIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsImltcG9ydCB7IGxvYWQgfSBmcm9tIFwiLi4vLi4vY29tbW9uL2pzL3JzaTE4bi5qc1wiO1xuXG5sb2FkKHtcbiAgICBcInNyLUN5cmxcIjoge1xuICAgICAgICBtc2dfaHBhcnNvbnNfZHJhZ19ibG9ja3NfY29kZTpcbiAgICAgICAgICAgIFwi0J/RgNC10LLRg9GG0LjRgtC1INC40LvQuCDQutC70LjQutC90LjRgtC1INC90LAg0LHQu9C+0LrQvtCy0LUg0LjRgdC/0L7QtCDQtNCwINGB0LDRgdGC0LDQstC40YLQtSDRgdCy0L7RmCDQutC+0LQ6XCIsXG4gICAgICAgIG1zZ19ocGFyc29uc19kcmFnX2Jsb2Nrc19hbnN3ZXI6XG4gICAgICAgICAgICBcItCf0YDQtdCy0YPRhtC40YLQtSDQuNC70Lgg0LrQu9C40LrQvdC40YLQtSDQvdCwINCx0LvQvtC60L7QstC1INC40YHQv9C+0LQg0LTQsCDRgdCw0YHRgtCw0LLQuNGC0LUg0YHQstC+0Zgg0L7QtNCz0L7QstC+0YA6XCIsXG4gICAgICAgIG1zZ19ocGFyc29uc19kcm9wX2Jsb2Nrc19jb2RlOlxuICAgICAgICAgICAgXCLQktCw0Ygg0LrQvtC0ICjQutC70LjQutC90LjRgtC1INC90LAg0LHQu9C+0Log0LTQsCDQs9CwINGD0LrQu9C+0L3QuNGC0LUpOlwiLFxuICAgICAgICBtc2dfaHBhcnNvbnNfZHJvcF9ibG9ja3NfYW5zd2VyOlxuICAgICAgICAgICAgXCLQktCw0Ygg0L7QtNCz0L7QstC+0YAgKNC60LvQuNC60L3QuNGC0LUg0L3QsCDQsdC70L7QuiDQtNCwINCz0LAg0YPQutC70L7QvdC40YLQtSk6XCIsXG4gICAgICAgIG1zZ19ocGFyc29uc19hdmFpbGFibGVfYmxvY2tzOiBcItCU0L7RgdGC0YPQv9C90Lgg0LHQu9C+0LrQvtCy0LhcIixcbiAgICAgICAgbXNnX2hwYXJzb25zX2Fuc3dlcl9hcmVhOiBcItCe0LHQu9Cw0YHRgiDQvtC00LPQvtCy0L7RgNCwXCIsXG4gICAgICAgIG1zZ19ocGFyc29uc19rZXlib2FyZF9pZGxlX2luc3RydWN0aW9uczpcbiAgICAgICAgICAgIFwi0J/RgNC40YLQuNGB0L3QuNGC0LUgRW50ZXIg0LTQsCDQv9C+0LzQtdGA0LDRgtC1INCx0LvQvtC60L7QstC1INGC0LDRgdGC0LDRgtGD0YDQvtC8LlwiLFxuICAgICAgICBtc2dfaHBhcnNvbnNfa2V5Ym9hcmRfaW5zdHJ1Y3Rpb25zOlxuICAgICAgICAgICAgXCLQmtC+0YDQuNGB0YLQuNGC0LUg0YHRgtGA0LXQu9C40YbQtSDQvdCw0LvQtdCy0L4g0Lgg0L3QsNC00LXRgdC90L4g0LTQsCDQuNC30LDQsdC10YDQtdGC0LUg0LHQu9C+0Log0YMg0L7QstC+0Zgg0L7QsdC70LDRgdGC0LguINCa0L7RgNC40YHRgtC40YLQtSDRgdGC0YDQtdC70LjRhtC1INC90LDQs9C+0YDQtSDQuCDQvdCw0LTQvtC70LUg0LTQsCDQv9GA0LXQu9Cw0LfQuNGC0LUg0LjQt9C80LXRktGDINC00L7RgdGC0YPQv9C90LjRhSDQsdC70L7QutC+0LLQsCDQuCDQvtCx0LvQsNGB0YLQuCDQvtC00LPQvtCy0L7RgNCwLiDQn9GA0LjRgtC40YHQvdC40YLQtSBFbnRlciDQtNCwINC/0L7QvNC10YDQuNGC0LUg0LjQt9Cw0LHRgNCw0L3QuCDQsdC70L7Qui4g0J/RgNC40YLQuNGB0L3QuNGC0LUgRXNjYXBlINC40LvQuCBUYWIg0LTQsCDQt9Cw0LLRgNGI0LjRgtC1LlwiLFxuICAgICAgICBtc2dfaHBhcnNvbnNfYmxvY2tfbW92ZWRfdG9fYW5zd2VyOiBcIiQxINGY0LUg0L/RgNC10LzQtdGI0YLQtdC9INGDINC+0LHQu9Cw0YHRgiDQvtC00LPQvtCy0L7RgNCwXCIsXG4gICAgICAgIG1zZ19ocGFyc29uc19ibG9ja19tb3ZlZF90b19hdmFpbGFibGU6IFwiJDEg0ZjQtSDQv9GA0LXQvNC10YjRgtC10L0g0LzQtdGS0YMg0LTQvtGB0YLRg9C/0L3QtSDQsdC70L7QutC+0LLQtVwiLFxuICAgICAgICBtc2dfaHBhcnNvbnNfbW92aW5nOiBcItCf0YDQtdC80LXRiNGC0LDRmtC1OiAkMVwiLFxuICAgICAgICBtc2dfaHBhcnNvbnNfa2V5Ym9hcmRfZmluaXNoZWQ6IFwi0J/RgNC10LzQtdGI0YLQsNGa0LUg0LHQu9C+0LrQvtCy0LAg0YLQsNGB0YLQsNGC0YPRgNC+0Lwg0ZjQtSDQt9Cw0LLRgNGI0LXQvdC+LlwiLFxuICAgICAgICBtc2dfaHBhcnNvbnNfY2hlY2tfbWU6IFwi0J/RgNC+0LLQtdGA0LhcIixcbiAgICAgICAgbXNnX2hwYXJzb25zX2Jsb2Nrc19yZXNldDogXCLQkdC70L7QutC+0LLQuCDRgdGDINGA0LXRgdC10YLQvtCy0LDQvdC4LlwiLFxuICAgICAgICBtc2dfaHBhcnNvbnNfcnVuOiBcItCf0L7QutGA0LXQvdC4XCIsXG4gICAgICAgIG1zZ19ocGFyc29uc19xdWVyeV9yZXN1bHRzOiBcItCg0LXQt9GD0LvRgtCw0YLQuCDRg9C/0LjRgtCwXCIsXG4gICAgfSxcbn0pO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9