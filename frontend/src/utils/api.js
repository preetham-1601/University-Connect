const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

// GET ALL CHANNELS
export const getChannels = async () => {
  const res = await fetch(`${API_URL}/channels`);
  return res.json();
};

// CREATE A NEW CHANNEL
export const createChannel = async ({ name, description }) => {
  const res = await fetch(`${API_URL}/channels`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, description })
  });
  return res.json();
};

// GET CHANNEL MESSAGES
export const getChannelMessages = async (channelId) => {
  const res = await fetch(`${API_URL}/channels/messages/${channelId}`);
  return res.json();
};

// SEND A CHANNEL MESSAGE
export const sendChannelMessage = async ({ channel_id, sender_id, content }) => {
  const res = await fetch(`${API_URL}/channels/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ channel_id, sender_id, content })
  });
  return res.json();
};