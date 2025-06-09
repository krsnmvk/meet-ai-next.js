import { DEFAULT_PAGE } from '@/constants';
import { parseAsInteger, parseAsString, createLoader } from 'nuqs/server';

const filtersSearchParams = {
  page: parseAsInteger
    .withDefault(DEFAULT_PAGE)
    .withOptions({ clearOnDefault: true }),
  search: parseAsString.withDefault('').withOptions({ clearOnDefault: true }),
};

export const loaderSearchParams = createLoader(filtersSearchParams);
