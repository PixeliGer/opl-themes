import { useState, useEffect, useRef } from 'react';

const useLazyImage = (imageUrl, isVisible) => {
  const [src, setSrc] = useState(null);
  const imageRef = useRef(null);

  useEffect(() => {
    if (!isVisible || !imageUrl) return;

    const image = new Image();
    imageRef.current = image;

    image.onload = () => setSrc(imageUrl);
    image.onerror = () => setSrc(null);
    image.src = imageUrl;

    return () => {
      image.onload = null;
      image.onerror = null;
      imageRef.current = null;
    };
  }, [imageUrl, isVisible]);

  return src;
};

export default useLazyImage;
