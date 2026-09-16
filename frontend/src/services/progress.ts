import api from './api';

export const getProgress = async () => {
  const response = await api.get('/api/progress/');
  return response.data;
};

export const updateProgress = async (wordId: number, status: 'learned' | 'hard') => {
  const response = await api.post('/api/progress/', { word_id: wordId, status });
  return response.data;
};