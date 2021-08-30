import React from "react";

function Home(props) {
    let currentValue = props.curentValue || "DEFAULT";

    return (
        <div className="map">
            <div className="inner-card card-container">
                <div className="select-list">
                    <select name="city-list" >
                        <option value="DEFAULT" selected disabled>Где вы находитесь?</option>
                        <option value="Moscow">Москва</option>
                        <option value="Kazan">Казань</option>
                        <option value="Piter">Санкт-Петербург</option>
                        <option value="Razan">Рязань</option>
                        <option value="Omsk">Омск</option>
                        <option value="Samara">Самара</option>
                    </select>
                </div>
                <div className="card-categories">
                    <p className="categories-title">Что хотите сдать?</p>
                    <ul className="categories-list">
                        <li className="category-item selected-category"><img src="/img/category/paper.png" width="25" height="25" alt="paper category" /></li>
                        <li className="category-item"><img src="/img/category/glass.png" width="25" height="25" alt="glass category" /></li>
                        <li className="category-item"><img src="/img/category/bottle.png" width="25" height="25" lt="bottle category" /></li>
                        <li className="category-item"><img src="/img/category/tin.png" width="25" height="25" alt="tin category" /></li>
                        <li className="category-item"><img src="/img/category/clothes.png" width="25" height="25" alt="clothes category" /></li>
                        <li className="category-item"><img src="/img/category/gadget.png" width="25" height="25" alt="gadget category" /></li>
                        <li className="category-item"><img src="/img/category/radioactive.png" width="25" height="25" alt="radioactive category" /></li>
                        <li className="category-item"><img src="/img/category/battery.png" width="25" height="25" alt="battery category" /></li>
                        <li className="category-item"><img src="/img/category/lamp.png" width="25" height="25" alt="lamp category" /></li>
                        <li className="category-item"><img src="/img/category/technique.png" width="25" height="25" alt="technique category" /></li>
                        <li className="category-item"><img src="/img/category/package.png" width="25" height="25" alt="package category" /></li>
                        <li className="category-item"><img src="/img/category/beer.png" width="25" height="25" alt="beer category" /></li>
                        <li className="category-item"><img src="/img/category/tires.png" width="25" height="25" alt="tires category" /></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Home;