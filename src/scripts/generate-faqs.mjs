import fs from 'fs';
import path from 'path';
import { fetchGraphQLData } from './data-fetcher.mjs';

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
    const data = await fetchGraphQLData(query);

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
