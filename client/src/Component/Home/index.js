import React, { useState, useEffect } from 'react';
import {
    Section,
    Holder
} from './HomeComponents.js';
import { makeStyles } from '@material-ui/styles';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import axios from 'axios';
import { useToast } from '@chakra-ui/react';

const useStyles = makeStyles((theme) => ({
    logoStyles:{
        fontSize: '30px',
        fontFamily: 'Georgia'
    },
    nav:{
        display: 'flex',
        justifyContent:'space-between',
        width: '100%',
        flexDirection: 'row',
        padding: '10px 35px 10px 35px'
    }
}))

function Home(){
    const classes = useStyles();
    const toast = useToast();
    const toast_id = "id"

    const [open, setOpen] = useState(false);

    const [ login, setLogin ] = useState(false);
    const [ cartCount, setCartCount ] = useState(0);

    const [dialogContent, setDialogContent] = useState("");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [fetchedData, setFetchedData] = useState([]);
    const [productId, setProductId] = useState("");
    const [cart, setCart] = useState("")

    const handleOpen = (e, type, id) => {
        switch (type) {
            case "login":
                setOpen(true);
                setDialogContent("login")
                break;
            case "addCart":
                setOpen(true);
                setDialogContent("addCart");
                setProductId(id);
                break;
            default:
                break;
        }
    }

    const handleClose = () => {
        setOpen(false);
        setDialogContent("");
        setProductId("");
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post(`http://bookstore-ashutosh.herokuapp.com:80/user/login`,{
            email: email, password: password
        })
        .then((res) => {
            if(res.data.response === 1){
                if(!toast.isActive(toast_id)){
                    toast({
                        id: toast_id,
                        description: "Login Successful",
                        duration: 3000,
                        position: "top-right"
                    })
                }
                localStorage.setItem('user', res.data.id);
                setLogin(true);
                setCartCount(res.data.cart);
                setCart(res.data.cartItem);
                handleClose();
                setEmail("");
                setPassword("");
                
            } else {
                if(!toast.isActive(toast_id)){
                    toast({
                        id: toast_id,
                        description: "Incorrect Credentials. Try again",
                        duration: 3000,
                        position: "top-right"
                    })
                }
            }
        })
        .catch(err => {
            if(!toast.isActive(toast_id)){
                toast({
                    id: toast_id,
                    description: "Login Failed. Try Again",
                    duration: 3000,
                    position: "top-right"
                })
            }
        })
    }

    const handleCartAdd = (e) => {

        axios.post(`http://bookstore-ashutosh.herokuapp.com:80/product/addCart`, {
            userId: localStorage.getItem('user'),
            product: productId
        })
        .then((res) => {
            handleClose();
            setCartCount(res.data.result.cart.length)
            setCart(res.data.result.cart)
        })
        .catch(err => {
            if(!toast.isActive(toast_id)){
                toast({
                    id: toast_id,
                    description: "Adding To Cart Failed",
                    duration: 3000,
                    position: "top-right"
                })
            }
        })
    }

    useEffect(() => {

        axios.post(`http://bookstore-ashutosh.herokuapp.com:80/product/fetch`)
        .then(res =>{
            setFetchedData(res.data.products);
        })
        .catch(err => {
            console.log(err);
            if(!toast.isActive(toast_id)){
                toast({
                    id: toast_id,
                    description: "Failed Fetching Data",
                    duration: 3000,
                    position: "top-right"
                })
            }
        })
    }, [toast])

    return(
        <Section>
            <AppBar className={classes.nav}>
                <Typography variant="h6" className={classes.logoStyles}>
                    Book Store
                </Typography>
                <IconButton color="inherit" onClick={login ? null : e=> handleOpen(e, "login")}>
                    <Badge badgeContent={cartCount} color="secondary">
                        <ShoppingCartIcon />
                    </Badge>
                </IconButton>
            </AppBar>
            <Holder>
                <div style={{color: 'white', marginBottom: '20px', marginTop: '75px'}}>
                    <Typography variant="h2">Book Store</Typography>
                    <Typography variant="h4">A Destination For All Book Lovers</Typography>
                </div>
                <div style={{padding: '10px'}}>
                    <Grid container spacing={2}>
                        {
                            fetchedData.map((element, index) => {
                                return (
                                    <Grid item sm={12} md={4} lg={3} key={index} style={{height:'600px', padding: '10px'}}>
                                        <Paper elevation={3} style={{padding: '7px', height: '100%', display: 'flex', flexDirection:'column', justifyContent: 'space-between'}}>
                                            <img src={require(`../../images/${index + 1}.jpg`).default} alt="book" style={{width: '100%', height: '300px'}} />
                                            <div>
                                                <Typography variant="h5">{element.title}</Typography>
                                                <Typography variant="h6">{element.des}</Typography>
                                            </div>
                                            {!cart.includes(element._id) ? 
                                            <Button variant="contained" style={{color: 'white', backgroundColor:"#202950", marginBottom: '1px'}}
                                                onClick={e=>handleOpen(e, "addCart", element._id)}
                                            >
                                                Add To Cart
                                            </Button>
                                            :
                                            <Button variant="contained" style={{color: 'white', backgroundColor:"#202950", marginBottom: '1px'}}>
                                                Remove From Cart
                                            </Button>
                                            }
                                        </Paper>
                                    </Grid>
                                )
                            })
                        }
                    </Grid>
                </div>
            </Holder>
            <Dialog open={open} fullWidth disableEscapeKeyDown onClose={(e) => handleClose()}>
                {dialogContent === "login" ? <>
                    <DialogTitle>Login To Access Cart</DialogTitle>
                    <DialogContent >
                        <form onSubmit={handleSubmit}>
                            <TextField 
                                required
                                fullWidth
                                type="email"
                                label="Email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={e=>setEmail(e.target.value)}
                                style={{marginBottom: '7px'}}
                            />
                            <TextField 
                                required
                                fullWidth
                                type="password"
                                label="Password"
                                placeholder="Enter the password"
                                value={password}
                                onChange={e=>setPassword(e.target.value)}
                                style={{marginBottom: '7px'}}
                            />
                            <Button fullWidth type="submit" style={{backgroundColor: '#202950', color: 'white'}}>
                                Login
                            </Button>
                        </form>
                    </DialogContent>
                </>
                :
                dialogContent === "addCart" ? 
                        <>
                            <DialogTitle>Add To Cart</DialogTitle>
                            <DialogContent>
                                Do you want to add this item to your cart?
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose} style={{backgroundColor:'#202950', color: 'white'}}>Cancel</Button>
                                <Button style={{backgroundColor:'#202950', color: 'white'}} onClick={handleCartAdd}>Add</Button>
                            </DialogActions>
                        </>
                : 
                null
                }
            </Dialog>
        </Section>
    )
}

export default Home;