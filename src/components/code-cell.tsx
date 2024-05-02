import './code-cell.css';
import { useEffect } from 'react';
import CodeEditor from './code-editor';
import Preview from './preview';
import Resizable from './resizable';
import { Cell } from '../state';
import { useActions } from '../hooks/use-actions';
import { useTypedSelector } from '../hooks/use-typed-selector';

interface CodeCellProps {
  cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const { updateCell, createBundle } = useActions();
  const bundle = useTypedSelector((state) => state.bundles[cell.id]);
  const cumlativeCode = useTypedSelector((state) => {
    const { data, order } = state.cells;
    const orderedCells = order.map((id) => data[id]);

    const cumlativeCode = [
      `
      const show = (value) => {
        const root = document.querySelector('#root');

        if (typeof value === 'object') {
          if (value.$$typeof && value.props) {
            ReactDOM.render(value, root);
          } else {
            root.innerHTML = JSON.stringify(value);
          }
          
        } else {
          root.innerHTML = value;
        }
        
      };
      `,
    ];
    for (let c of orderedCells) {
      // going through ordered cells and getting all prior code cells to accumlate them
      if (c.type == 'code') {
        cumlativeCode.push(c.content);
      }
      if (c.id == cell.id) {
        // if we reach the cell that we are rendering, stop
        break;
      }
    }
    return cumlativeCode;
  });

  useEffect(() => {
    if (!bundle) {
      createBundle(cell.id, cumlativeCode.join('\n'));
      return;
    }

    const timer = setTimeout(async () => {
      createBundle(cell.id, cumlativeCode.join('\n'));
    }, 1000);

    return () => {
      clearTimeout(timer); // clearing timer if user input is updated before 1 second passes
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cell.id, cumlativeCode.join('\n'), createBundle]);

  return (
    <Resizable direction="vertical">
      <div
        style={{
          height: 'calc(100% - 10px)',
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <Resizable direction="horizontal">
          <CodeEditor
            initalValue={cell.content}
            onChange={(value) => updateCell(cell.id, value)}
          />
        </Resizable>
        <div className="progress-background">
          {!bundle || bundle.loading ? (
            <div className="progress-cover">
              <progress className="progress is-small is-primary" max="100">
                Loading
              </progress>
            </div>
          ) : (
            <Preview code={bundle.code} bundlingError={bundle.err} />
          )}
        </div>
      </div>
    </Resizable>
  );
};

export default CodeCell;
