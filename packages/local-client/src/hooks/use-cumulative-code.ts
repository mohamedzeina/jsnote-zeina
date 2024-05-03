import { useTypedSelector } from './use-typed-selector';

export const useCumulativeCode = (cellId: string) => {
  return useTypedSelector((state) => {
    const { data, order } = state.cells;
    const orderedCells = order.map((id) => data[id]);

    const showFunc = `
    import _React from 'react';
        import _ReactDOM from 'react-dom';
          var show = (value) => {
          const root = document.querySelector('#root');

          if (typeof value === 'object') {
            if (value.$$typeof && value.props) {
              _ReactDOM .render(value, root);
            } else {
              root.innerHTML = JSON.stringify(value);
            }
            
          } else {
            root.innerHTML = value;
          }
          
        };`;
    const cumlativeCode = [];
    const showFuncNoop = 'var show = () => {}'; // show function that clears prior code cells using show

    for (let c of orderedCells) {
      // going through ordered cells and getting all prior code cells to accumlate them
      if (c.type === 'code') {
        if (c.id === cellId) {
          // if cell is the cell we're trying to execute, add the show function with actual logic
          cumlativeCode.push(showFunc);
        } else {
          // if cell is a prior cell, add show function that does nothing to clear show function calls by this prior cell
          cumlativeCode.push(showFuncNoop);
        }
        cumlativeCode.push(c.content);
      }
      if (c.id === cellId) {
        // if we reach the cell that we are rendering, stop
        break;
      }
    }
    return cumlativeCode;
  }).join('\n');
};
