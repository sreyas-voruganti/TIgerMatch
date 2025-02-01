<script setup>
const props = defineProps(['person'])

const capitalizeLetter = (s) => s.charAt(0).toUpperCase() + s.slice(1)
</script>

<template>
  <div class="bg-zinc-300 p-5 rounded-xl border-4 border-slate-600 flex justify-center">
    <div>
      <img
        class="w-60 rounded-xl border-4 border-slate-400"
        :src="`https://collface.deptcpanel.princeton.edu/img/${props.person.img}`"
      />
      <p class="font-bold text-xl mt-2">{{ props.person.name }}</p>
      <p class="font-medium">Class of {{ props.person.year }}</p>
      <p>{{ capitalizeLetter(props.person.college.toLowerCase()) }} College</p>
      <p class="text-sm">{{ props.person.program }}</p>
      <a class="text-sm text-blue-700" :href="`mailto:${props.person.email}`">{{
        props.person.email
      }}</a>
    </div>
  </div>
</template>
