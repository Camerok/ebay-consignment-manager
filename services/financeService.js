const axios = require("axios");

async function getTransactions() {
    try {
        const response = await axios.get(
            "https://apiz.ebay.com/sell/finances/v1/transaction",
            {
                params: {
                    limit: 100
                },
                headers: {
                    Authorization: `Bearer ${process.env.EBAY_ACCESS_TOKEN}`,
                    Accept: "application/json"
                }
            }
        );

        return response.data;

    } catch (error) {
        console.error("eBay Finance API Error:");

        if (error.response) {
            console.error(error.response.status);
            console.error(error.response.data);
        } else {
            console.error(error.message);
        }

        throw error;
    }
}

module.exports = {
    getTransactions
};
