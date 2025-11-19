const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const getToken = () => localStorage.getItem('token');

const fetchApi = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) throw new Error('API request failed');
  return response.json();
};

export const login = (email, password) =>
  fetchApi('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });

export const register = (data) =>
  fetchApi('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data)
  });

export const getRooms = () => fetchApi('/rooms');

export const createRoom = (data) =>
  fetchApi('/rooms', {
    method: 'POST',
    body: JSON.stringify(data)
  });

export const updateRoom = (id, data) =>
  fetchApi(`/rooms/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  });

export const deleteRoom = (id) =>
  fetchApi(`/rooms/${id}`, {
    method: 'DELETE'
  });

export const getReservations = () => fetchApi('/reservations');

export const createReservation = (data) =>
  fetchApi('/reservations', {
    method: 'POST',
    body: JSON.stringify(data)
  });

export const updateReservation = (id, data) =>
  fetchApi(`/reservations/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  });

export const deleteReservation = (id) =>
  fetchApi(`/reservations/${id}`, {
    method: 'DELETE'
  });
