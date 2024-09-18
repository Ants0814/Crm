import { createContext, useContext, useState } from 'react';

const HomeContext = createContext();

const HomeProvider = ({ children }) => {
  const [lotGridRows, setLotGridRows] = useState('');

  return (
    <HomeContext.Provider value={
      { lotGridRows, setLotGridRows }
    }>
      {children}
    </HomeContext.Provider>
  );
};

const HomeConsumer = ({ children }) => {
  const value = useContext(HomeContext);

  return (
    <div>
      Lot grid rows: {value.lotGridRows}
    </div>
  );
};

export { HomeProvider, HomeConsumer, HomeContext };
