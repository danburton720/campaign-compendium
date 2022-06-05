export const sortCharactersActiveFirst = (characters) => {
    return characters.sort((a, b) => {
        if (a.status === 'active' && (b.status !== 'active' || b.deletedAt)) return -1;
        if ((a.status !== 'active' || b.deletedAt) && b.status === 'active') return 1;
        return 0;
    });
}