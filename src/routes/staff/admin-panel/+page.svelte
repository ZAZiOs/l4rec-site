<script>
    import { browser } from '$app/environment';
export let data
const { user, user_list } = data

let cur_page = 'users'

//Users
let user_page = '0'
let password = ''
let show_user_save_done = false
let available_roles = {
	admin: "Админ", 
	translator: "Переводчик", 
	actor: "Актёр", 
	snd_dir: "Звукарь", 
	curator: "Куратор",
	video_edit: "Монтаж"
}
let page_load_finished = false

if (browser) {
	async function init(){
		await new Promise(r => setTimeout(r, 500));
		page_load_finished = true
	}
	init()
}


import { page } from '$app/stores';
const url = $page.url;

if (url.searchParams.get('saved_user')) {
	let s_us = url.searchParams.get('saved_user')
	let s_id = NaN
	user_list.find((o, i) => {
		if (o.login === s_us) {
			s_id = i
	}});
	if (s_id || s_id == 0) {
		user_page = String(s_id)
		show_user_save_done = true
	}
}

</script>

<svelte:head>
	<title>Управление сайтом</title>
</svelte:head>

<div class="container mt-3">
{#if cur_page == 'main'}
<div class="border rounded mt-3 px-5 py-4 bg-dark-subtle">

<h1>Добро пожаловать в админ-панель.</h1>
<h4>По-факту я не знаю что тут разместить... Так что будет только одна кнопка</h4>
<div class="d-flex justify-content-center flex-row w-100 mt-4">
<button class="btn btn-outline-success mb-2" on:click={() => cur_page = 'users'}>Открыть список пользователей</button>
</div>
</div>


{:else if cur_page == 'users'}
<div class="d-flex justify-content-between align-items-center">
	<h1>Настройки пользователей</h1>
	<button class="btn btn-outline-success d-block" on:click={() => cur_page = 'main'}>Назад</button>
</div>

<div class="d-flex">
<div class="w-25 me-1 border rounded px-3 py-2 bg-dark-subtle">
	<div class="btn-group-vertical w-100" role="group" aria-label="Vertical button group">
	{#each Object.keys(user_list) as us} 
		<button class={user_page == us ? "btn btn-secondary text-truncate" : "btn btn-outline-secondary text-truncate"} on:click={() => user_page = us}> {user_list[us].username} </button>
	{/each}
	</div>
</div>
<div class="w-75 ms-1 border rounded px-3 py-2 bg-dark-subtle">
	{#if user_page && user_list[user_page]}
	<div class="d-flex justify-content-between">
	<h3 class="text-truncate">Пользователь «{user_list[user_page].username}»</h3>
	{#if show_user_save_done}
	<div style="width: 5rem" class="ms-1">
	<span class="text-warning fs-5 hide-5s">
		<i class="bi bi-floppy-fill"></i> <i class="bi bi-arrow-right"></i> <i class="bi bi-check-circle-fill me-1"></i>
	</span>
	</div>
	{/if}
	</div>
	<div class="d-flex justify-content-between">
	<form class="w-75" method="POST" action="?/save_user">
	<input class="d-none" type="text" bind:value={user_list[user_page].login} name="login">
	<div class="w-75">
	<div class="input-group mb-2">
		<span class="input-group-text" id="basic-addon1"><i class="bi bi-person-fill"></i></span>
		<input type="text" class="form-control" placeholder="Имя пользователя" name="username" bind:value={user_list[user_page].username}>
	</div>
	<div class="input-group mb-2">
		<span class="input-group-text" id="basic-addon1"><i class="bi bi-discord"></i></span>
		<input type="text" class="form-control" placeholder="Discord" name="discord" bind:value={user_list[user_page].discord}>
	</div>
	<div class="input-group mb-2">
		<span class="input-group-text" id="basic-addon1"><i class="bi bi-shield-lock-fill"></i></span>
		<input type="text" class="form-control" placeholder="Сменить пароль" name="pass" bind:value={password}>
	</div>
	</div>
	

	<div class="btn-group mb-2 d-block" role="group">
		{#each Object.keys(available_roles) as role}
		<input type="checkbox" class="btn-check" value={role} id={role} bind:group={user_list[user_page].roles}>
		<label class="btn btn-outline-secondary" style="margin-right: -.28rem" for={role}>{available_roles[role]}</label>
		{/each}
	</div>
	
	<div class="btn-group mb-2" role="group">
		<input type="checkbox" class="btn-check" id="accept" autocomplete="off" bind:checked={user_list[user_page].accepted} name="accepted">
		<label class={user_list[user_page].accepted ? "btn btn-outline-success" : "btn btn-outline-danger"} for="accept">
			{#if user_list[user_page].accepted}
			Заявка принята
			{:else}
			Принять заявку
			{/if}
		</label>
	</div>

	<form method="POST" action="?/reset_token" class="d-inline">
		<input class="d-none" type="text" bind:value={user_list[user_page].login} name="login">
		<button class="btn btn-warning mb-2">Сбросить сессии</button>
	</form>

	<input type="text" value={JSON.stringify(user_list[user_page].roles)} class="d-none" name="roles">

	{#if page_load_finished}<button class="btn btn-primary mb-2 show-1s">Сохранить</button>{/if}
	</form>
	<div class="w-25">
		<i class="text-secondary">На логине завязано много кода, так что его изменение может сломать сайт.<br> Если действительно нужно подменить логин - делать это надо вручную в базе данных.</i>
	</div>
	</div>
	{/if}
</div>
</div>



{/if}
</div>


<style>

@keyframes hideanim {
  0% { opacity: 100% }
  99% { opacity: 0% }
  100% { opacity: 0%; display: none}
}

@keyframes showanim {
  0% { opacity: 0% }
  99% { opacity: 100% }
  100% { opacity: 100% !important }
}

.show-1s {
	animation: showanim .5s both;
}



.hide-5s {
    animation: hideanim .2s forwards;
    animation-delay: 3s;
}
</style>