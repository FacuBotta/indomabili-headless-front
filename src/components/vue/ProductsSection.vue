<template>
  <section class="w-full min-h-screen flex items-start justify-start p-4">
    <aside class="w-full max-w-md mb-6">
      <h2 class="text-2xl font-bold mb-2">Categorías</h2>
      <ul>
        <!-- Mostrar todos -->
        <li class="mb-2">
          <button
            @click="clearFilters"
            :class="[
              'text-left font-semibold',
              !selectedCategoryId && !selectedSubcategoryId
                ? 'border border-red-500 rounded px-1'
                : '',
            ]"
          >
            Mostrar todos
          </button>
        </li>

        <!-- Lista de categorías -->
        <li v-for="category in allCategories" :key="category.id" class="mb-2">
          <button
            @click="handleCategoryClick(category.id)"
            :class="[
              'text-left font-semibold text-blue-700',
              selectedCategoryId === category.id && !selectedSubcategoryId
                ? 'border border-red-500 rounded px-1'
                : '',
            ]"
          >
            {{ category.name }}
          </button>

          <!-- Subcategorías -->
          <ul
            v-if="
              openCategoryId === category.id && category.subcategories?.length
            "
            class="ml-4 mt-1"
          >
            <li
              v-for="sub in category.subcategories"
              :key="sub.id"
              class="mt-1"
            >
              <button
                @click="setSubcategoryFilter(category.id, sub.id)"
                :class="[
                  'text-sm text-gray-600',
                  selectedSubcategoryId === sub.id
                    ? 'border border-red-500 rounded px-1'
                    : '',
                ]"
              >
                {{ sub.name }}
              </button>
            </li>
          </ul>
        </li>
      </ul>
    </aside>

    <!-- Productos -->
    <main
      class="products grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-6xl"
    >
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="product border p-4 rounded shadow-sm"
      >
        <p class="text-sm text-gray-500 mb-1">
          {{ getProductCategoryName(product) }}
        </p>
        <h3 class="text-xl font-semibold mb-1">{{ product.name }}</h3>
        <p class="text-lg text-green-700">{{ product.price }}</p>
      </div>
    </main>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';

const allProducts = ref([]);
const allCategories = ref([]);
const selectedCategoryId = ref(null);
const selectedSubcategoryId = ref(null);
const openCategoryId = ref(null);

onMounted(async () => {
  const res = await fetch('/products.json');
  const { products, categories } = await res.json();
  allProducts.value = products;
  allCategories.value = categories;
});

const filteredProducts = computed(() => {
  if (selectedSubcategoryId.value) {
    return allProducts.value.filter((p) =>
      p.subcategoryIds?.includes(selectedSubcategoryId.value)
    );
  }
  if (selectedCategoryId.value) {
    return allProducts.value.filter((p) =>
      p.categoryIds?.includes(selectedCategoryId.value)
    );
  }
  return allProducts.value;
});

function handleCategoryClick(id) {
  if (selectedCategoryId.value === id && selectedSubcategoryId.value) {
    // Si ya está seleccionada y venimos de una subcategoría, limpiamos solo la subcategoría
    selectedSubcategoryId.value = null;
    return;
  }

  if (selectedCategoryId.value === id && !selectedSubcategoryId.value) {
    // Ya está seleccionada sin subcategoría → colapsar
    clearFilters();
    return;
  }

  // Nueva selección
  selectedCategoryId.value = id;
  selectedSubcategoryId.value = null;
  openCategoryId.value = id;
}

function setSubcategoryFilter(categoryId, subId) {
  selectedCategoryId.value = categoryId;
  selectedSubcategoryId.value = subId;
}

function clearFilters() {
  selectedCategoryId.value = null;
  selectedSubcategoryId.value = null;
  openCategoryId.value = null;
}

function getProductCategoryName(product) {
  const cat = allCategories.value.find((c) =>
    product.categoryIds?.includes(c.id)
  );
  const subcat = cat?.subcategories?.find((sc) =>
    product.subcategoryIds?.includes(sc.id)
  );
  return [cat?.name, subcat?.name].filter(Boolean).join(' > ');
}
</script>

<style scoped>
button {
  transition: all 0.2s ease;
}
button:hover {
  transform: scale(1.05);
  color: #000;
}
</style>
