// ============================================
// IMAGE FETCHER WITH 3-LEVEL FALLBACK
// Pexels → Pixabay → Unsplash
// ============================================

const PEXELS_KEY = "Xj3VwriNWQqMLPus54XzLgdOA36HrQYEGNlnEIaxh45fjO0v2t390NO0";
const PIXABAY_KEY = "53460678-207cf808423d7be7e631af130";
const UNSPLASH_KEY = "Kq4yuclOJ-4SO96qPVvnK-NhzBgHLq1CMiy3Gd66X4E";

// 1️⃣ Try Pexels
async function fetchFromPexels(query) {
  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${query}&per_page=1`,
      {
        headers: {
          Authorization: PEXELS_KEY,
        },
      }
    );

    if (!res.ok) return null;

    const data = await res.json();
    return data.photos?.[0]?.src?.medium || null;
  } catch (err) {
    return null;
  }
}

// 2️⃣ Try Pixabay
async function fetchFromPixabay(query) {
  try {
    const res = await fetch(
      `https://pixabay.com/api/?key=${PIXABAY_KEY}&q=${query}&image_type=photo&per_page=3`
    );

    if (!res.ok) return null;

    const data = await res.json();
    return data.hits?.[0]?.webformatURL || null;
  } catch (err) {
    return null;
  }
}

// 3️⃣ Try Unsplash
async function fetchFromUnsplash(query) {
  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${query}&per_page=1&client_id=${UNSPLASH_KEY}`
    );

    if (!res.ok) return null;

    const data = await res.json();
    return data.results?.[0]?.urls?.small || null;
  } catch (err) {
    return null;
  }
}

// ============================================
// EXPORT MAIN FUNCTION
// ============================================

export async function fetchImage(query) {
  // 1️⃣ Pexels first
  const pexels = await fetchFromPexels(query);
  if (pexels) return pexels;

  // 2️⃣ Pixabay fallback
  const pixabay = await fetchFromPixabay(query);
  if (pixabay) return pixabay;

  // 3️⃣ Unsplash final fallback
  const unsplash = await fetchFromUnsplash(query);
  if (unsplash) return unsplash;

  return null;
}
