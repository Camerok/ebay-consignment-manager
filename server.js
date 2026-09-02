require("dotenv").config();

const express = require("express");
const ebayService = require("./services/ebayService");
const financeService = require("./services/financeService");
const salesService = require("./services/salesService");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.redirect("/orders");
});

app.get("/api/orders", async (req, res) => {
    try {
        const orders = await ebayService.getOrders();
        res.json(orders);
    } catch (error) {
        console.error("Orders Error:", error);

        res.status(500).json({
            error: "Unable to retrieve eBay orders."
        });
    }
});

app.get("/orders", (req, res) => {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>eBay Orders</title>

    <style>

        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            font-family: Arial, Helvetica, sans-serif;
            background: #f4f6f8;
            color: #1f2937;
        }

        .header {
            background: #111827;
            color: white;
            padding: 28px 20px;
        }

        .header-inner {
            max-width: 1400px;
            margin: auto;
        }

        .header h1 {
            margin: 0;
            font-size: 30px;
        }

        .header p {
            margin: 7px 0 0;
            color: #9ca3af;
            font-size: 14px;
        }

        .container {
            max-width: 1400px;
            margin: auto;
            padding: 30px 20px;
        }

        .summary {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 18px;
            margin-bottom: 25px;
        }

        .summary-card {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            padding: 22px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .summary-label {
            color: #6b7280;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 8px;
        }

        .summary-value {
            font-size: 28px;
            font-weight: bold;
        }

        .green {
            color: #059669;
        }

        .blue {
            color: #2563eb;
        }

        .toolbar {
            display: flex;
            gap: 12px;
            margin-bottom: 20px;
        }

        .search-box {
            flex: 1;
        }

        .search-box input {
            width: 100%;
            padding: 13px 15px;
            border: 1px solid #d1d5db;
            border-radius: 9px;
            background: white;
            font-size: 15px;
            outline: none;
        }

        .search-box input:focus {
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .refresh-button {
            border: none;
            background: #2563eb;
            color: white;
            padding: 0 20px;
            border-radius: 9px;
            font-weight: bold;
            cursor: pointer;
            font-size: 14px;
        }

        .refresh-button:hover {
            background: #1d4ed8;
        }

        .orders {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .order {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            padding: 22px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .order:hover {
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.07);
        }

        .order-top {
            display: flex;
            justify-content: space-between;
            gap: 20px;
            margin-bottom: 20px;
        }

        .item-title {
            font-size: 18px;
            font-weight: bold;
            line-height: 1.4;
            color: #111827;
        }

        .order-id {
            margin-top: 6px;
            color: #9ca3af;
            font-size: 12px;
        }

        .profit-box {
            text-align: right;
            min-width: 140px;
        }

        .profit-label {
            color: #6b7280;
            font-size: 11px;
            font-weight: bold;
            text-transform: uppercase;
        }

        .profit-value {
            color: #059669;
            font-size: 24px;
            font-weight: bold;
            margin-top: 3px;
        }

        .details {
            border-top: 1px solid #eef0f2;
            padding-top: 18px;

            display: grid;
            grid-template-columns: repeat(6, 1fr);
            gap: 18px;
        }

        .detail-label {
            color: #9ca3af;
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.4px;
            margin-bottom: 5px;
        }

        .detail-value {
            color: #374151;
            font-size: 14px;
            font-weight: 600;
            overflow-wrap: anywhere;
        }

        .badge {
            display: inline-block;
            padding: 4px 9px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
        }

        .client-badge {
            background: #dbeafe;
            color: #1d4ed8;
        }

        .sku-badge {
            background: #f3f4f6;
            color: #374151;
        }

        .paid-badge {
            background: #d1fae5;
            color: #065f46;
        }

        .unpaid-badge {
            background: #fef3c7;
            color: #92400e;
        }

        .loading,
        .empty,
        .error {
            background: white;
            border-radius: 12px;
            padding: 50px 20px;
            text-align: center;
            border: 1px solid #e5e7eb;
        }

        .loading {
            color: #6b7280;
        }

        .empty {
            color: #6b7280;
        }

        .error {
            background: #fef2f2;
            border-color: #fecaca;
            color: #991b1b;
        }

        @media (max-width: 1100px) {

            .summary {
                grid-template-columns: repeat(2, 1fr);
            }

            .details {
                grid-template-columns: repeat(3, 1fr);
            }
        }

        @media (max-width: 700px) {

            .container {
                padding: 20px 12px;
            }

            .summary {
                grid-template-columns: 1fr;
            }

            .toolbar {
                flex-direction: column;
            }

            .refresh-button {
                padding: 13px;
            }

            .order-top {
                flex-direction: column;
            }

            .profit-box {
                text-align: left;
            }

            .details {
                grid-template-columns: repeat(2, 1fr);
            }
        }

        @media (max-width: 450px) {

            .details {
                grid-template-columns: 1fr;
            }

            .item-title {
                font-size: 16px;
            }
        }

    </style>
</head>

<body>

    <div class="header">
        <div class="header-inner">
            <h1>eBay Orders</h1>
            <p>Consignment sales and profit dashboard</p>
        </div>
    </div>

    <div class="container">

        <div class="summary">

            <div class="summary-card">
                <div class="summary-label">Total Orders</div>
                <div class="summary-value" id="totalOrders">0</div>
            </div>

            <div class="summary-card">
                <div class="summary-label">eBay Sales</div>
                <div class="summary-value" id="totalSales">$0.00</div>
            </div>

            <div class="summary-card">
                <div class="summary-label">Net Revenue</div>
                <div class="summary-value green" id="totalProfit">$0.00</div>
            </div>

            <div class="summary-card">
                <div class="summary-label">Your 50%</div>
                <div class="summary-value blue" id="yourShare">$0.00</div>
            </div>

        </div>

        <div class="toolbar">

            <div class="search-box">
                <input
                    type="text"
                    id="searchInput"
                    placeholder="Search items, buyers, order IDs, SKU..."
                >
            </div>

            <button
                class="refresh-button"
                id="refreshButton"
            >
                Refresh Orders
            </button>

        </div>

        <div id="ordersContainer">
            <div class="loading">
                Loading orders...
            </div>
        </div>

    </div>

    <script>

        let allOrders = [];

        function parseMoney(value) {

            if (typeof value === "number") {
                return value;
            }

            if (!value) {
                return 0;
            }

            return Number(
                String(value).replace(/[$,]/g, "")
            ) || 0;
        }

        function money(value) {

            return Number(value || 0).toLocaleString("en-US", {
                style: "currency",
                currency: "USD"
            });
        }

        function formatDate(value) {

            if (!value) {
                return "—";
            }

            const date = new Date(value);

            if (isNaN(date.getTime())) {
                return value;
            }

            return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
            });
        }

        function escapeHtml(value) {

            return String(value || "")
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        }

        async function loadOrders() {

            const container =
                document.getElementById("ordersContainer");

            container.innerHTML =
                '<div class="loading">Loading orders...</div>';

            try {

                const response =
                    await fetch("/api/orders");

                if (!response.ok) {
                    throw new Error("Unable to load orders.");
                }

                allOrders = await response.json();

                updateSummary();
                renderOrders(allOrders);

            } catch (error) {

                console.error(error);

                container.innerHTML =
                    '<div class="error">' +
                    '<strong>Error loading orders.</strong>' +
                    '<br><br>' +
                    escapeHtml(error.message) +
                    '</div>';
            }
        }

        function updateSummary() {

            let sales = 0;
            let profit = 0;
            let yourShare = 0;

            allOrders.forEach(function(order) {

                sales += parseMoney(
                    order["eBay Sale Amount"]
                );

                profit += parseMoney(
                    order["Net Revenue"]
                );

                yourShare +=
                    Number(order["Your 50% Share"]) || 0;
            });

            document.getElementById("totalOrders").textContent =
                allOrders.length;

            document.getElementById("totalSales").textContent =
                money(sales);

            document.getElementById("totalProfit").textContent =
                money(profit);

            document.getElementById("yourShare").textContent =
                money(yourShare);
        }

        function renderOrders(orders) {

            const container =
                document.getElementById("ordersContainer");

            if (!orders.length) {

                container.innerHTML =
                    '<div class="empty">No orders found.</div>';

                return;
            }

            let html = '<div class="orders">';

            orders.forEach(function(order) {
                html += createOrder(order);
            });

            html += '</div>';

            container.innerHTML = html;
        }

        function createOrder(order) {

            const profit =
                parseMoney(order["Net Revenue"]);

            const ebaySale =
                parseMoney(order["eBay Sale Amount"]);

            const shipping =
                parseMoney(order["Shipping Cost Paid"]);

            const fees =
                parseMoney(order["eBay Fees"]);

            const otherCosts =
                parseMoney(order["Other Costs"]);

            const clientShare =
                Number(order["Client 50% Share"]) || 0;

            const yourShare =
                Number(order["Your 50% Share"]) || 0;

            const paid =
                order["Paid Out"] === true;

            let html = "";

            html += '<div class="order">';

            html += '<div class="order-top">';

            html += '<div>';

            html +=
                '<div class="item-title">' +
                escapeHtml(
                    order["Item"] || "Unknown Item"
                ) +
                '</div>';

            html +=
                '<div class="order-id">' +
                'Order ID: ' +
                escapeHtml(
                    order["Order ID"] || "—"
                ) +
                '</div>';

            html += '</div>';

            html += '<div class="profit-box">';

            html +=
                '<div class="profit-label">' +
                'Net Revenue' +
                '</div>';

            html +=
                '<div class="profit-value">' +
                money(profit) +
                '</div>';

            html += '</div>';

            html += '</div>';

            html += '<div class="details">';

            html += createDetail(
                "Date Sold",
                formatDate(order["Date Sold"])
            );

            html += createDetail(
                "Buyer",
                escapeHtml(order["Buyer"] || "—")
            );

            html += createDetail(
                "eBay Sale",
                money(ebaySale)
            );

            html += createDetail(
                "Shipping",
                money(shipping)
            );

            html += createDetail(
                "eBay Fees",
                money(fees)
            );

            html += createDetail(
                "Other Costs",
                money(otherCosts)
            );

            html += createDetail(
                "Client",
                '<span class="badge client-badge">' +
                escapeHtml(order["Client"] || "—") +
                '</span>'
            );

            html += createDetail(
                "SKU",
                '<span class="badge sku-badge">' +
                escapeHtml(order["SKU"] || "—") +
                '</span>'
            );

            html += createDetail(
                "Client 50%",
                money(clientShare)
            );

            html += createDetail(
                "Your 50%",
                money(yourShare)
            );

            html += createDetail(
                "Quantity",
                order["Quantity"] || 0
            );

            html += createDetail(
                "Status",
                '<span class="badge ' +
                (paid ? "paid-badge" : "unpaid-badge") +
                '">' +
                (paid ? "Paid Out" : "Unpaid") +
                '</span>'
            );

            html += '</div>';

            html += '</div>';

            return html;
        }

        function createDetail(label, value) {

            return (
                '<div>' +
                    '<div class="detail-label">' +
                        label +
                    '</div>' +
                    '<div class="detail-value">' +
                        value +
                    '</div>' +
                '</div>'
            );
        }

        document
            .getElementById("refreshButton")
            .addEventListener("click", loadOrders);

        document
            .getElementById("searchInput")
            .addEventListener("input", function() {

                const search =
                    this.value.toLowerCase().trim();

                if (!search) {

                    renderOrders(allOrders);

                    return;
                }

                const filtered =
                    allOrders.filter(function(order) {

                        const values = [
                            order["Item"],
                            order["Buyer"],
                            order["Order ID"],
                            order["Listing ID"],
                            order["Client"],
                            order["SKU"]
                        ];

                        return values.some(function(value) {

                            return (
                                value &&
                                String(value)
                                    .toLowerCase()
                                    .includes(search)
                            );

                        });
                    });

                renderOrders(filtered);
            });

        loadOrders();

    </script>

</body>
</html>
`;

    res.send(html);
});

app.get("/transactions", async (req, res) => {
    try {

        const transactions =
            await financeService.getTransactions();

        res.json(transactions);

    } catch (error) {

        console.error(
            "Transactions Error:",
            error
        );

        res.status(500).json({
            error:
                "Unable to retrieve eBay financial transactions."
        });
    }
});

app.get("/sales", async (req, res) => {
    try {

        const sales =
            await salesService.getSales();

        res.json(sales);

    } catch (error) {

        console.error(
            "Sales Error:",
            error
        );

        res.status(500).json({
            error:
                "Unable to combine eBay sales data."
        });
    }
});

const PORT =
    process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );

    console.log(
        `Orders: http://localhost:${PORT}/orders`
    );
});