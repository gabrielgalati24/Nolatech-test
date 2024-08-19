import { createSlice, PayloadAction } from '@reduxjs/toolkit';


export type Role = 'Admin' | 'Manager' | 'Employee';


const initialRole: Role | null = (localStorage.getItem('role') as Role) || null;

interface AuthState {
  role: Role | null;
}

const initialState: AuthState = {
  role: initialRole,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setRole: (state, action: PayloadAction<Role>) => {
      state.role = action.payload;

      // save the role in localStorage
      localStorage.setItem('role', action.payload);
    },
    clearRole: (state) => {
      state.role = null;

      // delete the role from localStorage
      localStorage.removeItem('role');
    },
  },
});

export const { setRole, clearRole } = authSlice.actions;

export default authSlice.reducer;
