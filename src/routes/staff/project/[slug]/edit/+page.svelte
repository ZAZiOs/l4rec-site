<script>
export let data
import { prettyPrintJson } from 'pretty-print-json';
const { project, user, user_list } = data
let save_data = JSON.stringify(project)

import { browser } from '$app/environment';
import { page } from '$app/stores';
const url = $page.url;

let thumb = ""
let thumb_card = ""
let thumb_input = {}
let showImage = false

let left_c_page = 'episodes'
let right_c_page = 'roles'
let debug_unlocked = false

let temp_role = { actor:'unset' }
let temp_role_key = ""
let show_delete_prompt = ''


function countDone(ep_list) {
    let count = 0
    for (let ep in ep_list) {
        if (ep_list[ep].status == 'done') {
            count++
        }
    }
    return count
}

function onChange() {
    const file = thumb_input.files[0];
    if (file) {
	  showImage = true;

      const reader = new FileReader();
      reader.addEventListener("load", function () {
        try {thumb_card.setAttribute("src", reader.result)} catch {}
        thumb.setAttribute("src", reader.result);
      })
      reader.readAsDataURL(file);
			
			return;
    } 
		showImage = false; 
  }

function onChangePage(event) {
    right_c_page = event.currentTarget.value;
}

function onRolesEdit(obj, role) {
    if (obj) {
        if (role in obj) {
            delete obj[role]
        } else {
            obj[role] = {
                audio: "",
                done: false
            }
        }
    } else {
        obj[role] = {
            audio: "",
            done: false
        }
    }
    project.roles = project.roles
}

function addEpisode() {
    const pr_keys = Object.keys(project.episode_list)

    let num = Number(pr_keys[pr_keys.length - 1].replace('ep', '')) + 1
    project.episode_list['ep' + num] = {
        name: "Эпизод " + num,
        status: "planned",
        roles: {},
        translation: {
            done: false,
            files: [],
            commentary: "",
        },
        snd_dir: {
            done: false,
            commentary: "",
        },
        video_edit: {
            done_video: false,
            done_audio: false,
            commentary: "",
        },
    }
}

function removeEpisode(ep) {
    if (Object.keys(project.episode_list).length > 1) {
        delete project.episode_list[ep]
        right_c_page = 'roles'
        project.episode_list = project.episode_list
    } else {
        console.error('CANT REMOVE LAST EPISODE, INSTEAD USE DELETE PROJECT')
    }
}

function addRole() {
    if (!project.roles) {
        project.roles = {}
    } 
    project.roles[temp_role_key] = temp_role; 
    temp_role_key = ""; 
    temp_role = {actor:'unset'}; 
    project.roles = project.roles
}

</script>

<svelte:head>
	<title>Настройки проекта «{project.title}»</title>
</svelte:head>

<div class="container">
<div class="d-flex justify-content-between align-items-center mt-2">
<h1>Настройки проекта «{project.title}» 
{#if url.searchParams.get('/save') == ''}
<span class="text-success fs-5 hide-5s">
<i class="bi bi-floppy-fill"></i> <i class="bi bi-arrow-right"></i> <i class="bi bi-check-circle-fill me-1"></i>
</span>
{/if}
</h1>
<div class="d-flex">
<button class="btn btn-outline-danger me-1" on:click={() => right_c_page = 'delete'}><i class="bi bi-x-circle-fill"></i></button>
<form method="POST" action="?/save" enctype="multipart/form-data">
<button class="btn btn-outline-success" on:click={() => save_data = JSON.stringify(project)}><i class="bi bi-floppy-fill"></i></button>
<input type="text" name="main" bind:value={save_data} style="display: none">
</form>
</div>
</div>
<div class="d-flex w-100 mb-3">
<div class="left-container border rounded bg-dark-subtle p-2">


<!--
###   
###  Левая сторона
###
-->

{#if left_c_page == 'main'}



<button class="btn btn-outline-primary mb-2 w-100" on:click={() => left_c_page = 'episodes'}> Остальные настройки » </button>
<form method="POST" action="?/save" enctype="multipart/form-data">
<div class="mb-1">
    {#if showImage}
    <img bind:this={thumb} src="" class="rounded img-fluid mb-2 w-100" alt={project.title + ' Превью'}>
    {:else}
    <img src={data.project.thumbnail} class="rounded img-fluid mb-2 w-100" alt={project.title + ' Превью'}>
    {/if}
    <input type="file" class="form-control" accept="image/*" name="thumbnail" bind:this={thumb_input} on:change={onChange}>
</div>
<small class="text-secondary lh-1">Сохранить проект с изменением изображения можно только нажав кнопку сохранить снизу. Извините, не могу это пофиксить(</small>
<hr class="my-2">
<div class="mb-1">
    <label for="title" class="form-label">Название проекта:</label>
    <input type="text" class="form-control" bind:value={project.title} placeholder="Название проекта" name="title">
</div>
<div class="mb-2">
    <label for="title" class="form-label mb-1">Цвет полоски прогресса:</label>
    <div class="progress" role="progressbar" style="height: auto; ">
        <input type="color" class="form-control form-control-color w-100 progress-bar progress-bar-striped progress-bar-animated" 
        style="background-color: {project.progress_color}; padding: calc(1rem + calc(var(--bs-border-width)* 2));" 
        bind:value={project.progress_color} placeholder="Цвет полоски" name="color">
    </div>
    <div id="passwordHelpBlock" class="form-text">
        Нажмите для изменения ^
    </div>
</div>

<div class="btn-group w-100 mb-3" role="group">
<input type="checkbox" class="btn-check" id="public" bind:checked={project.public}>
<label class="btn btn-outline-success" for="public">Опубликовать</label>

<input type="checkbox" class="btn-check" id="archived" bind:checked={project.archived}>
<label class="btn btn-outline-warning" for="archived">В архиве</label>
</div>


<button class="btn btn-success w-100" on:click={() => save_data = JSON.stringify(project)}>Сохранить</button>
<input type="text" name="main" bind:value={save_data} style="display: none">
</form>



{:else if left_c_page = 'episodes'}

<button class="btn btn-outline-primary mb-2 w-100" on:click={() => left_c_page = 'main'}> « Основные настройки </button>

<div class="btn-group-vertical w-100" role="group" aria-label="Vertical button group">
    <button class={right_c_page == 'main' ? "btn btn-success" : "btn btn-outline-success"}  on:click={() => right_c_page = 'main'} on:keydown|preventDefault={(e) => {if (e.key == 'D' || e.key == 'd' || e.key == 'в' || e.key == 'В') {right_c_page = 'debug'; debug_unlocked = true}}}> Главная </button>
    {#if debug_unlocked}
    <button class={right_c_page == 'debug' ? "btn btn-warning" : "btn btn-outline-warning"} on:click={() => right_c_page = 'debug'}> Дебаг </button>
    {/if}
    <button class={right_c_page == 'roles' ? "btn btn-info" : "btn btn-outline-info"} on:click={() => right_c_page = 'roles'}> Роли </button>
{#each Object.keys(project.episode_list) as ep} 
    <button class={right_c_page == ep ? "btn btn-secondary text-truncate" : "btn btn-outline-secondary text-truncate"} on:click={() => right_c_page = ep}> {project.episode_list[ep].name} </button>
{/each}
</div>

<button class="btn btn-outline-success mt-2 w-100" on:click={addEpisode}> + Добавить эпизод</button>

{/if}
</div>

<!--
###   
###  Правая сторона
###
-->

<div class="right-container border rounded px-4 pt-2 pb-4 bg-dark-subtle">
{#if right_c_page == 'debug'}
<h2>Настройки эпизодов » <span class="text-secondary">Дебаг</span></h2>
<div class="d-flex">

    <div class="border p-2 rounded w-25">
        <h4 class="border-bottom pb-2 mb-0">Users:</h4>
        <code class="debug d-block">{@html prettyPrintJson.toHtml(user_list).replaceAll('\n', "<br>").replaceAll('  ', "&emsp;")}</code>
    </div>
    <div class="border p-2 rounded w-75" style="">
        <h4 class="border-bottom pb-2 mb-0">Project: <small>(можно листать)</small></h4>
        <code class="debug d-block">{@html prettyPrintJson.toHtml(project).replaceAll('\n', "<br>").replaceAll('  ', "&emsp;")}</code>
    </div>

</div>
{:else if right_c_page == 'main'}
<h2>Настройки эпизодов » <span class="text-secondary">Сводка</span></h2>

<div class="d-flex flex-column align-items-center">
<h1>Так карточка будет выглядеть:</h1>
<div class="col-md-4 d-flex justify-content-center">
    <div class="card" style="width: 50rem;">
        <div class="card-header">
            {project.title}
        </div>
        {#if showImage}
            <img bind:this={thumb_card} src="" class="img-cropped" alt={project.title + ' Превью'}>
        {:else}
            <img src={data.project.thumbnail} class="img-cropped" alt={project.title + ' Превью'}>
        {/if}
        <div class="card-body pb-0">
            <p class="card-text">Сделано {countDone(project.episode_list)} из {Object.keys(project.episode_list).length} запланированных эпизодов</p>
        </div>
        <div class="progress m-2" role="progressbar">
        <div class="progress-bar progress-bar-striped progress-bar-animated" style="width: {Math.round(countDone(project.episode_list) / Object.keys(project.episode_list).length * 100)}%; background-color: {project.progress_color}"> { Math.round(countDone(project.episode_list) / Object.keys(project.episode_list).length * 100)}% </div>
        </div>
        {#if project.archived}
        <div class="card-footer text-center">
            Архив
        </div>
        {:else}
        <div class="card-footer text-center text-info">
            Открыть
        </div>
        {/if}
    </div>
</div>
</div>


{:else if right_c_page == 'roles'}
<h2>Настройки эпизодов » <span class="text-secondary">Роли и актёры</span></h2>

<form class="input-group mb-3" novalidate>
    <input type="text" class="form-control" placeholder="id" bind:value={temp_role_key} required>
    <input type="text" class="form-control" placeholder="Название" bind:value={temp_role.name} required>
    <select class="form-select" id="inputGroupSelect01" bind:value={temp_role.actor} required>
        {#each user_list as user}
        <option value={user.login}>{user.username} <sub class="text-secondary">(@{user.discord})</sub></option>
        {/each}
        <option value="unset">Заглушка <sub class="text-secondary">(Нет актёра)</sub></option>
    </select>
    <button type="submit" class="btn btn-outline-success" disabled={!Boolean(temp_role_key && temp_role.name && temp_role.actor)} on:click={() => {addRole()}}>+</button>
</form>
    
{#if project.roles}
{#each Object.keys(project.roles) as role}
<div class="input-group mb-1 bg-dark-subtle rounded">
<label class="input-group-text bg-light-subtle" for="inputGroupSelect01">{role}</label>
<input type="text" class="form-control bg-dark-subtle" placeholder="Название" name="title" bind:value={project.roles[role].name}>
<select class="form-select bg-dark-subtle" id="inputGroupSelect01" bind:value={project.roles[role].actor}>
    {#each user_list as user}
    <option value={user.login}>{user.username} <sub class="text-secondary">(@{user.discord})</sub></option>
    {/each}
    <option value="unset">Заглушка</option>
</select>
<button class="btn btn-outline-danger" on:click={() => {delete project.roles[role]; project.roles = project.roles}}>X</button>
</div>
{/each}
{/if}

{:else if right_c_page.includes('ep') && !right_c_page.includes('delete')}

<div class="d-flex justify-content-between align-items-center">
<h2 class="text-truncate">Настройки эпизодов » <span class="text-secondary">{project.episode_list[right_c_page].name}</span></h2>
<h2 style="white-space: nowrap">{#if Object.keys(project.episode_list).length > 1}
    <button class="ms-1 btn btn-outline-danger" 
    on:keydown|preventDefault={(e) => {if (e.key == 'Control') {removeEpisode(right_c_page)}}}
    on:click={(e) => { right_c_page = `delete-${right_c_page}`}}
    >
        Удалить эпизод<i class="ms-2 bi bi-x-circle-fill"></i></button>
    {:else}
    <button class="ms-1 btn btn-outline-danger" disabled>Нельзя удалить последний эпизод<i class="ms-2 bi bi-x-circle-fill"></i></button>
    {/if}</h2>
</div>

<div class="d-flex align-items-center mb-2">
    <div class="input-group">
    <span class="input-group-text" id="basic-addon1"><i class="bi bi-tag-fill"></i></span>
    <input type="text" class="form-control" placeholder="Название" name="title" bind:value={project.episode_list[right_c_page].name}>
    <select class="form-select" id="inputGroupSelect01" bind:value={project.episode_list[right_c_page].status}>
        <option value="planned">В планах</option>
        <option value="translating">Переводится</option>
        <option value="dubbing">Озвучивается</option>
        <option value="snd_dir">Звукорежиссура</option>
        <option value="done">Готов</option>
        <option value="needs_remake">Нужно переделать</option>
    </select>
    <label class="input-group-text" for="inputGroupSelect01"><i class="bi bi-compass-fill"></i></label>
    </div>
</div>

<div class="input-group mb-3">
    
    
</div>


{#if project.roles}
Персонажи в серии: <span class="text-secondary">(Будьте аккуратнее - снятие флажка = потеря ссылки на файл)</span><br>


<div class="row row-cols-2">
{#each Object.keys(project.roles) as rl}

<div class="input-group mb-2 сol w-50 flex-nowrap pe-0">
    <div class="input-group-text">
        {#if project.episode_list[right_c_page].roles}
        <input type="checkbox" checked={rl in project.episode_list[right_c_page].roles} 
        on:change={() => onRolesEdit(project.episode_list[right_c_page].roles, rl)}>
        {:else}
        <input type="checkbox" on:change={() => {project.episode_list[right_c_page].roles = {}; onRolesEdit(project.episode_list[right_c_page].roles, rl)}}>
        {/if}
    </div>
    <div class="input-group-text w-100">
        {project.roles[rl].name}
    </div>
    {#if project.episode_list[right_c_page].roles}
        {#if project.episode_list[right_c_page].roles[rl]}
        {#if project.episode_list[right_c_page].roles[rl].audio != ""}
        <a href={"/api/get/private?file=" + project.episode_list[right_c_page].roles[rl].audio} class="btn btn-outline-primary w-75">Файл присутствует</a>
        {:else}
        <span class="btn btn-outline-primary disabled w-75" aria-disabled="true">Файла нет</span>
        {/if}
        {:else}
        <span class="btn btn-outline-danger disabled w-75" aria-disabled="true">Не выбран</span>
        {/if}
    {:else}
    <span class="btn btn-outline-danger disabled w-75" aria-disabled="true">Не выбран</span>
    {/if}
</div>

{/each}
</div>
{:else}
<i class="text-secondary text-center w-100 d-block">Кажись тут ничего нет... Попробуйте добавить роль?</i>
{/if}


{:else if right_c_page.includes('delete-')}
<h2>Настройки эпизодов » <span class="text-danger opacity-75">Удаление «{project.episode_list[right_c_page.replace('delete-', '')].name}»</span></h2>
<hr>
<h3 class="shake" style="width: fit-content">Вы уверены что хотите удалить этот эпизод?</h3>
<b class="">Удаляя эпизод вы не сможете его восстановить. Однако, данные об эпизоде останутся на сервере. (Это значит что ссылки на загрузку аудиофайлов актёров всё ещё будут жить)</b>
<br>
<small class="text-secondary">Это меню можно пропустить если нажимать кнопку удалить зажав Ctrl</small><br>
<button class="btn btn-outline-danger mt-2" 
on:click=   {() => {removeEpisode(right_c_page.replace('delete-', ''))}}>Да-да-да... Удаляй уже.</button>


{:else if right_c_page == 'delete'}
<h2>Настройки проекта » <span class="text-danger opacity-75">Удаление</span></h2>
<hr>
<h3 class="shake" style="width: fit-content">Вы уверены что хотите удалить проект?</h3>
<b class="fs-5">Удаляя проект вы должны понимать следующее:</b>

<ul>
<li>Проект <b>НЕВОЗМОЖНО</b> восстановить</li>
<li><b>АБСОЛЮТНО ВСЕ</b> данные по этому проекту, что хранятся на сервере - <b class="text-danger ">будут удалены.</b></li>
<li>После удаления не надо просить разраба вернуть проект, его <b>НЕТ</b>, восстановление <b>НЕ-ВО-ЗМО-ЖНО</b></li>
<li>Возможно вы будете сожалеть об этом решении, не лучше ли отправить проект <b class="text-warning">в архив?</b></li>
</ul>

<i class="d-block text-secondary mb-2">Если вы обдумали своё решение и оно финальное - введите название проекта ниже.</i>
<form method="POST" action="?/delete" enctype="multipart/form-data" >
    <div class="input-group w-50">
        <span class="input-group-text" id="basic-addon1"><i class="bi bi-tag-fill"></i></span>
        <input type="text" placeholder="Название проекта" bind:value={show_delete_prompt} class="form-control">
        <button class="btn btn-outline-danger me-1" disabled={!(show_delete_prompt == project.title)}><i class="bi bi-x-circle-fill"></i></button>
    </div>
    <input type="text" name="pr_id" value={project.id} style="display: none">
</form>
{/if}
</div>
</div>
</div>

<style>

@keyframes tilt-n-move-shaking {
  0% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(1px, 1px) rotate(0deg); }
  50% { transform: translate(0, 0) rotate(0deg); }
  75% { transform: translate(-1px, 1px) rotate(0deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
}

@keyframes hideanim {
  0% { opacity: 100% }
  100% { opacity: 0% }
}

.shake {
    animation: tilt-n-move-shaking .2s infinite;
}


.left-container {
    max-width: 18rem;
    margin-right: 0.5rem;
    max-height: 50rem;
    overflow-y: scroll;
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
}

.left-container::-webkit-scrollbar {
  display: none; /*Chrome, Safari and Opera*/
}

.right-container {
    width: calc(100% - 19rem);
    max-height: 50rem;
    margin-left: 0.5rem;
    background: #1a1d2088;
    transition: all linear 1s;
}

.img-cropped {
    object-fit: cover;
    object-position: center center;
    width: 100%;
    height: auto;
    max-height: 20rem;
}
.debug {
    overflow-y: scroll; 
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
    height: 40rem;
    color: darkgray;
}

.debug::-webkit-scrollbar {
  display: none; /*Chrome, Safari and Opera*/
}

.hide-5s {
    animation: hideanim .2s forwards;
    animation-delay: 3s;
}
</style>