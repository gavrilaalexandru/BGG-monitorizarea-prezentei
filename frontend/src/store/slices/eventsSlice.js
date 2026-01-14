import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  eventGroups: [],
  currentEventGroup: null,
  currentEvent: null,
  isLoading: false,
  error: null,
};

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    setEventGroups: (state, action) => {
      state.eventGroups = action.payload;
      state.isLoading = false;
      state.error = null;
    },

    addEventGroup: (state, action) => {
      state.eventGroups.push(action.payload);
      state.isLoading = false;
    },

    setCurrentEventGroup: (state, action) => {
      state.currentEventGroup = action.payload;
    },

    setCurrentEvent: (state, action) => {
      state.currentEvent = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setEventGroups,
  addEventGroup,
  setCurrentEventGroup,
  setCurrentEvent,
  clearError,
} = eventsSlice.actions;

export default eventsSlice.reducer;
