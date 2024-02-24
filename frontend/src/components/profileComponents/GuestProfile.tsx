import { useEffect, useState } from "react";
import { fetchApi } from "../../lib/api";
import { getIdentity, logout } from "../../lib/utils";
import { Button } from "../ui/ui/button";
import { Label } from "../ui/ui/label";
import { Input } from "../ui/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/ui/dialog";
import { useNavigate } from "react-router-dom";

const getGuest = async (id: string) => {
  const response = await fetchApi("GET", `guests/${id}`);
  return response;
};
const putGuest = async (username: string, id: string) => {
  const response = await fetchApi("PUT", `guests/${id}`, { username });
  return response;
};
const deleteGuest = async (id: string) => {
  const response = await fetchApi("DELETE", `guests/${id}`);
  return response;
};

const GuestProfile = () => {
  const navigate = useNavigate();
  const userId: string | null = getIdentity();
  const [username, setUsername] = useState<string>("");

  const getUserInfo = async () => {
    if (!userId) return;
    const data = await getGuest(userId);
    if (!data) return;
    setUsername(data.username);
  };

  const handleUpdate = async () => {
    if (!userId) return;
    const data = await putGuest(username, userId);
    if (!data) return;
  };

  const handleDelete = async () => {
    if (!userId) return;
    const data = await deleteGuest(userId);
    if (!data) return;
    logout();
    navigate("/auth");
  };

  useEffect(() => {
    getUserInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="username">Username</Label>
        <Input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="flex gap-2 w-full mt-8">
        <Button className="w-1/2" onClick={handleUpdate}>
          Update
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive">Delete Profile</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Delete profile</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete your profile ? This action is
                definitive and cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button onClick={handleDelete} variant="destructive">
                  Yes
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default GuestProfile;
