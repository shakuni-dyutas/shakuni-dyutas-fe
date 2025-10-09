import { ROUTE_PATHS } from '@/shared/config/constants';

function resolveRedirectPath(redirectUri?: string) {
  if (
    typeof redirectUri === 'string' &&
    redirectUri.startsWith('/') &&
    !redirectUri.startsWith('//')
  ) {
    return redirectUri;
  }

  return ROUTE_PATHS.HOME;
}

export { resolveRedirectPath };
