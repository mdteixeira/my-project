import { useEffect, useState } from 'react';
import { BsStarFill } from 'react-icons/bs';
import { FaAngleLeft, FaTrash } from 'react-icons/fa';
import { FaPencil, FaXmark } from 'react-icons/fa6';
import type { User } from 'types';
import { renderColorPicker } from 'utils/renderColorPicker';
import { type Column, columns } from '~/columns/columns';

const SettingsModal = (props) => {
    const [editingColumn, setEditingColumn] = useState<Column | null>(null);
    const [newColumnId, setNewColumnId] = useState('');
    const [newColumnName, setNewColumnName] = useState('');
    const [newColumnColor, setNewColumnColor] = useState('');

    const storedUser = sessionStorage.getItem('user');
    const loggedUser: User = storedUser ? JSON.parse(storedUser) : null;

    const [superUser, setSuperUserState] = useState(loggedUser?.superUser || false);

    const setSuperUser = () => {
        if (loggedUser) {
            setSuperUserState(!superUser);
            loggedUser.superUser = !loggedUser.superUser;
            sessionStorage.setItem('user', JSON.stringify(loggedUser));
        }
    };

    useEffect(() => {
        setSuperUserState(loggedUser?.superUser || false);
    }, []);

    function editColumn(column: Column): void {
        setEditingColumn(column);
        setNewColumnColor(column.color.split('-')[1] || '');
        setNewColumnId(column.column);
        setNewColumnName(column.name);
    }

    function deleteColumn(column: string): void {
        throw new Error('Function not implemented.');
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            props.handleSettings();
        }
    });

    return (
        <div className="fixed inset-0 dark:bg-black/50 bg-black/10 z-50 flex items-center justify-center">
            <div className="relative dark:bg-neutral-900 bg-white p-6 rounded-4xl shadow-lg grid gap-6">
                <button
                    onClick={props.handleSettings}
                    className="absolute items-center justify-center grid text-red-500 z-3 dark:bg-red-700/30 bg-red-200 dark:hover:bg-red-700/45 hover:bg-red-300/50 dark:hover:text-red-600 rounded-full w-12 h-12 cursor-pointer top-2 right-2">
                    <FaXmark size={24} />
                </button>
                <h2 className="text-xl font-semibold mb-4">Configurações</h2>

                {editingColumn ? (
                    <>
                        <button
                            className="cursor-pointer flex gap-2 items-center w-24 p-2 bg-neutral-600/25 rounded-full hover:bg-neutral-600/50 transition-colors dark:text-white"
                            onClick={() => setEditingColumn(null)}>
                            <FaAngleLeft size={16} className="ml-0.5" />
                            Voltar
                        </button>
                        <h3 className="text-lg mb-2 w-92">Editar Coluna</h3>
                        <form
                            onKeyDown={(e) => {
                                if (e.key === 'Escape') {
                                    setEditingColumn(null);
                                    setNewColumnId('');
                                    setNewColumnName('');
                                    setNewColumnColor('');
                                }
                            }}
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (!newColumnName || !newColumnColor) return;
                                props.handleEditColumn(
                                    editingColumn,
                                    newColumnName,
                                    newColumnColor
                                );
                                setEditingColumn(null);
                                setNewColumnId('');
                                setNewColumnName('');
                                setNewColumnColor('');
                            }}
                            className="flex flex-col space-y-2 gap-4">
                            <div className="flex-col flex gap-1">
                                <small className="text-xs">Id</small>
                                <input
                                    type="text"
                                    autoFocus
                                    value={editingColumn.column}
                                    onChange={(e) => setNewColumnName(e.target.value)}
                                    placeholder="Nome da coluna"
                                    className="p-2 rounded bg-neutral-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex-col flex gap-1">
                                <small className="text-xs">Nome</small>
                                <input
                                    type="text"
                                    value={editingColumn.name}
                                    onChange={(e) => setNewColumnName(e.target.value)}
                                    placeholder="ID da coluna"
                                    className="p-2 rounded bg-neutral-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <small className="text-xs mb-2 font-semibold">Cor - {newColumnColor}</small>
                                {renderColorPicker(setNewColumnColor, newColumnColor)}
                                <button
                                    type="submit"
                                    className="px-4 mt-6 py-2 dark:bg-neutral-700/50 dark:text-white rounded-full dark:hover:bg-neutral-500/10 cursor-pointer">
                                    Salvar
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 *:cursor-pointer">
                            <input
                                type="checkbox"
                                checked={superUser}
                                onChange={setSuperUser}
                                className="cursor-pointer"
                                id="superUserToggle"
                                name="superUserToggle"
                                hidden
                            />
                            <label
                                htmlFor="superUserToggle"
                                className="dark:text-white w-full">
                                <div className="flex items-center ps-4 justify-between dark:bg-neutral-800/50 p-1 rounded-3xl">
                                    <span className="dark:text-white">Super usuário</span>
                                    <div className="flex itens-center">
                                        <button
                                            className={`cursor-pointer transition-all rounded-full
                                        ${
                                            superUser
                                                ? `text-amber-500 dark:bg-amber-600/20 dark:hover:bg-amber-600/30 p-1 hover:text-amber-400`
                                                : `text-neutral-500 dark:bg-neutral-600/20 dark:hover:bg-neutral-600/30 p-1 hover:text-neutral-400`
                                        }
                                    `}>
                                            <BsStarFill className="m-2" />
                                        </button>
                                    </div>
                                </div>
                            </label>
                        </div>
                        <h3 className="text-lg">Colunas</h3>
                        <div className="grid gap-2 w-96">
                            {columns.map((col) => (
                                <div
                                    key={col.column}
                                    className="flex items-center ps-4 justify-between dark:bg-neutral-800/50 p-1 rounded-3xl">
                                    <span className="dark:text-white">{col.name}</span>
                                    <div className="flex itens-center">
                                        <button
                                            onClick={() => editColumn(col)}
                                            className="text-neutral-500 cursor-pointer transition-all rounded-s-full dark:bg-neutral-600/20 dark:hover:bg-neutral-600/30 p-1 px-2 hover:text-neutral-200">
                                            <FaPencil className="m-2" />
                                        </button>
                                        <button
                                            onClick={() => deleteColumn(col.column)}
                                            className="text-red-500 cursor-pointer transition-all rounded-e-full dark:bg-red-600/20 dark:hover:bg-red-600/30 p-1 px-2 hover:text-red-400">
                                            <FaTrash className="m-2" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <button
                    onClick={props.handleSettings}
                    className="px-4 py-2 dark:bg-red-700 bg-red-400 cursor-pointer text-white rounded-full dark:hover:bg-red-800 hover:bg-red-500/90">
                    Fechar
                </button>
            </div>
        </div>
    );
};

export default SettingsModal;
