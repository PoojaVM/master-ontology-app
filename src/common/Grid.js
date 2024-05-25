import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

// Sample data - to be replaced by data from API call to DynamoDB
const data = [
    { conceptId: 1, displayName: 'Diagnosis', description: 'Entity domain', parentIds: null, childIds: '2,3', alternateNames: null },
    { conceptId: 2, displayName: 'Disease of Nervous System', description: 'Diseases targeting the nervous system', parentIds: '1', childIds: '4', alternateNames: null },
    { conceptId: 3, displayName: 'Disease of Eye', description: 'Diseases targeting the eye', parentIds: '1', childIds: '8,9', alternateNames: null },
    { conceptId: 4, displayName: 'Physical Disorders', description: 'Physical Disorders', parentIds: '1', childIds: '8,9', alternateNames: null },
    { conceptId: 5, displayName: 'Multiple Sclerosis (MS)', description: 'Multiple Sclerosis', parentIds: '2,4', childIds: '5,6,7', alternateNames: 'MS,name1,name2' },
];
  

const Grid = () => {

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Concept ID</TableCell>
              <TableCell align="right">Display Name</TableCell>
              <TableCell align="right">Description&nbsp;(g)</TableCell>
              <TableCell align="right">Parent Concept IDs&nbsp;(g)</TableCell>
              <TableCell align="right">Child Concept IDs&nbsp;(g)</TableCell>
              <TableCell align="right">Alternate Names&nbsp;(g)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                  {row.conceptId}
                </TableCell>
                <TableCell align="right">{row.displayName}</TableCell>
                <TableCell align="right">{row.description}</TableCell>
                <TableCell align="right">{row.parentIds}</TableCell>
                <TableCell align="right">{row.childIds}</TableCell>
                <TableCell align="right">{row.alternateNames}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Grid;
