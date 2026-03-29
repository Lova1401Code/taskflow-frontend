import { RegisterForm } from '../components/RegisterForm';
import { useRedirectAuthenticated } from '../hooks/useAuth';

export function RegisterPage() {
  useRedirectAuthenticated();

  return <RegisterForm />;
}

