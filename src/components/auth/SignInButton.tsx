import { authClient } from '@/lib/auth';
import { Button } from '@57eme-regiment/nabu-ui';
import { useTranslation } from 'react-i18next';

export const SignInButton = () => {
  const { t } = useTranslation();
  return (
    <Button
      onClick={() =>
        authClient.signIn.social({
          provider: 'discord',
          callbackURL: 'http://hermes.57regiment.local:5173',
        })
      }>
      {t('Global.Auth.login')}
    </Button>
  );
};
