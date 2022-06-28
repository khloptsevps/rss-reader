/* eslint-disable no-param-reassign */
const renderErrors = (elements, error, i18nInstance) => {
  const { input, feedback } = elements.rssForm;

  const name = error === null ? null : error.name;

  switch (name) {
    case null:
      input.classList.remove('is-invalid');
      feedback.classList.remove('text-danger');
      feedback.textContent = '';
      break;
    case 'ValidationError':
      input.classList.add('is-invalid');
      feedback.classList.add('text-danger');
      feedback.textContent = i18nInstance.t(error.message.key);
      break;
    case 'AxiosError':
      console.error(error.message);
      feedback.classList.add('text-danger');
      feedback.textContent = i18nInstance.t('errors.networkError');
      break;
    case 'ParserError':
      console.log(error);
      feedback.classList.add('text-danger');
      feedback.textContent = i18nInstance.t('errors.notContainValidRss');
      break;
    default:
      console.log('Unknown error:', error);
      feedback.classList.add('text-danger');
      feedback.textContent = i18nInstance.t('errors.somethingWentWrong');
      break;
  }
};
const buildCard = (i18nInstance, cardTitle) => {
  const card = document.createElement('div');
  card.classList.add('card', 'border-0');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body', 'bg-light');

  const title = document.createElement('h2');
  title.classList.add('card-title', 'h4');
  title.textContent = i18nInstance.t(cardTitle);
  cardBody.replaceChildren(title);

  const ulEl = document.createElement('ul');
  ulEl.classList.add('list-group', 'border-0', 'rounded-0');

  card.replaceChildren(cardBody, ulEl);
  return card;
};

const renderCards = (elements, i18nInstance) => {
  const { feeds, posts } = elements.containers;
  feeds.replaceChildren(buildCard(i18nInstance, 'feeds'));
  posts.replaceChildren(buildCard(i18nInstance, 'posts'));
};

const handleProcessState = (elements, processState, i18nInstance) => {
  const {
    form,
    submitButton,
    input,
    feedback,
  } = elements.rssForm;

  switch (processState) {
    case 'sending':
      feedback.textContent = '';
      submitButton.disabled = true;
      input.disabled = true;
      break;
    case 'filling':
      submitButton.disabled = false;
      input.disabled = false;
      break;
    case 'loaded':
      feedback.classList.remove('text-danger');
      feedback.classList.add('text-success');
      feedback.textContent = i18nInstance.t(processState);
      renderCards(elements, i18nInstance);
      submitButton.disabled = false;
      input.disabled = false;
      form.reset();
      input.focus();
      break;
    default:
      break;
  }
};

const renderFeeds = (feeds) => {
  const feedsList = document.querySelector('.feeds ul');
  const liElements = feeds.map(({ title, description }) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item', 'bg-light', 'border-0');

    const h3El = document.createElement('h3');
    h3El.classList.add('h6', 'm-0');
    h3El.textContent = title;

    const pEl = document.createElement('p');
    pEl.classList.add('small', 'm-0', 'text-black-50');
    pEl.textContent = description;

    liEl.append(h3El, pEl);
    return liEl;
  });
  feedsList.replaceChildren(...liElements);
};

const renderPosts = (posts) => {
  const postsList = document.querySelector('.posts ul');
  const liElements = posts.map(({ title, link, postId }) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item', 'bg-light', 'border-0', 'd-flex', 'align-items-start');

    const aEl = document.createElement('a');
    aEl.setAttribute('href', link);
    aEl.classList.add('link-primary', 'fw-bold');
    aEl.dataset.id = postId;
    aEl.setAttribute('target', '_blank');

    aEl.textContent = title;

    liEl.append(aEl);
    return liEl;
  });
  postsList.replaceChildren(...liElements);
};

const render = (elements, i18nInstance) => (path, value) => {
  switch (path) {
    case 'error':
      renderErrors(elements, value, i18nInstance);
      break;
    case 'form.processState':
      // console.log('Текущий процесс:', value);
      handleProcessState(elements, value, i18nInstance);
      break;
    case 'content.feeds':
      renderFeeds(value);
      break;
    case 'content.posts':
      renderPosts(value);
      break;
    default:
      console.log(`Неизвестный стейт ${path}`);
      console.log(value);
      break;
  }
};

export default render;
