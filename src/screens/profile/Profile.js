import React, { Component } from 'react';
import '../profile/Profile.css';
import Header from '../../common/header/Header';
import { Redirect } from 'react-router';
import { GridList } from '@material-ui/core';
import { GridListTile } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import { withStyles } from '@material-ui/core/styles';
import { Fab } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import EditIcon from '@material-ui/icons/Edit';
import { Modal } from '@material-ui/core';
import { Input } from '@material-ui/core';
import { InputLabel } from '@material-ui/core';
import { FormControl } from '@material-ui/core';
import FormHelperText from '@material-ui/core/FormHelperText';
import { Button } from '@material-ui/core';
const styles = theme => ({
    avatar: {
        width: theme.spacing(15),
        height: theme.spacing(15),
        backgroundColor: "red",
    },
    GridList:{
        margin: theme.spacing(0,15),
    },
    GridListTile:{
        '&:hover': {
            cursor: 'pointer',
        }    
    }
});

class Profile extends Component {
    constructor() {
        super();
        this.state = {
            username: "gmaster_balzz",
            usersFollowed: Math.floor(Math.random() * 50),
            followedByUsers: Math.floor(Math.random() * 50),
            fullName: "Sethurambalaji",
            albumDataMaster: [],
            imageDetailsMaster: [],
            tags: "#upgrad #reactjs #imageviewer #user #image",
            feed: [],
            isloggedIn: window.sessionStorage.getItem("access-token") === null ? false : true,
            nameEditModalOpen:false,
            nameEditModalClose:true,
            nameRequireLabel:"hide"
        }
    }

    UNSAFE_componentWillMount() {
        if (window.sessionStorage.getItem("access-token") !== null) {
            let data = null;
            let xhr = new XMLHttpRequest();
            let that = this;
            xhr.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    that.setState({ albumDataMaster: JSON.parse(this.responseText).data });
                    // get the image details for each image post
                    that.getImageDetails();
                }
            });
            xhr.open(
                "GET",
                "https://graph.instagram.com/me/media?fields=id,caption&access_token=" +
                window.sessionStorage.getItem("access-token")
            );
            xhr.send(data);
        }
    }



    getImageDetails = () => {
        this.state.albumDataMaster.map((image) => {
            return this.getImageDetailsById(image.id);
        });
    };
    getImageDetailsById = (id) => {
        let that = this;
        let xhr = new XMLHttpRequest();
        let data = null;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                that.setState({
                    imageDetailsMaster: that.state.imageDetailsMaster.concat(
                        JSON.parse(this.responseText)
                    ),
                });
               
                that.setPostDetails(that.state.imageDetailsMaster);
            }

        });
        xhr.open(
            "GET",
            "https://graph.instagram.com/" +
            id +
            "?fields=id,media_type,media_url,username,timestamp&access_token=" +
            sessionStorage.getItem("access-token")
        );
        xhr.send(data);
    };

    setPostDetails = (albumDetails) => {
        let arr = this.state.feed;
        // console.log("arr: " + arr)
        let feed = {};
        albumDetails.forEach((post) => {
            feed.id = post.id;
            feed.caption = this.captionHandler(feed.id);
            feed.media_url = post.media_url;
            feed.timestamp = post.timestamp;
            feed.username = post.username;
            feed.likes = Math.floor(Math.random() * 100);
            feed.comments = [];
            feed.addedComment = "";
            arr.push(feed);
            arr = arr.filter((ele, ind) => ind === arr.findIndex(elem => elem.id === ele.id))

        })

        this.setState({ feed: arr })
    }

    captionHandler = (id) => {
        let imageData = [];
        imageData = this.state.albumDataMaster.find((post) => {
            return post.id === id;
        });
        if (typeof imageData.caption === "undefined") {
            imageData.caption = "No Caption - Please comment your views"
        }
        return imageData.caption;
    }

    openEditNameModalHandler = () => {
        this.setState({ nameEditModalOpen: true, nameEditModalClose: false })
    }


    closeEditNameModalHandler = () => {
        this.setState({newFullName:''})
        this.setState({nameRequireLabel:"hide"})
        this.setState({ nameEditModalOpen: false, nameEditModalClose: true })
    }

    editNameFieldChangeHandler = (e) => {
       this.setState({ newFullName: e.target.value })
        
    }

    editNameUpdateButtonHandler = () => {
        if (this.state.newFullName == null || this.state.newFullName.trim() === "") {
            this.setState({
                nameRequireLabel: "show"
            })
        } else {
            this.setState({
                fullName: this.state.newFullName,
                newFullName: '',
                nameRequireLabel: "hide"
            })

            this.closeEditNameModalHandler();
        }

    }

    render() {
        const { classes } = this.props;
        return (
            (this.state.isloggedIn === false) ? <Redirect to="/" /> :
                <div>
                    <Header />
                    <div className="information-section">



                        <Grid container spacing={3} justify="flex-start">
                            <Grid item xs={2} />
                            <Grid item xs={2} style={{ paddingTop: 25 }}>
                                <Avatar alt={this.state.username} src={require("../../assets/profileImage.png")}
                                    variant="circle"
                                    className={classes.avatar} />
                            </Grid>
                            {/* User info section. */}
                            <Grid item xs={5} id='info-container'>
                                <Typography variant="h4" component="h1" style={{ paddingBottom: 15 }}>
                                    {this.state.username}
                                </Typography>
                                {/* Name Edit Modal. */}
                                <Grid container spacing={3} justify="center" style={{ paddingBottom: 15 }}>
                                    <Grid item xs={4}>
                                        Posts:&nbsp;{this.state.feed.length}
                                    </Grid>
                                    <Grid item xs={4}>
                                        Follows:&nbsp;{this.state.usersFollowed}
                                    </Grid>
                                    <Grid item xs={4}>
                                        Followed By:&nbsp;{this.state.followedByUsers}
                                    </Grid>
                                </Grid>
                                <Typography variant="h6" component="h2" style={{ marginTop: 5 }}>
                                    {this.state.fullName}&nbsp;&nbsp;&nbsp;&nbsp;
                                    <Fab color="secondary" id="edit-name" aria-label="edit" onClick={this.openEditNameModalHandler}>
                                        <EditIcon fontSize="small" />
                                    </Fab>
                                </Typography>
                                <Modal open={this.state.nameEditModalOpen} onClose={this.closeEditNameModalHandler} >
                                    <div className="edit-modal" >
                                        <Typography variant="h5" style={{ paddingBottom: 15 }}>
                                            Edit
                                        </Typography>
                                        <FormControl required>
                                            <InputLabel htmlFor="fullName">Full Name</InputLabel>
                                            <Input id="fullName" type="text" onChange={this.editNameFieldChangeHandler} />
                                            <FormHelperText>
                                                <span className={this.state.nameRequireLabel} style={{ color: "red" }}>required</span>
                                            </FormHelperText>
                                        </FormControl>
                                        <div style={{ marginTop: 25 }}>
                                            <Button variant="contained" color="primary"
                                                onClick={this.editNameUpdateButtonHandler}>UPDATE</Button>
                                        </div>
                                    </div>
                                </Modal>
                            </Grid>

                        </Grid>
                    </div>
                    <div className="imagePosts">
                    <GridList cols={3} cellHeight={300} spacing={1}>
                        {

                            this.state.feed.map((post) => (

                                <GridListTile key={post.id} alt={post.caption}>
                                    <img src={post.media_url} alt={post.caption}></img>
                                </GridListTile>
                            ))
                        }
                    </GridList>
                    </div>
                </div>


        )
    }
}
export default withStyles(styles)(Profile);