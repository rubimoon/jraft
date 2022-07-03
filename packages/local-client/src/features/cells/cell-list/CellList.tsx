import "./CellList.css";
import CellListItem from "./CellListItem";
import { Fragment, useEffect } from "react";
import { useTypedSelector } from "../../../app/hooks/use-typed-selector";
import { Cell } from "../models/cell";
import { useAppDispatch } from "../../../app/state/configureStore";
import { fetchCellsAsync } from "../state/cellsSlice";
import AddCell from "../cell-action/AddCell";

const CellList: React.FC = () => {
  const cells: Cell[] = useTypedSelector(({ cells: { order, data } }) =>
    order.map((id: string) => data[id])
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCellsAsync());
  }, [dispatch]);

  const renderedCells = cells.map((cell) => (
    <Fragment key={cell.id}>
      <CellListItem cell={cell} />
      <AddCell previousCellId={cell.id} />
    </Fragment>
  ));

  return (
    <div className="cell-list">
      <AddCell forceVisible={cells.length === 0} />
      {renderedCells}
    </div>
  );
};

export default CellList;
