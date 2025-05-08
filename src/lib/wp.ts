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
  return {
    content: result.data.pageBy.content,
    title: result.data.pageBy.title,
    image: result.data.pageBy.featuredImage?.node.sourceUrl || null,
  };
};

/* export const getProducts = async () => {
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
  return result.data.products.nodes.map((product: any) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    image: product.image?.sourceUrl,
    onSale: product.onSale,
    price: product.price,
    regularPrice: product.regularPrice,
    salePrice: product.salePrice,
    category: product.productCategories?.nodes[0]?.name || 'Sin categoría',
  }));
}; */
