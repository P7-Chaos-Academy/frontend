import { apiFetch } from './client';

export type Test = {
  id: number;
  name: string;
};

export async function getTests(): Promise<Test[]> {
  return apiFetch<Test[]>('/test');
}
