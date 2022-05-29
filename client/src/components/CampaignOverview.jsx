import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    Alert,
    Box,
    CircularProgress,
} from '@mui/material';
import { isEmpty } from 'ramda';

import { getCampaign } from '../actions/campaignActions';
import { usePrevious } from '../hooks/usePrevious';
import useDebouncedPending from '../hooks/useDebouncedPending';
import DMCampaignOverview from './DMCampaignOverview';
import PlayerCampaignOverview from './PlayerCampaignOverview';

const CampaignOverview = () => {
    const currentUser = useSelector(state => state.auth.currentUser);
    const campaignPending = useSelector(state => state.campaigns.campaignPending);
    const campaignData = useSelector(state => state.campaigns.campaignData);
    const campaignError = useSelector(state => state.campaigns.campaignError);

    const [isDM, setIsDM] = useState(campaignData?.createdBy === currentUser?._id);
    const [usersCharacter, setUsersCharacter] = useState(() =>
        campaignData?.characters?.find(character => character?._id === currentUser?._id && (character?.status === "active" || character?.status === "invited")) || {}
    );
    const [usersDeadCharacters, setUsersDeadCharacters] = useState(campaignData?.characters?.filter(character => character?.userId === currentUser?._id && character?.status === "dead"));
    const [pending, setPending] = useState(true);
    const [players, setPlayers] = useState(campaignData?.characters?.filter(character => character.status !== 'dead') || []);
    const [deadPlayers, setDeadPlayers] = useState(campaignData?.characters?.filter(character => character.status === 'dead') || []);

    const prevCampaignPending = usePrevious(campaignPending);

    const { id } = useParams();

    const dispatch = useDispatch();

    useEffect(() => {
        if (id) {
            dispatch(getCampaign(id));
        }
    }, []);

    useEffect(() => {
        if (!campaignPending && prevCampaignPending && campaignData) {
            setIsDM(campaignData?.createdBy === currentUser._id || false);
            setUsersCharacter(campaignData?.characters?.find(character => character?.userId === currentUser?._id && (character?.status === "active" || character?.status === "invited")) || {});
            setUsersDeadCharacters(campaignData?.characters?.filter(character => character?.userId === currentUser?._id && character?.status === "dead"));
            setPlayers(campaignData?.characters?.filter(character => character.status !== 'dead') || []);
            setDeadPlayers(campaignData?.characters?.filter(character => character.status === 'dead') || []);
        }
    }, [campaignPending, prevCampaignPending]);

    useDebouncedPending(setPending, [campaignPending]);

    if (pending) {
        return (
            <Box minHeight='calc(100vh - 7rem)' display='flex' justifyContent='center' alignItems='center'>
                <CircularProgress />
            </Box>
        )
    }

    if (!campaignPending && prevCampaignPending) {
        if (campaignError || isEmpty(campaignData)) {
            return (
                <Box minHeight='calc(100vh - 7rem)'>
                    <Alert severity="error">There was an issue fetching information for this campaign</Alert>
                </Box>
            )
        }
        if (!isDM && isEmpty(usersCharacter)) {
            return (
                <Box minHeight='calc(100vh - 7rem)'>
                    <Alert severity="error">Oh dear, it seems you don't have access to this campaign!</Alert>
                </Box>
            )
        }
    }

    return (
        <Box minHeight='calc(100vh - 7rem)' paddingBottom='4rem'>
            {isDM ? (
                <DMCampaignOverview
                    campaignData={campaignData}
                    players={players}
                    deadPlayers={deadPlayers}
                />
            ) : (
                <PlayerCampaignOverview
                    campaignData={campaignData}
                    players={players}
                    deadPlayers={deadPlayers}
                    usersCharacter={usersCharacter}
                    usersDeadCharacters={usersDeadCharacters}
                />
            )}
        </Box>
    )
}

export default CampaignOverview;