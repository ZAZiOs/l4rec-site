import { error, redirect } from '@sveltejs/kit';
import { ProjectDB } from '$lib/model/projects.js';
import { decodeTkn } from '$lib/check-token.js'

export async function load({ params, cookies }) {
	const decoded = await decodeTkn(cookies.get('token'))
    if (!decoded) {
        redirect(302, '/login?unauthorized')
    }

	const project = await ProjectDB.findOne({id: params.slug}, {_id: 0}).lean()

	if (project) {
		return {
			user: decoded,
			project
		}
	}

	error(404, 'Not found');
}