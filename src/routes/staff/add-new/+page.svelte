<script lang="ts">
import { browser } from "$app/environment";
import { goto } from "$app/navigation";
const called = {
    done: 0
}

if (browser) {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
}

import { page } from '$app/stores';
const url = $page.url;

let episodes = 1
let name = ""
let projid = ""
let thumb = ""
let color_val = "#005250"


</script>

<svelte:head>
	<title>Добавление нового проекта</title>
</svelte:head>

<div class="container mt-4 d-flex flex-column align-items-center">

{#if url.searchParams.get('no-file') == ''}
<div class="alert alert-danger alert-dismissible fade show" role="alert">
    <strong>Операция была прервана.</strong> Нет изображения.
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>
{:else if url.searchParams.get('file-not-image') == ''}
<div class="alert alert-danger alert-dismissible fade show" role="alert">
    <strong>Операция была прервана.</strong> Файл не изображение.
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>
{:else if url.searchParams.get('not-full-input') == ''}
<div class="alert alert-danger alert-dismissible fade show" role="alert">
    <strong>Операция была прервана.</strong> Заполнены не все поля.
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>
{:else if url.searchParams.get('already-exist') == ''}
<div class="alert alert-danger alert-dismissible fade show" role="alert">
    <strong>Операция была прервана.</strong> Проект с таким идентификатором уже существует.
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>
{/if}
<h3>Добавление нового проекта</h3>
<small class="text-center">Справка по каждому из пунктов появляется при наведении</small>
<form method="POST" action="/staff/add-new?/add" class="mt-2 d-flex flex-column" enctype="multipart/form-data">

<div class="d-flex align-items-center mb-2">
<div class="input-group"
data-bs-toggle="tooltip" data-bs-html="true" data-bs-placement="left" data-bs-title="
Используется в системе, например в ссылках (<code>/staff/projects/<b>kirby</b></code>)<br>
<b class='opacity-50'>Писать без пробелов, латиницей, нельзя изменить в будущем.</b>">
<span class="input-group-text" id="basic-addon1"><i class="bi bi-code-slash"></i></span>
<input type="text" class="form-control" placeholder="Идентификатор" name="project_id" bind:value={projid}>
</div>
</div>

<div class="d-flex align-items-center mb-2">
<div class="input-group"
data-bs-toggle="tooltip" data-bs-html="true" data-bs-title="
Название проекта. Отображается на сайте" data-bs-placement="right">
<span class="input-group-text" id="basic-addon1"><i class="bi bi-tag-fill"></i></span>
<input type="text" class="form-control" placeholder="Название" name="title" bind:value={name}>
</div>
</div>

<div class="d-flex align-items-center mb-2" >
<div class="input-group"
data-bs-toggle="tooltip" data-bs-html="true" data-bs-title="
Количество серий.<br><b>Число не должно быть дробным!</b>" data-bs-placement="left">
<span class="input-group-text" id="basic-addon1"><i class="bi bi-camera-reels-fill"></i></span>
<input type="number" min=1 step="1" class="form-control" placeholder="Количество эпизодов" name="episodes" bind:value={episodes}>
</div>
</div>

<div class="d-flex align-items-center mb-2">
<div class="input-group"
data-bs-toggle="tooltip" data-bs-html="true" data-bs-title="
Цвет полоски прогресса" data-bs-placement="right">
<span class="input-group-text" id="basic-addon1"><i class="bi bi-palette-fill"></i></span>
<div class="progress" role="progressbar" style="height: auto; width: calc(100% - 2.6rem);">
    <input type="color" class="form-control form-control-color w-100 progress-bar progress-bar-striped progress-bar-animated" 
    style="background-color: {color_val}; padding: calc(1rem + calc(var(--bs-border-width)* 2));border-top-left-radius: 0;border-bottom-left-radius: 0;" 
    bind:value={color_val} placeholder="Название проекта" name="progress_color">
</div>
</div>
</div>
<!--<div class="progress mb-2" role="progressbar">
    <div class="progress-bar progress-bar-striped progress-bar-animated" style="width: 100%; background-color: {color_val}"> Пример: 100% </div>
</div>-->

<div class="input-group mb-3"
data-bs-toggle="tooltip" data-bs-html="true" data-bs-title="
Изображение-обложка для проекта. <br>Основное изображение что показывается на карточках и в меню проекта." data-bs-placement="left">
    <span class="input-group-text"><i class="bi bi-card-image"></i></span>
    <input type="file" class="form-control" accept="image/*" name="thumbnail" bind:value={thumb}>
</div>

<button type="submit" class="btn btn-success" disabled={!Boolean(name && projid && episodes && thumb)}>Опубликовать</button>
</form>
</div>