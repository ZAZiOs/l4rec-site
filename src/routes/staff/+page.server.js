import { redirect } from "@sveltejs/kit";
import { decodeTkn } from '$lib/check-token.js'
import { ProjectDB } from "$lib/model/projects.js";

export async function load({cookies, params}) {
    const decoded = await decodeTkn(cookies.get('token'))
    if (!decoded) {
        redirect(302, '/login?unauthorized')
    }
    
    const projects = await ProjectDB.find({}, {_id: 0}).lean()

    return {
        user: JSON.parse(JSON.stringify(decoded)),
        projects
    }
}