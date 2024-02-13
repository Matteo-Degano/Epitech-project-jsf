export type ServerType = {
  _id: string
  name: string
  channels: Channels[]
  members: Members[]
};

export type Channels = {
  cid: number
};

export type Members = {
  uid: number
  role: string
};

export type UserType = {
  _id: string
  username: string
  informations: string
  channels: ChannelType[],
  createdAt: string
};

export type UserPostType = {
  username: string
  informations: string
  channels: ChannelType[],
  createdAt: string
};

export type GuestType = {
  _id: string
  username: string
  channels: ChannelType[]
  lastConnexion: string
}

export type GuestPostType = {
  _id: string
  username: string
  channels: ChannelType[]
  lastConnexion: string
}

export type ChannelType = {
  _id: string;
  name: string;
  visibility: string;
  members: string[];
};

export type ChannelPostType = {
  name: string;
  visibility: string;
  members: string[];
  guests: string[];
};

export type MessagesType = {
  _id: string;
  text: string | JSX.Element;
  channelId: string;
  authorId: string[];
  createdAt: string
};

export type MessagesPostType = {
  text: string | JSX.Element;
  channelId: string;
  authorId: string[];
  createdAt: string
};

