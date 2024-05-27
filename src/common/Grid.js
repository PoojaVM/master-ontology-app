import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import MoreMenu from "./MoreMenu";
import apiService from '../api/concepts';
import { useAuth } from '../contexts/AuthContext';


// Sample data - to be replaced by data from API call to DynamoDB
const data = [
  {
    conceptid: 1,
    displayName: "Diagnosis",
    description: "Entity domain",
    parentIds: null,
    childIds: "2,3",
    alternateNames: null,
  },
  {
    conceptid: 2,
    displayName: "Disease of Nervous System",
    description: "Diseases targeting the nervous system",
    parentIds: "1",
    childIds: "4",
    alternateNames: null,
  },
  {
    conceptid: 3,
    displayName: "Disease of Eye",
    description: "Diseases targeting the eye",
    parentIds: "1",
    childIds: "8,9",
    alternateNames: null,
  },
  {
    conceptid: 4,
    displayName: "Physical Disorders",
    description: "Physical Disorders",
    parentIds: "1",
    childIds: "8,9",
    alternateNames: null,
  },
  {
    conceptid: 5,
    displayName: "Multiple Sclerosis (MS)",
    description: "Multiple Sclerosis",
    parentIds: "2,4",
    childIds: "5,6,7",
    alternateNames: "MS,name1,name2",
  },
];

const Grid = () => {
  const { authUser } = useAuth();
  const [concepts, setConcepts] = useState([]);

  useEffect(() => {
    const fetchConcepts = async () => {
      try {
        const data = await apiService.getConcepts(authUser?.tokens?.idToken?.toString());
        setConcepts(data);
        console.log('Concepts:', data);
      } catch (error) {
        console.error('Error fetching concepts:', error);
      }
    };

    fetchConcepts();
  }, []);
  const onDeleteConcept = (conceptid) => {
    // Add logic to delete concept from the database
    console.log(`Deleting concept with ID: ${conceptid}`);
  };

  const onEditConcept = (concept) => {
    // Add logic to edit concept
    console.log(`Editing concept with ID: ${concept.conceptid}`);
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Concept ID</TableCell>
              <TableCell align="right">Display Name</TableCell>
              <TableCell align="right">Description</TableCell>
              <TableCell align="right">Parent Concept IDs</TableCell>
              <TableCell align="right">Child Concept IDs</TableCell>
              <TableCell align="right">Alternate Names</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow
                key={row.conceptid}
                onClick={() => onEditConcept(row)}
                sx={{ cursor: "pointer" }}
              >
                <TableCell component="th" scope="row">
                  {row.conceptid}
                </TableCell>
                <TableCell align="right">{row.displayName}</TableCell>
                <TableCell align="right">{row.description}</TableCell>
                <TableCell align="right">{row.parentIds}</TableCell>
                <TableCell align="right">{row.childIds}</TableCell>
                <TableCell align="right">{row.alternateNames}</TableCell>
                <TableCell align="center">
                  <MoreMenu
                    handleEdit={() => onEditConcept(row)}
                    handleDelete={() => onDeleteConcept(row.conceptid)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Grid;

// import React, { useEffect, useState } from 'react';
// import apiService from '../api/concepts';
// import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
// import { useAuth } from '../contexts/AuthContext';

// // Sample data - to be replaced by data from API call to DynamoDB
// const data = [
//     { conceptId: 1, displayName: 'Diagnosis', description: 'Entity domain', parentIds: null, childIds: '2,3', alternateNames: null },
//     { conceptId: 2, displayName: 'Disease of Nervous System', description: 'Diseases targeting the nervous system', parentIds: '1', childIds: '4', alternateNames: null },
//     { conceptId: 3, displayName: 'Disease of Eye', description: 'Diseases targeting the eye', parentIds: '1', childIds: '8,9', alternateNames: null },
//     { conceptId: 4, displayName: 'Physical Disorders', description: 'Physical Disorders', parentIds: '1', childIds: '8,9', alternateNames: null },
//     { conceptId: 5, displayName: 'Multiple Sclerosis (MS)', description: 'Multiple Sclerosis', parentIds: '2,4', childIds: '5,6,7', alternateNames: 'MS,name1,name2' },
// ];
  

// const Grid = () => {
//   const { authUser } = useAuth();
//   const [concepts, setConcepts] = useState([]);

//   useEffect(() => {
//     const fetchConcepts = async () => {
//       try {
//         const data = await apiService.getConcepts(authUser?.tokens?.idToken?.toString());
//         setConcepts(data);
//         console.log('Concepts:', data);
//       } catch (error) {
//         console.error('Error fetching concepts:', error);
//       }
//     };

//     fetchConcepts();
//   }, []);

//   return (
//     <div>
//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Concept ID</TableCell>
//               <TableCell align="right">Display Name</TableCell>
//               <TableCell align="right">Description&nbsp;(g)</TableCell>
//               <TableCell align="right">Parent Concept IDs&nbsp;(g)</TableCell>
//               <TableCell align="right">Child Concept IDs&nbsp;(g)</TableCell>
//               <TableCell align="right">Alternate Names&nbsp;(g)</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {data.map((row) => (
//               <TableRow key={row.name}>
//                 <TableCell component="th" scope="row">
//                   {row.conceptId}
//                 </TableCell>
//                 <TableCell align="right">{row.displayName}</TableCell>
//                 <TableCell align="right">{row.description}</TableCell>
//                 <TableCell align="right">{row.parentIds}</TableCell>
//                 <TableCell align="right">{row.childIds}</TableCell>
//                 <TableCell align="right">{row.alternateNames}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </div>
//   );
// };

// export default Grid;
