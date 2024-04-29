import { useTypedSelector } from '../hooks/use-typed-selector';

const CellList: React.FC = () => {
  const cells = useTypedSelector(({ cells: { order, data } }) => {
    return order.map((id) => {
      return data[id];
    });
  }); // for each id in the order list, return the cell data so we get them in order

  return <div>CellList</div>;
};

export default CellList;
