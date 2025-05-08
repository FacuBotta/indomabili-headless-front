const domain = import.meta.env.WP_DOMAIN;

export const getPageContent = async (slug: string) => {
  const query = `
    query GetPageBySlug($slug: String!) {
      pageBy(uri: $slug) {
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
  return result.data.pageBy;
};

export const getProducts = async () => {
  const query = `
    query {
      products {
        nodes {
          id
          name
          description
          onSale
          productCategories {
            nodes {
              name
            }
          }
          image {
            sourceUrl
          }
          ... on SimpleProduct {
            price
            regularPrice
            salePrice
          }
        }
      }
    }
  `;

  const response = await fetch(`${domain}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
    }),
  });

  const result = await response.json();
  return result.data.products.nodes;
};
