import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import type { Card, User } from "types";

export const AddCard = ({ column, socket, index }) => {
	const [text, setText] = useState("");
	const [adding, setAdding] = useState(false);

	const storedUser = sessionStorage.getItem("user");
	const loggedUser: User = storedUser ? JSON.parse(storedUser) : null;

	useEffect(() => {
		const listenToShortcut = (e) => {
			if (e.ctrlKey) {
				const pressedNumber = parseInt(e.key).toString();
				if (pressedNumber === index.toString()) {
					setText("");
					setAdding(true);
				} else if (pressedNumber !== "NaN") {
					setAdding(false);
					setText("");
				}
			}
			if (e.key === "Escape") {
				setAdding(false);
				setText("");
			}
		};
		document.addEventListener("keydown", listenToShortcut);
	}, []);

	const handleSubmit = (e) => {
		console.log("Adding new card:", text, column, loggedUser);
		e.preventDefault();

		if (!text.trim().length) return;

		const newCard: Card = {
			column,
			title: text.trim(),
			id: Math.random().toString(),
			user: loggedUser,
			likes: [],
		};

		if (socket) socket.addCard(newCard);
		setText("");
		setAdding(false);
	};

	return (
		<>
			{adding ? (
				<motion.form layout onSubmit={handleSubmit}>
					<input
						onChange={(e) => setText(e.target.value)}
						autoFocus
						placeholder="Adicionar Card..."
						className="w-full rounded-xl border border-violet-400 bg-violet-400/20 p-3 text-sm dark:text-neutral-50 placeholder-violet-300 focus:outline-0 focus:border-violet-400 focus:ring-1 focus:ring-violet-400 transition-colors"
						value={text}
						type="text"
					/>
					<div className="my-1.5 flex items-center justify-end gap-1.5">
						<button
							type="button"
							onClick={() => setAdding(false)}
							className="px-3 py-1.5 text-xs text-neutral-400 hover:text-neutral-600 cursor-pointer transition-colors dark:hover:text-neutral-50"
						>
							Fechar
						</button>
						<button
							type="submit"
							className="flex items-center gap-1.5 rounded-md cursor-pointer bg-neutral-50 px-3 py-2 border text-xs text-neutral-950 transition-colors dark:hover:bg-neutral-300 hover:bg-neutral-100 border-neutral-300"
						>
							<span>Adicionar</span>
							<FiPlus />
						</button>
					</div>
				</motion.form>
			) : (
				<motion.button
					layout
					onClick={() => setAdding(true)}
					className="flex w-full items-center gap-1.5 px-4 py-3 border rounded-xl border-neutral-300 dark:border-neutral-700 text-xs text-neutral-400 transition-colors dark:hover:text-neutral-50 hover:text-neutral-600 cursor-pointer print:hidden"
				>
					<span>Adicionar</span>
					<FiPlus />
					<div className="flex ms-auto items-center gap-1">
						<span className="border-1 dark:border-neutral-800 border-neutral-300 px-1.5 rounded">
							ctrl
						</span>
						<span className="border-1 dark:border-neutral-800 border-neutral-300 px-1.5 block rounded">
							{index}
						</span>
					</div>
				</motion.button>
			)}
		</>
	);
};
