export function setToken(token) {
    localStorage.setItem('jwt', token);
}

export function getToken() {
    return localStorage.getItem('jwt');
}

export function deleteToken() {
    localStorage.removeItem('jwt');
}
