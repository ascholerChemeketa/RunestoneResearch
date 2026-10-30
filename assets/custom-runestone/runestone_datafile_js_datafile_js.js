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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuZXN0b25lX2RhdGFmaWxlX2pzX2RhdGFmaWxlX2pzLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNhOztBQUU2QztBQUM3Qjs7QUFFN0IsaUJBQWlCOztBQUVqQix1QkFBdUIsZ0VBQWE7QUFDcEM7QUFDQTtBQUNBLDhCQUE4QjtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUM7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtDQUErQyxVQUFVO0FBQ3pELGNBQWM7QUFDZCx3REFBd0QsTUFBTTtBQUM5RDtBQUNBLFNBQVM7QUFDVCxDQUFDOztBQUVEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2RhdGFmaWxlL2Nzcy9kYXRhZmlsZS5jc3MiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9kYXRhZmlsZS9qcy9kYXRhZmlsZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT09PT09PSAgICAgTWFzdGVyIGRhdGFmaWxlLmpzICAgICAgPT09PT09PT1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PT0gICAgIFRoaXMgZmlsZSBjb250YWlucyB0aGUgSlMgZm9yICAgID09PVxuPT09ICAgdGhlIFJ1bmVzdG9uZSBEYXRhZmlsZSBjb21wb25lbnQuICA9PT1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PT0gICAgICAgICAgICAgIENyZWF0ZWQgYnkgICAgICAgICAgICAgID09PVxuPT09ICAgICAgICAgICBJc2FpYWggTWF5ZXJjaGFrICAgICAgICAgICA9PT1cbj09PSAgICAgICAgICAgICAgICA2LzgvMTUgICAgICAgICAgICAgICAgPT09XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCBSdW5lc3RvbmVCYXNlIGZyb20gXCIuLi8uLi9jb21tb24vanMvcnVuZXN0b25lYmFzZVwiO1xuaW1wb3J0IFwiLi4vY3NzL2RhdGFmaWxlLmNzc1wiO1xuXG52YXIgZGZMaXN0ID0ge307IC8vIERpY3Rpb25hcnkgdGhhdCBjb250YWlucyBhbGwgaW5zdGFuY2VzIG9mIERhdGFmaWxlIG9iamVjdHNcblxuY2xhc3MgRGF0YUZpbGUgZXh0ZW5kcyBSdW5lc3RvbmVCYXNlIHtcbiAgICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgICAgIHN1cGVyKG9wdHMpO1xuICAgICAgICB2YXIgb3JpZyA9IG9wdHMub3JpZzsgLy8gZW50aXJlIDxwcmU+IGVsZW1lbnQgdGhhdCB3aWxsIGJlIHJlcGxhY2VkIGJ5IG5ldyBIVE1MXG4gICAgICAgIHRoaXMub3JpZ0VsZW0gPSBvcmlnO1xuICAgICAgICB0aGlzLmRpdmlkID0gb3JpZy5pZDtcbiAgICAgICAgdGhpcy5kYXRhRWRpdCA9IHRoaXMucGFyc2VCb29sZWFuQXR0cmlidXRlKG9yaWcsIFwiZGF0YS1lZGl0XCIpO1xuICAgICAgICB0aGlzLmlzSW1hZ2UgPSB0aGlzLnBhcnNlQm9vbGVhbkF0dHJpYnV0ZShvcmlnLCBcImRhdGEtaXNpbWFnZVwiKTtcbiAgICAgICAgdGhpcy5pc0JpbmFyeSA9IHRoaXMucGFyc2VCb29sZWFuQXR0cmlidXRlKG9yaWcsIFwiZGF0YS1pc2JpbmFyeVwiKTtcbiAgICAgICAgdGhpcy5maWxlTmFtZSA9IG9yaWcuZGF0YXNldC5maWxlbmFtZSB8fCBudWxsO1xuICAgICAgICB0aGlzLmRpc3BsYXlDbGFzcyA9IFwiYmxvY2tcIjsgLy8gVXNlcnMgY2FuIHNwZWNpZnkgdGhlIG5vbi1lZGl0IGNvbXBvbmVudCB0byBiZSBoaWRkZW4tLWRlZmF1bHQgaXMgbm90IGhpZGRlblxuICAgICAgICBpZiAodGhpcy5wYXJzZUJvb2xlYW5BdHRyaWJ1dGUob3JpZywgXCJkYXRhLWhpZGRlblwiKSkge1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5Q2xhc3MgPSBcIm5vbmVcIjtcbiAgICAgICAgfVxuICAgICAgICAvLyBVc2VycyBjYW4gc3BlY2lmeSBudW1iZXJzIG9mIHJvd3MvY29sdW1ucyB3aGVuIGVkaXRpbmcgaXMgdHJ1ZVxuICAgICAgICB0aGlzLm51bWJlck9mUm93cyA9IG9yaWcuZGF0YXNldC5yb3dzO1xuICAgICAgICB0aGlzLm51bWJlck9mQ29scyA9IG9yaWcuZGF0YXNldC5jb2xzO1xuXG4gICAgICAgIGlmICghdGhpcy5pc0ltYWdlKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhRWRpdCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlVGV4dEFyZWEoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVQcmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmZpbGVOYW1lKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250YWluZXJEaXYuZGF0YXNldC5maWxlbmFtZSA9IHRoaXMuZmlsZU5hbWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gc2VhcmNoIGZvciBhIHBhcmVudCBkaXYgd2l0aCB0aGUgY2xhc3MgJ2RhdGFmaWxlX2NhcHRpb24nIGluIHBsYWluIGphdmFzY3JpcHRcbiAgICAgICAgbGV0IGNhcHRpb25EaXYgPVxuICAgICAgICAgICAgdGhpcy5jb250YWluZXJEaXYucGFyZW50RWxlbWVudD8ucXVlcnlTZWxlY3RvcihcIi5kYXRhZmlsZV9jYXB0aW9uXCIpO1xuICAgICAgICBpZiAoY2FwdGlvbkRpdiAmJiB0aGlzLmRpc3BsYXlDbGFzcyA9PT0gXCJub25lXCIpIHtcbiAgICAgICAgICAgIC8vIGhpZGUgdGhlIGNhcHRpb25EaXYgaWYgdGhlIGRhdGFmaWxlIGlzIGhpZGRlblxuICAgICAgICAgICAgY2FwdGlvbkRpdi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbmRpY2F0ZV9jb21wb25lbnRfcmVhZHkoKTtcbiAgICB9XG4gICAgLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT0gQ3JlYXRlIGVpdGhlciA8cHJlPiBvciA8dGV4dGFyZWE+ID09XG4gICAgPT0gIGRlcGVuZGluZyBvbiBpZiBlZGl0aW5nIGlzIHRydWUgID09XG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG4gICAgY3JlYXRlUHJlKCkge1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwcmVcIik7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmlkID0gdGhpcy5kaXZpZDtcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYuc3R5bGUuZGlzcGxheSA9IHRoaXMuZGlzcGxheUNsYXNzO1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5pbm5lckhUTUwgPSB0aGlzLm9yaWdFbGVtLmlubmVySFRNTDtcbiAgICAgICAgdGhpcy5jb3B5RGF0YUF0dHJpYnV0ZXMoKTtcbiAgICAgICAgdGhpcy5vcmlnRWxlbS5yZXBsYWNlV2l0aCh0aGlzLmNvbnRhaW5lckRpdik7XG4gICAgfVxuICAgIGNyZWF0ZVRleHRBcmVhKCkge1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0ZXh0YXJlYVwiKTtcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYuaWQgPSB0aGlzLmRpdmlkO1xuICAgICAgICBpZiAodGhpcy5udW1iZXJPZlJvd3MpIHRoaXMuY29udGFpbmVyRGl2LnJvd3MgPSB0aGlzLm51bWJlck9mUm93cztcbiAgICAgICAgaWYgKHRoaXMubnVtYmVyT2ZDb2xzKSB0aGlzLmNvbnRhaW5lckRpdi5jb2xzID0gdGhpcy5udW1iZXJPZkNvbHM7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmlubmVySFRNTCA9IHRoaXMub3JpZ0VsZW0uaW5uZXJIVE1MO1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5jbGFzc0xpc3QuYWRkKFwiZGF0YWZpbGV0ZXh0ZmllbGRcIik7XG4gICAgICAgIHRoaXMuY29weURhdGFBdHRyaWJ1dGVzKCk7XG4gICAgICAgIHRoaXMub3JpZ0VsZW0ucmVwbGFjZVdpdGgodGhpcy5jb250YWluZXJEaXYpO1xuICAgIH1cbiAgICBjb3B5RGF0YUF0dHJpYnV0ZXMoKSB7XG4gICAgICAgIGZvciAoY29uc3QgYXR0ciBvZiB0aGlzLm9yaWdFbGVtLmF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgIGlmIChhdHRyLm5hbWUuc3RhcnRzV2l0aChcImRhdGEtXCIpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250YWluZXJEaXYuc2V0QXR0cmlidXRlKGF0dHIubmFtZSwgYXR0ci52YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PSBGaW5kIHRoZSBjdXN0b20gSFRNTCB0YWdzIGFuZCA9PVxuPT0gICBleGVjdXRlIG91ciBjb2RlIG9uIHRoZW0gICAgPT1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJydW5lc3RvbmU6bG9naW4tY29tcGxldGVcIiwgZnVuY3Rpb24gKCkge1xuICAgIGRvY3VtZW50XG4gICAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKFwiW2RhdGEtY29tcG9uZW50PWRhdGFmaWxlXVwiKVxuICAgICAgICAuZm9yRWFjaChmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgZGZMaXN0W2VsLmlkXSA9IG5ldyBEYXRhRmlsZSh7IG9yaWc6IGVsIH0pO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYEVycm9yIHJlbmRlcmluZyBEYXRhRmlsZSAke2VsLmlkfWApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbn0pO1xuXG5pZiAodHlwZW9mIHdpbmRvdy5jb21wb25lbnRfZmFjdG9yeSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHdpbmRvdy5jb21wb25lbnRfZmFjdG9yeSA9IHt9O1xufVxuXG53aW5kb3cuY29tcG9uZW50X2ZhY3RvcnkuZGF0YWZpbGUgPSBmdW5jdGlvbiAob3B0cykge1xuICAgIHJldHVybiBuZXcgRGF0YUZpbGUob3B0cyk7XG59O1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9