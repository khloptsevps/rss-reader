/* eslint-disable no-param-reassign */
import * as yup from 'yup';

export const initSchema = () => {
  yup.setLocale({
    string: {
      url: (v) => ({ key: 'errors.notValidUrl', values: v }),
    },
    mixed: {
      notOneOf: (v) => ({ key: 'errors.doubleUrl', values: v }),
      required: (v) => ({ key: 'errors.required', values: v }),
    },
  });
  const schema = yup.string()
    .required()
    .url();
  return schema;
};

export default (schema, feeds, link) => {
  // schema = yup.string()
  //   .notOneOf(feeds.map(({ url }) => url));
  Object.assign(schema, yup.string()
    .notOneOf(feeds.map(({ url }) => url)));
  return schema.validate(link);
};
