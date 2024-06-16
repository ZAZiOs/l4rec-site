<script>
import { page } from '$app/stores';
const url = $page.url;

export let data
const { project, user } = data
function countDone(ep_list) {
  let count = 0
  for (let ep in ep_list) {
      if (ep_list[ep].status == 'done') {
          count++
      }
  }
  return count
}

let cur_roles = []
for (let role in project.roles) {
  if (project.roles[role].actor == user.login) {
    cur_roles.push(role)
  }
}

let innerWidth = 0
let mobile_page = 'select'


</script>
  
<svelte:head>
  <title>Данные проекта «{project.title}»</title>
</svelte:head>

<svelte:window bind:innerWidth/>


<div class="container_special">
{#if innerWidth < 1000}
<!-- МОБИЛЬНАЯ ОРИЕНТАЦИЯ -->
<div class="d-flex mt-4">
  <!--
###
### Левый контейнер
###
  -->
  {#if mobile_page == 'select'}
  <div class="w-100 border rounded bg-dark-subtle p-2">
    <div class="rounded p-1" style="background-color: #00000040">
    <button class="btn p-0 w-100 collapse_arrow" type="button" data-bs-toggle="collapse" data-bs-target="#main_stuff">
      <i class="bi bi-chevron-double-up"></i>
    </button>
    <div class="collapse" id="main_stuff">
    <img src={project.thumbnail} alt="Обложка {project.title}" class="img-fluid rounded">
    <h3 class="m-0 mt-2 text-center">{project.title}</h3>
    <p class="text-center m-0 mb-3">Сделано {countDone(project.episode_list)} из {Object.keys(project.episode_list).length} запланированных эпизодов</p>
    <div class="progress" role="progressbar">
      <div class="progress-bar progress-bar-striped progress-bar-animated" style="width: {Math.round(countDone(project.episode_list) / Object.keys(project.episode_list).length * 100)}%; background-color: {project.progress_color}"> { Math.round(countDone(project.episode_list) / Object.keys(project.episode_list).length * 100)}% </div>
    </div>
    </div>
    
    </div>

    <button class="btn btn-outline-success" on:click={() => {mobile_page="main"}}>Open main page</button>


    </div>
  {:else}
    <div class="">
      <button class="btn btn-outline-success" on:click={() => {mobile_page="select"}}> « Open select page</button>
    </div>
  {/if}
</div>
{:else}
{/if}
</div>


<style>

.collapse + .collapse_arrow {
  margin-top: .5rem;
  transition: ease-in-out .1s;
  transform: rotate(0deg);
  font-size: .8rem;
}

.collapse_arrow {
  transition: ease-in-out .2s;
  transform: rotate(180deg);
  font-size: .8rem;
}

.container_special {
  max-width: 1200px;
  margin-right: auto;
  margin-left: auto;
}

@media (max-width: 1000px) {

.container_special {
  max-width: 100%;
}

}

</style>