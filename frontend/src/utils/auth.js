export const login = (email) => {
  localStorage.setItem("user", email);
};

export const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  localStorage.removeItem("authToken");
};

export const isAuthenticated = () => {
  const token = localStorage.getItem("token") || localStorage.getItem("authToken");
  const user = localStorage.getItem("user");
  return !!(token && user);
};
