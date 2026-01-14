import api from "./api";

export const registerUser = async (userData) => {
  const response = await api.post("/users", userData);
  return response.data;
};

export const loginUser = async (email) => {
  const response = await api.get("/users");
  const user = response.data.find((u) => u.email === email);

  if (!user) {
    throw new Error("Email not found. Please register first.");
  }

  return user;
};

export const getAllUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};
