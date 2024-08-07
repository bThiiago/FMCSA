import { useState } from "react";
import { Record } from "../types/models";
import { Box } from "@mui/material";

import PivotTableUI from "react-pivottable/PivotTableUI";
import "react-pivottable/pivottable.css";
import TableRenderers from "react-pivottable/TableRenderers";
import Plot from "react-plotly.js";
import createPlotlyRenderers from "react-pivottable/PlotlyRenderers";

const PlotlyRenderers = createPlotlyRenderers(Plot);

const ViewerPivot = ({ records }: { records: Record[] }) => {
  const [pivotState, setPivotState] = useState<any>({});

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
};

export default ViewerPivot;
