const COLORS = [
    'red',
    'amber',
    'emerald',
    'teal',
    'cyan',
    'sky',
    'blue',
    'violet',
    'purple',
    'fuchsia',
    'pink',
    'rose',
];

export function renderColorPicker(setField, currentColor: string) {
    return <div className="grid grid-cols-5 justify-around gap-5">
        {COLORS.map((color) => (
            <div
                onClick={() => setField(color)}
                key={color}
                className={currentColor === color
                    ? `size-12 rounded-full cursor-pointer hover:brightness-50 bg-${color}-500 ring-white ring-2 border-white`
                    : `size-12 rounded-full cursor-pointer hover:brightness-50 bg-${color}-500`}></div>
        ))}
    </div>;
}