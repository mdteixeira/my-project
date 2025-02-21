import React, { createContext, useContext, useEffect, useState } from 'react';
import { FiPlus, FiTrash, FiTrash2 } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { DEFAULT_CARDS } from './DEFAULT_CARDS';
import { getInitials } from './getInitials';

function UserIcon(props) {
    return (
        <div
            className={
                props.filteredUser?.name === props.user.name
                    ? `flex items-center border space-x-1.5 bg-${props.user.color}-500 h-12 w-12 rounded-full grid place-items-center ${props.user.color}-700 cursor-pointer`
                    : `flex items-center space-x-1.5 bg-${props.user.color}-500 h-12 w-12 rounded-full grid place-items-center ${props.user.color}-700 cursor-pointer`
            }
            onClick={() => {
                if (props.filteredUser?.name === props.user.name) {
                    props.setFilteredUser(null);
                    props.setIsFiltered(false);
                    return props.setCards(props.allCards);
                }

                props.setFilteredUser(props.user);
                if (!props.isFiltered) props.setAllCards(props.cards);
                props.setIsFiltered(true);
                props.setCards(
                    props.allCards.filter((card) => {
                        return card.user.name === props.user.name;
                    })
                );
            }}>
            <p>{getInitials(props.user.name)}</p>
        </div>
    );
}

function UsersFilter(props) {
    return (
        <div className="flex space-x-3">
            {props.users.map((user: any) => {
                return (
                    <UserIcon
                        key={user.name}
                        cards={props.cards}
                        setCards={props.setCards}
                        allCards={props.allCards}
                        setAllCards={props.setAllCards}
                        isFiltered={props.isFiltered}
                        setIsFiltered={props.setIsFiltered}
                        filteredUser={props.filteredUser}
                        setFilteredUser={props.setFilteredUser}
                        user={user}></UserIcon>
                );
            })}
        </div>
    );
}

export const MyApp = () => {
    const [cards, setCards] = useState(DEFAULT_CARDS);
    const [allCards, setAllCards] = useState(cards);
    const [isFiltered, setIsFiltered] = useState(false);
    const [users, setUsers] = useState<{ name: string; color: string }[]>([]);
    const [user, setUser] = useState<{ name: string; color: string } | null>(null);
    const [userColor, setUserColor] = useState<string>('');

    const [error, setError] = useState<string>('');

    const COLORS = [
        'red',
        'amber',
        'emerald',
        'teal',
        'cyan',
        'sky',
        'blue',
        'violet',
        'purple',
        'fuchsia',
        'pink',
        'rose',
    ];

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

    useEffect(() => {}, [user]);

    const userScreen = (
        <form
            className="grid place-content-center h-screen"
            onSubmit={(e) => {
                e.preventDefault();
                if (!userColor || !username)
                    return setError(
                        `${
                            !userColor && !username
                                ? 'Username e cor'
                                : !username
                                ? 'Username'
                                : 'Cor'
                        } faltando!`
                    );
                setUser({ name: username, color: userColor });
            }}>
            <h2>Qual é seu nome?</h2>
            <input
                onChange={(e) => {
                    setUsername(e.target.value);
                }}
                className="border-neutral-700 border rounded bg-neutral-900 p-2"
                type="text"
            />
            <div className="space-y-4 mt-6">
                <h2>Qual cor?</h2>
                <div className="grid grid-cols-5 justify-around gap-5">
                    {COLORS.map((color) => (
                        <div
                            onClick={() => setUserColor(color)}
                            className={
                                userColor === color
                                    ? `size-12 rounded-full cursor-pointer hover:brightness-50 bg-${color}-500 border-2`
                                    : `size-12 rounded-full cursor-pointer hover:brightness-50 bg-${color}-500`
                            }></div>
                    ))}
                </div>
                <button className="bg-white font-semibold hover:brightness-75 cursor-pointer mt-3 text-black p-2 rounded-xl px-4">
                    Prosseguir
                </button>
                {<span className="text-red-500 ml-4">{error}</span>}
            </div>
        </form>
    );

    return (
        <>
            <span className="bg-red-500 bg-orange-500 bg-amber-500 bg-yellow-500 bg-lime-500 bg-green-500 bg-emerald-500 bg-teal-500 bg-cyan-500 bg-sky-500 bg-blue-500 bg-indigo-500 bg-violet-500 bg-purple-500 bg-fuchsia-500 bg-pink-500 bg-rose-500"></span>
            {user ? (
                <div className="h-screen w-full bg-neutral-900 text-neutral-50">
                    <div className='h-20 flex items-center justify-between px-10'>
                        <UsersFilter
                            cards={cards}
                            setCards={setCards}
                            allCards={allCards}
                            setAllCards={setAllCards}
                            isFiltered={isFiltered}
                            setIsFiltered={setIsFiltered}
                            users={users}
                            filteredUser={filteredUser}
                            setFilteredUser={setFilteredUser}></UsersFilter>
                            <button>Exportar para excel</button>
                    </div>
                    <Board cards={cards} setCards={setCards} user={user} />
                </div>
            ) : (
                userScreen
            )}
        </>
    );
};

const Board = ({ cards, setCards, user }: any) => {
    return (
        <div className="grid grid-cols-4 w-full gap-3 px-12 overflow-hidden">
            <Column
                title="Bom e devemos Continuar"
                column="good"
                headingColor="text-emerald-300"
                cards={cards}
                setCards={setCards}
                user={user}
            />
            <Column
                title="Podemos melhorar"
                column="improve"
                headingColor="text-yellow-200"
                cards={cards}
                setCards={setCards}
                user={user}
            />
            <Column
                title="Devemos parar"
                column="stop"
                headingColor="text-red-300"
                cards={cards}
                setCards={setCards}
                user={user}
            />
            <Column
                title="Devemos iniciar"
                column="start"
                headingColor="text-teal-200"
                cards={cards}
                setCards={setCards}
                user={user}
            />
            <BurnBarrel setCards={setCards} user={user} />
        </div>
    );
};

const Column = ({ title, headingColor, cards, column, setCards, user }) => {
    const [active, setActive] = useState(false);

    const handleDragStart = (e, card) => {
        e.dataTransfer.setData('cardId', card.id);
        e.dataTransfer.setData('cardOwner', card.username);
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
        <div className="w-full shrink-0 h-full">
            <div className="mb-3 flex items-center justify-between">
                <h3 className={`font-medium ${headingColor}`}>{title}</h3>
                <span className="rounded text-sm text-neutral-400">
                    {filteredCards.length}
                </span>
            </div>
            <AddCard column={column} setCards={setCards} user={user} />
            <div
                onDrop={handleDragEnd}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`h-full max-h-[80vh] w-full overflow-y-auto overflow-x-hidden transition-colors ${
                    active ? 'bg-neutral-800/50' : 'bg-neutral-800/0'
                }`}>
                {filteredCards.map((c) => {
                    return <Card key={c.id} {...c} handleDragStart={handleDragStart} />;
                })}
                <DropIndicator beforeId={null} column={column} />
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
                <p className={!user.hidden ? "text-neutral-100" : 'bg-neutral-100 brightness-50 rounded-sm w-auto text-transparent'}>{title}</p>
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

const BurnBarrel = ({ setCards, user }) => {
    const [active, setActive] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        if (e.dataTransfer.getData('cardOwner') !== user.name) return;
        setActive(true);
    };

    const handleDragLeave = () => {
        setActive(false);
    };

    const handleDragEnd = (e) => {
        const cardId = e.dataTransfer.getData('cardId');
        const cardOwner = e.dataTransfer.getData('cardOwner');

        if (cardOwner !== user.name) return;

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

const AddCard = ({ column, setCards, user }) => {
    const [text, setText] = useState('');
    const [adding, setAdding] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!text.trim().length) return;

        const newCard = {
            column,
            title: text.trim(),
            id: Math.random().toString(),
            user,
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
                        placeholder="Adicionar Card..."
                        className="w-full rounded border border-violet-400 bg-violet-400/20 p-3 text-sm text-neutral-50 placeholder-violet-300 focus:outline-0"
                    />
                    <div className="my-1.5 flex items-center justify-end gap-1.5">
                        <button
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
