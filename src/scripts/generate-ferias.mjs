import fs from 'fs';
import path from 'path';
import { fetchGraphQLData } from './data-fetcher.mjs';

const OUTPUT_PATH = path.resolve('./public/ferias.json');

const query = `
  query {
    ferias {
    nodes {
      id
      title
      acf {
        adresse
        fecha
        description
      }
    }
  }
  }
`;

function extractIframeSrc(iframeHtml) {
  const match = iframeHtml.match(/src="([^"]+)"/);
  return match ? match[1] : null;
}

function transformData(data) {
  const rawFerias = data.ferias.nodes;

  const ferias = rawFerias.map((f) => {
    return {
      id: f.id,
      title: f.title,
      description: f.acf.description,
      adresse: extractIframeSrc(f.acf.adresse),
      date: f.acf.fecha,
    };
  });

  return {
    ferias,
  };
}

async function generate() {
  try {
    console.log('📡 Fetching ferias data from WordPress...');
    const data = await fetchGraphQLData(query);

    console.log('🔧 Transforming data...');
    const structuredData = transformData(data);

    console.log(`💾 Saving JSON to ${OUTPUT_PATH}`);
    fs.writeFileSync(
      OUTPUT_PATH,
      JSON.stringify(structuredData, null, 2),
      'utf-8'
    );

    console.log('✅ ferias.json generado con éxito.');
  } catch (err) {
    console.error('❌ Error al generar ferias.json:', err);
    process.exit(1);
  }
}

generate();
