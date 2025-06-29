import { useState } from 'react';
import { BiCaretLeft } from 'react-icons/bi';
import { BsArrowLeft } from 'react-icons/bs';
import { CgArrowLeft } from 'react-icons/cg';
import { FaAngleLeft, FaCaretLeft, FaTrash } from 'react-icons/fa';
import { FaPencil, FaXmark } from 'react-icons/fa6';
import { renderColorPicker } from 'utils/renderColorPicker';
import { columns, type Column } from '~/columns/columns';

const SettingsModal = (props) => {
    const [editingColumn, setEditingColumn] = useState<Column | null>(null);
    const [newColumnId, setNewColumnId] = useState('');
    const [newColumnName, setNewColumnName] = useState('');
    const [newColumnColor, setNewColumnColor] = useState('');

    function editColumn(column: Column): void {
        setEditingColumn(column);
        setNewColumnColor(column.color.split('-')[1] || '');
        setNewColumnId(column.column);
        setNewColumnName(column.name);
    }

    function deleteColumn(column: string): void {
        throw new Error('Function not implemented.');
    }

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="relative bg-neutral-900 p-6 rounded-4xl shadow-lg grid gap-6">
                <button
                    onClick={props.handleSettings}
                    className="absolute items-center justify-center grid text-red-500 z-3 bg-red-700/30 hover:bg-red-700/45 hover:text-red-600 rounded-full w-12 h-12 cursor-pointer top-2 right-2">
                    <FaXmark size={24} />
                </button>
                <h2 className="text-xl font-semibold mb-4">Configurações</h2>

                {editingColumn ? (
                    <>
                        <button
                            className="cursor-pointer flex gap-2 items-center w-24 p-2 bg-neutral-600/25 rounded-full hover:bg-neutral-600/50 transition-colors text-white"
                            onClick={() => setEditingColumn(null)}>
                            <FaAngleLeft size={16} className="ml-0.5" />
                            Voltar
                        </button>
                        <h3 className="text-lg mb-2">Editar Coluna</h3>
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
                                    className="p-2 rounded bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex-col flex gap-1">
                                <small className="text-xs">Nome</small>
                                <input
                                    type="text"
                                    value={editingColumn.name}
                                    onChange={(e) => setNewColumnName(e.target.value)}
                                    placeholder="ID da coluna"
                                    className="p-2 rounded bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <small className="text-xs">Cor</small>
                                {newColumnColor}
                                {renderColorPicker(setNewColumnColor, newColumnColor)}
                                <button
                                    type="submit"
                                    className="px-4 mt-6 py-2 bg-neutral-700/50 text-white rounded-full hover:bg-neutral-500/10 cursor-pointer">
                                    Salvar
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="space-y-4">
                        <h3 className="text-lg">Colunas</h3>
                        <div className="grid gap-2 w-96">
                            {columns.map((col) => (
                                <div
                                    key={col.column}
                                    className="flex items-center ps-4 justify-between bg-neutral-800/50 p-1 rounded-3xl">
                                    <span className="text-white">{col.name}</span>
                                    <div className="flex itens-center">
                                        <button
                                            onClick={() => editColumn(col)}
                                            className="text-neutral-500 cursor-pointer transition-all rounded-s-full bg-neutral-600/20 hover:bg-neutral-600/30 p-1 px-2 hover:text-neutral-200">
                                            <FaPencil className="m-2" />
                                        </button>
                                        <button
                                            onClick={() => deleteColumn(col.column)}
                                            className="text-red-500 cursor-pointer transition-all rounded-e-full bg-red-600/20 hover:bg-red-600/30 p-1 px-2 hover:text-red-400">
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
                    className="px-4 py-2 bg-red-600 cursor-pointer text-white rounded-full hover:bg-red-800">
                    Fechar
                </button>
            </div>
        </div>
    );
};

export default SettingsModal;
