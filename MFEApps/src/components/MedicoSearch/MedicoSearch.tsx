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
} from "./MedicoSearch.styles";
import BadgeIcon from '@mui/icons-material/Badge';
import PlaceIcon from "@mui/icons-material/Place";
import WorkIcon from "@mui/icons-material/Work";
import BusinessIcon from "@mui/icons-material/Business";
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import SchoolIcon from "@mui/icons-material/School";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import ClassIcon from '@mui/icons-material/Class';
import { Config } from "../../config";

// Define Alumni Interface
interface IMedico {
  Timestamp: string;
  Email: string;
  Name: string;
  Gender: string;
  Phone: string;
  Location: string;
  FirstJnv: string;
  EntryYear: string;
  EntryClass: string;
  Batch: number;
  Practice: string;
  Degree: string;
  Specialization: string;
  College: string;
  Org: string;
  Deg: string;
}

export const MedicoSearch = () => {
  const [alumni, setAlumni] = React.useState<IMedico[]>([]);
  const [searchResult, setSearchResult] = React.useState<IMedico[]>([]);

  React.useEffect(() => {
    const random = Math.floor(Math.random() * 9000 + 1000);
    fetch(Config.MedicoDataAPI + "?random=" + random)
      .then((response) => response.json())
      .then((data) => {
        setAlumni(data as IMedico[]);
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
            placeholder="Search Medico"
            inputProps={{ "aria-label": "search medico" }}
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
                  <ListItemText primary={`${row.FirstJnv} (${row.Batch})`} />
                </ListItem>
                <ListItem>
                  <ListItemIcon title="Location">
                    <PlaceIcon />
                  </ListItemIcon>
                  <ListItemText primary={row.Location} />
                </ListItem>
                <ListItem>
                  <ListItemIcon title="Practice">
                    <BadgeIcon />
                  </ListItemIcon>
                  <ListItemText primary={row.Practice} />
                </ListItem>
                <ListItem>
                  <ListItemIcon title="Degree">
                    <ClassIcon />
                  </ListItemIcon>
                  <ListItemText primary={row.Degree} />
                </ListItem>
                {
                  row.Specialization && (
                    <ListItem>
                      <ListItemIcon title="Degree">
                        <WorkspacePremiumIcon />
                      </ListItemIcon>
                      <ListItemText primary={row.Specialization} />
                    </ListItem>
                  )
                }
                {
                  row.Practice.includes("Practicing ") ? (
                    <>
                      {
                        row.Org && (
                          <ListItem title="Organisation">
                            <ListItemIcon>
                              <BusinessIcon />
                            </ListItemIcon>
                            <ListItemText primary={row.Org} />
                          </ListItem>
                        )
                      }
                      {
                        row.Deg && (
                          <ListItem title="Designation">
                            <ListItemIcon>
                              <MedicalServicesIcon />
                            </ListItemIcon>
                            <ListItemText primary={row.Deg} />
                          </ListItem>
                        )
                      }
                    </>
                  ) : (
                    <>
                      {
                        row.Org && (
                          <ListItem title="Organisation">
                            <ListItemIcon>
                              <BusinessIcon />
                            </ListItemIcon>
                            <ListItemText primary={row.College} />
                          </ListItem>
                        )
                      }
                    </>
                  )
                }
                <ListItem>
                  <ListItemIcon title="Email">
                    <EmailIcon />
                  </ListItemIcon>
                  <ListItemText primary={<a href={`mailto:${row.Email}`}>{row.Email}</a>} />
                </ListItem>
                <ListItem>
                  <ListItemIcon title="Phone">
                    <PhoneIcon />
                  </ListItemIcon>
                  <ListItemText primary={<a href={`tel:${row.Phone}`}>{row.Phone}</a>} />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </>
  );
};
