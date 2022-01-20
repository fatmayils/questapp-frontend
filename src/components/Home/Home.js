import React, {useState, useEffect} from "react";
import Post from '../Post/Post';
import { makeStyles } from '@material-ui/core/styles';
import PostForm from "../Post/PostForm";

const useStyles = makeStyles((theme) => ({
   container:{
       display:"flex",//satıra sığmayan aşağı geççek
       flexWrap:"wrap",
       justifyContent:"center",//satırdaki elemanlar aşağıda buluncak
       alignItems:"center",//o satırdaki eleman yukarıdan aşağı ortada olcak
       backgroundColor:'#f0f5ff',

   }
 
  }));


export default function Home() {
    const [error,setError]=useState(null);
    const [isLoaded,setIsLoaded]=useState(false);
    const [postList,setPostList]=useState([]);
    const classes = useStyles();
const refreshPosts=()=>{
    fetch("/posts")
    .then(res=>res.json())
    .then(
        (result)=>{
        setIsLoaded(true);
        setPostList(result)
                  },
        (error)=>{
            setIsLoaded(true);
            setError(error);
        })
}

    useEffect(()=>{
        refreshPosts()
        },[postList])
            
            if(error) {
                return <div>
                    Error   
                </div>
                      }
            else if(!isLoaded) {
                return <div> Loading</div>
            }      
            else{
               return(
                   <div className={classes.container}>
                       {localStorage.getItem("currentUser")==null?"":<PostForm userId={localStorage.getItem("currentUser")} userName={localStorage.getItem("userName")}  refreshPosts={refreshPosts}/>
}
             {postList.map(
              post=>(
             <Post likes={post.postLikes} postId={post.id} userId={post.userId} userName={post.userName} title={post.title} text={post.text}></Post>
               ))}
                   </div>
               )
                    ;}
}
