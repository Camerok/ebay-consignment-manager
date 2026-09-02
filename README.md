# eBay Consignment Sales & Profit Analysis

## Overview

This project is a personal data analytics project built around an eBay consignment business. The project uses eBay API data to retrieve sales information, organize transaction data, and calculate revenue and profit distributions between the business and its clients.

The primary goal of the project was to gain practical experience working with real-world data, APIs, structured JSON data, and SQL while developing a better understanding of how raw transaction data can be transformed into useful business information.
With that being said, I did not create any of the code in this project. I do not know Javascript, but this was just designed mainly to help with making my eBay finances a lot easier to read for me and my clients products. This was a very big learning experience for me,
mainly because I had never worked with API's before, and I knew i would need to learn them eventually.

## Project Goals

- Retrieve real sales and transaction data through the eBay API
- Work with structured JSON responses from an external API
- Identify and organize sales associated with individual clients using SKU data
- Calculate revenue after estimated expenses
- Calculate client and business profit shares
- Organize sales information into a more usable format
- Explore how SQL databases can be used to store and analyze business data
- Build an understanding of how an API can serve as a data source for an analytics application

## Data & API Experience

One of the main learning objectives of this project was working with an external API.

Through the eBay API, I learned how applications can retrieve structured business data from an external service and how that information can be used for analysis.

This included working with concepts such as:

- API authentication
- API endpoints
- HTTP requests and responses
- JSON data structures
- Nested data
- Query parameters
- Identifying relevant fields within API responses
- Transforming API data into a more useful analytical format

Working with actual eBay transaction data also provided experience dealing with the inconsistencies and complexity that can occur in real-world datasets.

## Data Analysis

The project processes sales information to calculate several business metrics, including:

- eBay sale amount
- Shipping costs
- eBay fees
- Net revenue
- Client profit share
- Business profit share

For example, the current profit calculation uses the available eBay sale amount and subtracts applicable expenses to estimate the revenue available for the 50/50 consignment split.

## SQL & Database Learning

This project also provided hands-on experience with SQL and relational database concepts.

I explored how sales and client information can be represented in a database and how SQL can be used to:

- Store structured business data
- Retrieve specific records
- Filter sales by client or SKU
- Organize transaction information
- Query historical sales
- Connect related pieces of business information

The project helped demonstrate the difference between raw API data and data that has been structured for analysis and querying.

## Business Use Case

The project is based on a real-world consignment workflow.

Items belonging to different clients are identified using SKU numbers. Sales data can then be associated with the appropriate client, allowing revenue to be divided according to the consignment agreement.

This creates a practical example of using data analytics to answer business questions such as:

- How much revenue was generated?
- What expenses affected the sale?
- How much profit remains?
- How much does each client receive?
- How much does the business retain?
- Which sales belong to a particular client?

## Skills Demonstrated

- Data Analysis
- API Data Retrieval
- REST APIs
- JSON Data
- Data Cleaning & Transformation
- SQL
- Relational Database Concepts
- Financial & Revenue Analysis
- Business Intelligence Concepts
- Data-Driven Decision Making

## Project Status

This project is an ongoing personal learning project. Additional functionality and analysis may be added as I continue developing my understanding of APIs, databases, SQL, and data analytics.

## Disclaimer

This repository is a portfolio/learning project based on a personal business use case. Authentication credentials, API tokens, and other sensitive information are intentionally excluded from the repository.
