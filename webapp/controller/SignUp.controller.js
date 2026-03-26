sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";



	return Controller.extend("sap.ui.schedule.controller.SignUp", {

		onBtnClick : async function(){
			var email = this.getView().byId("Email").getValue();
			var password = this.getView().byId("Password").getValue();
			var name = this.getView().byId("Name").getValue();

			var repeatPassword = this.getView().byId("RepeatPassword").getValue();
			var warning = this.getView().byId("warning");

			if (password !== repeatPassword) {
				warning.setText("Passwords do not match");
				warning.addStyleClass("redLabel")
				return;
			}
			if(password.length < 8){
				warning.setText("Passwords should have at least 8 letters long");
				warning.addStyleClass("redLabel")
				return;
			}

			var sUrl = "http://localhost:5082/api/auth/signup";
			const response = await fetch(sUrl, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					name: name,
					email: email,
					password: password,
				})
			});
			if(!response.ok){
				warning.setText("Something went wrong");
				warning.addStyleClass("redLabel")
				return;
			}

			const data = await response.json();
			document.cookie = "jwt=" + encodeURIComponent(data.jwt) + "; path=/; max-age=3600";
			document.cookie = "id=" + encodeURIComponent(data.id) + "; path=/; max-age=3600";

			console.log("JWT:", data.jwt);
			console.log("Encrypted Id:", data.id);
			this.getOwnerComponent().getRouter().navTo("StudyDataForm", {}, true);


		},

		onInit: function () {

		}

	});
});
