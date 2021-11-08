import React from 'react';
import { IPrebidAuctionEndEventData, IPrebidDetails } from "../../../../inject/scripts/prebid";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

const SlotsComponent = ({ prebid }: ISlotsComponentProps): JSX.Element => {
  const adUnits = prebid.events.filter(event => event.eventType === 'auctionEnd').map(event => (event as IPrebidAuctionEndEventData).args.adUnits).flat() || [];
  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell variant="head">Code</TableCell>
            <TableCell variant="head">Media Types</TableCell>
            <TableCell variant="head">Bidders</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {adUnits.map((adUnit: any, index) => (
            <TableRow key={index} sx={{ verticalAlign: 'top', '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell variant="body"><strong>{adUnit.code}</strong></TableCell>
              <TableCell variant="body">
                Banner Sizes:
                <Stack direction="row" sx={{ flexWrap: 'wrap', gap: '5px' }}>
                  {adUnit.mediaTypes?.banner?.sizes?.map((size: string[], index: number) =>
                    <Chip size="small" key={index} label={size[0] + 'x' + size[1]} variant="outlined" color="primary" sx={{ minWidth: '84px' }} />
                  )}
                </Stack>
              </TableCell>
              <TableCell variant="body">
                <Stack direction="row" sx={{ flexWrap: 'wrap', gap: '5px' }}>
                  {Array.from(new Set(adUnit.bids)).map((bid: any, index: number) =>
                    <Tooltip
                      PopperProps={{ disablePortal: true, }}
                      leaveDelay={0}
                      enterDelay={0}
                      title={JSON.stringify(bid.params, null, 4)}
                      key={index} >
                      <Chip size="small" label={bid.bidder} />
                    </Tooltip>
                  )}
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer >
  )
};

interface ISlotsComponentProps {
  prebid: IPrebidDetails;
}

export default SlotsComponent;
