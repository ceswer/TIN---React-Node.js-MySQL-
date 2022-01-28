import React, { useState, useEffect } from "react";
import { NavLink as Link, useLocation } from "react-router-dom";
import moment from 'moment';
import { withTranslation, useTranslation } from "react-i18next";
import EmptyList from "../fragments/EmptyList";

function Doctors() {
    const { t } = useTranslation();
    const location = useLocation();

    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [prescriptions, setPrescriptions] = useState([]);
    const [notice, setNotice] = useState(location.state && location.state.notice ? location.state.notice : null);
    const [showButton, setShowButton] = useState(false);
    const [ids, setIds] = useState(null);
    
    const changeToTrue = async () => {
        setShowButton(false);
        await fetch(`http://localhost:3000/api/prescriptions/${ids}`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }).then(() => {
                getDoctors()
                setNotice(t('deleted'))
                setClassName("notice-show");
            });
    }

    const getDoctors = async () => {
        await fetch("http://localhost:3000/api/prescriptions", { headers: { authorization: `Bearer ${localStorage.getItem('token')}`}})
            .then(res => res.json())
            .then(docs => {
                setPrescriptions(docs)
            }, err => {
                setError(err)
            }).then(() => setIsLoaded(true));
    }

    useEffect(() => {
        if (!isLoaded)
            getDoctors();
    }, []);

    const deleteDoctor = async (identifier) => {
        setNotice(t('sure'));
        setShowButton(true);
        setIds(identifier);
        setClassName('notice-show');
    }

    let content;
    if (error) {
        content = <p>{t('error') + " " + error}</p>
    } else if (!isLoaded) {
        content = <p>{t('loading')}</p>
    } else content = <DoctorListTable doctors={prescriptions} t={t} callback={deleteDoctor} />

    let [className, setClassName] = useState(notice ? "notice-show" : "notice-hide");
    const decline = () => {
        setClassName("notice-hide");
    }
    const button = <button onClick={changeToTrue} className="list-actions-button-delete">{t('yes')}</button>;
    return (
        <main>
            <h2>{t('prescriptions')}</h2>
            <div className={className}>
                <div className="notice-content">
                    <p>{notice}</p>
                    <div className="btns">
                        {showButton ? button : ""}
                        <button className="list-actions-button-delete green" onClick={decline}>{t('back')}</button>
                    </div>
                </div>
            </div>
            {isLoaded && prescriptions.length != 0 ? content : <EmptyList></EmptyList>}
            <div className="div-button-add">
                <Link to="/prescriptions/add" className="button-add">{t('add')}</Link>
            </div>
        </main>
    );
}


function DoctorListTable(props) {
    const doctors = props.doctors;
    const t = props.t;
    const deleteDoctor = props.callback;
    return (
        <table className="table-list">
            <caption></caption>
            <thead>
                <tr>
                    <th scope="col">ID</th>
                    <th scope="col" className="hide">{t('patient')}</th>
                    <th scope="col" className="hide">{t('doctor')}</th>
                    <th scope="col" className="hide">{t('drug')}</th>
                    <th scope="col">{t('dateOfPrescription')}</th>
                    <th scope="col">{t('dosage')}</th>
                    <th scope="col">{t('actions')}</th>
                </tr>
            </thead>
            <tbody>
                {doctors.map(doc => <DoctorListTableRow doc={doc} t={t} callback={deleteDoctor} key={doc.id} />)}
            </tbody>
        </table>
    );
}

function DoctorListTableRow(props) {
    const doc = props.doc;
    const t = props.t;
    const deleteDoctor = props.callback;

    return (
        <tr key={doc.id}>
            <td>{doc.id}</td>
            <td className="hide">
                <Link to={`/patients/details/${doc.patient.id}`} className="presc-link">
                    {doc.patient.person.name + " " + doc.patient.person.surname}
                </Link>
            </td>
            <td className="hide">
                <Link to={`/doctors/details/${doc.doctor.id}`} className="presc-link">
                    {doc.doctor.person.name + " " + doc.doctor.person.surname}
                </Link>
            </td>
            <td className="hide">
                <Link to={`/drugs/details/${doc.drug.id}`} className="presc-link">
                    {doc.drug.name}
                </Link>
            </td>
            <td>{moment(doc.date).format("YYYY-MM-DD")}</td>
            <td>{doc.dosage}</td>
            <td>
                <ul className="list-actions">
                    <li><Link to={"/prescriptions/details/" + doc.id} className="list-actions-button-details">{t('about')}</Link></li>
                    <li><Link to={"/prescriptions/edit/" + doc.id} className="list-actions-button-edit">{t('edit')}</Link></li>
                    <li><button onClick={() => deleteDoctor(doc.id)} className="list-actions-button-delete">{t('delete')}</button></li>
                </ul>
            </td>
        </tr>
    );
}

export default withTranslation()(Doctors);