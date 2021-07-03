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
import FavoriteIconBorder from '@material-ui/icons/FavoriteBorder';
import FavoriteIconFill from '@material-ui/icons/Favorite';
import IconButton from '@material-ui/core/IconButton';

// Styles
const styles = theme => ({
    avatar: {
        width: theme.spacing(15),
        height: theme.spacing(15),
        backgroundColor: "red",
    },
    GridList: {
        margin: theme.spacing(0, 15),
    },
    GridListTile: {
        '&:hover': {
            cursor: 'pointer',
        }
    },

    // Image Details Modal style
    openedImageObjModal: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "white-smoke",
        OverflowEvent: "auto"
    },

    // styles for Modals and inside it
    openedImageObjContainer: { display: 'flex', flexDirection: 'row', backgroundColor: "#fff", width: '70%', height: '70%' },
    openedImageObjContainerRow1: { width: '50%', padding: 10 },
    openedImageObjContainerRow2: { display: 'flex', flexDirection: 'column', width: '50%', padding: 10 },
    openedImageObjContainerRow21: { borderBottom: '2px solid #c0c0c0', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' },
    openedImageObjContainerRow22: { display: 'flex', height: '100%', flexDirection: 'column', justifyContent: 'space-between' }
});

// Profile - class Component
class Profile extends Component {
    constructor() {
        super();
        this.state = {
            username: "gmaster_balzz",
            usersFollowed: Math.floor(Math.random() * 50), //No data in API - hardcoded
            followedByUsers: Math.floor(Math.random() * 50), //No data in API - hardcoded
            fullName: "Sethurambalaji", //No data in API - hardcoded
            albumDataMaster: [],
            imageDetailsMaster: [],
            tags: "#upgrad #reactjs #imageviewer #user #image", //No data in API - hardcoded
            feed: [],
            isloggedIn: window.sessionStorage.getItem("access-token") === null ? false : true,
            nameEditModalOpen: false,
            nameEditModalClose: true,
            nameRequireLabel: "hide",
            imageDetailsModal: false,
            selectedImage: null,
            addedComment: ""
        }
    }

    //getting data from API 1
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

    //getting data from API 2 using API 1 data 
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

    //Integrating API1 and API2 data to a single object and assigned as state
    setPostDetails = (albumDetails) => {
        let arr = this.state.feed;
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

    // getting caption for each post, if no caption, caption hardcoded
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

    // On opening Edit name Modal Handler
    openEditNameModalHandler = () => {
        this.setState({ nameEditModalOpen: true, nameEditModalClose: false })
    }

    // On closing Edit Name Modal Handler
    closeEditNameModalHandler = () => {
        this.setState({ newFullName: '' })
        this.setState({ nameRequireLabel: "hide" })
        this.setState({ nameEditModalOpen: false, nameEditModalClose: true })
    }

    // Edit name on change Handler
    editNameFieldChangeHandler = (e) => {
        this.setState({ newFullName: e.target.value })
    }

    // Edit Modal - name  update on click Handler
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

    // Image on click Handler
    postClickHandler = (post) => {
        console.log("postClickHandler");
        console.log(post.media_url);
        this.setState({ imageDetailsModal: true })
        this.setState({ selectedImage: post })

    }

    // on close Image details Modal handler
    closeImageDetailsModal = () => {
        this.setState({ imageDetailsModal: false })
        this.setState({ addedComment: "" })
    }

    //function to handle like button and display likes correspondingly
    likeHandler = (post) => {
        let index = this.state.feed.findIndex(postLiked => postLiked.id === post.id);
        var stateCopy = Object.assign({}, this.state);
        stateCopy.feed[index].likes = post.isLiked === true ? post.likes - 1 : post.likes + 1;
        stateCopy.feed[index].isLiked = !post.isLiked
        stateCopy.selectedImage.likes = stateCopy.feed[index].likes;
        stateCopy.selectedImage.isLiked = stateCopy.feed[index].isLiked;
        this.setState(stateCopy);
    }

    // user types comments handled here
    typeCommentHandler = (e, post) => {

        let index = this.state.feed.findIndex(postLiked => postLiked.id === post.id);
        var stateCopy = Object.assign({}, this.state);
        stateCopy.feed[index].addedComment = e.target.value;
        stateCopy.selectedImage.addedComment = stateCopy.feed[index].addedComment

        this.setState(stateCopy);
        console.log(this.state.selectedImage.addedComment)
    }

    //add comment button functionality
    addCommentHandler = (post) => {
        let index = this.state.feed.findIndex(postLiked => postLiked.id === post.id);
        var stateCopy = Object.assign({}, this.state);
        stateCopy.feed[index].comments.push(post.addedComment);
        stateCopy.feed[index].addedComment = '';
        stateCopy.selectedImage.comments = stateCopy.feed[index].comments
        this.setState(stateCopy);
    }

    render() {
        const { classes } = this.props;
        return (
            (this.state.isloggedIn === false) ? <Redirect to="/" /> :
                <div>
                    <Header />
                    {/* Information Section */}
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
                                {/* Information Section */}
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
                                {/* Name Edit Modal. */}
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
                    {/* Image Posts Section */}
                    <div className="imagePosts">
                        <GridList cols={3} cellHeight={300} spacing={1}>
                            {

                                this.state.feed.map((post) => (

                                    <GridListTile key={post.id} alt={post.caption} onClick={() => this.postClickHandler(post)}>
                                        <img src={post.media_url} alt={post.caption}></img>
                                    </GridListTile>
                                ))
                            }
                        </GridList>
                        {/*Image Details Modal Section */}
                        {(this.state.selectedImage !== null) ?
                            <Modal
                                open={this.state.imageDetailsModal}
                                onClose={this.closeImageDetailsModal}
                                className={classes.openedImageObjModal}
                            >
                                {/* Image details Modal - left- Image */}
                                <div className={classes.openedImageObjContainer}>
                                    <div className={classes.openedImageObjContainerRow1}>
                                        <img style={{ cursor: 'pointer', height: '100%', width: '100%' }}
                                            src={this.state.selectedImage.media_url}
                                            alt={this.state.selectedImage.caption} />
                                    </div>
                                    {/* Image details Modal - Right*/}
                                    <div className={classes.openedImageObjContainerRow2}>
                                        {/* Profile Pic and user name */}
                                        <div className={classes.openedImageObjContainerRow21}>
                                            <Avatar
                                                alt="profile-image"
                                                src={require("../../assets/profileImage.png")}
                                                style={{ cursor: 'pointer', width: "50px", height: "50px", margin: '10px' }} />
                                            <Typography component="p" style={{ fontWeight: 'bold' }}>
                                                {this.state.username}
                                            </Typography>
                                        </div>
                                        {/* Image details Modal - left- Caption, tags, Comments */}
                                        <div className={classes.openedImageObjContainerRow22}>
                                            <div>
                                                <Typography component="p" style={{ fontWeight: 'bold', marginLeft: '5px', paddingTop: '8px' }}>
                                                    {this.state.selectedImage.caption}
                                                </Typography>
                                                <Typography style={{ color: '#4dabf5', marginLeft: '5px' }} component="p" >
                                                    {this.state.tags}
                                                </Typography>
                                                <div className="comments-section">
                                                    {this.state.selectedImage.comments.map((comment, i) => (
                                                        <Typography key={i} component="p" style={{ fontWeight: 'bold' }}>{this.state.username} :&nbsp;{comment}</Typography>
                                                    ))}
                                                </div>
                                            </div>
                                            {/*Likes Section - Image details Modal */}
                                            <div>
                                                <div className="row">
                                                    <Typography component="p" style={{ fontWeight: 'bold' }}>
                                                        <IconButton aria-label="Add to favorites" onClick={() => this.likeHandler(this.state.selectedImage)}>
                                                            {this.state.selectedImage.isLiked && <FavoriteIconFill style={{ color: '#F44336' }} />}
                                                            {!this.state.selectedImage.isLiked && <FavoriteIconBorder />}
                                                        </IconButton>

                                                        {this.state.selectedImage.likes} likes
                                                    </Typography>
                                                </div>
                                                {/*Add Comment - Image details Modal */}
                                                <div className="row addCommentSection">
                                                    <FormControl style={{ flexGrow: 1 }}>
                                                        <InputLabel htmlFor="addComment">Add a comment</InputLabel>
                                                        <Input id="addComment" value={this.state.selectedImage.addedComment} onChange={(e) => this.typeCommentHandler(e, this.state.selectedImage)} />
                                                    </FormControl>
                                                    <FormControl>
                                                        <Button onClick={() => this.addCommentHandler(this.state.selectedImage)}
                                                            variant="contained" color="primary">
                                                            ADD
                                                        </Button>
                                                    </FormControl>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </Modal>
                            :
                            null}
                    </div>
                </div>
        )
    }
}
export default withStyles(styles)(Profile);