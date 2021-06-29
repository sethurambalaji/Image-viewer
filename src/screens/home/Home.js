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

const styles = theme => ({
    root: {
        maxWidth: 345,
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    avatar: {
        backgroundColor: "red",
    },
});

class Home extends Component {
    constructor() {
        super();
        this.state = {
            albumDataMaster: [],
            albumDataCopy: [],
            imageDetailsMaster: [],
            imageDetailsCopy: [],
        }

    }

    UNSAFE_componentWillMount() {
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
                that.setState({
                    imageDetailsCopy: that.state.imageDetailsCopy.concat(
                        JSON.parse(this.responseText)
                    ),
                });
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

    filterImages = (searchImageCaption) => {

        let filterImages = this.state.albumDataMaster;

        if (searchImageCaption.length !== 0) {
            filterImages = filterImages.filter((image) => {

                return (typeof image.caption !== "undefined" && image.caption.toUpperCase().includes(searchImageCaption.toUpperCase()))
            })

        }

        let searchResultFeed = []
        searchResultFeed = this.state.imageDetailsMaster.filter((postDetails) => {
            return filterImages.find((post) => {
                return postDetails.id === post.id
            });
        })
        this.setState({ imageDetailsCopy: searchResultFeed })
    }

    searchImage = (searchImageCaption) => {
        console.log(searchImageCaption)
        this.filterImages(searchImageCaption)
    }

    captionHandler = (id) => {
        let imageData = [];
        imageData = this.state.albumDataCopy.find((post) => {
            return post.id === id;
        });
        return imageData.caption;
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <Header {...this.props} baseUrl={this.props.baseUrl} searchImage={this.searchImage} />
                <div className="GridContainer">
                    <GridList cols={2} cellHeight={480} spacing={6}>
                        {
                            this.state.imageDetailsCopy.map((post) => (

                                <GridListTile key={post.id}>
                                    <Card key={post.id} variant="outlined">
                                        <CardHeader
                                            avatar={
                                                <Avatar variant="circle" className={classes.avatar}>
                                                    S
                                                </Avatar>
                                            }
                                            title={post.username}
                                            subheader={new Date(post.timestamp).toLocaleString().replace(",", "")}
                                        />
                                        <CardMedia style={{ height: 0, paddingTop: '80%', marginBottom: 10 }}
                                            image={post.media_url} />
                                        <Divider variant="middle" />

                                        <CardContent>
                                            <Typography>{this.captionHandler(post.id)}</Typography>
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
export default withStyles(styles)(Home);;