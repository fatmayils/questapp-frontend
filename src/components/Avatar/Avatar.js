import React, {useState, useEffect,useRef} from "react";
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { Radio } from "@material-ui/core";
function getModalStyle() {
    const top = 50 + rand();
    const left = 50 + rand();
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }
  function rand() {
    return Math.round(Math.random() * 20) - 10;
  }
  
const useStyles = makeStyles({
  root: {
    maxWidth: 345,
    margin:50
  },
  media: {
    
  },
  modal:{
      display:"flex",
      maxWidth:200,
  }
  
});

 function Avatar(props) {
     const {avatarId}=props;
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] =useState(avatarId);

  const saveAvatar = () => {
    console.log("HELLO")
    fetch("/users/"+localStorage.getItem("currentUser"), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization" : localStorage.getItem("tokenKey"),
      },
      body: JSON.stringify({
        avatar: selectedValue,
      }),
    })
      .then((res) => res.json())
      .catch((err) => console.log(err))
    }
const handleChange=(event)=>{
    setSelectedValue(event.target.value);
}
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    saveAvatar();
  };
  return (
      <div>
    <Card className={classes.root}>
        <CardMedia
          component="img"
          alt="User Avatar"
          className={classes.media}
          image={`/avatars/avatar${selectedValue}.png`}
          title="User Avatar"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {localStorage.getItem("userName")}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
           User Info
          </Typography>
        </CardContent>
      <CardActions>
        <Button size="small" color="primary"  onClick={handleOpen}>
         Change Avatar
        </Button>
      </CardActions>
    </Card>
<Modal
className={classes.modal}
  open={open}
  onClose={handleClose}
  aria-labelledby="simple-modal-title"
  aria-describedby="simple-modal-description"
>
  <div> <List dense className={classes.root}>
      {[ 1, 2, 3,4,5,6].map((value) => {
        const labelId = `checkbox-list-secondary-label-${value}`;
        return (
          <ListItem key={value} button>
            <CardMedia
          component="img"
          alt="User Avatar"
          className={classes.media}
          style={{minWidth:100}}
          image={`/avatars/avatar${value}.png`}
          title="User Avatar"
        />
            <ListItemSecondaryAction>
              <Radio
                edge="end"
                value={value}
                onChange={handleChange}
                checked={""+selectedValue===""+value}
                inputProps={{ 'aria-labelledby': labelId }}
              />
            </ListItemSecondaryAction>
          </ListItem>
        );
      })}
    </List></div>
</Modal>
    </div>
  );
}

export default Avatar;