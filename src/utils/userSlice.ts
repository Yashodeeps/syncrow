import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../lib/store";

interface UserState {
  id: string | null;
  name: string | null;
  address: string | null;
  professional_title: string | null;
  skills: string[] | null;
  bio: string | null;
  avatar: string | null;
}

const initialState: UserState = {
  id: null,
  name: null,
  address: null,
  professional_title: null,
  skills: null,
  bio: null,
  avatar: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      return action.payload;
    },
    clearUser: (state) => {
      return initialState;
    },
    updateUser: (state, action: PayloadAction<Partial<UserState>>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setUser, clearUser, updateUser } = userSlice.actions;

export const selectUser = (state: RootState) => state.user;
export const selectUserId = (state: RootState) => (state.user as UserState).id;
export const selectUserName = (state: RootState) =>
  (state.user as UserState).name;
export const selectUserAddress = (state: RootState) =>
  (state.user as UserState).address;
export const selectUserProfessionalTitle = (state: RootState) =>
  (state.user as UserState).professional_title;
export const selectUserSkills = (state: RootState) =>
  (state.user as UserState).skills;
export const selectUserBio = (state: RootState) =>
  (state.user as UserState).bio;
export const selectUserAvatar = (state: RootState) =>
  (state.user as UserState).avatar;

export default userSlice.reducer;
