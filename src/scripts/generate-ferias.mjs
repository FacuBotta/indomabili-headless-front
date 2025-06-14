import fs from 'fs';
import fetch from 'node-fetch';
import path from 'path';

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

async function fetchGraphQLData() {
  const response = await fetch('http://localhost:8881/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  const result = await response.json();
  return result.data;
}

function transformData(data) {
  const rawFerias = data.ferias.nodes;

  const ferias = rawFerias.map((f) => {
    return {
      id: f.id,
      title: f.title,
      description: f.acf.description,
      adresse: f.acf.adresse,
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
    const data = await fetchGraphQLData();

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
