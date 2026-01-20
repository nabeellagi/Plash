const DB_NAME = "arcade_score_db"
const STORE_NAME = "scores"
const DB_VERSION = 1
const MAX_RECORDS = 10

function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION)

        request.onupgradeneeded = () => {
            const db = request.result
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, {
                    keyPath: "id",
                    autoIncrement: true,
                })
            }
        }

        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
    })
}

export async function saveScore({ wave, score }) {
    const db = await openDB()
    const tx = db.transaction(STORE_NAME, "readwrite")
    const store = tx.objectStore(STORE_NAME)

    store.add({
        wave,
        score,
        date: Date.now(),
    })

    await tx.complete

    // trim to top 10
    const all = await getAllScores()
    if (all.length > MAX_RECORDS) {
        const excess = all.slice(MAX_RECORDS)
        excess.forEach(s => store.delete(s.id))
    }
}

export async function getAllScores() {
    const db = await openDB()
    const tx = db.transaction(STORE_NAME, "readonly")
    const store = tx.objectStore(STORE_NAME)

    return new Promise((resolve) => {
        const req = store.getAll()
        req.onsuccess = () => {
            const sorted = req.result
                .sort((a, b) => b.score - a.score)
            resolve(sorted)
        }
    })
}

export async function getBestScore() {
    const scores = await getAllScores()
    return scores.length > 0 ? scores[0] : null
}
