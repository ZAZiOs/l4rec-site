<script>
import { page } from '$app/stores';
    
const url = $page.url;
</script>

<svelte:head>
	<title>Live4Records Staff Login</title>
</svelte:head>

<div class="container d-flex justify-content-center">

<div class="border rounded bg-dark-subtle mt-5 px-3 pt-2 pb-3">
<h4 class="w-100 text-center">Вход</h4>

{#if url.searchParams.get('nodata') == ''}
<div class="text-center text-danger">Ошибка: Введено не всё</div>
{:else if url.searchParams.get('nouser') == ''}
<div class="text-center text-danger">Такого пользователя нет.</div>
{:else if url.searchParams.get('wrongpass') == ''}
<div class="text-center text-danger">Неправильный пароль.</div>
{:else if url.searchParams.get('noaccept') == ''}
<div class="text-center text-warning">Ваша заявка ещё не принята.</div>
{:else if url.searchParams.get('unauthorized') == ''}
<div class="text-center text-warning">Сессия неактивна.<br><small>Пожалуйста войдите ещё раз.</small></div>
{:else if url.searchParams.get('logout') == ''}
<div class="text-center text-success">Вы вышли.</div>
{/if}

{#if !(url.searchParams.get('done') == '')}
<form class="mt-3" method="POST" action="/login?/login">

<div class="input-group mb-2"><span class="input-group-text" id="basic-addon1"><i class="bi bi-at"></i></span>
<input type="text" class="form-control" placeholder="Логин" name="login"></div>

<div class="input-group mb-3"><span class="input-group-text" id="basic-addon1"><i class="bi bi-shield-lock-fill"></i></span>
<input type="password" class="form-control" placeholder="Пароль" name="pass"></div>
<!--<sup class="text-secondary mb-3">Будьте внимательны, пароль не скрывается</sup>-->

<div class="d-flex justify-content-between">
<a href="/register" class="btn btn-outline-secondary me-1">Регистрация</a>
<button type="submit" class="btn btn-primary ms-1">Войти</button> 
</div>
</form>
{:else}
<div class="text-center text-secondary"><b class="text-success">Вы успешно зарегистрированы.</b><br> Ожидайте активации аккаунта.<br> <i>(А лучше сообщите админам что вы регнулись)</i></div>
{/if}
</div>
    
</div>