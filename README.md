# Headless CMS Astro + Vue.js + WordPress

## Data

Data is stored in two main folders:

- `src/data/`: contains the data that astro fetch in build time to generate the pages
- `public/`: contains tha data that will be fetched by the vue.js components

#### Fetch data

The `scripts/` folder contains the scripts that fetch the data from WordPress and generate the .json files in the `src/data/` folder.

To seed the data, run `npm run seed` in the root folder.
Or run `npm run generate: < dataToFetch >` to generate a specific data file.

All data is fetched and formatted in build time.
