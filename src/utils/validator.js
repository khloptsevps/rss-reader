import * as yup from 'yup';

yup.setLocale({
  string: {
    url: (v) => ({ key: 'errors.notValidUrl', values: v }),
  },
  mixed: {
    notOneOf: (v) => ({ key: 'errors.doubleUrl', values: v }),
  },
});

export default (feedsContainer, link) => {
  const schema = yup.string()
    .url()
    .notOneOf(feedsContainer.map(({ url }) => url));
  return schema.validate(link);
};
