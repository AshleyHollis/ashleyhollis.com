import React from 'react';
import Footer from '../components/Footer';
import PostCard from '../components/PostCard';
import Wrapper from '../components/Wrapper';
import IndexLayout from '../layouts';
import { inner, outer, PostFeed, SiteMain } from '../styles/shared';
import { PageContext } from './post';
import Header from '../components/header/Header';

interface AuthorTemplateProps {
  pathContext: {
    slug: string;
  };
  pageContext: {
    author: string;
  };
  data: {
    logo: {
      childImageSharp: {
        fluid: any;
      };
    };
    allContentfulBlogPost: {
      totalCount: number;
      edges: {
        node: PageContext;
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
}

const Author: React.FunctionComponent<AuthorTemplateProps> = props => {
  const edges = props.data.allContentfulBlogPost.edges;
  const totalCount = edges.length;

  return (
    <IndexLayout>
      <Wrapper>
        <Header isHome={true} totalCount={totalCount} />
        <main id="site-main" css={[SiteMain, outer]}>
          <div css={inner}>
            <div css={[PostFeed]}>
              {edges.map(({ node }) => {
                return <PostCard key={node.slug} post={node} />;
              })}
            </div>
          </div>
        </main>
        <Footer />
      </Wrapper>
    </IndexLayout>
  );
};

export default Author;

export const pageQuery = graphql`
  query($author: String) {
    authorYaml(id: { eq: $author }) {
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
            ...GatsbyImageSharpFluid_withWebp_tracedSVG
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
    allContentfulBlogPost(limit: 2000) {
      edges {
        node {
          id
          slug
          title
          tags {
            ... on ContentfulTag {
              slug
            }
          }
          image {
            file {
              url
            }
            fluid {
              ...GatsbyContentfulFluid_withWebp
            }
          }
        }
      }
    }
  }
`;
