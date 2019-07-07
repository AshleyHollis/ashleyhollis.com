import { StaticQuery, graphql } from 'gatsby';
import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import SiteNav from '../../components/header/SiteNav';
import Website from '../../components/icons/website';
import Linkedin from '../../components/icons/linkedin';
import Twitter from '../../components/icons/twitter';
import Github from '../../components/icons/github';
import {
  AuthorProfileImage,
  inner,
  outer,
  PostFeed,
  PostFeedRaise,
  SiteHeader,
  SiteHeaderContent,
  SiteTitle,
  SiteMain,
  SocialLink,
} from '../../styles/shared';

const HiddenMobile = css`
  @media (max-width: 500px) {
    display: none;
  }
`;

const AuthorMeta = styled.div`
  z-index: 10;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 0 10px 0;
  font-family: Georgia, serif;
  font-style: italic;
`;

const AuthorBio = styled.h2`
  z-index: 10;
  flex-shrink: 0;
  margin: 5px 0 10px 0;
  max-width: 600px;
  font-size: 2rem;
  line-height: 1.3em;
  font-weight: 300;
  letter-spacing: 0.5px;
  opacity: 0.8;
`;

const Bull = styled.span`
  display: inline-block;
  margin: 0 12px;
  opacity: 0.5;
`;

const AuthorProfileBioImage = css`
  z-index: 10;
  flex-shrink: 0;
  margin: 0 0 20px 0;
  width: 200px;
  height: 200px;
  box-shadow: rgba(255, 255, 255, 0.9) 0 0 0 3px;
`;

export interface HeaderProps {
  isHome: boolean;
  totalCount: number;
}

const Header: React.FunctionComponent<HeaderProps> = props => {
  const isHome = props.isHome;
  const totalCount = props.totalCount;

  if (isHome) {
    return (
      <StaticQuery
        query={graphql`
          query {
            author: authorYaml {
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
          }
        `}
        render={({ author }) => (
          <header
            className="no-cover"
            css={[outer, SiteHeader]}
            style={{
              backgroundImage: author.profile_image
                ? `url(${author.profile_image.childImageSharp.fluid.src})`
                : '',
            }}
          >
            <div css={inner}>
              <SiteNav isHome={false} />
              <SiteHeaderContent>
                <img
                  css={[AuthorProfileImage, AuthorProfileBioImage]}
                  src={author.avatar.childImageSharp.fluid.src}
                  alt={author.id}
                />
                <SiteTitle>{author.id}</SiteTitle>
                {author.bio && <AuthorBio>{author.bio}</AuthorBio>}
                <AuthorMeta>
                  {author.location && (
                    <div css={HiddenMobile}>
                      {author.location} <Bull>&bull;</Bull>
                    </div>
                  )}
                  <div css={HiddenMobile}>
                    {totalCount > 1 && `${totalCount} posts`}
                    {totalCount === 1 && `1 post`}
                    {totalCount === 0 && `No posts`} <Bull>•</Bull>
                  </div>
                  {author.website && (
                    <div>
                      <a
                        className="social-link-wb"
                        css={SocialLink}
                        href={author.website}
                        title="Website"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Website />
                      </a>
                    </div>
                  )}
                  {author.twitter && (
                    <a
                      className="social-link-tw"
                      css={SocialLink}
                      href={author.twitter}
                      title="Twitter"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Twitter />
                    </a>
                  )}
                  {author.linkedin && (
                    <a
                      className="social-link-tw"
                      css={SocialLink}
                      href={author.linkedin}
                      title="Linkedin"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Linkedin />
                    </a>
                  )}
                  {author.github && (
                    <a
                      className="social-link-tw"
                      css={SocialLink}
                      href={author.github}
                      title="Github"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github />
                    </a>
                  )}
                  {/* TODO: RSS for author */}
                  {/* <a
            css={SocialLink} className="social-link-rss"
            href="https://feedly.com/i/subscription/feed/https://demo.ghost.io/author/ghost/rss/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              style={{ height: '1.9rem' }}
            >
              <circle cx="6.18" cy="17.82" r="2.18" />
              <path d="M4 4.44v2.83c7.03 0 12.73 5.7 12.73 12.73h2.83c0-8.59-6.97-15.56-15.56-15.56zm0 5.66v2.83c3.9 0 7.07 3.17 7.07 7.07h2.83c0-5.47-4.43-9.9-9.9-9.9z" />
            </svg>
          </a> */}
                </AuthorMeta>
              </SiteHeaderContent>
            </div>
          </header>
        )}
      />
    );
  } else {
    return (
      <header css={[outer, SiteHeader]}>
        <div css={inner}>
          <SiteNav />
        </div>
      </header>
    );
  }
};

export default Header;
