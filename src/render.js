import { isEmpty } from 'lodash';

const renderErrors = (elements, errors) => {
  const { input, feedback } = elements;
  if (!isEmpty(errors)) {
    feedback.classList.add('text-danger');
    feedback.textContent = errors.rssUrlErr;

    input.classList.add('is-invalid');
    return;
  }
  feedback.classList.remove('text-danger');
  feedback.classList.add('text-success');
  input.classList.remove('is-invalid');
  feedback.textContent = 'RSS успешно загружен!';
};

export default renderErrors;
