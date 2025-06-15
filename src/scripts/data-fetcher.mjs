import dotenv from 'dotenv';
dotenv.config();

export async function fetchGraphQLData(query, variables = {}) {
  const response = await fetch(process.env.GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  });

  const result = await response.json();
  return result.data;
}
