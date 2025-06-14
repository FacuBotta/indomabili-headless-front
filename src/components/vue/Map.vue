<template>
  <div>
    <h1
      class="font-title text-3xl underline underline-offset-2 decoration-bright-peach"
    >
      Dove trovare noi?
    </h1>
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
  <div class="w-full max-w-[600px]">
    <div
      id="map"
      class="border-2 border-white rounded-2xl"
      style="height: 400px; width: 100%"
    ></div>
  </div>
</template>

<script setup>
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // IMPORTANTE
import { onMounted, ref } from 'vue';

const allFerias = ref([]);
const addresses = ref([]);
const map = ref(null);
const markersById = new Map(); // Nuevo: para guardar los marcadores

const currentVue = ref([]);

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
  const lat = Number(feria.adresse.split(',')[0]);
  const lng = Number(feria.adresse.split(',')[1]);
  currentVue.value = [lat, lng];

  if (map.value) {
    map.value.setView(currentVue.value, 10);
    const marker = markersById.get(feria.id);
    if (marker) marker.openPopup();
  }
};

onMounted(async () => {
  const res = await fetch('/ferias.json');
  const { ferias } = await res.json();
  allFerias.value = ferias;

  addresses.value = ferias.map((f) => {
    const [lat, lng] = f.adresse.split(',').map(Number);
    return {
      id: f.id,
      lat,
      lng,
      label: f.title,
    };
  });

  currentVue.value = [addresses.value[0].lat, addresses.value[0].lng];

  map.value = L.map('map').setView(currentVue.value, 7);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
  }).addTo(map.value);

  // Agregar marcadores y guardarlos con su ID
  addresses.value.forEach((addr) => {
    const marker = L.marker([addr.lat, addr.lng])
      .addTo(map.value)
      .bindPopup(addr.label);
    markersById.set(addr.id, marker); // Guardar el marcador por ID
  });

  setTimeout(() => {
    map.value.invalidateSize();
  }, 0);
});
</script>
