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

    const validateInput = () => name && gender;

    useEffect(() => {
        const updateInviteContent = async () => {
            try {
                const response = await fetch(Config.SamagamInviteTemplate);
                let template = await response.text();
                const date = new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                });

                template = template
                    .replace('{{NAME}}', name)
                    .replace('{{LINE1}}', line1)
                    .replace('{{LINE2}}', line2)
                    .replace('{{LINE3}}', line3)
                    .replace('{{GENDER}}', gender)
                    .replace('{{DATE}}', date);

                const element = document.getElementById('invite');
                if (element) {
                    element.innerHTML = template;
                } else {
                    console.error('Element with id "invite" not found.');
                }
            } catch (error) {
                console.error('Failed to fetch template:', error);
            }
        };

        updateInviteContent();
    }, [name, line1, line2, line3, gender]);

    const handlePrint = () => {
        const printContents = document.getElementById('invite')?.innerHTML;
        if (printContents) {
            const iframe = document.createElement('iframe');
            iframe.style.position = 'absolute';
            iframe.style.width = '0';
            iframe.style.height = '0';
            iframe.style.border = 'none';
            document.body.appendChild(iframe);

            const doc = iframe.contentWindow?.document;
            if (doc) {
                doc.open();
                doc.write('<html><head><title>Samagam Invitation</title></head><body>');
                doc.write(printContents);
                doc.write('</body></html>');
                doc.close();

                iframe.contentWindow?.focus();
                iframe.contentWindow?.print();
            } else {
                console.error('Failed to access iframe document.');
            }

            document.body.removeChild(iframe);
        } else {
            console.error('Element with id "invite" not found.');
        }
    };

    return (
        <div>
            <Stack spacing={2} direction="column">
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
                        <FormControlLabel value="Sir/Madam" control={<Radio />} label="Both" />
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
            <div hidden id="invite" style={{ width: '602px' }}></div>
        </div>
    );
};
