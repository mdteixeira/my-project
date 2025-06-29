import { columns } from "~/columns/columns";
import { BurnBarrel } from "./BurnBarrel";
import { Column } from "./Column";

export const Board = ({ cards, user, socket, filteredUser }: any) => {
    return (
        <div className={`grid grid-cols-${columns.length} w-full gap-3 px-12 overflow-hidden`}>
            {columns.map((col) => (
                <Column
                    key={col.column}
                    title={col.name}
                    column={col.column}
                    headingColor={col.color}
                    cards={cards}
                    user={user}
                    socket={socket}
                    filteredUser={filteredUser}
                />
            ))}
            <BurnBarrel user={user} socket={socket} />
        </div>
    );
};