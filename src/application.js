import * as yup from 'yup';
import onChange from 'on-change';
// import { isEmpty } from 'lodash';
import renderErrors from './render.js';

const validator = (linksContainer) => {
  const schema = yup.string()
    .url('Ссылка должна быть валидным URL')
    .notOneOf([linksContainer], 'RSS уже существует!');
  return schema;
};

const workingProcess = (elements) => (path, value) => {
  switch (path) {
    case 'form.errors':
      renderErrors(elements, value);
      break;
    case 'form.processState':
      console.log('Текущий процесс:', value);
      break;
    case 'linksContainer':
      console.log('Добавил ссылку в контейнер:', value);
      break;
    default:
      console.log(`Неизвестный стейт ${path}`);
      break;
  }
};

export default () => {
  const elements = {
    form: document.querySelector('form'),
    input: document.querySelector('#input_url'),
    feedback: document.querySelector('.feedback'),
  };

  const state = onChange({
    form: {
      valid: null,
      processState: 'filling',
      processError: {},
      errors: {},
    },
    linksContainer: [],
  }, workingProcess(elements));

  const { form, input } = elements;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('input_url');
    validator(state.linksContainer).validate(url)
      .then((link) => {
        form.reset();
        input.focus();
        state.form.errors = {};
        // state.form.valid = isEmpty(state.form.errors);
        state.linksContainer.push(link);
        // state.form.processState = 'processing';
      })
      .catch((err) => {
        // state.form.valid = isEmpty(state.form.errors);
        state.form.errors = { rssUrlErr: err.message };
      });
  });
};
