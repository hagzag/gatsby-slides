import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { navigate, StaticQuery, graphql } from 'gatsby';
import Helmet from 'react-helmet';
import Swipeable from 'react-swipeable';
import Transition from '../components/transition';
import hljs from 'highlight.js';
import 'highlight.js/styles/darcula.css';
import logo from '../resources/logo.png';

import './index.css';

const Footer = ({ name, title, date }) => (
  <footer>
    <img className="footer__logo" src={logo} />
    <div>{title}</div>
    <div />
  </footer>
);

function TemplateWrapper(props) {
  const NEXT = [13, 32, 39];
  const PREV = 37;

  const doNavigate = useCallback(
    ({ keyCode }) => {
      const now = props.data.slide.index;

      const slidesLength = props.slidesLength;
      if (now) {
        if (keyCode === PREV && now === 1) {
          return false;
        } else if (NEXT.indexOf(keyCode) !== -1 && now === slidesLength) {
          return false;
        } else if (NEXT.indexOf(keyCode) !== -1) {
          navigate(`/${now + 1}`);
        } else if (keyCode === PREV) {
          navigate(`/${now - 1}`);
        }
      }
    },
    [props.data.slide.index]
  );

  const swipeLeft = () => {
    doNavigate({ keyCode: NEXT[0] });
  };

  const swipeRight = () => {
    doNavigate({ keyCode: PREV });
  };

  useEffect(() => {
    hljs.initHighlighting();
    return () => {
      hljs.initHighlighting.called = false;
    };
  });

  useEffect(
    () => {
      console.log('addEventListener');

      document.addEventListener('keydown', doNavigate);

      return () => {
        document.removeEventListener('keydown', doNavigate);
      };
    },
    [props.data.slide.index]
  );

  const { location, children, site } = props;
  return (
    <div>
      <Helmet
        title={`${site.siteMetadata.title} — ${site.siteMetadata.name}`}
      />
      <Swipeable onSwipedLeft={swipeLeft} onSwipedRight={swipeRight}>
        <Transition location={location}>
          <div id="slide" style={{ width: '100%' }}>
            {children}
          </div>
        </Transition>
      </Swipeable>
      <Footer
        name={site.siteMetadata.name}
        title={site.siteMetadata.title}
        date={site.siteMetadata.date}
      />
    </div>
  );
}
// }

TemplateWrapper.propTypes = {
  children: PropTypes.node,
  data: PropTypes.object,
};

export default props => (
  <StaticQuery
    query={graphql`
      query IndexQuery {
        site {
          siteMetadata {
            name
            title
            date
          }
        }
        allSlide {
          edges {
            node {
              id
            }
          }
        }
      }
    `}
    render={data => (
      <TemplateWrapper
        site={data.site}
        slidesLength={data.allSlide.edges.length}
        {...props}
      />
    )}
  />
);
