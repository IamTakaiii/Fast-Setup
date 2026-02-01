import { createFileRoute } from '@tanstack/react-router';
import { Error404 } from '@/pages/error-404';

// This is a catch-all route for handling 404 errors
export const Route = createFileRoute('/$')({
    component: Error404,
});
