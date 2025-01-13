import * as React from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import { List, ListItem, ListItemIcon, ListItemText, Stack } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Alert } from "@mui/material";
import {
  iconButtonStyles,
  searchBoxContainer,
  searchBoxInputStyles,
  searchBoxStackStyles,
  searchButtonStyles,
  searchResultAlertContainerStyles,
  searchResultCardContentStyles,
  searchResultContainer,
  searchResultStackStyles,
} from "./SamagamSearch.styles";
import BadgeIcon from '@mui/icons-material/Badge';
import PlaceIcon from "@mui/icons-material/Place";
import WorkIcon from "@mui/icons-material/Work";
import BusinessIcon from "@mui/icons-material/Business";
import SchoolIcon from "@mui/icons-material/School";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import UpdateIcon from '@mui/icons-material/Update';
import { Config } from "../../config";

// Define Alumni Interface
interface IAlumnus {
  Timestamp: string;
  Email: string;
  Name: string;
  Gender: string;
  Phone: string;
  Location: string;
  FirstJnv: string;
  OtherJnv: string;
  EntryYear: string;
  ExitYear: string;
  EntryClass: string;
  Profile: string;
  Org: string;
  Deg: string;
  Attending: string;
  Donation: string;
}

export const SamagamSearch = () => {
  const [alumni, setAlumni] = React.useState<IAlumnus[]>([]);
  const [searchResult, setSearchResult] = React.useState<IAlumnus[]>([]);

  React.useEffect(() => {
    const random = Math.floor(Math.random() * 9000 + 1000);
    fetch(Config.SamagamDataAPI + "?random=" + random)
      .then((response) => response.json())
      .then((data) => {
        setAlumni(data as IAlumnus[]);
        const value = "Bipul";
        var result = data.find((alumnus: any) => JSON.stringify(alumnus).toLowerCase().includes(value.toLowerCase()));
        console.log(result);
      });
  }, []);

  const onSearchType = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value === "" || value.length < 3) {
      setSearchResult([]);
    } else {
      var result = alumni.filter((alumnus: any) => JSON.stringify(alumnus).toLowerCase().includes(value.toLowerCase()));
      setSearchResult(result);
    }
  };

  return (
    <>
      <Stack direction="row" spacing={0} sx={searchBoxStackStyles}>
        <Paper sx={searchBoxContainer}>
          <IconButton sx={iconButtonStyles} aria-label="menu">
            <PersonIcon />
          </IconButton>
          <InputBase
            onChange={onSearchType}
            sx={searchBoxInputStyles}
            placeholder="Search Alumni"
            inputProps={{ "aria-label": "search alumni" }}
          />
          <IconButton type="button" sx={searchButtonStyles} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Paper>
      </Stack>
      {searchResult.length > 0 && (
        <Stack direction="row" spacing={0} sx={searchResultAlertContainerStyles}>
          <Alert iconMapping={{ success: <CheckCircleOutlineIcon fontSize="inherit" /> }}>{searchResult.length} result(s) found!</Alert>
        </Stack>
      )}

      <Stack direction="row" spacing={0} sx={searchResultStackStyles}>
        {searchResult.map((row) => (
          <Card raised sx={searchResultContainer} key={row.Timestamp}>
            <CardContent sx={searchResultCardContentStyles}>
              <Typography align="center" variant="h6" component="div">
                {row.Name}
              </Typography>
              <List dense={true}>
                <ListItem>
                  <ListItemIcon title="School">
                    <SchoolIcon />
                  </ListItemIcon>
                  <ListItemText primary={row.FirstJnv} />
                </ListItem>
                <ListItem title="Batch">
                  <ListItemIcon>
                    <LocalLibraryIcon />
                  </ListItemIcon>
                  <ListItemText primary={`${row.EntryYear} - ${row.ExitYear}`} />
                </ListItem>
                <ListItem>
                  <ListItemIcon title="Location">
                    <PlaceIcon />
                  </ListItemIcon>
                  <ListItemText primary={row.Location} />
                </ListItem>
                <ListItem title="Profile">
                  <ListItemIcon>
                    <BadgeIcon />
                  </ListItemIcon>
                  <ListItemText primary={row.Profile} />
                </ListItem>
                <ListItem title="Organisation">
                  <ListItemIcon>
                    <BusinessIcon />
                  </ListItemIcon>
                  <ListItemText primary={row.Org} />
                </ListItem>
                <ListItem title="Designation">
                  <ListItemIcon>
                    <WorkIcon />
                  </ListItemIcon>
                  <ListItemText primary={row.Deg} />
                </ListItem>
                <ListItem title="Last Updated">
                  <ListItemIcon>
                  <UpdateIcon />
                  </ListItemIcon>
                  <ListItemText primary={new Date(row.Timestamp).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })} />
                </ListItem>
              </List>

            </CardContent>
          </Card>
        ))}
      </Stack>
    </>
  );
};
