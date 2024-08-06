import { useEffect, useState } from "react";
import { Record } from "../types/models";
import { Box } from "@mui/material";

import PivotTableUI from "react-pivottable/PivotTableUI";
import "react-pivottable/pivottable.css";
import TableRenderers from "react-pivottable/TableRenderers";
import Plot from "react-plotly.js";
import createPlotlyRenderers from "react-pivottable/PlotlyRenderers";

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
          "Created Date": columns[0],
          "Modified Date": columns[1],
          "Entity Type": columns[2],
          "Operating Status": columns[3],
          "Legal Name": columns[4],
          "DBA Name": columns[5],
          "Physical Address": columns[6],
          Phone: columns[7],
          "USDOT Number": columns[8],
          "MC/MX/FF Number": columns[9],
          "Power Units": columns[10],
          "Out of Service Date": columns[11],
        };
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
