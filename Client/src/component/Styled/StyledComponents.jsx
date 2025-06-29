import { styled } from "@mui/material";
import {Link as LinkComponent} from "react-router-dom";
import {Link as ChatLink} from "react-router-dom"

export const Link=styled(LinkComponent)`
display: flex;
  align-items: center;
  padding: 10px 15px;
  text-decoration: none;
  background-color: ${(props) => (props.active ? "lightblue" : "transparent")};
  color:${(props) => (props.active ? "blue" : "black")};;
  border-radius: 0;
  border-left: ${(props) => (props.active ? "3px solid blue" : "none")};
  transition: all 0.3s ease;
  &:hover {
    background-color: rgba(214, 221, 214, 0.84); /* Light green hover effect */
  }
`
export const cLink=styled(ChatLink)`
display:flex;
padding: 10px 15px;
text-decoration: none;
color:#A879F8;
&:hover {
        cursor:pointer;
        background-color: #0A364E;
    }
`

export const SearchField=styled("input")`
  height:2rem;
  font-size: 14px;
  color:rgb(5, 5, 5); /* Grey text */
  width: 100%; /* Take full width */
  ::placeholder {
    color:rgb(255, 255, 255); /* Lighter grey for placeholder */
  }
`

export const InputBox=styled("input")`
width:100%;
height:100%;
border:none;
background-color:rgb(241, 239, 239);
outline:none;
color:rgb(0,0,0);
border-radius:4px;
`