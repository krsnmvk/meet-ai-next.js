import { DEFAULT_PAGE } from '@/constants';
import {
  parseAsInteger,
  parseAsString,
  createLoader,
  parseAsStringEnum,
} from 'nuqs/server';
import { MeetingStatus } from '../types';

const filtersSearchParams = {
  page: parseAsInteger
    .withDefault(DEFAULT_PAGE)
    .withOptions({ clearOnDefault: true }),
  search: parseAsString.withDefault('').withOptions({ clearOnDefault: true }),
  agentId: parseAsString.withDefault('').withOptions({ clearOnDefault: true }),
  status: parseAsStringEnum(Object.values(MeetingStatus)),
};

export const loaderSearchParams = createLoader(filtersSearchParams);
