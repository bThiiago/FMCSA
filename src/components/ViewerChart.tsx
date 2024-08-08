import { Box } from "@mui/material";
import { Filter, Record } from "../types/models";
import { BarChart } from "@mui/x-charts";

const ViewerChart = ({
  records,
  filter,
}: {
  records: Record[];
  filter: Filter[];
}) => {
  const countByMonth: { [month: string]: number } = {};
  records.forEach((record) => {
    const outOfServiceDate = new Date(record.out_of_service_date);
    if (isNaN(outOfServiceDate.getTime())) {
      return;
    }

    if (
      filter.length === 0 ||
      (filter[0].field &&
        filter[0].value &&
        filter[0].operator &&
        applyFilter(record, filter[0]))
    ) {
      const year = outOfServiceDate.getFullYear();
      const month = outOfServiceDate.toLocaleString("default", {
        month: "long",
      });
      const key = `${year}-${month}`;
      countByMonth[key] = (countByMonth[key] || 0) + 1;
    }
  });

  function applyFilter(record: Record, filter: Filter): boolean {
    const filterField = filter.field.toLowerCase();
    const filterValue = filter.value ? filter.value.toLowerCase() : "";
    const filterOperator = filter.operator;

    switch (filterOperator) {
      case "contains":
        console.log(record[filterField].toLowerCase().includes(filterValue));
        console.log(record[filterField].toLowerCase(), filterValue);
        return record[filterField].toLowerCase().includes(filterValue);
      case "equals":
        return record[filterField].toLowerCase() === filterValue;
      case "startsWith":
        return record[filterField].toLowerCase().startsWith(filterValue);
      case "endsWith":
        return record[filterField].toLowerCase().endsWith(filterValue);
      case "isEmpty":
        return record[filterField] === "";
      case "isNotEmpty":
        return record[filterField] !== "";
      case "isAnyOf":
        return filterValue.includes(record[filterField].toLowerCase());
      default:
        return true;
    }
  }

  const labels = Object.keys(countByMonth);
  const count = Object.values(countByMonth);

  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        borderRadius: "5px",
        marginTop: "30px",
        marginBottom: "30px",
        marginLeft: "auto",
        overflow: "auto",
        display: "grid",
        border: "1px solid #fff",
      }}
    >
      <BarChart
        height={400}
        series={[{ data: count }]}
        colors={["#1976d2"]}
        xAxis={[
          {
            data: labels,
            scaleType: "band",
          },
        ]}
        yAxis={[
          {
            label: "Out Of Service",
          },
        ]}
      />
    </Box>
  );
};

export default ViewerChart;
