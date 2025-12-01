// frontend/src/utils/fetchImage.js
const imageCache = {};

export const fetchImage = async (keyword) => {
  try {
    if (imageCache[keyword]) return imageCache[keyword];
    const url = `https://source.unsplash.com/400x300/?${encodeURIComponent(keyword)}`;
    const response = await fetch(url);
    imageCache[keyword] = response.url;
    return response.url;
  } catch (err) {
    console.error("fetchImage error:", err);
    return "https://via.placeholder.com/400?text=No+Image";
  }
};
