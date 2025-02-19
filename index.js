import express from 'express'
import axios from 'axios'
import pg from 'pg'
import bodyparser from 'body-parser'


const app = express();
const port = 3000;
const API_URL= 'https://covers.openlibrary.org/b/isbn/';
app.use(express.static('public'));
app.use(bodyparser.urlencoded({extended: true}));

const db = new pg.Client({
    user: 'postgres',
    host: 'localhost',
    database: 'book_notes',
    password: 'post2g',
    port: 5432,
});
db.connect();

var currentBook;
async function getBooks() {
    try{
    const result = await db.query("SELECT id,title,rating,to_char(read_time,'DD/MM/YYYY') as time,description,coverurl FROM BOOKS");
    return result.rows;
    }catch(err)
    {
        console.log(err.message);
    }
    
}
async function addbook(ISBN,title,rating,description,date) {
    try
    {
        const coverurl = API_URL+ISBN+'-L.jpg';
        await db.query('INSERT INTO BOOKS VALUES ($1,$2,$3,$4,$5,$6)',[ISBN,title,rating,date,description,coverurl]);
    }catch(error)
    {
        console.log(error);
    }
    
}

async function editbook(previousId,ISBN,title,rating,description,date) {
    try
    {
        const coverurl = API_URL+ISBN+'-L.jpg';
        await db.query('update books set id=$1 where id=$2',[ISBN,previousId]);
        await db.query('update books set title=$1 where id=$2',[title,previousId]);
        await db.query('update books set rating=$1 where id=$2',[rating,previousId]);
        await db.query('update books set description=$1 where id=$2',[description,previousId]);
        await db.query('update books set read_time=$1 where id=$2',[date,previousId]);
        await db.query('update books set coverurl=$1 where id=$2',[coverurl,previousId]);
    }catch(error)
    {
        console.log(error);
    }
    
}

async function deleteBook(id) {

    try{
    await db.query('delete from books where id=$1',[id]);
    }
    catch(error)
    {
        console.log(error);
    }

    
}


async function getNotes(bookid) {
    try{
        
        const result = await db.query('select * from notes where bookid = $1',[bookid]);
        return result.rows
    }catch(err)
    {
        console.log(err.message);
    }
    
}
async function addNote(content) {
    try
    {
        await db.query('insert into notes(content,bookid) values($1,$2) ',[content,currentBook]);
    }catch(error)
    {
        console.log(error);
    }
    
}
async function editNote(note,content) {
    try
    {
       
        await db.query('update notes set content=$1 where id=$2',[content,note]);
    }catch(error)
    {
        console.log(error);
    }
    
}
async function deleteNote(id) {

    try{
    await db.query('delete from notes where id=$1',[id]);
    }
    catch(error)
    {
        console.log(error);
    }

    
}
app.get('/',async(req,res)=>
{
    const books = await getBooks();
    res.render('index.ejs',{
        books: books
    })
});
app.post('/addbook',async(req,res)=>{
    const ISBN = req.body.bookid;
    const title = req.body.bookTitle;
    const description = req.body.bookDescription;
    const date = req.body.readTime;
    const rating = req.body.rating;
    console.log(req);

    await addbook(ISBN,title,rating,description,date);

    res.redirect('/');

});
app.post('/edit',async(req,res)=>
{
    const previousId = req.body.book;
    const ISBN = req.body.bookid;
    const title = req.body.bookTitle;
    const description = req.body.bookDescription;
    const date = req.body.readTime;
    const rating = req.body.rating;

    await editbook(previousId,ISBN,title,rating,description,date);

    res.redirect('/');
});
app.post('/delete',async(req,res)=>{
    const id = req.body.book;
    
    await deleteBook(id);

    res.redirect('/');
})

app.post('/view',async(req,res)=>
{
    currentBook = parseInt(req.body.book);
    res.redirect('/view');
});

app.get('/view',async(req,res)=>
{
    const notes = await getNotes(currentBook);
    res.render('notes.ejs',{
        notes: notes
    })
});
app.post('/addnote',async(req,res)=>
    {
        const content = req.body.content;
        await addNote(content);
        
        res.redirect('/view');
    });
app.post('/editnote',async(req,res)=>
    {
        const note = req.body.note;
        const content = req.body.Editedcontent;
        await editNote(note,content);
        
        res.redirect('/view');
    });
app.post('/deletenote',async(req,res)=>
{
    const note = req.body.note;
    await deleteNote(note);
    res.redirect('/view');
})

app.listen(port,()=>
{
    console.log(`listening to port ${port}`);
})