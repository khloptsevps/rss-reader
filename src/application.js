import i18next from 'i18next';
import onChange from 'on-change';
import axios from 'axios';
import { uniqueId } from 'lodash';
import ru from './locales/ru.js';
import render from './render.js';
import parser from './utils/parser.js';
import updater from './utils/updater.js';
import buildUrl from './utils/buildUrl.js';
import validator, { initSchema } from './utils/validator.js';

export default () => {
  const schema = initSchema();
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
      input: document.querySelector('#url-input'),
      feedback: document.querySelector('.feedback'),
    },
    containers: {
      feedsBox: document.querySelector('.feeds'),
      postsBox: document.querySelector('.posts'),
    },
    modalWindow: {
      title: document.querySelector('h5.modal-title'),
      body: document.querySelector('.modal-body'),
      link: document.querySelector('.modal-footer a'),
    },
  };

  const state = onChange({
    form: {
      processState: 'filling',
    },
    content: {
      feeds: [],
      posts: [],
    },
    uiState: {
      seenPostsId: [],
    },
    modal: {},
    error: null,
  }, (path, value) => render(path, value, elements, i18nInstance, state));

  const { form } = elements.rssForm;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const rssUrl = formData.get('url');

    const result = validator(schema, state.content.feeds, rssUrl);
    result
      .then((link) => {
        state.error = null;
        state.form.processState = 'sending';
        return axios.get(buildUrl(link));
      })
      .then(({ config, data }) => {
        const output = parser(data);
        const { channel, items } = output;
        channel.id = uniqueId();
        channel.url = config.url.searchParams.get('url');
        state.form.processState = 'loaded';
        state.content.feeds.push(channel);
        const posts = items.map((item) => Object.assign(item, {
          feedId: channel.id,
          postId: uniqueId(),
        }));
        state.content.posts.unshift(...posts);
        state.form.processState = 'filling';
      })
      .catch((error) => {
        state.error = error;
        state.form.processState = 'failed';
      });
  });
  updater(state);
};
