import React from "react";
import styles from "./App.module.css";
import Separator from "./components/Separator";
import Export from "./features/export/Export";
import List from "./features/list/List";
import Map from "./features/map/Map";

function App() {
  return (
    <div className={styles.container}>
      <div className={styles.leftPane}>
        <h1>Cross Country</h1>
        <Separator />
        <List />
        <div className={styles.toolbar}>
          <Export />
        </div>
      </div>
      <div className={styles.rightPane}>
        <Map />
      </div>
    </div>
  );
}

export default App;
