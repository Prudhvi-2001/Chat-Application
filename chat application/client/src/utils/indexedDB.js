import { openDB } from 'idb';

const DB_NAME = 'GlobalStore';
const STORE_NAME = 'ReduxState';

async function getDB() {
  return openDB(DB_NAME, 2, { // Increment the version to trigger the upgrade
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
        console.log(`Object store '${STORE_NAME}' created.`);
      }
    },
  });
}

export async function saveState(state) {
  const db = await getDB();
  await db.put(STORE_NAME, state, 'state');
}

export async function loadState() {
  const db = await getDB();
  return (await db.get(STORE_NAME, 'state')) || undefined;
}