import { Provider } from "react-redux";
import CellList from "../../features/cells/cell-list/CellList";
import { store } from "../state/configureStore";

const App = () => {
  return (
    <Provider store={store}>
      <CellList />
    </Provider>
  );
};

export default App;
