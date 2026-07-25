import api from './api';

export const getBookmarks = async () => {
  const response = await api.get('/api/bookmarks/');
  return response.data.bookmarks; // list of word IDs
};

export const addBookmark = async (wordId: number) => {
  const response = await api.post('/api/bookmarks/', { word_id: wordId });
  return response.data.bookmarks;
};

export const removeBookmark = async (wordId: number) => {
  const response = await api.delete('/api/bookmarks/', { data: { word_id: wordId } });
  return response.data.bookmarks;
};