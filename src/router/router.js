import { createBrowserRouter } from 'react-router';
import Index from '@/pages/index';
import NotFound from '@/pages/not-found';

export const PATHS = {
    INDEX: '/',
    TIMEACTIVE: '/live'
};

const router = createBrowserRouter([
    {
        path: PATHS.INDEX,
        element: <NotFound />
    },
    {
        path: `${PATHS.TIMEACTIVE}/*`,
        element: <Index />
    },
    {
        path: '*',
        element: <NotFound />
    }
]);

export default router;
