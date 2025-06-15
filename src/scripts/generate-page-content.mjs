import fs from 'fs';
import path from 'path';
import { fetchGraphQLData } from './data-fetcher.mjs';

const OUTPUT_PATH = path.resolve('./src/data/pages.json');

const query = `
  query GetPageBySlug($slug: String!) {
    pageBy(uri: $slug) {
      slug
      title
      content
      featuredImage {
        node {
          sourceUrl
        }
      }
    }
  }
`;

const pagesToFetch = ['hero', 'noi-text-description'];

function transformData(data) {
  const pagesData = data.map((p) => {
    return {
      slug: p.pageBy.slug,
      title: p.pageBy.title,
      content: p.pageBy.content,
      image: p.pageBy.featuredImage?.node.sourceUrl || null,
    };
  });

  return {
    pagesData,
  };
}

async function generate() {
  try {
    console.log('📡 Fetching page content data from WordPress...');

    const structuredData = await Promise.all(
      pagesToFetch.map((slug) => fetchGraphQLData(query, { slug }))
    );
    console.log('🔧 Transforming data...');
    const pagesData = transformData(structuredData);

    console.log(`💾 Saving JSON to ${OUTPUT_PATH}`);
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(pagesData, null, 2), 'utf-8');

    console.log('✅ pages.json generado con éxito.');
  } catch (err) {
    console.error('❌ Error al generar pages.json:', err);
    process.exit(1);
  }
}

generate();
