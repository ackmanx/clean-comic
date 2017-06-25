export const idGenerator = (function* idMaker() {
    let id = 0
    while (true) {
        yield id++
    }
})()
