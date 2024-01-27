import { API_ROUTES } from '@/config/api';
import { api } from '@/services/api';

export enum FilterEnum {
  SEARCH_TEXT = 'title',
  SORT = 'sort',
  STATE = 'state'
}

export enum SortEnum {
  NEWEST = 'newest',
  OLDEST = 'oldest',
  ALPHABETICAL = 'alphabetical'
}

export enum StateEnum {
  NEW = 'new',
  OPEN = 'open',
  CLOSED = 'closed'
}

export type FilterType = {
  [key in FilterEnum]?: string;
};

const sortMapResolve = {
  [SortEnum.NEWEST]: 'createdAt:desc',
  [SortEnum.OLDEST]: 'createdAt:asc',
  [SortEnum.ALPHABETICAL]: 'title:asc'
};

const searchResolveFilter = (text: string) => {
  return {
    $containsi: text
  };
};

export function createDiscussionFilters(filters: FilterType | null) {
  if (!filters) return {};
  return Object.keys(filters).reduce<{
    sort?: string;
    state?: string;
    title?: { $containsi: string };
  }>((acc, key) => {
    const filter = filters[key as FilterEnum];
    if (filter) {
      if (key === FilterEnum.SORT) {
        acc[key] = sortMapResolve[filter as SortEnum];
      } else if (key === FilterEnum.SEARCH_TEXT) {
        acc[key] = searchResolveFilter(filter as string);
      } else if (key === FilterEnum.STATE) {
        acc[key] = filter;
      }
    }
    return acc;
  }, {});
}

// Questions
export type QuestionType = { title: string; content: string; state?: string };

export function createQuestion<T = any>(
  projectId: number,
  payload: QuestionType
) {
  const path = `${API_ROUTES.PLURAL_QUESTION.path}`;

  // add treasury id
  (payload as any).treasury = projectId;

  return api.post<T>(path, {
    data: payload
  });
}

export function updateQuestion<T = any>(
  questionId: number,
  payload: Partial<QuestionType>
) {
  const path = `${API_ROUTES.PLURAL_QUESTION.path}/${questionId}`;

  return api.put<T>(path, {
    data: payload
  });
}

export function deleteQuestion<T = any>(questionId: number) {
  const path = `${API_ROUTES.PLURAL_QUESTION.path}/${questionId}`;

  return api.delete<T>(path);
}

// Answers

export type AnswerType = { question: number; title: string; content: string };

export function createAnswer<T = any>(payload: AnswerType) {
  const path = `${API_ROUTES.PLURAL_ANSWER.path}`;

  return api.post<T>(path, {
    data: payload
  });
}

export function updateAnswer<T = any>(
  payload: Partial<Omit<AnswerType, 'question'>>
) {
  const path = `${API_ROUTES.PLURAL_ANSWER.path}`;

  return api.post<T>(path, {
    data: payload
  });
}
