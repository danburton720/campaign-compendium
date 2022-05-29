const hostname = process.env.NODE_ENV;
const AUTH_ROOT = hostname === 'development' ? 'http://localhost:4000' : `//${window.location.host}`;
const API_ROOT = `${AUTH_ROOT}/api`;

export const API = {
    auth: {
        google: `${AUTH_ROOT}/auth/google`,
        logout: `${AUTH_ROOT}/auth/logout`
    },
    user: {
        user: `${API_ROOT}/user`
    },
    campaigns: {
        campaigns: `${API_ROOT}/campaigns`,
        created: `${API_ROOT}/campaigns/created`,
        player: `${API_ROOT}/campaigns/player`,
        campaign: `${API_ROOT}/campaigns/{campaignId}`,
        invite: `${API_ROOT}/campaigns/{campaignId}/invite`,
        remove_player: `${API_ROOT}/campaigns/{campaignId}/user/{userId}`,
        session_updates: `${API_ROOT}/campaigns/{campaignId}/session-updates`
    },
    characters: {
        character: `${API_ROOT}/characters/{characterId}`,
        kill: `${API_ROOT}/characters/{characterId}/kill`,
        revive: `${API_ROOT}/characters/{characterId}/revive`
    },
    session_updates: {
        session_update: `${API_ROOT}/session-updates/{sessionUpdateId}`
    }
};