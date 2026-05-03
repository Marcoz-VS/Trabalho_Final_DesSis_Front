import axios from "axios";

export function apiErrorMessage(err, fallback = "Erro na requisição.") {
  if (!axios.isAxiosError(err)) return fallback;
  const msgs = err.response?.data?.errors;
  if (Array.isArray(msgs)) return msgs.join(" ");
  return err.response?.data?.message || fallback;
}
