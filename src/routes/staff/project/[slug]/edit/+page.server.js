import { error, redirect } from '@sveltejs/kit';
import { ProjectDB } from '$lib/model/projects.js';
import { decodeTkn } from '$lib/check-token.js'
import { UserDB } from '$lib/model/users.js'
import fs from 'fs';

export async function load({ params, cookies }) {
	const decoded = await decodeTkn(cookies.get('token'))
    if (!decoded) {
        redirect(302, '/login?unauthorized')
    }
	const project = await ProjectDB.findOne({id: params.slug}, {_id: 0, __v: 0}).lean()
    const user_list = await UserDB.find({accepted: true}, {_id: 0, pass: 0, __v: 0}).lean()
	if (project) {
        if (decoded.roles.includes('admin') || decoded.curating.includes(project.id)) {
            return {
                user: decoded,
                project,
                user_list
            }
        }
		redirect(302, '/staff?not-allowed')
	}

	error(404, 'Not found');
}

export const actions = {
	save: async ({ cookies, request }) => {
        const decoded = await decodeTkn(cookies.get('token'))
        if (!decoded) {
            redirect(302, '/login?unauthorized')
        }

        const formData = Object.fromEntries(await request.formData());
        const { thumbnail } = formData
        try { JSON.parse(formData.main) } catch (err) { redirect(302, '/staff?error-parsing-main=' + err) }
        const main = JSON.parse(formData.main)

        if (!(decoded.roles.includes('admin') || decoded.curating.includes(main.id))) {
            redirect(302, '/staff?not-allowed')
        }
        if (thumbnail) {
            fs.readdirSync(`static/projects/${main.id}/`).forEach(f => {
                if (f.includes('thumbnail')) {
                    fs.rmSync(`static/projects/${main.id}/${f}`)
                }
            })
            const thumb_type = thumbnail.type.split('/')
            fs.writeFileSync(`static/projects/${main.id}/thumbnail.${thumb_type[1]}`, Buffer.from(await thumbnail.arrayBuffer()))
            main.thumbnail = `/projects/${main.id}/thumbnail.${thumb_type[1]}`
        }

        await ProjectDB.replaceOne({id: main.id}, main)

    },
    delete: async ({cookies, request}) => {
        const decoded = await decodeTkn(cookies.get('token'))
        if (!decoded) {
            redirect(302, '/login?unauthorized')
        }
        if (!(decoded.roles.includes('admin') || decoded.curating.includes(main.id))) {
            redirect(302, '/staff?not-allowed')
        }
        const formData = Object.fromEntries(await request.formData());
        const {pr_id} = formData
        await ProjectDB.findOneAndDelete({id: pr_id})

        fs.rm(`static/projects/${pr_id}`, { recursive: true, force: true }, err => {
            if (err) {
                redirect(302, '/staff?error-parsing-main=' + err)
            }
        });

        fs.rm(`private/project/${pr_id}`, { recursive: true, force: true }, err => {
            if (err) {
                redirect(302, '/staff?error-parsing-main=' + err)
            }
        });
        redirect(302, '/staff?success')
    }   
}