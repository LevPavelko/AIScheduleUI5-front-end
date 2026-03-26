sap.ui.define([], function () {
	"use strict";

	function isJwtValid(token) {
		if (!token) {
			return false;
		}

		try {
			var parts = token.split(".");
			if (parts.length !== 3) {
				return false;
			}

			var base64Url = parts[1];
			var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
			var jsonPayload = decodeURIComponent(
				atob(base64)
					.split("")
					.map(function (c) {
						return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
					})
					.join("")
			);

			var payload = JSON.parse(jsonPayload);

			if (typeof payload.exp !== "number") {
				return true;
			}
			var nowInSeconds = Math.floor(Date.now() / 1000);
			return payload.exp > nowInSeconds;
		} catch (e) {
			return false;
		}
	}

	return {
		isJwtValid: isJwtValid
	};
});
