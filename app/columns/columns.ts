export interface Column {
    name: string;
    column: string;
    color: string;
}

export const columns = [
    { name: "Devemos continuar", column: 'continue', color: "emerald", index: 1 },
    { name: "Devemos Parar", column: 'stop', color: "amber", index: 2 },
    { name: "Podemos melhorar", column: 'improve', color: "red", index: 3 },
    { name: "Devemos Iniciar", column: 'start', color: "sky", index: 4 },
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
