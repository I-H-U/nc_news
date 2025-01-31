# Northcoders News API

You can access the live API by clicking [here](https://nc-news-k8ee.onrender.com/api)

---

## **Project Overview**

This project is a **Node.js and PostgreSQL-based RESTful API** that allows users to interact with articles, comments, and topics. It provides endpoints for retrieving, posting, and interacting with data.

---

## **Getting Started**

Follow the steps below to set up the project locally.

---

### **1. Cloning the Project**

To clone this repository, run the following command:

```bash
git clone <repository-url>
cd <project-folder>
```

---

### **2. Installing Dependencies**

Install the required dependencies using:

```bash
npm install
```

---

### **3. Setting Up the Database**

- **Create `.env` files:**  
  You will need to create two environment files to store the environment variables.

  1. Create a file named **`.env.development`** with the following content:

     ```
     PGDATABASE=your_development_database_name
     ```

     Replace `your_development_database_name` with the correct database name from **`/db/setup.sql`**.

  2. Create a file named **`.env.test`** with the following content:
     ```
     PGDATABASE=your_test_database_name
     ```
     Replace `your_test_database_name` with the correct database name from **`/db/setup.sql`**.

---

### **4. Seeding the Local Database**

Run the following command to seed your local database:

```bash
npm run seed
```

This will populate your local database with the necessary data for development and testing.

---

### **5. Running Tests**

To run the test suite, use the following command:

```bash
npm test
```

---

### **6. Minimum Requirements**

- **Node.js:** v14.0.0 or higher
- **Postgres:** v12.0 or higher

Ensure you have the correct versions installed before running the project locally.

---

## **Additional Information**

- **Database setup:** The database schema and setup instructions are located in `/db/setup.sql`.
- **Hosted version:** The hosted version can be found at the link provided above.

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
