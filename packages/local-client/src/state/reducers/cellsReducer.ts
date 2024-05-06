import { produce } from 'immer';
import { ActionType } from '../action-types';
import { Action } from '../actions';
import { Cell } from '../cell';

interface CellState {
  loading: boolean;
  error: string | null;
  order: string[];
  data: {
    [key: string]: Cell;
  };
}

const initialState: CellState = {
  loading: false,
  error: null,
  order: [],
  data: {},
};

const reducer = produce((state: CellState = initialState, action: Action) => {
  // wrapped it with a produce to use immer
  switch (action.type) {
    case ActionType.SAVE_CELLS_ERROR:
      state.error = action.payload;

      return state;
    case ActionType.FETCH_CELLS:
      state.loading = true;
      state.error = null;

      return state;
    case ActionType.FETCH_CELLS_COMPLETE:
      state.order = action.payload.map((cell) => cell.id);
      state.data = action.payload.reduce((acc, cell) => {
        acc[cell.id] = cell;
        return acc;
      }, {} as CellState['data']);

      return state;
    case ActionType.FETCH_CELLS_ERROR:
      state.loading = false;
      state.error = action.payload;

      return state;
    case ActionType.UPDATE_CELL:
      const { id, content } = action.payload;
      state.data[id].content = content; // immer allows us to make these simple updates

      return state;
    case ActionType.DELETE_CELL:
      delete state.data[action.payload]; // deleting cell from data dictionary
      state.order = state.order.filter((id) => id !== action.payload); // delete cell from the order array

      return state;
    case ActionType.MOVE_CELL:
      const { direction } = action.payload;
      const index = state.order.findIndex((id) => id === action.payload.id);
      const targetIndex = direction === 'up' ? index - 1 : index + 1; // new index of cell after moving depending on direction

      if (targetIndex < 0 || targetIndex > state.order.length - 1) {
        return state;
      }

      state.order[index] = state.order[targetIndex];
      state.order[targetIndex] = action.payload.id; // basic swap operation between the two cells

      return state;
    case ActionType.INSERT_CELL_AFTER:
      const cell: Cell = {
        content: '',
        type: action.payload.type,
        id: randomId(),
      };

      state.data[cell.id] = cell; // inserting new cell to the data

      const foundIndex = state.order.findIndex(
        (id) => id === action.payload.id
      );

      if (foundIndex < 0) {
        state.order.unshift(cell.id); // adding cell id at the start of the order list
      } else {
        state.order.splice(foundIndex + 1, 0, cell.id); // adding cell id after the id in the payload
      }

      return state;
    default:
      return state;
  }
}, initialState);

const randomId = () => {
  return Math.random().toString(36).substr(2, 5); // base 36 will consist of number and letters
};

export default reducer;
