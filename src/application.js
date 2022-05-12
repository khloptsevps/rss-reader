import i18next from 'i18next';
import * as yup from 'yup';
import onChange from 'on-change';
import { last } from 'lodash';
import ru from './locales/ru.js';
import renderErrors, { handleProcessState } from './render.js';

const validator = (linksContainer) => {
  yup.setLocale({
    string: {
      url: (v) => ({ key: 'url.errors.notValidUrl', values: v }),
    },
    mixed: {
      notOneOf: (v) => ({ key: 'url.errors.doubleUrl', values: v }),
    },
  });
  const schema = yup.string()
    .url()
    .notOneOf([linksContainer]);
  return schema;
};

const render = (elements, i18nInstance) => (path, value) => {
  switch (path) {
    case 'form.errors':
      renderErrors(elements, value, i18nInstance);
      break;
    case 'form.processState':
      console.log('Текущий процесс:', value);
      handleProcessState(elements, value);
      break;
    default:
      console.log(`Неизвестный стейт ${path}`);
      break;
  }
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
  };

  const linksContainer = [];

  const state = onChange({
    form: {
      processState: 'filling',
      processError: null,
      errors: null,
    },
  }, render(elements, i18nInstance));

  const { form, input } = elements;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('input_url');
    validator(linksContainer).validate(url)
      .then((link) => {
        state.form.errors = null;
        linksContainer.push(link);
      })
      .then(() => {
        state.form.processState = 'sending';
        console.log(`Делаю запрос на адрес ${last(linksContainer)}`);
        setTimeout(() => {
          console.log('Готово!');
          state.form.processState = 'filling';
          form.reset();
          input.focus();
        }, 2000);
      })
      .catch((err) => {
        state.form.errors = { rssUrlErr: err.message.key };
      });
  });
};
