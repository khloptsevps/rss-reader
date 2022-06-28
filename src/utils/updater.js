import axios from 'axios';
import { includes, uniqueId } from 'lodash';
import parser from './parser.js';

const updater = (state) => {
  const { feeds, posts } = state.content;
  const postsLinks = posts.map(({ link }) => link);
  if (!feeds.length) {
    setTimeout(updater, 5000, state);
    return;
  }
  const promises = feeds.map(({ id, url }) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
    .then(({ data }) => {
      const output = parser(data);
      const { items } = output;
      const newPosts = items
        .filter(({ link }) => !includes(postsLinks, link))
        .map((item) => Object.assign(item, { feedId: id, postId: uniqueId() }));
      return newPosts;
    })
    .catch((e) => e));
  const results = Promise.all(promises);
  results
    .then((result) => result.forEach((value) => {
      if (value.isAxiosError) {
        console.error(`Error: ${value.message}`);
        return;
      }
      posts.unshift(...value);
    }))
    .finally(() => {
      setTimeout(updater, 5000, state);
    });
};

export default updater;
