'use client';

import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ROUTE_PATHS } from '@/shared/config/constants';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';

const SCROLL_TOP_THRESHOLD = 24;

interface CreateRoomCTAProps {
  onCreateRoomClick?: () => void;
  className?: string;
}

function CreateRoomCTA({ onCreateRoomClick, className }: CreateRoomCTAProps) {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    const updateVisibility = (currentScrollY: number) => {
      const nearTop = currentScrollY <= SCROLL_TOP_THRESHOLD;
      const isScrollingUp = currentScrollY < lastScrollYRef.current;

      setIsVisible(nearTop || isScrollingUp);
      lastScrollYRef.current = currentScrollY;
    };

    const handleScroll = () => {
      updateVisibility(window.scrollY);
    };

    lastScrollYRef.current = window.scrollY;
    updateVisibility(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <motion.aside
      className={cn(
        '-translate-x-1/2 fixed bottom-[calc(env(safe-area-inset-bottom,0px)+5.5rem)] left-1/2 z-40 w-full max-w-md md:max-w-lg',
        className,
      )}
      aria-label="방 생성 안내"
      initial={false}
      animate={isVisible ? 'visible' : 'hidden'}
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 12 },
      }}
      transition={{ duration: 0.24, ease: 'easeOut' }}
      style={{ pointerEvents: isVisible ? 'auto' : 'none' }}
      data-slot="lobby:create-room-cta"
    >
      <Card className="w-full border-border bg-background/95 shadow-lg backdrop-blur supports-[backdrop-filter]:backdrop-blur-md">
        <CardContent className="flex flex-col gap-3 p-4 sm:px-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="font-semibold text-sm leading-tight">새 방을 만들어 보세요</p>
            <p className="text-muted-foreground text-xs">
              친구와 함께 플레이하려면 방을 생성하고 초대 링크를 공유하세요.
            </p>
          </div>
          <Button
            type="button"
            aria-label="새 방 만들기"
            onClick={() => {
              onCreateRoomClick?.();
              router.push(ROUTE_PATHS.ROOM_CREATE);
            }}
            className="w-full md:w-auto"
          >
            방 생성하기
          </Button>
        </CardContent>
      </Card>
    </motion.aside>
  );
}

export { CreateRoomCTA };
export type { CreateRoomCTAProps };
