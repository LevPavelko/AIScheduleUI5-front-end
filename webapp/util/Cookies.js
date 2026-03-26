sap.ui.define([], function () {
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

	return {
		getCookie: getCookie
	};
});
