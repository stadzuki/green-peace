import axios from "axios";
import React from "react";
import CardCompany from "../components/CardCompany/CardCompany";

let validCompany = {};
const url = 'https://92a5-188-119-45-172.ngrok.io';

function Admin() {
    const [companies, setCompanies] = React.useState([])
    const [companyIndex, setCompanyIndex] = React.useState(0);
    const [currentCompany, setCurrentCompany] = React.useState({})
    
    const categoryListString = '1 - бумага, 2 - стекло, 3 - пластик,\
        \n4 - металл 5 - одежда 6 - иное,\
        \n7 - опасные отходы, 8 - батарейки, 9 - лампочки,\
        \n10 - бытовая техника, 11 - тетра пак, 12 - крышечки,\
        \n13 - шины\n\n';

    React.useEffect(() => {
        if(companies.length <= 0) {
            getMarkers()
        }
    })

    const changeInfo = (message, key) => {
        const modal = prompt(message, currentCompany[key])
        if(modal !== null && modal !== currentCompany[key]) {
            if(key === 'categoriesId') {
                const categories = modal;
                if(categories.search(/^([\d]{1}\,?\s?)+$/) !== -1) {
                    setCurrentCompany(prev => ({
                        ...prev,
                        [key]: modal.split(',')
                    }))
                } else {
                    alert('Категории указаны некорректно')
                }
                return 1;
            }

            setCurrentCompany(prev => ({
                ...prev,
                [key]: modal
            }))
        }
    }

    function getMarkers() {
        // axios.get(`https://api.npoint.io/3d5795e1a47fe9cb1c83`)
        axios.get(`${url}/api/Company/GetCompaniesInAdminPanel`)
            .then((response) => {
                console.log(response);
                setCurrentCompany(response.data[0]);
                setCompanies(response.data);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    const nextCard = () => {
        if(companyIndex > companies.length - 1) return 1;
        setCompanyIndex((prev) => prev += 1)
        setCurrentCompany(companies[companyIndex])
    }

    const acceptCompany = () => {
        validCompany = {id: companies[companyIndex].id}

        axios.post(`${url}/api/Company/ApproveCompany/${validCompany.id}`)
            .then((resp) => {
                console.log(resp);
            })
            .catch((error) => {
                console.log(error);
            })

        axios.put(`${url}/api/Company/UpdateCompany`, currentCompany)

        nextCard();
    }

    const dismissCompany = () => {
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
                    {companies.length > 0 ? <CardCompany company={currentCompany} isCommentVisible={false}/> : ''}
                    <div className="btnWrapper">
                        <div className="btnControls">
                            <div className="adminBtn adminBtnControls" 
                                onClick={() => changeInfo('Изменить название', 'title')}
                            >
                                Изменить название
                            </div>
                            <div className="adminBtn adminBtnControls" 
                                onClick={() => changeInfo('Изменить фото', 'imageUrl')}
                            >
                                Изменить фото
                            </div>
                            <div className="adminBtn adminBtnControls" 
                                onClick={() => changeInfo('Изменить город', 'city')}
                            >
                                Изменить город
                            </div>
                            <div className="adminBtn adminBtnControls" 
                                onClick={() => changeInfo('Изменить адрес', 'address')}
                            >
                                Изменить адрес
                            </div>
                            <div className="adminBtn adminBtnControls" 
                                onClick={() => changeInfo('Изменить категории, укажите номера через запятую.\nДоступные категории:\n\n' + categoryListString, 'categoriesId')}
                            >
                                Изменить категории
                            </div>
                            <div className="adminBtn adminBtnControls" 
                                onClick={() => changeInfo('Изменить описание', 'description')}
                            >
                                Изменить описание
                            </div>
                            <div className="adminBtn adminBtnControls" 
                                onClick={() => changeInfo('Изменить перерыв', 'coffeTime')}
                            >
                                Изменить перерыв
                            </div>
                            <div className="adminBtn adminBtnControls" 
                                onClick={() => changeInfo('Изменить рабочий график', 'workTime')}
                            >
                                Изменить рабочий график
                            </div>
                            <div className="adminBtn adminBtnControls" 
                                onClick={() => changeInfo('Изменить телефон', 'phoneNumber')}
                            >
                                Изменить телефон
                            </div>
                            <div className="adminBtn adminBtnControls" 
                                onClick={() => changeInfo('Изменить сайт', 'webSiteUrl')}
                            >
                                Изменить сайт
                            </div>
                            
                        </div>
                        <div className="btnAdding">
                            <div className="adminBtn acceptCompany" onClick={acceptCompany}>Принять</div>
                            <div className="adminBtn dismissCompany" onClick={dismissCompany}>Отклонить</div>
                        </div>
                    </div>
                </div>
                : ''}
        </div>
    )
}

export default Admin;