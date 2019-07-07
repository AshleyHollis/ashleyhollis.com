// We can use dotenv to read environment variables from a file (e.g. local environment).
// This is not required if you don't want to preview locally.
// This does require you to install it as a dependency:
//  `npm i -S dotenv`
require('dotenv').config({
  path: '.env',
});

const { CONTENTFUL_SPACE_ID: spaceId, CONTENTFUL_USE_PREVIEW } = process.env;
const usePreview = CONTENTFUL_USE_PREVIEW === 'true';

const host = usePreview ? 'preview.contentful.com' : 'cdn.contentful.com';
const accessToken = usePreview
  ? // The Preview API uses a different token than the Delivery API
    process.env.CONTENTFUL_PREVIEW_TOKEN
  : process.env.CONTENTFUL_DELIVERY_TOKEN;

if (!spaceId || !accessToken) {
  throw new Error('Contentful spaceId and access token need to be provided');
}

module.exports = {
  spaceId,
  host,
  accessToken,
};
