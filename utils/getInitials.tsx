export function getInitials(name: string) {
    return name.split(' ').map((partial) => {
        return partial.substring(0, 1);
    });
}
