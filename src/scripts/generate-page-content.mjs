import fs from 'fs';
import fetch from 'node-fetch';
import path from 'path';

// TODO: Use environment variable for domain

// const domain = import.meta.env.WP_DOMAIN;
const domain = 'http://localhost:8881/graphql';

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

const fetchPageContent = async (slug) => {
  const response = await fetch(`${domain}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: { slug },
    }),
  });

  const result = await response.json();
  return {
    slug: result.data.pageBy.slug,
    title: result.data.pageBy.title,
    content: result.data.pageBy.content,
    image: result.data.pageBy.featuredImage?.node.sourceUrl || null,
  };
};

async function generate() {
  try {
    console.log('📡 Fetching page content data from WordPress...');

    const pagesData = await Promise.all(
      pagesToFetch.map((slug) => fetchPageContent(slug))
    );

    console.log('🔧 Transforming data...');

    console.log(`💾 Saving JSON to ${OUTPUT_PATH}`);
    fs.writeFileSync(
      OUTPUT_PATH,
      JSON.stringify({ pagesData }, null, 2),
      'utf-8'
    );

    console.log('✅ pages.json generado con éxito.');
  } catch (err) {
    console.error('❌ Error al generar pages.json:', err);
    process.exit(1);
  }
}

generate();
