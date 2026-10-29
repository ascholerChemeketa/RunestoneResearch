"use strict";
(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_datafile_js_datafile_js"],{

/***/ 20689:
/*!*********************************************!*\
  !*** ./runestone/datafile/css/datafile.css ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 33580:
/*!*******************************************!*\
  !*** ./runestone/datafile/js/datafile.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_js_runestonebase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/runestonebase */ 78673);
/* harmony import */ var _css_datafile_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../css/datafile.css */ 20689);
/*==========================================
=======     Master datafile.js      ========
============================================
===     This file contains the JS for    ===
===   the Runestone Datafile component.  ===
============================================
===              Created by              ===
===           Isaiah Mayerchak           ===
===                6/8/15                ===
==========================================*/





var dfList = {}; // Dictionary that contains all instances of Datafile objects

class DataFile extends _common_js_runestonebase__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(opts) {
        super(opts);
        var orig = opts.orig; // entire <pre> element that will be replaced by new HTML
        this.origElem = orig;
        this.divid = orig.id;
        this.dataEdit = this.parseBooleanAttribute(orig, "data-edit");
        this.isImage = this.parseBooleanAttribute(orig, "data-isimage");
        this.isBinary = this.parseBooleanAttribute(orig, "data-isbinary");
        this.fileName = orig.dataset.filename || null;
        this.displayClass = "block"; // Users can specify the non-edit component to be hidden--default is not hidden
        if (this.parseBooleanAttribute(orig, "data-hidden")) {
            this.displayClass = "none";
        }
        // Users can specify numbers of rows/columns when editing is true
        this.numberOfRows = orig.dataset.rows;
        this.numberOfCols = orig.dataset.cols;

        if (!this.isImage) {
            if (this.dataEdit) {
                this.createTextArea();
            } else {
                this.createPre();
            }
            if (this.fileName) {
                this.containerDiv.dataset.filename = this.fileName;
            }
        }
        // search for a parent div with the class 'datafile_caption' in plain javascript
        let captionDiv =
            this.containerDiv.parentElement?.querySelector(".datafile_caption");
        if (captionDiv && this.displayClass === "none") {
            // hide the captionDiv if the datafile is hidden
            captionDiv.style.display = "none";
        }
        this.indicate_component_ready();
    }
    /*=====================================
    == Create either <pre> or <textarea> ==
    ==  depending on if editing is true  ==
    ==================================*/
    createPre() {
        this.containerDiv = document.createElement("pre");
        this.containerDiv.id = this.divid;
        this.containerDiv.style.display = this.displayClass;
        this.containerDiv.innerHTML = this.origElem.innerHTML;
        this.copyDataAttributes();
        this.origElem.replaceWith(this.containerDiv);
    }
    createTextArea() {
        this.containerDiv = document.createElement("textarea");
        this.containerDiv.id = this.divid;
        if (this.numberOfRows) this.containerDiv.rows = this.numberOfRows;
        if (this.numberOfCols) this.containerDiv.cols = this.numberOfCols;
        this.containerDiv.innerHTML = this.origElem.innerHTML;
        this.containerDiv.classList.add("datafiletextfield");
        this.copyDataAttributes();
        this.origElem.replaceWith(this.containerDiv);
    }
    copyDataAttributes() {
        for (const attr of this.origElem.attributes) {
            if (attr.name.startsWith("data-")) {
                this.containerDiv.setAttribute(attr.name, attr.value);
            }
        }
    }
}

/*=================================
== Find the custom HTML tags and ==
==   execute our code on them    ==
=================================*/

document.addEventListener("runestone:login-complete", function () {
    document
        .querySelectorAll("[data-component=datafile]")
        .forEach(function (el) {
            try {
                dfList[el.id] = new DataFile({ orig: el });
            } catch (err) {
                console.log(`Error rendering DataFile ${el.id}`);
            }
        });
});

if (typeof window.component_factory === "undefined") {
    window.component_factory = {};
}

window.component_factory.datafile = function (opts) {
    return new DataFile(opts);
};


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuZXN0b25lX2RhdGFmaWxlX2pzX2RhdGFmaWxlX2pzLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNhOztBQUU2QztBQUM3Qjs7QUFFN0IsaUJBQWlCOztBQUVqQix1QkFBdUIsZ0VBQWE7QUFDcEM7QUFDQTtBQUNBLDhCQUE4QjtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUM7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtDQUErQyxVQUFVO0FBQ3pELGNBQWM7QUFDZCx3REFBd0QsTUFBTTtBQUM5RDtBQUNBLFNBQVM7QUFDVCxDQUFDOztBQUVEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2RhdGFmaWxlL2Nzcy9kYXRhZmlsZS5jc3M/NDBlYSIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2RhdGFmaWxlL2pzL2RhdGFmaWxlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PT09PT09ICAgICBNYXN0ZXIgZGF0YWZpbGUuanMgICAgICA9PT09PT09PVxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09PSAgICAgVGhpcyBmaWxlIGNvbnRhaW5zIHRoZSBKUyBmb3IgICAgPT09XG49PT0gICB0aGUgUnVuZXN0b25lIERhdGFmaWxlIGNvbXBvbmVudC4gID09PVxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09PSAgICAgICAgICAgICAgQ3JlYXRlZCBieSAgICAgICAgICAgICAgPT09XG49PT0gICAgICAgICAgIElzYWlhaCBNYXllcmNoYWsgICAgICAgICAgID09PVxuPT09ICAgICAgICAgICAgICAgIDYvOC8xNSAgICAgICAgICAgICAgICA9PT1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5cInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IFJ1bmVzdG9uZUJhc2UgZnJvbSBcIi4uLy4uL2NvbW1vbi9qcy9ydW5lc3RvbmViYXNlXCI7XG5pbXBvcnQgXCIuLi9jc3MvZGF0YWZpbGUuY3NzXCI7XG5cbnZhciBkZkxpc3QgPSB7fTsgLy8gRGljdGlvbmFyeSB0aGF0IGNvbnRhaW5zIGFsbCBpbnN0YW5jZXMgb2YgRGF0YWZpbGUgb2JqZWN0c1xuXG5jbGFzcyBEYXRhRmlsZSBleHRlbmRzIFJ1bmVzdG9uZUJhc2Uge1xuICAgIGNvbnN0cnVjdG9yKG9wdHMpIHtcbiAgICAgICAgc3VwZXIob3B0cyk7XG4gICAgICAgIHZhciBvcmlnID0gb3B0cy5vcmlnOyAvLyBlbnRpcmUgPHByZT4gZWxlbWVudCB0aGF0IHdpbGwgYmUgcmVwbGFjZWQgYnkgbmV3IEhUTUxcbiAgICAgICAgdGhpcy5vcmlnRWxlbSA9IG9yaWc7XG4gICAgICAgIHRoaXMuZGl2aWQgPSBvcmlnLmlkO1xuICAgICAgICB0aGlzLmRhdGFFZGl0ID0gdGhpcy5wYXJzZUJvb2xlYW5BdHRyaWJ1dGUob3JpZywgXCJkYXRhLWVkaXRcIik7XG4gICAgICAgIHRoaXMuaXNJbWFnZSA9IHRoaXMucGFyc2VCb29sZWFuQXR0cmlidXRlKG9yaWcsIFwiZGF0YS1pc2ltYWdlXCIpO1xuICAgICAgICB0aGlzLmlzQmluYXJ5ID0gdGhpcy5wYXJzZUJvb2xlYW5BdHRyaWJ1dGUob3JpZywgXCJkYXRhLWlzYmluYXJ5XCIpO1xuICAgICAgICB0aGlzLmZpbGVOYW1lID0gb3JpZy5kYXRhc2V0LmZpbGVuYW1lIHx8IG51bGw7XG4gICAgICAgIHRoaXMuZGlzcGxheUNsYXNzID0gXCJibG9ja1wiOyAvLyBVc2VycyBjYW4gc3BlY2lmeSB0aGUgbm9uLWVkaXQgY29tcG9uZW50IHRvIGJlIGhpZGRlbi0tZGVmYXVsdCBpcyBub3QgaGlkZGVuXG4gICAgICAgIGlmICh0aGlzLnBhcnNlQm9vbGVhbkF0dHJpYnV0ZShvcmlnLCBcImRhdGEtaGlkZGVuXCIpKSB7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXlDbGFzcyA9IFwibm9uZVwiO1xuICAgICAgICB9XG4gICAgICAgIC8vIFVzZXJzIGNhbiBzcGVjaWZ5IG51bWJlcnMgb2Ygcm93cy9jb2x1bW5zIHdoZW4gZWRpdGluZyBpcyB0cnVlXG4gICAgICAgIHRoaXMubnVtYmVyT2ZSb3dzID0gb3JpZy5kYXRhc2V0LnJvd3M7XG4gICAgICAgIHRoaXMubnVtYmVyT2ZDb2xzID0gb3JpZy5kYXRhc2V0LmNvbHM7XG5cbiAgICAgICAgaWYgKCF0aGlzLmlzSW1hZ2UpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmRhdGFFZGl0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVUZXh0QXJlYSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVByZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuZmlsZU5hbWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5kYXRhc2V0LmZpbGVuYW1lID0gdGhpcy5maWxlTmFtZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBzZWFyY2ggZm9yIGEgcGFyZW50IGRpdiB3aXRoIHRoZSBjbGFzcyAnZGF0YWZpbGVfY2FwdGlvbicgaW4gcGxhaW4gamF2YXNjcmlwdFxuICAgICAgICBsZXQgY2FwdGlvbkRpdiA9XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5wYXJlbnRFbGVtZW50Py5xdWVyeVNlbGVjdG9yKFwiLmRhdGFmaWxlX2NhcHRpb25cIik7XG4gICAgICAgIGlmIChjYXB0aW9uRGl2ICYmIHRoaXMuZGlzcGxheUNsYXNzID09PSBcIm5vbmVcIikge1xuICAgICAgICAgICAgLy8gaGlkZSB0aGUgY2FwdGlvbkRpdiBpZiB0aGUgZGF0YWZpbGUgaXMgaGlkZGVuXG4gICAgICAgICAgICBjYXB0aW9uRGl2LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmluZGljYXRlX2NvbXBvbmVudF9yZWFkeSgpO1xuICAgIH1cbiAgICAvKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICA9PSBDcmVhdGUgZWl0aGVyIDxwcmU+IG9yIDx0ZXh0YXJlYT4gPT1cbiAgICA9PSAgZGVwZW5kaW5nIG9uIGlmIGVkaXRpbmcgaXMgdHJ1ZSAgPT1cbiAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbiAgICBjcmVhdGVQcmUoKSB7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInByZVwiKTtcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYuaWQgPSB0aGlzLmRpdmlkO1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5zdHlsZS5kaXNwbGF5ID0gdGhpcy5kaXNwbGF5Q2xhc3M7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmlubmVySFRNTCA9IHRoaXMub3JpZ0VsZW0uaW5uZXJIVE1MO1xuICAgICAgICB0aGlzLmNvcHlEYXRhQXR0cmlidXRlcygpO1xuICAgICAgICB0aGlzLm9yaWdFbGVtLnJlcGxhY2VXaXRoKHRoaXMuY29udGFpbmVyRGl2KTtcbiAgICB9XG4gICAgY3JlYXRlVGV4dEFyZWEoKSB7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRleHRhcmVhXCIpO1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5pZCA9IHRoaXMuZGl2aWQ7XG4gICAgICAgIGlmICh0aGlzLm51bWJlck9mUm93cykgdGhpcy5jb250YWluZXJEaXYucm93cyA9IHRoaXMubnVtYmVyT2ZSb3dzO1xuICAgICAgICBpZiAodGhpcy5udW1iZXJPZkNvbHMpIHRoaXMuY29udGFpbmVyRGl2LmNvbHMgPSB0aGlzLm51bWJlck9mQ29scztcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYuaW5uZXJIVE1MID0gdGhpcy5vcmlnRWxlbS5pbm5lckhUTUw7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmNsYXNzTGlzdC5hZGQoXCJkYXRhZmlsZXRleHRmaWVsZFwiKTtcbiAgICAgICAgdGhpcy5jb3B5RGF0YUF0dHJpYnV0ZXMoKTtcbiAgICAgICAgdGhpcy5vcmlnRWxlbS5yZXBsYWNlV2l0aCh0aGlzLmNvbnRhaW5lckRpdik7XG4gICAgfVxuICAgIGNvcHlEYXRhQXR0cmlidXRlcygpIHtcbiAgICAgICAgZm9yIChjb25zdCBhdHRyIG9mIHRoaXMub3JpZ0VsZW0uYXR0cmlidXRlcykge1xuICAgICAgICAgICAgaWYgKGF0dHIubmFtZS5zdGFydHNXaXRoKFwiZGF0YS1cIikpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5zZXRBdHRyaWJ1dGUoYXR0ci5uYW1lLCBhdHRyLnZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09IEZpbmQgdGhlIGN1c3RvbSBIVE1MIHRhZ3MgYW5kID09XG49PSAgIGV4ZWN1dGUgb3VyIGNvZGUgb24gdGhlbSAgICA9PVxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInJ1bmVzdG9uZTpsb2dpbi1jb21wbGV0ZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgZG9jdW1lbnRcbiAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoXCJbZGF0YS1jb21wb25lbnQ9ZGF0YWZpbGVdXCIpXG4gICAgICAgIC5mb3JFYWNoKGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBkZkxpc3RbZWwuaWRdID0gbmV3IERhdGFGaWxlKHsgb3JpZzogZWwgfSk7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgRXJyb3IgcmVuZGVyaW5nIERhdGFGaWxlICR7ZWwuaWR9YCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xufSk7XG5cbmlmICh0eXBlb2Ygd2luZG93LmNvbXBvbmVudF9mYWN0b3J5ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgd2luZG93LmNvbXBvbmVudF9mYWN0b3J5ID0ge307XG59XG5cbndpbmRvdy5jb21wb25lbnRfZmFjdG9yeS5kYXRhZmlsZSA9IGZ1bmN0aW9uIChvcHRzKSB7XG4gICAgcmV0dXJuIG5ldyBEYXRhRmlsZShvcHRzKTtcbn07XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=