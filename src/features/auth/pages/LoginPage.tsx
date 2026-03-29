import { LoginForm } from '../components/LoginForm';
import { useRedirectAuthenticated } from '../hooks/useAuth';

export function LoginPage() {
  useRedirectAuthenticated();

  return <LoginForm />;
}

