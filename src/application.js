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

const validator = (feedsContainer, link) => {
  yup.setLocale({
    string: {
      url: (v) => ({ key: 'errors.notValidUrl', values: v }),
    },
    mixed: {
      notOneOf: (v) => ({ key: 'errors.doubleUrl', values: v }),
    },
  });
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
    form: document.querySelector('form'),
    submitButton: document.querySelector('button[type="submit"]'),
    input: document.querySelector('#input_url'),
    feedback: document.querySelector('.feedback'),
    feedsContainer: document.querySelector('.feeds'),
    postsContainer: document.querySelector('.posts'),
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

  const { form } = elements;

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
      .then(({ data }) => parser(data))
      .then(({ feed, posts }) => {
        // state.form.processState = 'loaded';
        state.content.feeds.push(feed);
        state.content.posts.unshift(...posts);
        state.form.processState = 'filling';
      })
      .catch((error) => {
        switch (error.name) {
          case 'ValidationError':
            console.log('Ошибка валидации');
            state.error = error.message.key;
            state.form.processState = 'filling';
            break;
          case 'AxiosError':
            console.log('Ошибка Axios');
            state.error = 'errors.networkError';
            state.form.processState = 'filling';
            break;
          case 'ParserError':
            console.log(error);
            state.error = 'errors.notContainValidRss';
            state.form.processState = 'filling';
            break;
          default:
            console.log('Unknown error:', error);
            state.error = 'errors.somethingWentWrong';
            state.form.processState = 'filling';
            break;
        }
      });
  });
};
