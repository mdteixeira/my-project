import type { User } from "types";
import { renderColorPicker } from "utils/renderColorPicker";

export function renderUserForm(userColor: string, username: string, room: string, setError: React.Dispatch<React.SetStateAction<string>>, setUser: React.Dispatch<React.SetStateAction<User | null>>, setRoom: React.Dispatch<React.SetStateAction<string>>, setUsername: React.Dispatch<React.SetStateAction<string>>, setUserColor: React.Dispatch<React.SetStateAction<string>>, error: string) {
    return <form
        className="grid place-content-center h-screen"
        onSubmit={(e) => {
            e.preventDefault();
            if (!userColor || !username || !room) return setError(generateMissingFieldsMessage(userColor, username, room));

            setUser({ name: username, color: userColor, hidden: false });
            sessionStorage.setItem('user', JSON.stringify({ name: username, color: userColor, hidden: false }));
            sessionStorage.setItem('room', room);
        } }>
        <h2 className="mt-20">Sala</h2>
        <input
            onChange={(e) => {
                setRoom(e.target.value);
            } }
            className={`h-10 border-neutral-700 border-b p-2 focus-visible:outline-0 focus-visible:border-white transition-all focus-visible:border-b-2`}
            type="text" />
        <h2 className="mt-20">Qual é seu nome?</h2>
        <input
            onChange={(e) => {
                setUsername(e.target.value);
            } }
            className={`h-10 border-neutral-700 border-b p-2 focus-visible:outline-0 focus-visible:border-white transition-all focus-visible:border-b-2`}
            type="text" />
        <div className="space-y-4 mt-10">
            <h2>Qual cor?</h2>
            {renderColorPicker(setUserColor, userColor)}
            <button className="bg-white font-semibold hover:brightness-75 cursor-pointer mt-3 text-black p-2 rounded-xl px-4">
                Prosseguir
            </button>
            {<span className="text-red-500 ml-4">{error}</span>}
        </div>
    </form>;
}

function generateMissingFieldsMessage(userColor: string, username: string, room: string): string {

    const missingFields: string[] = [];

    if (!userColor) missingFields.push('cor');
    if (!username) missingFields.push('Username');
    if (!room) missingFields.push('nome da sala');

    if (missingFields.length === 0) return '';
    if (missingFields.length === 1) return `${missingFields[0]} faltando!`;
    if (missingFields.length === 2) return `${missingFields[0]} e ${missingFields[1]} faltando!`;
    return `Todos os campos faltando: ${missingFields.join(', ')}!`;
}
