import React from 'react';
import { graphql } from 'react-apollo';
import findIndex from 'lodash/findIndex';
import { Redirect } from 'react-router-dom';

import Header from '../components/Header';
import Messages from '../components/Messages';
import SendMessage from '../components/SendMessage';
import AppLayout from '../components/AppLayout';
import Sidebar from '../containers/Sidebar';
import { allTeamsQuery } from '../graphql/team';
import MessageContainer from '../containers/MessageContainer';

const ViewTeam = ({ data: { loading, ownedTeams,myinvitedTeams }, match: { params: { teamId, channelId } } }) => {
  console.log(myinvitedTeams);
  if (loading) {
    return null;
  }

  const teams = [...ownedTeams,...myinvitedTeams];
  if (!teams.length) {
    return <Redirect to="/create-team" />;
  }

  const teamIdInteger = parseInt(teamId, 10);
  const teamIdx = teamIdInteger ? findIndex(teams, ['id', teamIdInteger]) : 0;
  const team = teamIdx === -1 ? teams[0]:teams[teamIdx];
  console.log(team);

  const channelIdInteger = parseInt(channelId, 10);
  const channelIdx = channelIdInteger ? findIndex(team.channels, ['id', channelIdInteger]) : 0;
  console.log('channelidx is : ' + channelIdx);
  const channel = channelIdx === -1 ? team.channels[0] : team.channels[channelIdx];

  return (
    <AppLayout>
      <Sidebar
        teams={teams.map(t => ({
          id: t.id,
          letter: t.name.charAt(0).toUpperCase(),
        }))}
        team={team}
      />
      {channel && <Header channelName={channel.name} />}
      {channel && (
        <Messages channelId={channel.id}>
          <ul className="message-list">
            <li />
            <li />
          </ul>
        </Messages>
      )}
      {channel && <MessageContainer channelId={channel.id} />}
      {channel && <SendMessage channelName={channel.name} channelId={channel.id} />}
    </AppLayout>
  );
};

export default graphql(allTeamsQuery)(ViewTeam);
