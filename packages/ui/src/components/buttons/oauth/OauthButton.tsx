'use client';
import { Button } from '../button';

export const OauthButton = ({
  icon,
  label,
  oauthUrl,
}: {
  icon?: React.ReactNode;
  label: string;
  oauthUrl: string;
}) => {
  return (
    <Button
      type="button"
      onClick={() => {
        window.location.href = oauthUrl;
      }}
      className="w-full"
    >
      <div className="flex items-center gap-2">
        {icon}
        {label}
      </div>
    </Button>
  );
};
