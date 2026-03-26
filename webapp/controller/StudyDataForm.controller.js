sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/ui/schedule/util/Cookies"
], function (Controller, JSONModel, MessageBox, Cookies) {
	"use strict";

	return Controller.extend("sap.ui.schedule.controller.StudyDataForm", {

		onInit: function () {
			var oModel = new JSONModel({
				universities: [],
				majors: [],
				selectedUniId: null,
				selectedMajorId: null,
				semester: ""
			});
			this.getView().setModel(oModel, "viewModel");

			this._loadUniversities();
		},

		_loadUniversities: async function () {
			try {
				const response = await fetch("http://localhost:5082/api/universities");
				if (!response.ok) {
					throw new Error("Failed to load universities");
				}
				const data = await response.json(); // [{ id, name }, ...]
				this.getView().getModel("viewModel").setProperty("/universities", data);
			} catch (e) {
				MessageBox.error(e.message || "Error loading universities");
			}
		},

		_loadMajorsForUniversity: async function (uniId) {
			try {
				const url = `http://localhost:5082/api/majors/${encodeURIComponent(uniId)}`;

				const response = await fetch(url);
				if (!response.ok) {
					throw new Error("Failed to load majors");
				}
				const data = await response.json();
				var oModel = this.getView().getModel("viewModel");
				oModel.setProperty("/majors", data);
			} catch (e) {
				MessageBox.error(e.message || "Error loading majors");
			}
		},

		onUniversityChange: function (oEvent) {
			var sUniId = oEvent.getSource().getSelectedKey();
			var oModel = this.getView().getModel("viewModel");
			oModel.setProperty("/selectedUniId", sUniId);
			oModel.setProperty("/majors", []); // clear majors
			oModel.setProperty("/selectedMajorId", null);

			if (sUniId) {
				this._loadMajorsForUniversity(sUniId);
			}
		},

		onSavePress: async function () {
			var oView = this.getView();
			var oModel = oView.getModel("viewModel");
			var sUniId = this.byId("uniSelect").getSelectedKey();
			var sMajorId = this.byId("majorSelect").getSelectedKey();
			var iSemester = parseInt(this.byId("semesterInput").getValue(), 10);
			var oWarning = this.byId("warning");
			let userId = Cookies.getCookie("id");

			if (!sUniId || !sMajorId || !iSemester) {
				oWarning.setText("Please fill all fields");
				oWarning.addStyleClass("redLabel");
				return;
			}

			try {
				const body = {
					userId: userId,
					uniId: sUniId,
					majorId: sMajorId,
					semester: iSemester
				};

				const response = await fetch("http://localhost:5082/api/studydata", {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify(body)
				});

				if (!response.ok) {
					throw new Error("Failed to save study data");
				}

				oWarning.setText("");
				MessageBox.success("Study data saved");
				this.getOwnerComponent().getRouter().navTo("App", {}, true);
			} catch (e) {
				MessageBox.error(e.message || "Error saving study data");
			}
		}

	});
});
