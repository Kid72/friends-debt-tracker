/**
 * Dual-engine Storage Service for Zero-Backend architecture:
 * 1. Offline LocalStorage (instant, reactive, resilient)
 * 2. Cloud REST Sync (JSONBin.io, npoint.io, Firebase Realtime REST, or Custom)
 */

const LOCAL_STORAGE_KEY = 'friends_expense_tracker_state_v1';
const CLOUD_CONFIG_KEY = 'friends_expense_cloud_config_v1';

export const INITIAL_DEMO_DATA = {
  currency: '₼',
  members: [
    { id: 'm_rauf', name: 'Rauf Aliyev', color: '#0b57d0' },
    { id: 'm_mika', name: 'Mika', color: '#b3261e' },
    { id: 'm_chingiz', name: 'Çingiz', color: '#146c2e' },
    { id: 'm_yusif', name: 'Yusif', color: '#6750a4' },
    { id: 'm_elvin', name: 'Elvin', color: '#c26400' }
  ],
  expenses: [
    {
      id: 'exp_1',
      title: 'Tarqovıda kofe & şirniyyat',
      amount: 45.0,
      paidBy: 'm_rauf',
      date: new Date(Date.now() - 24 * 3600 * 1000 * 2).toISOString().split('T')[0],
      splitType: 'EQUAL',
      splits: [
        { memberId: 'm_rauf', amount: 15.0 },
        { memberId: 'm_mika', amount: 15.0 },
        { memberId: 'm_elvin', amount: 15.0 }
      ]
    },
    {
      id: 'exp_2',
      title: 'Steyk-haus şam yeməyi',
      amount: 180.0,
      paidBy: 'm_chingiz',
      date: new Date(Date.now() - 24 * 3600 * 1000).toISOString().split('T')[0],
      splitType: 'EQUAL',
      splits: [
        { memberId: 'm_rauf', amount: 45.0 },
        { memberId: 'm_chingiz', amount: 45.0 },
        { memberId: 'm_yusif', amount: 45.0 },
        { memberId: 'm_elvin', amount: 45.0 }
      ]
    },
    {
      id: 'exp_3',
      title: 'Taksi (Baku - Sea Breeze)',
      amount: 30.0,
      paidBy: 'm_yusif',
      date: new Date().toISOString().split('T')[0],
      splitType: 'EQUAL',
      splits: [
        { memberId: 'm_rauf', amount: 10.0 },
        { memberId: 'm_yusif', amount: 10.0 },
        { memberId: 'm_elvin', amount: 10.0 }
      ]
    }
  ],
  settlements: [],
  updatedAt: new Date().toISOString()
};

export const StorageService = {
  loadLocalState() {
    try {
      const serialized = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!serialized) {
        this.saveLocalState(INITIAL_DEMO_DATA);
        return INITIAL_DEMO_DATA;
      }
      const data = JSON.parse(serialized);
      // Ensure required structure
      return {
        currency: data.currency || '₼',
        members: Array.isArray(data.members) ? data.members : INITIAL_DEMO_DATA.members,
        expenses: Array.isArray(data.expenses) ? data.expenses : [],
        settlements: Array.isArray(data.settlements) ? data.settlements : [],
        updatedAt: data.updatedAt || new Date().toISOString()
      };
    } catch (e) {
      console.error('Error loading local state:', e);
      return INITIAL_DEMO_DATA;
    }
  },

  saveLocalState(state) {
    try {
      const stateWithTime = {
        ...state,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateWithTime));
      return stateWithTime;
    } catch (e) {
      console.error('Error saving local state:', e);
      return state;
    }
  },

  loadCloudConfig() {
    try {
      const raw = localStorage.getItem(CLOUD_CONFIG_KEY);
      return raw ? JSON.parse(raw) : {
        provider: 'LOCAL', // 'LOCAL' | 'NPOINT' | 'JSONBIN' | 'FIREBASE' | 'CUSTOM'
        endpoint: '',
        apiKey: ''
      };
    } catch (e) {
      return { provider: 'LOCAL', endpoint: '', apiKey: '' };
    }
  },

  saveCloudConfig(config) {
    localStorage.setItem(CLOUD_CONFIG_KEY, JSON.stringify(config));
  },

  /**
   * Fetch state from configured remote REST endpoint
   */
  async fetchRemoteState(config) {
    if (!config || config.provider === 'LOCAL' || !config.endpoint) {
      return null;
    }

    try {
      let url = config.endpoint.trim();
      const headers = { 'Accept': 'application/json' };

      if (config.provider === 'JSONBIN') {
        // e.g. https://api.jsonbin.io/v3/b/<BIN_ID>/latest
        if (!url.startsWith('http')) {
          url = `https://api.jsonbin.io/v3/b/${url}/latest`;
        } else if (!url.endsWith('/latest')) {
          url = `${url}/latest`;
        }
        if (config.apiKey) headers['X-Master-Key'] = config.apiKey.trim();
      } else if (config.provider === 'NPOINT') {
        // e.g. https://api.npoint.io/<BIN_ID>
        if (!url.startsWith('http')) {
          url = `https://api.npoint.io/${url}`;
        }
      } else if (config.provider === 'FIREBASE') {
        if (!url.endsWith('.json')) {
          url = url.replace(/\/?$/, '') + '/room.json';
        }
      }

      const res = await fetch(url, { method: 'GET', headers, cache: 'no-cache' });
      if (!res.ok) {
        throw new Error(`Cloud fetch HTTP ${res.status}: ${res.statusText}`);
      }

      const result = await res.json();
      const data = config.provider === 'JSONBIN' && result.record ? result.record : result;

      if (data && Array.isArray(data.members)) {
        return data;
      }
      return null;
    } catch (err) {
      console.warn('Remote sync fetch failed:', err);
      throw err;
    }
  },

  /**
   * Push state to configured remote REST endpoint
   */
  async pushRemoteState(state, config) {
    if (!config || config.provider === 'LOCAL' || !config.endpoint) {
      return false;
    }

    try {
      let url = config.endpoint.trim();
      let method = 'PUT';
      const headers = {
        'Content-Type': 'application/json'
      };

      if (config.provider === 'JSONBIN') {
        if (!url.startsWith('http')) {
          url = `https://api.jsonbin.io/v3/b/${url}`;
        } else {
          url = url.replace(/\/latest$/, '');
        }
        if (config.apiKey) headers['X-Master-Key'] = config.apiKey.trim();
      } else if (config.provider === 'NPOINT') {
        method = 'POST';
        if (!url.startsWith('http')) {
          url = `https://api.npoint.io/${url}`;
        }
      } else if (config.provider === 'FIREBASE') {
        method = 'PUT';
        if (!url.endsWith('.json')) {
          url = url.replace(/\/?$/, '') + '/room.json';
        }
      }

      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(state)
      });

      if (!res.ok) {
        throw new Error(`Cloud push HTTP ${res.status}`);
      }
      return true;
    } catch (err) {
      console.warn('Remote sync push failed:', err);
      throw err;
    }
  }
};
