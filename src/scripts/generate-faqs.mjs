import fs from 'fs';
import fetch from 'node-fetch';
import path from 'path';

const OUTPUT_PATH = path.resolve('./src/data/faqs.json');

const query = `
  query {
    faqs {
      nodes {
        faqItem {
          domande
          risponsa
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
  const rawFaqs = data.faqs.nodes;

  const faqs = rawFaqs.map((f) => {
    return {
      question: f.faqItem.domande,
      answer: f.faqItem.risponsa,
    };
  });

  return {
    faqs,
  };
}

async function generate() {
  try {
    console.log('📡 Fetching faqs data from WordPress...');
    const data = await fetchGraphQLData();

    console.log('🔧 Transforming data...');
    const structuredData = transformData(data);

    console.log(`💾 Saving JSON to ${OUTPUT_PATH}`);
    fs.writeFileSync(
      OUTPUT_PATH,
      JSON.stringify(structuredData, null, 2),
      'utf-8'
    );

    console.log('✅ faqs.json generado con éxito.');
  } catch (err) {
    console.error('❌ Error al generar faqs.json:', err);
    process.exit(1);
  }
}

generate();
