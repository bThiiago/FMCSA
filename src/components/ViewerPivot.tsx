import { useEffect, useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import PivotTableUI from "react-pivottable/PivotTableUI";
import "react-pivottable/pivottable.css";
import { Record } from "../types/models";
import { Box } from "@mui/material";

function ViewerPivot() {
  const [records, setRecords] = useState<Record[]>([]);
  const [pivotState, setPivotState] = useState<any>({});
  const [filteredRecords, setFilteredRecords] = useState<Record[]>([]);
  const [dataKey, setDataKey] = useState(0);

  useEffect(() => {
    fetchRecords();
  }, []);

  useEffect(() => {
    filterRecords();
  }, [records]);

  const fetchRecords = () => {
    fetch("/FMCSA_records.csv")
      .then((response) => response.text())
      .then((data) => {
        const parsedData = parseCSVData(data);
        setRecords(parsedData);
      })
      .catch((error) => {
        console.error("Error fetching records:", error);
      });
  };

  const parseCSVData = (data: string): Record[] => {
    return data
      .split("\n")
      .slice(1)
      .map((row) => {
        const columns = row.split(",");
        return {
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
  };

  const filterRecords = () => {
    const filteredData = records.map((record: any) =>
      Object.keys(record)
        .filter((key) => columns.some((col) => col.field === key))
        .reduce((obj: any, key) => {
          obj[key] = record[key];
          return obj;
        }, {} as Record)
    );
    setDataKey((prevKey) => prevKey + 1);
    setFilteredRecords(filteredData);
    setPivotState((prevState: any) => ({ ...prevState, data: filteredData }));
  };

  const columns: GridColDef[] = [
    { field: "created_dt", headerName: "Created Date" },
    { field: "data_source_modified_dt", headerName: "Modified Date" },
    { field: "entity_type", headerName: "Entity Type" },
    { field: "operating_status", headerName: "Operating Status" },
    { field: "legal_name", headerName: "Legal Name" },
    { field: "dba_name", headerName: "DBA Name" },
    { field: "physical_address", headerName: "Physical Address" },
    { field: "phone", headerName: "Phone" },
    { field: "usdot_number", headerName: "USDOT Number" },
    { field: "mc_mx_ff_number", headerName: "MC/MX/FF Number" },
    { field: "power_units", headerName: "Power Units" },
    { field: "out_of_service_date", headerName: "Out of Service Date" },
  ];

  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        borderRadius: "5px",
        padding: "10px",
        marginTop: "30px",
        marginBottom: "30px",
        overflow: "auto",
      }}
    >
      <PivotTableUI
        key={dataKey}
        data={filteredRecords}
        onChange={(s) => setPivotState(s)}
        {...pivotState}
      />
    </Box>
  );
}

export default ViewerPivot;
