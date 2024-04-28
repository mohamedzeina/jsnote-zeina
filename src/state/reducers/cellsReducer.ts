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
  switch (action.type) {
    case ActionType.UPDATE_CELL:
      const { id, content } = action.payload;
      state.data[id].content = content; // immer allows us to make these simple updates

      return;
    case ActionType.DELETE_CELL:
      delete state.data[action.payload]; // deleting cell from data dictionary
      state.order = state.order.filter((id) => id !== action.payload); // delete cell from the order array

      return;
    case ActionType.MOVE_CELL:
      const { direction } = action.payload;
      const index = state.order.findIndex((id) => id === action.payload.id);
      const targetIndex = direction === 'up' ? index - 1 : index + 1; // new index of cell after moving depending on direction

      if (targetIndex < 0 || targetIndex > state.order.length - 1) {
        return;
      }

      state.order[index] = state.order[targetIndex];
      state.order[targetIndex] = action.payload.id; // basic swap operation between the two cells

      return;
    case ActionType.INSERT_CELL_BEFORE:
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
        state.order.push(cell.id); // adding cell id at the end of the order list
      } else {
        state.order.splice(foundIndex, 0, cell.id); // adding cell id before the id in the payload
      }

      return;
    default:
      return state;
  }
});

const randomId = () => {
  return Math.random().toString(36).substr(2, 5); // base 36 will consist of number and letters
};

export default reducer;
