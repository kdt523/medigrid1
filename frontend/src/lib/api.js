const BASE_URL = 'http://localhost:5000/api';

let accessToken = localStorage.getItem('medigrid_token');

export const setToken = (token) => {
  accessToken = token;
  localStorage.setItem('medigrid_token', token);
};

export const clearToken = () => {
  accessToken = null;
  localStorage.removeItem('medigrid_token');
};

const headers = (extra = {}) => ({
  'Content-Type': 'application/json',
  ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  ...extra,
});

export const api = {
  // Auth
  login:   (email, password)  => fetch(`${BASE_URL}/auth/login`,  { method: 'POST', headers: headers(), body: JSON.stringify({ email, password }) }).then(r => r.json()),
  logout:  ()                  => fetch(`${BASE_URL}/auth/logout`, { method: 'POST', headers: headers() }).then(r => r.json()),
  me:      ()                  => fetch(`${BASE_URL}/auth/me`,     { headers: headers() }).then(r => r.json()),

  // Hospitals
  getHospitals:    (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.append(key, value);
    });
    return fetch(`${BASE_URL}/hospitals?${searchParams.toString()}`, { headers: headers() }).then(r => r.json());
  },
  getHospital:     (id)          => fetch(`${BASE_URL}/hospitals/${id}`, { headers: headers() }).then(r => r.json()),
  createHospital:  (data)        => fetch(`${BASE_URL}/hospitals`,      { method: 'POST', headers: headers(), body: JSON.stringify(data) }).then(r => r.json()),
  updateHospital:  (id, data)    => fetch(`${BASE_URL}/hospitals/${id}`, { method: 'PUT',  headers: headers(), body: JSON.stringify(data) }).then(r => r.json()),
  deleteHospital:  (id)          => fetch(`${BASE_URL}/hospitals/${id}`, { method: 'DELETE', headers: headers() }).then(r => r.json()),

  // Resources
  updateResources: (hospitalId, data) => fetch(`${BASE_URL}/resources/${hospitalId}`, { method: 'PATCH', headers: headers(), body: JSON.stringify(data) }).then(r => r.json()),
  getResourceHistory: (hospitalId)    => fetch(`${BASE_URL}/resources/${hospitalId}/history`, { headers: headers() }).then(r => r.json()),

  // Search
  search: (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.append(key, value);
    });
    return fetch(`${BASE_URL}/search?${searchParams.toString()}`).then(r => r.json());
  },

  // Alerts
  getAlerts:    (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.append(key, value);
    });
    return fetch(`${BASE_URL}/alerts?${searchParams.toString()}`, { headers: headers() }).then(r => r.json());
  },
  getAlertStats:()             => fetch(`${BASE_URL}/alerts/stats`, { headers: headers() }).then(r => r.json()),
  resolveAlert: (id, note)     => fetch(`${BASE_URL}/alerts/${id}/resolve`, { method: 'PATCH', headers: headers(), body: JSON.stringify({ resolution_note: note }) }).then(r => r.json()),

  // Analytics
  getAnalyticsSummary: ()              => fetch(`${BASE_URL}/analytics/summary`,  { headers: headers() }).then(r => r.json()),
  getAnalyticsTrends:  (range, type)   => fetch(`${BASE_URL}/analytics/trends?range=${range}&resource_type=${type}`, { headers: headers() }).then(r => r.json()),
  exportCSV:           (range)         => fetch(`${BASE_URL}/analytics/export?range=${range}`, { headers: headers() }),

  // Users
  getUsers:     ()         => fetch(`${BASE_URL}/users`,      { headers: headers() }).then(r => r.json()),
  createUser:   (data)     => fetch(`${BASE_URL}/users`,      { method: 'POST',   headers: headers(), body: JSON.stringify(data) }).then(r => r.json()),
  updateUser:   (id, data) => fetch(`${BASE_URL}/users/${id}`, { method: 'PUT',   headers: headers(), body: JSON.stringify(data) }).then(r => r.json()),
  toggleUser:   (id, status) => fetch(`${BASE_URL}/users/${id}/status`, { method: 'PATCH', headers: headers(), body: JSON.stringify({ status }) }).then(r => r.json()),

  // Thresholds
  getThresholds:    ()            => fetch(`${BASE_URL}/thresholds`, { headers: headers() }).then(r => r.json()),
  updateThresholds: (id, data)    => fetch(`${BASE_URL}/thresholds/${id}`, { method: 'PUT', headers: headers(), body: JSON.stringify(data) }).then(r => r.json()),

  // Audit Logs
  getAuditLogs: (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.append(key, value);
    });
    return fetch(`${BASE_URL}/audit-logs?${searchParams.toString()}`, { headers: headers() }).then(r => r.json());
  },
};
