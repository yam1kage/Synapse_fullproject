const API_URL = "http://127.0.0.1:8000";

// --- ТИПЫ ДАННЫХ (БЕЗ РОЛЕЙ И НАЗНАЧЕНИЙ) ---
export interface Task {
  id: number;
  name: string;
  description: string;
  status: string;
  priority: string;
  deadline?: string; // Наши любимые дедлайны остаются
}

export interface TaskCreate {
  name: string;
  description?: string;
  status?: string;
  priority?: string;
  deadline?: string;
}

// --- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---
export const getToken = () => typeof window !== "undefined" ? localStorage.getItem("token") : null;
export const isAuthenticated = () => !!getToken();

export const logout = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    window.location.href = "/";
  }
};

/**
 * Универсальный обработчик ошибок FastAPI
 */
async function handleResponseError(response: Response, defaultMsg: string) {
  if (response.status === 401) logout();
  let message = defaultMsg;
  try {
    const errorData = await response.json();

    message = Array.isArray(errorData.detail) 
      ? errorData.detail[0]?.msg 
      : errorData.detail || defaultMsg;
  } catch (e) {
    console.error("Ошибка при разборе JSON ответа");
  }
  throw new Error(message);
}



export async function login(username: string, password: string) {
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);

  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST", 
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData,
  });

  if (!response.ok) await handleResponseError(response, "Ошибка авторизации");
  const data = await response.json();
  if (data.access_token) localStorage.setItem("token", data.access_token);
  return data;
}

export async function register(username: string, password: string, email: string) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      email: email,
      hashed_password: password, 
      username: username 
    }),
  });

  if (!response.ok) await handleResponseError(response, "Ошибка при регистрации");
  return response.json();
}



export async function fetchTasks(): Promise<Task[]> {
  const token = getToken();
  const response = await fetch(`${API_URL}/tasks`, {
    headers: { "Authorization": `Bearer ${token}` },
  });
  if (!response.ok) await handleResponseError(response, "Не удалось загрузить задачи");
  return response.json();
}

export async function createTask(task: TaskCreate): Promise<Task> {
  const token = getToken();
  const response = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(task),
  });
  if (!response.ok) await handleResponseError(response, "Ошибка при создании задачи");
  return response.json();
}

export async function updateTask(id: number, task: Partial<TaskCreate>): Promise<any> {
  const token = getToken();
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(task),
  });
  if (!response.ok) await handleResponseError(response, "Ошибка при обновлении задачи");
  return response.json();
}

export async function deleteTask(id: number): Promise<void> {
  const token = getToken();
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` },
  });
  if (!response.ok) await handleResponseError(response, "Ошибка при удалении задачи");
}