import "./ActionBar.css";
import React from "react";
import { useAppDispatch } from "../../../app/state/configureStore";
import { deleteCellAsync, moveCellAsync } from "../state/cellsSlice";

interface ActionBarProps {
  id: string;
}

const ActionBar: React.FC<ActionBarProps> = ({ id }) => {
  const dispatch = useAppDispatch();
  return (
    <div className="action-bar">
      <button
        className="button is-primary is-small"
        onClick={() => {
          dispatch(moveCellAsync({ id, direction: "up" }));
        }}
      >
        <span className="icon">
          <i className="fas fa-arrow-up"></i>
        </span>
      </button>
      <button
        className="button is-primary is-small"
        onClick={() => {
          dispatch(moveCellAsync({ id, direction: "down" }));
        }}
      >
        <span className="icon">
          <i className="fas fa-arrow-down"></i>
        </span>
      </button>
      <button
        className="button is-primary is-small"
        onClick={() => {
          dispatch(deleteCellAsync({ id }));
        }}
      >
        <span className="icon">
          <i className="fas fa-times"></i>
        </span>
      </button>
    </div>
  );
};
export default ActionBar;
