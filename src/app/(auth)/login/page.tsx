import { LoginPage } from '@/screens/login/ui/login-page';

type LoginRouteSearchParams = Record<string, string | string[] | undefined>;

interface LoginRouteProps {
  searchParams?: Promise<LoginRouteSearchParams>;
}

async function LoginRoute({ searchParams }: LoginRouteProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const redirectParam = resolvedSearchParams.redirect;
  const redirectPath = Array.isArray(redirectParam) ? redirectParam[0] : redirectParam;
  const sanitizedRedirectPath =
    typeof redirectPath === 'string' &&
    redirectPath.startsWith('/') &&
    !redirectPath.startsWith('//')
      ? redirectPath
      : undefined;

  return <LoginPage redirectPath={sanitizedRedirectPath} />;
}

export { LoginRoute as default };
