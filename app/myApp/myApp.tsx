import React, { useEffect, useState } from 'react';
import { FiPlus, FiTrash } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { getInitials } from './getInitials';
import SocketService from './Socket';
import type { Card, User } from 'types';
import { IoExitOutline } from 'react-icons/io5';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { PiExport } from 'react-icons/pi';
import { FaGear } from 'react-icons/fa6';

function UserIcon(props: {
    filteredUser: { name: string; color: string };
    setFilteredUser: React.Dispatch<
        React.SetStateAction<{
            name: string;
            color: string;
        } | null>
    >;
    user: { name: string; color: string };
}) {
    return (
        <div
            className={
                props.filteredUser?.name === props.user.name
                    ? `flex items-center border space-x-1.5 bg-${props.user.color}-500 h-12 w-12 rounded-full grid place-items-center ${props.user.color}-700 cursor-pointer`
                    : `flex items-center space-x-1.5 bg-${props.user.color}-500 h-12 w-12 rounded-full grid place-items-center ${props.user.color}-700 cursor-pointer`
            }
            onClick={() => {
                if (props.filteredUser?.name === props.user.name)
                    return props.setFilteredUser(null);

                props.setFilteredUser(props.user);
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
                        filteredUser={props.filteredUser}
                        setFilteredUser={props.setFilteredUser}
                        user={user}></UserIcon>
                );
            })}
        </div>
    );
}

export const MyApp = () => {
    const [cards, setCards] = useState<Card[]>([]);
    const [users, setUsers] = useState<{ name: string; color: string }[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [userColor, setUserColor] = useState<string>('');
    const [socket, setSocket] = useState<SocketService | null>(null);

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

    const [loading, setLoading] = useState<boolean>(true);

    const [username, setUsername] = useState<string>(``);
    const [room, setRoom] = useState<string>(``);
    const [filteredUser, setFilteredUser] = useState<{
        name: string;
        color: string;
    } | null>(null);

    useEffect(() => {
        const storedUser = sessionStorage.getItem('user');
        const storedRoom = sessionStorage.getItem('room');

        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setUsername(parsedUser.name);
            setUserColor(parsedUser.color);
        }

        if (storedRoom) {
            setRoom(storedRoom);
        }

        setLoading(false);
    }, []);

    useEffect(() => {
        const users: { name: string; color: string }[] = [];

        cards.map((card) => {
            if (
                users.find((user) => {
                    return user.name === card.user.name;
                })
            )
                return;
            users.push(card.user);
        });
        setUsers(users);
    }, [cards]);

    useEffect(() => {
        if (room === '') return;

        const socket = new SocketService('http://localhost:3000', room);

        setSocket(socket);

        socket.onRoomJoin((message: string) => {
            console.log(message);
        });

        socket.onCardInitialized((initialCards: Card[]) => {
            console.log(` - Cards initialized in room:`, initialCards);
            setCards(initialCards);

            initialCards.forEach((card) => {
                setUser((prevUser) => {
                    if (prevUser && prevUser.name === card.user.name) {
                        return {
                            ...prevUser,
                            color: card.user.color,
                            hidden: card.user.hidden,
                        };
                    }
                    return prevUser;
                });
            });
        });

        socket.onRoomLeave((message: string) => {
            console.log(message);
        });

        socket.onCardAdd((newCard: Card) => {
            console.log(` - New card added in room:`, newCard);
            setCards((prevCards) => [...prevCards, newCard]);
        });

        socket.onCardUpdate((cardId, updatedCard: Card) => {
            console.log(` - Card updated in room:`, cardId, updatedCard);
            setCards((prevCards) =>
                prevCards.map((card) => {
                    if (card.id === cardId) {
                        return { ...card, ...updatedCard };
                    }
                    return card;
                })
            );
        });

        socket.onCardRemove((cardId: string) => {
            console.log(` - Card removed from room:`, cardId);
            setCards((prevCards) => prevCards.filter((card) => card.id !== cardId));
        });

        socket.onUserUpdate((updatedUser: User) => {
            console.log(` - User updated:`, updatedUser);
            setCards((prevCards) =>
                prevCards.map((card) => {
                    if (card.user.name === updatedUser.name) {
                        return { ...card, user: updatedUser };
                    }
                    return card;
                })
            );
        });

        return () => {
            socket.disconnect();
        };
    }, [user && room]);

    const userScreen = (
        <form
            className="grid place-content-center h-screen"
            onSubmit={(e) => {
                e.preventDefault();
                if (!userColor || !username || !room)
                    return setError(
                        `${
                            !userColor && !username && !room
                                ? 'Username, cor e nome da sala'
                                : !room && !username
                                ? 'Nome da sala e Username'
                                : !room && !userColor
                                ? 'Nome da sala e cor'
                                : !userColor && !username
                                ? 'Username e cor'
                                : !userColor
                                ? 'Cor'
                                : !username
                                ? 'Username'
                                : !room
                                ? 'Nome da sala'
                                : 'Cor'
                        } faltando!`
                    );
                setUser({ name: username, color: userColor, hidden: false });
                sessionStorage.setItem(
                    'user',
                    JSON.stringify({ name: username, color: userColor, hidden: false })
                );
                sessionStorage.setItem('room', room);
            }}>
            <h2 className="mt-20">Sala</h2>
            <input
                onChange={(e) => {
                    setRoom(e.target.value);
                }}
                className={`h-10 border-neutral-700 border-b p-2 focus-visible:outline-0 focus-visible:border-white transition-all focus-visible:border-b-2`}
                type="text"
            />
            <h2 className="mt-20">Qual é seu nome?</h2>
            <input
                onChange={(e) => {
                    setUsername(e.target.value);
                }}
                className={`h-10 border-neutral-700 border-b p-2 focus-visible:outline-0 focus-visible:border-white transition-all focus-visible:border-b-2`}
                type="text"
            />
            <div className="space-y-4 mt-10">
                <h2>Qual cor?</h2>
                <div className="grid grid-cols-5 justify-around gap-5">
                    {COLORS.map((color) => (
                        <div
                            onClick={() => setUserColor(color)}
                            key={color}
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

    function handleHide(): void {
        if (socket && user) {
            setUser({ ...user, hidden: !user.hidden });
            socket.updateUser({ ...user, hidden: !user.hidden });
        }
    }

    function handleExport(event: MouseEvent<HTMLButtonElement, MouseEvent>): void {
        throw new Error('Function not implemented.');
        // to do : export cards to a csv file or directly to a google sheet
    }

    function handleSettings(event: MouseEvent<HTMLButtonElement, MouseEvent>): void {
        throw new Error('Function not implemented.');
        // to do : modal to allow to change column title and colors
    }

    return (
        <>
            <span className="bg-red-500 bg-orange-500 bg-amber-500 bg-yellow-500 bg-lime-500 bg-green-500 bg-emerald-500 bg-teal-500 bg-cyan-500 bg-sky-500 bg-blue-500 bg-indigo-500 bg-violet-500 bg-purple-500 bg-fuchsia-500 bg-pink-500 bg-rose-500"></span>
            <span className="text-red-400 text-orange-400 text-amber-400 text-yellow-400 text-lime-400 text-green-400 text-emerald-400 text-teal-400 text-cyan-400 text-sky-400 text-blue-400 text-indigo-400 text-violet-400 text-purple-400 text-fuchsia-400 text-pink-400 text-rose-400"></span>
            {loading ? (
                <div className="grid place-content-center h-screen overflow-hidden">
                    <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-sky-500"></div>
                </div>
            ) : user ? (
                <div className="w-full text-neutral-50">
                    <div
                        className={`px-2 grid grid-cols-3 items-center justify-items-center py-1.5 bg-slate-500/5`}>
                        <div className="flex gap-4 items-center w-full">
                            <button
                                onClick={() => {
                                    if (socket) {
                                        socket.leaveRoom();
                                        sessionStorage.removeItem('user');
                                        sessionStorage.removeItem('room');
                                        setUser(null);
                                        setCards([]);
                                        setUsers([]);
                                    }
                                }}
                                className={`px-2 h-10 w-10 hover:w-22 grid grid-cols-2 group items-center transition-all bg-slate-700/25 cursor-pointer rounded-full hover:bg-red-500/25`}>
                                <IoExitOutline
                                    size={24}
                                    className="text-2xl transition-none"></IoExitOutline>
                                <span className="group-hover:block w-0.5 hidden text-slate-300 font-semibold">
                                    Sair
                                </span>
                            </button>
                            <span className="text-slate-300 font-semibold">{room}</span>
                        </div>
                        <h2>
                            <span className={`text-${user.color}-400 font-semibold`}>
                                {user.name}
                            </span>
                        </h2>
                        <div className="flex w-full gap-2 justify-end">
                            <button
                                onClick={handleSettings}
                                className={`px-2 h-10 w-10 hover:w-42 flex gap-2 justify-end group items-center transition-all bg-slate-700/25 cursor-pointer rounded-full hover:bg-amber-500/25`}>
                                <span className="group-hover:block group-hover:w-full w-0 hidden text-slate-300 font-semibold overflow-hidden">
                                    Configurações
                                </span>
                                <p>
                                    <FaGear size={24} className="text-white text-2xl" />
                                </p>
                            </button>
                            <button
                                onClick={handleExport}
                                className={`px-2 h-10 w-10 hover:w-30 flex gap-2 justify-end group items-center transition-all bg-slate-700/25 cursor-pointer rounded-full hover:bg-emerald-500/25`}>
                                <span className="group-hover:block group-hover:w-full w-0 hidden text-slate-300 font-semibold overflow-hidden">
                                    Exportar
                                </span>
                                <p>
                                    <PiExport size={24} className="text-white text-2xl" />
                                </p>
                            </button>
                            <button
                                onClick={handleHide}
                                className={`px-2 h-10 w-10 hover:w-32 flex gap-2 justify-end group items-center transition-all bg-slate-700/25 cursor-pointer rounded-full hover:bg-sky-500/25`}>
                                <span className="group-hover:block group-hover:w-full w-0 hidden text-slate-300 font-semibold overflow-hidden">
                                    {user.hidden ? 'Mostrar' : 'Esconder'}
                                </span>
                                <p>
                                    {!user.hidden ? (
                                        <FaEyeSlash
                                            size={24}
                                            className="text-white text-2xl"
                                        />
                                    ) : (
                                        <FaEye size={24} className="text-white text-xl" />
                                    )}
                                </p>
                            </button>
                        </div>
                    </div>
                    <div className="h-20 flex items-center justify-between px-10">
                        <UsersFilter
                            cards={cards}
                            setCards={setCards}
                            users={users}
                            filteredUser={filteredUser}
                            setFilteredUser={setFilteredUser}></UsersFilter>
                    </div>
                    <Board
                        cards={cards}
                        setCards={setCards}
                        user={user}
                        socket={socket}
                        filteredUser={filteredUser}
                    />
                </div>
            ) : (
                userScreen
            )}
        </>
    );
};

const Board = ({ cards, setCards, user, socket, filteredUser }: any) => {
    return (
        <div className="grid grid-cols-4 w-full gap-3 px-12 overflow-hidden">
            <Column
                title="Bom e devemos Continuar"
                column="good"
                headingColor="text-emerald-300"
                cards={cards}
                setCards={setCards}
                user={user}
                socket={socket}
                filteredUser={filteredUser}
            />
            <Column
                title="Podemos melhorar"
                column="improve"
                headingColor="text-yellow-200"
                cards={cards}
                setCards={setCards}
                user={user}
                socket={socket}
                filteredUser={filteredUser}
            />
            <Column
                title="Devemos parar"
                column="stop"
                headingColor="text-red-300"
                cards={cards}
                setCards={setCards}
                user={user}
                socket={socket}
                filteredUser={filteredUser}
            />
            <Column
                title="Devemos iniciar"
                column="start"
                headingColor="text-teal-200"
                cards={cards}
                setCards={setCards}
                user={user}
                socket={socket}
                filteredUser={filteredUser}
            />
            <BurnBarrel user={user} socket={socket} />
        </div>
    );
};

const Column = ({
    title,
    headingColor,
    cards,
    column,
    setCards,
    user,
    socket,
    filteredUser,
}) => {
    const [active, setActive] = useState(false);

    const handleDragStart = (e, card) => {
        console.log(`Dragging card:`, card);
        e.dataTransfer.setData('cardId', card.id);
        e.dataTransfer.setData('cardOwner', card.user.name);
    };

    const handleDragEnd = (e) => {
        const cardId = e.dataTransfer.getData('cardId');
        const cardOwner = e.dataTransfer.getData('cardOwner');

        setActive(false);
        clearHighlights();

        const indicators = getIndicators();
        const { element } = getNearestIndicator(e, indicators);

        if (cardOwner !== user.name) return;

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

    const finalCards = filteredCards.filter((c) => {
        if (!filteredUser) return true;
        return c.user.name === filteredUser.name;
    });

    return (
        <div className="w-full shrink-0 h-full">
            <div className="mb-3 flex items-center justify-between">
                <h3 className={`font-medium ${headingColor}`}>{title}</h3>
                <span className="rounded text-sm text-neutral-400">
                    {filteredCards.length}
                </span>
            </div>
            <AddCard column={column} user={user} socket={socket} />
            <div
                onDrop={handleDragEnd}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`h-full max-h-[80vh] w-full overflow-y-auto overflow-x-hidden transition-colors ${
                    active ? 'bg-neutral-800/50' : 'bg-neutral-800/0'
                }`}>
                {finalCards.map((c) => {
                    return (
                        <Card
                            key={c.id}
                            {...c}
                            socket={socket}
                            handleDragStart={handleDragStart}
                        />
                    );
                })}
                <DropIndicator beforeId={null} column={column} />
            </div>
        </div>
    );
};

const Card = ({ title, id, column, handleDragStart, user, socket }) => {
    return (
        <>
            <DropIndicator beforeId={id} column={column} />
            <motion.div
                layout
                layoutId={id}
                draggable="true"
                onDragStart={(e) => handleDragStart(e, { title, id, column, user })}
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

const DropIndicator = ({ beforeId, column }) => {
    return (
        <div
            data-before={beforeId || '-1'}
            data-column={column}
            className="my-0.5 h-0.5 w-full bg-violet-400 opacity-0"
        />
    );
};

const BurnBarrel = ({ user, socket }) => {
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

        if (socket) {
            console.log(`Removing card with ID: ${cardId}`);
            socket.removeCard(cardId);
        }

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

const AddCard = ({ column, user, socket }) => {
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
