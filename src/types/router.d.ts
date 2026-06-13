import type React from 'react';
import type { NavigationLink } from '@/features/navigation/navigation.model';

declare module '@tanstack/react-router' {
  interface StaticDataRouteOption {
    link?: NavigationLink;
    BreadcrumbLabel?: React.ComponentType<{ params: Record<string, string> }>;
  }
}
