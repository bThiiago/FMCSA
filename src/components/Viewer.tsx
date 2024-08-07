import { useEffect, useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { Box, useTheme } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import { Record } from "../types/models";
import { parse } from "papaparse";

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
    fetchRecords();
  }, []);

  const fetchRecords = () => {
    fetch("/FMCSA_records.csv")
      .then((response) => response.text())
      .then((data) => {
        const parsedData = parse(data, {
          header: true,
          skipEmptyLines: true,
        }).data.map((row: any) => {
          return {
            id: uuidv4(),
            created_dt: row["created_dt"],
            data_source_modified_dt: row["data_source_modified_dt"],
            entity_type: row["entity_type"],
            operating_status: row["operating_status"],
            legal_name: row["legal_name"],
            dba_name: row["dba_name"],
            physical_address: row["physical_address"],
            phone: row["phone"],
            usdot_number: row["usdot_number"],
            mc_mx_ff_number: row["mc_mx_ff_number"],
            power_units: row["power_units"],
            out_of_service_date: row["out_of_service_date"],
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
  };

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
  );
}

export default Viewer;
