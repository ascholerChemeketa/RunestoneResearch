"use strict";
(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_tabbedStuff_js_tabbedstuff_js"],{

/***/ 3735:
/*!***************************************************!*\
  !*** ./runestone/tabbedStuff/css/tabbedstuff.css ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 76442:
/*!*************************************************!*\
  !*** ./runestone/tabbedStuff/js/tabbedstuff.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TabbedStuff: () => (/* binding */ TabbedStuff)
/* harmony export */ });
/* harmony import */ var _common_js_runestonebase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/runestonebase */ 78673);
/* harmony import */ var _css_tabbedstuff_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../css/tabbedstuff.css */ 3735);
/*==========================================
=======    Master tabbedstuff.js    ========
============================================
===     This file contains the JS for    ===
=== the Runestone tabbedStuff component. ===
============================================
===              Created by              ===
===           Isaiah Mayerchak           ===
===               06/15/15               ===
===             Brad Miller              ===
===               06/15/15               ===
==========================================*/


var TSList = {}; // Dictionary that contains all instances of TabbedStuff objects




// Define TabbedStuff object
class TabbedStuff extends _common_js_runestonebase__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(opts) {
        super(opts);
        var orig = opts.orig;
        this.origElem = orig; // entire original <div> element that will be replaced by new HTML
        this.divid = orig.id;
        this.inactive = orig.hasAttribute("data-inactive");
        this.togglesList = []; // For use in Codemirror/Disqus
        this.childTabs = [];
        this.populateChildTabs();
        this.activeTab = 0; // default value--activeTab is the index of the tab that starts open
        this.findActiveTab();
        this.createTabContainer();
        this.indicate_component_ready();
    }
    /*===========================================
    == Update attributes of instance variables ==
    ==    variables according to specifications    ==
    ===========================================*/
    populateChildTabs() {
        for (var i = 0; i < this.origElem.childNodes.length; i++) {
            const node = this.origElem.childNodes[i];
            if (
                node.nodeType === Node.ELEMENT_NODE &&
                node.dataset.component === "tab"
            ) {
                this.childTabs.push(node);
            }
        }
    }
    findActiveTab() {
        for (var i = 0; i < this.childTabs.length; i++) {
            if (this.childTabs[i].hasAttribute("data-active")) {
                this.activeTab = i;
            }
        }
    }
    /*==========================================
    == Creating/appending final HTML elements ==
    ==========================================*/
    createTabContainer() {
        this.containerDiv = document.createElement("div");
        this.containerDiv.id = this.divid;
        const origClass = this.origElem.getAttribute("class");
        if (origClass) {
            this.containerDiv.classList.add(
                ...origClass.split(" ").filter(Boolean),
            );
        }
        // Hook for this component's stylesheet -- the tab layout used to be
        // Bootstrap's, so it has to be scoped to something we control now.
        this.containerDiv.classList.add("runestone-tabs");
        this.containerDiv.setAttribute("role", "tabpanel");
        this.tabsUL = document.createElement("ul");
        this.tabsUL.id = this.divid + "_tab";
        this.tabsUL.classList.add("nav", "nav-tabs");
        this.tabsUL.setAttribute("role", "tablist");
        this.tabContentDiv = document.createElement("div"); // Create tab content container that holds tab panes w/content
        this.tabContentDiv.classList.add("tab-content");
        this.createTabs(); // create and append tabs to the <ul>
        this.containerDiv.appendChild(this.tabsUL);
        this.containerDiv.appendChild(this.tabContentDiv);
        this.origElem.replaceWith(this.containerDiv);
    }
    createTabs() {
        // Create tabs in format <li><a><span></span></a></li> to be appended to the <ul>
        for (var i = 0; i < this.childTabs.length; i++) {
            // First create tabname and tabfriendly name that has no spaces to be used for the id
            var tabListElement = document.createElement("li");
            tabListElement.setAttribute("role", "presentation");
            tabListElement.setAttribute("aria-controls", this.divid + "-" + i);
            var tabElement = document.createElement("a");
            tabElement.setAttribute("href", "#" + this.divid + "-" + i);
            tabElement.setAttribute("role", "tab");
            tabElement.addEventListener("click", this.handleTabClick(i));
            var tabTitle = document.createElement("span"); // Title of tab--what the user will see
            tabTitle.textContent = this.childTabs[i].dataset.tabname;
            tabElement.appendChild(tabTitle);
            tabListElement.appendChild(tabElement);
            this.tabsUL.appendChild(tabListElement);
            // tabPane is what holds the contents of the tab
            var tabPaneDiv = document.createElement("div");
            tabPaneDiv.id = this.divid + "-" + i;
            tabPaneDiv.classList.add("tab-pane");
            tabPaneDiv.setAttribute("role", "tabpanel");
            tabPaneDiv.appendChild(this.childTabs[i]);
            if (!this.inactive) {
                if (this.activeTab === i) {
                    tabListElement.classList.add("active");
                    tabPaneDiv.classList.add("active");
                }
            }
            this.togglesList.push(tabElement);
            this.tabContentDiv.appendChild(tabPaneDiv);
        }
    }
    /*=====================================================
    == Tab switching (was Bootstrap 3's jQuery tab plugin) ==
    =====================================================*/
    handleTabClick(index) {
        return (event) => {
            event.preventDefault();
            this.showTab(index);
        };
    }
    showTab(index) {
        for (const li of this.tabsUL.children) {
            li.classList.remove("active");
        }
        for (const pane of this.tabContentDiv.children) {
            pane.classList.remove("active");
        }
        this.tabsUL.children[index].classList.add("active");
        const pane = this.tabContentDiv.children[index];
        pane.classList.add("active");
        // Anything that was rendered while the pane was hidden may need a
        // nudge now that it is visible (was the shown.bs.tab handler).
        for (const link of pane.querySelectorAll(".disqus_thread_link")) {
            link.click();
        }
        for (const el of pane.querySelectorAll(".CodeMirror")) {
            el.CodeMirror.refresh();
        }
    }
}

/*=================================
== Find the custom HTML tags and ==
==     execute our code on them        ==
=================================*/
function initTabbedStuff() {
    for (const element of document.querySelectorAll(
        "[data-component=tabbedStuff]",
    )) {
        TSList[element.id] = new TabbedStuff({ orig: element });
    }
}
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTabbedStuff);
} else {
    initTabbedStuff();
}


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuZXN0b25lX3RhYmJlZFN0dWZmX2pzX3RhYmJlZHN0dWZmX2pzLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDYTs7QUFFYixpQkFBaUI7O0FBRXlDO0FBQzFCOztBQUVoQztBQUNPLDBCQUEwQixnRUFBYTtBQUM5QztBQUNBO0FBQ0E7QUFDQSw4QkFBOEI7QUFDOUI7QUFDQTtBQUNBLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0EsNEJBQTRCO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixxQ0FBcUM7QUFDN0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsMkJBQTJCO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNERBQTREO0FBQzVEO0FBQ0EsMkJBQTJCO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QiwyQkFBMkI7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJEQUEyRDtBQUMzRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0NBQStDLGVBQWU7QUFDOUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvdGFiYmVkU3R1ZmYvY3NzL3RhYmJlZHN0dWZmLmNzcz8yZmQ1Iiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvdGFiYmVkU3R1ZmYvanMvdGFiYmVkc3R1ZmYuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09PT09PT0gICAgTWFzdGVyIHRhYmJlZHN0dWZmLmpzICAgID09PT09PT09XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT09ICAgICBUaGlzIGZpbGUgY29udGFpbnMgdGhlIEpTIGZvciAgICA9PT1cbj09PSB0aGUgUnVuZXN0b25lIHRhYmJlZFN0dWZmIGNvbXBvbmVudC4gPT09XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT09ICAgICAgICAgICAgICBDcmVhdGVkIGJ5ICAgICAgICAgICAgICA9PT1cbj09PSAgICAgICAgICAgSXNhaWFoIE1heWVyY2hhayAgICAgICAgICAgPT09XG49PT0gICAgICAgICAgICAgICAwNi8xNS8xNSAgICAgICAgICAgICAgID09PVxuPT09ICAgICAgICAgICAgIEJyYWQgTWlsbGVyICAgICAgICAgICAgICA9PT1cbj09PSAgICAgICAgICAgICAgIDA2LzE1LzE1ICAgICAgICAgICAgICAgPT09XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBUU0xpc3QgPSB7fTsgLy8gRGljdGlvbmFyeSB0aGF0IGNvbnRhaW5zIGFsbCBpbnN0YW5jZXMgb2YgVGFiYmVkU3R1ZmYgb2JqZWN0c1xuXG5pbXBvcnQgUnVuZXN0b25lQmFzZSBmcm9tIFwiLi4vLi4vY29tbW9uL2pzL3J1bmVzdG9uZWJhc2VcIjtcbmltcG9ydCBcIi4uL2Nzcy90YWJiZWRzdHVmZi5jc3NcIjtcblxuLy8gRGVmaW5lIFRhYmJlZFN0dWZmIG9iamVjdFxuZXhwb3J0IGNsYXNzIFRhYmJlZFN0dWZmIGV4dGVuZHMgUnVuZXN0b25lQmFzZSB7XG4gICAgY29uc3RydWN0b3Iob3B0cykge1xuICAgICAgICBzdXBlcihvcHRzKTtcbiAgICAgICAgdmFyIG9yaWcgPSBvcHRzLm9yaWc7XG4gICAgICAgIHRoaXMub3JpZ0VsZW0gPSBvcmlnOyAvLyBlbnRpcmUgb3JpZ2luYWwgPGRpdj4gZWxlbWVudCB0aGF0IHdpbGwgYmUgcmVwbGFjZWQgYnkgbmV3IEhUTUxcbiAgICAgICAgdGhpcy5kaXZpZCA9IG9yaWcuaWQ7XG4gICAgICAgIHRoaXMuaW5hY3RpdmUgPSBvcmlnLmhhc0F0dHJpYnV0ZShcImRhdGEtaW5hY3RpdmVcIik7XG4gICAgICAgIHRoaXMudG9nZ2xlc0xpc3QgPSBbXTsgLy8gRm9yIHVzZSBpbiBDb2RlbWlycm9yL0Rpc3F1c1xuICAgICAgICB0aGlzLmNoaWxkVGFicyA9IFtdO1xuICAgICAgICB0aGlzLnBvcHVsYXRlQ2hpbGRUYWJzKCk7XG4gICAgICAgIHRoaXMuYWN0aXZlVGFiID0gMDsgLy8gZGVmYXVsdCB2YWx1ZS0tYWN0aXZlVGFiIGlzIHRoZSBpbmRleCBvZiB0aGUgdGFiIHRoYXQgc3RhcnRzIG9wZW5cbiAgICAgICAgdGhpcy5maW5kQWN0aXZlVGFiKCk7XG4gICAgICAgIHRoaXMuY3JlYXRlVGFiQ29udGFpbmVyKCk7XG4gICAgICAgIHRoaXMuaW5kaWNhdGVfY29tcG9uZW50X3JlYWR5KCk7XG4gICAgfVxuICAgIC8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09IFVwZGF0ZSBhdHRyaWJ1dGVzIG9mIGluc3RhbmNlIHZhcmlhYmxlcyA9PVxuICAgID09ICAgIHZhcmlhYmxlcyBhY2NvcmRpbmcgdG8gc3BlY2lmaWNhdGlvbnMgICAgPT1cbiAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbiAgICBwb3B1bGF0ZUNoaWxkVGFicygpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm9yaWdFbGVtLmNoaWxkTm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLm9yaWdFbGVtLmNoaWxkTm9kZXNbaV07XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgbm9kZS5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREUgJiZcbiAgICAgICAgICAgICAgICBub2RlLmRhdGFzZXQuY29tcG9uZW50ID09PSBcInRhYlwiXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNoaWxkVGFicy5wdXNoKG5vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGZpbmRBY3RpdmVUYWIoKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jaGlsZFRhYnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNoaWxkVGFic1tpXS5oYXNBdHRyaWJ1dGUoXCJkYXRhLWFjdGl2ZVwiKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuYWN0aXZlVGFiID0gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09IENyZWF0aW5nL2FwcGVuZGluZyBmaW5hbCBIVE1MIGVsZW1lbnRzID09XG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbiAgICBjcmVhdGVUYWJDb250YWluZXIoKSB7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYuaWQgPSB0aGlzLmRpdmlkO1xuICAgICAgICBjb25zdCBvcmlnQ2xhc3MgPSB0aGlzLm9yaWdFbGVtLmdldEF0dHJpYnV0ZShcImNsYXNzXCIpO1xuICAgICAgICBpZiAob3JpZ0NsYXNzKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5jbGFzc0xpc3QuYWRkKFxuICAgICAgICAgICAgICAgIC4uLm9yaWdDbGFzcy5zcGxpdChcIiBcIikuZmlsdGVyKEJvb2xlYW4pLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBIb29rIGZvciB0aGlzIGNvbXBvbmVudCdzIHN0eWxlc2hlZXQgLS0gdGhlIHRhYiBsYXlvdXQgdXNlZCB0byBiZVxuICAgICAgICAvLyBCb290c3RyYXAncywgc28gaXQgaGFzIHRvIGJlIHNjb3BlZCB0byBzb21ldGhpbmcgd2UgY29udHJvbCBub3cuXG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmNsYXNzTGlzdC5hZGQoXCJydW5lc3RvbmUtdGFic1wiKTtcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYuc2V0QXR0cmlidXRlKFwicm9sZVwiLCBcInRhYnBhbmVsXCIpO1xuICAgICAgICB0aGlzLnRhYnNVTCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ1bFwiKTtcbiAgICAgICAgdGhpcy50YWJzVUwuaWQgPSB0aGlzLmRpdmlkICsgXCJfdGFiXCI7XG4gICAgICAgIHRoaXMudGFic1VMLmNsYXNzTGlzdC5hZGQoXCJuYXZcIiwgXCJuYXYtdGFic1wiKTtcbiAgICAgICAgdGhpcy50YWJzVUwuc2V0QXR0cmlidXRlKFwicm9sZVwiLCBcInRhYmxpc3RcIik7XG4gICAgICAgIHRoaXMudGFiQ29udGVudERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7IC8vIENyZWF0ZSB0YWIgY29udGVudCBjb250YWluZXIgdGhhdCBob2xkcyB0YWIgcGFuZXMgdy9jb250ZW50XG4gICAgICAgIHRoaXMudGFiQ29udGVudERpdi5jbGFzc0xpc3QuYWRkKFwidGFiLWNvbnRlbnRcIik7XG4gICAgICAgIHRoaXMuY3JlYXRlVGFicygpOyAvLyBjcmVhdGUgYW5kIGFwcGVuZCB0YWJzIHRvIHRoZSA8dWw+XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmFwcGVuZENoaWxkKHRoaXMudGFic1VMKTtcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYuYXBwZW5kQ2hpbGQodGhpcy50YWJDb250ZW50RGl2KTtcbiAgICAgICAgdGhpcy5vcmlnRWxlbS5yZXBsYWNlV2l0aCh0aGlzLmNvbnRhaW5lckRpdik7XG4gICAgfVxuICAgIGNyZWF0ZVRhYnMoKSB7XG4gICAgICAgIC8vIENyZWF0ZSB0YWJzIGluIGZvcm1hdCA8bGk+PGE+PHNwYW4+PC9zcGFuPjwvYT48L2xpPiB0byBiZSBhcHBlbmRlZCB0byB0aGUgPHVsPlxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY2hpbGRUYWJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAvLyBGaXJzdCBjcmVhdGUgdGFibmFtZSBhbmQgdGFiZnJpZW5kbHkgbmFtZSB0aGF0IGhhcyBubyBzcGFjZXMgdG8gYmUgdXNlZCBmb3IgdGhlIGlkXG4gICAgICAgICAgICB2YXIgdGFiTGlzdEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlcIik7XG4gICAgICAgICAgICB0YWJMaXN0RWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJyb2xlXCIsIFwicHJlc2VudGF0aW9uXCIpO1xuICAgICAgICAgICAgdGFiTGlzdEVsZW1lbnQuc2V0QXR0cmlidXRlKFwiYXJpYS1jb250cm9sc1wiLCB0aGlzLmRpdmlkICsgXCItXCIgKyBpKTtcbiAgICAgICAgICAgIHZhciB0YWJFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XG4gICAgICAgICAgICB0YWJFbGVtZW50LnNldEF0dHJpYnV0ZShcImhyZWZcIiwgXCIjXCIgKyB0aGlzLmRpdmlkICsgXCItXCIgKyBpKTtcbiAgICAgICAgICAgIHRhYkVsZW1lbnQuc2V0QXR0cmlidXRlKFwicm9sZVwiLCBcInRhYlwiKTtcbiAgICAgICAgICAgIHRhYkVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuaGFuZGxlVGFiQ2xpY2soaSkpO1xuICAgICAgICAgICAgdmFyIHRhYlRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7IC8vIFRpdGxlIG9mIHRhYi0td2hhdCB0aGUgdXNlciB3aWxsIHNlZVxuICAgICAgICAgICAgdGFiVGl0bGUudGV4dENvbnRlbnQgPSB0aGlzLmNoaWxkVGFic1tpXS5kYXRhc2V0LnRhYm5hbWU7XG4gICAgICAgICAgICB0YWJFbGVtZW50LmFwcGVuZENoaWxkKHRhYlRpdGxlKTtcbiAgICAgICAgICAgIHRhYkxpc3RFbGVtZW50LmFwcGVuZENoaWxkKHRhYkVsZW1lbnQpO1xuICAgICAgICAgICAgdGhpcy50YWJzVUwuYXBwZW5kQ2hpbGQodGFiTGlzdEVsZW1lbnQpO1xuICAgICAgICAgICAgLy8gdGFiUGFuZSBpcyB3aGF0IGhvbGRzIHRoZSBjb250ZW50cyBvZiB0aGUgdGFiXG4gICAgICAgICAgICB2YXIgdGFiUGFuZURpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICB0YWJQYW5lRGl2LmlkID0gdGhpcy5kaXZpZCArIFwiLVwiICsgaTtcbiAgICAgICAgICAgIHRhYlBhbmVEaXYuY2xhc3NMaXN0LmFkZChcInRhYi1wYW5lXCIpO1xuICAgICAgICAgICAgdGFiUGFuZURpdi5zZXRBdHRyaWJ1dGUoXCJyb2xlXCIsIFwidGFicGFuZWxcIik7XG4gICAgICAgICAgICB0YWJQYW5lRGl2LmFwcGVuZENoaWxkKHRoaXMuY2hpbGRUYWJzW2ldKTtcbiAgICAgICAgICAgIGlmICghdGhpcy5pbmFjdGl2ZSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmFjdGl2ZVRhYiA9PT0gaSkge1xuICAgICAgICAgICAgICAgICAgICB0YWJMaXN0RWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xuICAgICAgICAgICAgICAgICAgICB0YWJQYW5lRGl2LmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy50b2dnbGVzTGlzdC5wdXNoKHRhYkVsZW1lbnQpO1xuICAgICAgICAgICAgdGhpcy50YWJDb250ZW50RGl2LmFwcGVuZENoaWxkKHRhYlBhbmVEaXYpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICA9PSBUYWIgc3dpdGNoaW5nICh3YXMgQm9vdHN0cmFwIDMncyBqUXVlcnkgdGFiIHBsdWdpbikgPT1cbiAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG4gICAgaGFuZGxlVGFiQ2xpY2soaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIChldmVudCkgPT4ge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMuc2hvd1RhYihpbmRleCk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIHNob3dUYWIoaW5kZXgpIHtcbiAgICAgICAgZm9yIChjb25zdCBsaSBvZiB0aGlzLnRhYnNVTC5jaGlsZHJlbikge1xuICAgICAgICAgICAgbGkuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IHBhbmUgb2YgdGhpcy50YWJDb250ZW50RGl2LmNoaWxkcmVuKSB7XG4gICAgICAgICAgICBwYW5lLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50YWJzVUwuY2hpbGRyZW5baW5kZXhdLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XG4gICAgICAgIGNvbnN0IHBhbmUgPSB0aGlzLnRhYkNvbnRlbnREaXYuY2hpbGRyZW5baW5kZXhdO1xuICAgICAgICBwYW5lLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XG4gICAgICAgIC8vIEFueXRoaW5nIHRoYXQgd2FzIHJlbmRlcmVkIHdoaWxlIHRoZSBwYW5lIHdhcyBoaWRkZW4gbWF5IG5lZWQgYVxuICAgICAgICAvLyBudWRnZSBub3cgdGhhdCBpdCBpcyB2aXNpYmxlICh3YXMgdGhlIHNob3duLmJzLnRhYiBoYW5kbGVyKS5cbiAgICAgICAgZm9yIChjb25zdCBsaW5rIG9mIHBhbmUucXVlcnlTZWxlY3RvckFsbChcIi5kaXNxdXNfdGhyZWFkX2xpbmtcIikpIHtcbiAgICAgICAgICAgIGxpbmsuY2xpY2soKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IGVsIG9mIHBhbmUucXVlcnlTZWxlY3RvckFsbChcIi5Db2RlTWlycm9yXCIpKSB7XG4gICAgICAgICAgICBlbC5Db2RlTWlycm9yLnJlZnJlc2goKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09IEZpbmQgdGhlIGN1c3RvbSBIVE1MIHRhZ3MgYW5kID09XG49PSAgICAgZXhlY3V0ZSBvdXIgY29kZSBvbiB0aGVtICAgICAgICA9PVxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbmZ1bmN0aW9uIGluaXRUYWJiZWRTdHVmZigpIHtcbiAgICBmb3IgKGNvbnN0IGVsZW1lbnQgb2YgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcbiAgICAgICAgXCJbZGF0YS1jb21wb25lbnQ9dGFiYmVkU3R1ZmZdXCIsXG4gICAgKSkge1xuICAgICAgICBUU0xpc3RbZWxlbWVudC5pZF0gPSBuZXcgVGFiYmVkU3R1ZmYoeyBvcmlnOiBlbGVtZW50IH0pO1xuICAgIH1cbn1cbmlmIChkb2N1bWVudC5yZWFkeVN0YXRlID09PSBcImxvYWRpbmdcIikge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGluaXRUYWJiZWRTdHVmZik7XG59IGVsc2Uge1xuICAgIGluaXRUYWJiZWRTdHVmZigpO1xufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9