import React, {useState, useEffect,useRef} from "react";
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite';
import CommentIcon from '@material-ui/icons/Comment';
import { Link } from 'react-router-dom';
import { Container } from "@material-ui/core";
import Comment from "../Comment/Comment";
import CommentForm from "../Comment/CommentForm";
const useStyles = makeStyles((theme) => ({
    root: {
     width:800,
     textAlign:"left",
     margin:20
    },
    media: {
      height: 0,
      paddingTop: '56.25%', // 16:9
    },
    expand: {
      transform: 'rotate(0deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    avatar: {
    background:'linear-gradient(45deg,#2196F3 30%,#21CBF3 90%)'
    },
    link: {
        textDecoration : "none",
        boxShadow : "none",
        color : "white"
    }
  }));

function Post(props) {
const{title,text,userId,userName,postId,likes}=props;
const classes = useStyles();
const [expanded, setExpanded] = React.useState(false);
const [isLiked, setIsLiked] = React.useState(false);
const [error,setError]=useState(null);
const [isLoaded,setIsLoaded]=useState(false);
const [commentList,setCommentList]=useState([]);
const isInitialMount=useRef(true);
const [likeCount,setLikeCount]=useState(likes.length);
const [likeId,setLikeId]=useState(null);
let disabled=localStorage.getItem("currentUser")==null?true:false;
const handleExpandClick = () => {
  setExpanded(!expanded);
  refreshComments();
};

const saveLike=()=>{
  fetch("/likes",
  {
  method:"POST",
  headers:{
    "Content-Type":"application/json",
    "Authorization":localStorage.getItem("tokenKey")
  },
  body:JSON.stringify({
    postId:postId,
    userId:localStorage.getItem("currentUser"),

  }),
  
  }).
  then((res)=>res.json()).
  catch((err)=>console.log("error"))
}

const deleteLike=()=>{
fetch("/likes/"+likeId,
{
  method:"DELETE",
  headers:{
    "Authorization":localStorage.getItem("tokenKey")
  }

}).then((res)=>res.json()).
catch((err)=>console.log("error"))
}
const handleLike = () => {
    setIsLiked(!isLiked);
    if(!isLiked)
    {
      saveLike();
      setLikeCount(likeCount+1);
        
    }
    else{  
      deleteLike();
      setLikeCount(likeCount-1);
     
    }
  };
  



  const refreshComments=()=>{
    fetch("/comments?postId="+postId)
    .then(res=>res.json())
    .then(
        (result)=>{
        setIsLoaded(true);
        setCommentList(result)
                  },
        (error)=>{
            setIsLoaded(true);
            setError(error);
        })
}
useEffect(()=>{
if(isInitialMount.current)
{
  isInitialMount.current=false;
}
else{
refreshComments();
}},[commentList])

const checkLikes=()=>{
var likeControl=likes.find(like=>""+like.userId===localStorage.getItem("currentUser"));
if(likeControl)
{
  setLikeId(likeControl.id);
setIsLiked(true);
}

}

useEffect(()=>{
  checkLikes();
},[])

return(
   
        <Card className={classes.root}>
      <CardHeader
        avatar={
            <Link className={classes.link} to={{pathname:'/users/'+ userId}}>
          <Avatar aria-label="recipe" className={classes.avatar}>
            {userName.charAt(0).toUpperCase()}
          </Avatar>
          </Link>
        }
        
        title={title}
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
         {text}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton
        disabled={disabled}
         onClick={handleLike}
         aria-label="add to favorites">
          <FavoriteIcon style={isLiked?{color:"red"}:null} />
         
        </IconButton>{likeCount}
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <CommentIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Container fixed className={classes.container}>
{
  error?"error":
  isLoaded?commentList.map(comment=>(
    <Comment userId={1} userName={"USER"} text={comment.text}></Comment>
  )):"Loading"
}
{/*dşsabled de kullanabilirdik farketmez*/localStorage.getItem("currentUser")==null?"":<CommentForm userId={localStorage.getItem("currentUser")} userName={localStorage.getItem("userName")} postId={postId}></CommentForm>
}
          </Container>
        </CardContent>
      </Collapse>
    </Card>
   
)
   
    }

                    
export default Post;