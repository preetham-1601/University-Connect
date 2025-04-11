const API_URL = "http://localhost:5000/api";

// SIGNUP
export const signup = async ({ email, password, confirmPassword }) => {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, confirmPassword })
  });
  return res.json();
};

// LOGIN
export const login = async ({ email, password }) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  return res.json();
};

// GET PROFILE (uses token query parameter)
export const getProfile = async (token) => {
  const res = await fetch(`${API_URL}/profile?token=${token}`);
  return res.json();
};

// UPDATE PROFILE
export const updateProfile = async ({ token, fullName, avatarURL }) => {
  const res = await fetch(`${API_URL}/profile`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, fullName, avatarURL })
  });
  return res.json();
};

// GET ALL USERS (profiles)
export const getUsers = async () => {
  const res = await fetch(`${API_URL}/users`);
  return res.json();
};

// GET MESSAGES for direct messaging
export const getMessages = async (user1, user2) => {
  const res = await fetch(`${API_URL}/messages/between/${user1}/${user2}`);
  return res.json();
};

// SEND MESSAGE for direct messaging
export const sendMessage = async ({ sender_id, receiver_id, content }) => {
  const res = await fetch(`${API_URL}/messages/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sender_id, receiver_id, content })
  });
  return res.json();
};

