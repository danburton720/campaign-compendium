const hostname = process.env.NODE_ENV;
const API_ROOT = hostname === 'development' ? 'http://localhost:4000' : `//${window.location.host}`;

export const API = {
    auth: {
        google: `${API_ROOT}/auth/google`,
        logout: `${API_ROOT}/auth/logout`
    },
    user: {
        user: `${API_ROOT}/user`
    },
    campaigns: {
        campaigns: `${API_ROOT}/campaigns`,
        created: `${API_ROOT}/campaigns/created`,
        player: `${API_ROOT}/campaigns/player`
    }
};