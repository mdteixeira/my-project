import type { Route } from './+types/home';
import { Welcome } from '../welcome/welcome';
import { MyApp } from '../myApp/myApp';

export function meta({}: Route.MetaArgs) {
    return [
        { title: 'Sprint' },
    ];
}

export default function Home() {
    return (
        <>
            <MyApp />
        </>
    );
}
