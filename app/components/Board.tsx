import { columns } from "~/columns/columns";
import { BurnBarrel } from "./BurnBarrel";
import { Column } from "./Column";

export const Board = ({ cards, loggedUser, socket, filteredUser }: any) => {
	return (
		<div className={`flex w-full gap-3 px-12 flex-1 overflow-hidden`}>
			{columns.map((col) => (
				<Column
					index={col.index}
					key={col.column}
					title={col.name}
					column={col.column}
					headingColor={col.color}
					cards={cards}
					socket={socket}
					filteredUser={filteredUser}
				/>
			))}
			<BurnBarrel user={loggedUser} socket={socket} />
		</div>
	);
};
