import { Request, Response } from "express";
import { User, IUser } from "../models/users.model";
import { Guest } from "~/models/guests.model";
import { Channel } from "~/models/channels.model";

// GET /users
// Get all users
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json(error.message);
  }
};

// GET /users/:id
// Get a user
export const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user);
    return;
  } catch (error: any) {
    res.status(500).json(error.message);
  }
};

// POST /users
// Add a user
export const createUser = async (req: Request, res: Response) => {
  try {
    const { username, informations } = req.body;

    if (!username || !informations) {
      res.status(400).json({ message: "Missing field" });
      return;
    }

    const checkUsername = await User.findOne({ username: username });

    if (checkUsername) {
      res.status(400).json({ message: "Username already taken" });
      return;
    }

    const data: IUser = {
      username: username,
      channels: [],
      informations: informations,
      createdAt: new Date(),
    };

    const user = new User(data);
    const savedUser = await user.save();

    res.status(201).json(savedUser);
    return;
  } catch (error: any) {
    res.status(500).json(error.message);
  }
};

// PUT /users/:id
// Update a user informations
export const updateUser = async (req: Request, res: Response) => {
  interface IUserUpdate {
    username: string;
    informations: string;
  }

  try {
    const { id } = req.params;
    const { username, informations } = req.body;

    if (!username && !informations) {
      res.status(400).json({ message: "Missing field" });
      return;
    }

    const data = {} as IUserUpdate;

    if (username) {
      const checkUsername = await User.findOne({ username: username });
      const checkGuest = await Guest.findOne({ username: username });

      if (checkUsername || checkGuest) {
        res.status(400).json({ message: "Username already taken" });
        return;
      }

      data.username = username;
    }

    data.informations = informations;

    const user = await User.findByIdAndUpdate(id, data, { new: true });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json(error.message);
  }
};

// DELETE /users/:id
// Delete a user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    for (let i = 0; i < user.channels.length; i++) {
      const channel = await Channel.findById(user.channels[i]);

      if (!channel) {
        res.status(404).json({ message: "Channel not found" });
        return;
      }

      const channelIndex = channel.members.indexOf(user.username);

      if (channelIndex === -1) {
        res.status(404).json({ message: "User not found in channel" });
        return;
      }

      channel.members.splice(channelIndex, 1);
      await channel.save();
    }

    res.status(200).json({ message: "User deleted" });
  } catch (error: any) {
    res.status(500).json(error.message);
  }
};

// GET /users/:id/channels
// Get all user's channels
export const getUserChannels = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id, "channels");

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json(error.message);
  }
};

// POST /users/:id/channels
// Add a channel to user's channels
export const addUserChannel = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { channelId } = req.body;

    if (!channelId) {
      res.status(400).json({ message: "Missing field" });
      return;
    }

    const user = await User.findById(id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const channel = await Channel.findById(channelId);

    if (!channel) {
      res.status(404).json({ message: "Channel not found" });
      return;
    }

    user.channels.push(channelId);
    channel.members.push(user.username);
    const savedUser = await user.save();
    const savedChannel = await channel.save();

    res.status(200).json({ user: savedUser, channel: savedChannel });
  } catch (error: any) {
    res.status(500).json(error.message);
  }
};

// DELETE /users/:id/channels/:channelId
// Remove a channel from user's channels
export const removeUserChannel = async (req: Request, res: Response) => {
  try {
    const { id, channelId } = req.params;
    const user = await User.findById(id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const channel = await Channel.findById(channelId);

    if (!channel) {
      res.status(404).json({ message: "Channel not found" });
      return;
    }

    const userIndex = user.channels.indexOf(channelId);

    if (userIndex === -1) {
      res.status(404).json({ message: "Channel not found in user" });
      return;
    }

    const channelIndex = channel.members.indexOf(user.username);

    if (channelIndex === -1) {
      res.status(404).json({ message: "User not found in channel" });
      return;
    }

    user.channels.splice(userIndex, 1);
    channel.members.splice(channelIndex, 1);
    const savedUser = await user.save();
    const savedChannel = await channel.save();

    res.status(200).json({ user: savedUser, channel: savedChannel });
  } catch (error: any) {
    res.status(500).json(error.message);
  }
};
