import React, { Component } from 'react';
import '../home/Home.css'
import Header from '../../common/header/Header';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import { Button } from '@material-ui/core';
import { Redirect } from 'react-router';

// with styles
const styles = theme => ({
    root: {
        minWidth: 345,
        maxHeight: 360,
    },
    card: {
        margin: "10px",
        maxWidth: 345,
        minWidth: "90%",
        overflow: "visible",
        height: "95%"
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    avatar: {
        backgroundColor: "red",
    },
    cardContent: {
        minHeight: 300,
        width: "90%"
    },
    margin: {
        margin: theme.spacing(1),
    },
    extendedIcon: {
        marginRight: theme.spacing(1),
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 240,
        maxWidth: 370,
    },
    GridListTile: {
        position: 'relative',
        float: 'left',
        width: '100%',
        minHeight: '600px',
        minWidth: '664px',
        overflow: 'hidden',
        height: '100%'
    },
    InputLabel: {
        marginLeft: "15px"
    },
});

// Home - class Component
class Home extends Component {
    constructor() {
        super();
        this.state = {
            albumDataMaster: [],
            albumDataCopy: [], //Copy state used for filter feature
            imageDetailsMaster: [],
            imageDetailsCopy: [],  //Copy state used for filter feature
            tags: "#upgrad #reactjs #imageviewer #user #image",
            feed: [],
            feedCopy: [],  //Copy state used for filter feature
            loggedIn: window.sessionStorage.getItem("access-token") === null ? false : true
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
                    that.setState({ albumDataCopy: JSON.parse(this.responseText).data });
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
                that.setState({
                    imageDetailsCopy: that.state.imageDetailsCopy.concat(
                        JSON.parse(this.responseText)
                    ),
                });
                that.setPostDetails(that.state.imageDetailsCopy);
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
        this.setState({ feedCopy: this.state.feed })
    }

    //Filter happens here for Search Image function 
    filterImages = (searchImageCaption) => {
        let filterImages = this.state.feed;
        if (searchImageCaption.length !== 0) {
            filterImages = filterImages.filter((image) => {

                return (typeof image.caption !== "undefined" && image.caption.toUpperCase().includes(searchImageCaption.toUpperCase()))
            })

        }
        this.setState({ feedCopy: filterImages })
    }

    searchImage = (searchImageCaption) => {
        this.filterImages(searchImageCaption)
    }

    // getting caption for each post, if no caption, caption hardcoded
    captionHandler = (id) => {
        let imageData = [];
        imageData = this.state.albumDataCopy.find((post) => {
            return post.id === id;
        });
        if (typeof imageData.caption === "undefined") {
            imageData.caption = "No Caption - Please comment your views"
        }
        return imageData.caption;
    }

    //function to handle like button and display likes correspondingly
    likeHandler = (post) => {
        let index = this.state.feedCopy.findIndex(postLiked => postLiked.id === post.id);
        var stateCopy = Object.assign({}, this.state);
        stateCopy.feedCopy[index].likes = post.isLiked === true ? post.likes - 1 : post.likes + 1;
        stateCopy.feedCopy[index].isLiked = !post.isLiked
        this.setState(stateCopy);
    }

    // user types comments handled here
    typeCommentHandler = (e, post) => {
        let index = this.state.feedCopy.findIndex(postLiked => postLiked.id === post.id);
        var stateCopy = Object.assign({}, this.state);
        stateCopy.feedCopy[index].addedComment = e.target.value;
        this.setState(stateCopy);
    }

    //add comment button functionality
    addCommentHandler = (post) => {
        let index = this.state.feedCopy.findIndex(postLiked => postLiked.id === post.id);
        var stateCopy = Object.assign({}, this.state);
        stateCopy.feedCopy[index].comments.push(post.addedComment);
        stateCopy.feedCopy[index].addedComment = '';
        this.setState(stateCopy);
    }

    render() {
        const { classes } = this.props;
        return (
            (this.state.loggedIn === false) ? <Redirect to="/" /> :
                <div>
                    <Header {...this.props} baseUrl={this.props.baseUrl} searchImage={this.searchImage} />
                    <div className="GridContainer">
                        <GridList cols={2} cellHeight={800} spacing={1}>
                            {

                                this.state.feedCopy.map((post) => (
                                    <GridListTile key={post.id}>
                                        <Card key={post.id} variant="outlined" className={classes.card}>
                                            {/* card Header - profile pic, username,timestamp */}
                                            <CardHeader
                                                avatar={
                                                    <Avatar src={require("../../assets/profileImage.png")}
                                                        variant="circle" className={classes.avatar} />

                                                }
                                                title={post.username}
                                                subheader={new Date(post.timestamp).toLocaleString().replace(",", "")}
                                            />
                                            <CardContent className={classes.cardContent}>
                                                {/* Image */}
                                                <CardMedia style={{ height: 0, paddingTop: '80%', marginBottom: 10 }}
                                                    image={post.media_url}
                                                    height="140" />
                                                <Divider variant="middle" />
                                                {/* caption and tags */}
                                                <Typography variant="h6" gutterBottom>{post.caption}</Typography>
                                                <Typography variant="subtitle1" color="primary" gutterBottom>{this.state.tags}</Typography>
                                                {/* Likes section */}
                                                <div className='likes'>
                                                    {
                                                        post.isLiked ?
                                                            <FavoriteIcon fontSize='default' style={{ color: "red" }} onClick={() => this.likeHandler(post)} />
                                                            :
                                                            <FavoriteBorderIcon fontSize='default' onClick={() => this.likeHandler(post)} />
                                                    }
                                                    <Typography>
                                                        <span>&nbsp;{post.likes + ' likes'}</span>
                                                    </Typography>
                                                </div><br />
                                                {/* comments section */}
                                                <div className="comments-section">

                                                    {post.comments.map((comment, i) => (

                                                        <section key={i}><Typography>
                                                            <b>{post.username}</b> : {comment}
                                                        </Typography>  </section>
                                                    ))}



                                                </div>
                                                {/* add comments */}
                                                <div className="addComentsSection">
                                                    <FormControl className={classes.formControl}>
                                                        <InputLabel htmlFor={"addComment" + post.id}>Add Comment</InputLabel>
                                                        <Input id={"addComment " + post.id}
                                                            className="addComment"
                                                            onChange={(e) => this.typeCommentHandler(e, post)}
                                                            value={post.addedComment} />
                                                    </FormControl>
                                                    <div className='add-button'>
                                                        <FormControl>
                                                            <Button
                                                                variant='contained'
                                                                color='primary'
                                                                onClick={() => this.addCommentHandler(post)}>ADD</Button>
                                                        </FormControl>
                                                    </div>

                                                </div><br />
                                            </CardContent>
                                        </Card>
                                    </GridListTile>
                                ))
                            }
                        </GridList>
                    </div>
                </div>
        )
    }
}
export default withStyles(styles)(Home);