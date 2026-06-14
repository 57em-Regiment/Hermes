import { Link, useMatches } from '@tanstack/react-router';
import { ChevronRightIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function Breadcrumb() {
  const matches = useMatches();
  const { t } = useTranslation();

  const crumbs = matches.filter(
    m => m.staticData?.link || m.staticData?.BreadcrumbLabel,
  );

  const lastMatch = matches[matches.length - 1];
  const activeRouteHasData =
    !!lastMatch?.staticData?.link || !!lastMatch?.staticData?.BreadcrumbLabel;

  if (crumbs.length <= 1 && activeRouteHasData) return null;
  if (crumbs.length === 0) return null;

  return (
    <nav aria-label="breadcrumb">
      <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
        {crumbs.map((match, index) => {
          const isLast = index === crumbs.length - 1;
          const isActive =
            isLast && (!activeRouteHasData || match.id === lastMatch?.id);
          const { link, BreadcrumbLabel } = match.staticData ?? {};
          const params = match.params as Record<string, string>;
          const Icon = link?.Icon;

          const label = BreadcrumbLabel ? (
            <BreadcrumbLabel params={params} />
          ) : (
            t(link?.label ?? '')
          );

          const content = (
            <>
              {Icon && <Icon className="size-5 shrink-0" />}
              {label}
            </>
          );

          return (
            <li
              key={match.id}
              className="flex items-center gap-1.5 font-bold text-lg">
              {index > 0 && <ChevronRightIcon className="size-3.5 shrink-0" />}
              {isActive ? (
                <span className="flex items-center gap-1 text-foreground font-medium">
                  {content}
                </span>
              ) : (
                <Link
                  to={match.pathname as never}
                  className="flex items-center gap-1 hover:text-foreground transition-colors">
                  {content}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
