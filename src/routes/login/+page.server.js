/** @type {import('./$types').Actions} */
import { UserDB } from "$lib/model/users";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { redirect } from "@sveltejs/kit";
import dotenv from 'dotenv';
import { token_secret_gen } from "$lib";
import { decodeTkn } from "$lib/check-token";
dotenv.config();

export async function load({cookies}) {
    if (await decodeTkn(cookies.get('token'))) {
        redirect(302, '/staff')
    }
}

export const actions = {
	register: async ({ cookies, request }) => {
		const data = await request.formData();
		let login = data.get('login');
		const username = data.get('username');
		const pass = data.get('pass');
		const discord = data.get('discord_tag');

		if (!login || !username || !pass || !discord) { redirect(302, '/register?nodata') }

		const oldUser = await UserDB.findOne({ login })
		if (oldUser) { redirect(302, '/register?exist') }

		let token_check = token_secret_gen()

		let encryptedPassword = await bcrypt.hash(String(pass), 10);
		const user = await UserDB.create({
			login,
			username,
			discord,
			pass: encryptedPassword,
			accepted: false,
			roles: ["actor"],
			token_check
		})
		redirect(302, '/register?done')
	},
	login: async ({ cookies, request }) => {
		const data = await request.formData();
		let login = data.get('login');
		const pass = data.get('pass');
		if (!login || !pass) { redirect(302, '/login?nodata') }

		const user = await UserDB.findOne({ login });

		if (!user) {redirect(302, '/login?nouser')}
		if (!user.accepted) {redirect(302, '/login?noaccept')}
		if (!user.token_check) {user.token_check = token_secret_gen(); user.save()}

		if (await bcrypt.compare(String(pass), user.pass)) {
			const token = jwt.sign(
				{ user_id: user._id, email: user.email, check: user.token_check },
				String(process.env.TOKEN_KEY),
				{
				expiresIn: '76h',
				}
			);
			cookies.set('token', token, {path: '/'})
			redirect(302, '/staff')
		}
		else {
			redirect(302, '/login?wrongpass')
		}
	}
};