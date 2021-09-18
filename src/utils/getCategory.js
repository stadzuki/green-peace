import categories from "../components/shared/categories";

function getCategory(category) {
    let currentCategory;
    if (typeof category === 'string') {
        currentCategory = categories.filter(e => e.type === category)
    } else if(typeof category === 'number'){
        currentCategory = categories[category - 1]
    }

    return currentCategory;
}

export default getCategory