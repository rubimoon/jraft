import "./TextEditor.css";
import MDEditor from "@uiw/react-md-editor";
import { useEffect, useRef, useState } from "react";
import { updateCellAsync } from "../state/cellsSlice";
import { useAppDispatch } from "../../../app/state/configureStore";
import { Cell } from "../models/cell";

interface TextEditorProps {
  cell: Cell;
}
const TextEditor: React.FC<TextEditorProps> = ({ cell }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [editting, setEditting] = useState(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (
        ref.current &&
        event.target &&
        ref.current.contains(event.target as Node)
      ) {
        return;
      }
      setEditting(false);
    };
    document.addEventListener("click", listener, { capture: true });

    return () => {
      document.removeEventListener("click", listener, { capture: true });
    };
  }, []);

  if (editting) {
    return (
      <div className="text-editor" ref={ref}>
        <MDEditor
          value={cell.content}
          onChange={(v) => {
            dispatch(updateCellAsync({ id: cell.id, content: v ?? "" }));
          }}
        />
      </div>
    );
  }
  return (
    <div
      className="text-editor card"
      onClick={() => {
        setEditting(true);
      }}
    >
      <div className="card-content">
        <MDEditor.Markdown source={cell.content || "Click to edit"} />
      </div>
    </div>
  );
};

export default TextEditor;
