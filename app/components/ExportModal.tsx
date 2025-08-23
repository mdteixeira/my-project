import { BiChevronRight } from 'react-icons/bi';
import { FaXmark } from 'react-icons/fa6';
import { exportCardsToCSV } from 'utils/export';

const ExportModal = (props) => {
    const room = sessionStorage.getItem('room') || '';

    function handleExport(type: string) {
        return (e) => {
            e.preventDefault();
            console.log(props, 'props');
            if (type === 'csv') {
                exportCardsToCSV(props.cards, room);
            } else if (type === 'image') {
                window.print();
            }
        };
    }

    const csv = 'csv';
    const image = 'image';

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            props.handleExport();
        }
    });

    return (
        <div className="fixed inset-0 dark:bg-black/50 bg-black/10 z-50 flex items-center justify-center print:hidden">
            <div className="relative dark:bg-neutral-900 bg-white p-6 rounded-4xl shadow-lg grid gap-2">
                <button
                    onClick={props.handleExport}
                    className="absolute items-center justify-center grid text-red-500 z-3 dark:bg-red-700/30 bg-red-200 dark:hover:bg-red-700/45 hover:bg-red-300/50 dark:hover:text-red-600 rounded-full w-12 h-12 cursor-pointer top-2 right-2">
                    <FaXmark size={24} />
                </button>
                <h2 className="text-xl font-semibold mb-4">Exportar</h2>
                <button
                    onClick={handleExport(csv)}
                    className="dark:text-white cursor-pointer flex justify-between items-center transition-all rounded-full bg-neutral-100 hover:bg-neutral-200/70 dark:bg-neutral-600/20 dark:hover:bg-neutral-600/30 p-2 pl-4 px-2 dark:hover:text-neutral-200 w-96">
                    CSV com tabulações <BiChevronRight className="m-2" />
                </button>
                <button
                    onClick={handleExport(image)}
                    className="dark:text-white cursor-pointer flex justify-between items-center transition-all rounded-full bg-neutral-100 hover:bg-neutral-200/70 dark:bg-neutral-600/20 dark:hover:bg-neutral-600/30 p-2 pl-4 px-2 dark:hover:text-neutral-200 w-96">
                    Imagem <BiChevronRight className="m-2" />
                </button>
                <button
                    onClick={props.handleExport}
                    className="px-4 mt-10 py-2 dark:bg-red-700 bg-red-400 cursor-pointer text-white rounded-full dark:hover:bg-red-800 hover:bg-red-500/90">
                    Fechar
                </button>
            </div>
        </div>
    );
};

export default ExportModal;
