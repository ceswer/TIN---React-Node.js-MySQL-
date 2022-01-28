import React, { useState, useEffect } from "react";
import { NavLink as Link, useParams } from "react-router-dom"
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
                    <label htmlFor="drug_id">{t('drug')}</label>
                    <Link to={`/drugs/details/${doc.drug.id}`}>
                        <input type="text" name="drug_id" id="Drug" defaultValue={doc.drug.name} disabled className="presc-link"/>
                    </Link>
                </div>

                <div className="grid" >
                    <label htmlFor="doctor_id">{t('doctor')}</label>
                    <Link to={`/doctors/details/${doc.doctor.id}`} >
                        <input type="text" name="doctor_id" id="Doctor" defaultValue={doc.doctor.person.name + ' ' + doc.doctor.person.surname} disabled className="presc-link"/>
                    </Link>
                </div>

                <div className="grid">
                    <label htmlFor="patient">{t('patient')}</label>
                    <Link to={`/patients/details/${doc.patient.id}`}>
                        <input type="text" name="patient_id" id="Patient" defaultValue={doc.patient.person.name + ' ' + doc.patient.person.surname} disabled className="presc-link"/>
                    </Link>
                </div>

                <div className="grid">
                    <label htmlFor="dateOfPrescription">{t('dateOfPrescription')}</label>
                    <input type="text" name="dateOfPrescription" id="DateOfPrescription" defaultValue={moment(doc.dateOfPrescription).format('YYYY-MM-DD')} disabled />
                </div>

                <div className="grid">
                    <label htmlFor="note">{t('note')}</label>
                    <input type="text" name="note" id="Note" defaultValue={doc.note} disabled />
                </div>

                <div className="grid">
                    <label htmlFor="dosage">{t('dosage')}</label>
                    <input type="text" name="dosage" id="Dosage" defaultValue={doc.dosage} disabled />
                </div>
            </form>
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
        fetch("http://localhost:3000/api/prescriptions/" + id, { headers: { authorization: `Bearer ${localStorage.getItem('token')}`}})
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
        content = <DoctorDetailsData data={doc} t={t}/>;
    }

    return (
        <main>
            <h2>{t('details')}</h2>
            {content}
            <div className="form-buttons">
                <Link to={"/prescriptions/edit/" + id} className="list-actions-button-edit">{t('edit')}</Link>
                <Link to="/prescriptions" className="list-actions-button-details">{t('back')}</Link>
            </div>
        </main>
    );
}