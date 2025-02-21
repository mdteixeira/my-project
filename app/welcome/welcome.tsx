import { useState } from 'react';
import logoDark from './logo-dark.svg';
import logoLight from './logo-light.svg';

export function Welcome() {

  const [name, setName] = useState('')

    return (
        <main className="flex items-center justify-center pt-16 pb-4">
            <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
                <header className="flex flex-col items-center gap-9">
                    <div className="w-[500px] max-w-[100vw] p-4">
                        <img
                            src={logoLight}
                            alt="React Router"
                            className="block w-full dark:hidden"
                        />
                        <img
                            src={logoDark}
                            alt="React Router"
                            className="hidden w-full dark:block"
                        />
                    </div>
                </header>
                <div className="w-full max-w-[500px] space-y-6 px-4">
                    <nav className="rounded-3xl border border-gray-200 p-6 dark:border-gray-700 space-y-4">
                        <p className="leading-6 text-gray-700 dark:text-gray-200 text-center">
                            Quem é você?
                        </p>
                        <div className="grid relative">
                            <input onChange={(e) => setName(e.target.value)} className="rounded-2xl w-full border border-gray-200 py-2 dark:border-gray-700 px-2"></input>
                        </div>
                    </nav>
                </div>
            </div>
        </main>
    );
}
