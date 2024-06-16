<script>
export let data;
import { page } from '$app/stores';

function countDone(ep_list) {
    let count = 0
    for (let ep in ep_list) {
        if (ep_list[ep].status == 'done') {
            count++
        }
    }
    return count
}

const url = $page.url;
</script>

<svelte:head>
	<title>Live4Records Staff</title>
</svelte:head>

<div class="container">
<div class="d-flex align-items-center justify-content-between mt-2">
<h3 class="m-0">Привет, {data.user.username}! 
    {#if data.user.roles.includes('admin')}<small class="fs-6 d-block">Ахуеть, ты чё, пришёл работать?????</small>{/if}
</h3>

{#if data.user.roles.includes('admin') || data.user.roles.includes('curator')}
<div><a href="/staff/add-new" data-sveltekit-reload class="btn btn-outline-success">Добавить новый проект</a></div>
{/if}
{#if data.user.roles.includes('admin')}
<div><a href="/staff/admin-panel" data-sveltekit-reload class="btn btn-outline-info">Управление сайтом</a></div>
{/if}
<div><a href="/logout" class="btn btn-outline-secondary">Нажмите сюда чтобы выйти</a></div>
</div>
<hr class="mt-2 mb-1">
{#if url.searchParams.get('not-allowed') == ''}
<div class="alert alert-warning alert-dismissible fade show" role="alert">
    <strong>Доступ запрещён.</strong> Ваша роль не позволяет получить доступ к этой странице.
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>
{/if}
{#if url.searchParams.get('success') == ''}
<div class="alert alert-success alert-dismissible fade show" role="alert">
    <strong>Операция проведена успешно.</strong>
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>
{/if}

{#if url.searchParams.get('error-parsing-main')}
<div class="alert alert-danger alert-dismissible fade show" role="alert">
    <strong>Произошла ошибка во время сохранения проекта. Подробнее ниже.</strong>
    <hr class="my-2">
    <div>{url.searchParams.get('error-parsing-main')}</div>
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>
{/if}

<h3>Активные проекты:</h3>
<div class="row g-3 mb-5 mt-3 justify-content-center">
{#each data.projects as proj}
{#if !proj.archived}
<div class="col-md-4 d-flex justify-content-center">
    <div class="card" style="max-width: 20rem;">
        <div class="card-header">
            {proj.title}
        </div>
        <img src={proj.thumbnail.replace('static', '')} class="img-cropped" alt="Кирби звездопад">
        <div class="card-body pb-0">
            <p class="card-text">Сделано {countDone(proj.episode_list)} из {Object.keys(proj.episode_list).length} запланированных эпизодов</p>
        </div>
        <div class="progress m-2" role="progressbar">
        <div class="progress-bar progress-bar-striped progress-bar-animated" style="width: {Math.round(countDone(proj.episode_list) / Object.keys(proj.episode_list).length * 100)}%; background-color: {proj.progress_color}"> { Math.round(countDone(proj.episode_list) / Object.keys(proj.episode_list).length * 100)}% </div>
        </div>
        <a href="/staff/project/{proj.id}" class="text-decoration-none text-center">
        <div class="card-footer">
            Открыть
        </div>
        </a>
    </div>
</div>

{/if}

{/each}
</div>
{#if data.user.roles.includes('admin') && data.projects.find((e) => e.archived)}
<hr>

<h4 class="opacity-50">Архив:</h4>


<div class="border rounded bg-dark-subtle opacity-50 py-3 px-4 row g-3 mb-5 mt-3 justify-content-center">
{#each data.projects as proj}
{#if proj.archived}
<div class="col-md-4 d-flex justify-content-center">
    <div class="card" style="max-width: 20rem;">
        <div class="card-header">
            {proj.title}
        </div>
        <img src={proj.thumbnail.replace('static', '')} class="img-cropped" alt="Кирби звездопад">
        <div class="card-body pb-0">
            <p class="card-text">Сделано {countDone(proj.episode_list)} из {Object.keys(proj.episode_list).length} запланированных эпизодов</p>
        </div>
        <div class="progress m-2" role="progressbar">
        <div class="progress-bar progress-bar-striped progress-bar-animated" style="width: {Math.round(countDone(proj.episode_list) / Object.keys(proj.episode_list).length * 100)}%; background-color: {proj.progress_color}"> { Math.round(countDone(proj.episode_list) / Object.keys(proj.episode_list).length * 100)}% </div>
        </div>
        <a href="/staff/project/{proj.id}" class="text-decoration-none text-center">
        <div class="card-footer">
            Открыть
        </div>
        </a>
    </div>
</div>

{/if}
{/each}
</div>
{/if}
</div>


<style>
.img-cropped {
    object-fit: cover;
    object-position: center center;
    width: 100%;
    height: auto;
    max-height: 20rem;
}
</style>