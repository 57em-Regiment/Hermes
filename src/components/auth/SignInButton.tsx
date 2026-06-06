import { authClient } from '@/lib/auth';
import { Button } from '@57eme-regiment/nabu-ui';

export const SignInButton = () => {
  return (
    <Button
      onClick={() =>
        authClient.signIn.social({
          provider: 'discord',
          callbackURL: 'http://hermes.57regiment.local:5173',
        })
      }>
      Login
    </Button>
  );
};
