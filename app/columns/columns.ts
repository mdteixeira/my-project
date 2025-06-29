export interface Column {
    name: string;
    column: string;
    color: string;
}

export const columns = [
    { name: "Bom e devemos Continuar", column: 'good', color: "text-emerald-300" },
    { name: "Podemos melhorar", column: 'improve', color: "text-amber-200" },
    { name: "Devemos parar", column: 'stop', color: "text-red-400" },
    { name: "Devemos iniciar", column: 'start', color: "text-sky-200" },
];

export const updateColumn = (columnName: string, newColumn: Column) => {
    const columnToUpdate = columns.find(column => column.column === columnName);

    if (columnToUpdate) {
        columnToUpdate.name = newColumn.name;
        columnToUpdate.color = newColumn.color;
        columnToUpdate.column = newColumn.column;
        console.log(`Column ${columnName} updated to:`, columnToUpdate);
    } else {
        console.error(`Column with name ${columnName} not found.`);
    }
}
