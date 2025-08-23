import { useState } from 'react';
import type { Card as ICard, User } from 'types';
import { DropIndicator } from '..';
import { AddCard } from './AddCard';
import { Card } from './Card';

interface ColumnProps {
    index: number;
    title: string;
    headingColor: string;
    cards: Array<ICard>;
    column: string;
    socket: { updateCard: (id: string, card: any) => void } | null;
    filteredUser?: User | null;
}

export const Column: React.FC<ColumnProps> = ({
    title,
    headingColor,
    cards,
    column,
    socket,
    filteredUser,
    index,
}) => {
    const [active, setActive] = useState(false);

    const storedUser = sessionStorage.getItem('user');
    const loggedUser: User = storedUser ? JSON.parse(storedUser) : null;

    const handleDragEnd = (e) => {
        const cardId = e.dataTransfer.getData('cardId');
        const cardOwner = e.dataTransfer.getData('cardOwner');

        setActive(false);
        clearHighlights();

        const indicators = getIndicators();
        const { element } = getNearestIndicator(e, indicators);

        if (cardOwner !== loggedUser.name)
            if (!loggedUser?.superUser) {
                // alert('Você não pode mover cards de outros usuários!');
                return;
            }

        const before = element.dataset.before || '-1';

        if (before !== cardId) {
            let cardToUpdate = cards.find((c) => c.id === cardId);
            if (!cardToUpdate) return;
            cardToUpdate = { ...cardToUpdate, column };

            if (socket) socket.updateCard(cardId, cardToUpdate);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        highlightIndicator(e);

        setActive(true);
    };

    const clearHighlights = (els: Element[] | undefined = undefined) => {
        const indicators = els || getIndicators();

        indicators.forEach((i) => {
            (i as HTMLElement).style.opacity = '0';
        });
    };

    const highlightIndicator = (e) => {
        const indicators = getIndicators();

        clearHighlights(indicators);

        const el = getNearestIndicator(e, indicators);

        (el.element as HTMLElement).style.opacity = '1';
    };

    const getNearestIndicator = (e, indicators) => {
        const DISTANCE_OFFSET = 50;

        const el = indicators.reduce(
            (closest, child) => {
                const box = child.getBoundingClientRect();

                const offset = e.clientY - (box.top + DISTANCE_OFFSET);

                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child };
                } else {
                    return closest;
                }
            },
            {
                offset: Number.NEGATIVE_INFINITY,
                element: indicators[indicators.length - 1],
            }
        );

        return el;
    };

    const getIndicators = () => {
        return Array.from(document.querySelectorAll(`[data-column="${column}"]`));
    };

    const handleDragLeave = () => {
        clearHighlights();
        setActive(false);
    };

    const filteredCards = cards.filter((c) => c.column === column);

    const finalCards = filteredCards.filter((c) => {
        if (!filteredUser) return true;
        return c.user.name === filteredUser.name;
    });

    return (
        <div className="w-full">
            <div className="mb-3 flex items-center justify-between">
                <h3 className={`font-medium text-${headingColor}-400`}>{title}</h3>
                <span className="rounded text-sm text-neutral-400">
                    {filteredCards.length}
                </span>
            </div>
            <AddCard column={column} socket={socket} index={index} />
            <div
                onDrop={handleDragEnd}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`h-full w-full transition-colors ${
                    active ? 'dark:bg-neutral-800/50 bg-neutral-50 ' : 'bg-neutral-800/0'
                }`}>
                {finalCards.map((c) => {
                    return <Card socket={socket} key={c.id} {...c} />;
                })}
                <DropIndicator
                    beforeId={null}
                    column={column}
                    headingColor={headingColor}
                />
            </div>
        </div>
    );
};
