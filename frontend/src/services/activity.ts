import api from './api';

export const getWeeklyActivity = async () => {
  const response = await api.get('/api/weekly-activity/');
  return response.data;
};