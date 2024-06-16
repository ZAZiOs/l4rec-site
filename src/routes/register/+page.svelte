<script>
import { page } from '$app/stores';
 
const url = $page.url;

let pass1 = ''
let pass2 = ''
</script>

<svelte:head>
	<title>Live4Records Staff Register</title>
</svelte:head>

<div class="container d-flex justify-content-center">

<div class="border rounded bg-dark-subtle mt-5 px-3 pt-2 pb-3">
<h4 class="w-100 text-center">Регистрация</h4>

{#if url.searchParams.get('nodata') == ''}
<div class="text-center text-danger">Ошибка: Введено не всё</div>
{:else if url.searchParams.get('exist') == ''}
<div class="text-center text-danger">Ошибка: Уже зарегистрирован</div>
{/if}

{#if !(url.searchParams.get('done') == '')}
<form class="mt-3" method="POST" action="/login?/register">

<div class="input-group mb-2"><span class="input-group-text" id="basic-addon1"><i class="bi bi-at"></i></span>
<input type="text" class="form-control" placeholder="Логин" name="login"></div>

<div class="input-group mb-2"><span class="input-group-text" id="basic-addon1"><i class="bi bi-person-circle"></i></span>
<input type="text" class="form-control" placeholder="Имя в титрах" name="username"></div>

<div class="input-group mb-3"><span class="input-group-text" id="basic-addon1"><i class="bi bi-discord"></i></span>
<input type="text" class="form-control" placeholder="Ваш @discord" name="discord_tag"></div>

<div class="input-group mb-2"><span class="input-group-text" id="basic-addon1"><i class="bi bi-shield-lock-fill"></i></span>
<input type="password" class="form-control" placeholder="Пароль" name="pass" bind:value={pass1}></div>
<!--<sup class="text-secondary mb-3">Будьте внимательны, пароль не скрывается</sup>-->

<div class="input-group mb-3"><span class="input-group-text" id="basic-addon1"><i class="bi bi-shield-fill-check"></i></span>
    <input type="password" class="form-control" placeholder="Повторите пароль" bind:value={pass2}></div>

<div class="d-flex justify-content-between">
<div class="d-flex flex-column">
<button type="submit" class="btn btn-primary me-1 glow" disabled={!(pass2 === pass1 && pass1 != '' && pass2 != '')}>Оставить заявку</button>
<small class="text-secondary">Если не горит - пароль не совпал.</small>
</div>
<div class="d-flex flex-column">
<a href="/login" class="btn btn-outline-secondary ms-1 glow">Вход</a>
<small></small>
</div>
</div>
</form>
{:else}
<div class="text-center text-secondary"><b class="text-success">Вы успешно зарегистрированы.</b><br> Ожидайте активации аккаунта.<br> <i>(А лучше сообщите админам что вы регнулись)</i></div>
{/if}
</div>
    
</div>


<style>

.glow:disabled {
    box-shadow: none;
}
.glow {
    box-shadow: 0px 0px .5rem .1rem var(--bs-btn-bg);
}
</style>