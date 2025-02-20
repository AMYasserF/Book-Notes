# 📚 Book Notes Tracker

A simple web app to store and manage books you've read. Users can add, edit, delete books, and attach notes. Book covers are fetched via an external API. Built with **PostgreSQL, Express, EJS, and Bootstrap**.

## 🚀 Features

- 📖 Add, edit, and delete books  
- 📝 Attach personal notes to each book  
- 🌐 Fetch book covers from an API  
- 💾 PostgreSQL for data storage  
- 🎨 Responsive UI with Bootstrap and EJS  

## 🛠 Installation

1. **Clone the repository**  
   ```sh
   git clone https://github.com/your-username/book-notes-tracker.git
   cd book-notes-tracker
   ```

2. **Install dependencies**  
   ```sh
   npm install
   ```

3. **Set up the database**  
   - Ensure PostgreSQL is installed and running.  
   - Create a `.env` file and add your database credentials:
     ```
     DB_HOST=your_host
     DB_USER=your_user
     DB_PASSWORD=your_password
     DB_NAME=book_notes
     ```

4. **Run the application**  
   ```sh
   npm start
   ```
