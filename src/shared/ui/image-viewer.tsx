'use client';

import type { ReactNode } from 'react';
import { useCallback, useState } from 'react';
import type { LightboxProps } from 'yet-another-react-lightbox';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

import { cn } from '@/shared/lib/utils';

interface ViewerImage {
  id: string;
  url: string;
  alt?: string;
}

type ImageViewerLightboxProps = Omit<LightboxProps, 'open' | 'close' | 'slides' | 'index'>;

interface ImageViewerProps {
  images: ViewerImage[];
  renderPreview: (helpers: { open: (index: number) => void; images: ViewerImage[] }) => ReactNode;
  className?: string;
  lightboxProps?: ImageViewerLightboxProps;
}

function ImageViewer({ images, renderPreview, className, lightboxProps }: ImageViewerProps) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const slides = images.map((image) => ({ src: image.url }));

  const handleOpen = useCallback(
    (startIndex: number) => {
      if (startIndex < 0 || startIndex >= slides.length) {
        return;
      }
      setIndex(startIndex);
      setOpen(true);
    },
    [slides.length],
  );

  if (images.length === 0) {
    return null;
  }

  return (
    <div className={cn(className)}>
      {renderPreview({ open: handleOpen, images })}
      {open ? (
        <Lightbox
          open={open}
          close={() => setOpen(false)}
          slides={slides}
          index={index}
          {...lightboxProps}
        />
      ) : null}
    </div>
  );
}

export type { ImageViewerProps, ViewerImage };
export { ImageViewer };
