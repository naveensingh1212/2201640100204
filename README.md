# URL Shortener Microservice  

This is a **URL Shortener Microservice** built using **Node.js + Express** as part of the AffordMed assessment.  
It allows users to shorten long URLs, track their usage, and get detailed statistics.  

---

## 🚀 Features  
- Shorten long URLs with optional custom shortcode.  
- Set expiry time for short links (default 30 minutes).  
- Redirect from short URL → original URL.  
- Track clicks, referrer, IP address, and geo-location.  
- RESTful APIs with clean JSON responses.  
- Integrated logging middleware → sends logs to AffordMed evaluation server.  

---

## 📂 Project Structure  
Backend/
│── controllers/ # Handles requests (create, stats)
│── middleware/ # Logging middleware
│── routes/ # API routes
│── utils/ # Helpers (shortid, logger)
│── store.js # In-memory data store
│── index.js # Entry point



---

