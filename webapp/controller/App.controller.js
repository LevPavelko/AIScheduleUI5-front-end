sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/ui/schedule/util/Cookies",
	"sap/ui/schedule/util/JwtUtil"
], function (Controller, JSONModel, MessageBox, Cookies, JwtUtil) {
	"use strict";

	return Controller.extend("sap.ui.schedule.controller.App", {
		onInit:  function () {
			let oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("App").attachPatternMatched(this._onRouteMatched, this);

		},

		_loadStudyDataAndInitCalendar: async function (userId) {
			let oPC = this.byId("planningCalendar");

			let url = `http://localhost:5082/api/studydata/getByUserId/${userId}`;
			const response = await fetch(url, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				}
			});
			if(!response.ok) {
				MessageBox.error();
				const errorBody = await response.text();
				console.log("ERROR status:", response.status, errorBody);
				return;
			}
			const data = await response.json();
			let n8nUrl = "http://localhost:5678/webhook/a800bfb2-8221-4f39-ab69-a9c8c5cd1366";
			/*var oMockBackendData = {
				lectures: [
					{
						title: "Mathematics",
						info: "09:00–10:30",
						start: "2026-03-19T09:00:00",
						end: "2026-03-19T10:30:00",
						type: "Type01"
					},
					{
						title: "Mathematics 2",
						info: "09:30–10:30",
						start: "2026-03-19T09:30:00",
						end: "2026-03-19T10:30:00",
						type: "Type01"
					},
					{
						title: "Microeconomics",
						info: "11:00–12:30",
						start: "2026-03-19T11:00:00",
						end: "2026-03-19T12:30:00",
						type: "Type02"
					},
					{
						title: "Statistics I",
						info: "08:00–09:30",
						start: "2026-03-18T08:00:00",
						end: "2026-03-18T09:30:00",
						type: "Type03"
					},
					{
						title: "Statistics II",
						info: "08:00–09:30",
						start: "2026-03-19T08:00:00",
						end: "2026-03-19T09:30:00",
						type: "Type03"
					},
					{
						title: "Statistics II",
						info: "dddd",
						start: "2026-03-19T15:00:00",
						end: "2026-03-19T16:30:00",
						type: "Type02"
					},
					{
						title: "WORK",
						info: "dddd",
						start: "2026-03-19T20:00:00",
						end: "2026-03-19T23:30:00",
						type: "Type02"
					}
				]
			};*/


			const n8nResponse = await fetch(n8nUrl, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					course: data.major.name,
					uni: data.university.name,
					semester: data.semester,
					link: data.university.link,
				})
			});
			if(!n8nResponse.ok) {
				MessageBox.error();
				const errorBody = await n8nResponse.text();
				console.log("ERROR status:", n8nResponse.status, errorBody);
				return;
			}
			const result = await n8nResponse.json();
			let sJson = result.output.trim();
			sJson = sJson.replace(/^```json/i, "").replace(/```$/, "").trim();

			const payload = JSON.parse(sJson);

			let oData = {
				startDate: new Date(),               // calendar start
				appointments: payload.lectures.map(function (l) {
					const oStart = new Date(l.start);
					const oEnd   = new Date(l.end);

					const fmt = new Intl.DateTimeFormat("de-AT", {
						hour: "2-digit",
						minute: "2-digit"
					});

					return {
						title:     l.title,
						info:      l.info,
						startDate: new Date(l.start),
						endDate:   new Date(l.end),
						timeRange: fmt.format(oStart) + " - " + fmt.format(oEnd),
						type:      l.type
					};
				})
			};

			let oModel = new JSONModel(oData);
			this.getView().setModel(oModel);

			let oSPC = this.byId("planningCalendar");
			oSPC.setSelectedView(
				oSPC.getViews().find(function (v) {
					return v.getKey() === "Day";
				})
			);
		},
		_onRouteMatched: async function () {

			const jwt = Cookies.getCookie("jwt");
			let isValid = JwtUtil.isJwtValid(jwt);

			if (!isValid) {
				this.getOwnerComponent().getRouter().navTo("Login", {}, true);
			}
			const userId = Cookies.getCookie("id");
			if (!userId) {
				MessageBox.error("No user id found.");
				this.getOwnerComponent().getRouter().navTo("Login", {}, true);
				return;
			}
			await this._loadStudyDataAndInitCalendar(userId);

		},
		onAppointmentSelect: function (oEvent) {
			var oAppointment = oEvent.getParameter("appointment");
			if (!oAppointment) {
				return;
			}

			var sTitle = oAppointment.getTitle();
			var sInfo  = oAppointment.getText();

			sap.m.MessageBox.information(
				sTitle + "\n\n" + sInfo
			);

		}


	});
});
