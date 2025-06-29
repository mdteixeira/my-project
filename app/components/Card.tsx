import { DropIndicator } from "..";
import { motion } from 'framer-motion';

interface User {
    hidden: boolean;
    color: string;
    name: string;
}

interface CardProps {
    title: string;
    id: string;
    column: string;
    user: User;
}

export const Card: React.FC<CardProps> = ({ title, id, column, user }) => {

    interface DragEventWithCard extends React.DragEvent {
        dataTransfer: DataTransfer & {
            setData: (format: string, data: string) => void;
        };
    }

    interface DraggedCard {
        title: string;
        id: string;
        column: string;
        user: User;
    }

    const handleDragStart = (e: DragEventWithCard, card: DraggedCard): void => {
        console.log(`Dragging card:`, card);
        e.dataTransfer.setData('cardId', card.id);
        e.dataTransfer.setData('cardOwner', card.user.name);
    };

    return (
        <>
            <DropIndicator beforeId={id} column={column} />
            <motion.div
                layout
                layoutId={id}
                draggable="true"
                onDragStart={(e) => handleDragStart(e as unknown as DragEventWithCard, { title, id, column, user })}
                className="cursor-grab rounded-xl border border-neutral-700 bg-neutral-800 p-3 active:cursor-grabbing space-y-2">
                <p
                    className={
                        !user.hidden
                            ? 'text-neutral-100'
                            : 'bg-neutral-100 brightness-50 rounded-sm w-auto text-transparent'
                    }>
                    {title}
                </p>
                <div className="flex items-center justify-between space-x-1.5 text-neutral-400">
                    <div className="flex gap-1 items-center">
                        <span
                            className={`h-2 w-2 rounded-full bg-${user.color}-500`}></span>
                        <small>{user.name}</small>
                    </div>
                </div>
            </motion.div>
        </>
    );
};