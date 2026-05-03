export function normalizeRole(userOrRole) {
  const r =
    typeof userOrRole === "string" || typeof userOrRole === "number"
      ? userOrRole
      : userOrRole?.role;
  return String(r ?? "")
    .trim()
    .toLowerCase();
}

export function isProfessor(u) {
  return normalizeRole(u) === "professor";
}

export function isStudent(u) {
  return normalizeRole(u) === "student";
}

export function isAdmin(u) {
  return normalizeRole(u) === "admin";
}
