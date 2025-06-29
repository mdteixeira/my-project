import type { Card } from "types";
import { motion } from 'framer-motion';
import { useState } from "react";
import { FiPlus } from "react-icons/fi";

export const AddCard = ({ column, user, socket }) => {
    const [text, setText] = useState('');
    const [adding, setAdding] = useState(false);

    const handleSubmit = (e) => {
        console.log('Submitting new card:', text, column, user);
        e.preventDefault();

        if (!text.trim().length) return;

        const newCard: Card = {
            column,
            title: text.trim(),
            id: Math.random().toString(),
            user,
        };

        console.log(user, newCard, `user aqui`);

        if (socket) socket.addCard(newCard);

        setAdding(false);
    };

    return (
        <>
            {adding ? (
                <motion.form layout onSubmit={handleSubmit}>
                    <input
                        onChange={(e) => setText(e.target.value)}
                        autoFocus
                        placeholder="Adicionar Card..."
                        className="w-full rounded border border-violet-400 bg-violet-400/20 p-3 text-sm text-neutral-50 placeholder-violet-300 focus:outline-0"
                    />
                    <div className="my-1.5 flex items-center justify-end gap-1.5">
                        <button
                            type="button"
                            onClick={() => setAdding(false)}
                            className="px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50">
                            Fechar
                        </button>
                        <button
                            type="submit"
                            className="flex items-center gap-1.5 rounded bg-neutral-50 px-3 py-1.5 text-xs text-neutral-950 transition-colors hover:bg-neutral-300">
                            <span>Adicionar</span>
                            <FiPlus />
                        </button>
                    </div>
                </motion.form>
            ) : (
                <motion.button
                    layout
                    onClick={() => setAdding(true)}
                    className="flex w-full items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50">
                    <span>Adicionar</span>
                    <FiPlus />
                </motion.button>
            )}
        </>
    );
};