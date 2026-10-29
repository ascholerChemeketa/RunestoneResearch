"use strict";
(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_groupsub_js_groupsub_js"],{

/***/ 24616:
/*!*******************************************!*\
  !*** ./runestone/groupsub/js/groupsub.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GroupSub: () => (/* binding */ GroupSub)
/* harmony export */ });
/* harmony import */ var _common_js_runestonebase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/runestonebase */ 78673);
/* harmony import */ var _css_groupsub_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../css/groupsub.css */ 63915);
/*==========================================
=======      Master groupsub.js       ========
============================================
===     This file contains the JS for    ===
===     the Runestone reval component.   ===
============================================
===              Created by              ===
===           Isaiah Mayerchak           ===
===               06/12/15               ===
==========================================*/




// Define Reveal object
class GroupSub extends _common_js_runestonebase__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(opts) {
        super(opts);
        var orig = opts.orig; // entire <div> element that will be replaced by new HTML
        this.origElem = orig;
        this.divid = orig.id;
        this.limit = this.origElem.dataset.size_limit;
        this.isPretext = document.body.classList.contains("pretext");
        // Create submit button
        let butt = document.createElement("button");
        butt.type = "button";
        butt.classList.add("btn", "btn-success");
        butt.innerHTML = "Submit Group";
        butt.onclick = this.submitAll.bind(this);
        var container;
        if (this.isPretext) {
            container = opts.orig.querySelector(".groupsub_button");
        } else {
            container = document.getElementById("groupsub_button");
        }

        container.appendChild(butt);
    }

    async initialize() {
        // get the classlist to populate
        if (eBookConfig.useRunestoneServices) {
            // get classlist from admin/course_students
            let request = new Request("/ns/auth/course_students", {
                method: "GET",
                headers: this.jsonHeaders,
            });
            try {
                let response = await fetch(request);
                if (!response.ok) {
                    throw new Error("Failed to get the list of students");
                }
                if (response.redirected) {
                    alert("You must be logged in to use this feature");
                    return;
                }
                let resp = await response.json();
                this.studentList = resp.detail.students;
            } catch (e) {
                if (this.isTimed) {
                    alert(
                        `Error: Failed to get the list of students. The error was ${e}`,
                    );
                }
                console.log(`Error: ${e}`);
                this.studentList = {
                    failed: "Failed to load students - logout and back in",
                };
            }
        } else {
            this.studentList = {
                s1: "User 1",
                s2: "User 2",
                s3: "User 3",
                s4: "User 4",
                s5: "User 5",
            };
        }
        var select;
        if (this.isPretext) {
            select = this.origElem.querySelector(".assignment_partner_select");
        } else {
            select = document.getElementById("assignment_group");
        }
        this.picker = select;
        for (let [sid, name] of Object.entries(this.studentList)) {
            let opt = document.createElement("option");
            opt.value = sid;
            opt.textContent = name;
            select.appendChild(opt);
        }
        // A native multi-select (select2 used to enhance this; the size
        // limit is enforced in submitAll).
        select.title = `Select up to ${this.limit} team members`;
    }

    async submitAll() {
        // find all components on the page and submit them for all group members

        let group = [];
        for (let student of this.picker.selectedOptions) {
            group.push(student.value);
        }
        // If the leader forgets to add themselves, add them here.
        let username = eBookConfig.username;
        if (username && !group.includes(username)) {
            group.push(username);
        }
        if (group.length > this.limit) {
            alert(
                `You may not have more than ${this.limit} students in a group`,
            );
            return;
        }
        this.logBookEvent({
            event: "group_start",
            act: group.join(","),
            div_id: window.location.pathname,
        });
        var componentList = [];
        if (this.isPretext) {
            let container = this.origElem.closest("section.groupwork");
            for (let id of Object.keys(componentMap)) {
                if (container.querySelector(`#${id}`)) {
                    componentList.push(componentMap[id]);
                }
            }
        } else {
            componentList = window.allComponents;
        }
        for (let student of group) {
            for (let question of componentList) {
                try {
                    console.log(`${student} ${question}`);
                    await question.logCurrentAnswer(student);
                } catch (e) {
                    console.log(`failed to submit ${question} : ${e}`);
                }
            }
        }

        this.logBookEvent({
            event: "group_end",
            act: group.join(","),
            div_id: window.location.pathname,
        });
    }
}

document.addEventListener("runestone:login-complete", async function () {
    let gs = document.querySelectorAll("[data-component=groupsub]");
    if (gs.length > 1) {
        alert("Only one Group Submit is allowed per page");
        return;
    }
    let gsElement = gs[0];
    try {
        var pageReveal = new GroupSub({ orig: gsElement });
        await pageReveal.initialize();
    } catch (err) {
        console.log(`Error rendering GroupSub ${gsElement.id}`);
        console.log(`Details ${err}`);
    }
});


/***/ }),

/***/ 63915:
/*!*********************************************!*\
  !*** ./runestone/groupsub/css/groupsub.css ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuZXN0b25lX2dyb3Vwc3ViX2pzX2dyb3Vwc3ViX2pzLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUUwRDtBQUM3Qjs7QUFFN0I7QUFDTyx1QkFBdUIsZ0VBQWE7QUFDM0M7QUFDQTtBQUNBLDhCQUE4QjtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0Esb0ZBQW9GLEVBQUU7QUFDdEY7QUFDQTtBQUNBLHNDQUFzQyxFQUFFO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0VBQWdFO0FBQ2hFO0FBQ0EsdUNBQXVDLFlBQVk7QUFDbkQ7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOENBQThDLFlBQVk7QUFDMUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnREFBZ0QsR0FBRztBQUNuRDtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQyxTQUFTLEVBQUUsU0FBUztBQUN2RDtBQUNBLGtCQUFrQjtBQUNsQixvREFBb0QsVUFBVSxJQUFJLEVBQUU7QUFDcEU7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdDQUF3QyxpQkFBaUI7QUFDekQ7QUFDQSxNQUFNO0FBQ04sZ0RBQWdELGFBQWE7QUFDN0QsK0JBQStCLElBQUk7QUFDbkM7QUFDQSxDQUFDOzs7Ozs7Ozs7Ozs7QUNuS0QiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2dyb3Vwc3ViL2pzL2dyb3Vwc3ViLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvZ3JvdXBzdWIvY3NzL2dyb3Vwc3ViLmNzcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT09PT09PSAgICAgIE1hc3RlciBncm91cHN1Yi5qcyAgICAgICA9PT09PT09PVxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09PSAgICAgVGhpcyBmaWxlIGNvbnRhaW5zIHRoZSBKUyBmb3IgICAgPT09XG49PT0gICAgIHRoZSBSdW5lc3RvbmUgcmV2YWwgY29tcG9uZW50LiAgID09PVxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09PSAgICAgICAgICAgICAgQ3JlYXRlZCBieSAgICAgICAgICAgICAgPT09XG49PT0gICAgICAgICAgIElzYWlhaCBNYXllcmNoYWsgICAgICAgICAgID09PVxuPT09ICAgICAgICAgICAgICAgMDYvMTIvMTUgICAgICAgICAgICAgICA9PT1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5cbmltcG9ydCBSdW5lc3RvbmVCYXNlIGZyb20gXCIuLi8uLi9jb21tb24vanMvcnVuZXN0b25lYmFzZVwiO1xuaW1wb3J0IFwiLi4vY3NzL2dyb3Vwc3ViLmNzc1wiO1xuXG4vLyBEZWZpbmUgUmV2ZWFsIG9iamVjdFxuZXhwb3J0IGNsYXNzIEdyb3VwU3ViIGV4dGVuZHMgUnVuZXN0b25lQmFzZSB7XG4gICAgY29uc3RydWN0b3Iob3B0cykge1xuICAgICAgICBzdXBlcihvcHRzKTtcbiAgICAgICAgdmFyIG9yaWcgPSBvcHRzLm9yaWc7IC8vIGVudGlyZSA8ZGl2PiBlbGVtZW50IHRoYXQgd2lsbCBiZSByZXBsYWNlZCBieSBuZXcgSFRNTFxuICAgICAgICB0aGlzLm9yaWdFbGVtID0gb3JpZztcbiAgICAgICAgdGhpcy5kaXZpZCA9IG9yaWcuaWQ7XG4gICAgICAgIHRoaXMubGltaXQgPSB0aGlzLm9yaWdFbGVtLmRhdGFzZXQuc2l6ZV9saW1pdDtcbiAgICAgICAgdGhpcy5pc1ByZXRleHQgPSBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5jb250YWlucyhcInByZXRleHRcIik7XG4gICAgICAgIC8vIENyZWF0ZSBzdWJtaXQgYnV0dG9uXG4gICAgICAgIGxldCBidXR0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICAgICAgYnV0dC50eXBlID0gXCJidXR0b25cIjtcbiAgICAgICAgYnV0dC5jbGFzc0xpc3QuYWRkKFwiYnRuXCIsIFwiYnRuLXN1Y2Nlc3NcIik7XG4gICAgICAgIGJ1dHQuaW5uZXJIVE1MID0gXCJTdWJtaXQgR3JvdXBcIjtcbiAgICAgICAgYnV0dC5vbmNsaWNrID0gdGhpcy5zdWJtaXRBbGwuYmluZCh0aGlzKTtcbiAgICAgICAgdmFyIGNvbnRhaW5lcjtcbiAgICAgICAgaWYgKHRoaXMuaXNQcmV0ZXh0KSB7XG4gICAgICAgICAgICBjb250YWluZXIgPSBvcHRzLm9yaWcucXVlcnlTZWxlY3RvcihcIi5ncm91cHN1Yl9idXR0b25cIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdyb3Vwc3ViX2J1dHRvblwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChidXR0KTtcbiAgICB9XG5cbiAgICBhc3luYyBpbml0aWFsaXplKCkge1xuICAgICAgICAvLyBnZXQgdGhlIGNsYXNzbGlzdCB0byBwb3B1bGF0ZVxuICAgICAgICBpZiAoZUJvb2tDb25maWcudXNlUnVuZXN0b25lU2VydmljZXMpIHtcbiAgICAgICAgICAgIC8vIGdldCBjbGFzc2xpc3QgZnJvbSBhZG1pbi9jb3Vyc2Vfc3R1ZGVudHNcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gbmV3IFJlcXVlc3QoXCIvbnMvYXV0aC9jb3Vyc2Vfc3R1ZGVudHNcIiwge1xuICAgICAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB0aGlzLmpzb25IZWFkZXJzLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGxldCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHJlcXVlc3QpO1xuICAgICAgICAgICAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRmFpbGVkIHRvIGdldCB0aGUgbGlzdCBvZiBzdHVkZW50c1wiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnJlZGlyZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJZb3UgbXVzdCBiZSBsb2dnZWQgaW4gdG8gdXNlIHRoaXMgZmVhdHVyZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsZXQgcmVzcCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgICAgICAgICB0aGlzLnN0dWRlbnRMaXN0ID0gcmVzcC5kZXRhaWwuc3R1ZGVudHM7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNUaW1lZCkge1xuICAgICAgICAgICAgICAgICAgICBhbGVydChcbiAgICAgICAgICAgICAgICAgICAgICAgIGBFcnJvcjogRmFpbGVkIHRvIGdldCB0aGUgbGlzdCBvZiBzdHVkZW50cy4gVGhlIGVycm9yIHdhcyAke2V9YCxcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYEVycm9yOiAke2V9YCk7XG4gICAgICAgICAgICAgICAgdGhpcy5zdHVkZW50TGlzdCA9IHtcbiAgICAgICAgICAgICAgICAgICAgZmFpbGVkOiBcIkZhaWxlZCB0byBsb2FkIHN0dWRlbnRzIC0gbG9nb3V0IGFuZCBiYWNrIGluXCIsXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc3R1ZGVudExpc3QgPSB7XG4gICAgICAgICAgICAgICAgczE6IFwiVXNlciAxXCIsXG4gICAgICAgICAgICAgICAgczI6IFwiVXNlciAyXCIsXG4gICAgICAgICAgICAgICAgczM6IFwiVXNlciAzXCIsXG4gICAgICAgICAgICAgICAgczQ6IFwiVXNlciA0XCIsXG4gICAgICAgICAgICAgICAgczU6IFwiVXNlciA1XCIsXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHZhciBzZWxlY3Q7XG4gICAgICAgIGlmICh0aGlzLmlzUHJldGV4dCkge1xuICAgICAgICAgICAgc2VsZWN0ID0gdGhpcy5vcmlnRWxlbS5xdWVyeVNlbGVjdG9yKFwiLmFzc2lnbm1lbnRfcGFydG5lcl9zZWxlY3RcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZWxlY3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFzc2lnbm1lbnRfZ3JvdXBcIik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5waWNrZXIgPSBzZWxlY3Q7XG4gICAgICAgIGZvciAobGV0IFtzaWQsIG5hbWVdIG9mIE9iamVjdC5lbnRyaWVzKHRoaXMuc3R1ZGVudExpc3QpKSB7XG4gICAgICAgICAgICBsZXQgb3B0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKTtcbiAgICAgICAgICAgIG9wdC52YWx1ZSA9IHNpZDtcbiAgICAgICAgICAgIG9wdC50ZXh0Q29udGVudCA9IG5hbWU7XG4gICAgICAgICAgICBzZWxlY3QuYXBwZW5kQ2hpbGQob3B0KTtcbiAgICAgICAgfVxuICAgICAgICAvLyBBIG5hdGl2ZSBtdWx0aS1zZWxlY3QgKHNlbGVjdDIgdXNlZCB0byBlbmhhbmNlIHRoaXM7IHRoZSBzaXplXG4gICAgICAgIC8vIGxpbWl0IGlzIGVuZm9yY2VkIGluIHN1Ym1pdEFsbCkuXG4gICAgICAgIHNlbGVjdC50aXRsZSA9IGBTZWxlY3QgdXAgdG8gJHt0aGlzLmxpbWl0fSB0ZWFtIG1lbWJlcnNgO1xuICAgIH1cblxuICAgIGFzeW5jIHN1Ym1pdEFsbCgpIHtcbiAgICAgICAgLy8gZmluZCBhbGwgY29tcG9uZW50cyBvbiB0aGUgcGFnZSBhbmQgc3VibWl0IHRoZW0gZm9yIGFsbCBncm91cCBtZW1iZXJzXG5cbiAgICAgICAgbGV0IGdyb3VwID0gW107XG4gICAgICAgIGZvciAobGV0IHN0dWRlbnQgb2YgdGhpcy5waWNrZXIuc2VsZWN0ZWRPcHRpb25zKSB7XG4gICAgICAgICAgICBncm91cC5wdXNoKHN0dWRlbnQudmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIC8vIElmIHRoZSBsZWFkZXIgZm9yZ2V0cyB0byBhZGQgdGhlbXNlbHZlcywgYWRkIHRoZW0gaGVyZS5cbiAgICAgICAgbGV0IHVzZXJuYW1lID0gZUJvb2tDb25maWcudXNlcm5hbWU7XG4gICAgICAgIGlmICh1c2VybmFtZSAmJiAhZ3JvdXAuaW5jbHVkZXModXNlcm5hbWUpKSB7XG4gICAgICAgICAgICBncm91cC5wdXNoKHVzZXJuYW1lKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZ3JvdXAubGVuZ3RoID4gdGhpcy5saW1pdCkge1xuICAgICAgICAgICAgYWxlcnQoXG4gICAgICAgICAgICAgICAgYFlvdSBtYXkgbm90IGhhdmUgbW9yZSB0aGFuICR7dGhpcy5saW1pdH0gc3R1ZGVudHMgaW4gYSBncm91cGAsXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubG9nQm9va0V2ZW50KHtcbiAgICAgICAgICAgIGV2ZW50OiBcImdyb3VwX3N0YXJ0XCIsXG4gICAgICAgICAgICBhY3Q6IGdyb3VwLmpvaW4oXCIsXCIpLFxuICAgICAgICAgICAgZGl2X2lkOiB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUsXG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgY29tcG9uZW50TGlzdCA9IFtdO1xuICAgICAgICBpZiAodGhpcy5pc1ByZXRleHQpIHtcbiAgICAgICAgICAgIGxldCBjb250YWluZXIgPSB0aGlzLm9yaWdFbGVtLmNsb3Nlc3QoXCJzZWN0aW9uLmdyb3Vwd29ya1wiKTtcbiAgICAgICAgICAgIGZvciAobGV0IGlkIG9mIE9iamVjdC5rZXlzKGNvbXBvbmVudE1hcCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoYCMke2lkfWApKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudExpc3QucHVzaChjb21wb25lbnRNYXBbaWRdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb21wb25lbnRMaXN0ID0gd2luZG93LmFsbENvbXBvbmVudHM7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgc3R1ZGVudCBvZiBncm91cCkge1xuICAgICAgICAgICAgZm9yIChsZXQgcXVlc3Rpb24gb2YgY29tcG9uZW50TGlzdCkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGAke3N0dWRlbnR9ICR7cXVlc3Rpb259YCk7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHF1ZXN0aW9uLmxvZ0N1cnJlbnRBbnN3ZXIoc3R1ZGVudCk7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgZmFpbGVkIHRvIHN1Ym1pdCAke3F1ZXN0aW9ufSA6ICR7ZX1gKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmxvZ0Jvb2tFdmVudCh7XG4gICAgICAgICAgICBldmVudDogXCJncm91cF9lbmRcIixcbiAgICAgICAgICAgIGFjdDogZ3JvdXAuam9pbihcIixcIiksXG4gICAgICAgICAgICBkaXZfaWQ6IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSxcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwicnVuZXN0b25lOmxvZ2luLWNvbXBsZXRlXCIsIGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgZ3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiW2RhdGEtY29tcG9uZW50PWdyb3Vwc3ViXVwiKTtcbiAgICBpZiAoZ3MubGVuZ3RoID4gMSkge1xuICAgICAgICBhbGVydChcIk9ubHkgb25lIEdyb3VwIFN1Ym1pdCBpcyBhbGxvd2VkIHBlciBwYWdlXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGxldCBnc0VsZW1lbnQgPSBnc1swXTtcbiAgICB0cnkge1xuICAgICAgICB2YXIgcGFnZVJldmVhbCA9IG5ldyBHcm91cFN1Yih7IG9yaWc6IGdzRWxlbWVudCB9KTtcbiAgICAgICAgYXdhaXQgcGFnZVJldmVhbC5pbml0aWFsaXplKCk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGBFcnJvciByZW5kZXJpbmcgR3JvdXBTdWIgJHtnc0VsZW1lbnQuaWR9YCk7XG4gICAgICAgIGNvbnNvbGUubG9nKGBEZXRhaWxzICR7ZXJyfWApO1xuICAgIH1cbn0pO1xuIiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9