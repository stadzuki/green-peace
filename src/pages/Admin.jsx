import axios from "axios";
import React from "react";
import CardCompany from "../components/CardCompany/CardCompany";

let validCompany = {};
const url = 'https://38d6-188-119-45-172.ngrok.io';

function Admin() {
    const [companies, setCompanies] = React.useState([])
    const [companyIndex, setCompanyIndex] = React.useState(0);
    
    React.useEffect(() => {
        if(companies.length <= 0) {
            getMarkers()
        }
    })

    function getMarkers() {
        axios.get(`${url}/api/Company/GetCompaniesInAdminPanel`)
            .then((response) => {
                console.log(response.data);
                setCompanies(response.data);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    const nextCard = async () => {
        if(companyIndex > companies.length - 1) return 1;
        setCompanyIndex((prev) => prev += 1)
    }

    const acceptCompany = async () => {
        validCompany = {id: companies[companyIndex].id}

        axios.post(`${url}/api/Company/ApproveCompany/${validCompany.id}`)
            .then((resp) => {
                console.log(resp);
            })
            .catch((error) => {
                console.log(error);
            })

        nextCard();
    }

    const dismissCompany = async () => {
        validCompany = {id: companies[companyIndex].id}

        axios.post(`${url}/api/Company/DeclineCompany/${validCompany.id}`)
            .then((resp) => {
                console.log(resp);
            })
            .catch((error) => {
                console.log(error);
            })

        nextCard();
    }

    return (
        <div className="adminPage">
            <h3>Список команий на модерацию:</h3>
            {companies.length > 0 && companies.length - 1 >= companyIndex 
                ? <div className="compayHandle">
                    {companies.length > 0 ? <CardCompany company={companies[companyIndex]}/> : ''}
                    <div className="btnWrapper">
                        <div className="adminBtn acceptCompany" onClick={acceptCompany}>Принять</div>
                        <div className="adminBtn dismissCompany" onClick={dismissCompany}>Отклонить</div>
                    </div>
                </div>
                : ''}
        </div>
    )
}

export default Admin;