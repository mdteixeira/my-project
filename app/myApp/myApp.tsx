import React, { useContext, useEffect, useState } from 'react';
import { FiPlus, FiTrash, FiTrash2 } from 'react-icons/fi';
import { motion } from 'framer-motion';

export const MyApp = () => {
    const [cards, setCards] = useState(DEFAULT_CARDS);
    const [allCards, setAllCards] = useState(cards);
    const [isFiltered, setIsFiltered] = useState(false);
    const [users, setUsers] = useState<{ name: string; color: string }[]>([]);
    const [user, setUser] = useState<{ name: string; color: string } | null>(null);

    const [username, setUsername] = useState<string>(``);
    const [filteredUser, setFilteredUser] = useState<{
        name: string;
        color: string;
    } | null>(null);

    useEffect(() => {
        let _users: { name: string; color: string }[] = [];

        cards.map((card) => {
            if (
                _users.find((user) => {
                    return user.name === card.user.name;
                })
            )
                return;
            _users.push(card.user);
        });
        setUsers(_users);
    }, []);

    return (
        <>
            {user ? (
                <div className="h-screen w-full bg-neutral-900 text-neutral-50">
                    <div className="flex space-x-3 p-2">
                        {users.map((user: any) => {
                            return (
                                <div
                                    className={
                                        filteredUser?.name === user.name
                                            ? `flex items-center border space-x-1.5 bg-${user.color}-500 h-12 w-12 rounded-full grid place-items-center ${user.color}-700 cursor-pointer`
                                            : `flex items-center space-x-1.5 bg-${user.color}-500 h-12 w-12 rounded-full grid place-items-center ${user.color}-700 cursor-pointer`
                                    }
                                    onClick={() => {
                                        if (filteredUser?.name === user.name) {
                                            setFilteredUser(null);
                                            setIsFiltered(false);
                                            return setCards(allCards);
                                        }

                                        setFilteredUser(user);
                                        if (!isFiltered) setAllCards(cards);
                                        setIsFiltered(true);
                                        setCards(
                                            allCards.filter((card) => {
                                                return card.user.name === user.name;
                                            })
                                        );
                                    }}
                                    key={user.name}>
                                    <p>{getInitials(user.name)}</p>
                                </div>
                            );
                        })}
                    </div>
                    <Board cards={cards} setCards={setCards} />
                    <span className="bg-emerald-500 bg-red-500 bg-amber-500 bg-sky-500"></span>
                </div>
            ) : (
                <form
                    className="grid place-content-center h-screen"
                    onSubmit={(e) => {
                        e.preventDefault()
                        setUser({ name: username, color: `emerald` });
                    }}>
                    <h2>Qual é seu nome?</h2>
                    <input
                        onChange={(e) => {
                            setUsername(e.target.value);
                        }}
                        className="border-neutral-700 border rounded bg-neutral-900 p-2"
                        type="text"
                    />
                </form>
            )}
        </>
    );
};

function getInitials(name: string) {
    return name.split(' ').map((partial) => {
        return partial.substring(0, 1);
    });
}

const Board = ({ cards, setCards }: any) => {
    return (
        <div className="grid grid-cols-4 h-full w-full gap-3 overflow-y-scroll p-12">
            <Column
                title="Backlog"
                column="backlog"
                headingColor="text-neutral-500"
                cards={cards}
                setCards={setCards}
            />
            <Column
                title="TODO"
                column="todo"
                headingColor="text-yellow-200"
                cards={cards}
                setCards={setCards}
            />
            <Column
                title="In progress"
                column="doing"
                headingColor="text-blue-200"
                cards={cards}
                setCards={setCards}
            />
            <Column
                title="Complete"
                column="done"
                headingColor="text-emerald-200"
                cards={cards}
                setCards={setCards}
            />
            <BurnBarrel setCards={setCards} />
        </div>
    );
};

const Column = ({ title, headingColor, cards, column, setCards }) => {
    const [active, setActive] = useState(false);

    const handleDragStart = (e, card) => {
        e.dataTransfer.setData('cardId', card.id);
    };

    const handleDragEnd = (e) => {
        const cardId = e.dataTransfer.getData('cardId');

        setActive(false);
        clearHighlights();

        const indicators = getIndicators();
        const { element } = getNearestIndicator(e, indicators);

        const before = element.dataset.before || '-1';

        if (before !== cardId) {
            let copy = [...cards];

            let cardToTransfer = copy.find((c) => c.id === cardId);
            if (!cardToTransfer) return;
            cardToTransfer = { ...cardToTransfer, column };

            copy = copy.filter((c) => c.id !== cardId);

            const moveToBack = before === '-1';

            if (moveToBack) {
                copy.push(cardToTransfer);
            } else {
                const insertAtIndex = copy.findIndex((el) => el.id === before);
                if (insertAtIndex === undefined) return;

                copy.splice(insertAtIndex, 0, cardToTransfer);
            }

            setCards(copy);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        highlightIndicator(e);

        setActive(true);
    };

    const clearHighlights = (els) => {
        const indicators = els || getIndicators();

        indicators.forEach((i) => {
            i.style.opacity = '0';
        });
    };

    const highlightIndicator = (e) => {
        const indicators = getIndicators();

        clearHighlights(indicators);

        const el = getNearestIndicator(e, indicators);

        el.element.style.opacity = '1';
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

    return (
        <div className="w-full shrink-0">
            <div className="mb-3 flex items-center justify-between">
                <h3 className={`font-medium ${headingColor}`}>{title}</h3>
                <span className="rounded text-sm text-neutral-400">
                    {filteredCards.length}
                </span>
            </div>
            <div
                onDrop={handleDragEnd}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`h-full w-full transition-colors ${
                    active ? 'bg-neutral-800/50' : 'bg-neutral-800/0'
                }`}>
                {filteredCards.map((c) => {
                    return <Card key={c.id} {...c} handleDragStart={handleDragStart} />;
                })}
                <DropIndicator beforeId={null} column={column} />
                <AddCard column={column} setCards={setCards} />
            </div>
        </div>
    );
};

const Card = ({ title, id, column, handleDragStart, user }) => {
    return (
        <>
            <DropIndicator beforeId={id} column={column} />
            <motion.div
                layout
                layoutId={id}
                draggable="true"
                onDragStart={(e) => handleDragStart(e, { title, id, column })}
                className="cursor-grab rounded border border-neutral-700 bg-neutral-800 p-3 active:cursor-grabbing space-y-2">
                <p className="text-neutral-100">{title}</p>
                <div className="flex items-center space-x-1.5 text-neutral-400">
                    <span className={`h-2 w-2 rounded-full bg-${user.color}-500`}></span>
                    <small>{user.name}</small>
                </div>
            </motion.div>
        </>
    );
};

const DropIndicator = ({ beforeId, column }) => {
    return (
        <div
            data-before={beforeId || '-1'}
            data-column={column}
            className="my-0.5 h-0.5 w-full bg-violet-400 opacity-0"
        />
    );
};

const BurnBarrel = ({ setCards }) => {
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

        setCards((pv) => pv.filter((c) => c.id !== cardId));

        setActive(false);
    };

    return (
        <div
            onDrop={handleDragEnd}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`mt-10 grid h-24 w-24 absolute bottom-12 right-12 shrink-0 place-content-center rounded border text-3xl ${
                active
                    ? 'border-red-800 bg-red-800/20 text-red-500'
                    : 'border-neutral-500 bg-neutral-500/20 text-neutral-500'
            }`}>
            {active ? <FiTrash className="animate-pulse" /> : <FiTrash />}
        </div>
    );
};

const AddCard = ({ column, setCards }) => {
    const [text, setText] = useState('');
    const [adding, setAdding] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!text.trim().length) return;

        const newCard = {
            column,
            title: text.trim(),
            id: Math.random().toString(),
            user: { name: 'aaa', color: 'emerald' },

        };

        setCards((pv) => [...pv, newCard]);

        setAdding(false);
    };

    return (
        <>
            {adding ? (
                <motion.form layout onSubmit={handleSubmit}>
                    <textarea
                        onChange={(e) => setText(e.target.value)}
                        autoFocus
                        placeholder="Add new task..."
                        className="w-full rounded border border-violet-400 bg-violet-400/20 p-3 text-sm text-neutral-50 placeholder-violet-300 focus:outline-0"
                    />
                    <div className="mt-1.5 flex items-center justify-end gap-1.5">
                        <button
                            onClick={() => setAdding(false)}
                            className="px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50">
                            Close
                        </button>
                        <button
                            type="submit"
                            className="flex items-center gap-1.5 rounded bg-neutral-50 px-3 py-1.5 text-xs text-neutral-950 transition-colors hover:bg-neutral-300">
                            <span>Add</span>
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

const DEFAULT_CARDS = [
    // BACKLOG
    {
        user: { name: 'Matheus Teixeira', color: 'emerald' },
        title: 'Look into render bug in dashboard',
        id: '1',
        column: 'backlog',
    },
    {
        user: { name: 'Felipe Santana', color: 'amber' },
        title: 'SOX compliance checklist',
        id: '2',
        column: 'backlog',
    },
    {
        user: { name: 'Felipe Kinoshita', color: 'red' },
        title: '[SPIKE] Migrate to Azure',
        id: '3',
        column: 'backlog',
    },
    {
        user: { name: 'Thayna Campos', color: 'sky' },
        title: 'Document Notifications service',
        id: '4',
        column: 'backlog',
    },
    // TODO
    {
        user: { name: 'Matheus Teixeira', color: 'emerald' },
        title: 'Research DB options for new microservice',
        id: '5',
        column: 'todo',
    },
    {
        user: { name: 'Matheus Teixeira', color: 'emerald' },
        title: 'Postmortem for outage',
        id: '6',
        column: 'todo',
    },
    {
        user: { name: 'Matheus Teixeira', color: 'emerald' },
        title: 'Sync with product on Q3 roadmap',
        id: '7',
        column: 'todo',
    },

    // DOING
    {
        user: { name: 'Matheus Teixeira', color: 'emerald' },
        title: 'Refactor context providers to use Zustand',
        id: '8',
        column: 'doing',
    },
    {
        user: { name: 'Matheus Teixeira', color: 'emerald' },
        title: 'Add logging to daily CRON',
        id: '9',
        column: 'doing',
    },
    // DONE
    {
        user: { name: 'Matheus Teixeira', color: 'emerald' },
        title: 'Set up DD dashboards for Lambda listener',
        id: '10',
        column: 'done',
    },
];
