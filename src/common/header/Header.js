import React, { useEffect, useState } from 'react';
import '../header/Header.css'
import Input from '@material-ui/core/Input';
import { InputAdornment } from '@material-ui/core';
import { fade, makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

// Styles fo header
const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
    avatar: {
        backgroundColor: "red",
    },

}));

// Header - functional component
const Header = (props) => {
    const classes = useStyles();

    // check whether user loggedin
    const [isLoggedIn, logging] = useState(false)
    useEffect(() => {
        logging(window.sessionStorage.getItem("access-token") === null ? false : true)
    });


    // dropdown menu on clicking user profile pic
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    //function handlers

    // search Handler
    function searchContentHandler(e) {
        props.searchImage(e.target.value);
        e.preventDefault();
    }

    // logout handler
    function logoutHandler() {
        window.sessionStorage.removeItem("access-token");
        window.location = '/';
    }

    // profile page navigation
    function myAccountClickHandler() {
        window.location = '/profile';
    }


    return (
        <div className="header" >
            <span className="logo">Image Viewer</span>
            {
                //if logged in searchbar and avatar appears
                isLoggedIn ?
                    <div className="header-right">

                        {/* if homepage, search bar appears */}
                        {window.location.href.includes("/home") === true ?

                            <div className={classes.search + " searchBar"}>
                                <Input className='search'
                                    type='search'
                                    placeholder='Search...'
                                    onChange={searchContentHandler}
                                    disableUnderline
                                    startAdornment={
                                        <InputAdornment position="start"> <SearchIcon /> </InputAdornment>
                                    }
                                />
                            </div>
                            :
                            <span />
                        }

                        {/* profile pic */}
                        <div className="avatarHeader">
                            <Button className="Header-avatar-button" aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                                <Avatar src={require("../../assets/profileImage.png")} variant="circle" className={"avatarIcon " + classes.avatar} />


                            </Button>
                            <Menu
                                id="simple-menu"
                                anchorEl={anchorEl}
                                keepMounted
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                                style={{ top: "38px" }}
                            >
                                {
                                    (window.location.href.includes("/home") === true) ?
                                        <MenuItem onClick={myAccountClickHandler}>My account</MenuItem>
                                        :
                                        null
                                }
                                <MenuItem onClick={logoutHandler}> Logout</MenuItem>
                            </Menu>
                        </div>
                    </div>
                    :
                    <span />
            }
        </div >
    );
}
export default Header