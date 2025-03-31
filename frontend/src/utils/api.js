// /frontend/src/utils/api.js
const API_URL = "http://localhost:5000/api";

// SIGNUP
export const signup = async ({ email, password, confirmPassword, username, universityName }) => {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, confirmPassword, username, universityName })
  });
  return res.json();
};

// LOGIN
export const login = async ({ email, password }) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password})
  });
  return res.json();
};

// GET PROFILE
export const getProfile = async (token) => {
  const res = await fetch(`${API_URL}/profile?token=${token}`);
  return res.json();
};

// UPDATE PROFILE
export const updateProfile = async ({ token, fullName, bio, avatarURL, interests }) => {
  const res = await fetch(`${API_URL}/profile`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, fullName, bio, avatarURL, interests })
  });
  return res.json();
};
