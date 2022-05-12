/* eslint-disable no-param-reassign */
const renderErrors = (elements, errors, i18nInstance) => {
  const { input, feedback } = elements;
  if (errors) {
    input.classList.add('is-invalid');

    feedback.classList.add('text-danger');
    feedback.textContent = i18nInstance.t(errors.rssUrlErr);
    return;
  }
  // временно;
  input.classList.remove('is-invalid');
  feedback.textContent = '';
};

export const handleProcessState = (elements, processState) => {
  switch (processState) {
    case 'sending':
      elements.submitButton.disabled = true;
      elements.input.disabled = true;
      break;
    case 'filling':
      elements.submitButton.disabled = false;
      elements.input.disabled = false;
      break;

    default:
      break;
  }
};

export default renderErrors;
