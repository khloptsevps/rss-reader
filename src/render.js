/* eslint-disable no-param-reassign */
const renderErrors = (elements, error, i18nInstance) => {
  const { input, feedback } = elements;
  if (error) {
    input.classList.add('is-invalid');

    feedback.classList.add('text-danger');
    feedback.textContent = i18nInstance.t(error);
    return;
  }
  // временно;
  input.classList.remove('is-invalid');
  feedback.textContent = '';
};

const handleProcessState = (elements, processState) => {
  const { submitButton, input } = elements;
  switch (processState) {
    case 'sending':
      submitButton.disabled = true;
      input.disabled = true;
      break;
    case 'filling':
      submitButton.disabled = false;
      input.disabled = false;
      break;

    default:
      break;
  }
};

const buildCard = (cardName) => {
  const card = document.createElement('div');
  card.classList.add('card', 'border-0');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body', 'bg-light');

  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('card-title', 'h5');
  cardTitle.textContent = cardName;

  cardBody.replaceChildren(cardTitle);
  card.replaceChildren(cardBody);
  return card;
};

const renderFeeds = (elements, feedsArray, i18nInstance) => {
  const container = elements.feedsContainer;
  const card = buildCard(i18nInstance.t('feedsTitle'));

  const ul = document.createElement('ul');
  ul.classList.add('list-group');

  const liElements = feedsArray.map(({ title, description }) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item', 'bg-light', 'border-0');

    const h3El = document.createElement('h3');
    h3El.classList.add('h6', 'm-0');
    h3El.textContent = title;

    const pEl = document.createElement('p');
    pEl.classList.add('small', 'text-black-50', 'm-0');
    pEl.textContent = description;

    liEl.append(h3El, pEl);
    return liEl;
  });
  ul.append(...liElements);
  card.replaceChildren(ul);
  container.replaceChildren(card);
};

const renderPosts = (elements, postsArray, i18nInstance) => {
  const container = elements.postsContainer;
  const card = buildCard(i18nInstance.t('postsTitle'));

  const ulEl = document.createElement('ul');
  ulEl.classList.add('list-group');

  const liElements = postsArray.map(({ title, link, id }) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item', 'bg-light', 'border-0', 'd-flex', 'align-items-start');

    const aEl = document.createElement('a');
    aEl.classList.add('link-primary');
    aEl.setAttribute('href', link);
    aEl.setAttribute('target', '_blank');
    aEl.setAttribute('data-id', id);

    aEl.textContent = title;

    liEl.append(aEl);

    return liEl;
  });
  ulEl.append(...liElements);
  card.replaceChildren(ulEl);
  container.replaceChildren(card);
};

const render = (elements, i18nInstance) => (path, value) => {
  switch (path) {
    case 'error':
      renderErrors(elements, value, i18nInstance);
      break;
    case 'form.processState':
      console.log('Текущий процесс:', value);
      handleProcessState(elements, value);
      break;
    case 'content.feeds':
      renderFeeds(elements, value, i18nInstance);
      break;
    case 'content.posts':
      renderPosts(elements, value, i18nInstance);
      break;
    default:
      console.log(`Неизвестный стейт ${path}`);
      console.log(value);
      break;
  }
};

export default render;
