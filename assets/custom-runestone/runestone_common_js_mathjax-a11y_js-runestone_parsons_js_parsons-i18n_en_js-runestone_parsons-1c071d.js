"use strict";
(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_common_js_mathjax-a11y_js-runestone_parsons_js_parsons-i18n_en_js-runestone_parsons-1c071d"],{

/***/ 29119:
/*!******************************************************!*\
  !*** ./runestone/parsons/js/parsons-i18n.sr-Cyrl.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/rsi18n.js */ 54250);


(0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.load)({
    "sr-Cyrl": {
        msg_parson_check_me: "Провери",
        msg_parson_reset: "Поништи",
        msg_parson_help: "Помоћ",
        msg_parson_too_short: "Искористи све блокове у решењу",
        msg_parson_drag_from_here: "Превуци одавде",
        msg_parson_drag_to_here: "Превуци овде",
        msg_parson_enter_activate: "Притисни Enter да активираш",
        msg_parson_keyboard_entry_label:
            "Парсонов задатак. Притисни Enter или размак да распоредиш блокове.",
        msg_parson_keyboard_instructions:
            "Користи стрелице за кретање по блоковима, а затим Enter или размак да помериш блок.",
        msg_parson_keyboard_selected: "Изабран је $1",
        msg_parson_incorrect: "Нетачно",
        msg_parson_block: "блок",
        msg_parson_keyboard_unplaced_position:
            "На листи непостављених, позиција $1 од $2",
        msg_parson_keyboard_answer_position:
            "У области одговора, позиција $1 од $2",
        msg_parson_keyboard_tab_in: "$1 ниво увлачења",
        msg_parson_keyboard_tabs_in: "$1 нивоа увлачења",
        msg_parson_keyboard_options: "$1 од $2 опције",
        msg_parson_correct_first_try: "Одлично! Успео си из првог покушаја!",
        msg_parson_correct:
            "Одлично! Решио си у само $1 покушаја. Одабери Поништи ако желиш да решиш из првог покушаја.",
        msg_parson_wrong_indent:
            "Овај блок није тачно увучен. Превуци га лево или десно да пронађеш прави ниво.",
        msg_parson_wrong_indents:
            "Ови блокви нису тачно увучени. Превуци их лево или десно да им пронађеш прави ниво.",
        msg_parson_wrong_order:
            "Означени блокови у твом програму су нетачни или у погрешном редоследу. Промени редослед или избаци блок из решења.",
        msg_parson_arrow_navigate:
            "Користи стрелице за кретње а Спејс да означииш блок који помераш.",
        msg_parson_help_info: "Одабери Помоћ ако желиш да олакшаш задатак",
        msg_parson_not_solution: "Одстранили смо блок који није део решења.",
        msg_parson_provided_indent: "Увукли смо блок.",
        msg_parson_combined_blocks: "Спојили смо два блока.",
        msg_parson_remove_incorrect: "Уклонићемо нетачне блокове из одговора.",
        msg_parson_will_combine: "Спојићемо два блока.",
        msg_parson_atleast_three_attempts:
            "Мораш пробати бар 3 могућа решења пре него што погледаш помоћ.",
        msg_parson_three_blocks_left:
            "Остало је још 3 тачна блока.  Пронађи им редослед.",
        msg_parson_will_provide_indent: "Увућићемо блок.",
    },
});


/***/ }),

/***/ 47937:
/*!*********************************************!*\
  !*** ./runestone/common/js/mathjax-a11y.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   disableMathJaxTabStops: () => (/* binding */ disableMathJaxTabStops),
/* harmony export */   getAccessibleElementText: () => (/* binding */ getAccessibleElementText),
/* harmony export */   getMathJaxSpeechDescendantText: () => (/* binding */ getMathJaxSpeechDescendantText),
/* harmony export */   getMathJaxSpeechText: () => (/* binding */ getMathJaxSpeechText)
/* harmony export */ });
/* ***********************************
 * |docname| - MathJax accessibility helpers
 * ***********************************
 * Utilities for interactive elements that contain MathJax-rendered content.
 */

const mathSpeechSelector =
    "mjx-container, .MathJax, [data-semantic-speech-none]";
const mathSpeechDescendantSelector =
    "mjx-container[aria-label], .MathJax[aria-label], [data-semantic-speech-none]";

/**
 * Return MathJax's speech text for a rendered math element.
 */
function getMathJaxSpeechText(element) {
    if (!element || element.nodeType !== Node.ELEMENT_NODE) {
        return "";
    }
    if (!element.matches(mathSpeechSelector)) {
        return "";
    }
    return (
        element.getAttribute("data-semantic-speech-none") ||
        element.getAttribute("aria-label") ||
        ""
    )
        .replace(/\s+/g, " ")
        .trim();
}

/**
 * Return the speech text from the first MathJax descendant of an element.
 */
function getMathJaxSpeechDescendantText(element) {
    return getMathJaxSpeechText(
        element?.querySelector?.(mathSpeechDescendantSelector),
    );
}

/**
 * Return an accessible text equivalent for content that can include MathJax.
 */
function getAccessibleElementText(element) {
    const parts = [];
    const visit = (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
            parts.push(node.textContent);
            return;
        }
        if (node.nodeType !== Node.ELEMENT_NODE) {
            return;
        }
        const nodeElement = node;
        const speechText = getMathJaxSpeechText(nodeElement);
        if (speechText) {
            parts.push(speechText);
            return;
        }
        if (nodeElement.matches(".process-math")) {
            const descendantSpeech =
                getMathJaxSpeechDescendantText(nodeElement);
            if (descendantSpeech) {
                parts.push(descendantSpeech);
                return;
            }
        }
        if (nodeElement.getAttribute("aria-hidden") === "true") {
            return;
        }
        if (nodeElement.tagName === "IMG") {
            parts.push(nodeElement.getAttribute("alt") || "");
            return;
        }
        for (const child of nodeElement.childNodes) {
            visit(child);
        }
    };
    if (element) {
        visit(element);
    }
    return parts.join(" ").replace(/\s+/g, " ").trim();
}

/**
 * Remove rendered MathJax content from the tab order within each container.
 */
function disableMathJaxTabStops(root, containerSelectors) {
    const mathSelectors = [
        ".MathJax",
        "mjx-container",
        ".process-math",
        ".MathJax [tabindex]",
        "mjx-container [tabindex]",
        ".process-math [tabindex]",
    ];
    const selector = containerSelectors
        .flatMap((containerSelector) =>
            mathSelectors.map(
                (mathSelector) => containerSelector + " " + mathSelector,
            ),
        )
        .join(", ");
    for (const mathElement of root.querySelectorAll(selector)) {
        mathElement.setAttribute("tabindex", "-1");
    }
}


/***/ }),

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


/***/ }),

/***/ 56906:
/*!****************************************************!*\
  !*** ./runestone/parsons/js/parsons-i18n.pt-br.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/rsi18n.js */ 54250);


(0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.load)({
    "pt-br": {
        msg_parson_check_me: "Verificar",
        msg_parson_reset: "Resetar",
        msg_parson_help:"Ajuda",
        msg_parson_too_short: "Seu programa é muito curto. Adicione mais blocos.",
        msg_parson_drag_from_here: "Arraste daqui",
        msg_parson_drag_to_here: "Largue os blocos aqui",
        msg_parson_enter_activate: "Pressione Enter para ativar",
        msg_parson_keyboard_entry_label:
            "Problema Parsons. Pressione Enter ou Espaço para organizar os blocos.",
        msg_parson_keyboard_instructions:
            "Use as teclas de seta para navegar pelos blocos e pressione Enter ou Espaço para movê-los.",
        msg_parson_keyboard_selected: "Selecionado $1",
        msg_parson_incorrect: "Incorreto",
        msg_parson_block: "bloco",
        msg_parson_keyboard_unplaced_position:
            "Na lista não posicionada, posição $1 de $2",
        msg_parson_keyboard_answer_position:
            "Na área de resposta, posição $1 de $2",
        msg_parson_keyboard_tab_in: "$1 nível de indentação",
        msg_parson_keyboard_tabs_in: "$1 níveis de indentação",
        msg_parson_keyboard_options: "$1 de $2 opções",
        msg_parson_correct_first_try:
            "Perfeito! Você levou apenas uma tentativa para resolver. Bom trabalho!",
        msg_parson_correct:
            "Perfeito! Você levou $1 tentativas para resolver. Clique em Resetar para tentar resolver em uma tentativa." ,
        msg_parson_wrong_indent:
            "Este bloco não está indentado corretamente. Indente mais arrastando-o para a direita ou reduza a indentação arrastando para a esquerda.",
        msg_parson_wrong_indents:
            "Estes blocos não estão indentados corretamente. Para indentar mais, arraste o bloco para a direita. Para reduzir a indentação, arraste para a esquerda.",
        msg_parson_wrong_order:
            "Blocos destacados no seu programa estão errados ou estão na ordem errada. Isso pode ser resolvido movendo, excluindo ou substituindo os blocos destacados.",
        msg_parson_arrow_navigate:
            "Use as teclas de setas para navegar. Espaço para selecionar/ desmarcar blocos para mover.",
        msg_parson_help_info:
            "Clique no botão Ajuda se você quiser facilitar o problema",
        msg_parson_not_solution:
            "Foi desabilitado um bloco de código desnecessário (que não faz parte da solução).",
        msg_parson_provided_indent:"Foi fornecida a indentação.",
        msg_parson_combined_blocks:"Dois blocos de códigos foram combinados em um.",
        msg_parson_remove_incorrect:
            "Será removido um bloco de código incorreto da área de resposta",
        msg_parson_will_combine:"Serão combinados dois blocos",
        msg_parson_atleast_three_attempts:
            "Você deve tentar pelo menos três vezes antes de pedir ajuda",
        msg_parson_three_blocks_left:
            "Restam apenas 3 blocos corretos. Você deve colocá-los em ordem",
        msg_parson_will_provide_indent: "Será fornecida a indentação"
    },
});


/***/ }),

/***/ 75794:
/*!*************************************************!*\
  !*** ./runestone/parsons/js/parsons-i18n.en.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/rsi18n.js */ 54250);


(0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.load)({
    en: {
        msg_parson_check_me: "Check",
        msg_parson_reset: "Reset",
        msg_parson_help: "Help me",
        msg_parson_too_short: "Your answer is too short. Add more blocks.",
        msg_parson_drag_from_here: "Drag from here",
        msg_parson_drag_to_here: "Drop blocks here",
        msg_parson_enter_activate: "Enter to activate",
        msg_parson_keyboard_entry_label:
            "Parsons problem. Press Enter or Space to arrange blocks.",
        msg_parson_keyboard_instructions:
            "Use arrow keys to navigate blocks, then Enter or Space to move it.",
        msg_parson_keyboard_selected: "Selected $1",
        msg_parson_incorrect: "Incorrect",
        msg_parson_block: "block",
        msg_parson_keyboard_unplaced_position:
            "In the unplaced list, position $1 of $2",
        msg_parson_keyboard_answer_position:
            "In the answer area, position $1 of $2",
        msg_parson_keyboard_tab_in: "$1 tab in",
        msg_parson_keyboard_tabs_in: "$1 tabs in",
        msg_parson_keyboard_options: "$1 of $2 options",
        msg_parson_correct_first_try:
            "Perfect!  It took you only one try to solve this.  Great job!",
        msg_parson_correct:
            "Perfect!  It took you $1 tries to solve this.  Click Reset to try to solve it in one attempt.",
        msg_parson_correct_runnable:
            "Click Run below to test out your solution.",
        msg_parson_wrong_indent:
            "This block is not indented correctly. Either indent it more by dragging it right or reduce the indention by dragging it left.",
        msg_parson_wrong_indents:
            "These blocks are not indented correctly. To indent a block more, drag it to the right. To reduce the indention, drag it to the left.",
        msg_parson_wrong_order:
            "Highlighted blocks in your answer are wrong or are in the wrong order. This can be fixed by moving, removing, or replacing highlighted blocks.",
        msg_parson_arrow_navigate:
            "Arrow keys to navigate. Space to select / deselect block to move.",
        msg_parson_help_info:
            "Click on the Help Me button if you want to make the problem easier",
        msg_parson_not_solution:
            "Disabled an unneeded code block (one that is not part of the solution).",
        msg_parson_provided_indent: "Provided the indentation.",
        msg_parson_combined_blocks: "Combined two code blocks into one.",
        msg_parson_remove_incorrect:
            "Will remove an incorrect code block from answer area",
        msg_parson_will_combine: "Will combine two blocks",
        msg_parson_atleast_three_attempts:
            "You must make at least three distinct full attempts at a solution before you can get help",
        msg_parson_three_blocks_left:
            "There are only 3 correct blocks left.  You should be able to put them in order",
        msg_parson_will_provide_indent: "Will provide indentation",
    },
});


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuZXN0b25lX2NvbW1vbl9qc19tYXRoamF4LWExMXlfanMtcnVuZXN0b25lX3BhcnNvbnNfanNfcGFyc29ucy1pMThuX2VuX2pzLXJ1bmVzdG9uZV9wYXJzb25zLTFjMDcxZC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFpRDs7QUFFakQsMERBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2hERDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN6R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjLFVBQVU7QUFDeEIsWUFBWSxNQUFNLHdCQUF3QjtBQUMxQyxrQ0FBa0M7QUFDbEMsa0NBQWtDO0FBQ2xDO0FBQ2E7O0FBRWI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRU87QUFDUDtBQUNBOztBQUVPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsT0FBTyxRQUFRLGVBQWUsYUFBYTtBQUMzQztBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQSx5REFBeUQ7QUFDekQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBLGlFQUFlLEVBQUUsK0JBQStCLEVBQUM7Ozs7Ozs7Ozs7Ozs7QUMvRkE7O0FBRWpELDBEQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLENBQUM7Ozs7Ozs7Ozs7Ozs7QUNwRGdEOztBQUVqRCwwREFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvcGFyc29ucy9qcy9wYXJzb25zLWkxOG4uc3ItQ3lybC5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2NvbW1vbi9qcy9tYXRoamF4LWExMXkuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9jb21tb24vanMvcnNpMThuLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvcGFyc29ucy9qcy9wYXJzb25zLWkxOG4ucHQtYnIuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9wYXJzb25zL2pzL3BhcnNvbnMtaTE4bi5lbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBsb2FkIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9qcy9yc2kxOG4uanNcIjtcblxubG9hZCh7XG4gICAgXCJzci1DeXJsXCI6IHtcbiAgICAgICAgbXNnX3BhcnNvbl9jaGVja19tZTogXCLQn9GA0L7QstC10YDQuFwiLFxuICAgICAgICBtc2dfcGFyc29uX3Jlc2V0OiBcItCf0L7QvdC40YjRgtC4XCIsXG4gICAgICAgIG1zZ19wYXJzb25faGVscDogXCLQn9C+0LzQvtGbXCIsXG4gICAgICAgIG1zZ19wYXJzb25fdG9vX3Nob3J0OiBcItCY0YHQutC+0YDQuNGB0YLQuCDRgdCy0LUg0LHQu9C+0LrQvtCy0LUg0YMg0YDQtdGI0LXRmtGDXCIsXG4gICAgICAgIG1zZ19wYXJzb25fZHJhZ19mcm9tX2hlcmU6IFwi0J/RgNC10LLRg9GG0Lgg0L7QtNCw0LLQtNC1XCIsXG4gICAgICAgIG1zZ19wYXJzb25fZHJhZ190b19oZXJlOiBcItCf0YDQtdCy0YPRhtC4INC+0LLQtNC1XCIsXG4gICAgICAgIG1zZ19wYXJzb25fZW50ZXJfYWN0aXZhdGU6IFwi0J/RgNC40YLQuNGB0L3QuCBFbnRlciDQtNCwINCw0LrRgtC40LLQuNGA0LDRiFwiLFxuICAgICAgICBtc2dfcGFyc29uX2tleWJvYXJkX2VudHJ5X2xhYmVsOlxuICAgICAgICAgICAgXCLQn9Cw0YDRgdC+0L3QvtCyINC30LDQtNCw0YLQsNC6LiDQn9GA0LjRgtC40YHQvdC4IEVudGVyINC40LvQuCDRgNCw0LfQvNCw0Log0LTQsCDRgNCw0YHQv9C+0YDQtdC00LjRiCDQsdC70L7QutC+0LLQtS5cIixcbiAgICAgICAgbXNnX3BhcnNvbl9rZXlib2FyZF9pbnN0cnVjdGlvbnM6XG4gICAgICAgICAgICBcItCa0L7RgNC40YHRgtC4INGB0YLRgNC10LvQuNGG0LUg0LfQsCDQutGA0LXRgtCw0ZrQtSDQv9C+INCx0LvQvtC60L7QstC40LzQsCwg0LAg0LfQsNGC0LjQvCBFbnRlciDQuNC70Lgg0YDQsNC30LzQsNC6INC00LAg0L/QvtC80LXRgNC40Ygg0LHQu9C+0LouXCIsXG4gICAgICAgIG1zZ19wYXJzb25fa2V5Ym9hcmRfc2VsZWN0ZWQ6IFwi0JjQt9Cw0LHRgNCw0L0g0ZjQtSAkMVwiLFxuICAgICAgICBtc2dfcGFyc29uX2luY29ycmVjdDogXCLQndC10YLQsNGH0L3QvlwiLFxuICAgICAgICBtc2dfcGFyc29uX2Jsb2NrOiBcItCx0LvQvtC6XCIsXG4gICAgICAgIG1zZ19wYXJzb25fa2V5Ym9hcmRfdW5wbGFjZWRfcG9zaXRpb246XG4gICAgICAgICAgICBcItCd0LAg0LvQuNGB0YLQuCDQvdC10L/QvtGB0YLQsNCy0ZnQtdC90LjRhSwg0L/QvtC30LjRhtC40ZjQsCAkMSDQvtC0ICQyXCIsXG4gICAgICAgIG1zZ19wYXJzb25fa2V5Ym9hcmRfYW5zd2VyX3Bvc2l0aW9uOlxuICAgICAgICAgICAgXCLQoyDQvtCx0LvQsNGB0YLQuCDQvtC00LPQvtCy0L7RgNCwLCDQv9C+0LfQuNGG0LjRmNCwICQxINC+0LQgJDJcIixcbiAgICAgICAgbXNnX3BhcnNvbl9rZXlib2FyZF90YWJfaW46IFwiJDEg0L3QuNCy0L4g0YPQstC70LDRh9C10ZrQsFwiLFxuICAgICAgICBtc2dfcGFyc29uX2tleWJvYXJkX3RhYnNfaW46IFwiJDEg0L3QuNCy0L7QsCDRg9Cy0LvQsNGH0LXRmtCwXCIsXG4gICAgICAgIG1zZ19wYXJzb25fa2V5Ym9hcmRfb3B0aW9uczogXCIkMSDQvtC0ICQyINC+0L/RhtC40ZjQtVwiLFxuICAgICAgICBtc2dfcGFyc29uX2NvcnJlY3RfZmlyc3RfdHJ5OiBcItCe0LTQu9C40YfQvdC+ISDQo9GB0L/QtdC+INGB0Lgg0LjQtyDQv9GA0LLQvtCzINC/0L7QutGD0YjQsNGY0LAhXCIsXG4gICAgICAgIG1zZ19wYXJzb25fY29ycmVjdDpcbiAgICAgICAgICAgIFwi0J7QtNC70LjRh9C90L4hINCg0LXRiNC40L4g0YHQuCDRgyDRgdCw0LzQviAkMSDQv9C+0LrRg9GI0LDRmNCwLiDQntC00LDQsdC10YDQuCDQn9C+0L3QuNGI0YLQuCDQsNC60L4g0LbQtdC70LjRiCDQtNCwINGA0LXRiNC40Ygg0LjQtyDQv9GA0LLQvtCzINC/0L7QutGD0YjQsNGY0LAuXCIsXG4gICAgICAgIG1zZ19wYXJzb25fd3JvbmdfaW5kZW50OlxuICAgICAgICAgICAgXCLQntCy0LDRmCDQsdC70L7QuiDQvdC40ZjQtSDRgtCw0YfQvdC+INGD0LLRg9GH0LXQvS4g0J/RgNC10LLRg9GG0Lgg0LPQsCDQu9C10LLQviDQuNC70Lgg0LTQtdGB0L3QviDQtNCwINC/0YDQvtC90LDRktC10Ygg0L/RgNCw0LLQuCDQvdC40LLQvi5cIixcbiAgICAgICAgbXNnX3BhcnNvbl93cm9uZ19pbmRlbnRzOlxuICAgICAgICAgICAgXCLQntCy0Lgg0LHQu9C+0LrQstC4INC90LjRgdGDINGC0LDRh9C90L4g0YPQstGD0YfQtdC90LguINCf0YDQtdCy0YPRhtC4INC40YUg0LvQtdCy0L4g0LjQu9C4INC00LXRgdC90L4g0LTQsCDQuNC8INC/0YDQvtC90LDRktC10Ygg0L/RgNCw0LLQuCDQvdC40LLQvi5cIixcbiAgICAgICAgbXNnX3BhcnNvbl93cm9uZ19vcmRlcjpcbiAgICAgICAgICAgIFwi0J7Qt9C90LDRh9C10L3QuCDQsdC70L7QutC+0LLQuCDRgyDRgtCy0L7QvCDQv9GA0L7Qs9GA0LDQvNGDINGB0YMg0L3QtdGC0LDRh9C90Lgg0LjQu9C4INGDINC/0L7Qs9GA0LXRiNC90L7QvCDRgNC10LTQvtGB0LvQtdC00YMuINCf0YDQvtC80LXQvdC4INGA0LXQtNC+0YHQu9C10LQg0LjQu9C4INC40LfQsdCw0YbQuCDQsdC70L7QuiDQuNC3INGA0LXRiNC10ZrQsC5cIixcbiAgICAgICAgbXNnX3BhcnNvbl9hcnJvd19uYXZpZ2F0ZTpcbiAgICAgICAgICAgIFwi0JrQvtGA0LjRgdGC0Lgg0YHRgtGA0LXQu9C40YbQtSDQt9CwINC60YDQtdGC0ZrQtSDQsCDQodC/0LXRmNGBINC00LAg0L7Qt9C90LDRh9C40LjRiCDQsdC70L7QuiDQutC+0ZjQuCDQv9C+0LzQtdGA0LDRiC5cIixcbiAgICAgICAgbXNnX3BhcnNvbl9oZWxwX2luZm86IFwi0J7QtNCw0LHQtdGA0Lgg0J/QvtC80L7RmyDQsNC60L4g0LbQtdC70LjRiCDQtNCwINC+0LvQsNC60YjQsNGIINC30LDQtNCw0YLQsNC6XCIsXG4gICAgICAgIG1zZ19wYXJzb25fbm90X3NvbHV0aW9uOiBcItCe0LTRgdGC0YDQsNC90LjQu9C4INGB0LzQviDQsdC70L7QuiDQutC+0ZjQuCDQvdC40ZjQtSDQtNC10L4g0YDQtdGI0LXRmtCwLlwiLFxuICAgICAgICBtc2dfcGFyc29uX3Byb3ZpZGVkX2luZGVudDogXCLQo9Cy0YPQutC70Lgg0YHQvNC+INCx0LvQvtC6LlwiLFxuICAgICAgICBtc2dfcGFyc29uX2NvbWJpbmVkX2Jsb2NrczogXCLQodC/0L7RmNC40LvQuCDRgdC80L4g0LTQstCwINCx0LvQvtC60LAuXCIsXG4gICAgICAgIG1zZ19wYXJzb25fcmVtb3ZlX2luY29ycmVjdDogXCLQo9C60LvQvtC90LjRm9C10LzQviDQvdC10YLQsNGH0L3QtSDQsdC70L7QutC+0LLQtSDQuNC3INC+0LTQs9C+0LLQvtGA0LAuXCIsXG4gICAgICAgIG1zZ19wYXJzb25fd2lsbF9jb21iaW5lOiBcItCh0L/QvtGY0LjRm9C10LzQviDQtNCy0LAg0LHQu9C+0LrQsC5cIixcbiAgICAgICAgbXNnX3BhcnNvbl9hdGxlYXN0X3RocmVlX2F0dGVtcHRzOlxuICAgICAgICAgICAgXCLQnNC+0YDQsNGIINC/0YDQvtCx0LDRgtC4INCx0LDRgCAzINC80L7Qs9GD0ZvQsCDRgNC10YjQtdGa0LAg0L/RgNC1INC90LXQs9C+INGI0YLQviDQv9C+0LPQu9C10LTQsNGIINC/0L7QvNC+0ZsuXCIsXG4gICAgICAgIG1zZ19wYXJzb25fdGhyZWVfYmxvY2tzX2xlZnQ6XG4gICAgICAgICAgICBcItCe0YHRgtCw0LvQviDRmNC1INGY0L7RiCAzINGC0LDRh9C90LAg0LHQu9C+0LrQsC4gINCf0YDQvtC90LDRktC4INC40Lwg0YDQtdC00L7RgdC70LXQtC5cIixcbiAgICAgICAgbXNnX3BhcnNvbl93aWxsX3Byb3ZpZGVfaW5kZW50OiBcItCj0LLRg9Gb0LjRm9C10LzQviDQsdC70L7Qui5cIixcbiAgICB9LFxufSk7XG4iLCIvKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogfGRvY25hbWV8IC0gTWF0aEpheCBhY2Nlc3NpYmlsaXR5IGhlbHBlcnNcbiAqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBVdGlsaXRpZXMgZm9yIGludGVyYWN0aXZlIGVsZW1lbnRzIHRoYXQgY29udGFpbiBNYXRoSmF4LXJlbmRlcmVkIGNvbnRlbnQuXG4gKi9cblxuY29uc3QgbWF0aFNwZWVjaFNlbGVjdG9yID1cbiAgICBcIm1qeC1jb250YWluZXIsIC5NYXRoSmF4LCBbZGF0YS1zZW1hbnRpYy1zcGVlY2gtbm9uZV1cIjtcbmNvbnN0IG1hdGhTcGVlY2hEZXNjZW5kYW50U2VsZWN0b3IgPVxuICAgIFwibWp4LWNvbnRhaW5lclthcmlhLWxhYmVsXSwgLk1hdGhKYXhbYXJpYS1sYWJlbF0sIFtkYXRhLXNlbWFudGljLXNwZWVjaC1ub25lXVwiO1xuXG4vKipcbiAqIFJldHVybiBNYXRoSmF4J3Mgc3BlZWNoIHRleHQgZm9yIGEgcmVuZGVyZWQgbWF0aCBlbGVtZW50LlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWF0aEpheFNwZWVjaFRleHQoZWxlbWVudCkge1xuICAgIGlmICghZWxlbWVudCB8fCBlbGVtZW50Lm5vZGVUeXBlICE9PSBOb2RlLkVMRU1FTlRfTk9ERSkge1xuICAgICAgICByZXR1cm4gXCJcIjtcbiAgICB9XG4gICAgaWYgKCFlbGVtZW50Lm1hdGNoZXMobWF0aFNwZWVjaFNlbGVjdG9yKSkge1xuICAgICAgICByZXR1cm4gXCJcIjtcbiAgICB9XG4gICAgcmV0dXJuIChcbiAgICAgICAgZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXNlbWFudGljLXNwZWVjaC1ub25lXCIpIHx8XG4gICAgICAgIGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiYXJpYS1sYWJlbFwiKSB8fFxuICAgICAgICBcIlwiXG4gICAgKVxuICAgICAgICAucmVwbGFjZSgvXFxzKy9nLCBcIiBcIilcbiAgICAgICAgLnRyaW0oKTtcbn1cblxuLyoqXG4gKiBSZXR1cm4gdGhlIHNwZWVjaCB0ZXh0IGZyb20gdGhlIGZpcnN0IE1hdGhKYXggZGVzY2VuZGFudCBvZiBhbiBlbGVtZW50LlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWF0aEpheFNwZWVjaERlc2NlbmRhbnRUZXh0KGVsZW1lbnQpIHtcbiAgICByZXR1cm4gZ2V0TWF0aEpheFNwZWVjaFRleHQoXG4gICAgICAgIGVsZW1lbnQ/LnF1ZXJ5U2VsZWN0b3I/LihtYXRoU3BlZWNoRGVzY2VuZGFudFNlbGVjdG9yKSxcbiAgICApO1xufVxuXG4vKipcbiAqIFJldHVybiBhbiBhY2Nlc3NpYmxlIHRleHQgZXF1aXZhbGVudCBmb3IgY29udGVudCB0aGF0IGNhbiBpbmNsdWRlIE1hdGhKYXguXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRBY2Nlc3NpYmxlRWxlbWVudFRleHQoZWxlbWVudCkge1xuICAgIGNvbnN0IHBhcnRzID0gW107XG4gICAgY29uc3QgdmlzaXQgPSAobm9kZSkgPT4ge1xuICAgICAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gTm9kZS5URVhUX05PREUpIHtcbiAgICAgICAgICAgIHBhcnRzLnB1c2gobm9kZS50ZXh0Q29udGVudCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5vZGUubm9kZVR5cGUgIT09IE5vZGUuRUxFTUVOVF9OT0RFKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgbm9kZUVsZW1lbnQgPSBub2RlO1xuICAgICAgICBjb25zdCBzcGVlY2hUZXh0ID0gZ2V0TWF0aEpheFNwZWVjaFRleHQobm9kZUVsZW1lbnQpO1xuICAgICAgICBpZiAoc3BlZWNoVGV4dCkge1xuICAgICAgICAgICAgcGFydHMucHVzaChzcGVlY2hUZXh0KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAobm9kZUVsZW1lbnQubWF0Y2hlcyhcIi5wcm9jZXNzLW1hdGhcIikpIHtcbiAgICAgICAgICAgIGNvbnN0IGRlc2NlbmRhbnRTcGVlY2ggPVxuICAgICAgICAgICAgICAgIGdldE1hdGhKYXhTcGVlY2hEZXNjZW5kYW50VGV4dChub2RlRWxlbWVudCk7XG4gICAgICAgICAgICBpZiAoZGVzY2VuZGFudFNwZWVjaCkge1xuICAgICAgICAgICAgICAgIHBhcnRzLnB1c2goZGVzY2VuZGFudFNwZWVjaCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChub2RlRWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJhcmlhLWhpZGRlblwiKSA9PT0gXCJ0cnVlXCIpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAobm9kZUVsZW1lbnQudGFnTmFtZSA9PT0gXCJJTUdcIikge1xuICAgICAgICAgICAgcGFydHMucHVzaChub2RlRWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJhbHRcIikgfHwgXCJcIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiBub2RlRWxlbWVudC5jaGlsZE5vZGVzKSB7XG4gICAgICAgICAgICB2aXNpdChjaGlsZCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIGlmIChlbGVtZW50KSB7XG4gICAgICAgIHZpc2l0KGVsZW1lbnQpO1xuICAgIH1cbiAgICByZXR1cm4gcGFydHMuam9pbihcIiBcIikucmVwbGFjZSgvXFxzKy9nLCBcIiBcIikudHJpbSgpO1xufVxuXG4vKipcbiAqIFJlbW92ZSByZW5kZXJlZCBNYXRoSmF4IGNvbnRlbnQgZnJvbSB0aGUgdGFiIG9yZGVyIHdpdGhpbiBlYWNoIGNvbnRhaW5lci5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRpc2FibGVNYXRoSmF4VGFiU3RvcHMocm9vdCwgY29udGFpbmVyU2VsZWN0b3JzKSB7XG4gICAgY29uc3QgbWF0aFNlbGVjdG9ycyA9IFtcbiAgICAgICAgXCIuTWF0aEpheFwiLFxuICAgICAgICBcIm1qeC1jb250YWluZXJcIixcbiAgICAgICAgXCIucHJvY2Vzcy1tYXRoXCIsXG4gICAgICAgIFwiLk1hdGhKYXggW3RhYmluZGV4XVwiLFxuICAgICAgICBcIm1qeC1jb250YWluZXIgW3RhYmluZGV4XVwiLFxuICAgICAgICBcIi5wcm9jZXNzLW1hdGggW3RhYmluZGV4XVwiLFxuICAgIF07XG4gICAgY29uc3Qgc2VsZWN0b3IgPSBjb250YWluZXJTZWxlY3RvcnNcbiAgICAgICAgLmZsYXRNYXAoKGNvbnRhaW5lclNlbGVjdG9yKSA9PlxuICAgICAgICAgICAgbWF0aFNlbGVjdG9ycy5tYXAoXG4gICAgICAgICAgICAgICAgKG1hdGhTZWxlY3RvcikgPT4gY29udGFpbmVyU2VsZWN0b3IgKyBcIiBcIiArIG1hdGhTZWxlY3RvcixcbiAgICAgICAgICAgICksXG4gICAgICAgIClcbiAgICAgICAgLmpvaW4oXCIsIFwiKTtcbiAgICBmb3IgKGNvbnN0IG1hdGhFbGVtZW50IG9mIHJvb3QucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikpIHtcbiAgICAgICAgbWF0aEVsZW1lbnQuc2V0QXR0cmlidXRlKFwidGFiaW5kZXhcIiwgXCItMVwiKTtcbiAgICB9XG59XG4iLCIvKlxuICogcnNpMThuLmpzIOKAlCBsaWdodHdlaWdodCwgZGVwZW5kZW5jeS1mcmVlIGkxOG4gZm9yIFJ1bmVzdG9uZSBpbnRlcmFjdGl2ZXMuXG4gKlxuICogUmVwbGFjZXMgdGhlIHZlbmRvcmVkIFdpa2ltZWRpYSBqcXVlcnkuaTE4biBwbHVnaW4gZm9yIGNvbXBvbmVudHMgdGhhdCBoYXZlXG4gKiBiZWVuIG1pZ3JhdGVkIG9mZiBqUXVlcnkuIFRoZSBjYXRhbG9nIGZvcm1hdCBpcyB1bmNoYW5nZWQ6IG1lc3NhZ2VzIGFyZVxuICoga2V5ZWQgYnkgbmFtZSB3aXRoaW4gYSBsb2NhbGUgb2JqZWN0IGFuZCB1c2UgcG9zaXRpb25hbCAkMSwgJDIsIC4uLlxuICogcGxhY2Vob2xkZXJzLCBzbyBleGlzdGluZyAqLWkxOG4uPGxvY2FsZT4uanMgY2F0YWxvZyBmaWxlcyBvbmx5IG5lZWQgdGhlaXJcbiAqIGAkLmkxOG4oKS5sb2FkKC4uLilgIGNhbGwgc3dhcHBlZCBmb3IgYGxvYWQoLi4uKWAuXG4gKlxuICogVXNhZ2U6XG4gKiAgIGltcG9ydCB7IGxvYWQsIHQgfSBmcm9tIFwiLi4vLi4vY29tbW9uL2pzL3JzaTE4bi5qc1wiO1xuICogICBsb2FkKHsgZW46IHsgZ3JlZXRpbmc6IFwiSGVsbG8gJDFcIiB9IH0pO1xuICogICB0KFwiZ3JlZXRpbmdcIiwgXCJXb3JsZFwiKTsgICAgICAvLyAtPiBcIkhlbGxvIFdvcmxkXCJcbiAqICAgdChcInVua25vd25fa2V5XCIpOyAgICAgICAgICAgIC8vIC0+IFwidW5rbm93bl9rZXlcIiAobWF0Y2hlcyBqcXVlcnkuaTE4bilcbiAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbmNvbnN0IEZBTExCQUNLID0gXCJlblwiO1xuY29uc3QgY2F0YWxvZ3MgPSB7fTtcblxuZnVuY3Rpb24gbm9ybWFsaXplKGxvY2FsZSkge1xuICAgIHJldHVybiBTdHJpbmcobG9jYWxlIHx8IFwiXCIpLnRvTG93ZXJDYXNlKCk7XG59XG5cbi8vIERlZmF1bHQgbG9jYWxlIGZyb20gdGhlIGRvY3VtZW50LCBmYWxsaW5nIGJhY2sgdG8gdGhlIGJyb3dzZXIsIHRoZW4gRW5nbGlzaC5cbi8vIGpxdWVyeS5pMThuIGRlcml2ZWQgdGhlIGxvY2FsZSB0aGUgc2FtZSB3YXksIHNvIGJlaGF2aW9yIGlzIHByZXNlcnZlZC5cbmxldCBjdXJyZW50TG9jYWxlID0gbm9ybWFsaXplKFxuICAgICh0eXBlb2YgZG9jdW1lbnQgIT09IFwidW5kZWZpbmVkXCIgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmxhbmcpIHx8XG4gICAgICAgICh0eXBlb2YgbmF2aWdhdG9yICE9PSBcInVuZGVmaW5lZFwiICYmIG5hdmlnYXRvci5sYW5ndWFnZSkgfHxcbiAgICAgICAgRkFMTEJBQ0ssXG4pO1xuXG5leHBvcnQgZnVuY3Rpb24gc2V0TG9jYWxlKGxvY2FsZSkge1xuICAgIGN1cnJlbnRMb2NhbGUgPSBub3JtYWxpemUobG9jYWxlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldExvY2FsZSgpIHtcbiAgICByZXR1cm4gY3VycmVudExvY2FsZTtcbn1cblxuLyoqXG4gKiBSZWdpc3RlciBtZXNzYWdlcy4gQWNjZXB0cyB0aGUgc2FtZSBzaGFwZSBhcyAkLmkxOG4oKS5sb2FkKCk6XG4gKiAgIHsgXCJlblwiOiB7IGtleTogXCJtc2cgJDFcIiB9LCBcInB0LWJyXCI6IHsga2V5OiBcIi4uLlwiIH0gfVxuICogTG9jYWxlIGtleXMgYXJlIG5vcm1hbGl6ZWQgdG8gbG93ZXItY2FzZSBzbyBsb29rdXBzIGFyZSBjYXNlLWluc2Vuc2l0aXZlXG4gKiAoZS5nLiBhIFwic3ItQ3lybFwiIGNhdGFsb2cgbWF0Y2hlcyBhIGRvY3VtZW50IGxhbmcgb2YgXCJzci1jeXJsXCIpLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbG9hZChtZXNzYWdlcykge1xuICAgIGZvciAoY29uc3QgW2xvY2FsZSwgbXNnc10gb2YgT2JqZWN0LmVudHJpZXMobWVzc2FnZXMpKSB7XG4gICAgICAgIGNvbnN0IGtleSA9IG5vcm1hbGl6ZShsb2NhbGUpO1xuICAgICAgICBjYXRhbG9nc1trZXldID0gT2JqZWN0LmFzc2lnbihjYXRhbG9nc1trZXldIHx8IHt9LCBtc2dzKTtcbiAgICB9XG59XG5cbi8vIExvb2t1cCBvcmRlcjogZXhhY3QgbG9jYWxlLCB0aGVuIGl0cyBwcmltYXJ5IHN1YnRhZywgdGhlbiB0aGUgZmFsbGJhY2suXG4vLyBlLmcuIFwicHQtYnJcIiAtPiBcInB0XCIgLT4gXCJlblwiLlxuZnVuY3Rpb24gbG9jYWxlQ2hhaW4obG9jYWxlKSB7XG4gICAgY29uc3QgY2hhaW4gPSBbXTtcbiAgICBpZiAobG9jYWxlKSB7XG4gICAgICAgIGNoYWluLnB1c2gobG9jYWxlKTtcbiAgICAgICAgY29uc3QgcHJpbWFyeSA9IGxvY2FsZS5zcGxpdChcIi1cIilbMF07XG4gICAgICAgIGlmIChwcmltYXJ5ICYmIHByaW1hcnkgIT09IGxvY2FsZSkge1xuICAgICAgICAgICAgY2hhaW4ucHVzaChwcmltYXJ5KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoY2hhaW4uaW5kZXhPZihGQUxMQkFDSykgPT09IC0xKSB7XG4gICAgICAgIGNoYWluLnB1c2goRkFMTEJBQ0spO1xuICAgIH1cbiAgICByZXR1cm4gY2hhaW47XG59XG5cbmZ1bmN0aW9uIGxvb2t1cChrZXkpIHtcbiAgICBmb3IgKGNvbnN0IGxvY2FsZSBvZiBsb2NhbGVDaGFpbihjdXJyZW50TG9jYWxlKSkge1xuICAgICAgICBjb25zdCBjYXRhbG9nID0gY2F0YWxvZ3NbbG9jYWxlXTtcbiAgICAgICAgaWYgKGNhdGFsb2cgJiYgY2F0YWxvZ1trZXldICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBjYXRhbG9nW2tleV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBUcmFuc2xhdGUgYSBtZXNzYWdlIGtleSwgc3Vic3RpdHV0aW5nIHBvc2l0aW9uYWwgJDEsICQyLCAuLi4gYXJndW1lbnRzLlxuICogVW5rbm93biBrZXlzIGFyZSByZXR1cm5lZCB2ZXJiYXRpbSwgbWF0Y2hpbmcganF1ZXJ5LmkxOG4ncyBiZWhhdmlvci5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHQoa2V5LCAuLi5hcmdzKSB7XG4gICAgY29uc3QgbXNnID0gbG9va3VwKGtleSk7XG4gICAgaWYgKG1zZyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBrZXk7XG4gICAgfVxuICAgIHJldHVybiBtc2cucmVwbGFjZSgvXFwkKFxcZCspL2csIChtYXRjaCwgbikgPT4ge1xuICAgICAgICBjb25zdCBhcmcgPSBhcmdzW051bWJlcihuKSAtIDFdO1xuICAgICAgICByZXR1cm4gYXJnID09PSB1bmRlZmluZWQgPyBtYXRjaCA6IFN0cmluZyhhcmcpO1xuICAgIH0pO1xufVxuXG5leHBvcnQgZGVmYXVsdCB7IGxvYWQsIHQsIHNldExvY2FsZSwgZ2V0TG9jYWxlIH07XG4iLCJpbXBvcnQgeyBsb2FkIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9qcy9yc2kxOG4uanNcIjtcblxubG9hZCh7XG4gICAgXCJwdC1iclwiOiB7XG4gICAgICAgIG1zZ19wYXJzb25fY2hlY2tfbWU6IFwiVmVyaWZpY2FyXCIsXG4gICAgICAgIG1zZ19wYXJzb25fcmVzZXQ6IFwiUmVzZXRhclwiLFxuICAgICAgICBtc2dfcGFyc29uX2hlbHA6XCJBanVkYVwiLFxuICAgICAgICBtc2dfcGFyc29uX3Rvb19zaG9ydDogXCJTZXUgcHJvZ3JhbWEgw6kgbXVpdG8gY3VydG8uIEFkaWNpb25lIG1haXMgYmxvY29zLlwiLFxuICAgICAgICBtc2dfcGFyc29uX2RyYWdfZnJvbV9oZXJlOiBcIkFycmFzdGUgZGFxdWlcIixcbiAgICAgICAgbXNnX3BhcnNvbl9kcmFnX3RvX2hlcmU6IFwiTGFyZ3VlIG9zIGJsb2NvcyBhcXVpXCIsXG4gICAgICAgIG1zZ19wYXJzb25fZW50ZXJfYWN0aXZhdGU6IFwiUHJlc3Npb25lIEVudGVyIHBhcmEgYXRpdmFyXCIsXG4gICAgICAgIG1zZ19wYXJzb25fa2V5Ym9hcmRfZW50cnlfbGFiZWw6XG4gICAgICAgICAgICBcIlByb2JsZW1hIFBhcnNvbnMuIFByZXNzaW9uZSBFbnRlciBvdSBFc3Bhw6dvIHBhcmEgb3JnYW5pemFyIG9zIGJsb2Nvcy5cIixcbiAgICAgICAgbXNnX3BhcnNvbl9rZXlib2FyZF9pbnN0cnVjdGlvbnM6XG4gICAgICAgICAgICBcIlVzZSBhcyB0ZWNsYXMgZGUgc2V0YSBwYXJhIG5hdmVnYXIgcGVsb3MgYmxvY29zIGUgcHJlc3Npb25lIEVudGVyIG91IEVzcGHDp28gcGFyYSBtb3bDqi1sb3MuXCIsXG4gICAgICAgIG1zZ19wYXJzb25fa2V5Ym9hcmRfc2VsZWN0ZWQ6IFwiU2VsZWNpb25hZG8gJDFcIixcbiAgICAgICAgbXNnX3BhcnNvbl9pbmNvcnJlY3Q6IFwiSW5jb3JyZXRvXCIsXG4gICAgICAgIG1zZ19wYXJzb25fYmxvY2s6IFwiYmxvY29cIixcbiAgICAgICAgbXNnX3BhcnNvbl9rZXlib2FyZF91bnBsYWNlZF9wb3NpdGlvbjpcbiAgICAgICAgICAgIFwiTmEgbGlzdGEgbsOjbyBwb3NpY2lvbmFkYSwgcG9zacOnw6NvICQxIGRlICQyXCIsXG4gICAgICAgIG1zZ19wYXJzb25fa2V5Ym9hcmRfYW5zd2VyX3Bvc2l0aW9uOlxuICAgICAgICAgICAgXCJOYSDDoXJlYSBkZSByZXNwb3N0YSwgcG9zacOnw6NvICQxIGRlICQyXCIsXG4gICAgICAgIG1zZ19wYXJzb25fa2V5Ym9hcmRfdGFiX2luOiBcIiQxIG7DrXZlbCBkZSBpbmRlbnRhw6fDo29cIixcbiAgICAgICAgbXNnX3BhcnNvbl9rZXlib2FyZF90YWJzX2luOiBcIiQxIG7DrXZlaXMgZGUgaW5kZW50YcOnw6NvXCIsXG4gICAgICAgIG1zZ19wYXJzb25fa2V5Ym9hcmRfb3B0aW9uczogXCIkMSBkZSAkMiBvcMOnw7Vlc1wiLFxuICAgICAgICBtc2dfcGFyc29uX2NvcnJlY3RfZmlyc3RfdHJ5OlxuICAgICAgICAgICAgXCJQZXJmZWl0byEgVm9jw6ogbGV2b3UgYXBlbmFzIHVtYSB0ZW50YXRpdmEgcGFyYSByZXNvbHZlci4gQm9tIHRyYWJhbGhvIVwiLFxuICAgICAgICBtc2dfcGFyc29uX2NvcnJlY3Q6XG4gICAgICAgICAgICBcIlBlcmZlaXRvISBWb2PDqiBsZXZvdSAkMSB0ZW50YXRpdmFzIHBhcmEgcmVzb2x2ZXIuIENsaXF1ZSBlbSBSZXNldGFyIHBhcmEgdGVudGFyIHJlc29sdmVyIGVtIHVtYSB0ZW50YXRpdmEuXCIgLFxuICAgICAgICBtc2dfcGFyc29uX3dyb25nX2luZGVudDpcbiAgICAgICAgICAgIFwiRXN0ZSBibG9jbyBuw6NvIGVzdMOhIGluZGVudGFkbyBjb3JyZXRhbWVudGUuIEluZGVudGUgbWFpcyBhcnJhc3RhbmRvLW8gcGFyYSBhIGRpcmVpdGEgb3UgcmVkdXphIGEgaW5kZW50YcOnw6NvIGFycmFzdGFuZG8gcGFyYSBhIGVzcXVlcmRhLlwiLFxuICAgICAgICBtc2dfcGFyc29uX3dyb25nX2luZGVudHM6XG4gICAgICAgICAgICBcIkVzdGVzIGJsb2NvcyBuw6NvIGVzdMOjbyBpbmRlbnRhZG9zIGNvcnJldGFtZW50ZS4gUGFyYSBpbmRlbnRhciBtYWlzLCBhcnJhc3RlIG8gYmxvY28gcGFyYSBhIGRpcmVpdGEuIFBhcmEgcmVkdXppciBhIGluZGVudGHDp8OjbywgYXJyYXN0ZSBwYXJhIGEgZXNxdWVyZGEuXCIsXG4gICAgICAgIG1zZ19wYXJzb25fd3Jvbmdfb3JkZXI6XG4gICAgICAgICAgICBcIkJsb2NvcyBkZXN0YWNhZG9zIG5vIHNldSBwcm9ncmFtYSBlc3TDo28gZXJyYWRvcyBvdSBlc3TDo28gbmEgb3JkZW0gZXJyYWRhLiBJc3NvIHBvZGUgc2VyIHJlc29sdmlkbyBtb3ZlbmRvLCBleGNsdWluZG8gb3Ugc3Vic3RpdHVpbmRvIG9zIGJsb2NvcyBkZXN0YWNhZG9zLlwiLFxuICAgICAgICBtc2dfcGFyc29uX2Fycm93X25hdmlnYXRlOlxuICAgICAgICAgICAgXCJVc2UgYXMgdGVjbGFzIGRlIHNldGFzIHBhcmEgbmF2ZWdhci4gRXNwYcOnbyBwYXJhIHNlbGVjaW9uYXIvIGRlc21hcmNhciBibG9jb3MgcGFyYSBtb3Zlci5cIixcbiAgICAgICAgbXNnX3BhcnNvbl9oZWxwX2luZm86XG4gICAgICAgICAgICBcIkNsaXF1ZSBubyBib3TDo28gQWp1ZGEgc2Ugdm9jw6ogcXVpc2VyIGZhY2lsaXRhciBvIHByb2JsZW1hXCIsXG4gICAgICAgIG1zZ19wYXJzb25fbm90X3NvbHV0aW9uOlxuICAgICAgICAgICAgXCJGb2kgZGVzYWJpbGl0YWRvIHVtIGJsb2NvIGRlIGPDs2RpZ28gZGVzbmVjZXNzw6FyaW8gKHF1ZSBuw6NvIGZheiBwYXJ0ZSBkYSBzb2x1w6fDo28pLlwiLFxuICAgICAgICBtc2dfcGFyc29uX3Byb3ZpZGVkX2luZGVudDpcIkZvaSBmb3JuZWNpZGEgYSBpbmRlbnRhw6fDo28uXCIsXG4gICAgICAgIG1zZ19wYXJzb25fY29tYmluZWRfYmxvY2tzOlwiRG9pcyBibG9jb3MgZGUgY8OzZGlnb3MgZm9yYW0gY29tYmluYWRvcyBlbSB1bS5cIixcbiAgICAgICAgbXNnX3BhcnNvbl9yZW1vdmVfaW5jb3JyZWN0OlxuICAgICAgICAgICAgXCJTZXLDoSByZW1vdmlkbyB1bSBibG9jbyBkZSBjw7NkaWdvIGluY29ycmV0byBkYSDDoXJlYSBkZSByZXNwb3N0YVwiLFxuICAgICAgICBtc2dfcGFyc29uX3dpbGxfY29tYmluZTpcIlNlcsOjbyBjb21iaW5hZG9zIGRvaXMgYmxvY29zXCIsXG4gICAgICAgIG1zZ19wYXJzb25fYXRsZWFzdF90aHJlZV9hdHRlbXB0czpcbiAgICAgICAgICAgIFwiVm9jw6ogZGV2ZSB0ZW50YXIgcGVsbyBtZW5vcyB0csOqcyB2ZXplcyBhbnRlcyBkZSBwZWRpciBhanVkYVwiLFxuICAgICAgICBtc2dfcGFyc29uX3RocmVlX2Jsb2Nrc19sZWZ0OlxuICAgICAgICAgICAgXCJSZXN0YW0gYXBlbmFzIDMgYmxvY29zIGNvcnJldG9zLiBWb2PDqiBkZXZlIGNvbG9jw6EtbG9zIGVtIG9yZGVtXCIsXG4gICAgICAgIG1zZ19wYXJzb25fd2lsbF9wcm92aWRlX2luZGVudDogXCJTZXLDoSBmb3JuZWNpZGEgYSBpbmRlbnRhw6fDo29cIlxuICAgIH0sXG59KTtcbiIsImltcG9ydCB7IGxvYWQgfSBmcm9tIFwiLi4vLi4vY29tbW9uL2pzL3JzaTE4bi5qc1wiO1xuXG5sb2FkKHtcbiAgICBlbjoge1xuICAgICAgICBtc2dfcGFyc29uX2NoZWNrX21lOiBcIkNoZWNrXCIsXG4gICAgICAgIG1zZ19wYXJzb25fcmVzZXQ6IFwiUmVzZXRcIixcbiAgICAgICAgbXNnX3BhcnNvbl9oZWxwOiBcIkhlbHAgbWVcIixcbiAgICAgICAgbXNnX3BhcnNvbl90b29fc2hvcnQ6IFwiWW91ciBhbnN3ZXIgaXMgdG9vIHNob3J0LiBBZGQgbW9yZSBibG9ja3MuXCIsXG4gICAgICAgIG1zZ19wYXJzb25fZHJhZ19mcm9tX2hlcmU6IFwiRHJhZyBmcm9tIGhlcmVcIixcbiAgICAgICAgbXNnX3BhcnNvbl9kcmFnX3RvX2hlcmU6IFwiRHJvcCBibG9ja3MgaGVyZVwiLFxuICAgICAgICBtc2dfcGFyc29uX2VudGVyX2FjdGl2YXRlOiBcIkVudGVyIHRvIGFjdGl2YXRlXCIsXG4gICAgICAgIG1zZ19wYXJzb25fa2V5Ym9hcmRfZW50cnlfbGFiZWw6XG4gICAgICAgICAgICBcIlBhcnNvbnMgcHJvYmxlbS4gUHJlc3MgRW50ZXIgb3IgU3BhY2UgdG8gYXJyYW5nZSBibG9ja3MuXCIsXG4gICAgICAgIG1zZ19wYXJzb25fa2V5Ym9hcmRfaW5zdHJ1Y3Rpb25zOlxuICAgICAgICAgICAgXCJVc2UgYXJyb3cga2V5cyB0byBuYXZpZ2F0ZSBibG9ja3MsIHRoZW4gRW50ZXIgb3IgU3BhY2UgdG8gbW92ZSBpdC5cIixcbiAgICAgICAgbXNnX3BhcnNvbl9rZXlib2FyZF9zZWxlY3RlZDogXCJTZWxlY3RlZCAkMVwiLFxuICAgICAgICBtc2dfcGFyc29uX2luY29ycmVjdDogXCJJbmNvcnJlY3RcIixcbiAgICAgICAgbXNnX3BhcnNvbl9ibG9jazogXCJibG9ja1wiLFxuICAgICAgICBtc2dfcGFyc29uX2tleWJvYXJkX3VucGxhY2VkX3Bvc2l0aW9uOlxuICAgICAgICAgICAgXCJJbiB0aGUgdW5wbGFjZWQgbGlzdCwgcG9zaXRpb24gJDEgb2YgJDJcIixcbiAgICAgICAgbXNnX3BhcnNvbl9rZXlib2FyZF9hbnN3ZXJfcG9zaXRpb246XG4gICAgICAgICAgICBcIkluIHRoZSBhbnN3ZXIgYXJlYSwgcG9zaXRpb24gJDEgb2YgJDJcIixcbiAgICAgICAgbXNnX3BhcnNvbl9rZXlib2FyZF90YWJfaW46IFwiJDEgdGFiIGluXCIsXG4gICAgICAgIG1zZ19wYXJzb25fa2V5Ym9hcmRfdGFic19pbjogXCIkMSB0YWJzIGluXCIsXG4gICAgICAgIG1zZ19wYXJzb25fa2V5Ym9hcmRfb3B0aW9uczogXCIkMSBvZiAkMiBvcHRpb25zXCIsXG4gICAgICAgIG1zZ19wYXJzb25fY29ycmVjdF9maXJzdF90cnk6XG4gICAgICAgICAgICBcIlBlcmZlY3QhICBJdCB0b29rIHlvdSBvbmx5IG9uZSB0cnkgdG8gc29sdmUgdGhpcy4gIEdyZWF0IGpvYiFcIixcbiAgICAgICAgbXNnX3BhcnNvbl9jb3JyZWN0OlxuICAgICAgICAgICAgXCJQZXJmZWN0ISAgSXQgdG9vayB5b3UgJDEgdHJpZXMgdG8gc29sdmUgdGhpcy4gIENsaWNrIFJlc2V0IHRvIHRyeSB0byBzb2x2ZSBpdCBpbiBvbmUgYXR0ZW1wdC5cIixcbiAgICAgICAgbXNnX3BhcnNvbl9jb3JyZWN0X3J1bm5hYmxlOlxuICAgICAgICAgICAgXCJDbGljayBSdW4gYmVsb3cgdG8gdGVzdCBvdXQgeW91ciBzb2x1dGlvbi5cIixcbiAgICAgICAgbXNnX3BhcnNvbl93cm9uZ19pbmRlbnQ6XG4gICAgICAgICAgICBcIlRoaXMgYmxvY2sgaXMgbm90IGluZGVudGVkIGNvcnJlY3RseS4gRWl0aGVyIGluZGVudCBpdCBtb3JlIGJ5IGRyYWdnaW5nIGl0IHJpZ2h0IG9yIHJlZHVjZSB0aGUgaW5kZW50aW9uIGJ5IGRyYWdnaW5nIGl0IGxlZnQuXCIsXG4gICAgICAgIG1zZ19wYXJzb25fd3JvbmdfaW5kZW50czpcbiAgICAgICAgICAgIFwiVGhlc2UgYmxvY2tzIGFyZSBub3QgaW5kZW50ZWQgY29ycmVjdGx5LiBUbyBpbmRlbnQgYSBibG9jayBtb3JlLCBkcmFnIGl0IHRvIHRoZSByaWdodC4gVG8gcmVkdWNlIHRoZSBpbmRlbnRpb24sIGRyYWcgaXQgdG8gdGhlIGxlZnQuXCIsXG4gICAgICAgIG1zZ19wYXJzb25fd3Jvbmdfb3JkZXI6XG4gICAgICAgICAgICBcIkhpZ2hsaWdodGVkIGJsb2NrcyBpbiB5b3VyIGFuc3dlciBhcmUgd3Jvbmcgb3IgYXJlIGluIHRoZSB3cm9uZyBvcmRlci4gVGhpcyBjYW4gYmUgZml4ZWQgYnkgbW92aW5nLCByZW1vdmluZywgb3IgcmVwbGFjaW5nIGhpZ2hsaWdodGVkIGJsb2Nrcy5cIixcbiAgICAgICAgbXNnX3BhcnNvbl9hcnJvd19uYXZpZ2F0ZTpcbiAgICAgICAgICAgIFwiQXJyb3cga2V5cyB0byBuYXZpZ2F0ZS4gU3BhY2UgdG8gc2VsZWN0IC8gZGVzZWxlY3QgYmxvY2sgdG8gbW92ZS5cIixcbiAgICAgICAgbXNnX3BhcnNvbl9oZWxwX2luZm86XG4gICAgICAgICAgICBcIkNsaWNrIG9uIHRoZSBIZWxwIE1lIGJ1dHRvbiBpZiB5b3Ugd2FudCB0byBtYWtlIHRoZSBwcm9ibGVtIGVhc2llclwiLFxuICAgICAgICBtc2dfcGFyc29uX25vdF9zb2x1dGlvbjpcbiAgICAgICAgICAgIFwiRGlzYWJsZWQgYW4gdW5uZWVkZWQgY29kZSBibG9jayAob25lIHRoYXQgaXMgbm90IHBhcnQgb2YgdGhlIHNvbHV0aW9uKS5cIixcbiAgICAgICAgbXNnX3BhcnNvbl9wcm92aWRlZF9pbmRlbnQ6IFwiUHJvdmlkZWQgdGhlIGluZGVudGF0aW9uLlwiLFxuICAgICAgICBtc2dfcGFyc29uX2NvbWJpbmVkX2Jsb2NrczogXCJDb21iaW5lZCB0d28gY29kZSBibG9ja3MgaW50byBvbmUuXCIsXG4gICAgICAgIG1zZ19wYXJzb25fcmVtb3ZlX2luY29ycmVjdDpcbiAgICAgICAgICAgIFwiV2lsbCByZW1vdmUgYW4gaW5jb3JyZWN0IGNvZGUgYmxvY2sgZnJvbSBhbnN3ZXIgYXJlYVwiLFxuICAgICAgICBtc2dfcGFyc29uX3dpbGxfY29tYmluZTogXCJXaWxsIGNvbWJpbmUgdHdvIGJsb2Nrc1wiLFxuICAgICAgICBtc2dfcGFyc29uX2F0bGVhc3RfdGhyZWVfYXR0ZW1wdHM6XG4gICAgICAgICAgICBcIllvdSBtdXN0IG1ha2UgYXQgbGVhc3QgdGhyZWUgZGlzdGluY3QgZnVsbCBhdHRlbXB0cyBhdCBhIHNvbHV0aW9uIGJlZm9yZSB5b3UgY2FuIGdldCBoZWxwXCIsXG4gICAgICAgIG1zZ19wYXJzb25fdGhyZWVfYmxvY2tzX2xlZnQ6XG4gICAgICAgICAgICBcIlRoZXJlIGFyZSBvbmx5IDMgY29ycmVjdCBibG9ja3MgbGVmdC4gIFlvdSBzaG91bGQgYmUgYWJsZSB0byBwdXQgdGhlbSBpbiBvcmRlclwiLFxuICAgICAgICBtc2dfcGFyc29uX3dpbGxfcHJvdmlkZV9pbmRlbnQ6IFwiV2lsbCBwcm92aWRlIGluZGVudGF0aW9uXCIsXG4gICAgfSxcbn0pO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9