import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GroupState {
  selectedGroupId: number | null;
}

const initialState: GroupState = {
  selectedGroupId: null
};

const groupSlice = createSlice({
  name: 'group',
  initialState,
  reducers: {
    setSelectedGroupId: (state, action: PayloadAction<number>) => {
      state.selectedGroupId = action.payload;
    },
    clearSelectedGroupId: (state) => {
      state.selectedGroupId = null;
    }
  }
});

export const { setSelectedGroupId, clearSelectedGroupId } = groupSlice.actions;
export default groupSlice.reducer; 