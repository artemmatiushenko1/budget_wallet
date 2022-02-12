import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { basicCategoriesColors, generateUniqueColor } from '../components/DiagramTab/categoriesColors';

const BASIC_URL = 'https://wallet.goit.ua/api';

export const getCategoriesStatistics = createAsyncThunk(
  'statistics/getCategoriesStatistics',
  async(period, {rejectWithValue}) => {
    const options = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        Authorization:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzaWQiOiJlNzNkNDNhNS1hYjJmLTRlODgtYmI3Ni0wZjFlMGJjNWNhYjMiLCJpYXQiOjE2NDQxNTczNzgsImV4cCI6MTAwMDAwMDE2NDQxNTczNzh9.e5qXzp0wq7x1xir0unYYGBgHwBEtCxlWNEgBrp-UteU',
      }
    }

    let response;
    if(!period || (!period.year && period.month)) {
      response = await fetch(`${BASIC_URL}/transactions-summary`, options);
    } else if (!period.month) {
      response = await fetch(`${BASIC_URL}/transactions-summary?year=${period.year}`, options);
    } else {
      response = await fetch(`${BASIC_URL}/transactions-summary?month=${period.month}&year=${period.year}`, options);
    }

    if (!response.ok) {
      return rejectWithValue(await response.json());
    }
    return await response.json();
  }
)

const initialState = {
  statistics: null,
  error: null,
}

const StatisticsSlice = createSlice({
  name: 'statistics',
  initialState,
  reducers: {
    setMonth: (state, {payload}) => {
      state.statistics.month = payload;
    },

    setYear: (state, {payload}) => {
      state.statistics.year = payload;
    },

    addTransactionToStatistics: (state, {payload}) => {
      const {transaction, categoryName} = payload;

      switch (transaction.type) {
        case 'INCOME':
          state.statistics.incomeSummary += transaction.amount;
          break;
        default:
          state.statistics.expenseSummary += transaction.amount;
      }

      state.statistics.periodTotal += transaction.amount;

      const stateCategory = state.statistics['categoriesSummary'].find(category => category.name === categoryName);
      if (stateCategory) {
        stateCategory.total += transaction.amount;
      } else {
        const category = {
          name: categoryName,
          type: transaction.type,
          total: transaction.amount,
          color:
            basicCategoriesColors.find(category => category.category === categoryName)?.color
            || generateUniqueColor(),
        }
        state.statistics['categoriesSummary'].push(category)
      }
    }
  },

  extraReducers(builder) {
    builder
      .addCase(getCategoriesStatistics.fulfilled, (state, {payload}) => {
        payload['categoriesSummary'] = payload['categoriesSummary']
          .map(elem => {
            const color = basicCategoriesColors.find(category => category.category === elem.name)?.color;
            return color ? {...elem, color } : {...elem, color: generateUniqueColor()};
          })
        state.statistics = payload;
      })

      .addCase(getCategoriesStatistics.rejected, (state, action) => {
        state.error = action.payload.message;
      })
  }
})

export const {setMonth, setYear, addTransactionToStatistics} = StatisticsSlice.actions;
export const statisticsReducer = StatisticsSlice.reducer;