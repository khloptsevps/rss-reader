import i18next from 'i18next';
import * as yup from 'yup';
import onChange from 'on-change';
import axios from 'axios';
import parser from './utils/parser.js';
import ru from './locales/ru.js';
import render from './render.js';

const routes = {
  rss: (link) => `https://allorigins.hexlet.app/get?disableCache=true&url=${link}`,
};

yup.setLocale({
  string: {
    url: (v) => ({ key: 'errors.notValidUrl', values: v }),
  },
  mixed: {
    notOneOf: (v) => ({ key: 'errors.doubleUrl', values: v }),
  },
});

const validator = (feedsContainer, link) => {
  const schema = yup.string()
    .url()
    .notOneOf(feedsContainer.map(({ url }) => url));
  return schema.validate(link);
};

export default () => {
  const i18nInstance = i18next.createInstance();
  i18nInstance
    .init({
      lng: 'ru',
      debug: false,
      resources: { ru },
    });

  const elements = {
    rssForm: {
      form: document.querySelector('form'),
      submitButton: document.querySelector('button[type="submit"]'),
      input: document.querySelector('#input_url'),
      feedback: document.querySelector('.feedback'),
    },
    containers: {
      feeds: document.querySelector('.feeds'),
      posts: document.querySelector('.posts'),
    },
  };

  const state = onChange({
    form: {
      processState: 'filling',
      processError: null,
    },
    content: {
      feeds: [],
      posts: [],
    },
    error: null,
  }, render(elements, i18nInstance));

  const { form } = elements.rssForm;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('input_url');

    const result = validator(state.content.feeds, url);
    result
      .then((link) => {
        state.error = null;
        state.form.processState = 'sending';
        return axios.get(routes.rss(link));
      })
      .then(({ data }) => {
        const content = parser(data);
        if (content.error) {
          throw content.error;
        }
        const { feed, posts } = content;
        state.form.processState = 'loaded';
        state.content.feeds.push(feed);
        state.content.posts.unshift(...posts);
      })
      .catch((error) => {
        state.error = error;
        state.form.processState = 'filling';
      });
  });
};
