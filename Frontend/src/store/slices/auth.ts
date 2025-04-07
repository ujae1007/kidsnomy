export interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  isParent: boolean;
  groupId: number | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  accessToken: null,
  isParent: false,
  groupId: null,
};

export const loginSuccess = (state: AuthState, action: PayloadAction<{ token: string; isParent: boolean; groupId: number }>) => {
  state.isAuthenticated = true;
  state.accessToken = action.payload.token;
  state.isParent = action.payload.isParent;
  state.groupId = action.payload.groupId;
};

export const logout = (state: AuthState) => {
  state.isAuthenticated = false;
  state.accessToken = null;
  state.isParent = false;
  state.groupId = null;
}; 