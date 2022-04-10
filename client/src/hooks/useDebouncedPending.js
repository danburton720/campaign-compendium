import React, { useEffect } from 'react';

const useDebouncedPending = (setPending, deps, delay) => {
    useEffect(() => {
        if (deps.some(dep => dep)) {
            setPending(true);
            setTimeout(() => {
                setPending(false);
            }, delay || 750);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ ...deps || [], delay || 750]);
}

export default useDebouncedPending;
