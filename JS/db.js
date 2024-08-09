let db;

// Abrir la base de datos
const request = indexedDB.open('JuegoDatabase', 1);

request.onerror = function(event) {
    console.error('Database error: ' + event.target.errorCode);
};

request.onupgradeneeded = function(event) {
    db = event.target.result;
    // Crea un almacén de objetos si aún no existe
    const objectStore = db.createObjectStore('JuegoData', {keyPath: 'id', autoIncrement: true});
    objectStore.createIndex('username', 'username', {unique: false});
    objectStore.createIndex('time', 'time', {unique: false});
};

request.onsuccess = function(event) {
    db = event.target.result;
};