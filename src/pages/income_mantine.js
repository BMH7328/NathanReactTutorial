import { useState, useEffect, useMemo, useRef } from "react";
import { nanoid } from "nanoid";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import { BsTrash } from "react-icons/bs";
import { BiSolidErrorCircle } from "react-icons/bi";
import { notifications } from "@mantine/notifications";
import { TextInput } from "@mantine/core";

export default function Income() {
  const openRef = useRef(null);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);
  const [image, setImage] = useState();
  const [category, setCategory] = useState("");
  const [keywords, setKeywords] = useState("");
  const [filter, setFilter] = useState("");
  const [incomeList, setIncomeList] = useState([]);
  const [checkedList, setCheckedList] = useState([]);
  const [checkAll, setCheckAll] = useState(false);

  useEffect(() => {
    // 1. get the incomes from local storage
    const incomes = JSON.parse(localStorage.getItem("incomes"));
    // 2. check if there is a data in local storage or not
    if (incomes) {
      setIncomeList(incomes);
    }
  }, []);

  const filteredList = useMemo(() => {
    return incomeList
      .filter((i) => (filter === "" ? true : i.category === filter))
      .filter((i) => i.name.toLowerCase().indexOf(keywords.toLowerCase()) >= 0);
  }, [filter, incomeList, keywords]);

  const addIncome = () => {
    // 1. clone the list
    const newincomeList = [...incomeList];

    // 2. make sure name & amount is not empty
    if (name && amount) {
      // 3. push new income
      newincomeList.push({
        id: nanoid(),
        name: name,
        amount: parseInt(amount),
        category: category,
      });

      // 4. save into the local storage & set the new state for incomeList
      setIncomeList(newincomeList);
      localStorage.setItem("incomes", JSON.stringify(newincomeList));

      // 5. clear the fields
      setName("");
      setAmount(0);
    } else {
      notifications.show({
        title: "Please insert the name & amount",
        message: "Thank You!",
        color: "red",
        icon: <BiSolidErrorCircle />,
      });
    }
  };

  const deleteIncome = (id) => {
    // 1. filter the list
    const newincomeList = incomeList.filter((i) => i.id !== id);
    // 2. update to local storage and set new state
    setIncomeList(newincomeList);
    localStorage.setItem("incomes", JSON.stringify(newincomeList));
  };

  const checkBoxAll = (event) => {
    if (event.target.checked) {
      // 1. clone the existing checked list
      const newCheckedList = [];
      incomeList.forEach((i) => {
        newCheckedList.push(i.id);
      });
      setCheckedList(newCheckedList);
      // set checkAll
      setCheckAll(true);
    } else {
      // reset the array
      setCheckedList([]);
      // unset checkall
      setCheckAll(false);
    }
  };

  const checkboxOne = (event, id) => {
    // if is checked
    if (event.target.checked) {
      // 1. clone existing checked list
      const newCheckedList = [...checkedList];
      // 2. push new id into the checked list
      newCheckedList.push(id);
      // 3. update the state
      setCheckedList(newCheckedList);
    } else {
      // 1. remove the id from the checked list
      const newCheckedList = checkedList.filter((i) => i !== id);
      // 2. update the state
      setCheckedList(newCheckedList);
    }
  };

  const deleteCheckedItems = () => {
    // 1. filter the list
    const newincomeList = incomeList.filter((i) => {
      // make sure the id is in the checked list
      if (checkedList && checkedList.includes(i.id)) {
        return false;
      }
      return true;
    });
    // 2. update to local storage and set new state
    setIncomeList(newincomeList);
    localStorage.setItem("incomes", JSON.stringify(newincomeList));
    // 3. unset checkall
    setCheckAll(false);
  };

  const calculateTotal = () => {
    let total = 0;
    incomeList
      .filter((i) => (filter === "" ? true : i.category === filter))
      .forEach((i) => {
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
          <Card.Title>Income</Card.Title>
          <TextInput
            value={keywords}
            placeholder="Type your keyword..."
            onChange={(event) => {
              setKeywords(event.target.value);
            }}
          />
          <Form.Select
            className="mb-4"
            value={filter}
            onChange={(event) => {
              setFilter(event.target.value);
            }}
          >
            <option value="">All categories</option>
            <option value="Food">Food Only</option>
            <option value="Travel">Travel Only</option>
            <option value="Others">Others</option>
          </Form.Select>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>
                  <Form.Check
                    type="checkbox"
                    checked={checkAll}
                    disabled={
                      incomeList && incomeList.length > 0 ? false : true
                    }
                    onChange={(event) => {
                      checkBoxAll(event);
                    }}
                  />
                </th>
                <th>Source</th>
                <th>Category</th>
                <th>Amount</th>
                <th>
                  Actions
                  <Button
                    variant="danger"
                    size="sm"
                    className="ms-2"
                    disabled={
                      checkedList && checkedList.length > 0 ? false : true
                    }
                    onClick={(event) => {
                      event.preventDefault();
                      deleteCheckedItems();
                    }}
                  >
                    <BsTrash />
                  </Button>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredList.length > 0 ? (
                filteredList.map((i) => {
                  return (
                    <tr key={i.id}>
                      <td>
                        <Form.Check
                          checked={
                            checkedList && checkedList.includes(i.id)
                              ? true
                              : false
                          }
                          type="checkbox"
                          onChange={(event) => {
                            checkboxOne(event, i.id);
                          }}
                        />
                      </td>
                      <td>{i.name}</td>
                      <td>{i.category}</td>
                      <td>${i.amount}</td>
                      <td>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={(event) => {
                            event.preventDefault();
                            deleteIncome(i.id);
                          }}
                        >
                          <BsTrash />
                        </Button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={3}>No income added yet.</td>
                </tr>
              )}
              <tr>
                <td>Total</td>
                <td>${calculateTotal()}</td>
                <td></td>
              </tr>
            </tbody>
          </Table>
          <Form>
            <Form.Group className="mb-1 mt-2">
              <Form.Control
                type="text"
                placeholder="Type your income here..."
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-1">
              <Form.Control
                type="number"
                placeholder="Type your amount here..."
                value={amount}
                min={0}
                onChange={(event) => setAmount(event.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Select
                value={category}
                onChange={(event) => {
                  setCategory(event.target.value);
                }}
              >
                <option>Select a Category</option>
                <option value="Food">Food</option>
                <option value="Travel">Travel</option>
                <option value="Others">Others</option>
              </Form.Select>
            </Form.Group>
            <Button
              variant="primary"
              size="sm"
              onClick={(event) => {
                event.preventDefault();
                addIncome();
              }}
            >
              Add New
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <Link to="/" className="pt-2 text-center">
        Go back to Dashboard
      </Link>
    </div>
  );
}
