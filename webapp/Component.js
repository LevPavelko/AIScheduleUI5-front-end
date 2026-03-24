sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/core/ComponentSupport"
], function (UIComponent) {
	"use strict";

	return UIComponent.extend("sap.ui.schedule.Component", {
		metadata: {
			manifest: "json",
			interfaces: ["sap.ui.core.IAsyncContentCreation"]
		},

		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// initialize the router so getOwnerComponent().getRouter() works
			this.getRouter().initialize();
		}
	});
});
