import { uniqueId } from 'lodash';

const parser = (data) => new Promise((resolve, reject) => {
  const domParser = new DOMParser();
  const xmlString = data.contents;
  const xmlDOM = domParser.parseFromString(xmlString, 'application/xml');

  const parserError = xmlDOM.querySelector('parsererror');

  if (parserError) {
    const myError = new Error(parserError.textContent);
    myError.name = 'ParserError';
    reject(myError);
    return;
  }

  const searchElements = {
    title: 'title',
    description: 'description',
    link: 'link',
  };

  const feedTitle = xmlDOM.querySelector(searchElements.title).textContent;
  const feedDescription = xmlDOM.querySelector(searchElements.description).textContent;
  const feedUrl = data.status.url;

  const items = xmlDOM.querySelectorAll('item');

  const feed = {
    id: uniqueId(),
    url: feedUrl,
    title: feedTitle,
    description: feedDescription,
  };

  const posts = [...items].map((item) => {
    const postTitle = item.querySelector(searchElements.title).textContent;
    const postDescription = item.querySelector(searchElements.description).textContent;
    const postLink = item.querySelector(searchElements.link).textContent;
    const post = {
      id: uniqueId(),
      feedId: feed.id,
      title: postTitle,
      description: postDescription,
      link: postLink,
    };
    return post;
  });
  resolve({ feed, posts });
});

export default parser;
