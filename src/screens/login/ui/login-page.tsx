import { LoginPanel } from '@/widgets/login/ui/login-panel';

interface LoginPageProps {
  redirectPath?: string;
}

function LoginPage({ redirectPath }: LoginPageProps) {
  return (
    <section className="flex flex-1 items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <LoginPanel redirectUri={redirectPath} />
      </div>
    </section>
  );
}

export { LoginPage };
