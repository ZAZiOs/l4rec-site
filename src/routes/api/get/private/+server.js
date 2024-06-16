import { error, redirect } from '@sveltejs/kit';
import { decodeTkn } from '$lib/check-token.js';
import fs from 'fs';

export async function GET({ url, cookies }) {
    const decoded = await decodeTkn(cookies.get('token'))
    if (!decoded) {
        error(401, 'Unauthorized. <a href="/login" style="color: gray">Click here to authorize</a>');
    }

    const file = url.searchParams.get('file');
    const name = url.searchParams.get('name');
    if (!file) {
        error(400, 'Должен быть указан параметр "?file="');
    }
    if (file.includes('\\')) {
        error(400, 'Используйте <b>"/"</b> вместо <b>"\\"</b> для разделителя директории');
    }
    
    if (fs.existsSync(`private/${file}`)) {
        try {
            let buffer = fs.readFileSync(`private/${file}`)
            let filename_split = file.split('/')
            let filename = filename_split[filename_split.length - 1]
            if (name) {
                filename = name
            }
            return new Response(
                buffer,
                {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/octet-stream',
                        'Content-Disposition':
                        `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
                    },
                }
            );
        } catch (err) {
            console.log(err)
            error(500, 'Ошибка во время обработки файла');
        }
    } else {
        error(404, `Не удалось найти указанный файл`)
    }
}