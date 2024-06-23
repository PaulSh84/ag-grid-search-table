import { ColDef, ColGroupDef } from 'ag-grid-community';
import './App.css';
import { AgGridReact, CustomCellRendererProps } from 'ag-grid-react';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import React, { useEffect, useMemo, useRef, useState } from 'react';

interface IRow {
  make: string;
  model: string;
  price: number;
}

const handleJsonCopy = (value: string) => {
  navigator.clipboard
    .writeText(value)
    .then(() => {
      window.alert('Content copied: ' + value);
    })
    .catch((error) => {
      window.alert('Failed to copy. logged error to console');
      console.log(error);
    });
};

const simpleComp: React.FC<CustomCellRendererProps> = ({ value }) => {
  return (
    <div>
      <span>{value}</span>
      <span className="copy-to-clipboard" onClick={() => handleJsonCopy(value)}>
        <img
          style={{ width: 15, cursor: 'pointer' }}
          alt="Copy to Clipboard"
          src="./copy.svg"
        />
      </span>{' '}
    </div>
  );
};

const updateButtonHandler = (): void => {
  window.alert('click worked');
};

const updateButton: React.FC<CustomCellRendererProps> = (props) => {
  
  const updateButtonHandler = () => {
    const newPrice = Math.floor(Math.random() * 100000);
    props.node.setDataValue('price', newPrice);
  };

  const updateButtonOrNoUpdateButton = () => {}


  return (
    <div>
      <span>{props.value}</span>
      <button className="updateBtn" onClick={updateButtonHandler}>
        CAI Update
      </button>
    </div>
  );
};

function App() {
  // const gridRef = useRef<AgGridReact>(null);

  const [rowData, setRowData] = useState<IRow[]>([]);

  const columnDefs: ColDef<IRow>[] | ColGroupDef<IRow>[] = [
    {
      headerName: 'Car Search',
      children: [
        { field: 'make', cellRenderer: simpleComp },
        { field: 'model' },
        // {
        //   field: 'price',
        //   valueFormatter: (params) => {
        //     return '$' + params.value.toLocaleString();
        //   },
        {
          field: 'price',
          editable: true,
          cellRenderer: updateButton,
        },
      ],
    },
  ];

  const defaultColDefs = useMemo(
    () => ({
      sortable: true,
      filter: true,
      // editable: true,
      floatingFilter: true,
    }),
    []
  );

  useEffect(() => {
    fetch('https://www.ag-grid.com/example-assets/row-data.json')
      .then((result) => result.json())
      .then((rowData) => setRowData(rowData));
  }, []);

  return (
    <div className="ag-theme-alpine" style={{ height: 500 }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDefs}
        onCellValueChanged={(event) =>
          console.log(`New Cell Value: ${event.value}`)
        }
        onSelectionChanged={(e) => console.log(`row is changed`)}
        rowSelection="multiple"
        animateRows={true}
        pagination={true}
      />
    </div>
  );
}

export default App;
