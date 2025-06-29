import { useState } from "react";
import { FiTrash } from "react-icons/fi";

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
        const cardId = e.dataTransfer.getData('cardId');
        const cardOwner = e.dataTransfer.getData('cardOwner');

        if (cardOwner !== user.name) return;

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
            title='Arraste o card para a lixeira para removê-lo'
            className={`mt-10 grid h-20 w-20 absolute bottom-12 right-12 shrink-0 place-content-center rounded-full border text-3xl z-2 ${
                active
                    ? 'border-red-800 bg-red-800/20 text-red-500'
                    : 'border-neutral-500 bg-neutral-500/20 text-neutral-500'
            }`}>
            {active ? <FiTrash className="animate-pulse" /> : <FiTrash className="" />}
        </div>
    );
};