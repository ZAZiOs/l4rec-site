import { redirect } from "@sveltejs/kit";
import { decodeTkn } from '$lib/check-token.js'
import { ProjectDB } from "$lib/model/projects.js";
import { UserDB } from "$lib/model/users.js";

import fs from "fs";
export async function load({cookies, params}) {
    const decoded = await decodeTkn(cookies.get('token'))
    if (!decoded) {
        redirect(302, '/login')
    } else if (!(decoded.roles.includes('admin') || decoded.roles.includes('curator'))) {
        redirect(302, '/staff?not-allowed')
    }
    return {
        user: JSON.parse(JSON.stringify(decoded))
    }
}

export const actions = {
	add: async ({ cookies, request }) => {
        const formData = Object.fromEntries(await request.formData());

        //проверка доступа
        const decodedtkn = await decodeTkn(cookies.get('token'))
        if (!decodedtkn) {
            redirect(302, '/login')
        } else if (!(decodedtkn.roles.includes('admin') || decodedtkn.roles.includes('curator'))) {
            redirect(302, '/staff?not-allowed')
        }

        if (!(formData.thumbnail.name || formData.thumbnail.name === 'undefined')) {
        redirect(302, '/staff/add-new?no-file');
        }
        
        const { project_id, title, episodes, thumbnail, progress_color } = formData

        if (!(project_id && title && episodes && thumbnail)) {
            redirect(302, '/staff/add-new?not-full-input');
        }
        
        const old_proj = await ProjectDB.findOne({id: project_id})
        if (old_proj) {
            redirect(302, '/staff/add-new?already-exist');
        }
        const thumb_type = thumbnail.type.split('/')
        if (thumb_type[0] != 'image') {
            redirect(302, '/staff/add-new?file-not-image');
        }

        await fs.mkdir(`static/projects/${project_id}`, { recursive: true }, (err) => {if (err) throw err;});
        fs.writeFileSync(`static/projects/${project_id}/thumbnail.${thumb_type[1]}`, Buffer.from(await thumbnail.arrayBuffer()))

        let episode_list = {}

        for (let i = 0; i < Number(episodes); i++) {
            episode_list[`ep${i+1}`] = {
                name: `Эпизод ${i+1}`,
                status: "planned",
                roles: {},
                translation: {
                    done: false,
                    files: [],
                    commentary: ""
                },
                snd_dir: {
                    done: false,
                    commentary: ""
                },
                video_edit: {
                    done_video: false,
                    done_audio: false,
                    commentary: ""
                }
            }
        }

        ProjectDB.create({
            id: project_id,
            title,
            thumbnail: `/projects/${project_id}/thumbnail.${thumb_type[1]}`,
            progress_color,
            archived: false,
            public: false,
            episode_list,
            roles: {}
        })

        let user = await UserDB.findOne({login: decodedtkn.login})
        if (user.curating) {
            user.curating.push(project_id)
        } else {
            user.curating = [ project_id ]
        }
        user.save()

        redirect(302, '/staff?success')
    }
};