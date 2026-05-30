import { authClient } from '@/lib/auth';
import { SignInButton } from './SignInButton';
import { UserDropdown } from './UserDropdown';

export const AuthButton = async () => {
  const session = authClient.useSession();

  if (session.data) return <UserDropdown />;
  return <SignInButton />;
};
