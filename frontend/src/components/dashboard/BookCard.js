import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import { Form } from 'react-bootstrap';
import Axios from 'axios'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

function BookCard({ props }) {
    const [showModal, setShowModal] = useState(false);
    const userData = JSON.parse(localStorage.getItem('users'))
    const [title, setTitle] = useState(props.title)
    const [author, setAuthor] = useState(props.author)
    const [price, setPrice] = useState(props.price)
    const [category, setCategory] = useState(props.category)

    const handleDelete = () => {
        const deleteRes = window.confirm('Do you really want to delete this?')
        if (deleteRes === true) {
            Axios.delete(`https://book-app-backend-um3b.onrender.com/user/delete-book/${props._id}`)
                .then((res) => {
                    //alert(res.data.message)
                    toast.success(res.data.message)
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000)
                })
                .catch((err) => {
                    alert(err.response.data.message)
                })
        }
    }

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(!showModal);

    const handleEdit = () => {
        handleClose()
        const newBook = {
            bookId: props._id,
            title: title,
            author: author,
            price: price,
            category: category,
            userId: props.userId
        }
        Axios.put(`https://book-app-backend-um3b.onrender.com/user/edit-book`, newBook)
            .then((res) => {
                toast.success(res.data.message)
                setTimeout(() => {
                    window.location.reload();
                }, 1000)
            })
            .catch((err) => {
                toast.error(err.response.data.message)
            })
    }

    return (
        <Card className='m-5 col-sm-3'>
            <Card.Body>
                <Card.Title>{props.title}</Card.Title>
                <Card.Text>By: {props.author}</Card.Text>
                <Card.Text>Genre: {props.category}</Card.Text>
                <Card.Text>Price: {props.price}</Card.Text>
                <Button variant='primary' onClick={handleShow} >Update</Button>
                <Button variant='danger' className='ms-4' onClick={handleDelete}>Delete</Button>


                {
                    showModal ?
                        <>
                            <Form className='m-5' show={showModal} onHide={handleClose}>
                                <Form.Group controlId="title">
                                    <Form.Label>Edit Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group controlId="body">
                                    <Form.Label>Edit author</Form.Label>
                                    <Form.Control
                                        type="text"
                                        rows={4}
                                        value={author}
                                        onChange={(e) => setAuthor(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group controlId="body">
                                    <Form.Label>Edit Category</Form.Label>
                                    <Form.Control
                                        type="text"
                                        rows={4}
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group controlId="body">
                                    <Form.Label>Edit Price</Form.Label>
                                    <Form.Control
                                        type="text"
                                        rows={4}
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                    />
                                </Form.Group>
                            </Form>
                            <div className='m-5'>
                                <Button variant="secondary" onClick={handleClose}>
                                    Close
                                </Button>
                                <Button className='ms-4' variant="primary" onClick={handleEdit}>
                                    Save Changes
                                </Button>
                            </div>
                        </>
                        : <></>
                }

            </Card.Body>
        </Card>
    )
}

export default BookCard