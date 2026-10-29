"use strict";
(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_matching_js_matching_js"],{

/***/ 2036:
/*!**********************************************!*\
  !*** ./runestone/matching/css/matching.less ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 11390:
/*!************************************************!*\
  !*** ./runestone/matching/js/xmlconversion.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MatchingXmlConverter: () => (/* binding */ MatchingXmlConverter)
/* harmony export */ });
/* harmony import */ var _common_js_xmlconversion_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/xmlconversion.js */ 8152);


/*
 * Matching expresses its answer key as <edge> elements, each holding two
 * <label> children whose text content are the premise and response ids:
 *
 *   <edge><label>left-1</label><label>right-2</label></edge>
 */
class MatchingXmlConverter extends _common_js_xmlconversion_js__WEBPACK_IMPORTED_MODULE_0__.QuestionXmlConverter {
    correctAnswers() {
        return Array.from(this.doc.querySelectorAll("edge")).map((edgeEl) =>
            // take the first two <label> children as the [premise, response] pair
            Array.from(edgeEl.querySelectorAll("label"))
                .slice(0, 2)
                .map((l) => l.textContent.trim()),
        );
    }
}


/***/ }),

/***/ 17352:
/*!*******************************************!*\
  !*** ./runestone/matching/js/matching.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MatchingProblem: () => (/* binding */ MatchingProblem)
/* harmony export */ });
/* harmony import */ var _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/runestonebase.js */ 78673);
/* harmony import */ var _common_js_mathjax_a11y_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../common/js/mathjax-a11y.js */ 47937);
/* harmony import */ var _css_matching_less__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../css/matching.less */ 2036);
/* harmony import */ var _xmlconversion_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./xmlconversion.js */ 11390);




class MatchingProblem extends _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(opts) {
        super(opts);
        let container = opts.orig;
        this.containerDiv = opts.orig;
        const script = container.querySelector("script");
        if (script) {
            let boxData;
            try {
                // the script is called xml but may also contain some html for the statement.
                if (script.type == "text/xml") {
                    const xml = script.textContent;
                    boxData = new _xmlconversion_js__WEBPACK_IMPORTED_MODULE_3__.MatchingXmlConverter(xml).toJson();
                } else {
                    boxData = JSON.parse(script.textContent);
                }
                this.boxData = boxData;
            } catch (err) {
                console.error("Failed to parse boxData JSON:", err);
            }
        }

        this.divid = container.id;
        this.boxesRenderedPromise = new Promise((resolve) => {
            this.boxesRenderedResolve = resolve;
        });
        this.workspace = this.createWorkspace(container);
        try {
            this.statement = this.createStatement(container);
        } catch (error) {
            console.error("Error setting statement:", error);
        }
        this.connList = this.createConnList(container);
        this.feedbackDiv = this.createFeedbackDiv(container);
        this.ariaLive = this.createAriaLive(container);
        this.controlDiv = this.createControlDiv(container);
        this.createHelpModal();

        this.connections = [];
        this.allBoxes = [];
        this.selectedBox = null;
        this.activeBoxRole = null;
        this.selectedLine = null;
        this.startBox = null;
        this.tempLine = null;
        this.useRunestoneServices = eBookConfig.useRunestoneServices;
        this.graderactive = opts.graderactive || false;
        this.init();
        // ensure that boxes are rendered before checking server
        // if boxes are not rendered then we may have dangling lines
        // that are not connected to any boxes
        this.boxesRenderedPromise.then(() => {
            this.checkServer("matching", true);
        });
    }

    init() {
        this.shuffle(this.boxData.left);
        this.shuffle(this.boxData.right);

        this.renderBoxes();
        this.attachEvents();
        this.observeMathJaxSpeech();

        this.queueMathJax(this.containerDiv).then(() => {
            this.disableBoxMathTabStops();
            this.updateBoxAriaLabels();
        });
    }

    // required elements for a Runestone component

    checkCurrentAnswer() {
        const correctAnswers = this.boxData.correctAnswers;
        const actual = this.connections.map((conn) => [
            conn.fromBox.dataset.id,
            conn.toBox.dataset.id,
        ]);

        const correctMatches = correctAnswers.filter((expected) =>
            actual.some(
                (given) => given[0] === expected[0] && given[1] === expected[1],
            ),
        );

        const incorrectConnections = actual.filter(
            (given) =>
                !correctAnswers.some(
                    (expected) =>
                        expected[0] === given[0] && expected[1] === given[1],
                ),
        );

        this.correctCount = correctMatches.length;
        this.incorrectCount = incorrectConnections.length;
        this.missingCount = correctAnswers.length - this.correctCount;
        this.denominator =
            this.correctCount + this.incorrectCount + this.missingCount;
        this.scorePercent =
            this.denominator === 0
                ? 0
                : Math.max(
                      0,
                      Math.min(
                          100,
                          Math.round(
                              (this.correctCount / this.denominator) * 100,
                          ),
                      ),
                  );
    }

    async logCurrentAnswer() {
        let eventData = {
            score: this.scorePercent,
            percent: this.scorePercent / 100.0,
            correctCount: this.correctCount,
            incorrectCount: this.incorrectCount,
            missingCount: this.missingCount,
            connections: this.connections.map((conn) => ({
                from: conn.fromBox.dataset.id,
                to: conn.toBox.dataset.id,
            })),
        };
        eventData.event = "matching";
        eventData.div_id = this.divid;
        eventData.act = `score:${eventData.score} connections:${JSON.stringify(eventData.connections)}`;
        eventData.correct = eventData.score === 100;
        eventData.answer = JSON.stringify({
            connections: eventData.connections,
        });

        await this.logBookEvent(eventData);
    }

    renderFeedback() {
        this.allBoxes.forEach((box) =>
            box.classList.remove("match-correct", "match-incorrect"),
        );
        this.connections.forEach((conn) => {
            const idPair = [conn.fromBox.dataset.id, conn.toBox.dataset.id];
            const isCorrect = this.boxData.correctAnswers.some(
                (expected) =>
                    expected[0] === idPair[0] && expected[1] === idPair[1],
            );
            conn.line.classList.remove("correct", "incorrect");
            conn.line.classList.add(isCorrect ? "correct" : "incorrect");
            [conn.fromBox, conn.toBox].forEach((box) => {
                if (!isCorrect) {
                    box.classList.remove("match-correct");
                    box.classList.add("match-incorrect");
                } else if (!box.classList.contains("match-incorrect")) {
                    box.classList.add("match-correct");
                }
            });
        });
        this.allBoxes.forEach((box) => this.updateBoxAriaLabel(box));

        const badgeClass =
            this.scorePercent === 100 ? " match-score-perfect" : "";
        this.feedbackDiv.hidden = false;
        this.feedbackDiv.innerHTML = `<div class="match-results"><span class="match-score-badge${badgeClass}">Score: ${this.scorePercent}%</span><span class="match-counts">${this.correctCount} correct &middot; ${this.incorrectCount} incorrect &middot; ${this.missingCount} missing</span></div>`;
        if (
            this.scorePercent !== 100 &&
            this.boxData.feedback &&
            this.boxData.feedback.trim()
        ) {
            this.feedbackDiv.innerHTML += `<div class="match_feedback exercise-content"><strong>Feedback:</strong> ${this.boxData.feedback}</div>`;
        }
        this.queueMathJax(this.feedbackDiv);
    }

    createStatement(container) {
        const statement = document.createElement("div");
        statement.className = "statement";
        statement.classList.add("match_question");
        statement.classList.add("exercise-statement");
        statement.innerHTML = this.boxData.statement;
        container.insertBefore(statement, container.firstChild);
        return statement;
    }

    restoreAnswers(data) {
        // Recreate lines
        if (data) {
            this.connections = data.answer.connections.map((conn) => ({
                fromBox: this.allBoxes.find(
                    (box) => box.dataset.id === conn.from,
                ),
                toBox: this.allBoxes.find((box) => box.dataset.id === conn.to),
            }));
            this.updateConnectionModel();
            this.correct = data.correct;
        }
        this.connections.forEach((conn) => {
            const from = this.getRightBoxCenter(conn.fromBox);
            const to = this.getLeftBoxCenter(conn.toBox);
            const line = this.createLineElement(from, to);
            line.fromBox = conn.fromBox;
            line.toBox = conn.toBox;
            this.svg.appendChild(line);
            conn.line = line;
        });
    }
    checkLocalStorage() {
        if (this.graderactive) {
            return;
        }
        const data = localStorage.getItem(this.localStorageKey());
        if (data) {
            const parsedData = JSON.parse(data);
            if (
                parsedData.timestamp &&
                parsedData.timestamp < eBookConfig.termStartDate
            ) {
                localStorage.removeItem(this.localStorageKey());
                return;
            }
            this.connections = parsedData.connections.map((conn) => ({
                fromBox: this.allBoxes.find(
                    (box) => box.dataset.id === conn.from,
                ),
                toBox: this.allBoxes.find((box) => box.dataset.id === conn.to),
            }));
            this.updateConnectionModel();
            this.correctCount = parsedData.correctCount;
            this.incorrectCount = parsedData.incorrectCount;
            this.missingCount = parsedData.missingCount;
            this.scorePercent = parsedData.score;
            this.restoreAnswers();
        }
    }
    setLocalStorage() {
        const timeStamp = new Date();
        const data = {
            connections: this.connections.map((conn) => ({
                from: conn.fromBox.dataset.id,
                to: conn.toBox.dataset.id,
            })),
            score: this.scorePercent,
            correctCount: this.correctCount,
            incorrectCount: this.incorrectCount,
            missingCount: this.missingCount,
            timestamp: timeStamp,
        };
        localStorage.setItem(this.localStorageKey(), JSON.stringify(data));
    }

    disableInteraction() {}

    createWorkspace(container) {
        const workspace = document.createElement("div");
        workspace.className = "matching-workspace";

        const leftColumn = document.createElement("div");
        leftColumn.className = "left-column";
        this.leftColumn = leftColumn;
        const svg = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg",
        );
        svg.classList.add("connector-svg");
        this.svg = svg;

        const rightColumn = document.createElement("div");
        rightColumn.className = "right-column";
        this.rightColumn = rightColumn;
        workspace.appendChild(leftColumn);
        workspace.appendChild(svg);
        workspace.appendChild(rightColumn);

        container.insertBefore(workspace, container.firstChild);
        return workspace;
    }

    createConnList(container) {
        const connList = document.createElement("div");
        connList.className = "conn-list";
        connList.innerHTML =
            '<strong>Connections:</strong><div class="conn-entry conn-empty">No connections yet. Drag between boxes to connect them.</div>';
        container.appendChild(connList);
        return connList;
    }

    createFeedbackDiv(container) {
        const feedbackDiv = document.createElement("div");
        feedbackDiv.className = "match-feedback";
        feedbackDiv.hidden = true;
        feedbackDiv.setAttribute("role", "status");
        feedbackDiv.setAttribute("aria-live", "polite");
        feedbackDiv.setAttribute("aria-atomic", "true");
        container.appendChild(feedbackDiv);
        return feedbackDiv;
    }

    createAriaLive(container) {
        const ariaLive = document.createElement("div");
        ariaLive.className = "aria-live";
        ariaLive.setAttribute("aria-live", "polite");
        ariaLive.setAttribute("aria-atomic", "true");
        container.appendChild(ariaLive);
        return ariaLive;
    }

    createControlDiv(container) {
        const controlDiv = document.createElement("div");
        controlDiv.className = "control-div";
        const gradeBtn = document.createElement("button");
        gradeBtn.className = "grade-button";
        gradeBtn.textContent = "Check Me";
        gradeBtn.classList.add("btn", "btn-success");
        const resetBtn = document.createElement("button");
        resetBtn.className = "reset-button";
        resetBtn.textContent = "Reset";
        resetBtn.classList.add("btn", "btn-default");
        // add Help button
        const helpBtn = document.createElement("button");
        helpBtn.className = "help-button";
        helpBtn.textContent = "?"; // changed from 'Help'
        helpBtn.setAttribute("aria-label", "Help"); // accessible label
        controlDiv.appendChild(gradeBtn);
        controlDiv.appendChild(resetBtn);
        controlDiv.appendChild(helpBtn);
        container.appendChild(controlDiv);

        // events
        gradeBtn.addEventListener("click", () => this.gradeConnections());
        resetBtn.addEventListener("click", () => this.resetConnections());
        helpBtn.addEventListener("click", () => this.showHelp());
        this.gradeBtn = gradeBtn;
        this.resetBtn = resetBtn;
        this.helpBtn = helpBtn;
        return controlDiv;
    }

    createHelpModal() {
        this.helpModal = document.createElement("dialog");
        this.helpModal.className = "help-modal";
        this.helpModal.setAttribute("aria-live", "polite");
        this.helpModal.setAttribute("aria-atomic", "true");
        const titleId = this.divid + "-help-title";
        const text = `<p>Click and drag between boxes to create connections.</p>
        <p>Use the tab key to navigate to a box and press Enter to select it.  Focus then jumps to the other column; tab to the box you want to connect and press Enter.  Press Escape to cancel a selection.</p>
        <p>Click on a connection line or use the tab key to select it. Press Enter, Delete, or Backspace to remove a selected line.</p>
        <p>Click the "Check Me" button to check your connections, and save your work.</p>
        <p>Click the "Reset" button to clear all connections.</p>`;

        this.helpModal.setAttribute("aria-labelledby", titleId);
        this.helpModal.innerHTML =
            '<div class="help-modal-content">' +
            '<button type="button" class="help-close" aria-label="Close matching help">&times;</button>' +
            '<h2 id="' +
            titleId +
            '">Matching help</h2>' +
            '<div class="help-text">' +
            text +
            "</div></div>";
        this.containerDiv.appendChild(this.helpModal);
        this.helpModal
            .querySelector(".help-close")
            .addEventListener("click", () => this.hideHelp());
        this.helpModal.addEventListener("cancel", (event) => {
            event.preventDefault();
            this.hideHelp();
        });
        this.helpModal.addEventListener("click", (event) => {
            if (event.target === this.helpModal) {
                this.hideHelp();
            }
        });
        this.helpModal.addEventListener("close", () => this.helpBtn?.focus());
    }

    showHelp() {
        if (!this.helpModal.open) {
            this.helpModal.showModal();
        }
    }

    hideHelp() {
        if (this.helpModal.open) {
            this.helpModal.close();
        }
    }

    // Utility functions
    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    renderBoxes() {
        this.boxData.left.forEach(({ id, label }) => {
            const box = this.createBox(id, label, "drag");
            this.leftColumn.appendChild(box);
            this.allBoxes.push(box);
        });

        this.boxData.right.forEach(({ id, label }) => {
            const box = this.createBox(id, label, "drop");
            this.rightColumn.appendChild(box);
            this.allBoxes.push(box);
        });

        const imgs = Array.from(this.workspace.querySelectorAll("img"));
        if (imgs.length === 0) {
            this.boxesRenderedResolve();
        }
        // Wait for all images to load before resolving the promise
        const imgPromises = imgs.map((img) => {
            if (typeof img.decode === "function") {
                return img.decode();
            }
            if (img.complete && img.naturalWidth !== 0) {
                return Promise.resolve();
            }
            return new Promise((resolve) => {
                img.addEventListener("load", () => resolve());
                img.addEventListener("error", () => resolve());
            });
        });

        Promise.all(imgPromises).then(() => {
            this.boxesRenderedResolve();
        });
    }

    createBox(id, label, role) {
        const div = document.createElement("div");
        div.className = "box";
        div.dataset.id = id;
        div.dataset.role = role;
        div.innerHTML = label;
        div.tabIndex = 0;
        div.setAttribute("role", "button");
        this.updateBoxAriaLabel(div);
        return div;
    }

    getBoxLabel(box) {
        return (0,_common_js_mathjax_a11y_js__WEBPACK_IMPORTED_MODULE_1__.getAccessibleElementText)(box) || "box";
    }

    updateBoxAriaLabel(box) {
        const labelPrefix =
            box.dataset.role === "drag" ? "Draggable" : "Droppable";
        const gradingState = box.classList.contains("match-incorrect")
            ? ", incorrect"
            : box.classList.contains("match-correct")
              ? ", correct"
              : "";
        box.setAttribute(
            "aria-label",
            labelPrefix + ": " + this.getBoxLabel(box) + gradingState,
        );
    }

    updateBoxAriaLabels() {
        for (const box of this.allBoxes || []) {
            this.updateBoxAriaLabel(box);
        }
        for (const connection of this.connections || []) {
            this.updateLineAriaLabel(connection.line);
        }
    }

    disableBoxMathTabStops(root = this.containerDiv) {
        (0,_common_js_mathjax_a11y_js__WEBPACK_IMPORTED_MODULE_1__.disableMathJaxTabStops)(root, [".box"]);
    }

    observeMathJaxSpeech() {
        if (typeof MutationObserver === "undefined") return;

        this.mathJaxSpeechObserver = new MutationObserver((mutations) => {
            const changedBoxes = new Set();
            for (const mutation of mutations) {
                const box = mutation.target.closest?.(".box");
                if (box && this.allBoxes.includes(box)) {
                    changedBoxes.add(box);
                }
            }
            if (changedBoxes.size === 0) return;

            changedBoxes.forEach((box) => this.updateBoxAriaLabel(box));
            const changedConnections = this.connections.filter(
                ({ fromBox, toBox }) =>
                    changedBoxes.has(fromBox) || changedBoxes.has(toBox),
            );
            changedConnections.forEach(({ line }) =>
                this.updateLineAriaLabel(line),
            );
            if (changedConnections.length > 0) {
                this.renderConnectionList();
            }
        });
        this.mathJaxSpeechObserver.observe(this.containerDiv, {
            subtree: true,
            attributes: true,
            attributeFilter: ["data-semantic-speech-none"],
        });
    }

    getColumnBoxes(role) {
        const column = role === "drag" ? this.leftColumn : this.rightColumn;
        return Array.from(column.querySelectorAll(".box")).filter((box) =>
            this.allBoxes.includes(box),
        );
    }

    getTabbableBoxes() {
        if (!this.selectedBox) {
            return this.allBoxes;
        }
        return this.getColumnBoxes(
            this.selectedBox.dataset.role === "drag" ? "drop" : "drag",
        );
    }

    updateBoxTabStops() {
        const tabbableBoxes = new Set(this.getTabbableBoxes());
        for (const box of this.allBoxes) {
            box.tabIndex = tabbableBoxes.has(box) ? 0 : -1;
        }
    }

    setSelectedBox(box) {
        this.setSelectedLine(null, false);
        if (this.selectedBox) {
            this.selectedBox.classList.remove("selected");
        }
        this.selectedBox = box;
        this.activeBoxRole = box ? box.dataset.role : null;
        if (box) {
            box.classList.add("selected");
        }
        this.updateBoxTabStops();
    }

    activateBox(box) {
        if (!this.selectedBox) {
            this.setSelectedBox(box);
            const firstOppositeBox = this.getTabbableBoxes()[0];
            firstOppositeBox?.focus();
            if (this.ariaLive) {
                this.ariaLive.textContent = `Selected ${this.getBoxLabel(box)}. Tab to a box in the other column and press Enter to connect, or press Escape to cancel.`;
            }
            return;
        }

        if (box !== this.selectedBox) {
            this.createPermanentLine(this.selectedBox, box);
        }
        this.setSelectedBox(null);
        box.focus();
    }

    setSelectedLine(line, announce = true) {
        if (this.selectedLine && this.selectedLine !== line) {
            this.selectedLine.classList.remove("selected");
        }
        this.selectedLine = line;
        if (line) {
            if (this.selectedBox) {
                this.selectedBox.classList.remove("selected");
                this.selectedBox = null;
                this.activeBoxRole = null;
                this.updateBoxTabStops();
            }
            line.classList.add("selected");
            if (announce && this.ariaLive) {
                const fromLabel = line.fromBox
                    ? this.getBoxLabel(line.fromBox)
                    : "one box";
                const toLabel = line.toBox
                    ? this.getBoxLabel(line.toBox)
                    : "another box";
                this.ariaLive.textContent = `Selected connection from ${fromLabel} to ${toLabel}. Press Enter to delete it.`;
            }
        }
    }

    cancelSelectedBox() {
        const selected = this.selectedBox;
        if (!selected) {
            return;
        }
        this.setSelectedBox(null);
        selected.focus();
        if (this.ariaLive) {
            this.ariaLive.textContent = "Selection cancelled.";
        }
    }

    moveBoxFocus(box, moveDown) {
        const boxOrder = this.selectedBox
            ? this.getTabbableBoxes()
            : this.getColumnBoxes(box.dataset.role);
        const currentIndex = boxOrder.indexOf(box);
        if (currentIndex === -1) {
            return;
        }
        const targetIndex = Math.max(
            0,
            Math.min(currentIndex + (moveDown ? 1 : -1), boxOrder.length - 1),
        );
        boxOrder[targetIndex]?.focus();
    }

    moveBoxFocusAcrossColumns(rightColumn) {
        const targetRole = rightColumn ? "drop" : "drag";
        this.getColumnBoxes(targetRole)[0]?.focus();
    }

    moveTabFocus(box, moveBackward) {
        const boxOrder = this.getTabbableBoxes();
        const currentIndex = boxOrder.indexOf(box);
        if (currentIndex === -1 || boxOrder.length === 0) {
            return;
        }
        const offset = moveBackward ? -1 : 1;
        const targetIndex =
            (currentIndex + offset + boxOrder.length) % boxOrder.length;
        boxOrder[targetIndex]?.focus();
    }
    getCenter(el) {
        const elRect = el.getBoundingClientRect();
        const containerRect = this.workspace.getBoundingClientRect();
        return {
            x: elRect.left - containerRect.left + elRect.width / 2,
            y: elRect.top - containerRect.top + elRect.height / 2,
        };
    }

    getRightBoxCenter(el) {
        const elRect = el.getBoundingClientRect();
        const containerRect = this.workspace.getBoundingClientRect();
        return {
            x: elRect.left - containerRect.left + elRect.width,
            y: elRect.top - containerRect.top + elRect.height / 2,
        };
    }
    getLeftBoxCenter(el) {
        const elRect = el.getBoundingClientRect();
        const containerRect = this.workspace.getBoundingClientRect();
        return {
            x: elRect.left - containerRect.left,
            y: elRect.top - containerRect.top + elRect.height / 2,
        };
    }

    // The port (where lines attach) is on the inner edge of the box: the
    // right edge for left-column (drag) boxes, the left edge for
    // right-column (drop) boxes.
    getPortCenter(el) {
        return el.dataset.role === "drop"
            ? this.getLeftBoxCenter(el)
            : this.getRightBoxCenter(el);
    }

    /*
     * Connection lines are drawn as gentle S-curves (cubic beziers) whose
     * control points pull horizontally out of each port, so lines leave and
     * enter boxes perpendicular to the column edges.
     */
    setLineEndpoints(line, from, to) {
        const pull = Math.max(30, Math.abs(to.x - from.x) / 2);
        // Pull the control points toward the other endpoint so the curve
        // leaves the port heading in the right direction; sign handles a
        // temp line dragged leftward from a right-column port.
        const sign = to.x >= from.x ? 1 : -1;
        line.setAttribute(
            "d",
            `M ${from.x} ${from.y} C ${from.x + sign * pull} ${from.y}, ${to.x - sign * pull} ${to.y}, ${to.x} ${to.y}`,
        );
    }

    createLineElement(from, to) {
        const line = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path",
        );
        this.setLineEndpoints(line, from, to);
        line.setAttribute("class", "line");
        line.setAttribute("tabindex", "0"); // Make the line focusable
        line.setAttribute("focusable", "true"); // Make the line focusable
        line.setAttribute("role", "button"); // Add ARIA role for accessibility
        line.setAttribute(
            "aria-label",
            "Connection line. Press Enter, Delete, or Backspace to remove.",
        ); // Add ARIA label

        line.addEventListener("click", (e) => {
            e.preventDefault();
            line.focus();
            this.setSelectedLine(line);
        });

        line.addEventListener("focus", () => {
            this.setSelectedLine(line);
        });

        line.addEventListener("blur", () => {
            if (this.selectedLine === line) {
                this.setSelectedLine(null, false);
            }
        });

        line.addEventListener("keydown", (e) => {
            if (
                e.key === "Enter" ||
                e.key === "Delete" ||
                e.key === "Backspace"
            ) {
                e.preventDefault();
                this.removeLine(line);
            }
        });

        return line;
    }

    updateLineAriaLabel(line) {
        if (!line) {
            return;
        }
        const fromLabel = line.fromBox
            ? this.getBoxLabel(line.fromBox)
            : "one box";
        const toLabel = line.toBox
            ? this.getBoxLabel(line.toBox)
            : "another box";
        line.setAttribute(
            "aria-label",
            "Connection from " +
                fromLabel +
                " to " +
                toLabel +
                ". Press Enter, Delete, or Backspace to remove.",
        );
    }

    removeLine(line) {
        const fromLabel = line.fromBox
            ? this.getBoxLabel(line.fromBox)
            : "one box";
        const toLabel = line.toBox
            ? this.getBoxLabel(line.toBox)
            : "another box";
        if (this.selectedLine === line) {
            this.setSelectedLine(null, false);
        }
        this.svg.removeChild(line);
        const index = this.connections.findIndex(
            (conn) =>
                (conn.fromBox === line.fromBox && conn.toBox === line.toBox) ||
                (conn.fromBox === line.toBox && conn.toBox === line.fromBox),
        );
        if (index !== -1) this.connections.splice(index, 1);
        this.updateConnectionModel();
        if (this.ariaLive) {
            this.ariaLive.textContent = `Removed connection from ${fromLabel} to ${toLabel}.`;
        }
    }

    isConnected(a, b) {
        return this.connections.some(
            (conn) =>
                (conn.fromBox === a && conn.toBox === b) ||
                (conn.fromBox === b && conn.toBox === a),
        );
    }

    createPermanentLine(fromBox, toBox) {
        const fromRole = fromBox.dataset.role;
        const toRole = toBox.dataset.role;

        if (fromRole === toRole) {
            this.flashInvalid(fromBox, toBox);
            if (this.ariaLive) {
                this.ariaLive.textContent =
                    "Connections must go between the left column and the right column.";
            }
            return false;
        }

        // we should always store connections as drag to drop
        // even if the user connects drop to drag
        if (fromBox.dataset.role === "drop") {
            [fromBox, toBox] = [toBox, fromBox];
        }
        if (this.isConnected(fromBox, toBox)) return false;

        const from = this.getRightBoxCenter(fromBox);
        const to = this.getLeftBoxCenter(toBox);
        const line = this.createLineElement(from, to);

        line.fromBox = fromBox;
        line.toBox = toBox;
        this.updateLineAriaLabel(line);

        this.svg.appendChild(line);
        this.connections.push({ fromBox, toBox, line });
        this.updateConnectionModel();
        this.isAnswered = true;

        if (this.ariaLive) {
            this.ariaLive.textContent = `Connected ${this.getBoxLabel(fromBox)} to ${this.getBoxLabel(toBox)}`;
        }
        return true;
    }

    flashInvalid(...boxes) {
        boxes.forEach((box) => {
            box.classList.add("invalid");
            setTimeout(() => box.classList.remove("invalid"), 500);
        });
    }

    hideFeedback() {
        this.feedbackDiv.hidden = true;
        this.feedbackDiv.replaceChildren();
    }

    appendConnectionBoxContent(entry, box) {
        const speech = document.createElement("span");
        speech.className = "visuallyhidden";
        speech.textContent = this.getBoxLabel(box);

        const visual = document.createElement("span");
        visual.className = "conn-box-visual";
        visual.setAttribute("aria-hidden", "true");
        for (const child of box.childNodes) {
            visual.appendChild(child.cloneNode(true));
        }
        visual
            .querySelectorAll(
                "a[href], button, input, select, textarea, [tabindex]",
            )
            .forEach((element) => {
                element.tabIndex = -1;
            });

        entry.append(speech, visual);
    }

    renderConnectionList() {
        this.connList.innerHTML = "<strong>Connections:</strong>";
        if (this.connections.length === 0) {
            const empty = document.createElement("div");
            empty.className = "conn-entry conn-empty";
            empty.textContent =
                "No connections yet. Drag between boxes to connect them.";
            this.connList.appendChild(empty);
            return;
        }
        this.connections.forEach((conn) => {
            const line = document.createElement("div");
            line.className = "conn-entry";
            this.appendConnectionBoxContent(line, conn.fromBox);

            const arrow = document.createElement("span");
            arrow.setAttribute("aria-hidden", "true");
            arrow.textContent = "→";
            const connectionText = document.createElement("span");
            connectionText.className = "visuallyhidden";
            connectionText.textContent = "connected to";
            line.append(arrow, connectionText);

            this.appendConnectionBoxContent(line, conn.toBox);
            this.connList.appendChild(line);
        });
    }

    updateConnectionModel() {
        // Any change to the connections invalidates previously rendered
        // grading marks, so clear them along with rebuilding the list.
        this.hideFeedback();
        this.allBoxes.forEach((box) =>
            box.classList.remove("match-correct", "match-incorrect"),
        );
        this.allBoxes.forEach((box) => this.updateBoxAriaLabel(box));
        this.connections.forEach(({ line }) => {
            line?.classList.remove("correct", "incorrect");
        });
        this.renderConnectionList();
    }

    /*
     * This method grades the connections made by the user.
     * It checks the current answer against the correct answers,
     * renders feedback, and logs the current answer.
     * It also updates the local storage with the current state.
     * It is called when the user clicks the "Grade" button.
     */
    gradeConnections() {
        this.checkCurrentAnswer();
        this.renderFeedback();
        this.logCurrentAnswer();
        this.setLocalStorage();
    }

    resetConnections() {
        this.connections.forEach((conn) => {
            if (conn.line && conn.line.parentNode === this.svg) {
                this.svg.removeChild(conn.line);
            }
        });
        this.connections.length = 0;
        this.updateConnectionModel();
        if (this.ariaLive)
            this.ariaLive.textContent = "All connections have been cleared.";
        this.logBookEvent({
            event: "matching_reset",
            div_id: this.divid,
            act: "reset all connections",
        });
    }

    attachEvents() {
        this.allBoxes.forEach((box) => {
            box.addEventListener("pointerdown", (e) => {
                e.preventDefault();
                this.startBox = box;
                const from = this.getPortCenter(this.startBox);
                this.tempLine = this.createLineElement(from, from);
                this.tempLine.classList.add("temp");
                this.svg.appendChild(this.tempLine);

                document.addEventListener("pointermove", this.updateTempLine);
                document.addEventListener("pointerup", this.finishConnection);
            });

            box.addEventListener("keydown", (e) => {
                if (e.target !== box) {
                    return;
                }
                if (e.key === "Enter") {
                    e.preventDefault();
                    this.activateBox(box);
                } else if (e.key === "Escape" && this.selectedBox) {
                    e.preventDefault();
                    this.cancelSelectedBox();
                } else if (this.selectedBox && e.key === "Tab") {
                    e.preventDefault();
                    this.moveTabFocus(box, e.shiftKey);
                } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                    e.preventDefault();
                    this.moveBoxFocus(box, e.key === "ArrowDown");
                } else if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
                    e.preventDefault();
                    this.moveBoxFocusAcrossColumns(e.key === "ArrowRight");
                }
            });

            box.addEventListener("click", (e) => {
                e.preventDefault();
                this.activateBox(box);
            });

            box.addEventListener("mouseenter", () => {
                this.connections.forEach((conn) => {
                    if (conn.fromBox === box || conn.toBox === box) {
                        conn.line.classList.add("highlighted");
                        conn.line.classList.remove("faded");
                    } else {
                        conn.line.classList.add("faded");
                        conn.line.classList.remove("highlighted");
                    }
                });
            });

            box.addEventListener("mouseleave", () => {
                this.connections.forEach((conn) => {
                    conn.line.classList.remove("highlighted", "faded");
                });
            });
        });

        window.addEventListener("resize", () => {
            this.connections.forEach((conn) => {
                const from = this.getRightBoxCenter(conn.fromBox);
                const to = this.getLeftBoxCenter(conn.toBox);
                this.setLineEndpoints(conn.line, from, to);
            });
        });
    }

    updateTempLine = (e) => {
        e.preventDefault();
        if (!this.startBox || !this.tempLine) return;
        const from = this.getPortCenter(this.startBox);
        const containerRect = this.workspace.getBoundingClientRect();
        const to = {
            x: e.clientX - containerRect.left,
            y: e.clientY - containerRect.top,
        };
        this.setLineEndpoints(this.tempLine, from, to);
    };

    finishConnection = (e) => {
        e.preventDefault();
        if (this.tempLine) {
            this.svg.removeChild(this.tempLine);
            this.tempLine = null;
        }

        // the target element is the element under the pointer
        // when the pointer is released
        // this is not the same as e.target which may be the box or it may be the svg
        // or it may be the line, so we do it this way instead of checking to see if the box contains
        // e.target.  const endBox = this.allBoxes.find(box => box.contains(e.target) && box !== this.startBox);
        const pointX =
            e.clientX || (e.changedTouches && e.changedTouches[0].clientX);
        const pointY =
            e.clientY || (e.changedTouches && e.changedTouches[0].clientY);
        const targetElement = document.elementFromPoint(pointX, pointY);

        const endBox = this.allBoxes.find(
            (box) => box.contains(targetElement) && box !== this.startBox,
        );

        if (
            this.startBox &&
            endBox &&
            this.createPermanentLine(this.startBox, endBox)
        ) {
            this.logBookEvent({
                event: "matching_connection",
                div_id: this.divid,
                act: `connected ${this.startBox.dataset.id} to ${endBox.dataset.id}`,
            });
        }
        this.startBox = null;
        document.removeEventListener("pointermove", this.updateTempLine);
        document.removeEventListener("pointerup", this.finishConnection);
    };
}

// Register the component with Runestone
document.addEventListener("runestone:login-complete", () => {
    document
        .querySelectorAll('[data-component="matching"]')
        .forEach((container) => {
            if (!container.closest("[data-component=timedAssessment]")) {
                let opts = { orig: container };
                window.componentMap[container.id] = new MatchingProblem(opts);
            }
        });
});

// Add component factory initialization
if (typeof window.component_factory === "undefined") {
    window.component_factory = {};
}

window.component_factory.matching = function (opts) {
    return new MatchingProblem(opts);
};


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDQSxhQUFhOztBQUViO0FBQ0E7QUFDQTtBQUNBLGFBQWE7O0FBRWI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQjtBQUN0QjtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsYUFBYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsYUFBYTtBQUNiLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0MsMEJBQTBCLEtBQUssa0JBQWtCO0FBQ25GLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL21hdGNoaW5nL2Nzcy9tYXRjaGluZy5sZXNzP2JkMmQiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9tYXRjaGluZy9qcy94bWxjb252ZXJzaW9uLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvbWF0Y2hpbmcvanMvbWF0Y2hpbmcuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiaW1wb3J0IHsgUXVlc3Rpb25YbWxDb252ZXJ0ZXIgfSBmcm9tIFwiLi4vLi4vY29tbW9uL2pzL3htbGNvbnZlcnNpb24uanNcIjtcblxuLypcbiAqIE1hdGNoaW5nIGV4cHJlc3NlcyBpdHMgYW5zd2VyIGtleSBhcyA8ZWRnZT4gZWxlbWVudHMsIGVhY2ggaG9sZGluZyB0d29cbiAqIDxsYWJlbD4gY2hpbGRyZW4gd2hvc2UgdGV4dCBjb250ZW50IGFyZSB0aGUgcHJlbWlzZSBhbmQgcmVzcG9uc2UgaWRzOlxuICpcbiAqICAgPGVkZ2U+PGxhYmVsPmxlZnQtMTwvbGFiZWw+PGxhYmVsPnJpZ2h0LTI8L2xhYmVsPjwvZWRnZT5cbiAqL1xuZXhwb3J0IGNsYXNzIE1hdGNoaW5nWG1sQ29udmVydGVyIGV4dGVuZHMgUXVlc3Rpb25YbWxDb252ZXJ0ZXIge1xuICAgIGNvcnJlY3RBbnN3ZXJzKCkge1xuICAgICAgICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLmRvYy5xdWVyeVNlbGVjdG9yQWxsKFwiZWRnZVwiKSkubWFwKChlZGdlRWwpID0+XG4gICAgICAgICAgICAvLyB0YWtlIHRoZSBmaXJzdCB0d28gPGxhYmVsPiBjaGlsZHJlbiBhcyB0aGUgW3ByZW1pc2UsIHJlc3BvbnNlXSBwYWlyXG4gICAgICAgICAgICBBcnJheS5mcm9tKGVkZ2VFbC5xdWVyeVNlbGVjdG9yQWxsKFwibGFiZWxcIikpXG4gICAgICAgICAgICAgICAgLnNsaWNlKDAsIDIpXG4gICAgICAgICAgICAgICAgLm1hcCgobCkgPT4gbC50ZXh0Q29udGVudC50cmltKCkpLFxuICAgICAgICApO1xuICAgIH1cbn1cbiIsImltcG9ydCBSdW5lc3RvbmVCYXNlIGZyb20gXCIuLi8uLi9jb21tb24vanMvcnVuZXN0b25lYmFzZS5qc1wiO1xuaW1wb3J0IHtcbiAgICBkaXNhYmxlTWF0aEpheFRhYlN0b3BzLFxuICAgIGdldEFjY2Vzc2libGVFbGVtZW50VGV4dCxcbn0gZnJvbSBcIi4uLy4uL2NvbW1vbi9qcy9tYXRoamF4LWExMXkuanNcIjtcbmltcG9ydCBcIi4uL2Nzcy9tYXRjaGluZy5sZXNzXCI7XG5pbXBvcnQgeyBNYXRjaGluZ1htbENvbnZlcnRlciB9IGZyb20gXCIuL3htbGNvbnZlcnNpb24uanNcIjtcbmV4cG9ydCBjbGFzcyBNYXRjaGluZ1Byb2JsZW0gZXh0ZW5kcyBSdW5lc3RvbmVCYXNlIHtcbiAgICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgICAgIHN1cGVyKG9wdHMpO1xuICAgICAgICBsZXQgY29udGFpbmVyID0gb3B0cy5vcmlnO1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdiA9IG9wdHMub3JpZztcbiAgICAgICAgY29uc3Qgc2NyaXB0ID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoXCJzY3JpcHRcIik7XG4gICAgICAgIGlmIChzY3JpcHQpIHtcbiAgICAgICAgICAgIGxldCBib3hEYXRhO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAvLyB0aGUgc2NyaXB0IGlzIGNhbGxlZCB4bWwgYnV0IG1heSBhbHNvIGNvbnRhaW4gc29tZSBodG1sIGZvciB0aGUgc3RhdGVtZW50LlxuICAgICAgICAgICAgICAgIGlmIChzY3JpcHQudHlwZSA9PSBcInRleHQveG1sXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeG1sID0gc2NyaXB0LnRleHRDb250ZW50O1xuICAgICAgICAgICAgICAgICAgICBib3hEYXRhID0gbmV3IE1hdGNoaW5nWG1sQ29udmVydGVyKHhtbCkudG9Kc29uKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYm94RGF0YSA9IEpTT04ucGFyc2Uoc2NyaXB0LnRleHRDb250ZW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5ib3hEYXRhID0gYm94RGF0YTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJGYWlsZWQgdG8gcGFyc2UgYm94RGF0YSBKU09OOlwiLCBlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kaXZpZCA9IGNvbnRhaW5lci5pZDtcbiAgICAgICAgdGhpcy5ib3hlc1JlbmRlcmVkUHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmJveGVzUmVuZGVyZWRSZXNvbHZlID0gcmVzb2x2ZTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMud29ya3NwYWNlID0gdGhpcy5jcmVhdGVXb3Jrc3BhY2UoY29udGFpbmVyKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMuc3RhdGVtZW50ID0gdGhpcy5jcmVhdGVTdGF0ZW1lbnQoY29udGFpbmVyKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBzZXR0aW5nIHN0YXRlbWVudDpcIiwgZXJyb3IpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY29ubkxpc3QgPSB0aGlzLmNyZWF0ZUNvbm5MaXN0KGNvbnRhaW5lcik7XG4gICAgICAgIHRoaXMuZmVlZGJhY2tEaXYgPSB0aGlzLmNyZWF0ZUZlZWRiYWNrRGl2KGNvbnRhaW5lcik7XG4gICAgICAgIHRoaXMuYXJpYUxpdmUgPSB0aGlzLmNyZWF0ZUFyaWFMaXZlKGNvbnRhaW5lcik7XG4gICAgICAgIHRoaXMuY29udHJvbERpdiA9IHRoaXMuY3JlYXRlQ29udHJvbERpdihjb250YWluZXIpO1xuICAgICAgICB0aGlzLmNyZWF0ZUhlbHBNb2RhbCgpO1xuXG4gICAgICAgIHRoaXMuY29ubmVjdGlvbnMgPSBbXTtcbiAgICAgICAgdGhpcy5hbGxCb3hlcyA9IFtdO1xuICAgICAgICB0aGlzLnNlbGVjdGVkQm94ID0gbnVsbDtcbiAgICAgICAgdGhpcy5hY3RpdmVCb3hSb2xlID0gbnVsbDtcbiAgICAgICAgdGhpcy5zZWxlY3RlZExpbmUgPSBudWxsO1xuICAgICAgICB0aGlzLnN0YXJ0Qm94ID0gbnVsbDtcbiAgICAgICAgdGhpcy50ZW1wTGluZSA9IG51bGw7XG4gICAgICAgIHRoaXMudXNlUnVuZXN0b25lU2VydmljZXMgPSBlQm9va0NvbmZpZy51c2VSdW5lc3RvbmVTZXJ2aWNlcztcbiAgICAgICAgdGhpcy5ncmFkZXJhY3RpdmUgPSBvcHRzLmdyYWRlcmFjdGl2ZSB8fCBmYWxzZTtcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgICAgIC8vIGVuc3VyZSB0aGF0IGJveGVzIGFyZSByZW5kZXJlZCBiZWZvcmUgY2hlY2tpbmcgc2VydmVyXG4gICAgICAgIC8vIGlmIGJveGVzIGFyZSBub3QgcmVuZGVyZWQgdGhlbiB3ZSBtYXkgaGF2ZSBkYW5nbGluZyBsaW5lc1xuICAgICAgICAvLyB0aGF0IGFyZSBub3QgY29ubmVjdGVkIHRvIGFueSBib3hlc1xuICAgICAgICB0aGlzLmJveGVzUmVuZGVyZWRQcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jaGVja1NlcnZlcihcIm1hdGNoaW5nXCIsIHRydWUpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBpbml0KCkge1xuICAgICAgICB0aGlzLnNodWZmbGUodGhpcy5ib3hEYXRhLmxlZnQpO1xuICAgICAgICB0aGlzLnNodWZmbGUodGhpcy5ib3hEYXRhLnJpZ2h0KTtcblxuICAgICAgICB0aGlzLnJlbmRlckJveGVzKCk7XG4gICAgICAgIHRoaXMuYXR0YWNoRXZlbnRzKCk7XG4gICAgICAgIHRoaXMub2JzZXJ2ZU1hdGhKYXhTcGVlY2goKTtcblxuICAgICAgICB0aGlzLnF1ZXVlTWF0aEpheCh0aGlzLmNvbnRhaW5lckRpdikudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmRpc2FibGVCb3hNYXRoVGFiU3RvcHMoKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlQm94QXJpYUxhYmVscygpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyByZXF1aXJlZCBlbGVtZW50cyBmb3IgYSBSdW5lc3RvbmUgY29tcG9uZW50XG5cbiAgICBjaGVja0N1cnJlbnRBbnN3ZXIoKSB7XG4gICAgICAgIGNvbnN0IGNvcnJlY3RBbnN3ZXJzID0gdGhpcy5ib3hEYXRhLmNvcnJlY3RBbnN3ZXJzO1xuICAgICAgICBjb25zdCBhY3R1YWwgPSB0aGlzLmNvbm5lY3Rpb25zLm1hcCgoY29ubikgPT4gW1xuICAgICAgICAgICAgY29ubi5mcm9tQm94LmRhdGFzZXQuaWQsXG4gICAgICAgICAgICBjb25uLnRvQm94LmRhdGFzZXQuaWQsXG4gICAgICAgIF0pO1xuXG4gICAgICAgIGNvbnN0IGNvcnJlY3RNYXRjaGVzID0gY29ycmVjdEFuc3dlcnMuZmlsdGVyKChleHBlY3RlZCkgPT5cbiAgICAgICAgICAgIGFjdHVhbC5zb21lKFxuICAgICAgICAgICAgICAgIChnaXZlbikgPT4gZ2l2ZW5bMF0gPT09IGV4cGVjdGVkWzBdICYmIGdpdmVuWzFdID09PSBleHBlY3RlZFsxXSxcbiAgICAgICAgICAgICksXG4gICAgICAgICk7XG5cbiAgICAgICAgY29uc3QgaW5jb3JyZWN0Q29ubmVjdGlvbnMgPSBhY3R1YWwuZmlsdGVyKFxuICAgICAgICAgICAgKGdpdmVuKSA9PlxuICAgICAgICAgICAgICAgICFjb3JyZWN0QW5zd2Vycy5zb21lKFxuICAgICAgICAgICAgICAgICAgICAoZXhwZWN0ZWQpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICBleHBlY3RlZFswXSA9PT0gZ2l2ZW5bMF0gJiYgZXhwZWN0ZWRbMV0gPT09IGdpdmVuWzFdLFxuICAgICAgICAgICAgICAgICksXG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy5jb3JyZWN0Q291bnQgPSBjb3JyZWN0TWF0Y2hlcy5sZW5ndGg7XG4gICAgICAgIHRoaXMuaW5jb3JyZWN0Q291bnQgPSBpbmNvcnJlY3RDb25uZWN0aW9ucy5sZW5ndGg7XG4gICAgICAgIHRoaXMubWlzc2luZ0NvdW50ID0gY29ycmVjdEFuc3dlcnMubGVuZ3RoIC0gdGhpcy5jb3JyZWN0Q291bnQ7XG4gICAgICAgIHRoaXMuZGVub21pbmF0b3IgPVxuICAgICAgICAgICAgdGhpcy5jb3JyZWN0Q291bnQgKyB0aGlzLmluY29ycmVjdENvdW50ICsgdGhpcy5taXNzaW5nQ291bnQ7XG4gICAgICAgIHRoaXMuc2NvcmVQZXJjZW50ID1cbiAgICAgICAgICAgIHRoaXMuZGVub21pbmF0b3IgPT09IDBcbiAgICAgICAgICAgICAgICA/IDBcbiAgICAgICAgICAgICAgICA6IE1hdGgubWF4KFxuICAgICAgICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgICAgICAgTWF0aC5taW4oXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDEwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5yb3VuZChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh0aGlzLmNvcnJlY3RDb3VudCAvIHRoaXMuZGVub21pbmF0b3IpICogMTAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICApO1xuICAgIH1cblxuICAgIGFzeW5jIGxvZ0N1cnJlbnRBbnN3ZXIoKSB7XG4gICAgICAgIGxldCBldmVudERhdGEgPSB7XG4gICAgICAgICAgICBzY29yZTogdGhpcy5zY29yZVBlcmNlbnQsXG4gICAgICAgICAgICBwZXJjZW50OiB0aGlzLnNjb3JlUGVyY2VudCAvIDEwMC4wLFxuICAgICAgICAgICAgY29ycmVjdENvdW50OiB0aGlzLmNvcnJlY3RDb3VudCxcbiAgICAgICAgICAgIGluY29ycmVjdENvdW50OiB0aGlzLmluY29ycmVjdENvdW50LFxuICAgICAgICAgICAgbWlzc2luZ0NvdW50OiB0aGlzLm1pc3NpbmdDb3VudCxcbiAgICAgICAgICAgIGNvbm5lY3Rpb25zOiB0aGlzLmNvbm5lY3Rpb25zLm1hcCgoY29ubikgPT4gKHtcbiAgICAgICAgICAgICAgICBmcm9tOiBjb25uLmZyb21Cb3guZGF0YXNldC5pZCxcbiAgICAgICAgICAgICAgICB0bzogY29ubi50b0JveC5kYXRhc2V0LmlkLFxuICAgICAgICAgICAgfSkpLFxuICAgICAgICB9O1xuICAgICAgICBldmVudERhdGEuZXZlbnQgPSBcIm1hdGNoaW5nXCI7XG4gICAgICAgIGV2ZW50RGF0YS5kaXZfaWQgPSB0aGlzLmRpdmlkO1xuICAgICAgICBldmVudERhdGEuYWN0ID0gYHNjb3JlOiR7ZXZlbnREYXRhLnNjb3JlfSBjb25uZWN0aW9uczoke0pTT04uc3RyaW5naWZ5KGV2ZW50RGF0YS5jb25uZWN0aW9ucyl9YDtcbiAgICAgICAgZXZlbnREYXRhLmNvcnJlY3QgPSBldmVudERhdGEuc2NvcmUgPT09IDEwMDtcbiAgICAgICAgZXZlbnREYXRhLmFuc3dlciA9IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIGNvbm5lY3Rpb25zOiBldmVudERhdGEuY29ubmVjdGlvbnMsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGF3YWl0IHRoaXMubG9nQm9va0V2ZW50KGV2ZW50RGF0YSk7XG4gICAgfVxuXG4gICAgcmVuZGVyRmVlZGJhY2soKSB7XG4gICAgICAgIHRoaXMuYWxsQm94ZXMuZm9yRWFjaCgoYm94KSA9PlxuICAgICAgICAgICAgYm94LmNsYXNzTGlzdC5yZW1vdmUoXCJtYXRjaC1jb3JyZWN0XCIsIFwibWF0Y2gtaW5jb3JyZWN0XCIpLFxuICAgICAgICApO1xuICAgICAgICB0aGlzLmNvbm5lY3Rpb25zLmZvckVhY2goKGNvbm4pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGlkUGFpciA9IFtjb25uLmZyb21Cb3guZGF0YXNldC5pZCwgY29ubi50b0JveC5kYXRhc2V0LmlkXTtcbiAgICAgICAgICAgIGNvbnN0IGlzQ29ycmVjdCA9IHRoaXMuYm94RGF0YS5jb3JyZWN0QW5zd2Vycy5zb21lKFxuICAgICAgICAgICAgICAgIChleHBlY3RlZCkgPT5cbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0ZWRbMF0gPT09IGlkUGFpclswXSAmJiBleHBlY3RlZFsxXSA9PT0gaWRQYWlyWzFdLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGNvbm4ubGluZS5jbGFzc0xpc3QucmVtb3ZlKFwiY29ycmVjdFwiLCBcImluY29ycmVjdFwiKTtcbiAgICAgICAgICAgIGNvbm4ubGluZS5jbGFzc0xpc3QuYWRkKGlzQ29ycmVjdCA/IFwiY29ycmVjdFwiIDogXCJpbmNvcnJlY3RcIik7XG4gICAgICAgICAgICBbY29ubi5mcm9tQm94LCBjb25uLnRvQm94XS5mb3JFYWNoKChib3gpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIWlzQ29ycmVjdCkge1xuICAgICAgICAgICAgICAgICAgICBib3guY2xhc3NMaXN0LnJlbW92ZShcIm1hdGNoLWNvcnJlY3RcIik7XG4gICAgICAgICAgICAgICAgICAgIGJveC5jbGFzc0xpc3QuYWRkKFwibWF0Y2gtaW5jb3JyZWN0XCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIWJveC5jbGFzc0xpc3QuY29udGFpbnMoXCJtYXRjaC1pbmNvcnJlY3RcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgYm94LmNsYXNzTGlzdC5hZGQoXCJtYXRjaC1jb3JyZWN0XCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5hbGxCb3hlcy5mb3JFYWNoKChib3gpID0+IHRoaXMudXBkYXRlQm94QXJpYUxhYmVsKGJveCkpO1xuXG4gICAgICAgIGNvbnN0IGJhZGdlQ2xhc3MgPVxuICAgICAgICAgICAgdGhpcy5zY29yZVBlcmNlbnQgPT09IDEwMCA/IFwiIG1hdGNoLXNjb3JlLXBlcmZlY3RcIiA6IFwiXCI7XG4gICAgICAgIHRoaXMuZmVlZGJhY2tEaXYuaGlkZGVuID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZmVlZGJhY2tEaXYuaW5uZXJIVE1MID0gYDxkaXYgY2xhc3M9XCJtYXRjaC1yZXN1bHRzXCI+PHNwYW4gY2xhc3M9XCJtYXRjaC1zY29yZS1iYWRnZSR7YmFkZ2VDbGFzc31cIj5TY29yZTogJHt0aGlzLnNjb3JlUGVyY2VudH0lPC9zcGFuPjxzcGFuIGNsYXNzPVwibWF0Y2gtY291bnRzXCI+JHt0aGlzLmNvcnJlY3RDb3VudH0gY29ycmVjdCAmbWlkZG90OyAke3RoaXMuaW5jb3JyZWN0Q291bnR9IGluY29ycmVjdCAmbWlkZG90OyAke3RoaXMubWlzc2luZ0NvdW50fSBtaXNzaW5nPC9zcGFuPjwvZGl2PmA7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHRoaXMuc2NvcmVQZXJjZW50ICE9PSAxMDAgJiZcbiAgICAgICAgICAgIHRoaXMuYm94RGF0YS5mZWVkYmFjayAmJlxuICAgICAgICAgICAgdGhpcy5ib3hEYXRhLmZlZWRiYWNrLnRyaW0oKVxuICAgICAgICApIHtcbiAgICAgICAgICAgIHRoaXMuZmVlZGJhY2tEaXYuaW5uZXJIVE1MICs9IGA8ZGl2IGNsYXNzPVwibWF0Y2hfZmVlZGJhY2sgZXhlcmNpc2UtY29udGVudFwiPjxzdHJvbmc+RmVlZGJhY2s6PC9zdHJvbmc+ICR7dGhpcy5ib3hEYXRhLmZlZWRiYWNrfTwvZGl2PmA7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5xdWV1ZU1hdGhKYXgodGhpcy5mZWVkYmFja0Rpdik7XG4gICAgfVxuXG4gICAgY3JlYXRlU3RhdGVtZW50KGNvbnRhaW5lcikge1xuICAgICAgICBjb25zdCBzdGF0ZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBzdGF0ZW1lbnQuY2xhc3NOYW1lID0gXCJzdGF0ZW1lbnRcIjtcbiAgICAgICAgc3RhdGVtZW50LmNsYXNzTGlzdC5hZGQoXCJtYXRjaF9xdWVzdGlvblwiKTtcbiAgICAgICAgc3RhdGVtZW50LmNsYXNzTGlzdC5hZGQoXCJleGVyY2lzZS1zdGF0ZW1lbnRcIik7XG4gICAgICAgIHN0YXRlbWVudC5pbm5lckhUTUwgPSB0aGlzLmJveERhdGEuc3RhdGVtZW50O1xuICAgICAgICBjb250YWluZXIuaW5zZXJ0QmVmb3JlKHN0YXRlbWVudCwgY29udGFpbmVyLmZpcnN0Q2hpbGQpO1xuICAgICAgICByZXR1cm4gc3RhdGVtZW50O1xuICAgIH1cblxuICAgIHJlc3RvcmVBbnN3ZXJzKGRhdGEpIHtcbiAgICAgICAgLy8gUmVjcmVhdGUgbGluZXNcbiAgICAgICAgaWYgKGRhdGEpIHtcbiAgICAgICAgICAgIHRoaXMuY29ubmVjdGlvbnMgPSBkYXRhLmFuc3dlci5jb25uZWN0aW9ucy5tYXAoKGNvbm4pID0+ICh7XG4gICAgICAgICAgICAgICAgZnJvbUJveDogdGhpcy5hbGxCb3hlcy5maW5kKFxuICAgICAgICAgICAgICAgICAgICAoYm94KSA9PiBib3guZGF0YXNldC5pZCA9PT0gY29ubi5mcm9tLFxuICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgdG9Cb3g6IHRoaXMuYWxsQm94ZXMuZmluZCgoYm94KSA9PiBib3guZGF0YXNldC5pZCA9PT0gY29ubi50byksXG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUNvbm5lY3Rpb25Nb2RlbCgpO1xuICAgICAgICAgICAgdGhpcy5jb3JyZWN0ID0gZGF0YS5jb3JyZWN0O1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY29ubmVjdGlvbnMuZm9yRWFjaCgoY29ubikgPT4ge1xuICAgICAgICAgICAgY29uc3QgZnJvbSA9IHRoaXMuZ2V0UmlnaHRCb3hDZW50ZXIoY29ubi5mcm9tQm94KTtcbiAgICAgICAgICAgIGNvbnN0IHRvID0gdGhpcy5nZXRMZWZ0Qm94Q2VudGVyKGNvbm4udG9Cb3gpO1xuICAgICAgICAgICAgY29uc3QgbGluZSA9IHRoaXMuY3JlYXRlTGluZUVsZW1lbnQoZnJvbSwgdG8pO1xuICAgICAgICAgICAgbGluZS5mcm9tQm94ID0gY29ubi5mcm9tQm94O1xuICAgICAgICAgICAgbGluZS50b0JveCA9IGNvbm4udG9Cb3g7XG4gICAgICAgICAgICB0aGlzLnN2Zy5hcHBlbmRDaGlsZChsaW5lKTtcbiAgICAgICAgICAgIGNvbm4ubGluZSA9IGxpbmU7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBjaGVja0xvY2FsU3RvcmFnZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuZ3JhZGVyYWN0aXZlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZGF0YSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMubG9jYWxTdG9yYWdlS2V5KCkpO1xuICAgICAgICBpZiAoZGF0YSkge1xuICAgICAgICAgICAgY29uc3QgcGFyc2VkRGF0YSA9IEpTT04ucGFyc2UoZGF0YSk7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgcGFyc2VkRGF0YS50aW1lc3RhbXAgJiZcbiAgICAgICAgICAgICAgICBwYXJzZWREYXRhLnRpbWVzdGFtcCA8IGVCb29rQ29uZmlnLnRlcm1TdGFydERhdGVcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKHRoaXMubG9jYWxTdG9yYWdlS2V5KCkpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuY29ubmVjdGlvbnMgPSBwYXJzZWREYXRhLmNvbm5lY3Rpb25zLm1hcCgoY29ubikgPT4gKHtcbiAgICAgICAgICAgICAgICBmcm9tQm94OiB0aGlzLmFsbEJveGVzLmZpbmQoXG4gICAgICAgICAgICAgICAgICAgIChib3gpID0+IGJveC5kYXRhc2V0LmlkID09PSBjb25uLmZyb20sXG4gICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICB0b0JveDogdGhpcy5hbGxCb3hlcy5maW5kKChib3gpID0+IGJveC5kYXRhc2V0LmlkID09PSBjb25uLnRvKSxcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlQ29ubmVjdGlvbk1vZGVsKCk7XG4gICAgICAgICAgICB0aGlzLmNvcnJlY3RDb3VudCA9IHBhcnNlZERhdGEuY29ycmVjdENvdW50O1xuICAgICAgICAgICAgdGhpcy5pbmNvcnJlY3RDb3VudCA9IHBhcnNlZERhdGEuaW5jb3JyZWN0Q291bnQ7XG4gICAgICAgICAgICB0aGlzLm1pc3NpbmdDb3VudCA9IHBhcnNlZERhdGEubWlzc2luZ0NvdW50O1xuICAgICAgICAgICAgdGhpcy5zY29yZVBlcmNlbnQgPSBwYXJzZWREYXRhLnNjb3JlO1xuICAgICAgICAgICAgdGhpcy5yZXN0b3JlQW5zd2VycygpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHNldExvY2FsU3RvcmFnZSgpIHtcbiAgICAgICAgY29uc3QgdGltZVN0YW1wID0gbmV3IERhdGUoKTtcbiAgICAgICAgY29uc3QgZGF0YSA9IHtcbiAgICAgICAgICAgIGNvbm5lY3Rpb25zOiB0aGlzLmNvbm5lY3Rpb25zLm1hcCgoY29ubikgPT4gKHtcbiAgICAgICAgICAgICAgICBmcm9tOiBjb25uLmZyb21Cb3guZGF0YXNldC5pZCxcbiAgICAgICAgICAgICAgICB0bzogY29ubi50b0JveC5kYXRhc2V0LmlkLFxuICAgICAgICAgICAgfSkpLFxuICAgICAgICAgICAgc2NvcmU6IHRoaXMuc2NvcmVQZXJjZW50LFxuICAgICAgICAgICAgY29ycmVjdENvdW50OiB0aGlzLmNvcnJlY3RDb3VudCxcbiAgICAgICAgICAgIGluY29ycmVjdENvdW50OiB0aGlzLmluY29ycmVjdENvdW50LFxuICAgICAgICAgICAgbWlzc2luZ0NvdW50OiB0aGlzLm1pc3NpbmdDb3VudCxcbiAgICAgICAgICAgIHRpbWVzdGFtcDogdGltZVN0YW1wLFxuICAgICAgICB9O1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0aGlzLmxvY2FsU3RvcmFnZUtleSgpLCBKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgfVxuXG4gICAgZGlzYWJsZUludGVyYWN0aW9uKCkge31cblxuICAgIGNyZWF0ZVdvcmtzcGFjZShjb250YWluZXIpIHtcbiAgICAgICAgY29uc3Qgd29ya3NwYWNlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgd29ya3NwYWNlLmNsYXNzTmFtZSA9IFwibWF0Y2hpbmctd29ya3NwYWNlXCI7XG5cbiAgICAgICAgY29uc3QgbGVmdENvbHVtbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGxlZnRDb2x1bW4uY2xhc3NOYW1lID0gXCJsZWZ0LWNvbHVtblwiO1xuICAgICAgICB0aGlzLmxlZnRDb2x1bW4gPSBsZWZ0Q29sdW1uO1xuICAgICAgICBjb25zdCBzdmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXG4gICAgICAgICAgICBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsXG4gICAgICAgICAgICBcInN2Z1wiLFxuICAgICAgICApO1xuICAgICAgICBzdmcuY2xhc3NMaXN0LmFkZChcImNvbm5lY3Rvci1zdmdcIik7XG4gICAgICAgIHRoaXMuc3ZnID0gc3ZnO1xuXG4gICAgICAgIGNvbnN0IHJpZ2h0Q29sdW1uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgcmlnaHRDb2x1bW4uY2xhc3NOYW1lID0gXCJyaWdodC1jb2x1bW5cIjtcbiAgICAgICAgdGhpcy5yaWdodENvbHVtbiA9IHJpZ2h0Q29sdW1uO1xuICAgICAgICB3b3Jrc3BhY2UuYXBwZW5kQ2hpbGQobGVmdENvbHVtbik7XG4gICAgICAgIHdvcmtzcGFjZS5hcHBlbmRDaGlsZChzdmcpO1xuICAgICAgICB3b3Jrc3BhY2UuYXBwZW5kQ2hpbGQocmlnaHRDb2x1bW4pO1xuXG4gICAgICAgIGNvbnRhaW5lci5pbnNlcnRCZWZvcmUod29ya3NwYWNlLCBjb250YWluZXIuZmlyc3RDaGlsZCk7XG4gICAgICAgIHJldHVybiB3b3Jrc3BhY2U7XG4gICAgfVxuXG4gICAgY3JlYXRlQ29ubkxpc3QoY29udGFpbmVyKSB7XG4gICAgICAgIGNvbnN0IGNvbm5MaXN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgY29ubkxpc3QuY2xhc3NOYW1lID0gXCJjb25uLWxpc3RcIjtcbiAgICAgICAgY29ubkxpc3QuaW5uZXJIVE1MID1cbiAgICAgICAgICAgICc8c3Ryb25nPkNvbm5lY3Rpb25zOjwvc3Ryb25nPjxkaXYgY2xhc3M9XCJjb25uLWVudHJ5IGNvbm4tZW1wdHlcIj5ObyBjb25uZWN0aW9ucyB5ZXQuIERyYWcgYmV0d2VlbiBib3hlcyB0byBjb25uZWN0IHRoZW0uPC9kaXY+JztcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGNvbm5MaXN0KTtcbiAgICAgICAgcmV0dXJuIGNvbm5MaXN0O1xuICAgIH1cblxuICAgIGNyZWF0ZUZlZWRiYWNrRGl2KGNvbnRhaW5lcikge1xuICAgICAgICBjb25zdCBmZWVkYmFja0RpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGZlZWRiYWNrRGl2LmNsYXNzTmFtZSA9IFwibWF0Y2gtZmVlZGJhY2tcIjtcbiAgICAgICAgZmVlZGJhY2tEaXYuaGlkZGVuID0gdHJ1ZTtcbiAgICAgICAgZmVlZGJhY2tEaXYuc2V0QXR0cmlidXRlKFwicm9sZVwiLCBcInN0YXR1c1wiKTtcbiAgICAgICAgZmVlZGJhY2tEaXYuc2V0QXR0cmlidXRlKFwiYXJpYS1saXZlXCIsIFwicG9saXRlXCIpO1xuICAgICAgICBmZWVkYmFja0Rpdi5zZXRBdHRyaWJ1dGUoXCJhcmlhLWF0b21pY1wiLCBcInRydWVcIik7XG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChmZWVkYmFja0Rpdik7XG4gICAgICAgIHJldHVybiBmZWVkYmFja0RpdjtcbiAgICB9XG5cbiAgICBjcmVhdGVBcmlhTGl2ZShjb250YWluZXIpIHtcbiAgICAgICAgY29uc3QgYXJpYUxpdmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBhcmlhTGl2ZS5jbGFzc05hbWUgPSBcImFyaWEtbGl2ZVwiO1xuICAgICAgICBhcmlhTGl2ZS5zZXRBdHRyaWJ1dGUoXCJhcmlhLWxpdmVcIiwgXCJwb2xpdGVcIik7XG4gICAgICAgIGFyaWFMaXZlLnNldEF0dHJpYnV0ZShcImFyaWEtYXRvbWljXCIsIFwidHJ1ZVwiKTtcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGFyaWFMaXZlKTtcbiAgICAgICAgcmV0dXJuIGFyaWFMaXZlO1xuICAgIH1cblxuICAgIGNyZWF0ZUNvbnRyb2xEaXYoY29udGFpbmVyKSB7XG4gICAgICAgIGNvbnN0IGNvbnRyb2xEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBjb250cm9sRGl2LmNsYXNzTmFtZSA9IFwiY29udHJvbC1kaXZcIjtcbiAgICAgICAgY29uc3QgZ3JhZGVCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgICAgICBncmFkZUJ0bi5jbGFzc05hbWUgPSBcImdyYWRlLWJ1dHRvblwiO1xuICAgICAgICBncmFkZUJ0bi50ZXh0Q29udGVudCA9IFwiQ2hlY2sgTWVcIjtcbiAgICAgICAgZ3JhZGVCdG4uY2xhc3NMaXN0LmFkZChcImJ0blwiLCBcImJ0bi1zdWNjZXNzXCIpO1xuICAgICAgICBjb25zdCByZXNldEJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICAgIHJlc2V0QnRuLmNsYXNzTmFtZSA9IFwicmVzZXQtYnV0dG9uXCI7XG4gICAgICAgIHJlc2V0QnRuLnRleHRDb250ZW50ID0gXCJSZXNldFwiO1xuICAgICAgICByZXNldEJ0bi5jbGFzc0xpc3QuYWRkKFwiYnRuXCIsIFwiYnRuLWRlZmF1bHRcIik7XG4gICAgICAgIC8vIGFkZCBIZWxwIGJ1dHRvblxuICAgICAgICBjb25zdCBoZWxwQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICAgICAgaGVscEJ0bi5jbGFzc05hbWUgPSBcImhlbHAtYnV0dG9uXCI7XG4gICAgICAgIGhlbHBCdG4udGV4dENvbnRlbnQgPSBcIj9cIjsgLy8gY2hhbmdlZCBmcm9tICdIZWxwJ1xuICAgICAgICBoZWxwQnRuLnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIiwgXCJIZWxwXCIpOyAvLyBhY2Nlc3NpYmxlIGxhYmVsXG4gICAgICAgIGNvbnRyb2xEaXYuYXBwZW5kQ2hpbGQoZ3JhZGVCdG4pO1xuICAgICAgICBjb250cm9sRGl2LmFwcGVuZENoaWxkKHJlc2V0QnRuKTtcbiAgICAgICAgY29udHJvbERpdi5hcHBlbmRDaGlsZChoZWxwQnRuKTtcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGNvbnRyb2xEaXYpO1xuXG4gICAgICAgIC8vIGV2ZW50c1xuICAgICAgICBncmFkZUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy5ncmFkZUNvbm5lY3Rpb25zKCkpO1xuICAgICAgICByZXNldEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy5yZXNldENvbm5lY3Rpb25zKCkpO1xuICAgICAgICBoZWxwQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB0aGlzLnNob3dIZWxwKCkpO1xuICAgICAgICB0aGlzLmdyYWRlQnRuID0gZ3JhZGVCdG47XG4gICAgICAgIHRoaXMucmVzZXRCdG4gPSByZXNldEJ0bjtcbiAgICAgICAgdGhpcy5oZWxwQnRuID0gaGVscEJ0bjtcbiAgICAgICAgcmV0dXJuIGNvbnRyb2xEaXY7XG4gICAgfVxuXG4gICAgY3JlYXRlSGVscE1vZGFsKCkge1xuICAgICAgICB0aGlzLmhlbHBNb2RhbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaWFsb2dcIik7XG4gICAgICAgIHRoaXMuaGVscE1vZGFsLmNsYXNzTmFtZSA9IFwiaGVscC1tb2RhbFwiO1xuICAgICAgICB0aGlzLmhlbHBNb2RhbC5zZXRBdHRyaWJ1dGUoXCJhcmlhLWxpdmVcIiwgXCJwb2xpdGVcIik7XG4gICAgICAgIHRoaXMuaGVscE1vZGFsLnNldEF0dHJpYnV0ZShcImFyaWEtYXRvbWljXCIsIFwidHJ1ZVwiKTtcbiAgICAgICAgY29uc3QgdGl0bGVJZCA9IHRoaXMuZGl2aWQgKyBcIi1oZWxwLXRpdGxlXCI7XG4gICAgICAgIGNvbnN0IHRleHQgPSBgPHA+Q2xpY2sgYW5kIGRyYWcgYmV0d2VlbiBib3hlcyB0byBjcmVhdGUgY29ubmVjdGlvbnMuPC9wPlxuICAgICAgICA8cD5Vc2UgdGhlIHRhYiBrZXkgdG8gbmF2aWdhdGUgdG8gYSBib3ggYW5kIHByZXNzIEVudGVyIHRvIHNlbGVjdCBpdC4gIEZvY3VzIHRoZW4ganVtcHMgdG8gdGhlIG90aGVyIGNvbHVtbjsgdGFiIHRvIHRoZSBib3ggeW91IHdhbnQgdG8gY29ubmVjdCBhbmQgcHJlc3MgRW50ZXIuICBQcmVzcyBFc2NhcGUgdG8gY2FuY2VsIGEgc2VsZWN0aW9uLjwvcD5cbiAgICAgICAgPHA+Q2xpY2sgb24gYSBjb25uZWN0aW9uIGxpbmUgb3IgdXNlIHRoZSB0YWIga2V5IHRvIHNlbGVjdCBpdC4gUHJlc3MgRW50ZXIsIERlbGV0ZSwgb3IgQmFja3NwYWNlIHRvIHJlbW92ZSBhIHNlbGVjdGVkIGxpbmUuPC9wPlxuICAgICAgICA8cD5DbGljayB0aGUgXCJDaGVjayBNZVwiIGJ1dHRvbiB0byBjaGVjayB5b3VyIGNvbm5lY3Rpb25zLCBhbmQgc2F2ZSB5b3VyIHdvcmsuPC9wPlxuICAgICAgICA8cD5DbGljayB0aGUgXCJSZXNldFwiIGJ1dHRvbiB0byBjbGVhciBhbGwgY29ubmVjdGlvbnMuPC9wPmA7XG5cbiAgICAgICAgdGhpcy5oZWxwTW9kYWwuc2V0QXR0cmlidXRlKFwiYXJpYS1sYWJlbGxlZGJ5XCIsIHRpdGxlSWQpO1xuICAgICAgICB0aGlzLmhlbHBNb2RhbC5pbm5lckhUTUwgPVxuICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJoZWxwLW1vZGFsLWNvbnRlbnRcIj4nICtcbiAgICAgICAgICAgICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImhlbHAtY2xvc2VcIiBhcmlhLWxhYmVsPVwiQ2xvc2UgbWF0Y2hpbmcgaGVscFwiPiZ0aW1lczs8L2J1dHRvbj4nICtcbiAgICAgICAgICAgICc8aDIgaWQ9XCInICtcbiAgICAgICAgICAgIHRpdGxlSWQgK1xuICAgICAgICAgICAgJ1wiPk1hdGNoaW5nIGhlbHA8L2gyPicgK1xuICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJoZWxwLXRleHRcIj4nICtcbiAgICAgICAgICAgIHRleHQgK1xuICAgICAgICAgICAgXCI8L2Rpdj48L2Rpdj5cIjtcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYuYXBwZW5kQ2hpbGQodGhpcy5oZWxwTW9kYWwpO1xuICAgICAgICB0aGlzLmhlbHBNb2RhbFxuICAgICAgICAgICAgLnF1ZXJ5U2VsZWN0b3IoXCIuaGVscC1jbG9zZVwiKVxuICAgICAgICAgICAgLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB0aGlzLmhpZGVIZWxwKCkpO1xuICAgICAgICB0aGlzLmhlbHBNb2RhbC5hZGRFdmVudExpc3RlbmVyKFwiY2FuY2VsXCIsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMuaGlkZUhlbHAoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuaGVscE1vZGFsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGlmIChldmVudC50YXJnZXQgPT09IHRoaXMuaGVscE1vZGFsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oaWRlSGVscCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5oZWxwTW9kYWwuYWRkRXZlbnRMaXN0ZW5lcihcImNsb3NlXCIsICgpID0+IHRoaXMuaGVscEJ0bj8uZm9jdXMoKSk7XG4gICAgfVxuXG4gICAgc2hvd0hlbHAoKSB7XG4gICAgICAgIGlmICghdGhpcy5oZWxwTW9kYWwub3Blbikge1xuICAgICAgICAgICAgdGhpcy5oZWxwTW9kYWwuc2hvd01vZGFsKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBoaWRlSGVscCgpIHtcbiAgICAgICAgaWYgKHRoaXMuaGVscE1vZGFsLm9wZW4pIHtcbiAgICAgICAgICAgIHRoaXMuaGVscE1vZGFsLmNsb3NlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBVdGlsaXR5IGZ1bmN0aW9uc1xuICAgIHNodWZmbGUoYXJyYXkpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IGFycmF5Lmxlbmd0aCAtIDE7IGkgPiAwOyBpLS0pIHtcbiAgICAgICAgICAgIGNvbnN0IGogPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoaSArIDEpKTtcbiAgICAgICAgICAgIFthcnJheVtpXSwgYXJyYXlbal1dID0gW2FycmF5W2pdLCBhcnJheVtpXV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFycmF5O1xuICAgIH1cblxuICAgIHJlbmRlckJveGVzKCkge1xuICAgICAgICB0aGlzLmJveERhdGEubGVmdC5mb3JFYWNoKCh7IGlkLCBsYWJlbCB9KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBib3ggPSB0aGlzLmNyZWF0ZUJveChpZCwgbGFiZWwsIFwiZHJhZ1wiKTtcbiAgICAgICAgICAgIHRoaXMubGVmdENvbHVtbi5hcHBlbmRDaGlsZChib3gpO1xuICAgICAgICAgICAgdGhpcy5hbGxCb3hlcy5wdXNoKGJveCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuYm94RGF0YS5yaWdodC5mb3JFYWNoKCh7IGlkLCBsYWJlbCB9KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBib3ggPSB0aGlzLmNyZWF0ZUJveChpZCwgbGFiZWwsIFwiZHJvcFwiKTtcbiAgICAgICAgICAgIHRoaXMucmlnaHRDb2x1bW4uYXBwZW5kQ2hpbGQoYm94KTtcbiAgICAgICAgICAgIHRoaXMuYWxsQm94ZXMucHVzaChib3gpO1xuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBpbWdzID0gQXJyYXkuZnJvbSh0aGlzLndvcmtzcGFjZS5xdWVyeVNlbGVjdG9yQWxsKFwiaW1nXCIpKTtcbiAgICAgICAgaWYgKGltZ3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLmJveGVzUmVuZGVyZWRSZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gV2FpdCBmb3IgYWxsIGltYWdlcyB0byBsb2FkIGJlZm9yZSByZXNvbHZpbmcgdGhlIHByb21pc2VcbiAgICAgICAgY29uc3QgaW1nUHJvbWlzZXMgPSBpbWdzLm1hcCgoaW1nKSA9PiB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGltZy5kZWNvZGUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBpbWcuZGVjb2RlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaW1nLmNvbXBsZXRlICYmIGltZy5uYXR1cmFsV2lkdGggIT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgICAgICBpbWcuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgKCkgPT4gcmVzb2x2ZSgpKTtcbiAgICAgICAgICAgICAgICBpbWcuYWRkRXZlbnRMaXN0ZW5lcihcImVycm9yXCIsICgpID0+IHJlc29sdmUoKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgUHJvbWlzZS5hbGwoaW1nUHJvbWlzZXMpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5ib3hlc1JlbmRlcmVkUmVzb2x2ZSgpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBjcmVhdGVCb3goaWQsIGxhYmVsLCByb2xlKSB7XG4gICAgICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGRpdi5jbGFzc05hbWUgPSBcImJveFwiO1xuICAgICAgICBkaXYuZGF0YXNldC5pZCA9IGlkO1xuICAgICAgICBkaXYuZGF0YXNldC5yb2xlID0gcm9sZTtcbiAgICAgICAgZGl2LmlubmVySFRNTCA9IGxhYmVsO1xuICAgICAgICBkaXYudGFiSW5kZXggPSAwO1xuICAgICAgICBkaXYuc2V0QXR0cmlidXRlKFwicm9sZVwiLCBcImJ1dHRvblwiKTtcbiAgICAgICAgdGhpcy51cGRhdGVCb3hBcmlhTGFiZWwoZGl2KTtcbiAgICAgICAgcmV0dXJuIGRpdjtcbiAgICB9XG5cbiAgICBnZXRCb3hMYWJlbChib3gpIHtcbiAgICAgICAgcmV0dXJuIGdldEFjY2Vzc2libGVFbGVtZW50VGV4dChib3gpIHx8IFwiYm94XCI7XG4gICAgfVxuXG4gICAgdXBkYXRlQm94QXJpYUxhYmVsKGJveCkge1xuICAgICAgICBjb25zdCBsYWJlbFByZWZpeCA9XG4gICAgICAgICAgICBib3guZGF0YXNldC5yb2xlID09PSBcImRyYWdcIiA/IFwiRHJhZ2dhYmxlXCIgOiBcIkRyb3BwYWJsZVwiO1xuICAgICAgICBjb25zdCBncmFkaW5nU3RhdGUgPSBib3guY2xhc3NMaXN0LmNvbnRhaW5zKFwibWF0Y2gtaW5jb3JyZWN0XCIpXG4gICAgICAgICAgICA/IFwiLCBpbmNvcnJlY3RcIlxuICAgICAgICAgICAgOiBib3guY2xhc3NMaXN0LmNvbnRhaW5zKFwibWF0Y2gtY29ycmVjdFwiKVxuICAgICAgICAgICAgICA/IFwiLCBjb3JyZWN0XCJcbiAgICAgICAgICAgICAgOiBcIlwiO1xuICAgICAgICBib3guc2V0QXR0cmlidXRlKFxuICAgICAgICAgICAgXCJhcmlhLWxhYmVsXCIsXG4gICAgICAgICAgICBsYWJlbFByZWZpeCArIFwiOiBcIiArIHRoaXMuZ2V0Qm94TGFiZWwoYm94KSArIGdyYWRpbmdTdGF0ZSxcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICB1cGRhdGVCb3hBcmlhTGFiZWxzKCkge1xuICAgICAgICBmb3IgKGNvbnN0IGJveCBvZiB0aGlzLmFsbEJveGVzIHx8IFtdKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUJveEFyaWFMYWJlbChib3gpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3QgY29ubmVjdGlvbiBvZiB0aGlzLmNvbm5lY3Rpb25zIHx8IFtdKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUxpbmVBcmlhTGFiZWwoY29ubmVjdGlvbi5saW5lKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGRpc2FibGVCb3hNYXRoVGFiU3RvcHMocm9vdCA9IHRoaXMuY29udGFpbmVyRGl2KSB7XG4gICAgICAgIGRpc2FibGVNYXRoSmF4VGFiU3RvcHMocm9vdCwgW1wiLmJveFwiXSk7XG4gICAgfVxuXG4gICAgb2JzZXJ2ZU1hdGhKYXhTcGVlY2goKSB7XG4gICAgICAgIGlmICh0eXBlb2YgTXV0YXRpb25PYnNlcnZlciA9PT0gXCJ1bmRlZmluZWRcIikgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMubWF0aEpheFNwZWVjaE9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKG11dGF0aW9ucykgPT4ge1xuICAgICAgICAgICAgY29uc3QgY2hhbmdlZEJveGVzID0gbmV3IFNldCgpO1xuICAgICAgICAgICAgZm9yIChjb25zdCBtdXRhdGlvbiBvZiBtdXRhdGlvbnMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBib3ggPSBtdXRhdGlvbi50YXJnZXQuY2xvc2VzdD8uKFwiLmJveFwiKTtcbiAgICAgICAgICAgICAgICBpZiAoYm94ICYmIHRoaXMuYWxsQm94ZXMuaW5jbHVkZXMoYm94KSkge1xuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VkQm94ZXMuYWRkKGJveCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNoYW5nZWRCb3hlcy5zaXplID09PSAwKSByZXR1cm47XG5cbiAgICAgICAgICAgIGNoYW5nZWRCb3hlcy5mb3JFYWNoKChib3gpID0+IHRoaXMudXBkYXRlQm94QXJpYUxhYmVsKGJveCkpO1xuICAgICAgICAgICAgY29uc3QgY2hhbmdlZENvbm5lY3Rpb25zID0gdGhpcy5jb25uZWN0aW9ucy5maWx0ZXIoXG4gICAgICAgICAgICAgICAgKHsgZnJvbUJveCwgdG9Cb3ggfSkgPT5cbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlZEJveGVzLmhhcyhmcm9tQm94KSB8fCBjaGFuZ2VkQm94ZXMuaGFzKHRvQm94KSxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjaGFuZ2VkQ29ubmVjdGlvbnMuZm9yRWFjaCgoeyBsaW5lIH0pID0+XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVMaW5lQXJpYUxhYmVsKGxpbmUpLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmIChjaGFuZ2VkQ29ubmVjdGlvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyQ29ubmVjdGlvbkxpc3QoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMubWF0aEpheFNwZWVjaE9ic2VydmVyLm9ic2VydmUodGhpcy5jb250YWluZXJEaXYsIHtcbiAgICAgICAgICAgIHN1YnRyZWU6IHRydWUsXG4gICAgICAgICAgICBhdHRyaWJ1dGVzOiB0cnVlLFxuICAgICAgICAgICAgYXR0cmlidXRlRmlsdGVyOiBbXCJkYXRhLXNlbWFudGljLXNwZWVjaC1ub25lXCJdLFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBnZXRDb2x1bW5Cb3hlcyhyb2xlKSB7XG4gICAgICAgIGNvbnN0IGNvbHVtbiA9IHJvbGUgPT09IFwiZHJhZ1wiID8gdGhpcy5sZWZ0Q29sdW1uIDogdGhpcy5yaWdodENvbHVtbjtcbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20oY29sdW1uLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuYm94XCIpKS5maWx0ZXIoKGJveCkgPT5cbiAgICAgICAgICAgIHRoaXMuYWxsQm94ZXMuaW5jbHVkZXMoYm94KSxcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBnZXRUYWJiYWJsZUJveGVzKCkge1xuICAgICAgICBpZiAoIXRoaXMuc2VsZWN0ZWRCb3gpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmFsbEJveGVzO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmdldENvbHVtbkJveGVzKFxuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEJveC5kYXRhc2V0LnJvbGUgPT09IFwiZHJhZ1wiID8gXCJkcm9wXCIgOiBcImRyYWdcIixcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICB1cGRhdGVCb3hUYWJTdG9wcygpIHtcbiAgICAgICAgY29uc3QgdGFiYmFibGVCb3hlcyA9IG5ldyBTZXQodGhpcy5nZXRUYWJiYWJsZUJveGVzKCkpO1xuICAgICAgICBmb3IgKGNvbnN0IGJveCBvZiB0aGlzLmFsbEJveGVzKSB7XG4gICAgICAgICAgICBib3gudGFiSW5kZXggPSB0YWJiYWJsZUJveGVzLmhhcyhib3gpID8gMCA6IC0xO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0U2VsZWN0ZWRCb3goYm94KSB7XG4gICAgICAgIHRoaXMuc2V0U2VsZWN0ZWRMaW5lKG51bGwsIGZhbHNlKTtcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRCb3gpIHtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRCb3guY2xhc3NMaXN0LnJlbW92ZShcInNlbGVjdGVkXCIpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2VsZWN0ZWRCb3ggPSBib3g7XG4gICAgICAgIHRoaXMuYWN0aXZlQm94Um9sZSA9IGJveCA/IGJveC5kYXRhc2V0LnJvbGUgOiBudWxsO1xuICAgICAgICBpZiAoYm94KSB7XG4gICAgICAgICAgICBib3guY2xhc3NMaXN0LmFkZChcInNlbGVjdGVkXCIpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudXBkYXRlQm94VGFiU3RvcHMoKTtcbiAgICB9XG5cbiAgICBhY3RpdmF0ZUJveChib3gpIHtcbiAgICAgICAgaWYgKCF0aGlzLnNlbGVjdGVkQm94KSB7XG4gICAgICAgICAgICB0aGlzLnNldFNlbGVjdGVkQm94KGJveCk7XG4gICAgICAgICAgICBjb25zdCBmaXJzdE9wcG9zaXRlQm94ID0gdGhpcy5nZXRUYWJiYWJsZUJveGVzKClbMF07XG4gICAgICAgICAgICBmaXJzdE9wcG9zaXRlQm94Py5mb2N1cygpO1xuICAgICAgICAgICAgaWYgKHRoaXMuYXJpYUxpdmUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFyaWFMaXZlLnRleHRDb250ZW50ID0gYFNlbGVjdGVkICR7dGhpcy5nZXRCb3hMYWJlbChib3gpfS4gVGFiIHRvIGEgYm94IGluIHRoZSBvdGhlciBjb2x1bW4gYW5kIHByZXNzIEVudGVyIHRvIGNvbm5lY3QsIG9yIHByZXNzIEVzY2FwZSB0byBjYW5jZWwuYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChib3ggIT09IHRoaXMuc2VsZWN0ZWRCb3gpIHtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlUGVybWFuZW50TGluZSh0aGlzLnNlbGVjdGVkQm94LCBib3gpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2V0U2VsZWN0ZWRCb3gobnVsbCk7XG4gICAgICAgIGJveC5mb2N1cygpO1xuICAgIH1cblxuICAgIHNldFNlbGVjdGVkTGluZShsaW5lLCBhbm5vdW5jZSA9IHRydWUpIHtcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRMaW5lICYmIHRoaXMuc2VsZWN0ZWRMaW5lICE9PSBsaW5lKSB7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkTGluZS5jbGFzc0xpc3QucmVtb3ZlKFwic2VsZWN0ZWRcIik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZWxlY3RlZExpbmUgPSBsaW5lO1xuICAgICAgICBpZiAobGluZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRCb3gpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkQm94LmNsYXNzTGlzdC5yZW1vdmUoXCJzZWxlY3RlZFwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkQm94ID0gbnVsbDtcbiAgICAgICAgICAgICAgICB0aGlzLmFjdGl2ZUJveFJvbGUgPSBudWxsO1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlQm94VGFiU3RvcHMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxpbmUuY2xhc3NMaXN0LmFkZChcInNlbGVjdGVkXCIpO1xuICAgICAgICAgICAgaWYgKGFubm91bmNlICYmIHRoaXMuYXJpYUxpdmUpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBmcm9tTGFiZWwgPSBsaW5lLmZyb21Cb3hcbiAgICAgICAgICAgICAgICAgICAgPyB0aGlzLmdldEJveExhYmVsKGxpbmUuZnJvbUJveClcbiAgICAgICAgICAgICAgICAgICAgOiBcIm9uZSBib3hcIjtcbiAgICAgICAgICAgICAgICBjb25zdCB0b0xhYmVsID0gbGluZS50b0JveFxuICAgICAgICAgICAgICAgICAgICA/IHRoaXMuZ2V0Qm94TGFiZWwobGluZS50b0JveClcbiAgICAgICAgICAgICAgICAgICAgOiBcImFub3RoZXIgYm94XCI7XG4gICAgICAgICAgICAgICAgdGhpcy5hcmlhTGl2ZS50ZXh0Q29udGVudCA9IGBTZWxlY3RlZCBjb25uZWN0aW9uIGZyb20gJHtmcm9tTGFiZWx9IHRvICR7dG9MYWJlbH0uIFByZXNzIEVudGVyIHRvIGRlbGV0ZSBpdC5gO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2FuY2VsU2VsZWN0ZWRCb3goKSB7XG4gICAgICAgIGNvbnN0IHNlbGVjdGVkID0gdGhpcy5zZWxlY3RlZEJveDtcbiAgICAgICAgaWYgKCFzZWxlY3RlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2V0U2VsZWN0ZWRCb3gobnVsbCk7XG4gICAgICAgIHNlbGVjdGVkLmZvY3VzKCk7XG4gICAgICAgIGlmICh0aGlzLmFyaWFMaXZlKSB7XG4gICAgICAgICAgICB0aGlzLmFyaWFMaXZlLnRleHRDb250ZW50ID0gXCJTZWxlY3Rpb24gY2FuY2VsbGVkLlwiO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbW92ZUJveEZvY3VzKGJveCwgbW92ZURvd24pIHtcbiAgICAgICAgY29uc3QgYm94T3JkZXIgPSB0aGlzLnNlbGVjdGVkQm94XG4gICAgICAgICAgICA/IHRoaXMuZ2V0VGFiYmFibGVCb3hlcygpXG4gICAgICAgICAgICA6IHRoaXMuZ2V0Q29sdW1uQm94ZXMoYm94LmRhdGFzZXQucm9sZSk7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRJbmRleCA9IGJveE9yZGVyLmluZGV4T2YoYm94KTtcbiAgICAgICAgaWYgKGN1cnJlbnRJbmRleCA9PT0gLTEpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB0YXJnZXRJbmRleCA9IE1hdGgubWF4KFxuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIE1hdGgubWluKGN1cnJlbnRJbmRleCArIChtb3ZlRG93biA/IDEgOiAtMSksIGJveE9yZGVyLmxlbmd0aCAtIDEpLFxuICAgICAgICApO1xuICAgICAgICBib3hPcmRlclt0YXJnZXRJbmRleF0/LmZvY3VzKCk7XG4gICAgfVxuXG4gICAgbW92ZUJveEZvY3VzQWNyb3NzQ29sdW1ucyhyaWdodENvbHVtbikge1xuICAgICAgICBjb25zdCB0YXJnZXRSb2xlID0gcmlnaHRDb2x1bW4gPyBcImRyb3BcIiA6IFwiZHJhZ1wiO1xuICAgICAgICB0aGlzLmdldENvbHVtbkJveGVzKHRhcmdldFJvbGUpWzBdPy5mb2N1cygpO1xuICAgIH1cblxuICAgIG1vdmVUYWJGb2N1cyhib3gsIG1vdmVCYWNrd2FyZCkge1xuICAgICAgICBjb25zdCBib3hPcmRlciA9IHRoaXMuZ2V0VGFiYmFibGVCb3hlcygpO1xuICAgICAgICBjb25zdCBjdXJyZW50SW5kZXggPSBib3hPcmRlci5pbmRleE9mKGJveCk7XG4gICAgICAgIGlmIChjdXJyZW50SW5kZXggPT09IC0xIHx8IGJveE9yZGVyLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG9mZnNldCA9IG1vdmVCYWNrd2FyZCA/IC0xIDogMTtcbiAgICAgICAgY29uc3QgdGFyZ2V0SW5kZXggPVxuICAgICAgICAgICAgKGN1cnJlbnRJbmRleCArIG9mZnNldCArIGJveE9yZGVyLmxlbmd0aCkgJSBib3hPcmRlci5sZW5ndGg7XG4gICAgICAgIGJveE9yZGVyW3RhcmdldEluZGV4XT8uZm9jdXMoKTtcbiAgICB9XG4gICAgZ2V0Q2VudGVyKGVsKSB7XG4gICAgICAgIGNvbnN0IGVsUmVjdCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICBjb25zdCBjb250YWluZXJSZWN0ID0gdGhpcy53b3Jrc3BhY2UuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB4OiBlbFJlY3QubGVmdCAtIGNvbnRhaW5lclJlY3QubGVmdCArIGVsUmVjdC53aWR0aCAvIDIsXG4gICAgICAgICAgICB5OiBlbFJlY3QudG9wIC0gY29udGFpbmVyUmVjdC50b3AgKyBlbFJlY3QuaGVpZ2h0IC8gMixcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBnZXRSaWdodEJveENlbnRlcihlbCkge1xuICAgICAgICBjb25zdCBlbFJlY3QgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgY29uc3QgY29udGFpbmVyUmVjdCA9IHRoaXMud29ya3NwYWNlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeDogZWxSZWN0LmxlZnQgLSBjb250YWluZXJSZWN0LmxlZnQgKyBlbFJlY3Qud2lkdGgsXG4gICAgICAgICAgICB5OiBlbFJlY3QudG9wIC0gY29udGFpbmVyUmVjdC50b3AgKyBlbFJlY3QuaGVpZ2h0IC8gMixcbiAgICAgICAgfTtcbiAgICB9XG4gICAgZ2V0TGVmdEJveENlbnRlcihlbCkge1xuICAgICAgICBjb25zdCBlbFJlY3QgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgY29uc3QgY29udGFpbmVyUmVjdCA9IHRoaXMud29ya3NwYWNlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeDogZWxSZWN0LmxlZnQgLSBjb250YWluZXJSZWN0LmxlZnQsXG4gICAgICAgICAgICB5OiBlbFJlY3QudG9wIC0gY29udGFpbmVyUmVjdC50b3AgKyBlbFJlY3QuaGVpZ2h0IC8gMixcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBUaGUgcG9ydCAod2hlcmUgbGluZXMgYXR0YWNoKSBpcyBvbiB0aGUgaW5uZXIgZWRnZSBvZiB0aGUgYm94OiB0aGVcbiAgICAvLyByaWdodCBlZGdlIGZvciBsZWZ0LWNvbHVtbiAoZHJhZykgYm94ZXMsIHRoZSBsZWZ0IGVkZ2UgZm9yXG4gICAgLy8gcmlnaHQtY29sdW1uIChkcm9wKSBib3hlcy5cbiAgICBnZXRQb3J0Q2VudGVyKGVsKSB7XG4gICAgICAgIHJldHVybiBlbC5kYXRhc2V0LnJvbGUgPT09IFwiZHJvcFwiXG4gICAgICAgICAgICA/IHRoaXMuZ2V0TGVmdEJveENlbnRlcihlbClcbiAgICAgICAgICAgIDogdGhpcy5nZXRSaWdodEJveENlbnRlcihlbCk7XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBDb25uZWN0aW9uIGxpbmVzIGFyZSBkcmF3biBhcyBnZW50bGUgUy1jdXJ2ZXMgKGN1YmljIGJlemllcnMpIHdob3NlXG4gICAgICogY29udHJvbCBwb2ludHMgcHVsbCBob3Jpem9udGFsbHkgb3V0IG9mIGVhY2ggcG9ydCwgc28gbGluZXMgbGVhdmUgYW5kXG4gICAgICogZW50ZXIgYm94ZXMgcGVycGVuZGljdWxhciB0byB0aGUgY29sdW1uIGVkZ2VzLlxuICAgICAqL1xuICAgIHNldExpbmVFbmRwb2ludHMobGluZSwgZnJvbSwgdG8pIHtcbiAgICAgICAgY29uc3QgcHVsbCA9IE1hdGgubWF4KDMwLCBNYXRoLmFicyh0by54IC0gZnJvbS54KSAvIDIpO1xuICAgICAgICAvLyBQdWxsIHRoZSBjb250cm9sIHBvaW50cyB0b3dhcmQgdGhlIG90aGVyIGVuZHBvaW50IHNvIHRoZSBjdXJ2ZVxuICAgICAgICAvLyBsZWF2ZXMgdGhlIHBvcnQgaGVhZGluZyBpbiB0aGUgcmlnaHQgZGlyZWN0aW9uOyBzaWduIGhhbmRsZXMgYVxuICAgICAgICAvLyB0ZW1wIGxpbmUgZHJhZ2dlZCBsZWZ0d2FyZCBmcm9tIGEgcmlnaHQtY29sdW1uIHBvcnQuXG4gICAgICAgIGNvbnN0IHNpZ24gPSB0by54ID49IGZyb20ueCA/IDEgOiAtMTtcbiAgICAgICAgbGluZS5zZXRBdHRyaWJ1dGUoXG4gICAgICAgICAgICBcImRcIixcbiAgICAgICAgICAgIGBNICR7ZnJvbS54fSAke2Zyb20ueX0gQyAke2Zyb20ueCArIHNpZ24gKiBwdWxsfSAke2Zyb20ueX0sICR7dG8ueCAtIHNpZ24gKiBwdWxsfSAke3RvLnl9LCAke3RvLnh9ICR7dG8ueX1gLFxuICAgICAgICApO1xuICAgIH1cblxuICAgIGNyZWF0ZUxpbmVFbGVtZW50KGZyb20sIHRvKSB7XG4gICAgICAgIGNvbnN0IGxpbmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXG4gICAgICAgICAgICBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsXG4gICAgICAgICAgICBcInBhdGhcIixcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5zZXRMaW5lRW5kcG9pbnRzKGxpbmUsIGZyb20sIHRvKTtcbiAgICAgICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImxpbmVcIik7XG4gICAgICAgIGxpbmUuc2V0QXR0cmlidXRlKFwidGFiaW5kZXhcIiwgXCIwXCIpOyAvLyBNYWtlIHRoZSBsaW5lIGZvY3VzYWJsZVxuICAgICAgICBsaW5lLnNldEF0dHJpYnV0ZShcImZvY3VzYWJsZVwiLCBcInRydWVcIik7IC8vIE1ha2UgdGhlIGxpbmUgZm9jdXNhYmxlXG4gICAgICAgIGxpbmUuc2V0QXR0cmlidXRlKFwicm9sZVwiLCBcImJ1dHRvblwiKTsgLy8gQWRkIEFSSUEgcm9sZSBmb3IgYWNjZXNzaWJpbGl0eVxuICAgICAgICBsaW5lLnNldEF0dHJpYnV0ZShcbiAgICAgICAgICAgIFwiYXJpYS1sYWJlbFwiLFxuICAgICAgICAgICAgXCJDb25uZWN0aW9uIGxpbmUuIFByZXNzIEVudGVyLCBEZWxldGUsIG9yIEJhY2tzcGFjZSB0byByZW1vdmUuXCIsXG4gICAgICAgICk7IC8vIEFkZCBBUklBIGxhYmVsXG5cbiAgICAgICAgbGluZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGxpbmUuZm9jdXMoKTtcbiAgICAgICAgICAgIHRoaXMuc2V0U2VsZWN0ZWRMaW5lKGxpbmUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBsaW5lLmFkZEV2ZW50TGlzdGVuZXIoXCJmb2N1c1wiLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldFNlbGVjdGVkTGluZShsaW5lKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbGluZS5hZGRFdmVudExpc3RlbmVyKFwiYmx1clwiLCAoKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5zZWxlY3RlZExpbmUgPT09IGxpbmUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFNlbGVjdGVkTGluZShudWxsLCBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGxpbmUuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgKGUpID0+IHtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBlLmtleSA9PT0gXCJFbnRlclwiIHx8XG4gICAgICAgICAgICAgICAgZS5rZXkgPT09IFwiRGVsZXRlXCIgfHxcbiAgICAgICAgICAgICAgICBlLmtleSA9PT0gXCJCYWNrc3BhY2VcIlxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlTGluZShsaW5lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGxpbmU7XG4gICAgfVxuXG4gICAgdXBkYXRlTGluZUFyaWFMYWJlbChsaW5lKSB7XG4gICAgICAgIGlmICghbGluZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGZyb21MYWJlbCA9IGxpbmUuZnJvbUJveFxuICAgICAgICAgICAgPyB0aGlzLmdldEJveExhYmVsKGxpbmUuZnJvbUJveClcbiAgICAgICAgICAgIDogXCJvbmUgYm94XCI7XG4gICAgICAgIGNvbnN0IHRvTGFiZWwgPSBsaW5lLnRvQm94XG4gICAgICAgICAgICA/IHRoaXMuZ2V0Qm94TGFiZWwobGluZS50b0JveClcbiAgICAgICAgICAgIDogXCJhbm90aGVyIGJveFwiO1xuICAgICAgICBsaW5lLnNldEF0dHJpYnV0ZShcbiAgICAgICAgICAgIFwiYXJpYS1sYWJlbFwiLFxuICAgICAgICAgICAgXCJDb25uZWN0aW9uIGZyb20gXCIgK1xuICAgICAgICAgICAgICAgIGZyb21MYWJlbCArXG4gICAgICAgICAgICAgICAgXCIgdG8gXCIgK1xuICAgICAgICAgICAgICAgIHRvTGFiZWwgK1xuICAgICAgICAgICAgICAgIFwiLiBQcmVzcyBFbnRlciwgRGVsZXRlLCBvciBCYWNrc3BhY2UgdG8gcmVtb3ZlLlwiLFxuICAgICAgICApO1xuICAgIH1cblxuICAgIHJlbW92ZUxpbmUobGluZSkge1xuICAgICAgICBjb25zdCBmcm9tTGFiZWwgPSBsaW5lLmZyb21Cb3hcbiAgICAgICAgICAgID8gdGhpcy5nZXRCb3hMYWJlbChsaW5lLmZyb21Cb3gpXG4gICAgICAgICAgICA6IFwib25lIGJveFwiO1xuICAgICAgICBjb25zdCB0b0xhYmVsID0gbGluZS50b0JveFxuICAgICAgICAgICAgPyB0aGlzLmdldEJveExhYmVsKGxpbmUudG9Cb3gpXG4gICAgICAgICAgICA6IFwiYW5vdGhlciBib3hcIjtcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRMaW5lID09PSBsaW5lKSB7XG4gICAgICAgICAgICB0aGlzLnNldFNlbGVjdGVkTGluZShudWxsLCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zdmcucmVtb3ZlQ2hpbGQobGluZSk7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5jb25uZWN0aW9ucy5maW5kSW5kZXgoXG4gICAgICAgICAgICAoY29ubikgPT5cbiAgICAgICAgICAgICAgICAoY29ubi5mcm9tQm94ID09PSBsaW5lLmZyb21Cb3ggJiYgY29ubi50b0JveCA9PT0gbGluZS50b0JveCkgfHxcbiAgICAgICAgICAgICAgICAoY29ubi5mcm9tQm94ID09PSBsaW5lLnRvQm94ICYmIGNvbm4udG9Cb3ggPT09IGxpbmUuZnJvbUJveCksXG4gICAgICAgICk7XG4gICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHRoaXMuY29ubmVjdGlvbnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgdGhpcy51cGRhdGVDb25uZWN0aW9uTW9kZWwoKTtcbiAgICAgICAgaWYgKHRoaXMuYXJpYUxpdmUpIHtcbiAgICAgICAgICAgIHRoaXMuYXJpYUxpdmUudGV4dENvbnRlbnQgPSBgUmVtb3ZlZCBjb25uZWN0aW9uIGZyb20gJHtmcm9tTGFiZWx9IHRvICR7dG9MYWJlbH0uYDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlzQ29ubmVjdGVkKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29ubmVjdGlvbnMuc29tZShcbiAgICAgICAgICAgIChjb25uKSA9PlxuICAgICAgICAgICAgICAgIChjb25uLmZyb21Cb3ggPT09IGEgJiYgY29ubi50b0JveCA9PT0gYikgfHxcbiAgICAgICAgICAgICAgICAoY29ubi5mcm9tQm94ID09PSBiICYmIGNvbm4udG9Cb3ggPT09IGEpLFxuICAgICAgICApO1xuICAgIH1cblxuICAgIGNyZWF0ZVBlcm1hbmVudExpbmUoZnJvbUJveCwgdG9Cb3gpIHtcbiAgICAgICAgY29uc3QgZnJvbVJvbGUgPSBmcm9tQm94LmRhdGFzZXQucm9sZTtcbiAgICAgICAgY29uc3QgdG9Sb2xlID0gdG9Cb3guZGF0YXNldC5yb2xlO1xuXG4gICAgICAgIGlmIChmcm9tUm9sZSA9PT0gdG9Sb2xlKSB7XG4gICAgICAgICAgICB0aGlzLmZsYXNoSW52YWxpZChmcm9tQm94LCB0b0JveCk7XG4gICAgICAgICAgICBpZiAodGhpcy5hcmlhTGl2ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuYXJpYUxpdmUudGV4dENvbnRlbnQgPVxuICAgICAgICAgICAgICAgICAgICBcIkNvbm5lY3Rpb25zIG11c3QgZ28gYmV0d2VlbiB0aGUgbGVmdCBjb2x1bW4gYW5kIHRoZSByaWdodCBjb2x1bW4uXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICAvLyB3ZSBzaG91bGQgYWx3YXlzIHN0b3JlIGNvbm5lY3Rpb25zIGFzIGRyYWcgdG8gZHJvcFxuICAgICAgICAvLyBldmVuIGlmIHRoZSB1c2VyIGNvbm5lY3RzIGRyb3AgdG8gZHJhZ1xuICAgICAgICBpZiAoZnJvbUJveC5kYXRhc2V0LnJvbGUgPT09IFwiZHJvcFwiKSB7XG4gICAgICAgICAgICBbZnJvbUJveCwgdG9Cb3hdID0gW3RvQm94LCBmcm9tQm94XTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5pc0Nvbm5lY3RlZChmcm9tQm94LCB0b0JveCkpIHJldHVybiBmYWxzZTtcblxuICAgICAgICBjb25zdCBmcm9tID0gdGhpcy5nZXRSaWdodEJveENlbnRlcihmcm9tQm94KTtcbiAgICAgICAgY29uc3QgdG8gPSB0aGlzLmdldExlZnRCb3hDZW50ZXIodG9Cb3gpO1xuICAgICAgICBjb25zdCBsaW5lID0gdGhpcy5jcmVhdGVMaW5lRWxlbWVudChmcm9tLCB0byk7XG5cbiAgICAgICAgbGluZS5mcm9tQm94ID0gZnJvbUJveDtcbiAgICAgICAgbGluZS50b0JveCA9IHRvQm94O1xuICAgICAgICB0aGlzLnVwZGF0ZUxpbmVBcmlhTGFiZWwobGluZSk7XG5cbiAgICAgICAgdGhpcy5zdmcuYXBwZW5kQ2hpbGQobGluZSk7XG4gICAgICAgIHRoaXMuY29ubmVjdGlvbnMucHVzaCh7IGZyb21Cb3gsIHRvQm94LCBsaW5lIH0pO1xuICAgICAgICB0aGlzLnVwZGF0ZUNvbm5lY3Rpb25Nb2RlbCgpO1xuICAgICAgICB0aGlzLmlzQW5zd2VyZWQgPSB0cnVlO1xuXG4gICAgICAgIGlmICh0aGlzLmFyaWFMaXZlKSB7XG4gICAgICAgICAgICB0aGlzLmFyaWFMaXZlLnRleHRDb250ZW50ID0gYENvbm5lY3RlZCAke3RoaXMuZ2V0Qm94TGFiZWwoZnJvbUJveCl9IHRvICR7dGhpcy5nZXRCb3hMYWJlbCh0b0JveCl9YDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBmbGFzaEludmFsaWQoLi4uYm94ZXMpIHtcbiAgICAgICAgYm94ZXMuZm9yRWFjaCgoYm94KSA9PiB7XG4gICAgICAgICAgICBib3guY2xhc3NMaXN0LmFkZChcImludmFsaWRcIik7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IGJveC5jbGFzc0xpc3QucmVtb3ZlKFwiaW52YWxpZFwiKSwgNTAwKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaGlkZUZlZWRiYWNrKCkge1xuICAgICAgICB0aGlzLmZlZWRiYWNrRGl2LmhpZGRlbiA9IHRydWU7XG4gICAgICAgIHRoaXMuZmVlZGJhY2tEaXYucmVwbGFjZUNoaWxkcmVuKCk7XG4gICAgfVxuXG4gICAgYXBwZW5kQ29ubmVjdGlvbkJveENvbnRlbnQoZW50cnksIGJveCkge1xuICAgICAgICBjb25zdCBzcGVlY2ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICAgICAgc3BlZWNoLmNsYXNzTmFtZSA9IFwidmlzdWFsbHloaWRkZW5cIjtcbiAgICAgICAgc3BlZWNoLnRleHRDb250ZW50ID0gdGhpcy5nZXRCb3hMYWJlbChib3gpO1xuXG4gICAgICAgIGNvbnN0IHZpc3VhbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgICAgICB2aXN1YWwuY2xhc3NOYW1lID0gXCJjb25uLWJveC12aXN1YWxcIjtcbiAgICAgICAgdmlzdWFsLnNldEF0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIsIFwidHJ1ZVwiKTtcbiAgICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiBib3guY2hpbGROb2Rlcykge1xuICAgICAgICAgICAgdmlzdWFsLmFwcGVuZENoaWxkKGNoaWxkLmNsb25lTm9kZSh0cnVlKSk7XG4gICAgICAgIH1cbiAgICAgICAgdmlzdWFsXG4gICAgICAgICAgICAucXVlcnlTZWxlY3RvckFsbChcbiAgICAgICAgICAgICAgICBcImFbaHJlZl0sIGJ1dHRvbiwgaW5wdXQsIHNlbGVjdCwgdGV4dGFyZWEsIFt0YWJpbmRleF1cIixcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC50YWJJbmRleCA9IC0xO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgZW50cnkuYXBwZW5kKHNwZWVjaCwgdmlzdWFsKTtcbiAgICB9XG5cbiAgICByZW5kZXJDb25uZWN0aW9uTGlzdCgpIHtcbiAgICAgICAgdGhpcy5jb25uTGlzdC5pbm5lckhUTUwgPSBcIjxzdHJvbmc+Q29ubmVjdGlvbnM6PC9zdHJvbmc+XCI7XG4gICAgICAgIGlmICh0aGlzLmNvbm5lY3Rpb25zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgY29uc3QgZW1wdHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgZW1wdHkuY2xhc3NOYW1lID0gXCJjb25uLWVudHJ5IGNvbm4tZW1wdHlcIjtcbiAgICAgICAgICAgIGVtcHR5LnRleHRDb250ZW50ID1cbiAgICAgICAgICAgICAgICBcIk5vIGNvbm5lY3Rpb25zIHlldC4gRHJhZyBiZXR3ZWVuIGJveGVzIHRvIGNvbm5lY3QgdGhlbS5cIjtcbiAgICAgICAgICAgIHRoaXMuY29ubkxpc3QuYXBwZW5kQ2hpbGQoZW1wdHkpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY29ubmVjdGlvbnMuZm9yRWFjaCgoY29ubikgPT4ge1xuICAgICAgICAgICAgY29uc3QgbGluZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICBsaW5lLmNsYXNzTmFtZSA9IFwiY29ubi1lbnRyeVwiO1xuICAgICAgICAgICAgdGhpcy5hcHBlbmRDb25uZWN0aW9uQm94Q29udGVudChsaW5lLCBjb25uLmZyb21Cb3gpO1xuXG4gICAgICAgICAgICBjb25zdCBhcnJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgICAgICAgICAgYXJyb3cuc2V0QXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIiwgXCJ0cnVlXCIpO1xuICAgICAgICAgICAgYXJyb3cudGV4dENvbnRlbnQgPSBcIuKGklwiO1xuICAgICAgICAgICAgY29uc3QgY29ubmVjdGlvblRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICAgICAgICAgIGNvbm5lY3Rpb25UZXh0LmNsYXNzTmFtZSA9IFwidmlzdWFsbHloaWRkZW5cIjtcbiAgICAgICAgICAgIGNvbm5lY3Rpb25UZXh0LnRleHRDb250ZW50ID0gXCJjb25uZWN0ZWQgdG9cIjtcbiAgICAgICAgICAgIGxpbmUuYXBwZW5kKGFycm93LCBjb25uZWN0aW9uVGV4dCk7XG5cbiAgICAgICAgICAgIHRoaXMuYXBwZW5kQ29ubmVjdGlvbkJveENvbnRlbnQobGluZSwgY29ubi50b0JveCk7XG4gICAgICAgICAgICB0aGlzLmNvbm5MaXN0LmFwcGVuZENoaWxkKGxpbmUpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICB1cGRhdGVDb25uZWN0aW9uTW9kZWwoKSB7XG4gICAgICAgIC8vIEFueSBjaGFuZ2UgdG8gdGhlIGNvbm5lY3Rpb25zIGludmFsaWRhdGVzIHByZXZpb3VzbHkgcmVuZGVyZWRcbiAgICAgICAgLy8gZ3JhZGluZyBtYXJrcywgc28gY2xlYXIgdGhlbSBhbG9uZyB3aXRoIHJlYnVpbGRpbmcgdGhlIGxpc3QuXG4gICAgICAgIHRoaXMuaGlkZUZlZWRiYWNrKCk7XG4gICAgICAgIHRoaXMuYWxsQm94ZXMuZm9yRWFjaCgoYm94KSA9PlxuICAgICAgICAgICAgYm94LmNsYXNzTGlzdC5yZW1vdmUoXCJtYXRjaC1jb3JyZWN0XCIsIFwibWF0Y2gtaW5jb3JyZWN0XCIpLFxuICAgICAgICApO1xuICAgICAgICB0aGlzLmFsbEJveGVzLmZvckVhY2goKGJveCkgPT4gdGhpcy51cGRhdGVCb3hBcmlhTGFiZWwoYm94KSk7XG4gICAgICAgIHRoaXMuY29ubmVjdGlvbnMuZm9yRWFjaCgoeyBsaW5lIH0pID0+IHtcbiAgICAgICAgICAgIGxpbmU/LmNsYXNzTGlzdC5yZW1vdmUoXCJjb3JyZWN0XCIsIFwiaW5jb3JyZWN0XCIpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5yZW5kZXJDb25uZWN0aW9uTGlzdCgpO1xuICAgIH1cblxuICAgIC8qXG4gICAgICogVGhpcyBtZXRob2QgZ3JhZGVzIHRoZSBjb25uZWN0aW9ucyBtYWRlIGJ5IHRoZSB1c2VyLlxuICAgICAqIEl0IGNoZWNrcyB0aGUgY3VycmVudCBhbnN3ZXIgYWdhaW5zdCB0aGUgY29ycmVjdCBhbnN3ZXJzLFxuICAgICAqIHJlbmRlcnMgZmVlZGJhY2ssIGFuZCBsb2dzIHRoZSBjdXJyZW50IGFuc3dlci5cbiAgICAgKiBJdCBhbHNvIHVwZGF0ZXMgdGhlIGxvY2FsIHN0b3JhZ2Ugd2l0aCB0aGUgY3VycmVudCBzdGF0ZS5cbiAgICAgKiBJdCBpcyBjYWxsZWQgd2hlbiB0aGUgdXNlciBjbGlja3MgdGhlIFwiR3JhZGVcIiBidXR0b24uXG4gICAgICovXG4gICAgZ3JhZGVDb25uZWN0aW9ucygpIHtcbiAgICAgICAgdGhpcy5jaGVja0N1cnJlbnRBbnN3ZXIoKTtcbiAgICAgICAgdGhpcy5yZW5kZXJGZWVkYmFjaygpO1xuICAgICAgICB0aGlzLmxvZ0N1cnJlbnRBbnN3ZXIoKTtcbiAgICAgICAgdGhpcy5zZXRMb2NhbFN0b3JhZ2UoKTtcbiAgICB9XG5cbiAgICByZXNldENvbm5lY3Rpb25zKCkge1xuICAgICAgICB0aGlzLmNvbm5lY3Rpb25zLmZvckVhY2goKGNvbm4pID0+IHtcbiAgICAgICAgICAgIGlmIChjb25uLmxpbmUgJiYgY29ubi5saW5lLnBhcmVudE5vZGUgPT09IHRoaXMuc3ZnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdmcucmVtb3ZlQ2hpbGQoY29ubi5saW5lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuY29ubmVjdGlvbnMubGVuZ3RoID0gMDtcbiAgICAgICAgdGhpcy51cGRhdGVDb25uZWN0aW9uTW9kZWwoKTtcbiAgICAgICAgaWYgKHRoaXMuYXJpYUxpdmUpXG4gICAgICAgICAgICB0aGlzLmFyaWFMaXZlLnRleHRDb250ZW50ID0gXCJBbGwgY29ubmVjdGlvbnMgaGF2ZSBiZWVuIGNsZWFyZWQuXCI7XG4gICAgICAgIHRoaXMubG9nQm9va0V2ZW50KHtcbiAgICAgICAgICAgIGV2ZW50OiBcIm1hdGNoaW5nX3Jlc2V0XCIsXG4gICAgICAgICAgICBkaXZfaWQ6IHRoaXMuZGl2aWQsXG4gICAgICAgICAgICBhY3Q6IFwicmVzZXQgYWxsIGNvbm5lY3Rpb25zXCIsXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGF0dGFjaEV2ZW50cygpIHtcbiAgICAgICAgdGhpcy5hbGxCb3hlcy5mb3JFYWNoKChib3gpID0+IHtcbiAgICAgICAgICAgIGJveC5hZGRFdmVudExpc3RlbmVyKFwicG9pbnRlcmRvd25cIiwgKGUpID0+IHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydEJveCA9IGJveDtcbiAgICAgICAgICAgICAgICBjb25zdCBmcm9tID0gdGhpcy5nZXRQb3J0Q2VudGVyKHRoaXMuc3RhcnRCb3gpO1xuICAgICAgICAgICAgICAgIHRoaXMudGVtcExpbmUgPSB0aGlzLmNyZWF0ZUxpbmVFbGVtZW50KGZyb20sIGZyb20pO1xuICAgICAgICAgICAgICAgIHRoaXMudGVtcExpbmUuY2xhc3NMaXN0LmFkZChcInRlbXBcIik7XG4gICAgICAgICAgICAgICAgdGhpcy5zdmcuYXBwZW5kQ2hpbGQodGhpcy50ZW1wTGluZSk7XG5cbiAgICAgICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwicG9pbnRlcm1vdmVcIiwgdGhpcy51cGRhdGVUZW1wTGluZSk7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInBvaW50ZXJ1cFwiLCB0aGlzLmZpbmlzaENvbm5lY3Rpb24pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGJveC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChlLnRhcmdldCAhPT0gYm94KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGUua2V5ID09PSBcIkVudGVyXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFjdGl2YXRlQm94KGJveCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChlLmtleSA9PT0gXCJFc2NhcGVcIiAmJiB0aGlzLnNlbGVjdGVkQm94KSB7XG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYW5jZWxTZWxlY3RlZEJveCgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5zZWxlY3RlZEJveCAmJiBlLmtleSA9PT0gXCJUYWJcIikge1xuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubW92ZVRhYkZvY3VzKGJveCwgZS5zaGlmdEtleSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChlLmtleSA9PT0gXCJBcnJvd1VwXCIgfHwgZS5rZXkgPT09IFwiQXJyb3dEb3duXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmVCb3hGb2N1cyhib3gsIGUua2V5ID09PSBcIkFycm93RG93blwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGUua2V5ID09PSBcIkFycm93TGVmdFwiIHx8IGUua2V5ID09PSBcIkFycm93UmlnaHRcIikge1xuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubW92ZUJveEZvY3VzQWNyb3NzQ29sdW1ucyhlLmtleSA9PT0gXCJBcnJvd1JpZ2h0XCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBib3guYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuYWN0aXZhdGVCb3goYm94KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBib3guYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZW50ZXJcIiwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuY29ubmVjdGlvbnMuZm9yRWFjaCgoY29ubikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29ubi5mcm9tQm94ID09PSBib3ggfHwgY29ubi50b0JveCA9PT0gYm94KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25uLmxpbmUuY2xhc3NMaXN0LmFkZChcImhpZ2hsaWdodGVkXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29ubi5saW5lLmNsYXNzTGlzdC5yZW1vdmUoXCJmYWRlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbm4ubGluZS5jbGFzc0xpc3QuYWRkKFwiZmFkZWRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25uLmxpbmUuY2xhc3NMaXN0LnJlbW92ZShcImhpZ2hsaWdodGVkXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgYm94LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWxlYXZlXCIsICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbm5lY3Rpb25zLmZvckVhY2goKGNvbm4pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29ubi5saW5lLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWdobGlnaHRlZFwiLCBcImZhZGVkXCIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY29ubmVjdGlvbnMuZm9yRWFjaCgoY29ubikgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGZyb20gPSB0aGlzLmdldFJpZ2h0Qm94Q2VudGVyKGNvbm4uZnJvbUJveCk7XG4gICAgICAgICAgICAgICAgY29uc3QgdG8gPSB0aGlzLmdldExlZnRCb3hDZW50ZXIoY29ubi50b0JveCk7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRMaW5lRW5kcG9pbnRzKGNvbm4ubGluZSwgZnJvbSwgdG8pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHVwZGF0ZVRlbXBMaW5lID0gKGUpID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBpZiAoIXRoaXMuc3RhcnRCb3ggfHwgIXRoaXMudGVtcExpbmUpIHJldHVybjtcbiAgICAgICAgY29uc3QgZnJvbSA9IHRoaXMuZ2V0UG9ydENlbnRlcih0aGlzLnN0YXJ0Qm94KTtcbiAgICAgICAgY29uc3QgY29udGFpbmVyUmVjdCA9IHRoaXMud29ya3NwYWNlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICBjb25zdCB0byA9IHtcbiAgICAgICAgICAgIHg6IGUuY2xpZW50WCAtIGNvbnRhaW5lclJlY3QubGVmdCxcbiAgICAgICAgICAgIHk6IGUuY2xpZW50WSAtIGNvbnRhaW5lclJlY3QudG9wLFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLnNldExpbmVFbmRwb2ludHModGhpcy50ZW1wTGluZSwgZnJvbSwgdG8pO1xuICAgIH07XG5cbiAgICBmaW5pc2hDb25uZWN0aW9uID0gKGUpID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBpZiAodGhpcy50ZW1wTGluZSkge1xuICAgICAgICAgICAgdGhpcy5zdmcucmVtb3ZlQ2hpbGQodGhpcy50ZW1wTGluZSk7XG4gICAgICAgICAgICB0aGlzLnRlbXBMaW5lID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHRoZSB0YXJnZXQgZWxlbWVudCBpcyB0aGUgZWxlbWVudCB1bmRlciB0aGUgcG9pbnRlclxuICAgICAgICAvLyB3aGVuIHRoZSBwb2ludGVyIGlzIHJlbGVhc2VkXG4gICAgICAgIC8vIHRoaXMgaXMgbm90IHRoZSBzYW1lIGFzIGUudGFyZ2V0IHdoaWNoIG1heSBiZSB0aGUgYm94IG9yIGl0IG1heSBiZSB0aGUgc3ZnXG4gICAgICAgIC8vIG9yIGl0IG1heSBiZSB0aGUgbGluZSwgc28gd2UgZG8gaXQgdGhpcyB3YXkgaW5zdGVhZCBvZiBjaGVja2luZyB0byBzZWUgaWYgdGhlIGJveCBjb250YWluc1xuICAgICAgICAvLyBlLnRhcmdldC4gIGNvbnN0IGVuZEJveCA9IHRoaXMuYWxsQm94ZXMuZmluZChib3ggPT4gYm94LmNvbnRhaW5zKGUudGFyZ2V0KSAmJiBib3ggIT09IHRoaXMuc3RhcnRCb3gpO1xuICAgICAgICBjb25zdCBwb2ludFggPVxuICAgICAgICAgICAgZS5jbGllbnRYIHx8IChlLmNoYW5nZWRUb3VjaGVzICYmIGUuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WCk7XG4gICAgICAgIGNvbnN0IHBvaW50WSA9XG4gICAgICAgICAgICBlLmNsaWVudFkgfHwgKGUuY2hhbmdlZFRvdWNoZXMgJiYgZS5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRZKTtcbiAgICAgICAgY29uc3QgdGFyZ2V0RWxlbWVudCA9IGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQocG9pbnRYLCBwb2ludFkpO1xuXG4gICAgICAgIGNvbnN0IGVuZEJveCA9IHRoaXMuYWxsQm94ZXMuZmluZChcbiAgICAgICAgICAgIChib3gpID0+IGJveC5jb250YWlucyh0YXJnZXRFbGVtZW50KSAmJiBib3ggIT09IHRoaXMuc3RhcnRCb3gsXG4gICAgICAgICk7XG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgdGhpcy5zdGFydEJveCAmJlxuICAgICAgICAgICAgZW5kQm94ICYmXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVBlcm1hbmVudExpbmUodGhpcy5zdGFydEJveCwgZW5kQm94KVxuICAgICAgICApIHtcbiAgICAgICAgICAgIHRoaXMubG9nQm9va0V2ZW50KHtcbiAgICAgICAgICAgICAgICBldmVudDogXCJtYXRjaGluZ19jb25uZWN0aW9uXCIsXG4gICAgICAgICAgICAgICAgZGl2X2lkOiB0aGlzLmRpdmlkLFxuICAgICAgICAgICAgICAgIGFjdDogYGNvbm5lY3RlZCAke3RoaXMuc3RhcnRCb3guZGF0YXNldC5pZH0gdG8gJHtlbmRCb3guZGF0YXNldC5pZH1gLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zdGFydEJveCA9IG51bGw7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJwb2ludGVybW92ZVwiLCB0aGlzLnVwZGF0ZVRlbXBMaW5lKTtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInBvaW50ZXJ1cFwiLCB0aGlzLmZpbmlzaENvbm5lY3Rpb24pO1xuICAgIH07XG59XG5cbi8vIFJlZ2lzdGVyIHRoZSBjb21wb25lbnQgd2l0aCBSdW5lc3RvbmVcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJydW5lc3RvbmU6bG9naW4tY29tcGxldGVcIiwgKCkgPT4ge1xuICAgIGRvY3VtZW50XG4gICAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1jb21wb25lbnQ9XCJtYXRjaGluZ1wiXScpXG4gICAgICAgIC5mb3JFYWNoKChjb250YWluZXIpID0+IHtcbiAgICAgICAgICAgIGlmICghY29udGFpbmVyLmNsb3Nlc3QoXCJbZGF0YS1jb21wb25lbnQ9dGltZWRBc3Nlc3NtZW50XVwiKSkge1xuICAgICAgICAgICAgICAgIGxldCBvcHRzID0geyBvcmlnOiBjb250YWluZXIgfTtcbiAgICAgICAgICAgICAgICB3aW5kb3cuY29tcG9uZW50TWFwW2NvbnRhaW5lci5pZF0gPSBuZXcgTWF0Y2hpbmdQcm9ibGVtKG9wdHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbn0pO1xuXG4vLyBBZGQgY29tcG9uZW50IGZhY3RvcnkgaW5pdGlhbGl6YXRpb25cbmlmICh0eXBlb2Ygd2luZG93LmNvbXBvbmVudF9mYWN0b3J5ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgd2luZG93LmNvbXBvbmVudF9mYWN0b3J5ID0ge307XG59XG5cbndpbmRvdy5jb21wb25lbnRfZmFjdG9yeS5tYXRjaGluZyA9IGZ1bmN0aW9uIChvcHRzKSB7XG4gICAgcmV0dXJuIG5ldyBNYXRjaGluZ1Byb2JsZW0ob3B0cyk7XG59O1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9