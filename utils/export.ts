import type { Card } from "types";

export function exportCardsToCSV(cards: Card[], room: string) {
    const content = `Column\tTitle\tUser\n` +
        cards.map((card) => `${card.column}\t${card.title}\t${card.user.name}`).join('\n');

    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${room}_export.txt`);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}