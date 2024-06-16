import { error, redirect } from '@sveltejs/kit';
import { ProjectDB } from '$lib/model/projects.js';
import { decodeTkn } from '$lib/check-token.js'
import { UserDB } from '$lib/model/users.js'
import bcrypt from 'bcrypt';
import fs from 'fs';
import { token_secret_gen } from '$lib';

export async function load({ params, cookies }) {
	const decoded = await decodeTkn(cookies.get('token'))
    if (!decoded) {
        redirect(302, '/login?unauthorized')
    }
	const user_list = await UserDB.find({}, {_id: 0, pass: 0, __v: 0, token_check: 0}).lean()
    if (decoded.roles.includes('admin')) {
        return {
            user: decoded,
            user_list
        }
    }
    redirect(302, '/staff?not-allowed')
}

export const actions = {
	save_user: async ({ cookies, request }) => {
        const formData = Object.fromEntries(await request.formData());
        const { login, discord, username, pass, accepted, roles } = formData
       

        const user = await UserDB.findOne({ login })

        if (discord) {user.discord = discord}
        if (username) {user.username = username}
        if (pass) {
            let new_pass = await bcrypt.hash(String(pass), 10); 
            user.pass = new_pass; 
            user.token_check = token_secret_gen()
        }
        if (accepted) {user.accepted = true} else {user.accepted = false}
        user.roles = JSON.parse(roles)

        user.save()
        redirect(302, '/staff/admin-panel?saved_user=' + login)
    },
    reset_token: async ({request}) => {
        const formData = Object.fromEntries(await request.formData());
        const { login } = formData
        const user = await UserDB.findOne({ login })
        user.token_check = token_secret_gen()
        user.save()
        redirect(302, '/staff/admin-panel?saved_user=' + login)
    }
}