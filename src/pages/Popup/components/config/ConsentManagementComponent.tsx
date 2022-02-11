import React, { useEffect } from 'react';
import { IPrebidDetails, IPrebidConfigConsentManagement } from '../../../../inject/scripts/prebid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ITcfDetails } from '../../../../inject/scripts/tcf';
import { TCString } from '@iabtcf/core';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import logger from '../../../../logger';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BusinessIcon from '@mui/icons-material/Business';
import { styled } from '@mui/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import ReactJson from 'react-json-view';
import Grid from '@mui/material/Grid';
import { tileHeight } from './ConfigComponent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
}));

const TcfComponent = ({ tcf, tcfKey }: TcfComponentProps): JSX.Element => {
  const [decodedTcfString, setDecodedTcfString] = React.useState({});
  useEffect(() => {
    const string = tcf[tcfKey]?.consentData || '';
    let decodedTcfString = {};
    try {
      decodedTcfString = TCString.decode(string, null);
    } catch (e) {}
    setDecodedTcfString(decodedTcfString);
  }, [tcf, tcfKey]);
  logger.log(`[PopUp][PriceGranularityComponent]: render `, tcf, tcfKey);
  return (
    <Box>
      <Typography variant="body2" color="text.secondary">
        <strong>Version:</strong> {tcfKey}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        <strong>CMP Loaded: </strong> <Checkbox checked={tcf[tcfKey]?.cmpLoaded || false}></Checkbox>
      </Typography>
      <Box sx={{ paddingBottom: 1 }}>
        <TextField
          label="Consent Data:"
          multiline
          variant="outlined"
          value={tcf[tcfKey]?.consentData ? tcf[tcfKey].consentData : 'no consent string found'}
          sx={{ width: 1 }}
        />
      </Box>
      <ReactJson
        src={decodedTcfString}
        name={false}
        collapsed={false}
        enableClipboard={false}
        displayObjectSize={false}
        displayDataTypes={false}
        sortKeys={false}
        quotesOnKeys={false}
        indentWidth={2}
        collapseStringsAfterLength={100}
        style={{ fontSize: '12px', fontFamily: 'roboto', padding: '5px' }}
      />
    </Box>
  );
};

const PrivacyComponent = ({ consentManagement, tcf }: IPrivacyComponentProps): JSX.Element => {
  const [expanded, setExpanded] = React.useState(false);
  const [maxWidth, setMaxWidth] = React.useState<4 | 12>(4);
  const ref = React.useRef<HTMLInputElement>(null);

  const handleExpandClick = () => {
    setExpanded(!expanded);
    setMaxWidth(expanded ? 4 : 12);
    setTimeout(() => ref.current.scrollIntoView({ behavior: 'smooth' }), 150);
  };
  logger.log(`[PopUp][PriceGranularityComponent]: render `, tcf);
  return (
    <Grid item xs={maxWidth} ref={ref}>
      <Card sx={{ width: 1, minHeight: tileHeight, border: '1px solid #0e86d4' }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: '#0e86d4' }} aria-label="recipe">
              <BusinessIcon />
            </Avatar>
          }
          title="Consent Management"
          subheader={`.consentManagement`}
          action={
            <ExpandMore expand={expanded} aria-expanded={expanded} aria-label="show more">
              <ExpandMoreIcon />
            </ExpandMore>
          }
          onClick={handleExpandClick}
        />
        <Collapse in={!expanded} timeout="auto" unmountOnExit>
          <CardContent>
            {consentManagement?.allowAuctionWithoutConsent !== undefined && (
              <Typography variant="body2" color="text.secondary">
                <strong>Allow Auction Without Consent:</strong>
                {consentManagement?.allowAuctionWithoutConsent ? 'true' : 'false'}
              </Typography>
            )}
            {consentManagement.cmpApi && (
              <Typography variant="body2" color="text.secondary">
                <strong>CMP Api: </strong>
                {String(consentManagement.cmpApi)}
              </Typography>
            )}
            <Typography variant="body2" color="text.secondary">
              <strong>Default GDPR Scope: </strong>
              {consentManagement.defaultGdprScope ? 'true' : 'false'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Timeout: </strong>
              {consentManagement.timeout ? consentManagement.timeout : consentManagement.gdpr?.timeout}
            </Typography>
          </CardContent>
        </Collapse>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          {consentManagement.gdpr && (
            <Box>
              <CardHeader>GDPR</CardHeader>
              <CardContent>
                {consentManagement.gdpr.cmpApi && (
                  <Typography variant="body2" color="text.secondary">
                    <strong>CmpApi:</strong> {consentManagement.gdpr.cmpApi}
                  </Typography>
                )}
                {consentManagement.gdpr.timeout && (
                  <Typography variant="body2" color="text.secondary">
                    <strong>Timeout:</strong> {consentManagement.gdpr.timeout}
                  </Typography>
                )}
                {consentManagement.gdpr.defaultGdprScope && (
                  <Typography variant="body2" color="text.secondary">
                    <strong>defaultGdprScope:</strong> {JSON.stringify(consentManagement.gdpr.defaultGdprScope)}
                  </Typography>
                )}
                {consentManagement.gdpr.allowAuctionWithoutConsent && (
                  <Typography variant="body2" color="text.secondary">
                    <strong>allowAuctionWithoutConsent:</strong> {consentManagement.gdpr.allowAuctionWithoutConsent}
                  </Typography>
                )}
              </CardContent>
              {consentManagement.gdpr.rules && (
                <CardContent>
                  <CardHeader title="GDPR Enforcement" />
                  {consentManagement.gdpr.rules && (
                    <React.Fragment>
                      {consentManagement.gdpr.rules.map((rule, index) => (
                        <List dense={true} key={index}>
                          <Typography>
                            <strong>Rules #{index}</strong>
                          </Typography>
                          {Object.keys(rule).map((key, index) => (
                            <ListItem key={index}>
                              {key}: {String(rule[key as keyof typeof rule])}
                            </ListItem>
                          ))}
                        </List>
                      ))}
                    </React.Fragment>
                  )}
                </CardContent>
              )}
            </Box>
          )}
          <CardHeader title="USP" />
          {consentManagement?.usp && (
            <CardContent>
              {consentManagement?.usp?.cmpApi && (
                <Typography>
                  <strong>CmpApi:</strong> {consentManagement.usp.cmpApi}
                </Typography>
              )}
              {consentManagement?.usp?.timeout && (
                <Typography>
                  <strong>Timeout:</strong> {consentManagement.usp.timeout}
                </Typography>
              )}
            </CardContent>
          )}
          <CardHeader title="GDPR Enforcement" />
          {consentManagement?.gdpr?.rules && (
            <Card sx={{ maxWidth: '200px' }}>
              <CardContent>
                {consentManagement?.gdpr?.rules && (
                  <React.Fragment>
                    {consentManagement.gdpr.rules.map((rule, index) => (
                      <List dense={true}>
                        <Typography>
                          <strong>Rules #{index}</strong>
                        </Typography>
                        {Object.keys(rule).map((key, index) => (
                          <ListItem key={index}>
                            {key}: {String(rule[key as keyof typeof rule])}
                          </ListItem>
                        ))}
                      </List>
                    ))}
                  </React.Fragment>
                )}
              </CardContent>
            </Card>
          )}
          <CardContent>
            {Object.keys(tcf).map((key, index) => (
              <TcfComponent key={index} tcf={tcf} tcfKey={key} />
            ))}
          </CardContent>
        </Collapse>
      </Card>
    </Grid>
  );
};

interface IPrivacyComponentProps {
  consentManagement: IPrebidConfigConsentManagement;
  tcf: ITcfDetails;
}

interface TcfComponentProps {
  tcf: ITcfDetails;
  tcfKey: string;
}

export default PrivacyComponent;
