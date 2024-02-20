# Trip Easy Backend

Welcome to the Trip Easy Backend repository! This backend server serves as the foundation for the Trip Easy hotel booking application. Built with Node.js and Express.js, it provides robust functionality for managing hotel data, user authentication, and file uploads. Leveraging MongoDB as the database, along with various libraries and patterns, it ensures secure and efficient data handling.


### MongoDB Database

The backend utilizes MongoDB, a NoSQL database, for storing and managing hotel data, user information, and authentication tokens. MongoDB offers flexibility and scalability, making it suitable for the dynamic nature of a hotel booking application.

### Multer for File Upload

Multer is integrated into the backend to handle file uploads, enabling users to upload images of hotels. This feature enhances the user experience by providing visual representations of the accommodations.

### Cloudinary Integration

Cloudinary is used to securely store the uploaded images. It offers reliable cloud storage solutions, ensuring the availability and accessibility of hotel images while maintaining data security.

### Mongoose for Data Modeling

Mongoose, an ODM (Object Data Modeling) library for MongoDB and Node.js, is employed for defining schemas and models. Mongoose simplifies data manipulation and validation, providing a structured approach to data management.

### Bcrypt for Password Hashing

To enhance security, passwords are hashed using bcrypt before storing them in the database. Bcrypt ensures that sensitive user information remains protected from unauthorized access and security breaches.

### JSON Web Token (JWT) & Cookie Authentication

The backend implements JWT and cookie-based authentication mechanisms to securely authenticate users. JWT tokens are generated upon successful login and are used to authorize protected routes, while cookies ensure persistent user sessions.

### Model-View-Controller (MVC) Pattern

Following the MVC architectural pattern, the backend is organized into separate layers: models, views, and controllers. This separation of concerns enhances maintainability, scalability, and code readability.

Frontend Repo: https://github.com/singhayush1260/trip-easy


