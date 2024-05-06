import { Dispatch } from 'redux';
import { Action } from '../actions';
import { ActionType } from '../action-types';
import { SaveCells } from '../action-creators';
import { RootState } from '../reducers';

export const persistMiddleware = ({
  dispatch,
  getState,
}: {
  dispatch: Dispatch<Action>;
  getState: () => RootState;
}) => {
  return (next: (action: Action) => void) => {
    return (action: any) => {
      next(action);

      if (
        [
          ActionType.MOVE_CELL,
          ActionType.UPDATE_CELL,
          ActionType.INSERT_CELL_AFTER,
          ActionType.DELETE_CELL,
        ].includes(action.type)
      ) {
        SaveCells()(dispatch, getState); // We invoke the fucntion we get back from saveCells
      }
    };
  };
};
