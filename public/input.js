export default function createInput() {
    function filterInputs(keydown) {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(keydown)) {
            return keydown
        }
    }

    return {
        filterInputs
    }
}