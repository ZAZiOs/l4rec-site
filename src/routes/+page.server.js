import { redirect } from "@sveltejs/kit";
import { decodeTkn } from '$lib/check-token.js'
import { token_secret_gen } from "$lib";
export async function load({cookies}) {
    if (await decodeTkn(cookies.get('token'))) {
        redirect(302, '/staff')
    }
    redirect(302, '/login'); // needs `throw` in v1
}