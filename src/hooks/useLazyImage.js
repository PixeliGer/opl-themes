import { useState, useEffect } from 'react';

const useLazyImage = (imageUrl, isVisible) => {
  const [src, setSrc] = useState(null);

  useEffect(() => {
    if (!isVisible || !imageUrl) return;

    const image = new Image();
    image.onload = () => setSrc(imageUrl);
    image.onerror = () => setSrc(null);
    image.src = imageUrl;

    return () => {
      image.onload = null;
      image.onerror = null;
    };
  }, [imageUrl, isVisible]);

  return src;
};

export default useLazyImage;
