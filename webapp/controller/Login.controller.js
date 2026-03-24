sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/schedule/util/api"
], function(Controller) {
	"use strict";



	return Controller.extend("sap.ui.schedule.controller.Login", {

		onBtnClick : async function(){
			var email = this.getView().byId("Email").getValue();
			var password = this.getView().byId("Password").getValue();

			const response = await api.post("/api/account/login", {email, password}, {
				headers: {"Content-Type": "application/json"}
			});
			if(response.status !== 200) {
				throw new Error(response.data);
			}

			const data = response.data;
			console.log("DATA: " + data);


		},

		onBtnSignUp : async function(){
			this.getOwnerComponent().getRouter().navTo("SignUp", {}, true);


		},



	});
});
