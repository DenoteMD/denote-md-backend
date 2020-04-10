import React, { Component, MouseEvent } from 'react';

import { Theme } from '@material-ui/core';
import { createStyles, WithStyles, withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Typography from '@material-ui/core/Typography';

const styles = (theme: Theme) =>
  createStyles({
    title: {
      color: 'white',
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
  });

interface comState {
  auth: boolean;
  //https://github.com/mui-org/material-ui/issues/8598
  anchorEl?: HTMLButtonElement;
  open: boolean;
}

class Topbar extends Component<WithStyles<typeof styles>, comState> {
  state: comState = {
    auth: true,
    open: false,
  };

  handleMenu = (e: MouseEvent<HTMLElement>) => {
    this.setState({
      anchorEl: e.currentTarget as HTMLButtonElement,
      open: !this.state.open,
    });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;
    const { auth, anchorEl, open } = this.state;

    return (
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <Typography className={classes.title} variant="h6" noWrap>
            DenoteMD
          </Typography>
          {auth && (
            <div>
              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={this.handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={this.handleClose}
              >
                <MenuItem onClick={this.handleClose}>Profile</MenuItem>
                <MenuItem onClick={this.handleClose}>My account</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
    );
  }
}

export default withStyles(styles)(Topbar);
