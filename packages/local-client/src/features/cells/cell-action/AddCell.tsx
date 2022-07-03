import { useAppDispatch } from "../../../app/state/configureStore";
import { insertCellAfterAsync } from "../state/cellsSlice";
import "./AddCell.css";

interface AddCellProps {
  previousCellId?: string;
  forceVisible?: boolean;
}

const AddCell: React.FC<AddCellProps> = ({ previousCellId, forceVisible }) => {
  const dispatch = useAppDispatch();

  return (
    <div className={`add-cell ${forceVisible && "force-visible"}`}>
      <div className="add-buttons">
        <button
          className="button is-rounded is-primary is-small"
          onClick={() => {
            dispatch(
              insertCellAfterAsync({ previousCellId, cellType: "code" })
            );
          }}
        >
          <span className="icon is-small">
            <i className="fas fa-plus"></i>
          </span>
          <span>Code</span>
        </button>

        <button
          className="button is-rounded is-primary is-small"
          onClick={() => {
            dispatch(
              insertCellAfterAsync({ previousCellId, cellType: "text" })
            );
          }}
        >
          <span className="icon is-small">
            <i className="fas fa-plus"></i>
          </span>
          <span>Text</span>
        </button>
        <div className="divider"></div>
      </div>
    </div>
  );
};

export default AddCell;
