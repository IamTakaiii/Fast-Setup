import { Link } from '@tanstack/react-router';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toAbsoluteUrl } from '@/lib/utils';

export function Error404() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="mb-10">
        <img
          src={toAbsoluteUrl('/illustrations/19.svg')}
          className="block dark:hidden max-h-[160px]"
          alt="image"
        />
        <img
          src={toAbsoluteUrl('/illustrations/19-dark.svg')}
          className="hidden dark:block max-h-[160px]"
          alt="image"
        />
      </div>

      <Badge variant="primary" appearance="outline" className="mb-3">
        404 Error
      </Badge>

      <h3 className="text-2xl font-semibold text-mono text-center mb-2">
        We have lost this page
      </h3>

      <div className="text-base text-center text-secondary-foreground mb-10">
        The requested page is missing. Check the URL or return home.
      </div>

      <Button asChild>
        <Link to="/">Back to Home</Link>
      </Button>
    </div>
  );
}

