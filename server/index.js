var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, UNSAFE_withComponentProps, Outlet, UNSAFE_withErrorBoundaryProps, isRouteErrorResponse, Meta, Links, ScrollRestoration, Scripts } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { useState, useEffect } from "react";
import { FaAngleLeft, FaTrash, FaEyeSlash, FaEye } from "react-icons/fa";
import { FaCircle, FaXmark, FaPencil, FaGear } from "react-icons/fa6";
import { IoExitOutline } from "react-icons/io5";
import { PiExport } from "react-icons/pi";
import { io } from "socket.io-client";
import { FiTrash, FiPlus } from "react-icons/fi";
import { motion } from "framer-motion";
import { BiLike, BiChevronRight, BiUserX } from "react-icons/bi";
import { BsStarFill } from "react-icons/bs";
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    let timeoutId = setTimeout(
      () => abort(),
      streamTimeout + 1e3
    );
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough({
            final(callback) {
              clearTimeout(timeoutId);
              timeoutId = void 0;
              callback();
            }
          });
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          pipe(body);
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
const links = () => [{
  rel: "preconnect",
  href: "https://fonts.googleapis.com"
}, {
  rel: "preconnect",
  href: "https://fonts.gstatic.com",
  crossOrigin: "anonymous"
}, {
  rel: "stylesheet",
  href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
}];
function Layout({
  children
}) {
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      children: [children, /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
const root = UNSAFE_withComponentProps(function App() {
  return /* @__PURE__ */ jsx(Outlet, {});
});
const ErrorBoundary = UNSAFE_withErrorBoundaryProps(function ErrorBoundary2({
  error
}) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  }
  return /* @__PURE__ */ jsxs("main", {
    className: "pt-16 p-4 container mx-auto",
    children: [/* @__PURE__ */ jsx("h1", {
      children: message
    }), /* @__PURE__ */ jsx("p", {
      children: details
    }), stack]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  Layout,
  default: root,
  links
}, Symbol.toStringTag, { value: "Module" }));
function getInitials(name) {
  return name.split(" ").map((partial) => {
    return partial.substring(0, 1);
  });
}
const columns = [
  { name: "Devemos continuar", column: "continue", color: "emerald", index: 1 },
  { name: "Devemos Parar", column: "stop", color: "amber", index: 2 },
  { name: "Podemos melhorar", column: "improve", color: "red", index: 3 },
  { name: "Devemos Iniciar", column: "start", color: "sky", index: 4 }
];
const updateColumn = (columnName, newColumn) => {
  const columnToUpdate = columns.find((column) => column.column === columnName);
  if (columnToUpdate) {
    columnToUpdate.name = newColumn.name;
    columnToUpdate.color = newColumn.color;
    columnToUpdate.column = newColumn.column;
    console.log(`Column ${columnName} updated to:`, columnToUpdate);
  } else {
    console.error(`Column with name ${columnName} not found.`);
  }
};
class SocketClient {
  constructor(serverUrl, room) {
    __publicField(this, "socket");
    __publicField(this, "room");
    this.socket = io(serverUrl, {
      transports: ["websocket"]
    });
    this.room = room;
    this.socket.on("connect", () => {
      console.log(`Connected to server with ID: ${this.socket.id}`);
      this.joinRoom();
    });
    this.socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });
  }
  joinRoom() {
    this.socket.emit("joinRoom", this.room);
    this.socket.on("room.join", (message) => {
      console.log(message);
    });
  }
  leaveRoom() {
    this.socket.emit("leaveRoom", this.room);
    this.socket.on("room.leave", (message) => {
      console.log(message);
    });
  }
  addCard(card) {
    this.socket.emit("card.add", this.room, card);
  }
  updateCard(cardId, updatedCard) {
    if (!cardId || !updatedCard) {
      console.error("Card ID and updated card data are required to update a card.");
      return;
    }
    console.log(`Updating card with ID: ${cardId}`);
    this.socket.emit("card.update", this.room, cardId, updatedCard);
  }
  removeCard(cardId) {
    if (!cardId) {
      console.error("Card ID is required to remove a card.");
      return;
    }
    console.log(`Removing card with ID: ${cardId}`);
    this.socket.emit("card.remove", this.room, cardId);
  }
  updateUser(user) {
    this.socket.emit("user.update", this.room, user);
  }
  updatecolumn(columnToUpdate, newColumn) {
    this.socket.emit("column.update", this.room, columnToUpdate, newColumn);
  }
  onRoomJoin(callback) {
    this.socket.on("room.join", callback);
  }
  onRoomLeave(callback) {
    this.socket.on("room.leave", callback);
  }
  onCardAdd(callback) {
    this.socket.on("card.added", callback);
  }
  onCardUpdate(callback) {
    this.socket.on("card.updated", callback);
  }
  onCardRemove(callback) {
    this.socket.on("card.removed", callback);
  }
  onCardInitialized(callback) {
    this.socket.on("cards.initial", callback);
  }
  onUserUpdate(callback) {
    this.socket.on("user.updated", callback);
  }
  onColumnUpdate(callback) {
    this.socket.on("column.updated", callback);
  }
  disconnect() {
    this.leaveRoom();
    this.socket.disconnect();
  }
}
const BurnBarrel = ({ user, socket }) => {
  const [active, setActive] = useState(false);
  const handleDragOver = (e) => {
    e.preventDefault();
    setActive(true);
  };
  const handleDragLeave = () => {
    setActive(false);
  };
  const handleDragEnd = (e) => {
    setActive(false);
    const cardId = e.dataTransfer.getData("cardId");
    const cardOwner = e.dataTransfer.getData("cardOwner");
    const storedUser = sessionStorage.getItem("user");
    const loggedUser = storedUser ? JSON.parse(storedUser) : null;
    if (cardOwner !== user.name) {
      if (!(loggedUser == null ? void 0 : loggedUser.superUser)) {
        return;
      }
    }
    if (socket) {
      socket.removeCard(cardId);
    }
    setActive(false);
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      onDrop: handleDragEnd,
      onDragOver: handleDragOver,
      onDragLeave: handleDragLeave,
      title: "Arraste o card para a lixeira para removê-lo",
      className: `print:hidden mt-10 grid h-20 w-20 fixed bottom-10 right-10 shrink-0 place-content-center rounded-full border text-3xl z-2 ${active ? "dark:border-red-800 dark:bg-red-800/20 dark:text-red-500 border-red-600 bg-red-600/20 text-red-500" : "dark:border-neutral-500 dark:bg-neutral-500/20 dark:text-neutral-500 border-neutral-400 bg-neutral-300/20 text-neutral-500"}`,
      children: active ? /* @__PURE__ */ jsx(FiTrash, { className: "animate-pulse" }) : /* @__PURE__ */ jsx(FiTrash, { className: "" })
    }
  );
};
const AddCard = ({ column, socket, index }) => {
  const [text, setText] = useState("");
  const [adding, setAdding] = useState(false);
  const storedUser = sessionStorage.getItem("user");
  const loggedUser = storedUser ? JSON.parse(storedUser) : null;
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
    const newCard = {
      column,
      title: text.trim(),
      id: Math.random().toString(),
      user: loggedUser,
      likes: []
    };
    if (socket) socket.addCard(newCard);
    setText("");
    setAdding(false);
  };
  return /* @__PURE__ */ jsx(Fragment, { children: adding ? /* @__PURE__ */ jsxs(motion.form, { layout: true, onSubmit: handleSubmit, children: [
    /* @__PURE__ */ jsx(
      "input",
      {
        onChange: (e) => setText(e.target.value),
        autoFocus: true,
        placeholder: "Adicionar Card...",
        className: "w-full rounded-xl border border-violet-400 bg-violet-400/20 p-3 text-sm dark:text-neutral-50 placeholder-violet-300 focus:outline-0 focus:border-violet-400 focus:ring-1 focus:ring-violet-400 transition-colors",
        value: text,
        type: "text"
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "my-1.5 flex items-center justify-end gap-1.5", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => setAdding(false),
          className: "px-3 py-1.5 text-xs text-neutral-400 hover:text-neutral-600 cursor-pointer transition-colors dark:hover:text-neutral-50",
          children: "Fechar"
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "submit",
          className: "flex items-center gap-1.5 rounded-md cursor-pointer bg-neutral-50 px-3 py-2 border text-xs text-neutral-950 transition-colors dark:hover:bg-neutral-300 hover:bg-neutral-100 border-neutral-300",
          children: [
            /* @__PURE__ */ jsx("span", { children: "Adicionar" }),
            /* @__PURE__ */ jsx(FiPlus, {})
          ]
        }
      )
    ] })
  ] }) : /* @__PURE__ */ jsxs(
    motion.button,
    {
      layout: true,
      onClick: () => setAdding(true),
      className: "flex w-full items-center gap-1.5 px-4 py-3 border rounded-xl border-neutral-300 dark:border-neutral-700 text-xs text-neutral-400 transition-colors dark:hover:text-neutral-50 hover:text-neutral-600 cursor-pointer print:hidden",
      children: [
        /* @__PURE__ */ jsx("span", { children: "Adicionar" }),
        /* @__PURE__ */ jsx(FiPlus, {}),
        /* @__PURE__ */ jsxs("div", { className: "flex ms-auto items-center gap-1", children: [
          /* @__PURE__ */ jsx("span", { className: "border-1 dark:border-neutral-800 border-neutral-300 px-1.5 rounded", children: "ctrl" }),
          /* @__PURE__ */ jsx("span", { className: "border-1 dark:border-neutral-800 border-neutral-300 px-1.5 block rounded", children: index })
        ] })
      ]
    }
  ) });
};
const Card = ({
  title,
  id,
  column,
  user: cardUser,
  likes,
  socket
}) => {
  const storedUser = sessionStorage.getItem("user");
  const loggedUser = storedUser ? JSON.parse(storedUser) : null;
  const handleDragStart = (e, card) => {
    console.log(`Dragging card:`, card);
    e.dataTransfer.setData("cardId", card.id);
    e.dataTransfer.setData("cardOwner", card.user.name);
  };
  function handleLike() {
    console.log("Card liked!");
    if (likes.some((like) => like.name === loggedUser.name)) {
      likes = likes.filter((like) => like.name !== loggedUser.name);
    } else {
      likes = [...likes, loggedUser];
    }
    if (socket) socket.updateCard(id, { title, id, column, user: cardUser, likes });
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      DropIndicator,
      {
        headingColor: loggedUser.color,
        beforeId: id,
        column
      }
    ),
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        layout: true,
        layoutId: id,
        draggable: "true",
        onDragStart: (e) => handleDragStart(e, {
          title,
          id,
          column,
          user: cardUser
        }),
        className: "cursor-grab rounded-xl border dark:border-neutral-700 border-neutral-300 bg-white dark:bg-neutral-800 p-3 active:cursor-grabbing space-y-2",
        children: [
          /* @__PURE__ */ jsx(
            "p",
            {
              className: cardUser.hidden ? cardUser.name === loggedUser.name ? "bg-neutral-100 dark:bg-neutral-700/40 rounded-md w-auto text-current/50" : "bg-neutral-100 dark:bg-neutral-700/40 rounded-md w-auto text-transparent" : "dark:text-neutral-100",
              children: title
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between space-x-1.5 dark:text-neutral-400 text-black", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex gap-1 items-center", children: [
              /* @__PURE__ */ jsx(
                FaCircle,
                {
                  className: `h-1.5 w-1.5 text-${cardUser.color}-400`
                }
              ),
              /* @__PURE__ */ jsx("small", { className: `print: text=${cardUser.color}-400`, children: cardUser.name })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
              likes.length ? likes.map((likedCardUser) => /* @__PURE__ */ jsxs("div", { className: "group", children: [
                /* @__PURE__ */ jsx(
                  BiLike,
                  {
                    onClick: handleLike,
                    className: `h-4 w-4 text-${likedCardUser.color}-400 cursor-pointer group`
                  }
                ),
                /* @__PURE__ */ jsx("small", { className: "absolute mt-1 px-4 py-1.5 rounded-xl group-hover:grid hidden dark:bg-neutral-800 border bg-neutral-100 text-neutral-700 border-neutral-300 dark:text-white dark:border-neutral-700", children: likedCardUser.name })
              ] }, likedCardUser.name)) : /* @__PURE__ */ jsx(
                BiLike,
                {
                  onClick: handleLike,
                  className: `h-4 w-4 text-neutral-600 hover:text-${loggedUser.color}-400 transition-colors cursor-pointer print:hidden`
                }
              ),
              /* @__PURE__ */ jsx(
                "small",
                {
                  className: `${loggedUser ? `text-${loggedUser.color}-400` : "text-neutral-600"}`
                }
              )
            ] })
          ] })
        ]
      }
    )
  ] });
};
const Column = ({
  title,
  headingColor,
  cards,
  column,
  socket,
  filteredUser,
  index
}) => {
  const [active, setActive] = useState(false);
  const storedUser = sessionStorage.getItem("user");
  const loggedUser = storedUser ? JSON.parse(storedUser) : null;
  const handleDragEnd = (e) => {
    const cardId = e.dataTransfer.getData("cardId");
    const cardOwner = e.dataTransfer.getData("cardOwner");
    setActive(false);
    clearHighlights();
    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);
    if (cardOwner !== loggedUser.name) {
      if (!(loggedUser == null ? void 0 : loggedUser.superUser)) {
        return;
      }
    }
    const before = element.dataset.before || "-1";
    if (before !== cardId) {
      let cardToUpdate = cards.find((c) => c.id === cardId);
      if (!cardToUpdate) return;
      cardToUpdate = { ...cardToUpdate, column };
      if (socket) socket.updateCard(cardId, cardToUpdate);
    }
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    highlightIndicator(e);
    setActive(true);
  };
  const clearHighlights = (els = void 0) => {
    const indicators = els || getIndicators();
    indicators.forEach((i) => {
      i.style.opacity = "0";
    });
  };
  const highlightIndicator = (e) => {
    const indicators = getIndicators();
    clearHighlights(indicators);
    const el = getNearestIndicator(e, indicators);
    el.element.style.opacity = "1";
  };
  const getNearestIndicator = (e, indicators) => {
    const DISTANCE_OFFSET = 50;
    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = e.clientY - (box.top + DISTANCE_OFFSET);
        if (offset < 0 && offset > closest.offset) {
          return { offset, element: child };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1]
      }
    );
    return el;
  };
  const getIndicators = () => {
    return Array.from(document.querySelectorAll(`[data-column="${column}"]`));
  };
  const handleDragLeave = () => {
    clearHighlights();
    setActive(false);
  };
  const filteredCards = cards.filter((c) => c.column === column);
  const finalCards = filteredCards.filter((c) => {
    if (!filteredUser) return true;
    return c.user.name === filteredUser.name;
  });
  return /* @__PURE__ */ jsxs("div", { className: "w-full", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-3 flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("h3", { className: `font-medium text-${headingColor}-400`, children: title }),
      /* @__PURE__ */ jsx("span", { className: "rounded text-sm text-neutral-400", children: filteredCards.length })
    ] }),
    /* @__PURE__ */ jsx(AddCard, { column, socket, index }),
    /* @__PURE__ */ jsxs(
      "div",
      {
        onDrop: handleDragEnd,
        onDragOver: handleDragOver,
        onDragLeave: handleDragLeave,
        className: `h-full w-full transition-colors ${active ? "dark:bg-neutral-800/50 bg-neutral-50 " : "bg-neutral-800/0"}`,
        children: [
          finalCards.map((c) => {
            return /* @__PURE__ */ jsx(Card, { socket, ...c }, c.id);
          }),
          /* @__PURE__ */ jsx(
            DropIndicator,
            {
              beforeId: null,
              column,
              headingColor
            }
          )
        ]
      }
    )
  ] });
};
const Board = ({ cards, loggedUser, socket, filteredUser }) => {
  return /* @__PURE__ */ jsxs("div", { className: `flex w-full gap-3 px-12 flex-1 overflow-hidden`, children: [
    columns.map((col) => /* @__PURE__ */ jsx(
      Column,
      {
        index: col.index,
        title: col.name,
        column: col.column,
        headingColor: col.color,
        cards,
        socket,
        filteredUser
      },
      col.column
    )),
    /* @__PURE__ */ jsx(BurnBarrel, { user: loggedUser, socket })
  ] });
};
function exportCardsToCSV(cards, room) {
  const content = `Column	Title	User
` + cards.map((card) => `${card.column}	${card.title}	${card.user.name}`).join("\n");
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${room}_export.txt`);
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
const ExportModal = (props) => {
  const room = sessionStorage.getItem("room") || "";
  function handleExport(type) {
    return (e) => {
      e.preventDefault();
      console.log(props, "props");
      if (type === "csv") {
        exportCardsToCSV(props.cards, room);
      } else if (type === "image") {
        window.print();
      }
    };
  }
  const csv = "csv";
  const image = "image";
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      props.handleExport();
    }
  });
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 dark:bg-black/50 bg-black/10 z-50 flex items-center justify-center print:hidden", children: /* @__PURE__ */ jsxs("div", { className: "relative dark:bg-neutral-900 bg-white p-6 rounded-4xl shadow-lg grid gap-2", children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: props.handleExport,
        className: "absolute items-center justify-center grid text-red-500 z-3 dark:bg-red-700/30 bg-red-200 dark:hover:bg-red-700/45 hover:bg-red-300/50 dark:hover:text-red-600 rounded-full w-12 h-12 cursor-pointer top-2 right-2",
        children: /* @__PURE__ */ jsx(FaXmark, { size: 24 })
      }
    ),
    /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold mb-4", children: "Exportar" }),
    /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: handleExport(csv),
        className: "dark:text-white cursor-pointer flex justify-between items-center transition-all rounded-full bg-neutral-100 hover:bg-neutral-200/70 dark:bg-neutral-600/20 dark:hover:bg-neutral-600/30 p-2 pl-4 px-2 dark:hover:text-neutral-200 w-96",
        children: [
          "CSV com tabulações ",
          /* @__PURE__ */ jsx(BiChevronRight, { className: "m-2" })
        ]
      }
    ),
    /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: handleExport(image),
        className: "dark:text-white cursor-pointer flex justify-between items-center transition-all rounded-full bg-neutral-100 hover:bg-neutral-200/70 dark:bg-neutral-600/20 dark:hover:bg-neutral-600/30 p-2 pl-4 px-2 dark:hover:text-neutral-200 w-96",
        children: [
          "Imagem ",
          /* @__PURE__ */ jsx(BiChevronRight, { className: "m-2" })
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: props.handleExport,
        className: "px-4 mt-10 py-2 dark:bg-red-700 bg-red-400 cursor-pointer text-white rounded-full dark:hover:bg-red-800 hover:bg-red-500/90",
        children: "Fechar"
      }
    )
  ] }) });
};
const COLORS = [
  "red",
  "amber",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose"
];
function renderColorPicker(setField, currentColor) {
  return /* @__PURE__ */ jsx("div", { className: "grid grid-cols-5 justify-around gap-5", children: COLORS.map((color) => /* @__PURE__ */ jsx(
    "div",
    {
      onClick: () => setField(color),
      className: currentColor === color ? `size-12 rounded-full cursor-pointer hover:brightness-50 bg-${color}-500 ring-white ring-2 border-white` : `size-12 rounded-full cursor-pointer hover:brightness-50 bg-${color}-500`
    },
    color
  )) });
}
const SettingsModal = (props) => {
  const [editingColumn, setEditingColumn] = useState(null);
  const [newColumnId, setNewColumnId] = useState("");
  const [newColumnName, setNewColumnName] = useState("");
  const [newColumnColor, setNewColumnColor] = useState("");
  const storedUser = sessionStorage.getItem("user");
  const loggedUser = storedUser ? JSON.parse(storedUser) : null;
  const [superUser, setSuperUserState] = useState((loggedUser == null ? void 0 : loggedUser.superUser) || false);
  const setSuperUser = () => {
    if (loggedUser) {
      setSuperUserState(!superUser);
      loggedUser.superUser = !loggedUser.superUser;
      sessionStorage.setItem("user", JSON.stringify(loggedUser));
      localStorage.setItem("user", JSON.stringify(loggedUser));
    }
  };
  useEffect(() => {
    setSuperUserState((loggedUser == null ? void 0 : loggedUser.superUser) || false);
  }, []);
  function editColumn(column) {
    setEditingColumn(column);
    setNewColumnColor(column.color.split("-")[1] || "");
    setNewColumnId(column.column);
    setNewColumnName(column.name);
  }
  function deleteColumn(column) {
    throw new Error("Function not implemented.");
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      props.handleSettings();
    }
  });
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 dark:bg-black/50 bg-black/10 z-50 flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "relative dark:bg-neutral-900 bg-white p-6 rounded-4xl shadow-lg grid gap-6", children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: props.handleSettings,
        className: "absolute items-center justify-center grid text-red-500 z-3 dark:bg-red-700/30 bg-red-200 dark:hover:bg-red-700/45 hover:bg-red-300/50 dark:hover:text-red-600 rounded-full w-12 h-12 cursor-pointer top-2 right-2",
        children: /* @__PURE__ */ jsx(FaXmark, { size: 24 })
      }
    ),
    /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold mb-4", children: "Configurações" }),
    editingColumn ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          className: "cursor-pointer flex gap-2 items-center w-24 p-2 bg-neutral-600/25 rounded-full hover:bg-neutral-600/50 transition-colors dark:text-white",
          onClick: () => setEditingColumn(null),
          children: [
            /* @__PURE__ */ jsx(FaAngleLeft, { size: 16, className: "ml-0.5" }),
            "Voltar"
          ]
        }
      ),
      /* @__PURE__ */ jsx("h3", { className: "text-lg mb-2 w-92", children: "Editar Coluna" }),
      /* @__PURE__ */ jsxs(
        "form",
        {
          onKeyDown: (e) => {
            if (e.key === "Escape") {
              setEditingColumn(null);
              setNewColumnId("");
              setNewColumnName("");
              setNewColumnColor("");
            }
          },
          onSubmit: (e) => {
            e.preventDefault();
            if (!newColumnName || !newColumnColor) return;
            props.handleEditColumn(
              editingColumn,
              newColumnName,
              newColumnColor
            );
            setEditingColumn(null);
            setNewColumnId("");
            setNewColumnName("");
            setNewColumnColor("");
          },
          className: "flex flex-col space-y-2 gap-4",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex-col flex gap-1", children: [
              /* @__PURE__ */ jsx("small", { className: "text-xs", children: "Id" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  autoFocus: true,
                  value: editingColumn.column,
                  onChange: (e) => setNewColumnName(e.target.value),
                  placeholder: "Nome da coluna",
                  className: "p-2 rounded bg-neutral-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex-col flex gap-1", children: [
              /* @__PURE__ */ jsx("small", { className: "text-xs", children: "Nome" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: editingColumn.name,
                  onChange: (e) => setNewColumnName(e.target.value),
                  placeholder: "ID da coluna",
                  className: "p-2 rounded bg-neutral-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
              /* @__PURE__ */ jsxs("small", { className: "text-xs mb-2 font-semibold", children: [
                "Cor - ",
                newColumnColor
              ] }),
              renderColorPicker(setNewColumnColor, newColumnColor),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "submit",
                  className: "px-4 mt-6 py-2 dark:bg-neutral-700/50 dark:text-white rounded-full dark:hover:bg-neutral-500/10 cursor-pointer",
                  children: "Salvar"
                }
              )
            ] })
          ]
        }
      )
    ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-4 w-96", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "checkbox",
          checked: superUser,
          onChange: setSuperUser,
          className: "cursor-pointer",
          id: "superUserToggle",
          name: "superUserToggle",
          hidden: true
        }
      ),
      /* @__PURE__ */ jsxs(
        "label",
        {
          htmlFor: "superUserToggle",
          className: "dark:text-white w-full flex items-center ps-4 justify-between dark:bg-neutral-800/50 p-1 rounded-3xl cursor-pointer",
          children: [
            /* @__PURE__ */ jsx("span", { className: "dark:text-white", children: "Super usuário" }),
            /* @__PURE__ */ jsx(
              "span",
              {
                className: `transition-all rounded-full
                                        ${superUser ? `text-amber-500 dark:bg-amber-600/20 dark:hover:bg-amber-600/30 p-1 hover:text-amber-400` : `text-neutral-500 dark:bg-neutral-600/20 dark:hover:bg-neutral-600/30 p-1 hover:text-neutral-400`}
                                    `,
                children: /* @__PURE__ */ jsx(BsStarFill, { className: "m-2" })
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsx("h3", { className: "text-lg", children: "Colunas" }),
      columns.map((col) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "flex items-center ps-4 justify-between dark:bg-neutral-800/50 p-1 rounded-3xl",
          children: [
            /* @__PURE__ */ jsx("span", { className: "dark:text-white", children: col.name }),
            /* @__PURE__ */ jsxs("div", { className: "flex itens-center", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => editColumn(col),
                  className: "text-neutral-500 cursor-pointer transition-all rounded-s-full dark:bg-neutral-600/20 dark:hover:bg-neutral-600/30 p-1 px-2 hover:text-neutral-200",
                  children: /* @__PURE__ */ jsx(FaPencil, { className: "m-2" })
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => deleteColumn(col.column),
                  className: "text-red-500 cursor-pointer transition-all rounded-e-full dark:bg-red-600/20 dark:hover:bg-red-600/30 p-1 px-2 hover:text-red-400",
                  children: /* @__PURE__ */ jsx(FaTrash, { className: "m-2" })
                }
              )
            ] })
          ]
        },
        col.column
      ))
    ] }),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: props.handleSettings,
        className: "px-4 py-2 dark:bg-red-700 bg-red-400 cursor-pointer text-white rounded-full dark:hover:bg-red-800 hover:bg-red-500/90",
        children: "Fechar"
      }
    )
  ] }) });
};
function renderUserForm(userColor, username, localData, room, setError, setUser, setRoom, setUsername, setUserColor, error) {
  return /* @__PURE__ */ jsxs(
    "form",
    {
      className: "grid place-content-center h-screen",
      onSubmit: (e) => {
        e.preventDefault();
        if (!userColor || !username || !room)
          return setError(
            generateMissingFieldsMessage(userColor, username, room)
          );
        setUser({ name: username, color: userColor, hidden: false });
        sessionStorage.setItem(
          "user",
          JSON.stringify({ name: username, color: userColor, hidden: false })
        );
        localStorage.setItem(
          "user",
          JSON.stringify({ name: username, color: userColor, hidden: false })
        );
        sessionStorage.setItem("room", room);
        setRoom(room);
        setUsername(username);
        setUserColor(userColor);
        setError("");
      },
      children: [
        /* @__PURE__ */ jsx("h2", { className: "mt-20", children: "Sala" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            onChange: (e) => {
              setRoom(e.target.value);
            },
            value: room,
            className: `h-10 border-neutral-700 border-b p-2 focus-visible:outline-0 dark:focus-visible:border-white focus-visible:border-violet-400 transition-all focus-visible:border-b-2`,
            type: "text"
          }
        ),
        !localData && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("h2", { className: "mt-20", children: "Qual é seu nome?" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              onChange: (e) => {
                setUsername(e.target.value);
              },
              value: username,
              className: `h-10 border-neutral-700 border-b p-2 focus-visible:outline-0 dark:focus-visible:border-white focus-visible:border-violet-400 transition-all focus-visible:border-b-2`,
              type: "text"
            }
          ),
          /* @__PURE__ */ jsx("h2", { className: "mt-10", children: "Qual cor?" }),
          renderColorPicker(setUserColor, userColor)
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "submit",
            disabled: !userColor || !username || !room,
            className: `px-4 h-10 w-24 hover:w-28 text-white dark:text-black flex gap-2 disabled:opacity-30 group items-center justify-between transition-all mt-10 ${userColor ? `bg-${userColor}-500 *:!text-white` : "dark:bg-white bg-neutral-800"} cursor-pointer rounded-full`,
            children: [
              /* @__PURE__ */ jsx("p", { children: "Entrar" }),
              /* @__PURE__ */ jsx(
                BiChevronRight,
                {
                  size: 24,
                  className: "text-white dark:text-black float-end text-2xl"
                }
              )
            ]
          }
        ),
        localData && /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => {
              setUser(null);
              sessionStorage.removeItem("user");
              localStorage.removeItem("user");
              setRoom("");
              setUsername("");
              setUserColor("");
              setError("");
            },
            className: `px-2 mt-5 h-10 w-10 hover:w-50 flex gap-2 justify-end group items-center transition-all bg-neutral-300/50 dark:bg-slate-700/25 cursor-pointer rounded-full hover:bg-red-500/25`,
            children: [
              /* @__PURE__ */ jsx("span", { className: "group-hover:block group-hover:w-full text-nowrap w-0 hidden dark:text-slate-300 font-semibold overflow-hidden", children: "Reiniciar dados" }),
              /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(BiUserX, { size: 24, className: "dark:text-white text-2xl" }) })
            ]
          }
        ),
        /* @__PURE__ */ jsx("span", { className: "text-red-500 ml-4", children: error })
      ]
    }
  );
}
function generateMissingFieldsMessage(userColor, username, room) {
  const missingFields = [];
  if (!userColor) missingFields.push("cor");
  if (!username) missingFields.push("Username");
  if (!room) missingFields.push("nome da sala");
  if (missingFields.length === 0) return "";
  if (missingFields.length === 1) return `${missingFields[0]} faltando!`;
  if (missingFields.length === 2)
    return `${missingFields[0]} e ${missingFields[1]} faltando!`;
  return `Todos os campos faltando: ${missingFields.join(", ")}!`;
}
function UserIcon(props) {
  var _a;
  return /* @__PURE__ */ jsx("div", { className: "group", children: /* @__PURE__ */ jsxs(
    "div",
    {
      className: ((_a = props.filteredUser) == null ? void 0 : _a.name) === props.user.name ? `text-white ring-2 dark:ring-neutral-200 ring-neutral-500 ring-offset-white dark:ring-offset-slate-800 bg-${props.user.color}-500 h-12 w-12 rounded-full grid place-items-center cursor-pointer hover:ring-offset-1` : `text-white bg-${props.user.color}-500 hover:ring-2 ring-offset-1 ring-neutral-500 ring-offset-white dark:ring-offset-slate-800 hover:ring-neutral-300 dark:hover:ring-white/50 h-12 w-12 rounded-full grid place-items-center cursor-pointer`,
      onClick: () => {
        var _a2;
        if (((_a2 = props.filteredUser) == null ? void 0 : _a2.name) === props.user.name)
          return props.setFilteredUser(null);
        props.setFilteredUser(props.user);
      },
      children: [
        /* @__PURE__ */ jsx("p", { children: getInitials(props.user.name) }),
        /* @__PURE__ */ jsx("small", { className: "absolute mt-24 px-4 py-1.5 rounded-xl group-hover:grid hidden dark:bg-neutral-800 border bg-neutral-100 text-neutral-700 border-neutral-300 dark:text-white dark:border-neutral-700", children: props.user.name })
      ]
    }
  ) });
}
function UsersFilter(props) {
  return /* @__PURE__ */ jsx("div", { className: "flex space-x-3", children: props.users.map((user) => {
    return /* @__PURE__ */ jsx(
      UserIcon,
      {
        filteredUser: props.filteredUser,
        setFilteredUser: props.setFilteredUser,
        user
      },
      user.name
    );
  }) });
}
const App2 = () => {
  const [cards, setCards] = useState([]);
  const [users, setUsers] = useState([]);
  const [loggedUser, setLoggedUser] = useState(null);
  const [userColor, setUserColor] = useState("");
  const [socket, setSocket] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(``);
  const [room, setRoom] = useState(``);
  const [filteredUser, setFilteredUser] = useState(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [localData, setLocalData] = useState(null);
  useEffect(() => {
    const sessionUser = sessionStorage.getItem("user");
    const storedRoom = sessionStorage.getItem("room");
    const storedUser = localStorage.getItem("user");
    setLocalData(storedUser);
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUsername(parsedUser.name);
        setUserColor(parsedUser.color);
      } catch (e) {
        localStorage.removeItem("user");
      }
    }
    if (sessionUser) {
      const parsedUser = JSON.parse(sessionUser);
      setLoggedUser(parsedUser);
      setUsername(parsedUser.name);
      setUserColor(parsedUser.color);
    }
    if (storedRoom) {
      setRoom(storedRoom);
    }
    setLoading(false);
  }, [handleSettings, handleExport, renderUserForm]);
  useEffect(() => {
    const users2 = [];
    cards.map((card) => {
      if (users2.find((user) => {
        return user.name === card.user.name;
      }))
        return;
      users2.push(card.user);
    });
    setUsers(users2);
  }, [cards]);
  useEffect(() => {
    if (!room) return;
    console.log("trying to connect to room:", room);
    console.log("User:", loggedUser);
    if (!loggedUser) {
      console.error("User is not defined. Cannot connect to room.");
      return;
    }
    const socket2 = new SocketClient("http://localhost:1298", room);
    setSocket(socket2);
    socket2.onRoomJoin((message) => {
      console.log(message);
    });
    socket2.onCardInitialized((initialCards) => {
      console.log(` - Cards initialized in room:`, initialCards);
      setCards(initialCards);
      initialCards.forEach((card) => {
        setLoggedUser((prevUser) => {
          if (prevUser && prevUser.name === card.user.name) {
            return {
              ...prevUser,
              color: card.user.color,
              hidden: card.user.hidden,
              likes: card.likes || []
            };
          }
          return prevUser;
        });
      });
    });
    socket2.onRoomLeave((message) => {
      console.log(message);
    });
    socket2.onCardAdd((newCard) => {
      console.log(` - New card added in room:`, newCard);
      setCards((prevCards) => [...prevCards, newCard]);
    });
    socket2.onCardUpdate((cardId, updatedCard) => {
      console.log(` - Card updated in room:`, cardId, updatedCard);
      setCards(
        (prevCards) => prevCards.map((card) => {
          if (card.id === cardId) {
            return { ...card, ...updatedCard };
          }
          return card;
        })
      );
    });
    socket2.onCardRemove((cardId) => {
      console.log(` - Card removed from room:`, cardId);
      setCards((prevCards) => prevCards.filter((card) => card.id !== cardId));
    });
    socket2.onUserUpdate((updatedUser) => {
      console.log(` - User updated:`, updatedUser);
      setCards(
        (prevCards) => prevCards.map((card) => {
          if (card.user.name === updatedUser.name) {
            return { ...card, user: updatedUser };
          }
          return card;
        })
      );
    });
    socket2.onColumnUpdate((columnName, newColumn) => {
      console.log(` - Column updated:`, columnName);
      updateColumn(columnName, newColumn);
    });
    return () => {
      socket2.disconnect();
    };
  }, [loggedUser && room]);
  function handleHide() {
    if (socket && loggedUser) {
      setLoggedUser({ ...loggedUser, hidden: !loggedUser.hidden });
      socket.updateUser({ ...loggedUser, hidden: !loggedUser.hidden });
    }
  }
  function handleExport(event) {
    setIsExportModalOpen(!isExportModalOpen);
  }
  function handleSettings(event) {
    setIsSettingsModalOpen(!isSettingsModalOpen);
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    isSettingsModalOpen && /* @__PURE__ */ jsx(SettingsModal, { handleSettings }),
    isExportModalOpen && /* @__PURE__ */ jsx(ExportModal, { cards, handleExport }),
    /* @__PURE__ */ jsx("span", { className: "bg-red-500 bg-orange-500 bg-amber-500 bg-yellow-500 bg-lime-500 bg-green-500 bg-emerald-500 bg-teal-500 bg-cyan-500 bg-sky-500 bg-blue-500 bg-indigo-500 bg-violet-500 bg-purple-500 bg-fuchsia-500 bg-pink-500 bg-rose-500" }),
    /* @__PURE__ */ jsx("span", { className: "text-red-400 text-orange-400 text-amber-400 text-yellow-400 text-lime-400 text-green-400 text-emerald-400 text-teal-400 text-cyan-400 text-sky-400 text-blue-400 text-indigo-400 text-violet-400 text-purple-400 text-fuchsia-400 text-pink-400 text-rose-400" }),
    loading ? /* @__PURE__ */ jsx("div", { className: "grid place-content-center h-screen overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-24 w-24 border-b-2 border-sky-500" }) }) : loggedUser ? /* @__PURE__ */ jsxs("main", { className: "w-full dark:text-neutral-50 text-neutral-700 min-h-screen flex flex-col", children: [
      /* @__PURE__ */ jsx("h2", { children: /* @__PURE__ */ jsxs("span", { className: "dark:text-slate-300 font-semibold hidden print:block w-screen py-2.5 mb-5 text-center", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl", children: room }),
        /* @__PURE__ */ jsx("small", { className: "mt-4", children: "Users:" }),
        /* @__PURE__ */ jsx("div", { className: "flex justify-center gap-10", children: users.map((user) => /* @__PURE__ */ jsx(
          "small",
          {
            className: `text-${user.color}-400 font-semibold`,
            children: user.name
          }
        )) }),
        /* @__PURE__ */ jsx("hr", { className: "border-slate-200 text-center mx-auto mt-2" })
      ] }) }),
      /* @__PURE__ */ jsxs(
        "div",
        {
          className: `px-2 grid grid-cols-3 items-center justify-items-center py-1.5 bg-slate-500/5 sticky print:hidden`,
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex gap-4 items-center w-full", children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => {
                    if (socket) {
                      sessionStorage.removeItem("user");
                      sessionStorage.removeItem("room");
                      setLoggedUser(null);
                      setRoom("");
                      setCards([]);
                      setUsers([]);
                      socket.leaveRoom();
                    }
                  },
                  className: `px-2 h-10 w-10 hover:w-22 grid grid-cols-2 group items-center transition-all bg-neutral-300/50 dark:bg-slate-700/25 cursor-pointer rounded-full hover:bg-red-500/25`,
                  children: [
                    /* @__PURE__ */ jsx(
                      IoExitOutline,
                      {
                        size: 24,
                        className: "text-2xl transition-none"
                      }
                    ),
                    /* @__PURE__ */ jsx("span", { className: "group-hover:block w-0.5 hidden dark:text-slate-300 font-semibold", children: "Sair" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                "span",
                {
                  className: `text-${loggedUser.color}-400 font-semibold flex items-center gap-2`,
                  children: [
                    loggedUser.name,
                    " ",
                    (loggedUser == null ? void 0 : loggedUser.superUser) && /* @__PURE__ */ jsx(
                      "button",
                      {
                        className: `rounded-full text-amber-500 dark:bg-amber-600/20 bg-amber-200/50`,
                        children: /* @__PURE__ */ jsx(BsStarFill, { className: "m-2" })
                      }
                    )
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsx("h2", { children: /* @__PURE__ */ jsx("span", { className: "dark:text-slate-300 font-semibold", children: room }) }),
            /* @__PURE__ */ jsxs("div", { className: "flex w-full gap-2 justify-end", children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: handleHide,
                  className: loggedUser.hidden ? `px-2 h-10 w-32 disabled:text-white hover:w-32 flex gap-2 justify-end group items-center transition-all bg-neutral-300/50 dark:bg-slate-700/25 cursor-pointer rounded-full hover:bg-sky-500/25` : `px-2 h-10 w-10 disabled:w-32 disabled:text-white hover:w-32 flex gap-2 justify-end group items-center transition-all bg-neutral-300/50 dark:bg-slate-700/25 cursor-pointer rounded-full hover:bg-sky-500/25`,
                  children: [
                    /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: loggedUser.hidden ? "group-hover:block group-hover:w-full w-32 dark:text-slate-300 font-semibold" : "group-hover:block group-hover:w-full w-0 hidden dark:text-slate-300 font-semibold overflow-hidden",
                        children: loggedUser.hidden ? "Mostrar" : "Esconder"
                      }
                    ),
                    /* @__PURE__ */ jsx("p", { children: !loggedUser.hidden ? /* @__PURE__ */ jsx(
                      FaEyeSlash,
                      {
                        size: 24,
                        className: "dark:text-white text-2xl"
                      }
                    ) : /* @__PURE__ */ jsx(
                      FaEye,
                      {
                        size: 24,
                        className: "dark:text-white text-xl"
                      }
                    ) })
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: handleExport,
                  className: `px-2 h-10 w-10 hover:w-30 flex gap-2 justify-end group items-center transition-all bg-neutral-300/50 dark:bg-slate-700/25 cursor-pointer rounded-full hover:bg-emerald-500/25`,
                  children: [
                    /* @__PURE__ */ jsx("span", { className: "group-hover:block group-hover:w-full w-0 hidden dark:text-slate-300 font-semibold overflow-hidden", children: "Exportar" }),
                    /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(
                      PiExport,
                      {
                        size: 24,
                        className: "dark:text-white text-2xl"
                      }
                    ) })
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: handleSettings,
                  className: `px-2 h-10 w-10 hover:w-42 flex gap-2 justify-end group items-center transition-all bg-neutral-300/50 dark:bg-slate-700/25 cursor-pointer rounded-full hover:bg-amber-500/25`,
                  children: [
                    /* @__PURE__ */ jsx("span", { className: "group-hover:block group-hover:w-full w-0 hidden dark:text-slate-300 font-semibold overflow-hidden", children: "Configurações" }),
                    /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(
                      FaGear,
                      {
                        size: 24,
                        className: "dark:text-white text-2xl"
                      }
                    ) })
                  ]
                }
              )
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        "div",
        {
          id: "UsersFilter",
          className: "print:hidden h-20 flex items-center justify-between px-10",
          children: /* @__PURE__ */ jsx(
            UsersFilter,
            {
              users,
              filteredUser,
              setFilteredUser
            }
          )
        }
      ),
      /* @__PURE__ */ jsx(
        Board,
        {
          cards,
          loggedUser,
          socket,
          filteredUser
        }
      )
    ] }) : renderUserForm(
      userColor,
      username,
      localData,
      room,
      setError,
      setLoggedUser,
      setRoom,
      setUsername,
      setUserColor,
      error
    )
  ] });
};
const DropIndicator = ({ beforeId, column, headingColor }) => {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-before": beforeId || "-1",
      "data-column": column,
      className: `my-0.5 h-0.5 w-full bg-${headingColor}-500 opacity-0`
    }
  );
};
function meta({}) {
  return [{
    title: "Sprint"
  }];
}
const home = UNSAFE_withComponentProps(function Home() {
  return /* @__PURE__ */ jsx(Fragment, {
    children: /* @__PURE__ */ jsx(App2, {})
  });
});
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: home,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-B1kD9bXC.js", "imports": ["/assets/chunk-PVWAREVJ-IZQBds5n.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": true, "module": "/assets/root-DPWdQ6NJ.js", "imports": ["/assets/chunk-PVWAREVJ-IZQBds5n.js"], "css": ["/assets/root-C3lMQxH6.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/home": { "id": "routes/home", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/home-26obbp5P.js", "imports": ["/assets/chunk-PVWAREVJ-IZQBds5n.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-7a84bb3f.js", "version": "7a84bb3f", "sri": void 0 };
const assetsBuildDirectory = "build\\client";
const basename = "/";
const future = { "unstable_middleware": false, "unstable_optimizeDeps": false, "unstable_splitRouteModules": false, "unstable_subResourceIntegrity": false, "unstable_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const routeDiscovery = { "mode": "lazy", "manifestPath": "/__manifest" };
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/home": {
    id: "routes/home",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routeDiscovery,
  routes,
  ssr
};
