import { graphql, Link } from 'gatsby';
import Img from 'gatsby-image';
import * as _ from 'lodash';
import { setLightness } from 'polished';
import * as React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { Helmet } from 'react-helmet';

import AuthorCard from '../components/AuthorCard';
import Footer from '../components/Footer';
import PostCard from '../components/PostCard';
import PostContent from '../components/PostContent';
import PostFullFooter from '../components/PostFullFooter';
import PostFullFooterRight from '../components/PostFullFooterRight';
import ReadNextCard from '../components/ReadNextCard';
import Subscribe from '../components/subscribe/Subscribe';
import Wrapper from '../components/Wrapper';
import IndexLayout from '../layouts';
import { colors } from '../styles/colors';
import { inner, outer, SiteMain } from '../styles/shared';
import config from '../website-config';
import Header from '../components/header/Header';

const PostTemplate = css`
  .site-main {
    background: #fff;
    padding-bottom: 4vw;
  }
`;

export const PostFull = css`
  position: relative;
  z-index: 50;
`;

export const NoImage = css`
  .post-full-content {
    padding-top: 0;
  }

  .post-full-content:before,
  .post-full-content:after {
    display: none;
  }
`;

export const PostFullHeader = styled.header`
  margin: 0 auto;
  padding: 6vw 3vw 6vw;
  max-width: 1040px;
  text-align: center;

  @media (max-width: 500px) {
    padding: 10vw 3vw 10vw;
  }
`;

const PostFullMeta = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${colors.midgrey};
  font-size: 1.4rem;
  font-weight: 600;
  text-transform: uppercase;

  @media (max-width: 500px) {
    font-size: 1.2rem;
    line-height: 1.3em;
  }
`;

const PostFullMetaDate = styled.time`
  color: ${colors.blue};
`;

export const PostFullTitle = styled.h1`
  margin: 0;
  color: ${setLightness('0.05', colors.darkgrey)};
  font-size: 4rem;
  @media (max-width: 500px) {
    font-size: 2.9rem;
  }
`;

const PostFullImage = styled.figure`
  margin: 0 -10vw -165px;
  height: 800px;
  background: ${colors.lightgrey} center center;
  background-size: cover;
  border-radius: 5px;

  @media (max-width: 1170px) {
    margin: 0 -4vw -100px;
    height: 600px;
    border-radius: 0;
  }

  @media (max-width: 800px) {
    height: 400px;
  }
  @media (max-width: 500px) {
    margin-bottom: 4vw;
    height: 350px;
  }
`;

const DateDivider = styled.span`
  display: inline-block;
  margin: 0 6px 1px;
`;

const ReadNextFeed = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 0 -20px;
  padding: 40px 0 0 0;
`;

interface PageTemplateProps {
  pathContext: {
    slug: string;
  };
  data: {
    logo: {
      childImageSharp: {
        fixed: any;
      };
    };
    contentfulBlogPost: {
      html: string;
      tags: string[];
      htmlAst: any;
      excerpt: string;
      timeToRead: string;
      body: {
        childMarkdownRemark: {
          htmlAst: string;
        };
      };
      image: {
        fluid: any;
      };
    };
    relatedPosts: {
      totalCount: number;
      edges: {
        node: {
          timeToRead: number;
          title: string;
          slug: string;
        };
      }[];
    };
    authorYaml: {
      id: string;
      linkedin?: string;
      twitter?: string;
      github?: string;
      location?: string;
      profile_image?: {
        childImageSharp: {
          fluid: any;
        };
      };
      bio?: string;
      avatar: {
        childImageSharp: {
          fluid: any;
        };
      };
    };
  };
  pageContext: {
    prev: PageContext;
    next: PageContext;
  };
}

export interface PageContext {
  excerpt: string;
  timeToRead: number;
  slug: string;
  image: {
    fluid: any;
  };
  title: string;
  date: string;
  draft?: boolean;
  tags: string[];
  author: {
    id: string;
    bio: string;
    avatar: {
      children: {
        fixed: {
          src: string;
        };
      }[];
    };
  };
}

const PageTemplate: React.FunctionComponent<PageTemplateProps> = props => {
  const author = props.data.authorYaml;
  const post = props.data.contentfulBlogPost;
  let width = '';
  let height = '';
  // if (post.image && post.image.childImageSharp) {
  //   width = post.image.childImageSharp.fluid.sizes.split(', ')[1].split('px')[0];
  //   height = String(Number(width) / post.image.childImageSharp.fluid.aspectRatio);
  // }

  return (
    <IndexLayout className="post-template">
      <Wrapper css={PostTemplate}>
        <Header isHome={false} totalCount={0} />
        <main id="site-main" className="site-main" css={[SiteMain, outer]}>
          <div css={inner}>
            {/* TODO: no-image css tag? */}
            {/* <article css={[PostFull, !post.image && NoImage]}> */}
            <article css={[PostFull]}>
              <PostFullHeader>
                <PostFullMeta>
                  <PostFullMetaDate dateTime={post.date}>{post.userDate}</PostFullMetaDate>
                  {post.tags && post.tags.length > 0 && (
                    <>
                      <DateDivider>/</DateDivider>
                      <Link to={`/tags/${_.kebabCase(post.tags[0].slug)}/`}>
                        {post.tags[0].slug}
                      </Link>
                    </>
                  )}
                </PostFullMeta>
                <PostFullTitle>{post.title}</PostFullTitle>
              </PostFullHeader>
              {post.image && post.image.fluid && (
                <PostFullImage>
                  <Img style={{ height: '100%' }} fluid={post.image.fluid} />
                </PostFullImage>
              )}
              <PostContent htmlAst={post.body.childMarkdownRemark.htmlAst} />

              {/* The big email subscribe modal content */}
              {config.showSubscribe && <Subscribe title={config.title} />}

              <PostFullFooter>
                <AuthorCard author={author} />
                <PostFullFooterRight authorId="Ashley Hollis" />
              </PostFullFooter>
            </article>
          </div>
        </main>

        {/* Links to Previous/Next posts */}
        <aside className="read-next" css={outer}>
          <div css={inner}>
            <ReadNextFeed>
              {props.data.relatedPosts && (
                <ReadNextCard tags={post.tags[0].slug} relatedPosts={props.data.relatedPosts} />
              )}

              {props.pageContext.prev && <PostCard post={props.pageContext.prev} />}
              {props.pageContext.next && <PostCard post={props.pageContext.next} />}
            </ReadNextFeed>
          </div>
        </aside>
        <Footer />
      </Wrapper>
    </IndexLayout>
  );
};

export default PageTemplate;

export const query = graphql`
  query($slug: String!, $primaryTag: String) {
    authorYaml(id: { eq: "Ashley Hollis" }) {
      id
      website
      twitter
      bio
      linkedin
      github
      location
      profile_image {
        childImageSharp {
          fluid(maxWidth: 3720) {
            ...GatsbyImageSharpFluid
          }
        }
      }
      avatar {
        childImageSharp {
          fluid(maxWidth: 200) {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
    logo: file(relativePath: { eq: "img/ghost-logo.png" }) {
      childImageSharp {
        fixed {
          ...GatsbyImageSharpFixed
        }
      }
    }
    contentfulBlogPost(slug: { eq: $slug }) {
      title
      tags {
        ... on ContentfulTag {
          slug
        }
      }
      image {
        fluid {
          ...GatsbyContentfulFluid_withWebp
        }
      }
      body {
        childMarkdownRemark {
          htmlAst
        }
      }
    }
    relatedPosts: allContentfulBlogPost(
      filter: { tags: { elemMatch: { slug: { eq: $primaryTag } } } }
      limit: 3
    ) {
      totalCount
      edges {
        node {
          id
          title
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
