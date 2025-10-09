import { LoginPanel } from '@/widgets/login/ui/login-panel';

interface LoginPageProps {
  redirectPath?: string;
}

function LoginPage({ redirectPath }: LoginPageProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/20 px-4 py-16">
      <LoginPanel redirectUri={redirectPath} />
    </main>
  );
}

export { LoginPage };
