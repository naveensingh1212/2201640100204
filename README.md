<div align="center">

  <h1>🔗 URL Shortener Microservice</h1>
  <p>A high-performance, feature-rich URL shortening API built with Node.js and Express.</p>
</div>

---

## ✨ Features

- **Blazing Fast Redirects**: Efficient 302 redirects for an optimal user experience.
- **Custom Shortcodes**: Create personalized, memorable short links (e.g., `/my-project`).
- **Dynamic Link Expiry**: Set a validity period for your short links, from minutes to days.
- **Detailed Analytics**: Track total clicks and log detailed click events, including:
  - Timestamp of the click
  - Referrer URL
  - Client IP address
  - **Coarse Geo-location** (Country, Region, City)
- **Robust Error Handling**: Clear and concise error messages for invalid requests, conflicts, or not-found links.

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express
- **Utilities**: `nanoid` for unique ID generation, `valid-url` for URL validation, `geoip-lite` for geo-location lookups.
- **Development**: `nodemon` for live server reloading.

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- **Node.js** (v14 or later)
- **npm**

### Installation

1.  Clone the repository:
    ```bash
    git clone [https://github.com/your-username/your-repo.git](https://github.com/your-username/your-repo.git)
    cd your-repo
    ```

2.  Install all project dependencies:
    ```bash
    npm install
    ```

3.  Create a `.env` file in the root directory and add your configuration:
    ```ini
    PORT=8000
    BASE_URL=http://localhost:8000
    SHORT_CODE_LENGTH=6
    DEFAULT_VALIDITY_MIN=30
    ```

### Running the Server

Start the application in development mode:

```bash
npm run dev # assuming you have a dev script in package.json, otherwise use:
node index.js
