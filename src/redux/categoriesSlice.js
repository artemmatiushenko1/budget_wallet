import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { reset } from './globalSlice';
import { setIsLoading } from './globalSlice';

export const getTransactionCategories = createAsyncThunk(
  'categories/getTransactionCategory',
  async (_, { rejectWithValue, dispatch, getState }) => {
    try {
      dispatch(setIsLoading(true));
      const { token } = getState().user;
      const req = await fetch(
        'https://wallet.goit.ua/api/transaction-categories',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        }
      );
      const resp = await req.json();
      if (!req.ok) {
        throw new Error(resp.message);
      }
      dispatch(addCategories(resp));
    } catch (error) {
      dispatch(setIsLoading(false));
      return rejectWithValue(error.message);
    }
  }
);

const initialState = { categories: null };

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    addCategories: (state, action) => {
      state.categories = action.payload;
    },
  },
  extraReducers: {
    [reset]: (state) => initialState,
  },
});

export const { addCategories } = categoriesSlice.actions;
export const categoriesReducer = categoriesSlice.reducer;