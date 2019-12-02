import React from 'react';
import styles from './App.module.css';
import Map from './features/map/Map';
import { initialState, reducer } from './state';
import { StateProvider } from './state/provider';
import List from './features/list/List';


function App() {
    return (
        <StateProvider initialState={initialState} reducer={reducer}>
            <div className={styles.container}>
                <List />
                <Map />
            </div>
        </StateProvider >

    );
}

export default App;
