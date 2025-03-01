const baseUrl = 'http://localhost:3030/jsonstore/users'
export default {
    // get all users
    async getAll() {
        const response = await fetch(baseUrl);
        const result = await response.json();
        const users = Object.values(result)
        return users
    }
}