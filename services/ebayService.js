const axios = require("axios");

const clients = {
    "6": "Tom"
};

/**
 * Get eBay orders.
 *
 * Only orders containing a line item with a client SKU
 * are returned.
 *
 * Current client mapping:
 * SKU 6 = Tom
 *
 * Profit calculation:
 *
 * eBay Sale Amount
 * - eBay Fees
 * - Shipping Charged
 * - Other Costs
 * = Net Revenue
 *
 * The "Shipping Charged" amount is currently being used
 * as an estimate of shipping cost because the actual
 * shipping label cost is not being pulled yet.
 */
async function getOrders() {
    try {
        const accessToken = process.env.EBAY_ACCESS_TOKEN;

        if (!accessToken) {
            throw new Error("EBAY_ACCESS_TOKEN is not set.");
        }

        // ---------------------------------------------------------
        // GET EBAY ORDERS
        // ---------------------------------------------------------

        const response = await axios.get(
            "https://api.ebay.com/sell/fulfillment/v1/order",
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                },
                params: {
                    limit: 50
                }
            }
        );

        const orders = response.data.orders || [];

        console.log(`Orders found: ${orders.length}`);

        // ---------------------------------------------------------
        // PROCESS ORDERS
        // ---------------------------------------------------------

        const formattedOrders = [];

        for (const order of orders) {

            // Make sure the order has line items
            if (
                !Array.isArray(order.lineItems) ||
                order.lineItems.length === 0
            ) {
                continue;
            }

            // -----------------------------------------------------
            // FIND A CLIENT LINE ITEM
            // -----------------------------------------------------

            const item = order.lineItems.find((lineItem) => {

                const sku = lineItem.sku
                    ? String(lineItem.sku).trim()
                    : null;

                return sku && clients[sku];
            });

            // No client SKU in this order
            if (!item) {
                continue;
            }

            // -----------------------------------------------------
            // SKU
            // -----------------------------------------------------

            const sku = item.sku
                ? String(item.sku).trim()
                : null;

            // -----------------------------------------------------
            // CLIENT
            // -----------------------------------------------------

            const client = clients[sku] || null;

            // -----------------------------------------------------
            // SALE INFORMATION
            // -----------------------------------------------------

            const salePrice = Number(
                item.lineItemCost?.value || 0
            );

            const shippingCharged = Number(
                item.deliveryCost?.shippingCost?.value || 0
            );

            const grossRevenue = Number(
                item.total?.value || 0
            );

            // -----------------------------------------------------
            // SALES TAX
            // -----------------------------------------------------

            const salesTax = Number(
                order.pricingSummary?.totalTaxAmount?.value || 0
            );

            // -----------------------------------------------------
            // EBAY SALE AMOUNT
            // -----------------------------------------------------

            const ebaySaleAmount = Number(
                order.paymentSummary?.totalDueSeller?.value || 0
            );

            // -----------------------------------------------------
            // EBAY FEES
            // -----------------------------------------------------

            /*
             * If eBay provides the marketplace fee here,
             * use it.
             *
             * Otherwise it will be 0.
             */

            const ebayFees = Number(
                order.paymentSummary?.totalMarketplaceFee?.value || 0
            );

            // -----------------------------------------------------
            // OTHER COSTS
            // -----------------------------------------------------

            const otherCosts = 0;

            // -----------------------------------------------------
            // NET REVENUE
            // -----------------------------------------------------

            /*
             * We are currently using Shipping Charged as the
             * shipping-cost estimate.
             *
             * Once you have actual shipping-label costs,
             * replace shippingCharged with the actual cost.
             */

            const netRevenue =
                ebaySaleAmount -
                ebayFees -
                shippingCharged -
                otherCosts;

            // -----------------------------------------------------
            // 50 / 50 SPLIT
            // -----------------------------------------------------

            const client50Share = Number(
                (netRevenue / 2).toFixed(2)
            );

            const your50Share = Number(
                (netRevenue / 2).toFixed(2)
            );

            // -----------------------------------------------------
            // TERMINAL OUTPUT
            // -----------------------------------------------------

            console.log("------------------------------");

            console.log(
                `ITEM: ${item.title || "Unknown Item"}`
            );

            console.log(
                `SKU: ${sku}`
            );

            console.log(
                `CLIENT: ${client}`
            );

            console.log(
                `EBAY SALE AMOUNT: ${ebaySaleAmount.toFixed(2)}`
            );

            console.log(
                `EBAY FEES: ${ebayFees.toFixed(2)}`
            );

            console.log(
                `SHIPPING CHARGED: ${shippingCharged.toFixed(2)}`
            );

            console.log(
                `OTHER COSTS: ${otherCosts.toFixed(2)}`
            );

            console.log(
                `NET REVENUE: ${netRevenue.toFixed(2)}`
            );

            console.log(
                `CLIENT 50%: ${client50Share.toFixed(2)}`
            );

            console.log(
                `YOUR 50%: ${your50Share.toFixed(2)}`
            );

            // -----------------------------------------------------
            // ADD ORDER TO RESULTS
            // -----------------------------------------------------

            formattedOrders.push({

                "Item":
                    item.title || null,

                "Listing ID":
                    item.legacyItemId || null,

                "Order ID":
                    order.orderId || null,

                "Buyer":
                    order.buyer?.username || null,

                "Date Sold":
                    order.creationDate || null,

                "Quantity":
                    item.quantity || 0,

                "Sale Price":
                    `$${salePrice.toFixed(2)}`,

                "Shipping Charged":
                    `$${shippingCharged.toFixed(2)}`,

                "Gross Revenue":
                    `$${grossRevenue.toFixed(2)}`,

                "Sales Tax":
                    `$${salesTax.toFixed(2)}`,

                "eBay Sale Amount":
                    `$${ebaySaleAmount.toFixed(2)}`,

                "eBay Fees":
                    `$${ebayFees.toFixed(2)}`,

                "Shipping Cost Paid":
                    `$${shippingCharged.toFixed(2)}`,

                "Other Costs":
                    `$${otherCosts.toFixed(2)}`,

                "Net Revenue":
                    `$${netRevenue.toFixed(2)}`,

                "Client":
                    client,

                "SKU":
                    sku,

                "Client 50% Share":
                    client50Share,

                "Your 50% Share":
                    your50Share,

                "Paid Out":
                    false
            });
        }

        // ---------------------------------------------------------
        // FINAL RESULT
        // ---------------------------------------------------------

        console.log("------------------------------");

        console.log(
            `Client orders found: ${formattedOrders.length}`
        );

        return formattedOrders;

    } catch (error) {

        console.error("eBay API Error:");

        if (error.response) {

            console.error(
                "Status:",
                error.response.status
            );

            console.error(
                "Response:",
                error.response.data
            );

        } else {

            console.error(
                error.message
            );
        }

        throw error;
    }
}

module.exports = {
    getOrders
};