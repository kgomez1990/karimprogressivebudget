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


