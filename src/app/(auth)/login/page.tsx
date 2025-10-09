import { LoginPage } from '@/screens/login/ui/login-page';
import { sanitizeRedirectPath } from '@/shared/lib/sanitize-redirect-path';

type LoginRouteSearchParams = Record<string, string | string[] | undefined>;

interface LoginRouteProps {
  searchParams?: Promise<LoginRouteSearchParams>;
}

async function LoginRoute({ searchParams }: LoginRouteProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const redirectParam = resolvedSearchParams.redirect;
  const redirectPath = Array.isArray(redirectParam) ? redirectParam[0] : redirectParam;

  const sanitizedRedirectPath = sanitizeRedirectPath(redirectPath);

  return <LoginPage redirectPath={sanitizedRedirectPath} />;
}

export { LoginRoute as default };
