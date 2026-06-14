import { LINKS } from '@/features/navigation/links';
import { authClient } from '@/lib/auth';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@57eme-regiment/nabu-ui';
import { IconHome, IconLoader2, IconLogout } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

export function UserDropdown() {
  const { t } = useTranslation();
  const session = authClient.useSession();
  const user = session.data?.user;
  const navigate = useNavigate();

  const logout = useMutation({
    mutationFn: () => authClient.signOut(),
    onSuccess: () => navigate({ to: '/unauthenticated' }),
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-md px-2 py-1 text-sm hover:bg-muted hover:cursor-pointer">
        <div className="group size-9 rounded-full">
          <Avatar className="mr-2 size-full group-active:scale-95">
            <AvatarFallback className="bg-card">
              {user?.name?.slice(0, 1).toUpperCase()}
            </AvatarFallback>
            {user?.image && <AvatarImage src={user.image} />}
          </Avatar>
        </div>
        <span className="max-w-32 truncate">{session.data?.user?.name}</span>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => navigate({ to: LINKS.index.to })}
            className="hover:cursor-pointer">
            <IconHome className="mr-2 size-4" />
            {t('Links.index')}
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => navigate({ to: LINKS.ProductionRequest.index.to })}
            className="hover:cursor-pointer">
            {LINKS.ProductionRequest.index.Icon && (
              <LINKS.ProductionRequest.index.Icon className="mr-2 size-4" />
            )}
            {t(LINKS.ProductionRequest.index.label)}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem
            variant="destructive"
            onClick={e => {
              e.stopPropagation();
              e.preventDefault();
              logout.mutate();
            }}
            className="hover:cursor-pointer">
            {logout.isPending ? (
              <IconLoader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <IconLogout className="mr-2 size-4" />
            )}
            {t('Global.Auth.logout')}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
