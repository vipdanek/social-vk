import {
  ADD_POST,
  SET_USER_PROFILE,
  SET_STATUS,
  DELETE_POST,
  SAVE_PHOTO_SUCCESS,
  SAVE_PROFILE_SUCCESS,
} from "../constans";
import { profileAPI, usersAPI } from "../api/api";
import { stopSubmit } from "redux-form";
import { initialStateType } from "./dialogs-reducer";
import {
  PhotosType,
  PostType,
  ProfileType,
} from "../types/types";

let initialState = {
  posts: [
    { id: 1, message: "First post " },
    { id: 2, message: "Second post )" },
  ] as Array<PostType>,
  profile: null as ProfileType | null,
  status: "",
  newPostText: "",
};

export type InitialStateType = typeof initialState;

export const profileReducer = (
  state = initialState,
  action: any
): initialStateType => {
  switch (action.type) {
    case ADD_POST:
      let newPost = {
        id: 5,
        message: action.newPostText,
        likesCount: 0,
      };
      return {
        ...state,
        posts: [...state.posts, newPost],
        newPostText: "",
      };
    case SET_USER_PROFILE:
      return {
        ...state,
        profile: action.profile,
      };
    case SET_STATUS:
      return {
        ...state,
        status: action.status,
      };
    case DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter((p) => p.id !== action.postId),
      };
    case SAVE_PHOTO_SUCCESS:
      return {
        ...state,
        profile: {
          ...state.profile,
          photos: action.photos,
        } as ProfileType,
      };
    case SAVE_PROFILE_SUCCESS:
      return {
        ...state,
        //  action.saveProfile,
      };
    default:
      return state;
  }
};
// ===
type AddPostActionCreatorType = {
  type: typeof ADD_POST;
  newPostText: string;
};
export const addPostActionCreator = (
  newPostText: string
): AddPostActionCreatorType => ({
  type: ADD_POST,
  newPostText,
});
// ===
type SetUserProfileType = {
  type: typeof SET_USER_PROFILE;
  profile: ProfileType;
};
export const setUserProfile = (profile: ProfileType): SetUserProfileType => ({
  type: SET_USER_PROFILE,
  profile,
});
// ===
type SetUserStatusType = {
  type: typeof SET_STATUS;
  status: string;
};
export const setUserStatus = (status: string): SetUserStatusType => ({
  type: SET_STATUS,
  status,
});
// ===
type DeletePostType = {
  type: typeof DELETE_POST;
  postId: number;
};
export const deletePost = (postId: number): DeletePostType => ({
  type: DELETE_POST,
  postId,
});
// ===
type SavePhotoSuccess = {
  type: typeof SAVE_PHOTO_SUCCESS;
  photos: PhotosType;
};
const savePhotoSuccess = (photos: PhotosType): SavePhotoSuccess => ({
  type: SAVE_PHOTO_SUCCESS,
  photos,
});
// ===
// type SaveProfileSuccess = {};
const saveProfileSuccess = (formData: any) => ({
  type: SAVE_PROFILE_SUCCESS,
  formData,
});
// ===

//Use thunk
export const getUserProfile = (userId: number) => async (dispatch: any) => {
  console.log(dispatch);
  const response = await usersAPI.getProfile(userId);
  dispatch(setUserProfile(response.data));
};

export const getStatus = (userId: number) => async (dispatch: any) => {
  const response = await profileAPI.getStatus(userId);
  dispatch(setUserStatus(response.data));
};

export const updateStatus = (status: string) => async (dispatch: any) => {
  const response = await profileAPI.updateStatus(status);
  if (response.data.resultCode === 0) {
    dispatch(setUserStatus(status));
  }
};
export const savePhoto = (file: any) => async (dispatch: any) => {
  const response = await profileAPI.savePhoto(file);

  if (response.data.resultCode === 0) {
    dispatch(savePhotoSuccess(response.data.data.photos));
  }
};
export const saveProfile = (profile: ProfileType) => async (
  dispatch: any,
  getState: any
) => {
  const userId = getState().auth.userId;
  const response = await profileAPI.saveProfile(profile);

  if (response.data.resultCode === 0) {
    dispatch(getUserProfile(userId));
  } else {
    dispatch(stopSubmit("edit-profile", { _error: response.data.messages[0] }));
    return Promise.reject(response.data.messages[0]);
  }
};
