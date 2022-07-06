/* eslint-disable no-param-reassign */
import { includes } from 'lodash';

const renderErrors = (elements, error, i18nInstance) => {
  const { input, feedback } = elements.rssForm;

  const errorName = error === null ? null : error.name;

  switch (errorName) {
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
  const { feedsBox, postsBox } = elements.containers;
  feedsBox.replaceChildren(buildCard(i18nInstance, 'feeds'));
  postsBox.replaceChildren(buildCard(i18nInstance, 'posts'));
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
      input.focus();
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

const handleSeenPosts = (state) => (evt) => {
  const { id } = evt.target.dataset;
  if (!includes(state.uiState.seenPostsId, id)) {
    state.uiState.seenPostsId.push(id);
  }
  const post = state.content.posts.find(({ postId }) => postId === id);
  state.modal = {
    title: post.title,
    body: post.description,
    link: post.link,
  };
};

const renderPosts = (posts, i18nInstance, state, elements) => {
  const postsList = document.querySelector('.posts ul');
  const liElements = posts.map((post) => {
    const { title, link, postId } = post;
    const liEl = document.createElement('li');
    liEl.addEventListener('click', handleSeenPosts(state, elements));

    liEl.classList.add('list-group-item', 'bg-light', 'border-0', 'd-flex', 'align-items-start', 'justify-content-between');

    const aEl = document.createElement('a');
    aEl.setAttribute('href', link);
    if (!includes(state.uiState.seenPostsId, postId)) {
      aEl.classList.add('link-primary', 'fw-bold');
    } else {
      aEl.classList.add('link-secondary', 'fw-normal');
    }
    aEl.dataset.id = postId;
    aEl.setAttribute('target', '_blank');

    aEl.textContent = title;

    const previewButton = document.createElement('button');
    previewButton.textContent = i18nInstance.t('buttons.previewButton');
    previewButton.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    previewButton.dataset.id = postId;
    previewButton.dataset.bsToggle = 'modal';
    previewButton.dataset.bsTarget = '#modal';

    liEl.append(aEl, previewButton);

    return liEl;
  });
  postsList.replaceChildren(...liElements);
};

const renderSeenPosts = (seenPostsId) => {
  seenPostsId.forEach((id) => {
    const seenElement = document.querySelector(`a[data-id="${id}"`);
    seenElement.classList.remove('link-primary', 'fw-bold');
    seenElement.classList.add('link-secondary', 'fw-normal');
  });
};

const renderModal = (content, modalWindow) => {
  modalWindow.title.textContent = content.title;
  modalWindow.body.textContent = content.body;
  modalWindow.link.setAttribute('href', content.link);
};

const render = (path, value, elements, i18nInstance, watchedState) => {
  switch (path) {
    case 'error':
      renderErrors(elements, value, i18nInstance);
      break;
    case 'form.processState':
      handleProcessState(elements, value, i18nInstance);
      break;
    case 'content.feeds':
      renderFeeds(value);
      break;
    case 'content.posts':
      renderPosts(value, i18nInstance, watchedState, elements);
      break;
    case 'uiState.seenPostsId':
      renderSeenPosts(value);
      break;
    case 'modal':
      renderModal(value, elements.modalWindow);
      break;
    default:
      console.log(`Неизвестный стейт ${path}`);
      break;
  }
};

export default render;
