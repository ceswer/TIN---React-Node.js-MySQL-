import React, { useState, useEffect } from "react";
import { NavLink as Link, useLocation, useParams, useNavigate } from "react-router-dom"
import EmptyList from "../fragments/EmptyList";
import moment from "moment";
import { useTranslation } from "react-i18next";

function DoctorDetailsData(props) {
    const t = props.t;
    const doc = props.data;
    return (
        <React.Fragment>
            <form className="form">
                <input type="hidden" name="id" defaultValue={doc.id} />

                <div className="grid">
                    <label htmlFor="email">{t('email')}</label>
                    <input type="text" name="email" id="Email" defaultValue={doc.person.email} disabled />
                    <span id="errorName"></span>
                </div>

                <div className="grid">
                    <label htmlFor="name">{t('name')}</label>
                    <input type="text" name="name" id="Name" defaultValue={doc.person.name} disabled />
                    <span id="errorName"></span>
                </div>

                <div className="grid">
                    <label htmlFor="middleName">{t('middleName')}</label>
                    <input type="text" name="middleName" id="MiddleName" defaultValue={doc.person.middleName} disabled />
                    <span id="errorMiddleName"></span>
                </div>

                <div className="grid">
                    <label htmlFor="surname">{t('surname')}</label>
                    <input type="text" name="surname" id="Surname" defaultValue={doc.person.surname} disabled />
                    <span id="errorSurname"></span>
                </div>

                <div className="grid">
                    <label htmlFor="dateOfBirth">{t('dateOfBirth')}</label>
                    <input type="date" name="dateOfBirth" id="DateOfBirth" defaultValue={moment(Date(doc.person.dateOfBirth)).format('YYYY-MM-DD')} disabled />
                    <span id="errorDateOfBirth"></span>
                </div>

                <div className="grid">
                    <label htmlFor="address">{t('address')}</label>
                    <input type="text" name="address" id="Address" defaultValue={doc.person.address} disabled />
                    <span id="errorAddress"></span>
                </div>
                <div className="grid">
                    <label htmlFor="position">{t('phoneNumber')}</label>
                    <input type="text" name="phoneNumber" id="Position" defaultValue={doc.phoneNumber} disabled />
                    <span id="errorPosition"></span>
                </div>
                <div className="grid">
                    <label htmlFor="dateOfAcceptance">{t('dateOfRegistration')}</label>
                    <input type="date" name="dateOfRegistration" id="DateOfAcceptance" defaultValue={moment(Date(doc.dateOfRegistration)).format('YYYY-MM-DD')} disabled />
                    <span id="errorDateOfAcceptance"></span>
                </div>

                <div className="form-buttons">
                    <Link to={"/patients/edit/" + doc.id} className="list-actions-button-edit">{t('edit')}</Link>
                </div>
            </form>

            <h2>{t('prescriptions')}</h2>
            {doc.prescriptions.length !== 0 ?
                (<table className="table-list">
                    <caption></caption>
                    <thead>
                        <tr>
                            <th scope="col">Id</th>
                            <th scope="col">{t('dateOfPrescription')}</th>
                            <th className="hide" scope="col">{t('note')}</th>
                            <th scope="col">{t('dosage')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(doc.prescriptions.map(presc => (
                            <tr key={presc.id}>
                                <td><Link to={"/prescriptions/details/" + presc.id}>{presc.id}</Link></td>
                                <td>{moment(presc.dateOfPrescription).format('YYYY-MM-DD')}</td>
                                <td>{presc.note}</td>
                                <td>{presc.dosage}</td>
                            </tr>
                        )))}
                    </tbody>
                </table>) : (<EmptyList />)}
        </React.Fragment>
    );
}


export default function DoctorDetails() {
    const { t } = useTranslation();
    let params = useParams();
    let [id, setId] = useState(parseInt(params.id));
    let [doc, setDoc] = useState(null);
    let [error, setError] = useState(null);
    let [isLoaded, setIsLoaded] = useState(false);
    let [message, setMessage] = useState(null);

    useEffect(() => {
        let json = localStorage.getItem('json');
        json = JSON.parse(json);
        if (localStorage.getItem('user') === 'user' && json.patient.id != id) {
            fetch("http://localhost:3000/api/patients/" + json.patient.id, { headers: { authorization: `Bearer ${localStorage.getItem('token')}` } })
                .then(res => res.json())
                .then(data => {
                    if (data.message) {
                        setDoc(null);
                        setMessage(data.message);
                    } else {
                        setDoc(data);
                        setMessage(null);
                    }
                    setIsLoaded(true);
                }, err => {
                    setIsLoaded(true);
                    setError(err);
                });
        } else 
            fetch("http://localhost:3000/api/patients/" + id, { headers: { authorization: `Bearer ${localStorage.getItem('token')}` } })
                .then(res => res.json())
                .then(data => {
                    if (data.message) {
                        setDoc(null);
                        setMessage(data.message);
                    } else {
                        setDoc(data);
                        setMessage(null);
                    }
                    setIsLoaded(true);
                }, err => {
                    setIsLoaded(true);
                    setError(err);
                });
    }, []);

    let content;

    if (error) {
        content = <p>{t('error') + " " + error.message}</p>;
    } else if (!isLoaded) {
        content = <p>{t('loading')}</p>;
    } else if (message) {
        content = <p>{message}</p>;
    } else {
        content = <DoctorDetailsData data={doc} t={t} />;
    }

    return (
        <main>
            <h2>{t('details')}</h2>
            {content}
            <div className="form-buttons">
                {localStorage.getItem('user') === 'user' ? "" : <Link to="/patients" className="list-actions-button-details">{t('back')}</Link>}
            </div>
        </main>
    );
}