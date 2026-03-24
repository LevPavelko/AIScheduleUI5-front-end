// webapp/util/hash.js
sap.ui.define([], function () {
	"use strict";

	async function hashPassword(password) {
		const salt = window.crypto.getRandomValues(new Uint8Array(16));

		const result = await argon2.hash({
			pass: password,
			salt: salt,
			time: 4,
			mem: 65536,
			parallelism: 8,
			hashLen: 32,
			type: argon2.ArgonType.Argon2id
		});

		const hashBytes = result.hash;
		return btoa(String.fromCharCode(...hashBytes));
	}

	return {
		hashPassword: hashPassword
	};
});
