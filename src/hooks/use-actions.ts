import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../state';

export const useActions = () => {
  const dispatch = useDispatch();

  return useMemo(() => {
    return bindActionCreators(actionCreators, dispatch);
  }, [dispatch]);
};
/* it's like useState and useEffect; useMemo will run again if 
   dispatch" inside the array changes which will not happen.
   UseMemo will run once in this case and we will avoid recalling
   useEffect inside code-cell.tsx infinite times 
*/

// helper hook to access the action creators in a better way
