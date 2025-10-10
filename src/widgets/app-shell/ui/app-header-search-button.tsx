'use client';

import { Loader2, Search } from 'lucide-react';

import { AppHeaderActionButton } from './app-header-action-button';

interface AppHeaderSearchButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  ariaLabel?: string;
  showLabel?: boolean;
  className?: string;
}

function AppHeaderSearchButton({
  onClick,
  disabled = false,
  loading = false,
  ariaLabel = '검색 열기',
  showLabel = false,
  className,
}: AppHeaderSearchButtonProps) {
  return (
    <AppHeaderActionButton
      icon={Search}
      loadingIcon={Loader2}
      onClick={onClick}
      disabled={disabled}
      loading={loading}
      ariaLabel={ariaLabel}
      label="검색"
      showLabel={showLabel}
      className={className}
    />
  );
}

export { AppHeaderSearchButton };
export type { AppHeaderSearchButtonProps };
