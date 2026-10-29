"use strict";
(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_codelens_js_codelens_js"],{

/***/ 23546:
/*!*****************************************************!*\
  !*** ./runestone/codelens/frontend/trace-viewer.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   mountTraceViewer: () => (/* binding */ mountTraceViewer)
/* harmony export */ });
/* harmony import */ var _common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/rsi18n.js */ 54250);
/* harmony import */ var _frontend_i18n_en_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./frontend-i18n.en.js */ 42020);
/* harmony import */ var _memory_model_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./memory-model.js */ 32171);
/* harmony import */ var _memory_view_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./memory-view.js */ 71469);
// A small, read-only viewer for experimenting with accessible trace output.
// The trace format is produced elsewhere; this module never executes code.





const mountedViewers = new WeakMap();
let nextViewerId = 0;

function element(tag, className, textContent) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (textContent !== undefined) node.textContent = textContent;
    return node;
}

function traceLine(entry) {
    return Number.isInteger(entry.line) && entry.line > 0
        ? (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_line", entry.line)
        : (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_no_line");
}

/** Mount a read-only view of an existing Python Tutor trace. */
function mountTraceViewer(container, data, options = {}) {
    if (!(container instanceof Element)) {
        throw new TypeError("CodeLens container must be an element");
    }
    if (typeof data?.code !== "string" || !Array.isArray(data.trace)) {
        throw new TypeError("CodeLens trace must contain code and trace fields");
    }
    if (data.trace.length === 0) {
        throw new TypeError("CodeLens trace has no steps");
    }
    mountedViewers.get(container)?.destroy();
    let destroyed = false;

    const requestedStep = options.startingInstruction ?? data.startingInstruction ?? 0;
    let step = Number.isFinite(requestedStep)
        ? Math.max(0, Math.min(data.trace.length - 1, Math.trunc(requestedStep)))
        : 0;

    const root = element("section", "rs-codelens-prototype");
    root.setAttribute("aria-label", (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_viewer"));

    const viewerHeading = element(
        "h2",
        "rs-codelens-prototype__sr-only",
        (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_trace"),
    );
    root.dataset.layout = "auto";
    const layoutControls = element("div", "rs-codelens-prototype__layout-control");
    const layoutLabel = element("label", null, (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_viewer_layout"));
    const layoutSelect = element("select");
    layoutSelect.id = `rs-codelens-layout-${++nextViewerId}`;
    layoutLabel.htmlFor = layoutSelect.id;
    for (const mode of ["auto", "side-by-side", "stacked"]) {
        const option = element("option", null, (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)(`cl_layout_${mode}`));
        option.value = mode;
        layoutSelect.append(option);
    }
    layoutSelect.addEventListener("change", () => {
        root.dataset.layout = layoutSelect.value;
    });
    layoutControls.append(layoutLabel, layoutSelect);
    const workspace = element("div", "rs-codelens-prototype__workspace");
    const codePanel = element("section", "rs-codelens-prototype__code-panel");
    codePanel.setAttribute("aria-label", (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_code"));
    const codeHeading = element("h3", null, (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_code"));
    const codePre = element("pre", "rs-codelens-prototype__code");
    const code = element("code");
    codePre.append(code);
    const sourceLines = data.code.replace(/\r\n?/g, "\n").split("\n");
    if (sourceLines[sourceLines.length - 1] === "") sourceLines.pop();
    const lineNodes = sourceLines.map((source, index) => {
        const row = element("span", "rs-codelens-prototype__line");
        row.dataset.line = String(index + 1);
        row.append(
            element(
                "span", "rs-codelens-prototype__sr-only",
                `${(0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_line", index + 1)}: `,
            ),
            element("span", "rs-codelens-prototype__line-number", String(index + 1)),
            element("span", "rs-codelens-prototype__current-label"),
            element("span", "rs-codelens-prototype__source", source || " "),
        );
        row.querySelector(".rs-codelens-prototype__line-number").setAttribute(
            "aria-hidden",
            "true",
        );
        code.append(row);
        return row;
    });

    const controls = element("div", "rs-codelens-prototype__controls");
    const previous = element("button", null, (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_previous"));
    previous.type = "button";
    previous.dataset.codelensAction = "back";
    const next = element("button", null, (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_next"));
    next.type = "button";
    next.dataset.codelensAction = "fwd";
    controls.append(previous, next);
    const status = element("p", "rs-codelens-prototype__status");
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    status.setAttribute("aria-atomic", "true");

    const hasHeap = data.trace.some((entry) => Object.keys(entry.heap ?? {}).length > 0);
    const memoryView = (0,_memory_view_js__WEBPACK_IMPORTED_MODULE_3__.createMemoryView)({ hasHeap });
    let previousMemory = null;
    const outputHeading = element("h3", null, (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_output"));
    const output = element("pre", "rs-codelens-prototype__output");
    output.setAttribute("aria-label", (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_output"));

    codePanel.append(
        codeHeading,
        codePre,
        controls,
        status,
        outputHeading,
        output,
    );
    workspace.append(codePanel, memoryView.element);
    root.append(viewerHeading, layoutControls, workspace);
    container.replaceChildren(root);

    function render(previousStep = null) {
        const entry = data.trace[step];
        for (const [index, row] of lineNodes.entries()) {
            const current = index + 1 === entry.line;
            row.classList.toggle("rs-codelens-prototype__line--current", current);
            row.querySelector(".rs-codelens-prototype__current-label").textContent =
                current ? (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_current_line") : "";
        }
        previous.setAttribute("aria-disabled", String(step === 0));
        next.setAttribute("aria-disabled", String(step === data.trace.length - 1));

        const memory = (0,_memory_model_js__WEBPACK_IMPORTED_MODULE_2__.normalizeMemory)(entry, options.lang);
        const changes = (0,_memory_model_js__WEBPACK_IMPORTED_MODULE_2__.memoryChanges)(previousMemory, memory);
        memoryView.update(memory, changes);
        previousMemory = memory;

        const stdout = typeof entry.stdout === "string" ? entry.stdout : "";
        output.textContent = stdout;
        let announcement = (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_step", step + 1, data.trace.length, traceLine(entry));
        if (changes.length > 0) {
            announcement += ` ${changes.slice(0, 3).map((change) => change.text).join(" ")}`;
        }
        if (changes.length > 3) {
            announcement += ` ${(0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_more_changes", changes.length - 3)}`;
        }
        if (previousStep !== null) {
            const oldStdout = data.trace[previousStep].stdout ?? "";
            if (stdout !== oldStdout) {
                if (stdout.startsWith(oldStdout)) {
                    const added = stdout.slice(oldStdout.length).trim() || (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_whitespace");
                    announcement += ` ${(0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_new_output", added)}${/[.!?]$/.test(added) ? "" : "."}`;
                } else {
                    announcement += ` ${(0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_output_changed")}`;
                }
            }
        }
        status.textContent = announcement;
    }

    function moveStep(direction) {
        const destination = step + direction;
        if (destroyed || destination < 0 || destination >= data.trace.length) return false;
        const previousStep = step;
        step = destination;
        render(previousStep);
        return true;
    }

    const stepForward = () => moveStep(1);
    const stepBackward = () => moveStep(-1);

    for (const [button, action] of [[previous, stepBackward], [next, stepForward]]) {
        button.addEventListener("click", (event) => {
            if (!action()) {
                event.preventDefault();
                event.stopImmediatePropagation();
            }
        });
    }
    render();
    const controller = {
        element: root,
        get currentStep() {
            return step;
        },
        stepForward,
        stepBackward,
        destroy() {
            destroyed = true;
            memoryView.destroy();
            root.remove();
            if (mountedViewers.get(container) === controller) {
                mountedViewers.delete(container);
            }
        },
    };
    mountedViewers.set(container, controller);
    return controller;
}


/***/ }),

/***/ 32171:
/*!*****************************************************!*\
  !*** ./runestone/codelens/frontend/memory-model.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   aggregateRows: () => (/* binding */ aggregateRows),
/* harmony export */   cAddress: () => (/* binding */ cAddress),
/* harmony export */   memoryChanges: () => (/* binding */ memoryChanges),
/* harmony export */   memoryKey: () => (/* binding */ memoryKey),
/* harmony export */   normalizeMemory: () => (/* binding */ normalizeMemory),
/* harmony export */   normalizeValue: () => (/* binding */ normalizeValue),
/* harmony export */   valueText: () => (/* binding */ valueText)
/* harmony export */ });
/* harmony import */ var _common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/rsi18n.js */ 54250);
/* harmony import */ var _frontend_i18n_en_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./frontend-i18n.en.js */ 42020);
// Python Tutor snapshots are a graph. Decode values without expanding references,
// so aliases and cycles retain their identity and never recurse through the heap.



const memoryKey = (...parts) => JSON.stringify(parts);

function literal(text) {
    return { kind: "literal", text: String(text) };
}

function cAddress(address) {
    return typeof address === "string" && /^0x[0-9a-f]+$/i.test(address)
        ? `0x${BigInt(address).toString(16)}` : null;
}

function normalizeValue(value, language = "py3") {
    if (Array.isArray(value)) {
        if (value[0] === "C_STRUCT" && value.length >= 3 &&
            value.slice(3).every((field) => Array.isArray(field) && field.length === 2)) {
            return {
                kind: "struct", address: String(value[1]), type: String(value[2]),
                fields: value.slice(3).map(([name, field]) => ({
                    name: String(name), value: normalizeValue(field, language),
                })),
            };
        }
        if (value[0] === "C_ARRAY" && value.length >= 2) {
            return {
                kind: "array", address: String(value[1]), type: (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_array_type"),
                fields: value.slice(2).map((field, index) => ({
                    name: String(index), value: normalizeValue(field, language),
                })),
            };
        }
        if (value[0] === "C_DATA" && value.length === 4) {
            const decoded = typeof value[3] === "string"
                ? literal(value[3]) : normalizeValue(value[3], language);
            const target = value[2] === "pointer"
                ? (value[3] === 0 ? "0x0" : cAddress(value[3])) : null;
            if (target !== null) Object.assign(decoded, { kind: "pointer", id: target });
            return { ...decoded, address: String(value[1]), type: String(value[2]) };
        }
        if (value[0] === "REF") return { kind: "reference", id: String(value[1]) };
        if (["SPECIAL_FLOAT", "IMPORTED_FAUX_PRIMITIVE"].includes(value[0])) {
            return literal(value[1]);
        }
        return literal((0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_unknown_value", JSON.stringify(value)));
    }
    const python = language.startsWith("py");
    if (value === null) return literal(python ? "None" : "null");
    if (typeof value === "boolean") {
        return literal(python ? (value ? "True" : "False") : String(value));
    }
    if (typeof value === "string") return literal(JSON.stringify(value));
    if (typeof value === "number") return literal(value);
    return literal((0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_unknown_value", JSON.stringify(value)));
}

function aggregateRows(value, parentKey) {
    return value.fields.map((field) => ({
        ...field,
        key: memoryKey(parentKey, "field", field.name),
        location: value.kind === "array" ? (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_index_location", field.name) : field.name,
    }));
}

function bindings(values = {}, order = [], prefix, language) {
    const names = [...new Set([...order, ...Object.keys(values)])];
    return names
        .filter((name) => Object.prototype.hasOwnProperty.call(values, name))
        .map((name) => ({
            key: memoryKey(...prefix, name),
            name: name === "__return__" ? (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_return") : name,
            value: normalizeValue(values[name], language),
        }));
}

function normalizeObject(id, raw, language) {
    const tag = Array.isArray(raw) ? raw[0] : "?";
    const object = {
        id,
        key: memoryKey("heap", id),
        tag,
        label: (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_object", id, tag),
        keyHeading: (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_name"),
        entries: [],
    };
    function row(key, value, identity = key) {
        object.entries.push({
            key: memoryKey("heap", id, identity),
            name: normalizeValue(key, language),
            value: normalizeValue(value, language),
        });
    }
    function namedRow(name, value) {
        row(name, value);
        object.entries[object.entries.length - 1].name = literal(name);
    }
    function pairs(items, named = false) {
        for (const pair of items) {
            if (!Array.isArray(pair) || pair.length !== 2) return false;
            if (named && typeof pair[0] === "string") namedRow(pair[0], pair[1]);
            else row(pair[0], pair[1]);
        }
        return true;
    }

    let supported = Array.isArray(raw);
    switch (tag) {
        case "C_STRUCT": {
            const value = normalizeValue(raw, language);
            supported = value.kind === "struct";
            if (supported) {
                object.label = (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_c_struct", value.type, value.address);
                object.keyHeading = (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_field");
                object.entries = aggregateRows(value, object.key);
            }
            break;
        }
        case "C_DATA":
            namedRow((0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_value"), raw);
            break;
        case "C_ARRAY":
            object.label = (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_c_array", id);
            object.keyHeading = (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_index");
            raw.slice(2).forEach((value, index) => row(index, value));
            if (object.entries.length === 1) {
                const entry = object.entries[0];
                object.singleElement = true;
                object.label = entry.value.type !== undefined
                    ? (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_aggregate_value", entry.value.type, entry.value.address ?? raw[1])
                    : (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_memory_chunk", raw[1]);
                entry.name = literal((0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_value"));
            }
            break;
        case "LIST":
        case "TUPLE":
        case "SET":
            object.label = (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)(`cl_${tag.toLowerCase()}`, id);
            object.keyHeading = (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)(tag === "SET" ? "cl_member" : "cl_index");
            raw.slice(1).forEach((value, index) => {
                const set = tag === "SET";
                row(set ? index + 1 : index, value, set ? ["member", value] : index);
                object.entries[object.entries.length - 1].location = (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)(
                    set ? "cl_member_location" : "cl_index_location",
                    set ? index + 1 : index,
                );
            });
            break;
        case "DICT":
            object.label = (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_dict", id);
            object.keyHeading = (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_key");
            supported = pairs(raw.slice(1));
            break;
        case "INSTANCE":
        case "INSTANCE_PPRINT":
        case "CLASS": {
            object.label = (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)(tag === "CLASS" ? "cl_class" : "cl_instance", raw[1], id);
            object.keyHeading = (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_attribute");
            const start = tag === "INSTANCE" ? 2 : 3;
            if (tag === "INSTANCE_PPRINT") namedRow((0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_representation"), raw[2]);
            if (tag === "CLASS") namedRow((0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_bases"), (raw[2] ?? []).join(", "));
            supported = pairs(raw.slice(start), true);
            break;
        }
        case "FUNCTION":
            object.label = (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_function", id);
            namedRow((0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_signature"), raw[1]);
            // Scope is a frame relationship, not a heap reference.
            object.enclosingFrame = raw[2] === null ? null : String(raw[2]);
            for (const [name, value] of raw[3] ?? []) {
                namedRow((0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_default", name), value);
            }
            break;
        case "HEAP_PRIMITIVE":
            object.label = (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_primitive", raw[1], id);
            namedRow((0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_value"), raw[2]);
            break;
        default:
            supported = false;
    }
    if (!supported) {
        object.entries = [];
        object.unsupported = (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_unknown_object", JSON.stringify(raw));
    }
    return object;
}

function normalizeMemory(entry, language = "py3") {
    return {
        globals: bindings(entry.globals, entry.ordered_globals, ["global"], language),
        frames: (entry.stack_to_render ?? []).map((frame, index) => {
            const id = String(frame.frame_id ?? frame.unique_hash ?? index);
            return {
                id,
                key: memoryKey("frame", id),
                label: (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_frame", frame.func_name, id),
                active: Boolean(frame.is_highlighted),
                retained: Boolean(frame.is_zombie),
                parents: (frame.parent_frame_id_list ?? []).map(String),
                bindings: bindings(
                    frame.encoded_locals,
                    frame.ordered_varnames,
                    ["frame", id, "local"],
                    language,
                ),
            };
        }),
        objects: new Map(
            Object.entries(entry.heap ?? {}).map(([id, raw]) => [
                id, normalizeObject(id, raw, language),
            ]),
        ),
    };
}

function valueText(value, memory) {
    if (value.kind === "struct" || value.kind === "array") {
        return (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_aggregate_value", value.type, value.address);
    }
    if (value.kind !== "reference") return value.text;
    const target = memory.objects.get(value.id);
    return target
        ? (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_reference", target.label)
        : (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_missing_reference", value.id);
}

// Diffs operate on snapshot values, never on the DOM or a recursive expansion.
function memoryChanges(previous, current) {
    if (!previous) return [];
    const changes = [];
    function change(key, text) {
        changes.push({ key, text });
    }
    function compareRows(before, after, scope) {
        const oldRows = new Map(before.map((row) => [row.key, row]));
        const newRows = new Map(after.map((row) => [row.key, row]));
        for (const [key, row] of newRows) {
            const old = oldRows.get(key);
            const name = row.location ?? (
                typeof row.name === "string" ? row.name : valueText(row.name, current)
            );
            const label = (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_location", scope, name);
            const value = valueText(row.value, current);
            if (!old) change(key, (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_added", label, value));
            else if ((row.value.kind === "struct" || row.value.kind === "array") &&
                old.value.kind === row.value.kind && old.value.address === row.value.address &&
                old.value.type === row.value.type) {
                compareRows(aggregateRows(old.value, key), aggregateRows(row.value, key), label);
            } else if (JSON.stringify(old.value) !== JSON.stringify(row.value)) {
                change(key, (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_value_changed", label, valueText(old.value, previous), value));
            }
        }
        for (const [key, row] of oldRows) {
            if (!newRows.has(key)) {
                const name = row.location ?? (
                    typeof row.name === "string" ? row.name : valueText(row.name, previous)
                );
                change(key, (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_removed",
                    (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_location", scope, name), valueText(row.value, previous),
                ));
            }
        }
    }
    compareRows(previous.globals, current.globals, (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_globals"));
    function compareGroups(before, after, rows) {
        const oldGroups = new Map(before.map((group) => [group.key, group]));
        const newGroups = new Map(after.map((group) => [group.key, group]));
        for (const [key, group] of newGroups) {
            const old = oldGroups.get(key);
            if (!old) change(key, (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_new_item", group.label));
            else {
                compareRows(rows(old), rows(group), group.label);
                if (old.unsupported !== group.unsupported || old.enclosingFrame !== group.enclosingFrame) {
                    change(key, (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_value_changed", group.label,
                        old.unsupported ?? old.enclosingFrame ?? (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_global_scope"),
                        group.unsupported ?? group.enclosingFrame ?? (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_global_scope")));
                }
            }
        }
        for (const [key, group] of oldGroups) {
            if (!newGroups.has(key)) change(key, (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_removed_item", group.label));
        }
    }
    compareGroups(previous.frames, current.frames, (frame) => frame.bindings);
    compareGroups(
        [...previous.objects.values()],
        [...current.objects.values()],
        (object) => object.entries,
    );
    return changes;
}


/***/ }),

/***/ 42020:
/*!*********************************************************!*\
  !*** ./runestone/codelens/frontend/frontend-i18n.en.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/rsi18n.js */ 54250);


(0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.load)({
    en: {
        "cl_viewer": "CodeLens trace viewer prototype",
        "cl_trace": "CodeLens trace",
        "cl_code": "Code",
        "cl_viewer_layout": "Viewer layout",
        "cl_layout_auto": "Automatic",
        "cl_layout_side-by-side": "Side by side",
        "cl_layout_stacked": "Above/below",
        "cl_line": "Line $1",
        "cl_no_line": "No source line",
        "cl_current_line": "Current line. ",
        "cl_next": "Next step",
        "cl_previous": "Previous step",
        "cl_step": "Step $1 of $2. $3.",
        "cl_output": "Program output",
        "cl_new_output": "New output: $1",
        "cl_output_changed": "Program output changed.",
        "cl_whitespace": "whitespace",
        "cl_memory": "Memory",
        "cl_memory_view": "Memory view",
        "cl_diagram": "Diagram",
        "cl_graphical": "Graphical Diagram",
        "cl_text": "Text",
        "cl_memory_help": "References link to heap objects. All views contain the same information.",
        "cl_graph_help": "Drag a Move button, use its arrow keys (Shift moves farther), or select an object and use the movement buttons. Escape cancels a drag. Positions persist across steps and views. Scroll to explore larger diagrams.",
        "cl_graph_viewport": "Graphical memory diagram",
        "cl_arrange": "Arrange automatically",
        "cl_reset_positions": "Reset positions",
        "cl_move_object": "Move heap object",
        "cl_move_node": "Move $1",
        "cl_move_left": "Move left",
        "cl_move_right": "Move right",
        "cl_move_up": "Move up",
        "cl_move_down": "Move down",
        "cl_arranging": "Arranging heap objects…",
        "cl_arranged": "Heap objects arranged. Move them to adjust the layout.",
        "cl_positions_kept": "Saved heap positions retained.",
        "cl_layout_failed": "Automatic layout is unavailable. You can still move objects, switch views, or select Arrange automatically to retry.",
        "cl_node_position": "$1 positioned at $2, $3.",
        "cl_stack": "Stack and globals",
        "cl_globals": "Global variables",
        "cl_no_globals": "No global variables at this step.",
        "cl_no_locals": "No local variables in this frame.",
        "cl_heap": "Heap objects",
        "cl_frame": "$1 — frame $2",
        "cl_active": "Active frame",
        "cl_retained": "Retained frame (returned)",
        "cl_parent": "Enclosing frame $1",
        "cl_global_scope": "Global scope",
        "cl_enclosing": "Enclosing scope",
        "cl_return": "Return value",
        "cl_name": "Name",
        "cl_value": "Value",
        "cl_address": "Address: $1",
        "cl_type": "Type: $1",
        "cl_c_array": "Array $1",
        "cl_memory_chunk": "Memory at $1",
        "cl_array_type": "array",
        "cl_field": "Field",
        "cl_c_struct": "$1 at $2",
        "cl_aggregate_value": "$1 at $2",
        "cl_nested_table": "$1: $2 members",
        "cl_index": "Index",
        "cl_key": "Key",
        "cl_attribute": "Attribute",
        "cl_member": "Member",
        "cl_list": "List $1",
        "cl_tuple": "Tuple $1",
        "cl_set": "Set $1",
        "cl_dict": "Dictionary $1",
        "cl_instance": "$1 instance $2",
        "cl_class": "$1 class $2",
        "cl_function": "Function $1",
        "cl_primitive": "$1 object $2",
        "cl_object": "Object $1 ($2)",
        "cl_reference": "Reference to $1",
        "cl_missing_reference": "Reference to object $1 (not present in this snapshot)",
        "cl_pointer_reference": "$1: Reference to $2",
        "cl_pointer_target": "$1. Type: $2. Address: $3.",
        "cl_null_pointer": "Null pointer",
        "cl_missing_pointer": "Target not present in this snapshot",
        "cl_unknown_value": "Unsupported value: $1",
        "cl_unknown_object": "Unsupported object encoding; raw trace data: $1",
        "cl_signature": "Signature",
        "cl_representation": "Representation",
        "cl_bases": "Base classes",
        "cl_default": "Default argument $1",
        "cl_empty": "No entries.",
        "cl_changes": "Changes this step ($1)",
        "cl_changed": "Changed",
        "cl_added": "$1 added: $2.",
        "cl_removed": "$1 removed (was $2).",
        "cl_value_changed": "$1 changed from $2 to $3.",
        "cl_new_item": "$1 added.",
        "cl_removed_item": "$1 removed.",
        "cl_location": "$1, $2",
        "cl_index_location": "index $1",
        "cl_member_location": "member $1",
        "cl_more_changes": "$1 more changes available in Changes this step.",
    },
});


/***/ }),

/***/ 58753:
/*!*******************************************************!*\
  !*** ./runestone/codelens/frontend/connector-path.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   curvedConnectorPath: () => (/* binding */ curvedConnectorPath)
/* harmony export */ });
// Round routed corners without moving endpoints or cutting across object cards.
function curvedConnectorPath(points, radius = 20) {
    const route = points.filter((point, index) => index === 0 ||
        point.x !== points[index - 1].x || point.y !== points[index - 1].y);
    if (route.length === 0) return "";
    let path = `M ${route[0].x} ${route[0].y}`;
    for (let index = 1; index < route.length - 1; index++) {
        const previous = route[index - 1];
        const corner = route[index];
        const next = route[index + 1];
        const before = Math.hypot(corner.x - previous.x, corner.y - previous.y);
        const after = Math.hypot(next.x - corner.x, next.y - corner.y);
        // Half-segment limits keep adjacent curves apart and leave a straight
        // final approach so the arrowhead stays aligned with its tail.
        const bend = Math.min(radius, before / 2, after / 2);
        const entry = {
            x: corner.x + (previous.x - corner.x) * bend / before,
            y: corner.y + (previous.y - corner.y) * bend / before,
        };
        const exit = {
            x: corner.x + (next.x - corner.x) * bend / after,
            y: corner.y + (next.y - corner.y) * bend / after,
        };
        path += ` L ${entry.x} ${entry.y} Q ${corner.x} ${corner.y} ${exit.x} ${exit.y}`;
    }
    const end = route[route.length - 1];
    return route.length === 1 ? path : `${path} L ${end.x} ${end.y}`;
}


/***/ }),

/***/ 59078:
/*!***********************************************************!*\
  !*** ./runestone/codelens/frontend/vendor/ELK-LICENSE.md ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "7da653ce01858911.md";

/***/ }),

/***/ 71469:
/*!****************************************************!*\
  !*** ./runestone/codelens/frontend/memory-view.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createMemoryView: () => (/* binding */ createMemoryView)
/* harmony export */ });
/* harmony import */ var _common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/rsi18n.js */ 54250);
/* harmony import */ var _memory_model_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./memory-model.js */ 32171);
/* harmony import */ var _graphical_heap_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./graphical-heap.js */ 74010);
/* harmony import */ var _connector_path_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./connector-path.js */ 58753);





let nextViewId = 0;
const svgNamespace = "http://www.w3.org/2000/svg";

function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
}

function svgElement(tag, attributes) {
    const node = document.createElementNS(svgNamespace, tag);
    for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, value);
    return node;
}

/** Three layouts of one semantic tree. Only the connector overlay is aria-hidden. */
function createMemoryView({ hasHeap = true } = {}) {
    const prefix = `rs-cl-memory-${++nextViewId}`;
    const root = element("section", "rs-codelens-memory");
    const heading = element("h3", null, (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_memory"));
    heading.id = `${prefix}-heading`;
    heading.tabIndex = -1;
    root.setAttribute("aria-labelledby", heading.id);
    const viewControls = element("fieldset", "rs-codelens-memory__view-controls");
    viewControls.append(element("legend", null, (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_memory_view")));
    const stage = element("div", "rs-codelens-memory__stage");
    const viewport = element("div", "rs-codelens-memory__viewport");
    viewport.dataset.view = "diagram";
    stage.dataset.view = "diagram";
    stage.dataset.hasHeap = String(hasHeap);
    for (const mode of ["diagram", "graphical", "text"]) {
        const label = element("label");
        const radio = element("input");
        radio.type = "radio";
        radio.name = `${prefix}-view`;
        radio.value = mode;
        radio.checked = mode === "diagram";
        radio.addEventListener("change", () => {
            if (radio.checked) {
                stage.dataset.view = mode;
                viewport.dataset.view = mode;
                viewport.tabIndex = mode === "graphical" ? 0 : -1;
                if (mode === "graphical") {
                    viewport.setAttribute("role", "region");
                    viewport.setAttribute("aria-label", (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_graph_viewport"));
                } else {
                    viewport.removeAttribute("role");
                    viewport.removeAttribute("aria-label");
                }
                graphical.setEnabled(mode === "graphical" && hasHeap);
                scheduleDraw();
            }
        });
        label.append(radio, document.createTextNode(` ${(0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)(`cl_${mode}`)}`));
        viewControls.append(label);
    }
    const help = element("p", "rs-codelens-memory__help", (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_memory_help"));
    const overlay = svgElement("svg", {
        class: "rs-codelens-memory__connectors",
        "aria-hidden": "true",
        focusable: "false",
    });
    const stack = element("section", "rs-codelens-memory__column rs-codelens-memory__column--stack");
    const heap = element("section", "rs-codelens-memory__column rs-codelens-memory__column--heap");
    heap.hidden = !hasHeap;
    const heapCanvas = element("div", "rs-codelens-memory__heap-canvas");
    const graphical = (0,_graphical_heap_js__WEBPACK_IMPORTED_MODULE_2__.createGraphicalHeap)({ canvas: heapCanvas, prefix, onChange: scheduleDraw });
    const changeDetails = element("details", "rs-codelens-memory__changes");
    const changeSummary = element("summary");
    const changeList = element("ul");
    changeDetails.append(changeSummary, changeList);
    changeDetails.hidden = true;
    stage.append(overlay, stack, heap);
    viewport.append(stage);
    root.append(heading, viewControls, help, graphical.element, viewport, changeDetails);

    let references = [];
    let targets = new Map();
    let pointerTargets = new Map();
    let pendingPointers = [];
    let frameTargets = new Map();
    let pendingDraw = null;
    let destroyed = false;
    let activeReference = null;

    function scheduleDraw() {
        if (pendingDraw !== null || destroyed) return;
        pendingDraw = window.requestAnimationFrame(() => {
            pendingDraw = null;
            if (!destroyed && root.isConnected) drawConnectors();
        });
    }

    function drawConnectors() {
        overlay.replaceChildren();
        if (stage.dataset.view === "text") return;
        const bounds = stage.getBoundingClientRect();
        if (bounds.width === 0 || bounds.height === 0) return;
        overlay.setAttribute("viewBox", `0 0 ${bounds.width} ${bounds.height}`);
        const defs = svgElement("defs", {});
        const marker = svgElement("marker", {
            id: `${prefix}-arrow`, viewBox: "0 0 10 10", refX: "9", refY: "5",
            markerWidth: "6", markerHeight: "6", orient: "auto-start-reverse",
        });
        marker.append(svgElement("path", { d: "M 0 0 L 10 5 L 0 10 z" }));
        defs.append(marker);
        overlay.append(defs);
        for (const [index, reference] of references.entries()) {
            const target = reference.target;
            if (!target) continue;
            const sourceCard = reference.link.closest(".rs-codelens-memory__card");
            const targetCard = target.closest(".rs-codelens-memory__card");
            const sourceRect = sourceCard.getBoundingClientRect();
            const cellRect = reference.link.closest("td, th").getBoundingClientRect();
            const targetCell = target.matches("th") ? target.nextElementSibling : null;
            const targetRect = (targetCell ?? targetCard).getBoundingClientRect();
            const targetHeading = (targetCell ?? target).getBoundingClientRect();
            const x1 = cellRect.right - bounds.left;
            const y1 = cellRect.top + cellRect.height / 2 - bounds.top;
            const y2 = targetHeading.top + targetHeading.height / 2 - bounds.top;
            let path;
            const route = stage.dataset.view === "graphical" && graphical.routeFor(reference);
            if (route?.length > 1) {
                const canvasBounds = heapCanvas.getBoundingClientRect();
                path = (0,_connector_path_js__WEBPACK_IMPORTED_MODULE_3__.curvedConnectorPath)([{ x: x1, y: y1 }, ...route.map((point) => ({
                    x: point.x + canvasBounds.left - bounds.left,
                    y: point.y + canvasBounds.top - bounds.top,
                }))]);
            } else if (stage.dataset.view === "graphical" && !sourceCard.dataset.heapId &&
                targetRect.left > heapCanvas.getBoundingClientRect().left + targetRect.width) {
                // Reach later heap columns through the top gutter, without making
                // an obscured stack edge appear to originate in an intervening card.
                const exit = x1 + 12 + (index % 4) * 4;
                const top = heapCanvas.getBoundingClientRect().top - bounds.top + 8;
                const end = targetRect.left + targetRect.width / 2 - bounds.left;
                path = (0,_connector_path_js__WEBPACK_IMPORTED_MODULE_3__.curvedConnectorPath)([
                    { x: x1, y: y1 }, { x: exit, y: y1 },
                    { x: exit, y: top }, { x: end, y: top },
                    { x: end, y: targetRect.top - bounds.top },
                ]);
            } else if (sourceRect.right < targetRect.left) {
                const x2 = targetRect.left - bounds.left;
                // Finish the bend before the marker, leaving a straight approach.
                const approach = x2 - Math.min(18, (x2 - x1) / 3);
                const middle = (x1 + approach) / 2;
                path = `M ${x1} ${y1} C ${middle} ${y1}, ${middle} ${y2}, ${approach} ${y2} L ${x2} ${y2}`;
            } else {
                // Same-column and cyclic edges run in the right-hand gutter.
                const x2 = targetRect.right - bounds.left;
                const approach = x2 + 18;
                const outside = Math.max(x1, approach) + 14 + (index % 4) * 5;
                path = `M ${x1} ${y1} C ${outside} ${y1}, ${outside} ${y1}, ${outside} ${(y1 + y2) / 2} S ${outside} ${y2}, ${approach} ${y2} L ${x2} ${y2}`;
            }
            reference.path = svgElement("path", {
                class: "rs-codelens-memory__edge",
                d: path,
                "marker-end": `url(#${prefix}-arrow)`,
            });
            overlay.append(reference.path);
        }
        highlightReference(activeReference);
    }

    function highlightReference(link) {
        activeReference = link;
        for (const node of root.querySelectorAll(".rs-codelens-memory__card--referenced, .rs-codelens-memory__target--referenced")) {
            node.classList.remove("rs-codelens-memory__card--referenced", "rs-codelens-memory__target--referenced");
        }
        for (const reference of references) {
            const selected = reference.link === link;
            reference.path?.classList.toggle("rs-codelens-memory__edge--active", selected);
            if (selected) {
                reference.target.closest(".rs-codelens-memory__card").classList.add("rs-codelens-memory__card--referenced");
                if (reference.target.matches("th")) reference.target.classList.add("rs-codelens-memory__target--referenced");
            }
        }
    }

    function registerPointerTarget(address, node, label) {
        const id = (0,_memory_model_js__WEBPACK_IMPORTED_MODULE_1__.cAddress)(address);
        // An allocation/struct and its first member can share an address. The
        // containing object is registered first and remains the primary target.
        if (id && id !== "0x0" && !pointerTargets.has(id)) pointerTargets.set(id, { node, label });
    }

    function referenceLink(text, target, key, id, accessibleName) {
        const link = element("a", "rs-codelens-memory__reference", text);
        link.href = `#${target.id}`;
        link.dataset.memoryFocus = key;
        if (accessibleName) {
            link.setAttribute("aria-label", accessibleName);
            link.title = accessibleName;
        }
        link.addEventListener("click", (event) => {
            event.preventDefault();
            target.focus();
            target.scrollIntoView?.({ block: "nearest" });
        });
        references.push({ id, link, target });
        return link;
    }

    function renderValue(value, memory, key, changedKeys = new Set(), context = "") {
        if (value.kind === "struct" || value.kind === "array") {
            return table((0,_memory_model_js__WEBPACK_IMPORTED_MODULE_1__.aggregateRows)(value, key), memory,
                (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)(value.kind === "array" ? "cl_index" : "cl_field"), (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_empty"), changedKeys,
                (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_nested_table", context, value.type));
        }
        const text = (0,_memory_model_js__WEBPACK_IMPORTED_MODULE_1__.valueText)(value, memory);
        if (value.kind === "pointer") {
            const placeholder = element("span", null, text);
            pendingPointers.push({ value, placeholder, key });
            return placeholder;
        }
        if (value.kind !== "reference" || !targets.has(value.id)) return element("span", null, text);
        return referenceLink(text, targets.get(value.id), key, value.id);
    }

    function table(rows, memory, keyHeading, emptyMessage, changedKeys, accessibleName, valueOnly = false) {
        if (rows.length === 0) return element("p", "rs-codelens-memory__empty", emptyMessage);
        const node = element("table", "rs-codelens-prototype__memory");
        if (valueOnly) node.classList.add("rs-codelens-memory__table--value-only");
        if (rows.some((row) => row.value.kind === "struct" || row.value.kind === "array")) {
            node.classList.add("rs-codelens-memory__table--aggregate");
        }
        if (accessibleName) node.setAttribute("aria-label", accessibleName);
        const head = element("thead");
        const header = element("tr");
        for (const name of valueOnly ? [(0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_value")] : [keyHeading, (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_value")]) {
            const cell = element("th", null, name);
            cell.scope = "col";
            header.append(cell);
        }
        head.append(header);
        const body = element("tbody");
        for (const row of rows) {
            const tr = element("tr");
            const label = element("th");
            label.scope = "row";
            if (typeof row.name === "string") label.textContent = row.name;
            else label.append(renderValue(row.name, memory, `${row.key}-key`));
            if (row.value.address !== undefined) {
                const metadata = element("span", "rs-codelens-memory__variable-metadata");
                metadata.append(
                    element("span", null, (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_address", row.value.address)),
                    element("span", null, (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_type", row.value.type)),
                );
                label.append(metadata);
            }
            const cell = element("td");
            const name = typeof row.name === "string" ? row.name : (0,_memory_model_js__WEBPACK_IMPORTED_MODULE_1__.valueText)(row.name, memory);
            if (!valueOnly && (0,_memory_model_js__WEBPACK_IMPORTED_MODULE_1__.cAddress)(row.value.address)) {
                label.id = `${prefix}-address-${encodeURIComponent(row.key)}`;
                label.tabIndex = -1;
                label.dataset.memoryFocus = (0,_memory_model_js__WEBPACK_IMPORTED_MODULE_1__.memoryKey)(row.key, "address");
                label.setAttribute("aria-label", (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_pointer_target", name, row.value.type, row.value.address));
                registerPointerTarget(row.value.address, label, `${name} (${row.value.type})`);
            }
            // Use the row identity for embedded fields, independent of DOM nesting.
            cell.append(renderValue(row.value, memory, row.key, changedKeys, name));
            if (row.value.kind === "struct" || row.value.kind === "array") {
                cell.classList.add("rs-codelens-memory__aggregate-cell");
            }
            if (changedKeys.has(row.key)) {
                tr.classList.add("rs-codelens-memory__row--changed");
                cell.append(" ", element("span", "rs-codelens-memory__changed", (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_changed")));
            }
            if (!valueOnly) tr.append(label);
            tr.append(cell);
            body.append(tr);
        }
        node.append(head, body);
        return node;
    }

    function card(title, key, id, changedKeys) {
        const node = element("section", "rs-codelens-memory__card");
        const titleNode = element("h5", null, title);
        titleNode.id = id;
        titleNode.tabIndex = -1;
        titleNode.dataset.memoryFocus = key;
        node.setAttribute("aria-labelledby", id);
        node.append(titleNode);
        if (changedKeys.has(key)) node.append(element("p", "rs-codelens-memory__changed", (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_changed")));
        return { node, titleNode };
    }

    function scopeLink(id, key) {
        const label = (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_parent", id);
        const target = frameTargets.get(id);
        if (!target) return element("span", null, label);
        const link = element("a", null, label);
        link.href = `#${target.id}`;
        link.dataset.memoryFocus = key;
        link.addEventListener("click", (event) => {
            event.preventDefault();
            target.focus();
            target.scrollIntoView?.({ block: "nearest" });
        });
        return link;
    }

    function update(memory, changes) {
        graphical.beforeUpdate();
        const focusedKey = root.contains(document.activeElement) ? document.activeElement.dataset.memoryFocus : null;
        const changedKeys = new Set(changes.map((change) => change.key));
        references = [];
        targets = new Map();
        pointerTargets = new Map();
        pendingPointers = [];
        frameTargets = new Map();
        activeReference = null;
        const stackHeading = element("h4", null, (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_stack"));
        stackHeading.id = `${prefix}-stack`;
        stack.setAttribute("aria-labelledby", stackHeading.id);
        const heapHeading = element("h4", null, (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_heap"));
        heapHeading.id = `${prefix}-heap`;
        heap.setAttribute("aria-labelledby", heapHeading.id);
        stack.replaceChildren(stackHeading);
        heap.replaceChildren(heapHeading, heapCanvas);
        heapCanvas.replaceChildren();

        // Register every target before creating reference links, including cycles.
        const objectCards = new Map();
        for (const [id, object] of memory.objects) {
            const item = card(object.label, object.key, `${prefix}-object-${encodeURIComponent(id)}`, changedKeys);
            item.node.dataset.heapId = id;
            targets.set(id, item.titleNode);
            if (object.tag.startsWith("C_")) registerPointerTarget(id, item.titleNode, object.label);
            objectCards.set(id, item.node);
        }
        const frameCards = new Map();
        for (const frame of memory.frames) {
            const item = card(frame.label, frame.key, `${prefix}-frame-${encodeURIComponent(frame.id)}`, changedKeys);
            frameTargets.set(frame.id, item.titleNode);
            frameCards.set(frame.id, item.node);
        }
        const globals = card((0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_globals"), (0,_memory_model_js__WEBPACK_IMPORTED_MODULE_1__.memoryKey)("global"), `${prefix}-globals`, changedKeys).node;
        globals.append(table(memory.globals, memory, (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_name"), (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_no_globals"), changedKeys));
        stack.append(globals);
        for (const frame of memory.frames) {
            const node = frameCards.get(frame.id);
            if (frame.active) {
                node.classList.add("rs-codelens-memory__card--active");
                node.append(element("p", "rs-codelens-memory__frame-status", (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_active")));
            }
            if (frame.retained) node.append(element("p", null, (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_retained")));
            for (const parent of frame.parents) {
                const line = element("p");
                line.append(scopeLink(parent, (0,_memory_model_js__WEBPACK_IMPORTED_MODULE_1__.memoryKey)("frame", frame.id, "parent", parent)));
                node.append(line);
            }
            node.append(table(frame.bindings, memory, (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_name"), (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_no_locals"), changedKeys));
            stack.append(node);
        }
        for (const [id, object] of memory.objects) {
            const node = objectCards.get(id);
            if (object.unsupported) node.append(element("pre", "rs-codelens-memory__raw", object.unsupported));
            else {
                if (object.tag === "FUNCTION") {
                    const scope = element("p");
                    scope.append(`${(0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_enclosing")}: `, object.enclosingFrame === null ? (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_global_scope") : scopeLink(object.enclosingFrame, (0,_memory_model_js__WEBPACK_IMPORTED_MODULE_1__.memoryKey)("heap", id, "scope")));
                    node.append(scope);
                }
                if (object.singleElement) {
                    const entry = object.entries[0];
                    const aggregate = entry.value.kind === "struct" || entry.value.kind === "array";
                    node.dataset.aggregate = String(aggregate);
                    node.append(aggregate
                        ? renderValue(entry.value, memory, entry.key, changedKeys, object.label)
                        : table(object.entries, memory, object.keyHeading, (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_empty"), changedKeys, object.label, true));
                } else {
                    node.append(table(object.entries, memory, object.keyHeading, (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_empty"), changedKeys));
                }
            }
            heapCanvas.append(node);
        }
        for (const { value, placeholder, key } of pendingPointers) {
            const target = pointerTargets.get(value.id);
            if (target) {
                const heapId = target.node.closest("[data-heap-id]")?.dataset.heapId;
                placeholder.replaceWith(referenceLink(value.text, target.node, key, heapId,
                    (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_pointer_reference", value.text, target.label)));
            } else {
                const description = (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)(value.id === "0x0" ? "cl_null_pointer" : "cl_missing_pointer");
                placeholder.title = description;
                placeholder.append(element("span", "rs-codelens-prototype__sr-only", ` (${description})`));
            }
        }
        let stackDepth = 0;
        let heapDepth = 0;
        for (const node of [...stack.querySelectorAll(".rs-codelens-memory__card"), ...objectCards.values()]) {
            let depth = node.dataset.aggregate === "true" ? 1 : 0;
            for (const nested of node.querySelectorAll("table")) {
                let level = 0;
                let parent = nested.parentElement.closest("table");
                while (parent && node.contains(parent)) {
                    level++;
                    parent = parent.parentElement.closest("table");
                }
                depth = Math.max(depth, level);
            }
            node.style.setProperty("--cl-card-width", `${16 + depth * 10}rem`);
            if (node.dataset.heapId !== undefined) heapDepth = Math.max(heapDepth, depth);
            else stackDepth = Math.max(stackDepth, depth);
        }
        stage.style.setProperty("--cl-stack-width", `${16 + stackDepth * 10}rem`);
        stage.style.setProperty("--cl-heap-width", `${16 + heapDepth * 10}rem`);
        stage.dataset.hasNested = String(stackDepth > 0 || heapDepth > 0);
        graphical.sync(objectCards, references);
        changeSummary.textContent = (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_changes", changes.length);
        changeList.replaceChildren(...changes.map((change) => element("li", null, change.text)));
        changeDetails.hidden = changes.length === 0;
        if (focusedKey) {
            const replacement = [...root.querySelectorAll("[data-memory-focus]")].find((node) => node.dataset.memoryFocus === focusedKey);
            (replacement ?? heading).focus();
        }
        scheduleDraw();
    }

    stage.addEventListener("focusin", (event) => highlightReference(event.target.closest(".rs-codelens-memory__reference")));
    stage.addEventListener("focusout", () => highlightReference(null));
    stage.addEventListener("pointerover", (event) => {
        const link = event.target.closest(".rs-codelens-memory__reference");
        if (link) highlightReference(link);
    });
    stage.addEventListener("pointerout", () => highlightReference(document.activeElement.closest?.(".rs-codelens-memory__reference")));
    const resizeObserver = typeof ResizeObserver === "function" ? new ResizeObserver(scheduleDraw) : null;
    resizeObserver?.observe(stage);
    window.addEventListener("resize", scheduleDraw);
    return {
        element: root,
        update,
        destroy() {
            destroyed = true;
            graphical.destroy();
            resizeObserver?.disconnect();
            window.removeEventListener("resize", scheduleDraw);
            if (pendingDraw !== null) window.cancelAnimationFrame(pendingDraw);
        },
    };
}


/***/ }),

/***/ 73563:
/*!******************************************************!*\
  !*** ./runestone/codelens/frontend/trace-viewer.css ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 74010:
/*!*******************************************************!*\
  !*** ./runestone/codelens/frontend/graphical-heap.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createGraphicalHeap: () => (/* binding */ createGraphicalHeap)
/* harmony export */ });
/* harmony import */ var _common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/rsi18n.js */ 54250);
/* harmony import */ var _elk_layout_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./elk-layout.js */ 85687);



const padding = 24;
const directions = { left: [-1, 0], right: [1, 0], up: [0, -1], down: [0, 1] };

function element(tag, text) {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    return node;
}

function sizeOf(card) {
    const rect = card.getBoundingClientRect();
    return {
        width: rect.width || parseFloat(card.style.getPropertyValue("--cl-card-width")) * 16 || 256,
        height: rect.height || 100 + card.querySelectorAll("tbody tr").length * 32,
    };
}

function freePosition(candidate, size, occupied) {
    const position = { x: Math.max(padding, candidate.x), y: Math.max(padding, candidate.y) };
    // Place newly appearing objects without moving existing or manually placed ones.
    for (let attempt = 0; attempt <= occupied.length; attempt++) {
        const collision = occupied.find((other) =>
            position.x < other.x + other.width + padding &&
            position.x + size.width + padding > other.x &&
            position.y < other.y + other.height + padding &&
            position.y + size.height + padding > other.y,
        );
        if (!collision) break;
        position.y = collision.y + collision.height + padding;
    }
    return position;
}

/** Own positions and interactions; the semantic cards still belong to memory-view. */
function createGraphicalHeap({ canvas, prefix, onChange }) {
    const controls = element("div");
    controls.className = "rs-codelens-memory__graph-controls";
    controls.hidden = true;
    const help = element("p", (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_graph_help"));
    help.id = `${prefix}-graph-help`;
    const actions = element("div");
    actions.className = "rs-codelens-prototype__controls";
    const arrange = element("button", (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_arrange"));
    const reset = element("button", (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_reset_positions"));
    const label = element("label", (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_move_object"));
    const select = element("select");
    select.id = `${prefix}-move-object`;
    label.htmlFor = select.id;
    const movement = element("div");
    movement.className = "rs-codelens-memory__movement";
    const moveButtons = [];
    for (const direction of Object.keys(directions)) {
        const button = element("button", (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)(`cl_move_${direction}`));
        button.type = "button";
        button.addEventListener("click", () => moveSelected(direction));
        moveButtons.push(button);
        movement.append(button);
    }
    const status = element("p");
    status.setAttribute("role", "status");
    status.setAttribute("aria-atomic", "true");
    arrange.type = reset.type = "button";
    actions.append(arrange, reset);
    movement.prepend(label, select);
    controls.append(help, actions, movement, status);

    let cards = new Map();
    let references = [];
    const positions = new Map(); // Retain absent objects too, for backward stepping.
    const committed = new Set();
    let routes = new Map();
    let routeGeometry = null;
    let selectedId = null;
    let enabled = false;
    let destroyed = false;
    let revision = 0;
    let busy = false;
    let drag = null;
    const sizeObserver = typeof ResizeObserver === "function"
        ? new ResizeObserver(() => { if (enabled && !destroyed) applyPositions(); })
        : null;

    function message(key, ...args) {
        const text = (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)(key, ...args);
        if (status.textContent !== text) status.textContent = text;
    }

    function revealObject(id) {
        const viewport = canvas.closest(".rs-codelens-memory__viewport");
        if (!enabled || !viewport || !cards.has(id)) return;
        const bounds = viewport.getBoundingClientRect();
        if (!bounds.width || !bounds.height) return;
        const node = cards.get(id).getBoundingClientRect();
        const right = node.left + Math.min(node.width, viewport.clientWidth - 16);
        const bottom = node.top + Math.min(node.height, viewport.clientHeight - 16);
        // Scroll only the graph, so the movement controls stay in place.
        if (node.left < bounds.left + 8) viewport.scrollLeft -= bounds.left + 8 - node.left;
        else if (right > bounds.left + viewport.clientWidth - 8) viewport.scrollLeft += right - bounds.left - viewport.clientWidth + 8;
        if (node.top < bounds.top + 8) viewport.scrollTop -= bounds.top + 8 - node.top;
        else if (bottom > bounds.top + viewport.clientHeight - 8) viewport.scrollTop += bottom - bounds.top - viewport.clientHeight + 8;
    }

    function setBusy(value) {
        busy = value;
        arrange.setAttribute("aria-disabled", String(value || cards.size === 0));
        reset.setAttribute("aria-disabled", String(value || cards.size === 0));
    }

    function selectObject(id) {
        selectedId = cards.has(id) ? id : (cards.keys().next().value ?? null);
        select.value = selectedId ?? "";
        for (const [objectId, card] of cards) {
            card.classList.toggle("rs-codelens-memory__card--selected", objectId === selectedId);
        }
        select.disabled = cards.size === 0;
        moveButtons.forEach((button) => { button.disabled = cards.size === 0; });
    }

    function applyPositions() {
        if (!enabled) return;
        let width = 320;
        let height = 260;
        for (const [id, card] of cards) {
            const position = positions.get(id);
            if (!position) continue;
            card.style.left = `${position.x}px`;
            card.style.top = `${position.y}px`;
            const size = sizeOf(card);
            width = Math.max(width, position.x + size.width + 48);
            height = Math.max(height, position.y + size.height + 48);
        }
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        onChange();
    }

    function ensurePositions() {
        const occupied = [];
        for (const [id, card] of cards) {
            if (positions.has(id)) occupied.push({ ...positions.get(id), ...sizeOf(card) });
        }
        for (const [id, card] of cards) {
            if (positions.has(id)) continue;
            const size = sizeOf(card);
            const position = freePosition({ x: padding, y: padding }, size, occupied);
            positions.set(id, position);
            occupied.push({ ...position, ...size });
        }
        applyPositions();
    }

    function measureGraph() {
        const nodes = [...cards].map(([id, card]) => {
            const bounds = card.getBoundingClientRect();
            const heading = card.querySelector("h5").getBoundingClientRect();
            return { id, ...sizeOf(card), targetY: heading.height ? heading.top + heading.height / 2 - bounds.top : 24 };
        });
        const edges = references.flatMap((reference) => {
            const source = reference.link.closest("[data-heap-id]");
            if (!source || !cards.has(reference.id)) return [];
            const bounds = source.getBoundingClientRect();
            const link = reference.link.closest("td, th").getBoundingClientRect();
            return [{
                key: reference.link.dataset.memoryFocus,
                source: source.dataset.heapId,
                target: reference.id,
                y: link.height ? link.top + link.height / 2 - bounds.top : 64,
            }];
        });
        return { nodes, edges };
    }

    async function runLayout(replaceAll = false) {
        if (!enabled || destroyed || cards.size === 0) return;
        const targets = new Set([...cards.keys()].filter((id) => replaceAll || !committed.has(id)));
        if (targets.size === 0) {
            message("cl_positions_kept");
            return;
        }
        const request = ++revision;
        const isCurrent = () => request === revision && enabled && !destroyed;
        const geometry = measureGraph();
        setBusy(true);
        message("cl_arranging");
        try {
            const result = await (0,_elk_layout_js__WEBPACK_IMPORTED_MODULE_1__.layoutHeap)(geometry.nodes, geometry.edges, isCurrent);
            if (!isCurrent() || !result) return;
            const occupied = [...cards].filter(([id]) => !targets.has(id))
                .map(([id, card]) => ({ ...positions.get(id), ...sizeOf(card) }));
            for (const node of geometry.nodes) {
                if (!targets.has(node.id)) continue;
                const desired = result.positions.get(node.id);
                const position = replaceAll || targets.size === cards.size
                    ? desired : freePosition(desired, node, occupied);
                positions.set(node.id, position);
                committed.add(node.id);
                occupied.push({ ...position, ...node });
            }
            routes = result.routes;
            routeGeometry = { ...geometry, positions: result.positions };
            setBusy(false);
            message("cl_arranged");
            applyPositions();
        } catch (error) {
            if (!isCurrent()) return;
            setBusy(false);
            message("cl_layout_failed");
            // Existing positions and the other views remain usable; Arrange retries.
            console.warn("CodeLens heap layout failed", error);
        }
    }

    function announcePosition(id) {
        const position = positions.get(id);
        const name = cards.get(id).querySelector("h5").textContent;
        message("cl_node_position", name, Math.round(position.x), Math.round(position.y));
    }

    function moveObject(id, x, y, announce = true) {
        if (!enabled || !cards.has(id)) return;
        revision++; // An in-flight automatic layout must not overwrite a user move.
        setBusy(false);
        routes.clear();
        positions.set(id, { x: Math.max(padding, x), y: Math.max(padding, y) });
        committed.add(id);
        selectObject(id);
        applyPositions();
        if (announce) {
            announcePosition(id);
            revealObject(id);
        }
    }

    function moveSelected(direction, distance = 16) {
        if (!selectedId || !enabled) return;
        const [dx, dy] = directions[direction];
        const position = positions.get(selectedId);
        moveObject(selectedId, position.x + dx * distance, position.y + dy * distance);
    }

    function finishDrag(cancelled = false) {
        if (!drag) return;
        const previous = drag;
        drag = null;
        if (previous.handle.hasPointerCapture?.(previous.pointerId)) {
            previous.handle.releasePointerCapture(previous.pointerId);
        }
        previous.handle.classList.remove("rs-codelens-memory__dragging");
        if (cancelled) moveObject(previous.id, previous.x, previous.y);
        else announcePosition(previous.id);
    }

    function addHandle(card, id) {
        const handle = element("button", (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.t)("cl_move_node", card.querySelector("h5").textContent));
        handle.type = "button";
        handle.className = "rs-codelens-memory__move-handle";
        handle.dataset.memoryFocus = JSON.stringify(["heap", id, "move"]);
        handle.setAttribute("aria-describedby", help.id);
        handle.addEventListener("click", () => selectObject(id));
        handle.addEventListener("pointerdown", (event) => {
            if (!enabled || event.button !== 0 || drag) return;
            event.preventDefault();
            selectObject(id);
            handle.focus({ preventScroll: true });
            const position = positions.get(id);
            drag = { id, ...position, clientX: event.clientX, clientY: event.clientY, pointerId: event.pointerId, handle };
            handle.setPointerCapture(event.pointerId);
            handle.classList.add("rs-codelens-memory__dragging");
        });
        handle.addEventListener("pointermove", (event) => {
            if (!drag || drag.handle !== handle || drag.pointerId !== event.pointerId) return;
            moveObject(id, drag.x + event.clientX - drag.clientX, drag.y + event.clientY - drag.clientY, false);
        });
        handle.addEventListener("pointerup", () => finishDrag());
        handle.addEventListener("pointercancel", () => finishDrag(true));
        handle.addEventListener("lostpointercapture", () => finishDrag(true));
        handle.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && drag) {
                event.preventDefault();
                finishDrag(true);
            }
            const direction = event.key.replace("Arrow", "").toLowerCase();
            if (!directions[direction]) return;
            event.preventDefault();
            selectObject(id);
            moveSelected(direction, event.shiftKey ? 64 : 16);
        });
        card.querySelector("h5").after(handle);
    }

    select.addEventListener("change", () => {
        selectObject(select.value);
        revealObject(selectedId);
    });
    arrange.addEventListener("click", () => { if (!busy) void runLayout(true); });
    reset.addEventListener("click", () => {
        if (busy || cards.size === 0) return;
        positions.clear();
        committed.clear();
        ensurePositions();
        void runLayout(true);
    });

    function beforeUpdate() {
        finishDrag(true);
        revision++;
        sizeObserver?.disconnect();
        if (busy) message("cl_positions_kept");
        setBusy(false);
    }

    return {
        element: controls,
        beforeUpdate,
        sync(nextCards, nextReferences) {
            cards = nextCards;
            references = nextReferences;
            select.replaceChildren(...[...cards].map(([id, card]) => {
                const option = element("option", card.querySelector("h5").textContent);
                option.value = id;
                addHandle(card, id);
                return option;
            }));
            selectObject(selectedId);
            setBusy(false);
            if (cards.size === 0) status.textContent = "";
            if (enabled) {
                for (const card of cards.values()) sizeObserver?.observe(card);
                ensurePositions();
                void runLayout();
            }
        },
        setEnabled(value) {
            beforeUpdate();
            enabled = value;
            controls.hidden = !value;
            if (value) {
                for (const card of cards.values()) sizeObserver?.observe(card);
                ensurePositions();
                void runLayout();
            } else {
                canvas.style.removeProperty("width");
                canvas.style.removeProperty("height");
                for (const card of cards.values()) {
                    card.style.removeProperty("left");
                    card.style.removeProperty("top");
                }
            }
            onChange();
        },
        routeFor(reference) {
            if (!enabled || !routeGeometry) return null;
            // ELK's shared target port is at the card heading. A pointer to an
            // interior field uses the live cell geometry instead.
            if (reference.target && !reference.target.matches("h5")) return null;
            const key = reference.link.dataset.memoryFocus;
            const edge = routeGeometry.edges.find((item) => item.key === key);
            if (!edge) return null;
            for (const id of [edge.source, edge.target]) {
                const expected = routeGeometry.positions.get(id);
                const actual = positions.get(id);
                const size = cards.has(id) && sizeOf(cards.get(id));
                const oldSize = routeGeometry.nodes.find((node) => node.id === id);
                if (!actual || !size || actual.x !== expected.x || actual.y !== expected.y ||
                    Math.abs(size.width - oldSize.width) > 1 || Math.abs(size.height - oldSize.height) > 1) return null;
            }
            const source = cards.get(edge.source).getBoundingClientRect();
            const link = reference.link.closest("td, th").getBoundingClientRect();
            if (link.height && Math.abs(link.top + link.height / 2 - source.top - edge.y) > 1) return null;
            return routes.get(key) ?? null;
        },
        destroy() {
            beforeUpdate();
            destroyed = true;
        },
    };
}


/***/ }),

/***/ 76412:
/*!*******************************************!*\
  !*** ./runestone/codelens/js/codelens.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/runestonebase.js */ 78673);
/* harmony import */ var _pytutor_embed_bundle_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./pytutor-embed.bundle.js */ 60764);
/* harmony import */ var _pytutor_embed_bundle_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_pytutor_embed_bundle_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _css_pytutor_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../css/pytutor.css */ 93473);
/* harmony import */ var _frontend_trace_viewer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../frontend/trace-viewer.js */ 23546);
/* harmony import */ var _frontend_trace_viewer_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../frontend/trace-viewer.css */ 73563);
/**
 * Created by bmiller on 5/10/15.
 */

/*
 Since I don't want to modify the codelens code I'll attach the logging functionality this way.
 This actually seems like a better way to do it maybe across the board to separate logging
 from the real funcionality.  It would also allow a better way of turning off/on logging..
 As long as Philip doesn't go and change the id values for the buttons and slider this will
 continue to work.... In the best of all worlds we might add a function to the visualizer to
 return the buttons, but I'm having a hard time thinking of any other use for that besides mine.
 */







function attachLoggers(codelens, divid) {
    let rb = new _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__["default"]();
    const root = document.getElementById(divid);
    for (const [buttonId, action] of [
        ["jmpFirstInstr", "first"],
        ["jmpLastInstr", "last"],
        ["jmpStepBack", "back"],
        ["jmpStepFwd", "fwd"],
    ]) {
        root.querySelector(
            `#${buttonId}, [data-codelens-action="${action}"]`,
        )?.addEventListener("click", () => {
            rb.logBookEvent({ event: "codelens", act: action, div_id: divid });
        });
    }
    // The legacy jQuery UI slider emits a jQuery event rather than a DOM event.
    codelens.domRoot?.find("#executionSlider").bind("slide", function () {
        rb.logBookEvent({ event: "codelens", act: "slide", div_id: divid });
    });
    // TODO: The component isn't quite fully initialized, but it also doesn't inherit from RunestoneBase. This is a convenient place to mark it ready for now, but it should be moved forward in time during a rewrite.
    rb.containerDiv = document.getElementById(divid);
    rb.indicate_component_ready();
}

function styleButtons(divid) {
    const root = document.getElementById(divid);
    for (const [buttonId, buttonClass, action] of [
        ["jmpFirstInstr", "btn-default"],
        ["jmpStepBack", "btn-danger"],
        ["jmpStepFwd", "btn-success", "fwd"],
        ["jmpLastInstr", "btn-default"],
    ]) {
        const selector = action
            ? `#${buttonId}, [data-codelens-action="${action}"]`
            : `#${buttonId}`;
        root.querySelector(selector)?.classList.add("btn", buttonClass);
    }
}

function renderVisualizer(data, divid, lang) {
    const options = {
        startingInstruction: data.startingInstruction || 0,
        editCodeBaseURL: null,
        hideCode: false,
        lang: lang,
    };
    const usePrototype =
        Array.isArray(data.trace) &&
        data.trace.length > 0 &&
        new URLSearchParams(window.location.search).get("codelensPrototype") ===
            divid &&
        !data.trace.some(
            (entry) =>
                entry.question ||
                entry.event === "raw_input" ||
                entry.event === "mouse_input",
        );
    return usePrototype
        ? (0,_frontend_trace_viewer_js__WEBPACK_IMPORTED_MODULE_3__.mountTraceViewer)(document.getElementById(divid), data, options)
        : addVisualizerToPage(data, divid, options);
}

if (typeof window.allVisualizers === "undefined") {
    window.allVisualizers = [];
}

if (typeof window.component_factory === "undefined") {
    window.component_factory = {};
}

window.component_factory.codelens = function (opts) {
    // opts is an object that will contain a key referencing the orignal dom element
    // often it will also have a key for  useRunestoneServices
    let el = opts.orig;
    let vel = el.querySelector(".pytutorVisualizer");
    let divid = vel.id;
    let lang = JSON.parse(vel.dataset.params).lang;
    // addVisualizerToPage comes from pytutor-embed
    // allTraceData is created by a series of script tags that when loaded create this
    // as a global object containing trace information.
    try {
        let vis = renderVisualizer(allTraceData[divid], divid, lang);
        attachLoggers(vis, divid);
        styleButtons(divid);
        window.allVisualizers.push(vis);
    } catch (err) {
        console.log(`Error rendering CodeLens Problem ${divid}`);
        console.log(err);
    }

};

window.addEventListener("codelens:answer", function (evt) {
    let rb = new _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__["default"]();
    rb.logBookEvent({
        event: "codelens",
        div_id: evt.detail.divid,
        act: "answer",
        answer: evt.detail.answer,
        correct: evt.detail.correct,
        percent: evt.detail.percent || 0,
    });
    console.log(evt);
});

// After all of the libraries are loaded...
$(document).on("runestone:login-complete", function () {
    if (typeof allTraceData !== "undefined") {
        for (let divid in allTraceData) {
            let cl = document.getElementById(divid);
            if (cl === null) {
                console.log(`Could not find element with id ${divid}`);
                return;
            }
            let lang = JSON.parse(cl.dataset.params).lang;
            try {
                if (divid in window.allTraceData) {
                    var vis = renderVisualizer(allTraceData[divid], divid, lang);
                } else {
                    alert(
                        `${divid} is missing trace data.  This is probably a build error. Please report it on github.`,
                    );
                }
                attachLoggers(vis, divid);
                styleButtons(divid);
                window.allVisualizers.push(vis);
            } catch (err) {
                console.log(`Error rendering CodeLens Problem ${divid}`);
                console.log(err);
            }
        }
    }
});


/***/ }),

/***/ 85687:
/*!***************************************************!*\
  !*** ./runestone/codelens/frontend/elk-layout.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   buildHeapGraph: () => (/* binding */ buildHeapGraph),
/* harmony export */   layoutHeap: () => (/* binding */ layoutHeap),
/* harmony export */   layoutWithElk: () => (/* binding */ layoutWithElk),
/* harmony export */   loadElk: () => (/* binding */ loadElk)
/* harmony export */ });
// Keep the layout engine out of the initial download, including in the unbuilt demo.
let enginePromise;

function loadElk() {
    if (!enginePromise) {
        enginePromise = new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = new URL(/* asset import */ __webpack_require__(/*! ./vendor/elk.bundled.js */ 90452), __webpack_require__.b).href;
            // Emit the accompanying license with the engine in webpack builds.
            script.dataset.license = new URL(/* asset import */ __webpack_require__(/*! ./vendor/ELK-LICENSE.md */ 59078), __webpack_require__.b).href;
            script.onload = () => {
                script.remove();
                if (typeof window.ELK === "function") resolve(new window.ELK());
                else reject(new Error("ELK did not initialize"));
            };
            script.onerror = () => {
                script.remove();
                reject(new Error("Could not load ELK"));
            };
            document.head.append(script);
        }).catch((error) => {
            enginePromise = undefined;
            throw error;
        });
    }
    return enginePromise;
}

// Use opaque ELK IDs; object IDs and reference keys remain in our snapshot model.
function buildHeapGraph(nodes, references) {
    const ids = new Map(nodes.map((node, index) => [node.id, `node-${index}`]));
    const outgoing = new Map(nodes.map((node) => [node.id, []]));
    const edges = [];
    const edgeKeys = new Map();
    for (const reference of references) {
        if (!ids.has(reference.source) || !ids.has(reference.target)) continue;
        const id = `edge-${edges.length}`;
        const port = `${id}-source`;
        outgoing.get(reference.source).push({
            id: port, width: 1, height: 1,
            x: nodes.find((node) => node.id === reference.source).width,
            y: reference.y,
            layoutOptions: { "elk.port.side": "EAST" },
        });
        edges.push({ id, sources: [port], targets: [`${ids.get(reference.target)}-in`] });
        edgeKeys.set(id, reference.key);
    }
    return {
        graph: {
            id: "heap",
            layoutOptions: {
                "elk.algorithm": "layered",
                "elk.direction": "DOWN",
                // Prefer a tall canvas when packing disconnected heap objects too.
                "elk.aspectRatio": "0.6",
                "elk.edgeRouting": "ORTHOGONAL",
                // Leave room for broad curves and straight tails beside cards.
                "elk.spacing.edgeNode": "40",
                "elk.spacing.nodeSelfLoop": "40",
                "elk.spacing.edgeEdge": "16",
                "elk.spacing.nodeNode": "32",
                "elk.layered.spacing.nodeNodeBetweenLayers": "48",
                "elk.spacing.componentComponent": "40",
                "elk.padding": "[top=24,left=24,bottom=24,right=24]",
            },
            children: nodes.map((node) => ({
                id: ids.get(node.id), width: node.width, height: node.height,
                layoutOptions: { "elk.portConstraints": "FIXED_POS" },
                ports: [
                    {
                        id: `${ids.get(node.id)}-in`, width: 1, height: 1,
                        // Keep both ports on the right so downward chains don't
                        // become a wide staircase to connect east to west ports.
                        x: node.width, y: node.targetY,
                        layoutOptions: { "elk.port.side": "EAST" },
                    },
                    ...outgoing.get(node.id),
                ],
            })),
            edges,
        },
        ids,
        edgeKeys,
    };
}

async function layoutWithElk(engine, nodes, references) {
    const { graph, ids, edgeKeys } = buildHeapGraph(nodes, references);
    const result = await engine.layout(graph);
    const objectIds = new Map([...ids].map(([object, id]) => [id, object]));
    return {
        positions: new Map(result.children.map((node) => [
            objectIds.get(node.id), { x: node.x, y: node.y },
        ])),
        routes: new Map(result.edges.map((edge) => [edgeKeys.get(edge.id),
            (edge.sections ?? []).flatMap((section) => [
                section.startPoint, ...(section.bendPoints ?? []), section.endPoint,
            ]),
        ])),
    };
}

async function layoutHeap(nodes, references, isCurrent = () => true) {
    const engine = await loadElk();
    if (!isCurrent()) return null;
    return layoutWithElk(engine, nodes, references);
}


/***/ }),

/***/ 90452:
/*!***********************************************************!*\
  !*** ./runestone/codelens/frontend/vendor/elk.bundled.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "54ff9f88c79fc076.js";

/***/ }),

/***/ 93473:
/*!********************************************!*\
  !*** ./runestone/codelens/css/pytutor.css ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ3ZGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBLHVCQUF1QjtBQUNoQjtBQUNQLHFFQUFxRSxNQUFNO0FBQzNFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsYUFBYTtBQUN4Qyx3QkFBd0IsR0FBRztBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2Qix5QkFBeUI7QUFDdEQsU0FBUztBQUNULHFCQUFxQixrQ0FBa0MsMEJBQTBCLE9BQU87QUFDeEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLGlDQUFpQyxvQ0FBb0M7QUFDckU7QUFDQTtBQUNBLCtCQUErQixpQkFBaUI7QUFDaEQ7QUFDQTtBQUNBO0FBQ0EseUNBQXlDLHlCQUF5QjtBQUNsRSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7QUFFTztBQUNQLFlBQVksdUJBQXVCO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDLHNCQUFzQjtBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMxR0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2NvZGVsZW5zL2Zyb250ZW5kL3RyYWNlLXZpZXdlci5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2NvZGVsZW5zL2Zyb250ZW5kL21lbW9yeS1tb2RlbC5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2NvZGVsZW5zL2Zyb250ZW5kL2Zyb250ZW5kLWkxOG4uZW4uanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9jb2RlbGVucy9mcm9udGVuZC9jb25uZWN0b3ItcGF0aC5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2NvZGVsZW5zL2Zyb250ZW5kL21lbW9yeS12aWV3LmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvY29kZWxlbnMvZnJvbnRlbmQvdHJhY2Utdmlld2VyLmNzcz84YzUzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvY29kZWxlbnMvZnJvbnRlbmQvZ3JhcGhpY2FsLWhlYXAuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9jb2RlbGVucy9qcy9jb2RlbGVucy5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2NvZGVsZW5zL2Zyb250ZW5kL2Vsay1sYXlvdXQuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9jb2RlbGVucy9jc3MvcHl0dXRvci5jc3M/OTc3NyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBBIHNtYWxsLCByZWFkLW9ubHkgdmlld2VyIGZvciBleHBlcmltZW50aW5nIHdpdGggYWNjZXNzaWJsZSB0cmFjZSBvdXRwdXQuXG4vLyBUaGUgdHJhY2UgZm9ybWF0IGlzIHByb2R1Y2VkIGVsc2V3aGVyZTsgdGhpcyBtb2R1bGUgbmV2ZXIgZXhlY3V0ZXMgY29kZS5cbmltcG9ydCB7IHQgfSBmcm9tIFwiLi4vLi4vY29tbW9uL2pzL3JzaTE4bi5qc1wiO1xuaW1wb3J0IFwiLi9mcm9udGVuZC1pMThuLmVuLmpzXCI7XG5pbXBvcnQgeyBub3JtYWxpemVNZW1vcnksIG1lbW9yeUNoYW5nZXMgfSBmcm9tIFwiLi9tZW1vcnktbW9kZWwuanNcIjtcbmltcG9ydCB7IGNyZWF0ZU1lbW9yeVZpZXcgfSBmcm9tIFwiLi9tZW1vcnktdmlldy5qc1wiO1xuXG5jb25zdCBtb3VudGVkVmlld2VycyA9IG5ldyBXZWFrTWFwKCk7XG5sZXQgbmV4dFZpZXdlcklkID0gMDtcblxuZnVuY3Rpb24gZWxlbWVudCh0YWcsIGNsYXNzTmFtZSwgdGV4dENvbnRlbnQpIHtcbiAgICBjb25zdCBub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWcpO1xuICAgIGlmIChjbGFzc05hbWUpIG5vZGUuY2xhc3NOYW1lID0gY2xhc3NOYW1lO1xuICAgIGlmICh0ZXh0Q29udGVudCAhPT0gdW5kZWZpbmVkKSBub2RlLnRleHRDb250ZW50ID0gdGV4dENvbnRlbnQ7XG4gICAgcmV0dXJuIG5vZGU7XG59XG5cbmZ1bmN0aW9uIHRyYWNlTGluZShlbnRyeSkge1xuICAgIHJldHVybiBOdW1iZXIuaXNJbnRlZ2VyKGVudHJ5LmxpbmUpICYmIGVudHJ5LmxpbmUgPiAwXG4gICAgICAgID8gdChcImNsX2xpbmVcIiwgZW50cnkubGluZSlcbiAgICAgICAgOiB0KFwiY2xfbm9fbGluZVwiKTtcbn1cblxuLyoqIE1vdW50IGEgcmVhZC1vbmx5IHZpZXcgb2YgYW4gZXhpc3RpbmcgUHl0aG9uIFR1dG9yIHRyYWNlLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1vdW50VHJhY2VWaWV3ZXIoY29udGFpbmVyLCBkYXRhLCBvcHRpb25zID0ge30pIHtcbiAgICBpZiAoIShjb250YWluZXIgaW5zdGFuY2VvZiBFbGVtZW50KSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ29kZUxlbnMgY29udGFpbmVyIG11c3QgYmUgYW4gZWxlbWVudFwiKTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBkYXRhPy5jb2RlICE9PSBcInN0cmluZ1wiIHx8ICFBcnJheS5pc0FycmF5KGRhdGEudHJhY2UpKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDb2RlTGVucyB0cmFjZSBtdXN0IGNvbnRhaW4gY29kZSBhbmQgdHJhY2UgZmllbGRzXCIpO1xuICAgIH1cbiAgICBpZiAoZGF0YS50cmFjZS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNvZGVMZW5zIHRyYWNlIGhhcyBubyBzdGVwc1wiKTtcbiAgICB9XG4gICAgbW91bnRlZFZpZXdlcnMuZ2V0KGNvbnRhaW5lcik/LmRlc3Ryb3koKTtcbiAgICBsZXQgZGVzdHJveWVkID0gZmFsc2U7XG5cbiAgICBjb25zdCByZXF1ZXN0ZWRTdGVwID0gb3B0aW9ucy5zdGFydGluZ0luc3RydWN0aW9uID8/IGRhdGEuc3RhcnRpbmdJbnN0cnVjdGlvbiA/PyAwO1xuICAgIGxldCBzdGVwID0gTnVtYmVyLmlzRmluaXRlKHJlcXVlc3RlZFN0ZXApXG4gICAgICAgID8gTWF0aC5tYXgoMCwgTWF0aC5taW4oZGF0YS50cmFjZS5sZW5ndGggLSAxLCBNYXRoLnRydW5jKHJlcXVlc3RlZFN0ZXApKSlcbiAgICAgICAgOiAwO1xuXG4gICAgY29uc3Qgcm9vdCA9IGVsZW1lbnQoXCJzZWN0aW9uXCIsIFwicnMtY29kZWxlbnMtcHJvdG90eXBlXCIpO1xuICAgIHJvb3Quc2V0QXR0cmlidXRlKFwiYXJpYS1sYWJlbFwiLCB0KFwiY2xfdmlld2VyXCIpKTtcblxuICAgIGNvbnN0IHZpZXdlckhlYWRpbmcgPSBlbGVtZW50KFxuICAgICAgICBcImgyXCIsXG4gICAgICAgIFwicnMtY29kZWxlbnMtcHJvdG90eXBlX19zci1vbmx5XCIsXG4gICAgICAgIHQoXCJjbF90cmFjZVwiKSxcbiAgICApO1xuICAgIHJvb3QuZGF0YXNldC5sYXlvdXQgPSBcImF1dG9cIjtcbiAgICBjb25zdCBsYXlvdXRDb250cm9scyA9IGVsZW1lbnQoXCJkaXZcIiwgXCJycy1jb2RlbGVucy1wcm90b3R5cGVfX2xheW91dC1jb250cm9sXCIpO1xuICAgIGNvbnN0IGxheW91dExhYmVsID0gZWxlbWVudChcImxhYmVsXCIsIG51bGwsIHQoXCJjbF92aWV3ZXJfbGF5b3V0XCIpKTtcbiAgICBjb25zdCBsYXlvdXRTZWxlY3QgPSBlbGVtZW50KFwic2VsZWN0XCIpO1xuICAgIGxheW91dFNlbGVjdC5pZCA9IGBycy1jb2RlbGVucy1sYXlvdXQtJHsrK25leHRWaWV3ZXJJZH1gO1xuICAgIGxheW91dExhYmVsLmh0bWxGb3IgPSBsYXlvdXRTZWxlY3QuaWQ7XG4gICAgZm9yIChjb25zdCBtb2RlIG9mIFtcImF1dG9cIiwgXCJzaWRlLWJ5LXNpZGVcIiwgXCJzdGFja2VkXCJdKSB7XG4gICAgICAgIGNvbnN0IG9wdGlvbiA9IGVsZW1lbnQoXCJvcHRpb25cIiwgbnVsbCwgdChgY2xfbGF5b3V0XyR7bW9kZX1gKSk7XG4gICAgICAgIG9wdGlvbi52YWx1ZSA9IG1vZGU7XG4gICAgICAgIGxheW91dFNlbGVjdC5hcHBlbmQob3B0aW9uKTtcbiAgICB9XG4gICAgbGF5b3V0U2VsZWN0LmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKCkgPT4ge1xuICAgICAgICByb290LmRhdGFzZXQubGF5b3V0ID0gbGF5b3V0U2VsZWN0LnZhbHVlO1xuICAgIH0pO1xuICAgIGxheW91dENvbnRyb2xzLmFwcGVuZChsYXlvdXRMYWJlbCwgbGF5b3V0U2VsZWN0KTtcbiAgICBjb25zdCB3b3Jrc3BhY2UgPSBlbGVtZW50KFwiZGl2XCIsIFwicnMtY29kZWxlbnMtcHJvdG90eXBlX193b3Jrc3BhY2VcIik7XG4gICAgY29uc3QgY29kZVBhbmVsID0gZWxlbWVudChcInNlY3Rpb25cIiwgXCJycy1jb2RlbGVucy1wcm90b3R5cGVfX2NvZGUtcGFuZWxcIik7XG4gICAgY29kZVBhbmVsLnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIiwgdChcImNsX2NvZGVcIikpO1xuICAgIGNvbnN0IGNvZGVIZWFkaW5nID0gZWxlbWVudChcImgzXCIsIG51bGwsIHQoXCJjbF9jb2RlXCIpKTtcbiAgICBjb25zdCBjb2RlUHJlID0gZWxlbWVudChcInByZVwiLCBcInJzLWNvZGVsZW5zLXByb3RvdHlwZV9fY29kZVwiKTtcbiAgICBjb25zdCBjb2RlID0gZWxlbWVudChcImNvZGVcIik7XG4gICAgY29kZVByZS5hcHBlbmQoY29kZSk7XG4gICAgY29uc3Qgc291cmNlTGluZXMgPSBkYXRhLmNvZGUucmVwbGFjZSgvXFxyXFxuPy9nLCBcIlxcblwiKS5zcGxpdChcIlxcblwiKTtcbiAgICBpZiAoc291cmNlTGluZXNbc291cmNlTGluZXMubGVuZ3RoIC0gMV0gPT09IFwiXCIpIHNvdXJjZUxpbmVzLnBvcCgpO1xuICAgIGNvbnN0IGxpbmVOb2RlcyA9IHNvdXJjZUxpbmVzLm1hcCgoc291cmNlLCBpbmRleCkgPT4ge1xuICAgICAgICBjb25zdCByb3cgPSBlbGVtZW50KFwic3BhblwiLCBcInJzLWNvZGVsZW5zLXByb3RvdHlwZV9fbGluZVwiKTtcbiAgICAgICAgcm93LmRhdGFzZXQubGluZSA9IFN0cmluZyhpbmRleCArIDEpO1xuICAgICAgICByb3cuYXBwZW5kKFxuICAgICAgICAgICAgZWxlbWVudChcbiAgICAgICAgICAgICAgICBcInNwYW5cIiwgXCJycy1jb2RlbGVucy1wcm90b3R5cGVfX3NyLW9ubHlcIixcbiAgICAgICAgICAgICAgICBgJHt0KFwiY2xfbGluZVwiLCBpbmRleCArIDEpfTogYCxcbiAgICAgICAgICAgICksXG4gICAgICAgICAgICBlbGVtZW50KFwic3BhblwiLCBcInJzLWNvZGVsZW5zLXByb3RvdHlwZV9fbGluZS1udW1iZXJcIiwgU3RyaW5nKGluZGV4ICsgMSkpLFxuICAgICAgICAgICAgZWxlbWVudChcInNwYW5cIiwgXCJycy1jb2RlbGVucy1wcm90b3R5cGVfX2N1cnJlbnQtbGFiZWxcIiksXG4gICAgICAgICAgICBlbGVtZW50KFwic3BhblwiLCBcInJzLWNvZGVsZW5zLXByb3RvdHlwZV9fc291cmNlXCIsIHNvdXJjZSB8fCBcIiBcIiksXG4gICAgICAgICk7XG4gICAgICAgIHJvdy5xdWVyeVNlbGVjdG9yKFwiLnJzLWNvZGVsZW5zLXByb3RvdHlwZV9fbGluZS1udW1iZXJcIikuc2V0QXR0cmlidXRlKFxuICAgICAgICAgICAgXCJhcmlhLWhpZGRlblwiLFxuICAgICAgICAgICAgXCJ0cnVlXCIsXG4gICAgICAgICk7XG4gICAgICAgIGNvZGUuYXBwZW5kKHJvdyk7XG4gICAgICAgIHJldHVybiByb3c7XG4gICAgfSk7XG5cbiAgICBjb25zdCBjb250cm9scyA9IGVsZW1lbnQoXCJkaXZcIiwgXCJycy1jb2RlbGVucy1wcm90b3R5cGVfX2NvbnRyb2xzXCIpO1xuICAgIGNvbnN0IHByZXZpb3VzID0gZWxlbWVudChcImJ1dHRvblwiLCBudWxsLCB0KFwiY2xfcHJldmlvdXNcIikpO1xuICAgIHByZXZpb3VzLnR5cGUgPSBcImJ1dHRvblwiO1xuICAgIHByZXZpb3VzLmRhdGFzZXQuY29kZWxlbnNBY3Rpb24gPSBcImJhY2tcIjtcbiAgICBjb25zdCBuZXh0ID0gZWxlbWVudChcImJ1dHRvblwiLCBudWxsLCB0KFwiY2xfbmV4dFwiKSk7XG4gICAgbmV4dC50eXBlID0gXCJidXR0b25cIjtcbiAgICBuZXh0LmRhdGFzZXQuY29kZWxlbnNBY3Rpb24gPSBcImZ3ZFwiO1xuICAgIGNvbnRyb2xzLmFwcGVuZChwcmV2aW91cywgbmV4dCk7XG4gICAgY29uc3Qgc3RhdHVzID0gZWxlbWVudChcInBcIiwgXCJycy1jb2RlbGVucy1wcm90b3R5cGVfX3N0YXR1c1wiKTtcbiAgICBzdGF0dXMuc2V0QXR0cmlidXRlKFwicm9sZVwiLCBcInN0YXR1c1wiKTtcbiAgICBzdGF0dXMuc2V0QXR0cmlidXRlKFwiYXJpYS1saXZlXCIsIFwicG9saXRlXCIpO1xuICAgIHN0YXR1cy5zZXRBdHRyaWJ1dGUoXCJhcmlhLWF0b21pY1wiLCBcInRydWVcIik7XG5cbiAgICBjb25zdCBoYXNIZWFwID0gZGF0YS50cmFjZS5zb21lKChlbnRyeSkgPT4gT2JqZWN0LmtleXMoZW50cnkuaGVhcCA/PyB7fSkubGVuZ3RoID4gMCk7XG4gICAgY29uc3QgbWVtb3J5VmlldyA9IGNyZWF0ZU1lbW9yeVZpZXcoeyBoYXNIZWFwIH0pO1xuICAgIGxldCBwcmV2aW91c01lbW9yeSA9IG51bGw7XG4gICAgY29uc3Qgb3V0cHV0SGVhZGluZyA9IGVsZW1lbnQoXCJoM1wiLCBudWxsLCB0KFwiY2xfb3V0cHV0XCIpKTtcbiAgICBjb25zdCBvdXRwdXQgPSBlbGVtZW50KFwicHJlXCIsIFwicnMtY29kZWxlbnMtcHJvdG90eXBlX19vdXRwdXRcIik7XG4gICAgb3V0cHV0LnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIiwgdChcImNsX291dHB1dFwiKSk7XG5cbiAgICBjb2RlUGFuZWwuYXBwZW5kKFxuICAgICAgICBjb2RlSGVhZGluZyxcbiAgICAgICAgY29kZVByZSxcbiAgICAgICAgY29udHJvbHMsXG4gICAgICAgIHN0YXR1cyxcbiAgICAgICAgb3V0cHV0SGVhZGluZyxcbiAgICAgICAgb3V0cHV0LFxuICAgICk7XG4gICAgd29ya3NwYWNlLmFwcGVuZChjb2RlUGFuZWwsIG1lbW9yeVZpZXcuZWxlbWVudCk7XG4gICAgcm9vdC5hcHBlbmQodmlld2VySGVhZGluZywgbGF5b3V0Q29udHJvbHMsIHdvcmtzcGFjZSk7XG4gICAgY29udGFpbmVyLnJlcGxhY2VDaGlsZHJlbihyb290KTtcblxuICAgIGZ1bmN0aW9uIHJlbmRlcihwcmV2aW91c1N0ZXAgPSBudWxsKSB7XG4gICAgICAgIGNvbnN0IGVudHJ5ID0gZGF0YS50cmFjZVtzdGVwXTtcbiAgICAgICAgZm9yIChjb25zdCBbaW5kZXgsIHJvd10gb2YgbGluZU5vZGVzLmVudHJpZXMoKSkge1xuICAgICAgICAgICAgY29uc3QgY3VycmVudCA9IGluZGV4ICsgMSA9PT0gZW50cnkubGluZTtcbiAgICAgICAgICAgIHJvdy5jbGFzc0xpc3QudG9nZ2xlKFwicnMtY29kZWxlbnMtcHJvdG90eXBlX19saW5lLS1jdXJyZW50XCIsIGN1cnJlbnQpO1xuICAgICAgICAgICAgcm93LnF1ZXJ5U2VsZWN0b3IoXCIucnMtY29kZWxlbnMtcHJvdG90eXBlX19jdXJyZW50LWxhYmVsXCIpLnRleHRDb250ZW50ID1cbiAgICAgICAgICAgICAgICBjdXJyZW50ID8gdChcImNsX2N1cnJlbnRfbGluZVwiKSA6IFwiXCI7XG4gICAgICAgIH1cbiAgICAgICAgcHJldmlvdXMuc2V0QXR0cmlidXRlKFwiYXJpYS1kaXNhYmxlZFwiLCBTdHJpbmcoc3RlcCA9PT0gMCkpO1xuICAgICAgICBuZXh0LnNldEF0dHJpYnV0ZShcImFyaWEtZGlzYWJsZWRcIiwgU3RyaW5nKHN0ZXAgPT09IGRhdGEudHJhY2UubGVuZ3RoIC0gMSkpO1xuXG4gICAgICAgIGNvbnN0IG1lbW9yeSA9IG5vcm1hbGl6ZU1lbW9yeShlbnRyeSwgb3B0aW9ucy5sYW5nKTtcbiAgICAgICAgY29uc3QgY2hhbmdlcyA9IG1lbW9yeUNoYW5nZXMocHJldmlvdXNNZW1vcnksIG1lbW9yeSk7XG4gICAgICAgIG1lbW9yeVZpZXcudXBkYXRlKG1lbW9yeSwgY2hhbmdlcyk7XG4gICAgICAgIHByZXZpb3VzTWVtb3J5ID0gbWVtb3J5O1xuXG4gICAgICAgIGNvbnN0IHN0ZG91dCA9IHR5cGVvZiBlbnRyeS5zdGRvdXQgPT09IFwic3RyaW5nXCIgPyBlbnRyeS5zdGRvdXQgOiBcIlwiO1xuICAgICAgICBvdXRwdXQudGV4dENvbnRlbnQgPSBzdGRvdXQ7XG4gICAgICAgIGxldCBhbm5vdW5jZW1lbnQgPSB0KFwiY2xfc3RlcFwiLCBzdGVwICsgMSwgZGF0YS50cmFjZS5sZW5ndGgsIHRyYWNlTGluZShlbnRyeSkpO1xuICAgICAgICBpZiAoY2hhbmdlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBhbm5vdW5jZW1lbnQgKz0gYCAke2NoYW5nZXMuc2xpY2UoMCwgMykubWFwKChjaGFuZ2UpID0+IGNoYW5nZS50ZXh0KS5qb2luKFwiIFwiKX1gO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjaGFuZ2VzLmxlbmd0aCA+IDMpIHtcbiAgICAgICAgICAgIGFubm91bmNlbWVudCArPSBgICR7dChcImNsX21vcmVfY2hhbmdlc1wiLCBjaGFuZ2VzLmxlbmd0aCAtIDMpfWA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByZXZpb3VzU3RlcCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgY29uc3Qgb2xkU3Rkb3V0ID0gZGF0YS50cmFjZVtwcmV2aW91c1N0ZXBdLnN0ZG91dCA/PyBcIlwiO1xuICAgICAgICAgICAgaWYgKHN0ZG91dCAhPT0gb2xkU3Rkb3V0KSB7XG4gICAgICAgICAgICAgICAgaWYgKHN0ZG91dC5zdGFydHNXaXRoKG9sZFN0ZG91dCkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYWRkZWQgPSBzdGRvdXQuc2xpY2Uob2xkU3Rkb3V0Lmxlbmd0aCkudHJpbSgpIHx8IHQoXCJjbF93aGl0ZXNwYWNlXCIpO1xuICAgICAgICAgICAgICAgICAgICBhbm5vdW5jZW1lbnQgKz0gYCAke3QoXCJjbF9uZXdfb3V0cHV0XCIsIGFkZGVkKX0key9bLiE/XSQvLnRlc3QoYWRkZWQpID8gXCJcIiA6IFwiLlwifWA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYW5ub3VuY2VtZW50ICs9IGAgJHt0KFwiY2xfb3V0cHV0X2NoYW5nZWRcIil9YDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgc3RhdHVzLnRleHRDb250ZW50ID0gYW5ub3VuY2VtZW50O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1vdmVTdGVwKGRpcmVjdGlvbikge1xuICAgICAgICBjb25zdCBkZXN0aW5hdGlvbiA9IHN0ZXAgKyBkaXJlY3Rpb247XG4gICAgICAgIGlmIChkZXN0cm95ZWQgfHwgZGVzdGluYXRpb24gPCAwIHx8IGRlc3RpbmF0aW9uID49IGRhdGEudHJhY2UubGVuZ3RoKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIGNvbnN0IHByZXZpb3VzU3RlcCA9IHN0ZXA7XG4gICAgICAgIHN0ZXAgPSBkZXN0aW5hdGlvbjtcbiAgICAgICAgcmVuZGVyKHByZXZpb3VzU3RlcCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGNvbnN0IHN0ZXBGb3J3YXJkID0gKCkgPT4gbW92ZVN0ZXAoMSk7XG4gICAgY29uc3Qgc3RlcEJhY2t3YXJkID0gKCkgPT4gbW92ZVN0ZXAoLTEpO1xuXG4gICAgZm9yIChjb25zdCBbYnV0dG9uLCBhY3Rpb25dIG9mIFtbcHJldmlvdXMsIHN0ZXBCYWNrd2FyZF0sIFtuZXh0LCBzdGVwRm9yd2FyZF1dKSB7XG4gICAgICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBpZiAoIWFjdGlvbigpKSB7XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBldmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJlbmRlcigpO1xuICAgIGNvbnN0IGNvbnRyb2xsZXIgPSB7XG4gICAgICAgIGVsZW1lbnQ6IHJvb3QsXG4gICAgICAgIGdldCBjdXJyZW50U3RlcCgpIHtcbiAgICAgICAgICAgIHJldHVybiBzdGVwO1xuICAgICAgICB9LFxuICAgICAgICBzdGVwRm9yd2FyZCxcbiAgICAgICAgc3RlcEJhY2t3YXJkLFxuICAgICAgICBkZXN0cm95KCkge1xuICAgICAgICAgICAgZGVzdHJveWVkID0gdHJ1ZTtcbiAgICAgICAgICAgIG1lbW9yeVZpZXcuZGVzdHJveSgpO1xuICAgICAgICAgICAgcm9vdC5yZW1vdmUoKTtcbiAgICAgICAgICAgIGlmIChtb3VudGVkVmlld2Vycy5nZXQoY29udGFpbmVyKSA9PT0gY29udHJvbGxlcikge1xuICAgICAgICAgICAgICAgIG1vdW50ZWRWaWV3ZXJzLmRlbGV0ZShjb250YWluZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgIH07XG4gICAgbW91bnRlZFZpZXdlcnMuc2V0KGNvbnRhaW5lciwgY29udHJvbGxlcik7XG4gICAgcmV0dXJuIGNvbnRyb2xsZXI7XG59XG4iLCIvLyBQeXRob24gVHV0b3Igc25hcHNob3RzIGFyZSBhIGdyYXBoLiBEZWNvZGUgdmFsdWVzIHdpdGhvdXQgZXhwYW5kaW5nIHJlZmVyZW5jZXMsXG4vLyBzbyBhbGlhc2VzIGFuZCBjeWNsZXMgcmV0YWluIHRoZWlyIGlkZW50aXR5IGFuZCBuZXZlciByZWN1cnNlIHRocm91Z2ggdGhlIGhlYXAuXG5pbXBvcnQgeyB0IH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9qcy9yc2kxOG4uanNcIjtcbmltcG9ydCBcIi4vZnJvbnRlbmQtaTE4bi5lbi5qc1wiO1xuXG5leHBvcnQgY29uc3QgbWVtb3J5S2V5ID0gKC4uLnBhcnRzKSA9PiBKU09OLnN0cmluZ2lmeShwYXJ0cyk7XG5cbmZ1bmN0aW9uIGxpdGVyYWwodGV4dCkge1xuICAgIHJldHVybiB7IGtpbmQ6IFwibGl0ZXJhbFwiLCB0ZXh0OiBTdHJpbmcodGV4dCkgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNBZGRyZXNzKGFkZHJlc3MpIHtcbiAgICByZXR1cm4gdHlwZW9mIGFkZHJlc3MgPT09IFwic3RyaW5nXCIgJiYgL14weFswLTlhLWZdKyQvaS50ZXN0KGFkZHJlc3MpXG4gICAgICAgID8gYDB4JHtCaWdJbnQoYWRkcmVzcykudG9TdHJpbmcoMTYpfWAgOiBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplVmFsdWUodmFsdWUsIGxhbmd1YWdlID0gXCJweTNcIikge1xuICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICBpZiAodmFsdWVbMF0gPT09IFwiQ19TVFJVQ1RcIiAmJiB2YWx1ZS5sZW5ndGggPj0gMyAmJlxuICAgICAgICAgICAgdmFsdWUuc2xpY2UoMykuZXZlcnkoKGZpZWxkKSA9PiBBcnJheS5pc0FycmF5KGZpZWxkKSAmJiBmaWVsZC5sZW5ndGggPT09IDIpKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGtpbmQ6IFwic3RydWN0XCIsIGFkZHJlc3M6IFN0cmluZyh2YWx1ZVsxXSksIHR5cGU6IFN0cmluZyh2YWx1ZVsyXSksXG4gICAgICAgICAgICAgICAgZmllbGRzOiB2YWx1ZS5zbGljZSgzKS5tYXAoKFtuYW1lLCBmaWVsZF0pID0+ICh7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFN0cmluZyhuYW1lKSwgdmFsdWU6IG5vcm1hbGl6ZVZhbHVlKGZpZWxkLCBsYW5ndWFnZSksXG4gICAgICAgICAgICAgICAgfSkpLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodmFsdWVbMF0gPT09IFwiQ19BUlJBWVwiICYmIHZhbHVlLmxlbmd0aCA+PSAyKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGtpbmQ6IFwiYXJyYXlcIiwgYWRkcmVzczogU3RyaW5nKHZhbHVlWzFdKSwgdHlwZTogdChcImNsX2FycmF5X3R5cGVcIiksXG4gICAgICAgICAgICAgICAgZmllbGRzOiB2YWx1ZS5zbGljZSgyKS5tYXAoKGZpZWxkLCBpbmRleCkgPT4gKHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogU3RyaW5nKGluZGV4KSwgdmFsdWU6IG5vcm1hbGl6ZVZhbHVlKGZpZWxkLCBsYW5ndWFnZSksXG4gICAgICAgICAgICAgICAgfSkpLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodmFsdWVbMF0gPT09IFwiQ19EQVRBXCIgJiYgdmFsdWUubGVuZ3RoID09PSA0KSB7XG4gICAgICAgICAgICBjb25zdCBkZWNvZGVkID0gdHlwZW9mIHZhbHVlWzNdID09PSBcInN0cmluZ1wiXG4gICAgICAgICAgICAgICAgPyBsaXRlcmFsKHZhbHVlWzNdKSA6IG5vcm1hbGl6ZVZhbHVlKHZhbHVlWzNdLCBsYW5ndWFnZSk7XG4gICAgICAgICAgICBjb25zdCB0YXJnZXQgPSB2YWx1ZVsyXSA9PT0gXCJwb2ludGVyXCJcbiAgICAgICAgICAgICAgICA/ICh2YWx1ZVszXSA9PT0gMCA/IFwiMHgwXCIgOiBjQWRkcmVzcyh2YWx1ZVszXSkpIDogbnVsbDtcbiAgICAgICAgICAgIGlmICh0YXJnZXQgIT09IG51bGwpIE9iamVjdC5hc3NpZ24oZGVjb2RlZCwgeyBraW5kOiBcInBvaW50ZXJcIiwgaWQ6IHRhcmdldCB9KTtcbiAgICAgICAgICAgIHJldHVybiB7IC4uLmRlY29kZWQsIGFkZHJlc3M6IFN0cmluZyh2YWx1ZVsxXSksIHR5cGU6IFN0cmluZyh2YWx1ZVsyXSkgfTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodmFsdWVbMF0gPT09IFwiUkVGXCIpIHJldHVybiB7IGtpbmQ6IFwicmVmZXJlbmNlXCIsIGlkOiBTdHJpbmcodmFsdWVbMV0pIH07XG4gICAgICAgIGlmIChbXCJTUEVDSUFMX0ZMT0FUXCIsIFwiSU1QT1JURURfRkFVWF9QUklNSVRJVkVcIl0uaW5jbHVkZXModmFsdWVbMF0pKSB7XG4gICAgICAgICAgICByZXR1cm4gbGl0ZXJhbCh2YWx1ZVsxXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGxpdGVyYWwodChcImNsX3Vua25vd25fdmFsdWVcIiwgSlNPTi5zdHJpbmdpZnkodmFsdWUpKSk7XG4gICAgfVxuICAgIGNvbnN0IHB5dGhvbiA9IGxhbmd1YWdlLnN0YXJ0c1dpdGgoXCJweVwiKTtcbiAgICBpZiAodmFsdWUgPT09IG51bGwpIHJldHVybiBsaXRlcmFsKHB5dGhvbiA/IFwiTm9uZVwiIDogXCJudWxsXCIpO1xuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09IFwiYm9vbGVhblwiKSB7XG4gICAgICAgIHJldHVybiBsaXRlcmFsKHB5dGhvbiA/ICh2YWx1ZSA/IFwiVHJ1ZVwiIDogXCJGYWxzZVwiKSA6IFN0cmluZyh2YWx1ZSkpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiKSByZXR1cm4gbGl0ZXJhbChKU09OLnN0cmluZ2lmeSh2YWx1ZSkpO1xuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09IFwibnVtYmVyXCIpIHJldHVybiBsaXRlcmFsKHZhbHVlKTtcbiAgICByZXR1cm4gbGl0ZXJhbCh0KFwiY2xfdW5rbm93bl92YWx1ZVwiLCBKU09OLnN0cmluZ2lmeSh2YWx1ZSkpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFnZ3JlZ2F0ZVJvd3ModmFsdWUsIHBhcmVudEtleSkge1xuICAgIHJldHVybiB2YWx1ZS5maWVsZHMubWFwKChmaWVsZCkgPT4gKHtcbiAgICAgICAgLi4uZmllbGQsXG4gICAgICAgIGtleTogbWVtb3J5S2V5KHBhcmVudEtleSwgXCJmaWVsZFwiLCBmaWVsZC5uYW1lKSxcbiAgICAgICAgbG9jYXRpb246IHZhbHVlLmtpbmQgPT09IFwiYXJyYXlcIiA/IHQoXCJjbF9pbmRleF9sb2NhdGlvblwiLCBmaWVsZC5uYW1lKSA6IGZpZWxkLm5hbWUsXG4gICAgfSkpO1xufVxuXG5mdW5jdGlvbiBiaW5kaW5ncyh2YWx1ZXMgPSB7fSwgb3JkZXIgPSBbXSwgcHJlZml4LCBsYW5ndWFnZSkge1xuICAgIGNvbnN0IG5hbWVzID0gWy4uLm5ldyBTZXQoWy4uLm9yZGVyLCAuLi5PYmplY3Qua2V5cyh2YWx1ZXMpXSldO1xuICAgIHJldHVybiBuYW1lc1xuICAgICAgICAuZmlsdGVyKChuYW1lKSA9PiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodmFsdWVzLCBuYW1lKSlcbiAgICAgICAgLm1hcCgobmFtZSkgPT4gKHtcbiAgICAgICAgICAgIGtleTogbWVtb3J5S2V5KC4uLnByZWZpeCwgbmFtZSksXG4gICAgICAgICAgICBuYW1lOiBuYW1lID09PSBcIl9fcmV0dXJuX19cIiA/IHQoXCJjbF9yZXR1cm5cIikgOiBuYW1lLFxuICAgICAgICAgICAgdmFsdWU6IG5vcm1hbGl6ZVZhbHVlKHZhbHVlc1tuYW1lXSwgbGFuZ3VhZ2UpLFxuICAgICAgICB9KSk7XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZU9iamVjdChpZCwgcmF3LCBsYW5ndWFnZSkge1xuICAgIGNvbnN0IHRhZyA9IEFycmF5LmlzQXJyYXkocmF3KSA/IHJhd1swXSA6IFwiP1wiO1xuICAgIGNvbnN0IG9iamVjdCA9IHtcbiAgICAgICAgaWQsXG4gICAgICAgIGtleTogbWVtb3J5S2V5KFwiaGVhcFwiLCBpZCksXG4gICAgICAgIHRhZyxcbiAgICAgICAgbGFiZWw6IHQoXCJjbF9vYmplY3RcIiwgaWQsIHRhZyksXG4gICAgICAgIGtleUhlYWRpbmc6IHQoXCJjbF9uYW1lXCIpLFxuICAgICAgICBlbnRyaWVzOiBbXSxcbiAgICB9O1xuICAgIGZ1bmN0aW9uIHJvdyhrZXksIHZhbHVlLCBpZGVudGl0eSA9IGtleSkge1xuICAgICAgICBvYmplY3QuZW50cmllcy5wdXNoKHtcbiAgICAgICAgICAgIGtleTogbWVtb3J5S2V5KFwiaGVhcFwiLCBpZCwgaWRlbnRpdHkpLFxuICAgICAgICAgICAgbmFtZTogbm9ybWFsaXplVmFsdWUoa2V5LCBsYW5ndWFnZSksXG4gICAgICAgICAgICB2YWx1ZTogbm9ybWFsaXplVmFsdWUodmFsdWUsIGxhbmd1YWdlKSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIG5hbWVkUm93KG5hbWUsIHZhbHVlKSB7XG4gICAgICAgIHJvdyhuYW1lLCB2YWx1ZSk7XG4gICAgICAgIG9iamVjdC5lbnRyaWVzW29iamVjdC5lbnRyaWVzLmxlbmd0aCAtIDFdLm5hbWUgPSBsaXRlcmFsKG5hbWUpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBwYWlycyhpdGVtcywgbmFtZWQgPSBmYWxzZSkge1xuICAgICAgICBmb3IgKGNvbnN0IHBhaXIgb2YgaXRlbXMpIHtcbiAgICAgICAgICAgIGlmICghQXJyYXkuaXNBcnJheShwYWlyKSB8fCBwYWlyLmxlbmd0aCAhPT0gMikgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgaWYgKG5hbWVkICYmIHR5cGVvZiBwYWlyWzBdID09PSBcInN0cmluZ1wiKSBuYW1lZFJvdyhwYWlyWzBdLCBwYWlyWzFdKTtcbiAgICAgICAgICAgIGVsc2Ugcm93KHBhaXJbMF0sIHBhaXJbMV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGxldCBzdXBwb3J0ZWQgPSBBcnJheS5pc0FycmF5KHJhdyk7XG4gICAgc3dpdGNoICh0YWcpIHtcbiAgICAgICAgY2FzZSBcIkNfU1RSVUNUXCI6IHtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gbm9ybWFsaXplVmFsdWUocmF3LCBsYW5ndWFnZSk7XG4gICAgICAgICAgICBzdXBwb3J0ZWQgPSB2YWx1ZS5raW5kID09PSBcInN0cnVjdFwiO1xuICAgICAgICAgICAgaWYgKHN1cHBvcnRlZCkge1xuICAgICAgICAgICAgICAgIG9iamVjdC5sYWJlbCA9IHQoXCJjbF9jX3N0cnVjdFwiLCB2YWx1ZS50eXBlLCB2YWx1ZS5hZGRyZXNzKTtcbiAgICAgICAgICAgICAgICBvYmplY3Qua2V5SGVhZGluZyA9IHQoXCJjbF9maWVsZFwiKTtcbiAgICAgICAgICAgICAgICBvYmplY3QuZW50cmllcyA9IGFnZ3JlZ2F0ZVJvd3ModmFsdWUsIG9iamVjdC5rZXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgY2FzZSBcIkNfREFUQVwiOlxuICAgICAgICAgICAgbmFtZWRSb3codChcImNsX3ZhbHVlXCIpLCByYXcpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJDX0FSUkFZXCI6XG4gICAgICAgICAgICBvYmplY3QubGFiZWwgPSB0KFwiY2xfY19hcnJheVwiLCBpZCk7XG4gICAgICAgICAgICBvYmplY3Qua2V5SGVhZGluZyA9IHQoXCJjbF9pbmRleFwiKTtcbiAgICAgICAgICAgIHJhdy5zbGljZSgyKS5mb3JFYWNoKCh2YWx1ZSwgaW5kZXgpID0+IHJvdyhpbmRleCwgdmFsdWUpKTtcbiAgICAgICAgICAgIGlmIChvYmplY3QuZW50cmllcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBlbnRyeSA9IG9iamVjdC5lbnRyaWVzWzBdO1xuICAgICAgICAgICAgICAgIG9iamVjdC5zaW5nbGVFbGVtZW50ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBvYmplY3QubGFiZWwgPSBlbnRyeS52YWx1ZS50eXBlICE9PSB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICAgICAgPyB0KFwiY2xfYWdncmVnYXRlX3ZhbHVlXCIsIGVudHJ5LnZhbHVlLnR5cGUsIGVudHJ5LnZhbHVlLmFkZHJlc3MgPz8gcmF3WzFdKVxuICAgICAgICAgICAgICAgICAgICA6IHQoXCJjbF9tZW1vcnlfY2h1bmtcIiwgcmF3WzFdKTtcbiAgICAgICAgICAgICAgICBlbnRyeS5uYW1lID0gbGl0ZXJhbCh0KFwiY2xfdmFsdWVcIikpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJMSVNUXCI6XG4gICAgICAgIGNhc2UgXCJUVVBMRVwiOlxuICAgICAgICBjYXNlIFwiU0VUXCI6XG4gICAgICAgICAgICBvYmplY3QubGFiZWwgPSB0KGBjbF8ke3RhZy50b0xvd2VyQ2FzZSgpfWAsIGlkKTtcbiAgICAgICAgICAgIG9iamVjdC5rZXlIZWFkaW5nID0gdCh0YWcgPT09IFwiU0VUXCIgPyBcImNsX21lbWJlclwiIDogXCJjbF9pbmRleFwiKTtcbiAgICAgICAgICAgIHJhdy5zbGljZSgxKS5mb3JFYWNoKCh2YWx1ZSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBzZXQgPSB0YWcgPT09IFwiU0VUXCI7XG4gICAgICAgICAgICAgICAgcm93KHNldCA/IGluZGV4ICsgMSA6IGluZGV4LCB2YWx1ZSwgc2V0ID8gW1wibWVtYmVyXCIsIHZhbHVlXSA6IGluZGV4KTtcbiAgICAgICAgICAgICAgICBvYmplY3QuZW50cmllc1tvYmplY3QuZW50cmllcy5sZW5ndGggLSAxXS5sb2NhdGlvbiA9IHQoXG4gICAgICAgICAgICAgICAgICAgIHNldCA/IFwiY2xfbWVtYmVyX2xvY2F0aW9uXCIgOiBcImNsX2luZGV4X2xvY2F0aW9uXCIsXG4gICAgICAgICAgICAgICAgICAgIHNldCA/IGluZGV4ICsgMSA6IGluZGV4LFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiRElDVFwiOlxuICAgICAgICAgICAgb2JqZWN0LmxhYmVsID0gdChcImNsX2RpY3RcIiwgaWQpO1xuICAgICAgICAgICAgb2JqZWN0LmtleUhlYWRpbmcgPSB0KFwiY2xfa2V5XCIpO1xuICAgICAgICAgICAgc3VwcG9ydGVkID0gcGFpcnMocmF3LnNsaWNlKDEpKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiSU5TVEFOQ0VcIjpcbiAgICAgICAgY2FzZSBcIklOU1RBTkNFX1BQUklOVFwiOlxuICAgICAgICBjYXNlIFwiQ0xBU1NcIjoge1xuICAgICAgICAgICAgb2JqZWN0LmxhYmVsID0gdCh0YWcgPT09IFwiQ0xBU1NcIiA/IFwiY2xfY2xhc3NcIiA6IFwiY2xfaW5zdGFuY2VcIiwgcmF3WzFdLCBpZCk7XG4gICAgICAgICAgICBvYmplY3Qua2V5SGVhZGluZyA9IHQoXCJjbF9hdHRyaWJ1dGVcIik7XG4gICAgICAgICAgICBjb25zdCBzdGFydCA9IHRhZyA9PT0gXCJJTlNUQU5DRVwiID8gMiA6IDM7XG4gICAgICAgICAgICBpZiAodGFnID09PSBcIklOU1RBTkNFX1BQUklOVFwiKSBuYW1lZFJvdyh0KFwiY2xfcmVwcmVzZW50YXRpb25cIiksIHJhd1syXSk7XG4gICAgICAgICAgICBpZiAodGFnID09PSBcIkNMQVNTXCIpIG5hbWVkUm93KHQoXCJjbF9iYXNlc1wiKSwgKHJhd1syXSA/PyBbXSkuam9pbihcIiwgXCIpKTtcbiAgICAgICAgICAgIHN1cHBvcnRlZCA9IHBhaXJzKHJhdy5zbGljZShzdGFydCksIHRydWUpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgY2FzZSBcIkZVTkNUSU9OXCI6XG4gICAgICAgICAgICBvYmplY3QubGFiZWwgPSB0KFwiY2xfZnVuY3Rpb25cIiwgaWQpO1xuICAgICAgICAgICAgbmFtZWRSb3codChcImNsX3NpZ25hdHVyZVwiKSwgcmF3WzFdKTtcbiAgICAgICAgICAgIC8vIFNjb3BlIGlzIGEgZnJhbWUgcmVsYXRpb25zaGlwLCBub3QgYSBoZWFwIHJlZmVyZW5jZS5cbiAgICAgICAgICAgIG9iamVjdC5lbmNsb3NpbmdGcmFtZSA9IHJhd1syXSA9PT0gbnVsbCA/IG51bGwgOiBTdHJpbmcocmF3WzJdKTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgW25hbWUsIHZhbHVlXSBvZiByYXdbM10gPz8gW10pIHtcbiAgICAgICAgICAgICAgICBuYW1lZFJvdyh0KFwiY2xfZGVmYXVsdFwiLCBuYW1lKSwgdmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJIRUFQX1BSSU1JVElWRVwiOlxuICAgICAgICAgICAgb2JqZWN0LmxhYmVsID0gdChcImNsX3ByaW1pdGl2ZVwiLCByYXdbMV0sIGlkKTtcbiAgICAgICAgICAgIG5hbWVkUm93KHQoXCJjbF92YWx1ZVwiKSwgcmF3WzJdKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgc3VwcG9ydGVkID0gZmFsc2U7XG4gICAgfVxuICAgIGlmICghc3VwcG9ydGVkKSB7XG4gICAgICAgIG9iamVjdC5lbnRyaWVzID0gW107XG4gICAgICAgIG9iamVjdC51bnN1cHBvcnRlZCA9IHQoXCJjbF91bmtub3duX29iamVjdFwiLCBKU09OLnN0cmluZ2lmeShyYXcpKTtcbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZU1lbW9yeShlbnRyeSwgbGFuZ3VhZ2UgPSBcInB5M1wiKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZ2xvYmFsczogYmluZGluZ3MoZW50cnkuZ2xvYmFscywgZW50cnkub3JkZXJlZF9nbG9iYWxzLCBbXCJnbG9iYWxcIl0sIGxhbmd1YWdlKSxcbiAgICAgICAgZnJhbWVzOiAoZW50cnkuc3RhY2tfdG9fcmVuZGVyID8/IFtdKS5tYXAoKGZyYW1lLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaWQgPSBTdHJpbmcoZnJhbWUuZnJhbWVfaWQgPz8gZnJhbWUudW5pcXVlX2hhc2ggPz8gaW5kZXgpO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBpZCxcbiAgICAgICAgICAgICAgICBrZXk6IG1lbW9yeUtleShcImZyYW1lXCIsIGlkKSxcbiAgICAgICAgICAgICAgICBsYWJlbDogdChcImNsX2ZyYW1lXCIsIGZyYW1lLmZ1bmNfbmFtZSwgaWQpLFxuICAgICAgICAgICAgICAgIGFjdGl2ZTogQm9vbGVhbihmcmFtZS5pc19oaWdobGlnaHRlZCksXG4gICAgICAgICAgICAgICAgcmV0YWluZWQ6IEJvb2xlYW4oZnJhbWUuaXNfem9tYmllKSxcbiAgICAgICAgICAgICAgICBwYXJlbnRzOiAoZnJhbWUucGFyZW50X2ZyYW1lX2lkX2xpc3QgPz8gW10pLm1hcChTdHJpbmcpLFxuICAgICAgICAgICAgICAgIGJpbmRpbmdzOiBiaW5kaW5ncyhcbiAgICAgICAgICAgICAgICAgICAgZnJhbWUuZW5jb2RlZF9sb2NhbHMsXG4gICAgICAgICAgICAgICAgICAgIGZyYW1lLm9yZGVyZWRfdmFybmFtZXMsXG4gICAgICAgICAgICAgICAgICAgIFtcImZyYW1lXCIsIGlkLCBcImxvY2FsXCJdLFxuICAgICAgICAgICAgICAgICAgICBsYW5ndWFnZSxcbiAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSksXG4gICAgICAgIG9iamVjdHM6IG5ldyBNYXAoXG4gICAgICAgICAgICBPYmplY3QuZW50cmllcyhlbnRyeS5oZWFwID8/IHt9KS5tYXAoKFtpZCwgcmF3XSkgPT4gW1xuICAgICAgICAgICAgICAgIGlkLCBub3JtYWxpemVPYmplY3QoaWQsIHJhdywgbGFuZ3VhZ2UpLFxuICAgICAgICAgICAgXSksXG4gICAgICAgICksXG4gICAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZhbHVlVGV4dCh2YWx1ZSwgbWVtb3J5KSB7XG4gICAgaWYgKHZhbHVlLmtpbmQgPT09IFwic3RydWN0XCIgfHwgdmFsdWUua2luZCA9PT0gXCJhcnJheVwiKSB7XG4gICAgICAgIHJldHVybiB0KFwiY2xfYWdncmVnYXRlX3ZhbHVlXCIsIHZhbHVlLnR5cGUsIHZhbHVlLmFkZHJlc3MpO1xuICAgIH1cbiAgICBpZiAodmFsdWUua2luZCAhPT0gXCJyZWZlcmVuY2VcIikgcmV0dXJuIHZhbHVlLnRleHQ7XG4gICAgY29uc3QgdGFyZ2V0ID0gbWVtb3J5Lm9iamVjdHMuZ2V0KHZhbHVlLmlkKTtcbiAgICByZXR1cm4gdGFyZ2V0XG4gICAgICAgID8gdChcImNsX3JlZmVyZW5jZVwiLCB0YXJnZXQubGFiZWwpXG4gICAgICAgIDogdChcImNsX21pc3NpbmdfcmVmZXJlbmNlXCIsIHZhbHVlLmlkKTtcbn1cblxuLy8gRGlmZnMgb3BlcmF0ZSBvbiBzbmFwc2hvdCB2YWx1ZXMsIG5ldmVyIG9uIHRoZSBET00gb3IgYSByZWN1cnNpdmUgZXhwYW5zaW9uLlxuZXhwb3J0IGZ1bmN0aW9uIG1lbW9yeUNoYW5nZXMocHJldmlvdXMsIGN1cnJlbnQpIHtcbiAgICBpZiAoIXByZXZpb3VzKSByZXR1cm4gW107XG4gICAgY29uc3QgY2hhbmdlcyA9IFtdO1xuICAgIGZ1bmN0aW9uIGNoYW5nZShrZXksIHRleHQpIHtcbiAgICAgICAgY2hhbmdlcy5wdXNoKHsga2V5LCB0ZXh0IH0pO1xuICAgIH1cbiAgICBmdW5jdGlvbiBjb21wYXJlUm93cyhiZWZvcmUsIGFmdGVyLCBzY29wZSkge1xuICAgICAgICBjb25zdCBvbGRSb3dzID0gbmV3IE1hcChiZWZvcmUubWFwKChyb3cpID0+IFtyb3cua2V5LCByb3ddKSk7XG4gICAgICAgIGNvbnN0IG5ld1Jvd3MgPSBuZXcgTWFwKGFmdGVyLm1hcCgocm93KSA9PiBbcm93LmtleSwgcm93XSkpO1xuICAgICAgICBmb3IgKGNvbnN0IFtrZXksIHJvd10gb2YgbmV3Um93cykge1xuICAgICAgICAgICAgY29uc3Qgb2xkID0gb2xkUm93cy5nZXQoa2V5KTtcbiAgICAgICAgICAgIGNvbnN0IG5hbWUgPSByb3cubG9jYXRpb24gPz8gKFxuICAgICAgICAgICAgICAgIHR5cGVvZiByb3cubmFtZSA9PT0gXCJzdHJpbmdcIiA/IHJvdy5uYW1lIDogdmFsdWVUZXh0KHJvdy5uYW1lLCBjdXJyZW50KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGNvbnN0IGxhYmVsID0gdChcImNsX2xvY2F0aW9uXCIsIHNjb3BlLCBuYW1lKTtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gdmFsdWVUZXh0KHJvdy52YWx1ZSwgY3VycmVudCk7XG4gICAgICAgICAgICBpZiAoIW9sZCkgY2hhbmdlKGtleSwgdChcImNsX2FkZGVkXCIsIGxhYmVsLCB2YWx1ZSkpO1xuICAgICAgICAgICAgZWxzZSBpZiAoKHJvdy52YWx1ZS5raW5kID09PSBcInN0cnVjdFwiIHx8IHJvdy52YWx1ZS5raW5kID09PSBcImFycmF5XCIpICYmXG4gICAgICAgICAgICAgICAgb2xkLnZhbHVlLmtpbmQgPT09IHJvdy52YWx1ZS5raW5kICYmIG9sZC52YWx1ZS5hZGRyZXNzID09PSByb3cudmFsdWUuYWRkcmVzcyAmJlxuICAgICAgICAgICAgICAgIG9sZC52YWx1ZS50eXBlID09PSByb3cudmFsdWUudHlwZSkge1xuICAgICAgICAgICAgICAgIGNvbXBhcmVSb3dzKGFnZ3JlZ2F0ZVJvd3Mob2xkLnZhbHVlLCBrZXkpLCBhZ2dyZWdhdGVSb3dzKHJvdy52YWx1ZSwga2V5KSwgbGFiZWwpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChKU09OLnN0cmluZ2lmeShvbGQudmFsdWUpICE9PSBKU09OLnN0cmluZ2lmeShyb3cudmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgY2hhbmdlKGtleSwgdChcImNsX3ZhbHVlX2NoYW5nZWRcIiwgbGFiZWwsIHZhbHVlVGV4dChvbGQudmFsdWUsIHByZXZpb3VzKSwgdmFsdWUpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IFtrZXksIHJvd10gb2Ygb2xkUm93cykge1xuICAgICAgICAgICAgaWYgKCFuZXdSb3dzLmhhcyhrZXkpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbmFtZSA9IHJvdy5sb2NhdGlvbiA/PyAoXG4gICAgICAgICAgICAgICAgICAgIHR5cGVvZiByb3cubmFtZSA9PT0gXCJzdHJpbmdcIiA/IHJvdy5uYW1lIDogdmFsdWVUZXh0KHJvdy5uYW1lLCBwcmV2aW91cylcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIGNoYW5nZShrZXksIHQoXCJjbF9yZW1vdmVkXCIsXG4gICAgICAgICAgICAgICAgICAgIHQoXCJjbF9sb2NhdGlvblwiLCBzY29wZSwgbmFtZSksIHZhbHVlVGV4dChyb3cudmFsdWUsIHByZXZpb3VzKSxcbiAgICAgICAgICAgICAgICApKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBjb21wYXJlUm93cyhwcmV2aW91cy5nbG9iYWxzLCBjdXJyZW50Lmdsb2JhbHMsIHQoXCJjbF9nbG9iYWxzXCIpKTtcbiAgICBmdW5jdGlvbiBjb21wYXJlR3JvdXBzKGJlZm9yZSwgYWZ0ZXIsIHJvd3MpIHtcbiAgICAgICAgY29uc3Qgb2xkR3JvdXBzID0gbmV3IE1hcChiZWZvcmUubWFwKChncm91cCkgPT4gW2dyb3VwLmtleSwgZ3JvdXBdKSk7XG4gICAgICAgIGNvbnN0IG5ld0dyb3VwcyA9IG5ldyBNYXAoYWZ0ZXIubWFwKChncm91cCkgPT4gW2dyb3VwLmtleSwgZ3JvdXBdKSk7XG4gICAgICAgIGZvciAoY29uc3QgW2tleSwgZ3JvdXBdIG9mIG5ld0dyb3Vwcykge1xuICAgICAgICAgICAgY29uc3Qgb2xkID0gb2xkR3JvdXBzLmdldChrZXkpO1xuICAgICAgICAgICAgaWYgKCFvbGQpIGNoYW5nZShrZXksIHQoXCJjbF9uZXdfaXRlbVwiLCBncm91cC5sYWJlbCkpO1xuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY29tcGFyZVJvd3Mocm93cyhvbGQpLCByb3dzKGdyb3VwKSwgZ3JvdXAubGFiZWwpO1xuICAgICAgICAgICAgICAgIGlmIChvbGQudW5zdXBwb3J0ZWQgIT09IGdyb3VwLnVuc3VwcG9ydGVkIHx8IG9sZC5lbmNsb3NpbmdGcmFtZSAhPT0gZ3JvdXAuZW5jbG9zaW5nRnJhbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlKGtleSwgdChcImNsX3ZhbHVlX2NoYW5nZWRcIiwgZ3JvdXAubGFiZWwsXG4gICAgICAgICAgICAgICAgICAgICAgICBvbGQudW5zdXBwb3J0ZWQgPz8gb2xkLmVuY2xvc2luZ0ZyYW1lID8/IHQoXCJjbF9nbG9iYWxfc2NvcGVcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICBncm91cC51bnN1cHBvcnRlZCA/PyBncm91cC5lbmNsb3NpbmdGcmFtZSA/PyB0KFwiY2xfZ2xvYmFsX3Njb3BlXCIpKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3QgW2tleSwgZ3JvdXBdIG9mIG9sZEdyb3Vwcykge1xuICAgICAgICAgICAgaWYgKCFuZXdHcm91cHMuaGFzKGtleSkpIGNoYW5nZShrZXksIHQoXCJjbF9yZW1vdmVkX2l0ZW1cIiwgZ3JvdXAubGFiZWwpKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjb21wYXJlR3JvdXBzKHByZXZpb3VzLmZyYW1lcywgY3VycmVudC5mcmFtZXMsIChmcmFtZSkgPT4gZnJhbWUuYmluZGluZ3MpO1xuICAgIGNvbXBhcmVHcm91cHMoXG4gICAgICAgIFsuLi5wcmV2aW91cy5vYmplY3RzLnZhbHVlcygpXSxcbiAgICAgICAgWy4uLmN1cnJlbnQub2JqZWN0cy52YWx1ZXMoKV0sXG4gICAgICAgIChvYmplY3QpID0+IG9iamVjdC5lbnRyaWVzLFxuICAgICk7XG4gICAgcmV0dXJuIGNoYW5nZXM7XG59XG4iLCJpbXBvcnQgeyBsb2FkIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9qcy9yc2kxOG4uanNcIjtcblxubG9hZCh7XG4gICAgZW46IHtcbiAgICAgICAgXCJjbF92aWV3ZXJcIjogXCJDb2RlTGVucyB0cmFjZSB2aWV3ZXIgcHJvdG90eXBlXCIsXG4gICAgICAgIFwiY2xfdHJhY2VcIjogXCJDb2RlTGVucyB0cmFjZVwiLFxuICAgICAgICBcImNsX2NvZGVcIjogXCJDb2RlXCIsXG4gICAgICAgIFwiY2xfdmlld2VyX2xheW91dFwiOiBcIlZpZXdlciBsYXlvdXRcIixcbiAgICAgICAgXCJjbF9sYXlvdXRfYXV0b1wiOiBcIkF1dG9tYXRpY1wiLFxuICAgICAgICBcImNsX2xheW91dF9zaWRlLWJ5LXNpZGVcIjogXCJTaWRlIGJ5IHNpZGVcIixcbiAgICAgICAgXCJjbF9sYXlvdXRfc3RhY2tlZFwiOiBcIkFib3ZlL2JlbG93XCIsXG4gICAgICAgIFwiY2xfbGluZVwiOiBcIkxpbmUgJDFcIixcbiAgICAgICAgXCJjbF9ub19saW5lXCI6IFwiTm8gc291cmNlIGxpbmVcIixcbiAgICAgICAgXCJjbF9jdXJyZW50X2xpbmVcIjogXCJDdXJyZW50IGxpbmUuIFwiLFxuICAgICAgICBcImNsX25leHRcIjogXCJOZXh0IHN0ZXBcIixcbiAgICAgICAgXCJjbF9wcmV2aW91c1wiOiBcIlByZXZpb3VzIHN0ZXBcIixcbiAgICAgICAgXCJjbF9zdGVwXCI6IFwiU3RlcCAkMSBvZiAkMi4gJDMuXCIsXG4gICAgICAgIFwiY2xfb3V0cHV0XCI6IFwiUHJvZ3JhbSBvdXRwdXRcIixcbiAgICAgICAgXCJjbF9uZXdfb3V0cHV0XCI6IFwiTmV3IG91dHB1dDogJDFcIixcbiAgICAgICAgXCJjbF9vdXRwdXRfY2hhbmdlZFwiOiBcIlByb2dyYW0gb3V0cHV0IGNoYW5nZWQuXCIsXG4gICAgICAgIFwiY2xfd2hpdGVzcGFjZVwiOiBcIndoaXRlc3BhY2VcIixcbiAgICAgICAgXCJjbF9tZW1vcnlcIjogXCJNZW1vcnlcIixcbiAgICAgICAgXCJjbF9tZW1vcnlfdmlld1wiOiBcIk1lbW9yeSB2aWV3XCIsXG4gICAgICAgIFwiY2xfZGlhZ3JhbVwiOiBcIkRpYWdyYW1cIixcbiAgICAgICAgXCJjbF9ncmFwaGljYWxcIjogXCJHcmFwaGljYWwgRGlhZ3JhbVwiLFxuICAgICAgICBcImNsX3RleHRcIjogXCJUZXh0XCIsXG4gICAgICAgIFwiY2xfbWVtb3J5X2hlbHBcIjogXCJSZWZlcmVuY2VzIGxpbmsgdG8gaGVhcCBvYmplY3RzLiBBbGwgdmlld3MgY29udGFpbiB0aGUgc2FtZSBpbmZvcm1hdGlvbi5cIixcbiAgICAgICAgXCJjbF9ncmFwaF9oZWxwXCI6IFwiRHJhZyBhIE1vdmUgYnV0dG9uLCB1c2UgaXRzIGFycm93IGtleXMgKFNoaWZ0IG1vdmVzIGZhcnRoZXIpLCBvciBzZWxlY3QgYW4gb2JqZWN0IGFuZCB1c2UgdGhlIG1vdmVtZW50IGJ1dHRvbnMuIEVzY2FwZSBjYW5jZWxzIGEgZHJhZy4gUG9zaXRpb25zIHBlcnNpc3QgYWNyb3NzIHN0ZXBzIGFuZCB2aWV3cy4gU2Nyb2xsIHRvIGV4cGxvcmUgbGFyZ2VyIGRpYWdyYW1zLlwiLFxuICAgICAgICBcImNsX2dyYXBoX3ZpZXdwb3J0XCI6IFwiR3JhcGhpY2FsIG1lbW9yeSBkaWFncmFtXCIsXG4gICAgICAgIFwiY2xfYXJyYW5nZVwiOiBcIkFycmFuZ2UgYXV0b21hdGljYWxseVwiLFxuICAgICAgICBcImNsX3Jlc2V0X3Bvc2l0aW9uc1wiOiBcIlJlc2V0IHBvc2l0aW9uc1wiLFxuICAgICAgICBcImNsX21vdmVfb2JqZWN0XCI6IFwiTW92ZSBoZWFwIG9iamVjdFwiLFxuICAgICAgICBcImNsX21vdmVfbm9kZVwiOiBcIk1vdmUgJDFcIixcbiAgICAgICAgXCJjbF9tb3ZlX2xlZnRcIjogXCJNb3ZlIGxlZnRcIixcbiAgICAgICAgXCJjbF9tb3ZlX3JpZ2h0XCI6IFwiTW92ZSByaWdodFwiLFxuICAgICAgICBcImNsX21vdmVfdXBcIjogXCJNb3ZlIHVwXCIsXG4gICAgICAgIFwiY2xfbW92ZV9kb3duXCI6IFwiTW92ZSBkb3duXCIsXG4gICAgICAgIFwiY2xfYXJyYW5naW5nXCI6IFwiQXJyYW5naW5nIGhlYXAgb2JqZWN0c+KAplwiLFxuICAgICAgICBcImNsX2FycmFuZ2VkXCI6IFwiSGVhcCBvYmplY3RzIGFycmFuZ2VkLiBNb3ZlIHRoZW0gdG8gYWRqdXN0IHRoZSBsYXlvdXQuXCIsXG4gICAgICAgIFwiY2xfcG9zaXRpb25zX2tlcHRcIjogXCJTYXZlZCBoZWFwIHBvc2l0aW9ucyByZXRhaW5lZC5cIixcbiAgICAgICAgXCJjbF9sYXlvdXRfZmFpbGVkXCI6IFwiQXV0b21hdGljIGxheW91dCBpcyB1bmF2YWlsYWJsZS4gWW91IGNhbiBzdGlsbCBtb3ZlIG9iamVjdHMsIHN3aXRjaCB2aWV3cywgb3Igc2VsZWN0IEFycmFuZ2UgYXV0b21hdGljYWxseSB0byByZXRyeS5cIixcbiAgICAgICAgXCJjbF9ub2RlX3Bvc2l0aW9uXCI6IFwiJDEgcG9zaXRpb25lZCBhdCAkMiwgJDMuXCIsXG4gICAgICAgIFwiY2xfc3RhY2tcIjogXCJTdGFjayBhbmQgZ2xvYmFsc1wiLFxuICAgICAgICBcImNsX2dsb2JhbHNcIjogXCJHbG9iYWwgdmFyaWFibGVzXCIsXG4gICAgICAgIFwiY2xfbm9fZ2xvYmFsc1wiOiBcIk5vIGdsb2JhbCB2YXJpYWJsZXMgYXQgdGhpcyBzdGVwLlwiLFxuICAgICAgICBcImNsX25vX2xvY2Fsc1wiOiBcIk5vIGxvY2FsIHZhcmlhYmxlcyBpbiB0aGlzIGZyYW1lLlwiLFxuICAgICAgICBcImNsX2hlYXBcIjogXCJIZWFwIG9iamVjdHNcIixcbiAgICAgICAgXCJjbF9mcmFtZVwiOiBcIiQxIOKAlCBmcmFtZSAkMlwiLFxuICAgICAgICBcImNsX2FjdGl2ZVwiOiBcIkFjdGl2ZSBmcmFtZVwiLFxuICAgICAgICBcImNsX3JldGFpbmVkXCI6IFwiUmV0YWluZWQgZnJhbWUgKHJldHVybmVkKVwiLFxuICAgICAgICBcImNsX3BhcmVudFwiOiBcIkVuY2xvc2luZyBmcmFtZSAkMVwiLFxuICAgICAgICBcImNsX2dsb2JhbF9zY29wZVwiOiBcIkdsb2JhbCBzY29wZVwiLFxuICAgICAgICBcImNsX2VuY2xvc2luZ1wiOiBcIkVuY2xvc2luZyBzY29wZVwiLFxuICAgICAgICBcImNsX3JldHVyblwiOiBcIlJldHVybiB2YWx1ZVwiLFxuICAgICAgICBcImNsX25hbWVcIjogXCJOYW1lXCIsXG4gICAgICAgIFwiY2xfdmFsdWVcIjogXCJWYWx1ZVwiLFxuICAgICAgICBcImNsX2FkZHJlc3NcIjogXCJBZGRyZXNzOiAkMVwiLFxuICAgICAgICBcImNsX3R5cGVcIjogXCJUeXBlOiAkMVwiLFxuICAgICAgICBcImNsX2NfYXJyYXlcIjogXCJBcnJheSAkMVwiLFxuICAgICAgICBcImNsX21lbW9yeV9jaHVua1wiOiBcIk1lbW9yeSBhdCAkMVwiLFxuICAgICAgICBcImNsX2FycmF5X3R5cGVcIjogXCJhcnJheVwiLFxuICAgICAgICBcImNsX2ZpZWxkXCI6IFwiRmllbGRcIixcbiAgICAgICAgXCJjbF9jX3N0cnVjdFwiOiBcIiQxIGF0ICQyXCIsXG4gICAgICAgIFwiY2xfYWdncmVnYXRlX3ZhbHVlXCI6IFwiJDEgYXQgJDJcIixcbiAgICAgICAgXCJjbF9uZXN0ZWRfdGFibGVcIjogXCIkMTogJDIgbWVtYmVyc1wiLFxuICAgICAgICBcImNsX2luZGV4XCI6IFwiSW5kZXhcIixcbiAgICAgICAgXCJjbF9rZXlcIjogXCJLZXlcIixcbiAgICAgICAgXCJjbF9hdHRyaWJ1dGVcIjogXCJBdHRyaWJ1dGVcIixcbiAgICAgICAgXCJjbF9tZW1iZXJcIjogXCJNZW1iZXJcIixcbiAgICAgICAgXCJjbF9saXN0XCI6IFwiTGlzdCAkMVwiLFxuICAgICAgICBcImNsX3R1cGxlXCI6IFwiVHVwbGUgJDFcIixcbiAgICAgICAgXCJjbF9zZXRcIjogXCJTZXQgJDFcIixcbiAgICAgICAgXCJjbF9kaWN0XCI6IFwiRGljdGlvbmFyeSAkMVwiLFxuICAgICAgICBcImNsX2luc3RhbmNlXCI6IFwiJDEgaW5zdGFuY2UgJDJcIixcbiAgICAgICAgXCJjbF9jbGFzc1wiOiBcIiQxIGNsYXNzICQyXCIsXG4gICAgICAgIFwiY2xfZnVuY3Rpb25cIjogXCJGdW5jdGlvbiAkMVwiLFxuICAgICAgICBcImNsX3ByaW1pdGl2ZVwiOiBcIiQxIG9iamVjdCAkMlwiLFxuICAgICAgICBcImNsX29iamVjdFwiOiBcIk9iamVjdCAkMSAoJDIpXCIsXG4gICAgICAgIFwiY2xfcmVmZXJlbmNlXCI6IFwiUmVmZXJlbmNlIHRvICQxXCIsXG4gICAgICAgIFwiY2xfbWlzc2luZ19yZWZlcmVuY2VcIjogXCJSZWZlcmVuY2UgdG8gb2JqZWN0ICQxIChub3QgcHJlc2VudCBpbiB0aGlzIHNuYXBzaG90KVwiLFxuICAgICAgICBcImNsX3BvaW50ZXJfcmVmZXJlbmNlXCI6IFwiJDE6IFJlZmVyZW5jZSB0byAkMlwiLFxuICAgICAgICBcImNsX3BvaW50ZXJfdGFyZ2V0XCI6IFwiJDEuIFR5cGU6ICQyLiBBZGRyZXNzOiAkMy5cIixcbiAgICAgICAgXCJjbF9udWxsX3BvaW50ZXJcIjogXCJOdWxsIHBvaW50ZXJcIixcbiAgICAgICAgXCJjbF9taXNzaW5nX3BvaW50ZXJcIjogXCJUYXJnZXQgbm90IHByZXNlbnQgaW4gdGhpcyBzbmFwc2hvdFwiLFxuICAgICAgICBcImNsX3Vua25vd25fdmFsdWVcIjogXCJVbnN1cHBvcnRlZCB2YWx1ZTogJDFcIixcbiAgICAgICAgXCJjbF91bmtub3duX29iamVjdFwiOiBcIlVuc3VwcG9ydGVkIG9iamVjdCBlbmNvZGluZzsgcmF3IHRyYWNlIGRhdGE6ICQxXCIsXG4gICAgICAgIFwiY2xfc2lnbmF0dXJlXCI6IFwiU2lnbmF0dXJlXCIsXG4gICAgICAgIFwiY2xfcmVwcmVzZW50YXRpb25cIjogXCJSZXByZXNlbnRhdGlvblwiLFxuICAgICAgICBcImNsX2Jhc2VzXCI6IFwiQmFzZSBjbGFzc2VzXCIsXG4gICAgICAgIFwiY2xfZGVmYXVsdFwiOiBcIkRlZmF1bHQgYXJndW1lbnQgJDFcIixcbiAgICAgICAgXCJjbF9lbXB0eVwiOiBcIk5vIGVudHJpZXMuXCIsXG4gICAgICAgIFwiY2xfY2hhbmdlc1wiOiBcIkNoYW5nZXMgdGhpcyBzdGVwICgkMSlcIixcbiAgICAgICAgXCJjbF9jaGFuZ2VkXCI6IFwiQ2hhbmdlZFwiLFxuICAgICAgICBcImNsX2FkZGVkXCI6IFwiJDEgYWRkZWQ6ICQyLlwiLFxuICAgICAgICBcImNsX3JlbW92ZWRcIjogXCIkMSByZW1vdmVkICh3YXMgJDIpLlwiLFxuICAgICAgICBcImNsX3ZhbHVlX2NoYW5nZWRcIjogXCIkMSBjaGFuZ2VkIGZyb20gJDIgdG8gJDMuXCIsXG4gICAgICAgIFwiY2xfbmV3X2l0ZW1cIjogXCIkMSBhZGRlZC5cIixcbiAgICAgICAgXCJjbF9yZW1vdmVkX2l0ZW1cIjogXCIkMSByZW1vdmVkLlwiLFxuICAgICAgICBcImNsX2xvY2F0aW9uXCI6IFwiJDEsICQyXCIsXG4gICAgICAgIFwiY2xfaW5kZXhfbG9jYXRpb25cIjogXCJpbmRleCAkMVwiLFxuICAgICAgICBcImNsX21lbWJlcl9sb2NhdGlvblwiOiBcIm1lbWJlciAkMVwiLFxuICAgICAgICBcImNsX21vcmVfY2hhbmdlc1wiOiBcIiQxIG1vcmUgY2hhbmdlcyBhdmFpbGFibGUgaW4gQ2hhbmdlcyB0aGlzIHN0ZXAuXCIsXG4gICAgfSxcbn0pO1xuIiwiLy8gUm91bmQgcm91dGVkIGNvcm5lcnMgd2l0aG91dCBtb3ZpbmcgZW5kcG9pbnRzIG9yIGN1dHRpbmcgYWNyb3NzIG9iamVjdCBjYXJkcy5cbmV4cG9ydCBmdW5jdGlvbiBjdXJ2ZWRDb25uZWN0b3JQYXRoKHBvaW50cywgcmFkaXVzID0gMjApIHtcbiAgICBjb25zdCByb3V0ZSA9IHBvaW50cy5maWx0ZXIoKHBvaW50LCBpbmRleCkgPT4gaW5kZXggPT09IDAgfHxcbiAgICAgICAgcG9pbnQueCAhPT0gcG9pbnRzW2luZGV4IC0gMV0ueCB8fCBwb2ludC55ICE9PSBwb2ludHNbaW5kZXggLSAxXS55KTtcbiAgICBpZiAocm91dGUubGVuZ3RoID09PSAwKSByZXR1cm4gXCJcIjtcbiAgICBsZXQgcGF0aCA9IGBNICR7cm91dGVbMF0ueH0gJHtyb3V0ZVswXS55fWA7XG4gICAgZm9yIChsZXQgaW5kZXggPSAxOyBpbmRleCA8IHJvdXRlLmxlbmd0aCAtIDE7IGluZGV4KyspIHtcbiAgICAgICAgY29uc3QgcHJldmlvdXMgPSByb3V0ZVtpbmRleCAtIDFdO1xuICAgICAgICBjb25zdCBjb3JuZXIgPSByb3V0ZVtpbmRleF07XG4gICAgICAgIGNvbnN0IG5leHQgPSByb3V0ZVtpbmRleCArIDFdO1xuICAgICAgICBjb25zdCBiZWZvcmUgPSBNYXRoLmh5cG90KGNvcm5lci54IC0gcHJldmlvdXMueCwgY29ybmVyLnkgLSBwcmV2aW91cy55KTtcbiAgICAgICAgY29uc3QgYWZ0ZXIgPSBNYXRoLmh5cG90KG5leHQueCAtIGNvcm5lci54LCBuZXh0LnkgLSBjb3JuZXIueSk7XG4gICAgICAgIC8vIEhhbGYtc2VnbWVudCBsaW1pdHMga2VlcCBhZGphY2VudCBjdXJ2ZXMgYXBhcnQgYW5kIGxlYXZlIGEgc3RyYWlnaHRcbiAgICAgICAgLy8gZmluYWwgYXBwcm9hY2ggc28gdGhlIGFycm93aGVhZCBzdGF5cyBhbGlnbmVkIHdpdGggaXRzIHRhaWwuXG4gICAgICAgIGNvbnN0IGJlbmQgPSBNYXRoLm1pbihyYWRpdXMsIGJlZm9yZSAvIDIsIGFmdGVyIC8gMik7XG4gICAgICAgIGNvbnN0IGVudHJ5ID0ge1xuICAgICAgICAgICAgeDogY29ybmVyLnggKyAocHJldmlvdXMueCAtIGNvcm5lci54KSAqIGJlbmQgLyBiZWZvcmUsXG4gICAgICAgICAgICB5OiBjb3JuZXIueSArIChwcmV2aW91cy55IC0gY29ybmVyLnkpICogYmVuZCAvIGJlZm9yZSxcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgZXhpdCA9IHtcbiAgICAgICAgICAgIHg6IGNvcm5lci54ICsgKG5leHQueCAtIGNvcm5lci54KSAqIGJlbmQgLyBhZnRlcixcbiAgICAgICAgICAgIHk6IGNvcm5lci55ICsgKG5leHQueSAtIGNvcm5lci55KSAqIGJlbmQgLyBhZnRlcixcbiAgICAgICAgfTtcbiAgICAgICAgcGF0aCArPSBgIEwgJHtlbnRyeS54fSAke2VudHJ5Lnl9IFEgJHtjb3JuZXIueH0gJHtjb3JuZXIueX0gJHtleGl0Lnh9ICR7ZXhpdC55fWA7XG4gICAgfVxuICAgIGNvbnN0IGVuZCA9IHJvdXRlW3JvdXRlLmxlbmd0aCAtIDFdO1xuICAgIHJldHVybiByb3V0ZS5sZW5ndGggPT09IDEgPyBwYXRoIDogYCR7cGF0aH0gTCAke2VuZC54fSAke2VuZC55fWA7XG59XG4iLCJpbXBvcnQgeyB0IH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9qcy9yc2kxOG4uanNcIjtcbmltcG9ydCB7IG1lbW9yeUtleSwgdmFsdWVUZXh0LCBhZ2dyZWdhdGVSb3dzLCBjQWRkcmVzcyB9IGZyb20gXCIuL21lbW9yeS1tb2RlbC5qc1wiO1xuaW1wb3J0IHsgY3JlYXRlR3JhcGhpY2FsSGVhcCB9IGZyb20gXCIuL2dyYXBoaWNhbC1oZWFwLmpzXCI7XG5pbXBvcnQgeyBjdXJ2ZWRDb25uZWN0b3JQYXRoIH0gZnJvbSBcIi4vY29ubmVjdG9yLXBhdGguanNcIjtcblxubGV0IG5leHRWaWV3SWQgPSAwO1xuY29uc3Qgc3ZnTmFtZXNwYWNlID0gXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiO1xuXG5mdW5jdGlvbiBlbGVtZW50KHRhZywgY2xhc3NOYW1lLCB0ZXh0KSB7XG4gICAgY29uc3Qgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnKTtcbiAgICBpZiAoY2xhc3NOYW1lKSBub2RlLmNsYXNzTmFtZSA9IGNsYXNzTmFtZTtcbiAgICBpZiAodGV4dCAhPT0gdW5kZWZpbmVkKSBub2RlLnRleHRDb250ZW50ID0gdGV4dDtcbiAgICByZXR1cm4gbm9kZTtcbn1cblxuZnVuY3Rpb24gc3ZnRWxlbWVudCh0YWcsIGF0dHJpYnV0ZXMpIHtcbiAgICBjb25zdCBub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHN2Z05hbWVzcGFjZSwgdGFnKTtcbiAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhhdHRyaWJ1dGVzKSkgbm9kZS5zZXRBdHRyaWJ1dGUoa2V5LCB2YWx1ZSk7XG4gICAgcmV0dXJuIG5vZGU7XG59XG5cbi8qKiBUaHJlZSBsYXlvdXRzIG9mIG9uZSBzZW1hbnRpYyB0cmVlLiBPbmx5IHRoZSBjb25uZWN0b3Igb3ZlcmxheSBpcyBhcmlhLWhpZGRlbi4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVNZW1vcnlWaWV3KHsgaGFzSGVhcCA9IHRydWUgfSA9IHt9KSB7XG4gICAgY29uc3QgcHJlZml4ID0gYHJzLWNsLW1lbW9yeS0keysrbmV4dFZpZXdJZH1gO1xuICAgIGNvbnN0IHJvb3QgPSBlbGVtZW50KFwic2VjdGlvblwiLCBcInJzLWNvZGVsZW5zLW1lbW9yeVwiKTtcbiAgICBjb25zdCBoZWFkaW5nID0gZWxlbWVudChcImgzXCIsIG51bGwsIHQoXCJjbF9tZW1vcnlcIikpO1xuICAgIGhlYWRpbmcuaWQgPSBgJHtwcmVmaXh9LWhlYWRpbmdgO1xuICAgIGhlYWRpbmcudGFiSW5kZXggPSAtMTtcbiAgICByb290LnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxsZWRieVwiLCBoZWFkaW5nLmlkKTtcbiAgICBjb25zdCB2aWV3Q29udHJvbHMgPSBlbGVtZW50KFwiZmllbGRzZXRcIiwgXCJycy1jb2RlbGVucy1tZW1vcnlfX3ZpZXctY29udHJvbHNcIik7XG4gICAgdmlld0NvbnRyb2xzLmFwcGVuZChlbGVtZW50KFwibGVnZW5kXCIsIG51bGwsIHQoXCJjbF9tZW1vcnlfdmlld1wiKSkpO1xuICAgIGNvbnN0IHN0YWdlID0gZWxlbWVudChcImRpdlwiLCBcInJzLWNvZGVsZW5zLW1lbW9yeV9fc3RhZ2VcIik7XG4gICAgY29uc3Qgdmlld3BvcnQgPSBlbGVtZW50KFwiZGl2XCIsIFwicnMtY29kZWxlbnMtbWVtb3J5X192aWV3cG9ydFwiKTtcbiAgICB2aWV3cG9ydC5kYXRhc2V0LnZpZXcgPSBcImRpYWdyYW1cIjtcbiAgICBzdGFnZS5kYXRhc2V0LnZpZXcgPSBcImRpYWdyYW1cIjtcbiAgICBzdGFnZS5kYXRhc2V0Lmhhc0hlYXAgPSBTdHJpbmcoaGFzSGVhcCk7XG4gICAgZm9yIChjb25zdCBtb2RlIG9mIFtcImRpYWdyYW1cIiwgXCJncmFwaGljYWxcIiwgXCJ0ZXh0XCJdKSB7XG4gICAgICAgIGNvbnN0IGxhYmVsID0gZWxlbWVudChcImxhYmVsXCIpO1xuICAgICAgICBjb25zdCByYWRpbyA9IGVsZW1lbnQoXCJpbnB1dFwiKTtcbiAgICAgICAgcmFkaW8udHlwZSA9IFwicmFkaW9cIjtcbiAgICAgICAgcmFkaW8ubmFtZSA9IGAke3ByZWZpeH0tdmlld2A7XG4gICAgICAgIHJhZGlvLnZhbHVlID0gbW9kZTtcbiAgICAgICAgcmFkaW8uY2hlY2tlZCA9IG1vZGUgPT09IFwiZGlhZ3JhbVwiO1xuICAgICAgICByYWRpby5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsICgpID0+IHtcbiAgICAgICAgICAgIGlmIChyYWRpby5jaGVja2VkKSB7XG4gICAgICAgICAgICAgICAgc3RhZ2UuZGF0YXNldC52aWV3ID0gbW9kZTtcbiAgICAgICAgICAgICAgICB2aWV3cG9ydC5kYXRhc2V0LnZpZXcgPSBtb2RlO1xuICAgICAgICAgICAgICAgIHZpZXdwb3J0LnRhYkluZGV4ID0gbW9kZSA9PT0gXCJncmFwaGljYWxcIiA/IDAgOiAtMTtcbiAgICAgICAgICAgICAgICBpZiAobW9kZSA9PT0gXCJncmFwaGljYWxcIikge1xuICAgICAgICAgICAgICAgICAgICB2aWV3cG9ydC5zZXRBdHRyaWJ1dGUoXCJyb2xlXCIsIFwicmVnaW9uXCIpO1xuICAgICAgICAgICAgICAgICAgICB2aWV3cG9ydC5zZXRBdHRyaWJ1dGUoXCJhcmlhLWxhYmVsXCIsIHQoXCJjbF9ncmFwaF92aWV3cG9ydFwiKSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmlld3BvcnQucmVtb3ZlQXR0cmlidXRlKFwicm9sZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgdmlld3BvcnQucmVtb3ZlQXR0cmlidXRlKFwiYXJpYS1sYWJlbFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZ3JhcGhpY2FsLnNldEVuYWJsZWQobW9kZSA9PT0gXCJncmFwaGljYWxcIiAmJiBoYXNIZWFwKTtcbiAgICAgICAgICAgICAgICBzY2hlZHVsZURyYXcoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGxhYmVsLmFwcGVuZChyYWRpbywgZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoYCAke3QoYGNsXyR7bW9kZX1gKX1gKSk7XG4gICAgICAgIHZpZXdDb250cm9scy5hcHBlbmQobGFiZWwpO1xuICAgIH1cbiAgICBjb25zdCBoZWxwID0gZWxlbWVudChcInBcIiwgXCJycy1jb2RlbGVucy1tZW1vcnlfX2hlbHBcIiwgdChcImNsX21lbW9yeV9oZWxwXCIpKTtcbiAgICBjb25zdCBvdmVybGF5ID0gc3ZnRWxlbWVudChcInN2Z1wiLCB7XG4gICAgICAgIGNsYXNzOiBcInJzLWNvZGVsZW5zLW1lbW9yeV9fY29ubmVjdG9yc1wiLFxuICAgICAgICBcImFyaWEtaGlkZGVuXCI6IFwidHJ1ZVwiLFxuICAgICAgICBmb2N1c2FibGU6IFwiZmFsc2VcIixcbiAgICB9KTtcbiAgICBjb25zdCBzdGFjayA9IGVsZW1lbnQoXCJzZWN0aW9uXCIsIFwicnMtY29kZWxlbnMtbWVtb3J5X19jb2x1bW4gcnMtY29kZWxlbnMtbWVtb3J5X19jb2x1bW4tLXN0YWNrXCIpO1xuICAgIGNvbnN0IGhlYXAgPSBlbGVtZW50KFwic2VjdGlvblwiLCBcInJzLWNvZGVsZW5zLW1lbW9yeV9fY29sdW1uIHJzLWNvZGVsZW5zLW1lbW9yeV9fY29sdW1uLS1oZWFwXCIpO1xuICAgIGhlYXAuaGlkZGVuID0gIWhhc0hlYXA7XG4gICAgY29uc3QgaGVhcENhbnZhcyA9IGVsZW1lbnQoXCJkaXZcIiwgXCJycy1jb2RlbGVucy1tZW1vcnlfX2hlYXAtY2FudmFzXCIpO1xuICAgIGNvbnN0IGdyYXBoaWNhbCA9IGNyZWF0ZUdyYXBoaWNhbEhlYXAoeyBjYW52YXM6IGhlYXBDYW52YXMsIHByZWZpeCwgb25DaGFuZ2U6IHNjaGVkdWxlRHJhdyB9KTtcbiAgICBjb25zdCBjaGFuZ2VEZXRhaWxzID0gZWxlbWVudChcImRldGFpbHNcIiwgXCJycy1jb2RlbGVucy1tZW1vcnlfX2NoYW5nZXNcIik7XG4gICAgY29uc3QgY2hhbmdlU3VtbWFyeSA9IGVsZW1lbnQoXCJzdW1tYXJ5XCIpO1xuICAgIGNvbnN0IGNoYW5nZUxpc3QgPSBlbGVtZW50KFwidWxcIik7XG4gICAgY2hhbmdlRGV0YWlscy5hcHBlbmQoY2hhbmdlU3VtbWFyeSwgY2hhbmdlTGlzdCk7XG4gICAgY2hhbmdlRGV0YWlscy5oaWRkZW4gPSB0cnVlO1xuICAgIHN0YWdlLmFwcGVuZChvdmVybGF5LCBzdGFjaywgaGVhcCk7XG4gICAgdmlld3BvcnQuYXBwZW5kKHN0YWdlKTtcbiAgICByb290LmFwcGVuZChoZWFkaW5nLCB2aWV3Q29udHJvbHMsIGhlbHAsIGdyYXBoaWNhbC5lbGVtZW50LCB2aWV3cG9ydCwgY2hhbmdlRGV0YWlscyk7XG5cbiAgICBsZXQgcmVmZXJlbmNlcyA9IFtdO1xuICAgIGxldCB0YXJnZXRzID0gbmV3IE1hcCgpO1xuICAgIGxldCBwb2ludGVyVGFyZ2V0cyA9IG5ldyBNYXAoKTtcbiAgICBsZXQgcGVuZGluZ1BvaW50ZXJzID0gW107XG4gICAgbGV0IGZyYW1lVGFyZ2V0cyA9IG5ldyBNYXAoKTtcbiAgICBsZXQgcGVuZGluZ0RyYXcgPSBudWxsO1xuICAgIGxldCBkZXN0cm95ZWQgPSBmYWxzZTtcbiAgICBsZXQgYWN0aXZlUmVmZXJlbmNlID0gbnVsbDtcblxuICAgIGZ1bmN0aW9uIHNjaGVkdWxlRHJhdygpIHtcbiAgICAgICAgaWYgKHBlbmRpbmdEcmF3ICE9PSBudWxsIHx8IGRlc3Ryb3llZCkgcmV0dXJuO1xuICAgICAgICBwZW5kaW5nRHJhdyA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgICAgcGVuZGluZ0RyYXcgPSBudWxsO1xuICAgICAgICAgICAgaWYgKCFkZXN0cm95ZWQgJiYgcm9vdC5pc0Nvbm5lY3RlZCkgZHJhd0Nvbm5lY3RvcnMoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZHJhd0Nvbm5lY3RvcnMoKSB7XG4gICAgICAgIG92ZXJsYXkucmVwbGFjZUNoaWxkcmVuKCk7XG4gICAgICAgIGlmIChzdGFnZS5kYXRhc2V0LnZpZXcgPT09IFwidGV4dFwiKSByZXR1cm47XG4gICAgICAgIGNvbnN0IGJvdW5kcyA9IHN0YWdlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICBpZiAoYm91bmRzLndpZHRoID09PSAwIHx8IGJvdW5kcy5oZWlnaHQgPT09IDApIHJldHVybjtcbiAgICAgICAgb3ZlcmxheS5zZXRBdHRyaWJ1dGUoXCJ2aWV3Qm94XCIsIGAwIDAgJHtib3VuZHMud2lkdGh9ICR7Ym91bmRzLmhlaWdodH1gKTtcbiAgICAgICAgY29uc3QgZGVmcyA9IHN2Z0VsZW1lbnQoXCJkZWZzXCIsIHt9KTtcbiAgICAgICAgY29uc3QgbWFya2VyID0gc3ZnRWxlbWVudChcIm1hcmtlclwiLCB7XG4gICAgICAgICAgICBpZDogYCR7cHJlZml4fS1hcnJvd2AsIHZpZXdCb3g6IFwiMCAwIDEwIDEwXCIsIHJlZlg6IFwiOVwiLCByZWZZOiBcIjVcIixcbiAgICAgICAgICAgIG1hcmtlcldpZHRoOiBcIjZcIiwgbWFya2VySGVpZ2h0OiBcIjZcIiwgb3JpZW50OiBcImF1dG8tc3RhcnQtcmV2ZXJzZVwiLFxuICAgICAgICB9KTtcbiAgICAgICAgbWFya2VyLmFwcGVuZChzdmdFbGVtZW50KFwicGF0aFwiLCB7IGQ6IFwiTSAwIDAgTCAxMCA1IEwgMCAxMCB6XCIgfSkpO1xuICAgICAgICBkZWZzLmFwcGVuZChtYXJrZXIpO1xuICAgICAgICBvdmVybGF5LmFwcGVuZChkZWZzKTtcbiAgICAgICAgZm9yIChjb25zdCBbaW5kZXgsIHJlZmVyZW5jZV0gb2YgcmVmZXJlbmNlcy5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IHJlZmVyZW5jZS50YXJnZXQ7XG4gICAgICAgICAgICBpZiAoIXRhcmdldCkgY29udGludWU7XG4gICAgICAgICAgICBjb25zdCBzb3VyY2VDYXJkID0gcmVmZXJlbmNlLmxpbmsuY2xvc2VzdChcIi5ycy1jb2RlbGVucy1tZW1vcnlfX2NhcmRcIik7XG4gICAgICAgICAgICBjb25zdCB0YXJnZXRDYXJkID0gdGFyZ2V0LmNsb3Nlc3QoXCIucnMtY29kZWxlbnMtbWVtb3J5X19jYXJkXCIpO1xuICAgICAgICAgICAgY29uc3Qgc291cmNlUmVjdCA9IHNvdXJjZUNhcmQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICBjb25zdCBjZWxsUmVjdCA9IHJlZmVyZW5jZS5saW5rLmNsb3Nlc3QoXCJ0ZCwgdGhcIikuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICBjb25zdCB0YXJnZXRDZWxsID0gdGFyZ2V0Lm1hdGNoZXMoXCJ0aFwiKSA/IHRhcmdldC5uZXh0RWxlbWVudFNpYmxpbmcgOiBudWxsO1xuICAgICAgICAgICAgY29uc3QgdGFyZ2V0UmVjdCA9ICh0YXJnZXRDZWxsID8/IHRhcmdldENhcmQpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgY29uc3QgdGFyZ2V0SGVhZGluZyA9ICh0YXJnZXRDZWxsID8/IHRhcmdldCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICBjb25zdCB4MSA9IGNlbGxSZWN0LnJpZ2h0IC0gYm91bmRzLmxlZnQ7XG4gICAgICAgICAgICBjb25zdCB5MSA9IGNlbGxSZWN0LnRvcCArIGNlbGxSZWN0LmhlaWdodCAvIDIgLSBib3VuZHMudG9wO1xuICAgICAgICAgICAgY29uc3QgeTIgPSB0YXJnZXRIZWFkaW5nLnRvcCArIHRhcmdldEhlYWRpbmcuaGVpZ2h0IC8gMiAtIGJvdW5kcy50b3A7XG4gICAgICAgICAgICBsZXQgcGF0aDtcbiAgICAgICAgICAgIGNvbnN0IHJvdXRlID0gc3RhZ2UuZGF0YXNldC52aWV3ID09PSBcImdyYXBoaWNhbFwiICYmIGdyYXBoaWNhbC5yb3V0ZUZvcihyZWZlcmVuY2UpO1xuICAgICAgICAgICAgaWYgKHJvdXRlPy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY2FudmFzQm91bmRzID0gaGVhcENhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgICAgICBwYXRoID0gY3VydmVkQ29ubmVjdG9yUGF0aChbeyB4OiB4MSwgeTogeTEgfSwgLi4ucm91dGUubWFwKChwb2ludCkgPT4gKHtcbiAgICAgICAgICAgICAgICAgICAgeDogcG9pbnQueCArIGNhbnZhc0JvdW5kcy5sZWZ0IC0gYm91bmRzLmxlZnQsXG4gICAgICAgICAgICAgICAgICAgIHk6IHBvaW50LnkgKyBjYW52YXNCb3VuZHMudG9wIC0gYm91bmRzLnRvcCxcbiAgICAgICAgICAgICAgICB9KSldKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc3RhZ2UuZGF0YXNldC52aWV3ID09PSBcImdyYXBoaWNhbFwiICYmICFzb3VyY2VDYXJkLmRhdGFzZXQuaGVhcElkICYmXG4gICAgICAgICAgICAgICAgdGFyZ2V0UmVjdC5sZWZ0ID4gaGVhcENhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0ICsgdGFyZ2V0UmVjdC53aWR0aCkge1xuICAgICAgICAgICAgICAgIC8vIFJlYWNoIGxhdGVyIGhlYXAgY29sdW1ucyB0aHJvdWdoIHRoZSB0b3AgZ3V0dGVyLCB3aXRob3V0IG1ha2luZ1xuICAgICAgICAgICAgICAgIC8vIGFuIG9ic2N1cmVkIHN0YWNrIGVkZ2UgYXBwZWFyIHRvIG9yaWdpbmF0ZSBpbiBhbiBpbnRlcnZlbmluZyBjYXJkLlxuICAgICAgICAgICAgICAgIGNvbnN0IGV4aXQgPSB4MSArIDEyICsgKGluZGV4ICUgNCkgKiA0O1xuICAgICAgICAgICAgICAgIGNvbnN0IHRvcCA9IGhlYXBDYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wIC0gYm91bmRzLnRvcCArIDg7XG4gICAgICAgICAgICAgICAgY29uc3QgZW5kID0gdGFyZ2V0UmVjdC5sZWZ0ICsgdGFyZ2V0UmVjdC53aWR0aCAvIDIgLSBib3VuZHMubGVmdDtcbiAgICAgICAgICAgICAgICBwYXRoID0gY3VydmVkQ29ubmVjdG9yUGF0aChbXG4gICAgICAgICAgICAgICAgICAgIHsgeDogeDEsIHk6IHkxIH0sIHsgeDogZXhpdCwgeTogeTEgfSxcbiAgICAgICAgICAgICAgICAgICAgeyB4OiBleGl0LCB5OiB0b3AgfSwgeyB4OiBlbmQsIHk6IHRvcCB9LFxuICAgICAgICAgICAgICAgICAgICB7IHg6IGVuZCwgeTogdGFyZ2V0UmVjdC50b3AgLSBib3VuZHMudG9wIH0sXG4gICAgICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHNvdXJjZVJlY3QucmlnaHQgPCB0YXJnZXRSZWN0LmxlZnQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB4MiA9IHRhcmdldFJlY3QubGVmdCAtIGJvdW5kcy5sZWZ0O1xuICAgICAgICAgICAgICAgIC8vIEZpbmlzaCB0aGUgYmVuZCBiZWZvcmUgdGhlIG1hcmtlciwgbGVhdmluZyBhIHN0cmFpZ2h0IGFwcHJvYWNoLlxuICAgICAgICAgICAgICAgIGNvbnN0IGFwcHJvYWNoID0geDIgLSBNYXRoLm1pbigxOCwgKHgyIC0geDEpIC8gMyk7XG4gICAgICAgICAgICAgICAgY29uc3QgbWlkZGxlID0gKHgxICsgYXBwcm9hY2gpIC8gMjtcbiAgICAgICAgICAgICAgICBwYXRoID0gYE0gJHt4MX0gJHt5MX0gQyAke21pZGRsZX0gJHt5MX0sICR7bWlkZGxlfSAke3kyfSwgJHthcHByb2FjaH0gJHt5Mn0gTCAke3gyfSAke3kyfWA7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIFNhbWUtY29sdW1uIGFuZCBjeWNsaWMgZWRnZXMgcnVuIGluIHRoZSByaWdodC1oYW5kIGd1dHRlci5cbiAgICAgICAgICAgICAgICBjb25zdCB4MiA9IHRhcmdldFJlY3QucmlnaHQgLSBib3VuZHMubGVmdDtcbiAgICAgICAgICAgICAgICBjb25zdCBhcHByb2FjaCA9IHgyICsgMTg7XG4gICAgICAgICAgICAgICAgY29uc3Qgb3V0c2lkZSA9IE1hdGgubWF4KHgxLCBhcHByb2FjaCkgKyAxNCArIChpbmRleCAlIDQpICogNTtcbiAgICAgICAgICAgICAgICBwYXRoID0gYE0gJHt4MX0gJHt5MX0gQyAke291dHNpZGV9ICR7eTF9LCAke291dHNpZGV9ICR7eTF9LCAke291dHNpZGV9ICR7KHkxICsgeTIpIC8gMn0gUyAke291dHNpZGV9ICR7eTJ9LCAke2FwcHJvYWNofSAke3kyfSBMICR7eDJ9ICR7eTJ9YDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlZmVyZW5jZS5wYXRoID0gc3ZnRWxlbWVudChcInBhdGhcIiwge1xuICAgICAgICAgICAgICAgIGNsYXNzOiBcInJzLWNvZGVsZW5zLW1lbW9yeV9fZWRnZVwiLFxuICAgICAgICAgICAgICAgIGQ6IHBhdGgsXG4gICAgICAgICAgICAgICAgXCJtYXJrZXItZW5kXCI6IGB1cmwoIyR7cHJlZml4fS1hcnJvdylgLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBvdmVybGF5LmFwcGVuZChyZWZlcmVuY2UucGF0aCk7XG4gICAgICAgIH1cbiAgICAgICAgaGlnaGxpZ2h0UmVmZXJlbmNlKGFjdGl2ZVJlZmVyZW5jZSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaGlnaGxpZ2h0UmVmZXJlbmNlKGxpbmspIHtcbiAgICAgICAgYWN0aXZlUmVmZXJlbmNlID0gbGluaztcbiAgICAgICAgZm9yIChjb25zdCBub2RlIG9mIHJvb3QucXVlcnlTZWxlY3RvckFsbChcIi5ycy1jb2RlbGVucy1tZW1vcnlfX2NhcmQtLXJlZmVyZW5jZWQsIC5ycy1jb2RlbGVucy1tZW1vcnlfX3RhcmdldC0tcmVmZXJlbmNlZFwiKSkge1xuICAgICAgICAgICAgbm9kZS5jbGFzc0xpc3QucmVtb3ZlKFwicnMtY29kZWxlbnMtbWVtb3J5X19jYXJkLS1yZWZlcmVuY2VkXCIsIFwicnMtY29kZWxlbnMtbWVtb3J5X190YXJnZXQtLXJlZmVyZW5jZWRcIik7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCByZWZlcmVuY2Ugb2YgcmVmZXJlbmNlcykge1xuICAgICAgICAgICAgY29uc3Qgc2VsZWN0ZWQgPSByZWZlcmVuY2UubGluayA9PT0gbGluaztcbiAgICAgICAgICAgIHJlZmVyZW5jZS5wYXRoPy5jbGFzc0xpc3QudG9nZ2xlKFwicnMtY29kZWxlbnMtbWVtb3J5X19lZGdlLS1hY3RpdmVcIiwgc2VsZWN0ZWQpO1xuICAgICAgICAgICAgaWYgKHNlbGVjdGVkKSB7XG4gICAgICAgICAgICAgICAgcmVmZXJlbmNlLnRhcmdldC5jbG9zZXN0KFwiLnJzLWNvZGVsZW5zLW1lbW9yeV9fY2FyZFwiKS5jbGFzc0xpc3QuYWRkKFwicnMtY29kZWxlbnMtbWVtb3J5X19jYXJkLS1yZWZlcmVuY2VkXCIpO1xuICAgICAgICAgICAgICAgIGlmIChyZWZlcmVuY2UudGFyZ2V0Lm1hdGNoZXMoXCJ0aFwiKSkgcmVmZXJlbmNlLnRhcmdldC5jbGFzc0xpc3QuYWRkKFwicnMtY29kZWxlbnMtbWVtb3J5X190YXJnZXQtLXJlZmVyZW5jZWRcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZWdpc3RlclBvaW50ZXJUYXJnZXQoYWRkcmVzcywgbm9kZSwgbGFiZWwpIHtcbiAgICAgICAgY29uc3QgaWQgPSBjQWRkcmVzcyhhZGRyZXNzKTtcbiAgICAgICAgLy8gQW4gYWxsb2NhdGlvbi9zdHJ1Y3QgYW5kIGl0cyBmaXJzdCBtZW1iZXIgY2FuIHNoYXJlIGFuIGFkZHJlc3MuIFRoZVxuICAgICAgICAvLyBjb250YWluaW5nIG9iamVjdCBpcyByZWdpc3RlcmVkIGZpcnN0IGFuZCByZW1haW5zIHRoZSBwcmltYXJ5IHRhcmdldC5cbiAgICAgICAgaWYgKGlkICYmIGlkICE9PSBcIjB4MFwiICYmICFwb2ludGVyVGFyZ2V0cy5oYXMoaWQpKSBwb2ludGVyVGFyZ2V0cy5zZXQoaWQsIHsgbm9kZSwgbGFiZWwgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVmZXJlbmNlTGluayh0ZXh0LCB0YXJnZXQsIGtleSwgaWQsIGFjY2Vzc2libGVOYW1lKSB7XG4gICAgICAgIGNvbnN0IGxpbmsgPSBlbGVtZW50KFwiYVwiLCBcInJzLWNvZGVsZW5zLW1lbW9yeV9fcmVmZXJlbmNlXCIsIHRleHQpO1xuICAgICAgICBsaW5rLmhyZWYgPSBgIyR7dGFyZ2V0LmlkfWA7XG4gICAgICAgIGxpbmsuZGF0YXNldC5tZW1vcnlGb2N1cyA9IGtleTtcbiAgICAgICAgaWYgKGFjY2Vzc2libGVOYW1lKSB7XG4gICAgICAgICAgICBsaW5rLnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIiwgYWNjZXNzaWJsZU5hbWUpO1xuICAgICAgICAgICAgbGluay50aXRsZSA9IGFjY2Vzc2libGVOYW1lO1xuICAgICAgICB9XG4gICAgICAgIGxpbmsuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRhcmdldC5mb2N1cygpO1xuICAgICAgICAgICAgdGFyZ2V0LnNjcm9sbEludG9WaWV3Py4oeyBibG9jazogXCJuZWFyZXN0XCIgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZWZlcmVuY2VzLnB1c2goeyBpZCwgbGluaywgdGFyZ2V0IH0pO1xuICAgICAgICByZXR1cm4gbGluaztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZW5kZXJWYWx1ZSh2YWx1ZSwgbWVtb3J5LCBrZXksIGNoYW5nZWRLZXlzID0gbmV3IFNldCgpLCBjb250ZXh0ID0gXCJcIikge1xuICAgICAgICBpZiAodmFsdWUua2luZCA9PT0gXCJzdHJ1Y3RcIiB8fCB2YWx1ZS5raW5kID09PSBcImFycmF5XCIpIHtcbiAgICAgICAgICAgIHJldHVybiB0YWJsZShhZ2dyZWdhdGVSb3dzKHZhbHVlLCBrZXkpLCBtZW1vcnksXG4gICAgICAgICAgICAgICAgdCh2YWx1ZS5raW5kID09PSBcImFycmF5XCIgPyBcImNsX2luZGV4XCIgOiBcImNsX2ZpZWxkXCIpLCB0KFwiY2xfZW1wdHlcIiksIGNoYW5nZWRLZXlzLFxuICAgICAgICAgICAgICAgIHQoXCJjbF9uZXN0ZWRfdGFibGVcIiwgY29udGV4dCwgdmFsdWUudHlwZSkpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHRleHQgPSB2YWx1ZVRleHQodmFsdWUsIG1lbW9yeSk7XG4gICAgICAgIGlmICh2YWx1ZS5raW5kID09PSBcInBvaW50ZXJcIikge1xuICAgICAgICAgICAgY29uc3QgcGxhY2Vob2xkZXIgPSBlbGVtZW50KFwic3BhblwiLCBudWxsLCB0ZXh0KTtcbiAgICAgICAgICAgIHBlbmRpbmdQb2ludGVycy5wdXNoKHsgdmFsdWUsIHBsYWNlaG9sZGVyLCBrZXkgfSk7XG4gICAgICAgICAgICByZXR1cm4gcGxhY2Vob2xkZXI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHZhbHVlLmtpbmQgIT09IFwicmVmZXJlbmNlXCIgfHwgIXRhcmdldHMuaGFzKHZhbHVlLmlkKSkgcmV0dXJuIGVsZW1lbnQoXCJzcGFuXCIsIG51bGwsIHRleHQpO1xuICAgICAgICByZXR1cm4gcmVmZXJlbmNlTGluayh0ZXh0LCB0YXJnZXRzLmdldCh2YWx1ZS5pZCksIGtleSwgdmFsdWUuaWQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRhYmxlKHJvd3MsIG1lbW9yeSwga2V5SGVhZGluZywgZW1wdHlNZXNzYWdlLCBjaGFuZ2VkS2V5cywgYWNjZXNzaWJsZU5hbWUsIHZhbHVlT25seSA9IGZhbHNlKSB7XG4gICAgICAgIGlmIChyb3dzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIGVsZW1lbnQoXCJwXCIsIFwicnMtY29kZWxlbnMtbWVtb3J5X19lbXB0eVwiLCBlbXB0eU1lc3NhZ2UpO1xuICAgICAgICBjb25zdCBub2RlID0gZWxlbWVudChcInRhYmxlXCIsIFwicnMtY29kZWxlbnMtcHJvdG90eXBlX19tZW1vcnlcIik7XG4gICAgICAgIGlmICh2YWx1ZU9ubHkpIG5vZGUuY2xhc3NMaXN0LmFkZChcInJzLWNvZGVsZW5zLW1lbW9yeV9fdGFibGUtLXZhbHVlLW9ubHlcIik7XG4gICAgICAgIGlmIChyb3dzLnNvbWUoKHJvdykgPT4gcm93LnZhbHVlLmtpbmQgPT09IFwic3RydWN0XCIgfHwgcm93LnZhbHVlLmtpbmQgPT09IFwiYXJyYXlcIikpIHtcbiAgICAgICAgICAgIG5vZGUuY2xhc3NMaXN0LmFkZChcInJzLWNvZGVsZW5zLW1lbW9yeV9fdGFibGUtLWFnZ3JlZ2F0ZVwiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYWNjZXNzaWJsZU5hbWUpIG5vZGUuc2V0QXR0cmlidXRlKFwiYXJpYS1sYWJlbFwiLCBhY2Nlc3NpYmxlTmFtZSk7XG4gICAgICAgIGNvbnN0IGhlYWQgPSBlbGVtZW50KFwidGhlYWRcIik7XG4gICAgICAgIGNvbnN0IGhlYWRlciA9IGVsZW1lbnQoXCJ0clwiKTtcbiAgICAgICAgZm9yIChjb25zdCBuYW1lIG9mIHZhbHVlT25seSA/IFt0KFwiY2xfdmFsdWVcIildIDogW2tleUhlYWRpbmcsIHQoXCJjbF92YWx1ZVwiKV0pIHtcbiAgICAgICAgICAgIGNvbnN0IGNlbGwgPSBlbGVtZW50KFwidGhcIiwgbnVsbCwgbmFtZSk7XG4gICAgICAgICAgICBjZWxsLnNjb3BlID0gXCJjb2xcIjtcbiAgICAgICAgICAgIGhlYWRlci5hcHBlbmQoY2VsbCk7XG4gICAgICAgIH1cbiAgICAgICAgaGVhZC5hcHBlbmQoaGVhZGVyKTtcbiAgICAgICAgY29uc3QgYm9keSA9IGVsZW1lbnQoXCJ0Ym9keVwiKTtcbiAgICAgICAgZm9yIChjb25zdCByb3cgb2Ygcm93cykge1xuICAgICAgICAgICAgY29uc3QgdHIgPSBlbGVtZW50KFwidHJcIik7XG4gICAgICAgICAgICBjb25zdCBsYWJlbCA9IGVsZW1lbnQoXCJ0aFwiKTtcbiAgICAgICAgICAgIGxhYmVsLnNjb3BlID0gXCJyb3dcIjtcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygcm93Lm5hbWUgPT09IFwic3RyaW5nXCIpIGxhYmVsLnRleHRDb250ZW50ID0gcm93Lm5hbWU7XG4gICAgICAgICAgICBlbHNlIGxhYmVsLmFwcGVuZChyZW5kZXJWYWx1ZShyb3cubmFtZSwgbWVtb3J5LCBgJHtyb3cua2V5fS1rZXlgKSk7XG4gICAgICAgICAgICBpZiAocm93LnZhbHVlLmFkZHJlc3MgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1ldGFkYXRhID0gZWxlbWVudChcInNwYW5cIiwgXCJycy1jb2RlbGVucy1tZW1vcnlfX3ZhcmlhYmxlLW1ldGFkYXRhXCIpO1xuICAgICAgICAgICAgICAgIG1ldGFkYXRhLmFwcGVuZChcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudChcInNwYW5cIiwgbnVsbCwgdChcImNsX2FkZHJlc3NcIiwgcm93LnZhbHVlLmFkZHJlc3MpKSxcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudChcInNwYW5cIiwgbnVsbCwgdChcImNsX3R5cGVcIiwgcm93LnZhbHVlLnR5cGUpKSxcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIGxhYmVsLmFwcGVuZChtZXRhZGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBjZWxsID0gZWxlbWVudChcInRkXCIpO1xuICAgICAgICAgICAgY29uc3QgbmFtZSA9IHR5cGVvZiByb3cubmFtZSA9PT0gXCJzdHJpbmdcIiA/IHJvdy5uYW1lIDogdmFsdWVUZXh0KHJvdy5uYW1lLCBtZW1vcnkpO1xuICAgICAgICAgICAgaWYgKCF2YWx1ZU9ubHkgJiYgY0FkZHJlc3Mocm93LnZhbHVlLmFkZHJlc3MpKSB7XG4gICAgICAgICAgICAgICAgbGFiZWwuaWQgPSBgJHtwcmVmaXh9LWFkZHJlc3MtJHtlbmNvZGVVUklDb21wb25lbnQocm93LmtleSl9YDtcbiAgICAgICAgICAgICAgICBsYWJlbC50YWJJbmRleCA9IC0xO1xuICAgICAgICAgICAgICAgIGxhYmVsLmRhdGFzZXQubWVtb3J5Rm9jdXMgPSBtZW1vcnlLZXkocm93LmtleSwgXCJhZGRyZXNzXCIpO1xuICAgICAgICAgICAgICAgIGxhYmVsLnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIiwgdChcImNsX3BvaW50ZXJfdGFyZ2V0XCIsIG5hbWUsIHJvdy52YWx1ZS50eXBlLCByb3cudmFsdWUuYWRkcmVzcykpO1xuICAgICAgICAgICAgICAgIHJlZ2lzdGVyUG9pbnRlclRhcmdldChyb3cudmFsdWUuYWRkcmVzcywgbGFiZWwsIGAke25hbWV9ICgke3Jvdy52YWx1ZS50eXBlfSlgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFVzZSB0aGUgcm93IGlkZW50aXR5IGZvciBlbWJlZGRlZCBmaWVsZHMsIGluZGVwZW5kZW50IG9mIERPTSBuZXN0aW5nLlxuICAgICAgICAgICAgY2VsbC5hcHBlbmQocmVuZGVyVmFsdWUocm93LnZhbHVlLCBtZW1vcnksIHJvdy5rZXksIGNoYW5nZWRLZXlzLCBuYW1lKSk7XG4gICAgICAgICAgICBpZiAocm93LnZhbHVlLmtpbmQgPT09IFwic3RydWN0XCIgfHwgcm93LnZhbHVlLmtpbmQgPT09IFwiYXJyYXlcIikge1xuICAgICAgICAgICAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZChcInJzLWNvZGVsZW5zLW1lbW9yeV9fYWdncmVnYXRlLWNlbGxcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2hhbmdlZEtleXMuaGFzKHJvdy5rZXkpKSB7XG4gICAgICAgICAgICAgICAgdHIuY2xhc3NMaXN0LmFkZChcInJzLWNvZGVsZW5zLW1lbW9yeV9fcm93LS1jaGFuZ2VkXCIpO1xuICAgICAgICAgICAgICAgIGNlbGwuYXBwZW5kKFwiIFwiLCBlbGVtZW50KFwic3BhblwiLCBcInJzLWNvZGVsZW5zLW1lbW9yeV9fY2hhbmdlZFwiLCB0KFwiY2xfY2hhbmdlZFwiKSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCF2YWx1ZU9ubHkpIHRyLmFwcGVuZChsYWJlbCk7XG4gICAgICAgICAgICB0ci5hcHBlbmQoY2VsbCk7XG4gICAgICAgICAgICBib2R5LmFwcGVuZCh0cik7XG4gICAgICAgIH1cbiAgICAgICAgbm9kZS5hcHBlbmQoaGVhZCwgYm9keSk7XG4gICAgICAgIHJldHVybiBub2RlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNhcmQodGl0bGUsIGtleSwgaWQsIGNoYW5nZWRLZXlzKSB7XG4gICAgICAgIGNvbnN0IG5vZGUgPSBlbGVtZW50KFwic2VjdGlvblwiLCBcInJzLWNvZGVsZW5zLW1lbW9yeV9fY2FyZFwiKTtcbiAgICAgICAgY29uc3QgdGl0bGVOb2RlID0gZWxlbWVudChcImg1XCIsIG51bGwsIHRpdGxlKTtcbiAgICAgICAgdGl0bGVOb2RlLmlkID0gaWQ7XG4gICAgICAgIHRpdGxlTm9kZS50YWJJbmRleCA9IC0xO1xuICAgICAgICB0aXRsZU5vZGUuZGF0YXNldC5tZW1vcnlGb2N1cyA9IGtleTtcbiAgICAgICAgbm9kZS5zZXRBdHRyaWJ1dGUoXCJhcmlhLWxhYmVsbGVkYnlcIiwgaWQpO1xuICAgICAgICBub2RlLmFwcGVuZCh0aXRsZU5vZGUpO1xuICAgICAgICBpZiAoY2hhbmdlZEtleXMuaGFzKGtleSkpIG5vZGUuYXBwZW5kKGVsZW1lbnQoXCJwXCIsIFwicnMtY29kZWxlbnMtbWVtb3J5X19jaGFuZ2VkXCIsIHQoXCJjbF9jaGFuZ2VkXCIpKSk7XG4gICAgICAgIHJldHVybiB7IG5vZGUsIHRpdGxlTm9kZSB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNjb3BlTGluayhpZCwga2V5KSB7XG4gICAgICAgIGNvbnN0IGxhYmVsID0gdChcImNsX3BhcmVudFwiLCBpZCk7XG4gICAgICAgIGNvbnN0IHRhcmdldCA9IGZyYW1lVGFyZ2V0cy5nZXQoaWQpO1xuICAgICAgICBpZiAoIXRhcmdldCkgcmV0dXJuIGVsZW1lbnQoXCJzcGFuXCIsIG51bGwsIGxhYmVsKTtcbiAgICAgICAgY29uc3QgbGluayA9IGVsZW1lbnQoXCJhXCIsIG51bGwsIGxhYmVsKTtcbiAgICAgICAgbGluay5ocmVmID0gYCMke3RhcmdldC5pZH1gO1xuICAgICAgICBsaW5rLmRhdGFzZXQubWVtb3J5Rm9jdXMgPSBrZXk7XG4gICAgICAgIGxpbmsuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRhcmdldC5mb2N1cygpO1xuICAgICAgICAgICAgdGFyZ2V0LnNjcm9sbEludG9WaWV3Py4oeyBibG9jazogXCJuZWFyZXN0XCIgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gbGluaztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1cGRhdGUobWVtb3J5LCBjaGFuZ2VzKSB7XG4gICAgICAgIGdyYXBoaWNhbC5iZWZvcmVVcGRhdGUoKTtcbiAgICAgICAgY29uc3QgZm9jdXNlZEtleSA9IHJvb3QuY29udGFpbnMoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkgPyBkb2N1bWVudC5hY3RpdmVFbGVtZW50LmRhdGFzZXQubWVtb3J5Rm9jdXMgOiBudWxsO1xuICAgICAgICBjb25zdCBjaGFuZ2VkS2V5cyA9IG5ldyBTZXQoY2hhbmdlcy5tYXAoKGNoYW5nZSkgPT4gY2hhbmdlLmtleSkpO1xuICAgICAgICByZWZlcmVuY2VzID0gW107XG4gICAgICAgIHRhcmdldHMgPSBuZXcgTWFwKCk7XG4gICAgICAgIHBvaW50ZXJUYXJnZXRzID0gbmV3IE1hcCgpO1xuICAgICAgICBwZW5kaW5nUG9pbnRlcnMgPSBbXTtcbiAgICAgICAgZnJhbWVUYXJnZXRzID0gbmV3IE1hcCgpO1xuICAgICAgICBhY3RpdmVSZWZlcmVuY2UgPSBudWxsO1xuICAgICAgICBjb25zdCBzdGFja0hlYWRpbmcgPSBlbGVtZW50KFwiaDRcIiwgbnVsbCwgdChcImNsX3N0YWNrXCIpKTtcbiAgICAgICAgc3RhY2tIZWFkaW5nLmlkID0gYCR7cHJlZml4fS1zdGFja2A7XG4gICAgICAgIHN0YWNrLnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxsZWRieVwiLCBzdGFja0hlYWRpbmcuaWQpO1xuICAgICAgICBjb25zdCBoZWFwSGVhZGluZyA9IGVsZW1lbnQoXCJoNFwiLCBudWxsLCB0KFwiY2xfaGVhcFwiKSk7XG4gICAgICAgIGhlYXBIZWFkaW5nLmlkID0gYCR7cHJlZml4fS1oZWFwYDtcbiAgICAgICAgaGVhcC5zZXRBdHRyaWJ1dGUoXCJhcmlhLWxhYmVsbGVkYnlcIiwgaGVhcEhlYWRpbmcuaWQpO1xuICAgICAgICBzdGFjay5yZXBsYWNlQ2hpbGRyZW4oc3RhY2tIZWFkaW5nKTtcbiAgICAgICAgaGVhcC5yZXBsYWNlQ2hpbGRyZW4oaGVhcEhlYWRpbmcsIGhlYXBDYW52YXMpO1xuICAgICAgICBoZWFwQ2FudmFzLnJlcGxhY2VDaGlsZHJlbigpO1xuXG4gICAgICAgIC8vIFJlZ2lzdGVyIGV2ZXJ5IHRhcmdldCBiZWZvcmUgY3JlYXRpbmcgcmVmZXJlbmNlIGxpbmtzLCBpbmNsdWRpbmcgY3ljbGVzLlxuICAgICAgICBjb25zdCBvYmplY3RDYXJkcyA9IG5ldyBNYXAoKTtcbiAgICAgICAgZm9yIChjb25zdCBbaWQsIG9iamVjdF0gb2YgbWVtb3J5Lm9iamVjdHMpIHtcbiAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSBjYXJkKG9iamVjdC5sYWJlbCwgb2JqZWN0LmtleSwgYCR7cHJlZml4fS1vYmplY3QtJHtlbmNvZGVVUklDb21wb25lbnQoaWQpfWAsIGNoYW5nZWRLZXlzKTtcbiAgICAgICAgICAgIGl0ZW0ubm9kZS5kYXRhc2V0LmhlYXBJZCA9IGlkO1xuICAgICAgICAgICAgdGFyZ2V0cy5zZXQoaWQsIGl0ZW0udGl0bGVOb2RlKTtcbiAgICAgICAgICAgIGlmIChvYmplY3QudGFnLnN0YXJ0c1dpdGgoXCJDX1wiKSkgcmVnaXN0ZXJQb2ludGVyVGFyZ2V0KGlkLCBpdGVtLnRpdGxlTm9kZSwgb2JqZWN0LmxhYmVsKTtcbiAgICAgICAgICAgIG9iamVjdENhcmRzLnNldChpZCwgaXRlbS5ub2RlKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBmcmFtZUNhcmRzID0gbmV3IE1hcCgpO1xuICAgICAgICBmb3IgKGNvbnN0IGZyYW1lIG9mIG1lbW9yeS5mcmFtZXMpIHtcbiAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSBjYXJkKGZyYW1lLmxhYmVsLCBmcmFtZS5rZXksIGAke3ByZWZpeH0tZnJhbWUtJHtlbmNvZGVVUklDb21wb25lbnQoZnJhbWUuaWQpfWAsIGNoYW5nZWRLZXlzKTtcbiAgICAgICAgICAgIGZyYW1lVGFyZ2V0cy5zZXQoZnJhbWUuaWQsIGl0ZW0udGl0bGVOb2RlKTtcbiAgICAgICAgICAgIGZyYW1lQ2FyZHMuc2V0KGZyYW1lLmlkLCBpdGVtLm5vZGUpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGdsb2JhbHMgPSBjYXJkKHQoXCJjbF9nbG9iYWxzXCIpLCBtZW1vcnlLZXkoXCJnbG9iYWxcIiksIGAke3ByZWZpeH0tZ2xvYmFsc2AsIGNoYW5nZWRLZXlzKS5ub2RlO1xuICAgICAgICBnbG9iYWxzLmFwcGVuZCh0YWJsZShtZW1vcnkuZ2xvYmFscywgbWVtb3J5LCB0KFwiY2xfbmFtZVwiKSwgdChcImNsX25vX2dsb2JhbHNcIiksIGNoYW5nZWRLZXlzKSk7XG4gICAgICAgIHN0YWNrLmFwcGVuZChnbG9iYWxzKTtcbiAgICAgICAgZm9yIChjb25zdCBmcmFtZSBvZiBtZW1vcnkuZnJhbWVzKSB7XG4gICAgICAgICAgICBjb25zdCBub2RlID0gZnJhbWVDYXJkcy5nZXQoZnJhbWUuaWQpO1xuICAgICAgICAgICAgaWYgKGZyYW1lLmFjdGl2ZSkge1xuICAgICAgICAgICAgICAgIG5vZGUuY2xhc3NMaXN0LmFkZChcInJzLWNvZGVsZW5zLW1lbW9yeV9fY2FyZC0tYWN0aXZlXCIpO1xuICAgICAgICAgICAgICAgIG5vZGUuYXBwZW5kKGVsZW1lbnQoXCJwXCIsIFwicnMtY29kZWxlbnMtbWVtb3J5X19mcmFtZS1zdGF0dXNcIiwgdChcImNsX2FjdGl2ZVwiKSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGZyYW1lLnJldGFpbmVkKSBub2RlLmFwcGVuZChlbGVtZW50KFwicFwiLCBudWxsLCB0KFwiY2xfcmV0YWluZWRcIikpKTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgcGFyZW50IG9mIGZyYW1lLnBhcmVudHMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBsaW5lID0gZWxlbWVudChcInBcIik7XG4gICAgICAgICAgICAgICAgbGluZS5hcHBlbmQoc2NvcGVMaW5rKHBhcmVudCwgbWVtb3J5S2V5KFwiZnJhbWVcIiwgZnJhbWUuaWQsIFwicGFyZW50XCIsIHBhcmVudCkpKTtcbiAgICAgICAgICAgICAgICBub2RlLmFwcGVuZChsaW5lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5vZGUuYXBwZW5kKHRhYmxlKGZyYW1lLmJpbmRpbmdzLCBtZW1vcnksIHQoXCJjbF9uYW1lXCIpLCB0KFwiY2xfbm9fbG9jYWxzXCIpLCBjaGFuZ2VkS2V5cykpO1xuICAgICAgICAgICAgc3RhY2suYXBwZW5kKG5vZGUpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3QgW2lkLCBvYmplY3RdIG9mIG1lbW9yeS5vYmplY3RzKSB7XG4gICAgICAgICAgICBjb25zdCBub2RlID0gb2JqZWN0Q2FyZHMuZ2V0KGlkKTtcbiAgICAgICAgICAgIGlmIChvYmplY3QudW5zdXBwb3J0ZWQpIG5vZGUuYXBwZW5kKGVsZW1lbnQoXCJwcmVcIiwgXCJycy1jb2RlbGVucy1tZW1vcnlfX3Jhd1wiLCBvYmplY3QudW5zdXBwb3J0ZWQpKTtcbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChvYmplY3QudGFnID09PSBcIkZVTkNUSU9OXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2NvcGUgPSBlbGVtZW50KFwicFwiKTtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuYXBwZW5kKGAke3QoXCJjbF9lbmNsb3NpbmdcIil9OiBgLCBvYmplY3QuZW5jbG9zaW5nRnJhbWUgPT09IG51bGwgPyB0KFwiY2xfZ2xvYmFsX3Njb3BlXCIpIDogc2NvcGVMaW5rKG9iamVjdC5lbmNsb3NpbmdGcmFtZSwgbWVtb3J5S2V5KFwiaGVhcFwiLCBpZCwgXCJzY29wZVwiKSkpO1xuICAgICAgICAgICAgICAgICAgICBub2RlLmFwcGVuZChzY29wZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChvYmplY3Quc2luZ2xlRWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBlbnRyeSA9IG9iamVjdC5lbnRyaWVzWzBdO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBhZ2dyZWdhdGUgPSBlbnRyeS52YWx1ZS5raW5kID09PSBcInN0cnVjdFwiIHx8IGVudHJ5LnZhbHVlLmtpbmQgPT09IFwiYXJyYXlcIjtcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5kYXRhc2V0LmFnZ3JlZ2F0ZSA9IFN0cmluZyhhZ2dyZWdhdGUpO1xuICAgICAgICAgICAgICAgICAgICBub2RlLmFwcGVuZChhZ2dyZWdhdGVcbiAgICAgICAgICAgICAgICAgICAgICAgID8gcmVuZGVyVmFsdWUoZW50cnkudmFsdWUsIG1lbW9yeSwgZW50cnkua2V5LCBjaGFuZ2VkS2V5cywgb2JqZWN0LmxhYmVsKVxuICAgICAgICAgICAgICAgICAgICAgICAgOiB0YWJsZShvYmplY3QuZW50cmllcywgbWVtb3J5LCBvYmplY3Qua2V5SGVhZGluZywgdChcImNsX2VtcHR5XCIpLCBjaGFuZ2VkS2V5cywgb2JqZWN0LmxhYmVsLCB0cnVlKSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5hcHBlbmQodGFibGUob2JqZWN0LmVudHJpZXMsIG1lbW9yeSwgb2JqZWN0LmtleUhlYWRpbmcsIHQoXCJjbF9lbXB0eVwiKSwgY2hhbmdlZEtleXMpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBoZWFwQ2FudmFzLmFwcGVuZChub2RlKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IHsgdmFsdWUsIHBsYWNlaG9sZGVyLCBrZXkgfSBvZiBwZW5kaW5nUG9pbnRlcnMpIHtcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IHBvaW50ZXJUYXJnZXRzLmdldCh2YWx1ZS5pZCk7XG4gICAgICAgICAgICBpZiAodGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaGVhcElkID0gdGFyZ2V0Lm5vZGUuY2xvc2VzdChcIltkYXRhLWhlYXAtaWRdXCIpPy5kYXRhc2V0LmhlYXBJZDtcbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlci5yZXBsYWNlV2l0aChyZWZlcmVuY2VMaW5rKHZhbHVlLnRleHQsIHRhcmdldC5ub2RlLCBrZXksIGhlYXBJZCxcbiAgICAgICAgICAgICAgICAgICAgdChcImNsX3BvaW50ZXJfcmVmZXJlbmNlXCIsIHZhbHVlLnRleHQsIHRhcmdldC5sYWJlbCkpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGVzY3JpcHRpb24gPSB0KHZhbHVlLmlkID09PSBcIjB4MFwiID8gXCJjbF9udWxsX3BvaW50ZXJcIiA6IFwiY2xfbWlzc2luZ19wb2ludGVyXCIpO1xuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyLnRpdGxlID0gZGVzY3JpcHRpb247XG4gICAgICAgICAgICAgICAgcGxhY2Vob2xkZXIuYXBwZW5kKGVsZW1lbnQoXCJzcGFuXCIsIFwicnMtY29kZWxlbnMtcHJvdG90eXBlX19zci1vbmx5XCIsIGAgKCR7ZGVzY3JpcHRpb259KWApKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBsZXQgc3RhY2tEZXB0aCA9IDA7XG4gICAgICAgIGxldCBoZWFwRGVwdGggPSAwO1xuICAgICAgICBmb3IgKGNvbnN0IG5vZGUgb2YgWy4uLnN0YWNrLnF1ZXJ5U2VsZWN0b3JBbGwoXCIucnMtY29kZWxlbnMtbWVtb3J5X19jYXJkXCIpLCAuLi5vYmplY3RDYXJkcy52YWx1ZXMoKV0pIHtcbiAgICAgICAgICAgIGxldCBkZXB0aCA9IG5vZGUuZGF0YXNldC5hZ2dyZWdhdGUgPT09IFwidHJ1ZVwiID8gMSA6IDA7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IG5lc3RlZCBvZiBub2RlLnF1ZXJ5U2VsZWN0b3JBbGwoXCJ0YWJsZVwiKSkge1xuICAgICAgICAgICAgICAgIGxldCBsZXZlbCA9IDA7XG4gICAgICAgICAgICAgICAgbGV0IHBhcmVudCA9IG5lc3RlZC5wYXJlbnRFbGVtZW50LmNsb3Nlc3QoXCJ0YWJsZVwiKTtcbiAgICAgICAgICAgICAgICB3aGlsZSAocGFyZW50ICYmIG5vZGUuY29udGFpbnMocGFyZW50KSkge1xuICAgICAgICAgICAgICAgICAgICBsZXZlbCsrO1xuICAgICAgICAgICAgICAgICAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50RWxlbWVudC5jbG9zZXN0KFwidGFibGVcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGRlcHRoID0gTWF0aC5tYXgoZGVwdGgsIGxldmVsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5vZGUuc3R5bGUuc2V0UHJvcGVydHkoXCItLWNsLWNhcmQtd2lkdGhcIiwgYCR7MTYgKyBkZXB0aCAqIDEwfXJlbWApO1xuICAgICAgICAgICAgaWYgKG5vZGUuZGF0YXNldC5oZWFwSWQgIT09IHVuZGVmaW5lZCkgaGVhcERlcHRoID0gTWF0aC5tYXgoaGVhcERlcHRoLCBkZXB0aCk7XG4gICAgICAgICAgICBlbHNlIHN0YWNrRGVwdGggPSBNYXRoLm1heChzdGFja0RlcHRoLCBkZXB0aCk7XG4gICAgICAgIH1cbiAgICAgICAgc3RhZ2Uuc3R5bGUuc2V0UHJvcGVydHkoXCItLWNsLXN0YWNrLXdpZHRoXCIsIGAkezE2ICsgc3RhY2tEZXB0aCAqIDEwfXJlbWApO1xuICAgICAgICBzdGFnZS5zdHlsZS5zZXRQcm9wZXJ0eShcIi0tY2wtaGVhcC13aWR0aFwiLCBgJHsxNiArIGhlYXBEZXB0aCAqIDEwfXJlbWApO1xuICAgICAgICBzdGFnZS5kYXRhc2V0Lmhhc05lc3RlZCA9IFN0cmluZyhzdGFja0RlcHRoID4gMCB8fCBoZWFwRGVwdGggPiAwKTtcbiAgICAgICAgZ3JhcGhpY2FsLnN5bmMob2JqZWN0Q2FyZHMsIHJlZmVyZW5jZXMpO1xuICAgICAgICBjaGFuZ2VTdW1tYXJ5LnRleHRDb250ZW50ID0gdChcImNsX2NoYW5nZXNcIiwgY2hhbmdlcy5sZW5ndGgpO1xuICAgICAgICBjaGFuZ2VMaXN0LnJlcGxhY2VDaGlsZHJlbiguLi5jaGFuZ2VzLm1hcCgoY2hhbmdlKSA9PiBlbGVtZW50KFwibGlcIiwgbnVsbCwgY2hhbmdlLnRleHQpKSk7XG4gICAgICAgIGNoYW5nZURldGFpbHMuaGlkZGVuID0gY2hhbmdlcy5sZW5ndGggPT09IDA7XG4gICAgICAgIGlmIChmb2N1c2VkS2V5KSB7XG4gICAgICAgICAgICBjb25zdCByZXBsYWNlbWVudCA9IFsuLi5yb290LnF1ZXJ5U2VsZWN0b3JBbGwoXCJbZGF0YS1tZW1vcnktZm9jdXNdXCIpXS5maW5kKChub2RlKSA9PiBub2RlLmRhdGFzZXQubWVtb3J5Rm9jdXMgPT09IGZvY3VzZWRLZXkpO1xuICAgICAgICAgICAgKHJlcGxhY2VtZW50ID8/IGhlYWRpbmcpLmZvY3VzKCk7XG4gICAgICAgIH1cbiAgICAgICAgc2NoZWR1bGVEcmF3KCk7XG4gICAgfVxuXG4gICAgc3RhZ2UuYWRkRXZlbnRMaXN0ZW5lcihcImZvY3VzaW5cIiwgKGV2ZW50KSA9PiBoaWdobGlnaHRSZWZlcmVuY2UoZXZlbnQudGFyZ2V0LmNsb3Nlc3QoXCIucnMtY29kZWxlbnMtbWVtb3J5X19yZWZlcmVuY2VcIikpKTtcbiAgICBzdGFnZS5hZGRFdmVudExpc3RlbmVyKFwiZm9jdXNvdXRcIiwgKCkgPT4gaGlnaGxpZ2h0UmVmZXJlbmNlKG51bGwpKTtcbiAgICBzdGFnZS5hZGRFdmVudExpc3RlbmVyKFwicG9pbnRlcm92ZXJcIiwgKGV2ZW50KSA9PiB7XG4gICAgICAgIGNvbnN0IGxpbmsgPSBldmVudC50YXJnZXQuY2xvc2VzdChcIi5ycy1jb2RlbGVucy1tZW1vcnlfX3JlZmVyZW5jZVwiKTtcbiAgICAgICAgaWYgKGxpbmspIGhpZ2hsaWdodFJlZmVyZW5jZShsaW5rKTtcbiAgICB9KTtcbiAgICBzdGFnZS5hZGRFdmVudExpc3RlbmVyKFwicG9pbnRlcm91dFwiLCAoKSA9PiBoaWdobGlnaHRSZWZlcmVuY2UoZG9jdW1lbnQuYWN0aXZlRWxlbWVudC5jbG9zZXN0Py4oXCIucnMtY29kZWxlbnMtbWVtb3J5X19yZWZlcmVuY2VcIikpKTtcbiAgICBjb25zdCByZXNpemVPYnNlcnZlciA9IHR5cGVvZiBSZXNpemVPYnNlcnZlciA9PT0gXCJmdW5jdGlvblwiID8gbmV3IFJlc2l6ZU9ic2VydmVyKHNjaGVkdWxlRHJhdykgOiBudWxsO1xuICAgIHJlc2l6ZU9ic2VydmVyPy5vYnNlcnZlKHN0YWdlKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCBzY2hlZHVsZURyYXcpO1xuICAgIHJldHVybiB7XG4gICAgICAgIGVsZW1lbnQ6IHJvb3QsXG4gICAgICAgIHVwZGF0ZSxcbiAgICAgICAgZGVzdHJveSgpIHtcbiAgICAgICAgICAgIGRlc3Ryb3llZCA9IHRydWU7XG4gICAgICAgICAgICBncmFwaGljYWwuZGVzdHJveSgpO1xuICAgICAgICAgICAgcmVzaXplT2JzZXJ2ZXI/LmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIHNjaGVkdWxlRHJhdyk7XG4gICAgICAgICAgICBpZiAocGVuZGluZ0RyYXcgIT09IG51bGwpIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZShwZW5kaW5nRHJhdyk7XG4gICAgICAgIH0sXG4gICAgfTtcbn1cbiIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsImltcG9ydCB7IHQgfSBmcm9tIFwiLi4vLi4vY29tbW9uL2pzL3JzaTE4bi5qc1wiO1xuaW1wb3J0IHsgbGF5b3V0SGVhcCB9IGZyb20gXCIuL2Vsay1sYXlvdXQuanNcIjtcblxuY29uc3QgcGFkZGluZyA9IDI0O1xuY29uc3QgZGlyZWN0aW9ucyA9IHsgbGVmdDogWy0xLCAwXSwgcmlnaHQ6IFsxLCAwXSwgdXA6IFswLCAtMV0sIGRvd246IFswLCAxXSB9O1xuXG5mdW5jdGlvbiBlbGVtZW50KHRhZywgdGV4dCkge1xuICAgIGNvbnN0IG5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZyk7XG4gICAgaWYgKHRleHQgIT09IHVuZGVmaW5lZCkgbm9kZS50ZXh0Q29udGVudCA9IHRleHQ7XG4gICAgcmV0dXJuIG5vZGU7XG59XG5cbmZ1bmN0aW9uIHNpemVPZihjYXJkKSB7XG4gICAgY29uc3QgcmVjdCA9IGNhcmQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgd2lkdGg6IHJlY3Qud2lkdGggfHwgcGFyc2VGbG9hdChjYXJkLnN0eWxlLmdldFByb3BlcnR5VmFsdWUoXCItLWNsLWNhcmQtd2lkdGhcIikpICogMTYgfHwgMjU2LFxuICAgICAgICBoZWlnaHQ6IHJlY3QuaGVpZ2h0IHx8IDEwMCArIGNhcmQucXVlcnlTZWxlY3RvckFsbChcInRib2R5IHRyXCIpLmxlbmd0aCAqIDMyLFxuICAgIH07XG59XG5cbmZ1bmN0aW9uIGZyZWVQb3NpdGlvbihjYW5kaWRhdGUsIHNpemUsIG9jY3VwaWVkKSB7XG4gICAgY29uc3QgcG9zaXRpb24gPSB7IHg6IE1hdGgubWF4KHBhZGRpbmcsIGNhbmRpZGF0ZS54KSwgeTogTWF0aC5tYXgocGFkZGluZywgY2FuZGlkYXRlLnkpIH07XG4gICAgLy8gUGxhY2UgbmV3bHkgYXBwZWFyaW5nIG9iamVjdHMgd2l0aG91dCBtb3ZpbmcgZXhpc3Rpbmcgb3IgbWFudWFsbHkgcGxhY2VkIG9uZXMuXG4gICAgZm9yIChsZXQgYXR0ZW1wdCA9IDA7IGF0dGVtcHQgPD0gb2NjdXBpZWQubGVuZ3RoOyBhdHRlbXB0KyspIHtcbiAgICAgICAgY29uc3QgY29sbGlzaW9uID0gb2NjdXBpZWQuZmluZCgob3RoZXIpID0+XG4gICAgICAgICAgICBwb3NpdGlvbi54IDwgb3RoZXIueCArIG90aGVyLndpZHRoICsgcGFkZGluZyAmJlxuICAgICAgICAgICAgcG9zaXRpb24ueCArIHNpemUud2lkdGggKyBwYWRkaW5nID4gb3RoZXIueCAmJlxuICAgICAgICAgICAgcG9zaXRpb24ueSA8IG90aGVyLnkgKyBvdGhlci5oZWlnaHQgKyBwYWRkaW5nICYmXG4gICAgICAgICAgICBwb3NpdGlvbi55ICsgc2l6ZS5oZWlnaHQgKyBwYWRkaW5nID4gb3RoZXIueSxcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKCFjb2xsaXNpb24pIGJyZWFrO1xuICAgICAgICBwb3NpdGlvbi55ID0gY29sbGlzaW9uLnkgKyBjb2xsaXNpb24uaGVpZ2h0ICsgcGFkZGluZztcbiAgICB9XG4gICAgcmV0dXJuIHBvc2l0aW9uO1xufVxuXG4vKiogT3duIHBvc2l0aW9ucyBhbmQgaW50ZXJhY3Rpb25zOyB0aGUgc2VtYW50aWMgY2FyZHMgc3RpbGwgYmVsb25nIHRvIG1lbW9yeS12aWV3LiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUdyYXBoaWNhbEhlYXAoeyBjYW52YXMsIHByZWZpeCwgb25DaGFuZ2UgfSkge1xuICAgIGNvbnN0IGNvbnRyb2xzID0gZWxlbWVudChcImRpdlwiKTtcbiAgICBjb250cm9scy5jbGFzc05hbWUgPSBcInJzLWNvZGVsZW5zLW1lbW9yeV9fZ3JhcGgtY29udHJvbHNcIjtcbiAgICBjb250cm9scy5oaWRkZW4gPSB0cnVlO1xuICAgIGNvbnN0IGhlbHAgPSBlbGVtZW50KFwicFwiLCB0KFwiY2xfZ3JhcGhfaGVscFwiKSk7XG4gICAgaGVscC5pZCA9IGAke3ByZWZpeH0tZ3JhcGgtaGVscGA7XG4gICAgY29uc3QgYWN0aW9ucyA9IGVsZW1lbnQoXCJkaXZcIik7XG4gICAgYWN0aW9ucy5jbGFzc05hbWUgPSBcInJzLWNvZGVsZW5zLXByb3RvdHlwZV9fY29udHJvbHNcIjtcbiAgICBjb25zdCBhcnJhbmdlID0gZWxlbWVudChcImJ1dHRvblwiLCB0KFwiY2xfYXJyYW5nZVwiKSk7XG4gICAgY29uc3QgcmVzZXQgPSBlbGVtZW50KFwiYnV0dG9uXCIsIHQoXCJjbF9yZXNldF9wb3NpdGlvbnNcIikpO1xuICAgIGNvbnN0IGxhYmVsID0gZWxlbWVudChcImxhYmVsXCIsIHQoXCJjbF9tb3ZlX29iamVjdFwiKSk7XG4gICAgY29uc3Qgc2VsZWN0ID0gZWxlbWVudChcInNlbGVjdFwiKTtcbiAgICBzZWxlY3QuaWQgPSBgJHtwcmVmaXh9LW1vdmUtb2JqZWN0YDtcbiAgICBsYWJlbC5odG1sRm9yID0gc2VsZWN0LmlkO1xuICAgIGNvbnN0IG1vdmVtZW50ID0gZWxlbWVudChcImRpdlwiKTtcbiAgICBtb3ZlbWVudC5jbGFzc05hbWUgPSBcInJzLWNvZGVsZW5zLW1lbW9yeV9fbW92ZW1lbnRcIjtcbiAgICBjb25zdCBtb3ZlQnV0dG9ucyA9IFtdO1xuICAgIGZvciAoY29uc3QgZGlyZWN0aW9uIG9mIE9iamVjdC5rZXlzKGRpcmVjdGlvbnMpKSB7XG4gICAgICAgIGNvbnN0IGJ1dHRvbiA9IGVsZW1lbnQoXCJidXR0b25cIiwgdChgY2xfbW92ZV8ke2RpcmVjdGlvbn1gKSk7XG4gICAgICAgIGJ1dHRvbi50eXBlID0gXCJidXR0b25cIjtcbiAgICAgICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiBtb3ZlU2VsZWN0ZWQoZGlyZWN0aW9uKSk7XG4gICAgICAgIG1vdmVCdXR0b25zLnB1c2goYnV0dG9uKTtcbiAgICAgICAgbW92ZW1lbnQuYXBwZW5kKGJ1dHRvbik7XG4gICAgfVxuICAgIGNvbnN0IHN0YXR1cyA9IGVsZW1lbnQoXCJwXCIpO1xuICAgIHN0YXR1cy5zZXRBdHRyaWJ1dGUoXCJyb2xlXCIsIFwic3RhdHVzXCIpO1xuICAgIHN0YXR1cy5zZXRBdHRyaWJ1dGUoXCJhcmlhLWF0b21pY1wiLCBcInRydWVcIik7XG4gICAgYXJyYW5nZS50eXBlID0gcmVzZXQudHlwZSA9IFwiYnV0dG9uXCI7XG4gICAgYWN0aW9ucy5hcHBlbmQoYXJyYW5nZSwgcmVzZXQpO1xuICAgIG1vdmVtZW50LnByZXBlbmQobGFiZWwsIHNlbGVjdCk7XG4gICAgY29udHJvbHMuYXBwZW5kKGhlbHAsIGFjdGlvbnMsIG1vdmVtZW50LCBzdGF0dXMpO1xuXG4gICAgbGV0IGNhcmRzID0gbmV3IE1hcCgpO1xuICAgIGxldCByZWZlcmVuY2VzID0gW107XG4gICAgY29uc3QgcG9zaXRpb25zID0gbmV3IE1hcCgpOyAvLyBSZXRhaW4gYWJzZW50IG9iamVjdHMgdG9vLCBmb3IgYmFja3dhcmQgc3RlcHBpbmcuXG4gICAgY29uc3QgY29tbWl0dGVkID0gbmV3IFNldCgpO1xuICAgIGxldCByb3V0ZXMgPSBuZXcgTWFwKCk7XG4gICAgbGV0IHJvdXRlR2VvbWV0cnkgPSBudWxsO1xuICAgIGxldCBzZWxlY3RlZElkID0gbnVsbDtcbiAgICBsZXQgZW5hYmxlZCA9IGZhbHNlO1xuICAgIGxldCBkZXN0cm95ZWQgPSBmYWxzZTtcbiAgICBsZXQgcmV2aXNpb24gPSAwO1xuICAgIGxldCBidXN5ID0gZmFsc2U7XG4gICAgbGV0IGRyYWcgPSBudWxsO1xuICAgIGNvbnN0IHNpemVPYnNlcnZlciA9IHR5cGVvZiBSZXNpemVPYnNlcnZlciA9PT0gXCJmdW5jdGlvblwiXG4gICAgICAgID8gbmV3IFJlc2l6ZU9ic2VydmVyKCgpID0+IHsgaWYgKGVuYWJsZWQgJiYgIWRlc3Ryb3llZCkgYXBwbHlQb3NpdGlvbnMoKTsgfSlcbiAgICAgICAgOiBudWxsO1xuXG4gICAgZnVuY3Rpb24gbWVzc2FnZShrZXksIC4uLmFyZ3MpIHtcbiAgICAgICAgY29uc3QgdGV4dCA9IHQoa2V5LCAuLi5hcmdzKTtcbiAgICAgICAgaWYgKHN0YXR1cy50ZXh0Q29udGVudCAhPT0gdGV4dCkgc3RhdHVzLnRleHRDb250ZW50ID0gdGV4dDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZXZlYWxPYmplY3QoaWQpIHtcbiAgICAgICAgY29uc3Qgdmlld3BvcnQgPSBjYW52YXMuY2xvc2VzdChcIi5ycy1jb2RlbGVucy1tZW1vcnlfX3ZpZXdwb3J0XCIpO1xuICAgICAgICBpZiAoIWVuYWJsZWQgfHwgIXZpZXdwb3J0IHx8ICFjYXJkcy5oYXMoaWQpKSByZXR1cm47XG4gICAgICAgIGNvbnN0IGJvdW5kcyA9IHZpZXdwb3J0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICBpZiAoIWJvdW5kcy53aWR0aCB8fCAhYm91bmRzLmhlaWdodCkgcmV0dXJuO1xuICAgICAgICBjb25zdCBub2RlID0gY2FyZHMuZ2V0KGlkKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgY29uc3QgcmlnaHQgPSBub2RlLmxlZnQgKyBNYXRoLm1pbihub2RlLndpZHRoLCB2aWV3cG9ydC5jbGllbnRXaWR0aCAtIDE2KTtcbiAgICAgICAgY29uc3QgYm90dG9tID0gbm9kZS50b3AgKyBNYXRoLm1pbihub2RlLmhlaWdodCwgdmlld3BvcnQuY2xpZW50SGVpZ2h0IC0gMTYpO1xuICAgICAgICAvLyBTY3JvbGwgb25seSB0aGUgZ3JhcGgsIHNvIHRoZSBtb3ZlbWVudCBjb250cm9scyBzdGF5IGluIHBsYWNlLlxuICAgICAgICBpZiAobm9kZS5sZWZ0IDwgYm91bmRzLmxlZnQgKyA4KSB2aWV3cG9ydC5zY3JvbGxMZWZ0IC09IGJvdW5kcy5sZWZ0ICsgOCAtIG5vZGUubGVmdDtcbiAgICAgICAgZWxzZSBpZiAocmlnaHQgPiBib3VuZHMubGVmdCArIHZpZXdwb3J0LmNsaWVudFdpZHRoIC0gOCkgdmlld3BvcnQuc2Nyb2xsTGVmdCArPSByaWdodCAtIGJvdW5kcy5sZWZ0IC0gdmlld3BvcnQuY2xpZW50V2lkdGggKyA4O1xuICAgICAgICBpZiAobm9kZS50b3AgPCBib3VuZHMudG9wICsgOCkgdmlld3BvcnQuc2Nyb2xsVG9wIC09IGJvdW5kcy50b3AgKyA4IC0gbm9kZS50b3A7XG4gICAgICAgIGVsc2UgaWYgKGJvdHRvbSA+IGJvdW5kcy50b3AgKyB2aWV3cG9ydC5jbGllbnRIZWlnaHQgLSA4KSB2aWV3cG9ydC5zY3JvbGxUb3AgKz0gYm90dG9tIC0gYm91bmRzLnRvcCAtIHZpZXdwb3J0LmNsaWVudEhlaWdodCArIDg7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0QnVzeSh2YWx1ZSkge1xuICAgICAgICBidXN5ID0gdmFsdWU7XG4gICAgICAgIGFycmFuZ2Uuc2V0QXR0cmlidXRlKFwiYXJpYS1kaXNhYmxlZFwiLCBTdHJpbmcodmFsdWUgfHwgY2FyZHMuc2l6ZSA9PT0gMCkpO1xuICAgICAgICByZXNldC5zZXRBdHRyaWJ1dGUoXCJhcmlhLWRpc2FibGVkXCIsIFN0cmluZyh2YWx1ZSB8fCBjYXJkcy5zaXplID09PSAwKSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2VsZWN0T2JqZWN0KGlkKSB7XG4gICAgICAgIHNlbGVjdGVkSWQgPSBjYXJkcy5oYXMoaWQpID8gaWQgOiAoY2FyZHMua2V5cygpLm5leHQoKS52YWx1ZSA/PyBudWxsKTtcbiAgICAgICAgc2VsZWN0LnZhbHVlID0gc2VsZWN0ZWRJZCA/PyBcIlwiO1xuICAgICAgICBmb3IgKGNvbnN0IFtvYmplY3RJZCwgY2FyZF0gb2YgY2FyZHMpIHtcbiAgICAgICAgICAgIGNhcmQuY2xhc3NMaXN0LnRvZ2dsZShcInJzLWNvZGVsZW5zLW1lbW9yeV9fY2FyZC0tc2VsZWN0ZWRcIiwgb2JqZWN0SWQgPT09IHNlbGVjdGVkSWQpO1xuICAgICAgICB9XG4gICAgICAgIHNlbGVjdC5kaXNhYmxlZCA9IGNhcmRzLnNpemUgPT09IDA7XG4gICAgICAgIG1vdmVCdXR0b25zLmZvckVhY2goKGJ1dHRvbikgPT4geyBidXR0b24uZGlzYWJsZWQgPSBjYXJkcy5zaXplID09PSAwOyB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhcHBseVBvc2l0aW9ucygpIHtcbiAgICAgICAgaWYgKCFlbmFibGVkKSByZXR1cm47XG4gICAgICAgIGxldCB3aWR0aCA9IDMyMDtcbiAgICAgICAgbGV0IGhlaWdodCA9IDI2MDtcbiAgICAgICAgZm9yIChjb25zdCBbaWQsIGNhcmRdIG9mIGNhcmRzKSB7XG4gICAgICAgICAgICBjb25zdCBwb3NpdGlvbiA9IHBvc2l0aW9ucy5nZXQoaWQpO1xuICAgICAgICAgICAgaWYgKCFwb3NpdGlvbikgY29udGludWU7XG4gICAgICAgICAgICBjYXJkLnN0eWxlLmxlZnQgPSBgJHtwb3NpdGlvbi54fXB4YDtcbiAgICAgICAgICAgIGNhcmQuc3R5bGUudG9wID0gYCR7cG9zaXRpb24ueX1weGA7XG4gICAgICAgICAgICBjb25zdCBzaXplID0gc2l6ZU9mKGNhcmQpO1xuICAgICAgICAgICAgd2lkdGggPSBNYXRoLm1heCh3aWR0aCwgcG9zaXRpb24ueCArIHNpemUud2lkdGggKyA0OCk7XG4gICAgICAgICAgICBoZWlnaHQgPSBNYXRoLm1heChoZWlnaHQsIHBvc2l0aW9uLnkgKyBzaXplLmhlaWdodCArIDQ4KTtcbiAgICAgICAgfVxuICAgICAgICBjYW52YXMuc3R5bGUud2lkdGggPSBgJHt3aWR0aH1weGA7XG4gICAgICAgIGNhbnZhcy5zdHlsZS5oZWlnaHQgPSBgJHtoZWlnaHR9cHhgO1xuICAgICAgICBvbkNoYW5nZSgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGVuc3VyZVBvc2l0aW9ucygpIHtcbiAgICAgICAgY29uc3Qgb2NjdXBpZWQgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBbaWQsIGNhcmRdIG9mIGNhcmRzKSB7XG4gICAgICAgICAgICBpZiAocG9zaXRpb25zLmhhcyhpZCkpIG9jY3VwaWVkLnB1c2goeyAuLi5wb3NpdGlvbnMuZ2V0KGlkKSwgLi4uc2l6ZU9mKGNhcmQpIH0pO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3QgW2lkLCBjYXJkXSBvZiBjYXJkcykge1xuICAgICAgICAgICAgaWYgKHBvc2l0aW9ucy5oYXMoaWQpKSBjb250aW51ZTtcbiAgICAgICAgICAgIGNvbnN0IHNpemUgPSBzaXplT2YoY2FyZCk7XG4gICAgICAgICAgICBjb25zdCBwb3NpdGlvbiA9IGZyZWVQb3NpdGlvbih7IHg6IHBhZGRpbmcsIHk6IHBhZGRpbmcgfSwgc2l6ZSwgb2NjdXBpZWQpO1xuICAgICAgICAgICAgcG9zaXRpb25zLnNldChpZCwgcG9zaXRpb24pO1xuICAgICAgICAgICAgb2NjdXBpZWQucHVzaCh7IC4uLnBvc2l0aW9uLCAuLi5zaXplIH0pO1xuICAgICAgICB9XG4gICAgICAgIGFwcGx5UG9zaXRpb25zKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWVhc3VyZUdyYXBoKCkge1xuICAgICAgICBjb25zdCBub2RlcyA9IFsuLi5jYXJkc10ubWFwKChbaWQsIGNhcmRdKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBib3VuZHMgPSBjYXJkLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgY29uc3QgaGVhZGluZyA9IGNhcmQucXVlcnlTZWxlY3RvcihcImg1XCIpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgcmV0dXJuIHsgaWQsIC4uLnNpemVPZihjYXJkKSwgdGFyZ2V0WTogaGVhZGluZy5oZWlnaHQgPyBoZWFkaW5nLnRvcCArIGhlYWRpbmcuaGVpZ2h0IC8gMiAtIGJvdW5kcy50b3AgOiAyNCB9O1xuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgZWRnZXMgPSByZWZlcmVuY2VzLmZsYXRNYXAoKHJlZmVyZW5jZSkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc291cmNlID0gcmVmZXJlbmNlLmxpbmsuY2xvc2VzdChcIltkYXRhLWhlYXAtaWRdXCIpO1xuICAgICAgICAgICAgaWYgKCFzb3VyY2UgfHwgIWNhcmRzLmhhcyhyZWZlcmVuY2UuaWQpKSByZXR1cm4gW107XG4gICAgICAgICAgICBjb25zdCBib3VuZHMgPSBzb3VyY2UuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICBjb25zdCBsaW5rID0gcmVmZXJlbmNlLmxpbmsuY2xvc2VzdChcInRkLCB0aFwiKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgIHJldHVybiBbe1xuICAgICAgICAgICAgICAgIGtleTogcmVmZXJlbmNlLmxpbmsuZGF0YXNldC5tZW1vcnlGb2N1cyxcbiAgICAgICAgICAgICAgICBzb3VyY2U6IHNvdXJjZS5kYXRhc2V0LmhlYXBJZCxcbiAgICAgICAgICAgICAgICB0YXJnZXQ6IHJlZmVyZW5jZS5pZCxcbiAgICAgICAgICAgICAgICB5OiBsaW5rLmhlaWdodCA/IGxpbmsudG9wICsgbGluay5oZWlnaHQgLyAyIC0gYm91bmRzLnRvcCA6IDY0LFxuICAgICAgICAgICAgfV07XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4geyBub2RlcywgZWRnZXMgfTtcbiAgICB9XG5cbiAgICBhc3luYyBmdW5jdGlvbiBydW5MYXlvdXQocmVwbGFjZUFsbCA9IGZhbHNlKSB7XG4gICAgICAgIGlmICghZW5hYmxlZCB8fCBkZXN0cm95ZWQgfHwgY2FyZHMuc2l6ZSA9PT0gMCkgcmV0dXJuO1xuICAgICAgICBjb25zdCB0YXJnZXRzID0gbmV3IFNldChbLi4uY2FyZHMua2V5cygpXS5maWx0ZXIoKGlkKSA9PiByZXBsYWNlQWxsIHx8ICFjb21taXR0ZWQuaGFzKGlkKSkpO1xuICAgICAgICBpZiAodGFyZ2V0cy5zaXplID09PSAwKSB7XG4gICAgICAgICAgICBtZXNzYWdlKFwiY2xfcG9zaXRpb25zX2tlcHRcIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcmVxdWVzdCA9ICsrcmV2aXNpb247XG4gICAgICAgIGNvbnN0IGlzQ3VycmVudCA9ICgpID0+IHJlcXVlc3QgPT09IHJldmlzaW9uICYmIGVuYWJsZWQgJiYgIWRlc3Ryb3llZDtcbiAgICAgICAgY29uc3QgZ2VvbWV0cnkgPSBtZWFzdXJlR3JhcGgoKTtcbiAgICAgICAgc2V0QnVzeSh0cnVlKTtcbiAgICAgICAgbWVzc2FnZShcImNsX2FycmFuZ2luZ1wiKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGxheW91dEhlYXAoZ2VvbWV0cnkubm9kZXMsIGdlb21ldHJ5LmVkZ2VzLCBpc0N1cnJlbnQpO1xuICAgICAgICAgICAgaWYgKCFpc0N1cnJlbnQoKSB8fCAhcmVzdWx0KSByZXR1cm47XG4gICAgICAgICAgICBjb25zdCBvY2N1cGllZCA9IFsuLi5jYXJkc10uZmlsdGVyKChbaWRdKSA9PiAhdGFyZ2V0cy5oYXMoaWQpKVxuICAgICAgICAgICAgICAgIC5tYXAoKFtpZCwgY2FyZF0pID0+ICh7IC4uLnBvc2l0aW9ucy5nZXQoaWQpLCAuLi5zaXplT2YoY2FyZCkgfSkpO1xuICAgICAgICAgICAgZm9yIChjb25zdCBub2RlIG9mIGdlb21ldHJ5Lm5vZGVzKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF0YXJnZXRzLmhhcyhub2RlLmlkKSkgY29udGludWU7XG4gICAgICAgICAgICAgICAgY29uc3QgZGVzaXJlZCA9IHJlc3VsdC5wb3NpdGlvbnMuZ2V0KG5vZGUuaWQpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHBvc2l0aW9uID0gcmVwbGFjZUFsbCB8fCB0YXJnZXRzLnNpemUgPT09IGNhcmRzLnNpemVcbiAgICAgICAgICAgICAgICAgICAgPyBkZXNpcmVkIDogZnJlZVBvc2l0aW9uKGRlc2lyZWQsIG5vZGUsIG9jY3VwaWVkKTtcbiAgICAgICAgICAgICAgICBwb3NpdGlvbnMuc2V0KG5vZGUuaWQsIHBvc2l0aW9uKTtcbiAgICAgICAgICAgICAgICBjb21taXR0ZWQuYWRkKG5vZGUuaWQpO1xuICAgICAgICAgICAgICAgIG9jY3VwaWVkLnB1c2goeyAuLi5wb3NpdGlvbiwgLi4ubm9kZSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJvdXRlcyA9IHJlc3VsdC5yb3V0ZXM7XG4gICAgICAgICAgICByb3V0ZUdlb21ldHJ5ID0geyAuLi5nZW9tZXRyeSwgcG9zaXRpb25zOiByZXN1bHQucG9zaXRpb25zIH07XG4gICAgICAgICAgICBzZXRCdXN5KGZhbHNlKTtcbiAgICAgICAgICAgIG1lc3NhZ2UoXCJjbF9hcnJhbmdlZFwiKTtcbiAgICAgICAgICAgIGFwcGx5UG9zaXRpb25zKCk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBpZiAoIWlzQ3VycmVudCgpKSByZXR1cm47XG4gICAgICAgICAgICBzZXRCdXN5KGZhbHNlKTtcbiAgICAgICAgICAgIG1lc3NhZ2UoXCJjbF9sYXlvdXRfZmFpbGVkXCIpO1xuICAgICAgICAgICAgLy8gRXhpc3RpbmcgcG9zaXRpb25zIGFuZCB0aGUgb3RoZXIgdmlld3MgcmVtYWluIHVzYWJsZTsgQXJyYW5nZSByZXRyaWVzLlxuICAgICAgICAgICAgY29uc29sZS53YXJuKFwiQ29kZUxlbnMgaGVhcCBsYXlvdXQgZmFpbGVkXCIsIGVycm9yKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFubm91bmNlUG9zaXRpb24oaWQpIHtcbiAgICAgICAgY29uc3QgcG9zaXRpb24gPSBwb3NpdGlvbnMuZ2V0KGlkKTtcbiAgICAgICAgY29uc3QgbmFtZSA9IGNhcmRzLmdldChpZCkucXVlcnlTZWxlY3RvcihcImg1XCIpLnRleHRDb250ZW50O1xuICAgICAgICBtZXNzYWdlKFwiY2xfbm9kZV9wb3NpdGlvblwiLCBuYW1lLCBNYXRoLnJvdW5kKHBvc2l0aW9uLngpLCBNYXRoLnJvdW5kKHBvc2l0aW9uLnkpKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtb3ZlT2JqZWN0KGlkLCB4LCB5LCBhbm5vdW5jZSA9IHRydWUpIHtcbiAgICAgICAgaWYgKCFlbmFibGVkIHx8ICFjYXJkcy5oYXMoaWQpKSByZXR1cm47XG4gICAgICAgIHJldmlzaW9uKys7IC8vIEFuIGluLWZsaWdodCBhdXRvbWF0aWMgbGF5b3V0IG11c3Qgbm90IG92ZXJ3cml0ZSBhIHVzZXIgbW92ZS5cbiAgICAgICAgc2V0QnVzeShmYWxzZSk7XG4gICAgICAgIHJvdXRlcy5jbGVhcigpO1xuICAgICAgICBwb3NpdGlvbnMuc2V0KGlkLCB7IHg6IE1hdGgubWF4KHBhZGRpbmcsIHgpLCB5OiBNYXRoLm1heChwYWRkaW5nLCB5KSB9KTtcbiAgICAgICAgY29tbWl0dGVkLmFkZChpZCk7XG4gICAgICAgIHNlbGVjdE9iamVjdChpZCk7XG4gICAgICAgIGFwcGx5UG9zaXRpb25zKCk7XG4gICAgICAgIGlmIChhbm5vdW5jZSkge1xuICAgICAgICAgICAgYW5ub3VuY2VQb3NpdGlvbihpZCk7XG4gICAgICAgICAgICByZXZlYWxPYmplY3QoaWQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbW92ZVNlbGVjdGVkKGRpcmVjdGlvbiwgZGlzdGFuY2UgPSAxNikge1xuICAgICAgICBpZiAoIXNlbGVjdGVkSWQgfHwgIWVuYWJsZWQpIHJldHVybjtcbiAgICAgICAgY29uc3QgW2R4LCBkeV0gPSBkaXJlY3Rpb25zW2RpcmVjdGlvbl07XG4gICAgICAgIGNvbnN0IHBvc2l0aW9uID0gcG9zaXRpb25zLmdldChzZWxlY3RlZElkKTtcbiAgICAgICAgbW92ZU9iamVjdChzZWxlY3RlZElkLCBwb3NpdGlvbi54ICsgZHggKiBkaXN0YW5jZSwgcG9zaXRpb24ueSArIGR5ICogZGlzdGFuY2UpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZpbmlzaERyYWcoY2FuY2VsbGVkID0gZmFsc2UpIHtcbiAgICAgICAgaWYgKCFkcmFnKSByZXR1cm47XG4gICAgICAgIGNvbnN0IHByZXZpb3VzID0gZHJhZztcbiAgICAgICAgZHJhZyA9IG51bGw7XG4gICAgICAgIGlmIChwcmV2aW91cy5oYW5kbGUuaGFzUG9pbnRlckNhcHR1cmU/LihwcmV2aW91cy5wb2ludGVySWQpKSB7XG4gICAgICAgICAgICBwcmV2aW91cy5oYW5kbGUucmVsZWFzZVBvaW50ZXJDYXB0dXJlKHByZXZpb3VzLnBvaW50ZXJJZCk7XG4gICAgICAgIH1cbiAgICAgICAgcHJldmlvdXMuaGFuZGxlLmNsYXNzTGlzdC5yZW1vdmUoXCJycy1jb2RlbGVucy1tZW1vcnlfX2RyYWdnaW5nXCIpO1xuICAgICAgICBpZiAoY2FuY2VsbGVkKSBtb3ZlT2JqZWN0KHByZXZpb3VzLmlkLCBwcmV2aW91cy54LCBwcmV2aW91cy55KTtcbiAgICAgICAgZWxzZSBhbm5vdW5jZVBvc2l0aW9uKHByZXZpb3VzLmlkKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhZGRIYW5kbGUoY2FyZCwgaWQpIHtcbiAgICAgICAgY29uc3QgaGFuZGxlID0gZWxlbWVudChcImJ1dHRvblwiLCB0KFwiY2xfbW92ZV9ub2RlXCIsIGNhcmQucXVlcnlTZWxlY3RvcihcImg1XCIpLnRleHRDb250ZW50KSk7XG4gICAgICAgIGhhbmRsZS50eXBlID0gXCJidXR0b25cIjtcbiAgICAgICAgaGFuZGxlLmNsYXNzTmFtZSA9IFwicnMtY29kZWxlbnMtbWVtb3J5X19tb3ZlLWhhbmRsZVwiO1xuICAgICAgICBoYW5kbGUuZGF0YXNldC5tZW1vcnlGb2N1cyA9IEpTT04uc3RyaW5naWZ5KFtcImhlYXBcIiwgaWQsIFwibW92ZVwiXSk7XG4gICAgICAgIGhhbmRsZS5zZXRBdHRyaWJ1dGUoXCJhcmlhLWRlc2NyaWJlZGJ5XCIsIGhlbHAuaWQpO1xuICAgICAgICBoYW5kbGUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHNlbGVjdE9iamVjdChpZCkpO1xuICAgICAgICBoYW5kbGUuYWRkRXZlbnRMaXN0ZW5lcihcInBvaW50ZXJkb3duXCIsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgaWYgKCFlbmFibGVkIHx8IGV2ZW50LmJ1dHRvbiAhPT0gMCB8fCBkcmFnKSByZXR1cm47XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgc2VsZWN0T2JqZWN0KGlkKTtcbiAgICAgICAgICAgIGhhbmRsZS5mb2N1cyh7IHByZXZlbnRTY3JvbGw6IHRydWUgfSk7XG4gICAgICAgICAgICBjb25zdCBwb3NpdGlvbiA9IHBvc2l0aW9ucy5nZXQoaWQpO1xuICAgICAgICAgICAgZHJhZyA9IHsgaWQsIC4uLnBvc2l0aW9uLCBjbGllbnRYOiBldmVudC5jbGllbnRYLCBjbGllbnRZOiBldmVudC5jbGllbnRZLCBwb2ludGVySWQ6IGV2ZW50LnBvaW50ZXJJZCwgaGFuZGxlIH07XG4gICAgICAgICAgICBoYW5kbGUuc2V0UG9pbnRlckNhcHR1cmUoZXZlbnQucG9pbnRlcklkKTtcbiAgICAgICAgICAgIGhhbmRsZS5jbGFzc0xpc3QuYWRkKFwicnMtY29kZWxlbnMtbWVtb3J5X19kcmFnZ2luZ1wiKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGhhbmRsZS5hZGRFdmVudExpc3RlbmVyKFwicG9pbnRlcm1vdmVcIiwgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBpZiAoIWRyYWcgfHwgZHJhZy5oYW5kbGUgIT09IGhhbmRsZSB8fCBkcmFnLnBvaW50ZXJJZCAhPT0gZXZlbnQucG9pbnRlcklkKSByZXR1cm47XG4gICAgICAgICAgICBtb3ZlT2JqZWN0KGlkLCBkcmFnLnggKyBldmVudC5jbGllbnRYIC0gZHJhZy5jbGllbnRYLCBkcmFnLnkgKyBldmVudC5jbGllbnRZIC0gZHJhZy5jbGllbnRZLCBmYWxzZSk7XG4gICAgICAgIH0pO1xuICAgICAgICBoYW5kbGUuYWRkRXZlbnRMaXN0ZW5lcihcInBvaW50ZXJ1cFwiLCAoKSA9PiBmaW5pc2hEcmFnKCkpO1xuICAgICAgICBoYW5kbGUuYWRkRXZlbnRMaXN0ZW5lcihcInBvaW50ZXJjYW5jZWxcIiwgKCkgPT4gZmluaXNoRHJhZyh0cnVlKSk7XG4gICAgICAgIGhhbmRsZS5hZGRFdmVudExpc3RlbmVyKFwibG9zdHBvaW50ZXJjYXB0dXJlXCIsICgpID0+IGZpbmlzaERyYWcodHJ1ZSkpO1xuICAgICAgICBoYW5kbGUuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBpZiAoZXZlbnQua2V5ID09PSBcIkVzY2FwZVwiICYmIGRyYWcpIHtcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGZpbmlzaERyYWcodHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBkaXJlY3Rpb24gPSBldmVudC5rZXkucmVwbGFjZShcIkFycm93XCIsIFwiXCIpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICBpZiAoIWRpcmVjdGlvbnNbZGlyZWN0aW9uXSkgcmV0dXJuO1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHNlbGVjdE9iamVjdChpZCk7XG4gICAgICAgICAgICBtb3ZlU2VsZWN0ZWQoZGlyZWN0aW9uLCBldmVudC5zaGlmdEtleSA/IDY0IDogMTYpO1xuICAgICAgICB9KTtcbiAgICAgICAgY2FyZC5xdWVyeVNlbGVjdG9yKFwiaDVcIikuYWZ0ZXIoaGFuZGxlKTtcbiAgICB9XG5cbiAgICBzZWxlY3QuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoKSA9PiB7XG4gICAgICAgIHNlbGVjdE9iamVjdChzZWxlY3QudmFsdWUpO1xuICAgICAgICByZXZlYWxPYmplY3Qoc2VsZWN0ZWRJZCk7XG4gICAgfSk7XG4gICAgYXJyYW5nZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4geyBpZiAoIWJ1c3kpIHZvaWQgcnVuTGF5b3V0KHRydWUpOyB9KTtcbiAgICByZXNldC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICBpZiAoYnVzeSB8fCBjYXJkcy5zaXplID09PSAwKSByZXR1cm47XG4gICAgICAgIHBvc2l0aW9ucy5jbGVhcigpO1xuICAgICAgICBjb21taXR0ZWQuY2xlYXIoKTtcbiAgICAgICAgZW5zdXJlUG9zaXRpb25zKCk7XG4gICAgICAgIHZvaWQgcnVuTGF5b3V0KHRydWUpO1xuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gYmVmb3JlVXBkYXRlKCkge1xuICAgICAgICBmaW5pc2hEcmFnKHRydWUpO1xuICAgICAgICByZXZpc2lvbisrO1xuICAgICAgICBzaXplT2JzZXJ2ZXI/LmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgaWYgKGJ1c3kpIG1lc3NhZ2UoXCJjbF9wb3NpdGlvbnNfa2VwdFwiKTtcbiAgICAgICAgc2V0QnVzeShmYWxzZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZWxlbWVudDogY29udHJvbHMsXG4gICAgICAgIGJlZm9yZVVwZGF0ZSxcbiAgICAgICAgc3luYyhuZXh0Q2FyZHMsIG5leHRSZWZlcmVuY2VzKSB7XG4gICAgICAgICAgICBjYXJkcyA9IG5leHRDYXJkcztcbiAgICAgICAgICAgIHJlZmVyZW5jZXMgPSBuZXh0UmVmZXJlbmNlcztcbiAgICAgICAgICAgIHNlbGVjdC5yZXBsYWNlQ2hpbGRyZW4oLi4uWy4uLmNhcmRzXS5tYXAoKFtpZCwgY2FyZF0pID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBvcHRpb24gPSBlbGVtZW50KFwib3B0aW9uXCIsIGNhcmQucXVlcnlTZWxlY3RvcihcImg1XCIpLnRleHRDb250ZW50KTtcbiAgICAgICAgICAgICAgICBvcHRpb24udmFsdWUgPSBpZDtcbiAgICAgICAgICAgICAgICBhZGRIYW5kbGUoY2FyZCwgaWQpO1xuICAgICAgICAgICAgICAgIHJldHVybiBvcHRpb247XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICBzZWxlY3RPYmplY3Qoc2VsZWN0ZWRJZCk7XG4gICAgICAgICAgICBzZXRCdXN5KGZhbHNlKTtcbiAgICAgICAgICAgIGlmIChjYXJkcy5zaXplID09PSAwKSBzdGF0dXMudGV4dENvbnRlbnQgPSBcIlwiO1xuICAgICAgICAgICAgaWYgKGVuYWJsZWQpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGNhcmQgb2YgY2FyZHMudmFsdWVzKCkpIHNpemVPYnNlcnZlcj8ub2JzZXJ2ZShjYXJkKTtcbiAgICAgICAgICAgICAgICBlbnN1cmVQb3NpdGlvbnMoKTtcbiAgICAgICAgICAgICAgICB2b2lkIHJ1bkxheW91dCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBzZXRFbmFibGVkKHZhbHVlKSB7XG4gICAgICAgICAgICBiZWZvcmVVcGRhdGUoKTtcbiAgICAgICAgICAgIGVuYWJsZWQgPSB2YWx1ZTtcbiAgICAgICAgICAgIGNvbnRyb2xzLmhpZGRlbiA9ICF2YWx1ZTtcbiAgICAgICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgY2FyZCBvZiBjYXJkcy52YWx1ZXMoKSkgc2l6ZU9ic2VydmVyPy5vYnNlcnZlKGNhcmQpO1xuICAgICAgICAgICAgICAgIGVuc3VyZVBvc2l0aW9ucygpO1xuICAgICAgICAgICAgICAgIHZvaWQgcnVuTGF5b3V0KCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNhbnZhcy5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcIndpZHRoXCIpO1xuICAgICAgICAgICAgICAgIGNhbnZhcy5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcImhlaWdodFwiKTtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGNhcmQgb2YgY2FyZHMudmFsdWVzKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FyZC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcImxlZnRcIik7XG4gICAgICAgICAgICAgICAgICAgIGNhcmQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJ0b3BcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb25DaGFuZ2UoKTtcbiAgICAgICAgfSxcbiAgICAgICAgcm91dGVGb3IocmVmZXJlbmNlKSB7XG4gICAgICAgICAgICBpZiAoIWVuYWJsZWQgfHwgIXJvdXRlR2VvbWV0cnkpIHJldHVybiBudWxsO1xuICAgICAgICAgICAgLy8gRUxLJ3Mgc2hhcmVkIHRhcmdldCBwb3J0IGlzIGF0IHRoZSBjYXJkIGhlYWRpbmcuIEEgcG9pbnRlciB0byBhblxuICAgICAgICAgICAgLy8gaW50ZXJpb3IgZmllbGQgdXNlcyB0aGUgbGl2ZSBjZWxsIGdlb21ldHJ5IGluc3RlYWQuXG4gICAgICAgICAgICBpZiAocmVmZXJlbmNlLnRhcmdldCAmJiAhcmVmZXJlbmNlLnRhcmdldC5tYXRjaGVzKFwiaDVcIikpIHJldHVybiBudWxsO1xuICAgICAgICAgICAgY29uc3Qga2V5ID0gcmVmZXJlbmNlLmxpbmsuZGF0YXNldC5tZW1vcnlGb2N1cztcbiAgICAgICAgICAgIGNvbnN0IGVkZ2UgPSByb3V0ZUdlb21ldHJ5LmVkZ2VzLmZpbmQoKGl0ZW0pID0+IGl0ZW0ua2V5ID09PSBrZXkpO1xuICAgICAgICAgICAgaWYgKCFlZGdlKSByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIGZvciAoY29uc3QgaWQgb2YgW2VkZ2Uuc291cmNlLCBlZGdlLnRhcmdldF0pIHtcbiAgICAgICAgICAgICAgICBjb25zdCBleHBlY3RlZCA9IHJvdXRlR2VvbWV0cnkucG9zaXRpb25zLmdldChpZCk7XG4gICAgICAgICAgICAgICAgY29uc3QgYWN0dWFsID0gcG9zaXRpb25zLmdldChpZCk7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2l6ZSA9IGNhcmRzLmhhcyhpZCkgJiYgc2l6ZU9mKGNhcmRzLmdldChpZCkpO1xuICAgICAgICAgICAgICAgIGNvbnN0IG9sZFNpemUgPSByb3V0ZUdlb21ldHJ5Lm5vZGVzLmZpbmQoKG5vZGUpID0+IG5vZGUuaWQgPT09IGlkKTtcbiAgICAgICAgICAgICAgICBpZiAoIWFjdHVhbCB8fCAhc2l6ZSB8fCBhY3R1YWwueCAhPT0gZXhwZWN0ZWQueCB8fCBhY3R1YWwueSAhPT0gZXhwZWN0ZWQueSB8fFxuICAgICAgICAgICAgICAgICAgICBNYXRoLmFicyhzaXplLndpZHRoIC0gb2xkU2l6ZS53aWR0aCkgPiAxIHx8IE1hdGguYWJzKHNpemUuaGVpZ2h0IC0gb2xkU2l6ZS5oZWlnaHQpID4gMSkgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBzb3VyY2UgPSBjYXJkcy5nZXQoZWRnZS5zb3VyY2UpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgY29uc3QgbGluayA9IHJlZmVyZW5jZS5saW5rLmNsb3Nlc3QoXCJ0ZCwgdGhcIikuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICBpZiAobGluay5oZWlnaHQgJiYgTWF0aC5hYnMobGluay50b3AgKyBsaW5rLmhlaWdodCAvIDIgLSBzb3VyY2UudG9wIC0gZWRnZS55KSA+IDEpIHJldHVybiBudWxsO1xuICAgICAgICAgICAgcmV0dXJuIHJvdXRlcy5nZXQoa2V5KSA/PyBudWxsO1xuICAgICAgICB9LFxuICAgICAgICBkZXN0cm95KCkge1xuICAgICAgICAgICAgYmVmb3JlVXBkYXRlKCk7XG4gICAgICAgICAgICBkZXN0cm95ZWQgPSB0cnVlO1xuICAgICAgICB9LFxuICAgIH07XG59XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgYm1pbGxlciBvbiA1LzEwLzE1LlxuICovXG5cbi8qXG4gU2luY2UgSSBkb24ndCB3YW50IHRvIG1vZGlmeSB0aGUgY29kZWxlbnMgY29kZSBJJ2xsIGF0dGFjaCB0aGUgbG9nZ2luZyBmdW5jdGlvbmFsaXR5IHRoaXMgd2F5LlxuIFRoaXMgYWN0dWFsbHkgc2VlbXMgbGlrZSBhIGJldHRlciB3YXkgdG8gZG8gaXQgbWF5YmUgYWNyb3NzIHRoZSBib2FyZCB0byBzZXBhcmF0ZSBsb2dnaW5nXG4gZnJvbSB0aGUgcmVhbCBmdW5jaW9uYWxpdHkuICBJdCB3b3VsZCBhbHNvIGFsbG93IGEgYmV0dGVyIHdheSBvZiB0dXJuaW5nIG9mZi9vbiBsb2dnaW5nLi5cbiBBcyBsb25nIGFzIFBoaWxpcCBkb2Vzbid0IGdvIGFuZCBjaGFuZ2UgdGhlIGlkIHZhbHVlcyBmb3IgdGhlIGJ1dHRvbnMgYW5kIHNsaWRlciB0aGlzIHdpbGxcbiBjb250aW51ZSB0byB3b3JrLi4uLiBJbiB0aGUgYmVzdCBvZiBhbGwgd29ybGRzIHdlIG1pZ2h0IGFkZCBhIGZ1bmN0aW9uIHRvIHRoZSB2aXN1YWxpemVyIHRvXG4gcmV0dXJuIHRoZSBidXR0b25zLCBidXQgSSdtIGhhdmluZyBhIGhhcmQgdGltZSB0aGlua2luZyBvZiBhbnkgb3RoZXIgdXNlIGZvciB0aGF0IGJlc2lkZXMgbWluZS5cbiAqL1xuXG5pbXBvcnQgUnVuZXN0b25lQmFzZSBmcm9tIFwiLi4vLi4vY29tbW9uL2pzL3J1bmVzdG9uZWJhc2UuanNcIjtcbmltcG9ydCBcIi4vcHl0dXRvci1lbWJlZC5idW5kbGUuanNcIjtcbmltcG9ydCBcIi4vLi4vY3NzL3B5dHV0b3IuY3NzXCI7XG5pbXBvcnQgeyBtb3VudFRyYWNlVmlld2VyIH0gZnJvbSBcIi4uL2Zyb250ZW5kL3RyYWNlLXZpZXdlci5qc1wiO1xuaW1wb3J0IFwiLi4vZnJvbnRlbmQvdHJhY2Utdmlld2VyLmNzc1wiO1xuXG5mdW5jdGlvbiBhdHRhY2hMb2dnZXJzKGNvZGVsZW5zLCBkaXZpZCkge1xuICAgIGxldCByYiA9IG5ldyBSdW5lc3RvbmVCYXNlKCk7XG4gICAgY29uc3Qgcm9vdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGRpdmlkKTtcbiAgICBmb3IgKGNvbnN0IFtidXR0b25JZCwgYWN0aW9uXSBvZiBbXG4gICAgICAgIFtcImptcEZpcnN0SW5zdHJcIiwgXCJmaXJzdFwiXSxcbiAgICAgICAgW1wiam1wTGFzdEluc3RyXCIsIFwibGFzdFwiXSxcbiAgICAgICAgW1wiam1wU3RlcEJhY2tcIiwgXCJiYWNrXCJdLFxuICAgICAgICBbXCJqbXBTdGVwRndkXCIsIFwiZndkXCJdLFxuICAgIF0pIHtcbiAgICAgICAgcm9vdC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICAgICAgYCMke2J1dHRvbklkfSwgW2RhdGEtY29kZWxlbnMtYWN0aW9uPVwiJHthY3Rpb259XCJdYCxcbiAgICAgICAgKT8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgICAgIHJiLmxvZ0Jvb2tFdmVudCh7IGV2ZW50OiBcImNvZGVsZW5zXCIsIGFjdDogYWN0aW9uLCBkaXZfaWQ6IGRpdmlkIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgLy8gVGhlIGxlZ2FjeSBqUXVlcnkgVUkgc2xpZGVyIGVtaXRzIGEgalF1ZXJ5IGV2ZW50IHJhdGhlciB0aGFuIGEgRE9NIGV2ZW50LlxuICAgIGNvZGVsZW5zLmRvbVJvb3Q/LmZpbmQoXCIjZXhlY3V0aW9uU2xpZGVyXCIpLmJpbmQoXCJzbGlkZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJiLmxvZ0Jvb2tFdmVudCh7IGV2ZW50OiBcImNvZGVsZW5zXCIsIGFjdDogXCJzbGlkZVwiLCBkaXZfaWQ6IGRpdmlkIH0pO1xuICAgIH0pO1xuICAgIC8vIFRPRE86IFRoZSBjb21wb25lbnQgaXNuJ3QgcXVpdGUgZnVsbHkgaW5pdGlhbGl6ZWQsIGJ1dCBpdCBhbHNvIGRvZXNuJ3QgaW5oZXJpdCBmcm9tIFJ1bmVzdG9uZUJhc2UuIFRoaXMgaXMgYSBjb252ZW5pZW50IHBsYWNlIHRvIG1hcmsgaXQgcmVhZHkgZm9yIG5vdywgYnV0IGl0IHNob3VsZCBiZSBtb3ZlZCBmb3J3YXJkIGluIHRpbWUgZHVyaW5nIGEgcmV3cml0ZS5cbiAgICByYi5jb250YWluZXJEaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChkaXZpZCk7XG4gICAgcmIuaW5kaWNhdGVfY29tcG9uZW50X3JlYWR5KCk7XG59XG5cbmZ1bmN0aW9uIHN0eWxlQnV0dG9ucyhkaXZpZCkge1xuICAgIGNvbnN0IHJvb3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChkaXZpZCk7XG4gICAgZm9yIChjb25zdCBbYnV0dG9uSWQsIGJ1dHRvbkNsYXNzLCBhY3Rpb25dIG9mIFtcbiAgICAgICAgW1wiam1wRmlyc3RJbnN0clwiLCBcImJ0bi1kZWZhdWx0XCJdLFxuICAgICAgICBbXCJqbXBTdGVwQmFja1wiLCBcImJ0bi1kYW5nZXJcIl0sXG4gICAgICAgIFtcImptcFN0ZXBGd2RcIiwgXCJidG4tc3VjY2Vzc1wiLCBcImZ3ZFwiXSxcbiAgICAgICAgW1wiam1wTGFzdEluc3RyXCIsIFwiYnRuLWRlZmF1bHRcIl0sXG4gICAgXSkge1xuICAgICAgICBjb25zdCBzZWxlY3RvciA9IGFjdGlvblxuICAgICAgICAgICAgPyBgIyR7YnV0dG9uSWR9LCBbZGF0YS1jb2RlbGVucy1hY3Rpb249XCIke2FjdGlvbn1cIl1gXG4gICAgICAgICAgICA6IGAjJHtidXR0b25JZH1gO1xuICAgICAgICByb290LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpPy5jbGFzc0xpc3QuYWRkKFwiYnRuXCIsIGJ1dHRvbkNsYXNzKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHJlbmRlclZpc3VhbGl6ZXIoZGF0YSwgZGl2aWQsIGxhbmcpIHtcbiAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgICBzdGFydGluZ0luc3RydWN0aW9uOiBkYXRhLnN0YXJ0aW5nSW5zdHJ1Y3Rpb24gfHwgMCxcbiAgICAgICAgZWRpdENvZGVCYXNlVVJMOiBudWxsLFxuICAgICAgICBoaWRlQ29kZTogZmFsc2UsXG4gICAgICAgIGxhbmc6IGxhbmcsXG4gICAgfTtcbiAgICBjb25zdCB1c2VQcm90b3R5cGUgPVxuICAgICAgICBBcnJheS5pc0FycmF5KGRhdGEudHJhY2UpICYmXG4gICAgICAgIGRhdGEudHJhY2UubGVuZ3RoID4gMCAmJlxuICAgICAgICBuZXcgVVJMU2VhcmNoUGFyYW1zKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gpLmdldChcImNvZGVsZW5zUHJvdG90eXBlXCIpID09PVxuICAgICAgICAgICAgZGl2aWQgJiZcbiAgICAgICAgIWRhdGEudHJhY2Uuc29tZShcbiAgICAgICAgICAgIChlbnRyeSkgPT5cbiAgICAgICAgICAgICAgICBlbnRyeS5xdWVzdGlvbiB8fFxuICAgICAgICAgICAgICAgIGVudHJ5LmV2ZW50ID09PSBcInJhd19pbnB1dFwiIHx8XG4gICAgICAgICAgICAgICAgZW50cnkuZXZlbnQgPT09IFwibW91c2VfaW5wdXRcIixcbiAgICAgICAgKTtcbiAgICByZXR1cm4gdXNlUHJvdG90eXBlXG4gICAgICAgID8gbW91bnRUcmFjZVZpZXdlcihkb2N1bWVudC5nZXRFbGVtZW50QnlJZChkaXZpZCksIGRhdGEsIG9wdGlvbnMpXG4gICAgICAgIDogYWRkVmlzdWFsaXplclRvUGFnZShkYXRhLCBkaXZpZCwgb3B0aW9ucyk7XG59XG5cbmlmICh0eXBlb2Ygd2luZG93LmFsbFZpc3VhbGl6ZXJzID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgd2luZG93LmFsbFZpc3VhbGl6ZXJzID0gW107XG59XG5cbmlmICh0eXBlb2Ygd2luZG93LmNvbXBvbmVudF9mYWN0b3J5ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgd2luZG93LmNvbXBvbmVudF9mYWN0b3J5ID0ge307XG59XG5cbndpbmRvdy5jb21wb25lbnRfZmFjdG9yeS5jb2RlbGVucyA9IGZ1bmN0aW9uIChvcHRzKSB7XG4gICAgLy8gb3B0cyBpcyBhbiBvYmplY3QgdGhhdCB3aWxsIGNvbnRhaW4gYSBrZXkgcmVmZXJlbmNpbmcgdGhlIG9yaWduYWwgZG9tIGVsZW1lbnRcbiAgICAvLyBvZnRlbiBpdCB3aWxsIGFsc28gaGF2ZSBhIGtleSBmb3IgIHVzZVJ1bmVzdG9uZVNlcnZpY2VzXG4gICAgbGV0IGVsID0gb3B0cy5vcmlnO1xuICAgIGxldCB2ZWwgPSBlbC5xdWVyeVNlbGVjdG9yKFwiLnB5dHV0b3JWaXN1YWxpemVyXCIpO1xuICAgIGxldCBkaXZpZCA9IHZlbC5pZDtcbiAgICBsZXQgbGFuZyA9IEpTT04ucGFyc2UodmVsLmRhdGFzZXQucGFyYW1zKS5sYW5nO1xuICAgIC8vIGFkZFZpc3VhbGl6ZXJUb1BhZ2UgY29tZXMgZnJvbSBweXR1dG9yLWVtYmVkXG4gICAgLy8gYWxsVHJhY2VEYXRhIGlzIGNyZWF0ZWQgYnkgYSBzZXJpZXMgb2Ygc2NyaXB0IHRhZ3MgdGhhdCB3aGVuIGxvYWRlZCBjcmVhdGUgdGhpc1xuICAgIC8vIGFzIGEgZ2xvYmFsIG9iamVjdCBjb250YWluaW5nIHRyYWNlIGluZm9ybWF0aW9uLlxuICAgIHRyeSB7XG4gICAgICAgIGxldCB2aXMgPSByZW5kZXJWaXN1YWxpemVyKGFsbFRyYWNlRGF0YVtkaXZpZF0sIGRpdmlkLCBsYW5nKTtcbiAgICAgICAgYXR0YWNoTG9nZ2Vycyh2aXMsIGRpdmlkKTtcbiAgICAgICAgc3R5bGVCdXR0b25zKGRpdmlkKTtcbiAgICAgICAgd2luZG93LmFsbFZpc3VhbGl6ZXJzLnB1c2godmlzKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5sb2coYEVycm9yIHJlbmRlcmluZyBDb2RlTGVucyBQcm9ibGVtICR7ZGl2aWR9YCk7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgfVxuXG59O1xuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImNvZGVsZW5zOmFuc3dlclwiLCBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgbGV0IHJiID0gbmV3IFJ1bmVzdG9uZUJhc2UoKTtcbiAgICByYi5sb2dCb29rRXZlbnQoe1xuICAgICAgICBldmVudDogXCJjb2RlbGVuc1wiLFxuICAgICAgICBkaXZfaWQ6IGV2dC5kZXRhaWwuZGl2aWQsXG4gICAgICAgIGFjdDogXCJhbnN3ZXJcIixcbiAgICAgICAgYW5zd2VyOiBldnQuZGV0YWlsLmFuc3dlcixcbiAgICAgICAgY29ycmVjdDogZXZ0LmRldGFpbC5jb3JyZWN0LFxuICAgICAgICBwZXJjZW50OiBldnQuZGV0YWlsLnBlcmNlbnQgfHwgMCxcbiAgICB9KTtcbiAgICBjb25zb2xlLmxvZyhldnQpO1xufSk7XG5cbi8vIEFmdGVyIGFsbCBvZiB0aGUgbGlicmFyaWVzIGFyZSBsb2FkZWQuLi5cbiQoZG9jdW1lbnQpLm9uKFwicnVuZXN0b25lOmxvZ2luLWNvbXBsZXRlXCIsIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodHlwZW9mIGFsbFRyYWNlRGF0YSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBmb3IgKGxldCBkaXZpZCBpbiBhbGxUcmFjZURhdGEpIHtcbiAgICAgICAgICAgIGxldCBjbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGRpdmlkKTtcbiAgICAgICAgICAgIGlmIChjbCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBDb3VsZCBub3QgZmluZCBlbGVtZW50IHdpdGggaWQgJHtkaXZpZH1gKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgbGFuZyA9IEpTT04ucGFyc2UoY2wuZGF0YXNldC5wYXJhbXMpLmxhbmc7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGlmIChkaXZpZCBpbiB3aW5kb3cuYWxsVHJhY2VEYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB2aXMgPSByZW5kZXJWaXN1YWxpemVyKGFsbFRyYWNlRGF0YVtkaXZpZF0sIGRpdmlkLCBsYW5nKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBhbGVydChcbiAgICAgICAgICAgICAgICAgICAgICAgIGAke2RpdmlkfSBpcyBtaXNzaW5nIHRyYWNlIGRhdGEuICBUaGlzIGlzIHByb2JhYmx5IGEgYnVpbGQgZXJyb3IuIFBsZWFzZSByZXBvcnQgaXQgb24gZ2l0aHViLmAsXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGF0dGFjaExvZ2dlcnModmlzLCBkaXZpZCk7XG4gICAgICAgICAgICAgICAgc3R5bGVCdXR0b25zKGRpdmlkKTtcbiAgICAgICAgICAgICAgICB3aW5kb3cuYWxsVmlzdWFsaXplcnMucHVzaCh2aXMpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYEVycm9yIHJlbmRlcmluZyBDb2RlTGVucyBQcm9ibGVtICR7ZGl2aWR9YCk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0pO1xuIiwiLy8gS2VlcCB0aGUgbGF5b3V0IGVuZ2luZSBvdXQgb2YgdGhlIGluaXRpYWwgZG93bmxvYWQsIGluY2x1ZGluZyBpbiB0aGUgdW5idWlsdCBkZW1vLlxubGV0IGVuZ2luZVByb21pc2U7XG5cbmV4cG9ydCBmdW5jdGlvbiBsb2FkRWxrKCkge1xuICAgIGlmICghZW5naW5lUHJvbWlzZSkge1xuICAgICAgICBlbmdpbmVQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcbiAgICAgICAgICAgIHNjcmlwdC5zcmMgPSBuZXcgVVJMKFwiLi92ZW5kb3IvZWxrLmJ1bmRsZWQuanNcIiwgaW1wb3J0Lm1ldGEudXJsKS5ocmVmO1xuICAgICAgICAgICAgLy8gRW1pdCB0aGUgYWNjb21wYW55aW5nIGxpY2Vuc2Ugd2l0aCB0aGUgZW5naW5lIGluIHdlYnBhY2sgYnVpbGRzLlxuICAgICAgICAgICAgc2NyaXB0LmRhdGFzZXQubGljZW5zZSA9IG5ldyBVUkwoXCIuL3ZlbmRvci9FTEstTElDRU5TRS5tZFwiLCBpbXBvcnQubWV0YS51cmwpLmhyZWY7XG4gICAgICAgICAgICBzY3JpcHQub25sb2FkID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIHNjcmlwdC5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHdpbmRvdy5FTEsgPT09IFwiZnVuY3Rpb25cIikgcmVzb2x2ZShuZXcgd2luZG93LkVMSygpKTtcbiAgICAgICAgICAgICAgICBlbHNlIHJlamVjdChuZXcgRXJyb3IoXCJFTEsgZGlkIG5vdCBpbml0aWFsaXplXCIpKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBzY3JpcHQub25lcnJvciA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICBzY3JpcHQucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihcIkNvdWxkIG5vdCBsb2FkIEVMS1wiKSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZG9jdW1lbnQuaGVhZC5hcHBlbmQoc2NyaXB0KTtcbiAgICAgICAgfSkuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICAgICAgICBlbmdpbmVQcm9taXNlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gZW5naW5lUHJvbWlzZTtcbn1cblxuLy8gVXNlIG9wYXF1ZSBFTEsgSURzOyBvYmplY3QgSURzIGFuZCByZWZlcmVuY2Uga2V5cyByZW1haW4gaW4gb3VyIHNuYXBzaG90IG1vZGVsLlxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkSGVhcEdyYXBoKG5vZGVzLCByZWZlcmVuY2VzKSB7XG4gICAgY29uc3QgaWRzID0gbmV3IE1hcChub2Rlcy5tYXAoKG5vZGUsIGluZGV4KSA9PiBbbm9kZS5pZCwgYG5vZGUtJHtpbmRleH1gXSkpO1xuICAgIGNvbnN0IG91dGdvaW5nID0gbmV3IE1hcChub2Rlcy5tYXAoKG5vZGUpID0+IFtub2RlLmlkLCBbXV0pKTtcbiAgICBjb25zdCBlZGdlcyA9IFtdO1xuICAgIGNvbnN0IGVkZ2VLZXlzID0gbmV3IE1hcCgpO1xuICAgIGZvciAoY29uc3QgcmVmZXJlbmNlIG9mIHJlZmVyZW5jZXMpIHtcbiAgICAgICAgaWYgKCFpZHMuaGFzKHJlZmVyZW5jZS5zb3VyY2UpIHx8ICFpZHMuaGFzKHJlZmVyZW5jZS50YXJnZXQpKSBjb250aW51ZTtcbiAgICAgICAgY29uc3QgaWQgPSBgZWRnZS0ke2VkZ2VzLmxlbmd0aH1gO1xuICAgICAgICBjb25zdCBwb3J0ID0gYCR7aWR9LXNvdXJjZWA7XG4gICAgICAgIG91dGdvaW5nLmdldChyZWZlcmVuY2Uuc291cmNlKS5wdXNoKHtcbiAgICAgICAgICAgIGlkOiBwb3J0LCB3aWR0aDogMSwgaGVpZ2h0OiAxLFxuICAgICAgICAgICAgeDogbm9kZXMuZmluZCgobm9kZSkgPT4gbm9kZS5pZCA9PT0gcmVmZXJlbmNlLnNvdXJjZSkud2lkdGgsXG4gICAgICAgICAgICB5OiByZWZlcmVuY2UueSxcbiAgICAgICAgICAgIGxheW91dE9wdGlvbnM6IHsgXCJlbGsucG9ydC5zaWRlXCI6IFwiRUFTVFwiIH0sXG4gICAgICAgIH0pO1xuICAgICAgICBlZGdlcy5wdXNoKHsgaWQsIHNvdXJjZXM6IFtwb3J0XSwgdGFyZ2V0czogW2Ake2lkcy5nZXQocmVmZXJlbmNlLnRhcmdldCl9LWluYF0gfSk7XG4gICAgICAgIGVkZ2VLZXlzLnNldChpZCwgcmVmZXJlbmNlLmtleSk7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIGdyYXBoOiB7XG4gICAgICAgICAgICBpZDogXCJoZWFwXCIsXG4gICAgICAgICAgICBsYXlvdXRPcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgXCJlbGsuYWxnb3JpdGhtXCI6IFwibGF5ZXJlZFwiLFxuICAgICAgICAgICAgICAgIFwiZWxrLmRpcmVjdGlvblwiOiBcIkRPV05cIixcbiAgICAgICAgICAgICAgICAvLyBQcmVmZXIgYSB0YWxsIGNhbnZhcyB3aGVuIHBhY2tpbmcgZGlzY29ubmVjdGVkIGhlYXAgb2JqZWN0cyB0b28uXG4gICAgICAgICAgICAgICAgXCJlbGsuYXNwZWN0UmF0aW9cIjogXCIwLjZcIixcbiAgICAgICAgICAgICAgICBcImVsay5lZGdlUm91dGluZ1wiOiBcIk9SVEhPR09OQUxcIixcbiAgICAgICAgICAgICAgICAvLyBMZWF2ZSByb29tIGZvciBicm9hZCBjdXJ2ZXMgYW5kIHN0cmFpZ2h0IHRhaWxzIGJlc2lkZSBjYXJkcy5cbiAgICAgICAgICAgICAgICBcImVsay5zcGFjaW5nLmVkZ2VOb2RlXCI6IFwiNDBcIixcbiAgICAgICAgICAgICAgICBcImVsay5zcGFjaW5nLm5vZGVTZWxmTG9vcFwiOiBcIjQwXCIsXG4gICAgICAgICAgICAgICAgXCJlbGsuc3BhY2luZy5lZGdlRWRnZVwiOiBcIjE2XCIsXG4gICAgICAgICAgICAgICAgXCJlbGsuc3BhY2luZy5ub2RlTm9kZVwiOiBcIjMyXCIsXG4gICAgICAgICAgICAgICAgXCJlbGsubGF5ZXJlZC5zcGFjaW5nLm5vZGVOb2RlQmV0d2VlbkxheWVyc1wiOiBcIjQ4XCIsXG4gICAgICAgICAgICAgICAgXCJlbGsuc3BhY2luZy5jb21wb25lbnRDb21wb25lbnRcIjogXCI0MFwiLFxuICAgICAgICAgICAgICAgIFwiZWxrLnBhZGRpbmdcIjogXCJbdG9wPTI0LGxlZnQ9MjQsYm90dG9tPTI0LHJpZ2h0PTI0XVwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNoaWxkcmVuOiBub2Rlcy5tYXAoKG5vZGUpID0+ICh7XG4gICAgICAgICAgICAgICAgaWQ6IGlkcy5nZXQobm9kZS5pZCksIHdpZHRoOiBub2RlLndpZHRoLCBoZWlnaHQ6IG5vZGUuaGVpZ2h0LFxuICAgICAgICAgICAgICAgIGxheW91dE9wdGlvbnM6IHsgXCJlbGsucG9ydENvbnN0cmFpbnRzXCI6IFwiRklYRURfUE9TXCIgfSxcbiAgICAgICAgICAgICAgICBwb3J0czogW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogYCR7aWRzLmdldChub2RlLmlkKX0taW5gLCB3aWR0aDogMSwgaGVpZ2h0OiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gS2VlcCBib3RoIHBvcnRzIG9uIHRoZSByaWdodCBzbyBkb3dud2FyZCBjaGFpbnMgZG9uJ3RcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGJlY29tZSBhIHdpZGUgc3RhaXJjYXNlIHRvIGNvbm5lY3QgZWFzdCB0byB3ZXN0IHBvcnRzLlxuICAgICAgICAgICAgICAgICAgICAgICAgeDogbm9kZS53aWR0aCwgeTogbm9kZS50YXJnZXRZLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGF5b3V0T3B0aW9uczogeyBcImVsay5wb3J0LnNpZGVcIjogXCJFQVNUXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgLi4ub3V0Z29pbmcuZ2V0KG5vZGUuaWQpLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9KSksXG4gICAgICAgICAgICBlZGdlcyxcbiAgICAgICAgfSxcbiAgICAgICAgaWRzLFxuICAgICAgICBlZGdlS2V5cyxcbiAgICB9O1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbGF5b3V0V2l0aEVsayhlbmdpbmUsIG5vZGVzLCByZWZlcmVuY2VzKSB7XG4gICAgY29uc3QgeyBncmFwaCwgaWRzLCBlZGdlS2V5cyB9ID0gYnVpbGRIZWFwR3JhcGgobm9kZXMsIHJlZmVyZW5jZXMpO1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGVuZ2luZS5sYXlvdXQoZ3JhcGgpO1xuICAgIGNvbnN0IG9iamVjdElkcyA9IG5ldyBNYXAoWy4uLmlkc10ubWFwKChbb2JqZWN0LCBpZF0pID0+IFtpZCwgb2JqZWN0XSkpO1xuICAgIHJldHVybiB7XG4gICAgICAgIHBvc2l0aW9uczogbmV3IE1hcChyZXN1bHQuY2hpbGRyZW4ubWFwKChub2RlKSA9PiBbXG4gICAgICAgICAgICBvYmplY3RJZHMuZ2V0KG5vZGUuaWQpLCB7IHg6IG5vZGUueCwgeTogbm9kZS55IH0sXG4gICAgICAgIF0pKSxcbiAgICAgICAgcm91dGVzOiBuZXcgTWFwKHJlc3VsdC5lZGdlcy5tYXAoKGVkZ2UpID0+IFtlZGdlS2V5cy5nZXQoZWRnZS5pZCksXG4gICAgICAgICAgICAoZWRnZS5zZWN0aW9ucyA/PyBbXSkuZmxhdE1hcCgoc2VjdGlvbikgPT4gW1xuICAgICAgICAgICAgICAgIHNlY3Rpb24uc3RhcnRQb2ludCwgLi4uKHNlY3Rpb24uYmVuZFBvaW50cyA/PyBbXSksIHNlY3Rpb24uZW5kUG9pbnQsXG4gICAgICAgICAgICBdKSxcbiAgICAgICAgXSkpLFxuICAgIH07XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBsYXlvdXRIZWFwKG5vZGVzLCByZWZlcmVuY2VzLCBpc0N1cnJlbnQgPSAoKSA9PiB0cnVlKSB7XG4gICAgY29uc3QgZW5naW5lID0gYXdhaXQgbG9hZEVsaygpO1xuICAgIGlmICghaXNDdXJyZW50KCkpIHJldHVybiBudWxsO1xuICAgIHJldHVybiBsYXlvdXRXaXRoRWxrKGVuZ2luZSwgbm9kZXMsIHJlZmVyZW5jZXMpO1xufVxuIiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9