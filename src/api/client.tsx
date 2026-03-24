const API_URL = import.meta.env.VITE_API_URL;

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export const request = async (
  url: string,
  method: HttpMethod = "GET",
  body: any = null,
): Promise<any> => {
  const options: RequestInit = {
    method,
  };

  if (body instanceof FormData) {
    options.body = body;
  } else if (body) {
    options.headers = { "Content-Type": "application/json" };
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${url}`, options);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Erreur réseau");
  }

  return response.json();
};
