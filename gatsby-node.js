const path = require('path');
const _ = require('lodash');

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  const result = await graphql(`
    {
      allContentfulBlogPost {
        edges {
          node {
            slug
            id
            tags {
              ... on ContentfulTag {
                slug
              }
            }
          }
        }
      }
      allAuthorYaml {
        edges {
          node {
            id
          }
        }
      }
    }
  `);

  if (result.errors) {
    console.error(result.errors);
    throw new Error(result.errors);
  }

  // Create post pages
  const posts = result.data.allContentfulBlogPost.edges;
  posts.forEach(({ node }, index) => {
    const { slug, layout } = node;
    const prev = index === 0 ? null : posts[index - 1].node;
    const next = index === posts.length - 1 ? null : posts[index + 1].node;

    // This will automatically resolve the template to a corresponding
    // `layout` frontmatter in the Markdown.
    //
    // Feel free to set any `layout` as you'd like in the frontmatter, as
    // long as the corresponding template file exists in src/templates.
    // If no template is set, it will fall back to the default `post`
    // template.
    //
    // Note that the template has to exist first, or else the build will fail.
    const postTemplate = path.resolve(`./src/templates/${layout || 'post'}.tsx`);

    createPage({
      path: slug,
      component: postTemplate,
      // Data passed to context is available in page queries as GraphQL variables.
      context: {
        slug,
        prev,
        next,
        primaryTag: node.tags ? node.tags[0].slug : '',
      },
    });
  });

  // Create tag pages
  const tagTemplate = path.resolve('./src/templates/tags.tsx');
  const tags = _.uniq(
    _.flatten(
      result.data.allContentfulBlogPost.edges.map(edge => {
        return _.castArray(_.get(edge, 'node.tags', []));
      }),
    ),
  );
  tags.forEach(tag => {
    createPage({
      path: `/tags/${_.kebabCase(tag.slug)}/`,
      component: tagTemplate,
      context: {
        tag: tag.slug,
      },
    });
  });

  // Create author pages
  const authorTemplate = path.resolve('./src/templates/author.tsx');
  result.data.allAuthorYaml.edges.forEach(edge => {
    createPage({
      path: `/author/${_.kebabCase(edge.node.id)}/`,
      component: authorTemplate,
      context: {
        author: edge.node.id,
      },
    });
  });
};

exports.onCreateWebpackConfig = ({ stage, actions }) => {
  // adds sourcemaps for tsx in dev mode
  if (stage === `develop` || stage === `develop-html`) {
    actions.setWebpackConfig({
      devtool: 'eval-source-map',
    });
  }
};
