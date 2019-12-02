import React from "react";
import styles from "./App.module.css";
import Map from "./features/map/Map";
import { initialState, reducer } from "./state";
import { StateProvider } from "./state/provider";
import List from "./features/list/List";
import Export from "./features/export/Export";
import Separator from "./components/Separator";

function App() {
  return (
    <StateProvider initialState={initialState} reducer={reducer}>
      <div className={styles.container}>
        <div className={styles.leftPane}>
          <h1>Cross Country</h1>
          <Separator />
          <List />
          <div className={styles.toolbar}>
            <Export />
          </div>
        </div>
        <div>
          <Map />
        </div>
      </div>
    </StateProvider>
  );
}

export default App;
