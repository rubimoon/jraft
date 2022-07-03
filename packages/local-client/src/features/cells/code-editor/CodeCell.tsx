import "./CodeCell.css";
import { useEffect } from "react";
import { useTypedSelector } from "../../../app/hooks/use-typed-selector";
import { useCumulativeCode } from "../../../app/hooks/use-cumulative-code";
import { useAppDispatch } from "../../../app/state/configureStore";
import { Cell } from "../models/cell";
import { createBundleAsync } from "./state/bundleSlice";
import CodeEditor from "./CodeEditor";
import Resizable from "./Resizable";
import { updateCellAsync } from "../state/cellsSlice";
import Preview from "./Preview";

interface CodeCellProps {
  cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const dispatch = useAppDispatch();
  const bundle = useTypedSelector((state) => state.bundles[cell.id]);
  const cumulativeCode = useCumulativeCode(cell.id);
  useEffect(() => {
    // bundle could be undefined at the bootup
    if (!bundle) {
      dispatch(createBundleAsync({ cellId: cell.id, input: cumulativeCode }));
      return;
    }
    const timer = setTimeout(async () => {
      dispatch(createBundleAsync({ cellId: cell.id, input: cumulativeCode }));
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cell.id, cumulativeCode, createBundleAsync]);

  return (
    <Resizable direction="vertical">
      <div
        style={{
          height: "calc(100% - 10px)",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Resizable direction="horizontal">
          <CodeEditor
            initialValue={cell.content}
            onChange={(value) =>
              dispatch(updateCellAsync({ id: cell.id, content: value }))
            }
          />
        </Resizable>
        <div className="progress-wrapper">
          {!bundle || bundle.loading ? (
            <div className="progress-cover">
              <progress className="progress is-small is-primary" max="100">
                Loading
              </progress>
            </div>
          ) : (
            <Preview code={bundle.result.code} err={bundle.result.err} />
          )}
        </div>
      </div>
    </Resizable>
  );
};

export default CodeCell;
