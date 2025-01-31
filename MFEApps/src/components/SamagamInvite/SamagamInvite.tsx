import React, { useState, useEffect } from 'react';
import { TextField, Button, Stack, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import { Config } from '../../config';

const inputStyle: React.CSSProperties = {
    width: '320px',
};

const buttonStyle: React.CSSProperties = {
    width: '110px',
    marginTop: '30px',
};

export const SamagamInvite = () => {
    const [name, setName] = useState('');
    const [line1, setLine1] = useState('');
    const [line2, setLine2] = useState('');
    const [line3, setLine3] = useState('');
    const [gender, setGender] = useState('');

    const validateInput = () => {
        return name && gender;
    }

    useEffect(() => {
        const updateInviteContent = async () => {
            const response = await fetch(Config.SamagamInviteTemplate);
            let template = await response.text();
            template = template.replace('{{NAME}}', name);
            template = template.replace('{{LINE1}}', line1);
            template = template.replace('{{LINE2}}', line2);
            template = template.replace('{{LINE3}}', line3);
            template = template.replace('{{GENDER}}', gender);

            const element = document.getElementById('invite');
            if (element) {
                element.innerHTML = template;
            } else {
                console.error('Element with id "invite" not found.');
            }
        };

        updateInviteContent();
    }, [name, line1, line2, line3, gender]);

    const handlePrint = () => {
        const printContents = document.getElementById('invite')?.innerHTML;
        if (printContents) {
            if (window.innerWidth <= 768) { // Check if the device is mobile
                const printWindow = window.open('', '', 'height=600,width=720');
                if (printWindow) {
                    printWindow.document.write('<html><head><title>Samagam Invitation</title>');
                    printWindow.document.write('</head><body >');
                    printWindow.document.write(printContents);
                    printWindow.document.write('</body></html>');
                    printWindow.document.close();
                    printWindow.print();
                } else {
                    console.error('Failed to open print window.');
                }
            } else {
                if (printContents) {
                    const originalContents = document.body.innerHTML;
                    document.body.innerHTML = printContents;
                    window.print();
                    document.body.innerHTML = originalContents;
                    window.location.reload();
                } else {
                    console.error('Element with id "invite" not found.');
                }
            }
        } else {
            console.error('Element with id "invite" not found.');
        }
    };

    return (
        <>
            <div>
                <Stack spacing={2} direction={'column'}>
                    <FormControl>
                        <FormLabel id="gender">Gender</FormLabel>
                        <RadioGroup
                            row
                            aria-labelledby="gender"
                            name="gender"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                        >
                            <FormControlLabel value="Sir" control={<Radio />} label="Male" />
                            <FormControlLabel value="Madam" control={<Radio />} label="Female" />
                        </RadioGroup>
                    </FormControl>
                    <TextField style={inputStyle} id="name" label="Recipient's Name" variant="standard" onChange={(e) => setName(e.target.value)} />
                    <TextField style={inputStyle} id="line1" label="Line 1" variant="standard" onChange={(e) => setLine1(e.target.value)} />
                    <TextField style={inputStyle} id="line2" label="Line 2" variant="standard" onChange={(e) => setLine2(e.target.value)} />
                    <TextField style={inputStyle} id="line3" label="Line 3" variant="standard" onChange={(e) => setLine3(e.target.value)} />
                    <Button
                        style={buttonStyle}
                        variant="contained"
                        onClick={handlePrint}
                        disabled={!validateInput()}
                    >
                        Download
                    </Button>
                </Stack>
                <div hidden={true} id='invite' style={{ width: '602px' }}></div>
            </div>
        </>
    );
};