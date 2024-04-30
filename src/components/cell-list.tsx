import { Fragment } from 'react/jsx-runtime';
import { useTypedSelector } from '../hooks/use-typed-selector';
import CellListItem from './cell-list-item';
import AddCell from './add-cell';

const CellList: React.FC = () => {
  const cells = useTypedSelector(({ cells: { order, data } }) => {
    return order.map((id) => {
      return data[id];
    });
  }); // for each id in the order list, return the cell data so we get them in order

  const renderedCells = cells.map((cell) => (
    <Fragment key={cell.id}>
      <AddCell nextCellId={cell.id} />
      <CellListItem cell={cell} />
    </Fragment>
  ));
  return (
    <div>
      {renderedCells}

      <AddCell forceVisible={cells.length === 0} nextCellId={null} />
    </div>
  );
};

// if cell list is empty, force the add cell component to be visible

export default CellList;
