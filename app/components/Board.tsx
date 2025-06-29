import { BurnBarrel } from "./BurnBarrel";
import { Column } from "./Column";

export const Board = ({ cards, setCards, user, socket, filteredUser }: any) => {
    return (
        <div className="grid grid-cols-4 w-full gap-3 px-12 overflow-hidden">
            <Column
                title="Bom e devemos Continuar"
                column="good"
                headingColor="text-emerald-300"
                cards={cards}
                user={user}
                socket={socket}
                filteredUser={filteredUser}
            />
            <Column
                title="Podemos melhorar"
                column="improve"
                headingColor="text-yellow-200"
                cards={cards}
                user={user}
                socket={socket}
                filteredUser={filteredUser}
            />
            <Column
                title="Devemos parar"
                column="stop"
                headingColor="text-red-300"
                cards={cards}
                user={user}
                socket={socket}
                filteredUser={filteredUser}
            />
            <Column
                title="Devemos iniciar"
                column="start"
                headingColor="text-teal-200"
                cards={cards}
                user={user}
                socket={socket}
                filteredUser={filteredUser}
            />
            <BurnBarrel user={user} socket={socket} />
        </div>
    );
};