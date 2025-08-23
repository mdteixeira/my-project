import type React from 'react';
import { useEffect, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FaGear } from 'react-icons/fa6';
import { IoExitOutline } from 'react-icons/io5';
import { PiExport } from 'react-icons/pi';
import type { Card, CardUser, User } from 'types';
import { getInitials } from '../utils/getInitials';
import SocketService from '../utils/Socket';
import { type Column, updateColumn } from './columns/columns';
import { Board } from './components/Board';
import ExportModal from './components/ExportModal';
import SettingsModal from './components/settingsModal';
import { renderUserForm } from './screens/UserScreen';
import { BiStar } from 'react-icons/bi';
import { BsStarFill } from 'react-icons/bs';

function UserIcon(props: {
    filteredUser: CardUser | null;
    setFilteredUser: React.Dispatch<
        React.SetStateAction<{
            name: string;
            color: string;
        } | null>
    >;
    user: { name: string; color: string };
}) {
    return (
        <div className="group">
            <div
                className={
                    props.filteredUser?.name === props.user.name
                        ? `text-white ring-2 dark:ring-neutral-200 ring-neutral-500 ring-offset-white dark:ring-offset-slate-800 bg-${props.user.color}-500 h-12 w-12 rounded-full grid place-items-center cursor-pointer hover:ring-offset-1`
                        : `text-white bg-${props.user.color}-500 hover:ring-2 ring-offset-1 ring-neutral-500 ring-offset-white dark:ring-offset-slate-800 hover:ring-neutral-300 dark:hover:ring-white/50 h-12 w-12 rounded-full grid place-items-center cursor-pointer`
                }
                onClick={() => {
                    if (props.filteredUser?.name === props.user.name)
                        return props.setFilteredUser(null);

                    props.setFilteredUser(props.user);
                }}>
                <p>{getInitials(props.user.name)}</p>
                <small className="absolute mt-24 px-4 py-1.5 rounded-xl group-hover:grid hidden dark:bg-neutral-800 border bg-neutral-100 text-neutral-700 border-neutral-300 dark:text-white dark:border-neutral-700">
                    {props.user.name}
                </small>
            </div>
        </div>
    );
}

function UsersFilter(props: {
    users: CardUser[];
    filteredUser: CardUser | null;
    setFilteredUser: React.Dispatch<React.SetStateAction<CardUser | null>>;
}) {
    return (
        <div className="flex space-x-3">
            {props.users.map((user: CardUser) => {
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

export const App = () => {
    const [cards, setCards] = useState<Card[]>([]);
    const [users, setUsers] = useState<CardUser[]>([]);
    const [loggedUser, setLoggedUser] = useState<User | null>(null);
    const [userColor, setUserColor] = useState<string>('');
    const [socket, setSocket] = useState<SocketService | null>(null);

    const [error, setError] = useState<string>('');

    const [loading, setLoading] = useState<boolean>(true);

    const [username, setUsername] = useState<string>(``);
    const [room, setRoom] = useState<string>(``);
    const [filteredUser, setFilteredUser] = useState<CardUser | null>(null);

    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
    const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

    useEffect(() => {
        const storedUser = sessionStorage.getItem('user');
        const storedRoom = sessionStorage.getItem('room');

        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setLoggedUser(parsedUser);
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
        if (!room) return;
        console.log('trying to connect to room:', room);
        console.log('User:', loggedUser);
        if (!loggedUser) {
            console.error('User is not defined. Cannot connect to room.');
            return;
        }

        const socket = new SocketService('http://localhost:1298', room);

        setSocket(socket);

        socket.onRoomJoin((message: string) => {
            console.log(message);
        });

        socket.onCardInitialized((initialCards: Card[]) => {
            console.log(` - Cards initialized in room:`, initialCards);
            setCards(initialCards);

            initialCards.forEach((card) => {
                setLoggedUser((prevUser) => {
                    if (prevUser && prevUser.name === card.user.name) {
                        return {
                            ...prevUser,
                            color: card.user.color,
                            hidden: card.user.hidden,
                            likes: card.likes || [],
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

        socket.onColumnUpdate((columnName: string, newColumn: Column) => {
            console.log(` - Column updated:`, columnName);
            updateColumn(columnName, newColumn);
        });

        return () => {
            socket.disconnect();
        };
    }, [loggedUser && room]);

    function handleHide(): void {
        if (socket && loggedUser) {
            setLoggedUser({ ...loggedUser, hidden: !loggedUser.hidden });
            socket.updateUser({ ...loggedUser, hidden: !loggedUser.hidden });
        }
    }

    function handleExport(event): void {
        setIsExportModalOpen(!isExportModalOpen);
    }

    function handleSettings(event): void {
        setIsSettingsModalOpen(!isSettingsModalOpen);
    }

    return (
        <>
            {isSettingsModalOpen && <SettingsModal handleSettings={handleSettings} />}
            {isExportModalOpen && (
                <ExportModal cards={cards} handleExport={handleExport} />
            )}
            <span className="bg-red-500 bg-orange-500 bg-amber-500 bg-yellow-500 bg-lime-500 bg-green-500 bg-emerald-500 bg-teal-500 bg-cyan-500 bg-sky-500 bg-blue-500 bg-indigo-500 bg-violet-500 bg-purple-500 bg-fuchsia-500 bg-pink-500 bg-rose-500"></span>
            <span className="text-red-400 text-orange-400 text-amber-400 text-yellow-400 text-lime-400 text-green-400 text-emerald-400 text-teal-400 text-cyan-400 text-sky-400 text-blue-400 text-indigo-400 text-violet-400 text-purple-400 text-fuchsia-400 text-pink-400 text-rose-400"></span>
            {loading ? (
                <div className="grid place-content-center h-screen overflow-hidden">
                    <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-sky-500"></div>
                </div>
            ) : loggedUser ? (
                <main className="w-full dark:text-neutral-50 text-neutral-700 min-h-screen flex flex-col">
                    <h2>
                        <span className="dark:text-slate-300 font-semibold hidden print:block w-screen py-2.5 mb-5 text-center">
                            <h2 className="text-2xl">{room}</h2>
                            <small className="mt-4">Users:</small>
                            <div className="flex justify-center gap-10">
                                {users.map((user) => (
                                    <small
                                        className={`text-${user.color}-400 font-semibold`}>
                                        {user.name}
                                    </small>
                                ))}
                            </div>
                            <hr className="border-slate-200 text-center mx-auto mt-2" />
                        </span>
                    </h2>
                    <div
                        className={`px-2 grid grid-cols-3 items-center justify-items-center py-1.5 bg-slate-500/5 sticky print:hidden`}>
                        <div className="flex gap-4 items-center w-full">
                            <button
                                onClick={() => {
                                    if (socket) {
                                        sessionStorage.removeItem('user');
                                        sessionStorage.removeItem('room');
                                        setLoggedUser(null);
                                        setRoom('');
                                        setCards([]);
                                        setUsers([]);
                                        socket.leaveRoom();
                                    }
                                }}
                                className={`px-2 h-10 w-10 hover:w-22 grid grid-cols-2 group items-center transition-all bg-neutral-300/50 dark:bg-slate-700/25 cursor-pointer rounded-full hover:bg-red-500/25`}>
                                <IoExitOutline
                                    size={24}
                                    className="text-2xl transition-none"></IoExitOutline>
                                <span className="group-hover:block w-0.5 hidden dark:text-slate-300 font-semibold">
                                    Sair
                                </span>
                            </button>
                            <span
                                className={`text-${loggedUser.color}-400 font-semibold flex items-center gap-2`}>
                                {loggedUser.name}{' '}
                                {loggedUser?.superUser && (
                                    <button
                                        className={`rounded-full text-amber-500 dark:bg-amber-600/20 bg-amber-200/50`}>
                                        <BsStarFill className="m-2" />
                                    </button>
                                )}
                            </span>
                        </div>
                        <h2>
                            <span className="dark:text-slate-300 font-semibold">
                                {room}
                            </span>
                        </h2>
                        <div className="flex w-full gap-2 justify-end">
                            <button
                                onClick={handleHide}
                                className={
                                    loggedUser.hidden
                                        ? `px-2 h-10 w-32 disabled:text-white hover:w-32 flex gap-2 justify-end group items-center transition-all bg-neutral-300/50 dark:bg-slate-700/25 cursor-pointer rounded-full hover:bg-sky-500/25`
                                        : `px-2 h-10 w-10 disabled:w-32 disabled:text-white hover:w-32 flex gap-2 justify-end group items-center transition-all bg-neutral-300/50 dark:bg-slate-700/25 cursor-pointer rounded-full hover:bg-sky-500/25`
                                }>
                                <span
                                    className={
                                        loggedUser.hidden
                                            ? 'group-hover:block group-hover:w-full w-32 dark:text-slate-300 font-semibold'
                                            : 'group-hover:block group-hover:w-full w-0 hidden dark:text-slate-300 font-semibold overflow-hidden'
                                    }>
                                    {loggedUser.hidden ? 'Mostrar' : 'Esconder'}
                                </span>
                                <p>
                                    {!loggedUser.hidden ? (
                                        <FaEyeSlash
                                            size={24}
                                            className="dark:text-white text-2xl"
                                        />
                                    ) : (
                                        <FaEye
                                            size={24}
                                            className="dark:text-white text-xl"
                                        />
                                    )}
                                </p>
                            </button>
                            <button
                                onClick={handleExport}
                                className={`px-2 h-10 w-10 hover:w-30 flex gap-2 justify-end group items-center transition-all bg-neutral-300/50 dark:bg-slate-700/25 cursor-pointer rounded-full hover:bg-emerald-500/25`}>
                                <span className="group-hover:block group-hover:w-full w-0 hidden dark:text-slate-300 font-semibold overflow-hidden">
                                    Exportar
                                </span>
                                <p>
                                    <PiExport
                                        size={24}
                                        className="dark:text-white text-2xl"
                                    />
                                </p>
                            </button>
                            <button
                                onClick={handleSettings}
                                className={`px-2 h-10 w-10 hover:w-42 flex gap-2 justify-end group items-center transition-all bg-neutral-300/50 dark:bg-slate-700/25 cursor-pointer rounded-full hover:bg-amber-500/25`}>
                                <span className="group-hover:block group-hover:w-full w-0 hidden dark:text-slate-300 font-semibold overflow-hidden">
                                    Configurações
                                </span>
                                <p>
                                    <FaGear
                                        size={24}
                                        className="dark:text-white text-2xl"
                                    />
                                </p>
                            </button>
                        </div>
                    </div>
                    <div
                        id={'UsersFilter'}
                        className="print:hidden h-20 flex items-center justify-between px-10">
                        <UsersFilter
                            users={users}
                            filteredUser={filteredUser}
                            setFilteredUser={setFilteredUser}></UsersFilter>
                    </div>
                    <Board
                        cards={cards}
                        loggedUser={loggedUser}
                        socket={socket}
                        filteredUser={filteredUser}
                    />
                </main>
            ) : (
                renderUserForm(
                    userColor,
                    username,
                    room,
                    setError,
                    setLoggedUser,
                    setRoom,
                    setUsername,
                    setUserColor,
                    error
                )
            )}
        </>
    );
};

export const DropIndicator = ({ beforeId, column, headingColor }) => {
    return (
        <div
            data-before={beforeId || '-1'}
            data-column={column}
            className={`my-0.5 h-0.5 w-full bg-${headingColor}-500 opacity-0`}
        />
    );
};
