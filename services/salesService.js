const ebayService = require("./ebayService");
const financeService = require("./financeService");

async function getSales() {

    const orders = await ebayService.getOrders();
    const transactionsData = await financeService.getTransactions();

    const transactions = transactionsData.transactions || [];

    console.log("Orders found:", orders.length);
    console.log("Transactions found:", transactions.length);

    const sales = orders.map(order => {

        // Find the SALE transaction for this order
        const saleTransaction = transactions.find(transaction =>
            transaction.transactionType === "SALE" &&
            transaction.orderId === order["Order ID"]
        );

        // Find the SHIPPING_LABEL transaction for this order
        const shippingTransaction = transactions.find(transaction =>
            transaction.transactionType === "SHIPPING_LABEL" &&
            transaction.orderId === order["Order ID"]
        );

        // Amount credited by eBay for the sale
        const saleAmount = saleTransaction
            ? Number(saleTransaction.amount?.value || 0)
            : 0;

        // eBay fees
        const ebayFees = saleTransaction
            ? Number(saleTransaction.totalFeeAmount?.value || 0)
            : 0;

        // Sales tax collected/remitted by eBay
        const salesTax = saleTransaction
            ? Number(saleTransaction.ebayCollectedTaxAmount?.value || 0)
            : 0;

        // Shipping label purchased through eBay
        const shippingCostPaid = shippingTransaction
            ? Number(shippingTransaction.amount?.value || 0)
            : 0;

        // Net revenue
        //
        // IMPORTANT:
        // saleAmount already excludes eBay-collected sales tax,
        // so we do NOT subtract salesTax again.
        const netRevenue =
            saleAmount -
            ebayFees -
            shippingCostPaid;

        return {

            "Item": order["Item"],
            "Listing ID": order["Listing ID"],
            "Order ID": order["Order ID"],

            "Buyer": order["Buyer"],
            "Date Sold": order["Date Sold"],
            "Quantity": order["Quantity"],

            "Sale Price": order["Sale Price"],
            "Shipping Charged": order["Shipping Charged"],

            "Gross Revenue": order["Gross Revenue"],

            "Sales Tax": `$${salesTax.toFixed(2)}`,

            "eBay Sale Amount": `$${saleAmount.toFixed(2)}`,

            "eBay Fees": `$${ebayFees.toFixed(2)}`,

            "Shipping Cost Paid": `$${shippingCostPaid.toFixed(2)}`,

            "Other Costs": "$0.00",

            "Net Revenue": `$${netRevenue.toFixed(2)}`,

            "Client": order["Client"],
            "SKU": order["SKU"],

            "Client 50% Share": null,
            "Your 50% Share": null,

            "Paid Out": order["Paid Out"]

        };

    });

    return sales;
}

module.exports = {
    getSales
};