import React, { Component } from 'react';
import '../home/Home.css'
import Header from '../../common/header/Header';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
class Home extends Component {
    constructor() {
        super();
        this.state = {
            albumData: [],
            imageDetails: [],
            searchMode:false,
            displayImages:[],
        }

    }

    UNSAFE_componentWillMount() {
        let data = null;
        let xhr = new XMLHttpRequest();
        let that = this;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                that.setState({ albumData: JSON.parse(this.responseText).data });
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
        this.state.albumData.map((image) => {
            return this.getImageDetailsById(image.id, image.caption);
        });
    };
    getImageDetailsById = (id, caption) => {
        let that = this;
        let xhr = new XMLHttpRequest();
        let data = null;
        // console.log("post id here :" + id);
        // console.log("post caption here:" + caption);
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                that.setState({
                    imageDetails: that.state.imageDetails.concat(
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

    filterImages = (searchImageCaption) =>{

        let filterImages=this.state.albumData

        if(searchImageCaption.length!==0){
            filterImages = filterImages.filter((image) =>{

                return (typeof image.caption!=="undefined"&&image.caption.toUpperCase().includes(searchImageCaption.toUpperCase())) 
            })
            
        } 
        this.setState({displayImages:filterImages})
    }

    searchImage = (searchImageCaption) => {
        console.log(searchImageCaption)
        this.setState({searchMode:true})
        this.filterImages(searchImageCaption)
    }
    
    render() {
        return (
            <div>
                <Header {...this.props} baseUrl={this.props.baseUrl} searchImage={this.searchImage}/>
                <p>Home Page</p>
                <GridList cols={2}>
                    {this.state.displayImages.map(post => (
                        <GridListTile key={post.id}>
                            {/* <img src={movie.poster_url} className="movie-poster" alt={movie.title} /> */}
                            <GridListTileBar title={post.caption} />
                        </GridListTile>
                    ))}
                </GridList>
                
            </div>
        )
    }
}
export default Home;