import { useEffect, useState } from "react";
import { Record } from "../types/models";
import { Box } from "@mui/material";

import PivotTableUI from "react-pivottable/PivotTableUI";
import "react-pivottable/pivottable.css";
import TableRenderers from "react-pivottable/TableRenderers";
import Plot from "react-plotly.js";
import createPlotlyRenderers from "react-pivottable/PlotlyRenderers";
import { parse } from "papaparse";

const PlotlyRenderers = createPlotlyRenderers(Plot);

function ViewerPivot() {
  const [records, setRecords] = useState<Record[]>([]);
  const [pivotState, setPivotState] = useState<any>({});

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
      });
  };

  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        borderRadius: "5px",
        marginTop: "30px",
        marginBottom: "30px",
        overflow: "auto",
        display: "grid",
        border: "1px solid #fff",
      }}
    >
      <PivotTableUI
        data={records}
        onChange={(s) => setPivotState(s)}
        renderers={Object.assign({}, TableRenderers, PlotlyRenderers)}
        {...pivotState}
      />
    </Box>
  );
}

export default ViewerPivot;
