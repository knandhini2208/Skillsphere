import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../services/api';

// ── Async Thunks ──────────────────────────────────────────────────────
export const register = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    const res = await authAPI.register(data);
    localStorage.setItem('accessToken', res.data.accessToken);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed');
  }
});

export const login = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try {
    const res = await authAPI.login(data);
    if (!res.data.require2FA) {
      localStorage.setItem('accessToken', res.data.accessToken);
    }
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const verify2FA = createAsyncThunk('auth/verify2FA', async (data, { rejectWithValue }) => {
  try {
    const res = await authAPI.verify2FA(data);
    localStorage.setItem('accessToken', res.data.accessToken);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || '2FA verification failed');
  }
});

export const getMe = createAsyncThunk('auth/getMe', async (_, { rejectWithValue }) => {
  try {
    const res = await authAPI.getMe();
    return res.data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  await authAPI.logout();
  localStorage.removeItem('accessToken');
});

// ── Slice ─────────────────────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    require2FA: false,
    tempToken: null,
  },
  reducers: {
    clearError: (state) => { state.error = null; },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    // Register
    builder
      .addCase(register.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Login
    builder
      .addCase(login.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.require2FA) {
          state.require2FA = true;
          state.tempToken = action.payload.tempToken;
        } else {
          state.user = action.payload.user;
          state.isAuthenticated = true;
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // 2FA
    builder
      .addCase(verify2FA.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.require2FA = false;
        state.tempToken = null;
      })
      .addCase(verify2FA.rejected, (state, action) => {
        state.error = action.payload;
      });

    // Get Me
    builder
      .addCase(getMe.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getMe.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        localStorage.removeItem('accessToken');
      });

    // Logout
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.require2FA = false;
      state.tempToken = null;
    });
  },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
