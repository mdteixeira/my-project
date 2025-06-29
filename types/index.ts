export interface Card {
    column: string;
    title: string;
    id: string;
    user: { name: string; color: string };
}

export interface CardUser { name: string, color: string }

export interface User { name: string; color: string, hidden: boolean; }