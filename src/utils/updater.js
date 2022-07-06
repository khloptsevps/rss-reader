import axios from 'axios';
import { includes, uniqueId } from 'lodash';
import buildUrl from './buildUrl.js';
import parser from './parser.js';

const updater = (state) => {
  const { feeds, posts } = state.content;
  const postsLinks = posts.map(({ link }) => link);
  const promises = feeds.map(({ id, url }) => axios.get(buildUrl(url))
    .then(({ data }) => {
      const output = parser(data);
      const { items } = output;
      const newPosts = items
        .filter(({ link }) => !includes(postsLinks, link))
        .map((item) => Object.assign(item, { feedId: id, postId: uniqueId() }));
      return newPosts;
    })
    .catch((e) => console.error(`Error: ${e.message}`)));
  const results = Promise.all(promises);
  results
    .then((result) => result.forEach((value) => {
      posts.unshift(...value);
    }))
    .finally(() => {
      setTimeout(updater, 5000, state);
    });
};

export default updater;
