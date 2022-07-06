export default (link) => {
  const proxy = 'https://allorigins.hexlet.app';
  const url = new URL('/get', proxy);
  url.searchParams.append('disableCache', true);
  url.searchParams.append('url', encodeURI(link));
  return url;
};
