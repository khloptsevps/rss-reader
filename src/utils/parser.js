import { uniqueId } from 'lodash';

const parser = (data) => {
  const domParser = new DOMParser();
  const xmlDOM = domParser.parseFromString(data.contents, 'application/xml');

  const parserError = xmlDOM.querySelector('parsererror');

  if (parserError) {
    const myError = new Error(parserError.textContent);
    myError.name = 'ParserError';
    return { error: myError };
  }

  const searchElements = {
    title: 'title',
    description: 'description',
    link: 'link',
  };

  const feedTitle = xmlDOM.querySelector(searchElements.title).textContent;
  const feedDescription = xmlDOM.querySelector(searchElements.description).textContent;
  const feedUrl = data.status.url;

  const feed = {
    id: uniqueId(),
    url: feedUrl,
    title: feedTitle,
    description: feedDescription,
  };

  const items = xmlDOM.querySelectorAll('item');

  const posts = [...items].map((item) => ({
    id: uniqueId(),
    feedId: feed.id,
    title: item.querySelector(searchElements.title).textContent,
    description: item.querySelector(searchElements.description).textContent,
    link: item.querySelector(searchElements.link).textContent,
  }));

  return { feed, posts };
};

export default parser;
