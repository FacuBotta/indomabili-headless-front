<template>
  <div class="section-card">
    <div>
      <h1 class="section-title">Dove trovare noi?</h1>
      <ul class="font-text ml-10 mb-5 list-disc">
        <li
          v-for="feria in allFerias"
          :key="feria.id"
          @click="goToFeria(feria)"
          class="cursor-pointer hover:text-bright-peach"
        >
          <strong class="text-xl">{{ feria.title }}</strong> |
          {{ formatDate(feria.date) }}
        </li>
      </ul>
    </div>

    <div
      class="w-full max-w-[500px] border-2 border-white rounded-lg overflow-hidden bg-white/50"
    >
      <iframe
        :key="iframeSrc"
        :src="iframeSrc"
        class="w-full max-w-[500px] h-[450px]"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const allFerias = ref([]);
const iframeSrc = ref('');

const formatDate = (dateStr) => {
  return new Intl.DateTimeFormat('it-IT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr));
};

const goToFeria = (feria) => {
  iframeSrc.value = feria.adresse;
};

onMounted(async () => {
  const res = await fetch('/ferias.json');
  const { ferias } = await res.json();
  allFerias.value = ferias;
  if (ferias.length > 0) {
    iframeSrc.value = ferias[0].adresse;
  }
});
</script>
