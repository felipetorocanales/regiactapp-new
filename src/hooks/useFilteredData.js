import { useState, useEffect } from 'react';

const useFilteredData = (data, startDate, endDate, selectedUser) => {
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const filterData = () => {
      return data.filter(item => 
        item.fechaIni >= startDate &&
        item.fechaIni <= endDate &&
        (selectedUser ? item.userEmail === selectedUser : true)
      );
    };

    setFilteredData(filterData());
  }, [data, startDate, endDate, selectedUser]);

  return filteredData;
};

export default useFilteredData;