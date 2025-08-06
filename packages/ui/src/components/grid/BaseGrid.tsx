import { AllCommunityModule, ModuleRegistry, themeQuartz } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { themeBalham } from 'ag-grid-community';
const myTheme = themeQuartz.withParams({
  backgroundColor: 'rgb(249, 245, 227)',
  foregroundColor: 'rgb(126, 46, 132)',
  headerTextColor: 'rgb(204, 245, 172)',
  headerBackgroundColor: 'rgb(209, 64, 129)',
  oddRowBackgroundColor: 'rgb(0, 0, 0, 0.03)',
  headerColumnResizeHandleColor: 'rgb(126, 46, 132)',
});

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

export const BaseGrid = ({ data, columns }) => {
  return (
    <div style={{ height: 600 }}>
      <AgGridReact rowData={data} columnDefs={columns} theme={myTheme} />
    </div>
  );
};
