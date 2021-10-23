let budgetVersion;
let db;

let request = indexedDB.open("BudgetDB", budgetVersion || 21);

request.onupgradeneeded = function (e) {
    console.log("upgrade needed in IndexDB")

    const { oldVersion } = e;
    const newVersion = e.newVersion || db.newversion;

    console.log(`DB Updated from version ${oldVersion} to ${newVersion}`);

    db = e.target.result;

    if (db.objectStoreNames.length === 0) {
        db.createObjectStore("BudgetStore", { autoIncrement: true })
    }
};


request.onerror = function (error) {
    console.log("Wow" `${error.target.errorcode}`)
};

let checkdatabase = () => {
    console.log("DB invoked")
    let transaction = db.transaction(["BudgetStore"], readwrite);
    const store = transaction.objectStore("BudgetStore");
    let getAll = store.getAll();

    getAll.onsuccess = function () {

        if (getAll.result.length > 0) {
            fetch('/api/transaction/bulk', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => response.json())
                .then((res) => {

                    if (res.length !== 0) {

                        transaction = db.transaction(['BudgetStore'], 'readwrite');
                        const currentStore = transaction.objectStore('BudgetStore');

                        currentStore.clear();
                        console.log('Clearing store 🧹');
                    }
                });
        }
    };

}

request.onsuccess = function (e) {
    console.log("sucess")
    db = e.target.result;

    if (navigator.onLine) {
        console.log("BackEnd Online");
        checkdatabase()
    }
};

const saveRecord = (record) => {
    console.log("save record invoked");
    const transaction = db.transaction(["BudgetStore"], readwrite);
    const store = transaction.objectStore("BudgetStore");
    store.add(record);
};
window.addEventListener('online', checkdatabase);