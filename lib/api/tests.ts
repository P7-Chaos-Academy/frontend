export type Test = {
  id: number;
  name: string;
};

export async function getTests(): Promise<Test[]> {
  //return apiFetch<Test[]>("/test");
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: "Test 1" },
        { id: 2, name: "Test 2" },
      ]);
    }, 1000);
  });
}
