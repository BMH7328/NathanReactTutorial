import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

export default function Home() {
  const [incomeList, setIncomeList] = useState([]);
  const [expensesList, setExpensesList] = useState([]);

  useEffect(() => {
    // 1. get the expensess from local storage
    const expenses = JSON.parse(localStorage.getItem("expenses"));
    // 2. check if there is a data in local storage or not
    if (expenses) {
      setExpensesList(expenses);
    }
  }, []);

  useEffect(() => {
    // 1. get the incomes from local storage
    const incomes = JSON.parse(localStorage.getItem("incomes"));
    // 2. check if there is a data in local storage or not
    if (incomes) {
      setIncomeList(incomes);
    }
  }, []);

  // method 1
  // const calculateTotalIncome = () => {
  //   let total = 0;
  //   incomeList.forEach((i) => {
  //     total += parseInt(i.amount);
  //   });
  //   return total;
  // };

  // method 2
  const totalIncome = useMemo(() => {
    let total = 0;
    incomeList.forEach((i) => {
      total += parseInt(i.amount);
    });
    return total;
  }, [incomeList]);

  const calculateTotalExpenses = () => {
    let total = 0;
    expensesList.forEach((i) => {
      total += parseInt(i.amount);
    });
    return total;
  };

  return (
    <div
      className="container mt-5 mx-auto"
      style={{
        maxWidth: "800px",
      }}
    >
      <Card>
        <Card.Body>
          <Card.Title>Summary Dashboard</Card.Title>
          <Card.Text>
            <p>This is the summary of your personal budget</p>
            <p>Total Income: ${totalIncome}</p>
            <p>Total Expenses: ${calculateTotalExpenses()}</p>
            <p>Balance: ${totalIncome - calculateTotalExpenses()}</p>
          </Card.Text>
          <Link to="/income" className="btn btn-primary me-2">
            Add Income
          </Link>
          <Button as={Link} to="/expenses" variant="dark">
            Add Expenses
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
}

