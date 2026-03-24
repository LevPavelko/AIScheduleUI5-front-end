sap.ui.define([
	"sap/ui/schedule/util/axios"
], function (axios) {
	"use strict";

	const baseUrl = "http://localhost:5082";
	console.log("baseUrl", baseUrl);

	const api = axios.create({
		baseURL: baseUrl,
		withCredentials: true
	});

	api.interceptors.response.use(
		function (response) {
			return response;
		},
		function (error) {
			console.log("API Error:", error);
			return Promise.reject(error);
		}
	);

	return api;
});
