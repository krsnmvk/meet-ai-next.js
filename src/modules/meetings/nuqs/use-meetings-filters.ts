import { DEFAULT_PAGE } from '@/constants';
import {
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from 'nuqs';
import { MeetingStatus } from '../types';

export function useMeetingssFilters() {
  return useQueryStates({
    page: parseAsInteger
      .withDefault(DEFAULT_PAGE)
      .withOptions({ clearOnDefault: true }),
    search: parseAsString.withDefault('').withOptions({ clearOnDefault: true }),
    agentId: parseAsString
      .withDefault('')
      .withOptions({ clearOnDefault: true }),
    status: parseAsStringEnum(Object.values(MeetingStatus)),
  });
}
