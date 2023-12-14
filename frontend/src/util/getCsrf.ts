export default async function getCsrf(): Promise<{ csrfToken: string }> {
  return await fetch(`${import.meta.env.VITE_API_URL}/csrf`, {
    method: "GET",
    credentials: "include",
  }).then((res) => res.json());
}
