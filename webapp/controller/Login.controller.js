sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";



	return Controller.extend("sap.ui.schedule.controller.Login", {

		onBtnClick : async function(){
			let email = this.getView().byId("Email").getValue();
			let password = this.getView().byId("Password").getValue();
			let warning = this.getView().byId("warning");

			let sUrl = "http://localhost:5082/api/auth/login";

			const response = await fetch(sUrl, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					email: email,
					password: password,
				})
			});
			if(!response.ok){
				warning.setText(response.message);
				warning.addStyleClass("redLabel")
				return;
			}

			const data = await response.json();
			document.cookie = "jwt=" + encodeURIComponent(data.jwt) + "; path=/; max-age=3600";
			document.cookie = "id=" + encodeURIComponent(data.id) + "; path=/; max-age=3600";

			console.log("JWT:", data.jwt);
			console.log("Encrypted Id:", data.id);
			this.getOwnerComponent().getRouter().navTo("App", {}, true);



		},

		onBtnSignUp : async function(){
			this.getOwnerComponent().getRouter().navTo("SignUp", {}, true);


		},



	});
});
