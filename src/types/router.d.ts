import type React from 'react';
import type { NavigationLink } from '@57eme-regiment/nabu-frontend-utils';

declare module '@tanstack/react-router' {
  interface StaticDataRouteOption {
    link?: NavigationLink;
    BreadcrumbLabel?: React.ComponentType<{ params: Record<string, string> }>;
  }
}
