import { useEffect, useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { Box, Typography, useTheme } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import { Record } from "../types/models";

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport printOptions={{ disableToolbarButton: true }} />
    </GridToolbarContainer>
  );
}

function Viewer() {
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);

  const theme = useTheme();

  useEffect(() => {
    fetch("/FMCSA_records.csv")
      .then((response) => response.text())
      .then((data) => {
        const parsedData = data
          .split("\n")
          .slice(1)
          .map((row) => {
            const columns = row.split(",");
            return {
              id: uuidv4(),
              created_dt: columns[0],
              data_source_modified_dt: columns[1],
              entity_type: columns[2],
              operating_status: columns[3],
              legal_name: columns[4],
              dba_name: columns[5],
              physical_address: columns[6],
              phone: columns[7],
              usdot_number: columns[8],
              mc_mx_ff_number: columns[9],
              power_units: columns[10],
              out_of_service_date: columns[11],
            };
          });
        setRecords(parsedData);
      })
      .catch((error) => {
        console.error("Error fetching records:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const columns: GridColDef[] = [
    { field: "created_dt", headerName: "Created Date", width: 200 },
    {
      field: "data_source_modified_dt",
      headerName: "Modified Date",
      width: 200,
    },
    { field: "entity_type", headerName: "Entity Type", width: 150 },
    { field: "operating_status", headerName: "Operating Status", width: 150 },
    { field: "legal_name", headerName: "Legal Name", width: 200 },
    { field: "dba_name", headerName: "DBA Name", width: 150 },
    { field: "physical_address", headerName: "Physical Address", width: 250 },
    { field: "phone", headerName: "Phone", width: 150 },
    { field: "usdot_number", headerName: "USDOT Number", width: 150 },
    { field: "mc_mx_ff_number", headerName: "MC/MX/FF Number", width: 200 },
    { field: "power_units", headerName: "Power Units", width: 150 },
    {
      field: "out_of_service_date",
      headerName: "Out of Service Date",
      width: 200,
    },
  ];

  return (
    <Box m="1.5rem 2.5rem">
      <Box>
        <Typography
          variant="h2"
          color="primary"
          fontWeight="bold"
          sx={{ mb: "5px" }}
        >
          FMCSA Viewer
        </Typography>
        <Typography variant="h5" color="white">
          Federal Motor Carrier Safety Administration
        </Typography>
      </Box>

      <Box
        mt="30px"
        mb="30px"
        sx={{
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.background.default,
            color: "primary",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.primary.contrastText,
          },
          "& .MuiDataGrid-toolbarContainer": {
            backgroundColor: theme.palette.primary.main,
            "& .MuiButton-root": {
              color: theme.palette.secondary.contrastText,
            },
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: theme.palette.background.default,
          },
        }}
      >
        <DataGrid
          rows={records}
          columns={columns}
          loading={loading}
          slots={{ toolbar: CustomToolbar }}
          pagination
          autoHeight
          pageSizeOptions={[10, 25, 50, 100]}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
        />
      </Box>
    </Box>
  );
}

export default Viewer;
