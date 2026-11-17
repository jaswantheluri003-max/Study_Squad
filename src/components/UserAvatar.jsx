import React, { useState } from 'react';
import { DEFAULT_AVATAR } from '../utils/constants';

export const UserAvatar = ({
  src,
  alt = 'User avatar',
  className = 'w-8 h-8',
  title
}) => {
  const [imgSrc, setImgSrc] = useState(src || DEFAULT_AVATAR);

  // Sync if prop changes
  React.useEffect(() => {
    setImgSrc(src || DEFAULT_AVATAR);
  }, [src]);

  return (
    <img
      src={imgSrc || DEFAULT_AVATAR}
      alt={alt}
      title={title}
      onError={() => {
        if (imgSrc !== DEFAULT_AVATAR) {
          setImgSrc(DEFAULT_AVATAR);
        }
      }}
      className={`rounded-full object-cover shrink-0 select-none bg-slate-200 dark:bg-slate-800 ${className}`}
    />
  );
};
