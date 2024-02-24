import { useEffect, useMemo, useState } from "react";
import { fetchApi } from "../../lib/api";
import { ChannelType, UserPostType } from "../../lib/type";
import ChannelCard from "../ChannelCard";
import { getIdentity, isUser } from "../../lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "../ui/ui/pagination";

const PublicChannel = () => {
  const [publicChannels, setPublicChannels] = useState<ChannelType[]>([]);
  const [userChannels, setUserChannels] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const pages = Math.ceil(publicChannels.length / 15);
  const items = useMemo(() => {
    const start = (page - 1) * 15;
    const end = start + 15;

    return publicChannels.slice(start, end);
  }, [page, publicChannels]);

  useEffect(() => {
    fetchPublicChannels()
      .then((data) => {
        setPublicChannels(data);
      })
      .catch((error: Error) => {
        console.error(error.message);
      });

    fetchUser()
      .then((data) => {
        setUserChannels(data);
      })
      .catch((error: Error) => {
        console.error(error.message);
      });
  }, []);

  const fetchPublicChannels = async (): Promise<ChannelType[]> => {
    const response = await fetchApi<ChannelType[]>(
      "GET",
      `channels?visibility=public`
    );
    return response.data;
  };

  const fetchUser = async (): Promise<string[]> => {
    const identity = getIdentity();

    const response = await fetchApi<UserPostType>(
      "GET",
      `${isUser() ? "users" : "guests"}/${identity}`
    );
    return response.data.channels;
  };

  const isChannelJoined = (channelId: string) => {
    for (let i = 0; i < userChannels.length; i++) {
      if (userChannels[i] === channelId) {
        return true;
      }
    }

    return false;
  };

  return (
    <>
      <p className="text-2xl my-4">Public Channels</p>
      <div className="container grid gap-3 mb-5">
        {items.map((channel, index) => (
          <ChannelCard
            key={index}
            channelId={channel._id}
            name={channel.name}
            membersCount={channel.members.length}
            isJoined={isChannelJoined(channel._id)}
          />
        ))}
        {pages > 1 ? (
          <>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage(page - 1 >= 1 ? page - 1 : page)}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPage(page + 1 <= pages ? page + 1 : page)}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </>
        ) : null}
      </div>
    </>
  );
};

export default PublicChannel;
