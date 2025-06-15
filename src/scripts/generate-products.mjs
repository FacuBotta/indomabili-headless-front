import fs from 'fs';
import path from 'path';
import { fetchGraphQLData } from './data-fetcher.mjs';

const OUTPUT_PATH = path.resolve('./public/products.json');

const query = `
  query {
    products(first: 100) {
      nodes {
        id
        name
        description
        onSale
        image {
          sourceUrl
        }
        productCategories {
          nodes {
            id
            name
          }
        }
        ... on SimpleProduct {
          price
          regularPrice
          salePrice
        }
      }
    }
    productCategories(first: 100) {
      nodes {
        id
        name
        slug
        description
        image {
          sourceUrl
        }
        parent {
          node {
            id
          }
        }
        products {
          nodes {
            id
          }
        }
      }
    }
  }
`;

function transformData(data) {
  const rawProducts = data.products.nodes;
  const rawCategories = data.productCategories.nodes;

  const categoriesMap = new Map();

  // Clasificar categorías principales
  rawCategories.forEach((cat) => {
    if (!cat.parent?.node) {
      categoriesMap.set(cat.id, {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        image: cat.image?.sourceUrl || null,
        productCount: cat.products.nodes.length,
        subcategories: [],
      });
    }
  });

  // Agregar subcategorías a sus padres
  rawCategories.forEach((cat) => {
    const parentId = cat.parent?.node?.id;
    if (parentId && categoriesMap.has(parentId)) {
      categoriesMap.get(parentId).subcategories.push({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        image: cat.image?.sourceUrl || null,
        productCount: cat.products.nodes.length,
      });
    }
  });

  const products = rawProducts.map((p) => {
    const catIds = p.productCategories.nodes.map((c) => c.id);
    const parentCats = catIds.filter((id) => categoriesMap.has(id));
    const subCats = catIds.filter(
      (id) => !categoriesMap.has(id) && rawCategories.find((c) => c.id === id)
    );

    return {
      id: p.id,
      name: p.name,
      description: p.description,
      image: p.image?.sourceUrl || null,
      onSale: p.onSale,
      price: p.price,
      regularPrice: p.regularPrice,
      salePrice: p.salePrice,
      categoryIds: parentCats,
      subcategoryIds: subCats,
    };
  });

  return {
    products,
    categories: Array.from(categoriesMap.values()),
  };
}

async function generate() {
  try {
    console.log('📡 Fetching products from WordPress...');
    const data = await fetchGraphQLData(query);

    console.log('🔧 Transforming data...');
    const structuredData = transformData(data);

    console.log(`💾 Saving JSON to ${OUTPUT_PATH}`);
    fs.writeFileSync(
      OUTPUT_PATH,
      JSON.stringify(structuredData, null, 2),
      'utf-8'
    );

    console.log('✅ products.json generado con éxito.');
  } catch (err) {
    console.error('❌ Error al generar products.json:', err);
    process.exit(1);
  }
}

generate();
