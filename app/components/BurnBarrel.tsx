import { useState } from 'react';
import { FiTrash } from 'react-icons/fi';
import type { User } from 'types';

export const BurnBarrel = ({ user, socket }) => {
    const [active, setActive] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        setActive(true);
    };

    const handleDragLeave = () => {
        setActive(false);
    };

    const handleDragEnd = (e) => {
        setActive(false);
        const cardId = e.dataTransfer.getData('cardId');
        const cardOwner = e.dataTransfer.getData('cardOwner');

        const storedUser = sessionStorage.getItem('user');
        const loggedUser: User = storedUser ? JSON.parse(storedUser) : null;

        if (cardOwner !== user.name)
            if (!loggedUser?.superUser) {
                // alert('Você não pode remover cards de outros usuários!');
                return;
            }

        if (socket) {
            socket.removeCard(cardId);
        }

        setActive(false);
    };

    return (
        <div
            onDrop={handleDragEnd}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            title="Arraste o card para a lixeira para removê-lo"
            className={`print:hidden mt-10 grid h-20 w-20 fixed bottom-10 right-10 shrink-0 place-content-center rounded-full border text-3xl z-2 ${
                active
                    ? 'dark:border-red-800 dark:bg-red-800/20 dark:text-red-500 border-red-600 bg-red-600/20 text-red-500'
                    : 'dark:border-neutral-500 dark:bg-neutral-500/20 dark:text-neutral-500 border-neutral-400 bg-neutral-300/20 text-neutral-500'
            }`}>
            {active ? <FiTrash className="animate-pulse" /> : <FiTrash className="" />}
        </div>
    );
};
