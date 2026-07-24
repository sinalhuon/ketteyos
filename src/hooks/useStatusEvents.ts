export const useStatusEvents = () => {
    // Disabled on shared hosting to avoid keeping long-lived PHP/MySQL
    // connections open for every logged-in client.
    return null;
};
