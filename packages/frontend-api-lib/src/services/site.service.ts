const siteIdName = 'siteId'

export function getSiteId() : string | null {
	if (typeof window !== 'undefined') {
		return localStorage.getItem(siteIdName)
	}
	return null
}

export function setSite(id: string) {
	if (typeof window !== 'undefined') {
	localStorage.setItem(siteIdName, id)
	}
}