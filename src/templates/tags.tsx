import { graphql } from 'gatsby';
import React from 'react';

import Footer from '../components/Footer';
import SiteNav from '../components/header/SiteNav';
import PostCard from '../components/PostCard';
import Wrapper from '../components/Wrapper';
import IndexLayout from '../layouts';
import {
  inner,
  outer,
  PostFeed,
  SiteDescription,
  SiteHeader,
  SiteHeaderContent,
  SiteMain,
  SiteTitle,
} from '../styles/shared';
import { PageContext } from './post';
import Helmet from 'react-helmet';
import config from '../website-config';

interface TagTemplateProps {
  pathContext: {
    slug: string;
  };
  pageContext: {
    tag: string;
  };
  data: {
    allTagYaml: {
      edges: {
        node: {
          id: string;
          description: string;
          image?: {
            childImageSharp: {
              fluid: any;
            };
          };
        };
      }[];
    };
    allContentfulBlogPost: {
      totalCount: number;
      edges: {
        node: PageContext;
      }[];
    };
  };
}

const Tags: React.FunctionComponent<TagTemplateProps> = props => {
  const tag = props.pageContext.tag ? props.pageContext.tag : '';
  const { edges, totalCount } = props.data.allContentfulBlogPost;

  const tagData = edges[0].node.tags.find(t => t.slug.toLowerCase() === tag.toLowerCase());

  return (
    <IndexLayout>
      <Wrapper>
        <header
          className={`${tagData && tagData.image ? '' : 'no-cover'}`}
          css={[outer, SiteHeader]}
          style={{
            backgroundImage:
              tagData && tagData.image ? `url('${tagData.image.childImageSharp.fluid.src}')` : '',
          }}
        >
          <div css={inner}>
            <SiteNav isHome={false} />
            <SiteHeaderContent>
              <SiteTitle>{tag}</SiteTitle>
              <SiteDescription>
                {tagData && tagData.description ? (
                  tagData.description
                ) : (
                  <>
                    A collection of {totalCount > 1 && `${totalCount} posts`}
                    {totalCount === 1 && `1 post`}
                    {totalCount === 0 && `No posts`}
                  </>
                )}
              </SiteDescription>
            </SiteHeaderContent>
          </div>
        </header>
        <main id="site-main" css={[SiteMain, outer]}>
          <div css={inner}>
            <div css={[PostFeed]}>
              {edges.map(({ node }) => (
                <PostCard key={node.slug} post={node} />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </Wrapper>
    </IndexLayout>
  );
};

export default Tags;

export const pageQuery = graphql`
  query($tag: String) {
    allContentfulBlogPost(filter: { tags: { elemMatch: { slug: { eq: $tag } } } }) {
      totalCount
      edges {
        node {
          slug
          tags {
            ... on ContentfulTag {
              slug
            }
          }
        }
      }
    }
  }
`;
