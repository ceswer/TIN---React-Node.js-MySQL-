import Navigation from "./components/fragments/Havigation";
import Header from "./components/fragments/Header";
import Footer from "./components/fragments/Footer";
import Welcome from "./components/main/Welcome";

import Doctors from "./components/main/Doctors";
import DoctorDetails from "./components/doctor/Details";
import DoctorAddForm from "./components/doctor/Form";

import Patients from "./components/main/Patients"
import PatientDetails from "./components/patients/Details";
import PatientAddForm from "./components/patients/Form";

import Prescriptions from "./components/main/Prescriptions";
import PrescriptionDetails from "./components/prescription/Details";
import PrescriptionAddForm from "./components/prescription/Form";

import Drugs from "./components/main/Drugs";
import DrugDetails from "./components/drug/Details";
import DrugAddForm from "./components/drug/Form";

import Signup from './components/main/auth/signup/Signup'
import { BrowserRouter as Router, Routes as Switch, Route } from "react-router-dom"

import React, { useEffect, useState } from "react";

function App() {
  const [Token, setToken] = useState(undefined);
  const [User, setUser] = useState(undefined);
  const [jsn, setJSON] = useState(undefined);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const json = localStorage.getItem('json');
    setJSON(json);
    setUser(user);
    setToken(token);
  })

  const handleLogin = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', data.user.role);
    localStorage.setItem('json', JSON.stringify(data))
    setJSON(JSON.stringify(data));
    setToken(data.token);
    setUser(data.user)
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('json');
    setJSON(undefined);
    setToken(undefined);
    setUser(undefined);
  }

  return (
    <Router>
      <Header />
      <Navigation handleLogout={handleLogout} />
      <Switch>
        <Route exact path="/signup" element={<Signup handleLogin={handleLogin} />} />
        <Route exact path="/login" element={<Signup handleLogin={handleLogin} />} />
        <Route exact path="/" element={<Welcome />} />
      </Switch>
      {Token ? <Switch>

        <Route exact path="/doctors" element={<Doctors />} />
        <Route exact path="doctors/details/:id" element={<DoctorDetails />} />
        {localStorage.getItem('user') !== 'user' ? <Route exact path="doctors/add" element={<DoctorAddForm />} /> : ""}
        {localStorage.getItem('user') !== 'user' ? <Route exact path="doctors/edit/:id" element={<DoctorAddForm />} /> : ""}

        <Route path="/patients" element={<Patients />} />
        <Route exact path="patients/details/:id" element={<PatientDetails />} />
        <Route exact path="patients/edit/:id" element={<PatientAddForm />} />
        
        {localStorage.getItem('user') !== 'user' ? <Route exact path="patients/add" element={<PatientAddForm />} /> : ""}

        <Route path="/drugs" element={<Drugs />} />
        <Route exact path="drugs/details/:id" element={<DrugDetails />} />
        {localStorage.getItem('user') !== 'user' ? <Route exact path="drugs/add" element={<DrugAddForm />} /> : ""}
        {localStorage.getItem('user') !== 'user' ? <Route exact path="drugs/edit/:id" element={<DrugAddForm />} /> : ""}


        {localStorage.getItem('user') !== 'user' ? <Route path="/prescriptions" element={<Prescriptions />} /> : ""}
        {localStorage.getItem('user') !== 'user' ? <Route exact path="prescriptions/details/:id" element={<PrescriptionDetails />} /> : ""}
        {localStorage.getItem('user') !== 'user' ? <Route exact path="prescriptions/add" element={<PrescriptionAddForm />} /> : ""}
        {localStorage.getItem('user') !== 'user' ? <Route exact path="prescriptions/edit/:id" element={<PrescriptionAddForm />} /> : ""}
      </Switch> : ("")}

      <Footer />
    </Router>
  );
}

export default App;