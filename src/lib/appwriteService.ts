import { Client, Account, Databases } from 'appwrite';
import { DB_PROVIDERS_CONFIG } from './dbConfig';

const config = DB_PROVIDERS_CONFIG.APPWRITE;
const client = new Client();
if (config.endpoint) {
  client.setEndpoint(config.endpoint);
}
if (config.projectId) {
  client.setProject(config.projectId);
} else {
  // Use a dummy project id to avoid SDK throwing on initialization
  client.setProject('dummy-project-id');
}
export const account = new Account(client);
export const databases = new Databases(client);
export { client };

// Skeleton for compatibility
export const addDoc = async (coll: string, data: any) => {
    // simplified for Appwrite needing ID
    return await databases.createDocument(config.projectId || 'dummy-project-id', coll, 'unique()', data);
};
export const getDocs = async (coll: string) => {
    return await databases.listDocuments(config.projectId || 'dummy-project-id', coll);
};
