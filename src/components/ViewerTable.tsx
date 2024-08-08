import { useEffect, useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { Box, CircularProgress, useTheme } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import { Filter, Record } from "../types/models";
import { parse } from "papaparse";
import ViewerPivot from "./ViewerPivot";
import ViewerChart from "./ViewerChart";

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
  const [filterModel, setFilterModel] = useState<Filter[]>([]);

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
            id: row["id"] || uuidv4(),
            created_dt: row["created_dt"],
            data_source_modified_dt: row["data_source_modified_dt"],
            entity_type: row["entity_type"],
            operating_status: row["operating_status"],
            legal_name: row["legal_name"],
            dba_name: row["dba_name"],
            physical_address: row["physical_address"],
            p_street: row["p_street"],
            p_city: row["p_city"],
            p_state: row["p_state"],
            p_zip_code: row["p_zip_code"],
            phone: row["phone"],
            mailing_address: row["mailing_address"],
            m_street: row["m_street"],
            m_city: row["m_city"],
            m_state: row["m_state"],
            m_zip_code: row["m_zip_code"],
            usdot_number: row["usdot_number"],
            mc_mx_ff_number: row["mc_mx_ff_number"],
            power_units: row["power_units"],
            mcs_150_form_date: row["mcs_150_form_date"],
            out_of_service_date: row["out_of_service_date"],
            state_carrier_id_number: row["state_carrier_id_number"],
            duns_number: row["duns_number"],
            drivers: row["drivers"],
            mcs_150_mileage_year: row["mcs_150_mileage_year"],
            credit_score: row["credit_score"],
            record_status: row["record_status"],
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

  const handleFilterModelChange = (model: any) => {
    const filters = model.items.map((item: any) => {
      return {
        field: item.field,
        operator: item.operator,
        value: item.value,
      };
    });
    setFilterModel(filters);
  };

  const columns: GridColDef[] = [
    { field: "created_dt", headerName: "Created Date", width: 200 },
    {
      field: "data_source_modified_dt",
      headerName: "Modified Date",
      width: 200,
    },
    { field: "entity_type", headerName: "Entity Type", width: 200 },
    { field: "operating_status", headerName: "Operating Status", width: 200 },
    { field: "legal_name", headerName: "Legal Name", width: 200 },
    { field: "dba_name", headerName: "DBA Name", width: 200 },
    { field: "physical_address", headerName: "Physical Address", width: 200 },
    { field: "p_street", headerName: "P Street", width: 200 },
    { field: "p_city", headerName: "P City", width: 150 },
    { field: "p_state", headerName: "P State", width: 150 },
    { field: "p_zip_code", headerName: "P Zip Code", width: 150 },
    { field: "phone", headerName: "Phone", width: 150 },
    { field: "mailing_address", headerName: "Mailing Address", width: 200 },
    { field: "m_street", headerName: "M Street", width: 200 },
    { field: "m_city", headerName: "M City", width: 150 },
    { field: "m_state", headerName: "M State", width: 150 },
    { field: "m_zip_code", headerName: "M Zip Code", width: 150 },
    { field: "usdot_number", headerName: "USDOT Number", width: 150 },
    { field: "mc_mx_ff_number", headerName: "MC/MX/FF Number", width: 150 },
    { field: "power_units", headerName: "Power Units", width: 150 },
    { field: "mcs_150_form_date", headerName: "MCS-150 Form Date", width: 150 },
    {
      field: "out_of_service_date",
      headerName: "Out of Service Date",
      width: 150,
    },
    {
      field: "state_carrier_id_number",
      headerName: "State Carrier ID Number",
      width: 150,
    },
    { field: "duns_number", headerName: "DUNS Number", width: 150 },
    { field: "drivers", headerName: "Drivers", width: 150 },
    {
      field: "mcs_150_mileage_year",
      headerName: "MCS-150 Mileage Year",
      width: 150,
    },
    { field: "credit_score", headerName: "Credit Score", width: 150 },
    { field: "record_status", headerName: "Record Status", width: 150 },
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
      {loading ? (
        <Box>
          <CircularProgress />
        </Box>
      ) : records.length === 0 ? (
        <Box>No records found.</Box>
      ) : (
        <>
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
            onFilterModelChange={handleFilterModelChange}
          />
          <ViewerChart records={records} filter={filterModel} />
          <ViewerPivot records={records} />
        </>
      )}
    </Box>
  );
}

export default Viewer;
