sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	'sap/m/MessageBox'
], function (Controller, JSONModel, MessageBox, UI5Date) {
	"use strict";
	function getCookie(sName) {
		const sSearch = sName + "=";
		const aCookies = document.cookie.split(";");
		for (let i = 0; i < aCookies.length; i++) {
			let sCookie = aCookies[i].trim();
			if (sCookie.indexOf(sSearch) === 0) {
				return sCookie.substring(sSearch.length, sCookie.length);
			}
		}
		return null;
	}

	return Controller.extend("sap.ui.schedule.controller.App", {
		onInit: async function () {

			console.log("App onInit, owner:", this.getOwnerComponent());

			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("App").attachPatternMatched(this._onRouteMatched, this);


			var oPC = this.byId("planningCalendar");
			var sUrl = "http://localhost:5678/webhook-test/a800bfb2-8221-4f39-ab69-a9c8c5cd1366";
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

			const response = await fetch(sUrl, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					course: "Informatik",
					uni: "Uni Wien",
					semester: "second",
					link: "https://ufind.univie.ac.at/de/vvz.html"
				})
			});
			const result = await response.json();
			/*сделать нормальную обработку ошибок,приверки и тд*/
			let sJson = result.output.trim();
			sJson = sJson.replace(/^```json/i, "").replace(/```$/, "").trim();


			const payload = JSON.parse(sJson);


			var oData = {
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

			var oModel = new JSONModel(oData);
			this.getView().setModel(oModel);

			var oSPC = this.byId("planningCalendar");
			oSPC.setSelectedView(
				oSPC.getViews().find(function (v) {
					return v.getKey() === "Day";
				})
			);
		},

		_onRouteMatched: function () {
			console.log("_onRouteMatched fired");
			const jwt = getCookie("jwt");
			console.log("JWT in _onRouteMatched", jwt);
			if (!jwt) {
				this.getOwnerComponent().getRouter().navTo("Login", {}, true);
			}
		},
		onAppointmentSelect: function (oEvent) {
			/*var oAppointment = oEvent.getParameter("appointment");
			if (!oAppointment) {
				return;
			}

			var sTitle = oAppointment.getTitle();
			var sInfo  = oAppointment.getText(); // bound to {info}

			sap.m.MessageBox.information(
				sTitle + "\n\n" + sInfo
			);*/
			this.getOwnerComponent().getRouter().navTo("Login");
		}


	});
});
