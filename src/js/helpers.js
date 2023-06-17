// contain functions that will be reused in project

import { TIMEOUT_SEC } from "./config.js"

const timeout = function (s) {
	return new Promise(function (_, reject) {
		setTimeout(function () {
			reject(new Error(`Request took too long! Timeout after ${s} second`))
		}, s * 1000)
	})
}

export const getJSON = async (url) => {
	try {
		//prettier-ignore
		const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)] ) // A race between two promises
		const data = await res.json()
		if (!res.ok) throw new Error(`${data.message} (${res.status})`)
		console.log(data)
		return data
	} catch (err) {
		throw err
	}
}

export const AJAX = async function (url, uploadData = undefined) {
	try {
		const fetchPro = uploadData
			? fetch(url, {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},

					body: JSON.stringify(uploadData)
			  })
			: fetch(url)

		//prettier-ignore
		const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)] ) // A race between two promises
		const data = await res.json()
		if (!res.ok) throw new Error(`${data.message} (${res.status})`)
		return data
	} catch (err) {
		throw err
	}
}

/* export const sendJSON = async (url, uploadData) => {
	try {
		const fetchPro = fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},

			body: JSON.stringify(uploadData)
		})

		//prettier-ignore
		const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)] ) // A race between two promises
		const data = await res.json()
		if (!res.ok) throw new Error(`${data.message} (${res.status})`)
		return data
	} catch (err) {
		throw err
	}
}
 */
