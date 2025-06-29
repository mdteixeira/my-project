import type { Route } from './+types/home';
import { App } from '..';

export function meta({}: Route.MetaArgs) {
    return [
        { title: 'Sprint' },
    ];
}

export default function Home() {
    return (
        <>
            <App />
        </>
    );
}
