import { writable } from "svelte/store";

function createBool(initVal) {
    const { subscribe, update } = writable(initVal);

    return {
        subscribe,
        flip: () => update(a => !a),
    }
}

export const includePast = createBool(false);
export const onlySchoolDays = createBool(false);