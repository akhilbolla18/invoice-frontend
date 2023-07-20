// src/App.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import { Delete, Edit } from "@material-ui/icons";
import { format } from "date-fns";

function App() {
  const [invoices, setInvoices] = useState([]);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceAmount, setInvoiceAmount] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(new Date());
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [filterStartDate, setFilterStartDate] = useState(null);
  const [filterEndDate, setFilterEndDate] = useState(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await axios.get("http://localhost:8081/api/invoice");
      setInvoices(response.data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };

  const handleCreateInvoice = async () => {
    try {
      await axios.post("http://localhost:8081/api/invoice", {
        invoiceNumber,
        invoiceAmount: parseFloat(invoiceAmount),
        invoiceDate,
      });
      fetchInvoices();
      resetForm();
    } catch (error) {
      console.error("Error creating invoice:", error);
    }
  };

  const handleDeleteInvoice = async (number) => {
    try {
      await axios.delete(`http://localhost:8081/api/invoice/${number}`);
      fetchInvoices();
    } catch (error) {
      console.error("Error deleting invoice:", error);
    }
  };

  const handleFilterInvoices = () => {
    const filtered = invoices.filter(
      (invoice) =>
        new Date(invoice.invoiceDate) >= filterStartDate &&
        new Date(invoice.invoiceDate) <= filterEndDate
    );
    setFilteredInvoices(filtered);
  };

  const resetForm = () => {
    setInvoiceNumber("");
    setInvoiceAmount("");
    setInvoiceDate(new Date());
  };

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Invoice Dashboard
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={3}>
          <TextField
            label="Invoice Number"
            variant="outlined"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            label="Invoice Amount"
            variant="outlined"
            value={invoiceAmount}
            onChange={(e) => setInvoiceAmount(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            label="Invoice Date"
            type="date"
            variant="outlined"
            value={format(invoiceDate, "yyyy-MM-dd")}
            onChange={(e) => setInvoiceDate(new Date(e.target.value))}
            fullWidth
          />
        </Grid>
        <Grid item xs={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateInvoice}
          >
            Create Invoice
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={2} alignItems="center">
        <Grid item xs={3}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Start Date</InputLabel>
            <Select
              value={filterStartDate || ""}
              onChange={(e) => setFilterStartDate(e.target.value)}
              label="Start Date"
            >
              {invoices.map((invoice) => (
                <MenuItem key={invoice._id} value={invoice.invoiceDate}>
                  {format(new Date(invoice.invoiceDate), "yyyy-MM-dd")}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={3}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>End Date</InputLabel>
            <Select
              value={filterEndDate || ""}
              onChange={(e) => setFilterEndDate(e.target.value)}
              label="End Date"
            >
              {invoices.map((invoice) => (
                <MenuItem key={invoice._id} value={invoice.invoiceDate}>
                  {format(new Date(invoice.invoiceDate), "yyyy-MM-dd")}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleFilterInvoices}
          >
            Filter Invoices
          </Button>
        </Grid>
        <Grid item xs={3}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setFilteredInvoices([])}
          >
            Clear Filter
          </Button>
        </Grid>
      </Grid>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Invoice Number</TableCell>
              <TableCell>Invoice Date</TableCell>
              <TableCell>Invoice Amount</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(filteredInvoices.length > 0 ? filteredInvoices : invoices).map(
              (invoice) => (
                <TableRow key={invoice._id}>
                  <TableCell>{invoice.invoiceNumber}</TableCell>
                  <TableCell>
                    {format(new Date(invoice.invoiceDate), "yyyy-MM-dd")}
                  </TableCell>
                  <TableCell>{invoice.invoiceAmount}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="primary">
                      <Edit />
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleDeleteInvoice(invoice.invoiceNumber)}
                    >
                      <Delete />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default App;
