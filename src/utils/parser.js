export default (data) => {
  const domParser = new DOMParser();
  const xmlDOM = domParser.parseFromString(data.contents, 'application/xml');

  const parserError = xmlDOM.querySelector('parsererror');

  if (parserError) {
    const myError = new Error(parserError.textContent);
    myError.name = 'ParserError';
    throw myError;
  }

  const searchElements = {
    title: 'title',
    description: 'description',
    link: 'link',
  };

  const xmlItemElements = xmlDOM.querySelectorAll('item');

  const items = [...xmlItemElements].map((item) => ({
    title: item.querySelector(searchElements.title).textContent,
    description: item.querySelector(searchElements.description).textContent,
    link: item.querySelector(searchElements.link).textContent,
  }));

  const rss = {
    channel: {
      title: xmlDOM.querySelector(searchElements.title).textContent,
      description: xmlDOM.querySelector(searchElements.description).textContent,
    },
    items,
  };
  return rss;
};
