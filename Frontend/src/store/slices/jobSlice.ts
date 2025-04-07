import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Job {
  jobId: number;
  groupId: number;
  groupCode?: string;
  employerId: number;
  employeeId: number | null;
  employerName: string;
  employeeName: string | null;
  title: string;
  content: string;
  salary: number;
  rewardText: string;
  isPermanent: boolean;
  startAt: string;
  endAt: string;
  status: number;
}

interface JobState {
  availableJobs: Job[];
  contractedJobs: Job[];
}

const initialState: JobState = {
  availableJobs: [],
  contractedJobs: []
};

const jobSlice = createSlice({
  name: 'job',
  initialState,
  reducers: {
    setAvailableJobs: (state, action: PayloadAction<Job[]>) => {
      state.availableJobs = action.payload;
    },
    setContractedJobs: (state, action: PayloadAction<Job[]>) => {
      state.contractedJobs = action.payload;
    }
  }
});

export const { setAvailableJobs, setContractedJobs } = jobSlice.actions;
export default jobSlice.reducer; 