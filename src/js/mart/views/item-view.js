import htmlEscape from '../../utils/html-escape';

const currencySymbol = '$';

/**
 * Simple dumb view to render new item template
 */
export default (() => {

    function getTemplate(data) {
        return `
            <li class="item-list clearfix cw-container">
                <figure class="col-xs-3">
                    <img src="${data.image}" alt="product image"
                        title="product image" class="image-rounded"
                    />
                </figure>
                <div class="col-xs-4 item-list-column">
                    <p>${data.name}</p>
                    <p>Sales Tax:${data.tax}${currencySymbol}</p>
                    <p>Discount: ${data.discount}${currencySymbol}</p>
                </div>
                <div class="col-xs-4 item-list-column">
                    <p>Shipping Cost: ${data.shipping}${currencySymbol}</p>
                </div>
                <div class="col-xs-4 item-list-column">
                    <p class="price">${data.cost}${currencySymbol}</p>
                    <label for="${data.id}">
                        Select item
                    </label>
                    <input id="${data.id}" data-index="${data.index}" type="checkbox" class="checkbox inline" />
                </div>
            </li>
        `;
    }

    return {
        getTemplate,
    };

})();
