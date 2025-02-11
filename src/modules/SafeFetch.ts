
const checkConnection = async () => {
    try {
        const response = await fetch("https://www.google.com", {
            method: "HEAD"
        });
        return response.ok;
    } catch {
        return false
    }
}

export const fetchSafe = async (url: string, options: { method: string, headers: Record<string, string>, body: string }) => {
    if (!checkConnection())
        return [false, "No Connection Found. Cannot ping for a connection."];

    try {
        const response = await fetch(url, options);
        return [true, response]
    } catch (err) {
        if (err instanceof TypeError) return [false, "No connection or network issue detected."];
        return [false, `API Error: ${err}`];
    }
}