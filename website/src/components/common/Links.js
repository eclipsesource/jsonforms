import React from 'react';
import _ from 'lodash';
import {Link, withRouter} from "react-router-dom";
import Radium from 'radium';

const RadiumLink = Radium(Link);

// TODO: classes should be object with key-value-pairs where values map to stylename
export const Links = ({ currentLocation, classes, url, routes, indentation = 1, history }) => {
  return routes.map(route => {
    const slug = _.endsWith(url, '/') ? url + route.slug : `${url}/${route.slug}`;
    return (
      <React.Fragment key={slug}>
        <RadiumLink
          key={route.slug}
          to={slug}
          className={classes.sidebarLink}
        >
          {
            (currentLocation === `${url}/${route.slug}`) ?
              <span className={classes.currentRoute}
              >
                  <span style={{
                    color: '#ff1744',
                    marginRight: '0.25em',
                    marginLeft: `${indentation * 0.5}em`
                  }}
                  >
                    |
                  </span>
                {route.name}
                </span> :
              <span style={{
                marginLeft: `${indentation * 0.5}em`
              }}>{route.name}</span>
          }
        </RadiumLink>
        <li>
          {
            currentLocation.indexOf(`${url}/${route.slug}`) > -1 &&
            <ul className={classes.sidebarLinks} style={{ paddingLeft: `${indentation * 10}px`}}>
              {
                route.routes &&
                <ConnectedLinks
                  currentLocation={currentLocation}
                  classes={classes}
                  url={_.endsWith(url, '/') ? url + route.slug : `${url}/${route.slug}`}
                  routes={route.routes}
                  indentation={indentation + 1}
                />
              }
            </ul>
          }
        </li>
      </React.Fragment>
    );
  });
};

const ConnectedLinks = withRouter(Links);

export default ConnectedLinks;
