import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const createTransaction = createAsyncThunk(
  'transactions/createTransaction',
  async (transaction, { rejectWithValue, dispatch }) => {
    try {
      console.log(transaction);
      const req = await fetch('https://wallet.goit.ua/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzaWQiOiJlNzNkNDNhNS1hYjJmLTRlODgtYmI3Ni0wZjFlMGJjNWNhYjMiLCJpYXQiOjE2NDQxNTczNzgsImV4cCI6MTAwMDAwMDE2NDQxNTczNzh9.e5qXzp0wq7x1xir0unYYGBgHwBEtCxlWNEgBrp-UteU',
        },
        body: JSON.stringify(transaction),
      });

      if (!req.ok) {
        throw new Error("Can't create new transaction");
      }

      const resp = await req.json();
      console.log(resp);
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.message);
    }
  }
);

const initialState = { transactions: [] };

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    addTransaction: (state, action) => {
      state.transactions.push(action.payload.transaction);
    },
  },
});

export const { addTransaction } = transactionSlice.actions;
export const transactionsReducer = transactionSlice.reducer;
