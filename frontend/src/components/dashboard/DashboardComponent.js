import React, { useEffect, useState } from 'react'
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Axios from "axios";
import { toast } from 'react-toastify';
import BookCard from './BookCard'


function DashboardComponent() {

    const [title, setTitle] = useState();
    const [author, setAuthor] = useState();
    const [price, setPrice] = useState();
    const [category, setCategory] = useState();
    const [allBooks, setAllBooks] = useState()
    const [isBookCreated, setIsBookCreated] = useState(false)
    const userData = JSON.parse(localStorage.getItem('users'))

    const handleSubmit = async (e) => {
        e.preventDefault();

        const bookObj = {
            title,
            author,
            price,
            category
        }

        await Axios.post(`https://book-app-backend-um3b.onrender.com/user/create-book/${userData.userId}`, bookObj)
            .then(async (res) => {
                toast.success(res.data.message)
                setIsBookCreated(true)
                // setTimeout(() => {
                //     window.location.reload()
                // }, 2000)
            })
            .catch((err) => {
                toast.error(err.response.data.message)
                console.log(err)
            });
        console.log(allBooks)
    }

    async function getAllBooks(){
        await Axios.get(`https://book-app-backend-um3b.onrender.com/user/all-books/${userData.userId}`)
            .then((res) => {
                console.log(res.data.data)
                //alert('hello')
                setAllBooks(res.data.data)
                //window.location.reload()
            }).catch((err) => {
                toast.error(err.response.data.message)
            })
    }

    useEffect(() => {
        getAllBooks()
    },[isBookCreated])

    const handleLogout = () => {
        toast.success(`${userData.name} you logged out successfully.`)
        localStorage.removeItem('users')
        setTimeout(() => {
            window.location.href = '/user/login'
        }, 2000)
    }

    return (
        <div>
            <div className='d-flex justify-content-between align-items-center'>
                <h4 className='p-4'>Inventory Management</h4>
                <span onClick={handleLogout} class="material-symbols-outlined p-4">
                    logout
                </span>
            </div>
            <div>
                <Form className="border border-dark d-flex p-3 gap-5  justify-content-center align-items-center" onSubmit={handleSubmit}>
                    <Form.Group className="mb-2 col-sm-2" controlId="title">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            required
                            placeholder="Enter Title"
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-2 col-sm-2" controlId="textBody">
                        <Form.Label>Author</Form.Label>
                        <Form.Control
                            type="text"
                            required
                            placeholder="Name of Author"
                            onChange={(e) => setAuthor(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-2 col-sm-2" controlId="textBody">
                        <Form.Label>Price</Form.Label>
                        <Form.Control
                            type="text"
                            required
                            placeholder="Enter Price in Rupee"
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-2 col-sm-2" controlId="textBody">
                        <Form.Label>Category</Form.Label>
                        <Form.Control
                            type="text"
                            required
                            placeholder="Enter Category"
                            onChange={(e) => setCategory(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-2 col-sm-2 mt-4" controlId="addBookBtn">
                        <Button type="submit">Add Book</Button>
                    </Form.Group>
                </Form>
            </div>
            <div>
                <h3 className='p-3 mt-4'>All Books</h3>
                <div className='d-flex justify-content-center flex-wrap'>
                    {
                        allBooks ?
                            <>
                                {allBooks.map((book) =>
                                    <BookCard props={book} />
                                )}
                            </>
                            :
                            <h3 className='mt-5 p-5'>No Books right now. Add your first book</h3>
                    }
                </div>
            </div>
        </div>
    )
}

export default DashboardComponent
